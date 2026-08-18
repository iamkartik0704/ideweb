const fs = require('fs');
let code = fs.readFileSync('src/pages/Landing.jsx', 'utf8');

code = code.replace(/    const sleek = document\.querySelectorAll\('\.sleek-quote'\);[\s\S]*?firstWordChars\.forEach\(ch => ch\.classList\.add\('brand'\)\);\s*\}\);\s*\}, \[\]\);/g, '    // sleek quote DOM manipulation removed to prevent React crash');

const newQuote = '<p className="sleek-quote download-sub">\n  <span className="sleek-inner" data-populated="1">\n    {(() => {\n      const text = "Comπle is our AI-native IDE, allowing any developer to build in the multi-model era.";\n      const words = text.split(\' \');\n      let charIndex = 0;\n      return words.map((word, wIdx) => (\n        <span key={wIdx} className="word">\n          {Array.from(word).map((ch) => {\n            const i = charIndex++;\n            return (\n              <span key={i} className={char } style={{ \'--i\': String(i) }}>\n                {ch === \' \' ? \'\\u00A0\' : ch}\n              </span>\n            );\n          })}\n          {wIdx < words.length - 1 && \' \'}\n        </span>\n      ));\n    })()}\n  </span>\n</p>';

code = code.replace(/<p className="sleek-quote download-sub" data-text=[\s\S]*?<\/p>/g, newQuote);
fs.writeFileSync('src/pages/Landing.jsx', code, 'utf8');
console.log('Replaced');