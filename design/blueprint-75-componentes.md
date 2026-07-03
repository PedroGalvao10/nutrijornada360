# Blueprint — Curadoria dos 75 componentes 21st.dev → NutriJornada 360º

Mapeamento de arquitetura de UI. Cada componente tem **um lar primário**; reusos
estão anotados. Organizado por destino (página/seção), para ler como plano de
reconstrução, não como lista.

**Legenda de esforço:** `baixo` = plug-and-play ou só recolorir para a paleta
Editorial Orgânico · `médio` = trocar `next/image`→`img`, mock→API, recolorir
dark→light, remover 1 dependência · `alto` = trabalho pesado de WebGL/perf,
troca de biblioteca (three/Spline), reescrita funcional, ou conflito de marca que
exige redesenho.

**Regra de performance (sua):** no máx. **1 fundo animado pesado por tela**. Os
fundos WebGL escuros estão concentrados em contextos onde não competem com a
marca creme nem com a performance recuperada no redesign.

---

## 0. Orçamento de fundo animado (leia antes)

Fundos WebGL/three.js pesados (evitar empilhar): Horizon Hero, Woven Light Hero,
Flow Gradient Hero, Aether Hero, Animated Shader Hero, Web Gl Shader, Shader
Background, Animated Shader Background, Interactive Neural Vortex, Geometric Blur
Mesh, Smokey Cursor, Reveal Wave Image. **Nenhum deles vai para as páginas
editoriais (Home/Sobre/Planos/Artigos).** Vão para: splash único, área admin
(dark, 1 instância), landings de campanha (isoladas) e um momento "manifesto".

Fundos leves (canvas/CSS, recoloríveis para o creme, OK nas páginas): Background
Gradient Animation, Particles Bg, Particle Effect For Hero, Flow Field Background,
Ink Reveal, Cursor Driven Particles Typography, Neon Flow.

---

## 1. Sistema global — Navbar & Footer

| Componente | Função aqui | Esforço | Justificativa (1 frase) |
|---|---|---|---|
| **Tubelight Navbar** | Navbar principal desktop com indicador animado por rota | baixo | O "tubelight" recolorido para verde/ouro dá continuidade de marca à navegação sem peso. |
| **Navbar 1** | Navbar flutuante mobile (pill que aparece no scroll) | baixo | Resolve a navegação mobile com um objeto flutuante coerente com a linguagem "float" do design system. |
| **Motion Footer** | Footer global cinemático com reveal GSAP no fim de cada página | médio | Fecha toda página com um gesto editorial de respiro; trocar copy/links e recolorir para verde-profundo. |
| **Footer Section** | Variante de footer enxuto para páginas internas (admin, 404) | baixo | Alternativa leve quando o Motion Footer for pesado demais para a tela. |
| **Footer** (Chillbion) | Fonte da estrutura de conteúdo do footer (colunas de links, contato) | baixo | Doa a arquitetura de informação do rodapé (serviços, contato, CRN) para o Motion Footer. |
| **Share Button** | Compartilhar artigos e resultados do simulador | baixo | Microinteração de compartilhamento reaproveitável em Artigos e no resultado das ferramentas. |

---

## 2. Home

Hero já é a `EditorialHero`. Estes entram como dobras abaixo dela.

