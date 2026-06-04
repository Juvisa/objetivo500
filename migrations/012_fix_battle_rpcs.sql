-- ============================================================
-- MIGRATION 012: Corrige columna incorrect en submit_battle_answer
-- Idempotente — usa CREATE OR REPLACE FUNCTION
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- La migración 011 usó "correct_answer_index" pero la columna
-- real en la tabla questions se llama "correct_index".

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
  v_battle      battles%ROWTYPE;
  v_ch_score    INT;
  v_op_score    INT;
  v_winner      UUID;
BEGIN
  -- correct_index es el nombre real de la columna en la tabla questions
  SELECT correct_index INTO v_correct_idx
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

-- ── VERIFICACIÓN ───────────────────────────────────────────────────────────────
SELECT routine_name FROM information_schema.routines
WHERE routine_type = 'FUNCTION' AND routine_name = 'submit_battle_answer';
