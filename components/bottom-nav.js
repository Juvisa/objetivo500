// FILE: components/bottom-nav.js | Barra de navegación inferior — solo mobile (< 768px)
// Dependencia: renderDashboard, showSubjectPicker, showTopicChallengePicker (app.js globals)

window.BottomNav = (() => {
  'use strict';

  const ITEMS = [
    {
      id:     'inicio',
      icon:   '🏠',
      label:  'Inicio',
      action: () => {
        if (window.renderDashboard) renderDashboard();
        _setActive('inicio');
      },
    },
    {
      id:     'practicar',
      icon:   '📚',
      label:  'Practicar',
      action: () => {
        if (window.showSubjectPicker) showSubjectPicker(10);
        _setActive('practicar');
      },
    },
    {
      id:     'reto',
      icon:   '⚡',
      label:  'Reto',
      action: () => {
        if (window.showTopicChallengePicker) showTopicChallengePicker();
        _setActive('reto');
      },
    },
    {
      id:     'guardian',
      icon:   '🐉',
      label:  'Guardián',
      action: () => {
        if (window.renderDashboard) renderDashboard();
        // Scroll suave al widget tras render asíncrono
        setTimeout(() => {
          document.getElementById('guardian-widget-container')
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 120);
        _setActive('guardian');
      },
    },
  ];

  let _nav = null;

  function init() {
    if (_nav) return; // ya inicializado

    _nav = document.createElement('nav');
    _nav.id = 'bottom-nav';
    _nav.setAttribute('aria-label', 'Navegación principal');
    _nav.innerHTML = ITEMS.map(item => `
      <button
        class="bn-item"
        id="bn-${item.id}"
        aria-label="${item.label}"
        aria-current="false"
        onclick="BottomNav._click('${item.id}')"
      >
        <span class="bn-icon" aria-hidden="true">${item.icon}</span>
        <span class="bn-label">${item.label}</span>
      </button>
    `).join('');

    document.body.appendChild(_nav);
    _setActive('inicio');
  }

  function _click(id) {
    const item = ITEMS.find(i => i.id === id);
    if (item) item.action();
  }

  function _setActive(id) {
    if (!_nav) return;
    _nav.querySelectorAll('.bn-item').forEach(btn => {
      const isActive = btn.id === `bn-${id}`;
      btn.classList.toggle('bn-item--active', isActive);
      btn.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
  }

  function setActive(id) { _setActive(id); }

  function hide() {
    if (_nav) _nav.setAttribute('data-hidden', 'true');
  }

  function show() {
    if (_nav) _nav.removeAttribute('data-hidden');
  }

  return { init, setActive, hide, show, _click };
})();
