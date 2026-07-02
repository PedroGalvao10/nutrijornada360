import dotenv from 'dotenv';
dotenv.config();

import sqlite3 from 'sqlite3';
import path from 'path';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { sendNewBookingNotification } from './server/mail-service.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'server', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

async function generatePDF(html) {
    const browser = await puppeteer.launch({ 
        headless: true, 
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
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

db.get("SELECT * FROM bookings ORDER BY id DESC LIMIT 1", async (err, row) => {
    if (err || !row) {
        console.error("Nenhum booking encontrado para teste.");
        process.exit(1);
    }

    try {
        console.log(`🚀 Iniciando teste de e-mail para: ${row.nome}`);
        // Nota: O banco usa 'contrato_html', e o script de mail espera os campos mapeados
        const pdfBuffer = await generatePDF(row.contrato_html);
        
        await sendNewBookingNotification({
            nome: row.nome,
            email: row.email,
            whatsapp: row.whatsapp,
            plan_title: row.plan_title,
            objetivo: row.objetivo,
            descricao_objetivo: row.descricao_objetivo,
            condicoes_saude: row.condicoes_saude,
            medicamentos: row.medicamentos
        }, pdfBuffer);
        
        console.log("✅ SUCESSO: Notificação enviada para Mariana!");
    } catch (e) {
        console.error("❌ FALHA NO TESTE DE E-MAIL:", e);
    } finally {
        db.close();
        process.exit(0);
    }
});
