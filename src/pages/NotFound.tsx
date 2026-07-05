import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { InkReveal } from '../components/ui/InkReveal';

// ============================================================
// 404 — momento lúdico do site (blueprint de imersão, Leva B/C).
// O conteúdo nasce coberto por uma máscara na cor do fundo e o
// visitante "pinta" com o cursor para revelá-lo (Ink Reveal).
// Em touch/reduced-motion a máscara nem monta — conteúdo direto
// (nunca fica inacessível). Nota: Neon Flow foi descartado para
// esta página por carregar three.js de CDN externo em runtime.
// ============================================================

export default function NotFound() {
  // Máscara só onde há cursor fino e movimento permitido
  const [inkEnabled] = useState(() =>
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [isDark, setIsDark] = useState(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  // Acompanha troca de tema ao vivo (a cor da máscara precisa acompanhar o fundo)
  useEffect(() => {
    const observer = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains('dark'))
    );
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Helmet>
        <title>Página não encontrada | NutriJornada 360º</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <section className="relative flex min-h-[80vh] flex-col items-center justify-center gap-6 px-6 text-center overflow-hidden">
        {/* Conteúdo (por baixo da máscara) */}
        <p className="font-headline text-8xl md:text-9xl font-medium text-primary dark:text-emerald-400">404</p>
        <h1 className="font-headline font-medium text-2xl md:text-3xl text-on-background dark:text-stone-100">
          Essa página não existe (ou mudou de lugar).
        </h1>
        <p className="max-w-md text-on-surface-variant dark:text-stone-400 font-light leading-relaxed">
          O endereço que você tentou acessar não corresponde a nenhuma página do site.
        </p>
        <Link
          to="/"
          data-cursor="Início"
          className="no-glass rounded-full bg-verde-profundo dark:bg-emerald-500 px-8 py-3.5 font-semibold text-background dark:text-stone-950 shadow-float-1 hover:shadow-float-2 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 relative z-[2]"
        >
          Voltar para a página inicial
        </Link>

        {/* Máscara pintável — o cursor revela o conteúdo */}
        {inkEnabled && (
          <>
            <InkReveal maskColor={isDark ? [12, 10, 9] : [250, 246, 240]} />
            <p
              aria-hidden="true"
              className="absolute top-10 left-1/2 -translate-x-1/2 z-[2] text-[0.62rem] tracking-[0.26em] uppercase font-extrabold text-tertiary dark:text-ouro-suave pointer-events-none"
            >
              Pinte com o cursor para revelar
            </p>
          </>
        )}
      </section>
    </>
  );
}
