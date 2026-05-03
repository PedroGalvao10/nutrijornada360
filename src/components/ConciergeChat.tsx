import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Database, BookOpen, User } from 'lucide-react';

interface Message {
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

const NOTEBOOKS = {
  SCIENTIFIC: '0c074a6d-3943-410e-8535-2c9500c8d03a',
  TACO: '58532935-cd30-467c-9b7e-cf1920496423'
};

export default function ConciergeChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'SCIENTIFIC' | 'TACO'>('SCIENTIFIC');
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'ai', 
      text: 'Olá! Sou seu assistente NutriJornada. Posso consultar as pesquisas da Mariana ou a Tabela TACO para você. O que deseja saber?', 
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    const newMsg: Message = { role: 'user', text: userMsg, timestamp: new Date() };
    setMessages(prev => [...prev, newMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMsg, 
          notebookId: NOTEBOOKS[activeTab] 
        })
      });
      
      const data = await response.json();
      
      if (data.response) {
        setMessages(prev => [...prev, { role: 'ai', text: data.response, timestamp: new Date() }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: 'Desculpe, tive um problema ao acessar minha base de conhecimento.', timestamp: new Date() }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Erro de conexão. Verifique se o servidor está ativo.', timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-primary dark:bg-emerald-500 rounded-full shadow-2xl flex items-center justify-center text-white dark:text-stone-950 transition-colors"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white dark:border-stone-950 flex items-center justify-center text-[10px] font-bold"
          >
            1
          </motion.div>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-24 right-6 z-50 w-[90vw] md:w-[400px] h-[600px] bg-white/80 dark:bg-stone-900/90 backdrop-blur-xl border border-outline/10 dark:border-white/10 rounded-[2rem] shadow-3xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 bg-primary/5 dark:bg-emerald-500/5 border-b border-outline/10 dark:border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary dark:bg-emerald-500 rounded-xl flex items-center justify-center text-white dark:text-stone-950">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-headline font-bold text-on-surface dark:text-stone-100">NutriChat Concierge</h3>
                  <p className="text-[10px] text-on-surface-variant dark:text-stone-400 uppercase tracking-widest font-bold">Powered by NotebookLM</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex bg-surface-container dark:bg-stone-800/50 p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab('SCIENTIFIC')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
                    activeTab === 'SCIENTIFIC' 
                      ? 'bg-white dark:bg-stone-700 shadow-sm text-primary dark:text-emerald-400' 
                      : 'text-on-surface-variant dark:text-stone-500'
                  }`}
                >
                  <BookOpen size={14} /> Base Científica
                </button>
                <button
                  onClick={() => setActiveTab('TACO')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
                    activeTab === 'TACO' 
                      ? 'bg-white dark:bg-stone-700 shadow-sm text-primary dark:text-emerald-400' 
                      : 'text-on-surface-variant dark:text-stone-500'
                  }`}
                >
                  <Database size={14} /> Tabela TACO
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar"
            >
              {messages.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user' ? 'bg-primary/20 dark:bg-emerald-500/20' : 'bg-surface-container dark:bg-stone-800'
                  }`}>
                    {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
                  </div>
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary text-white rounded-tr-none'
                      : 'bg-surface-container dark:bg-stone-800 text-on-surface dark:text-stone-200 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container dark:bg-stone-800 flex items-center justify-center">
                    <Sparkles size={16} className="animate-pulse" />
                  </div>
                  <div className="bg-surface-container dark:bg-stone-800 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-on-surface-variant/40 dark:bg-stone-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-on-surface-variant/40 dark:bg-stone-500 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-on-surface-variant/40 dark:bg-stone-500 rounded-full animate-bounce delay-150"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-stone-900 border-t border-outline/10 dark:border-white/10">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={activeTab === 'SCIENTIFIC' ? "Dúvida científica..." : "Buscar na TACO..."}
                  className="w-full bg-surface-container dark:bg-stone-800/50 border border-transparent focus:border-primary dark:focus:border-emerald-500 px-6 py-4 rounded-2xl pr-14 outline-none transition-all text-on-surface dark:text-stone-200"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 p-3 text-primary dark:text-emerald-500 hover:scale-110 active:scale-95 transition-all disabled:opacity-30"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
