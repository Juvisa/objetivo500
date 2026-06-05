// app.js — Objetivo 500
// supabase, requireAuth, subscribeToStudentChanges, subscribeToFeed
// vienen como globales desde app.html

// ── Constantes ────────────────────────────────────────────────
// Tiempos oficiales por bloque (20 preguntas) en segundos
const BLOCK_SECS_BY_SUBJECT = {
  matematicas:        46 * 60,  // 46 min oficiales
  lectura_critica:    40 * 60,  // 40 min oficiales
  sociales:           40 * 60,  // 40 min oficiales
  ciencias_naturales: 40 * 60,  // 40 min oficiales
  ingles:             30 * 60,  // 30 min oficiales
};
const BLOCK_SECS_DEFAULT    = 40 * 60; // fallback para sesiones mixtas (40 min)

// Retrocompat: secsPerQ sigue usándose en SessionPersistence, mantenemos alias
const SECS_PER_Q            = 90;
const SECS_PER_Q_BY_SUBJECT = {
  lectura_critica:    105,
  matematicas:        108,
  ciencias_naturales:  78,
  sociales:           108,
  ingles:              90,
};
const SUBJECTS   = {
  lectura_critica:       'Lectura Crítica',
  matematicas:           'Matemáticas',
  sociales:              'Sociales y Ciudadanas',
  ciencias_naturales:    'Ciencias Naturales',
  ingles:                'Inglés',
};
const RANK_LABELS = {
  novato:      '🔰 Novato Saber',
  explorador:  '🌿 Explorador',
  avanzado:    '⭐ Avanzado',
  diamante:    '💎 Diamante',
  leyenda:     '🏆 Leyenda 500',
};
const RANK_THRESHOLDS = [0, 500, 1500, 4000, 10000];

// ── Estado global de sesión ───────────────────────────────────
let STATE = {
  profile:    null,   // objeto de profiles
  student:    null,   // objeto de students (con badges)
  session: {
    id:             null,
    questions:      [],   // array de objetos question completos
    currentIdx:     0,
    answers:        {},   // questionId → {selected_index, is_correct, time_seconds}
    // Reloj por bloque:
    blockSecsTotal: BLOCK_SECS_DEFAULT,
    blockSecsLeft:  BLOCK_SECS_DEFAULT,
    // Retrocompat con SessionPersistence:
    timerLeft:      SECS_PER_Q,
    secsPerQ:       SECS_PER_Q,
    timerHandle:    null,
    started:        false,
  },
  realtimeChannels: [],
};

// ══════════════════════════════════════════════════════════════
//  BOOTSTRAP — inicializar app cuando el DOM está listo
// ══════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', async () => {
  STATE.profile = await requireAuth('student');
  if (!STATE.profile) return; // requireAuth ya redirigió

  // Verificar si el usuario ya eligió su guardián
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const guardianExiste = await Guardian.get(user.id);
    if (!guardianExiste) {
      window.location.href = './guardian-selector.html';
      return;
    }
    STATE.guardianUserId = user.id;
  }

  await loadStudentData();
  renderHeader();
  renderDashboard();
  setupRealtime();

  // FAB de soporte WhatsApp — se actualiza con el nombre real al cargar el perfil
  if (window.SupportFAB) {
    const _fab = SupportFAB.init(STATE.profile?.username);
    if (STATE.profile?.username) _fab.updateUserName(STATE.profile.username);
  }

  // Verificar fecha de examen — modal si no la tiene (una vez por sesión)
  if (window.ExamDateGate && STATE.profile?.user_id) {
    const createdAt = user?.created_at ?? '';
    const hoursOld  = createdAt ? (Date.now() - new Date(createdAt).getTime()) / 3600000 : 999;
    ExamDateGate.check(STATE.profile.user_id, hoursOld < 24);
  }

  // Activar click sounds globales (lazy — AudioContext se crea al primer click)
  if (window.AudioEvents) AudioEvents.initClickSounds();

  // Iniciar widget del guardián en el dashboard
  if (STATE.guardianUserId) {
    GuardianWidget.init(STATE.guardianUserId, 'guardian-widget-container');
  }

  // Bottom nav mobile — iniciar una sola vez al arrancar la app
  if (window.BottomNav) BottomNav.init();

  // Inicializar botón de notificaciones push
  if (window.PushManager500 && STATE.profile?.user_id) {
    PushManager500.init(STATE.profile.user_id);
  }

  // Si hay sesión pendiente, mostrar banner (no toast) para decisión explícita
  if (window.SessionPersistence && STATE.student?.id) {
    const draft = await SessionPersistence.loadDraft(STATE.student.id);
    if (draft && draft.questions?.length) {
      SessionPersistence.showDraftBanner(
        draft,
        // onResume: restaurar sesión desde el draft
        (d) => {
          STATE.session = {
            id:          crypto.randomUUID(),
            subject:     d.subject,
            questions:   d.questions,
            currentIdx:  d.currentIndex,
            answers:     d.answers ?? {},
            timerLeft:   d.secsPerQ ?? SECS_PER_Q,
            secsPerQ:    d.secsPerQ ?? SECS_PER_Q,
            timerHandle: null,
            started:     true,
            startedAt:   d.startedAt,
            sessionType: d.sessionType ?? 'practice',
          };
          SessionPersistence.initAutoSave();
          renderQuestion();
        },
        // onDiscard: el banner ya limpió el draft, solo redibujar dashboard
        () => renderDashboard()
      );
    }
  } else {
    const saved = loadSavedSession();
    if (saved) offerResume(saved);
  }
});

// ══════════════════════════════════════════════════════════════
//  CARGA DE DATOS
// ══════════════════════════════════════════════════════════════

/** Carga perfil completo del estudiante desde Supabase. */
async function loadStudentData() {
  const { data, error } = await supabase
    .from('students')
    .select(`
      *,
      student_badges(
        unlocked_at,
        badges(slug, name, icon_url, description)
      )
    `)
    .eq('profile_id', STATE.profile.id)
    .single();

  if (error) {
    console.error('[O500] loadStudentData:', error.message);
    return;
  }
  STATE.student = data;
}

/** Selección anti-repetición: usa QuestionSelector si disponible, sino RPC. */
async function fetchSessionQuestions(n = 20, subject = null) {
  if (window.QuestionSelector) {
    try {
      const qs = await QuestionSelector.selectSessionQuestions(STATE.student.id, subject, n);
      if (qs && qs.length >= Math.min(5, n)) return qs;
    } catch (e) {
      console.warn('[O500] QuestionSelector falló, usando RPC:', e.message);
    }
  }

  const { data, error } = await supabase
    .rpc('get_session_questions', {
      p_student_id: STATE.student.id,
      p_n:          n,
      p_subject:    subject,
    });

  if (error) {
    console.error('[O500] fetchSessionQuestions RPC:', error.message);
    return [];
  }
  return data ?? [];
}

