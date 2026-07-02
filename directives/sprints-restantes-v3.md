# Sprints Restantes — site_mariana_react (v3 consolidada)
**Pós análise complementar (design-critique).** Atualizado: 2026-06-07
**Stack:** Vite + React + TS + Tailwind + Framer Motion + GSAP

---

## Status geral

| Sprint | Tema | Estado |
|---|---|---|
| 1 | Fundação (SiteProgressProvider, scaleX, checkBg rAF) | ✅ Concluída |
| 2 | Interação (cursor 3 camadas, useTilt rAF, splash exit) | ✅ Concluída |
| 3 | Scroll FX (display type, velocity distortion, MarqueeVelocity, scroll cue) | ✅ Concluída |
| 4 | Estética de marca | ⬜ Pendente |
| 5 | Layout editorial + organicidade | ⬜ Pendente |
| 6 | Acabamento + conversão | ⬜ Pendente |

> A análise complementar de design (design-critique) reorganizou as sprints originais 4–5 e adicionou novos itens de layout editorial, textura e movimento de rota. Itens **6A-1 (display type)** e **6A-3 (scroll cue)** já foram absorvidos pela Sprint 3.

---

## SPRINT 4 — Estética de Marca

> Foco: dar **personalidade tipográfica e cromática** que diferencia o site de um template MD3 genérico. Impacto na percepção de qualidade.

### 4.1 — MixedHeading (serif + grotesque intra-título)

**Novo arquivo:** `src/components/ui/MixedHeading.tsx`
Marca palavras entre `*asteriscos*` como serif itálica; resto vira grotesque heavy.

```tsx
interface MixedHeadingProps {
  text: string;
  sansClass?: string;
  serifClass?: string;
  className?: string;
}
export function MixedHeading({ text, sansClass = 'font-body font-bold', serifClass = 'font-headline italic', className = '' }: MixedHeadingProps) {
  const parts = text.split(/\*([^*]+)\*/);
  return (
    <span className={className}>
      {parts.map((p, i) => i % 2 === 1
        ? <span key={i} className={serifClass}>{p}</span>
        : <span key={i} className={sansClass}>{p}</span>)}
    </span>
  );
}
```

**Aplicar em:** MissionSection (`"O ser humano *não é* uma ilha isolada"`), SectionHeading dos blocos internos. **Não** no h1 do hero — ele já usa TextRotate.

### 4.2 — Ritmo de seções creme/escuro

Alternância deliberada (padrão LandoNorris):

```
Hero            → creme    (acolhimento)
Spline 3D       → creme    (continuidade)
MissionSection  → escuro   (statement, autoridade)
Marquee         → creme    (respiro)
HomeToolsSection→ creme    (conteúdo técnico)
PlansSection    → escuro   (impacto, conversão)
ContainerScroll → creme    (volta à base)
ArticlesSection → surface  (editorial leve)
Footer          → escuro + tertiary (acento único)
```

