/**
 * Agente 1 — Creative Director
 *
 * Gera criativos completos (copy + imagem + vídeo) usando:
 * - Claude API para copy (Framework Peirceano)
 * - Gemini API para imagens (Imagen)
 * - Gemini Veo API para vídeos
 *
 * Ciclo: análise Peirceana → 3 ângulos de copy → imagens → vídeos
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import peirce from '../prompts/peirce-framework.js';
import copyPrompts from '../prompts/copy-prompts.js';
import imagePrompts from '../prompts/image-prompts.js';
import videoPrompts from '../prompts/video-prompts.js';
import gemini from '../utils/gemini-api.js';
import { createAgentLogger } from '../utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_DIR = path.resolve(__dirname, '..');
const log = createAgentLogger('CREATIVE-DIRECTOR');

let claude = null;

function getClaude() {
  if (!claude) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY não configurada no .env');
    }
    claude = new Anthropic();
  }
  return claude;
}

/**
 * Chama a Claude API com um prompt e retorna a resposta.
 */
async function callClaude(prompt, jsonMode = true) {
  const client = getClaude();

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0]?.text || '';

  if (jsonMode) {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Claude não retornou JSON válido');
  }

  return text;
}

/**
 * Executa um ciclo completo de criação de criativos.
 */
async function runCycle() {
  const hoje = new Date().toISOString().split('T')[0];
  const outputDir = path.join(BASE_DIR, 'output', 'criativos', hoje);

  log.info(`Iniciando ciclo de criativos: ${hoje}`);

  try {
    // ============================================================
    // FASE 1: Análise Peirceana via Claude
    // ============================================================
    log.info('Fase 1: Executando análise Peirceana...');
    const promptAnalise = peirce.gerarPromptAnalisePeirceana();
    const mapaSemiotico = await callClaude(promptAnalise);
    mapaSemiotico.ciclo = hoje;

    log.info('Mapa semiótico gerado', {
      emocao: mapaSemiotico.emocaoDominante?.emocao,
      urgencia: mapaSemiotico.gatilhoTemporal?.gatilho,
    });

    // ============================================================
    // FASE 2: Gerar copy para os 3 ângulos
    // ============================================================
    log.info('Fase 2: Gerando copies para 3 ângulos...');
    const prompts = copyPrompts.gerarPromptsCopy(mapaSemiotico);

    const copies = {};
    for (const [angulo, prompt] of Object.entries(prompts)) {
      log.info(`Gerando copy: ${angulo}...`);
      copies[angulo] = await callClaude(prompt);
    }

    // Salvar copies
    const copiesDir = path.join(outputDir, 'copies');
    await fs.ensureDir(copiesDir);
    await fs.writeJson(
      path.join(copiesDir, `ciclo-${hoje}.json`),
      { mapaSemiotico, copies },
      { spaces: 2 }
    );
    log.info('Copies salvas');

    // ============================================================
    // FASE 3: Gerar imagens para cada ângulo (3 variações)
    // ============================================================
    log.info('Fase 3: Gerando imagens...');
    const imagensDir = path.join(outputDir, 'imagens');
    await fs.ensureDir(imagensDir);

    const angulos = ['risco', 'autoridade', 'oferta'];
    const imagensGeradas = [];

    for (let i = 0; i < angulos.length; i++) {
      const angulo = angulos[i];
      const copy = copies[angulo]?.feed || {};

      for (let v = 1; v <= 3; v++) {
        const promptImg = imagePrompts.gerarPromptImagem(angulo, copy, 'feed');
        const outputPath = path.join(imagensDir, `angulo-${i + 1}-v${v}.png`);

        try {
          await gemini.gerarImagem(promptImg, outputPath);
          imagensGeradas.push(outputPath);
          log.info(`Imagem gerada: angulo-${i + 1}-v${v}.png`);
        } catch (error) {
          log.error(`Falha ao gerar imagem angulo-${i + 1}-v${v}: ${error.message}`);
        }
      }
    }

    // ============================================================
    // FASE 4: Gerar vídeos para cada ângulo
    // ============================================================
    log.info('Fase 4: Gerando vídeos...');
    const videosDir = path.join(outputDir, 'videos');
    await fs.ensureDir(videosDir);

    const videosGerados = [];

    for (let i = 0; i < angulos.length; i++) {
      const angulo = angulos[i];

      try {
        // Gerar roteiro via Claude
        log.info(`Gerando roteiro de vídeo: ${angulo}...`);
        const promptRoteiro = videoPrompts.gerarPromptRoteiro(angulo, mapaSemiotico);
        const roteiro = await callClaude(promptRoteiro);

        // Salvar roteiro
        await fs.writeJson(
          path.join(videosDir, `roteiro-angulo-${i + 1}.json`),
          roteiro,
          { spaces: 2 }
        );

        // Gerar vídeo via Gemini Veo
        log.info(`Gerando vídeo: ${angulo}...`);
        const promptVeo = videoPrompts.gerarPromptVeo(roteiro, angulo);
        const videoPath = path.join(videosDir, `angulo-${i + 1}.mp4`);
        await gemini.gerarVideo(promptVeo, videoPath);
        videosGerados.push(videoPath);
        log.info(`Vídeo gerado: angulo-${i + 1}.mp4`);
      } catch (error) {
        log.error(`Falha ao gerar vídeo angulo-${i + 1}: ${error.message}`);
      }
    }

    // ============================================================
    // RESUMO DO CICLO
    // ============================================================
    const resumo = {
      ciclo: hoje,
      mapaSemiotico,
      copies: Object.keys(copies),
      imagensGeradas: imagensGeradas.length,
      videosGerados: videosGerados.length,
      outputDir,
    };

    await fs.writeJson(
      path.join(outputDir, 'resumo-ciclo.json'),
      resumo,
      { spaces: 2 }
    );

    log.info('Ciclo completo!', {
      copies: 3,
      imagens: imagensGeradas.length,
      videos: videosGerados.length,
    });

    return resumo;
  } catch (error) {
    log.error(`Erro no ciclo de criativos: ${error.message}`);
    throw error;
  }
}

