# Documentação de Melhorias Estéticas — site_mariana_react
**Baseada nos aprendizados de: LandoNorris Clone · AndreaClone · RegisGrumberg Clone**
**Data:** 2026-06-07 | **Stack atual:** Vite + React + TS + Tailwind + GSAP + Framer Motion

---

## Estado atual — diagnóstico rápido

| Área | Estado | Referência |
|---|---|---|
| Cursor | 2 camadas, GSAP tween por mousemove | RegisGrumberg tem 3 camadas + rAF puro |
| Scroll signal | ~4 listeners independentes | RegisGrumberg: 1 `SiteProgressProvider` |
| Velocity FX | Nenhum | Regis: título distorce, marquee inverte |
| Easing | Inconsistente (3 sistemas diferentes) | Cada clone tem 1 easing de assinatura |
| Tipografia | Lora + Raleway, sem mistura intra-elemento | LandoNorris: `MixedHeading` serif+sans |
| Ritmo de seções | Backgrounds muito parecidos | Lando alterna creme/escuro com propósito |
| SplashScreen exit | Fade simples `opacity 0.6s` | Regis: exit curve 3 fases |
| MouseParallax | Ausente | Regis: `data-parallax` pervasivo |
| ScrollProgress | Ausente | Regis: `scaleX` via progressRef |
| `useTilt` | GSAP tween em cada mousemove | Regis: rAF com refs, sem tween |
| Tokens de marca | Material Design 3 genérico | Seed/BeWell: nomenclatura com identidade |

---

## 1. ARQUITETURA — Crítico (antes de qualquer visual)

### 1.1 Criar SiteProgressProvider

**Problema atual:** `useScrollReveal`, `useScrollCanvas`, `useDynamicShadow` e outros hooks criam listeners de scroll independentes. Cada um faz seu próprio `window.addEventListener('scroll', ...)` ou cria seu próprio `requestAnimationFrame`.

**Padrão correto (do RegisGrumberg):**

```tsx
// src/context/SiteProgressContext.tsx
const SiteProgressContext = createContext<{
  progressRef: RefObject<number>;   // scroll normalizado 0→1
  velocityRef: RefObject<number>;   // px/frame (signed)
  mouseRef: RefObject<{ x: number; y: number }>; // normalizado -1→1
} | null>(null);

export function SiteProgressProvider({ children }) {
  const progressRef = useRef(0);
  const velocityRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let prev = 0;
    let rafId: number;

    const tick = () => {
      const next = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      velocityRef.current = window.scrollY - prev;
      prev = window.scrollY;
      progressRef.current += (next - progressRef.current) * 0.12; // lerp
      rafId = requestAnimationFrame(tick);
    };

    const onMouse = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener('mousemove', onMouse, { passive: true });
    rafId = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMouse);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <SiteProgressContext.Provider value={{ progressRef, velocityRef, mouseRef }}>
      {children}
    </SiteProgressContext.Provider>
  );
}

export const useSiteProgress = () => {
  const ctx = useContext(SiteProgressContext);
  if (!ctx) throw new Error('useSiteProgress fora do SiteProgressProvider');
  return ctx;
};
```

**Consumidores que devem migrar para este contexto:**
- `useScrollReveal` → lê `progressRef`
- `ScrollingText` / marquee → lê `velocityRef`
- `CustomCursor` → lê `mouseRef`
- `useDynamicShadow` → lê `progressRef`
- futuro `MouseParallaxLayer` → lê `mouseRef`
- futuro `ScrollProgress` → lê `progressRef`

**Regra:** Nenhum componente deve criar listener de `scroll` ou `mousemove` próprio. Tudo lê os refs do provider.

---

### 1.2 Remover `scroll-behavior: smooth` do CSS

**Arquivo:** `src/index.css` linha ~47

```css
/* ❌ REMOVER — conflita com smooth scroll virtual futuro */
body {
  scroll-behavior: smooth;
}
```

