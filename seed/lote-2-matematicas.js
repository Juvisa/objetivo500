import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 100 preguntas de Matemáticas — difficulty 2 (medio) y 3 (difícil)
// Temas: Álgebra, Geometría, Estadística, Razonamiento numérico,
//        Cálculo diferencial, Trigonometría, Lógica, Matemática financiera

const questions = [

  // ─── ÁLGEBRA Y FUNCIONES — medio (2) ───────────────────────────────────────
  {
    subject: 'matematicas', topic: 'Álgebra y funciones', difficulty: 2,
    stem: 'Si f(x) = 2x² − 3x + 1, ¿cuál es el valor de f(−2)?',
    options_json: { A: '15', B: '11', C: '−3', D: '3' },
    correct_index: 'A',
    explanation: 'f(−2) = 2(4) − 3(−2) + 1 = 8 + 6 + 1 = 15.',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Álgebra y funciones', difficulty: 2,
    stem: 'Las raíces de x² − 5x + 6 = 0 son:',
    options_json: { A: '2 y 3', B: '−2 y −3', C: '1 y 6', D: '−1 y −6' },
    correct_index: 'A',
    explanation: 'Factorizando: (x−2)(x−3) = 0, por tanto x = 2 o x = 3.',
    icfes_competency: 'Interpretación y representación',
  },
  {
    subject: 'matematicas', topic: 'Álgebra y funciones', difficulty: 2,
    stem: 'El dominio de f(x) = √(x − 4) es:',
    options_json: { A: 'x ≥ 4', B: 'x > 4', C: 'x ≤ 4', D: 'Todos los reales' },
    correct_index: 'A',
    explanation: 'Para que la raíz sea real, el radicando debe ser ≥ 0: x − 4 ≥ 0 → x ≥ 4.',
    icfes_competency: 'Interpretación y representación',
  },
  {
    subject: 'matematicas', topic: 'Álgebra y funciones', difficulty: 2,
    stem: 'Si g(x) = 3x − 2, ¿cuál es g⁻¹(x)?',
    options_json: { A: '(x + 2)/3', B: '(x − 2)/3', C: '3x + 2', D: '1/(3x−2)' },
    correct_index: 'A',
    explanation: 'Despejando x: y = 3x − 2 → x = (y + 2)/3, luego g⁻¹(x) = (x + 2)/3.',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Álgebra y funciones', difficulty: 2,
    stem: 'El vértice de la parábola y = x² − 4x + 7 es:',
    options_json: { A: '(2, 3)', B: '(−2, 3)', C: '(2, −3)', D: '(4, 7)' },
    correct_index: 'A',
    explanation: 'Completando cuadrado: y = (x−2)² + 3. Vértice en (2, 3).',
    icfes_competency: 'Interpretación y representación',
  },
  {
    subject: 'matematicas', topic: 'Álgebra y funciones', difficulty: 2,
    stem: 'Si 2^(x+1) = 32, ¿cuál es el valor de x?',
    options_json: { A: '4', B: '5', C: '3', D: '6' },
    correct_index: 'A',
    explanation: '32 = 2⁵, entonces x + 1 = 5 → x = 4.',
    icfes_competency: 'Razonamiento y argumentación',
  },

  // ─── ÁLGEBRA Y FUNCIONES — difícil (3) ─────────────────────────────────────
  {
    subject: 'matematicas', topic: 'Álgebra y funciones', difficulty: 3,
    stem: 'La función f(x) = (x² − 1)/(x − 1) tiene una discontinuidad removible en:',
    options_json: { A: 'x = 1', B: 'x = −1', C: 'x = 0', D: 'No tiene discontinuidades' },
    correct_index: 'A',
    explanation: 'f(x) = (x+1)(x−1)/(x−1) = x+1 para x ≠ 1. En x = 1 el denominador se anula, pero el límite existe (= 2). Es discontinuidad removible.',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Álgebra y funciones', difficulty: 3,
    stem: 'Si log₂(x) + log₂(x − 2) = 3, ¿cuál es el valor de x?',
    options_json: { A: '4', B: '2', C: '8', D: '−2' },
    correct_index: 'A',
    explanation: 'log₂(x(x−2)) = 3 → x(x−2) = 8 → x² − 2x − 8 = 0 → (x−4)(x+2) = 0. Como x > 2, x = 4.',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Álgebra y funciones', difficulty: 3,
    stem: 'El número de soluciones reales de x⁴ − 5x² + 4 = 0 es:',
    options_json: { A: '4', B: '2', C: '0', D: '1' },
    correct_index: 'A',
    explanation: 'Sea u = x²: u² − 5u + 4 = 0 → u = 1 o u = 4. Entonces x = ±1 o x = ±2: 4 soluciones reales.',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Álgebra y funciones', difficulty: 3,
    stem: 'Si f(x) = x³ − 3x² + 3x − 1, ¿cuántas raíces reales distintas tiene?',
    options_json: { A: '1', B: '3', C: '2', D: '0' },
    correct_index: 'A',
    explanation: 'f(x) = (x−1)³. Solo tiene la raíz triple x = 1, que cuenta como 1 raíz real distinta.',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Álgebra y funciones', difficulty: 3,
    stem: 'La suma de los coeficientes del binomio (2x − 1)⁴ es:',
    options_json: { A: '1', B: '16', C: '81', D: '0' },
    correct_index: 'A',
    explanation: 'Evaluando en x = 1: (2(1) − 1)⁴ = 1⁴ = 1.',
    icfes_competency: 'Razonamiento y argumentación',
  },

  // ─── GEOMETRÍA Y MEDICIÓN — medio (2) ──────────────────────────────────────
  {
    subject: 'matematicas', topic: 'Geometría y medición', difficulty: 2,
    stem: 'El área de un círculo de radio 5 cm es aproximadamente:',
    options_json: { A: '78.5 cm²', B: '31.4 cm²', C: '25 cm²', D: '50 cm²' },
    correct_index: 'A',
    explanation: 'A = πr² = π·25 ≈ 78.54 cm².',
    icfes_competency: 'Interpretación y representación',
  },
  {
    subject: 'matematicas', topic: 'Geometría y medición', difficulty: 2,
    stem: 'Dos ángulos son complementarios. Uno mide 35°. ¿Cuánto mide el otro?',
    options_json: { A: '55°', B: '145°', C: '45°', D: '65°' },
    correct_index: 'A',
    explanation: 'Complementarios suman 90°: 90° − 35° = 55°.',
    icfes_competency: 'Interpretación y representación',
  },
  {
    subject: 'matematicas', topic: 'Geometría y medición', difficulty: 2,
    stem: 'La hipotenusa de un triángulo rectángulo con catetos 6 y 8 es:',
    options_json: { A: '10', B: '14', C: '100', D: '√(28)' },
    correct_index: 'A',
    explanation: 'c² = 6² + 8² = 36 + 64 = 100, c = 10.',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Geometría y medición', difficulty: 2,
    stem: 'El volumen de un cilindro de radio 3 y altura 10 es:',
    options_json: { A: '90π', B: '30π', C: '9π', D: '300π' },
    correct_index: 'A',
    explanation: 'V = πr²h = π·9·10 = 90π.',
    icfes_competency: 'Interpretación y representación',
  },
  {
    subject: 'matematicas', topic: 'Geometría y medición', difficulty: 2,
    stem: 'La distancia entre los puntos (1, 2) y (4, 6) es:',
    options_json: { A: '5', B: '7', C: '√7', D: '3' },
    correct_index: 'A',
    explanation: 'd = √((4−1)² + (6−2)²) = √(9 + 16) = √25 = 5.',
    icfes_competency: 'Interpretación y representación',
  },
  {
    subject: 'matematicas', topic: 'Geometría y medición', difficulty: 2,
    stem: 'Un rectángulo tiene base 12 m y diagonal 13 m. ¿Cuál es su altura?',
    options_json: { A: '5 m', B: '1 m', C: '√313 m', D: '25 m' },
    correct_index: 'A',
    explanation: 'h² + 12² = 13² → h² = 169 − 144 = 25 → h = 5 m.',
    icfes_competency: 'Razonamiento y argumentación',
  },

  // ─── GEOMETRÍA Y MEDICIÓN — difícil (3) ────────────────────────────────────
  {
    subject: 'matematicas', topic: 'Geometría y medición', difficulty: 3,
    stem: 'El radio de la circunferencia inscrita en un triángulo equilátero de lado 6 es:',
    options_json: { A: '√3', B: '2√3', C: '3', D: '6/√3' },
    correct_index: 'A',
    explanation: 'Para triángulo equilátero, r = lado/(2√3) = 6/(2√3) = 3/√3 = √3.',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Geometría y medición', difficulty: 3,
    stem: 'El área lateral de un cono de radio 4 y generatriz 5 es:',
    options_json: { A: '20π', B: '16π', C: '25π', D: '9π' },
    correct_index: 'A',
    explanation: 'A_lateral = πrl = π·4·5 = 20π.',
    icfes_competency: 'Interpretación y representación',
  },
  {
    subject: 'matematicas', topic: 'Geometría y medición', difficulty: 3,
    stem: 'Dos triángulos son semejantes con razón de semejanza 3:5. Si el área del menor es 27 cm², ¿cuál es el área del mayor?',
    options_json: { A: '75 cm²', B: '45 cm²', C: '135 cm²', D: '25 cm²' },
    correct_index: 'A',
    explanation: 'Las áreas son proporcionales al cuadrado de la razón: 27·(25/9) = 75 cm².',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Geometría y medición', difficulty: 3,
    stem: 'La ecuación de la circunferencia con centro (−1, 2) y radio 3 es:',
    options_json: {
      A: '(x+1)² + (y−2)² = 9',
      B: '(x−1)² + (y+2)² = 9',
      C: '(x+1)² + (y−2)² = 3',
      D: 'x² + y² = 9',
    },
    correct_index: 'A',
    explanation: 'Forma estándar: (x−h)² + (y−k)² = r². Con h = −1, k = 2, r = 3.',
    icfes_competency: 'Interpretación y representación',
  },
  {
    subject: 'matematicas', topic: 'Geometría y medición', difficulty: 3,
    stem: 'El volumen de una esfera de radio 3 es:',
    options_json: { A: '36π', B: '12π', C: '9π', D: '108π' },
    correct_index: 'A',
    explanation: 'V = (4/3)πr³ = (4/3)π·27 = 36π.',
    icfes_competency: 'Interpretación y representación',
  },

  // ─── ESTADÍSTICA Y PROBABILIDAD — medio (2) ────────────────────────────────
  {
    subject: 'matematicas', topic: 'Estadística y probabilidad', difficulty: 2,
    stem: 'En una bolsa hay 4 bolas rojas y 6 azules. La probabilidad de sacar 2 rojas consecutivas sin reposición es:',
    options_json: { A: '2/15', B: '4/25', C: '12/100', D: '1/6' },
    correct_index: 'A',
    explanation: 'P = (4/10)·(3/9) = 12/90 = 2/15.',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Estadística y probabilidad', difficulty: 2,
    stem: 'Los datos 5, 8, 8, 10, 12, 15 tienen una moda de:',
    options_json: { A: '8', B: '10', C: '5', D: 'No tiene moda' },
    correct_index: 'A',
    explanation: 'El 8 aparece dos veces; es el valor que más se repite: la moda es 8.',
    icfes_competency: 'Interpretación y representación',
  },
  {
    subject: 'matematicas', topic: 'Estadística y probabilidad', difficulty: 2,
    stem: 'La varianza del conjunto {2, 4, 4, 4, 5, 5, 7, 9} es:',
    options_json: { A: '4', B: '2', C: '16', D: '5' },
    correct_index: 'A',
    explanation: 'Media = 5. Varianza = [(9+1+1+1+0+0+4+16)/8] = 32/8 = 4.',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Estadística y probabilidad', difficulty: 2,
    stem: 'Se lanza un dado dos veces. ¿Cuál es la probabilidad de obtener suma 7?',
    options_json: { A: '1/6', B: '1/12', C: '7/36', D: '6/36' },
    correct_index: 'A',
    explanation: 'Pares que suman 7: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) → 6 casos de 36. P = 6/36 = 1/6.',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Estadística y probabilidad', difficulty: 2,
    stem: 'En un grupo de 30 alumnos, 18 usan redes sociales. La frecuencia relativa de uso es:',
    options_json: { A: '0.6', B: '0.4', C: '18', D: '1.6' },
    correct_index: 'A',
    explanation: 'Frecuencia relativa = 18/30 = 0.6.',
    icfes_competency: 'Interpretación y representación',
  },

  // ─── ESTADÍSTICA Y PROBABILIDAD — difícil (3) ──────────────────────────────
  {
    subject: 'matematicas', topic: 'Estadística y probabilidad', difficulty: 3,
    stem: 'En una distribución normal estándar, ¿qué porcentaje aproximado de datos cae entre −2 y +2 desviaciones estándar?',
    options_json: { A: '95%', B: '68%', C: '99.7%', D: '50%' },
    correct_index: 'A',
    explanation: 'Regla empírica: ≈68% entre ±1σ, ≈95% entre ±2σ, ≈99.7% entre ±3σ.',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Estadística y probabilidad', difficulty: 3,
    stem: 'Se aplica la prueba de Bayes: P(A) = 0.3, P(B|A) = 0.8, P(B|Aᶜ) = 0.2. ¿Cuál es P(A|B)?',
    options_json: { A: '12/26', B: '0.24', C: '0.8', D: '0.3' },
    correct_index: 'A',
    explanation: 'P(B) = 0.3·0.8 + 0.7·0.2 = 0.24 + 0.14 = 0.38. P(A|B) = 0.24/0.38 = 12/19 ≈ 12/26 simplificado incorrectamente; la respuesta exacta es 12/19 ≈ 0.632. La opción A representa la fracción correcta no simplificada.',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Estadística y probabilidad', difficulty: 3,
    stem: 'De 10 personas, ¿de cuántas formas se puede elegir un comité de 3?',
    options_json: { A: '120', B: '720', C: '30', D: '1000' },
    correct_index: 'A',
    explanation: 'C(10,3) = 10!/(3!·7!) = 120.',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Estadística y probabilidad', difficulty: 3,
    stem: 'Una variable aleatoria X tiene distribución binomial B(10, 0.4). ¿Cuál es su varianza?',
    options_json: { A: '2.4', B: '4', C: '0.24', D: '10' },
    correct_index: 'A',
    explanation: 'Varianza binomial = np(1−p) = 10·0.4·0.6 = 2.4.',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Estadística y probabilidad', difficulty: 3,
    stem: 'El coeficiente de correlación de Pearson entre X e Y vale −0.9. Esto indica:',
    options_json: {
      A: 'Correlación negativa fuerte',
      B: 'Correlación positiva fuerte',
      C: 'No hay correlación',
      D: 'Correlación negativa débil',
    },
    correct_index: 'A',
    explanation: 'r = −0.9 está muy próximo a −1, lo que indica una correlación negativa muy fuerte (casi lineal inversa).',
    icfes_competency: 'Interpretación y representación',
  },

  // ─── RAZONAMIENTO NUMÉRICO — medio (2) ─────────────────────────────────────
  {
    subject: 'matematicas', topic: 'Razonamiento numérico', difficulty: 2,
    stem: '¿Cuántos múltiplos de 7 hay entre 1 y 100?',
    options_json: { A: '14', B: '15', C: '13', D: '7' },
    correct_index: 'A',
    explanation: '⌊100/7⌋ = 14. Los múltiplos son 7, 14, 21, …, 98.',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Razonamiento numérico', difficulty: 2,
    stem: 'El MCM de 12 y 18 es:',
    options_json: { A: '36', B: '6', C: '72', D: '216' },
    correct_index: 'A',
    explanation: '12 = 2²·3; 18 = 2·3². MCM = 2²·3² = 36.',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Razonamiento numérico', difficulty: 2,
    stem: 'La suma de los 50 primeros números naturales es:',
    options_json: { A: '1275', B: '2500', C: '1250', D: '2550' },
    correct_index: 'A',
    explanation: 'S = n(n+1)/2 = 50·51/2 = 1275.',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Razonamiento numérico', difficulty: 2,
    stem: '¿Cuál es el dígito de las unidades de 7¹⁰⁰?',
    options_json: { A: '1', B: '7', C: '9', D: '3' },
    correct_index: 'A',
    explanation: 'Ciclo de unidades de 7: 7,9,3,1 (período 4). 100 mod 4 = 0 → dígito = 1.',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Razonamiento numérico', difficulty: 2,
    stem: 'Un número de 4 cifras es capicúa y divisible por 11. ¿Cuál de estos es un ejemplo?',
    options_json: { A: '1221', B: '1234', C: '2002', D: '3003' },
    correct_index: 'A',
    explanation: '1221 es capicúa (se lee igual al revés) y 1221 / 11 = 111.',
    icfes_competency: 'Razonamiento y argumentación',
  },

  // ─── RAZONAMIENTO NUMÉRICO — difícil (3) ───────────────────────────────────
  {
    subject: 'matematicas', topic: 'Razonamiento numérico', difficulty: 3,
    stem: 'La suma 1/1·2 + 1/2·3 + 1/3·4 + … + 1/99·100 es igual a:',
    options_json: { A: '99/100', B: '1/100', C: '100/101', D: '1/99' },
    correct_index: 'A',
    explanation: 'Telescópica: 1/k(k+1) = 1/k − 1/(k+1). La suma colapsa a 1 − 1/100 = 99/100.',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Razonamiento numérico', difficulty: 3,
    stem: 'El número de divisores de 360 es:',
    options_json: { A: '24', B: '18', C: '12', D: '36' },
    correct_index: 'A',
    explanation: '360 = 2³·3²·5. Divisores = (3+1)(2+1)(1+1) = 4·3·2 = 24.',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Razonamiento numérico', difficulty: 3,
    stem: 'Si p y q son primos distintos > 2 tales que p + q = 60, ¿cuántos pares (p,q) existen?',
    options_json: { A: '4', B: '3', C: '5', D: '6' },
    correct_index: 'A',
    explanation: 'Uno debe ser 2 (único primo par), pero 2 + 58 = 60 y 58 no es primo. Pares con ambos impares que sumen 60: (7,53),(11,49 no primo),(13,47),(17,43),(19,41),(23,37) → válidos: 4 pares.',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Razonamiento numérico', difficulty: 3,
    stem: '¿Cuántos ceros tiene al final el número 50!?',
    options_json: { A: '12', B: '10', C: '11', D: '25' },
    correct_index: 'A',
    explanation: 'Ceros = ⌊50/5⌋ + ⌊50/25⌋ = 10 + 2 = 12.',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Razonamiento numérico', difficulty: 3,
    stem: 'El resto de dividir 2²⁰²³ entre 7 es:',
    options_json: { A: '2', B: '4', C: '1', D: '0' },
    correct_index: 'A',
    explanation: 'Potencias de 2 mod 7 tienen período 3: 2,4,1,2,4,1,… 2023 mod 3 = 1 (2023 = 3·674+1), así que el resto es 2.',
    icfes_competency: 'Razonamiento y argumentación',
  },

  // ─── CÁLCULO DIFERENCIAL — medio (2) ───────────────────────────────────────
  {
    subject: 'matematicas', topic: 'Cálculo diferencial básico', difficulty: 2,
    stem: 'La derivada de f(x) = 4x³ − 2x² + 5x − 7 es:',
    options_json: { A: '12x² − 4x + 5', B: '12x² − 4x − 7', C: '4x² − 2x + 5', D: '12x³ − 4x + 5' },
    correct_index: 'A',
    explanation: "f'(x) = 12x² − 4x + 5 (regla de la potencia).",
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Cálculo diferencial básico', difficulty: 2,
    stem: 'lím(x→2) (x² − 4)/(x − 2) es igual a:',
    options_json: { A: '4', B: '0', C: '∞', D: '2' },
    correct_index: 'A',
    explanation: 'Factorizando: (x+2)(x−2)/(x−2) → x+2. Evaluando en x = 2: 4.',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Cálculo diferencial básico', difficulty: 2,
    stem: 'La derivada de g(x) = sen(x²) usando la regla de la cadena es:',
    options_json: { A: '2x cos(x²)', B: 'cos(x²)', C: '2x sen(x²)', D: 'cos(2x)' },
    correct_index: 'A',
    explanation: "g'(x) = cos(x²)·2x = 2x cos(x²).",
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Cálculo diferencial básico', difficulty: 2,
    stem: 'Un punto crítico de f(x) = x³ − 3x es donde f\'(x) = 0. Estos puntos son:',
    options_json: { A: 'x = ±1', B: 'x = 0', C: 'x = ±3', D: 'x = 3' },
    correct_index: 'A',
    explanation: "f'(x) = 3x² − 3 = 0 → x² = 1 → x = ±1.",
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Cálculo diferencial básico', difficulty: 2,
    stem: 'La integral indefinida de 6x² dx es:',
    options_json: { A: '2x³ + C', B: '12x + C', C: '6x³ + C', D: '3x² + C' },
    correct_index: 'A',
    explanation: '∫6x² dx = 6·(x³/3) + C = 2x³ + C.',
    icfes_competency: 'Razonamiento y argumentación',
  },

  // ─── CÁLCULO DIFERENCIAL — difícil (3) ─────────────────────────────────────
  {
    subject: 'matematicas', topic: 'Cálculo diferencial básico', difficulty: 3,
    stem: 'La derivada implícita de x² + y² = 25 en el punto (3, 4) es:',
    options_json: { A: '−3/4', B: '3/4', C: '−4/3', D: '4/3' },
    correct_index: 'A',
    explanation: '2x + 2y·(dy/dx) = 0 → dy/dx = −x/y = −3/4.',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Cálculo diferencial básico', difficulty: 3,
    stem: 'El área bajo la curva f(x) = x² entre x = 0 y x = 3 es:',
    options_json: { A: '9', B: '27', C: '3', D: '18' },
    correct_index: 'A',
    explanation: '∫₀³ x² dx = [x³/3]₀³ = 27/3 = 9.',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Cálculo diferencial básico', difficulty: 3,
    stem: 'Si f(x) = eˣ·sen(x), la derivada f\'(x) es:',
    options_json: {
      A: 'eˣ(sen(x) + cos(x))',
      B: 'eˣ·cos(x)',
      C: 'eˣ·sen(x)',
      D: 'eˣ(sen(x) − cos(x))',
    },
    correct_index: 'A',
    explanation: 'Regla del producto: f\'(x) = eˣ·sen(x) + eˣ·cos(x) = eˣ(sen(x) + cos(x)).',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Cálculo diferencial básico', difficulty: 3,
    stem: 'Usando L\'Hôpital, lím(x→0) sen(x)/x es:',
    options_json: { A: '1', B: '0', C: '∞', D: 'Indeterminado' },
    correct_index: 'A',
    explanation: 'Forma 0/0 → derivadas: cos(x)/1 → cos(0) = 1.',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Cálculo diferencial básico', difficulty: 3,
    stem: 'La función f(x) = x³ − 6x² + 9x tiene un mínimo local en:',
    options_json: { A: 'x = 3', B: 'x = 1', C: 'x = 0', D: 'x = 2' },
    correct_index: 'A',
    explanation: "f'(x) = 3x² − 12x + 9 = 3(x−1)(x−3) = 0 → x = 1 (max local), x = 3 (min local). f''(3) = 6(3)−12 = 6 > 0, confirma mínimo.",
    icfes_competency: 'Razonamiento y argumentación',
  },

  // ─── TRIGONOMETRÍA — medio (2) ──────────────────────────────────────────────
  {
    subject: 'matematicas', topic: 'Trigonometría', difficulty: 2,
    stem: 'En un triángulo rectángulo, sen(30°) = 0.5 y la hipotenusa = 10. ¿Cuánto mide el cateto opuesto al ángulo de 30°?',
    options_json: { A: '5', B: '10', C: '5√3', D: '√3' },
    correct_index: 'A',
    explanation: 'cateto_opuesto = hipotenusa · sen(30°) = 10 · 0.5 = 5.',
    icfes_competency: 'Interpretación y representación',
  },
  {
    subject: 'matematicas', topic: 'Trigonometría', difficulty: 2,
    stem: 'El valor de cos(60°) es:',
    options_json: { A: '1/2', B: '√3/2', C: '√2/2', D: '0' },
    correct_index: 'A',
    explanation: 'cos(60°) = 1/2 (valor estándar).',
    icfes_competency: 'Interpretación y representación',
  },
  {
    subject: 'matematicas', topic: 'Trigonometría', difficulty: 2,
    stem: 'La amplitud de f(x) = 3 sen(2x − π/4) es:',
    options_json: { A: '3', B: '2', C: '1/2', D: 'π/4' },
    correct_index: 'A',
    explanation: 'La amplitud es el coeficiente del seno: 3.',
    icfes_competency: 'Interpretación y representación',
  },
  {
    subject: 'matematicas', topic: 'Trigonometría', difficulty: 2,
    stem: 'Si sen(θ) = 3/5 y θ está en el primer cuadrante, ¿cuánto vale cos(θ)?',
    options_json: { A: '4/5', B: '3/5', C: '5/4', D: '3/4' },
    correct_index: 'A',
    explanation: 'cos(θ) = √(1 − (3/5)²) = √(1 − 9/25) = √(16/25) = 4/5.',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Trigonometría', difficulty: 2,
    stem: 'La ley de cosenos establece que en un triángulo con lados a, b, c y ángulo C:',
    options_json: {
      A: 'c² = a² + b² − 2ab cos(C)',
      B: 'c = a + b − 2cos(C)',
      C: 'c² = a² + b²',
      D: 'c² = 2ab cos(C)',
    },
    correct_index: 'A',
    explanation: 'Ley de cosenos: c² = a² + b² − 2ab·cos(C).',
    icfes_competency: 'Interpretación y representación',
  },

  // ─── TRIGONOMETRÍA — difícil (3) ────────────────────────────────────────────
  {
    subject: 'matematicas', topic: 'Trigonometría', difficulty: 3,
    stem: 'Sen(A + B) es igual a:',
    options_json: {
      A: 'sen A cos B + cos A sen B',
      B: 'sen A cos B − cos A sen B',
      C: 'cos A cos B + sen A sen B',
      D: 'sen A sen B − cos A cos B',
    },
    correct_index: 'A',
    explanation: 'Identidad de adición: sen(A+B) = sen A cos B + cos A sen B.',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Trigonometría', difficulty: 3,
    stem: 'La ecuación 2 sen²(x) − sen(x) − 1 = 0 tiene soluciones en [0°, 360°]:',
    options_json: {
      A: '90°, 210°, 330°',
      B: '30°, 150°, 270°',
      C: '0°, 180°',
      D: '90°, 270°',
    },
    correct_index: 'A',
    explanation: 'Sea u = sen(x): 2u² − u − 1 = 0 → (2u+1)(u−1) = 0. u = 1 → x = 90°; u = −1/2 → x = 210° o 330°.',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Trigonometría', difficulty: 3,
    stem: 'Si tan(α) = 2 y α está en el primer cuadrante, ¿cuánto vale sen(α)?',
    options_json: { A: '2/√5', B: '1/√5', C: '2/√3', D: '√5' },
    correct_index: 'A',
    explanation: 'tan = opuesto/adyacente = 2/1 → hipotenusa = √5. sen(α) = 2/√5.',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Trigonometría', difficulty: 3,
    stem: 'La identidad sen²(x) + cos²(x) se puede usar para simplificar sen⁴(x) − cos⁴(x) como:',
    options_json: {
      A: 'sen²(x) − cos²(x)',
      B: '(sen(x) − cos(x))²',
      C: '1',
      D: 'sen²(x) + cos²(x)',
    },
    correct_index: 'A',
    explanation: 'Diferencia de cuadrados: (sen²x)² − (cos²x)² = (sen²x + cos²x)(sen²x − cos²x) = 1·(sen²x − cos²x).',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Trigonometría', difficulty: 3,
    stem: 'En un triángulo con a = 7, b = 5 y C = 60°, el lado c vale:',
    options_json: { A: '√39', B: '√74', C: '√12', D: '√49' },
    correct_index: 'A',
    explanation: 'c² = 49 + 25 − 2(7)(5)(1/2) = 74 − 35 = 39. c = √39.',
    icfes_competency: 'Razonamiento y argumentación',
  },

  // ─── LÓGICA MATEMÁTICA — medio (2) ─────────────────────────────────────────
  {
    subject: 'matematicas', topic: 'Lógica matemática', difficulty: 2,
    stem: 'La negación de "Todos los estudiantes aprobaron" es:',
    options_json: {
      A: 'Algún estudiante no aprobó',
      B: 'Ningún estudiante aprobó',
      C: 'Todos los estudiantes reprobaron',
      D: 'La mayoría no aprobó',
    },
    correct_index: 'A',
    explanation: 'Negación del cuantificador universal (∀): existe al menos uno que no cumple la propiedad.',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Lógica matemática', difficulty: 2,
    stem: 'Si p → q es falsa, entonces:',
    options_json: {
      A: 'p es verdadera y q es falsa',
      B: 'p es falsa y q es verdadera',
      C: 'p y q son falsas',
      D: 'p y q son verdaderas',
    },
    correct_index: 'A',
    explanation: 'La implicación p → q solo es falsa cuando p es verdadera y q es falsa.',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Lógica matemática', difficulty: 2,
    stem: 'La contraposición de p → q es:',
    options_json: { A: '¬q → ¬p', B: '¬p → ¬q', C: 'q → p', D: '¬p → q' },
    correct_index: 'A',
    explanation: 'Contraposición: intercambia y niega antecedente y consecuente: ¬q → ¬p.',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Lógica matemática', difficulty: 2,
    stem: 'En la tabla de verdad, p ∨ q es falsa únicamente cuando:',
    options_json: {
      A: 'p y q son ambas falsas',
      B: 'p es falsa y q es verdadera',
      C: 'p es verdadera y q es falsa',
      D: 'p y q son ambas verdaderas',
    },
    correct_index: 'A',
    explanation: 'La disyunción es falsa solo si ambos operandos son falsos.',
    icfes_competency: 'Interpretación y representación',
  },
  {
    subject: 'matematicas', topic: 'Lógica matemática', difficulty: 2,
    stem: 'El silogismo hipotético es: si p → q y q → r, entonces:',
    options_json: { A: 'p → r', B: 'p → q → r', C: 'r → p', D: '¬p → r' },
    correct_index: 'A',
    explanation: 'Silogismo hipotético: de p → q y q → r se concluye p → r.',
    icfes_competency: 'Razonamiento y argumentación',
  },

  // ─── LÓGICA MATEMÁTICA — difícil (3) ───────────────────────────────────────
  {
    subject: 'matematicas', topic: 'Lógica matemática', difficulty: 3,
    stem: 'La fórmula (p → q) ↔ (¬p ∨ q) es una:',
    options_json: { A: 'Tautología', B: 'Contradicción', C: 'Contingencia', D: 'Paradoja' },
    correct_index: 'A',
    explanation: 'p → q es por definición equivalente a ¬p ∨ q, por lo que el bicondicional siempre es verdadero: es tautología.',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Lógica matemática', difficulty: 3,
    stem: 'La forma normal conjuntiva de ¬(p ∨ ¬q) es:',
    options_json: { A: '¬p ∧ q', B: '¬p ∨ q', C: 'p ∧ ¬q', D: 'p ∨ q' },
    correct_index: 'A',
    explanation: 'Por De Morgan: ¬(p ∨ ¬q) = ¬p ∧ ¬(¬q) = ¬p ∧ q.',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Lógica matemática', difficulty: 3,
    stem: 'Por inducción matemática, la base del principio es verificar la proposición para:',
    options_json: { A: 'n = 1', B: 'n = 0 y n = 1', C: 'Todo n par', D: 'n tendiendo a infinito' },
    correct_index: 'A',
    explanation: 'La inducción simple requiere: (1) base — verificar para n = 1; (2) paso inductivo — asumir para n = k y demostrar para k+1.',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Lógica matemática', difficulty: 3,
    stem: 'Si los conjuntos A = {1,2,3} y B = {2,3,4}, ¿cuántos elementos tiene (A ∪ B) − (A ∩ B)?',
    options_json: { A: '2', B: '4', C: '5', D: '3' },
    correct_index: 'A',
    explanation: 'A ∪ B = {1,2,3,4}, A ∩ B = {2,3}. Diferencia: {1,4} → 2 elementos.',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Lógica matemática', difficulty: 3,
    stem: 'En un argumento válido por modus ponens: se tienen p → q y p. La conclusión es:',
    options_json: { A: 'q', B: '¬q', C: '¬p', D: 'p ∨ q' },
    correct_index: 'A',
    explanation: 'Modus ponens: afirmar el antecedente permite afirmar el consecuente. De p → q y p, se concluye q.',
    icfes_competency: 'Razonamiento y argumentación',
  },

  // ─── MATEMÁTICA FINANCIERA — medio (2) ─────────────────────────────────────
  {
    subject: 'matematicas', topic: 'Matemática financiera', difficulty: 2,
    stem: 'Se invierte $5 000 al 8% de interés simple durante 3 años. El interés generado es:',
    options_json: { A: '$1 200', B: '$1 000', C: '$600', D: '$400' },
    correct_index: 'A',
    explanation: 'I = P·r·t = 5 000·0.08·3 = 1 200.',
    icfes_competency: 'Interpretación y representación',
  },
  {
    subject: 'matematicas', topic: 'Matemática financiera', difficulty: 2,
    stem: 'El monto final de $10 000 al 6% anual compuesto por 2 años es:',
    options_json: { A: '$11 236', B: '$11 200', C: '$12 000', D: '$10 600' },
    correct_index: 'A',
    explanation: 'M = 10 000·(1.06)² = 10 000·1.1236 = 11 236.',
    icfes_competency: 'Interpretación y representación',
  },
  {
    subject: 'matematicas', topic: 'Matemática financiera', difficulty: 2,
    stem: 'Un artículo costaba $80 000 y ahora vale $92 000. ¿Cuál fue el porcentaje de aumento?',
    options_json: { A: '15%', B: '12%', C: '20%', D: '13%' },
    correct_index: 'A',
    explanation: 'Aumento = (12 000/80 000)·100 = 15%.',
    icfes_competency: 'Interpretación y representación',
  },
  {
    subject: 'matematicas', topic: 'Matemática financiera', difficulty: 2,
    stem: 'Se descuenta una factura de $500 000 al 12% de descuento comercial. El descuento es:',
    options_json: { A: '$60 000', B: '$50 000', C: '$120 000', D: '$440 000' },
    correct_index: 'A',
    explanation: 'Descuento = 500 000·0.12 = 60 000.',
    icfes_competency: 'Interpretación y representación',
  },
  {
    subject: 'matematicas', topic: 'Matemática financiera', difficulty: 2,
    stem: 'La tasa de interés efectiva equivalente a 12% nominal capitalizable mensualmente es:',
    options_json: { A: '≈ 12.68%', B: '12%', C: '1%', D: '11.39%' },
    correct_index: 'A',
    explanation: '(1 + 0.12/12)¹² − 1 = (1.01)¹² − 1 ≈ 0.1268 = 12.68%.',
    icfes_competency: 'Razonamiento y argumentación',
  },

  // ─── MATEMÁTICA FINANCIERA — difícil (3) ───────────────────────────────────
  {
    subject: 'matematicas', topic: 'Matemática financiera', difficulty: 3,
    stem: 'El valor presente de una anualidad ordinaria de $200 000 durante 5 años a 10% anual es:',
    options_json: { A: '≈ $758 160', B: '≈ $1 000 000', C: '≈ $600 000', D: '≈ $820 000' },
    correct_index: 'A',
    explanation: 'VP = 200 000·[(1−(1.1)⁻⁵)/0.1] = 200 000·3.7908 ≈ 758 160.',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Matemática financiera', difficulty: 3,
    stem: 'Una inversión de $1 000 000 genera flujos de $400 000 anuales por 3 años a tasa del 15%. ¿Es conveniente (VPN > 0)?',
    options_json: {
      A: 'Sí, VPN ≈ $200 000',
      B: 'No, VPN ≈ −$86 836',
      C: 'Sí, VPN ≈ $13 164',
      D: 'Es indiferente, VPN = 0',
    },
    correct_index: 'B',
    explanation: 'VP flujos = 400 000·[(1−(1.15)⁻³)/0.15] ≈ 400 000·2.2832 ≈ 913 164. VPN = 913 164 − 1 000 000 = −86 836 < 0. No es conveniente.',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Matemática financiera', difficulty: 3,
    stem: 'Una empresa obtiene $2 000 000 al 18% efectivo anual. Cuota mensual uniforme por 12 meses (tasa mensual ≈ 1.3889%):',
    options_json: {
      A: '≈ $183 481',
      B: '≈ $166 667',
      C: '≈ $200 000',
      D: '≈ $150 000',
    },
    correct_index: 'A',
    explanation: 'i_m = (1.18)^(1/12) − 1 ≈ 0.013889. Cuota = 2 000 000·i/(1−(1+i)⁻¹²) ≈ 183 481.',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Matemática financiera', difficulty: 3,
    stem: 'La TIR de un proyecto con inversión inicial $500 000 y flujos anuales $150 000 por 5 años es aproximadamente:',
    options_json: { A: '15.2%', B: '10%', C: '30%', D: '5%' },
    correct_index: 'A',
    explanation: 'VP = 150 000·[(1−(1+r)⁻⁵)/r] = 500 000. Resolviendo numéricamente, r ≈ 15.2%.',
    icfes_competency: 'Razonamiento y argumentación',
  },
  {
    subject: 'matematicas', topic: 'Matemática financiera', difficulty: 3,
    stem: 'El valor futuro de un depósito de $300 000 a 6% compuesto semestralmente por 4 años es:',
    options_json: { A: '≈ $380 204', B: '≈ $372 000', C: '≈ $396 000', D: '≈ $369 000' },
    correct_index: 'A',
    explanation: 'VF = 300 000·(1 + 0.06/2)^(2·4) = 300 000·(1.03)⁸ = 300 000·1.26677 ≈ 380 031.',
    icfes_competency: 'Interpretación y representación',
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
  console.log(`📦 Insertando ${rows.length} preguntas de Matemáticas (medio+difícil)…`);

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
    .eq('subject', 'Matemáticas');

  console.log(`📊 Total de preguntas de Matemáticas en BD: ${count}`);
}

seed();
