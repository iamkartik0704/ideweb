const fs = require('fs');
let code = fs.readFileSync('src/pages/Landing.jsx', 'utf8');

code = code.replace('// sleek quote DOM manipulation removed to prevent React crash', '// sleek quote DOM manipulation removed to prevent React crash\n  }, []);');

fs.writeFileSync('src/pages/Landing.jsx', code, 'utf8');
console.log('Fixed');