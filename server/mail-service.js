import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { escapeHtml } from './sanitize.js';

dotenv.config();

// STEP: Versão escapada dos campos de usuário para interpolação segura
// no corpo HTML dos e-mails (a versão text/plain não interpreta HTML).
function safeView(booking) {
    return {
        nome: escapeHtml(booking.nome),
        email: escapeHtml(booking.email),
        whatsapp: escapeHtml(booking.whatsapp),
        plan_title: escapeHtml(booking.plan_title),
        objetivo: escapeHtml(booking.objetivo),
        descricao_objetivo: escapeHtml(booking.descricao_objetivo),
        condicoes_saude: escapeHtml(booking.condicoes_saude),
        medicamentos: escapeHtml(booking.medicamentos),
    };
}

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: process.env.MAIL_PORT || 465,
  secure: process.env.MAIL_SECURE !== 'false', // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

/**
 * Envia notificação de novo contrato para a Mariana
 */
export async function sendNewBookingNotification(booking, pdfBuffer) {
  const safe = safeView(booking);
  const adminUrl = `${process.env.SITE_URL || 'http://localhost:5173'}/admin`;
  
  // STEP: Higieniza o número de WhatsApp e monta o link de contato rápido
  let cleanPhone = booking.whatsapp.replace(/\D/g, '');
  if (cleanPhone.length === 10 || cleanPhone.length === 11) {
    cleanPhone = '55' + cleanPhone;
  }
  
  const welcomeMessage = `Olá ${booking.nome}! Aqui é a Mariana Bermudes. Recebi sua ficha de triagem e seu contrato assinado para o plano ${booking.plan_title} 360º. Fico muito feliz em iniciar sua jornada de nutrição! Como estão seus horários esta semana para agendarmos nossa primeira consulta?`;
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(welcomeMessage)}`;

  const mailOptions = {
    from: `"NutriJornada 360" <${process.env.MAIL_USER}>`,
    to: 'marianabermudesnutri@gmail.com',
    subject: `📋 Novo Contrato Recebido: ${booking.nome}`,
    text: `Olá Mariana,
    
Um novo contrato foi assinado e aguarda sua revisão técnica.

DADOS DO CLIENTE:
- Nome: ${booking.nome}
- WhatsApp: ${booking.whatsapp}
- E-mail: ${booking.email}
- Plano: ${booking.plan_title}

TRIAGEM:
- Objetivo: ${booking.objetivo}
- Descrição: ${booking.descricao_objetivo || 'Não informada'}
- Saúde: ${booking.condicoes_saude || 'Nenhuma'}
- Medicamentos: ${booking.medicamentos || 'Nenhum'}

CONVERSA DE WHATSAPP (Mensagem automática de boas-vindas já configurada):
${whatsappUrl}

Acesse o painel administrativo para revisar e aprovar:
${adminUrl}

O contrato assinado pelo cliente segue em anexo em formato PDF.`,
    html: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <h2 style="color: #4a7c59;">📋 Novo Contrato Recebido</h2>
        <p>Olá Mariana, um novo contrato foi assinado e aguarda sua <b>revisão técnica</b>.</p>
        
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; font-size: 14px; color: #666; text-transform: uppercase;">Dados do Cliente</h3>
          <p style="margin: 5px 0;"><strong>Nome:</strong> ${safe.nome}</p>
          <p style="margin: 5px 0;"><strong>WhatsApp:</strong> ${safe.whatsapp}</p>
          <p style="margin: 5px 0;"><strong>Plano:</strong> ${safe.plan_title}</p>
        </div>

        <div style="background: #edf7ed; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4a7c59;">
          <h3 style="margin-top: 0; font-size: 14px; color: #4a7c59; text-transform: uppercase;">Resumo da Triagem</h3>
          <p style="margin: 5px 0;"><strong>Objetivo:</strong> ${safe.objetivo}</p>
          <p style="margin: 5px 0;"><strong>Saúde:</strong> ${safe.condicoes_saude || 'Nenhuma'}</p>
        </div>

        <div style="background: #eaf6ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1d9bf0;">
          <h3 style="margin-top: 0; font-size: 14px; color: #1d9bf0; text-transform: uppercase;">💬 Contato Rápido por WhatsApp</h3>
          <p style="margin: 5px 0; font-size: 13px;">Clique no botão abaixo para iniciar a conversa no WhatsApp do cliente com uma mensagem de boas-vindas já preenchida:</p>
          <div style="text-align: center; margin: 15px 0 5px 0;">
            <a href="${whatsappUrl}" style="background: #25d366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Iniciar Conversa no WhatsApp
            </a>
          </div>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <a href="${adminUrl}" style="background: #4a7c59; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Acessar Painel Admin
          </a>
        </div>
        
        <p style="font-size: 12px; color: #999; margin-top: 40px; text-align: center;">
          NutriJornada 360º - Sistema de Consultoria Exclusiva
        </p>
      </div>
    `,
    attachments: [
      {
        filename: `Contrato_${booking.nome.replace(/\s+/g, '_')}.pdf`,
        content: pdfBuffer,
      },
    ],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado: ' + info.response);
    return info;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw error;
  }
}

