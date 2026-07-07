import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ClipboardList, UserCheck, Salad, MessagesSquare } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

gsap.registerPlugin(ScrollTrigger);

// ============================================================
// JornadaScroll — "A jornada" narrada por scroll (Story Scroll,
// 21st.dev / Leva A do blueprint de imersão). Cada etapa é uma
// tela cheia: a atual fica pinada e a próxima entra girando de
// 30°→0° (origem no canto inferior esquerdo), como cartas que
// caem sobre a mesa. Conteúdo real do processo (mesma fonte das
// ETAPAS de Planos). Respeita prefers-reduced-motion: vira
// páginas estáticas empilhadas, sem pin nem rotação.
// ============================================================

type Etapa = {
  Icon: React.ComponentType<{ className?: string }>;
  numero: string;
  titulo: string;
  texto: string;
  detalhe: string;
  tema: 'creme' | 'nevoa' | 'creme2' | 'profundo';
};

const ETAPAS: Etapa[] = [
  {
    Icon: ClipboardList,
    numero: '01',
    titulo: 'Você me conta a sua história',
    texto: 'Um formulário curto sobre seus objetivos, rotina e relação com a comida. Leva cinco minutinhos — e é onde começamos a nos conhecer.',
    detalhe: 'Triagem online · 5 minutos',
    tema: 'creme',
  },
  {
    Icon: UserCheck,
    numero: '02',
    titulo: 'Eu leio o seu caso',
    texto: 'Nada aqui é feito por robôs. Eu mesma leio a sua história. Se o formato que você escolheu não for o melhor para o seu caso, eu converso com você antes de seguirmos.',
    detalhe: 'Curadoria humana',
    tema: 'nevoa',
  },
  {
    Icon: Salad,
    numero: '03',
    titulo: 'O plano nasce da sua vida real',
    texto: 'O nosso encontro (presencial em São Paulo ou online) é uma conversa. Não tem bronca nem cardápio de gaveta, construímos a estratégia juntos.',
    detalhe: 'Presencial ou online',
    tema: 'creme2',
  },
  {
    Icon: MessagesSquare,
    numero: '04',
    titulo: 'Não solto a sua mão',
    texto: 'Suporte direto comigo pelo WhatsApp, ajustes de percurso e construção de hábitos. A nossa consulta é só o começo de uma caminhada lado a lado.',
    detalhe: 'Acompanhamento lado a lado',
    tema: 'profundo',
  },
];

const TEMA_CLASSES: Record<Etapa['tema'], { bg: string; text: string; sub: string; accent: string }> = {
  creme: { bg: 'bg-background dark:bg-stone-950', text: 'text-on-background dark:text-stone-100', sub: 'text-on-surface-variant dark:text-stone-400', accent: 'text-primary dark:text-emerald-400' },
  nevoa: { bg: 'bg-verde-nevoa dark:bg-emerald-950/60', text: 'text-verde-profundo dark:text-stone-100', sub: 'text-verde-profundo/70 dark:text-stone-400', accent: 'text-primary dark:text-emerald-400' },
  creme2: { bg: 'bg-creme-2 dark:bg-stone-900', text: 'text-on-background dark:text-stone-100', sub: 'text-on-surface-variant dark:text-stone-400', accent: 'text-primary dark:text-emerald-400' },
  profundo: { bg: 'bg-verde-profundo dark:bg-emerald-950', text: 'text-background', sub: 'text-background/75', accent: 'text-ouro-suave' },
};

export function JornadaScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const { openBooking } = useBooking();

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useGSAP(
    () => {
      if (!containerRef.current || reducedMotion) return;

      const sections = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>('[data-flow-section]')
      );
      if (sections.length === 0) return;

      const triggers: ScrollTrigger[] = [];

      sections.forEach((section, i) => {
        gsap.set(section, { zIndex: i + 1 });

        const inner = section.querySelector<HTMLElement>('.flow-inner');
        if (!inner) return;

        // A próxima "carta" entra girando de 30° até assentar em 0°
        if (i > 0) {
          gsap.set(inner, { rotation: 30, transformOrigin: 'bottom left' });
          const tween = gsap.to(inner, {
            rotation: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'top 25%',
              scrub: true,
            },
          });
          if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
        }

        // A carta atual fica pinada enquanto a próxima cai por cima
        if (i < sections.length - 1) {
          triggers.push(
            ScrollTrigger.create({
              trigger: section,
              start: 'bottom bottom',
              end: 'bottom top',
              pin: true,
              pinSpacing: false,
            })
          );
        }
      });

      ScrollTrigger.refresh();

      return () => {
        triggers.forEach((t) => t.kill());
      };
    },
    { scope: containerRef, dependencies: [reducedMotion] }
  );

  return (
    <div ref={containerRef} aria-label="A jornada do acompanhamento" className="relative w-full overflow-x-hidden">
      {ETAPAS.map((etapa, i) => {
        const t = TEMA_CLASSES[etapa.tema];
        const { Icon } = etapa;
        const ultima = i === ETAPAS.length - 1;
        return (
          <section
            key={etapa.numero}
            data-flow-section
            aria-label={`Etapa ${etapa.numero}: ${etapa.titulo}`}
            className="relative min-h-screen w-full overflow-hidden"
          >
            <div className={`flow-inner relative flex min-h-screen w-full flex-col justify-between px-[6vw] py-[8vh] will-change-transform ${t.bg}`}>
              {/* Topo: rótulo da jornada + detalhe da etapa */}
              <div className="flex items-baseline justify-between gap-4">
                <span className={`text-[0.68rem] tracking-[0.26em] uppercase font-extrabold ${t.accent}`}>
                  A jornada
                </span>
                <span className={`text-[0.62rem] tracking-[0.18em] uppercase font-extrabold ${t.sub}`}>
                  {etapa.detalhe}
                </span>
              </div>

              {/* Centro: número gigante + conteúdo */}
              <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-[6vw]">
                <span aria-hidden="true" className={`font-headline font-medium leading-none text-[26vw] md:text-[18vw] ${t.accent} opacity-25 select-none shrink-0`}>
                  {etapa.numero}
                </span>
                <div className="max-w-xl">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${etapa.tema === 'profundo' ? 'bg-background/10 text-ouro-suave' : 'bg-verde-profundo text-background'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className={`font-headline font-medium text-3xl md:text-5xl leading-[1.08] tracking-[-0.02em] mb-5 ${t.text}`}>
                    {etapa.titulo}
                  </h3>
                  <p className={`text-lg md:text-xl font-light leading-relaxed ${t.sub}`}>
                    {etapa.texto}
                  </p>

                  {ultima && (
                    <button
                      type="button"
                      onClick={() => openBooking()}
                      data-cursor="Agendar"
                      className="no-glass mt-9 inline-flex items-center gap-2 bg-background text-verde-profundo px-9 py-4 rounded-full font-semibold text-[0.95rem] shadow-float-1 hover:shadow-float-2 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                    >
                      Começar a minha avaliação
                      <span aria-hidden="true" className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Base: progresso da narrativa */}
              <div className="flex items-center gap-3">
                {ETAPAS.map((_, j) => (
                  <span
                    key={j}
                    aria-hidden="true"
                    className={`h-1 rounded-full transition-all ${j <= i ? 'w-10 bg-ouro-suave' : `w-4 ${etapa.tema === 'profundo' ? 'bg-background/20' : 'bg-on-background/10 dark:bg-stone-700'}`}`}
                  />
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
