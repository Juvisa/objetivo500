-- ═══════════════════════════════════════════════════════════════════
-- GUARDIANES DEL SABER — Schema Supabase
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query
-- URL: https://supabase.com/dashboard/project/bekvduhzoxufixykxphy/sql/new
-- ═══════════════════════════════════════════════════════════════════

-- ── Tabla principal del guardián de cada usuario ─────────────────
CREATE TABLE IF NOT EXISTS estado_guardian (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_usuario          UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tipo_guardian       TEXT NOT NULL
    CHECK (tipo_guardian IN ('dragon','grifo','unicornio','fenix')),
  nivel_energia       INTEGER DEFAULT 100
    CHECK (nivel_energia BETWEEN 0 AND 100),
  xp_total            INTEGER DEFAULT 0,
  nivel_evolucion     INTEGER DEFAULT 1
    CHECK (nivel_evolucion BETWEEN 1 AND 5),
  estado              TEXT DEFAULT 'activo'
    CHECK (estado IN ('activo','critico','petrificado')),
  ultima_alimentacion TIMESTAMPTZ DEFAULT NOW(),
  fecha_registro      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(id_usuario)
);

-- ── Historial de sesiones de alimentación ────────────────────────
CREATE TABLE IF NOT EXISTS historial_alimentacion (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_usuario          UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  energia_ganada      INTEGER NOT NULL,
  xp_ganada           INTEGER NOT NULL,
  preguntas_correctas INTEGER NOT NULL,
  creado_en           TIMESTAMPTZ DEFAULT NOW()
);

-- ── Row Level Security ────────────────────────────────────────────
ALTER TABLE estado_guardian        ENABLE ROW LEVEL SECURITY;
ALTER TABLE historial_alimentacion ENABLE ROW LEVEL SECURITY;

-- Policies: estado_guardian
CREATE POLICY "guardian_select_own"
  ON estado_guardian FOR SELECT
  USING (id_usuario = auth.uid());

CREATE POLICY "guardian_insert_own"
  ON estado_guardian FOR INSERT
  WITH CHECK (id_usuario = auth.uid());

CREATE POLICY "guardian_update_own"
  ON estado_guardian FOR UPDATE
  USING (id_usuario = auth.uid());

-- Policies: historial_alimentacion
CREATE POLICY "historial_select_own"
  ON historial_alimentacion FOR SELECT
  USING (id_usuario = auth.uid());

CREATE POLICY "historial_insert_own"
  ON historial_alimentacion FOR INSERT
  WITH CHECK (id_usuario = auth.uid());
