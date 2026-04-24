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

  // ── Delegación global de click sounds ─────────────────────────
  // Selector: todos los .btn y <button> excepto los que tienen data-no-sound
  // Llamar UNA vez en DOMContentLoaded
  function initClickSounds() {
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
  };
})();
