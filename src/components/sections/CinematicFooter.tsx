import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowUp } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';
import { useBooking } from '../../context/BookingContext';

gsap.registerPlugin(ScrollTrigger);

// ============================================================
// CinematicFooter — footer-cortina (Motion Footer, 21st.dev /
// Leva A do blueprint de imersão). O footer fica FIXO na
// viewport, mas o clip-path do wrapper (em fluxo, no fim da
// página) recorta sua visibilidade: ao rolar, a página sobe
// como uma cortina revelando o footer parado por baixo.
// Texto gigante "360º" com parallax + conteúdo real (links,
// WhatsApp, CRN) e reveal escalonado via ScrollTrigger.
// ============================================================

const WHATSAPP_URL =
  'https://wa.me/5511956007142?text=Ol%C3%A1%2C%20Mariana!%20Gostaria%20de%20saber%20mais%20sobre%20a%20consulta%20ou%20agendar%20um%20atendimento.';

const MARQUEE_TERMS = [
  'Saúde integral', 'Comportamento alimentar', 'Nutrição de precisão', 'Bem-estar', 'Ciência', 'Empatia',
];

function MarqueeRow() {
  return (
    <div className="flex items-center gap-10 px-5 shrink-0">
      {MARQUEE_TERMS.map((t) => (
        <span key={t} className="flex items-center gap-10">
          <span>{t}</span>
          <span aria-hidden="true" className="text-ouro-suave/70">✦</span>
        </span>
      ))}
    </div>
  );
}

export function CinematicFooter() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const giantTextRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const { openBooking } = useBooking();

  useGSAP(
    () => {
      if (!wrapperRef.current) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      // Texto gigante sobe/escala conforme a cortina abre
      gsap.fromTo(
        giantTextRef.current,
        { y: '10vh', scale: 0.85, opacity: 0 },
        {
          y: '0vh', scale: 1, opacity: 1, ease: 'power1.out',
          scrollTrigger: { trigger: wrapperRef.current, start: 'top 80%', end: 'bottom bottom', scrub: 1 },
        }
      );

      // Conteúdo central entra escalonado
      gsap.fromTo(
        [headingRef.current, linksRef.current],
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: wrapperRef.current, start: 'top 40%', end: 'bottom bottom', scrub: 1 },
        }
      );
    },
    { scope: wrapperRef }
  );

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    // Cortina: o clip-path recorta a visibilidade do footer fixed abaixo
    <div
      ref={wrapperRef}
      className="relative h-screen w-full"
      style={{ clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)' }}
    >
      <footer className="fixed bottom-0 left-0 flex h-screen w-full flex-col justify-between overflow-hidden bg-verde-profundo dark:bg-stone-950 text-background">
        {/* Aurora + grade de fundo */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 animate-breathing rounded-[50%] blur-[80px] pointer-events-none"
          style={{ background: 'radial-gradient(circle at 50% 50%, rgba(160,131,57,0.18) 0%, rgba(74,124,89,0.22) 45%, transparent 70%)' }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{
            backgroundSize: '60px 60px',
            backgroundImage:
              'linear-gradient(to right, rgba(243,234,217,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(243,234,217,0.04) 1px, transparent 1px)',
            maskImage: 'linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)',
          }}
        />

        {/* Texto gigante de fundo */}
        <div
          ref={giantTextRef}
          aria-hidden="true"
          className="absolute -bottom-[6vh] left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none select-none font-headline font-medium leading-[0.75] tracking-[-0.04em]"
          style={{
            fontSize: '30vw',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(243,234,217,0.10)',
            background: 'linear-gradient(180deg, rgba(243,234,217,0.10) 0%, transparent 60%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
          }}
        >
          360º
        </div>

        {/* Marquee diagonal */}
        <div className="absolute top-12 left-0 w-full overflow-hidden border-y border-background/10 bg-verde-profundo/70 dark:bg-stone-950/70 backdrop-blur-md py-3.5 -rotate-2 scale-110 shadow-float-2 z-10">
          <div className="flex w-max animate-marquee-slow text-[0.68rem] font-extrabold tracking-[0.3em] text-background/60 uppercase">
            <MarqueeRow />
            <MarqueeRow />
            <MarqueeRow />
            <MarqueeRow />
          </div>
        </div>

        {/* Centro */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 mt-16 w-full max-w-5xl mx-auto">
          <h2
            ref={headingRef}
            className="font-headline font-medium text-4xl md:text-7xl tracking-[-0.02em] mb-4 text-center text-background"
          >
            Pronta para <em className="italic text-ouro-suave">começar?</em>
          </h2>
          <p className="text-background/70 font-light text-base md:text-lg mb-10 text-center max-w-[44ch]">
            A triagem leva cinco minutos e o pagamento só acontece depois da revisão do seu caso.
          </p>

          <div ref={linksRef} className="flex flex-col items-center gap-5 w-full">
            <div className="flex flex-wrap justify-center gap-4 w-full">
              <MagneticButton as="div">
                <button
                  type="button"
                  onClick={() => openBooking()}
                  data-cursor="Agendar"
                  className="no-glass bg-background text-verde-profundo px-9 py-4 rounded-full font-semibold text-[0.95rem] shadow-float-2 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                >
                  Agendar consulta
                </button>
              </MagneticButton>
              <MagneticButton as="div">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="WhatsApp"
                  className="inline-flex items-center gap-2 border border-background/25 text-background px-9 py-4 rounded-full font-semibold text-[0.95rem] hover:border-ouro-suave hover:text-ouro-suave transition-colors duration-300"
                >
                  Falar no WhatsApp
                </a>
              </MagneticButton>
            </div>

            <div className="flex flex-wrap justify-center gap-3 md:gap-5 mt-1">
              <a
                href="https://www.instagram.com/mariana.bermudes?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="inline-flex items-center gap-2 border border-background/15 text-background/70 px-5 py-2.5 rounded-full text-xs font-semibold hover:text-ouro-suave hover:border-ouro-suave/50 transition-colors"
              >
                <i aria-hidden="true" className="fa-brands fa-instagram text-sm" /> Instagram
              </a>
              <a
                href="https://www.linkedin.com/in/mariana-bermudes/"
                target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                className="inline-flex items-center gap-2 border border-background/15 text-background/70 px-5 py-2.5 rounded-full text-xs font-semibold hover:text-ouro-suave hover:border-ouro-suave/50 transition-colors"
              >
                <i aria-hidden="true" className="fa-brands fa-linkedin-in text-sm" /> LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="relative z-20 w-full pb-8 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-5">
          <p className="text-background/50 text-[10px] md:text-xs font-semibold tracking-widest uppercase order-2 md:order-1 text-center md:text-left">
            © 2024 NutriJornada 360º Mariana Bermudes. Todos os direitos reservados. Pagamentos via Pix aceitos.
          </p>

          <MagneticButton as="div" className="order-1 md:order-2">
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Voltar ao topo"
              className="no-glass w-12 h-12 rounded-full border border-background/20 flex items-center justify-center text-background/70 hover:text-ouro-suave hover:border-ouro-suave/60 transition-colors group"
            >
              <ArrowUp className="w-5 h-5 transform group-hover:-translate-y-1 transition-transform duration-300" />
            </button>
          </MagneticButton>
        </div>
      </footer>
    </div>
  );
}
