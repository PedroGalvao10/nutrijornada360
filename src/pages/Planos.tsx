import { useRef } from 'react';
import { StaggerReveal, StaggerItem } from '../components/ui/StaggerReveal';
import SEO from '../components/SEO';
import { FloatingAsset } from '../components/ui/FloatingAsset';
import { useBooking } from '../context/BookingContext';

interface PlanoCardProps {
  id: string;
  title: string;
  tag: string;
  description: string;
  price: string;
  items: Array<{ text: string; highlight?: boolean; icon?: string }>;
  isPopular?: boolean;
  className?: string;
}

function PlanoCard({ id, title, description, price, items, className = "" }: PlanoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { openBooking } = useBooking();

  return (
    <div 
      ref={cardRef}
      className={`bg-white/5 dark:bg-black/20 antigravity-glass p-8 rounded-[2rem] flex flex-col h-full border-white/20 dark:border-white/5 shadow-sm hover:shadow-xl transition-all duration-300 relative z-10 ${className}`}
    >
      <div className="mb-6">
        <h3 className="font-headline text-2xl font-bold text-on-surface dark:text-stone-100">{title}</h3>
        <p className="text-on-surface-variant dark:text-stone-400 mt-2 text-sm leading-relaxed">{description}</p>
      </div>
      
      <div className="text-3xl font-bold text-primary dark:text-emerald-400 mb-8 font-headline">{price}</div>
      
      <div className="mb-8 flex-grow">
        <ul className="space-y-4">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-primary dark:bg-emerald-500 rounded-full mt-2 shrink-0" />
              <span className={`text-sm ${item.highlight ? 'font-bold text-on-surface dark:text-stone-200' : 'text-on-surface-variant dark:text-stone-400'}`}>
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mt-auto pt-6">
        <button 
          onClick={() => openBooking(id)}
          className="block w-full text-center py-4 bg-primary text-white font-bold rounded-xl transition-all shadow-md active:scale-[0.98]"
        >
          Quero este plano
        </button>
      </div>
    </div>
  );
}

export default function Planos() {
  const { openBooking } = useBooking();
  
  return (
    <main className="min-h-screen pt-40 pb-24 px-6 flex flex-col items-center bg-background dark:bg-stone-950 text-on-background overflow-x-hidden relative transition-colors duration-500">
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
      
      <StaggerReveal className="text-center mb-16 max-w-3xl mx-auto">
        <StaggerItem>
          <span className="text-primary dark:text-emerald-400 font-bold tracking-widest uppercase text-xs mb-4 block">Investimento na sua Saúde</span>
        </StaggerItem>
        <StaggerItem>
          <h1 className="font-headline text-4xl md:text-6xl text-on-surface dark:text-stone-100 font-bold mb-6 leading-tight">Escolha o seu caminho para a <span className="italic text-primary dark:text-emerald-400">transformação.</span></h1>
        </StaggerItem>
        <StaggerItem>
          <p className="text-lg text-on-surface-variant dark:text-stone-400 font-medium">Transforme sua relação com a comida e potencialize seus resultados com suporte profissional contínuo.</p>
        </StaggerItem>
      </StaggerReveal>

      <StaggerReveal 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24 perspective-1200 w-full max-w-7xl"
        staggerInterval={0.2}
      >
        <StaggerItem className="h-full">
          <PlanoCard 
            id="avulsa"
            tag="Start"
            title="Consulta Avulsa"
            description="Ideal para quem busca um norte inicial e ajustes pontuais na alimentação."
            price="R$200,00"
            items={[
              { text: "Entendimento da rotina pré-atendimento.", highlight: true },
              { text: "Orientações iniciais personalizadas" },
              { text: "Suporte para dúvidas pontuais" }
            ]}
          />
        </StaggerItem>

        <StaggerItem className="h-full">
          <PlanoCard 
            id="emagrece-mais"
            tag="Foco"
            title="Consultoria Emagrece+"
            description="Focado em perda de peso saudável com suporte contínuo para manter a constância."
            price="R$280,00"
            items={[
              { text: "Check-up completo de hábitos.", highlight: true },
              { text: "Plano focado em déficit inteligente" },
              { text: "Suporte via WhatsApp (Horário comercial)" },
              { text: "Duração de 1 mês de acompanhamento" }
            ]}
          />
        </StaggerItem>

        <StaggerItem className="h-full">
          <PlanoCard 
            id="hipertrofia-pro"
            tag="Performance"
            title="Hipertrofia Pro+"
            description="Estratégias avançadas para ganho de massa muscular, rendimento físico e foco em hipertrofia."
            price="R$497,00"
            isPopular={true}
            items={[
              { text: "Protocolo de ganho de massa muscular.", highlight: true },
              { text: "Check-up quinzenal de bioimpedância.", highlight: true, icon: "medical_services" },
              { text: "Otimização de suplementação" },
              { text: "Período de 3 meses intensivos" }
            ]}
          />
        </StaggerItem>

        <StaggerItem className="h-full">
          <PlanoCard 
            id="transformacao-360"
            tag="Completo"
            title="Transformação 360º"
            description="A experiência definitiva para quem busca uma mudança de vida integral, profunda e duradoura."
            price="R$697,00"
            className="bg-white/10 dark:bg-black/40 !border-white/30"
            items={[
              { text: "Suporte prioritário 24/7", highlight: true, icon: "star" },
              { text: "Check-up quinzenal presencial/online.", highlight: true, icon: "medical_services" },
              { text: "Biofeedback e acompanhamento hormonal" },
              { text: "Reeducação comportamental completa" },
              { text: "Ciclo de 6 meses de transformation" }
            ]}
          />
        </StaggerItem>

        <StaggerItem className="h-full">
          <PlanoCard 
            id="casal"
            tag="Dupla"
            title="Plano Casal"
            description="Acompanhamento conjunto para casais que buscam alinhar saúde e rotina na mesma casa."
            price="R$640,00*"
            items={[
              { text: "Cardápio otimizado para facilitar as compras.", highlight: true },
              { text: "Estratégias para rotina familiar" },
              { text: "Suporte compartilhado (WhatsApp)" },
              { text: "Sinergia de objetivos e hábitos" }
            ]}
          />
        </StaggerItem>
      </StaggerReveal>

      <StaggerReveal className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center bg-surface-container-high dark:bg-stone-900/50 rounded-3xl p-8 md:p-16 w-full max-w-7xl border border-outline/5 dark:border-stone-700/20 shadow-inner">
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
    </main>
  );
}
