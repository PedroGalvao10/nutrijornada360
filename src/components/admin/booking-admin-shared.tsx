// Tipos e helpers compartilhados do painel de bookings (extraídos de AdminBookingDashboard)

export interface Booking {
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

export function formatBRL(cents: number): string {
  return `R$${(cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}

export function statusBadge(status: string) {
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

// Helper para fetch com cookies (JWT httpOnly)
export const authFetch = (url: string, options: RequestInit = {}) =>
  fetch(url, { ...options, credentials: 'include' });
