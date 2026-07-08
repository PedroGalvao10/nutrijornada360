import { useBooking } from '../../context/BookingContext';
import type { BookingFormData } from '../../context/BookingContext';
import { BfButton, BfBack } from './bfui';

// ============================================================
// STEP: Checkout — Resumo do plano + seleção de parcelamento
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

export function StepCheckout({ data, onChange, onNext, onBack }: Props) {
  const { selectedPlan } = useBooking();

  if (!selectedPlan) return null;

  const maxParcelas = selectedPlan.maxParcelas;
  const parcelasOptions = Array.from({ length: maxParcelas }, (_, i) => i + 1);
  const valorParcela = Math.ceil(selectedPlan.priceCents / (data.parcelas || 1));

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="mb-4 flex-shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <BfBack onClick={onBack} />
          <h2 className="font-headline font-medium text-2xl text-on-background dark:text-stone-100">Checkout</h2>
        </div>
        <p className="text-on-surface-variant dark:text-stone-400 text-sm">
          Confira os detalhes do seu investimento.
        </p>
      </div>

      <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-5 pb-4">
        {/* STEP: Card do plano selecionado */}
        <div className="bg-verde-nevoa/50 dark:bg-emerald-900/20 p-5 rounded-[20px] border border-ouro-suave/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary/20 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-primary dark:text-emerald-400">star</span>
            </div>
            <div>
              <h3 className="font-headline font-medium text-on-background dark:text-stone-100">{selectedPlan.title}</h3>
              <p className="text-xs text-on-surface-variant dark:text-stone-400">{selectedPlan.description}</p>
            </div>
          </div>
          <div className="font-headline font-medium text-3xl text-primary dark:text-emerald-400">
            {selectedPlan.price}
          </div>
        </div>

        {/* STEP: Seleção de parcelamento */}
        <div>
          <label className="block text-[0.62rem] font-extrabold text-tertiary dark:text-ouro-suave mb-2 ml-1 uppercase tracking-[0.16em]">
            Parcelamento via PIX
          </label>
          <div className="grid grid-cols-2 gap-2">
            {parcelasOptions.map(n => {
              const valor = Math.ceil(selectedPlan.priceCents / n);
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => onChange({ parcelas: n })}
                  className={`p-3 rounded-[16px] border transition-all text-center ${
                    data.parcelas === n
                      ? 'border-ouro-suave bg-verde-nevoa/50 dark:border-ouro-suave dark:bg-emerald-900/20'
                      : 'border-surface-variant dark:border-stone-700/50 hover:border-ouro-suave/60'
                  }`}
                >
                  <div className="text-lg font-bold text-on-surface dark:text-stone-100">{n}x</div>
                  <div className="text-xs text-on-surface-variant dark:text-stone-400">
                    de {formatBRL(valor)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP: Resumo do pagamento */}
        <div className="bg-creme-2 dark:bg-stone-800/50 p-4 rounded-[16px] border border-surface-variant/60 dark:border-stone-700/30">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-stone-500">Valor total</span>
            <span className="font-bold text-on-surface dark:text-stone-100">{selectedPlan.price}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-stone-500">Parcelas</span>
            <span className="font-bold text-on-surface dark:text-stone-100">{data.parcelas}x de {formatBRL(valorParcela)}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-outline/10">
            <span className="text-sm text-stone-500">Forma</span>
            <span className="font-bold text-primary dark:text-emerald-400 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">pix</span> PIX
            </span>
          </div>
        </div>

        {/* STEP: Aviso importante */}
        <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-500/10 rounded-xl border border-amber-200 dark:border-amber-500/20">
          <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-lg flex-shrink-0 mt-0.5">info</span>
          <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
            O pagamento será liberado apenas após a verificação técnica do seu contrato pela nutricionista Mariana Bermudes.
          </p>
        </div>
      </div>

      <div className="pt-4 flex-shrink-0 border-t border-outline/5 dark:border-stone-800 mt-2">
        <BfButton type="button" onClick={onNext} data-cursor="Contrato">
          Gerar contrato
          <span aria-hidden="true" className="material-symbols-outlined text-lg">description</span>
        </BfButton>
      </div>
    </div>
  );
}
