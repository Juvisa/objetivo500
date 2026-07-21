// FILE: lib/ia-diagnostico.js — Llamada al endpoint de diagnóstico IA
// Llama a /api/diagnostico con timeout de 8s; retorna null si falla.

window.IaDiagnostico = (() => {
  'use strict';

  const TIMEOUT_MS = 8000;

  /**
   * Envía el payload al endpoint serverless y retorna el diagnóstico IA.
   * @param {Object} payload - resultado de Diagnostico.construirPayload()
   * @returns {Object|null}  - diagnóstico parseado, o null si falla/timeout
   */
  async function generarDiagnostico(payload) {
    const ctrl    = new AbortController();
    const timerId = setTimeout(() => ctrl.abort(), TIMEOUT_MS);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token ?? '';

      const res = await fetch('/api/diagnostico', {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body:    JSON.stringify(payload),
        signal:  ctrl.signal,
      });
      clearTimeout(timerId);

      if (!res.ok) {
        console.warn('[IaDiagnostico] HTTP', res.status);
        return null;
      }

      const data = await res.json();
      return data ?? null;
    } catch (err) {
      clearTimeout(timerId);
      if (err.name !== 'AbortError') {
        console.warn('[IaDiagnostico] fetch error:', err.message);
      }
      return null;
    }
  }

  return { generarDiagnostico };
})();
