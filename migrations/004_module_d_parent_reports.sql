-- ============================================================
-- MIGRATION 004: Módulo D — Reportes semanales para padres
-- Ejecutar en Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS parent_reports (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_id      UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  week_start      DATE NOT NULL,
  questions_total INT NOT NULL DEFAULT 0,
  correct_rate    FLOAT NOT NULL DEFAULT 0,
  top_weak_topics JSONB NOT NULL DEFAULT '[]',
  streak_days     INT NOT NULL DEFAULT 0,
  xp_earned       INT NOT NULL DEFAULT 0,
  predicted_score INT,
  score_delta     INT,
  guardian_level  TEXT,
  sent_at         TIMESTAMPTZ,
  channel         TEXT,
  UNIQUE(student_id, week_start)
);

CREATE INDEX IF NOT EXISTS idx_parent_reports_parent
  ON parent_reports(parent_id, week_start DESC);

ALTER TABLE parent_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "parent_reports: padre ve los suyos"
  ON parent_reports FOR SELECT
  USING (parent_id = auth.uid());

-- Función que construye el reporte de una semana para un estudiante
-- Llamada por la Edge Function del cron semanal
CREATE OR REPLACE FUNCTION build_parent_report(
  p_student_id UUID,
  p_week_start DATE DEFAULT date_trunc('week', CURRENT_DATE)::DATE
)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_parent_id     UUID;
  v_total         INT;
  v_correct_rate  FLOAT;
  v_weak_topics   JSONB;
  v_streak        INT;
  v_xp            INT;
  v_rank          TEXT;
  v_predicted     INT;
  v_delta         INT;
  v_report_id     UUID;
  v_week_ago      TIMESTAMPTZ;
BEGIN
  v_week_ago := p_week_start::TIMESTAMPTZ;

  -- Obtener parent_id del estudiante
  SELECT pr.id INTO v_parent_id
  FROM students st
  JOIN profiles pr ON pr.id = st.profile_id
  WHERE st.id = p_student_id;

  IF v_parent_id IS NULL THEN RETURN NULL; END IF;

  -- Métricas de la semana
  SELECT
    COUNT(*),
    ROUND(AVG(CASE WHEN sa.is_correct THEN 1.0 ELSE 0.0 END)::NUMERIC, 4)
  INTO v_total, v_correct_rate
  FROM student_answers sa
  WHERE sa.student_id = p_student_id
    AND sa.created_at >= v_week_ago
    AND sa.created_at < v_week_ago + INTERVAL '7 days';

  -- Top 3 temas débiles de la semana
  SELECT COALESCE(jsonb_agg(topic), '[]'::jsonb) INTO v_weak_topics
  FROM (
    SELECT q.topic, COUNT(*) as errors
    FROM student_answers sa
    JOIN questions q ON q.id = sa.question_id
    WHERE sa.student_id = p_student_id
      AND sa.is_correct = false
      AND sa.created_at >= v_week_ago
    GROUP BY q.topic
    ORDER BY errors DESC
    LIMIT 3
  ) t;

  -- Estado del estudiante
  SELECT streak_days, xp_total, rank
  INTO v_streak, v_xp, v_rank
  FROM students WHERE id = p_student_id;

  -- Predicción más reciente
  SELECT predicted INTO v_predicted
  FROM score_predictions
  WHERE student_id = p_student_id
  ORDER BY calculated_at DESC LIMIT 1;

  -- Delta vs reporte anterior
  SELECT predicted_score INTO v_delta
  FROM parent_reports
  WHERE student_id = p_student_id
  ORDER BY week_start DESC LIMIT 1;

  IF v_delta IS NOT NULL AND v_predicted IS NOT NULL THEN
    v_delta := v_predicted - v_delta;
  ELSE
    v_delta := NULL;
  END IF;

  -- Insertar o actualizar reporte
  INSERT INTO parent_reports (
    parent_id, student_id, week_start,
    questions_total, correct_rate, top_weak_topics,
    streak_days, xp_earned, predicted_score, score_delta, guardian_level
  ) VALUES (
    v_parent_id, p_student_id, p_week_start,
    COALESCE(v_total, 0), COALESCE(v_correct_rate, 0), COALESCE(v_weak_topics, '[]'),
    COALESCE(v_streak, 0), COALESCE(v_xp, 0), v_predicted, v_delta, v_rank
  )
  ON CONFLICT (student_id, week_start)
  DO UPDATE SET
    questions_total = EXCLUDED.questions_total,
    correct_rate    = EXCLUDED.correct_rate,
    top_weak_topics = EXCLUDED.top_weak_topics,
    streak_days     = EXCLUDED.streak_days,
    xp_earned       = EXCLUDED.xp_earned,
    predicted_score = EXCLUDED.predicted_score,
    score_delta     = EXCLUDED.score_delta,
    guardian_level  = EXCLUDED.guardian_level
  RETURNING id INTO v_report_id;

  RETURN v_report_id;
END;
$$;
