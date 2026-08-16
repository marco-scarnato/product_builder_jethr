import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

async function runAudit() {
  console.log('Avvio Chrome per audit Lighthouse...');
  const chrome = await chromeLauncher.launch({
    chromeFlags: [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--ignore-certificate-errors',
      '--allow-insecure-localhost',
      '--disable-extensions',
      '--disable-features=SafeBrowsing,OptimizationHints,Translate,MediaRouter,LookalikeUrlNavigationSuggestionsUI,IsolateOrigins,site-per-process',
      '--safebrowsing-disable-auto-update',
      '--safebrowsing-disable-download-protection',
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
    console.log(`Esecuzione audit su http://127.0.0.1:4173/ (Porta Chrome: ${chrome.port})...`);
    const runnerResult = await lighthouse('http://127.0.0.1:4173/', options);

    const report = runnerResult.lhr;
    if (report.runtimeError) {
      console.error('Runtime error in Lighthouse:', report.runtimeError);
    }
    const scores = {
      Performance: Math.round((report.categories?.performance?.score || 0) * 100),
      Accessibility: Math.round((report.categories?.accessibility?.score || 0) * 100),
      'Best Practices': Math.round((report.categories?.['best-practices']?.score || 0) * 100),
      SEO: Math.round((report.categories?.seo?.score || 0) * 100),
    };

    console.log('\n=========================================');
    console.log('📊 RISULTATI LIGHTHOUSE AUDIT:');
    console.log('=========================================');
    console.log(`⚡ Performance:    ${scores.Performance}/100`);
    console.log(`♿ Accessibility:  ${scores.Accessibility}/100`);
    console.log(`🛡️ Best Practices: ${scores['Best Practices']}/100`);
    console.log(`🔍 SEO:            ${scores.SEO}/100`);
    console.log('=========================================\n');

    const colorContrastAudit = report.audits['color-contrast'];
    if (colorContrastAudit && colorContrastAudit.details?.items) {
      console.log('\nDettaglio elementi con contrasto insufficiente:');
      colorContrastAudit.details.items.forEach((item) => {
        console.log(` - Selettore: ${item.node?.selector} (Testo: "${item.node?.snippet}")`);
      });
    }

  } catch (error) {
    console.error('Errore durante l\'audit Lighthouse:', error);
  } finally {
    await chrome.kill();
  }
}

runAudit();