/**
 * Gera variações extras de um ângulo específico (disparado pelo Performance Analyst).
 */
async function gerarVariacoes(angulo, quantidade = 3) {
  const hoje = new Date().toISOString().split('T')[0];
  const outputDir = path.join(BASE_DIR, 'output', 'criativos', hoje);

  log.info(`Gerando ${quantidade} variações extras para ângulo: ${angulo}`);

  try {
    // Carregar mapa semiótico existente ou gerar novo
    const copiesPath = path.join(outputDir, 'copies', `ciclo-${hoje}.json`);
    let mapaSemiotico;

    if (await fs.pathExists(copiesPath)) {
      const dados = await fs.readJson(copiesPath);
      mapaSemiotico = dados.mapaSemiotico;
    } else {
      const promptAnalise = peirce.gerarPromptAnalisePeirceana();
      mapaSemiotico = await callClaude(promptAnalise);
    }

    // Gerar nova copy
    const prompts = copyPrompts.gerarPromptsCopy(mapaSemiotico);
    const copy = await callClaude(prompts[angulo]);

    // Gerar imagens variadas
    const imagensDir = path.join(outputDir, 'imagens');
    await fs.ensureDir(imagensDir);

    const existentes = await fs.readdir(imagensDir);
    const anguloNum = angulo === 'risco' ? 1 : angulo === 'autoridade' ? 2 : 3;
    const maxV = existentes
      .filter(f => f.startsWith(`angulo-${anguloNum}-v`))
      .length;

    for (let v = 1; v <= quantidade; v++) {
      const promptImg = imagePrompts.gerarPromptImagem(angulo, copy.feed || {}, 'feed');
      const outputPath = path.join(imagensDir, `angulo-${anguloNum}-v${maxV + v}.png`);

      try {
        await gemini.gerarImagem(promptImg, outputPath);
        log.info(`Variação gerada: angulo-${anguloNum}-v${maxV + v}.png`);
      } catch (error) {
        log.error(`Falha na variação: ${error.message}`);
      }
    }

    return { angulo, variacoes: quantidade };
  } catch (error) {
    log.error(`Erro ao gerar variações: ${error.message}`);
    throw error;
  }
}

export default {
  runCycle,
  gerarVariacoes,
};
