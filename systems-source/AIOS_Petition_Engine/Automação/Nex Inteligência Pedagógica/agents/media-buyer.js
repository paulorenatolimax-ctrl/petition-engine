/**
 * Agente 2 — Media Buyer
 *
 * Publica criativos no Meta Ads (Facebook/Instagram).
 * Estrutura: Campanha → Ad Set (por ângulo) → Ad (por criativo)
 *
 * Usa Meta Marketing API v21.
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import meta from '../utils/meta-api.js';
import { createAgentLogger } from '../utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_DIR = path.resolve(__dirname, '..');
const log = createAgentLogger('MEDIA-BUYER');

/**
 * Publica os criativos mais recentes no Meta Ads.
 */
async function publishLatest() {
  log.info('Iniciando publicação no Meta Ads...');

  try {
    // Encontrar o diretório de criativos mais recente
    const criativosDir = path.join(BASE_DIR, 'output', 'criativos');
    const dirs = await fs.readdir(criativosDir);
    const latest = dirs
      .filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d))
      .sort()
      .pop();

    if (!latest) {
      throw new Error('Nenhum diretório de criativos encontrado. Execute o Creative Director primeiro.');
    }

    const cycleDir = path.join(criativosDir, latest);
    log.info(`Publicando criativos de: ${latest}`);

    // Carregar copies
    const copiesPath = path.join(cycleDir, 'copies', `ciclo-${latest}.json`);
    if (!await fs.pathExists(copiesPath)) {
      throw new Error(`Arquivo de copies não encontrado: ${copiesPath}`);
    }
    const { copies } = await fs.readJson(copiesPath);

    // Criar campanha
    const campanha = await meta.criarCampanha(
      `Nex Pedagógica — ${latest}`
    );

    const adsMap = {
      ciclo: latest,
      campanhaId: campanha.id,
      adSets: [],
      ads: [],
    };

    const angulos = [
      { key: 'risco', nome: 'Urgência/Risco Legal', num: 1 },
      { key: 'autoridade', nome: 'Autoridade/Prova Social', num: 2 },
      { key: 'oferta', nome: 'Oferta/Diagnóstico', num: 3 },
    ];

    for (const angulo of angulos) {
      log.info(`Processando ângulo: ${angulo.nome}`);

      // Criar Ad Set para o ângulo
      const adSet = await meta.criarAdSet(
        campanha.id,
        `${angulo.nome} — ${latest}`,
        angulo.key
      );

      adsMap.adSets.push({
        id: adSet.id,
        angulo: angulo.key,
        nome: angulo.nome,
      });

      // Upload e criação de ads para imagens
      const imagensDir = path.join(cycleDir, 'imagens');
      if (await fs.pathExists(imagensDir)) {
        const imagens = (await fs.readdir(imagensDir))
          .filter(f => f.startsWith(`angulo-${angulo.num}-`) && f.endsWith('.png'));

        for (const imgFile of imagens) {
          try {
            const imgPath = path.join(imagensDir, imgFile);
            const imageHash = await meta.uploadImagem(imgPath);

            const copy = copies[angulo.key]?.feed || {};
            const creative = await meta.criarCreativeImagem(
              `${angulo.nome} — ${imgFile}`,
              imageHash,
              copy,
              'https://predict-vibe-pro.lovable.app/'
            );

            const ad = await meta.criarAd(
              adSet.id,
              creative.id,
              `Ad ${angulo.nome} — ${imgFile}`
            );

            adsMap.ads.push({
              id: ad.id,
              adSetId: adSet.id,
              creativeId: creative.id,
              angulo: angulo.key,
              tipo: 'imagem',
              arquivo: imgFile,
            });

            log.info(`Ad criado: ${imgFile}`);
          } catch (error) {
            log.error(`Falha ao publicar ${imgFile}: ${error.message}`);
          }
        }
      }

      // Upload e criação de ads para vídeos
      const videosDir = path.join(cycleDir, 'videos');
      if (await fs.pathExists(videosDir)) {
        const videos = (await fs.readdir(videosDir))
          .filter(f => f.startsWith(`angulo-${angulo.num}`) && f.endsWith('.mp4'));

        for (const videoFile of videos) {
          try {
            const videoPath = path.join(videosDir, videoFile);
            const videoId = await meta.uploadVideo(videoPath);

            const copy = copies[angulo.key]?.feed || {};
            const creative = await meta.criarCreativeVideo(
              `${angulo.nome} — ${videoFile}`,
              videoId,
              copy,
              'https://predict-vibe-pro.lovable.app/'
            );

            const ad = await meta.criarAd(
              adSet.id,
              creative.id,
              `Ad Video ${angulo.nome} — ${videoFile}`
            );

            adsMap.ads.push({
              id: ad.id,
              adSetId: adSet.id,
              creativeId: creative.id,
              angulo: angulo.key,
              tipo: 'video',
              arquivo: videoFile,
            });

            log.info(`Ad de vídeo criado: ${videoFile}`);
          } catch (error) {
            log.error(`Falha ao publicar vídeo ${videoFile}: ${error.message}`);
          }
        }
      }
    }

    // Salvar mapeamento
    const metaDir = path.join(BASE_DIR, 'output', 'meta');
    await fs.ensureDir(metaDir);
    await fs.writeJson(
      path.join(metaDir, 'ads-map.json'),
      adsMap,
      { spaces: 2 }
    );

    log.info('Publicação completa!', {
      campanha: campanha.id,
      adSets: adsMap.adSets.length,
      ads: adsMap.ads.length,
    });

    log.warn('Ads criados em modo PAUSED. Ative manualmente após revisão ou use o Performance Analyst.');

    return adsMap;
  } catch (error) {
    log.error(`Erro na publicação: ${error.message}`);
    throw error;
  }
}

