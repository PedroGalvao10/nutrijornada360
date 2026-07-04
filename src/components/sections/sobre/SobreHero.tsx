import React, { useState, useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import marianaProfile from '../../../assets/mariana-profile.webp';

gsap.registerPlugin(ScrollTrigger);

// ============================================================
// SobreHero — dobra de abertura na direção "Editorial Orgânico",
// reconstruída sobre o padrão "Portfolio Hero": nome gigante em
// Lora com a foto da Mariana sobreposta ao centro. Texto entra
// com blur letra-a-letra (IntersectionObserver, sem libs).
// ============================================================

interface BlurTextProps {
  text: string;
  delay?: number;
  animateBy?: 'words' | 'letters';
  className?: string;
  as?: 'span' | 'p';
}

// Revela cada segmento saindo de blur+deslocamento quando entra em viewport.
const BlurText: React.FC<BlurTextProps> = ({ text, delay = 60, animateBy = 'letters', className = '', as = 'span' }) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setInView(true),
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const segments = useMemo(
    () => (animateBy === 'words' ? text.split(' ') : text.split('')),
    [text, animateBy]
  );

  const Tag = as as React.ElementType;
  return (
    <Tag ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {segments.map((segment, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            filter: inView ? 'blur(0px)' : 'blur(10px)',
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(-20px)',
            transition: `all 0.55s cubic-bezier(0.22,1,0.36,1) ${i * delay}ms`,
          }}
        >
          {segment === ' ' ? ' ' : segment}
          {animateBy === 'words' && i < segments.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
};

const nameClasses =
  'font-headline font-medium text-primary dark:text-emerald-400 ' +
  'text-[3.6rem] sm:text-[6rem] md:text-[8rem] lg:text-[10.5rem] ' +
  'leading-[0.78] tracking-[-0.04em] uppercase justify-center whitespace-nowrap';

export function SobreHero() {
  const heroRef = useRef<HTMLElement>(null);

  // Parallax de camadas na saída do hero (Parallax Scrolling, 21st.dev,
  // adaptado sem Lenis): ao rolar, cada camada sobe numa velocidade —
  // foto (mais próxima) rápida, nome médio, textos lentos — criando
  // profundidade real de cena. Scrub 0 = colado no dedo.
  useGSAP(
    () => {
      if (!heroRef.current) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0,
        },
      });

      const layers = [
        { layer: '1', yPercent: 60 }, // foto — primeiro plano
        { layer: '2', yPercent: 35 }, // nome gigante
        { layer: '3', yPercent: 15 }, // eyebrow + tagline
      ];
      layers.forEach((l, idx) => {
        tl.to(
          heroRef.current!.querySelectorAll(`[data-parallax-layer="${l.layer}"]`),
          { yPercent: -l.yPercent, ease: 'none' },
          idx === 0 ? undefined : '<'
        );
      });
    },
    { scope: heroRef }
  );

  return (
    <section ref={heroRef} className="relative overflow-hidden min-h-[92vh] flex flex-col">
      {/* Glow de fundo on-brand (único elemento animado leve da dobra) */}
      <div aria-hidden="true" className="absolute -top-40 -right-40 w-[560px] h-[560px] rounded-full bg-verde-nevoa/60 dark:bg-emerald-900/20 blur-[120px] pointer-events-none" />
      <div aria-hidden="true" className="absolute -bottom-52 -left-40 w-[520px] h-[520px] rounded-full bg-verde-nevoa/40 dark:bg-emerald-900/10 blur-[130px] pointer-events-none" />

      {/* Eyebrow — mantém a assinatura da página */}
      <div data-parallax-layer="3" className="relative z-20 max-w-[1280px] w-full mx-auto px-6 md:px-12 pt-28 md:pt-36">
        <p className="inline-flex items-center gap-3 text-[0.68rem] tracking-[0.26em] uppercase font-extrabold text-tertiary dark:text-ouro-suave">
          <span aria-hidden="true" className="inline-block w-10 h-px bg-ouro-suave" />
          Sobre Mariana
        </p>
      </div>

      {/* Nome gigante com foto sobreposta ao centro */}
      <div className="relative flex-1 flex items-center justify-center px-4">
        <div data-parallax-layer="2" className="relative text-center">
          <BlurText text="Mariana" animateBy="letters" delay={90} className={nameClasses} />
          <div aria-hidden="true" className="mx-auto my-3 md:my-5 h-px w-24 md:w-40 bg-ouro-suave/70" />
          <BlurText text="Bermudes" animateBy="letters" delay={90} className={nameClasses} />

          {/* Foto da Mariana — retrato sobreposto ao centro do nome */}
          <div data-parallax-layer="1" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-[92px] h-[150px] sm:w-[120px] sm:h-[195px] md:w-[150px] md:h-[240px] lg:w-[180px] lg:h-[290px] rounded-full overflow-hidden shadow-float-2 ring-1 ring-white/60 dark:ring-stone-700 transition-transform duration-500 hover:scale-105">
              <img
                src={marianaProfile}
                alt="Mariana Bermudes, nutricionista"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tagline / bio curta */}
      <div data-parallax-layer="3" className="relative z-20 pb-20 md:pb-28 px-6">
        <BlurText
          as="p"
          animateBy="words"
          delay={40}
          text="Nutricionista formada pelo São Camilo. Nutrição comportamental — porque comer bem passa menos por força de vontade e mais por um plano que respeita a sua rotina."
          className="max-w-[62ch] mx-auto text-center text-base md:text-lg font-light text-on-surface-variant dark:text-stone-400 leading-relaxed"
        />
      </div>
    </section>
  );
}
