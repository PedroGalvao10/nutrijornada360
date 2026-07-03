import { motion } from 'framer-motion';
import { Database, Leaf, FlaskConical, UtensilsCrossed } from 'lucide-react';
import { StaggerReveal, StaggerItem } from '../../ui/StaggerReveal';

// ============================================================
// FontesDeDados — "de onde vêm os números" das ferramentas.
// Adaptação do padrão "integration list" (Ruixen Feature Section,
// 21st.dev) para a direção Editorial Orgânico: lista de bancos
// científicos reais que alimentam a busca e as receitas.
// Fontes espelham server/nutrition-api.js (Local → TACO → USDA;
// Spoonacular nas receitas) — não inventar entradas aqui.
// ============================================================

const FONTES = [
  {
    nome: 'Base local curada',
    papel: 'Primeira consulta',
    desc: 'Alimentos do dia a dia brasileiro já revisados, com resposta instantânea.',
    Icon: Database,
  },
  {
    nome: 'TACO — Tabela Brasileira de Composição de Alimentos',
    papel: 'Dados brasileiros',
    desc: 'Referência nacional (UNICAMP) para arroz, feijão e o que de fato vai ao seu prato.',
    Icon: Leaf,
  },
  {
    nome: 'USDA FoodData Central',
    papel: 'Cobertura internacional',
    desc: 'O banco do Departamento de Agricultura dos EUA, com milhares de alimentos e nutrientes.',
    Icon: FlaskConical,
  },
  {
    nome: 'Spoonacular',
    papel: 'Receitas inteligentes',
    desc: 'Combinações de ingredientes e informação nutricional por receita.',
    Icon: UtensilsCrossed,
  },
];

export function FontesDeDados() {
  return (
    <section aria-labelledby="fontes-de-dados" className="mt-20 md:mt-28">
      <StaggerReveal className="max-w-2xl mb-10">
        <StaggerItem>
          <p className="inline-flex items-center gap-3 text-[0.68rem] tracking-[0.26em] uppercase font-extrabold text-tertiary dark:text-ouro-suave mb-5">
            <span aria-hidden="true" className="inline-block w-10 h-px bg-ouro-suave" />
            Fontes de dados
          </p>
        </StaggerItem>
        <StaggerItem>
          <h2 id="fontes-de-dados" className="font-headline font-medium text-3xl md:text-4xl leading-[1.12] text-on-background dark:text-stone-100 mb-4">
            De onde vêm <em className="italic text-primary dark:text-emerald-400">os números.</em>
          </h2>
        </StaggerItem>
        <StaggerItem>
          <p className="text-on-surface-variant dark:text-stone-400 font-light leading-relaxed max-w-[52ch]">
            Cada busca consulta bancos científicos em cascata — do dado brasileiro
            ao internacional — para responder com a melhor fonte disponível.
          </p>
        </StaggerItem>
      </StaggerReveal>

      <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5" staggerInterval={0.08}>
        {FONTES.map(({ nome, papel, desc, Icon }, i) => (
          <StaggerItem key={nome}>
            <motion.div
              whileHover={{ y: -4 }}
              className="group h-full flex items-start gap-5 bg-white dark:bg-stone-900 rounded-[24px] p-6 md:p-7 shadow-float-1 hover:shadow-float-2 transition-shadow duration-500"
            >
              <div className="shrink-0 w-12 h-12 rounded-2xl bg-verde-nevoa dark:bg-emerald-900/30 flex items-center justify-center text-primary dark:text-emerald-400 group-hover:bg-verde-profundo group-hover:text-background transition-colors duration-500">
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-baseline gap-3 flex-wrap mb-1.5">
                  <span aria-hidden="true" className="font-headline italic text-ouro-suave text-sm">Nº 0{i + 1}</span>
                  <span className="text-[0.6rem] uppercase tracking-[0.18em] font-extrabold text-tertiary dark:text-ouro-suave">{papel}</span>
                </div>
                <h3 className="font-headline font-medium text-lg leading-snug text-on-background dark:text-stone-100 mb-1.5">{nome}</h3>
                <p className="text-sm text-on-surface-variant dark:text-stone-400 leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerReveal>
    </section>
  );
}
