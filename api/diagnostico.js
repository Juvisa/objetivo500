// FILE: api/diagnostico.js — Vercel Serverless Function
// Proxy seguro a la API de Anthropic. La API key nunca llega al frontend.
// Requiere variable de entorno ANTHROPIC_API_KEY en Vercel dashboard.

const SYSTEM_PROMPT = `
Eres el tutor de alto rendimiento de ICFES Objetivo 500.
Tu trabajo es analizar los errores de un estudiante colombiano en el simulacro Saber 11
y generar un Plan de Acción Personalizado con tono directo, elegante y de máxima autoridad.
Sin condescendencia. Sin frases vacías. Solo datos, diagnóstico preciso y acción concreta.

Cuando recibas el diagnóstico del bloque, responde ÚNICAMENTE con un JSON válido con esta estructura exacta:
{
  "quiebre_principal": {
    "subtema": "nombre del subtema con más errores",
    "descripcion": "frase corta y directa de máximo 15 palabras sobre qué necesita dominar",
    "ejemplo": "frase de 1 línea que ilustra el tipo de pregunta que está fallando"
  },
  "fuentes_recomendadas": [
    {
      "nombre": "nombre del recurso",
      "url": "URL directa y válida",
      "descripcion": "una línea de por qué este recurso específico"
    }
  ],
  "micro_reto": "instrucción motivadora de 1-2 oraciones para repasar antes del próximo bloque",
  "frase_cierre": "frase de cierre poderosa, estilo entrenador de élite, máximo 12 palabras"
}

Recursos de alta autoridad por materia que puedes recomendar:
- Matemáticas: Julio Profe (YouTube), Khan Academy ES, MateMovil, ICFES Interactivo
- Lectura Crítica: Comprensión Lectora ICFES (YouTube), Acad (YouTube)
- Ciencias Naturales: Educatina (YouTube), Khan Academy ES Ciencias, Biología con el Profe Alex
- Ciencias Sociales: Ley Fácil (constitución), Geografía Interactiva Colombia, Profe Social
- Inglés: BBC Learning English, EnglishInUse, Cambridge English (recursos gratuitos)

NUNCA inventes URLs. Solo usa recursos que existen y son gratuitos.
Responde SOLO con el JSON. Sin texto antes ni después. Sin backticks.
`.trim();

function buildUserMessage(payload) {
  const lineasErrores = Object.entries(payload.erroresPorTema ?? {})
    .map(([tema, n]) => `- ${tema}: ${n} error(es)`)
    .join('\n');

  return `
Analiza este resultado del simulacro y genera el Plan de Acción:

Materia: ${payload.materia}
Puntaje: ${payload.puntaje}% (${payload.totalCorrectas}/${payload.totalPreguntas} correctas)
Tiempo usado: ${Math.round((payload.tiempoUsadoSegundos ?? 0) / 60)} minutos

Errores por subtema (ordenados de mayor a menor):
${lineasErrores || '— sin errores registrados —'}

Genera el Plan de Acción Personalizado.
  `.trim();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY no configurada' });
  }

  const payload = req.body;
  if (!payload || !payload.materia) {
    return res.status(400).json({ error: 'Payload inválido' });
  }

  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':    'application/json',
        'x-api-key':       apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system:     SYSTEM_PROMPT,
        messages:   [{ role: 'user', content: buildUserMessage(payload) }],
      }),
    });

    if (!anthropicRes.ok) {
      const err = await anthropicRes.text();
      return res.status(502).json({ error: 'Error en la API de IA', _debug: err });
    }

    const data  = await anthropicRes.json();
    const texto = data.content?.[0]?.text ?? '{}';

    try {
      const diagnostico = JSON.parse(texto.trim());
      return res.status(200).json(diagnostico);
    } catch {
      console.error('[diagnostico] JSON parse error. Raw text:', texto);
      return res.status(200).json(null);
    }
  } catch (err) {
    console.error('[diagnostico] fetch error:', err);
    return res.status(500).json({ error: err.message });
  }
}
