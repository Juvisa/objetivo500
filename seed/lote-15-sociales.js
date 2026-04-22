import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const questions = [
  {
    subject: 'sociales', topic: 'Historia de Colombia', difficulty: 2,
    stem: '¿Quién fue el primer presidente de la República de Colombia independiente después de la separación de la Gran Colombia?',
    options_json: { A: 'Simón Bolívar', B: 'Francisco de Paula Santander', C: 'Antonio Nariño', D: 'Rafael Núñez' },
    correct_index: 'B',
    explanation: 'Francisco de Paula Santander fue el primer presidente de la República de Nueva Granada (sucesora de la Gran Colombia) entre 1832 y 1837, después de la disolución de la Gran Colombia en 1830.',
    icfes_competency: 'Pensamiento sistémico',
  },
  {
    subject: 'sociales', topic: 'Historia de Colombia', difficulty: 2,
    stem: 'La Regeneración (1886) fue un movimiento político liderado por Rafael Núñez que buscaba principalmente:',
    options_json: {
      A: 'Federalizar el Estado colombiano dando más autonomía a las regiones.',
      B: 'Centralizar el poder, fortalecer la Iglesia Católica y reemplazar la Constitución liberal de 1863.',
      C: 'Separar la Iglesia del Estado y establecer un sistema de educación laica.',
      D: 'Abolir el ejército nacional y crear milicias regionales.',
    },
    correct_index: 'B',
    explanation: 'La Regeneración centralizó el poder político, restableció el protagonismo de la Iglesia Católica (Concordato de 1887) y reemplazó la Constitución federalista de Rionegro (1863) con la centralista de 1886, que rigió por más de 100 años.',
    icfes_competency: 'Pensamiento sistémico',
  },
  {
    subject: 'sociales', topic: 'Historia de Colombia', difficulty: 3,
    stem: 'La "masacre de las bananeras" (1928) fue un evento en el que el ejército colombiano disparó contra trabajadores en huelga de la United Fruit Company. ¿Cuál fue su principal consecuencia política?',
    options_json: {
      A: 'Fortaleció al Partido Conservador y llevó a la reelección de Miguel Abadía Méndez.',
      B: 'Desprestigió al gobierno conservador y contribuyó al ascenso del liberalismo y de Jorge Eliécer Gaitán al debate político nacional.',
      C: 'Provocó la intervención militar de Estados Unidos para proteger sus inversiones.',
      D: 'Generó la primera reforma agraria de Colombia.',
    },
    correct_index: 'B',
    explanation: 'La masacre fue denunciada en el Congreso por Jorge Eliécer Gaitán, desprestigió al régimen conservador y aceleró la "Revolución en Marcha" del liberalismo. Fue determinante para el fin de la hegemonía conservadora (1886–1930) y el triunfo liberal de 1930.',
    icfes_competency: 'Interpretación y análisis de perspectivas',
  },
  {
    subject: 'sociales', topic: 'Historia Universal', difficulty: 2,
    stem: 'El Holocausto fue el genocidio sistemático perpetrado por el régimen nazi durante la Segunda Guerra Mundial. ¿A cuántos judíos se estima que asesinaron?',
    options_json: { A: 'Aproximadamente 600.000', B: 'Aproximadamente 2 millones', C: 'Aproximadamente 6 millones', D: 'Aproximadamente 12 millones' },
    correct_index: 'C',
    explanation: 'El Holocausto resultó en el asesinato sistemático de aproximadamente 6 millones de judíos (cerca del 67% de la población judía europea), además de millones de romaníes, personas con discapacidad, homosexuales y otros grupos perseguidos por el régimen nazi.',
    icfes_competency: 'Pensamiento sistémico',
  },
  {
    subject: 'sociales', topic: 'Historia Universal', difficulty: 3,
    stem: 'La Revolución Rusa de 1917 tuvo dos etapas principales. ¿Cuál fue el resultado de la Revolución de Octubre?',
    options_json: {
      A: 'El zar Nicolás II fue depuesto y reemplazado por un gobierno provisional democrático.',
      B: 'Los bolcheviques liderados por Lenin tomaron el poder e instauraron el primer Estado comunista.',
      C: 'Rusia firmó una alianza con Alemania y salió de la Primera Guerra Mundial.',
      D: 'Se estableció una monarquía constitucional con Kerenski como primer ministro.',
    },
    correct_index: 'B',
    explanation: 'La Revolución de Febrero derrocó al zar; la de Octubre (noviembre en el calendario gregoriano) fue el golpe bolchevique que derrocó al gobierno provisional de Kerenski. Lenin y los bolcheviques establecieron el primer Estado soviético, que firmó la paz con Alemania (Tratado de Brest-Litovsk, 1918).',
    icfes_competency: 'Pensamiento sistémico',
  },
  {
    subject: 'sociales', topic: 'Geografía', difficulty: 2,
    stem: '¿Cuál es la capital del departamento del Chocó y cuál es su principal característica geográfica?',
    options_json: {
      A: 'Montería; es la ciudad más calurosa de Colombia.',
      B: 'Quibdó; es una de las zonas más lluviosas del mundo con más de 9.000 mm de precipitación anual.',
      C: 'Apartadó; es el principal puerto bananero de Colombia.',
      D: 'Riohacha; es la capital de la región del Caribe semiárido.',
    },
    correct_index: 'B',
    explanation: 'Quibdó es la capital del Chocó y una de las ciudades más lluviosas del mundo (puede superar los 9.000 mm anuales). El Chocó es una de las regiones con mayor biodiversidad del planeta y tiene una de las poblaciones afrodescendientes más grandes de Colombia.',
    icfes_competency: 'Pensamiento sistémico',
  },
  {
    subject: 'sociales', topic: 'Geografía', difficulty: 2,
    stem: 'Las tres cordilleras colombianas (Occidental, Central y Oriental) son ramificaciones de:',
    options_json: {
      A: 'La Cordillera del Caribe, que se extiende desde Venezuela.',
      B: 'El Macizo Colombiano, ubicado en el sur del país (nudo de los Pastos y Macizo Andino).',
      C: 'La Cordillera de los Andes venezolanos que entra por el nororiente.',
      D: 'El Escudo Guayanés que se extiende desde Brasil.',
    },
    correct_index: 'B',
    explanation: 'Las tres cordilleras colombianas se originan en el Nudo de los Pastos (sur de Colombia, frontera con Ecuador), donde la Cordillera de los Andes se trifurca en Occidental, Central y Oriental.',
    icfes_competency: 'Pensamiento sistémico',
  },
  {
    subject: 'sociales', topic: 'Economía', difficulty: 3,
    stem: 'La "trampa de la pobreza" es un concepto que explica por qué algunas familias o países permanecen pobres. ¿Cuál de las siguientes opciones describe mejor esta idea?',
    options_json: {
      A: 'Los pobres son pobres porque no quieren trabajar y prefieren recibir subsidios del Estado.',
      B: 'La pobreza genera condiciones (desnutrición, falta de educación, baja productividad) que perpetúan la pobreza al limitar la capacidad de acumulación de capital humano y físico.',
      C: 'Los gobiernos corruptos siempre robarán los recursos destinados a combatir la pobreza.',
      D: 'La globalización inevitablemente destruye los empleos de los países más pobres.',
    },
    correct_index: 'B',
    explanation: 'La trampa de la pobreza describe mecanismos autorreinforciantes: la pobreza limita el acceso a nutrición, salud y educación, lo que reduce el capital humano y la productividad, perpetuando la pobreza en un ciclo difícil de romper sin intervención externa.',
    icfes_competency: 'Interpretación y análisis de perspectivas',
  },
  {
    subject: 'sociales', topic: 'Economía', difficulty: 2,
    stem: 'La ventaja comparativa, concepto desarrollado por David Ricardo, establece que:',
    options_json: {
      A: 'Los países solo deben exportar bienes en los que tienen ventaja absoluta de producción.',
      B: 'Los países se benefician del comercio si se especializan en producir bienes con menor costo de oportunidad relativo, aunque no sean los más eficientes en términos absolutos.',
      C: 'El libre comercio siempre beneficia a las naciones más desarrolladas a expensas de las más pobres.',
      D: 'Los países deben producir todos los bienes que necesitan para ser autosuficientes.',
    },
    correct_index: 'B',
    explanation: 'La ventaja comparativa (Ricardo, 1817) sostiene que aunque un país sea menos eficiente en todo (sin ventaja absoluta), aún puede beneficiarse del comercio especializándose en los bienes donde su desventaja es menor, logrando ganancias mutuamente beneficiosas del intercambio.',
    icfes_competency: 'Pensamiento sistémico',
  },
  {
    subject: 'sociales', topic: 'Ciencia Política', difficulty: 2,
    stem: 'El concepto de "contrato social", desarrollado por Rousseau, propone que:',
    options_json: {
      A: 'Los individuos ceden todos sus derechos naturales al Estado soberano a cambio de seguridad absoluta.',
      B: 'Los individuos acuerdan vivir en sociedad cediendo parte de su libertad natural a cambio de la protección que ofrece la comunidad política.',
      C: 'La sociedad es el resultado natural de la biología humana y no de ningún acuerdo.',
      D: 'El contrato laboral es el fundamento de la organización política moderna.',
    },
    correct_index: 'B',
    explanation: 'Rousseau en "El contrato social" (1762) argumenta que la sociedad política legítima surge de un acuerdo voluntario en el que los individuos alienan parte de su libertad natural para obtener la protección y los beneficios de la vida en comunidad bajo la "voluntad general".',
    icfes_competency: 'Pensamiento sistémico',
  },
  {
    subject: 'sociales', topic: 'Ciencia Política', difficulty: 3,
    stem: 'La "rendición de cuentas" (accountability) horizontal en un sistema democrático se refiere a:',
    options_json: {
      A: 'Los ciudadanos que votan para castigar o premiar a los gobernantes.',
      B: 'Las instituciones del Estado que se controlan mutuamente (judicial, legislativa y ejecutiva).',
      C: 'Las organizaciones de la sociedad civil que vigilan las acciones gubernamentales.',
      D: 'Los organismos internacionales que auditan el gasto público de los países.',
    },
    correct_index: 'B',
    explanation: 'La accountability horizontal (O\'Donnell) es el control que ejercen las instituciones estatales entre sí (frenar y contrapesar). La accountability vertical es la que ejercen los ciudadanos (elecciones) y la sociedad civil (prensa, ONG) sobre el Estado.',
    icfes_competency: 'Interpretación y análisis de perspectivas',
  },
  {
    subject: 'sociales', topic: 'Historia Universal', difficulty: 2,
    stem: 'La Organización de Naciones Unidas (ONU) fue fundada en 1945 con el objetivo principal de:',
    options_json: {
      A: 'Crear un gobierno mundial que reemplazara a los estados nacionales.',
      B: 'Mantener la paz y seguridad internacionales, y promover la cooperación entre naciones.',
      C: 'Administrar los territorios coloniales y facilitar su transición a la independencia.',
      D: 'Regular el comercio internacional y fijar aranceles entre los países miembros.',
    },
    correct_index: 'B',
    explanation: 'La ONU fue fundada el 24 de octubre de 1945 por 51 países, con el objetivo de mantener la paz y la seguridad internacionales, fomentar las relaciones de amistad entre naciones, y promover el progreso social y el respeto a los Derechos Humanos.',
    icfes_competency: 'Pensamiento sistémico',
  },
  {
    subject: 'sociales', topic: 'Geografía', difficulty: 3,
    stem: 'La Amazonía colombiana representa aproximadamente el 35% del territorio nacional. ¿Por qué su conservación tiene importancia global?',
    options_json: {
      A: 'Porque contiene las mayores reservas de petróleo y gas del hemisferio occidental.',
      B: 'Porque actúa como sumidero de carbono, regula el ciclo del agua y alberga la mayor biodiversidad terrestre del planeta.',
      C: 'Porque es la principal fuente de agua potable de toda América del Sur.',
      D: 'Porque sus comunidades indígenas poseen conocimientos agrícolas únicos aplicables a todo el mundo.',
    },
    correct_index: 'B',
    explanation: 'La Amazonía es fundamental para el sistema climático global: absorbe CO₂ (sumidero de carbono), genera lluvia a través de la transpiración de los árboles ("ríos voladores"), y alberga el 10% de todas las especies del planeta.',
    icfes_competency: 'Interpretación y análisis de perspectivas',
  },
  {
    subject: 'sociales', topic: 'Constitución y Ciudadanía', difficulty: 2,
    stem: 'La "acción popular" en Colombia es un mecanismo para proteger:',
    options_json: {
      A: 'Los derechos fundamentales individuales como la vida y la salud.',
      B: 'Los derechos e intereses colectivos como el medio ambiente, la moralidad administrativa y el espacio público.',
      C: 'El derecho a la libertad personal frente a detenciones ilegales.',
      D: 'Los derechos de los trabajadores frente a despidos injustificados.',
    },
    correct_index: 'B',
    explanation: 'La acción popular (Ley 472 de 1998) protege derechos colectivos como el medio ambiente sano, la seguridad pública, la moralidad administrativa y el espacio público. Cualquier persona puede interponerla, aun sin ser la directamente afectada.',
    icfes_competency: 'Pensamiento sistémico',
  },
  {
    subject: 'sociales', topic: 'Economía', difficulty: 2,
    stem: 'Cuando la demanda de un bien aumenta pero su oferta permanece constante, el efecto esperado en el mercado es:',
    options_json: {
      A: 'El precio del bien disminuye y la cantidad de equilibrio cae.',
      B: 'El precio del bien aumenta y la cantidad de equilibrio sube.',
      C: 'El precio permanece constante pero aumenta la escasez del bien.',
      D: 'La oferta se reduce automáticamente para equilibrar el mercado.',
    },
    correct_index: 'B',
    explanation: 'Un aumento de la demanda (desplazamiento a la derecha de la curva de demanda) con oferta constante genera presión al alza sobre el precio, lo que incentiva a los productores a ofrecer más, resultando en un nuevo equilibrio con precio y cantidad mayores.',
    icfes_competency: 'Pensamiento sistémico',
  },
  {
    subject: 'sociales', topic: 'Historia de Colombia', difficulty: 3,
    stem: '¿Cuál fue el impacto del narcotráfico en la violencia colombiana durante las décadas de 1980 y 1990?',
    options_json: {
      A: 'El narcotráfico redujo la violencia al generar empleo para los grupos guerrilleros que se desmovilizaron.',
      B: 'El narcotráfico intensificó la violencia: financió guerrillas y paramilitares, generó carteles criminales que asesinaron a jueces, periodistas y políticos, y debilitó las instituciones del Estado.',
      C: 'El narcotráfico solo afectó a los países consumidores y tuvo poco impacto en la política colombiana.',
      D: 'Los carteles de la droga reemplazaron completamente a las guerrillas como actores del conflicto armado.',
    },
    correct_index: 'B',
    explanation: 'El narcotráfico exacerbó el conflicto armado colombiano: los carteles de Medellín (Escobar) y Cali generaron oleadas de violencia; las FARC y los paramilitares se financiaron con la coca; el Estado fue debilitado por la corrupción y el terror (magnicidios, el "narcoterrorismo").',
    icfes_competency: 'Interpretación y análisis de perspectivas',
  },
  {
    subject: 'sociales', topic: 'Ciencia Política', difficulty: 2,
    stem: 'El sufragio universal significa que:',
    options_json: {
      A: 'Todas las personas tienen derecho a votar sin ninguna restricción.',
      B: 'Todos los ciudadanos adultos tienen derecho a votar, independientemente de su género, raza, religión o nivel de ingresos.',
      C: 'Todos los votos tienen el mismo peso en el sistema electoral.',
      D: 'Los candidatos de todos los partidos pueden participar en las elecciones sin restricciones.',
    },
    correct_index: 'B',
    explanation: 'El sufragio universal garantiza el derecho al voto a todos los ciudadanos adultos sin discriminación por género, raza, religión o condición económica. Históricamente fue una conquista progresiva: primero se excluyó a las mujeres, a los no propietarios y a las minorías raciales.',
    icfes_competency: 'Pensamiento sistémico',
  },
  {
    subject: 'sociales', topic: 'Geografía', difficulty: 1,
    stem: '¿Cuál es el volcán más alto de Colombia y dónde se ubica?',
    options_json: {
      A: 'Volcán Galeras, en el departamento de Nariño.',
      B: 'Nevado del Ruiz, en límites entre Caldas y Tolima.',
      C: 'Nevado del Huila, en límites entre Huila, Tolima y Cauca.',
      D: 'Volcán Puracé, en el departamento del Cauca.',
    },
    correct_index: 'C',
    explanation: 'El Nevado del Huila, con 5.364 m, es el volcán más alto de Colombia y el segundo pico más elevado del país. El Nevado del Ruiz (5.321 m) es más conocido por la tragedia de Armero (1985). El Galeras es el volcán más activo.',
    icfes_competency: 'Pensamiento sistémico',
  },
  {
    subject: 'sociales', topic: 'Economía', difficulty: 3,
    stem: 'El "déficit fiscal" de un gobierno ocurre cuando:',
    options_json: {
      A: 'Las exportaciones son menores que las importaciones en un año.',
      B: 'El gasto público supera los ingresos fiscales del Estado en un período.',
      C: 'El banco central no tiene suficientes reservas internacionales.',
      D: 'La inflación supera la tasa de crecimiento del PIB.',
    },
    correct_index: 'B',
    explanation: 'El déficit fiscal ocurre cuando el gasto del gobierno (inversión, subsidios, burocracia, deuda) supera sus ingresos (impuestos, regalías). Para financiarlo, el gobierno emite deuda pública. El déficit en cuenta corriente es distinto (comercio exterior).',
    icfes_competency: 'Pensamiento sistémico',
  },
  {
    subject: 'sociales', topic: 'Historia Universal', difficulty: 3,
    stem: 'El apartheid en Sudáfrica (1948–1994) fue un sistema de:',
    options_json: {
      A: 'Segregación racial institucionalizada que negaba derechos políticos, económicos y sociales a la población negra y de color.',
      B: 'Gobierno comunista que expropiaba propiedades a los blancos para redistribuirlas a la población negra.',
      C: 'Dictadura militar que perseguía a los opositores políticos independientemente de su raza.',
      D: 'Colonialismo económico ejercido por Gran Bretaña sobre la minoría blanca afrikáner.',
    },
    correct_index: 'A',
    explanation: 'El apartheid (término afrikáans para "separación") fue el régimen de segregación racial sistémica impuesto por el Partido Nacional en Sudáfrica desde 1948. Clasificó a la población por raza, negó derechos políticos a negros y colored, y fue desmantelado con la liberación de Nelson Mandela y las primeras elecciones multirraciales en 1994.',
    icfes_competency: 'Interpretación y análisis de perspectivas',
  },
  {
    subject: 'sociales', topic: 'Constitución y Ciudadanía', difficulty: 3,
    stem: 'La Jurisdicción Especial para la Paz (JEP), creada por el Acuerdo de Paz de 2016, tiene como función principal:',
    options_json: {
      A: 'Juzgar y encarcelar a los máximos responsables de crímenes de guerra sin posibilidad de ningún beneficio.',
      B: 'Administrar justicia transicional, investigar, juzgar y sancionar las graves violaciones de DDHH e infracciones al DIH del conflicto armado, priorizando la verdad, la reparación y la no repetición.',
      C: 'Indultar automáticamente a todos los combatientes que se desmovilicen.',
      D: 'Reemplazar a la Corte Suprema de Justicia en todos los casos relacionados con el conflicto.',
    },
    correct_index: 'B',
    explanation: 'La JEP es el componente judicial del Sistema Integral de Verdad, Justicia, Reparación y No Repetición (SIVJRNR). Aplica justicia transicional: quienes reconocen verdad y responsabilidad reciben sanciones propias (no privativas de la libertad); quienes no confiesan reciben penas ordinarias hasta 20 años de prisión.',
    icfes_competency: 'Pensamiento sistémico',
  },
  {
    subject: 'sociales', topic: 'Geografía', difficulty: 2,
    stem: 'La región del Pacífico colombiano se caracteriza principalmente por:',
    options_json: {
      A: 'Alta densidad poblacional y gran desarrollo industrial.',
      B: 'Ser una de las regiones más biodiversas del mundo, con alta pluviosidad y gran población afrodescendiente.',
      C: 'Presentar un clima semiárido con escasas precipitaciones durante todo el año.',
      D: 'Tener la mayor producción agrícola de Colombia con extensos cultivos de café.',
    },
    correct_index: 'B',
    explanation: 'La región Pacífica colombiana se caracteriza por su altísima biodiversidad, enormes precipitaciones (entre las más altas del planeta), y una población mayoritariamente afrodescendiente. Ciudades como Buenaventura (el puerto más importante de Colombia) y Quibdó son sus principales centros urbanos.',
    icfes_competency: 'Pensamiento sistémico',
  },
  {
    subject: 'sociales', topic: 'Ciencia Política', difficulty: 3,
    stem: 'El concepto de "gobernabilidad" se refiere a:',
    options_json: {
      A: 'La capacidad de un gobierno para mantenerse en el poder mediante el uso de la fuerza.',
      B: 'La capacidad del sistema político para procesar demandas sociales, tomar decisiones eficaces y garantizar el cumplimiento de normas con legitimidad.',
      C: 'El nivel de corrupción presente en las instituciones públicas de un país.',
      D: 'El porcentaje de ciudadanos que participan en las elecciones.',
    },
    correct_index: 'B',
    explanation: 'La gobernabilidad implica la capacidad del Estado para gestionar los asuntos públicos de manera eficaz, eficiente y legítima. Incluye la capacidad de formular e implementar políticas, resolver conflictos y mantener el orden sin recurrir exclusivamente a la coerción.',
    icfes_competency: 'Interpretación y análisis de perspectivas',
  },
  {
    subject: 'sociales', topic: 'Historia Universal', difficulty: 2,
    stem: 'La Segunda Guerra Mundial (1939–1945) terminó en Europa con:',
    options_json: {
      A: 'La rendición incondicional de Alemania el 8 de mayo de 1945 (Día de la Victoria en Europa).',
      B: 'El lanzamiento de las bombas atómicas sobre Berlín y Múnich.',
      C: 'La firma del Tratado de Versalles por parte de Hitler.',
      D: 'La invasión soviética de Gran Bretaña que forzó a Alemania a negociar.',
    },
    correct_index: 'A',
    explanation: 'La WWII en Europa terminó con la rendición incondicional de Alemania el 8 de mayo de 1945 (V-E Day), tras la caída de Berlín ante las tropas soviéticas y el suicidio de Adolf Hitler el 30 de abril. Las bombas atómicas fueron lanzadas sobre Japón (Hiroshima y Nagasaki), no sobre Alemania.',
    icfes_competency: 'Pensamiento sistémico',
  },
  {
    subject: 'sociales', topic: 'Economía', difficulty: 2,
    stem: 'La balanza comercial de un país es:',
    options_json: {
      A: 'La diferencia entre los ingresos del gobierno y sus gastos.',
      B: 'La diferencia entre el valor de las exportaciones y el valor de las importaciones de bienes.',
      C: 'El total de la deuda externa que un país tiene con otros países.',
      D: 'La suma de todas las inversiones extranjeras directas recibidas por un país.',
    },
    correct_index: 'B',
    explanation: 'La balanza comercial registra la diferencia entre exportaciones e importaciones de bienes. Si las exportaciones superan las importaciones, hay superávit comercial; si ocurre lo contrario, hay déficit comercial. Es parte de la balanza de pagos.',
    icfes_competency: 'Pensamiento sistémico',
  },
  {
    subject: 'sociales', topic: 'Constitución y Ciudadanía', difficulty: 1,
    stem: '¿Cuántas ramas del poder público existen en Colombia según la Constitución de 1991?',
    options_json: {
      A: 'Dos: el poder ejecutivo y el legislativo.',
      B: 'Tres: el ejecutivo, el legislativo y el judicial.',
      C: 'Cuatro: el ejecutivo, el legislativo, el judicial y el electoral.',
      D: 'Cinco: el ejecutivo, el legislativo, el judicial, el electoral y el de control.',
    },
    correct_index: 'B',
    explanation: 'La Constitución de 1991 establece tres ramas del poder público: ejecutiva (Presidente), legislativa (Congreso) y judicial (Corte Suprema, Corte Constitucional, Consejo de Estado, etc.). Los órganos de control (Procuraduría, Contraloría) y el organismo electoral son autónomos e independientes.',
    icfes_competency: 'Pensamiento sistémico',
  },
  {
    subject: 'sociales', topic: 'Historia de Colombia', difficulty: 2,
    stem: 'La Guerra de los Mil Días (1899–1902) fue un conflicto entre:',
    options_json: {
      A: 'Colombia y Panamá por el control del canal interoceánico.',
      B: 'Los partidos Liberal y Conservador de Colombia, con victoria conservadora.',
      C: 'Colombia y Venezuela por el control del río Orinoco.',
      D: 'El gobierno colombiano y los primeros grupos guerrilleros comunistas.',
    },
    correct_index: 'B',
    explanation: 'La Guerra de los Mil Días fue una guerra civil entre el Partido Liberal (en rebelión) y el Partido Conservador (en el poder). Terminó con la victoria conservadora y el Tratado de Neerlandia (1902). Resultó devastadora y contribuyó a la separación de Panamá en 1903.',
    icfes_competency: 'Pensamiento sistémico',
  },
  {
    subject: 'sociales', topic: 'Geografía', difficulty: 2,
    stem: 'El río Amazonas, el más caudaloso del mundo, nace principalmente en:',
    options_json: {
      A: 'El lago Titicaca en Bolivia.',
      B: 'Las montañas de los Andes peruanos y ecuatorianos.',
      C: 'Las sabanas del Mato Grosso en Brasil.',
      D: 'La selva colombiana cerca de Leticia.',
    },
    correct_index: 'B',
    explanation: 'El Amazonas se forma a partir de ríos que nacen en los Andes peruanos y ecuatorianos. Su fuente más lejana es el río Apurímac en los Andes del Perú. Colombia participa en su cuenca a través del río Amazonas en el extremo sur (Leticia) y tributarios como el Putumayo.',
    icfes_competency: 'Pensamiento sistémico',
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
  console.log(`Insertando ${rows.length} preguntas de Sociales (lote 15)…`)
  const { error } = await supabase.from('questions').insert(rows)
  if (error) { console.error('Error:', error.message); process.exit(1) }
  const { count } = await supabase.from('questions').select('*', { count: 'exact', head: true }).eq('subject', 'sociales')
  console.log(`Listo. Total sociales en BD: ${count}`)
}

seed()
