const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');

const dbPath = path.join(__dirname, 'server', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.get("SELECT * FROM bookings ORDER BY id DESC LIMIT 1", async (err, row) => {
    if (err) {
        console.error("Erro no DB:", err);
        process.exit(1);
    }
    if (!row) {
        console.log("Nenhum contrato encontrado no banco de dados.");
        process.exit(0);
    }

    console.log(`Gerando PDF para: ${row.nome} (ID: ${row.id})`);
    
    try {
        const browser = await puppeteer.launch({ 
            headless: true,
            args: ['--no-sandbox']
        });
        const page = await browser.newPage();
        
        // Injetar estilos básicos se necessário ou usar o HTML bruto
        await page.setContent(row.contrato_html, { waitUntil: 'networkidle0' });
        
        const pdfBuffer = await page.pdf({ 
            format: 'A4', 
            printBackground: true,
            margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' }
        });
        
        await browser.close();

        const outputPath = path.join(__dirname, 'ultimo_contrato_teste.pdf');
        fs.writeFileSync(outputPath, pdfBuffer);
        console.log(`\nSUCCESS: PDF gerado em ${outputPath}`);
        console.log(`Dados do Cliente: ${row.full_name} | Email: ${row.email}`);
    } catch (e) {
        console.error("Erro no Puppeteer:", e);
        process.exit(1);
    } finally {
        db.close();
    }
});
