/**
 * Nex Inteligência Pedagógica — Marketing Automation System
 *
 * Orquestrador principal que inicializa todos os agentes:
 * 1. Creative Director — gera criativos (copy + imagem + vídeo)
 * 2. Media Buyer — publica no Meta Ads
 * 3. Performance Analyst — otimiza campanhas (cron diário)
 * 4. Lead Nurture — webhook + sequência de nutrição
 *
 * Uso:
 *   npm start              → Inicia sistema completo
 *   npm run creative       → Gera criativos manualmente
 *   npm run publish-ads    → Publica criativos no Meta
 *   npm run analyze        → Executa análise de performance
 */

import 'dotenv/config';
import { startServer } from './webhooks/server.js';
import scheduler from './crons/scheduler.js';
import leadNurture from './agents/lead-nurture.js';
import { createAgentLogger } from './utils/logger.js';

const log = createAgentLogger('SYSTEM');

async function main() {
  log.info('═══════════════════════════════════════════════════');
  log.info('  Nex Inteligência Pedagógica — Marketing Automation');
  log.info('═══════════════════════════════════════════════════');

  // Verificar variáveis de ambiente essenciais
  const requiredVars = ['ANTHROPIC_API_KEY'];
  const missing = requiredVars.filter(v => !process.env[v]);

  if (missing.length > 0) {
    log.error(`Variáveis de ambiente obrigatórias faltando: ${missing.join(', ')}`);
    log.error('Configure o arquivo .env baseado no .env.example');
    process.exit(1);
  }

  // Verificar variáveis opcionais e alertar
  const optionalVars = {
    GEMINI_API_KEY: 'Geração de imagens e vídeos',
    META_ACCESS_TOKEN: 'Publicação no Meta Ads',
    BREVO_API_KEY: 'Envio de emails',
    EVOLUTION_API_URL: 'WhatsApp automation',
  };

  for (const [key, desc] of Object.entries(optionalVars)) {
    if (!process.env[key]) {
      log.warn(`${key} não configurada — ${desc} desabilitado`);
    }
  }

  // ============================================================
  // 1. Iniciar webhook server (Lead Nurture)
  // ============================================================
  log.info('Iniciando webhook server...');
  startServer();

  // ============================================================
  // 2. Retomar sequências pendentes
  // ============================================================
  log.info('Retomando sequências de nutrição pendentes...');
  try {
    await leadNurture.retomarSequencias();
  } catch (error) {
    log.warn(`Erro ao retomar sequências: ${error.message}`);
  }

  // ============================================================
  // 3. Iniciar scheduler (Performance Analyst + Creative Director)
  // ============================================================
  log.info('Iniciando scheduler...');
  scheduler.startScheduler();

  // ============================================================
  // PRONTO
  // ============================================================
  log.info('');
  log.info('Sistema ativo! Componentes:');
  log.info(`  Webhook:    http://localhost:${process.env.PORT || 3000}/webhook/lead`);
  log.info('  Health:     http://localhost:' + (process.env.PORT || 3000) + '/health');
  log.info('  Cron:       Performance Analyst — diário 08:00 BRT');
  log.info('  Cron:       Creative Director — segunda 06:00 BRT');
  log.info('');
  log.info('Comandos manuais:');
  log.info('  npm run creative     → Gerar criativos agora');
  log.info('  npm run publish-ads  → Publicar no Meta Ads');
  log.info('  npm run analyze      → Analisar performance');
  log.info('');

  // Graceful shutdown
  process.on('SIGINT', () => {
    log.info('Encerrando sistema...');
    scheduler.stopScheduler();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    log.info('Encerrando sistema...');
    scheduler.stopScheduler();
    process.exit(0);
  });
}

main().catch(error => {
  log.error(`Erro fatal: ${error.message}`);
  process.exit(1);
});
