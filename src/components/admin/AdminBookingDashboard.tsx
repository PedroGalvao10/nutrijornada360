import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================
// STEP: Admin Booking Dashboard — Revisão de contratos
// Auth cookie-based — usa credentials: 'include' nos fetches
// ============================================================

interface Booking {
  id: number;
  booking_token: string;
  nome: string;
  email: string;
  whatsapp: string;
  cpf?: string;
  plan_id: string;
  plan_title: string;
  plan_price_cents: number;
  parcelas: number;
  valor_parcela_cents: number;
  status: string;
  objetivo?: string;
  descricao_objetivo?: string;
  condicoes_saude?: string[] | string;
  medicamentos?: string;
  rotina_alimentar?: string;
  pratica_exercicio?: string;
  detalhes_exercicio?: string;
  assinatura_usuario?: string;
  contrato_html?: string;
  rejection_reason?: string;
  created_at: string;
  approved_at?: string;
  paid_at?: string;
}

function formatBRL(cents: number): string {
  return `R$${(cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}

function statusBadge(status: string) {
  const styles: Record<string, string> = {
    pending_review: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300',
    approved: 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300',
    paid: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300',
    expired: 'bg-stone-100 text-stone-600 dark:bg-stone-500/20 dark:text-stone-400',
    active: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300',
  };
  const labels: Record<string, string> = {
    pending_review: '🔍 Aguardando',
    approved: '✅ Aprovado',
    rejected: '❌ Rejeitado',
    paid: '💰 Pago',
    expired: '⏰ Expirado',
    active: '🟢 Ativo',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${styles[status] || 'bg-stone-100 text-stone-600'}`}>
      {labels[status] || status}
    </span>
  );
}

// STEP: Helper para fetch com cookies
const authFetch = (url: string, options: RequestInit = {}) =>
  fetch(url, { ...options, credentials: 'include' });

