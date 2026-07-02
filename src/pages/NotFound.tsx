import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Página 404 dedicada: URLs inválidas deixam de "funcionar" silenciosamente
// como Home (o que confundia crawlers e usuários).
export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>Página não encontrada | NutriJornada 360º</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <section className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center">
        <p className="font-serif text-7xl font-semibold text-primary">404</p>
        <h1 className="text-2xl font-semibold">Essa página não existe (ou mudou de lugar).</h1>
        <p className="max-w-md text-stone-500 dark:text-stone-400">
          O endereço que você tentou acessar não corresponde a nenhuma página do site.
        </p>
        <Link
          to="/"
          className="rounded-full bg-primary px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
        >
          Voltar para a página inicial
        </Link>
      </section>
    </>
  );
}
