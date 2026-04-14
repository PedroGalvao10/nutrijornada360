import { useState, useEffect } from 'react';
import { useSpring } from 'framer-motion';
import { StaggerReveal, StaggerItem } from './ui/StaggerReveal';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

function AnimatedCounter({ value, suffix = '', prefix = '', decimals = 0 }: AnimatedCounterProps) {
  const springValue = useSpring(0, { stiffness: 50, damping: 20 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  useEffect(() => {
    return springValue.onChange((v) => {
      setDisplayValue(v);
    });
  }, [springValue]);

  return (
    <span className="font-headline font-bold text-4xl md:text-5xl">
      {prefix}{displayValue.toFixed(decimals)}{suffix}
    </span>
  );
}

export function SimuladorResultados() {
  const [semanas, setSemanas] = useState(4);

  // Fórmulas fictícias mas estimulativas
  const energiaGanha = semanas * 15;
  const reducaoGordura = semanas * 0.8; 
  const disposicaoSono = semanas * 10 + 20;

  const clampedEnergia = Math.min(energiaGanha, 100);
  const clampedSono = Math.min(disposicaoSono, 100);

  return (
    <section className="py-20 bg-background dark:bg-stone-950 px-6 overflow-hidden transition-colors duration-500">
      <div className="max-w-5xl mx-auto">
        <StaggerReveal className="text-center mb-12">
          <StaggerItem>
            <span className="text-primary dark:text-emerald-400 font-label font-bold tracking-widest uppercase text-sm mb-4 block">
              Resultados Projetados
            </span>
          </StaggerItem>
          <StaggerItem>
            <h2 className="text-3xl md:text-5xl font-headline text-on-background dark:text-stone-100 font-semibold mb-6">
              Simule sua Evolução
            </h2>
          </StaggerItem>
          <StaggerItem>
            <p className="text-on-surface-variant dark:text-stone-400 max-w-2xl mx-auto leading-relaxed">
              Arraste o controle deslizante abaixo e descubra as transformações estimadas no seu corpo e bem-estar ao longo das semanas de acompanhamento.
            </p>
          </StaggerItem>
        </StaggerReveal>

        <div className="bg-white/50 dark:bg-stone-900/50 backdrop-blur-xl border border-primary/10 dark:border-emerald-500/10 rounded-[2rem] p-8 md:p-12 shadow-xl dark:shadow-2xl">
          
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-2">
              <span className="font-medium text-lg text-on-background dark:text-stone-200">
                Tempo de Acompanhamento
              </span>
              <span className="text-primary dark:text-emerald-400 font-bold text-2xl font-headline">
                {semanas} {semanas === 1 ? 'semana' : 'semanas'}
              </span>
            </div>
            
            <div className="relative w-full">
              <input 
                type="range" 
                min="1" 
                max="12" 
                value={semanas} 
                onChange={(e) => setSemanas(Number(e.target.value))}
                className="w-full h-3 bg-surface-variant dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-primary dark:accent-emerald-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            
            <div className="flex justify-between text-xs font-semibold text-on-surface-variant/60 dark:text-stone-500 mt-3 px-1">
              <span>1 semana</span>
              <span>12 semanas</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-primary/5 dark:bg-emerald-500/5 border border-primary/10 dark:border-emerald-500/10">
              <div className="text-primary dark:text-emerald-400 mb-2">
                <AnimatedCounter value={clampedEnergia} suffix="%" />
              </div>
              <p className="font-semibold text-on-background dark:text-stone-200 uppercase tracking-wide text-sm font-label">Aumento de Energia</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-tertiary/5 dark:bg-amber-500/5 border border-tertiary/10 dark:border-amber-500/10">
              <div className="text-tertiary dark:text-amber-500 mb-2">
                <AnimatedCounter value={reducaoGordura} decimals={1} prefix="-" suffix="kg" />
              </div>
              <p className="font-semibold text-on-background dark:text-stone-200 uppercase tracking-wide text-sm font-label">Redução de Gordura (Est.)</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-secondary/5 dark:bg-stone-500/5 border border-secondary/10 dark:border-stone-500/10">
              <div className="text-secondary dark:text-stone-300 mb-2">
                <AnimatedCounter value={clampedSono} suffix="%" />
              </div>
              <p className="font-semibold text-on-background dark:text-stone-200 uppercase tracking-wide text-sm font-label">Qualidade do Sono</p>
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-on-surface-variant/60 dark:text-stone-500">
            * Estes valores são projeções estimadas baseadas na adesão média aos planos e variam de pessoa para pessoa.
          </div>
        </div>
      </div>
    </section>
  );
}
