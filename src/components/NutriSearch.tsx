import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, AlertCircle, Info, Crown, Plus, ChevronLeft, Apple, CheckCircle2 } from 'lucide-react';
import { usePlate } from '../context/PlateContext';

interface FoodResult {
    id: string;
    name: string;
    brand: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    servingSize?: number | null;
    servingUnit?: string;
    image?: string;
    nutriscore?: string;
}

export const NutriSearch: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<FoodResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [source, setSource] = useState<string | null>(null);
    const [selectedFood, setSelectedFood] = useState<FoodResult | null>(null);

    // Limit Tracking States
    const [limitWarning, setLimitWarning] = useState<string | null>(null);
    const [remainingSearches, setRemainingSearches] = useState<number | null>(null);

    const { addItem } = usePlate();
    const [addFeedback, setAddFeedback] = useState<string | null>(null);

    const handleAddToPlate = (food: FoodResult, e: React.MouseEvent) => {
        e.stopPropagation();
        addItem({
            id: food.id,
            name: food.name,
            brand: food.brand,
            calories: food.calories,
            protein: food.protein,
            carbs: food.carbs,
            fat: food.fat
        }, 100, 'g');
        
        setAddFeedback(food.id.toString());
        setTimeout(() => setAddFeedback(null), 2000);
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        setError(null);
        setLimitWarning(null);
        setSelectedFood(null);

        try {
            const response = await fetch(`http://localhost:3001/api/nutrition/search?query=${encodeURIComponent(query)}`);
            
            const remaining = response.headers.get('X-RateLimit-Remaining');
            if (remaining !== null) {
                setRemainingSearches(parseInt(remaining, 10));
            }

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
        } catch (err: any) {
            setError(err.message || 'Falha de conexão. Tente novamente mais tarde.');
        } finally {
            setIsLoading(false);
        }
    };

    const MacroChart = ({ protein, carbs, fat }: { protein: number, carbs: number, fat: number }) => {
        const total = protein + carbs + fat;
        if (total === 0) return <div className="text-on-surface-variant text-sm italic">Sem dados de macros</div>;

        const pPercent = (protein / total) * 100;
        const cPercent = (carbs / total) * 100;
        const fPercent = (fat / total) * 100;

        const pDash = `${pPercent} 100`;
        const cDash = `${cPercent} 100`;
        const fDash = `${fPercent} 100`;

        return (
            <div className="flex flex-col items-center">
                <div className="relative w-40 h-40 mb-6 group">
                    <div className="absolute inset-0 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all" />
                    <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90 relative z-10">
                        <circle strokeDasharray={pDash} strokeDashoffset="0" className="stroke-primary" strokeWidth="3" fill="none" r="15.91549431" cx="18" cy="18" />
                        <circle strokeDasharray={cDash} strokeDashoffset={`-${pPercent}`} className="stroke-tertiary" strokeWidth="3" fill="none" r="15.91549431" cx="18" cy="18" />
                        <circle strokeDasharray={fDash} strokeDashoffset={`-${pPercent + cPercent}`} className="stroke-secondary" strokeWidth="3" fill="none" r="15.91549431" cx="18" cy="18" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="text-center">
                            <span className="block text-3xl font-bold text-on-background">{Math.round(total)}g</span>
                            <span className="block text-[10px] uppercase tracking-[0.2em] text-tertiary font-bold">Total Macros</span>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-6 w-full">
                    <div className="text-center">
                        <div className="text-primary font-bold text-lg">{Math.round(protein)}g</div>
                        <div className="text-[10px] uppercase text-tertiary/60 font-bold">Proteína</div>
                    </div>
                    <div className="text-center border-x border-tertiary/10">
                        <div className="text-tertiary font-bold text-lg">{Math.round(carbs)}g</div>
                        <div className="text-[10px] uppercase text-tertiary/60 font-bold">Carbo</div>
                    </div>
                    <div className="text-center">
                        <div className="text-secondary font-bold text-lg">{Math.round(fat)}g</div>
                        <div className="text-[10px] uppercase text-tertiary/60 font-bold">Gordura</div>
                    </div>
                </div>
            </div>
        );
    };


    return (
        <div className="w-full">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative w-full max-w-2xl mx-auto mb-16 group">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Busque alimentos, marcas ou nutrientes..."
                    data-cursor="Buscar"
                    className="w-full bg-white/40 backdrop-blur-2xl border border-white/40 rounded-3xl py-6 pl-8 pr-16 text-on-background placeholder-stone-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all shadow-xl shadow-stone-200/20 group-hover:shadow-stone-200/40 text-lg font-light tracking-tight"
                />
                <button 
                    type="submit" 
                    disabled={isLoading}
                    data-cursor="Buscar"
                    className="absolute right-3 top-3 bottom-3 aspect-square bg-primary text-white rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                </button>
            </form>

            {/* Status Bars */}
            <AnimatePresence>
                {remainingSearches !== null && remainingSearches <= 2 && remainingSearches > 0 && !limitWarning && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6">
                        <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-xl flex items-center gap-3 max-w-2xl mx-auto shadow-sm">
                            <Info className="w-5 h-5 flex-shrink-0 text-amber-500" />
                            <p className="text-sm font-medium">Você tem apenas <strong>{remainingSearches} buscas gratuitas</strong> restantes hoje.</p>
                        </div>
                    </motion.div>
                )}

                {limitWarning && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-8">
                        <div className="bg-primary/5 border border-primary/20 p-8 rounded-3xl max-w-2xl mx-auto text-center shadow-xl shadow-primary/5">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold text-on-background mb-2">Acesso Premium Necessário</h3>
                            <p className="text-tertiary/80 mb-6 max-w-md mx-auto">{limitWarning}</p>
                            <a href="/planos" data-cursor="Premium" className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white font-bold rounded-2xl hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                                <Crown className="w-4 h-4" />
                                Liberar Acesso Premium
                            </a>
                        </div>
                    </motion.div>
                )}

                {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 text-red-600 p-4 rounded-xl text-center mb-6 border border-red-100 max-w-2xl mx-auto font-medium">
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results Grid */}
            {!selectedFood && results.length > 0 && (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    <div className="col-span-full flex justify-between items-center mb-4 px-2">
                        <h4 className="text-xs font-bold text-stone-400 uppercase tracking-[0.2em]">Encontrados</h4>
                        <span className="text-[10px] text-stone-400 font-bold bg-white px-3 py-1 rounded-full border border-stone-100 uppercase tracking-tight">Fonte: {source}</span>
                    </div>
                    {results.map((food) => (
                        <motion.div 
                            key={food.id}
                            whileHover={{ y: -8 }}
                            onClick={() => setSelectedFood(food)}
                            data-cursor="Ver Detalhes"
                            className="antigravity-glass p-8 rounded-[2.5rem] cursor-pointer border-white/60 hover:border-primary/20 transition-all flex flex-col justify-between h-full group active:scale-[0.98] shadow-lg shadow-stone-200/30"
                        >
                            <div>
                                <h4 className="font-headline font-bold text-xl line-clamp-2 leading-tight mb-2 text-on-background group-hover:text-primary transition-colors tracking-tight">{food.name}</h4>
                                <p className="text-xs font-medium text-stone-400 uppercase tracking-widest mb-8">{food.brand || 'Marca Genérica'}</p>
                            </div>
                            
                            <div className="flex items-center justify-between border-t border-stone-100 pt-6 mt-auto">
                                <div className="flex gap-6">
                                    <div>
                                        <span className="block text-3xl font-bold text-primary tracking-tighter">{Math.round(food.calories)}</span>
                                        <span className="text-[10px] uppercase tracking-widest text-stone-400 font-black">kcal / 100g</span>
                                    </div>
                                    {food.servingSize && (
                                        <div className="border-l border-stone-100 pl-6">
                                            <span className="block text-3xl font-bold text-secondary tracking-tighter">
                                                {Math.round((food.calories * food.servingSize) / 100)}
                                            </span>
                                            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-black">
                                                kcal / {food.servingSize}{food.servingUnit || 'g'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div 
                                    onClick={(e) => handleAddToPlate(food, e)}
                                    data-cursor="Adicionar"
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border ${
                                        addFeedback === food.id.toString() 
                                        ? 'bg-primary text-white border-primary' 
                                        : 'bg-stone-50 text-stone-300 group-hover:bg-primary/5 group-hover:text-primary border-stone-100'
                                    }`}
                                >
                                    {addFeedback === food.id.toString() ? <CheckCircle2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Selected Food Detail View */}
            <AnimatePresence mode="wait">
                {selectedFood && (
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="bg-white border border-tertiary/10 rounded-[3rem] overflow-hidden max-w-7xl mx-auto shadow-2xl shadow-primary/5"
                    >
                        <div className="p-4 md:p-10 flex flex-col lg:flex-row gap-12">
                            {/* Left Column: Visuals & Actions */}
                            <div className="lg:w-1/3 flex flex-col gap-8">
                                <button 
                                    onClick={() => setSelectedFood(null)}
                                    data-cursor="Voltar"
                                    className="inline-flex items-center gap-2 text-tertiary/60 hover:text-primary font-bold text-xs uppercase tracking-widest transition-colors mb-2"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Voltar
                                </button>

                                <div className="aspect-square rounded-[2.5rem] bg-gradient-to-br from-white to-tertiary/5 border border-tertiary/10 flex items-center justify-center overflow-hidden p-8 shadow-inner">
                                    {selectedFood.image ? (
                                        <img src={selectedFood.image} alt={selectedFood.name} className="w-full h-full object-contain mix-blend-multiply" />
                                    ) : (
                                        <Apple className="w-20 h-20 text-tertiary/20" />
                                    ) }
                                </div>

                                <div className="space-y-3">
                                    <button 
                                        onClick={(e) => handleAddToPlate(selectedFood, e)}
                                        data-cursor="Adicionar"
                                        className="w-full py-5 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20"
                                    >
                                        <Plus className="w-5 h-5" />
                                        Adicionar ao Prato
                                    </button>
                                    <button data-cursor="Informação" className="w-full py-4 bg-tertiary/5 text-tertiary rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-tertiary/10 transition-colors text-sm">
                                        <Info className="w-4 h-4" />
                                        Ver Detalhes Micronutrientes
                                    </button>
                                </div>
                            </div>

                            {/* Right Column: Data */}
                            <div className="flex-1 space-y-10">
                                <div>
                                    <div className="flex items-start justify-between gap-6 mb-6">
                                        <div>
                                            <h3 className="text-4xl md:text-5xl font-headline font-bold text-on-background leading-tight mb-3 tracking-tight">{selectedFood.name}</h3>
                                            <p className="text-lg text-stone-400 font-light uppercase tracking-[0.3em]">{selectedFood.brand || 'Produto Genérico'}</p>
                                        </div>
                                        {selectedFood.nutriscore && (
                                            <div className="px-8 py-5 bg-white rounded-[2rem] border border-stone-100 text-center shadow-sm">
                                                <div className="text-[10px] font-bold text-stone-300 uppercase tracking-widest mb-1">NutriScore</div>
                                                <div className={`text-4xl font-bold ${
                                                    selectedFood.nutriscore === 'A' || selectedFood.nutriscore === 'B' ? 'text-primary' :
                                                    selectedFood.nutriscore === 'C' ? 'text-amber-500' : 'text-red-400'
                                                }`}>{selectedFood.nutriscore}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-8">
                                        {/* Por 100g */}
                                        <div className="bg-white/50 backdrop-blur-sm rounded-[2rem] p-8 border border-tertiary/10">
                                            <h4 className="text-xs font-black text-tertiary/40 uppercase tracking-[0.3em] mb-6">Padrão 100g/ml</h4>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div>
                                                    <div className="text-3xl font-black text-primary">{Math.round(selectedFood.calories)}</div>
                                                    <div className="text-[10px] font-bold text-tertiary/60 uppercase tracking-widest">Kcal</div>
                                                </div>
                                                <div>
                                                    <div className="text-3xl font-black text-primary">{Math.round(selectedFood.protein)}g</div>
                                                    <div className="text-[10px] font-bold text-tertiary/60 uppercase tracking-widest">Proteína</div>
                                                </div>
                                                <div>
                                                    <div className="text-3xl font-black text-tertiary">{Math.round(selectedFood.carbs)}g</div>
                                                    <div className="text-[10px] font-bold text-tertiary/60 uppercase tracking-widest">Carbo</div>
                                                </div>
                                                <div>
                                                    <div className="text-3xl font-black text-secondary">{Math.round(selectedFood.fat)}g</div>
                                                    <div className="text-[10px] font-bold text-tertiary/60 uppercase tracking-widest">Gordura</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Por Porção */}
                                        {selectedFood.servingSize && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10 }} 
                                                animate={{ opacity: 1, y: 0 }} 
                                                transition={{ delay: 0.2 }}
                                                className="bg-primary/5 rounded-[2rem] p-8 border border-primary/20 relative overflow-hidden"
                                            >
                                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                                    <Crown className="w-12 h-12 text-primary" />
                                                </div>
                                                <h4 className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                                    Porção Sugerida ({selectedFood.servingSize}{selectedFood.servingUnit})
                                                </h4>
                                                <div className="grid grid-cols-2 gap-6 relative z-10">
                                                    <div>
                                                        <div className="text-3xl font-black text-primary">{Math.round((selectedFood.calories * selectedFood.servingSize) / 100)}</div>
                                                        <div className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">Kcal</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-3xl font-black text-primary">{Math.round((selectedFood.protein * selectedFood.servingSize) / 100)}g</div>
                                                        <div className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">Proteína</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-3xl font-black text-tertiary">{Math.round((selectedFood.carbs * selectedFood.servingSize) / 100)}g</div>
                                                        <div className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">Carbo</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-3xl font-black text-secondary">{Math.round((selectedFood.fat * selectedFood.servingSize) / 100)}g</div>
                                                        <div className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">Gordura</div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>

                                    <div className="bg-white/50 backdrop-blur-sm rounded-[2rem] p-10 border border-tertiary/10 flex flex-col items-center justify-center shadow-inner">
                                        <MacroChart protein={selectedFood.protein} carbs={selectedFood.carbs} fat={selectedFood.fat} />
                                        <p className="mt-6 text-[9px] text-tertiary/40 text-center leading-tight">
                                            * Valores médios aproximados. Podem variar conforme marca e preparo.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};
