import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Activity, BookOpen, Crown, ChevronRight } from 'lucide-react';
import { NutriSearch } from '../components/NutriSearch';
import { IntelligentRecipes } from '../components/IntelligentRecipes';
import { PlateCalculatorModal } from '../components/PlateCalculatorModal';
import { NutritionDiaryModal } from '../components/NutritionDiaryModal';
import { StaggerReveal, StaggerItem } from '../components/ui/StaggerReveal';
import { MagneticButton } from '../components/ui/MagneticButton';

const Ferramentas: React.FC = () => {
    const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
    const [isDiaryOpen, setIsDiaryOpen] = useState(false);
    // Animation Variants
    return (
        <div className="min-h-screen bg-[#fafaf8] text-on-background pt-8 pb-20 relative overflow-hidden font-body">
            {/* Background Effects: More subtle and atmospheric */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-primary/3 blur-[180px] rounded-full opacity-60" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-tertiary/3 blur-[180px] rounded-full opacity-60" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <StaggerReveal className="max-w-4xl mx-auto text-center mb-24">
                    <StaggerItem>
                        <h1 className="text-6xl md:text-[5.5rem] font-headline font-bold tracking-[-0.03em] mb-8 text-on-surface leading-[1.05]">
                            Inteligência <br />
                            <span className="text-primary italic font-serif">Nutricional</span>
                        </h1>
                    </StaggerItem>
                    <StaggerItem>
                        <p className="text-xl md:text-2xl text-on-surface-variant/80 font-light max-w-2xl mx-auto leading-relaxed tracking-tight">
                            A ciência encontra a simplicidade. Ferramentas desenhadas com precisão para elevar sua saúde e bem-estar.
                        </p>
                    </StaggerItem>
                </StaggerReveal>

                <StaggerReveal staggerInterval={0.2} className="space-y-12">
                    {/* Main Tool: NutriSearch */}
                    <StaggerItem
                        className="antigravity-glass rounded-[3.5rem] p-8 md:p-14 border-white/40 shadow-xl shadow-stone-200/50 relative overflow-hidden group"
                    >
                        <div className="flex flex-col md:flex-row items-center gap-8 mb-14 text-center md:text-left relative z-10">
                            <motion.div 
                                whileHover={{ scale: 1.05 }}
                                className="w-20 h-20 rounded-[2rem] bg-white shadow-sm flex items-center justify-center border border-stone-100 flex-shrink-0"
                            >
                                <Search className="w-8 h-8 text-primary/80" />
                            </motion.div>
                            <div>
                                <h2 className="text-4xl font-headline font-bold text-on-surface tracking-tight">NutriSearch Pro</h2>
                                <p className="text-on-surface-variant/70 text-lg font-light mt-1">Exploração profunda de dados nutricionais.</p>
                            </div>
                        </div>
                        
                        <div className="relative z-10">
                            <NutriSearch />
                        </div>
                    </StaggerItem>

                    {/* Tool 2: Intelligent Recipes */}
                    <StaggerItem
                        className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-8 md:p-14 border border-tertiary/10 shadow-2xl shadow-tertiary/5 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 left-0 w-96 h-96 bg-tertiary/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-tertiary/10 transition-colors duration-700" />
                        <div className="relative z-10">
                            <IntelligentRecipes />
                        </div>
                    </StaggerItem>

                    {/* Secondary Tools Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <StaggerItem
                            onClick={() => {
                                setIsCalculatorOpen(true);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="antigravity-glass rounded-[2.5rem] p-10 border-white/40 group cursor-pointer hover:bg-white transition-all shadow-lg shadow-stone-200/40"
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div className="w-16 h-16 rounded-2xl bg-stone-50 flex items-center justify-center border border-stone-100 shadow-inner">
                                    <Activity className="w-8 h-8 text-primary/70" />
                                </div>
                                <div className="p-3 rounded-full bg-stone-50 group-hover:bg-primary/5 transition-colors">
                                    <ChevronRight className="w-6 h-6 text-stone-300 group-hover:text-primary transition-all" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-headline font-bold mb-3 text-on-surface tracking-tight">Calculadora de Prato</h3>
                            <p className="text-on-surface-variant/70 leading-relaxed font-light">
                                Monte sua refeição ideal item a item e acompanhe o balanço de macros em tempo real com precisão clínica.
                            </p>
                        </StaggerItem>


                        <StaggerItem
                            onClick={() => setIsDiaryOpen(true)}
                            className="antigravity-glass rounded-[2.5rem] p-10 border-white/40 group cursor-pointer hover:bg-white transition-all shadow-lg shadow-stone-200/40"
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div className="w-16 h-16 rounded-2xl bg-stone-50 flex items-center justify-center border border-stone-100 shadow-inner">
                                    <BookOpen className="w-8 h-8 text-secondary/70" />
                                </div>
                                <div className="p-3 rounded-full bg-stone-50 group-hover:bg-secondary/5 transition-colors">
                                    <ChevronRight className="w-6 h-6 text-stone-300 group-hover:text-secondary transition-all" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-headline font-bold mb-3 text-on-surface tracking-tight">Diário Inteligente</h3>
                            <p className="text-on-surface-variant/70 leading-relaxed font-light">
                                Registre sua evolução e receba insights biológicos personalizados sobre sua jornada metabólica.
                            </p>
                        </StaggerItem>
                    </div>
                </StaggerReveal>
                {/* Modals */}
                <PlateCalculatorModal 
                    isOpen={isCalculatorOpen} 
                    onClose={() => setIsCalculatorOpen(false)} 
                />

                <NutritionDiaryModal
                    isOpen={isDiaryOpen}
                    onClose={() => setIsDiaryOpen(false)}
                />

                {/* Paywall CTA with specialized animation */}
                <motion.div
                     initial={{ opacity: 0, scale: 0.9 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     viewport={{ once: true }}
                     transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                     className="mt-24 text-center pb-20"
                >
                    <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-sm mb-6">
                        <Crown className="w-5 h-5" />
                        <span>Upgrade para Acesso Total</span>
                    </div>
                    <h2 className="text-4xl font-headline font-bold mb-6">Pronto para o próximo nível?</h2>
                    <p className="text-on-surface-variant text-lg mb-10 max-w-xl mx-auto">
                        Assine um de nossos pacotes premium e desbloqueie ferramentas ilimitadas e acompanhamento direto.
                    </p>
                    <MagneticButton as="div" className="inline-block">
                        <a href="/planos" className="inline-block px-12 py-5 rounded-2xl bg-primary text-white font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/30">
                            Conhecer Pacotes Premium
                        </a>
                    </MagneticButton>

                    {/* Disclaimer */}
                    <div className="mt-20 max-w-3xl mx-auto px-8 py-6 bg-white/50 border border-tertiary/10 rounded-[2rem] text-left">
                        <p className="text-xs text-tertiary/60 leading-relaxed italic">
                            * Nota de Transparência: As informações nutricionais apresentadas são médias aproximadas baseadas em bancos de dados internacionais e podem variar significativamente. Estes dados devem ser usados apenas como referência e não substituem a orientação personalizada de um profissional de saúde.
                        </p>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default Ferramentas;
