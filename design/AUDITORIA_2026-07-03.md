# Auditoria Ponta a Ponta — NutriJornada 360º

**Data:** 2026-07-03
**Branch:** `refactor/producao-segura` (fast-forwarded para `main`, commit `158cfd3`)
**Checkpoint original:** `974a5d5` (estado pré-refatoração, preservado)
**Tag de release:** `v-redesign-editorial-organico`

Este documento audita, sem filtro, tudo que foi feito nesta branch desde o checkpoint: 28 commits, 322 arquivos alterados, +4.983/-4.145 linhas. Cobre backend (segurança, API, dados), frontend (arquitetura, redesign visual, 75 componentes curados) e o estado real de qualidade (lint/build) ao final.

---

## 1. Backend — Segurança e Infraestrutura (Fases 1–2)

### 1.1 Segredos e autenticação
- **Eliminados**: segredos hardcoded no código-fonte. `server/config.js` agora é o único ponto de leitura de env vars sensíveis; em produção (`NODE_ENV=production`), o boot **trava** (`process.exit(1)`) se `JWT_SECRET`, `ADMIN_EMAIL` ou `ADMIN_PASSWORD_HASH` não estiverem definidos — não há fallback silencioso para valor fixo.
- Em desenvolvimento sem `JWT_SECRET`, gera um segredo aleatório efêmero por processo (`crypto.randomBytes`) — nunca fixo no repo.
- Login admin migrado de senha em texto plano para **bcrypt** (`ADMIN_PASSWORD_HASH`).
- Paths de integração Python/NotebookLM viraram env vars opcionais; sem eles, as rotas de IA respondem **503** em vez de depender da máquina do desenvolvedor.

### 1.2 API e validação
- **Zod** em todas as rotas de entrada (validação de schema antes de processar).
- **Rate limit persistente em SQLite** (antes era in-memory — se perdia a cada restart do processo).
- `escapeHtml` aplicado no contrato PDF e nos e-mails (mitiga XSS/injeção em templates).
- Puppeteer (geração de PDF) rodando com **sandbox habilitado**.
- Identificação de sessão de pratos/dispositivo migrada de **IP para `X-Device-Id`** — mais estável (usuários atrás do mesmo IP/NAT não colidem) e mais correto para PWA/mobile.
- CORS restrito via `SITE_URL` (não `*`).
- Helmet ativo; error middleware global (nenhuma stack trace vaza para o cliente).

### 1.3 Dados nutricionais (cadeia de fallback real)
Confirmado em `server/nutrition-api.js`: busca de alimentos segue **Base local curada → TACO (UNICAMP, dados brasileiros) → USDA FoodData Central**; receitas usam **Spoonacular**. Essa cadeia real foi usada como fonte de verdade na seção "Fontes de dados" do frontend (Ferramentas) — nenhum dado foi inventado.

### 1.4 Assets e performance de infra
- `public/` comprimido: **205MB → ~80MB** (Fase 2), depois mais **−25MB** ao remover o hero de vídeo/canvas/Spline antigo na Home (Fase 4). Total: site serve menos da metade do peso estático original.

---

## 2. Backend — Qualidade e Higiene (Fase 3)

- Duplicações de código removidas; acessibilidade (`role`/`aria-label`) adicionada em modais e chats.
- Arquivos grandes refatorados: hero 472→283 linhas, Artigos 469→289, AdminDashboard 383→200, **NutriSearch 374→69 linhas** (extraiu `FoodDetailPanel.tsx` + `types.ts` — feito nesta sessão, consolidando trabalho de uma task em background).
- Logger estruturado (**pino**) substituindo `console.log` solto.

---

## 3. Segurança de Infraestrutura de Versionamento (fora do site, mas parte do escopo)

Durante a sessão, identificamos que `21st_scraper/user_data/` (perfil de navegador Chrome — cookies, cache, sessões) estava **versionado no repositório GitHub `arquitetura-agentica`** (746 arquivos, ~350MB no histórico).

**Ação tomada:**
1. `git rm -r --cached` + `.gitignore` atualizado (`21st_scraper/user_data/`, `**/user_data/`, `*.pma`, `*.dat`).
2. **Purga retroativa do histórico** com `git-filter-repo` (o path desapareceu dos 103 commits).
3. **Force-push** do histórico limpo para `origin/main`.
4. Backup local criado e removido após validação do push.

Restam ~350MB de **conteúdo legítimo** no histórico (`knowledge_base/*`, vídeos) — não é dado sensível, é candidato a Git LFS se o tamanho do clone incomodar no futuro.

---

## 4. Frontend — Redesign "Editorial Orgânico" (Fase 4)

