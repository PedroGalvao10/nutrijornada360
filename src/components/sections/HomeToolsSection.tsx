import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, ChevronRight, Activity } from 'lucide-react';
import { StaggerReveal, StaggerItem } from '../ui/StaggerReveal';
import { NutriSearch } from '../NutriSearch';
import { MagneticButton } from '../ui/MagneticButton';

export function HomeToolsSection() {
  const [activeModal, setActiveModal] = useState<'SEARCH' | null>(null);

  return (
    <section className="py-24 md:py-32 bg-stone-950 relative overflow-hidden text-stone-100">
      {/* Background Orbs & Video (ZOE/Seed style) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[80vw] h-[80vw] bg-verde-profundo/30 rounded-full blur-[150px] translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] bg-ouro-suave/10 rounded-full blur-[120px] -translate-x-1/3 translate-y-1/3" />
        
        {/* Abstract organic shape / noise overlay */}
        <div 
          className="absolute inset-0 opacity-10 mix-blend-overlay"
          style={{ 
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")"
          }}
        />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">
        
        <StaggerReveal className="mb-20 md:mb-32 max-w-4xl">
          <StaggerItem>
            <p className="inline-flex items-center gap-3 text-[0.65rem] tracking-[0.26em] uppercase font-bold text-ouro-suave mb-8">
              <span aria-hidden="true" className="inline-block w-8 h-[1px] bg-ouro-suave/50" />
              Extensão do Consultório
            </p>
          </StaggerItem>
          <StaggerItem>
            <h2 className="text-4xl md:text-5xl lg:text-[4.5rem] leading-[1.05] tracking-[-0.02em] font-medium text-stone-100 mb-8">
              Autonomia no seu <br className="hidden md:block"/>
              <em className="italic text-verde-nevoa/90">bolso & dia a dia.</em>
            </h2>
          </StaggerItem>
          <StaggerItem>
            <p className="text-lg md:text-xl font-light text-stone-400 leading-relaxed max-w-2xl">
              Mais do que consultas, você recebe acesso a um acervo vivo. Receitas reais, busca nutricional baseada em ciência e ferramentas para fazer escolhas conscientes, onde quer que você esteja.
            </p>
          </StaggerItem>
        </StaggerReveal>

        {/* Glassmorphism Editoral Layout */}
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
          
          {/* Card 1: Receitas (Glass Panel) */}
          <motion.div 
            whileHover={{ y: -8 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="group relative p-8 md:p-12 rounded-[2rem] border border-white/10 overflow-hidden bg-white/5 backdrop-blur-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <BookOpen className="w-8 h-8 text-ouro-suave mb-8 stroke-[1.5]" />
                <h3 className="text-3xl font-headline text-stone-100 mb-4">Acervo de Receitas</h3>
                <p className="text-stone-400 font-light leading-relaxed mb-12">
                  Uma curadoria feita por mim com opções práticas e cientificamente balanceadas. Diga-me o que tem na sua geladeira e eu sugiro o que preparar hoje.
                </p>
              </div>
              
              <a href="/ferramentas" className="inline-flex items-center gap-3 text-sm font-bold tracking-widest uppercase text-stone-200 group-hover:text-ouro-suave transition-colors">
                Explorar Acervo <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Card 2: Busca (Glass Panel) */}
          <motion.div 
            onClick={() => setActiveModal('SEARCH')}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="group relative cursor-pointer p-8 md:p-12 rounded-[2rem] border border-white/10 overflow-hidden bg-white/5 backdrop-blur-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <Activity className="w-8 h-8 text-ouro-suave mb-8 stroke-[1.5]" />
                <h3 className="text-3xl font-headline text-stone-100 mb-4">Ciência Nutricional</h3>
                <p className="text-stone-400 font-light leading-relaxed mb-12">
                  Quer saber a composição exata de um alimento? Consulte minha base de dados estruturada a partir de referências científicas oficiais.
                </p>
              </div>
              
              <div className="inline-flex items-center gap-3 text-sm font-bold tracking-widest uppercase text-stone-200 group-hover:text-ouro-suave transition-colors">
                Consultar Base <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>

        </div>

        <div className="mt-20 flex justify-center">
            <MagneticButton as="div" className="inline-block">
                <a href="/ferramentas" className="text-stone-400 hover:text-stone-100 transition-colors flex items-center gap-2 font-medium font-handwriting text-2xl">
                    Acessar o menu completo de ferramentas <ChevronRight size={24} />
                </a>
            </MagneticButton>
        </div>
      </div>

      {/* Search Modal */}
      <AnimatePresence>
        {activeModal === 'SEARCH' && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveModal(null)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-stone-900 rounded-3xl shadow-2xl border border-white/10 p-8 md:p-12 overflow-y-auto custom-scrollbar"
            >
                <button onClick={() => setActiveModal(null)} title="Fechar" className="absolute top-6 right-6 p-2 text-stone-400 hover:text-white rounded-full transition-colors"><X size={24} /></button>
                <div className="mb-10 pb-6 border-b border-white/10">
                    <h2 className="text-4xl font-headline font-medium mb-3 text-stone-100">Base Científica</h2>
                    <p className="text-stone-400 font-light text-lg">Pesquise alimentos e composições detalhadas da nossa tabela validada.</p>
                </div>
                <NutriSearch />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
