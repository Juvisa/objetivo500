// guardian.js — Guardianes del Saber
// Lógica central del sistema de mascotas virtuales de Objetivo 500.
// Requiere: supabase (global, inicializado en el HTML antes de este script).

'use strict';

window.Guardian = (() => {

  // ── Configuración de los 4 guardianes ──────────────────────────
  const GUARDIANES_CONFIG = {
    dragon: {
      id: 'dragon',
      nombre: 'Dragón de Obsidiana',
      elemento: 'Fuego · Fuerza',
      descripcion: 'Feroz y determinado. Convierte cada error en combustible.',
      colorAcento: '#ff4500',
      colorPrimario: '#1a0a0a',
      mensajeEvolucion: ['¡El huevo tiembla con fuerza!', '¡Una llama feroz despierta!', '¡El dragón extiende sus alas!', '¡El Dragón de Obsidiana alcanza su máximo poder!'],
    },
    grifo: {
      id: 'grifo',
      nombre: 'Grifo Dorado',
      elemento: 'Aire · Agilidad',
      descripcion: 'Veloz e intuitivo. Domina las preguntas con precisión de águila.',
      colorAcento: '#ffd700',
      colorPrimario: '#1a1400',
      mensajeEvolucion: ['¡El huevo brilla con luz dorada!', '¡Un pájaro-felino da sus primeros pasos!', '¡El Grifo surca el cielo!', '¡El Grifo Dorado reina sobre todos!'],
    },
    unicornio: {
      id: 'unicornio',
      nombre: 'Unicornio Estelar',
      elemento: 'Magia · Claridad',
      descripcion: 'Sereno y brillante. Ilumina los conceptos más complejos.',
      colorAcento: '#c084fc',
      colorPrimario: '#0d0020',
      mensajeEvolucion: ['¡El huevo irradia magia pura!', '¡Una criatura mágica llega al mundo!', '¡El Unicornio galopa entre estrellas!', '¡El Unicornio Estelar ilumina el cosmos!'],
    },
    fenix: {
      id: 'fenix',
      nombre: 'Fénix de Cristal',
      elemento: 'Renacimiento · Persistencia',
      descripcion: 'Invencible. Cada caída es el inicio de un vuelo más alto.',
      colorAcento: '#38bdf8',
      colorPrimario: '#000d1a',
      mensajeEvolucion: ['¡El huevo de cristal pulsa con vida!', '¡Un ave de luz emerge!', '¡El Fénix despliega sus alas de cristal!', '¡El Fénix de Cristal renace en su forma legendaria!'],
    },
  };

  // ── Tabla de evoluciones ────────────────────────────────────────
  const EVOLUCIONES = [
    { nivel: 1, nombre: 'Huevo',      xp: 0,    prefijo: 'huevo' },
    { nivel: 2, nombre: 'Bebé',       xp: 500,  prefijo: 'bebe' },
    { nivel: 3, nombre: 'Joven',      xp: 1500, prefijo: 'joven' },
    { nivel: 4, nombre: 'Adulto',     xp: 3000, prefijo: 'adulto' },
    { nivel: 5, nombre: 'Legendario', xp: 6000, prefijo: 'legendario' },
  ];

  // ── Helpers ─────────────────────────────────────────────────────

  /**
   * Calcula el nivel de evolución según el XP acumulado.
   * @param {number} xp
   * @returns {number} 1–5
   */
  function calcularNivel(xp) {
    let nivel = 1;
    for (const e of EVOLUCIONES) {
      if (xp >= e.xp) nivel = e.nivel;
    }
    return nivel;
  }

  /**
   * Devuelve la ruta de imagen del guardián según tipo y nivel de evolución.
   * @param {string} tipo - 'dragon' | 'grifo' | 'unicornio' | 'fenix'
   * @param {number} nivel - 1–5
   * @returns {string}
   */
  function getImagen(tipo, nivel) {
    const evo = EVOLUCIONES.find(e => e.nivel === nivel) ?? EVOLUCIONES[0];
    return `./assets/guardians/${evo.prefijo}_${tipo}.svg`;
  }

  /**
   * Devuelve la configuración de un guardián por tipo.
   * @param {string} tipo
   * @returns {Object}
   */
  function getConfig(tipo) {
    return GUARDIANES_CONFIG[tipo] ?? GUARDIANES_CONFIG.dragon;
  }

  /**
   * Calcula la energía restante aplicando decaimiento por inactividad.
   * Cada 24h sin ≥5 respuestas correctas: -30 de energía.
   * @param {string} ultima_alimentacion - ISO timestamp
   * @param {number} nivel_energia - energía actual
   * @returns {number} nueva energía (0–100)
   */
  function calcularDecaimiento(ultima_alimentacion, nivel_energia) {
    const horasSinEstudio = (Date.now() - new Date(ultima_alimentacion)) / 3600000;
    const ciclosDecaimiento = Math.floor(horasSinEstudio / 24);
    return Math.max(0, nivel_energia - (ciclosDecaimiento * 30));
  }

  /**
   * Determina el estado según el nivel de energía.
   * @param {number} energia
   * @returns {'activo'|'critico'|'petrificado'}
   */
  function calcularEstado(energia) {
    if (energia <= 0)  return 'petrificado';
    if (energia <= 25) return 'critico';
    return 'activo';
  }

  // ── CRUD Supabase ───────────────────────────────────────────────

  /**
   * Obtiene el guardián del usuario desde la BD.
   * @param {string} userId - UUID del usuario autenticado
   * @returns {Promise<Object|null>}
   */
  async function get(userId) {
    const { data, error } = await supabase
      .from('estado_guardian')
      .select('*')
      .eq('id_usuario', userId)
      .maybeSingle();
    if (error) { console.error('[Guardian] get:', error.message); return null; }
    return data;
  }

  /**
   * Crea el guardián inicial para un usuario nuevo.
   * @param {string} userId
   * @param {string} tipo - tipo de guardián elegido
   * @returns {Promise<Object|null>}
   */
  async function crear(userId, tipo) {
    const { data, error } = await supabase
      .from('estado_guardian')
      .insert({
        id_usuario:          userId,
        tipo_guardian:       tipo,
        nivel_energia:       100,
        xp_total:            0,
        nivel_evolucion:     1,
        estado:              'activo',
        ultima_alimentacion: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) { console.error('[Guardian] crear:', error.message); return null; }
    return data;
  }

  /**
   * Actualiza campos del guardián en la BD.
   * @param {string} userId
   * @param {Object} updates
   * @returns {Promise<Object|null>}
   */
  async function _update(userId, updates) {
    const { data, error } = await supabase
      .from('estado_guardian')
      .update(updates)
      .eq('id_usuario', userId)
      .select()
      .single();
    if (error) { console.error('[Guardian] update:', error.message); return null; }
    return data;
  }

  // ── Lógica de negocio ───────────────────────────────────────────

  /**
   * Aplica el decaimiento de energía por inactividad.
   * Se llama al cargar la app para sincronizar el estado real.
   * @param {Object} g - datos del guardián
   * @returns {Promise<Object>} guardián actualizado
   */
  async function aplicarDecaimiento(g) {
    const nuevaEnergia = calcularDecaimiento(g.ultima_alimentacion, g.nivel_energia);
    if (nuevaEnergia === g.nivel_energia) return g;

    const nuevoEstado = calcularEstado(nuevaEnergia);
    const updated = await _update(g.id_usuario, {
      nivel_energia: nuevaEnergia,
      estado:        nuevoEstado,
    });
    return updated ?? { ...g, nivel_energia: nuevaEnergia, estado: nuevoEstado };
  }

  /**
   * Alimenta al guardián tras completar una sesión de preguntas.
   * @param {string} userId
   * @param {Object} sesion
   * @param {number} sesion.correctas - total de respuestas correctas
   * @param {number} sesion.rachaConsecutiva - racha máxima de correctas en orden
   * @returns {Promise<{guardian, nivelSubio, nivelAntes, nivelAhora}|null>}
   */
  async function alimentar(userId, { correctas, rachaConsecutiva = 0 }) {
    const g = await get(userId);
    if (!g || g.estado === 'petrificado') return null;

    let energiaGanada = correctas * 8;
    // Bonus por racha de 10+ respuestas correctas consecutivas
    if (rachaConsecutiva >= 10) energiaGanada += 20;

    const nuevaEnergia  = Math.min(100, g.nivel_energia + energiaGanada);
    const xpGanada      = correctas * 15;
    const nuevaXP       = g.xp_total + xpGanada;
    const nivelAntes    = calcularNivel(g.xp_total);
    const nivelAhora    = calcularNivel(nuevaXP);

    const updates = {
      nivel_energia:   nuevaEnergia,
      xp_total:        nuevaXP,
      nivel_evolucion: nivelAhora,
      estado:          calcularEstado(nuevaEnergia),
    };
    // ultima_alimentacion solo se actualiza si la sesión tuvo ≥5 correctas
    if (correctas >= 5) {
      updates.ultima_alimentacion = new Date().toISOString();
    }

    const [updated] = await Promise.all([
      _update(userId, updates),
      supabase.from('historial_alimentacion').insert({
        id_usuario:         userId,
        energia_ganada:     energiaGanada,
        xp_ganada:          xpGanada,
        preguntas_correctas: correctas,
      }),
    ]);

    return {
      guardian:   updated ?? { ...g, ...updates },
      nivelSubio: nivelAhora > nivelAntes,
      nivelAntes,
      nivelAhora,
    };
  }

  /**
   * Revive al guardián petrificado con penalización del 50% de XP.
   * Solo se ejecuta si rachaActual >= 15 (verificado en reto-resurreccion).
   * @param {string} userId
   * @param {number} rachaActual - racha de correctas del reto (debe ser ≥15)
   * @returns {Promise<{ok, guardian?, error?}>}
   */
  async function revivir(userId, rachaActual) {
    if (rachaActual < 15) return { ok: false, error: 'Se requieren 15 respuestas correctas seguidas.' };

    const g = await get(userId);
    if (!g) return { ok: false, error: 'Guardián no encontrado.' };

    const nuevaXP = Math.floor(g.xp_total * 0.5);
    const updated = await _update(userId, {
      xp_total:            nuevaXP,
      nivel_energia:       50,
      nivel_evolucion:     calcularNivel(nuevaXP),
      estado:              'activo',
      ultima_alimentacion: new Date().toISOString(),
    });

    return { ok: true, guardian: updated };
  }

  // ── Animación de evolución ──────────────────────────────────────

  /**
   * Muestra el modal de evolución cuando el guardián sube de nivel.
   * @param {Object} g - datos del guardián tras evolucionar
   * @param {number} nivelAntes
   * @param {number} nivelAhora
   */
  function mostrarEvolucion(g, nivelAntes, nivelAhora) {
    const config = getConfig(g.tipo_guardian);
    const evo    = EVOLUCIONES.find(e => e.nivel === nivelAhora) ?? EVOLUCIONES[0];
    const idx    = nivelAhora - 2; // índice del mensaje (nivel 2 = índice 0)
    const msg    = config.mensajeEvolucion[idx] ?? `¡${config.nombre} ha evolucionado!`;
    const imgSrc = getImagen(g.tipo_guardian, nivelAhora);

    // Eliminar modal previo si existe
    document.getElementById('guardian-evo-modal')?.remove();

    const overlay = document.createElement('div');
    overlay.id = 'guardian-evo-modal';
    overlay.className = 'level-up-overlay';
    overlay.style.cssText = 'z-index:500;background:rgba(0,0,0,.85)';
    overlay.innerHTML = `
      <div class="guardian-evo-modal" style="--acento:${config.colorAcento}">
        <div class="guardian-evo-sparkles" aria-hidden="true">✨ ✨ ✨</div>
        <img
          src="${imgSrc}"
          alt="${config.nombre} — etapa ${evo.nombre}"
          class="guardian-evo-img"
          onerror="this.style.display='none'"
        />
        <h2 class="guardian-evo-titulo">¡Evolución!</h2>
        <p class="guardian-evo-etapa">${evo.nombre}</p>
        <p class="guardian-evo-msg">${msg}</p>
        <button
          class="btn btn--primary"
          style="margin-top:var(--space-6);background:${config.colorAcento};border-color:${config.colorAcento};color:#000"
          onclick="document.getElementById('guardian-evo-modal').remove()"
          aria-label="Cerrar modal de evolución"
        >
          ¡Increíble! →
        </button>
      </div>`;
    document.body.appendChild(overlay);
  }

  // ── API pública ─────────────────────────────────────────────────
  return {
    get,
    crear,
    alimentar,
    aplicarDecaimiento,
    revivir,
    mostrarEvolucion,
    calcularNivel,
    calcularDecaimiento,
    calcularEstado,
    getImagen,
    getConfig,
    EVOLUCIONES,
    GUARDIANES_CONFIG,
  };

})();
