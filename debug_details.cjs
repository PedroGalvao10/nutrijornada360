const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  page.on('console', msg => console.log(`[CONSOLE ${msg.type()}]:`, msg.text()));
  page.on('pageerror', err => console.error('[JS ERROR]:', err.stack));

  console.log('Acessando http://localhost:5173/#/planos ...');
  await page.goto('http://localhost:5173/#/planos', { waitUntil: 'load' });

  console.log('Aguardando 2 segundos...');
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Tira print sem ser fullPage para ver o que aparece na tela
  const testPath = path.join('C:\\Users\\soare\\Downloads', 'debug_planos_viewport.png');
  await page.screenshot({ path: testPath });
  console.log(`✓ Print de teste da viewport salvo em: ${testPath}`);

  // Inspeciona se o elemento com ID root está vazio ou tem filhos
  const childrenCount = await page.evaluate(() => {
    const root = document.getElementById('root');
    return root ? root.children.length : -1;
  });
  console.log(`Número de filhos em #root: ${childrenCount}`);

  await browser.close();
})();
