import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { StaggerReveal, StaggerItem } from '../ui/StaggerReveal';

const ECOSYSTEM_NODES = [
  { id: 'sono', label: 'Sono Reparador', icon: 'bedtime', color: 'bg-blue-100 text-blue-600', description: 'Ciclo circadiano e regulação hormonal.', className: 'node-1' },
  { id: 'microbiota', label: 'Microbiota', icon: 'microbiology', color: 'bg-emerald-100 text-emerald-600', description: 'Saúde intestinal como base da imunidade.', className: 'node-2' },
  { id: 'emocoes', label: 'Psicologia', icon: 'psychology', color: 'bg-amber-100 text-amber-600', description: 'Relação emocional com a comida e saciedade.', className: 'node-3' },
  { id: 'metabolismo', label: 'Metabolismo', icon: 'bolt', color: 'bg-rose-100 text-rose-600', description: 'Eficiência energética e saúde celular.', className: 'node-4' },
  { id: 'ambiente', label: 'Ambiente', icon: 'eco', color: 'bg-stone-100 text-stone-600', description: 'Contexto social e disponibilidade alimentar.', className: 'node-5' },
];

export function NutritionEcosystem() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeNode, setActiveNode] = useState<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Pulse animation for the central node
    gsap.to('.central-node', {
      scale: 1.05,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });

    // Subtle random movement for surrounding nodes
    nodesRef.current.forEach((node, i) => {
      if (!node) return;
      gsap.to(node, {
        y: '+=random(-5, 5)',
        x: '+=random(-5, 5)',
        duration: 'random(3, 5)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.2
      });
    });
  }, []);

  const handleNodeEnter = (index: number) => {
    // Se já houver um nó ativo diferente, fecha ele primeiro
    if (activeNode !== null && activeNode !== index) {
      handleNodeLeave(activeNode);
    }
    
    setActiveNode(index);
    const node = nodesRef.current[index];
    if (!node) return;
    
    gsap.to(node, {
      scale: 1.25, // Aumentei um pouco para destacar mais
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
      duration: 0.4,
      ease: 'back.out(1.7)'
    });
    
    gsap.to(`.node-desc-${index}`, {
      opacity: 1,
      y: 0,
      duration: 0.3
    });
  };

  const handleNodeLeave = (index: number) => {
    if (activeNode === index) {
      setActiveNode(null);
    }
    const node = nodesRef.current[index];
    if (!node) return;

    gsap.to(node, {
      scale: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
      boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
      duration: 0.3
    });
    
    gsap.to(`.node-desc-${index}`, {
      opacity: 0,
      y: 10,
      duration: 0.2
    });
  };

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <StaggerReveal className="text-center mb-16">
          <StaggerItem>
            <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Ecossistema de Nutrição</span>
          </StaggerItem>
          <StaggerItem>
            <h2 className="text-4xl md:text-6xl font-headline text-on-surface mb-6 font-semibold">
              Toda semente precisa de um <span className="italic text-primary">entorno fértil.</span>
            </h2>
          </StaggerItem>
          <StaggerItem>
            <p className="max-w-2xl mx-auto text-muted-foreground text-lg leading-relaxed">
              Não olhamos apenas para o que você come, mas para como o seu corpo processa e como o seu ambiente sustenta suas escolhas diárias.
            </p>
          </StaggerItem>
        </StaggerReveal>

        <div ref={containerRef} className="relative h-[600px] md:h-[700px] flex items-center justify-center">
          {/* Central Point (Diminuído conforme solicitado) */}
          <div className="central-node z-20 w-16 h-16 md:w-20 md:h-20 bg-primary rounded-full flex flex-col items-center justify-center text-on-primary shadow-2xl border-4 border-white/20">
            <span className="material-symbols-outlined text-xl md:text-2xl mb-0.5 text-on-primary">face_retouching_natural</span>
            <span className="font-headline font-bold text-[10px] md:text-xs uppercase tracking-tighter text-on-primary">Você</span>
            <div className="absolute inset-0 rounded-full border border-white/30 animate-ping opacity-20"></div>
          </div>

          {/* Orbital Nodes */}
          {ECOSYSTEM_NODES.map((node, i) => (
            <div
              key={node.id}
              ref={(el) => { if (el) nodesRef.current[i] = el; }}
              onMouseEnter={() => handleNodeEnter(i)}
              onMouseLeave={() => handleNodeLeave(i)}
              className={`absolute pointer-events-auto cursor-pointer w-32 h-32 md:w-44 md:h-44 rounded-3xl antigravity-glass p-6 text-center flex flex-col items-center justify-center transition-all duration-300 group ecosystem-node ${node.className} ${activeNode === i ? 'z-50 shadow-2xl' : 'z-30'}`}
              data-reveal
            >
              <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl ${node.color} flex items-center justify-center mb-3 shadow-inner`}>
                <span className="material-symbols-outlined text-2xl md:text-3xl">{node.icon}</span>
              </div>
              <h4 className="font-headline font-bold text-on-surface text-sm md:text-base leading-tight">{node.label}</h4>
              
              {/* Hover Details */}
              <div className={`node-desc-${i} absolute top-full mt-4 left-0 right-0 opacity-0 transform translate-y-2 pointer-events-none z-50`}>
                <p className="text-xs md:text-sm text-on-surface-variant bg-surface-container-high/90 p-4 rounded-2xl backdrop-blur-md border border-outline/10 shadow-2xl max-w-[200px] mx-auto text-center">
                  {node.description}
                </p>
              </div>
            </div>
          ))}

          {/* Orbit Rings (Mantendo apenas uma órbita conforme solicitado) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[500px] md:h-[500px] border border-primary/10 rounded-full pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
}
