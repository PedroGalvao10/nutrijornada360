import React from 'react';
import { Link } from 'react-router-dom';
import { NutriSearch } from '../components/NutriSearch';
import { IntelligentRecipes } from '../components/IntelligentRecipes';
import { StaggerReveal, StaggerItem } from '../components/ui/StaggerReveal';
import { MagneticButton } from '../components/ui/MagneticButton';
import { SimuladorResultados } from '../components/SimuladorResultados';
import SEO from '../components/SEO';

// ============================================================
// Ferramentas — página na direção "Editorial Orgânico".
// As ferramentas (NutriSearch, IntelligentRecipes, Simulador)
// permanecem intactas; a página vira uma sequência de cartões
// brancos editoriais numerados sobre o fundo creme.
// ============================================================

const Ferramentas: React.FC = () => {
    return (
        <div className="relative min-h-screen bg-background dark:bg-stone-950 overflow-x-hidden transition-colors duration-500 font-body">
            <SEO
                title="Ferramentas de Nutrição Inteligente"
                description="Busca nutricional com dados científicos, receitas inteligentes e simulador de resultados. Ferramentas gratuitas da NutriJornada 360º de Mariana Bermudes."
            />

            <div aria-hidden="true" className="absolute -top-40 -left-40 w-[560px] h-[560px] rounded-full bg-verde-nevoa/60 dark:bg-emerald-900/20 blur-[120px] pointer-events-none" />

            <div className="relative max-w-[1280px] mx-auto px-6 md:px-12 pt-32 md:pt-40 pb-24">
                {/* Cabeçalho editorial */}
                <StaggerReveal className="max-w-3xl mb-16 md:mb-20">
                    <StaggerItem>
                        <p className="inline-flex items-center gap-3 text-[0.68rem] tracking-[0.26em] uppercase font-extrabold text-tertiary dark:text-ouro-suave mb-6">
                            <span aria-hidden="true" className="inline-block w-10 h-px bg-ouro-suave" />
                            Ferramentas gratuitas
                        </p>
                    </StaggerItem>
                    <StaggerItem>
                        <h1 className="font-headline font-medium text-4xl sm:text-5xl lg:text-[3.6rem] leading-[1.08] tracking-[-0.02em] text-on-background dark:text-stone-100 mb-6">
                            Dados nutricionais,{' '}
                            <em className="italic text-primary dark:text-emerald-400">sem achismo.</em>
                        </h1>
                    </StaggerItem>
                    <StaggerItem>
                        <p className="text-lg md:text-xl font-light text-on-surface-variant dark:text-stone-400 leading-relaxed max-w-[52ch]">
                            Consulte a composição dos alimentos, monte receitas com o que
                            você tem em casa e simule seus resultados. Tudo gratuito, com
                            dados de bancos científicos.
                        </p>
                    </StaggerItem>
                </StaggerReveal>

                {/* Ferramentas em cartões editoriais */}
                <StaggerReveal staggerInterval={0.15} className="space-y-10 md:space-y-14">
                    <StaggerItem className="bg-white dark:bg-stone-900 rounded-[32px] p-6 md:p-12 shadow-float-1">
                        <div className="mb-10">
                            <span className="font-headline italic text-ouro-suave text-lg">Nº 01</span>
                            <h2 className="font-headline font-medium text-2xl md:text-3xl text-on-background dark:text-stone-100 mt-2 mb-3">
                                Busca nutricional
                            </h2>
                            <div aria-hidden="true" className="w-16 h-px bg-ouro-suave mb-4" />
                            <p className="text-on-surface-variant dark:text-stone-400 font-light max-w-[52ch]">
                                Pesquise qualquer alimento e veja calorias, macros e
                                micronutrientes em detalhe.
                            </p>
                        </div>
                        <NutriSearch />
                    </StaggerItem>

                    <StaggerItem className="bg-white dark:bg-stone-900 rounded-[32px] p-6 md:p-12 shadow-float-1">
                        <div className="mb-10">
                            <span className="font-headline italic text-ouro-suave text-lg">Nº 02</span>
                            <h2 className="font-headline font-medium text-2xl md:text-3xl text-on-background dark:text-stone-100 mt-2 mb-3">
                                Receitas inteligentes
                            </h2>
                            <div aria-hidden="true" className="w-16 h-px bg-ouro-suave mb-4" />
                            <p className="text-on-surface-variant dark:text-stone-400 font-light max-w-[52ch]">
                                Diga o que tem na geladeira e receba combinações que fazem
                                sentido nutricional.
                            </p>
                        </div>
                        <IntelligentRecipes />
                    </StaggerItem>

                    <StaggerItem>
                        <SimuladorResultados />
                    </StaggerItem>
                </StaggerReveal>

                {/* CTA para os planos */}
                <StaggerReveal className="relative overflow-hidden rounded-[32px] bg-verde-profundo dark:bg-emerald-950 px-8 md:px-16 py-14 md:py-20 text-center shadow-float-2 mt-20 md:mt-28">
                    <div aria-hidden="true" className="absolute -bottom-32 -right-24 w-[420px] h-[420px] rounded-full bg-primary/25 blur-[100px] pointer-events-none" />
                    <StaggerItem>
                        <p className="text-[0.68rem] tracking-[0.26em] uppercase font-extrabold text-ouro-suave mb-5">Quer ir além?</p>
                    </StaggerItem>
                    <StaggerItem>
                        <h2 className="font-headline font-medium text-3xl md:text-[2.6rem] leading-[1.12] text-background mb-5">
                            Ferramenta ajuda. <em className="italic text-ouro-suave">Acompanhamento transforma.</em>
                        </h2>
                    </StaggerItem>
                    <StaggerItem>
                        <p className="text-background/75 font-light text-lg leading-relaxed max-w-[46ch] mx-auto mb-9">
                            Os números acima são um ponto de partida. Um plano feito para a
                            sua rotina, com revisão humana, é o que muda o resultado.
                        </p>
                    </StaggerItem>
                    <StaggerItem>
                        <MagneticButton as="div" className="inline-block">
                            <Link
                                to="/planos"
                                data-cursor="Ver Planos"
                                className="inline-flex items-center gap-2 bg-background text-verde-profundo px-9 py-4 rounded-full font-semibold text-[0.95rem] shadow-float-1 hover:shadow-float-2 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                            >
                                Conhecer os planos
                                <span aria-hidden="true" className="material-symbols-outlined text-[18px]">arrow_forward</span>
                            </Link>
                        </MagneticButton>
                    </StaggerItem>
                </StaggerReveal>

                {/* Nota de transparência */}
                <div className="mt-14 max-w-3xl mx-auto border-l-2 border-ouro-suave pl-6">
                    <p className="text-sm text-on-surface-variant dark:text-stone-400 leading-relaxed">
                        <strong className="font-semibold text-on-background dark:text-stone-200">Nota de transparência:</strong>{' '}
                        as informações nutricionais são médias aproximadas de bancos de
                        dados internacionais e podem variar. Use como referência — elas não
                        substituem a orientação personalizada de um profissional de saúde.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Ferramentas;
