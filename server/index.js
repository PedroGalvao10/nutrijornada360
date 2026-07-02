import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import db, { initDb } from './db.js';
import config from './config.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Importa o novo módulo de rotas de nutrição
import nutritionRouter from './nutrition-api.js';

// BOOKING FLOW: Importa módulo de agendamento/contratos
import bookingRouter, { setAuthMiddleware } from './booking-api.js';

const app = express();
const PORT = config.port;
const JWT_SECRET = config.jwtSecret;

initDb();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [
        'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175',
        'http://localhost:5176', 'http://localhost:5177', 'http://localhost:5178',
        'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://127.0.0.1:5175',
        'http://127.0.0.1:5176', 'http://127.0.0.1:5177', 'http://127.0.0.1:5178',
    ],
    credentials: true,
}));

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: 'Muitas tentativas de login. Tente novamente em 15 minutos.' }
});

const requireAuth = (req, res, next) => {
    const token = req.cookies.admin_token;
    if (!token) return res.status(401).json({ error: 'Acesso negado' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token inválido ou expirado' });
    }
};

app.post('/api/auth/login', loginLimiter, async (req, res) => {
    const { email, password } = req.body || {};
    const ip = req.ip;

    // Compara e-mail e hash bcrypt — nunca senha em texto plano.
    // Sem credenciais configuradas no ambiente, o login fica desabilitado.
    let isMatch = false;
    if (email && password && config.adminEmail && config.adminPasswordHash) {
        const emailMatch = email === config.adminEmail;
        const passMatch = await bcrypt.compare(String(password), config.adminPasswordHash);
        isMatch = emailMatch && passMatch;
    }

    db.run(`INSERT INTO login_logs (email, ip, success) VALUES (?, ?, ?)`, [email, ip, isMatch ? 1 : 0]);

    if (!isMatch) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '8h' });
    res.cookie('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 8 * 60 * 60 * 1000
    });

    res.json({ message: 'Login realizado com sucesso', ok: true });
});

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('admin_token');
    res.json({ message: 'Logout realizado' });
});

app.get('/api/auth/check', requireAuth, (req, res) => {
    res.json({ ok: true });
});

// Registra as rotas de nutrição (Proxy para USDA, Spoonacular, etc)
app.use('/api/nutrition', nutritionRouter);

// BOOKING FLOW: Registra rotas de agendamento/contratos
setAuthMiddleware(requireAuth);
app.use('/api/booking', bookingRouter);

app.get('/api/articles', (req, res) => {
    db.all(`SELECT * FROM articles WHERE is_published = 1 ORDER BY published_at DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/articles/:slug', (req, res) => {
    db.get(`SELECT * FROM articles WHERE slug = ?`, [req.params.slug], (err, row) => {
        if (err || !row) return res.status(404).json({ error: 'Não encontrado' });
        res.json(row);
    });
});

app.post('/api/articles', requireAuth, (req, res) => {
    const { 
      title, slug, hat, content, excerpt, meta_description, 
      cover_image_url, image_alt, reading_time, published_at, is_published 
    } = req.body;
    
    // Auto-gera um abstract se vazio, removendo tags HTML
    const finalExcerpt = excerpt || content.replace(/<[^>]*>?/gm, '').substring(0, 120) + '...';

    const stmt = db.prepare(`
      INSERT INTO articles (
        title, slug, hat, content, excerpt, meta_description, 
        cover_image_url, image_alt, reading_time, published_at, is_published
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run([
      title, slug, hat, content, finalExcerpt, meta_description, 
      cover_image_url, image_alt, reading_time, published_at, is_published ? 1 : 0
    ], function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ id: this.lastID, success: true });
    });
});


