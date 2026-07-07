import { ParticleTypography } from '../ui/ParticleTypography';
import { TextEffect } from '../ui/text-animations';

// ============================================================
// ManifestoSection — único beat imersivo full-bleed escuro da
// Home (blueprint 21st.dev, Seção 9). A palavra-manifesto é
// desenhada em partículas que se dispersam ao passar o cursor.
// Canvas leve (pausa fora da viewport). Respiro dramático entre
// as seções claras, sem competir com a marca creme.
// ============================================================

export function ManifestoSection() {
  return (
    <section aria-label="Manifesto: equilíbrio" className="relative bg-verde-profundo dark:bg-stone-950 overflow-hidden">
      <div aria-hidden="true" className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-primary/20 blur-[130px] pointer-events-none" />
      <div aria-hidden="true" className="absolute -bottom-40 -right-40 w-[520px] h-[520px] rounded-full bg-ouro-suave/10 blur-[130px] pointer-events-none" />

      <div className="relative max-w-[1280px] mx-auto px-6 md:px-12 py-20 md:py-28 text-center">
        <div className="mb-8">
          <p className="inline-flex items-center justify-center gap-3 text-[0.68rem] tracking-[0.26em] uppercase font-extrabold text-ouro-suave">
            <span aria-hidden="true" className="inline-block w-10 h-px bg-ouro-suave" />
            O que buscamos
            <span aria-hidden="true" className="inline-block w-10 h-px bg-ouro-suave" />
          </p>
        </div>

        {/* Palavra-manifesto em partículas (passe o cursor) */}
        <ParticleTypography
          text="EQUILÍBRIO"
          className="h-[220px] md:h-[300px]"
          color="#f3ead9"
        />

        <div className="max-w-[54ch] mx-auto mt-4 text-lg md:text-xl font-light text-background/80 leading-relaxed">
          <TextEffect text="Não é sobre restrição, e sim sobre encontrar o ponto onde ciência, prazer e rotina convivem no mesmo prato." preset="fade" delay={0.2} />
        </div>
      </div>
    </section>
  );
}
