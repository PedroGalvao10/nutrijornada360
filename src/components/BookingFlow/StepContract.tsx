import { useState, useCallback } from 'react';
import { useBooking } from '../../context/BookingContext';
import type { BookingFormData } from '../../context/BookingContext';
import { SignatureCanvas } from './SignatureCanvas';

// ============================================================
// STEP: Contrato Dinâmico + Assinatura Digital
// Renderiza preview do contrato e captura assinatura
// ============================================================

function formatBRL(cents: number): string {
  return `R$${(cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}

interface Props {
  data: BookingFormData;
  onChange: (partial: Partial<BookingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepContract({ data, onChange, onNext, onBack }: Props) {
  const { selectedPlan, setActiveBooking } = useBooking();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSignatureChange = useCallback((base64: string) => {
    onChange({ assinaturaBase64: base64 });
  }, [onChange]);

  const handleSubmit = async () => {
    if (!data.assinaturaBase64) {
      setError('Por favor, desenhe sua assinatura antes de continuar.');
      return;
    }
    if (!selectedPlan) return;

    setIsSubmitting(true);
    setError('');

    try {
      // STEP: Envia todos os dados para a API
      const valorParcela = Math.ceil(selectedPlan.priceCents / (data.parcelas || 1));
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: data.nome,
          email: data.email,
          whatsapp: data.whatsapp,
          cpf: data.cpf,
          dataNascimento: data.dataNascimento,
          objetivo: data.objetivo,
          descricaoObjetivo: data.descricaoObjetivo,
          condicoesSaude: data.condicoesSaude,
          medicamentos: data.medicamentos,
          rotinaAlimentar: data.rotinaAlimentar,
          praticaExercicio: data.praticaExercicio,
          detalhesExercicio: data.detalhesExercicio,
          planId: selectedPlan.id,
          planTitle: selectedPlan.title,
          planPriceCents: selectedPlan.priceCents,
          parcelas: data.parcelas,
          valorParcelaCents: valorParcela,
          assinaturaBase64: data.assinaturaBase64,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao enviar contrato');
      }

      // STEP: Salva token no contexto para polling
      setActiveBooking(result.bookingToken, 'pending_review');
      onNext();

    } catch (err: any) {
      setError(err.message || 'Erro de conexão. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedPlan) return null;

  const valorParcela = Math.ceil(selectedPlan.priceCents / (data.parcelas || 1));
  const hoje = new Date().toLocaleDateString('pt-BR');

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="mb-3 flex-shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <button onClick={onBack} className="p-1 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors">
            <span className="material-symbols-outlined text-lg">arrow_back</span>
          </button>
          <h2 className="text-2xl font-bold font-headline text-on-surface dark:text-stone-100">Contrato Digital</h2>
        </div>
        <p className="text-on-surface-variant dark:text-stone-400 text-sm">
          Revise os termos e assine digitalmente.
        </p>
      </div>

      <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-4 pb-4">
        {/* STEP: Preview simplificado do contrato */}
        <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-outline/10 dark:border-stone-700/20 text-xs leading-relaxed space-y-3">
          <div className="text-center border-b border-stone-200 dark:border-stone-700 pb-3 mb-3">
            <h3 className="text-sm font-bold text-on-surface dark:text-stone-100 uppercase tracking-wider">
              Contrato de Prestação de Serviços
            </h3>
            <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">
              Acompanhamento Nutricional Personalizado
            </p>
          </div>

          <p className="text-stone-600 dark:text-stone-400">
            <strong>CONTRATADA:</strong> Mariana Bermudes, Nutricionista — CRN-3
          </p>
          <p className="text-stone-600 dark:text-stone-400">
            <strong>CONTRATANTE:</strong> {data.nome || '—'}, CPF {data.cpf || '—'}, E-mail {data.email || '—'}
          </p>

          <div className="bg-primary/5 dark:bg-emerald-500/5 p-2 rounded-lg">
            <p className="text-stone-600 dark:text-stone-400">
              <strong>PLANO:</strong> {selectedPlan.title} — {selectedPlan.price}
            </p>
            <p className="text-stone-600 dark:text-stone-400">
              <strong>PAGAMENTO:</strong> {data.parcelas}x de {formatBRL(valorParcela)} via PIX
            </p>
          </div>

          <div className="space-y-2 text-stone-500 dark:text-stone-400">
            <p><strong className="text-stone-700 dark:text-stone-300">Cláusula 1ª — Objeto:</strong> Prestação de serviços de acompanhamento nutricional conforme plano contratado.</p>
            <p><strong className="text-stone-700 dark:text-stone-300">Cláusula 2ª — Cancelamento:</strong> Permitido em até 7 dias (CDC Art. 49), com reembolso integral.</p>
            <p><strong className="text-stone-700 dark:text-stone-300">Cláusula 3ª — LGPD:</strong> Dados utilizados exclusivamente para prestação dos serviços, armazenados com segurança.</p>
            <p><strong className="text-stone-700 dark:text-stone-300">Cláusula 4ª — Foro:</strong> Comarca de São Paulo/SP.</p>
          </div>

          <p className="text-center text-stone-400 italic text-[10px] pt-2 border-t border-stone-200 dark:border-stone-700">
            São Paulo, {hoje}
          </p>
        </div>

        {/* STEP: Área de assinatura */}
        <div>
          <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 mb-2 ml-1 uppercase">
            Sua assinatura digital
          </label>
          <SignatureCanvas onSignatureChange={handleSignatureChange} />
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl">
            <p className="text-red-600 dark:text-red-400 text-xs">{error}</p>
          </div>
        )}
      </div>

      <div className="pt-4 flex-shrink-0 border-t border-outline/5 dark:border-stone-800 mt-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || !data.assinaturaBase64}
          className={`w-full py-4 rounded-xl font-bold transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 ${
            isSubmitting || !data.assinaturaBase64
              ? 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
              : 'bg-primary dark:bg-emerald-600 text-on-primary dark:text-white hover:bg-primary/90 dark:hover:bg-emerald-500'
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              Assinar e Enviar Contrato
              <span className="material-symbols-outlined text-lg">draw</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
