// js/simulacro/navegacion.js — Mapa Numerado de Preguntas
// Objetivo 500 · Vanilla JS
// ──────────────────────────────────────────────────────
// Reemplaza lib/question-nav.js con una arquitectura de clase.
//
// Uso:
//   const nav = new SimulacroNavegacion({ n, questions, answers, onNavegar });
//   nav.render(currentIdx);
//   nav.actualizarBoton(idx, answer);

export class SimulacroNavegacion {
  /**
   * @param {object}   opts
   * @param {number}   opts.n           — total de preguntas
   * @param {Array}    opts.questions   — array de objetos question
   * @param {object}   opts.answers     — { [questionId]: { is_correct, selected_index } }
   * @param {Function} opts.onNavegar   — callback(idx) al hacer clic en un botón
   */
  constructor({ n, questions, answers, onNavegar }) {
    this.n          = n;
    this.questions  = questions;
    this.answers    = answers;
    this.onNavegar  = onNavegar;
    this.containerId = 'question-map';

    // Exponer callback para los onclick inline generados en el HTML
    window._navGo = (idx) => {
      if (idx < 0 || idx >= this.n) return;
      if (typeof this.onNavegar === 'function') this.onNavegar(idx);
    };
  }

  /**
   * Renderiza completamente el mapa en #question-map.
   * @param {number} currentIdx — índice activo (0-based), -1 para "ninguno" (pantalla resumen)
   */
  render(currentIdx = 0) {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    container.innerHTML = `
      ${this._renderHeader()}
      <div class="q-map-grid" role="group" aria-label="Mapa de preguntas">
        ${this._renderBotones(currentIdx)}
      </div>`;
  }

  /**
   * Actualiza solo el botón de una pregunta sin re-renderizar todo el mapa.
   * @param {number}      idx       — índice (0-based)
   * @param {boolean}     isCurrent
   * @param {object|null} answer    — { is_correct } o null
   */
  actualizarBoton(idx, isCurrent, answer) {
    const container = document.getElementById(this.containerId);
    if (!container) return;
    const btn = container.querySelectorAll('.q-map-btn')[idx];
    if (!btn) return;

    btn.className = 'q-map-btn ' + this._estadoClase(isCurrent, answer);
    btn.setAttribute('aria-pressed', String(isCurrent));
  }

  // ── Privados ─────────────────────────────────────────────────

  _renderHeader() {
    const correctas  = Object.values(this.answers).filter(a => a?.is_correct).length;
    const incorrectas = Object.values(this.answers).filter(a => a && !a.is_correct && a.selected_index !== -1).length;
    const omitidas   = Object.values(this.answers).filter(a => a?.selected_index === -1).length;
    const restantes  = this.n - Object.keys(this.answers).length;

    return `
      <div class="q-map-header">
        <span class="q-map-stat">
          <span class="q-map-dot q-map-dot--correct"></span>${correctas} correctas
        </span>
        <span class="q-map-stat">
          <span class="q-map-dot q-map-dot--incorrect"></span>${incorrectas} errores
        </span>
        ${omitidas > 0 ? `
        <span class="q-map-stat">
          <span class="q-map-dot q-map-dot--omitida"></span>${omitidas} omitidas
        </span>` : ''}
        <span class="q-map-stat">
          <span class="q-map-dot q-map-dot--empty"></span>${restantes} restantes
        </span>
      </div>`;
  }

  _renderBotones(currentIdx) {
    return Array.from({ length: this.n }, (_, i) => {
      const q       = this.questions[i];
      const answer  = q ? this.answers[q.id] : null;
      const isCurrent = i === currentIdx;
      const cls     = this._estadoClase(isCurrent, answer);
      const label   = `Pregunta ${i + 1}${isCurrent ? ' (actual)' : answer ? (answer.is_correct ? ' ✓' : ' ✗') : ''}`;

      return `
        <button class="q-map-btn ${cls}"
                onclick="window._navGo(${i})"
                aria-label="${label}"
                aria-pressed="${isCurrent}"
                title="${label}">
          ${i + 1}
        </button>`;
    }).join('');
  }

  _estadoClase(isCurrent, answer) {
    if (isCurrent)         return 'q-map-btn--current';
    if (!answer)           return 'q-map-btn--empty';
    if (answer.selected_index === -1) return 'q-map-btn--omitida';
    return answer.is_correct ? 'q-map-btn--correct' : 'q-map-btn--incorrect';
  }
}

// ── Retrocompatibilidad global ────────────────────────────────
// app.js usa QuestionNav.render() — mantenemos el alias
window._SimulacroNavegacion = SimulacroNavegacion;
