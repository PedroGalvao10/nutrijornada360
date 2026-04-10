const fs = require('fs');

try {
  let home = fs.readFileSync('src/pages/Home.tsx', 'utf8');
  home = home.split('bg-[#4a5f4a]/60 backdrop-blur-[32px] border border-[#748c74]/40 rounded-[2.25rem] p-8 md:p-10 hover:bg-[#4a5f4a]/80 hover:border-[#8aa88a]/50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col seed-fade-up transform md:-translate-y-6 relative overflow-hidden delay-[200ms]').join('bg-[#4a5f4a]/60 backdrop-blur-[32px] border border-[#748c74]/40 rounded-[2.25rem] p-8 md:p-10 hover:bg-[#4a5f4a]/80 hover:border-[#8aa88a]/50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col seed-fade-up transform md:-translate-y-6 relative overflow-hidden huly-glow delay-[200ms]');
  fs.writeFileSync('src/pages/Home.tsx', home);

  let sobre = fs.readFileSync('src/pages/Sobre.tsx', 'utf8');
  sobre = sobre.split('aspect-[4/5] bg-surface-container-highest rounded-2xl overflow-hidden shadow-xl').join('aspect-[4/5] bg-surface-container-highest rounded-2xl overflow-hidden huly-glow');
  sobre = sobre.split('w-full md:w-64 aspect-square rounded-lg overflow-hidden shrink-0').join('w-full md:w-64 aspect-square rounded-[1.5rem] overflow-hidden shrink-0 huly-glow');
  fs.writeFileSync('src/pages/Sobre.tsx', sobre);

  let planos = fs.readFileSync('src/pages/Planos.tsx', 'utf8');
  planos = planos.split('border border-tertiary/20 shadow-[0_10px_30px_rgba(112,92,48,0.12)]').join('huly-glow border-transparent');
  fs.writeFileSync('src/pages/Planos.tsx', planos);

  console.log('JS_DONE');
} catch (e) {
  console.log('ERR:', e);
}
