import { StaggerReveal, StaggerItem } from '../../ui/StaggerReveal';

// ============================================================
// SobreHero — dobra de abertura da página Sobre na direção
// "Editorial Orgânico": display Lora com itálico verde, filete
// dourado e vídeo da Mariana em cartão com selo glass.
// ============================================================

export function SobreHero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="absolute -top-40 -right-40 w-[560px] h-[560px] rounded-full bg-verde-nevoa/60 dark:bg-emerald-900/20 blur-[120px] pointer-events-none" />

      <div className="relative max-w-[1280px] mx-auto px-6 md:px-12 pt-32 md:pt-40 pb-16 md:pb-24 grid md:grid-cols-[1.1fr_.9fr] gap-12 md:gap-[5vw] items-center">
        <StaggerReveal>
          <StaggerItem>
            <p className="inline-flex items-center gap-3 text-[0.68rem] tracking-[0.26em] uppercase font-extrabold text-tertiary dark:text-ouro-suave mb-6">
              <span aria-hidden="true" className="inline-block w-10 h-px bg-ouro-suave" />
              Sobre Mariana
            </p>
          </StaggerItem>
          <StaggerItem>
            <h1 className="font-headline font-medium text-4xl sm:text-5xl lg:text-[3.6rem] leading-[1.08] tracking-[-0.02em] text-on-background dark:text-stone-100 mb-6">
              Por trás de cada plano alimentar,{' '}
              <em className="italic text-primary dark:text-emerald-400">uma história com a comida.</em>
            </h1>
          </StaggerItem>
          <StaggerItem>
            <p className="text-lg md:text-xl font-light text-on-surface-variant dark:text-stone-400 leading-relaxed max-w-[50ch]">
              Sou a Mariana Bermudes, nutricionista formada pelo Centro Universitário
              São Camilo. Trabalho com nutrição comportamental porque aprendi, na
              prática, que comer bem passa menos por força de vontade e mais por um
              plano que respeita a sua rotina.
            </p>
          </StaggerItem>
        </StaggerReveal>

        <StaggerReveal className="relative max-w-[420px] w-full mx-auto md:mx-0 md:justify-self-end" delay={0.2}>
          <StaggerItem>
            <div className="relative">
              <div className="aspect-[4/5] rounded-[32px] overflow-hidden shadow-float-2 bg-verde-nevoa dark:bg-stone-900 flex items-center justify-center">
                {/* Fundo espelhado desfocado preenche as bordas do vídeo em retrato */}
                <video
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover scale-125 blur-md opacity-85"
                  src="/videos/mariana_trabalhando_cropped.mp4"
                  autoPlay muted loop playsInline
                />
                <video
                  className="relative z-10 w-full h-full object-contain"
                  src="/videos/mariana_trabalhando_cropped.mp4"
                  autoPlay muted loop playsInline
                />
              </div>
              <div className="absolute -bottom-6 -left-4 md:-left-8 bg-white/75 dark:bg-stone-900/80 backdrop-blur-xl border border-white/80 dark:border-stone-700 rounded-[20px] px-6 py-4 shadow-float-1 z-20">
                <p className="font-headline font-medium text-on-background dark:text-stone-100">No consultório</p>
                <p className="text-xs text-on-surface-variant dark:text-stone-400">Atendimento presencial e online</p>
              </div>
            </div>
          </StaggerItem>
        </StaggerReveal>
      </div>
    </section>
  );
}
