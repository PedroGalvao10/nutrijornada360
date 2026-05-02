import { useEffect, useRef, useState, type RefObject } from 'react';

/**
 * useViewportVisibility — Hook genérico para detectar se um elemento está visível no viewport.
 * Consolida a lógica repetida de múltiplos IntersectionObservers na aplicação.
 *
 * @param ref - RefObject do elemento a observar
 * @param options - Opções do IntersectionObserver (threshold, rootMargin)
 * @returns isVisible: boolean — se o elemento está atualmente visível no viewport
 */

interface ViewportOptions {
  threshold?: number;
  rootMargin?: string;
  /** Se true, o observer se desconecta após a primeira detecção (padrão: false) */
  once?: boolean;
}

export function useViewportVisibility(
  ref: RefObject<HTMLElement | null>,
  options: ViewportOptions = {},
): boolean {
  const { threshold = 0, rootMargin = '0px', once = false } = options;
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once && observerRef.current) {
              observerRef.current.disconnect();
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      { threshold, rootMargin },
    );

    observerRef.current.observe(element);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [ref, threshold, rootMargin, once]);

  return isVisible;
}
