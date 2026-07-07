import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { InkReveal } from '../../ui/InkReveal';
import marianaProfile from '../../../assets/mariana-profile.webp';

gsap.registerPlugin(ScrollTrigger);

// ============================================================
// SobreHero — A Carta Aberta
// Removida a estética corporativa/portfolio de nome gigante.
// Adotamos um layout de carta aberta íntima com a foto da 
// Mariana como uma polaroid física colada ao lado.
// ============================================================

export function SobreHero() {
  const heroRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!heroRef.current) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      // Parallax sutil na foto polaroid
      tl.to('.polaroid-photo', { yPercent: 20, ease: 'none' }, 0);
    },
    { scope: heroRef }
  );

  return (
    <section ref={heroRef} className="relative overflow-hidden min-h-[85vh] flex flex-col bg-[#FDFBF7] dark:bg-stone-950">
      {/* Textura de Papel */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-multiply dark:mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

      <div className="relative max-w-[1280px] w-full mx-auto px-6 md:px-12 pt-32 md:pt-48 pb-20 flex-1 flex flex-col md:flex-row items-center md:items-start gap-12 md:gap-20">
        
        {/* Lado Esquerdo: A Foto Polaroid */}
        <div className="polaroid-photo w-full md:w-5/12 flex justify-center md:justify-end z-10">
          <div className="relative p-4 pb-16 bg-white dark:bg-stone-900 shadow-xl border border-stone-200 dark:border-stone-800 -rotate-2 transform hover:rotate-0 transition-all duration-500 w-[280px] sm:w-[320px] md:w-[380px] group overflow-hidden">
            {/* Durex no topo */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/60 dark:bg-stone-700/60 backdrop-blur-sm shadow-sm rotate-2 border border-black/5 z-20" />
            
            <div className="relative w-full aspect-[4/5] bg-stone-200 dark:bg-stone-800">
              <img
                src={marianaProfile}
                alt="Mariana Bermudes, nutricionista"
                className="w-full h-full object-cover grayscale-[0.2] contrast-[1.05]"
              />
              {/* O Ink Reveal cobre a imagem com a cor da página e o usuário "raspa" para ver a foto */}
              <InkReveal maskColor={[26, 38, 34]} brushSize={80} className="cursor-crosshair" />
              
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-100 group-hover:opacity-0 transition-opacity duration-700 z-10">
                <span className="text-white/70 font-handwriting text-2xl rotate-2">Passe o mouse...</span>
              </div>
            </div>

            <div className="absolute bottom-4 left-0 w-full text-center">
              <span className="font-handwriting text-2xl text-stone-600 dark:text-stone-400">Mariana Bermudes</span>
            </div>
          </div>
        </div>

        {/* Lado Direito: A Carta */}
        <div className="w-full md:w-7/12 flex flex-col justify-center max-w-xl z-20">
          <p className="inline-flex items-center gap-3 text-[0.68rem] tracking-[0.26em] uppercase font-extrabold text-stone-400 dark:text-stone-500 mb-8">
            <span aria-hidden="true" className="inline-block w-10 h-px bg-stone-300 dark:bg-stone-700" />
            Uma carta aberta
          </p>

          <h1 className="font-headline font-medium text-4xl sm:text-5xl md:text-6xl text-stone-900 dark:text-stone-100 leading-[1.1] mb-8">
            Prazer, Mariana. <br/>
            <em className="font-handwriting text-primary dark:text-emerald-500 text-5xl sm:text-6xl md:text-7xl">Mas me chame de Mari.</em>
          </h1>

          <div className="space-y-6 text-lg md:text-xl font-light text-stone-700 dark:text-stone-400 leading-relaxed">
            <p>
              Se você chegou até aqui, é provável que já tenha tentado de tudo. Restrições severas, chás milagrosos, promessas de resultados em trinta dias. E no fim, a culpa sempre parecia pesar mais que a balança.
            </p>
            <p>
              Eu sou nutricionista formada pelo Centro Universitário São Camilo, mas muito além do diploma, a minha escola de verdade foi a escuta.
            </p>
            <p>
              Decidi seguir o caminho da <strong>nutrição comportamental</strong> porque entendi que a comida não entra só no nosso estômago — ela senta à mesa com os nossos medos, ansiedades e a nossa rotina corrida de trabalho.
            </p>
          </div>

          <div className="mt-12">
            <p className="font-handwriting text-4xl text-stone-800 dark:text-stone-300">Vamos mudar essa história?</p>
          </div>
        </div>
      </div>
    </section>
  );
}
