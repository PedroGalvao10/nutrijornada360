import { BookOpen } from 'lucide-react';
import { PerspectiveBook } from '../ui/PerspectiveBook';
import type { Ebook } from './ebooks-data';

// ============================================================
// EbookCard — cartão de download na direção Editorial Orgânico.
// A capa usa o mesmo PerspectiveBook da vitrine de Sobre (sem
// foto de banco de imagens): tipografia da marca em vez de uma
// imagem de banco de imagens genérica sem relação com o conteúdo.
// ============================================================

export function EbookCard({ ebook, onDownload }: { ebook: Ebook; onDownload: (ebook: Ebook) => void }) {
  return (
    <div className="bg-white dark:bg-stone-900 rounded-[28px] p-6 md:p-7 shadow-float-1 hover:shadow-float-2 transition-all duration-500 flex flex-col sm:flex-row gap-6 items-center">
      <div className="shrink-0">
        <PerspectiveBook size="sm">
          <div className="flex items-center gap-1.5 text-ouro-suave">
            <BookOpen className="w-3.5 h-3.5" />
            <span className="text-[0.6rem] font-extrabold uppercase tracking-[0.14em]">E-book grátis</span>
          </div>
        </PerspectiveBook>
      </div>
      <div className="flex flex-col flex-1 text-center sm:text-left">
        <h3 className="font-headline font-medium text-xl text-on-background dark:text-stone-100 mb-3">{ebook.title}</h3>
        <p className="text-sm text-on-surface-variant dark:text-stone-400 mb-6">Um guia prático com passos eficientes desenhados para a sua rotina diária.</p>
        <button
          onClick={() => onDownload(ebook)}
          data-cursor="Baixar"
          className="no-glass self-center sm:self-start bg-verde-profundo dark:bg-emerald-500 text-background dark:text-stone-950 font-semibold px-6 py-3 rounded-full flex items-center justify-center gap-2 mt-auto shadow-float-1 hover:shadow-float-2 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[18px]">download</span>
          Baixar grátis
        </button>
      </div>
    </div>
  );
}
