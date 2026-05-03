// FILE: lib/resurrection.js
// Cola de preguntas para el Reto de Resurrección.
// Garantiza unicidad dentro de cada lote y excluye preguntas ya vistas.

window.ResurrectionQueue = (() => {
  'use strict';

  function _shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /**
   * Construye un lote de `count` preguntas únicas.
   * @param {string}   userId      – ID del estudiante (para futuras queries personalizadas)
   * @param {number}   count       – Cuántas preguntas necesitas (default 15)
   * @param {string[]} excludeIds  – IDs a excluir (ya vistas en este reto)
   * @returns {Promise<object[]>}
   */
  async function buildQueue(userId, count = 15, excludeIds = []) {
    // Fetch a large pool with random offset so we don't always get the same rows
    const { count: total } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true });

    const poolSize = Math.min(count * 6, total ?? count * 6);
    const maxOffset = Math.max(0, (total ?? 0) - poolSize);
    const offset = Math.floor(Math.random() * (maxOffset + 1));

    let query = supabase
      .from('questions')
      .select('id, stem, options_json, correct_index, explanation, subject, topic, difficulty, context_text')
      .eq('is_paused', false)
      .range(offset, offset + poolSize - 1);

    if (excludeIds.length > 0) {
      query = query.not('id', 'in', `(${excludeIds.map(id => `'${id}'`).join(',')})`);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      // Fallback sin exclusiones
      const { data: fallback } = await supabase
        .from('questions')
        .select('id, stem, options_json, correct_index, explanation, subject, topic, difficulty, context_text')
        .eq('is_paused', false)
        .range(offset, offset + poolSize - 1);
      if (!fallback || fallback.length === 0) return [];
      const unique = [...new Map(fallback.map(q => [q.id, q])).values()];
      return _shuffle(unique).slice(0, count);
    }

    const unique = [...new Map(data.map(q => [q.id, q])).values()];
    return _shuffle(unique).slice(0, count);
  }

  return { buildQueue };
})();
