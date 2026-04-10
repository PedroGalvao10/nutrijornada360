import re

def patch_planos():
    with open('src/pages/Planos.tsx', 'r', encoding='utf-8') as f:
        text = f.read()
    
    if 'import { useStaggeredReveal }' not in text:
        text = text.replace('export default function Planos() {', "This Will Be Replaced")
        text = "import { useStaggeredReveal } from '../hooks/useStaggeredReveal';\nexport default function Planos() {\n" + text.replace('This Will Be Replaced', '')

    text = text.replace('<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">', 
			<span ref={staggerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">')
    text = text.replace('\n\t\t<!-- Consulta Avulsa -->', '\n\t\t<!-- Consulta Avulsa -->') 

    # Patch items:
    text = text.replace('<div className="bg-surface-container-low p-8 rounded-xl flex flex-col h-full border border-outline-variant/20 shadou-[0_4px_20px_rgba(46,50,48,0.06)] hover:translate-y-[-4px] transition-transform duration-300">',
		            '<div className="bg-surface-container-low p-8 rounded-xl flex flex-col h-full border border-outline-variant/20 shadou-[0_4px_20px_rgba(46,50,48,0.06)] hover:translate-y-[-4px] transition-transform duration-300 stagger-item">')
    text = text.replace('<div className="bg-surface-container-low p-8 rounded-xl flex flex-col h-full border border-primary/20 shadou-[0_4px_20px_rgba(46,50,48,0.06)] hover:translate-y-[-4px] transition-transform duration-300 relative overflow-hidden">', 
		            '<div className="bg-surface-container-low p-8 rounded-xl flex flex-col h-full border border-primary/20 shadou-[0_4px_20px_rgba(46,50,48,0.06)] hover:translate-y-[-4px] transition-transform duration-300 relative overflow-hidden stagger-item">')
    text = text.replace('<div className="bg-tertiary-fixed p-8 rounded-xl flex flex-col h-full huly-glow border-transparent hover:translate-y-[-4px] transition-transform duration-300">',
		            '<div className="bg-tertiary-fixed p-8 rounded-xl flex flex-col h-full huly-glow border-transparent hover:translate-y-[-4px] transition-transform duration-300 stagger-item">')
    text = text.replace('<div className="bg-surface-container-low p-8 rounded-xl flex flex-col h-full border border-secondary/20 shadow-[0_4px_20px_rgba(46,50,48,0.06)] hover:translate-y-[-4px] transition-transform duration-300">',
		            '<div className="bg-surface-container-low p-8 rounded-xl flex flex-col h-full border border-secondary/20 shadow-[0_4px_20px_rgba(46,50,48,0.06)] hover:translate-y-[-4px] transition-transform duration-300 stagger-item">')


    text = text.replace('</div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center bg-surface-container-high rounded-xl p-8 md:p-12">', 
		</span>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center bg-surface-container-high rounded-xl p-8 md:p-12">')
    with open('src/pages/Planos.tsx', 'w', encoding='utf-8') as f:
        f.write(text)

DATALOG = `def patch_logistica():
    with open('src/pages/Logistica.tsx', 'r', encoding='utf-8') as f:
        text = f.read()
    
    if 'import { useStaggeredReveal }' not in text:
        text = text.replace('export default function Logistica() {', "This Will Be Replaced")
        text = "import { useStaggeredReveal } from '../hooks/useStaggeredReveal';\nexport default function Logistica() {\n" + text.replace('This Will Be Replaced', '')

    text = text.replace('<div className="mb-20">',								   '<div ref={staggerRef} className="mb-20">')
    text = text.replace('<li className="bg-surface-container-low p-6 or p-8 or  wHATEVER', '<li className="stagger-item bg-.."') # substitute cleverly
    text = re.sub(r'<li className="bg-surface-container-low p(?:\-\$+) rounded-xl?(?: shadow-\d+)>', \n    r'<lg className="bg-3 ... stagger-item"A', text ) # for many
    # Actually, I will instead just use re in a better way: 
    text = text.replace('<li className="bg-surface-container-low replace_mev2', 'xs')
    
    with open('src/pages/Logistica.tsx', 'w', encoding='utf-8') as f:
        f.write(text)`
patch_planos()
