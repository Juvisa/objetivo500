-- ============================================================
-- MIGRATION 007: Módulo H — Certificados de logro
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- 1. Tabla de certificados
CREATE TABLE IF NOT EXISTS certificates (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id   UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  type         TEXT NOT NULL,  -- 'streak_7','streak_30','questions_50','questions_200',
                                -- 'score_300','score_400','score_450','subject_master'
  subject      TEXT,           -- solo para subject_master
  awarded_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  data         JSONB NOT NULL DEFAULT '{}',
  UNIQUE (student_id, type, subject)
);

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "certificates: propio estudiante"
  ON certificates FOR ALL
  USING (student_id = auth_student_id());

-- 2. Función: evaluar y otorgar certificados
CREATE OR REPLACE FUNCTION evaluate_certificates(p_student_id UUID)
RETURNS SETOF TEXT LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_streak      INT;
  v_q_total     INT;
  v_pred        NUMERIC;
  v_subject     TEXT;
  v_acc         NUMERIC;
  v_subject_q   INT;
  v_awarded     TEXT;
BEGIN
  -- Datos del estudiante
  SELECT streak_days INTO v_streak FROM students WHERE id = p_student_id;

  -- Total preguntas respondidas
  SELECT COUNT(*) INTO v_q_total FROM student_answers WHERE student_id = p_student_id;

  -- Predicción más reciente
  SELECT predicted INTO v_pred FROM score_predictions
  WHERE student_id = p_student_id ORDER BY calculated_at DESC LIMIT 1;

  -- ── Racha ─────────────────────────────────────────────────────
  IF v_streak >= 7 THEN
    INSERT INTO certificates (student_id, type, data)
    VALUES (p_student_id, 'streak_7', jsonb_build_object('streak', v_streak))
    ON CONFLICT DO NOTHING;
    IF FOUND THEN v_awarded := 'streak_7'; RETURN NEXT v_awarded; END IF;
  END IF;

  IF v_streak >= 30 THEN
    INSERT INTO certificates (student_id, type, data)
    VALUES (p_student_id, 'streak_30', jsonb_build_object('streak', v_streak))
    ON CONFLICT DO NOTHING;
    IF FOUND THEN v_awarded := 'streak_30'; RETURN NEXT v_awarded; END IF;
  END IF;

  -- ── Volumen de práctica ────────────────────────────────────────
  IF v_q_total >= 50 THEN
    INSERT INTO certificates (student_id, type, data)
    VALUES (p_student_id, 'questions_50', jsonb_build_object('total', v_q_total))
    ON CONFLICT DO NOTHING;
    IF FOUND THEN RETURN NEXT 'questions_50'; END IF;
  END IF;

  IF v_q_total >= 200 THEN
    INSERT INTO certificates (student_id, type, data)
    VALUES (p_student_id, 'questions_200', jsonb_build_object('total', v_q_total))
    ON CONFLICT DO NOTHING;
    IF FOUND THEN RETURN NEXT 'questions_200'; END IF;
  END IF;

  IF v_q_total >= 500 THEN
    INSERT INTO certificates (student_id, type, data)
    VALUES (p_student_id, 'questions_500', jsonb_build_object('total', v_q_total))
    ON CONFLICT DO NOTHING;
    IF FOUND THEN RETURN NEXT 'questions_500'; END IF;
  END IF;

  -- ── Predicción de puntaje ──────────────────────────────────────
  IF v_pred >= 300 THEN
    INSERT INTO certificates (student_id, type, data)
    VALUES (p_student_id, 'score_300', jsonb_build_object('score', v_pred))
    ON CONFLICT DO NOTHING;
    IF FOUND THEN RETURN NEXT 'score_300'; END IF;
  END IF;

  IF v_pred >= 400 THEN
    INSERT INTO certificates (student_id, type, data)
    VALUES (p_student_id, 'score_400', jsonb_build_object('score', v_pred))
    ON CONFLICT DO NOTHING;
    IF FOUND THEN RETURN NEXT 'score_400'; END IF;
  END IF;

  IF v_pred >= 450 THEN
    INSERT INTO certificates (student_id, type, data)
    VALUES (p_student_id, 'score_450', jsonb_build_object('score', v_pred))
    ON CONFLICT DO NOTHING;
    IF FOUND THEN RETURN NEXT 'score_450'; END IF;
  END IF;

  -- ── Dominio por materia (>= 80% con >= 30 preguntas) ──────────
  FOR v_subject, v_acc, v_subject_q IN
    SELECT subject,
           ROUND(AVG(CASE WHEN is_correct THEN 1.0 ELSE 0.0 END) * 100, 1),
           COUNT(*)
    FROM student_answers
    WHERE student_id = p_student_id
    GROUP BY subject
    HAVING COUNT(*) >= 30
  LOOP
    IF v_acc >= 80 THEN
      INSERT INTO certificates (student_id, type, subject, data)
      VALUES (p_student_id, 'subject_master', v_subject,
              jsonb_build_object('subject', v_subject, 'accuracy', v_acc, 'total', v_subject_q))
      ON CONFLICT DO NOTHING;
      IF FOUND THEN RETURN NEXT 'subject_master:' || v_subject; END IF;
    END IF;
  END LOOP;

  RETURN;
END;
$$;
