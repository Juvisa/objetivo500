// FILE: lib/audio-engine.js | Motor central de audio — singleton por sesión
// Depende de: audio-config.js (AUDIO_CONFIG, CATEGORY_MULTIPLIERS), audio-synth.js (AudioSynth)

window.AudioEngine = (() => {
  'use strict';

  let _ctx          = null;
  let _masterGain   = null;
  let _initialized  = false;

  // GainNode por categoría → conecta a _masterGain
  const _catGains   = {};

  // AudioBuffer cacheado: eventName → AudioBuffer
  const _bufCache   = new Map();

  // Nodos activos actualmente reproduciendo: eventName → AudioBufferSourceNode
  const _active     = new Map();

  // Prioridad: índice menor = mayor prioridad
  const _PRIORITY = ['levelUp', 'powerUp', 'success', 'error', 'streak', 'dullThud', 'click', 'guardianAmbient'];

  // ── Helpers ────────────────────────────────────────────────────
  function _cfg(name) {
    return window.AUDIO_CONFIG?.events?.[name] ?? null;
  }

  function _catGain(category) {
    return _catGains[category] ?? _masterGain;
  }

  // ── Decodificación ─────────────────────────────────────────────
  async function _decodeBuffer(arrayBuffer) {
    try {
      return await _ctx.decodeAudioData(arrayBuffer);
    } catch (e) {
      console.warn('[AudioEngine] decode:', e);
      return null;
    }
  }

  // ── Carga de un buffer individual ─────────────────────────────
  async function _loadBuffer(name) {
    const cfg = _cfg(name);
    if (!cfg?.url) return false;
    try {
      const resp = await fetch(cfg.url, { cache: 'force-cache' });
      if (!resp.ok) return false;
      const ab  = await resp.arrayBuffer();
      const buf = await _decodeBuffer(ab);
      if (!buf) return false;
      _bufCache.set(name, buf);
      return true;
    } catch {
      return false;
    }
  }

  // ══════════════════════════════════════════════════════════════
  //  INICIALIZACIÓN — llamar solo dentro de un gesto del usuario
  // ══════════════════════════════════════════════════════════════
  async function init() {
    if (_initialized) return { loaded: 0, failed: [] };
    try {
      _ctx = new (window.AudioContext || window.webkitAudioContext)();

      // GainNode master
      _masterGain = _ctx.createGain();
      const savedVol = parseFloat(localStorage.getItem('aura_master_volume') ?? '');
      _masterGain.gain.value = isNaN(savedVol)
        ? (window.AUDIO_CONFIG?.master?.volume ?? 0.7)
        : savedVol;
      _masterGain.connect(_ctx.destination);

      // GainNode por categoría
      const cats = ['feedback', 'reward', 'epic', 'ui', 'ambient'];
      for (const cat of cats) {
        const g = _ctx.createGain();
        g.gain.value = window.CATEGORY_MULTIPLIERS?.[cat] ?? 1.0;
        g.connect(_masterGain);
        _catGains[cat] = g;
      }

      // Restaurar estado mute persisido
      if (localStorage.getItem('aura_audio_muted') === 'true') {
        _masterGain.gain.value = 0;
      }

      // Dispositivos low-end: silenciar ambient y click
      const isMobile = /Mobi|Android/i.test(navigator.userAgent);
      const isLowEnd = navigator.deviceMemory && navigator.deviceMemory < 4;
      if (isMobile || isLowEnd) {
        if (window.AUDIO_CONFIG?.events?.guardianAmbient) {
          window.AUDIO_CONFIG.events.guardianAmbient.volume = 0;
        }
      }

      // Precargar buffers en paralelo (background — no bloquea UI)
      const names   = Object.keys(window.AUDIO_CONFIG?.events ?? {});
      const results = await Promise.allSettled(names.map(n => _loadBuffer(n)));
      const loaded  = results.filter(r => r.status === 'fulfilled' && r.value).length;
      const failed  = names.filter((_, i) =>
        results[i].status !== 'fulfilled' || !results[i].value
      );

      _initialized = true;
      return { loaded, failed };
    } catch (e) {
      console.warn('[AudioEngine] init:', e);
      return { loaded: 0, failed: [] };
    }
  }

  // ── Precarga manual de un evento ──────────────────────────────
  async function preload(name) {
    if (!_ctx) return false;
    return _loadBuffer(name);
  }

  // ── Reproductor sintético de fallback ─────────────────────────
  function _playSynth(name, options = {}) {
    if (!_ctx || !window.AudioSynth) return null;
    const cat  = _cfg(name)?.category ?? 'feedback';
    const dest = _catGain(cat);
    const pitch = options.pitch ?? 1.0;
    try {
      switch (name) {
        case 'success':   AudioSynth.synthSuccess(_ctx, dest); break;
        case 'error':     AudioSynth.synthError(_ctx, dest);   break;
        case 'click':     AudioSynth.synthClick(_ctx, dest);   break;
        case 'powerUp':   AudioSynth.synthPowerUp(_ctx, dest); break;
        case 'levelUp':   AudioSynth.synthLevelUp(_ctx, dest); break;
        case 'streak':    AudioSynth.synthStreak(_ctx, dest, pitch); break;
        case 'dullThud':  AudioSynth.synthDullThud(_ctx, dest); break;
        default:          return null;
      }
      if (typeof options.onEnd === 'function') {
        const cfg = _cfg(name);
        const dur = cfg?.maxDuration ?? 1000;
        setTimeout(options.onEnd, dur);
      }
      return true;
    } catch (e) {
      console.warn('[AudioEngine] synth fallback:', e);
      return null;
    }
  }

  // ── Gestión de prioridad (máx 3 simultáneos) ──────────────────
  function _makeRoomFor(name) {
    if (_active.size < 3) return true;

    const myIdx = _PRIORITY.indexOf(name);
    if (myIdx === -1) return false; // evento desconocido

    // Buscar el sonido activo de menor prioridad (mayor índice)
    let lowestKey = null;
    let highestIdx = -1;
    for (const k of _active.keys()) {
      const idx = _PRIORITY.indexOf(k);
      if (idx > highestIdx) { highestIdx = idx; lowestKey = k; }
    }

    if (lowestKey && myIdx < highestIdx) {
      stop(lowestKey); // desplazar el menos importante
      return true;
    }
    return false; // sin espacio y sin prioridad suficiente
  }

  // ── API: reproducir ───────────────────────────────────────────
  function play(name, options = {}) {
    if (!_initialized || !_ctx) return null;
    if (getMuteState()) return null;

    const cfg = _cfg(name);
    if (!cfg) return null;
    if (!_makeRoomFor(name)) return null;

    try {
      const cat  = cfg.category ?? 'feedback';
      const dest = _catGain(cat);
      const buf  = _bufCache.get(name);

      if (buf) {
        const source = _ctx.createBufferSource();
        const g      = _ctx.createGain();
        source.buffer          = buf;
        source.loop            = cfg.loop ?? false;
        source.playbackRate.value = options.pitch ?? 1.0;
        const targetVol = Math.min(0.9, options.volume ?? cfg.volume ?? 0.7);
        const fadeInSec = cfg.category === 'ambient' ? (cfg.fadeIn ?? 2.0) : 0;
        if (fadeInSec > 0) {
          g.gain.setValueAtTime(0, _ctx.currentTime);
          g.gain.linearRampToValueAtTime(targetVol, _ctx.currentTime + fadeInSec);
        } else {
          g.gain.value = targetVol;
        }
        source.connect(g);
        g.connect(dest);
        source.start();

        // Cortar si supera maxDuration
        let cutHandle = null;
        if (cfg.maxDuration && !cfg.loop) {
          cutHandle = setTimeout(() => {
            try { source.stop(); } catch {}
            _active.delete(name);
          }, cfg.maxDuration);
        }

        source.onended = () => {
          if (cutHandle) clearTimeout(cutHandle);
          _active.delete(name);
          if (typeof options.onEnd === 'function') options.onEnd();
        };

        _active.set(name, source);
        return source;
      }

      // Fallback sintético
      return _playSynth(name, options);

    } catch (e) {
      console.warn('[AudioEngine] play:', e);
      return null;
    }
  }

  // ── API: detener ──────────────────────────────────────────────
  function stop(name) {
    try {
      const src = _active.get(name);
      if (src && typeof src.stop === 'function') src.stop();
    } catch {}
    _active.delete(name);
  }

  function stopAll() {
    for (const name of [..._active.keys()]) stop(name);
  }

  // ── API: volumen y mute ────────────────────────────────────────
  function setMasterVolume(value) {
    const v = Math.max(0, Math.min(0.9, value));
    if (_masterGain) _masterGain.gain.value = getMuteState() ? 0 : v;
    localStorage.setItem('aura_master_volume', String(v));
  }

  function toggleMute() {
    const muted = !getMuteState();
    if (_masterGain) {
      if (muted) {
        _masterGain.gain.value = 0;
      } else {
        const saved = parseFloat(localStorage.getItem('aura_master_volume') ?? '');
        _masterGain.gain.value = isNaN(saved)
          ? (window.AUDIO_CONFIG?.master?.volume ?? 0.7)
          : saved;
      }
    }
    localStorage.setItem('aura_audio_muted', String(muted));
    return muted;
  }

  function getMuteState() {
    return localStorage.getItem('aura_audio_muted') === 'true';
  }

  function setEventVolume(name, value) {
    const cfg = _cfg(name);
    if (cfg) cfg.volume = Math.max(0, Math.min(0.9, value));
  }

  // ── Getters ───────────────────────────────────────────────────
  function getContext()     { return _ctx; }
  function getMasterGain()  { return _masterGain; }
  function isInitialized()  { return _initialized; }

  return {
    init, preload, play, stop, stopAll,
    setMasterVolume, toggleMute, getMuteState, setEventVolume,
    getContext, getMasterGain, isInitialized,
  };
})();

