// FILE: lib/question-renderer.js
// Renderizado pedagógico de preguntas y explicaciones.
// Depende de: KaTeX auto-render (CDN, cargado en app.html / reto-resurreccion.html)

window.QuestionRenderer = (() => {
  'use strict';

  // Mini-escape local para no depender del escapeHtml de app.js
  function _esc(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /**
   * Renderiza LaTeX ($...$ y $$...$$) dentro del elemento dado.
   * Fallo silencioso si KaTeX no está cargado.
   */
  function renderLatexInElement(el) {
    if (!el || typeof renderMathInElement === 'undefined') return;
    renderMathInElement(el, {
      delimiters: [
        { left: '$$', right: '$$', display: true  },
        { left: '$',  right: '$',  display: false },
      ],
      throwOnError: false,
    });
  }

  /**
   * Muestra un skeleton loader en el área de preguntas.
   * Útil durante cargas asíncronas.
   */
  function showQuestionSkeleton(containerId = 'question-area') {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = `
      <div style="animation:pulse 1.5s ease-in-out infinite;padding:var(--space-6)">
        <div style="height:14px;background:var(--bg-overlay);border-radius:6px;width:75%;margin-bottom:10px"></div>
        <div style="height:14px;background:var(--bg-overlay);border-radius:6px;width:50%;margin-bottom:32px"></div>
        ${[1,2,3,4].map(() =>
          `<div style="height:52px;background:var(--bg-overlay);border-radius:12px;margin-bottom:10px"></div>`
        ).join('')}
      </div>`;
  }

  /**
   * Genera el HTML del bloque pedagógico de explicación (3 secciones).
   * Fallback a texto plano si explanation_json no existe.
   * @param {object}  question  – objeto pregunta del banco
   * @param {boolean} isCorrect – si el estudiante respondió correctamente
   * @returns {string}          – HTML listo para insertar
   */
  function renderExplanation(question, isCorrect) {
    // explanation_json es el campo nuevo (DB); explanation es el fallback legacy.
    const exp = question.explanation_json
      ? (typeof question.explanation_json === 'string'
          ? JSON.parse(question.explanation_json)
          : question.explanation_json)
      : null;

    const concepto = exp?.concepto
      ?? (question.concept_key
            ? `${_esc(question.explanation)} — Concepto clave: ${_esc(question.concept_key)}`
            : _esc(question.explanation) ?? '');

    const pasos = Array.isArray(exp?.pasos) ? exp.pasos : [];
    const hack  = exp?.hack ?? '';

    return `
    <div class="explanation-block" id="explanation-block">

      <div class="explanation-block__header">
        <span class="explanation-block__status ${isCorrect ? 'correct' : 'incorrect'}">
          ${isCorrect ? '✓ CORRECTO' : '✗ INCORRECTO'}
        </span>
      </div>

      <div class="explanation-section">
        <p class="explanation-label">🧠 CONCEPTO CLAVE</p>
        <p class="explanation-text">${concepto}</p>
      </div>

      ${pasos.length > 0 ? `
      <div class="explanation-section">
        <p class="explanation-label">📐 PASO A PASO</p>
        <ol class="explanation-steps">
          ${pasos.map((paso, i) => `
            <li class="explanation-step">
              <span class="step-number">${i + 1}</span>
              <span class="step-text">${_esc(paso)}</span>
            </li>`).join('')}
        </ol>
      </div>` : ''}

      ${hack ? `
      <div class="explanation-section explanation-section--hack">
        <p class="explanation-label">⚡ EL HACK DE 40 SEGUNDOS</p>
        <p class="explanation-hack-text">${_esc(hack)}</p>
      </div>` : ''}

    </div>`;
  }

  /**
   * Fisher-Yates shuffle de opciones manteniendo el vínculo con la correcta.
   * Trabaja con el formato real de la DB: opts = array, correctIndex = número 0-3.
   * Guarda el resultado en q._shuffled para que navegación/re-render sea estable.
   * @param {string[]} opts         – Array de textos de opciones
   * @param {number}   correctIndex – Índice correcto original (0-3)
   * @returns {{ shuffledOpts: string[], newCorrectIndex: number }}
   */
  function shuffleOptions(opts, correctIndex) {
    const correctText = opts[correctIndex];
    const arr = [...opts];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    const newCorrectIndex = arr.indexOf(correctText);
    if (newCorrectIndex === -1) {
      console.error('[AURA Shuffle] Respuesta correcta no encontrada post-shuffle', { correctText, arr });
      return { shuffledOpts: opts, newCorrectIndex: correctIndex };
    }
    return { shuffledOpts: arr, newCorrectIndex };
  }

  return { renderLatexInElement, renderExplanation, showQuestionSkeleton, shuffleOptions };
})();
