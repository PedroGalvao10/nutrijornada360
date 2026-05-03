import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { TypewriterText } from '../components/TypewriterText';
import { useDynamicShadow } from '../hooks/useDynamicShadow';
import { useScrollCanvas } from '../hooks/useScrollCanvas';
import { useViewportVisibility } from '../hooks/useViewportVisibility';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { StaggerReveal, StaggerItem } from '../components/ui/StaggerReveal';
import SEO from '../components/SEO';
import Logistica from './Logistica';
import { ContainerScroll } from '../components/ui/container-scroll-animation';
import { TextRotate } from '../components/ui/TextRotate';
import ArticlesSection from '../components/ArticlesSection';
import { MagneticButton } from '../components/ui/MagneticButton';
import { ScrollExpandMedia } from '../components/ui/ScrollExpandMedia';
import { SimuladorResultados } from '../components/SimuladorResultados';
import SplineSafe from '../components/ui/SplineSafe';
import NutritionMyths from '../components/NutritionMyths';
import { MissionSection } from '../components/sections/MissionSection';
import { PlansSection } from '../components/sections/PlansSection';
import { useFeatureFlagVariantKey } from 'posthog-js/react';
import posthog from 'posthog-js';

export default function Home() {
  useDynamicShadow();

  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const splineAreaRef = useRef<HTMLDivElement>(null);
  const [splineApp, setSplineApp] = useState<any>(null);

  const handleSplineLoad = (spline: unknown) => {
    if (spline && typeof spline === 'object') {
      const splineObj = spline as { setBackgroundColor?: (c: string) => void };
      if (typeof splineObj.setBackgroundColor === 'function') {
        splineObj.setBackgroundColor('transparent');
      }
    }
    setSplineApp(spline);
  };

  // PostHog A/B Testing Flag
  const ctaTextVariant = useFeatureFlagVariantKey('hero-cta-text-test');
  const ctaText = ctaTextVariant === 'test' ? 'Agende sua Consulta' : 'Começar minha jornada';

  // STEP: Scroll-linked canvas via hook dedicado (substituiu ~180 linhas de lógica inline)
  useScrollCanvas({
    canvasId: 'hero-canvas-desktop',
    containerId: 'video-hero-container',
    frameCount: 192,
    framePath: (index: number) => `/hero-frames/frame_${index.toString().padStart(4, '0')}.webp`,
    preloadCount: 20,
  });

  // STEP: Viewport visibility para pausar/retomar vídeos e Spline
  const isMobileVideoVisible = useViewportVisibility(mobileVideoRef);
  const isSplineVisible = useViewportVisibility(splineAreaRef, { rootMargin: '100px' });

  // STEP: Reveal on scroll (seed-fade-up)
  useScrollReveal('.seed-fade-up');

  // STEP: Mobile video pause/play baseado em visibilidade
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    if (!isMobile || !mobileVideoRef.current) return;
    if (isMobileVideoVisible) {
      mobileVideoRef.current.play().catch(() => {});
    } else {
      mobileVideoRef.current.pause();
    }
  }, [isMobileVideoVisible]);

  // STEP: Spline play/stop baseado em visibilidade
  useEffect(() => {
    if (!splineApp) return;
    if (isSplineVisible) {
      if (typeof splineApp.play === 'function') splineApp.play();
    } else {
      if (typeof splineApp.stop === 'function') splineApp.stop();
    }
  }, [isSplineVisible, splineApp]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const homeContent = (
    <div className="font-body text-on-background dark:text-stone-300 bg-background dark:bg-stone-950 selection:bg-primary-container selection:text-on-primary-container transition-colors duration-500">
      <ScrollExpandMedia onComplete={() => {
        window.dispatchEvent(new CustomEvent('portal-complete'));
      }} />
      <SEO 
        title="Início | Mariana Bermudes Nutrição"
        description="Nutrição de precisão e emagrecimento consciente com Mariana Bermudes. Transforme sua saúde com estratégias personalizadas."
      />
      {/* ═══ Hero Section (Parallax Video) ═══ */}
      <section id="video-hero-container" className="relative h-[160vh] md:h-[160vh] bg-background dark:bg-stone-950 transition-colors duration-1000">
        <div className="sticky top-0 h-screen overflow-hidden flex items-center">

          <div className="absolute inset-0 z-0 justify-end hidden md:flex">
            <div className="w-full h-full relative">
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent z-10"></div>
              {/* Suavização superior para encontro com o Portal */}
              <div className="absolute top-0 left-0 right-0 h-[10vh] bg-gradient-to-b from-background to-transparent z-10 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 right-0 h-[30vh] bg-gradient-to-t from-background to-transparent z-10 pointer-events-none"></div>
              <canvas
                id="hero-canvas-desktop"
                className="w-full h-full object-cover brightness-[0.85] saturate-[0.8]"
              ></canvas>
            </div>
          </div>

          {/* ── Background Video: Mobile (autoplay loop) ── */}
          <div className="absolute inset-0 z-0 flex md:hidden items-center justify-center">
            <div className="w-full h-full relative">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/40 z-10"></div>
              {/* Suavização superior Mobile */}
              <div className="absolute top-0 left-0 right-0 h-[10vh] bg-gradient-to-b from-background via-background/40 to-transparent z-10 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 right-0 h-[20vh] bg-gradient-to-t from-background to-transparent z-10 pointer-events-none"></div>
              <video
                ref={mobileVideoRef}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              >
                <source src="/hero-video-v2.webm" type="video/webm" />
              </video>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8 md:gap-16 items-center relative z-20 w-full pt-32 md:pt-0">
            {/* Hero text — entrada linha a linha */}
            <StaggerReveal className="space-y-5 md:space-y-8 max-w-2xl mx-auto md:mx-0 text-center md:text-left">

              <StaggerItem>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-secondary-container text-on-secondary-container font-medium text-xs md:text-sm border border-secondary/20 shadow-sm">
                  <span className="material-symbols-outlined text-sm">spa</span>
                  <span>Abordagem Comportamental &amp; Estética</span>
                </div>
              </StaggerItem>

              <StaggerItem>
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-body text-on-background dark:text-stone-100 leading-[1.1] font-bold tracking-tight mb-4">
                  <span className="block opacity-90">Faça as pazes</span>
                  <TextRotate
                    texts={[
                      "com a comida",
                      "com seu corpo",
                      "com o prazer de comer",
                      "com a sua saúde",
                      "com você mesma",
                      "com o equilíbrio",
                    ]}
                    mainClassName="text-primary font-headline"
                    staggerFrom="last"
                    initial={{ y: "20%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "-20%", opacity: 0 }}
                    staggerDuration={0.025}
                    rotationInterval={3000}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  />
                </h1>
              </StaggerItem>

              <StaggerItem>
                <div className="text-base sm:text-lg md:text-xl text-on-surface-variant dark:text-stone-400 leading-relaxed opacity-90 drop-shadow-md md:drop-shadow-none max-w-lg mx-auto md:mx-0 font-body">
                  <TypewriterText text="Um convite ao respeito profundo pelo próprio corpo e à nutrição que acolhe. Chega de restrições que ferem a sua essência." speed={35} delay={800} />
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-5 pt-2 md:pt-4 items-center justify-center md:justify-start">
                  <MagneticButton as="div" className="w-full sm:w-auto">
                    <Link 
                      to="/planos" 
                      onClick={() => posthog.capture('hero_cta_clicked', { variant: ctaTextVariant || 'control' })}
                      className="justify-center bg-tertiary text-white px-6 py-3 md:px-8 md:py-4 rounded-full text-base md:text-lg font-semibold transition-all duration-300 flex items-center gap-2 w-full sm:w-auto hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                      data-cursor="Ver Planos"
                    >
                      {ctaText} <span className="material-symbols-outlined">arrow_forward</span>
                    </Link>
                  </MagneticButton>
                  <MagneticButton as="div" className="w-full sm:w-auto">
                    <Link 
                      to="/sobre" 
                      className="justify-center flex items-center text-center bg-white/80 backdrop-blur-md border border-primary/20 text-primary px-6 py-3 md:px-8 md:py-4 rounded-full text-base md:text-lg font-semibold hover:bg-white hover:shadow-md transition-all duration-300 w-full sm:w-auto mt-0 h-full hover:scale-[1.02] active:scale-[0.98]"
                      data-cursor="Conhecer Método"
                    >
                      Conhecer o método
                    </Link>
                  </MagneticButton>
                </div>
              </StaggerItem>



            </StaggerReveal>
            {/* Right side empty — reserved for 3D element */}
            <div className="hidden md:flex justify-end items-end h-full pb-20"></div>
          </div>
        </div>
      </section>
      <NutritionMyths />

      {/* ═══ 3D Transition Section (NutriJornada 360º Creative Experience) ═══ */}
      <section className="w-full min-h-[600px] md:min-h-[750px] relative z-10 flex flex-col items-center justify-center overflow-visible bg-background dark:bg-stone-950 transition-colors duration-500 py-6 md:py-12">
        
        {/* Camada Central: Elemento 3D Spline (Compactado com Fade-out) */}
        <div className="relative z-10 w-full h-full flex items-center justify-center overflow-visible mask-vignette-vertical">
          <div ref={splineAreaRef} className="w-full max-w-[2200px] h-[500px] md:h-[900px] flex flex-col md:flex-row items-center justify-end pointer-events-auto transform-gpu">
            {/* Espaço reservado à esquerda para futuro conteúdo do usuário */}
            <div className="hidden md:block w-1/2 h-full z-30 relative px-6 md:px-12 flex items-center">
              {/* O conteúdo futuro pode ser inserido aqui */}
            </div>

            {/* Elemento 3D (DNA) posicionado à direita */}
            <div className="w-full md:w-1/2 h-full flex items-center justify-center relative">
              <SplineSafe 
                scene="https://prod.spline.design/23mP4RppmrjsD4Yo/scene.splinecode" 
                onLoad={handleSplineLoad}
                className="w-full h-full scale-[1.1] md:scale-125 lg:scale-[1.4] origin-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section (Ruixen Style) */}
      <MissionSection />

      {/* 🚀 Simulador de Resultados Interativo (Subiu: Gerador de Desejo) */}
      <SimuladorResultados />

      {/* Plans Section (Seed Inspired) */}
      <PlansSection />

      {/* 📦 Agendamento / Logística Tablet Viewer (Desceu: Resolvido o Desejo e Planos, agora a Logística) */}
      <section className="bg-background dark:bg-stone-950 relative z-30 transition-colors duration-500 pt-20 md:pt-40">
        <ContainerScroll
          titleComponent={
            <>
              <h1 className="text-4xl md:text-5xl font-semibold text-on-background dark:text-stone-100 font-headline mb-4 md:mb-0">
                Sua saúde a um clique. <br />
                <span className="text-4xl md:text-6xl lg:text-[6rem] font-bold mt-1 leading-none text-primary inline-block">
                  Agende sua consulta
                </span>
              </h1>
            </>
          }
        >
          <Logistica />
        </ContainerScroll>
      </section>

      {/* Articles Section - Restaurada para a Home */}
      <ArticlesSection />
    </div>
  );

  return homeContent;
}
