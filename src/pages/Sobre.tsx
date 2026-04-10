import { useRef } from 'react';
import { useDynamicShadow } from '../hooks/useDynamicShadow';
import { HulyTextHighlight } from '../components/HulyTextHighlight';
import { TypewriterText } from '../components/TypewriterText';
import { useTilt } from '../hooks/useTilt';
import { StaggerReveal, StaggerItem } from '../components/ui/StaggerReveal';
import marianaProfile from '../assets/mariana-profile.png';
import SEO from '../components/SEO';

export default function Sobre() {
  useDynamicShadow();

  const profileRef = useRef<HTMLDivElement>(null);
  const bento1Ref = useRef<HTMLDivElement>(null);
  const bento2Ref = useRef<HTMLDivElement>(null);
  const bento3Ref = useRef<HTMLDivElement>(null);
  const bento4Ref = useRef<HTMLDivElement>(null);

  useTilt(profileRef, 15);
  useTilt(bento1Ref, 15);
  useTilt(bento2Ref, 15);
  useTilt(bento3Ref, 15);
  useTilt(bento4Ref, 15);

  return (
    <main className="bg-background overflow-x-hidden">
      <SEO 
        title="Sobre Mariana Bermudes | Nutricionista"
        description="Conheça a trajetória de Mariana Bermudes, nutricionista especializada em nutrição de precisão, emagrecimento e performance."
      />
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        <StaggerReveal className="md:col-span-7">
          <StaggerItem>
            <span className="text-tertiary font-bold tracking-widest text-sm uppercase mb-4 block">A Mente por Trás da Jornada</span>
          </StaggerItem>
          <StaggerItem>
            <h1 className="text-4xl md:text-6xl text-primary font-bold mb-6 leading-tight font-headline">Mariana Bermudes</h1>
          </StaggerItem>
          <StaggerItem>
            <div className="text-lg md:text-xl text-on-surface-variant leading-relaxed mb-8 font-body">
              <TypewriterText text="Nutricionista apaixonada por reconectar pessoas com a essência da alimentação consciente, transformando traumas em caminhos de cura e equilíbrio." speed={30} delay={100} />
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="flex items-center gap-4 p-4 bg-surface-container rounded-xl border border-outline-variant/30 max-w-md">
              <span className="material-symbols-outlined text-primary text-3xl">school</span>
              <div>
                <p className="text-sm font-bold text-on-surface">Formação Acadêmica</p>
                <p className="text-on-surface-variant font-body">Graduada pelo Centro Universitário São Camilo</p>
              </div>
            </div>
          </StaggerItem>
        </StaggerReveal>
        
        <StaggerReveal className="md:col-span-5 relative perspective-1200" delay={0.4}>
          <StaggerItem>
            <div 
              ref={profileRef}
              className="aspect-[4/5] bg-surface-container-highest rounded-2xl parallax-shadow overflow-hidden transform-style-3d"
            >
              <img 
                className="w-full h-full object-cover scale-110 tilt-child tz-30" 
                alt="Mariana Bermudes" 
                src={marianaProfile}
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-tertiary-container rounded-xl flex items-center justify-center p-4 text-center shadow-lg z-20">
              <p className="text-on-tertiary-container font-headline italic text-sm font-bold">Cuidado 360º para sua saúde</p>
            </div>
          </StaggerItem>
        </StaggerReveal>
      </section>

      {/* Narrative Bento Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <StaggerReveal className="text-center mb-16">
          <StaggerItem>
            <h2 className="text-3xl font-bold text-on-surface font-headline"><HulyTextHighlight text="Minha Trajetória" /></h2>
          </StaggerItem>
        </StaggerReveal>

        <StaggerReveal className="grid grid-cols-1 md:grid-cols-3 gap-6" staggerInterval={0.2}>
          {/* Essência */}
          <StaggerItem>
            <div 
              ref={bento1Ref}
              className="bg-surface-container-low p-8 rounded-xl h-full flex flex-col justify-between hover:shadow-xl transition-all duration-300 transform-style-3d border border-outline/5"
            >
              <div className="tilt-child tz-20">
                <span className="material-symbols-outlined text-primary mb-4 text-4xl tilt-child tz-30">eco</span>
                <h3 className="text-2xl font-bold mb-4 font-headline tilt-child tz-25">Minha Essência</h3>
                <p className="text-on-surface-variant leading-relaxed font-body">Minha história começa com o cheiro de "comida de verdade" vindo da cozinha. Desde a infância, aprendi que nutrir-se é um ato de carinho e conexão com a natureza.</p>
              </div>
            </div>
          </StaggerItem>
          
          {/* Superação */}
          <StaggerItem className="md:col-span-2">
            <div 
              ref={bento2Ref}
              className="h-full bg-surface-container-highest p-8 rounded-xl flex flex-col md:flex-row gap-8 items-center border border-outline-variant/20 shadow-[0_4px_20px_rgba(46,50,48,0.06)] hover:shadow-xl transition-all duration-300 transform-style-3d"
            >
              <div className="flex-1 tilt-child tz-20">
                <h3 className="text-2xl font-bold mb-4 font-headline tilt-child tz-25">Da Dor ao Propósito</h3>
                <p className="text-on-surface-variant leading-relaxed font-body">Enfrentei e superei transtornos alimentares que me mostraram o lado sensível da nutrição. Essa vivência moldou minha empatia e o desejo profundo de ajudar outros a encontrarem a paz com o prato.</p>
              </div>
              <div className="w-full md:w-64 aspect-square rounded-[1.5rem] shrink-0 parallax-shadow overflow-hidden tilt-child tz-30">
                <img className="w-full h-full object-cover" alt="Transformação" src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80"/>
              </div>
            </div>
          </StaggerItem>
          
          {/* Metodologia */}
          <StaggerItem className="md:col-span-2">
            <div 
              ref={bento3Ref}
              className="h-full bg-surface-container-low p-8 rounded-xl border border-outline-variant/20 shadow-[0_4px_20px_rgba(46,50,48,0.06)] hover:shadow-xl transition-all duration-300 transform-style-3d"
            >
              <div className="flex flex-col md:flex-row gap-8 tilt-child tz-20 h-full">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-4 text-primary font-headline tilt-child tz-25">Abordagem Integrativa</h3>
                  <p className="text-on-surface-variant leading-relaxed font-body">A NutriJornada 360º nasceu da necessidade de olhar para o ser humano além das calorias. Unimos ciência, comportamento e rotina para criar resultados sustentáveis.</p>
                </div>
                <div className="grid grid-cols-2 gap-4 tilt-child tz-30 items-center">
                  <div className="p-4 bg-background rounded-lg text-center shadow-sm">
                    <span className="material-symbols-outlined text-tertiary">psychology</span>
                    <p className="text-xs font-bold mt-2">Mente</p>
                  </div>
                  <div className="p-4 bg-background rounded-lg text-center shadow-sm">
                    <span className="material-symbols-outlined text-primary">fitness_center</span>
                    <p className="text-xs font-bold mt-2">Corpo</p>
                  </div>
                </div>
              </div>
            </div>
          </StaggerItem>
          
          {/* Valores */}
          <StaggerItem>
            <div 
              ref={bento4Ref}
              className="h-full bg-primary text-on-primary p-8 rounded-xl flex flex-col justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform-style-3d"
            >
              <div className="tilt-child tz-20">
                <h3 className="text-2xl font-bold mb-4 font-headline tilt-child tz-25">Empatia & Ciência</h3>
                <p className="opacity-90 leading-relaxed font-body">Acredito em uma nutrição que acolhe sem julgar, fundamentada no rigor acadêmico da São Camilo.</p>
              </div>
            </div>
          </StaggerItem>
        </StaggerReveal>
      </section>

      {/* Values Section */}
      <section className="bg-surface-container py-20 mt-16">
        <div className="max-w-7xl mx-auto px-6">
          <StaggerReveal className="text-center max-w-3xl mx-auto mb-16">
            <StaggerItem>
              <h2 className="text-4xl font-bold mb-6 text-on-surface font-headline"><HulyTextHighlight text="Harmonia em 360 Graus" /></h2>
            </StaggerItem>
            <StaggerItem>
              <p className="text-lg text-on-surface-variant font-body leading-relaxed">Nossos pilares fundamentais para uma vida vibrante e equilibrada.</p>
            </StaggerItem>
          </StaggerReveal>

          <StaggerReveal className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <StaggerItem className="space-y-4">
              <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <span className="material-symbols-outlined text-on-primary-container text-3xl">self_improvement</span>
              </div>
              <h4 className="text-xl font-bold font-headline text-on-surface">Mente Consciente</h4>
              <p className="text-on-surface-variant font-body">Trabalhamos a relação emocional com a comida, desconstruindo mitos e restrições punitivas.</p>
            </StaggerItem>
            <StaggerItem className="space-y-4">
              <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <span className="material-symbols-outlined text-on-primary-container text-3xl">favorite</span>
              </div>
              <h4 className="text-xl font-bold font-headline text-on-surface">Corpo Saudável</h4>
              <p className="text-on-surface-variant font-body">Nutrição funcional focada na vitalidade orgânica e no respeito aos limites fisiológicos de cada um.</p>
            </StaggerItem>
            <StaggerItem className="space-y-4">
              <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <span className="material-symbols-outlined text-on-primary-container text-3xl">calendar_today</span>
              </div>
              <h4 className="text-xl font-bold font-headline text-on-surface">Rotina Leve</h4>
              <p className="text-on-surface-variant font-body">Adaptação real ao seu estilo de vida. O plano alimentar deve servir você, e não o contrário.</p>
            </StaggerItem>
          </StaggerReveal>
        </div>
      </section>
    </main>
  );
}
