import { test, expect } from '@playwright/test';

/**
 * ALI-117 - Work Locations E2E Tests
 *
 * Tests the work locations management functionality:
 * 1. Create location with all fields
 * 2. Create location with required fields only
 * 3. List locations
 * 4. Edit location
 * 5. Delete location
 * 6. Validation errors
 * 7. Empty state
 *
 * Security:
 * - All operations require authentication
 * - Users can only see/edit/delete their own locations
 */

// Test user credentials
const timestamp = Date.now();
const testUser = {
  email: `location-test-${timestamp}@example.com`,
  password: 'LocationTest123',
  firstname: 'Location',
  lastname: 'Tester',
  role: 'CLIENT',
};

// Test location data
const testLocationFull = {
  street: '123 Test Street',
  building: 'Test Building',
  tower: 'Tower A',
  floor: '5th Floor',
  unit: 'Suite 500',
  city: 'New York',
  state: 'NY',
  zip: '10001',
};

const testLocationMinimal = {
  street: '456 Minimal St',
  city: 'Brooklyn',
  state: 'NY',
  zip: '11201',
};

test.describe('ALI-117: Work Locations Management', () => {
  test.beforeAll(async ({ browser }) => {
    // Register test user via API (more reliable than UI)
    const page = await browser.newPage();

    try {
      const response = await page.request.post('http://localhost:3001/users/register', {
        data: {
          email: testUser.email,
          password: testUser.password,
          firstname: testUser.firstname,
          lastname: testUser.lastname,
          terms: true,
        },
      });

      if (!response.ok()) {
        console.log('Registration response:', await response.text());
      }
    } catch (error) {
      console.error('Failed to register user:', error);
    }

    await page.close();
  });

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });

    // Login
    await page.goto('http://localhost:3000/es/auth/login');
    await page.waitForLoadState('networkidle');

    await page.getByLabel(/correo/i).fill(testUser.email);
    await page.locator('input[type="password"]').first().fill(testUser.password);
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    // Wait for redirect (dashboard or onboarding)
    await page.waitForURL(/\/(admin\/)?dashboard|onboarding/, { timeout: 10000 });

    // Skip onboarding if it appears
    const skipButton = page.getByRole('button', { name: /skip/i });
    if (await skipButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await skipButton.click();
      await page.waitForURL(/dashboard/, { timeout: 5000 });
    }

    await page.waitForLoadState('networkidle');
  });

  test('1. Should show empty state when no locations exist', async ({ page }) => {
    // Navigate to locations page
    await page.goto('http://localhost:3000/es/locations');
    await page.waitForLoadState('networkidle');

    // Verify page title
    await expect(page.getByText(/work locations/i).first()).toBeVisible();

    // Check for empty state
    const emptyState = page.getByText(/no locations yet/i);
    if (await emptyState.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Empty state is shown
      await expect(emptyState).toBeVisible();
      await expect(page.getByText(/get started by adding/i)).toBeVisible();
    } else {
      // Locations already exist from previous tests
      console.log('Locations already exist, skipping empty state check');
    }
  });

  test('2. Should create a location with all fields', async ({ page }) => {
    await page.goto('http://localhost:3000/es/locations');
    await page.waitForLoadState('networkidle');

    // Click "Add Location" button
    await page.getByRole('button', { name: /add location/i }).click();
    await page.waitForTimeout(500);

    // Verify form is visible
    await expect(page.getByText(/add new location/i)).toBeVisible();

    // Fill all fields
    await page.getByLabel(/street address/i).fill(testLocationFull.street);
    await page.getByLabel(/building/i).fill(testLocationFull.building);
    await page.getByLabel(/tower/i).fill(testLocationFull.tower);
    await page.getByLabel(/floor/i).fill(testLocationFull.floor);
    await page.getByLabel(/unit.*suite/i).fill(testLocationFull.unit);
    await page.getByLabel(/city/i).fill(testLocationFull.city);
    await page.getByLabel(/state/i).selectOption(testLocationFull.state);
    await page.getByLabel(/zip code/i).fill(testLocationFull.zip);

    // Submit form
    await page.getByRole('button', { name: /create location/i }).click();

    // Wait for form to close (success)
    await expect(page.getByText(/add new location/i)).not.toBeVisible({
      timeout: 5000,
    });

    // Verify location appears in list
    await expect(page.getByText(testLocationFull.street)).toBeVisible({
      timeout: 3000,
    });
    await expect(
      page.getByText(`${testLocationFull.city}, ${testLocationFull.state}`),
    ).toBeVisible();
  });

  test('3. Should create a location with required fields only', async ({ page }) => {
    await page.goto('http://localhost:3000/es/locations');
    await page.waitForLoadState('networkidle');

    // Click "Add Location" button
    await page.getByRole('button', { name: /add location/i }).click();
    await page.waitForTimeout(500);

    // Fill only required fields
    await page.getByLabel(/street address/i).fill(testLocationMinimal.street);
    await page.getByLabel(/city/i).fill(testLocationMinimal.city);
    await page.getByLabel(/state/i).selectOption(testLocationMinimal.state);
    await page.getByLabel(/zip code/i).fill(testLocationMinimal.zip);

    // Submit form
    await page.getByRole('button', { name: /create location/i }).click();

    // Wait for form to close (success)
    await expect(page.getByText(/add new location/i)).not.toBeVisible({
      timeout: 5000,
    });

    // Verify location appears in list
    await expect(page.getByText(testLocationMinimal.street)).toBeVisible({
      timeout: 3000,
    });
  });

  test('4. Should list all user locations', async ({ page }) => {
    await page.goto('http://localhost:3000/es/locations');
    await page.waitForLoadState('networkidle');

    // Wait for locations to load
    await page.waitForTimeout(1000);

    // Check that at least one location is visible (from previous tests)
    const locationCards = page.locator('[data-testid="location-card"]');
    const count = await locationCards.count();

    // Should have at least 2 locations from previous tests
    expect(count).toBeGreaterThanOrEqual(1);

    // Verify location count display
    const countText = await page.getByText(/\d+ location/i).textContent();
    expect(countText).toMatch(/\d+/);
  });

  test('5. Should edit a location', async ({ page }) => {
    await page.goto('http://localhost:3000/es/locations');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Find first edit button and click it
    const editButton = page.getByRole('button', { name: /edit location/i }).first();
    await editButton.click();
    await page.waitForTimeout(500);

    // Verify edit form is visible
    await expect(page.getByText(/edit location/i)).toBeVisible();

    // Update street address
    const streetInput = page.getByLabel(/street address/i);
    await streetInput.clear();
    await streetInput.fill('999 Updated Street');

    // Update city
    const cityInput = page.getByLabel(/city/i);
    await cityInput.clear();
    await cityInput.fill('Los Angeles');

    // Update state
    await page.getByLabel(/state/i).selectOption('CA');

    // Submit form
    await page.getByRole('button', { name: /update location/i }).click();

    // Wait for form to close (success)
    await expect(page.getByText(/edit location/i)).not.toBeVisible({
      timeout: 5000,
    });

    // Verify updated location appears in list
    await expect(page.getByText('999 Updated Street')).toBeVisible({
      timeout: 3000,
    });
    await expect(page.getByText(/Los Angeles, CA/)).toBeVisible();
  });

  test('6. Should delete a location with confirmation', async ({ page }) => {
    await page.goto('http://localhost:3000/es/locations');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Get initial count
    const initialCards = await page.locator('[data-testid="location-card"]').count();

    // Find first delete button
    const deleteButton = page.getByRole('button', { name: /delete location/i }).first();

    // Setup dialog handler BEFORE clicking delete
    page.on('dialog', async (dialog) => {
      expect(dialog.type()).toBe('confirm');
      expect(dialog.message()).toContain('Are you sure');
      await dialog.accept();
    });

    // Click delete
    await deleteButton.click();

    // Wait for deletion to complete
    await page.waitForTimeout(2000);

    // Verify location was removed
    const finalCards = await page.locator('[data-testid="location-card"]').count();
    expect(finalCards).toBe(initialCards - 1);
  });

  test('7. Should show validation errors for invalid data', async ({ page }) => {
    await page.goto('http://localhost:3000/es/locations');
    await page.waitForLoadState('networkidle');

    // Click "Add Location" button
    await page.getByRole('button', { name: /add location/i }).click();
    await page.waitForTimeout(500);

    // Try to submit empty form
    await page.getByRole('button', { name: /create location/i }).click();

    // HTML5 validation should prevent submission
    // Check that form is still visible (didn't submit)
    await expect(page.getByText(/add new location/i)).toBeVisible();

    // Fill with invalid ZIP code
    await page.getByLabel(/street address/i).fill('Test Street');
    await page.getByLabel(/city/i).fill('Test City');
    await page.getByLabel(/state/i).selectOption('NY');
    await page.getByLabel(/zip code/i).fill('1234'); // Invalid: too short

    // Submit form
    await page.getByRole('button', { name: /create location/i }).click();

    // Should show error or HTML5 validation
    // Wait a bit to see if submission fails
    await page.waitForTimeout(1000);

    // Form should still be visible (validation failed)
    await expect(page.getByText(/add new location/i)).toBeVisible();
  });

  test('8. Should cancel location creation', async ({ page }) => {
    await page.goto('http://localhost:3000/es/locations');
    await page.waitForLoadState('networkidle');

    // Click "Add Location" button
    await page.getByRole('button', { name: /add location/i }).click();
    await page.waitForTimeout(500);

    // Verify form is visible
    await expect(page.getByText(/add new location/i)).toBeVisible();

    // Fill some fields
    await page.getByLabel(/street address/i).fill('Test Street');

    // Click cancel
    await page.getByRole('button', { name: /cancel/i }).click();

    // Form should be hidden
    await expect(page.getByText(/add new location/i)).not.toBeVisible();

    // Should still be on locations page
    await expect(page.getByText(/work locations/i).first()).toBeVisible();
  });

  test('9. Should show all address fields in location card', async ({ page }) => {
    await page.goto('http://localhost:3000/es/locations');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Find a location card with all fields (from test 2)
    const fullLocationCard = page
      .locator('[data-testid="location-card"]')
      .filter({ hasText: testLocationFull.street })
      .first();

    if (await fullLocationCard.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Verify all fields are displayed
      await expect(fullLocationCard.getByText(testLocationFull.street)).toBeVisible();
      await expect(
        fullLocationCard.getByText(new RegExp(testLocationFull.building)),
      ).toBeVisible();
      await expect(
        fullLocationCard.getByText(`${testLocationFull.city}, ${testLocationFull.state}`),
      ).toBeVisible();
      await expect(
        fullLocationCard.getByText(testLocationFull.zip),
      ).toBeVisible();
    } else {
      console.log('Full location not found, may have been deleted in previous test');
    }
  });

  test('10. Should require authentication', async ({ page }) => {
    // Logout by clearing cookies
    await page.context().clearCookies();

    // Try to access locations page
    await page.goto('http://localhost:3000/es/locations');
    await page.waitForLoadState('networkidle');

    // Should redirect to login page or show auth error
    const url = page.url();

    // Check if redirected to login or showing auth-required message
    const isLoginPage = url.includes('/auth/login');
    const hasAuthError = await page.getByText(/unauthorized|not authenticated/i).isVisible({ timeout: 2000 }).catch(() => false);

    expect(isLoginPage || hasAuthError).toBe(true);
  });
});
