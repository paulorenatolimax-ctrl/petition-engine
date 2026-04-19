/**
 * Agente 3 — Performance Analyst
 *
 * Analisa métricas dos anúncios via Meta API e toma decisões automatizadas:
 * - CTR < 0.8% por 3 dias → pausa anúncio
 * - CPL > 3x META_TARGET_CPL → pausa conjunto
 * - CTR > 2.5% → dispara Creative Director para variações
 * - Frequência > 3.5 → dispara ciclo completo novo
 *
 * Cron: todo dia 08h00
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import meta from '../utils/meta-api.js';
import evolution from '../utils/evolution-api.js';
import creativeDirector from './creative-director.js';
import mediaBuyer from './media-buyer.js';
import { createAgentLogger } from '../utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_DIR = path.resolve(__dirname, '..');
const log = createAgentLogger('PERFORMANCE');

// Thresholds
const THRESHOLDS = {
  CTR_MIN: 0.8,           // % — abaixo disso, pausa
  CTR_HIGH: 2.5,          // % — acima disso, gera variações
  CPL_MULTIPLIER: 3,      // x META_TARGET_CPL
  FREQUENCY_MAX: 3.5,     // acima disso, ciclo novo
  DAYS_LOW_CTR: 3,        // dias consecutivos com CTR baixo
};

/**
 * Executa a análise diária de performance.
 */
