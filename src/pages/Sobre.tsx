/* cspell:disable-file */
import { useRef } from 'react';
import { useDynamicShadow } from '../hooks/useDynamicShadow';
import { HulyTextHighlight } from '../components/HulyTextHighlight';
import { PointerHighlight } from '../components/ui/PointerHighlight';
import { TextRevealByWord } from '../components/ui/TextRevealByWord';
import { useTilt } from '../hooks/useTilt';
import { Highlight } from '../components/ui/Highlight';
import { CardStack } from '../components/ui/CardStack';
import { StaggerReveal, StaggerItem } from '../components/ui/StaggerReveal';
import marianaProfile from '../assets/mariana-profile.png';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';
import aprovadaCuscs from '../assets/aprovada-cuscs.jpg';

/* Componente de Frutas/Comidas Flutuantes */
const FLOATING_FOODS = [
  { emoji: '🥑', top: '15%', left: '-12%', delay: 0 },
  { emoji: '🍓', top: '65%', left: '-8%', delay: 1 },
  { emoji: '🥦', top: '35%', right: '-8%', delay: 2 },
  { emoji: '🥕', top: '85%', right: '-4%', delay: 0.5 },
  { emoji: '🥗', top: '-15%', left: '20%', delay: 1.5 },
  { emoji: '🍉', bottom: '-8%', right: '25%', delay: 2.5 },
];

