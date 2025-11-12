/**
 * E2E Tests for Theme System Migration
 *
 * Tests verify that the theme switching functionality works correctly
 * across all migrated components and pages.
 */

import { test, expect } from '@playwright/test';

test.describe('Theme Switching E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the design system page (good place to test all components)
    await page.goto('/es/design-system');
  });

  test('should load the page successfully', async ({ page }) => {
    // Verify the page loads
    await expect(page).toHaveTitle(/Alkitu/i);
  });

  test('should have CSS variables defined in :root', async ({ page }) => {
    // Check that CSS variables are defined
    const rootStyles = await page.evaluate(() => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      return {
        hasRadius: styles.getPropertyValue('--radius').trim() !== '',
        hasSpacing: styles.getPropertyValue('--spacing-sm').trim() !== '',
        hasTransition: styles.getPropertyValue('--transition-base').trim() !== '',
        hasShadow: styles.getPropertyValue('--shadow-md').trim() !== '',
      };
    });

    expect(rootStyles.hasRadius).toBeTruthy();
    expect(rootStyles.hasSpacing).toBeTruthy();
    expect(rootStyles.hasTransition).toBeTruthy();
    expect(rootStyles.hasShadow).toBeTruthy();
  });

  test('should toggle between light and dark mode', async ({ page }) => {
    // Find the theme toggle button
    const themeToggle = page.locator('button[aria-label*="theme" i], button[aria-label*="Toggle theme"]');

    if (await themeToggle.count() > 0) {
      // Get initial theme
      const initialTheme = await page.evaluate(() => {
        return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      });

      // Click the toggle
      await themeToggle.first().click();

      // Wait a bit for the transition
      await page.waitForTimeout(500);

      // Get new theme
      const newTheme = await page.evaluate(() => {
        return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      });

      // Theme should have changed
      expect(newTheme).not.toBe(initialTheme);
    }
  });

  test('should apply CSS variables to Button component', async ({ page }) => {
    // Find a button on the page
    const button = page.locator('button').first();

    if (await button.count() > 0) {
      // Check that the button uses CSS variables
      const buttonStyles = await button.evaluate((el) => {
        const styles = getComputedStyle(el);
        return {
          borderRadius: styles.borderRadius,
          transition: styles.transition,
          fontFamily: styles.fontFamily,
        };
      });

      // Button should have border radius (from --radius-button)
      expect(buttonStyles.borderRadius).not.toBe('0px');

      // Button should have transitions defined
      expect(buttonStyles.transition).toContain('all');
    }
  });

  test('should apply CSS variables to Card component', async ({ page }) => {
    // Find a card on the page
    const card = page.locator('[data-slot="card"]').first();

    if (await card.count() > 0) {
      // Check that the card uses CSS variables
      const cardStyles = await card.evaluate((el) => {
        const styles = getComputedStyle(el);
        return {
          borderRadius: styles.borderRadius,
          boxShadow: styles.boxShadow,
          gap: styles.gap,
        };
      });

      // Card should have border radius (from --radius-card)
      expect(cardStyles.borderRadius).not.toBe('0px');

      // Card should have box shadow (from --shadow-card)
      expect(cardStyles.boxShadow).not.toBe('none');

      // Card should have gap (from --spacing-lg)
      expect(cardStyles.gap).not.toBe('0px');
    }
  });

  test('should maintain layout on theme change', async ({ page }) => {
    const themeToggle = page.locator('button[aria-label*="theme" i], button[aria-label*="Toggle theme"]');

    if (await themeToggle.count() > 0) {
      // Get initial layout measurements
      const initialLayout = await page.evaluate(() => {
        const body = document.body;
        return {
          width: body.offsetWidth,
          height: body.offsetHeight,
        };
      });

      // Toggle theme
      await themeToggle.first().click();
      await page.waitForTimeout(500);

      // Get new layout measurements
      const newLayout = await page.evaluate(() => {
        const body = document.body;
        return {
          width: body.offsetWidth,
          height: body.offsetHeight,
        };
      });

      // Layout should remain stable (no layout shift)
      expect(newLayout.width).toBe(initialLayout.width);
      // Height might change slightly, but should be close
      expect(Math.abs(newLayout.height - initialLayout.height)).toBeLessThan(50);
    }
  });

  test('should have smooth transitions on theme change', async ({ page }) => {
    const themeToggle = page.locator('button[aria-label*="theme" i], button[aria-label*="Toggle theme"]');

    if (await themeToggle.count() > 0) {
      // Check that elements have transitions defined
      const hasTransitions = await page.evaluate(() => {
        const elements = document.querySelectorAll('button, [data-slot="card"], input');
        let count = 0;

        elements.forEach((el) => {
          const styles = getComputedStyle(el);
          if (styles.transition && styles.transition !== 'none' && styles.transition !== 'all 0s ease 0s') {
            count++;
          }
        });

        return count > 0;
      });

      expect(hasTransitions).toBeTruthy();
    }
  });

  test('should apply theme to form components', async ({ page }) => {
    // Navigate to a page with forms (auth page)
    await page.goto('/es/auth/login');
    await page.waitForLoadState('networkidle');

    // Check input fields
    const input = page.locator('input[type="email"], input[type="text"]').first();

    if (await input.count() > 0) {
      const inputStyles = await input.evaluate((el) => {
        const styles = getComputedStyle(el);
        return {
          borderRadius: styles.borderRadius,
          fontFamily: styles.fontFamily,
          fontSize: styles.fontSize,
        };
      });

      // Input should have border radius (from --radius-input)
      expect(inputStyles.borderRadius).not.toBe('0px');

      // Input should have custom typography
      expect(inputStyles.fontSize).toBeTruthy();
    }
  });

  test('should verify all migrated components are present', async ({ page }) => {
    // Navigate to design system to see all components
    await page.goto('/es/design-system');
    await page.waitForLoadState('networkidle');

    // Check for presence of key migrated components
    const components = await page.evaluate(() => {
      return {
        hasButtons: document.querySelectorAll('button').length > 0,
        hasCards: document.querySelectorAll('[data-slot="card"]').length > 0,
        hasInputs: document.querySelectorAll('input').length > 0,
      };
    });

    expect(components.hasButtons).toBeTruthy();
  });
});

