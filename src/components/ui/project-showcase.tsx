"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback, memo } from "react"
import { createPortal } from "react-dom"
import { ArrowUpRight, Moon, Leaf, Brain, Zap, Settings } from "lucide-react"

interface Topic {
  title: string
  description: string
  link: string
  video: string
  icon: React.ElementType
  colorClass: string
  bgClass: string
}

const topics: Topic[] = [
  {
    title: "Sono Reparador",
    description: "Ciclo circadiano e regulação hormonal.",
    link: "#",
    video: "/videos/sono.mp4",
    icon: Moon,
    colorClass: "text-blue-600",
    bgClass: "bg-blue-100",
  },
  {
    title: "Microbiota",
    description: "Saúde intestinal como base da imunidade.",
    link: "#",
    video: "/videos/microbiota.mp4",
    icon: Leaf,
    colorClass: "text-emerald-600",
    bgClass: "bg-emerald-100",
  },
  {
    title: "Psicologia",
    description: "Relação emocional com a comida e saciedade.",
    link: "#",
    video: "/videos/psicologia.mp4",
    icon: Brain,
    colorClass: "text-amber-600",
    bgClass: "bg-amber-100",
  },
  {
    title: "Metabolismo",
    description: "Eficiência energética e saúde celular.",
    link: "#",
    video: "/videos/metabolismo.mp4",
    icon: Zap,
    colorClass: "text-rose-600",
    bgClass: "bg-rose-100",
  },
  {
    title: "Ambiente",
    description: "Contexto social e disponibilidade alimentar.",
    link: "#",
    video: "/videos/ambiente.mp4",
    icon: Settings,
    colorClass: "text-stone-600",
    bgClass: "bg-stone-100",
  },
]

