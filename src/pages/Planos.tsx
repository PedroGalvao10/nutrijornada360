import { useRef } from 'react';
import { useTilt } from '../hooks/useTilt';
import { StaggerReveal, StaggerItem } from '../components/ui/StaggerReveal';
import SEO from '../components/SEO';

interface PlanoCardProps {
  title: string;
  tag: string;
  description: string;
  price: string;
  items: Array<{ text: string; highlight?: boolean; icon?: string }>;
  link: string;
  isPopular?: boolean;
  className?: string;
}

function PlanoCard({ title, tag, description, price, items, link, isPopular, className = "" }: PlanoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  useTilt(cardRef, 15);

  return (
    <div 
      ref={cardRef}
      className={`bg-surface-container-low p-8 rounded-3xl flex flex-col h-full border border-outline/10 shadow-[0_4px_20px_rgba(46,50,48,0.06)] relative overflow-hidden transition-shadow duration-300 hover:shadow-2xl z-10 transform-style-3d ${className}`}
    >
      {isPopular && (
        <div className="absolute top-0 right-0 bg-primary text-on-primary text-[10px] font-bold px-3 py-1 rounded-bl-lg z-20 tilt-child tz-30">
          MAIS VENDIDO
        </div>
      )}
      
      <div className="mb-6 tilt-child tz-25">
        <span className="text-secondary font-bold text-xs tracking-widest uppercase">{tag}</span>
        <h3 className="font-headline text-2xl font-bold text-on-surface mt-2">{title}</h3>
      </div>
      
      <div className="mb-8 flex-grow tilt-child tz-20">
        <p className="text-on-surface-variant mb-6 text-sm leading-relaxed">{description}</p>
        <ul className="space-y-4">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className={`material-symbols-outlined text-sm mt-1 ${item.icon ? 'text-secondary' : 'text-primary'}`}>
                {item.icon || 'check_circle'}
              </span>
              <span className={`text-sm ${item.highlight ? 'font-bold text-on-surface' : 'text-on-surface-variant'}`}>
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mt-auto tilt-child tz-30">
        <div className="text-3xl font-bold text-on-surface mb-6 font-headline">{price}</div>
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={`block text-center w-full py-4 rounded-xl font-bold transition-all hover:scale-[1.03] active:scale-95 shadow-sm ${isPopular ? 'bg-primary text-on-primary hover:shadow-lg' : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'}`}
        >
          Escolher Plano
        </a>
      </div>
    </div>
  );
}

import { FloatingAsset } from '../components/ui/FloatingAsset';

