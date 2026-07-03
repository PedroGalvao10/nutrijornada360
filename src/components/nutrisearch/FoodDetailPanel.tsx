import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, ChevronLeft, Apple, BookOpen } from 'lucide-react';
import { deviceHeaders } from '../../lib/deviceId';
import type { FoodResult } from './types';

// ============================================================
// FoodDetailPanel — painel de detalhe do alimento selecionado
// (extraído de NutriSearch). Visual na direção "Editorial
// Orgânico": cartão branco radius 32px, rótulos em ouro,
// números em Lora. A consulta à IA de artigos vive aqui.
// ============================================================

interface Props {
    food: FoodResult;
    onBack: () => void;
}

// Donut de macros — SVG estático, sem animação por frame
function MacroChart({ protein, carbs, fat }: { protein: number; carbs: number; fat: number }) {
    const total = protein + carbs + fat;
    if (total === 0) return <div className="text-on-surface-variant text-sm italic">Sem dados de macros</div>;

    const pPercent = (protein / total) * 100;
    const cPercent = (carbs / total) * 100;
    const fPercent = (fat / total) * 100;

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-40 h-40 mb-6">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    <circle strokeDasharray={`${pPercent} 100`} strokeDashoffset="0" className="stroke-primary" strokeWidth="3" fill="none" r="15.91549431" cx="18" cy="18" />
                    <circle strokeDasharray={`${cPercent} 100`} strokeDashoffset={`-${pPercent}`} className="stroke-tertiary" strokeWidth="3" fill="none" r="15.91549431" cx="18" cy="18" />
                    <circle strokeDasharray={`${fPercent} 100`} strokeDashoffset={`-${pPercent + cPercent}`} className="stroke-secondary" strokeWidth="3" fill="none" r="15.91549431" cx="18" cy="18" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <span className="block font-headline font-medium text-3xl text-on-background dark:text-stone-100">{Math.round(total)}g</span>
                        <span className="block text-[0.6rem] uppercase tracking-[0.2em] text-tertiary dark:text-ouro-suave font-extrabold">total macros</span>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-6 w-full">
                {[
                    { valor: protein, rotulo: 'Proteína', cor: 'text-primary' },
                    { valor: carbs, rotulo: 'Carbo', cor: 'text-tertiary' },
                    { valor: fat, rotulo: 'Gordura', cor: 'text-secondary' },
                ].map((m) => (
                    <div key={m.rotulo} className="text-center">
                        <div className={`font-headline font-medium text-lg ${m.cor}`}>{Math.round(m.valor)}g</div>
                        <div className="text-[0.6rem] uppercase tracking-[0.14em] text-on-surface-variant dark:text-stone-500 font-extrabold">{m.rotulo}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Bloco de macros (100g ou porção) reutilizado nas duas colunas
function MacroGrid({ food, factor, tone }: { food: FoodResult; factor: number; tone: 'neutro' | 'destaque' }) {
    const rotuloCls = tone === 'destaque'
        ? 'text-[0.6rem] font-extrabold text-primary/70 uppercase tracking-[0.14em]'
        : 'text-[0.6rem] font-extrabold text-on-surface-variant dark:text-stone-500 uppercase tracking-[0.14em]';
    return (
        <div className="grid grid-cols-2 gap-6">
            {[
                { valor: Math.round(food.calories * factor), rotulo: 'Kcal', cor: 'text-primary' },
                { valor: `${Math.round(food.protein * factor)}g`, rotulo: 'Proteína', cor: 'text-primary' },
                { valor: `${Math.round(food.carbs * factor)}g`, rotulo: 'Carbo', cor: 'text-tertiary' },
                { valor: `${Math.round(food.fat * factor)}g`, rotulo: 'Gordura', cor: 'text-secondary' },
            ].map((m) => (
                <div key={m.rotulo}>
                    <div className={`font-headline font-medium text-3xl ${m.cor}`}>{m.valor}</div>
                    <div className={rotuloCls}>{m.rotulo}</div>
                </div>
            ))}
        </div>
    );
}

export const FoodDetailPanel: React.FC<Props> = ({ food, onBack }) => {
    const [iaInsight, setIaInsight] = useState<string | null>(null);
    const [iaLoading, setIaLoading] = useState(false);

    const consultarArtigos = async () => {
        const msg = `Quais as principais evidências científicas e benefícios para a saúde do consumo de ${food.name}? Resuma de forma profissional e direta.`;
        setIaLoading(true);
        setIaInsight(null);
        try {
            const res = await fetch('/api/nutrition/chat-articles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...deviceHeaders() },
                body: JSON.stringify({ message: msg })
            });
            const data = await res.json();
            setIaInsight(data.answer || 'Sem resultados disponíveis no momento.');
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Erro ao consultar base de artigos.';
            setIaInsight(`⚠️ ${errorMsg}`);
        } finally {
            setIaLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white dark:bg-stone-900 rounded-[32px] overflow-hidden max-w-7xl mx-auto shadow-float-2"
        >
            <div className="p-6 md:p-10 flex flex-col lg:flex-row gap-12">
                {/* Coluna esquerda: imagem e ações */}
                <div className="lg:w-1/3 flex flex-col gap-6">
                    <button
                        onClick={onBack}
                        data-cursor="Voltar"
                        className="inline-flex items-center gap-2 text-on-surface-variant dark:text-stone-400 hover:text-primary font-extrabold text-[0.68rem] uppercase tracking-[0.22em] transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Voltar aos resultados
                    </button>

                    <div className="aspect-square rounded-[28px] bg-creme-2 dark:bg-stone-800 flex items-center justify-center overflow-hidden p-8">
                        {food.image ? (
                            <img src={food.image} alt={food.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                        ) : (
                            <Apple className="w-20 h-20 text-ouro-suave/40" />
                        )}
                    </div>

                    <div className="space-y-3">
                        <button
                            disabled
                            title="Em breve: visão detalhada de vitaminas e minerais"
                            className="w-full py-3.5 rounded-full border border-surface-variant dark:border-stone-700 text-on-surface-variant/60 dark:text-stone-500 font-semibold flex items-center justify-center gap-2 cursor-not-allowed text-sm"
                        >
                            <Info className="w-4 h-4" />
                            Micronutrientes (em breve)
                        </button>
                        <button
                            onClick={consultarArtigos}
                            disabled={iaLoading}
                            data-cursor="Artigos"
                            className="w-full py-3.5 rounded-full bg-verde-profundo dark:bg-emerald-500 text-background dark:text-stone-950 font-semibold flex items-center justify-center gap-2 text-sm shadow-float-1 hover:shadow-float-2 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-60"
                        >
                            <BookOpen className="w-4 h-4" />
                            {iaLoading ? 'Consultando…' : 'O que dizem os estudos'}
                        </button>
                        <AnimatePresence>
                            {iaInsight && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="p-5 bg-creme-2 dark:bg-stone-800 rounded-[20px] text-sm leading-relaxed"
                                >
                                    <p className="text-[0.62rem] uppercase tracking-[0.22em] text-tertiary dark:text-ouro-suave font-extrabold mb-2">Resumo dos artigos</p>
                                    <p className="text-on-surface-variant dark:text-stone-300 font-light">{iaInsight}</p>
                                    <button
                                        onClick={() => setIaInsight(null)}
                                        className="mt-3 text-[0.62rem] uppercase tracking-[0.22em] text-on-surface-variant dark:text-stone-500 hover:text-primary transition-colors font-extrabold"
                                    >
                                        Fechar
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Coluna direita: dados */}
                <div className="flex-1 space-y-10">
                    <div className="flex items-start justify-between gap-6">
                        <div>
                            <h3 className="font-headline font-medium text-3xl md:text-4xl text-on-background dark:text-stone-100 leading-tight mb-2">{food.name}</h3>
                            <p className="text-[0.72rem] text-on-surface-variant dark:text-stone-500 uppercase tracking-[0.22em] font-extrabold">{food.brand || 'Produto genérico'}</p>
                        </div>
                        {food.nutriscore && (
                            <div className="px-6 py-4 bg-creme-2 dark:bg-stone-800 rounded-[20px] text-center shrink-0">
                                <div className="text-[0.6rem] font-extrabold text-on-surface-variant dark:text-stone-500 uppercase tracking-[0.18em] mb-1">NutriScore</div>
                                <div className={`font-headline font-medium text-3xl ${
                                    food.nutriscore === 'A' || food.nutriscore === 'B' ? 'text-primary' :
                                    food.nutriscore === 'C' ? 'text-tertiary' : 'text-error'
                                }`}>{food.nutriscore}</div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-8">
                            <div className="rounded-[28px] p-8 border border-surface-variant dark:border-stone-700">
                                <h4 className="text-[0.62rem] font-extrabold text-tertiary dark:text-ouro-suave uppercase tracking-[0.26em] mb-6">Por 100 g/ml</h4>
                                <MacroGrid food={food} factor={1} tone="neutro" />
                            </div>

                            {food.servingSize && (
                                <div className="rounded-[28px] p-8 bg-verde-nevoa/60 dark:bg-emerald-900/20">
                                    <h4 className="text-[0.62rem] font-extrabold text-primary uppercase tracking-[0.26em] mb-6">
                                        Porção sugerida ({food.servingSize}{food.servingUnit})
                                    </h4>
                                    <MacroGrid food={food} factor={food.servingSize / 100} tone="destaque" />
                                </div>
                            )}
                        </div>

                        <div className="rounded-[28px] p-8 border border-surface-variant dark:border-stone-700 flex flex-col items-center justify-center">
                            <MacroChart protein={food.protein} carbs={food.carbs} fat={food.fat} />
                            <p className="mt-6 text-[0.62rem] text-on-surface-variant/70 dark:text-stone-500 text-center leading-relaxed">
                                Valores médios aproximados. Podem variar conforme marca e preparo.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
