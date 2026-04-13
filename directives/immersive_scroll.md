# Immersive Scroll Architecture (SOP)

Este documento define o padrão para animações vinculadas ao scroll que interceptam o comportamento nativo do navegador para criar experiências imersivas (Portal Entry).

## Princípios de Design
1. **Interceptação não-destrutiva**: Bloquear o scroll nativo apenas durante a animação crítica.
2. **Progressão Virtual**: Usar um `MotionValue` (0 a 1) alimentado por eventos de `wheel`, `touchmove` e `keydown`.
3. **Fluidez Orgânica**: Utilizar `useSpring` com configurações de mola (`stiffness`, `damping`) para suavizar a entrada bruta do hardware.

## Implementação Técnica (Baseada em ScrollExpandMedia)

### 1. Interceptação de Eventos
- **Evento `wheel`**: Multiplicar `deltaY` por um fator de sensibilidade (ex: `0.004`).
- **Evento `touchmove`**: Calcular delta entre `clientY` atual e anterior.
- **Evento `keydown`**: Capturar `ArrowDown`, `ArrowUp`, `Space`, `PageDown`, `PageUp`.

### 2. Gestão de Overflow
Para evitar saltos visuais:
- Definir `document.body.style.overflow = 'hidden'` e `document.documentElement.style.overflow = 'hidden'` enquanto `progress < 1`.
- Restaurar para `''` quando a animação completar.

### 3. Interpolação (Framer Motion)
```typescript
const width = useTransform(smoothProgress, [0, 1], ["40%", "100%"]);
const borderRadius = useTransform(smoothProgress, [0, 0.8], ["24px", "0px"]);
```

## Regras de Ouro
- Sempre use `{ passive: false }` nos listeners para permitir `e.preventDefault()`.
- O estado de "completado" deve persistir para permitir que o usuário volte ao topo e reinicie a imersão se desejar (Scroll Reverso).
- Garanta que mídias pesadas tenham `preload="auto"` e `muted` para autoplay imediato.
