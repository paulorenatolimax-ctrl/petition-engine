/**
 * Webhook Server — Express na porta 3000
 *
 * Endpoints:
 * - POST /webhook/lead — recebe leads do diagnóstico
 * - GET /health — health check
 * - GET /leads — lista leads (protegido)
 */

import express from 'express';
import leadNurture from '../agents/lead-nurture.js';
import { createAgentLogger } from '../utils/logger.js';

const log = createAgentLogger('WEBHOOK');

function createServer() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logging
  app.use((req, _res, next) => {
    log.debug(`${req.method} ${req.path}`, {
      ip: req.ip,
      contentType: req.headers['content-type'],
    });
    next();
  });

  // ============================================================
  // HEALTH CHECK
  // ============================================================

  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'Nex Inteligência Pedagógica — Marketing Automation',
      timestamp: new Date().toISOString(),
    });
  });

  // ============================================================
  // WEBHOOK DE LEAD
  // ============================================================

  app.post('/webhook/lead', async (req, res) => {
    try {
      const { nome, email, escola, whatsapp, respostas } = req.body;

      // Validação
      if (!nome || !email) {
        return res.status(400).json({
          error: 'Campos obrigatórios: nome, email',
        });
      }

      log.info('Lead recebido via webhook', { nome, email, escola });

      // Processar lead (async — não bloqueia a resposta)
      const leadData = {
        nome,
        email,
        escola: escola || '',
        whatsapp: whatsapp || '',
        respostas: respostas || {},
        origem: 'webhook',
      };

      // Responde imediatamente
      res.status(200).json({
        success: true,
        message: 'Lead recebido. Processamento iniciado.',
      });

      // Processa em background
      leadNurture.processarNovoLead(leadData).catch(error => {
        log.error(`Erro no processamento do lead: ${error.message}`, { email });
      });
    } catch (error) {
      log.error(`Erro no webhook: ${error.message}`);
      res.status(500).json({ error: 'Erro interno' });
    }
  });

  // ============================================================
  // LISTAR LEADS (apenas para debug/admin)
  // ============================================================

  app.get('/leads', async (_req, res) => {
    try {
      const leads = await leadNurture.carregarLeads();
      res.json({
        total: leads.length,
        leads: leads.map(l => ({
          id: l.id,
          nome: l.nome,
          email: l.email,
          escola: l.escola,
          status: l.status,
          criadoEm: l.criadoEm,
          sequencia: l.sequencia,
        })),
      });
    } catch (error) {
      log.error(`Erro ao listar leads: ${error.message}`);
      res.status(500).json({ error: 'Erro interno' });
    }
  });

  // ============================================================
  // 404
  // ============================================================

  app.use((_req, res) => {
    res.status(404).json({ error: 'Endpoint não encontrado' });
  });

  // Error handler
  app.use((error, _req, res, _next) => {
    log.error(`Erro não tratado: ${error.message}`);
    res.status(500).json({ error: 'Erro interno do servidor' });
  });

  return app;
}

function startServer() {
  const app = createServer();
  const port = parseInt(process.env.PORT || '3000', 10);

  app.listen(port, () => {
    log.info(`Webhook server rodando na porta ${port}`);
    log.info('Endpoints:');
    log.info(`  POST http://localhost:${port}/webhook/lead`);
    log.info(`  GET  http://localhost:${port}/health`);
    log.info(`  GET  http://localhost:${port}/leads`);
  });

  return app;
}

export { createServer, startServer };
export default { createServer, startServer };
