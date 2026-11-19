import type { FastifyRequest } from 'fastify';
import { timingSafeEqual } from 'node:crypto';

// O owner do SaaS é identificado pelo header x-admin-token, que precisa ser
// igual a ADMIN_TOKEN no .env. Sem ADMIN_TOKEN configurado, ninguém é owner.
// (Em produção, trocar por validação via JWT/Supabase.)
export function isOwner(request: FastifyRequest): boolean {
  const expected = process.env.ADMIN_TOKEN;
  const received = request.headers['x-admin-token'];
  if (!expected || typeof received !== 'string') return false;
  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
