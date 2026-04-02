#!/usr/bin/env node
/**
 * SaaS Screenshot Capturer — Petition Engine
 *
 * Takes a Lovable deploy URL, discovers all routes,
 * screenshots each page, and generates a markdown document
 * with all screenshots embedded.
 *
 * Usage: node scripts/capture_saas.js <url> <output_dir> [client_name]
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

// Common SaaS routes to try
const COMMON_ROUTES = [
  '/',
  '/dashboard',
  '/login',
  '/signup',
  '/register',
  '/pricing',
  '/about',
  '/features',
  '/settings',
  '/profile',
  '/analytics',
  '/reports',
  '/clients',
  '/projects',
  '/services',
  '/contact',
  '/faq',
  '/help',
  '/admin',
  '/marketplace',
  '/portfolio',
  '/blog',
  '/testimonials',
  '/team',
  '/solutions',
  '/products',
  '/integrations',
  '/resources',
  '/onboarding',
  '/plans',
  '/billing',
  '/notifications',
  '/calendar',
  '/tasks',
  '/overview',
  '/home',
];

async function main() {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`  SaaS Screenshot Capturer — Petition Engine`);
  console.log(`${'='.repeat(60)}`);
  console.log(`  URL: ${BASE_URL}`);
  console.log(`  Output: ${OUTPUT_DIR}`);
  console.log(`  Client: ${CLIENT_NAME}`);
  console.log(`${'='.repeat(60)}\n`);

  // Create output directories
  const screenshotsDir = path.join(OUTPUT_DIR, 'screenshots');
  fs.mkdirSync(screenshotsDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2, // Retina quality
  });

  const page = await context.newPage();

  // Phase 1: Load the main page and discover routes from the DOM
  console.log('Phase 1: Discovering routes...');

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
  } catch (e) {
    console.log('  Warning: networkidle timeout, continuing with domcontentloaded...');
    try {
      await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 15000 });
    } catch {
      console.error('  ERROR: Could not load the page. Check the URL.');
      await browser.close();
      process.exit(1);
    }
  }

  // Wait for React to render
  await page.waitForTimeout(3000);

  // Extract all internal links from the page
  const discoveredRoutes = await page.evaluate((baseUrl) => {
    const links = new Set();
    const origin = new URL(baseUrl).origin;

    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (!href) return;

      // Internal links
      if (href.startsWith('/') && !href.startsWith('//')) {
        links.add(href.split('?')[0].split('#')[0]);
      }
      // Same-origin absolute links
      if (href.startsWith(origin)) {
        const pathname = new URL(href).pathname;
        links.add(pathname.split('?')[0].split('#')[0]);
      }
    });

    // Also check React Router / navigation elements
    document.querySelectorAll('[data-href], [to]').forEach(el => {
      const href = el.getAttribute('data-href') || el.getAttribute('to');
      if (href && href.startsWith('/')) {
        links.add(href.split('?')[0].split('#')[0]);
      }
    });

    // Check sidebar/nav links
    document.querySelectorAll('nav a, aside a, [role="navigation"] a').forEach(a => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('/')) {
        links.add(href.split('?')[0].split('#')[0]);
      }
    });

    return Array.from(links).filter(l => l && l !== '/' && l.length > 1);
  }, BASE_URL);

  // Combine discovered + common routes, deduplicate
  const allRoutes = ['/', ...new Set([...discoveredRoutes, ...COMMON_ROUTES])];
  console.log(`  Found ${discoveredRoutes.length} routes in DOM + ${COMMON_ROUTES.length} common routes to try`);

  // Phase 2: Screenshot each route
  console.log('\nPhase 2: Capturing screenshots...');

  const captured = [];
  const failed = [];

  for (const route of allRoutes) {
    const url = `${BASE_URL.replace(/\/$/, '')}${route}`;
    const fileName = route === '/'
      ? 'landing.png'
      : route.replace(/^\//, '').replace(/\//g, '_') + '.png';
    const filePath = path.join(screenshotsDir, fileName);

    try {
      const response = await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 10000
      });

      // Check if page returned a valid response (not 404)
      if (!response || response.status() >= 400) {
        continue; // Skip silently — common routes that don't exist
      }

      // Wait for content to render
      await page.waitForTimeout(2000);

      // Check if the page has actual content (not just a redirect to /)
      const pageContent = await page.evaluate(() => {
        const body = document.body;
        return {
          text: body?.innerText?.length || 0,
          children: body?.children?.length || 0,
          title: document.title,
        };
      });

      // Skip if page seems empty or is just a redirect
      if (pageContent.text < 50) continue;

      // Check if this page looks different from landing (avoid duplicates)
      const currentUrl = page.url();
      const currentPath = new URL(currentUrl).pathname;

      // Take full-page screenshot
      await page.screenshot({
        path: filePath,
        fullPage: true,
        type: 'png',
      });

      const stats = fs.statSync(filePath);
      const sizeKB = Math.round(stats.size / 1024);

      console.log(`  ✓ ${route.padEnd(25)} → ${fileName} (${sizeKB}KB)`);

      captured.push({
        route,
        fileName,
        filePath,
        sizeKB,
        title: pageContent.title,
        actualPath: currentPath,
      });

    } catch {
      // Silently skip routes that don't exist or timeout
      continue;
    }
  }

  // Phase 3: Remove fake pages (< 100KB = probably 404/redirect) and dedup
  console.log('\nPhase 3: Filtering fake pages & deduplicating...');
  const unique = [];
  const seenSizes = new Set();

  for (const cap of captured) {
    // Filter out fake pages (redirects to 404 or empty pages)
    if (cap.sizeKB < 100 && cap.route !== '/') {
      try { fs.unlinkSync(cap.filePath); } catch {}
      console.log(`  ✗ Removed fake page: ${cap.route} (${cap.sizeKB}KB — likely 404/redirect)`);
      continue;
    }

    // Dedup by file size + actual path
    const sizeKey = Math.round(cap.sizeKB / 5) * 5;
    const routeKey = `${sizeKey}_${cap.actualPath}`;

    if (!seenSizes.has(routeKey)) {
      seenSizes.add(routeKey);
      unique.push(cap);
    } else {
      try { fs.unlinkSync(cap.filePath); } catch {}
      console.log(`  ✗ Removed duplicate: ${cap.route} (same as existing)`);
    }
  }

  console.log(`  ${unique.length} unique pages captured`);

  // Phase 4: Generate markdown document
  console.log('\nPhase 4: Generating markdown...');

  const mdLines = [
    `# SaaS Evidence — ${CLIENT_NAME}`,
    '',
    `**URL:** ${BASE_URL}`,
    `**Capturado em:** ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`,
    `**Total de páginas:** ${unique.length}`,
    '',
    '---',
    '',
  ];

  for (let i = 0; i < unique.length; i++) {
    const cap = unique[i];
    const pageNum = i + 1;
    const pageName = cap.route === '/'
      ? 'Landing Page'
      : cap.route.replace(/^\//, '').replace(/-/g, ' ').replace(/_/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase());

    mdLines.push(`## Página ${pageNum}: ${pageName}`);
    mdLines.push('');
    mdLines.push(`**Rota:** \`${cap.route}\``);
    if (cap.title) mdLines.push(`**Título:** ${cap.title}`);
    mdLines.push('');
    mdLines.push(`![${pageName}](screenshots/${cap.fileName})`);
    mdLines.push('');
    mdLines.push('---');
    mdLines.push('');
  }

  const mdPath = path.join(OUTPUT_DIR, `SaaS_Evidence_${CLIENT_NAME.replace(/\s+/g, '_')}.md`);
  fs.writeFileSync(mdPath, mdLines.join('\n'), 'utf-8');

  await browser.close();

  // Final report
  console.log(`\n${'='.repeat(60)}`);
  console.log(`  CAPTURA COMPLETA`);
  console.log(`${'='.repeat(60)}`);
  console.log(`  Páginas capturadas: ${unique.length}`);
  console.log(`  Screenshots em: ${screenshotsDir}`);
  console.log(`  Markdown em: ${mdPath}`);
  console.log(`  Tamanho total: ${unique.reduce((s, c) => s + c.sizeKB, 0)}KB`);
  console.log(`${'='.repeat(60)}\n`);
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
