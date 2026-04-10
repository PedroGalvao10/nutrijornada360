import os
import re

def fix_planos():
    with open('src/pages/Planos.tsx', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Add import
    if 'import { useStaggeredReveal' not in content:
        content = "import { useStaggeredReveal } from '../hooks/useStaggeredReveal';\n" + content
    
    # 2. Add ref to the grid container
    content = content.replace(
        '<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">',
        '<div ref={staggerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">'
    )
    
    # 3. Add stagger-item to the cards
    # For Planos, all cards have 'transition-transform duration-300'
    content = re.sub(
        r'(bg-surface-container-low p-8 rounded-xl flex flex-col h-full(?:(?!stagger-item)-)*?duration-300( relative overflow-hidden)?)',
        r'\1 stagger-item',
        content
    )
    # The Transformacao 360 card has 'bg-tertiary-fixed ... duration-300'
    content = re.sub(
        r'(bg-tertiary-fixed p-8 rounded-xl flex flex-col h-full huly-glow(?:(?!stagger-item).)*?duration-300)',
        r'\1 stagger-item',
        content
    )
    
    with open('src/pages/Planos.tsx', 'w', encoding='utf-8') as f:
        f.write(content)

def fix_logistica():
    with open('src/pages/Logistica.tsx', 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'import { useStaggeredReveal' not in content:
        content = "import { useStaggeredReveal } from '../hooks/useStaggeredReveal';\n" + content
    
    # 1. Add ref to Etapas list
    content = content.replace(
        '<ol className="relative border-l border-primary/30 ml-3 md:ml-6 mb-20">',
        '<ol ref={staggerRef} className="relative border-l border-primary/30 ml-3 md:ml-6 mb-20">'
    )
    # 2. Add ref to Beneficios grid
    content = content.replace(
        '<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">',
        '<div ref={staggerRef2} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">'
    )
    
    # 3. Add stagger-item to Etapas
    content = re.sub(r'(<li className="mb-10 ml-6 md:ml-8)', r'\1 stagger-item', content)
    
    # 4. Add stagger-item to Beneficios
    content = re.sub(
        r'(<div className="bg-surface-container(}-low)? p-6 rounded-xl border border-outline-variant/10)',
        r'\1 stagger-item',
        content
    )

    with open('src/pages/Logistica.tsx', 'w', encoding='utf-8') as f:
        f.write(content)

fix_planos()
fix_logistica()