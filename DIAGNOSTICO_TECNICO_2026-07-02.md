---
projeto: site_mariana_react (NutriJornada 360º — Mariana Bermudes)
data: 2026-07-02
stack: React 19 + Vite 8 + TypeScript + TailwindCSS (HashRouter) + Express + SQLite + GSAP/Framer Motion
escopo: Diagnóstico técnico ponta-a-ponta (frontend, backend, performance, segurança, qualidade, SEO/acessibilidade)
método: leitura direta do código atual (não apenas blueprints antigos), cruzando 6 achados legados de 2026-06-07 com o estado real do repositório, complementada por 2 auditorias independentes ponta-a-ponta
---

# Diagnóstico Técnico — site_mariana_react

## Resumo Executivo

| Severidade | Qtd | Resumo |
|---|---|---|
| 🔴 Crítico | 4 | Segredos de admin/JWT hardcoded ativos · senha admin comparada em texto plano · caminhos Python hardcoded da máquina do dev em rotas de produção · SEO comprometido por HashRouter + meta tags só client-side |
| 🟡 Importante | ~12 | Rate limiting incompleto, HTML injection em e-mail/PDF, Puppeteer sem sandbox, sem error-handling global, sem validação de schema, assets em vídeo enormes, listener vazado, Spline não lazy, listeners de mouse/scroll duplicados fora dos singletons, sitemap com URLs mortas, CORS sem origin de produção, endpoint de prato por IP |
| 🟢 Menor | ~8 | Arquivo órfão, duplicação de nome de componente, código morto (`SiteProgressContext`), favicon padrão do Vite, poucos `aria-label`, `Ferramentas.tsx` sem SEO, dependências server no `package.json` raiz, `AuthContext` sem cache |

**Boas notícias:** os 6 bugs específicos herdados dos blueprints antigos (06-07) **já foram corrigidos**. SQL injection não encontrado em lugar nenhum (queries sempre parametrizadas). Shell injection clássica não encontrada (`spawn`/`execFile` com array de args). Lazy loading de rotas via `React.lazy()` já implementado. Frontend bem tipado (poucos `any`). Sem código morto/comentado relevante.

---

## Parte 1 — Status dos 6 Itens Legados (Blueprints 2026-06-07)

### 1. `NutritionMyths.tsx` — export duplicado / `dangerouslySetInnerHTML`
**✅ Resolvido.** Único `export default` (linha 143). Sem `dangerouslySetInnerHTML` — keyframes migrados para `index.css` (linhas 552-562). Modal usa `createPortal`.

### 2. `useDynamicShadow.ts` — rAF infinito sem visibilidade
**✅ Resolvido.** `IntersectionObserver` mantém `Set<HTMLElement>` de elementos visíveis (linhas 23-41); `animate()` só roda com `visibleElements.size > 0` e se auto-encerra quando esvazia (linhas 51-56); cleanup completo no `useEffect` (linhas 99-103).

### 3. `GlowWrapper.tsx` — listener por instância
**✅ Resolvido.** `src/lib/glowPointerManager.ts` implementa singleton com `Set<WeakRef<HTMLElement>>`, um único `pointermove` na window criado sob demanda, updates batcheados via rAF.

**Mas:** ver Parte 2-A.3 — o padrão do singleton não foi adotado pelos demais componentes que também escutam mouse/scroll.

### 4. `index.css` — `* { transition-property }` global / `scroll-behavior: smooth`
**✅ Resolvido / não encontrado.** Não existe seletor `*` global nem `scroll-behavior: smooth`. Existe regra escopada sob `.transitioning-theme` (linhas 867-878) para toggle dark/light — condicional, não permanente. Combina `!important` com vários seletores de alta especificidade; simplificar é desejável mas não é o bug crítico original.

### 5. `Home.tsx` — monólito de ~670 linhas
**✅ Resolvido.** Hoje tem 275 linhas. Lógica de canvas scroll-linked extraída para `src/hooks/useScrollCanvas.ts` (229 linhas).

**Achado colateral:** `Home_backup.tsx` (667 linhas, versão antiga) ficou órfão na raiz — não importado em lugar nenhum. Remover.

### 6. `SiteProgressContext.tsx` — existência e uso
**⚠️ Existe mas não é usado.** Implementação sólida (`progressRef`, `velocityRef`, `mouseRef`, um único rAF, 109 linhas), mas **nenhum `<SiteProgressProvider>` é montado** em `App.tsx`/`Layout.tsx`/`main.tsx`, e nenhum componente chama `useSiteProgress()`. Ver Parte 2-A.3 para o impacto real disso.