### 4.1 Direção de design
Direção visual escolhida e documentada em `design/01-direcoes.html`, `02-sistema.html`, `03-home-hero.html`: fundo creme dominante, tipografia **Lora** (itálico verde para ênfase), filetes dourados (`#a08339` / `ouro-suave`), profundidade via sombras suaves (`shadow-float-1/2`), verde-profundo como cor de marca, verde-névoa para glows sutis.

### 4.2 Tokens novos (`tailwind.config.js`)
`verde-profundo`, `verde-nevoa`, `ouro-suave`, `creme-2`, `shadow-float-1/2`, e (nesta sessão) `float-drift` (keyframe de flutuação para o hero de Alimentos).

### 4.3 Páginas redesenhadas (Home → Ferramentas, todas nesta direção)
Home, Planos, Sobre, Artigos, Ferramentas, **Dashboard admin** — todas reconstruídas na direção Editorial Orgânico, cada uma com commit próprio e composição em `components/sections/<pagina>/`.

### 4.4 Ganho de performance da Home
Hero antiga (`CinematicHero` + vídeo/canvas + seção Spline) substituída por `EditorialHero` única e leve: **−25MB de assets**, dois pipelines de rAF/WebGL a menos no caminho crítico de carregamento.

---

## 5. Curadoria e Implementação do Blueprint de 75 Componentes (21st.dev)

### 5.1 Processo de curadoria
75 componentes salvos do 21st.dev (código-fonte completo) foram analisados individualmente — função, stack técnica (hooks, three.js/GSAP/framer/canvas/WebGL/Spline), intenção de UX — e mapeados para um destino específico no site. Resultado: `design/blueprint-75-componentes.md`.

**Regra central de performance definida:** máx. **1 fundo animado pesado por tela**; nenhum WebGL pesado nas páginas editoriais (Home/Sobre/Planos/Artigos) — concentrados em splash (1x), admin (dark), campanhas e um "manifesto" por página.

### 5.2 Componentes implementados (13 entregas, todas commitadas e verificadas)

| # | Componente 21st.dev | Destino | Adaptação-chave |
|---|---|---|---|
| 1 | Portfolio Hero | Sobre (hero) | Nome gigante Lora + foto sobreposta; BlurText letra-a-letra via IntersectionObserver (sem libs) |
| 2 | Animated Glassy Pricing | Planos | Glass + selo "Mais escolhido"; **shader WebGL descartado** (viola regra de 1 fundo pesado) |
| 3 | Dynamic Island Toc | ArtigoDetalhe | Scroll-spy + progresso; `createPortal(document.body)` (escapa `transform` do PageTransition) |
| 4 | Ruixen Feature Section | Ferramentas | "Fontes de dados" com Local/TACO/USDA/Spoonacular reais |
| 5–6 | Hero Section 7 + Circular Gallery | **Nova página `/alimentos`** | Frutas locais flutuando + galeria 3D scroll-driven (nome popular + binômio científico) |
| 7 | File Card Collections | Booking (StepComplete) | Contrato PDF como cartão-arquivo visual |
| 8 | Release Time Line | Sobre (trajetória) | Card ativo expande por proximidade ao centro do viewport |
| 9 | Cards Stack | Home (nova dobra) | "O que está incluído" — reaproveitou componente órfão do projeto, 5 entregáveis reais |
| 10 | Testimonials Columns | Home (nova dobra) | **3 depoimentos reais** do formulário de satisfação, nota 5/5, autorização confirmada |
| 11 | Clip Path Image + Pointer Highlight | Sobre (história) | Foto em recorte orgânico + 2 frases-chave grifadas no hover |
| 12 | Spotlight Card + Perspective Book | Planos + Sobre | Spotlight reaproveitou `GlowWrapper` existente (evitou duplicação); vitrine dos 2 e-books reais |
| 13 | Cursor Driven Particles Typography | Home (Manifesto) | Canvas 2D leve, pausa fora da viewport (`IntersectionObserver`), `role="img"` para a11y |
| 14 | Splash de abertura | App (global) | **On-brand**, não WebGL — decisão deliberada de coerência de marca sobre o blueprint original |

### 5.3 Itens do blueprint conscientemente **não** implementados (com justificativa)

| Item | Motivo |
|---|---|
| Animated Tabs (Artigos) | Sem código-fonte no bookmark **e** blog tem só 1 artigo publicado — filtro de categoria seria UI prematura |
| Display Cards (Home) | Dobra de Missão já cobre o trio de valores com glass+tilt — duplicaria |
| Testimonials/Story Scroll (Home, tentativa inicial) | Bloqueado até o usuário fornecer depoimentos reais — resolvido no item 10 acima quando o Excel chegou |
| Landings de campanha, redesign admin com WebGL, N8n Workflow | Dependem de decisão de produto do usuário (tema de campanha, etc.) — não avançados sem essa decisão |