| Componente | Função aqui | Esforço | Justificativa |
|---|---|---|---|
| **Text Rotate** | Palavra rotativa na headline ("com a comida / com seu corpo…") | baixo | Já era o padrão da hero antiga; mantém a promessa central viva sem custo. |
| **Typing Effect** | Eyebrow/subtítulo que se digita ("Nutrição comportamental…") | baixo | Dá vida à entrada da dobra sem animação pesada. |
| **Cta With Text Marquee** | Faixa-CTA "Agende sua consulta" com marquee | baixo | Substitui a faixa marquee atual por uma que também converte. |
| **Testimonials Columns 1** | NOVA dobra "Histórias de quem já passou por aqui" (prova social) | médio | Prova social é o que falta na Home; colunas animadas com depoimentos reais em vez de mock. |
| **Connoisseur Stack Interactor** | NOVA dobra "O método 360º" (corpo · mente · rotina · ambiente) | médio | Mostra a hierarquia do método com elegância técnica; trocar dados mock pelos 4 pilares. |
| **Story Scroll** | Narrativa em scroll da jornada do paciente (diagnóstico → plano → acompanhamento) | médio | Transforma "como funciona" em experiência narrada; recolorir e escrever o copy da jornada. |
| **Cards Stack** | "O que está incluído no acompanhamento" (empilhamento de serviços) | baixo | Empacota os entregáveis do serviço num gesto tátil coerente com a marca. |
| **Display Cards** | Trio de valores/diferenciais na dobra de missão | baixo | Cartões skew com hover grayscale→cor dão um toque editorial aos pilares. |
| **Stacked Cards Interaction** | Variante mobile do Cards Stack | baixo | Mesma informação, gesto adequado ao toque. |
| **Text Reveal** | Frase-manifesto da MissionSection revelando no scroll | baixo | O reveal palavra-a-palavra dá gravidade ao statement de marca. |
| **Animated Text** | Títulos de seção com entrada animada | baixo | Padroniza a entrada dos headings ao longo da Home. |
| **Ink Reveal** | Momento lúdico "revele sua transformação" (pincel apaga máscara) | médio | Uma interação memorável (o "elemento que se lembra em 24h") temática de mudança. |
| **Background Gradient Animation** | Fundo suave (creme→verde-névoa) atrás de UMA dobra | baixo | Único fundo animado permitido na Home; leve, CSS, on-brand. |
| **Smooth Scroll Hero** | Quebra de parallax entre dobras (imagem de comida/natureza) | médio | Dá profundidade cinematográfica sem WebGL; trocar imagens mock pelas reais. |
| **Section With Mockup** | Dobra "suas ferramentas num toque" (UI das ferramentas em device) | médio | Vende as ferramentas de nutrição mostrando-as num mockup com parallax sutil. |

---

## 3. Sobre (Mariana)

| Componente | Função aqui | Esforço | Justificativa |
|---|---|---|---|
| **Portfolio Hero** | Hero da página: nome "Mariana Bermudes" gigante + foto sobreposta | baixo | Encaixe perfeito para a página de autoridade pessoal — nome e rosto como âncora. |
| **Release Time Line** | Trajetória (São Camilo → especialização → CRN-3 → hoje) | médio | O card que expande no centro do viewport é ideal para uma linha do tempo de formação. |
| **Text Effect** | Revelação da bio por palavra/caractere | baixo | Dá ritmo de leitura à história da Mariana. |
| **Parallax Scrolling** | Camadas em parallax (GSAP+Lenis) da jornada dela | alto | Profundidade forte, mas exige Lenis + tuning; usar só se a página pedir um clímax visual. |
| **Clip Path Image** | Foto da Mariana em recorte orgânico (folha/gota) | baixo | O clip-path orgânico conversa direto com "nutrição/natureza". |
| **Pointer Highlight** | Destaque de frases-chave na bio ("nutrição que acolhe") | baixo | Grifa o tom de voz da marca dentro do texto corrido. |
| **Perspective Book** | Vitrine de formação/publicações (capas em livro 3D CSS) | baixo | Livro em perspectiva (CSS puro, leve) materializa credenciais e e-books. |
| **Reveal Wave Image** | Foto com distorção de onda + reveal por mouse | alto | Efeito bonito mas é WebGL; usar só 1× e como clímax da página, senão fica pesado. |
| **Woven Light Hero** | Momento "o corpo como sistema" (partículas 3D formando figura) | alto | Tematicamente forte (luz tecida = células), mas three.js pesado — 1 instância, flag de perf. |

---

## 4. Planos

