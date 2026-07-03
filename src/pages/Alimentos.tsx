import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { StaggerReveal, StaggerItem } from '../components/ui/StaggerReveal';
import { CircularGallery, type GalleryItem } from '../components/ui/CircularGallery';

// ============================================================
// Alimentos — nova página (/alimentos): abertura "Floating Food
// Hero" (21st.dev Hero Section 7) com as frutas PNG do projeto
// flutuando ao redor do texto, seguida da CircularGallery com
// nome popular + científico. Encaixes 5 e 6 do blueprint.
// ============================================================

// Imagens flutuantes do hero — assets locais já existentes
const FLOATING = [
  { src: '/apple.png', alt: 'Maçã', className: 'top-[12%] left-[6%] w-24 md:w-36 rotate-[-12deg]', rot: '-12deg' },
  { src: '/banana.png', alt: 'Banana', className: 'top-[8%] right-[8%] w-28 md:w-44 rotate-[18deg]', rot: '18deg' },
  { src: '/pear-v2.png', alt: 'Pera', className: 'bottom-[14%] left-[10%] w-24 md:w-40 rotate-[10deg]', rot: '10deg' },
  { src: '/strawberry.png', alt: 'Morango', className: 'bottom-[10%] right-[12%] w-20 md:w-32 rotate-[-15deg]', rot: '-15deg' },
];

// Galeria — nome popular + binômio científico, fotos locais
const ALIMENTOS: GalleryItem[] = [
  { common: 'Mirtilo', binomial: 'Vaccinium corymbosum', photo: { url: '/fruits/Blueberry 1.webp', text: 'Mirtilos frescos' } },
  { common: 'Kiwi', binomial: 'Actinidia deliciosa', photo: { url: '/fruits/Kiwi 1.webp', text: 'Kiwi cortado' } },
  { common: 'Castanhas', binomial: 'Bertholletia excelsa', photo: { url: '/fruits/Castanhas.webp', text: 'Mix de castanhas' } },
  { common: 'Mirtilo silvestre', binomial: 'Vaccinium myrtillus', photo: { url: '/fruits/Blueberry 3.webp', text: 'Mirtilos silvestres' } },
  { common: 'Kiwi gold', binomial: 'Actinidia chinensis', photo: { url: '/fruits/kiwi 3.webp', text: 'Kiwi gold' } },
  { common: 'Mirtilo em rama', binomial: 'Vaccinium spp.', photo: { url: '/fruits/Blueberry 5.webp', text: 'Mirtilos no galho' } },
];

// Filetes decorativos do hero, recoloridos para a marca
function Swirls() {
  return (
    <>
      <svg
        className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 text-verde-nevoa dark:text-emerald-900/20"
        width="600" height="600" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
      >
        <path d="M515.266 181.33C377.943 51.564 128.537 136.256 50.8123 293.565C-26.9127 450.874 125.728 600 125.728 600" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <svg
        className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 text-ouro-suave/30 dark:text-ouro-suave/15"
        width="700" height="700" viewBox="0 0 700 700" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
      >
        <path d="M26.8838 528.274C193.934 689.816 480.051 637.218 594.397 451.983C708.742 266.748 543.953 2.22235 543.953 2.22235" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </>
  );
}

export default function Alimentos() {
  return (
    <div className="relative min-h-screen bg-background dark:bg-stone-950 overflow-x-hidden transition-colors duration-500">
      <SEO
        title="Alimentos de Verdade | NutriJornada 360º"
        description="Explore alimentos com nome científico, origem e papel nutricional. A enciclopédia visual de ingredientes da NutriJornada 360º."
      />

      {/* Hero — Floating Food */}
      <section className="relative w-full min-h-[72vh] lg:min-h-[84vh] flex items-center justify-center overflow-hidden pt-28 pb-16">
        <div className="absolute inset-0 z-0">
          <Swirls />
        </div>

        {/* Frutas flutuando ao redor do texto */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {FLOATING.map((img, index) => (
            <img
              key={img.src}
              src={img.src}
              alt={img.alt}
              className={`absolute object-cover rounded-[22px] shadow-float-2 animate-float-drift ${img.className}`}
              style={{ animationDelay: `${index * 900}ms`, ['--float-rot' as string]: img.rot }}
            />
          ))}
        </div>

        <div className="relative z-20 mx-auto px-6 text-center max-w-2xl">
          <StaggerReveal>
            <StaggerItem>
              <p className="inline-flex items-center gap-3 text-[0.68rem] tracking-[0.26em] uppercase font-extrabold text-tertiary dark:text-ouro-suave mb-6 justify-center">
                <span aria-hidden="true" className="inline-block w-10 h-px bg-ouro-suave" />
                Enciclopédia de ingredientes
                <span aria-hidden="true" className="inline-block w-10 h-px bg-ouro-suave" />
              </p>
            </StaggerItem>
            <StaggerItem>
              <h1 className="font-headline font-medium text-4xl sm:text-5xl lg:text-[3.8rem] leading-[1.08] tracking-[-0.02em] text-on-background dark:text-stone-100 mb-6">
                Comida de verdade,{' '}
                <em className="italic text-primary dark:text-emerald-400">nome e sobrenome.</em>
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className="text-lg md:text-xl font-light text-on-surface-variant dark:text-stone-400 leading-relaxed">
                Cada alimento tem história, ciência e um papel no seu prato.
                Explore os ingredientes como quem conhece — do nome popular
                ao binômio científico.
              </p>
            </StaggerItem>
          </StaggerReveal>
        </div>
      </section>

      {/* Galeria circular */}
      <section aria-labelledby="galeria-alimentos" className="relative pb-24 md:pb-32">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 mb-4">
          <StaggerReveal className="max-w-2xl">
            <StaggerItem>
              <p className="inline-flex items-center gap-3 text-[0.68rem] tracking-[0.26em] uppercase font-extrabold text-tertiary dark:text-ouro-suave mb-5">
                <span aria-hidden="true" className="inline-block w-10 h-px bg-ouro-suave" />
                Roda de alimentos
              </p>
            </StaggerItem>
            <StaggerItem>
              <h2 id="galeria-alimentos" className="font-headline font-medium text-3xl md:text-4xl leading-[1.12] text-on-background dark:text-stone-100">
                Gire com o scroll, <em className="italic text-primary dark:text-emerald-400">conheça pelo nome.</em>
              </h2>
            </StaggerItem>
          </StaggerReveal>
        </div>

        <div className="h-[480px] md:h-[560px] overflow-hidden">
          <CircularGallery items={ALIMENTOS} radius={520} autoRotateSpeed={0.03} />
        </div>

        {/* CTA para as ferramentas */}
        <div className="text-center mt-6">
          <Link
            to="/ferramentas"
            data-cursor="Ferramentas"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-verde-profundo dark:bg-emerald-500 text-background dark:text-stone-950 font-semibold rounded-full shadow-float-1 hover:shadow-float-2 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
          >
            Consultar dados nutricionais
            <span aria-hidden="true" className="material-symbols-outlined text-[17px]">arrow_forward</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
