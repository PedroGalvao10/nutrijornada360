import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, AlertTriangle, CheckCircle, Flame, Beef, Wheat, Droplets, Target, Lightbulb, Award, Edit2, Save } from 'lucide-react';
import { usePlate } from '../context/PlateContext';
import { useAuth } from '../context/AuthContextCore';
import type { PlateItem, DailyGoals } from '../context/PlateContext';
import { Lock } from 'lucide-react';

// ═══════════════════════════════════════════════════
//  PLATE ANALYSIS — Modal de Análise Nutricional
//  Analisa a composição do prato montado pelo usuário,
//  apresentando gráficos visuais e dicas contextuais.
// ═══════════════════════════════════════════════════

interface PlateAnalysisProps {
    isOpen: boolean;
    onClose: () => void;
}

// ── Faixas ideais de distribuição calórica (% do total) ──
const IDEAL_RANGES = {
    protein: { min: 15, max: 35, label: 'Proteína' },
    carbs: { min: 45, max: 65, label: 'Carboidrato' },
    fat: { min: 20, max: 35, label: 'Gordura' },
};

// ── Tipo de qualificação do prato ──
type PlateQuality = 'excellent' | 'good' | 'warning' | 'poor';

interface AnalysisResult {
    quality: PlateQuality;
    score: number; // 0-100
    macroDistribution: {
        protein: number; // percentual calórico
        carbs: number;
        fat: number;
    };
    insights: string[];
    mealType: string;
}

// ═══════════════════════════════════════════════════
//  STEP 1: Analisar o prato e gerar insights
// ═══════════════════════════════════════════════════
function analyzePlate(items: PlateItem[], totals: { calories: number; protein: number; carbs: number; fat: number }, dailyGoals: DailyGoals): AnalysisResult {
    if (items.length === 0) {
        return {
            quality: 'poor',
            score: 0,
            macroDistribution: { protein: 0, carbs: 0, fat: 0 },
            insights: ['Adicione alimentos ao prato para iniciar a análise.'],
            mealType: 'Vazio',
        };
    }

    // STEP 2: Calcular distribuição calórica por macronutriente
    const proteinCals = totals.protein * 4;
    const carbsCals = totals.carbs * 4;
    const fatCals = totals.fat * 9;
    const totalMacroCals = proteinCals + carbsCals + fatCals;

    const distribution = {
        protein: totalMacroCals > 0 ? (proteinCals / totalMacroCals) * 100 : 0,
        carbs: totalMacroCals > 0 ? (carbsCals / totalMacroCals) * 100 : 0,
        fat: totalMacroCals > 0 ? (fatCals / totalMacroCals) * 100 : 0,
    };

    // STEP 3: Calcular score de balanceamento (0-100)
    let score = 100;
    const insights: string[] = [];

    // Proteína
    if (distribution.protein < IDEAL_RANGES.protein.min) {
        score -= 15;
        insights.push(`Proteína baixa (${Math.round(distribution.protein)}%). Considere adicionar frango, ovos ou leguminosas.`);
    } else if (distribution.protein > IDEAL_RANGES.protein.max) {
        score -= 10;
        insights.push(`Proteína elevada (${Math.round(distribution.protein)}%). Balanceie com mais vegetais e grãos.`);
    }

    // Carboidratos
    if (distribution.carbs < IDEAL_RANGES.carbs.min) {
        score -= 10;
        insights.push(`Carboidratos baixos (${Math.round(distribution.carbs)}%). Adicione arroz integral, batata ou frutas.`);
    } else if (distribution.carbs > IDEAL_RANGES.carbs.max) {
        score -= 15;
        insights.push(`Carboidratos elevados (${Math.round(distribution.carbs)}%). Reduza porções de massas ou pães.`);
    }

    // Gordura
    if (distribution.fat < IDEAL_RANGES.fat.min) {
        score -= 5;
        insights.push(`Gordura baixa (${Math.round(distribution.fat)}%). Inclua azeite, abacate ou castanhas.`);
    } else if (distribution.fat > IDEAL_RANGES.fat.max) {
        score -= 20;
        insights.push(`Gordura elevada (${Math.round(distribution.fat)}%). Reduza frituras ou queijos amarelos.`);
    }

    // Calorias vs meta diária
    const calPercentOfDaily = dailyGoals.calories > 0 ? (totals.calories / dailyGoals.calories) * 100 : 0;
    if (calPercentOfDaily > 50) {
        score -= 10;
        insights.push(`Esta refeição representa ${Math.round(calPercentOfDaily)}% das calorias diárias recomendadas. Atenção às demais refeições.`);
    }

    if (insights.length === 0) {
        insights.push('Excelente equilíbrio nutricional! Seu prato está bem distribuído entre os macronutrientes.');
    }

    // Determinar tipo de refeição por calorias
    let mealType = 'Lanche';
    if (totals.calories > 500) mealType = 'Refeição Principal';
    else if (totals.calories > 250) mealType = 'Refeição Leve';

    score = Math.max(0, Math.min(100, score));
    let quality: PlateQuality = 'excellent';
    if (score < 50) quality = 'poor';
    else if (score < 70) quality = 'warning';
    else if (score < 85) quality = 'good';

    return { quality, score, macroDistribution: distribution, insights, mealType };
}