// ── ensureAudioContext — llamar en CADA evento del usuario ─────
// iOS/Android fix: _ctx se crea síncronamente al inicio de init() antes del
// primer await interno. No esperamos la precarga completa para llamar resume()
// porque al volver del await de fetch ya salimos del gesto de usuario y Safari
// rechaza el resume(). Patrón: fire init → resume inmediato → await precarga.
window.ensureAudioContext = async function () {
  if (!window.AudioEngine.isInitialized()) {
    const initPromise = window.AudioEngine.init(); // _ctx creado síncronamente aquí
    const ctx = window.AudioEngine.getContext();
    if (ctx?.state === 'suspended') await ctx.resume(); // dentro del gesto ✓
    await initPromise; // precarga en background — no bloquea audio
    return;
  }
  const ctx = window.AudioEngine.getContext();
  if (ctx?.state === 'suspended') await ctx.resume();
};

// ── toggleAudioMute — handler inline para el botón del header ──
window.toggleAudioMute = async function (btn) {
  await ensureAudioContext();
  const muted = AudioEngine.toggleMute();
  if (btn) {
    btn.setAttribute('aria-pressed', muted.toString());
    const icon = btn.querySelector('.audio-toggle__icon');
    if (icon) icon.textContent = muted ? '🔇' : '🔊';
    btn.title = muted ? 'Activar sonido' : 'Silenciar efectos';
  }
};
