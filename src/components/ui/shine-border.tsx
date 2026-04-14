import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

type ShineBorderProps = {
  children: ReactNode;
  className?: string;
  borderWidth?: number;
  duration?: number;
  gradient?: string;
};

export const ShineBorder = ({
  children,
  className,
  borderWidth = 2,
  duration = 3,
  gradient = "from-emerald-400 via-primary to-emerald-950",
}: ShineBorderProps) => {
  return (
    <div
      className={cn("relative rounded-3xl", className)}
      style={{ padding: borderWidth }}
    >
      {/* Camada do gradiente animado */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden">
        <div
          className={cn(
            "absolute -inset-full blur-lg animate-spin bg-[image:conic-gradient(var(--tw-gradient-stops))]",
            gradient
          )}
          style={{ animationDuration: `${duration}s` }}
        />
      </div>

      {/* Conteúdo original do card — não alterar */}
      <div className="relative rounded-3xl h-full w-full">
        {children}
      </div>
    </div>
  );
};