// ═══════════════════════════════════════════════════
//  COMPONENTES VISUAIS
// ═══════════════════════════════════════════════════

// ── Donut Chart SVG ──
const DonutChart: React.FC<{ protein: number; carbs: number; fat: number }> = ({ protein, carbs, fat }) => {
    const total = protein + carbs + fat;
    if (total === 0) return null;

    const radius = 15.91549431;

    const pPercent = (protein / total) * 100;
    const cPercent = (carbs / total) * 100;
    const fPercent = (fat / total) * 100;

    return (
        <div className="relative w-48 h-48">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                {/* Proteína */}
                <circle
                    className="transition-all duration-1000"
                    stroke="#4a7c59"
                    strokeWidth="3.5"
                    strokeDasharray={`${pPercent} ${100 - pPercent}`}
                    strokeDashoffset="0"
                    fill="none"
                    r={radius}
                    cx="18"
                    cy="18"
                    strokeLinecap="round"
                />
                {/* Carboidratos */}
                <circle
                    className="transition-all duration-1000"
                    stroke="#d97706"
                    strokeWidth="3.5"
                    strokeDasharray={`${cPercent} ${100 - cPercent}`}
                    strokeDashoffset={`${-pPercent}`}
                    fill="none"
                    r={radius}
                    cx="18"
                    cy="18"
                    strokeLinecap="round"
                />
                {/* Gordura */}
                <circle
                    className="transition-all duration-1000"
                    stroke="#e11d48"
                    strokeWidth="3.5"
                    strokeDasharray={`${fPercent} ${100 - fPercent}`}
                    strokeDashoffset={`${-(pPercent + cPercent)}`}
                    fill="none"
                    r={radius}
                    cx="18"
                    cy="18"
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                    <span className="block text-3xl font-black text-on-background tracking-tighter">{Math.round(total)}</span>
                    <span className="block text-[9px] uppercase tracking-[0.2em] text-stone-400 font-bold">kcal</span>
                </div>
            </div>
        </div>
    );
};

