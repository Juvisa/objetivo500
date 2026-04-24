// FILE: lib/audio-synth.js | Fallback 100% offline — Web Audio API puro
// Usado por audio-engine.js cuando fetch() falla o no hay URL configurada

window.AudioSynth = (() => {
  'use strict';

  // Envelope helper: attack → peak → exponential decay
  function _env(gain, ctx, peak, attack, decay) {
    const t = ctx.currentTime;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(peak, t + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
    return t;
  }

  // ── success: sine ascendente 880→1320 Hz, 600ms ──────────────
  function synthSuccess(ctx, out) {
    try {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(out);
      osc.type = 'sine';
      const t = _env(gain, ctx, 0.5, 0.02, 0.55);
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.linearRampToValueAtTime(1320, t + 0.35);
      osc.start(t); osc.stop(t + 0.6);
    } catch (e) { console.warn('[AudioSynth] success:', e); }
  }

  // ── error: sawtooth + lowpass descendente, 400ms ─────────────
  function synthError(ctx, out) {
    try {
      const osc    = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain   = ctx.createGain();
      osc.connect(filter); filter.connect(gain); gain.connect(out);
      osc.type = 'sawtooth';
      filter.type = 'lowpass';
      const t = _env(gain, ctx, 0.35, 0.01, 0.38);
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.linearRampToValueAtTime(110, t + 0.3);
      filter.frequency.setValueAtTime(800, t);
      filter.frequency.linearRampToValueAtTime(180, t + 0.3);
      osc.start(t); osc.stop(t + 0.4);
    } catch (e) { console.warn('[AudioSynth] error:', e); }
  }

  // ── click: sine corto 1200Hz, 60ms ───────────────────────────
  function synthClick(ctx, out) {
    try {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(out);
      osc.type = 'sine';
      const t = ctx.currentTime;
      gain.gain.setValueAtTime(0.28, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.055);
      osc.frequency.setValueAtTime(1200, t);
      osc.start(t); osc.stop(t + 0.06);
    } catch (e) { console.warn('[AudioSynth] click:', e); }
  }

  // ── powerUp: 3 osciladores escalonados 440→660→880 Hz ────────
  function synthPowerUp(ctx, out) {
    try {
      [440, 660, 880].forEach((freq, i) => {
        const delay = i * 0.22;
        const osc   = ctx.createOscillator();
        const gain  = ctx.createGain();
        osc.connect(gain); gain.connect(out);
        osc.type = 'sine';
        const t = ctx.currentTime + delay;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.3, t + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.38);
        osc.frequency.setValueAtTime(freq * 0.8, t);
        osc.frequency.linearRampToValueAtTime(freq, t + 0.12);
        osc.start(t); osc.stop(t + 0.4);
      });
    } catch (e) { console.warn('[AudioSynth] powerUp:', e); }
  }

  // ── levelUp: fanfarria C5-E5-G5-C6-E6 con chorus, 2500ms ────
  function synthLevelUp(ctx, out) {
    try {
      // C5=523, E5=659, G5=784, C6=1047, E6=1319
      [523, 659, 784, 1047, 1319].forEach((freq, i) => {
        const delay = i * 0.32;
        // Dos osciladores detuned para efecto chorus
        [-1.5, 1.5].forEach(detune => {
          const osc  = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain); gain.connect(out);
          osc.type = 'sine';
          const t = ctx.currentTime + delay;
          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.22, t + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.52);
          osc.frequency.setValueAtTime(freq + detune, t);
          osc.start(t); osc.stop(t + 0.55);
        });
      });
    } catch (e) { console.warn('[AudioSynth] levelUp:', e); }
  }

  // ── streak: sine ascendente, tono sube con pitch ─────────────
  function synthStreak(ctx, out, pitch = 1.0) {
    try {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(out);
      osc.type = 'sine';
      const base = 660 * pitch;
      const t = _env(gain, ctx, 0.38, 0.05, 0.7);
      osc.frequency.setValueAtTime(base, t);
      osc.frequency.linearRampToValueAtTime(base * 1.5, t + 0.5);
      osc.start(t); osc.stop(t + 0.8);
    } catch (e) { console.warn('[AudioSynth] streak:', e); }
  }

  // ── dullThud: golpe sordo grave para pérdida de energía ──────
  // Dos osciladores de baja frecuencia: 80Hz + 55Hz, 350ms
  function synthDullThud(ctx, out) {
    try {
      [[80, 0.30], [55, 0.18]].forEach(([freq, peak]) => {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(out);
        osc.type = 'sine';
        const t = ctx.currentTime;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(peak, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.30);
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.linearRampToValueAtTime(freq * 0.6, t + 0.28);
        osc.start(t); osc.stop(t + 0.32);
      });
    } catch (e) { console.warn('[AudioSynth] dullThud:', e); }
  }

  // ── scoreTick: sine subliminal, pitch progresivo 880→1320Hz ──
  // progress 0.0→1.0 mapea a 880Hz→1320Hz (ratio 1.5×)
  // Envelope: attack 2ms | decay 60ms | release 15ms | total < 80ms
  function synthScoreTick(ctx, out, progress = 0) {
    try {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(out);
      osc.type = 'sine';
      const t    = ctx.currentTime;
      const freq = 880 + (440 * Math.max(0, Math.min(1, progress)));
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.25, t + 0.002);         // attack 2ms
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.062);   // decay 60ms
      gain.gain.linearRampToValueAtTime(0.0001, t + 0.077);       // release 15ms
      osc.frequency.setValueAtTime(freq, t);
      osc.start(t); osc.stop(t + 0.080);
    } catch (e) { console.warn('[AudioSynth] scoreTick:', e); }
  }

  // ── scoreFinale: consolidación al llegar al puntaje final ────
  // variant 'deep_thud'    → sine grave 120→60Hz + waveshaper, 200ms
  // variant 'epic_resolve' → acorde C5+E5+G5 con reverb sintético, 600ms
  // variant 'success_tone' → delegado al engine (no sintetiza aquí)
  function synthScoreFinale(ctx, out, variant) {
    try {
      if (variant === 'deep_thud') {
        const curve = new Float32Array(256);
        for (let i = 0; i < 256; i++) {
          const x = (i * 2) / 256 - 1;
          curve[i] = x < 0 ? -Math.pow(-x, 0.7) : Math.pow(x, 0.7);
        }
        const osc    = ctx.createOscillator();
        const shaper = ctx.createWaveShaper();
        const gain   = ctx.createGain();
        shaper.curve = curve;
        osc.connect(shaper); shaper.connect(gain); gain.connect(out);
        osc.type = 'sine';
        const t = ctx.currentTime;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.55, t + 0.010);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.200);
        osc.frequency.setValueAtTime(120, t);
        osc.frequency.linearRampToValueAtTime(60, t + 0.180);
        osc.start(t); osc.stop(t + 0.220);

      } else if (variant === 'epic_resolve') {
        // Reverb sintético: delay 30ms con feedback 0.3
        const delayNode = ctx.createDelay(0.1);
        const fbGain    = ctx.createGain();
        const wetGain   = ctx.createGain();
        delayNode.delayTime.value = 0.030;
        fbGain.gain.value         = 0.30;
        wetGain.gain.value        = 0.35;
        delayNode.connect(fbGain); fbGain.connect(delayNode);
        delayNode.connect(wetGain); wetGain.connect(out);

        // C5=523 | E5=659 | G5=784
        [523, 659, 784].forEach(freq => {
          const osc  = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(out);        // dry
          gain.connect(delayNode);  // wet
          osc.type = 'sine';
          const t = ctx.currentTime;
          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.28, t + 0.040);   // attack
          gain.gain.setValueAtTime(0.28, t + 0.400);            // sustain
          gain.gain.linearRampToValueAtTime(0.0001, t + 0.600); // fade-out 200ms
          osc.frequency.setValueAtTime(freq, t);
          osc.start(t); osc.stop(t + 0.650);
        });
      }
    } catch (e) { console.warn('[AudioSynth] scoreFinale:', e); }
  }

  return { synthSuccess, synthError, synthClick, synthPowerUp, synthLevelUp, synthStreak, synthDullThud, synthScoreTick, synthScoreFinale };
})();
