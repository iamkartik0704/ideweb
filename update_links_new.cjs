const fs = require('fs');
let c = fs.readFileSync('src/pages/Landing.jsx', 'utf8');

c = c.replace(
  'href="https://github.com/iamkartik0704/compile/actions/runs/32299488946/artifacts/9382565815"',
  'href="https://github.com/iamkartik0704/compile/releases/download/v1.1.16/compile-1.1.16-win-x64.exe"'
);
c = c.replace(
  '.zip <span className="download-tag">Windows 10/11</span>',
  '.exe <span className="download-tag">Windows 10/11</span>'
);

c = c.replace(
  'href="https://github.com/iamkartik0704/compile/actions/runs/32299488946/artifacts/9382642142"',
  'href="https://github.com/iamkartik0704/compile/releases/download/v1.1.16/compile-1.1.16-mac-arm64.zip"'
);

c = c.replace(
  'href="https://github.com/iamkartik0704/compile/releases/download/v1.1.13/compile-1.1.13-mac-x64.zip"',
  'href="https://github.com/iamkartik0704/compile/releases/download/v1.1.16/compile-1.1.16-mac-x64.zip"'
);

fs.writeFileSync('src/pages/Landing.jsx', c, 'utf8');
console.log('Links updated to v1.1.16');
