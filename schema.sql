-- ============================================================
-- OBJETIVO 500 — Supabase PostgreSQL Schema v1.0
-- Ejecutar en el SQL Editor de Supabase en este orden exacto.
-- ============================================================

-- ── 0. Extensiones ───────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── 1. ENUMs ─────────────────────────────────────────────────
CREATE TYPE user_role      AS ENUM ('student', 'parent');
CREATE TYPE student_rank   AS ENUM ('novato', 'explorador', 'avanzado', 'diamante', 'leyenda');
CREATE TYPE plan_type      AS ENUM ('free', 'mensual', 'semestral', 'anual');
CREATE TYPE license_status AS ENUM ('trial', 'active', 'expired', 'cancelled');
CREATE TYPE feed_event     AS ENUM (
  'badge_unlocked', 'level_up', 'streak_milestone',
  'perfect_session', 'rank_up', 'first_correct'
);

-- ── 2. TABLAS ────────────────────────────────────────────────

-- 2.1 profiles — extiende auth.users
CREATE TABLE profiles (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role        user_role NOT NULL DEFAULT 'student',
  username    TEXT NOT NULL,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT profiles_user_id_key UNIQUE (user_id),
  CONSTRAINT profiles_username_key UNIQUE (username)
);
COMMENT ON TABLE profiles IS 'Extiende auth.users con rol y datos de perfil visibles.';

-- 2.2 students — datos académicos y gamificación
CREATE TABLE students (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id        UUID REFERENCES profiles(id) ON DELETE SET NULL,
  grade            SMALLINT NOT NULL DEFAULT 11 CHECK (grade BETWEEN 6 AND 11),
  streak_days      INT NOT NULL DEFAULT 0,
  streak_last_date DATE,
  xp_total         INT NOT NULL DEFAULT 0,
  level            SMALLINT NOT NULL DEFAULT 1,
  rank             student_rank NOT NULL DEFAULT 'novato',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT students_profile_id_key UNIQUE (profile_id)
);
COMMENT ON TABLE students IS 'Datos de progreso académico y gamificación por estudiante.';

-- 2.3 xp_transactions — libro mayor de XP
CREATE TABLE xp_transactions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id  UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  amount      INT NOT NULL CHECK (amount > 0),
  reason      TEXT NOT NULL,
  multiplier  NUMERIC(4,2) NOT NULL DEFAULT 1.00,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE xp_transactions IS 'Registro inmutable de cada ganancia de XP.';

