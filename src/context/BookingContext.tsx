import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';

// ============================================================
// STEP: Tipos expandidos para o fluxo de consultoria exclusiva
// ============================================================

export type Plan = {
  id: string;
  title: string;
  price: string;
  priceCents: number;
  description: string;
  maxParcelas: number;
};

export const PLANS: Plan[] = [
  { id: 'avulsa', title: 'Consulta Avulsa', price: 'R$200,00', priceCents: 20000, description: 'Ideal para ajustes pontuais.', maxParcelas: 4 },
  { id: 'emagrece-mais', title: 'Consultoria Emagrece+', price: 'R$280,00', priceCents: 28000, description: 'Focado em perda de peso saudável.', maxParcelas: 4 },
  { id: 'hipertrofia-pro', title: 'Hipertrofia Pro+', price: 'R$497,00', priceCents: 49700, description: 'Estratégias avançadas para ganho de massa.', maxParcelas: 4 },
  { id: 'transformacao-360', title: 'Transformação 360º', price: 'R$697,00', priceCents: 69700, description: 'Mudança de vida integral e profunda.', maxParcelas: 4 },
  { id: 'casal', title: 'Plano Casal', price: 'R$640,00', priceCents: 64000, description: 'Acompanhamento conjunto para casais.', maxParcelas: 6 },
];

export type BookingStatus =
  | 'idle'
  | 'filling'
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'pending_payment'
  | 'paid'
  | 'expired';

export interface BookingFormData {
  // Pessoais
  nome: string;
  email: string;
  whatsapp: string;
  cpf: string;
  dataNascimento: string;
  // Triagem
  objetivo: string;
  descricaoObjetivo: string;
  condicoesSaude: string[];
  medicamentos: string;
  rotinaAlimentar: string;
  praticaExercicio: string;
  detalhesExercicio: string;
  // Financeiro
  parcelas: number;
  // Contrato
  assinaturaBase64: string;
}

export const INITIAL_FORM_DATA: BookingFormData = {
  nome: '', email: '', whatsapp: '', cpf: '', dataNascimento: '',
  objetivo: '', descricaoObjetivo: '', condicoesSaude: [], medicamentos: '',
  rotinaAlimentar: '', praticaExercicio: '', detalhesExercicio: '',
  parcelas: 1, assinaturaBase64: '',
};

interface BookingContextType {
  isOpen: boolean;
  selectedPlan: Plan | null;
  // Fluxo ativo (persiste entre abrir/fechar modal)
  activeBookingToken: string | null;
  activeBookingStatus: BookingStatus;
  rejectionReason: string | null;
  paymentDeadline: string | null;
  // Actions
  openBooking: (planId?: string) => void;
  closeBooking: () => void;
  selectPlan: (plan: Plan) => void;
  setActiveBooking: (token: string, status: BookingStatus) => void;
  updateBookingStatus: (status: BookingStatus, extra?: { rejectionReason?: string; paymentDeadline?: string }) => void;
  clearActiveBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [activeBookingToken, setActiveBookingToken] = useState<string | null>(null);
  const [activeBookingStatus, setActiveBookingStatus] = useState<BookingStatus>('idle');
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [paymentDeadline, setPaymentDeadline] = useState<string | null>(null);

  // STEP: Restaurar estado ativo do localStorage ao montar
  useEffect(() => {
    const saved = localStorage.getItem('nutri_booking_active');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setActiveBookingToken(data.token);
        setActiveBookingStatus(data.status || 'pending_review');
        if (data.planId) {
          const plan = PLANS.find(p => p.id === data.planId);
          if (plan) setSelectedPlan(plan);
        }
      } catch { /* ignore corrupt data */ }
    }
  }, []);

  const openBooking = useCallback((planId?: string) => {
    if (planId) {
      const plan = PLANS.find(p => p.id === planId) || null;
      setSelectedPlan(plan);
    }
    setIsOpen(true);
  }, []);

  const closeBooking = useCallback(() => {
    setIsOpen(false);
  }, []);

  const selectPlan = useCallback((plan: Plan) => {
    setSelectedPlan(plan);
  }, []);

  const setActiveBooking = useCallback((token: string, status: BookingStatus) => {
    setActiveBookingToken(token);
    setActiveBookingStatus(status);
    localStorage.setItem('nutri_booking_active', JSON.stringify({
      token, status, planId: selectedPlan?.id
    }));
  }, [selectedPlan]);

  const updateBookingStatus = useCallback((status: BookingStatus, extra?: { rejectionReason?: string; paymentDeadline?: string }) => {
    setActiveBookingStatus(status);
    if (extra?.rejectionReason) setRejectionReason(extra.rejectionReason);
    if (extra?.paymentDeadline) setPaymentDeadline(extra.paymentDeadline);
    // Atualiza localStorage
    const saved = localStorage.getItem('nutri_booking_active');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        data.status = status;
        localStorage.setItem('nutri_booking_active', JSON.stringify(data));
      } catch { /* ignore */ }
    }
  }, []);

  const clearActiveBooking = useCallback(() => {
    setActiveBookingToken(null);
    setActiveBookingStatus('idle');
    setRejectionReason(null);
    setPaymentDeadline(null);
    localStorage.removeItem('nutri_booking_active');
  }, []);

  const value = useMemo(() => ({
    isOpen, selectedPlan,
    activeBookingToken, activeBookingStatus, rejectionReason, paymentDeadline,
    openBooking, closeBooking, selectPlan,
    setActiveBooking, updateBookingStatus, clearActiveBooking
  }), [
    isOpen, selectedPlan,
    activeBookingToken, activeBookingStatus, rejectionReason, paymentDeadline,
    openBooking, closeBooking, selectPlan,
    setActiveBooking, updateBookingStatus, clearActiveBooking
  ]);

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
