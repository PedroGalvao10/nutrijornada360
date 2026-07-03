import { useEffect } from 'react';
import { TextMarquee } from '../components/ui/text-animations';
import { useDynamicShadow } from '../hooks/useDynamicShadow';
import { useScrollReveal } from '../hooks/useScrollReveal';
import SEO from '../components/SEO';
import Logistica from './Logistica';
import { ContainerScroll } from '../components/ui/container-scroll-animation';
import ArticlesSection from '../components/ArticlesSection';
import { EditorialHero } from '../components/sections/EditorialHero';
import { MissionSection } from '../components/sections/MissionSection';
import { AcompanhamentoSection } from '../components/sections/AcompanhamentoSection';
import { TestimonialsSection } from '../components/sections/TestimonialsSection';
import { PlansSection } from '../components/sections/PlansSection';
import { HomeToolsSection } from '../components/sections/HomeToolsSection';
import { useFeatureFlagVariantKey } from 'posthog-js/react';

// ============================================================
// Home — direção "Editorial Orgânico".
// Uma hero única e leve (EditorialHero) no lugar do antigo par
// CinematicHero + hero de vídeo/canvas + seção Spline: menos
// ~25MB de assets e dois rAF/WebGL a menos no caminho crítico.
// ============================================================

export default function Home() {
  useDynamicShadow();

  // PostHog A/B Testing Flag
  const ctaTextVariant = useFeatureFlagVariantKey('hero-cta-text-test');
  const ctaText = ctaTextVariant === 'test' ? 'Agende sua consulta' : 'Começar minha jornada';

  // STEP: Reveal on scroll (seed-fade-up)
  useScrollReveal('.seed-fade-up');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="font-body text-on-background dark:text-stone-300 bg-background dark:bg-stone-950 selection:bg-primary-container selection:text-on-primary-container transition-colors duration-500">
      <SEO
        title="Início | Mariana Bermudes Nutrição"
        description="Nutrição comportamental 360º com Mariana Bermudes: plano individualizado, acompanhamento contínuo e uma relação melhor com a comida."
      />

      {/* ═══ Hero editorial ═══ */}
      <EditorialHero ctaText={ctaText} ctaVariant={ctaTextVariant as string | null} />

      {/* Faixa marquee — verde profundo, tipografia editorial */}
      <section className="py-5 bg-verde-profundo dark:bg-stone-900">
        <TextMarquee
          text="SAÚDE INTEGRAL • EMAGRECIMENTO CONSCIENTE • COMPORTAMENTO ALIMENTAR • NUTRIÇÃO DE PRECISÃO • BEM-ESTAR • CIÊNCIA • EMPATIA •"
          className="text-sm md:text-base font-body font-semibold tracking-[0.3em] text-background/70"
          speed={40}
        />
      </section>

      {/* Missão */}
      <MissionSection />

      {/* Ferramentas inteligentes */}
      <HomeToolsSection />

      {/* O que está incluído no acompanhamento */}
      <AcompanhamentoSection />

      {/* Prova social — depoimentos reais */}
      <TestimonialsSection />

      {/* Planos */}
      <PlansSection />

      {/* Agendamento / logística */}
      <section className="bg-background dark:bg-stone-950 relative z-30 transition-colors duration-500 pt-10 md:pt-20 pb-40 md:pb-[25rem]">
        <ContainerScroll
          titleComponent={
            <h2 className="text-4xl md:text-5xl font-medium text-on-background dark:text-stone-100 font-headline mb-4 md:mb-0">
              Sua saúde a um clique.<br />
              <span className="text-4xl md:text-6xl lg:text-[6rem] font-medium mt-1 leading-none text-primary italic inline-block">
                Agende sua consulta
              </span>
            </h2>
          }
        >
          <Logistica />
        </ContainerScroll>
      </section>

      {/* Artigos */}
      <ArticlesSection />
    </div>
  );
}
