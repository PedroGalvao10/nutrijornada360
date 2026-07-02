import { useRef } from 'react';
import { useTilt } from '../../hooks/useTilt';
import { MagneticButton } from '../ui/MagneticButton';
import type { Ebook } from './ebooks-data';

export function EbookCard({ ebook, onDownload }: { ebook: Ebook; onDownload: (ebook: Ebook) => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  useTilt(cardRef, 15);

  return (
    <div
      ref={cardRef}
      className="antigravity-glass bg-white/5 dark:bg-black/20 border border-white/20 dark:border-white/5 p-6 rounded-3xl flex flex-col sm:flex-row gap-6 items-center parallax-shadow hover:shadow-lg transition-shadow duration-300 transform-style-3d"
    >
      <div className="w-40 h-52 flex-shrink-0 bg-surface-container dark:bg-stone-800 rounded-lg overflow-hidden border border-outline/20 dark:border-stone-700 relative tilt-child tz-30 shadow-md">
        <img src={ebook.imageUrl} alt={`Capa ${ebook.title}`} className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2 bg-secondary dark:bg-stone-700 text-on-secondary dark:text-stone-100 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest shadow-sm">PDF</div>
      </div>
      <div className="flex flex-col flex-1 text-center sm:text-left tilt-child tz-10">
        <h3 className="text-xl font-headline font-bold text-on-surface dark:text-stone-100 mb-3">{ebook.title}</h3>
        <p className="text-sm text-on-surface-variant dark:text-stone-400 mb-6">Um guia prático com passos eficientes desenhados para a sua rotina diária.</p>
        <MagneticButton as="div" className="self-start sm:w-auto w-full">
          <button
            onClick={() => onDownload(ebook)}
            className="bg-primary dark:bg-emerald-500 text-on-primary dark:text-stone-950 font-bold px-6 py-3 rounded-full hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-auto w-full shadow-sm active:scale-[0.98] tilt-child tz-20"
          >
            <span className="material-symbols-outlined text-[18px]">download</span> Baixar Grátis
          </button>
        </MagneticButton>
      </div>
    </div>
  );
}
