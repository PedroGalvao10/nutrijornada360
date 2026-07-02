const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.error('BROWSER ERROR:', err.message));

  console.log('Acessando planos...');
  await page.goto('http://localhost:5173/#/planos', { waitUntil: 'networkidle2' });

  console.log('Aguardando 4 segundos...');
  await new Promise(resolve => setTimeout(resolve, 4000));

  const html = await page.evaluate(() => document.body.innerHTML);
  console.log('HTML Renderizado (primeiros 1000 caracteres):');
  console.log(html.substring(0, 1000));

  await browser.close();
})();
