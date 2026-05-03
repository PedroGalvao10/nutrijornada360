import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { useQuota } from '../hooks/useQuota';


interface RecipeResult {
    id: number | string;
    title: string;
    image: string;
    usedIngredients?: number | string;
    missedIngredients?: number | string;
}

export const IntelligentRecipes: React.FC = () => {
    const [ingredients, setIngredients] = useState('');
    const [recipes, setRecipes] = useState<RecipeResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [source, setSource] = useState<string | null>(null);
    
    // Hook centralizado de quota (elimina duplicação)
    const { remaining: remainingSearches, totalLimit, isUnlimited, limitWarning, setLimitWarning, clearLimitWarning, fetchQuota, usagePercentage, usageCount } = useQuota();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ingredients.trim()) return;

        setIsLoading(true);
        setError(null);
        clearLimitWarning();

        try {
            const response = await fetch(`/api/nutrition/recipes?ingredients=${encodeURIComponent(ingredients)}`);
            
            // Atualizar quota após busca
            fetchQuota();

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 429) {
                    setLimitWarning(data.message);
                    setRecipes([]);
                } else {
                    throw new Error(data.error || 'Erro ao buscar receitas');
                }
            } else {
                setRecipes(data.recipes);
                setSource(data.source);
                if (data.recipes.length === 0) {
                     setError("Nenhuma receita encontrada com esses ingredientes.");
                }
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Falha de conexão.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row items-center gap-6 mb-12 text-center md:text-left">
                <div className="w-20 h-20 rounded-[2rem] bg-white border border-stone-100 flex items-center justify-center flex-shrink-0 shadow-xl shadow-stone-200/40">
                    <ChefHat className="w-10 h-10 text-primary" />
                </div>
                <div>
                    <h2 className="text-4xl font-headline font-bold text-on-background tracking-tight">Receitas Inteligentes</h2>
                    <p className="text-stone-400 mt-2 font-light text-lg">Diga o que você tem na geladeira e nós criamos o cardápio ideal.</p>
                </div>
            </div>

            <form onSubmit={handleSearch} className="relative w-full max-w-3xl mx-auto mb-16">
                <div className="relative group">
                    <input
                        type="text"
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                        placeholder="Ex: frango, tomate, cebola, manjericão..."
                        className="w-full bg-white/40 backdrop-blur-2xl border border-white/40 rounded-3xl py-6 pl-8 pr-40 text-on-background placeholder-stone-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all shadow-xl shadow-stone-200/20 group-hover:shadow-stone-200/40 text-lg font-light tracking-tight"
                    />
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="absolute right-3 top-3 bottom-3 px-10 bg-primary text-white rounded-2xl flex items-center justify-center gap-3 font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:hover:scale-100"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                        <span className="tracking-tight">Criar</span>
                    </button>
                </div>
                <p className="text-[10px] text-stone-400 mt-4 px-8 uppercase tracking-[0.2em] font-bold">Separe os ingredientes por vírgula para melhores resultados</p>
            </form>

             {/* Quota Progress Indicator */}
             <AnimatePresence>
                {!limitWarning && remainingSearches !== null && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="max-w-3xl mx-auto mb-10"
                    >
                        <div className="flex justify-between items-end mb-2 px-1">
                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                                {isUnlimited ? 'Acesso Ilimitado (Dev)' : 'Buscas Gratuitas Diárias'}
                            </span>
                            <span className="text-xs font-bold text-primary">
                                {isUnlimited ? 'Ilimitado' : `Ações realizadas: ${usageCount} / ${totalLimit}`}
                            </span>
                        </div>
                        {!isUnlimited && (
                            <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${usagePercentage}%` }}
                                    className="h-full bg-primary"
                                />
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>


                {limitWarning && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-8">
                        <div className="bg-primary/5 border border-primary/20 p-8 rounded-3xl text-center shadow-xl shadow-primary/5">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold text-on-background mb-2">Acesso Premium Necessário</h3>
                            <p className="text-tertiary/80 mb-6 max-w-md mx-auto">{limitWarning}</p>
                            <a href="/planos" className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white font-bold rounded-2xl hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                                <Sparkles className="w-4 h-4" />
                                Ver Pacotes Premium
                            </a>
                        </div>
                    </motion.div>
                )}

                {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 text-red-600 p-4 rounded-xl text-center mb-6 border border-red-100 font-medium">
                        {error}
                    </motion.div>
                )}

            {/* Results */}
            {recipes.length > 0 && (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                >
                    <div className="flex justify-between items-center mb-10 px-2">
                        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-[0.2em]">
                            Sugestões Criativas
                            <span className="ml-4 text-[10px] font-bold text-stone-400 bg-white border border-stone-100 px-3 py-1 rounded-full">{recipes.length} resultados</span>
                        </h3>
                        <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold flex items-center gap-2">
                             <Sparkles className="w-3 h-3 text-primary/50" />
                             Via {source}
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recipes.map((recipe, index) => (
                            <motion.div 
                                key={recipe.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="antigravity-glass rounded-[3rem] overflow-hidden group cursor-pointer border-white/60 hover:border-primary/20 transition-all hover:shadow-2xl hover:shadow-stone-200/40 active:scale-[0.98] flex flex-col h-full shadow-lg shadow-stone-200/20"
                            >
                                <div className="h-64 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-70 group-hover:opacity-90 transition-opacity" />
                                    <img 
                                        src={recipe.image} 
                                        alt={recipe.title} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                    />
                                    <div className="absolute bottom-6 left-8 right-8 z-20">
                                        <h3 className="font-headline font-bold text-2xl leading-tight text-white tracking-tight group-hover:translate-y-[-4px] transition-transform">{recipe.title}</h3>
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-1">
                                    <div className="flex flex-col gap-4 flex-1">
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="w-9 h-9 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10">
                                                <ChefHat className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold leading-none mb-1">Ingredientes</p>
                                                <p className="text-on-background font-bold tracking-tight">{recipe.usedIngredients !== 'N/A' ? `${recipe.usedIngredients} que você tem` : 'Diversos'}</p>
                                            </div>
                                        </div>
                                        
                                        {recipe.missedIngredients !== 'N/A' && parseInt(String(recipe.missedIngredients)) > 0 && (
                                             <div className="flex items-center gap-3 text-sm bg-white/40 p-4 rounded-2xl border border-stone-100">
                                                 <div className="w-7 h-7 rounded-full bg-amber-400/10 flex items-center justify-center">
                                                     <AlertCircle className="w-4 h-4 text-amber-500" />
                                                 </div>
                                                 <span className="text-stone-500 font-medium tracking-tight">Faltam apenas {recipe.missedIngredients} itens</span>
                                             </div>
                                        )}

                                        <button className="mt-auto w-full py-5 bg-white border border-stone-100 text-stone-600 font-bold rounded-[1.5rem] text-sm hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center justify-center gap-3 group/btn shadow-sm">
                                            Explorar Preparo
                                            <div className="w-1.5 h-1.5 bg-stone-300 rounded-full group-hover/btn:bg-white group-hover/btn:scale-150 transition-all" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
};
