// adaptive-plan.js — Motor de Aprendizaje Adaptativo +500 AURA
// Depende de: supabase (global), escapeHtml (global de app.js)

const SUBJECT_ICONS = {
  matematicas:        '📐',
  lectura_critica:    '📖',
  ciencias_naturales: '🔬',
  sociales:           '🌎',
  ingles:             '🇬🇧',
};

// Mapa de prerequisitos: si fallas en un tema avanzado,
// el sistema detecta qué tema base lo está bloqueando.
const TOPIC_PREREQUISITES = {
  matematicas: {
    'Funciones cuadráticas':           ['Álgebra y funciones'],
    'Geometría analítica':             ['Geometría'],
    'Probabilidad y conteo':           ['Estadística descriptiva'],
    'Inecuaciones':                    ['Ecuaciones e inecuaciones'],
    'Tasas de cambio y variación':     ['Proporcionalidad y regla de tres'],
    'Lógica y sucesiones':             ['Álgebra y funciones'],
  },
  ciencias_naturales: {
    'Genética mendeliana':             ['División celular'],
    'Electroquímica':                  ['Reacciones químicas'],
    'Ecología: cadenas tróficas':      ['Fotosíntesis y respiración celular'],
    'Ondas: sonido y luz':             ['Leyes de Newton'],
    'Cambio climático':                ['Ecología: cadenas tróficas'],
  },
  lectura_critica: {
    'Evaluar la validez de un argumento': ['Tesis central', 'Hechos vs opinión'],
    'Inferir propósito comunicativo':     ['Tesis central'],
    'Interpretar textos discontinuos':    ['Relaciones entre párrafos'],
  },
  sociales: {
    'Mecanismos de participación ciudadana': ['Constitución Política de Colombia 1991'],
    'Globalización y organismos internacionales': ['Revolución Industrial'],
    'Conflicto armado y proceso de paz':          ['Historia: independencia'],
  },
  ingles: {
    'Grammar: verb tenses en contexto':        ['Vocabulary in context'],
    'Inference e intención comunicativa':      ['Reading comprehension: main idea and details'],
    'Conectores lógicos y coherencia textual': ['Grammar: verb tenses en contexto'],
  },
};

const PRIORITY_CONFIG = {
  blocker:  { emoji: '🚨', label: 'Bloqueante',  color: '#ef4444',  desc: 'Dominar esto desbloquea otros temas' },
  critical: { emoji: '🔥', label: 'Crítico',     color: '#f97316',  desc: 'Alta tasa de error — atacar ahora' },
  learning: { emoji: '📈', label: 'Aprendiendo', color: '#f59e0b',  desc: 'En progreso — necesita refuerzo' },
  mastered: { emoji: '✅', label: 'Dominado',    color: '#22c55e',  desc: 'Bien dominado — mantener' },
};

