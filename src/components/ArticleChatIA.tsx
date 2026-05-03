import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ArticleChatIA() {

    const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
        { role: 'ai', text: 'Olá! Sou a IA da Mariana, alimentada por seus artigos científicos. Como posso te ajudar com dúvidas sobre nutrição hoje?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/nutrition/chat-articles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg })
            });
            const data = await response.json();
            
            if (data.answer) {
                setMessages(prev => [...prev, { role: 'ai', text: data.answer }]);
            } else {
                setMessages(prev => [...prev, { role: 'ai', text: 'Desculpe, tive um problema ao processar sua pergunta. Tente novamente em instantes.' }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'ai', text: 'Erro de conexão com a IA. Verifique se o servidor está rodando.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto my-12 px-6">
            <div className="bg-surface dark:bg-stone-900 border border-outline/10 dark:border-stone-800 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[600px]">
                {/* Lateral Esquerda - Info */}
                <div className="w-full md:w-1/3 bg-primary/5 dark:bg-emerald-500/5 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-outline/10 dark:border-stone-800">
                    <div>
                        <div className="w-12 h-12 bg-primary dark:bg-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                            <span className="material-symbols-outlined text-white dark:text-stone-950">psychology</span>
                        </div>
                        <h3 className="text-2xl font-headline font-bold text-on-surface dark:text-stone-100 mb-4">Nutri-IA Experimental</h3>
                        <p className="text-on-surface-variant dark:text-stone-400 text-sm leading-relaxed">
                            Esta inteligência artificial foi treinada exclusivamente com os artigos e pesquisas da Mariana Bermudes.
                        </p>
                    </div>
                    <div className="mt-8">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary dark:text-emerald-400 opacity-60">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary dark:bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary dark:bg-emerald-500"></span>
                            </span>
                            Baseada em Evidências
                        </div>
                    </div>
                </div>

                {/* Chat Principal */}
                <div className="flex-1 flex flex-col h-full bg-white dark:bg-stone-950">
                    <div 
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar"
                    >
                        {messages.map((msg, i) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={i}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[85%] px-5 py-3 rounded-3xl text-sm leading-relaxed shadow-sm ${
                                    msg.role === 'user' 
                                        ? 'bg-primary text-white rounded-tr-none' 
                                        : 'bg-surface-container dark:bg-stone-800 text-on-surface dark:text-stone-200 rounded-tl-none'
                                }`}>
                                    {msg.text}
                                </div>
                            </motion.div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-surface-container dark:bg-stone-800 px-5 py-3 rounded-3xl rounded-tl-none flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-on-surface-variant/40 dark:bg-stone-500 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-on-surface-variant/40 dark:bg-stone-500 rounded-full animate-bounce delay-75"></span>
                                    <span className="w-1.5 h-1.5 bg-on-surface-variant/40 dark:bg-stone-500 rounded-full animate-bounce delay-150"></span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t border-outline/10 dark:border-stone-800 bg-surface/30 dark:bg-stone-900/30">
                        <div className="relative flex items-center">
                            <input 
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Pergunte sobre nutrição..."
                                className="w-full bg-surface dark:bg-stone-900 border border-outline/20 dark:border-stone-800 px-6 py-4 rounded-full pr-16 focus:outline-none focus:border-primary dark:focus:border-emerald-500 transition-all shadow-inner text-on-surface dark:text-stone-100"
                            />
                            <button 
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="absolute right-2 p-3 bg-primary dark:bg-emerald-500 text-white dark:text-stone-950 rounded-full shadow-md hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                            >
                                <span className="material-symbols-outlined">send</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
