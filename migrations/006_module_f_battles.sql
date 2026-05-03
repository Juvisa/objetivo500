-- ============================================================
-- MIGRATION 006: Módulo F — Batallas entre estudiantes
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- 1. Tabla de batallas
CREATE TABLE IF NOT EXISTS battles (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenger_id    UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  opponent_id      UUID REFERENCES students(id) ON DELETE SET NULL,
  status           TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending','active','completed','cancelled')),
  question_ids     UUID[] NOT NULL DEFAULT '{}',
  total_questions  INT NOT NULL DEFAULT 10,
  challenger_score INT NOT NULL DEFAULT 0,
  opponent_score   INT NOT NULL DEFAULT 0,
  winner_id        UUID REFERENCES students(id) ON DELETE SET NULL,
  subject          TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  started_at       TIMESTAMPTZ,
  completed_at     TIMESTAMPTZ
);

ALTER TABLE battles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "battles: participantes ven su batalla"
  ON battles FOR SELECT
  USING (
    challenger_id = auth_student_id()
    OR opponent_id = auth_student_id()
  );

CREATE POLICY "battles: retador puede crear"
  ON battles FOR INSERT
  WITH CHECK (challenger_id = auth_student_id());

CREATE POLICY "battles: participantes pueden actualizar"
  ON battles FOR UPDATE
  USING (
    challenger_id = auth_student_id()
    OR opponent_id = auth_student_id()
  );

-- 2. Respuestas de batalla
CREATE TABLE IF NOT EXISTS battle_answers (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  battle_id      UUID NOT NULL REFERENCES battles(id) ON DELETE CASCADE,
  student_id     UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  question_id    UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  answer_index   INT,
  is_correct     BOOLEAN NOT NULL DEFAULT false,
  time_seconds   INT NOT NULL DEFAULT 0,
  answered_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (battle_id, student_id, question_id)
);

ALTER TABLE battle_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "battle_answers: participantes ven respuestas de su batalla"
  ON battle_answers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM battles b
      WHERE b.id = battle_id
        AND (b.challenger_id = auth_student_id() OR b.opponent_id = auth_student_id())
    )
  );

CREATE POLICY "battle_answers: cada quien escribe sus respuestas"
  ON battle_answers FOR INSERT
  WITH CHECK (student_id = auth_student_id());

-- 3. Función: crear batalla con preguntas aleatorias
CREATE OR REPLACE FUNCTION create_battle(
  p_challenger_id UUID,
  p_subject       TEXT DEFAULT NULL,
  p_total         INT  DEFAULT 10
)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_battle_id UUID;
  v_qids      UUID[];
BEGIN
  -- Seleccionar preguntas aleatorias
  SELECT ARRAY(
    SELECT id FROM questions
    WHERE is_paused = false
      AND (p_subject IS NULL OR subject = p_subject)
    ORDER BY random()
    LIMIT p_total
  ) INTO v_qids;

  IF array_length(v_qids, 1) < p_total THEN
    -- Si no hay suficientes de esa materia, completar con mixtas
    SELECT ARRAY(
      SELECT id FROM questions
      WHERE is_paused = false
      ORDER BY random()
      LIMIT p_total
    ) INTO v_qids;
  END IF;

  INSERT INTO battles (challenger_id, question_ids, total_questions, subject)
  VALUES (p_challenger_id, v_qids, p_total, p_subject)
  RETURNING id INTO v_battle_id;

  RETURN v_battle_id;
END;
$$;

-- 4. Función: unirse a una batalla
CREATE OR REPLACE FUNCTION join_battle(
  p_battle_id  UUID,
  p_student_id UUID
)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE battles
  SET opponent_id = p_student_id,
      status      = 'active',
      started_at  = now()
  WHERE id = p_battle_id
    AND status = 'pending'
    AND challenger_id <> p_student_id
    AND opponent_id IS NULL;

  RETURN FOUND;
END;
$$;

-- 5. Función: guardar respuesta y verificar si la batalla terminó
CREATE OR REPLACE FUNCTION submit_battle_answer(
  p_battle_id    UUID,
  p_student_id   UUID,
  p_question_id  UUID,
  p_answer_index INT,
  p_time_seconds INT DEFAULT 0
)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_correct     BOOLEAN;
  v_correct_idx INT;
  v_answered_ch INT;
  v_answered_op INT;
  v_total       INT;
  v_battle      battles%ROWTYPE;
  v_ch_score    INT;
  v_op_score    INT;
  v_winner      UUID;
