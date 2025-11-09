# Component Structure and Testing Convention

This document defines the standard file structure and testing conventions for all UI components in the Alkitu Template project following Atomic Design methodology.

## Purpose

Establishing a consistent component structure ensures:
- **Predictability**: Developers know exactly where to find component files and tests
- **Maintainability**: Clear separation of concerns makes updates easier
- **Testability**: Co-located tests improve test coverage and discoverability
- **Scalability**: Structure supports growth from atoms to complex organisms
- **Collaboration**: Team members can navigate codebase efficiently

## Component File Structure

### Standard Structure (MUST Follow)

Every component MUST follow this exact structure:

```
packages/web/src/components/atomic-design/[atoms|molecules|organisms]/[component-name]/
├── [ComponentName].tsx           # Main component implementation (REQUIRED)
├── [ComponentName].types.ts      # TypeScript types and interfaces (REQUIRED)
├── [ComponentName].test.tsx      # Unit tests with Vitest (REQUIRED)
├── [ComponentName].stories.tsx   # Storybook stories (REQUIRED for shared components)
├── [ComponentName].figma.tsx     # Figma Connect mapping (OPTIONAL)
└── index.ts                      # Public exports (REQUIRED)
```

### File Naming Rules

1. **PascalCase** for component names: `Button.tsx`, `LoginFormOrganism.tsx`
2. **Same base name** for all files: `Button.tsx`, `Button.types.ts`, `Button.test.tsx`
3. **NO underscores** in filenames: ❌ `Button_Component.tsx`
4. **NO spaces** in filenames: ❌ `Button Component.tsx`
5. **Descriptive suffixes**: `.test.tsx` NOT `.spec.tsx`

## Testing File Conventions

### Test File Location (CRITICAL RULE)

✅ **DO**: Place tests NEXT TO the component

```
atoms/button/
├── Button.tsx
├── Button.types.ts
├── Button.test.tsx          ✅ CORRECT
├── Button.stories.tsx
└── index.ts
```

❌ **DO NOT**: Create separate `__tests__` folders

```
atoms/button/
├── __tests__/               ❌ WRONG
│   └── Button.test.tsx      ❌ WRONG
├── Button.tsx
└── Button.types.ts
```

**Rationale**: Co-located tests are easier to find, maintain, and ensure tests are written for every component.

### Test File Naming

- **Unit tests**: `ComponentName.test.tsx` (NOT `.spec.tsx`)
- **Integration tests**: `ComponentName.integration.test.tsx`
- **E2E tests**: `component-flow.spec.ts` (in `/tests/e2e/` directory)

## Component Type Structures

### 1. Atom Component Structure

**Example: Button Atom**

```
packages/web/src/components/atomic-design/atoms/button/
├── Button.tsx                # 150-200 lines
├── Button.types.ts           # 30-50 lines
├── Button.test.tsx           # 200-300 lines (8-10 tests)
├── Button.stories.tsx        # 150-200 lines (10+ stories)
├── Button.figma.tsx          # 50-100 lines
└── index.ts                  # 5-10 lines
```

**Testing Requirements for Atoms:**
- Minimum 8 test cases
- Coverage: 95%+
- Test categories:
  1. Rendering tests (2-3 tests)
  2. Variant tests (1 test per variant)
  3. Size tests (1 test per size)
  4. Interaction tests (2-3 tests)
  5. Props tests (2-3 tests)
  6. Accessibility tests (1-2 tests)
  7. Theme integration tests (1-2 tests)
  8. Edge cases (1-2 tests)

### 2. Molecule Component Structure

**Example: FormField Molecule**

```
packages/web/src/components/atomic-design/molecules/form-field/
├── FormField.tsx             # 100-150 lines
├── FormField.types.ts        # 20-40 lines
├── FormField.test.tsx        # 150-200 lines (5-8 tests)
├── FormField.stories.tsx     # 100-150 lines (5+ stories)
└── index.ts                  # 5-10 lines
```

