import { useEffect, useRef } from 'react';
import { useSiteProgress } from '../../context/SiteProgressContext';

interface MarqueeVelocityProps {
  items: string[];        // textos a exibir
  separator?: string;     // separador entre itens (default: "·")
  baseSpeed?: number;     // px/frame base (default: 0.6)
  className?: string;
}

/**
 * MarqueeVelocity — banda de texto infinita que reage à velocidade de scroll.
 * Direção inverte conforme o sentido do scroll (com histerese para evitar jitter),
 * velocidade soma à base. rAF puro lendo velocityRef do SiteProgressProvider.
 */
export function MarqueeVelocity({ items, separator = '·', baseSpeed = 0.6, className = '' }: MarqueeVelocityProps) {
  const { velocityRef } = useSiteProgress();
  const trackRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);
  const dirRef = useRef(false); // false = esquerda, true = direita

  useEffect(() => {
    let raf: number;
    const tick = () => {
      const vel = velocityRef.current ?? 0;
      // Histerese: direção só muda ao ultrapassar ±0.4px/frame
      if (vel > 0.4) dirRef.current = false;  // scroll down → esquerda
      if (vel < -0.4) dirRef.current = true;  // scroll up → direita

      const speed = baseSpeed + Math.abs(vel) * 0.05;
      xRef.current += dirRef.current ? speed : -speed;

      const track = trackRef.current;
      if (track) {
        const half = track.scrollWidth / 2;
        if (half > 0) {
          if (xRef.current > 0) xRef.current -= half;
          if (xRef.current < -half) xRef.current += half;
        }
        track.style.transform = `translateX(${xRef.current.toFixed(2)}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [baseSpeed, velocityRef]);

  const content = items.map((item, i) => (
    <span key={i} className="flex items-center gap-8 whitespace-nowrap">
      <span className="text-2xl md:text-4xl font-black italic tracking-tighter text-primary dark:text-emerald-500/80 uppercase">
        {item}
      </span>
      <span className="w-2 h-2 rounded-full bg-[#705c30] dark:bg-amber-500/50 flex-shrink-0" aria-hidden="true" />
      {i === items.length - 1 && separator && (
        <span className="text-2xl md:text-4xl font-black italic tracking-tighter text-primary/40 uppercase">{separator}</span>
      )}
    </span>
  ));

  return (
    <div className={`overflow-hidden py-10 md:py-16 select-none border-y border-stone-200/50 dark:border-stone-800/50 bg-stone-50 dark:bg-stone-900/20 ${className}`}>
      <div ref={trackRef} className="flex items-center gap-8 will-change-transform">
        {content}{content}
      </div>
    </div>
  );
}
