/**
 * Test script to debug login process
 */

import { chromium } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

async function testLogin() {
  console.log('🚀 Testing login...\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    locale: 'es-ES',
    colorScheme: 'light'
  });

  const page = await context.newPage();

  try {
    // Navigate to login
    console.log('📍 Navigating to login page...');
    await page.goto(`${BASE_URL}/es/auth/login`, { waitUntil: 'networkidle' });
    console.log(`✅ Current URL: ${page.url()}\n`);

    // Take screenshot before login
    await page.screenshot({ path: 'debug-before-login.png' });
    console.log('📸 Screenshot saved: debug-before-login.png\n');

    // Fill credentials
    console.log('📝 Filling credentials...');
    await page.fill('input[name="email"], input[type="email"]', 'screenshot-admin@alkitu.test');
    await page.fill('input[name="password"], input[type="password"]', 'Screenshot123');
    console.log('✅ Credentials filled\n');

    // Click submit
    console.log('🖱️  Clicking submit button...');
    await page.click('button[type="submit"]', { force: true });
    console.log('✅ Button clicked\n');

    // Wait a bit
    console.log('⏳ Waiting for response...');
    await page.waitForTimeout(5000);

    // Check current URL
    console.log(`📍 Current URL after login: ${page.url()}\n`);

    // Take screenshot after login attempt
    await page.screenshot({ path: 'debug-after-login.png' });
    console.log('📸 Screenshot saved: debug-after-login.png\n');

    // Check for error messages
    const errorMessages = await page.$$eval('[role="alert"], .error, .text-red-500, .text-destructive',
      elements => elements.map(el => el.textContent)
    );

    if (errorMessages.length > 0) {
      console.log('⚠️  Error messages found:');
      errorMessages.forEach(msg => console.log(`   - ${msg}`));
    } else {
      console.log('✅ No error messages found');
    }

    // Keep browser open for inspection
    console.log('\n👀 Browser will stay open for 30 seconds for inspection...');
    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
}

testLogin();
