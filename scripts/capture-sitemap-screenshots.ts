/**
 * Script to automatically capture screenshots for the sitemap
 *
 * This script navigates through all application routes and captures
 * full-page screenshots for documentation purposes.
 *
 * Configuration:
 * - Viewport: 1920x1080
 * - Locale: Spanish (es)
 * - Theme: Light mode
 * - Format: PNG
 */

import { chromium, Browser, BrowserContext, Page } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

// Base URL for the application
const BASE_URL = 'http://localhost:3000';

// Output directory for screenshots
const SCREENSHOTS_DIR = path.join(__dirname, '../docs/sitemap/screenshots');

// Credentials for screenshot users (created with: npm run create:screenshot-users)
const CREDENTIALS = {
  admin: {
    email: 'screenshot-admin@alkitu.test',
    password: 'Screenshot123'
  },
  client: {
    email: 'screenshot-client@alkitu.test',
    password: 'Screenshot123'
  },
  employee: {
    email: 'screenshot-employee@alkitu.test',
    password: 'Screenshot123'
  }
};

// Route definitions
const ROUTES = {
  public: {
    auth: [
      { path: '/es/auth/login', name: 'login.png' },
      { path: '/es/auth/register', name: 'register.png' },
      { path: '/es/auth/forgot-password', name: 'forgot-password.png' },
      { path: '/es/auth/reset-password', name: 'reset-password.png' },
      { path: '/es/auth/new-password', name: 'new-password.png' },
      { path: '/es/auth/email-login', name: 'email-login.png' },
      { path: '/es/auth/verify-login-code', name: 'verify-login-code.png' },
      { path: '/es/auth/verify-request', name: 'verify-request.png' },
      { path: '/es/auth/new-verification', name: 'new-verification.png' },
      { path: '/es/auth/auth-error', name: 'auth-error.png' }
    ],
    other: [
      { path: '/es/design-system', name: 'design-system.png' },
      { path: '/es/unauthorized', name: 'unauthorized.png' }
    ]
  },
  admin: {
    dashboard: [
      { path: '/es/admin/dashboard', name: 'index.png' }
    ],
    users: [
      { path: '/es/admin/users', name: 'list.png' },
      { path: '/es/admin/users/new', name: 'create.png' }
      // { path: '/es/admin/users/[email]', name: 'detail-[email].png' } // Requires dynamic data
    ],
    requests: [
      { path: '/es/admin/requests', name: 'list.png' },
      { path: '/es/admin/requests/new', name: 'create.png' }
      // { path: '/es/admin/requests/[id]', name: 'detail-[id].png' }, // Requires dynamic data
      // { path: '/es/admin/requests/[id]/edit', name: 'edit-[id].png' } // Requires dynamic data
    ],
    catalog: [
      { path: '/es/admin/catalog/services', name: 'services-list.png' },
      { path: '/es/admin/catalog/services/new', name: 'services-create.png' },
      { path: '/es/admin/catalog/categories', name: 'categories.png' }
      // { path: '/es/admin/catalog/services/[id]', name: 'services-detail.png' } // Requires dynamic data
    ],
    chat: [
      { path: '/es/admin/chat', name: 'list.png' },
      { path: '/es/admin/chat/analytics', name: 'analytics.png' }
      // { path: '/es/admin/chat/[conversationId]', name: 'conversation-[id].png' } // Requires dynamic data
    ],
    channels: [
      { path: '/es/admin/channels', name: 'list.png' }
      // { path: '/es/admin/channels/[channelId]', name: 'detail-[id].png' } // Requires dynamic data
    ],
    notifications: [
      { path: '/es/admin/notifications', name: 'list.png' },
      { path: '/es/admin/notifications/analytics', name: 'analytics.png' },
      { path: '/es/admin/notifications/preferences', name: 'preferences.png' }
    ],
    settings: [
      { path: '/es/admin/settings', name: 'general.png' },
      { path: '/es/admin/settings/chatbot', name: 'chatbot.png' },
      { path: '/es/admin/settings/themes', name: 'themes.png' },
      { path: '/es/admin/settings/addons', name: 'addons.png' }
    ],
    'email-templates': [
      { path: '/es/admin/email-templates', name: 'list.png' }
    ]
  },
  client: {
    dashboard: [
      { path: '/es/client/dashboard', name: 'index.png' }
    ],
    requests: [
      { path: '/es/client/requests/new', name: 'new.png' },
      { path: '/es/client/requests/success', name: 'success.png' }
      // { path: '/es/client/requests/[requestId]', name: 'detail-[id].png' } // Requires dynamic data
    ],
    notifications: [
      { path: '/es/client/notifications', name: 'list.png' }
    ],
    profile: [
      { path: '/es/client/profile', name: 'index.png' }
    ],
    onboarding: [
      { path: '/es/client/onboarding', name: 'index.png' }
    ],
    locations: [
      { path: '/es/client/locations', name: 'list.png' }
    ],
  },
  employee: {
    dashboard: [
      { path: '/es/employee/dashboard', name: 'index.png' }
    ],
    requests: [
      { path: '/es/employee/requests', name: 'list.png' }
    ],
    notifications: [
      { path: '/es/employee/notifications', name: 'list.png' }
    ]
  },
  shared: {
    dashboard: [
      { path: '/es/dashboard', name: 'index.png' }
    ],
    profile: [
      { path: '/es/profile', name: 'index.png' }
    ],
    requests: [
      { path: '/es/requests', name: 'list.png' },
      { path: '/es/requests/new', name: 'new.png' }
      // { path: '/es/requests/[id]', name: 'detail-[id].png' } // Requires dynamic data
    ],
    onboarding: [
      { path: '/es/onboarding', name: 'index.png' }
    ]
  }
};

