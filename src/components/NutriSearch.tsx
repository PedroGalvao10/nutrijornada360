import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Plus } from 'lucide-react';
import { useQuota } from '../hooks/useQuota';
import { NutriChatInput } from './ui/nutri-chat-input';
import { deviceHeaders } from '../lib/deviceId';
import { FoodDetailPanel } from './nutrisearch/FoodDetailPanel';
import type { FoodResult } from './nutrisearch/types';

// ============================================================
// NutriSearch — busca nutricional na direção "Editorial Orgânico".
// Orquestra busca, quota e grade de resultados; o painel de
// detalhe do alimento vive em nutrisearch/FoodDetailPanel.
// ============================================================

export const NutriSearch: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<FoodResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [source, setSource] = useState<string | null>(null);
    const [selectedFood, setSelectedFood] = useState<FoodResult | null>(null);

    // Hook centralizado de quota (elimina duplicação)
    const { remaining: remainingSearches, totalLimit, isUnlimited, limitWarning, setLimitWarning, clearLimitWarning, fetchQuota, usagePercentage, usageCount } = useQuota();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        setError(null);
        clearLimitWarning();
        setSelectedFood(null);

        try {
            const response = await fetch(`/api/nutrition/search?query=${encodeURIComponent(query)}`, { headers: deviceHeaders() });

            // Atualizar quota após busca
            fetchQuota();

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 429) {
                    setLimitWarning(data.message);
                    setResults([]);
                } else {
                    throw new Error(data.error || 'Erro na busca');
                }
            } else {
                setResults(data.results);
                setSource(data.source);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Falha de conexão. Tente novamente mais tarde.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            {/* Barra de busca */}
            <NutriChatInput
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onSubmit={handleSearch}
                isLoading={isLoading}
                placeholder="Busque alimentos, marcas ou nutrientes..."
                className="max-w-3xl mx-auto mb-12"
            />

            {/* Indicador de quota */}
            <AnimatePresence>
                {!limitWarning && remainingSearches !== null && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-2xl mx-auto mb-10"
                    >
                        <div className="flex justify-between items-end mb-2 px-1">
                            <span className="text-[0.62rem] font-extrabold text-on-surface-variant/70 dark:text-stone-500 uppercase tracking-[0.18em]">
                                {isUnlimited ? 'Acesso ilimitado (dev)' : 'Buscas gratuitas diárias'}
                            </span>
                            <span className="text-xs font-semibold text-primary dark:text-emerald-400">
                                {isUnlimited ? 'Ilimitado' : `${usageCount} de ${totalLimit}`}
                            </span>
                        </div>
                        {!isUnlimited && (
                            <div className="h-1 w-full bg-surface-variant dark:bg-stone-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${usagePercentage}%` }}
                                    className="h-full bg-ouro-suave"
                                />
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Aviso de limite atingido */}
            {limitWarning && (
                <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="mb-8">
                    <div className="bg-creme-2 dark:bg-stone-800 p-8 rounded-[28px] max-w-2xl mx-auto text-center shadow-float-1">
                        <div className="w-14 h-14 bg-verde-nevoa dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-7 h-7 text-primary dark:text-emerald-400" />
                        </div>
                        <h3 className="font-headline font-medium text-2xl text-on-background dark:text-stone-100 mb-2">Você chegou ao limite de hoje</h3>
                        <p className="text-on-surface-variant dark:text-stone-400 mb-6 max-w-md mx-auto font-light">{limitWarning}</p>
                        <a
                            href="/planos"
                            data-cursor="Ver Planos"
                            className="inline-flex items-center gap-2 px-8 py-3.5 bg-verde-profundo dark:bg-emerald-500 text-background dark:text-stone-950 font-semibold rounded-full shadow-float-1 hover:shadow-float-2 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                        >
                            Conhecer os planos
                            <span aria-hidden="true" className="material-symbols-outlined text-[17px]">arrow_forward</span>
                        </a>
                    </div>
                </motion.div>
            )}

            {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-error/5 text-error p-4 rounded-[20px] text-center mb-6 border border-error/15 max-w-2xl mx-auto font-medium">
                    {error}
                </motion.div>
            )}

            {/* Grade de resultados */}
            {!selectedFood && results.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    <div className="col-span-full flex justify-between items-center mb-2 px-1">
                        <h4 className="text-[0.62rem] font-extrabold text-tertiary dark:text-ouro-suave uppercase tracking-[0.26em]">Resultados</h4>
                        <span className="text-[0.6rem] text-on-surface-variant/70 dark:text-stone-500 font-extrabold uppercase tracking-[0.14em]">Fonte: {source}</span>
                    </div>
                    {results.map((food) => (
                        <motion.div
                            key={food.id}
                            whileHover={{ y: -6 }}
                            onClick={() => setSelectedFood(food)}
                            onKeyDown={(e) => e.key === 'Enter' && setSelectedFood(food)}
                            role="button"
                            tabIndex={0}
                            aria-label={`Ver detalhes de ${food.name}`}
                            data-cursor="Ver Detalhes"
                            className="bg-white dark:bg-stone-900 p-7 rounded-[28px] cursor-pointer border border-surface-variant dark:border-stone-800 hover:border-ouro-suave transition-colors duration-300 flex flex-col justify-between h-full group active:scale-[0.99]"
                        >
                            <div>
                                <h4 className="font-headline font-medium text-xl line-clamp-2 leading-tight mb-2 text-on-background dark:text-stone-100 group-hover:text-primary transition-colors">{food.name}</h4>
                                <p className="text-[0.62rem] font-extrabold text-on-surface-variant/70 dark:text-stone-500 uppercase tracking-[0.18em] mb-8">{food.brand || 'Marca genérica'}</p>
                            </div>

                            <div className="flex items-center justify-between border-t border-surface-variant dark:border-stone-800 pt-5 mt-auto">
                                <div className="flex gap-6">
                                    <div>
                                        <span className="block font-headline font-medium text-3xl text-primary dark:text-emerald-400">{Math.round(food.calories)}</span>
                                        <span className="text-[0.58rem] uppercase tracking-[0.14em] text-on-surface-variant/70 dark:text-stone-500 font-extrabold">kcal / 100g</span>
                                    </div>
                                    {food.servingSize && (
                                        <div className="border-l border-surface-variant dark:border-stone-800 pl-6">
                                            <span className="block font-headline font-medium text-3xl text-secondary dark:text-stone-300">
                                                {Math.round((food.calories * food.servingSize) / 100)}
                                            </span>
                                            <span className="text-[0.58rem] uppercase tracking-[0.14em] text-on-surface-variant/70 dark:text-stone-500 font-extrabold">
                                                kcal / {food.servingSize}{food.servingUnit || 'g'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="w-11 h-11 rounded-full flex items-center justify-center border border-surface-variant dark:border-stone-700 text-on-surface-variant/50 group-hover:border-ouro-suave group-hover:text-tertiary transition-colors">
                                    <Plus className="w-5 h-5" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Painel de detalhe */}
            <AnimatePresence mode="wait">
                {selectedFood && (
                    <FoodDetailPanel food={selectedFood} onBack={() => setSelectedFood(null)} />
                )}
            </AnimatePresence>
        </div>
    );
};
