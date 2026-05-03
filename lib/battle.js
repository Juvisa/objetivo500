// FILE: lib/battle.js
// Módulo F — Batallas 1v1 entre estudiantes.
// Depende de: supabase (global)

window.Battle = (() => {
  'use strict';

  const SECS_PER_Q = 60;
  let _channel = null;

  // ── API pública ───────────────────────────────────────────────

  async function create(challengerId, subject = null) {
    const { data: battleId, error } = await supabase.rpc('create_battle', {
      p_challenger_id: challengerId,
      p_subject:       subject,
      p_total:         10,
    });
    if (error || !battleId) return null;
    return battleId;
  }

  async function join(battleId, studentId) {
    const { data: ok } = await supabase.rpc('join_battle', {
      p_battle_id:  battleId,
      p_student_id: studentId,
    });
    return !!ok;
  }

  async function getDetail(battleId, studentId) {
    const { data } = await supabase.rpc('get_battle_detail', {
      p_battle_id:  battleId,
      p_student_id: studentId,
    });
    return data;
  }

  async function submitAnswer(battleId, studentId, questionId, answerIndex, timeSecs) {
    const { data } = await supabase.rpc('submit_battle_answer', {
      p_battle_id:    battleId,
      p_student_id:   studentId,
      p_question_id:  questionId,
      p_answer_index: answerIndex,
      p_time_seconds: timeSecs,
    });
    return data; // { is_correct, correct_index }
  }

  async function getMyBattles(studentId, limit = 10) {
    const { data } = await supabase
      .from('battles')
      .select('*')
      .or(`challenger_id.eq.${studentId},opponent_id.eq.${studentId}`)
      .order('created_at', { ascending: false })
      .limit(limit);
    return data ?? [];
  }

  function subscribeToChanges(battleId, callback) {
    if (_channel) _channel.unsubscribe();
    _channel = supabase
      .channel(`battle:${battleId}`)
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'battles',
        filter: `id=eq.${battleId}`,
      }, callback)
      .subscribe();
    return _channel;
  }

  function unsubscribe() {
    if (_channel) { _channel.unsubscribe(); _channel = null; }
  }

  // ── Render: lobby card para el dashboard ─────────────────────

  function lobbyCardHTML(studentId) {
    return `
      <div class="battle-lobby-card">
        <div style="font-size:2rem;margin-bottom:var(--space-2)">⚔️</div>
        <p style="font-weight:700;margin-bottom:4px">Batalla 1v1</p>
        <p style="font-size:.8rem;color:var(--text-muted);margin-bottom:var(--space-4)">Reta a otro estudiante. +300 XP al ganador</p>
        <div style="display:flex;gap:var(--space-2);flex-wrap:wrap;justify-content:center">
          <button class="btn btn--primary btn--sm" onclick="window.location.href='battle.html?new=1&student=${studentId}'">
            ⚔️ Nuevo reto
          </button>
          <button class="btn btn--ghost btn--sm" onclick="Battle.showJoinPrompt('${studentId}')">
            🔗 Unirse con código
          </button>
        </div>
      </div>`;
  }

  function showJoinPrompt(studentId) {
    document.getElementById('battle-join-modal')?.remove();
    const overlay = document.createElement('div');
    overlay.id = 'battle-join-modal';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center;padding:16px';
    overlay.innerHTML = `
      <div style="background:var(--bg-elevated);border:1px solid var(--border-light);border-radius:var(--radius-xl);padding:var(--space-8) var(--space-6);max-width:360px;width:100%;text-align:center">
        <div style="font-size:2rem;margin-bottom:var(--space-3)">🔗</div>
        <h2 style="font-size:1.1rem;font-weight:800;margin-bottom:var(--space-2)">Ingresar con código</h2>
        <p style="color:var(--text-secondary);font-size:.85rem;margin-bottom:var(--space-5)">Pide el código a quien te retó.</p>
        <input id="battle-code-input" type="text" placeholder="Pega el código aquí"
          style="width:100%;padding:10px 14px;background:var(--bg-overlay);border:1px solid var(--border-light);border-radius:var(--radius-md);color:var(--text-primary);font-size:.95rem;margin-bottom:var(--space-4);box-sizing:border-box;text-align:center;letter-spacing:.08em"
        />
        <button onclick="Battle._doJoin('${studentId}')" class="btn btn--primary" style="width:100%;margin-bottom:var(--space-2)">Unirme</button>
        <button onclick="document.getElementById('battle-join-modal').remove()" style="background:none;border:none;color:var(--text-muted);font-size:.82rem;cursor:pointer">Cancelar</button>
      </div>`;
    document.body.appendChild(overlay);
  }

  Battle._doJoin = async function(studentId) {
    const code = document.getElementById('battle-code-input')?.value?.trim();
    if (!code) return;
    const ok = await join(code, studentId);
    if (ok) {
      document.getElementById('battle-join-modal')?.remove();
      window.location.href = `battle.html?id=${code}&student=${studentId}`;
    } else {
      if (window.showToast) showToast('Código inválido', 'No se encontró esa batalla o ya comenzó.', '⚠️', 'error');
    }
  };

  return { create, join, getDetail, submitAnswer, getMyBattles, subscribeToChanges, unsubscribe, lobbyCardHTML, showJoinPrompt };
})();