/**
 * Create necessary directories
 */
function ensureDirectories() {
  console.log('📁 Creating directory structure...');

  const dirs = [
    'public/auth',
    'public/other',
    'admin/dashboard',
    'admin/users',
    'admin/requests',
    'admin/catalog',
    'admin/chat',
    'admin/channels',
    'admin/notifications',
    'admin/settings',
    'admin/email-templates',
    'client/dashboard',
    'client/requests',
    'client/notifications',
    'client/profile',
    'client/onboarding',
    'employee/dashboard',
    'employee/requests',
    'employee/notifications',
    'shared/dashboard',
    'shared/profile',
    'client/locations',
    'shared/requests',
    'shared/onboarding'
  ];

  dirs.forEach(dir => {
    const fullPath = path.join(SCREENSHOTS_DIR, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });

  console.log('✅ Directory structure created\n');
}

/**
 * Login to the application with given credentials
 */
async function login(page: Page, email: string, password: string) {
  console.log(`  🔐 Logging in as ${email}...`);

  try {
    // Navigate to login page
    await page.goto(`${BASE_URL}/es/auth/login`, { waitUntil: 'networkidle' });

    // Fill login form - use id selectors for more reliability
    await page.fill('#email', email);
    await page.fill('#password', password);

    // Click submit button and wait for API call
    const [response] = await Promise.all([
      // Wait for the login API call to complete
      page.waitForResponse(response =>
        response.url().includes('/api/auth/login') && response.status() === 200,
        { timeout: 15000 }
      ),
      // Click the button
      page.click('button[type="submit"]', { force: true })
    ]);

    console.log(`  ✅ Login API call successful (${response.status()})`);

    // Wait for redirection after successful login
    await page.waitForURL(/\/es\/(admin|client|employee|dashboard)/, { timeout: 15000 });

    console.log('  ✅ Login successful\n');
  } catch (error) {
    console.error(`  ❌ Login failed: ${error}`);

    // Take debug screenshot
    const timestamp = Date.now();
    await page.screenshot({ path: `debug-login-error-${timestamp}.png` });
    console.error(`  📸 Debug screenshot saved: debug-login-error-${timestamp}.png`);

    throw error;
  }
}

/**
 * Capture screenshot of a page
 */
async function captureScreenshot(
  page: Page,
  url: string,
  outputPath: string,
  retries = 3
): Promise<boolean> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`    📸 Capturing: ${url}`);

      // Navigate to the page
      await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      // Wait a bit for any animations to complete
      await page.waitForTimeout(1000);

      // Wait for main content to be visible (if exists)
      try {
        await page.waitForSelector('main, [role="main"], body > div', {
          state: 'visible',
          timeout: 5000
        });
      } catch {
        // Continue if no main content found
      }

      // Hide any loading spinners or skeletons
      await page.evaluate(() => {
        const loadingElements = document.querySelectorAll(
          '[role="progressbar"], [data-loading="true"], .skeleton, .spinner'
        );
        loadingElements.forEach(el => {
          (el as HTMLElement).style.display = 'none';
        });
      });

      // Take full-page screenshot
      await page.screenshot({
        path: outputPath,
        fullPage: true,
        animations: 'disabled'
      });

      console.log(`    ✅ Saved: ${outputPath}\n`);
      return true;

    } catch (error) {
      console.error(`    ⚠️ Attempt ${attempt}/${retries} failed: ${error}`);

      if (attempt === retries) {
        console.error(`    ❌ Failed after ${retries} attempts\n`);
        return false;
      }

      // Wait before retry
      await page.waitForTimeout(2000);
    }
  }

  return false;
}