---

## Parte 2 — Auditoria Ampla

### A. Arquitetura Frontend

**Roteamento (`src/App.tsx`, `src/main.tsx`):** o app usa **`HashRouter`** (`main.tsx:28`), ou seja, todas as URLs reais no navegador têm formato `/#/rota`. Isso tem implicação direta e séria em SEO — ver seção F.6.

Mapa de rotas:
- `/` → `Home` · `/planos` → `Planos` · `/sobre` → `Sobre` · `/artigos` → `Artigos` · `/ferramentas` → `Ferramentas` · `/blog/:slug` → `ArtigoDetalhe` · `/login` → redireciona para `/` (login é modal)
- `/admin/dashboard` → protegida por `ProtectedRoute`
- `*` (catch-all) → `Navigate to="/"` (sem página 404 dedicada — todo path inválido "funciona" e mostra a home)

**Achado:** `src/pages/Logistica.tsx` existe mas **não é uma rota própria** — é importado e renderizado como seção dentro de `Home.tsx` (linha 10). Isso gera inconsistência com o `sitemap.xml` (ver F.5) e faz o `<SEO>` de `Logistica.tsx` competir com o `<SEO>` de `Home.tsx` no mesmo `<Helmet>` — dois componentes tentando definir `title`/`description` na mesma renderização.

**`ProtectedRoute.tsx` (17 linhas):** implementação correta — spinner durante loading, `<Navigate replace>` se não autenticado, comentário explícito sobre "disfarçar" a existência da rota para usuários deslogados. A barreira real de segurança está no backend (JWT httpOnly + `requireAuth`), como deve ser.

**`AuthContext.tsx`:** chama `/api/auth/check` a cada remount do provider sem cache — requisição de rede redundante em navegações. Menor.

**A.3 — Duplicação de listeners de scroll/mouse/pointer fora dos singletons.**
Existem dois singletons corretos: `glowPointerManager.ts:65` (`pointermove`) e `SiteProgressContext.tsx:71` (`mousemove`) — mas o segundo **não é usado por ninguém** (item 6 acima). Enquanto isso, vários componentes reimplementam listeners próprios em paralelo:
- `useScrollCanvas.ts:217` — `addEventListener('scroll', ...)` próprio
- `cinematic-landing-hero.tsx:229` — `addEventListener('mousemove', ...)` próprio
- `CustomCursor.tsx:63` — `addEventListener('mousemove', ...)` próprio
- `interactive-neural-vortex-background.tsx:162` — `addEventListener('mousemove', ...)` próprio
- `useTilt.ts:57` — listener local ao elemento (menos grave, mas ainda paralelo)

Em páginas onde vários desses coexistem (a `Home.tsx`, que reúne Spline + hero cinemático + cursor customizado + vórtex WebGL), múltiplos listeners de `mousemove` disparam a cada frame de movimento do mouse — overhead de CPU redundante que o `SiteProgressContext`/`glowPointerManager` foram desenhados para eliminar, mas a migração nunca foi completada. **Severidade: importante** (dívida de arquitetura/performance, não bug funcional).

**Arquivos grandes (>300 linhas):**

| Arquivo | Linhas |
|---|---|
| `Home_backup.tsx` (órfão) | 667 |
| `src/components/ui/cinematic-landing-hero.tsx` | 472 |
| `src/pages/Artigos.tsx` | 469 |
| `src/components/NutriSearch.tsx` | 427 |
| `src/components/admin/AdminBookingDashboard.tsx` | 383 |
| `src/pages/Sobre.tsx` | 320 |
| `src/components/IntelligentRecipes.tsx` | 316 |
| `src/components/ArticleForm.tsx` | 302 |

**Duplicação de nome:** `src/components/TypewriterText.tsx` **e** `src/components/ui/TypewriterText.tsx` coexistem — risco de import ambíguo.

### B. Backend / Server

Arquivos lidos por completo: `server/index.js` (259), `server/booking-api.js` (614), `server/db.js` (118), `server/nutrition-api.js` (690), `server/mail-service.js` (190), `server/contract-template.js` (parcial).

