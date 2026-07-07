import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { NeuralVortexBackground } from '../ui/NeuralVortexBackground';
import { TextEffect } from '../ui/text-animations';

export function OcorpoComoSistema() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const y3 = useTransform(scrollYProgress, [0, 1], [200, -200]);

  return (
    <section ref={ref} className="relative min-h-screen py-32 overflow-hidden bg-stone-950 flex flex-col justify-center">
      {/* O DNA 3D Interativo no Fundo */}
      <div className="absolute inset-0 z-0 opacity-80 mix-blend-screen">
        <NeuralVortexBackground />
      </div>

      {/* Gradientes para mesclar com as seções adjacentes */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-transparent to-stone-950 z-0 pointer-events-none" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 w-full">
        {/* Cabeçalho Editorial */}
        <div className="max-w-3xl mb-24 md:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[0.75rem] md:text-[0.85rem] tracking-[0.24em] uppercase font-bold text-ouro-suave mb-6 flex items-center gap-4">
              <span className="w-12 h-px bg-ouro-suave/50" />
              Filosofia 360º
            </p>
            <h2 className="font-headline font-medium text-4xl md:text-6xl lg:text-[5.5rem] leading-[1.05] tracking-[-0.02em] text-white">
              O corpo humano é um <br className="hidden md:block" />
              <em className="italic text-verde-nevoa/90">sistema integrado.</em>
            </h2>
            <div className="mt-8 text-lg md:text-2xl font-light text-stone-300 max-w-2xl leading-relaxed">
              <TextEffect text="Ignorar sua rotina, suas emoções e seu contexto é o motivo pelo qual as dietas falham. Nosso acompanhamento conecta os pontos." preset="blur" delay={0.2} />
            </div>
          </motion.div>
        </div>

        {/* Lista Editorial Assimétrica (Sua Jornada) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-8 lg:gap-12 pt-12 border-t border-white/10">
          
          {/* Item 1 */}
          <motion.div style={{ y: y1 }} className="flex flex-col gap-6">
            <div className="text-4xl md:text-5xl font-headline italic text-ouro-suave/80 font-light">
              Nº 01
            </div>
            <div>
              <h3 className="text-2xl font-headline text-white mb-4 border-b border-white/10 pb-4">
                Investigação Profunda
              </h3>
              <p className="text-stone-400 font-light leading-relaxed text-base md:text-lg">
                Antes de prescrever qualquer coisa, mergulhamos na sua história clínica, exames, rotina de sono e relação com a comida. O mapa antes do caminho.
              </p>
            </div>
          </motion.div>

          {/* Item 2 */}
          <motion.div style={{ y: y2 }} className="flex flex-col gap-6 md:mt-16">
            <div className="text-4xl md:text-5xl font-headline italic text-ouro-suave/80 font-light">
              Nº 02
            </div>
            <div>
              <h3 className="text-2xl font-headline text-white mb-4 border-b border-white/10 pb-4">
                Nutrição de Precisão
              </h3>
              <p className="text-stone-400 font-light leading-relaxed text-base md:text-lg">
                Sem terrorismo, sem alimentos proibidos. Desenhamos um plano que faz sentido biomecânico para os seus objetivos, mas que também caiba no seu dia a dia.
              </p>
            </div>
          </motion.div>

          {/* Item 3 */}
          <motion.div style={{ y: y3 }} className="flex flex-col gap-6 md:mt-32">
            <div className="text-4xl md:text-5xl font-headline italic text-ouro-suave/80 font-light">
              Nº 03
            </div>
            <div>
              <h3 className="text-2xl font-headline text-white mb-4 border-b border-white/10 pb-4">
                Acompanhamento Contínuo
              </h3>
              <p className="text-stone-400 font-light leading-relaxed text-base md:text-lg">
                Seu metabolismo muda, e sua vida também. Estaremos lado a lado ajustando a rota, celebrando vitórias e recalibrando comportamentos.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