/**
 * Envia e-mail de boas-vindas e confirmação de pagamento para o cliente
 */
export async function sendPaymentConfirmation(booking, pdfBuffer) {
  const safe = safeView(booking);
  const mailOptions = {
    from: `"Mariana Bermudes" <${process.env.MAIL_USER}>`,
    to: booking.email,
    subject: `🎉 Tudo Pronto! Seu Acompanhamento Nutricional Começou`,
    text: `Olá ${booking.nome},
    
Seu pagamento foi confirmado com sucesso e sua vaga na consultoria NutriJornada 360º está garantida!

O seu contrato assinado e aprovado por ambas as partes segue em anexo em formato PDF para seu registro.

PRÓXIMOS PASSOS:
1. Agendamento da Primeira Consulta: Eu já fui notificada e em breve entrarei em contato via WhatsApp para definirmos o melhor dia e horário para nossa consulta de avaliação inicial.
2. Diário Alimentar: Comece a observar suas refeições e anote suas principais dificuldades. Isso ajudará muito no início do nosso trabalho.

Seja muito bem-vindo(a) a essa jornada de transformação!

Abraços,
Mariana Bermudes
Nutricionista - CRN-3`,
    html: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <h2 style="color: #4a7c59; text-align: center;">🎉 Seja muito bem-vindo(a)!</h2>
        <p>Olá <strong>${safe.nome}</strong>,</p>
        <p>É com muita alegria que confirmo o recebimento do seu pagamento. Sua vaga na consultoria exclusiva <strong>NutriJornada 360º</strong> (Plano: ${safe.plan_title}) está oficialmente garantida!</p>
        
        <div style="background: #edf7ed; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #4a7c59;">
          <h3 style="margin-top: 0; color: #4a7c59; font-size: 16px;">📋 Seu Contrato Assinado</h3>
          <p style="margin: 0; font-size: 14px;">A via final do seu contrato assinado digitalmente e carimbado com nossa aprovação técnica foi gerada com sucesso e segue em anexo a este e-mail.</p>
        </div>

        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h3 style="margin-top: 0; color: #333; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">🚀 Próximos Passos</h3>
          <ol style="margin: 10px 0; padding-left: 20px; font-size: 14px;">
            <li style="margin-bottom: 10px;">
              <strong>Agendamento:</strong> Eu entrarei em contato com você via WhatsApp nas próximas horas para definirmos a data da nossa consulta de avaliação inicial.
            </li>
            <li style="margin-bottom: 10px;">
              <strong>Preparação:</strong> Comece a anotar tudo o que você come hoje e suas maiores dificuldades com a alimentação. Vamos usar isso logo no primeiro dia!
            </li>
          </ol>
        </div>

        <p style="margin-top: 30px; text-align: center; font-size: 15px; font-weight: bold; color: #4a7c59;">
          Estou animada para ver a sua transformação de perto! Até logo.
        </p>

        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
        
        <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">
          Mariana Bermudes Nutrição — CRN-3<br>
          Este e-mail é uma confirmação automática de transação comercial.
        </p>
      </div>
    `,
    attachments: [
      {
        filename: `Contrato_Assinado_${booking.nome.replace(/\s+/g, '_')}.pdf`,
        content: pdfBuffer,
      },
    ],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('[Mail Customer] Confirmação de pagamento enviada: ' + info.response);
    return info;
  } catch (error) {
    console.error('[Mail Customer] Erro ao enviar e-mail de pagamento:', error);
    throw error;
  }
}
