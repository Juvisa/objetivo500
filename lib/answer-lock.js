// FILE: lib/answer-lock.js
// Cerrojo lógico de respuestas — blinda contra el exploit de vida infinita.
// Capa 1 (memoria): instantáneo, sin red.
// Llamar clearAll() solo al iniciar una sesión nueva.

window.AnswerLock = (() => {
  'use strict';

  // questionId → { selectedOption, isCorrect, processedAt, xpAwarded }
  const _answered = new Map();

  function lock(questionId, result) {
    if (_answered.has(questionId)) return false;
    _answered.set(questionId, {
      selectedOption: result.selectedOption,
      isCorrect:      result.isCorrect,
      processedAt:    Date.now(),
      xpAwarded:      result.xpAwarded ?? 0,
    });
    return true;
  }

  function isLocked(questionId) {
    return _answered.has(questionId);
  }

  function getResult(questionId) {
    return _answered.get(questionId) ?? null;
  }

  function clearAll() {
    _answered.clear();
  }

  return { lock, isLocked, getResult, clearAll };
})();
