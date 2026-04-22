import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 100 preguntas de Lectura Crítica — difficulty 1 (fácil×60) y 2 (medio×40)
// Competencias: Comprensión e interpretación textual · Literatura
//               Medios de comunicación y otros sistemas simbólicos

const questions = [

  // ══════════════════════════════════════════════════════
  // BLOQUE A — TEXTO INFORMATIVO 1 (preguntas 1-6, fácil)
  // ══════════════════════════════════════════════════════
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 1,
    context: `El agua cubre aproximadamente el 71 % de la superficie terrestre, pero solo el 2.5 % es agua dulce. De ese porcentaje, casi el 69 % está atrapado en glaciares y casquetes polares. Esto significa que menos del 1 % del agua del planeta está disponible para el consumo humano. La gestión responsable de este recurso es uno de los grandes desafíos del siglo XXI.`,
    stem: '¿Cuál es la idea principal del texto?',
    options_json: {
      A: 'El agua dulce disponible para el consumo humano es muy escasa.',
      B: 'El 71 % de la Tierra está cubierta de agua salada.',
      C: 'Los glaciares representan la mayor amenaza ambiental.',
      D: 'El siglo XXI será el siglo del agua.',
    },
    correct_index: 'A',
    explanation: 'El texto plantea que, pese a la abundancia de agua en el planeta, la fracción accesible para el ser humano es mínima. Esa escasez es el eje de la información.',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 1,
    context: `El agua cubre aproximadamente el 71 % de la superficie terrestre, pero solo el 2.5 % es agua dulce. De ese porcentaje, casi el 69 % está atrapado en glaciares y casquetes polares. Esto significa que menos del 1 % del agua del planeta está disponible para el consumo humano. La gestión responsable de este recurso es uno de los grandes desafíos del siglo XXI.`,
    stem: 'Según el texto, ¿qué porcentaje del agua dulce está atrapado en glaciares?',
    options_json: { A: '69 %', B: '2.5 %', C: '71 %', D: '1 %' },
    correct_index: 'A',
    explanation: 'El texto indica explícitamente: "casi el 69 % está atrapado en glaciares y casquetes polares".',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 1,
    context: `El agua cubre aproximadamente el 71 % de la superficie terrestre, pero solo el 2.5 % es agua dulce. De ese porcentaje, casi el 69 % está atrapado en glaciares y casquetes polares. Esto significa que menos del 1 % del agua del planeta está disponible para el consumo humano. La gestión responsable de este recurso es uno de los grandes desafíos del siglo XXI.`,
    stem: 'La expresión "gestión responsable" en el texto sugiere que:',
    options_json: {
      A: 'El uso del agua debe planificarse con cuidado.',
      B: 'Solo los gobiernos deben administrar el agua.',
      C: 'El agua es un recurso renovable ilimitado.',
      D: 'La tecnología resolverá la escasez de agua.',
    },
    correct_index: 'A',
    explanation: '"Gestión responsable" implica planificación y cuidado en el uso del recurso, reconociendo su limitación.',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 1,
    context: `El agua cubre aproximadamente el 71 % de la superficie terrestre, pero solo el 2.5 % es agua dulce. De ese porcentaje, casi el 69 % está atrapado en glaciares y casquetes polares. Esto significa que menos del 1 % del agua del planeta está disponible para el consumo humano. La gestión responsable de este recurso es uno de los grandes desafíos del siglo XXI.`,
    stem: 'El texto está organizado principalmente de manera:',
    options_json: {
      A: 'De lo general a lo específico, presentando datos que concluyen en un problema.',
      B: 'Cronológicamente, narrando la historia del agua.',
      C: 'Comparativa, contraponiendo agua salada y dulce sin conclusión.',
      D: 'Argumentativa, defendiendo la posición de los ambientalistas.',
    },
    correct_index: 'A',
    explanation: 'Parte de cifras globales (71 %) y va estrechando hasta llegar al dato crítico (<1 %) y la conclusión sobre el desafío.',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 1,
    context: `El agua cubre aproximadamente el 71 % de la superficie terrestre, pero solo el 2.5 % es agua dulce. De ese porcentaje, casi el 69 % está atrapado en glaciares y casquetes polares. Esto significa que menos del 1 % del agua del planeta está disponible para el consumo humano. La gestión responsable de este recurso es uno de los grandes desafíos del siglo XXI.`,
    stem: 'La palabra "recurso" en el texto hace referencia a:',
    options_json: { A: 'El agua dulce disponible', B: 'Los glaciares', C: 'El siglo XXI', D: 'La superficie terrestre' },
    correct_index: 'A',
    explanation: 'El pronombre referencial "este recurso" retoma el tema del párrafo: el agua dulce accesible para el consumo.',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 1,
    context: `El agua cubre aproximadamente el 71 % de la superficie terrestre, pero solo el 2.5 % es agua dulce. De ese porcentaje, casi el 69 % está atrapado en glaciares y casquetes polares. Esto significa que menos del 1 % del agua del planeta está disponible para el consumo humano. La gestión responsable de este recurso es uno de los grandes desafíos del siglo XXI.`,
    stem: '¿Con qué propósito el autor incluye tantos datos numéricos?',
    options_json: {
      A: 'Para demostrar objetivamente la gravedad de la escasez hídrica.',
      B: 'Para confundir al lector con estadísticas complejas.',
      C: 'Para mostrar que el planeta tiene agua suficiente.',
      D: 'Para cumplir un requisito académico de citar fuentes.',
    },
    correct_index: 'A',
    explanation: 'Los porcentajes cuantifican la escasez y dan credibilidad al argumento; hacen que la gravedad del problema sea evidente.',
    icfes_competency: 'Comprensión e interpretación textual',
  },

  // ══════════════════════════════════════════════════════
  // BLOQUE B — TEXTO LITERARIO (cuento breve, preguntas 7-13, fácil)
  // ══════════════════════════════════════════════════════
  {
    subject: 'lectura_critica', topic: 'Literatura', difficulty: 1,
    context: `"Cuando amaneció, vio que su sombra había desaparecido. No sintió miedo; simplemente pensó que, por fin, podría caminar bajo el sol sin dar explicaciones."`,
    stem: '¿Cuál es el tono predominante del fragmento?',
    options_json: { A: 'Tranquilo y liberador', B: 'Angustioso y oscuro', C: 'Irónico y burlesco', D: 'Nostálgico y melancólico' },
    correct_index: 'A',
    explanation: 'La ausencia de miedo y la idea de "por fin" proyectan una sensación de alivio y libertad, no de angustia.',
    icfes_competency: 'Literatura',
  },
  {
    subject: 'lectura_critica', topic: 'Literatura', difficulty: 1,
    context: `"Cuando amaneció, vio que su sombra había desaparecido. No sintió miedo; simplemente pensó que, por fin, podría caminar bajo el sol sin dar explicaciones."`,
    stem: 'La sombra en el fragmento puede interpretarse como símbolo de:',
    options_json: {
      A: 'Un peso o carga del pasado de la que el personaje se libera.',
      B: 'La oscuridad del sol al mediodía.',
      C: 'Un compañero fiel que siempre acompaña.',
      D: 'El miedo irracional a la luz.',
    },
    correct_index: 'A',
    explanation: 'La desaparición de la sombra se asocia con liberación; "sin dar explicaciones" refuerza la idea de que era algo que lo limitaba o cuestionaba.',
    icfes_competency: 'Literatura',
  },
  {
    subject: 'lectura_critica', topic: 'Literatura', difficulty: 1,
    context: `"Cuando amaneció, vio que su sombra había desaparecido. No sintió miedo; simplemente pensó que, por fin, podría caminar bajo el sol sin dar explicaciones."`,
    stem: 'La frase "sin dar explicaciones" sugiere que el personaje:',
    options_json: {
      A: 'Se sentía juzgado o cuestionado por otros.',
      B: 'Era incapaz de hablar.',
      C: 'Prefería la soledad a la compañía.',
      D: 'Tenía secretos peligrosos.',
    },
    correct_index: 'A',
    explanation: 'La expresión implica que antes debía justificarse; ahora, libre de su sombra, ya no necesita hacerlo.',
    icfes_competency: 'Literatura',
  },
  {
    subject: 'lectura_critica', topic: 'Literatura', difficulty: 1,
    context: `"Cuando amaneció, vio que su sombra había desaparecido. No sintió miedo; simplemente pensó que, por fin, podría caminar bajo el sol sin dar explicaciones."`,
    stem: 'El recurso literario que usa el autor al darle importancia a la sombra es:',
    options_json: { A: 'Simbolismo', B: 'Hipérbole', C: 'Aliteración', D: 'Anáfora' },
    correct_index: 'A',
    explanation: 'La sombra representa algo más allá de su significado literal (proyección de luz bloqueada); ese uso figurado constituye simbolismo.',
    icfes_competency: 'Literatura',
  },
  {
    subject: 'lectura_critica', topic: 'Literatura', difficulty: 1,
    context: `"Cuando amaneció, vio que su sombra había desaparecido. No sintió miedo; simplemente pensó que, por fin, podría caminar bajo el sol sin dar explicaciones."`,
    stem: '¿Qué tipo de narrador cuenta la historia?',
    options_json: {
      A: 'Narrador en tercera persona (omnisciente)',
      B: 'Narrador en primera persona',
      C: 'Narrador en segunda persona',
      D: 'Narrador implícito sin perspectiva definida',
    },
    correct_index: 'A',
    explanation: '"Vio", "sintió", "pensó" son verbos en tercera persona; además conoce los pensamientos del personaje, propio del narrador omnisciente.',
    icfes_competency: 'Literatura',
  },
  {
    subject: 'lectura_critica', topic: 'Literatura', difficulty: 1,
    context: `"Cuando amaneció, vio que su sombra había desaparecido. No sintió miedo; simplemente pensó que, por fin, podría caminar bajo el sol sin dar explicaciones."`,
    stem: 'El fragmento pertenece al género:',
    options_json: { A: 'Narrativo', B: 'Lírico', C: 'Dramático', D: 'Ensayístico' },
    correct_index: 'A',
    explanation: 'Hay un personaje, una acción y un narrador: características propias del género narrativo (cuento/relato).',
    icfes_competency: 'Literatura',
  },
  {
    subject: 'lectura_critica', topic: 'Literatura', difficulty: 1,
    context: `"Cuando amaneció, vio que su sombra había desaparecido. No sintió miedo; simplemente pensó que, por fin, podría caminar bajo el sol sin dar explicaciones."`,
    stem: 'La conjunción "simplemente" en el texto cumple la función de:',
    options_json: {
      A: 'Minimizar la reacción del personaje, haciendo el hecho más sorprendente.',
      B: 'Indicar que el hecho era predecible.',
      C: 'Contrastar con la oración anterior.',
      D: 'Introducir una explicación científica.',
    },
    correct_index: 'A',
    explanation: 'Al decir "simplemente pensó" ante algo extraordinario (perder la sombra), el narrador resalta la calma del personaje de forma llamativa.',
    icfes_competency: 'Literatura',
  },

  // ══════════════════════════════════════════════════════
  // BLOQUE C — TEXTO ARGUMENTATIVO (preguntas 14-20, fácil)
  // ══════════════════════════════════════════════════════
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 1,
    context: `Las redes sociales han transformado la manera en que los jóvenes se comunican. Por un lado, facilitan el contacto con personas de todo el mundo y democratizan el acceso a la información. Por otro lado, estudios recientes señalan que el uso excesivo se asocia con ansiedad, comparación social y disminución de la atención. El reto está en encontrar un uso equilibrado que aproveche sus ventajas sin sacrificar el bienestar mental.`,
    stem: '¿Cuál es la postura del autor frente a las redes sociales?',
    options_json: {
      A: 'Ni completamente positiva ni negativa; propone un uso equilibrado.',
      B: 'Totalmente negativa; recomienda prohibirlas entre jóvenes.',
      C: 'Totalmente positiva; celebra su impacto en la comunicación.',
      D: 'Indiferente; solo describe hechos sin opinar.',
    },
    correct_index: 'A',
    explanation: 'El texto presenta ventajas e inconvenientes y concluye con "uso equilibrado", lo que evidencia una postura moderada.',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 1,
    context: `Las redes sociales han transformado la manera en que los jóvenes se comunican. Por un lado, facilitan el contacto con personas de todo el mundo y democratizan el acceso a la información. Por otro lado, estudios recientes señalan que el uso excesivo se asocia con ansiedad, comparación social y disminución de la atención. El reto está en encontrar un uso equilibrado que aproveche sus ventajas sin sacrificar el bienestar mental.`,
    stem: 'La expresión "democratizan el acceso" significa que:',
    options_json: {
      A: 'Más personas pueden acceder a la información sin importar su origen.',
      B: 'Solo los ciudadanos con derechos políticos pueden usarlas.',
      C: 'Se realizan votaciones en línea para decidir el contenido.',
      D: 'Las redes apoyan movimientos democráticos.',
    },
    correct_index: 'A',
    explanation: '"Democratizar" implica hacer algo accesible a todos; aquí se refiere a que la información llega a mayor número de personas.',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 1,
    context: `Las redes sociales han transformado la manera en que los jóvenes se comunican. Por un lado, facilitan el contacto con personas de todo el mundo y democratizan el acceso a la información. Por otro lado, estudios recientes señalan que el uso excesivo se asocia con ansiedad, comparación social y disminución de la atención. El reto está en encontrar un uso equilibrado que aproveche sus ventajas sin sacrificar el bienestar mental.`,
    stem: 'Las expresiones "por un lado" y "por otro lado" cumplen la función de:',
    options_json: {
      A: 'Presentar dos perspectivas contrapuestas del mismo fenómeno.',
      B: 'Indicar una secuencia temporal de eventos.',
      C: 'Introducir ejemplos que confirman una sola idea.',
      D: 'Enumerar causas de un mismo efecto.',
    },
    correct_index: 'A',
    explanation: 'Son conectores de contraste que organizan el texto presentando ventajas y desventajas en paralelo.',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 1,
    context: `Las redes sociales han transformado la manera en que los jóvenes se comunican. Por un lado, facilitan el contacto con personas de todo el mundo y democratizan el acceso a la información. Por otro lado, estudios recientes señalan que el uso excesivo se asocia con ansiedad, comparación social y disminución de la atención. El reto está en encontrar un uso equilibrado que aproveche sus ventajas sin sacrificar el bienestar mental.`,
    stem: 'La referencia a "estudios recientes" busca principalmente:',
    options_json: {
      A: 'Dar respaldo científico a los efectos negativos señalados.',
      B: 'Mostrar que los científicos estudian poco las redes.',
      C: 'Introducir datos históricos sobre la tecnología.',
      D: 'Contradecir la primera parte del texto.',
    },
    correct_index: 'A',
    explanation: 'Citar estudios aporta autoridad y credibilidad a los argumentos negativos sobre el uso excesivo.',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 1,
    context: `Las redes sociales han transformado la manera en que los jóvenes se comunican. Por un lado, facilitan el contacto con personas de todo el mundo y democratizan el acceso a la información. Por otro lado, estudios recientes señalan que el uso excesivo se asocia con ansiedad, comparación social y disminución de la atención. El reto está en encontrar un uso equilibrado que aproveche sus ventajas sin sacrificar el bienestar mental.`,
    stem: 'El texto podría publicarse en:',
    options_json: {
      A: 'Una revista de divulgación o un editorial periodístico.',
      B: 'Un manual de instrucciones de una aplicación.',
      C: 'Una novela de ciencia ficción.',
      D: 'Una ley o decreto gubernamental.',
    },
    correct_index: 'A',
    explanation: 'El tono reflexivo, la presentación de pros y contras y la conclusión valorativa son típicos de textos de divulgación o editoriales.',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 1,
    context: `Las redes sociales han transformado la manera en que los jóvenes se comunican. Por un lado, facilitan el contacto con personas de todo el mundo y democratizan el acceso a la información. Por otro lado, estudios recientes señalan que el uso excesivo se asocia con ansiedad, comparación social y disminución de la atención. El reto está en encontrar un uso equilibrado que aproveche sus ventajas sin sacrificar el bienestar mental.`,
    stem: 'Según el texto, ¿cuál de los siguientes efectos NO se menciona como consecuencia del uso excesivo?',
    options_json: {
      A: 'Adicción a los videojuegos.',
      B: 'Ansiedad.',
      C: 'Comparación social.',
      D: 'Disminución de la atención.',
    },
    correct_index: 'A',
    explanation: 'El texto nombra ansiedad, comparación social y falta de atención; la adicción a videojuegos no aparece.',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 1,
    context: `Las redes sociales han transformado la manera en que los jóvenes se comunican. Por un lado, facilitan el contacto con personas de todo el mundo y democratizan el acceso a la información. Por otro lado, estudios recientes señalan que el uso excesivo se asocia con ansiedad, comparación social y disminución de la atención. El reto está en encontrar un uso equilibrado que aproveche sus ventajas sin sacrificar el bienestar mental.`,
    stem: 'La conclusión del texto ("El reto está en…") tiene el propósito de:',
    options_json: {
      A: 'Proponer una solución práctica al problema planteado.',
      B: 'Introducir un nuevo problema sin resolver.',
      C: 'Contradecir todo lo dicho antes.',
      D: 'Dar una orden directa al lector.',
    },
    correct_index: 'A',
    explanation: 'La oración de cierre propone el equilibrio como solución, cerrando el argumento con una propuesta concreta.',
    icfes_competency: 'Comprensión e interpretación textual',
  },

  // ══════════════════════════════════════════════════════
  // BLOQUE D — TEXTO POÉTICO (preguntas 21-27, fácil)
  // ══════════════════════════════════════════════════════
  {
    subject: 'lectura_critica', topic: 'Literatura', difficulty: 1,
    context: `"El mar no tiene dueño,\nnadie lo cobra ni lo vende.\nSolo el horizonte lo conoce\ny él también se pierde."`,
    stem: '¿Cuál es el tema central del poema?',
    options_json: {
      A: 'La libertad del mar frente a la posesión humana.',
      B: 'La tristeza de los pescadores.',
      C: 'Los peligros de navegar por el océano.',
      D: 'La contaminación del mar.',
    },
    correct_index: 'A',
    explanation: '"No tiene dueño", "nadie lo cobra ni lo vende" apuntan a la libertad del mar como eje temático.',
    icfes_competency: 'Literatura',
  },
  {
    subject: 'lectura_critica', topic: 'Literatura', difficulty: 1,
    context: `"El mar no tiene dueño,\nnadie lo cobra ni lo vende.\nSolo el horizonte lo conoce\ny él también se pierde."`,
    stem: 'La expresión "él también se pierde" hace referencia a:',
    options_json: { A: 'El horizonte', B: 'El dueño del mar', C: 'El poema mismo', D: 'El lector' },
    correct_index: 'A',
    explanation: 'El pronombre "él" retoma al sujeto más cercano: el horizonte, que también es difuso y se "pierde" en el mar.',
    icfes_competency: 'Literatura',
  },
  {
    subject: 'lectura_critica', topic: 'Literatura', difficulty: 1,
    context: `"El mar no tiene dueño,\nnadie lo cobra ni lo vende.\nSolo el horizonte lo conoce\ny él también se pierde."`,
    stem: 'La figura retórica presente en "el horizonte lo conoce" es:',
    options_json: { A: 'Personificación', B: 'Metáfora', C: 'Símil', D: 'Hipérbole' },
    correct_index: 'A',
    explanation: 'Se atribuye al horizonte la capacidad de "conocer", que es una cualidad humana: personificación.',
    icfes_competency: 'Literatura',
  },
  {
    subject: 'lectura_critica', topic: 'Literatura', difficulty: 1,
    context: `"El mar no tiene dueño,\nnadie lo cobra ni lo vende.\nSolo el horizonte lo conoce\ny él también se pierde."`,
    stem: 'La estructura "nadie… ni…" en el poema cumple la función de:',
    options_json: {
      A: 'Reforzar la negación para enfatizar la falta de posesión.',
      B: 'Enumerar propietarios del mar.',
      C: 'Introducir una pregunta retórica.',
      D: 'Comparar el mar con un producto comercial.',
    },
    correct_index: 'A',
    explanation: 'La doble negación ("nadie" + "ni") intensifica la idea de que el mar no puede pertenecer a nadie.',
    icfes_competency: 'Literatura',
  },
  {
    subject: 'lectura_critica', topic: 'Literatura', difficulty: 1,
    context: `"El mar no tiene dueño,\nnadie lo cobra ni lo vende.\nSolo el horizonte lo conoce\ny él también se pierde."`,
    stem: '¿Qué efecto produce el último verso ("y él también se pierde")?',
    options_json: {
      A: 'Cierra el poema con una sensación de infinitud e inconmensurabilidad.',
      B: 'Genera suspense sobre el destino del horizonte.',
      C: 'Contradice los tres versos anteriores.',
      D: 'Indica que el poema es un acertijo sin solución.',
    },
    correct_index: 'A',
    explanation: 'La idea de que incluso el horizonte se "pierde" amplía la sensación de vastedad e inmensidad del mar.',
    icfes_competency: 'Literatura',
  },
  {
    subject: 'lectura_critica', topic: 'Literatura', difficulty: 1,
    context: `"El mar no tiene dueño,\nnadie lo cobra ni lo vende.\nSolo el horizonte lo conoce\ny él también se pierde."`,
    stem: 'Los verbos "cobra" y "vende" en el poema pertenecen al campo semántico de:',
    options_json: { A: 'El comercio y la propiedad', B: 'La naturaleza', C: 'Las emociones', D: 'El tiempo' },
    correct_index: 'A',
    explanation: 'Cobrar y vender son acciones del ámbito económico/comercial; su uso contrasta con la libertad del mar.',
    icfes_competency: 'Literatura',
  },
  {
    subject: 'lectura_critica', topic: 'Literatura', difficulty: 1,
    context: `"El mar no tiene dueño,\nnadie lo cobra ni lo vende.\nSolo el horizonte lo conoce\ny él también se pierde."`,
    stem: 'La actitud del hablante lírico ante el mar es de:',
    options_json: { A: 'Admiración y respeto', B: 'Indiferencia', C: 'Temor', D: 'Tristeza profunda' },
    correct_index: 'A',
    explanation: 'El poema exalta la naturaleza indomable del mar, proyectando admiración hacia algo libre y grandioso.',
    icfes_competency: 'Literatura',
  },

  // ══════════════════════════════════════════════════════
  // BLOQUE E — TEXTO PUBLICITARIO / MEDIOS (preguntas 28-34, fácil)
  // ══════════════════════════════════════════════════════
  {
    subject: 'lectura_critica', topic: 'Medios de comunicación y otros sistemas simbólicos', difficulty: 1,
    context: `Texto de un aviso publicitario: "¡No esperes más! Con VitaPlus tendrás energía todo el día. Aprobado por nutricionistas. Compra hoy y recibe un 20 % de descuento. Millones de personas ya lo eligieron. ¿Tú también lo harás?"`,
    stem: '¿Cuál es el propósito principal del texto?',
    options_json: {
      A: 'Persuadir al lector para que compre el producto.',
      B: 'Informar sobre los ingredientes de VitaPlus.',
      C: 'Advertir sobre los riesgos de la suplementación.',
      D: 'Entretener con un relato sobre energía.',
    },
    correct_index: 'A',
    explanation: 'Todo el texto usa estrategias persuasivas (urgencia, autoridad, descuento, masividad) para motivar la compra.',
    icfes_competency: 'Medios de comunicación y otros sistemas simbólicos',
  },
  {
    subject: 'lectura_critica', topic: 'Medios de comunicación y otros sistemas simbólicos', difficulty: 1,
    context: `Texto de un aviso publicitario: "¡No esperes más! Con VitaPlus tendrás energía todo el día. Aprobado por nutricionistas. Compra hoy y recibe un 20 % de descuento. Millones de personas ya lo eligieron. ¿Tú también lo harás?"`,
    stem: 'La frase "Millones de personas ya lo eligieron" usa la estrategia retórica de:',
    options_json: {
      A: 'Argumento por mayoría o presión social.',
      B: 'Apelación a la autoridad científica.',
      C: 'Comparación con productos rivales.',
      D: 'Descripción objetiva de ventas.',
    },
    correct_index: 'A',
    explanation: 'Argumentar que "millones lo eligen" busca convencer por número; es la falacia/estrategia del argumento ad populum.',
    icfes_competency: 'Medios de comunicación y otros sistemas simbólicos',
  },
  {
    subject: 'lectura_critica', topic: 'Medios de comunicación y otros sistemas simbólicos', difficulty: 1,
    context: `Texto de un aviso publicitario: "¡No esperes más! Con VitaPlus tendrás energía todo el día. Aprobado por nutricionistas. Compra hoy y recibe un 20 % de descuento. Millones de personas ya lo eligieron. ¿Tú también lo harás?"`,
    stem: '"Aprobado por nutricionistas" busca generar en el lector:',
    options_json: {
      A: 'Confianza mediante la validación de expertos.',
      B: 'Temor a los efectos secundarios.',
      C: 'Curiosidad científica sobre el producto.',
      D: 'Comparación entre nutricionistas.',
    },
    correct_index: 'A',
    explanation: 'Apelar a la aprobación de expertos crea credibilidad y reduce la desconfianza del consumidor.',
    icfes_competency: 'Medios de comunicación y otros sistemas simbólicos',
  },
  {
    subject: 'lectura_critica', topic: 'Medios de comunicación y otros sistemas simbólicos', difficulty: 1,
    context: `Texto de un aviso publicitario: "¡No esperes más! Con VitaPlus tendrás energía todo el día. Aprobado por nutricionistas. Compra hoy y recibe un 20 % de descuento. Millones de personas ya lo eligieron. ¿Tú también lo harás?"`,
    stem: 'La pregunta final "¿Tú también lo harás?" es un recurso que:',
    options_json: {
      A: 'Involucra directamente al lector y genera urgencia de acción.',
      B: 'Expresa duda sobre la calidad del producto.',
      C: 'Invita al lector a reflexionar de forma objetiva.',
      D: 'Muestra que el anunciante no está seguro de su producto.',
    },
    correct_index: 'A',
    explanation: 'Interpelar al lector en segunda persona y con pregunta directa busca compromiso y acción inmediata.',
    icfes_competency: 'Medios de comunicación y otros sistemas simbólicos',
  },
  {
    subject: 'lectura_critica', topic: 'Medios de comunicación y otros sistemas simbólicos', difficulty: 1,
    context: `Texto de un aviso publicitario: "¡No esperes más! Con VitaPlus tendrás energía todo el día. Aprobado por nutricionistas. Compra hoy y recibe un 20 % de descuento. Millones de personas ya lo eligieron. ¿Tú también lo harás?"`,
    stem: 'Una lectura crítica de este aviso podría cuestionar:',
    options_json: {
      A: 'Si las afirmaciones sobre "energía todo el día" y la aprobación de nutricionistas tienen respaldo real.',
      B: 'Si el descuento del 20 % es un número par.',
      C: 'Si millones es un término literario.',
      D: 'Si el nombre VitaPlus tiene raíces latinas.',
    },
    correct_index: 'A',
    explanation: 'La lectura crítica implica evaluar la veracidad de las afirmaciones; "energía todo el día" y "aprobado por nutricionistas" son afirmaciones que necesitan evidencia.',
    icfes_competency: 'Medios de comunicación y otros sistemas simbólicos',
  },
  {
    subject: 'lectura_critica', topic: 'Medios de comunicación y otros sistemas simbólicos', difficulty: 1,
    context: `Texto de un aviso publicitario: "¡No esperes más! Con VitaPlus tendrás energía todo el día. Aprobado por nutricionistas. Compra hoy y recibe un 20 % de descuento. Millones de personas ya lo eligieron. ¿Tú también lo harás?"`,
    stem: '¡No esperes más!" es un imperativo que funciona como:',
    options_json: {
      A: 'Generador de urgencia para apresurar la decisión de compra.',
      B: 'Advertencia sobre los riesgos del producto.',
      C: 'Saludo inicial formal.',
      D: 'Pregunta retórica sobre el tiempo.',
    },
    correct_index: 'A',
    explanation: 'Los imperativos en publicidad crean urgencia; "no esperes más" implica que el tiempo es limitado y hay que actuar ya.',
    icfes_competency: 'Medios de comunicación y otros sistemas simbólicos',
  },
  {
    subject: 'lectura_critica', topic: 'Medios de comunicación y otros sistemas simbólicos', difficulty: 1,
    context: `Texto de un aviso publicitario: "¡No esperes más! Con VitaPlus tendrás energía todo el día. Aprobado por nutricionistas. Compra hoy y recibe un 20 % de descuento. Millones de personas ya lo eligieron. ¿Tú también lo harás?"`,
    stem: 'El destinatario implícito de este aviso es:',
    options_json: {
      A: 'Cualquier persona que busca mejorar su energía o rendimiento.',
      B: 'Solo los nutricionistas.',
      C: 'Los millones que ya compraron el producto.',
      D: 'Únicamente estudiantes universitarios.',
    },
    correct_index: 'A',
    explanation: 'El lenguaje genérico ("tú también") apunta a un público amplio interesado en el bienestar y la energía.',
    icfes_competency: 'Medios de comunicación y otros sistemas simbólicos',
  },

  // ══════════════════════════════════════════════════════
  // BLOQUE F — TEXTO CIENTÍFICO BREVE (preguntas 35-41, fácil)
  // ══════════════════════════════════════════════════════
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 1,
    context: `La fotosíntesis es el proceso mediante el cual las plantas convierten la luz solar, el dióxido de carbono (CO₂) y el agua en glucosa y oxígeno. Este proceso ocurre principalmente en los cloroplastos, orgánulos que contienen clorofila, el pigmento que le da el color verde a las plantas y que absorbe la energía luminosa.`,
    stem: '¿Cuál es la función de la clorofila según el texto?',
    options_json: {
      A: 'Absorber la energía luminosa para la fotosíntesis.',
      B: 'Producir CO₂ para las plantas.',
      C: 'Dar color rojo a las hojas.',
      D: 'Almacenar glucosa en los tallos.',
    },
    correct_index: 'A',
    explanation: 'El texto dice explícitamente que la clorofila "absorbe la energía luminosa".',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 1,
    context: `La fotosíntesis es el proceso mediante el cual las plantas convierten la luz solar, el dióxido de carbono (CO₂) y el agua en glucosa y oxígeno. Este proceso ocurre principalmente en los cloroplastos, orgánulos que contienen clorofila, el pigmento que le da el color verde a las plantas y que absorbe la energía luminosa.`,
    stem: 'Los "cloroplastos" son descritos en el texto como:',
    options_json: {
      A: 'Orgánulos que contienen clorofila.',
      B: 'El producto final de la fotosíntesis.',
      C: 'El CO₂ que absorben las plantas.',
      D: 'Un tipo de glucosa vegetal.',
    },
    correct_index: 'A',
    explanation: 'El texto define cloroplastos como "orgánulos que contienen clorofila".',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 1,
    context: `La fotosíntesis es el proceso mediante el cual las plantas convierten la luz solar, el dióxido de carbono (CO₂) y el agua en glucosa y oxígeno. Este proceso ocurre principalmente en los cloroplastos, orgánulos que contienen clorofila, el pigmento que le da el color verde a las plantas y que absorbe la energía luminosa.`,
    stem: 'De acuerdo con el texto, los productos de la fotosíntesis son:',
    options_json: {
      A: 'Glucosa y oxígeno.',
      B: 'CO₂ y agua.',
      C: 'Clorofila y luz solar.',
      D: 'Cloroplastos y pigmentos.',
    },
    correct_index: 'A',
    explanation: 'El texto establece que las plantas "convierten… en glucosa y oxígeno".',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 1,
    context: `La fotosíntesis es el proceso mediante el cual las plantas convierten la luz solar, el dióxido de carbono (CO₂) y el agua en glucosa y oxígeno. Este proceso ocurre principalmente en los cloroplastos, orgánulos que contienen clorofila, el pigmento que le da el color verde a las plantas y que absorbe la energía luminosa.`,
    stem: '¿Por qué las hojas de la mayoría de plantas son verdes?',
    options_json: {
      A: 'Porque contienen clorofila, un pigmento verde.',
      B: 'Porque producen glucosa de color verde.',
      C: 'Porque absorben luz verde y reflejan los demás colores.',
      D: 'Porque los cloroplastos son de color verde por el oxígeno.',
    },
    correct_index: 'A',
    explanation: 'El texto dice que la clorofila "le da el color verde a las plantas".',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 1,
    context: `La fotosíntesis es el proceso mediante el cual las plantas convierten la luz solar, el dióxido de carbono (CO₂) y el agua en glucosa y oxígeno. Este proceso ocurre principalmente en los cloroplastos, orgánulos que contienen clorofila, el pigmento que le da el color verde a las plantas y que absorbe la energía luminosa.`,
    stem: 'Los tres ingredientes necesarios para la fotosíntesis son:',
    options_json: {
      A: 'Luz solar, CO₂ y agua.',
      B: 'Glucosa, oxígeno y clorofila.',
      C: 'Cloroplastos, clorofila y pigmentos.',
      D: 'Agua, glucosa y oxígeno.',
    },
    correct_index: 'A',
    explanation: 'El texto dice "convierten la luz solar, el dióxido de carbono (CO₂) y el agua en glucosa y oxígeno"; los tres primeros son los insumos.',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 1,
    context: `La fotosíntesis es el proceso mediante el cual las plantas convierten la luz solar, el dióxido de carbono (CO₂) y el agua en glucosa y oxígeno. Este proceso ocurre principalmente en los cloroplastos, orgánulos que contienen clorofila, el pigmento que le da el color verde a las plantas y que absorbe la energía luminosa.`,
    stem: 'El texto es principalmente de tipo:',
    options_json: { A: 'Expositivo-científico', B: 'Narrativo literario', C: 'Argumentativo polémico', D: 'Instructivo' },
    correct_index: 'A',
    explanation: 'Define conceptos y explica un proceso natural sin narrar ni argumentar; es texto expositivo de carácter científico.',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 1,
    context: `La fotosíntesis es el proceso mediante el cual las plantas convierten la luz solar, el dióxido de carbono (CO₂) y el agua en glucosa y oxígeno. Este proceso ocurre principalmente en los cloroplastos, orgánulos que contienen clorofila, el pigmento que le da el color verde a las plantas y que absorbe la energía luminosa.`,
    stem: 'La palabra "principalmente" indica que:',
    options_json: {
      A: 'Hay otros lugares en la planta donde puede ocurrir la fotosíntesis, aunque de forma menor.',
      B: 'La fotosíntesis ocurre exclusivamente en los cloroplastos.',
      C: 'Los cloroplastos son más importantes que la clorofila.',
      D: 'La fotosíntesis es el proceso más importante del universo.',
    },
    correct_index: 'A',
    explanation: '"Principalmente" deja abierta la posibilidad de que ocurra en otros orgánulos de forma secundaria, aunque el sitio principal son los cloroplastos.',
    icfes_competency: 'Comprensión e interpretación textual',
  },

  // ══════════════════════════════════════════════════════
  // BLOQUE G — TEXTO HISTÓRICO BREVE (preguntas 42-46, fácil)
  // ══════════════════════════════════════════════════════
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 1,
    context: `La Revolución Francesa (1789-1799) fue uno de los eventos más trascendentales de la historia moderna. Nació de la crisis económica, la desigualdad social y el absolutismo monárquico. Sus ideas — libertad, igualdad y fraternidad — influenciaron constituciones y movimientos independentistas en todo el mundo, incluido Latinoamérica. Sin embargo, también trajo consigo un periodo de violencia extrema conocido como el "Terror".`,
    stem: '¿Cuál fue una de las causas de la Revolución Francesa según el texto?',
    options_json: {
      A: 'La desigualdad social y el absolutismo monárquico.',
      B: 'La invasión napoleónica a Francia.',
      C: 'La guerra de independencia de los Estados Unidos.',
      D: 'La falta de religión entre los ciudadanos.',
    },
    correct_index: 'A',
    explanation: 'El texto menciona "crisis económica, desigualdad social y absolutismo monárquico" como causas.',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 1,
    context: `La Revolución Francesa (1789-1799) fue uno de los eventos más trascendentales de la historia moderna. Nació de la crisis económica, la desigualdad social y el absolutismo monárquico. Sus ideas — libertad, igualdad y fraternidad — influenciaron constituciones y movimientos independentistas en todo el mundo, incluido Latinoamérica. Sin embargo, también trajo consigo un periodo de violencia extrema conocido como el "Terror".`,
    stem: '¿Qué efecto de la Revolución Francesa en Latinoamérica menciona el texto?',
    options_json: {
      A: 'Influenció los movimientos independentistas.',
      B: 'Causó guerras en el continente americano.',
      C: 'Exportó el sistema monárquico a las colonias.',
      D: 'Creó el idioma español moderno.',
    },
    correct_index: 'A',
    explanation: 'El texto dice: "influenciaron constituciones y movimientos independentistas en todo el mundo, incluido Latinoamérica".',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 1,
    context: `La Revolución Francesa (1789-1799) fue uno de los eventos más trascendentales de la historia moderna. Nació de la crisis económica, la desigualdad social y el absolutismo monárquico. Sus ideas — libertad, igualdad y fraternidad — influenciaron constituciones y movimientos independentistas en todo el mundo, incluido Latinoamérica. Sin embargo, también trajo consigo un periodo de violencia extrema conocido como el "Terror".`,
    stem: 'La palabra "trascendentales" en el texto significa:',
    options_json: {
      A: 'De gran importancia e impacto duradero.',
      B: 'Violentos y sangrientos.',
      C: 'Religiosos y espirituales.',
      D: 'Económicos y comerciales.',
    },
    correct_index: 'A',
    explanation: '"Trascendental" significa que tiene una importancia que va más allá del momento inmediato y deja huella en el tiempo.',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 1,
    context: `La Revolución Francesa (1789-1799) fue uno de los eventos más trascendentales de la historia moderna. Nació de la crisis económica, la desigualdad social y el absolutismo monárquico. Sus ideas — libertad, igualdad y fraternidad — influenciaron constituciones y movimientos independentistas en todo el mundo, incluido Latinoamérica. Sin embargo, también trajo consigo un periodo de violencia extrema conocido como el "Terror".`,
    stem: 'El conector "sin embargo" en el último enunciado indica:',
    options_json: {
      A: 'Un contraste entre los logros de la Revolución y sus efectos negativos.',
      B: 'Una consecuencia esperada de la revolución.',
      C: 'Una adición de información positiva.',
      D: 'Una causa de los ideales de libertad.',
    },
    correct_index: 'A',
    explanation: '"Sin embargo" es un conector adversativo que introduce un matiz negativo frente a los logros positivos mencionados antes.',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 1,
    context: `La Revolución Francesa (1789-1799) fue uno de los eventos más trascendentales de la historia moderna. Nació de la crisis económica, la desigualdad social y el absolutismo monárquico. Sus ideas — libertad, igualdad y fraternidad — influenciaron constituciones y movimientos independentistas en todo el mundo, incluido Latinoamérica. Sin embargo, también trajo consigo un periodo de violencia extrema conocido como el "Terror".`,
    stem: 'Las comillas en "Terror" cumplen la función de:',
    options_json: {
      A: 'Indicar que es el nombre oficial de ese periodo histórico.',
      B: 'Mostrar que el autor duda de que haya habido violencia.',
      C: 'Citar textualmente a un historiador.',
      D: 'Señalar una palabra en otro idioma.',
    },
    correct_index: 'A',
    explanation: 'Las comillas indican que "Terror" es el nombre propio con el que se denomina históricamente ese período de guillotina y represión (1793-1794).',
    icfes_competency: 'Comprensión e interpretación textual',
  },

  // ══════════════════════════════════════════════════════
  // BLOQUE H — INFERENCIAS Y LECTURA GLOBAL (fácil, preguntas 47-60)
  // ══════════════════════════════════════════════════════
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 1,
    context: `"Cada vez que abría la nevera, Lucas sentía ese olor a lluvia. No sabía por qué, pero lo transportaba directamente a la tarde en que conoció a Valentina."`,
    stem: 'El texto explora principalmente el fenómeno de:',
    options_json: {
      A: 'La memoria involuntaria activada por el olfato.',
      B: 'La tecnología de las neveras modernas.',
      C: 'El proceso de enamorarse.',
      D: 'Las ilusiones olfativas patológicas.',
    },
    correct_index: 'A',
    explanation: 'Un olor desencadena automáticamente un recuerdo; esto es memoria involuntaria o memoria proustiana.',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 1,
    context: `"A pesar de sus años de experiencia, el médico se detuvo frente al caso y admitió en voz baja: 'No sé'."`,
    stem: 'La actitud del médico al admitir "No sé" puede interpretarse como:',
    options_json: {
      A: 'Honestidad intelectual y humildad frente a la incertidumbre.',
      B: 'Incompetencia profesional.',
      C: 'Arrogancia disfrazada de humildad.',
      D: 'Señal de que el paciente no tiene cura.',
    },
    correct_index: 'A',
    explanation: 'Alguien con "años de experiencia" que reconoce su límite está ejerciendo honestidad y humildad, no demostrando incompetencia.',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 1,
    context: `"El libro llevaba diez años en la misma estantería, con el lomo intacto. Nadie lo había abierto, y sin embargo, en la portada se leía: 'Manual para cambiar el mundo'."`,
    stem: 'La ironía del fragmento radica en que:',
    options_json: {
      A: 'Un libro que promete cambiar el mundo nunca ha sido leído.',
      B: 'El libro es demasiado viejo para ser útil.',
      C: 'La portada está dañada por el tiempo.',
      D: 'El lomo del libro está bien conservado.',
    },
    correct_index: 'A',
    explanation: 'La contradicción entre el título ("cambiar el mundo") y el hecho de que nadie lo ha abierto en diez años genera ironía.',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Literatura', difficulty: 1,
    context: `"Vivían en la misma ciudad, en el mismo barrio, incluso en el mismo edificio. Pero jamás se habían visto. La soledad moderna tiene esas ironías."`,
    stem: 'La "soledad moderna" a la que se refiere el texto hace alusión a:',
    options_json: {
      A: 'El aislamiento de las personas en entornos urbanos masificados.',
      B: 'La preferencia por vivir solas en el siglo XXI.',
      C: 'La falta de edificios con buena infraestructura.',
      D: 'La ausencia de transporte público eficiente.',
    },
    correct_index: 'A',
    explanation: 'Vivir cerca físicamente pero sin contacto humano es una paradoja típica de las ciudades modernas; eso es la "soledad moderna".',
    icfes_competency: 'Literatura',
  },
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 1,
    context: `"El informe concluía con una cifra que nadie quería ver: el 40 % de los bosques tropicales habían desaparecido en los últimos 50 años."`,
    stem: 'El hecho de que "nadie quería ver" la cifra indica que:',
    options_json: {
      A: 'La información es incómoda porque implica responsabilidad.',
      B: 'La cifra estaba escrita en letra pequeña.',
      C: 'Los lectores del informe eran analfabetos.',
      D: 'Los bosques son un tema irrelevante.',
    },
    correct_index: 'A',
    explanation: '"Nadie quería ver" es una metáfora del rechazo emocional a reconocer datos que implican culpa o acción necesaria.',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 1,
    context: `"En la reunión, todos aplaudieron el plan. Afuera, en los pasillos, nadie creía que funcionara."`,
    stem: 'El fragmento describe principalmente una situación de:',
    options_json: {
      A: 'Hipocresía o conformismo social.',
      B: 'Entusiasmo genuino por el plan.',
      C: 'Debate democrático entre colegas.',
      D: 'Celebración de un logro conseguido.',
    },
    correct_index: 'A',
    explanation: 'Aplaudir en público algo en lo que no se cree en privado ilustra el conformismo o la hipocresía social.',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Literatura', difficulty: 1,
    context: `"La ciudad dormía. Solo las farolas y los gatos conocían sus secretos."`,
    stem: 'La figura literaria utilizada en "las farolas conocían sus secretos" es:',
    options_json: { A: 'Personificación', B: 'Metáfora', C: 'Hipérbole', D: 'Comparación' },
    correct_index: 'A',
    explanation: 'Se atribuye a las farolas la capacidad de "conocer", que es una cualidad propia de los seres vivos.',
    icfes_competency: 'Literatura',
  },
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 1,
    context: `"La noticia llegó al mismo tiempo que el café. María dejó la taza sin tocar."`,
    stem: 'El detalle de "dejó la taza sin tocar" comunica que María:',
    options_json: {
      A: 'Quedó impactada o perturbada por la noticia.',
      B: 'No le gustaba el café.',
      C: 'Estaba esperando que se enfriara.',
      D: 'Tenía prisa por salir.',
    },
    correct_index: 'A',
    explanation: 'Olvidar o ignorar algo tan cotidiano como el café sugiere que la noticia generó una fuerte conmoción emocional.',
    icfes_competency: 'Comprensión e interpretación textual',
  },

  // ══════════════════════════════════════════════════════
  // BLOQUE I — TEXTOS MEDIO (difficulty 2, preguntas 61-100)
  // ══════════════════════════════════════════════════════

  // Texto argumentativo extendido — medio (61-67)
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 2,
    context: `El filósofo alemán Immanuel Kant sostenía que la moral debía basarse en el deber y la razón, no en las consecuencias. Para él, una acción es moralmente correcta si puede convertirse en ley universal sin contradicción. A esto lo llamó "imperativo categórico". En contraste, el utilitarismo, defendido por Jeremy Bentham y John Stuart Mill, argumenta que la acción correcta es la que produce la mayor felicidad para el mayor número de personas. Estas dos corrientes siguen siendo debatidas en bioética, derecho y política contemporáneos.`,
    stem: 'La principal diferencia entre el kantismo y el utilitarismo, según el texto, es:',
    options_json: {
      A: 'Kant fundamenta la moral en el deber racional; el utilitarismo, en las consecuencias.',
      B: 'Kant era alemán y los utilitaristas eran franceses.',
      C: 'El utilitarismo rechaza la felicidad; Kant la promueve.',
      D: 'Ambas corrientes son idénticas en sus conclusiones prácticas.',
    },
    correct_index: 'A',
    explanation: 'El texto contrasta explícitamente el deber racional kantiano ("no en las consecuencias") con el enfoque consecuencialista utilitarista ("mayor felicidad").',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 2,
    context: `El filósofo alemán Immanuel Kant sostenía que la moral debía basarse en el deber y la razón, no en las consecuencias. Para él, una acción es moralmente correcta si puede convertirse en ley universal sin contradicción. A esto lo llamó "imperativo categórico". En contraste, el utilitarismo, defendido por Jeremy Bentham y John Stuart Mill, argumenta que la acción correcta es la que produce la mayor felicidad para el mayor número de personas. Estas dos corrientes siguen siendo debatidas en bioética, derecho y política contemporáneos.`,
    stem: '¿Qué significa que una acción "pueda convertirse en ley universal sin contradicción"?',
    options_json: {
      A: 'Que si todos hicieran esa acción, no habría inconsistencia lógica ni moral.',
      B: 'Que la acción debe estar aprobada por todos los parlamentos del mundo.',
      C: 'Que la acción produce felicidad universal.',
      D: 'Que la acción es legal en todos los países.',
    },
    correct_index: 'A',
    explanation: 'El imperativo categórico kantiano prueba una acción preguntando si sería coherente universalizarla: si todos la practicaran, ¿el sistema se contradice?',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 2,
    context: `El filósofo alemán Immanuel Kant sostenía que la moral debía basarse en el deber y la razón, no en las consecuencias. Para él, una acción es moralmente correcta si puede convertirse en ley universal sin contradicción. A esto lo llamó "imperativo categórico". En contraste, el utilitarismo, defendido por Jeremy Bentham y John Stuart Mill, argumenta que la acción correcta es la que produce la mayor felicidad para el mayor número de personas. Estas dos corrientes siguen siendo debatidas en bioética, derecho y política contemporáneos.`,
    stem: 'Según el utilitarismo, mentir para salvar la vida de alguien sería:',
    options_json: {
      A: 'Moralmente correcto, pues produce mayor bienestar.',
      B: 'Moralmente incorrecto, porque viola el deber de decir la verdad.',
      C: 'Indiferente, pues la mentira no afecta a nadie.',
      D: 'Correcto solo si lo aprueba la mayoría.',
    },
    correct_index: 'A',
    explanation: 'El utilitarismo evalúa la corrección por las consecuencias: salvar una vida maximiza el bienestar, lo cual justifica la mentira según esa corriente.',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 2,
    context: `El filósofo alemán Immanuel Kant sostenía que la moral debía basarse en el deber y la razón, no en las consecuencias. Para él, una acción es moralmente correcta si puede convertirse en ley universal sin contradicción. A esto lo llamó "imperativo categórico". En contraste, el utilitarismo, defendido por Jeremy Bentham y John Stuart Mill, argumenta que la acción correcta es la que produce la mayor felicidad para el mayor número de personas. Estas dos corrientes siguen siendo debatidas en bioética, derecho y política contemporáneos.`,
    stem: 'El texto menciona bioética, derecho y política para indicar que:',
    options_json: {
      A: 'Las discusiones filosóficas entre Kant y el utilitarismo tienen vigencia práctica actual.',
      B: 'Los filósofos del siglo XVIII anticiparon el derecho moderno.',
      C: 'El utilitarismo domina hoy sobre el kantismo.',
      D: 'Los debates filosóficos son irrelevantes fuera de la academia.',
    },
    correct_index: 'A',
    explanation: 'La mención de campos contemporáneos muestra que estas corrientes filosóficas aún son relevantes y aplicables.',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 2,
    context: `El filósofo alemán Immanuel Kant sostenía que la moral debía basarse en el deber y la razón, no en las consecuencias. Para él, una acción es moralmente correcta si puede convertirse en ley universal sin contradicción. A esto lo llamó "imperativo categórico". En contraste, el utilitarismo, defendido por Jeremy Bentham y John Stuart Mill, argumenta que la acción correcta es la que produce la mayor felicidad para el mayor número de personas. Estas dos corrientes siguen siendo debatidas en bioética, derecho y política contemporáneos.`,
    stem: 'Un médico que aplica quimioterapia dolorosa a un paciente porque esa es la indicación correcta, sin importar el sufrimiento inmediato, actúa más en línea con:',
    options_json: {
      A: 'El kantismo, que privilegia el deber sobre las consecuencias.',
      B: 'El utilitarismo, que maximiza el bienestar.',
      C: 'Ninguna de las dos corrientes.',
      D: 'El utilitarismo, porque el dolor es menor que la muerte.',
    },
    correct_index: 'A',
    explanation: 'Seguir el protocolo correcto independientemente del sufrimiento es una actitud deontológica (del deber), propia del kantismo.',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 2,
    context: `El filósofo alemán Immanuel Kant sostenía que la moral debía basarse en el deber y la razón, no en las consecuencias. Para él, una acción es moralmente correcta si puede convertirse en ley universal sin contradicción. A esto lo llamó "imperativo categórico". En contraste, el utilitarismo, defendido por Jeremy Bentham y John Stuart Mill, argumenta que la acción correcta es la que produce la mayor felicidad para el mayor número de personas. Estas dos corrientes siguen siendo debatidas en bioética, derecho y política contemporáneos.`,
    stem: '¿Cuál sería una crítica posible al utilitarismo según la lógica del texto?',
    options_json: {
      A: 'Podría justificar dañar a una minoría si con ello se beneficia a la mayoría.',
      B: 'Ignora completamente la felicidad humana.',
      C: 'Es imposible calcular las consecuencias de las acciones.',
      D: 'No fue propuesto por un filósofo reconocido.',
    },
    correct_index: 'A',
    explanation: 'Si lo correcto es "la mayor felicidad para el mayor número", las minorías podrían ser sacrificadas; es la crítica clásica al utilitarismo.',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 2,
    context: `El filósofo alemán Immanuel Kant sostenía que la moral debía basarse en el deber y la razón, no en las consecuencias. Para él, una acción es moralmente correcta si puede convertirse en ley universal sin contradicción. A esto lo llamó "imperativo categórico". En contraste, el utilitarismo, defendido por Jeremy Bentham y John Stuart Mill, argumenta que la acción correcta es la que produce la mayor felicidad para el mayor número de personas. Estas dos corrientes siguen siendo debatidas en bioética, derecho y política contemporáneos.`,
    stem: 'El propósito del texto es principalmente:',
    options_json: {
      A: 'Explicar y comparar dos corrientes éticas fundamentales.',
      B: 'Defender que Kant tenía razón frente al utilitarismo.',
      C: 'Argumentar que la ética no es útil en la vida práctica.',
      D: 'Narrar la vida de Kant y Bentham.',
    },
    correct_index: 'A',
    explanation: 'El texto presenta ambas posiciones sin tomar partido; su función es expositivo-comparativa.',
    icfes_competency: 'Comprensión e interpretación textual',
  },

  // Texto literario complejo — medio (68-74)
  {
    subject: 'lectura_critica', topic: 'Literatura', difficulty: 2,
    context: `"El coronel no tenía a nadie a quien escribirle. Su esposa había muerto hacía veinte años; sus hijos, en la guerra. Pero cada viernes se paraba frente a la ventana y esperaba al cartero. No esperaba ninguna carta. Solo esperaba."
    — Fragmento inspirado en la obra de Gabriel García Márquez`,
    stem: '¿Qué representa el acto de esperar al cartero sin esperar carta?',
    options_json: {
      A: 'La esperanza como hábito existencial, incluso sin objeto concreto.',
      B: 'La confusión mental del coronel por su vejez.',
      C: 'La costumbre burocrática de revisar el correo.',
      D: 'El deseo de comunicarse con sus hijos muertos.',
    },
    correct_index: 'A',
    explanation: '"Solo esperaba" indica que la espera ya no tiene objeto racional; es una forma de existir, de seguir vivo a través del ritual.',
    icfes_competency: 'Literatura',
  },
  {
    subject: 'lectura_critica', topic: 'Literatura', difficulty: 2,
    context: `"El coronel no tenía a nadie a quien escribirle. Su esposa había muerto hacía veinte años; sus hijos, en la guerra. Pero cada viernes se paraba frente a la ventana y esperaba al cartero. No esperaba ninguna carta. Solo esperaba."
    — Fragmento inspirado en la obra de Gabriel García Márquez`,
    stem: 'La repetición de la palabra "esperaba" al final del fragmento crea:',
    options_json: {
      A: 'Un efecto de énfasis que convierte la espera en algo absoluto y definitorio.',
      B: 'Una redundancia que debilita el texto.',
      C: 'Una contradicción lógica.',
      D: 'Una pregunta implícita sobre el destinatario de las cartas.',
    },
    correct_index: 'A',
    explanation: 'La anáfora ("no esperaba… solo esperaba") refuerza la idea de que esperar es todo lo que le queda al coronel.',
    icfes_competency: 'Literatura',
  },
  {
    subject: 'lectura_critica', topic: 'Literatura', difficulty: 2,
    context: `"El coronel no tenía a nadie a quien escribirle. Su esposa había muerto hacía veinte años; sus hijos, en la guerra. Pero cada viernes se paraba frente a la ventana y esperaba al cartero. No esperaba ninguna carta. Solo esperaba."
    — Fragmento inspirado en la obra de Gabriel García Márquez`,
    stem: 'El tiempo "cada viernes" sugiere que el coronel:',
    options_json: {
      A: 'Ha convertido la espera en un ritual regular que estructura su vida.',
      B: 'Recibe cartas solo los viernes.',
      C: 'El cartero pasa únicamente los viernes.',
      D: 'Los viernes son días de luto oficial.',
    },
    correct_index: 'A',
    explanation: 'La periodicidad del acto lo convierte en rito; los rituales dan estructura y sentido cuando la vida se ha vaciado de contenido.',
    icfes_competency: 'Literatura',
  },
  {
    subject: 'lectura_critica', topic: 'Literatura', difficulty: 2,
    context: `"El coronel no tenía a nadie a quien escribirle. Su esposa había muerto hacía veinte años; sus hijos, en la guerra. Pero cada viernes se paraba frente a la ventana y esperaba al cartero. No esperaba ninguna carta. Solo esperaba."
    — Fragmento inspirado en la obra de Gabriel García Márquez`,
    stem: 'El uso del conector "pero" antes de "cada viernes" cumple la función de:',
    options_json: {
      A: 'Contraponer la soledad absoluta del coronel con su persistente esperanza.',
      B: 'Indicar que los viernes son diferentes a los otros días.',
      C: 'Señalar un error en el comportamiento del coronel.',
      D: 'Introducir la conclusión lógica de la narración.',
    },
    correct_index: 'A',
    explanation: '"Pero" es adversativo: aunque no tiene a nadie (premisa negativa), igual espera (acción que contradice esa lógica).',
    icfes_competency: 'Literatura',
  },
  {
    subject: 'lectura_critica', topic: 'Literatura', difficulty: 2,
    context: `"El coronel no tenía a nadie a quien escribirle. Su esposa había muerto hacía veinte años; sus hijos, en la guerra. Pero cada viernes se paraba frente a la ventana y esperaba al cartero. No esperaba ninguna carta. Solo esperaba."
    — Fragmento inspirado en la obra de Gabriel García Márquez`,
    stem: 'Este fragmento pertenece a la tradición literaria del:',
    options_json: {
      A: 'Realismo latinoamericano con elementos de soledad y memoria.',
      B: 'Romanticismo europeo del siglo XIX.',
      C: 'Ciencia ficción especulativa.',
      D: 'Teatro del absurdo.',
    },
    correct_index: 'A',
    explanation: 'La soledad del personaje, el contexto bélico y la resignación existencial son marcas del realismo latinoamericano (corriente de Gabo y sus contemporáneos).',
    icfes_competency: 'Literatura',
  },
  {
    subject: 'lectura_critica', topic: 'Literatura', difficulty: 2,
    context: `"El coronel no tenía a nadie a quien escribirle. Su esposa había muerto hacía veinte años; sus hijos, en la guerra. Pero cada viernes se paraba frente a la ventana y esperaba al cartero. No esperaba ninguna carta. Solo esperaba."
    — Fragmento inspirado en la obra de Gabriel García Márquez`,
    stem: 'La voz narrativa del fragmento es:',
    options_json: {
      A: 'Narrador heterodiegético en tercera persona con acceso a la interioridad del personaje.',
      B: 'Narrador homodiegético en primera persona.',
      C: 'Narrador implícito sin punto de vista definido.',
      D: 'El propio coronel narrando sus vivencias.',
    },
    correct_index: 'A',
    explanation: 'El narrador habla en tercera persona ("el coronel… sus hijos") y revela los pensamientos internos del protagonista; eso corresponde al narrador heterodiegético omnisciente.',
    icfes_competency: 'Literatura',
  },
  {
    subject: 'lectura_critica', topic: 'Literatura', difficulty: 2,
    context: `"El coronel no tenía a nadie a quien escribirle. Su esposa había muerto hacía veinte años; sus hijos, en la guerra. Pero cada viernes se paraba frente a la ventana y esperaba al cartero. No esperaba ninguna carta. Solo esperaba."
    — Fragmento inspirado en la obra de Gabriel García Márquez`,
    stem: 'La expresión "sus hijos, en la guerra" (sin verbo explícito) utiliza la figura de:',
    options_json: { A: 'Elipsis', B: 'Anáfora', C: 'Metáfora', D: 'Epanadiplosis' },
    correct_index: 'A',
    explanation: 'Se omite el verbo ("murieron en la guerra") para crear un efecto de concisión y dureza; esa omisión intencional es la elipsis.',
    icfes_competency: 'Literatura',
  },

  // Texto sobre medios — medio (75-81)
  {
    subject: 'lectura_critica', topic: 'Medios de comunicación y otros sistemas simbólicos', difficulty: 2,
    context: `La caricatura política utiliza la deformación gráfica de figuras públicas para criticar decisiones de poder. A diferencia de un artículo de opinión, la caricatura condensa en una imagen múltiples capas de significado: el trazo exagerado, los símbolos icónicos y el texto breve. La efectividad de una caricatura depende de que el lector comparta el contexto cultural y político que le da sentido. Sin ese conocimiento previo, la imagen pierde su carga crítica.`,
    stem: '¿Cuál es la diferencia fundamental que establece el texto entre la caricatura y el artículo de opinión?',
    options_json: {
      A: 'La caricatura comunica a través de imágenes y símbolos; el artículo, a través del texto argumentativo.',
      B: 'La caricatura es más objetiva que el artículo de opinión.',
      C: 'El artículo usa humor; la caricatura, argumentos racionales.',
      D: 'Ambos son equivalentes en su forma de comunicar.',
    },
    correct_index: 'A',
    explanation: 'El texto contrasta la condensación visual de la caricatura ("imagen, trazo, símbolos") con la extensión argumentativa de un artículo.',
    icfes_competency: 'Medios de comunicación y otros sistemas simbólicos',
  },
  {
    subject: 'lectura_critica', topic: 'Medios de comunicación y otros sistemas simbólicos', difficulty: 2,
    context: `La caricatura política utiliza la deformación gráfica de figuras públicas para criticar decisiones de poder. A diferencia de un artículo de opinión, la caricatura condensa en una imagen múltiples capas de significado: el trazo exagerado, los símbolos icónicos y el texto breve. La efectividad de una caricatura depende de que el lector comparta el contexto cultural y político que le da sentido. Sin ese conocimiento previo, la imagen pierde su carga crítica.`,
    stem: 'Según el texto, ¿por qué una caricatura puede "perder su carga crítica"?',
    options_json: {
      A: 'Si el lector no comparte el contexto cultural y político que le da sentido.',
      B: 'Si la imagen está bien dibujada y en colores vivos.',
      C: 'Si el político caricaturizado es muy famoso.',
      D: 'Si el texto de la caricatura está en otro idioma.',
    },
    correct_index: 'A',
    explanation: 'El texto lo dice explícitamente: "Sin ese conocimiento previo, la imagen pierde su carga crítica".',
    icfes_competency: 'Medios de comunicación y otros sistemas simbólicos',
  },
  {
    subject: 'lectura_critica', topic: 'Medios de comunicación y otros sistemas simbólicos', difficulty: 2,
    context: `La caricatura política utiliza la deformación gráfica de figuras públicas para criticar decisiones de poder. A diferencia de un artículo de opinión, la caricatura condensa en una imagen múltiples capas de significado: el trazo exagerado, los símbolos icónicos y el texto breve. La efectividad de una caricatura depende de que el lector comparta el contexto cultural y político que le da sentido. Sin ese conocimiento previo, la imagen pierde su carga crítica.`,
    stem: 'El término "deformación gráfica" en el contexto de la caricatura cumple la función de:',
    options_json: {
      A: 'Exagerar rasgos para enfatizar una crítica o característica del personaje.',
      B: 'Mostrar defectos físicos del político sin intención artística.',
      C: 'Hacer que la imagen sea técnicamente perfecta.',
      D: 'Reproducir fielmente la apariencia del caricaturizado.',
    },
    correct_index: 'A',
    explanation: 'La deformación en caricatura es intencional y simbólica; exagera un rasgo para transmitir una idea crítica, no para distorsionar por error.',
    icfes_competency: 'Medios de comunicación y otros sistemas simbólicos',
  },
  {
    subject: 'lectura_critica', topic: 'Medios de comunicación y otros sistemas simbólicos', difficulty: 2,
    context: `La caricatura política utiliza la deformación gráfica de figuras públicas para criticar decisiones de poder. A diferencia de un artículo de opinión, la caricatura condensa en una imagen múltiples capas de significado: el trazo exagerado, los símbolos icónicos y el texto breve. La efectividad de una caricatura depende de que el lector comparta el contexto cultural y político que le da sentido. Sin ese conocimiento previo, la imagen pierde su carga crítica.`,
    stem: 'Una caricatura que muestra a un mandatario como marioneta de una multinacional utiliza principalmente:',
    options_json: {
      A: 'Un símbolo icónico (la marioneta) para representar la falta de autonomía del gobernante.',
      B: 'Una metáfora verbal para describir la corrupción.',
      C: 'Un dato estadístico sobre la economía.',
      D: 'Una fotografía retocada del presidente.',
    },
    correct_index: 'A',
    explanation: 'La marioneta es un ícono con significado cultural establecido (control, manipulación); usarlo para representar al gobernante es un recurso simbólico visual.',
    icfes_competency: 'Medios de comunicación y otros sistemas simbólicos',
  },
  {
    subject: 'lectura_critica', topic: 'Medios de comunicación y otros sistemas simbólicos', difficulty: 2,
    context: `La caricatura política utiliza la deformación gráfica de figuras públicas para criticar decisiones de poder. A diferencia de un artículo de opinión, la caricatura condensa en una imagen múltiples capas de significado: el trazo exagerado, los símbolos icónicos y el texto breve. La efectividad de una caricatura depende de que el lector comparta el contexto cultural y político que le da sentido. Sin ese conocimiento previo, la imagen pierde su carga crítica.`,
    stem: 'Según la idea del texto, ¿cuál de los siguientes lectores entendería mejor una caricatura sobre la crisis del congreso colombiano?',
    options_json: {
      A: 'Un ciudadano colombiano que sigue la actualidad política.',
      B: 'Un niño que no ha estudiado civismo.',
      C: 'Un turista extranjero recién llegado al país.',
      D: 'Un académico experto en arte medieval.',
    },
    correct_index: 'A',
    explanation: 'El texto dice que la efectividad depende de compartir el contexto cultural y político; quien más contexto tiene, más comprende.',
    icfes_competency: 'Medios de comunicación y otros sistemas simbólicos',
  },
  {
    subject: 'lectura_critica', topic: 'Medios de comunicación y otros sistemas simbólicos', difficulty: 2,
    context: `La caricatura política utiliza la deformación gráfica de figuras públicas para criticar decisiones de poder. A diferencia de un artículo de opinión, la caricatura condensa en una imagen múltiples capas de significado: el trazo exagerado, los símbolos icónicos y el texto breve. La efectividad de una caricatura depende de que el lector comparta el contexto cultural y político que le da sentido. Sin ese conocimiento previo, la imagen pierde su carga crítica.`,
    stem: 'El texto tiene un enfoque principalmente:',
    options_json: {
      A: 'Analítico sobre el lenguaje visual y su función comunicativa.',
      B: 'Histórico sobre el origen de la caricatura.',
      C: 'Normativo sobre cómo se debe dibujar una caricatura.',
      D: 'Biográfico sobre caricaturistas famosos.',
    },
    correct_index: 'A',
    explanation: 'Explica cómo funciona la caricatura como sistema de signos visuales y qué condiciones permiten su efectividad comunicativa.',
    icfes_competency: 'Medios de comunicación y otros sistemas simbólicos',
  },
  {
    subject: 'lectura_critica', topic: 'Medios de comunicación y otros sistemas simbólicos', difficulty: 2,
    context: `La caricatura política utiliza la deformación gráfica de figuras públicas para criticar decisiones de poder. A diferencia de un artículo de opinión, la caricatura condensa en una imagen múltiples capas de significado: el trazo exagerado, los símbolos icónicos y el texto breve. La efectividad de una caricatura depende de que el lector comparta el contexto cultural y político que le da sentido. Sin ese conocimiento previo, la imagen pierde su carga crítica.`,
    stem: 'La frase "múltiples capas de significado" sugiere que la caricatura:',
    options_json: {
      A: 'Puede interpretarse en varios niveles simultáneos.',
      B: 'Tiene varios marcos o bordes decorativos.',
      C: 'Requiere varias lecturas para descifrar el texto escrito.',
      D: 'Es más compleja técnicamente que una fotografía.',
    },
    correct_index: 'A',
    explanation: '"Capas de significado" es una metáfora para indicar que un mismo elemento visual puede tener significados literales, connotativos y críticos a la vez.',
    icfes_competency: 'Medios de comunicación y otros sistemas simbólicos',
  },

  // Textos medio — inferencias avanzadas (82-100)
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 2,
    context: `"Hay palabras que se dicen tan seguido que se vacían. 'Te quiero' dicho mil veces al día, 'lo siento' sin sentirlo, 'siempre' que nunca dura. El idioma sufre de inflación."`,
    stem: 'La metáfora "el idioma sufre de inflación" compara el lenguaje con:',
    options_json: {
      A: 'La economía, donde un exceso de algo reduce su valor.',
      B: 'La medicina, donde el idioma puede enfermar.',
      C: 'La física, donde las palabras se expanden.',
      D: 'La psicología, donde las palabras generan trauma.',
    },
    correct_index: 'A',
    explanation: 'Inflación económica = más dinero, menos valor. Aquí: más usos de una palabra, menos significado. La comparación es con la devaluación económica.',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 2,
    context: `"La democracia no es solo el derecho a votar; es también el derecho a ser escuchado antes, durante y después de las elecciones. Un pueblo que vota cada cuatro años pero que es ignorado el resto del tiempo vive en una democracia incompleta."`,
    stem: '¿Qué distinción hace el texto entre democracia formal y democracia real?',
    options_json: {
      A: 'La democracia formal se reduce al voto; la real exige participación y escucha continua.',
      B: 'La democracia formal es mejor porque tiene elecciones periódicas.',
      C: 'La democracia real es solo posible en países pequeños.',
      D: 'Ambos conceptos son equivalentes según el texto.',
    },
    correct_index: 'A',
    explanation: 'El texto critica que reducir la democracia al voto deja fuera la participación permanente que hace "completa" a la democracia.',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 2,
    context: `"El progreso técnico ha superado con creces al progreso moral. Podemos enviar mensajes al otro lado del planeta en segundos, pero aún no sabemos vivir en paz con el vecino de enfrente."`,
    stem: 'La yuxtaposición de "mensajes al otro lado del planeta" y "paz con el vecino" sirve para:',
    options_json: {
      A: 'Contrastar el avance tecnológico con el estancamiento de las relaciones humanas cotidianas.',
      B: 'Demostrar que la tecnología mejora las relaciones vecinales.',
      C: 'Criticar que los vecinos no usen el internet.',
      D: 'Mostrar que el progreso moral es más rápido que el tecnológico.',
    },
    correct_index: 'A',
    explanation: 'La distancia global (tecnología) vs. la distancia local (convivencia) marca el contraste entre lo que avanzamos y lo que seguimos sin resolver.',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Literatura', difficulty: 2,
    context: `"Desde que aprendió a leer, el mundo le pareció demasiado pequeño. Los libros no le daban respuestas: le daban mejores preguntas."`,
    stem: 'La idea de que los libros "dan mejores preguntas" sugiere que la lectura:',
    options_json: {
      A: 'Amplía la perspectiva y complejiza la comprensión del mundo.',
      B: 'Genera confusión y desorientación en el lector.',
      C: 'Es inútil porque no da respuestas concretas.',
      D: 'Solo sirve para quienes ya tienen todas las respuestas.',
    },
    correct_index: 'A',
    explanation: 'Una "mejor pregunta" es más profunda y fecunda que una respuesta simple; el fragmento celebra la lectura como camino de crecimiento intelectual.',
    icfes_competency: 'Literatura',
  },
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 2,
    context: `"Los datos no mienten, pero los que los presentan sí pueden hacerlo. Un gráfico puede mostrar un crecimiento del 200 % sin mencionar que partió de 1."`,
    stem: 'El ejemplo del "crecimiento del 200 %" ilustra cómo:',
    options_json: {
      A: 'Los datos pueden ser verdaderos pero engañosos sin el contexto adecuado.',
      B: 'El 200 % siempre es un indicador de éxito.',
      C: 'Los gráficos son siempre más confiables que los textos.',
      D: 'Los números son subjetivos por naturaleza.',
    },
    correct_index: 'A',
    explanation: 'Pasar de 1 a 3 es 200 %, pero es un cambio mínimo; sin el punto de partida, el dato impresiona sin informar realmente.',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Medios de comunicación y otros sistemas simbólicos', difficulty: 2,
    context: `"La imagen de un niño llorando en una zona de guerra puede generar más donaciones en 24 horas que meses de informes estadísticos. Los medios lo saben: el rostro mueve más que el número."`,
    stem: 'El fenómeno descrito en el texto se conoce como:',
    options_json: {
      A: 'El efecto identificación o "víctima identificable": las historias individuales generan más empatía que las estadísticas.',
      B: 'Propaganda de guerra orientada a infantilizar al enemigo.',
      C: 'Desinformación mediática sobre zonas de conflicto.',
      D: 'Censura selectiva de imágenes periodísticas.',
    },
    correct_index: 'A',
    explanation: 'La psicología del comportamiento documentó que una víctima identificable genera más respuesta emocional que datos estadísticos abstractos (Nobel: Daniel Kahneman).',
    icfes_competency: 'Medios de comunicación y otros sistemas simbólicos',
  },
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 2,
    context: `"Escribir bien no es escribir bonito. Es escribir con precisión, con claridad y con la mínima cantidad de palabras necesarias para decir exactamente lo que se quiere decir."`,
    stem: 'Según el texto, la principal virtud de la buena escritura es:',
    options_json: {
      A: 'La precisión y la economía del lenguaje.',
      B: 'El uso de vocabulario elevado y ornamental.',
      C: 'La extensión y el detalle exhaustivo.',
      D: 'La originalidad gramatical y la ruptura de normas.',
    },
    correct_index: 'A',
    explanation: '"Precisión, claridad, mínima cantidad de palabras" definen la escritura eficiente; el texto rechaza el adorno ("no es bonito") a favor de la exactitud.',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Literatura', difficulty: 2,
    context: `"Borges decía que el espejo y la enciclopedia son igualmente fantásticos: ambos multiplican al hombre."`,
    stem: 'La analogía entre espejo y enciclopedia señala que ambos:',
    options_json: {
      A: 'Reproducen o expanden la imagen y el conocimiento del ser humano más allá de sus límites inmediatos.',
      B: 'Son objetos de cristal que reflejan la realidad.',
      C: 'Representan la vanidad y la erudición vacía.',
      D: 'Son tecnologías que Borges usaba cotidianamente.',
    },
    correct_index: 'A',
    explanation: 'El espejo multiplica la imagen; la enciclopedia multiplica el saber. Ambos "expanden" al hombre: uno físicamente, otro intelectualmente.',
    icfes_competency: 'Literatura',
  },
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 2,
    context: `"El analfabetismo del siglo XXI no será no saber leer o escribir, sino no saber aprender, desaprender y reaprender." — Alvin Toffler`,
    stem: 'La idea central de Toffler es que en el siglo XXI:',
    options_json: {
      A: 'La capacidad de adaptarse y actualizar el conocimiento es más importante que dominar contenidos fijos.',
      B: 'La lectura y escritura dejaron de ser importantes.',
      C: 'Las escuelas deben enseñar menos contenidos.',
      D: 'El analfabetismo ha desaparecido gracias a la tecnología.',
    },
    correct_index: 'A',
    explanation: 'Aprender-desaprender-reaprender describe un proceso de adaptación continua: la flexibilidad cognitiva es la nueva "alfabetización".',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 2,
    context: `"Cuando un periodista preguntó a Picasso si le molestaba que copiaran su estilo, él respondió: 'Los artistas mediocres copian; los grandes artistas roban.' Con ello no defendía el plagio, sino la diferencia entre imitar servilmente y transformar lo ajeno en algo nuevo."`,
    stem: 'La frase de Picasso "los grandes artistas roban" debe entenderse como:',
    options_json: {
      A: 'Apropiarse creativamente de influencias para transformarlas en algo original.',
      B: 'El plagio es aceptable en el arte.',
      C: 'Los grandes artistas toman obras de otros sin darles crédito.',
      D: 'Picasso admite haber robado cuadros en museos.',
    },
    correct_index: 'A',
    explanation: 'El mismo texto lo aclara: no defiende el plagio sino la transformación creativa; "robar" es metáfora de asimilar para crear.',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 2,
    context: `"La objetividad periodística es un ideal necesario pero imposible. Todo reportero elige qué cubrir, qué fuente citar y qué ángulo mostrar. Esa elección ya es una postura."`,
    stem: '¿Cuál es la tesis del texto?',
    options_json: {
      A: 'La objetividad absoluta no existe en el periodismo porque toda elección editorial implica un punto de vista.',
      B: 'Los periodistas deben abandonar la objetividad y abrazar el activismo.',
      C: 'Las fuentes periodísticas siempre son sesgadas y no deben citarse.',
      D: 'La objetividad solo es posible en los medios públicos.',
    },
    correct_index: 'A',
    explanation: 'El texto argumenta que incluso las decisiones editoriales básicas (qué cubrir, qué citar) ya constituyen una toma de posición, haciendo imposible la objetividad total.',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Medios de comunicación y otros sistemas simbólicos', difficulty: 2,
    context: `"Los algoritmos de las redes sociales no muestran la realidad: construyen realidades a la medida de cada usuario. Si solo ves contenido que confirma lo que ya crees, no estás informado: estás siendo confirmado."`,
    stem: 'El texto critica principalmente el fenómeno conocido como:',
    options_json: {
      A: 'La burbuja de filtros o cámara de eco, donde el usuario solo accede a información que refuerza sus creencias.',
      B: 'La censura estatal de contenidos en internet.',
      C: 'El exceso de información objetiva en las plataformas.',
      D: 'La brecha digital entre países ricos y pobres.',
    },
    correct_index: 'A',
    explanation: '"Solo ves lo que ya crees" describe exactamente la burbuja de filtros (filter bubble, Eli Pariser): los algoritmos personalizan y limitan la exposición a perspectivas diversas.',
    icfes_competency: 'Medios de comunicación y otros sistemas simbólicos',
  },
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 2,
    context: `"Había vivido setenta años pensando que era valiente. Fue solo en ese momento, frente al médico, cuando entendió que había confundido valentía con no haber tenido miedo suficiente todavía."`,
    stem: 'El fragmento propone una redefinición de la valentía como:',
    options_json: {
      A: 'Actuar a pesar del miedo, no la ausencia de miedo.',
      B: 'La capacidad de no sentir miedo ante ninguna situación.',
      C: 'La experiencia acumulada en setenta años de vida.',
      D: 'Una cualidad innata presente desde la infancia.',
    },
    correct_index: 'A',
    explanation: '"Confundió valentía con no haber tenido miedo suficiente" implica que la verdadera valentía coexiste con el miedo; sin miedo no hay valentía real.',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Literatura', difficulty: 2,
    context: `"La novela era larga. Larga como la espera, como el olvido, como esas noches en que el insomnio es más honesto que cualquier sueño."`,
    stem: 'Las comparaciones "larga como la espera", "como el olvido", "como esas noches…" pertenecen a la figura retórica de:',
    options_json: { A: 'Símil (o comparación)', B: 'Metáfora', C: 'Hipérbole', D: 'Sinécdoque' },
    correct_index: 'A',
    explanation: 'El uso explícito de "como" establece una comparación entre la novela y otras experiencias de duración subjetiva; eso es el símil.',
    icfes_competency: 'Literatura',
  },
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 2,
    context: `"Declarar la guerra es fácil; lo difícil es conseguir la paz. Cualquier torpe puede romper un espejo; el arte está en saber pulirlo."`,
    stem: 'La metáfora del espejo ilustra la idea de que:',
    options_json: {
      A: 'Destruir es sencillo; construir o reparar requiere habilidad y esfuerzo.',
      B: 'Los espejos son objetos frágiles que se deben proteger.',
      C: 'La paz se logra a través del arte plástico.',
      D: 'Los torpes son los principales causantes de las guerras.',
    },
    correct_index: 'A',
    explanation: 'Romper = destruir (fácil); pulir = reparar/construir (difícil). La metáfora del espejo transfiere esa idea al contexto bélico.',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 2,
    context: `"La palabra 'crisis' en chino se escribe con dos caracteres: uno significa 'peligro' y el otro, 'oportunidad'. Toda crisis contiene, entonces, el germen de algo nuevo."`,
    stem: '¿Qué argumento de persuasión usa el texto para apoyar su tesis?',
    options_json: {
      A: 'Apela a la etimología y al ejemplo cultural para dar peso filosófico a su afirmación.',
      B: 'Usa datos estadísticos sobre crisis económicas.',
      C: 'Cita a un experto en economía para validar la idea.',
      D: 'Presenta un experimento científico sobre el comportamiento en crisis.',
    },
    correct_index: 'A',
    explanation: 'Recurrir a la escritura china como evidencia es un argumento de tipo etimológico-cultural: da profundidad a la tesis apelando a otra tradición de conocimiento.',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 2,
    context: `"Ser culto no es saber muchas cosas; es saber dónde buscarlas."`,
    stem: 'Esta definición de cultura redefine la sabiduría como:',
    options_json: {
      A: 'La capacidad de acceder y gestionar información más que el almacenamiento pasivo de datos.',
      B: 'La memorización exhaustiva de hechos históricos.',
      C: 'La acumulación de títulos académicos.',
      D: 'El dominio de varios idiomas.',
    },
    correct_index: 'A',
    explanation: '"Saber dónde buscar" implica habilidad metacognitiva y acceso al conocimiento; no su almacenamiento, sino su localización y uso.',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Comprensión e interpretación textual', difficulty: 2,
    context: `"La tolerancia no es aceptar todo sin cuestionarlo. Es respetar el derecho del otro a ser diferente, incluso cuando uno discrepa."`,
    stem: 'Según el texto, la tolerancia se distingue de la indiferencia porque:',
    options_json: {
      A: 'La tolerancia implica un desacuerdo activo pero respetuoso; la indiferencia es ausencia de juicio.',
      B: 'La tolerancia es pasiva; la indiferencia requiere esfuerzo.',
      C: 'Ambas actitudes son equivalentes en la práctica.',
      D: 'La tolerancia solo existe en sociedades democráticas modernas.',
    },
    correct_index: 'A',
    explanation: '"Incluso cuando uno discrepa" muestra que hay un juicio ("uno no acepta todo sin cuestionarlo"), pero se respeta el derecho del otro; eso es diferente de no opinar.',
    icfes_competency: 'Comprensión e interpretación textual',
  },
  {
    subject: 'lectura_critica', topic: 'Literatura', difficulty: 2,
    context: `"En el principio era el Verbo." — Juan 1:1 (Biblia)
    Para Borges, esta frase era el acto fundacional del lenguaje: la palabra no describe la realidad, la crea.`,
    stem: 'La interpretación de Borges sostiene que el lenguaje:',
    options_json: {
      A: 'Tiene poder constitutivo: las palabras no solo representan el mundo sino que lo construyen.',
      B: 'Es un reflejo pasivo de una realidad preexistente.',
      C: 'Solo tiene valor en contextos religiosos.',
      D: 'Es irrelevante para la comprensión de la realidad.',
    },
    correct_index: 'A',
    explanation: 'Borges ve en "el Verbo" el poder creador del lenguaje: nombrar es crear; el lenguaje no representa, constituye la realidad.',
    icfes_competency: 'Literatura',
  },
];

// ── Adaptador de formato (authoring) → esquema real de BD ────────────────────
const CI = { A: 0, B: 1, C: 2, D: 3 };
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
}));

async function seed() {
  console.log(`📦 Insertando ${rows.length} preguntas de Lectura Crítica (fácil+medio)…`);

  const { data, error } = await supabase
    .from('questions')
    .insert(rows)
    .select('id');

  if (error) {
    console.error('❌ Error al insertar:', error.message);
    process.exit(1);
  }

  console.log(`✅ ${data.length} preguntas insertadas exitosamente.`);
  console.log(`   IDs: ${data[0].id} … ${data[data.length - 1].id}`);

  const { count } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true })
    .eq('subject', 'Lectura Crítica');

  console.log(`📊 Total de preguntas de Lectura Crítica en BD: ${count}`);
}

seed();
