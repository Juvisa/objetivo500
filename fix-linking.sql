-- ============================================================
-- fix-linking.sql
-- Ejecutar en Supabase → SQL Editor
-- Soluciona el vínculo Padre-Hijo:
--   1. Función SECURITY DEFINER que bypasea RLS para buscar y vincular
--   2. Política UPDATE para que el padre pueda desvincular (opcional)
-- ============================================================

-- ── 1. Función principal: buscar y vincular por username ─────
-- SECURITY DEFINER: se ejecuta con permisos de superusuario,
-- por eso puede leer profiles + actualizar students sin RLS.
CREATE OR REPLACE FUNCTION link_child_by_username(p_username TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_parent_profile_id UUID;
  v_student_profile   profiles%ROWTYPE;
  v_student           students%ROWTYPE;
BEGIN
  -- 1. Verificar que el llamante sea un padre registrado
  SELECT id INTO v_parent_profile_id
  FROM profiles
  WHERE user_id = auth.uid() AND role = 'parent';

  IF v_parent_profile_id IS NULL THEN
    RETURN jsonb_build_object(
      'ok', false,
      'code', 'NOT_PARENT',
      'message', 'Solo los padres pueden vincular estudiantes.'
    );
  END IF;

  -- 2. Buscar el perfil del estudiante (case-insensitive, trim)
  SELECT * INTO v_student_profile
  FROM profiles
  WHERE LOWER(TRIM(username)) = LOWER(TRIM(p_username))
    AND role = 'student'
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'ok', false,
      'code', 'NOT_FOUND',
      'message', 'Usuario no encontrado. Verifica que el nombre de usuario sea correcto y que sea una cuenta de estudiante.'
    );
  END IF;

  -- 3. Obtener el registro students asociado
  SELECT * INTO v_student
  FROM students
  WHERE profile_id = v_student_profile.id
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'ok', false,
      'code', 'PROFILE_INCOMPLETE',
      'message', 'El perfil del estudiante está incompleto. Pídele que inicie sesión al menos una vez.'
    );
  END IF;

  -- 4. Verificar si ya está vinculado a ESTE padre
  IF v_student.parent_id = v_parent_profile_id THEN
    RETURN jsonb_build_object(
      'ok', false,
      'code', 'ALREADY_YOUR_CHILD',
      'message', 'Este estudiante ya está vinculado a tu cuenta.'
    );
  END IF;

  -- 5. Verificar si ya está vinculado a OTRO padre
  IF v_student.parent_id IS NOT NULL THEN
    RETURN jsonb_build_object(
      'ok', false,
      'code', 'ALREADY_LINKED',
      'message', 'Este estudiante ya está vinculado a otra cuenta de padre. Pídele que desconecte su cuenta actual.'
    );
  END IF;

  -- 6. Vincular: asignar parent_id
  UPDATE students
  SET parent_id = v_parent_profile_id
  WHERE id = v_student.id;

  RETURN jsonb_build_object(
    'ok',         true,
    'code',       'LINKED',
    'message',    'Estudiante vinculado correctamente.',
    'student_id', v_student.id,
    'username',   v_student_profile.username
  );
END;
$$;

-- Permitir que usuarios autenticados llamen esta función
GRANT EXECUTE ON FUNCTION link_child_by_username(TEXT) TO authenticated;


-- ── 2. (Opcional) Política para que el padre pueda desvincular ──
-- Solo si en el futuro se quiere que un padre quite la vinculación
-- desde el cliente sin usar la función de arriba.
-- DROP POLICY IF EXISTS "students: parent can unlink" ON students;
-- CREATE POLICY "students: parent can unlink"
--   ON students FOR UPDATE
--   USING (parent_id = auth_profile_id())
--   WITH CHECK (parent_id IS NULL OR parent_id = auth_profile_id());


-- ── 3. Asegurar que profiles sea legible por usuarios auth. ─────
-- La política "profiles: leaderboard read" del schema.sql ya cubre esto.
-- Si no existe, crearla:
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'profiles' AND policyname = 'profiles: leaderboard read'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "profiles: leaderboard read"
        ON profiles FOR SELECT
        USING (auth.uid() IS NOT NULL)
    $policy$;
  END IF;
END;
$$;
