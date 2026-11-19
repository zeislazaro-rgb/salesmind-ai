# SalesMind AI

Plataforma SaaS de Automação Inteligente com LLM Open-Source (Qwen3.8 / DeepSeek V4)

## Stack

- **Frontend:** Next.js 14+ (App Router) + Tailwind CSS
- **Backend:** Node.js (Fastify) + TypeScript
- **LLM:** Qwen3.8 / DeepSeek V4 via API gratuita (SiliconFlow / Together.ai / DeepSeek free tier)
- **WhatsApp:** Syncro (automação não-oficial, zero custo por mensagem)
- **Banco de Dados:** Supabase (PostgreSQL + Auth + Storage, free tier)
- **Deploy:** Vercel (frontend) + Railway / Fly.io (backend, free tier)
- **Monorepo:** Turborepo + npm workspaces

## Estrutura

```
salesmind-ai/
├── apps/
│   ├── web/          # Next.js frontend + PWA mobile
│   └── api/          # Fastify backend + LLM integration
├── packages/
│   └── shared/       # Tipos, utils e configurações compartilhadas
├── turbo.json
└── package.json
```

## Começar

```bash
npm install
npm run dev
```

## Custos

- **LLM:** $0 (APIs gratuitas com limites generosos ou auto-hospedado quando tiver GPU)
- **WhatsApp:** $0 (Syncro)
- **Hospedagem:** $0–30/mês (free tiers cobrem MVP)
- **Domínio:** ~$15/ano
- **Total MVP:** R$0–150/mês

## Licença

MIT