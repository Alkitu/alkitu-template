import { test, expect } from '@playwright/test';

/**
 * Debug Test: Admin Access to Addons Page
 *
 * Tests if user can access /admin/settings/addons
 * and verifies feature flag status
 */

test.describe('Admin Access Debug', () => {
  test('Login and access addons page', async ({ page }) => {
    // 1. Navigate to login page
    await page.goto('http://localhost:3000/es/auth/login');
    await page.waitForLoadState('networkidle');

    // 2. Fill in credentials
    await page.fill('input[type="email"]', 'luiseum95@gmail.com');
    await page.fill('input[type="password"]', 'Martucci.95');

    // 3. Click login button
    await page.click('button[type="submit"]');

    // 4. Wait for redirect after login
    await page.waitForURL(/\/(es|en)\/(admin|client|employee)/, { timeout: 10000 });

    console.log('✅ Login successful, redirected to:', page.url());

    // 5. Navigate to admin settings
    await page.goto('http://localhost:3000/es/admin/settings');
    await page.waitForLoadState('networkidle');

    console.log('✅ Admin settings page loaded');

    // 6. Try to access addons page
    await page.goto('http://localhost:3000/es/admin/settings/addons');
    await page.waitForLoadState('networkidle');

    const currentUrl = page.url();
    console.log('📍 Current URL:', currentUrl);

    // 7. Check if we were redirected to feature-disabled
    if (currentUrl.includes('/feature-disabled')) {
      console.log('❌ BLOCKED: Redirected to feature-disabled page');
      console.log('🔍 Checking page content...');

      // Get the feature name from URL
      const url = new URL(currentUrl);
      const feature = url.searchParams.get('feature');
      const redirect = url.searchParams.get('redirect');

      console.log('🚫 Blocked Feature:', feature);
      console.log('📝 Attempted URL:', redirect);

      // Check page content
      const pageContent = await page.textContent('body');
      console.log('📄 Page says:', pageContent?.substring(0, 200));

      // Take screenshot
      await page.screenshot({
        path: 'packages/web/tests/screenshots/feature-disabled.png',
        fullPage: true
      });
      console.log('📸 Screenshot saved to: packages/web/tests/screenshots/feature-disabled.png');

      throw new Error(`Access blocked: Feature "${feature}" is disabled`);
    } else {
      console.log('✅ SUCCESS: Addons page loaded');

      // Verify page content
      const title = await page.textContent('h1, h2');
      console.log('📄 Page title:', title);

      // Check for feature toggles
      const switches = await page.locator('[role="switch"]').count();
      console.log('🎛️  Feature toggles found:', switches);

      // Take screenshot
      await page.screenshot({
        path: 'packages/web/tests/screenshots/addons-page-success.png',
        fullPage: true
      });
      console.log('📸 Screenshot saved to: packages/web/tests/screenshots/addons-page-success.png');

      expect(currentUrl).toContain('/admin/settings/addons');
    }
  });

  test('Check user role in database', async ({ page }) => {
    // This test will be run manually with MongoDB connection
    console.log('🔍 To check user role in database, run:');
    console.log('   npm run db:shell');
    console.log('   db.users.findOne({ email: "luiseum95@gmail.com" })');
  });
});