// ══════════════════════════════════════════════════════════════
//  RENDER DEL HEADER (navbar con XP, racha, nivel)
// ══════════════════════════════════════════════════════════════
function renderHeader() {
  const s = STATE.student;
  if (!s) return;

  const xpNext  = nextLevelXp(s.xp_total);
  const xpPrev  = prevLevelXp(s.xp_total);
  const pct     = Math.min(100, Math.round(((s.xp_total - xpPrev) / (xpNext - xpPrev)) * 100));

  const container = document.getElementById('header-user');
  if (!container) return;

  container.innerHTML = `
    <div class="streak-chip ${s.streak_days > 0 ? 'active' : ''}" title="Racha diaria">
      🔥 ${s.streak_days} día${s.streak_days !== 1 ? 's' : ''}
    </div>

    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;min-width:120px">
      <div style="display:flex;align-items:center;gap:8px">
        <span class="rank-badge rank--${s.rank}" title="Rango">${RANK_LABELS[s.rank]}</span>
        <span style="font-size:.75rem;color:var(--text-muted)">Nv. ${s.level}</span>
      </div>
      <div style="width:120px">
        <div class="xp-bar-track">
          <div class="xp-bar-fill" style="width:${pct}%" id="xp-bar-fill"></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:.65rem;color:var(--text-muted);margin-top:2px">
          <span id="xp-current">${s.xp_total} XP</span>
          <span>${xpNext} XP</span>
        </div>
      </div>
    </div>

    <div style="display:flex;align-items:center;gap:8px">
      <button
        id="audio-toggle"
        class="audio-toggle"
        onclick="toggleAudioMute(this)"
        aria-label="Alternar sonido"
        aria-pressed="${localStorage.getItem('aura_audio_muted') === 'true'}"
        title="${localStorage.getItem('aura_audio_muted') === 'true' ? 'Activar sonido' : 'Silenciar efectos'}"
        data-no-sound
      >
        <span class="audio-toggle__icon" aria-hidden="true">${localStorage.getItem('aura_audio_muted') === 'true' ? '🔇' : '🔊'}</span>
        <span class="audio-toggle__label">Sonido</span>
      </button>
      <img
        class="avatar avatar--sm"
        src="${STATE.profile.avatar_url || `https://api.dicebear.com/8.x/thumbs/svg?seed=${STATE.profile.username}`}"
        alt="Avatar de ${STATE.profile.username}"
        style="cursor:pointer"
        title="${STATE.profile.username}"
      />
      <button
        onclick="signOut()"
        class="btn btn--ghost btn--sm"
        title="Cerrar sesión"
        style="font-size:.75rem;padding:4px 10px"
        aria-label="Cerrar sesión"
      >↩ Salir</button>
    </div>
  `;
}

function nextLevelXp(xpTotal) {
  if (xpTotal >= 10000) return 10000;
  for (const t of RANK_THRESHOLDS) if (t > xpTotal) return t;
  return 10000;
}
function prevLevelXp(xpTotal) {
  let prev = 0;
  for (const t of RANK_THRESHOLDS) {
    if (t <= xpTotal) prev = t;
  }
  return prev;
}

// ══════════════════════════════════════════════════════════════
//  DASHBOARD PRINCIPAL
// ══════════════════════════════════════════════════════════════
function renderDashboard() {
  const root = document.getElementById('app-root');
  if (!root) return;

  // Ocultar el reloj por bloque al regresar al dashboard
  const timerContainer = document.getElementById('block-timer-bar-container');
  if (timerContainer) timerContainer.style.display = 'none';

  root.innerHTML = `
    <!-- Onboarding — oculto automáticamente cuando se completan los 5 pasos -->
    <section id="onboarding-bar" class="ob-container" style="margin-bottom:var(--space-4)"></section>

    <!-- Guardián del Saber -->
    <section id="guardian-widget-container" style="margin-bottom:var(--space-4)"></section>

    <!-- Insignias — primero para dar contexto visual antes del countdown -->
    <section class="panel" style="margin-bottom:var(--space-4)">
      <h3 style="margin-bottom:var(--space-4)">Mis insignias</h3>
      <div id="badges-grid" style="display:flex;flex-wrap:wrap;gap:var(--space-3)">
        ${renderBadges()}
      </div>
    </section>

    <!-- Cuenta regresiva al examen — después de insignias, antes de stats -->
    <section class="panel" id="exam-calendar-widget" style="margin-bottom:var(--space-4)">
      <div class="empty-state" style="padding:var(--space-4) 0"><p style="font-size:.85rem">Cargando calendario…</p></div>
    </section>

    <!-- Hero con puntaje estimado -->
    <section class="panel" style="text-align:center;padding:var(--space-10) var(--space-6);">
      <p style="font-size:.8rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:.08em;margin-bottom:var(--space-2)">
        Puntaje ICFES estimado
      </p>
      <div class="score-badge" id="estimated-score" style="font-size:5rem">—</div>
      <p class="score-label">de 500 puntos posibles</p>

      <div class="stats-grid" style="margin-top:var(--space-8);max-width:500px;margin-inline:auto">
        <div class="stat-card">
          <div class="stat-value accent" id="stat-xp">${STATE.student?.xp_total ?? 0}</div>
          <div class="stat-label">XP Total</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" id="stat-streak" style="color:var(--warning)">${STATE.student?.streak_days ?? 0}</div>
          <div class="stat-label">Racha días</div>
        </div>
        <div class="stat-card">
          <div class="stat-value green" id="stat-badges">${STATE.student?.student_badges?.length ?? 0}</div>
          <div class="stat-label">Insignias</div>
        </div>
      </div>
    </section>

    <!-- Predicción de puntaje por área -->
    <section class="panel" id="score-prediction-panel" style="margin-top:var(--space-4)">
      <div class="empty-state" style="padding:var(--space-4) 0"><p style="font-size:.85rem">Cargando predicción…</p></div>
    </section>

    <!-- Selector de modo -->
    <section style="margin-top:var(--space-6)">
      <h2 style="margin-bottom:var(--space-4)">¿Qué practicamos hoy?</h2>
      <div class="stats-grid" id="mode-grid">
        ${renderModeCards()}
      </div>
    </section>

    <!-- Aura de Conocimiento — mapa de calor por tema -->
    <section class="panel" style="margin-top:var(--space-6)">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:var(--space-4)">
        <h3 style="margin:0">🗺️ Aura de Conocimiento</h3>
        <span style="font-size:.75rem;color:var(--text-muted)">
          <span class="heat-legend heat--green">✓ Dominado</span>
          <span class="heat-legend heat--yellow">~ Aprendiendo</span>
          <span class="heat-legend heat--red">✗ Crítico</span>
        </span>
      </div>
      <div id="heatmap-container">
        <div class="empty-state"><p>Cargando…</p></div>
      </div>
    </section>

    <!-- Plan Adaptativo — temas priorizados -->
    <section class="panel" style="margin-top:var(--space-6)">
      <h3 style="margin-bottom:var(--space-2)">🚀 Tu Plan Adaptativo</h3>
      <p style="font-size:.78rem;color:var(--text-muted);margin-bottom:var(--space-4)">
        Ordenado por impacto real: dominar estos temas primero te sube más puntos.
      </p>
      <div id="priority-plan-container">
        <div class="empty-state"><p>Cargando…</p></div>
      </div>
    </section>

    <!-- Certificados -->
    <section class="panel" style="margin-top:var(--space-6);display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap">
      <div>
        <h3 style="margin:0 0 4px">🏅 Certificados</h3>
        <p style="font-size:.8rem;color:var(--text-muted);margin:0" id="cert-count-label">Cargando…</p>
      </div>
      <a href="certificates.html" class="btn btn--ghost btn--sm">Ver todos →</a>
    </section>

    <!-- Leaderboard semanal -->
    <section class="panel" style="margin-top:var(--space-6)">
      <h3 style="margin-bottom:var(--space-4)">🏆 Ranking semanal</h3>
      <div id="leaderboard-list" class="leaderboard-list">
        <div class="empty-state"><p>Cargando ranking…</p></div>
      </div>
    </section>

    <!-- Feed social -->
    <section class="panel" style="margin-top:var(--space-6)">
      <h3 style="margin-bottom:var(--space-4)">📢 Comunidad</h3>
      <div id="social-feed" class="feed-list">
        <div class="empty-state"><p>Cargando actividad…</p></div>
      </div>
    </section>
  `;

  // Cargar datos asíncronos
  computeEstimatedScore();
  loadAdaptivePlan();
  loadLeaderboard();
  loadFeed();
  loadScorePrediction();
  if (window.ExamCalendar && STATE.profile?.user_id) {
    ExamCalendar.renderWidget(STATE.profile.user_id, 'exam-calendar-widget');
  }
  if (window.Certificates && STATE.student?.id) {
    Certificates.getAll(STATE.student.id).then(certs => {
      const el = document.getElementById('cert-count-label');
      if (el) el.textContent = certs.length > 0 ? `${certs.length} obtenido${certs.length > 1 ? 's' : ''}` : 'Completa hitos para desbloquear';
    });
  }
  if (window.Onboarding && STATE.student?.id) {
    Onboarding.renderBar(STATE.student.id, 'onboarding-bar');
  }

  // Re-iniciar widget del guardián (el container ya existe en el innerHTML)
  if (STATE.guardianUserId && window.GuardianWidget) {
    GuardianWidget.init(STATE.guardianUserId, 'guardian-widget-container');
  }

  if (window.BottomNav) { BottomNav.show(); BottomNav.setActive('inicio'); }
}

function renderModeCards() {
  const modes = [
    { id: 'diagnostico', emoji: '🔍', title: 'Diagnóstico',      desc: '20 preguntas mixtas',    onclick: `startSession(20, null, false)` },
    { id: 'practica',    emoji: '🎯', title: 'Práctica libre',    desc: 'Elige una materia',      onclick: `showSubjectPicker(12)` },
    { id: 'simulacro',   emoji: '🏆', title: 'Simulacro rápido',  desc: '45 preguntas mixtas',    onclick: `startSession(45, null, false)` },
    { id: 'repaso',      emoji: '🔄', title: 'Repasar errores',   desc: 'Solo tus debilidades',   onclick: `startSession(15, null, true)` },
    { id: 'reto',        emoji: '⚡', title: 'Reto Temático',     desc: 'Ataca tu mayor debilidad', onclick: `showTopicChallengePicker()` },
    { id: 'batalla',     emoji: '⚔️', title: 'Batalla 1v1',      desc: '+300 XP al ganador',       onclick: `window.location.href='battle.html?new=1&student='+STATE.student.id` },
  ];

  return modes.map(m => `
    <div class="panel panel--elevated" style="cursor:pointer;transition:border-color .2s;border:2px solid var(--border)"
         onmouseenter="this.style.borderColor='var(--accent-purple)'"
         onmouseleave="this.style.borderColor='var(--border)'"
         onclick="${m.onclick}">
      <div style="font-size:2rem;margin-bottom:var(--space-2)">${m.emoji}</div>
      <div style="font-weight:700;margin-bottom:var(--space-1)">${m.title}</div>
      <div style="font-size:.8rem;color:var(--text-muted)">${m.desc}</div>
    </div>
  `).join('');
}

function renderBadges() {
  const badges = STATE.student?.student_badges ?? [];
  if (badges.length === 0) {
    return `<p style="font-size:.85rem;color:var(--text-muted)">Aún no tienes insignias. ¡Responde tu primera pregunta correcta!</p>`;
  }
  return badges.map(sb => `
    <div title="${sb.badges.name}: ${sb.badges.description}"
         style="display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px;
                background:var(--bg-elevated);border:1px solid var(--border);border-radius:12px;
                min-width:70px;text-align:center;cursor:default">
      <span style="font-size:2rem">${sb.badges.icon_url}</span>
      <span style="font-size:.68rem;color:var(--text-secondary);font-weight:600;max-width:70px;
                   overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${sb.badges.name}</span>
    </div>
  `).join('');
}

// ══════════════════════════════════════════════════════════════
//  PUNTAJE ESTIMADO (media ponderada por área)
// ══════════════════════════════════════════════════════════════
async function computeEstimatedScore() {
  const { data } = await supabase
    .from('student_answers')
    .select('is_correct, questions(subject)')
    .eq('student_id', STATE.student.id);

  if (!data || data.length === 0) return;

  const bySubject = {};
  data.forEach(row => {
    const subj = row.questions.subject;
    if (!bySubject[subj]) bySubject[subj] = { ok: 0, total: 0 };
    bySubject[subj].total++;
    if (row.is_correct) bySubject[subj].ok++;
  });

  const subjects = Object.keys(SUBJECTS);
  let totalScore = 0, count = 0;
  subjects.forEach(s => {
    if (bySubject[s] && bySubject[s].total > 0) {
      totalScore += (bySubject[s].ok / bySubject[s].total) * 100;
      count++;
    }
  });

  if (count === 0) return;
  const estimated = Math.round((totalScore / count) * 5); // escala 0–500
  const el = document.getElementById('estimated-score');
  if (el) {
    el.textContent = estimated;
    animateNumber(el, 0, estimated, 800);
  }
}

function animateNumber(el, from, to, duration) {
  const start     = performance.now();
  const tickEvery = window.AudioEvents?.calcTickInterval(from, to, duration) ?? Infinity;
  function step(now) {
    const t       = Math.min(1, (now - start) / duration);
    const current = Math.round(from + (to - from) * easeOut(t));
    el.textContent = current;
    if (current % tickEvery === 0) window.AudioEvents?.onScoreTick(current, from, to);
    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      window.AudioEvents?.onScoreFinale(to);
    }
  }
  requestAnimationFrame(step);
}
const easeOut = t => 1 - Math.pow(1 - t, 3);

// ══════════════════════════════════════════════════════════════
//  RENDIMIENTO POR ÁREA
// ══════════════════════════════════════════════════════════════
async function loadAreaPerformance() {
  const container = document.getElementById('area-chart');
  if (!container) return;

  const { data } = await supabase
    .from('weak_topics')
    .select('subject, error_rate')
    .eq('student_id', STATE.student.id);

  if (!data || data.length === 0) return;

  const bySubject = {};
  data.forEach(row => {
    if (!bySubject[row.subject]) bySubject[row.subject] = [];
    bySubject[row.subject].push(row.error_rate);
  });

  const rows = Object.entries(SUBJECTS).map(([key, label]) => {
    const rates = bySubject[key];
    if (!rates) return `
      <div class="area-row">
        <span class="area-name">${label}</span>
        <div class="area-track"><div class="area-fill" style="width:0%"></div></div>
        <span class="area-pct" style="color:var(--text-muted)">—</span>
      </div>`;

    const avgError = rates.reduce((a, b) => a + b, 0) / rates.length;
    const pct      = Math.round((1 - avgError) * 100);
    const color    = pct >= 70 ? 'var(--gradient-green)' : pct >= 50 ? 'var(--gradient-gold)' : 'linear-gradient(135deg,#ef4444,#dc2626)';
    return `
      <div class="area-row">
        <span class="area-name">${label}</span>
        <div class="area-track">
          <div class="area-fill" style="width:${pct}%;background:${color}"></div>
        </div>
        <span class="area-pct">${pct}%</span>
      </div>`;
  });

  container.innerHTML = rows.join('');
}

// ══════════════════════════════════════════════════════════════
//  LEADERBOARD
// ══════════════════════════════════════════════════════════════
async function loadLeaderboard() {
  const container = document.getElementById('leaderboard-list');
  if (!container) return;

  const { data } = await supabase.rpc('get_weekly_leaderboard', { p_limit: 10 });

  if (!data || data.length === 0) {
    container.innerHTML = `<div class="empty-state"><p>Aún no hay actividad esta semana. ¡Sé el primero!</p></div>`;
    return;
  }

  container.innerHTML = data.map((row, i) => {
    const isFirst = i === 0;
    const isMe    = row.student_id === STATE.student.id;
    return `
      <div class="leaderboard-item ${isFirst ? 'rank-1' : ''} ${isMe ? 'is-me' : ''}"
           style="${isMe ? 'border-color:var(--accent-purple);background:var(--accent-purple-dim)' : ''}">
        <span class="leaderboard-rank">
          ${isFirst ? '<span class="crown">👑</span>' : `#${row.rank_position}`}
        </span>
        <img
          class="avatar avatar--sm"
          src="${row.avatar_url || `https://api.dicebear.com/8.x/thumbs/svg?seed=${row.username}`}"
          alt="${row.username}" />
        <div style="flex:1">
          <div class="leaderboard-name">${row.username} ${isMe ? '<span style="font-size:.7rem;color:var(--accent-purple-light)">(tú)</span>' : ''}</div>
          <div style="display:flex;align-items:center;gap:8px">
            <span class="rank-badge rank--${row.student_rank}">${RANK_LABELS[row.student_rank]}</span>
            <span style="font-size:.7rem;color:var(--text-muted)">${row.badge_count} insignias</span>
          </div>
        </div>
        <span class="leaderboard-xp">+${row.xp_earned} XP</span>
      </div>`;
  }).join('');
}

// ══════════════════════════════════════════════════════════════
//  FEED SOCIAL
async function loadScorePrediction() {
  const panel = document.getElementById('score-prediction-panel');
  if (!panel || !STATE.student?.id || !window.ScorePredictor) return;
  const prediction = await ScorePredictor.getLatest(STATE.student.id);
  panel.innerHTML = ScorePredictor.widgetHTML(prediction);
}

// ══════════════════════════════════════════════════════════════
async function loadFeed() {
  const container = document.getElementById('social-feed');
  if (!container) return;

  const { data } = await supabase
    .from('social_feed')
    .select(`
      *,
      students(
        profile_id,
        profiles(username, avatar_url)
      )
    `)
    .order('created_at', { ascending: false })
    .limit(20);

  if (!data || data.length === 0) {
    container.innerHTML = `<div class="empty-state"><p>El feed está vacío. ¡Empieza a estudiar para aparecer aquí!</p></div>`;
    return;
  }

  container.innerHTML = data.map(item => renderFeedItem(item)).join('');
}

function renderFeedItem(item) {
  const profile  = item.students?.profiles;
  const username = profile?.username ?? 'Alguien';
  const avatar   = profile?.avatar_url ?? `https://api.dicebear.com/8.x/thumbs/svg?seed=${username}`;
  const payload  = item.payload_json ?? {};
  const time     = timeAgo(new Date(item.created_at));

  const templates = {
    badge_unlocked:   () => `desbloqueó la insignia <strong>${payload.badge_name}</strong> ${payload.badge_icon}`,
    level_up:         () => `subió al rango <strong>${RANK_LABELS[payload.new_rank] ?? payload.new_rank}</strong> 🎉`,
    streak_milestone: () => `alcanzó <strong>${payload.days} días</strong> de racha consecutiva 🔥`,
    perfect_session:  () => `tuvo una sesión perfecta ✨`,
    rank_up:          () => `avanzó a <strong>${RANK_LABELS[payload.new_rank] ?? payload.new_rank}</strong>`,
    first_correct:    () => `respondió su primera pregunta correcta en <strong>${SUBJECTS[payload.subject] ?? payload.subject}</strong> ⚡`,
  };

  const eventIcons = { badge_unlocked:'🏅', level_up:'⬆️', streak_milestone:'🔥', perfect_session:'✨', rank_up:'🚀', first_correct:'⚡' };
  const bodyFn = templates[item.event_type];
  const body   = bodyFn ? bodyFn() : `logró algo increíble`;

  return `
    <div class="feed-item">
      <img class="avatar avatar--sm" src="${avatar}" alt="${username}" style="flex-shrink:0" />
      <div class="feed-content">
        <span class="feed-username">${username}</span>
        <span class="feed-text"> ${body}</span>
        <div class="feed-time">${time}</div>
      </div>
      <span class="feed-icon">${eventIcons[item.event_type] ?? '⭐'}</span>
    </div>`;
}

