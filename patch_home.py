import os

with open('src/pages/Home.tsx', 'r', encoding='utf-8') as f:
    hc = f.read()

# 1. Imports
if 'useStaggeredReveal' not in hc:
    hc = hc.replace(
        "import { Link } from 'react-router-dom';",
        "import { Link } from 'react-router-dom';\nimport { useStaggeredReveal } from '../hooks/useStaggeredReveal';\nimport { HulyTextHighlight } from '../components/HulyTextHighlight';"
    )

# 2. Hook usage
if 'const staggerRef = useStaggeredReveal' not in hc:
    hc = hc.replace(
        "export default function Home() {\nuseEffect(() => {",
        "export default function Home() {\n  const staggerRef = useStaggeredReveal(150);\nuseEffect(() => {"
    )

# 3. Hero Paragraph update
old_p = '<p className="text-xl md:text-2xl text-white/80 font-normal max-w-2xl leading-relaxed">\n              Modalidades de atendimento desenhadas para integrar a nutrição ao seu estilo de vida da forma mais orgânica possível.\n            </p>'
new_p = '<div className="text-xl md:text-2xl text-white/80 font-normal max-w-2xl leading-relaxed">\n              <HulyTextHighlight\n                text="Modalidades de atendimento desenhadas para integrar a nutrição ao seu estilo de vida da forma mais orgânica possível."\n                highlightWords="integrar a nutrição ao seu estilo de vida"\n              />\n            </div>'

hc = hc.replace(old_p, new_p)

# 4. grid grid-cols-1 md:grid-cols-3
old_grid = '<div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">'
new_grid = '<div ref={staggerRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">'
hc = hc.replace(old_grid, new_grid)

# 5. Cards Classes
old_c1 = 'group bg-white/[0.04] backdrop-blur-[20px] border border-white/[0.08] rounded-[2.25rem] p-8 md:p-10 hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col seed-fade-up transform md:-translate-y-6 relative overflow-hidden delay-[100ms]'
new_c1 = 'stagger-item group bg-white/[0.04] backdrop-blur-[20px] border border-white/[0.08] rounded-[2.25rem] p-8 md:p-10 hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col relative overflow-hidden'

old_c2 = 'group bg-[#4a5f4a]/60 backdrop-blur-[32px] border border-[#748c74]/40 rounded-[2.25rem] p-8 md:p-10 hover:bg-[#4a5f4a]/80 hover:border-[#8aa88a]/50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col seed-fade-up transform md:-translate-y-6 relative overflow-hidden delay-[200ms]'
new_c2 = 'stagger-item group bg-[#4a5f4a]/60 backdrop-blur-[32px] border border-[#748c74]/40 rounded-[2.25rem] p-8 md:p-10 hover:bg-[#4a5f4a]/80 hover:border-[#8aa88a]/50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col relative overflow-hidden'

old_c3 = 'group bg-white/[0.04] backdrop-blur-[20px] border border-white/[0.08] rounded-[2.25rem] p-8 md:p-10 hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col seed-fade-up transform md:-translate-y-6 relative overflow-hidden delay-[300ms]'
new_c3 = 'stagger-item group bg-white/[0.04] backdrop-blur-[20px] border border-white/[0.08] rounded-[2.25rem] p-8 md:p-10 hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col relative overflow-hidden'

hc = hc.replace(old_c1, new_c1)
hc = hc.replace(old_c2, new_c2)
hc = hc.replace(old_c3, new_c3)

with open('src/pages/Home.tsx', 'w', encoding='utf-8') as f:
    f.write(hc)
print('Home successfully patched!')