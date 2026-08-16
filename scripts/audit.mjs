/**
 * scripts/audit.mjs
 *
 * Script self-contained per l'esecuzione del Lighthouse Audit.
 *
 * Workflow automatico:
 *   1. Esegue "npm run build" per generare/aggiornare il bundle in dist/
 *   2. Avvia "vite preview" su 127.0.0.1:4173 come server temporaneo
 *   3. Lancia Lighthouse su Chrome headless e stampa i risultati
 *   4. Spegne il server preview e chiude Chrome
 *
 * Uso: npm run audit
 */

import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { execSync, spawn } from 'child_process';

const PREVIEW_PORT = 4173;
const PREVIEW_URL = `http://127.0.0.1:${PREVIEW_PORT}/`;

/** Pausa in millisecondi */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Avvia il server vite preview e attende che sia pronto */
async function startPreviewServer() {
  console.log('🔨 Esecuzione build di produzione...');
  try {
    execSync('npm run build', { stdio: 'pipe' });
    console.log('✅ Build completata.\n');
  } catch (err) {
    console.error('❌ Build fallita. Output:', err.stderr?.toString());
    process.exit(1);
  }

  console.log(`🖥️  Avvio server preview su ${PREVIEW_URL}...`);
  const server = spawn(
    'npx',
    ['vite', 'preview', '--host', '127.0.0.1', '--port', String(PREVIEW_PORT)],
    { stdio: 'ignore', shell: true }
  );

  server.on('error', (err) => {
    console.error('❌ Errore avvio server preview:', err);
    process.exit(1);
  });

  // Attende 3 secondi per garantire che il server sia pronto (robusto su tutti i SO)
  await sleep(3000);
  console.log('✅ Server preview pronto.\n');
  return server;
}

async function runAudit() {
  let previewServer = null;

  try {
    previewServer = await startPreviewServer();

    console.log('🚀 Avvio Chrome per audit Lighthouse...');
    const chrome = await chromeLauncher.launch({
      chromeFlags: [
        '--headless=new',
        '--no-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--ignore-certificate-errors',
        '--allow-insecure-localhost',
        '--disable-extensions',
        '--disable-features=SafeBrowsing,OptimizationHints,Translate,MediaRouter',
        '--safebrowsing-disable-auto-update',
        '--disable-client-side-phishing-detection',
        '--no-first-run',
        '--no-default-browser-check',
        '--disable-background-networking',
        '--disable-default-apps',
        '--disable-sync',
      ],
    });

    const options = {
      logLevel: 'error',
      output: 'json',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      port: chrome.port,
      settings: {
        maxWaitForFcp: 30000,
        maxWaitForLoad: 45000,
        formFactor: 'desktop',
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false,
        },
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0,
        },
      },
    };

    try {
      console.log(`🔍 Esecuzione audit su ${PREVIEW_URL} (Porta Chrome: ${chrome.port})...\n`);
      const runnerResult = await lighthouse(PREVIEW_URL, options);
      const report = runnerResult.lhr;

      if (report.runtimeError) {
        console.error('❌ Runtime error in Lighthouse:', report.runtimeError);
      }

      const scores = {
        Performance: Math.round((report.categories?.performance?.score || 0) * 100),
        Accessibility: Math.round((report.categories?.accessibility?.score || 0) * 100),
        'Best Practices': Math.round((report.categories?.['best-practices']?.score || 0) * 100),
        SEO: Math.round((report.categories?.seo?.score || 0) * 100),
      };

      console.log('=========================================');
      console.log('📊 RISULTATI LIGHTHOUSE AUDIT:');
      console.log('=========================================');
      console.log(`⚡ Performance:    ${scores.Performance}/100`);
      console.log(`♿ Accessibility:  ${scores.Accessibility}/100`);
      console.log(`🛡️ Best Practices: ${scores['Best Practices']}/100`);
      console.log(`🔍 SEO:            ${scores.SEO}/100`);
      console.log('=========================================\n');

      // Audit specifici con margine di miglioramento
      const failedAudits = Object.values(report.audits)
        .filter((a) => a.score !== null && a.score < 1 && a.scoreDisplayMode !== 'notApplicable' && a.scoreDisplayMode !== 'informative')
        .sort((a, b) => a.score - b.score)
        .slice(0, 10);

      if (failedAudits.length > 0) {
        console.log('⚠️  Audit con margine di miglioramento:');
        failedAudits.forEach((a) => {
          const scoreDisplay = a.score !== null ? `${Math.round(a.score * 100)}/100` : 'N/A';
          console.log(`   - [${a.id}] ${a.title} (Score: ${scoreDisplay})`);
        });
        console.log('');
      }

      // Dettaglio elementi con contrasto insufficiente (accessibility)
      const colorContrastAudit = report.audits['color-contrast'];
      if (colorContrastAudit?.details?.items?.length > 0) {
        console.log('🎨 Elementi con contrasto colore insufficiente:');
        colorContrastAudit.details.items.forEach((item) => {
          console.log(`   - ${item.node?.selector}`);
        });
        console.log('');
      }
    } finally {
      await chrome.kill();
    }
  } finally {
    if (previewServer) {
      previewServer.kill();
      console.log('🛑 Server preview spento.');
    }
  }
}

runAudit().catch((err) => {
  console.error('Errore fatale durante l\'audit:', err);
  process.exit(1);
});
