// FILE: lib/audio-config.js | Configuración de eventos sonoros
// Todos los valores de volumen dentro de 0.0–0.9 (evita distorsión)

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
    guardianAmbient: {
      // Fuente: OpenGameArt.org "Scifi City - Ambient Loop" | Licencia: CC0
      // URL: opengameart.org/content/scifi-city-ambient-loop
      // OGG 161 KB — Chrome/Firefox/Edge; Safari usa synth-fallback (silencioso, ok)
      url:         'https://opengameart.org/sites/default/files/busy_cyberworld.ogg',
      urlOgg:      'https://opengameart.org/sites/default/files/busy_cyberworld.ogg',
      volume:      0.12,   // 12% — la regla de no-intrusión: máx 15%
      category:    'ambient',
      loop:        true,
      fadeIn:      2.0,    // segundos de fade-in suave al iniciar
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
