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

  async function consume(code, userId) {
    if (!code || !userId) return { ok: false, error: 'Parámetros faltantes.' };
    const { data, error } = await supabase.rpc('use_invite_code', {
      p_code:    code.toUpperCase().trim(),
      p_user_id: userId,
    });
    if (error) return { ok: false, error: error.message };
    if (data?.ok) markUsed(code);
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

  return { getCodeFromURL, validate, consume, consumePending, initRegisterFlow, badgeHTML };
})();
