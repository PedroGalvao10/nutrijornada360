import { useEffect, useRef, useState } from "react";

interface Props {
  text: string;
  highlightWords?: string;
  className?: string;
}

export function HulyTextHighlight({ text, highlightWords, className = "" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setTimeout(() => setIsActive(true), 300);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const renderText = (isGhost = false) => {
    if (!highlightWords) return <span>{text}</span>;
    const parts = text.split(highlightWords);
    if (parts.length === 1) return <span>{text}</span>;
    return (
      <>
        {parts[0]}<span className={`font-bold ${isGhost ? 'text-transparent' : 'text-[#f58041]'}`}>{highlightWords}</span>{parts[1]}
      </>
    );
  };

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <span className="relative z-10">{renderText(false)}</span>
      <div className={`huly-highlight-layer huly-text-anim ${isActive ? "active" : ""}`}>
        <span className="huly-highlight-bg" aria-hidden="true">{renderText(true)}</span>
      </div>
      <div className={`huly-cursor-layer huly-text-anim ${isActive ? "active" : ""}`}>
        <span className="huly-cursor-indicator" aria-hidden="true">{renderText(true)}</span>
      </div>
    </div>
  );
}
