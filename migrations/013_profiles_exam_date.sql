-- ============================================================
-- MIGRATION 013: Columna exam_date en profiles
-- Idempotente — usa ADD COLUMN IF NOT EXISTS
-- Ejecutar en Supabase SQL Editor
-- ============================================================

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS exam_date DATE;

-- La política de profiles (FOR ALL USING auth.uid() = user_id)
-- ya permite que el usuario lea y actualice su propia fila.
-- Verificamos que exista; si no, la creamos.
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'profiles' AND policyname = 'users_own_profile'
  ) THEN
    CREATE POLICY "users_own_profile" ON profiles
      FOR ALL USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- ── VERIFICACIÓN ───────────────────────────────────────────────────────────────
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles' AND column_name = 'exam_date';
