# Frontend Vitest Molecule Test Template

**Purpose**: Template for testing Molecule components (form fields, cards, search bars)
**Coverage Required**: 90%+
**Test Count**: 5-8 tests minimum

---

## Complete Test Template

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentName } from './ComponentName';
import type { ComponentNameProps } from './ComponentName.types';

describe('ComponentName Molecule', () => {
  // 1. RENDERING TESTS
  describe('Rendering', () => {
    it('renders all child atoms correctly', () => {
      render(<ComponentName label="Test Label" />);
      expect(screen.getByText('Test Label')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders with default props', () => {
      render(<ComponentName />);
      // Verify molecule renders without errors
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });

  // 2. COMPOSITION TESTS
  describe('Composition', () => {
    it('passes props to child atoms correctly', () => {
      render(
        <ComponentName
          inputProps={{ placeholder: 'Enter text' }}
          buttonProps={{ variant: 'primary' }}
        />
      );

      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveClass('variant-primary');
    });

    it('renders optional elements when provided', () => {
      render(
        <ComponentName
          helperText="Helper message"
          errorMessage="Error message"
        />
      );

      expect(screen.getByText('Helper message')).toBeInTheDocument();
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });
  });

  // 3. INTERACTION TESTS
  describe('Interactions', () => {
    it('handles user input across atoms', async () => {
      const handleChange = vi.fn();
      render(<ComponentName onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      await userEvent.type(input, 'test');

      expect(handleChange).toHaveBeenCalled();
      expect(input).toHaveValue('test');
    });

    it('handles form submission', async () => {
      const handleSubmit = vi.fn((e) => e.preventDefault());
      render(<ComponentName onSubmit={handleSubmit} />);

      await userEvent.type(screen.getByRole('textbox'), 'test');
      await userEvent.click(screen.getByRole('button'));

      expect(handleSubmit).toHaveBeenCalled();
    });
  });

  // 4. STATE MANAGEMENT TESTS
  describe('State Management', () => {
    it('manages internal state correctly', async () => {
      render(<ComponentName />);

      const input = screen.getByRole('textbox');
      await userEvent.type(input, 'new value');

      expect(input).toHaveValue('new value');
    });

    it('updates on controlled value change', () => {
      const { rerender } = render(<ComponentName value="initial" />);
      expect(screen.getByRole('textbox')).toHaveValue('initial');

      rerender(<ComponentName value="updated" />);
      expect(screen.getByRole('textbox')).toHaveValue('updated');
    });
  });

  // 5. ERROR STATE TESTS
  describe('Error States', () => {
    it('displays error message when provided', () => {
      render(<ComponentName error="Validation error" />);
      expect(screen.getByText('Validation error')).toBeInTheDocument();
    });

    it('applies error styling to child atoms', () => {
      render(<ComponentName error="Error" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-red-500'); // adjust class as needed
    });
  });

  // 6. VARIANT TESTS
  describe('Variants', () => {
    it.each([
      ['default'],
      ['outlined'],
      ['filled'],
    ])('renders %s variant correctly', (variant) => {
      render(<ComponentName variant={variant as any} />);
      const container = screen.getByRole('textbox').parentElement;
      expect(container).toHaveClass(`variant-${variant}`);
    });
  });

  // 7. ACCESSIBILITY TESTS
  describe('Accessibility', () => {
    it('associates label with input', () => {
      render(<ComponentName label="Email Address" />);
      const input = screen.getByLabelText('Email Address');
      expect(input).toBeInTheDocument();
    });

    it('includes aria-describedby for helper text', () => {
      render(<ComponentName helperText="Enter your email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby');
    });

    it('includes aria-invalid when error exists', () => {
      render(<ComponentName error="Invalid input" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });
  });

  // 8. EDGE CASES
  describe('Edge Cases', () => {
    it('handles rapid user input', async () => {
      const handleChange = vi.fn();
      render(<ComponentName onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      await userEvent.type(input, 'rapid typing test');

      expect(handleChange).toHaveBeenCalled();
    });
  });
});
```

---

## Test Checklist

Before marking molecule tests as complete, verify:

- [ ] **5-8 tests minimum** created
- [ ] **Child atoms** composition tested
- [ ] **Props forwarding** to atoms tested
- [ ] **User interactions** across atoms tested
- [ ] **Internal state** management tested
- [ ] **Error states** tested
- [ ] **Variants** tested (if applicable)
- [ ] **Accessibility** attributes tested
- [ ] **90%+ coverage** achieved

---

## Common Molecule Testing Patterns

### Testing Form Field Molecules
```typescript
it('validates input on blur', async () => {
  const handleBlur = vi.fn();
  render(<FormField onBlur={handleBlur} required />);

  const input = screen.getByRole('textbox');
  await userEvent.click(input);
  await userEvent.tab(); // trigger blur

  expect(handleBlur).toHaveBeenCalled();
  expect(screen.getByText(/required/i)).toBeInTheDocument();
});
```

### Testing Search Bar Molecules
```typescript
it('triggers search on button click', async () => {
  const handleSearch = vi.fn();
  render(<SearchBar onSearch={handleSearch} />);

  await userEvent.type(screen.getByRole('textbox'), 'query');
  await userEvent.click(screen.getByRole('button', { name: /search/i }));

  expect(handleSearch).toHaveBeenCalledWith('query');
});
```

### Testing Card Molecules
```typescript
it('renders header, content, and footer', () => {
  render(
    <Card
      header="Title"
      footer={<button>Action</button>}
    >
      Content
    </Card>
  );

  expect(screen.getByText('Title')).toBeInTheDocument();
  expect(screen.getByText('Content')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /action/i })).toBeInTheDocument();
});
```

---

## Run Commands

```bash
# Run tests for this molecule
npm run test ComponentName.test.tsx

# Run with coverage
npm run test:coverage -- ComponentName.test.tsx

# Run in watch mode
npm run test:watch ComponentName.test.tsx

# Run in UI mode
npm run test:ui
```

---

**Last Updated**: 2025-01-09
