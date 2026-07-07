import { Link } from 'react-router-dom';
import { StaggerReveal, StaggerItem } from '../../ui/StaggerReveal';
import { RevealText } from '../../ui/text-animations';
import { MagneticButton } from '../../ui/MagneticButton';
import { MoveRight } from 'lucide-react';

// ============================================================
// SobrePublicacoes — teaser "Publicações" (RevealText Interativo).
// Substitui a grade simples por uma frase gigante onde as
// palavras-chave revelam uma prévia (imagem) no hover.
// ============================================================

// Os e-books não têm capa fotografada por tema (ver ebooks-data.ts) —
// a mesma prévia real ilustra os três gatilhos, sem inventar capas.
const PREVIEW_IMAGE = '/transformation-journal.png';

export function SobrePublicacoes() {
  const triggerWords = [
    { word: 'Emagrecimento', imageSrc: PREVIEW_IMAGE },
    { word: 'Intestino', imageSrc: PREVIEW_IMAGE },
    { word: 'Performance', imageSrc: PREVIEW_IMAGE },
  ];

  return (
    <section aria-labelledby="publicacoes" className="py-32 md:py-48 bg-stone-900 text-stone-100 overflow-hidden relative">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center text-center">
        
        <StaggerReveal className="mb-12">
          <StaggerItem>
            <p className="inline-flex items-center justify-center gap-3 text-[0.65rem] tracking-[0.26em] uppercase font-bold text-ouro-suave mb-8">
              <span aria-hidden="true" className="inline-block w-8 h-[1px] bg-ouro-suave/50" />
              Acervo Aberto
              <span aria-hidden="true" className="inline-block w-8 h-[1px] bg-ouro-suave/50" />
            </p>
          </StaggerItem>
          
          <StaggerItem>
            {/* O TEXTO CRIATIVO COM HOVER */}
            <h2 id="publicacoes" className="font-headline font-medium text-4xl md:text-5xl lg:text-[4.5rem] leading-[1.1] text-white max-w-4xl mx-auto">
              O conhecimento muda tudo. Descubra nossas publicações gratuitas sobre <br className="hidden md:block" />
              <RevealText 
                text="Emagrecimento, Intestino e Performance." 
                triggerWords={triggerWords}
                className="font-headline italic text-verde-nevoa/90 mt-2"
              />
            </h2>
          </StaggerItem>
        </StaggerReveal>

        <StaggerReveal delay={0.4}>
          <StaggerItem>
            <p className="text-stone-400 font-light text-xl max-w-xl mx-auto leading-relaxed mb-12">
              Passe o mouse sobre os temas acima para espiar nossas edições. O download é por nossa conta.
            </p>
          </StaggerItem>
          <StaggerItem>
            <MagneticButton as="div" className="inline-block">
              <Link 
                to="/artigos" 
                className="inline-flex items-center justify-center gap-3 bg-white text-stone-900 rounded-full py-4 px-8 font-semibold tracking-wide uppercase text-sm hover:bg-ouro-suave transition-colors duration-500"
              >
                Acessar Biblioteca <MoveRight size={18} />
              </Link>
            </MagneticButton>
          </StaggerItem>
        </StaggerReveal>

      </div>

      {/* Abstract Background Elements */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-verde-profundo/20 rounded-full blur-[150px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-ouro-suave/10 rounded-full blur-[180px] translate-y-1/3 translate-x-1/3 pointer-events-none" />
    </section>
  );
}
