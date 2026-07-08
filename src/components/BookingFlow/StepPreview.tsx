import { StepHeader, BfButton } from './bfui';

export function StepPreview({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <StepHeader
        title="Disponibilidade da Mariana"
        subtitle="Confira as datas disponíveis abaixo. Para reservar o seu horário, avance para a escolha do plano."
      />

      <div className="flex-grow rounded-[20px] overflow-hidden border border-surface-variant dark:border-stone-700/50 relative bg-white">
        {/* Calendly Iframe */}
        <iframe
          src="https://calendly.com/marianabermudesnutri/30min?embed_domain=mariana-nutri.vercel.app&embed_type=inline&hide_event_type_details=1&hide_gdpr_banner=1"
          width="100%"
          height="100%"
          frameBorder="0"
          title="Calendly Preview"
          className="opacity-100"
        ></iframe>

        {/* Overlay seletivo: agenda em modo visual até o plano ser escolhido */}
        <div
          className="absolute inset-x-0 bottom-0 top-[140px] z-10 flex items-center justify-center pointer-events-auto cursor-not-allowed group"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(250,246,240,0.1) 10%, rgba(250,246,240,0.35) 100%)'
          }}
        >
          <div className="no-glass bg-verde-profundo px-6 py-3 rounded-full text-background font-semibold text-sm flex items-center gap-2 shadow-float-2 transition-transform group-hover:scale-105">
            <span className="material-symbols-outlined text-sm">lock</span>
            Modo visual: avance para agendar
          </div>
        </div>

        {/* Label flutuante no topo */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <span className="text-[0.6rem] bg-background/95 text-on-surface-variant px-2.5 py-1 rounded-full border border-surface-variant uppercase tracking-[0.14em] font-extrabold shadow-sm">
            Navegue pelos meses abaixo
          </span>
        </div>
      </div>

      <div className="mt-8">
        <BfButton onClick={onNext} data-cursor="Avançar">
          Prosseguir com o agendamento
          <span aria-hidden="true" className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </BfButton>
      </div>
    </div>
  );
}
