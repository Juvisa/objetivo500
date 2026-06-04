// FILE: lib/audio-config.js | Configuración de eventos sonoros
// Todos los valores de volumen dentro de 0.0–0.9 (evita distorsión)
//
// ── Mapa de colores LaTeX para el equipo de contenido ────────────
// Usar \textcolor{HEX}{símbolo} en fórmulas del banco de preguntas.
//   Base / lado principal : \textcolor{#3B82F6}{b}   (azul   — aura-blue)
//   Altura / exponente    : \textcolor{#EF4444}{h}   (rojo)
//   Resultado / área      : \textcolor{#10B981}{A}   (verde  — aura-green)
//   Constante             : \textcolor{#F59E0B}{k}   (dorado — aura-gold)
//
// Ejemplo — área de triángulo:
//   $$\textcolor{#10B981}{A} = \frac{\textcolor{#3B82F6}{b} \times \textcolor{#EF4444}{h}}{2}$$
// ─────────────────────────────────────────────────────────────────

window.AUDIO_CONFIG = {
  master: {
    volume: 0.70,
    muted:  false,
  },

  events: {
    success: {
      // Fuente: Mixkit.co | Licencia: Royalty-Free | Duración: ~0.6s
      url:         'https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3',
      urlOgg:      '',
      volume:      0.80,
      category:    'feedback',
      maxDuration: 800,
    },
    error: {
      // Fuente: Mixkit.co | Licencia: Royalty-Free | Duración: ~0.5s
      url:         'https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3',
      urlOgg:      '',
      volume:      0.60,
      category:    'feedback',
      maxDuration: 600,
    },
    powerUp: {
      // Fuente: Mixkit.co | Licencia: Royalty-Free | Duración: ~1.2s
      url:         'https://assets.mixkit.co/sfx/preview/mixkit-bonus-earned-in-video-game-2058.mp3',
      urlOgg:      '',
      volume:      0.75,
      category:    'reward',
      maxDuration: 1500,
    },
    levelUp: {
      // Fuente: Mixkit.co | Licencia: Royalty-Free | Duración: ~2.5s
      url:         'https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3',
      urlOgg:      '',
      volume:      0.85,
      category:    'epic',
      maxDuration: 3000,
    },
    click: {
      // Fuente: Mixkit.co | Licencia: Royalty-Free | Duración: ~0.1s
      url:         'https://assets.mixkit.co/sfx/preview/mixkit-mouse-click-close-1113.mp3',
      urlOgg:      '',
      volume:      0.30,
      category:    'ui',
      maxDuration: 150,
    },
    streak: {
      // Fuente: Mixkit.co | Licencia: Royalty-Free | Duración: ~1.0s
      url:         'https://assets.mixkit.co/sfx/preview/mixkit-game-level-completed-2059.mp3',
      urlOgg:      '',
      volume:      0.50,
      category:    'feedback',
      maxDuration: 1200,
    },
    dullThud: {
      // Golpe sordo para pérdida de energía del Guardián
      // Fuente: Mixkit.co | Licencia: Royalty-Free | Duración: ~0.4s
      url:         'https://assets.mixkit.co/sfx/preview/mixkit-falling-hit-on-gravel-756.mp3',
      urlOgg:      '',
      volume:      0.55,
      category:    'feedback',
      maxDuration: 600,
    },
    scoreTick: {
      // Síntesis directa — sin archivo de audio externo
      url:         '',
      useSynth:    true,
      synthFn:     'synthScoreTick',
      volume:      0.25,
      category:    'ui',
      maxDuration: 80,
      throttleMs:  16,
    },
    scoreFinale: {
      // Síntesis directa — variante elegida por rango de puntaje
      url:         '',
      useSynth:    true,
      synthFn:     'synthScoreFinale',
      volume:      0.85,
      category:    'feedback',
      maxDuration: 600,
    },
    guardianAmbient: {
      // Sin URL externa — sintetizado localmente para evitar CORS
      // opengameart.org no envía Access-Control-Allow-Origin
      url:         '',
      useSynth:    true,
      synthFn:     'synthGuardianAmbient',
      volume:      0.08,
      category:    'ambient',
      loop:        true,
      maxDuration: null,
    },
  },
};

// Multiplicadores por categoría (aplicados sobre el GainNode de categoría)
window.CATEGORY_MULTIPLIERS = {
  feedback: 1.0,
  reward:   1.0,
  epic:     1.1,   // Fanfarria ligeramente más fuerte — momento de gloria
  ui:       0.40,  // Click muy suave, casi subliminal
  ambient:  0.15,  // Guardián: apenas perceptible, no distrae
};
