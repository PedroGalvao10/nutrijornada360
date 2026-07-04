import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================
// SplashScreen — abertura editorial da 1ª visita da sessão
// (blueprint 21st.dev, Seção 10). Tela isolada, leve e on-brand
// (creme + Lora + filete dourado), que some sozinha (~2.1s) ou
// ao clique. 1x por sessão (sessionStorage). Respeita
// prefers-reduced-motion: pula direto para o site.
// ============================================================

const SESSION_KEY = 'nj-splash-seen';
const DURATION = 2100;

export function SplashScreen() {
  const [show, setShow] = useState(() => {
    if (typeof window === 'undefined') return false;
    // Já visto nesta sessão? Não mostra.
    if (sessionStorage.getItem(SESSION_KEY)) return false;
    // Usuário prefere menos movimento? Não mostra.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    return true;
  });

  // Marca como visto só ao sair (evita que o double-mount do StrictMode
  // consuma a flag antes de o splash chegar a aparecer).
  const dismiss = () => {
    sessionStorage.setItem(SESSION_KEY, '1');
    setShow(false);
  };

  useEffect(() => {
    if (!show) return;
    // Trava o scroll enquanto o splash está visível
    document.body.style.overflow = 'hidden';
    const timer = setTimeout(dismiss, DURATION);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
          onClick={dismiss}
          role="button"
          tabIndex={0}
          aria-label="Entrar no site"
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && dismiss()}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background cursor-pointer overflow-hidden"
        >
          {/* Névoa verde de fundo, on-brand */}
          <div aria-hidden="true" className="absolute -top-40 -right-40 w-[560px] h-[560px] rounded-full bg-verde-nevoa/60 blur-[120px] pointer-events-none" />
          <div aria-hidden="true" className="absolute -bottom-52 -left-40 w-[520px] h-[520px] rounded-full bg-verde-nevoa/40 blur-[130px] pointer-events-none" />

          <div className="relative text-center px-6">
            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.15, duration: 0.6 } }}
              className="inline-flex items-center gap-3 text-[0.62rem] sm:text-[0.68rem] tracking-[0.26em] uppercase font-extrabold text-tertiary mb-6"
            >
              <span aria-hidden="true" className="inline-block w-8 h-px bg-ouro-suave" />
              Nutrição comportamental
              <span aria-hidden="true" className="inline-block w-8 h-px bg-ouro-suave" />
            </motion.p>

            {/* Nome da marca */}
            <motion.h1
              initial={{ opacity: 0, filter: 'blur(10px)', y: 12 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0, transition: { delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] } }}
              className="font-headline font-medium text-5xl sm:text-6xl md:text-7xl tracking-[-0.02em] text-on-background leading-none"
            >
              NutriJornada{' '}
              <span className="text-primary italic">360º</span>
            </motion.h1>

            {/* Filete dourado que cresce */}
            <motion.div
              aria-hidden="true"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1, transition: { delay: 0.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
              className="h-px bg-ouro-suave mx-auto mt-8 w-40 origin-center"
            />

            {/* Barra de progresso */}
            <div className="mt-6 mx-auto w-40 h-0.5 bg-surface-variant/60 rounded-full overflow-hidden">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '0%', transition: { duration: DURATION / 1000, ease: 'easeInOut' } }}
                className="h-full w-full bg-ouro-suave"
              />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 1, duration: 0.6 } }}
              className="mt-6 text-[0.6rem] uppercase tracking-[0.22em] font-extrabold text-on-surface-variant/50"
            >
              Toque para entrar
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
