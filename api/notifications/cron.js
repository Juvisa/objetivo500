// api/notifications/cron.js — Vercel Serverless Function
// Objetivo 500 · Node.js · web-push
// ─────────────────────────────────────────────────────
// Endpoint: GET /api/notifications/cron?turno=manana|tarde|noche
// Llamado por GitHub Actions 3 veces al día (hora Colombia UTC-5).
//
// Variables de entorno requeridas (Vercel Dashboard → Settings → Env):
//   VAPID_PUBLIC_KEY
//   VAPID_PRIVATE_KEY
//   VAPID_EMAIL
//   CRON_SECRET          — token secreto que envía GitHub Actions
//   SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY

import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

// ── Textos de notificación por turno ──────────────────────────
const MENSAJES = {
  manana: [
    { title: '☀️ Buenos días, guerrero del ICFES', body: 'Empieza el día con 20 preguntas. Tu Guardián te espera.' },
    { title: '🎯 La mañana es tuya', body: 'Cada pregunta correcta te acerca más a 500 puntos.' },
    { title: '⚡ Activa tu AURA', body: 'Los mejores estudiantes estudian en la mañana. ¡Tú puedes!' },
  ],
  tarde: [
    { title: '📚 Hora de estudiar', body: 'Practica 20 preguntas y sigue construyendo tu racha.' },
    { title: '🔥 Tu racha te necesita', body: '¿Ya estudiaste hoy? No dejes que se rompa.' },
    { title: '🏆 La tarde es perfecta', body: 'Mejora tu puntaje con una sesión de práctica ahora.' },
  ],
  noche: [
    { title: '🌙 Última oportunidad del día', body: 'No rompas tu racha. Una sesión rápida antes de dormir.' },
    { title: '💪 Termina el día fuerte', body: 'El ICFES se gana con constancia. ¡Estudia hoy!' },
    { title: '⭐ Tu Guardián te espera', body: 'Aliméntalo con respuestas correctas antes de dormir.' },
  ],
};

const APP_URL = 'https://objetivo500.vercel.app/app.html';

export default async function handler(req, res) {
  // ── 1. Validar método ─────────────────────────────────────
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ── 2. Validar CRON_SECRET ────────────────────────────────
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.authorization ?? '';
  const tokenParam = req.query.secret ?? '';

  if (cronSecret) {
    const provided = authHeader.replace('Bearer ', '') || tokenParam;
    if (provided !== cronSecret) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  // ── 3. Leer parámetro turno ───────────────────────────────
  const turno = req.query.turno;
  if (!['manana', 'tarde', 'noche'].includes(turno)) {
    return res.status(400).json({ error: 'turno debe ser: manana | tarde | noche' });
  }

  // ── 4. Configurar web-push ────────────────────────────────
  const vapidPublic  = process.env.VAPID_PUBLIC_KEY;
  const vapidPrivate = process.env.VAPID_PRIVATE_KEY;
  const vapidEmail   = process.env.VAPID_EMAIL;

  if (!vapidPublic || !vapidPrivate || !vapidEmail) {
    console.error('[cron] Faltan variables VAPID');
    return res.status(500).json({ error: 'Configuración VAPID incompleta' });
  }

  webpush.setVapidDetails(`mailto:${vapidEmail}`, vapidPublic, vapidPrivate);

  // ── 5. Conectar a Supabase con service_role ────────────────
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );

  // ── 6. Obtener todas las suscripciones activas ─────────────
  const { data: subs, error } = await supabase
    .from('push_subscriptions')
    .select('id, subscription')
    .eq('activa', true);

  if (error) {
    console.error('[cron] Error consultando suscripciones:', error.message);
    return res.status(500).json({ error: error.message });
  }

  if (!subs || subs.length === 0) {
    return res.status(200).json({ sent: 0, message: 'Sin suscripciones activas' });
  }

  // ── 7. Elegir mensaje aleatorio del turno ──────────────────
  const msgs     = MENSAJES[turno];
  const mensaje  = msgs[Math.floor(Math.random() * msgs.length)];
  const payload  = JSON.stringify({
    title: mensaje.title,
    body:  mensaje.body,
    url:   APP_URL,
    icon:  '/icons/icon-192.png',
    badge: '/icons/icon-72.png',
  });

  // ── 8. Enviar en paralelo (max 50 en batch) ────────────────
  let sent    = 0;
  let failed  = 0;
  const toDeactivate = [];

  const results = await Promise.allSettled(
    subs.map(async (row) => {
      try {
        await webpush.sendNotification(row.subscription, payload);
        sent++;
      } catch (err) {
        // 410 Gone = la suscripción expiró → desactivar
        if (err.statusCode === 410 || err.statusCode === 404) {
          toDeactivate.push(row.id);
        }
        failed++;
        console.warn(`[cron] Fallo enviando a ${row.id}:`, err.statusCode);
      }
    })
  );

  // Desactivar suscripciones expiradas
  if (toDeactivate.length > 0) {
    await supabase
      .from('push_subscriptions')
      .update({ activa: false })
      .in('id', toDeactivate);
  }

  console.log(`[cron] Turno ${turno}: ${sent} enviadas, ${failed} fallidas, ${toDeactivate.length} desactivadas`);

  return res.status(200).json({
    turno,
    sent,
    failed,
    deactivated: toDeactivate.length,
    total: subs.length,
  });
}
