/* cspell:disable-file */
import React, { useRef, useState } from 'react';

export const PointerHighlight = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || !highlightRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    highlightRef.current.style.setProperty('--x', `${x}px`);
    highlightRef.current.style.setProperty('--y', `${y}px`);
  };

  return (
    <span
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative inline-block overflow-hidden rounded-md px-1 -mx-1 transition-colors hover:text-primary dark:hover:text-primary-container ${className}`}
    >
      <span
        ref={highlightRef}
        className={`pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 pointer-highlight-surface ${opacity ? 'opacity-100' : 'opacity-0'}`}
      />
      <span className="relative z-10">{children}</span>
    </span>
  );
};
