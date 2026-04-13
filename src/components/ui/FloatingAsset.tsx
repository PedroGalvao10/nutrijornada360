import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface FloatingAssetProps {
  src: string;
  className?: string;
  depth?: number; // Força do parallax (positivo ou negativo)
  floatIntensity?: number;
  duration?: number;
  delay?: number;
}

export const FloatingAsset = ({
  src,
  className = "",
  depth = 0.2,
  floatIntensity = 15,
  duration = 3,
  delay = 0
}: FloatingAssetProps) => {
  const ref = useRef(null);
  
  // Parallax Scroll logic
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Converte o progresso do scroll em um deslocamento vertical (Y)
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -200 * depth]);

  return (
    <motion.div
      ref={ref}
      style={{ y: yParallax }}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: delay * 0.1 }}
      className={`absolute pointer-events-none z-10 ${className}`}
    >
      <motion.img
        src={src}
        alt="Decorative fruit"
        loading="lazy"
        decoding="async"
        className="w-full h-full object-contain"
        animate={{
          y: [0, -floatIntensity, 0],
          rotate: [0, floatIntensity / 3, 0],
        }}
        transition={{
          duration: duration,
          delay: delay,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ 
          willChange: 'transform'
        }}
      />
    </motion.div>
  );
};
