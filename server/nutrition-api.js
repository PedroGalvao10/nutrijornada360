// server/nutrition-api.js
// ═══════════════════════════════════════════════════════════════
//  MÓDULO DE NUTRIÇÃO — Proxy seguro para USDA, TACO e NotebookLM
//  Refatorado: 2026-05-03 | Segurança, Performance, Resiliência
// ═══════════════════════════════════════════════════════════════
import express from 'express';
import NodeCache from 'node-cache';
import { execFile } from 'child_process';
import db from './db.js';

const router = express.Router();

// ── CACHES SEPARADOS ──────────────────────────────────────────
// Cache de busca: TTL 1 hora, verificação a cada 10 min
const searchCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });
// Cache de traduções: TTL 24 horas (traduções raramente mudam)
const translationCache = new NodeCache({ stdTTL: 86400, checkperiod: 3600 });

// ── CONFIGURAÇÕES DO NOTEBOOKLM ──────────────────────────────
const ARTICLES_NOTEBOOK_ID = '0c074a6d-3943-410e-8535-2c9500c8d03a';
const TACO_NOTEBOOK_ID = '58532935-cd30-467c-9b7e-cf1920496423';

// ── VARIÁVEIS DE AMBIENTE ─────────────────────────────────────
const USDA_KEY = process.env.USDA_API_KEY || 'DEMO_KEY';
const SPOONACULAR_KEY = process.env.SPOONACULAR_API_KEY || '';
const FREE_TIER_LIMIT = 50;

// ═══════════════════════════════════════════════════════════════
//  UTILIDADES REUTILIZÁVEIS
// ═══════════════════════════════════════════════════════════════

// STEP: Retry com Exponential Backoff para chamadas externas
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
    let lastError;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await fetch(url, {
                ...options,
                signal: AbortSignal.timeout(10000) // 10s timeout
            });
            if (response.status === 429 || response.status === 503) {
                // Rate limited ou serviço indisponível — esperar e tentar de novo
                const delay = Math.pow(2, attempt) * 1000;
                console.warn(`[Retry] Tentativa ${attempt + 1}/${maxRetries} para ${url} — aguardando ${delay}ms`);
                await new Promise(r => setTimeout(r, delay));
                continue;
            }
            return response;
        } catch (err) {
            lastError = err;
            if (attempt < maxRetries - 1) {
                const delay = Math.pow(2, attempt) * 500;
                await new Promise(r => setTimeout(r, delay));
            }
        }
    }
    throw lastError || new Error(`Falha após ${maxRetries} tentativas: ${url}`);
}

// STEP: Whitelist de IP centralizada (elimina duplicação M3)
function isWhitelistedIP(ip) {
    const cleanIP = ip.includes('::ffff:') ? ip.split('::ffff:')[1] : ip;
    
    const exactWhitelist = ['127.0.0.1', '::1', 'localhost', '0.0.0.0', '::ffff:127.0.0.1'];
    const localRanges = [
        '192.168.', '10.',
        '172.16.', '172.17.', '172.18.', '172.19.', '172.20.',
        '172.21.', '172.22.', '172.23.', '172.24.', '172.25.',
        '172.26.', '172.27.', '172.28.', '172.29.', '172.30.', '172.31.'
    ];
    
    // IPs adicionados via variável de ambiente
    if (process.env.ADMIN_IP) exactWhitelist.push(process.env.ADMIN_IP);
    if (process.env.WHITELISTED_IP) exactWhitelist.push(process.env.WHITELISTED_IP);

    return exactWhitelist.some(wip => cleanIP === wip || cleanIP.includes(wip)) ||
           localRanges.some(range => cleanIP.startsWith(range));
}

// STEP: Extrair IP limpo da requisição
function getCleanIP(req) {
    let userIp = req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress;
    if (typeof userIp === 'string' && userIp.includes('::ffff:')) {
        userIp = userIp.split('::ffff:')[1];
    }
    return userIp;
}

