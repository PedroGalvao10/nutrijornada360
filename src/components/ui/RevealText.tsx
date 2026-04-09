import { motion, useInView } from "framer-motion";
import type { ReactNode } from "react";
import { useRef } from "react";

interface RevealTextProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  duration?: number;
  yOffset?: number;
  /** "up" = slide de baixo pra cima (padrão), "left" = slide da direita */
  direction?: "up" | "left" | "right";
}

export function RevealText({
  children,
  delay = 0,
  className = "",
  duration = 0.75,
  yOffset = 60,
  direction = "up",
}: RevealTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const initial =
    direction === "left"
      ? { opacity: 0, x: 80, y: 0 }
      : direction === "right"
      ? { opacity: 0, x: -80, y: 0 }
      : { opacity: 0, x: 0, y: yOffset };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={initial}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : initial}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
