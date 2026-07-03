const fs = require('fs');
const path = './src/assets/docxContent.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const currentStr = `<ul><li><strong>GitHub:</strong> github.com/iamkartik0704</li><li><strong>Email:</strong> iamkartik0704@gmail.com</li><li><strong>LinkedIn:</strong> linkedin.com/in/kartik-chawla-189430203</li></ul>`;
const hyperlinkedStr = `<ul><li><strong>GitHub:</strong> <a href="https://github.com/iamkartik0704" target="_blank" rel="noopener noreferrer" style="color: #D4AF37; text-decoration: none;">github.com/iamkartik0704</a></li><li><strong>Email:</strong> <a href="mailto:iamkartik0704@gmail.com" style="color: #D4AF37; text-decoration: none;">iamkartik0704@gmail.com</a></li><li><strong>LinkedIn:</strong> <a href="https://linkedin.com/in/kartik-chawla-189430203" target="_blank" rel="noopener noreferrer" style="color: #D4AF37; text-decoration: none;">linkedin.com/in/kartik-chawla-189430203</a></li></ul>`;

data.footer_section = data.footer_section.replace(currentStr, hyperlinkedStr);
fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log("Updated links.");
