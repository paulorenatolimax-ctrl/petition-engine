#!/usr/bin/env node
/**
 * SaaS Screenshot Capturer V2 — Petition Engine
 *
 * Captures numbered screenshots from a Lovable deploy URL.
 * Generates a mapping JSON for insertion into the DOCX.
 *
 * Usage: node scripts/capture_saas.js <url> <output_dir> [client_name]
 *
 * Output:
 *   screenshots/SaaS_01_Landing_Page.png
 *   screenshots/SaaS_02_Dashboard.png
 *   ...
 *   screenshot_map.json  — mapping for insert_saas_screenshots.py
 *   SaaS_Evidence_[Client].md — markdown with screenshots + descriptions
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = process.argv[2];
const OUTPUT_DIR = process.argv[3] || './screenshots';
const CLIENT_NAME = process.argv[4] || 'Cliente';

if (!BASE_URL) {
  console.error('Usage: node scripts/capture_saas.js <url> <output_dir> [client_name]');
  process.exit(1);
}

// Common SaaS routes to try (ordered by importance)
const COMMON_ROUTES = [
  '/', '/dashboard', '/login', '/signup', '/register',
  '/pricing', '/about', '/features', '/settings', '/profile',
  '/analytics', '/reports', '/clients', '/projects', '/services',
  '/contact', '/faq', '/help', '/admin', '/marketplace',
  '/portfolio', '/blog', '/testimonials', '/team', '/solutions',
  '/products', '/integrations', '/resources', '/onboarding',
  '/plans', '/billing', '/notifications', '/calendar', '/tasks',
  '/overview', '/home', '/modules', '/tools', '/workspace',
];

// Generate detailed description based on page content analysis
async function analyzePageContent(page) {
  return await page.evaluate(() => {
    const body = document.body;
    const title = document.title || '';

    // Count elements
    const cards = document.querySelectorAll('[class*="card"], [class*="Card"]').length;
    const tables = document.querySelectorAll('table').length;
    const charts = document.querySelectorAll('canvas, svg, [class*="chart"], [class*="Chart"], [class*="graph"]').length;
    const forms = document.querySelectorAll('form, input, select, textarea').length;
    const buttons = document.querySelectorAll('button, [role="button"]').length;
    const images = document.querySelectorAll('img').length;
    const metrics = document.querySelectorAll('[class*="metric"], [class*="kpi"], [class*="stat"], [class*="Stat"]').length;
    const nav = document.querySelectorAll('nav, aside, [class*="sidebar"], [class*="Sidebar"]').length;
    const headings = Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.textContent.trim()).filter(t => t.length > 0);

    // Get main heading
    const h1 = document.querySelector('h1');
    const mainHeading = h1 ? h1.textContent.trim() : '';

    // Get meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    const description = metaDesc ? metaDesc.getAttribute('content') : '';

    // Detect page type
    let pageType = 'content';
    if (forms > 3 || document.querySelector('[type="password"]')) pageType = 'auth';
    if (charts > 0 || metrics > 2 || cards > 3) pageType = 'dashboard';
    if (tables > 0 && cards < 3) pageType = 'data';
    if (document.querySelector('[class*="pricing"], [class*="Pricing"], [class*="plan"], [class*="Plan"]')) pageType = 'pricing';
    if (document.querySelector('[class*="hero"], [class*="Hero"]') || document.querySelector('[class*="landing"]')) pageType = 'landing';
    if (document.querySelector('[class*="setting"], [class*="Setting"], [class*="config"]')) pageType = 'settings';

    return {
      title,
      mainHeading,
      description,
      pageType,
      elements: { cards, tables, charts, forms, buttons, images, metrics, nav },
      headings: headings.slice(0, 5),
      textLength: body?.innerText?.length || 0,
      childCount: body?.children?.length || 0,
    };
  });
}

function generateDescription(analysis, route) {
  const e = analysis.elements;
  const parts = [];

  // Main description based on page type
  switch (analysis.pageType) {
    case 'landing':
      parts.push('Página principal do produto — apresentação da proposta de valor, funcionalidades e call-to-action para conversão');
      break;
    case 'dashboard':
      parts.push('Painel de controle principal — visão consolidada de indicadores-chave (KPIs), métricas operacionais e navegação rápida');
      break;
    case 'pricing':
      parts.push('Página de precificação — planos de assinatura com comparativo de funcionalidades por tier, demonstrando modelo de receita recorrente (SaaS)');
      break;
    case 'auth':
      parts.push('Tela de autenticação — interface de login/cadastro com campos de credenciais e fluxo de onboarding');
      break;
    case 'settings':
      parts.push('Painel de configurações — gerenciamento de perfil, preferências do sistema e integrações');
      break;
    case 'data':
      parts.push('Módulo de dados — tabelas interativas com informações operacionais, filtros e exportação');
      break;
    default:
      if (analysis.mainHeading) {
        parts.push(`Módulo: ${analysis.mainHeading}`);
      } else {
        const name = route.replace(/^\//, '').replace(/[-_/]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        parts.push(`Seção: ${name}`);
      }
  }

  // Element details
  const details = [];
  if (e.charts > 0) details.push(`${e.charts} gráfico(s) interativo(s)`);
  if (e.tables > 0) details.push(`${e.tables} tabela(s) de dados`);
  if (e.cards > 0) details.push(`${e.cards} card(s) informativos`);
  if (e.metrics > 0) details.push(`${e.metrics} indicador(es) numérico(s)`);
  if (e.forms > 2) details.push(`formulário(s) com ${e.forms} campos`);
  if (e.images > 2) details.push(`${e.images} elementos visuais`);

  if (details.length > 0) {
    parts.push(`Elementos visuais: ${details.join(', ')}`);
  }

  // Headings context
  if (analysis.headings.length > 1) {
    parts.push(`Seções visíveis: ${analysis.headings.slice(0, 3).join(' | ')}`);
  }

  return parts.join('. ') + '.';
}

async function main() {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`  SaaS Screenshot Capturer V2 — Petition Engine`);
  console.log(`${'='.repeat(60)}`);
  console.log(`  URL: ${BASE_URL}`);
  console.log(`  Output: ${OUTPUT_DIR}`);
  console.log(`  Client: ${CLIENT_NAME}`);
  console.log(`${'='.repeat(60)}\n`);

  const screenshotsDir = path.join(OUTPUT_DIR, 'screenshots');
  fs.mkdirSync(screenshotsDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  // Phase 1: Discover routes
  console.log('Phase 1: Discovering routes...');
  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
  } catch {
    try {
      await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 15000 });
    } catch {
      console.error('ERROR: Could not load page.');
      await browser.close();
      process.exit(1);
    }
  }
  await page.waitForTimeout(3000);

  const discoveredRoutes = await page.evaluate((baseUrl) => {
    const links = new Set();
    const origin = new URL(baseUrl).origin;
    document.querySelectorAll('a[href], [data-href], [to]').forEach(el => {
      const href = el.getAttribute('href') || el.getAttribute('data-href') || el.getAttribute('to');
      if (!href) return;
      if (href.startsWith('/') && !href.startsWith('//')) {
        links.add(href.split('?')[0].split('#')[0]);
      }
      if (href.startsWith(origin)) {
        links.add(new URL(href).pathname.split('?')[0].split('#')[0]);
      }
    });
    return Array.from(links).filter(l => l && l !== '/' && l.length > 1);
  }, BASE_URL);

  const allRoutes = ['/', ...new Set([...discoveredRoutes, ...COMMON_ROUTES])];
  console.log(`  Found ${discoveredRoutes.length} DOM routes + ${COMMON_ROUTES.length} common routes\n`);

  // Phase 2: Capture each route
  console.log('Phase 2: Capturing screenshots...');
  const captured = [];

  for (const route of allRoutes) {
    const url = `${BASE_URL.replace(/\/$/, '')}${route}`;

    try {
      const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });
      if (!response || response.status() >= 400) continue;
      await page.waitForTimeout(2000);

      const analysis = await analyzePageContent(page);
      if (analysis.textLength < 50) continue;

      // Generate numbered filename
      const pageNum = String(captured.length + 1).padStart(2, '0');
      const pageName = route === '/'
        ? 'Landing_Page'
        : route.replace(/^\//, '').replace(/\//g, '_').replace(/-/g, '_')
            .replace(/\b\w/g, l => l.toUpperCase());
      const fileName = `SaaS_${pageNum}_${pageName}.png`;
      const filePath = path.join(screenshotsDir, fileName);

      await page.screenshot({ path: filePath, fullPage: true, type: 'png' });

      const stats = fs.statSync(filePath);
      const sizeKB = Math.round(stats.size / 1024);

      // Skip fake pages (< 100KB and not landing)
      if (sizeKB < 100 && route !== '/') {
        try { fs.unlinkSync(filePath); } catch {}
        continue;
      }

      const description = generateDescription(analysis, route);
      const displayName = route === '/'
        ? 'Landing Page'
        : route.replace(/^\//, '').replace(/[-_]/g, ' ').replace(/\//g, ' — ')
            .replace(/\b\w/g, l => l.toUpperCase());

      console.log(`  ✓ SaaS_${pageNum} ${displayName.padEnd(30)} (${sizeKB}KB)`);

      captured.push({
        number: captured.length + 1,
        route,
        fileName,
        filePath,
        sizeKB,
        displayName,
        description,
        analysis,
        placeholder: `[SCREENSHOT_${pageNum} — ${displayName}]`,
      });

    } catch { continue; }
  }

  // Phase 3: Dedup
  console.log(`\nPhase 3: Deduplicating...`);
  const unique = [];
  const seenSizes = new Set();

  for (const cap of captured) {
    const sizeKey = Math.round(cap.sizeKB / 5) * 5;
    const routeKey = `${sizeKey}`;

    if (!seenSizes.has(routeKey)) {
      seenSizes.add(routeKey);
      unique.push(cap);
    } else {
      try { fs.unlinkSync(cap.filePath); } catch {}
      console.log(`  ✗ Removed duplicate: ${cap.displayName}`);
    }
  }

  // Renumber after dedup
  for (let i = 0; i < unique.length; i++) {
    const num = String(i + 1).padStart(2, '0');
    const oldFile = unique[i].fileName;
    const pageName = unique[i].route === '/'
      ? 'Landing_Page'
      : unique[i].route.replace(/^\//, '').replace(/\//g, '_').replace(/-/g, '_')
          .replace(/\b\w/g, l => l.toUpperCase());
    const newFile = `SaaS_${num}_${pageName}.png`;

    if (oldFile !== newFile) {
      const oldPath = path.join(screenshotsDir, oldFile);
      const newPath = path.join(screenshotsDir, newFile);
      try { fs.renameSync(oldPath, newPath); } catch {}
      unique[i].fileName = newFile;
      unique[i].filePath = newPath;
    }

    unique[i].number = i + 1;
    unique[i].placeholder = `[SCREENSHOT_${num} — ${unique[i].displayName}]`;
  }

  console.log(`  ${unique.length} unique pages\n`);

  // Phase 4: Generate screenshot_map.json (for insert_saas_screenshots.py)
  console.log('Phase 4: Generating screenshot_map.json...');
  const mapData = {
    url: BASE_URL,
    client: CLIENT_NAME,
    captured_at: new Date().toISOString(),
    total_pages: unique.length,
    pages: unique.map(u => ({
      number: u.number,
      placeholder: u.placeholder,
      file: u.fileName,
      route: u.route,
      display_name: u.displayName,
      description: u.description,
      size_kb: u.sizeKB,
    })),
  };
  const mapPath = path.join(OUTPUT_DIR, 'screenshot_map.json');
  fs.writeFileSync(mapPath, JSON.stringify(mapData, null, 2));
  console.log(`  Saved: ${mapPath}`);

  // Phase 5: Generate markdown
  console.log('Phase 5: Generating markdown...\n');
  const mdLines = [
    `# SaaS Evidence — Capturas de Tela do Produto`,
    `## ${CLIENT_NAME}`,
    '',
    `**URL de produção:** [${BASE_URL}](${BASE_URL})`,
    `**Data de captura:** ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`,
    `**Total de páginas:** ${unique.length}`,
    `**Resolução:** 1440×900 @ 2x (Retina)`,
    '',
    '---',
    '',
    '## Índice de Screenshots',
    '',
    ...unique.map(u => `${u.number}. **${u.displayName}** — \`${u.fileName}\``),
    '',
    '---',
    '',
  ];

  for (const u of unique) {
    const num = String(u.number).padStart(2, '0');
    mdLines.push(`## Screenshot ${num}: ${u.displayName}`);
    mdLines.push('');
    mdLines.push(`**Rota:** \`${u.route}\``);
    mdLines.push(`**Arquivo:** \`${u.fileName}\``);
    mdLines.push(`**Placeholder no DOCX:** \`${u.placeholder}\``);
    mdLines.push('');
    mdLines.push(`### Descrição`);
    mdLines.push('');
    mdLines.push(u.description);
    mdLines.push('');
    mdLines.push(`![${u.displayName}](screenshots/${u.fileName})`);
    mdLines.push('');
    mdLines.push('---');
    mdLines.push('');
  }

  const mdPath = path.join(OUTPUT_DIR, `SaaS_Evidence_${CLIENT_NAME.replace(/\s+/g, '_')}.md`);
  fs.writeFileSync(mdPath, mdLines.join('\n'));

  await browser.close();

  // Final report
  console.log(`${'='.repeat(60)}`);
  console.log(`  CAPTURA COMPLETA`);
  console.log(`${'='.repeat(60)}`);
  console.log(`  Páginas: ${unique.length}`);
  console.log(`  Screenshots: ${screenshotsDir}/`);
  console.log(`  Mapa: ${mapPath}`);
  console.log(`  Markdown: ${mdPath}`);
  console.log(`  Total: ${unique.reduce((s, c) => s + c.sizeKB, 0)}KB`);
  console.log('');
  console.log('  PLACEHOLDERS PARA O DOCX:');
  for (const u of unique) {
    console.log(`    ${u.placeholder}`);
  }
  console.log(`${'='.repeat(60)}\n`);
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
