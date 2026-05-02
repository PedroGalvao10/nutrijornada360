import { useState, useEffect } from 'react';
import { useBooking } from '../../context/BookingContext';
import { motion, AnimatePresence } from 'framer-motion';
import { StepSelection } from './StepSelection';
import { StepForm } from './StepForm';
import { StepConfirmation } from './StepConfirmation';
import { StepPreview } from './StepPreview';

export function BookingModal() {
  const { isOpen, closeBooking, isQualified, selectedPlan } = useBooking();
  const [step, setStep] = useState<'preview' | 'selection' | 'form' | 'confirmation' | 'real'>('preview');

  // Reset step when modal opens
  useEffect(() => {
    if (isOpen) {
      if (isQualified) {
        setStep('real');
      } else {
        // Sempre começa no preview conforme solicitado: "antes da etapa de escolher o plano"
        setStep('preview');
      }
    }
  }, [isOpen, isQualified]);

  const handlePreviewNext = () => {
    if (selectedPlan) {
      setStep('form');
    } else {
      setStep('selection');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeBooking}
        className="absolute inset-0 bg-stone-900/40 dark:bg-black/60 backdrop-blur-md"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative antigravity-glass bg-white/10 dark:bg-black/60 w-full max-w-2xl h-[90vh] max-h-[750px] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-white/20 dark:border-white/5"
      >
        {/* Header with Close Button */}
        <div className="absolute top-6 right-6 z-50">
          <button
            onClick={closeBooking}
            className="w-10 h-10 rounded-full bg-white/50 dark:bg-stone-800/50 backdrop-blur-sm flex items-center justify-center text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-grow p-8 md:p-12 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {step === 'preview' && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <StepPreview onNext={handlePreviewNext} />
              </motion.div>
            )}

            {step === 'selection' && (
              <motion.div
                key="selection"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <StepSelection onNext={() => setStep('form')} />
              </motion.div>
            )}

            {step === 'form' && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <StepForm onNext={() => setStep('confirmation')} onBack={() => setStep('selection')} />
              </motion.div>
            )}

            {step === 'confirmation' && (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="h-full"
              >
                <StepConfirmation />
              </motion.div>
            )}

            {step === 'real' && (
              <motion.div
                key="real"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold font-headline text-on-surface dark:text-stone-100 mb-2">Seu Agendamento</h2>
                  <p className="text-on-surface-variant dark:text-stone-400 text-sm">Escolha o melhor horário para sua consulta.</p>
                </div>
                <div className="flex-grow rounded-2xl overflow-hidden border border-outline/10 dark:border-stone-700/30">
                  <iframe
                    src="https://calendly.com/marianabermudesnutri/30min?embed_domain=mariana-nutri.vercel.app&embed_type=inline"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    className="bg-white"
                    title="Calendly Real"
                  ></iframe>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Brand Subtle Footer */}
        <div className="p-6 bg-stone-100/50 dark:bg-stone-800/30 flex justify-center border-t border-outline/5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">NutriJornada 360º — Mariana Bermudes</span>
        </div>
      </motion.div>
    </div>
  );
}