#### 🔴 CRÍTICO 1 — Segredos com fallback hardcoded, ativos em produção
`server/index.js` linhas 21-23:
```js
const JWT_SECRET = process.env.JWT_SECRET || 'a_very_secret_key_123';
const ADMIN_EMAIL = process.env.VITE_ADMIN_EMAIL || process.env.ADMIN_EMAIL || 'admin@nutrijornada.com';
const ADMIN_PASS = process.env.VITE_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || '123456';
```
Confirmado por leitura direta do `.env` real: **nenhuma dessas três variáveis está definida.** A aplicação hoje roda com `JWT_SECRET = 'a_very_secret_key_123'` e login admin `admin@nutrijornada.com` / `123456` — ambos visíveis no código-fonte. Qualquer pessoa com acesso ao repositório loga como admin ou forja tokens JWT válidos. Fallback duplicado em `booking-api.js:299` (risco extra de dessincronia entre os dois módulos).

#### 🔴 CRÍTICO 2 — Senha de admin comparada em texto plano
`server/index.js:64`: `email === ADMIN_EMAIL && password === ADMIN_PASS` — comparação direta de string, sem hash. `bcrypt` está importado em `db.js:4` mas **não é usado para isso** em lugar nenhum do fluxo de login admin. Mesmo que `ADMIN_PASS` viesse de um `.env` forte, comparação em texto plano não é timing-safe e não segue prática mínima de autenticação.

#### 🔴 CRÍTICO 3 — Caminhos hardcoded da máquina do desenvolvedor em rotas de produção
`server/index.js:189` e `server/nutrition-api.js:93-94`:
```js
const proxyPath = 'c:\\Users\\soare\\.gemini\\antigravity\\scratch\\execution\\nlm_proxy.py';
const pythonPath = 'C:\\Users\\soare\\AppData\\Local\\Programs\\Python\\Python312\\python.exe';
```
Usado por `POST /api/ai/chat`, `/api/nutrition/chat-articles` e fallback NotebookLM. Em qualquer deploy fora desta máquina (Hostinger, VPS, etc.), essas rotas falham sempre — o erro é capturado e cai em fallback "gracioso" (não derruba o servidor), mas é uma dependência de infraestrutura da máquina de desenvolvimento embutida em código de produção. **Bloqueador de deploy correto** para as features de IA que dependem disso.

#### 🔴 CRÍTICO 4 — SEO comprometido pela combinação HashRouter + meta tags só client-side
`index.html` não tem `<meta name="description">`, nem tags `og:*`, nem `twitter:*` estáticas — tudo depende de `SEO.tsx` injetar via `react-helmet-async` **depois** do JS React executar no navegador. Combinado com `HashRouter` (rotas em formato `/#/rota`, que historicamente engines de busca e bots de preview social têm dificuldade em diferenciar como páginas distintas), o resultado é que **crawlers que não executam JS (ou com timeout curto) veem todas as "páginas" internas como a mesma URL, sem description, sem imagem de preview, sem título específico.** É o achado de maior impacto em aquisição orgânica de todo o diagnóstico — mais estrutural que os itens pontuais de SEO abaixo (F.1-F.5).

#### 🟡 Rate limiting incompleto
`loginLimiter` (5 tentativas/15min) protege só `POST /api/auth/login`. **Sem rate limit:**
- `POST /api/booking` — dispara `puppeteer.launch()` completo por requisição, sem pool de browsers.
- `POST /api/leads` (proxy Google Sheets) e `POST /api/ai/chat` (spawna processo Python por requisição) — abuso trivial.
- `/api/nutrition/*` — tem um rate limiter próprio em memória (`Map` por IP, `nutrition-api.js:191-220`), mas reseta a cada restart do processo e não escala com múltiplas instâncias (sem Redis).

#### 🟡 `notebookId` do body sem validação
`server/index.js:184`: `const { message, notebookId = '...' } = req.body` — valor arbitrário do usuário repassado sem sanitização a um script Python externo via `spawn`. Não é RCE direta (array de args evita shell injection), mas é input não validado indo para processo externo.

#### 🟡 Puppeteer sem sandbox processando HTML de usuário não sanitizado
`booking-api.js` usa `puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })`. O HTML do contrato (`contract-template.js`) interpola `nome`, `objetivo`, `descricaoObjetivo`, etc. **sem escaping** — mesmo padrão em `mail-service.js` (linhas 65-73, 141-142). Um `nome` com tags HTML/script é injetado no e-mail enviado à nutricionista e no HTML renderizado pelo Puppeteer (sandbox desligado) para gerar o PDF. Risco teórico de XSS-to-SSRF dentro do processo do Chromium headless.

