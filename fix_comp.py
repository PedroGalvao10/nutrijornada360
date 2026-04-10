correct_comp = """
import React, { useEffect, useRef, useState } from "react";

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

  const renderText = () => {
    if (!highlightWords) return <span>{text}</span>;
    const parts = text.split(highlightWords);
    if (parts.length === 1) return <span>{text}</span>;
    return (
      <>
        {parts[0]}<span className="font-bold text-[#f58041]">{highlightWords}</span>{parts[1]}
      </>
    );
  };

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <span className="relative z-10">{renderText()}</span>
      <div 
        className={absolute top-0 left-0 w-[102%] h-full pointer-events-none huly-text-anim ${isActive ? "active" : ""}`}
        style={{ "--highlight-position": 0, opacity: isActive ? 1 : 0 } as any}
      >
        <span 
          className="block w-full h-full text-transparent bg-no-repeat"
          style={{
            background: "linear-gradient(90deg, rgba(245,128,65,0.2) 50%, transparent 50%) 100% 0 / 200% 100% no-repeat",
            backgroundPosition: "calc((1 - var(--highlight-position)) * 100%) 0"
          }}
          aria-hidden="true"
        >{renderText()}</span>
      </div>
      <div 
        className={`absolute top-0 left-0 w-[102%] h-full pointer-events-none huly-text-anim ${isActive ? "active" : ""}`}
        style={{ "--cursor-position": 0, opacity: isActive ? 1 : 0 } as any}
      >
        <span 
          className="huly-cursor block w-full h-full text-transparent bg-no-repeat"
          style={{
            backgroundImage: 'url("data:image/svg+xml;base64,PHN2ayB4bWxucz0iaHR0cDovL233dy53My5vcmcvMjAwMC9zdmciIGRpbGw9IcNmNTgwJzMxIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik10IDI2LjFBNS4wMDIgNS4wMDIgMCAwIDAxIDQ MzZhNSA1IDAgMCAwIDEtOS4pVk8wSDR6IiBnbG1wLXJ1bGU9ImV2ZW5vZGQiLz48c3ZnPg==")',
            backgroundSize: "10px 30px",
            backgroundPosition: "calc(var(--cursor-position) * 100%) center"
          }}
          aria-hidden="true"
        >{renderText()}</span>
      </div>
    </div>
  );
}
"""

with open('src/components/HulyTextHighlight.tsx', 'w', encoding='utf-8') as f:
    f.write(correct_comp.strip())
print("FIXED")