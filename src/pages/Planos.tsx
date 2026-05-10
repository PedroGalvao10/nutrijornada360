
import { StaggerReveal, StaggerItem } from '../components/ui/StaggerReveal';
import SEO from '../components/SEO';
import { FloatingAsset } from '../components/ui/FloatingAsset';
import { useBooking } from '../context/BookingContext';
import { PricingCard } from '../components/ui/animated-glassy-pricing';
import { motion } from 'framer-motion';
import { Apple, Zap, Target, Star, Users, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Planos() {
  const { openBooking } = useBooking();
  
  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-24 px-6 flex flex-col items-center bg-background dark:bg-stone-950 text-on-background overflow-x-hidden relative transition-colors duration-500">
      <SEO 
        title="Planos e Consultorias | Mariana Bermudes Nutrição"
        description="Conheça nossos planos de acompanhamento nutricional personalizado. Emagrecimento, hipertrofia e bem-estar em São Paulo."
      />

      {/* Kiwis MONUMENTAIS em cascata - DESIGN DE ALTO IMPACTO */}
      <FloatingAsset 
        src="/fruits/Kiwi 1.webp" 
        className="top-[0%] right-[-15%] md:right-[-10%] w-[700px] md:w-[1100px] z-0 opacity-30 grayscale-[20%]" 
        depth={0.05} 
        delay={0.2}
      />
      <FloatingAsset 
        src="/fruits/Kiwi 2.webp" 
        className="top-[12%] right-[-12%] md:right-[-10%] w-[600px] md:w-[900px] z-30 opacity-95" 
        depth={0.2} 
        delay={0.5}
      />
      <FloatingAsset 
        src="/fruits/kiwi 3.webp" 
        className="top-[35%] right-[-15%] md:right-[-12%] w-[550px] md:w-[850px] z-30" 
        depth={0.12} 
        delay={0.8}
      />
      <FloatingAsset 
        src="/fruits/kiwi 4.webp" 
        className="bottom-[20%] right-[-10%] md:right-[-5%] w-[700px] md:w-[1000px] z-50 drop-shadow-3xl" 
        depth={0.25} 
        delay={0.4}
      />
      
      <StaggerReveal className="text-center mb-24 max-w-4xl mx-auto relative z-10">
        <StaggerItem>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary dark:bg-emerald-500/10 dark:text-emerald-400 font-bold text-[10px] uppercase tracking-widest mb-6 border border-primary/20">
            <Zap className="w-3 h-3" /> Investimento na sua Saúde
          </div>
        </StaggerItem>
        <StaggerItem>
          <h1 className="font-headline text-5xl md:text-7xl text-on-surface dark:text-stone-100 font-bold mb-8 leading-[1.1]">
            Escolha o seu caminho para a <br/>
            <span className="italic text-primary dark:text-emerald-400 bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">transformação.</span>
          </h1>
        </StaggerItem>
        <StaggerItem>
          <p className="text-xl text-on-surface-variant dark:text-stone-400 font-light max-w-2xl mx-auto leading-relaxed">
            Transforme sua relação com a comida e potencialize seus resultados com suporte profissional contínuo e estratégias de alta performance.
          </p>
        </StaggerItem>
      </StaggerReveal>

      <StaggerReveal 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24 perspective-1200 w-full"
        staggerInterval={0.2}
      >
        <StaggerItem className="h-full">
          <PricingCard 
            id="avulsa"
            tag="Início"
            title="Consulta Avulsa"
            description="Ideal para quem busca um norte inicial e ajustes pontuais na alimentação."
            price="R$200,00"
            items={[
              { text: "Entendimento da rotina pré-atendimento", highlight: true, icon: "analytics" },
              { text: "Orientações iniciais personalizadas", icon: "assignment_ind" },
              { text: "Suporte para dúvidas pontuais", icon: "chat" }
            ]}
          />
        </StaggerItem>

        <StaggerItem className="h-full">
          <PricingCard 
            id="emagrece-mais"
            tag="Foco"
            title="Consultoria Emagrece+"
            description="Focado em perda de peso saudável com suporte contínuo para manter a constância."
            price="R$280,00"
            items={[
              { text: "Check-up completo de hábitos", highlight: true, icon: "fact_check" },
              { text: "Plano focado em déficit inteligente", icon: "monitoring" },
              { text: "Suporte via WhatsApp (Horário comercial)", icon: "support_agent" },
              { text: "Duração de 1 mês de acompanhamento", icon: "calendar_today" }
            ]}
          />
        </StaggerItem>

        <StaggerItem className="h-full">
          <PricingCard 
            id="hipertrofia-pro"
            tag="Performance"
            title="Hipertrofia Pro+"
            description="Estratégias avançadas para ganho de massa muscular e rendimento físico superior."
            price="R$497,00"
            isPopular={true}
            items={[
              { text: "Protocolo de ganho de massa muscular", highlight: true, icon: "fitness_center" },
              { text: "Check-up quinzenal de bioimpedância", highlight: true, icon: "medical_services" },
              { text: "Otimização de suplementação avançada", icon: "pill" },
              { text: "Período de 3 meses intensivos", icon: "speed" }
            ]}
          />
        </StaggerItem>

        <StaggerItem className="h-full">
          <PricingCard 
            id="transformacao-360"
            tag="Completo"
            title="Transformação 360º"
            description="A experiência definitiva para quem busca uma mudança de vida integral e profunda."
            price="R$697,00"
            items={[
              { text: "Suporte prioritário 24/7", highlight: true, icon: "star" },
              { text: "Check-up presencial/online", highlight: true, icon: "medical_services" },
              { text: "Biofeedback e acompanhamento hormonal", icon: "biotech" },
              { text: "Reeducação comportamental completa", icon: "psychology" },
              { text: "Ciclo de 6 meses de transformação", icon: "all_inclusive" }
            ]}
          />
        </StaggerItem>

        <StaggerItem className="h-full">
          <PricingCard 
            id="casal"
            tag="Dupla"
            title="Plano Casal"
            description="Acompanhamento conjunto para casais que buscam alinhar saúde e rotina."
            price="R$640,00*"
            items={[
              { text: "Cardápio otimizado para compras", highlight: true, icon: "shopping_cart" },
              { text: "Estratégias para rotina familiar", icon: "family_restroom" },
              { text: "Suporte compartilhado via WhatsApp", icon: "groups" },
              { text: "Sinergia de objetivos e hábitos", icon: "sync" }
            ]}
          />
        </StaggerItem>
      </StaggerReveal>

      <section className="w-full max-w-6xl mx-auto mb-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 dark:border-white/5"
            >
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                    <Target className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-lg mb-3">Diagnóstico Preciso</h4>
                <p className="text-sm text-stone-500 leading-relaxed">Análise profunda da sua fisiologia e rotina para criar o plano perfeito.</p>
            </motion.div>
            <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 dark:border-white/5"
            >
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                    <Apple className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-lg mb-3">Nutrição Consciente</h4>
                <p className="text-sm text-stone-500 leading-relaxed">Cardápios que respeitam seu paladar e promovem saciedade real.</p>
            </motion.div>
            <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 dark:border-white/5"
            >
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                    <Star className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-lg mb-3">Acompanhamento Premium</h4>
                <p className="text-sm text-stone-500 leading-relaxed">Suporte contínuo para garantir que cada obstáculo seja superado.</p>
            </motion.div>
        </div>
      </section>

      <StaggerReveal className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center bg-surface-container-high dark:bg-stone-900/50 rounded-3xl p-8 md:p-16 w-full border border-outline/5 dark:border-stone-700/20 shadow-inner">
        <div className="lg:col-span-2">
          <StaggerItem>
            <span className="inline-flex items-center gap-2 text-primary dark:text-emerald-400 font-bold uppercase text-[10px] tracking-widest mb-4">Próximo Passo</span>
          </StaggerItem>
          <StaggerItem>
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-surface dark:text-stone-100 mb-6 italic">Pronto para começar?</h2>
          </StaggerItem>
          <StaggerItem>
            <p className="text-on-surface-variant dark:text-stone-400 text-lg leading-relaxed max-w-2xl">Escolha o seu plano acima para iniciar o processo de qualificação e agendamento NutriJornada 360º.</p>
          </StaggerItem>
        </div>
        <StaggerItem 
          className="bg-surface dark:bg-stone-800/50 p-8 rounded-[2rem] border border-outline/10 dark:border-stone-700/20 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-all group cursor-pointer active:scale-[0.98]"
          onClick={() => openBooking()}
        >
          <div className="w-full h-full flex flex-col items-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
               <span className="material-symbols-outlined text-4xl">calendar_month</span>
            </div>
            <h4 className="font-bold text-on-surface dark:text-stone-100 mb-2">Agendamento Online</h4>
            <p className="text-xs text-on-surface-variant dark:text-stone-400">Clique para iniciar o fluxo unificado.</p>
          </div>
        </StaggerItem>
      </StaggerReveal>
    </div>
  );
}