// STEP: Consultar NotebookLM via Proxy Determinístico (C1, C2 Fix)
async function queryNotebook(notebookId, query) {
    return new Promise((resolve) => {
        // Path absoluto para o proxy determinístico que resolve problemas de encoding no Windows
        const proxyPath = 'c:\\Users\\soare\\.gemini\\antigravity\\scratch\\execution\\nlm_proxy.py';
        
        const execOptions = { 
            timeout: 90000,
            env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
        };
        
        // Usamos python para rodar o proxy que gerencia a CLI nlm
        execFile('python', [proxyPath, notebookId, query], execOptions, (error, stdout, stderr) => {
            if (error) {
                console.error(`[NotebookLM] Erro (code ${error.code}): ${error.message}`);
                console.error(`[NotebookLM] Stderr: ${stderr}`);
                return resolve(null);
            }
            const cleanOutput = stdout.trim();
            resolve(cleanOutput || null);
        });
    });
}

// ═══════════════════════════════════════════════════════════════
//  TRADUÇÃO PT↔EN (com cache dedicado)
// ═══════════════════════════════════════════════════════════════
async function translateText(text, langPair) {
    const cacheKey = `${langPair}_${text.toLowerCase().trim()}`;
    const cached = translationCache.get(cacheKey);
    if (cached) return cached;

    try {
        const res = await fetchWithRetry(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`
        );
        const data = await res.json();
        const translated = data.responseData?.translatedText || text;
        translationCache.set(cacheKey, translated);
        return translated;
    } catch (e) {
        console.warn(`[Tradução] Falha para "${text}" (${langPair}): ${e.message}`);
        return text;
    }
}

const translateToEnglish = (text) => translateText(text, 'pt|en');
const translateToPortuguese = (text) => translateText(text, 'en|pt');

// ═══════════════════════════════════════════════════════════════
//  BANCO DE DADOS LOCAL (100g de referência — resposta instantânea)
// ═══════════════════════════════════════════════════════════════
const localFoodDB = {
    'pão': { name: 'Pão Francês', brand: 'Genérico', calories: 289, protein: 9, carbs: 58, fat: 3 },
    'pao': { name: 'Pão Francês', brand: 'Genérico', calories: 289, protein: 9, carbs: 58, fat: 3 },
    'arroz': { name: 'Arroz Branco Cozido', brand: 'Genérico', calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
    'feijao': { name: 'Feijão Carioca Cozido', brand: 'Genérico', calories: 76, protein: 4.8, carbs: 13.6, fat: 0.5 },
    'feijão': { name: 'Feijão Carioca Cozido', brand: 'Genérico', calories: 76, protein: 4.8, carbs: 13.6, fat: 0.5 },
    'ovo': { name: 'Ovo Frito', brand: 'Genérico', calories: 196, protein: 13.6, carbs: 0.9, fat: 14.8 },
    'frango': { name: 'Peito de Frango Grelhado', brand: 'Genérico', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
    'carne': { name: 'Bife de Carne Bovina', brand: 'Genérico', calories: 250, protein: 26, carbs: 0, fat: 15 },
    'leite': { name: 'Leite Integral', brand: 'Genérico', calories: 60, protein: 3.2, carbs: 4.8, fat: 3.2 },
    'banana': { name: 'Banana Prata', brand: 'Genérico', calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
    'maçã': { name: 'Maçã', brand: 'Genérico', calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
    'maca': { name: 'Maçã', brand: 'Genérico', calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
    'aveia': { name: 'Aveia em Flocos', brand: 'Genérico', calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9 },
    'azeite': { name: 'Azeite de Oliva Extra Virgem', brand: 'Genérico', calories: 884, protein: 0, carbs: 0, fat: 100 },
    'tomate': { name: 'Tomate', brand: 'Genérico', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
    'alface': { name: 'Alface', brand: 'Genérico', calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2 },
    'batata': { name: 'Batata Inglesa Cozida', brand: 'Genérico', calories: 86, protein: 1.7, carbs: 20, fat: 0.1 },
    'queijo': { name: 'Queijo Mussarela', brand: 'Genérico', calories: 300, protein: 22, carbs: 2.2, fat: 22 },
    'ovo cozido': { name: 'Ovo Cozido', brand: 'Genérico', calories: 155, protein: 13, carbs: 1.1, fat: 11 },
    'ovo mexido': { name: 'Ovos Mexidos', brand: 'Genérico', calories: 148, protein: 10, carbs: 1.6, fat: 11 },
    'pão integral': { name: 'Pão Integral', brand: 'Genérico', calories: 247, protein: 13, carbs: 41, fat: 3.4 },
    'pao integral': { name: 'Pão Integral', brand: 'Genérico', calories: 247, protein: 13, carbs: 41, fat: 3.4 },
    'iogurte': { name: 'Iogurte Natural', brand: 'Genérico', calories: 63, protein: 3.5, carbs: 5, fat: 3.3 },
    'café': { name: 'Café (sem açúcar)', brand: 'Genérico', calories: 1, protein: 0.1, carbs: 0, fat: 0 },
    'cafe': { name: 'Café (sem açúcar)', brand: 'Genérico', calories: 1, protein: 0.1, carbs: 0, fat: 0 },
    'suco de laranja': { name: 'Suco de Laranja Natural', brand: 'Genérico', calories: 45, protein: 0.7, carbs: 10.4, fat: 0.2 },
    'melancia': { name: 'Melancia', brand: 'Genérico', calories: 30, protein: 0.6, carbs: 7.6, fat: 0.2 },
    'morango': { name: 'Morango', brand: 'Genérico', calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3 },
    'abacate': { name: 'Abacate', brand: 'Genérico', calories: 160, protein: 2, carbs: 8.5, fat: 14.7 }
};

// ═══════════════════════════════════════════════════════════════
//  RATE LIMITING MIDDLEWARE (Paywall Simulado)
// ═══════════════════════════════════════════════════════════════
const ipLimits = new Map();

const rateLimitMiddleware = (req, res, next) => {
    const userIp = getCleanIP(req);
    
    if (isWhitelistedIP(userIp)) {
        console.log(`[RateLimit] Acesso liberado para IP Whitelisted: ${userIp}`);
        res.setHeader('X-RateLimit-Limit', 'Unlimited');
        return next();
    }

    const currentUsage = ipLimits.get(userIp) || 0;
    console.log(`[RateLimit] IP: ${userIp} | Uso: ${currentUsage}/${FREE_TIER_LIMIT}`);

    if (currentUsage >= FREE_TIER_LIMIT) {
        return res.status(429).json({
            error: 'LIMIT_REACHED',
            message: 'Você atingiu o limite do plano gratuito de buscas por hoje.',
            upsell: {
                title: 'Desbloqueie o Acesso Premium',
                description: 'Assine um de nossos pacotes e tenha acesso ampliado a todas as ferramentas premium de nutrição.',
                cta: 'Ver Pacotes',
                link: '/planos'
            }
        });
    }

    ipLimits.set(userIp, currentUsage + 1);
    res.setHeader('X-RateLimit-Limit', String(FREE_TIER_LIMIT));
    res.setHeader('X-RateLimit-Remaining', String(Math.max(0, FREE_TIER_LIMIT - (currentUsage + 1))));
    next();
};

// ═══════════════════════════════════════════════════════════════
//  ROTAS
// ═══════════════════════════════════════════════════════════════

// ROTA: Health Check (E3) — Status do ecossistema
router.get('/health', async (_req, res) => {
    const checks = {
        server: 'ok',
        searchCache: { keys: searchCache.keys().length, hits: searchCache.getStats().hits, misses: searchCache.getStats().misses },
        translationCache: { keys: translationCache.keys().length },
        activeIPs: ipLimits.size,
        apis: {}
    };

    // Testar USDA (não-bloqueante)
    try {
        const usdaRes = await fetchWithRetry(`https://api.nal.usda.gov/fdc/v1/foods/search?query=test&pageSize=1&api_key=${USDA_KEY}`, {}, 1);
        checks.apis.usda = usdaRes.ok ? 'online' : `error_${usdaRes.status}`;
    } catch {
        checks.apis.usda = 'offline';
    }

    // Testar MyMemory
    try {
        const mmRes = await fetchWithRetry('https://api.mymemory.translated.net/get?q=test&langpair=en|pt', {}, 1);
        checks.apis.myMemory = mmRes.ok ? 'online' : `error_${mmRes.status}`;
    } catch {
        checks.apis.myMemory = 'offline';
    }

    checks.apis.spoonacular = SPOONACULAR_KEY ? 'configured' : 'not_configured';

    res.json(checks);
});

