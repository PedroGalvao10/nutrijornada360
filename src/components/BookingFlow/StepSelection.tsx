import { useBooking, PLANS } from '../../context/BookingContext';

export function StepSelection({ onNext }: { onNext: () => void }) {
  const { selectedPlan, selectPlan } = useBooking();

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold font-headline text-on-surface dark:text-stone-100 mb-2">Escolha seu plano</h2>
        <p className="text-on-surface-variant dark:text-stone-400 text-sm">Selecione a modalidade que melhor se adapta às suas necessidades atuais.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 overflow-y-auto pr-2 max-h-[400px] mb-6 custom-scrollbar">
        {PLANS.map((plan) => (
          <button
            key={plan.id}
            onClick={() => selectPlan(plan)}
            className={`flex flex-col items-start p-4 rounded-xl border-2 transition-all text-left ${
              selectedPlan?.id === plan.id
                ? 'border-primary bg-primary/5 dark:border-emerald-500 dark:bg-emerald-500/10'
                : 'border-outline/10 dark:border-stone-700/30 hover:border-primary/50 dark:hover:border-emerald-500/50'
            }`}
          >
            <div className="flex justify-between items-center w-full mb-1">
              <span className="font-bold text-on-surface dark:text-stone-100">{plan.title}</span>
              <span className="text-primary dark:text-emerald-400 font-bold">{plan.price}</span>
            </div>
            <p className="text-xs text-on-surface-variant dark:text-stone-400">{plan.description}</p>
          </button>
        ))}
      </div>

      <div className="mt-auto pt-4 flex flex-col gap-3">
        <button
          onClick={onNext}
          disabled={!selectedPlan}
          className={`w-full py-4 rounded-xl font-bold transition-all shadow-md active:scale-[0.98] ${
            selectedPlan
              ? 'bg-primary dark:bg-emerald-600 text-on-primary dark:text-white hover:bg-primary/90 dark:hover:bg-emerald-500'
              : 'bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-600 cursor-not-allowed opacity-60'
          }`}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
