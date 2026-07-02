// ==========================================================
// BOOKING API: Módulo Express para o fluxo de consultoria
// exclusiva com curadoria humana.
// Endpoints: CRUD de bookings, aprovação/rejeição, PDF
// ==========================================================

import express from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import db from './db.js';
import config from './config.js';
import { generateContractHTML } from './contract-template.js';
import { sendNewBookingNotification, sendPaymentConfirmation } from './mail-service.js';
import { validate, bookingSchema, rejectSchema, signatureSchema } from './schemas.js';
import { bookingLimiter, contractPdfLimiter } from './rate-limit.js';
import { sanitizeSignatureDataUrl } from './sanitize.js';

const router = express.Router();

/**
 * Gera Payload Copie e Cole do PIX (EMV Co padrão BR Code)
 */
function generatePixPayload({ chavePix, nomeRecebedor, cidadeRecebedor, valorCents, txid }) {
    const formatTLV = (id, val) => {
        const len = String(val).length.toString().padStart(2, '0');
        return `${id}${len}${val}`;
    };

    const payloadFormat = formatTLV('00', '01');
    const gui = formatTLV('00', 'br.gov.bcb.pix');
    const key = formatTLV('01', chavePix);
    const merchantAccount = formatTLV('26', `${gui}${key}`);
    const mcc = formatTLV('52', '0000');
    const currency = formatTLV('53', '986');
    const amountStr = (valorCents / 100).toFixed(2);
    const amount = formatTLV('54', amountStr);
    const country = formatTLV('58', 'BR');
    const merchantName = formatTLV('59', nomeRecebedor.substring(0, 25));
    const merchantCity = formatTLV('60', cidadeRecebedor.substring(0, 15));
    const reference = formatTLV('05', txid || 'NUTRIPRO360');
    const additionalData = formatTLV('62', reference);

    const partialPayload = `${payloadFormat}${merchantAccount}${mcc}${currency}${amount}${country}${merchantName}${merchantCity}${additionalData}6304`;

    let crc = 0xFFFF;
    for (let i = 0; i < partialPayload.length; i++) {
        let code = partialPayload.charCodeAt(i);
        crc ^= (code << 8);
        for (let j = 0; j < 8; j++) {
            if (crc & 0x8000) {
                crc = (crc << 1) ^ 0x1021;
            } else {
                crc = (crc << 1);
            }
        }
    }
    crc = (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');

    return `${partialPayload}${crc}`;
}

// ============================================================
// STEP: Middleware de autenticação admin (reutiliza do index.js)
// Importado como parâmetro na montagem do router
// ============================================================
let requireAuth;
export function setAuthMiddleware(middleware) {
    requireAuth = middleware;
}

// ============================================================
// STEP: Helper - Promisify SQLite para async/await
// ============================================================
function dbRun(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve({ lastID: this.lastID, changes: this.changes });
        });
    });
}

