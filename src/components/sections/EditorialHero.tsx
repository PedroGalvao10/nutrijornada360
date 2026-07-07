import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { LiquidText, TextEffect } from '../ui/text-animations';
import { MagneticButton } from '../ui/MagneticButton';
import { Typewriter } from '../ui/Typewriter';
import { useBooking } from '../../context/BookingContext';
import { Star } from 'lucide-react';

// ============================================================
// EditorialHero — hero imersiva da Home. Três sistemas em camadas:
// 1. Entrada: título revela palavra-a-palavra por máscara (blur+y),
//    badge/sub/CTAs em cascata.
// 2. Mouse: parallax de profundidade em 3 planos (vídeo anda contra,
//    conteúdo acompanha, card flutua com tilt 3D) — um único loop
//    rAF com LERP escrevendo direto no style (zero setState/frame).
// 3. Scroll: saída em profundidade (conteúdo e card sobem em
//    velocidades diferentes, vídeo aproxima e escurece).
// prefers-reduced-motion desliga 2 e 3; pointer coarse desliga 2.
// ============================================================

interface Props {
  ctaText?: string;
  ctaVariant?: string | null;
}

// Título revelado palavra-a-palavra: cada palavra sobe de dentro de
// uma máscara com blur, em cascata — entrada editorial cinematográfica.
function WordReveal({ text, className = '', wordClassName = '', baseDelay = 0 }: { text: string; className?: string; wordClassName?: string; baseDelay?: number }) {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
          {/* Gradiente clipado precisa viver NA palavra: spans animados viram
              layers próprias e o background-clip do ancestral não os pinta. */}
          <motion.span
            className={`inline-block ${wordClassName}`}
            initial={{ y: '110%', filter: 'blur(8px)', opacity: 0 }}
            animate={{ y: '0%', filter: 'blur(0px)', opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: baseDelay + i * 0.07 }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  );
}

// Entrada em cascata para os blocos abaixo do título
const rise = (delay: number) => ({
  initial: { y: 28, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay },
});

