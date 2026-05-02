
export function StepPreview({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold font-headline text-on-surface dark:text-stone-100 mb-2">Disponibilidade Mariana</h2>
        <p className="text-on-surface-variant dark:text-stone-400 text-sm">Confira as datas disponíveis abaixo. Para reservar seu horário, avance para a escolha do seu plano.</p>
      </div>

      <div className="flex-grow rounded-2xl overflow-hidden border border-outline/10 dark:border-stone-700/30 relative bg-white">
        {/* Calendly Iframe */}
        <iframe
          src="https://calendly.com/marianabermudesnutri/30min?embed_domain=mariana-nutri.vercel.app&embed_type=inline&hide_event_type_details=1&hide_gdpr_banner=1"
          width="100%"
          height="100%"
          frameBorder="0"
          title="Calendly Preview"
          className="opacity-100"
        ></iframe>

        {/* 
            Blocking Overlay Selective: 
            Removido desfoque para clareza total.
        */}
        <div 
          className="absolute inset-x-0 bottom-0 top-[140px] z-10 flex items-center justify-center pointer-events-auto cursor-not-allowed group"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.1) 10%, rgba(255,255,255,0.3) 100%)'
          }}
        >
           <div className="bg-primary px-6 py-3 rounded-full text-white font-medium flex items-center gap-2 shadow-2xl transition-transform group-hover:scale-105 border border-white/20">
             <span className="material-symbols-outlined text-sm">lock</span>
             Modo Visual: Avance para agendar
           </div>
        </div>

        {/* 
            Label flutuante no topo 
        */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <span className="text-[10px] bg-white/90 text-stone-500 px-2 py-1 rounded-md border border-stone-200 uppercase tracking-tighter shadow-sm">
            Navegue pelos meses abaixo
          </span>
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={onNext}
          className="w-full py-4 bg-primary dark:bg-emerald-600 hover:bg-primary/90 dark:hover:bg-emerald-500 text-on-primary dark:text-white font-bold rounded-xl transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
        >
          Prosseguir com Agendamento
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
