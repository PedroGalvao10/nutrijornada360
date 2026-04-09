import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { StaggerReveal, StaggerItem } from '../components/ui/StaggerReveal';

interface ArticlePost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image_url: string;
  hat?: string;
  tag?: string;
  published_at?: string;
  created_at?: string;
  reading_time?: number;
  author_name?: string;
}

export default function ArtigoDetalhe() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<ArticlePost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    
    fetch(`/api/articles/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error("Artigo não encontrado");
        return res.json();
      })
      .then(data => {
        setPost(data);
      })
      .catch(err => {
        console.error("Erro ao carregar o artigo detalhado:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-[80px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-on-surface-variant font-medium animate-pulse">Carregando conhecimento...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 pt-[80px]">
        <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">find_in_page</span>
        <h1 className="text-3xl font-headline font-bold text-on-surface mb-2">Artigo não encontrado</h1>
        <p className="text-on-surface-variant mb-8 text-center max-w-md">Parece que este conteúdo foi movido ou ainda não está disponível.</p>
        <Link to="/blog" className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold shadow-md hover:scale-105 transition-all">
          Voltar para o Blog
        </Link>
      </div>
    );
  }

  const dateObj = new Date(post.published_at || post.created_at || '');
  const formattedDate = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    : '';

  return (
    <main className="bg-background min-h-screen pt-[80px]">
      <SEO 
        title={`${post.title} | Blog Mariana Bermudes`}
        description={post.excerpt || "Leia o artigo completo no blog da nutricionista Mariana Bermudes."}
        ogImage={post.cover_image_url}
        article={true}
      />

      {/* Hero do Artigo */}
      <header className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden border-b border-outline/10">
        <div className="absolute inset-0 z-0">
           <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/30 z-10"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-20 h-full flex flex-col justify-end pb-12">
            <StaggerReveal>
              <StaggerItem>
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 backdrop-blur-md rounded-full text-[10px] font-bold tracking-widest uppercase mb-6 border border-primary/30 text-primary w-fit">
                  <span className="material-symbols-outlined text-xs">label</span>
                  {post.hat || post.tag || 'Nutrição'}
               </div>
              </StaggerItem>
              
              <StaggerItem>
               <h1 className="text-3xl md:text-5xl lg:text-6xl font-headline font-bold text-on-surface mb-6 leading-[1.1]">
                  {post.title}
               </h1>
              </StaggerItem>

              <StaggerItem>
               <div className="flex flex-wrap items-center gap-6 text-on-surface-variant font-medium text-sm">
                  <div className="flex items-center gap-2">
                     <div className="w-8 h-8 rounded-full bg-surface-container border border-outline/20 overflow-hidden">
                        <img src="/avatar-mariana.jpg" alt="Mariana Bermudes" className="w-full h-full object-cover" />
                     </div>
                     <span>{post.author_name || 'Mariana Bermudes'}</span>
                  </div>
                  <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">calendar_today</span> {formattedDate}</span>
                  <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">schedule</span> {post.reading_time || 5} min de leitura</span>
               </div>
              </StaggerItem>
            </StaggerReveal>
        </div>
      </header>

      {/* Conteúdo do Artigo */}
      <section className="py-16 md:py-24 px-6 max-w-4xl mx-auto">
        <StaggerReveal>
          <StaggerItem>
            <div 
              className="prose prose-lg prose-headings:font-headline prose-headings:font-bold prose-p:text-on-surface-variant prose-p:leading-relaxed prose-img:rounded-3xl prose-strong:text-on-surface max-w-none text-on-surface-variant mb-20"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </StaggerItem>

          {/* Rodapé do Artigo */}
          <StaggerItem>
            <footer className="pt-12 border-t border-outline/10 flex flex-col md:flex-row justify-between items-center gap-8">
               <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-16 h-16 rounded-3xl bg-surface-container border border-outline/20 overflow-hidden relative shadow-md group-hover:shadow-lg transition-all duration-300">
                     <img src="/avatar-mariana.jpg" alt="Mariana Bermudes" className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-500" />
                  </div>
                  <div className="text-left">
                     <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Escrito por</p>
                     <h4 className="text-xl font-headline font-bold text-on-surface">Mariana Bermudes</h4>
                     <p className="text-xs text-on-surface-variant">Nutricionista Comportamental | CRN-x 12345</p>
                  </div>
               </div>

               <div className="flex items-center gap-3">
                  <p className="text-sm font-bold text-on-surface-variant uppercase tracking-tighter mr-2">Compartilhar:</p>
                  <button 
                    onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${post.title} - ${window.location.href}`)}`, '_blank')}
                    className="w-12 h-12 rounded-full border border-outline/20 flex items-center justify-center hover:bg-surface-container hover:text-primary transition-all active:scale-95 shadow-sm"
                    aria-label="Compartilhar no WhatsApp"
                  >
                    <i className="fa-brands fa-whatsapp text-lg"></i>
                  </button>
                  <button 
                    onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                    className="w-12 h-12 rounded-full border border-outline/20 flex items-center justify-center hover:bg-surface-container hover:text-primary transition-all active:scale-95 shadow-sm"
                    aria-label="Compartilhar no LinkedIn"
                  >
                    <i className="fa-brands fa-linkedin-in text-lg"></i>
                  </button>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Link copiado para a área de transferência!");
                    }}
                    className="w-12 h-12 rounded-full border border-outline/20 flex items-center justify-center hover:bg-surface-container hover:text-primary transition-all active:scale-95 shadow-sm"
                    aria-label="Copiar link"
                  >
                    <span className="material-symbols-outlined text-lg">link</span>
                  </button>
               </div>
            </footer>
          </StaggerItem>

          <StaggerItem>
            <div className="mt-16 flex justify-center">
               <Link to="/blog" className="inline-flex items-center gap-2 text-on-surface-variant font-bold hover:text-primary transition-all border-b-2 border-transparent hover:border-primary pb-1 group">
                  <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
                  Voltar para o índice de artigos
               </Link>
            </div>
          </StaggerItem>
        </StaggerReveal>
      </section>
    </main>
  );
}
