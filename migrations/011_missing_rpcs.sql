-- ============================================================
-- MIGRATION 011: RPCs que faltaron de migraciones anteriores
-- Idempotente — usa CREATE OR REPLACE FUNCTION
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- ─── GRANTS para RPCs (en caso de que no existan) ────────────────────────────

-- ─── 1. create_battle ────────────────────────────────────────────────────────

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
  SELECT ARRAY(
    SELECT id FROM questions
    WHERE is_paused = false
      AND (p_subject IS NULL OR subject = p_subject)
    ORDER BY random()
    LIMIT p_total
  ) INTO v_qids;

  IF array_length(v_qids, 1) IS NULL OR array_length(v_qids, 1) < p_total THEN
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

GRANT EXECUTE ON FUNCTION create_battle(UUID, TEXT, INT) TO authenticated;

-- ─── 2. join_battle ──────────────────────────────────────────────────────────

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

GRANT EXECUTE ON FUNCTION join_battle(UUID, UUID) TO authenticated;

-- ─── 3. submit_battle_answer ─────────────────────────────────────────────────

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
  SELECT correct_answer_index INTO v_correct_idx
  FROM questions WHERE id = p_question_id;

  v_correct := (p_answer_index = v_correct_idx);

  INSERT INTO battle_answers (battle_id, student_id, question_id, answer_index, is_correct, time_seconds)
  VALUES (p_battle_id, p_student_id, p_question_id, p_answer_index, v_correct, p_time_seconds)
  ON CONFLICT (battle_id, student_id, question_id) DO NOTHING;

  SELECT * INTO v_battle FROM battles WHERE id = p_battle_id;

  SELECT COUNT(*) INTO v_answered_ch
  FROM battle_answers WHERE battle_id = p_battle_id AND student_id = v_battle.challenger_id;

  SELECT COUNT(*) INTO v_answered_op
  FROM battle_answers WHERE battle_id = p_battle_id AND student_id = v_battle.opponent_id;

  IF v_answered_ch >= v_battle.total_questions AND v_answered_op >= v_battle.total_questions THEN
    SELECT COUNT(*) INTO v_ch_score FROM battle_answers
    WHERE battle_id = p_battle_id AND student_id = v_battle.challenger_id AND is_correct = true;
    SELECT COUNT(*) INTO v_op_score FROM battle_answers
    WHERE battle_id = p_battle_id AND student_id = v_battle.opponent_id AND is_correct = true;

    IF v_ch_score > v_op_score THEN v_winner := v_battle.challenger_id;
    ELSIF v_op_score > v_ch_score THEN v_winner := v_battle.opponent_id;
    END IF;

    UPDATE battles
    SET status           = 'completed',
        challenger_score = v_ch_score,
        opponent_score   = v_op_score,
        winner_id        = v_winner,
        completed_at     = now()
    WHERE id = p_battle_id;

    IF v_winner IS NOT NULL THEN
      UPDATE students SET xp_total = xp_total + 300 WHERE id = v_winner;
    END IF;
    UPDATE students SET xp_total = xp_total + 50
    WHERE id IN (v_battle.challenger_id, v_battle.opponent_id)
      AND id <> v_winner;
  END IF;

  RETURN jsonb_build_object('is_correct', v_correct, 'correct_index', v_correct_idx);
END;
$$;

GRANT EXECUTE ON FUNCTION submit_battle_answer(UUID, UUID, UUID, INT, INT) TO authenticated;

-- ─── 4. get_battle_detail ────────────────────────────────────────────────────

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
    'battle',     to_jsonb(v_battle),
    'questions',  COALESCE(v_questions, '[]'::JSONB),
    'my_answers', COALESCE(v_my_ans, '{}'::JSONB)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION get_battle_detail(UUID, UUID) TO authenticated;

-- ─── 5. evaluate_certificates (de migración 007) ─────────────────────────────

CREATE OR REPLACE FUNCTION evaluate_certificates(p_student_id UUID)
RETURNS SETOF TEXT LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_streak    INT;
  v_q_total   INT;
  v_pred      NUMERIC;
  v_subject   TEXT;
  v_acc       NUMERIC;
  v_subject_q INT;
BEGIN
  SELECT streak_days INTO v_streak FROM students WHERE id = p_student_id;
  SELECT COUNT(*) INTO v_q_total FROM student_answers WHERE student_id = p_student_id;
  SELECT predicted INTO v_pred FROM score_predictions
  WHERE student_id = p_student_id ORDER BY calculated_at DESC LIMIT 1;

  IF v_streak >= 7 THEN
    INSERT INTO certificates (student_id, type, data)
    VALUES (p_student_id, 'streak_7', jsonb_build_object('streak', v_streak))
    ON CONFLICT DO NOTHING;
    IF FOUND THEN RETURN NEXT 'streak_7'; END IF;
  END IF;

  IF v_streak >= 30 THEN
    INSERT INTO certificates (student_id, type, data)
    VALUES (p_student_id, 'streak_30', jsonb_build_object('streak', v_streak))
    ON CONFLICT DO NOTHING;
    IF FOUND THEN RETURN NEXT 'streak_30'; END IF;
  END IF;

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

  IF v_pred >= 300 THEN
    INSERT INTO certificates (student_id, type, data)
    VALUES (p_student_id, 'score_300', jsonb_build_object('score', v_pred))
    ON CONFLICT DO NOTHING;
    IF FOUND THEN RETURN NEXT 'score_300'; END IF;
  END IF;

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
              jsonb_build_object('subject', v_subject, 'accuracy', v_acc))
      ON CONFLICT DO NOTHING;
      IF FOUND THEN RETURN NEXT 'subject_master:' || v_subject; END IF;
    END IF;
  END LOOP;

  RETURN;
END;
$$;

GRANT EXECUTE ON FUNCTION evaluate_certificates(UUID) TO authenticated;

-- ─── 6. complete_onboarding_step (de migración 005) ──────────────────────────

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
  INSERT INTO onboarding_progress (student_id, completed_steps, xp_awarded)
  VALUES (p_student_id, jsonb_build_object(p_step_id, v_now), p_xp)
  ON CONFLICT (student_id) DO UPDATE
  SET completed_steps = onboarding_progress.completed_steps || jsonb_build_object(p_step_id, v_now),
      xp_awarded      = onboarding_progress.xp_awarded + p_xp,
      completed_at    = CASE
        WHEN jsonb_object_keys(
          onboarding_progress.completed_steps || jsonb_build_object(p_step_id, v_now)
        )::TEXT IS NOT NULL
        AND (SELECT COUNT(*) FROM jsonb_object_keys(
          onboarding_progress.completed_steps || jsonb_build_object(p_step_id, v_now)
        )) >= v_total_steps
        THEN now()
        ELSE onboarding_progress.completed_at
      END;

  IF p_xp > 0 THEN
    UPDATE students SET xp_total = xp_total + p_xp WHERE id = p_student_id;
  END IF;

  RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION complete_onboarding_step(UUID, TEXT, INT, INT) TO authenticated;

-- ─── VERIFICACIÓN ─────────────────────────────────────────────────────────────
SELECT routine_name
FROM information_schema.routines
WHERE routine_type = 'FUNCTION'
  AND routine_name IN ('create_battle','join_battle','submit_battle_answer',
                       'get_battle_detail','evaluate_certificates','complete_onboarding_step')
ORDER BY routine_name;
