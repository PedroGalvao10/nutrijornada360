// STEP: Rate limiting persistente com store em SQLite.
// O limite sobrevive a restart do processo (diferente do Map in-memory
// que era usado em nutrition-api.js) sem exigir Redis — adequado para
// deploy single-instance (Hostinger/VPS).
import rateLimit from 'express-rate-limit';
import db from './db.js';

// Tabela dedicada de contadores de rate limit
db.run(`
    CREATE TABLE IF NOT EXISTS rate_limits (
        key TEXT PRIMARY KEY,
        hits INTEGER NOT NULL DEFAULT 0,
        reset_time INTEGER NOT NULL
    )
`);

class SqliteStore {
    constructor(prefix) {
        this.prefix = prefix;
        this.windowMs = 60_000;
    }

    init(options) {
        this.windowMs = options.windowMs;
    }

    key(k) {
        return `${this.prefix}:${k}`;
    }

    increment(key) {
        const now = Date.now();
        const resetTime = now + this.windowMs;
        const k = this.key(key);
        return new Promise((resolve, reject) => {
            // Janela expirada reinicia o contador; senão incrementa.
            db.run(
                `INSERT INTO rate_limits (key, hits, reset_time) VALUES (?, 1, ?)
                 ON CONFLICT(key) DO UPDATE SET
                    hits = CASE WHEN reset_time < ? THEN 1 ELSE hits + 1 END,
                    reset_time = CASE WHEN reset_time < ? THEN ? ELSE reset_time END`,
                [k, resetTime, now, now, resetTime],
                (err) => {
                    if (err) return reject(err);
                    db.get(`SELECT hits, reset_time FROM rate_limits WHERE key = ?`, [k], (err2, row) => {
                        if (err2) return reject(err2);
                        resolve({ totalHits: row?.hits ?? 1, resetTime: new Date(row?.reset_time ?? resetTime) });
                    });
                }
            );
        });
    }

    decrement(key) {
        return new Promise((resolve) => {
            db.run(`UPDATE rate_limits SET hits = MAX(hits - 1, 0) WHERE key = ?`, [this.key(key)], () => resolve());
        });
    }

    resetKey(key) {
        return new Promise((resolve) => {
            db.run(`DELETE FROM rate_limits WHERE key = ?`, [this.key(key)], () => resolve());
        });
    }
}

const makeLimiter = ({ prefix, windowMs, max, message }) => rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    store: new SqliteStore(prefix),
    message: { error: message },
});

// Booking dispara Puppeteer por requisição — o limite mais estrito de todos.
export const bookingLimiter = makeLimiter({
    prefix: 'booking', windowMs: 60 * 60 * 1000, max: 5,
    message: 'Muitas tentativas de agendamento. Tente novamente em 1 hora.',
});

export const leadsLimiter = makeLimiter({
    prefix: 'leads', windowMs: 15 * 60 * 1000, max: 10,
    message: 'Muitos envios. Aguarde alguns minutos.',
});

export const aiChatLimiter = makeLimiter({
    prefix: 'aichat', windowMs: 15 * 60 * 1000, max: 20,
    message: 'Muitas mensagens em sequência. Aguarde alguns minutos.',
});

export const contractPdfLimiter = makeLimiter({
    prefix: 'contractpdf', windowMs: 15 * 60 * 1000, max: 10,
    message: 'Muitas tentativas de download. Aguarde alguns minutos.',
});

// Limiter genérico para as rotas públicas de nutrição (substitui o Map in-memory)
export const nutritionLimiter = makeLimiter({
    prefix: 'nutrition', windowMs: 60 * 1000, max: 30,
    message: 'Muitas requisições. Aguarde um minuto.',
});
