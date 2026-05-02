import { useRef } from 'react';
import { useTilt } from '../../hooks/useTilt';
import { StaggerReveal, StaggerItem } from '../ui/StaggerReveal';
import { GlowWrapper } from '../ui/GlowWrapper';

export function MissionSection() {
  // Refs para 3D Tilt - Missão
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);

  useTilt(card1Ref, 15);
  useTilt(card2Ref, 15);
  useTilt(card3Ref, 15);

  return (
    <section className="py-16 md:py-24 bg-white/5 dark:bg-stone-950 relative overflow-hidden transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <StaggerReveal className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
          <StaggerItem>
            <span className="text-secondary font-label font-bold tracking-widest uppercase text-sm mb-4 block">Nossa Missão</span>
          </StaggerItem>
          <StaggerItem>
            <h2 className="text-3xl md:text-5xl font-headline text-on-background dark:text-stone-100 mb-6 leading-tight font-semibold">O ser humano não é uma ilha isolada.</h2>
          </StaggerItem>
          <StaggerItem>
            <p className="text-base md:text-lg text-on-surface-variant dark:text-stone-400 leading-relaxed">
              Acreditamos que a nutrição deve promover o bem-estar pleno, integrando mente, corpo e ambiente. Olhamos para a sua história, suas emoções e o contexto da sua vida.
            </p>
          </StaggerItem>
        </StaggerReveal>

        {/* Grid 2-col no estilo Ruixen */}
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Bloco Esquerdo — Saúde Integral + Respeito Mental */}
          <StaggerReveal className="flex flex-col border border-outline-variant/30 dark:border-stone-800/40 p-4 sm:p-6 lg:p-8 gap-8">
            <StaggerItem>
              <GlowWrapper 
                ref={card1Ref}
                className="antigravity-glass bg-white/5 dark:bg-stone-900/60 p-6 sm:p-8 rounded-3xl border-none shadow-sm hover:shadow-xl dark:hover:shadow-emerald-950/30 transition-all duration-300 transform-style-3d cursor-pointer"
                data-cursor="Conheça a Visão"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-5 text-primary tilt-child tz-30">
                  <span className="material-symbols-outlined text-3xl">favorite</span>
                </div>
                <h3 className="font-headline text-xl font-bold text-on-surface dark:text-stone-100 mb-3 tilt-child tz-20">Saúde Integral</h3>
                <p className="text-on-surface-variant dark:text-stone-400 text-sm leading-relaxed tilt-child tz-10">Foco no equilíbrio metabólico e hormonal, tratando o corpo como um sistema conectado.</p>
              </GlowWrapper>
            </StaggerItem>
            <StaggerItem>
              <GlowWrapper 
                ref={card2Ref}
                className="antigravity-glass bg-white/5 dark:bg-stone-900/60 p-6 sm:p-8 rounded-3xl border-none shadow-sm hover:shadow-xl dark:hover:shadow-emerald-950/30 transition-all duration-300 transform-style-3d cursor-pointer"
                data-cursor="Mente & Equilíbrio"
              >
                <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center mb-5 text-secondary tilt-child tz-30">
                  <span className="material-symbols-outlined text-3xl">psychology</span>
                </div>
                <h3 className="font-headline text-xl font-bold text-on-surface dark:text-stone-100 mb-3 tilt-child tz-20">Respeito Mental</h3>
                <p className="text-on-surface-variant dark:text-stone-400 text-sm leading-relaxed tilt-child tz-10">Sua relação com a comida importa tanto quanto os nutrientes que você consome.</p>
              </GlowWrapper>
            </StaggerItem>
          </StaggerReveal>

          {/* Bloco Direito — Nutrição Orgânica + Texto */}
          <StaggerReveal className="flex flex-col justify-center border border-outline-variant/30 dark:border-stone-800/40 p-4 sm:p-6 lg:p-8" delay={0.2}>
            <StaggerItem>
              <GlowWrapper 
                ref={card3Ref}
                className="antigravity-glass bg-white/5 dark:bg-stone-900/60 p-6 sm:p-8 rounded-3xl border-none shadow-sm hover:shadow-xl dark:hover:shadow-emerald-950/30 transition-all duration-300 transform-style-3d mb-6 cursor-pointer"
                data-cursor="Vitalidade Pura"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-5 text-primary tilt-child tz-30">
                  <span className="material-symbols-outlined text-3xl">eco</span>
                </div>
                <h3 className="font-headline text-xl font-bold text-on-surface dark:text-stone-100 mb-3 tilt-child tz-20">Nutrição Orgânica</h3>
                <p className="text-on-surface-variant dark:text-stone-400 text-sm leading-relaxed tilt-child tz-10">Preferência por alimentos reais, minimamente processados para máxima vitalidade.</p>
              </GlowWrapper>
            </StaggerItem>
            <StaggerItem>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-normal text-on-surface dark:text-stone-100 leading-relaxed font-headline">
                Nutrição com Propósito{' '}
                <span className="text-primary dark:text-emerald-400 font-semibold">NutriJornada</span>{' '}
                <span className="text-on-surface-variant dark:text-stone-400 text-sm sm:text-base lg:text-lg font-body">
                  Cada plano é desenhado para integrar ciência, comportamento e rotina — porque saúde de verdade é sustentável.
                </span>
              </h3>
            </StaggerItem>
          </StaggerReveal>
        </div>
      </div>
    </section>
  );
}