`scroll-behavior: smooth` do browser entra em conflito com qualquer interceptação de wheel para lerp customizado. O scroll suave deve ser controlado por JS (lerp 0.085 + `scrollTo({ behavior: 'instant' })`).

---

## 2. CURSOR — De 2 camadas para 3 camadas com mix-blend

### Problema atual

O `CustomCursor` atual:
- Usa GSAP `to()` em cada `mousemove` → cria novos tweens por frame
- Só tem 2 camadas (dot + ring)
- Sem `mix-blend-difference`
- Detecta mobile via `useState` → re-render desnecessário

### Implementação correta

```tsx
// src/components/ui/CustomCursor.tsx — substituição completa
export function CustomCursor() {
  const dotRef   = useRef<HTMLDivElement>(null);  // 1:1, lerp 1.0
  const midRef   = useRef<HTMLDivElement>(null);  // lerp 0.22
  const ringRef  = useRef<HTMLDivElement>(null);  // lerp 0.10
  const hovering = useRef(false);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return; // touch: sai

    let cx = 0, cy = 0;  // mid
    let rx = 0, ry = 0;  // ring
    let mx = 0, my = 0;  // target

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      // dot: 1:1
      dotRef.current!.style.transform = `translate(${mx}px, ${my}px)`;
    };

    const tick = () => {
      cx += (mx - cx) * 0.22;
      cy += (my - cy) * 0.22;
      rx += (mx - rx) * 0.10;
      ry += (my - ry) * 0.10;

      midRef.current!.style.transform  = `translate(${cx}px, ${cy}px)`;
      ringRef.current!.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(tick);
    };

    // hover scale via event delegation — 1 listener para o documento
    const onOver = (e: Event) => {
      const t = (e.target as HTMLElement).closest('a, button, [data-cursor]');
      if (!t) return;
      hovering.current = true;
      ringRef.current!.style.scale = '2.4';
    };
    const onOut = (e: Event) => {
      const t = (e.target as HTMLElement).closest('a, button, [data-cursor]');
      if (!t) return;
      hovering.current = false;
      ringRef.current!.style.scale = '1';
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    const raf = requestAnimationFrame(tick);

    document.body.style.cursor = 'none';
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      cancelAnimationFrame(raf);
      document.body.style.cursor = '';
    };
  }, []);

  return (
    <>
      {/* Dot: mix-blend-difference — inverte cor sobre qualquer fundo */}
      <div ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-white pointer-events-none z-[99999]"
        style={{ mixBlendMode: 'difference', transform: 'translate(-50%, -50%)', willChange: 'transform' }}
      />
      {/* Mid ring */}
      <div ref={midRef}
        className="fixed top-0 left-0 w-5 h-5 rounded-full border border-primary/60 pointer-events-none z-[99998]"
        style={{ transform: 'translate(-50%, -50%)', willChange: 'transform', transition: 'scale 0.3s ease' }}
      />
      {/* Outer ring — escala no hover */}
      <div ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-primary/30 pointer-events-none z-[99997]"
        style={{ transform: 'translate(-50%, -50%)', willChange: 'transform', transition: 'scale 0.35s cubic-bezier(0.16,1,0.3,1)' }}
      />
    </>
  );
}
```

**Diferenças chave:**
- `mix-blend-difference` no dot → cursor sempre legível em qualquer background
- 3 lerps distintos (1.0 / 0.22 / 0.10) → profundidade cinética
- Event delegation via `.closest()` → 1 listener para todo o DOM
- `window.matchMedia('(hover: hover)')` em vez de `window.innerWidth < 768`

---

## 3. useTilt — GSAP tween → rAF com ref

### Problema atual

```ts
// ❌ ATUAL — cria tween novo em cada mousemove
const onMouseMove = (e: MouseEvent) => {
  gsap.to(el, { rotateX: tiltX, rotateY: tiltY, duration: 0.5 });
};
```

### Implementação correta

