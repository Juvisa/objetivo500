// FILE: components/pre-exam-modal.js
// Aviso pre-prueba: aparece SIEMPRE antes de iniciar una sesión de preguntas.

window.PreExamModal = (() => {
  'use strict';

  /**
   * Muestra el aviso pre-prueba.
   * @param {{ questions: number, minutes: number, subject?: string }} config
   * @returns {Promise<'start'|'cancel'>}
   */
  function show({ questions = 20, minutes = 30, subject = '' }) {
    return new Promise((resolve) => {
      document.getElementById('pre-exam-modal')?.remove();

      const subjectLabel = subject ? ` de ${subject}` : '';

      const modal = document.createElement('div');
      modal.id = 'pre-exam-modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-label', 'Aviso antes de iniciar');
      modal.innerHTML = `
        <div class="pem-overlay" id="pem-overlay"></div>
        <div class="pem-content" id="pem-content">
          <div class="pem-icon" aria-hidden="true">⚡</div>
          <p class="pem-tag">ANTES DE COMENZAR</p>
          <h2 class="pem-title">Prueba${subjectLabel}</h2>
          <p class="pem-body">
            Tienes <strong>${minutes} minutos</strong> para completar
            <strong>${questions} preguntas</strong>.
          </p>
          <ul class="pem-rules">
            <li>Una vez iniciado, el temporizador no se detiene.</li>
            <li>No podrás retroceder a preguntas ya confirmadas.</li>
            <li>Tu Guardián gana energía por cada respuesta correcta.</li>
          </ul>
          <p class="pem-ready">¿Estás listo para entrenar?</p>
          <div class="pem-actions">
            <button class="pem-btn-start" id="pem-start">Comenzar entrenamiento</button>
            <button class="pem-btn-cancel" id="pem-cancel">Volver</button>
          </div>
        </div>`;

      document.body.appendChild(modal);
      requestAnimationFrame(() => modal.classList.add('pem--visible'));

      function close() {
        modal.classList.remove('pem--visible');
        setTimeout(() => modal.remove(), 300);
        document.removeEventListener('keydown', escHandler);
      }

      document.getElementById('pem-start').addEventListener('click', () => { close(); resolve('start'); });
      document.getElementById('pem-cancel').addEventListener('click', () => { close(); resolve('cancel'); });

      function escHandler(e) {
        if (e.key === 'Escape') { close(); resolve('cancel'); }
      }
      document.addEventListener('keydown', escHandler);
    });
  }

  return { show };
})();
