import { StaggerReveal, StaggerItem } from '../ui/StaggerReveal';
import { CardStack } from '../ui/CardStack';

// ============================================================
// AcompanhamentoSection — dobra "o que está incluído no
// acompanhamento" (blueprint 21st.dev, padrão Cards Stack).
// Reaproveita o CardStack já existente na marca; entregáveis
// são reais (transversais aos planos em Planos.tsx) — nada
// inventado. Layout editorial de 2 colunas.
// ============================================================

const ENTREGAVEIS = [
  {
    id: 1,
    name: 'Plano alimentar personalizado',
    designation: 'Nutrição de precisão',
    content: 'Um cardápio calibrado para o seu objetivo e a sua rotina — não uma dieta genérica de gaveta.',
  },
  {
    id: 2,
    name: 'Acompanhamento via WhatsApp',
    designation: 'Suporte contínuo',
    content: 'Suporte entre as consultas, em horário comercial, para as dúvidas que aparecem no dia a dia.',
  },
  {
    id: 3,
    name: 'Revisão humana do seu caso',
    designation: 'Curadoria',
    content: 'A Mariana revisa cada caso antes de montar qualquer plano. Nada aqui é automático.',
  },
  {
    id: 4,
    name: 'Bioimpedância e check-ups',
    designation: 'Dados reais',
    content: 'Medições periódicas para ajustar o plano com base no seu corpo, não em achismo.',
  },
  {
    id: 5,
    name: 'Reeducação comportamental',
    designation: 'Relação com a comida',
    content: 'Uma relação mais leve e sustentável com o alimento, construída no seu tempo.',
  },
];

export function AcompanhamentoSection() {
  return (
    <section aria-labelledby="acompanhamento" className="py-20 md:py-28 bg-background dark:bg-stone-950 relative overflow-hidden transition-colors duration-500">
      <div aria-hidden="true" className="absolute -top-32 -right-40 w-[520px] h-[520px] rounded-full bg-verde-nevoa/50 dark:bg-emerald-900/20 blur-[120px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-6 md:px-12 grid md:grid-cols-[1fr_.9fr] gap-12 md:gap-[5vw] items-center relative z-10">
        <StaggerReveal>
          <StaggerItem>
            <p className="inline-flex items-center gap-3 text-[0.68rem] tracking-[0.26em] uppercase font-extrabold text-tertiary dark:text-ouro-suave mb-6">
              <span aria-hidden="true" className="inline-block w-10 h-px bg-ouro-suave" />
              O acompanhamento
            </p>
          </StaggerItem>
          <StaggerItem>
            <h2 id="acompanhamento" className="font-headline font-medium text-3xl md:text-[2.8rem] leading-[1.1] tracking-[-0.02em] text-on-background dark:text-stone-100 mb-6">
              Não é um PDF de dieta.{' '}
              <em className="italic text-primary dark:text-emerald-400">É gente acompanhando gente.</em>
            </h2>
          </StaggerItem>
          <StaggerItem>
            <p className="text-lg font-light text-on-surface-variant dark:text-stone-400 leading-relaxed max-w-[46ch]">
              Todo plano vem com o mesmo compromisso por trás: revisão humana,
              suporte contínuo e ajustes baseados no seu corpo. Veja o que está
              incluído.
            </p>
          </StaggerItem>
        </StaggerReveal>

        <StaggerReveal className="w-full max-w-md mx-auto md:mx-0 md:justify-self-end" delay={0.2}>
          <StaggerItem>
            <CardStack items={ENTREGAVEIS} />
          </StaggerItem>
        </StaggerReveal>
      </div>
    </section>
  );
}
