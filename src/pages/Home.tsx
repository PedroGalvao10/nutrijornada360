import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { HulyTextHighlight } from '../components/HulyTextHighlight';
import SplineSafe from '../components/ui/SplineSafe';
import { TypewriterText } from '../components/TypewriterText';
import { useDynamicShadow } from '../hooks/useDynamicShadow';
import { useTilt } from '../hooks/useTilt';
import { ProjectShowcase } from '../components/ui/project-showcase';
import { StaggerReveal, StaggerItem } from '../components/ui/StaggerReveal';
import SEO from '../components/SEO';
import Logistica from './Logistica';
import { ContainerScroll } from '../components/ui/container-scroll-animation';
import { TextRotate } from '../components/ui/TextRotate';
import ArticlesSection from '../components/ArticlesSection';
import { ScrollExpandMedia } from '../components/ui/ScrollExpandMedia';
import { VerticalMarquee } from '../components/ui/VerticalMarquee';
import { GlowWrapper } from '../components/ui/GlowWrapper';
import { MagneticButton } from '../components/ui/MagneticButton';
import { SimuladorResultados } from '../components/SimuladorResultados';

export default function Home() {
  useDynamicShadow();

  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const splineAreaRef = useRef<HTMLDivElement>(null);
  const plansVideoRef = useRef<HTMLVideoElement>(null);
  const [splineApp, setSplineApp] = useState<{ play?: () => void, stop?: () => void } | null>(null);


  // Refs para 3D Tilt - Missão
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  
  // Refs para 3D Tilt - Planos
  const plano1Ref = useRef<HTMLDivElement>(null);
  const plano2Ref = useRef<HTMLDivElement>(null);
  const plano3Ref = useRef<HTMLDivElement>(null);

  useTilt(card1Ref, 15);
  useTilt(card2Ref, 15);
  useTilt(card3Ref, 15);
  useTilt(plano1Ref, 10);
  useTilt(plano2Ref, 10);
  useTilt(plano3Ref, 10);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.seed-fade-up').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Performance: Pause/Play element when out of viewport
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    if (!isMobile || !mobileVideoRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          mobileVideoRef.current?.play().catch(() => {});
        } else {
          mobileVideoRef.current?.pause();
        }
      });
    }, { threshold: 0 });

    observer.observe(mobileVideoRef.current);
    return () => observer.disconnect();
  }, []);

  // Performance: Pause/Play plans video when out of viewport
  useEffect(() => {
    if (!plansVideoRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          plansVideoRef.current?.play().catch(() => {});
        } else {
          plansVideoRef.current?.pause();
        }
      });
    }, { threshold: 0 });

    observer.observe(plansVideoRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // O react-spline gerencia a interrupção da renderização nativamente 
    // quando fora da viewport. Remover o observer manual previne travamentos ou a tela preta com a engine do Spline.
  }, [splineApp]);

  useEffect(() => {
    /* ── Scroll-linked canvas frame sequence — somente desktop (> 768px) ── */
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    if (isMobile) return; // No mobile o vídeo roda em autoplay, sem scroll-link

    const canvas = document.getElementById('hero-canvas-desktop') as HTMLCanvasElement;
    const container = document.getElementById('video-hero-container');
    
    if (!canvas || !container) return;

    const context = canvas.getContext('2d', { alpha: false }); // Otimização, sem fundo transparente
    if (!context) return;

    const frameCount = 192;
    const images: HTMLImageElement[] = [];
    const state = { frame: 0, targetFrame: 0 };
    
    const currentFrameURL = (index: number) => (
      `/hero-frames/frame_${index.toString().padStart(4, '0')}.webp`
    );

    // Pré-carrega APENAS os primeiros 20 frames imediatamente para o load inicial rápido
    const preloadTarget = 20;
    for (let i = 1; i <= frameCount; i++) {
        images.push(new Image());
    }
    
    const loadImages = (start: number, end: number) => {
        for (let i = start; i <= end; i++) {
            if (!images[i - 1].src) {
                images[i - 1].src = currentFrameURL(i);
            }
        }
    };
    
    // Inicia carregamento imediato dos primeiros frames
    loadImages(1, preloadTarget);
    
    // Queue os restantes em background de forma fracionada (chunks) para não travar a Main Thread
    const loadRest = () => {
        if (!images || images.length === 0) return;
        
        const chunkSize = 10;
        let currentStart = preloadTarget + 1;

        const loadNextChunk = () => {
            if (currentStart > frameCount) return; // Terminou
            
            const currentEnd = Math.min(currentStart + chunkSize - 1, frameCount);
            loadImages(currentStart, currentEnd);
            currentStart += chunkSize;
            
            // Pausa de 150ms entre cada lote para dar respiro à CPU (evita o site travar)
            setTimeout(loadNextChunk, 150);
        };
        
        setTimeout(loadNextChunk, 500); 
    };

    if (document.readyState === 'complete') {
        loadRest();
    } else {
        window.addEventListener('load', loadRest, { once: true });
    }

    // Desenha o frame usando preenchimento "cover" mantendo proporção
    const drawFrame = (frameIndex: number) => {
        const currentCanvas = document.getElementById('hero-canvas-desktop') as HTMLCanvasElement;
        if (!currentCanvas || !context) return;
        
        const img = images[frameIndex];
        if (!img || !img.complete || img.naturalWidth === 0) return;
        
        try {
            const hRatio = currentCanvas.width / img.naturalWidth;
            const vRatio = currentCanvas.height / img.naturalWidth; // Usando horizontalRatio para "cover" proporcional
            const ratio = Math.max(hRatio, vRatio);
            const centerShift_x = (currentCanvas.width - img.naturalWidth * ratio) / 2;
            const centerShift_y = (currentCanvas.height - img.naturalHeight * ratio) / 2;
            
            context.clearRect(0, 0, currentCanvas.width, currentCanvas.height);
            context.drawImage(
                img, 0, 0, img.naturalWidth, img.naturalHeight,
                centerShift_x, centerShift_y, img.naturalWidth * ratio, img.naturalHeight * ratio
            );
        } catch (e) {
            console.error("Erro ao desenhar no canvas:", e);
        }
    };

    // Canvas sizing handling
    const setCanvasSize = () => {
        const currentCanvas = document.getElementById('hero-canvas-desktop') as HTMLCanvasElement;
        if (!currentCanvas) return;
        const parent = currentCanvas.parentElement;
        if (parent) {
            currentCanvas.width = parent.clientWidth;
            currentCanvas.height = parent.clientHeight;
            if (images[state.frame] && images[state.frame].complete) {
                drawFrame(state.frame);
            }
        }
    };
    
    let resizeTimer: number;
    const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(setCanvasSize, 200);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    setCanvasSize();

    // Frame inicial
    if (images[0]) {
        images[0].onload = () => drawFrame(0);
        if (images[0].complete) drawFrame(0);
    }

    let animationFrameId: number;

    const renderLoop = () => {
        if (state.targetFrame !== Math.round(state.frame)) {
            const difference = state.targetFrame - state.frame;
            if (Math.abs(difference) <= 0.1) {
                state.frame = state.targetFrame;
            } else {
                state.frame += difference * 0.2; 
            }
            drawFrame(Math.round(state.frame));
            animationFrameId = requestAnimationFrame(renderLoop);
        } else {
            animationFrameId = 0; // O loop para aqui para poupar GPU/CPU.
        }
    };
    
    // Atualizado onScroll para reiniciar o renderLoop
    const onScroll = () => {
        const currentContainer = document.getElementById('video-hero-container');
        if (!currentContainer) return;
        
        const rect = currentContainer.getBoundingClientRect();
        const containerTop = rect.top;
        const containerHeight = rect.height - window.innerHeight;

        let progress = 0;
        if (containerTop > 0) {
            progress = 0;
        } else if (containerTop < -containerHeight) {
            progress = 1;
        } else if (containerHeight > 0) {
            progress = Math.abs(containerTop) / containerHeight;
        }

        const newTarget = Math.min(
            frameCount - 1,
            Math.floor(progress * (frameCount - 1))
        );

        if (newTarget !== state.targetFrame) {
            state.targetFrame = newTarget;
            // Se o loop estiver parado, reative-o
            if (!animationFrameId) {
                renderLoop();
            }
        }
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    renderLoop();
    onScroll(); 

    return () => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('load', loadRest);
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const homeContent = (
    <main className="font-body text-on-background bg-background selection:bg-primary-container selection:text-on-primary-container">
      <ScrollExpandMedia onComplete={() => {
        window.dispatchEvent(new CustomEvent('portal-complete'));
      }} />
      <SEO 
        title="Início | Mariana Bermudes Nutrição"
        description="Nutrição de precisão e emagrecimento consciente com Mariana Bermudes. Transforme sua saúde com estratégias personalizadas."
      />
      {/* ═══ Hero Section (Parallax Video) ═══ */}
      <section id="video-hero-container" className="relative h-[150vh] md:h-[150vh] bg-background transition-colors duration-1000">
        <div className="sticky top-0 h-screen overflow-hidden flex items-center">

          <div className="absolute inset-0 z-0 justify-end hidden md:flex">
            <div className="w-full h-full relative">
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent z-10"></div>
              {/* Suavização superior para encontro com o Portal */}
              <div className="absolute top-0 left-0 right-0 h-[10vh] bg-gradient-to-b from-background to-transparent z-10 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 right-0 h-[30vh] bg-gradient-to-t from-background to-transparent z-10 pointer-events-none"></div>
              <canvas
                id="hero-canvas-desktop"
                className="w-full h-full object-cover brightness-[0.85] saturate-[0.8]"
              ></canvas>
            </div>
          </div>

          {/* ── Background Video: Mobile (autoplay loop) ── */}
          <div className="absolute inset-0 z-0 flex md:hidden items-center justify-center">
            <div className="w-full h-full relative">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/40 z-10"></div>
              {/* Suavização superior Mobile */}
              <div className="absolute top-0 left-0 right-0 h-[10vh] bg-gradient-to-b from-background via-background/40 to-transparent z-10 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 right-0 h-[20vh] bg-gradient-to-t from-background to-transparent z-10 pointer-events-none"></div>
              <video
                ref={mobileVideoRef}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              >
                <source src="/hero-video-v2.webm" type="video/webm" />
              </video>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8 md:gap-16 items-center relative z-20 w-full pt-16 md:pt-0">
            {/* Hero text — entrada linha a linha */}
            <StaggerReveal className="space-y-5 md:space-y-8 max-w-2xl mx-auto md:mx-0 text-center md:text-left">

              <StaggerItem>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-secondary-container text-on-secondary-container font-medium text-xs md:text-sm border border-secondary/20 shadow-sm">
                  <span className="material-symbols-outlined text-sm">spa</span>
                  <span>Abordagem Comportamental &amp; Estética</span>
                </div>
              </StaggerItem>

              <StaggerItem>
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-body text-on-background leading-[1.1] font-bold tracking-tight mb-4">
                  <span className="block opacity-90">Faça as pazes</span>
                  <TextRotate
                    texts={[
                      "com a comida",
                      "com seu corpo",
                      "com o prazer de comer",
                      "com a sua saúde",
                      "com você mesma",
                      "com o equilíbrio",
                    ]}
                    mainClassName="text-primary font-headline"
                    staggerFrom="last"
                    initial={{ y: "20%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "-20%", opacity: 0 }}
                    staggerDuration={0.025}
                    rotationInterval={3000}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  />
                </h1>
              </StaggerItem>

              <StaggerItem>
                <div className="text-base sm:text-lg md:text-xl text-on-surface-variant leading-relaxed opacity-90 drop-shadow-md md:drop-shadow-none max-w-lg mx-auto md:mx-0 font-body">
                  <TypewriterText text="Um convite ao respeito profundo pelo próprio corpo e à nutrição que acolhe. Chega de restrições que ferem a sua essência." speed={35} delay={800} />
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-5 pt-2 md:pt-4 items-center md:items-start">
                  <MagneticButton as="div" className="w-full sm:w-auto">
                    <Link to="/planos" className="justify-center bg-tertiary text-on-tertiary px-6 py-3 md:px-8 md:py-4 rounded-full text-base md:text-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2 w-full sm:w-auto">
                      Começar minha jornada <span className="material-symbols-outlined">arrow_forward</span>
                    </Link>
                  </MagneticButton>
                  <MagneticButton as="div" className="w-full sm:w-auto">
                    <Link to="/sobre" className="justify-center text-center bg-white/80 backdrop-blur-md border border-primary/20 text-primary px-6 py-3 md:px-8 md:py-4 rounded-full text-base md:text-lg font-semibold hover:bg-white hover:shadow-md transition-all duration-300 w-full sm:w-auto mt-0">
                      Conhecer o método
                    </Link>
                  </MagneticButton>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="grid grid-cols-3 gap-2 md:gap-6 pt-5 md:pt-8 border-t border-outline/20 mt-5 md:mt-8">
                  <div className="text-center md:text-left">
                    <h4 className="text-2xl sm:text-3xl font-headline font-bold text-secondary">5k+</h4>
                    <p className="text-xs md:text-sm text-on-surface-variant font-medium">Transformadas</p>
                  </div>
                  <div className="text-center md:text-left">
                    <h4 className="text-2xl sm:text-3xl font-headline font-bold text-primary">100%</h4>
                    <p className="text-xs md:text-sm text-on-surface-variant font-medium">Bem-estar</p>
                  </div>
                  <div className="text-center md:text-left">
                    <h4 className="text-2xl sm:text-3xl font-headline font-bold text-tertiary">360º</h4>
                    <p className="text-xs md:text-sm text-on-surface-variant font-medium">Visão integrativa</p>
                  </div>
                </div>
              </StaggerItem>

            </StaggerReveal>
            {/* Right side empty — reserved for 3D element */}
            <div className="hidden md:flex justify-end items-end h-full pb-20"></div>
          </div>
        </div>
      </section>
      
      {/* ── 3D Transition Section (NutriJornada 360° Creative Experience - Compact Version) ── */}
      {/* Reduzi o min-h e apliquei mt negativo para aproximar as mãos da Hero, diminuindo o espaço em branco */}
      <section className="w-full min-h-[600px] md:min-h-[750px] relative z-10 flex flex-col items-center justify-center overflow-visible bg-background py-0 mt-[-80px] md:mt-[-150px]">
        
        {/* Camada Central: Elemento 3D Spline (Compactado com Fade-out) */}
        <div className="relative z-10 w-full h-full flex items-center justify-center overflow-visible mask-vignette-vertical">
          <div ref={splineAreaRef} className="w-full max-w-[2200px] h-[500px] md:h-[900px] flex flex-col md:flex-row items-center justify-end pointer-events-auto transform-gpu">
            {/* Espaço reservado à esquerda para Marquee Vertical de Branding */}
            <div className="hidden md:block w-1/2 h-full z-30 relative px-6 md:px-12 flex items-center overflow-hidden">
              <div className="w-full h-[80%] opacity-35 pointer-events-none transform-gpu">
                <VerticalMarquee 
                  items={[
                    "NutriJornada 360°",
                    "Saúde Integrativa",
                    "Bem-estar Pleno",
                    "Equilíbrio Metabólico",
                    "Nutrição de Precisão",
                    "Estratégias Personalizadas"
                  ]} 
                  speed={40}
                />
              </div>
            </div>

            {/* Elemento 3D (DNA) posicionado à direita */}
            <div className="w-full md:w-1/2 h-full flex items-center justify-center relative">
              <SplineSafe 
                scene="https://prod.spline.design/23mP4RppmrjsD4Yo/scene.splinecode" 
                onLoad={(spline) => {
                  if (spline && typeof spline.setBackgroundColor === 'function') {
                    spline.setBackgroundColor('#faf6f0');
                  }
                  setSplineApp(spline);
                }}
                className="w-full h-full scale-[1.1] md:scale-125 lg:scale-[1.4] origin-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Container com z-index maior para garantir que o título do ecossistema fique À FRENTE das mãos */}
      <div className="relative z-30">
        <ProjectShowcase />
      </div>

      {/* Mission Section (Ruixen Style) */}
      <section className="py-16 md:py-24 bg-surface-variant relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <StaggerReveal className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
            <StaggerItem>
              <span className="text-secondary font-label font-bold tracking-widest uppercase text-sm mb-4 block">Nossa Missão</span>
            </StaggerItem>
            <StaggerItem>
              <h2 className="text-3xl md:text-5xl font-headline text-on-background mb-6 leading-tight font-semibold">O ser humano não é uma ilha isolada.</h2>
            </StaggerItem>
            <StaggerItem>
              <p className="text-base md:text-lg text-on-surface-variant leading-relaxed">
                Acreditamos que a nutrição deve promover o bem-estar pleno, integrando mente, corpo e ambiente. Olhamos para a sua história, suas emoções e o contexto da sua vida.
              </p>
            </StaggerItem>
          </StaggerReveal>

          {/* Grid 2-col no estilo Ruixen */}
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Bloco Esquerdo — Saúde Integral + Respeito Mental */}
            <StaggerReveal className="flex flex-col border border-outline-variant/30 p-4 sm:p-6 lg:p-8 gap-8">
              <StaggerItem>
                <GlowWrapper 
                  ref={card1Ref}
                  className="bg-surface-container-low p-6 sm:p-8 rounded-3xl border-none shadow-sm hover:shadow-xl transition-all duration-300 transform-style-3d"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-5 text-primary tilt-child tz-30">
                    <span className="material-symbols-outlined text-3xl">favorite</span>
                  </div>
                  <h3 className="font-headline text-xl font-bold text-on-surface mb-3 tilt-child tz-20">Saúde Integral</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed tilt-child tz-10">Foco no equilíbrio metabólico e hormonal, tratando o corpo como um sistema conectado.</p>
                </GlowWrapper>
              </StaggerItem>
              <StaggerItem>
                <GlowWrapper 
                  ref={card2Ref}
                  className="bg-surface-container-low p-6 sm:p-8 rounded-3xl border-none shadow-sm hover:shadow-xl transition-all duration-300 transform-style-3d"
                >
                  <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center mb-5 text-secondary tilt-child tz-30">
                    <span className="material-symbols-outlined text-3xl">psychology</span>
                  </div>
                  <h3 className="font-headline text-xl font-bold text-on-surface mb-3 tilt-child tz-20">Respeito Mental</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed tilt-child tz-10">Sua relação com a comida importa tanto quanto os nutrientes que você consome.</p>
                </GlowWrapper>
              </StaggerItem>
            </StaggerReveal>

            {/* Bloco Direito — Nutrição Orgânica + Texto */}
            <StaggerReveal className="flex flex-col justify-center border border-outline-variant/30 p-4 sm:p-6 lg:p-8" delay={0.2}>
              <StaggerItem>
                <GlowWrapper 
                  ref={card3Ref}
                  className="bg-surface-container-low p-6 sm:p-8 rounded-3xl border-none shadow-sm hover:shadow-xl transition-all duration-300 transform-style-3d mb-6"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-5 text-primary tilt-child tz-30">
                    <span className="material-symbols-outlined text-3xl">eco</span>
                  </div>
                  <h3 className="font-headline text-xl font-bold text-on-surface mb-3 tilt-child tz-20">Nutrição Orgânica</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed tilt-child tz-10">Preferência por alimentos reais, minimamente processados para máxima vitalidade.</p>
                </GlowWrapper>
              </StaggerItem>
              <StaggerItem>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-normal text-on-surface leading-relaxed font-headline">
                  Nutrição com Propósito{' '}
                  <span className="text-primary font-semibold">NutriJornada</span>{' '}
                  <span className="text-on-surface-variant text-sm sm:text-base lg:text-lg font-body">
                    Cada plano é desenhado para integrar ciência, comportamento e rotina — porque saúde de verdade é sustentável.
                  </span>
                </h3>
              </StaggerItem>
            </StaggerReveal>
          </div>
        </div>
      </section>

      {/* Agendamento / Logística Tablet Viewer */}
      <section className="bg-background relative z-20 overflow-hidden">
        <ContainerScroll
          titleComponent={
            <>
              <h1 className="text-4xl md:text-5xl font-semibold text-on-background font-headline mb-4 md:mb-0">
                Sua saúde a um clique. <br />
                <span className="text-4xl md:text-6xl lg:text-[6rem] font-bold mt-1 leading-none text-primary inline-block">
                  Agende sua consulta
                </span>
              </h1>
            </>
          }
        >
          <Logistica />
        </ContainerScroll>
      </section>

      {/* Plans Section (Seed Inspired) */}
      <section className="relative py-24 md:py-32 flex flex-col items-center justify-center overflow-hidden w-full bg-stone-900 border-none">

        {/* Video Background Layer */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-stone-900">
          <video 
            ref={plansVideoRef}
            muted 
            playsInline 
            loop
            preload="metadata"
            className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-90 brightness-75 saturate-[0.7] blur-[2px] scale-[1.02]"
          >
            <source src="/bg-plans.webm" type="video/webm" />
          </video>
          {/* Overlay mantendo o aspecto escuro sem usar o pesadíssimo backdrop-blur */}
          <div className="absolute inset-0 bg-stone-950/40"></div>
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-surface-variant to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none"></div>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 w-full text-center md:text-left pt-10">
          <StaggerReveal className="mb-16 md:mb-24 md:w-3/4">
            <StaggerItem>
              <h2 className="text-5xl md:text-[4rem] font-headline text-white tracking-tight font-medium leading-[1.05] mb-6">
                Sua jornada começa aqui.
              </h2>
            </StaggerItem>
            <StaggerItem>
              <div className="text-xl md:text-2xl text-white/80 font-normal max-w-2xl leading-relaxed">
                <HulyTextHighlight
                  text="Modalidades de atendimento desenhadas para integrar a nutrição ao seu estilo de vida da forma mais orgânica possível."
                  highlightWords="integrar a nutrição ao seu estilo de vida"
                />
              </div>
            </StaggerItem>
          </StaggerReveal>

          <StaggerReveal 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
            staggerInterval={0.2}
          >
            <StaggerItem>
              <GlowWrapper 
                ref={plano1Ref}
                className="parallax-shadow group bg-[#F5EBE0]/[0.06] backdrop-blur-[20px] border-none rounded-[2.25rem] p-8 md:p-10 hover:bg-[#F5EBE0]/[0.12] hover:border-[#F5EBE0]/[0.2] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col relative overflow-hidden transform-style-3d h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="w-14 h-14 rounded-full border border-white/20 bg-white/5 flex items-center justify-center mb-10 text-white/90 group-hover:scale-110 transition-transform duration-700 ease-out tilt-child tz-30">
                  <span className="material-symbols-outlined font-light text-[24px]">person</span>
                </div>
                <h3 className="text-3xl font-headline text-white mb-5 tracking-tight font-medium tilt-child tz-20">Individual</h3>
                <div className="flex-grow">
                  <p className="text-white/70 mb-12 font-light leading-relaxed text-lg tilt-child tz-10">Acompanhamento 100% focado no seu metabolismo e rotina.</p>
                </div>
                <Link to="/planos" className="text-white font-medium flex items-center gap-2 group-hover:gap-4 transition-all duration-500 ease-out z-10 w-fit tilt-child tz-20">
                  Ver Plano
                  <span className="material-symbols-outlined text-sm font-bold leading-none opacity-80 group-hover:opacity-100 transform translate-y-px">arrow_forward</span>
                </Link>
              </GlowWrapper>
            </StaggerItem>

            <StaggerItem>
              <GlowWrapper 
                ref={plano2Ref}
                className="parallax-shadow bg-[#4a5f4a]/60 backdrop-blur-[32px] border-none rounded-[2.25rem] p-8 md:p-10 hover:bg-[#4a5f4a]/80 hover:border-[#8aa88a]/50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col relative overflow-hidden transform-style-3d h-full"
              >
                <div className="absolute top-0 right-0 p-8">
                  <div className="w-2 h-2 rounded-full bg-white/80 animate-pulse"></div>
                </div>
                <div className="w-14 h-14 rounded-full border border-white/30 bg-white/10 flex items-center justify-center mb-10 text-white group-hover:scale-110 transition-transform duration-700 ease-out tilt-child tz-30">
                  <span className="material-symbols-outlined font-light text-[24px]">star</span>
                </div>
                <h3 className="text-3xl font-headline text-white mb-5 tracking-tight font-medium tilt-child tz-20">Premium 360º</h3>
                <div className="flex-grow">
                  <p className="text-white/85 mb-14 font-light leading-relaxed text-lg tilt-child tz-10">Suporte direto via WhatsApp, lista de compras e plano com foco integrativo.</p>
                </div>
                <Link to="/planos" className="w-full bg-white text-[#384a38] rounded-full py-5 px-6 flex items-center justify-between font-semibold group-hover:shadow-[0_8px_32_rgba(255,255,255,0.2)] group-hover:scale-[1.02] transition-all duration-500 ease-out z-10 tilt-child tz-20">
                  Assinar Agora
                  <span className="material-symbols-outlined text-[18px] leading-none transform group-hover:translate-x-2 transition-transform duration-500 text-[#384a38] font-bold">arrow_forward</span>
                </Link>
              </GlowWrapper>
            </StaggerItem>

            <StaggerItem>
              <GlowWrapper 
                ref={plano3Ref}
                className="parallax-shadow group bg-[#F5EBE0]/[0.06] backdrop-blur-[20px] border-none rounded-[2.25rem] p-8 md:p-10 hover:bg-[#F5EBE0]/[0.12] hover:border-[#F5EBE0]/[0.2] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col relative overflow-hidden transform-style-3d h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="w-14 h-14 rounded-full border border-white/20 bg-white/5 flex items-center justify-center mb-10 text-white/90 group-hover:scale-110 transition-transform duration-700 ease-out tilt-child tz-30">
                  <span className="material-symbols-outlined font-light text-[24px]">computer</span>
                </div>
                <h3 className="text-3xl font-headline text-white mb-5 tracking-tight font-medium tilt-child tz-20">Online</h3>
                <div className="flex-grow">
                  <p className="text-white/70 mb-12 font-light leading-relaxed text-lg tilt-child tz-10">Sessões terapêuticas nutricionais do conforto de onde você estiver.</p>
                </div>
                <Link to="/planos" className="text-white font-medium flex items-center gap-2 group-hover:gap-4 transition-all duration-500 ease-out z-10 w-fit tilt-child tz-20">
                  Ver Plano
                  <span className="material-symbols-outlined text-sm font-bold leading-none opacity-80 group-hover:opacity-100 transform translate-y-px">arrow_forward</span>
                </Link>
              </GlowWrapper>
            </StaggerItem>
          </StaggerReveal>
        </div>
      </section>

      {/* Simulador de Resultados Interativo */}
      <SimuladorResultados />

      {/* Articles Section - Restaurada para a Home */}
      <ArticlesSection />
    </main>
  );

  return homeContent;
}
