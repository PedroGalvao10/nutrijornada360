/* cspell:disable-file */
import { useEffect, useRef } from 'react';

/**
 * useScrollCanvas — Hook dedicado para a sequência de frames scroll-linked do Hero.
 * Extraído da Home.tsx para manter o componente enxuto e a lógica reutilizável.
 *
 * STEP 1: Pré-carrega os primeiros 20 frames para exibição imediata.
 * STEP 2: Carrega os restantes em background via requestIdleCallback (ou setTimeout fallback).
 * STEP 3: Renderiza o frame atual com interpolação suave (LERP 0.2).
 * STEP 4: Pausa o render loop quando o canvas não está visível no viewport.
 */

interface ScrollCanvasConfig {
  canvasId: string;
  containerId: string;
  frameCount: number;
  framePath: (index: number) => string;
  preloadCount?: number;
}

export function useScrollCanvas({
  canvasId,
  containerId,
  frameCount,
  framePath,
  preloadCount = 20,
}: ScrollCanvasConfig) {
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const stateRef = useRef({ frame: 0, targetFrame: 0 });
  const rafIdRef = useRef<number>(0);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    // STEP 0: Apenas desktop — no mobile o vídeo roda em autoplay
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    if (isMobile) return;

    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    const container = document.getElementById(containerId);
    if (!canvas || !container) return;

    const context = canvas.getContext('2d', { alpha: false });
    if (!context) return;

    const images: HTMLImageElement[] = [];
    const state = stateRef.current;

    // STEP 1: Inicializar array de imagens
    for (let i = 1; i <= frameCount; i++) {
      images.push(new Image());
    }
    imagesRef.current = images;

    // STEP 2: Função de carregamento por faixa
    const loadImages = (start: number, end: number) => {
      for (let i = start; i <= end; i++) {
        if (!images[i - 1].src) {
          images[i - 1].src = framePath(i);
        }
      }
    };

    // Carregamento imediato dos primeiros frames
    loadImages(1, preloadCount);

    // STEP 3: Carregamento em background dos frames restantes via requestIdleCallback
    const loadRest = () => {
      if (!images || images.length === 0) return;

      const chunkSize = 10;
      let currentStart = preloadCount + 1;

      const loadNextChunk = () => {
        if (currentStart > frameCount) return;

        const currentEnd = Math.min(currentStart + chunkSize - 1, frameCount);
        loadImages(currentStart, currentEnd);
        currentStart += chunkSize;

        // Usa requestIdleCallback se disponível, caso contrário setTimeout
        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(loadNextChunk, { timeout: 300 });
        } else {
          setTimeout(loadNextChunk, 150);
        }
      };

      setTimeout(loadNextChunk, 500);
    };

    if (document.readyState === 'complete') {
      loadRest();
    } else {
      window.addEventListener('load', loadRest, { once: true });
    }

    // STEP 4: Desenha o frame usando preenchimento "cover" mantendo proporção
    const drawFrame = (frameIndex: number) => {
      const currentCanvas = document.getElementById(canvasId) as HTMLCanvasElement;
      if (!currentCanvas || !context) return;

      const img = images[frameIndex];
      if (!img || !img.complete || img.naturalWidth === 0) return;

      try {
        const hRatio = currentCanvas.width / img.naturalWidth;
        const vRatio = currentCanvas.height / img.naturalHeight;
        const ratio = Math.max(hRatio, vRatio);
        const centerShift_x = (currentCanvas.width - img.naturalWidth * ratio) / 2;
        const centerShift_y = (currentCanvas.height - img.naturalHeight * ratio) / 2;

        context.clearRect(0, 0, currentCanvas.width, currentCanvas.height);
        context.drawImage(
          img, 0, 0, img.naturalWidth, img.naturalHeight,
          centerShift_x, centerShift_y, img.naturalWidth * ratio, img.naturalHeight * ratio,
        );
      } catch (e) {
        console.error('Erro ao desenhar no canvas:', e);
      }
    };

    // STEP 5: Dimensionamento do canvas
    const setCanvasSize = () => {
      const currentCanvas = document.getElementById(canvasId) as HTMLCanvasElement;
      if (!currentCanvas) return;
      const parent = currentCanvas.parentElement;
      if (parent) {
        currentCanvas.width = parent.clientWidth;
        currentCanvas.height = parent.clientHeight;
        if (images[state.frame] && images[state.frame].complete) {
          drawFrame(state.frame);
        }
      }
    };

    let resizeTimer: number;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(setCanvasSize, 200);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    setCanvasSize();

    // Frame inicial
    if (images[0]) {
      images[0].onload = () => drawFrame(0);
      if (images[0].complete) drawFrame(0);
    }

    // STEP 6: Render loop com interpolação (LERP) e pausa inteligente
    const renderLoop = () => {
      if (!isVisibleRef.current) {
        rafIdRef.current = 0;
        return; // Pausa quando fora do viewport
      }

      if (state.targetFrame !== Math.round(state.frame)) {
        const difference = state.targetFrame - state.frame;
        if (Math.abs(difference) <= 0.1) {
          state.frame = state.targetFrame;
        } else {
          state.frame += difference * 0.2;
        }
        drawFrame(Math.round(state.frame));
        rafIdRef.current = requestAnimationFrame(renderLoop);
      } else {
        rafIdRef.current = 0;
      }
    };

    // STEP 7: IntersectionObserver para pausar quando o canvas sai do viewport
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
          if (entry.isIntersecting && !rafIdRef.current) {
            renderLoop();
          }
        });
      },
      { threshold: 0, rootMargin: '200px 0px' },
    );
    visibilityObserver.observe(container);

    // STEP 8: Scroll handler
    const onScroll = () => {
      const currentContainer = document.getElementById(containerId);
      if (!currentContainer) return;

      const rect = currentContainer.getBoundingClientRect();
      const containerTop = rect.top;
      const containerHeight = rect.height - window.innerHeight;

      let progress = 0;
      if (containerTop > 0) {
        progress = 0;
      } else if (containerTop < -containerHeight) {
        progress = 1;
      } else if (containerHeight > 0) {
        progress = Math.abs(containerTop) / containerHeight;
      }

      const newTarget = Math.min(
        frameCount - 1,
        Math.floor(progress * (frameCount - 1)),
      );

      if (newTarget !== state.targetFrame) {
        state.targetFrame = newTarget;
        if (!rafIdRef.current && isVisibleRef.current) {
          renderLoop();
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    renderLoop();
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('load', loadRest);
      visibilityObserver.disconnect();
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [canvasId, containerId, frameCount, framePath, preloadCount]);
}
