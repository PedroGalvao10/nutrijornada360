const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

// Caminhos dos arquivos
const logoPath = path.join(__dirname, 'Mariana site.svg');
const outputPath = path.join(__dirname, 'Brandbook_Mariana_Bermudes.pdf');

// Carrega o logotipo SVG
let logoSvg = '';
try {
    logoSvg = fs.readFileSync(logoPath, 'utf8');
    // Ajustar o SVG para caber bem nos blocos de exibição se necessário
    logoSvg = logoSvg.replace(/width="1080"/, 'width="100%"');
    logoSvg = logoSvg.replace(/height="1350"/, 'height="auto"');
} catch (err) {
    console.warn("Logotipo Mariana site.svg não encontrado, usando fallback textual.", err);
    logoSvg = `<div class="text-primary font-headline text-4xl font-bold tracking-wider">MARIANA BERMUDES</div>`;
}

// Conteúdo HTML do Brandbook
const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Brandbook Mariana Bermudes - Nutrição de Precisão</title>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Raleway:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
    <!-- Tailwind Play CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#4a7c59',
                        secondary: '#6b6358',
                        tertiary: '#705c30',
                        background: '#faf6f0',
                        onSurface: '#2e3230',
                        surfaceVariant: '#e4e0d8',
                        outline: '#74796e',
                    },
                    fontFamily: {
                        headline: ['Lora', 'serif'],
                        body: ['Raleway', 'sans-serif'],
                    }
                }
            }
        }
    </script>
    <style>
        @page {
            size: A4;
            margin: 0;
        }
        body {
            margin: 0;
            padding: 0;
            background-color: #faf6f0;
            color: #2e3230;
            font-family: 'Raleway', sans-serif;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        .page {
            width: 210mm;
            height: 297mm;
            page-break-after: always;
            position: relative;
            box-sizing: border-box;
            overflow: hidden;
            background-color: #faf6f0;
            padding: 24mm 20mm;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .page-bg-dark {
            background-color: #2e3230;
            color: #faf6f0;
        }
        .page-bg-green {
            background-color: #4a7c59;
            color: #faf6f0;
        }
        .font-headline {
            font-family: 'Lora', serif;
        }
        .font-body {
            font-family: 'Raleway', sans-serif;
        }
        /* Grid decorativo de fundo */
        .decor-grid {
            position: absolute;
            inset: 0;
            background-image: radial-gradient(rgba(74, 124, 89, 0.08) 1px, transparent 1px);
            background-size: 20px 20px;
            pointer-events: none;
            z-index: 1;
        }
        .page-bg-dark .decor-grid {
            background-image: radial-gradient(rgba(250, 246, 240, 0.04) 1px, transparent 1px);
        }
        .content-container {
            position: relative;
            z-index: 10;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .glass-card {
            background: rgba(255, 255, 255, 0.45);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.4);
            border-radius: 16px;
        }
        .page-bg-dark .glass-card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .blob-element {
            border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
        }
        .blob-element-alt {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
        }
    </style>
</head>
<body>

    <!-- PÁGINA 1: CAPA -->
    <div class="page">
        <div class="decor-grid"></div>
        <div class="content-container">
            <!-- Header sutil -->
            <div class="flex justify-between items-center border-b border-primary/20 pb-4">
                <span class="text-primary font-body tracking-widest text-xs uppercase font-bold">Manual de Identidade Visual</span>
                <span class="text-secondary font-body tracking-wider text-xs">v1.0 • 2026</span>
            </div>

            <!-- Centro: Logo e Título -->
            <div class="my-auto flex flex-col items-center text-center">
                <!-- Logotipo Principal -->
                <div class="w-80 h-80 flex items-center justify-center mb-8 opacity-90">
                    ${logoSvg}
                </div>
                <div class="w-24 h-0.5 bg-primary/40 my-6"></div>
                <h1 class="text-4xl md:text-5xl font-headline text-primary font-bold tracking-wide mb-3">
                    MARIANA BERMUDES
                </h1>
                <p class="text-lg md:text-xl font-body text-secondary tracking-widest uppercase font-medium">
                    Nutrição de Precisão & Bem-Estar 360º
                </p>
            </div>

            <!-- Footer da Capa -->
            <div class="flex justify-between items-end text-xs text-secondary border-t border-primary/10 pt-4">
                <div>
                    <p class="font-bold text-primary font-body">DIRETRIZES DE MARCA</p>
                    <p>Site Mariana React Oficial</p>
                </div>
                <div class="text-right">
                    <p>Desenvolvido por</p>
                    <p class="font-bold text-primary">Antigravity AI</p>
                </div>
            </div>
        </div>
    </div>


    <!-- PÁGINA 2: A MARCA & CONCEITO -->
    <div class="page">
        <div class="decor-grid"></div>
        <div class="content-container">
            <!-- Header -->
            <div class="flex justify-between items-center border-b border-primary/20 pb-4">
                <span class="text-primary font-body tracking-widest text-xs uppercase font-bold">01. Introdução</span>
                <span class="text-secondary font-body text-xs">Mariana Bermudes</span>
            </div>

            <!-- Conteúdo -->
            <div class="my-auto grid grid-cols-12 gap-8 items-center">
                <div class="col-span-7 pr-6">
                    <span class="text-tertiary font-bold tracking-widest text-xs uppercase mb-2 block">A Filosofia</span>
                    <h2 class="text-3xl font-headline text-primary font-bold mb-6">A Essência da Nutrição Humana e Integrativa</h2>
                    <p class="text-sm font-body text-onSurface leading-relaxed mb-4 text-justify">
                        A marca <strong>Mariana Bermudes | Nutricionista</strong> baseia-se na premissa de que a nutrição de verdade vai muito além de um plano rígido de calorias. Ela envolve afeto, história, cultura, ciência de ponta e respeito à individualidade biológica e emocional.
                    </p>
                    <p class="text-sm font-body text-onSurface leading-relaxed mb-6 text-justify">
                        A identidade visual foi construída para transmitir <strong>acolhimento, rigor ético, sobriedade profissional e conexão orgânica</strong>. O conceito do atendimento 360º é ilustrado por formas fluidas, contrastes suaves e uma atmosfera de tranquilidade e cura.
                    </p>

                    <!-- Quote Box -->
                    <div class="border-l-4 border-primary pl-4 py-2 italic text-sm text-secondary bg-primary/5 rounded-r-lg font-body">
                        "Nutrir é um ato de afeto e respeito à vida. Minha missão é traduzir a ciência em caminhos simples e felizes de autocuidado e liberdade."
                    </div>
                </div>

                <div class="col-span-5 flex flex-col gap-4">
                    <!-- Cards de Valores -->
                    <div class="glass-card p-5 border-l-4 border-primary">
                        <h4 class="text-xs font-bold uppercase text-primary mb-1">Visão 360º</h4>
                        <p class="text-xs text-secondary leading-relaxed">
                            Avaliação sistêmica que envolve exames clínicos, comportamento alimentar, rotina e bem-estar psicológico.
                        </p>
                    </div>
                    <div class="glass-card p-5 border-l-4 border-secondary">
                        <h4 class="text-xs font-bold uppercase text-secondary mb-1">Rigor Científico</h4>
                        <p class="text-xs text-secondary leading-relaxed">
                            Graduação pelo Centro Universitário São Camilo e atuação baseada em evidências científicas sólidas e atualizadas.
                        </p>
                    </div>
                    <div class="glass-card p-5 border-l-4 border-tertiary">
                        <h4 class="text-xs font-bold uppercase text-tertiary mb-1">Acolhimento & Empatia</h4>
                        <p class="text-xs text-secondary leading-relaxed">
                            Um consultório virtual e presencial acolhedor, onde dores alimentares são tratadas com respeito e sem julgamentos.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="flex justify-between items-center text-xs text-secondary border-t border-primary/10 pt-4">
                <span>Brandbook Oficial</span>
                <span>Página 2</span>
            </div>
        </div>
    </div>


    <!-- PÁGINA 3: O LOGOTIPO -->
    <div class="page">
        <div class="decor-grid"></div>
        <div class="content-container">
            <!-- Header -->
            <div class="flex justify-between items-center border-b border-primary/20 pb-4">
                <span class="text-primary font-body tracking-widest text-xs uppercase font-bold">02. Logotipo</span>
                <span class="text-secondary font-body text-xs">Mariana Bermudes</span>
            </div>

            <!-- Conteúdo -->
            <div class="my-auto flex flex-col gap-6">
                <div>
                    <span class="text-tertiary font-bold tracking-widest text-xs uppercase mb-1 block">Assinatura Visual</span>
                    <h2 class="text-3xl font-headline text-primary font-bold mb-4">Uso e Comportamento do Logo</h2>
                    <p class="text-sm font-body text-onSurface leading-relaxed mb-6">
                        O logotipo da marca é composto por formas estilizadas e limpas que dão ênfase ao nome profissional de Mariana Bermudes. O monograma combina elegância clássica com harmonia moderna. Abaixo estão as diretrizes de comportamento do logo em diferentes fundos da paleta de cores institucional.
                    </p>
                </div>

                <!-- Demonstrações de Fundo -->
                <div class="grid grid-cols-3 gap-6">
                    <!-- Fundo Creme (Primário) -->
                    <div class="border border-primary/10 rounded-xl p-5 flex flex-col items-center justify-between h-56 bg-background">
                        <span class="text-[10px] uppercase font-bold text-primary font-body mb-2">Aplicação Primária (Creme)</span>
                        <div class="w-full max-h-32 flex justify-center items-center overflow-hidden py-4">
                            ${logoSvg}
                        </div>
                        <span class="text-[9px] text-secondary font-mono mt-2">Fundo #faf6f0 (Creme)</span>
                    </div>

                    <!-- Fundo Verde Sálvia -->
                    <div class="rounded-xl p-5 flex flex-col items-center justify-between h-56 page-bg-green shadow-sm">
                        <span class="text-[10px] uppercase font-bold text-white/80 font-body mb-2">Aplicação em Fundo Escuro (Verde)</span>
                        <!-- Logo forçado a branco via CSS filter -->
                        <div class="w-full max-h-32 flex justify-center items-center overflow-hidden py-4 filter invert brightness-200">
                            ${logoSvg}
                        </div>
                        <span class="text-[9px] text-white/70 font-mono mt-2">Fundo #4a7c59 (Sálvia)</span>
                    </div>

                    <!-- Fundo Grafite/Ardósia -->
                    <div class="rounded-xl p-5 flex flex-col items-center justify-between h-56 page-bg-dark shadow-sm">
                        <span class="text-[10px] uppercase font-bold text-white/80 font-body mb-2">Aplicação em Alto Contraste (Grafite)</span>
                        <div class="w-full max-h-32 flex justify-center items-center overflow-hidden py-4 filter invert brightness-200">
                            ${logoSvg}
                        </div>
                        <span class="text-[9px] text-white/70 font-mono mt-2">Fundo #2e3230 (Ardósia)</span>
                    </div>
                </div>

                <!-- Diretrizes Rápidas -->
                <div class="glass-card p-4 grid grid-cols-3 gap-4 mt-4 text-xs text-secondary font-body">
                    <div>
                        <h4 class="font-bold text-primary mb-1">Área de Resguardo</h4>
                        <p>Manter sempre um espaço mínimo de segurança correspondente a 20% da altura total do logo em todas as bordas para evitar interferências visuais.</p>
                    </div>
                    <div>
                        <h4 class="font-bold text-primary mb-1">Redução Mínima</h4>
                        <p>Em impressos, o logotipo não deve ser veiculado com menos de 25mm de largura. Em telas digitais, o tamanho mínimo recomendado é de 120 pixels de largura.</p>
                    </div>
                    <div>
                        <h4 class="font-bold text-primary mb-1">Práticas Proibidas</h4>
                        <p>É estritamente proibido esticar, distorcer, alterar a cor original das letras, aplicar sombras tridimensionais baratas ou rotacionar o logo horizontalmente.</p>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="flex justify-between items-center text-xs text-secondary border-t border-primary/10 pt-4">
                <span>Brandbook Oficial</span>
                <span>Página 3</span>
            </div>
        </div>
    </div>


    <!-- PÁGINA 4: PALETA DE CORES -->
    <div class="page">
        <div class="decor-grid"></div>
        <div class="content-container">
            <!-- Header -->
            <div class="flex justify-between items-center border-b border-primary/20 pb-4">
                <span class="text-primary font-body tracking-widest text-xs uppercase font-bold">03. Cores</span>
                <span class="text-secondary font-body text-xs">Mariana Bermudes</span>
            </div>

            <!-- Conteúdo -->
            <div class="my-auto flex flex-col gap-6">
                <div>
                    <span class="text-tertiary font-bold tracking-widest text-xs uppercase mb-1 block">Universo Cromático</span>
                    <h2 class="text-3xl font-headline text-primary font-bold mb-4">Cores Institucionais & Psicologia</h2>
                    <p class="text-sm font-body text-onSurface leading-relaxed">
                        A escolha de cores reflete a transição entre o clínico e o orgânico. Os tons foram extraídos diretamente do design de interiores do consultório e de elementos naturais saudáveis (folhas de sálvia, terra fértil, grãos e sementes douradas), promovendo tranquilidade mental e credibilidade.
                    </p>
                </div>

                <!-- Grid de Cores -->
                <div class="grid grid-cols-5 gap-3 mt-4">
                    <!-- Verde Sálvia -->
                    <div class="flex flex-col rounded-xl overflow-hidden shadow-sm bg-white border border-primary/10">
                        <div class="h-24 bg-[#4a7c59]"></div>
                        <div class="p-3 flex-1 flex flex-col justify-between text-left">
                            <div>
                                <h4 class="font-bold text-xs text-primary font-headline">Verde Sálvia</h4>
                                <span class="text-[9px] text-secondary font-semibold font-body block uppercase mb-2">Primária</span>
                            </div>
                            <div class="text-[8px] font-mono text-secondary space-y-1">
                                <p>HEX: #4a7c59</p>
                                <p>RGB: 74, 124, 89</p>
                                <p>CMYK: 40, 0, 28, 51</p>
                            </div>
                        </div>
                    </div>

                    <!-- Marrom Terra -->
                    <div class="flex flex-col rounded-xl overflow-hidden shadow-sm bg-white border border-primary/10">
                        <div class="h-24 bg-[#6b6358]"></div>
                        <div class="p-3 flex-1 flex flex-col justify-between text-left">
                            <div>
                                <h4 class="font-bold text-xs text-secondary font-headline">Marrom Terra</h4>
                                <span class="text-[9px] text-secondary font-semibold font-body block uppercase mb-2">Secundária</span>
                            </div>
                            <div class="text-[8px] font-mono text-secondary space-y-1">
                                <p>HEX: #6b6358</p>
                                <p>RGB: 107, 99, 88</p>
                                <p>CMYK: 0, 7, 18, 58</p>
                            </div>
                        </div>
                    </div>

                    <!-- Dourado Terroso -->
                    <div class="flex flex-col rounded-xl overflow-hidden shadow-sm bg-white border border-primary/10">
                        <div class="h-24 bg-[#705c30]"></div>
                        <div class="p-3 flex-1 flex flex-col justify-between text-left">
                            <div>
                                <h4 class="font-bold text-xs text-tertiary font-headline">Oliva Ouro</h4>
                                <span class="text-[9px] text-secondary font-semibold font-body block uppercase mb-2">Acento</span>
                            </div>
                            <div class="text-[8px] font-mono text-secondary space-y-1">
                                <p>HEX: #705c30</p>
                                <p>RGB: 112, 92, 48</p>
                                <p>CMYK: 0, 18, 57, 56</p>
                            </div>
                        </div>
                    </div>

                    <!-- Creme Suave -->
                    <div class="flex flex-col rounded-xl overflow-hidden shadow-sm bg-white border border-primary/10">
                        <div class="h-24 bg-[#faf6f0] border-b border-primary/10"></div>
                        <div class="p-3 flex-1 flex flex-col justify-between text-left">
                            <div>
                                <h4 class="font-bold text-xs text-onSurface font-headline">Creme Suave</h4>
                                <span class="text-[9px] text-secondary font-semibold font-body block uppercase mb-2">Fundo</span>
                            </div>
                            <div class="text-[8px] font-mono text-secondary space-y-1">
                                <p>HEX: #faf6f0</p>
                                <p>RGB: 250, 246, 240</p>
                                <p>CMYK: 0, 2, 4, 2</p>
                            </div>
                        </div>
                    </div>

                    <!-- Grafite Ardósia -->
                    <div class="flex flex-col rounded-xl overflow-hidden shadow-sm bg-white border border-primary/10">
                        <div class="h-24 bg-[#2e3230]"></div>
                        <div class="p-3 flex-1 flex flex-col justify-between text-left">
                            <div>
                                <h4 class="font-bold text-xs text-onSurface font-headline">Cinza Ardósia</h4>
                                <span class="text-[9px] text-secondary font-semibold font-body block uppercase mb-2">Texto</span>
                            </div>
                            <div class="text-[8px] font-mono text-secondary space-y-1">
                                <p>HEX: #2e3230</p>
                                <p>RGB: 46, 50, 48</p>
                                <p>CMYK: 8, 0, 4, 80</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Psicologia e Aplicação -->
                <div class="glass-card p-5 grid grid-cols-2 gap-6 mt-4 text-xs leading-relaxed text-secondary font-body">
                    <div>
                        <h4 class="font-bold text-primary mb-1">Verde Sálvia e Marrom Terra</h4>
                        <p>O Verde Sálvia atua diretamente no sistema límbico gerando relaxamento e sensação de frescor natural, ideal para páginas institucionais de nutrição. O Marrom Terra ancora o design, trazendo estabilidade, sobriedade, conexão com alimentos integrais vindos diretamente do solo e segurança profissional.</p>
                    </div>
                    <div>
                        <h4 class="font-bold text-primary mb-1">Oliva Ouro, Creme e Grafite</h4>
                        <p>O Oliva Ouro atua como tom de destaque para botões, subtítulos elegantes e marcações premium (ex. "Cuidado 360º"). O Creme atua como um fundo sutil anti-fadiga ocular que acolhe a leitura, enquanto o Grafite Ardósia garante legibilidade ideal com contraste suavizado em comparação com o preto puro.</p>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="flex justify-between items-center text-xs text-secondary border-t border-primary/10 pt-4">
                <span>Brandbook Oficial</span>
                <span>Página 4</span>
            </div>
        </div>
    </div>


    <!-- PÁGINA 5: TIPOGRAFIA -->
    <div class="page">
        <div class="decor-grid"></div>
        <div class="content-container">
            <!-- Header -->
            <div class="flex justify-between items-center border-b border-primary/20 pb-4">
                <span class="text-primary font-body tracking-widest text-xs uppercase font-bold">04. Tipografia</span>
                <span class="text-secondary font-body text-xs">Mariana Bermudes</span>
            </div>

            <!-- Conteúdo -->
            <div class="my-auto flex flex-col gap-6">
                <div>
                    <span class="text-tertiary font-bold tracking-widest text-xs uppercase mb-1 block">Voz Escrita</span>
                    <h2 class="text-3xl font-headline text-primary font-bold mb-4">O Sistema Tipográfico</h2>
                    <p class="text-sm font-body text-onSurface leading-relaxed mb-6">
                        O contraste tipográfico do site Mariana React foi detalhadamente planejado. A escolha de uma fonte serifada elegante e acolhedora para títulos contrasta perfeitamente com uma fonte sem serifa contemporânea e geométrica para textos de leitura, proporcionando requinte estético.
                    </p>
                </div>

                <!-- Font Showcase -->
                <div class="grid grid-cols-2 gap-6">
                    <!-- Lora Card -->
                    <div class="glass-card p-5 border-t-4 border-primary">
                        <span class="text-[10px] uppercase font-bold text-primary font-body block mb-2">Fonte Principal de Títulos (Serif)</span>
                        <h3 class="text-5xl font-headline text-primary font-semibold mb-3">Lora</h3>
                        <p class="text-xs text-secondary leading-relaxed font-body mb-4">
                            Usada exclusivamente para títulos de impacto, cabeçalhos de seções e frases conceituais importantes. Representa autoridade acadêmica, tom humanizado e elegância clássica.
                        </p>
                        <div class="text-sm font-headline text-secondary tracking-wider space-y-1">
                            <p class="font-normal">Aa Bb Cc Dd Ee Ff Gg Hh</p>
                            <p class="font-bold">Aa Bb Cc Dd Ee Ff Gg Hh</p>
                            <p class="italic font-normal">Aa Bb Cc Dd Ee Ff Gg Hh (Itálico)</p>
                        </div>
                    </div>

                    <!-- Raleway Card -->
                    <div class="glass-card p-5 border-t-4 border-secondary">
                        <h3 class="text-5xl font-body text-secondary font-semibold mb-3">Raleway</h3>
                        <p class="text-xs text-secondary leading-relaxed font-body mb-4">
                            Aplicada em textos corridos, parágrafos, listas de planos, menus de navegação, formulários de contato e botões. Oferece clareza moderna, leveza e alta leiturabilidade digital.
                        </p>
                        <div class="text-sm font-body text-secondary tracking-wide space-y-1">
                            <p class="font-light">Aa Bb Cc Dd Ee Ff Gg Hh (Light)</p>
                            <p class="font-normal">Aa Bb Cc Dd Ee Ff Gg Hh (Regular)</p>
                            <p class="font-semibold">Aa Bb Cc Dd Ee Ff Gg Hh (Semibold)</p>
                        </div>
                    </div>
                </div>

                <!-- Hierarquia Recomendada -->
                <div class="border border-primary/10 rounded-xl p-4 bg-white/50 text-xs text-secondary font-body">
                    <h4 class="font-bold text-primary mb-2 uppercase text-[10px]">Hierarquia Visual Recomendada para Web</h4>
                    <table class="w-full text-left">
                        <thead>
                            <tr class="border-b border-primary/10 text-primary text-[10px] font-bold">
                                <th class="pb-2">Elemento</th>
                                <th class="pb-2">Família Tipográfica</th>
                                <th class="pb-2">Peso / Estilo</th>
                                <th class="pb-2">Tamanho Recomendado</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-primary/5">
                            <tr>
                                <td class="py-2 font-bold text-onSurface">Título Principal (H1)</td>
                                <td class="py-2 font-headline">Lora</td>
                                <td class="py-2">Bold (700)</td>
                                <td class="py-2">40px a 56px (telas grandes)</td>
                            </tr>
                            <tr>
                                <td class="py-2 font-bold text-onSurface">Subtítulos (H2)</td>
                                <td class="py-2 font-headline">Lora</td>
                                <td class="py-2">Medium (500) ou Bold</td>
                                <td class="py-2">28px a 36px</td>
                            </tr>
                            <tr>
                                <td class="py-2 font-bold text-onSurface">Corpo de Texto</td>
                                <td class="py-2 font-body">Raleway</td>
                                <td class="py-2">Regular (400)</td>
                                <td class="py-2">15px a 18px (espaçamento 1.6)</td>
                            </tr>
                            <tr>
                                <td class="py-2 font-bold text-onSurface">Botões / Rótulos</td>
                                <td class="py-2 font-body">Raleway</td>
                                <td class="py-2">Semibold (600) / Caixa Alta</td>
                                <td class="py-2">12px a 14px (letramento largo)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Footer -->
            <div class="flex justify-between items-center text-xs text-secondary border-t border-primary/10 pt-4">
                <span>Brandbook Oficial</span>
                <span>Página 5</span>
            </div>
        </div>
    </div>


    <!-- PÁGINA 6: GRAFISMOS & SISTEMA VISUAL -->
    <div class="page">
        <div class="decor-grid"></div>
        <div class="content-container">
            <!-- Header -->
            <div class="flex justify-between items-center border-b border-primary/20 pb-4">
                <span class="text-primary font-body tracking-widest text-xs uppercase font-bold">05. Grafismos</span>
                <span class="text-secondary font-body text-xs">Mariana Bermudes</span>
            </div>

            <!-- Conteúdo -->
            <div class="my-auto flex flex-col gap-6">
                <div>
                    <span class="text-tertiary font-bold tracking-widest text-xs uppercase mb-1 block">Estética e Atmosfera</span>
                    <h2 class="text-3xl font-headline text-primary font-bold mb-4">Grafismos Fluidos & Vidro</h2>
                    <p class="text-sm font-body text-onSurface leading-relaxed">
                        A marca se apoia em dois pilares visuais que quebram a rigidez dos layouts tradicionais de saúde: o uso de <strong>formas fluidas orgânicas (blobs)</strong>, inspiradas em células saudáveis e elementos da natureza, e o efeito **Glassmorphism**, que evoca limpeza clínica e sofisticação moderna.
                    </p>
                </div>

                <!-- Demonstração Gráfica -->
                <div class="grid grid-cols-2 gap-6 items-center">
                    <!-- Exibição de Formas Orgânicas -->
                    <div class="border border-primary/10 rounded-xl p-5 flex flex-col justify-between h-64 bg-white/70">
                        <span class="text-[10px] uppercase font-bold text-primary font-body block mb-2">Formas Fluidas (Blobs)</span>
                        <div class="relative w-full h-36 flex items-center justify-center">
                            <!-- Blob 1 -->
                            <div class="absolute w-28 h-28 bg-primary/20 blob-element -left-2 top-2 animate-pulse"></div>
                            <!-- Blob 2 -->
                            <div class="absolute w-24 h-24 bg-tertiary/15 blob-element-alt right-2 bottom-2"></div>
                            <!-- Text in center -->
                            <span class="relative z-10 text-xs font-headline font-bold text-primary text-center">Fluidez & Movimento Vital</span>
                        </div>
                        <p class="text-[10px] text-secondary leading-relaxed font-body mt-2">
                            Curvas biológicas com bordas totalmente arredondadas, nunca angulares ou cortantes, usadas para mascarar fotos de alimentos ou perfis.
                        </p>
                    </div>

                    <!-- Exibição do Efeito Vidro (Glassmorphism) -->
                    <div class="border border-primary/10 rounded-xl p-5 flex flex-col justify-between h-64 bg-[#e4e0d8]/30 relative overflow-hidden">
                        <!-- Círculos flutuantes de fundo -->
                        <div class="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-primary/30"></div>
                        <div class="absolute -left-6 -bottom-6 w-20 h-20 rounded-full bg-tertiary/30"></div>

                        <span class="text-[10px] uppercase font-bold text-primary font-body block mb-2 relative z-20">Efeito Vidro Premium</span>
                        <!-- Glass Card -->
                        <div class="glass-card p-4 relative z-20 shadow-md">
                            <h4 class="font-bold text-xs text-primary mb-1">antigravity-glass</h4>
                            <p class="text-[9px] text-secondary leading-relaxed">
                                Transparência sutil com desfoque de fundo e borda branca translúcida de 1px. Evoca leveza e alta tecnologia.
                            </p>
                        </div>
                        <p class="text-[10px] text-secondary leading-relaxed font-body relative z-20 mt-2">
                            Usado em seções de planos de saúde, depoimentos ou destaques de artigos no blog para manter o visual premium e limpo.
                        </p>
                    </div>
                </div>

                <!-- Diretriz de Imagens -->
                <div class="glass-card p-4 text-xs text-secondary font-body">
                    <h4 class="font-bold text-primary mb-1 uppercase text-[10px]">Estilo Fotográfico & Floating Assets</h4>
                    <p>As fotos devem retratar ingredientes e alimentos reais e frescos em ângulos limpos ou macro, com fundos desfocados e iluminação natural suave. A aplicação de objetos tridimensionais flutuantes no site (como mirtilos ou sementes) representa a sensação de dinamismo, frescor biológico e uma vida verdadeiramente ativa.</p>
                </div>
            </div>

            <!-- Footer -->
            <div class="flex justify-between items-center text-xs text-secondary border-t border-primary/10 pt-4">
                <span>Brandbook Oficial</span>
                <span>Página 6</span>
            </div>
        </div>
    </div>


    <!-- PÁGINA 7: TOM DE VOZ & DIRETRIZES -->
    <div class="page">
        <div class="decor-grid"></div>
        <div class="content-container">
            <!-- Header -->
            <div class="flex justify-between items-center border-b border-primary/20 pb-4">
                <span class="text-primary font-body tracking-widest text-xs uppercase font-bold">06. Tom de Voz</span>
                <span class="text-secondary font-body text-xs">Mariana Bermudes</span>
            </div>

            <!-- Conteúdo -->
            <div class="my-auto flex flex-col gap-6">
                <div>
                    <span class="text-tertiary font-bold tracking-widest text-xs uppercase mb-1 block">Comunicação e Redação</span>
                    <h2 class="text-3xl font-headline text-primary font-bold mb-4">Tom de Voz da Marca</h2>
                    <p class="text-sm font-body text-onSurface leading-relaxed">
                        A voz de Mariana Bermudes é um canal direto de empatia e confiança. Ela deve acolher o paciente com tranquilidade e empatia, enquanto mantém a precisão científica rigorosa esperada de uma profissional de saúde graduada por uma instituição de excelência.
                    </p>
                </div>

                <!-- Pilares de Comunicação -->
                <div class="grid grid-cols-3 gap-4 mt-2">
                    <div class="glass-card p-4">
                        <div class="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold mb-3 font-headline">01</div>
                        <h4 class="font-bold text-xs text-primary font-headline mb-1">Acolhimento</h4>
                        <p class="text-[10px] text-secondary leading-relaxed">
                            Linguagem empática, inclusiva e livre de termos punitivos ou vergonha corporal. O paciente sente que suas dores são compreendidas.
                        </p>
                    </div>

                    <div class="glass-card p-4">
                        <div class="w-8 h-8 rounded-full bg-secondary/15 flex items-center justify-center text-secondary font-bold mb-3 font-headline">02</div>
                        <h4 class="font-bold text-xs text-secondary font-headline mb-1">Didatismo</h4>
                        <p class="text-[10px] text-secondary leading-relaxed">
                            Explicar a ciência de forma compreensível. Traduzir termos médicos e bioquímicos difíceis em práticas simples do cotidiano alimentar.
                        </p>
                    </div>

                    <div class="glass-card p-4">
                        <div class="w-8 h-8 rounded-full bg-tertiary/15 flex items-center justify-center text-tertiary font-bold mb-3 font-headline">03</div>
                        <h4 class="font-bold text-xs text-tertiary font-headline mb-1">Credibilidade</h4>
                        <p class="text-[10px] text-secondary leading-relaxed">
                            Embasamento claro. Citar estudos clínicos recentes, referências às Ligas de Pesquisa e rotulagem científica de forma natural.
                        </p>
                    </div>
                </div>

                <!-- Exemplos de Redação -->
                <div class="border border-primary/10 rounded-xl p-4 bg-white/60 text-xs text-secondary font-body">
                    <h4 class="font-bold text-primary mb-2 uppercase text-[10px]">Guia Prático de Comunicação Verbal</h4>
                    <div class="grid grid-cols-2 gap-4 divide-x divide-primary/10">
                        <div class="pr-2">
                            <span class="text-red-600 font-bold block mb-1">Evitar (Comunicação Restritiva):</span>
                            <ul class="list-disc pl-4 space-y-1 text-[10px]">
                                <li>"Zere o carboidrato e perca peso rápido."</li>
                                <li>"O alimento X é proibido na sua dieta."</li>
                                <li>"Foque apenas no peso da balança."</li>
                                <li>Terminologia fria e excessivamente clínica sem conexão humana.</li>
                            </ul>
                        </div>
                        <div class="pl-4">
                            <span class="text-emerald-700 font-bold block mb-1">Preferir (Comunicação Consciente):</span>
                            <ul class="list-disc pl-4 space-y-1 text-[10px]">
                                <li>"Nutrição inteligente para uma vida ativa e sem restrições extremas."</li>
                                <li>"Equilíbrio e consciência no prato, comendo de tudo com paz."</li>
                                <li>"Sua saúde avaliada em 360º de forma integrativa."</li>
                                <li>Conversas leves, repletas de empatia, clareza e acolhimento.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="flex justify-between items-center text-xs text-secondary border-t border-primary/10 pt-4">
                <span>Brandbook Oficial</span>
                <span>Página 7</span>
            </div>
        </div>
    </div>


    <!-- PÁGINA 8: CONTRA-CAPA E ENCERRAMENTO -->
    <div class="page page-bg-dark">
        <div class="decor-grid"></div>
        <div class="content-container">
            <!-- Header sutil -->
            <div class="flex justify-between items-center border-b border-white/10 pb-4">
                <span class="text-white/60 font-body tracking-widest text-xs uppercase font-bold">Manual de Identidade Visual</span>
                <span class="text-white/40 font-body text-xs">Fim do Documento</span>
            </div>

            <!-- Centro: Mensagem Final -->
            <div class="my-auto flex flex-col items-center text-center">
                <!-- Logotipo Versão Branca -->
                <div class="w-40 h-40 flex items-center justify-center mb-8 filter invert brightness-200 opacity-90">
                    ${logoSvg}
                </div>
                <div class="w-16 h-0.5 bg-white/20 my-6"></div>
                <p class="text-2xl font-headline italic text-[#faf6f0] max-w-lg leading-relaxed">
                    "Promover a saúde integral através de uma nutrição consciente e humanizada, conectando ciência e bem-estar."
                </p>
                <span class="text-xs uppercase tracking-widest font-body text-[#faf6f0]/50 block mt-4">— Mariana Bermudes</span>
            </div>

            <!-- Rodapé e Contatos -->
            <div class="grid grid-cols-2 border-t border-white/10 pt-6 text-xs text-white/50 font-body">
                <div>
                    <h5 class="font-bold text-white mb-2 uppercase text-[10px]">Contatos e Canais</h5>
                    <p class="mb-1">Site: marianabermudes.com.br</p>
                    <p class="mb-1">E-mail: contato@marianabermudes.com.br</p>
                    <p>CRN-3 • São Paulo, SP</p>
                </div>
                <div class="text-right flex flex-col justify-end">
                    <p class="font-bold text-white mb-1">© 2026 Mariana Bermudes</p>
                    <p>Todos os direitos reservados à marca.</p>
                </div>
            </div>
        </div>
    </div>

</body>
</html>
`;

// Executa o Puppeteer para gerar o PDF
(async () => {
    console.log("Iniciando geração do PDF via Puppeteer...");
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        
        // Define o conteúdo HTML
        console.log("Injetando conteúdo HTML e aguardando renderização...");
        await page.setContent(htmlContent, { 
            waitUntil: 'networkidle0', // Aguarda carregamento de fontes e CDN do Tailwind
            timeout: 60000 
        });

        // Configuração de impressão PDF
        console.log("Compilando PDF tamanho A4...");
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '0px',
                bottom: '0px',
                left: '0px',
                right: '0px'
            }
        });

        // Grava o arquivo de saída
        fs.writeFileSync(outputPath, pdfBuffer);
        console.log(`\nSUCCESS: Brandbook PDF gerado com sucesso em:\n${outputPath}\n`);
        process.exit(0);
    } catch (err) {
        console.error("ERRO durante a geração do PDF:", err);
        process.exit(1);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
})();
