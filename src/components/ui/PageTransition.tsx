import { useEffect, useRef, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animação de entrada da nova página
      gsap.fromTo(containerRef.current,
        { opacity: 0, y: 20, scale: 0.98 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.8, 
          ease: 'power3.out',
          delay: 0.2
        }
      );

      // Animação do overlay (opcional para efeito premium)
      gsap.fromTo(overlayRef.current,
        { scaleY: 1 },
        { scaleY: 0, duration: 0.8, ease: 'expo.inOut', transformOrigin: 'top' }
      );
    });

    return () => ctx.revert();
  }, [location.pathname]);

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Overlay de transição - Começa invisível (scaleY-0) por segurança */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 bg-primary z-50 pointer-events-none origin-top scale-y-0 transition-overlay-initial"
      />
      
      {/* Conteúdo da página - Começa visível (opacity-1) por segurança, GSAP fará o fade depois se possível */}
      <div 
        ref={containerRef} 
        className="w-full h-full opacity-100 page-container-initial"
      >
        {children}
      </div>
    </div>
  );
}
