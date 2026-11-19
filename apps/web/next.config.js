/** @type {import('next').NextConfig} */
const path = require('node:path');
const { loadEnvConfig } = require('@next/env');

// Em desenvolvimento, lê também o .env da raiz do monorepo (o mesmo da API).
// Na Vercel não existe esse arquivo; lá as variáveis vêm do painel.
loadEnvConfig(path.join(__dirname, '../..'));

// O chat do site usa a rota app/api/chat/route.ts, que:
// - repassa para a API Fastify quando API_INTERNAL_URL está definido, ou
// - chama a LLM direto com LLM_API_KEY (útil para um deploy único na Vercel).

const nextConfig = {
  reactStrictMode: true,
  // PWA config para funcionar como app de celular
  async headers() {
    return [
      {
        source: '/manifest.json',
        headers: [{ key: 'Content-Type', value: 'application/manifest+json' }]
      }
    ];
  }
};

module.exports = nextConfig;
