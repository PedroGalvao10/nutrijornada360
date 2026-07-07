import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useViewportVisibility } from '../../hooks/useViewportVisibility';
import { StaggerReveal, StaggerItem } from '../ui/StaggerReveal';
import { MagneticButton } from '../ui/MagneticButton';
import { TextEffect } from '../ui/text-animations';

export function PlansSection() {
  const plansVideoRef = useRef<HTMLVideoElement>(null);
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
    <section className="relative py-32 md:py-48 flex flex-col items-center justify-center overflow-hidden w-full bg-stone-900 border-none">
      {/* Video Background Layer (Cinematic) */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <video 
          ref={plansVideoRef}
          muted 
          playsInline 
          loop
          preload="metadata"
          className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-60 brightness-75 saturate-50 blur-[2px] scale-[1.05]"
        >
          <source src="/bg-plans.webm" type="video/webm" />
          <source src="/bg-plans.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-stone-950/70 mix-blend-multiply"></div>
        {/* Soft fade masks */}
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-stone-950 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-stone-950 to-transparent z-10 pointer-events-none"></div>
      </div>

      <div className="relative z-20 w-full max-w-[1200px] mx-auto px-6 md:px-12">
        
        {/* Editorial Header */}
        <StaggerReveal className="mb-24 text-center flex flex-col items-center">
          <StaggerItem>
            <p className="inline-flex items-center gap-3 text-[0.65rem] tracking-[0.26em] uppercase font-bold text-ouro-suave mb-8">
              <span aria-hidden="true" className="inline-block w-8 h-[1px] bg-ouro-suave/50" />
              Jornadas de Cuidado
              <span aria-hidden="true" className="inline-block w-8 h-[1px] bg-ouro-suave/50" />
            </p>
          </StaggerItem>
          <StaggerItem>
            <h2 className="text-4xl md:text-5xl lg:text-[4.5rem] leading-[1.05] tracking-[-0.02em] font-medium text-white mb-8">
              Como podemos <br />
              <em className="italic text-verde-nevoa/90">caminhar juntos.</em>
            </h2>
          </StaggerItem>
          <StaggerItem>
            <div className="text-lg md:text-xl font-light text-stone-400 max-w-2xl text-center leading-relaxed">
              <TextEffect text="Escolha o formato que melhor abraça o seu momento de vida. Sem pacotes engessados, apenas o cuidado que você precisa, na intensidade exata." preset="blur" delay={0.2} />
            </div>
          </StaggerItem>
        </StaggerReveal>

        {/* Membership / Care Journeys */}
        <StaggerReveal 
          className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-stretch"
          staggerInterval={0.2}
        >
          {/* Option 1 */}
          <StaggerItem>
            <div className="group h-full flex flex-col relative transition-all duration-700">
              <div className="mb-8">
                <span className="font-handwriting text-3xl text-ouro-suave/80 block mb-4">A Essência</span>
                <h3 className="text-4xl font-headline text-white mb-6">Acompanhamento Pontual</h3>
                <div className="w-12 h-[1px] bg-white/20 mb-6 group-hover:w-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                <p className="text-stone-300 font-light leading-relaxed text-lg mb-8">
                  Um primeiro passo firme e direcionado. Juntas, mergulhamos na sua rotina atual para fazer ajustes precisos que já começam a transformar sua relação com a comida. Ideal para check-ups ou demandas específicas.
                </p>
              </div>
              
              <div className="mt-auto pt-8">
                <MagneticButton as="div" className="inline-block">
                  <Link to="/planos" className="text-sm font-bold tracking-widest uppercase text-stone-200 group-hover:text-ouro-suave transition-colors flex items-center gap-3">
                    Agendar Sessão
                    <span className="material-symbols-outlined text-lg leading-none transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </Link>
                </MagneticButton>
              </div>
            </div>
          </StaggerItem>

          {/* Option 2 (Premium/Recommended) */}
          <StaggerItem>
            <div className="group h-full flex flex-col relative transition-all duration-700 md:pl-12 md:border-l border-white/10">
              <div className="mb-8">
                <span className="font-handwriting text-4xl text-verde-nevoa block mb-4">A Transformação</span>
                <h3 className="text-4xl font-headline text-white mb-6">Jornada 360º</h3>
                <div className="w-12 h-[1px] bg-white/20 mb-6 group-hover:w-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                <p className="text-stone-300 font-light leading-relaxed text-lg mb-8">
                  O meu cuidado de ponta a ponta. Mais do que consultas, eu seguro a sua mão durante o processo inteiro. Suporte diário, materiais de apoio e uma verdadeira reestruturação do seu estilo de vida.
                </p>
              </div>
              
              <div className="mt-auto pt-8">
                <MagneticButton as="div" className="inline-block w-full sm:w-auto">
                  <Link 
                    to="/planos" 
                    className="inline-flex items-center justify-center gap-3 bg-white text-stone-900 rounded-full py-4 px-8 font-semibold tracking-wide uppercase text-sm hover:bg-ouro-suave transition-colors duration-500"
                  >
                    Iniciar Transformação
                    <span className="material-symbols-outlined text-[18px] leading-none">arrow_forward</span>
                  </Link>
                </MagneticButton>
              </div>
            </div>
          </StaggerItem>

        </StaggerReveal>
      </div>
    </section>
  );
}
