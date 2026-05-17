import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

const FAQ_QUICK = [
  '¿Cuánto dura el turno?',
  '¿Aceptan tarjetas?',
  '¿Hacen diseños personalizados?',
  '¿Cómo reservo?',
];

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: '¡Hola! Soy Luna, la asistente virtual de Lupe Nails 💅 ¿En qué puedo ayudarte?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text,
          history: messages.slice(-6) // últimas 6 para contexto
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { role: 'bot', text: data.response }]);
      } else {
        setMessages(prev => [...prev, { role: 'bot', text: 'Disculpá, ahora no puedo responder. Mandanos un WhatsApp y te contestamos al toque 💕' }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: 'Ups, algo salió mal. Escribinos por WhatsApp así te ayudamos!' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-48 right-6 z-50 bg-brand-fuchsia text-white p-3.5 rounded-full shadow-lg shadow-brand-fuchsia/30 hover:scale-110 transition-transform"
      >
        <MessageCircle className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] bg-white rounded-[2rem] shadow-2xl border border-brand-border/20 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-brand-dark text-brand-nude px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-gold rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-brand-dark" />
                  </div>
                  <div>
                    <p className="font-accent font-semibold text-sm">Luna IA</p>
                    <p className="text-[10px] text-white/60">Asistente virtual</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={chatRef} className="h-[380px] overflow-y-auto p-4 space-y-3 bg-brand-nude/30">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm font-accent leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-brand-dark text-white rounded-br-md'
                      : 'bg-white border border-brand-border/20 rounded-bl-md'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-brand-border/20 px-4 py-3 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-brand-gold/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-brand-gold/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-brand-gold/80 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick questions */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {FAQ_QUICK.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(q)}
                    className="text-[10px] font-accent px-2.5 py-1.5 bg-brand-nude rounded-full border border-brand-border/20 hover:border-brand-gold transition-colors whitespace-nowrap"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-brand-border/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                  placeholder="Escribí tu consulta..."
                  className="flex-1 px-4 py-2.5 bg-brand-nude rounded-xl text-sm font-accent focus:outline-none focus:border-brand-gold border border-transparent"
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isTyping}
                  className="p-2.5 bg-brand-dark text-brand-nude rounded-xl disabled:opacity-30 hover:bg-brand-gold transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
