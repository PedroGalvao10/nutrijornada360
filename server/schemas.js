// STEP: Validação de schema com zod para todas as rotas com body.
// Middleware validate(schema) responde 400 com detalhes legíveis
// e substitui req.body pelo objeto já validado/normalizado.
import { z } from 'zod';

export const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        const details = result.error.issues.map((i) => `${i.path.join('.') || 'body'}: ${i.message}`);
        return res.status(400).json({ error: 'Dados inválidos', details });
    }
    req.body = result.data;
    next();
};

// ── Auth ──
export const loginSchema = z.object({
    email: z.string().email().max(200),
    password: z.string().min(1).max(200),
});

// ── Booking ──
const digitsField = (min, max) => z.string().min(min).max(max).regex(/^[\d\s()+.-]+$/, 'apenas dígitos e separadores');

export const bookingSchema = z.object({
    nome: z.string().trim().min(2).max(120),
    email: z.string().email().max(200),
    whatsapp: digitsField(8, 25),
    cpf: digitsField(11, 18).optional().nullable(),
    dataNascimento: z.string().max(30).optional().nullable(),
    objetivo: z.string().trim().max(200).optional().nullable(),
    descricaoObjetivo: z.string().trim().max(3000).optional().nullable(),
    condicoesSaude: z.array(z.string().max(200)).max(30).optional().nullable(),
    medicamentos: z.string().trim().max(2000).optional().nullable(),
    rotinaAlimentar: z.string().trim().max(3000).optional().nullable(),
    praticaExercicio: z.string().trim().max(500).optional().nullable(),
    detalhesExercicio: z.string().trim().max(2000).optional().nullable(),
    planId: z.union([z.string().max(60), z.number()]),
    planTitle: z.string().trim().max(120),
    planPriceCents: z.number().int().positive().max(100_000_000),
    parcelas: z.number().int().min(1).max(24).optional().nullable(),
    valorParcelaCents: z.number().int().positive().max(100_000_000).optional().nullable(),
    assinaturaBase64: z.string().max(2_000_000),
});

export const rejectSchema = z.object({
    reason: z.string().trim().max(1000).optional().nullable(),
});

export const signatureSchema = z.object({
    signature: z.string().max(2_000_000),
});

// ── Leads (proxy Google Sheets) ──
export const leadSchema = z.object({
    email: z.string().email().max(200),
    nome: z.string().trim().max(120).optional().nullable(),
}).passthrough();

// ── AI chat ──
export const aiChatSchema = z.object({
    message: z.string().trim().min(1).max(2000),
    notebookId: z.string().uuid().optional(),
});

// ── Artigos (CMS admin) ──
export const articleSchema = z.object({
    title: z.string().trim().min(2).max(300),
    slug: z.string().trim().min(2).max(300).regex(/^[a-z0-9-]+$/, 'slug deve conter apenas letras minúsculas, números e hífens'),
    hat: z.string().trim().max(200).optional().nullable(),
    content: z.string().min(1),
    excerpt: z.string().max(1000).optional().nullable(),
    meta_description: z.string().max(300).optional().nullable(),
    cover_image_url: z.string().max(1000).optional().nullable(),
    image_alt: z.string().max(300).optional().nullable(),
    reading_time: z.union([z.string().max(30), z.number()]).optional().nullable(),
    published_at: z.string().max(40).optional().nullable(),
    is_published: z.union([z.boolean(), z.number()]).optional(),
});
