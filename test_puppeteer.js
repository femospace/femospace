const puppeteer = require('puppeteer-core');

(async () => {
    console.log("Starting Edge...");
    const browser = await puppeteer.launch({
        executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    page.on('console', msg => {
        console.log(`[BROWSER CONSOLE] ${msg.type().toUpperCase()} - ${msg.text()}`);
    });
    page.on('pageerror', err => {
        console.error(`[BROWSER ERROR] ${err.toString()}`);
    });
    page.on('requestfailed', request => {
        console.log(`[REQUEST FAILED] ${request.url()} - ${request.failure()?.errorText}`);
    });

    try {
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 20000 });
        console.log("Page loaded!");
    } catch(e) {
        console.error("Goto error:", e);
    }
    
    await browser.close();
    console.log("Done.");
})();
