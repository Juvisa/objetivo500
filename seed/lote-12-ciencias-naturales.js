import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const questions = [
  {
    subject: 'ciencias_naturales', topic: 'Biología - Sistema nervioso', difficulty: 2,
    stem: '¿Cuál de las siguientes estructuras del sistema nervioso central actúa como centro de integración de las respuestas emocionales y la memoria a largo plazo?',
    options_json: { A: 'Cerebelo', B: 'Sistema límbico', C: 'Médula espinal', D: 'Tálamo' },
    correct_index: 'B',
    explanation: 'El sistema límbico, que incluye el hipocampo y la amígdala, integra emociones, motivaciones y aspectos de la memoria a largo plazo. El cerebelo coordina el movimiento; el tálamo actúa como relevo sensorial; la médula espinal conduce señales.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Química - Equilibrio ácido-base', difficulty: 2,
    stem: 'Una solución acuosa tiene una concentración de iones H⁺ de 1×10⁻⁹ mol/L. ¿Cuál es su pH y cómo se clasifica?',
    options_json: { A: 'pH = 5; ácida', B: 'pH = 7; neutra', C: 'pH = 9; básica', D: 'pH = 11; básica' },
    correct_index: 'C',
    explanation: 'pH = −log[H⁺] = −log(10⁻⁹) = 9. Valores de pH > 7 corresponden a soluciones básicas (alcalinas).',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Física - Óptica geométrica', difficulty: 2,
    stem: 'Un rayo de luz pasa del agua (n = 1,33) al vidrio (n = 1,50). ¿Qué ocurre con el rayo al cruzar la interfaz?',
    options_json: {
      A: 'Se refracta acercándose a la normal porque entra en un medio más denso ópticament.',
      B: 'Se refracta alejándose de la normal porque entra en un medio menos denso.',
      C: 'Se refleja totalmente porque supera el ángulo crítico.',
      D: 'Continúa recto sin cambiar dirección porque ambos medios son transparentes.',
    },
    correct_index: 'A',
    explanation: 'Al pasar a un medio con mayor índice de refracción (vidrio, n=1.50 > agua, n=1.33), la velocidad de la luz disminuye y el rayo se acerca a la normal. Ley de Snell: n₁·senθ₁ = n₂·senθ₂.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Biología - Metabolismo', difficulty: 3,
    stem: 'En condiciones de anaerobiosis, las células musculares producen lactato en lugar de completar la fosforilación oxidativa. ¿Cuál es la ventaja inmediata de la fermentación láctica?',
    options_json: {
      A: 'Produce más ATP por mol de glucosa que la respiración aerobia.',
      B: 'Regenera el NAD⁺ necesario para que la glucólisis pueda continuar.',
      C: 'Elimina el CO₂ acumulado en los tejidos musculares.',
      D: 'Sintetiza glucógeno para almacenamiento energético.',
    },
    correct_index: 'B',
    explanation: 'La fermentación láctica no produce más ATP; su función clave es oxidar el NADH a NAD⁺, regenerando el cofactor imprescindible para que la glucólisis siga produciendo ATP en ausencia de oxígeno.',
    icfes_competency: 'Explicación de fenómenos',
  },
  {
    subject: 'ciencias_naturales', topic: 'Física - Electrostática', difficulty: 3,
    stem: 'Dos cargas eléctricas idénticas Q se separan una distancia r. Si se duplica la distancia entre ellas, la fuerza electrostática resultante es:',
    options_json: { A: 'La misma', B: 'El doble', C: 'La mitad', D: 'Un cuarto' },
    correct_index: 'D',
    explanation: 'Ley de Coulomb: F = k·Q²/r². Si r → 2r, la fuerza F → k·Q²/(2r)² = k·Q²/4r² = F/4. La fuerza disminuye al cuarto de su valor original.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Química - Estequiometría', difficulty: 2,
    stem: 'En la reacción: N₂ + 3H₂ → 2NH₃, ¿cuántos moles de NH₃ se producen si reaccionan completamente 6 moles de H₂?',
    options_json: { A: '2 moles', B: '3 moles', C: '4 moles', D: '6 moles' },
    correct_index: 'C',
    explanation: 'La relación estequiométrica es 3 mol H₂ : 2 mol NH₃. Con 6 mol H₂: (6 mol H₂) × (2 mol NH₃ / 3 mol H₂) = 4 mol NH₃.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Biología - Genética molecular', difficulty: 3,
    stem: '¿Por qué la mutación de un nucleótido en el tercer codón del gen de la hemoglobina puede causar anemia falciforme?',
    options_json: {
      A: 'Porque cambia el sitio de inicio de la traducción, impidiendo la síntesis de hemoglobina.',
      B: 'Porque sustituye el ácido glutámico (hidrofílico) por valina (hidrofóbica), alterando la estructura y función de la proteína.',
      C: 'Porque introduce un codón de parada prematuro que trunca la cadena proteica.',
      D: 'Porque duplica el número de cromosomas en los eritrocitos.',
    },
    correct_index: 'B',
    explanation: 'La anemia falciforme resulta de la sustitución del ácido glutámico (GAG → GUG en el codón 6 del ARNm) por valina. Este cambio de un aminoácido cargado negativamente por uno hidrofóbico altera la solubilidad de la hemoglobina S bajo baja tensión de oxígeno, provocando polimerización y deformación de los glóbulos rojos.',
    icfes_competency: 'Explicación de fenómenos',
  },
]

const CI = { A: 0, B: 1, C: 2, D: 3 }

const rows = questions.map(q => ({
  subject:          q.subject,
  topic:            q.topic,
  difficulty:       q.difficulty,
  stem:             q.stem,
  context_text:     q.context ?? null,
  options_json:     [q.options_json.A, q.options_json.B, q.options_json.C, q.options_json.D],
  correct_index:    CI[q.correct_index],
  explanation:      q.explanation,
  icfes_competency: q.icfes_competency ?? null,
}))

async function seed() {
  console.log(`Insertando ${rows.length} preguntas de Ciencias Naturales (lote 12)…`)
  const { error } = await supabase.from('questions').insert(rows)
  if (error) { console.error('Error:', error.message); process.exit(1) }
  const { count } = await supabase.from('questions').select('*', { count: 'exact', head: true }).eq('subject', 'ciencias_naturales')
  console.log(`Listo. Total ciencias_naturales en BD: ${count}`)
}

seed()
