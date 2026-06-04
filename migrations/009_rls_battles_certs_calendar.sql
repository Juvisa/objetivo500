-- ============================================================
-- MIGRATION 009: Políticas RLS adicionales (INSERT/UPDATE)
-- Prerequisito: ejecutar 005, 006, 007 y 008 primero.
-- Las políticas SELECT ya existen en cada migración origen.
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- ─── BATTLES: política de INSERT (crear nuevas batallas) ────────────────────
-- La SELECT ya existe en migración 006 ("battles: participantes ven su batalla")

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'battles' AND policyname = 'battles: estudiante puede crear'
  ) THEN
    CREATE POLICY "battles: estudiante puede crear"
      ON battles FOR INSERT
      WITH CHECK (auth_student_id() = challenger_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'battles' AND policyname = 'battles: estudiante puede actualizar las suyas'
  ) THEN
    CREATE POLICY "battles: estudiante puede actualizar las suyas"
      ON battles FOR UPDATE
      USING (
        auth_student_id() = challenger_id
        OR auth_student_id() = opponent_id
      );
  END IF;
END $$;

-- ─── CERTIFICATES: política de INSERT ───────────────────────────────────────
-- La política ALL ya existe en migración 007 ("certificates: propio estudiante")
-- No se necesita nada adicional aquí.

-- ─── EXAM_CALENDAR: política de INSERT ──────────────────────────────────────
-- La política ALL ya existe en migración 005 ("exam_calendar: propio estudiante")
-- No se necesita nada adicional aquí.

-- ─── VERIFICACIÓN ────────────────────────────────────────────────────────────
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('battles', 'certificates', 'exam_calendar')
ORDER BY tablename, policyname;
