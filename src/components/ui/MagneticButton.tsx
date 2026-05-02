import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  as?: 'button' | 'a' | 'div';
  href?: string;
  target?: string;
  rel?: string;
}

/**
 * MagneticButton — Botão com efeito magnético que segue o cursor.
 * 
 * OTIMIZAÇÃO: Substituído useState por useMotionValue para eliminar re-renders
 * a cada mousemove. Framer Motion anima diretamente os motion values sem causar
 * reconciliação do React, resultando em performance Apple-grade.
 */
export function MagneticButton({ children, className = '', as = 'button', ...props }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement | HTMLDivElement | null>(null);
  
  // STEP: useMotionValue + useSpring em vez de useState (zero re-renders)
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    x.set(middleX * 0.2);
    y.set(middleY * 0.2);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const commonProps = {
    ref: ref as any,
    onMouseMove: handleMouse,
    onMouseLeave: reset,
    className: `inline-block relative ${className}`,
    style: { x: springX, y: springY },
  };

  if (as === 'a') {
    return (
      <motion.a {...commonProps} {...(props as any)}>
        {children}
      </motion.a>
    );
  }
  
  if (as === 'div') {
    return (
      <motion.div {...commonProps} {...(props as any)}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.button {...commonProps} {...(props as any)}>
      {children}
    </motion.button>
  );
}
