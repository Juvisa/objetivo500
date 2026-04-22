// FILE: seed/lote-6-lectura-critica.js
// Lote 6: 15 preguntas de Lectura Crítica — dificultad 3 (alta)
// Lleva el total de lectura_critica de ~191 a ~206

import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const CTX_CIENCIA = `La ciencia no avanza por acumulación de hechos sino por revoluciones. Según Thomas Kuhn, la ciencia normal opera dentro de un paradigma: un conjunto de suposiciones, métodos y ejemplos aceptados por la comunidad científica. Cuando los experimentos producen anomalías que el paradigma no puede explicar, se genera una crisis que eventualmente lleva a una revolución científica y el establecimiento de un nuevo paradigma. Este proceso no es lineal ni puramente racional: intervienen factores sociales, psicológicos y hasta generacionales. Los científicos más viejos frecuentemente resisten el nuevo paradigma, mientras que los jóvenes lo adoptan con mayor facilidad.

Tomado y adaptado de: Kuhn, T. S. (1962). La estructura de las revoluciones científicas. México: FCE.`

const CTX_LENGUAJE = `El lenguaje no es un simple instrumento de comunicación; es la condición misma del pensamiento. No pensamos y luego hablamos: pensamos en el lenguaje y a través de él. Esta tesis, defendida por el lingüista Benjamin Lee Whorf, se conoce como el determinismo lingüístico o hipótesis Sapir-Whorf. En su versión fuerte, sostiene que el lenguaje determina completamente lo que podemos pensar. En su versión débil, afirma que el lenguaje influye y moldea —pero no determina del todo— nuestra visión del mundo. Por ejemplo, las lenguas esquimales tienen múltiples palabras para "nieve", lo cual supuestamente permite a sus hablantes percibir diferencias que hablantes de otras lenguas no distinguirían.

Tomado y adaptado de: Whorf, B. L. (1956). Language, Thought and Reality. Cambridge: MIT Press.`

const CTX_DEMOCRACIA = `La democracia liberal enfrenta hoy una paradoja: ha triunfado como ideal político universal, pero languidece en la práctica. En casi todos los países que se llaman democráticos, la participación ciudadana decrece, la desconfianza en las instituciones crece y el poder real se concentra en élites tecnocráticas o en corporaciones transnacionales que escapan al control democrático. El filósofo Sheldon Wolin llamó a este fenómeno "democracia gestionada" o "totalitarismo invertido": un sistema que conserva las formas democráticas (elecciones, libertades formales) pero vacía su contenido real de deliberación colectiva y soberanía popular.

Tomado y adaptado de: Wolin, S. (2008). Democracy Incorporated. Princeton: Princeton University Press.`

const CTX_MEMORIA = `El olvido no es una falla de la memoria, sino una función activa y necesaria. Sin olvido, la memoria sería caótica: recuerdo de todo equivale a no poder distinguir lo relevante de lo irrelevante. El escritor argentino Jorge Luis Borges imaginó esta condena en su cuento "Funes el memorioso": un hombre que recuerda absolutamente todo y es, precisamente por eso, incapaz de pensar, pues pensar implica abstraer, generalizar, olvidar los detalles. La neurociencia moderna confirma esta intuición: los pacientes con hipermemoria (HSAM, Highly Superior Autobiographical Memory) frecuentemente reportan dificultades para planificar el futuro y tomar decisiones, ya que están permanentemente abrumados por el pasado.`

const CTX_MERCADO = `Adam Smith no era el apologista del mercado sin restricciones que sus defensores modernos suelen imaginar. En La riqueza de las naciones (1776) describe la "mano invisible" del mercado, pero también advierte que los empresarios conspiran contra el público cuando se reúnen, que los monopolios son destructivos, y que el Estado debe proveer bienes públicos que el mercado no produce: educación, infraestructura, defensa. Smith escribía contra el mercantilismo estatal de su época, no a favor de un capitalismo sin regulación. La apropiación ideológica de Smith por el neoliberalismo del siglo XX constituye una lectura selectiva que ignora sus prevenciones y matices.

Tomado y adaptado de: Smith, A. (1776). La riqueza de las naciones. Edición moderna: Alianza Editorial, 2011.`

