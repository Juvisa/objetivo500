// js/constants/tiempos.js — Tiempos oficiales ICFES por bloque
// Objetivo 500 · Vanilla JS

export const TIEMPOS_MATERIA = {
  matematicas:        { minutos: 46, segundos: 2760, emoji: "📐" },
  lectura_critica:    { minutos: 40, segundos: 2400, emoji: "📖" },
  ciencias_sociales:  { minutos: 40, segundos: 2400, emoji: "🌎" },
  ciencias_naturales: { minutos: 40, segundos: 2400, emoji: "🔬" },
  ingles:             { minutos: 30, segundos: 1800, emoji: "🇺🇸" },
};

/** Fallback para sesiones mixtas o sin materia definida */
export const SEGUNDOS_DEFAULT = 2400; // 40 min

/**
 * Formatea segundos como MM:SS con padding de ceros.
 * @param {number} seg
 * @returns {string} "46:00"
 */
export const formatTiempo = (seg) => {
  const s = Math.max(0, Math.floor(seg));
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
};

/**
 * Nivel de urgencia según porcentaje de tiempo restante.
 * @param {number} pct — 0 a 100
 * @returns {"normal"|"warning"|"danger"}
 */
export const getNivelUrgencia = (pct) =>
  pct > 40 ? "normal" : pct > 15 ? "warning" : "danger";

/**
 * Devuelve los segundos totales para una materia (con escala si no son 20 preguntas).
 * @param {string|null} subject
 * @param {number} nPreguntas
 * @returns {number}
 */
export const getSegundosBloque = (subject, nPreguntas = 20) => {
  const base = TIEMPOS_MATERIA[subject]?.segundos ?? SEGUNDOS_DEFAULT;
  return Math.round(base * (nPreguntas / 20));
};