function timeAgo(date) {
  const secs = Math.floor((Date.now() - date) / 1000);
  if (secs < 60)   return 'justo ahora';
  if (secs < 3600) return `hace ${Math.floor(secs / 60)} min`;
  if (secs < 86400)return `hace ${Math.floor(secs / 3600)} h`;
  return `hace ${Math.floor(secs / 86400)} días`;
}

// ══════════════════════════════════════════════════════════════
//  INICIO DE SESIÓN DE ESTUDIO
// ══════════════════════════════════════════════════════════════

/** Muestra un selector de materia antes de iniciar práctica libre. */
window.showSubjectPicker = function(n) {
  const modal = document.createElement('div');
  modal.className = 'level-up-overlay';
  modal.style.zIndex = '200';
  modal.innerHTML = `
    <div class="panel" style="max-width:380px;width:90%;animation:cardIn .3s ease both">
      <h3 style="margin-bottom:var(--space-4)">Elige una materia</h3>
      <div style="display:flex;flex-direction:column;gap:var(--space-2)">
        ${Object.entries(SUBJECTS).map(([key, label]) => `
          <button class="btn btn--ghost btn--full" onclick="startSession(${n}, '${key}', false); document.getElementById('subject-modal').remove()">
            ${label}
          </button>`).join('')}
      </div>
      <button class="btn btn--ghost btn--sm" style="margin-top:var(--space-4);width:100%"
              onclick="this.closest('.level-up-overlay').remove()">Cancelar</button>
    </div>`;
  modal.id = 'subject-modal';
  document.body.appendChild(modal);
};

