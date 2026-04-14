import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  as?: 'button' | 'a' | 'div';
  href?: string;
  target?: string;
  rel?: string;
}

export function MagneticButton({ children, className = '', as = 'button', ...props }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement | HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const commonProps = {
    ref: ref as any,
    onMouseMove: handleMouse,
    onMouseLeave: reset,
    className: `inline-block relative ${className}`,
    initial: { x: 0, y: 0 },
    animate: { x: position.x, y: position.y },
    transition: { type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }
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
