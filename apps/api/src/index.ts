import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { chatRoute } from './routes/chat.js';
import { healthRoute } from './routes/health.js';
import { adminPoliciesRoute } from './routes/admin-policies.js';

dotenv.config();

const app = Fastify({ logger: true });

await app.register(cors, { origin: process.env.CORS_ORIGIN || '*' });

app.register(healthRoute);
app.register(chatRoute);
app.register(adminPoliciesRoute);

const port = Number(process.env.PORT) || 3001;
const host = process.env.HOST || '0.0.0.0';

try {
  await app.listen({ port, host });
  console.log(` SalesMind API running on http://${host}:${port}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}