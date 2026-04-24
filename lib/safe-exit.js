// FILE: lib/safe-exit.js
// Depende de: supabase (global), STATE (global de app.js),
//             saveSessionToStorage y renderDashboard (globales de app.js)

window.SafeExit = (() => {
  'use strict';

  const MODAL_ID  = 'safe-exit-modal';
  const BTN_ID    = 'safe-exit-btn';

  // ── Botón fijo (visible siempre durante sesión) ─────────────────
  function _injectButton() {
    if (document.getElementById(BTN_ID)) return;
    const btn = document.createElement('button');
    btn.id        = BTN_ID;
    btn.className = 'safe-exit-btn';
    btn.setAttribute('aria-label', 'Salir de la sesión');
    btn.innerHTML = `<span class="safe-exit-icon">🏠</span><span class="safe-exit-label">Salir</span>`;
    btn.addEventListener('click', show);
    document.body.appendChild(btn);
  }

  function _removeButton() {
    document.getElementById(BTN_ID)?.remove();
  }

  // ── Modal de confirmación ───────────────────────────────────────
  function _injectModal() {
    if (document.getElementById(MODAL_ID)) return;
    const el = document.createElement('div');
    el.id        = MODAL_ID;
    el.className = 'safe-exit-overlay';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-labelledby', 'se-title');
    el.innerHTML = `
      <div class="safe-exit-card">
        <div class="safe-exit-guardian-icon" aria-hidden="true">🛡️</div>
        <h2 id="se-title" class="safe-exit-title">
          ¿Seguro que quieres pausar tu entrenamiento?
        </h2>
        <p class="safe-exit-body">
          El progreso de esta sesión se guardará,<br>
          pero tu Guardián perderá un poco de energía por el retiro.
        </p>
        <div class="safe-exit-actions">
          <button class="btn btn--primary" id="se-continue">Continuar Entrenando</button>
          <button class="btn btn--ghost"   id="se-leave">Salir al Menú</button>
        </div>
      </div>`;
    el.addEventListener('keydown', e => { if (e.key === 'Escape') hide(); });
    document.body.appendChild(el);
    document.getElementById('se-continue').addEventListener('click', hide);
  }

  // ── Penalización de energía del guardián ───────────────────────
  async function _penalizeEnergy(userId, points) {
    try {
      const { data: g } = await supabase
        .from('estado_guardian')
        .select('nivel_energia')
        .eq('id_usuario', userId)
        .single();
      if (!g) return null;

      const after  = Math.max(0, g.nivel_energia - points);
      const estado = after <= 0 ? 'petrificado' : after <= 25 ? 'critico' : 'activo';
      await supabase.from('estado_guardian')
        .update({ nivel_energia: after, estado })
        .eq('id_usuario', userId);

      return { before: g.nivel_energia, after };
    } catch (e) {
      console.error('[SafeExit] penalizeEnergy:', e);
      return null;
    }
  }

  // ── Animación de descanso del guardián (Sistema 4) ─────────────
  function _animateResting(energyBefore, energyAfter) {
    return new Promise(resolve => {
      const overlay = document.createElement('div');
      overlay.className = 'guardian-resting-overlay';

      const particles = Array.from({ length: 6 }, (_, i) =>
        `<span class="energy-particle" style="left:${15 + i * 13}%;animation-delay:${(i * 0.18).toFixed(2)}s">⚡</span>`
      ).join('');

      const pct = energyAfter ?? 75;
      overlay.innerHTML = `
        <div class="guardian-resting-card">
          <div class="guardian--resting" aria-hidden="true">🛡️</div>
          <p class="guardian-resting-text">Tu Guardián descansa... Vuelve pronto.</p>
          <div class="guardian-energy-wrap">
            <div class="guardian-energy-track">
              <div class="guardian-energy-fill" id="gr-fill"
                   style="width:${energyBefore ?? 100}%"></div>
            </div>
            <span class="guardian-energy-label" id="gr-label">
              ${energyAfter ?? '—'} energía
            </span>
          </div>
          <div class="energy-particles-wrap" aria-hidden="true">${particles}</div>
        </div>`;

      document.body.appendChild(overlay);

      // Animar barra bajando tras un frame
      requestAnimationFrame(() => {
        const fill = document.getElementById('gr-fill');
        if (fill) {
          fill.style.transition = 'width 1.2s ease-out';
          fill.style.width      = `${pct}%`;
        }
      });

      setTimeout(() => { overlay.remove(); resolve(); }, 1800);
    });
  }

  // ── API pública ─────────────────────────────────────────────────

  function init() {
    _injectButton();
    _injectModal();
    // Reconectar handler de confirmación en cada init (STATE puede haber cambiado)
    const leaveBtn = document.getElementById('se-leave');
    if (leaveBtn) {
      leaveBtn.replaceWith(leaveBtn.cloneNode(true)); // limpia listeners viejos
      document.getElementById('se-leave').addEventListener('click', confirm);
    }
  }

  function show() {
    const modal = document.getElementById(MODAL_ID);
    if (!modal) return;
    modal.classList.add('visible');
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('se-continue')?.focus(), 50);
  }

  function hide() {
    document.getElementById(MODAL_ID)?.classList.remove('visible');
    document.body.style.overflow = '';
  }

  async function confirm() {
    const leaveBtn = document.getElementById('se-leave');
    if (leaveBtn) { leaveBtn.disabled = true; leaveBtn.textContent = 'Guardando…'; }

    // 1. Guardar progreso (localStorage ya existe en app.js)
    if (typeof saveSessionToStorage === 'function') saveSessionToStorage();

    // 2. Penalizar guardián
    const userId = window.STATE?.guardianUserId;
    const result = userId ? await _penalizeEnergy(userId, 5) : null;

    // 3. Cerrar modal
    hide();

    // 4. Animación
    await _animateResting(result?.before, result?.after);

    // 5. Limpiar estado (sin reload)
    if (typeof clearSavedSession === 'function') clearSavedSession();
    if (window.SessionPersistence && window.STATE?.student?.id) {
      await window.SessionPersistence.clearDraft(window.STATE.student.id).catch(() => {});
    }
    destroy();

    // 6. Volver al dashboard
    if (typeof renderDashboard === 'function') renderDashboard();
  }

  function destroy() {
    _removeButton();
    document.getElementById(MODAL_ID)?.remove();
    document.body.style.overflow = '';
  }

  return { init, show, hide, confirm, destroy };
})();
