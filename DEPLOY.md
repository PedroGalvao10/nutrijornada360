# Deploy — NutriJornada 360º (site_mariana_react)

Runbook de produção. O app é **um processo Node único**: o Express serve o
build do React (`dist/`) **e** a API `/api/*` na mesma porta. Não precisa de
servidor web separado nem de rewrite manual — o fallback SPA já trata as rotas
do BrowserRouter.

---

## 1. Pré-requisitos do servidor

- **Node.js >= 18** (o projeto é CommonJS/ESM misto, sem transpilação de runtime).
- **Chromium para o Puppeteer** — a geração de PDF do contrato usa Chromium
  headless. O `npm install` baixa o Chromium do Puppeteer automaticamente; em
  Linux mínimo/containers instale as libs do sistema:
  `libnss3 libatk-bridge2.0-0 libgtk-3-0 libasound2 libgbm1` (nomes variam por distro).
- **Toolchain de build nativo** para o `sqlite3` (`python3`, `make`, `g++`) — só
  no `npm install`, não em runtime.
- `ffmpeg` **não** é necessário em runtime (foi usado só na compressão dos assets).

---

## 2. Variáveis de ambiente

Copie `.env.example` para `.env` e preencha. O boot **falha de propósito** em
produção se faltar qualquer uma das obrigatórias (ver `server/config.js`).

### Obrigatórias em produção (`NODE_ENV=production`)

| Var | Como gerar |
|-----|-----------|
| `JWT_SECRET` | `openssl rand -hex 32` (ou `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) |
| `ADMIN_EMAIL` | e-mail de login da Mariana |
| `ADMIN_PASSWORD_HASH` | `node -e "console.log(require('bcrypt').hashSync('SENHA_FORTE', 12))"` — grave só o **hash**, nunca a senha |
| `SITE_URL` | `https://marianabermudes.com.br` — usada em CORS, canonical e sitemap |

> Sem essas quatro, o processo imprime `[Config] FATAL: variáveis ... ausentes`
> e sai com código 1. Isso é o comportamento correto — não é bug.

### E-mail (Nodemailer — necessário para notificação de booking e confirmação)

`MAIL_HOST`, `MAIL_PORT`, `MAIL_SECURE`, `MAIL_USER`, `MAIL_PASS`.

### APIs de nutrição

`USDA_API_KEY`, `SPOONACULAR_API_KEY` (sem elas, as ferramentas caem em fallback local/DEMO).

### Analytics / leads

`VITE_POSTHOG_KEY`, `VITE_POSTHOG_HOST`, `VITE_GOOGLE_SHEETS_WEBHOOK_URL`.

### Opcionais — integração NotebookLM (chat de IA)

`NLM_PROXY_PATH`, `PYTHON_PATH`, `NLM_DEFAULT_NOTEBOOK_ID`.
**Se ficarem vazias, a rota `/api/ai/chat` responde 503 graciosamente** — não
derruba nada. Só preencha quando existir um caminho de deploy real do proxy Python.

### Escape hatch do Puppeteer

O Chromium roda **com sandbox** por padrão (mais seguro). Só se o host não
suportar sandbox (alguns containers), defina `PUPPETEER_NO_SANDBOX=1`.

---

## 3. Build e start

```bash
npm ci                 # instala deps (baixa Chromium; compila sqlite3)
npm run build          # tsc -b && vite build  ->  gera dist/
NODE_ENV=production PORT=3001 npm start   # node server/index.js
```

O `npm start` sobe o Express, que serve `dist/` + `/api/*` na `PORT` (default 3001).
Aponte o proxy do provedor (Hostinger/Nginx) para essa porta, ou use a porta que
o provedor expõe via `PORT`.

### PowerShell (Windows)

```powershell
$env:NODE_ENV="production"; $env:PORT="3001"; npm start
```

---

## 4. Persistência

- **`server/database.sqlite`** guarda artigos, bookings, logs de login e a tabela
  `rate_limits` (o rate limiting sobrevive a restart — não é in-memory).
  **Inclua esse arquivo no backup.** Não está no build; fica ao lado do servidor.
- **`server/storage/contracts/`** guarda os PDFs de contrato arquivados.

---

## 5. Smoke test pós-deploy

Com o servidor no ar (troque a base URL):

```bash
BASE=https://marianabermudes.com.br
curl -s -o /dev/null -w "%{http_code}\n" $BASE/                 # 200
curl -s -o /dev/null -w "%{http_code}\n" $BASE/planos           # 200 (rota direta, sem #)
curl -s -o /dev/null -w "%{http_code}\n" $BASE/api/inexistente  # 404 (JSON, não HTML)
curl -s $BASE/sitemap.xml | grep -c "<loc>"                     # >= 5 URLs reais
curl -s $BASE/ | grep -c 'og:image'                             # 1 (meta estáticas presentes)
```

Login admin: POST `/api/auth/login` com o e-mail/senha reais → cookie `admin_token`
httpOnly. Credenciais inválidas → 401. Payload malicioso em `/api/booking` → 400
(zod). Todos verificados em prod-mode local antes do merge.

---

## 6. Checklist final antes de publicar

- [ ] `.env` de produção preenchido com as 4 obrigatórias + e-mail.
- [ ] `NODE_ENV=production` no ambiente (senão a trava de boot não age e o
      `secure` cookie fica desligado).
- [ ] `SITE_URL` = domínio real (CORS/canonical/sitemap dependem dela).
- [ ] Chromium do Puppeteer disponível (testar gerando 1 contrato).
- [ ] Backup agendado de `server/database.sqlite`.
- [ ] Senha admin guardada em gerenciador de senhas (o hash no `.env` não é reversível).
