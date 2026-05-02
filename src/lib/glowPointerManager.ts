/**
 * glowPointerManager — Módulo singleton para gerenciamento global de pointermove.
 *
 * PROBLEMA: Cada GlowWrapper registrava seu próprio listener `pointermove` na window.
 * Com 6+ cards na Home, isso gerava 6+ listeners redundantes processando o mesmo evento.
 *
 * SOLUÇÃO: Um único listener na window distribui as coordenadas para todos os elementos
 * registrados, usando WeakRef para evitar memory leaks quando componentes desmontam.
 */

type GlowElement = HTMLElement;

class GlowPointerManager {
  private elements = new Set<WeakRef<GlowElement>>();
  private isListening = false;
  private rafId: number = 0;
  private lastX = 0;
  private lastY = 0;

  /** Registra um elemento para receber atualizações de coordenadas */
  register(element: GlowElement) {
    this.elements.add(new WeakRef(element));
    this.startListening();
  }

  /** Remove um elemento do gerenciamento (chamado no cleanup do useEffect) */
  unregister(element: GlowElement) {
    for (const ref of this.elements) {
      if (ref.deref() === element) {
        this.elements.delete(ref);
        break;
      }
    }

    // Limpar WeakRefs mortas
    for (const ref of this.elements) {
      if (!ref.deref()) {
        this.elements.delete(ref);
      }
    }

    // Parar de ouvir se não há mais elementos
    if (this.elements.size === 0) {
      this.stopListening();
    }
  }

  private startListening() {
    if (this.isListening) return;
    this.isListening = true;

    const handlePointerMove = (e: PointerEvent) => {
      this.lastX = e.clientX;
      this.lastY = e.clientY;

      // Usar rAF para batchear as atualizações DOM
      if (!this.rafId) {
        this.rafId = requestAnimationFrame(() => {
          this.updateElements();
          this.rafId = 0;
        });
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // Guardar referência para cleanup
    (this as any)._handler = handlePointerMove;
  }

  private stopListening() {
    if (!this.isListening) return;
    this.isListening = false;

    if ((this as any)._handler) {
      window.removeEventListener('pointermove', (this as any)._handler);
      (this as any)._handler = null;
    }

    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
  }

  private updateElements() {
    for (const ref of this.elements) {
      const el = ref.deref();
      if (!el) {
        this.elements.delete(ref);
        continue;
      }

      const rect = el.getBoundingClientRect();
      const x = this.lastX - rect.left;
      const y = this.lastY - rect.top;
      el.style.setProperty('--x', `${x}`);
      el.style.setProperty('--y', `${y}`);
    }
  }
}

// Exporta instância singleton
export const glowPointerManager = new GlowPointerManager();
