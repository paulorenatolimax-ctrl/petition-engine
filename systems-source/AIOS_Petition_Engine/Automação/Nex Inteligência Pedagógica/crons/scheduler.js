/**
 * Scheduler — Cron jobs do sistema
 *
 * Jobs agendados:
 * - 08:00 diário: Performance Analyst analisa métricas
 * - Segunda 06:00: Creative Director gera novo ciclo semanal
 */

import cron from 'node-cron';
import performanceAnalyst from '../agents/performance-analyst.js';
import creativeDirector from '../agents/creative-director.js';
import mediaBuyer from '../agents/media-buyer.js';
import { createAgentLogger } from '../utils/logger.js';

const log = createAgentLogger('SCHEDULER');

let jobs = [];

function startScheduler() {
  log.info('Iniciando scheduler...');

  // ============================================================
  // JOB 1: Análise de performance — todo dia às 08:00
  // ============================================================
  const performanceJob = cron.schedule('0 8 * * *', async () => {
    log.info('Executando análise de performance diária...');
    try {
      await performanceAnalyst.analyze();
      log.info('Análise de performance concluída');
    } catch (error) {
      log.error(`Erro na análise de performance: ${error.message}`);
    }
  }, {
    timezone: 'America/Sao_Paulo',
  });

  jobs.push(performanceJob);
  log.info('Job agendado: Performance Analyst — diário às 08:00 (BRT)');

  // ============================================================
  // JOB 2: Ciclo criativo semanal — segunda às 06:00
  // ============================================================
  const creativeJob = cron.schedule('0 6 * * 1', async () => {
    log.info('Executando ciclo criativo semanal...');
    try {
      const resumo = await creativeDirector.runCycle();
      log.info('Ciclo criativo concluído', resumo);

      // Publicar automaticamente
      log.info('Publicando criativos no Meta Ads...');
      await mediaBuyer.publishLatest();
      log.info('Publicação concluída');
    } catch (error) {
      log.error(`Erro no ciclo criativo: ${error.message}`);
    }
  }, {
    timezone: 'America/Sao_Paulo',
  });

  jobs.push(creativeJob);
  log.info('Job agendado: Creative Director — segunda às 06:00 (BRT)');

  log.info(`Scheduler ativo: ${jobs.length} jobs agendados`);
}

function stopScheduler() {
  for (const job of jobs) {
    job.stop();
  }
  jobs = [];
  log.info('Scheduler parado');
}

export default {
  startScheduler,
  stopScheduler,
};