const FloatingFoodElements = () => {
  return (
    <>
      {FLOATING_FOODS.map((food, idx) => (
        <motion.div
          key={idx}
          className="absolute text-4xl select-none z-30 drop-shadow-md pointer-events-none"
          initial={{ y: 0 }}
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: food.delay }}
          style={{ 
            top: food.top, 
            left: food.left, 
            right: food.right, 
            bottom: food.bottom
          }}
        >
          {food.emoji}
        </motion.div>
      ))}
    </>
  );
};
/* ── Pilares da NutriJornada360º para o CardStack ── */
const CORE_PAGES_INFO = [
  {
    id: 0,
    name: 'Nossa Missão',
    designation: 'Nutrir com Propósito',
    content: (
      <p>
        Promover a <Highlight>saúde integral</Highlight> através de uma nutrição <Highlight>consciente e humanizada</Highlight>, conectando ciência e bem-estar emocional.
      </p>
    ),
  },
  {
    id: 1,
    name: 'Nossos Valores',
    designation: 'Ética e Cuidado',
    content: (
      <p>
        Pautados na <Highlight>Empatia</Highlight>, Rigor Científico, Transparência e o <Highlight>Respeito absoluto</Highlight> à individualidade de cada ser humano.
      </p>
    ),
  },
  {
    id: 2,
    name: 'Nosso Propósito',
    designation: 'Transformação Real',
    content: (
      <p>
        Transformar a relação das pessoas com a comida, devolvendo a <Highlight>liberdade de escolha</Highlight> e a vitalidade para viver intensamente.
      </p>
    ),
  },
];

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
            <h1 className="text-4xl md:text-6xl text-primary font-bold mb-6 leading-tight font-headline">
              <PointerHighlight>Mariana Bermudes</PointerHighlight>
            </h1>
          </StaggerItem>
          <StaggerItem className="text-lg md:text-xl text-on-surface-variant leading-relaxed mb-8 font-body">
            <TextRevealByWord text="Nutricionista apaixonada por reconectar pessoas com a essência da alimentação consciente, transformando traumas em caminhos de cura e equilíbrio." />
          </StaggerItem>
          <StaggerItem>
            <div className="flex flex-col gap-4 max-w-xl">
              <div className="flex items-start gap-4 p-4 bg-surface-container rounded-xl border border-outline-variant/30">
                <span className="material-symbols-outlined text-primary text-3xl shrink-0">school</span>
                <div>
                  <p className="text-sm font-bold text-on-surface mb-1">Formação Acadêmica</p>
                  <p className="text-on-surface-variant text-sm font-body leading-relaxed">Graduada pelo Centro Universitário São Camilo</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-surface-container rounded-xl border border-outline-variant/30">
                <span className="material-symbols-outlined text-primary text-3xl shrink-0">local_library</span>
                <div>
                  <p className="text-sm font-bold text-on-surface mb-1">Experiência Acadêmica</p>
                  <p className="text-on-surface-variant text-sm font-body leading-relaxed">
                    Durante a graduação, fui Diretora de Pesquisa da Liga de Unidades de Alimentação e Nutrição e monitora da disciplina de Marketing Nutricional, com foco em rotulagem de alimentos e educação nutricional.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-surface-container rounded-xl border border-outline-variant/30">
                <span className="material-symbols-outlined text-primary text-3xl shrink-0">work</span>
                <div>
                  <p className="text-sm font-bold text-on-surface mb-1">Experiências Profissionais</p>
                  <p className="text-on-surface-variant text-sm font-body leading-relaxed">
                    Tenho experiência em Unidades de Alimentação e Nutrição no Rosewood Hotel Group, Nutrição Clínica no Hospital São Camilo e Saúde Coletiva na Associação Nossa Turma. Também atuei com marketing e atendimento em consultório na Clínica Escola Promove, com foco em orientação nutricional e medidas antropométricas.
                  </p>
                </div>
              </div>
            </div>
          </StaggerItem>
        </StaggerReveal>
        
        <StaggerReveal className="md:col-span-5 relative perspective-1200" delay={0.4}>
          <StaggerItem>
            <div className="relative">
              <FloatingFoodElements />
              <div 
                ref={profileRef}
                className="aspect-[4/5] bg-surface-container-highest rounded-2xl parallax-shadow overflow-hidden transform-style-3d relative z-10"
              >
                <img 
                  className="w-full h-full object-cover scale-110 tilt-child tz-30" 
                  alt="Mariana Bermudes" 
                  src={marianaProfile}
                />
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-tertiary-container rounded-xl flex items-center justify-center p-4 text-center shadow-lg z-20">
              <p className="text-on-tertiary-container font-headline italic text-sm font-bold">Cuidado 360º para sua saúde</p>
            </div>
          </StaggerItem>
        </StaggerReveal>
      </section>

      {/* ═══ Narrative Bento Grid — Estilo Ruixen UI ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <StaggerReveal className="text-center mb-12 md:mb-16">
          <StaggerItem>
            <h2 className="text-3xl font-bold text-on-surface font-headline"><HulyTextHighlight text="Minha Trajetória" /></h2>
          </StaggerItem>
        </StaggerReveal>

        {/* Grid 2-col com bordas sutis */}
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Bloco Esquerdo — CardStack + Essência */}
          <StaggerReveal className="flex flex-col items-start justify-center border border-outline-variant/30 p-4 sm:p-6 lg:p-8">
            <StaggerItem className="relative w-full mb-4 sm:mb-6">
              <div className="absolute inset-x-0 -bottom-2 h-16 sm:h-20 lg:h-24 bg-gradient-to-t from-background to-transparent z-10"></div>
              <CardStack items={CORE_PAGES_INFO} />
            </StaggerItem>

            <StaggerItem>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-primary font-headline">
                  <PointerHighlight>Mariana Bermudes</PointerHighlight>
                </h3>
                <h4 className="text-lg sm:text-xl lg:text-2xl font-normal text-on-surface font-headline">
                  Minha Essência
                </h4>
                <p className="text-on-surface-variant text-sm sm:text-base lg:text-lg font-body mt-2">
                  Minha história começa com o cheiro de &ldquo;comida de verdade&rdquo; vindo da cozinha. Desde a infância, aprendi que nutrir-se é um ato de carinho e conexão com a natureza.
                </p>
              </div>
            </StaggerItem>
          </StaggerReveal>

          {/* Bloco Direito — Da Dor ao Propósito */}
          <StaggerReveal className="flex flex-col items-start justify-center border border-outline-variant/30 p-4 sm:p-6 lg:p-8" delay={0.2}>
            <StaggerItem>
              <div className="flex flex-col gap-2 mb-4 sm:mb-6">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-primary font-headline">
                  <PointerHighlight>Superação</PointerHighlight>
                </h3>
                <h4 className="text-lg sm:text-xl lg:text-2xl font-normal text-on-surface font-headline">
                  Da Dor ao Propósito
                </h4>
                <p className="text-on-surface-variant text-sm sm:text-base lg:text-lg font-body mt-2">
                  Enfrentei e superei transtornos alimentares que me mostraram o lado sensível da nutrição. Essa vivência moldou minha empatia e o desejo profundo de ajudar outros a encontrarem a paz com o prato.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem className="w-full mt-auto">
              <div 
                ref={bento2Ref}
                className="w-full aspect-[3/4] sm:aspect-[4/5] md:aspect-auto md:h-96 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-outline-variant/20 transform-style-3d bg-surface-container"
              >
                <img 
                  className="w-full h-full object-cover object-top tilt-child tz-20" 
                  alt="Transformação" 
                  src={aprovadaCuscs}
                />
              </div>
            </StaggerItem>
          </StaggerReveal>
        </div>

        {/* Stats + Depoimento (padrão Ruixen) */}
        <div className="mt-12 sm:mt-16 lg:mt-20 grid gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* Stats grid 2 colunas */}
          <StaggerReveal className="flex justify-center items-center p-4 sm:p-6">
            <StaggerItem className="grid grid-cols-2 gap-6 sm:gap-8 w-full text-center sm:text-left">
              <div className="space-y-2 sm:space-y-3">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-medium text-on-surface font-headline">360º</div>
                <p className="text-sm sm:text-base text-on-surface-variant">Visão Integrativa</p>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-medium text-on-surface font-headline">100%</div>
                <p className="text-sm sm:text-base text-on-surface-variant">Bem-estar</p>
              </div>
            </StaggerItem>
          </StaggerReveal>

          {/* Depoimento / Quote */}
          <StaggerReveal className="relative" delay={0.3}>
            <StaggerItem>
              <blockquote className="border-l-2 border-outline-variant/40 pl-4 sm:pl-6 lg:pl-8 text-on-surface-variant">
                <p className="text-sm sm:text-base lg:text-lg leading-relaxed font-body italic">
                  &ldquo;Acredito em uma nutrição que acolhe sem julgar, fundamentada no rigor técnico e profissional. Cada pessoa é única e o plano alimentar deve respeitar sua história, suas emoções e seus objetivos.&rdquo;
                </p>
                <div className="mt-4 sm:mt-6 space-y-1">
                  <cite className="block font-medium text-sm sm:text-base text-on-surface not-italic font-headline">Mariana Bermudes</cite>
                  <p className="text-xs text-on-surface-variant">Nutricionista • CRN-3</p>
                </div>
              </blockquote>
            </StaggerItem>
          </StaggerReveal>
        </div>

        {/* Grid inferior — Abordagem + Valores */}
        <StaggerReveal className="grid grid-cols-1 lg:grid-cols-2 mt-8 lg:mt-12" staggerInterval={0.2}>
          {/* Abordagem Integrativa */}
          <StaggerItem>
            <div 
              ref={bento3Ref}
              className="h-full border border-outline-variant/30 p-4 sm:p-6 lg:p-8 transform-style-3d"
            >
              <h3 className="text-lg sm:text-xl lg:text-2xl font-normal text-on-surface leading-relaxed font-headline mb-4">
                <span className="text-primary font-semibold">Abordagem Integrativa</span>
              </h3>
              <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed font-body mb-6">
                A NutriJornada 360° nasceu da necessidade de olhar para o ser humano além das calorias. Unimos ciência, comportamento e rotina para criar resultados sustentáveis.
              </p>
              <div className="grid grid-cols-2 gap-4 tilt-child tz-20 items-center">
                <div className="p-4 bg-surface-container-low rounded-xl text-center border border-outline-variant/20">
                  <span className="material-symbols-outlined text-primary text-2xl">psychology</span>
                  <p className="text-xs font-bold mt-2 text-on-surface">Mente</p>
                </div>
                <div className="p-4 bg-surface-container-low rounded-xl text-center border border-outline-variant/20">
                  <span className="material-symbols-outlined text-tertiary text-2xl">fitness_center</span>
                  <p className="text-xs font-bold mt-2 text-on-surface">Corpo</p>
                </div>
              </div>
            </div>
          </StaggerItem>
          
          {/* Empatia & Ciência */}
          <StaggerItem>
            <div 
              ref={bento4Ref}
              className="h-full bg-primary text-on-primary p-4 sm:p-6 lg:p-8 flex flex-col justify-center transform-style-3d"
            >
              <div className="tilt-child tz-20">
                <h3 className="text-xl sm:text-2xl font-bold mb-4 font-headline tilt-child tz-25">Empatia & Ciência</h3>
                <p className="opacity-90 leading-relaxed font-body text-sm sm:text-base">Acredito em uma nutrição que acolhe sem julgar, fundamentada no rigor técnico e profissional.</p>
              </div>
            </div>
          </StaggerItem>
        </StaggerReveal>
      </section>

      {/* Values Section */}
      <section className="bg-surface-variant py-20 mt-16">
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