const AdaptivePlan = {

  // ── 1. Cargar weak_topics del estudiante desde Supabase ──────
  async load(studentId) {
    const { data, error } = await supabase
      .from('weak_topics')
      .select('subject, topic, error_rate, attempts')
      .eq('student_id', studentId)
      .order('error_rate', { ascending: false });

    if (error) console.error('[AdaptivePlan] load:', error.message);
    return data ?? [];
  },

  // ── 2. Algoritmo de Prioridad: Punto de Mayor Apalancamiento ─
  computePriority(weakTopics) {
    // Índice rápido: subject → topic → datos
    const idx = {};
    weakTopics.forEach(wt => {
      if (!idx[wt.subject]) idx[wt.subject] = {};
      idx[wt.subject][wt.topic] = wt;
    });

    return weakTopics.map(wt => {
      const prereqs    = TOPIC_PREREQUISITES[wt.subject] ?? {};
      const subjectIdx = idx[wt.subject] ?? {};

      // ¿Este tema es prerequisito de otros temas que también están fallando?
      const isBlocker = Object.entries(prereqs).some(([advTopic, deps]) => {
        const adv = subjectIdx[advTopic];
        return deps.includes(wt.topic) && adv && adv.error_rate > 0.5;
      });

      // ¿Este tema está bloqueado porque sus prerequisitos no están dominados?
      const blockedBy = (prereqs[wt.topic] ?? []).filter(p => {
        const pre = subjectIdx[p];
        return pre && pre.error_rate > 0.5;
      });

      let priority;
      if (isBlocker && wt.error_rate > 0.5) priority = 'blocker';
      else if (wt.error_rate > 0.6)         priority = 'critical';
      else if (wt.error_rate > 0.3)         priority = 'learning';
      else                                  priority = 'mastered';

      return { ...wt, priority, isBlocker, blockedBy };
    }).sort((a, b) => {
      const ORDER = { blocker: 0, critical: 1, learning: 2, mastered: 3 };
      return ORDER[a.priority] - ORDER[b.priority] || b.error_rate - a.error_rate;
    });
  },

  // ── 3. Renderizar Mapa de Calor ──────────────────────────────
  renderHeatmap(containerId, weakTopics) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!weakTopics || weakTopics.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div style="font-size:2.5rem;margin-bottom:12px">🌑</div>
          <p>Tu Aura de Conocimiento está dormida.<br>
             Completa tu primera sesión para verla despertar.</p>
        </div>`;
      return;
    }

    const bySubject = {};
    weakTopics.forEach(wt => {
      if (!bySubject[wt.subject]) bySubject[wt.subject] = [];
      bySubject[wt.subject].push(wt);
    });

    const SUBJECTS_ORDER = [
      ['lectura_critica',    'Lectura Crítica'],
      ['matematicas',        'Matemáticas'],
      ['ciencias_naturales', 'Ciencias Naturales'],
      ['sociales',           'Sociales y Ciudadanas'],
      ['ingles',             'Inglés'],
    ];

    const html = SUBJECTS_ORDER.map(([key, label]) => {
      const topics = bySubject[key] ?? [];
      const icon   = SUBJECT_ICONS[key];

      if (topics.length === 0) {
        return `
          <div class="heatmap-subject">
            <div class="heatmap-header">
              <span>${icon} <strong>${label}</strong></span>
              <button class="btn btn--ghost btn--sm"
                      onclick="startTopicChallenge('${key}')">Entrenar →</button>
            </div>
            <p style="font-size:.8rem;color:var(--text-muted);padding:6px 0">Sin datos aún</p>
          </div>`;
      }

      const avgMastery = topics.reduce((s, t) => s + (1 - t.error_rate), 0) / topics.length;
      const pct        = Math.round(avgMastery * 100);
      const mastColor  = pct >= 70 ? '#22c55e' : pct >= 40 ? '#f59e0b' : '#ef4444';

      const cells = topics.map(t => {
        const m   = 1 - t.error_rate;
        const cls = m >= 0.7 ? 'heat--green' : m >= 0.4 ? 'heat--yellow' : 'heat--red';
        const ico = m >= 0.7 ? '✓' : m >= 0.4 ? '~' : '✗';
        const safe = t.topic.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        return `
          <button class="heat-cell ${cls}"
                  onclick="startTopicChallenge('${key}', '${safe}')"
                  title="${t.topic} — ${Math.round(m * 100)}% dominio · ${t.attempts} intentos">
            <span class="heat-icon">${ico}</span>
            <span class="heat-name">${escapeHtml(t.topic)}</span>
          </button>`;
      }).join('');

      return `
        <div class="heatmap-subject">
          <div class="heatmap-header">
            <span>${icon} <strong>${label}</strong></span>
            <span style="color:${mastColor};font-weight:700;font-size:.82rem">${pct}% dominado</span>
            <button class="btn btn--ghost btn--sm"
                    onclick="startTopicChallenge('${key}')">Entrenar →</button>
          </div>
          <div class="heat-grid">${cells}</div>
        </div>`;
    }).join('');

    container.innerHTML = `<div class="heatmap-wrap">${html}</div>`;
  },

  // ── 4. Renderizar Plan Prioritario (top 5 a trabajar) ────────
  renderPriorityPlan(containerId, prioritized) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const top5 = prioritized.filter(t => t.priority !== 'mastered').slice(0, 5);

    if (top5.length === 0) {
      container.innerHTML = `
        <p style="color:#22c55e;font-size:.9rem">
          🏆 ¡Todos tus temas están dominados!
          Haz un simulacro completo para confirmar tu nivel.
        </p>`;
      return;
    }

    container.innerHTML = top5.map(t => {
      const cfg      = PRIORITY_CONFIG[t.priority];
      const pct      = Math.round((1 - t.error_rate) * 100);
      const safeSubj = t.subject.replace(/'/g, "\\'");
      const safeTopic= t.topic.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
      const blocked  = t.blockedBy.length > 0
        ? `<span style="font-size:.68rem;color:var(--text-muted)">Requiere dominar: ${t.blockedBy.join(', ')}</span>`
        : '';

      return `
        <div class="priority-item" style="border-left:3px solid ${cfg.color}">
          <div class="priority-info">
            <span style="font-size:1.4rem">${cfg.emoji}</span>
            <div style="min-width:0">
              <div class="priority-topic">${escapeHtml(t.topic)}</div>
              <div class="priority-desc">${cfg.desc} · ${pct}% dominio</div>
              ${blocked}
            </div>
          </div>
          <button class="btn btn--primary btn--sm"
                  onclick="startTopicChallenge('${safeSubj}', '${safeTopic}')">
            ⚡ Entrenar
          </button>
        </div>`;
    }).join('');
  },

  // ── 5. Hack Prime: 3 bullets estratégicos desde la explicación ─
  getHackPrime(question) {
    const exp = question.explanation ?? '';

    // Partir explicación en oraciones significativas
    const sentences = exp
      .replace(/\n/g, ' ')
      .split(/(?<=[.!?])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 30);

    const bullets = [];

    // Bullet 1 — La regla o patrón clave
    if (question.concept_key) {
      bullets.push(`🎯 <strong>Regla Prime:</strong> ${escapeHtml(question.concept_key)}`);
    } else if (sentences[0]) {
      bullets.push(`🎯 <strong>El patrón:</strong> ${escapeHtml(sentences[0])}`);
    }

    // Bullet 2 — La trampa específica
    const TRAP_LABELS = {
      emotional:  'trampa emocional — suena correcto pero está mal',
      knowledge:  'trampa de conocimiento — relacionado pero fuera de contexto',
      speed:      'trampa de velocidad — parece obvia, tiene un giro',
      distractor: 'señuelo — diseñado para el que sabe a medias',
    };
    if (question.distractor_type && TRAP_LABELS[question.distractor_type]) {
      bullets.push(`⚠️ <strong>La trampa:</strong> ${TRAP_LABELS[question.distractor_type]}`);
    } else if (sentences[1]) {
      bullets.push(`⚠️ <strong>Por qué falla la mayoría:</strong> ${escapeHtml(sentences[1])}`);
    }

    // Bullet 3 — Cómo descartar rápido
    const last = sentences[sentences.length - 1];
    if (sentences.length >= 3 && last !== sentences[0] && last !== sentences[1]) {
      bullets.push(`⚡ <strong>Descarte rápido:</strong> ${escapeHtml(last)}`);
    } else if (question.icfes_competency) {
      bullets.push(`⚡ <strong>Competencia ICFES:</strong> ${escapeHtml(question.icfes_competency)}`);
    }

    return bullets.slice(0, 3);
  },
};
