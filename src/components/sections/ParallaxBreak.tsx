import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';

// ============================================================
// ParallaxBreak — quebra cinematográfica entre dobras (Smooth
// Scroll Hero, 21st.dev / Leva A do blueprint de imersão).
// Uma "janela" de clip-path que se abre conforme o scroll,
// enquanto o vídeo por trás faz zoom-out (170%→100%) — a tela
// parece mergulhar para dentro da cena. Adaptado do original:
// progresso relativo ao próprio componente (funciona no meio
// da página, não só no topo) e vídeo local leve (ambiente.webm,
// 0.9MB) no lugar de imagem do Unsplash.
// ============================================================

interface Props {
  /** Altura extra de scroll dedicada ao efeito (vh). */
  scrollVh?: number;
  /** Legenda mínima sobreposta ao fim da abertura. */
  caption?: string;
}

export function ParallaxBreak({ scrollVh = 120, caption = 'Comer bem é um ambiente, não uma batalha.' }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // Progresso 0→1 enquanto o bloco atravessa a viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Janela abre: 25/75% → 0/100% (tela cheia)
  const clipStart = useTransform(scrollYProgress, [0, 0.55], [25, 0]);
  const clipEnd = useTransform(scrollYProgress, [0, 0.55], [75, 100]);
  const clipPath = useMotionTemplate`polygon(${clipStart}% ${clipStart}%, ${clipEnd}% ${clipStart}%, ${clipEnd}% ${clipEnd}%, ${clipStart}% ${clipEnd}%)`;

  // Zoom-out do vídeo: mergulho para dentro da cena
  const scale = useTransform(scrollYProgress, [0, 1], [1.7, 1]);

  // Legenda surge quando a janela está quase toda aberta
  const captionOpacity = useTransform(scrollYProgress, [0.45, 0.65], [0, 1]);

  return (
    <div ref={ref} style={{ height: `calc(${scrollVh}vh + 100vh)` }} className="relative w-full">
      <motion.div
        className="sticky top-0 h-screen w-full overflow-hidden bg-verde-profundo"
        style={{ clipPath, willChange: 'transform' }}
      >
        <motion.video
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ scale }}
          src="/videos/ambiente.webm"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        {/* Véu para legibilidade da legenda */}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-verde-profundo/60 via-transparent to-transparent" />

        <motion.p
          style={{ opacity: captionOpacity }}
          className="absolute bottom-[12vh] left-1/2 -translate-x-1/2 w-full px-6 text-center font-headline font-medium italic text-2xl md:text-4xl text-background leading-snug"
        >
          {caption}
        </motion.p>
      </motion.div>
    </div>
  );
}
