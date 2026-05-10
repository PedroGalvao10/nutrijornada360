import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Crown } from 'lucide-react';
import { NutriSearch } from '../components/NutriSearch';
import { IntelligentRecipes } from '../components/IntelligentRecipes';
import { StaggerReveal, StaggerItem } from '../components/ui/StaggerReveal';
import { MagneticButton } from '../components/ui/MagneticButton';
import { SimuladorResultados } from '../components/SimuladorResultados';
import { TypewriterText } from '../components/TypewriterText';
import InteractiveParticles from '../components/ui/InteractiveParticles';

const Ferramentas: React.FC = () => {
    // Animation Variants
    return (
        <div className="min-h-screen text-on-background pt-24 md:pt-32 pb-20 relative overflow-hidden font-body">
            {/* Background Interativo */}
            <InteractiveParticles />

            <div className="w-full px-6 md:px-12 relative z-10">
                <StaggerReveal className="max-w-4xl mx-auto text-center mb-24">
                    <StaggerItem>
                        <h1 className="text-6xl md:text-[5.5rem] font-headline font-bold tracking-[-0.03em] mb-8 text-on-surface leading-[1.05]">
                            Inteligência <br />
                            <span className="text-primary italic font-serif">Nutricional</span>
                        </h1>
                    </StaggerItem>
                    <StaggerItem>
                        <p className="text-xl md:text-2xl text-on-surface-variant/80 font-light max-w-2xl mx-auto leading-relaxed tracking-tight">
                            <TypewriterText text="A ciência encontra a simplicidade. Ferramentas desenhadas com precisão para elevar sua saúde e bem-estar." speed={30} delay={1000} />
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
                                <p className="text-on-surface-variant/70 text-lg font-light mt-1">
                                    <TypewriterText text="Exploração profunda de dados nutricionais." speed={40} delay={1500} />
                                </p>
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

                    {/* Tool 3: Results Simulator */}
                    <StaggerItem>
                        <SimuladorResultados />
                    </StaggerItem>

                </StaggerReveal>

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
