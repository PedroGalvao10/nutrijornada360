import React, { forwardRef, useEffect, useRef } from 'react';
import { glowPointerManager } from '../../lib/glowPointerManager';

export interface GlowWrapperProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
  glowColor?: 'blue' | 'purple' | 'green' | 'red' | 'amber' | 'slate' | 'mariana' | string;
}

const parseHSL = (hslStr: string) => {
  const match = hslStr.match(/\d+(\.\d+)?/g);
  if (match && match.length >= 3) {
    return {
      base: parseFloat(match[0]),
      saturation: parseFloat(match[1]),
      lightness: parseFloat(match[2]),
    };
  }
  return { base: 210, saturation: 100, lightness: 50 }; // Default fallback
};

const glowColorMap: Record<string, { base: number; spread: number; saturation?: number; lightness?: number }> = {
  blue: { base: 210, spread: 60, saturation: 100, lightness: 50 },
  purple: { base: 270, spread: 50 },
  amber: { base: 40, spread: 30 },
  green: { base: 140, spread: 40 },
  red: { base: 0, spread: 20 },
  slate: { base: 210, spread: 10, saturation: 20, lightness: 80 },
  // Verde escuro neon forte
  mariana: { base: 135, spread: 80, saturation: 90, lightness: 35 },
};

export const GlowWrapper = forwardRef<HTMLElement, GlowWrapperProps>(({
  children,
  as: Component = "div",
  className = "",
  glowColor = "default",
  style,
  ...props
}, forwardedRef) => {
  
  const localRef = useRef<HTMLElement | null>(null);

  const setRefs = (element: HTMLElement | null) => {
    localRef.current = element;
    if (typeof forwardedRef === 'function') {
      forwardedRef(element);
    } else if (forwardedRef) {
      (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = element;
    }
  };

  // STEP: Usar o singleton em vez de listeners individuais na window
  useEffect(() => {
    const el = localRef.current;
    if (!el) return;

    glowPointerManager.register(el);
    return () => {
      glowPointerManager.unregister(el);
    };
  }, []);

  const getStyleVars = () => {
    let colorVars = glowColorMap['slate']; 

    if (glowColorMap[glowColor]) {
      colorVars = glowColorMap[glowColor];
    } else if (glowColor.startsWith('hsl')) {
      const parsed = parseHSL(glowColor);
      colorVars = { base: parsed.base, spread: 50, saturation: parsed.saturation, lightness: parsed.lightness };
    }

    return {
      '--base': colorVars.base,
      '--spread': colorVars.spread,
      ...(colorVars.saturation && { '--color-saturation': colorVars.saturation }),
      ...(colorVars.lightness && { '--lightness': colorVars.lightness }),
      
      // Propriedades essenciais para entregar um "verde profundo":
      '--size': 350, 
      '--border': 2, 
      '--border-spot-opacity': 0.9, 
      '--border-lightness': colorVars.lightness ?? 40,
      '--bg-spot-opacity': 0.08, 

      ...style,
    } as React.CSSProperties;
  };

  return (
    <Component
      ref={setRefs}
      data-glow
      className={`relative ${className}`}
      style={getStyleVars()}
      {...props}
    >
      {children}
    </Component>
  );
});

GlowWrapper.displayName = 'GlowWrapper';
