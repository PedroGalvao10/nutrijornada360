// server/nutrition-api.js
import express from 'express';
import NodeCache from 'node-cache';
import fetch from 'node-fetch';

const router = express.Router();
// Cache: TTL de 1 hora, verificação de expiração a cada 10 min
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

// Variáveis de ambiente das APIs
const USDA_KEY = process.env.USDA_API_KEY || 'DEMO_KEY';
const SPOONACULAR_KEY = process.env.SPOONACULAR_API_KEY || '';

// ==========================================
// SISTEMA DE CONTROLE DE LIMITES (RATE LIMITING) E PAYWALL
// ==========================================

// Armazena quantas requisições cada IP já fez (simulação simples em memória)
// Idealmente seria Redis num ambiente escalado.
const ipLimits = new Map();
const FREE_TIER_LIMIT = 15; // Aumentado para 15 buscas no tier gratuito para melhor UX de teste

// Middleware de Limitação de Uso (Paywall Simulado)
const rateLimitMiddleware = (req, res, next) => {
    const userIp = req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress;
    const currentUsage = ipLimits.get(userIp) || 0;

    // Se o usuário já atingiu o limite
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

    // Incrementa uso e passa pro próximo
    ipLimits.set(userIp, currentUsage + 1);
    
    // Adiciona headers úteis para o frontend exibir a barra de progresso
    res.setHeader('X-RateLimit-Limit', FREE_TIER_LIMIT);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, FREE_TIER_LIMIT - (currentUsage + 1)));
    
    next();
};

