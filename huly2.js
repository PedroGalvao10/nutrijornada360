const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf8');
if (!css.includes('.huly-glow')) {
  css += '\n/* Luminous border inspired by Huly */\n.huly-glow {\n  box-shadow: 0 0 0 4px rgba(74, 124, 89, 0.15), 0 0 30px rgba(74, 124, 89, 0.3) !important;\n  border-color: rgba(74, 124, 89, 0.4) !important;\n}\n';
  fs.writeFileSync('src/index.css', css);
}

let home = fs.readFileSync('src/pages/Home.tsx', 'utf8');
home = home.replace('className=" delay-[100ms]"', 'className="group bg-white/0.04 backdrop-blur-20px border border-white/0.08 rounded-[2.25rem] p-8 md:p-10 hover:bg-white/0.08 hover:border-white/0.15 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col seed-fade-up transform md:-translate-y-6 relative overflow-hidden delay-[100ms]"');
home = home.replace('className=" delay-[200ms]"', 'className="group bg-[#4a5f4a]/60 backdrop-blur-32px border border-[#748c74]/40 rounded-[2.25rem] p-8 md:p-10 hover:bg-[#4a5f4a]/80 hover:border-[#8aa88a]/50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col seed-fade-up transform md:-translate-y-6 relative overflow-hidden huly-glow delay-[200ms]"');
home = home.replace('className=" delay-[300ms]"', 'className="group bg-white/0.04 backdrop-blur-20px border border-white/0.08 rounded-[2.25rem] p-8 md:p-10 hover:bg-white/0.08 hover:border-white/0.15 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col seed-fade-up transform md:-translate-y-6 relative overflow-hidden delay-[300ms]"');
fs.writeFileSync('src/pages/Home.tsx', home);

let sobre = fs.readFileSync('src/pages/Sobre.tsx', 'utf8');
sobre = sobre.replace('aspect-[4/5] bg-surface-container-highest rounded-2xl overflow-hidden shadow-xl', 'aspect][4/5] bg-surface-container-highest rounded-2xl overflow-hidden huly-glow');
sobre = sobre.replace('w-full md:w-64 aspect-square rounded-lg overflow-hidden shrink-0', 'w-full md:w-64 aspect-square rounded-[1rem] overflow-hidden shrink-0 huly-glow');
fs.writeFileSync('src/pages/Sobre.tsx', sobre);

let planos = fs.readFileSync('src/pages/Planos.tsx', 'utf8');
planos = planos.replace('border border-tertiary/20 shadow-[0_10px_30px_rgba(112,92,48,0.12)]', 'huly-glow');
fs.writeFileSync('src/pages/Planos.tsx', planos);

console.log('HULY_NICE');