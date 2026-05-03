// Supabase Edge Function: weekly-parent-report
// Cron: todos los lunes a las 8am COL (13:00 UTC)
// Configurar en Supabase → Edge Functions → Schedule:
//   cron: "0 13 * * 1"

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

Deno.serve(async () => {
  try {
    // 1. Obtener todos los estudiantes con suscripción activa
    const { data: students, error } = await supabase
      .from('students')
      .select('id, profiles(id, username, email)');

    if (error) throw error;
    if (!students || students.length === 0) {
      return new Response(JSON.stringify({ ok: true, processed: 0 }), { status: 200 });
    }

    const weekStart = getMonday();
    let processed = 0;

    for (const student of students) {
      try {
        // 2. Generar reporte en DB
        const { data: reportId } = await supabase.rpc('build_parent_report', {
          p_student_id: student.id,
          p_week_start: weekStart,
        });

        if (!reportId) continue;

        // 3. Obtener reporte generado
        const { data: report } = await supabase
          .from('parent_reports')
          .select('*')
          .eq('id', reportId)
          .single();

        if (!report) continue;

        // 4. Enviar por email (requiere configurar RESEND_API_KEY en env vars)
        const emailSent = await sendReportEmail(student, report);
        if (emailSent) {
          await supabase
            .from('parent_reports')
            .update({ sent_at: new Date().toISOString(), channel: 'email' })
            .eq('id', reportId);
        }

        processed++;
      } catch (err) {
        console.error(`[weekly-report] Error para student ${student.id}:`, err);
      }
    }

    return new Response(JSON.stringify({ ok: true, processed }), { status: 200 });
  } catch (err) {
    console.error('[weekly-report] Error general:', err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500 });
  }
});

// ── Helpers ───────────────────────────────────────────────────

function getMonday(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split('T')[0];
}

async function sendReportEmail(student: any, report: any): Promise<boolean> {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  if (!apiKey) return false; // Email no configurado aún

  const email   = student.profiles?.email;
  const name    = student.profiles?.username ?? 'Estudiante';
  if (!email) return false;

  const weakTopics = Array.isArray(report.top_weak_topics)
    ? report.top_weak_topics.join(', ')
    : 'Sin datos esta semana';

  const deltaText = report.score_delta !== null
    ? ` (${report.score_delta >= 0 ? '+' : ''}${report.score_delta} vs semana anterior)`
    : '';

  const html = `
    <div style="font-family:Inter,sans-serif;max-width:500px;margin:0 auto;background:#0A0A0F;color:#F0F0F5;padding:32px;border-radius:16px">
      <h2 style="color:#9D6EF5;margin-bottom:24px">📊 Reporte semanal — ${name}</h2>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:8px 0;color:#A0A0B8">✅ Preguntas respondidas</td><td style="text-align:right;font-weight:700">${report.questions_total}</td></tr>
        <tr><td style="padding:8px 0;color:#A0A0B8">🎯 Precisión</td><td style="text-align:right;font-weight:700">${Math.round((report.correct_rate ?? 0) * 100)}%</td></tr>
        <tr><td style="padding:8px 0;color:#A0A0B8">🔥 Racha</td><td style="text-align:right;font-weight:700">${report.streak_days} días</td></tr>
        ${report.predicted_score ? `<tr><td style="padding:8px 0;color:#A0A0B8">📈 Puntaje estimado</td><td style="text-align:right;font-weight:700">${report.predicted_score}/500${deltaText}</td></tr>` : ''}
        <tr><td style="padding:8px 0;color:#A0A0B8">⚠️ Temas a reforzar</td><td style="text-align:right;font-weight:700">${weakTopics || '—'}</td></tr>
      </table>
      <div style="margin-top:24px;text-align:center">
        <a href="${Deno.env.get('APP_URL') ?? 'https://objetivo500.vercel.app'}/parent.html"
           style="background:#7C3AED;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:700">
          Ver dashboard completo →
        </a>
      </div>
      <p style="margin-top:24px;font-size:12px;color:#606078;text-align:center">
        +500 AURA · Preparación ICFES Saber 11
      </p>
    </div>`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from:    'AURA <reportes@objetivo500.app>',
        to:      [email],
        subject: `📊 Reporte semanal de ${name} en +500 AURA`,
        html,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
