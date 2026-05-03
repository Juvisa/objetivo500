// FILE: lib/certificates.js
// Módulo H — Certificados de logro descargables (Canvas API, sin dependencias).
// Depende de: supabase (global)

window.Certificates = (() => {
  'use strict';

  const SUBJECT_LABELS = {
    lectura_critica:    'Lectura Crítica',
    matematicas:        'Matemáticas',
    sociales:           'Sociales y Ciudadanas',
    ciencias_naturales: 'Ciencias Naturales',
    ingles:             'Inglés',
  };

  const CERT_META = {
    streak_7:       { emoji: '🔥', title: 'Racha de 7 días',        color: '#F59E0B', tier: 'bronce'  },
    streak_30:      { emoji: '🌟', title: 'Racha de 30 días',        color: '#3B82F6', tier: 'plata'   },
    questions_50:   { emoji: '📚', title: '50 Preguntas Respondidas', color: '#10B981', tier: 'bronce'  },
    questions_200:  { emoji: '⭐', title: '200 Preguntas Respondidas',color: '#7C3AED', tier: 'plata'   },
    questions_500:  { emoji: '💎', title: '500 Preguntas Respondidas',color: '#D4AF37', tier: 'oro'     },
    score_300:      { emoji: '🎯', title: 'Puntaje estimado 300+',   color: '#10B981', tier: 'bronce'  },
    score_400:      { emoji: '🚀', title: 'Puntaje estimado 400+',   color: '#3B82F6', tier: 'plata'   },
    score_450:      { emoji: '🏆', title: 'Puntaje estimado 450+',   color: '#D4AF37', tier: 'oro'     },
    subject_master: { emoji: '🎓', title: 'Maestro en {subject}',    color: '#7C3AED', tier: 'plata'   },
  };

  function getMeta(cert) {
    const base = CERT_META[cert.type] ?? { emoji: '🏅', title: cert.type, color: '#94A3B8', tier: 'bronce' };
    if (cert.type === 'subject_master' && cert.subject) {
      return { ...base, title: `Maestro en ${SUBJECT_LABELS[cert.subject] ?? cert.subject}` };
    }
    return base;
  }

  // ── API pública ───────────────────────────────────────────────

  async function getAll(studentId) {
    const { data } = await supabase
      .from('certificates')
      .select('*')
      .eq('student_id', studentId)
      .order('awarded_at', { ascending: false });
    return data ?? [];
  }

  async function evaluate(studentId) {
    const { data: newCerts } = await supabase.rpc('evaluate_certificates', {
      p_student_id: studentId,
    });
    return newCerts ?? [];
  }

  // ── Canvas renderer ───────────────────────────────────────────

  function render(cert, studentName) {
    const W = 900, H = 636;
    const canvas = document.createElement('canvas');
    canvas.width  = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    const meta = getMeta(cert);

    // Fondo degradado oscuro
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0,   '#0A0A0F');
    bg.addColorStop(0.5, '#111118');
    bg.addColorStop(1,   '#0A0A0F');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Marco exterior
    ctx.strokeStyle = meta.color;
    ctx.lineWidth   = 3;
    _roundRect(ctx, 18, 18, W - 36, H - 36, 20);
    ctx.stroke();

    // Marco interior decorativo
    ctx.strokeStyle = meta.color + '44';
    ctx.lineWidth   = 1;
    _roundRect(ctx, 28, 28, W - 56, H - 56, 16);
    ctx.stroke();

    // Esquinas decorativas
    _drawCornerAccents(ctx, W, H, meta.color);

    // Logo / marca
    ctx.fillStyle   = meta.color + 'BB';
    ctx.font        = 'bold 13px sans-serif';
    ctx.textAlign   = 'center';
    ctx.fillText('OBJETIVO 500  ·  AURA', W / 2, 70);

    // Línea divisoria
    ctx.strokeStyle = meta.color + '55';
    ctx.lineWidth   = 1;
    ctx.beginPath(); ctx.moveTo(W / 2 - 120, 82); ctx.lineTo(W / 2 + 120, 82); ctx.stroke();

    // Emoji central
    ctx.font      = '80px serif';
    ctx.textAlign = 'center';
    ctx.fillText(meta.emoji, W / 2, 190);

    // Título "Certificado de Logro"
    ctx.fillStyle = '#CBD5E1';
    ctx.font      = 'italic 16px serif';
    ctx.fillText('Certificado de Logro', W / 2, 240);

    // Nombre del estudiante
    ctx.fillStyle = '#F1F5F9';
    ctx.font      = `bold 34px sans-serif`;
    ctx.fillText(studentName ?? 'Estudiante', W / 2, 300);

    // Texto "ha obtenido"
    ctx.fillStyle = '#94A3B8';
    ctx.font      = '15px sans-serif';
    ctx.fillText('ha obtenido el logro', W / 2, 332);

    // Nombre del certificado
    ctx.fillStyle = meta.color;
    ctx.font      = `bold 28px sans-serif`;
    _fitText(ctx, meta.title, W / 2, 382, W - 100);

    // Tier badge
    const tierColors = { bronce: '#CD7F32', plata: '#C0C0C0', oro: '#D4AF37' };
    ctx.fillStyle   = tierColors[meta.tier] ?? '#94A3B8';
    ctx.font        = 'bold 11px sans-serif';
    ctx.fillText(('· ' + meta.tier.toUpperCase() + ' ·'), W / 2, 416);

    // Fecha
    const fecha = new Date(cert.awarded_at).toLocaleDateString('es-CO', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
    ctx.fillStyle = '#64748B';
    ctx.font      = '13px sans-serif';
    ctx.fillText(fecha, W / 2, H - 60);

    // Línea de cierre
    ctx.strokeStyle = meta.color + '44';
    ctx.lineWidth   = 1;
    ctx.beginPath(); ctx.moveTo(W / 2 - 80, H - 72); ctx.lineTo(W / 2 + 80, H - 72); ctx.stroke();

    return canvas;
  }

  function download(cert, studentName) {
    const canvas   = render(cert, studentName);
    const meta     = getMeta(cert);
    const filename = `certificado-${meta.title.replace(/\s+/g, '-').toLowerCase()}.png`;
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a   = document.createElement('a');
      a.href = url; a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  }

  // ── Notificación de nuevo certificado ─────────────────────────

  function showNewCertToast(certType, subject = null) {
    const fakeKey  = subject ? `subject_master` : certType;
    const base     = CERT_META[fakeKey] ?? { emoji: '🏅', title: certType };
    const title    = fakeKey === 'subject_master' && subject
      ? `Maestro en ${SUBJECT_LABELS[subject] ?? subject}`
      : base.title;
    if (window.showToast) {
      showToast('¡Nuevo certificado! ' + base.emoji, title, base.emoji, 'success');
    }
  }

  // ── Card HTML para galería ────────────────────────────────────

  function cardHTML(cert, studentName) {
    const meta = getMeta(cert);
    const fecha = new Date(cert.awarded_at).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
    const tierColors = { bronce: '#CD7F32', plata: '#C0C0C0', oro: '#D4AF37' };

    return `
      <div class="cert-card" style="border-color:${meta.color}40">
        <div class="cert-card__icon">${meta.emoji}</div>
        <div class="cert-card__body">
          <p class="cert-card__title">${meta.title}</p>
          <p class="cert-card__date">${fecha}</p>
          <span class="cert-card__tier" style="color:${tierColors[meta.tier] ?? '#94A3B8'}">${meta.tier.toUpperCase()}</span>
        </div>
        <button class="btn btn--ghost btn--sm cert-card__dl"
          onclick="Certificates._downloadById('${cert.id}','${studentName?.replace(/'/g, "\\'")}')">
          ⬇ PNG
        </button>
      </div>`;
  }

  // Cache para download por id desde galería
  let _cache = [];

  Certificates._downloadById = function(certId, studentName) {
    const cert = _cache.find(c => c.id === certId);
    if (cert) download(cert, studentName);
  };

  Certificates._setCache = function(certs) { _cache = certs; };

  // ── Canvas helpers ────────────────────────────────────────────

  function _roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function _drawCornerAccents(ctx, W, H, color) {
    const size = 22, pad = 22;
    ctx.strokeStyle = color;
    ctx.lineWidth   = 2;
    const corners = [[pad, pad], [W - pad, pad], [pad, H - pad], [W - pad, H - pad]];
    corners.forEach(([cx, cy]) => {
      const sx = cx === pad ? 1 : -1;
      const sy = cy === pad ? 1 : -1;
      ctx.beginPath();
      ctx.moveTo(cx + sx * size, cy);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx, cy + sy * size);
      ctx.stroke();
    });
  }

  function _fitText(ctx, text, x, y, maxWidth) {
    let size = 28;
    ctx.font = `bold ${size}px sans-serif`;
    while (ctx.measureText(text).width > maxWidth && size > 14) {
      size--;
      ctx.font = `bold ${size}px sans-serif`;
    }
    ctx.fillText(text, x, y);
  }

  return { getAll, evaluate, render, download, cardHTML, showNewCertToast };
})();
