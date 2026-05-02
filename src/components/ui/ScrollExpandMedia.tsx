import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
interface ScrollExpandMediaProps {
  bgVideo?: string;
  centralVideo?: string;
  title?: string;
  subtitle?: string;
  onComplete?: () => void;
}

/**
 * PORTAL IMERSIVO — Custom Scroll Interception
 * 
 * ARQUITETURA:
 * - Container com height 100vh puro (sem sticky wrapper).
 * - Uma trava virtual (`mediaFullyExpanded` false) onde todos os eventos de 
 *   wheel/touchmove alimentam um motionValue de 0 a 1.
 * - Quando "1" é alcançado, a trava se solta, page scrolla normalmente.
 */
export const ScrollExpandMedia: React.FC<ScrollExpandMediaProps> = ({
  bgVideo = "/videos/bg_portal",
  centralVideo = "/videos/portal_video",
  title = "Mariana Bermudes",
  subtitle = "Nutrição de Precisão & Bem-Estar",
  onComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const portalVideoRef = useRef<HTMLVideoElement>(null);
  const completeFiredRef = useRef(false);

  const [mediaFullyExpanded, setMediaFullyExpanded] = useState(false);
  const rawProgress = useMotionValue(0);

  // Mola configurada para uma fluidez extrema e orgânica (stiffness menor, damping balanceado)
  const smoothProgress = useSpring(rawProgress, {
    stiffness: 200,
    damping: 35,
    restDelta: 0.0001,
  });

  // --- LÓGICA DE INTERCEPTAÇÃO DE SCROLL ---
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Impede o scroll nativo se a mídia ainda não expandiu toda
      if (!mediaFullyExpanded) {
        e.preventDefault();
        const delta = e.deltaY * 0.004; // Ajuste da sensibilidade
        const next = Math.min(Math.max(rawProgress.get() + delta, 0), 1);
        rawProgress.set(next);
      } else {
        // Se a página estiver no topo e o usuário rolar para CIMA, inicia animação reversa
        if (window.scrollY <= 0 && e.deltaY < 0) {
          e.preventDefault();
          setMediaFullyExpanded(false);
          completeFiredRef.current = false;
          const delta = e.deltaY * 0.004;
          const next = Math.min(Math.max(rawProgress.get() + delta, 0), 1);
          rawProgress.set(next);
        }
      }
    };

    let lastTouchY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const deltaY = lastTouchY - e.touches[0].clientY;
      lastTouchY = e.touches[0].clientY;
      
      if (!mediaFullyExpanded) {
        e.preventDefault();
        const delta = deltaY * 0.006; // Mais sensível no mobile
        const next = Math.min(Math.max(rawProgress.get() + delta, 0), 1);
        rawProgress.set(next);
      } else {
        if (window.scrollY <= 0 && deltaY < 0) {
          e.preventDefault();
          setMediaFullyExpanded(false);
          completeFiredRef.current = false;
          const delta = deltaY * 0.006;
          const next = Math.min(Math.max(rawProgress.get() + delta, 0), 1);
          rawProgress.set(next);
        }
      }
    };

    // Impede teclas de página de fazer scroll prematuro
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!mediaFullyExpanded && ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' '].includes(e.key)) {
        e.preventDefault();
        const delta = (['ArrowDown', 'PageDown', ' '].includes(e.key) ? 100 : -100) * 0.003;
        const next = Math.min(Math.max(rawProgress.get() + delta, 0), 1);
        rawProgress.set(next);
      } else if (mediaFullyExpanded && window.scrollY <= 0 && ['ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        setMediaFullyExpanded(false);
        completeFiredRef.current = false;
        const delta = -100 * 0.003;
        const next = Math.min(Math.max(rawProgress.get() + delta, 0), 1);
        rawProgress.set(next);
      }
    };

    // Em vez de forçar o scrollTo(0,0), o que causa salto e travamentos visuais, 
    // travamos a rolagem no CSS nativo do navegador.
    if (!mediaFullyExpanded) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    // É preciso { passive: false } para garantir o funcionamento do e.preventDefault()
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('keydown', handleKeyDown, { passive: false });

    // Safety net: garante restauração do overflow em navegação abrupta
    const restoreOverflow = () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
    window.addEventListener('pagehide', restoreOverflow);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') restoreOverflow();
    });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('pagehide', restoreOverflow);
      restoreOverflow();
    };
  }, [mediaFullyExpanded, rawProgress]);


  // --- INTERPOLAÇÕES DE ANIMAÇÃO NO PROGRESSO [0, 1] ---

  // Agora todo o curso linear 0-1 é nosso espaço de animação isolado
  const width = useTransform(smoothProgress, [0, 1], ["40%", "100%"]);
  const height = useTransform(smoothProgress, [0, 1], ["30%", "100%"]);
  const borderRadius = useTransform(smoothProgress, [0, 0.8], ["24px", "0px"]);

  // Opacidade do fade do portal (só aparece no final da expansão)
  const portalFadeOpacity = useTransform(smoothProgress, [0.8, 1], [0, 1]);

  // Texto da marca "NutriJornada 360º" (Menos transparente e mais nítido)
  const brandTextOpacity = useTransform(smoothProgress, [0.9, 1], [0, 0.4]);
  const brandTextScale = useTransform(smoothProgress, [0.9, 1], [0.9, 1]);

  // Elementos de UI (Desaparecem no inicio da expansão)
  const textOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0]);
  const textScale = useTransform(smoothProgress, [0, 0.3], [1, 0.8]);
  const indicatorOpacity = useTransform(smoothProgress, [0, 0.1], [1, 0]);



  // --- SINCRONIZAÇÃO DA TRANSIÇÃO ---
  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (latest) => {
      if (latest >= 0.99 && !completeFiredRef.current) {
        completeFiredRef.current = true;
        setMediaFullyExpanded(true); // Destrava do scroll nativo *apenas* quando a animação visual atingir o preenchimento total
        onComplete?.();
      }
    });

    return () => unsubscribe();
  }, [smoothProgress, onComplete]);

  return (
    <div ref={containerRef} className="portal-hero-section flex items-center justify-center">
        
      {/* CAMADA 0: BG Imersivo (com filtro verde escuro leve) */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#1a2e26]">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="w-full h-full object-cover"
        >
          <source src={`${bgVideo}.webm`} type="video/webm" />
        </video>
        {/* Filtro verde escuro leve sobreposto ao vídeo */}
        <div className="absolute inset-0 bg-[#1a2e26]/40 pointer-events-none" />
        {/* Gradiente de transição suave para o container de baixo (Hero) */}
        <div className="absolute bottom-0 left-0 right-0 h-[15vh] bg-gradient-to-t from-[#faf6f0] to-transparent z-10 pointer-events-none" />
      </div>

      {/* --- CONTEÚDO CENTRALIZADO --- */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        
        {/* Título Central — "Mariana Bermudes" */}
        <motion.div 
          style={{ opacity: textOpacity, scale: textScale }}
          className="absolute z-30 flex flex-col items-center text-center px-6 pointer-events-none"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-[#f0fff4] title-premium mb-4">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-[#f0fff4]/70 font-medium subtitle-premium tracking-[0.4em]">
            {subtitle}
          </p>
        </motion.div>

        {/* O Portal */}
        <motion.div 
          style={{ width, height, borderRadius }}
          className="relative z-20 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] will-change-portal"
        >
          <video 
            ref={portalVideoRef}
            autoPlay
            loop
            muted 
            playsInline
            preload="auto"
            className="w-full h-full object-cover will-change-video-transform"
          >
            <source src={`${centralVideo}.webm`} type="video/webm" />
          </video>
          {/* Fade interno do portal para suavizar com o container de baixo quando preenchido */}
          <motion.div 
            style={{ opacity: portalFadeOpacity }}
            className="absolute bottom-0 left-0 right-0 h-[15vh] bg-gradient-to-t from-[#faf6f0] to-transparent z-10 pointer-events-none" 
          />

          {/* Texto de Identidade: NutriJornada 360º */}
          <motion.div
            style={{ opacity: brandTextOpacity, scale: brandTextScale }}
            className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none z-20"
          >
            <span className="text-white font-headline text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold text-center leading-none tracking-tighter mix-blend-overlay whitespace-nowrap">
              NutriJornada 360º
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Indicador de Scroll */}
      <motion.div 
        style={{ opacity: indicatorOpacity }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <div className="text-[#f0fff4]/40 text-[10px] tracking-[0.4em] uppercase font-bold">Scroll para imergir</div>
        <div className="w-[1px] h-12 bg-gradient-to-b from-[#f0fff4]/40 to-transparent" />
      </motion.div>

    </div>
  );
};

export default ScrollExpandMedia;
