const fs = require('fs');
let code = fs.readFileSync('src/pages/Landing.jsx', 'utf8');
if (code.charCodeAt(0) === 0xFEFF) code = code.slice(1);

code = code.replace(/    const sleek = document\.querySelectorAll\('\.sleek-quote'\);[\s\S]*?firstWordChars\.forEach\(ch => ch\.classList\.add\('brand'\)\);\s*\}\);\s*\}, \[\]\);/g, '    // sleek quote DOM manipulation removed to prevent React crash');

const newQuote = 
            <p className="sleek-quote download-sub">
              <span className="sleek-inner" data-populated="1">
                {(() => {
                  const text = "Comπle is our AI-native IDE, allowing any developer to build in the multi-model era.";
                  const words = text.split(' ');
                  let charIndex = 0;
                  return words.map((word, wIdx) => (
                    <span key={wIdx} className="word">
                      {Array.from(word).map((ch) => {
                        const i = charIndex++;
                        return (
                          <span key={i} className={\char \\} style={{ '--i': String(i) }}>
                            {ch === ' ' ? '\\u00A0' : ch}
                          </span>
                        );
                      })}
                      {wIdx < words.length - 1 && ' '}
                    </span>
                  ));
                })()}
              </span>
            </p>
;

code = code.replace(/<p className="sleek-quote download-sub" data-text=[\s\S]*?<\/p>/g, newQuote);
fs.writeFileSync('src/pages/Landing.jsx', code, 'utf8');
console.log('Replaced');