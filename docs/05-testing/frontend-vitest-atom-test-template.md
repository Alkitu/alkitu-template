# Frontend Vitest Atom Test Template

**Purpose**: Template for testing Atom components (buttons, inputs, icons, labels)
**Coverage Required**: 95%+
**Test Count**: 8-10 tests minimum

---

## Complete Test Template

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { ComponentName } from './ComponentName';
import type { ComponentNameProps } from './ComponentName.types';

describe('ComponentName Atom', () => {
  // 1. RENDERING TESTS
  describe('Rendering', () => {
    it('renders children correctly', () => {
      render(<ComponentName>Test Content</ComponentName>);
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('renders with default props', () => {
      render(<ComponentName>Default</ComponentName>);
      const element = screen.getByRole('button'); // adjust role as needed
      expect(element).toBeInTheDocument();
    });
  });

  // 2. VARIANT TESTS
  describe('Variants', () => {
    it.each([
      ['default', 'expected-class-default'],
      ['primary', 'expected-class-primary'],
      ['secondary', 'expected-class-secondary'],
      ['outline', 'expected-class-outline'],
    ])('applies %s variant correctly', (variant, expectedClass) => {
      render(<ComponentName variant={variant as any}>Variant Test</ComponentName>);
      const element = screen.getByRole('button');
      expect(element).toHaveClass(expectedClass);
    });
  });

  // 3. SIZE TESTS
  describe('Sizes', () => {
    it.each([
      ['sm', 'h-8'],
      ['md', 'h-10'],
      ['lg', 'h-12'],
    ])('applies %s size correctly', (size, expectedClass) => {
      render(<ComponentName size={size as any}>Size Test</ComponentName>);
      const element = screen.getByRole('button');
      expect(element).toHaveClass(expectedClass);
    });
  });

  // 4. INTERACTION TESTS
  describe('Interactions', () => {
    it('handles click events', async () => {
      const handleClick = vi.fn();
      render(<ComponentName onClick={handleClick}>Click Me</ComponentName>);

      await userEvent.click(screen.getByRole('button'));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', async () => {
      const handleClick = vi.fn();
      render(
        <ComponentName onClick={handleClick} disabled>
          Disabled
        </ComponentName>
      );

      await userEvent.click(screen.getByRole('button'));

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  // 5. PROPS TESTS
  describe('Props', () => {
    it('applies custom className', () => {
      render(<ComponentName className="custom-class">Custom</ComponentName>);
      expect(screen.getByRole('button')).toHaveClass('custom-class');
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<ComponentName ref={ref}>Ref Test</ComponentName>);
      expect(ref).toHaveBeenCalled();
    });

    it('applies disabled state', () => {
      render(<ComponentName disabled>Disabled</ComponentName>);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  // 6. ACCESSIBILITY TESTS
  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<ComponentName>Accessible</ComponentName>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('supports keyboard navigation', async () => {
      const handleClick = vi.fn();
      render(<ComponentName onClick={handleClick}>Keyboard</ComponentName>);

      const button = screen.getByRole('button');
      button.focus();
      await userEvent.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalled();
    });
  });

  // 7. THEME INTEGRATION TESTS
  describe('Theme Integration', () => {
    it('applies theme classes correctly', () => {
      render(<ComponentName>Theme Test</ComponentName>);
      const element = screen.getByRole('button');
      // Verify Tailwind classes are applied
      expect(element.className).toMatch(/rounded|px-|py-/);
    });
  });

  // 8. EDGE CASES
  describe('Edge Cases', () => {
    it('handles empty children', () => {
      render(<ComponentName />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('handles very long text content', () => {
      const longText = 'A'.repeat(1000);
      render(<ComponentName>{longText}</ComponentName>);
      expect(screen.getByText(longText)).toBeInTheDocument();
    });
  });
});
```

---

## Test Checklist

Before marking atom tests as complete, verify:

- [ ] **8-10 tests minimum** created
- [ ] **All variants** tested (default, primary, secondary, etc.)
- [ ] **All sizes** tested (sm, md, lg, etc.)
- [ ] **Click/interaction** handlers tested
- [ ] **Disabled state** tested
- [ ] **Accessibility** violations checked (jest-axe)
- [ ] **Keyboard navigation** tested
- [ ] **Custom props** (className, ref) tested
- [ ] **Edge cases** covered
- [ ] **95%+ coverage** achieved

---

## Common Atom Testing Patterns

### Testing Icon Components
```typescript
it('renders correct icon variant', () => {
  render(<Icon name="check" />);
  expect(screen.getByRole('img')).toHaveAttribute('data-icon', 'check');
});
```

### Testing Input Components
```typescript
it('updates value on user input', async () => {
  render(<Input />);
  const input = screen.getByRole('textbox');
  await userEvent.type(input, 'test value');
  expect(input).toHaveValue('test value');
});
```

### Testing Label Components
```typescript
it('associates with input via htmlFor', () => {
  render(
    <>
      <Label htmlFor="test-input">Label</Label>
      <input id="test-input" />
    </>
  );
  expect(screen.getByLabelText('Label')).toBeInTheDocument();
});
```

---

## Run Commands

```bash
# Run tests for this atom
npm run test ComponentName.test.tsx

# Run with coverage
npm run test:coverage -- ComponentName.test.tsx

# Run in watch mode
npm run test:watch ComponentName.test.tsx

# Run in UI mode (recommended for development)
npm run test:ui
```

---

**Last Updated**: 2025-01-09
