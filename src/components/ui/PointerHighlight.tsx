/* cspell:disable-file */
import React, { useRef, useState } from 'react';

export const PointerHighlight = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <span
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative inline-block overflow-hidden rounded-md px-1 -mx-1 transition-colors hover:text-[#4a7c59] dark:hover:text-emerald-400 ${className}`}
    >
      <span
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 pointer-highlight-surface"
        style={{
          opacity,
          '--x': `${position.x}px`,
          '--y': `${position.y}px`,
        } as React.CSSProperties}
      />
      <span className="relative z-10 drop-shadow-sm">{children}</span>
    </span>
  );
};
