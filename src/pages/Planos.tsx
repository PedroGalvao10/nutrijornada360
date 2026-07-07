import { StaggerReveal, StaggerItem } from '../components/ui/StaggerReveal';
import { MagneticButton } from '../components/ui/MagneticButton';
import SEO from '../components/SEO';
import { useBooking, PLANS } from '../context/BookingContext';
import { cn } from '../lib/utils';

// ============================================================
// Planos — O Receituário Clínico
// O visual "SaaS" (GlowWrapper) deu lugar a um visual de papéis,
// formulários médicos e carimbos. O texto migrou para a 1ª pessoa.
// ============================================================

type PlanoDetalhe = {
  tag: string;
  duracao: string;
  destaque?: boolean;
  inclui: string[];
};

const DETALHES: Record<string, PlanoDetalhe> = {
  'avulsa': {
    tag: 'Ponto de Partida',
    duracao: 'Sessão única',
    inclui: [
      'Leio sua rotina antes mesmo de você chegar',
      'Plano desenhado durante a nossa conversa',
      'Espaço aberto para dúvidas e ajustes',
    ],
  },
  'emagrece-mais': {
    tag: 'Jornada Focada',
    duracao: '1 mês de acompanhamento',
    inclui: [
      'Entrevista completa de hábitos reais',
      'Cálculo de déficit sem terrorismo nutricional',
      'Meu suporte direto no seu WhatsApp',
    ],
  },
  'hipertrofia-pro': {
    tag: 'Alta Performance',
    duracao: '3 meses de acompanhamento',
    destaque: true,
    inclui: [
      'Estratégia de hipertrofia calculada no detalhe',
      'Bioimpedância quinzenal para acompanhar os dados',
      'Ajuste fino de suplementação baseada em evidências',
      'Troca direta com o seu treinador físico',
    ],
  },
  'transformacao-360': {
    tag: 'Cuidado Integral',
    duracao: '6 meses de acompanhamento',
    inclui: [
      'Você no topo das minhas prioridades (WhatsApp)',
      'Encontros recorrentes presenciais ou online',
      'Avaliação minuciosa de exames de sangue',
      'Trabalho focado na sua relação emocional com a comida',
    ],
  },
  'casal': {
    tag: 'Juntos',
    duracao: 'Acompanhamento duplo',
    inclui: [
      'Um cardápio só para facilitar as compras',
      'Estratégias que funcionam para a rotina da casa',
      'Apoio mútuo e suporte compartilhado',
    ],
  },
};

const ETAPAS = [
  {
    num: 'Nº 01',
    titulo: 'Você escolhe um caminho',
    texto: 'Comece preenchendo o meu formulário de triagem. Leva uns cinco minutinhos e é lá que eu começo a entender o seu corpo.',
  },
  {
    num: 'Nº 02',
    titulo: 'Eu leio o seu caso',
    texto: 'Nada aqui passa por robôs. Eu mesma leio o seu pedido. Se o plano que você escolheu não for o melhor para o que você precisa, eu te oriento antes de qualquer pagamento.',
  },
  {
    num: 'Nº 03',
    titulo: 'Sentamos para conversar',
    texto: 'Com o horário confirmado, começamos de verdade. Pode ser presencial aqui em SP ou online. O importante é o olho no olho.',
  },
];

