// ==========================================================
// CONTRACT TEMPLATE: Geração de HTML dinâmico para contratos
// de prestação de serviços de consultoria nutricional.
// Todo dado vindo do usuário é escapado antes da interpolação
// (o HTML é renderizado pelo Puppeteer para gerar o PDF).
// ==========================================================
import { escapeHtml, sanitizeSignatureDataUrl } from './sanitize.js';

/**
 * Formata valor de centavos para string BRL (ex: 20000 -> "200,00")
 */
function formatBRL(cents) {
    const reais = Math.floor(cents / 100);
    const centavos = cents % 100;
    return `${reais.toLocaleString('pt-BR')},${centavos.toString().padStart(2, '0')}`;
}

/**
 * Formata data ISO para formato brasileiro (DD/MM/AAAA)
 */
function formatDate(isoDate) {
    if (!isoDate) return new Date().toLocaleDateString('pt-BR');
    const d = new Date(isoDate);
    return d.toLocaleDateString('pt-BR');
}

/**
 * Gera o HTML completo do contrato com dados do booking.
 * @param {Object} data - Dados do booking
 * @param {Object} options - Opções (showApprovalStamp, adminSignature)
 * @returns {string} HTML completo do contrato
 */
export function generateContractHTML(data, options = {}) {
    const {
        plan_price_cents, parcelas, valor_parcela_cents,
        objetivo,
        assinado_em, booking_token
    } = data;

    // STEP: Escapa todos os campos de texto fornecidos pelo usuário
    const nome = escapeHtml(data.nome);
    const cpf = escapeHtml(data.cpf);
    const dataNascimento = data.dataNascimento;
    const email = escapeHtml(data.email);
    const whatsapp = escapeHtml(data.whatsapp);
    const plan_title = escapeHtml(data.plan_title);
    const descricao_objetivo = escapeHtml(data.descricao_objetivo);
    // Assinaturas só entram se forem data-URLs de imagem válidas
    const assinatura_usuario = sanitizeSignatureDataUrl(data.assinatura_usuario);
    const assinatura_admin = sanitizeSignatureDataUrl(data.assinatura_admin);

    const { showApprovalStamp = false } = options;

    const dataContrato = formatDate(assinado_em || new Date().toISOString());
    const valorTotal = formatBRL(plan_price_cents);
    const valorParcela = formatBRL(valor_parcela_cents || plan_price_cents);

    // STEP: Mapeamento de objetivo para texto legível
    const objetivoMap = {
        'emagrecimento': 'Emagrecimento Saudável',
        'hipertrofia': 'Ganho de Massa Muscular',
        'saude': 'Melhoria de Saúde e Bem-estar',
        'outro': 'Acompanhamento Nutricional Personalizado'
    };
    const objetivoTexto = objetivoMap[objetivo] || escapeHtml(objetivo) || 'Acompanhamento Nutricional';

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Contrato - ${nome} - ${plan_title}</title>
    <style>
        /* STEP: Reset e tipografia base para impressão/PDF */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Georgia', 'Times New Roman', serif;
            font-size: 11pt;
            line-height: 1.7;
            color: #1a1a1a;
            padding: 40px 50px;
            max-width: 800px;
            margin: 0 auto;
            position: relative;
        }
        
        /* STEP: Cabeçalho premium */
        .header {
            text-align: center;
            border-bottom: 2px solid #2d5a27;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            font-size: 16pt;
            color: #2d5a27;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 5px;
        }
        .header .subtitle {
            font-size: 9pt;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 3px;
        }
        .contract-id {
            font-size: 8pt;
            color: #999;
            text-align: right;
            margin-bottom: 20px;
        }
        
        /* STEP: Cláusulas */
        .clause { margin-bottom: 20px; }
        .clause h2 {
            font-size: 11pt;
            color: #2d5a27;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
            border-left: 3px solid #2d5a27;
            padding-left: 10px;
        }
        .clause p { text-align: justify; margin-bottom: 8px; }
        .clause .highlight {
            background: #f0f7ef;
            padding: 8px 12px;
            border-radius: 4px;
            font-weight: bold;
        }
        
        /* STEP: Tabela de pagamento */
        .payment-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        .payment-table th, .payment-table td {
            border: 1px solid #ddd;
            padding: 8px 12px;
            text-align: left;
        }
        .payment-table th {
            background: #2d5a27;
            color: white;
            font-size: 9pt;
            text-transform: uppercase;
        }
        
        /* STEP: Área de assinaturas */
        .signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 50px;
            padding-top: 20px;
        }
        .signature-block {
            width: 45%;
            text-align: center;
        }
        .signature-block .sig-image {
            height: 60px;
            margin-bottom: 5px;
        }
        .signature-block .sig-line {
            border-top: 1px solid #333;
            padding-top: 5px;
            font-size: 9pt;
        }
        .signature-block .sig-name {
            font-weight: bold;
            font-size: 10pt;
        }
        .signature-block .sig-detail {
            font-size: 8pt;
            color: #666;
        }
        
        /* STEP: Carimbo de aprovação (sobreposto) */
        .approval-stamp {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-15deg);
            border: 4px solid #2d5a27;
            color: #2d5a27;
            padding: 10px 30px;
            font-size: 28pt;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 5px;
            opacity: 0.15;
            pointer-events: none;
            border-radius: 10px;
        }
        
        /* STEP: Rodapé */
        .footer {
            margin-top: 40px;
            padding-top: 15px;
            border-top: 1px solid #ddd;
            font-size: 8pt;
            color: #999;
            text-align: center;
        }
    </style>
