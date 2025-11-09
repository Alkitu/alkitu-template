# Frontend Vitest Organism Test Template

**Purpose**: Template for testing Organism components (forms, complex features, page sections)
**Coverage Required**: 95%+
**Test Count**: 10-15 tests minimum

---

## Complete Test Template

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentName } from './ComponentName';
import type { ComponentNameProps } from './ComponentName.types';

// Mock external dependencies
vi.mock('@/hooks/useTranslations', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/hooks/useAuthRedirect', () => ({
  useAuthRedirect: () => ({
    redirectAfterLogin: vi.fn(),
  }),
}));

global.fetch = vi.fn();

describe('ComponentName Organism', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. RENDERING TESTS
  describe('Rendering', () => {
    it('renders all form elements', () => {
      render(<ComponentName />);

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    it('renders with translated labels', () => {
      render(<ComponentName />);

      // Verify translation keys are used
      expect(screen.getByText('auth.email.label')).toBeInTheDocument();
      expect(screen.getByText('auth.password.label')).toBeInTheDocument();
    });
  });

  // 2. FORM INPUT TESTS
  describe('Form Inputs', () => {
    it('updates email field on user input', async () => {
      render(<ComponentName />);

      const emailInput = screen.getByLabelText(/email/i);
      await userEvent.type(emailInput, 'test@example.com');

      expect(emailInput).toHaveValue('test@example.com');
    });

    it('updates password field on user input', async () => {
      render(<ComponentName />);

      const passwordInput = screen.getByLabelText(/password/i);
      await userEvent.type(passwordInput, 'password123');

      expect(passwordInput).toHaveValue('password123');
    });

    it('toggles password visibility', async () => {
      render(<ComponentName />);

      const passwordInput = screen.getByLabelText(/password/i);
      const toggleButton = screen.getByRole('button', { name: /show password/i });

      expect(passwordInput).toHaveAttribute('type', 'password');

      await userEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');
    });
  });

  // 3. VALIDATION TESTS
  describe('Validation', () => {
    it('shows error for invalid email format', async () => {
      render(<ComponentName />);

      const emailInput = screen.getByLabelText(/email/i);
      await userEvent.type(emailInput, 'invalid-email');
      await userEvent.tab(); // trigger blur validation

      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });

    it('shows error for empty required fields', async () => {
      render(<ComponentName />);

      const submitButton = screen.getByRole('button', { name: /submit/i });
      await userEvent.click(submitButton);

      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });

    it('clears errors when user corrects input', async () => {
      render(<ComponentName />);

      const emailInput = screen.getByLabelText(/email/i);
      await userEvent.type(emailInput, 'invalid');
      await userEvent.tab();

      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();

      await userEvent.clear(emailInput);
      await userEvent.type(emailInput, 'valid@example.com');

      expect(screen.queryByText(/invalid email/i)).not.toBeInTheDocument();
    });
  });

  // 4. FORM SUBMISSION TESTS
  describe('Form Submission', () => {
    it('calls API with correct data on submit', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, token: 'mock-token' }),
      });

      render(<ComponentName />);

      await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
      await userEvent.type(screen.getByLabelText(/password/i), 'password123');
      await userEvent.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/auth/login',
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: 'test@example.com',
              password: 'password123',
            }),
          })
        );
      });
    });

    it('prevents submission when form is invalid', async () => {
      render(<ComponentName />);

      await userEvent.type(screen.getByLabelText(/email/i), 'invalid-email');
      await userEvent.click(screen.getByRole('button', { name: /submit/i }));

      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  // 5. SUCCESS STATE TESTS
  describe('Success State', () => {
    it('shows success message on successful submission', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      render(<ComponentName />);

      await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
      await userEvent.type(screen.getByLabelText(/password/i), 'password123');
      await userEvent.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/success/i)).toBeInTheDocument();
      });
    });

    it('redirects user after successful submission', async () => {
      const mockRedirect = vi.fn();
      vi.mocked(useAuthRedirect).mockReturnValue({
        redirectAfterLogin: mockRedirect,
      });

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      render(<ComponentName />);

      await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
      await userEvent.type(screen.getByLabelText(/password/i), 'password123');
      await userEvent.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(mockRedirect).toHaveBeenCalled();
      });
    });
  });

  // 6. ERROR STATE TESTS
  describe('Error State', () => {
    it('shows error message on API failure', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Invalid credentials' }),
      });

      render(<ComponentName />);

      await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
      await userEvent.type(screen.getByLabelText(/password/i), 'wrong-password');
      await userEvent.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });

    it('shows network error on fetch failure', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      render(<ComponentName />);

      await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
      await userEvent.type(screen.getByLabelText(/password/i), 'password123');
      await userEvent.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
    });
  });

  // 7. LOADING STATE TESTS
  describe('Loading State', () => {
    it('shows loading indicator during submission', async () => {
      (global.fetch as any).mockImplementationOnce(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );

      render(<ComponentName />);

      await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
      await userEvent.type(screen.getByLabelText(/password/i), 'password123');
      await userEvent.click(screen.getByRole('button', { name: /submit/i }));

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('disables submit button during loading', async () => {
      (global.fetch as any).mockImplementationOnce(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );

      render(<ComponentName />);

      const submitButton = screen.getByRole('button', { name: /submit/i });

      await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
      await userEvent.type(screen.getByLabelText(/password/i), 'password123');
      await userEvent.click(submitButton);

      expect(submitButton).toBeDisabled();
    });
  });

  // 8-15. Additional tests based on organism complexity
  // - API integration tests
  // - State management tests
  // - Navigation tests
  // - Conditional rendering tests
  // - Multi-step flow tests
  // - etc.
});
```

---

## Test Checklist

Before marking organism tests as complete, verify:

- [ ] **10-15 tests minimum** created
- [ ] **All form elements** rendering tested
- [ ] **User input** for all fields tested
- [ ] **Validation** (client-side) tested
- [ ] **Form submission** with API calls tested
- [ ] **Success state** handling tested
- [ ] **Error states** (API errors, network errors) tested
- [ ] **Loading states** tested
- [ ] **Button disabled** states tested
- [ ] **Redirects/navigation** tested (if applicable)
- [ ] **Mocks** properly configured (fetch, hooks, etc.)
- [ ] **95%+ coverage** achieved

---

## Common Organism Testing Patterns

### Testing Multi-Step Forms
```typescript
it('advances to next step on valid submission', async () => {
  render(<MultiStepForm />);

  // Step 1
  await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
  await userEvent.click(screen.getByRole('button', { name: /next/i }));

  // Step 2
  expect(screen.getByText(/step 2/i)).toBeInTheDocument();
});
```

### Testing Async Data Loading
```typescript
it('loads and displays data on mount', async () => {
  (global.fetch as any).mockResolvedValueOnce({
    ok: true,
    json: async () => ({ items: [{ id: 1, name: 'Item' }] }),
  });

  render(<DataListOrganism />);

  await waitFor(() => {
    expect(screen.getByText('Item')).toBeInTheDocument();
  });
});
```

### Testing Complex State Management
```typescript
it('updates related fields when primary field changes', async () => {
  render(<DependentFieldsOrganism />);

  await userEvent.selectOptions(screen.getByLabelText(/country/i), 'US');

  await waitFor(() => {
    expect(screen.getByLabelText(/state/i)).toBeEnabled();
  });
});
```

---

## Run Commands

```bash
# Run tests for this organism
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
