/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#4a7c59",
        "on-primary": "#ffffff",
        "primary-container": "#78a886",
        "on-primary-container": "#d8f0de",
        
        "secondary": "#6b6358",
        "on-secondary": "#ffffff",
        "secondary-container": "#f0e8db",
        "on-secondary-container": "#5e5548",

        /* Terciário recalibrado: laranja -> ouro editorial (direção Editorial Orgânico) */
        "tertiary": "#a08339",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#f0e5cb",
        "on-tertiary-container": "#4a3c15",

        /* Tokens da direção Editorial Orgânico */
        "verde-profundo": "#1e3a2a",
        "verde-nevoa": "#dce8df",
        "ouro": "#a08339",
        "ouro-suave": "#c9b073",
        "creme-2": "#f3ece1",

        "background": "#faf6f0",
        "on-background": "#2e3230",
        "surface": "#faf6f0",
        "on-surface": "#2e3230",
        "surface-variant": "#e4e0d8",
        "on-surface-variant": "#4a4e4a",
        "outline": "#74796e",
        "error": "#b83230",
        "on-error": "#ffffff",
        
        /* Original MD3 Tokens preserved for absolute compatibility */
        "primary-fixed-dim": "#8ecf9e",
        "surface-dim": "#dbd7cf",
        "on-tertiary-fixed-variant": "#554020",
        "surface-container-high": "#eae6de",
        "surface-container": "#f0ece4",
        "inverse-primary": "#8ecf9e",
        "surface-tint": "#4a7c59",
        "tertiary-fixed-dim": "#dcc48e",
        "inverse-on-surface": "#f5f0e8",
        "secondary-fixed-dim": "#d4ccbf",
        "on-error-container": "#690005",
        "on-secondary-fixed": "#1e1a13",
        "surface-container-low": "#f5f1ea",
        "surface-bright": "#faf6f0",
        "error-container": "#ffdad8",
        "primary-fixed": "#c8e8d0",
        "surface-container-highest": "#e4e0d8",
        "outline-variant": "#c4c8bc",
        "on-primary-fixed-variant": "#2a6038",
        "on-tertiary-fixed": "#221a05",
        "inverse-surface": "#2e3230",
        "secondary-fixed": "#f0e8db",
        "surface-container-lowest": "#ffffff",
        "on-secondary-fixed-variant": "#4a4538",
        "on-primary-fixed": "#002110",
        "tertiary-fixed": "#f8e0a8"
      },
      fontFamily: {
        "headline": ["Lora", "serif"],
        "body": ["Raleway", "sans-serif"],
        "label": ["Raleway", "sans-serif"],
        "handwriting": ["Caveat", "cursive"]
      },
      boxShadow: {
        "float-1": "0 12px 32px rgba(38,48,43,.07)",
        "float-2": "0 28px 64px rgba(38,48,43,.12)",
      },
      borderRadius: {
        "blob": "30% 70% 70% 30% / 30% 30% 70% 70%",
        "blob-alt": "60% 40% 30% 70% / 60% 30% 70% 40%"
      },
      animation: {
        "breathing": "breathing 8s ease-in-out infinite",
        "blob-spin": "blob-spin 15s linear infinite",
        "marquee-slow": "marquee 80s linear infinite",
        "marquee-reverse-slow": "marquee-reverse 80s linear infinite",
        "fade-in-up": "fadeInUp 0.8s ease-out forwards",
        "float-drift": "floatDrift 7s ease-in-out infinite",
      },
      keyframes: {
        // Flutuação suave para imagens do hero de Alimentos.
        // --float-rot preserva a rotação estática de cada imagem.
        floatDrift: {
          '0%, 100%': { transform: 'translateY(0) rotate(var(--float-rot, 0deg))' },
          '50%': { transform: 'translateY(-18px) rotate(var(--float-rot, 0deg))' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        breathing: {
          '0%, 100%': { transform: 'scale(1) translateY(0)', opacity: '0.8' },
          '50%': { transform: 'scale(1.05) translateY(-5px)', opacity: '1' },
        },
        'blob-spin': {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'rotate(180deg) scale(1.1)' },
          '100%': { transform: 'rotate(360deg) scale(1)' },
        },
        'fadeInUp': {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
