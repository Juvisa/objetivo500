-- ============================================================
-- MIGRATION 005: Módulo E — Onboarding + Calendario de examen
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- 1. Seguimiento de onboarding
CREATE TABLE IF NOT EXISTS onboarding_progress (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id   UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE UNIQUE,
  step         INT NOT NULL DEFAULT 0,
  steps_json   JSONB NOT NULL DEFAULT '{}',
  completed    BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ
);

ALTER TABLE onboarding_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "onboarding: propio estudiante"
  ON onboarding_progress FOR ALL
  USING (student_id = auth_student_id());

-- 2. Calendario de examen (también usado por Módulo G)
CREATE TABLE IF NOT EXISTS exam_calendar (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id     UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE UNIQUE,
  exam_date      DATE NOT NULL,
  exam_period    TEXT NOT NULL,
  days_remaining INT
);

ALTER TABLE exam_calendar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "exam_calendar: propio estudiante"
  ON exam_calendar FOR ALL
  USING (student_id = auth_student_id());

-- 3. Función: completar un paso y dar XP
CREATE OR REPLACE FUNCTION complete_onboarding_step(
  p_student_id UUID,
  p_step_id    TEXT,
  p_step_num   INT,
  p_xp         INT DEFAULT 0
)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_total_steps INT := 5;
  v_now         TEXT := now()::TEXT;
BEGIN
  -- Crear registro si no existe
  INSERT INTO onboarding_progress(student_id)
  VALUES (p_student_id)
  ON CONFLICT (student_id) DO NOTHING;

  -- Actualizar paso y steps_json
  UPDATE onboarding_progress
  SET
    step       = GREATEST(step, p_step_num),
    steps_json = steps_json || jsonb_build_object(p_step_id, v_now),
    completed  = (GREATEST(step, p_step_num) >= v_total_steps),
    completed_at = CASE
      WHEN GREATEST(step, p_step_num) >= v_total_steps THEN now()
      ELSE completed_at
    END
  WHERE student_id = p_student_id;

  -- Dar XP si corresponde
  IF p_xp > 0 THEN
    UPDATE students
    SET xp_total = xp_total + p_xp
    WHERE id = p_student_id;
  END IF;

  RETURN true;
END;
$$;

-- 4. Función: obtener estado del onboarding
CREATE OR REPLACE FUNCTION get_onboarding_status(p_student_id UUID)
RETURNS TABLE(step INT, completed BOOLEAN, steps_json JSONB)
LANGUAGE plpgsql STABLE SECURITY DEFINER AS $$
BEGIN
  -- Crear registro si no existe
  INSERT INTO onboarding_progress(student_id)
  VALUES (p_student_id)
  ON CONFLICT (student_id) DO NOTHING;

  RETURN QUERY
  SELECT op.step, op.completed, op.steps_json
  FROM onboarding_progress op
  WHERE op.student_id = p_student_id;
END;
$$;
