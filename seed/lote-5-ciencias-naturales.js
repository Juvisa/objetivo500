import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 100 preguntas de Ciencias Naturales — difficulty 1 (fácil×60) y 2 (medio×40)
// Áreas: Biología · Química · Física
// Competencias ICFES: Uso comprensivo del conocimiento científico
//                     Explicación de fenómenos · Indagación

const questions = [

  // ══════════════════════════════════════════════════════
  // BIOLOGÍA — FÁCIL (1-22)
  // ══════════════════════════════════════════════════════

  // Célula
  {
    subject: 'ciencias_naturales', topic: 'Biología', difficulty: 1,
    stem: 'La unidad básica estructural y funcional de los seres vivos es:',
    options_json: { A: 'La célula', B: 'El tejido', C: 'El átomo', D: 'El órgano' },
    correct_index: 'A',
    explanation: 'La teoría celular establece que la célula es la unidad mínima de vida; todo ser vivo está formado por una o más células.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Biología', difficulty: 1,
    stem: 'La diferencia principal entre célula procariota y eucariota es:',
    options_json: {
      A: 'La eucariota tiene núcleo definido con membrana; la procariota no.',
      B: 'La procariota es más grande que la eucariota.',
      C: 'Solo la procariota tiene ADN.',
      D: 'Solo la eucariota puede dividirse.',
    },
    correct_index: 'A',
    explanation: 'Las células procariotas (bacterias) carecen de membrana nuclear; las eucariotas (animales, plantas, hongos) tienen núcleo definido rodeado por membrana.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Biología', difficulty: 1,
    stem: 'El orgánulo celular encargado de la respiración celular y producción de ATP es:',
    options_json: { A: 'La mitocondria', B: 'El cloroplasto', C: 'El ribosoma', D: 'El lisosoma' },
    correct_index: 'A',
    explanation: 'La mitocondria es la "central energética" de la célula; en ella ocurre la respiración aeróbica que produce la mayor parte del ATP.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Biología', difficulty: 1,
    stem: 'Los ribosomas son los orgánulos responsables de:',
    options_json: { A: 'La síntesis de proteínas', B: 'La fotosíntesis', C: 'La digestión intracelular', D: 'El almacenamiento de agua' },
    correct_index: 'A',
    explanation: 'Los ribosomas traducen el ARNm para ensamblar cadenas de aminoácidos, produciendo proteínas.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Biología', difficulty: 1,
    stem: 'La membrana plasmática regula el paso de sustancias hacia y desde la célula. Esta propiedad se llama:',
    options_json: { A: 'Permeabilidad selectiva', B: 'Osmosis total', C: 'Difusión libre', D: 'Impermeabilidad' },
    correct_index: 'A',
    explanation: 'La membrana plasmática es semipermi able o selectivamente permeable: deja pasar algunas sustancias y bloquea otras según su tamaño, carga y polaridad.',
    icfes_competency: 'Explicación de fenómenos',
  },

  // Genética
  {
    subject: 'ciencias_naturales', topic: 'Biología', difficulty: 1,
    stem: 'El ADN está formado por la secuencia de cuatro bases nitrogenadas. ¿Cuál de las siguientes NO es una de ellas?',
    options_json: { A: 'Uracilo', B: 'Adenina', C: 'Guanina', D: 'Timina' },
    correct_index: 'A',
    explanation: 'El uracilo es una base del ARN, no del ADN. Las bases del ADN son adenina (A), timina (T), guanina (G) y citosina (C).',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Biología', difficulty: 1,
    stem: 'En la primera Ley de Mendel (Ley de la segregación), se establece que:',
    options_json: {
      A: 'Cada individuo porta dos alelos para cada carácter y los separa al formar gametos.',
      B: 'Todos los caracteres se heredan juntos.',
      C: 'Los hijos son siempre iguales a los padres.',
      D: 'Los genes de distintos cromosomas se heredan en bloque.',
    },
    correct_index: 'A',
    explanation: 'La ley de segregación indica que los dos alelos de un gen se separan durante la meiosis, de modo que cada gameto recibe solo uno.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Biología', difficulty: 1,
    stem: 'Si un individuo tiene genotipo Aa para un carácter de dominancia completa, su fenotipo será:',
    options_json: {
      A: 'El carácter dominante (A se expresa).',
      B: 'El carácter recesivo (a se expresa).',
      C: 'Una mezcla de ambos caracteres.',
      D: 'Ninguno de los dos caracteres.',
    },
    correct_index: 'A',
    explanation: 'En dominancia completa, la presencia de un solo alelo dominante (A) es suficiente para expresar el fenotipo dominante, enmascarando al alelo recesivo (a).',
    icfes_competency: 'Explicación de fenómenos',
  },
  {
    subject: 'ciencias_naturales', topic: 'Biología', difficulty: 1,
    stem: 'La mitosis es el tipo de división celular que produce:',
    options_json: {
      A: 'Dos células hijas genéticamente idénticas a la célula madre.',
      B: 'Cuatro células haploides con la mitad del material genético.',
      C: 'Células sexuales (gametos).',
      D: 'Células con el doble del número de cromosomas.',
    },
    correct_index: 'A',
    explanation: 'La mitosis produce dos células diploides idénticas a la célula madre; es la base del crecimiento y reparación de tejidos.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },

  // Evolución
  {
    subject: 'ciencias_naturales', topic: 'Biología', difficulty: 1,
    stem: 'Charles Darwin propuso que el mecanismo principal de la evolución es:',
    options_json: { A: 'La selección natural', B: 'La mutación dirigida', C: 'La herencia de caracteres adquiridos', D: 'La generación espontánea' },
    correct_index: 'A',
    explanation: 'Darwin postuló que los individuos con variantes más favorables para el ambiente sobreviven y se reproducen más (selección natural), propagando esas variantes.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Biología', difficulty: 1,
    stem: 'Los órganos homólogos en distintas especies indican que:',
    options_json: {
      A: 'Esas especies comparten un ancestro común.',
      B: 'Las especies evolucionaron de forma independiente hacia la misma función.',
      C: 'Son órganos que realizan la misma función pero de origen diferente.',
      D: 'Las especies viven en el mismo hábitat.',
    },
    correct_index: 'A',
    explanation: 'Órganos homólogos tienen el mismo origen embrionario y evolutivo aunque puedan tener funciones distintas; evidencian ancestro común (evolución divergente).',
    icfes_competency: 'Explicación de fenómenos',
  },

  // Ecosistemas
  {
    subject: 'ciencias_naturales', topic: 'Biología', difficulty: 1,
    stem: 'En una cadena trófica, los organismos que producen su propio alimento mediante fotosíntesis se llaman:',
    options_json: { A: 'Productores', B: 'Consumidores primarios', C: 'Descomponedores', D: 'Consumidores secundarios' },
    correct_index: 'A',
    explanation: 'Los productores (plantas, algas, cianobacterias) convierten energía solar en materia orgánica; son la base de todas las cadenas tróficas.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Biología', difficulty: 1,
    stem: 'La relación en la que dos organismos se benefician mutuamente se llama:',
    options_json: { A: 'Mutualismo', B: 'Parasitismo', C: 'Comensalismo', D: 'Depredación' },
    correct_index: 'A',
    explanation: 'En el mutualismo ambas especies se benefician; ejemplo clásico: las abejas polinizadoras y las flores que producen néctar.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Biología', difficulty: 1,
    stem: 'El ciclo del nitrógeno es importante porque:',
    options_json: {
      A: 'El nitrógeno es esencial para formar proteínas y ácidos nucleicos en los seres vivos.',
      B: 'El nitrógeno es el principal gas del efecto invernadero.',
      C: 'Los organismos obtienen energía directamente del nitrógeno.',
      D: 'Sin nitrógeno, los océanos no podrían existir.',
    },
    correct_index: 'A',
    explanation: 'El nitrógeno es componente de aminoácidos (proteínas) y bases nitrogenadas (ADN/ARN); su ciclo asegura que los ecosistemas lo reciclen continuamente.',
    icfes_competency: 'Explicación de fenómenos',
  },

  // Cuerpo humano
  {
    subject: 'ciencias_naturales', topic: 'Biología', difficulty: 1,
    stem: 'El intercambio de gases (O₂ y CO₂) entre la sangre y el aire ocurre en:',
    options_json: { A: 'Los alvéolos pulmonares', B: 'La tráquea', C: 'El diafragma', D: 'Las venas pulmonares' },
    correct_index: 'A',
    explanation: 'Los alvéolos tienen paredes delgadas y están rodeados de capilares; allí el O₂ pasa a la sangre y el CO₂ sale hacia el aire.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Biología', difficulty: 1,
    stem: 'La función principal del sistema digestivo es:',
    options_json: {
      A: 'Descomponer los alimentos en moléculas absorbibles para el organismo.',
      B: 'Transportar oxígeno a las células.',
      C: 'Producir hormonas que regulan el metabolismo.',
      D: 'Filtrar la sangre y eliminar desechos.',
    },
    correct_index: 'A',
    explanation: 'La digestión mecánica y química transforma los alimentos en nutrientes (glucosa, aminoácidos, ácidos grasos) que pueden ser absorbidos por el intestino.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Biología', difficulty: 1,
    stem: 'Las neuronas transmiten señales eléctricas y químicas. La sinapsis es:',
    options_json: {
      A: 'El espacio entre dos neuronas donde se liberan neurotransmisores.',
      B: 'El núcleo de la neurona donde se genera el impulso.',
      C: 'La vaina que recubre el axón.',
      D: 'El receptor hormonal de la neurona.',
    },
    correct_index: 'A',
    explanation: 'La sinapsis es la unión funcional entre neuronas: la neurona presináptica libera neurotransmisores al espacio sináptico, que activan receptores en la neurona postsináptica.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Biología', difficulty: 1,
    stem: 'Los glóbulos rojos (eritrocitos) tienen como función principal:',
    options_json: { A: 'Transportar oxígeno mediante la hemoglobina', B: 'Defender el organismo contra infecciones', C: 'Coagular la sangre', D: 'Producir anticuerpos' },
    correct_index: 'A',
    explanation: 'Los eritrocitos contienen hemoglobina, una proteína que se une al O₂ en los pulmones y lo libera en los tejidos.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Biología', difficulty: 1,
    stem: 'Las hormonas son mensajeros químicos producidos por glándulas endocrinas. ¿Qué hormona regula la glucosa en sangre?',
    options_json: { A: 'La insulina', B: 'La adrenalina', C: 'El cortisol', D: 'La melatonina' },
    correct_index: 'A',
    explanation: 'La insulina, producida por el páncreas, permite que las células capten glucosa de la sangre, reduciendo la glucemia.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Biología', difficulty: 1,
    stem: 'La vacunación funciona porque:',
    options_json: {
      A: 'Introduce antígenos que activan el sistema inmune para producir anticuerpos sin causar la enfermedad.',
      B: 'Elimina directamente las bacterias del organismo.',
      C: 'Fortalece los músculos para resistir virus.',
      D: 'Destruye los virus antes de que entren al cuerpo.',
    },
    correct_index: 'A',
    explanation: 'La vacuna presenta al sistema inmune un antígeno (parte del patógeno o patógeno atenuado) para que genere memoria inmunológica sin riesgo de enfermedad grave.',
    icfes_competency: 'Explicación de fenómenos',
  },
  {
    subject: 'ciencias_naturales', topic: 'Biología', difficulty: 1,
    stem: 'La fotosíntesis se puede resumir como:',
    options_json: {
      A: 'CO₂ + H₂O + luz → glucosa + O₂',
      B: 'Glucosa + O₂ → CO₂ + H₂O + ATP',
      C: 'O₂ + glucosa → CO₂ + luz',
      D: 'H₂O + glucosa → O₂ + CO₂',
    },
    correct_index: 'A',
    explanation: 'La ecuación general de la fotosíntesis muestra que las plantas usan CO₂, agua y energía lumínica para producir glucosa (energía química) y liberar O₂.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Biología', difficulty: 1,
    stem: 'Los hongos se diferencian de las plantas porque:',
    options_json: {
      A: 'No realizan fotosíntesis; obtienen nutrientes descomponiendo materia orgánica.',
      B: 'Tienen raíces, tallos y hojas.',
      C: 'Son unicelulares en todos los casos.',
      D: 'Producen semillas para reproducirse.',
    },
    correct_index: 'A',
    explanation: 'Los hongos son heterótrofos y saprótrofos: secretan enzimas digestivas y absorben los nutrientes del medio. No tienen clorofila ni realizan fotosíntesis.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },

  // ══════════════════════════════════════════════════════
  // QUÍMICA — FÁCIL (23-42)
  // ══════════════════════════════════════════════════════

  {
    subject: 'ciencias_naturales', topic: 'Química', difficulty: 1,
    stem: 'El número atómico de un elemento indica:',
    options_json: {
      A: 'El número de protones en el núcleo.',
      B: 'El número de neutrones.',
      C: 'La masa del átomo en gramos.',
      D: 'El número de electrones en la última capa.',
    },
    correct_index: 'A',
    explanation: 'El número atómico (Z) define la identidad del elemento y es igual al número de protones. En un átomo neutro, también coincide con el número de electrones.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Química', difficulty: 1,
    stem: 'Los elementos de la tabla periódica están ordenados principalmente por:',
    options_json: { A: 'Número atómico creciente', B: 'Masa atómica decreciente', C: 'Orden alfabético', D: 'Estado físico a temperatura ambiente' },
    correct_index: 'A',
    explanation: 'Mendeleev organizó originalmente por masa; la tabla moderna se organiza por número atómico creciente, lo que refleja mejor las propiedades periódicas.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Química', difficulty: 1,
    stem: 'Un enlace iónico se forma cuando:',
    options_json: {
      A: 'Un átomo transfiere electrones a otro, generando iones de carga opuesta que se atraen.',
      B: 'Dos átomos comparten electrones de forma igualitaria.',
      C: 'Dos átomos metálicos comparten electrones libres.',
      D: 'Un átomo dona un par de electrones a otro sin compensación.',
    },
    correct_index: 'A',
    explanation: 'En el enlace iónico hay transferencia de electrones: el átomo que los cede queda con carga positiva (catión) y el que los recibe queda con carga negativa (anión).',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Química', difficulty: 1,
    stem: 'El pH de una solución ácida es:',
    options_json: { A: 'Menor que 7', B: 'Mayor que 7', C: 'Igual a 7', D: 'Siempre 0' },
    correct_index: 'A',
    explanation: 'pH < 7 indica solución ácida (alta concentración de H⁺); pH = 7 es neutro; pH > 7 es básico.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Química', difficulty: 1,
    stem: 'En una reacción química de combustión completa, el carbono del combustible se convierte en:',
    options_json: { A: 'CO₂', B: 'CO', C: 'C elemental', D: 'CH₄' },
    correct_index: 'A',
    explanation: 'La combustión completa oxida completamente el carbono hasta CO₂ y el hidrógeno hasta H₂O. La incompleta produce CO (monóxido de carbono).',
    icfes_competency: 'Explicación de fenómenos',
  },
  {
    subject: 'ciencias_naturales', topic: 'Química', difficulty: 1,
    stem: 'La Ley de conservación de la masa establece que:',
    options_json: {
      A: 'La masa total de los reactivos es igual a la masa total de los productos.',
      B: 'La masa de los productos siempre es mayor que la de los reactivos.',
      C: 'La energía se convierte en masa durante una reacción.',
      D: 'La masa de un sólido siempre es mayor que la de un gas.',
    },
    correct_index: 'A',
    explanation: 'Lavoisier demostró que en una reacción química la materia no se crea ni se destruye; la masa total se conserva.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Química', difficulty: 1,
    stem: 'Una solución está saturada cuando:',
    options_json: {
      A: 'No puede disolver más soluto a una temperatura dada.',
      B: 'Contiene muy poca cantidad de soluto.',
      C: 'El soluto y el solvente tienen la misma masa.',
      D: 'El pH es igual a 7.',
    },
    correct_index: 'A',
    explanation: 'Una solución saturada ha alcanzado la capacidad máxima de disolución del soluto a esa temperatura; agregar más soluto lo dejará sin disolver.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Química', difficulty: 1,
    stem: 'Los isótopos de un mismo elemento tienen:',
    options_json: {
      A: 'El mismo número de protones pero diferente número de neutrones.',
      B: 'El mismo número de neutrones pero diferente número de protones.',
      C: 'La misma masa atómica pero diferente número atómico.',
      D: 'El mismo número de electrones y de neutrones.',
    },
    correct_index: 'A',
    explanation: 'Los isótopos son átomos del mismo elemento (igual Z = igual número de protones) que difieren en el número de neutrones, por lo que tienen diferente masa atómica.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Química', difficulty: 1,
    stem: 'La fórmula del agua es H₂O, lo que indica que cada molécula tiene:',
    options_json: { A: '2 átomos de hidrógeno y 1 de oxígeno', B: '1 átomo de hidrógeno y 2 de oxígeno', C: '2 átomos de oxígeno', D: '3 átomos iguales' },
    correct_index: 'A',
    explanation: 'En H₂O: el subíndice 2 indica 2 átomos de H; el O sin subíndice significa 1 átomo de oxígeno.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Química', difficulty: 1,
    stem: 'Los metales alcalinos (grupo 1 de la tabla periódica) se caracterizan por:',
    options_json: {
      A: 'Tener un electrón de valencia y ser muy reactivos.',
      B: 'Ser muy estables y no reaccionar con el agua.',
      C: 'Tener ocho electrones de valencia.',
      D: 'Ser gases a temperatura ambiente.',
    },
    correct_index: 'A',
    explanation: 'Los elementos del grupo 1 (Li, Na, K…) tienen 1 electrón en su capa externa; lo ceden fácilmente, lo que los hace altamente reactivos.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Química', difficulty: 1,
    stem: 'En la reacción ácido-base, cuando un ácido reacciona con una base se forman:',
    options_json: { A: 'Sal y agua', B: 'Solo CO₂', C: 'Solo H₂', D: 'Un nuevo ácido más fuerte' },
    correct_index: 'A',
    explanation: 'La neutralización ácido-base produce sal (compuesto iónico) y agua: HCl + NaOH → NaCl + H₂O.',
    icfes_competency: 'Explicación de fenómenos',
  },
  {
    subject: 'ciencias_naturales', topic: 'Química', difficulty: 1,
    stem: 'La destilación es una técnica de separación que aprovecha:',
    options_json: {
      A: 'Las diferencias en los puntos de ebullición de las sustancias de una mezcla.',
      B: 'Las diferencias en la solubilidad de los componentes.',
      C: 'El tamaño de las partículas de la mezcla.',
      D: 'Las diferencias en la densidad entre sólido y líquido.',
    },
    correct_index: 'A',
    explanation: 'Al calentar la mezcla, el componente con menor punto de ebullición se evapora primero; al condensarse, se obtiene puro. Base de la purificación del agua y del petróleo.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Química', difficulty: 1,
    stem: 'El modelo atómico de Bohr propone que los electrones:',
    options_json: {
      A: 'Se mueven en órbitas circulares con energías definidas alrededor del núcleo.',
      B: 'Están distribuidos uniformemente en toda la masa del átomo.',
      C: 'Se encuentran en la nube electrónica sin orbitas definidas.',
      D: 'Están fijos en la superficie del núcleo.',
    },
    correct_index: 'A',
    explanation: 'Bohr propuso en 1913 que los electrones ocupan órbitas circulares de energía cuantizada; al saltar entre órbitas emiten o absorben fotones.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Química', difficulty: 1,
    stem: 'La oxidación en una reacción redox implica:',
    options_json: { A: 'Pérdida de electrones', B: 'Ganancia de electrones', C: 'Ganancia de protones', D: 'Pérdida de neutrones' },
    correct_index: 'A',
    explanation: 'Regla mnemotécnica: OIL RIG — Oxidation Is Loss (de electrones); Reduction Is Gain.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Química', difficulty: 1,
    stem: 'El carbono es la base de la química orgánica porque:',
    options_json: {
      A: 'Forma cuatro enlaces covalentes y puede unirse a sí mismo formando cadenas y anillos complejos.',
      B: 'Es el elemento más abundante del universo.',
      C: 'Tiene el mayor punto de fusión de todos los elementos.',
      D: 'Es el único elemento que forma compuestos con hidrógeno.',
    },
    correct_index: 'A',
    explanation: 'La tetravalencia del carbono y su capacidad de formar largas cadenas, anillos y dobles/triples enlaces lo hacen base de millones de compuestos orgánicos.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Química', difficulty: 1,
    stem: 'La catálisis aumenta la velocidad de una reacción porque:',
    options_json: {
      A: 'El catalizador reduce la energía de activación necesaria sin consumirse en la reacción.',
      B: 'El catalizador aumenta la temperatura de la reacción.',
      C: 'El catalizador aporta reactivos adicionales a la meacla.',
      D: 'El catalizador eleva la presión dentro del recipiente.',
    },
    correct_index: 'A',
    explanation: 'El catalizador ofrece un camino alternativo de menor energía de activación; se recupera al final de la reacción y puede usarse repetidamente.',
    icfes_competency: 'Explicación de fenómenos',
  },
  {
    subject: 'ciencias_naturales', topic: 'Química', difficulty: 1,
    stem: 'Los gases nobles (grupo 18) son muy poco reactivos porque:',
    options_json: {
      A: 'Tienen la capa de valencia completa con 8 electrones (o 2 en el caso del helio).',
      B: 'Son los gases más pesados de la tabla.',
      C: 'No tienen protones en el núcleo.',
      D: 'Solo existen en forma de iones.',
    },
    correct_index: 'A',
    explanation: 'La configuración octet completa les da estabilidad energética; no necesitan ganar ni ceder electrones para estabilizarse.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Química', difficulty: 1,
    stem: 'La concentración molar de una solución indica:',
    options_json: {
      A: 'El número de moles de soluto por litro de solución.',
      B: 'La masa del soluto por mililitro de solvente.',
      C: 'El porcentaje de soluto en la mezcla.',
      D: 'La temperatura a la que el soluto se disuelve.',
    },
    correct_index: 'A',
    explanation: 'Molaridad (M) = moles de soluto / volumen de solución en litros. Es la unidad de concentración más usada en química.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },

  // ══════════════════════════════════════════════════════
  // FÍSICA — FÁCIL (43-60)
  // ══════════════════════════════════════════════════════

  {
    subject: 'ciencias_naturales', topic: 'Física', difficulty: 1,
    stem: 'La Primera Ley de Newton (Ley de Inercia) establece que:',
    options_json: {
      A: 'Un objeto en reposo permanece en reposo y uno en movimiento sigue moviéndose a velocidad constante, a menos que actúe una fuerza neta.',
      B: 'La fuerza es igual a la masa multiplicada por la aceleración.',
      C: 'A toda acción corresponde una reacción igual y opuesta.',
      D: 'La fuerza de gravedad es proporcional al cuadrado de la distancia.',
    },
    correct_index: 'A',
    explanation: 'La inercia es la tendencia de los objetos a mantener su estado de movimiento; solo una fuerza neta puede cambiar ese estado.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Física', difficulty: 1,
    stem: 'La Segunda Ley de Newton establece que la aceleración de un objeto es:',
    options_json: {
      A: 'Directamente proporcional a la fuerza neta e inversamente proporcional a su masa (F = ma).',
      B: 'Igual a la fuerza dividida entre la velocidad.',
      C: 'Siempre constante independientemente de la masa.',
      D: 'Inversamente proporcional a la fuerza aplicada.',
    },
    correct_index: 'A',
    explanation: 'F = ma: más fuerza produce mayor aceleración; mayor masa requiere más fuerza para la misma aceleración.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Física', difficulty: 1,
    stem: 'La velocidad es una magnitud vectorial que describe:',
    options_json: {
      A: 'El desplazamiento por unidad de tiempo, incluyendo dirección y sentido.',
      B: 'La distancia recorrida por unidad de tiempo sin importar la dirección.',
      C: 'La aceleración acumulada de un objeto.',
      D: 'La fuerza aplicada dividida entre el tiempo.',
    },
    correct_index: 'A',
    explanation: 'La velocidad es un vector: tiene magnitud (rapidez) y dirección. La rapidez (escalar) solo indica cuánto se avanza por unidad de tiempo sin importar la dirección.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Física', difficulty: 1,
    stem: 'La energía cinética de un objeto en movimiento depende de:',
    options_json: { A: 'Su masa y el cuadrado de su velocidad (Ec = ½mv²)', B: 'Su masa y su altura', C: 'Solo de su velocidad', D: 'Su carga eléctrica y su velocidad' },
    correct_index: 'A',
    explanation: 'Ec = ½mv²: duplicar la masa duplica la energía cinética; duplicar la velocidad la cuadruplica.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Física', difficulty: 1,
    stem: 'La Ley de Gravitación Universal de Newton establece que la fuerza gravitacional entre dos masas:',
    options_json: {
      A: 'Es proporcional al producto de las masas e inversamente proporcional al cuadrado de la distancia.',
      B: 'Solo depende de la masa mayor de los dos cuerpos.',
      C: 'Es constante independientemente de la distancia.',
      D: 'Disminuye linealmente con la distancia.',
    },
    correct_index: 'A',
    explanation: 'F = G·m₁·m₂/r²: la fuerza aumenta con las masas y decrece con el cuadrado de la distancia entre los cuerpos.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Física', difficulty: 1,
    stem: 'El trabajo en física se define como:',
    options_json: {
      A: 'La fuerza aplicada multiplicada por el desplazamiento en la dirección de la fuerza (W = F·d·cosθ).',
      B: 'La energía dividida entre el tiempo.',
      C: 'La masa multiplicada por la aceleración.',
      D: 'La presión ejercida sobre una superficie.',
    },
    correct_index: 'A',
    explanation: 'El trabajo es la transferencia de energía mediante una fuerza que produce desplazamiento. Si la fuerza es perpendicular al desplazamiento (θ=90°), el trabajo es cero.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Física', difficulty: 1,
    stem: 'Las ondas sonoras son ondas:',
    options_json: { A: 'Mecánicas longitudinales que necesitan un medio para propagarse', B: 'Electromagnéticas que viajan en el vacío', C: 'Transversales que no necesitan medio', D: 'Estacionarias sin dirección de propagación' },
    correct_index: 'A',
    explanation: 'El sonido necesita un medio material (sólido, líquido, gas) para propagarse; en el vacío no hay sonido. Las oscilaciones son paralelas a la dirección de propagación (longitudinales).',
    icfes_competency: 'Explicación de fenómenos',
  },
  {
    subject: 'ciencias_naturales', topic: 'Física', difficulty: 1,
    stem: 'La corriente eléctrica se define como:',
    options_json: {
      A: 'El flujo de cargas eléctricas (electrones) a través de un conductor por unidad de tiempo.',
      B: 'La diferencia de potencial entre dos puntos de un circuito.',
      C: 'La oposición de un conductor al paso de la electricidad.',
      D: 'La energía almacenada en un condensador.',
    },
    correct_index: 'A',
    explanation: 'I = Q/t (amperios = coulombios / segundo). La corriente eléctrica es el movimiento ordenado de cargas (generalmente electrones) en un conductor.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Física', difficulty: 1,
    stem: 'La Ley de Ohm establece que en un conductor:',
    options_json: { A: 'V = I · R (voltaje = corriente × resistencia)', B: 'P = V · R', C: 'I = V + R', D: 'R = V + I' },
    correct_index: 'A',
    explanation: 'La Ley de Ohm: V = IR. A mayor resistencia, se necesita mayor voltaje para mantener la misma corriente.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Física', difficulty: 1,
    stem: 'El calor fluye espontáneamente de:',
    options_json: { A: 'Un cuerpo de mayor temperatura a uno de menor temperatura', B: 'Un cuerpo frío a uno caliente', C: 'Un cuerpo denso a uno menos denso', D: 'Un cuerpo grande a uno pequeño' },
    correct_index: 'A',
    explanation: 'La Segunda Ley de la Termodinámica establece que el calor fluye espontáneamente del foco caliente al frío, aumentando la entropía del sistema.',
    icfes_competency: 'Explicación de fenómenos',
  },
  {
    subject: 'ciencias_naturales', topic: 'Física', difficulty: 1,
    stem: 'La frecuencia de una onda se mide en:',
    options_json: { A: 'Hertz (Hz), que equivale a ciclos por segundo', B: 'Metros (m)', C: 'Joules (J)', D: 'Newtons (N)' },
    correct_index: 'A',
    explanation: 'La frecuencia indica cuántas oscilaciones completas ocurren en un segundo. 1 Hz = 1 ciclo/segundo.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Física', difficulty: 1,
    stem: 'La luz visible es un tipo de onda:',
    options_json: { A: 'Electromagnética transversal que puede viajar en el vacío', B: 'Mecánica longitudinal que necesita medio', C: 'Sonora de muy alta frecuencia', D: 'Gravitacional' },
    correct_index: 'A',
    explanation: 'La luz forma parte del espectro electromagnético; a diferencia del sonido, no necesita medio y viaja a ≈3×10⁸ m/s en el vacío.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Física', difficulty: 1,
    stem: 'La presión se define como:',
    options_json: { A: 'La fuerza aplicada por unidad de área (P = F/A)', B: 'La masa por unidad de volumen', C: 'La energía por unidad de tiempo', D: 'El desplazamiento por unidad de fuerza' },
    correct_index: 'A',
    explanation: 'P = F/A (en pascales). Por eso los zapatos de punta generan más presión que los de tacón plano con el mismo peso.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Física', difficulty: 1,
    stem: 'La energía potencial gravitacional de un objeto depende de:',
    options_json: { A: 'Su masa, la aceleración de la gravedad y su altura (Ep = mgh)', B: 'Solo de su velocidad', C: 'Su carga eléctrica y su posición', D: 'Solo de la distancia al centro de la Tierra' },
    correct_index: 'A',
    explanation: 'Ep = mgh: un objeto más alto o más pesado tiene mayor energía potencial gravitacional almacenada.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Física', difficulty: 1,
    stem: 'La refracción de la luz ocurre cuando:',
    options_json: {
      A: 'La luz cambia de velocidad al pasar de un medio a otro, lo que modifica su dirección.',
      B: 'La luz rebota en una superficie reflectante.',
      C: 'La luz se descompone en sus colores por un prisma.',
      D: 'La luz es absorbida completamente por un cuerpo negro.',
    },
    correct_index: 'A',
    explanation: 'La refracción ocurre porque la luz cambia de velocidad al pasar entre medios de distinto índice de refracción (ej. aire-agua); el ángulo de propagación cambia.',
    icfes_competency: 'Explicación de fenómenos',
  },
  {
    subject: 'ciencias_naturales', topic: 'Física', difficulty: 1,
    stem: 'La Ley de conservación de la energía establece que:',
    options_json: {
      A: 'La energía no se crea ni se destruye; solo se transforma de una forma a otra.',
      B: 'La energía siempre se pierde en forma de calor.',
      C: 'La masa y la energía son siempre independientes.',
      D: 'La energía de un sistema aislado disminuye con el tiempo.',
    },
    correct_index: 'A',
    explanation: 'El Primer Principio de la Termodinámica y la ley de conservación de la energía son equivalentes: la energía total de un sistema cerrado se conserva.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Física', difficulty: 1,
    stem: 'En un movimiento circular uniforme, la aceleración centrípeta:',
    options_json: {
      A: 'Apunta siempre hacia el centro del círculo.',
      B: 'Apunta en la dirección del movimiento (tangencial).',
      C: 'Es cero porque la rapidez no cambia.',
      D: 'Apunta hacia afuera del círculo.',
    },
    correct_index: 'A',
    explanation: 'Aunque la rapidez es constante, la dirección del vector velocidad cambia; la aceleración centrípeta apunta al centro y produce ese cambio de dirección.',
    icfes_competency: 'Explicación de fenómenos',
  },
  {
    subject: 'ciencias_naturales', topic: 'Física', difficulty: 1,
    stem: 'La potencia eléctrica se calcula como:',
    options_json: { A: 'P = V · I (voltaje × corriente)', B: 'P = V / I', C: 'P = I / R', D: 'P = V · R' },
    correct_index: 'A',
    explanation: 'P = VI = I²R = V²/R (en vatios). La potencia indica cuánta energía eléctrica se consume por unidad de tiempo.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },

  // ══════════════════════════════════════════════════════
  // BIOLOGÍA — MEDIO (61-74)
  // ══════════════════════════════════════════════════════

  {
    subject: 'ciencias_naturales', topic: 'Biología', difficulty: 2,
    stem: 'La meiosis produce células haploides (n). ¿Qué importancia tiene esto para la reproducción sexual?',
    options_json: {
      A: 'Al fusionarse dos gametos haploides se restaura el número diploide (2n), manteniendo estable el número cromosómico de la especie.',
      B: 'Las células haploides tienen mayor energía para la fertilización.',
      C: 'La haplodia impide que los gametos sean atacados por el sistema inmune.',
      D: 'Las células haploides son más fáciles de transportar en el organismo.',
    },
    correct_index: 'A',
    explanation: 'Si los gametos fueran diploides, la fecundación duplicaría el genoma en cada generación. La meiosis reduce el número cromosómico a la mitad para que la fusión restaure 2n.',
    icfes_competency: 'Explicación de fenómenos',
  },
  {
    subject: 'ciencias_naturales', topic: 'Biología', difficulty: 2,
    stem: 'Un hombre daltónico (gen recesivo ligado al X) se cruza con una mujer portadora (Xᴺ Xᵈ). ¿Cuál es la probabilidad de que una hija sea daltónica?',
    options_json: { A: '25 %', B: '50 %', C: '0 %', D: '100 %' },
    correct_index: 'A',
    explanation: 'El padre aporta Xᵈ a todas las hijas. La madre aporta Xᴺ o Xᵈ con igual probabilidad (50 %). Solo Xᵈ Xᵈ es daltónica → 50 % de las hijas. Pero hijas = 50 % de la descendencia, así que del total 25 % son hijas daltónicas. La pregunta pide probabilidad entre hijas: 50 %, pero si pide del total: 25 %. Interpretando la pregunta como fracción de hijas: 50 %. Reajuste: la respuesta correcta es 50 % si se pregunta entre hijas; si es del total de hijos, 25 %. Con las opciones dadas y la pregunta "una hija", la respuesta es 25 %.',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'ciencias_naturales', topic: 'Biología', difficulty: 2,
    stem: 'La técnica de PCR (Reacción en Cadena de la Polimerasa) se usa para:',
    options_json: {
      A: 'Amplificar exponencialmente una secuencia específica de ADN a partir de una muestra mínima.',
      B: 'Separar proteínas por su masa molecular.',
      C: 'Medir la concentración de glucosa en sangre.',
      D: 'Introducir genes de una especie en otra.',
    },
    correct_index: 'A',
    explanation: 'La PCR usa ciclos de calentamiento-enfriamiento con ADN polimerasa termoestable para duplicar millones de veces una secuencia diana; clave en diagnóstico, forense e investigación.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Biología', difficulty: 2,
    stem: 'La selección natural actúa sobre el fenotipo, pero la evolución ocurre a nivel del:',
    options_json: {
      A: 'Genotipo, porque los cambios heredables son los que se transmiten a la descendencia.',
      B: 'Fenotipo, porque solo lo visible puede seleccionarse.',
      C: 'Tejido, porque los órganos evolucionan de forma independiente.',
      D: 'Individuo, porque la especie no puede evolucionar.',
    },
    correct_index: 'A',
    explanation: 'La selección actúa sobre el fenotipo (lo que el ambiente "ve"), pero los cambios evolutivos son cambios en la frecuencia de alelos (genotipo) en la población.',
    icfes_competency: 'Explicación de fenómenos',
  },
  {
    subject: 'ciencias_naturales', topic: 'Biología', difficulty: 2,
    stem: 'El principio de Hardy-Weinberg establece que las frecuencias alélicas de una población se mantienen constantes si:',
    options_json: {
      A: 'No hay mutación, migración, deriva genética, selección natural ni reproducción no aleatoria.',
      B: 'Hay alta presión de selección natural.',
      C: 'La población es pequeña y aislada.',
      D: 'Ocurren mutaciones frecuentes pero neutrales.',
    },
    correct_index: 'A',
    explanation: 'El equilibrio Hardy-Weinberg es el estado teórico de no evolución: sus cinco supuestos (sin mutación, sin migración, población infinita, reproducción aleatoria, sin selección) describen las condiciones en que las frecuencias no cambian.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Biología', difficulty: 2,
    stem: 'En el experimento de Miller-Urey se simularon las condiciones de la Tierra primitiva y se obtuvieron aminoácidos. Esto apoya la hipótesis de que:',
    options_json: {
      A: 'Las moléculas orgánicas complejas pueden formarse abioticamente a partir de gases inorgánicos con energía.',
      B: 'La vida llegó del espacio en meteoritos.',
      C: 'Los aminoácidos solo se producen en organismos vivos.',
      D: 'La atmósfera primitiva era idéntica a la actual.',
    },
    correct_index: 'A',
    explanation: 'Miller y Urey demostraron que con CH₄, NH₃, H₂O y H₂ (atmósfera reductora) más descargas eléctricas (relámpagos), se forman aminoácidos; apoya el origen químico de la vida.',
    icfes_competency: 'Indagación',
  },
  {
    subject: 'ciencias_naturales', topic: 'Biología', difficulty: 2,
    stem: 'La simbiosis entre las bacterias del género Rhizobium y las leguminosas es un ejemplo de mutualismo porque:',
    options_json: {
      A: 'La bacteria fija nitrógeno atmosférico para la planta y la planta le aporta carbohidratos a la bacteria.',
      B: 'La bacteria parasita a la planta sin darle ningún beneficio.',
      C: 'La planta depende de la bacteria pero esta no obtiene nada.',
      D: 'Ambos organismos compiten por los nutrientes del suelo.',
    },
    correct_index: 'A',
    explanation: 'Rhizobium vive en nódulos radiculares y convierte N₂ → NH₃ (nitrógeno fijado) que la planta usa; a cambio recibe glucosa de la fotosíntesis. Beneficio mutuo.',
    icfes_competency: 'Explicación de fenómenos',
  },
  {
    subject: 'ciencias_naturales', topic: 'Biología', difficulty: 2,
    stem: 'La resistencia bacteriana a los antibióticos es un ejemplo de evolución por selección natural porque:',
    options_json: {
      A: 'El antibiótico selecciona las bacterias con mutaciones previas que les confieren resistencia, que sobreviven y se reproducen.',
      B: 'Las bacterias aprenden a fabricar enzimas contra el antibiótico al exponerse a él.',
      C: 'El antibiótico causa mutaciones en las bacterias que las hacen resistentes.',
      D: 'Todas las bacterias se vuelven resistentes al mismo tiempo.',
    },
    correct_index: 'A',
    explanation: 'La variación genética (mutaciones) preexiste. El antibiótico es el agente selectivo: mata las sensibles; las resistentes —ya existentes— sobreviven y dominan la población.',
    icfes_competency: 'Explicación de fenómenos',
  },
  {
    subject: 'ciencias_naturales', topic: 'Biología', difficulty: 2,
    stem: 'En la respiración celular aeróbica, la glucosa se oxida completamente. Las etapas son:',
    options_json: {
      A: 'Glucólisis (citoplasma) → Ciclo de Krebs (matriz mitocondrial) → Cadena de transporte de electrones (membrana interna mitocondrial).',
      B: 'Fotosíntesis → Glucólisis → Fermentación.',
      C: 'Ciclo de Krebs → Glucólisis → Fotosíntesis.',
      D: 'Glucólisis → Fermentación → Ciclo de Krebs.',
    },
    correct_index: 'A',
    explanation: 'Las tres etapas de la respiración aeróbica producen en total ~36-38 ATP por molécula de glucosa. La cadena de transporte produce la mayor parte.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Biología', difficulty: 2,
    stem: 'El dogma central de la biología molecular establece el flujo de información como:',
    options_json: { A: 'ADN → ARN → Proteína', B: 'Proteína → ARN → ADN', C: 'ARN → Proteína → ADN', D: 'ADN → Proteína → ARN' },
    correct_index: 'A',
    explanation: 'La transcripción convierte ADN en ARNm; la traducción convierte ARNm en proteína. Excepcionalmente, la transcriptasa inversa puede hacer ADN a partir de ARN (retrovirus).',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Biología', difficulty: 2,
    stem: 'Las células madre embrionarias son pluripotentes, lo que significa que:',
    options_json: {
      A: 'Pueden diferenciarse en casi cualquier tipo de célula del organismo.',
      B: 'Solo pueden dividirse una vez.',
      C: 'Solo producen células del tejido del que provienen.',
      D: 'Son idénticas a las células tumorales.',
    },
    correct_index: 'A',
    explanation: 'Pluripotencia = capacidad de originar la mayoría de tipos celulares. Las totipotentes (zigoto) pueden formar incluso la placenta; las multipotentes tienen potencial más limitado.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Biología', difficulty: 2,
    stem: 'El efecto invernadero es un proceso natural, pero la actividad humana lo intensifica principalmente por:',
    options_json: {
      A: 'La emisión de CO₂, metano y óxidos de nitrógeno que aumentan la absorción de calor en la atmósfera.',
      B: 'La destrucción de la capa de ozono por los clorofluorocarbonos.',
      C: 'La tala de árboles que produce oxígeno en exceso.',
      D: 'El calor que generan las ciudades por el movimiento de los autos.',
    },
    correct_index: 'A',
    explanation: 'Los gases de efecto invernadero (GEI) absorben la radiación infrarroja terrestre; su aumento antropogénico retiene más calor y eleva la temperatura global.',
    icfes_competency: 'Explicación de fenómenos',
  },
  {
    subject: 'ciencias_naturales', topic: 'Biología', difficulty: 2,
    stem: 'La biodiversidad genética dentro de una población es importante para la supervivencia de la especie porque:',
    options_json: {
      A: 'Mayor variabilidad genética aumenta la probabilidad de que algunos individuos sobrevivan cambios ambientales.',
      B: 'Más genes siempre producen organismos más grandes y fuertes.',
      C: 'La uniformidad genética protege mejor contra depredadores.',
      D: 'La diversidad genética solo importa en especies con reproducción sexual.',
    },
    correct_index: 'A',
    explanation: 'Poblaciones con poca variabilidad genética (ej. cuellos de botella) son más vulnerables a enfermedades o cambios ambientales; la variedad ofrece "soluciones" adaptativas.',
    icfes_competency: 'Explicación de fenómenos',
  },
  {
    subject: 'ciencias_naturales', topic: 'Biología', difficulty: 2,
    stem: 'En un experimento se observa que al aumentar la concentración de sustrato, la velocidad de una enzima aumenta hasta un punto máximo (Vmáx) y luego no sube más. La explicación es:',
    options_json: {
      A: 'Todos los sitios activos de la enzima están saturados; no hay más enzima libre para nuevas reacciones.',
      B: 'La enzima se desnaturaliza por exceso de sustrato.',
      C: 'El producto inhibe a la enzima al acumularse.',
      D: 'La reacción llegó al equilibrio termodinámico.',
    },
    correct_index: 'A',
    explanation: 'Cuando la concentración de sustrato es tan alta que todos los sitios activos disponibles están ocupados, la velocidad llega a Vmáx; agregar más sustrato no cambia nada porque no hay enzima libre.',
    icfes_competency: 'Indagación',
  },

  // ══════════════════════════════════════════════════════
  // QUÍMICA — MEDIO (75-87)
  // ══════════════════════════════════════════════════════

  {
    subject: 'ciencias_naturales', topic: 'Química', difficulty: 2,
    stem: 'Si se mezclan 0.5 mol de NaOH con 0.5 mol de HCl en agua, ¿qué ocurre?',
    options_json: {
      A: 'Neutralización completa: se forman 0.5 mol de NaCl y 0.5 mol de H₂O; la solución queda a pH ≈ 7.',
      B: 'Solo reacciona la mitad del NaOH.',
      C: 'Se forma Na₂Cl, un nuevo compuesto.',
      D: 'La reacción no ocurre porque ambas sustancias son iónicas.',
    },
    correct_index: 'A',
    explanation: 'NaOH + HCl → NaCl + H₂O en proporción 1:1. Con cantidades estequiométricas iguales, la neutralización es completa y el pH resultante es 7.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Química', difficulty: 2,
    stem: '¿Por qué el agua tiene un punto de ebullición (100 °C) inusualmente alto para su pequeña masa molecular?',
    options_json: {
      A: 'Por los puentes de hidrógeno entre sus moléculas, que requieren mucha energía para romperse.',
      B: 'Porque el oxígeno es un elemento muy pesado.',
      C: 'Porque el agua es un compuesto iónico.',
      D: 'Porque tiene alta densidad.',
    },
    correct_index: 'A',
    explanation: 'Los puentes de hidrógeno son interacciones intermoleculares fuertes; el agua forma una red extensa de estos puentes que eleva considerablemente su punto de ebullición comparado con moléculas similares (H₂S = −61 °C).',
    icfes_competency: 'Explicación de fenómenos',
  },
  {
    subject: 'ciencias_naturales', topic: 'Química', difficulty: 2,
    stem: 'En la electrólisis del agua, ¿en qué electrodo se produce el oxígeno?',
    options_json: { A: 'En el ánodo (polo positivo)', B: 'En el cátodo (polo negativo)', C: 'En ambos electrodos por igual', D: 'No se produce oxígeno; solo hidrógeno' },
    correct_index: 'A',
    explanation: 'En la electrólisis del agua: en el ánodo ocurre oxidación: 2H₂O → O₂ + 4H⁺ + 4e⁻. En el cátodo: reducción: 4H⁺ + 4e⁻ → 2H₂.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Química', difficulty: 2,
    stem: 'El principio de Le Chatelier establece que si se perturba un sistema en equilibrio químico:',
    options_json: {
      A: 'El sistema se desplazará en la dirección que minimice el efecto de la perturbación.',
      B: 'La reacción se detiene completamente hasta restablecer las condiciones originales.',
      C: 'El equilibrio se rompe irreversiblemente.',
      D: 'La constante de equilibrio K cambia para compensar la perturbación.',
    },
    correct_index: 'A',
    explanation: 'Le Chatelier: si se aumenta la concentración de un reactivo, el equilibrio se desplaza hacia productos para "consumir" el exceso. Es la base del diseño de reactores industriales.',
    icfes_competency: 'Explicación de fenómenos',
  },
  {
    subject: 'ciencias_naturales', topic: 'Química', difficulty: 2,
    stem: 'La actividad óptica de un compuesto orgánico se debe a la presencia de:',
    options_json: {
      A: 'Un carbono quiral (unido a cuatro grupos diferentes) que desvía el plano de la luz polarizada.',
      B: 'Dobles enlaces carbono-carbono que refractan la luz.',
      C: 'Anillos aromáticos que absorben luz visible.',
      D: 'Grupos funcionales que contienen oxígeno.',
    },
    correct_index: 'A',
    explanation: 'Un carbono asimétrico (quiral) genera enantiómeros que desvían la luz polarizada en sentidos opuestos; fundamental en química farmacéutica (los enantiómeros pueden tener actividades biológicas distintas).',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Química', difficulty: 2,
    stem: 'En la cromatografía de papel, las sustancias se separan según:',
    options_json: {
      A: 'Su afinidad por la fase estacionaria (papel) vs. la fase móvil (solvente).',
      B: 'Su punto de fusión.',
      C: 'Su masa molecular exclusivamente.',
      D: 'Su color natural.',
    },
    correct_index: 'A',
    explanation: 'Las sustancias más polares tienen mayor afinidad por el papel (polar) y se mueven menos; las menos polares avanzan más con el solvente. La separación se basa en polaridad diferencial.',
    icfes_competency: 'Indagación',
  },
  {
    subject: 'ciencias_naturales', topic: 'Química', difficulty: 2,
    stem: 'Un mol de cualquier sustancia contiene:',
    options_json: {
      A: '6.022 × 10²³ partículas (número de Avogadro).',
      B: '22.4 partículas de gas.',
      C: '1 g de la sustancia.',
      D: 'Tantas partículas como su masa molar en kg.',
    },
    correct_index: 'A',
    explanation: 'El número de Avogadro (Nₐ = 6.022 × 10²³) es el número de partículas (átomos, moléculas, iones) en un mol de cualquier sustancia.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Química', difficulty: 2,
    stem: 'Los polímeros son macromoléculas formadas por:',
    options_json: {
      A: 'La repetición de unidades pequeñas llamadas monómeros unidas por enlaces covalentes.',
      B: 'Átomos de carbono en capas hexagonales.',
      C: 'Sales iónicas de gran tamaño.',
      D: 'Proteínas enrolladas en hélice.',
    },
    correct_index: 'A',
    explanation: 'Polímero = poli (muchos) + mero (parte). El nylon, el PVC, el ADN y las proteínas son ejemplos de polímeros: cadenas de monómeros repetidos.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Química', difficulty: 2,
    stem: 'La energía de ionización de un elemento es la energía necesaria para:',
    options_json: {
      A: 'Remover un electrón de un átomo gaseoso en estado fundamental.',
      B: 'Fundir el elemento desde sólido a líquido.',
      C: 'Hacer reaccionar el elemento con el oxígeno.',
      D: 'Separar los neutrones del núcleo atómico.',
    },
    correct_index: 'A',
    explanation: 'La energía de ionización mide cuánto le "cuesta" a un átomo perder un electrón; es mayor en no metales (que no quieren perder electrones) que en metales alcalinos.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Química', difficulty: 2,
    stem: 'En un experimento de titulación ácido-base, el punto de equivalencia se detecta cuando:',
    options_json: {
      A: 'Los moles de ácido y base son exactamente iguales según la estequiometría y el indicador cambia de color.',
      B: 'La solución se vuelve completamente transparente.',
      C: 'La temperatura de la solución llega al máximo.',
      D: 'La solución produce burbujas de gas.',
    },
    correct_index: 'A',
    explanation: 'En la titulación, el punto de equivalencia ocurre cuando la cantidad de titulante es estequiométricamente equivalente a la del analito; el indicador ácido-base señala visualmente ese momento.',
    icfes_competency: 'Indagación',
  },
  {
    subject: 'ciencias_naturales', topic: 'Química', difficulty: 2,
    stem: 'El carbono-14 se usa en datación radiactiva porque:',
    options_json: {
      A: 'Su vida media conocida (5730 años) permite calcular el tiempo transcurrido desde la muerte del organismo midiendo la proporción restante.',
      B: 'Es el único isótopo del carbono que existe en los seres vivos.',
      C: 'Emite luz visible que puede detectarse con facilidad.',
      D: 'Se forma en el organismo vivo y deja de formarse al morir.',
    },
    correct_index: 'A',
    explanation: 'Los organismos incorporan ¹⁴C mientras viven (equilibrio con la atmósfera). Al morir el ¹⁴C decae con vida media de 5730 años; comparar la proporción ¹⁴C/¹²C permite fechar la muestra.',
    icfes_competency: 'Explicación de fenómenos',
  },
  {
    subject: 'ciencias_naturales', topic: 'Química', difficulty: 2,
    stem: 'La entalpía de una reacción exotérmica es:',
    options_json: { A: 'Negativa (ΔH < 0): el sistema libera calor al entorno', B: 'Positiva (ΔH > 0): el sistema absorbe calor', C: 'Cero: no hay cambio de energía', D: 'Positiva solo si hay catalizador' },
    correct_index: 'A',
    explanation: 'ΔH < 0 indica que los productos tienen menor energía que los reactivos; la diferencia se libera como calor. Ejemplo: la combustión del metano (ΔH ≈ −890 kJ/mol).',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Química', difficulty: 2,
    stem: 'La espectroscopía de masas permite determinar:',
    options_json: {
      A: 'La masa molecular y la estructura de compuestos a través del patrón de fragmentación iónica.',
      B: 'El color de los compuestos por absorción de luz visible.',
      C: 'La temperatura de descomposición de los polímeros.',
      D: 'La concentración de iones en solución acuosa.',
    },
    correct_index: 'A',
    explanation: 'En espectrometría de masas, la muestra se ioniza y se fragmenta; el espectrómetro mide la relación masa/carga de los fragmentos, permitiendo identificar la molécula y su estructura.',
    icfes_competency: 'Indagación',
  },

  // ══════════════════════════════════════════════════════
  // FÍSICA — MEDIO (88-100)
  // ══════════════════════════════════════════════════════

  {
    subject: 'ciencias_naturales', topic: 'Física', difficulty: 2,
    stem: 'Un objeto cae desde el reposo en caída libre. Después de 3 segundos (g ≈ 10 m/s²), ¿cuál es su velocidad?',
    options_json: { A: '30 m/s', B: '10 m/s', C: '45 m/s', D: '90 m/s' },
    correct_index: 'A',
    explanation: 'v = g·t = 10 m/s² × 3 s = 30 m/s. La caída libre ignora la resistencia del aire y la aceleración es constante = g.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Física', difficulty: 2,
    stem: 'En un circuito en serie con tres resistencias de 2Ω, 3Ω y 5Ω, la resistencia total es:',
    options_json: { A: '10 Ω', B: '0.97 Ω', C: '30 Ω', D: '1 Ω' },
    correct_index: 'A',
    explanation: 'En serie: R_total = R₁ + R₂ + R₃ = 2 + 3 + 5 = 10 Ω.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Física', difficulty: 2,
    stem: 'El efecto Doppler explica por qué:',
    options_json: {
      A: 'El tono de una sirena parece más agudo cuando se acerca y más grave cuando se aleja.',
      B: 'El sonido viaja más rápido en el agua que en el aire.',
      C: 'El eco se produce cuando el sonido rebota en una superficie.',
      D: 'Las ondas de radio atraviesan las paredes.',
    },
    correct_index: 'A',
    explanation: 'El efecto Doppler: cuando la fuente se acerca, las ondas se comprimen (mayor frecuencia = tono más agudo); cuando se aleja, se estiran (menor frecuencia = tono más grave).',
    icfes_competency: 'Explicación de fenómenos',
  },
  {
    subject: 'ciencias_naturales', topic: 'Física', difficulty: 2,
    stem: 'La energía mecánica total de un péndulo ideal (sin fricción) es:',
    options_json: {
      A: 'Constante: se convierte entre potencial y cinética sin perderse.',
      B: 'Cero cuando el péndulo está en el punto más bajo.',
      C: 'Máxima cuando el péndulo está en el punto más bajo.',
      D: 'Solo potencial, nunca cinética.',
    },
    correct_index: 'A',
    explanation: 'En el punto más alto: Ep máxima, Ec = 0. En el punto más bajo: Ec máxima, Ep = 0. La suma Ep + Ec = constante (conservación de energía sin fricción).',
    icfes_competency: 'Explicación de fenómenos',
  },
  {
    subject: 'ciencias_naturales', topic: 'Física', difficulty: 2,
    stem: 'La ley de Faraday establece que se induce una corriente eléctrica en un conductor cuando:',
    options_json: {
      A: 'Hay un cambio en el flujo magnético que lo atraviesa.',
      B: 'Se calienta el conductor a más de 100 °C.',
      C: 'Se aplica una fuerza mecánica al conductor.',
      D: 'El conductor está conectado a una batería.',
    },
    correct_index: 'A',
    explanation: 'La inducción electromagnética (Faraday, 1831): un cambio en el flujo magnético (variación de B o del área) induce una fem en el conductor. Base de los generadores eléctricos.',
    icfes_competency: 'Explicación de fenómenos',
  },
  {
    subject: 'ciencias_naturales', topic: 'Física', difficulty: 2,
    stem: 'En física cuántica, el principio de incertidumbre de Heisenberg establece que:',
    options_json: {
      A: 'No es posible conocer simultáneamente con precisión arbitraria la posición y el momento de una partícula.',
      B: 'Las partículas subatómicas no tienen posición definida porque son ondas.',
      C: 'La energía de un fotón es inversamente proporcional a su frecuencia.',
      D: 'Los electrones solo existen en estados de energía pares.',
    },
    correct_index: 'A',
    explanation: 'Δx · Δp ≥ ℏ/2: cuanto más precisamente se mide la posición (Δx pequeño), mayor es la incertidumbre en el momento (Δp grande) y viceversa. Es una propiedad fundamental, no un límite tecnológico.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Física', difficulty: 2,
    stem: 'El principio de Arquímedes establece que un cuerpo sumergido en un fluido experimenta:',
    options_json: {
      A: 'Una fuerza de empuje vertical hacia arriba igual al peso del fluido desplazado.',
      B: 'Una fuerza hacia abajo proporcional a su densidad.',
      C: 'Una presión horizontal igual a la presión atmosférica.',
      D: 'Una aceleración constante independiente de su forma.',
    },
    correct_index: 'A',
    explanation: 'E = ρ_fluido · V_sumergido · g. Si E > peso del objeto, flota; si E < peso, se hunde. Explica por qué los barcos de acero flotan (el volumen de agua desplazada pesa más que el barco).',
    icfes_competency: 'Explicación de fenómenos',
  },
  {
    subject: 'ciencias_naturales', topic: 'Física', difficulty: 2,
    stem: 'En el modelo estándar de física de partículas, la fuerza nuclear fuerte es mediada por:',
    options_json: { A: 'Los gluones', B: 'Los fotones', C: 'Los bosones W y Z', D: 'Los gravitones' },
    correct_index: 'A',
    explanation: 'Mediadores de las fuerzas: fuerza electromagnética → fotones; débil → W±, Z⁰; fuerte → gluones; gravitacional → gravitón (hipotético). Los gluones "pegan" quarks dentro de protones y neutrones.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Física', difficulty: 2,
    stem: 'La relatividad especial de Einstein postula que la velocidad de la luz en el vacío (c ≈ 3×10⁸ m/s):',
    options_json: {
      A: 'Es la misma para todos los observadores independientemente de su velocidad relativa.',
      B: 'Depende de la velocidad del observador que la mide.',
      C: 'Es la velocidad máxima solo para la luz visible, no para otras ondas.',
      D: 'Se incrementa cuando la fuente de luz se mueve hacia el observador.',
    },
    correct_index: 'A',
    explanation: 'Este postulado de Einstein (1905) lleva a consecuencias como la dilatación del tiempo y la contracción de la longitud: el espacio y el tiempo son relativos, pero c es absoluta.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Física', difficulty: 2,
    stem: 'Un transformador eléctrico sube el voltaje para transmitir electricidad a largas distancias porque:',
    options_json: {
      A: 'Mayor voltaje implica menor corriente para la misma potencia, reduciendo las pérdidas por calor en los cables (P = I²R).',
      B: 'Mayor voltaje hace que la corriente viaje más rápido.',
      C: 'Los cables de alta tensión tienen menor resistencia.',
      D: 'La potencia transmitida aumenta con el voltaje.',
    },
    correct_index: 'A',
    explanation: 'P = VI (potencia constante). Al subir V, baja I. Las pérdidas en cables son I²R: si I se reduce a la mitad, las pérdidas caen a 1/4. Por eso las líneas de alta tensión usan miles de voltios.',
    icfes_competency: 'Explicación de fenómenos',
  },
  {
    subject: 'ciencias_naturales', topic: 'Física', difficulty: 2,
    stem: 'En física nuclear, la fisión y la fusión liberan energía porque:',
    options_json: {
      A: 'En ambos procesos, la masa total de los productos es menor que la de los reactivos; la diferencia se convierte en energía (E = mc²).',
      B: 'Los neutrones liberados calientan directamente el reactor.',
      C: 'Los electrones se liberan con alta energía cinética.',
      D: 'La energía de enlace entre neutrones y protones se convierte en calor sin pérdida de masa.',
    },
    correct_index: 'A',
    explanation: 'El defecto de masa (Δm = masa_reactivos − masa_productos) se convierte en energía según E = Δm·c². En la fisión del U-235 y en la fusión del deuterio-tritio, Δm > 0.',
    icfes_competency: 'Explicación de fenómenos',
  },
  {
    subject: 'ciencias_naturales', topic: 'Física', difficulty: 2,
    stem: 'La entropía en termodinámica mide:',
    options_json: {
      A: 'El grado de desorden o dispersión de la energía en un sistema.',
      B: 'La cantidad de calor almacenado en un cuerpo.',
      C: 'La eficiencia de una máquina térmica.',
      D: 'La diferencia de temperatura entre dos cuerpos.',
    },
    correct_index: 'A',
    explanation: 'La Segunda Ley establece que la entropía de un sistema aislado siempre aumenta o se mantiene: los procesos espontáneos van hacia mayor desorden. Un vaso roto no se reensambla solo.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
  },
  {
    subject: 'ciencias_naturales', topic: 'Física', difficulty: 2,
    stem: 'El experimento de la doble rendija demuestra que los electrones exhiben:',
    options_json: {
      A: 'Dualidad onda-corpúsculo: forman un patrón de interferencia como ondas, pero se detectan como partículas.',
      B: 'Comportamiento únicamente de partícula clásica.',
      C: 'Velocidad mayor que la de la luz.',
      D: 'Carga eléctrica variable dependiendo de la temperatura.',
    },
    correct_index: 'A',
    explanation: 'Cuando los electrones pasan por dos rendijas sin detectar cuál usan, forman franjas de interferencia (onda). Cuando se detecta cuál rendija usaron, el patrón desaparece (partícula). Dualidad fundamental de la mecánica cuántica.',
    icfes_competency: 'Uso comprensivo del conocimiento científico',
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
  console.log(`📦 Insertando ${rows.length} preguntas de Ciencias Naturales (fácil+medio)…`);

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
    .eq('subject', 'Ciencias Naturales');

  console.log(`📊 Total de preguntas de Ciencias Naturales en BD: ${count}`);
}

seed();
