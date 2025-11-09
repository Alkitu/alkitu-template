# Playwright Setup and Usage Guide

Complete guide for E2E testing with Playwright and MCP integration.

## Installation

```bash
cd packages/web
npm install -D @playwright/test
npx playwright install
```

## Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Example Test

```typescript
// tests/e2e/auth/login.spec.ts
import { test, expect } from '@playwright/test';

test('user can login successfully', async ({ page }) => {
  await page.goto('/auth/login');

  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Password').fill('SecurePass123!');
  await page.getByRole('button', { name: /sign in/i }).click();

  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByText(/welcome/i)).toBeVisible();
});

test('shows error for invalid credentials', async ({ page }) => {
  await page.goto('/auth/login');

  await page.getByLabel('Email').fill('wrong@example.com');
  await page.getByLabel('Password').fill('wrongpass');
  await page.getByRole('button', { name: /sign in/i }).click();

  await expect(page.getByText(/invalid credentials/i)).toBeVisible();
});
```

## MCP Integration

```typescript
// Using Playwright MCP tools in Claude Code

// Navigate
await mcp__playwright__browser_navigate({ url: 'http://localhost:3000' });

// Take screenshot
await mcp__playwright__browser_take_screenshot({
  filename: 'login-page.png',
  fullPage: true
});

// Click element
await mcp__playwright__browser_click({
  element: 'Login button',
  ref: '[data-testid="login-button"]'
});

// Evaluate JavaScript
await mcp__playwright__browser_evaluate({
  function: '() => document.querySelector("button").click()'
});
```

## Commands

```bash
# Run all E2E tests
npm run test:e2e

# Interactive UI mode
npm run test:e2e:ui

# Debug mode
npm run test:e2e:debug

# Generate tests (codegen)
npm run test:e2e:codegen
```

---

**Last Updated:** 2025-01-09
