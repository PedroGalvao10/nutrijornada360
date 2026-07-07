import { motion } from 'framer-motion';
import { TextEffect } from '../ui/text-animations';

// ============================================================
// AcompanhamentoSection — O que está incluído (Editorial)
// Estilo Regis Grumberg: lista numerada expansiva com linhas
// finas (SVG stroke/CSS border) e tipografia mista em vez
// de "cards flutuantes". 
// ============================================================

const ENTREGAVEIS = [
  {
    id: '01',
    title: 'Plano alimentar personalizado',
    content: 'Seu cardápio desenhado sob medida para a sua rotina real — não uma dieta copiada de gaveta.',
  },
  {
    id: '02',
    title: 'Acompanhamento direto',
    content: 'Estou com você no WhatsApp entre as consultas para as dúvidas reais que aparecem no dia a dia.',
  },
  {
    id: '03',
    title: 'Revisão humana do caso',
    content: 'Eu mesma leio e avalio a sua história antes de começarmos. Nada aqui é automatizado ou feito por robôs.',
  },
  {
    id: '04',
    title: 'Análise de exames',
    content: 'Avaliações precisas para ajustar sua rota baseadas em dados concretos do seu corpo e metabolismo.',
  },
  {
    id: '05',
    title: 'Reeducação comportamental',
    content: 'Construiremos uma relação mais leve e sustentável com o alimento, sem broncas ou restrições severas.',
  },
];

export function AcompanhamentoSection() {
  return (
    <section aria-labelledby="acompanhamento" className="py-24 md:py-40 bg-stone-900 relative overflow-hidden text-stone-100">
      <div aria-hidden="true" className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-verde-profundo/40 blur-[140px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Cabeçalho */}
        <div className="mb-20 md:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="inline-flex items-center gap-3 text-[0.65rem] tracking-[0.26em] uppercase font-bold text-ouro-suave mb-8">
              <span aria-hidden="true" className="inline-block w-8 h-[1px] bg-ouro-suave/50" />
              Na Minha Mesa
            </p>
            <h2 id="acompanhamento" className="font-headline font-medium text-4xl md:text-[4rem] leading-[1.05] tracking-[-0.02em] max-w-3xl">
              Não é um PDF de dieta. <br/>
              <em className="italic text-verde-nevoa/90">É gente cuidando de gente.</em>
            </h2>
            <div className="mt-8 text-xl font-light text-stone-400 max-w-2xl leading-relaxed">
              <TextEffect text="Todo plano carrega o meu compromisso: revisão cuidadosa, suporte contínuo e ajustes que conversam com a sua realidade." preset="blur" delay={0.2} />
            </div>
          </motion.div>
        </div>

        {/* Lista Editorial Interativa */}
        <div className="flex flex-col border-t border-white/10">
          {ENTREGAVEIS.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group flex flex-col md:flex-row md:items-start py-8 md:py-12 border-b border-white/10 hover:border-ouro-suave/50 transition-colors duration-500 cursor-default"
            >
              {/* Número */}
              <div className="text-3xl md:text-5xl font-headline italic text-ouro-suave/40 group-hover:text-ouro-suave transition-colors duration-500 w-24 md:w-40 mb-4 md:mb-0 shrink-0">
                {item.id}
              </div>
              
              {/* Título & Conteúdo */}
              <div className="flex-1 grid md:grid-cols-2 gap-4 md:gap-16">
                <h3 className="text-2xl md:text-3xl font-headline text-stone-200 group-hover:text-white transition-colors duration-500">
                  {item.title}
                </h3>
                <p className="text-base md:text-lg text-stone-400 font-light leading-relaxed group-hover:text-stone-300 transition-colors duration-500">
                  {item.content}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
