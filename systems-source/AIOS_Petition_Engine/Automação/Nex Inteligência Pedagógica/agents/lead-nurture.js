/**
 * Agente 4 — Lead Nurture
 *
 * Recebe leads via webhook, gera relatórios personalizados
 * e executa sequência de nutrição por email e WhatsApp.
 *
 * Fluxo:
 * 1. POST /webhook/lead → recebe dados do diagnóstico
 * 2. Claude API gera relatório personalizado (Framework Peirceano)
 * 3. Brevo envia relatório por email
 * 4. Evolution API dispara sequência WhatsApp:
 *    - Hora 0: boas-vindas + link relatório
 *    - Dia 1: aprofundamento no maior risco
 *    - Dia 2: convite consultoria
 *    - Dia 4: prova social
 *    - Dia 7: urgência real (calendário escolar)
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import reportPrompts from '../prompts/report-prompts.js';
import brevo from '../utils/brevo-api.js';
import evolution from '../utils/evolution-api.js';
import { createAgentLogger } from '../utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_DIR = path.resolve(__dirname, '..');
const LEADS_PATH = path.join(BASE_DIR, 'data', 'leads.json');
const log = createAgentLogger('LEAD-NURTURE');

let claude = null;

function getClaude() {
  if (!claude) {
    claude = new Anthropic();
  }
  return claude;
}

async function callClaude(prompt) {
  const client = getClaude();
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });
  return response.content[0]?.text || '';
}

// ============================================================
// GESTÃO DE LEADS
// ============================================================

async function carregarLeads() {
  try {
    if (await fs.pathExists(LEADS_PATH)) {
      return await fs.readJson(LEADS_PATH);
    }
    return [];
  } catch {
    return [];
  }
}

async function salvarLeads(leads) {
  await fs.ensureDir(path.dirname(LEADS_PATH));
  await fs.writeJson(LEADS_PATH, leads, { spaces: 2 });
}

async function adicionarLead(lead) {
  const leads = await carregarLeads();

  const existente = leads.findIndex(l => l.email === lead.email);
  if (existente >= 0) {
    leads[existente] = { ...leads[existente], ...lead, atualizadoEm: new Date().toISOString() };
    log.info('Lead atualizado', { email: lead.email });
  } else {
    leads.push({
      ...lead,
      id: `lead-${Date.now()}`,
      criadoEm: new Date().toISOString(),
      status: 'novo',
      sequencia: {
        boasVindas: false,
        aprofundamento: false,
        conviteConsultoria: false,
        provaSocial: false,
        urgencia: false,
      },
    });
    log.info('Novo lead adicionado', { email: lead.email });
  }

  await salvarLeads(leads);
  return leads.find(l => l.email === lead.email);
}

// ============================================================
// PROCESSAMENTO DE LEAD
// ============================================================

/**
 * Processa um novo lead: gera relatório + inicia sequência.
 */
async function processarNovoLead(leadData) {
  log.info('Processando novo lead...', { nome: leadData.nome, email: leadData.email });

  try {
    // 1. Salvar lead
    const lead = await adicionarLead(leadData);

    // 2. Criar contato no Brevo
    try {
      await brevo.criarContato(lead);
    } catch (error) {
      log.warn(`Erro ao criar contato Brevo: ${error.message}`);
    }

    // 3. Gerar relatório personalizado via Claude
    log.info('Gerando relatório personalizado...');
    const promptRelatorio = reportPrompts.gerarPromptRelatorio(lead);
    const relatorioHtml = await callClaude(promptRelatorio);

    // Salvar relatório
    lead.relatorio = relatorioHtml;
    lead.status = 'relatorio_gerado';
    await atualizarLead(lead);

    // 4. Enviar relatório por email
    log.info('Enviando relatório por email...');
    try {
      await brevo.enviarRelatorio(lead, relatorioHtml);
      lead.status = 'relatorio_enviado';
      await atualizarLead(lead);
    } catch (error) {
      log.error(`Erro ao enviar email: ${error.message}`);
    }

    // 5. Enviar boas-vindas WhatsApp (Hora 0)
    if (lead.whatsapp) {
      await enviarMensagemSequencia(lead, 'boasVindas', 0);
    }

    // 6. Agendar sequência restante
    agendarSequencia(lead);

    log.info('Lead processado com sucesso', { email: lead.email });
    return lead;
  } catch (error) {
    log.error(`Erro ao processar lead: ${error.message}`, { email: leadData.email });
    throw error;
  }
}