#### 🟡 Verificação de identidade fraca no download de contrato
`GET /contract-pdf/:token` (booking-api.js:283) permite acesso alternativo via `endsWith` de poucos dígitos de CPF/WhatsApp (linhas 309-330) em vez de exigir só o token — reduz a entropia da verificação (força bruta viável) e não tem rate limit específico nesse endpoint.

#### 🟡 Sem error-handling middleware global / sem lib de validação de schema
Nenhuma rota usa `zod`/`joi`/`express-validator`. Validações são manuais e mínimas (ex.: `booking-api.js:137`, checagem só de presença, sem formato de e-mail/CPF/telefone). `server/index.js` não tem `app.use((err, req, res, next) => ...)` — exceção síncrona fora de callback pode derrubar o processo. `POST /api/articles` (index.js:113) não tem try/catch, só callback de erro do SQLite.

#### 🟡 E-mail/fire-and-forget sem fila
Blocos de envio de e-mail/PDF rodam como IIFE assíncrona "fire and forget" (`booking-api.js` linhas 190-202, 460-492, 569-603) sem fila/retry persistente — se o processo cair no meio, o e-mail simplesmente não é reenviado e não fica registrado como falha no banco.

#### 🟡 `plates` endpoints identificam usuário por IP
`nutrition-api.js` linhas 622, 650, 660, 676 usam `user_ip` como "dono" do prato salvo — usuários atrás do mesmo NAT/IP compartilhado (rede corporativa, 4G compartilhado) veem pratos uns dos outros.

#### 🟡 CORS sem origin de produção
Whitelist só cobre `localhost`/`127.0.0.1` em várias portas (`index.js:32-40`). Não é problema hoje porque o front é servido pelo mesmo Express, mas se o domínio de produção divergir ou o front for hospedado separado, quebra silenciosamente.

#### ✅ SQL Injection — não encontrado em lugar nenhum (`db.js`, `booking-api.js`, `index.js`, `nutrition-api.js` — todas as queries usam parâmetros `?`).
#### ✅ Shell injection clássica — não encontrada (`spawn`/`execFile` sempre com array de args, nunca `exec()` com string interpolada).
#### ✅ Cookies/JWT — configuração correta (`httpOnly`, `secure` condicional a produção, `sameSite: 'lax'`, `maxAge: 8h`). O problema é o segredo fraco por trás (crítico 1), não o mecanismo.
#### ✅ Endpoints admin (booking approve/reject/mark-paid, CRUD de artigos) — todos corretamente atrás de `requireAuth`.

### C. Performance

**Bundle do client:** pacotes server-only (`puppeteer`, `sqlite3`, `bcrypt`, `nodemailer`, `@ffmpeg-installer/ffmpeg`, `jsonwebtoken`, etc.) confirmados, via grep, **sem nenhuma importação dentro de `src/`** — não vazam para o bundle do cliente. Ficam em `dependencies` do `package.json` raiz único em vez de um `server/package.json` segregado — infla `node_modules` (Puppeteer baixa Chromium) e tempo de deploy, mas não é bug funcional.

**Assets pesados — achados concretos com tamanhos:**

| Arquivo | Tamanho |
|---|---|
| `public/bg-plans.mp4` | 65MB |
| `public/bg-plans.webm` | 27MB |
| `public/videos/psicologia.mp4` | 20MB |
| `public/hero-video-v2.mp4` | 19MB |
| `public/videos/mariana_trabalhando.mp4` | 14MB |
| `public/videos/bg_nutri.mp4` | 8.4MB |
| `src/assets/mariana-profile.png` | **8.8MB** |
| `public/videos/bg_portal.mp4` / `portal_video.mp4` | 7.2MB cada |
| `public/artigos-hero.mp4` | 5.2MB |
| `public/videos/sono.mp4` | 5.2MB |
| `public/fruits/Página sobre mariana.png` | 5.1MB |

25+ arquivos acima de 1MB só em `public/`. Existe par `.webm` para boa parte dos vídeos grandes (positivo), mas não para todos (`mariana_trabalhando.mp4`, `ambiente.mp4`, `microbiota.mp4`, `splash_desktop.mp4`/`splash_mobile.mp4` não têm equivalente webm). **`mariana-profile.png` de 8.8MB é um erro isolado grave** — uma foto de perfil não deveria passar de algumas centenas de KB; falta compressão/conversão para WebP. **Severidade: importante.**