// ── Barra de Progresso Horizontal ──
const ProgressBar: React.FC<{
    label: string;
    current: number;
    goal: number;
    unit: string;
    color: string;
    icon: React.ReactNode;
}> = ({ label, current, goal, unit, color, icon }) => {
    const percentage = Math.min((current / goal) * 100, 100);
    const overGoal = current > goal;

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    {icon}
                    <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">{label}</span>
                </div>
                <div className="text-right">
                    <span className={`text-sm font-black ${color}`}>{Math.round(current)}{unit}</span>
                    <span className="text-[10px] text-stone-300 ml-1">/ {goal}{unit}</span>
                </div>
            </div>
            <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden relative">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                    className={`h-full rounded-full ${overGoal ? 'bg-red-400' : ''}`}
                    style={!overGoal ? { backgroundColor: color.includes('#') ? color : undefined } : undefined}
                />
                {/* Marcador de meta */}
                <div
                    className="absolute top-0 bottom-0 w-0.5 bg-stone-300"
                    style={{ left: '100%', transform: 'translateX(-1px)' }}
                />
            </div>
        </div>
    );
};

// ── Score Badge Visual ──
const ScoreBadge: React.FC<{ score: number; quality: PlateQuality }> = ({ score, quality }) => {
    const config = {
        excellent: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', label: 'Excelente', icon: <Award className="w-5 h-5" /> },
        good: { bg: 'bg-primary/5', border: 'border-primary/20', text: 'text-primary', label: 'Bom', icon: <CheckCircle className="w-5 h-5" /> },
        warning: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', label: 'Atenção', icon: <AlertTriangle className="w-5 h-5" /> },
        poor: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600', label: 'Desequilibrado', icon: <AlertTriangle className="w-5 h-5" /> },
    }[quality];

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className={`${config.bg} ${config.border} border rounded-[2rem] p-6 flex items-center gap-4`}
        >
            <div className={`w-16 h-16 rounded-2xl ${config.bg} border ${config.border} flex items-center justify-center`}>
                <span className={`text-2xl font-black ${config.text}`}>{score}</span>
            </div>
            <div>
                <div className={`flex items-center gap-2 ${config.text} font-bold text-sm uppercase tracking-wider`}>
                    {config.icon}
                    {config.label}
                </div>
                <p className="text-[10px] text-stone-400 mt-0.5 uppercase tracking-widest">Score nutricional</p>
            </div>
        </motion.div>
    );
};

