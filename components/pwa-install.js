// FILE: components/pwa-install.js
// Banner de instalación PWA inteligente — Android nativo + guía iOS

(function () {
  'use strict';

  const DISMISS_KEY    = 'pwa_ios_dismissed_at';
  const IOS_COOLDOWN   = 7 * 24 * 60 * 60 * 1000; // 7 días en ms
  const DELAY_MS       = 60_000; // 60 s antes de mostrar el banner

  let deferredPrompt = null;
  let bannerShown    = false;

  // ── Detectores ───────────────────────────────────────────────

  function isInstalled() {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    );
  }

  function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  }

  function isMobile() {
    return window.innerWidth < 768 ||
      /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  }

  function isSessionActive() {
    return document.body.classList.contains('session-active');
  }

  function iosDismissedRecently() {
    const ts = parseInt(localStorage.getItem(DISMISS_KEY) ?? '0', 10);
    return Date.now() - ts < IOS_COOLDOWN;
  }

  // ── Capturar evento nativo (Android Chrome) ──────────────────

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredPrompt = event;
    scheduleBanner();
  });

  window.addEventListener('appinstalled', () => {
    hideBanner();
    if (window.showToast) {
      showToast('¡App instalada!', 'Abre +500 AURA desde tu pantalla de inicio.', '🎉', 'success');
    }
  });

  // ── Programar la aparición ────────────────────────────────────

  function scheduleBanner() {
    if (isInstalled() || bannerShown || !isMobile()) return;
    if (sessionStorage.getItem('pwa_banner_shown')) return;

    setTimeout(() => {
      if (isSessionActive()) return; // No interrumpir sesión
      showBanner();
    }, DELAY_MS);
  }

  // iOS: activar tras carga si corresponde
  document.addEventListener('DOMContentLoaded', () => {
    if (isInstalled() || !isMobile()) return;
    if (isIOS() && !iosDismissedRecently()) {
      setTimeout(() => {
        if (!isSessionActive()) showIOSBanner();
      }, DELAY_MS);
    }
  });

  // ── Banner Android ────────────────────────────────────────────

  function showBanner() {
    if (bannerShown || !deferredPrompt) return;
    bannerShown = true;
    sessionStorage.setItem('pwa_banner_shown', '1');

    const banner = document.createElement('div');
    banner.id    = 'pwa-install-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Instalar aplicación');
    banner.style.cssText = `
      position: fixed; bottom: 0; left: 0; right: 0; z-index: 9998;
      background: #111118; border-top: 1px solid #7C3AED;
      padding: 16px; display: flex; align-items: center; gap: 12px;
      box-shadow: 0 -4px 24px rgba(124,58,237,.3);
      animation: slideUpBanner .35s cubic-bezier(.22,1,.36,1);
    `;
    banner.innerHTML = `
      <style>
        @keyframes slideUpBanner { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      </style>
      <div style="font-size:2rem;flex-shrink:0">🎯</div>
      <div style="flex:1">
        <p style="font-weight:700;font-size:.92rem;margin:0 0 2px;color:#F1F5F9">Instala +500 AURA</p>
        <p style="font-size:.78rem;color:#94A3B8;margin:0">Sin Play Store. Funciona offline.</p>
      </div>
      <button id="pwa-install-btn"
        style="background:#7C3AED;color:#fff;border:none;border-radius:8px;padding:10px 16px;font-weight:700;font-size:.85rem;cursor:pointer;flex-shrink:0;min-height:44px">
        Instalar
      </button>
      <button id="pwa-dismiss-btn" aria-label="Cerrar"
        style="background:none;border:none;color:#64748B;font-size:1.3rem;cursor:pointer;padding:8px;min-width:44px;min-height:44px">
        ✕
      </button>`;

    document.body.appendChild(banner);

    document.getElementById('pwa-install-btn').addEventListener('click', async () => {
      hideBanner();
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('[AURA PWA] Resultado instalación:', outcome);
      deferredPrompt = null;
    });

    document.getElementById('pwa-dismiss-btn').addEventListener('click', hideBanner);
  }

  // ── Banner iOS ────────────────────────────────────────────────

  function showIOSBanner() {
    if (bannerShown) return;
    bannerShown = true;
    sessionStorage.setItem('pwa_banner_shown', '1');

    const isIpad = /iPad/.test(navigator.userAgent);

    const banner = document.createElement('div');
    banner.id    = 'pwa-install-banner';
    banner.setAttribute('role', 'dialog');
    banner.style.cssText = `
      position: fixed; ${isIpad ? 'top:0' : 'bottom:0'}; left: 0; right: 0; z-index: 9998;
      background: #111118; border-${isIpad ? 'bottom' : 'top'}: 1px solid #7C3AED;
      padding: 16px 20px;
      box-shadow: 0 ${isIpad ? '4' : '-4'}px 24px rgba(124,58,237,.3);
      animation: slideUpBanner .35s cubic-bezier(.22,1,.36,1);
    `;
    banner.innerHTML = `
      <style>
        @keyframes slideUpBanner { from { transform: translateY(${isIpad ? '-' : ''}100%); opacity:0; } to { transform:translateY(0); opacity:1; } }
        .ios-step { display:flex; align-items:center; gap:10px; margin-bottom:10px; font-size:.84rem; color:#CBD5E1; }
        .ios-step-num { width:22px; height:22px; border-radius:50%; background:#7C3AED; color:#fff; font-size:.72rem; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
      </style>
      <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px">
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:1.8rem">🎯</span>
          <div>
            <p style="font-weight:700;font-size:.9rem;margin:0 0 2px;color:#F1F5F9">Instala +500 AURA</p>
            <p style="font-size:.72rem;color:#94A3B8;margin:0">Agrégala a tu pantalla de inicio</p>
          </div>
        </div>
        <button id="pwa-dismiss-btn" aria-label="Cerrar"
          style="background:none;border:none;color:#64748B;font-size:1.2rem;cursor:pointer;padding:4px 8px;min-width:44px;min-height:44px">✕</button>
      </div>
      <div class="ios-step">
        <span class="ios-step-num">1</span>
        <span>Toca el botón <strong style="color:#3B82F6">Compartir</strong> <span style="font-size:1.1em">⬆️</span> en Safari</span>
      </div>
      <div class="ios-step">
        <span class="ios-step-num">2</span>
        <span>Selecciona <strong style="color:#F1F5F9">"Añadir a pantalla de inicio"</strong></span>
      </div>
      <div class="ios-step" style="margin-bottom:0">
        <span class="ios-step-num">3</span>
        <span>Toca <strong style="color:#10B981">Añadir</strong> — sin App Store ni descargas 🎉</span>
      </div>`;

    document.body.appendChild(banner);

    document.getElementById('pwa-dismiss-btn').addEventListener('click', () => {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
      hideBanner();
    });
  }

  // ── Ocultar ───────────────────────────────────────────────────

  function hideBanner() {
    const banner = document.getElementById('pwa-install-banner');
    if (!banner) return;
    banner.style.transition = 'transform .25s ease, opacity .25s ease';
    banner.style.transform  = 'translateY(100%)';
    banner.style.opacity    = '0';
    setTimeout(() => banner.remove(), 280);
  }

})();
