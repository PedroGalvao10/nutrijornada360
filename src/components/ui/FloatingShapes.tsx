import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function FloatingShapes() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const shapes = container.querySelectorAll('.floating-shape');
    
    shapes.forEach((shape, i) => {
      gsap.to(shape, {
        x: 'random(-50, 50)',
        y: 'random(-50, 50)',
        rotation: 'random(-15, 15)',
        duration: `random(10, 20)`,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.5
      });
    });
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30 dark:opacity-20 translate-z-0">
      <div className="floating-shape absolute top-[10%] left-[5%] w-64 h-64 bg-[#4a7c59]/10 rounded-full blur-3xl" />
      <div className="floating-shape absolute top-[60%] right-[10%] w-96 h-96 bg-[#705c30]/10 rounded-full blur-3xl" />
      <div className="floating-shape absolute bottom-[10%] left-[20%] w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
      <div className="floating-shape absolute top-[30%] left-[50%] w-48 h-48 bg-amber-200/10 rounded-full blur-2xl" />
    </div>
  );
}
