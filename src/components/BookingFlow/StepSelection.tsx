import { useBooking, PLANS } from '../../context/BookingContext';
import { StepHeader, BfButton, BfOptionCard } from './bfui';

export function StepSelection({ onNext }: { onNext: () => void }) {
  const { selectedPlan, selectPlan } = useBooking();

  return (
    <div className="flex flex-col h-full">
      <StepHeader
        title="Escolha o seu plano"
        subtitle="Selecione a modalidade que melhor se adapta às suas necessidades atuais."
      />

      <div className="grid grid-cols-1 gap-3 overflow-y-auto pr-2 max-h-[400px] mb-6 custom-scrollbar">
        {PLANS.map((plan) => (
          <BfOptionCard
            key={plan.id}
            selected={selectedPlan?.id === plan.id}
            onClick={() => selectPlan(plan)}
          >
            <div className="flex justify-between items-baseline w-full mb-1">
              <span className="font-headline font-medium text-on-background dark:text-stone-100">{plan.title}</span>
              <span className="font-headline font-medium text-primary dark:text-emerald-400">{plan.price}</span>
            </div>
            <p className="text-xs text-on-surface-variant dark:text-stone-400 font-light">{plan.description}</p>
          </BfOptionCard>
        ))}
      </div>

      <div className="mt-auto pt-4 flex flex-col gap-3">
        <BfButton onClick={onNext} disabled={!selectedPlan} data-cursor="Continuar">
          Continuar
        </BfButton>
      </div>
    </div>
  );
}
