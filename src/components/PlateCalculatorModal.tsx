import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';
import { usePlate } from '../context/PlateContext';
import { PlateAnalysis } from './PlateAnalysis';
import { NutriSearch } from './NutriSearch';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const PlateCalculatorModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const { items, removeItem, updateQuantity, clearPlate, totals } = usePlate();
    const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: '100%' }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed inset-0 z-[150] bg-[#fafaf8] flex flex-col overflow-hidden font-body"
                >
                    {/* Header */}
                    <div className="flex-shrink-0 p-6 md:px-10 flex justify-between items-center bg-white/80 backdrop-blur-xl border-b border-stone-100 z-20">
                        <div>
                            <h2 className="text-3xl font-headline font-bold text-on-background tracking-tight">Calculadora de Prato</h2>
                            <p className="text-stone-400 font-medium">Monte sua refeição ideal e analise os nutrientes</p>
                        </div>
                        <button 
                            onClick={onClose}
                            data-cursor="Fechar"
                            className="w-14 h-14 bg-stone-100 text-stone-500 rounded-full flex items-center justify-center hover:bg-stone-200 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Main Content: Split layout */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="container mx-auto px-6 py-10 flex flex-col lg:flex-row gap-12">
                            
                            {/* Left Column: NutriSearch */}
                            <div className="flex-[2] lg:border-r lg:border-stone-100 lg:pr-12">
                                <div className="mb-8">
                                    <h3 className="text-2xl font-headline font-bold text-on-background mb-2">1. Adicionar Alimentos</h3>
                                    <p className="text-stone-500 font-light">Busque e adicione alimentos ao seu prato para ver o cálculo em tempo real.</p>
                                </div>
                                <NutriSearch />
                            </div>

                            {/* Right Column: Plate Summary */}
                            <div className="flex-1 lg:pl-4">
                                <div className="sticky top-10">
                                    <div className="mb-8 flex justify-between items-end">
                                        <div>
                                            <h3 className="text-2xl font-headline font-bold text-on-background mb-2">2. Resumo do Prato</h3>
                                            <p className="text-stone-500 font-light">{items.length} itens adicionados</p>
                                        </div>
                                    </div>

                                    {/* Items List */}
                                    <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-xl shadow-stone-200/40 p-6 mb-8 overflow-hidden flex flex-col max-h-[500px]">
                                        {items.length === 0 ? (
                                            <div className="flex-1 flex flex-col items-center justify-center py-12 text-stone-300">
                                                <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mb-4">
                                                    <Sparkles className="w-8 h-8" />
                                                </div>
                                                <p className="font-medium text-center max-w-[200px]">Seu prato está vazio. Busque alimentos e adicione-os aqui.</p>
                                            </div>
                                        ) : (
                                            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                                {items.map((item) => (
                                                    <div key={item.id} className="bg-stone-50 rounded-2xl p-4 border border-stone-100 group relative">
                                                        <div className="flex justify-between items-start mb-3">
                                                            <div className="pr-8">
                                                                <h4 className="font-bold text-sm text-on-background line-clamp-1">{item.name}</h4>
                                                                <p className="text-[10px] text-stone-400 font-medium uppercase tracking-tight">{item.brand || 'Genérico'}</p>
                                                            </div>
                                                            <button 
                                                                onClick={() => removeItem(item.id)}
                                                                data-cursor="Remover"
                                                                className="w-8 h-8 rounded-lg bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-stone-100">
                                                                <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 10))} data-cursor="Diminuir" className="text-stone-300 hover:text-primary transition-colors"><ChevronDown className="w-4 h-4" /></button>
                                                                <span className="text-sm font-black text-on-background w-12 text-center">{item.quantity}{item.unit}</span>
                                                                <button onClick={() => updateQuantity(item.id, item.quantity + 10)} data-cursor="Aumentar" className="text-stone-300 hover:text-primary transition-colors"><ChevronUp className="w-4 h-4" /></button>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="block text-sm font-bold text-primary">{Math.round(item.calories * (item.unit === 'g' ? item.quantity / 100 : item.quantity))} kcal</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Totals & Analysis */}
                                    <div className="bg-primary/[0.03] rounded-[2.5rem] border border-stone-100 shadow-lg p-6">
                                        <div className="grid grid-cols-4 gap-3 mb-6">
                                            {[
                                                { label: 'Prot', value: totals.protein, color: 'text-primary' },
                                                { label: 'Carb', value: totals.carbs, color: 'text-amber-500' },
                                                { label: 'Gord', value: totals.fat, color: 'text-rose-400' },
                                                { label: 'Kcal', value: totals.calories, color: 'text-on-background' }
                                            ].map((stat) => (
                                                <div key={stat.label} className="text-center p-3 rounded-2xl bg-white shadow-sm border border-stone-50">
                                                    <span className="block text-[9px] uppercase tracking-widest text-stone-400 font-bold mb-1">{stat.label}</span>
                                                    <span className={`block text-lg font-black ${stat.color}`}>{Math.round(stat.value)}{stat.label === 'Kcal' ? '' : 'g'}</span>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <div className="flex gap-4">
                                            <button 
                                                onClick={clearPlate}
                                                data-cursor="Limpar"
                                                disabled={items.length === 0}
                                                className="px-6 py-4 rounded-2xl text-xs font-bold text-stone-400 uppercase tracking-widest hover:text-red-400 bg-white border border-stone-100 hover:border-red-100 transition-colors disabled:opacity-50"
                                            >
                                                Limpar
                                            </button>
                                            <button
                                                onClick={() => setIsAnalysisOpen(true)}
                                                data-cursor="Analisar"
                                                disabled={items.length === 0}
                                                className="flex-1 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Sparkles className="w-5 h-5" />
                                                <span className="text-lg">Analisar Refeição</span>
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
            
            {/* Analysis Overlay */}
            <PlateAnalysis
                isOpen={isAnalysisOpen}
                onClose={() => setIsAnalysisOpen(false)}
            />
        </AnimatePresence>
    );
};
