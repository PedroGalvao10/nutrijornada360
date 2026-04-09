import { useRef, useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import Spline from '@splinetool/react-spline';
import { useDynamicShadow } from '../hooks/useDynamicShadow';
import { TypewriterText } from '../components/TypewriterText';
import { Link } from 'react-router-dom';
import { useTilt } from '../hooks/useTilt';
import { StaggerReveal, StaggerItem } from '../components/ui/StaggerReveal';
import SEO from '../components/SEO';

interface Ebook {
  id: number;
  title: string;
  imageUrl: string;
  pdfUrl: string;
}

interface ArticlePost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string;
  hat?: string;
  tag?: string;
  published_at?: string;
  created_at?: string;
  reading_time?: number;
  imageUrl?: string;
  readTime?: string;
  date?: string;
  image_alt?: string;
}

function ArticleCard({ post }: { post: ArticlePost }) {
  const cardRef = useRef<HTMLElement>(null);
  useTilt(cardRef, 12);

  const dateStr = post.published_at || post.created_at || '';
  const dateObj = new Date(dateStr);
  const formattedDate = !isNaN(dateObj.getTime()) 
                         ? dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) 
                         : (post.date || '');

  return (
    <article 
      ref={cardRef}
      className="group flex flex-col bg-surface rounded-3xl overflow-hidden parallax-shadow transition-all duration-500 border border-outline/10 cursor-pointer h-full transform-style-3d"
    >
      <div className="relative h-64 overflow-hidden tilt-child tz-20">
        <img src={post.cover_image_url || post.imageUrl} alt={post.image_alt || `Capa do artigo: ${post.title}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
        <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-wider text-primary shadow-sm border border-white/20 uppercase tilt-child tz-30">
          {post.hat || post.tag}
        </div>
      </div>
      <div className="p-8 flex flex-col flex-grow tilt-child tz-10">
        <header>
          <div className="flex items-center gap-4 text-xs text-on-surface-variant font-medium mb-4">
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">calendar_today</span> {formattedDate}</span>
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span> {post.reading_time ? `${post.reading_time} min de leitura` : post.readTime}</span>
          </div>
          <h2 className="text-2xl font-headline font-bold text-on-surface mb-3 group-hover:text-primary transition-colors leading-snug">
            <Link to={`/blog/${post.slug}`} className="focus:outline-none focus:underline" aria-label={`Ler artigo: ${post.title}`}>
              {post.title}
            </Link>
          </h2>
        </header>
        <div className="text-on-surface-variant text-sm flex-grow mb-6 leading-relaxed">
          <p>{post.excerpt}</p>
        </div>
        <footer className="mt-auto">
          <Link to={`/blog/${post.slug}`} className="inline-flex items-center text-primary font-bold text-sm group-hover:translate-x-1 transition-transform" aria-label={`Ler mais sobre: ${post.title}`}>
            Ler artigo completo <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
          </Link>
        </footer>
      </div>
    </article>
  );
}

function EbookCard({ ebook, onDownload }: { ebook: Ebook, onDownload: (ebook: Ebook) => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  useTilt(cardRef, 15);

  return (
    <div 
      ref={cardRef}
      className="bg-surface border border-outline/10 p-6 rounded-3xl flex flex-col sm:flex-row gap-6 items-center parallax-shadow hover:shadow-lg transition-shadow duration-300 transform-style-3d"
    >
      <div className="w-40 h-52 flex-shrink-0 bg-surface-container rounded-lg overflow-hidden border border-outline/20 relative tilt-child tz-30 shadow-md">
        <img src={ebook.imageUrl} alt={`Capa ${ebook.title}`} className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2 bg-secondary text-on-secondary text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest shadow-sm">PDF</div>
      </div>
      <div className="flex flex-col flex-1 text-center sm:text-left tilt-child tz-10">
        <h3 className="text-xl font-headline font-bold text-on-surface mb-3">{ebook.title}</h3>
        <p className="text-sm text-on-surface-variant mb-6">Um guia prático com passos eficientes desenhados para a sua rotina diária.</p>
        <button 
          onClick={() => onDownload(ebook)}
          className="bg-primary text-on-primary font-bold px-6 py-3 rounded-full hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-auto w-full sm:w-auto self-start shadow-sm active:scale-[0.98] tilt-child tz-20"
        >
          <span className="material-symbols-outlined text-[18px]">download</span> Baixar Grátis
        </button>
      </div>
    </div>
  );
}

export default function Artigos() {
  const [posts, setPosts] = useState<ArticlePost[]>([]);
  const splineAreaRef = useRef<HTMLDivElement>(null);
  const [splineApp, setSplineApp] = useState<{ play?: () => void, stop?: () => void } | null>(null);

  useDynamicShadow();

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

  // Busca os posts dinâmicos do banco
  useEffect(() => {
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPosts(data);
        }
      })
      .catch(err => console.error("Erro ao carregar os artigos:", err));
  }, []);

  const ebooks: Ebook[] = [
    {
      id: 1,
      title: "Guia Completo: Nutrição Descomplicada O Ano Todo",
      imageUrl: "https://images.unsplash.com/photo-1515023115689-589c33041d3c?auto=format&fit=crop&w=400&q=80",
      pdfUrl: "#", // placeholder
    },
    {
      id: 2,
      title: "10 Receitas Rápidas e Saudáveis",
      imageUrl: "https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&w=400&q=80",
      pdfUrl: "#", // placeholder
    }
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEbook, setSelectedEbook] = useState<Ebook | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    goals: [] as string[],
    consentMarketing: false,
    consentNewsletter: false
  });

  const GOAL_OPTIONS = [
    "Perda de peso", 
    "Ganho de massa muscular", 
    "Melhora do sono", 
    "Saúde intestinal", 
    "Equilíbrio hormonal", 
    "Redução do estresse", 
    "Alimentação saudável", 
    "Outro"
  ];

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal) 
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const isValidForm = formData.name.trim() !== '' && 
                      formData.email.trim() !== '' && 
                      formData.goals.length > 0 && 
                      formData.consentMarketing;

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);

  // Função centralizada para envio de leads via Proxy
  const sendLeadData = async (payload: Record<string, unknown>) => {
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        console.log("[Lead] Dados registrados no servidor.");
        return true;
      }
      return false;
    } catch (err) {
      console.error("[Lead] Erro ao registrar lead:", err);
      return false;
    }
  };

  const handleOpenModal = (ebook: Ebook) => {
    const savedEmail = localStorage.getItem('ebook_user_email');
    if (savedEmail) {
      // PING para o servidor mesmo para usuários conhecidos
      sendLeadData({
        email: savedEmail,
        ebookName: ebook.title,
        timestamp: new Date().toISOString(),
        isReturningUser: true
      });
      triggerDownload(ebook);
    } else {
      setSelectedEbook(ebook);
      setIsModalOpen(true);
      setSuccessMessage("");
    }
  };

  const triggerDownload = (ebook: Ebook) => {
    if (ebook.pdfUrl !== "#") {
        const link = document.createElement('a');
        link.href = ebook.pdfUrl;
        link.download = `${ebook.title}.pdf`;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        alert("Baixando mock de PDF: " + ebook.title);
    }
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValidForm) return;

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        goals: formData.goals,
        consentMarketing: formData.consentMarketing,
        consentNewsletter: formData.consentNewsletter,
        ebookName: selectedEbook?.title,
        timestamp: new Date().toISOString()
      };

      await sendLeadData(payload);
      
      localStorage.setItem('ebook_user_email', formData.email);
      setSuccessMessage("Cadastro realizado com sucesso! Seu download começará em instantes.");
      
      setTimeout(() => {
        if (selectedEbook) triggerDownload(selectedEbook);
        setTimeout(() => {
            setIsModalOpen(false);
            setSuccessMessage("");
            setFormData({ name: '', email: '', goals: [], consentMarketing: false, consentNewsletter: false });
        }, 1500); 
      }, 1000);

    } catch (err) {
      console.error(err);
      alert("Ocorreu um erro ao salvar seu cadastro. Mas não se preocupe, você ainda pode baixar seu material.");
      if (selectedEbook) triggerDownload(selectedEbook);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewsletterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    setNewsletterSubmitting(true);
    try {
      await sendLeadData({
        email: newsletterEmail,
        consentNewsletter: true,
        consentMarketing: true,
        isNewsletterOnly: true,
        timestamp: new Date().toISOString()
      });
      alert("Inscrição na Newsletter realizada com sucesso! Obrigado.");
      setNewsletterEmail("");
    } finally {
      setNewsletterSubmitting(false);
    }
  };

  return (
    <main className="animate-fade-in bg-background min-h-screen relative pt-[80px]">
      <SEO 
        title="Blog e Conteúdos | Mariana Bermudes Nutrição"
        description="Acesse artigos científicos, guias práticos e e-books gratuitos sobre nutrição comportamental, emagrecimento e saúde integral."
      />
      
      {/* ═══ Hero Section Artigos (Spline 3D) ═══ */}
      <section id="video-artigos-container" className="relative h-[65vh] md:h-[85vh] w-full bg-black overflow-hidden border-b border-outline/10">
        <div ref={splineAreaRef} className="absolute inset-0 flex items-center">

          {/* ── Background Spline Render ── */}
          <div className="absolute inset-0 z-0 transform-gpu overflow-hidden bg-black flex items-center justify-center">
            <Spline 
              scene="https://prod.spline.design/CHa5UVfCBrHzmeFt/scene.splinecode" 
              onLoad={(spline) => {
                spline.setBackgroundColor('#000000');
                setSplineApp(spline);
              }}
              className="w-[120%] h-[120%] scale-110 md:scale-[1.25] origin-center cursor-pointer"
            />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-20 w-full text-center md:text-left">
            <StaggerReveal className="max-w-3xl md:py-12">
              <StaggerItem>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-white/30 text-white">
                  <span className="material-symbols-outlined text-sm">menu_book</span>
                  Publicações
                </div>
              </StaggerItem>
              
              <StaggerItem>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight font-headline text-white drop-shadow-2xl">
                  Nutrição com Ciência<br /> e <span className="text-white/95 italic uppercase md:normal-case">Consciência</span>
                </h1>
              </StaggerItem>
              
              <StaggerItem>
                <div className="text-lg md:text-xl leading-relaxed font-body font-medium text-white/90 drop-shadow-lg max-w-xl">
                  <TypewriterText text="Explore conteúdos baseados em evidências, reflexões sobre comportamento alimentar e dicas práticas para transformar sua rotina com saúde." speed={25} delay={400} />
                </div>
              </StaggerItem>
            </StaggerReveal>
          </div>
        </div>
      </section>

      {/* Grid de Artigos */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <StaggerReveal 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          staggerInterval={0.15}
        >
          {posts.map(post => (
            <StaggerItem key={post.id}>
              <ArticleCard post={post} />
            </StaggerItem>
          ))}
        </StaggerReveal>
      </section>

      {/* Seção de E-books Gratuitos */}
      <section className="py-20 px-6 bg-surface-variant/10 relative">
        <div className="max-w-7xl mx-auto">
          <StaggerReveal className="text-center mb-12">
             <StaggerItem>
               <h2 className="text-3xl md:text-5xl font-headline font-bold text-on-surface mb-4">E-books Gratuitos</h2>
             </StaggerItem>
             <StaggerItem>
               <p className="text-on-surface-variant md:text-lg max-w-2xl mx-auto">Baixe nossos materiais exclusivos e aprofunde seus conhecimentos em nutrição prática e bem-estar.</p>
             </StaggerItem>
          </StaggerReveal>
          
          <StaggerReveal 
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            staggerInterval={0.2}
          >
             {ebooks.map(ebook => (
               <StaggerItem key={ebook.id}>
                 <EbookCard ebook={ebook} onDownload={handleOpenModal} />
               </StaggerItem>
             ))}
          </StaggerReveal>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-surface-container py-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        <StaggerReveal className="max-w-4xl mx-auto text-center">
          <StaggerItem>
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-on-surface mb-6">Assine a nossa Newsletter</h2>
          </StaggerItem>
          <StaggerItem>
            <p className="text-on-surface-variant mb-10 text-lg md:text-xl max-w-2xl mx-auto">Receba novos artigos, materiais de nutrição comportamental e atualizações diretamente no seu e-mail.</p>
          </StaggerItem>
          <StaggerItem>
            <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto" onSubmit={handleNewsletterSubmit}>
              <label htmlFor="newsletter-email" className="sr-only">Seu endereço de e-mail</label>
              <input 
                type="email" 
                id="newsletter-email" 
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Digite seu melhor e-mail" 
                className="flex-1 bg-surface border-2 border-outline-variant/60 px-6 py-4 rounded-full text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-base hover:border-outline shadow-sm" 
                required 
                disabled={newsletterSubmitting}
              />
              <button 
                type="submit" 
                disabled={newsletterSubmitting}
                className="bg-primary text-on-primary font-bold px-8 py-4 rounded-full hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 hover:scale-105 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50"
              >
                {newsletterSubmitting ? (
                   <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                ) : (
                   <>Inscrever-se <span className="material-symbols-outlined text-lg">rocket_launch</span></>
                )}
              </button>
            </form>
          </StaggerItem>
        </StaggerReveal>
      </section>

      {/* MODAL E-BOOK FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => !isSubmitting && setIsModalOpen(false)}></div>
           <div className="bg-surface relative z-10 w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden border border-outline/10 flex flex-col max-h-[90vh]">
              <div className="bg-primary/5 px-8 pt-8 pb-4 border-b border-outline/10 relative shrink-0">
                 <button onClick={() => !isSubmitting && setIsModalOpen(false)} className="absolute top-6 right-6 text-on-surface-variant hover:text-primary transition-colors focus:outline-none">
                    <span className="material-symbols-outlined">close</span>
                 </button>
                 <h3 className="text-2xl font-headline font-bold text-on-surface mb-2 leading-tight">Garantir acesso ao E-book</h3>
                 <p className="text-on-surface-variant text-sm flex items-center gap-2"><span className="material-symbols-outlined text-primary text-[16px]">check_circle</span> "{selectedEbook?.title}"</p>
              </div>

              <div className="p-8 overflow-y-auto custom-scrollbar">
                 {successMessage ? (
                     <div className="flex flex-col items-center justify-center text-center py-8">
                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                           <span className="material-symbols-outlined text-3xl text-primary">task_alt</span>
                        </div>
                        <h4 className="text-xl font-bold text-on-surface mb-2">Quase lá!</h4>
                        <p className="text-on-surface-variant">{successMessage}</p>
                     </div>
                 ) : (
                    <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-on-surface ml-1">Nome Completo *</label>
                        <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-surface-container/50 border border-outline/30 px-4 py-3 rounded-xl text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm" placeholder="Ex: Maria de Souza" required disabled={isSubmitting} />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-on-surface ml-1">E-mail de preferência *</label>
                        <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-surface-container/50 border border-outline/30 px-4 py-3 rounded-xl text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm" placeholder="seu@email.com" required disabled={isSubmitting} />
                      </div>

                      <div className="flex flex-col gap-2.5">
                        <label className="text-sm font-semibold text-on-surface ml-1">Quais são seus Objetivos de Saúde? *</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                          {GOAL_OPTIONS.map(goal => (
                            <button
                              key={goal}
                              type="button"
                              onClick={() => handleGoalToggle(goal)}
                              disabled={isSubmitting}
                              className={`text-left px-4 py-2.5 rounded-xl text-xs font-medium transition-all border ${
                                formData.goals.includes(goal)
                                  ? 'bg-primary/10 border-primary text-primary shadow-sm'
                                  : 'bg-surface-container/30 border-outline/20 text-on-surface-variant hover:border-primary/40'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px]">
                                  {formData.goals.includes(goal) ? 'check_box' : 'check_box_outline_blank'}
                                </span>
                                {goal}
                              </div>
                            </button>
                          ))}
                        </div>
                        <p className="text-[10px] text-on-surface-variant/70 italic ml-1">* Selecione pelo menos uma opção</p>
                      </div>

                      <div className="flex flex-col gap-3 mt-2">
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <div className="relative flex items-center mt-0.5">
                             <input type="checkbox" checked={formData.consentMarketing} onChange={(e) => setFormData({...formData, consentMarketing: e.target.checked})} className="peer w-5 h-5 appearance-none border-2 border-outline rounded-md checked:bg-primary checked:border-primary transition-colors cursor-pointer" required disabled={isSubmitting} />
                             <span className="material-symbols-outlined absolute inset-0 text-white opacity-0 peer-checked:opacity-100 pointer-events-none text-xl leading-[1.2]">check</span>
                          </div>
                          <span className="text-xs text-on-surface-variant leading-relaxed">
                            Concordo em receber e-mails com conteúdos, novidades e comunicações de marketing. *
                          </span>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer group">
                          <div className="relative flex items-center mt-0.5">
                             <input type="checkbox" checked={formData.consentNewsletter} onChange={(e) => setFormData({...formData, consentNewsletter: e.target.checked})} className="peer w-5 h-5 appearance-none border-2 border-outline rounded-md checked:bg-primary checked:border-primary transition-colors cursor-pointer" disabled={isSubmitting} />
                             <span className="material-symbols-outlined absolute inset-0 text-white opacity-0 peer-checked:opacity-100 pointer-events-none text-xl leading-[1.2]">check</span>
                          </div>
                          <span className="text-xs text-on-surface-variant leading-relaxed">
                            Gostaria de me inscrever na Newsletter para receber novos artigos e materiais (opcional).
                          </span>
                        </label>
                      </div>

                      <button type="submit" disabled={!isValidForm || isSubmitting} className="mt-4 w-full bg-primary text-on-primary font-bold py-4 rounded-xl shadow-md transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2">
                         {isSubmitting ? (
                            <span className="material-symbols-outlined animate-spin">progress_activity</span>
                         ) : (
                            <>Confirmar e Liberar Download <span className="material-symbols-outlined text-[18px]">download</span></>
                         )}
                      </button>
                    </form>
                 )}
              </div>
           </div>
        </div>
      )}
    </main>
  );
}