/**
 * Inicia una nueva sesión de estudio.
 * @param {number} n — número de preguntas
 * @param {string|null} subject — null = todas las áreas
 * @param {boolean} weakOnly — ignorar aleatorias, solo temas débiles
 */
window.startSession = async function(n, subject, weakOnly = false) {
  // Calcular tiempo del bloque
  const blockSecs = subject
    ? (BLOCK_SECS_BY_SUBJECT[subject] ?? BLOCK_SECS_DEFAULT)
    : BLOCK_SECS_DEFAULT;
  // Escalar proporcionalmente si el bloque no es de 20 preguntas
  const scaledSecs = Math.round(blockSecs * (n / 20));

  // Aviso pre-prueba — siempre antes de iniciar
  if (window.PreExamModal) {
    const decision = await PreExamModal.show({
      questions: n,
      minutes:   Math.round(scaledSecs / 60),
      subject:   subject ? SUBJECTS[subject] : null,
    });
    if (decision === 'cancel') return;
  }

  // Resetear estado de sesión
  stopBlockTimer();
  if (window.SafeExit)            SafeExit.destroy();
  if (window.SessionPersistence)  SessionPersistence.stopAutoSave();
  if (window.AudioEvents)         AudioEvents.stopGuardianAmbient();
  if (window.BottomNav)           BottomNav.hide();
  if (window.AnswerLock)          AnswerLock.clearAll();

  STATE.session = {
    id:             crypto.randomUUID(),
    subject:        subject,
    questions:      [],
    currentIdx:     0,
    answers:        {},
    blockSecsTotal: scaledSecs,
    blockSecsLeft:  scaledSecs,
    // Retrocompat:
    timerLeft:      scaledSecs,
    secsPerQ:       SECS_PER_Q_BY_SUBJECT[subject] ?? SECS_PER_Q,
    timerHandle:    null,
    started:        false,
    startedAt:      new Date().toISOString(),
    sessionType:    weakOnly ? 'repaso' : n >= 40 ? 'simulacro' : 'practice',
  };

  const root = document.getElementById('app-root');
  if (root) root.innerHTML = `
    <div class="empty-state" style="padding-top:80px">
      <div style="font-size:2rem;margin-bottom:16px">⏳</div>
      <p>Preparando tus preguntas…</p>
    </div>`;

  // Obtener preguntas
  const questions = await fetchSessionQuestions(n, subject);

  if (!questions || questions.length === 0) {
    showToast('Sin preguntas', 'No se encontraron preguntas para esta configuración.', '⚠️', 'error');
    renderDashboard();
    return;
  }

  STATE.session.questions = questions;
  STATE.session.started   = true;

  // Mostrar el contenedor del reloj por bloque
  const timerContainer = document.getElementById('block-timer-bar-container');
  if (timerContainer && window.BlockTimer) {
    timerContainer.innerHTML = BlockTimer.renderHTML(
      SUBJECTS[subject] ?? 'Bloque',
      STATE.session.blockSecsTotal
    );
    timerContainer.style.display = 'block';
  }

  if (window.SessionPersistence) SessionPersistence.initAutoSave();
  saveSessionToStorage();
  renderQuestion();
  startBlockTimer();
};

// ══════════════════════════════════════════════════════════════
//  RENDER DE PREGUNTA
// ══════════════════════════════════════════════════════════════
function renderQuestion() {
  const root = document.getElementById('app-root');
  if (!root) return;

  const { questions, currentIdx, answers } = STATE.session;
  const q = questions[currentIdx];
  if (!q) { endSession(); return; }

  const n       = questions.length;
  const rawOpts = Array.isArray(q.options_json) ? q.options_json : JSON.parse(q.options_json ?? '[]');
  // Shuffle una vez por pregunta; _shuffled persiste en STATE para que
  // navegar "Anterior/Siguiente" muestre el mismo orden mezclado.
  if (!q._shuffled && window.QuestionRenderer) {
    const { shuffledOpts, newCorrectIndex } = QuestionRenderer.shuffleOptions(rawOpts, q.correct_index);
    q._shuffled = { opts: shuffledOpts, correctIndex: newCorrectIndex };
  }
  const opts    = q._shuffled?.opts ?? rawOpts;
  const saved   = answers[q.id];
  const solved  = !!saved;
  const letters = ['A', 'B', 'C', 'D'];

  root.innerHTML = `
    <!-- Barra de progreso superior -->
    <div style="padding:var(--space-4) var(--space-6) 0">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-2)">
        <span style="font-size:.8rem;color:var(--text-muted)">Pregunta ${currentIdx + 1} de ${n}</span>
        <div style="display:flex;gap:var(--space-2);align-items:center">
          <span class="tag tag--${q.difficulty === 1 ? 'baja' : q.difficulty === 2 ? 'media' : 'alta'}">${q.difficulty === 1 ? 'Básica' : q.difficulty === 2 ? 'Media' : 'Alta'}</span>
          <span class="tag tag--purple">${SUBJECTS[q.subject] ?? q.subject}</span>
          ${window.ContentQuality ? ContentQuality.reportButtonHTML(q.id, STATE.student.id) : ''}
        </div>
      </div>
      <div style="height:4px;background:var(--bg-overlay);border-radius:var(--radius-full);overflow:hidden">
        <div style="height:100%;width:${((currentIdx) / n) * 100}%;background:var(--gradient-brand);border-radius:var(--radius-full);transition:width .4s"></div>
      </div>
    </div>

    <!-- Tarjeta de pregunta -->
    <article class="question-shell" id="question-card">

      ${q.context_text ? `
        <div class="question-context" id="q-context">
          <strong style="font-size:.72rem;text-transform:uppercase;letter-spacing:.06em;color:var(--accent-purple-light);display:block;margin-bottom:8px">Texto base</strong>
          ${escapeHtml(q.context_text)}
        </div>` : ''}

      <p class="question-enunciado">${escapeHtml(q.stem)}</p>

      <ul class="options-list" id="options-list" role="radiogroup" aria-label="Opciones">
        ${opts.map((opt, i) => {
          let cls = '';
          if (solved) {
            const _ci = q._shuffled?.correctIndex ?? q.correct_index;
            if (i === _ci) cls = 'correct';
            else if (i === saved.selected_index) cls = 'incorrect';
          }
          return `
            <li class="option-item ${cls}" id="opt-${i}"
                role="radio" aria-checked="${saved?.selected_index === i}"
                ${solved ? '' : `onclick="selectOption(${i})"`}
                style="${solved ? 'cursor:default' : ''}">
              <span class="option-letter">${letters[i]}</span>
              <span class="option-text">${escapeHtml(opt)}</span>
            </li>`;
        }).join('')}
      </ul>

      ${solved ? `
        ${window.QuestionRenderer
            ? QuestionRenderer.renderExplanation(q, !!STATE.session.answers[q.id]?.is_correct)
            : `<div class="explanation-block" id="explanation-block">
                 <div class="explanation-section">
                   <p class="explanation-label">🧠 CONCEPTO CLAVE</p>
                   <p class="explanation-text">${escapeHtml(q.explanation ?? '')}</p>
                 </div>
               </div>`}
        ${!STATE.session.answers[q.id]?.is_correct ? `
        <div style="margin-top:var(--space-3)">
          <button class="btn btn--hack" id="hack-btn"
                  onclick="toggleHackPrime('${q.id}')">
            ⚡ Ver Hack Prime
          </button>
          <div id="hack-prime-panel" class="hack-prime-panel" style="display:none"></div>
        </div>` : ''}` : ''}

      <!-- Navegación libre -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:var(--space-6)">
        <button class="btn btn--ghost" onclick="navigateQuestion(-1)" ${currentIdx === 0 ? 'disabled' : ''}>← Anterior</button>
        <button class="btn btn--primary" onclick="navigateQuestion(1)" id="btn-next">
          ${currentIdx === n - 1 ? 'Ver resumen' : 'Siguiente →'}
        </button>
      </div>
    </article>

    <!-- Mapa de preguntas numerado -->
    <div id="question-map" class="question-map-container"></div>
  `;

  // Renderizar mapa de navegación
  if (window.QuestionNav) {
    QuestionNav.render(n, currentIdx, answers, questions, (idx) => {
      STATE.session.currentIdx = idx;
      renderQuestion();
    });
  }

  // Safe Exit: inyectar/actualizar botón en cada render de pregunta
  if (window.SafeExit) SafeExit.init();

  // Renderizar fórmulas LaTeX en toda la tarjeta de pregunta
  if (window.QuestionRenderer) {
    QuestionRenderer.renderLatexInElement(document.getElementById('question-card'));
  }
}

