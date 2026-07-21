// FILE: api/delete-account.js — Vercel Serverless Function
// Elimina la cuenta del usuario autenticado y todos sus datos.
// Requiere JWT válido en Authorization header.

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ── Validar JWT ───────────────────────────────────────────
  const jwt = (req.headers.authorization ?? '').replace('Bearer ', '').trim();
  if (!jwt) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
  if (authError || !user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // ── Eliminar usuario (Supabase borra en cascada vía FK) ───
  const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
  if (deleteError) {
    console.error('[delete-account] Error:', deleteError.message);
    return res.status(500).json({ error: 'No se pudo eliminar la cuenta' });
  }

  console.log('[delete-account] Cuenta eliminada:', user.id);
  return res.status(200).json({ ok: true });
}