```ts
// src/hooks/useTilt.ts — substituição
export function useTilt(ref: RefObject<HTMLElement | null>, intensity = 10) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let targetRx = 0, targetRy = 0;
    let currentRx = 0, currentRy = 0;
    let rafId: number;
    let active = false;

    const tick = () => {
      currentRx += (targetRx - currentRx) * 0.12;
      currentRy += (targetRy - currentRy) * 0.12;
      el.style.transform = `perspective(800px) rotateX(${currentRx.toFixed(2)}deg) rotateY(${currentRy.toFixed(2)}deg)`;
      if (active || Math.abs(currentRx) > 0.01 || Math.abs(currentRy) > 0.01) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const onMove = (e: MouseEvent) => {
      const { left, top, width, height } = el.getBoundingClientRect();
      const px = (e.clientX - left) / width  - 0.5; // -0.5 → +0.5
      const py = (e.clientY - top)  / height - 0.5;
      targetRx = -py * intensity; // fórmula RegisGrumberg Round 8
      targetRy =  px * intensity;
    };

    const onEnter = () => { active = true; cancelAnimationFrame(rafId); tick(); };
    const onLeave = () => { active = false; targetRx = 0; targetRy = 0; tick(); };

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafId);
    };
  }, [ref, intensity]);
}
```

**Diferença:** Zero tweens GSAP. O rAF roda apenas quando o card está ativo ou ainda decelerando.

---

## 4. EASING — Assinatura única

### Problema atual

Três sistemas de easing convivendo sem consistência:
- `StaggerReveal`: `[0.16, 1, 0.3, 1]` (Framer Motion)
- `useTilt`: `power2.out` (GSAP)
- Botões: `transition-all duration-300` (CSS padrão)
- Cursor: `power3.out` (GSAP)

### Solução

Definir **1 easing de assinatura** no `:root` e usá-lo em tudo:

```css
/* src/index.css */
:root {
  /* Easing de assinatura — curva orgânica com entrada suave e saída rápida */
  --ease-mariana: cubic-bezier(0.16, 1, 0.3, 1);
  /* Duração padrão de transição */
  --duration-default: 0.65s;
}
```

```ts
// Framer Motion
ease: [0.16, 1, 0.3, 1]

// GSAP
ease: 'power3.out'  ← manter como proxy aceitável
// Melhor: usar CustomEase.create('mariana', '0.16, 1, 0.3, 1') uma vez

// CSS Tailwind
// tailwind.config.js
transitionTimingFunction: {
  'mariana': 'cubic-bezier(0.16, 1, 0.3, 1)',
}
// uso: ease-mariana
```

**Onde aplicar:** StaggerReveal, useTilt, MagneticButton, hover de cards, PageTransition, botões. A coerência sensorial vem de usar o mesmo easing em tudo, não de cada componente inventar o seu.

---

## 5. VELOCITY-DRIVEN EFFECTS — Dois componentes faltando

### 5.1 MarqueeVelocity (substituir o marquee CSS atual)

O marquee atual (`animate-marquee-slow`) é CSS puro e não reage ao scroll.

```tsx
// src/components/ui/MarqueeVelocity.tsx
export function MarqueeVelocity({ children, baseSpeed = 0.5 }) {
  const { velocityRef } = useSiteProgress();
  const xRef = useRef(0);
  const reverseRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf: number;
    const tick = () => {
      const vel = velocityRef.current;
      const dir = vel > 0.4 ? false : vel < -0.4 ? true : reverseRef.current; // histerese
      reverseRef.current = dir;
      const speed = baseSpeed + Math.abs(vel) * 0.04;
      xRef.current -= dir ? -speed : speed;
      if (containerRef.current) {
        containerRef.current.style.transform = `translateX(${xRef.current % (containerRef.current.scrollWidth / 2)}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [baseSpeed]);

  return (
    <div className="overflow-hidden">
      <div ref={containerRef} className="flex whitespace-nowrap will-change-transform">
        {children}{children} {/* duplicado para loop infinito */}
      </div>
    </div>
  );
}
```

### 5.2 Velocity distortion no título do Hero

```tsx
// Adicionar em src/pages/Home.tsx dentro do useEffect
const titleRef = useRef<HTMLHeadingElement>(null);

