/**
 * Gemini API Wrapper — Geração de imagens e vídeos
 *
 * Usa @google/generative-ai para imagens e a REST API para Veo (vídeos).
 * A lib npm expõe GoogleGenerativeAI para text/multimodal.
 * Para Imagen e Veo, usamos chamadas REST diretas.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import { createAgentLogger } from './logger.js';

const log = createAgentLogger('GEMINI');

let client = null;

function getClient() {
  if (!client) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY não configurada no .env');
    }
    client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return client;
}

function getApiKey() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY não configurada no .env');
  }
  return process.env.GEMINI_API_KEY;
}

/**
 * Gera uma imagem usando Gemini 2.0 Flash (multimodal com imagem).
 */
async function gerarImagem(prompt, outputPath) {
  try {
    log.info('Gerando imagem...', { outputPath });

    const ai = getClient();
    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: `Generate an image: ${prompt}` }] }],
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    const response = result.response;
    const parts = response.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find(p => p.inlineData?.mimeType?.startsWith('image/'));

    if (imagePart) {
      await fs.ensureDir(path.dirname(outputPath));
      const buffer = Buffer.from(imagePart.inlineData.data, 'base64');
      await fs.writeFile(outputPath, buffer);
      log.info('Imagem salva', { outputPath, size: buffer.length });
      return outputPath;
    }

    log.warn('Gemini Flash não retornou imagem, tentando Imagen 3 via REST...');
    return await gerarImagemImagen3(prompt, outputPath);
  } catch (error) {
    log.error(`Erro ao gerar imagem via Flash: ${error.message}`);
    // Fallback para Imagen 3
    try {
      return await gerarImagemImagen3(prompt, outputPath);
    } catch (fallbackError) {
      log.error(`Fallback Imagen 3 também falhou: ${fallbackError.message}`);
      throw error;
    }
  }
}

/**
 * Fallback: gera imagem usando Imagen 3 via REST API.
 */
async function gerarImagemImagen3(prompt, outputPath) {
  try {
    const apiKey = getApiKey();
    const aspectRatio = outputPath.includes('stories') ? '9:16' : '1:1';

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`,
      {
        instances: [{ prompt }],
        parameters: {
          sampleCount: 1,
          aspectRatio,
        },
      },
      { timeout: 120000 }
    );

    const predictions = response.data?.predictions;
    if (predictions?.[0]?.bytesBase64Encoded) {
      await fs.ensureDir(path.dirname(outputPath));
      const buffer = Buffer.from(predictions[0].bytesBase64Encoded, 'base64');
      await fs.writeFile(outputPath, buffer);
      log.info('Imagem (Imagen 3) salva', { outputPath });
      return outputPath;
    }

    throw new Error('Imagen 3 não retornou dados de imagem');
  } catch (error) {
    log.error(`Erro Imagen 3: ${error.message}`);
    throw error;
  }
}

/**
 * Gera um vídeo usando Gemini Veo via REST API.
 */
async function gerarVideo(prompt, outputPath) {
  try {
    log.info('Gerando vídeo via Veo...', { outputPath });

    const apiKey = getApiKey();

    // Iniciar geração
    const startResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/veo-2.0-generate-001:predictLongRunning?key=${apiKey}`,
      {
        instances: [{ prompt }],
        parameters: {
          aspectRatio: '9:16',
          durationSeconds: 15,
          sampleCount: 1,
        },
      },
      { timeout: 30000 }
    );

    const operationName = startResponse.data?.name;
    if (!operationName) {
      throw new Error('Veo não retornou operação');
    }

    // Polling para esperar o vídeo ficar pronto
    let done = false;
    let result = null;
    let attempts = 0;
    const maxAttempts = 60; // 10 min máximo

    while (!done && attempts < maxAttempts) {
      attempts++;
      log.debug(`Vídeo em processamento... (tentativa ${attempts}/${maxAttempts})`);
      await new Promise(resolve => setTimeout(resolve, 10000));

      const pollResponse = await axios.get(
        `https://generativelanguage.googleapis.com/v1beta/${operationName}?key=${apiKey}`,
        { timeout: 15000 }
      );

      if (pollResponse.data?.done) {
        done = true;
        result = pollResponse.data;
      }
    }

    if (!done) {
      throw new Error('Timeout: vídeo não ficou pronto em 10 minutos');
    }

    // Extrair vídeo
    const videoData = result?.response?.predictions?.[0];

    if (videoData?.bytesBase64Encoded) {
      await fs.ensureDir(path.dirname(outputPath));
      const buffer = Buffer.from(videoData.bytesBase64Encoded, 'base64');
      await fs.writeFile(outputPath, buffer);
      log.info('Vídeo salvo', { outputPath, size: buffer.length });
      return outputPath;
    }

    if (videoData?.videoUri) {
      const videoResponse = await axios.get(videoData.videoUri, {
        responseType: 'arraybuffer',
        timeout: 120000,
      });
      await fs.ensureDir(path.dirname(outputPath));
      await fs.writeFile(outputPath, Buffer.from(videoResponse.data));
      log.info('Vídeo salvo', { outputPath, size: videoResponse.data.length });
      return outputPath;
    }

    throw new Error('Veo não retornou dados de vídeo utilizáveis');
  } catch (error) {
    log.error(`Erro ao gerar vídeo: ${error.message}`);
    throw error;
  }
}

export default {
  gerarImagem,
  gerarVideo,
};
