-- ============================================================
-- MIGRATION 002: Módulo C — Planes y monetización
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- 1. Tabla de planes
CREATE TABLE IF NOT EXISTS plans (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         TEXT UNIQUE NOT NULL,
  name         TEXT NOT NULL,
  price_cop    INT NOT NULL DEFAULT 0,
  max_students SMALLINT NOT NULL DEFAULT 1,
  features     JSONB
);

INSERT INTO plans (slug, name, price_cop, max_students, features) VALUES
  ('free',    'El Guardián Duerme', 0,     1, '{"questions_per_day":10,"simulacros":false,"battles":false,"score_prediction":false,"certificates":false}'),
  ('elite',   'Élite AURA',         29900, 1, '{"questions_per_day":null,"simulacros":true,"battles":true,"score_prediction":true,"certificates":true}'),
  ('familia', 'Plan Familia',        49900, 3, '{"questions_per_day":null,"simulacros":true,"battles":true,"score_prediction":true,"certificates":true,"family_comparison":true}')
ON CONFLICT (slug) DO NOTHING;

-- 2. Tabla de suscripciones
CREATE TABLE IF NOT EXISTS subscriptions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id       UUID NOT NULL REFERENCES plans(id),
  status        TEXT NOT NULL DEFAULT 'trial',
  gateway       TEXT,
  gateway_ref   TEXT,
  started_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at    TIMESTAMPTZ,
  trial_ends_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '7 days'),
  cancelled_at  TIMESTAMPTZ,
  CONSTRAINT subscriptions_status_check
    CHECK (status IN ('active','expired','cancelled','trial'))
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_parent ON subscriptions(parent_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subscriptions: padre ve las suyas"
  ON subscriptions FOR SELECT
  USING (parent_id = auth.uid());

-- 3. Tabla de uso diario
CREATE TABLE IF NOT EXISTS daily_usage (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id         UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  date               DATE NOT NULL DEFAULT CURRENT_DATE,
  questions_answered INT NOT NULL DEFAULT 0,
  capsules_done      INT NOT NULL DEFAULT 0,
  UNIQUE(student_id, date)
);

ALTER TABLE daily_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "daily_usage: propio estudiante"
  ON daily_usage FOR ALL
  USING (student_id = auth_student_id());

-- 4. Función: obtener plan activo de un estudiante
--    Sube por student → profiles(parent_id) → subscriptions → plans
CREATE OR REPLACE FUNCTION get_student_plan(p_student_id UUID)
RETURNS TEXT LANGUAGE plpgsql STABLE SECURITY DEFINER AS $$
DECLARE
  v_slug TEXT;
BEGIN
  SELECT pl.slug INTO v_slug
  FROM students st
  JOIN profiles  pr ON pr.id = st.profile_id
  JOIN subscriptions s ON s.parent_id = pr.id
  JOIN plans pl ON pl.id = s.plan_id
  WHERE st.id = p_student_id
    AND s.status IN ('active','trial')
    AND (s.expires_at IS NULL OR s.expires_at > now())
    AND (s.trial_ends_at IS NULL OR s.trial_ends_at > now())
  ORDER BY pl.price_cop DESC
  LIMIT 1;

  RETURN COALESCE(v_slug, 'free');
END;
$$;

-- 5. Función: incrementar uso diario y devolver si aún puede responder
CREATE OR REPLACE FUNCTION increment_daily_usage(p_student_id UUID)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_plan        TEXT;
  v_limit       INT;
  v_answered    INT;
BEGIN
  v_plan := get_student_plan(p_student_id);

  -- Plan free: límite de 10; elite/familia: sin límite
  IF v_plan IN ('elite','familia') THEN
    INSERT INTO daily_usage(student_id, date, questions_answered)
    VALUES (p_student_id, CURRENT_DATE, 1)
    ON CONFLICT (student_id, date)
    DO UPDATE SET questions_answered = daily_usage.questions_answered + 1;
    RETURN true;
  END IF;

  -- Plan free
  v_limit := 10;
  SELECT COALESCE(questions_answered, 0) INTO v_answered
  FROM daily_usage
  WHERE student_id = p_student_id AND date = CURRENT_DATE;

  IF v_answered >= v_limit THEN
    RETURN false;
  END IF;

  INSERT INTO daily_usage(student_id, date, questions_answered)
  VALUES (p_student_id, CURRENT_DATE, 1)
  ON CONFLICT (student_id, date)
  DO UPDATE SET questions_answered = daily_usage.questions_answered + 1;

  RETURN true;
END;
$$;
