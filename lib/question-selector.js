// FILE: lib/question-selector.js
// Módulo I — Selección anti-repetición de preguntas (client-side).
// Depende de: supabase (global)

window.QuestionSelector = (() => {
  'use strict';

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function notInClause(ids) {
    return ids.length ? `(${ids.join(',')})` : "('')";
  }

  async function getAllSeenIds(studentId) {
    const { data } = await supabase
      .from('student_answers')
      .select('question_id')
      .eq('student_id', studentId);
    return [...new Set((data ?? []).map(r => r.question_id))];
  }

  async function resetFallback(subject, sessionSize) {
    let q = supabase
      .from('questions')
      .select('id, stem, context_text, options_json, correct_index, explanation, topic, difficulty, subject')
      .eq('is_paused', false)
      .limit(sessionSize * 4);
    if (subject) q = q.eq('subject', subject);
    const { data } = await q;
    return shuffle(data ?? []).slice(0, sessionSize);
  }

  async function selectSessionQuestions(studentId, subject, sessionSize = 20) {
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

    // IDs respondidos correctamente en las últimas 48h → excluir
    const { data: recentCorrect } = await supabase
      .from('student_answers')
      .select('question_id')
      .eq('student_id', studentId)
      .eq('is_correct', true)
      .gte('created_at', twoDaysAgo);
    const excludeIds = (recentCorrect ?? []).map(r => r.question_id);

    // P1 (50%) — SR pendientes con fallo reciente
    const p1Count = Math.round(sessionSize * 0.5);
    let srQ = supabase
      .from('spaced_repetition')
      .select('question_id')
      .eq('student_id', studentId)
      .gt('fail_count', 0)
      .lte('next_review', new Date().toISOString().split('T')[0])
      .limit(p1Count * 3);
    if (excludeIds.length) srQ = srQ.not('question_id', 'in', notInClause(excludeIds));
    const { data: srData } = await srQ;
    const p1Ids = shuffle(srData ?? []).slice(0, p1Count).map(r => r.question_id);

    // P2 (30%) — nunca vistas
    const p2Count = Math.round(sessionSize * 0.3);
    const allSeen = await getAllSeenIds(studentId);
    const excludeP2 = [...new Set([...excludeIds, ...allSeen, ...p1Ids])];
    let nvQ = supabase
      .from('questions')
      .select('id')
      .eq('is_paused', false)
      .not('id', 'in', notInClause(excludeP2))
      .limit(p2Count * 3);
    if (subject) nvQ = nvQ.eq('subject', subject);
    const { data: nvData } = await nvQ;
    const p2Ids = shuffle(nvData ?? []).slice(0, p2Count).map(r => r.id);

    // P3 (20%) — aleatorias excluyendo correctas recientes
    const p3Count = sessionSize - p1Ids.length - p2Ids.length;
    const excludeP3 = [...new Set([...excludeIds, ...p1Ids, ...p2Ids])];
    let rndQ = supabase
      .from('questions')
      .select('id')
      .eq('is_paused', false)
      .not('id', 'in', notInClause(excludeP3))
      .limit(p3Count * 3);
    if (subject) rndQ = rndQ.eq('subject', subject);
    const { data: rndData } = await rndQ;
    const p3Ids = shuffle(rndData ?? []).slice(0, p3Count).map(r => r.id);

    const allIds = [...p1Ids, ...p2Ids, ...p3Ids];
    if (allIds.length === 0) return resetFallback(subject, sessionSize);

    const { data: questions } = await supabase
      .from('questions')
      .select('id, stem, context_text, options_json, correct_index, explanation, topic, difficulty, subject')
      .in('id', allIds)
      .eq('is_paused', false);

    const result = shuffle(questions ?? []).slice(0, sessionSize);
    return result.length >= Math.min(5, sessionSize) ? result : resetFallback(subject, sessionSize);
  }

  return { selectSessionQuestions };
})();