export function EditorialHero({ ctaText = 'Começar minha jornada' }: Props) {
  const heroRef = useRef<HTMLElement>(null);
  const { openBooking } = useBooking();
  const videoLayerRef = useRef<HTMLDivElement>(null);
  const contentLayerRef = useRef<HTMLDivElement>(null);
  const cardLayerRef = useRef<HTMLDivElement>(null);

  // ── Sistema 3: saída em profundidade no scroll ──
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const cardY = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1.06, 1.22]);
  const veilOpacity = useTransform(scrollYProgress, [0, 0.8], [0, 0.55]);

  // ── Sistema 2: parallax de profundidade por mouse (LERP em rAF) ──
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let targetX = 0, targetY = 0, curX = 0, curY = 0;
    let rafId = 0;
    let running = false;

    const onMove = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      targetX = ((e.clientX - r.left) / r.width - 0.5) * 2;   // -1..1
      targetY = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const onLeave = () => { targetX = 0; targetY = 0; };

    const tick = () => {
      curX += (targetX - curX) * 0.06;
      curY += (targetY - curY) * 0.06;
      // Plano de fundo anda CONTRA o cursor (profundidade)
      if (videoLayerRef.current)
        videoLayerRef.current.style.transform = `translate3d(${curX * -12}px, ${curY * -8}px, 0)`;
      // Conteúdo acompanha de leve
      if (contentLayerRef.current)
        contentLayerRef.current.style.transform = `translate3d(${curX * 10}px, ${curY * 7}px, 0)`;
      // Card flutua mais e inclina em 3D na direção do cursor
      if (cardLayerRef.current)
        cardLayerRef.current.style.transform =
          `perspective(1100px) translate3d(${curX * 20}px, ${curY * 14}px, 0) rotateX(${curY * -3.5}deg) rotateY(${curX * 4.5}deg)`;
      rafId = requestAnimationFrame(tick);
    };

    const start = () => { if (!running) { running = true; rafId = requestAnimationFrame(tick); } };
    const stop = () => { running = false; cancelAnimationFrame(rafId); };

    // Roda só com a hero à vista
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0 });
    io.observe(hero);

    hero.addEventListener('pointermove', onMove, { passive: true });
    hero.addEventListener('pointerleave', onLeave);
    return () => {
      io.disconnect();
      stop();
      hero.removeEventListener('pointermove', onMove);
      hero.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-[95vh] flex items-center bg-stone-950 overflow-hidden text-stone-100">

      {/* BACKGROUND VIDEO — aproxima no scroll, anda contra o mouse */}
      <motion.div style={{ scale: videoScale }} className="absolute inset-0 z-0 overflow-hidden will-change-transform">
        <div ref={videoLayerRef} className="absolute -inset-4 will-change-transform">
          <video
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="/videos/bg_nutri.webm" type="video/webm" />
            <source src="/videos/bg_nutri.mp4" type="video/mp4" />
          </video>
        </div>
        {/* OVERLAYS FOR CONTRAST */}
        <div className="absolute inset-0 bg-stone-950/15 backdrop-blur-[3px]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/60 via-stone-950/10 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-stone-950/70"></div>
        {/* Véu que escurece conforme a hero sai de cena */}
        <motion.div style={{ opacity: veilOpacity }} className="absolute inset-0 bg-stone-950 pointer-events-none" />
      </motion.div>

      <div className="relative z-10 w-full px-6 md:px-12 flex flex-col md:flex-row items-center pt-32 pb-16 md:py-24 max-w-[1440px] mx-auto gap-12">
        {/* COL 1: CONTENT — plano médio do parallax */}
        <motion.div style={{ y: contentY }} className="w-full md:w-3/5 lg:w-1/2">
          <div ref={contentLayerRef} className="text-left will-change-transform">
            <motion.div {...rise(0.1)}>
              {/* BADGE */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8">
                <Star className="w-3.5 h-3.5 text-ouro-suave fill-ouro-suave" />
                <span className="text-[0.65rem] tracking-[0.2em] uppercase font-bold text-stone-200">
                  Nutrição Comportamental & Acompanhamento 360º
                </span>
              </div>
            </motion.div>

            <h1 className="font-headline font-medium text-[2.6rem] sm:text-5xl lg:text-[4.2rem] leading-[1.06] tracking-[-0.02em] text-white mb-6">
              <WordReveal text="Você não precisa de mais uma dieta." baseDelay={0.25} />
              <span className="block mt-2">
                <em className="italic">
                  <WordReveal
                    text="Precisa de um plano que caiba na sua vida."
                    wordClassName="bg-clip-text text-transparent bg-gradient-to-r from-ouro-suave via-ouro to-stone-200"
                    baseDelay={0.65}
                  />
                </em>
              </span>
            </h1>

            <motion.p {...rise(1.15)}>
              <div className="mt-8 text-lg md:text-xl font-light text-stone-300 max-w-xl leading-relaxed">
                <TextEffect text="O primeiro passo para o emagrecimento consciente não começa no prato. Começa na mente. Descubra um método onde você não precisa brigar com seu próprio corpo." preset="blur" delay={0.3} />
              </div>
            </motion.p>

            <motion.div {...rise(1.35)}>
              <div className="flex flex-col sm:flex-row items-center gap-5 justify-start">
                <MagneticButton as="div" className="inline-block">
                  <button
                    type="button"
                    onClick={() => openBooking()}
                    data-cursor="Agendar"
                    className="no-glass group relative inline-flex items-center justify-center bg-white text-stone-900 rounded-full py-4 px-8 md:py-5 md:px-10 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-ouro-suave scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                    <span className="relative z-10 flex items-center gap-3 font-semibold uppercase tracking-wider text-sm">
                      <LiquidText text={ctaText} />
                      <span className="material-symbols-outlined text-lg leading-none transform group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </span>
                  </button>
                </MagneticButton>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* COL 2: INSPIRATIONAL BLOCK — primeiro plano do parallax (tilt 3D) */}
        <motion.div style={{ y: cardY }} className="w-full md:w-2/5 lg:w-1/2 relative hidden md:block">
          <div ref={cardLayerRef} className="will-change-transform" style={{ transformStyle: 'preserve-3d' }}>

            <motion.div {...rise(1.15)}>
              {/* INSPIRATIONAL BLOCK */}
              <div className="relative p-6 md:p-8 rounded-[2rem] border border-white/10 border-t-white/30 border-l-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden">
                <div className="absolute inset-0 bg-black/30 -z-10" style={{ WebkitBackdropFilter: 'blur(40px)', backdropFilter: 'blur(40px)' }}></div>
                <div className="absolute inset-0 opacity-[0.08] pointer-events-none -z-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }}></div>
                <div className="absolute top-0 left-0 w-24 h-24 bg-ouro/5 rounded-full blur-[40px] -z-10" />
                <blockquote className="relative z-10 text-center min-h-[5rem] flex items-center justify-center">
                  <p className="text-base md:text-lg italic font-headline text-stone-200 leading-relaxed">
                    "<Typewriter
                      phrases={[
                        "Dietas restritivas falham com você. Vamos construir um caminho de paz com a comida.",
                        "Não existem alimentos proibidos. Existe equilíbrio, contexto e autoconhecimento.",
                        "O peso na balança não te define. O foco está nos seus hábitos diários.",
                        "Você merece comer sem culpa. Vamos reprogramar sua mente para uma vida mais leve."
                      ]}
                    />"
                  </p>
                </blockquote>
              </div>
            </motion.div>
          </div>
        </motion.div>

      </div>

      {/* Indicador de scroll — fio dourado que respira */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2"
      >
        <span className="text-[0.58rem] tracking-[0.3em] uppercase font-extrabold text-stone-400">Role</span>
        <div className="w-px h-10 bg-gradient-to-b from-ouro-suave/80 to-transparent overflow-hidden">
          <motion.div
            className="w-full h-3 bg-ouro-suave"
            animate={{ y: [-12, 40] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  );
}