BEGIN
  -- Verificar respuesta correcta
  SELECT correct_answer_index INTO v_correct_idx
  FROM questions WHERE id = p_question_id;

  v_correct := (p_answer_index = v_correct_idx);

  -- Insertar respuesta (upsert por si acaso)
  INSERT INTO battle_answers (battle_id, student_id, question_id, answer_index, is_correct, time_seconds)
  VALUES (p_battle_id, p_student_id, p_question_id, p_answer_index, v_correct, p_time_seconds)
  ON CONFLICT (battle_id, student_id, question_id) DO NOTHING;

  -- Leer estado actual de la batalla
  SELECT * INTO v_battle FROM battles WHERE id = p_battle_id;

  -- Contar respuestas de cada jugador
  SELECT COUNT(*) INTO v_answered_ch
  FROM battle_answers WHERE battle_id = p_battle_id AND student_id = v_battle.challenger_id;

  SELECT COUNT(*) INTO v_answered_op
  FROM battle_answers WHERE battle_id = p_battle_id AND student_id = v_battle.opponent_id;

  -- Si ambos terminaron, calcular ganador
  IF v_answered_ch >= v_battle.total_questions AND v_answered_op >= v_battle.total_questions THEN
    SELECT COUNT(*) INTO v_ch_score FROM battle_answers
    WHERE battle_id = p_battle_id AND student_id = v_battle.challenger_id AND is_correct = true;

    SELECT COUNT(*) INTO v_op_score FROM battle_answers
    WHERE battle_id = p_battle_id AND student_id = v_battle.opponent_id AND is_correct = true;

    IF v_ch_score > v_op_score THEN
      v_winner := v_battle.challenger_id;
    ELSIF v_op_score > v_ch_score THEN
      v_winner := v_battle.opponent_id;
    END IF;

    UPDATE battles
    SET status           = 'completed',
        challenger_score = v_ch_score,
        opponent_score   = v_op_score,
        winner_id        = v_winner,
        completed_at     = now()
    WHERE id = p_battle_id;

    -- XP al ganador
    IF v_winner IS NOT NULL THEN
      UPDATE students SET xp_total = xp_total + 300 WHERE id = v_winner;
    END IF;
    -- XP de participación al perdedor
    UPDATE students SET xp_total = xp_total + 50
    WHERE id IN (v_battle.challenger_id, v_battle.opponent_id)
      AND id <> v_winner;
  END IF;

  RETURN jsonb_build_object('is_correct', v_correct, 'correct_index', v_correct_idx);
END;
$$;

-- 6. Función: obtener batalla con preguntas completas
CREATE OR REPLACE FUNCTION get_battle_detail(p_battle_id UUID, p_student_id UUID)
RETURNS JSONB LANGUAGE plpgsql STABLE SECURITY DEFINER AS $$
DECLARE
  v_battle    battles%ROWTYPE;
  v_questions JSONB;
  v_my_ans    JSONB;
BEGIN
  SELECT * INTO v_battle FROM battles WHERE id = p_battle_id;
  IF NOT FOUND THEN RETURN NULL; END IF;
  IF v_battle.challenger_id <> p_student_id AND v_battle.opponent_id <> p_student_id THEN
    RETURN NULL;
  END IF;

  SELECT jsonb_agg(q ORDER BY arr.ord) INTO v_questions
  FROM unnest(v_battle.question_ids) WITH ORDINALITY AS arr(qid, ord)
  JOIN questions q ON q.id = arr.qid;

  SELECT jsonb_object_agg(question_id::TEXT, jsonb_build_object(
    'answer_index', answer_index,
    'is_correct', is_correct,
    'time_seconds', time_seconds
  )) INTO v_my_ans
  FROM battle_answers
  WHERE battle_id = p_battle_id AND student_id = p_student_id;

  RETURN jsonb_build_object(
    'battle',    to_jsonb(v_battle),
    'questions', COALESCE(v_questions, '[]'),
    'my_answers', COALESCE(v_my_ans, '{}')
  );
END;
$$;
