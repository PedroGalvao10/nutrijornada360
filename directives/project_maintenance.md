# Project Maintenance & Performance (SOP)

Este documento define as rotinas para manter o projeto Mariana React leve, rápido e otimizado.

## Gestão de Mídia
Para garantir carregamento instantâneo:
1. **Vídeos**: Preferir formato `.webm` (VP9) com fallback `.mp4`.
2. **Imagens**: Usar `.webp` para fotografias e `.svg` para ícones/logos.
3. **Resolução**: Vídeos heróis não devem exceder 1080p. Imagens de fundo devem ser comprimidas com 80% de qualidade.

## Automação de Limpeza
O projeto utiliza a Camada 3 (`execution/optimize_project.py`) para:
- Converter arquivos pesados em massa.
- Limpar cache do Vite (`node_modules/.vite`).
- Limpar pastas de build (`dist`).

## Fluxo de Trabalho de Otimização
1. Adicionar novas mídias em `public/temp/`.
2. Rodar `python execution/optimize_project.py`.
3. O script moverá os arquivos otimizados para as pastas definitivas e atualizará as referências no código `.tsx`.

## Metas de Performance (Core Web Vitals)
- **LCP (Largest Contentful Paint)**: < 2.5s.
- **CLS (Cumulative Layout Shift)**: < 0.1.
- **FID (First Input Delay)**: < 100ms.
