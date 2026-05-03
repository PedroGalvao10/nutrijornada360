import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ChevronUp, ChevronDown, Sparkles, Activity, Apple, Scale } from 'lucide-react';
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

    // Bloquear scroll do body quando aberto
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed inset-0 z-[200] bg-white/80 backdrop-blur-2xl flex flex-col overflow-hidden font-body"
                >
                    {/* Background Decorative Elements */}
                    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
                        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[120px]" />
                    </div>

                    {/* Header: Design Apple Premium */}
                    <header className="relative z-20 flex-shrink-0 px-8 py-6 md:px-12 md:py-8 flex justify-between items-center bg-white/40 border-b border-stone-100">
                        <div className="flex items-center gap-6">
                            <motion.div 
                                initial={{ rotate: -10 }}
                                animate={{ rotate: 0 }}
                                className="w-14 h-14 md:w-16 md:h-16 bg-primary rounded-3xl flex items-center justify-center text-white shadow-xl shadow-primary/20"
                            >
                                <Scale className="w-7 h-7 md:w-8 md:h-8" />
                            </motion.div>
                            <div>
                                <h2 className="text-2xl md:text-4xl font-headline font-bold text-on-background tracking-tight leading-none">Calculadora de Prato</h2>
                                <p className="text-stone-400 font-medium text-xs md:text-sm mt-1">Engenharia Nutricional com Precisão Biológica</p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            data-cursor="Fechar"
                            aria-label="Fechar Calculadora"
                            title="Fechar Calculadora"
                            className="w-12 h-12 md:w-14 md:h-14 bg-stone-100 text-stone-500 rounded-full flex items-center justify-center hover:bg-stone-200 transition-all active:scale-90 shadow-sm"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </header>

                    {/* Main Content: Split layout */}
                    <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar">
                        <div className="max-w-[1800px] mx-auto px-6 py-8 md:py-12 flex flex-col lg:flex-row gap-10 md:gap-16">
                            
                            {/* Left Column: NutriSearch */}
                            <div className="flex-[1.4] xl:flex-[1.6]">
                                <div className="mb-10">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-100 text-stone-500 font-bold text-[10px] uppercase tracking-widest mb-4">
                                        Passo 01
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-headline font-bold text-on-background mb-3">Composição da Refeição</h3>
                                    <p className="text-stone-500 font-light max-w-xl">Utilize nossa base de dados profissional para buscar alimentos e construir seu prato ideal em tempo real.</p>
                                </div>
                                
                                <div className="bg-white/50 rounded-[3rem] p-1 md:p-2 border border-white shadow-inner">
                                    <NutriSearch />
                                </div>
                            </div>

                            {/* Right Column: Plate Summary */}
                            <div className="flex-1 lg:max-w-md xl:max-w-lg">
                                <div className="sticky top-0 space-y-8">
                                    <div>
                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-[10px] uppercase tracking-widest mb-4">
                                            Passo 02
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <h3 className="text-2xl md:text-3xl font-headline font-bold text-on-background mb-2">Resumo do Prato</h3>
                                                <p className="text-stone-500 font-light">{items.length} componentes selecionados</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Items List */}
                                    <div className="bg-white rounded-[3rem] border border-stone-100 shadow-2xl shadow-stone-200/40 p-6 md:p-8 overflow-hidden flex flex-col min-h-[400px] max-h-[60vh]">
                                        {items.length === 0 ? (
                                            <div className="flex-1 flex flex-col items-center justify-center py-12 text-stone-300">
                                                <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                                    <Apple className="w-10 h-10 opacity-20" />
                                                </div>
                                                <p className="font-medium text-center max-w-[240px] text-stone-400">Seu prato está aguardando os primeiros ingredientes.</p>
                                            </div>
                                        ) : (
                                            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                                                <AnimatePresence initial={false}>
                                                    {items.map((item) => (
                                                        <motion.div 
                                                            key={item.id}
                                                            initial={{ opacity: 0, x: 20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, x: -20 }}
                                                            className="bg-stone-50 rounded-[2rem] p-5 border border-stone-100 group relative hover:border-primary/20 transition-all shadow-sm"
                                                        >
                                                            <div className="flex justify-between items-start mb-4">
                                                                <div className="pr-10">
                                                                    <h4 className="font-bold text-base text-on-background line-clamp-1">{item.name}</h4>
                                                                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-0.5">{item.brand || 'Genérico'}</p>
                                                                </div>
                                                                <button 
                                                                    onClick={() => removeItem(item.id)}
                                                                    data-cursor="Remover"
                                                                    aria-label="Remover ingrediente"
                                                                    title="Remover ingrediente"
                                                                    className="w-10 h-10 rounded-xl bg-white text-stone-300 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all shadow-sm"
                                                                >
                                                                    <Trash2 className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                            
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl border border-stone-100 shadow-inner">
                                                                    <button 
                                                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 10))} 
                                                                        aria-label="Diminuir quantidade"
                                                                        title="Diminuir quantidade"
                                                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-300 hover:text-primary hover:bg-stone-50 transition-all"
                                                                    >
                                                                        <ChevronDown className="w-5 h-5" />
                                                                    </button>
                                                                    <span className="text-sm font-black text-on-background min-w-[60px] text-center">{item.quantity}{item.unit}</span>
                                                                    <button 
                                                                        onClick={() => updateQuantity(item.id, item.quantity + 10)}
                                                                        aria-label="Aumentar quantidade"
                                                                        title="Aumentar quantidade"
                                                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-300 hover:text-primary hover:bg-stone-50 transition-all"
                                                                    >
                                                                        <ChevronUp className="w-5 h-5" />
                                                                    </button>
                                                                </div>
                                                                <div className="text-right">
                                                                    <span className="block text-lg font-black text-primary">
                                                                        {Math.round(item.calories * (item.unit === 'g' ? item.quantity / 100 : item.quantity))} 
                                                                        <span className="text-[10px] ml-1 uppercase opacity-60">kcal</span>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </AnimatePresence>
                                            </div>
                                        )}
                                    </div>

                                    {/* Totals & Analysis */}
                                    <div className="bg-primary/5 rounded-[3rem] border border-primary/10 shadow-2xl shadow-primary/5 p-8 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-8 opacity-5">
                                            <Activity className="w-24 h-24" />
                                        </div>
                                        
                                        <div className="grid grid-cols-4 gap-3 mb-8 relative z-10">
                                            {[
                                                { label: 'Prot', value: totals.protein, color: 'text-primary' },
                                                { label: 'Carb', value: totals.carbs, color: 'text-amber-600' },
                                                { label: 'Gord', value: totals.fat, color: 'text-rose-500' },
                                                { label: 'Total', value: totals.calories, color: 'text-on-background', unit: 'kcal' }
                                            ].map((stat) => (
                                                <div key={stat.label} className="text-center p-4 rounded-[1.5rem] bg-white shadow-sm border border-white">
                                                    <span className="block text-[9px] uppercase tracking-widest text-stone-400 font-bold mb-1.5">{stat.label}</span>
                                                    <span className={`block text-xl font-black ${stat.color}`}>{Math.round(stat.value)}<span className="text-[10px] ml-0.5">{stat.unit || 'g'}</span></span>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <div className="flex gap-4 relative z-10">
                                            <button 
                                                onClick={clearPlate}
                                                data-cursor="Limpar"
                                                aria-label="Limpar prato"
                                                title="Limpar prato"
                                                disabled={items.length === 0}
                                                className="px-8 py-5 rounded-2xl text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] hover:text-red-500 bg-white border border-white hover:border-red-100 transition-all disabled:opacity-50"
                                            >
                                                Zerar
                                            </button>
                                            <button
                                                onClick={() => setIsAnalysisOpen(true)}
                                                data-cursor="Analisar"
                                                disabled={items.length === 0}
                                                className="flex-1 py-5 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                                            >
                                                <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                                <span className="text-xl">Analisar com IA</span>
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