---

## 6. Depoimentos Reais — Fonte e Tratamento

Extraídos de `_Formulário de Satisfação (respostas).xlsx` (Google Forms): 3 respostas, **nota 5/5 em todas**, todas com **autorização expressa de uso institucional**. Gramática ajustada preservando a voz de cada pessoa (documentado por pessoa no commit `4a25609`). Fotos substituídas por monograma (iniciais) — mais consistente com o termo de autorização ("foto discreta, dados pessoais não divulgados").

---

## 7. QA e Verificação (Fase 5 + contínua)

- **E2E prod-mode** validado no fechamento da Fase 5: rotas 200, API retorna 404 JSON correto, payloads inválidos retornam 400.
- A cada entrega desta sessão: `tsc -b` + `vite build` + `eslint` rodados isoladamente no(s) arquivo(s) novo(s) antes do commit.
- Verificação visual via preview MCP (screenshot + inspeção DOM) em cada dobra nova; quando o rAF ficava congelado pela aba oculta do preview (limitação de ambiente, documentada), a verificação foi por inspeção de DOM/computed style em vez de screenshot.

### Estado final de lint (checado agora, não presumido)
```
31 problems (28 errors, 3 warnings)
```
Todos os 28 erros + 3 warnings são em arquivos **pré-existentes ao início desta sessão** (`BookingContext`, `useQuota`, `glowPointerManager`, `AuthContext`, `SiteProgressContext`, chats de IA, etc.) — dívida técnica antiga, documentada, não bloqueia build. **Nenhum arquivo criado ou editado nesta sessão tem erro ou warning de lint** — confirmado individualmente arquivo por arquivo antes de cada commit, e o `SplashScreen.tsx` (único que introduziu um warning temporário) foi corrigido e revalidado 100% limpo antes do fechamento.

### Build final
```
✓ built in ~3.7–5s (vite + tsc -b, sem erros)
```
Aviso presente (não erro): chunk principal >500kB — sugestão de code-splitting via `dynamic import()`, não implementado nesta sessão (fora de escopo, não bloqueia produção).

---

## 8. Estrutura Final do Projeto (referência rápida)

```
server/           → 11 módulos (config, db, booking-api, nutrition-api, contract-template,
                     mail-service, rate-limit, sanitize, schemas, logger, migrate)
src/pages/         → 9 páginas (Home, Planos, Sobre, Artigos, ArtigoDetalhe, Ferramentas,
                     Alimentos [novo], Logistica, NotFound) + admin/
src/components/
  sections/        → 13 seções de página (Home: Mission/Manifesto/Acompanhamento/Plans/
                     Testimonials/Tools; Sobre: Hero/Historia/Trajetoria/Publicacoes;
                     Ferramentas: FontesDeDados)
  ui/              → 38 componentes de UI reutilizáveis (17 novos nesta sessão)
  ebooks/, BookingFlow/, admin/, nutrisearch/ → módulos funcionais intactos
```

---

## 9. Documentação Viva Gerada

- `DEPLOY.md` — runbook de produção (env vars obrigatórias, build, smoke test, checklist).
- `design/blueprint-75-componentes.md` — curadoria completa dos 75 componentes com destino/esforço/justificativa.
- `design/AUDITORIA_2026-07-03.md` — este documento.
- `brain/Dev_Logs/Log_2026-07-03.md` — log de desenvolvimento do dia (Obsidian).

---

## 10. Resumo Executivo

| Métrica | Valor |
|---|---|
| Commits nesta branch (desde checkpoint) | 28 |
| Arquivos alterados | 322 |
| Linhas | +4.983 / −4.145 |
| Peso de assets reduzido | 205MB → ~80MB (público) + −25MB (Home) |
| Componentes do blueprint 21st.dev implementados | 14 (13 diretos + splash) |
| Novos componentes de UI reutilizáveis | 17 |
| Nova página | `/alimentos` |
| Depoimentos reais integrados | 3 (nota 5/5, autorizados) |
| Vulnerabilidade de segurança corrigida (fora do site) | Perfil de navegador purgado do histórico Git |
| Lint em código novo desta sessão | 0 erros, 0 warnings |
| Build final | ✓ limpo |

**Estado da branch:** `main` e `refactor/producao-segura` alinhadas em `158cfd3`, GitHub sincronizado, tag `v-redesign-editorial-organico` marcando o release do redesign completo.