export default function Planos() {
  return (
    <main className="min-h-screen pt-32 pb-24 px-6 flex flex-col items-center bg-background text-on-background overflow-x-hidden relative">
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
          <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 block">Investimento na sua Saúde</span>
        </StaggerItem>
        <StaggerItem>
          <h1 className="font-headline text-4xl md:text-6xl text-on-surface font-bold mb-6 leading-tight">Escolha o seu caminho para a <span className="italic text-primary">transformação.</span></h1>
        </StaggerItem>
        <StaggerItem>
          <p className="text-lg text-on-surface-variant font-medium">Transforme sua relação com a comida e potencialize seus resultados com suporte profissional contínuo.</p>
        </StaggerItem>
      </StaggerReveal>

      <StaggerReveal 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24 perspective-1200 w-full max-w-7xl"
        staggerInterval={0.2}
      >
        <StaggerItem>
          <PlanoCard 
            tag="Start"
            title="Consulta Avulsa"
            description="Ideal para quem busca um norte inicial e ajustes pontuais na alimentação."
            price="R$200,00"
            link="https://wa.me/5511956007142?text=Ol%C3%A1%2C%20Mariana!%20Gostaria%20de%20saber%20mais%20sobre%20a%20Consulta%20Avulsa."
            items={[
              { text: "Entendimento da rotina pré-atendimento.", highlight: true },
              { text: "Orientações iniciais personalizadas" },
              { text: "Suporte para dúvidas pontuais" }
            ]}
          />
        </StaggerItem>

        <StaggerItem>
          <PlanoCard 
            tag="Foco"
            title="Consultoria Emagrece+"
            description="Focado em perda de peso saudável com suporte contínuo para manter a constância."
            price="R$280,00"
            link="https://wa.me/5511956007142?text=Ol%C3%A1%2C%20Mariana!%20Gostaria%20de%20saber%20mais%20sobre%20a%20Consultoria%20Emagrece+."
            items={[
              { text: "Check-up completo de hábitos.", highlight: true },
              { text: "Plano focado em déficit inteligente" },
              { text: "Suporte via WhatsApp (Horário comercial)" },
              { text: "Duração de 1 mês de acompanhamento" }
            ]}
          />
        </StaggerItem>

        <StaggerItem>
          <PlanoCard 
            tag="Performance"
            title="Hipertrofia Pro+"
            description="Estratégias avançadas para ganho de massa muscular, rendimento físico e foco em hipertrofia."
            price="R$497,00"
            isPopular={true}
            link="https://wa.me/5511956007142?text=Ol%C3%A1%2C%20Mariana!%20Gostaria%20de%20saber%20mais%20sobre%20o%20Hipertrofia%20Pro+."
            items={[
              { text: "Protocolo de ganho de massa muscular.", highlight: true },
              { text: "Check-up quinzenal de bioimpedância.", highlight: true, icon: "medical_services" },
              { text: "Otimização de suplementação" },
              { text: "Período de 3 meses intensivos" }
            ]}
          />
        </StaggerItem>

        <StaggerItem>
          <PlanoCard 
            tag="Completo"
            title="Transformação 360º"
            description="A experiência definitiva para quem busca uma mudança de vida integral, profunda e duradoura."
            price="R$697,00"
            className="bg-primary/5 !border-primary/20"
            link="https://wa.me/5511956007142?text=Ol%C3%A1%2C%20Mariana!%20Gostaria%20de%20saber%20mais%20sobre%20a%20Transformação%20360º."
            items={[
              { text: "Suporte prioritário 24/7", highlight: true, icon: "star" },
              { text: "Check-up quinzenal presencial/online.", highlight: true, icon: "medical_services" },
              { text: "Biofeedback e acompanhamento hormonal" },
              { text: "Reeducação comportamental completa" },
              { text: "Ciclo de 6 meses de transformação" }
            ]}
          />
        </StaggerItem>

        <StaggerItem>
          <PlanoCard 
            tag="Dupla"
            title="Plano Casal"
            description="Acompanhamento conjunto para casais que buscam alinhar saúde e rotina na mesma casa."
            price="R$640,00*"
            link="https://wa.me/5511956007142?text=Ol%C3%A1%2C%20Mariana!%20Gostaria%20de%20saber%20mais%20sobre%20o%20Plano%20Casal."
            items={[
              { text: "Cardápio otimizado para facilitar as compras.", highlight: true },
              { text: "Estratégias para rotina familiar" },
              { text: "Suporte compartilhado (WhatsApp)" },
              { text: "Sinergia de objetivos e hábitos" }
            ]}
          />
        </StaggerItem>
      </StaggerReveal>

      <StaggerReveal className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center bg-surface-container-high rounded-3xl p-8 md:p-16 w-full max-w-7xl border border-outline/5 shadow-inner">
        <div className="lg:col-span-2">
          <StaggerItem>
            <span className="inline-flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest mb-4">Próximo Passo</span>
          </StaggerItem>
          <StaggerItem>
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-surface mb-6 italic">Pronto para começar?</h2>
          </StaggerItem>
          <StaggerItem>
            <p className="text-on-surface-variant text-lg leading-relaxed max-w-2xl">Ao selecionar o seu plano, você será direcionado para o nosso agendamento rápido via WhatsApp, onde finalizaremos os detalhes do seu acompanhamento.</p>
          </StaggerItem>
        </div>
        <StaggerItem className="bg-surface p-8 rounded-[2rem] border border-outline/10 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-shadow group">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
             <span className="material-symbols-outlined text-4xl">calendar_month</span>
          </div>
          <h4 className="font-bold text-on-surface mb-2">Agendamento Real-Time</h4>
          <p className="text-xs text-on-surface-variant">Confirmação instantânea do seu horário.</p>
        </StaggerItem>
      </StaggerReveal>
    </main>
  );
}
