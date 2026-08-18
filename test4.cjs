const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER LOG:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
  try {
    await page.goto('http://localhost:5174/share/6b3ba005-6c71-4ac8-8080-7de21a19a522', { waitUntil: 'networkidle0' });
  } catch (e) {
    console.error('GOTO ERROR:', e);
  }
  await browser.close();
})();