**`setState` dentro de `requestAnimationFrame`:** varredura dos 11 arquivos que usam rAF (`Layout.tsx`, `cinematic-landing-hero.tsx`, `CustomCursor.tsx`, `interactive-neural-vortex-background.tsx`, `MarqueeVelocity.tsx`, `project-showcase.tsx`, `SiteProgressContext.tsx`, `useDynamicShadow.ts`, `useScrollCanvas.ts`, `useTilt.ts`, `glowPointerManager.ts`) **não encontrou** padrão de `setState` por frame — todos escrevem direto no DOM via refs. Positivo, consistente com a lição já registrada de projetos anteriores sobre esse anti-padrão.

**Listener vazado — `ScrollExpandMedia.tsx`:** contagem desbalanceada (6 `addEventListener` vs 5 `removeEventListener`). O listener extra:
```js
document.addEventListener('visibilitychange', () => { ... }); // linha 128, função anônima inline
```
O cleanup (linhas 133-137) remove `wheel`, `touchstart`, `touchmove`, `keydown`, `pagehide`, mas **não remove `visibilitychange`** — não há referência para removê-lo, já que foi registrado como arrow function inline. Cada mount/unmount do componente (navegação SPA) acumula um novo listener no `document`, nunca removido. **Leak real e crescente. Severidade: importante.**

**Spline 3D não tem code-split próprio:** `import Spline from '@splinetool/react-spline'` é estático no topo de `SplineSafe.tsx`, e `Home.tsx` importa `SplineSafe` também estaticamente (não `React.lazy`). Embora a página `Home` já seja lazy-loaded como um todo, o pacote pesado do Spline entra no mesmo chunk da Home inteira — todo usuário que abre a Home baixa o bundle do Spline mesmo sem rolar até a seção que o usa. **Severidade: importante** — recomendação: `const SplineSafe = lazy(() => import('../components/ui/SplineSafe'))` dentro de `Home.tsx`.

**Lazy loading de rotas:** todas as páginas via `React.lazy()` em `App.tsx` — correto.

### D. Segurança

**`.env` real (nomes confirmados, sem valores expostos):** `VITE_POSTHOG_KEY`, `VITE_POSTHOG_HOST`, `USDA_API_KEY`, `SPOONACULAR_API_KEY`, `MAIL_USER`, `MAIL_PASS`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_SECURE`, `SITE_URL`. **Confirma a ausência de `JWT_SECRET`/`ADMIN_EMAIL`/`ADMIN_PASSWORD`** (crítico 1).

**`.env` no `.gitignore`** e não rastreado pelo git — sem vazamento do arquivo real no histórico.

**Grep por padrões clássicos** (`sk-`, `AKIA`, `password = "`, `apiKey = "`, `secret = "`) em `src/` e `server/` não retornou nada — mas isso **não pega** o padrão real usado no projeto (`JWT_SECRET || 'valor'`), que é funcionalmente um segredo hardcoded e só foi encontrado por leitura manual (seção B). Lição: greps rasos de segredo não substituem revisão manual de auth.

**Versões de dependências:** React 19.2.4, Express 5.2.1, `jsonwebtoken` 9.0.3, `bcrypt` 6.0.0, `express-rate-limit` 8.3.2 — todas atuais, nada suspeito.

**Validação client vs server:** backend não usa nenhuma lib de schema validation; validação é manual e mínima (presença de campos, sem formato). `LoginModal.tsx` não foi lido em detalhe — pendência para auditoria futura se necessário.

### E. Qualidade de Código

**Tipagem (`: any`):** apenas **3 ocorrências** em todo `src/` (`NutritionDiaryModal.tsx` ×2, `BookingFlow/StepContract.tsx` ×1) — frontend bem tipado, achado positivo.

**`ErrorBoundary`:** existe e envolve toda a árvore de rotas em `App.tsx` (linha 38) — boa cobertura de fallback catastrófico global.

**`console.log`:** apenas **1 ocorrência** em `src/` (`Artigos.tsx:133`, log de debug de lead) — frontend limpo. No `server/`, **42 ocorrências** de `console.log`/`error` usadas como logging ad-hoc — sem lib estruturada (`winston`/`pino`), consistente com a ausência de error-handling centralizado (seção B).