// ══════════════════════════════════════════════════════════════
//  INTERACCIÓN: SELECCIONAR OPCIÓN
// ══════════════════════════════════════════════════════════════

/** Resalta visualmente la opción elegida antes de confirmar. */
window.selectOption = async function(index) {
  const q = STATE.session.questions[STATE.session.currentIdx];
  if (!q) return;

  // Verificar límite de plan antes de registrar la respuesta
  if (window.Plans && STATE.student) {
    const allowed = await Plans.canDo(STATE.student.id, 'answer_question');
    if (!allowed) {
      Plans.showPaywall('answer_question');
      return;
    }
  }

  // Mostrar selección visual y confirmar automáticamente
  document.querySelectorAll('.option-item').forEach(el => el.classList.remove('selected'));
  const optEl = document.getElementById(`opt-${index}`);
  if (optEl) optEl.classList.add('selected');

  // Pequeño delay para feedback visual antes de procesar
  await sleep(300);
  await confirmAnswer(index);
};

/**
 * Envía la respuesta a Supabase y muestra el feedback.
 * @param {number} selectedIndex
 */
async function confirmAnswer(selectedIndex) {
  const q = STATE.session.questions[STATE.session.currentIdx];
  if (!q) return;

  // ── CERROJO ANTI-EXPLOIT ──────────────────────────────────────────
  if (window.AnswerLock && AnswerLock.isLocked(q.id)) {
    showAlreadyAnsweredState(q.id);
    return;
  }
  if (STATE.session.answers[q.id]) {
    showAlreadyAnsweredState(q.id);
    return;
  }
  // ─────────────────────────────────────────────────────────────────

  // Tiempo usado estimado: basado en el tiempo restante del bloque
  const blockElapsed = (STATE.session.blockSecsTotal ?? BLOCK_SECS_DEFAULT)
                     - (window.BlockTimer ? BlockTimer.getSecsLeft() : STATE.session.blockSecsLeft ?? 0);
  const timeUsed     = Math.max(1, Math.round(blockElapsed / Math.max(1,
                       Object.keys(STATE.session.answers).length + 1)));

  const isCorrect = selectedIndex === (q._shuffled?.correctIndex ?? q.correct_index);

  // Guardar en estado local ANTES del await — primera barrera contra race condition.
  STATE.session.answers[q.id] = {
    selected_index: selectedIndex,
    is_correct:     isCorrect,
    time_seconds:   timeUsed,
  };

  // Activar cerrojo en memoria ANTES de la llamada de red.
  if (window.AnswerLock) {
    AnswerLock.lock(q.id, { selectedOption: selectedIndex, isCorrect, xpAwarded: 0 });
  }

  // Navegación libre: NO se deshabilita el botón Anterior
  // _disableBackButton() eliminado — el estudiante puede revisar sus respuestas

  saveSessionToStorage();

  // Retroalimentación sonora inmediata (no espera al servidor)
  if (window.AudioEvents) {
    if (isCorrect) AudioEvents.onAnswerCorrect();
    else           AudioEvents.onAnswerWrong();
  }

  try {
    // Llamar a la función SQL que procesa todo (respuesta + XP + racha + badges)
    const { data, error } = await supabase.rpc('process_answer', {
      p_student_id:   STATE.student.id,
      p_question_id:  q.id,
      p_selected_idx: selectedIndex,
      p_time_seconds: timeUsed,
      p_session_id:   STATE.session.id,
    });

    if (error) throw error;

    const result = data;

    // Mostrar feedback de XP ganado
    if (result.xp_earned > 0) {
      const optEl = document.getElementById(`opt-${selectedIndex}`);
      if (optEl) showXpPop(optEl, result.xp_earned, result.multiplier);
      showToast(
        `+${result.xp_earned} XP`,
        buildXpMessage(result),
        '⚡',
        'xp'
      );
    }

    // Recargar datos del estudiante para actualizar header
    await loadStudentData();
    renderHeader();

  } catch (err) {
    console.error('[O500] confirmAnswer error:', err.message);
    // Aunque falle el servidor, el feedback local ya se muestra
  }

  // Re-renderizar la pregunta con la respuesta marcada
  renderQuestion();
}

// ── Helpers del cerrojo ──────────────────────────────────────────────

function _disableBackButton() {
  const btn = document.querySelector('[onclick="navigateQuestion(-1)"]');
  if (!btn) return;
  btn.disabled = true;
  btn.classList.add('opacity-30');
  btn.style.cursor = 'not-allowed';
  btn.setAttribute('title', 'No puedes retroceder tras confirmar');
}

function showAlreadyAnsweredState(questionId) {
  const result = window.AnswerLock ? AnswerLock.getResult(questionId)
                                   : STATE.session.answers[questionId]
                                     ? { selectedOption: STATE.session.answers[questionId].selected_index,
                                         isCorrect:      STATE.session.answers[questionId].is_correct }
                                     : null;

  // Deshabilitar todas las opciones
  document.querySelectorAll('.option-item').forEach(btn => {
    btn.style.pointerEvents = 'none';
    btn.style.opacity = '0.6';
  });

  // Resaltar la opción previamente seleccionada
  if (result) {
    const sel = document.getElementById(`opt-${result.selectedOption}`);
    if (sel) {
      sel.style.opacity = '1';
      sel.classList.add(result.isCorrect ? 'correct' : 'incorrect');
    }
  }

  showLockedBanner();
}

function showLockedBanner() {
  if (document.getElementById('locked-banner')) return;
  const banner = document.createElement('div');
  banner.id = 'locked-banner';
  banner.style.cssText = [
    'position:fixed', 'top:72px', 'left:50%', 'transform:translateX(-50%)',
    'z-index:var(--z-sticky)', 'background:var(--bg-card)',
    'border:1px solid var(--border)', 'border-radius:var(--radius-lg)',
    'padding:8px 16px', 'font-size:.75rem', 'color:var(--text-muted)',
    'display:flex', 'align-items:center', 'gap:8px', 'white-space:nowrap',
  ].join(';');
  banner.innerHTML = `<span style="color:var(--color-success)">✓</span> Esta pregunta ya fue respondida en esta sesión`;
  document.body.appendChild(banner);
  setTimeout(() => banner.remove(), 3000);
}

// Evitar que el botón Atrás del navegador permita re-responder una pregunta bloqueada.
window.addEventListener('popstate', (e) => {
  if (!STATE.session?.questions?.length) return;
  const prevId = e.state?.questionId;
  if (prevId && window.AnswerLock && AnswerLock.isLocked(prevId)) {
    history.forward();
    showLockedBanner();
  }
});

function buildXpMessage(result) {
  const parts = [`+${result.xp_earned} XP ganados`];
  if (result.speed_bonus > 0)  parts.push(`🚀 bono velocidad +${result.speed_bonus}`);
  if (result.streak_bonus > 0) parts.push(`🔥 bono racha +${result.streak_bonus}`);
  if (result.multiplier > 1)   parts.push(`×${result.multiplier} fin de semana`);
  return parts.join(' · ');
}

// ══════════════════════════════════════════════════════════════
//  NAVEGACIÓN ENTRE PREGUNTAS
// ══════════════════════════════════════════════════════════════
window.navigateQuestion = function(direction) {
  const { questions, currentIdx } = STATE.session;
  const next = currentIdx + direction;

  if (next < 0) return;

  // Al presionar "Ver resumen" en la última pregunta → mostrar resumen previo al envío
  if (next >= questions.length) {
    renderPreSubmitSummary();
    return;
  }

  STATE.session.currentIdx = next;
  // El reloj de bloque NO se resetea al navegar — sigue corriendo
  renderQuestion();
};

// ── Calcula la máxima racha de respuestas correctas consecutivas ──
function computeRachaConsecutiva() {
  const { questions, answers } = STATE.session;
  let max = 0, cur = 0;
  for (const q of questions) {
    if (answers[q.id]?.is_correct) { cur++; max = Math.max(max, cur); }
    else cur = 0;
  }
  return max;
}

