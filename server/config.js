// STEP: Módulo único de configuração e segredos do servidor.
// Toda leitura de variável de ambiente sensível acontece aqui — nunca
// espalhada pelos módulos de rota. Em produção, o boot é travado se
// os segredos obrigatórios não existirem.
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

// STEP: Segredos obrigatórios em produção (sem fallback hardcoded).
const REQUIRED_IN_PRODUCTION = ['JWT_SECRET', 'ADMIN_EMAIL', 'ADMIN_PASSWORD_HASH'];

if (isProduction) {
    const missing = REQUIRED_IN_PRODUCTION.filter((name) => !process.env[name]);
    if (missing.length > 0) {
        console.error(
            `[Config] FATAL: variáveis de ambiente obrigatórias ausentes em produção: ${missing.join(', ')}.\n` +
            `[Config] Gere-as antes do deploy (ex.: JWT_SECRET via "openssl rand -hex 32", ` +
            `ADMIN_PASSWORD_HASH via bcrypt) e defina no .env do servidor.`
        );
        process.exit(1);
    }
}

// Em desenvolvimento sem JWT_SECRET definido, usa um segredo efêmero
// aleatório por processo — sessões não sobrevivem a restart, mas nenhum
// valor fixo existe no código-fonte.
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');

export const config = {
    isProduction,
    port: process.env.PORT || 3001,
    jwtSecret: JWT_SECRET,
    adminEmail: process.env.ADMIN_EMAIL || process.env.VITE_ADMIN_EMAIL || null,
    adminPasswordHash: process.env.ADMIN_PASSWORD_HASH || null,
    siteUrl: (process.env.SITE_URL || 'http://localhost:5173').replace(/\/+$/, ''),
    // Integração NotebookLM/Python: opcional. Sem esses paths definidos,
    // as rotas de IA respondem 503 em vez de depender da máquina do dev.
    nlmProxyPath: process.env.NLM_PROXY_PATH || null,
    pythonPath: process.env.PYTHON_PATH || null,
    aiChatEnabled: Boolean(process.env.NLM_PROXY_PATH),
};

export default config;
