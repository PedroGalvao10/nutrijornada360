import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import db, { initDb } from './db.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Importa o novo módulo de rotas de nutrição
import nutritionRouter from './nutrition-api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'a_very_secret_key_123';
const ADMIN_EMAIL = process.env.VITE_ADMIN_EMAIL || process.env.ADMIN_EMAIL || 'admin@nutrijornada.com';
const ADMIN_PASS = process.env.VITE_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || '123456';

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

app.post('/api/auth/login', loginLimiter, (req, res) => {
    const { email, password } = req.body;
    const ip = req.ip;

    const isMatch = (email === ADMIN_EMAIL && password === ADMIN_PASS);

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

// --- NOVO: Integração NutriChat (NotebookLM CLI) ---
import { spawn } from 'child_process';
app.post('/api/ai/chat', async (req, res) => {
    const { message, notebookId = '58532935-cd30-467c-9b7e-cf1920496423' } = req.body;
    
    if (!message) return res.status(400).json({ error: 'Mensagem é obrigatória' });

    // Path absoluto para o proxy determinístico
    const proxyPath = 'c:\\Users\\soare\\.gemini\\antigravity\\scratch\\execution\\nlm_proxy.py';
    
    console.log(`[AI Chat] Consultando Notebook: ${notebookId} | Query: ${message.substring(0, 50)}...`);

    const pythonProcess = spawn('python', [proxyPath, notebookId, message], {
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

const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

app.use((req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

// Inicialização Final do Servidor
app.listen(PORT, () => console.log(`[API] Backend Express rodando na porta ${PORT}`));

