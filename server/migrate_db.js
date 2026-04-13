import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Iniciando migração do banco de dados...');

db.serialize(() => {
    // Lista de colunas para adicionar à tabela articles
    const columnsToAdd = [
        { name: 'hat', type: 'TEXT' },
        { name: 'image_alt', type: 'TEXT' },
        { name: 'reading_time', type: 'INTEGER' },
        { name: 'published_at', type: 'DATETIME' }
    ];

    db.all("PRAGMA table_info(articles)", (err, rows) => {
        if (err) {
            console.error('Erro ao verificar esquema:', err.message);
            process.exit(1);
        }

        const existingColumns = rows.map(r => r.name);
        
        columnsToAdd.forEach(column => {
            if (!existingColumns.includes(column.name)) {
                console.log(`Adicionando coluna: ${column.name}...`);
                db.run(`ALTER TABLE articles ADD COLUMN ${column.name} ${column.type}`, (err) => {
                    if (err) console.error(`Erro ao adicionar ${column.name}:`, err.message);
                    else console.log(`Coluna ${column.name} adicionada com sucesso.`);
                });
            } else {
                console.log(`Coluna ${column.name} já existe.`);
            }
        });

        // Atualiza a coluna is_published para ter default 1 se não estiver setado
        db.run(`UPDATE articles SET is_published = 1 WHERE is_published IS NULL`);
        
        console.log('Migração concluída.');
    });
});
