// guardian-widget.js — Widget del Guardián para el Dashboard
// Inyecta el card del guardián en el elemento con id indicado.
// Requiere: supabase, Guardian (globals), y showToast (de app.js).

'use strict';

window.GuardianWidget = (() => {

  let _userId = null;

  /**
   * Inicializa el widget: carga datos, aplica decaimiento y renderiza.
   * @param {string} userId - UUID del usuario autenticado
   * @param {string} containerId - ID del elemento DOM donde inyectar
   */
  async function init(userId, containerId) {
    _userId = userId;
    const container = document.getElementById(containerId);
    if (!container) return;

    // Skeleton mientras carga
    container.innerHTML = `
      <div class="guardian-widget guardian-widget--skeleton" aria-busy="true" aria-label="Cargando guardián">
        <div class="gw-skeleton-avatar"></div>
        <div class="gw-skeleton-lines">
          <div class="gw-skeleton-line" style="width:60%"></div>
          <div class="gw-skeleton-line" style="width:90%"></div>
          <div class="gw-skeleton-line" style="width:75%"></div>
        </div>
      </div>`;

    let g = await Guardian.get(userId);
    if (!g) return; // usuario sin guardián → guardian-selector lo manejará

    // Aplicar decaimiento acumulado desde la última visita
    g = await Guardian.aplicarDecaimiento(g);

    _render(container, g);

    // Toast de advertencia si energía crítica
    if (g.nivel_energia < 25 && typeof showToast === 'function') {
      const config = Guardian.getConfig(g.tipo_guardian);
      showToast(
        `¡${config.nombre} tiene hambre!`,
        'Estudia ahora para alimentarlo 🔥',
        '⚠️',
        'error'
      );
    }
  }

  /**
   * Refresca el widget con los datos más recientes (llamar tras alimentar).
   * @param {string} containerId
   */
  async function refresh(containerId) {
    if (!_userId) return;
    const container = document.getElementById(containerId);
    if (!container) return;
    const g = await Guardian.get(_userId);
    if (g) _render(container, g);
  }

  /**
   * Renderiza el HTML del widget en el contenedor dado.
   * @param {HTMLElement} container
   * @param {Object} g - datos del guardián
   */
  function _render(container, g) {
    const config   = Guardian.getConfig(g.tipo_guardian);
    const imgSrc   = Guardian.getImagen(g.tipo_guardian, g.nivel_evolucion);
    const evoActual = Guardian.EVOLUCIONES.find(e => e.nivel === g.nivel_evolucion) ?? Guardian.EVOLUCIONES[0];
    const evoSig   = Guardian.EVOLUCIONES.find(e => e.nivel === g.nivel_evolucion + 1);

    // Porcentaje de progreso hacia siguiente evolución
    const xpPct = evoSig
      ? Math.min(100, Math.round(((g.xp_total - evoActual.xp) / (evoSig.xp - evoActual.xp)) * 100))
      : 100;

    // Color de la barra de energía según nivel
    const energiaColor =
      g.nivel_energia <= 25 ? '#EF4444' :
      g.nivel_energia <= 50 ? '#F59E0B' :
      g.nivel_energia <= 75 ? '#EAB308' : '#10B981';

    // Estilos y clases según estado
    const avatarStyle  = g.estado === 'petrificado' ? 'filter:grayscale(100%) sepia(50%)' : '';
    const pulsClass    = g.estado === 'critico' ? 'gw-avatar--pulse' : '';

    const estadoTexto = {
      activo:      `⚡ ${config.nombre} está lleno de energía`,
      critico:     `⚠️ ¡${config.nombre} tiene hambre! Estudia pronto`,
      petrificado: `💀 ${config.nombre} está petrificado. ¡Necesita resurrección!`,
    }[g.estado] ?? '';

    const estadoClass = {
      activo:      'gw-estado--activo',
      critico:     'gw-estado--critico',
      petrificado: 'gw-estado--petrificado',
    }[g.estado] ?? '';

    container.innerHTML = `
      <div class="guardian-widget" style="--gw-acento:${config.colorAcento}" role="region" aria-label="Tu Guardián: ${config.nombre}">

        <div class="gw-header">
          <span class="gw-title">Tu Guardián</span>
          <span class="gw-etapa" style="color:${config.colorAcento}">${evoActual.nombre}</span>
        </div>

        <div class="gw-body">
          <!-- Avatar -->
          <div class="gw-avatar-wrap ${pulsClass}" style="--gw-acento:${config.colorAcento}">
            <img
              src="${imgSrc}"
              alt="${config.nombre}, etapa ${evoActual.nombre}"
              class="gw-avatar"
              style="${avatarStyle}"
              onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'gw-avatar-fallback',textContent:'🥚',style:'font-size:3rem;display:flex;align-items:center;justify-content:center;width:80px;height:80px'}))"
            />
          </div>

          <!-- Info -->
          <div class="gw-info">
            <p class="gw-nombre">${config.nombre}</p>
            <p class="gw-elemento">${config.elemento}</p>

            <!-- Barra de energía -->
            <div class="gw-bar-row">
              <span>Energía vital</span>
              <span>${g.nivel_energia}%</span>
            </div>
            <div
              class="gw-bar"
              role="progressbar"
              aria-valuenow="${g.nivel_energia}"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label="Energía vital ${g.nivel_energia}%"
            >
              <div class="gw-bar__fill" style="width:${g.nivel_energia}%;background:${energiaColor}"></div>
            </div>

            <!-- Barra de XP -->
            <div class="gw-bar-row" style="margin-top:var(--space-2)">
              <span>XP → ${evoSig ? evoSig.nombre : 'Legendario'}</span>
              <span>${xpPct}%</span>
            </div>
            <div
              class="gw-bar"
              role="progressbar"
              aria-valuenow="${xpPct}"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label="Progreso hacia ${evoSig?.nombre ?? 'máximo nivel'}: ${xpPct}%"
            >
              <div class="gw-bar__fill" style="width:${xpPct}%;background:var(--accent-purple-light)"></div>
            </div>

            <!-- Estado textual -->
            <p class="gw-estado ${estadoClass}">${estadoTexto}</p>

            ${g.estado === 'petrificado' ? `
              <a
                href="./reto-resurreccion.html"
                class="btn btn--primary btn--sm"
                style="margin-top:var(--space-3);display:inline-block;background:${config.colorAcento};border-color:${config.colorAcento};color:#000"
              >
                ⚡ Iniciar Resurrección
              </a>` : ''}

            <p class="gw-xp-total">XP total: <strong>${g.xp_total.toLocaleString('es-CO')}</strong></p>
          </div>
        </div>

      </div>`;
  }

  return { init, refresh };

})();
