// FILE: lib/score-predictor.js
// Módulo B — Predicción de puntaje ICFES basada en historial de respuestas.
// Depende de: supabase (global)

window.ScorePredictor = (() => {
  'use strict';

  // Ponderaciones reales del ICFES Saber 11 (escala 0-100 por área)
  const WEIGHTS = {
    lectura_critica:    0.28,
    matematicas:        0.28,
    sociales:           0.22,
    ciencias_naturales: 0.22,
  };

  const SUBJECT_LABELS = {
    lectura_critica:    'Lectura Crítica',
    matematicas:        'Matemáticas',
    sociales:           'Sociales',
    ciencias_naturales: 'Ciencias Naturales',
    ingles:             'Inglés',
  };

  // ── API pública ───────────────────────────────────────────────

  /**
   * Calcula y persiste la predicción de puntaje del estudiante.
   * Llamar tras cada sesión con 10+ preguntas respondidas.
   * @param {string} studentId
   * @returns {Promise<{predicted, bySubject, confidence}|null>}
   */
  async function calculateAndSave(studentId) {
    const since = new Date(Date.now() - 28 * 86400_000).toISOString();

    const { data: answers } = await supabase
      .from('student_answers')
      .select('is_correct, time_seconds, questions(subject)')
      .eq('student_id', studentId)
      .gte('created_at', since);

    if (!answers || answers.length < 10) return null;

    const bySubject = {};

    for (const [subject] of Object.entries(WEIGHTS)) {
      const sub = answers.filter(a => a.questions?.subject === subject);
      if (sub.length === 0) continue;

      const accuracy  = sub.filter(a => a.is_correct).length / sub.length;
      const avgTime   = sub.reduce((s, a) => s + (a.time_seconds ?? 0), 0) / sub.length;
      const timeBonus = avgTime < 30 ? 0.05 : avgTime > 60 ? -0.03 : 0;
      const adjusted  = Math.min(1, Math.max(0, accuracy + timeBonus));

      bySubject[subject] = {
        accuracy:   Math.round(accuracy * 100),
        sampleSize: sub.length,
        estimated:  Math.round(adjusted * 100),
      };
    }

    // Puntaje global ponderado → escala 0-500
    let globalScore = 0;
    for (const [subject, weight] of Object.entries(WEIGHTS)) {
      globalScore += (bySubject[subject]?.estimated ?? 50) * weight;
    }
    const predicted   = Math.round(globalScore * 5);
    const confidence  = Math.min(1, answers.length / 200);

    await supabase.from('score_predictions').insert({
      student_id:   studentId,
      predicted,
      by_subject:   bySubject,
      confidence,
      sample_size:  answers.length,
    });

    return { predicted, bySubject, confidence };
  }

  /**
   * Devuelve la predicción más reciente con delta vs la anterior.
   */
  async function getLatest(studentId) {
    const { data } = await supabase
      .from('score_predictions')
      .select('predicted, by_subject, confidence, sample_size, calculated_at')
      .eq('student_id', studentId)
      .order('calculated_at', { ascending: false })
      .limit(2);

    if (!data || data.length === 0) return null;

    const current  = data[0];
    const previous = data[1] ?? null;
    return {
      ...current,
      delta: previous ? current.predicted - previous.predicted : null,
    };
  }

  /**
   * Genera el HTML del widget de predicción para el dashboard.
   */
  function widgetHTML(prediction) {
    if (!prediction) {
      return `
        <div class="score-prediction-widget score-prediction-widget--empty">
          <p style="font-size:.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px">Predicción ICFES</p>
          <p style="font-size:.85rem;color:var(--text-secondary)">Responde 10+ preguntas para activar tu predicción personalizada.</p>
        </div>`;
    }

    const confidenceLabel = prediction.confidence < 0.3 ? 'Preliminar'
      : prediction.confidence < 0.7 ? 'Moderada' : 'Confiable';

    const deltaHTML = prediction.delta !== null
      ? `<span style="font-size:.8rem;font-weight:600;color:${prediction.delta >= 0 ? 'var(--accent-green-light)' : 'var(--error)'}">
           ${prediction.delta >= 0 ? '↑' : '↓'} ${Math.abs(prediction.delta)} pts esta semana
         </span>`
      : '';

    const bars = Object.entries(prediction.by_subject ?? {}).map(([subj, d]) => `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
        <span style="font-size:.72rem;color:var(--text-muted);width:120px;flex-shrink:0">${SUBJECT_LABELS[subj] ?? subj}</span>
        <div style="flex:1;height:6px;background:var(--bg-overlay);border-radius:99px;overflow:hidden">
          <div style="height:100%;width:${d.estimated}%;background:var(--gradient-brand);border-radius:99px;transition:width .6s ease"></div>
        </div>
        <span style="font-size:.72rem;color:var(--text-secondary);width:28px;text-align:right">${d.estimated}</span>
      </div>`).join('');

    return `
      <div class="score-prediction-widget">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:var(--space-3)">
          <div>
            <p style="font-size:.72rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:2px">Puntaje ICFES estimado</p>
            <div style="display:flex;align-items:baseline;gap:6px">
              <span style="font-size:2.2rem;font-weight:800;color:var(--accent-purple-light)">${prediction.predicted}</span>
              <span style="color:var(--text-muted);font-size:.9rem">/500</span>
            </div>
            ${deltaHTML}
          </div>
          <span style="font-size:.7rem;background:var(--bg-overlay);border:1px solid var(--border-light);border-radius:99px;padding:2px 8px;color:var(--text-muted)">${confidenceLabel}</span>
        </div>
        ${bars}
      </div>`;
  }

  return { calculateAndSave, getLatest, widgetHTML };
})();
