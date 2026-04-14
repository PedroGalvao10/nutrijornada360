import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Overlay de transição - Anima na entrada */}
      <motion.div 
        initial={{ scaleY: 1, opacity: 1 }}
        animate={{ scaleY: 0, opacity: 0 }}
        exit={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
        style={{ transformOrigin: 'top' }}
        className="fixed inset-0 bg-primary z-50 pointer-events-none"
      />
      
      {/* Conteúdo da página */}
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.98 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
