-- Schema de políticas de uso diferenciadas por tenant
-- Owner (tenant_id = '00000000-0000-0000-0000-000000000001') tem bypass total via aplicação

CREATE TABLE IF NOT EXISTS tenant_policies (
  tenant_id UUID PRIMARY KEY REFERENCES tenants(id),
  plan VARCHAR(50) NOT NULL DEFAULT 'free',

  -- Limites quantitativos (-1 = ilimitado)
  max_messages_per_day INTEGER NOT NULL DEFAULT 50,
  max_leads_active INTEGER NOT NULL DEFAULT 20,
  fair_use_tokens_per_month BIGINT NOT NULL DEFAULT 500000,

  -- Features permitidas (array de strings; '*' = todas)
  allowed_features TEXT[] NOT NULL DEFAULT ARRAY['chat', 'basic-crm'],
  blocked_features TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],

  -- Janela de horário WhatsApp (horas inteiras, 0-24)
  whatsapp_window_start SMALLINT NOT NULL DEFAULT 8 CHECK (whatsapp_window_start BETWEEN 0 AND 23),
  whatsapp_window_end SMALLINT NOT NULL DEFAULT 20 CHECK (whatsapp_window_end BETWEEN 1 AND 24),

  -- Restrições de conteúdo
  content_restrictions TEXT[] NOT NULL DEFAULT ARRAY['no-spam', 'no-illegal', 'no-adult'],

  -- Flags especiais
  is_owner BOOLEAN NOT NULL DEFAULT FALSE,
  custom_rules JSONB DEFAULT '{}',  -- Regras extras específicas do tenant

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice rápido para lookup por plano
CREATE INDEX IF NOT EXISTS idx_tenant_policies_plan ON tenant_policies(plan);

-- Seed: política padrão do owner (bypass total)
INSERT INTO tenant_policies (
  tenant_id, plan, max_messages_per_day, max_leads_active,
  fair_use_tokens_per_month, allowed_features, blocked_features,
  whatsapp_window_start, whatsapp_window_end, content_restrictions, is_owner
) VALUES (
  '00000000-0000-0000-0000-000000000001', 'owner', -1, -1, -1,
  ARRAY['*']::TEXT[], ARRAY[]::TEXT[],
  0, 24, ARRAY[]::TEXT[], TRUE
) ON CONFLICT (tenant_id) DO NOTHING;

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_tenant_policies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_tenant_policies_updated_at
  BEFORE UPDATE ON tenant_policies
  FOR EACH ROW EXECUTE FUNCTION update_tenant_policies_updated_at();