import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, AlertCircle, Sparkles, Plus } from 'lucide-react';
import { useQuota } from '../hooks/useQuota';
import { NutriChatInput } from './ui/nutri-chat-input';


interface RecipeResult {
    id: number | string;
    title: string;
    image: string;
    description?: string;
    ingredients?: string[];
    instructions?: string;
    usedIngredients?: number | string;
    missedIngredients?: number | string;
    source?: string;
}

export const IntelligentRecipes: React.FC = () => {
    const [ingredients, setIngredients] = useState('');
    const [recipes, setRecipes] = useState<RecipeResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [source, setSource] = useState<string | null>(null);
    const [selectedRecipe, setSelectedRecipe] = useState<RecipeResult | null>(null);
    
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

            <NutriChatInput 
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                onSubmit={handleSearch}
                isLoading={isLoading}
                placeholder="Ex: frango, tomate, cebola, manjericão..."
                className="max-w-3xl mx-auto mb-16"
            />

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
                                onClick={() => setSelectedRecipe(recipe)}
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
                                                <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold leading-none mb-1">Fonte</p>
                                                <p className="text-on-background font-bold tracking-tight">{recipe.source || 'Internacional'}</p>
                                            </div>
                                        </div>
                                        
                                        <p className="text-sm text-stone-500 line-clamp-2 italic font-light">
                                            {recipe.description || 'Uma opção deliciosa e equilibrada para o seu dia.'}
                                        </p>

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

            {/* Recipe Modal Detail */}
            <AnimatePresence>
                {selectedRecipe && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedRecipe(null)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-4xl bg-white rounded-[3.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                <div className="h-80 md:h-96 relative">
                                    <img src={selectedRecipe.image} alt={selectedRecipe.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                                    <button 
                                        onClick={() => setSelectedRecipe(null)}
                                        title="Fechar receita"
                                        aria-label="Fechar receita"
                                        className="absolute top-8 right-8 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-stone-600 hover:bg-primary hover:text-white transition-all shadow-xl"
                                    >
                                        <Plus className="w-6 h-6 rotate-45" />
                                    </button>
                                </div>

                                <div className="px-8 md:px-16 pb-16 -mt-20 relative z-10">
                                    <div className="bg-white/80 backdrop-blur-xl border border-white p-8 md:p-12 rounded-[3rem] shadow-xl">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="px-4 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full">
                                                {selectedRecipe.source || 'Receita IA'}
                                            </div>
                                            {selectedRecipe.usedIngredients && (
                                                <div className="px-4 py-1 bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-green-100">
                                                    Ideal para seus itens
                                                </div>
                                            )}
                                        </div>
                                        
                                        <h2 className="text-4xl md:text-5xl font-headline font-bold text-on-background mb-6 tracking-tight leading-tight">
                                            {selectedRecipe.title}
                                        </h2>
                                        
                                        <p className="text-lg text-stone-500 font-light leading-relaxed mb-12 italic border-l-4 border-primary/20 pl-6">
                                            {selectedRecipe.description || 'Esta receita foi cuidadosamente selecionada pela nossa IA para garantir equilíbrio nutricional e sabor excepcional.'}
                                        </p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                            <div>
                                                <h3 className="text-xs font-black text-stone-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                                                    <div className="w-2 h-2 bg-primary rounded-full" />
                                                    Ingredientes Necessários
                                                </h3>
                                                <ul className="space-y-4">
                                                    {selectedRecipe.ingredients?.map((ing, i) => (
                                                        <li key={i} className="flex items-start gap-4 text-stone-600 group">
                                                            <div className="w-6 h-6 rounded-lg bg-stone-50 border border-stone-100 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                                                                <div className="w-1 h-1 bg-stone-300 rounded-full group-hover:bg-primary group-hover:scale-150 transition-all" />
                                                            </div>
                                                            <span className="font-medium">{ing}</span>
                                                        </li>
                                                    )) || <li className="text-stone-400 italic">Consulte as instruções para detalhes.</li>}
                                                </ul>
                                            </div>

                                            <div>
                                                <h3 className="text-xs font-black text-stone-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                                                    <div className="w-2 h-2 bg-secondary rounded-full" />
                                                    Modo de Preparo
                                                </h3>
                                                <div className="text-stone-600 leading-relaxed font-medium whitespace-pre-wrap">
                                                    {selectedRecipe.instructions || 'Combine os ingredientes e cozinhe em fogo médio até atingir o ponto desejado. Tempere a gosto com ervas naturais.'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-8 px-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10">
                                                <Sparkles className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-0.5">Sugestão Mariana</p>
                                                <p className="text-on-background font-bold text-sm">Esta receita respeita o Guia Alimentar 2024</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => setSelectedRecipe(null)}
                                            className="px-12 py-5 bg-stone-900 text-white font-bold rounded-2xl hover:bg-stone-800 transition-all shadow-xl shadow-stone-900/10"
                                        >
                                            Entendido, vamos cozinhar!
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