// ══════════════════════════════════════════════════════════════
//  FIN DE SESIÓN
// ══════════════════════════════════════════════════════════════
async function endSession() {
  stopBlockTimer();
  clearSavedSession();

  // Ocultar el reloj por bloque
  const timerContainer = document.getElementById('block-timer-bar-container');
  if (timerContainer) timerContainer.style.display = 'none';
  if (window.SafeExit)           SafeExit.destroy();
  if (window.SessionPersistence) {
    SessionPersistence.stopAutoSave();
    if (STATE.student?.id) SessionPersistence.clearDraft(STATE.student.id).catch(() => {});
  }

  const { questions, answers } = STATE.session;
  const total     = questions.length;
  const correct   = Object.values(answers).filter(a => a.is_correct).length;
  const pct       = Math.round((correct / total) * 100);
  const isPerfect = correct === total;

  // Alimentar al guardián con los resultados de la sesión
  if (STATE.guardianUserId && window.Guardian) {
    try {
      const racha        = computeRachaConsecutiva();
      const energiaDelta = correct * 8 + (racha >= 10 ? 20 : 0);
      const result       = await Guardian.alimentar(STATE.guardianUserId, {
        correctas:        correct,
        rachaConsecutiva: racha,
      });
      if (result?.nivelSubio) {
        Guardian.mostrarEvolucion(result.guardian, result.nivelAntes, result.nivelAhora);
        if (window.AudioEvents) AudioEvents.onLevelUp(result.nivelAhora);
      }
      if (window.GuardianWidget && energiaDelta > 0) {
        GuardianWidget.gainEnergy(energiaDelta);
      }
    } catch (e) { console.error('[Guardian] alimentar:', e); }
  }

  // Recalcular predicción si hay suficientes respuestas (fire-and-forget)
  if (window.ScorePredictor && STATE.student?.id && total >= 10) {
    ScorePredictor.calculateAndSave(STATE.student.id).catch(() => {});
  }

  // Evaluar y otorgar certificados nuevos (fire-and-forget)
  if (window.Certificates && STATE.student?.id) {
    Certificates.evaluate(STATE.student.id).then(newCerts => {
      (newCerts ?? []).forEach(key => {
        const [type, subject] = key.split(':');
        Certificates.showNewCertToast(type, subject);
      });
    }).catch(() => {});
  }

  if (isPerfect && total >= 5) {
    showLevelUpModal('✨', '¡Sesión perfecta!', `${correct}/${total} — Sin errores. Eres increíble.`);
    // Marcar en feed
    await supabase.from('social_feed').insert({
      student_id: STATE.student.id,
      event_type: 'perfect_session',
      payload_json: { correct, total },
    });
  }

  const root = document.getElementById('app-root');
  if (!root) return;

  // Mostrar puntaje inmediatamente + skeleton del diagnóstico
  root.innerHTML = `
    <div class="panel resultado-container" style="max-width:520px;margin:var(--space-10) auto">
      <div style="text-align:center;padding-bottom:var(--space-6);border-bottom:1px solid var(--border)">
        <div style="font-size:3rem;margin-bottom:var(--space-3)">${pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '💪'}</div>
        <h2 style="margin-bottom:var(--space-1)">Sesión completada</h2>
        <div class="score-badge" style="font-size:3.5rem">${correct}/${total}</div>
        <p class="score-label">${pct}% de aciertos</p>
        <div class="stats-grid" style="margin:var(--space-5) 0 0">
          <div class="stat-card">
            <div class="stat-value green">${correct}</div>
            <div class="stat-label">Correctas</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" style="color:var(--error)">${total - correct}</div>
            <div class="stat-label">Errores</div>
          </div>
        </div>
      </div>

      <div id="diagnostico-ia-section">
        ${!isPerfect ? _renderSkeletonDiagnostico() : '<p style="text-align:center;color:var(--accent-green-light);font-weight:600;padding:var(--space-6) 0">¡Sesión perfecta! Sin errores 🎉</p>'}
      </div>

      ${renderReview()}

      <div style="display:flex;gap:var(--space-3);justify-content:center;margin-top:var(--space-6)">
        <button class="btn btn--primary" onclick="renderDashboard()">← Volver al inicio</button>
        <button class="btn btn--ghost" onclick="startSession(${total}, null, false)">Otra sesión</button>
      </div>
    </div>`;

  // Fire-and-forget: llenar sección diagnóstico sin bloquear el render
  if (!isPerfect && window.Diagnostico && window.IaDiagnostico) {
    _cargarDiagnosticoIA(
      questions, answers,
      STATE.session.subject,
      STATE.session.blockSecsTotal,
      STATE.session.blockSecsLeft,
    ).catch(() => {});
  }

  // Actualizar dashboard datos
  await loadStudentData();
}

// ─── DIAGNÓSTICO IA — helpers ──────────────────────────────────────────────

function _renderSkeletonDiagnostico() {
  return `
    <div class="diagnostico-wrap" aria-busy="true" aria-label="Generando diagnóstico…">
      <div class="diagnostico-header-tag">PLAN DE ACCIÓN — analizando tus errores…</div>
      <div class="skel-card"></div>
      <div class="skel-card skel-card--mid"></div>
      <div class="skel-card skel-card--sm"></div>
    </div>`;
}

async function _cargarDiagnosticoIA(questions, answers, subject, blockSecsTotal, blockSecsLeft) {
  const section = document.getElementById('diagnostico-ia-section');
  if (!section) return;

  const payload = Diagnostico.construirPayload({ subject, questions, answers, blockSecsTotal, blockSecsLeft });

  if (Object.keys(payload.erroresPorTema).length === 0) {
    section.innerHTML = '';
    return;
  }

  const diag = await IaDiagnostico.generarDiagnostico(payload);

  if (!section.isConnected) return; // usuario navegó fuera

  if (diag?.quiebre_principal) {
    section.innerHTML = _renderDiagnosticoIA(diag);
  } else {
    section.innerHTML = _renderFallbackDiagnostico(payload.erroresPorTema);
  }
}

function _renderDiagnosticoIA(diag) {
  const fuentes = (diag.fuentes_recomendadas ?? []).slice(0, 3);
  return `
    <div class="diagnostico-wrap">
      <div class="diagnostico-header-tag">PLAN DE ACCIÓN PERSONALIZADO</div>
      <p class="diagnostico-subtitulo">Generado por IA según tus errores específicos</p>

      <div class="diag-card diag-card--quiebre">
        <div class="diag-card__label">DEBILIDAD DETECTADA</div>
        <h3 class="diag-card__title">${escapeHtml(diag.quiebre_principal.descripcion)}</h3>
        <p class="diag-card__example">Ejemplo: ${escapeHtml(diag.quiebre_principal.ejemplo)}</p>
      </div>

      ${fuentes.length ? `
      <div class="diag-card">
        <div class="diag-card__label">ESTUDIA AQUÍ ESTA NOCHE</div>
        ${fuentes.map(f => `
          <a class="diag-fuente" href="${escapeHtml(f.url)}" target="_blank" rel="noopener noreferrer">
            <div class="diag-fuente__info">
              <span class="diag-fuente__nombre">${escapeHtml(f.nombre)}</span>
              <span class="diag-fuente__desc">${escapeHtml(f.descripcion)}</span>
            </div>
            <span class="diag-fuente__arrow">→</span>
          </a>`).join('')}
      </div>` : ''}

      <div class="diag-card diag-card--reto">
        <div class="diag-card__label">TU MISIÓN ANTES DEL PRÓXIMO BLOQUE</div>
        <p class="diag-card__reto">${escapeHtml(diag.micro_reto)}</p>
      </div>

      <div class="diag-cierre">
        <p>"${escapeHtml(diag.frase_cierre)}"</p>
      </div>
    </div>`;
}

function _renderFallbackDiagnostico(erroresPorTema) {
  const tops = Object.entries(erroresPorTema).slice(0, 3);
  return `
    <div class="diagnostico-wrap">
      <div class="diagnostico-header-tag">TEMAS A REPASAR</div>
      <div class="diag-card">
        ${tops.map(([tema, n]) => `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:var(--space-3) 0;border-bottom:1px solid var(--border)">
            <span style="font-size:.9rem">${escapeHtml(tema.replace(/_/g, ' '))}</span>
            <span style="color:var(--error);font-weight:600">${n} error${n > 1 ? 'es' : ''}</span>
          </div>`).join('')}
      </div>
    </div>`;
}

function renderReview() {
  const { questions, answers } = STATE.session;
  const errors = questions.filter(q => {
    const a = answers[q.id];
    return a && !a.is_correct;
  });

  if (errors.length === 0) return `<p style="color:var(--accent-green-light);font-weight:600">¡Sin errores en esta sesión! 🎉</p>`;

  const opts = q => Array.isArray(q.options_json) ? q.options_json : JSON.parse(q.options_json ?? '[]');
  const letters = ['A', 'B', 'C', 'D'];

  return `
    <div style="text-align:left;margin-top:var(--space-6)">
      <h3 style="margin-bottom:var(--space-4)">📝 Revisión de errores</h3>
      ${errors.slice(0, 5).map(q => {
        const a = answers[q.id];
        const options = q._shuffled?.opts ?? opts(q);
        const _ci = q._shuffled?.correctIndex ?? q.correct_index;
        return `
          <div style="padding:var(--space-4);background:var(--bg-elevated);border:1px solid var(--border);border-radius:var(--radius-lg);margin-bottom:var(--space-3)">
            <p style="font-size:.875rem;font-weight:500;margin-bottom:var(--space-3)">${escapeHtml(q.stem.slice(0, 150))}${q.stem.length > 150 ? '…' : ''}</p>
            <p style="font-size:.8rem;color:var(--error)">Tu respuesta: ${letters[a.selected_index]}. ${escapeHtml(options[a.selected_index] ?? '')}</p>
            <p style="font-size:.8rem;color:var(--accent-green-light)">Correcta: ${letters[_ci]}. ${escapeHtml(options[_ci] ?? '')}</p>
            <p style="font-size:.78rem;color:var(--text-muted);margin-top:var(--space-2)">${escapeHtml(q.explanation.slice(0, 200))}</p>
          </div>`;
      }).join('')}
      ${errors.length > 5 ? `<p style="font-size:.8rem;color:var(--text-muted)">…y ${errors.length - 5} errores más. Revísalos en tu historial.</p>` : ''}
    </div>`;
}

// ══════════════════════════════════════════════════════════════
//  RELOJ POR BLOQUE (reemplaza el timer por pregunta)
// ══════════════════════════════════════════════════════════════

