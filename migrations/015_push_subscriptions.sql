-- ============================================================
-- Migration 015: Push Subscriptions
-- Objetivo 500 — Supabase PostgreSQL
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

-- Tabla principal de suscripciones push
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription  JSONB       NOT NULL,
  activa        BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT push_subscriptions_user_unique UNIQUE (user_id)
);

COMMENT ON TABLE push_subscriptions IS
  'Suscripciones Web Push de los usuarios. Una por usuario (upsert).';

-- Índice para consultas por estado activo (el cron lo usa)
CREATE INDEX IF NOT EXISTS idx_push_subs_activa
  ON push_subscriptions(activa)
  WHERE activa = TRUE;

-- Trigger: actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER push_subscriptions_updated_at
  BEFORE UPDATE ON push_subscriptions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Row Level Security ────────────────────────────────────────
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- El propio usuario puede leer, insertar y actualizar su suscripción
CREATE POLICY "push: own read"
  ON push_subscriptions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "push: own upsert"
  ON push_subscriptions FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "push: own update"
  ON push_subscriptions FOR UPDATE
  USING (user_id = auth.uid());

-- El service role (cron) puede leer todas las suscripciones activas
-- (esto lo hace automáticamente el service_role key, sin necesidad de policy explícita)
