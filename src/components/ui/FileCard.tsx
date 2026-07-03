import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

// ============================================================
// FileCard — cartão-arquivo (File Card Collections, 21st.dev)
// reduzido aos formatos que o site usa e recolorido para a
// direção Editorial Orgânico. Dá corpo visual a downloads:
// contrato PDF do booking, e-books, materiais de apoio.
// ============================================================

type FormatFile = 'pdf' | 'doc' | 'xls' | 'img';

const colorBannerMap: Record<FormatFile, string> = {
  pdf: 'bg-verde-profundo text-background',
  doc: 'bg-primary text-background',
  xls: 'bg-tertiary text-background',
  img: 'bg-ouro-suave text-verde-profundo',
};

// Linhas fantasma simulando o conteúdo do documento
function DocPlaceholder() {
  return (
    <div className="space-y-1.5" aria-hidden="true">
      <div className="flex gap-2">
        <div className="bg-on-background/20 dark:bg-stone-100/20 h-0.5 w-1/2 rounded-full" />
      </div>
      <div className="flex gap-1">
        <div className="bg-on-background/10 dark:bg-stone-100/10 h-0.5 w-1/3 rounded-full" />
        <div className="bg-on-background/10 dark:bg-stone-100/10 h-0.5 w-1/3 rounded-full" />
      </div>
      <div className="flex gap-1">
        <div className="bg-on-background/10 dark:bg-stone-100/10 h-0.5 w-1/2 rounded-full" />
        <div className="bg-on-background/10 dark:bg-stone-100/10 h-0.5 w-1/3 rounded-full" />
      </div>
      <div className="flex gap-1">
        <div className="bg-on-background/10 dark:bg-stone-100/10 h-0.5 w-1/3 rounded-full" />
        <div className="bg-on-background/10 dark:bg-stone-100/10 h-0.5 w-1/3 rounded-full" />
      </div>
      <div className="flex gap-1">
        <div className="bg-on-background/10 dark:bg-stone-100/10 h-0.5 w-1/3 rounded-full" />
        <div className="bg-on-background/10 dark:bg-stone-100/10 h-0.5 w-1/2 rounded-full" />
      </div>
    </div>
  );
}

type FileCardProps = {
  formatFile?: FormatFile;
  /** Título curto exibido sob o cartão (ex.: "Contrato de prestação"). */
  label?: ReactNode;
  className?: string;
};

export function FileCard({ formatFile = 'pdf', label, className }: FileCardProps) {
  return (
    <div className={cn('group inline-flex flex-col items-center gap-2', className)}>
      <div className="relative w-24 h-[7.5rem] bg-white dark:bg-stone-900 rounded-[14px] border border-surface-variant dark:border-stone-700 shadow-float-1 group-hover:shadow-float-2 group-hover:-translate-y-1 transition-all duration-300 overflow-hidden p-3">
        {/* Dobra de canto do "papel" */}
        <div aria-hidden="true" className="absolute top-0 right-0 w-4 h-4 bg-creme-2 dark:bg-stone-800 rounded-bl-[10px] border-b border-l border-surface-variant dark:border-stone-700" />
        <DocPlaceholder />
        {/* Banner do formato */}
        <span className={cn(
          'absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md text-[0.6rem] font-extrabold uppercase tracking-[0.12em]',
          colorBannerMap[formatFile]
        )}>
          {formatFile}
        </span>
      </div>
      {label && (
        <span className="text-xs text-on-surface-variant dark:text-stone-400 text-center max-w-[9rem] leading-snug">
          {label}
        </span>
      )}
    </div>
  );
}
