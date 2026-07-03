import { StaggerReveal, StaggerItem } from '../../ui/StaggerReveal';

// ============================================================
// SobreTrajetoria — formação e experiências em cartões
// editoriais numerados (Nº 01–03) com filete dourado.
// ============================================================

const ETAPAS = [
  {
    num: 'Nº 01',
    titulo: 'Formação',
    texto: 'Graduada em Nutrição pelo Centro Universitário São Camilo, referência em saúde em São Paulo.',
  },
  {
    num: 'Nº 02',
    titulo: 'Vida acadêmica',
    texto: 'Diretora de Pesquisa da Liga de Unidades de Alimentação e Nutrição e monitora de Marketing Nutricional, com foco em rotulagem de alimentos e educação nutricional.',
  },
  {
    num: 'Nº 03',
    titulo: 'Experiência profissional',
    texto: 'Passagens pelo Rosewood Hotel Group, Nutrição Clínica no Hospital São Camilo, Saúde Coletiva na Associação Nossa Turma e atendimento na Clínica Escola Promove.',
  },
];

export function SobreTrajetoria() {
  return (
    <section aria-labelledby="trajetoria" className="max-w-[1280px] mx-auto px-6 md:px-12 pb-24 md:pb-32">
      <StaggerReveal className="max-w-2xl mb-12">
        <StaggerItem>
          <p className="inline-flex items-center gap-3 text-[0.68rem] tracking-[0.26em] uppercase font-extrabold text-tertiary dark:text-ouro-suave mb-5">
            <span aria-hidden="true" className="inline-block w-10 h-px bg-ouro-suave" />
            Trajetória
          </p>
        </StaggerItem>
        <StaggerItem>
          <h2 id="trajetoria" className="font-headline font-medium text-3xl md:text-4xl leading-[1.12] text-on-background dark:text-stone-100">
            Do hospital ao consultório, <em className="italic text-primary dark:text-emerald-400">sempre perto de gente.</em>
          </h2>
        </StaggerItem>
      </StaggerReveal>

      <StaggerReveal className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8" staggerInterval={0.12}>
        {ETAPAS.map((etapa) => (
          <StaggerItem key={etapa.num} className="h-full">
            <article className="h-full bg-white dark:bg-stone-900 rounded-[28px] p-8 shadow-float-1 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-float-2">
              <span className="font-headline italic text-ouro-suave text-lg">{etapa.num}</span>
              <h3 className="font-headline font-medium text-xl text-on-background dark:text-stone-100 mt-2 mb-3">{etapa.titulo}</h3>
              <div aria-hidden="true" className="w-16 h-px bg-ouro-suave mb-4" />
              <p className="text-sm text-on-surface-variant dark:text-stone-400 leading-relaxed">{etapa.texto}</p>
            </article>
          </StaggerItem>
        ))}
      </StaggerReveal>
    </section>
  );
}
