-- ============================================================
-- MIGRATION 008: Función RLS + Sistema de Invite Codes
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- ─── 0. FUNCIÓN HELPER PARA RLS (CRÍTICA) ─────────────────────────────────
-- auth_student_id() resuelve auth.uid() → students.id
-- Usada por TODAS las políticas RLS de este proyecto.
-- Si esta función no existe, ningún SELECT/INSERT controlado por RLS funciona.

CREATE OR REPLACE FUNCTION auth_student_id()
RETURNS UUID LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT s.id
  FROM   students s
  JOIN   profiles p ON p.id = s.profile_id
  WHERE  p.user_id = auth.uid()
  LIMIT  1
$$;

GRANT EXECUTE ON FUNCTION auth_student_id() TO authenticated, anon;

-- ─── 1. TABLA INVITE_CODES ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS invite_codes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code        TEXT NOT NULL UNIQUE,
  label       TEXT,                             -- etiqueta interna ("Tester Beta #1")
  role        TEXT NOT NULL DEFAULT 'student',  -- 'student' | 'tester'
  max_uses    INT  NOT NULL DEFAULT 1,
  use_count   INT  NOT NULL DEFAULT 0,
  expires_at  TIMESTAMPTZ,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE invite_codes ENABLE ROW LEVEL SECURITY;

-- Cualquier usuario (incluso anon) puede leer códigos activos para validar en el registro
CREATE POLICY "invite_codes: lectura de códigos activos"
  ON invite_codes FOR SELECT
  USING (
    is_active = true
    AND (expires_at IS NULL OR expires_at > now())
    AND use_count < max_uses
  );

-- ─── 2. TABLA INVITE_CODE_USES (log de uso) ───────────────────────────────

CREATE TABLE IF NOT EXISTS invite_code_uses (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code_id    UUID NOT NULL REFERENCES invite_codes(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  used_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (code_id, user_id)
);

ALTER TABLE invite_code_uses ENABLE ROW LEVEL SECURITY;

-- Los usuarios solo ven su propio historial de usos
CREATE POLICY "invite_code_uses: propio usuario"
  ON invite_code_uses FOR SELECT
  USING (user_id = auth.uid());

-- ─── 3. FUNCIÓN: VALIDAR Y CONSUMIR UN CÓDIGO ─────────────────────────────

CREATE OR REPLACE FUNCTION use_invite_code(p_code TEXT, p_user_id UUID)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_code invite_codes%ROWTYPE;
BEGIN
  SELECT * INTO v_code
  FROM invite_codes
  WHERE code      = upper(trim(p_code))
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > now())
    AND use_count < max_uses;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Código inválido, expirado o ya agotado.');
  END IF;

  -- Registrar uso (ignora si ya lo usó)
  INSERT INTO invite_code_uses (code_id, user_id)
  VALUES (v_code.id, p_user_id)
  ON CONFLICT DO NOTHING;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Este código ya fue usado por tu cuenta.');
  END IF;

  -- Incrementar contador
  UPDATE invite_codes SET use_count = use_count + 1 WHERE id = v_code.id;

  -- Si está en tabla profiles, actualizar el rol si es 'tester'
  IF v_code.role = 'tester' THEN
    UPDATE profiles SET role = 'tester' WHERE user_id = p_user_id;
  END IF;

  RETURN jsonb_build_object('ok', true, 'role', v_code.role, 'label', v_code.label);
END;
$$;

GRANT EXECUTE ON FUNCTION use_invite_code(TEXT, UUID) TO authenticated, anon;

-- ─── 4. SEMILLA: 10 códigos beta ─────────────────────────────────────────

INSERT INTO invite_codes (code, label, role, max_uses) VALUES
  ('AURA-BETA-01', 'Tester Beta 1',  'tester', 1),
  ('AURA-BETA-02', 'Tester Beta 2',  'tester', 1),
  ('AURA-BETA-03', 'Tester Beta 3',  'tester', 1),
  ('AURA-BETA-04', 'Tester Beta 4',  'tester', 1),
  ('AURA-BETA-05', 'Tester Beta 5',  'tester', 1),
  ('AURA-BETA-06', 'Tester Beta 6',  'tester', 1),
  ('AURA-BETA-07', 'Tester Beta 7',  'tester', 1),
  ('AURA-BETA-08', 'Tester Beta 8',  'tester', 1),
  ('AURA-BETA-09', 'Tester Beta 9',  'tester', 1),
  ('AURA-BETA-10', 'Tester Beta 10', 'tester', 1),
  ('AURA-BETA-11', 'Tester Beta 11', 'tester', 1),
  ('AURA-BETA-12', 'Tester Beta 12', 'tester', 1),
  ('AURA-BETA-13', 'Tester Beta 13', 'tester', 1),
  ('AURA-BETA-14', 'Tester Beta 14', 'tester', 1),
  ('AURA-BETA-15', 'Tester Beta 15', 'tester', 1),
  ('AURA-BETA-16', 'Tester Beta 16', 'tester', 1),
  ('AURA-BETA-17', 'Tester Beta 17', 'tester', 1),
  ('AURA-BETA-18', 'Tester Beta 18', 'tester', 1),
  ('AURA-BETA-19', 'Tester Beta 19', 'tester', 1),
  ('AURA-BETA-20', 'Tester Beta 20', 'tester', 1)
ON CONFLICT (code) DO NOTHING;
