const puppeteer = require('puppeteer');
const path = require('path');

const pages = [
  { name: 'home', path: '/#/' },
  { name: 'planos', path: '/#/planos' },
  { name: 'sobre', path: '/#/sobre' },
  { name: 'artigos', path: '/#/artigos' },
  { name: 'ferramentas', path: '/#/ferramentas' }
];

const downloadsDir = 'C:\\Users\\soare\\Downloads';

(async () => {
  console.log('Iniciando o navegador para tirar prints (com abas novas por página)...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    for (const p of pages) {
      // Abre uma aba NOVA e LIMPA para cada página para garantir o carregamento do zero!
      const page = await browser.newPage();
      await page.setViewport({ width: 1920, height: 1080 });

      const url = `http://localhost:5173${p.path}`;
      console.log(`Acessando aba limpa para: ${url}`);
      
      try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      } catch (err) {
        console.warn(`Aviso de carregamento de rede para ${p.name}, continuando...`);
      }

      // Remover o Splash Screen de loading e overlays
      await page.evaluate(() => {
        document.querySelectorAll('div').forEach(el => {
          if (el.style.zIndex === '9999' || el.style.zIndex === '99999' || el.style.position === 'fixed' && el.style.inset === '0px') {
            el.remove();
          }
        });
        // Garante que o overflow do body permita rolagem completa para o print fullPage
        document.body.style.overflow = 'visible';
        document.documentElement.style.overflow = 'visible';
      });

      // Aguarda 5 segundos para que as rotas lazy-loaded, imagens e animações carreguem completamente
      await new Promise(resolve => setTimeout(resolve, 5000));

      const screenshotPath = path.join(downloadsDir, `mariana_site_${p.name}.png`);
      console.log(`Tirando print de página inteira para: ${screenshotPath}`);
      
      await page.screenshot({
        path: screenshotPath,
        fullPage: true
      });
      
      console.log(`✓ Print de ${p.name} salvo com sucesso!`);
      
      // Fecha a aba atual para liberar memória
      await page.close();
    }

  } catch (error) {
    console.error('Erro durante a captura de tela:', error);
  } finally {
    await browser.close();
    console.log('Navegador fechado. Processo concluído.');
  }
})();
