'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// crypto.randomUUID só existe em HTTPS/localhost; no celular via IP da rede ele quebra
const newId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Olá! Sou o SalesMind AI, seu assistente de vendas. Como posso ajudar você hoje?', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const text = input;
    const userMsg: Message = { id: newId(), role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Caminho relativo: o Next repassa /api/* para a API (ver next.config.js)
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json().catch(() => ({}));
      const content = res.ok
        ? data.response || 'A IA não retornou resposta.'
        : `Erro (${res.status}): ${data.error || 'API indisponível. Verifique se a API está rodando.'}${data.details ? `\n${data.details}` : ''}`;
      setMessages(prev => [...prev, { id: newId(), role: 'assistant', content, timestamp: new Date() }]);
    } catch {
      setMessages(prev => [...prev, { id: newId(), role: 'assistant', content: 'Erro de conexão. Verifique se a API está rodando.', timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container bg-gray-50">
      {/* Header */}
      <header className="bg-[#0D7377] text-white p-4 shadow-md">
        <h1 className="text-xl font-bold">SalesMind AI</h1>
        <p className="text-xs opacity-80">Assistente de Vendas Inteligente</p>
      </header>

      {/* Messages */}
      <div className="chat-messages space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
              msg.role === 'user'
                ? 'bg-[#0D7377] text-white rounded-br-none'
                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
            }`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
              <span className={`text-[10px] mt-1 block ${msg.role === 'user' ? 'opacity-70' : 'text-gray-400'}`}>
                {msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-area">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Digite sua mensagem..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-3 text-sm focus:outline-none focus:border-[#0D7377] focus:ring-1 focus:ring-[#0D7377]"
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          className="bg-[#0D7377] text-white rounded-full w-12 h-12 flex items-center justify-center disabled:opacity-50 active:scale-95 transition-transform"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}