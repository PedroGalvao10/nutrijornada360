const fs = require('fs');
try {
  let css = fs.readFileSync('src/index.css', 'utf8');
  if(!css.includes('.huly-glow')) {
    css += '\n.huly-glow { box-shadow: 0 0 0 4px rgba(74, 124, 89, 0.15), 0 0 30px rgba(74, 124, 89, 0.30) !important; border-color: rgba(74, 124, 89, 0.4) !important; transition: all 0.4s ease; }\n';
    fs.writeFileSync('src/index.css', css);
  }

  let sobre = fs.readFileSync('src/pages/Sobre.tsx', 'utf8');
  sobre = sobre.split('aspect-[4/5] bg-surface-container-highest rounded-2xl overflow-hidden shadow-xl').join('aspect-[4/5] bg-surface-container-highest rounded-2xl overflow-hidden huly-glow');
  sobre = sobre.split('w-full md:w-64 aspect-square rounded-lg overflow-hidden shrink-0').join('w-full md:w-64 aspect-square rounded-lg overflow-hidden shrink-0 huly-glow');
  fs.writeFileSync('src/pages/Sobre.tsx', sobre);

  let planos = fs.readFileSync('src/pages/Planos.tsx', 'utf8');
  planos = planos.split('border border-tertiary/20 shadow-[0_10px_30px_rgba(112,92,48,0.12)]').join('huly-glow');
  fs.writeFileSync('src/pages/Planos.tsx', planos);

  let home = fs.readFileSync('src/pages/Home.tsx', 'utf8');
  home = home.split('shadow-[0_12px_40px_rgba(30,40,30,0.5)]').join('huly-glow');
  fs.writeFileSync('src/pages/Home.tsx', home);

  console.log('HULY_OK');
} catch (e) {
  console.log(e);
}