import { FastifyRequest, FastifyReply } from 'fastify';

// Políticas por plano — owner tem bypass total
const PLAN_POLICIES: Record<string, any> = {
  free: {
    maxMessagesPerDay: 50,
    maxLeadsActive: 20,
    allowedFeatures: ['chat', 'basic-crm'],
    blockedFeatures: ['auto-outreach', 'video-generation', 'lead-scanner', 'bulk-messaging'],
    whatsappWindowHours: { start: 8, end: 20 }, // Só envia msg entre 8h-20h
    contentRestrictions: ['no-spam', 'no-illegal', 'no-adult'],
    fairUseTokensPerMonth: 500000
  },
  starter: {
    maxMessagesPerDay: 300,
    maxLeadsActive: 200,
    allowedFeatures: ['chat', 'basic-crm', 'auto-outreach', 'lead-scanner'],
    blockedFeatures: ['video-generation', 'bulk-messaging'],
    whatsappWindowHours: { start: 7, end: 21 },
    contentRestrictions: ['no-spam', 'no-illegal', 'no-adult'],
    fairUseTokensPerMonth: 5000000
  },
  pro: {
    maxMessagesPerDay: -1, // ilimitado
    maxLeadsActive: -1,
    allowedFeatures: ['chat', 'basic-crm', 'auto-outreach', 'lead-scanner', 'video-generation', 'bulk-messaging'],
    blockedFeatures: [],
    whatsappWindowHours: { start: 0, end: 24 }, // 24h permitido
    contentRestrictions: ['no-illegal', 'no-adult'],
    fairUseTokensPerMonth: -1
  }
};

// Owner do SaaS: ZERO restrições
const OWNER_POLICY = {
  isOwner: true,
  maxMessagesPerDay: -1,
  maxLeadsActive: -1,
  allowedFeatures: ['*'], // tudo liberado
  blockedFeatures: [],
  whatsappWindowHours: { start: 0, end: 24 },
  contentRestrictions: [],
  fairUseTokensPerMonth: -1
};

export async function policyGuard(request: FastifyRequest, reply: FastifyReply) {
  const tenantId = request.headers['x-tenant-id'] as string;
  const userId = request.headers['x-user-id'] as string;
  const feature = (request.body as any)?.feature || 'chat';

  if (!tenantId || !userId) {
    return reply.status(401).send({ error: 'Tenant e usuário obrigatórios' });
  }

  // TODO: Buscar role e plano do banco (Supabase)
  // Por enquanto, simula com header x-user-role para teste
  const role = request.headers['x-user-role'] as string || 'user';

  let policy;
  if (role === 'owner') {
    policy = OWNER_POLICY;
  } else {
    // TODO: Buscar plano real do tenant no DB
    const plan = (request.headers['x-tenant-plan'] as string) || 'free';
    policy = PLAN_POLICIES[plan] || PLAN_POLICIES.free;
  }

  // Verifica se feature é permitida
  if (!policy.isOwner && !policy.allowedFeatures.includes('*') && !policy.allowedFeatures.includes(feature)) {
    return reply.status(403).send({
      error: 'Funcionalidade não disponível no seu plano',
      feature,
      upgradeTo: policy.blockedFeatures.includes(feature) ? 'starter' : 'pro'
    });
  }

  // Verifica janela de horário WhatsApp (apenas para não-owners)
  if (!policy.isOwner && feature.includes('whatsapp') || feature.includes('outreach')) {
    const hour = new Date().getHours();
    if (hour < policy.whatsappWindowHours.start || hour >= policy.whatsappWindowHours.end) {
      return reply.status(403).send({
        error: `Envio de mensagens permitido apenas entre ${policy.whatsappWindowHours.start}h e ${policy.whatsappWindowHours.end}h`,
        retryAfter: `${policy.whatsappWindowHours.start}:00`
      });
    }
  }

  // Injeta política no request para uso nas rotas
  (request as any).policy = policy;
}