| Componente | Função aqui | Esforço | Justificativa |
|---|---|---|---|
| **Animated Glassy Pricing** | Cartões dos planos (núcleo da página) | médio | Feito exatamente para pricing; trocar tiers/preços reais e recolorir para a paleta. |
| **Bolt Style Chat → ModelSelector** | Seletor "escolha seu plano" (adaptar model→plano) | médio | O seletor de modelo vira seletor de plano alimentar, exatamente como você sugeriu. |
| **Spotlight Card** | Glow que segue o mouse nos cartões de plano | baixo | Realça o plano sob o cursor com o hue da marca. |
| **Glowing Shadow** | Ênfase no plano "recomendado" | baixo | Sombra que pulsa/cicla cor chama atenção para o tier-âncora. |
| **Shine Border** | Borda animada no plano em destaque | baixo | Marca o "mais escolhido" sem poluir. |
| **Progressive Blur Card** | Profundidade nos cartões (blur progressivo) | baixo | Reforça a hierarquia entre planos com desfoque em camadas. |
| **Card Fan Carousel** | Leque de benefícios/transformações por plano | médio | O leque GSAP mostra "o que você ganha" de forma tátil; trocar imagens mock. |
| **Feature With Image Comparison** | Slider antes/depois de resultado | médio | Prova visual de transformação — argumento de conversão central. |
| **Pulse Fit Hero** | Hero da página (energia de resultado/vitalidade) | baixo | Hero fitness recolorido dá o tom de "resultado" sem ser agressivo. |
| **Glassmorphism Trust Hero** | Seção de confiança/garantia (LGPD, CRN, reembolso 7 dias) | médio | Hero de alta conversão vira bloco de confiança antes do checkout. |
| **Animated Shader Hero** | Reveal do plano premium/anual (momento "wow" isolado) | alto | Único uso de shader em Planos, num beat premium; flag de perf, não empilhar. |

---

## 5. Ferramentas

| Componente | Função aqui | Esforço | Justificativa |
|---|---|---|---|
| **Ai Input With Search** | Input do NutriSearch (toggle de busca + anexo) | médio | Moderniza a busca nutricional; ligar ao endpoint real `/api/nutrition/search`. |
| **Claude Style Chat Input** | Input polido do ConciergeChat / ArticleChatIA | médio | Eleva o input dos chats de IA que já existem; conectar ao `/api/ai/chat` e `X-Device-Id`. |
| **Bolt Style Chat** | Hero do assistente de IA nutricional (chat + ray bg) | médio | O chat estilo Bolt vira a interface do assistente de nutrição, como você sugeriu; recolorir ray para verde. |
| **N8n Workflow Block** | "Como montamos seu plano" (nós de processo animados) | alto | Visualiza o fluxo triagem→plano→acompanhamento; exige adaptar os nós ao conteúdo real. |
| **Circular Gallery** | Galeria rotativa de alimentos (usa nomes comum/binomial!) | baixo | Feito para espécies/botânica — encaixe natural para explorar alimentos. |
| **Ruixen Feature Section** | "Nossas fontes de dados" (USDA · TACO · Spoonacular) | baixo | O grid de integrações vira o grid de bancos científicos que alimentam as ferramentas. |
| **Interfaces Carousel** | Carrossel das telas das ferramentas (Embla) | baixo | Mostra busca/receitas/diário/simulador num carrossel horizontal-vertical. |
| **Feature Sections** | Grid de features das ferramentas | baixo | Blocos simples de feature para resumir o que cada ferramenta faz. |
| **Ai Image Generator Hero** | "Monte seu prato" — carrossel de pratos rotacionados | médio | O hero de carrossel de imagens vira vitrine de pratos; trocar `next/image`→`img` e imagens reais. |
| **Scanner Card Stream** | Visual "escaneando nutrientes" na NutriSearch | alto | Metáfora de scanner combina com análise de alimentos, mas é three.js pesado — 1 instância, flag. |
| **Particles Bg** | Fundo sutil de partículas atrás do hero de ferramentas | médio | Fundo canvas leve, recolorir e reduzir densidade; único animado da tela. |
| **Particle Effect For Hero** | Partículas no hover do hero de ferramentas | baixo | Reação de hover discreta; alternativa mais leve ao Particles Bg. |
| **Flow Field Background** | Fundo "fluxo orgânico" atrás do simulador | médio | Campo de fluxo (canvas, sem WebGL) evoca metabolismo/fluxo; recolorir para verde. |

---

## 6. Artigos & Blog (lista + ArtigoDetalhe)

