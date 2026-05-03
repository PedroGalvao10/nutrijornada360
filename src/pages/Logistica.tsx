import { useRef } from 'react';
import { useDynamicShadow } from '../hooks/useDynamicShadow';
import { useTilt } from '../hooks/useTilt';
import SEO from '../components/SEO';
import { StaggerReveal, StaggerItem } from '../components/ui/StaggerReveal';
import { MagneticButton } from '../components/ui/MagneticButton';
import { useBooking } from '../context/BookingContext';
import posthog from 'posthog-js';
export default function Logistica() {
  const onlineRef = useRef<HTMLDivElement>(null);
  const prepRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const { openBooking } = useBooking();

  useDynamicShadow();
  useTilt(onlineRef, 10);
  useTilt(prepRef, 10);
  useTilt(ctaRef, 12);

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 pt-52 bg-background dark:bg-stone-950 transition-colors duration-500">
      <SEO 
        title="Logística e Agendamento | Mariana Bermudes"
        description="Entenda como funcionam as consultas online e presenciais com Mariana Bermudes. Passo a passo do agendamento à consulta."
      />
      
      {/* Header Section */}
      <StaggerReveal>
        <header className="mb-20 text-center max-w-3xl mx-auto">
          <StaggerItem>
            <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-emerald-400 mb-6 leading-tight font-headline">Logística e Agendamento</h1>
          </StaggerItem>
          <StaggerItem>
            <p className="text-lg text-secondary dark:text-stone-400 leading-relaxed font-body">Sua jornada rumo ao bem-estar começa aqui. Entenda como funcionam nossos atendimentos e prepare-se para uma transformação completa.</p>
          </StaggerItem>
        </header>
      </StaggerReveal>

      {/* Consulta Online Section */}
      <section className="mb-24">
        <StaggerReveal staggerInterval={0.15}>
          <div ref={onlineRef} className="bg-surface-container-low dark:bg-stone-900/60 p-10 md:p-12 rounded-2xl flex flex-col lg:flex-row gap-12 items-center shadow-[0_4px_24px_rgba(46,50,48,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] transform-style-3d">
            <div className="flex-1 tilt-child tz-10">
              <StaggerItem>
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary text-4xl">public</span>
                  <h2 className="text-3xl font-bold text-on-surface dark:text-stone-100 font-headline">Consulta Online</h2>
                </div>
              </StaggerItem>
              <StaggerItem>
                <p className="text-secondary dark:text-stone-400 mb-8 leading-relaxed font-body text-lg">Perfeita para quem busca praticidade sem perder a profundidade do atendimento presencial. Descubra os benefícios exclusivos da nossa plataforma digital:</p>
              </StaggerItem>

              <ul className="space-y-4 text-on-surface-variant dark:text-stone-400">
                <StaggerItem>
                  <li className="flex gap-3 items-start"><span className="material-symbols-outlined text-primary">check_circle</span> <span><strong>Atendimento de qualquer lugar do Brasil:</strong> sem barreiras geográficas ou perda de tempo no trânsito.</span></li>
                </StaggerItem>
                <StaggerItem>
                  <li className="flex gap-3 items-start"><span className="material-symbols-outlined text-primary">check_circle</span> <span><strong>Flexibilidade de horário:</strong> ajustamos a sessão para o momento do seu dia que couber melhor na sua rotina.</span></li>
                </StaggerItem>
                <StaggerItem>
                  <li className="flex gap-3 items-start"><span className="material-symbols-outlined text-primary">check_circle</span> <span><strong>Ambiente prático e seguro:</strong> videochamada feita por uma sala virtual 100% protegida.</span></li>
                </StaggerItem>
                <StaggerItem>
                  <li className="flex gap-3 items-start"><span className="material-symbols-outlined text-primary">check_circle</span> <span><strong>Acompanhamento contínuo:</strong> manutenção de contato direto via mensagens para tirar dúvidas em tempo real.</span></li>
                </StaggerItem>
                <StaggerItem>
                  <li className="flex gap-3 items-start"><span className="material-symbols-outlined text-primary">check_circle</span> <span><strong>Materiais 100% digitais:</strong> envio rápido de protocolos, listas e planos personalizados diretamente para o seu celular.</span></li>
                </StaggerItem>
              </ul>
            </div>
            <StaggerItem direction="left" className="w-full lg:w-5/12">
              <div className="aspect-[4/3] rounded-xl overflow-hidden parallax-shadow tilt-child tz-30">
                <img className="w-full h-full object-cover" alt="Consulta remota conduzida através de videochamada" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAy6kIfKxb0h9BTxHzfViUMXNu0SCkBcCgnpl2pXWt_JLyAjH2kA-4d3q4ubfdRWIbylrYOIHsl3T5Ef9TMWHy0oiPH96zLUDJ9bkay_Xr4H_xJMF59oUHBnoNii01W8jyI-Og_w9H5WKxN41o0iq_jo9UQmVcncOec3I1AaOzmQJClp_-8QVg9ekHRyuki1dlEU1t36ppri5DkiQy0oT-VTpkv7UqTIUUwsqc_GJOrYNl68IGiLeR7iYEglUIXP8mNCeVPQYVOOpg" />
              </div>
            </StaggerItem>
          </div>
        </StaggerReveal>
      </section>

      {/* Preparação Section */}
      <section ref={prepRef} className="bg-surface-container-highest dark:bg-stone-900 rounded-xl overflow-hidden mb-24 transform-style-3d">
        <StaggerReveal className="flex flex-col md:flex-row items-stretch" amount={0.2}>
          <div className="w-full md:w-1/2 p-12 tilt-child tz-10">
            <StaggerItem>
              <h2 className="text-3xl font-bold text-primary dark:text-emerald-400 mb-8 font-headline">O Caminho da Preparação</h2>
            </StaggerItem>
            <div className="space-y-8">
              <StaggerItem>
                <div className="flex gap-4 group">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold group-hover:scale-110 transition-transform">1</div>
                  <div>
                    <h3 className="font-bold text-lg font-headline text-on-surface dark:text-stone-100">Fechamento do Plano</h3>
                    <p className="text-secondary dark:text-stone-400 font-body">Após escolher o melhor formato online para você, confirmamos seu horário.</p>
                  </div>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="flex gap-4 group">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold group-hover:scale-110 transition-transform">2</div>
                  <div>
                    <h3 className="font-bold text-lg font-headline text-on-surface dark:text-stone-100">Formulário Pré-Consulta</h3>
                    <p className="text-secondary dark:text-stone-400 font-body">Você receberá um formulário online de rotina. Ele é fundamental para que eu entenda o histórico do seu metabolismo e seus gatilhos antes do encontro.</p>
                  </div>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="flex gap-4 group">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold group-hover:scale-110 transition-transform">3</div>
                  <div>
                    <h3 className="font-bold text-lg font-headline text-on-surface dark:text-stone-100">Personalização Total</h3>
                    <p className="text-secondary dark:text-stone-400 font-body">Com a sua base de dados, chego na nossa sessão já sendo direta e certeira no que precisamos adaptar na sua alimentação.</p>
                  </div>
                </div>
              </StaggerItem>
            </div>
          </div>
          <div className="w-full md:w-1/2 bg-primary-container/20 dark:bg-emerald-500/5 flex items-center justify-center p-12 tilt-child tz-30">
            <StaggerItem direction="left">
              <div className="bg-surface dark:bg-stone-800 p-8 rounded-lg shadow-sm dark:shadow-lg max-w-sm rotate-2 tilt-child tz-40">
                <span className="material-symbols-outlined text-primary mb-4 text-4xl">description</span>
                <div className="h-2 w-24 bg-primary/20 rounded mb-4"></div>
                <div className="h-2 w-full bg-surface-container-highest dark:bg-stone-700 rounded mb-2"></div>
                <div className="h-2 w-full bg-surface-container-highest dark:bg-stone-700 rounded mb-2"></div>
                <div className="h-2 w-2/3 bg-surface-container-highest dark:bg-stone-700 rounded mb-6"></div>
                <div className="flex gap-2">
                  <div className="h-4 w-4 bg-primary/40 rounded-sm"></div>
                  <div className="h-2 w-12 bg-surface-container-highest dark:bg-stone-700 rounded mt-1"></div>
                </div>
              </div>
            </StaggerItem>
          </div>
        </StaggerReveal>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="mb-24">
        <StaggerReveal>
          <div className="bg-primary text-white rounded-[2rem] p-12 text-center relative overflow-hidden transform-style-3d">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <span className="material-symbols-outlined text-9xl">calendar_month</span>
            </div>
            <div className="relative z-10 tilt-child tz-10">
              <StaggerItem>
                <h2 className="text-3xl font-bold mb-6 font-headline text-on-primary">Pronta para começar sua NutriJornada?</h2>
              </StaggerItem>
              <StaggerItem>
                <p className="mb-10 text-on-primary-container max-w-xl mx-auto opacity-90 font-body text-on-primary/90">Escolha o melhor horário para você diretamente na minha agenda oficial e receba a confirmação imediata da sua sessão.</p>
              </StaggerItem>
              <StaggerItem>
                <MagneticButton as="div" className="inline-block tilt-child tz-30">
                  <button 
                    className="inline-flex items-center gap-3 bg-white text-primary px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-all shadow-lg" 
                    onClick={() => {
                      posthog.capture('conversion_whatsapp_click');
                      openBooking();
                    }}
                  >
                    <span className="material-symbols-outlined text-xl">calendar_month</span>
                    Agendar Horário
                  </button>
                </MagneticButton>
              </StaggerItem>
            </div>
          </div>
        </StaggerReveal>
      </section>
    </main>
  );
}