/**
 * Capture screenshots for public routes (no auth required)
 */
async function capturePublicRoutes(browser: Browser) {
  console.log('🌐 Capturing PUBLIC routes...\n');

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    locale: 'es-ES',
    colorScheme: 'light'
  });

  const page = await context.newPage();

  let captured = 0;
  let failed = 0;

  // Auth routes
  console.log('  📂 Auth routes:');
  for (const route of ROUTES.public.auth) {
    const outputPath = path.join(SCREENSHOTS_DIR, 'public/auth', route.name);
    const success = await captureScreenshot(page, `${BASE_URL}${route.path}`, outputPath);
    if (success) captured++;
    else failed++;
  }

  // Other public routes
  console.log('  📂 Other public routes:');
  for (const route of ROUTES.public.other) {
    const outputPath = path.join(SCREENSHOTS_DIR, 'public/other', route.name);
    const success = await captureScreenshot(page, `${BASE_URL}${route.path}`, outputPath);
    if (success) captured++;
    else failed++;
  }

  await context.close();

  console.log(`✅ Public routes complete: ${captured} captured, ${failed} failed\n`);
}

/**
 * Capture screenshots for a specific role
 */
async function captureRoleRoutes(
  browser: Browser,
  role: 'admin' | 'client' | 'employee' | 'shared',
  credentials?: { email: string; password: string }
) {
  console.log(`👤 Capturing ${role.toUpperCase()} routes...\n`);

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    locale: 'es-ES',
    colorScheme: 'light'
  });

  const page = await context.newPage();

  // Login if credentials provided
  if (credentials) {
    await login(page, credentials.email, credentials.password);
  }

  let captured = 0;
  let failed = 0;

  // Iterate through all service folders for this role
  const roleRoutes = ROUTES[role];

  for (const [service, routes] of Object.entries(roleRoutes)) {
    console.log(`  📂 ${service}:`);

    for (const route of routes) {
      const outputPath = path.join(SCREENSHOTS_DIR, role, service, route.name);
      const success = await captureScreenshot(page, `${BASE_URL}${route.path}`, outputPath);
      if (success) captured++;
      else failed++;
    }
  }

  await context.close();

  console.log(`✅ ${role.toUpperCase()} routes complete: ${captured} captured, ${failed} failed\n`);
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Starting sitemap screenshot capture...\n');
  console.log(`📍 Base URL: ${BASE_URL}`);
  console.log(`📁 Output directory: ${SCREENSHOTS_DIR}\n`);

  // Ensure directories exist
  ensureDirectories();

  // Launch browser
  console.log('🌐 Launching browser...\n');
  const browser = await chromium.launch({
    headless: true
  });

  try {
    // Capture public routes
    await capturePublicRoutes(browser);

    // Capture admin routes
    await captureRoleRoutes(browser, 'admin', CREDENTIALS.admin);

    // Capture client routes
    await captureRoleRoutes(browser, 'client', CREDENTIALS.client);

    // Capture employee routes
    await captureRoleRoutes(browser, 'employee', CREDENTIALS.employee);

    // Capture shared routes (use any authenticated user)
    await captureRoleRoutes(browser, 'shared', CREDENTIALS.client);

    console.log('🎉 Screenshot capture complete!\n');

  } catch (error) {
    console.error('❌ Error during capture:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { main, captureScreenshot, ROUTES };
