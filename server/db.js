import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';
import bcrypt from 'bcrypt';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storageDir = path.join(__dirname, 'storage');
const ebooksDir = path.join(storageDir, 'ebooks');
const coversDir = path.join(storageDir, 'covers');
if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir, { recursive: true });
if (!fs.existsSync(ebooksDir)) fs.mkdirSync(ebooksDir, { recursive: true });
if (!fs.existsSync(coversDir)) fs.mkdirSync(coversDir, { recursive: true });

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error(err.message);
    else console.log('Conectado ao SQLite.');
});

export const initDb = () => {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS login_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, ip TEXT, attempt_time DATETIME DEFAULT CURRENT_TIMESTAMP, success BOOLEAN)`);
        db.run(`CREATE TABLE IF NOT EXISTS articles (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            title TEXT NOT NULL, 
            slug TEXT UNIQUE NOT NULL, 
            content TEXT NOT NULL, 
            excerpt TEXT, 
            hat TEXT,
            meta_description TEXT, 
            meta_keywords TEXT, 
            cover_image_url TEXT, 
            image_alt TEXT,
            reading_time INTEGER,
            author TEXT DEFAULT 'Mariana', 
            published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
            is_published BOOLEAN DEFAULT 0
        )`);
        db.run(`CREATE TABLE IF NOT EXISTS ebooks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, description TEXT, pdf_file_path TEXT NOT NULL, cover_image_url TEXT, requires_registration BOOLEAN DEFAULT 1, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);
        
        db.run(`CREATE TABLE IF NOT EXISTS plates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_ip TEXT,
            title TEXT,
            total_calories REAL,
            total_protein REAL,
            total_carbs REAL,
            total_fat REAL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS plate_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            plate_id INTEGER,
            food_name TEXT,
            quantity REAL,
            unit TEXT,
            calories REAL,
            protein REAL,
            carbs REAL,
            fat REAL,
            FOREIGN KEY(plate_id) REFERENCES plates(id)
        )`);

        // BOOKING FLOW: Tabela de agendamentos/contratos
        db.run(`CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            booking_token TEXT UNIQUE NOT NULL,
            nome TEXT NOT NULL,
            email TEXT NOT NULL,
            whatsapp TEXT NOT NULL,
            cpf TEXT,
            data_nascimento TEXT,
            objetivo TEXT,
            descricao_objetivo TEXT,
            condicoes_saude TEXT,
            medicamentos TEXT,
            rotina_alimentar TEXT,
            pratica_exercicio TEXT,
            detalhes_exercicio TEXT,
            plan_id TEXT NOT NULL,
            plan_title TEXT NOT NULL,
            plan_price_cents INTEGER NOT NULL,
            parcelas INTEGER DEFAULT 1,
            valor_parcela_cents INTEGER,
            contrato_html TEXT,
            assinatura_usuario TEXT,
            assinatura_admin TEXT,
            assinado_em DATETIME,
            status TEXT DEFAULT 'pending_review',
            rejection_reason TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            reviewed_at DATETIME,
            approved_at DATETIME,
            paid_at DATETIME,
            payment_deadline DATETIME,
            ip_address TEXT,
            user_agent TEXT
        )`);

        // BOOKING FLOW: Configurações admin (assinatura da Mariana, etc.)
        db.run(`CREATE TABLE IF NOT EXISTS admin_settings (
            key TEXT PRIMARY KEY,
            value TEXT,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        console.log("-> Tabelas SQLite prontas.")
    });
};

export default db;
