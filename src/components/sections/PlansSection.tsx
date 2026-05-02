import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTilt } from '../../hooks/useTilt';
import { useViewportVisibility } from '../../hooks/useViewportVisibility';
import { StaggerReveal, StaggerItem } from '../ui/StaggerReveal';
import { GlowWrapper } from '../ui/GlowWrapper';
import { MagneticButton } from '../ui/MagneticButton';
import { HulyTextHighlight } from '../HulyTextHighlight';

export function PlansSection() {
  const plansVideoRef = useRef<HTMLVideoElement>(null);
  
  // Refs para 3D Tilt - Planos
  const plano1Ref = useRef<HTMLDivElement>(null);
  const plano2Ref = useRef<HTMLDivElement>(null);
  const plano3Ref = useRef<HTMLDivElement>(null);

  useTilt(plano1Ref, 10);
  useTilt(plano2Ref, 10);
  useTilt(plano3Ref, 10);

  const isPlansVideoVisible = useViewportVisibility(plansVideoRef);

  useEffect(() => {
    if (!plansVideoRef.current) return;
    if (isPlansVideoVisible) {
      plansVideoRef.current.play().catch(() => {});
    } else {
      plansVideoRef.current.pause();
    }
  }, [isPlansVideoVisible]);

  return (
    <section className="relative py-24 md:py-32 flex flex-col items-center justify-center overflow-hidden w-full bg-stone-900 border-none">
      {/* Video Background Layer */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-stone-900">
        <video 
          ref={plansVideoRef}
          muted 
          playsInline 
          loop
          preload="metadata"
          className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-90 brightness-75 saturate-[0.7] blur-[2px] scale-[1.02]"
        >
          <source src="/bg-plans.webm" type="video/webm" />
        </video>
        {/* Overlay mantendo o aspecto escuro sem usar o pesadíssimo backdrop-blur */}
        <div className="absolute inset-0 bg-stone-950/40"></div>
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-surface-variant dark:from-stone-900 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background dark:from-stone-950 to-transparent z-10 pointer-events-none"></div>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-6 w-full text-center md:text-left pt-10">
        <StaggerReveal className="mb-16 md:mb-24 md:w-3/4">
          <StaggerItem>
            <h2 className="text-5xl md:text-[4rem] font-headline text-white tracking-tight font-medium leading-[1.05] mb-6">
              Sua jornada começa aqui.
            </h2>
          </StaggerItem>
          <StaggerItem>
            <div className="text-xl md:text-2xl text-white/80 font-normal max-w-2xl leading-relaxed">
              <HulyTextHighlight
                text="Modalidades de atendimento desenhadas para integrar a nutrição ao seu estilo de vida da forma mais orgânica possível."
                highlightWords="integrar a nutrição ao seu estilo de vida"
              />
            </div>
          </StaggerItem>
        </StaggerReveal>

        <StaggerReveal 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          staggerInterval={0.2}
        >
          <StaggerItem>
            <GlowWrapper 
              ref={plano1Ref}
              className="parallax-shadow group antigravity-glass bg-white/5 dark:bg-black/20 border-white/20 rounded-[2.25rem] p-8 md:p-10 hover:bg-white/10 hover:border-white/30 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col relative overflow-hidden transform-style-3d h-full cursor-pointer"
              data-cursor="Foco Individual"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="w-14 h-14 rounded-full border border-white/20 bg-white/5 flex items-center justify-center mb-10 text-white/90 group-hover:scale-110 transition-transform duration-700 ease-out tilt-child tz-30">
                <span className="material-symbols-outlined font-light text-[24px]">person</span>
              </div>
              <h3 className="text-3xl font-headline text-white mb-5 tracking-tight font-medium tilt-child tz-20">Individual</h3>
              <div className="flex-grow">
                <p className="text-white/70 mb-12 font-light leading-relaxed text-lg tilt-child tz-10">Acompanhamento 100% focado no seu metabolismo e rotina.</p>
              </div>
              <div className="w-fit tilt-child tz-20">
                <MagneticButton as="div" className="w-fit">
                  <Link to="/planos" className="text-white font-medium flex items-center gap-2 group-hover:gap-4 transition-all duration-500 ease-out z-10">
                    Ver Plano
                    <span className="material-symbols-outlined text-sm font-bold leading-none opacity-80 group-hover:opacity-100 transform translate-y-px">arrow_forward</span>
                  </Link>
                </MagneticButton>
              </div>
            </GlowWrapper>
          </StaggerItem>

          <StaggerItem>
            <GlowWrapper 
              ref={plano2Ref}
              className="parallax-shadow group antigravity-glass bg-white/10 dark:bg-black/40 border-white/30 rounded-[2.25rem] p-8 md:p-10 hover:bg-white/20 hover:border-white/40 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col relative overflow-hidden transform-style-3d h-full cursor-pointer"
              data-cursor="Mais Popular"
            >
              <div className="absolute top-0 right-0 p-8">
                <div className="w-2 h-2 rounded-full bg-white/80 animate-pulse"></div>
              </div>
              <div className="w-14 h-14 rounded-full border border-white/30 bg-white/10 flex items-center justify-center mb-10 text-white group-hover:scale-110 transition-transform duration-700 ease-out tilt-child tz-30">
                <span className="material-symbols-outlined font-light text-[24px]">star</span>
              </div>
              <h3 className="text-3xl font-headline text-white mb-5 tracking-tight font-medium tilt-child tz-20">Premium 360º</h3>
              <div className="flex-grow">
                <p className="text-white/85 mb-14 font-light leading-relaxed text-lg tilt-child tz-10">Suporte direto via WhatsApp, lista de compras e plano com foco integrativo.</p>
              </div>
              <div className="w-full tilt-child tz-20">
                <MagneticButton as="div" className="w-full">
                  <Link 
                    to="/planos" 
                    className="w-full bg-white text-[#384a38] rounded-full py-5 px-6 flex items-center justify-between font-semibold group-hover:shadow-[0_8px_32_rgba(255,255,255,0.2)] group-hover:scale-[1.02] transition-all duration-500 ease-out z-10"
                    data-cursor="Assinar 360º"
                  >
                    Assinar Agora
                    <span className="material-symbols-outlined text-[18px] leading-none transform group-hover:translate-x-2 transition-transform duration-500 text-[#384a38] font-bold">arrow_forward</span>
                  </Link>
                </MagneticButton>
              </div>
            </GlowWrapper>
          </StaggerItem>

          <StaggerItem>
            <GlowWrapper 
              ref={plano3Ref}
              className="parallax-shadow group antigravity-glass bg-white/5 dark:bg-black/20 border-white/20 rounded-[2.25rem] p-8 md:p-10 hover:bg-white/10 hover:border-white/30 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col relative overflow-hidden transform-style-3d h-full cursor-pointer"
              data-cursor="Conforto Digital"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="w-14 h-14 rounded-full border border-white/20 bg-white/5 flex items-center justify-center mb-10 text-white/90 group-hover:scale-110 transition-transform duration-700 ease-out tilt-child tz-30">
                <span className="material-symbols-outlined font-light text-[24px]">computer</span>
              </div>
              <h3 className="text-3xl font-headline text-white mb-5 tracking-tight font-medium tilt-child tz-20">Online</h3>
              <div className="flex-grow">
                <p className="text-white/70 mb-12 font-light leading-relaxed text-lg tilt-child tz-10">Sessões terapêuticas nutricionais do conforto de onde você estiver.</p>
              </div>
              <div className="w-fit tilt-child tz-20">
                <MagneticButton as="div" className="w-fit">
                  <Link 
                    to="/planos" 
                    className="text-white font-medium flex items-center gap-2 group-hover:gap-4 transition-all duration-500 ease-out z-10"
                    data-cursor="Ver Online"
                  >
                    Ver Plano
                    <span className="material-symbols-outlined text-sm font-bold leading-none opacity-80 group-hover:opacity-100 transform translate-y-px">arrow_forward</span>
                  </Link>
                </MagneticButton>
              </div>
            </GlowWrapper>
          </StaggerItem>
        </StaggerReveal>
      </div>
    </section>
  );
}
