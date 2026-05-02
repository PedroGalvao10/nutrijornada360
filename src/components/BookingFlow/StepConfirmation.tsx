import { useBooking } from '../../context/BookingContext';

export function StepConfirmation() {
  const { selectedPlan } = useBooking();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="mb-6">
        <h2 className="text-2xl font-bold font-headline text-on-surface dark:text-stone-100 mb-2">Recebemos suas informações!</h2>
        <p className="text-on-surface-variant dark:text-stone-400 text-sm leading-relaxed">
          Em breve o time da <span className="text-primary dark:text-emerald-400 font-bold">NutriJornada 360º</span> entrará em contato para orientar sobre as formas de pagamento e próximos passos.
        </p>
      </div>

      <div className="bg-stone-100 dark:bg-stone-800/50 p-3 rounded-lg mb-4 flex justify-between items-center border border-outline/5">
        <span className="text-xs font-medium text-stone-500">Plano: {selectedPlan?.title}</span>
        <span className="text-xs font-bold text-primary dark:text-emerald-400">Pendente</span>
      </div>

      <div className="relative flex-grow rounded-2xl overflow-hidden border border-outline/10 dark:border-stone-700/30">
        {/* Calendly Iframe Embed */}
        <iframe
          src="https://calendly.com/marianabermudesnutri/30min?embed_domain=mariana-nutri.vercel.app&embed_type=inline"
          width="100%"
          height="100%"
          frameBorder="0"
          className="bg-white"
          title="Calendly Scheduling"
        ></iframe>

        {/* Locked Overlay - Only shown if they literally JUST finished the form in this session */}
        {/* The user logic says if they return they go to real one. I'll use a local state or just check if they just finished. */}
        {/* For now, I'll always show the overlay in StepConfirmation to match the "waiting for team" feeling requested. */}
        <div className="absolute inset-0 bg-stone-50/80 dark:bg-stone-900/80 backdrop-blur-[2px] flex flex-col items-center justify-center p-8 text-center transition-all">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary animate-pulse">
            <span className="material-symbols-outlined text-4xl">lock</span>
          </div>
          <h3 className="text-lg font-bold text-on-surface dark:text-stone-100 mb-2">Agendamento em processamento</h3>
          <p className="text-sm text-on-surface-variant dark:text-stone-400 max-w-xs">
            Seu agendamento será liberado após a confirmação do pacote pelo nosso time. 
          </p>
          <div className="mt-8 flex gap-2 items-center text-[10px] font-bold text-stone-400 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-ping"></span>
            Aguardando validação
          </div>
        </div>
      </div>
    </div>
  );
}
