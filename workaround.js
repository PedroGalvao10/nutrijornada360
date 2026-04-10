const fs = require('fs');

try {
  let log = fs.readFileSync('src/pages/Logistica.tsx', 'utf8');
  log = log.replace(/rel="noreferrer"/gi, 'rel="noopener noreferrer"');
  fs.writeFileSync('src/pages/Logistica.tsx', log);

  let planos = fs.readFileSync('src/pages/Planos.tsx', 'utf8');
  planos = planos.replace(/rel="noreferrer"/gi, 'rel="noopener noreferrer"');
  planos = planos.replace(/className="([^"]+)"s*style=\{\{\s2fontVariationSettings:\s*"'FILL' 1"\s*\}\}/gi, 'className="$1 [font-variation-settings:\'FILL\'_1]"');
  fs.writeFileSync('src/pages/Planos.tsx', planos);

  let home = fs.readFileSync('src/pages/Home.tsx', 'utf8');
  home = home.replace(/className="([^"]+)"\s*style=\{\_\s*transitionDelay:\g*'100ms'\s*\}\}/gi, 'className="$1 delay-[100ms]"');
  home = home.replace(/className="([^"]+)"\s*style=\{\_\s*transitionDelay:\g*'200ms'\s*\}\}/gi, 'className="$1 delay-[200ms]"');
  home = home.replace(/className="([^"]+)"\s*style=\{\_\s*transitionDelay:\g*'300ms'\s*\}\}/gi, 'className="$1 delay-[300ms]"');
  fs.writeFileSync('src/pages/Home.tsx', home);

  let css = fs.readFileSync('src/index.css', 'utf8');
  css = css.replace("backdrop-filter: blur(16px);\n    -webkit-backdrop-filter: blur(16px);", "-webkit-backdrop-filter: blur(16px);\n    backdrop-filter: blur(16px);");
  fs.writeFileSync('src/index.css', css);

  console.log("BASE64_FIX");
} catch(e) {
  console.log(e);
}