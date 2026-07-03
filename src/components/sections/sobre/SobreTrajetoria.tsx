import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, FlaskConical, Stethoscope } from 'lucide-react';

// ============================================================
// SobreTrajetoria — trajetória no padrão "Release Time Line"
// (21st.dev): linha vertical onde só o card mais próximo do
// centro do viewport expande seus detalhes. Adaptado à marca
// Editorial Orgânico e ao conteúdo real (São Camilo → Liga →
// clínica). rAF lê o ativo por ref para não re-render por frame.
// ============================================================

type Etapa = {
  Icon: React.ComponentType<{ className?: string }>;
  titulo: string;
  contexto: string;
  descricao: string;
  itens?: string[];
};

const ETAPAS: Etapa[] = [
  {
    Icon: GraduationCap,
    titulo: 'Formação',
    contexto: 'Centro Universitário São Camilo',
    descricao:
      'Graduada em Nutrição pelo Centro Universitário São Camilo, referência em saúde em São Paulo.',
  },
  {
    Icon: FlaskConical,
    titulo: 'Vida acadêmica',
    contexto: 'Pesquisa · Educação nutricional',
    descricao:
      'Envolvida com pesquisa e educação nutricional ainda na graduação, aproximando ciência e prática.',
    itens: [
      'Diretora de Pesquisa da Liga de Unidades de Alimentação e Nutrição',
      'Monitora de Marketing Nutricional',
      'Foco em rotulagem de alimentos e educação nutricional',
    ],
  },
  {
    Icon: Stethoscope,
    titulo: 'Experiência profissional',
    contexto: 'Clínica · Hospitalar · Coletiva',
    descricao:
      'Da alta gastronomia à saúde coletiva, uma vivência que atravessa contextos e sempre volta ao cuidado com gente.',
    itens: [
      'Rosewood Hotel Group',
      'Nutrição Clínica no Hospital São Camilo',
      'Saúde Coletiva na Associação Nossa Turma',
      'Atendimento na Clínica Escola Promove',
    ],
  },
];

export function SobreTrajetoria() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const sentinelRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Card ativo = sentinela mais próxima do centro-alto do viewport.
  // Recalcula no scroll/resize (passivo); só dispara setState ao mudar.
  useEffect(() => {
    const recompute = () => {
      const centerY = window.innerHeight / 2.5;
      let bestIndex = 0;
      let bestDist = Infinity;
      sentinelRefs.current.forEach((node, i) => {
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const mid = rect.top + rect.height / 2;
        const dist = Math.abs(mid - centerY);
        if (dist < bestDist) {
          bestDist = dist;
          bestIndex = i;
        }
      });
      if (bestIndex !== activeIndexRef.current) {
        activeIndexRef.current = bestIndex;
        setActiveIndex(bestIndex);
      }
    };
    window.addEventListener('scroll', recompute, { passive: true });
    window.addEventListener('resize', recompute);
    recompute();
    return () => {
      window.removeEventListener('scroll', recompute);
      window.removeEventListener('resize', recompute);
    };
  }, []);

  return (
    <section aria-labelledby="trajetoria" className="max-w-[1280px] mx-auto px-6 md:px-12 pb-24 md:pb-32">
      <div className="max-w-2xl mb-12 md:mb-16">
        <p className="inline-flex items-center gap-3 text-[0.68rem] tracking-[0.26em] uppercase font-extrabold text-tertiary dark:text-ouro-suave mb-5">
          <span aria-hidden="true" className="inline-block w-10 h-px bg-ouro-suave" />
          Trajetória
        </p>
        <h2 id="trajetoria" className="font-headline font-medium text-3xl md:text-4xl leading-[1.12] text-on-background dark:text-stone-100">
          Do hospital ao consultório, <em className="italic text-primary dark:text-emerald-400">sempre perto de gente.</em>
        </h2>
      </div>

      <div className="mx-auto max-w-3xl space-y-12 md:space-y-20">
        {ETAPAS.map((etapa, index) => {
          const isActive = index === activeIndex;
          const { Icon } = etapa;
          return (
            <div key={etapa.titulo} className="relative flex flex-col gap-4 md:flex-row md:gap-12" aria-current={isActive ? 'true' : 'false'}>
              {/* Coluna meta sticky */}
              <div className="top-28 flex h-min w-full md:w-56 shrink-0 items-center gap-3 md:sticky">
                <div className={`p-2.5 rounded-xl transition-colors duration-300 ${
                  isActive ? 'bg-verde-profundo text-background' : 'bg-verde-nevoa dark:bg-emerald-900/30 text-primary dark:text-emerald-400'
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-headline italic text-ouro-suave text-sm leading-none mb-1">Nº 0{index + 1}</span>
                  <span className="font-headline font-medium text-on-background dark:text-stone-100 leading-tight">{etapa.titulo}</span>
                  <span className="text-[0.7rem] uppercase tracking-[0.14em] font-extrabold text-on-surface-variant/70 dark:text-stone-500 mt-0.5">{etapa.contexto}</span>
                </div>
              </div>

              {/* Sentinela invisível p/ medir proximidade ao centro */}
              <div ref={(el) => { sentinelRefs.current[index] = el; }} aria-hidden className="absolute -top-24 left-0 h-12 w-12 opacity-0 pointer-events-none" />

              {/* Card de conteúdo */}
              <article
                className={`flex-1 flex flex-col rounded-[24px] p-6 md:p-8 transition-all duration-500 ${
                  isActive
                    ? 'bg-white dark:bg-stone-900 shadow-float-2'
                    : 'bg-white/60 dark:bg-stone-900/50 shadow-float-1'
                }`}
              >
                <div aria-hidden="true" className="w-16 h-px bg-ouro-suave mb-5" />
                <p className={`leading-relaxed transition-colors duration-300 ${
                  isActive ? 'text-on-background dark:text-stone-200' : 'text-on-surface-variant/80 dark:text-stone-400'
                }`}>
                  {etapa.descricao}
                </p>

                {etapa.itens && (
                  <motion.div
                    initial={false}
                    animate={{ height: isActive ? 'auto' : 0, opacity: isActive ? 1 : 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <ul className="space-y-2.5 border-t border-surface-variant dark:border-stone-800 pt-5 mt-5">
                      {etapa.itens.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm text-on-surface-variant dark:text-stone-400 leading-relaxed">
                          <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 rounded-full bg-ouro-suave shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </article>
            </div>
          );
        })}
      </div>
    </section>
  );
}