// No rAF loop do SiteProgressProvider, ou num useEffect local:
useEffect(() => {
  const { velocityRef } = useSiteProgress();
  let raf: number;
  const tick = () => {
    const v = Math.max(-50, Math.min(50, velocityRef.current));
    if (titleRef.current) {
      const scaleY = 1 + Math.abs(v) * 0.008;  // máx ~1.4
      const skewY  = -v * 0.12;                 // graus
      titleRef.current.style.transform = `scaleY(${scaleY}) skewY(${skewY}deg)`;
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}, []);
```

Aplicar `ref={titleRef}` no `<h1>` do hero. O efeito é imperceptível em scroll lento, dramático em scroll rápido.

---

## 6. MOUSE PARALLAX PERVASIVO

Adicionar ao `SiteProgressProvider` ou como componente separado:

```tsx
// src/components/ui/MouseParallaxLayer.tsx
export function MouseParallaxLayer() {
  const { mouseRef } = useSiteProgress();

  useEffect(() => {
    let els: HTMLElement[] = [];
    let raf: number;

    const scan = () => {
      els = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
    };

    const tick = () => {
      const { x, y } = mouseRef.current;
      els.forEach(el => {
        const intensity = parseFloat(el.dataset.parallax || '10');
        const invert = el.dataset.parallaxInvert === 'true' ? -1 : 1;
        el.style.setProperty('--parallax-x', `${x * intensity * invert}px`);
        el.style.setProperty('--parallax-y', `${y * intensity * invert}px`);
        el.style.transform = `translate3d(var(--parallax-x), var(--parallax-y), 0)`;
      });
      raf = requestAnimationFrame(tick);
    };

    scan();
    const interval = setInterval(scan, 800); // captura conteúdo dinâmico
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); clearInterval(interval); };
  }, []);

  return null;
}
```

**Uso nos elementos:** `<div data-parallax="15">` ou `<img data-parallax="8" data-parallax-invert="true">`.

Adicionar em elementos da MissionSection, hero image, floating elements do PlansSection.

---

## 7. SCROLL PROGRESS BAR

```tsx
// src/components/ui/ScrollProgress.tsx
export function ScrollProgress() {
  const { progressRef } = useSiteProgress();
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf: number;
    const tick = () => {
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progressRef.current})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[99996] pointer-events-none"
      style={{
        background: 'linear-gradient(to right, var(--color-primary), var(--color-tertiary))',
        willChange: 'transform',
        transformOrigin: 'left',
      }}
    />
  );
}
```

`scaleX` em vez de `width: X%` — não causa layout reflow.

---

## 8. SPLASHSCREEN — Exit curve em 3 fases

### Problema atual

```ts
// ❌ ATUAL — fade simples
opacity: isFadingOut ? 0 : 1,
transition: 'opacity 0.6s ease-in-out',
```

### Substituição (RegisGrumberg pattern)

```tsx
const handleVideoEnd = () => {
  if (!splashRef.current) return;
  const el = splashRef.current;

  // Fase 1: overshoot leve (0 → 150ms)
  el.style.transition = 'transform 150ms cubic-bezier(0.16,1,0.3,1)';
  el.style.transform = 'scale(1.04)';

  // Fase 2: settle (150ms → 250ms)
  setTimeout(() => {
    el.style.transition = 'transform 100ms ease-in';
    el.style.transform = 'scale(1.0)';
  }, 150);

  // Fase 3: dive — o splash "mergulha" para trás
  setTimeout(() => {
    el.style.transition = 'transform 500ms cubic-bezier(0.4,0,1,1), opacity 500ms ease-in';
    el.style.transform = 'scale(0.43)';
    el.style.opacity = '0';
  }, 250);

  setTimeout(onComplete, 750);
};
```

Resultado: o site *emerge de trás* do splash em vez de o splash simplesmente desaparecer.

---

## 9. TIPOGRAFIA — MixedHeading

### O que está faltando

LandoNorris revelou o padrão mais impactante: mistura de **serif de alto contraste + grotesque heavy** dentro de um mesmo título. O resultado é hierarquia dramática com uma única linha.

**Implementação:**

```tsx
// src/components/ui/MixedHeading.tsx
// Marcação: texto com *asterisco* = palavra serif, resto = sans
// Ex: "Faça as pazes *com a comida*"

