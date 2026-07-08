import { useState, useCallback } from 'react';
import { useBooking, INITIAL_FORM_DATA } from '../../context/BookingContext';
import type { BookingFormData } from '../../context/BookingContext';
import { motion, AnimatePresence } from 'framer-motion';
import { StepPreview } from './StepPreview';
import { StepSelection } from './StepSelection';
import { StepForm } from './StepForm';
import { StepTriage } from './StepTriage';
import { StepCheckout } from './StepCheckout';
import { StepContract } from './StepContract';
import { StepWaiting } from './StepWaiting';
import { StepPayment } from './StepPayment';
import { StepComplete } from './StepComplete';

// ============================================================
// STEP: Orquestrador principal do fluxo de booking
// Gerencia steps, form data local e transições
// ============================================================

type BookingStep =
  | 'preview'
  | 'selection'
  | 'form'
  | 'triage'
  | 'checkout'
  | 'contract'
  | 'waiting'
  | 'rejected'
  | 'payment'
  | 'complete';

// STEP: Labels para a progress bar
const STEP_LABELS: Record<BookingStep, string> = {
  preview: 'Agenda',
  selection: 'Plano',
  form: 'Dados',
  triage: 'Triagem',
  checkout: 'Checkout',
  contract: 'Contrato',
  waiting: 'Verificação',
  rejected: 'Ajuste',
  payment: 'Pagamento',
  complete: 'Concluído',
};

const STEP_ORDER: BookingStep[] = [
  'preview', 'selection', 'form', 'triage', 'checkout', 'contract', 'waiting', 'payment', 'complete'
];

