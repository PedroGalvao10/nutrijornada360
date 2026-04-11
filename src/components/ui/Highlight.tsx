/* cspell:disable-file */

/**
 * Highlight — Componente de destaque inline de texto.
 * Aplica um fundo suave na cor primária do site para destacar trechos importantes.
 * Inspirado no padrão Ruixen UI, adaptado para a identidade visual da Mariana.
 */
export function Highlight({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`font-bold bg-primary/10 text-primary px-1 py-0.5 rounded-sm ${className}`}
    >
      {children}
    </span>
  );
}
