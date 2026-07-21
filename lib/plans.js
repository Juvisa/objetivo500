// FILE: lib/plans.js
// Módulo C — Planes, límites y paywall.
// Depende de: supabase (global), showToast (global)

window.Plans = (() => {
  'use strict';

  // ── BYPASS TEMPORAL ────────────────────────────────────────────
  // Cambiar a false para reactivar restricciones en producción.
  const BYPASS_ALL_LIMITS = true;

  const PLAN_LIMITS = {
    free: {
      questions_per_day: 10,
      simulacros:        false,
      battles:           false,
      score_prediction:  false,
      certificates:      false,
    },
    elite: {
      questions_per_day: Infinity,
      simulacros:        true,
      battles:           true,
      score_prediction:  true,
      certificates:      true,
    },
    familia: {
      questions_per_day: Infinity,
      simulacros:        true,
      battles:           true,
      score_prediction:  true,
      certificates:      true,
      family_comparison: true,
    },
  };

  const PAYWALL_COPY = {
    answer_question: {
      icon:  '🌙',
      title: 'Tu Guardián descansa por hoy',
      body:  'Alcanzaste el límite de 10 preguntas del plan gratuito. Vuelve mañana o desbloquea acceso ilimitado.',
      cta:   'Continuar sin límites — $29.900/mes',
    },
    view_simulacro: {
      icon:  '⚡',
      title: 'Los simulacros son del plan Élite',
      body:  'Entrena con exámenes completos tipo ICFES y mide tu puntaje real.',
      cta:   'Ver planes',
    },
    start_battle: {
      icon:  '⚔️',
      title: 'Las batallas son del plan Élite',
      body:  'Reta a otros estudiantes y roba su XP. Solo los Élite pueden competir.',
      cta:   'Desbloquear batallas',
    },
    get_certificate: {
      icon:  '🏆',
      title: 'Los certificados son del plan Élite',
      body:  'Descarga tu certificado de entrenamiento y compártelo.',
      cta:   'Ver planes',
    },
  };

  // ── Estado en memoria ─────────────────────────────────────────
  let _cachedPlan = null;
  let _cacheTime  = 0;
  const CACHE_TTL = 5 * 60 * 1000; // 5 min

  // ── API pública ───────────────────────────────────────────────

  /**
   * Devuelve el slug del plan activo del estudiante ('free'|'elite'|'familia').
   * Cachea 5 minutos para no hacer una query por pregunta.
   */
  async function getActivePlan(studentId) {
    if (BYPASS_ALL_LIMITS) return 'elite';
    if (_cachedPlan && Date.now() - _cacheTime < CACHE_TTL) return _cachedPlan;
    const { data } = await supabase.rpc('get_student_plan', { p_student_id: studentId });
    _cachedPlan = data ?? 'free';
    _cacheTime  = Date.now();
    return _cachedPlan;
  }

  /** Invalida el caché (llamar tras activar suscripción). */
  function invalidateCache() { _cachedPlan = null; }

  /**
   * Verifica si el estudiante puede realizar una acción.
   * Para 'answer_question' llama al RPC que también incrementa el contador.
   * @returns {Promise<boolean>}
   */
  async function canDo(studentId, action) {
    if (BYPASS_ALL_LIMITS) return true;
    const plan   = await getActivePlan(studentId);
    const limits = PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;

    if (action === 'answer_question') {
      if (limits.questions_per_day === Infinity) return true;
      // El RPC incrementa Y verifica en una transacción atómica
      const { data: allowed } = await supabase.rpc('increment_daily_usage', {
        p_student_id: studentId,
      });
      return allowed === true;
    }

    const featureMap = {
      view_simulacro:      'simulacros',
      start_battle:        'battles',
      view_score_prediction: 'score_prediction',
      get_certificate:     'certificates',
    };
    const feature = featureMap[action];
    return feature ? !!limits[feature] : true;
  }

  /**
   * Muestra el modal de paywall para una acción bloqueada.
   */
  function showPaywall(action) {
    if (BYPASS_ALL_LIMITS) return;
    const copy = PAYWALL_COPY[action] ?? {
      icon:  '🔒',
      title: 'Feature del plan Élite',
      body:  'Desbloquea todo el potencial de AURA.',
      cta:   'Ver planes',
    };

    // Eliminar modal previo
    document.getElementById('paywall-modal')?.remove();

    const overlay = document.createElement('div');
    overlay.id = 'paywall-modal';
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:10000;
      background:rgba(0,0,0,.7);
      display:flex;align-items:center;justify-content:center;
      padding:var(--space-4);
      animation:fadeIn .2s ease both;
    `;

    overlay.innerHTML = `
      <div style="
        background:var(--bg-elevated);
        border:1px solid var(--border-light);
        border-radius:var(--radius-xl);
        padding:var(--space-8) var(--space-6);
        max-width:420px;width:100%;
        text-align:center;
        animation:cardIn .25s ease both;
        box-shadow:var(--shadow-xl);
      ">
        <div style="font-size:2.5rem;margin-bottom:var(--space-4)">${copy.icon}</div>
        <h2 style="font-size:1.25rem;font-weight:800;margin-bottom:var(--space-3);color:var(--text-primary)">${copy.title}</h2>
        <p style="color:var(--text-secondary);font-size:.9rem;line-height:1.6;margin-bottom:var(--space-6)">${copy.body}</p>
        <button
          onclick="document.getElementById('paywall-modal').remove();window.Checkout?.open('elite')"
          style="
            display:block;width:100%;
            background:var(--gradient-brand);
            color:#fff;font-weight:700;font-size:.95rem;
            padding:var(--space-3) var(--space-6);
            border-radius:var(--radius-lg);
            border:none;cursor:pointer;font-family:inherit;
            margin-bottom:var(--space-3);
          "
        >${copy.cta}</button>
        <button
          onclick="document.getElementById('paywall-modal').remove()"
          style="background:none;border:none;color:var(--text-muted);font-size:.85rem;cursor:pointer"
        >Ahora no</button>
      </div>`;

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });

    document.body.appendChild(overlay);
  }

  return { getActivePlan, invalidateCache, canDo, showPaywall };
})();
