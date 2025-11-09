# Frontend jest-axe Accessibility Template

**Purpose**: Template for accessibility testing using jest-axe
**Integration**: Embedded in unit tests (Vitest + Testing Library)
**Coverage**: WCAG 2.1 Level AA compliance

---

## Setup (Already Configured)

```typescript
// vitest.config.ts - already includes jest-axe matcher
import { configDefaults, defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
});
```

```typescript
// vitest.setup.ts
import '@testing-library/jest-dom';
import { expect } from 'vitest';
import { toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);
```

---

## Basic Accessibility Test

```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from './Button';

expect.extend(toHaveNoViolations);

describe('Button Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Button>Click me</Button>);

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
```

---

## Complete Accessibility Test Suite

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ComponentName } from './ComponentName';

expect.extend(toHaveNoViolations);

describe('ComponentName Accessibility', () => {
  // 1. NO VIOLATIONS TEST
  it('has no accessibility violations in default state', async () => {
    const { container } = render(<ComponentName>Content</ComponentName>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // 2. ARIA ATTRIBUTES
  describe('ARIA Attributes', () => {
    it('has correct role attribute', () => {
      render(<ComponentName>Content</ComponentName>);
      const element = screen.getByRole('button'); // adjust role as needed
      expect(element).toBeInTheDocument();
    });

    it('has aria-label when needed', () => {
      render(<ComponentName aria-label="Close dialog" />);
      expect(screen.getByLabelText('Close dialog')).toBeInTheDocument();
    });

    it('has aria-describedby for helper text', () => {
      render(<ComponentName helperText="Enter your name" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby');
    });

    it('has aria-invalid when error exists', () => {
      render(<ComponentName error="Invalid input" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });
  });

  // 3. KEYBOARD NAVIGATION
  describe('Keyboard Navigation', () => {
    it('is focusable with keyboard', () => {
      render(<ComponentName>Focusable</ComponentName>);
      const element = screen.getByRole('button');
      element.focus();
      expect(element).toHaveFocus();
    });

    it('can be activated with Enter key', async () => {
      const handleClick = vi.fn();
      render(<ComponentName onClick={handleClick}>Activate</ComponentName>);

      const element = screen.getByRole('button');
      element.focus();
      await userEvent.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalled();
    });

    it('can be activated with Space key', async () => {
      const handleClick = vi.fn();
      render(<ComponentName onClick={handleClick}>Activate</ComponentName>);

      const element = screen.getByRole('button');
      element.focus();
      await userEvent.keyboard(' ');

      expect(handleClick).toHaveBeenCalled();
    });

    it('follows correct tab order', async () => {
      render(
        <div>
          <ComponentName>First</ComponentName>
          <ComponentName>Second</ComponentName>
          <ComponentName>Third</ComponentName>
        </div>
      );

      const buttons = screen.getAllByRole('button');

      buttons[0].focus();
      expect(buttons[0]).toHaveFocus();

      await userEvent.tab();
      expect(buttons[1]).toHaveFocus();

      await userEvent.tab();
      expect(buttons[2]).toHaveFocus();
    });
  });

  // 4. SEMANTIC HTML
  describe('Semantic HTML', () => {
    it('uses semantic button element', () => {
      render(<ComponentName>Button</ComponentName>);
      const button = screen.getByRole('button');
      expect(button.tagName).toBe('BUTTON');
    });

    it('uses semantic heading elements', () => {
      render(<ComponentName title="Section Title" />);
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });
  });

  // 5. LABELS AND ASSOCIATIONS
  describe('Labels and Associations', () => {
    it('associates label with input', () => {
      render(
        <ComponentName>
          <label htmlFor="test-input">Email</label>
          <input id="test-input" type="email" />
        </ComponentName>
      );

      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('provides accessible name', () => {
      render(<ComponentName>Submit Form</ComponentName>);
      expect(screen.getByRole('button', { name: /submit form/i })).toBeInTheDocument();
    });
  });

  // 6. COLOR CONTRAST (manual check in documentation)
  describe('Color Contrast', () => {
    it('documents color contrast ratios', () => {
      // Note: Automated tools can't fully verify color contrast
      // Ensure Tailwind classes meet WCAG AA standards:
      // - Normal text: 4.5:1 contrast ratio
      // - Large text (18pt+): 3:1 contrast ratio
      // Verify using browser DevTools or external tools

      render(<ComponentName variant="primary">High Contrast</ComponentName>);
      const element = screen.getByRole('button');

      // Verify classes that ensure contrast
      expect(element).toHaveClass('bg-primary-600'); // documented as AA compliant
    });
  });

  // 7. DISABLED STATE
  describe('Disabled State', () => {
    it('has no violations when disabled', async () => {
      const { container } = render(<ComponentName disabled>Disabled</ComponentName>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('is not focusable when disabled', () => {
      render(<ComponentName disabled>Disabled</ComponentName>);
      const element = screen.getByRole('button');
      expect(element).toBeDisabled();

      element.focus();
      expect(element).not.toHaveFocus();
    });
  });

  // 8. ERROR STATES
  describe('Error States', () => {
    it('has no violations when error is displayed', async () => {
      const { container } = render(<ComponentName error="Invalid input" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('announces errors to screen readers', () => {
      render(<ComponentName error="Email is required" />);

      const errorElement = screen.getByText('Email is required');
      expect(errorElement).toHaveAttribute('role', 'alert');
      // or check for aria-live="polite" or "assertive"
    });
  });
});
```

---

## Axe Configuration Options

### Test Specific Rules
```typescript
it('has no color contrast violations', async () => {
  const { container } = render(<ComponentName>Content</ComponentName>);

  const results = await axe(container, {
    rules: {
      'color-contrast': { enabled: true },
    },
  });

  expect(results).toHaveNoViolations();
});
```

### Disable Specific Rules (use sparingly)
```typescript
it('passes accessibility except known issue', async () => {
  const { container } = render(<ComponentName>Content</ComponentName>);

  const results = await axe(container, {
    rules: {
      'color-contrast': { enabled: false }, // temporarily disable
    },
  });

  expect(results).toHaveNoViolations();
});
```

### Test Specific Element
```typescript
it('form has no accessibility violations', async () => {
  const { container } = render(
    <div>
      <ComponentName>Content</ComponentName>
      <form id="test-form">
        <input type="text" />
        <button>Submit</button>
      </form>
    </div>
  );

  const form = container.querySelector('#test-form');
  const results = await axe(form);

  expect(results).toHaveNoViolations();
});
```

---

## Common Accessibility Patterns

### 1. Form Fields
```typescript
it('form field is accessible', async () => {
  const { container } = render(
    <div>
      <label htmlFor="email">Email Address</label>
      <input
        id="email"
        type="email"
        aria-describedby="email-help"
        aria-required="true"
      />
      <span id="email-help">We'll never share your email</span>
    </div>
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();

  // Additional checks
  const input = screen.getByLabelText('Email Address');
  expect(input).toHaveAttribute('aria-describedby', 'email-help');
  expect(input).toHaveAttribute('aria-required', 'true');
});
```

### 2. Buttons with Icons
```typescript
it('icon button has accessible name', async () => {
  const { container } = render(
    <button aria-label="Close dialog">
      <XIcon className="w-4 h-4" />
    </button>
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();

  expect(screen.getByLabelText('Close dialog')).toBeInTheDocument();
});
```

### 3. Dialogs/Modals
```typescript
it('modal is accessible', async () => {
  const { container } = render(
    <div role="dialog" aria-labelledby="modal-title" aria-modal="true">
      <h2 id="modal-title">Confirm Action</h2>
      <p>Are you sure?</p>
      <button>Confirm</button>
      <button>Cancel</button>
    </div>
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### 4. Lists
```typescript
it('list is semantically correct', async () => {
  const { container } = render(
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();

  expect(screen.getByRole('list')).toBeInTheDocument();
  expect(screen.getAllByRole('listitem')).toHaveLength(3);
});
```

---

## Checklist for Accessible Components

- [ ] **No axe violations** in all states (default, hover, focus, disabled, error)
- [ ] **Keyboard navigable** (Tab, Enter, Space, Arrows)
- [ ] **Semantic HTML** (button, input, heading, list, etc.)
- [ ] **ARIA attributes** when needed (aria-label, aria-describedby, aria-invalid)
- [ ] **Color contrast** meets WCAG AA (4.5:1 for text, 3:1 for large text)
- [ ] **Focus indicators** visible (outline, ring, etc.)
- [ ] **Labels** associated with inputs (htmlFor, aria-labelledby)
- [ ] **Error messages** announced to screen readers (role="alert" or aria-live)
- [ ] **Disabled state** properly communicated (disabled attribute, aria-disabled)
- [ ] **Alternative text** for images/icons (alt, aria-label)

---

## External Accessibility Testing Tools

While jest-axe catches many issues, also test with:

1. **Browser DevTools Lighthouse** - Automated accessibility audit
2. **axe DevTools Extension** - Browser extension for manual testing
3. **NVDA/JAWS** - Screen reader testing (Windows)
4. **VoiceOver** - Screen reader testing (macOS/iOS)
5. **Keyboard only** - Navigate without mouse
6. **Color Contrast Analyzer** - Verify contrast ratios

---

## Run Commands

```bash
# Run all tests (includes accessibility tests)
npm run test

# Run in watch mode
npm run test:watch

# Run with coverage (should be part of 95%+ coverage)
npm run test:coverage
```

---

**Last Updated**: 2025-01-09
