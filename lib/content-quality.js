// FILE: lib/content-quality.js
// Módulo A — Validación de contenido: reporte de preguntas con posible error.
// Depende de: supabase (global), showToast (global)

window.ContentQuality = (() => {
  'use strict';

  const REASONS = {
    wrong_answer: 'Respuesta incorrecta',
    bad_wording:  'Enunciado confuso',
    unclear:      'Pregunta poco clara',
    other:        'Otro problema',
  };

  // ── API pública ───────────────────────────────────────────────

  /**
   * Envía un reporte para una pregunta.
   * @param {string} questionId
   * @param {string} studentId
   * @param {string} reason  – 'wrong_answer'|'bad_wording'|'unclear'|'other'
   */
  async function reportQuestion(questionId, studentId, reason = 'other') {
    const { error } = await supabase
      .from('question_reports')
      .insert({ question_id: questionId, student_id: studentId, reason });

    if (error) {
      _toast('No pudimos enviar el reporte. Intenta de nuevo.', 'error');
      return false;
    }

    await supabase.rpc('increment_report_count', { q_id: questionId });
    await supabase.rpc('check_auto_pause',       { q_id: questionId });

    _toast('Reporte enviado. Gracias por ayudar a mejorar el contenido.', 'success');
    return true;
  }

  /**
   * Muestra el mini-menú de razones de reporte.
   * Llama a reportQuestion cuando el usuario elige una razón.
   * @param {string} questionId
   * @param {string} studentId
   * @param {HTMLElement} anchorEl – botón que abrió el menú (para posicionarlo)
   */
  function openReportMenu(questionId, studentId, anchorEl) {
    // Cerrar menú previo si existe
    document.getElementById('cq-report-menu')?.remove();

    const menu = document.createElement('div');
    menu.id = 'cq-report-menu';
    menu.setAttribute('role', 'menu');
    menu.style.cssText = `
      position:absolute;
      z-index:9999;
      background:var(--bg-elevated);
      border:1px solid var(--border-light);
      border-radius:var(--radius-lg);
      box-shadow:var(--shadow-lg);
      padding:6px;
      min-width:200px;
      animation:cardIn .15s ease both;
    `;

    Object.entries(REASONS).forEach(([key, label]) => {
      const item = document.createElement('button');
      item.setAttribute('role', 'menuitem');
      item.style.cssText = `
        display:block;width:100%;padding:8px 12px;
        background:none;border:none;border-radius:var(--radius-md);
        color:var(--text-primary);font-size:.85rem;text-align:left;cursor:pointer;
      `;
      item.textContent = label;
      item.onmouseenter = () => { item.style.background = 'var(--bg-overlay)'; };
      item.onmouseleave = () => { item.style.background = 'none'; };
      item.onclick = async () => {
        menu.remove();
        await reportQuestion(questionId, studentId, key);
      };
      menu.appendChild(item);
    });

    // Posicionar relativo al ancla
    document.body.appendChild(menu);
    const rect = anchorEl.getBoundingClientRect();
    menu.style.top  = `${rect.bottom + window.scrollY + 4}px`;
    menu.style.left = `${Math.max(8, rect.right - menu.offsetWidth + window.scrollX)}px`;

    // Cerrar al hacer click fuera
    const close = (e) => {
      if (!menu.contains(e.target) && e.target !== anchorEl) {
        menu.remove();
        document.removeEventListener('click', close, true);
      }
    };
    setTimeout(() => document.addEventListener('click', close, true), 0);
  }

  /**
   * Genera el HTML del botón de reporte (⚑).
   * Usar en el template de la tarjeta de pregunta.
   * @param {string} questionId
   * @param {string} studentId
   */
  function reportButtonHTML(questionId, studentId) {
    return `
      <button
        class="cq-report-btn"
        title="Reportar problema con esta pregunta"
        aria-label="Reportar pregunta"
        onclick="ContentQuality.openReportMenu('${questionId}','${studentId}',this)"
      >⚑</button>`;
  }

  // ── Helper interno ────────────────────────────────────────────

  function _toast(msg, type) {
    if (typeof showToast === 'function') {
      showToast(msg, '', type === 'error' ? '❌' : '✅', type);
    }
  }

  return { reportQuestion, openReportMenu, reportButtonHTML };
})();
