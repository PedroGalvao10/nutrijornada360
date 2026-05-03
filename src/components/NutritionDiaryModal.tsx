import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Activity, ChevronRight, Clock, Trash2, Loader2, BookOpen } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

interface Plate {
    id: number;
    timestamp: string;
    total_calories: number;
    total_protein: number;
    total_carbs: number;
    total_fat: number;
    items: any[];
}

export const NutritionDiaryModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const [plates, setPlates] = useState<Plate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPlate, setSelectedPlate] = useState<Plate | null>(null);

    const fetchPlates = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/nutrition/plates');
            const data = await response.json();
            setPlates(data);
        } catch (err) {
            console.error('Erro ao buscar diário:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchPlates();
        }
    }, [isOpen]);

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }).format(date);
    };

    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-white/80 backdrop-blur-2xl"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="w-full max-w-5xl h-full max-h-[85vh] bg-white border border-stone-200 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-8 md:p-12 flex items-center justify-between border-b border-stone-100">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center border border-secondary/20">
                                    <BookOpen className="w-8 h-8 text-secondary" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-headline font-black text-on-surface tracking-tight">Meu Diário</h2>
                                    <p className="text-on-surface-variant/60 font-light">Histórico de nutrição e acompanhamento metabólico.</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-12 h-12 rounded-full hover:bg-stone-100 transition-colors flex items-center justify-center group"
                            >
                                <X className="w-6 h-6 text-stone-400 group-hover:text-stone-600 transition-colors" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-8 md:p-12">
                            {isLoading ? (
                                <div className="h-full flex flex-col items-center justify-center gap-4 text-stone-400">
                                    <Loader2 className="w-10 h-10 animate-spin text-secondary" />
                                    <p className="font-light tracking-widest uppercase text-xs">Sincronizando dados...</p>
                                </div>
                            ) : plates.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto gap-6">
                                    <div className="w-24 h-24 rounded-full bg-stone-50 flex items-center justify-center border border-stone-100">
                                        <Calendar className="w-10 h-10 text-stone-200" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-headline font-bold text-stone-600 mb-2">Seu diário está vazio</h3>
                                        <p className="text-stone-400 font-light">Use a calculadora de prato para registrar suas refeições e começar seu acompanhamento.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {plates.map((plate) => (
                                        <motion.div
                                            key={plate.id}
                                            layoutId={`plate-${plate.id}`}
                                            onClick={() => setSelectedPlate(plate)}
                                            className="group bg-[#fafaf8] border border-stone-200/60 rounded-[2.5rem] p-8 hover:bg-white hover:border-secondary/20 hover:shadow-xl hover:shadow-secondary/5 transition-all cursor-pointer"
                                        >
                                            <div className="flex justify-between items-start mb-6">
                                                <div>
                                                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-stone-200 text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-3">
                                                        <Clock className="w-3 h-3" />
                                                        {formatTime(plate.timestamp)}
                                                    </span>
                                                    <h4 className="text-xl font-headline font-bold text-on-surface">{formatDate(plate.timestamp)}</h4>
                                                </div>
                                                <div className="w-12 h-12 rounded-2xl bg-white border border-stone-100 flex items-center justify-center group-hover:bg-secondary/10 group-hover:border-secondary/20 transition-all">
                                                    <ChevronRight className="w-6 h-6 text-stone-300 group-hover:text-secondary" />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-4 gap-2">
                                                <div className="p-3 bg-white rounded-2xl border border-stone-100 text-center">
                                                    <span className="block text-[8px] uppercase text-stone-400 font-bold mb-1">Cal</span>
                                                    <span className="block text-sm font-black text-on-surface">{Math.round(plate.total_calories)}</span>
                                                </div>
                                                <div className="p-3 bg-white rounded-2xl border border-stone-100 text-center">
                                                    <span className="block text-[8px] uppercase text-stone-400 font-bold mb-1">Prot</span>
                                                    <span className="block text-sm font-black text-primary">{Math.round(plate.total_protein)}g</span>
                                                </div>
                                                <div className="p-3 bg-white rounded-2xl border border-stone-100 text-center">
                                                    <span className="block text-[8px] uppercase text-stone-400 font-bold mb-1">Carb</span>
                                                    <span className="block text-sm font-black text-amber-600">{Math.round(plate.total_carbs)}g</span>
                                                </div>
                                                <div className="p-3 bg-white rounded-2xl border border-stone-100 text-center">
                                                    <span className="block text-[8px] uppercase text-stone-400 font-bold mb-1">Gord</span>
                                                    <span className="block text-sm font-black text-rose-500">{Math.round(plate.total_fat)}g</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {/* Detailed View Overlay */}
            {selectedPlate && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-10 bg-black/5 backdrop-blur-md">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-2xl bg-white border border-stone-200 rounded-[3rem] shadow-2xl p-10 relative"
                    >
                        <button 
                            onClick={() => setSelectedPlate(null)}
                            className="absolute top-8 right-8 w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center border border-stone-100 hover:bg-stone-100"
                        >
                            <X className="w-5 h-5 text-stone-400" />
                        </button>

                        <div className="mb-10">
                            <h3 className="text-3xl font-headline font-black mb-2">Detalhes da Refeição</h3>
                            <p className="text-stone-400 font-light">{formatDate(selectedPlate.timestamp)} às {formatTime(selectedPlate.timestamp)}</p>
                        </div>

                        <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-4 custom-scrollbar">
                            {selectedPlate.items.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center p-5 bg-[#fafaf8] rounded-2xl border border-stone-100">
                                    <div>
                                        <h5 className="font-bold text-on-surface">{item.name}</h5>
                                        <p className="text-xs text-stone-400">{item.amount}g • {Math.round(item.calories)} kcal</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="text-right">
                                            <span className="block text-[10px] font-bold text-primary uppercase">P</span>
                                            <span className="text-xs font-medium">{Math.round(item.protein)}g</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-[10px] font-bold text-amber-600 uppercase">C</span>
                                            <span className="text-xs font-medium">{Math.round(item.carbs)}g</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-[10px] font-bold text-rose-500 uppercase">G</span>
                                            <span className="text-xs font-medium">{Math.round(item.fat)}g</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 pt-10 border-t border-stone-100 flex justify-between items-center">
                             <div>
                                 <span className="block text-xs text-stone-400 uppercase tracking-widest mb-1">Total de Calorias</span>
                                 <span className="text-4xl font-black text-on-surface">{Math.round(selectedPlate.total_calories)}<span className="text-sm ml-1 text-stone-400 uppercase">kcal</span></span>
                             </div>
                             <button 
                                onClick={() => setSelectedPlate(null)}
                                className="px-10 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                             >
                                Fechar
                             </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