export function AdminBookingDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // STEP: Busca lista de bookings
  const fetchBookings = useCallback(async () => {
    try {
      const url = filter ? `/api/booking/admin/list?status=${filter}` : '/api/booking/admin/list';
      const res = await authFetch(url);
      if (res.ok) {
        setBookings(await res.json());
      }
    } catch (err) {
      console.error('Erro ao buscar bookings:', err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  // STEP: Busca detalhes de um booking
  const fetchDetail = async (id: number) => {
    try {
      const res = await authFetch(`/api/booking/admin/${id}`);
      if (res.ok) {
        setSelectedBooking(await res.json());
      }
    } catch (err) {
      console.error('Erro ao buscar detalhe:', err);
    }
  };

  // STEP: Aprovar booking
  const handleApprove = async () => {
    if (!selectedBooking) return;
    setActionLoading(true);
    try {
      const res = await authFetch(`/api/booking/admin/${selectedBooking.id}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        setSelectedBooking(null);
        fetchBookings();
      }
    } catch (err) {
      console.error('Erro ao aprovar:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // STEP: Rejeitar booking
  const handleReject = async () => {
    if (!selectedBooking) return;
    setActionLoading(true);
    try {
      const res = await authFetch(`/api/booking/admin/${selectedBooking.id}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectionReason || 'Plano inadequado para o perfil' }),
      });
      if (res.ok) {
        setSelectedBooking(null);
        setRejectionReason('');
        fetchBookings();
      }
    } catch (err) {
      console.error('Erro ao rejeitar:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // STEP: Marcar como pago
  const handleMarkPaid = async () => {
    if (!selectedBooking) return;
    setActionLoading(true);
    try {
      const res = await authFetch(`/api/booking/admin/${selectedBooking.id}/mark-paid`, {
        method: 'PATCH',
      });
      if (res.ok) {
        setSelectedBooking(null);
        fetchBookings();
      }
    } catch (err) {
      console.error('Erro ao marcar pago:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const pendingCount = bookings.filter(b => b.status === 'pending_review').length;

  return (
    <div className="space-y-6">
      {/* STEP: Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-headline text-on-surface dark:text-stone-100 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">assignment</span>
            Contratos & Bookings
          </h2>
          {pendingCount > 0 && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 font-bold">
              ⚠️ {pendingCount} contrato(s) aguardando revisão
            </p>
          )}
        </div>
      </div>

      {/* STEP: Filtros */}
      <div className="flex gap-2 flex-wrap">
        {[
          { value: '', label: 'Todos' },
          { value: 'pending_review', label: '🔍 Aguardando' },
          { value: 'approved', label: '✅ Aprovados' },
          { value: 'paid', label: '💰 Pagos' },
          { value: 'rejected', label: '❌ Rejeitados' },
          { value: 'expired', label: '⏰ Expirados' },
        ].map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              filter === f.value
                ? 'bg-primary/10 border-primary/30 text-primary dark:bg-emerald-500/10 dark:text-emerald-400'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-500 hover:bg-stone-200'
            } border`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* STEP: Lista de bookings */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-12 text-stone-400">
          <span className="material-symbols-outlined text-4xl mb-2 block">inbox</span>
          <p className="text-sm">Nenhum booking encontrado</p>
        </div>
      ) : (
        <div className="space-y-2">
          {bookings.map(booking => (
            <button
              key={booking.id}
              onClick={() => fetchDetail(booking.id)}
              className="w-full flex items-center gap-4 p-4 bg-white/50 dark:bg-stone-800/30 rounded-xl border border-outline/5 dark:border-stone-700/20 hover:bg-white/80 dark:hover:bg-stone-800/50 transition-all text-left"
            >
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-on-surface dark:text-stone-100 truncate">{booking.nome}</span>
                  {statusBadge(booking.status)}
                </div>
                <div className="flex items-center gap-3 text-[10px] text-stone-400">
                  <span>{booking.plan_title}</span>
                  <span>•</span>
                  <span>{formatBRL(booking.plan_price_cents)}</span>
                  <span>•</span>
                  <span>{new Date(booking.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-stone-300 dark:text-stone-600">chevron_right</span>
            </button>
          ))}
        </div>
      )}

      {/* STEP: Detail Drawer */}
      <AnimatePresence>
        {selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSelectedBooking(null)} />
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              className="relative bg-white dark:bg-stone-900 w-full max-w-xl max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-outline/10"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-outline/10">
                <div>
                  <h3 className="font-bold text-lg text-on-surface dark:text-stone-100">{selectedBooking.nome}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {statusBadge(selectedBooking.status)}
                    <span className="text-[10px] text-stone-400">#{selectedBooking.id}</span>
                  </div>
                </div>
                <button onClick={() => setSelectedBooking(null)} className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>

              {/* Body */}
              <div className="flex-grow overflow-y-auto p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Email', value: selectedBooking.email },
                    { label: 'WhatsApp', value: selectedBooking.whatsapp },
                    { label: 'CPF', value: selectedBooking.cpf },
                    { label: 'Plano', value: selectedBooking.plan_title },
                    { label: 'Valor', value: formatBRL(selectedBooking.plan_price_cents) },
                    { label: 'Parcelas', value: `${selectedBooking.parcelas}x de ${formatBRL(selectedBooking.valor_parcela_cents)}` },
                  ].map((item, i) => (
                    <div key={i} className="bg-stone-50 dark:bg-stone-800/50 p-2 rounded-lg">
                      <p className="text-[10px] text-stone-400 uppercase">{item.label}</p>
                      <p className="text-sm font-medium text-on-surface dark:text-stone-200 truncate">{item.value || '—'}</p>
                    </div>
                  ))}
                </div>

                {/* Triagem */}
                {selectedBooking.objetivo && (
                  <div className="bg-primary/5 dark:bg-emerald-500/5 p-3 rounded-xl border border-primary/10">
                    <h4 className="text-xs font-bold text-primary dark:text-emerald-400 uppercase mb-2">Triagem</h4>
                    <div className="space-y-1 text-xs text-stone-600 dark:text-stone-400">
                      <p><strong>Objetivo:</strong> {selectedBooking.objetivo}</p>
                      {selectedBooking.descricao_objetivo && <p><strong>Detalhe:</strong> {selectedBooking.descricao_objetivo}</p>}
                      {selectedBooking.condicoes_saude && (
                        <p><strong>Saúde:</strong> {Array.isArray(selectedBooking.condicoes_saude) ? selectedBooking.condicoes_saude.join(', ') : selectedBooking.condicoes_saude}</p>
                      )}
                      {selectedBooking.medicamentos && <p><strong>Medicamentos:</strong> {selectedBooking.medicamentos}</p>}
                      <p><strong>Rotina:</strong> {selectedBooking.rotina_alimentar || '—'}</p>
                      <p><strong>Exercício:</strong> {selectedBooking.pratica_exercicio || '—'}</p>
                    </div>
                  </div>
                )}

                {/* Assinatura */}
                {selectedBooking.assinatura_usuario && (
                  <div>
                    <h4 className="text-xs font-bold text-stone-500 uppercase mb-2">Assinatura Digital</h4>
                    <div className="bg-white dark:bg-stone-800 p-2 rounded-lg border border-outline/10">
                      <img src={selectedBooking.assinatura_usuario} alt="Assinatura" className="max-h-16" />
                    </div>
                  </div>
                )}

                {/* Download PDF */}
                <a
                  href={`/api/booking/contract-pdf/${selectedBooking.booking_token}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2 text-primary dark:text-emerald-400 border border-primary/20 rounded-lg text-sm font-bold hover:bg-primary/5 transition-all"
                >
                  <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                  Baixar Contrato PDF
                </a>
              </div>

              {/* Actions Footer */}
              {selectedBooking.status === 'pending_review' && (
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
                      onClick={handleApprove}
                      disabled={actionLoading}
                      className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all flex items-center justify-center gap-1 disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      Aprovar
                    </button>
                    <button
                      onClick={handleReject}
                      disabled={actionLoading}
                      className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-400 transition-all flex items-center justify-center gap-1 disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-sm">cancel</span>
                      Rejeitar
                    </button>
                  </div>
                </div>
              )}

              {selectedBooking.status === 'approved' && (
                <div className="p-5 border-t border-outline/10">
                  <button
                    onClick={handleMarkPaid}
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
    </div>
  );
}
