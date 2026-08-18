const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER LOG:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
  try {
    await page.goto('http://localhost:5174/share/e86209d6-f935-4edc-9168-8146e22133c4', { waitUntil: 'networkidle0' });
  } catch (e) {
    console.error('GOTO ERROR:', e);
  }
  await browser.close();
})();