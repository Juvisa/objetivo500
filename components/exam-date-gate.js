// FILE: components/exam-date-gate.js
// Modal imperativo de fecha de examen.
// Muestra una sola vez por sesión de navegación (sessionStorage guard).
// Depende de: supabase (global), ExamCalendar (global)

window.ExamDateGate = (() => {
  'use strict';

  const SESSION_KEY = 'aura_exam_date_checked';

  // Fechas oficiales ICFES (en sync con exam-calendar.js)
  const OFFICIAL_DATES = [
    { label: '2025 — I',  date: '2025-08-24', display: '24 Ago 2025' },
    { label: '2025 — II', date: '2025-10-26', display: '26 Oct 2025' },
    { label: '2026 — I',  date: '2026-08-23', display: '23 Ago 2026' },
    { label: '2026 — II', date: '2026-10-25', display: '25 Oct 2026' },
  ];

  async function check(userId, isNewUser = false) {
    if (sessionStorage.getItem(SESSION_KEY) === 'true') return;

    // Solo mostrar si no tiene fecha guardada
    const { data: profile } = await supabase
      .from('profiles').select('exam_date').eq('user_id', userId).maybeSingle();

    sessionStorage.setItem(SESSION_KEY, 'true');

    if (profile?.exam_date) return; // ya tiene fecha → no molestar

    await _showModal(userId, isNewUser);
  }

  function _showModal(userId, isNewUser) {
    return new Promise((resolve) => {
      document.getElementById('exam-date-gate')?.remove();

      const title   = isNewUser ? '¡Bienvenido a +500 AURA!' : 'Activa tu contador intensivo';
      const message = isNewUser
        ? 'Selecciona la fecha de tu examen ICFES para personalizar tu plan de estudio.'
        : 'Aún no has definido tu meta. Elige una fecha para activar el plan adaptado.';

      const skipBtn = isNewUser
        ? '' // usuarios nuevos no pueden cerrar sin elegir
        : `<button class="exam-gate__skip" id="exam-gate-skip">Recordármelo después</button>`;

      const dateBtns = OFFICIAL_DATES.map(d => `
        <button class="exam-gate__date-btn" data-date="${d.date}">
          <span class="exam-gate__date-period">${d.label}</span>
          <span class="exam-gate__date-day">${d.display}</span>
        </button>`).join('');

      const el = document.createElement('div');
      el.id = 'exam-date-gate';
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-modal', 'true');
      el.innerHTML = `
        <div class="exam-gate__overlay"></div>
        <div class="exam-gate__card">
          <span class="exam-gate__icon" aria-hidden="true">📅</span>
          <h2 class="exam-gate__title">${title}</h2>
          <p class="exam-gate__message">${message}</p>

          <p class="exam-gate__section-label">Fechas oficiales</p>
          <div class="exam-gate__dates">${dateBtns}</div>

          <p class="exam-gate__or">o ingresa una fecha específica</p>
          <input type="date" id="exam-gate-custom"
            class="exam-gate__input"
            min="${new Date().toISOString().split('T')[0]}"
            aria-label="Fecha personalizada del examen" />

          <button class="exam-gate__confirm" id="exam-gate-confirm" disabled>
            Activar mi contador
          </button>
          ${skipBtn}
        </div>`;

      document.body.appendChild(el);
      requestAnimationFrame(() => el.classList.add('exam-gate--visible'));

      let selectedDate = null;

      // Selección de fecha predefinida
      el.querySelectorAll('.exam-gate__date-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          el.querySelectorAll('.exam-gate__date-btn').forEach(b => b.classList.remove('exam-gate__date-btn--on'));
          btn.classList.add('exam-gate__date-btn--on');
          selectedDate = btn.dataset.date;
          document.getElementById('exam-gate-custom').value = '';
          document.getElementById('exam-gate-confirm').disabled = false;
        });
      });

      // Fecha personalizada
      document.getElementById('exam-gate-custom').addEventListener('change', e => {
        if (e.target.value) {
          selectedDate = e.target.value;
          el.querySelectorAll('.exam-gate__date-btn').forEach(b => b.classList.remove('exam-gate__date-btn--on'));
          document.getElementById('exam-gate-confirm').disabled = false;
        }
      });

      // Confirmar
      document.getElementById('exam-gate-confirm').addEventListener('click', async () => {
        if (!selectedDate) return;
        const btn = document.getElementById('exam-gate-confirm');
        btn.disabled = true;
        btn.textContent = 'Guardando…';

        const { error } = await supabase
          .from('profiles').update({ exam_date: selectedDate }).eq('user_id', userId);

        if (error) {
          btn.disabled = false;
          btn.textContent = 'Activar mi contador';
          if (window.showToast) showToast('Error', 'No se pudo guardar la fecha.', '❌', 'error');
          return;
        }

        _close();
        if (window.ExamCalendar) ExamCalendar.renderWidget(userId, 'exam-calendar-widget');
        if (window.showToast) showToast('¡Fecha guardada!', 'AURA ajustará tu plan de estudio.', '📅', 'success');
        resolve('saved');
      });

      // Skip (solo usuarios existentes)
      document.getElementById('exam-gate-skip')?.addEventListener('click', () => {
        _close();
        resolve('skipped');
      });

      // ESC solo para usuarios existentes
      if (!isNewUser) {
        const onEsc = (e) => {
          if (e.key === 'Escape') { document.removeEventListener('keydown', onEsc); _close(); resolve('skipped'); }
        };
        document.addEventListener('keydown', onEsc);
      }
    });
  }

  function _close() {
    const el = document.getElementById('exam-date-gate');
    if (!el) return;
    el.classList.remove('exam-gate--visible');
    setTimeout(() => el.remove(), 300);
  }

  return { check };
})();
