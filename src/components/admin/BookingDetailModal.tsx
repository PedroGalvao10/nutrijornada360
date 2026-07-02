import { motion, AnimatePresence } from 'framer-motion';
import { statusBadge, formatBRL, type Booking } from './booking-admin-shared';

interface Props {
  booking: Booking | null;
  rejectionReason: string;
  setRejectionReason: (v: string) => void;
  actionLoading: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  onMarkPaid: () => void;
}

// Drawer de detalhe do booking (extraído de AdminBookingDashboard)
export function BookingDetailModal({
  booking, rejectionReason, setRejectionReason, actionLoading,
  onClose, onApprove, onReject, onMarkPaid,
}: Props) {
  return (
      <AnimatePresence>
        {booking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => onClose()} />
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              className="relative bg-white dark:bg-stone-900 w-full max-w-xl max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-outline/10"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-outline/10">
                <div>
                  <h3 className="font-bold text-lg text-on-surface dark:text-stone-100">{booking.nome}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {statusBadge(booking.status)}
                    <span className="text-[10px] text-stone-400">#{booking.id}</span>
                  </div>
                </div>
                <button onClick={() => onClose()} className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>

              {/* Body */}
              <div className="flex-grow overflow-y-auto p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Email', value: booking.email },
                    { label: 'WhatsApp', value: booking.whatsapp },
                    { label: 'CPF', value: booking.cpf },
                    { label: 'Plano', value: booking.plan_title },
                    { label: 'Valor', value: formatBRL(booking.plan_price_cents) },
                    { label: 'Parcelas', value: `${booking.parcelas}x de ${formatBRL(booking.valor_parcela_cents)}` },
                  ].map((item, i) => (
                    <div key={i} className="bg-stone-50 dark:bg-stone-800/50 p-2 rounded-lg">
                      <p className="text-[10px] text-stone-400 uppercase">{item.label}</p>
                      <p className="text-sm font-medium text-on-surface dark:text-stone-200 truncate">{item.value || '—'}</p>
                    </div>
                  ))}
                </div>

                {/* Triagem */}
                {booking.objetivo && (
                  <div className="bg-primary/5 dark:bg-emerald-500/5 p-3 rounded-xl border border-primary/10">
                    <h4 className="text-xs font-bold text-primary dark:text-emerald-400 uppercase mb-2">Triagem</h4>
                    <div className="space-y-1 text-xs text-stone-600 dark:text-stone-400">
                      <p><strong>Objetivo:</strong> {booking.objetivo}</p>
                      {booking.descricao_objetivo && <p><strong>Detalhe:</strong> {booking.descricao_objetivo}</p>}
                      {booking.condicoes_saude && (
                        <p><strong>Saúde:</strong> {Array.isArray(booking.condicoes_saude) ? booking.condicoes_saude.join(', ') : booking.condicoes_saude}</p>
                      )}
                      {booking.medicamentos && <p><strong>Medicamentos:</strong> {booking.medicamentos}</p>}
                      <p><strong>Rotina:</strong> {booking.rotina_alimentar || '—'}</p>
                      <p><strong>Exercício:</strong> {booking.pratica_exercicio || '—'}</p>
                    </div>
                  </div>
                )}

                {/* Assinatura */}
                {booking.assinatura_usuario && (
                  <div>
                    <h4 className="text-xs font-bold text-stone-500 uppercase mb-2">Assinatura Digital</h4>
                    <div className="bg-white dark:bg-stone-800 p-2 rounded-lg border border-outline/10">
                      <img src={booking.assinatura_usuario} alt="Assinatura" className="max-h-16" />
                    </div>
                  </div>
                )}

                {/* Download PDF */}
                <a
                  href={`/api/booking/contract-pdf/${booking.booking_token}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2 text-primary dark:text-emerald-400 border border-primary/20 rounded-lg text-sm font-bold hover:bg-primary/5 transition-all"
                >
                  <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                  Baixar Contrato PDF
                </a>
              </div>

              {/* Actions Footer */}
              {booking.status === 'pending_review' && (
                <div className="p-5 border-t border-outline/10 space-y-3">
                  <textarea
                    value={rejectionReason}
                    onChange={e => setRejectionReason(e.target.value)}
                    placeholder="Motivo da rejeição (opcional)"
                    rows={2}
                    className="w-full p-3 rounded-xl border border-outline/20 text-sm dark:bg-stone-800 dark:text-white resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={onApprove}
                      disabled={actionLoading}
                      className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all flex items-center justify-center gap-1 disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      Aprovar
                    </button>
                    <button
                      onClick={onReject}
                      disabled={actionLoading}
                      className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-400 transition-all flex items-center justify-center gap-1 disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-sm">cancel</span>
                      Rejeitar
                    </button>
                  </div>
                </div>
              )}

              {booking.status === 'approved' && (
                <div className="p-5 border-t border-outline/10">
                  <button
                    onClick={onMarkPaid}
                    disabled={actionLoading}
                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-all flex items-center justify-center gap-1 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-sm">payments</span>
                    Confirmar Pagamento Recebido
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
  );
}
