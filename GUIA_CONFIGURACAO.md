# Guia de Configuração Gratuita — SalesMind AI

## 1. Chave da LLM (OBRIGATÓRIA — Cérebro do Assistente)

Escolha **UMA** das opções abaixo. Todas têm plano gratuito generoso:

### Opção A: DeepSeek (Recomendada)
1. Acesse https://platform.deepseek.com
2. Crie conta gratuita
3. Vá em "API Keys" → "Create API Key"
4. Copie a chave (começa com `sk-`)
5. No arquivo `.env`, configure:
   ```
   LLM_API_KEY=sk-sua-chave-aqui
   LLM_BASE_URL=https://api.deepseek.com/v1
   LLM_MODEL=deepseek-chat
   ```
6. **Limite gratuito:** ~$5 em créditos iniciais + recargas gratuitas periódicas

### Opção B: SiliconFlow (Qwen3.8)
1. Acesse https://siliconflow.cn
2. Crie conta → Dashboard → API Keys
3. Configure no `.env`:
   ```
   LLM_API_KEY=sk-sua-chave-siliconflow
   LLM_BASE_URL=https://api.siliconflow.cn/v1
   LLM_MODEL=Qwen/Qwen3.8-72B-Instruct
   ```
4. **Limite gratuito:** Créditos diários renováveis

### Opção C: Together.ai
1. Acesse https://together.ai
2. Sign up → Settings → API Keys
3. Configure no `.env`:
   ```
   LLM_API_KEY=sua-chave-together
   LLM_BASE_URL=https://api.together.xyz/v1
   LLM_MODEL=deepseek-ai/DeepSeek-V4
   ```
4. **Limite gratuito:** $5 iniciais + free tier mensal

---

## 2. Chave da Vercel (OPCIONAL — Hospedagem do Frontend)

Só necessária quando quiser publicar o app online:
1. Acesse https://vercel.com
2. Login com GitHub
3. Importe o repositório `salesmind-ai/apps/web`
4. Deploy automático a cada push
5. **Custo:** $0 (plano Hobby é gratuito para projetos pessoais)

---

## 3. Supabase (OPCIONAL — Banco de Dados + Auth)

Para salvar conversas, leads e usuários:
1. Acesse https://supabase.com
2. New Project → Free Tier
3. Copie URL e Anon Key em Settings → API
4. Configure no `.env`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
   ```
5. **Custo:** $0 até 500MB de banco + 50k auth users/mês

---

## 4. Rodar Localmente (Sem nenhuma chave de hospedagem)

```bash
cd salesmind-ai
npm install
cp .env.example .env
# Edite .env com sua chave da DeepSeek/SiliconFlow
npm run dev
```

Acesse http://localhost:3000 no navegador ou celular (mesma rede Wi-Fi).

---

## Resumo Rápido

| Chave | Para quê | Obrigatória? | Custo |
|-------|----------|-------------|-------|
| DeepSeek / SiliconFlow | IA responder mensagens | SIM | Grátis |
| Vercel | Publicar site/app online | Não (só pra deploy) | Grátis |
| Supabase | Salvar dados e login | Não (MVP funciona sem) | Grátis |
| Syncro | WhatsApp automação | Já tem | Grátis |

**Comece pela chave da DeepSeek.** É a única essencial para o assistente funcionar hoje.