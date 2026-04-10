import { useEffect, type RefObject } from 'react';
import { gsap } from 'gsap';

export function useTilt(ref: RefObject<HTMLElement | null>, intensity: number = 10) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMouseEnter = () => {
      gsap.to(el, {
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const px = x / rect.width;
      const py = y / rect.height;
      
      const tiltX = (py - 0.5) * intensity;
      const tiltY = (px - 0.5) * -intensity;
      
      // Cálculo das sombras sincronizadas (oposto à inclinação)
      const shadowX = tiltY * 1.2;
      const shadowY = -tiltX * 1.2;

      gsap.to(el, {
        rotateX: tiltX,
        rotateY: tiltY,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto'
      });

      // Atualiza variáveis de sombra para elementos com .parallax-shadow
      if (el.classList.contains('parallax-shadow')) {
        el.style.setProperty('--shadow-x', `${shadowX.toFixed(2)}px`);
        el.style.setProperty('--shadow-y', `${(10 + shadowY).toFixed(2)}px`);
      }
    };

    const onMouseLeave = () => {
      gsap.to(el, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto'
      });

      // Resetar sombras
      if (el.classList.contains('parallax-shadow')) {
        el.style.setProperty('--shadow-x', '0px');
        el.style.setProperty('--shadow-y', '10px');
      }
    };

    el.addEventListener('mouseenter', onMouseEnter);
    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseleave', onMouseLeave);

    return () => {
      el.removeEventListener('mouseenter', onMouseEnter);
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [ref, intensity]);
}
