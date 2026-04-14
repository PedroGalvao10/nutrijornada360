/* cspell:disable-file */
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LoginModal } from './LoginModal';
import { CustomCursor } from './ui/CustomCursor';
import { FloatingShapes } from './ui/FloatingShapes';
import { ThemeToggle } from './ui/ThemeToggle';

export function Layout() {
  const location = useLocation();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [hasPortalCompleted, setHasPortalCompleted] = useState(false);
  const isNavbarVisible = location.pathname !== '/' || hasPortalCompleted;

  useEffect(() => {
    const handlePortalComplete = () => setHasPortalCompleted(true);
    window.addEventListener('portal-complete', handlePortalComplete);
    return () => window.removeEventListener('portal-complete', handlePortalComplete);
  }, []);




  const getLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    const baseClass = "font-medium hover:text-[#705c30] dark:hover:text-amber-400 transition-colors";
    
    if (isActive) {
      return `text-[#4a7c59] dark:text-emerald-400 font-bold border-b-2 border-[#4a7c59] pb-1 hover:text-[#705c30] dark:hover:text-amber-400 transition-colors`;
    }
    return `text-stone-600 dark:text-stone-400 ${baseClass}`;
  };

  /* ���� Classe para os links da tab-bar mobile ���� */
  const getMobileTabClass = (path: string) => {
    const isActive = location.pathname === path;
    if (isActive) {
      return 'mobile-tab active text-[#4a7c59] font-bold';
    }
    return 'mobile-tab text-stone-500';
  };

  return (
    <>
      <CustomCursor />
      <FloatingShapes />
      
      {/* Background Interactive Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20 dark:opacity-40 overflow-hidden mix-blend-soft-light">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-[#4a7c59] blur-[150px] animate-pulse" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] rounded-full bg-[#705c30] blur-[120px] animate-pulse-delayed" />
      </div>
      <header className={`fixed top-4 left-0 right-0 z-[110] mx-auto w-[95%] max-w-6xl flex justify-center pointer-events-none transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isNavbarVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}>
        <nav className="pointer-events-auto flex justify-between items-center w-full px-4 md:px-6 py-3 rounded-full backdrop-blur-xl bg-[#faf6f0]/80 dark:bg-stone-950/80 shadow-[0_8px_32px_rgba(46,50,48,0.08)] border border-[#4a7c59]/10 dark:border-emerald-500/10 transition-all duration-300">
          <Link to="/" className="text-lg md:text-xl font-bold italic text-[#4a7c59] dark:text-emerald-500 font-headline truncate mr-4 lg:mr-8 hover:opacity-80 transition-opacity">
            NutriJornada 360º
          </Link>
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            <Link to="/" className={getLinkClass('/')}>Página Inicial</Link>
            <Link to="/sobre" className={getLinkClass('/sobre')}>Sobre Mariana</Link>
            <Link to="/planos" className={getLinkClass('/planos')}>Planos e Consultoria</Link>
            <Link to="/artigos" className={getLinkClass('/artigos')}>Publicações</Link>
          </div>
          <div className="flex items-center gap-3 lg:gap-4 ml-auto">
            <ThemeToggle />
            <button onClick={() => setIsLoginOpen(true)} className="text-sm font-bold text-[#705c30] hover:text-[#4a7c59] dark:text-amber-500 flex items-center gap-1 transition-colors bg-white/50 dark:bg-white/5 px-3 py-2 rounded-full">
              <span className="material-symbols-outlined text-base">login</span>
              <span className="hidden md:inline">Acesso</span>
            </button>
            <a href="https://wa.me/5511956007142" target="_blank" rel="noopener noreferrer" className="bg-[#4a7c59] text-white px-4 py-2 md:px-5 md:py-2.5 rounded-full font-semibold text-sm md:text-base hover:bg-[#3d664a] hover:scale-105 transition-all duration-200 whitespace-nowrap shadow-md">
              Agendar Consulta
            </a>
          </div>
        </nav>
      </header>

      <Outlet />

      {/* ���� Tab-bar de Navegação Mobile (somente < 768px) ���� */}
      <nav className={`mobile-bottom-nav md:hidden transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isNavbarVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}>
        <Link to="/" className={getMobileTabClass('/')}>
          <span className="material-symbols-outlined text-xl">home</span>
          <span className="text-[10px] mt-0.5 font-semibold leading-none">Início</span>
        </Link>
        <Link to="/sobre" className={getMobileTabClass('/sobre')}>
          <span className="material-symbols-outlined text-xl">person</span>
          <span className="text-[10px] mt-0.5 font-semibold leading-none">Sobre</span>
        </Link>
        <Link to="/planos" className={getMobileTabClass('/planos')}>
          <span className="material-symbols-outlined text-xl">star</span>
          <span className="text-[10px] mt-0.5 font-semibold leading-none">Planos</span>
        </Link>
        <Link to="/artigos" className={getMobileTabClass('/artigos')}>
          <span className="material-symbols-outlined text-xl">menu_book</span>
          <span className="text-[10px] mt-0.5 font-semibold leading-none">Artigos</span>
        </Link>
      </nav>

      {/* WhatsApp FAB � posicionamento ajustado no mobile via CSS */}
      <div className="fixed bottom-8 md:bottom-8 right-6 md:right-8 z-50 flex items-center justify-center whatsapp-fab">
        <div className="group relative">
          <div className="absolute bottom-full right-0 mb-4 w-64 bg-primary p-4 rounded-xl text-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden md:block">
            <p className="text-xs font-bold uppercase tracking-widest mb-1">Contato Direto</p>
            <p className="text-sm">Olá, Mariana! Gostaria de saber mais sobre a consulta!</p>
            <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-primary rotate-45"></div>
          </div>
          <a className="bg-[#4a7c59] dark:bg-emerald-800 text-white rounded-full p-3 md:p-4 w-14 h-14 md:w-16 md:h-16 shadow-lg flex items-center justify-center hover:scale-110 hover:bg-[#3d664a] transition-transform floating-pulse-animation" href="https://wa.me/5511956007142?text=Ol%C3%A1%2C%20Mariana!%20Gostaria%20de%20saber%20mais%20sobre%20a%20consulta%20ou%20agendar%20um%20atendimento." target="_blank" rel="noopener noreferrer">
            <span className="material-symbols-outlined text-2xl md:text-3xl">chat</span>
          </a>
        </div>
      </div>

      <footer className="bg-[#faf6f0] dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 mt-20 mobile-footer-spacing">
        <div className="w-full py-12 px-8 flex flex-col md:flex-row justify-between items-start gap-8 max-w-7xl mx-auto">
          <div className="max-w-md">
            <div className="text-lg font-serif text-[#705c30] dark:text-amber-500 mb-4">NutriJornada 360º Mariana Bermudes</div>
            <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
                Acompanhamento nutricional focado em resultados reais e duradouros. Ciência e empatia unidas para a sua melhor versão.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-12">
            <div className="flex flex-col gap-3">
              <span className="font-bold text-primary mb-2">Social</span>
              <a href="https://www.instagram.com/mariana.bermudes?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="text-stone-500 dark:text-stone-400 text-sm hover:underline decoration-[#705c30]">Instagram</a>
              <a href="https://www.linkedin.com/in/mariana-bermudes/" target="_blank" rel="noopener noreferrer" className="text-stone-500 dark:text-stone-400 text-sm hover:underline decoration-[#705c30]">LinkedIn</a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-bold text-primary mb-2">Suporte</span>
              <a href="#" className="text-stone-500 dark:text-stone-400 text-sm hover:underline decoration-[#705c30]">Contato</a>
              <a href="#" className="text-stone-500 dark:text-stone-400 text-sm hover:underline decoration-[#705c30]">Política de Privacidade</a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-8 py-6 border-t border-stone-200/50 dark:border-stone-800/50">
          <p className="text-stone-400 text-xs text-center md:text-left">© 2024 NutriJornada 360º Mariana Bermudes. Todos os direitos reservados. Pagamentos via Pix aceitos.</p>
        </div>
      </footer>
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}


