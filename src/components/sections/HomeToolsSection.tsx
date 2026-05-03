import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Search, Activity, ChevronRight, X } from 'lucide-react';
import { StaggerReveal, StaggerItem } from '../ui/StaggerReveal';
import { MagneticButton } from '../ui/MagneticButton';
import { PlateCalculatorModal } from '../PlateCalculatorModal';
import { NutriSearch } from '../NutriSearch';

// --- Main Section Component ---
export function HomeToolsSection() {
  const [activeModal, setActiveModal] = useState<'CALC' | 'SEARCH' | null>(null);

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">          {/* Plate Calculator Card */}
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