**Testing Requirements for Molecules:**
- Minimum 5 test cases
- Coverage: 90%+
- Test categories:
  1. Rendering with children (1-2 tests)
  2. Props composition (2-3 tests)
  3. Interaction flows (1-2 tests)
  4. Error states (1-2 tests)
  5. Accessibility (1 test)

### 3. Organism Component Structure

**Example: LoginFormOrganism**

```
packages/web/src/components/atomic-design/organisms/auth/
├── LoginFormOrganism.tsx          # 150-200 lines
├── LoginFormOrganism.types.ts     # 30-50 lines
├── LoginFormOrganism.test.tsx     # 300-400 lines (10-15 tests)
├── LoginFormOrganism.stories.tsx  # 100-150 lines (5+ stories)
└── index.ts                       # 5-10 lines
```

**Testing Requirements for Organisms:**
- Minimum 10 test cases
- Coverage: 95%+
- Test categories:
  1. Form rendering (1-2 tests)
  2. Input changes (2-3 tests)
  3. Form submission (2-3 tests)
  4. API integration (2-3 tests)
  5. Success/error states (2-3 tests)
  6. Loading states (1-2 tests)
  7. Validation (2-3 tests)
  8. Navigation/routing (1-2 tests)

## Complete Example: Button Atom

### Button.tsx

```typescript
'use client';

import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
import type { ButtonProps } from './Button.types';

/**
 * Button Component - Atomic Design Atom
 *
 * A themeable button component with multiple variants and sizes.
 * Supports all standard button props plus custom theming.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      disabled = false,
      loading = false,
      fullWidth = false,
      children,
      className = '',
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const variantClasses = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
      outline: 'border border-input bg-background hover:bg-accent',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    }[variant];

    const sizeClasses = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-10 px-4 py-2',
      lg: 'h-11 px-8 text-lg',
    }[size];

    const classes = cn(
      'inline-flex items-center justify-center rounded-md font-medium',
      'transition-colors focus-visible:outline-none focus-visible:ring-2',
      'disabled:pointer-events-none disabled:opacity-50',
      variantClasses,
      sizeClasses,
      fullWidth && 'w-full',
      className,
    );

    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? 'Loading...' : children}
      </Comp>
    );
  },
);

Button.displayName = 'Button';
```

### Button.types.ts

```typescript
import { ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual style variant
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * Size of the button
   * @default 'md'
   */
  size?: ButtonSize;

  /**
   * Loading state - shows loading text and disables button
   * @default false
   */
  loading?: boolean;

  /**
   * Makes button full width
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Render as child element (Radix Slot)
   * @default false
   */
  asChild?: boolean;
}
```

