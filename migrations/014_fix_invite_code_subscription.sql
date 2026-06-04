-- ============================================================
-- MIGRATION 014: Fix use_invite_code — crear subscripción activa
-- PROBLEMA: El RPC solo actualizaba profiles.role pero nunca insertaba
--           en la tabla subscriptions, por lo que get_student_plan
--           siempre devolvía 'free' (paywall no se levantaba).
-- ============================================================

-- Reemplazar el RPC con la versión que también crea la suscripción
CREATE OR REPLACE FUNCTION use_invite_code(p_code TEXT, p_user_id UUID)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_code       invite_codes%ROWTYPE;
  v_profile_id UUID;
  v_plan_id    UUID;
  v_plan_slug  TEXT;
  v_sub_id     UUID;
BEGIN
  -- 1. Buscar el código válido
  SELECT * INTO v_code
  FROM invite_codes
  WHERE code      = upper(trim(p_code))
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > now())
    AND use_count < max_uses;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Código inválido, expirado o ya agotado.');
  END IF;

  -- 2. Registrar uso (ignora si ya lo usó este usuario)
  INSERT INTO invite_code_uses (code_id, user_id)
  VALUES (v_code.id, p_user_id)
  ON CONFLICT DO NOTHING;

  -- Si no se insertó, este usuario ya usó el código
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Este código ya fue usado por tu cuenta.');
  END IF;

  -- 3. Incrementar contador de usos
  UPDATE invite_codes SET use_count = use_count + 1 WHERE id = v_code.id;

  -- 4. Obtener profile_id del usuario (subscriptions.parent_id = profiles.id)
  SELECT id INTO v_profile_id FROM profiles WHERE user_id = p_user_id;
  IF v_profile_id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Perfil no encontrado para este usuario.');
  END IF;

  -- 5. Determinar el plan slug según el role del código
  v_plan_slug := CASE v_code.role
    WHEN 'tester'  THEN 'elite'
    WHEN 'premium' THEN 'elite'
    WHEN 'elite'   THEN 'elite'
    WHEN 'familia' THEN 'familia'
    ELSE                'elite'
  END;

  -- 6. Obtener plan_id
  SELECT id INTO v_plan_id FROM plans WHERE slug = v_plan_slug;
  IF v_plan_id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Plan no encontrado: ' || v_plan_slug);
  END IF;

  -- 7. Actualizar perfil: solo role (subscription_tier no existe en profiles)
  UPDATE profiles
  SET role = v_code.role
  WHERE user_id = p_user_id;

  -- 8. Crear o actualizar subscription (lo que get_student_plan realmente lee)
  SELECT id INTO v_sub_id FROM subscriptions WHERE parent_id = v_profile_id LIMIT 1;

  IF FOUND THEN
    UPDATE subscriptions
    SET plan_id     = v_plan_id,
        status      = 'active',
        gateway     = 'invite_code',
        gateway_ref = upper(trim(p_code)),
        expires_at  = v_code.expires_at
    WHERE id = v_sub_id;
  ELSE
    INSERT INTO subscriptions (parent_id, plan_id, status, gateway, gateway_ref, expires_at)
    VALUES (v_profile_id, v_plan_id, 'active', 'invite_code', upper(trim(p_code)), v_code.expires_at);
  END IF;

  RETURN jsonb_build_object('ok', true, 'role', v_code.role, 'label', v_code.label);
END;
$$;

GRANT EXECUTE ON FUNCTION use_invite_code(TEXT, UUID) TO authenticated, anon;

-- ── VERIFICACIÓN ────────────────────────────────────────────────────────────
-- Después de ejecutar, canjea un código y verifica:
-- SELECT s.status, pl.slug, s.gateway_ref
-- FROM subscriptions s
-- JOIN plans pl ON pl.id = s.plan_id
-- WHERE s.parent_id = (SELECT id FROM profiles WHERE user_id = auth.uid());