**Regra:** `bg-tertiary` (#EA8C5F) **nunca** como fundo de seção — só em badge, destaque ou CTA final. Acento reservado pesa mais quando aparece uma vez.

### 4.3 — Easing único `--ease-mariana`

`src/index.css :root`:
```css
:root {
  --ease-mariana: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-default: 0.65s;
}
```
`tailwind.config.js`:
```js
transitionTimingFunction: { 'mariana': 'cubic-bezier(0.16, 1, 0.3, 1)' }
```
**Migrar:** StaggerReveal, MagneticButton, hover de cards, PageTransition, botões. Trocar `transition-all duration-300` genérico por `ease-mariana`.

### 4.4 — MouseParallaxLayer

**Novo arquivo:** `src/components/ui/MouseParallaxLayer.tsx` (lê `mouseRef`).
Elementos com `data-parallax="N"` recebem `translate3d` proporcional à posição do mouse.

```tsx
export function MouseParallaxLayer() {
  const { mouseRef } = useSiteProgress();
  useEffect(() => {
    let els: HTMLElement[] = [], raf: number;
    const scan = () => { els = [...document.querySelectorAll<HTMLElement>('[data-parallax]')]; };
    const tick = () => {
      const { x, y } = mouseRef.current;
      els.forEach(el => {
        const i = parseFloat(el.dataset.parallax || '10');
        const inv = el.dataset.parallaxInvert === 'true' ? -1 : 1;
        el.style.transform = `translate3d(${x*i*inv}px, ${y*i*inv}px, 0)`;
      });
      raf = requestAnimationFrame(tick);
    };
    scan(); const iv = setInterval(scan, 800); raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); clearInterval(iv); };
  }, [mouseRef]);
  return null;
}
```
**Montar** uma vez no Layout. **Aplicar** `data-parallax` nas frutas do hero, floating elements da MissionSection. **Cuidado:** não usar em elementos que já têm transform próprio (useTilt, StaggerItem).

---

## SPRINT 5 — Layout Editorial + Organicidade

> Foco: as mudanças **mais brutais** de percepção visual. Quebra o layout centralizado e adiciona textura/forma orgânica.

### 5.1 — Hero layout editorial assimétrico

Hoje o hero usa `grid md:grid-cols-2` mas a coluna direita está vazia (reservada p/ 3D). Texto está centralizado em mobile e left em desktop — ok. **Melhoria:** preencher a coluna direita com a foto de frutas **curada e sem transparência** (em vez de background full-bleed atrás do texto).

- Coluna esquerda (60%): texto left-aligned
- Coluna direita (40%): imagem editorial com `mask` de borda suave + `data-parallax="12"`
- Remove o background de frutas atrás do texto (vira ruído sob a tipografia)
- Mobile: mantém empilhado, imagem abaixo do texto

### 5.2 — Grain texture nas seções creme

**Novo:** pseudo-elemento com SVG noise (≈300 bytes) sobre `bg-background`.
```css
.grain-creme::after {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background-image: url("data:image/svg+xml,...feTurbulence...");
  opacity: 0.04; mix-blend-mode: multiply;
}
```
Superfície creme deixa de ser plástica → orgânica. Já existe `PremiumGrain.tsx` — **verificar se cobre** ou se precisa de variante por seção.

### 5.3 — Clip-path orgânico entre seções

Bordas inferiores de seções escuras com curva em vez de corte reto:
```css
clip-path: ellipse(120% 100% at 50% 0%);
```
Linguagem visual de corpo/movimento, alinhada ao produto (nutrição/corpo). Custo zero (CSS puro).

### 5.4 — Ajustes de hierarquia do topo

- Separar logo (fixed left) da nav pill (flutuante centro-direita) — hoje competem pelo olhar com o h1
- Badge "Abordagem Comportamental": `border-mariana-verde`, `bg-mariana-creme/70`, sem ícone externo redundante

---

## SPRINT 6 — Acabamento + Conversão

### 6.1 — SvgUnderlineLink no footer

`stroke-dashoffset` animado em vez de `::after`. `strokeLinecap: round`.
```tsx
<line x1="0" y1="1" x2="100%" y2="1" stroke="currentColor" strokeWidth="1.5"
  strokeLinecap="round" strokeDasharray="100%"
  strokeDashoffset={hovered ? '0%' : '100%'}
  style={{ transition: 'stroke-dashoffset 0.45s var(--ease-mariana)' }} />
```

### 6.2 — Tokens de marca `mariana-*`

`tailwind.config.js` — aliases com identidade (sem quebrar MD3):
```js
mariana: {
  verde: '#4a7c59', creme: '#faf6f0', terracota: '#EA8C5F',
  seco: '#4a4e4a', nuvem: '#e4e0d8',
}
```
Usar `bg-mariana-creme`, `text-mariana-verde` em novos componentes.

### 6.3 — Page route transition (clip-path reveal)

`PageTransition.tsx`: trocar opacity fade por clip-path reveal entre rotas. Mais imersivo que crossfade.

### 6.4 — NumberCounter animado

IntersectionObserver + rAF, sem biblioteca. Para stats (anos de experiência, pacientes atendidos, etc.) na MissionSection ou Sobre.

### 6.5 — Skeleton loaders

`ArticlesSection` e `PlansSection` (conteúdo async). `animate-pulse` Tailwind enquanto carrega — elimina layout shift e o flash de vazio.

### 6.6 — Bundle audit

Consolidar imports Framer Motion (tree-shaking). Verificar se GSAP ainda é necessário após Sprints 2–3 (cursor e tilt já saíram do GSAP). Se só sobrou uso marginal, considerar remover a dependência inteira.

---

## Princípios herdados (todas as sprints)

- **Sem `setState` por frame** — refs + rAF para qualquer sinal contínuo
- **1 rAF loop por sinal** — não criar loops paralelos para a mesma fonte
- **`transform`/`scaleX`/`translate3d`** — nunca `width`/`height`/`top` animados (reflow)
- **Easing único** `cubic-bezier(0.16, 1, 0.3, 1)` em tudo
- **Lazy** Three.js/Spline/canvas pesados
- **Verificar no browser** após cada sprint (tsc + console limpo + DOM assertions)

---

## Referências dos clones
- `lesson_regisgrumberg_round8.md` — MarqueeVelocity, ScrollProgress, SVG underline, tilt rAF
- `lesson_deep_recon_animations.md` — cursor 3 camadas, SiteProgressProvider, MouseParallax, velocity distortion
- `project_landonorris_clone.md` — MixedHeading, ritmo de seções, easing, tokens
- `lesson_three_lenis_perf_pitfalls.md` — progressRef vs setState, rAF vs GSAP tween
