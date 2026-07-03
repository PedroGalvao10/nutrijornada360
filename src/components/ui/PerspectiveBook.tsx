import React from 'react';
import { cn } from '../../lib/utils';

// ============================================================
// PerspectiveBook — livro em perspectiva 3D CSS (Perspective
// Book, 21st.dev). Materializa credenciais/publicações num
// objeto tátil que abre no hover. Leve (sem WebGL), recolorido
// para a paleta Editorial Orgânico.
// ============================================================

const sizeMap = {
  sm: { width: '150px', spineTranslation: '122px' },
  default: { width: '196px', spineTranslation: '168px' },
  lg: { width: '300px', spineTranslation: '272px' },
};

interface PerspectiveBookProps {
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  children: React.ReactNode;
}

export function PerspectiveBook({ size = 'default', className = '', children }: PerspectiveBookProps) {
  const defaultColorClasses = cn(
    'bg-white dark:bg-stone-900',
    'text-verde-profundo dark:text-emerald-400'
  );

  return (
    <div className="z-10 group [perspective:900px] w-min h-min">
      <div
        style={{ width: sizeMap[size].width, borderRadius: '6px 4px 4px 6px' }}
        className="transition-transform duration-300 ease-out relative [transform-style:preserve-3d] [transform:rotateY(0deg)] group-hover:[transform:rotateY(-20deg)] group-hover:scale-[1.066] group-hover:-translate-x-1 aspect-[49/60]"
      >
        {/* Capa (frente) */}
        <div
          className={cn(
            "absolute inset-y-0 overflow-hidden size-full left-0 flex flex-col p-[12%] after:content-[''] after:absolute after:inset-0 after:shadow-[0_1.8px_3.6px_#0000000d,_0_10.8px_21.6px_#00000014,_inset_0_-.9px_#0000001a,_inset_0_1.8px_1.8px_#ffffff1a,_inset_3.6px_0_3.6px_#0000001a] after:pointer-events-none after:rounded-[inherit] after:border-[#00000014] after:border after:border-solid",
            className || defaultColorClasses
          )}
          style={{ transform: 'translateZ(25px)', borderRadius: '6px 4px 4px 6px' }}
        >
          <div
            className="absolute left-0 top-0 h-full opacity-40"
            style={{
              minWidth: '8.2%',
              background:
                'linear-gradient(90deg, hsla(0, 0%, 100%, 0), hsla(0, 0%, 100%, 0) 12%, hsla(0, 0%, 100%, .25) 29.25%, hsla(0, 0%, 100%, 0) 50.5%, hsla(0, 0%, 100%, 0) 75.25%, hsla(0, 0%, 100%, .25) 91%, hsla(0, 0%, 100%, 0)), linear-gradient(90deg, rgba(0, 0, 0, .03), rgba(0, 0, 0, .1) 12%, transparent 30%, rgba(0, 0, 0, .02) 50%, rgba(0, 0, 0, .2) 73.5%, rgba(0, 0, 0, .5) 75.25%, rgba(0, 0, 0, .15) 85.25%, transparent)',
            }}
          />
          <div className="pl-1 h-full">{children}</div>
        </div>

        {/* Lombada */}
        <div
          aria-hidden="true"
          className="absolute left-0 bg-[linear-gradient(90deg,#eaeaea_0%,#0000_80%),linear-gradient(#fff,#fafafa)] dark:bg-[linear-gradient(90deg,#3a3a3a_0%,#0000_80%),linear-gradient(#292524,#1c1917)]"
          style={{
            top: '3px',
            bottom: '3px',
            width: '48px',
            transform: `translateX(${sizeMap[size].spineTranslation}) rotateY(90deg)`,
          }}
        />

        {/* Contracapa (fundo) */}
        <div
          className={cn(
            'absolute inset-y-0 overflow-hidden size-full left-0 flex flex-col justify-end p-[12%]',
            className || defaultColorClasses
          )}
          style={{ transform: 'translateZ(-25px)', borderRadius: '6px 4px 4px 6px' }}
        />
      </div>
    </div>
  );
}

export function BookTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h4 className={`font-headline font-medium select-none mt-3 mb-1 text-balance leading-tight ${className}`}>{children}</h4>;
}

export function BookDescription({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`opacity-70 select-none text-xs leading-relaxed ${className}`}>{children}</p>;
}
