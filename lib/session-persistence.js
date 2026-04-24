// FILE: lib/session-persistence.js
// Depende de: supabase (global), SUPABASE_URL, SUPABASE_ANON_KEY,
//             STATE (global de app.js), SUBJECTS (global de app.js)

window.SessionPersistence = (() => {
  'use strict';

  const LS_PREFIX       = 'aura_session_';
  let   _autoSaveHandle = null;

  // ── Clave localStorage por estudiante ──────────────────────────
  function _key(studentId) { return `${LS_PREFIX}${studentId}`; }

  // ══════════════════════════════════════════════════════════════
  //  CAPA 1 — localStorage (offline-first, síncrona)
  // ══════════════════════════════════════════════════════════════
  function saveToLocalStorage() {
    try {
      const s         = window.STATE?.session;
      const studentId = window.STATE?.student?.id;
      if (!s?.started || !studentId) return;

      localStorage.setItem(_key(studentId), JSON.stringify({
        studentId,
        subject:        s.subject       ?? null,
        topic:          s.topic         ?? null,
        currentIndex:   s.currentIdx,
        totalQuestions: s.questions.length,
        answers:        s.answers,
        questions:      s.questions,     // para restaurar sin nueva query
        secsPerQ:       s.secsPerQ,
        sessionType:    s.sessionType    ?? 'practice',
        startedAt:      s.startedAt      ?? new Date().toISOString(),
        lastSavedAt:    new Date().toISOString(),
      }));
    } catch (e) {
      console.warn('[SessionPersistence] localStorage.save:', e);
    }
  }

  function loadFromLocalStorage(studentId) {
    try {
      const raw = localStorage.getItem(_key(studentId));
      if (!raw) return null;
      const d = JSON.parse(raw);
      const age = Date.now() - new Date(d.lastSavedAt).getTime();
      if (age > 2 * 3600 * 1000) { clearLocalStorage(studentId); return null; }
      return d;
    } catch { return null; }
  }

  function clearLocalStorage(studentId) {
    localStorage.removeItem(_key(studentId));
  }

  // ══════════════════════════════════════════════════════════════
  //  CAPA 2 — Supabase session_drafts (cross-device)
  // ══════════════════════════════════════════════════════════════
  async function saveToSupabase() {
    try {
      const s         = window.STATE?.session;
      const studentId = window.STATE?.student?.id;
      if (!s?.started || !studentId) return;

      await supabase.from('session_drafts').upsert({
        student_id:    studentId,
        subject:       s.subject    ?? null,
        topic:         s.topic      ?? null,
        current_index: s.currentIdx,
        total_qs:      s.questions.length,
        answers_json:  s.answers,
        session_type:  s.sessionType ?? 'practice',
        started_at:    s.startedAt   ?? new Date().toISOString(),
        updated_at:    new Date().toISOString(),
        is_active:     true,
      }, { onConflict: 'student_id' });
    } catch (e) {
      // Silencioso — localStorage es el fallback
      console.warn('[SessionPersistence] Supabase.save (offline?):', e);
    }
  }

  async function loadDraft(studentId) {
    // localStorage es más rápido → va primero
    const local = loadFromLocalStorage(studentId);
    if (local) return local;

    // Fallback: Supabase (restauración cross-device)
    try {
      const { data } = await supabase
        .from('session_drafts')
        .select('*')
        .eq('student_id', studentId)
        .eq('is_active', true)
        .maybeSingle();

      if (!data) return null;
      return {
        studentId:      data.student_id,
        subject:        data.subject,
        topic:          data.topic,
        currentIndex:   data.current_index,
        totalQuestions: data.total_qs,
        answers:        data.answers_json ?? {},
        sessionType:    data.session_type,
        startedAt:      data.started_at,
        lastSavedAt:    data.updated_at,
      };
    } catch { return null; }
  }

  async function clearDraft(studentId) {
    clearLocalStorage(studentId);
    try {
      await supabase.from('session_drafts')
        .update({ is_active: false })
        .eq('student_id', studentId)
        .eq('is_active', true);
    } catch {}
  }

  // ══════════════════════════════════════════════════════════════
  //  AUTO-SAVE: intervalo + visibilitychange + beforeunload
  // ══════════════════════════════════════════════════════════════
  function initAutoSave(intervalMs = 30000) {
    stopAutoSave();

    _autoSaveHandle = setInterval(() => {
      if (window.STATE?.session?.started) {
        saveToLocalStorage();
        saveToSupabase();
      }
    }, intervalMs);

    document.addEventListener('visibilitychange', _onVisibility);
    window.addEventListener('beforeunload', _onBeforeUnload);
  }

  function stopAutoSave() {
    if (_autoSaveHandle) { clearInterval(_autoSaveHandle); _autoSaveHandle = null; }
    document.removeEventListener('visibilitychange', _onVisibility);
    window.removeEventListener('beforeunload', _onBeforeUnload);
  }

  function _onVisibility() {
    if (document.hidden && window.STATE?.session?.started) {
      saveToLocalStorage();
      saveToSupabase();
    }
  }

  function _onBeforeUnload() {
    // localStorage es síncrono → siempre funciona en beforeunload
    if (window.STATE?.session?.started) saveToLocalStorage();
  }

  // ══════════════════════════════════════════════════════════════
  //  BANNER de sesión pendiente (Sistema 2 — no bloquea pantalla)
  // ══════════════════════════════════════════════════════════════
  function showDraftBanner(draft, onResume, onDiscard) {
    removeDraftBanner();

    const subjectLabel = draft.subject
      ? (window.SUBJECTS?.[draft.subject] ?? draft.subject)
      : 'tu última sesión';
    const topicPart    = draft.topic ? ` · ${draft.topic}` : '';

    const banner = document.createElement('div');
    banner.id        = 'draft-banner';
    banner.className = 'draft-banner';
    banner.setAttribute('role', 'status');
    banner.innerHTML = `
      <span class="draft-banner-icon" aria-hidden="true">⚡</span>
      <span class="draft-banner-text">
        Tienes un entrenamiento guardado en
        <strong>${subjectLabel}${topicPart}</strong>.
        Ibas en la pregunta
        <strong>${draft.currentIndex + 1}</strong> de <strong>${draft.totalQuestions}</strong>.
      </span>
      <div class="draft-banner-actions">
        <button class="btn btn--primary btn--sm" id="draft-resume">
          Retomar desde ${draft.currentIndex + 1}
        </button>
        <button class="btn btn--ghost btn--sm" id="draft-discard">
          Empezar uno nuevo
        </button>
      </div>`;

    const root = document.getElementById('app-root');
    root?.parentNode?.insertBefore(banner, root);

    document.getElementById('draft-resume')?.addEventListener('click', () => {
      removeDraftBanner();
      onResume(draft);
    });

    document.getElementById('draft-discard')?.addEventListener('click', async () => {
      removeDraftBanner();
      if (draft.studentId) await clearDraft(draft.studentId).catch(() => {});
      if (typeof onDiscard === 'function') onDiscard();
    });
  }

  function removeDraftBanner() {
    document.getElementById('draft-banner')?.remove();
  }

  return {
    saveToLocalStorage,
    loadFromLocalStorage,
    clearLocalStorage,
    saveToSupabase,
    loadDraft,
    clearDraft,
    initAutoSave,
    stopAutoSave,
    showDraftBanner,
    removeDraftBanner,
  };
})();