app.put('/api/articles/:id', requireAuth, (req, res) => {
    const { 
      title, slug, hat, content, excerpt, meta_description, 
      cover_image_url, image_alt, reading_time, published_at, is_published
    } = req.body;
    
    const finalExcerpt = excerpt || content.replace(/<[^>]*>?/gm, '').substring(0, 120) + '...';

    const stmt = db.prepare(`
      UPDATE articles SET 
        title = ?, slug = ?, hat = ?, content = ?, excerpt = ?, meta_description = ?, 
        cover_image_url = ?, image_alt = ?, reading_time = ?, published_at = ?,
        is_published = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    stmt.run([
      title, slug, hat, content, finalExcerpt, meta_description, 
      cover_image_url, image_alt, reading_time, published_at, 
      is_published ? 1 : 0, req.params.id
    ], function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ success: true });
    });
});

app.delete('/api/articles/:id', requireAuth, (req, res) => {
    db.run(`DELETE FROM articles WHERE id = ?`, [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: 'Artigo removido com sucesso' });
    });
});


app.get('/api/admin/articles', requireAuth, (req, res) => {
    db.all(`SELECT * FROM articles ORDER BY created_at DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// --- Integração NutriChat (NotebookLM CLI) ---
// Depende de NLM_PROXY_PATH (e opcionalmente PYTHON_PATH) no ambiente.
// Sem eles, a rota responde 503 — nada de caminho da máquina do dev no código.
import { spawn } from 'child_process';
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DEFAULT_NOTEBOOK_ID = process.env.NLM_DEFAULT_NOTEBOOK_ID || null;

app.post('/api/ai/chat', async (req, res) => {
    const { message, notebookId = DEFAULT_NOTEBOOK_ID } = req.body || {};

    if (!config.aiChatEnabled) {
        return res.status(503).json({ error: 'O chat de IA está temporariamente indisponível.' });
    }
    if (!message || typeof message !== 'string' || message.length > 2000) {
        return res.status(400).json({ error: 'Mensagem é obrigatória (máx. 2000 caracteres)' });
    }
    // Valida o notebookId antes de repassar a um processo externo
    if (!notebookId || !UUID_RE.test(notebookId)) {
        return res.status(400).json({ error: 'notebookId inválido' });
    }

    console.log(`[AI Chat] Consultando Notebook: ${notebookId} | Query: ${message.substring(0, 50)}...`);

    const pythonProcess = spawn(config.pythonPath || 'python', [config.nlmProxyPath, notebookId, message], {
        env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
    });

    let stdout = '';
    let stderr = '';

    pythonProcess.stdout.on('data', (data) => {
        stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        stderr += data.toString();
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`[AI Chat] Erro (code ${code}): ${stderr}`);
            return res.status(500).json({ error: 'Erro ao consultar a IA.', details: stderr });
        }
        res.json({ response: stdout.trim() });
    });
});
// --------------------------------------------------

// Configuração para Hostinger: Servir a pasta /dist do compilado do React
// Rota de Proxy para Google Sheets (Elimina erros de CORS no Navegador)
app.post('/api/leads', express.json(), async (req, res) => {
    const webhookUrl = process.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL;
    
    if (!webhookUrl || webhookUrl === 'SUA_URL_AQUI') {
        console.error('[API] Erro: VITE_GOOGLE_SHEETS_WEBHOOK_URL não configurada no .env');
        return res.status(500).json({ error: 'URL do Google Sheets não configurada' });
    }

    try {
        console.log(`[API] Enviando lead para o Google Sheets: ${req.body.email}`);
        
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });

        // Como o Apps Script pode retornar redirecionamento (302), o node-fetch/native-fetch segue por padrão.
        // Verificamos o resultado final.
        const result = await response.text();
        console.log(`[API] Resposta do Google: ${result.substring(0, 50)}...`);
        
        res.json({ success: true, message: 'Dados enviados com sucesso' });
    } catch (error) {
        console.error('[API] Erro ao enviar para o Google Sheets:', error);
        res.status(500).json({ error: 'Falha na comunicação com o Google Sheets' });
    }
});

// Sitemap dinâmico: gerado das rotas reais + artigos publicados, com SITE_URL.
// (Substitui o sitemap.xml estático que listava /logistica e /blog, rotas mortas.)
app.get('/sitemap.xml', (req, res) => {
    const staticRoutes = [
        { loc: '/', changefreq: 'weekly', priority: '1.0' },
        { loc: '/planos', changefreq: 'monthly', priority: '0.9' },
        { loc: '/sobre', changefreq: 'monthly', priority: '0.7' },
        { loc: '/artigos', changefreq: 'weekly', priority: '0.8' },
        { loc: '/ferramentas', changefreq: 'monthly', priority: '0.6' },
    ];
    db.all(`SELECT slug, COALESCE(updated_at, published_at) AS lastmod FROM articles WHERE is_published = 1`, [], (err, rows) => {
        const articles = (err || !rows) ? [] : rows;
        const urls = [
            ...staticRoutes.map((r) =>
                `  <url>\n    <loc>${config.siteUrl}${r.loc}</loc>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`
            ),
            ...articles.map((a) => {
                const lastmod = a.lastmod ? `\n    <lastmod>${String(a.lastmod).substring(0, 10)}</lastmod>` : '';
                return `  <url>\n    <loc>${config.siteUrl}/blog/${a.slug}</loc>${lastmod}\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`;
            }),
        ];
        res.type('application/xml').send(
            `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`
        );
    });
});

const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// SPA fallback (BrowserRouter): qualquer rota não-API serve o index.html.
// Rotas /api desconhecidas retornam 404 JSON em vez de HTML.
app.use((req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'Rota não encontrada' });
    }
    // root + caminho relativo: evita que o sendFile negue caminhos absolutos
    // que contenham diretórios-dot (ex.: ".gemini") como se fossem dotfiles.
    res.sendFile('index.html', { root: distPath });
});

// Inicialização Final do Servidor
app.listen(PORT, () => console.log(`[API] Backend Express rodando na porta ${PORT}`));

