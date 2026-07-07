import { motion } from 'framer-motion';
import { ParticleTypography } from '../ui/ParticleTypography';
import { TextEffect } from '../ui/text-animations';

// ============================================================
// ManifestoSection — O beat filosófico ÚNICO da Home (fusão do
// antigo OcorpoComoSistema + Manifesto, passe de edição da
// auditoria: a filosofia era contada em dois momentos dark
// separados e a jornada em três lugares). Header editorial à
// esquerda ("sistema integrado") e a palavra-manifesto em
// partículas interativas como clímax. Canvas 2D leve (pausa
// fora da viewport) + glows CSS — sem WebGL na Home.
// ============================================================

export function ManifestoSection() {
  return (
    <section aria-labelledby="manifesto" className="relative bg-verde-profundo dark:bg-stone-950 overflow-hidden">
      <div aria-hidden="true" className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-primary/20 blur-[130px] pointer-events-none" />
      <div aria-hidden="true" className="absolute -bottom-40 -right-40 w-[520px] h-[520px] rounded-full bg-ouro-suave/10 blur-[130px] pointer-events-none" />

      <div className="relative max-w-[1280px] mx-auto px-6 md:px-12 py-24 md:py-36">
        {/* Header editorial à esquerda — a tese */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mb-16 md:mb-20"
        >
          <p className="inline-flex items-center gap-3 text-[0.68rem] tracking-[0.26em] uppercase font-extrabold text-ouro-suave mb-6">
            <span aria-hidden="true" className="inline-block w-10 h-px bg-ouro-suave" />
            Filosofia 360º
          </p>
          <h2 id="manifesto" className="font-headline font-medium text-4xl md:text-6xl leading-[1.05] tracking-[-0.02em] text-background">
            O corpo humano é um{' '}
            <em className="italic text-verde-nevoa/90">sistema integrado.</em>
          </h2>
          <div className="mt-7 text-lg md:text-xl font-light text-background/75 max-w-2xl leading-relaxed">
            <TextEffect
              text="Ignorar a sua rotina, as suas emoções e o seu contexto é o motivo pelo qual as dietas falham. O que buscamos é o ponto onde ciência, prazer e vida real convivem no mesmo prato."
              preset="blur"
              delay={0.2}
            />
          </div>
        </motion.div>

        {/* Clímax: a palavra-manifesto em partículas (passe o cursor) */}
        <div className="text-center">
          <ParticleTypography
            text="EQUILÍBRIO"
            className="h-[200px] md:h-[280px]"
            color="#f3ead9"
          />
          <p aria-hidden="true" className="mt-2 text-[0.6rem] tracking-[0.26em] uppercase font-extrabold text-background/40">
            Toque na palavra
          </p>
        </div>
      </div>
    </section>
  );
}