// ==========================================
// ROTA 1: BUSCA DE ALIMENTOS (FALLBACK CHAIN: USDA -> OpenFoodFacts)
// ==========================================
router.get('/search', rateLimitMiddleware, async (req, res) => {
    const { query } = req.query;
    
    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    const cacheKey = `search_${query.toLowerCase()}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        console.log(`[Cache Hit] /search?query=${query}`);
        return res.json(cachedData);
    }

    console.log(`[Cache Miss] /search?query=${query}`);

    try {
        // TENTATIVA 1: USDA (Precisa e rica, mas tem limite diário na chave)
        console.log(`Tentando USDA API para "${query}"...`);
        const usdaUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query + '*')}&requireAllWords=false&pageSize=10&api_key=${USDA_KEY}`;
        
        const usdaResponse = await fetch(usdaUrl);
        
        if (usdaResponse.ok) {
            const data = await usdaResponse.json();
            
            // Formatando dados para o nosso frontend
            if (data.foods && data.foods.length > 0) {
                const formattedResult = {
                    source: 'USDA',
                    results: data.foods.map(food => {
                        // Extrair macros
                        const getNutrient = (id) => {
                           const nut = food.foodNutrients.find(n => n.nutrientId === id);
                           return nut ? nut.value : 0;
                        };
                        
                        // IDs USDA: Proteina: 1003, Gordura: 1004, Carbo: 1005, Calorias: 1008
                        return {
                            id: `usda_${food.fdcId}`,
                            name: food.description,
                            brand: food.brandOwner || 'Genérico',
                            calories: getNutrient(1008),
                            protein: getNutrient(1003),
                            carbs: getNutrient(1005),
                            fat: getNutrient(1004),
                            servingSize: food.servingSize || null,
                            servingUnit: food.servingSizeUnit || 'g'
                        }
                    })
                };
                
                cache.set(cacheKey, formattedResult);
                return res.json(formattedResult);
            }
        }
        
        console.warn(`USDA falhou ou vazia. Status: ${usdaResponse.status}. Fazendo Fallback para OpenFoodFacts...`);
        
        // TENTATIVA 2: Open Food Facts (Gratuita, sem chave, ótima para industrializados no BR)
        const offUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=5`;
        const offResponse = await fetch(offUrl, {
            headers: { 'User-Agent': 'MarianaSite/1.0 - OpenFoodFacts' }
        });
        
        if (!offResponse.ok) throw new Error('Ambas APIs falharam');
        
        const offData = await offResponse.json();
        
        const formattedResult = {
            source: 'OpenFoodFacts',
            results: offData.products.slice(0, 5).map(product => ({
                id: `off_${product.id}`,
                name: product.product_name_pt || product.product_name || 'Produto Desconhecido',
                brand: product.brands || 'Desconhecida',
                calories: product.nutriments?.['energy-kcal_100g'] || 0,
                protein: product.nutriments?.proteins_100g || 0,
                carbs: product.nutriments?.carbohydrates_100g || 0,
                fat: product.nutriments?.fat_100g || 0,
                servingSize: product.serving_quantity || null,
                servingUnit: product.serving_quantity_unit || 'g',
                image: product.image_front_small_url,
                nutriscore: product.nutriscore_grade?.toUpperCase() || null
            }))
        };
        
        cache.set(cacheKey, formattedResult);
        return res.json(formattedResult);

    } catch (error) {
        console.error('[API] Erro ao buscar dados nutricionais:', error);
        res.status(500).json({ 
            error: 'Falha ao buscar dados nutricionais.',
            details: error.message
        });
    }
});


// ==========================================
// ROTA 2: RECEITAS INTELIGENTES ("O que tem na geladeira")
// Fallback Chain: Spoonacular -> TheMealDB
// ==========================================
router.get('/recipes', rateLimitMiddleware, async (req, res) => {
    const { ingredients } = req.query; // Ex: "frango,tomate"
    
    if (!ingredients) {
         return res.status(400).json({ error: 'Ingredients parameter is required' });
    }

    const cacheKey = `recipes_${ingredients.toLowerCase().replace(/\s+/g, '')}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        return res.json(cachedData);
    }

    try {
        // TENTATIVA 1: Spoonacular (Premium, limite apertado)
        if (SPOONACULAR_KEY) {
            console.log(`Tentando Spoonacular para receitas com "${ingredients}"...`);
            const spUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredients)}&number=3&apiKey=${SPOONACULAR_KEY}`;
            const spResponse = await fetch(spUrl);
            
            // Só usa se não der rate limit (402 Payment Required na Spoonacular)
            if (spResponse.ok) {
                 const data = await spResponse.json();
                 if(data && data.length > 0) {
                     const formatted = {
                         source: 'Spoonacular',
                         recipes: data.map(r => ({
                             id: r.id,
                             title: r.title,
                             image: r.image,
                             usedIngredients: r.usedIngredientCount,
                             missedIngredients: r.missedIngredientCount
                         }))
                     };
                     cache.set(cacheKey, formatted);
                     return res.json(formatted);
                 }
            } else {
                 console.warn(`Spoonacular status: ${spResponse.status}. Entrando em Fallback...`);
            }
        }

        // TENTATIVA 2: TheMealDB (Totalmente Grátis, busca por 1 ingrediente principal)
        console.log(`Fallback para TheMealDB...`);
        // TheMealDB na API grátis só aceita filtrar por 1 ingrediente por vez. Pegamos o primeiro.
        const mainIngredient = ingredients.split(',')[0].trim();
        const mdbUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(mainIngredient)}`;
        const mdbResponse = await fetch(mdbUrl);
        
        if (!mdbResponse.ok) throw new Error('Falha no TheMealDB');
        
        const mdbData = await mdbResponse.json();
        
        if (!mdbData.meals) {
            return res.json({ source: 'TheMealDB', recipes: [] });
        }

        const formatted = {
            source: 'TheMealDB',
            recipes: mdbData.meals.slice(0, 3).map(m => ({
                id: m.idMeal,
                title: m.strMeal,
                image: m.strMealThumb,
                usedIngredients: 'N/A', // MealDB lista não traz os faltantes nessa rota
                missedIngredients: 'N/A'
            }))
        };

        cache.set(cacheKey, formatted);
        return res.json(formatted);

    } catch (error) {
         console.error('Erro na rota /recipes:', error);
         res.status(500).json({ error: 'Não foi possível encontrar receitas no momento.' });
    }
});


// Rota auxiliar para resetar limites (Apenas desenvolvimento, remover em prod)
router.post('/_reset_limits', (req, res) => {
    ipLimits.clear();
    res.json({ message: 'IP limits reset successfully' });
});

export default router;
