// FILE: lib/invite-codes.js
// Sistema de acceso controlado por invite codes — testers y acceso VIP.
// Depende de: supabase (global)

window.InviteCodes = (() => {
  'use strict';

  const STORAGE_KEY  = 'aura_invite_used';
  const PARAM_KEY    = 'invite';

  // ── Leer código de la URL (?invite=AURA-BETA-01) ─────────────

  function getCodeFromURL() {
    return new URLSearchParams(window.location.search).get(PARAM_KEY)?.toUpperCase().trim() ?? null;
  }

  // ── Persistir que ya se usó (evitar re-envío en recargas) ────

  function markUsed(code) {
    localStorage.setItem(STORAGE_KEY, code);
  }

  function wasUsed() {
    return !!localStorage.getItem(STORAGE_KEY);
  }

  // ── Validar sin consumir (para mostrar badge en el formulario) ─

  async function validate(code) {
    if (!code) return null;
    const { data, error } = await supabase
      .from('invite_codes')
      .select('id, label, role')
      .eq('code', code.toUpperCase().trim())
      .maybeSingle();
    if (error || !data) return null;
    return data;  // { id, label, role }
  }

  // ── Consumir el código (llamar después de que el usuario crea su perfil) ─

  // Mapeo: el role que devuelve el RPC → slug del plan en la tabla plans
  const ROLE_TO_PLAN = { tester: 'elite', premium: 'elite', elite: 'elite', familia: 'familia' };

  async function consume(code, userId) {
    if (!code || !userId) return { ok: false, error: 'Parámetros faltantes.' };
    const { data, error } = await supabase.rpc('use_invite_code', {
      p_code:    code.toUpperCase().trim(),
      p_user_id: userId,
    });
    if (error) return { ok: false, error: error.message };

    if (data?.ok) {
      markUsed(code);

      const planSlug = ROLE_TO_PLAN[data.role] ?? 'elite';

      // 1. Actualizar profiles.role (subscription_tier no existe en esta tabla)
      await supabase
        .from('profiles')
        .update({ role: planSlug })
        .eq('user_id', userId)
        .catch(e => console.warn('[InviteCodes] profiles update:', e.message));

      // 2. El RPC use_invite_code ya crea la subscription (migration 014).
      //    Si el RPC es viejo, intentamos upsert desde el cliente como fallback.
      //    parent_id = profiles.id (NO user_id — ver migration 002)
      const { data: profileRow } = await supabase
        .from('profiles').select('id').eq('user_id', userId).maybeSingle();
      const { data: planRow } = await supabase
        .from('plans').select('id').eq('slug', planSlug).maybeSingle();

      if (profileRow?.id && planRow?.id) {
        await supabase.from('subscriptions').insert({
          parent_id:   profileRow.id,
          plan_id:     planRow.id,
          status:      'active',
          gateway:     'invite_code',
          gateway_ref: code.toUpperCase().trim(),
        }).catch(() => {
          // Si falla por duplicado o RLS, el RPC ya lo manejó — ignorar
        });
      }

      // 3. Refrescar JWT
      await supabase.auth.refreshSession()
        .catch(e => console.warn('[InviteCodes] refreshSession:', e.message));

      // 4. Invalidar caché del plan (5 min TTL)
      if (window.Plans) Plans.invalidateCache();
    }

    return data ?? { ok: false, error: 'Sin respuesta del servidor.' };
  }

  // ── UI: badge VIP en el formulario de registro ───────────────

  function badgeHTML(codeInfo) {
    if (!codeInfo) return '';
    const roleLabel = codeInfo.role === 'tester' ? '⚡ Acceso Tester' : '🎁 Acceso VIP';
    return `
      <div style="
        display:flex;align-items:center;gap:8px;
        background:rgba(124,58,237,.15);border:1px solid rgba(124,58,237,.4);
        border-radius:8px;padding:10px 14px;margin-bottom:var(--space-4)">
        <span style="font-size:1.1rem">${codeInfo.role === 'tester' ? '⚡' : '🎁'}</span>
        <div>
          <p style="font-weight:700;font-size:.85rem;margin:0;color:#C4B5FD">${roleLabel}</p>
          <p style="font-size:.75rem;color:#A78BFA;margin:0">${codeInfo.label ?? 'Código verificado'}</p>
        </div>
        <span style="margin-left:auto;color:#10B981;font-size:.8rem;font-weight:600">✓ Válido</span>
      </div>`;
  }

  // ── Flujo completo para la página de registro/login ──────────
  // Llama a esto en el DOMContentLoaded de login.html.
  // Si hay ?invite=CODE en la URL: valida, muestra badge, y guarda para uso post-registro.

  async function initRegisterFlow(formSelector) {
    const code = getCodeFromURL();
    if (!code) return;

    const form = document.querySelector(formSelector);
    if (!form) return;

    const info = await validate(code);
    if (!info) {
      console.warn('[InviteCodes] Código inválido o agotado:', code);
      return;
    }

    // Insertar badge antes del primer campo del formulario
    const badge = document.createElement('div');
    badge.innerHTML = badgeHTML(info);
    form.insertBefore(badge.firstElementChild, form.firstElementChild);

    // Guardar en sessionStorage para consumirlo después del registro
    sessionStorage.setItem('pending_invite', code);
  }

  // Llamar después de que el usuario se registra y su profile_id está disponible
  async function consumePending(userId) {
    const code = sessionStorage.getItem('pending_invite');
    if (!code || wasUsed()) return null;
    sessionStorage.removeItem('pending_invite');
    return await consume(code, userId);
  }

  // ── Modal de canje para usuarios ya registrados ─────────────
  // Llamar con el user_id de auth (profile.user_id / session.user.id).

  function openRedeemModal(authUserId) {
    document.getElementById('invite-redeem-modal')?.remove();

    const overlay = document.createElement('div');
    overlay.id = 'invite-redeem-modal';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:10001;background:rgba(0,0,0,.8);display:flex;align-items:center;justify-content:center;padding:16px';
    overlay.innerHTML = `
      <div style="background:var(--bg-elevated);border:1px solid rgba(124,58,237,.5);border-radius:var(--radius-xl);padding:var(--space-8) var(--space-6);max-width:380px;width:100%;text-align:center">
        <div style="font-size:2.2rem;margin-bottom:var(--space-3)">🎟</div>
        <h2 style="font-size:1.1rem;font-weight:800;margin-bottom:var(--space-2);color:var(--text-primary)">Canjear código</h2>
        <p style="color:var(--text-secondary);font-size:.85rem;margin-bottom:var(--space-5)">
          Ingresa tu código de acceso AURA para activar el rol Tester.
        </p>
        <input id="invite-code-input"
          type="text"
          placeholder="AURA-BETA-XX"
          autocomplete="off"
          style="width:100%;padding:12px 14px;background:var(--bg-overlay);border:1px solid var(--border-light);border-radius:var(--radius-md);color:var(--text-primary);font-size:1rem;margin-bottom:var(--space-4);box-sizing:border-box;text-align:center;letter-spacing:.1em;text-transform:uppercase"
        />
        <div id="invite-redeem-feedback" style="min-height:20px;margin-bottom:var(--space-3);font-size:.82rem"></div>
        <button id="invite-redeem-btn" onclick="InviteCodes._submitRedeem('${authUserId}')"
          class="btn btn--primary" style="width:100%;margin-bottom:var(--space-2)">
          Activar acceso
        </button>
        <button onclick="document.getElementById('invite-redeem-modal').remove()"
          style="background:none;border:none;color:var(--text-muted);font-size:.82rem;cursor:pointer">
          Cancelar
        </button>
      </div>`;

    // Enter key submits
    overlay.addEventListener('keydown', e => {
      if (e.key === 'Enter') InviteCodes._submitRedeem(authUserId);
    });

    document.body.appendChild(overlay);
    setTimeout(() => document.getElementById('invite-code-input')?.focus(), 50);
  }

  InviteCodes._submitRedeem = async function(authUserId) {
    const input = document.getElementById('invite-code-input');
    const fb    = document.getElementById('invite-redeem-feedback');
    const btn   = document.getElementById('invite-redeem-btn');
    const code  = input?.value?.toUpperCase().trim();

    if (!code) { if (fb) fb.textContent = 'Escribe el código primero.'; return; }
    if (btn)   { btn.disabled = true; btn.textContent = 'Verificando…'; }
    if (fb)    { fb.textContent = ''; }

    const result = await consume(code, authUserId);

    if (btn) { btn.disabled = false; btn.textContent = 'Activar acceso'; }

    if (result?.ok) {
      document.getElementById('invite-redeem-modal')?.remove();
      if (window.showToast) {
        showToast('¡Acceso activado! 🎟', result.label ?? 'Rol Tester habilitado.', '⚡', 'success');
      }
      // Recargar perfil para reflejar el nuevo rol
      setTimeout(() => window.location.reload(), 1500);
    } else {
      if (fb) {
        fb.style.color = '#EF4444';
        fb.textContent = result?.error ?? 'Código inválido.';
      }
      input?.select();
    }
  };

  return { getCodeFromURL, validate, consume, consumePending, initRegisterFlow, badgeHTML, openRedeemModal };
})();
