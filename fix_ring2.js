const fs = require("fs");
let css = fs.readFileSync("src/index.css", "utf8");
css = css.replace(/@layer utilities \{[\s\S]*?\}\s*\}/g, "");
css = css.trimEnd();
css += "\n\n/* Huly.io solid ring */\n.huly-glow {\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 0 6px rgba(74, 103, 65, 0.35);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\n}\n";
fs.writeFileSync("src/index.css", css);
console.log("RING_OK");