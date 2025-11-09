# Testing Cheatsheet

Quick reference for testing in Alkitu Template.

## Commands

### Frontend (Vitest)
```bash
npm run test                 # Run once
npm run test:watch           # Watch mode
npm run test:ui              # UI mode
npm run test:coverage        # With coverage
npm run test Button.test     # Single file
```

### Frontend (Playwright E2E)
```bash
npm run test:e2e             # Run all E2E
npm run test:e2e:ui          # Interactive mode
npm run test:e2e:debug       # Debug mode
npm run test:e2e:codegen     # Generate tests
```

### Backend (Jest)
```bash
npm run test                 # Run once
npm run test:watch           # Watch mode
npm run test:cov             # With coverage
npm run test:mutation        # Stryker mutation
npm run quality:gates        # All checks
```

## Test Templates

### Unit Test (Vitest)
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<Component />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('handles click', async () => {
    const onClick = vi.fn();
    render(<Component onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
```

### E2E Test (Playwright)
```typescript
import { test, expect } from '@playwright/test';

test('user flow', async ({ page }) => {
  await page.goto('/path');
  await page.getByLabel('Input').fill('value');
  await page.getByRole('button').click();
  await expect(page).toHaveURL('/success');
});
```

### Backend Test (Jest)
```typescript
import { Test } from '@nestjs/testing';

describe('Service', () => {
  let service: Service;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [Service],
    }).compile();
    service = module.get(Service);
  });

  it('works', async () => {
    expect(await service.method()).toBeDefined();
  });
});
```

## Coverage Thresholds

| Type | Coverage | Speed |
|------|----------|-------|
| Atoms | 95%+ | <100ms |
| Molecules | 90%+ | <100ms |
| Organisms | 95%+ | <200ms |
| Services | 95%+ | <200ms |
| E2E | Critical paths | 5-10s |

## Common Queries

```typescript
// Testing Library
screen.getByRole('button', { name: /submit/i })
screen.getByLabelText('Email')
screen.getByText(/error message/i)
screen.getByTestId('custom-element')
screen.queryByText('optional')  // Returns null if not found

// Playwright
page.getByRole('button', { name: /submit/i })
page.getByLabel('Email')
page.getByText(/error/i)
page.locator('[data-testid="element"]')
```

## Assertions

```typescript
// Testing Library
expect(element).toBeInTheDocument()
expect(element).toHaveClass('className')
expect(element).toHaveTextContent('text')
expect(element).toBeDisabled()
expect(fn).toHaveBeenCalledWith(arg)

// Playwright
await expect(page).toHaveURL('/path')
await expect(locator).toBeVisible()
await expect(locator).toHaveText('text')
await expect(locator).toHaveClass('class')
```

## Mocking

```typescript
// Mock function
const mockFn = vi.fn()
mockFn.mockReturnValue('value')
mockFn.mockResolvedValue('async value')

// Mock module
vi.mock('@/lib/api', () => ({
  fetchUser: vi.fn(() => ({ id: '1', name: 'Test' }))
}))

// Mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: 'value' })
  })
)
```

## When to Use What

| Need | Use | Example |
|------|-----|---------|
| Test component props | Vitest | Button variants |
| Test user flow | Playwright | Login → Dashboard |
| Test API endpoint | Supertest/Jest | POST /api/users |
| Visual regression | Chromatic | Theme changes |
| Accessibility | jest-axe | ARIA compliance |

---

**Last Updated:** 2025-01-09
