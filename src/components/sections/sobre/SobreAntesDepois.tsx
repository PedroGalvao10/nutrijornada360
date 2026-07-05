import { useState } from 'react';
import { GripVertical } from 'lucide-react';
import { StaggerReveal, StaggerItem } from '../../ui/StaggerReveal';
import aprovadaCuscs from '../../../assets/aprovada-cuscs.jpg';
import marianaProfile from '../../../assets/mariana-profile.webp';

// ============================================================
// SobreAntesDepois — slider comparativo arrastável (Feature With
// Image Comparison, 21st.dev / Leva B do blueprint de imersão).
// Duas fotos REAIS da Mariana: a comemoração da aprovação na
// faculdade ("onde começou") e o retrato profissional ("hoje").
// Arrasta-se o divisor (mouse/touch) para viajar no tempo.
// ============================================================

export function SobreAntesDepois() {
  const [inset, setInset] = useState<number>(50);
  const [dragging, setDragging] = useState<boolean>(false);

  const onMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    let x = 0;
    if ('touches' in e && e.touches.length > 0) {
      x = e.touches[0].clientX - rect.left;
    } else if ('clientX' in e) {
      x = e.clientX - rect.left;
    }
    setInset(Math.min(100, Math.max(0, (x / rect.width) * 100)));
  };

  return (
    <section aria-label="Da aprovação na faculdade até hoje" className="max-w-[1280px] mx-auto px-6 md:px-12 pb-24 md:pb-32">
      <StaggerReveal className="grid md:grid-cols-[1fr_1.1fr] gap-10 md:gap-[5vw] items-center">
        <StaggerItem>
          <h2 className="font-headline font-medium text-3xl md:text-4xl leading-[1.12] text-on-background dark:text-stone-100 mb-5">
            A mesma pessoa, <em className="italic text-primary dark:text-emerald-400">alguns anos de estudo depois.</em>
          </h2>
          <p className="text-on-surface-variant dark:text-stone-400 font-light leading-relaxed max-w-[46ch] mb-4">
            À esquerda, o dia da aprovação na faculdade de Nutrição — cara
            pintada e tudo. À direita, a nutricionista que atende hoje.
          </p>
          <p className="text-[0.68rem] tracking-[0.22em] uppercase font-extrabold text-tertiary dark:text-ouro-suave">
            Arraste o divisor ✦ viaje no tempo
          </p>
        </StaggerItem>

        <StaggerItem>
          <div
            role="slider"
            aria-label="Comparação entre a foto da aprovação e a foto atual"
            aria-valuenow={Math.round(inset)}
            aria-valuemin={0}
            aria-valuemax={100}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') setInset((v) => Math.max(0, v - 5));
              if (e.key === 'ArrowRight') setInset((v) => Math.min(100, v + 5));
            }}
            className="relative aspect-[4/5] max-h-[560px] w-full overflow-hidden rounded-[28px] select-none shadow-float-2 cursor-ew-resize"
            onMouseMove={onMove}
            onMouseUp={() => setDragging(false)}
            onMouseLeave={() => setDragging(false)}
            onTouchMove={onMove}
            onTouchEnd={() => setDragging(false)}
          >
            {/* Divisor arrastável */}
            <div
              className="absolute top-0 z-20 h-full w-0.5 -ml-px bg-ouro-suave select-none"
              style={{ left: inset + '%' }}
            >
              <button
                type="button"
                aria-hidden="true"
                tabIndex={-1}
                className="no-glass absolute top-1/2 -translate-y-1/2 -ml-[13px] z-30 w-7 h-11 rounded-full bg-ouro-suave text-verde-profundo cursor-ew-resize flex justify-center items-center shadow-float-1 hover:scale-110 transition-transform select-none"
                onTouchStart={(e) => { setDragging(true); onMove(e); }}
                onMouseDown={(e) => { setDragging(true); onMove(e); }}
                onTouchEnd={() => setDragging(false)}
                onMouseUp={() => setDragging(false)}
              >
                <GripVertical className="h-4 w-4 select-none" />
              </button>
            </div>

            {/* Camada de cima (direita do divisor): hoje */}
            <img
              src={marianaProfile}
              alt="Mariana Bermudes hoje, nutricionista"
              draggable={false}
              className="absolute left-0 top-0 z-10 w-full h-full object-cover object-top select-none"
              style={{ clipPath: 'inset(0 0 0 ' + inset + '%)' }}
            />
            {/* Camada de baixo (esquerda do divisor): a aprovação */}
            <img
              src={aprovadaCuscs}
              alt="Mariana comemorando a aprovação na faculdade de Nutrição"
              draggable={false}
              className="absolute left-0 top-0 w-full h-full object-cover object-top select-none"
            />

            {/* Rótulos */}
            <span className="absolute bottom-4 left-4 z-20 px-3 py-1 rounded-full bg-verde-profundo/80 backdrop-blur-sm text-background text-[0.6rem] font-extrabold uppercase tracking-[0.16em] pointer-events-none">
              Onde começou
            </span>
            <span className="absolute bottom-4 right-4 z-20 px-3 py-1 rounded-full bg-ouro-suave/90 text-verde-profundo text-[0.6rem] font-extrabold uppercase tracking-[0.16em] pointer-events-none">
              Hoje
            </span>
          </div>
        </StaggerItem>
      </StaggerReveal>
    </section>
  );
}
