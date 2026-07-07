import { StaggerReveal, StaggerItem } from '../ui/StaggerReveal';
import { LiquidText, TextEffect } from '../ui/text-animations';

export function MissionSection() {
  return (
    <section className="py-20 md:py-32 bg-background dark:bg-stone-950 relative overflow-hidden transition-colors duration-500">
      <div className="w-full max-w-[1280px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Cabeçalho Orgânico e Assimétrico */}
        <StaggerReveal className="max-w-3xl mb-16 md:mb-24">
          <StaggerItem>
            <span className="text-secondary font-label font-bold tracking-widest uppercase text-sm mb-6 block">
              No que eu acredito
            </span>
          </StaggerItem>
          <StaggerItem>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-headline text-on-background dark:text-stone-100 mb-8 leading-[1.1] font-semibold text-balance">
              <LiquidText text="Sua relação com a comida importa tanto quanto o que você come." />
            </h2>
          </StaggerItem>
          <StaggerItem>
            <div className="text-lg md:text-xl text-on-surface-variant dark:text-stone-400 leading-relaxed font-body max-w-2xl">
              <TextEffect text="Eu não acredito em restrições cegas. O corpo humano é um sistema conectado: metabolismo, rotina e mente precisam caminhar juntos para criar uma mudança que realmente se sustente." preset="blur" delay={0.2} />
            </div>
          </StaggerItem>
        </StaggerReveal>

        {/* Bento Grid Orgânico e Assimétrico */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Card 1: Largo */}
          <StaggerReveal className="md:col-span-8 flex flex-col">
            <StaggerItem className="h-full">
              <div className="h-full bg-white dark:bg-stone-900 rounded-[2rem] p-8 md:p-12 shadow-float-1 hover:shadow-float-2 transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between group">
                <div className="w-14 h-14 bg-verde-nevoa dark:bg-emerald-950/40 rounded-2xl flex items-center justify-center mb-12 text-primary transition-transform duration-500 group-hover:scale-110">
                   <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66"/><path d="m18 15-2-2"/><path d="m15 18-2-2"/></svg>
                </div>
                <div>
                  <h3 className="font-headline text-2xl font-medium text-on-surface dark:text-stone-100 mb-4 group-hover:text-primary transition-colors">Saúde Integral</h3>
                  <p className="text-on-surface-variant dark:text-stone-400 text-lg leading-relaxed max-w-md">
                    Olho para os seus exames, sim. Mas também para o seu sono, sua rotina de trabalho e como você se sente após comer.
                  </p>
                </div>
              </div>
            </StaggerItem>
          </StaggerReveal>

          {/* Card 2: Alto e estreito */}
          <StaggerReveal className="md:col-span-4 flex flex-col" delay={0.2}>
            <StaggerItem className="h-full">
              <div className="h-full bg-creme-2 dark:bg-stone-800/50 rounded-[2rem] p-8 md:p-12 shadow-sm transition-all duration-500 hover:-translate-y-1 flex flex-col group">
                <div className="w-14 h-14 bg-white/60 dark:bg-stone-800 rounded-2xl flex items-center justify-center mb-12 text-secondary transition-transform duration-500 group-hover:scale-110">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
                </div>
                <h3 className="font-headline text-2xl font-medium text-on-surface dark:text-stone-100 mb-4 group-hover:text-secondary transition-colors">Comida de Verdade</h3>
                <p className="text-on-surface-variant dark:text-stone-400 text-lg leading-relaxed flex-grow">
                  A base de tudo é o alimento no seu estado mais natural. Sem terrorismo alimentar, com inteligência.
                </p>
              </div>
            </StaggerItem>
          </StaggerReveal>

          {/* Card 3: Assinatura */}
          <StaggerReveal className="md:col-span-12 mt-16 md:mt-24">
            <StaggerItem>
               <div className="flex flex-col items-center text-center">
                  <p className="text-xl md:text-3xl font-light text-on-surface dark:text-stone-100 leading-relaxed max-w-4xl mb-10 font-headline italic">
                     "Nutrição de verdade não é sobre o que você corta do prato. É sobre o que você adiciona à sua vida."
                  </p>
                  <span className="font-handwriting text-5xl md:text-[5rem] text-primary dark:text-emerald-500 -rotate-3 opacity-90">
                    Com carinho, Mariana
                  </span>
               </div>
            </StaggerItem>
          </StaggerReveal>

        </div>
      </div>
    </section>
  );
}
