/**
 * StaggerReveal + StaggerItem
 *
 * Uso:
 *   <StaggerReveal>
 *     <StaggerItem><h2>Título</h2></StaggerItem>
 *     <StaggerItem><p>Parágrafo</p></StaggerItem>
 *     <StaggerItem><span>Bullet 1</span></StaggerItem>
 *     <StaggerItem><span>Bullet 2</span></StaggerItem>
 *   </StaggerReveal>
 *
 * Quando o container entrar no viewport, cada filho anima em cascata.
 */

import { motion, useInView } from "framer-motion";
import type { ReactNode } from "react";
import { useRef, forwardRef, useImperativeHandle } from "react";

// ─── Variantes ───────────────────────────────────────────────────────────────

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

const itemVariantsLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

// ─── Container ───────────────────────────────────────────────────────────────

interface StaggerRevealProps {
  children: ReactNode;
  className?: string;
  /** threshold 0–1: quanto do container deve estar visível antes de disparar */
  amount?: number;
  /** delay extra antes de começar o stagger */
  delay?: number;
  /** intervalo entre a animação de cada filho (padrão: 0.14) */
  staggerInterval?: number;
}

export const StaggerReveal = forwardRef<HTMLDivElement, StaggerRevealProps>(({
  children,
  className = "",
  amount = 0.15,
  delay = 0,
  staggerInterval = 0.14,
}, forwardedRef) => {
  const internalRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(internalRef, { once: true, amount });

  // Sincroniza o ref fornecido com o ref interno usado pelo useInView
  useImperativeHandle(forwardedRef, () => internalRef.current!);

  const dynamicContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerInterval,
        delayChildren: delay || 0.05,
      },
    },
  };

  return (
    <motion.div
      ref={internalRef}
      className={className}
      variants={dynamicContainerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      style={{ willChange: "auto" }}
    >
      {children}
    </motion.div>
  );
});

StaggerReveal.displayName = "StaggerReveal";

// ─── Item (padrão: slide de baixo) ───────────────────────────────────────────

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  /** "up" = de baixo (padrão), "left" = slide da esquerda */
  direction?: "up" | "left";
}

export function StaggerItem({
  children,
  className = "",
  direction = "up",
}: StaggerItemProps) {
  const variants = direction === "left" ? itemVariantsLeft : itemVariants;

  return (
    <motion.div
      className={className}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
