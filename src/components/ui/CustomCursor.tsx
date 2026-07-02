import { useEffect, useRef } from 'react';

/**
 * CustomCursor — cursor de 3 camadas via rAF puro (sem GSAP, sem useState).
 * - dot: 1:1, mix-blend-difference (sempre visível em creme ou escuro)
 * - mid: lerp 0.22
 * - ring: lerp 0.10, escala 2.4x em hover de a/button/[data-cursor]
 * - label: aparece sobre o ring quando o alvo tem data-cursor
 * Event delegation (1 listener no document) — zero MutationObserver.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const labelTextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Dispositivos sem hover (touch) não recebem cursor custom
    if (!window.matchMedia('(hover: hover)').matches) return;

    let mx = 0, my = 0;   // posição alvo (mouse)
    let cx = 0, cy = 0;   // mid (lerp 0.22)
    let rx = 0, ry = 0;   // ring (lerp 0.10)

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current) dotRef.current.style.transform = `translate(${mx}px,${my}px)`;
    };

    const tick = () => {
      cx += (mx - cx) * 0.22;
      cy += (my - cy) * 0.22;
      rx += (mx - rx) * 0.10;
      ry += (my - ry) * 0.10;
      if (midRef.current) midRef.current.style.transform = `translate(${cx}px,${cy}px)`;
      if (ringRef.current) ringRef.current.style.transform = `translate(${rx}px,${ry}px)`;
      if (labelRef.current) labelRef.current.style.transform = `translate(${rx}px,${ry}px)`;
      requestAnimationFrame(tick);
    };

    // Event delegation — resolve o alvo via closest(), cobre conteúdo dinâmico
    const onOver = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>('a,button,[data-cursor]');
      if (!t) return;
      if (ringRef.current) ringRef.current.style.scale = '2.4';
      const label = t.getAttribute('data-cursor');
      if (label && labelTextRef.current && labelRef.current) {
        labelTextRef.current.textContent = label;
        labelRef.current.style.opacity = '1';
      }
    };
    const onOut = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>('a,button,[data-cursor]');
      if (!t) return;
      if (ringRef.current) ringRef.current.style.scale = '1';
      if (labelRef.current) labelRef.current.style.opacity = '0';
    };
    const onDown = () => { if (dotRef.current) dotRef.current.style.scale = '0.6'; };
    const onUp = () => { if (dotRef.current) dotRef.current.style.scale = '1'; };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.body.style.cursor = 'none';
    document.body.classList.add('custom-cursor-active');
    const raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.body.style.cursor = '';
      document.body.classList.remove('custom-cursor-active');
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* Dot 1:1 — mix-blend-difference inverte a cor sobre qualquer fundo */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-white pointer-events-none z-[99999]"
        style={{ mixBlendMode: 'difference', translate: '-50% -50%', willChange: 'transform', transition: 'scale 0.15s ease' }}
      />
      {/* Mid ring — lerp 0.22 */}
      <div
        ref={midRef}
        className="fixed top-0 left-0 w-5 h-5 rounded-full border border-[#4a7c59]/50 pointer-events-none z-[99998]"
        style={{ translate: '-50% -50%', willChange: 'transform' }}
      />
      {/* Outer ring — lerp 0.10, escala em hover */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#4a7c59]/25 pointer-events-none z-[99997]"
        style={{ translate: '-50% -50%', willChange: 'transform', transition: 'scale 0.35s cubic-bezier(0.16,1,0.3,1)' }}
      />
      {/* Label — sobre o ring, visível apenas com data-cursor */}
      <div
        ref={labelRef}
        className="fixed top-0 left-0 pointer-events-none z-[99999] opacity-0"
        style={{ translate: '-50% -150%', transition: 'opacity 0.2s ease' }}
      >
        <span
          ref={labelTextRef}
          className="text-[10px] font-bold uppercase tracking-widest text-[#4a7c59] whitespace-nowrap bg-white/80 backdrop-blur-md px-2 py-1 rounded-full shadow border border-[#4a7c59]/20"
        />
      </div>
    </>
  );
}