**TODO/FIXME:** zero ocorrências em `src/` e `server/` — sem débito técnico documentado inline (pode significar que problemas conhecidos não estão marcados como tal).

**Código morto comentado:** varredura não encontrou blocos genuinamente mortos — os comentários em massa encontrados são headers de seção JSX (`{/* STEP: ... */}`), um padrão de documentação consistente do projeto, não lixo.

**Arquivo órfão:** `Home_backup.tsx` (667 linhas) — remover.
**Duplicação de nome:** `TypewriterText.tsx` em duas pastas — resolver.

### F. SEO / Acessibilidade

**F.1 — `SEO.tsx` (51 linhas):** bem estruturado — `react-helmet-async`, title dinâmico, description, canonical, Open Graph completo, Twitter Card, e um `<meta>` de CSP (`upgrade-insecure-requests`, fraca comparada a header HTTP real).

Uso confirmado: `ArtigoDetalhe`, `Artigos`, `Home`, `Logistica`, `Planos`, `Sobre` usam `<SEO>`. **`Ferramentas.tsx` não usa** — página pública sem meta tags customizadas. Como `Logistica.tsx` não é rota própria (ver A), seu `<SEO>` conflita/compete com o de `Home.tsx` no mesmo `<Helmet>`.

**F.2 — Alt text:** 10 ocorrências de `alt="..."` preenchido, **zero** `alt=""` vazio — nenhuma imagem com alt vazio encontrada, mas 10 é uma contagem baixa considerando o volume de imagens do site (não há garantia de que todas as `<img>` tenham `alt`; recomenda-se contagem total de `<img>` vs `alt` presente numa auditoria futura).

**F.3 — `aria-label`:** 10 ocorrências em 8 arquivos — pouco para um site com modais (`LoginModal`, `BookingFlow`, `NutritionDiaryModal`), chat (`ConciergeChat`, `ArticleChatIA`) e interações customizadas (`CustomCursor`, `ScrollExpandMedia`). Espaço real de melhoria de acessibilidade em controles interativos.

**F.4 — `robots.txt`:** correto — libera todo o crawling, aponta pro sitemap.

**F.5 — `sitemap.xml` com URLs mortas:** lista `/`, `/planos`, `/sobre`, `/logistica`, `/blog` (todas com o mesmo `lastmod`, sugerindo geração manual, não automatizada). Confrontando com as rotas reais (A.1): **`/logistica` não existe como rota** (é seção interna da Home) e **`/blog` não existe** (a listagem real é `/artigos`; `/blog/:slug` só serve detalhe individual). 2 de 5 URLs do sitemap não resolvem para o conteúdo esperado — crawlers batem em conteúdo errado ou são redirecionados silenciosamente pro catch-all. **Severidade: importante.**

**F.6 — `index.html` / HashRouter (ver crítico 4):** sem `<meta name="description">`, `og:*` ou `twitter:*` estáticas — tudo depende de JS client-side via `react-helmet-async`. Combinado com `HashRouter` (`/#/rota`), compromete indexação orgânica de todas as páginas internas para crawlers que não executam JS plenamente ou bots de preview social. **Este é o achado de maior impacto do diagnóstico inteiro em termos de aquisição de tráfego orgânico.** Favicon ainda é o ícone padrão do Vite (`/vite.svg`) — menor, mas reforça a impressão de "não finalizado" em compartilhamentos.

---

## Resumo de Severidade (consolidado)

**🔴 Crítico (4):**
1. `JWT_SECRET`/credenciais de admin com fallback hardcoded, ativamente em uso (sem `.env` real definido) — `server/index.js:21-23`, duplicado em `booking-api.js:299`.
2. Senha de admin comparada em texto plano, sem hash — `server/index.js:64` (bcrypt importado mas não usado para isso).
3. Caminhos de Python/script hardcoded da máquina do desenvolvedor em rotas de produção (`/api/ai/chat`, NotebookLM) — `server/index.js:189`, `nutrition-api.js:93-94`.
4. `HashRouter` + meta tags só client-side (sem SSR/prerender, sem tags estáticas no `index.html`) — compromete SEO/indexação de todas as páginas internas.