| Componente | Função aqui | Esforço | Justificativa |
|---|---|---|---|
| **Dynamic Island Toc** | Índice do artigo (scroll-spy + progresso de leitura) em ArtigoDetalhe | baixo | Feito para artigos longos; melhora leitura sem tocar no conteúdo. |
| **Hover Preview** | Links de artigos que mostram preview de imagem no hover | baixo | Dá vida à navegação entre conteúdos com preview elegante. |
| **Project Showcase** | Lista de artigos com imagem flutuante seguindo o cursor | médio | Transforma a listagem num índice editorial imersivo; ligar aos artigos reais. |
| **File Card Collections** | Downloads de e-books/PDFs (cards por formato) | baixo | Representa materiais para download com ícones de formato — reuso no contrato. |
| **Animated Tabs** | Filtro de categorias de artigos (Comportamento · Receitas · Saúde) | baixo | Organiza o blog por eixo temático com transição suave. |

---

## 7. Agendamento, Contrato & Captação de leads (booking flow)

| Componente | Função aqui | Esforço | Justificativa |
|---|---|---|---|
| **File Card Collections** (reuso) | Representação do contrato PDF no fluxo/painel | baixo | O mesmo card de arquivo dá corpo visual ao contrato gerado. |
| **Scroll Expansion Hero** | Abertura imersiva do fluxo de agendamento (mídia expande no scroll) | médio | Cria um "portal" de entrada no agendamento; era o padrão removido, reusar aqui isolado. |
| **Hero 195 1** | Comparativo de planos em abas dentro do checkout | médio | As abas + molduras de imagem servem para comparar planos antes de assinar. |
| **Davincho Hero 1** | Hero de landing de campanha de captação (parallax de imagem) | baixo | Hero leve para páginas de lead-magnet sazonais. |

---

## 8. NOVA PÁGINA — "Alimentos" (enciclopédia de ingredientes)

Página nova na hierarquia (`/alimentos`), linkada em Ferramentas. Abriga o que é
temático de comida e não tinha lar óbvio.

| Componente | Função aqui | Esforço | Justificativa |
|---|---|---|---|
| **Hero Section 7 (Floating Food)** | Hero da página com imagens de comida flutuando | baixo | Componente literalmente chamado "Floating Food Hero" — lar exato para uma página de alimentos. |
| **Circular Gallery** (reuso) | Roda de alimentos por categoria | baixo | Reuso natural: navegar alimentos como espécies. |
| **Clip Path Image** (reuso) | Fotos de alimentos em recortes orgânicos | baixo | Recortes de folha/gota reforçam o tema natural na grade. |

---

## 9. NOVA DOBRA — "Manifesto 360º / Ciência acessível" (momento imersivo único)

Um único beat full-bleed escuro (por página, no máximo), como respiro dramático
entre seções claras. Concentra os pesados sem sujar a marca creme.

| Componente | Função aqui | Esforço | Justificativa |
|---|---|---|---|
| **Cursor Driven Particles Typography** | Palavra-manifesto ("EQUILÍBRIO") desenhada em partículas | médio | Um momento tipográfico interativo memorável, canvas leve, recolorível. |
| **Flow Gradient Hero Section** | Faixa "ciência que acolhe" com gradiente líquido + textura | alto | Único gradiente WebGL do site, num beat isolado; flag de perf/marca (é dark). |
| **Geometric Blur Mesh** | Acento "precisão" (wireframes 3D com blur por mouse) | alto | Sugere precisão/estrutura; usar 1× e pequeno, não como fundo de página inteira. |

---

## 10. NOVO — Splash / Intro de entrada (1ª visita)

Tela de abertura curta (dismissível, 1 vez por sessão), onde um efeito pesado é
aceitável porque não coexiste com conteúdo.

| Componente | Função aqui | Esforço | Justificativa |
|---|---|---|---|
| **Horizon Hero Section** | Abertura 3D com parallax e post-processing | alto | Impacto máximo num contexto onde peso é tolerável (tela isolada, some depois); flag three.js. |
| **Smokey Cursor Effect** | Fumaça fluida seguindo o cursor na intro | alto | Interação "wow" de boas-vindas; WebGL fluid — só na intro, nunca sobre conteúdo. |
| **Aether Hero** | Variante de intro/hero de campanha com shader configurável | alto | Hero-shader alternativo para campanhas; shader trocável, mas pesado — isolar. |

---

## 11. NOVAS — Landing pages de campanha sazonal