export default function Planos() {
  const { openBooking } = useBooking();

  return (
    <div className="relative min-h-screen bg-[#FAF9F6] dark:bg-stone-950 transition-colors duration-500 overflow-x-hidden">
      <SEO
        title="Planos e Consultorias | Mariana Bermudes Nutrição"
        description="Planos de acompanhamento nutricional personalizado: consulta avulsa, emagrecimento, hipertrofia e acompanhamento 360º. Presencial em São Paulo ou online."
      />

      {/* Ruído tátil na página inteira */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply dark:mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

      <div className="relative max-w-[1280px] mx-auto px-6 md:px-12 pt-32 md:pt-40 pb-24">
        {/* Cabeçalho editorial */}
        <StaggerReveal className="max-w-3xl mb-16 md:mb-24">
          <StaggerItem>
            <span className="inline-block px-3 py-1 rounded-sm bg-stone-200/50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-[0.62rem] tracking-[0.18em] uppercase font-extrabold mb-5 border border-stone-300 dark:border-stone-700">
              Prontuários & Planos
            </span>
            <h1 className="font-headline font-medium text-4xl sm:text-5xl lg:text-[4rem] leading-[1.08] tracking-[-0.02em] text-stone-900 dark:text-stone-100 mb-6">
              Um formato para cada fase da sua vida. <em className="font-handwriting text-primary dark:text-emerald-400 rotate-2 inline-block">O ritmo é seu.</em>
            </h1>
          </StaggerItem>
          <StaggerItem>
            <p className="text-lg md:text-xl font-light text-stone-600 dark:text-stone-400 leading-relaxed max-w-[52ch]">
              De uma conversa pontual até seis meses segurando a sua mão. Todos os formatos começam do mesmo jeito: eu entendendo a sua vida antes de ditar regras no seu prato.
            </p>
          </StaggerItem>
        </StaggerReveal>

        {/* Grade de prescrições (Papel físico) */}
        <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-24 md:mb-32" staggerInterval={0.15}>
          {PLANS.map((plan, index) => {
            const detalhe = DETALHES[plan.id];
            const destaque = detalhe?.destaque;
            
            // Alternar leve inclinação para parecerem papéis na mesa
            const rotations = ['-rotate-1', 'rotate-1', '-rotate-2', 'rotate-2', 'rotate-0'];
            const rot = rotations[index % rotations.length];

            return (
              <StaggerItem key={plan.id} className="h-full group perspective-[1000px]">
                <article
                  className={cn(
                    "h-full flex flex-col p-8 md:p-10 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2 relative border border-stone-200/80 dark:border-stone-800",
                    destaque
                      ? "bg-[#1A2622] text-stone-100 shadow-xl scale-[1.02] z-10 rounded-sm"
                      : `bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-md hover:shadow-xl hover:z-10 rounded-sm ${rot}`
                  )}
                  style={!destaque ? {
                    boxShadow: '2px 4px 15px rgba(0,0,0,0.04), inset 0 0 40px rgba(0,0,0,0.02)'
                  } : {}}
                >
                  {/* Linha superior de receituário (estética) */}
                  <div className="absolute top-0 left-0 right-0 h-2 bg-stone-100 dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700 flex gap-1 px-4 py-1">
                    {Array.from({length: 12}).map((_, i) => (
                      <div key={i} className="w-1 h-1 rounded-full bg-stone-300 dark:bg-stone-600" />
                    ))}
                  </div>

                  {destaque && (
                    <div className="absolute -top-4 right-6 px-4 py-1 rounded-sm bg-ouro-suave text-verde-profundo text-[0.6rem] font-extrabold uppercase tracking-[0.18em] shadow-md transform rotate-3">
                      Minha recomendação
                    </div>
                  )}

                  <div className="mt-4 mb-6">
                    <span className={cn(
                      "font-handwriting text-2xl inline-block mb-2",
                      destaque ? "text-ouro-suave" : "text-primary dark:text-emerald-400"
                    )}>
                      {detalhe?.tag}
                    </span>
                    <h2 className="font-headline font-medium text-2xl md:text-3xl tracking-tight">{plan.title}</h2>
                  </div>

                  <p className={cn("text-sm leading-relaxed font-light mb-6", destaque ? "text-stone-300" : "text-stone-500 dark:text-stone-400")}>
                    {plan.description}
                  </p>

                  <div aria-hidden="true" className={cn("w-full h-px mb-6 border-b border-dashed", destaque ? "border-stone-700" : "border-stone-300 dark:border-stone-700")} />

                  <div className="mb-8">
                    <span className="font-handwriting text-4xl md:text-5xl">{plan.price}</span>
                    <p className={cn("text-[0.72rem] uppercase tracking-[0.12em] mt-2 font-bold", destaque ? "text-stone-400" : "text-stone-400 dark:text-stone-500")}>
                      {detalhe?.duracao} · Até {plan.maxParcelas}x
                    </p>
                  </div>

                  <ul className="space-y-4 flex-grow mb-10">
                    {detalhe?.inclui.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm leading-relaxed">
                        <span aria-hidden="true" className={cn("mt-1", destaque ? "text-ouro-suave" : "text-primary dark:text-emerald-400")}>
                          ✓
                        </span>
                        <span className={destaque ? "text-stone-200" : "text-stone-600 dark:text-stone-300"}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => openBooking(plan.id)}
                    className={cn(
                      "no-glass w-full inline-flex justify-center items-center gap-2 px-7 py-4 rounded-sm font-semibold text-[0.9rem] transition-all duration-300",
                      destaque
                        ? "bg-white text-[#1A2622] hover:bg-stone-200 shadow-md"
                        : "border-2 border-stone-800 dark:border-stone-200 text-stone-800 dark:text-stone-100 hover:bg-stone-800 hover:text-white dark:hover:bg-white dark:hover:text-stone-900"
                    )}
                  >
                    Agendar este formato
                  </button>
                </article>
              </StaggerItem>
            );
          })}

          {/* Slot de nota de rodapé */}
          <StaggerItem className="h-full">
            <aside className="h-full flex flex-col justify-center rounded-sm p-8 md:p-10 bg-[#E8E4DB] dark:bg-stone-900 border border-[#D9D4C7] dark:border-stone-800 shadow-inner rotate-1">
              {/* Pin de metal falso */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-stone-400 shadow-sm border border-stone-500" />
              
              <p className="font-handwriting text-3xl text-stone-800 dark:text-stone-200 leading-snug mb-4 mt-4">
                "Mari, eu não sei qual plano é melhor pra mim..."
              </p>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-8">
                Fique tranquila. Comece preenchendo a triagem e me conte um pouco sobre você. Eu mesma vou ler e te dizer por onde devemos começar, sem você precisar pagar nada antes da hora.
              </p>
              <button
                type="button"
                onClick={() => openBooking()}
                className="no-glass self-start font-semibold text-[0.9rem] text-stone-800 dark:text-stone-200 border-b border-stone-800 dark:border-stone-200 pb-1 hover:text-primary transition-colors"
              >
                Preencher a triagem agora
              </button>
            </aside>
          </StaggerItem>
        </StaggerReveal>

        {/* Como funciona (Fluxo Orgânico) */}
        <section aria-labelledby="como-funciona" className="mb-24 md:mb-32">
          <StaggerReveal className="max-w-2xl mb-12">
            <StaggerItem>
              <h2 id="como-funciona" className="font-headline font-medium text-3xl md:text-4xl leading-[1.12] text-stone-900 dark:text-stone-100">
                O fluxo: três passos rápidos e nada automáticos.
              </h2>
            </StaggerItem>
          </StaggerReveal>

          <StaggerReveal className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12" staggerInterval={0.15}>
            {ETAPAS.map((etapa) => (
              <StaggerItem key={etapa.num} className="h-full relative">
                <div className="h-full flex flex-col group">
                  <span className="font-handwriting text-4xl text-stone-300 dark:text-stone-700 transition-colors group-hover:text-primary mb-2 block">{etapa.num}</span>
                  <h3 className="font-headline font-medium text-2xl text-stone-900 dark:text-stone-100 mb-4">{etapa.titulo}</h3>
                  <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed border-l-2 border-primary/30 pl-4">{etapa.texto}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </section>

        {/* CTA final */}
        <StaggerReveal className="relative overflow-hidden rounded-sm bg-[#1A2622] dark:bg-emerald-950 px-8 md:px-16 py-16 md:py-24 text-center shadow-2xl">
          <StaggerItem>
            <h2 className="font-headline font-medium text-3xl md:text-[3rem] leading-[1.12] text-white mb-8">
              Vamos sentar e <em className="font-handwriting text-5xl text-ouro-suave">conversar?</em>
            </h2>
          </StaggerItem>
          <StaggerItem>
            <p className="text-white/70 font-light text-lg leading-relaxed max-w-[46ch] mx-auto mb-10">
              A triagem leva menos tempo que fazer um café. O pagamento só acontece depois que eu aprovar o seu caso.
            </p>
          </StaggerItem>
          <StaggerItem>
            <MagneticButton as="div" className="inline-block">
              <button
                type="button"
                onClick={() => openBooking()}
                className="no-glass inline-flex items-center gap-2 bg-ouro-suave text-[#1A2622] px-10 py-5 rounded-sm font-bold text-sm uppercase tracking-widest shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                Começar minha triagem
              </button>
            </MagneticButton>
          </StaggerItem>
        </StaggerReveal>
      </div>
    </div>
  );
}
