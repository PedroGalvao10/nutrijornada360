import { useEffect } from 'react';

/**
 * Hook para criar sombras de paralaxe dinâmicas que reagem ao scroll.
 * Simula uma fonte de luz que se desloca conforme o usuário navega.
 * 
 * OTIMIZAÇÃO: O loop rAF agora pausa automaticamente quando nenhum elemento
 * .parallax-shadow está visível no viewport, economizando CPU/GPU.
 */
export function useDynamicShadow(dependencies: unknown[] = []) {
  useEffect(() => {
    // Range máximo de deslocamento em pixels
    const MAX_X = 12;
    const MAX_Y = 16;
    const LERP_FACTOR = 0.08; // Suavidade da transição (0 a 1)

    // Armazenar os valores atuais para interpolação (LERP)
    const currentValues = new Map<HTMLElement, { x: number; y: number; py: number }>();
    const visibleElements = new Set<HTMLElement>();
    let rafId: number = 0;
    let isLoopRunning = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleElements.add(entry.target as HTMLElement);
          } else {
            visibleElements.delete(entry.target as HTMLElement);
          }
        });

        // STEP: Iniciar/parar o loop baseado na visibilidade
        if (visibleElements.size > 0 && !isLoopRunning) {
          isLoopRunning = true;
          rafId = requestAnimationFrame(animate);
        }
        // Se não há elementos visíveis, o loop para naturalmente no próximo frame
      },
      { threshold: 0, rootMargin: '200px 0px' }
    );

    const elements = document.querySelectorAll('.parallax-shadow');
    elements.forEach((el) => {
      observer.observe(el);
      // Inicializar valores
      currentValues.set(el as HTMLElement, { x: 0, y: 10, py: 0 });
    });

    const animate = () => {
      // STEP: Pausa quando nenhum elemento está visível
      if (visibleElements.size === 0) {
        isLoopRunning = false;
        rafId = 0;
        return;
      }

      const vh = window.innerHeight;
      const vCenter = vh / 2;

      visibleElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const elCenterY = rect.top + rect.height / 2;
        
        // Fator de posição relativa ao centro do viewport [-1 a 1]
        const factor = (elCenterY - vCenter) / vh;
        
        // Objetivos (Target)
        const targetX = factor * MAX_X;
        const targetY = 10 + (factor * MAX_Y); // Base de 10px + deslocamento
        const targetPY = factor * -15; // Paralaxe interno da imagem (oposto)

        // Obter valores anteriores
        const current = currentValues.get(el) || { x: 0, y: 10, py: 0 };

        // Aplicar LERP para suavidade extrema
        const nextX = current.x + (targetX - current.x) * LERP_FACTOR;
        const nextY = current.y + (targetY - current.y) * LERP_FACTOR;
        const nextPY = current.py + (targetPY - current.py) * LERP_FACTOR;

        // Atualizar variáveis CSS
        el.style.setProperty('--shadow-x', `${nextX.toFixed(2)}px`);
        el.style.setProperty('--shadow-y', `${nextY.toFixed(2)}px`);
        el.style.setProperty('--parallax-y', `${nextPY.toFixed(2)}px`);

        // Salvar estado atual
        currentValues.set(el, { x: nextX, y: nextY, py: nextPY });
      });

      rafId = requestAnimationFrame(animate);
    };

    // Iniciar loop apenas se já houver elementos visíveis
    if (visibleElements.size > 0) {
      isLoopRunning = true;
      rafId = requestAnimationFrame(animate);
    }

    return () => {
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
      isLoopRunning = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