const questions = [

  // ─── TEXTO: KUHN ────────────────────────────────────────────────────────────
  {
    subject: 'lectura_critica',
    topic: 'Análisis de argumentos',
    difficulty: 3,
    context: CTX_CIENCIA,
    stem: 'Según el texto, la resistencia de los científicos mayores al nuevo paradigma evidencia que el cambio científico es fundamentalmente:',
    options_json: {
      A: 'un proceso puramente lógico basado en la acumulación de evidencias.',
      B: 'un fenómeno que trasciende la racionalidad pura e involucra factores humanos.',
      C: 'una imposición generacional de los científicos jóvenes sobre los mayores.',
      D: 'una consecuencia directa de la incapacidad de los científicos para comprender datos nuevos.',
    },
    correct_index: 'B',
    explanation: 'El texto afirma explícitamente que "no es lineal ni puramente racional: intervienen factores sociales, psicológicos y hasta generacionales", lo que apunta a que la ciencia no es solo un proceso lógico sino también humano. La opción A contradice directamente el texto. La C distorsiona la idea de resistencia. La D introduce una explicación de "incapacidad" que el texto no sostiene.',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica',
    topic: 'Análisis de argumentos',
    difficulty: 3,
    context: CTX_CIENCIA,
    stem: 'El concepto de "ciencia normal" tal como lo usa Kuhn en el texto se refiere a:',
    options_json: {
      A: 'la ciencia que sigue los métodos correctos y produce resultados válidos.',
      B: 'la actividad científica cotidiana que opera dentro de un marco de supuestos aceptados.',
      C: 'la ciencia que evita cometer errores y anomalías en sus experimentos.',
      D: 'el estado ideal de la ciencia cuando ha alcanzado su máximo desarrollo.',
    },
    correct_index: 'B',
    explanation: '"Ciencia normal" se define en el texto como aquella que "opera dentro de un paradigma: un conjunto de suposiciones, métodos y ejemplos aceptados". No tiene connotación valorativa (no significa "correcta" ni "ideal"), sino descriptiva del trabajo científico ordinario dentro de un marco compartido.',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica',
    topic: 'Evaluación de argumentos',
    difficulty: 3,
    context: CTX_CIENCIA,
    stem: 'Una persona afirma: "La teoría de Kuhn demuestra que la ciencia es irracional y sus conclusiones son arbitrarias". Esta interpretación del texto es:',
    options_json: {
      A: 'correcta, porque el texto señala que factores no racionales intervienen en el cambio científico.',
      B: 'incorrecta, porque confunde la presencia de factores no racionales con la ausencia total de racionalidad.',
      C: 'correcta, porque Kuhn sostiene que las revoluciones científicas son puramente sociológicas.',
      D: 'incorrecta, porque el texto afirma que la ciencia sí es completamente racional y lineal.',
    },
    correct_index: 'B',
    explanation: 'El texto dice que el proceso "no es lineal ni puramente racional", lo que implica que hay racionalidad pero también otros factores. Decir que es "irracional" o "arbitraria" es una distorsión: reconocer factores sociales y psicológicos no equivale a negar toda racionalidad. La D es también incorrecta porque contradice el texto.',
    icfes_competency: 'Reflexión y evaluación del contenido',
  },

  // ─── TEXTO: WHORF ───────────────────────────────────────────────────────────
  {
    subject: 'lectura_critica',
    topic: 'Comprensión de lectura',
    difficulty: 3,
    context: CTX_LENGUAJE,
    stem: '¿Cuál es la diferencia principal entre la versión "fuerte" y la versión "débil" de la hipótesis Sapir-Whorf según el texto?',
    options_json: {
      A: 'La versión fuerte aplica solo a lenguas primitivas; la débil, a todas las lenguas.',
      B: 'La versión fuerte postula determinación total del pensamiento por el lenguaje; la débil, solo influencia.',
      C: 'La versión fuerte es científicamente aceptada; la débil, rechazada por los lingüistas modernos.',
      D: 'La versión fuerte considera que el pensamiento precede al lenguaje; la débil, lo contrario.',
    },
    correct_index: 'B',
    explanation: 'El texto lo dice claramente: la versión fuerte sostiene que "el lenguaje determina completamente lo que podemos pensar", mientras que la débil afirma que "influye y moldea —pero no determina del todo— nuestra visión del mundo". La distinción clave es entre determinación total e influencia parcial.',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica',
    topic: 'Propósito del autor',
    difficulty: 3,
    context: CTX_LENGUAJE,
    stem: 'La mención de las "lenguas esquimales" y sus múltiples palabras para "nieve" cumple en el texto la función de:',
    options_json: {
      A: 'refutar la hipótesis Sapir-Whorf con un contraejemplo etnográfico.',
      B: 'ilustrar con un ejemplo concreto cómo el lenguaje puede influir en la percepción.',
      C: 'demostrar que las lenguas primitivas son superiores en capacidad descriptiva.',
      D: 'argumentar que el pensamiento existe independientemente del lenguaje.',
    },
    correct_index: 'B',
    explanation: 'El ejemplo de las palabras esquimales para "nieve" se introduce con "por ejemplo" para apoyar la hipótesis de que el lenguaje moldea la percepción: más palabras para un fenómeno permite distinguir matices que otros hablantes no distinguen. No es una refutación ni implica superioridad de lengua alguna.',
    icfes_competency: 'Reflexión y evaluación del contenido',
  },

  // ─── TEXTO: DEMOCRACIA ──────────────────────────────────────────────────────
  {
    subject: 'lectura_critica',
    topic: 'Análisis de argumentos',
    difficulty: 3,
    context: CTX_DEMOCRACIA,
    stem: 'Según el texto, el término "totalitarismo invertido" de Wolin se refiere a:',
    options_json: {
      A: 'regímenes que adoptaron el totalitarismo luego de haber sido democracias.',
      B: 'sistemas que mantienen formas democráticas pero vacían su contenido real.',
      C: 'la transformación de las democracias en dictaduras abiertas.',
      D: 'el control de las democracias por parte de partidos de extrema izquierda.',
    },
    correct_index: 'B',
    explanation: 'El texto define explícitamente el concepto: "un sistema que conserva las formas democráticas (elecciones, libertades formales) pero vacía su contenido real de deliberación colectiva y soberanía popular". Es una democracia de fachada, no un régimen abiertamente totalitario ni de izquierda.',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica',
    topic: 'Estructura del texto',
    difficulty: 3,
    context: CTX_DEMOCRACIA,
    stem: 'La "paradoja" que menciona el autor en la primera oración consiste en que:',
    options_json: {
      A: 'la democracia es un ideal imposible de alcanzar en la práctica real.',
      B: 'la democracia ha triunfado como ideal pero se deteriora como práctica concreta.',
      C: 'las élites promueven la democracia solo cuando les resulta conveniente.',
      D: 'más democracia formal conduce paradójicamente a más autoritarismo real.',
    },
    correct_index: 'B',
    explanation: 'La paradoja está formulada explícitamente: "ha triunfado como ideal político universal, pero languidece en la práctica". El contraste entre triunfo ideal y decadencia práctica es la contradicción que el autor señala como paradójica.',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica',
    topic: 'Evaluación de argumentos',
    difficulty: 3,
    context: CTX_DEMOCRACIA,
    stem: 'Un defensor de las democracias actuales podría objetar el argumento del texto afirmando que:',
    options_json: {
      A: 'Wolin es un filósofo desconocido y sin credibilidad académica.',
      B: 'la participación ciudadana ha aumentado gracias a las redes sociales y nuevas formas de activismo.',
      C: 'las élites siempre han existido y eso no afecta la calidad de la democracia.',
      D: 'la democracia liberal es el único sistema político viable y por tanto debe defenderse incondicionalmente.',
    },
    correct_index: 'B',
    explanation: 'La objeción más pertinente al argumento del texto (que la participación decrece) sería demostrar que en realidad la participación ha aumentado por nuevas vías. Las demás opciones son falacias: atacar a la fuente (A), aceptar la premisa sin refutarla (C), o recurrir a la necesidad sin contradecir los hechos (D).',
    icfes_competency: 'Reflexión y evaluación del contenido',
  },

  // ─── TEXTO: MEMORIA ─────────────────────────────────────────────────────────
  {
    subject: 'lectura_critica',
    topic: 'Relación entre textos',
    difficulty: 3,
    context: CTX_MEMORIA,
    stem: 'La función de la referencia a "Funes el memorioso" de Borges dentro del argumento del texto es:',
    options_json: {
      A: 'demostrar que la literatura puede predecir descubrimientos científicos.',
      B: 'ilustrar literariamente la tesis de que el olvido cumple una función cognitiva necesaria.',
      C: 'criticar la tendencia de los neurocientíficos a apoyarse en la ficción.',
      D: 'mostrar que Borges era un precursor de la neurociencia moderna.',
    },
    correct_index: 'B',
    explanation: 'El cuento de Borges se introduce para "imaginar" de forma literaria lo que el texto argumenta: que sin olvido la mente colapsa. Es un recurso ilustrativo que apoya la tesis central. La neurociencia se menciona después como confirmación empírica, pero el rol del cuento es ilustrar, no predecir ni criticar a los científicos.',
    icfes_competency: 'Reflexión y evaluación del contenido',
  },
  {
    subject: 'lectura_critica',
    topic: 'Inferencias',
    difficulty: 3,
    context: CTX_MEMORIA,
    stem: 'De la afirmación "pensar implica abstraer, generalizar, olvidar los detalles", se puede inferir que:',
    options_json: {
      A: 'una persona que recuerde todos los detalles no puede formar conceptos generales.',
      B: 'el pensamiento abstracto es inferior al pensamiento detallado y concreto.',
      C: 'olvidar es siempre perjudicial para la capacidad intelectual.',
      D: 'los detalles son irrelevantes para el conocimiento humano.',
    },
    correct_index: 'A',
    explanation: 'Si pensar requiere olvidar detalles para abstraer y generalizar, entonces quien lo recuerda todo no puede hacer ese proceso cognitivo, es decir, no puede formar conceptos ni pensar abstractamente. El caso de Funes lo ejemplifica: recuerda todo y precisamente por eso es incapaz de pensar. Las demás opciones invierten o exageran la idea.',
    icfes_competency: 'Comprensión e interpretación textual',
  },

  // ─── TEXTO: ADAM SMITH ──────────────────────────────────────────────────────
  {
    subject: 'lectura_critica',
    topic: 'Propósito del autor',
    difficulty: 3,
    context: CTX_MERCADO,
    stem: 'El propósito principal del texto es:',
    options_json: {
      A: 'demostrar que Adam Smith era en realidad un pensador socialista.',
      B: 'corregir una interpretación ideológica distorsionada del pensamiento de Adam Smith.',
      C: 'argumentar que el mercado libre es la mejor forma de organizar la economía.',
      D: 'explicar el origen histórico del capitalismo moderno.',
    },
    correct_index: 'B',
    explanation: 'El texto busca recuperar la complejidad del pensamiento de Smith frente a la "apropiación ideológica" neoliberal que lo usa como justificación del mercado sin regulación. El autor señala que esa lectura es "selectiva" y omite las advertencias de Smith. No pretende hacer de Smith un socialista ni defender el libre mercado.',
    icfes_competency: 'Reflexión y evaluación del contenido',
  },
  {
    subject: 'lectura_critica',
    topic: 'Análisis de argumentos',
    difficulty: 3,
    context: CTX_MERCADO,
    stem: 'Según el texto, Smith escribió La riqueza de las naciones principalmente contra:',
    options_json: {
      A: 'el capitalismo industrial que comenzaba a desarrollarse en su época.',
      B: 'el socialismo utópico de los pensadores de la Ilustración.',
      C: 'el mercantilismo estatal que dominaba la política económica de su tiempo.',
      D: 'los monopolios privados que controlaban el comercio internacional.',
    },
    correct_index: 'C',
    explanation: 'El texto afirma literalmente: "Smith escribía contra el mercantilismo estatal de su época, no a favor de un capitalismo sin regulación". El mercantilismo era el sistema que controlaba y restringía el comercio mediante intervención estatal. Smith criticaba ese sistema, no el capitalismo industrial (que apenas nacía) ni el socialismo (que aún no existía como corriente).',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica',
    topic: 'Evaluación de argumentos',
    difficulty: 3,
    context: CTX_MERCADO,
    stem: 'La expresión "lectura selectiva" que usa el autor para describir la apropiación neoliberal de Smith implica que:',
    options_json: {
      A: 'los neoliberales leyeron a Smith en idiomas distintos al inglés original.',
      B: 'los neoliberales solo tomaron las partes de Smith que convenían a sus intereses, ignorando el resto.',
      C: 'Smith solo debe ser leído por economistas especializados y no por el público general.',
      D: 'la obra de Smith es tan extensa que es imposible leerla en su totalidad.',
    },
    correct_index: 'B',
    explanation: '"Lectura selectiva" es una expresión crítica que indica que se tomaron ciertos fragmentos convenientes (la "mano invisible", el mercado libre) ignorando otros que los contradicen (las advertencias sobre monopolios, la necesidad del Estado en bienes públicos). Es una acusación de parcialidad interpretativa.',
    icfes_competency: 'Reflexión y evaluación del contenido',
  },
  {
    subject: 'lectura_critica',
    topic: 'Síntesis',
    difficulty: 3,
    context: CTX_MERCADO,
    stem: '¿Cuál de las siguientes afirmaciones resume mejor la posición del autor respecto a Adam Smith?',
    options_json: {
      A: 'Smith fue un defensor del libre mercado sin restricciones, como afirman los neoliberales.',
      B: 'Smith fue un pensador contradictorio que no tenía una posición coherente sobre el mercado.',
      C: 'Smith tenía una visión más matizada del mercado, incluyendo advertencias sobre sus límites.',
      D: 'Smith rechazaba completamente el mercado y abogaba por la intervención estatal total.',
    },
    correct_index: 'C',
    explanation: 'El texto presenta a un Smith que reconoce las virtudes del mercado (mano invisible) pero también sus límites (monopolios dañinos, bienes públicos que el Estado debe proveer). Esa es una posición matizada, diferente tanto del librecambismo absoluto como del estatismo total. No hay contradicción sino complejidad.',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica',
    topic: 'Inferencias',
    difficulty: 3,
    context: null,
    stem: 'Lee el siguiente argumento: "La mejor forma de proteger el medio ambiente es a través del mercado: si los consumidores prefieren productos ecológicos, las empresas se verán forzadas a producirlos." La principal debilidad de este argumento es que:',
    options_json: {
      A: 'los consumidores nunca prefieren productos ecológicos bajo ninguna circunstancia.',
      B: 'ignora que muchos daños ambientales son causados por empresas, no por consumidores individuales.',
      C: 'supone que los consumidores tienen información perfecta y capacidad de elección sin restricciones.',
      D: 'el mercado ya ha demostrado históricamente ser incapaz de producir bienes de cualquier tipo.',
    },
    correct_index: 'C',
    explanation: 'El argumento asume que los consumidores pueden identificar productos ecológicos (información perfecta), tienen poder de compra suficiente para elegirlos (sin restricción de precios) y que sus decisiones individuales son suficientes para transformar mercados enteros. Estas son suposiciones fuertes que la realidad desmiente frecuentemente. La B también señala un límite real pero no es la debilidad lógica central del argumento presentado.',
    icfes_competency: 'Reflexión y evaluación del contenido',
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
  console.log(`📦 Insertando ${rows.length} preguntas de Lectura Crítica (dificultad alta)…`)
  const { data, error } = await supabase.from('questions').insert(rows).select('id')
  if (error) { console.error('❌ Error:', error.message); process.exit(1) }
  console.log(`✅ ${data.length} preguntas insertadas.`)
  const { count } = await supabase.from('questions').select('*', { count: 'exact', head: true }).eq('subject', 'lectura_critica')
  console.log(`📊 Total lectura_critica en BD: ${count}`)
}

seed()
