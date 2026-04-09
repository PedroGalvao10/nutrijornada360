import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { HulyTextHighlight } from '../components/HulyTextHighlight';
import Spline from '@splinetool/react-spline';
import { TypewriterText } from '../components/TypewriterText';
import { useDynamicShadow } from '../hooks/useDynamicShadow';
import { useTilt } from '../hooks/useTilt';
import { ScrollingText } from '../components/ui/ScrollingText';
import { NutritionEcosystem } from '../components/sections/NutritionEcosystem';
import { StaggerReveal, StaggerItem } from '../components/ui/StaggerReveal';
import SEO from '../components/SEO';

export default function Home() {
  useDynamicShadow();

  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const splineAreaRef = useRef<HTMLDivElement>(null);
  const [splineApp, setSplineApp] = useState<{ play?: () => void, stop?: () => void } | null>(null);

  // Refs para 3D Tilt - Missão
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  
  // Refs para 3D Tilt - Dicas
  const dica1Ref = useRef<HTMLDivElement>(null);
  const dica2Ref = useRef<HTMLDivElement>(null);
  
  // Refs para 3D Tilt - Planos
  const plano1Ref = useRef<HTMLDivElement>(null);
  const plano2Ref = useRef<HTMLDivElement>(null);
  const plano3Ref = useRef<HTMLDivElement>(null);

  useTilt(card1Ref, 15);
  useTilt(card2Ref, 15);
  useTilt(card3Ref, 15);
  useTilt(dica1Ref, 15);
  useTilt(dica2Ref, 15);
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

  useEffect(() => {
    if (!splineApp || !splineAreaRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (typeof splineApp.play === 'function') splineApp.play();
        } else {
          if (typeof splineApp.stop === 'function') splineApp.stop();
        }
      });
    }, { threshold: 0, rootMargin: '100px' });

    observer.observe(splineAreaRef.current);
    return () => observer.disconnect();
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
    
    // Queue os restantes em background após o load (lazy)
    const loadRest = () => {
        setTimeout(() => loadImages(preloadTarget + 1, frameCount), 500);
    };

    if (document.readyState === 'complete') {
        loadRest();
    } else {
        window.addEventListener('load', loadRest, { once: true });
    }

    // Canvas sizing handling - apenas 1 redimensionamento
    const setCanvasSize = () => {
        const parent = canvas.parentElement;
        if (parent) {
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;
            if (images[state.frame] && images[state.frame].complete) {
                drawFrame(state.frame);
            }
        }
    };
    
    let resizeTimer: number;
    const handleResize = () => {
        clearTimeout(resizeTimer);
        // Debounce do resize para não forçar reflow seguidamente
        resizeTimer = window.setTimeout(setCanvasSize, 200);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    setCanvasSize();

    // Desenha o frame usando preenchimento "cover" mantendo proporção
    const drawFrame = (frameIndex: number) => {
        const img = images[frameIndex];
        if (!img || !img.complete || img.naturalWidth === 0) return;
        
        const hRatio = canvas.width / img.naturalWidth;
        const vRatio = canvas.height / img.naturalHeight;
        const ratio = Math.max(hRatio, vRatio);
        const centerShift_x = (canvas.width - img.naturalWidth * ratio) / 2;
        const centerShift_y = (canvas.height - img.naturalHeight * ratio) / 2;
        
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(
            img, 0, 0, img.naturalWidth, img.naturalHeight,
            centerShift_x, centerShift_y, img.naturalWidth * ratio, img.naturalHeight * ratio
        );
    };

    // Frame inicial
    images[0].onload = () => drawFrame(0);

    let animationFrameId: number;

    const onScroll = () => {
        const rect = container.getBoundingClientRect();
        const containerTop = rect.top;
        const containerHeight = rect.height - window.innerHeight;

        let progress = 0;
        if (containerTop > 0) {
            progress = 0;
        } else if (containerTop < -containerHeight) {
            progress = 1;
        } else {
            progress = Math.abs(containerTop) / containerHeight;
        }

        state.targetFrame = Math.min(
            frameCount - 1,
            Math.floor(progress * (frameCount - 1))
        );
    };

    const renderLoop = () => {
        if (state.targetFrame !== state.frame) {
            // Suaviza a transição (interpolacao) para não engasgar em "mid-scroll"
            const difference = state.targetFrame - state.frame;
            // Se tiver muito próximo, snap. Se não, interpola pra suavizar
            if (Math.abs(difference) <= 0.5) {
                state.frame = state.targetFrame;
            } else {
                state.frame += difference * 0.25; // Velocidade de interpolação
            }

            drawFrame(Math.round(state.frame));
        }
        animationFrameId = requestAnimationFrame(renderLoop);
    };
    
    // Ouve scroll apenas para calcular current index (sem pintar o canvas aqui)
    window.addEventListener('scroll', onScroll, { passive: true });
    renderLoop();
    onScroll(); // Calc initial scroll pos

    return () => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('load', loadRest);
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <main className="animate-fade-in-up font-body text-on-background bg-background selection:bg-primary-container selection:text-on-primary-container">
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
              <div className="absolute bottom-0 left-0 right-0 h-[20vh] bg-gradient-to-t from-background to-transparent z-10 pointer-events-none"></div>
              <video
                ref={mobileVideoRef}
                className="w-full h-full object-cover"
                src="/hero-video-v2.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              ></video>
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
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-headline text-on-background leading-tight font-semibold tracking-tight">
                  Faça as pazes <br /> <span className="text-primary italic font-medium">com a comida.</span>
                </h1>
              </StaggerItem>

              <StaggerItem>
                <div className="text-base sm:text-lg md:text-xl text-on-surface-variant leading-relaxed opacity-90 drop-shadow-md md:drop-shadow-none max-w-lg mx-auto md:mx-0">
                  <TypewriterText text="Um convite ao respeito profundo pelo próprio corpo e à nutrição que acolhe. Chega de restrições que ferem a sua essência." speed={35} delay={800} />
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-5 pt-2 md:pt-4 items-center md:items-start">
                  <Link to="/planos" className="justify-center bg-tertiary text-on-tertiary px-6 py-3 md:px-8 md:py-4 rounded-full text-base md:text-lg font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 w-full sm:w-auto">
                    Começar minha jornada <span className="material-symbols-outlined">arrow_forward</span>
                  </Link>
                  <Link to="/sobre" className="justify-center text-center bg-white/80 backdrop-blur-md border border-primary/20 text-primary px-6 py-3 md:px-8 md:py-4 rounded-full text-base md:text-lg font-semibold hover:bg-white hover:shadow-md transition-all duration-300 w-full sm:w-auto">
                    Conhecer o método
                  </Link>
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
        
        {/* Camada Frontal de Branding: Frases desaceleradas e mais nítidas (20% opacidade) */}
        <div className="absolute inset-0 z-20 flex flex-col justify-center gap-16 pointer-events-none select-none overflow-hidden opacity-50">
          <div className="flex whitespace-nowrap animate-marquee-slow will-change-transform">
            {[...Array(4)].map((_, i) => (
              <span key={i} className="text-[100px] md:text-[180px] font-black italic tracking-tighter text-primary/20 uppercase mr-24 shrink-0">
                NutriJornada 360° • NutriJornada 360° • NutriJornada 360° • 
              </span>
            ))}
          </div>
          <div className="flex whitespace-nowrap animate-marquee-reverse-slow will-change-transform">
            {[...Array(4)].map((_, i) => (
              <span key={i} className="text-[80px] md:text-[140px] font-black italic tracking-tighter text-secondary/20 uppercase mr-24 shrink-0">
                Saúde Integrativa • Bem-estar Pleno • Equilíbrio Metabólico • 
              </span>
            ))}
          </div>
        </div>

        {/* Camada Central: Elemento 3D Spline (Compactado com Fade-out) */}
        <div className="relative z-10 w-full h-full flex items-center justify-center overflow-visible mask-vignette-vertical">
          <div ref={splineAreaRef} className="w-full max-w-[2200px] h-[500px] md:h-[900px] flex flex-col md:flex-row items-center justify-end pointer-events-auto transform-gpu">
            {/* Espaço reservado à esquerda para futuro conteúdo do usuário */}
            <div className="hidden md:block w-1/2 h-full z-30 relative px-6 md:px-12 flex items-center">
              {/* O conteúdo futuro pode ser inserido aqui */}
            </div>

            {/* Elemento 3D (DNA) posicionado à direita */}
            <div className="w-full md:w-1/2 h-full flex items-center justify-center relative">
              <Spline 
                scene="https://prod.spline.design/23mP4RppmrjsD4Yo/scene.splinecode" 
                onLoad={(spline) => {
                  spline.setBackgroundColor('#faf6f0');
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
        <NutritionEcosystem />
      </div>

      {/* Mission Section (Organic Bento) */}
      <section className="py-16 md:py-24 bg-surface-variant relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
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

          <StaggerReveal 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
            staggerInterval={0.2}
          >
            <StaggerItem>
              <div 
                ref={card1Ref}
                className="bg-surface-container-low p-8 rounded-3xl border border-outline/10 shadow-sm hover:shadow-xl transition-all duration-300 transform-style-3d h-full"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary tilt-child tz-30">
                  <span className="material-symbols-outlined text-3xl">favorite</span>
                </div>
                <h3 className="font-headline text-xl font-bold text-on-surface mb-3 tilt-child tz-20">Saúde Integral</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed tilt-child tz-10">Foco no equilíbrio metabólico e hormonal, tratando o corpo como um sistema conectado.</p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div 
                ref={card2Ref}
                className="bg-surface-container-low p-8 rounded-3xl border border-outline/10 shadow-sm hover:shadow-xl transition-all duration-300 transform-style-3d h-full"
              >
                <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 text-secondary tilt-child tz-30">
                  <span className="material-symbols-outlined text-3xl">psychology</span>
                </div>
                <h3 className="font-headline text-xl font-bold text-on-surface mb-3 tilt-child tz-20">Respeito Mental</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed tilt-child tz-10">Sua relação com a comida importa tanto quanto os nutrientes que você consome.</p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div 
                ref={card3Ref}
                className="bg-surface-container-low p-8 rounded-3xl border border-outline/10 shadow-sm hover:shadow-xl transition-all duration-300 transform-style-3d h-full"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary tilt-child tz-30">
                  <span className="material-symbols-outlined text-3xl">eco</span>
                </div>
                <h3 className="font-headline text-xl font-bold text-on-surface mb-3 tilt-child tz-20">Nutrição Orgânica</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed tilt-child tz-10">Preferência por alimentos reais, minimamente processados para máxima vitalidade.</p>
              </div>
            </StaggerItem>
          </StaggerReveal>
        </div>
      </section>

      {/* Practical Tips */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <StaggerReveal className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-4 md:gap-6">
            <StaggerItem className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-headline text-on-background mb-3 md:mb-4 font-semibold">Dicas para o Dia a Dia</h2>
            </StaggerItem>
            <StaggerItem className="max-w-2xl">
              <p className="text-base md:text-lg text-on-surface-variant">Mudanças graduais no seu ambiente geram grandes transformações sustentáveis.</p>
            </StaggerItem>
            <StaggerItem>
              <Link to="/artigos" className="bg-surface-variant text-on-surface px-6 py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-outline/10 transition-colors text-sm md:text-base">
                Explorar dicas <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </StaggerItem>
          </StaggerReveal>

          <StaggerReveal 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
            staggerInterval={0.25}
          >
            <StaggerItem>
              <div 
                ref={dica1Ref}
                className="group bg-surface-container-low rounded-[2rem] p-8 border border-outline/10 hover:shadow-2xl transition-all duration-500 transform-style-3d overflow-hidden h-full"
              >
                <div className="flex gap-6 items-start tilt-child tz-30">
                  <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-3xl font-variation-settings-fill">lunch_dining</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-on-surface mb-2 font-headline tilt-child tz-20">Lanches Estratégicos</h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed tilt-child tz-10">O segredo para não chegar morto de fome no jantar é o lanche da tarde equilibrado.</p>
                  </div>
                </div>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div 
                ref={dica2Ref}
                className="group bg-surface-container-low rounded-[2rem] p-8 border border-outline/10 hover:shadow-2xl transition-all duration-500 transform-style-3d overflow-hidden h-full"
              >
                <div className="flex gap-6 items-start tilt-child tz-30">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-3xl font-variation-settings-fill">mindfulness</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-on-surface mb-2 font-headline tilt-child tz-20">Consciência no Prato</h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed tilt-child tz-10">Comer sem telas aumenta a percepção de saciedade e melhora a digestão.</p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          </StaggerReveal>
        </div>
      </section>

      <ScrollingText 
        text={["Liberdade Alimentar", "Consciência", "Equilíbrio", "Harmonia", "Vitalidade"]} 
        reverse 
      />

      {/* Plans Section (Seed Inspired) */}
      <section className="relative py-24 md:py-32 flex flex-col items-center justify-center overflow-hidden w-full bg-stone-900 border-none">

        {/* Video Background Layer */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <video autoPlay loop muted playsInline className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-90 brightness-75 saturate-[0.7]">
            <source src="/bg-plans.mp4" type="video/mp4" />
          </video>
          {/* Dark Overlay Parallax & Gradients */}
          <div className="absolute inset-0 bg-stone-950/40 backdrop-blur-[2px]"></div>
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
              <div 
                ref={plano1Ref}
                className="parallax-shadow group bg-white/[0.04] backdrop-blur-[20px] border border-white/[0.08] rounded-[2.25rem] p-8 md:p-10 hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col relative overflow-hidden transform-style-3d h-full"
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
              </div>
            </StaggerItem>

            <StaggerItem>
              <div 
                ref={plano2Ref}
                className="parallax-shadow group bg-[#4a5f4a]/60 backdrop-blur-[32px] border border-[#748c74]/40 rounded-[2.25rem] p-8 md:p-10 hover:bg-[#4a5f4a]/80 hover:border-[#8aa88a]/50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col relative overflow-hidden transform-style-3d h-full"
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
              </div>
            </StaggerItem>

            <StaggerItem>
              <div 
                ref={plano3Ref}
                className="parallax-shadow group bg-white/[0.04] backdrop-blur-[20px] border border-white/[0.08] rounded-[2.25rem] p-8 md:p-10 hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col relative overflow-hidden transform-style-3d h-full"
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
              </div>
            </StaggerItem>
          </StaggerReveal>
        </div>
      </section>
    </main>
  );
}