/** Arranca el BlockTimer global para la sesión activa. */
function startBlockTimer() {
  if (!window.BlockTimer) return;

  const total   = STATE.session.blockSecsTotal ?? BLOCK_SECS_DEFAULT;
  const resume  = STATE.session.blockSecsLeft !== total ? STATE.session.blockSecsLeft : null;

  BlockTimer.start(
    total,
    // onTick: guardar tiempo restante en STATE para persistencia
    (secsLeft) => {
      STATE.session.blockSecsLeft = secsLeft;
      STATE.session.timerLeft     = secsLeft; // retrocompat SessionPersistence
    },
    // onExpire: tiempo agotado → envío automático
    () => {
      showToast('⏰ Tiempo agotado', 'El bloque terminó. Enviando respuestas…', '⏰', 'error');
      setTimeout(() => endSession(), 1500);
    },
    resume
  );
}

/** Detiene el BlockTimer (al salir, al enviar, al pausar). */
function stopBlockTimer() {
  if (window.BlockTimer) BlockTimer.stop();
  // Limpiar el setInterval legacy si existía
  if (STATE.session?.timerHandle) {
    clearInterval(STATE.session.timerHandle);
    STATE.session.timerHandle = null;
  }
}

/** Alias de compatibilidad — llamado en clearTimer() legacy. */
function clearTimer() { stopBlockTimer(); }

const formatTime = s => `${Math.floor(Math.abs(s) / 60)}:${String(Math.abs(s) % 60).padStart(2,'0')}`;

// ── Pantalla de resumen antes de enviar ──────────────────────
function renderPreSubmitSummary() {
  const root = document.getElementById('app-root');
  if (!root) return;

  const { questions, answers } = STATE.session;
  const n           = questions.length;
  const answered    = Object.keys(answers).length;
  const unanswered  = n - answered;
  const secsLeft    = window.BlockTimer ? BlockTimer.getSecsLeft() : 0;

  root.innerHTML = `
    <div class="block-timer-wrap" id="block-timer-wrap">
      ${window.BlockTimer ? BlockTimer.renderHTML(
          SUBJECTS[STATE.session.subject] ?? 'Bloque',
          STATE.session.blockSecsTotal,
          secsLeft
        ) : ''}
    </div>
    <div class="panel" style="max-width:500px;margin:var(--space-8) auto;text-align:center">
      <div style="font-size:2.5rem;margin-bottom:var(--space-4)">📋</div>
      <h2 style="margin-bottom:var(--space-2)">¿Enviar respuestas?</h2>
      <p style="color:var(--text-muted);margin-bottom:var(--space-6);font-size:.9rem">
        Revisa tu progreso antes de enviar.
      </p>

      <div class="stats-grid" style="margin-bottom:var(--space-6)">
        <div class="stat-card">
          <div class="stat-value" style="color:var(--accent-green-light)">${answered}</div>
          <div class="stat-label">Respondidas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" style="color:${unanswered > 0 ? 'var(--warning)' : 'var(--text-muted)'}">${unanswered}</div>
          <div class="stat-label">Sin responder</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" style="color:var(--info)">${formatTime(secsLeft)}</div>
          <div class="stat-label">Tiempo restante</div>
        </div>
      </div>

      <!-- Mapa de preguntas en resumen -->
      <div id="question-map" class="question-map-container" style="margin-bottom:var(--space-6)"></div>

      ${unanswered > 0 ? `
        <div style="background:rgba(245,158,11,.1);border:1px solid rgba(245,158,11,.3);border-radius:var(--radius-lg);padding:var(--space-3) var(--space-4);margin-bottom:var(--space-4);font-size:.85rem;color:#fbbf24">
          ⚠️ Tienes <strong>${unanswered}</strong> pregunta${unanswered > 1 ? 's' : ''} sin responder.
          Puedes volver y responderlas antes de enviar.
        </div>` : ''}

      <div style="display:flex;gap:var(--space-3);justify-content:center;flex-wrap:wrap">
        <button class="btn btn--ghost" onclick="STATE.session.currentIdx = ${n - 1}; renderQuestion()">← Volver</button>
        <button class="btn btn--primary" onclick="window.submitBlock()" id="btn-submit-block">Enviar ✓</button>
      </div>
    </div>`;

  // Renderizar mapa de navegación en el resumen
  if (window.QuestionNav) {
    QuestionNav.render(n, -1, answers, questions, (idx) => {
      STATE.session.currentIdx = idx;
      renderQuestion();
    });
  }
}

/**
 * Envía todas las respuestas pendientes (sin responder) como incorrectas,
 * luego termina la sesión.
 */
window.submitBlock = async function() {
  stopBlockTimer();

  // Marcar preguntas sin responder como omitidas
  const { questions, answers, id: sessionId } = STATE.session;
  const pending = questions.filter(q => !answers[q.id]);

  if (pending.length > 0) {
    const inserts = pending.map(q => ({
      student_id:     STATE.student.id,
      question_id:    q.id,
      selected_index: 0,
      is_correct:     false,
      time_seconds:   STATE.session.blockSecsTotal ?? BLOCK_SECS_DEFAULT,
      session_id:     sessionId,
    }));
    try {
      await supabase.from('student_answers').insert(inserts);
      // Actualizar weak_topics en background
      pending.forEach(q => {
        supabase.rpc('update_weak_topic', {
          p_student_id: STATE.student.id,
          p_subject:    q.subject,
          p_topic:      q.topic,
          p_is_correct: false,
        }).catch(() => {});
        // Registrar en answers locales también
        STATE.session.answers[q.id] = {
          selected_index: -1,
          is_correct:     false,
          time_seconds:   STATE.session.blockSecsTotal,
        };
      });
    } catch (err) {
      console.error('[O500] submitBlock insert omitidas:', err.message);
    }
  }

  endSession();
};

// ══════════════════════════════════════════════════════════════
//  PERSISTENCIA LOCAL (reanudar sesión)
// ══════════════════════════════════════════════════════════════
const SESSION_KEY = 'O500_SESSION_V2';

function saveSessionToStorage() {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      ...STATE.session,
      timerHandle: null,  // no serializable
      savedAt: Date.now(),
    }));
  } catch {}
}

function loadSavedSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    // Descartar si tiene más de 2 horas
    if (Date.now() - s.savedAt > 2 * 3600 * 1000) { clearSavedSession(); return null; }
    return s;
  } catch { return null; }
}

function clearSavedSession() {
  localStorage.removeItem(SESSION_KEY);
}

function offerResume(saved) {
  const remaining = saved.questions.length - saved.currentIdx;
  showToast(
    'Sesión pendiente',
    `Tenías ${remaining} preguntas por responder. Toca aquí para continuar.`,
    '🔄',
    'xp'
  );
  // Click en el toast para continuar
  document.querySelector('.toast')?.addEventListener('click', () => {
    STATE.session = { ...saved, timerHandle: null };
    STATE.session.timerLeft = STATE.session.secsPerQ ?? SECS_PER_Q; // reiniciar timer al reanudar
    renderQuestion();
  }, { once: true });
}

// ══════════════════════════════════════════════════════════════
//  REALTIME — actualizaciones en vivo
// ══════════════════════════════════════════════════════════════
function setupRealtime() {
  // Canal de cambios en el perfil del estudiante (XP, streak, rank)
  const studentChannel = subscribeToStudentChanges(STATE.student.id, (payload) => {
    const updated = payload.new;
    if (!updated) return;
    STATE.student = { ...STATE.student, ...updated };
    renderHeader();
  });

  // Canal del feed social (notificaciones en vivo)
  const feedChannel = subscribeToFeed((payload) => {
    const item = payload.new;
    if (!item) return;

    const feedEl = document.getElementById('social-feed');
    if (!feedEl) return;

    // Quitar empty state si existe
    feedEl.querySelector('.empty-state')?.remove();

    // Precargar perfil del autor para el render
    supabase
      .from('students')
      .select('profile_id, profiles(username, avatar_url)')
      .eq('id', item.student_id)
      .single()
      .then(({ data }) => {
        const enriched = { ...item, students: data };
        const div = document.createElement('div');
        div.innerHTML = renderFeedItem(enriched);
        feedEl.prepend(div.firstElementChild);
      });
  });

  STATE.realtimeChannels = [studentChannel, feedChannel];
}

// ══════════════════════════════════════════════════════════════
//  UTILIDADES DE UI
// ══════════════════════════════════════════════════════════════

/** Toast flotante en esquina inferior derecha. */
function showToast(title, desc, icon = '⭐', type = 'xp') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <div class="toast-body">
      <div class="toast-title">${escapeHtml(title)}</div>
      <div class="toast-desc">${escapeHtml(desc)}</div>
    </div>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }, 4000);
}

/** Animación de XP flotante sobre el elemento seleccionado. */
function showXpPop(anchorEl, xp, multiplier) {
  const rect = anchorEl.getBoundingClientRect();
  const pop  = document.createElement('div');
  pop.className = 'xp-pop';
  pop.textContent = `+${xp} XP${multiplier > 1 ? ` ×${multiplier}` : ''}`;
  pop.style.left = `${rect.left + rect.width / 2}px`;
  pop.style.top  = `${rect.top + window.scrollY}px`;
  document.body.appendChild(pop);
  pop.addEventListener('animationend', () => pop.remove(), { once: true });
}

