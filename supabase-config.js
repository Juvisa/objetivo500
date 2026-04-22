/**
 * supabase-config.js — Objetivo 500
 * Inicialización del cliente Supabase y helpers de autenticación.
 *
 * IMPORTANTE: Reemplaza SUPABASE_URL y SUPABASE_ANON_KEY con los valores
 * de tu proyecto en https://app.supabase.com → Project Settings → API.
 * NUNCA expongas la service_role key en el cliente.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ── Configuración ─────────────────────────────────────────────
const SUPABASE_URL      = 'https://bekvduhzoxufixykxphy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJla3ZkdWh6b3h1Zml4eWt4cGh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NzIwNjksImV4cCI6MjA5MjM0ODA2OX0.S_fSyBAJ1IS9E3H_W7I8vXwEhRqnczNAHa1S7kvKxvM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// ── Constantes de rutas ───────────────────────────────────────
export const ROUTES = {
  login:           './login.html',
  studentApp:      './app.html',
  parentDashboard: './dashboard-padre.html',
  index:           './index.html',
};

// ── Auth helpers ──────────────────────────────────────────────

/**
 * Registra un nuevo usuario (estudiante o padre).
 * @param {Object} params
 * @param {string} params.email
 * @param {string} params.password
 * @param {'student'|'parent'} params.role
 * @param {string} params.username  — único, visible públicamente
 * @param {number} [params.grade]   — grado escolar (solo estudiantes)
 * @returns {Promise<{user, error}>}
 */
export async function signUp({ email, password, role, username, grade = 11 }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { role, username, grade } },
  });
  if (error) return { user: null, error };

  const user = data?.user ?? null;
  if (!user) return { user: null, error: null }; // email ya existía (sin sesión nueva)

  // Si email confirmation está OFF, data.session existe → crear perfil ahora
  if (data.session) {
    await _ensureProfile(user, role, username, grade);
  }

  return { user, error: null };
}

async function _ensureProfile(user, role, username, grade) {
  // El trigger pudo haberlo creado; verificar primero
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();
  if (existing) return existing;

  const { data: profile, error: pe } = await supabase
    .from('profiles')
    .insert({ user_id: user.id, role, username })
    .select('id, role')
    .single();

  if (pe) { console.error('[O500] _ensureProfile:', pe.message); return null; }

  if (role === 'student') {
    const { error: se } = await supabase
      .from('students')
      .insert({ profile_id: profile.id, grade });
    if (se) console.error('[O500] _ensureProfile students:', se.message);
  }

  return profile;
}

/**
 * Inicia sesión y redirige según el rol del usuario.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{profile, error}>}
 */
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { profile: null, error };

  let profile = await getProfile();

  // Fallback: si el trigger falló, crear perfil ahora
  if (!profile && data.user) {
    const meta = data.user.user_metadata ?? {};
    profile = await _ensureProfile(
      data.user,
      meta.role || 'student',
      meta.username || email.split('@')[0],
      Number(meta.grade) || 11
    );
  }

  if (!profile) return { profile: null, error: new Error('No se pudo crear el perfil') };

  const dest = profile.role === 'parent' ? ROUTES.parentDashboard : ROUTES.studentApp;
  window.location.href = dest;

  return { profile, error: null };
}

/**
 * Cierra sesión y redirige al login.
 */
export async function signOut() {
  await supabase.auth.signOut();
  window.location.href = ROUTES.login;
}

/**
 * Devuelve el perfil del usuario autenticado actualmente.
 * @returns {Promise<Object|null>}
 */
export async function getProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) { console.error('[O500] getProfile:', error.message); return null; }
  return data;
}

/**
 * Devuelve los datos de gamificación del estudiante.
 * @param {string} profileId
 * @returns {Promise<Object|null>}
 */
export async function getStudentData(profileId) {
  const { data, error } = await supabase
    .from('students')
    .select(`
      *,
      student_badges(
        unlocked_at,
        badges(slug, name, icon_url)
      )
    `)
    .eq('profile_id', profileId)
    .single();

  if (error) { console.error('[O500] getStudentData:', error.message); return null; }
  return data;
}

/**
 * Guarda en el cliente el session-guard: si no hay sesión, redirige al login.
 * Llamar al inicio de app.html y dashboard-padre.html.
 * @param {'student'|'parent'|null} requiredRole — null = cualquier rol autenticado
 */
export async function requireAuth(requiredRole = null) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = ROUTES.login;
    return null;
  }

  const profile = await getProfile();
  if (!profile) {
    window.location.href = ROUTES.login;
    return null;
  }

  if (requiredRole && profile.role !== requiredRole) {
    // Redirigir al dashboard correcto
    const dest = profile.role === 'parent' ? ROUTES.parentDashboard : ROUTES.studentApp;
    window.location.href = dest;
    return null;
  }

  return profile;
}

/**
 * Suscribe al canal Realtime de cambios en el perfil del estudiante.
 * Útil para actualizar XP/racha en tiempo real.
 * @param {string} studentId
 * @param {Function} callback — recibe el payload de cambio
 * @returns {RealtimeChannel} — guardar referencia para desuscribir
 */
export function subscribeToStudentChanges(studentId, callback) {
  return supabase
    .channel(`student:${studentId}`)
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'students',
      filter: `id=eq.${studentId}`,
    }, callback)
    .subscribe();
}

/**
 * Suscribe al feed social para actualizaciones en vivo.
 * @param {Function} callback
 * @returns {RealtimeChannel}
 */
export function subscribeToFeed(callback) {
  return supabase
    .channel('social_feed')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'social_feed',
    }, callback)
    .subscribe();
}
