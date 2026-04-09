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
      
      gsap.to(el, {
        rotateX: tiltX,
        rotateY: tiltY,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    };

    const onMouseLeave = () => {
      gsap.to(el, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto'
      });
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
