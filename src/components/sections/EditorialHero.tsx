import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MagneticButton } from '../ui/MagneticButton';
import { Typewriter } from '../ui/Typewriter';
import posthog from 'posthog-js';
import {
  ArrowRight,
  Play,
  Target,
  Star,
  Activity,
  MessageSquare,
  Sparkles,
  Check
} from "lucide-react";

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

export function EditorialHero({ ctaText = 'Começar minha jornada', ctaVariant }: Props) {
  const heroRef = useRef<HTMLElement>(null);
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

      <div className="relative z-10 w-full px-6 md:px-12 grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-[4vw] items-center pt-32 pb-16 md:py-24 max-w-[1440px] mx-auto">

        {/* COL 1: CONTENT — plano médio do parallax */}
        <motion.div style={{ y: contentY }}>
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

            <motion.p
              {...rise(1.15)}
              className="text-lg md:text-xl font-light text-stone-300 leading-relaxed max-w-[46ch] mb-10"
            >
              Acompanhamento que olha para o seu corpo, a sua rotina e a sua
              relação com a comida — sem terrorismo nutricional, sem cardápio de gaveta.
            </motion.p>

            <motion.div {...rise(1.35)}>
              <div className="flex flex-col sm:flex-row items-center gap-5 justify-start">
                <MagneticButton as="div" className="w-full sm:w-auto">
                  <Link
                    to="/planos"
                    onClick={() => posthog.capture('hero_cta_clicked', { variant: ctaVariant || 'control' })}
                    data-cursor="Ver Planos"
                    className="inline-flex w-full sm:w-auto justify-center items-center gap-2 bg-verde-profundo text-white px-8 py-4 rounded-full font-semibold text-[0.95rem] shadow-[0_0_40px_rgba(30,58,42,0.5)] hover:shadow-[0_0_60px_rgba(30,58,42,0.8)] border border-white/10 transition-all duration-300 hover:scale-[1.02]"
                  >
                    {ctaText} <ArrowRight className="w-4 h-4" />
                  </Link>
                </MagneticButton>
                <Link
                  to="/sobre"
                  data-cursor="Conhecer"
                  className="group flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-[0.95rem] font-semibold text-stone-200 w-full sm:w-auto backdrop-blur-sm"
                >
                  <Play className="w-4 h-4 group-hover:text-ouro-suave transition-colors" />
                  Ver como funciona
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* COL 2: STORYTELLING CARDS — primeiro plano do parallax (tilt 3D) */}
        <motion.div style={{ y: cardY }} className="w-full max-w-lg mx-auto lg:mx-0 lg:ml-auto relative">
          <div ref={cardLayerRef} className="will-change-transform" style={{ transformStyle: 'preserve-3d' }}>
            <motion.div {...rise(0.9)}>
              {/* MAIN METHOD CARD */}
              <div className="relative p-6 md:p-8 rounded-[2rem] border border-white/10 border-t-white/30 border-l-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden">
                {/* Glass Backdrop fix for stacking context */}
                <div className="absolute inset-0 bg-black/30 -z-10" style={{ WebkitBackdropFilter: 'blur(40px)', backdropFilter: 'blur(40px)' }}></div>
                {/* Textura de vidro (Ruído) */}
                <div className="absolute inset-0 opacity-[0.08] pointer-events-none -z-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }}></div>
                {/* Subtle gold glow inside card */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-ouro-suave/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 -z-10" />

                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
                    <h3 className="text-2xl font-headline font-semibold text-stone-100 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-ouro-suave" />
                      O Método 360º
                    </h3>
                    <span className="text-xs tracking-wider uppercase font-bold text-ouro-suave px-3 py-1.5 rounded-md bg-ouro/10 border border-ouro/20">
                      Sua Jornada
                    </span>
                  </div>

                  {/* Vertical Step Timeline */}
                  <div className="space-y-6">
                    {/* Step 1 */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-ouro/20 border border-ouro-suave/30 flex items-center justify-center text-ouro-suave text-base font-semibold shrink-0">
                          1
                        </div>
                        <div className="w-px h-full bg-white/10 my-1"></div>
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-stone-100 flex items-center gap-2">
                          Investigar
                          <Activity className="w-3.5 h-3.5 text-ouro-suave/70" />
                        </h4>
                        <p className="text-sm text-stone-300 mt-1.5 leading-relaxed">
                          Análise profunda da sua rotina e relação com a comida.
                        </p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-ouro/20 border border-ouro-suave/30 flex items-center justify-center text-ouro-suave text-base font-semibold shrink-0">
                          2
                        </div>
                        <div className="w-px h-full bg-white/10 my-1"></div>
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-stone-100 flex items-center gap-2">
                          Personalizar
                          <Target className="w-3.5 h-3.5 text-ouro-suave/70" />
                        </h4>
                        <p className="text-sm text-stone-300 mt-1.5 leading-relaxed">
                          Metas reais que se adaptam de verdade à sua vida.
                        </p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-ouro/20 border border-ouro-suave/30 flex items-center justify-center text-ouro-suave text-base font-semibold shrink-0">
                          3
                        </div>
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-stone-100 flex items-center gap-2">
                          Acompanhar
                          <MessageSquare className="w-3.5 h-3.5 text-ouro-suave/70" />
                        </h4>
                        <p className="text-sm text-stone-300 mt-1.5 leading-relaxed">
                          Suporte contínuo e ajustes práticos para o dia a dia.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer tags */}
                  <div className="mt-8 pt-4 border-t border-white/5 flex gap-3 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-stone-200">
                      <Check className="w-3 h-3 text-ouro-suave" /> Sem Dietas Restritivas
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-stone-200">
                      <Check className="w-3 h-3 text-ouro-suave" /> Foco Comportamental
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div {...rise(1.15)}>
              {/* INSPIRATIONAL BLOCK */}
              <div className="mt-6 p-6 rounded-[1.5rem] border border-white/10 border-t-white/30 border-l-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden">
                {/* Glass Backdrop fix for stacking context */}
                <div className="absolute inset-0 bg-black/30 -z-10" style={{ WebkitBackdropFilter: 'blur(40px)', backdropFilter: 'blur(40px)' }}></div>
                {/* Textura de vidro (Ruído) */}
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
