# Frontend Testing Guide

Complete guide for testing frontend components, hooks, and utilities in the Alkitu Template.

## Overview

This guide covers:
- Unit testing with Vitest + Testing Library
- E2E testing with Playwright
- Visual regression with Storybook + Chromatic
- Accessibility testing with jest-axe

## Table of Contents

1. [Setup](#setup)
2. [Testing Atoms](#testing-atoms)
3. [Testing Molecules](#testing-molecules)
4. [Testing Organisms](#testing-organisms)
5. [Testing Hooks](#testing-hooks)
6. [Storybook Integration](#storybook-integration)
7. [E2E Testing](#e2e-testing)
8. [Accessibility Testing](#accessibility-testing)
9. [Best Practices](#best-practices)

---

## Setup

### Install Dependencies

```bash
cd packages/web

# Already installed in the project:
# - vitest
# - @testing-library/react
# - @testing-library/user-event
# - @testing-library/jest-dom
# - jest-axe
# - @playwright/test (needs to be added)

# Install Playwright (if not done yet)
npm install -D @playwright/test
npx playwright install
```

### Configuration Files

#### vitest.config.ts

```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/setupTests.ts',
        '**/*.types.ts',
        '**/*.stories.tsx',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

#### src/setupTests.ts

```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/test',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
```

---

## Testing Atoms

Atoms are the smallest UI components. They require comprehensive testing due to their reusability.

### Test Structure for Atoms

```typescript
// Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Button } from './Button';

describe('Button Atom', () => {
  // 1. Rendering Tests
  describe('Rendering', () => {
    it('renders children correctly', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button')).toHaveTextContent('Click me');
    });

    it('applies default variant and size', () => {
      render(<Button>Default</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-primary', 'h-10');
    });
  });

  // 2. Variant Tests (test all variants)
  describe('Variants', () => {
    it.each([
      ['primary', 'bg-primary'],
      ['secondary', 'bg-secondary'],
      ['outline', 'border-input'],
      ['ghost', 'hover:bg-accent'],
      ['destructive', 'bg-destructive'],
    ])('applies %s variant', (variant, expectedClass) => {
      render(<Button variant={variant as any}>{variant}</Button>);
      expect(screen.getByRole('button')).toHaveClass(expectedClass);
    });
  });

  // 3. Size Tests
  describe('Sizes', () => {
    it.each([
      ['sm', 'h-9'],
      ['md', 'h-10'],
      ['lg', 'h-11'],
    ])('applies %s size', (size, expectedClass) => {
      render(<Button size={size as any}>Button</Button>);
      expect(screen.getByRole('button')).toHaveClass(expectedClass);
    });
  });

  // 4. Interaction Tests
  describe('Interactions', () => {
    it('handles click events', async () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click</Button>);

      await userEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not fire onClick when disabled', async () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick} disabled>Disabled</Button>);

      await userEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('prevents click when loading', async () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick} loading>Loading</Button>);

      await userEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  // 5. Props Tests
  describe('Props', () => {
    it('applies fullWidth class', () => {
      render(<Button fullWidth>Full Width</Button>);
      expect(screen.getByRole('button')).toHaveClass('w-full');
    });

    it('merges custom className', () => {
      render(<Button className="custom">Custom</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom', 'inline-flex');
    });
  });

  // 6. Accessibility Tests
  describe('Accessibility', () => {
    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Button ref={ref}>Button</Button>);
      expect(ref).toHaveBeenCalled();
    });

    it('should not have accessibility violations', async () => {
      const { container } = render(<Button>Accessible</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('is keyboard accessible', async () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Button</Button>);

      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();

      await userEvent.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalled();
    });
  });

  // 7. Theme Integration Tests
  describe('Theme Integration', () => {
    it('uses CSS variables for colors', () => {
      render(<Button variant="primary">Themed</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-primary');
    });
  });

  // 8. Edge Cases
  describe('Edge Cases', () => {
    it('handles asChild prop', () => {
      render(
        <Button asChild>
          <a href="/test">Link</a>
        </Button>
      );
      expect(screen.getByRole('link')).toHaveTextContent('Link');
    });

    it('shows loading text when loading', () => {
      render(<Button loading>Submit</Button>);
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });
});
```

### Minimum Requirements for Atoms

- ✅ 8-10 test cases minimum
- ✅ 95%+ code coverage
- ✅ Test all variants
- ✅ Test all sizes
- ✅ Test interactions (click, hover, focus)
- ✅ Accessibility check
- ✅ Ref forwarding
- ✅ Custom className merging

---

## Testing Molecules

Molecules combine atoms. Focus on component composition and interaction.

### Example: FormField Molecule

```typescript
// FormField.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormField } from './FormField';

describe('FormField Molecule', () => {
  // 1. Rendering with composition
  describe('Rendering', () => {
    it('renders label and input', () => {
      render(
        <FormField label="Email" name="email">
          <input type="email" />
        </FormField>
      );

      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('renders error message when provided', () => {
      render(
        <FormField label="Email" name="email" error="Invalid email">
          <input type="email" />
        </FormField>
      );

      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });
  });

  // 2. Props composition
  describe('Props Composition', () => {
    it('passes required attribute to input', () => {
      render(
        <FormField label="Email" name="email" required>
          <input type="email" />
        </FormField>
      );

      expect(screen.getByLabelText('Email')).toBeRequired();
    });
  });

  // 3. Error states
  describe('Error States', () => {
    it('applies error styles when error exists', () => {
      render(
        <FormField label="Email" name="email" error="Error">
          <input type="email" />
        </FormField>
      );

      const container = screen.getByLabelText('Email').closest('div');
      expect(container).toHaveClass('border-destructive');
    });
  });

  // 4. Accessibility
  describe('Accessibility', () => {
    it('associates label with input using htmlFor', () => {
      render(
        <FormField label="Email" name="email">
          <input type="email" id="email" />
        </FormField>
      );

      const label = screen.getByText('Email');
      const input = screen.getByLabelText('Email');
      expect(label).toHaveAttribute('for', 'email');
    });

    it('includes aria-describedby for error messages', () => {
      render(
        <FormField label="Email" name="email" error="Error">
          <input type="email" aria-describedby="email-error" />
        </FormField>
      );

      expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby');
    });
  });
});
```

### Minimum Requirements for Molecules

- ✅ 5-8 test cases minimum
- ✅ 90%+ code coverage
- ✅ Test component composition
- ✅ Test props passing to children
- ✅ Test error/success states
- ✅ Accessibility

---

## Testing Organisms

Organisms are complex components with business logic. Require thorough testing.

### Example: LoginFormOrganism

```typescript
// LoginFormOrganism.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginFormOrganism } from './LoginFormOrganism';

// Mock dependencies
vi.mock('@/context/TranslationContext', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/hooks/useAuthRedirect', () => ({
  useAuthRedirect: () => ({
    redirectAfterLogin: vi.fn(),
  }),
}));

global.fetch = vi.fn();

describe('LoginFormOrganism', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. Form rendering
  it('renders all form elements', () => {
    render(<LoginFormOrganism />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  // 2. Input changes
  it('updates email value on change', async () => {
    render(<LoginFormOrganism />);

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    await userEvent.type(emailInput, 'test@example.com');

    expect(emailInput.value).toBe('test@example.com');
  });

  // 3. Form submission
  it('calls API on form submit', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ user: { email: 'test@test.com' } }),
    });

    render(<LoginFormOrganism />);

    await userEvent.type(screen.getByLabelText(/email/i), 'test@test.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@test.com', password: 'password123' }),
      });
    });
  });

  // 4. Success state
  it('shows success message on successful login', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: 'Success' }),
    });

    render(<LoginFormOrganism />);

    await userEvent.type(screen.getByLabelText(/email/i), 'test@test.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/success/i)).toBeInTheDocument();
    });
  });

  // 5. Error state
  it('shows error message on failed login', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: 'Invalid credentials' }),
    });

    render(<LoginFormOrganism />);

    await userEvent.type(screen.getByLabelText(/email/i), 'test@test.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'wrong');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  // 6. Loading state
  it('disables form during submission', async () => {
    (global.fetch as any).mockImplementation(() =>
      new Promise(resolve => setTimeout(resolve, 100))
    );

    render(<LoginFormOrganism />);

    await userEvent.type(screen.getByLabelText(/email/i), 'test@test.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  // 7-10. Additional tests for validation, routing, etc.
});
```

### Minimum Requirements for Organisms

- ✅ 10-15 test cases minimum
- ✅ 95%+ code coverage
- ✅ Test all user flows
- ✅ Test API integration (mocked)
- ✅ Test loading/error/success states
- ✅ Test form validation
- ✅ Test routing/navigation

---

## Testing Hooks

### Example: useAuthRedirect Hook

```typescript
// useAuthRedirect.test.ts
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAuthRedirect } from './useAuthRedirect';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('useAuthRedirect', () => {
  it('redirects to dashboard after login', async () => {
    const { result } = renderHook(() => useAuthRedirect());

    result.current.redirectAfterLogin();

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('redirects to callback URL if provided', async () => {
    const { result } = renderHook(() => useAuthRedirect('/settings'));

    result.current.redirectAfterLogin();

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/settings');
    });
  });
});
```

---

## Storybook Integration

### Creating Stories

```typescript
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from './Button';

const meta = {
  title: 'Atomic Design/Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    chromatic: {
      viewports: [320, 768, 1200],
      diffThreshold: 0.2,
    },
  },
  tags: ['autodocs'],
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { children: 'Primary', variant: 'primary' },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  ),
};
```

---

## E2E Testing

See [Playwright Setup and Usage Guide](./playwright-setup-and-usage.md) for detailed E2E testing instructions.

### Quick Example

```typescript
// tests/e2e/login.spec.ts
import { test, expect } from '@playwright/test';

