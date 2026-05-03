// FILE: lib/onboarding.js
// Módulo E — Onboarding de 5 pasos con XP y barra de progreso.
// Depende de: supabase (global), startSession (global desde app.js)

window.Onboarding = (() => {
  'use strict';

  const STEPS = [
    {
      num:      1,
      id:       'diagnostic',
      icon:     '🧭',
      title:    '¿En qué eres bueno?',
      subtitle: 'Responde 15 preguntas para mapear tu nivel real.',
      duration: '8 min',
      xp:       100,
    },
    {
      num:      2,
      id:       'first_session',
      icon:     '📚',
      title:    'Tu primera sesión de práctica',
      subtitle: 'Completa una sesión de 10 preguntas en cualquier área.',
      duration: '10 min',
      xp:       50,
    },
    {
      num:      3,
      id:       'first_simulacro',
      icon:     '⏱️',
      title:    'Mini-simulacro de combate',
      subtitle: '10 preguntas cronometradas. Como el ICFES real.',
      duration: '15 min',
      xp:       200,
    },
    {
      num:      4,
      id:       'invite_parent',
      icon:     '👨‍👩‍👧',
      title:    'Activa el reporte para tu familia',
      subtitle: 'Comparte el portal con tu padre o madre.',
      duration: '2 min',
      xp:       150,
    },
    {
      num:      5,
      id:       'set_exam_date',
      icon:     '📅',
      title:    'Pon la fecha de tu ICFES',
      subtitle: 'AURA ajustará tu plan automáticamente.',
      duration: '1 min',
      xp:       50,
    },
  ];

  // ── Estado en memoria ─────────────────────────────────────────
  let _status = null; // { step, completed, steps_json }

  // ── API pública ───────────────────────────────────────────────

  async function load(studentId) {
    const { data } = await supabase.rpc('get_onboarding_status', {
      p_student_id: studentId,
    });
    _status = Array.isArray(data) ? data[0] : data;
    return _status;
  }

  async function completeStep(studentId, stepId) {
    const step = STEPS.find(s => s.id === stepId);
    if (!step) return;
    await supabase.rpc('complete_onboarding_step', {
      p_student_id: studentId,
      p_step_id:    stepId,
      p_step_num:   step.num,
      p_xp:         step.xp,
    });
    // Refrescar estado
    await load(studentId);
    // Re-renderizar barra si está en el DOM
    _refreshBar(studentId);
  }

  function isCompleted() {
    return !!_status?.completed;
  }

  /**
   * Renderiza la barra de progreso del onboarding.
   * Se muestra hasta que completed = true.
   */
  async function renderBar(studentId, containerId = 'onboarding-bar') {
    await load(studentId);
    if (_status?.completed) {
      const el = document.getElementById(containerId);
      if (el) el.remove();
      return;
    }
    _refreshBar(studentId, containerId);
  }

  // ── Helpers internos ──────────────────────────────────────────

  function _refreshBar(studentId, containerId = 'onboarding-bar') {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (_status?.completed) { container.remove(); return; }
    container.innerHTML = _barHTML(studentId);
  }

  function _barHTML(studentId) {
    const currentStep = (_status?.step ?? 0);
    const pct = Math.round((currentStep / STEPS.length) * 100);

    const stepsHTML = STEPS.map(s => {
      const done    = (s.num <= currentStep) || !!_status?.steps_json?.[s.id];
      const current = s.num === currentStep + 1;
      return `
        <div class="ob-step ${done ? 'ob-step--done' : current ? 'ob-step--current' : ''}"
             onclick="${current ? `Onboarding._handleStep('${s.id}','${studentId}',this)` : ''}">
          <div class="ob-step__icon">${done ? '✓' : s.icon}</div>
          <div class="ob-step__body">
            <p class="ob-step__title">${s.title}</p>
            <p class="ob-step__sub">${done ? 'Completado ✓' : s.subtitle + ' · ' + s.duration}</p>
          </div>
          ${current ? `<span class="ob-step__xp">+${s.xp} XP</span>` : ''}
        </div>`;
    }).join('');

    return `
      <div class="ob-header">
        <div>
          <p class="ob-title">🚀 Configura tu AURA — ${currentStep}/${STEPS.length} pasos</p>
          <p class="ob-subtitle">Completa estos pasos para desbloquear toda la experiencia.</p>
        </div>
        <button class="ob-dismiss" onclick="document.getElementById('onboarding-bar').style.display='none'" title="Ocultar">✕</button>
      </div>
      <div class="ob-progress">
        <div class="ob-progress__fill" style="width:${pct}%"></div>
      </div>
      <div class="ob-steps">${stepsHTML}</div>`;
  }

  // Maneja el click en el paso actual
  window.Onboarding_handleStep = async function(stepId, studentId, el) {
    switch (stepId) {
      case 'diagnostic':
        await completeStep(studentId, 'diagnostic');
        if (window.startSession) startSession('mixed', null, 15);
        break;
      case 'first_session':
        if (window.startSession) startSession('mixed', null, 10);
        break;
      case 'first_simulacro':
        if (window.startSession) startSession('mixed', null, 10);
        break;
      case 'invite_parent': {
        const url = window.location.origin + '/parent.html';
        navigator.clipboard?.writeText(url).catch(() => {});
        if (window.showToast) showToast('¡Link copiado!', 'Comparte parent.html con tu familia.', '📋', 'success');
        await completeStep(studentId, 'invite_parent');
        break;
      }
      case 'set_exam_date':
        _showExamDatePicker(studentId);
        break;
    }
  };

  // Exponer para onclick inline
  Onboarding._handleStep = window.Onboarding_handleStep;

  function _showExamDatePicker(studentId) {
    document.getElementById('exam-date-modal')?.remove();
    const overlay = document.createElement('div');
    overlay.id = 'exam-date-modal';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;padding:16px';
    overlay.innerHTML = `
      <div style="background:var(--bg-elevated);border:1px solid var(--border-light);border-radius:var(--radius-xl);padding:var(--space-8) var(--space-6);max-width:380px;width:100%;text-align:center">
        <div style="font-size:2rem;margin-bottom:var(--space-3)">📅</div>
        <h2 style="font-size:1.1rem;font-weight:800;margin-bottom:var(--space-2)">¿Cuándo es tu ICFES?</h2>
        <p style="color:var(--text-secondary);font-size:.85rem;margin-bottom:var(--space-5)">AURA ajustará la intensidad de tu plan automáticamente.</p>
        <input type="date" id="exam-date-input"
          min="${new Date().toISOString().split('T')[0]}"
          style="width:100%;padding:10px 14px;background:var(--bg-overlay);border:1px solid var(--border-light);border-radius:var(--radius-md);color:var(--text-primary);font-size:.95rem;margin-bottom:var(--space-4);box-sizing:border-box"
        />
        <button onclick="Onboarding._saveExamDate('${studentId}')" class="btn btn--primary" style="width:100%;margin-bottom:var(--space-2)">Guardar fecha</button>
        <button onclick="document.getElementById('exam-date-modal').remove()" style="background:none;border:none;color:var(--text-muted);font-size:.82rem;cursor:pointer">Ahora no</button>
      </div>`;
    document.body.appendChild(overlay);
  }

  Onboarding._saveExamDate = async function(studentId) {
    const val = document.getElementById('exam-date-input')?.value;
    if (!val) return;
    const period = new Date(val).getMonth() < 6
      ? `${new Date(val).getFullYear()}-1`
      : `${new Date(val).getFullYear()}-2`;

    await supabase.from('exam_calendar').upsert({
      student_id:  studentId,
      exam_date:   val,
      exam_period: period,
    }, { onConflict: 'student_id' });

    document.getElementById('exam-date-modal')?.remove();
    await completeStep(studentId, 'set_exam_date');
    if (window.showToast) showToast('¡Fecha guardada!', 'AURA ajustará tu plan.', '📅', 'success');
  };

  return { load, completeStep, isCompleted, renderBar, _handleStep: Onboarding._handleStep };
})();
