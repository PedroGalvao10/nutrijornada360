"use client";

import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

export default function InteractiveParticles() {
  const initParticles = useCallback((isDark: boolean) => {
    // cleanup old canvas
    const oldCanvas = document.querySelector("#particles-js canvas");
    if (oldCanvas) oldCanvas.remove();

    // @ts-ignore
    if (window.pJSDom?.length > 0) {
      // @ts-ignore
      window.pJSDom.forEach((p) => p.pJS.fn.vendors.destroypJS());
      // @ts-ignore
      window.pJSDom = [];
    }

    // Adaptado para a paleta NutriJornada 360
    const colors = isDark
      ? {
          particles: "#8ecf9e", // primary-fixed-dim (verde claro)
          lines: "#4a7c59",     // primary (verde principal)
          accent: "#c4a66a",    // tertiary-container (dourado)
        }
      : {
          particles: "#4a7c59", // primary (verde principal)
          lines: "#78a886",     // primary-container (verde suave)
          accent: "#705c30",    // tertiary (dourado escuro)
        };

    // @ts-ignore
    window.particlesJS("particles-js", {
      particles: {
        number: { value: 120, density: { enable: true, value_area: 800 } },
        color: { value: colors.particles },
        shape: { 
          type: "circle", 
          stroke: { width: 0, color: "#000000" } 
        },
        opacity: {
          value: 0.6,
          random: true,
          anim: { enable: true, speed: 0.8, opacity_min: 0.2, sync: false },
        },
        size: {
          value: 4,
          random: true,
          anim: { enable: true, speed: 2, size_min: 0.3, sync: false },
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: colors.lines,
          opacity: 0.3,
          width: 1.2,
        },
        move: { 
            enable: true, 
            speed: 2.2, 
            direction: "none", 
            random: true, 
            straight: false, 
            out_mode: "out",
            bounce: false,
            attract: { enable: true, rotateX: 600, rotateY: 1200 }
        },
      },
      interactivity: {
        detect_on: "window", // IMPORTANTE: Detectar na janela inteira
        events: {
          onhover: { 
            enable: true, 
            mode: "grab" // Seguir o mouse com linhas
          },
          onclick: { 
            enable: true, 
            mode: "push" // Adicionar partículas ao clicar
          },
          resize: true,
        },
        modes: {
          grab: { 
            distance: 200, 
            line_linked: { opacity: 0.8 } 
          },
          bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
          repulse: { distance: 200, duration: 0.4 },
          push: { particles_nb: 4 },
          remove: { particles_nb: 2 },
        },
      },
      retina_detect: true,
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Verificar se o script já existe para evitar duplicatas
    if (!document.getElementById('particles-script')) {
      const script = document.createElement("script");
      script.id = 'particles-script';
      script.src = "https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const html = document.documentElement;
        const detectDark = () =>
          html.classList.contains("dark") ||
          html.getAttribute("data-theme") === "dark";

        initParticles(detectDark());

        const observer = new MutationObserver(() =>
          initParticles(detectDark())
        );
        observer.observe(html, {
          attributes: true,
          attributeFilter: ["class", "data-theme"],
        });
      };
    } else {
      const html = document.documentElement;
      const detectDark = () =>
        html.classList.contains("dark") ||
        html.getAttribute("data-theme") === "dark";
      
      setTimeout(() => {
        if ((window as any).particlesJS) {
            initParticles(detectDark());
        }
      }, 100);
    }

    return () => {
      const canvas = document.querySelector("#particles-js canvas");
      if (canvas) canvas.remove();
    };
  }, [initParticles]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      id="particles-js"
      className={`
        fixed inset-0 z-[-1] pointer-events-none
        transition-colors duration-1000
        bg-gradient-to-tr from-[#faf6f0] via-[#f2eee6] to-[#e8f5ec]
        dark:from-[#0c0a09] dark:via-[#1a1c1a] dark:to-[#1e3a2a]
      `}
    />,
    document.body
  );
}
