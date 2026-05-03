import { useState, useEffect, useCallback } from 'react';

interface QuotaState {
    remaining: number | null;
    totalLimit: number;
    isUnlimited: boolean;
    limitWarning: string | null;
}

/**
 * Hook centralizado para gerenciamento de quota de API.
 * Elimina duplicação entre NutriSearch e IntelligentRecipes.
 * Fonte única de verdade para estado de uso/limite.
 */
export function useQuota() {
    const [quota, setQuota] = useState<QuotaState>({
        remaining: null,
        totalLimit: 15,
        isUnlimited: false,
        limitWarning: null,
    });

    const fetchQuota = useCallback(async () => {
        try {
            const response = await fetch('/api/nutrition/quota');
            if (response.ok) {
                const data = await response.json();
                setQuota(prev => ({
                    ...prev,
                    remaining: data.remaining,
                    totalLimit: data.limit,
                    isUnlimited: data.isUnlimited,
                }));
            }
        } catch (err) {
            console.error('Erro ao buscar quota:', err instanceof Error ? err.message : String(err));
        }
    }, []);

    const setLimitWarning = useCallback((message: string | null) => {
        setQuota(prev => ({ ...prev, limitWarning: message }));
    }, []);

    const clearLimitWarning = useCallback(() => {
        setQuota(prev => ({ ...prev, limitWarning: null }));
    }, []);

    // Buscar quota inicial
    useEffect(() => {
        fetchQuota();
    }, [fetchQuota]);

    return {
        ...quota,
        fetchQuota,
        setLimitWarning,
        clearLimitWarning,
        // Propriedade computada para a barra de progresso
        usagePercentage: quota.remaining !== null && !quota.isUnlimited
            ? ((quota.totalLimit - quota.remaining) / quota.totalLimit) * 100
            : 0,
        usageCount: quota.remaining !== null 
            ? quota.totalLimit - quota.remaining 
            : 0,
    };
}
