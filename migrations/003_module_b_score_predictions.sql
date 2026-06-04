-- ============================================================
-- MIGRATION 003: Módulo B — Predicción de puntaje
-- Ejecutar en Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS score_predictions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id    UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  predicted     INT NOT NULL,
  by_subject    JSONB NOT NULL DEFAULT '{}',
  confidence    FLOAT NOT NULL DEFAULT 0,
  sample_size   INT NOT NULL DEFAULT 0,
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_score_pred_student
  ON score_predictions(student_id, calculated_at DESC);

ALTER TABLE score_predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "score_predictions: propio estudiante"
  ON score_predictions FOR ALL
  USING (student_id = auth_student_id());
