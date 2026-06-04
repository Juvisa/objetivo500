// lib/block-timer.js — Reloj Global por Bloque
// Objetivo 500 · Vanilla JS · sin dependencias
// ─────────────────────────────────────────────
// Uso:
//   BlockTimer.start(totalSecs, onTick, onExpire);
//   BlockTimer.stop();
//   BlockTimer.getSecsLeft();
//   BlockTimer.pause() / BlockTimer.resume();

const BlockTimer = (() => {
  // ── Estado interno ────────────────────────────────────────────
  let _secsLeft    = 0;
  let _secsTotal   = 0;
  let _handle      = null;
  let _onTick      = null;
  let _onExpire    = null;
  let _paused      = false;

  // IDs de los elementos DOM que este módulo actualiza
  const DOM = {
    VALUE : 'block-timer-value',
    BAR   : 'block-timer-bar',
    WRAP  : 'block-timer-wrap',
  };

  // ── Helpers ───────────────────────────────────────────────────
  function _fmt(s) {
    const m = Math.floor(Math.abs(s) / 60);
    const sec = String(Math.abs(s) % 60).padStart(2, '0');
    return `${m}:${sec}`;
  }

  /**
   * Calcula la clase de urgencia según el porcentaje restante.
   * > 40%  → 'timer--green'
   * 15-40% → 'timer--orange'
   * < 15%  → 'timer--red'  + pulso
   */
  function _urgencyClass(secsLeft, secsTotal) {
    const pct = secsLeft / secsTotal;
    if (pct > 0.40) return 'timer--green';
    if (pct > 0.15) return 'timer--orange';
    return 'timer--red';
  }

  /** Actualiza los elementos DOM del reloj. */
  function _updateDOM() {
    const valEl  = document.getElementById(DOM.VALUE);
    const barEl  = document.getElementById(DOM.BAR);
    const wrapEl = document.getElementById(DOM.WRAP);

    if (valEl) {
      valEl.textContent = _fmt(_secsLeft);
    }

    if (barEl) {
      const pct = Math.max(0, (_secsLeft / _secsTotal) * 100);
      barEl.style.width = `${pct}%`;
    }

    if (wrapEl) {
      const cls = _urgencyClass(_secsLeft, _secsTotal);
      wrapEl.className = wrapEl.className
        .replace(/\btimer--(green|orange|red)\b/g, '')
        .trim() + ' ' + cls;
    }
  }

  /** Tick interno — se llama cada segundo. */
  function _tick() {
    if (_paused) return;
    _secsLeft--;

    _updateDOM();
    if (typeof _onTick === 'function') _onTick(_secsLeft);

    if (_secsLeft <= 0) {
      _stop();
      if (typeof _onExpire === 'function') _onExpire();
    }
  }

  function _stop() {
    if (_handle) {
      clearInterval(_handle);
      _handle = null;
    }
  }

  // ── API pública ───────────────────────────────────────────────

  /**
   * Inicia el reloj.
   * @param {number}   totalSecs  — segundos totales del bloque
   * @param {Function} onTick     — callback(secsLeft) cada segundo
   * @param {Function} onExpire   — callback() cuando llega a 0
   * @param {number}   [resumeAt] — si se reanuda, segundos restantes
   */
  function start(totalSecs, onTick, onExpire, resumeAt = null) {
    _stop();
    _secsTotal = totalSecs;
    _secsLeft  = resumeAt !== null ? resumeAt : totalSecs;
    _onTick    = onTick;
    _onExpire  = onExpire;
    _paused    = false;

    _updateDOM();
    _handle = setInterval(_tick, 1000);
  }

  function stop() {
    _stop();
  }

  function pause() {
    _paused = true;
  }

  function resume() {
    _paused = false;
  }

  function getSecsLeft() {
    return _secsLeft;
  }

  function getSecsTotal() {
    return _secsTotal;
  }

  /** Fuerza una actualización visual sin cambiar el tiempo (p.ej. al navegar). */
  function refresh() {
    _updateDOM();
  }

  /**
   * Genera el HTML del bloque sticky del reloj.
   * Llamar una sola vez al montar la vista del simulacro.
   * @param {string} subjectLabel — nombre legible de la materia
   * @param {number} totalSecs
   * @param {number} [resumeAt]
   */
  function renderHTML(subjectLabel, totalSecs, resumeAt = null) {
    const initSecs = resumeAt !== null ? resumeAt : totalSecs;
    const initPct  = (initSecs / totalSecs) * 100;
    const initCls  = _urgencyClass(initSecs, totalSecs);

    return `
      <div id="block-timer-wrap" class="block-timer-wrap ${initCls}" role="timer" aria-live="off" aria-label="Tiempo restante del bloque">
        <div class="block-timer-inner">
          <div class="block-timer-left">
            <span class="block-timer-icon" aria-hidden="true">⏱</span>
            <span class="block-timer-subject">${subjectLabel ?? 'Bloque'}</span>
          </div>
          <div class="block-timer-center">
            <span class="block-timer-value font-mono" id="block-timer-value">${_fmt(initSecs)}</span>
            <span class="block-timer-label">restante</span>
          </div>
          <div class="block-timer-right">
            <button
              id="btn-submit-block"
              class="btn btn--primary btn--sm"
              onclick="window.submitBlock()"
              aria-label="Enviar respuestas del bloque"
            >Enviar ✓</button>
          </div>
        </div>
        <div class="block-timer-bar-track" role="progressbar" aria-valuenow="${Math.round(initPct)}" aria-valuemin="0" aria-valuemax="100">
          <div class="block-timer-bar" id="block-timer-bar" style="width:${initPct}%"></div>
        </div>
      </div>`;
  }

  return { start, stop, pause, resume, getSecsLeft, getSecsTotal, refresh, renderHTML };
})();

// Exponer globalmente
window.BlockTimer = BlockTimer;
