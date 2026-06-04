// FILE: lib/session-loader.js
// Preload centralizado de datos de sesión al iniciar app.
// Depende de: supabase (global), ExamCalendar (global)

window.SessionLoader = (() => {
  'use strict';

  /**
   * Carga en paralelo batallas, certificados y countdown.
   * Usa Promise.allSettled — nunca bloquea la carga si una falla.
   * Expone el resultado en window.__auraSession y dispara 'aura:sessionReady'.
   */
  async function preload(studentId) {
    if (!studentId) return null;

    const [battles, certificates, calendar] = await Promise.allSettled([
      supabase
        .from('battles')
        .select('id, status, challenger_id, opponent_id, subject, winner_id, created_at')
        .or(`challenger_id.eq.${studentId},opponent_id.eq.${studentId}`)
        .order('created_at', { ascending: false })
        .limit(10),

      supabase
        .from('certificates')
        .select('id, type, subject, pdf_url, generated_at')
        .eq('student_id', studentId)
        .order('generated_at', { ascending: false }),

      // ExamCalendar.getExamData ya maneja el fallback a fecha oficial
      (async () => {
        if (!window.ExamCalendar) return null;
        const data = await ExamCalendar.getExamData(studentId);
        return data;
      })(),
    ]);

    if (battles.status      === 'rejected') console.warn('[AURA Session] Battles:', battles.reason);
    if (certificates.status === 'rejected') console.warn('[AURA Session] Certs:',   certificates.reason);
    if (calendar.status     === 'rejected') console.warn('[AURA Session] Calendar:', calendar.reason);

    const session = {
      battles:      battles.value?.data      ?? [],
      certificates: certificates.value?.data ?? [],
      examData:     calendar.value           ?? null,
      loadedAt:     Date.now(),
    };

    window.__auraSession = session;
    document.dispatchEvent(new CustomEvent('aura:sessionReady', { detail: session }));

    return session;
  }

  return { preload };
})();
