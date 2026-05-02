import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Article } from '../article_types';
import SEO from '../components/SEO';
import { StaggerReveal, StaggerItem } from '../components/ui/StaggerReveal';
import { MagneticButton } from '../components/ui/MagneticButton';


export default function ArtigoDetalhe() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Article | null>(null);
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
      <div className="min-h-screen bg-background dark:bg-stone-950 flex items-center justify-center pt-40">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 dark:border-emerald-500/20 border-t-primary dark:border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-on-surface-variant dark:text-stone-300 font-medium animate-pulse">Carregando conhecimento...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background dark:bg-stone-950 flex flex-col items-center justify-center px-6 pt-40">
        <span className="material-symbols-outlined text-6xl text-outline-variant dark:text-stone-600 mb-4">find_in_page</span>
        <h1 className="text-3xl font-headline font-bold text-on-surface dark:text-stone-100 mb-2">Artigo não encontrado</h1>
        <p className="text-on-surface-variant dark:text-stone-400 mb-8 text-center max-w-md">Parece que este conteúdo foi movido ou ainda não está disponível.</p>
        <MagneticButton as="div">
          <Link to="/artigos" className="bg-primary dark:bg-emerald-500 text-on-primary dark:text-stone-950 px-8 py-3 rounded-full font-bold shadow-md hover:scale-105 transition-all block">
            Voltar para o Blog
          </Link>
        </MagneticButton>
      </div>
    );
  }

  const dateObj = new Date(post.published_at || post.created_at || '');
  const formattedDate = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    : '';

  return (
    <main className="bg-background dark:bg-stone-950 min-h-screen pt-40">
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
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 dark:bg-emerald-500/20 backdrop-blur-md rounded-full text-[10px] font-bold tracking-widest uppercase mb-6 border border-primary/30 dark:border-emerald-400/30 text-primary dark:text-emerald-400 w-fit">
                  <span className="material-symbols-outlined text-xs">label</span>
                  {post.hat || 'Nutrição'}
               </div>
              </StaggerItem>
              
              <StaggerItem>
               <h1 className="text-3xl md:text-5xl lg:text-6xl font-headline font-bold text-on-surface dark:text-stone-100 mb-6 leading-[1.1]">
                  {post.title}
               </h1>
              </StaggerItem>

              <StaggerItem>
               <div className="flex flex-wrap items-center gap-6 text-on-surface-variant dark:text-stone-300 font-medium text-sm">
                  <div className="flex items-center gap-2">
                     <div className="w-8 h-8 rounded-full bg-surface-container dark:bg-stone-800 border border-outline/20 dark:border-stone-700 overflow-hidden">
                        <img src="/avatar-mariana.webp" alt="Mariana Bermudes" className="w-full h-full object-cover" />
                     </div>
                     <span>Mariana Bermudes</span>
                  </div>
                  <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">calendar_today</span> {formattedDate}</span>
                  <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">schedule</span> {post.reading_time ? `${post.reading_time} min de leitura` : ''}</span>
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
              className="prose prose-lg dark:prose-invert prose-headings:font-headline prose-headings:dark:text-stone-100 prose-headings:font-bold prose-p:text-on-surface-variant prose-p:dark:text-stone-300 prose-p:leading-relaxed prose-img:rounded-3xl prose-strong:text-on-surface prose-strong:dark:text-stone-100 max-w-none text-on-surface-variant dark:text-stone-300 mb-20"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </StaggerItem>

          {/* Rodapé do Artigo */}
          <StaggerItem>
            <footer className="pt-12 border-t border-outline/10 dark:border-stone-800 flex flex-col md:flex-row justify-between items-center gap-8">
               <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-16 h-16 rounded-3xl bg-surface-container dark:bg-stone-800 border border-outline/20 dark:border-stone-700 overflow-hidden relative shadow-md group-hover:shadow-lg transition-all duration-300">
                     <img src="/avatar-mariana.webp" alt="Mariana Bermudes" className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-500" />
                  </div>
                  <div className="text-left">
                     <p className="text-xs font-bold text-primary dark:text-emerald-400 uppercase tracking-widest mb-1">Escrito por</p>
                     <h4 className="text-xl font-headline font-bold text-on-surface dark:text-stone-100">Mariana Bermudes</h4>
                     <p className="text-xs text-on-surface-variant dark:text-stone-400">Nutricionista Comportamental | CRN-x 12345</p>
                  </div>
               </div>

               <div className="flex items-center gap-3">
                  <p className="text-sm font-bold text-on-surface-variant dark:text-stone-300 uppercase tracking-tighter mr-2">Compartilhar:</p>
                  <button 
                    onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${post.title} - ${window.location.href}`)}`, '_blank')}
                    className="w-12 h-12 rounded-full border border-outline/20 dark:border-stone-700 dark:text-stone-300 flex items-center justify-center hover:bg-surface-container dark:hover:bg-stone-800 hover:text-primary dark:hover:text-emerald-400 transition-all active:scale-95 shadow-sm"
                    aria-label="Compartilhar no WhatsApp"
                  >
                    <i className="fa-brands fa-whatsapp text-lg"></i>
                  </button>
                  <button 
                    onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                    className="w-12 h-12 rounded-full border border-outline/20 dark:border-stone-700 dark:text-stone-300 flex items-center justify-center hover:bg-surface-container dark:hover:bg-stone-800 hover:text-primary dark:hover:text-emerald-400 transition-all active:scale-95 shadow-sm"
                    aria-label="Compartilhar no LinkedIn"
                  >
                    <i className="fa-brands fa-linkedin-in text-lg"></i>
                  </button>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Link copiado para a área de transferência!");
                    }}
                    className="w-12 h-12 rounded-full border border-outline/20 dark:border-stone-700 dark:text-stone-300 flex items-center justify-center hover:bg-surface-container dark:hover:bg-stone-800 hover:text-primary dark:hover:text-emerald-400 transition-all active:scale-95 shadow-sm"
                    aria-label="Copiar link"
                  >
                    <span className="material-symbols-outlined text-lg">link</span>
                  </button>
               </div>
            </footer>
          </StaggerItem>

          <StaggerItem>
            <div className="mt-16 flex justify-center">
               <Link to="/blog" className="inline-flex items-center gap-2 text-on-surface-variant dark:text-stone-300 font-bold hover:text-primary dark:hover:text-emerald-400 transition-all border-b-2 border-transparent hover:border-primary dark:hover:border-emerald-400 pb-1 group">
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
