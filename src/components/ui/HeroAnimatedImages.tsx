import { cn } from "../../lib/utils";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface FoodItem {
  id: string;
  clipId: string;
  image: string;
  rotation?: number;
  imageOffset?: string; // translateY extra para ajustar posição da imagem
}

// Alimentos com silhuetas icônicas e inconfundíveis
// Imagens geradas com IA — cada uma mostra UM ÚNICO alimento centralizado
const foodItems: FoodItem[] = [
  {
    id: "banana",
    clipId: "clip-banana",
    image: "/banana.png",
    rotation: 40,
    imageOffset: "translateY(7%)",
  },
  {
    id: "apple",
    clipId: "clip-apple",
    image: "/apple.png"
  },
  {
    id: "pear",
    clipId: "clip-pear",
    image: "/pear-v2.png"
  },
  {
    id: "strawberry",
    clipId: "clip-strawberry",
    image: "/strawberry.png"
  }
];

export const HeroAnimatedImages = ({
  className,
}: {
  className?: string;
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const isFirstRender = useRef(true);

  // Inicializa a primeira imagem visível
  useEffect(() => {
    if (isFirstRender.current && imagesRef.current[0]) {
      gsap.set(imagesRef.current[0], { opacity: 1, scale: 1, zIndex: 10 });
      isFirstRender.current = false;
    }
  }, []);

  // Auto-loop a cada 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % foodItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Transição GSAP entre frames
  useEffect(() => {
    if (isFirstRender.current) return;
    const currentImg = imagesRef.current[activeIndex];
    const previousImg = imagesRef.current[(activeIndex - 1 + foodItems.length) % foodItems.length];

    if (currentImg && previousImg) {
      gsap.fromTo(
        currentImg,
        { opacity: 0, scale: 1.08, zIndex: 10 },
        { opacity: 1, scale: 1, duration: 1.4, ease: "power3.out" }
      );
      gsap.to(previousImg, {
        opacity: 0,
        scale: 0.94,
        duration: 1.4,
        ease: "power3.out",
        zIndex: 1,
      });
    }
  }, [activeIndex]);

  return (
    <div className={cn("relative w-full aspect-square flex items-center justify-center overflow-hidden rounded-3xl bg-primary/5 border border-primary/10 shadow-2xl", className)} ref={containerRef}>

      {/* ═══ SVG Clip Paths — silhuetas icônicas de cada alimento ═══ */}
      <svg width="0" height="0" className="absolute">
        <defs>
          {/* Banana — crescente original, rotação aplicada via CSS */}
          <clipPath id="clip-banana" clipPathUnits="objectBoundingBox">
            <path d="
              M 0.85 0.05
              C 0.95 0.10, 0.98 0.30, 0.92 0.48
              C 0.85 0.65, 0.65 0.80, 0.42 0.90
              C 0.25 0.97, 0.10 0.98, 0.05 0.92
              C 0.02 0.88, 0.08 0.80, 0.18 0.72
              C 0.35 0.60, 0.55 0.45, 0.68 0.30
              C 0.78 0.18, 0.82 0.08, 0.85 0.05
              Z
            " />
          </clipPath>

          {/* Maçã — dois lobos arredondados no topo com depressão central profunda */}
          <clipPath id="clip-apple" clipPathUnits="objectBoundingBox">
            <path d="
              M 0.50 0.22
              C 0.44 0.12, 0.30 0.10, 0.20 0.18
              C 0.08 0.28, 0.05 0.48, 0.08 0.62
              C 0.12 0.78, 0.25 0.90, 0.40 0.95
              C 0.46 0.97, 0.54 0.97, 0.60 0.95
              C 0.75 0.90, 0.88 0.78, 0.92 0.62
              C 0.95 0.48, 0.92 0.28, 0.80 0.18
              C 0.70 0.10, 0.56 0.12, 0.50 0.22
              Z
            " />
          </clipPath>

          {/* Pera — pescoço bem estreito no topo, corpo largo e redondo embaixo */}
          <clipPath id="clip-pear" clipPathUnits="objectBoundingBox">
            <path d="
              M 0.50 0.05
              C 0.44 0.05, 0.42 0.10, 0.40 0.18
              C 0.38 0.26, 0.35 0.32, 0.28 0.42
              C 0.18 0.54, 0.08 0.64, 0.08 0.74
              C 0.08 0.86, 0.22 0.96, 0.40 0.98
              C 0.46 0.99, 0.54 0.99, 0.60 0.98
              C 0.78 0.96, 0.92 0.86, 0.92 0.74
              C 0.92 0.64, 0.82 0.54, 0.72 0.42
              C 0.65 0.32, 0.62 0.26, 0.60 0.18
              C 0.58 0.10, 0.56 0.05, 0.50 0.05
              Z
            " />
          </clipPath>

          {/* Morango — ombros largos arredondados, ponta acentuada embaixo */}
          <clipPath id="clip-strawberry" clipPathUnits="objectBoundingBox">
            <path d="
              M 0.50 0.08
              C 0.32 0.06, 0.14 0.14, 0.10 0.28
              C 0.06 0.42, 0.12 0.54, 0.22 0.66
              C 0.32 0.78, 0.42 0.88, 0.48 0.94
              C 0.49 0.96, 0.50 0.98, 0.50 0.98
              C 0.50 0.98, 0.51 0.96, 0.52 0.94
              C 0.58 0.88, 0.68 0.78, 0.78 0.66
              C 0.88 0.54, 0.94 0.42, 0.90 0.28
              C 0.86 0.14, 0.68 0.06, 0.50 0.08
              Z
            " />
          </clipPath>
        </defs>
      </svg>

      {/* Renderização das imagens com clip-path */}
      {foodItems.map((item, index) => (
        <div
          key={item.id}
          ref={(el) => { imagesRef.current[index] = el; }}
          className="absolute inset-0 m-auto w-[85%] h-[85%] flex items-center justify-center opacity-0"
          style={{
            clipPath: `url(#${item.clipId})`,
            WebkitClipPath: `url(#${item.clipId})`,
            transform: item.rotation ? `rotate(${item.rotation}deg)` : undefined,
          }}
        >
          <img
            src={item.image}
            alt={item.id}
            className="w-full h-full object-cover"
            style={{
              transform: item.rotation
                ? `rotate(-${item.rotation}deg) scale(1.3) ${item.imageOffset || ''}`
                : item.imageOffset || undefined,
            }}
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent mix-blend-overlay"></div>
        </div>
      ))}

      {/* Indicadores de progresso */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20 pointer-events-none">
        {foodItems.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 rounded-full transition-all duration-500",
              i === activeIndex ? "w-6 bg-primary" : "w-2 bg-primary/30"
            )}
          />
        ))}
      </div>
    </div>
  );
};