async function analyze() {
  const hoje = new Date().toISOString().split('T')[0];
  log.info(`Análise de performance: ${hoje}`);

  try {
    // Carregar mapa de ads
    const adsMapPath = path.join(BASE_DIR, 'output', 'meta', 'ads-map.json');
    if (!await fs.pathExists(adsMapPath)) {
      log.warn('ads-map.json não encontrado. Nenhum ad publicado ainda.');
      return;
    }

    const adsMap = await fs.readJson(adsMapPath);
    const targetCpl = parseInt(process.env.META_TARGET_CPL || '5000', 10);

    const relatorio = {
      data: hoje,
      campanhaId: adsMap.campanhaId,
      analises: [],
      acoes: [],
      resumo: { adsAtivos: 0, adsPausados: 0, variacoesGeradas: 0, cicloNovo: false },
    };

    // Analisar cada ad set
    for (const adSet of adsMap.adSets) {
      log.info(`Analisando ad set: ${adSet.nome}`);

      try {
        const metricas = await meta.obterMetricasAdSet(adSet.id, 'last_3d');

        if (!metricas.length) {
          log.debug(`Sem métricas para ${adSet.nome}`);
          continue;
        }

        const dados = metricas[0];
        const ctr = parseFloat(dados.ctr || '0');
        const cpc = parseFloat(dados.cpc || '0');
        const frequency = parseFloat(dados.frequency || '0');
        const impressions = parseInt(dados.impressions || '0', 10);
        const spend = parseFloat(dados.spend || '0');

        // Calcular CPL
        const leads = dados.actions?.find(a => a.action_type === 'lead')?.value || 0;
        const cpl = leads > 0 ? (spend * 100) / leads : 0; // em centavos

        const analise = {
          adSet: adSet.nome,
          angulo: adSet.angulo,
          metricas: { ctr, cpc, cpl, frequency, impressions, spend, leads },
          decisao: 'MANTER',
        };

        // REGRA 1: Frequência > 3.5 → ciclo completo novo
        if (frequency > THRESHOLDS.FREQUENCY_MAX) {
          log.warn(`Frequência alta (${frequency}) no ${adSet.nome} — disparando ciclo novo`);
          analise.decisao = 'CICLO_NOVO';
          relatorio.acoes.push({
            tipo: 'CICLO_NOVO',
            motivo: `Frequência ${frequency} > ${THRESHOLDS.FREQUENCY_MAX}`,
            adSet: adSet.nome,
          });
          relatorio.resumo.cicloNovo = true;
        }

        // REGRA 2: CPL > 3x target → pausa conjunto
        if (cpl > targetCpl * THRESHOLDS.CPL_MULTIPLIER && leads > 0) {
          log.warn(`CPL alto (R$${(cpl / 100).toFixed(2)}) no ${adSet.nome} — pausando`);
          await meta.pausarAdSet(adSet.id);
          analise.decisao = 'PAUSADO_CPL';
          relatorio.acoes.push({
            tipo: 'PAUSA_ADSET',
            motivo: `CPL R$${(cpl / 100).toFixed(2)} > ${THRESHOLDS.CPL_MULTIPLIER}x alvo (R$${(targetCpl / 100).toFixed(2)})`,
            adSet: adSet.nome,
          });
          relatorio.resumo.adsPausados++;
        }

        // Analisar ads individuais do ad set
        const adsDoSet = adsMap.ads.filter(a => a.adSetId === adSet.id);

        for (const ad of adsDoSet) {
          try {
            const adMetricas = await meta.obterMetricasAd(ad.id, 'last_3d');

            if (!adMetricas.length) continue;

            const adDados = adMetricas[0];
            const adCtr = parseFloat(adDados.ctr || '0');

            // REGRA 3: CTR < 0.8% por 3 dias → pausa anúncio
            if (adCtr < THRESHOLDS.CTR_MIN && impressions > 500) {
              log.warn(`CTR baixo (${adCtr}%) no ad ${ad.arquivo} — pausando`);
              await meta.pausarAd(ad.id);
              relatorio.acoes.push({
                tipo: 'PAUSA_AD',
                motivo: `CTR ${adCtr}% < ${THRESHOLDS.CTR_MIN}%`,
                ad: ad.arquivo,
              });
              relatorio.resumo.adsPausados++;
            }

            // REGRA 4: CTR > 2.5% → gerar variações
            if (adCtr > THRESHOLDS.CTR_HIGH) {
              log.info(`CTR excelente (${adCtr}%) no ad ${ad.arquivo} — gerando variações`);
              relatorio.acoes.push({
                tipo: 'VARIACAO',
                motivo: `CTR ${adCtr}% > ${THRESHOLDS.CTR_HIGH}%`,
                angulo: ad.angulo,
              });
              relatorio.resumo.variacoesGeradas += 3;
            }
          } catch (error) {
            log.error(`Erro ao analisar ad ${ad.id}: ${error.message}`);
          }
        }

        relatorio.analises.push(analise);
      } catch (error) {
        log.error(`Erro ao analisar ad set ${adSet.id}: ${error.message}`);
      }
    }

    // Executar ações
    if (relatorio.resumo.cicloNovo) {
      log.info('Disparando ciclo criativo completo...');
      try {
        await creativeDirector.runCycle();
        await mediaBuyer.publishLatest();
      } catch (error) {
        log.error(`Erro no ciclo novo: ${error.message}`);
      }
    }

    // Gerar variações para ângulos de alta performance
    const variacoes = relatorio.acoes
      .filter(a => a.tipo === 'VARIACAO')
      .map(a => a.angulo);
    const angulosUnicos = [...new Set(variacoes)];

    for (const angulo of angulosUnicos) {
      try {
        await creativeDirector.gerarVariacoes(angulo, 3);
        await mediaBuyer.publishVariacoes(angulo);
      } catch (error) {
        log.error(`Erro ao gerar variações ${angulo}: ${error.message}`);
      }
    }

    // Salvar relatório
    const relatoriosDir = path.join(BASE_DIR, 'output', 'relatorios');
    await fs.ensureDir(relatoriosDir);
    await fs.writeJson(
      path.join(relatoriosDir, `${hoje}.json`),
      relatorio,
      { spaces: 2 }
    );

    // Enviar resumo WhatsApp para Paulo
    await enviarResumoWhatsApp(relatorio);

    log.info('Análise completa', relatorio.resumo);
    return relatorio;
  } catch (error) {
    log.error(`Erro na análise: ${error.message}`);
    throw error;
  }
}

/**
 * Envia resumo diário por WhatsApp.
 */
async function enviarResumoWhatsApp(relatorio) {
  const pauloWhatsapp = process.env.PAULO_WHATSAPP;
  if (!pauloWhatsapp) {
    log.warn('PAULO_WHATSAPP não configurado — resumo não enviado');
    return;
  }

  try {
    const { resumo, acoes } = relatorio;
    const acoesTexto = acoes.length > 0
      ? acoes.map(a => `• ${a.tipo}: ${a.motivo}`).join('\n')
      : '• Nenhuma ação automática necessária';

    const mensagem = `📊 *Nex Ads — Relatório ${relatorio.data}*

Ads ativos: ${resumo.adsAtivos}
Ads pausados: ${resumo.adsPausados}
Variações geradas: ${resumo.variacoesGeradas}
${resumo.cicloNovo ? '🔄 Novo ciclo criativo disparado!' : ''}

*Ações automáticas:*
${acoesTexto}

_Relatório completo salvo em output/relatorios/_`;

    await evolution.enviarMensagem(pauloWhatsapp, mensagem);
    log.info('Resumo enviado para Paulo');
  } catch (error) {
    log.error(`Falha ao enviar resumo WhatsApp: ${error.message}`);
  }
}

export default {
  analyze,
};
