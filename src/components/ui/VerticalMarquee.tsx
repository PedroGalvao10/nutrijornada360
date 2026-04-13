import React from 'react';
import { cn } from '../../lib/utils';

interface VerticalMarqueeProps {
  items: string[];
  className?: string;
  speed?: number;
}

export const VerticalMarquee: React.FC<VerticalMarqueeProps> = ({ 
  items, 
  className,
  speed = 50 
}) => {
  // Triplicamos os itens para garantir que o loop seja fluido e preencha o container
  const marqueeItems = [...items, ...items, ...items];

  return (
    <div className={cn(
      "relative h-full w-full overflow-hidden mask-marquee-vertical select-none",
      className
    )}>
      <div 
        className="flex flex-col gap-16 py-8 animate-marquee-vertical"
        style={{ '--duration': `${speed}s` } as React.CSSProperties}
      >
        {marqueeItems.map((item, idx) => (
          <div 
            key={`${item}-${idx}`} 
            className="text-2xl md:text-3xl font-light text-primary/80 tracking-[0.2em] uppercase whitespace-nowrap text-center italic"
            style={{ 
              textShadow: '0 0 20px rgba(74, 124, 89, 0.1)' 
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};