</head>
<body>
    ${showApprovalStamp ? '<div class="approval-stamp">APROVADO</div>' : ''}

    <div class="header">
        <h1>Contrato de Prestação de Serviços</h1>
        <div class="subtitle">Acompanhamento Nutricional Personalizado</div>
    </div>
    
    <div class="contract-id">Ref: ${booking_token ? booking_token.substring(0, 8).toUpperCase() : 'N/A'} | Data: ${dataContrato}</div>

    <div class="clause">
        <h2>Cláusula 1ª — Das Partes</h2>
        <p><strong>CONTRATADA:</strong> MARIANA BERMUDES, nutricionista inscrita no CRN-3, 
        com consultório profissional em São Paulo/SP, doravante denominada "Nutricionista".</p>
        <p><strong>CONTRATANTE:</strong> ${nome || '_______________'}, 
        CPF ${cpf || '___.___.___-__'}, 
        nascido(a) em ${dataNascimento ? formatDate(dataNascimento) : '__/__/____'}, 
        e-mail ${email || '_______________'}, 
        WhatsApp ${whatsapp || '(__)_____-____'}, 
        doravante denominado(a) "Cliente".</p>
    </div>

    <div class="clause">
        <h2>Cláusula 2ª — Do Objeto</h2>
        <p>O presente contrato tem por objeto a prestação de serviços de acompanhamento nutricional 
        na modalidade <strong>"${plan_title}"</strong>, com foco em 
        <strong>${objetivoTexto}</strong>${descricao_objetivo ? ` — "${descricao_objetivo}"` : ''}.</p>
        <p>Os serviços incluem avaliação nutricional completa, elaboração de plano alimentar personalizado, 
        orientações nutricionais e acompanhamento conforme especificações do plano contratado.</p>
    </div>

    <div class="clause">
        <h2>Cláusula 3ª — Do Valor e Forma de Pagamento</h2>
        <p>Pelo serviço descrito, o CONTRATANTE pagará à CONTRATADA o valor total de:</p>
        <div class="highlight">R$ ${valorTotal} (${extenso(plan_price_cents)})</div>
        <table class="payment-table">
            <thead>
                <tr>
                    <th>Condição</th>
                    <th>Parcelas</th>
                    <th>Valor por Parcela</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>PIX</td>
                    <td>${parcelas}x</td>
                    <td>R$ ${valorParcela}</td>
                    <td>R$ ${valorTotal}</td>
                </tr>
            </tbody>
        </table>
        <p>O pagamento será realizado exclusivamente via PIX, conforme QR Code disponibilizado 
        após a aprovação deste contrato pela Nutricionista.</p>
    </div>

    <div class="clause">
        <h2>Cláusula 4ª — Da Vigência</h2>
        <p>O presente contrato terá vigência a partir da data de confirmação do pagamento, 
        pelo período correspondente ao plano contratado, podendo ser renovado mediante novo acordo entre as partes.</p>
    </div>

    <div class="clause">
        <h2>Cláusula 5ª — Do Cancelamento e Reembolso</h2>
        <p>O CONTRATANTE poderá solicitar o cancelamento em até 7 (sete) dias corridos após a contratação, 
        conforme o Código de Defesa do Consumidor (Art. 49), com reembolso integral.</p>
        <p>Após esse prazo, o cancelamento implicará na cobrança proporcional aos serviços já prestados.</p>
    </div>

    <div class="clause">
        <h2>Cláusula 6ª — Das Obrigações do Cliente</h2>
        <p>O CONTRATANTE se compromete a: (a) fornecer informações verídicas sobre seu estado de saúde; 
        (b) seguir as orientações nutricionais acordadas; (c) comparecer às consultas agendadas ou 
        comunicar impossibilidade com antecedência mínima de 24 horas.</p>
    </div>

    <div class="clause">
        <h2>Cláusula 7ª — Proteção de Dados (LGPD)</h2>
        <p>Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), 
        os dados pessoais e de saúde coletados serão utilizados exclusivamente para a prestação 
        dos serviços contratados, armazenados de forma segura e jamais compartilhados com terceiros 
        sem consentimento expresso do CONTRATANTE.</p>
    </div>

    <div class="clause">
        <h2>Cláusula 8ª — Do Foro</h2>
        <p>Fica eleito o foro da Comarca de São Paulo/SP para dirimir quaisquer dúvidas 
        oriundas do presente contrato.</p>
    </div>

    <p style="margin-top: 30px; text-align: center; font-style: italic; color: #666;">
        E por estarem de pleno acordo, as partes assinam digitalmente o presente instrumento.
    </p>
    <p style="text-align: center; color: #666; font-size: 10pt;">
        São Paulo, ${dataContrato}
    </p>

    <div class="signatures">
        <div class="signature-block">
            ${assinatura_usuario 
                ? `<img src="${assinatura_usuario}" class="sig-image" alt="Assinatura do Cliente" />`
                : '<div style="height:60px"></div>'
            }
            <div class="sig-line">
                <div class="sig-name">${nome || 'CONTRATANTE'}</div>
                <div class="sig-detail">CPF: ${cpf || '___.___.___-__'}</div>
            </div>
        </div>
        <div class="signature-block">
            ${assinatura_admin 
                ? `<img src="${assinatura_admin}" class="sig-image" alt="Assinatura da Nutricionista" />`
                : '<div style="height:60px"></div>'
            }
            <div class="sig-line">
                <div class="sig-name">MARIANA BERMUDES</div>
                <div class="sig-detail">Nutricionista — CRN-3</div>
            </div>
        </div>
    </div>

    <div class="footer">
        NutriJornada 360º — Mariana Bermudes Nutrição<br>
        Documento gerado digitalmente em ${dataContrato} | Ref: ${booking_token ? booking_token.substring(0, 8).toUpperCase() : ''}
    </div>
