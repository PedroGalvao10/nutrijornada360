import os
import re

# PATCH PLANOS
with open('src/pages/Planos.tsx', 'r', encoding='utf-8') as f:
    pl_c = f.read()

if 'useStaggeredReveal' not in pl_c:
    pl_c = pl_c.replace(
        "import { Link } from 'react-router-dom';",
        "import { Link } from 'react-router-dom';\nimport { useStaggeredReveal } from '../hooks/useStaggeredReveal';"
    )

if 'const staggerRef = useStaggeredReveal' not in pl_c:
    pl_c = pl_c.replace(
        "export default function Planos() {\n",
        "export default function Planos() {\n  const staggerRef = useStaggeredReveal(150);\n"
    )

old_grid_pl = '<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">'
new_grid_pl = '<div ref={staggerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">'
pl_c = pl_c.replace(old_grid_pl, new_grid_pl)

# Add stagger-item to Planos cards
pl_c = pl_c.replace(
    'className="bg-white rounded-3xl p-8 border border-outline/10 shadow-sm hover:shadow-xl transition-shadow flex flex-col',
    'className="stagger-item bg-white rounded-3xl p-8 border border-outline/10 shadow-sm hover:shadow-xl transition-shadow flex flex-col'
)
pl_c = pl_c.replace(
    'className="bg-primary-container rounded-3xl p-8 border-2 border-primary/20 shadow-md hover:shadow-xl transition-shadow flex flex-col relative',
    'className="stagger-item bg-primary-container rounded-3xl p-8 border-2 border-primary/20 shadow-md hover:shadow-xl transition-shadow flex flex-col relative'
)

with open('src/pages/Planos.tsx', 'w', encoding='utf-8') as f:
    f.write(pl_c)

# PATCH LOGISTICA (AGENDAMENTO)
try:
    with open('src/pages/Logistica.tsx', 'r', encoding='utf-8') as f:
        log_c = f.read()

    if 'useStaggeredReveal' not in log_c:
        log_c = log_c.replace(
            "import { Link } from 'react-router-dom';",
            "import { Link } from 'react-router-dom';\nimport { useStaggeredReveal } from '../hooks/useStaggeredReveal';"
        )

    if 'const staggerRef = useStaggeredReveal' not in log_c:
        log_c = log_c.replace(
            "export default function Logistica() {\n",
            "export default function Logistica() {\n  const staggerRef = useStaggeredReveal(150);\n"
        )

    # Grid in Logistica for the steps
    old_l_grid = '<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">'
    new_l_grid = '<div ref={staggerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">'
    log_c = log_c.replace(old_l_grid, new_l_grid)
    
    # Grid in Logistica for the platform benefits
    old_b_grid = '<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">'
    new_b_grid = '<div ref={staggerRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">'
    log_c = log_c.replace(old_b_grid, new_b_grid) # reuse of staggerRef works if there's only one grid, wait! React useRef can only be attached to ONE element at a time! 
    # Let's create staggerRef2 just in case.
    if 'useStaggeredReveal(150)' in log_c:
        log_c = log_c.replace(
            "const staggerRef = useStaggeredReveal(150);",
            "const staggerRef = useStaggeredReveal(150);\n  const staggerRef2 = useStaggeredReveal(150);"
        )
        log_c = log_c.replace(
            '<div ref={staggerRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">',
            '<div ref={staggerRef2} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">'
        )
    else:
        log_c = log_c.replace(old_b_grid, new_b_grid.replace('staggerRef', 'staggerRef2'))

    log_c = log_c.replace(
        'className="bg-surface rounded-2xl p-6 shadow-sm border border-outline/10 text-center flex flex-col relative',
        'className="stagger-item bg-surface rounded-2xl p-6 shadow-sm border border-outline/10 text-center flex flex-col relative'
    )
    log_c = log_c.replace(
        'className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-outline/5 shadow-sm',
        'className="stagger-item flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-outline/5 shadow-sm'
    )

    with open('src/pages/Logistica.tsx', 'w', encoding='utf-8') as f:
        f.write(log_c)
except Exception as e:
    pass