// ============================================================
// SEQUÊNCIA DE NUTRIÇÃO
// ============================================================

async function enviarMensagemSequencia(lead, etapa, delayMs = 0) {
  if (delayMs > 0) {
    setTimeout(() => enviarMensagemSequencia(lead, etapa, 0), delayMs);
    return;
  }

  try {
    // Recarregar lead para verificar estado atual
    const leads = await carregarLeads();
    const leadAtual = leads.find(l => l.email === lead.email);

    if (!leadAtual || leadAtual.sequencia?.[etapa]) {
      log.debug(`Etapa ${etapa} já enviada ou lead removido`);
      return;
    }

    // Gerar mensagem via Claude
    const promptsNutricao = reportPrompts.gerarPromptsNutricao({
      nome: leadAtual.nome,
      escola: leadAtual.escola,
      relatorio: leadAtual.relatorio,
    });

    const prompt = promptsNutricao[etapa];
    if (!prompt) {
      log.error(`Prompt não encontrado para etapa: ${etapa}`);
      return;
    }

    const mensagem = await callClaude(prompt);

    // Enviar via WhatsApp
    await evolution.enviarMensagem(leadAtual.whatsapp, mensagem);

    // Marcar como enviada
    leadAtual.sequencia[etapa] = new Date().toISOString();
    await atualizarLead(leadAtual);

    log.info(`Sequência ${etapa} enviada`, { lead: leadAtual.email });
  } catch (error) {
    log.error(`Erro na sequência ${etapa}: ${error.message}`, { lead: lead.email });
  }
}

function agendarSequencia(lead) {
  if (!lead.whatsapp) {
    log.warn('Lead sem WhatsApp — sequência apenas por email', { email: lead.email });
    return;
  }

  const delays = {
    aprofundamento: 24 * 60 * 60 * 1000,      // Dia 1
    conviteConsultoria: 2 * 24 * 60 * 60 * 1000, // Dia 2
    provaSocial: 4 * 24 * 60 * 60 * 1000,       // Dia 4
    urgencia: 7 * 24 * 60 * 60 * 1000,           // Dia 7
  };

  for (const [etapa, delay] of Object.entries(delays)) {
    enviarMensagemSequencia(lead, etapa, delay);
  }

  log.info('Sequência agendada', {
    lead: lead.email,
    etapas: Object.keys(delays).length,
  });
}

// ============================================================
// UTILITÁRIOS
// ============================================================

async function atualizarLead(lead) {
  const leads = await carregarLeads();
  const index = leads.findIndex(l => l.email === lead.email);
  if (index >= 0) {
    leads[index] = { ...leads[index], ...lead, atualizadoEm: new Date().toISOString() };
    await salvarLeads(leads);
  }
}

/**
 * Processa leads pendentes (sequências agendadas que precisam ser retomadas após restart).
 */
async function retomarSequencias() {
  const leads = await carregarLeads();
  const agora = Date.now();

  for (const lead of leads) {
    if (!lead.whatsapp || !lead.sequencia) continue;

    const criadoEm = new Date(lead.criadoEm).getTime();
    const delays = {
      aprofundamento: 24 * 60 * 60 * 1000,
      conviteConsultoria: 2 * 24 * 60 * 60 * 1000,
      provaSocial: 4 * 24 * 60 * 60 * 1000,
      urgencia: 7 * 24 * 60 * 60 * 1000,
    };

    for (const [etapa, delay] of Object.entries(delays)) {
      if (!lead.sequencia[etapa]) {
        const tempoAgendado = criadoEm + delay;
        if (agora >= tempoAgendado) {
          // Já deveria ter sido enviado — enviar agora
          log.info(`Retomando sequência ${etapa} para ${lead.email}`);
          await enviarMensagemSequencia(lead, etapa, 0);
        } else {
          // Reagendar
          const restante = tempoAgendado - agora;
          enviarMensagemSequencia(lead, etapa, restante);
        }
      }
    }
  }
}

export default {
  processarNovoLead,
  retomarSequencias,
  carregarLeads,
};
