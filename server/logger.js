// STEP: Logger estruturado mínimo (pino). Substitui o logging ad-hoc de
// console.* nos pontos centrais (boot, error middleware). Módulos legados
// ainda usam console — migração incremental sem churn.
import pino from 'pino';

const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    // Em produção emite JSON puro (parseável); em dev o formato padrão já basta.
});

export default logger;
