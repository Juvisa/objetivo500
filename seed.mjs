/**
 * seed.mjs — Objetivo 500
 * Pobla la BD de Supabase con:
 *   - 15 insignias del catálogo
 *   - 59 preguntas del banco local (banco.js)
 *
 * Uso:
 *   node seed.mjs <SERVICE_ROLE_KEY>
 *
 * La SERVICE_ROLE_KEY está en Supabase → Project Settings → API → service_role.
 * NUNCA la pongas en código del cliente.
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __dir = dirname(fileURLToPath(import.meta.url));

// ── Config ────────────────────────────────────────────────────
const SUPABASE_URL = 'https://bekvduhzoxufixykxphy.supabase.co';
const SERVICE_KEY  = process.argv[2];

if (!SERVICE_KEY) {
  console.error('\n❌  Falta la SERVICE_ROLE_KEY.\n');
  console.error('    Uso: node seed.mjs <tu_service_role_key>\n');
  console.error('    La encuentras en: Supabase → Project Settings → API → service_role\n');
  process.exit(1);
}

const HEADERS = {
  'Content-Type': 'application/json',
  'apikey':       SERVICE_KEY,
  'Authorization':`Bearer ${SERVICE_KEY}`,
  'Prefer':       'resolution=merge-duplicates',
};

// ── Helpers ───────────────────────────────────────────────────
async function upsert(table, rows, onConflict = null) {
  const url = onConflict
    ? `${SUPABASE_URL}/rest/v1/${table}?on_conflict=${onConflict}`
    : `${SUPABASE_URL}/rest/v1/${table}`;
  const res = await fetch(url, {
    method:  'POST',
    headers: HEADERS,
    body:    JSON.stringify(rows),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`[${table}] HTTP ${res.status}: ${txt}`);
  }
  return res;
}

async function countRows(table) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=id`, {
    headers: { ...HEADERS, 'Prefer': 'count=exact', 'Range': '0-0' },
  });
  const range = res.headers.get('content-range');
  return parseInt(range?.split('/')[1] ?? '0', 10);
}

function ok(msg)  { console.log('  ✅', msg); }
function err(msg) { console.error('  ❌', msg); }

// ══════════════════════════════════════════════════════════════
//  1. INSIGNIAS
// ══════════════════════════════════════════════════════════════
const BADGES = [
  { slug:'primera_chispa',      name:'Primera Chispa',         description:'Tu primera respuesta correcta. ¡El viaje empieza!',            icon_url:'🔥', criteria_json:{ correct_answers:1 }},
  { slug:'matematico_imparable',name:'Matemático Imparable',   description:'20 respuestas correctas en Matemáticas.',                      icon_url:'📐', criteria_json:{ subject:'matematicas', correct:20 }},
  { slug:'lector_critico',      name:'Lector Crítico',         description:'20 respuestas correctas en Lectura Crítica.',                  icon_url:'📖', criteria_json:{ subject:'lectura_critica', correct:20 }},
  { slug:'racha_de_fuego',      name:'Racha de Fuego',         description:'7 días consecutivos estudiando.',                              icon_url:'🔥', criteria_json:{ streak_days:7 }},
  { slug:'velocista',           name:'Velocista',              description:'10 respuestas correctas en menos de 10 segundos.',             icon_url:'⚡', criteria_json:{ fast_correct:10, max_seconds:10 }},
  { slug:'rango_diamante',      name:'Rango Diamante',         description:'Alcanzaste el rango Diamante. Estás en la élite.',             icon_url:'💎', criteria_json:{ rank:'diamante' }},
  { slug:'leyenda_500',         name:'Leyenda 500',            description:'Máximo rango. Estás listo para el ICFES.',                     icon_url:'🏆', criteria_json:{ rank:'leyenda' }},
  { slug:'cientifico_nato',     name:'Científico Nato',        description:'20 respuestas correctas en Ciencias Naturales.',               icon_url:'🧪', criteria_json:{ subject:'ciencias_naturales', correct:20 }},
  { slug:'ciudadano_global',    name:'Ciudadano Global',       description:'20 respuestas correctas en Sociales y Ciudadanas.',            icon_url:'🌎', criteria_json:{ subject:'sociales', correct:20 }},
  { slug:'bilingue_imparable',  name:'Bilingüe Imparable',    description:'20 respuestas correctas en Inglés.',                           icon_url:'🇬🇧', criteria_json:{ subject:'ingles', correct:20 }},
  { slug:'maratonista',         name:'Maratonista',            description:'Respondiste 100 preguntas en total.',                          icon_url:'🏃', criteria_json:{ total_answers:100 }},
  { slug:'perfeccionista',      name:'Perfeccionista',         description:'Sesión perfecta: 10/10 respuestas correctas.',                 icon_url:'✨', criteria_json:{ perfect_session:true }},
  { slug:'semana_completa',     name:'Semana Completa',        description:'14 días consecutivos de estudio.',                             icon_url:'📅', criteria_json:{ streak_days:14 }},
  { slug:'explorador_nato',     name:'Explorador Nato',        description:'Respondiste al menos 5 preguntas en cada área.',               icon_url:'🗺️', criteria_json:{ all_subjects_5:true }},
  { slug:'noctambulo',          name:'Noctámbulo',             description:'Respondiste preguntas después de las 10pm (hora Colombia).',   icon_url:'🌙', criteria_json:{ late_night:true }},
];

// ══════════════════════════════════════════════════════════════
//  2. CARGAR BANCO.JS Y CONVERTIR PREGUNTAS
// ══════════════════════════════════════════════════════════════
function loadBanco() {
  const bancoPath = resolve(__dir, '../objetivo500/banco.js');
  const src       = readFileSync(bancoPath, 'utf8');

  // Evaluar el archivo en un sandbox con window simulado
  const sandbox = { window: {}, console };
  vm.createContext(sandbox);

  // Reemplazar CTX template literals que usan sintaxis JS
  // (El archivo usa backticks que vm maneja bien)
  try {
    vm.runInContext(src, sandbox, { filename: 'banco.js' });
  } catch (e) {
    throw new Error(`Error evaluando banco.js: ${e.message}`);
  }

  const raw = sandbox.window.BANCO_PREGUNTAS;
  if (!raw || !raw.length) throw new Error('BANCO_PREGUNTAS vacío o no encontrado');
  return raw;
}

const AREA_MAP = {
  'Lectura Crítica':       'lectura_critica',
  'Matemáticas':           'matematicas',
  'Sociales y Ciudadanas': 'sociales',
  'Ciencias Naturales':    'ciencias_naturales',
  'Inglés':                'ingles',
};

const NIVEL_MAP = { baja: 1, media: 2, alta: 3 };
const LETRA_MAP = { A: 0, B: 1, C: 2, D: 3 };

function transformQuestion(q) {
  return {
    subject:          AREA_MAP[q.area]             ?? q.area.toLowerCase().replace(/\s+/g,'_'),
    topic:            q.componente                 ?? q.competencia ?? 'General',
    difficulty:       NIVEL_MAP[q.nivel]           ?? 2,
    stem:             q.enunciado,
    context_text:     q.contexto                  ?? null,
    options_json:     [q.opciones.A, q.opciones.B, q.opciones.C, q.opciones.D],
    correct_index:    LETRA_MAP[q.respuesta]       ?? 0,
    explanation:      q.explicacion,
    icfes_competency: q.competencia               ?? null,
    distractor_type:  q.distractor_tipo           ?? null,
    concept_key:      q.concepto_clave            ?? null,
  };
}

// ══════════════════════════════════════════════════════════════
//  3. MAIN
// ══════════════════════════════════════════════════════════════
async function main() {
  console.log('\n🌱  Objetivo 500 — Seed script\n');
  console.log(`    Proyecto: ${SUPABASE_URL}\n`);

  // ── Insignias ───────────────────────────────────────────────
  console.log('Insertando insignias…');
  try {
    const existing = await countRows('badges');
    if (existing >= BADGES.length) {
      ok(`${existing} insignias ya presentes — omitiendo`);
    } else {
      await upsert('badges', BADGES, 'slug');
      ok(`${BADGES.length} insignias insertadas/actualizadas`);
    }
  } catch (e) {
    err(`Insignias: ${e.message}`);
    process.exit(1);
  }

  // ── Preguntas ───────────────────────────────────────────────
  console.log('\nCargando banco.js…');
  let preguntas;
  try {
    const raw = loadBanco();
    preguntas = raw.map(transformQuestion);
    ok(`${preguntas.length} preguntas cargadas de banco.js`);
  } catch (e) {
    err(`banco.js: ${e.message}`);
    process.exit(1);
  }

  console.log('Insertando preguntas en Supabase…');
  const existingQ = await countRows('questions');
  if (existingQ >= preguntas.length) {
    ok(`${existingQ} preguntas ya presentes — omitiendo\n`);
  } else {
    // Insertar en lotes de 20 para no superar el límite de payload
    const BATCH = 20;
    let insertadas = 0;
    for (let i = 0; i < preguntas.length; i += BATCH) {
      const lote = preguntas.slice(i, i + BATCH);
      try {
        await upsert('questions', lote);
        insertadas += lote.length;
        process.stdout.write(`  → ${insertadas}/${preguntas.length}\r`);
      } catch (e) {
        err(`Lote ${i}–${i + BATCH}: ${e.message}`);
      }
    }
    ok(`${insertadas} preguntas insertadas\n`);
  }

  // ── Verificación final ──────────────────────────────────────
  console.log('Verificando…');
  const [badgesRes, questionsRes] = await Promise.all([
    fetch(`${SUPABASE_URL}/rest/v1/badges?select=count`, { headers: HEADERS }),
    fetch(`${SUPABASE_URL}/rest/v1/questions?select=count`, { headers: HEADERS }),
  ]);

  const badges_count    = (await badgesRes.json()).length   ?? '?';
  const questions_count = (await questionsRes.json()).length ?? '?';

  // Usar header Content-Range para el conteo real
  const bCount = badgesRes.headers.get('content-range')?.split('/')[1]    ?? BADGES.length;
  const qCount = questionsRes.headers.get('content-range')?.split('/')[1] ?? insertadas;

  console.log(`\n  📊  badges:    ${bCount}`);
  console.log(`  📊  questions: ${qCount}`);
  console.log('\n✅  Seed completado. Ya puedes abrir login.html y crear tu primera cuenta.\n');
}

main().catch(e => { console.error('\n💥  Error fatal:', e.message); process.exit(1); });