test('user can login', async ({ page }) => {
  await page.goto('/auth/login');

  await page.getByLabel('Email').fill('test@test.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: /sign in/i }).click();

  await expect(page).toHaveURL('/dashboard');
});
```

---

## Accessibility Testing

```typescript
it('has no accessibility violations', async () => {
  const { container } = render(<Button>Accessible</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## Best Practices

1. **Co-locate tests**: Place `Component.test.tsx` next to `Component.tsx`
2. **Use Testing Library queries**: Prefer `getByRole`, `getByLabelText` over `getByTestId`
3. **Test user behavior**: Test what users see/do, not implementation details
4. **Mock external dependencies**: API calls, navigation, context
5. **Use describe blocks**: Organize tests logically
6. **Write descriptive test names**: Clear intent and expected outcome
7. **Test accessibility**: Include `axe` checks
8. **Keep tests simple**: One assertion per test when possible
9. **Use factories**: Create reusable test data generators
10. **Run tests frequently**: Use watch mode during development

---

## Commands

```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch

# UI mode
npm run test:ui

# Coverage
npm run test:coverage

# Single file
npm run test Button.test.tsx
```

---

## Related Documentation

- [Component Structure and Testing](/docs/00-conventions/component-structure-and-testing.md)
- [Testing Strategy and Frameworks](/docs/00-conventions/testing-strategy-and-frameworks.md)
- [Playwright Setup and Usage](./playwright-setup-and-usage.md)
- [Testing Cheatsheet](./testing-cheatsheet.md)
- [Backend Testing Guide](./backend-testing-guide.md)

---

**Last Updated:** 2025-01-09
**Maintained By:** Development Team
