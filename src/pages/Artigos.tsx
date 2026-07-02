import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { Article } from '../article_types';
import { useDynamicShadow } from '../hooks/useDynamicShadow';
import { TypewriterText } from '../components/TypewriterText';
import { StaggerReveal, StaggerItem } from '../components/ui/StaggerReveal';
import SEO from '../components/SEO';
import { MagneticButton } from '../components/ui/MagneticButton';
import ArticleCard from '../components/ui/ArticleCard';
import { HeroAnimatedImages } from '../components/ui/HeroAnimatedImages';
import { EbookCard } from '../components/ebooks/EbookCard';
import { EbookLeadModal } from '../components/ebooks/EbookLeadModal';
import { EBOOKS, EMPTY_LEAD_FORM, type Ebook } from '../components/ebooks/ebooks-data';

export default function Artigos() {
  const [posts, setPosts] = useState<Article[]>([]);

  useDynamicShadow();

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

  const ebooks = EBOOKS;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEbook, setSelectedEbook] = useState<Ebook | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState(EMPTY_LEAD_FORM);

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
            setFormData(EMPTY_LEAD_FORM);
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
    <div className="animate-fade-in bg-background/50 dark:bg-stone-950/50 min-h-screen relative pt-24 md:pt-32">

      <SEO 
        title="Blog e Conteúdos | Mariana Bermudes Nutrição"
        description="Acesse artigos científicos, guias práticos e e-books gratuitos sobre nutrição comportamental, emagrecimento e saúde integral."
      />
      
      {/* ═══ Hero Section Artigos ═══ */}
      <section id="video-artigos-container" className="relative min-h-[60vh] md:h-[75vh] w-full overflow-hidden flex items-center border-b border-outline/10 bg-background/30 dark:bg-stone-950/30 backdrop-blur-sm">
        {/* Subtle Gradient Overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 dark:via-stone-950/40 to-background dark:to-stone-950 z-10 pointer-events-none"></div>
        
        <div className="w-full px-6 md:px-12 relative z-20 mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <StaggerReveal className="md:py-12">
                <StaggerItem>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-8 border border-primary/30 dark:border-emerald-500/30 text-primary dark:text-emerald-400 bg-primary/5 dark:bg-emerald-500/5 backdrop-blur-md">
                    <span className="material-symbols-outlined text-sm">menu_book</span>
                    Publicações & Ciência
                  </div>
                </StaggerItem>
                
                <StaggerItem>
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-[1.1] font-headline text-on-surface dark:text-stone-100 tracking-tight">
                    Nutrição com Ciência<br /> 
                    <span className="relative inline-block">
                      <span className="relative z-10">e </span>
                      <span className="text-primary dark:text-emerald-400 italic font-serif">Consciência</span>
                      <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/10 dark:bg-emerald-500/10 -z-10 rotate-1"></span>
                    </span>
                  </h1>
                </StaggerItem>
                
                <StaggerItem>
                  <div className="text-lg md:text-2xl leading-relaxed font-body font-medium text-on-surface-variant dark:text-stone-300 max-w-xl mx-auto lg:mx-0">
                    <TypewriterText text="Explore conteúdos baseados em evidências, reflexões sobre comportamento alimentar e estratégias para uma vida equilibrada." speed={20} delay={600} />
                  </div>
                </StaggerItem>
              </StaggerReveal>
            </div>
            
            <div className="w-full lg:w-1/2 max-w-md mx-auto lg:max-w-full flex justify-center lg:justify-end mt-8 lg:mt-0">
              <div className="w-full h-full max-w-[500px]">
                <HeroAnimatedImages />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid de Artigos */}
      <section className="py-20 px-6 w-full md:px-12 relative z-10">
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
      <section className="py-20 px-6 bg-surface-variant/40 dark:bg-stone-900/40 relative z-10 backdrop-blur-sm">
        <div className="w-full px-6 md:px-12">
          <StaggerReveal className="text-center mb-12">
             <StaggerItem>
               <h2 className="text-3xl md:text-5xl font-headline font-bold text-on-surface dark:text-stone-100 mb-4">E-books Gratuitos</h2>
             </StaggerItem>
             <StaggerItem>
               <p className="text-on-surface-variant dark:text-stone-300 md:text-lg max-w-2xl mx-auto">Baixe nossos materiais exclusivos e aprofunde seus conhecimentos em nutrição prática e bem-estar.</p>
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
      <section className="bg-surface-container/60 dark:bg-stone-900/60 backdrop-blur-md py-20 px-6 relative overflow-hidden z-10">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 dark:via-emerald-500/20 to-transparent"></div>
        <StaggerReveal className="max-w-4xl mx-auto text-center">
          <StaggerItem>
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-on-surface dark:text-stone-100 mb-6">Assine a nossa Newsletter</h2>
          </StaggerItem>
          <StaggerItem>
            <p className="text-on-surface-variant dark:text-stone-300 mb-10 text-lg md:text-xl max-w-2xl mx-auto">Receba novos artigos, materiais de nutrição comportamental e atualizações diretamente no seu e-mail.</p>
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
                className="flex-1 bg-surface border-2 border-outline-variant/60 px-6 py-4 rounded-full text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-base hover:border-outline shadow-sm dark:bg-stone-950 dark:border-stone-700 dark:text-stone-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-400 dark:hover:border-stone-500" 
                required 
                disabled={newsletterSubmitting}
              />
              <MagneticButton as="div">
                <button 
                  type="submit" 
                  disabled={newsletterSubmitting}
                  className="bg-primary text-on-primary dark:bg-emerald-500 dark:text-stone-950 font-bold px-8 py-4 rounded-full hover:bg-opacity-90 dark:hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 hover:scale-105 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 w-full"
                >
                  {newsletterSubmitting ? (
                     <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                  ) : (
                     <>Inscrever-se <span className="material-symbols-outlined text-lg">rocket_launch</span></>
                  )}
                </button>
              </MagneticButton>
            </form>
          </StaggerItem>
        </StaggerReveal>
      </section>

      <EbookLeadModal
        isOpen={isModalOpen}
        ebook={selectedEbook}
        formData={formData}
        setFormData={setFormData}
        isSubmitting={isSubmitting}
        successMessage={successMessage}
        isValidForm={isValidForm}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        onGoalToggle={handleGoalToggle}
      />
    </div>
  );
}
