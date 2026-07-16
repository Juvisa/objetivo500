// js/simulacro/index.js — Puente entre nuevos módulos y app.js
// Objetivo 500 · Vanilla JS
// ──────────────────────────────────────────────────────────────
// Importa SimulacroTimer y SimulacroNavegacion y los expone como
// window.BlockTimer y window.QuestionNav para retrocompatibilidad
// con app.js existente, sin modificar ese archivo.

import { SimulacroTimer }     from './timer.js';
import { SimulacroNavegacion } from './navegacion.js';
import { getSegundosBloque, formatTiempo, TIEMPOS_MATERIA } from '../constants/tiempos.js';

// Exponer constantes globalmente (app.js las lee de window)
window.TIEMPOS_MATERIA   = TIEMPOS_MATERIA;
window.getSegundosBloque = getSegundosBloque;

// ── BlockTimer: API singleton compatible con app.js ───────────
// app.js llama: BlockTimer.start(total, onTick, onExpire, resume)
//               BlockTimer.stop()
//               BlockTimer.getSecsLeft()
//               BlockTimer.renderHTML(label, total, resume)

let _timerInstance = null;

window.BlockTimer = {
  start(totalSecs, onTick, onExpire, reanudarEn = null) {
    if (_timerInstance) _timerInstance.detener();
    _timerInstance = new SimulacroTimer({
      segundosTotales: totalSecs,
      onTick: ({ restantes, total, porcentaje }) => {
        if (typeof onTick === 'function') onTick(restantes);
      },
      onExpire,
      reanudarEn,
    });
    _timerInstance.iniciar();
  },
  stop() {
    if (_timerInstance) {
      _timerInstance.detener();
      _timerInstance = null;
    }
  },
  pause()   { _timerInstance?.pausar(); },
  resume()  { _timerInstance?.reanudar(); },
  getSecsLeft()  { return _timerInstance?.restantes ?? 0; },
  getSecsTotal() { return _timerInstance?.total ?? 0; },
  refresh()      { _timerInstance?._actualizarDOM(_timerInstance.porcentaje); },
  renderHTML(label, totalSecs, reanudarEn = null) {
    // Crear instancia temporal solo para renderizar el HTML inicial
    const tmp = new SimulacroTimer({
      segundosTotales: totalSecs,
      onTick: () => {},
      onExpire: () => {},
      reanudarEn,
    });
    return tmp.renderHTML(label);
  },
};

// ── QuestionNav: API compatible con app.js ────────────────────
// app.js llama: QuestionNav.render(n, currentIdx, answers, questions, onNavigate)
//               QuestionNav.updateButton(idx, isCurrent, answer)

let _navInstance = null;

window.QuestionNav = {
  render(n, currentIdx, answers, questions, onNavigate) {
    _navInstance = new SimulacroNavegacion({ n, questions, answers, onNavegar: onNavigate });
    _navInstance.render(currentIdx);
  },
  updateButton(idx, isCurrent, answer) {
    _navInstance?.actualizarBoton(idx, isCurrent, answer);
  },
};

console.log('[Objetivo 500] Módulos simulacro cargados ✓ (timer + navegacion)');
