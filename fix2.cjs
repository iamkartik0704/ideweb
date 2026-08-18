const fs = require('fs');
let code = fs.readFileSync('src/pages/Landing.jsx', 'utf8');

code = code.replace(/  \/\/ Populate sleek quote with character spans for staggered reveal\n  useEffect\(\(\) => \{\n    \/\/ sleek quote DOM manipulation removed to prevent React crash\n\n  useEffect/g, '  // Populate sleek quote with character spans for staggered reveal\n  useEffect(() => {\n    // sleek quote DOM manipulation removed to prevent React crash\n  }, []);\n\n  useEffect');

fs.writeFileSync('src/pages/Landing.jsx', code, 'utf8');
console.log('Fixed');