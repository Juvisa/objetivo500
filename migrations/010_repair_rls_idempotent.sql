-- ============================================================
-- MIGRATION 010: Reparación idempotente de RLS
-- Seguro de ejecutar aunque las tablas/políticas ya existan.
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- ─── BATTLES ─────────────────────────────────────────────────────────────────

ALTER TABLE IF EXISTS battles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='battles' AND policyname='battles: participantes ven su batalla') THEN
    CREATE POLICY "battles: participantes ven su batalla"
      ON battles FOR SELECT
      USING (challenger_id = auth_student_id() OR opponent_id = auth_student_id());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='battles' AND policyname='battles: estudiante puede crear') THEN
    CREATE POLICY "battles: estudiante puede crear"
      ON battles FOR INSERT
      WITH CHECK (auth_student_id() = challenger_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='battles' AND policyname='battles: estudiante puede actualizar las suyas') THEN
    CREATE POLICY "battles: estudiante puede actualizar las suyas"
      ON battles FOR UPDATE
      USING (challenger_id = auth_student_id() OR opponent_id = auth_student_id());
  END IF;
END $$;

-- ─── CERTIFICATES ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS certificates (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  type       TEXT NOT NULL,
  subject    TEXT,
  awarded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  data       JSONB NOT NULL DEFAULT '{}',
  UNIQUE (student_id, type, subject)
);

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='certificates' AND policyname='certificates: propio estudiante') THEN
    CREATE POLICY "certificates: propio estudiante"
      ON certificates FOR ALL
      USING (student_id = auth_student_id())
      WITH CHECK (student_id = auth_student_id());
  END IF;
END $$;

-- ─── EXAM_CALENDAR ───────────────────────────────────────────────────────────

ALTER TABLE IF EXISTS exam_calendar ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='exam_calendar' AND policyname='exam_calendar: propio estudiante') THEN
    CREATE POLICY "exam_calendar: propio estudiante"
      ON exam_calendar FOR ALL
      USING (student_id = auth_student_id())
      WITH CHECK (student_id = auth_student_id());
  END IF;
END $$;

-- ─── ONBOARDING_PROGRESS ─────────────────────────────────────────────────────

ALTER TABLE IF EXISTS onboarding_progress ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='onboarding_progress' AND policyname='onboarding: propio estudiante') THEN
    CREATE POLICY "onboarding: propio estudiante"
      ON onboarding_progress FOR ALL
      USING (student_id = auth_student_id())
      WITH CHECK (student_id = auth_student_id());
  END IF;
END $$;

-- ─── VERIFICACIÓN ────────────────────────────────────────────────────────────

SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('battles','certificates','exam_calendar','onboarding_progress')
ORDER BY tablename, policyname;
