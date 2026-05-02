import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    // Ativa a transição suave temporariamente
    root.classList.add('transitioning-theme');
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    // Remove a classe de transição após a animação completar
    const timer = setTimeout(() => root.classList.remove('transitioning-theme'), 600);
    return () => clearTimeout(timer);
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="relative p-2 rounded-full bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-[#4a7c59]/20 dark:border-emerald-500/20 hover:border-[#4a7c59]/50 dark:hover:border-emerald-500/50 hover:bg-white/80 dark:hover:bg-white/10 transition-all text-[#705c30] dark:text-amber-500 hover:text-[#4a7c59] dark:hover:text-emerald-400 overflow-hidden w-9 h-9 flex items-center justify-center shrink-0"
      aria-label="Alternar tema"
    >
      <motion.div
        initial={false}
        animate={{
          y: isDark ? -30 : 0,
          opacity: isDark ? 0 : 1
        }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <span className="material-symbols-outlined text-[20px] leading-none">light_mode</span>
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          y: isDark ? 0 : 30,
          opacity: isDark ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <span className="material-symbols-outlined text-[20px] leading-none">dark_mode</span>
      </motion.div>
    </button>
  );
}