export function BookingModal() {
  const {
    isOpen, closeBooking, selectedPlan,
    activeBookingToken, activeBookingStatus,
    rejectionReason,
  } = useBooking();

  const [step, setStep] = useState<BookingStep>('preview');
  const [formData, setFormData] = useState<BookingFormData>({ ...INITIAL_FORM_DATA });

  // STEP: Determina step inicial ao abrir com base no estado ativo.
  // Ajuste de estado durante o render (padrão react.dev) — dispara
  // apenas na transição fechado→aberto, sem cascata de effects.
  const [wasOpen, setWasOpen] = useState(false);
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) {
      if (activeBookingToken) {
        // Tem booking ativo — retoma do ponto onde parou
        switch (activeBookingStatus) {
          case 'pending_review':
            setStep('waiting');
            break;
          case 'approved':
            setStep('payment');
            break;
          case 'rejected':
            setStep('rejected');
            break;
          case 'paid':
            setStep('complete');
            break;
          default:
            setStep('waiting');
        }
      } else if (selectedPlan) {
        // Tem plano pré-selecionado — pula direto para form
        setStep('form');
      } else {
        setStep('preview');
      }
    }
  }

  // STEP: Handler de atualização parcial do form data
  const updateFormData = useCallback((partial: Partial<BookingFormData>) => {
    setFormData(prev => ({ ...prev, ...partial }));
  }, []);

  // STEP: Navegação do preview baseada na existência de plano
  const handlePreviewNext = () => {
    if (selectedPlan) {
      setStep('form');
    } else {
      setStep('selection');
    }
  };

  if (!isOpen) return null;

  // STEP: Calcula progresso para a barra
  const currentIndex = STEP_ORDER.indexOf(step === 'rejected' ? 'waiting' : step);
  const progress = Math.max(0, ((currentIndex + 1) / STEP_ORDER.length) * 100);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop — véu verde-profundo, coerente com a marca */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeBooking}
        className="absolute inset-0 bg-verde-profundo/40 dark:bg-black/60 backdrop-blur-md"
      />

      {/* Modal Card — superfície sólida creme (Editorial Orgânico) */}
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Agendamento de consultoria"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-background dark:bg-stone-900 w-full max-w-2xl h-[92vh] max-h-[800px] rounded-[32px] shadow-float-2 overflow-hidden flex flex-col border border-white/60 dark:border-stone-800"
      >
        {/* Header: etiqueta da etapa + progresso ouro */}
        <div className="flex-shrink-0 px-8 pt-6 pb-2">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-2.5 text-[0.62rem] font-extrabold text-tertiary dark:text-ouro-suave uppercase tracking-[0.24em]">
              <span aria-hidden="true" className="inline-block w-6 h-px bg-ouro-suave" />
              {STEP_LABELS[step]}
            </span>
            <button
              onClick={closeBooking}
              aria-label="Fechar agendamento"
              className="no-glass w-8 h-8 rounded-full bg-creme-2 dark:bg-stone-800 flex items-center justify-center text-on-surface-variant/60 hover:text-verde-profundo dark:hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
          {/* Progress bar — fio dourado */}
          <div className="w-full h-1 bg-surface-variant/60 dark:bg-stone-700/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-ouro-suave rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow px-8 pb-2 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {step === 'preview' && (
              <motion.div key="preview" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full">
                <StepPreview onNext={handlePreviewNext} />
              </motion.div>
            )}

            {step === 'selection' && (
              <motion.div key="selection" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full">
                <StepSelection onNext={() => setStep('form')} />
              </motion.div>
            )}

            {step === 'form' && (
              <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full">
                <StepForm
                  data={formData}
                  onChange={updateFormData}
                  onNext={() => setStep('triage')}
                  onBack={() => setStep('selection')}
                />
              </motion.div>
            )}

            {step === 'triage' && (
              <motion.div key="triage" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full">
                <StepTriage
                  data={formData}
                  onChange={updateFormData}
                  onNext={() => setStep('checkout')}
                  onBack={() => setStep('form')}
                />
              </motion.div>
            )}

            {step === 'checkout' && (
              <motion.div key="checkout" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full">
                <StepCheckout
                  data={formData}
                  onChange={updateFormData}
                  onNext={() => setStep('contract')}
                  onBack={() => setStep('triage')}
                />
              </motion.div>
            )}

            {step === 'contract' && (
              <motion.div key="contract" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full">
                <StepContract
                  data={formData}
                  onChange={updateFormData}
                  onNext={() => setStep('waiting')}
                  onBack={() => setStep('checkout')}
                />
              </motion.div>
            )}

            {step === 'waiting' && (
              <motion.div key="waiting" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="h-full">
                <StepWaiting
                  onApproved={() => setStep('payment')}
                  onRejected={() => setStep('rejected')}
                />
              </motion.div>
            )}

            {step === 'rejected' && (
              <motion.div key="rejected" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-500/10 rounded-full flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-3xl text-amber-600 dark:text-amber-400">info</span>
                </div>
                <h2 className="text-xl font-bold text-on-surface dark:text-stone-100 mb-3">Ajuste Necessário</h2>
                <p className="text-sm text-on-surface-variant dark:text-stone-400 mb-2">
                  A nutricionista sugeriu um ajuste no seu plano:
                </p>
                {rejectionReason && (
                  <div className="bg-amber-50 dark:bg-amber-500/10 p-4 rounded-xl border border-amber-200 dark:border-amber-500/20 mb-6 max-w-sm">
                    <p className="text-sm text-amber-800 dark:text-amber-300 italic">"{rejectionReason}"</p>
                  </div>
                )}
                <a
                  href="https://wa.me/5511956007142?text=Ol%C3%A1%20Mariana!%20Recebi%20o%20ajuste%20no%20meu%20contrato%20e%20gostaria%20de%20conversar."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-xl font-bold hover:bg-[#20BD5A] transition-all"
                >
                  <span className="material-symbols-outlined">chat</span>
                  Conversar com Mariana
                </a>
              </motion.div>
            )}

            {step === 'payment' && (
              <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full">
                <StepPayment onComplete={() => setStep('complete')} />
              </motion.div>
            )}

            {step === 'complete' && (
              <motion.div key="complete" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="h-full">
                <StepComplete />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Brand Footer */}
        <div className="flex-shrink-0 p-4 bg-creme-2 dark:bg-stone-800/40 flex justify-center items-center gap-3 border-t border-surface-variant/60 dark:border-stone-800">
          <span aria-hidden="true" className="inline-block w-6 h-px bg-ouro-suave/60" />
          <span className="text-[0.6rem] font-extrabold uppercase tracking-[0.22em] text-on-surface-variant/60 dark:text-stone-500">
            NutriJornada 360º — Mariana Bermudes
          </span>
          <span aria-hidden="true" className="inline-block w-6 h-px bg-ouro-suave/60" />
        </div>
      </motion.div>
    </div>
  );
}
