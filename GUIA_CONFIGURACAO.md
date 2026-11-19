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

## 2. Publicar o site na Vercel

Dá para fazer tudo pelo celular. O site já conversa com a IA sozinho, sem precisar publicar a API.

1. Acesse https://vercel.com e entre com **Continue with GitHub**
2. **Add New → Project** e escolha o repositório `salesmind-ai`
3. Em **Root Directory**, clique em *Edit* e escolha `apps/web`
4. Abra **Environment Variables** e adicione:
   - `LLM_API_KEY` = sua chave
   - `LLM_BASE_URL` = `https://api.deepseek.com/v1` (ou a do seu provedor)
   - `LLM_MODEL` = `deepseek-chat` (ou o do seu provedor)
5. Clique em **Deploy** e aguarde 1–2 minutos
6. Abra o link gerado (ex.: `salesmind-ai.vercel.app`) no celular. Para instalar como app: menu do navegador → **Adicionar à tela inicial**

A cada push na `main`, a Vercel publica a nova versão sozinha.
**Custo:** $0 (plano Hobby)

> A chave fica só no painel da Vercel, nunca no código. Se uma chave já foi parar no GitHub, revogue-a no provedor e gere outra.

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

Na **pasta raiz** do repositório (onde fica o `package.json`):

```bash
npm install
cp .env.example .env
# Edite .env com sua chave da DeepSeek/SiliconFlow
npm run dev:web
```

Acesse http://localhost:3000 no navegador. No celular (mesma rede Wi-Fi), use o IP do computador, ex.: http://192.168.0.10:3000.
No GitHub Codespaces, abra a porta 3000 que aparece na aba "Portas".

Para subir também a API separada: `npm run dev` e defina `API_INTERNAL_URL=http://localhost:3001` no `.env`.

---

## Resumo Rápido

| Chave | Para quê | Obrigatória? | Custo |
|-------|----------|-------------|-------|
| DeepSeek / SiliconFlow | IA responder mensagens | SIM | Grátis |
| Vercel | Publicar site/app online | Não (só pra deploy) | Grátis |
| Supabase | Salvar dados e login (ainda não integrado) | Não | Grátis |
| Syncro | WhatsApp automação | Já tem | Grátis |

**Comece pela chave da DeepSeek.** É a única essencial para o assistente funcionar hoje.