/** Modal de celebración para level-up / sesión perfecta. */
function showLevelUpModal(emoji, title, subtitle) {
  // Eliminar modal previo si existe
  document.getElementById('level-up-overlay')?.remove();

  const overlay = document.createElement('div');
  overlay.className = 'level-up-overlay';
  overlay.id = 'level-up-overlay';

  // Partículas
  const particlesHtml = Array.from({ length: 16 }, (_, i) => {
    const angle  = (i / 16) * 360;
    const dist   = 80 + Math.random() * 80;
    const tx     = Math.cos((angle * Math.PI) / 180) * dist;
    const ty     = Math.sin((angle * Math.PI) / 180) * dist;
    const colors = ['#7C3AED','#10B981','#F59E0B','#3B82F6','#EC4899'];
    const color  = colors[i % colors.length];
    const delay  = (Math.random() * .4).toFixed(2);
    const dur    = (.8 + Math.random() * .6).toFixed(2);
    return `<div class="particle" style="
      left:50%;top:50%;
      background:${color};
      --tx:${tx}px;--ty:${ty}px;
      --dur:${dur}s;--delay:${delay}s"></div>`;
  }).join('');

  overlay.innerHTML = `
    <div class="level-up-card">
      <div class="particles">${particlesHtml}</div>
      <div class="level-up-emoji">${emoji}</div>
      <h2 class="level-up-title">${escapeHtml(title)}</h2>
      <p class="level-up-sub">${escapeHtml(subtitle)}</p>
      <button class="btn btn--primary" style="margin-top:var(--space-6)"
              onclick="document.getElementById('level-up-overlay').remove()">
        ¡Genial!
      </button>
    </div>`;

  document.body.appendChild(overlay);

  // Cerrar al hacer clic fuera de la card
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.remove();
  });
}

// ── Helpers ───────────────────────────────────────────────────
function escapeHtml(str) {
  if (typeof str !== 'string') return String(str ?? '');
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ══════════════════════════════════════════════════════════════
//  PLAN ADAPTATIVO — carga heatmap + plan prioritario
// ══════════════════════════════════════════════════════════════
async function loadAdaptivePlan() {
  if (!STATE.student || typeof AdaptivePlan === 'undefined') return;
  const weakTopics  = await AdaptivePlan.load(STATE.student.id);
  const prioritized = AdaptivePlan.computePriority(weakTopics);
  AdaptivePlan.renderHeatmap('heatmap-container', weakTopics);
  AdaptivePlan.renderPriorityPlan('priority-plan-container', prioritized);
}

// ══════════════════════════════════════════════════════════════
//  RETO TEMÁTICO — selector y arranque de sesión por tema
// ══════════════════════════════════════════════════════════════
window.showTopicChallengePicker = async function() {
  // Obtener los 3 temas más débiles del estudiante
  const { data: weak } = await supabase
    .from('weak_topics')
    .select('subject, topic, error_rate')
    .eq('student_id', STATE.student.id)
    .gt('error_rate', 0.3)
    .order('error_rate', { ascending: false })
    .limit(3);

  const modal = document.createElement('div');
  modal.className = 'level-up-overlay';
  modal.style.zIndex = '200';
  modal.id = 'topic-picker-modal';

  const weakRows = weak && weak.length > 0
    ? `<div style="margin-bottom:var(--space-4)">
        <p style="font-size:.8rem;color:var(--text-muted);margin-bottom:var(--space-2)">
          🔥 Tus temas más débiles ahora:
        </p>
        ${weak.map(w => `
          <button class="btn btn--primary btn--full" style="margin-bottom:6px;text-align:left;justify-content:space-between"
                  onclick="startTopicChallenge('${w.subject}', '${w.topic.replace(/'/g, "\\'")}'); document.getElementById('topic-picker-modal').remove()">
            <span>${escapeHtml(w.topic)}</span>
            <span style="font-size:.75rem;opacity:.8">${Math.round((1-w.error_rate)*100)}% dominio</span>
          </button>`).join('')}
       </div>`
    : '';

  modal.innerHTML = `
    <div class="panel" style="max-width:420px;width:90%;animation:cardIn .3s ease both">
      <h3 style="margin-bottom:var(--space-4)">⚡ Reto Temático</h3>
      ${weakRows}
      <p style="font-size:.8rem;color:var(--text-muted);margin-bottom:var(--space-2)">
        O elige un área completa:
      </p>
      <div style="display:flex;flex-direction:column;gap:var(--space-2)">
        ${Object.entries(SUBJECTS).map(([key, label]) => `
          <button class="btn btn--ghost btn--full"
                  onclick="startTopicChallenge('${key}'); document.getElementById('topic-picker-modal').remove()">
            ${SUBJECT_ICONS_MAP[key] ?? ''} ${label}
          </button>`).join('')}
      </div>
      <button class="btn btn--ghost btn--sm" style="margin-top:var(--space-4);width:100%"
              onclick="document.getElementById('topic-picker-modal').remove()">Cancelar</button>
    </div>`;

  document.body.appendChild(modal);
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
};

// Mapa de íconos accesible desde HTML inline
const SUBJECT_ICONS_MAP = {
  matematicas:        '📐',
  lectura_critica:    '📖',
  ciencias_naturales: '🔬',
  sociales:           '🌎',
  ingles:             '🇬🇧',
};

/**
 * Inicia una sesión de 10 preguntas enfocada en un área y/o tema específico.
 * Si se pasa topic, filtra las preguntas por ese tema.
 * Si solo se pasa subject, usa el mecanismo estándar (ya prioriza temas débiles).
 */
window.startTopicChallenge = async function(subject, topic = null) {
  if (topic) {
    await startSessionByTopic(subject, topic);
  } else {
    startSession(10, subject, false);
  }
};

async function startSessionByTopic(subject, topic) {
  clearTimer();

  const root = document.getElementById('app-root');
  if (root) root.innerHTML = `
    <div class="empty-state" style="padding-top:80px">
      <div style="font-size:2rem;margin-bottom:16px">⚡</div>
      <p>Preparando Reto Temático: ${escapeHtml(topic)}…</p>
    </div>`;

  // Buscar preguntas del tema específico
  const { data: questions, error } = await supabase
    .from('questions')
    .select('*')
    .eq('subject', subject)
    .ilike('topic', `%${topic.slice(0, 30)}%`)
    .limit(30);

  if (error || !questions || questions.length === 0) {
    showToast('Sin preguntas', `No hay preguntas para: ${topic}`, '⚠️', 'error');
    renderDashboard();
    return;
  }

  // Shuffle y limitar a 10
  const shuffled = questions.sort(() => Math.random() - 0.5).slice(0, 10);

  if (window.SafeExit)           SafeExit.destroy();
  if (window.SessionPersistence) SessionPersistence.stopAutoSave();
  if (window.AudioEvents)        AudioEvents.stopGuardianAmbient();
  if (window.AnswerLock)         AnswerLock.clearAll();

  const n          = shuffled.length;
  const blockSecs  = Math.round((BLOCK_SECS_BY_SUBJECT[subject] ?? BLOCK_SECS_DEFAULT) * (n / 20));
  STATE.session = {
    id:             crypto.randomUUID(),
    subject:        subject,
    topic:          topic,
    questions:      shuffled,
    currentIdx:     0,
    answers:        {},
    blockSecsTotal: blockSecs,
    blockSecsLeft:  blockSecs,
    timerLeft:      blockSecs,
    secsPerQ:       SECS_PER_Q_BY_SUBJECT[subject] ?? SECS_PER_Q,
    timerHandle:    null,
    started:        true,
    startedAt:      new Date().toISOString(),
    sessionType:    'practice',
  };

  if (window.SessionPersistence) SessionPersistence.initAutoSave();
  saveSessionToStorage();
  renderQuestion();
  startBlockTimer();
}

// ══════════════════════════════════════════════════════════════
//  HACK PRIME — panel de 3 bullets tras respuesta incorrecta
// ══════════════════════════════════════════════════════════════
window.toggleHackPrime = function(qId) {
  const panel = document.getElementById('hack-prime-panel');
  const btn   = document.getElementById('hack-btn');
  if (!panel || !btn) return;

  if (panel.style.display !== 'none') {
    panel.style.display = 'none';
    btn.textContent = '⚡ Ver Hack Prime';
    return;
  }

  const q = STATE.session.questions.find(q => q.id === qId);
  if (!q) return;

  const bullets = AdaptivePlan.getHackPrime(q);
  panel.innerHTML = `
    <div class="hack-header">
      <span class="hack-badge">⚡ HACK PRIME</span>
      <span style="font-size:.72rem;color:var(--text-muted)">Llega a la respuesta en &lt;40 seg</span>
    </div>
    <ul class="hack-bullets">
      ${bullets.map(b => `<li>${b}</li>`).join('')}
    </ul>`;

  panel.style.display = 'block';
  btn.textContent = '⚡ Ocultar Hack';
};

// ══════════════════════════════════════════════════════════════
//  LOGOUT
// ══════════════════════════════════════════════════════════════
window.signOut = async function() {
  await supabase.auth.signOut();
  window.location.href = './login.html';
};

// ── Exponer para onclick en HTML ──────────────────────────────
window.renderDashboard  = renderDashboard;
window.startSession     = startSession;
window.navigateQuestion = navigateQuestion;
