const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const pages = [
  { name: 'home', path: '/' },
  { name: 'planos', path: '/planos' },
  { name: 'sobre', path: '/sobre' },
  { name: 'artigos', path: '/artigos' },
  { name: 'ferramentas', path: '/ferramentas' }
];

const downloadsDir = 'C:\\Users\\soare\\Downloads';

(async () => {
  console.log('Iniciando o navegador para tirar prints...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    // Definir viewport desktop padrão
    await page.setViewport({ width: 1920, height: 1080 });

    for (const p of pages) {
      const url = `http://localhost:5173${p.path}`;
      console.log(`Acessando: ${url}`);
      
      try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      } catch (err) {
        console.warn(`Aviso de carregamento de rede para ${p.name}, continuando mesmo assim...`);
      }

      // Remover o Splash Screen de loading imediatamente para não atrapalhar o print
      await page.evaluate(() => {
        // Encontra divs com z-index alto (9999)
        document.querySelectorAll('div').forEach(el => {
          if (el.style.zIndex === '9999' || el.style.zIndex === '99999' || el.style.position === 'fixed' && el.style.inset === '0px') {
            el.remove();
          }
        });
        // Desativar scrollbars ou animações se necessário
        document.body.style.overflow = 'visible';
      });

      // Aguarda mais 3 segundos para que as animações de carregamento (fade-in, framer motion) estabilizem
      await new Promise(resolve => setTimeout(resolve, 3000));

      const screenshotPath = path.join(downloadsDir, `mariana_site_${p.name}.png`);
      console.log(`Tirando print de página inteira para: ${screenshotPath}`);
      
      await page.screenshot({
        path: screenshotPath,
        fullPage: true
      });
      
      console.log(`✓ Print de ${p.name} salvo com sucesso!`);
    }

  } catch (error) {
    console.error('Erro durante a captura de tela:', error);
  } finally {
    await browser.close();
    console.log('Navegador fechado. Processo concluído.');
  }
})();
