// FILE: components/support-fab.js
// Botón flotante de soporte por WhatsApp.
// Sin dependencias externas — SVG inline, CSS puro para tooltip.

window.SupportFAB = (() => {
  'use strict';

  // ── CONFIGURACIÓN — editar solo esta línea ────────────────────
  const SUPPORT_WHATSAPP = '573208346133';
  // Formato: código de país sin + seguido del número sin espacios
  // Colombia = 57 | Ejemplo: 573001234567

  // ── SVG inline de WhatsApp ────────────────────────────────────
  const ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg"
      width="24" height="24" viewBox="0 0 24 24"
      fill="white" aria-hidden="true" focusable="false">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15
             -.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075
             -.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059
             -.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52
             .149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52
             -.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51
             -.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372
             -.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074
             .149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625
             .712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413
             .248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.556 4.112 1.528 5.837L.057 23.882
             c-.073.299.03.61.265.808.165.136.37.206.578.206.077 0 .155-.01.231-.03
             l6.2-1.629C8.86 24.085 10.403 24.5 12 24.5 18.627 24.5 24 19.127 24 12.5
             S18.627.5 12 .5zm0 22.5c-1.463 0-2.892-.38-4.144-1.099l-.297-.176-3.679.965
             .982-3.585-.193-.31A10.45 10.45 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477
             10 10-4.477 10-10 10z"/>
  </svg>`;

  // ── Helpers ───────────────────────────────────────────────────

  function _buildMessage(userName) {
    const name = userName?.trim();
    const base = name
      ? `Hola, soy ${name}, estoy usando la app +500 AURA y necesito soporte con: `
      : `Hola, estoy usando la app +500 AURA y necesito soporte con: `;
    return encodeURIComponent(base);
  }

  function _buildURL(userName) {
    return `https://wa.me/${SUPPORT_WHATSAPP}?text=${_buildMessage(userName)}`;
  }

  // ── API pública ───────────────────────────────────────────────

  function init(userName) {
    // Evitar duplicados en re-renders del dashboard
    document.getElementById('support-fab')?.remove();

    const fab = document.createElement('a');
    fab.id        = 'support-fab';
    fab.href      = _buildURL(userName);
    fab.target    = '_blank';
    fab.rel       = 'noopener noreferrer';
    fab.className = 'support-fab';
    fab.setAttribute('aria-label', 'Contactar soporte por WhatsApp');
    fab.innerHTML = ICON_SVG;

    document.body.appendChild(fab);

    // Entrada suave: delay para no distraer la carga inicial del dashboard
    setTimeout(() => fab.classList.add('support-fab--visible'), 1500);

    return {
      updateUserName(newName) {
        fab.href = _buildURL(newName);
      },
    };
  }

  return { init };
})();
