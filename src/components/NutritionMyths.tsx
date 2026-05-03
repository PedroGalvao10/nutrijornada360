import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface Myth {
  id: number;
  icon: string;
  title: string;
  explanation: string;
  category: string;
}

const myths: Myth[] = [
  { id: 1, icon: "🚫", title: "Carboidrato engorda", category: "Emagrecimento", explanation: "Carboidratos são nossa principal fonte de energia. O que causa o ganho de peso é o superávit calórico total (comer mais do que gasta) e não um grupo alimentar isolado. Equilíbrio é a chave." },
  { id: 2, icon: "🚫", title: "Comer à noite faz mal", category: "Saúde", explanation: "Seu corpo não desliga o metabolismo após as 18h. O que importa é a qualidade do que você come e a quantidade total do dia. Refeições leves à noite podem inclusive melhorar a qualidade do seu sono." },
  { id: 3, icon: "🚫", title: "Gordura faz mal", category: "Saúde", explanation: "Gorduras boas, como o ômega-3 e as monoinsaturadas (ex: azeite, abacate), são vitais para a saúde hormonal e cerebral. O inimigo real são as gorduras trans e o consumo excessivo de saturadas." },
  { id: 4, icon: "🚫", title: "Dieta detox limpa tudo", category: "Dieta", explanation: "Seu corpo possui 'filtros' naturais: fígado e rins. Sucos verdes são ótimos aportes de micronutrientes, mas não têm o poder de 'limpar' toxinas por conta própria como muitos prometem." },
  { id: 5, icon: "🚫", title: "Frutas à noite inflamam", category: "Saúde", explanation: "Frutas são saudáveis em qualquer horário. A frutose presente na fruta vem acompanhada de fibras e antioxidantes, sendo uma excelente opção de sobremesa ou lanche noturno equilibrado." },
  { id: 6, icon: "🚫", title: "Furar refeições emagrece", category: "Metabolismo", explanation: "Pular refeições pode gerar uma resposta de 'estocagem' do corpo e aumentar a fome na próxima refeição, levando à compulsão. O fracionamento inteligente mantém o metabolismo estável." },
  { id: 7, icon: "🚫", title: "Glúten faz mal a todos", category: "Saúde", explanation: "O glúten só deve ser retirado por pessoas com doença celíaca ou sensibilidade comprovada. Para a maioria, grãos integrais são fontes importantes de fibras e vitaminas do complexo B." },
  { id: 8, icon: "🚫", title: "Suco é igual a fruta", category: "Alimentação", explanation: "Ao fazer o suco, perdemos grande parte das fibras e concentramos o açúcar da fruta. Mastigar a fruta inteira promove mais saciedade e um controle glicêmico muito superior." },
  { id: 9, icon: "🚫", title: "Whey é só para atletas", category: "Alimentação", explanation: "O Whey é apenas a proteína do soro do leite. É uma ferramenta prática para idosos, pessoas em recuperação ou qualquer um que precise bater a meta proteica diária com qualidade." },
  { id: 10, icon: "🚫", title: "Salada é sempre a melhor", category: "Dieta", explanation: "Depende do que você coloca nela! Muitos molhos prontos e acompanhamentos transformam uma salada leve em uma refeição mais calórica que um lanche. Escolha temperos naturais." },
  { id: 11, icon: "🚫", title: "Água com limão queima", category: "Metabolismo", explanation: "Excelente para hidratação e vitamina C, mas não tem poder de queimar gordura visceral. Gordura se queima com déficit calórico e exercícios, não com termogênicos milagrosos." },
  { id: 12, icon: "🚫", title: "Ovo aumenta o colesterol", category: "Saúde", explanation: "Estudos mostram que o colesterol dietético tem impacto mínimo no colesterol sanguíneo para a maioria das pessoas. O ovo é um dos alimentos mais nutritivos e completos que existem." },
  { id: 13, icon: "🚫", title: "Tapioca é melhor que pão", category: "Alimentação", explanation: "A tapioca tem alto índice glicêmico e pouca fibra. O pão integral costuma ser mais nutritivo por conter fibras e proteínas que ajudam na saciedade e no controle da insulina." },
  { id: 14, icon: "🚫", title: "Chocolate amargo é livre", category: "Dieta", explanation: "Ser amargo não significa ter zero calorias. Ele tem benefícios antioxidantes e menos açúcar, mas o equilíbrio na porção continua sendo essencial para não boicotar o emagrecimento." }
];

