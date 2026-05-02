import { useRef, useEffect } from 'react';

interface RotatingPhraseProps {
  text: string;
}

export function RotatingPhrase({ text }: RotatingPhraseProps) {
  const textRef = useRef<HTMLDivElement>(null);

  // O texto é dividido em caracteres para o posicionamento circular via CSS
  const chars = text.split('');

  useEffect(() => {
    if (textRef.current) {
      textRef.current.style.setProperty('--total-chars', String(chars.length));
    }
  }, [chars.length]);

  return (
    <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
      <div 
        ref={textRef} 
        className="absolute w-full h-full flex items-center justify-center animate-spin-slow-controlled"
      >
        {chars.map((char, i) => (
          <span
            key={i}
            style={{ '--char-index': i } as React.CSSProperties}
            className="rotating-char text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary/60 dark:text-amber-500/60"
          >
            {char}
          </span>
        ))}
      </div>
      <div className="w-12 h-12 md:w-16 md:h-16 bg-primary rounded-full flex items-center justify-center shadow-lg z-10">
        <span className="material-symbols-outlined text-on-primary text-xl md:text-2xl">spa</span>
      </div>
    </div>
  );
}
