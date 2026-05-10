import React, { useState, useEffect } from 'react';
import type { MouseEvent } from 'react';

interface Ripple {
  x: number;
  y: number;
  size: number;
  id: number;
}

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  rippleColor?: string;
  duration?: number;
}

export const RippleButton: React.FC<RippleButtonProps> = ({
  children,
  className = "",
  rippleColor = "rgba(255, 255, 255, 0.4)",
  duration = 600,
  onClick,
  ...props
}) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    let timeoutIds: ReturnType<typeof setTimeout>[] = [];
    ripples.forEach(ripple => {
      const timeoutId = setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== ripple.id));
      }, duration);
      timeoutIds.push(timeoutId);
    });

    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
    };
  }, [ripples, duration]);

  const addRipple = (event: MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const newRipple: Ripple = {
      x,
      y,
      size,
      id: Date.now()
    };
    
    setRipples(prev => [...prev, newRipple]);
    if (onClick) onClick(event);
  };

  return (
    <button
      className={`relative overflow-hidden ${className}`}
      onClick={addRipple}
      {...props}
    >
      {children}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none animate-ripple"
          style={{
            width: ripple.size,
            height: ripple.size,
            top: ripple.y,
            left: ripple.x,
            backgroundColor: rippleColor,
            animationDuration: `${duration}ms`,
          }}
        />
      ))}
    </button>
  );
};
