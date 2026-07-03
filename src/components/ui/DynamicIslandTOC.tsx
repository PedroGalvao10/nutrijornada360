import { useState, useEffect, useMemo, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, type Transition } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

// ============================================================
// DynamicIslandTOC — índice de artigo estilo "Dynamic Island":
// pílula flutuante que expande, scroll-spy + progresso de leitura,
// scroll suave até a seção. Adaptado do 21st.dev para framer-motion
// e para a paleta "Editorial Orgânico". Escaneia os headings do
// conteúdo renderizado (.prose) — não toca no HTML do artigo.
// ============================================================

type HeadingData = { id: string; text: string; level: number; element: HTMLElement };

const islandTransition: Transition = { type: 'tween', ease: [0.22, 1, 0.36, 1], duration: 0.5 };

function CircleProgress({ percentage }: { percentage: number }) {
  const size = 24;
  const strokeWidth = 2.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="-rotate-90 shrink-0">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={strokeWidth} className="stroke-surface-variant dark:stroke-stone-700" />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        strokeLinecap="round"
        className="stroke-primary dark:stroke-emerald-400"
      />
    </svg>
  );
}

type Props = {
  children?: ReactNode;
  selector?: string;
};

export function DynamicIslandTOC({
  children,
  selector = 'article h2, article h3, article h4, .prose h2, .prose h3, .prose h4, [data-toc]',
}: Props) {
  const [headings, setHeadings] = useState<HeadingData[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [progress, setProgress] = useState(0);

  // Escaneia headings do DOM (com pequeno delay p/ hidratação do conteúdo)
  useEffect(() => {
    const getHeadings = () => {
      const elements = Array.from(document.querySelectorAll(selector)) as HTMLElement[];
      const valid = elements
        .filter((el) => !el.hasAttribute('data-toc-ignore'))
        .map((el, index) => {
          if (!el.id) {
            el.id =
              el.textContent?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') ||
              `toc-heading-${index}`;
          }
          const depthAttr = el.getAttribute('data-toc-depth');
          let level = 2;
          if (depthAttr) level = parseInt(depthAttr, 10);
          else {
            const tag = el.tagName.toUpperCase();
            if (tag.startsWith('H') && tag.length === 2) level = parseInt(tag[1], 10);
          }
          const text = el.getAttribute('data-toc-title') || el.textContent || 'Seção';
          return { id: el.id, text, level, element: el };
        });
      valid.sort((a, b) =>
        a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
      );
      setHeadings(valid);
    };
    const timer = setTimeout(getHeadings, 200);
    return () => clearTimeout(timer);
  }, [selector]);

  // Scroll-spy + progresso de leitura
  useEffect(() => {
    const handleScroll = () => {
      let currentActiveId: string | null = null;
      for (const heading of headings) {
        if (heading.element.getBoundingClientRect().top <= 120) currentActiveId = heading.id;
        else break;
      }
      if (!currentActiveId && headings.length > 0) currentActiveId = headings[0].id;
      setActiveId(currentActiveId);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? Math.min(100, Math.max(0, (window.scrollY / total) * 100)) : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  const activeHeading = headings.find((h) => h.id === activeId);

  // Pílula mais estreita em telas pequenas (evita colidir com o FAB do WhatsApp)
  const [isNarrow, setIsNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const update = () => setIsNarrow(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  const pillWidth = isNarrow ? 230 : 280;
  const expandedWidth = isNarrow ? 310 : 340;
  const minLevel = useMemo(
    () => (headings.length === 0 ? 1 : Math.min(...headings.map((h) => h.level))),
    [headings]
  );

  return (
    <>
      {children}

      {headings.length > 0 && createPortal(
        <>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={islandTransition}
                className="fixed inset-0 z-[9998] bg-verde-profundo/15 dark:bg-black/40 backdrop-blur-[4px]"
                onClick={() => setIsExpanded(false)}
              />
            )}
          </AnimatePresence>

          {/* Em <md sobe para não colidir com a bottom-nav mobile (md:hidden) */}
          <div className="fixed bottom-[86px] md:bottom-[30px] left-1/2 z-[9999] flex -translate-x-1/2 flex-col items-center">
            <motion.div
              onClick={() => { if (!isExpanded) setIsExpanded(true); }}
              initial={{ y: 50, opacity: 0, width: pillWidth, height: 52, borderRadius: 26 }}
              animate={{
                y: 0,
                opacity: 1,
                width: isExpanded ? expandedWidth : pillWidth,
                height: isExpanded ? 400 : 52,
                borderRadius: isExpanded ? 24 : 26,
              }}
              transition={islandTransition}
              style={{ cursor: isExpanded ? 'default' : 'pointer' }}
              className="relative overflow-hidden border border-black/5 dark:border-white/10 bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl text-on-background dark:text-stone-100 shadow-float-2"
            >
              {/* Pílula fechada */}
              <motion.div
                initial={false}
                animate={{
                  opacity: isExpanded ? 0 : 1,
                  scale: isExpanded ? 0.95 : 1,
                  filter: isExpanded ? 'blur(4px)' : 'blur(0px)',
                }}
                transition={{ ...islandTransition, delay: isExpanded ? 0 : 0.1 }}
                className={cn('absolute inset-0 flex items-center gap-4 px-4 sm:px-5', isExpanded && 'pointer-events-none')}
              >
                <div className="h-2 w-2 shrink-0 rounded-full bg-primary dark:bg-emerald-400" />
                <div className="relative flex h-full flex-1 items-center overflow-hidden text-left">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={activeId || 'empty'}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="block w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium"
                    >
                      {activeHeading?.text || 'Índice do artigo'}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <CircleProgress percentage={progress} />
              </motion.div>

              {/* Menu expandido */}
              <motion.div
                initial={false}
                animate={{ opacity: isExpanded ? 1 : 0, scale: isExpanded ? 1 : 1.05 }}
                transition={{ ...islandTransition, delay: isExpanded ? 0.1 : 0 }}
                className={cn('absolute inset-0 flex flex-col', !isExpanded && 'pointer-events-none')}
              >
                <div className="flex shrink-0 items-center justify-between px-6 pb-3 pt-5">
                  <span className="text-[0.62rem] font-extrabold tracking-[0.22em] uppercase text-tertiary dark:text-ouro-suave">
                    Neste artigo
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                    aria-label="Fechar índice"
                    className="text-on-surface-variant/70 transition-colors hover:text-primary dark:hover:text-emerald-400"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto overscroll-contain px-3 pb-4">
                  <div className="flex flex-col gap-0.5">
                    {headings.map((h) => {
                      const isActive = activeId === h.id;
                      const isHovered = hoveredId === h.id;
                      const indentLevel = Math.max(0, h.level - minLevel);
                      const paddingLeft = indentLevel * 14 + 12;
                      return (
                        <button
                          key={h.id}
                          onMouseEnter={() => setHoveredId(h.id)}
                          onMouseLeave={() => setHoveredId(null)}
                          onClick={(e) => {
                            e.stopPropagation();
                            const y = h.element.getBoundingClientRect().top + window.scrollY - 100;
                            window.scrollTo({ top: y, behavior: 'smooth' });
                            setIsExpanded(false);
                          }}
                          style={{ paddingLeft: `${paddingLeft}px` }}
                          className={cn(
                            'group flex w-full shrink-0 cursor-pointer items-center rounded-lg border-none py-2 pr-3 text-left text-sm transition-all duration-300 ease-out',
                            isActive && 'bg-verde-nevoa dark:bg-emerald-900/30 font-medium text-on-background dark:text-stone-100',
                            !isActive && isHovered && 'bg-creme-2 dark:bg-stone-800 text-on-background/85 dark:text-stone-300',
                            !isActive && !isHovered && 'bg-transparent text-on-surface-variant/60 dark:text-stone-500'
                          )}
                        >
                          <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap transition-transform duration-300 group-hover:translate-x-1">
                            {h.text}
                          </span>
                          <motion.div
                            initial={false}
                            animate={{ scale: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="ml-3 h-1.5 w-1.5 shrink-0 rounded-full bg-primary dark:bg-emerald-400"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}
