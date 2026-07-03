import { useBooking } from '../../context/BookingContext';
import { motion } from 'framer-motion';
import { FileCard } from '../ui/FileCard';

// ============================================================
// STEP: Tela final — Boas-vindas + Download PDF
// ============================================================

export function StepComplete() {
  const { selectedPlan, activeBookingToken, clearActiveBooking, closeBooking } = useBooking();

  const handleClose = () => {
    clearActiveBooking();
    closeBooking();
  };

  return (
    <div className="flex flex-col h-full items-center justify-center text-center px-4">
      {/* STEP: Animação de celebração */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12 }}
        className="w-20 h-20 bg-primary/10 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mb-6"
      >
        <span className="material-symbols-outlined text-4xl text-primary dark:text-emerald-400">
          celebration
        </span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold font-headline text-on-surface dark:text-stone-100 mb-3"
      >
        Bem-vindo(a) à NutriJornada!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-sm text-on-surface-variant dark:text-stone-400 leading-relaxed max-w-sm mb-6"
      >
        Sua jornada de transformação com a <strong className="text-primary dark:text-emerald-400">Mariana Bermudes</strong> começa agora.
        {selectedPlan && ` Plano: ${selectedPlan.title}.`}
      </motion.p>

      {/* STEP: Próximos passos */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="w-full max-w-sm space-y-3 mb-6"
      >
        {[
          { icon: 'calendar_month', text: 'Mariana entrará em contato para agendar sua primeira consulta' },
          { icon: 'assignment', text: 'Você receberá um questionário detalhado por WhatsApp' },
          { icon: 'restaurant', text: 'Seu plano alimentar personalizado será elaborado' },
        ].map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 + i * 0.15 }}
            className="flex items-center gap-3 p-3 bg-stone-50 dark:bg-stone-800/30 rounded-xl text-left"
          >
            <div className="w-8 h-8 bg-primary/10 dark:bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-sm text-primary dark:text-emerald-400">{step.icon}</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400">{step.text}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* STEP: Download PDF do contrato — cartão-arquivo clicável */}
      {activeBookingToken && (
        <motion.a
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          href={`/api/booking/contract-pdf/${activeBookingToken}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Baixar contrato final em PDF"
          className="mb-4"
        >
          <FileCard
            formatFile="pdf"
            label={
              <span className="inline-flex items-center gap-1 font-semibold text-primary dark:text-emerald-400">
                <span aria-hidden="true" className="material-symbols-outlined text-[15px]">download</span>
                Baixar contrato final
              </span>
            }
          />
        </motion.a>
      )}

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        onClick={handleClose}
        className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
      >
        Fechar
      </motion.button>
    </div>
  );
}
