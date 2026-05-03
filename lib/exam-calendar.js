// FILE: lib/exam-calendar.js
// Módulo G — Cuenta regresiva al examen ICFES y ajuste de intensidad de estudio.
// Depende de: supabase (global)

window.ExamCalendar = (() => {
  'use strict';

  // Fechas ICFES típicas (se usan como sugerencia si el estudiante no ha ingresado la suya)
  const DEFAULT_DATES = {
    '2026-1': '2026-08-23',
    '2026-2': '2026-11-08',
    '2027-1': '2027-08-22',
  };

  // Intensidad de estudio según días restantes
  const INTENSITY_LEVELS = [
    { maxDays: 30,  label: '🔥 Modo Examen',  color: '#EF4444', bg: 'rgba(239,68,68,.12)',   tip: 'Simula condiciones reales, repasa temas críticos todos los días.' },
    { maxDays: 90,  label: '⚡ Intensivo',     color: '#F59E0B', bg: 'rgba(245,158,11,.12)',  tip: 'Sesiones diarias de 20+ preguntas enfocadas en tus áreas débiles.' },
    { maxDays: 180, label: '📚 Constante',     color: '#3B82F6', bg: 'rgba(59,130,246,.12)',  tip: 'Mantén el ritmo — 10 preguntas diarias es suficiente por ahora.' },
    { maxDays: Infinity, label: '🌱 Temprano', color: '#10B981', bg: 'rgba(16,185,129,.12)', tip: 'Tienes tiempo, construye bases sólidas sin presión.' },
  ];

  function _getIntensity(daysLeft) {
    return INTENSITY_LEVELS.find(l => daysLeft <= l.maxDays);
  }

  function _nextDefaultDate() {
    const today = new Date();
    for (const [, dateStr] of Object.entries(DEFAULT_DATES)) {
      if (new Date(dateStr) > today) return dateStr;
    }
    return null;
  }

  // ── API pública ───────────────────────────────────────────────

  async function getExamData(studentId) {
    const { data } = await supabase
      .from('exam_calendar')
      .select('exam_date, exam_period')
      .eq('student_id', studentId)
      .maybeSingle();
    return data ?? null;
  }

  function getDaysRemaining(examDateStr) {
    if (!examDateStr) return null;
    const exam  = new Date(examDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    exam.setHours(0, 0, 0, 0);
    return Math.ceil((exam - today) / 86400000);
  }

  function widgetHTML(examData, studentId) {
    if (!examData) {
      const suggestion = _nextDefaultDate();
      return `
        <div class="ec-widget ec-widget--empty">
          <div class="ec-icon">📅</div>
          <div class="ec-body">
            <p class="ec-title">¿Cuándo es tu ICFES?</p>
            <p class="ec-sub">Registra la fecha para que AURA ajuste tu plan automáticamente.</p>
            ${suggestion ? `<p class="ec-hint">Próxima convocatoria estimada: ${_formatDate(suggestion)}</p>` : ''}
          </div>
          <button class="btn btn--primary btn--sm" onclick="ExamCalendar.openDatePicker('${studentId}')">
            Agregar fecha
          </button>
        </div>`;
    }

    const days      = getDaysRemaining(examData.exam_date);
    const past      = days !== null && days < 0;
    const intensity = days !== null && !past ? _getIntensity(days) : null;

    if (past) {
      return `
        <div class="ec-widget">
          <div class="ec-icon">🎓</div>
          <div class="ec-body">
            <p class="ec-title">Tu ICFES ya pasó</p>
            <p class="ec-sub">${_formatDate(examData.exam_date)} · ¡Esperamos que te haya ido genial!</p>
          </div>
          <button class="btn btn--ghost btn--sm" onclick="ExamCalendar.openDatePicker('${studentId}')">
            Actualizar fecha
          </button>
        </div>`;
    }

    const pct = Math.max(0, Math.min(100, Math.round((1 - days / 365) * 100)));

    return `
      <div class="ec-widget" style="border-color:${intensity.color};background:${intensity.bg}">
        <div class="ec-countdown">
          <span class="ec-days" style="color:${intensity.color}">${days}</span>
          <span class="ec-days-label">días</span>
        </div>
        <div class="ec-body" style="flex:1">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <p class="ec-title" style="margin:0">${intensity.label}</p>
            <span class="ec-period">${examData.exam_period ?? ''}</span>
          </div>
          <p class="ec-sub">${_formatDate(examData.exam_date)}</p>
          <p class="ec-tip">${intensity.tip}</p>
          <div class="ec-bar">
            <div class="ec-bar__fill" style="width:${pct}%;background:${intensity.color}"></div>
          </div>
        </div>
        <button class="ec-edit-btn" title="Cambiar fecha" onclick="ExamCalendar.openDatePicker('${studentId}')">✎</button>
      </div>`;
  }

  async function renderWidget(studentId, containerId = 'exam-calendar-widget') {
    const container = document.getElementById(containerId);
    if (!container) return;
    const data = await getExamData(studentId);
    container.innerHTML = widgetHTML(data, studentId);
  }

  function openDatePicker(studentId) {
    document.getElementById('ec-date-modal')?.remove();
    const overlay = document.createElement('div');
    overlay.id = 'ec-date-modal';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center;padding:16px';
    overlay.innerHTML = `
      <div style="background:var(--bg-elevated);border:1px solid var(--border-light);border-radius:var(--radius-xl);padding:var(--space-8) var(--space-6);max-width:380px;width:100%;text-align:center">
        <div style="font-size:2.2rem;margin-bottom:var(--space-3)">📅</div>
        <h2 style="font-size:1.1rem;font-weight:800;margin-bottom:var(--space-2)">Fecha de tu ICFES</h2>
        <p style="color:var(--text-secondary);font-size:.85rem;margin-bottom:var(--space-5)">
          AURA ajustará la intensidad de tu plan según los días que faltan.
        </p>
        <input type="date" id="ec-date-input"
          min="${new Date().toISOString().split('T')[0]}"
          style="width:100%;padding:10px 14px;background:var(--bg-overlay);border:1px solid var(--border-light);border-radius:var(--radius-md);color:var(--text-primary);font-size:.95rem;margin-bottom:var(--space-4);box-sizing:border-box"
        />
        <button onclick="ExamCalendar._saveDate('${studentId}')" class="btn btn--primary" style="width:100%;margin-bottom:var(--space-2)">Guardar</button>
        <button onclick="document.getElementById('ec-date-modal').remove()" style="background:none;border:none;color:var(--text-muted);font-size:.82rem;cursor:pointer">Cancelar</button>
      </div>`;
    document.body.appendChild(overlay);
  }

  ExamCalendar._saveDate = async function(studentId) {
    const val = document.getElementById('ec-date-input')?.value;
    if (!val) return;
    const d      = new Date(val);
    const period = `${d.getFullYear()}-${d.getMonth() < 6 ? '1' : '2'}`;

    await supabase.from('exam_calendar').upsert({
      student_id:  studentId,
      exam_date:   val,
      exam_period: period,
    }, { onConflict: 'student_id' });

    document.getElementById('ec-date-modal')?.remove();
    if (window.showToast) showToast('Fecha guardada', 'AURA ajustará tu plan.', '📅', 'success');

    // Refrescar widget
    await renderWidget(studentId, 'exam-calendar-widget');

    // Completar paso 5 del onboarding si existe
    if (window.Onboarding) Onboarding.completeStep(studentId, 'set_exam_date');
  };

  function _formatDate(dateStr) {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('es-CO', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
  }

  return { getExamData, getDaysRemaining, widgetHTML, renderWidget, openDatePicker };
})();
