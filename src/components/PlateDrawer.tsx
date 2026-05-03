import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, X, Trash2, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';
import { usePlate } from '../context/PlateContext';
import { PlateAnalysis } from './PlateAnalysis';

// ═══════════════════════════════════════════════════
//  PLATE DRAWER — Painel flutuante de montagem de prato
//  Integrado com PlateAnalysis para análise nutricional.
// ═══════════════════════════════════════════════════

const PlateDrawer: React.FC = () => {
    const { items, removeItem, updateQuantity, clearPlate, totals, isOpen: isExpanded, setIsOpen: setIsExpanded } = usePlate();
    const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);

    if (items.length === 0 && !isExpanded) return null;

    return (
        <>
            <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            className="antigravity-glass w-[400px] mb-4 overflow-hidden rounded-[2.5rem] shadow-2xl border-white/60"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-white/40">
                                <div>
                                    <h3 className="font-headline font-bold text-xl text-on-background tracking-tight">Seu Prato</h3>
                                    <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">{items.length} itens adicionados</p>
                                </div>
                                <button 
                                    onClick={() => setIsExpanded(false)}
                                    data-cursor="Fechar"
                                    aria-label="Fechar Painel"
                                    title="Fechar Painel"
                                    className="w-10 h-10 rounded-full bg-white border border-stone-100 flex items-center justify-center hover:bg-stone-50 transition-colors shadow-sm"
                                >
                                    <X className="w-5 h-5 text-stone-400" />
                                </button>
                            </div>

                            {/* Items List */}
                            <div className="max-h-[350px] overflow-y-auto p-4 space-y-3">
                                {items.map((item) => (
                                    <div key={item.id} className="bg-white/60 rounded-2xl p-4 border border-white/40 group relative">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="pr-8">
                                                <h4 className="font-bold text-sm text-on-background line-clamp-1">{item.name}</h4>
                                                <p className="text-[10px] text-stone-400 font-medium uppercase tracking-tight">{item.brand || 'Genérico'}</p>
                                            </div>
                                            <button 
                                                onClick={() => removeItem(item.id)}
                                                data-cursor="Remover"
                                                aria-label="Remover ingrediente"
                                                title="Remover ingrediente"
                                                className="w-8 h-8 rounded-lg bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-stone-100">
                                                <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 10))} data-cursor="Diminuir" aria-label="Diminuir quantidade" title="Diminuir quantidade" className="text-stone-300 hover:text-primary transition-colors"><ChevronDown className="w-4 h-4" /></button>
                                                <span className="text-sm font-black text-on-background w-12 text-center">{item.quantity}{item.unit}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 10)} data-cursor="Aumentar" aria-label="Aumentar quantidade" title="Aumentar quantidade" className="text-stone-300 hover:text-primary transition-colors"><ChevronUp className="w-4 h-4" /></button>
                                            </div>
                                            <div className="text-right">
                                                <span className="block text-sm font-bold text-primary">{Math.round(item.calories * (item.unit === 'g' ? item.quantity / 100 : item.quantity))} kcal</span>
                                                <span className="text-[9px] text-stone-400 font-medium uppercase">Total Item</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Totals Summary */}
                            <div className="p-6 bg-primary/[0.02] border-t border-stone-100 space-y-4">
                                <div className="grid grid-cols-4 gap-2">
                                    {[
                                        { label: 'Prot', value: totals.protein, color: 'text-primary' },
                                        { label: 'Carb', value: totals.carbs, color: 'text-amber-500' },
                                        { label: 'Gord', value: totals.fat, color: 'text-rose-400' },
                                        { label: 'Kcal', value: totals.calories, color: 'text-on-background' }
                                    ].map((stat) => (
                                        <div key={stat.label} className="text-center p-2 rounded-xl bg-white border border-stone-50 shadow-sm">
                                            <span className="block text-[8px] uppercase tracking-widest text-stone-400 font-bold mb-1">{stat.label}</span>
                                            <span className={`block text-xs font-black ${stat.color}`}>{Math.round(stat.value)}{stat.label === 'Kcal' ? '' : 'g'}</span>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="flex gap-3">
                                    <button 
                                        onClick={clearPlate}
                                        data-cursor="Limpar"
                                        aria-label="Limpar prato"
                                        title="Limpar prato"
                                        className="flex-1 py-4 text-xs font-bold text-stone-400 uppercase tracking-widest hover:text-red-400 transition-colors"
                                    >
                                        Limpar Prato
                                    </button>
                                    <button
                                        onClick={() => setIsAnalysisOpen(true)}
                                        data-cursor="Analisar"
                                        disabled={items.length === 0}
                                        className="flex-[2] py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        <span>Analisar Refeição</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Bubble Trigger */}
                <motion.button
                    layout
                    onClick={() => setIsExpanded(!isExpanded)}
                    data-cursor={isExpanded ? "Fechar" : "Abrir Prato"}
                    aria-label={isExpanded ? "Fechar resumo do prato" : "Abrir resumo do prato"}
                    title={isExpanded ? "Fechar resumo do prato" : "Abrir resumo do prato"}
                    className={`relative group flex items-center gap-3 p-4 h-20 rounded-[2.5rem] shadow-2xl transition-all ${
                        isExpanded ? 'bg-on-background text-white' : 'antigravity-glass border-white/60'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                        isExpanded ? 'bg-white/10' : 'bg-primary text-white shadow-lg shadow-primary/20'
                    }`}>
                        <Utensils className="w-6 h-6" />
                    </div>
                    
                    {!isExpanded && (
                        <div className="pr-4">
                            <span className="block text-xl font-headline font-bold text-primary leading-none mb-1">{Math.round(totals.calories)}</span>
                            <span className="text-[9px] uppercase tracking-widest text-stone-400 font-black">kcal no prato</span>
                        </div>
                    )}

                    {/* Badge */}
                    {items.length > 0 && !isExpanded && (
                        <div className="absolute -top-2 -right-2 w-7 h-7 bg-on-background text-white rounded-full flex items-center justify-center text-[10px] font-black border-4 border-[#fafaf8]">
                            {items.length}
                        </div>
                    )}
                </motion.button>
            </div>

            {/* Modal de Análise */}
            <PlateAnalysis
                isOpen={isAnalysisOpen}
                onClose={() => setIsAnalysisOpen(false)}
            />
        </>
    );
};
export default PlateDrawer;
