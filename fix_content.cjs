const fs = require('fs');
let code = fs.readFileSync('src/pages/ShareViewer.jsx', 'utf8');

code = code.replace('setContent(data.chat_content);', 'setContent(data.content || data.chat_content);');

fs.writeFileSync('src/pages/ShareViewer.jsx', code, 'utf8');
console.log('Fixed chat_content to content');