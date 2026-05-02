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
import aprovadaCuscs from '../assets/aprovada-cuscs.jpg';
import amendoasHero from '../assets/amendoas_hero.png';
import { GlowWrapper } from '../components/ui/GlowWrapper';
import { FloatingAsset } from '../components/ui/FloatingAsset';

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
  const bento2Ref = useRef<HTMLDivElement>(null);

  useTilt(profileRef, 15);
  useTilt(bento2Ref, 15);

  return (
    <main className="bg-background dark:bg-stone-950 overflow-x-hidden transition-colors duration-500 pt-40">
      <SEO 
        title="Sobre Mariana Bermudes | Nutricionista"
        description="Conheça a trajetória de Mariana Bermudes, nutricionista especializada em nutrição de precisão, emagrecimento e performance."
      />
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 md:grid-cols-12 gap-12 items-center relative overflow-visible">
        {/* Blueberries HIPER-MONUMENTAIS (6 imagens) - Posicionadas para evitar cobertura pelo texto */}
        <FloatingAsset 
          src="/fruits/Blueberry 1.webp" 
          className="top-[3%] left-[12%] w-[500px] md:w-[850px] drop-shadow-xl z-[60] opacity-70" 
          depth={0.05} 
          delay={0}
          floatIntensity={3}
        />
        <FloatingAsset 
          src="/fruits/Blueberry 2.webp" 
          className="top-[22%] left-[18%] w-[550px] md:w-[900px] drop-shadow-xl z-0 opacity-80" 
          depth={0.08} 
          delay={0.1}
          floatIntensity={4}
        />
        <FloatingAsset 
          src="/fruits/Blueberry 3.webp" 
          className="top-[48%] left-[18%] w-[600px] md:w-[950px] drop-shadow-2xl z-[60] opacity-70" 
          depth={0.12} 
          delay={0.3}
          floatIntensity={6}
        />
        <FloatingAsset 
          src="/fruits/Blueberry 4.webp" 
          className="top-[50%] left-[4%] w-[650px] md:w-[1000px] drop-shadow-2xl z-[60] opacity-70" 
          depth={0.15} 
          delay={0.5}
          floatIntensity={8}
        />
        <FloatingAsset 
          src="/fruits/Blueberry 5.webp" 
          className="top-[70%] left-[1%] w-[700px] md:w-[1050px] drop-shadow-2xl z-[60] opacity-70" 
          depth={0.1} 
          delay={0.7}
          floatIntensity={5}
        />
        <FloatingAsset 
          src="/fruits/Blueberry 6.webp" 
          className="top-[85%] left-[6%] w-[750px] md:w-[1100px] drop-shadow-2xl z-[60] opacity-70" 
          depth={0.18} 
          delay={0.2}
          floatIntensity={10}
        />

        {/* Amêndoas/Sementes TOTALMENTE ESTÁTICAS */}
        <img 
          src={amendoasHero} 
          alt="Sementes decorativas"
          className="absolute -right-[28%] top-[30%] w-[450px] md:w-[650px] drop-shadow-2xl z-[60] opacity-90" 
        />
        <div className="md:col-span-7 relative z-10">
          <StaggerReveal>
          <StaggerItem>
            <span className="text-tertiary dark:text-amber-400 font-bold tracking-widest text-sm uppercase mb-4 block relative z-[70]">A Mente por Trás da Jornada</span>
          </StaggerItem>
          <StaggerItem>
            <h1 className="text-4xl md:text-6xl text-primary dark:text-emerald-400 font-bold mb-6 leading-tight font-headline">
              <PointerHighlight>Mariana Bermudes</PointerHighlight>
            </h1>
          </StaggerItem>
          <StaggerItem className="text-lg md:text-xl text-on-surface-variant dark:text-stone-400 leading-relaxed mb-8 font-body">
            <TextRevealByWord text="Nutricionista apaixonada por reconectar pessoas com a essência da alimentação consciente, transformando traumas em caminhos de cura e equilíbrio." />
          </StaggerItem>
          <StaggerItem>
            <div className="flex flex-col gap-4 max-w-xl">
              <GlowWrapper className="no-glass flex items-start gap-4 p-4 bg-surface-container dark:bg-stone-900/50 rounded-xl border-none">
                <span className="material-symbols-outlined text-primary text-3xl shrink-0">school</span>
                <div>
                  <p className="text-sm font-bold text-on-surface dark:text-stone-200 mb-1">Formação Acadêmica</p>
                  <p className="text-on-surface-variant dark:text-stone-400 text-sm font-body leading-relaxed">Graduada pelo Centro Universitário São Camilo</p>
                </div>
              </GlowWrapper>
              
              <GlowWrapper className="no-glass flex items-start gap-4 p-4 bg-surface-container dark:bg-stone-900/50 rounded-xl border-none">
                <span className="material-symbols-outlined text-primary text-3xl shrink-0">local_library</span>
                <div>
                  <p className="text-sm font-bold text-on-surface dark:text-stone-200 mb-1">Experiência Acadêmica</p>
                  <p className="text-on-surface-variant dark:text-stone-400 text-sm font-body leading-relaxed">
                    Durante a graduação, fui Diretora de Pesquisa da Liga de Unidades de Alimentação e Nutrição e monitora da disciplina de Marketing Nutricional, com foco em rotulagem de alimentos e educação nutricional.
                  </p>
                </div>
              </GlowWrapper>
 
              <GlowWrapper className="no-glass flex items-start gap-4 p-4 bg-white/5 dark:bg-stone-900/50 rounded-xl border-none">
                <span className="material-symbols-outlined text-primary text-3xl shrink-0">work</span>
                <div>
                  <p className="text-sm font-bold text-on-surface dark:text-stone-200 mb-1">Experiências Profissionais</p>
                  <p className="text-on-surface-variant dark:text-stone-400 text-sm font-body leading-relaxed">
                    Tenho experiência em Unidades de Alimentação e Nutrição no Rosewood Hotel Group, Nutrição Clínica no Hospital São Camilo e Saúde Coletiva na Associação Nossa Turma. Também atuei com marketing e atendimento em consultório na Clínica Escola Promove, com foco em orientação nutricional e medidas antropométricas.
                  </p>
                </div>
              </GlowWrapper>
            </div>
          </StaggerItem>
          </StaggerReveal>
        </div>
        
        <StaggerReveal className="md:col-span-5 relative perspective-1200 z-20" delay={0.4}>
          <StaggerItem>
            <div className="relative">
              <div 
                ref={profileRef}
                className="aspect-[4/5] bg-surface-container-highest rounded-2xl parallax-shadow overflow-hidden transform-style-3d relative z-30"
              >
                <img 
                  className="w-full h-full object-cover scale-110 tilt-child tz-30" 
                  alt="Mariana Bermudes" 
                  src={marianaProfile}
                />
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-tertiary-container rounded-xl flex items-center justify-center p-4 text-center shadow-lg z-40">
              <p className="text-on-tertiary-container font-headline italic text-sm font-bold">Cuidado 360º para sua saúde</p>
            </div>
          </div>
        </StaggerItem>
      </StaggerReveal>
      </section>

      {/* ═══ Narrative Bento Grid — Estilo Ruixen UI ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl font-bold text-on-surface dark:text-stone-100 font-headline"><HulyTextHighlight text="Minha Trajetória" /></h2>
        </div>

        {/* Grid 2-col com bordas sutis */}
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Bloco Esquerdo — CardStack + Essência */}
          <div className="antigravity-glass bg-white/5 dark:bg-black/10 flex flex-col items-start justify-center border border-white/20 dark:border-stone-800/40 p-4 sm:p-5 lg:p-6">
            <div className="relative w-full mb-4 sm:mb-6">
              <div className="absolute inset-x-0 -bottom-2 h-16 sm:h-20 lg:h-24 bg-gradient-to-t from-background to-transparent z-10"></div>
              <CardStack items={CORE_PAGES_INFO} />
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-primary dark:text-emerald-400 font-headline">
                <PointerHighlight>Mariana Bermudes</PointerHighlight>
              </h3>
              <h4 className="text-lg sm:text-xl lg:text-2xl font-normal text-on-surface dark:text-stone-200 font-headline">
                Minha Essência
              </h4>
              <p className="text-on-surface-variant dark:text-stone-400 text-sm sm:text-base lg:text-lg font-body mt-2">
                Minha história começa com o cheiro de “comida de verdade” vindo da cozinha. Desde a infância, aprendi que nutrir-se é um ato de carinho e conexão com a natureza.
              </p>
            </div>
          </div>

          {/* Bloco Direito — Da Dor ao Propósito */}
          <div className="antigravity-glass bg-white/5 dark:bg-black/10 flex flex-col items-start justify-center border border-white/20 dark:border-stone-800/40 p-4 sm:p-5 lg:p-6">
            <div className="flex flex-col gap-2 mb-4 sm:mb-6">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-primary dark:text-emerald-400 font-headline">
                <PointerHighlight>Superação</PointerHighlight>
              </h3>
              <h4 className="text-lg sm:text-xl lg:text-2xl font-normal text-on-surface dark:text-stone-200 font-headline">
                Da Dor ao Propósito
              </h4>
              <p className="text-on-surface-variant dark:text-stone-400 text-sm sm:text-base lg:text-lg font-body mt-2">
                Enfrentei e superei transtornos alimentares que me mostraram o lado sensível da nutrição. Essa vivência moldou minha empatia e o desejo profundo de ajudar outros a encontrarem a paz com o prato.
              </p>
            </div>

            <div className="w-full relative">
              <GlowWrapper 
                ref={bento2Ref}
                className="no-glass w-full aspect-[3/4] sm:aspect-[4/5] md:aspect-auto md:h-96 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-none transform-style-3d bg-white/5"
              >
                <img 
                  className="w-full h-full object-cover object-top tilt-child tz-20" 
                  alt="Transformação" 
                  src={aprovadaCuscs}
                />
              </GlowWrapper>
            </div>
          </div>
        </div>

        {/* Stats + Depoimento (padrão Ruixen) */}
        <div className="mt-12 sm:mt-16 lg:mt-20 grid gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* Stats grid 2 colunas */}
          <div className="flex justify-center items-center p-4 sm:p-6">
            <div className="grid grid-cols-2 gap-6 sm:gap-8 w-full text-center sm:text-left">
              <div className="space-y-2 sm:space-y-3">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-medium text-on-surface dark:text-stone-100 font-headline">360º</div>
                <p className="text-sm sm:text-base text-on-surface-variant dark:text-stone-400">Visão Integrativa</p>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-medium text-on-surface dark:text-stone-100 font-headline">100%</div>
                <p className="text-sm sm:text-base text-on-surface-variant dark:text-stone-400">Bem-estar</p>
              </div>
            </div>
          </div>

          {/* Depoimento / Quote */}
          <div className="relative">
            <blockquote className="border-l-2 border-outline-variant/40 dark:border-emerald-500/30 pl-4 sm:pl-6 lg:pl-8 text-on-surface-variant dark:text-stone-400">
              <p className="text-sm sm:text-base lg:text-lg leading-relaxed font-body italic">
                &ldquo;Acredito em uma nutrição que acolhe sem julgar, fundamentada no rigor técnico e profissional. Cada pessoa é única e o plano alimentar deve respeitar sua história, suas emoções e seus objetivos.&rdquo;
              </p>
              <div className="mt-4 sm:mt-6 space-y-1">
                <cite className="block font-medium text-sm sm:text-base text-on-surface dark:text-stone-200 not-italic font-headline">Mariana Bermudes</cite>
                <p className="text-xs text-on-surface-variant dark:text-stone-500">Nutricionista • CRN-3</p>
              </div>
            </blockquote>
          </div>
        </div>

        {/* Grid inferior — Abordagem + Valores */}
        <div className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-1 md:grid-cols-2">
          {/* Abordagem */}
          <div className="antigravity-glass bg-white/5 dark:bg-black/10 border border-white/20 dark:border-stone-800/40 p-6 sm:p-8">
            <h4 className="text-xl font-semibold text-primary dark:text-emerald-400 mb-4 font-headline">Abordagem Humanizada</h4>
            <p className="text-sm sm:text-base text-on-surface-variant dark:text-stone-400 font-body">
              Integro a ciência da nutrição com o olhar comportamental, entendendo que o ato de comer envolve sentimentos, rotina e cultura.
            </p>
          </div>
          {/* Valores */}
          <div className="antigravity-glass bg-white/5 dark:bg-black/10 border border-white/20 dark:border-stone-800/40 p-6 sm:p-8">
            <h4 className="text-xl font-semibold text-primary dark:text-emerald-400 mb-4 font-headline">Valores Inegociáveis</h4>
            <ul className="space-y-2 text-sm sm:text-base text-on-surface-variant dark:text-stone-400 font-body">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></span>
                Ética e rigor científico
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></span>
                Empatia no atendimento
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></span>
                Autonomia alimentar
              </li>
            </ul>
          </div>
        </div>
      </section>


    </main>
  );
}
