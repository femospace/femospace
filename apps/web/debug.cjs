const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: "new"
  });
  const page = await browser.newPage();
  page.on('console', msg => console.log('LOG:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('PAGE_ERROR:', error));
  
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' }).catch(err => console.log('nav error', err.message));
  await browser.close();
})();
