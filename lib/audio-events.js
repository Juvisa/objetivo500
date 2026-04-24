// FILE: lib/audio-events.js | Disparadores conectados a eventos del juego
// Depende de: audio-engine.js (AudioEngine, ensureAudioContext)

window.AudioEvents = (() => {
  'use strict';

  // ── Seguridad: nunca romper la app si AudioEngine no está ─────
  async function _boot() {
    if (window.ensureAudioContext) await ensureAudioContext();
  }

  // ── Respuestas ────────────────────────────────────────────────
  // Conectar a: confirmAnswer() en app.js cuando is_correct === true
  async function onAnswerCorrect() {
    await _boot();
    AudioEngine.play('success');
  }

  // Conectar a: confirmAnswer() en app.js cuando is_correct === false
  async function onAnswerWrong() {
    await _boot();
    AudioEngine.play('error');
  }

  // ── Guardián ──────────────────────────────────────────────────
  // Conectar a: cuando el Guardián gana energía (carga de racha, logro, etc.)
  async function onGuardianEnergyGain(amount) {
    await _boot();
    if (amount >= 20) AudioEngine.play('levelUp');
    else              AudioEngine.play('powerUp');
  }

  // Conectar a: subida de rango (rank change en process_answer)
  async function onLevelUp(newRank) {
    await _boot();
    AudioEngine.play('levelUp', {
      onEnd: () => {
        // Notificar al Guardián para animación de celebración
        document.dispatchEvent(new CustomEvent('aura:guardianCelebrate', {
          detail: { rank: newRank },
        }));
      },
    });
  }

  // Conectar a: GuardianWidget.init() — cada vez que el dashboard carga
  // stop() primero para evitar superposición si el widget se re-inicializa
  async function startGuardianAmbient() {
    if (!window.AUDIO_CONFIG?.events?.guardianAmbient?.url) return; // sin URL → no-op limpio
    await _boot();
    AudioEngine.stop('guardianAmbient');  // cancelar instancia previa si existe
    AudioEngine.play('guardianAmbient');
  }

  function stopGuardianAmbient() {
    if (window.AudioEngine) AudioEngine.stop('guardianAmbient');
  }

  // ── UI ────────────────────────────────────────────────────────
  async function onButtonClick() {
    await _boot();
    AudioEngine.play('click');
  }

  // Conectar a: cuando se incrementa la racha diaria
  async function onStreakIncrement(streakDays) {
    await _boot();
    AudioEngine.play('streak', { pitch: 1 + (streakDays * 0.02) });
  }

  // ── Score Count-Up ────────────────────────────────────────────
  // Throttle: un GainNode por instancia de animación (estado local en onScoreTick)
  // _lastTickTime es global al módulo — cubre el caso de dos contadores simultáneos
  // mediante performance.now() que garantiza precisión sub-ms
  let _lastTickTime = 0;

  function _canPlayTick() {
    const now = performance.now();
    if (now - _lastTickTime < 16) return false;  // 16ms = ~60fps máximo
    _lastTickTime = now;
    return true;
  }

  // Retorna cada cuántos puntos debe sonar un tick, según velocidad del conteo
  function calcTickInterval(start, target, durationMs) {
    const totalPoints      = Math.max(1, target - start);
    const framesAvailable  = durationMs / 16;
    const rawInterval      = totalPoints / framesAvailable;
    if (rawInterval <= 1)  return 1;   // lento: tick cada punto
    if (rawInterval <= 5)  return 3;   // medio: tick cada 3 puntos
    if (rawInterval <= 15) return 8;   // rápido: tick cada 8 puntos
    return Math.round(rawInterval / 6); // muy rápido: ~6 ticks/seg
  }

  // Dispara tick sincronizado con el count-up — patrón directo (< 5ms latencia)
  // Síncrono: NO llama _boot(). Si no hay gesto previo → silencio.
  // Razón: llamar _boot() desde el rAF loop lanza init() concurrente que
  // crea 50+ AudioContexts en Android, congela el rAF y rompe la animación.
  function onScoreTick(currentScore, startScore, targetScore) {
    if (!window.AudioEngine?.isInitialized()) return;
    if (window.AudioEngine?.getMuteState()) return;
    if (!_canPlayTick()) return;
    if (navigator.deviceMemory && navigator.deviceMemory < 2) return;
    const ctx        = window.AudioEngine?.getContext();
    const masterGain = window.AudioEngine?.getMasterGain();
    if (!ctx || !masterGain || !window.AudioSynth?.synthScoreTick) return;
    const range    = Math.max(1, targetScore - startScore);
    const progress = Math.max(0, Math.min(1, (currentScore - startScore) / range));
    window.AudioSynth.synthScoreTick(ctx, masterGain, progress);
  }

  // Dispara consolidación cuando el contador llega al valor final
  async function onScoreFinale(finalScore) {
    if (!window.AudioEngine?.isInitialized()) return;
    if (window.AudioEngine?.getMuteState()) return;
    const variant = finalScore >= 450 ? 'epic_resolve'
                  : finalScore >= 350 ? 'success_tone'
                  : 'deep_thud';
    if (variant === 'success_tone') {
      window.AudioEngine.play('success', { volume: 0.9 });
    } else {
      const ctx        = window.AudioEngine?.getContext();
      const masterGain = window.AudioEngine?.getMasterGain();
      if (!ctx || !masterGain || !window.AudioSynth?.synthScoreFinale) return;
      window.AudioSynth.synthScoreFinale(ctx, masterGain, variant);
    }
  }

  // ── Delegación global de click sounds ─────────────────────────
  // Selector: todos los .btn y <button> excepto los que tienen data-no-sound
  // Llamar UNA vez en DOMContentLoaded
  function initClickSounds() {
    // touchstart: primer gesto en iOS/Android — inicializa AudioContext
    // síncronamente antes de cualquier await. Se registra once para no
    // disparar onButtonClick en cada touch (eso lo hace el listener de click).
    document.addEventListener('touchstart', async () => {
      if (window.ensureAudioContext) await ensureAudioContext();
    }, { passive: true, once: true });

    document.addEventListener('click', async (e) => {
      const target = e.target.closest('button, .btn');
      if (!target) return;
      if (target.dataset.noSound !== undefined) return;
      if (target.classList.contains('no-click-sound')) return;
      await onButtonClick();
    }, { passive: true });
  }

  return {
    onAnswerCorrect,
    onAnswerWrong,
    onGuardianEnergyGain,
    onLevelUp,
    startGuardianAmbient,
    stopGuardianAmbient,
    onButtonClick,
    onStreakIncrement,
    initClickSounds,
    onScoreTick,
    onScoreFinale,
    calcTickInterval,
  };
})();