interface MixedHeadingProps {
  text: string;           // palavras entre *asteriscos* viram serif
  sansClass?: string;     // ex: "font-body font-black"
  serifClass?: string;    // ex: "font-headline italic"
  className?: string;
}

export function MixedHeading({ text, sansClass = 'font-body font-bold', serifClass = 'font-headline italic', className = '' }: MixedHeadingProps) {
  const parts = text.split(/\*([^*]+)\*/);
  return (
    <span className={className}>
      {parts.map((part, i) =>
        i % 2 === 1
          ? <span key={i} className={serifClass}>{part}</span>
          : <span key={i} className={sansClass}>{part}</span>
      )}
    </span>
  );
}
```

**Uso imediato:**

```tsx
// Hero h1 — antes:
<h1>Faça as pazes com a comida</h1>

// depois:
<h1 className="text-7xl leading-[1.05]">
  <MixedHeading
    text="Faça as pazes *com a comida*"
    sansClass="font-body font-black text-on-background"
    serifClass="font-headline italic text-primary"
  />
</h1>

// MissionSection:
<MixedHeading
  text="O ser humano *não é* uma ilha isolada."
  serifClass="font-headline italic text-primary"
/>
```

---

## 10. RITMO DE SEÇÕES — Alternância creme/escuro

### Problema atual

Todas as seções usam variações de `bg-background` ou `bg-stone-900`. Sem ritmo visual deliberado.

### Padrão LandoNorris

Alternar a cada seção com propósito:
- **Creme/orgânico** (`#faf6f0`) → conteúdo denso, cards, texto longo
- **Escuro** (`stone-900`) → statements declarativos, planos, impacto
- **Acento único reservado** (tertiary `#EA8C5F`) → aparece APENAS no CTA final ou footer

**Mapa de seções proposto:**

```
Hero              → bg-background (creme)     — acolhimento, entrada suave
Spline/3D         → bg-background (creme)     — continuidade
MissionSection    → bg-stone-900 (escuro)     — statement forte, autoridade
HomeToolsSection  → bg-background (creme)     — conteúdo técnico, legibilidade
PlansSection      → bg-stone-900 (escuro)     — impacto, conversão
ContainerScroll   → bg-background (creme)     — voltando à base
ArticlesSection   → bg-surface-container      — conteúdo editorial, leve
Footer            → bg-stone-900 + tertiary   — fecha com acento único
```

**Regra:** `bg-tertiary` (`#EA8C5F`) não deve aparecer como fundo de seção — só em badges, destaques ou o botão final. O acento reservado tem mais peso quando aparece uma vez.

---

## 11. TOKENS DE MARCA — Nomenclatura com identidade

### Problema atual

Os tokens seguem MD3 genérico: `primary`, `secondary`, `tertiary`. Funcionam mas não têm personalidade.

### Proposta (inspirada em Seed + BeWell)

```js
// tailwind.config.js — adicionar aliases com nome de marca
colors: {
  // Cores existentes mantidas como base técnica
  // Aliases com personalidade:
  "mariana": {
    "verde":    "#4a7c59",  // = primary
    "creme":    "#faf6f0",  // = background  
    "terracota":"#EA8C5F",  // = tertiary — "calor, humanidade"
    "seco":     "#4a4e4a",  // = on-surface-variant
    "nuvem":    "#e4e0d8",  // = surface-variant
  }
}
```

