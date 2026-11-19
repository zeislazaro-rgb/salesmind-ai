# SalesMind AI

Assistente de vendas com IA (LLMs open-source via API: DeepSeek, Qwen etc.), feito para funcionar como app no celular (PWA).

## Stack

- **Site:** Next.js 15 (App Router) + Tailwind CSS, instalável no celular (PWA)
- **API:** Node.js + Fastify + TypeScript (opcional para começar)
- **IA:** qualquer provedor compatível com a API da OpenAI (DeepSeek, SiliconFlow, Together.ai)
- **Banco (planejado):** Supabase
- **Monorepo:** Turborepo + npm workspaces

## Estrutura

```
salesmind-ai/
├── apps/
│   ├── web/                    # Site (Next.js)
│   │   ├── app/page.tsx        # Tela do chat
│   │   ├── app/api/chat/       # Rota do chat (chama a IA ou repassa para a API)
│   │   └── public/             # Manifest e ícones do PWA
│   └── api/                    # API (Fastify)
│       └── src/
│           ├── routes/         # /health, /chat, /admin/policies
│           ├── middleware/     # policyGuard (limites por plano)
│           ├── lib/auth.ts     # Verificação do owner (ADMIN_TOKEN)
│           └── db/             # Schema SQL (Supabase/Postgres)
├── .env.example                # Modelo das variáveis de ambiente
├── GUIA_CONFIGURACAO.md        # Passo a passo das chaves e do deploy
└── turbo.json
```

## Rodar no computador

Requer Node.js 20 ou superior. Na pasta raiz:

```bash
cp .env.example .env   # depois coloque sua LLM_API_KEY
npm install
npm run dev:web        # só o site: http://localhost:3000
```

Outros comandos:

| Comando | O que faz |
|---|---|
| `npm run dev` | Sobe site (3000) e API (3001) juntos |
| `npm run dev:web` | Só o site |
| `npm run dev:api` | Só a API |
| `npm run build` | Gera a versão de produção dos dois |

Por padrão o site fala direto com a IA. Para fazê-lo usar a API separada, defina `API_INTERNAL_URL=http://localhost:3001` no `.env`.

## Publicar o site (Vercel)

Veja o passo a passo em [GUIA_CONFIGURACAO.md](GUIA_CONFIGURACAO.md#2-publicar-o-site-na-vercel).

## Licença

MIT
