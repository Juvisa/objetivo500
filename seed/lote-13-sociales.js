import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const questions = [
  // ── Historia de Colombia ──────────────────────────────────────────────────
  {
    subject: 'sociales', topic: 'Historia de Colombia', difficulty: 2,
    stem: '¿Qué fue el "Bogotazo" del 9 de abril de 1948?',
    options_json: {
      A: 'El golpe de estado que llevó a Gustavo Rojas Pinilla al poder.',
      B: 'La revuelta popular desencadenada por el asesinato de Jorge Eliécer Gaitán.',
      C: 'El inicio del Frente Nacional entre liberales y conservadores.',
      D: 'La firma del Tratado de Wisconsin que terminó la Guerra de los Mil Días.',
    },
    correct_index: 'B',
    explanation: 'El Bogotazo fue la insurrección espontánea ocurrida en Bogotá el 9 de abril de 1948 tras el asesinato del líder liberal Jorge Eliécer Gaitán. Dejó cientos de muertos y marcó el inicio del período conocido como "La Violencia".',
    icfes_competency: 'Pensamiento sistémico',
  },
  {
    subject: 'sociales', topic: 'Historia de Colombia', difficulty: 2,
    stem: 'El Frente Nacional (1958–1974) fue un acuerdo político que consistía en:',
    options_json: {
      A: 'La alianza militar entre Colombia y Venezuela para combatir el narcotráfico.',
      B: 'La alternancia del poder entre liberales y conservadores cada cuatro años.',
      C: 'La creación de un partido político único que reuniera a todos los colombianos.',
      D: 'La entrega de tierras a campesinos como solución a La Violencia.',
    },
    correct_index: 'B',
    explanation: 'El Frente Nacional fue el pacto entre los partidos Liberal y Conservador para alternarse la presidencia durante 16 años (4 períodos de 4 años cada uno), repartiendo igualitariamente los cargos públicos, con el fin de poner fin a La Violencia bipartidista.',
    icfes_competency: 'Pensamiento sistémico',
  },
  {
    subject: 'sociales', topic: 'Historia de Colombia', difficulty: 3,
    stem: '¿Cuál fue la principal causa económica del surgimiento de las guerrillas colombianas en la década de 1960?',
    options_json: {
      A: 'La invasión de tropas estadounidenses al territorio colombiano.',
      B: 'La exclusión política generada por el Frente Nacional y la alta concentración de la tierra.',
      C: 'La caída de los precios del petróleo que arruinó a los campesinos.',
      D: 'La decisión del gobierno de eliminar los subsidios agrícolas.',
    },
    correct_index: 'B',
    explanation: 'Las FARC y el ELN surgieron en un contexto de exclusión política del Frente Nacional (que cerró el espacio a terceros partidos) y de profunda desigualdad agraria con alta concentración de la tierra, factores que alimentaron la insurgencia campesina de inspiración marxista.',
    icfes_competency: 'Interpretación y análisis de perspectivas',
  },
  {
    subject: 'sociales', topic: 'Historia de Colombia', difficulty: 2,
    stem: 'La Constitución Política de Colombia de 1991 reemplazó a la Constitución de 1886. ¿Qué mecanismo fue empleado para crearla?',
    options_json: {
      A: 'Un referendo aprobado por el Congreso de la República.',
      B: 'Un decreto del presidente Cesar Gaviria.',
      C: 'Una Asamblea Nacional Constituyente convocada por iniciativa estudiantil y popular.',
      D: 'Una resolución de la Corte Suprema de Justicia.',
    },
    correct_index: 'C',
    explanation: 'La Constitución de 1991 nació de una Asamblea Nacional Constituyente, impulsada originalmente por el movimiento estudiantil de la "séptima papeleta" y convocada durante el gobierno de Cesar Gaviria. Fue un proceso participativo inédito en la historia colombiana.',
    icfes_competency: 'Pensamiento sistémico',
  },
  {
    subject: 'sociales', topic: 'Historia de Colombia', difficulty: 3,
    stem: 'El proceso de paz firmado en 2016 entre el gobierno colombiano y las FARC-EP fue negociado en:',
    options_json: {
      A: 'Cartagena de Indias, Colombia.',
      B: 'La Habana, Cuba.',
      C: 'Ciudad de Panamá, Panamá.',
      D: 'Caracas, Venezuela.',
    },
    correct_index: 'B',
    explanation: 'Las negociaciones del Acuerdo de Paz entre el gobierno de Juan Manuel Santos y las FARC-EP se realizaron principalmente en La Habana, Cuba (2012–2016), con Noruega y Cuba como países garantes.',
    icfes_competency: 'Pensamiento sistémico',
  },

  // ── Historia Universal ────────────────────────────────────────────────────
  {
    subject: 'sociales', topic: 'Historia Universal', difficulty: 2,
    stem: 'La Primera Guerra Mundial (1914–1918) fue desencadenada directamente por:',
    options_json: {
      A: 'La invasión alemana de Polonia el 1 de septiembre de 1939.',
      B: 'El asesinato del archiduque Francisco Fernando de Austria en Sarajevo.',
      C: 'El hundimiento del buque Lusitania por un submarino alemán.',
      D: 'La crisis de los misiles en Cuba entre EE.UU. y la URSS.',
    },
    correct_index: 'B',
    explanation: 'El asesinato del archiduque Francisco Fernando, heredero al trono austro-húngaro, en Sarajevo el 28 de junio de 1914, a manos del nacionalista serbio Gavrilo Princip, fue el detonante inmediato que activó el sistema de alianzas y llevó a la guerra.',
    icfes_competency: 'Pensamiento sistémico',
  },
  {
    subject: 'sociales', topic: 'Historia Universal', difficulty: 2,
    stem: 'La Revolución Francesa (1789) tuvo como uno de sus principales lemas:',
    options_json: {
      A: 'Paz, tierra y libertad.',
      B: 'Libertad, igualdad, fraternidad.',
      C: 'Unidad, trabajo y prosperidad.',
      D: 'Dios, patria y rey.',
    },
    correct_index: 'B',
    explanation: '"Liberté, égalité, fraternité" fue el lema de la Revolución Francesa que sintetizó los principios de la Ilustración y se convirtió en el fundamento de la democracia liberal moderna.',
    icfes_competency: 'Pensamiento sistémico',
  },
  {
    subject: 'sociales', topic: 'Historia Universal', difficulty: 3,
    stem: 'El Plan Marshall (1948) fue una iniciativa estadounidense cuyo principal objetivo era:',
    options_json: {
      A: 'Crear la OTAN como alianza militar contra la URSS.',
      B: 'Reconstruir las economías europeas devastadas por la Segunda Guerra Mundial para frenar la expansión del comunismo.',
      C: 'Financiar la descolonización de los territorios africanos y asiáticos.',
      D: 'Establecer la ONU como organismo de seguridad colectiva.',
    },
    correct_index: 'B',
    explanation: 'El Plan Marshall (European Recovery Program) destinó más de 13.000 millones de dólares a la reconstrucción de Europa Occidental, con el objetivo tanto económico (restablecer mercados) como geopolítico (impedir que la pobreza y el descontento favorecieran la expansión soviética).',
    icfes_competency: 'Interpretación y análisis de perspectivas',
  },
  {
    subject: 'sociales', topic: 'Historia Universal', difficulty: 2,
    stem: 'La caída del Muro de Berlín en 1989 simbolizó:',
    options_json: {
      A: 'El inicio de la Guerra Fría entre EE.UU. y la URSS.',
      B: 'El fin de la Segunda Guerra Mundial en Europa.',
      C: 'El colapso del comunismo en Europa del Este y el fin de la Guerra Fría.',
      D: 'La reunificación de Corea del Norte y Corea del Sur.',
    },
    correct_index: 'C',
    explanation: 'La caída del Muro de Berlín el 9 de noviembre de 1989 marcó el colapso de los regímenes comunistas en Europa del Este y simbolizó el fin de la Guerra Fría, culminando con la disolución de la URSS en 1991.',
    icfes_competency: 'Pensamiento sistémico',
  },
  {
    subject: 'sociales', topic: 'Historia Universal', difficulty: 3,
    stem: 'El proceso de descolonización en África durante las décadas de 1950 y 1960 fue impulsado principalmente por:',
    options_json: {
      A: 'Las invasiones militares de China que liberaron a los pueblos africanos.',
      B: 'Los movimientos nacionalistas locales, el debilitamiento de las potencias europeas tras la WWII y la presión de la ONU.',
      C: 'La intervención directa de Estados Unidos que forzó a Europa a ceder sus colonias.',
      D: 'El colapso económico de África que hizo insostenible el sistema colonial.',
    },
    correct_index: 'B',
    explanation: 'La descolonización africana resultó de la convergencia de movimientos independentistas locales (Nkrumah, Kenyatta, etc.), el agotamiento económico y político de las potencias coloniales europeas (Francia, Gran Bretaña) tras la Segunda Guerra Mundial, y el nuevo contexto internacional de la ONU que reconocía el derecho a la autodeterminación.',
    icfes_competency: 'Interpretación y análisis de perspectivas',
  },

  // ── Geografía ─────────────────────────────────────────────────────────────
  {
    subject: 'sociales', topic: 'Geografía', difficulty: 1,
    stem: '¿Cuál es el río más largo de Colombia y uno de los más importantes de América del Sur?',
    options_json: { A: 'Río Cauca', B: 'Río Atrato', C: 'Río Magdalena', D: 'Río Meta' },
    correct_index: 'C',
    explanation: 'El río Magdalena, con aproximadamente 1.528 km de longitud, es el río más importante de Colombia. Atraviesa el país de sur a norte entre las cordilleras Central y Oriental, y desemboca en el mar Caribe cerca de Barranquilla.',
    icfes_competency: 'Pensamiento sistémico',
  },
  {
    subject: 'sociales', topic: 'Geografía', difficulty: 2,
    stem: 'El fenómeno climático conocido como "La Niña" en Colombia generalmente provoca:',
    options_json: {
      A: 'Sequías severas e incendios forestales en toda la región andina.',
      B: 'Lluvias intensas, inundaciones y deslizamientos de tierra.',
      C: 'Temperaturas extremadamente bajas que afectan los cultivos.',
      D: 'Huracanes en las costas del Pacífico colombiano.',
    },
    correct_index: 'B',
    explanation: 'El fenómeno "La Niña" (enfriamiento de las aguas del Pacífico tropical) provoca en Colombia un aumento de las precipitaciones, especialmente en las regiones Andina, Caribe y Pacífica, generando inundaciones, avalanchas y deslizamientos.',
    icfes_competency: 'Pensamiento sistémico',
  },
  {
    subject: 'sociales', topic: 'Geografía', difficulty: 2,
    stem: 'Colombia es el único país de Suramérica con costas en dos océanos. ¿Cuáles son?',
    options_json: {
      A: 'Atlántico y Ártico',
      B: 'Pacífico e Índico',
      C: 'Caribe (Atlántico) y Pacífico',
      D: 'Pacífico y Antártico',
    },
    correct_index: 'C',
    explanation: 'Colombia tiene costas en el mar Caribe (océano Atlántico) al norte, con aproximadamente 1.600 km de litoral, y en el océano Pacífico al oeste, con cerca de 1.300 km de litoral, lo que le otorga una posición geoestratégica privilegiada.',
    icfes_competency: 'Pensamiento sistémico',
  },
  {
    subject: 'sociales', topic: 'Geografía', difficulty: 3,
    stem: 'La región de la Orinoquia colombiana se caracteriza principalmente por:',
    options_json: {
      A: 'Ser la zona de mayor diversidad biológica del mundo con selvas húmedas tropicales.',
      B: 'Presentar extensas llanuras (llanos) con una marcada estacionalidad entre época seca y lluviosa.',
      C: 'Tener una economía basada exclusivamente en la pesca artesanal.',
      D: 'Ser la región más densamente poblada de Colombia.',
    },
    correct_index: 'B',
    explanation: 'La Orinoquia (Llanos Orientales) se caracteriza por sus vastas sabanas tropicales con una estacionalidad climática marcada: temporada de lluvias (inundaciones de los llanos) y temporada seca. Su economía se basa en ganadería extensiva, agricultura y, cada vez más, explotación petrolera.',
    icfes_competency: 'Pensamiento sistémico',
  },
  {
    subject: 'sociales', topic: 'Geografía', difficulty: 1,
    stem: '¿Qué cordillera colombiana es la más alta y contiene el Pico Cristóbal Colón, la cima más elevada del país?',
    options_json: {
      A: 'Cordillera Central',
      B: 'Cordillera Occidental',
      C: 'Cordillera Oriental',
      D: 'Sierra Nevada de Santa Marta',
    },
    correct_index: 'D',
    explanation: 'La Sierra Nevada de Santa Marta, ubicada en la costa Caribe colombiana, contiene los picos Cristóbal Colón y Simón Bolívar (ambos a ~5.775 m), las cimas más altas de Colombia. No hace parte del sistema de los Andes sino que es un macizo independiente.',
    icfes_competency: 'Pensamiento sistémico',
  },

  // ── Constitución y Ciudadanía ─────────────────────────────────────────────
  {
    subject: 'sociales', topic: 'Constitución y Ciudadanía', difficulty: 1,
    stem: '¿Qué es la acción de tutela en Colombia?',
    options_json: {
      A: 'Un recurso para impugnar leyes inconstitucionales ante la Corte Constitucional.',
      B: 'Un mecanismo judicial para proteger los derechos fundamentales de manera inmediata.',
      C: 'Una acción popular para defender los derechos colectivos del medio ambiente.',
      D: 'Un proceso ordinario para resolver conflictos entre ciudadanos.',
    },
    correct_index: 'B',
    explanation: 'La tutela (Art. 86 de la Constitución) es un mecanismo de protección inmediata de los derechos fundamentales. Cualquier persona puede interponerla cuando estos derechos sean vulnerados o amenazados por la acción u omisión de cualquier autoridad pública o particular.',
    icfes_competency: 'Pensamiento sistémico',
  },
  {
    subject: 'sociales', topic: 'Constitución y Ciudadanía', difficulty: 2,
    stem: 'Según la Constitución de 1991, Colombia se define como un Estado Social de Derecho. ¿Qué implica este concepto?',
    options_json: {
      A: 'Que el Estado solo garantiza derechos a quienes pagan impuestos.',
      B: 'Que el Estado debe garantizar derechos fundamentales y condiciones mínimas de bienestar a todos los ciudadanos.',
      C: 'Que las leyes están por encima de la Constitución.',
      D: 'Que el poder ejecutivo puede legislar sin intervención del Congreso.',
    },
    correct_index: 'B',
    explanation: 'El Estado Social de Derecho implica que el Estado no solo respeta los derechos individuales sino que también interviene activamente para garantizar condiciones materiales dignas (salud, educación, vivienda) y reducir las desigualdades sociales.',
    icfes_competency: 'Pensamiento sistémico',
  },
  {
    subject: 'sociales', topic: 'Constitución y Ciudadanía', difficulty: 2,
    stem: 'El habeas corpus es un mecanismo que protege:',
    options_json: {
      A: 'El derecho a la propiedad privada frente a expropiaciones ilegales.',
      B: 'La libertad personal frente a detenciones arbitrarias o ilegales.',
      C: 'El derecho al voto frente a irregularidades electorales.',
      D: 'La integridad del medio ambiente ante actividades contaminantes.',
    },
    correct_index: 'B',
    explanation: 'El habeas corpus (Art. 30 de la Constitución) es un derecho fundamental que toda persona puede invocar para ser llevada ante un juez cuando considere que su detención es ilegal o arbitraria, quien deberá ordenar la libertad si no hay causa legal válida.',
    icfes_competency: 'Pensamiento sistémico',
  },
  {
    subject: 'sociales', topic: 'Constitución y Ciudadanía', difficulty: 3,
    stem: '¿Cuál es la función principal de la Corte Constitucional de Colombia?',
    options_json: {
      A: 'Juzgar a los altos funcionarios del Estado por delitos comunes.',
      B: 'Guardar la supremacía e integridad de la Constitución y revisar la constitucionalidad de las leyes.',
      C: 'Dirimir conflictos entre los poderes ejecutivo y legislativo.',
      D: 'Impartir justicia en los casos relacionados con el narcotráfico.',
    },
    correct_index: 'B',
    explanation: 'La Corte Constitucional (Art. 241 de la Constitución) es el órgano encargado de garantizar la supremacía de la Constitución, revisando la constitucionalidad de las leyes, los decretos y las decisiones de tutela, entre otras funciones.',
    icfes_competency: 'Pensamiento sistémico',
  },
  {
    subject: 'sociales', topic: 'Constitución y Ciudadanía', difficulty: 3,
    stem: 'La "consulta previa" en Colombia es un derecho que protege principalmente a:',
    options_json: {
      A: 'Los empresarios antes de iniciar proyectos de inversión extranjera.',
      B: 'Los partidos políticos antes de presentar candidatos a elecciones.',
      C: 'Las comunidades indígenas y afrodescendientes ante proyectos que afecten sus territorios.',
      D: 'Los ciudadanos antes de que el Congreso apruebe nuevos impuestos.',
    },
    correct_index: 'C',
    explanation: 'La consulta previa (Convenio 169 de la OIT, incorporado al bloque de constitucionalidad) garantiza a comunidades étnicas el derecho a ser consultadas de buena fe antes de cualquier decisión o proyecto que pueda afectar su territorio, cultura o modo de vida.',
    icfes_competency: 'Interpretación y análisis de perspectivas',
  },
  {
    subject: 'sociales', topic: 'Constitución y Ciudadanía', difficulty: 2,
    stem: 'En Colombia, la edad mínima para ejercer el derecho al voto es:',
    options_json: { A: '14 años', B: '16 años', C: '18 años', D: '21 años' },
    correct_index: 'C',
    explanation: 'El artículo 99 de la Constitución de 1991 establece que la ciudadanía colombiana se adquiere a los 18 años, momento a partir del cual se puede ejercer el derecho al sufragio.',
    icfes_competency: 'Pensamiento sistémico',
  },

  // ── Economía ──────────────────────────────────────────────────────────────
  {
    subject: 'sociales', topic: 'Economía', difficulty: 2,
    stem: 'El Producto Interno Bruto (PIB) de un país mide:',
    options_json: {
      A: 'El valor de todos los bienes y servicios producidos por los ciudadanos de un país, dentro y fuera de su territorio.',
      B: 'El valor total de los bienes y servicios finales producidos dentro del territorio de un país en un período determinado.',
      C: 'El ingreso promedio de los hogares de un país en un año.',
      D: 'El total de las exportaciones menos las importaciones de un país.',
    },
    correct_index: 'B',
    explanation: 'El PIB mide el valor de mercado de todos los bienes y servicios finales producidos dentro de las fronteras de un país en un período específico (generalmente un año). Se distingue del PNB, que mide la producción de los nacionales independientemente de dónde se realice.',
    icfes_competency: 'Pensamiento sistémico',
  },
  {
    subject: 'sociales', topic: 'Economía', difficulty: 2,
    stem: '¿Qué es la inflación?',
    options_json: {
      A: 'El aumento sostenido y generalizado en el nivel de precios de una economía.',
      B: 'La disminución del valor de las exportaciones de un país.',
      C: 'El incremento del desempleo en períodos de recesión económica.',
      D: 'La devaluación de la moneda frente al dólar estadounidense.',
    },
    correct_index: 'A',
    explanation: 'La inflación es el incremento sostenido y generalizado en los precios de bienes y servicios en un período de tiempo. Reduce el poder adquisitivo de la moneda. Su opuesto es la deflación (caída sostenida de precios).',
    icfes_competency: 'Pensamiento sistémico',
  },
  {
    subject: 'sociales', topic: 'Economía', difficulty: 3,
    stem: 'El coeficiente de Gini mide:',
    options_json: {
      A: 'El crecimiento económico de un país en relación con sus vecinos.',
      B: 'El grado de desigualdad en la distribución del ingreso dentro de una sociedad.',
      C: 'La competitividad de las exportaciones de un país.',
      D: 'La eficiencia del gasto público en educación y salud.',
    },
    correct_index: 'B',
    explanation: 'El coeficiente de Gini varía entre 0 (igualdad perfecta: todos tienen el mismo ingreso) y 1 (desigualdad máxima: una persona tiene todo el ingreso). Es la medida más utilizada internacionalmente para comparar la desigualdad distributiva entre países.',
    icfes_competency: 'Pensamiento sistémico',
  },
  {
    subject: 'sociales', topic: 'Economía', difficulty: 2,
    stem: 'Una política fiscal expansiva consiste en:',
    options_json: {
      A: 'Reducir el gasto público y aumentar los impuestos para equilibrar el presupuesto.',
      B: 'Aumentar el gasto público o reducir impuestos para estimular la demanda agregada.',
      C: 'Subir las tasas de interés para controlar la inflación.',
      D: 'Devaluar la moneda para hacer más competitivas las exportaciones.',
    },
    correct_index: 'B',
    explanation: 'La política fiscal expansiva utiliza el gasto público (mayor inversión estatal) o reducciones impositivas para inyectar dinero en la economía y estimular la demanda. Es típicamente usada en períodos de recesión. La política monetaria (tasas de interés) es responsabilidad del banco central.',
    icfes_competency: 'Pensamiento sistémico',
  },
  {
    subject: 'sociales', topic: 'Economía', difficulty: 3,
    stem: 'La "Enfermedad Holandesa" (Dutch Disease) describe el fenómeno por el cual:',
    options_json: {
      A: 'La industrialización excesiva destruye el sector agrícola de un país.',
      B: 'El auge exportador de un recurso natural aprecia la moneda y daña la competitividad de otros sectores productivos.',
      C: 'La apertura económica genera desempleo masivo en el sector manufacturero.',
      D: 'La inflación importada destruye el poder adquisitivo de los hogares.',
    },
    correct_index: 'B',
    explanation: 'La Enfermedad Holandesa (acuñada tras el auge del gas natural en Países Bajos en los 60) ocurre cuando el boom de un sector exportador (petróleo, gas, minería) aprecia la moneda local, encareciendo las exportaciones de otros sectores y desindustrializando la economía.',
    icfes_competency: 'Interpretación y análisis de perspectivas',
  },
  {
    subject: 'sociales', topic: 'Economía', difficulty: 2,
    stem: 'Cuando el banco central de un país sube las tasas de interés, el efecto esperado es:',
    options_json: {
      A: 'Mayor inversión empresarial y más empleo.',
      B: 'Reducción del consumo y la inversión, frenando la inflación.',
      C: 'Aumento del déficit fiscal del gobierno.',
      D: 'Depreciación de la moneda nacional.',
    },
    correct_index: 'B',
    explanation: 'Tasas de interés más altas encarecen el crédito, lo que desincentiva el consumo a crédito y la inversión empresarial. Esto reduce la demanda agregada y, con ello, las presiones inflacionarias. Es la principal herramienta de política monetaria contractiva.',
    icfes_competency: 'Pensamiento sistémico',
  },
  {
    subject: 'sociales', topic: 'Economía', difficulty: 3,
    stem: 'El Índice de Desarrollo Humano (IDH) del PNUD combina indicadores de:',
    options_json: {
      A: 'PIB per cápita, exportaciones y deuda pública.',
      B: 'Salud (esperanza de vida), educación (escolaridad) e ingreso (PIB per cápita ajustado).',
      C: 'Democracia, libertad de prensa y corrupción.',
      D: 'Inflación, desempleo y crecimiento económico.',
    },
    correct_index: 'B',
    explanation: 'El IDH (creado por Mahbub ul Haq y Amartya Sen) mide el desarrollo humano en tres dimensiones: vida larga y saludable (esperanza de vida), conocimiento (años de escolaridad) e ingreso (INB per cápita). Va de 0 a 1.',
    icfes_competency: 'Pensamiento sistémico',
  },

  // ── Ciencia Política ──────────────────────────────────────────────────────
  {
    subject: 'sociales', topic: 'Ciencia Política', difficulty: 2,
    stem: '¿Cuál es la diferencia fundamental entre un sistema presidencialista y uno parlamentario?',
    options_json: {
      A: 'En el presidencialismo el ejecutivo no tiene período fijo; en el parlamentarismo sí.',
      B: 'En el presidencialismo el ejecutivo es elegido directamente y es independiente del legislativo; en el parlamentarismo el gobierno surge del parlamento y depende de su confianza.',
      C: 'En el presidencialismo hay múltiples partidos; en el parlamentarismo solo dos.',
      D: 'En el presidencialismo el presidente es también jefe de Estado y de gobierno; en el parlamentarismo no existe ningún jefe de Estado.',
    },
    correct_index: 'B',
    explanation: 'En el presidencialismo (EE.UU., Colombia), el ejecutivo es elegido por voto popular y tiene mandato fijo independiente del legislativo. En el parlamentarismo (Reino Unido, Alemania), el gobierno (primer ministro y gabinete) es designado y puede ser removido por el parlamento.',
    icfes_competency: 'Interpretación y análisis de perspectivas',
  },
  {
    subject: 'sociales', topic: 'Ciencia Política', difficulty: 3,
    stem: 'En teoría política, el concepto de "hegemonía cultural" desarrollado por Antonio Gramsci se refiere a:',
    options_json: {
      A: 'El dominio militar de una potencia sobre otras naciones más débiles.',
      B: 'La dominación ideológica mediante la cual la clase dirigente logra que los grupos subalternos acepten su visión del mundo como sentido común.',
      C: 'La superioridad económica que permite a un país imponer sus reglas comerciales.',
      D: 'El control del Estado sobre los medios de comunicación y la educación.',
    },
    correct_index: 'B',
    explanation: 'Gramsci distinguió la hegemonía (dominio por consenso cultural e ideológico) de la coerción (dominio por la fuerza). La clase dominante ejerce hegemonía cuando logra que sus valores, normas e interpretaciones del mundo sean asumidos por los dominados como propios y naturales.',
    icfes_competency: 'Interpretación y análisis de perspectivas',
  },
  {
    subject: 'sociales', topic: 'Ciencia Política', difficulty: 2,
    stem: 'El principio de separación de poderes, formulado por Montesquieu, establece que:',
    options_json: {
      A: 'El poder judicial debe estar subordinado al poder ejecutivo para garantizar la gobernabilidad.',
      B: 'Los poderes legislativo, ejecutivo y judicial deben estar separados y controlarse mutuamente para evitar el abuso del poder.',
      C: 'Solo el pueblo puede ejercer el poder soberano directamente, sin representantes.',
      D: 'El poder económico y el político deben estar en manos del mismo grupo para garantizar eficiencia.',
    },
    correct_index: 'B',
    explanation: 'Montesquieu en "El espíritu de las leyes" (1748) propuso que la libertad política solo se garantiza cuando los tres poderes (legislativo, ejecutivo, judicial) están separados y se frenan mutuamente mediante un sistema de pesos y contrapesos.',
    icfes_competency: 'Pensamiento sistémico',
  },
  {
    subject: 'sociales', topic: 'Ciencia Política', difficulty: 3,
    stem: 'El "clientelismo político" se caracteriza por:',
    options_json: {
      A: 'La asignación de cargos públicos basada en méritos y concursos abiertos.',
      B: 'El intercambio de favores, recursos públicos o empleos entre políticos y votantes como relación de lealtad personal.',
      C: 'La representación de los ciudadanos mediante partidos políticos ideológicamente definidos.',
      D: 'El control ciudadano del presupuesto público mediante mecanismos de participación.',
    },
    correct_index: 'B',
    explanation: 'El clientelismo es una relación de intercambio asimétrica entre un patrón político y sus clientes (votantes), en la que el político ofrece bienes, servicios o empleos a cambio de apoyo electoral, debilitando la democracia representativa y el mérito en la función pública.',
    icfes_competency: 'Interpretación y análisis de perspectivas',
  },
  {
    subject: 'sociales', topic: 'Ciencia Política', difficulty: 2,
    stem: 'Los Derechos Humanos son considerados universales e inalienables. Esto significa que:',
    options_json: {
      A: 'Solo aplican en países que los hayan ratificado en tratados internacionales.',
      B: 'Pertenecen a toda persona por el solo hecho de ser humana, sin importar su nacionalidad, religión o condición social.',
      C: 'Pueden ser suspendidos temporalmente por los gobiernos en casos de emergencia nacional.',
      D: 'Son otorgados por el Estado a los ciudadanos que cumplan con sus deberes.',
    },
    correct_index: 'B',
    explanation: 'Los Derechos Humanos son universales (aplican a todos los seres humanos) e inalienables (no pueden ser transferidos ni renunciados). Su fuente es la dignidad inherente a la persona humana, no la concesión del Estado.',
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
  console.log(`Insertando ${rows.length} preguntas de Sociales (lote 13)…`)
  const { error } = await supabase.from('questions').insert(rows)
  if (error) { console.error('Error:', error.message); process.exit(1) }
  const { count } = await supabase.from('questions').select('*', { count: 'exact', head: true }).eq('subject', 'sociales')
  console.log(`Listo. Total sociales en BD: ${count}`)
}

seed()
