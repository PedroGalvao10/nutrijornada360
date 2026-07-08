import { useEffect, useRef } from 'react';
import { useBooking } from '../../context/BookingContext';
import { motion } from 'framer-motion';

// ============================================================
// STEP: Tela de Espera Premium — Polling a cada 10s
// Transição automática quando admin aprova ou rejeita
// ============================================================

interface Props {
  onApproved: () => void;
  onRejected: () => void;
}

export function StepWaiting({ onApproved, onRejected }: Props) {
  const { activeBookingToken, updateBookingStatus } = useBooking();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // STEP: Polling de status a cada 10 segundos
  useEffect(() => {
    if (!activeBookingToken) return;

    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/booking/status/${activeBookingToken}`);
        if (!res.ok) return;

        const data = await res.json();

        if (data.status === 'approved') {
          updateBookingStatus('approved', {
            paymentDeadline: data.paymentDeadline,
          });
          onApproved();
        } else if (data.status === 'rejected') {
          updateBookingStatus('rejected', {
            rejectionReason: data.rejectionReason,
          });
          onRejected();
        }
      } catch {
        // Silencioso — retry no próximo ciclo
      }
    };

    // Primeira checagem imediata
    checkStatus();

    // Polling a cada 10s
    intervalRef.current = setInterval(checkStatus, 10000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeBookingToken, updateBookingStatus, onApproved, onRejected]);

  return (
    <div className="flex flex-col h-full items-center justify-center text-center px-4">
      {/* STEP: Animação premium de espera */}
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="w-20 h-20 bg-primary/10 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mb-6"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="w-14 h-14 border-2 border-primary/20 dark:border-emerald-500/20 border-t-primary dark:border-t-emerald-500 rounded-full"
        />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-headline font-medium text-2xl text-on-background dark:text-stone-100 mb-3"
      >
        Assinatura recebida com sucesso!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-sm text-on-surface-variant dark:text-stone-400 leading-relaxed max-w-sm mb-6"
      >
        <strong className="text-primary dark:text-emerald-400">Mariana</strong> fará uma verificação técnica do seu contrato 
        e dos dados informados para garantir que o plano escolhido é o ideal para você.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-xs text-stone-400 dark:text-stone-500 max-w-xs leading-relaxed"
      >
        Você receberá a aprovação oficial e o QR Code de pagamento via WhatsApp em instantes. 
        Esta tela atualizará automaticamente.
      </motion.p>

      {/* STEP: Indicador de status ativo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 flex items-center gap-2"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
        </span>
        <span className="text-[0.62rem] font-extrabold text-tertiary dark:text-ouro-suave uppercase tracking-[0.22em]">
          Aguardando verificação
        </span>
      </motion.div>

      {/* STEP: Nota sobre WhatsApp */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6 p-3 bg-stone-50 dark:bg-stone-800/30 rounded-xl max-w-xs"
      >
        <p className="text-[10px] text-stone-400 flex items-center justify-center gap-1">
          <span className="material-symbols-outlined text-xs">chat</span>
          Pode fechar esta janela — avisaremos pelo WhatsApp
        </p>
      </motion.div>
    </div>
  );
}
