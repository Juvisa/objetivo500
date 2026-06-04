// lib/question-nav.js — Mapa de Preguntas Numerado
// Objetivo 500 · Vanilla JS · sin dependencias
// ─────────────────────────────────────────────
// Renderiza un grid de botones numerados (1…N) que permite
// navegar libremente entre preguntas y muestra su estado:
//   'current'    → pregunta activa (azul/violeta)
//   'answered'   → respondida (verde si correcta, rojo si incorrecta)
//   'pending'    → seleccionada pero aún no confirmada (amarillo)
//   'empty'      → sin respuesta todavía (gris)

const QuestionNav = (() => {

  const CONTAINER_ID = 'question-map';

  /**
   * Renderiza o reemplaza el mapa de preguntas en el elemento #question-map.
   *
   * @param {number}   n          — total de preguntas del bloque
   * @param {number}   currentIdx — índice (0-based) de la pregunta activa
   * @param {Object}   answers    — { [questionId]: { is_correct, selected_index, ... } }
   * @param {Array}    questions  — array de objetos question (para obtener q.id por índice)
   * @param {Function} onNavigate — callback(idx) al hacer clic en un botón
   */
  function render(n, currentIdx, answers, questions, onNavigate) {
    const container = document.getElementById(CONTAINER_ID);
    if (!container) return;

    const buttons = [];
    for (let i = 0; i < n; i++) {
      const q        = questions[i];
      const ans      = q ? answers[q.id] : null;
      const isCurrent  = i === currentIdx;
      const isAnswered = !!ans;
      const isCorrect  = ans?.is_correct;

      let stateCls = 'q-map-btn--empty';
      let ariaLabel = `Pregunta ${i + 1}`;
      if (isCurrent) {
        stateCls  = 'q-map-btn--current';
        ariaLabel += ' (actual)';
      } else if (isAnswered) {
        stateCls  = isCorrect ? 'q-map-btn--correct' : 'q-map-btn--incorrect';
        ariaLabel += isCorrect ? ' (correcta)' : ' (incorrecta)';
      }

      buttons.push(`
        <button
          class="q-map-btn ${stateCls}"
          onclick="window._qNavGo(${i})"
          aria-label="${ariaLabel}"
          aria-pressed="${isCurrent}"
          title="${ariaLabel}"
        >${i + 1}</button>`);
    }

    // Estadísticas rápidas
    const answered = Object.keys(answers).length;
    const left     = n - answered;

    container.innerHTML = `
      <div class="q-map-header">
        <span class="q-map-stat">
          <span class="q-map-dot q-map-dot--correct"></span>${Object.values(answers).filter(a => a?.is_correct).length} correctas
        </span>
        <span class="q-map-stat">
          <span class="q-map-dot q-map-dot--incorrect"></span>${Object.values(answers).filter(a => !a?.is_correct && a).length} errores
        </span>
        <span class="q-map-stat">
          <span class="q-map-dot q-map-dot--empty"></span>${left} restantes
        </span>
      </div>
      <div class="q-map-grid" role="group" aria-label="Mapa de preguntas">
        ${buttons.join('')}
      </div>`;

    // Guardar callback para los onclick inline
    window._qNavGo = (idx) => {
      if (idx < 0 || idx >= n) return;
      if (typeof onNavigate === 'function') onNavigate(idx);
    };
  }

  /**
   * Actualiza solo el botón de una pregunta concreta (sin re-render completo).
   * Más eficiente cuando solo cambia una pregunta.
   *
   * @param {number}  idx        — índice (0-based)
   * @param {boolean} isCurrent  — si es la activa ahora
   * @param {Object|null} answer — { is_correct } o null si sin respuesta
   */
  function updateButton(idx, isCurrent, answer) {
    const container = document.getElementById(CONTAINER_ID);
    if (!container) return;

    const btn = container.querySelectorAll('.q-map-btn')[idx];
    if (!btn) return;

    btn.className = 'q-map-btn';
    if (isCurrent) {
      btn.classList.add('q-map-btn--current');
    } else if (answer) {
      btn.classList.add(answer.is_correct ? 'q-map-btn--correct' : 'q-map-btn--incorrect');
    } else {
      btn.classList.add('q-map-btn--empty');
    }
    btn.setAttribute('aria-pressed', String(isCurrent));
  }

  return { render, updateButton };
})();

window.QuestionNav = QuestionNav;
