const { chromium } = require('playwright');
const { execSync, spawn } = require('child_process');

(async () => {
  // Start Next.js server
  const server = spawn('npx', ['next', 'start', '-p', '3459'], {
    cwd: 'C:\\Users\\Acer\\CodeBase\\Hello Food Website\\hello-food',
    stdio: 'pipe',
    shell: true
  });

  // Wait for server
  await new Promise(r => setTimeout(r, 5000));

  try {
    const browser = await chromium.launch();
    
    // iPhone SE (320px)
    const page = await browser.newPage({ viewport: { width: 320, height: 568 } });
    await page.goto('http://localhost:3459/admin/login', { waitUntil: 'networkidle', timeout: 15000 });
    await page.screenshot({ path: 'screenshots/01-login-320.png', fullPage: true });
    
    await page.fill('input[placeholder="admin"]', 'admin');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'screenshots/02-orders-320.png', fullPage: true });

    const overflow = await page.evaluate(() => ({
      docWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    }));
    console.log('320px overflow check:', JSON.stringify(overflow));

    // Menu tab
    const menuBtn = page.locator('button').filter({ hasText: /^Menu/ }).first();
    await menuBtn.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'screenshots/03-menu-320.png', fullPage: true });

    // 375px (iPhone 13/14)
    const page2 = await browser.newPage({ viewport: { width: 375, height: 812 } });
    await page2.goto('http://localhost:3459/admin/login', { waitUntil: 'networkidle', timeout: 15000 });
    await page2.fill('input[placeholder="admin"]', 'admin');
    await page2.fill('input[type="password"]', 'admin123');
    await page2.click('button[type="submit"]');
    await page2.waitForTimeout(3000);
    await page2.screenshot({ path: 'screenshots/04-orders-375.png', fullPage: true });

    const overflow2 = await page2.evaluate(() => ({
      docWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    }));
    console.log('375px overflow check:', JSON.stringify(overflow2));

    await browser.close();
    console.log('Done!');
  } finally {
    server.kill();
  }
})();
