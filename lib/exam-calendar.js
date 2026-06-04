// FILE: lib/exam-calendar.js
// Módulo G — Cuenta regresiva al examen ICFES y ajuste de intensidad de estudio.
// Depende de: supabase (global)

window.ExamCalendar = (() => {
  'use strict';

  // Fechas oficiales ICFES Saber 11 — actualizar anualmente
  const OFFICIAL_DATES = {
    '2025-1': '2025-08-24',
    '2025-2': '2025-10-26',
    '2026-1': '2026-08-23',
    '2026-2': '2026-10-25',
    '2027-1': '2027-08-22',
  };

  const INTENSITY_LEVELS = [
    { maxDays: 30,       label: '🔥 Modo Examen',  color: '#EF4444', bg: 'rgba(239,68,68,.12)',   tip: 'Simula condiciones reales, repasa temas críticos todos los días.' },
    { maxDays: 90,       label: '⚡ Intensivo',     color: '#F59E0B', bg: 'rgba(245,158,11,.12)',  tip: 'Sesiones diarias de 20+ preguntas enfocadas en tus áreas débiles.' },
    { maxDays: 180,      label: '📚 Constante',     color: '#3B82F6', bg: 'rgba(59,130,246,.12)',  tip: 'Mantén el ritmo — 10 preguntas diarias es suficiente por ahora.' },
    { maxDays: Infinity, label: '🌱 Temprano',      color: '#10B981', bg: 'rgba(16,185,129,.12)', tip: 'Tienes tiempo, construye bases sólidas sin presión.' },
  ];

  function _getIntensity(daysLeft) {
    return INTENSITY_LEVELS.find(l => daysLeft <= l.maxDays);
  }

  function _nextOfficialDate() {
    const today = new Date();
    for (const dateStr of Object.values(OFFICIAL_DATES)) {
      if (new Date(dateStr + 'T12:00:00') > today) return dateStr;
    }
    return '2027-08-22';
  }

  function _formatDate(dateStr) {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('es-CO', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
  }

  function getDaysRemaining(examDateStr) {
    if (!examDateStr) return null;
    const exam  = new Date(examDateStr + 'T12:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.ceil((exam - today) / 86400000);
  }

  // ── Lee la fecha desde profiles.exam_date (userId = auth.uid()) ──
  async function getExamData(userId) {
    if (!userId) return null;
    const { data } = await supabase
      .from('profiles')
      .select('exam_date')
      .eq('user_id', userId)
      .maybeSingle();

    if (data?.exam_date) {
      return { exam_date: data.exam_date, _isDefault: false };
    }
    // Sin fecha guardada — usar la próxima fecha oficial
    return { exam_date: _nextOfficialDate(), _isDefault: true };
  }

  // ── Guarda la fecha en profiles.exam_date ─────────────────────
  async function _saveDate(userId) {
    const val = document.getElementById('ec-date-input')?.value;
    if (!val) return;

    const { error } = await supabase
      .from('profiles')
      .update({ exam_date: val })
      .eq('user_id', userId);

    document.getElementById('ec-date-modal')?.remove();

    if (error) {
      if (window.showToast) showToast('Error', 'No se pudo guardar la fecha.', '❌', 'error');
      return;
    }
    if (window.showToast) showToast('Fecha guardada', 'AURA ajustará tu plan.', '📅', 'success');

    // Refrescar widget sin recargar la página
    await renderWidget(userId, 'exam-calendar-widget');

    // Completar paso de onboarding si aplica
    if (window.Onboarding) Onboarding.completeStep(userId, 'set_exam_date');
  }

  function widgetHTML(examData, userId) {
    if (!examData) return '';

    const days      = getDaysRemaining(examData.exam_date);
    const past      = days !== null && days < 0;
    const intensity = (days !== null && !past) ? _getIntensity(days) : null;

    if (past) {
      return `
        <div class="ec-widget">
          <div class="ec-icon">🎓</div>
          <div class="ec-body">
            <p class="ec-title">Tu ICFES ya pasó</p>
            <p class="ec-sub">${_formatDate(examData.exam_date)} · ¡Esperamos que te haya ido genial!</p>
          </div>
          <button class="btn btn--ghost btn--sm" onclick="ExamCalendar.openDatePicker('${userId}')">
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
            ${examData._isDefault
              ? `<span class="ec-period" style="background:rgba(245,158,11,.15);color:#F59E0B">Fecha estimada ICFES</span>`
              : `<span class="ec-period">Tu fecha</span>`}
          </div>
          <p class="ec-sub">${_formatDate(examData.exam_date)}${examData._isDefault
            ? ` · <a href="#" style="color:var(--text-muted);font-size:.75rem" onclick="ExamCalendar.openDatePicker('${userId}');return false">¿Es tu fecha?</a>`
            : ''}</p>
          <p class="ec-tip">${intensity.tip}</p>
          <div class="ec-bar">
            <div class="ec-bar__fill" style="width:${pct}%;background:${intensity.color}"></div>
          </div>
        </div>
        <button class="ec-edit-btn" title="Cambiar fecha" onclick="ExamCalendar.openDatePicker('${userId}')">✎</button>
      </div>`;
  }

  async function renderWidget(userId, containerId = 'exam-calendar-widget') {
    const container = document.getElementById(containerId);
    if (!container) return;
    const data = await getExamData(userId);
    container.innerHTML = widgetHTML(data, userId);
  }

  function openDatePicker(userId) {
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
        <button onclick="ExamCalendar._saveDate('${userId}')" class="btn btn--primary" style="width:100%;margin-bottom:var(--space-2)">Guardar</button>
        <button onclick="document.getElementById('ec-date-modal').remove()" style="background:none;border:none;color:var(--text-muted);font-size:.82rem;cursor:pointer">Cancelar</button>
      </div>`;
    document.body.appendChild(overlay);
  }

  return { getExamData, getDaysRemaining, widgetHTML, renderWidget, openDatePicker, _saveDate };
})();
