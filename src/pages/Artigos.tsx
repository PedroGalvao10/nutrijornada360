import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { Article } from '../article_types';
import { StaggerReveal, StaggerItem } from '../components/ui/StaggerReveal';
import SEO from '../components/SEO';
import { MagneticButton } from '../components/ui/MagneticButton';
import ArticleCard from '../components/ui/ArticleCard';
import { EbookCard } from '../components/ebooks/EbookCard';
import { EbookLeadModal } from '../components/ebooks/EbookLeadModal';
import { EBOOKS, EMPTY_LEAD_FORM, type Ebook } from '../components/ebooks/ebooks-data';

// ============================================================
// Artigos — página de publicações na direção "Editorial Orgânico".
// A lógica de leads/e-books/newsletter permanece intacta; apenas
// a apresentação segue o sistema (eyebrow ouro, display Lora,
// faixas creme-2 e verde-profundo).
// ============================================================

export default function Artigos() {
  const [posts, setPosts] = useState<Article[]>([]);

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
    <div className="relative bg-background dark:bg-stone-950 min-h-screen overflow-x-hidden transition-colors duration-500">
      <SEO
        title="Blog e Conteúdos | Mariana Bermudes Nutrição"
        description="Artigos, guias práticos e e-books gratuitos sobre nutrição comportamental, emagrecimento e saúde integral."
      />

      <div aria-hidden="true" className="absolute -top-40 -right-40 w-[560px] h-[560px] rounded-full bg-verde-nevoa/60 dark:bg-emerald-900/20 blur-[120px] pointer-events-none" />

      {/* Cabeçalho editorial */}
      <section className="relative max-w-[1280px] mx-auto px-6 md:px-12 pt-32 md:pt-40 pb-12 md:pb-16">
        <StaggerReveal className="max-w-3xl">
          <StaggerItem>
            <p className="inline-flex items-center gap-3 text-[0.68rem] tracking-[0.26em] uppercase font-extrabold text-tertiary dark:text-ouro-suave mb-6">
              <span aria-hidden="true" className="inline-block w-10 h-px bg-ouro-suave" />
              Publicações
            </p>
          </StaggerItem>
          <StaggerItem>
            <h1 className="font-headline font-medium text-4xl sm:text-5xl lg:text-[3.6rem] leading-[1.08] tracking-[-0.02em] text-on-background dark:text-stone-100 mb-6">
              Nutrição com ciência,{' '}
              <em className="italic text-primary dark:text-emerald-400">escrita para gente de verdade.</em>
            </h1>
          </StaggerItem>
          <StaggerItem>
            <p className="text-lg md:text-xl font-light text-on-surface-variant dark:text-stone-400 leading-relaxed max-w-[52ch]">
              Artigos baseados em evidências, reflexões sobre comportamento
              alimentar e materiais gratuitos para o dia a dia. Sem promessa
              milagrosa — só o que a ciência sustenta.
            </p>
          </StaggerItem>
        </StaggerReveal>
      </section>

      {/* Grade de artigos */}
      <section aria-label="Artigos" className="max-w-[1280px] mx-auto px-6 md:px-12 pb-20 md:pb-28">
        {posts.length > 0 ? (
          <StaggerReveal
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            staggerInterval={0.1}
          >
            {posts.map(post => (
              <StaggerItem key={post.id} className="h-full">
                <ArticleCard post={post} />
              </StaggerItem>
            ))}
          </StaggerReveal>
        ) : (
          <p className="text-on-surface-variant dark:text-stone-400 font-light">
            Os artigos estão a caminho. Enquanto isso, aproveite os e-books abaixo.
          </p>
        )}
      </section>

      {/* E-books gratuitos — faixa creme-2 */}
      <section aria-labelledby="ebooks" className="bg-creme-2 dark:bg-stone-900/60 transition-colors duration-500">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 py-20 md:py-28">
          <StaggerReveal className="max-w-2xl mb-12">
            <StaggerItem>
              <p className="inline-flex items-center gap-3 text-[0.68rem] tracking-[0.26em] uppercase font-extrabold text-tertiary dark:text-ouro-suave mb-5">
                <span aria-hidden="true" className="inline-block w-10 h-px bg-ouro-suave" />
                Materiais gratuitos
              </p>
            </StaggerItem>
            <StaggerItem>
              <h2 id="ebooks" className="font-headline font-medium text-3xl md:text-4xl leading-[1.12] text-on-background dark:text-stone-100 mb-4">
                E-books para <em className="italic text-primary dark:text-emerald-400">começar hoje.</em>
              </h2>
            </StaggerItem>
            <StaggerItem>
              <p className="text-on-surface-variant dark:text-stone-400 font-light text-lg leading-relaxed">
                Guias práticos de nutrição e bem-estar. Baixe, leia no seu ritmo e
                aplique o que fizer sentido para a sua rotina.
              </p>
            </StaggerItem>
          </StaggerReveal>

          <StaggerReveal
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl"
            staggerInterval={0.15}
          >
            {ebooks.map(ebook => (
              <StaggerItem key={ebook.id} className="h-full">
                <EbookCard ebook={ebook} onDownload={handleOpenModal} />
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* Newsletter — faixa verde-profundo */}
      <section aria-labelledby="newsletter" className="bg-verde-profundo dark:bg-emerald-950 relative overflow-hidden">
        <div aria-hidden="true" className="absolute -bottom-32 -right-24 w-[420px] h-[420px] rounded-full bg-primary/25 blur-[100px] pointer-events-none" />
        <StaggerReveal className="relative max-w-[760px] mx-auto px-6 md:px-12 py-20 md:py-28 text-center">
          <StaggerItem>
            <p className="text-[0.68rem] tracking-[0.26em] uppercase font-extrabold text-ouro-suave mb-5">Newsletter</p>
          </StaggerItem>
          <StaggerItem>
            <h2 id="newsletter" className="font-headline font-medium text-3xl md:text-[2.6rem] leading-[1.12] text-background mb-5">
              Um e-mail por vez, <em className="italic text-ouro-suave">sempre com conteúdo útil.</em>
            </h2>
          </StaggerItem>
          <StaggerItem>
            <p className="text-background/75 font-light text-lg leading-relaxed max-w-[46ch] mx-auto mb-9">
              Novos artigos e materiais de nutrição comportamental direto na sua
              caixa de entrada. Sem spam, cancele quando quiser.
            </p>
          </StaggerItem>
          <StaggerItem>
            <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto" onSubmit={handleNewsletterSubmit}>
              <label htmlFor="newsletter-email" className="sr-only">Seu endereço de e-mail</label>
              <input
                type="email"
                id="newsletter-email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Seu melhor e-mail"
                className="flex-1 bg-background/95 border border-transparent px-6 py-4 rounded-full text-on-background placeholder:text-on-surface-variant/70 focus:outline-none focus:border-ouro-suave focus:ring-1 focus:ring-ouro-suave transition-all text-base shadow-float-1"
                required
                disabled={newsletterSubmitting}
              />
              <MagneticButton as="div">
                <button
                  type="submit"
                  disabled={newsletterSubmitting}
                  data-cursor="Assinar"
                  className="no-glass w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-background text-verde-profundo px-8 py-4 rounded-full font-semibold text-[0.95rem] shadow-float-1 hover:shadow-float-2 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50"
                >
                  {newsletterSubmitting ? (
                    <span className="material-symbols-outlined animate-spin text-lg" aria-label="Enviando">progress_activity</span>
                  ) : (
                    <>Assinar <span aria-hidden="true" className="material-symbols-outlined text-[18px]">arrow_forward</span></>
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
