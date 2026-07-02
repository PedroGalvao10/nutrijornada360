import { useState, useEffect, useCallback } from 'react';
import { statusBadge, formatBRL, authFetch, type Booking } from './booking-admin-shared';
import { BookingDetailModal } from './BookingDetailModal';

// ============================================================
// STEP: Admin Booking Dashboard — Revisão de contratos
// Auth cookie-based — usa credentials: 'include' nos fetches
// ============================================================

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

      {/* STEP: Detail Drawer (extraído para BookingDetailModal) */}
      <BookingDetailModal
        booking={selectedBooking}
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
        actionLoading={actionLoading}
        onClose={() => setSelectedBooking(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        onMarkPaid={handleMarkPaid}
      />
    </div>
  );
}
