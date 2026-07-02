"use client"

import { useState, useRef, useEffect } from "react"
import { Link as LinkIcon, Share2 } from "lucide-react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function ShareButton({ url, title }: { url?: string; title?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "")
  const shareTitle = title || ""

  // Fecha ao clicar fora do componente
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  const shareLinks = [
    {
      faClass: "fa-brands fa-whatsapp",
      onClick: () =>
        window.open(
          `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareTitle} - ${shareUrl}`)}`,
          "_blank"
        ),
      label: "WhatsApp",
    },
    {
      faClass: "fa-brands fa-linkedin-in",
      onClick: () =>
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
          "_blank"
        ),
      label: "LinkedIn",
    },
    {
      faClass: "fa-brands fa-instagram",
      onClick: () =>
        window.open(`https://www.instagram.com/`, "_blank"),
      label: "Instagram",
    },
    {
      faClass: "fa-brands fa-facebook-f",
      onClick: () =>
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          "_blank"
        ),
      label: "Facebook",
    },
    {
      lucideIcon: LinkIcon,
      onClick: () => {
        navigator.clipboard.writeText(shareUrl)
        // Feedback visual breve em vez de alert
        const btn = document.getElementById("share-copy-feedback")
        if (btn) {
          btn.textContent = "✓"
          setTimeout(() => { btn.textContent = "" }, 1500)
        }
      },
      label: "Copiar Link",
    },
  ]

  return (
    <div ref={containerRef} className="relative inline-flex items-center">
      {/* Ícones das redes — aparecem à esquerda do botão principal */}
      <div
        className={cn(
          "absolute right-full mr-3 flex items-center gap-2 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
          isOpen
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-4 pointer-events-none"
        )}
      >
        {shareLinks.map((link, index) => (
          <button
            key={link.label}
            onClick={(e) => {
              e.stopPropagation()
              link.onClick()
            }}
            style={{
              transitionDelay: isOpen ? `${index * 60}ms` : "0ms",
              transform: isOpen ? "scale(1)" : "scale(0.5)",
            }}
            className="w-10 h-10 rounded-full border border-outline/20 dark:border-stone-700 bg-background/80 dark:bg-stone-900/80 backdrop-blur-md flex items-center justify-center text-on-surface-variant dark:text-stone-300 hover:bg-primary hover:text-on-primary dark:hover:bg-emerald-500 dark:hover:text-stone-950 transition-all duration-300 hover:scale-110 shadow-sm cursor-pointer"
            aria-label={link.label}
            title={link.label}
          >
            {link.lucideIcon ? (
              <link.lucideIcon className="w-4 h-4" />
            ) : (
              <i className={`${link.faClass} text-base`}></i>
            )}
            {link.label === "Copiar Link" && (
              <span
                id="share-copy-feedback"
                className="absolute -top-1 -right-1 text-[10px] font-bold text-primary dark:text-emerald-400"
              ></span>
            )}
          </button>
        ))}
      </div>

      {/* Botão principal */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "w-12 h-12 rounded-full border-2 border-primary/20 dark:border-emerald-500/20 bg-primary/5 dark:bg-emerald-500/5 text-primary dark:text-emerald-400 flex items-center justify-center transition-all duration-300 active:scale-95 shadow-sm relative z-10 cursor-pointer",
          isOpen
            ? "bg-primary text-on-primary dark:bg-emerald-500 dark:text-stone-950 scale-105 rotate-45"
            : "hover:bg-primary/20 dark:hover:bg-emerald-500/20"
        )}
        aria-label="Compartilhar"
      >
        <Share2 className="w-5 h-5 transition-transform duration-300" />
      </button>
    </div>
  )
}
