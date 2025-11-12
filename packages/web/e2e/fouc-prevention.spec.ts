/**
 * E2E Tests for FOUC Prevention
 *
 * Tests verify that there is NO flash of unstyled content when:
 * - Page loads with dark mode active
 * - Navigating between pages
 * - Reloading the page
 */

import { test, expect } from '@playwright/test';

test.describe('FOUC Prevention - Dark Mode', () => {
  test.beforeEach(async ({ page }) => {
    // Set dark mode in localStorage BEFORE navigating
    await page.goto('/en');
    await page.evaluate(() => {
      localStorage.setItem('theme-mode', 'dark');
    });
  });

  test('should NOT show flash when loading test page in dark mode', async ({ page }) => {
    // Navigate to test page with dark mode set
    await page.goto('/en/test', { waitUntil: 'commit' });

    // Check if dark class is applied IMMEDIATELY (before React hydrates)
    const hasDarkClassEarly = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });

    // Dark class should be present from blocking script
    expect(hasDarkClassEarly).toBe(true);

    // Wait for page to fully hydrate
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500); // Wait for React effects

    // Check dark class is STILL present (no flash)
    const hasDarkClassAfter = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });

    // Should remain dark throughout (no FOUC)
    expect(hasDarkClassAfter).toBe(true);
  });

  test('should NOT show flash when loading login page in dark mode', async ({ page }) => {
    await page.goto('/en/auth/login', { waitUntil: 'commit' });

    const hasDarkClassEarly = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });

    expect(hasDarkClassEarly).toBe(true);

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const hasDarkClassAfter = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });

    expect(hasDarkClassAfter).toBe(true);
  });

  test('should NOT show flash when navigating between pages in dark mode', async ({ page }) => {
    // Start on test page
    await page.goto('/en/test');
    await page.waitForLoadState('networkidle');

    // Verify dark mode is active
    let isDark = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });
    expect(isDark).toBe(true);

    // Navigate to login
    await page.goto('/en/auth/login', { waitUntil: 'commit' });

    // Check dark class immediately after navigation starts
    const hasDarkDuringNav = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });

    expect(hasDarkDuringNav).toBe(true);

    await page.waitForLoadState('networkidle');

    // Verify still dark after full load
    isDark = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });
    expect(isDark).toBe(true);
  });

  test('should NOT show flash when reloading page in dark mode', async ({ page }) => {
    await page.goto('/en/test');
    await page.waitForLoadState('networkidle');

    // Verify dark mode
    let isDark = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });
    expect(isDark).toBe(true);

    // Reload the page
    await page.reload({ waitUntil: 'commit' });

    // Check dark class immediately after reload
    const hasDarkAfterReload = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });

    expect(hasDarkAfterReload).toBe(true);

    await page.waitForLoadState('networkidle');

    // Verify still dark
    isDark = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });
    expect(isDark).toBe(true);
  });
});

test.describe('FOUC Prevention - Light Mode', () => {
  test.beforeEach(async ({ page }) => {
    // Set light mode in localStorage BEFORE navigating
    await page.goto('/en');
    await page.evaluate(() => {
      localStorage.setItem('theme-mode', 'light');
    });
  });

  test('should NOT show flash when loading in light mode', async ({ page }) => {
    await page.goto('/en/test', { waitUntil: 'commit' });

    // Check if dark class is NOT applied
    const hasDarkClassEarly = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });

    expect(hasDarkClassEarly).toBe(false);

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const hasDarkClassAfter = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });

    // Should remain light (no FOUC to dark)
    expect(hasDarkClassAfter).toBe(false);
  });
});

test.describe('FOUC Prevention - System Mode', () => {
  test('should respect system preference when mode is system', async ({ page, browserName }) => {
    // Set system mode
    await page.goto('/en');
    await page.evaluate(() => {
      localStorage.setItem('theme-mode', 'system');
    });

    // Emulate dark color scheme preference
    await page.emulateMedia({ colorScheme: 'dark' });

    await page.goto('/en/test', { waitUntil: 'commit' });

    // Should have dark class because system prefers dark
    const hasDarkClass = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });

    expect(hasDarkClass).toBe(true);

    await page.waitForLoadState('networkidle');

    // Should still have dark class
    const hasDarkClassAfter = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });

    expect(hasDarkClassAfter).toBe(true);
  });
});

test.describe('Theme Mode Consistency', () => {
  test('should match theme-mode localStorage value with dark class', async ({ page }) => {
    // Test dark mode
    await page.goto('/en');
    await page.evaluate(() => {
      localStorage.setItem('theme-mode', 'dark');
    });

    await page.goto('/en/test');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const mode = await page.evaluate(() => {
      return localStorage.getItem('theme-mode');
    });

    const hasDarkClass = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });

    expect(mode).toBe('dark');
    expect(hasDarkClass).toBe(true);

    // Test light mode
    await page.evaluate(() => {
      localStorage.setItem('theme-mode', 'light');
    });

    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const modeAfter = await page.evaluate(() => {
      return localStorage.getItem('theme-mode');
    });

    const hasDarkClassAfter = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });

    expect(modeAfter).toBe('light');
    expect(hasDarkClassAfter).toBe(false);
  });
});
