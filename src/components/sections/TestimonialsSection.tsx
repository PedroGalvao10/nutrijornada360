import { Quote, Star } from 'lucide-react';
import { StaggerReveal, StaggerItem } from '../ui/StaggerReveal';

// ============================================================
// TestimonialsSection — prova social (blueprint 21st.dev,
// "Testimonials Columns"). Depoimentos REAIS do formulário de
// satisfação, todos com autorização de uso institucional e nota
// 5/5. Gramática levemente ajustada, preservando a voz. Foto
// substituída por monograma (discreto/privado, como pede o termo
// de autorização). Direção Editorial Orgânico.
// ============================================================

type Depoimento = {
  nome: string;
  iniciais: string;
  contexto: string;
  nota: number;
  texto: string;
};

const DEPOIMENTOS: Depoimento[] = [
  {
    nome: 'Cláudia Galvão',
    iniciais: 'CG',
    contexto: 'Emagrecimento',
    nota: 5,
    texto:
      'Sensacional! Me senti super acolhida. Já estava desistindo de fazer dieta, mas você, Mari, foi incrível no meu processo de emagrecimento — com uma dieta baseada no meu dia a dia.',
  },
  {
    nome: 'Isabela Dalda',
    iniciais: 'ID',
    contexto: 'Reeducação alimentar',
    nota: 5,
    texto:
      'Ter o acompanhamento 24 horas, com dicas e instruções, fez todo o diferencial no meu processo. Me ajudou a fazer escolhas melhores e mais saudáveis. É incrível! Recomendo muito!',
  },
  {
    nome: 'Vinícius Firmo',
    iniciais: 'VF',
    contexto: 'Acompanhamento nutricional',
    nota: 5,
    texto:
      'Além de um acompanhamento muito profissional, as abordagens são personalizadas e humanas, levando em consideração também os critérios sociais.',
  },
];

const notaMedia = DEPOIMENTOS.reduce((soma, d) => soma + d.nota, 0) / DEPOIMENTOS.length;

export function TestimonialsSection() {
  return (
    <section aria-labelledby="depoimentos" className="py-20 md:py-28 bg-creme-2 dark:bg-stone-900/40 relative overflow-hidden transition-colors duration-500">
      <div aria-hidden="true" className="absolute -bottom-40 -left-40 w-[520px] h-[520px] rounded-full bg-verde-nevoa/40 dark:bg-emerald-900/15 blur-[120px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-6 md:px-12 relative z-10">
        {/* Cabeçalho assimétrico: nota real como âncora visual, sem o eyebrow padrão */}
        <StaggerReveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-12 md:mb-16">
          <StaggerItem>
            <h2 id="depoimentos" className="font-headline font-medium text-3xl md:text-[2.8rem] leading-[1.1] tracking-[-0.02em] text-on-background dark:text-stone-100 max-w-xl">
              Quem já passou por aqui não fala como quem lê roteiro.
            </h2>
          </StaggerItem>
          <StaggerItem>
            <div className="flex items-center gap-4 shrink-0">
              <span className="font-headline font-medium text-5xl text-primary dark:text-emerald-400 leading-none">
                {notaMedia.toFixed(1)}
              </span>
              <div>
                <span className="flex gap-0.5 mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} aria-hidden="true" className="w-3.5 h-3.5 fill-ouro-suave text-ouro-suave" />
                  ))}
                </span>
                <p className="text-[0.62rem] uppercase tracking-[0.16em] font-extrabold text-on-surface-variant/70 dark:text-stone-500 leading-tight">
                  {DEPOIMENTOS.length} avaliações reais
                </p>
              </div>
            </div>
          </StaggerItem>
        </StaggerReveal>

        <StaggerReveal className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8" staggerInterval={0.12}>
          {DEPOIMENTOS.map((d) => (
            <StaggerItem key={d.nome} className="h-full">
              <figure className="h-full flex flex-col bg-white dark:bg-stone-900 rounded-[28px] p-8 shadow-float-1 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-float-2">
                <Quote aria-hidden="true" className="w-8 h-8 text-ouro-suave/70 mb-5 shrink-0" />

                <blockquote className="flex-grow">
                  <p className="font-headline text-lg leading-relaxed text-on-background dark:text-stone-200">
                    “{d.texto}”
                  </p>
                </blockquote>

                <figcaption className="mt-8 pt-6 border-t border-surface-variant dark:border-stone-800 flex items-center gap-4">
                  <div aria-hidden="true" className="w-12 h-12 rounded-full bg-verde-nevoa dark:bg-emerald-900/30 flex items-center justify-center font-headline font-medium text-primary dark:text-emerald-400 shrink-0">
                    {d.iniciais}
                  </div>
                  <div className="min-w-0">
                    <p className="font-headline font-medium text-on-background dark:text-stone-100 leading-tight">{d.nome}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="flex" aria-label={`Avaliação ${d.nota} de 5`}>
                        {Array.from({ length: d.nota }).map((_, i) => (
                          <Star key={i} aria-hidden="true" className="w-3.5 h-3.5 fill-ouro-suave text-ouro-suave" />
                        ))}
                      </span>
                      <span className="text-[0.62rem] uppercase tracking-[0.16em] font-extrabold text-on-surface-variant/70 dark:text-stone-500">{d.contexto}</span>
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