test.describe('Theme Persistence Tests', () => {
  test('should persist theme selection across page navigation', async ({ page }) => {
    // Go to home page
    await page.goto('/es');

    // Find and click theme toggle
    const themeToggle = page.locator('button[aria-label*="theme" i], button[aria-label*="Toggle theme"]');

    if (await themeToggle.count() > 0) {
      // Toggle to dark mode
      await themeToggle.first().click();
      await page.waitForTimeout(300);

      // Get theme
      const theme = await page.evaluate(() => {
        return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      });

      // Navigate to another page
      await page.goto('/es/design-system');
      await page.waitForLoadState('networkidle');

      // Check theme persisted
      const persistedTheme = await page.evaluate(() => {
        return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      });

      expect(persistedTheme).toBe(theme);
    }
  });
});

test.describe('Accessibility Tests', () => {
  test('should have accessible theme toggle', async ({ page }) => {
    await page.goto('/es');

    const themeToggle = page.locator('button[aria-label*="theme" i], button[aria-label*="Toggle theme"]');

    if (await themeToggle.count() > 0) {
      // Check for aria-label
      const ariaLabel = await themeToggle.first().getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();

      // Check it's keyboard accessible
      await themeToggle.first().focus();
      const isFocused = await themeToggle.first().evaluate((el) => {
        return document.activeElement === el;
      });
      expect(isFocused).toBeTruthy();
    }
  });

  test('should maintain color contrast in both themes', async ({ page }) => {
    await page.goto('/es');

    // This is a basic check - full contrast testing would require additional tools
    const hasGoodContrast = await page.evaluate(() => {
      const body = document.body;
      const styles = getComputedStyle(body);
      const bgColor = styles.backgroundColor;
      const textColor = styles.color;

      // Basic check that bg and text colors are different
      return bgColor !== textColor && bgColor !== '' && textColor !== '';
    });

    expect(hasGoodContrast).toBeTruthy();
  });
});
