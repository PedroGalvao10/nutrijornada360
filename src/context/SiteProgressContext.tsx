/* cspell:disable-file */
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from 'react';

/**
 * SiteProgressContext — Fonte única de sinais de animação para todo o site.
 *
 * ARQUITETURA (lição RegisGrumberg / AndreaClone):
 *   1 único requestAnimationFrame loop alimenta 3 refs compartilhados.
 *   Nenhum componente deve criar listener de scroll ou rAF próprio para
 *   estes sinais — todos leem os refs aqui dentro do seu próprio rAF.
 *
 * Por que refs e não state:
 *   scroll/mousemove disparam ~60×/s. setState causaria re-render em cascata
 *   de toda a árvore consumidora a cada frame. Refs mutáveis evitam React
 *   no caminho quente — zero reconciliação, zero flicker.
 *
 * Sinais expostos:
 *   progressRef → scroll global normalizado 0→1, suavizado por lerp 0.12
 *   velocityRef → delta de scrollY em px/frame, com sinal (>0 = descendo)
 *   mouseRef    → posição do mouse normalizada -1→1 (centro da tela = 0,0)
 */

interface SiteProgressValue {
  progressRef: RefObject<number>;
  velocityRef: RefObject<number>;
  mouseRef: RefObject<{ x: number; y: number }>;
}

const SiteProgressContext = createContext<SiteProgressValue | null>(null);

export function SiteProgressProvider({ children }: { children: ReactNode }) {
  // STEP: Refs mutáveis — atualizados fora do ciclo de render do React
  const progressRef = useRef(0);
  const velocityRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let rafId: number;
    let prevScrollY = window.scrollY;

    // STEP: Mouse normalizado para -1→1 (centro da tela = origem)
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    // STEP: Loop único — lê scrollY direto (mais barato que scroll listener)
    const tick = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      // velocidade = quanto o scroll andou desde o frame anterior
      velocityRef.current = scrollY - prevScrollY;
      prevScrollY = scrollY;

      // alvo normalizado 0→1, protegido contra divisão por zero
      const target = maxScroll > 0 ? scrollY / maxScroll : 0;
      // lerp para suavizar — o consumidor recebe um sinal já amaciado
      progressRef.current += (target - progressRef.current) * 0.12;

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <SiteProgressContext.Provider value={{ progressRef, velocityRef, mouseRef }}>
      {children}
    </SiteProgressContext.Provider>
  );
}

/**
 * Hook de consumo. Lança erro se usado fora do provider (fail-fast).
 * Uso típico — dentro de um rAF próprio do componente:
 *
 *   const { progressRef } = useSiteProgress();
 *   useEffect(() => {
 *     let raf: number;
 *     const tick = () => {
 *       el.style.transform = `scaleX(${progressRef.current})`;
 *       raf = requestAnimationFrame(tick);
 *     };
 *     raf = requestAnimationFrame(tick);
 *     return () => cancelAnimationFrame(raf);
 *   }, [progressRef]);
 */
export function useSiteProgress(): SiteProgressValue {
  const ctx = useContext(SiteProgressContext);
  if (!ctx) {
    throw new Error('useSiteProgress deve ser usado dentro de <SiteProgressProvider>');
  }
  return ctx;
}