</body>
</html>`;
}

/**
 * STEP: Converte valor em centavos para texto por extenso (simplificado)
 * Cobre valores até R$9.999,99
 */
function extenso(cents) {
    const reais = Math.floor(cents / 100);
    const centavos = cents % 100;

    const unidades = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
    const teens = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
    const dezenas = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
    const centenas = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

    function convert(n) {
        if (n === 0) return '';
        if (n === 100) return 'cem';
        if (n < 10) return unidades[n];
        if (n < 20) return teens[n - 10];
        if (n < 100) {
            const d = Math.floor(n / 10);
            const u = n % 10;
            return dezenas[d] + (u ? ' e ' + unidades[u] : '');
        }
        if (n < 1000) {
            const c = Math.floor(n / 100);
            const rest = n % 100;
            return centenas[c] + (rest ? ' e ' + convert(rest) : '');
        }
        if (n < 10000) {
            const m = Math.floor(n / 1000);
            const rest = n % 1000;
            return unidades[m] + ' mil' + (rest ? (rest < 100 ? ' e ' : ' ') + convert(rest) : '');
        }
        return String(n);
    }

    let result = convert(reais) + ' reais';
    if (centavos > 0) {
        result += ' e ' + convert(centavos) + ' centavos';
    }
    return result;
}
