// FILE: components/checkout.js
// Pantalla de checkout con campo de cupón integrado.
// Depende de: InviteCodes (global), Plans (global), STATE (app.js global)

window.Checkout = (() => {
  'use strict';

  const PLANS = {
    elite: {
      slug:      'elite',
      name:      'Plan Élite',
      price_cop: 29900,
      hotmart_url: '#',  // TODO: reemplazar con URL real de Hotmart
      mp_url:      '#',  // TODO: reemplazar con URL real de MercadoPago
    },
    familia: {
      slug:      'familia',
      name:      'Plan Familia',
      price_cop: 49900,
      hotmart_url: '#',
      mp_url:      '#',
    },
  };

  // Llama use_invite_code via InviteCodes.consume() y normaliza la respuesta
  async function redeemInviteCode(code, userId) {
    if (!window.InviteCodes) return { success: false, error: 'Sistema de códigos no disponible.' };
    const result = await InviteCodes.consume(code, userId);
    if (result?.ok) {
      // Invalidar caché del plan para reflejar nuevo rol
      if (window.Plans) Plans.invalidateCache();
      return { success: true, role: result.role ?? 'tester', label: result.label ?? '' };
    }
    return { success: false, error: result?.error ?? 'Código inválido o ya agotado.' };
  }

  function _renderHTML(plan) {
    return `
    <div id="checkout-screen" class="checkout-screen"
         role="dialog" aria-modal="true" aria-label="Plan ${plan.name}">
      <button class="checkout-close" id="checkout-close" aria-label="Cerrar">✕</button>

      <p class="checkout-tag">${plan.slug === 'familia' ? 'PLAN FAMILIA' : 'PLAN ÉLITE'}</p>
      <h2 class="checkout-plan-name">${plan.name}</h2>

      <div class="checkout-price-block" id="checkout-price-block">
        <span class="checkout-currency">COP</span>
        <span class="checkout-amount" id="checkout-amount">${plan.price_cop.toLocaleString('es-CO')}</span>
        <span class="checkout-period">/mes</span>
      </div>

      <ul class="checkout-features">
        <li>✓ Preguntas ilimitadas</li>
        <li>✓ Simulacros completos con análisis</li>
        <li>✓ Dashboard del padre con métricas</li>
        <li>✓ Guardián evoluciona hasta Leyenda 500</li>
        <li>✓ Predicción de puntaje ICFES en tiempo real</li>
        <li>✓ Modo Batalla contra otros estudiantes</li>
        <li>✓ Certificados descargables</li>
        ${plan.slug === 'familia' ? '<li>✓ Comparativa entre hermanos</li>' : ''}
      </ul>

      <div class="checkout-payment-btns" id="checkout-payment-btns">
        <button class="btn-checkout-primary" id="btn-hotmart">
          💳 Pagar con tarjeta
        </button>
        <button class="btn-checkout-secondary" id="btn-mp">
          🟦 Pagar con MercadoPago
        </button>
      </div>

      <div class="checkout-divider"><span>o</span></div>

      <div class="checkout-coupon-section">
        <p class="checkout-coupon-label">¿Tienes un código de acceso o cupón?</p>
        <div class="checkout-coupon-field" id="coupon-field">
          <input
            type="text"
            id="coupon-input"
            class="coupon-input"
            placeholder="AURA-BETA-XX"
            maxlength="20"
            autocapitalize="characters"
            autocomplete="off"
            spellcheck="false"
            aria-label="Código de acceso VIP o cupón">
          <button id="coupon-apply-btn" class="coupon-apply-btn">Aplicar</button>
        </div>
        <div id="coupon-status" class="coupon-status" aria-live="polite"></div>
      </div>
    </div>
    <div id="checkout-backdrop" class="checkout-backdrop"></div>`;
  }

  function _initLogic(plan, userId) {
    // Botones de pago
    document.getElementById('btn-hotmart')?.addEventListener('click', () => {
      if (plan.hotmart_url !== '#') window.open(plan.hotmart_url, '_blank');
      else if (window.showToast) showToast('Próximamente', 'Los pagos estarán disponibles pronto.', '💳', 'info');
    });
    document.getElementById('btn-mp')?.addEventListener('click', () => {
      if (plan.mp_url !== '#') window.open(plan.mp_url, '_blank');
      else if (window.showToast) showToast('Próximamente', 'Los pagos estarán disponibles pronto.', '🟦', 'info');
    });

    // Lógica del cupón
    const input    = document.getElementById('coupon-input');
    const applyBtn = document.getElementById('coupon-apply-btn');
    const status   = document.getElementById('coupon-status');

    // Auto-formato XXXX-XXXX-XX mientras escribe
    input?.addEventListener('input', e => {
      const raw   = e.target.value.replace(/[^A-Z0-9a-z]/g, '').toUpperCase();
      const parts = [raw.slice(0, 4), raw.slice(4, 8), raw.slice(8, 12)].filter(Boolean);
      e.target.value = parts.join('-').slice(0, 14);
    });

    input?.addEventListener('keydown', e => {
      if (e.key === 'Enter') applyBtn?.click();
    });

    applyBtn?.addEventListener('click', async () => {
      const code = input?.value?.trim();
      if (!code || code.length < 4) {
        _setStatus(status, 'Ingresa un código válido.', 'error');
        return;
      }

      _setStatus(status, 'Verificando código…', 'loading');
      applyBtn.disabled    = true;
      applyBtn.textContent = '…';

      const result = await redeemInviteCode(code, userId);

      applyBtn.disabled    = false;
      applyBtn.textContent = 'Aplicar';

      if (result.success) {
        _showSuccess(result, status);
      } else {
        _setStatus(status, result.error, 'error');
        input?.select();
      }
    });
  }

  function _setStatus(el, msg, type) {
    if (!el) return;
    el.textContent = msg;
    el.className   = `coupon-status coupon-status--${type}`;
  }

  function _showSuccess(result, statusEl) {
    // Tachar precio
    const priceBlock  = document.getElementById('checkout-price-block');
    const paymentBtns = document.getElementById('checkout-payment-btns');
    const couponField = document.getElementById('coupon-field');
    const applyBtn    = document.getElementById('coupon-apply-btn');
    const input       = document.getElementById('coupon-input');

    priceBlock?.classList.add('checkout-price--struck');
    priceBlock?.insertAdjacentHTML('beforeend',
      `<span class="checkout-free-badge">GRATIS</span>`);

    if (paymentBtns) paymentBtns.style.display = 'none';
    if (input)       input.disabled    = true;
    if (applyBtn)    applyBtn.disabled = true;
    couponField?.classList.add('coupon-field--locked');

    _setStatus(statusEl, '🎉 ¡Código aplicado! Bienvenido a la experiencia completa.', 'success');

    // Botón de continuar
    const divider = document.querySelector('.checkout-divider');
    divider?.insertAdjacentHTML('beforebegin', `
      <button class="btn-checkout-primary btn-checkout-primary--success" id="btn-continue-vip">
        ✓ Continuar con acceso ${(result.role ?? 'tester').toUpperCase()}
      </button>`);

    document.getElementById('btn-continue-vip')?.addEventListener('click', () => {
      close();
      if (window.showToast) showToast('¡Acceso activado! 🎟', result.label || 'Rol Tester habilitado.', '⚡', 'success');
      setTimeout(() => window.location.reload(), 1200);
    });

    if (window.AudioEvents) AudioEvents.onLevelUp?.();
  }

  function open(planSlug = 'elite') {
    const plan = PLANS[planSlug];
    if (!plan) return;

    // Obtener userId del estado global de app.js
    const userId = window.STATE?.profile?.user_id;
    if (!userId) {
      if (window.showToast) showToast('Sesión requerida', 'Inicia sesión para continuar.', '🔒', 'error');
      return;
    }

    document.getElementById('checkout-screen')?.remove();
    document.getElementById('checkout-backdrop')?.remove();

    document.body.insertAdjacentHTML('beforeend', _renderHTML(plan));

    requestAnimationFrame(() => {
      document.getElementById('checkout-screen')?.classList.add('checkout-screen--visible');
      document.getElementById('checkout-backdrop')?.classList.add('checkout-backdrop--visible');
    });

    _initLogic(plan, userId);

    document.getElementById('checkout-close')?.addEventListener('click', close);
    document.getElementById('checkout-backdrop')?.addEventListener('click', close);
  }

  function close() {
    const screen   = document.getElementById('checkout-screen');
    const backdrop = document.getElementById('checkout-backdrop');
    screen?.classList.remove('checkout-screen--visible');
    backdrop?.classList.remove('checkout-backdrop--visible');
    setTimeout(() => { screen?.remove(); backdrop?.remove(); }, 350);
  }

  return { open, close, redeemInviteCode, PLANS };
})();
