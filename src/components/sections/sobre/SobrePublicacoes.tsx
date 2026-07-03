import { Link } from 'react-router-dom';
import { StaggerReveal, StaggerItem } from '../../ui/StaggerReveal';
import { PerspectiveBook, BookTitle, BookDescription } from '../../ui/PerspectiveBook';
import { EBOOKS } from '../../ebooks/ebooks-data';

// ============================================================
// SobrePublicacoes — teaser "Publicações" (blueprint 21st.dev,
// Perspective Book). Materializa os e-books REAIS do projeto
// (ebooks-data.ts) num objeto tátil; o download completo com
// captura de lead vive em /artigos — aqui é só a vitrine.
// ============================================================

export function SobrePublicacoes() {
  return (
    <section aria-labelledby="publicacoes" className="max-w-[1280px] mx-auto px-6 md:px-12 pb-24 md:pb-32">
      <StaggerReveal className="max-w-2xl mb-12 md:mb-16">
        <StaggerItem>
          <p className="inline-flex items-center gap-3 text-[0.68rem] tracking-[0.26em] uppercase font-extrabold text-tertiary dark:text-ouro-suave mb-5">
            <span aria-hidden="true" className="inline-block w-10 h-px bg-ouro-suave" />
            Publicações
          </p>
        </StaggerItem>
        <StaggerItem>
          <h2 id="publicacoes" className="font-headline font-medium text-3xl md:text-4xl leading-[1.12] text-on-background dark:text-stone-100">
            Conhecimento que <em className="italic text-primary dark:text-emerald-400">cabe no bolso.</em>
          </h2>
        </StaggerItem>
      </StaggerReveal>

      <StaggerReveal className="flex flex-wrap gap-10 md:gap-16 items-start" staggerInterval={0.12}>
        {EBOOKS.map((ebook) => (
          <StaggerItem key={ebook.id}>
            <Link to="/artigos" data-cursor="Baixar" className="block">
              <PerspectiveBook size="default">
                <BookTitle className="text-on-background dark:text-stone-100 text-sm">{ebook.title}</BookTitle>
                <BookDescription className="text-on-surface-variant dark:text-stone-400">E-book gratuito</BookDescription>
              </PerspectiveBook>
            </Link>
          </StaggerItem>
        ))}
      </StaggerReveal>

      <p className="mt-10 text-sm text-on-surface-variant dark:text-stone-400">
        <Link to="/artigos" className="font-semibold text-on-background dark:text-stone-200 border-b border-ouro-suave pb-0.5 hover:border-tertiary transition-colors">
          Baixar gratuitamente
        </Link>
        {' '}na página de Publicações.
      </p>
    </section>
  );
}
