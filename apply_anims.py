import os

os.makedirs('src/hooks', exist_ok=True)
hookCode = '''import { useEffect, useRef } from 'react';

export function useStaggeredReveal(delayMs = 120) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const children = Array.from(entry.target.querySelectorAll('.stagger-item')) as HTMLElement[];
          children.forEach((child, index) => {
            child.style.transitionDelay = f'{index * delayMs}ms';
            child.classList.add('revealed');
          });
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px"
    });

    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [delayMs]);

  return containerRef;
}
'''
with open('src/hooks/useStaggeredReveal.ts', 'w', encoding='utf8') as f:
    f.write(hookCode)
print('Hook written.')

compCode = '''import React, { useEffect, useRef, useState } from 'react';

interface Props {
  text: string;
  highlightWords?: string;
  className?: string;  
}

export function HulyTextHighlight({ text, highlightWords, className = '' }: Props) {
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
    <div ref={containerRef} className={elative inline-block }>
      <span className="relative z-10">{renderText()}</span>
      <div 
        className={bsolute top-0 left-0 w-[102%] h-full pointer-events-none huly-text-anim }
        style={{ '--highlight-position': 0, opacity: isActive ? 1 : 0 } as any}
      >
        <span 
          className="block w-full h-full text-transparent bg-no-repeat"
          style={{
            background: 'linear-gradient(90deg, rgba(245,128,65,0.2) 50%, transparent 50%) 100% 0 / 200% 100% no-repeat',
            backgroundPosition: 'calc((1 - var(--highlight-position)) * 100%) 0'
          }}
          aria-hidden="true"
        >{renderText()}</span>
      </div>
      <div 
        className={bsolute top-0 left-0 w-[102%] h-full pointer-events-none huly-text-anim }
        style={{ '--cursor-position': 0, opacity: isActive ? 1 : 0 } as any}
      >
        <span 
          className="huly-cursor block w-full h-full text-transparent bg-no-repeat"
          style={{
            backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAxMCAzNiI+PHBhdGggZmlsbD0iI2Y1ODAnNDEiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTQgMjYuMUE1LjAwMiA1LjAwMiAwIDAgMCA1IDM2YTUgNSAwIDAgMCAxLTkuOVYwSDR6IiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=")',
            backgroundSize: '10px 30px',
            backgroundPosition: 'calc(var(--cursor-position) * 100%) center'
          }}
          aria-hidden="true"
        >{renderText()}</span>
      </div>
    </div>
  );
}
'''
os.makedirs('src/components', exist_ok=True)
with open('src/components/HulyTextHighlight.tsx', 'w', encoding='utf8') as f:
    f.write(compCode)
print('Component written.')

cssCode = '''
/* Huly Staggered Entry Animation */
.stagger-item {
  opacity: 0;
  transform: translateY(32px);
  will-change: opacity, transform;
  transition: opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1);
}
.stagger-item.revealed { opacity: 1; transform: translateY(0); }

/* Huly Text Highlight Animation */
@property --highlight-position { syntax: "<number>"; initial-value: 0; inherits: false; }
@property --cursor-position { syntax: "<number>"; initial-value: 0; inherits: false; }

.huly-text-anim.active { animation: huly-highlight-anim 2.5s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
.huly-text-anim.active .huly-cursor { animation: huly-cursor-anim 2.5s cubic-bezier(0.25, 1, 0.5, 1) forwards; }

@keyframes huly-highlight-anim {
  from { --highlight-position: 0; opacity: 1; }
  to { --highlight-position: 1; opacity: 1; }
}
@keyframes huly-cursor-anim {
  0% { --cursor-position: 0; opacity: 1; }
  90% { --cursor-position: 1; opacity: 1; }
  100% { --cursor-position: 1; opacity: 0; }
}
'''
with open('src/index.css', 'r', encoding='utf8') as f:
    css = f.read()
if '.stagger-item' not in css:
    with open('src/index.css', 'w', encoding='utf8') as f:
        f.write(css + cssCode)
    print('CSS written.')
