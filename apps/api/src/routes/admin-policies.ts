import type { FastifyPluginAsync } from 'fastify';
import { isOwner } from '../lib/auth.js';

// Rotas exclusivas para o owner do SaaS gerenciar políticas de usuários.
// Exigem o header x-admin-token (ver lib/auth.ts).
export const adminPoliciesRoute: FastifyPluginAsync = async (app) => {

  // GET /admin/policies/:tenantId — Owner vê política de qualquer tenant
  app.get('/admin/policies/:tenantId', async (request, reply) => {
    if (!isOwner(request)) {
      return reply.status(403).send({ error: 'Acesso negado. Apenas owner do SaaS.' });
    }

    const tenantId = (request.params as any).tenantId;

    // TODO: Substituir por query real ao Supabase quando integrado
    // Por agora, retorna estrutura esperada para validação de contrato
    return {
      tenant_id: tenantId,
      plan: 'free',
      max_messages_per_day: 50,
      max_leads_active: 20,
      fair_use_tokens_per_month: 500000,
      allowed_features: ['chat', 'basic-crm'],
      blocked_features: ['auto-outreach', 'video-generation', 'lead-scanner', 'bulk-messaging'],
      whatsapp_window_start: 8,
      whatsapp_window_end: 20,
      content_restrictions: ['no-spam', 'no-illegal', 'no-adult'],
      is_owner: false,
      custom_rules: {},
      note: 'Conecte o Supabase para dados reais. Este é o contrato de resposta.'
    };
  });

  // PUT /admin/policies/:tenantId — Owner atualiza política de qualquer tenant
  app.put('/admin/policies/:tenantId', async (request, reply) => {
    if (!isOwner(request)) {
      return reply.status(403).send({ error: 'Acesso negado. Apenas owner do SaaS.' });
    }

    const tenantId = (request.params as any).tenantId;
    const body = (request.body ?? {}) as Record<string, any>;

    // Validação básica dos campos permitidos
    const allowedFields = [
      'plan', 'max_messages_per_day', 'max_leads_active', 'fair_use_tokens_per_month',
      'allowed_features', 'blocked_features', 'whatsapp_window_start', 'whatsapp_window_end',
      'content_restrictions', 'custom_rules'
    ];

    const invalidFields = Object.keys(body).filter(k => !allowedFields.includes(k));
    if (invalidFields.length > 0) {
      return reply.status(400).send({
        error: `Campos não permitidos: ${invalidFields.join(', ')}`,
        allowedFields
      });
    }

    // Impede que owner acidentalmente remova seus próprios privilégios
    if (body.is_owner === false) {
      return reply.status(400).send({
        error: 'Não é possível remover flag is_owner via API. Use SQL direto se necessário.'
      });
    }

    // TODO: Executar UPDATE real no Supabase
    // await supabase.from('tenant_policies').update(body).eq('tenant_id', tenantId);

    return {
      success: true,
      tenant_id: tenantId,
      updated_fields: Object.keys(body),
      message: 'Política atualizada com sucesso (mock). Conecte Supabase para persistência real.'
    };
  });

  // POST /admin/policies/:tenantId/reset — Owner reseta política para padrão do plano
  app.post('/admin/policies/:tenantId/reset', async (request, reply) => {
    if (!isOwner(request)) {
      return reply.status(403).send({ error: 'Acesso negado. Apenas owner do SaaS.' });
    }

    const tenantId = (request.params as any).tenantId;

    // TODO: Buscar plano do tenant e aplicar defaults da PLAN_POLICIES
    // Por agora, confirma operação
    return {
      success: true,
      tenant_id: tenantId,
      message: 'Política resetada para padrão do plano (mock). Conecte Supabase para persistência real.'
    };
  });
};