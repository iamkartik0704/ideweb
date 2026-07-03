const fs = require('fs');
const mammoth = require('mammoth');
const path = require('path');

async function convertDocxFiles() {
  const files = [
    'AI Agent.docx',
    'Documentation.docx',
    'Extensions.docx',
    'Features_compile.docx',
    'footer section.docx'
  ];
  
  const result = {};
  
  for (const file of files) {
    if (fs.existsSync(file)) {
      try {
        const { value: html } = await mammoth.convertToHtml({path: file});
        // create a clean key name
        const key = file.replace('.docx', '').replace(/\s+/g, '_').toLowerCase();
        result[key] = html;
        console.log(`Converted ${file}`);
      } catch (e) {
        console.error(`Error converting ${file}:`, e);
      }
    } else {
      console.warn(`File not found: ${file}`);
    }
  }
  
  fs.writeFileSync(path.join(__dirname, 'src', 'assets', 'docxContent.json'), JSON.stringify(result, null, 2));
  console.log('All files converted to src/assets/docxContent.json');
}

convertDocxFiles();
