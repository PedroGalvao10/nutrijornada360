/* cspell:disable-file */
import { useEffect, type RefObject } from 'react';

/**
 * useTilt — inclinação 3D de cards via rAF puro (sem GSAP).
 * Lerp 0.12 para suavização; perspective(800px) dá profundidade real.
 * O loop só roda enquanto o card está ativo ou ainda desacelerando.
 */
export function useTilt(ref: RefObject<HTMLElement | null>, intensity: number = 10) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let targetRx = 0, targetRy = 0;
    let currentRx = 0, currentRy = 0;
    let rafId: number;
    let active = false;

    const tick = () => {
      currentRx += (targetRx - currentRx) * 0.12;
      currentRy += (targetRy - currentRy) * 0.12;

      el.style.transform = `perspective(800px) rotateX(${currentRx.toFixed(2)}deg) rotateY(${currentRy.toFixed(2)}deg)`;

      // Sombra sincronizada (oposta à inclinação) para elementos .parallax-shadow
      if (el.classList.contains('parallax-shadow')) {
        el.style.setProperty('--shadow-x', `${(-currentRy * 1.2).toFixed(2)}px`);
        el.style.setProperty('--shadow-y', `${(10 + currentRx * 1.2).toFixed(2)}px`);
      }

      // Continua o loop enquanto há interação ou movimento residual
      if (active || Math.abs(currentRx) > 0.01 || Math.abs(currentRy) > 0.01) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const onMove = (e: MouseEvent) => {
      const { left, top, width, height } = el.getBoundingClientRect();
      targetRx = -((e.clientY - top) / height - 0.5) * intensity;
      targetRy = ((e.clientX - left) / width - 0.5) * intensity;
    };

    const onEnter = () => {
      active = true;
      cancelAnimationFrame(rafId);
      tick();
    };

    const onLeave = () => {
      active = false;
      targetRx = 0;
      targetRy = 0;
      tick(); // mantém o loop até desacelerar a ~0
    };

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafId);
    };
  }, [ref, intensity]);
}
