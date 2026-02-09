/**
 * Script to capture the 3 missing dashboard screenshots
 */

import { chromium } from '@playwright/test';
import * as path from 'path';

const BASE_URL = 'http://localhost:3000';
const SCREENSHOTS_DIR = path.join(__dirname, '../docs/sitemap/screenshots');

const CREDENTIALS = {
  client: {
    email: 'screenshot-client@alkitu.test',
    password: 'Screenshot123'
  },
  employee: {
    email: 'screenshot-employee@alkitu.test',
    password: 'Screenshot123'
  }
};

async function login(page: any, email: string, password: string) {
  console.log(`  🔐 Logging in as ${email}...`);

  await page.goto(`${BASE_URL}/es/auth/login`, { waitUntil: 'networkidle' });
  await page.fill('#email', email);
  await page.fill('#password', password);

  const [response] = await Promise.all([
    page.waitForResponse((r: any) => r.url().includes('/api/auth/login') && r.status() === 200, { timeout: 15000 }),
    page.click('button[type="submit"]', { force: true })
  ]);

  await page.waitForURL(/\/es\/(admin|client|employee|dashboard)/, { timeout: 15000 });
  console.log('  ✅ Login successful\n');
}

async function captureScreenshot(page: any, url: string, outputPath: string) {
  console.log(`    📸 Capturing: ${url}`);
  
  await page.goto(url, {
    waitUntil: 'domcontentloaded',
    timeout: 10000
  });

  // Wait a bit for content to render
  await page.waitForTimeout(2000);

  await page.screenshot({
    path: outputPath,
    fullPage: true,
    animations: 'disabled'
  });

  console.log(`    ✅ Saved: ${outputPath}\n`);
}

async function main() {
  console.log('🚀 Capturing missing dashboard screenshots...\n');

  const browser = await chromium.launch({ headless: true });

  try {
    // 1. Capture client dashboard
    console.log('📱 CLIENT Dashboard:');
    const clientContext = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      locale: 'es-ES',
      colorScheme: 'light'
    });
    const clientPage = await clientContext.newPage();
    await login(clientPage, CREDENTIALS.client.email, CREDENTIALS.client.password);
    await captureScreenshot(
      clientPage,
      `${BASE_URL}/es/client/dashboard`,
      path.join(SCREENSHOTS_DIR, 'client/dashboard/index.png')
    );
    await clientContext.close();

    // 2. Capture employee dashboard
    console.log('👷 EMPLOYEE Dashboard:');
    const employeeContext = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      locale: 'es-ES',
      colorScheme: 'light'
    });
    const employeePage = await employeeContext.newPage();
    await login(employeePage, CREDENTIALS.employee.email, CREDENTIALS.employee.password);
    await captureScreenshot(
      employeePage,
      `${BASE_URL}/es/employee/dashboard`,
      path.join(SCREENSHOTS_DIR, 'employee/dashboard/index.png')
    );
    await employeeContext.close();

    // 3. Capture shared dashboard
    console.log('🔄 SHARED Dashboard:');
    const sharedContext = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      locale: 'es-ES',
      colorScheme: 'light'
    });
    const sharedPage = await sharedContext.newPage();
    await login(sharedPage, CREDENTIALS.client.email, CREDENTIALS.client.password);
    await captureScreenshot(
      sharedPage,
      `${BASE_URL}/es/dashboard`,
      path.join(SCREENSHOTS_DIR, 'shared/dashboard/index.png')
    );
    await sharedContext.close();

    console.log('🎉 All missing dashboards captured!\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
