// STEP: Sanitização de input de usuário antes de interpolar em HTML
// (e-mails via Nodemailer e contrato renderizado pelo Puppeteer).
// Sem isso, um "nome" contendo <script> viraria HTML ativo no e-mail
// da nutricionista e no Chromium headless que gera o PDF.

const HTML_ESCAPES = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
};

export function escapeHtml(value) {
    if (value === null || value === undefined) return '';
    return String(value).replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch]);
}

// Assinaturas são data-URLs de imagem desenhadas no canvas do site.
// Só aceitamos esse formato — qualquer outra coisa é descartada.
export function sanitizeSignatureDataUrl(value) {
    if (typeof value !== 'string') return null;
    return /^data:image\/(png|jpe?g|webp);base64,[A-Za-z0-9+/=]+$/.test(value) ? value : null;
}

export default escapeHtml;
