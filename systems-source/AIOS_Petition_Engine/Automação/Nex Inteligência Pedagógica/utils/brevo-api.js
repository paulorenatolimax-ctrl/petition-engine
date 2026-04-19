/**
 * Brevo API Wrapper — Envio de emails transacionais
 *
 * Usa a API da Brevo (ex-Sendinblue) para enviar relatórios
 * e sequências de nutrição por email.
 */

import axios from 'axios';
import { createAgentLogger } from './logger.js';

const log = createAgentLogger('BREVO');

const BASE_URL = 'https://api.brevo.com/v3';

function getConfig() {
  if (!process.env.BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY não configurada no .env');
  }
  return {
    apiKey: process.env.BREVO_API_KEY,
    senderEmail: process.env.BREVO_SENDER_EMAIL || 'contato@nexinteligencia.com.br',
    senderName: process.env.BREVO_SENDER_NAME || 'Nex Inteligência Pedagógica',
  };
}

function getClient() {
  const config = getConfig();
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      'api-key': config.apiKey,
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Envia email transacional via Brevo.
 */
async function enviarEmail(destinatario, assunto, htmlContent) {
  try {
    const config = getConfig();
    const client = getClient();

    log.info('Enviando email...', { para: destinatario.email, assunto });

    const response = await client.post('/smtp/email', {
      sender: {
        name: config.senderName,
        email: config.senderEmail,
      },
      to: [{
        email: destinatario.email,
        name: destinatario.nome || destinatario.email,
      }],
      subject: assunto,
      htmlContent,
    });

    log.info('Email enviado', {
      para: destinatario.email,
      messageId: response.data.messageId,
    });
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    log.error(`Erro ao enviar email: ${msg}`, { para: destinatario.email });
    throw new Error(`Brevo: ${msg}`);
  }
}

/**
 * Envia o relatório de diagnóstico por email.
 */
async function enviarRelatorio(lead, relatorioHtml) {
  const assunto = `📊 Relatório de Diagnóstico Pedagógico — ${lead.escola || 'Sua Escola'}`;

  const htmlCompleto = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6; }
    h2 { color: #1a365d; border-bottom: 2px solid #1a365d; padding-bottom: 10px; }
    h3 { color: #2d3748; margin-top: 24px; }
    .risco-critico { background: #fff5f5; border-left: 4px solid #e53e3e; padding: 12px 16px; margin: 12px 0; }
    .risco-atencao { background: #fffff0; border-left: 4px solid #ecc94b; padding: 12px 16px; margin: 12px 0; }
    .risco-ok { background: #f0fff4; border-left: 4px solid #38a169; padding: 12px 16px; margin: 12px 0; }
    .cta-box { background: #1a365d; color: white; padding: 20px; text-align: center; border-radius: 8px; margin: 24px 0; }
    .cta-box a { color: white; font-weight: bold; font-size: 18px; text-decoration: none; }
    .footer { font-size: 12px; color: #718096; margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 16px; }
  </style>
</head>
<body>
  ${relatorioHtml}

  <div class="cta-box">
    <p>Quer aprofundar esses resultados?</p>
    <a href="${process.env.CALENDLY_URL || '#'}">Agende sua consultoria gratuita de 30 minutos</a>
  </div>

  <div class="footer">
    <p><strong>Nex Inteligência Pedagógica</strong></p>
    <p>Kayenne Cristine Vosgerau da Silva</p>
    <p>Mestra em Educação | 15+ anos em Gestão Educacional</p>
    <p>WhatsApp: (44) 99927-9091</p>
  </div>
</body>
</html>`;

  return await enviarEmail(
    { email: lead.email, nome: lead.nome },
    assunto,
    htmlCompleto
  );
}

/**
 * Cria ou atualiza contato na base da Brevo.
 */
async function criarContato(lead) {
  try {
    const client = getClient();

    log.info('Criando contato Brevo...', { email: lead.email });

    const response = await client.post('/contacts', {
      email: lead.email,
      attributes: {
        NOME: lead.nome || '',
        ESCOLA: lead.escola || '',
        WHATSAPP: lead.whatsapp || '',
      },
      listIds: [1], // lista padrão — configurar no Brevo
      updateEnabled: true,
    });

    log.info('Contato criado/atualizado', { email: lead.email });
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    log.warn(`Contato Brevo: ${msg}`, { email: lead.email });
  }
}

export default {
  enviarEmail,
  enviarRelatorio,
  criarContato,
};
