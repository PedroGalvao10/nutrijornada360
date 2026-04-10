import re
with open("src/index.css","r",encoding="utf8") as fi: css=fi.read()
css=re.sub(r"/[*] Huly[.]io solid ring.*?huly-glow [{][^}]*[}]","",css)
css=css.rstrip()
NL=chr(10)
Q=chr(34)
css+=NL*2+"/* Huly.io Animated Neon Border */"+NL
css+=chr(64)+"property --huly-angle {"+NL
css+="  syntax: "+Q+chr(60)+"angle"+chr(62)+Q+";"+NL
css+="  initial-value: 0deg;"+NL
css+="  inherits: false;"+NL
css+="}"+NL*2
css+=".huly-glow { position:relative; z-index:0; }"+NL*2
css+=".huly-glow::before {"+NL
css+="  content:"+Q+Q+"; position:absolute; inset:-4px; z-index:-1; border-radius:inherit;"+NL
css+="  background:conic-gradient(from var(--huly-angle),transparent 0%,rgba(74,130,80,0.6) 6%,rgba(130,210,140,1) 11%,rgba(74,130,80,0.6) 16%,transparent 22%,transparent 50%,rgba(74,130,80,0.4) 56%,rgba(110,190,120,0.8) 61%,rgba(74,130,80,0.4) 66%,transparent 72%,transparent 100%);"+NL
css+="  animation:huly-spin 4s linear infinite;"+NL
css+="}"+NL*2
css+=".huly-glow::after {"+NL
css+="  content:"+Q+Q+"; position:absolute; inset:-10px; z-index:-2; border-radius:inherit;"+NL
css+="  background:conic-gradient(from var(--huly-angle),transparent 0%,rgba(74,130,80,0.35) 8%,rgba(100,180,110,0.5) 12%,transparent 22%,transparent 50%,rgba(74,130,80,0.25) 58%,rgba(100,180,110,0.4) 62%,transparent 72%,transparent 100%);"+NL
css+="  filter:blur(14px);"+NL
css+="  animation:huly-spin 4s linear infinite;"+NL
css+="}"+NL*2
css+=chr(64)+"keyframes huly-spin { to { --huly-angle:360deg; } }"+NL
with open("src/index.css","w",encoding="utf8") as fi: fi.write(css)
print("CSS_OK")
s=open("src/pages/Sobre.tsx","r",encoding="utf8").read()
s=s.replace("rounded-2xl overflow-hidden huly-glow","rounded-2xl huly-glow")
s=s.replace("overflow-hidden shrink-0 huly-glow","shrink-0 huly-glow")
open("src/pages/Sobre.tsx","w",encoding="utf8").write(s)
print("SOBRE_OK")
h=open("src/pages/Home.tsx","r",encoding="utf8").read()
h=h.replace("relative overflow-hidden huly-glow","relative huly-glow")
open("src/pages/Home.tsx","w",encoding="utf8").write(h)
print("HOME_OK")