// guardian-widget.js — Widget del Guardián para el Dashboard
// Requiere: supabase, Guardian (globals), showToast (app.js), AudioEvents (audio-events.js)

'use strict';

window.GuardianWidget = (() => {

  let _userId      = null;
  let _containerId = null;
  let _celebrateListenerSet = false;

  // ── Animación del avatar por clase CSS ───────────────────────
  function _animateAvatar(className, durationMs) {
    const container = _containerId ? document.getElementById(_containerId) : null;
    const wrap = container?.querySelector('.gw-avatar-wrap');
    if (!wrap) return;
    wrap.classList.remove('gw-anim-celebrate', 'gw-anim-gain', 'gw-anim-shake');
    // forzar reflow para reiniciar la animación si ya estaba activa
    void wrap.offsetWidth;
    wrap.classList.add(className);
    setTimeout(() => wrap.classList.remove(className), durationMs);
  }

  // ── Listener único para aura:guardianCelebrate ────────────────
  function _registerCelebrateListener() {
    if (_celebrateListenerSet) return;
    document.addEventListener('aura:guardianCelebrate', () => {
      _animateAvatar('gw-anim-celebrate', 1400);
      // El sonido levelUp ya fue disparado por AudioEvents.onLevelUp antes de este evento
    });
    _celebrateListenerSet = true;
  }

  // ── API pública: energía ganada ───────────────────────────────
  // Llamar desde endSession() con el delta de energía real
  function gainEnergy(amount = 8) {
    _animateAvatar('gw-anim-gain', 900);
    if (window.AudioEvents) AudioEvents.onGuardianEnergyGain(amount);
  }

  // ── API pública: energía perdida ──────────────────────────────
  // Llamar desde SafeExit.confirm() cuando el guardián pierde energía
  function loseEnergy() {
    _animateAvatar('gw-anim-shake', 700);
    if (window.AudioEngine) AudioEngine.play('dullThud');
  }

  // ── Inicialización ─────────────────────────────────────────────
  async function init(userId, containerId) {
    _userId      = userId;
    _containerId = containerId;

    _registerCelebrateListener();

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
    if (!g) return;

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

    // Arrancar ambiente sonoro — fade-in a 10-15% de volumen
    // Se llama aquí porque init() ocurre una sola vez al entrar al dashboard
    if (window.AudioEvents) AudioEvents.startGuardianAmbient();
  }

  // ── Refresco tras alimentar ────────────────────────────────────
  async function refresh(containerId) {
    if (!_userId) return;
    const container = document.getElementById(containerId ?? _containerId);
    if (!container) return;
    const g = await Guardian.get(_userId);
    if (g) _render(container, g);
  }

  // ── Render del HTML del widget ─────────────────────────────────
  function _render(container, g) {
    const config    = Guardian.getConfig(g.tipo_guardian);
    const imgSrc    = Guardian.getImagen(g.tipo_guardian, g.nivel_evolucion);
    const evoActual = Guardian.EVOLUCIONES.find(e => e.nivel === g.nivel_evolucion) ?? Guardian.EVOLUCIONES[0];
    const evoSig    = Guardian.EVOLUCIONES.find(e => e.nivel === g.nivel_evolucion + 1);

    const xpPct = evoSig
      ? Math.min(100, Math.round(((g.xp_total - evoActual.xp) / (evoSig.xp - evoActual.xp)) * 100))
      : 100;

    const energiaColor =
      g.nivel_energia <= 25 ? '#EF4444' :
      g.nivel_energia <= 50 ? '#F59E0B' :
      g.nivel_energia <= 75 ? '#EAB308' : '#10B981';

    const avatarStyle = g.estado === 'petrificado' ? 'filter:grayscale(100%) sepia(50%)' : '';
    const pulsClass   = g.estado === 'critico' ? 'gw-avatar--pulse' : '';

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

  return { init, refresh, gainEnergy, loseEnergy };

})();
