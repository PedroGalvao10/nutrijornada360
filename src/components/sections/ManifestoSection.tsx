import { StaggerReveal, StaggerItem } from '../ui/StaggerReveal';
import { ParticleTypography } from '../ui/ParticleTypography';

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
        <StaggerReveal>
          <StaggerItem>
            <p className="inline-flex items-center justify-center gap-3 text-[0.68rem] tracking-[0.26em] uppercase font-extrabold text-ouro-suave mb-8">
              <span aria-hidden="true" className="inline-block w-10 h-px bg-ouro-suave" />
              O que buscamos
              <span aria-hidden="true" className="inline-block w-10 h-px bg-ouro-suave" />
            </p>
          </StaggerItem>
        </StaggerReveal>

        {/* Palavra-manifesto em partículas (passe o cursor) */}
        <ParticleTypography
          text="EQUILÍBRIO"
          className="h-[220px] md:h-[300px]"
          color="#f3ead9"
        />

        <StaggerReveal>
          <StaggerItem>
            <p className="max-w-[54ch] mx-auto mt-4 text-lg md:text-xl font-light text-background/80 leading-relaxed">
              Não é sobre restrição, e sim sobre encontrar o ponto onde{' '}
              <em className="italic text-ouro-suave">ciência, prazer e rotina</em>{' '}
              convivem no mesmo prato.
            </p>
          </StaggerItem>
        </StaggerReveal>
      </div>
    </section>
  );
}
