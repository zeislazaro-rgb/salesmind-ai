// Rota /api/chat do site.
//
// Dois modos de funcionamento:
// 1. API_INTERNAL_URL definido  -> repassa o pedido para a API Fastify (apps/api).
// 2. Sem API_INTERNAL_URL       -> chama a LLM direto daqui, usando LLM_API_KEY.
//    Assim o site funciona sozinho num único deploy (ex.: Vercel).

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_HISTORY = 10;
const DEFAULT_SYSTEM_PROMPT =
  'Você é o SalesMind AI, assistente inteligente de vendas. Responda sempre em português, seja objetivo e ajude o usuário a vender mais.';

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

function json(body: unknown, status = 200) {
  return Response.json(body, { status });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return json({ error: 'Corpo da requisição inválido' }, 400);
  }

  // Modo 1: repassa para a API separada
  const apiUrl = process.env.API_INTERNAL_URL;
  if (apiUrl) {
    try {
      const res = await fetch(`${apiUrl.replace(/\/$/, '')}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json().catch(() => ({ error: 'Resposta inválida da API' }));
      return json(data, res.status);
    } catch {
      return json({ error: `Não foi possível conectar à API em ${apiUrl}. Ela está rodando?` }, 502);
    }
  }

  // Modo 2: chama a LLM direto
  const apiKey = process.env.LLM_API_KEY;
  if (!apiKey) {
    return json(
      { error: 'Configure LLM_API_KEY (ou API_INTERNAL_URL) nas variáveis de ambiente do site.' },
      500
    );
  }

  const { message, history, systemPrompt, conversationId } = body as {
    message?: unknown;
    history?: unknown;
    systemPrompt?: unknown;
    conversationId?: unknown;
  };

  if (typeof message !== 'string' || !message.trim()) {
    return json({ error: 'Campo "message" é obrigatório' }, 400);
  }

  const previous: ChatMessage[] = (Array.isArray(history) ? history : [])
    .filter(
      (m: any) => (m?.role === 'user' || m?.role === 'assistant') && typeof m?.content === 'string'
    )
    .slice(-MAX_HISTORY)
    .map((m: any) => ({ role: m.role, content: m.content.slice(0, 4000) }));

  const baseUrl = (process.env.LLM_BASE_URL || 'https://api.deepseek.com/v1').replace(/\/$/, '');

  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.LLM_MODEL || 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: typeof systemPrompt === 'string' && systemPrompt ? systemPrompt : DEFAULT_SYSTEM_PROMPT
          },
          ...previous,
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return json(
        { error: 'Erro ao processar mensagem', details: data?.error?.message || `HTTP ${res.status}` },
        502
      );
    }

    return json({
      response: data?.choices?.[0]?.message?.content || '',
      model: data?.model,
      usage: data?.usage,
      conversationId: typeof conversationId === 'string' ? conversationId : globalThis.crypto.randomUUID()
    });
  } catch (err) {
    return json(
      { error: 'Erro ao processar mensagem', details: err instanceof Error ? err.message : String(err) },
      502
    );
  }
}
