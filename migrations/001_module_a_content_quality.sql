-- ============================================================
-- MIGRATION 001: Módulo A — Validación de contenido
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- 1. Columnas nuevas en questions
ALTER TABLE questions
  ADD COLUMN IF NOT EXISTS is_paused    BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS pause_reason TEXT,
  ADD COLUMN IF NOT EXISTS report_count INT NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_questions_paused ON questions(is_paused) WHERE is_paused = true;

-- 2. Tabla de reportes de calidad
CREATE TABLE IF NOT EXISTS question_reports (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id  UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  student_id   UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  reason       TEXT NOT NULL DEFAULT 'other',
  comment      TEXT,
  status       TEXT NOT NULL DEFAULT 'pending',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT question_reports_reason_check
    CHECK (reason IN ('wrong_answer','bad_wording','unclear','other')),
  CONSTRAINT question_reports_status_check
    CHECK (status IN ('pending','reviewed','fixed','dismissed'))
);

CREATE INDEX IF NOT EXISTS idx_qreports_question ON question_reports(question_id);
CREATE INDEX IF NOT EXISTS idx_qreports_status   ON question_reports(status);

-- RLS
ALTER TABLE question_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reports: estudiante puede insertar"
  ON question_reports FOR INSERT
  WITH CHECK (student_id = auth_student_id());

CREATE POLICY "reports: estudiante ve sus propios"
  ON question_reports FOR SELECT
  USING (student_id = auth_student_id());

-- 3. Función: incrementar contador de reportes
CREATE OR REPLACE FUNCTION increment_report_count(q_id UUID)
RETURNS void LANGUAGE sql SECURITY DEFINER AS $$
  UPDATE questions
  SET report_count = report_count + 1
  WHERE id = q_id;
$$;

-- 4. Auto-pausa cuando report_count llega a 5
CREATE OR REPLACE FUNCTION check_auto_pause(q_id UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE questions
  SET
    is_paused    = true,
    pause_reason = 'auto_paused: 5+ reports'
  WHERE id = q_id
    AND report_count >= 5
    AND is_paused = false;
END;
$$;

-- 5. Auto-pausa nocturna por error_rate > 0.85 con 20+ respuestas
CREATE OR REPLACE FUNCTION auto_pause_bad_questions()
RETURNS void LANGUAGE sql SECURITY DEFINER AS $$
  UPDATE questions q
  SET
    is_paused    = true,
    pause_reason = 'auto_paused: error_rate > 0.85 con 20+ respuestas'
  WHERE q.id IN (
    SELECT sa.question_id
    FROM student_answers sa
    GROUP BY sa.question_id
    HAVING COUNT(*) >= 20
       AND AVG(CASE WHEN sa.is_correct THEN 1.0 ELSE 0.0 END) < 0.15
  )
  AND q.is_paused = false;
$$;

-- 6. Actualizar get_session_questions para excluir preguntas pausadas
CREATE OR REPLACE FUNCTION get_session_questions(
  p_student_id   UUID,
  p_n            INT DEFAULT 20,
  p_subject      TEXT DEFAULT NULL
)
RETURNS SETOF questions LANGUAGE plpgsql STABLE SECURITY DEFINER AS $$
DECLARE
  v_weak_n     INT := ROUND(p_n * 0.6);
  v_random_n   INT := p_n - v_weak_n;
  v_difficulty SMALLINT;
BEGIN
  SELECT LEAST(3, GREATEST(1, CEIL(level::NUMERIC / 17)))
  INTO v_difficulty
  FROM students WHERE id = p_student_id;

  RETURN QUERY
  WITH
  weak AS (
    SELECT wt.subject, wt.topic
    FROM weak_topics wt
    WHERE wt.student_id = p_student_id
      AND wt.error_rate > 0.5
      AND (p_subject IS NULL OR wt.subject = p_subject)
    ORDER BY wt.error_rate DESC
    LIMIT 10
  ),
  weak_questions AS (
    SELECT q.*
    FROM questions q
    JOIN weak w ON w.subject = q.subject AND w.topic = q.topic
    WHERE (p_subject IS NULL OR q.subject = p_subject)
      AND q.is_paused = false
      AND q.id NOT IN (
        SELECT sa.question_id FROM student_answers sa
        WHERE sa.student_id = p_student_id
          AND sa.created_at > NOW() - INTERVAL '7 days'
      )
    ORDER BY RANDOM()
    LIMIT v_weak_n
  ),
  random_questions AS (
    SELECT q.*
    FROM questions q
    WHERE q.difficulty = v_difficulty
      AND (p_subject IS NULL OR q.subject = p_subject)
      AND q.is_paused = false
      AND q.id NOT IN (SELECT id FROM weak_questions)
      AND q.id NOT IN (
        SELECT sa.question_id FROM student_answers sa
        WHERE sa.student_id = p_student_id
          AND sa.created_at > NOW() - INTERVAL '3 days'
      )
    ORDER BY RANDOM()
    LIMIT v_random_n
  )
  SELECT * FROM weak_questions
  UNION ALL
  SELECT * FROM random_questions;
END;
$$;
