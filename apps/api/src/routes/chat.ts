import { FastifyPluginAsync } from 'fastify';
import OpenAI from 'openai';

import { randomUUID } from 'node:crypto';

// Usa API compatível com OpenAI — funciona com DeepSeek, Qwen, SiliconFlow, Together.ai
// O cliente é criado sob demanda, depois que o .env já foi carregado.
let llm: OpenAI | null = null;
function getLLM(): OpenAI | null {
  if (!process.env.LLM_API_KEY) return null;
  if (!llm) {
    llm = new OpenAI({
      apiKey: process.env.LLM_API_KEY,
      baseURL: process.env.LLM_BASE_URL || 'https://api.deepseek.com/v1'
    });
  }
  return llm;
}

export const chatRoute: FastifyPluginAsync = async (app) => {
  app.post('/chat', async (request, reply) => {
    const llm = getLLM();
    if (!llm) {
      return reply.status(500).send({
        error: 'LLM_API_KEY não configurada. Copie .env.example para .env e preencha sua chave.'
      });
    }

    const { message, conversationId, systemPrompt } = (request.body ?? {}) as {
      message: string;
      conversationId?: string;
      systemPrompt?: string;
    };

    if (!message) {
      return reply.status(400).send({ error: 'Campo "message" é obrigatório' });
    }

    try {
      const completion = await llm.chat.completions.create({
        model: process.env.LLM_MODEL || 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: systemPrompt || 'Você é o SalesMind AI, assistente inteligente de vendas. Responda sempre em português, seja objetivo e ajude o usuário a vender mais.'
          },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1024
      });

      return {
        response: completion.choices[0]?.message?.content || '',
        model: completion.model,
        usage: completion.usage,
        conversationId: conversationId || randomUUID()
      };
    } catch (err: any) {
      app.log.error(err);
      return reply.status(500).send({
        error: 'Erro ao processar mensagem',
        details: err.message
      });
    }
  });
};