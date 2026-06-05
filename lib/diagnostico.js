// FILE: lib/diagnostico.js — Diagnóstico de errores por tema
// Agrupa los errores del bloque y construye el payload para la IA.

window.Diagnostico = (() => {
  'use strict';

  /**
   * Agrupa preguntas incorrectas por su campo `topic`.
   * @param {Array}  questions  - STATE.session.questions
   * @param {Object} answers    - STATE.session.answers { [id]: { is_correct, selected_index } }
   * @returns {Object} { tema: count } ordenado de mayor a menor
   */
  function agruparErroresPorTema(questions, answers) {
    const errores = {};
    questions.forEach(q => {
      const a = answers[q.id];
      if (!a || a.is_correct) return;
      const tema = q.topic || q.subtema || 'tema_desconocido';
      errores[tema] = (errores[tema] || 0) + 1;
    });
    return Object.fromEntries(
      Object.entries(errores).sort(([, a], [, b]) => b - a)
    );
  }

  /**
   * Construye el payload completo para enviar a /api/diagnostico.
   */
  function construirPayload({ subject, questions, answers, blockSecsTotal, blockSecsLeft }) {
    const total          = questions.length;
    const totalCorrectas = Object.values(answers).filter(a => a.is_correct).length;
    const tiempoUsado    = Math.max(0, (blockSecsTotal ?? 0) - (blockSecsLeft ?? 0));
    const erroresPorTema = agruparErroresPorTema(questions, answers);

    return {
      materia:            subject ?? 'desconocida',
      puntaje:            Math.round((totalCorrectas / Math.max(total, 1)) * 100),
      totalCorrectas,
      totalPreguntas:     total,
      tiempoUsadoSegundos: tiempoUsado,
      erroresPorTema,
    };
  }

  return { agruparErroresPorTema, construirPayload };
})();