Isso não quebra nada (os tokens MD3 continuam funcionando), mas permite usar `bg-mariana-creme`, `text-mariana-verde` em novos componentes com nomes que têm intenção semântica da marca.

---

## 12. SVG UNDERLINE em links do Footer

Substituir pseudo-element hover por SVG com `stroke-dashoffset`:

```tsx
// src/components/ui/SvgUnderlineLink.tsx
export function SvgUnderlineLink({ children, href, ...props }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      className="relative inline-block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...props}
    >
      {children}
      <svg
        className="absolute -bottom-0.5 left-0 w-full overflow-visible"
        height="2"
        preserveAspectRatio="none"
      >
        <line
          x1="0" y1="1" x2="100%" y2="1"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="100%"
          strokeDashoffset={hovered ? '0%' : '100%'}
          style={{ transition: 'stroke-dashoffset 0.45s cubic-bezier(0.16,1,0.3,1)' }}
        />
      </svg>
    </a>
  );
}
```

Vantagem sobre `::after`: `strokeLinecap: round` nas pontas + pode seguir paths curvos futuramente.

---

## 13. PERFORMANCE — Resumo das mudanças de arquitetura

| Componente | Antes | Depois |
|---|---|---|
| `CustomCursor` | GSAP `to()` por mousemove (N tweens) | rAF puro, DOM direto |
| `useTilt` | GSAP `to()` por mousemove (N tweens) | rAF puro, lerp manual |
| Scroll listeners | ~4 independentes | 1 `SiteProgressProvider` |
| `StaggerReveal` | Framer Motion | Manter por ora (aceitável) |
| `MagneticButton` | Framer Motion MotionValue | Manter (zero re-renders) |
| Marquee | CSS animation (não reativo) | `MarqueeVelocity` via velocityRef |
| SplashScreen | `opacity fade` state | Exit curve 3 fases via CSS transition direto |

---

## Ordem de implementação recomendada

### Sprint 1 — Fundação (não tem efeito visual imediato, mas destrava tudo)
1. `SiteProgressProvider` + `useSiteProgress` hook
2. Remover `scroll-behavior: smooth` do CSS
3. Migrar `useDynamicShadow` e `useScrollReveal` para `progressRef`

### Sprint 2 — Animações de interação (impacto visual alto)
4. `CustomCursor` 3 camadas + mix-blend
5. `useTilt` via rAF puro
6. `SplashScreen` exit curve 3 fases

### Sprint 3 — Scroll FX (o que torna o site "vivo")
7. `ScrollProgress` barra scaleX
8. `MarqueeVelocity` substituindo CSS marquee
9. Velocity distortion no `<h1>` do hero

### Sprint 4 — Estética (o que muda a percepção de qualidade)
10. `MixedHeading` no hero + MissionSection
11. Ritmo de seções (alternância creme/escuro)
12. Easing único (`--ease-mariana`) em tudo
13. `MouseParallaxLayer` + `data-parallax` nos elementos certos

### Sprint 5 — Detalhes de acabamento
14. `SvgUnderlineLink` no footer
15. Tokens de marca com aliases (`mariana-*`)
16. Verificar e consolidar imports Framer Motion (bundle audit)

---

## Referências dos clones

- `lesson_regisgrumberg_round8.md` — SmoothScroll, MagneticButton, Tilt, RevealText, MarqueeVelocity, ScrollProgress, SVG underline, NumberedSection
- `lesson_deep_recon_animations.md` — Cursor 3 camadas, SiteProgressProvider, MouseParallax, velocity distortion, WebGL atmosférico
- `project_landonorris_clone.md` — MixedHeading, ritmo de seções, easing assinatura, tokens
- `lesson_three_lenis_perf_pitfalls.md` — progressRef vs setState, rAF vs GSAP tween
- `project_andreaclone.md` — easing sigmoid, Lenis pattern, dual cursor