-- 2.4 badges — catálogo de insignias
CREATE TABLE badges (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug           TEXT NOT NULL UNIQUE,
  name           TEXT NOT NULL,
  description    TEXT NOT NULL,
  icon_url       TEXT,
  criteria_json  JSONB NOT NULL DEFAULT '{}',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE badges IS 'Catálogo maestro de insignias. Solo lectura para usuarios.';

-- 2.5 student_badges — insignias desbloqueadas
CREATE TABLE student_badges (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id   UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  badge_id     UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  unlocked_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT student_badges_unique UNIQUE (student_id, badge_id)
);

-- 2.6 questions — banco de preguntas ICFES
CREATE TABLE questions (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject            TEXT NOT NULL,            -- 'matematicas', 'lectura_critica', etc.
  topic              TEXT NOT NULL,
  difficulty         SMALLINT NOT NULL DEFAULT 2 CHECK (difficulty BETWEEN 1 AND 3),
  stem               TEXT NOT NULL,            -- enunciado
  context_text       TEXT,                     -- texto de lectura base (nullable)
  options_json       JSONB NOT NULL,           -- ["opción A","opción B","opción C","opción D"]
  correct_index      SMALLINT NOT NULL CHECK (correct_index BETWEEN 0 AND 3),
  explanation        TEXT NOT NULL,
  icfes_competency   TEXT,
  distractor_type    TEXT,
  concept_key        TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE questions IS 'Banco de preguntas ICFES. Inmutable para usuarios.';

-- 2.7 student_answers — historial de respuestas
CREATE TABLE student_answers (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id      UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  question_id     UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  selected_index  SMALLINT NOT NULL CHECK (selected_index BETWEEN 0 AND 3),
  is_correct      BOOLEAN NOT NULL,
  time_seconds    INT NOT NULL DEFAULT 0 CHECK (time_seconds >= 0),
  session_id      UUID,                        -- agrupa preguntas de un simulacro
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.8 weak_topics — temas débiles por área (promedio móvil)
CREATE TABLE weak_topics (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id  UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject     TEXT NOT NULL,
  topic       TEXT NOT NULL,
  error_rate  NUMERIC(5,4) NOT NULL DEFAULT 0.5000 CHECK (error_rate BETWEEN 0 AND 1),
  attempts    INT NOT NULL DEFAULT 0,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT weak_topics_unique UNIQUE (student_id, subject, topic)
);
COMMENT ON TABLE weak_topics IS 'Tasa de error por tema, actualizada con promedio móvil exponencial.';

-- 2.9 follows — red social entre estudiantes
CREATE TABLE follows (
  follower_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id),
  CONSTRAINT follows_no_self CHECK (follower_id <> following_id)
);

-- 2.10 social_feed — feed de logros públicos
CREATE TABLE social_feed (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id  UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  event_type  feed_event NOT NULL,
  payload_json JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE social_feed IS 'Feed público de eventos de gamificación. Inmutable.';

-- 2.11 weekly_leaderboard — ranking semanal
CREATE TABLE weekly_leaderboard (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id     UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  week_start     DATE NOT NULL,
  xp_earned      INT NOT NULL DEFAULT 0,
  rank_position  INT,
  CONSTRAINT weekly_leaderboard_unique UNIQUE (student_id, week_start)
);

-- 2.12 licenses — monetización
CREATE TABLE licenses (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_id  UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  plan        plan_type NOT NULL DEFAULT 'free',
  status      license_status NOT NULL DEFAULT 'trial',
  expires_at  TIMESTAMPTZ,
  stripe_subscription_id TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT licenses_unique UNIQUE (parent_id, student_id)
);
COMMENT ON TABLE licenses IS 'Gestión de planes de suscripción por hijo.';

-- ── 3. ÍNDICES DE RENDIMIENTO ─────────────────────────────────
CREATE INDEX idx_students_profile    ON students(profile_id);
CREATE INDEX idx_students_parent     ON students(parent_id);
CREATE INDEX idx_xp_student_date     ON xp_transactions(student_id, created_at DESC);
CREATE INDEX idx_answers_student     ON student_answers(student_id, created_at DESC);
CREATE INDEX idx_answers_question    ON student_answers(question_id);
CREATE INDEX idx_answers_session     ON student_answers(session_id) WHERE session_id IS NOT NULL;
CREATE INDEX idx_weak_student        ON weak_topics(student_id, error_rate DESC);
CREATE INDEX idx_questions_subject   ON questions(subject, difficulty);
CREATE INDEX idx_feed_student        ON social_feed(student_id, created_at DESC);
CREATE INDEX idx_feed_created        ON social_feed(created_at DESC);
CREATE INDEX idx_leaderboard_week    ON weekly_leaderboard(week_start DESC, xp_earned DESC);
CREATE INDEX idx_licenses_student    ON licenses(student_id);

-- ── 4. ROW LEVEL SECURITY ────────────────────────────────────

-- Habilitar RLS en todas las tablas
ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE students          ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_transactions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges             ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_badges     ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_answers    ENABLE ROW LEVEL SECURITY;
ALTER TABLE weak_topics        ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows            ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_feed        ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE licenses           ENABLE ROW LEVEL SECURITY;

-- Helper function: obtiene el profile_id del usuario actual
CREATE OR REPLACE FUNCTION auth_profile_id()
RETURNS UUID LANGUAGE SQL STABLE SECURITY DEFINER AS $$
  SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1;
$$;

-- Helper function: obtiene el student_id del usuario actual (si es estudiante)
CREATE OR REPLACE FUNCTION auth_student_id()
RETURNS UUID LANGUAGE SQL STABLE SECURITY DEFINER AS $$
  SELECT s.id FROM students s
  JOIN profiles p ON p.id = s.profile_id
  WHERE p.user_id = auth.uid() LIMIT 1;
$$;

-- Helper function: obtiene los student_ids hijos del padre actual
CREATE OR REPLACE FUNCTION auth_children_ids()
RETURNS SETOF UUID LANGUAGE SQL STABLE SECURITY DEFINER AS $$
  SELECT s.id FROM students s
  WHERE s.parent_id = auth_profile_id();
$$;

-- Helper function: ¿el usuario es padre del estudiante dado?
CREATE OR REPLACE FUNCTION is_parent_of(p_student_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM students s
    WHERE s.id = p_student_id
      AND s.parent_id = auth_profile_id()
  );
$$;

-- ── 4.1 RLS: profiles ────────────────────────────────────────
CREATE POLICY "profiles: own read"
  ON profiles FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "profiles: own update"
  ON profiles FOR UPDATE
  USING (user_id = auth.uid());

-- Padres pueden ver perfiles de sus hijos
CREATE POLICY "profiles: parent reads child"
  ON profiles FOR SELECT
  USING (
    id IN (SELECT parent_id FROM students WHERE profile_id = auth_profile_id())
    OR id IN (
      SELECT s.profile_id FROM students s WHERE s.parent_id = auth_profile_id()
    )
  );

-- Leaderboard: lectura de perfiles en ranking (solo username y avatar)
CREATE POLICY "profiles: leaderboard read"
  ON profiles FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- ── 4.2 RLS: students ────────────────────────────────────────
CREATE POLICY "students: own read"
  ON students FOR SELECT
  USING (profile_id = auth_profile_id());

CREATE POLICY "students: own update"
  ON students FOR UPDATE
  USING (profile_id = auth_profile_id());

CREATE POLICY "students: parent reads children"
  ON students FOR SELECT
  USING (parent_id = auth_profile_id());

-- Necesario para leaderboard
CREATE POLICY "students: authenticated read for leaderboard"
  ON students FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- ── 4.3 RLS: xp_transactions ─────────────────────────────────
CREATE POLICY "xp: own read"
  ON xp_transactions FOR SELECT
  USING (student_id = auth_student_id());

CREATE POLICY "xp: parent reads children"
  ON xp_transactions FOR SELECT
  USING (is_parent_of(student_id));

-- Solo el backend (service role) puede insertar XP
CREATE POLICY "xp: service insert"
  ON xp_transactions FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL); -- restringido a service_role en prod

-- ── 4.4 RLS: badges ──────────────────────────────────────────
CREATE POLICY "badges: all authenticated read"
  ON badges FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- ── 4.5 RLS: student_badges ──────────────────────────────────
CREATE POLICY "student_badges: own read"
  ON student_badges FOR SELECT
  USING (student_id = auth_student_id());

CREATE POLICY "student_badges: parent reads children"
  ON student_badges FOR SELECT
  USING (is_parent_of(student_id));

CREATE POLICY "student_badges: leaderboard read"
  ON student_badges FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- ── 4.6 RLS: questions ───────────────────────────────────────
CREATE POLICY "questions: all authenticated read"
  ON questions FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- ── 4.7 RLS: student_answers ─────────────────────────────────
CREATE POLICY "answers: own read"
  ON student_answers FOR SELECT
  USING (student_id = auth_student_id());

CREATE POLICY "answers: own insert"
  ON student_answers FOR INSERT
  WITH CHECK (student_id = auth_student_id());

CREATE POLICY "answers: parent reads children"
  ON student_answers FOR SELECT
  USING (is_parent_of(student_id));

-- ── 4.8 RLS: weak_topics ─────────────────────────────────────
CREATE POLICY "weak: own read"
  ON weak_topics FOR SELECT
  USING (student_id = auth_student_id());

CREATE POLICY "weak: parent reads children"
  ON weak_topics FOR SELECT
  USING (is_parent_of(student_id));

-- ── 4.9 RLS: follows ─────────────────────────────────────────
CREATE POLICY "follows: own read"
  ON follows FOR SELECT
  USING (follower_id = auth_profile_id() OR following_id = auth_profile_id());

CREATE POLICY "follows: own insert"
  ON follows FOR INSERT
  WITH CHECK (follower_id = auth_profile_id());

CREATE POLICY "follows: own delete"
  ON follows FOR DELETE
  USING (follower_id = auth_profile_id());

-- ── 4.10 RLS: social_feed ────────────────────────────────────
-- Feed público: todos los autenticados pueden leer
CREATE POLICY "feed: authenticated read"
  ON social_feed FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- ── 4.11 RLS: weekly_leaderboard ─────────────────────────────
CREATE POLICY "leaderboard: authenticated read"
  ON weekly_leaderboard FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- ── 4.12 RLS: licenses ───────────────────────────────────────
CREATE POLICY "licenses: parent reads own"
  ON licenses FOR SELECT
  USING (parent_id = auth_profile_id());

CREATE POLICY "licenses: student reads own"
  ON licenses FOR SELECT
  USING (student_id = auth_student_id());

-- ── 5. FUNCIONES DE NEGOCIO ───────────────────────────────────

-- 5.1 Otorgar XP con multiplicador y actualizar rank/level
CREATE OR REPLACE FUNCTION award_xp(
  p_student_id  UUID,
  p_amount      INT,
  p_reason      TEXT,
  p_multiplier  NUMERIC DEFAULT 1.0
)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_effective INT;
  v_new_xp    INT;
  v_old_rank  student_rank;
  v_new_rank  student_rank;
  v_new_level SMALLINT;
BEGIN
  -- Calcular XP efectivo (redondeado al entero más cercano)
  v_effective := GREATEST(1, ROUND(p_amount * p_multiplier)::INT);

  -- Registrar transacción
  INSERT INTO xp_transactions (student_id, amount, reason, multiplier)
  VALUES (p_student_id, v_effective, p_reason, p_multiplier);

  -- Actualizar total en students
  UPDATE students
  SET xp_total = xp_total + v_effective
  WHERE id = p_student_id
  RETURNING xp_total, rank INTO v_new_xp, v_old_rank;

  -- Calcular nuevo level (cada 100 XP, máx 50)
  v_new_level := LEAST(50, GREATEST(1, (v_new_xp / 100) + 1));

  -- Calcular nuevo rank por umbrales
  v_new_rank := CASE
    WHEN v_new_xp >= 10000 THEN 'leyenda'::student_rank
    WHEN v_new_xp >= 4000  THEN 'diamante'::student_rank
    WHEN v_new_xp >= 1500  THEN 'avanzado'::student_rank
    WHEN v_new_xp >= 500   THEN 'explorador'::student_rank
    ELSE 'novato'::student_rank
  END;

  UPDATE students
  SET level = v_new_level, rank = v_new_rank
  WHERE id = p_student_id;

  -- Emitir evento de rank up si cambió
  IF v_new_rank <> v_old_rank THEN
    INSERT INTO social_feed (student_id, event_type, payload_json)
    VALUES (p_student_id, 'rank_up', jsonb_build_object(
      'old_rank', v_old_rank::TEXT,
      'new_rank', v_new_rank::TEXT,
      'xp_total', v_new_xp
    ));
  END IF;

  -- Actualizar leaderboard semanal (zona horaria Colombia UTC-5)
  INSERT INTO weekly_leaderboard (student_id, week_start, xp_earned)
  VALUES (
    p_student_id,
    DATE_TRUNC('week', (NOW() AT TIME ZONE 'America/Bogota')::DATE),
    v_effective
  )
  ON CONFLICT (student_id, week_start)
  DO UPDATE SET xp_earned = weekly_leaderboard.xp_earned + v_effective;
END;
$$;

-- 5.2 Actualizar racha diaria
CREATE OR REPLACE FUNCTION update_streak(p_student_id UUID)
RETURNS INT LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_today        DATE;
  v_last_date    DATE;
  v_streak       INT;
  v_multiplier   NUMERIC;
  v_dow          INT;    -- day of week (0=Sunday, 6=Saturday)
BEGIN
  v_today := (NOW() AT TIME ZONE 'America/Bogota')::DATE;
  v_dow   := EXTRACT(DOW FROM v_today)::INT;

  SELECT streak_last_date, streak_days
  INTO v_last_date, v_streak
  FROM students WHERE id = p_student_id;

  -- Si ya se registró hoy, no hacer nada
  IF v_last_date = v_today THEN
    RETURN v_streak;
  END IF;

  -- Si fue ayer: incrementar racha
  IF v_last_date = v_today - INTERVAL '1 day' THEN
    v_streak := v_streak + 1;
  ELSE
    -- Racha rota
    v_streak := 1;
  END IF;

  UPDATE students
  SET streak_days      = v_streak,
      streak_last_date = v_today
  WHERE id = p_student_id;

  -- Evento de hito de racha (7, 14, 30, 60, 100 días)
  IF v_streak IN (7, 14, 30, 60, 100) THEN
    INSERT INTO social_feed (student_id, event_type, payload_json)
    VALUES (p_student_id, 'streak_milestone', jsonb_build_object('days', v_streak));
  END IF;

  RETURN v_streak;
END;
$$;

-- 5.3 Actualizar weak_topics con promedio móvil exponencial (α=0.3)
CREATE OR REPLACE FUNCTION update_weak_topic(
  p_student_id UUID,
  p_subject    TEXT,
  p_topic      TEXT,
  p_is_correct BOOLEAN
)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_alpha      NUMERIC := 0.3;
  v_new_error  NUMERIC;
  v_error_val  NUMERIC := CASE WHEN p_is_correct THEN 0 ELSE 1 END;
BEGIN
  INSERT INTO weak_topics (student_id, subject, topic, error_rate, attempts)
  VALUES (p_student_id, p_subject, p_topic, v_error_val, 1)
  ON CONFLICT (student_id, subject, topic) DO UPDATE
  SET
    error_rate = weak_topics.error_rate * (1 - v_alpha) + v_error_val * v_alpha,
    attempts   = weak_topics.attempts + 1,
    updated_at = NOW();
END;
$$;

-- 5.4 Verificar y otorgar insignias pendientes
CREATE OR REPLACE FUNCTION check_and_award_badges(p_student_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_badge_id   UUID;
  v_correct    INT;
  v_streak     INT;
  v_xp         INT;
  v_fast       INT;
BEGIN
  -- Obtener métricas actuales
  SELECT streak_days, xp_total INTO v_streak, v_xp
  FROM students WHERE id = p_student_id;

  -- Contar respuestas correctas totales
  SELECT COUNT(*) INTO v_correct
  FROM student_answers WHERE student_id = p_student_id AND is_correct = TRUE;

  -- Contar respuestas rápidas correctas (< 10s)
  SELECT COUNT(*) INTO v_fast
  FROM student_answers
  WHERE student_id = p_student_id AND is_correct = TRUE AND time_seconds < 10;

  -- ── Evaluar cada insignia ─────────────────────────────────

  -- 'primera_chispa': primera respuesta correcta
  IF v_correct >= 1 THEN
    SELECT id INTO v_badge_id FROM badges WHERE slug = 'primera_chispa';
    IF v_badge_id IS NOT NULL THEN
      INSERT INTO student_badges (student_id, badge_id)
      VALUES (p_student_id, v_badge_id)
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;

  -- 'matematico_imparable': 20 correctas en Matemáticas
  IF (
    SELECT COUNT(*) FROM student_answers sa
    JOIN questions q ON q.id = sa.question_id
    WHERE sa.student_id = p_student_id AND sa.is_correct = TRUE
      AND q.subject = 'matematicas'
  ) >= 20 THEN
    SELECT id INTO v_badge_id FROM badges WHERE slug = 'matematico_imparable';
    IF v_badge_id IS NOT NULL THEN
      INSERT INTO student_badges (student_id, badge_id)
      VALUES (p_student_id, v_badge_id)
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;

  -- 'lector_critico': 20 correctas en Lectura Crítica
  IF (
    SELECT COUNT(*) FROM student_answers sa
    JOIN questions q ON q.id = sa.question_id
    WHERE sa.student_id = p_student_id AND sa.is_correct = TRUE
      AND q.subject = 'lectura_critica'
  ) >= 20 THEN
    SELECT id INTO v_badge_id FROM badges WHERE slug = 'lector_critico';
    IF v_badge_id IS NOT NULL THEN
      INSERT INTO student_badges (student_id, badge_id)
      VALUES (p_student_id, v_badge_id)
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;

  -- 'racha_de_fuego': 7 días consecutivos
  IF v_streak >= 7 THEN
    SELECT id INTO v_badge_id FROM badges WHERE slug = 'racha_de_fuego';
    IF v_badge_id IS NOT NULL THEN
      INSERT INTO student_badges (student_id, badge_id)
      VALUES (p_student_id, v_badge_id)
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;

  -- 'velocista': 10 correctas en < 10 segundos
  IF v_fast >= 10 THEN
    SELECT id INTO v_badge_id FROM badges WHERE slug = 'velocista';
    IF v_badge_id IS NOT NULL THEN
      INSERT INTO student_badges (student_id, badge_id)
      VALUES (p_student_id, v_badge_id)
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;

  -- 'rango_diamante': alcanzar Diamante
  IF v_xp >= 4000 THEN
    SELECT id INTO v_badge_id FROM badges WHERE slug = 'rango_diamante';
    IF v_badge_id IS NOT NULL THEN
      INSERT INTO student_badges (student_id, badge_id)
      VALUES (p_student_id, v_badge_id)
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
END;
$$;

-- 5.5 Función principal: procesar una respuesta completa
-- Llama racha + XP + weak_topic + badges en una sola transacción
CREATE OR REPLACE FUNCTION process_answer(
  p_student_id    UUID,
  p_question_id   UUID,
  p_selected_idx  SMALLINT,
  p_time_seconds  INT,
  p_session_id    UUID DEFAULT NULL
)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_question     questions%ROWTYPE;
  v_is_correct   BOOLEAN;
  v_xp_base      INT := 0;
  v_xp_bonus     INT := 0;
  v_streak_bonus INT := 0;
  v_multiplier   NUMERIC := 1.0;
  v_streak       INT;
  v_dow          INT;
  v_today        DATE;
BEGIN
  -- 1. Cargar la pregunta
  SELECT * INTO v_question FROM questions WHERE id = p_question_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Pregunta no encontrada: %', p_question_id;
  END IF;

  v_is_correct := (p_selected_idx = v_question.correct_index);

  -- 2. Registrar respuesta
  INSERT INTO student_answers (
    student_id, question_id, selected_index, is_correct, time_seconds, session_id
  ) VALUES (
    p_student_id, p_question_id, p_selected_idx, v_is_correct, p_time_seconds, p_session_id
  );

  -- 3. Actualizar weak_topic siempre (correcta o no)
  PERFORM update_weak_topic(
    p_student_id, v_question.subject, v_question.topic, v_is_correct
  );

  -- 4. XP solo si correcta
  IF v_is_correct THEN
    v_xp_base := 10;

    -- Bonus velocidad (< 15 segundos)
    IF p_time_seconds < 15 THEN
      v_xp_bonus := 5;
    END IF;

    -- Actualizar racha y obtener días
    v_streak := update_streak(p_student_id);

    -- Bonus por racha (2 XP por día, máx 20)
    v_streak_bonus := LEAST(20, v_streak * 2);

    -- Multiplicador fin de semana (Colombia)
    v_today := (NOW() AT TIME ZONE 'America/Bogota')::DATE;
    v_dow   := EXTRACT(DOW FROM v_today)::INT;
    IF v_dow IN (0, 6) THEN
      v_multiplier := 2.0;
    END IF;

    -- Otorgar XP total
    PERFORM award_xp(
      p_student_id,
      v_xp_base + v_xp_bonus + v_streak_bonus,
      FORMAT('Respuesta correcta — %s (%s)', v_question.subject, v_question.topic),
      v_multiplier
    );

    -- Verificar insignias
    PERFORM check_and_award_badges(p_student_id);

    -- Emitir a feed si es la primera respuesta correcta (badge + feed)
    IF (
      SELECT COUNT(*) = 1 FROM student_answers
      WHERE student_id = p_student_id AND is_correct = TRUE
    ) THEN
      INSERT INTO social_feed (student_id, event_type, payload_json)
      VALUES (p_student_id, 'first_correct', jsonb_build_object(
        'subject', v_question.subject, 'topic', v_question.topic
      ));
    END IF;
  END IF;

  -- 5. Retornar resultado para el cliente
  RETURN jsonb_build_object(
    'is_correct',     v_is_correct,
    'correct_index',  v_question.correct_index,
    'explanation',    v_question.explanation,
    'xp_earned',      CASE WHEN v_is_correct
                        THEN ROUND((v_xp_base + v_xp_bonus + v_streak_bonus) * v_multiplier)
                        ELSE 0 END,
    'multiplier',     v_multiplier,
    'streak_bonus',   v_streak_bonus,
    'speed_bonus',    v_xp_bonus
  );
END;
$$;

-- 5.6 Selector inteligente de preguntas (60% débiles / 40% aleatorias)
CREATE OR REPLACE FUNCTION get_session_questions(
  p_student_id   UUID,
  p_n            INT DEFAULT 20,
  p_subject      TEXT DEFAULT NULL   -- NULL = todas las áreas
)
RETURNS SETOF questions LANGUAGE plpgsql STABLE SECURITY DEFINER AS $$
DECLARE
  v_weak_n    INT := ROUND(p_n * 0.6);
  v_random_n  INT := p_n - v_weak_n;
  v_level     SMALLINT;
  v_difficulty SMALLINT;
BEGIN
  -- Obtener nivel del estudiante para ajustar dificultad
  SELECT LEAST(3, GREATEST(1, CEIL(level::NUMERIC / 17)))
  INTO v_difficulty
  FROM students WHERE id = p_student_id;

  RETURN QUERY
  WITH
  -- Temas débiles del estudiante (error_rate > 0.5)
  weak AS (
    SELECT wt.subject, wt.topic
    FROM weak_topics wt
    WHERE wt.student_id = p_student_id
      AND wt.error_rate > 0.5
      AND (p_subject IS NULL OR wt.subject = p_subject)
    ORDER BY wt.error_rate DESC
    LIMIT 10
  ),
  -- Preguntas de temas débiles no respondidas recientemente
  weak_questions AS (
    SELECT q.*
    FROM questions q
    JOIN weak w ON w.subject = q.subject AND w.topic = q.topic
    WHERE (p_subject IS NULL OR q.subject = p_subject)
      AND q.id NOT IN (
        SELECT sa.question_id FROM student_answers sa
        WHERE sa.student_id = p_student_id
          AND sa.created_at > NOW() - INTERVAL '7 days'
      )
    ORDER BY RANDOM()
    LIMIT v_weak_n
  ),
  -- Preguntas aleatorias del nivel del estudiante
  random_questions AS (
    SELECT q.*
    FROM questions q
    WHERE q.difficulty = v_difficulty
      AND (p_subject IS NULL OR q.subject = p_subject)
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
  SELECT * FROM random_questions
  ORDER BY RANDOM();
END;
$$;

-- 5.7 Ranking semanal actualizado (para leaderboard)
CREATE OR REPLACE FUNCTION get_weekly_leaderboard(p_limit INT DEFAULT 20)
RETURNS TABLE (
  rank_position  BIGINT,
  student_id     UUID,
  username       TEXT,
  avatar_url     TEXT,
  student_rank   student_rank,
  level          SMALLINT,
  xp_earned      INT,
  badge_count    BIGINT
) LANGUAGE sql STABLE SECURITY DEFINER AS $$
  WITH week_data AS (
    SELECT
      wl.student_id,
      SUM(wl.xp_earned) AS xp_earned
    FROM weekly_leaderboard wl
    WHERE wl.week_start = DATE_TRUNC('week', (NOW() AT TIME ZONE 'America/Bogota')::DATE)
    GROUP BY wl.student_id
  )
  SELECT
    ROW_NUMBER() OVER (ORDER BY wd.xp_earned DESC) AS rank_position,
    s.id AS student_id,
    p.username,
    p.avatar_url,
    s.rank AS student_rank,
    s.level,
    wd.xp_earned::INT,
    COUNT(sb.id) AS badge_count
  FROM week_data wd
  JOIN students s ON s.id = wd.student_id
  JOIN profiles p ON p.id = s.profile_id
  LEFT JOIN student_badges sb ON sb.student_id = s.id
  GROUP BY s.id, p.username, p.avatar_url, s.rank, s.level, wd.xp_earned
  ORDER BY wd.xp_earned DESC
  LIMIT p_limit;
$$;

-- ── 6. TRIGGER: auto-crear profile + student en signup ───────

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_role     user_role;
  v_username TEXT;
  v_profile_id UUID;
BEGIN
  -- El rol y username se pasan como metadata en signUp()
  v_role     := COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student');
  v_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    SPLIT_PART(NEW.email, '@', 1)
  );

  -- Crear profile
  INSERT INTO profiles (user_id, role, username)
  VALUES (NEW.id, v_role, v_username)
  RETURNING id INTO v_profile_id;

  -- Si es estudiante, crear registro en students
  IF v_role = 'student' THEN
    INSERT INTO students (profile_id, grade)
    VALUES (v_profile_id, COALESCE((NEW.raw_user_meta_data->>'grade')::SMALLINT, 11));
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── 7. TRIGGER: emitir al feed cuando se desbloquea una insignia
CREATE OR REPLACE FUNCTION handle_badge_unlocked()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_badge badges%ROWTYPE;
BEGIN
  SELECT * INTO v_badge FROM badges WHERE id = NEW.badge_id;
  INSERT INTO social_feed (student_id, event_type, payload_json)
  VALUES (NEW.student_id, 'badge_unlocked', jsonb_build_object(
    'badge_slug',  v_badge.slug,
    'badge_name',  v_badge.name,
    'badge_icon',  v_badge.icon_url
  ));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_badge_unlocked
  AFTER INSERT ON student_badges
  FOR EACH ROW EXECUTE FUNCTION handle_badge_unlocked();

-- ── 8. DATOS SEMILLA ─────────────────────────────────────────

-- Insignias del catálogo
INSERT INTO badges (slug, name, description, icon_url, criteria_json) VALUES
  ('primera_chispa',     'Primera Chispa',         'Tu primera respuesta correcta. ¡El viaje empieza!',              '🔥', '{"correct_answers": 1}'),
  ('matematico_imparable','Matemático Imparable',   '20 respuestas correctas en Matemáticas.',                       '📐', '{"subject": "matematicas", "correct": 20}'),
  ('lector_critico',     'Lector Crítico',          '20 respuestas correctas en Lectura Crítica.',                   '📖', '{"subject": "lectura_critica", "correct": 20}'),
  ('racha_de_fuego',     'Racha de Fuego',          '7 días consecutivos estudiando.',                               '🔥', '{"streak_days": 7}'),
  ('velocista',          'Velocista',               '10 respuestas correctas en menos de 10 segundos.',              '⚡', '{"fast_correct": 10, "max_seconds": 10}'),
  ('rango_diamante',     'Rango Diamante',          'Alcanzaste el rango Diamante. Estás en la élite.',              '💎', '{"rank": "diamante"}'),
  ('leyenda_500',        'Leyenda 500',             'Máximo rango. Estás listo para el ICFES.',                      '🏆', '{"rank": "leyenda"}'),
  ('cientifico_nato',    'Científico Nato',         '20 respuestas correctas en Ciencias Naturales.',                '🧪', '{"subject": "ciencias_naturales", "correct": 20}'),
  ('ciudadano_global',   'Ciudadano Global',        '20 respuestas correctas en Sociales y Ciudadanas.',             '🌎', '{"subject": "sociales", "correct": 20}'),
  ('bilingue_imparable', 'Bilingüe Imparable',      '20 respuestas correctas en Inglés.',                           '🇬🇧', '{"subject": "ingles", "correct": 20}'),
  ('maratonista',        'Maratonista',             'Respondiste 100 preguntas en total.',                           '🏃', '{"total_answers": 100}'),
  ('perfeccionista',     'Perfeccionista',          'Sesión perfecta: 10/10 respuestas correctas.',                  '✨', '{"perfect_session": true}'),
  ('semana_completa',    'Semana Completa',         '14 días consecutivos de estudio.',                              '📅', '{"streak_days": 14}'),
  ('explorador_nato',    'Explorador Nato',         'Respondiste al menos 5 preguntas en cada área.',                '🗺️', '{"all_subjects_5": true}'),
  ('noctambulo',         'Noctámbulo',              'Respondiste preguntas después de las 10pm (hora Colombia).',    '🌙', '{"late_night": true}');

-- ── 9. COMENTARIOS FINALES ────────────────────────────────────
-- IMPORTANTE en producción:
-- 1. En supabase-config.js usar SOLO la anon key (nunca la service_role key en cliente).
-- 2. Las funciones SECURITY DEFINER se ejecutan con permisos elevados — validar siempre p_student_id
--    contra auth.uid() en el cliente antes de llamarlas.
-- 3. Para Stripe: agregar webhook que actualice licenses.status + expires_at vía Edge Function.
-- 4. Habilitar pg_cron (Extensions > pg_cron) y programar:
--    SELECT cron.schedule('leaderboard-ranks', '0 0 * * 1', $$
--      UPDATE weekly_leaderboard wl
--      SET rank_position = sub.rn
--      FROM (
--        SELECT id, ROW_NUMBER() OVER (PARTITION BY week_start ORDER BY xp_earned DESC) rn
--        FROM weekly_leaderboard
--        WHERE week_start = DATE_TRUNC('week', NOW()) - INTERVAL '7 days'
--      ) sub WHERE wl.id = sub.id
--    $$);
