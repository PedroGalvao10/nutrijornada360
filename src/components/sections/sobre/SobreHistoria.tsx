import { StaggerReveal, StaggerItem } from '../../ui/StaggerReveal';
import aprovadaCuscs from '../../../assets/aprovada-cuscs.jpg';

// ============================================================
// SobreHistoria — a história pessoal (essência + superação),
// citação editorial em faixa verde-profundo e os três pilares
// (missão, valores, propósito) em cartões numerados.
// ============================================================

const PILARES = [
  {
    num: 'Nº 01',
    titulo: 'Missão',
    texto: 'Promover saúde integral com uma nutrição consciente e humanizada, unindo ciência e bem-estar emocional.',
  },
  {
    num: 'Nº 02',
    titulo: 'Valores',
    texto: 'Empatia, rigor científico, transparência e respeito absoluto à individualidade de cada pessoa.',
  },
  {
    num: 'Nº 03',
    titulo: 'Propósito',
    texto: 'Transformar a relação das pessoas com a comida, devolvendo liberdade de escolha e vitalidade.',
  },
];

export function SobreHistoria() {
  return (
    <>
      {/* História pessoal em faixa creme-2 */}
      <section aria-labelledby="historia" className="bg-creme-2 dark:bg-stone-900/60 transition-colors duration-500">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 py-20 md:py-28 grid md:grid-cols-[.9fr_1.1fr] gap-12 md:gap-[5vw] items-center">
          <StaggerReveal className="relative max-w-[420px] w-full mx-auto md:mx-0">
            <StaggerItem>
              <div className="aspect-[4/5] rounded-[32px] overflow-hidden shadow-float-2 bg-verde-nevoa dark:bg-stone-900">
                <img
                  src={aprovadaCuscs}
                  alt="Mariana comemorando a aprovação na faculdade de Nutrição"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </div>
            </StaggerItem>
          </StaggerReveal>

          <StaggerReveal>
            <StaggerItem>
              <p className="inline-flex items-center gap-3 text-[0.68rem] tracking-[0.26em] uppercase font-extrabold text-tertiary dark:text-ouro-suave mb-5">
                <span aria-hidden="true" className="inline-block w-10 h-px bg-ouro-suave" />
                Minha história
              </p>
            </StaggerItem>
            <StaggerItem>
              <h2 id="historia" className="font-headline font-medium text-3xl md:text-4xl leading-[1.12] text-on-background dark:text-stone-100 mb-6">
                Da cozinha de casa <em className="italic text-primary dark:text-emerald-400">ao propósito de cuidar.</em>
              </h2>
            </StaggerItem>
            <StaggerItem>
              <p className="text-on-surface-variant dark:text-stone-400 leading-relaxed mb-5">
                Minha história começa com o cheiro de comida de verdade vindo da
                cozinha. Desde a infância, aprendi que se alimentar é um ato de
                carinho e de conexão — com as pessoas e com a natureza.
              </p>
            </StaggerItem>
            <StaggerItem>
              <p className="text-on-surface-variant dark:text-stone-400 leading-relaxed">
                Também enfrentei e superei transtornos alimentares. Essa vivência me
                mostrou o lado sensível da nutrição e moldou a forma como atendo
                hoje: com empatia, sem julgamento e com o compromisso de ajudar cada
                paciente a encontrar paz com o próprio prato.
              </p>
            </StaggerItem>
          </StaggerReveal>
        </div>
      </section>

      {/* Citação em faixa verde-profundo */}
      <section aria-label="Citação de Mariana Bermudes" className="bg-verde-profundo dark:bg-emerald-950">
        <div className="max-w-[900px] mx-auto px-6 md:px-12 py-20 md:py-28 text-center">
          <StaggerReveal>
            <StaggerItem>
              <span aria-hidden="true" className="inline-block w-16 h-px bg-ouro-suave mb-8" />
            </StaggerItem>
            <StaggerItem>
              <blockquote className="font-headline italic font-medium text-2xl md:text-[2rem] leading-[1.35] text-background mb-8">
                “Acredito em uma nutrição que acolhe sem julgar, fundamentada no
                rigor técnico. Cada pessoa é única, e o plano alimentar deve
                respeitar sua história, suas emoções e seus objetivos.”
              </blockquote>
            </StaggerItem>
            <StaggerItem>
              <p className="text-ouro-suave text-[0.72rem] tracking-[0.22em] uppercase font-extrabold">
                Mariana Bermudes · Nutricionista · CRN-3
              </p>
            </StaggerItem>
          </StaggerReveal>
        </div>
      </section>

      {/* Pilares */}
      <section aria-labelledby="pilares" className="max-w-[1280px] mx-auto px-6 md:px-12 py-20 md:py-28">
        <StaggerReveal className="max-w-2xl mb-12">
          <StaggerItem>
            <p className="inline-flex items-center gap-3 text-[0.68rem] tracking-[0.26em] uppercase font-extrabold text-tertiary dark:text-ouro-suave mb-5">
              <span aria-hidden="true" className="inline-block w-10 h-px bg-ouro-suave" />
              O que me guia
            </p>
          </StaggerItem>
          <StaggerItem>
            <h2 id="pilares" className="font-headline font-medium text-3xl md:text-4xl leading-[1.12] text-on-background dark:text-stone-100">
              Três pilares, <em className="italic text-primary dark:text-emerald-400">nenhum negociável.</em>
            </h2>
          </StaggerItem>
        </StaggerReveal>

        <StaggerReveal className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8" staggerInterval={0.12}>
          {PILARES.map((pilar) => (
            <StaggerItem key={pilar.num} className="h-full">
              <article className="h-full bg-white dark:bg-stone-900 rounded-[28px] p-8 shadow-float-1 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-float-2">
                <span className="font-headline italic text-ouro-suave text-lg">{pilar.num}</span>
                <h3 className="font-headline font-medium text-xl text-on-background dark:text-stone-100 mt-2 mb-3">{pilar.titulo}</h3>
                <div aria-hidden="true" className="w-16 h-px bg-ouro-suave mb-4" />
                <p className="text-sm text-on-surface-variant dark:text-stone-400 leading-relaxed">{pilar.texto}</p>
              </article>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </section>
    </>
  );
}