### Button.test.tsx

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button Atom', () => {
  // 1. RENDERING TESTS
  describe('Rendering', () => {
    it('renders children correctly', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('applies default variant and size', () => {
      render(<Button>Default</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-primary', 'h-10');
    });
  });

  // 2. VARIANT TESTS
  describe('Variants', () => {
    it.each([
      ['primary', 'bg-primary'],
      ['secondary', 'bg-secondary'],
      ['outline', 'border-input'],
      ['ghost', 'hover:bg-accent'],
      ['destructive', 'bg-destructive'],
    ])('applies %s variant classes', (variant, expectedClass) => {
      render(<Button variant={variant as any}>{variant}</Button>);
      expect(screen.getByRole('button')).toHaveClass(expectedClass);
    });
  });

  // 3. SIZE TESTS
  describe('Sizes', () => {
    it.each([
      ['sm', 'h-9'],
      ['md', 'h-10'],
      ['lg', 'h-11'],
    ])('applies %s size classes', (size, expectedClass) => {
      render(<Button size={size as any}>{size}</Button>);
      expect(screen.getByRole('button')).toHaveClass(expectedClass);
    });
  });

  // 4. INTERACTION TESTS
  describe('Interactions', () => {
    it('handles click events', async () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click</Button>);

      await userEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not trigger click when disabled', async () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick} disabled>Disabled</Button>);

      await userEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  // 5. PROPS TESTS
  describe('Props', () => {
    it('applies fullWidth class', () => {
      render(<Button fullWidth>Full Width</Button>);
      expect(screen.getByRole('button')).toHaveClass('w-full');
    });

    it('shows loading state', () => {
      render(<Button loading>Submit</Button>);
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('merges custom className', () => {
      render(<Button className="custom-class">Custom</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class', 'inline-flex');
    });
  });

  // 6. ACCESSIBILITY TESTS
  describe('Accessibility', () => {
    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Button ref={ref}>Button</Button>);
      expect(ref).toHaveBeenCalled();
    });

    it('has disabled attribute when disabled', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('disabled');
    });
  });

  // 7. EDGE CASES
  describe('Edge Cases', () => {
    it('renders as child element with asChild prop', () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      );
      expect(screen.getByRole('link')).toHaveTextContent('Link Button');
    });

    it('prevents click when loading', async () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick} loading>Loading</Button>);

      await userEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });
});
```

### Button.stories.tsx

```typescript
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
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline Button',
    variant: 'outline',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
      </div>
    </div>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
};
```

### index.ts

```typescript
export { Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button.types';
```

## Anti-Patterns

### ❌ DON'T: Create Separate Test Folders

```
atoms/button/
├── __tests__/              # ❌ WRONG
│   └── Button.test.tsx
├── Button.tsx
└── Button.types.ts
```

### ❌ DON'T: Use .spec.tsx Extension

```
atoms/button/
├── Button.tsx
├── Button.spec.tsx         # ❌ WRONG - use .test.tsx
└── Button.types.ts
```

### ❌ DON'T: Mix Testing Frameworks in Frontend

```typescript
// Button.test.tsx
import { test, expect } from '@playwright/test';  // ❌ WRONG - use Vitest for unit tests

// Playwright is ONLY for E2E tests
```

### ❌ DON'T: Skip Type Files

```
atoms/button/
├── Button.tsx
├── Button.test.tsx
└── index.ts                # ❌ WRONG - missing Button.types.ts
```

### ❌ DON'T: Inline All Types

```typescript
// Button.tsx
export interface ButtonProps {  // ❌ WRONG - should be in Button.types.ts
  variant?: 'primary' | 'secondary';
}

export const Button = (props: ButtonProps) => { ... };
```

## Testing Coverage Requirements

### By Component Type

| Component Type | Min Tests | Min Coverage | Test File Size |
|---------------|-----------|--------------|----------------|
| **Atoms** | 8 tests | 95% | 200-300 lines |
| **Molecules** | 5 tests | 90% | 150-200 lines |
| **Organisms** | 10 tests | 95% | 300-400 lines |
| **Hooks** | 5 tests | 95% | 150-250 lines |
| **Utils** | 100% coverage | 100% | Varies |

### Coverage Commands

```bash
# Run all tests with coverage
npm run test:coverage

# Run tests for specific component
npm run test Button.test.tsx

# Watch mode
npm run test:watch

# UI mode (Vitest)
npm run test:ui
```

## Enforcement

1. **Pre-commit hooks**: Tests must pass before commit
2. **Code review**: PR reviewers check for proper structure
3. **CI/CD**: Automated checks verify:
   - All required files exist
   - Tests pass
   - Coverage thresholds met
   - Naming conventions followed

## Related Documentation

- [Atomic Design Architecture](/docs/00-conventions/atomic-design-architecture.md)
- [Testing Strategy and Frameworks](/docs/00-conventions/testing-strategy-and-frameworks.md)
- [Frontend Testing Guide](/docs/05-testing/frontend-testing-guide.md)
- [Testing Cheatsheet](/docs/05-testing/testing-cheatsheet.md)
- [CLAUDE.md](/CLAUDE.md) - Main project guidance

---

**Last Updated:** 2025-01-09
**Maintained By:** Development Team