// ROTA: Consulta de quota
router.get('/quota', (req, res) => {
    const userIp = getCleanIP(req);
    const currentUsage = ipLimits.get(userIp) || 0;
    const whitelisted = isWhitelistedIP(userIp);

    res.json({
        usage: currentUsage,
        limit: FREE_TIER_LIMIT,
        remaining: whitelisted ? 9999 : Math.max(0, FREE_TIER_LIMIT - currentUsage),
        isUnlimited: whitelisted
    });
});

// ROTA: Chat com IA de Artigos (via NotebookLM)
router.post('/chat-articles', async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Mensagem é obrigatória' });

    try {
        const answer = await queryNotebook(ARTICLES_NOTEBOOK_ID, message);
        if (answer) {
            res.json({ answer });
        } else {
            res.json({ answer: 'Desculpe, não consegui processar sua pergunta no momento. A base de artigos pode estar temporariamente indisponível.' });
        }
    } catch (error) {
        console.error('[Chat] Erro:', error);
        res.status(500).json({ error: 'Falha ao consultar IA de Artigos' });
    }
});

// ROTA: Busca de Alimentos (Fallback Chain: Local → TACO → USDA)
router.get('/search', rateLimitMiddleware, async (req, res) => {
    const { query } = req.query;
    
    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    const normalizedQuery = query.toLowerCase().trim();
    const cacheKey = `search_${normalizedQuery}`;
    const cachedData = searchCache.get(cacheKey);

    if (cachedData) {
        console.log(`[Cache Hit] /search?query=${query}`);
        return res.json(cachedData);
    }

    console.log(`[Cache Miss] /search?query=${query}`);

    try {
        // TENTATIVA 1: Banco de Dados Local (instantâneo, 100% em Português)
        const localMatch = Object.keys(localFoodDB).find(key => 
            normalizedQuery.includes(key) || key.includes(normalizedQuery)
        );

        if (localMatch) {
            console.log(`[Busca Local] Match: ${localMatch}`);
            const food = localFoodDB[localMatch];
            const formattedResult = {
                source: 'Mariana_LocalDB',
                results: [{
                    id: `local_${localMatch}`,
                    name: food.name,
                    brand: food.brand,
                    calories: food.calories,
                    protein: food.protein,
                    carbs: food.carbs,
                    fat: food.fat,
                    servingSize: 100,
                    servingUnit: 'g'
                }]
            };
            searchCache.set(cacheKey, formattedResult);
            return res.json(formattedResult);
        }

        // TENTATIVA 2: NotebookLM TACO (dados brasileiros)
        console.log(`[Busca] Tentando NotebookLM TACO para: ${query}`);
        const tacoAnswer = await queryNotebook(
            TACO_NOTEBOOK_ID,
            `Aja como uma base de dados nutricional técnica brasileira (TACO). Retorne EXATAMENTE os dados para 100g de ${query}. Responda APENAS com um objeto JSON puro seguindo este formato: {"name": "Nome em Português", "calories": número, "protein": número, "carbs": número, "fat": número, "fiber": número}. Não inclua explicações.`
        );
        
        if (tacoAnswer && tacoAnswer.includes('{')) {
            try {
                const jsonStr = tacoAnswer.match(/\{[\s\S]*\}/)[0];
                const tacoData = JSON.parse(jsonStr);
                if (tacoData.calories) {
                    console.log(`[Busca] TACO match: ${tacoData.name}`);
                    const tacoResult = {
                        source: 'TACO (NotebookLM)',
                        results: [{
                            id: `taco_${Date.now()}`,
                            name: tacoData.name,
                            brand: 'TACO/BR',
                            calories: tacoData.calories,
                            protein: tacoData.protein,
                            carbs: tacoData.carbs,
                            fat: tacoData.fat,
                            servingSize: 100,
                            servingUnit: 'g'
                        }]
                    };
                    searchCache.set(cacheKey, tacoResult);
                    return res.json(tacoResult);
                }
            } catch (e) {
                console.warn(`[Busca] Falha ao parsear TACO JSON, continuando busca externa...`);
            }
        }

        // TENTATIVA 3: USDA (com tradução + retry)
        console.log(`[Busca] Traduzindo "${query}" para busca USDA...`);
        const queryEn = await translateToEnglish(query);
        console.log(`[Busca] Tradução: "${queryEn}". Buscando na USDA...`);
        
        const usdaUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(queryEn + '*')}&requireAllWords=false&pageSize=10&api_key=${USDA_KEY}`;
        
        const usdaResponse = await fetchWithRetry(usdaUrl);
        
        if (usdaResponse.ok) {
            const data = await usdaResponse.json();
            
            if (data.foods && data.foods.length > 0) {
                // STEP: Batch translation — traduz todos os nomes em paralelo (C4 fix)
                const translationPromises = data.foods.map(food => 
                    translateToPortuguese(food.description)
                );
                const translatedNames = await Promise.allSettled(translationPromises);

                const formattedResults = data.foods.map((food, idx) => {
                    const getNutrient = (id) => {
                        const nut = food.foodNutrients.find(n => n.nutrientId === id);
                        return nut ? nut.value : 0;
                    };
                    
                    const namePt = translatedNames[idx].status === 'fulfilled' 
                        ? translatedNames[idx].value 
                        : food.description;
                    
                    return {
                        id: `usda_${food.fdcId}`,
                        name: `(Aproximado) ${namePt}`,
                        brand: food.brandOwner || 'Genérico',
                        calories: getNutrient(1008),
                        protein: getNutrient(1003),
                        carbs: getNutrient(1005),
                        fat: getNutrient(1004),
                        servingSize: food.servingSize || 100,
                        servingUnit: food.servingSizeUnit || 'g'
                    };
                });

                const formattedResult = {
                    source: 'USDA',
                    results: formattedResults
                };
                
                searchCache.set(cacheKey, formattedResult);
                return res.json(formattedResult);
            }
        }
        
        throw new Error('Todas as fontes de dados falharam ou não encontraram o alimento.');

    } catch (error) {
        console.error('[API] Erro ao buscar dados nutricionais:', error);
        res.status(500).json({ 
            error: 'Falha ao buscar dados nutricionais. Tente um alimento diferente ou busque de forma aproximada.',
            details: error.message
        });
    }
});


// ROTA: Receitas Inteligentes (Fallback: Spoonacular → TheMealDB)
router.get('/recipes', rateLimitMiddleware, async (req, res) => {
    const { ingredients } = req.query;
    
    if (!ingredients) {
        return res.status(400).json({ error: 'Ingredients parameter is required' });
    }

    const cacheKey = `recipes_${ingredients.toLowerCase().replace(/\s+/g, '')}`;
    const cachedData = searchCache.get(cacheKey);

    if (cachedData) {
        return res.json(cachedData);
    }

    try {
        console.log(`[Receitas] Traduzindo "${ingredients}"...`);
        const ingredientsEn = await translateToEnglish(ingredients);

        // TENTATIVA 1: Spoonacular (se configurado)
        if (SPOONACULAR_KEY) {
            console.log(`[Receitas] Tentando Spoonacular...`);
            const spUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredientsEn)}&number=3&apiKey=${SPOONACULAR_KEY}`;
            
            try {
                const spResponse = await fetchWithRetry(spUrl);
                
                if (spResponse.ok) {
                    const data = await spResponse.json();
                    if (data && data.length > 0) {
                        // Batch translate titles
                        const titlePromises = data.map(r => translateToPortuguese(r.title));
                        const translatedTitles = await Promise.allSettled(titlePromises);

                        const formattedRecipes = data.map((r, idx) => ({
                            id: r.id,
                            title: translatedTitles[idx].status === 'fulfilled' ? translatedTitles[idx].value : r.title,
                            image: r.image,
                            usedIngredients: r.usedIngredientCount,
                            missedIngredients: r.missedIngredientCount
                        }));

                        const formatted = { source: 'Spoonacular', recipes: formattedRecipes };
                        searchCache.set(cacheKey, formatted);
                        return res.json(formatted);
                    }
                } else {
                    console.warn(`[Receitas] Spoonacular status: ${spResponse.status}. Fallback...`);
                }
            } catch (spErr) {
                console.warn(`[Receitas] Spoonacular falhou: ${spErr.message}. Fallback...`);
            }
        }

        // TENTATIVA 2: TheMealDB (gratuito)
        console.log(`[Receitas] Fallback para TheMealDB...`);
        const mainIngredientEn = ingredientsEn.split(',')[0].trim();
        const mdbUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(mainIngredientEn)}`;
        const mdbResponse = await fetchWithRetry(mdbUrl);
        
        if (!mdbResponse.ok) throw new Error('Falha no TheMealDB');
        
        const mdbData = await mdbResponse.json();
        
        if (!mdbData.meals) {
            return res.json({ source: 'TheMealDB', recipes: [] });
        }

        // Batch translate meal titles
        const meals = mdbData.meals.slice(0, 3);
        const mealTitlePromises = meals.map(m => translateToPortuguese(m.strMeal));
        const translatedMealTitles = await Promise.allSettled(mealTitlePromises);

        const formattedRecipes = meals.map((m, idx) => ({
            id: m.idMeal,
            title: translatedMealTitles[idx].status === 'fulfilled' ? translatedMealTitles[idx].value : m.strMeal,
            image: m.strMealThumb,
            usedIngredients: 'N/A',
            missedIngredients: 'N/A'
        }));

        const formatted = { source: 'TheMealDB', recipes: formattedRecipes };
        searchCache.set(cacheKey, formatted);
        return res.json(formatted);

    } catch (error) {
        console.error('[Receitas] Erro:', error);
        res.status(500).json({ error: 'Não foi possível encontrar receitas no momento.' });
    }
});

// ROTA: Reset de limites (M2 fix — apenas em desenvolvimento)
if (process.env.NODE_ENV !== 'production') {
    router.post('/_reset_limits', (_req, res) => {
        ipLimits.clear();
        searchCache.flushAll();
        translationCache.flushAll();
        res.json({ message: 'Limites e caches resetados com sucesso (DEV only)' });
    });
}

// ── PERSISTÊNCIA DO DIÁRIO (PLATES) ───────────────────────────

// ROTA: Salvar Prato no Diário
router.post('/plates', async (req, res) => {
    const { title, items, totals } = req.body;
    const userIp = getCleanIP(req);

    if (!items || items.length === 0) {
        return res.status(400).json({ error: 'O prato deve conter itens.' });
    }

    db.run(
        `INSERT INTO plates (user_ip, title, total_calories, total_protein, total_carbs, total_fat) VALUES (?, ?, ?, ?, ?, ?)`,
        [userIp, title || 'Meu Prato', totals.calories, totals.protein, totals.carbs, totals.fat],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            
            const plateId = this.lastID;
            const stmt = db.prepare(`INSERT INTO plate_items (plate_id, food_name, quantity, unit, calories, protein, carbs, fat) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
            
            items.forEach(item => {
                stmt.run(plateId, item.name, item.quantity, item.unit, item.calories, item.protein, item.carbs, item.fat);
            });
            
            stmt.finalize();
            res.json({ id: plateId, message: 'Prato salvo com sucesso!' });
        }
    );
});

// ROTA: Listar Pratos do Usuário (baseado no IP para simplicidade sem login)
router.get('/plates', (req, res) => {
    const userIp = getCleanIP(req);
    db.all(`SELECT * FROM plates WHERE user_ip = ? ORDER BY created_at DESC LIMIT 10`, [userIp], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

export default router;