// ═══════════════════════════════════════════════════
//  COMPONENTE PRINCIPAL — PlateAnalysis
// ═══════════════════════════════════════════════════
export const PlateAnalysis: React.FC<PlateAnalysisProps> = ({ isOpen, onClose }) => {
    const { items, totals, dailyGoals, updateDailyGoals } = usePlate();
    const { isPremium } = useAuth();
    const [isEditingGoals, setIsEditingGoals] = useState(false);
    const [tempGoals, setTempGoals] = useState<DailyGoals>(dailyGoals);

    useEffect(() => {
        setTempGoals(dailyGoals);
    }, [dailyGoals]);

    const handleSaveGoals = () => {
        updateDailyGoals(tempGoals);
        setIsEditingGoals(false);
    };

    const analysis = useMemo(() => analyzePlate(items, totals, dailyGoals), [items, totals, dailyGoals]);

    // Calorias vindas de cada macro (para o donut)
    const proteinCals = totals.protein * 4;
    const carbsCals = totals.carbs * 4;
    const fatCals = totals.fat * 9;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[200]"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: 60, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.97 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed inset-4 md:inset-auto md:top-[5vh] md:left-1/2 md:-translate-x-1/2 md:w-[min(90vw,720px)] md:max-h-[90vh] z-[201] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 md:p-8 border-b border-stone-100 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-headline font-bold text-on-background tracking-tight">Análise da Refeição</h2>
                                <p className="text-xs uppercase tracking-[0.2em] text-stone-400 font-bold mt-1">
                                    {items.length} itens · {analysis.mealType}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                aria-label="Fechar análise"
                                data-cursor="Fechar"
                                className="w-10 h-10 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center hover:bg-stone-100 transition-colors"
                            >
                                <X className="w-5 h-5 text-stone-400" aria-hidden="true" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">

                            {/* Score + Donut Row */}
                            <div className="flex flex-col md:flex-row gap-6 items-center">
                                {/* Score */}
                                <div className="flex-1 w-full">
                                    <ScoreBadge score={analysis.score} quality={analysis.quality} />
                                </div>

                                {/* Donut */}
                                <div className="flex flex-col items-center">
                                    <DonutChart
                                        protein={proteinCals}
                                        carbs={carbsCals}
                                        fat={fatCals}
                                    />
                                    {/* Legenda */}
                                    <div className="flex gap-4 mt-4">
                                        {[
                                            { color: 'bg-[#4a7c59]', label: 'Prot', value: `${Math.round(analysis.macroDistribution.protein)}%` },
                                            { color: 'bg-amber-500', label: 'Carb', value: `${Math.round(analysis.macroDistribution.carbs)}%` },
                                            { color: 'bg-rose-500', label: 'Gord', value: `${Math.round(analysis.macroDistribution.fat)}%` },
                                        ].map(item => (
                                            <div key={item.label} className="flex items-center gap-1.5">
                                                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                                                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">{item.label}</span>
                                                <span className="text-[10px] font-black text-stone-700">{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Macro Bars vs Daily Goals */}
                            <div className="bg-stone-50/50 rounded-[2rem] p-6 border border-stone-100 space-y-5">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Target className="w-4 h-4 text-primary" />
                                        <span className="text-xs font-bold text-stone-500 uppercase tracking-[0.2em]">Comparativo com Meta Diária</span>
                                    </div>
                                    {isEditingGoals ? (
                                        <button 
                                            onClick={handleSaveGoals} 
                                            aria-label="Salvar novas metas"
                                            className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-dark transition-colors"
                                        >
                                            <Save className="w-3.5 h-3.5" /> Salvar
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => isPremium ? setIsEditingGoals(true) : null} 
                                            aria-label={isPremium ? "Editar metas nutricionais" : "Acesso premium necessário para editar metas"}
                                            className={`flex items-center gap-1 text-xs font-bold transition-colors ${isPremium ? 'text-stone-400 hover:text-primary' : 'text-stone-300 cursor-not-allowed'}`}
                                            title={isPremium ? "Editar Metas" : "Funcionalidade exclusiva para usuários Premium"}
                                        >
                                            {isPremium ? <Edit2 className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                                            {isPremium ? "Editar" : "Premium"}
                                        </button>
                                    )}
                                </div>

                                {!isPremium && !isEditingGoals && (
                                    <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 mb-4 flex items-start gap-3">
                                        <Lock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                        <p className="text-[10px] text-stone-600 leading-tight">
                                            A personalização de metas é uma funcionalidade exclusiva do plano **Transformação 360º**. 
                                            <button className="text-primary font-bold ml-1 hover:underline">Saiba mais</button>
                                        </p>
                                    </div>
                                )}

                                {isEditingGoals && isPremium ? (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="goal-calories" className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Calorias (kcal)</label>
                                                <input id="goal-calories" type="number" value={tempGoals.calories} onChange={(e) => setTempGoals({ ...tempGoals, calories: Number(e.target.value) })} className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm font-bold text-stone-700 outline-none focus:border-primary transition-colors" />
                                            </div>
                                            <div>
                                                <label htmlFor="goal-protein" className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Proteína (g)</label>
                                                <input id="goal-protein" type="number" value={tempGoals.protein} onChange={(e) => setTempGoals({ ...tempGoals, protein: Number(e.target.value) })} className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm font-bold text-stone-700 outline-none focus:border-primary transition-colors" />
                                            </div>
                                            <div>
                                                <label htmlFor="goal-carbs" className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Carboidrato (g)</label>
                                                <input id="goal-carbs" type="number" value={tempGoals.carbs} onChange={(e) => setTempGoals({ ...tempGoals, carbs: Number(e.target.value) })} className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm font-bold text-stone-700 outline-none focus:border-primary transition-colors" />
                                            </div>
                                            <div>
                                                <label htmlFor="goal-fat" className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Gordura (g)</label>
                                                <input id="goal-fat" type="number" value={tempGoals.fat} onChange={(e) => setTempGoals({ ...tempGoals, fat: Number(e.target.value) })} className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm font-bold text-stone-700 outline-none focus:border-primary transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <ProgressBar
                                            label="Calorias"
                                            current={totals.calories}
                                            goal={dailyGoals.calories}
                                            unit=""
                                            color="#4a7c59"
                                            icon={<Flame className="w-3.5 h-3.5 text-primary" />}
                                        />
                                        <ProgressBar
                                            label="Proteína"
                                            current={totals.protein}
                                            goal={dailyGoals.protein}
                                            unit="g"
                                            color="#4a7c59"
                                            icon={<Beef className="w-3.5 h-3.5 text-primary" />}
                                        />
                                        <ProgressBar
                                            label="Carboidrato"
                                            current={totals.carbs}
                                            goal={dailyGoals.carbs}
                                            unit="g"
                                            color="#d97706"
                                            icon={<Wheat className="w-3.5 h-3.5 text-amber-500" />}
                                        />
                                        <ProgressBar
                                            label="Gordura"
                                            current={totals.fat}
                                            goal={dailyGoals.fat}
                                            unit="g"
                                            color="#e11d48"
                                            icon={<Droplets className="w-3.5 h-3.5 text-rose-500" />}
                                        />
                                    </>
                                )}
                            </div>

                            {/* Items Breakdown */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 px-1">
                                    <TrendingUp className="w-4 h-4 text-primary" />
                                    <span className="text-xs font-bold text-stone-500 uppercase tracking-[0.2em]">Detalhamento por Item</span>
                                </div>
                                <div className="space-y-2">
                                    {items.map((item, idx) => {
                                        const factor = item.unit === 'g' ? item.quantity / 100 : item.quantity;
                                        const itemCals = Math.round(item.calories * factor);
                                        const calPercent = totals.calories > 0 ? (itemCals / totals.calories) * 100 : 0;

                                        return (
                                            <motion.div
                                                key={item.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 * idx, duration: 0.4 }}
                                                className="bg-white rounded-2xl p-4 border border-stone-100 flex items-center gap-4"
                                            >
                                                {/* Barra visual de proporção */}
                                                <div className="w-1 h-10 rounded-full bg-stone-100 relative overflow-hidden">
                                                    <div
                                                        className="absolute bottom-0 left-0 right-0 bg-primary rounded-full transition-all"
                                                        style={{ height: `${calPercent}%` }}
                                                    />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-bold text-on-background line-clamp-1">{item.name}</h4>
                                                    <p className="text-[10px] text-stone-400 font-medium">{item.quantity}{item.unit} · {item.brand || 'Genérico'}</p>
                                                </div>

                                                <div className="text-right flex-shrink-0">
                                                    <span className="block text-sm font-black text-primary">{itemCals}</span>
                                                    <span className="text-[9px] text-stone-400 uppercase font-bold">kcal</span>
                                                </div>

                                                <div className="text-right flex-shrink-0 pl-2 border-l border-stone-50">
                                                    <span className="block text-[10px] font-bold text-stone-500">{Math.round(calPercent)}%</span>
                                                    <span className="text-[8px] text-stone-300 uppercase">do total</span>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Insights */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 px-1">
                                    <Lightbulb className="w-4 h-4 text-amber-500" />
                                    <span className="text-xs font-bold text-stone-500 uppercase tracking-[0.2em]">Insights Inteligentes</span>
                                </div>
                                <div className="space-y-2">
                                    {analysis.insights.map((insight, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 + (idx * 0.15) }}
                                            className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 text-sm text-amber-800 leading-relaxed"
                                        >
                                            {insight}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Disclaimer */}
                            <p className="text-[9px] text-stone-300 text-center leading-relaxed px-4 pt-4 border-t border-stone-50">
                                * Valores de referência baseados em uma dieta de 2.000 kcal para adultos. Consulte sua nutricionista para metas personalizadas.
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
