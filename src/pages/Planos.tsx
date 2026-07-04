import { StaggerReveal, StaggerItem } from '../components/ui/StaggerReveal';
import { MagneticButton } from '../components/ui/MagneticButton';
import { GlowWrapper } from '../components/ui/GlowWrapper';
import SEO from '../components/SEO';
import { useBooking, PLANS } from '../context/BookingContext';

// ============================================================
// Planos — página de planos na direção "Editorial Orgânico".
// Cartões brancos com numeração itálica ouro e filete dourado;
// preços e ids vêm de PLANS (BookingContext) para manter o
// booking flow como fonte única de verdade.
// ============================================================

type PlanoDetalhe = {
  tag: string;
  duracao: string;
  destaque?: boolean;
  inclui: string[];
};

const DETALHES: Record<string, PlanoDetalhe> = {
  'avulsa': {
    tag: 'Início',
    duracao: 'Sessão única',
    inclui: [
      'Avaliação da rotina antes da consulta',
      'Orientações personalizadas na sessão',
      'Espaço para dúvidas pontuais',
    ],
  },
  'emagrece-mais': {
    tag: 'Foco',
    duracao: '1 mês de acompanhamento',
    inclui: [
      'Check-up completo de hábitos',
      'Plano alimentar com déficit calórico bem calibrado',
      'Suporte via WhatsApp em horário comercial',
    ],
  },
  'hipertrofia-pro': {
    tag: 'Performance',
    duracao: '3 meses de acompanhamento',
    destaque: true,
    inclui: [
      'Protocolo de ganho de massa muscular',
      'Bioimpedância quinzenal',
      'Ajuste fino de suplementação',
      'Revisões de treino junto ao seu educador físico',
    ],
  },
  'transformacao-360': {
    tag: 'Completo',
    duracao: '6 meses de acompanhamento',
    inclui: [
      'Suporte prioritário via WhatsApp',
      'Check-up presencial ou online',
      'Leitura de exames e biofeedback',
      'Reeducação comportamental com a comida',
    ],
  },
  'casal': {
    tag: 'Dupla',
    duracao: 'Acompanhamento conjunto',
    inclui: [
      'Cardápio pensado para as compras da casa',
      'Estratégias para a rotina da família',
      'Suporte compartilhado via WhatsApp',
    ],
  },
};

const ETAPAS = [
  {
    num: 'Nº 01',
    titulo: 'Você escolhe o plano',
    texto: 'Preenche um formulário curto de triagem: objetivo, rotina, saúde. Leva menos de cinco minutos.',
  },
  {
    num: 'Nº 02',
    titulo: 'A Mariana revisa o seu caso',
    texto: 'Cada pedido passa por curadoria humana. Se o plano escolhido não for o ideal para você, ela sugere outro caminho.',
  },
  {
    num: 'Nº 03',
    titulo: 'Consulta e acompanhamento',
    texto: 'Com o agendamento confirmado, começa o acompanhamento de verdade — presencial em São Paulo ou online.',
  },
];

