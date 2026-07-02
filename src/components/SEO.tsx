import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://marianabermudes.com.br';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterHandle?: string;
  article?: boolean;
}

export default function SEO({
  title = "Mariana Bermudes | Nutricionista em São Paulo",
  description = "Nutrição personalizada e humanizada com Mariana Bermudes. Emagrecimento, hipertrofia e saúde intestinal. Agende sua consulta em São Paulo ou online.",
  canonical,
  ogImage = "/og-image.jpg",
  ogType = "website",
  twitterHandle = "@marianabermudes",
  article = false
}: SEOProps) {
  const { pathname } = useLocation();
  const fullTitle = title.includes("Mariana Bermudes") ? title : `${title} | Mariana Bermudes`;
  const finalOgType = article ? "article" : ogType;
  // Canonical por rota (BrowserRouter): raiz sem barra final, demais com o path real
  const finalCanonical = canonical ?? `${SITE_URL}${pathname === '/' ? '/' : pathname}`;
  // Crawlers de preview social exigem URL absoluta na imagem
  const absoluteOgImage = ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`;

  return (
    <Helmet>
      {/* Base Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={finalCanonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={finalOgType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteOgImage} />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:site_name" content="Mariana Bermudes Nutrição" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteOgImage} />

      {/* Security & Performance */}
      <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
    </Helmet>
  );
}
