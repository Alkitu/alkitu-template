import { test, expect } from '@playwright/test';

test('Debug category creation - capture network and console errors', async ({ page }) => {
  // Listen for console messages and errors
  const consoleLogs: { type: string; message: string }[] = [];
  page.on('console', (msg) => {
    consoleLogs.push({
      type: msg.type(),
      message: msg.text(),
    });
    console.log(`[CONSOLE ${msg.type().toUpperCase()}] ${msg.text()}`);
  });

  // Capture network requests
  const networkRequests: { url: string; method: string; status?: number; body?: string }[] = [];
  page.on('response', async (response) => {
    if (response.url().includes('/api/categories')) {
      const body = await response.text();
      const entry = {
        url: response.url(),
        method: response.request().method(),
        status: response.status(),
        body: body,
      };
      networkRequests.push(entry);
      console.log(`[API RESPONSE] ${response.request().method()} ${response.url()}`);
      console.log(`[STATUS] ${response.status()}`);
      console.log(`[BODY] ${body}`);
    }
  });

  // Listen for uncaught exceptions
  page.on('pageerror', (error) => {
    console.log(`[PAGE ERROR] ${error.message}`);
    console.log(`[STACK] ${error.stack}`);
  });

  // Navigate to categories page
  console.log('Navigating to categories page...');
  await page.goto('/es/admin/catalog/categories');
  await page.waitForLoadState('networkidle');

  // Wait for page to fully load
  await page.waitForTimeout(2000);

  // Look for "Add New Category" button
  console.log('Looking for "Add New Category" button...');
  const addButton = page.getByRole('button', { name: /añadir nueva categor|add new categor|crear categor/i });

  // Try different selectors if the role-based selector fails
  let buttonFound = await addButton.isVisible().catch(() => false);

  if (!buttonFound) {
    console.log('Button not found by role, searching by text...');
    const allButtons = await page.locator('button').all();
    for (let i = 0; i < allButtons.length; i++) {
      const text = await allButtons[i].textContent();
      console.log(`Button ${i}: "${text}"`);
      if (text && text.toLowerCase().includes('añadir') || text?.toLowerCase().includes('add new')) {
        console.log(`Found button at index ${i}: "${text}"`);
        await allButtons[i].click();
        buttonFound = true;
        break;
      }
    }
  } else {
    console.log('Clicking "Add New Category" button via role selector...');
    await addButton.click();
  }

  if (!buttonFound) {
    console.log('ERROR: Could not find "Add New Category" button');
    console.log('All button texts on page:');
    const buttons = await page.locator('button').all();
    for (const btn of buttons) {
      console.log(`  - "${await btn.textContent()}"`);
    }
  }

  // Wait for dialog/modal to appear
  await page.waitForTimeout(1000);

  // Find and fill the category name input
  console.log('Looking for category name input field...');
  const nameInput = page.getByLabel(/nombre|name/i).first();

  let inputFound = await nameInput.isVisible().catch(() => false);
  if (!inputFound) {
    console.log('Input not found by label, searching by placeholder...');
    const inputs = await page.locator('input[type="text"], textarea').all();
    for (let i = 0; i < inputs.length; i++) {
      const placeholder = await inputs[i].getAttribute('placeholder');
      const label = await inputs[i].getAttribute('aria-label');
      console.log(`Input ${i}: placeholder="${placeholder}", aria-label="${label}"`);
      if (placeholder?.toLowerCase().includes('nombre') || placeholder?.toLowerCase().includes('name') ||
          label?.toLowerCase().includes('nombre') || label?.toLowerCase().includes('name')) {
        console.log(`Found input at index ${i}`);
        await inputs[i].fill('Debug Test Category');
        inputFound = true;
        break;
      }
    }
  } else {
    console.log('Filling category name via label selector...');
    await nameInput.fill('Debug Test Category');
  }

  if (!inputFound) {
    console.log('ERROR: Could not find category name input');
    console.log('All inputs on page:');
    const inputs = await page.locator('input, textarea').all();
    for (let i = 0; i < inputs.length; i++) {
      const type = await inputs[i].getAttribute('type');
      const placeholder = await inputs[i].getAttribute('placeholder');
      const id = await inputs[i].getAttribute('id');
      console.log(`  Input ${i}: type="${type}", placeholder="${placeholder}", id="${id}"`);
    }
  }

  // Wait a bit for any validation
  await page.waitForTimeout(500);

  // Find and click the "Create Category" button
  console.log('Looking for "Create Category" button...');
  const createButton = page.getByRole('button', { name: /crear categor|create categor/i });

  let createButtonFound = await createButton.isVisible().catch(() => false);

  if (!createButtonFound) {
    console.log('Create button not found by role, searching by text...');
    const allButtons = await page.locator('button').all();
    for (let i = 0; i < allButtons.length; i++) {
      const text = await allButtons[i].textContent();
      if (text && (text.toLowerCase().includes('crear') || text.toLowerCase().includes('create') || text.toLowerCase().includes('submit'))) {
        const isVisible = await allButtons[i].isVisible();
        const isEnabled = await allButtons[i].isEnabled();
        console.log(`Button ${i}: "${text}" - visible: ${isVisible}, enabled: ${isEnabled}`);
        if (isVisible && isEnabled) {
          console.log(`Clicking create button at index ${i}`);
          await allButtons[i].click();
          createButtonFound = true;
          break;
        }
      }
    }
  } else {
    console.log('Clicking "Create Category" button via role selector...');
    await createButton.click();
  }

  if (!createButtonFound) {
    console.log('ERROR: Could not find or click "Create Category" button');
  }

  // Wait for the API request to complete
  console.log('Waiting for API response...');
  await page.waitForTimeout(3000);

  // Check for any error messages on the page
  console.log('Checking for error messages...');
  const errorElements = await page.locator('[role="alert"], .error, .toast').all();
  for (const element of errorElements) {
    const text = await element.textContent();
    console.log(`[PAGE ERROR MESSAGE] ${text}`);
  }

  // Print all captured data
  console.log('\n=== DEBUGGING SUMMARY ===');
  console.log('Console logs:', JSON.stringify(consoleLogs, null, 2));
  console.log('Network requests:', JSON.stringify(networkRequests, null, 2));
});
