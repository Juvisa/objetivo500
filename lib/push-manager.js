// lib/push-manager.js — Gestión de Push Notifications
// Objetivo 500 · Vanilla JS · sin dependencias externas
// ──────────────────────────────────────────────────────
// Expone window.PushManager500 para no colisionar con la API nativa PushManager.
//
// Uso desde app.html:
//   PushManager500.init(userId);

const PushManager500 = (() => {

  // La VAPID public key se lee desde una meta tag para no hardcodearla:
  // <meta name="vapid-public-key" content="...">
  function _getVapidKey() {
    const meta = document.querySelector('meta[name="vapid-public-key"]');
    return meta ? meta.content : null;
  }

  /** Convierte la VAPID public key de Base64url a Uint8Array */
  function _urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64  = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
  }

  /** Devuelve true si el navegador soporta push notifications. */
  function isSupported() {
    return 'Notification' in window &&
           'serviceWorker' in navigator &&
           'PushManager' in window;
  }

  /** Estado actual del permiso: 'granted' | 'denied' | 'default' */
  function getPermission() {
    return Notification.permission;
  }

  /**
   * Solicita permiso al usuario y crea la suscripción push.
   * Guarda la suscripción en Supabase.
   * @param {string} userId — auth.users.id del estudiante
   * @returns {Promise<'subscribed'|'denied'|'error'|'unsupported'>}
   */
  async function requestPermission(userId) {
    if (!isSupported()) return 'unsupported';

    // Pedir permiso al navegador
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return 'denied';

    try {
      const reg = await navigator.serviceWorker.ready;
      const vapidKey = _getVapidKey();
      if (!vapidKey) {
        console.warn('[PushManager500] VAPID public key no encontrada en meta tag');
        return 'error';
      }

      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly:      true,
        applicationServerKey: _urlBase64ToUint8Array(vapidKey),
      });

      // Guardar en Supabase
      const { error } = await supabase
        .from('push_subscriptions')
        .upsert({
          user_id:      userId,
          subscription: subscription.toJSON(),
          activa:       true,
        }, { onConflict: 'user_id' });

      if (error) {
        console.error('[PushManager500] Error guardando suscripción:', error.message);
        return 'error';
      }

      console.log('[PushManager500] Suscripción guardada correctamente');
      return 'subscribed';

    } catch (err) {
      console.error('[PushManager500] Error al suscribirse:', err);
      return 'error';
    }
  }

  /**
   * Cancela la suscripción push del usuario.
   * @param {string} userId
   */
  async function unsubscribe(userId) {
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) await sub.unsubscribe();

      await supabase
        .from('push_subscriptions')
        .update({ activa: false })
        .eq('user_id', userId);

      return true;
    } catch (err) {
      console.error('[PushManager500] Error al cancelar suscripción:', err);
      return false;
    }
  }

  /**
   * Verifica si el usuario ya tiene una suscripción activa en Supabase.
   * @param {string} userId
   */
  async function isSubscribed(userId) {
    if (!isSupported()) return false;
    const { data } = await supabase
      .from('push_subscriptions')
      .select('activa')
      .eq('user_id', userId)
      .maybeSingle();
    return data?.activa === true;
  }

  /**
   * Inicializa el botón de notificaciones en el header.
   * Crea el botón 🔔 y gestiona su estado.
   * @param {string} userId
   */
  async function init(userId) {
    if (!isSupported()) return;

    // Contenedor donde insertar el botón (junto al botón de audio)
    const actionsEl = document.getElementById('header-user');
    if (!actionsEl) return;

    const subscribed     = await isSubscribed(userId);
    const permDenied     = getPermission() === 'denied';
    const btn            = document.createElement('button');
    btn.id               = 'push-notif-btn';
    btn.className        = 'btn btn--ghost btn--sm push-notif-btn';
    btn.setAttribute('aria-label', subscribed ? 'Cancelar notificaciones' : 'Activar notificaciones');
    btn.setAttribute('title',      subscribed ? 'Notificaciones activas — toca para desactivar' : permDenied ? 'Notificaciones bloqueadas en tu navegador' : 'Activar recordatorios de estudio');
    btn.setAttribute('data-no-sound', '');
    btn.innerHTML = `<span class="push-notif-icon">${subscribed ? '🔔' : '🔕'}</span>`;
    btn.disabled  = permDenied;

    btn.addEventListener('click', async () => {
      btn.disabled = true;
      if (subscribed) {
        const ok = await unsubscribe(userId);
        if (ok) {
          btn.querySelector('.push-notif-icon').textContent = '🔕';
          btn.setAttribute('title', 'Activar recordatorios de estudio');
          btn.setAttribute('aria-label', 'Activar notificaciones');
          showToast('Notificaciones desactivadas', 'Ya no recibirás recordatorios', '🔕', 'xp');
        }
      } else {
        const result = await requestPermission(userId);
        if (result === 'subscribed') {
          btn.querySelector('.push-notif-icon').textContent = '🔔';
          btn.setAttribute('title', 'Notificaciones activas — toca para desactivar');
          btn.setAttribute('aria-label', 'Cancelar notificaciones');
          showToast('¡Notificaciones activadas!', 'Te avisaremos 3 veces al día para estudiar 🎯', '🔔', 'xp');
        } else if (result === 'denied') {
          showToast('Permiso denegado', 'Activa las notificaciones en la configuración de tu navegador', '🔕', 'error');
        } else {
          showToast('Error', 'No se pudo activar las notificaciones. Intenta de nuevo.', '⚠️', 'error');
        }
      }
      btn.disabled = false;
    });

    // Insertar el botón antes del botón de audio
    const audioBtn = document.getElementById('audio-toggle');
    if (audioBtn) {
      audioBtn.parentElement.insertBefore(btn, audioBtn);
    } else {
      actionsEl.prepend(btn);
    }
  }

  return { init, isSupported, getPermission, requestPermission, unsubscribe, isSubscribed };
})();

window.PushManager500 = PushManager500;
