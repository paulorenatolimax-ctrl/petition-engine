/**
 * Meta Marketing API v21 Wrapper
 *
 * Gerencia campanhas, ad sets e ads no Facebook/Instagram.
 * Documentação: https://developers.facebook.com/docs/marketing-apis
 */

import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import { createAgentLogger } from './logger.js';

const log = createAgentLogger('META');

const API_VERSION = 'v21.0';
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`;

function getConfig() {
  const required = ['META_ACCESS_TOKEN', 'META_AD_ACCOUNT_ID', 'META_PAGE_ID'];
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`${key} não configurada no .env`);
    }
  }
  return {
    token: process.env.META_ACCESS_TOKEN,
    accountId: process.env.META_AD_ACCOUNT_ID,
    pageId: process.env.META_PAGE_ID,
    dailyBudget: parseInt(process.env.META_DAILY_BUDGET || '500', 10),
    targetCpl: parseInt(process.env.META_TARGET_CPL || '5000', 10),
  };
}

function apiUrl(endpoint) {
  return `${BASE_URL}/${endpoint}`;
}

async function apiRequest(method, endpoint, data = {}) {
  const config = getConfig();
  try {
    const response = await axios({
      method,
      url: apiUrl(endpoint),
      params: method === 'GET' ? { access_token: config.token, ...data } : { access_token: config.token },
      data: method !== 'GET' ? data : undefined,
    });
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.error?.message || error.message;
    log.error(`Meta API error: ${msg}`, { endpoint, method });
    throw new Error(`Meta API: ${msg}`);
  }
}

// ============================================================
// CAMPANHA
// ============================================================

async function criarCampanha(nome) {
  const config = getConfig();
  log.info('Criando campanha...', { nome });

  const result = await apiRequest('POST', `${config.accountId}/campaigns`, {
    name: nome,
    objective: 'OUTCOME_LEADS',
    status: 'PAUSED',
    special_ad_categories: ['NONE'],
    access_token: config.token,
  });

  log.info('Campanha criada', { id: result.id });
  return result;
}

// ============================================================
// AD SET
// ============================================================

async function criarAdSet(campaignId, nome, angulo) {
  const config = getConfig();
  log.info('Criando ad set...', { nome, campaignId });

  const result = await apiRequest('POST', `${config.accountId}/adsets`, {
    name: nome,
    campaign_id: campaignId,
    daily_budget: config.dailyBudget,
    billing_event: 'IMPRESSIONS',
    optimization_goal: 'LEAD_GENERATION',
    bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
    status: 'PAUSED',
    targeting: JSON.stringify({
      age_min: 25,
      age_max: 60,
      genders: [0], // all
      geo_locations: {
        countries: ['BR'],
      },
      interests: [
        { id: '6003139266461', name: 'Education' },
        { id: '6003384544942', name: 'School' },
        { id: '6003312949853', name: 'Educational administration' },
        { id: '6003017940075', name: 'Management' },
      ],
      publisher_platforms: ['facebook', 'instagram'],
      facebook_positions: ['feed', 'story'],
      instagram_positions: ['stream', 'story', 'reels'],
    }),
    access_token: config.token,
  });

  log.info('Ad set criado', { id: result.id });
  return result;
}

// ============================================================
// AD IMAGE UPLOAD
// ============================================================

async function uploadImagem(imagePath) {
  const config = getConfig();
  log.info('Upload de imagem...', { imagePath });

  const FormData = (await import('form-data')).default;
  const form = new FormData();
  form.append('filename', fs.createReadStream(imagePath));
  form.append('access_token', config.token);

  const response = await axios.post(
    apiUrl(`${config.accountId}/adimages`),
    form,
    { headers: form.getHeaders() }
  );

  const images = response.data.images;
  const hash = Object.values(images)[0]?.hash;
  log.info('Imagem uploaded', { hash });
  return hash;
}

// ============================================================
// AD VIDEO UPLOAD
// ============================================================

async function uploadVideo(videoPath) {
  const config = getConfig();
  log.info('Upload de vídeo...', { videoPath });

  const FormData = (await import('form-data')).default;
  const form = new FormData();
  form.append('source', fs.createReadStream(videoPath));
  form.append('access_token', config.token);

  const response = await axios.post(
    apiUrl(`${config.accountId}/advideos`),
    form,
    { headers: form.getHeaders() }
  );

  log.info('Vídeo uploaded', { id: response.data.id });
  return response.data.id;
}

// ============================================================
// AD CREATIVE
// ============================================================

async function criarCreativeImagem(nome, imageHash, copy, link) {
  const config = getConfig();
  log.info('Criando creative de imagem...', { nome });

  const result = await apiRequest('POST', `${config.accountId}/adcreatives`, {
    name: nome,
    object_story_spec: JSON.stringify({
      page_id: config.pageId,
      link_data: {
        image_hash: imageHash,
        link: link || 'https://predict-vibe-pro.lovable.app/',
        message: copy.texto || '',
        name: copy.headline || '',
        call_to_action: {
          type: 'LEARN_MORE',
          value: { link: link || 'https://predict-vibe-pro.lovable.app/' },
        },
      },
    }),
    access_token: config.token,
  });

  log.info('Creative criado', { id: result.id });
  return result;
}

async function criarCreativeVideo(nome, videoId, copy, link) {
  const config = getConfig();
  log.info('Criando creative de vídeo...', { nome });

  const result = await apiRequest('POST', `${config.accountId}/adcreatives`, {
    name: nome,
    object_story_spec: JSON.stringify({
      page_id: config.pageId,
      video_data: {
        video_id: videoId,
        message: copy.texto || '',
        title: copy.headline || '',
        call_to_action: {
          type: 'LEARN_MORE',
          value: { link: link || 'https://predict-vibe-pro.lovable.app/' },
        },
      },
    }),
    access_token: config.token,
  });

  log.info('Creative de vídeo criado', { id: result.id });
  return result;
}

// ============================================================
// AD
// ============================================================

async function criarAd(adSetId, creativeId, nome) {
  const config = getConfig();
  log.info('Criando ad...', { nome, adSetId });

  const result = await apiRequest('POST', `${config.accountId}/ads`, {
    name: nome,
    adset_id: adSetId,
    creative: JSON.stringify({ creative_id: creativeId }),
    status: 'PAUSED',
    access_token: config.token,
  });

  log.info('Ad criado', { id: result.id });
  return result;
}

// ============================================================
// MÉTRICAS
// ============================================================

async function obterMetricasCampanha(campaignId, datePreset = 'last_3d') {
  log.info('Obtendo métricas...', { campaignId, datePreset });

  const result = await apiRequest('GET', `${campaignId}/insights`, {
    fields: 'impressions,clicks,ctr,cpc,cpm,spend,actions,cost_per_action_type,frequency',
    date_preset: datePreset,
  });

  return result.data || [];
}

async function obterMetricasAdSet(adSetId, datePreset = 'last_3d') {
  const result = await apiRequest('GET', `${adSetId}/insights`, {
    fields: 'impressions,clicks,ctr,cpc,cpm,spend,actions,cost_per_action_type,frequency',
    date_preset: datePreset,
  });

  return result.data || [];
}

async function obterMetricasAd(adId, datePreset = 'last_3d') {
  const result = await apiRequest('GET', `${adId}/insights`, {
    fields: 'impressions,clicks,ctr,cpc,cpm,spend,actions,cost_per_action_type,frequency',
    date_preset: datePreset,
  });

  return result.data || [];
}

// ============================================================
// CONTROLE
// ============================================================

async function pausarAd(adId) {
  log.warn('Pausando ad', { adId });
  return await apiRequest('POST', adId, { status: 'PAUSED' });
}

async function ativarAd(adId) {
  log.info('Ativando ad', { adId });
  return await apiRequest('POST', adId, { status: 'ACTIVE' });
}

async function pausarAdSet(adSetId) {
  log.warn('Pausando ad set', { adSetId });
  return await apiRequest('POST', adSetId, { status: 'PAUSED' });
}

async function listarAdsAtivos() {
  const config = getConfig();
  const result = await apiRequest('GET', `${config.accountId}/ads`, {
    fields: 'id,name,status,adset_id,campaign_id,creative',
    effective_status: ['ACTIVE'],
  });
  return result.data || [];
}

export default {
  criarCampanha,
  criarAdSet,
  uploadImagem,
  uploadVideo,
  criarCreativeImagem,
  criarCreativeVideo,
  criarAd,
  obterMetricasCampanha,
  obterMetricasAdSet,
  obterMetricasAd,
  pausarAd,
  ativarAd,
  pausarAdSet,
  listarAdsAtivos,
};