**🟡 Importante (principais):**
- Rate limiting ausente em `/api/booking`, `/api/leads`, `/api/ai/chat`; rate limit de nutrição é in-memory sem persistência.
- `notebookId` do body sem validação antes de ir para processo externo.
- Puppeteer sem sandbox processando HTML de usuário não sanitizado (contrato + e-mail) — risco de HTML/XSS injection.
- Verificação de identidade fraca (CPF/WhatsApp parcial) no download de contrato, sem rate limit dedicado.
- Sem error-handling middleware global no Express; sem lib de validação de schema (zod/joi/express-validator).
- `plates` identificados por IP — vazamento entre usuários do mesmo IP/NAT.
- CORS sem origin de produção configurada.
- Assets de vídeo/imagem enormes (65MB+27MB só em `bg-plans`; `mariana-profile.png` de 8.8MB).
- Listener `visibilitychange` vazado em `ScrollExpandMedia.tsx` (sem remoção no cleanup, acumula por navegação SPA).
- Spline 3D sem code-split próprio dentro da Home.
- Múltiplos componentes reimplementando listeners de mouse/scroll fora dos singletons existentes (`glowPointerManager`, `SiteProgressContext` nunca adotado).
- `sitemap.xml` com 2 de 5 URLs mortas (`/logistica`, `/blog`).

**🟢 Menor:**
- `Home_backup.tsx` órfão (667 linhas) a remover.
- Duplicação de nome `TypewriterText.tsx` em duas pastas.
- `SiteProgressContext` implementado mas nunca montado/consumido.
- 7 arquivos >300 linhas (candidatos a refactor, mesmo padrão já aplicado com sucesso em `Home.tsx`).
- `Ferramentas.tsx` sem `<SEO>`.
- Favicon ainda é o padrão do Vite.
- Poucos `aria-label` (10) para a quantidade de componentes interativos.
- Dependências server-only no `package.json` raiz único (não vaza pro client, mas é cheiro de arquitetura).
- `AuthContext` sem cache entre remounts (chamada de rede repetida).

---

## Plano de Ação Sugerido (por prioridade)

1. **🔴 Antes de qualquer deploy de produção:**
   - Gerar `JWT_SECRET` forte (`openssl rand -hex 32`) e credenciais reais de admin no `.env` de produção; travar o boot do servidor se ausentes em `NODE_ENV=production`; unificar a leitura do segredo num módulo único compartilhado entre `index.js` e `booking-api.js`.
   - Hashear a senha de admin com `bcrypt` (já é dependência do projeto) em vez de comparação em texto plano.
   - Remover ou tornar configurável via `.env` os caminhos hardcoded de Python/NotebookLM, ou desabilitar essas rotas em produção até terem um caminho de deploy real.
   - Adicionar meta tags estáticas essenciais (`description`, `og:*` básicas) direto no `index.html` como fallback para crawlers sem JS; avaliar migração de `HashRouter` para `BrowserRouter` (exige configuração de rewrite no servidor, já viável já que o Express serve o build) e/ou prerender das rotas públicas.

2. **🟡 Curto prazo:**
   - `helmet` no Express + rate limit em `/api/booking`, `/api/leads`, `/api/ai/chat`.
   - Sanitizar/escapar input do usuário antes de interpolar em HTML de e-mail/contrato.
   - Corrigir `sitemap.xml` (remover `/logistica` e `/blog`, ou criar as rotas reais correspondentes).
   - Corrigir o vazamento de listener em `ScrollExpandMedia.tsx`.
   - Lazy-load do `SplineSafe` dentro de `Home.tsx`.
   - Comprimir/converter `mariana-profile.png` (8.8MB → WebP) e revisar os vídeos mais pesados (`bg-plans.mp4` 65MB).
   - Adicionar `<SEO>` em `Ferramentas.tsx`.

3. **🟢 Quando sobrar tempo:**
   - Remover `Home_backup.tsx`; resolver duplicidade `TypewriterText.tsx`.
   - Decidir sobre `SiteProgressContext`: adotar de fato (migrar `CustomCursor`, `cinematic-landing-hero`, `interactive-neural-vortex-background`, `useScrollCanvas` para consumi-lo) ou remover o código morto.
   - Pool de browsers Puppeteer ou fila para geração de PDF.
   - Segregar dependências server-only do `package.json` raiz se o pipeline de deploy se beneficiar.
   - Revisar cobertura de `aria-label` em componentes interativos customizados.

---

*Diagnóstico gerado via auditoria direta do código-fonte atual (2 rodadas independentes + verificação pontual dos 6 achados legados de 2026-06-07). Nenhuma correção foi aplicada — este documento é somente diagnóstico.*