const ProjectItem = memo(({ 
  topic, 
  index, 
  isHovered, 
  onMouseEnter, 
  onMouseLeave 
}: { 
  topic: Topic, 
  index: number, 
  isHovered: boolean,
  onMouseEnter: (index: number) => void,
  onMouseLeave: () => void
}) => {
  const Icon = topic.icon;
  return (
    <a
      href={topic.link}
      className="group block"
      onMouseEnter={() => onMouseEnter(index)}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative py-6 border-t border-outline/20 transition-all duration-300 ease-out">
        {/* Background highlight on hover */}
        <div
          className={`
            absolute inset-0 -mx-6 px-6 rounded-2xl
            transition-all duration-300 ease-out
            ${topic.bgClass} 
            ${isHovered ? "opacity-30 scale-100" : "opacity-0 scale-95"}
          `}
        />

        <div className="relative flex items-center justify-between gap-6 px-4">
          <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 ${topic.colorClass} ${topic.bgClass} shadow-sm border border-black/5 dark:border-white/5`}>
            <Icon className="w-6 h-6 md:w-7 md:h-7" strokeWidth={2} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-3">
              <h3 className="text-on-surface font-headline font-semibold text-xl md:text-2xl tracking-tight">
                <span className="relative">
                  {topic.title}
                  <span
                    className={`
                      absolute left-0 -bottom-1 h-px bg-primary
                      transition-all duration-300 ease-out
                      ${isHovered ? "w-full" : "w-0"}
                    `}
                  />
                </span>
              </h3>

              <ArrowUpRight
                className={`
                  w-5 h-5 text-primary
                  transition-all duration-300 ease-out
                  ${
                    isHovered
                      ? "opacity-100 translate-x-0 translate-y-0"
                      : "opacity-0 -translate-x-3 translate-y-3"
                  }
                `}
              />
            </div>

            <p className={`text-sm md:text-base mt-2 leading-relaxed transition-all duration-300 ease-out ${isHovered ? "text-on-surface" : "text-muted-foreground"}`}>
              {topic.description}
            </p>
          </div>
        </div>
      </div>
    </a>
  );
});

ProjectItem.displayName = "ProjectItem";

export function ProjectShowcase() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  
  // Refs for high performance DOM manipulation
  const videoRef = useRef<HTMLVideoElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const targetPos = useRef({ x: 0, y: 0 })
  const currentPos = useRef({ x: 0, y: 0 })
  const visibilityRef = useRef(0) // 0 for hidden, 1 for visible
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor
    }

    const animate = () => {
      // Smooth interpolation
      currentPos.current.x = lerp(currentPos.current.x, targetPos.current.x, 0.18) // Slightly faster LERP
      currentPos.current.y = lerp(currentPos.current.y, targetPos.current.y, 0.18)

      // Apply directly to DOM via CSS Variables
      if (overlayRef.current) {
        overlayRef.current.style.setProperty("--x", `${currentPos.current.x}px`)
        overlayRef.current.style.setProperty("--y", `${currentPos.current.y}px`)
        
        // Smooth visibility transition handled in CSS, but opacity set here to bypass React
        const currentOpacity = parseFloat(overlayRef.current.style.opacity || "0")
        const targetOpacity = visibilityRef.current
        
        if (Math.abs(currentOpacity - targetOpacity) > 0.01) {
          overlayRef.current.style.opacity = lerp(currentOpacity, targetOpacity, 0.15).toString()
          overlayRef.current.style.transform = `translate3d(calc(var(--x, 0px) + 20px), calc(var(--y, 0px) - 110px), 0) scale(${lerp(0.9, 1, currentOpacity)})`
        }
      }
      
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // Source switching optimization
  useEffect(() => {
    if (videoRef.current && hoveredIndex !== null) {
      const videoPath = topics[hoveredIndex].video;
      if (videoRef.current.currentSrc !== window.location.origin + videoPath) {
        videoRef.current.src = videoPath;
        videoRef.current.load();
        videoRef.current.play().catch(() => {});
      }
    }
  }, [hoveredIndex])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    targetPos.current = {
      x: e.clientX,
      y: e.clientY,
    }
  }, [])

  const handleMouseEnter = useCallback((index: number) => {
    setHoveredIndex(index)
    visibilityRef.current = 1
  }, [])

  const handleMouseLeave = useCallback(() => {
    visibilityRef.current = 0
    setHoveredIndex(null)
  }, [])

  return (
    <section 
      onMouseMove={handleMouseMove} 
      className="relative w-full max-w-4xl mx-auto px-6 py-24 z-20"
    >
      <div className="text-center mb-16">
        <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Ecossistema de Nutrição</span>
        <h2 className="text-4xl md:text-6xl font-headline text-on-surface mb-6 font-semibold">
          Toda semente precisa de um <span className="italic text-primary">entorno fértil.</span>
        </h2>
        <p className="max-w-2xl mx-auto text-muted-foreground text-lg leading-relaxed">
          Não olhamos apenas para o que você come, mas para como o seu corpo processa e como o seu ambiente sustenta suas escolhas diárias.
        </p>
      </div>

      {/* Floating Video Overlay */}
      {createPortal(
        <div
          ref={overlayRef}
          className={`
            pointer-events-none fixed z-[100000] left-0 top-0 w-[340px] h-[220px] 
            overflow-hidden rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] 
            border border-white/20
            opacity-0 scale-90
            showcase-overlay-perf
          `}
        >
          <div className="relative w-full h-full bg-stone-950 rounded-2xl overflow-hidden antigravity-glass">
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-0 transition-opacity duration-300"
              onCanPlay={(e) => {
                // Suaviza a entrada do vídeo quando estiver pronto
                (e.target as HTMLVideoElement).style.opacity = "1";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          </div>
        </div>,
        document.body
      )}

      <div className="space-y-0 relative z-30">
        {topics.map((topic, index) => (
          <ProjectItem 
            key={topic.title}
            topic={topic}
            index={index}
            isHovered={hoveredIndex === index}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        ))}

        <div className="border-t border-outline/20" />
      </div>
    </section>
  )
}
