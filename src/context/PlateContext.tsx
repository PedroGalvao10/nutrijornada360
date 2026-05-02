import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

export interface PlateItem {
    id: string | number;
    name: string;
    brand?: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    quantity: number; // in grams or portions
    unit: 'g' | 'serving';
}

export interface DailyGoals {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

interface PlateContextType {
    items: PlateItem[];
    addItem: (item: Omit<PlateItem, 'quantity' | 'unit'>, quantity: number, unit: 'g' | 'serving') => void;
    removeItem: (id: string | number) => void;
    updateQuantity: (id: string | number, quantity: number) => void;
    clearPlate: () => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    toggleDrawer: () => void;
    openDrawer: () => void;
    closeDrawer: () => void;
    totals: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
    dailyGoals: DailyGoals;
    updateDailyGoals: (goals: Partial<DailyGoals>) => void;
}

const PlateContext = createContext<PlateContextType | undefined>(undefined);

export const PlateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<PlateItem[]>(() => {
        const saved = localStorage.getItem('mariana_plate');
        return saved ? JSON.parse(saved) : [];
    });
    const [dailyGoals, setDailyGoals] = useState<DailyGoals>(() => {
        const saved = localStorage.getItem('mariana_daily_goals');
        return saved ? JSON.parse(saved) : { calories: 2000, protein: 75, carbs: 250, fat: 65 };
    });
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('mariana_plate', JSON.stringify(items));
    }, [items]);

    useEffect(() => {
        localStorage.setItem('mariana_daily_goals', JSON.stringify(dailyGoals));
    }, [dailyGoals]);

    const toggleDrawer = () => setIsOpen(prev => !prev);
    const openDrawer = () => setIsOpen(true);
    const closeDrawer = () => setIsOpen(false);

    const addItem = (food: Omit<PlateItem, 'quantity' | 'unit'>, quantity: number, unit: 'g' | 'serving') => {
        setItems(prev => {
            const existingId = String(food.id);
            const existing = prev.find(i => String(i.id) === existingId);
            if (existing) {
                return prev.map(i => String(i.id) === existingId ? { ...i, quantity: i.quantity + quantity } : i);
            }
            return [...prev, { ...food, quantity, unit }];
        });
        // Auto-open drawer when adding item for better UX
        setIsOpen(true);
    };

    const removeItem = (id: string | number) => {
        setItems(prev => prev.filter(i => String(i.id) !== String(id)));
    };

    const updateQuantity = (id: string | number, quantity: number) => {
        setItems(prev => prev.map(i => String(i.id) === String(id) ? { ...i, quantity } : i));
    };

    const clearPlate = () => setItems([]);

    const updateDailyGoals = (goals: Partial<DailyGoals>) => {
        setDailyGoals(prev => ({ ...prev, ...goals }));
    };

    const totals = useMemo(() => {
        return items.reduce((acc, item) => {
            const factor = item.unit === 'g' ? item.quantity / 100 : item.quantity;
            return {
                calories: acc.calories + (item.calories * factor),
                protein: acc.protein + (item.protein * factor),
                carbs: acc.carbs + (item.carbs * factor),
                fat: acc.fat + (item.fat * factor),
            };
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
    }, [items]);

    return (
        <PlateContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearPlate, isOpen, setIsOpen, toggleDrawer, openDrawer, closeDrawer, totals, dailyGoals, updateDailyGoals }}>
            {children}
        </PlateContext.Provider>
    );
};

export const usePlate = () => {
    const context = useContext(PlateContext);
    if (!context) throw new Error('usePlate must be used within a PlateProvider');
    return context;
};