const NutritionMyths: React.FC = () => {
  const [activeMyth, setActiveMyth] = useState<Myth | null>(null);

  const handleMythClick = (myth: Myth) => {
    setActiveMyth(activeMyth?.id === myth.id ? null : myth);
  };

  return (
    <>
      <section className="relative z-[100] -mt-40 md:-mt-72 pb-8 pointer-events-none">
        <div className="max-w-6xl mx-auto px-4 pointer-events-auto">
          <div className="bg-background/90 dark:bg-stone-900/90 backdrop-blur-xl py-4 md:py-6 rounded-[2.5rem] border border-stone-200/40 dark:border-stone-800/40 overflow-hidden shadow-sm">
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-8 px-6 mb-3 border-b border-stone-100/50 dark:border-stone-800/50 pb-3">
              <h2 className="text-[10px] md:text-xs font-headline font-bold text-on-background dark:text-stone-300 uppercase tracking-widest">
                Mitos da Nutrição
              </h2>
              <p className="text-[8px] text-on-surface-variant dark:text-stone-500 uppercase tracking-[0.2em] font-medium opacity-60">
                Desconstruindo crenças
              </p>
            </div>

            {/* Single Row Marquee */}
            <div className="relative group overflow-hidden">
              <div className="flex whitespace-nowrap py-1 md:py-1.5">
                <div className="flex animate-marquee-slower group-hover:[animation-play-state:paused] will-change-transform">
                  {[...myths, ...myths].map((myth, idx) => (
                    <button
                      key={`${myth.id}-${idx}`}
                      onClick={() => handleMythClick(myth)}
                      className="mx-1.5 px-3 py-1.5 rounded-lg bg-white/40 dark:bg-stone-800/20 border border-stone-100/30 dark:border-white/5 shadow-none hover:bg-white/60 dark:hover:bg-stone-700/30 transition-all duration-300 flex items-center gap-2 shrink-0"
                      data-cursor="Ver Verdade"
                    >
                      <span className="text-sm">{myth.icon}</span>
                      <span className="text-[9px] font-bold text-on-background dark:text-stone-300 uppercase tracking-wider">
                        {myth.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Crumpled Paper Modal - Portaled to Root to escape stacking context */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {activeMyth && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveMyth(null)}
              className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-stone-900/60 backdrop-blur-md cursor-pointer"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg bg-[#FDFBF7] dark:bg-stone-950 rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 relative shadow-2xl cursor-default"
              >
                {/* Texture Layer */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] mix-blend-multiply"></div>
                
                <div className="p-8 md:p-10 relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div className="px-2 py-0.5 bg-primary/20 dark:bg-emerald-500/20 text-primary dark:text-emerald-400 text-[8px] font-black rounded tracking-[0.2em] uppercase">
                      ESCLARECIMENTO
                    </div>

                    <button 
                      onClick={() => setActiveMyth(null)}
                      className="p-1.5 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 rounded-full transition-colors text-stone-400"
                      data-cursor="Fechar"
                    >
                      <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-stone-100 dark:bg-stone-900 rounded-full flex items-center justify-center text-3xl">
                      {activeMyth.icon}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-headline font-bold text-stone-900 dark:text-stone-100 leading-tight">
                      {activeMyth.title}
                    </h3>
                  </div>

                  <div className="h-[2px] w-12 bg-primary dark:bg-emerald-500 mb-6"></div>

                  <div className="relative mb-2">
                    <span className="absolute -left-4 -top-2 text-4xl text-primary/10 font-serif">"</span>
                    <p className="text-lg md:text-xl text-stone-700 dark:text-stone-300 leading-relaxed font-serif italic">
                      {activeMyth.explanation}
                    </p>
                  </div>
                </div>

                {/* Decorative effects */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-stone-200/20 to-transparent pointer-events-none"></div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default NutritionMyths;
