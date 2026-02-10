const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto('http://localhost:3000');
    console.log('Page loaded');

    // Verify Materiale (Chapters)
    console.log('Navigating to Materiale...');
    await page.click('a[onclick*="materiale"]');
    await page.waitForSelector('.chapter-card', { state: 'visible', timeout: 5000 });
    await page.screenshot({ path: '/home/jules/verification/materiale.png' });
    console.log('Saved materiale.png');

    // Verify Biblioteca
    console.log('Navigating to Biblioteca...');
    await page.click('a[onclick*="biblioteca"]');
    await page.waitForSelector('.library-card', { state: 'visible', timeout: 5000 });
    await page.screenshot({ path: '/home/jules/verification/biblioteca.png' });
    console.log('Saved biblioteca.png');

    // Verify Tests (Admitere)
    console.log('Navigating to Admitere...');
    await page.click('a[onclick*="admitere"]');
    await page.waitForSelector('.test-card', { state: 'visible', timeout: 5000 });
    await page.screenshot({ path: '/home/jules/verification/teste.png' });
    console.log('Saved teste.png');

  } catch (err) {
    console.error('Error during verification:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
