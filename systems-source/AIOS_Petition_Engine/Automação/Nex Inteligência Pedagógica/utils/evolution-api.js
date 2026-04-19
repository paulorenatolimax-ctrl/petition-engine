/**
 * Evolution API Wrapper — WhatsApp via Evolution API
 *
 * Envia mensagens WhatsApp e gerencia sequências de nutrição.
 */

import axios from 'axios';
import { createAgentLogger } from './logger.js';

const log = createAgentLogger('EVOLUTION');

function getConfig() {
  const required = ['EVOLUTION_API_URL', 'EVOLUTION_API_KEY', 'EVOLUTION_INSTANCE'];
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`${key} não configurada no .env`);
    }
  }
  return {
    baseUrl: process.env.EVOLUTION_API_URL.replace(/\/$/, ''),
    apiKey: process.env.EVOLUTION_API_KEY,
    instance: process.env.EVOLUTION_INSTANCE,
  };
}

function getClient() {
  const config = getConfig();
  return axios.create({
    baseURL: config.baseUrl,
    headers: {
      'Content-Type': 'application/json',
      apikey: config.apiKey,
    },
  });
}

/**
 * Envia mensagem de texto via WhatsApp.
 */
async function enviarMensagem(numero, mensagem) {
  try {
    const config = getConfig();
    const client = getClient();

    const numeroFormatado = formatarNumero(numero);

    log.info('Enviando WhatsApp...', { para: numeroFormatado });

    const response = await client.post(`/message/sendText/${config.instance}`, {
      number: numeroFormatado,
      text: mensagem,
    });

    log.info('WhatsApp enviado', { para: numeroFormatado, status: response.status });
    return response.data;
  } catch (error) {
    log.error(`Erro ao enviar WhatsApp: ${error.message}`, { numero });
    throw error;
  }
}

/**
 * Envia mensagem com mídia (imagem ou vídeo).
 */
async function enviarMidia(numero, mediaUrl, caption, mediaType = 'image') {
  try {
    const config = getConfig();
    const client = getClient();

    const numeroFormatado = formatarNumero(numero);

    log.info('Enviando mídia WhatsApp...', { para: numeroFormatado, tipo: mediaType });

    const response = await client.post(`/message/sendMedia/${config.instance}`, {
      number: numeroFormatado,
      mediatype: mediaType,
      media: mediaUrl,
      caption: caption || '',
    });

    log.info('Mídia enviada', { para: numeroFormatado });
    return response.data;
  } catch (error) {
    log.error(`Erro ao enviar mídia: ${error.message}`);
    throw error;
  }
}

/**
 * Verifica o status da conexão WhatsApp.
 */
async function verificarConexao() {
  try {
    const config = getConfig();
    const client = getClient();

    const response = await client.get(`/instance/connectionState/${config.instance}`);
    const state = response.data?.instance?.state || 'unknown';

    log.info('Status WhatsApp', { state });
    return state;
  } catch (error) {
    log.error(`Erro ao verificar conexão: ${error.message}`);
    return 'disconnected';
  }
}

/**
 * Formata número para padrão WhatsApp (apenas dígitos, com código do país).
 */
function formatarNumero(numero) {
  const limpo = String(numero).replace(/\D/g, '');
  if (limpo.startsWith('55') && limpo.length >= 12) {
    return limpo;
  }
  if (limpo.length === 11 || limpo.length === 10) {
    return `55${limpo}`;
  }
  return limpo;
}

export default {
  enviarMensagem,
  enviarMidia,
  verificarConexao,
  formatarNumero,
};