/**
 * Publica variações extras de um ângulo específico no ad set existente.
 */
async function publishVariacoes(angulo) {
  log.info(`Publicando variações do ângulo: ${angulo}`);

  try {
    const metaDir = path.join(BASE_DIR, 'output', 'meta');
    const adsMapPath = path.join(metaDir, 'ads-map.json');

    if (!await fs.pathExists(adsMapPath)) {
      throw new Error('ads-map.json não encontrado. Execute publishLatest primeiro.');
    }

    const adsMap = await fs.readJson(adsMapPath);
    const adSet = adsMap.adSets.find(s => s.angulo === angulo);

    if (!adSet) {
      throw new Error(`Ad set para ângulo "${angulo}" não encontrado`);
    }

    // Encontrar novas imagens ainda não publicadas
    const cicloDir = path.join(BASE_DIR, 'output', 'criativos', adsMap.ciclo, 'imagens');
    const anguloNum = angulo === 'risco' ? 1 : angulo === 'autoridade' ? 2 : 3;
    const todasImagens = (await fs.readdir(cicloDir))
      .filter(f => f.startsWith(`angulo-${anguloNum}-`) && f.endsWith('.png'));

    const publicadas = new Set(adsMap.ads.filter(a => a.angulo === angulo).map(a => a.arquivo));
    const novas = todasImagens.filter(f => !publicadas.has(f));

    if (novas.length === 0) {
      log.info('Nenhuma variação nova para publicar');
      return;
    }

    // Carregar copy
    const copiesPath = path.join(BASE_DIR, 'output', 'criativos', adsMap.ciclo, 'copies', `ciclo-${adsMap.ciclo}.json`);
    const { copies } = await fs.readJson(copiesPath);

    for (const imgFile of novas) {
      try {
        const imgPath = path.join(cicloDir, imgFile);
        const imageHash = await meta.uploadImagem(imgPath);
        const copy = copies[angulo]?.feed || {};

        const creative = await meta.criarCreativeImagem(
          `Variação ${angulo} — ${imgFile}`,
          imageHash,
          copy,
          'https://predict-vibe-pro.lovable.app/'
        );

        const ad = await meta.criarAd(
          adSet.id,
          creative.id,
          `Ad Variação ${angulo} — ${imgFile}`
        );

        adsMap.ads.push({
          id: ad.id,
          adSetId: adSet.id,
          creativeId: creative.id,
          angulo,
          tipo: 'imagem',
          arquivo: imgFile,
        });

        log.info(`Variação publicada: ${imgFile}`);
      } catch (error) {
        log.error(`Falha ao publicar variação ${imgFile}: ${error.message}`);
      }
    }

    // Atualizar mapa
    await fs.writeJson(adsMapPath, adsMap, { spaces: 2 });
    log.info(`${novas.length} variações publicadas para ${angulo}`);
  } catch (error) {
    log.error(`Erro ao publicar variações: ${error.message}`);
    throw error;
  }
}

export default {
  publishLatest,
  publishVariacoes,
};
