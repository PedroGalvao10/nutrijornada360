import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';

export type Plan = {
  id: string;
  title: string;
  price: string;
  description: string;
};

export const PLANS: Plan[] = [
  { id: 'avulsa', title: 'Consulta Avulsa', price: 'R$200,00', description: 'Ideal para ajustes pontuais.' },
  { id: 'emagrece-mais', title: 'Consultoria Emagrece+', price: 'R$280,00', description: 'Focado em perda de peso saudável.' },
  { id: 'hipertrofia-pro', title: 'Hipertrofia Pro+', price: 'R$497,00', description: 'Estratégias avançadas para ganho de massa.' },
  { id: 'transformacao-360', title: 'Transformação 360º', price: 'R$697,00', description: 'Mudança de vida integral e profunda.' },
  { id: 'casal', title: 'Plano Casal', price: 'R$640,00*', description: 'Acompanhamento conjunto para casais.' },
];

interface BookingContextType {
  isOpen: boolean;
  isQualified: boolean;
  selectedPlan: Plan | null;
  openBooking: (planId?: string) => void;
  closeBooking: () => void;
  selectPlan: (plan: Plan) => void;
  setQualified: (qualified: boolean) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isQualified, setIsQualified] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  useEffect(() => {
    const qualified = localStorage.getItem('nutri_jornada_qualified') === 'true';
    setIsQualified(qualified);
  }, []);

  const openBooking = useCallback((planId?: string) => {
    if (planId) {
      const plan = PLANS.find(p => p.id === planId) || null;
      setSelectedPlan(plan);
    } else {
      setSelectedPlan(null);
    }
    setIsOpen(true);
  }, []);

  const closeBooking = useCallback(() => {
    setIsOpen(false);
    // Não limpamos o plano selecionado aqui para manter o estado se ele reabrir
  }, []);

  const selectPlan = useCallback((plan: Plan) => {
    setSelectedPlan(plan);
  }, []);

  const setQualified = useCallback((qualified: boolean) => {
    setIsQualified(qualified);
    if (qualified) {
      localStorage.setItem('nutri_jornada_qualified', 'true');
    } else {
      localStorage.removeItem('nutri_jornada_qualified');
    }
  }, []);

  const value = useMemo(() => ({
    isOpen,
    isQualified,
    selectedPlan,
    openBooking,
    closeBooking,
    selectPlan,
    setQualified
  }), [isOpen, isQualified, selectedPlan, openBooking, closeBooking, selectPlan, setQualified]);

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
