import { Link } from 'react-router-dom';
import { StaggerReveal, StaggerItem } from '../ui/StaggerReveal';
import { MagneticButton } from '../ui/MagneticButton';
import marianaProfile from '../../assets/mariana-profile.webp';
import posthog from 'posthog-js';

// ============================================================
// EditorialHero — hero da direção "Editorial Orgânico".
// Substitui o par CinematicHero + hero de vídeo/canvas: uma dobra
// única, leve (zero vídeo/WebGL above the fold), com display Lora,
// filete dourado, prova social e foto com selo glass.
// ============================================================

interface Props {
  ctaText?: string;
  ctaVariant?: string | null;
}

export function EditorialHero({ ctaText = 'Começar minha jornada', ctaVariant }: Props) {
  return (
    <section className="relative min-h-[88vh] flex items-center bg-background dark:bg-stone-950 transition-colors duration-500 overflow-hidden">
      {/* Névoa verde sutil no canto — profundidade sem custo */}
      <div aria-hidden="true" className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-verde-nevoa/60 dark:bg-emerald-900/20 blur-[120px] pointer-events-none" />

      <div className="w-full px-6 md:px-12 grid md:grid-cols-[1.1fr_.9fr] gap-12 md:gap-[5vw] items-center pt-32 pb-16 md:py-24 max-w-[1440px] mx-auto">
        <StaggerReveal className="text-center md:text-left">
          <StaggerItem>
            <p className="inline-flex items-center gap-3 text-[0.68rem] tracking-[0.26em] uppercase font-extrabold text-tertiary dark:text-ouro-suave mb-6">
              <span aria-hidden="true" className="hidden md:inline-block w-10 h-px bg-ouro-suave" />
              Nutrição comportamental · CRN-3
            </p>
          </StaggerItem>

          <StaggerItem>
            <h1 className="font-headline font-medium text-[2.6rem] sm:text-5xl lg:text-[4.2rem] leading-[1.06] tracking-[-0.02em] text-on-background dark:text-stone-100 mb-6">
              Você não precisa de mais uma dieta.{' '}
              <em className="italic text-primary dark:text-emerald-400 block mt-2">
                Precisa de um plano que caiba na sua vida.
              </em>
            </h1>
          </StaggerItem>

          <StaggerItem>
            <p className="text-lg md:text-xl font-light text-on-surface-variant dark:text-stone-400 leading-relaxed max-w-[46ch] mx-auto md:mx-0">
              Acompanhamento 360º que olha para o seu corpo, a sua rotina e a sua
              relação com a comida — sem terrorismo nutricional, sem cardápio de gaveta.
            </p>
          </StaggerItem>

          <StaggerItem>
            <div className="flex flex-col sm:flex-row items-center gap-5 mt-9 justify-center md:justify-start">
              <MagneticButton as="div" className="w-full sm:w-auto">
                <Link
                  to="/planos"
                  onClick={() => posthog.capture('hero_cta_clicked', { variant: ctaVariant || 'control' })}
                  data-cursor="Ver Planos"
                  className="inline-flex w-full sm:w-auto justify-center items-center gap-2 bg-verde-profundo dark:bg-emerald-500 text-background dark:text-stone-950 px-9 py-4 rounded-full font-semibold text-[0.95rem] shadow-float-1 hover:shadow-float-2 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                >
                  {ctaText} <span aria-hidden="true" className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </MagneticButton>
              <Link
                to="/sobre"
                data-cursor="Conhecer"
                className="font-semibold text-[0.95rem] text-on-background dark:text-stone-200 border-b border-ouro-suave pb-1 hover:border-tertiary transition-colors"
              >
                Ver como funciona
              </Link>
            </div>
          </StaggerItem>

          <StaggerItem>
            <dl className="flex items-start gap-9 md:gap-12 mt-14 pt-7 border-t border-surface-variant dark:border-stone-800 justify-center md:justify-start">
              {[
                { valor: '360º', rotulo: 'corpo · mente · rotina' },
                { valor: '1:1', rotulo: 'curadoria humana' },
                { valor: '0', rotulo: 'dietas de gaveta' },
              ].map((item) => (
                <div key={item.rotulo}>
                  <dt className="sr-only">{item.rotulo}</dt>
                  <dd className="font-headline font-medium text-2xl md:text-[1.7rem] text-on-background dark:text-stone-100">{item.valor}</dd>
                  <dd className="text-[0.68rem] uppercase tracking-[0.12em] text-on-surface-variant dark:text-stone-500 mt-1">{item.rotulo}</dd>
                </div>
              ))}
            </dl>
          </StaggerItem>
        </StaggerReveal>

        {/* Foto com selo glass */}
        <StaggerReveal className="relative max-w-[440px] w-full mx-auto md:mx-0 md:justify-self-end">
          <StaggerItem>
            <div className="relative">
              <div className="aspect-[4/5] rounded-[32px] overflow-hidden shadow-float-2 bg-verde-nevoa dark:bg-stone-900">
                <img
                  src={marianaProfile}
                  alt="Mariana Bermudes, nutricionista, sorrindo em seu consultório"
                  className="w-full h-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
              <div className="absolute -bottom-6 -left-4 md:-left-8 bg-white/75 dark:bg-stone-900/80 backdrop-blur-xl border border-white/80 dark:border-stone-700 rounded-[20px] px-6 py-4 shadow-float-1">
                <p className="font-headline font-medium text-on-background dark:text-stone-100">Mariana Bermudes</p>
                <p className="text-xs text-on-surface-variant dark:text-stone-400">Nutricionista · São Paulo & online</p>
              </div>
            </div>
          </StaggerItem>
        </StaggerReveal>
      </div>
    </section>
  );
}
