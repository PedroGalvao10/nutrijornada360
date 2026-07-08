import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes } from 'react';

// ============================================================
// bfui — kit visual interno do BookingFlow (Editorial Orgânico).
// Três peças usadas por todos os steps para garantir consistência
// com o resto do site (Lora, pills, ouro/verde) sem duplicar
// classes em 9 arquivos. APENAS estilo — nenhuma lógica aqui.
// ============================================================

export function StepHeader({ title, subtitle }: { title: ReactNode; subtitle?: ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="font-headline font-medium text-2xl md:text-[1.7rem] leading-snug text-on-background dark:text-stone-100 mb-2">
        {title}
      </h2>
      {subtitle && (
        <p className="text-on-surface-variant dark:text-stone-400 text-sm font-light leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

type BfButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost';
};

// Botão do fluxo — pill como no resto do site (o booking usava rounded-xl,
// destoando de todos os CTAs das páginas)
export function BfButton({ variant = 'primary', className = '', children, ...props }: BfButtonProps) {
  const base =
    'no-glass w-full py-4 rounded-full font-semibold text-[0.95rem] transition-all duration-300 active:scale-[0.99] flex items-center justify-center gap-2 disabled:cursor-not-allowed';
  const variants = {
    primary:
      'bg-verde-profundo dark:bg-emerald-600 text-background dark:text-white shadow-float-1 hover:shadow-float-2 hover:-translate-y-0.5 active:translate-y-0 disabled:bg-surface-variant disabled:text-on-surface-variant/50 disabled:shadow-none disabled:hover:translate-y-0 dark:disabled:bg-stone-800 dark:disabled:text-stone-600',
    ghost:
      'border border-surface-variant dark:border-stone-700 text-on-background dark:text-stone-200 hover:border-ouro-suave',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

// Campo de formulário — label etiqueta ouro + input arredondado da marca.
// Erros em tom de erro do design system (não vermelho genérico).
export function BfField({
  label,
  error,
  ...inputProps
}: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <div>
      <label className="block text-[0.62rem] font-extrabold text-tertiary dark:text-ouro-suave mb-1.5 ml-1 uppercase tracking-[0.16em]">
        {label}
      </label>
      <input
        {...inputProps}
        className={`w-full p-3.5 rounded-[14px] border bg-white dark:bg-stone-800 dark:text-white text-sm transition-all outline-none focus:ring-2 focus:ring-ouro-suave/40 ${
          error
            ? 'border-error bg-error/5'
            : 'border-surface-variant dark:border-stone-700 focus:border-ouro-suave'
        }`}
      />
      {error && <p className="text-error text-[10px] mt-1 ml-1 font-semibold">{error}</p>}
    </div>
  );
}

// Botão discreto de voltar (seta) usado nos headers dos steps
export function BfBack({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Voltar"
      className="no-glass p-1.5 hover:bg-creme-2 dark:hover:bg-stone-800 rounded-full transition-colors text-on-surface-variant hover:text-verde-profundo dark:hover:text-white"
    >
      <span className="material-symbols-outlined text-lg">arrow_back</span>
    </button>
  );
}

// Cartão de opção selecionável (planos, escolhas) — assinatura da marca:
// selecionado ganha filete ouro e névoa verde, não borda azul genérica
export function BfOptionCard({
  selected,
  onClick,
  children,
  className = '',
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`no-glass flex flex-col items-start p-4 rounded-[18px] border text-left transition-all duration-300 ${
        selected
          ? 'border-ouro-suave bg-verde-nevoa/50 dark:border-ouro-suave dark:bg-emerald-900/20 shadow-float-1'
          : 'border-surface-variant dark:border-stone-700/50 hover:border-ouro-suave/60 bg-white/60 dark:bg-stone-800/40'
      } ${className}`}
    >
      {children}
    </button>
  );
}
