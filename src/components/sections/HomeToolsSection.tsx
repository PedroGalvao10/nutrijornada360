import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Search, Activity, ChevronRight, X, Database, BookOpen, Send, User } from 'lucide-react';
import { StaggerReveal, StaggerItem } from '../ui/StaggerReveal';
import { MagneticButton } from '../ui/MagneticButton';
import { PlateCalculatorModal } from '../PlateCalculatorModal';
import { NutriSearch } from '../NutriSearch';

// --- IA Chat Modal Component (Refatorado do ConciergeChat para ser modal-only) ---
const NOTEBOOKS = {
  SCIENTIFIC: '0c074a6d-3943-410e-8535-2c9500c8d03a',
  TACO: '58532935-cd30-467c-9b7e-cf1920496423'
};

interface Message {
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

function IAEvolutionModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'SCIENTIFIC' | 'TACO'>('SCIENTIFIC');
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'ai', 
      text: 'Olá! Sou seu assistente de Evolução Semanal. Vamos analisar sua jornada ou consultar dados nutricionais hoje?', 
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg, timestamp: new Date() }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, notebookId: NOTEBOOKS[activeTab] })
      });
      const data = await response.json();
      if (data.response) {
        setMessages(prev => [...prev, { role: 'ai', text: data.response, timestamp: new Date() }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: 'Desculpe, tive um problema ao acessar minha base de conhecimento.', timestamp: new Date() }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Erro de conexão.', timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-stone-900/40 backdrop-blur-md"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl h-[80vh] bg-white dark:bg-stone-900 rounded-[2.5rem] shadow-3xl overflow-hidden flex flex-col border border-white/20"
        >
          {/* Header */}
          <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="font-headline font-bold text-lg">Nutri-IA: Evolução Semanal</h3>
                <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Inteligência Artificial Mariana Bermudes</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Tabs */}
          <div className="px-6 py-3 bg-stone-50 dark:bg-stone-950/30">
            <div className="flex bg-stone-200/50 dark:bg-stone-800/50 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('SCIENTIFIC')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'SCIENTIFIC' ? 'bg-white dark:bg-stone-700 shadow-sm text-primary' : 'text-stone-500'
                }`}
              >
                <BookOpen size={14} /> Base Científica
              </button>
              <button
                onClick={() => setActiveTab('TACO')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'TACO' ? 'bg-white dark:bg-stone-700 shadow-sm text-primary' : 'text-stone-500'
                }`}
              >
                <Database size={14} /> Tabela TACO
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {messages.map((msg, i) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={i}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user' ? 'bg-primary/20' : 'bg-stone-100 dark:bg-stone-800'
                }`}>
                  {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
                </div>
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center animate-pulse">
                  <Sparkles size={16} />
                </div>
                <div className="bg-stone-100 dark:bg-stone-800 px-4 py-2 rounded-2xl rounded-tl-none flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-6 bg-white dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Pergunte sobre sua evolução ou alimentos..."
                className="w-full bg-stone-50 dark:bg-stone-800/50 border border-transparent focus:border-primary px-6 py-4 rounded-2xl pr-14 outline-none transition-all"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="absolute right-2 p-3 text-primary hover:scale-110 disabled:opacity-30 transition-all"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// --- Main Section Component ---
export function HomeToolsSection() {
  const [activeModal, setActiveModal] = useState<'IA' | 'CALC' | 'SEARCH' | null>(null);

  return (
    <section className="py-24 bg-background dark:bg-stone-950 relative overflow-hidden transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        <StaggerReveal className="mb-16">
          <StaggerItem>
            <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Ecossistema Digital</span>
          </StaggerItem>
          <StaggerItem>
            <h2 className="text-4xl md:text-6xl font-headline text-on-surface dark:text-stone-100 font-semibold mb-6">
              Ferramentas de <span className="italic text-primary">Precisão.</span>
            </h2>
          </StaggerItem>
          <StaggerItem>
            <p className="text-on-surface-variant dark:text-stone-400 text-lg max-w-2xl leading-relaxed">
              Tecnologia de ponta integrada ao seu plano nutricional para garantir que cada decisão seja baseada em dados e ciência.
            </p>
          </StaggerItem>
        </StaggerReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Nutri-IA Evolution Card */}
          <StaggerItem
            onClick={() => setActiveModal('IA')}
            className="group cursor-pointer p-10 rounded-[3rem] bg-gradient-to-br from-primary/10 to-transparent dark:from-emerald-500/10 border border-primary/20 dark:border-emerald-500/20 hover:bg-white dark:hover:bg-stone-900 transition-all duration-500 shadow-xl shadow-primary/5"
          >
            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-stone-800 shadow-sm flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <Sparkles className="w-8 h-8 text-primary dark:text-emerald-400" />
            </div>
            <h3 className="text-2xl font-headline font-bold mb-4 dark:text-stone-100">Nutri-IA Evolução</h3>
            <p className="text-on-surface-variant dark:text-stone-400 font-light leading-relaxed mb-8">
              Acompanhamento inteligente da sua jornada semanal. Tire dúvidas sobre seu plano e receba insights biológicos em tempo real.
            </p>
            <div className="flex items-center gap-2 text-primary dark:text-emerald-400 font-bold">
              <span>Abrir Assistente</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </StaggerItem>

          {/* Plate Calculator Card */}
          <StaggerItem
            onClick={() => setActiveModal('CALC')}
            className="group cursor-pointer p-10 rounded-[3rem] bg-white dark:bg-stone-900/50 border border-stone-100 dark:border-stone-800 hover:border-primary/30 transition-all duration-500 shadow-xl shadow-stone-200/40"
          >
            <div className="w-16 h-16 rounded-2xl bg-stone-50 dark:bg-stone-800 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <Activity className="w-8 h-8 text-primary/70" />
            </div>
            <h3 className="text-2xl font-headline font-bold mb-4 dark:text-stone-100">Calculadora de Prato</h3>
            <p className="text-on-surface-variant dark:text-stone-400 font-light leading-relaxed mb-8">
              Monte suas refeições com precisão clínica. Visualize macros e calorias instantaneamente para manter o equilíbrio perfeito.
            </p>
            <div className="flex items-center gap-2 text-primary dark:text-emerald-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Calcular Agora</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </StaggerItem>

          {/* NutriSearch Card */}
          <StaggerItem
            onClick={() => setActiveModal('SEARCH')}
            className="group cursor-pointer p-10 rounded-[3rem] bg-white dark:bg-stone-900/50 border border-stone-100 dark:border-stone-800 hover:border-primary/30 transition-all duration-500 shadow-xl shadow-stone-200/40"
          >
            <div className="w-16 h-16 rounded-2xl bg-stone-50 dark:bg-stone-800 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <Search className="w-8 h-8 text-primary/70" />
            </div>
            <h3 className="text-2xl font-headline font-bold mb-4 dark:text-stone-100">NutriSearch Pro</h3>
            <p className="text-on-surface-variant dark:text-stone-400 font-light leading-relaxed mb-8">
              Explore profundamente a composição de milhares de alimentos com dados baseados na Tabela TACO e bancos internacionais.
            </p>
            <div className="flex items-center gap-2 text-primary dark:text-emerald-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Explorar Alimentos</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </StaggerItem>
        </div>

        <div className="mt-16 text-center">
            <MagneticButton as="div" className="inline-block">
                <a href="/ferramentas" className="text-on-surface-variant dark:text-stone-400 hover:text-primary transition-colors flex items-center gap-2 font-medium">
                    Ver todas as ferramentas <ChevronRight size={18} />
                </a>
            </MagneticButton>
        </div>
      </div>

      {/* Modals */}
      <IAEvolutionModal isOpen={activeModal === 'IA'} onClose={() => setActiveModal(null)} />
      <PlateCalculatorModal isOpen={activeModal === 'CALC'} onClose={() => setActiveModal(null)} />
      
      {/* Search Modal */}
      <AnimatePresence>
        {activeModal === 'SEARCH' && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveModal(null)} className="absolute inset-0 bg-stone-900/40 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-5xl max-h-[90vh] bg-white dark:bg-stone-900 rounded-[3rem] shadow-3xl overflow-hidden border border-white/20 p-8 md:p-12 overflow-y-auto custom-scrollbar">
                <button onClick={() => setActiveModal(null)} className="absolute top-8 right-8 p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full"><X size={24} /></button>
                <div className="mb-8">
                    <h2 className="text-3xl font-headline font-bold mb-2 dark:text-stone-100">NutriSearch Pro</h2>
                    <p className="text-stone-400">Pesquise alimentos e composições detalhadas.</p>
                </div>
                <NutriSearch />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
