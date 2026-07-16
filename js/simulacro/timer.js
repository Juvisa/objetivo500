// js/simulacro/timer.js — Reloj Global por Bloque
// Objetivo 500 · Vanilla JS · clase por instancia (una por sesión)
// ──────────────────────────────────────────────────────────────
// Uso:
//   const timer = new SimulacroTimer({ segundosTotales, onTick, onExpire });
//   timer.iniciar();
//   timer.detener();
//   timer.restantes  → segundos restantes
//   timer.porcentaje → 0–100

import { formatTiempo, getNivelUrgencia } from '../constants/tiempos.js';

export class SimulacroTimer {
  /**
   * @param {object}   opts
   * @param {number}   opts.segundosTotales — total de segundos del bloque
   * @param {Function} opts.onTick          — callback({ restantes, total, porcentaje }) cada segundo
   * @param {Function} opts.onExpire        — callback() al llegar a 0
   * @param {number}   [opts.reanudarEn]    — si se reanuda sesión, segundos restantes
   */
  constructor({ segundosTotales, onTick, onExpire, reanudarEn = null }) {
    this.total     = segundosTotales;
    this.restantes = reanudarEn !== null ? reanudarEn : segundosTotales;
    this.onTick    = onTick;
    this.onExpire  = onExpire;
    this._interval = null;
    this._pausado  = false;
  }

  /** Inicia o reanuda el reloj. */
  iniciar() {
    if (this._interval) return; // ya corriendo
    this._interval = setInterval(() => {
      if (this._pausado) return;

      this.restantes = Math.max(0, this.restantes - 1);
      const pct = Math.round((this.restantes / this.total) * 100);

      // Actualizar DOM automáticamente
      this._actualizarDOM(pct);

      // Callback externo
      if (typeof this.onTick === 'function') {
        this.onTick({ restantes: this.restantes, total: this.total, porcentaje: pct });
      }

      // Expiración
      if (this.restantes <= 0) {
        this.detener();
        if (typeof this.onExpire === 'function') this.onExpire();
      }
    }, 1000);
  }

  /** Detiene el reloj. */
  detener() {
    clearInterval(this._interval);
    this._interval = null;
  }

  /** Pausa sin destruir el interval. */
  pausar() { this._pausado = true; }

  /** Reanuda desde pausa. */
  reanudar() { this._pausado = false; }

  // ── Getters ──────────────────────────────────────────────────

  get porcentaje() {
    return Math.round((this.restantes / this.total) * 100);
  }

  get estaCorreindo() {
    return this._interval !== null && !this._pausado;
  }

  get urgencia() {
    return getNivelUrgencia(this.porcentaje);
  }

  get tiempoFormateado() {
    return formatTiempo(this.restantes);
  }

  // ── DOM ──────────────────────────────────────────────────────

  /**
   * Actualiza los elementos del reloj en el DOM.
   * IDs esperados: #block-timer-value, #block-timer-bar, #block-timer-wrap
   * @param {number} pct — porcentaje restante 0–100
   */
  _actualizarDOM(pct) {
    const valEl  = document.getElementById('block-timer-value');
    const barEl  = document.getElementById('block-timer-bar');
    const wrapEl = document.getElementById('block-timer-wrap');

    if (valEl) valEl.textContent = this.tiempoFormateado;

    if (barEl) barEl.style.width = `${Math.max(0, pct)}%`;

    if (wrapEl) {
      const nivel = getNivelUrgencia(pct);
      const clsMap = { normal: 'timer--green', warning: 'timer--orange', danger: 'timer--red' };
      wrapEl.className = wrapEl.className
        .replace(/\btimer--(green|orange|red)\b/g, '')
        .trim() + ' ' + clsMap[nivel];
    }
  }

  /**
   * Genera el HTML del bloque sticky del reloj para insertarlo en el DOM.
   * @param {string} etiquetaMateria — nombre legible
   * @returns {string} HTML string
   */
  renderHTML(etiquetaMateria = 'Bloque') {
    const pct    = this.porcentaje;
    const nivel  = getNivelUrgencia(pct);
    const clsMap = { normal: 'timer--green', warning: 'timer--orange', danger: 'timer--red' };

    return `
      <div id="block-timer-wrap" class="block-timer-wrap ${clsMap[nivel]}"
           role="timer" aria-live="off" aria-label="Tiempo restante del bloque">
        <div class="block-timer-inner">
          <div class="block-timer-left">
            <span class="block-timer-icon" aria-hidden="true">⏱</span>
            <span class="block-timer-subject">${etiquetaMateria}</span>
          </div>
          <div class="block-timer-center">
            <span class="block-timer-value font-mono" id="block-timer-value">${this.tiempoFormateado}</span>
            <span class="block-timer-label">restante</span>
          </div>
          <div class="block-timer-right">
            <button id="btn-submit-block" class="btn btn--primary btn--sm"
                    onclick="window.submitBlock()"
                    aria-label="Enviar respuestas del bloque">
              Enviar ✓
            </button>
          </div>
        </div>
        <div class="block-timer-bar-track"
             role="progressbar" aria-valuenow="${Math.round(pct)}"
             aria-valuemin="0" aria-valuemax="100">
          <div class="block-timer-bar" id="block-timer-bar" style="width:${pct}%"></div>
        </div>
      </div>`;
  }
}

// ── Retrocompatibilidad: exponer como global window.BlockTimer ──
// Esto permite que app.js siga funcionando sin cambios en la API de llamada.
// app.js hace: BlockTimer.start() → ahora se maneja desde STATE.session._timer
window._SimulacroTimer = SimulacroTimer;
