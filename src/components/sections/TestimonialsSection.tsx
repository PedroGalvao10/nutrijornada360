import { Star } from 'lucide-react';
import { StaggerReveal, StaggerItem } from '../ui/StaggerReveal';
import { AnimatedUnderlineText } from '../ui/text-animations';
import { cn } from '../../lib/utils';

// ============================================================
// TestimonialsSection — Mural de Recados Analógico
// Depoimentos REAIS do formulário de satisfação.
// Visual simulando bilhetes e post-its presos num mural,
// afastando do padrão sintético "grid de reviews".
// ============================================================

type Depoimento = {
  nome: string;
  iniciais: string;
  contexto: string;
  nota: number;
  texto: string;
  rotacao: string;
  corDeFundo: string;
  fonteTexto: string;
};

const DEPOIMENTOS: Depoimento[] = [
  {
    nome: 'Cláudia Galvão',
    iniciais: 'CG',
    contexto: 'Emagrecimento',
    nota: 5,
    texto:
      'Sensacional! Me senti super acolhida. Já estava desistindo de fazer dieta, mas você, Mari, foi incrível no meu processo de emagrecimento — com uma dieta baseada no meu dia a dia.',
    rotacao: '-rotate-2',
    corDeFundo: 'bg-[#F9F7F3] dark:bg-stone-800',
    fonteTexto: 'font-handwriting text-2xl',
  },
  {
    nome: 'Isabela Dalda',
    iniciais: 'ID',
    contexto: 'Reeducação alimentar',
    nota: 5,
    texto:
      'Ter o acompanhamento 24 horas, com dicas e instruções, fez todo o diferencial no meu processo. Me ajudou a fazer escolhas melhores e mais saudáveis. É incrível! Recomendo muito!',
    rotacao: 'rotate-3 md:translate-y-6',
    corDeFundo: 'bg-emerald-50 dark:bg-emerald-900/20',
    fonteTexto: 'font-handwriting text-2xl',
  },
  {
    nome: 'Vinícius Firmo',
    iniciais: 'VF',
    contexto: 'Acompanhamento nutricional',
    nota: 5,
    texto:
      'Além de um acompanhamento muito profissional, as abordagens são personalizadas e humanas, levando em consideração também os critérios sociais.',
    rotacao: '-rotate-3 md:translate-y-2',
    corDeFundo: 'bg-orange-50 dark:bg-orange-900/10',
    fonteTexto: 'font-handwriting text-2xl',
  },
];

const notaMedia = DEPOIMENTOS.reduce((soma, d) => soma + d.nota, 0) / DEPOIMENTOS.length;

export function TestimonialsSection() {
  return (
    <section aria-labelledby="depoimentos" className="py-24 md:py-32 bg-stone-100 dark:bg-stone-900/40 relative overflow-hidden transition-colors duration-500">
      <div aria-hidden="true" className="absolute -bottom-40 -left-40 w-[520px] h-[520px] rounded-full bg-verde-nevoa/40 dark:bg-emerald-900/15 blur-[120px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-6 md:px-12 relative z-10">
        <StaggerReveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-16 md:mb-24">
          <StaggerItem>
            <h2 id="depoimentos" className="font-headline font-medium text-4xl md:text-[3.2rem] leading-[1.1] tracking-[-0.02em] text-stone-900 dark:text-stone-100 max-w-xl">
              Quem já sentou nessa cadeira <em className="italic text-primary dark:text-emerald-400"><AnimatedUnderlineText text="não fala como roteiro." /></em>
            </h2>
          </StaggerItem>
          <StaggerItem>
            <div className="flex items-center gap-4 shrink-0 bg-white/50 dark:bg-stone-800/50 p-4 rounded-xl backdrop-blur-sm shadow-sm border border-stone-200 dark:border-stone-700">
              <span className="font-handwriting text-5xl text-stone-800 dark:text-emerald-400 leading-none">
                {notaMedia.toFixed(1)}
              </span>
              <div>
                <span className="flex gap-0.5 mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} aria-hidden="true" className="w-4 h-4 fill-ouro-suave text-ouro-suave" />
                  ))}
                </span>
                <p className="font-handwriting text-lg text-stone-500 dark:text-stone-400 leading-tight">
                  {DEPOIMENTOS.length} bilhetes reais
                </p>
              </div>
            </div>
          </StaggerItem>
        </StaggerReveal>

        <StaggerReveal className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12" staggerInterval={0.15}>
          {DEPOIMENTOS.map((d) => (
            <StaggerItem key={d.nome} className="h-full relative group perspective-[1000px]">
              <figure 
                className={cn(
                  "h-full flex flex-col p-8 md:p-10 shadow-md transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 hover:shadow-xl hover:z-20 relative",
                  d.corDeFundo,
                  d.rotacao
                )}
                // We add a subtle paper texture to each note
                style={{ 
                  border: '1px solid rgba(0,0,0,0.05)',
                  boxShadow: '2px 4px 15px rgba(0,0,0,0.08), inset 0 0 40px rgba(0,0,0,0.02)'
                }}
              >
                {/* Fita adesiva visual (Tape) */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-white/60 dark:bg-stone-700/60 backdrop-blur-sm shadow-sm rotate-2 border border-black/5" />

                <blockquote className="flex-grow mt-4">
                  <p className={cn("leading-relaxed text-stone-700 dark:text-stone-300", d.fonteTexto)}>
                    “{d.texto}”
                  </p>
                </blockquote>

                <figcaption className="mt-8 flex items-center gap-4">
                  <div className="min-w-0">
                    <p className="font-handwriting text-2xl font-medium text-stone-900 dark:text-stone-100 leading-tight">{d.nome}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="flex opacity-70" aria-label={`Avaliação ${d.nota} de 5`}>
                        {Array.from({ length: d.nota }).map((_, i) => (
                          <Star key={i} aria-hidden="true" className="w-3 h-3 fill-ouro-suave text-ouro-suave" />
                        ))}
                      </span>
                      <span className="text-[0.62rem] uppercase tracking-[0.16em] font-extrabold text-stone-400 dark:text-stone-500">{d.contexto}</span>
                    </div>
                  </div>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