function dbGet(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

function dbAll(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

// ============================================================
// STEP: Helper - Gerar PDF via Puppeteer
// ============================================================
async function generatePDF(html) {
    const puppeteer = await import('puppeteer');
    // Sandbox do Chromium HABILITADO por padrão. O HTML renderizado inclui
    // dados de usuário (mesmo escapados, defesa em profundidade). Apenas
    // hosts que comprovadamente não suportam sandbox (alguns containers)
    // podem desativar via PUPPETEER_NO_SANDBOX=1.
    const launchArgs = process.env.PUPPETEER_NO_SANDBOX === '1'
        ? ['--no-sandbox', '--disable-setuid-sandbox']
        : [];
    const browser = await puppeteer.default.launch({
        headless: true,
        args: launchArgs
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' }
    });

    await browser.close();
    return pdfBuffer;
}

// ============================================================
// STEP: POST /api/booking — Criar novo booking
// Recebe todos os dados do formulário + triagem + assinatura
// Gera contrato HTML e token de acompanhamento
// ============================================================
router.post('/', bookingLimiter, validate(bookingSchema), async (req, res) => {
    try {
        const {
            nome, email, whatsapp, cpf, dataNascimento,
            objetivo, descricaoObjetivo, condicoesSaude,
            medicamentos, rotinaAlimentar, praticaExercicio,
            detalhesExercicio,
            planId, planTitle, planPriceCents,
            parcelas, valorParcelaCents,
            assinaturaBase64
        } = req.body;

        // STEP: A assinatura precisa ser uma data-URL de imagem válida —
        // é interpolada diretamente num <img src> do contrato.
        const assinaturaSegura = sanitizeSignatureDataUrl(assinaturaBase64);
        if (!assinaturaSegura) {
            return res.status(400).json({ error: 'Assinatura em formato inválido' });
        }

        // STEP: Gera token único para acompanhamento
        const bookingToken = crypto.randomUUID();

        // STEP: Busca assinatura admin se existir
        const adminSig = await dbGet(
            `SELECT value FROM admin_settings WHERE key = 'admin_signature'`
        );

        // STEP: Gera HTML do contrato com todos os dados
        const contratoHTML = generateContractHTML({
            nome, cpf, dataNascimento, email, whatsapp,
            plan_title: planTitle,
            plan_price_cents: planPriceCents,
            parcelas: parcelas || 1,
            valor_parcela_cents: valorParcelaCents || planPriceCents,
            objetivo, descricao_objetivo: descricaoObjetivo,
            assinatura_usuario: assinaturaBase64,
            assinatura_admin: adminSig?.value || null,
            assinado_em: new Date().toISOString(),
            booking_token: bookingToken
        });

        // STEP: Insere no banco
        const result = await dbRun(`
            INSERT INTO bookings (
                booking_token, nome, email, whatsapp, cpf, data_nascimento,
                objetivo, descricao_objetivo, condicoes_saude, medicamentos,
                rotina_alimentar, pratica_exercicio, detalhes_exercicio,
                plan_id, plan_title, plan_price_cents, parcelas, valor_parcela_cents,
                contrato_html, assinatura_usuario, assinado_em,
                status, ip_address, user_agent
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending_review', ?, ?)
        `, [
            bookingToken, nome, email, whatsapp, cpf, dataNascimento,
            objetivo, descricaoObjetivo,
            JSON.stringify(condicoesSaude || []),
            medicamentos, rotinaAlimentar, praticaExercicio, detalhesExercicio,
            planId, planTitle, planPriceCents, parcelas || 1,
            valorParcelaCents || planPriceCents,
            contratoHTML, assinaturaBase64, new Date().toISOString(),
            req.ip, req.get('User-Agent')
        ]);

        console.log(`[Booking] Novo booking #${result.lastID} criado — ${nome} — ${planTitle}`);

        // STEP: Dispara e-mail de notificação para a Mariana (background)
        // Inclui o PDF do contrato como anexo
        (async () => {
            try {
                const pdfBuffer = await generatePDF(contratoHTML);
                await sendNewBookingNotification({
                    nome, email, whatsapp, plan_title: planTitle,
                    objetivo, descricao_objetivo: descricaoObjetivo,
                    condicoes_saude: Array.isArray(condicoesSaude) ? condicoesSaude.join(', ') : condicoesSaude
                }, pdfBuffer);
                console.log(`[Mail] Notificação enviada para Mariana (#${result.lastID})`);
            } catch (mailErr) {
                console.error(`[Mail] Falha ao enviar notificação (#${result.lastID}):`, mailErr);
            }
        })();

        res.json({
            success: true,
            bookingId: result.lastID,
            bookingToken,
            status: 'pending_review'
        });

    } catch (err) {
        console.error('[Booking] Erro ao criar:', err);
        res.status(500).json({ error: 'Erro interno ao criar booking' });
    }
});

// ============================================================
// STEP: GET /api/booking/status/:token — Polling de status
// Endpoint público — autenticado por token do booking
// ============================================================
router.get('/status/:token', async (req, res) => {
    try {
        const booking = await dbGet(
            `SELECT id, status, rejection_reason, approved_at, payment_deadline, plan_title, plan_price_cents, parcelas, valor_parcela_cents
             FROM bookings WHERE booking_token = ?`,
            [req.params.token]
        );

        if (!booking) {
            return res.status(404).json({ error: 'Booking não encontrado' });
        }

        // STEP: Verifica se prazo de pagamento expirou
        if (booking.status === 'approved' && booking.payment_deadline) {
            const deadline = new Date(booking.payment_deadline);
            if (new Date() > deadline) {
                await dbRun(
                    `UPDATE bookings SET status = 'expired' WHERE id = ?`,
                    [booking.id]
                );
                booking.status = 'expired';
            }
        }

        let pixPayload = null;
        if (booking.status === 'approved') {
            const adminPix = await dbGet(
                `SELECT value FROM admin_settings WHERE key = 'admin_pix_key'`
            );
            const chavePix = adminPix?.value || 'marianabermudesnutri@gmail.com';
            
            pixPayload = generatePixPayload({
                chavePix,
                nomeRecebedor: 'MARIANA BERMUDES',
                cidadeRecebedor: 'SAO PAULO',
                valorCents: booking.valor_parcela_cents || booking.plan_price_cents,
                txid: `NUTRIPRO${booking.id}`
            });
        }

        res.json({
            status: booking.status,
            rejectionReason: booking.rejection_reason,
            approvedAt: booking.approved_at,
            paymentDeadline: booking.payment_deadline,
            planTitle: booking.plan_title,
            planPriceCents: booking.plan_price_cents,
            parcelas: booking.parcelas,
            valorParcelaCents: booking.valor_parcela_cents,
            pixPayload
        });

    } catch (err) {
        console.error('[Booking] Erro ao buscar status:', err);
        res.status(500).json({ error: 'Erro interno' });
    }
});

// ============================================================
// STEP: GET /api/booking/contract-pdf/:token — Download do PDF
// Usa Puppeteer para renderizar HTML → PDF
// ============================================================
router.get('/contract-pdf/:token', contractPdfLimiter, async (req, res) => {
    try {
        const booking = await dbGet(
            `SELECT * FROM bookings WHERE booking_token = ?`,
            [req.params.token]
        );

        if (!booking) {
            return res.status(404).json({ error: 'Booking não encontrado' });
        }

        // STEP: Validação de Identidade (LGPD) — Bypass para Admins logados
        let isAdmin = false;
        const token = req.cookies?.admin_token;
        if (token) {
            try {
                const decoded = jwt.verify(token, config.jwtSecret);
                if (decoded && decoded.role === 'admin') {
                    isAdmin = true;
                }
            } catch (err) {
                // Token expirado/inválido — segue para a validação comum
            }
        }

        if (!isAdmin) {
            const { verify } = req.query;
            if (!verify) {
                return res.status(403).json({ 
                    error: 'LGPD_VERIFY_REQUIRED', 
                    message: 'Confirmação requerida. Forneça o CPF ou WhatsApp cadastrado para baixar o contrato.' 
                });
            }

            const cleanVerify = String(verify).replace(/\D/g, '');
            const cleanDbCpf = booking.cpf ? booking.cpf.replace(/\D/g, '') : '';
            const cleanDbWhatsapp = booking.whatsapp ? booking.whatsapp.replace(/\D/g, '') : '';

            // Exige o número COMPLETO (CPF ou WhatsApp). Aceitar sufixos de
            // poucos dígitos reduzia a entropia e viabilizava força bruta.
            const matchesCpf = cleanDbCpf.length > 0 && cleanDbCpf === cleanVerify;
            const matchesWhatsapp = cleanDbWhatsapp.length > 0 && cleanDbWhatsapp === cleanVerify;

            if (!matchesCpf && !matchesWhatsapp) {
                return res.status(403).json({ 
                    error: 'INVALID_VERIFICATION', 
                    message: 'Dados de confirmação inválidos. O CPF ou WhatsApp não bate com os dados cadastrados.' 
                });
            }
        }

        // STEP: Carrega o arquivo do disco ou gera sob demanda (fallback)
        const fs = await import('fs');
        const path = await import('path');
        const { fileURLToPath } = await import('url');
        
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const pdfPath = path.join(__dirname, 'storage', 'contracts', `contrato_${booking.booking_token}.pdf`);
        
        let pdfBuffer;
        
        if (fs.existsSync(pdfPath)) {
            console.log(`[PDF Download] Servindo contrato do cache em disco: ${pdfPath}`);
            pdfBuffer = fs.readFileSync(pdfPath);
        } else {
            console.log(`[PDF Download] Arquivo físico não encontrado. Gerando dinamicamente via Puppeteer...`);
            let html = booking.contrato_html;
            if (booking.status === 'approved' || booking.status === 'paid' || booking.status === 'active') {
                const adminSig = await dbGet(
                    `SELECT value FROM admin_settings WHERE key = 'admin_signature'`
                );
                html = generateContractHTML({
                    ...booking,
                    descricao_objetivo: booking.descricao_objetivo,
                    assinatura_admin: adminSig?.value || booking.assinatura_admin,
                    booking_token: booking.booking_token
                }, { showApprovalStamp: true });
            }
            pdfBuffer = await generatePDF(html);
        }

        // STEP: Envia PDF como download
        const filename = `contrato_${booking.nome.replace(/\s+/g, '_').toLowerCase()}_${booking.booking_token.substring(0, 8)}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(pdfBuffer);

    } catch (err) {
        console.error('[Booking] Erro ao obter PDF do contrato:', err);
        res.status(500).json({ error: 'Erro ao processar PDF do contrato' });
    }
});

// ============================================================
// ADMIN ROUTES — Requerem autenticação JWT
// ============================================================

// STEP: GET /api/admin/bookings — Listar todos os bookings
router.get('/admin/list', (req, res, next) => requireAuth(req, res, next), async (req, res) => {
    try {
        const statusFilter = req.query.status;
        let sql = `SELECT id, booking_token, nome, email, whatsapp, plan_id, plan_title, 
                    plan_price_cents, parcelas, status, created_at, approved_at, paid_at 
                    FROM bookings`;
        const params = [];

        if (statusFilter) {
            sql += ` WHERE status = ?`;
            params.push(statusFilter);
        }

        sql += ` ORDER BY created_at DESC`;
        const bookings = await dbAll(sql, params);

        res.json(bookings);
    } catch (err) {
        console.error('[Booking Admin] Erro ao listar:', err);
        res.status(500).json({ error: 'Erro interno' });
    }
});

// STEP: GET /api/admin/bookings/:id — Detalhes completos
router.get('/admin/:id', (req, res, next) => requireAuth(req, res, next), async (req, res) => {
    try {
        const booking = await dbGet(`SELECT * FROM bookings WHERE id = ?`, [req.params.id]);
        if (!booking) return res.status(404).json({ error: 'Não encontrado' });

        // STEP: Parse JSON fields
        if (booking.condicoes_saude) {
            try { booking.condicoes_saude = JSON.parse(booking.condicoes_saude); }
            catch { /* keep as string */ }
        }

        res.json(booking);
    } catch (err) {
        console.error('[Booking Admin] Erro ao buscar detalhes:', err);
        res.status(500).json({ error: 'Erro interno' });
    }
});

// STEP: PATCH /api/admin/bookings/:id/approve — Aprovar contrato
router.patch('/admin/:id/approve', (req, res, next) => requireAuth(req, res, next), async (req, res) => {
    try {
        const booking = await dbGet(`SELECT * FROM bookings WHERE id = ?`, [req.params.id]);
        if (!booking) return res.status(404).json({ error: 'Não encontrado' });
        if (booking.status !== 'pending_review') {
            return res.status(400).json({ error: `Status atual é '${booking.status}', não pode aprovar` });
        }

        // STEP: Define deadline de pagamento (2 horas a partir de agora)
        const now = new Date();
        const deadline = new Date(now.getTime() + 2 * 60 * 60 * 1000);

        // STEP: Busca assinatura admin para aplicar ao contrato
        const adminSig = await dbGet(
            `SELECT value FROM admin_settings WHERE key = 'admin_signature'`
        );

        await dbRun(`
            UPDATE bookings SET 
                status = 'approved',
                reviewed_at = ?,
                approved_at = ?,
                payment_deadline = ?,
                assinatura_admin = ?
            WHERE id = ?
        `, [
            now.toISOString(),
            now.toISOString(),
            deadline.toISOString(),
            adminSig?.value || null,
            req.params.id
        ]);

        console.log(`[Booking Admin] Booking #${req.params.id} APROVADO — Deadline: ${deadline.toISOString()}`);

        // STEP: Gera e salva o PDF do contrato assinado fisicamente no disco em background para poupar latência
        (async () => {
            try {
                const fs = await import('fs');
                const path = await import('path');
                const { fileURLToPath } = await import('url');
                
                const __filename = fileURLToPath(import.meta.url);
                const __dirname = path.dirname(__filename);
                
                const contractsDir = path.join(__dirname, 'storage', 'contracts');
                if (!fs.existsSync(contractsDir)) {
                    fs.mkdirSync(contractsDir, { recursive: true });
                }
                
                const contratoHTML = generateContractHTML({
                    ...booking,
                    status: 'approved',
                    reviewed_at: now.toISOString(),
                    approved_at: now.toISOString(),
                    payment_deadline: deadline.toISOString(),
                    assinatura_admin: adminSig?.value || booking.assinatura_admin,
                    booking_token: booking.booking_token
                }, { showApprovalStamp: true });
                
                const pdfBuffer = await generatePDF(contratoHTML);
                const pdfPath = path.join(contractsDir, `contrato_${booking.booking_token}.pdf`);
                
                fs.writeFileSync(pdfPath, pdfBuffer);
                console.log(`[PDF Archive] Contrato salvo fisicamente em disco: ${pdfPath}`);
            } catch (pdfErr) {
                console.error('[PDF Archive] Falha ao arquivar PDF físico:', pdfErr);
            }
        })();

        res.json({
            success: true,
            status: 'approved',
            paymentDeadline: deadline.toISOString()
        });

    } catch (err) {
        console.error('[Booking Admin] Erro ao aprovar:', err);
        res.status(500).json({ error: 'Erro interno' });
    }
});

// STEP: PATCH /api/admin/bookings/:id/reject — Rejeitar contrato
router.patch('/admin/:id/reject', (req, res, next) => requireAuth(req, res, next), validate(rejectSchema), async (req, res) => {
    try {
        const { reason } = req.body;
        const booking = await dbGet(`SELECT status FROM bookings WHERE id = ?`, [req.params.id]);
        if (!booking) return res.status(404).json({ error: 'Não encontrado' });
        if (booking.status !== 'pending_review') {
            return res.status(400).json({ error: `Status atual é '${booking.status}', não pode rejeitar` });
        }

        await dbRun(`
            UPDATE bookings SET 
                status = 'rejected', 
                reviewed_at = ?, 
                rejection_reason = ? 
            WHERE id = ?
        `, [new Date().toISOString(), reason || 'Sem motivo informado', req.params.id]);

        console.log(`[Booking Admin] Booking #${req.params.id} REJEITADO — Motivo: ${reason}`);

        res.json({ success: true, status: 'rejected' });

    } catch (err) {
        console.error('[Booking Admin] Erro ao rejeitar:', err);
        res.status(500).json({ error: 'Erro interno' });
    }
});

// STEP: POST /api/admin/signature — Upload da assinatura da Mariana
router.post('/admin/signature', (req, res, next) => requireAuth(req, res, next), validate(signatureSchema), async (req, res) => {
    try {
        const signature = sanitizeSignatureDataUrl(req.body.signature);
        if (!signature) return res.status(400).json({ error: 'Assinatura em formato inválido' });

        // STEP: Upsert — insere ou atualiza
        await dbRun(`
            INSERT INTO admin_settings (key, value, updated_at) 
            VALUES ('admin_signature', ?, CURRENT_TIMESTAMP)
            ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = CURRENT_TIMESTAMP
        `, [signature, signature]);

        console.log('[Booking Admin] Assinatura da nutricionista atualizada');
        res.json({ success: true });

    } catch (err) {
        console.error('[Booking Admin] Erro ao salvar assinatura:', err);
        res.status(500).json({ error: 'Erro interno' });
    }
});

// STEP: PATCH /api/admin/bookings/:id/mark-paid — Marcar como pago
router.patch('/admin/:id/mark-paid', (req, res, next) => requireAuth(req, res, next), async (req, res) => {
    try {
        const booking = await dbGet(`SELECT * FROM bookings WHERE id = ?`, [req.params.id]);
        if (!booking) return res.status(404).json({ error: 'Não encontrado' });

        await dbRun(`
            UPDATE bookings SET status = 'paid', paid_at = ? WHERE id = ?
        `, [new Date().toISOString(), req.params.id]);

        console.log(`[Booking Admin] Booking #${req.params.id} marcado como PAGO`);

        // STEP: Dispara e-mail de confirmação de pagamento para o cliente em background com o PDF assinado
        (async () => {
            try {
                const fs = await import('fs');
                const path = await import('path');
                const { fileURLToPath } = await import('url');
                
                const __filename = fileURLToPath(import.meta.url);
                const __dirname = path.dirname(__filename);
                const pdfPath = path.join(__dirname, 'storage', 'contracts', `contrato_${booking.booking_token}.pdf`);
                
                let pdfBuffer;
                
                if (fs.existsSync(pdfPath)) {
                    console.log(`[Mail Customer] Carregando PDF arquivado para envio: ${pdfPath}`);
                    pdfBuffer = fs.readFileSync(pdfPath);
                } else {
                    console.log(`[Mail Customer] PDF arquivado não encontrado. Gerando sob demanda para envio...`);
                    const adminSig = await dbGet(
                        `SELECT value FROM admin_settings WHERE key = 'admin_signature'`
                    );
                    const html = generateContractHTML({
                        ...booking,
                        status: 'paid',
                        paid_at: new Date().toISOString(),
                        assinatura_admin: adminSig?.value || booking.assinatura_admin,
                        booking_token: booking.booking_token
                    }, { showApprovalStamp: true });
                    pdfBuffer = await generatePDF(html);
                }

                await sendPaymentConfirmation(booking, pdfBuffer);
            } catch (mailErr) {
                console.error(`[Mail Customer] Falha ao enviar e-mail de pagamento (#${req.params.id}):`, mailErr);
            }
        })();

        res.json({ success: true, status: 'paid' });

    } catch (err) {
        console.error('[Booking Admin] Erro:', err);
        res.status(500).json({ error: 'Erro interno' });
    }
});

export default router;