Páginas efêmeras (`/campanha/*`) para "Janeiro", "Projeto Verão", "Reeducação".
Absorvem heroes de forte impacto sem tocar nas páginas permanentes.

| Componente | Função aqui | Esforço | Justificativa |
|---|---|---|---|
| **Cinematic Landing Hero** | Hero de campanha com mockup de app/tela | médio | Reaproveita o hero cinematográfico (removido da Home) num contexto onde o peso se paga. |
| **Smooth Scroll Hero** (reuso) | Parallax da landing de campanha | médio | Mesmo parallax da Home, recontextualizado para conversão sazonal. |
| **Glassmorphism Trust Hero** (reuso) | Bloco de garantia da campanha | médio | Reuso do bloco de confiança para fechar a campanha. |

---

## 12. Área administrativa & Login (dark é aceitável)

Zona escura, sem exigência de marca creme nem de indexação — lar natural para os
fundos WebGL restantes, 1 por tela.

| Componente | Função aqui | Esforço | Justificativa |
|---|---|---|---|
| **Interactive Neural Vortex Background** | Fundo do login admin | médio | Já existia no projeto; recontextualizado como ambiente do painel (dark, 1 instância). |
| **Shader Background** | Fundo ambiente do dashboard admin | alto | Plasma sutil dá identidade ao painel sem competir com conteúdo público. |
| **Animated Shader Background** | Alternativa de fundo do login (three.js GLSL) | alto | Variante para A/B do login; escolher 1 entre este e o Neural Vortex, nunca os dois. |
| **Web Gl Shader** | Tela de carregamento do admin | médio | Onda colorida como loader enquanto o dashboard busca dados. |

---

## 13. 404 & microinterações lúdicas

| Componente | Função aqui | Esforço | Justificativa |
|---|---|---|---|
| **Interactive 3d Robot** (Spline) | Mascote na página 404 | alto | Único uso de Spline aceitável (removemos da Home por perf); 404 tolera o peso e ganha personalidade. |
| **Neon Flow** | Fundo lúdico do 404 / easter egg | médio | Tubos neon (canvas) dão leveza divertida a uma página de erro, longe da marca principal. |

---

## Componentes que exigem adaptação NÃO trivial (resumo de risco)

- **Troca de biblioteca / dependência pesada:** Interactive 3d Robot (Spline —
  removido do projeto), Horizon Hero / Woven Light Hero / Scanner Card Stream /
  Flow Gradient / Animated Shader Hero/Background / Aether / Reveal Wave /
  Geometric Blur / Interactive Neural Vortex / Shader Background / Web Gl Shader /
  Smokey Cursor (todos WebGL/three.js — custo de perf e recoloração dark→marca).
- **`next/image` → `<img>` (projeto é Vite, não Next):** Ai Image Generator Hero,
  e qualquer outro que importe `next/image`.
- **Mock → API real:** Testimonials (depoimentos reais), Project Showcase e
  Hover Preview (artigos do `/api/articles`), Ai Input With Search / Bolt Chat /
  Claude Chat Input (endpoints `/api/nutrition/*` e `/api/ai/chat` com
  `X-Device-Id`), Animated Glassy Pricing (tiers reais), N8n Workflow (fluxo real).
- **`@studio-freight/lenis`:** Parallax Scrolling (o projeto tem padrão de Lenis,
  mas exige montar o provider e cuidar de conflito com o scroll nativo).

## Plug-and-play (baixo esforço, só recolorir para a paleta)

Text Rotate, Typing Effect, Cta With Text Marquee, Cards Stack, Display Cards,
Stacked Cards Interaction, Text Reveal, Animated Text, Background Gradient
Animation, Portfolio Hero, Clip Path Image, Pointer Highlight, Perspective Book,
Spotlight Card, Glowing Shadow, Shine Border, Progressive Blur Card, Pulse Fit
Hero, Circular Gallery, Ruixen Feature Section, Interfaces Carousel, Feature
Sections, Dynamic Island Toc, Hover Preview, File Card Collections, Animated Tabs,
Hero Section 7 (Floating Food), Share Button, Tubelight Navbar, Navbar 1,
Footer Section, Footer, Particle Effect For Hero, Davincho Hero 1.