export default function Planos() {
  const { openBooking } = useBooking();

  return (
    <div className="relative min-h-screen bg-background dark:bg-stone-950 transition-colors duration-500 overflow-x-hidden">
      <SEO
        title="Planos e Consultorias | Mariana Bermudes Nutrição"
        description="Planos de acompanhamento nutricional personalizado: consulta avulsa, emagrecimento, hipertrofia e acompanhamento 360º. Presencial em São Paulo ou online."
      />

      {/* Névoa verde no topo, como no hero da Home */}
      <div aria-hidden="true" className="absolute -top-40 -left-40 w-[560px] h-[560px] rounded-full bg-verde-nevoa/60 dark:bg-emerald-900/20 blur-[120px] pointer-events-none" />

      <div className="relative max-w-[1280px] mx-auto px-6 md:px-12 pt-32 md:pt-40 pb-24">
        {/* Cabeçalho editorial */}
        <StaggerReveal className="max-w-3xl mb-16 md:mb-20">
          <StaggerItem>
            <span className="inline-block px-3 py-1 rounded-full bg-verde-nevoa dark:bg-emerald-900/30 text-primary dark:text-emerald-400 text-[0.62rem] tracking-[0.18em] uppercase font-extrabold mb-5">
              Planos e consultorias
            </span>
            <h1 className="font-headline font-medium text-4xl sm:text-5xl lg:text-[3.6rem] leading-[1.08] tracking-[-0.02em] text-on-background dark:text-stone-100 mb-6">
              Um plano para cada momento. O ritmo é seu.
            </h1>
          </StaggerItem>
          <StaggerItem>
            <p className="text-lg md:text-xl font-light text-on-surface-variant dark:text-stone-400 leading-relaxed max-w-[52ch]">
              De uma consulta pontual a seis meses de acompanhamento completo.
              Todos começam do mesmo jeito: entendendo a sua rotina antes de mexer no seu prato.
            </p>
          </StaggerItem>
        </StaggerReveal>

        {/* Grade de planos */}
        <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-24 md:mb-32" staggerInterval={0.1}>
          {PLANS.map((plan) => {
            const detalhe = DETALHES[plan.id];
            const destaque = detalhe?.destaque;
            return (
              <StaggerItem key={plan.id} className="h-full">
                <GlowWrapper
                  as="article"
                  glowColor={destaque ? 'amber' : 'mariana'}
                  className={`no-glass h-full flex flex-col rounded-[28px] p-8 md:p-9 backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 ${
                    destaque
                      ? 'bg-verde-profundo/95 dark:bg-emerald-950/90 text-background shadow-float-2 ring-2 ring-ouro-suave/40'
                      : 'bg-white/70 dark:bg-stone-900/70 border border-white/60 dark:border-white/10 text-on-background dark:text-stone-100 shadow-float-1 hover:shadow-float-2'
                  }`}
                >
                  {destaque && (
                    <>
                      {/* Brilho de vidro no topo do cartão-âncora */}
                      <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-b from-white/15 to-transparent" />
                      {/* Selo do plano mais escolhido */}
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-ouro-suave text-verde-profundo text-[0.6rem] font-extrabold uppercase tracking-[0.18em] shadow-float-1 whitespace-nowrap">
                        Mais escolhido
                      </span>
                    </>
                  )}
                  <span className={`relative inline-block w-fit px-3 py-1 rounded-full text-[0.6rem] tracking-[0.18em] uppercase font-extrabold mb-4 ${
                    destaque
                      ? 'bg-ouro-suave/20 text-ouro-suave'
                      : 'bg-verde-nevoa dark:bg-emerald-900/30 text-primary dark:text-emerald-400'
                  }`}>
                    {detalhe?.tag}
                  </span>

                  <h2 className="font-headline font-medium text-2xl mb-2">{plan.title}</h2>
                  <p className={`text-sm leading-relaxed ${destaque ? 'text-background/75' : 'text-on-surface-variant dark:text-stone-400'}`}>
                    {plan.description}
                  </p>

                  <div aria-hidden="true" className="w-16 h-px bg-ouro-suave my-5" />

                  <p className="mb-1">
                    <span className="font-headline font-medium text-3xl md:text-[2.1rem]">{plan.price}</span>
                  </p>
                  <p className={`text-[0.72rem] uppercase tracking-[0.12em] mb-6 ${destaque ? 'text-background/60' : 'text-on-surface-variant dark:text-stone-500'}`}>
                    {detalhe?.duracao} · até {plan.maxParcelas}x
                  </p>

                  <ul className="space-y-3 flex-grow mb-8">
                    {detalhe?.inclui.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm leading-relaxed">
                        <span
                          aria-hidden="true"
                          className={`material-symbols-outlined text-[17px] mt-0.5 ${destaque ? 'text-ouro-suave' : 'text-primary dark:text-emerald-400'}`}
                        >
                          check
                        </span>
                        <span className={destaque ? 'text-background/85' : 'text-on-surface-variant dark:text-stone-300'}>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => openBooking(plan.id)}
                    data-cursor="Agendar"
                    className={`no-glass w-full inline-flex justify-center items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-[0.9rem] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 ${
                      destaque
                        ? 'bg-background text-verde-profundo shadow-float-1 hover:shadow-float-2'
                        : 'border border-surface-variant dark:border-stone-700 text-on-background dark:text-stone-100 hover:border-ouro-suave'
                    }`}
                  >
                    Agendar consulta
                    <span aria-hidden="true" className="material-symbols-outlined text-[17px]">arrow_forward</span>
                  </button>
                </GlowWrapper>
              </StaggerItem>
            );
          })}

          {/* Sexto slot: nota editorial preenchendo a grade */}
          <StaggerItem className="h-full">
            <aside className="h-full flex flex-col justify-center rounded-[28px] p-8 md:p-9 bg-creme-2 dark:bg-stone-900/60 border border-surface-variant dark:border-stone-800">
              <p className="font-headline italic text-xl text-on-background dark:text-stone-200 leading-snug mb-4">
                “Não sei qual plano faz sentido para mim.”
              </p>
              <p className="text-sm text-on-surface-variant dark:text-stone-400 leading-relaxed mb-6">
                Normal. Comece pela consulta avulsa ou preencha a triagem: a Mariana
                revisa cada pedido e indica o caminho certo antes de qualquer pagamento.
              </p>
              <button
                type="button"
                onClick={() => openBooking()}
                className="no-glass self-start font-semibold text-[0.9rem] text-on-background dark:text-stone-200 border-b border-ouro-suave pb-1 hover:border-tertiary transition-colors"
              >
                Preencher a triagem
              </button>
            </aside>
          </StaggerItem>
        </StaggerReveal>

        {/* Como funciona */}
        <section aria-labelledby="como-funciona" className="mb-24 md:mb-32">
          <StaggerReveal className="max-w-2xl mb-12">
            <StaggerItem>
              <h2 id="como-funciona" className="font-headline font-medium text-3xl md:text-4xl leading-[1.12] text-on-background dark:text-stone-100">
                Como funciona: três etapas, nenhuma automática.
              </h2>
            </StaggerItem>
          </StaggerReveal>

          <StaggerReveal className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8" staggerInterval={0.12}>
            {ETAPAS.map((etapa) => (
              <StaggerItem key={etapa.num} className="h-full">
                <div className="h-full bg-white dark:bg-stone-900 rounded-[28px] p-8 shadow-float-1 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-float-2">
                  <span className="font-headline italic text-ouro-suave text-lg">{etapa.num}</span>
                  <h3 className="font-headline font-medium text-xl text-on-background dark:text-stone-100 mt-2 mb-3">{etapa.titulo}</h3>
                  <div aria-hidden="true" className="w-16 h-px bg-ouro-suave mb-4" />
                  <p className="text-sm text-on-surface-variant dark:text-stone-400 leading-relaxed">{etapa.texto}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </section>

        {/* CTA final */}
        <StaggerReveal className="relative overflow-hidden rounded-[32px] bg-verde-profundo dark:bg-emerald-950 px-8 md:px-16 py-14 md:py-20 text-center shadow-float-2">
          <div aria-hidden="true" className="absolute -bottom-32 -right-24 w-[420px] h-[420px] rounded-full bg-primary/25 blur-[100px] pointer-events-none" />
          <StaggerItem>
            <p className="text-[0.68rem] tracking-[0.26em] uppercase font-extrabold text-ouro-suave mb-5">Próximo passo</p>
          </StaggerItem>
          <StaggerItem>
            <h2 className="font-headline font-medium text-3xl md:text-[2.6rem] leading-[1.12] text-background mb-5">
              Pronta para começar? <em className="italic text-ouro-suave">A triagem leva cinco minutos.</em>
            </h2>
          </StaggerItem>
          <StaggerItem>
            <p className="text-background/75 font-light text-lg leading-relaxed max-w-[46ch] mx-auto mb-9">
              Escolha um plano acima ou comece direto pela triagem. Sem compromisso:
              o pagamento só acontece depois da revisão do seu caso.
            </p>
          </StaggerItem>
          <StaggerItem>
            <MagneticButton as="div" className="inline-block">
              <button
                type="button"
                onClick={() => openBooking()}
                data-cursor="Agendar"
                className="no-glass inline-flex items-center gap-2 bg-background text-verde-profundo px-9 py-4 rounded-full font-semibold text-[0.95rem] shadow-float-1 hover:shadow-float-2 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
              >
                Agendar minha consulta
                <span aria-hidden="true" className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </MagneticButton>
          </StaggerItem>
        </StaggerReveal>
      </div>
    </div>
  );
}
