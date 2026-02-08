import { vi } from 'vitest';

// IMPORTANT: Mock next/navigation BEFORE importing test-utils or components
// Get the mocked router functions
const mockRouterPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockRouterPush,
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/en/auth/forgot-password',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock fetch globally
global.fetch = vi.fn();

// Now import everything else
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  renderWithProviders,
  screen,
  waitFor,
  userEvent,
} from '@/test/test-utils';
import { ForgotPasswordFormOrganism } from './ForgotPasswordFormOrganism';

describe('ForgotPasswordFormOrganism - Organism', () => {
  const translations = {
    auth: {
      forgotPassword: {
        title: 'Forgot Password',
        description: 'Enter your email and we will send you a reset link',
        emailLabel: 'Email',
        emailPlaceholder: 'your@email.com',
        submit: 'Send reset link',
        error: 'Error sending email',
      },
    },
    Common: {
      general: {
        loading: 'Sending...',
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();

    // Reset fetch mock
    (global.fetch as any).mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Rendering', () => {
    it('should render all form elements correctly', () => {
      renderWithProviders(<ForgotPasswordFormOrganism />, { translations });

      expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Send reset link' })).toBeInTheDocument();
    });

    it('should render description text', () => {
      renderWithProviders(<ForgotPasswordFormOrganism />, { translations });

      expect(screen.getByText('Enter your email and we will send you a reset link')).toBeInTheDocument();
    });

    it('should have email input with correct attributes', () => {
      renderWithProviders(<ForgotPasswordFormOrganism />, { translations });

      const emailInput = screen.getByPlaceholderText('your@email.com');
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('required');
      expect(emailInput).toHaveAttribute('placeholder', 'your@email.com');
    });
  });

  describe('Form Validation', () => {
    it('should require email field', () => {
      renderWithProviders(<ForgotPasswordFormOrganism />, { translations });

      const emailInput = screen.getByPlaceholderText('your@email.com');
      expect(emailInput).toHaveAttribute('required');
    });

    it('should validate email format', () => {
      renderWithProviders(<ForgotPasswordFormOrganism />, { translations });

      const emailInput = screen.getByPlaceholderText('your@email.com') as HTMLInputElement;
      emailInput.value = 'invalid';

      expect(emailInput.validity.valid).toBe(false);
    });

    it('should accept valid email', async () => {
      const user = userEvent.setup();
      renderWithProviders(<ForgotPasswordFormOrganism />, { translations });

      const emailInput = screen.getByPlaceholderText('your@email.com') as HTMLInputElement;
      await user.type(emailInput, 'test@example.com');

      expect(emailInput.value).toBe('test@example.com');
      expect(emailInput.validity.valid).toBe(true);
    });
  });

  describe('Form Submission', () => {
    it('should call API with correct data', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Email sent' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      renderWithProviders(<ForgotPasswordFormOrganism />, { translations });

      const emailInput = screen.getByPlaceholderText('your@email.com');
      const submitButton = screen.getByRole('button');

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/auth/forgot-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: 'test@example.com' }),
        });
      });
    });

    it('should show success message on successful submission', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Reset link sent' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      renderWithProviders(<ForgotPasswordFormOrganism />, { translations });

      await user.type(screen.getByPlaceholderText('your@email.com'), 'test@example.com');
      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Reset link sent')).toBeInTheDocument();
      });
    });

    it('should clear form after successful submission', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Email sent' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      renderWithProviders(<ForgotPasswordFormOrganism />, { translations });

      const emailInput = screen.getByPlaceholderText('your@email.com') as HTMLInputElement;
      await user.type(emailInput, 'test@example.com');
      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(emailInput.value).toBe('');
      });
    });

    it('should use fallback success message', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({}),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      renderWithProviders(<ForgotPasswordFormOrganism />, { translations });

      await user.type(screen.getByPlaceholderText('your@email.com'), 'test@example.com');
      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText(/Se ha enviado un email/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message on failed submission', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        ok: false,
        json: () => Promise.resolve({ message: 'Email not found' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      renderWithProviders(<ForgotPasswordFormOrganism />, { translations });

      await user.type(screen.getByPlaceholderText('your@email.com'), 'notfound@example.com');
      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Email not found')).toBeInTheDocument();
      });
    });

    it('should handle network errors', async () => {
      const user = userEvent.setup();
      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      renderWithProviders(<ForgotPasswordFormOrganism />, { translations });

      await user.type(screen.getByPlaceholderText('your@email.com'), 'test@example.com');
      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });

    it('should use fallback error message', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        ok: false,
        json: () => Promise.resolve({}),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      renderWithProviders(<ForgotPasswordFormOrganism />, { translations });

      await user.type(screen.getByPlaceholderText('your@email.com'), 'test@example.com');
      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Error sending reset email')).toBeInTheDocument();
      });
    });

    it('should not clear form on error', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        ok: false,
        json: () => Promise.resolve({ message: 'Error' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      renderWithProviders(<ForgotPasswordFormOrganism />, { translations });

      const emailInput = screen.getByPlaceholderText('your@email.com') as HTMLInputElement;
      await user.type(emailInput, 'test@example.com');
      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Error')).toBeInTheDocument();
      });

      expect(emailInput.value).toBe('test@example.com');
    });
  });

  describe('Loading State', () => {
    it('should show loading state during submission', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        ok: true,
        json: () => new Promise((resolve) => setTimeout(() => resolve({ message: 'Success' }), 100)),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      renderWithProviders(<ForgotPasswordFormOrganism />, { translations });

      await user.type(screen.getByPlaceholderText('your@email.com'), 'test@example.com');
      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Sending...')).toBeInTheDocument();
      });
    });

    it('should disable form elements while loading', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        ok: true,
        json: () => new Promise((resolve) => setTimeout(() => resolve({ message: 'Success' }), 100)),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      renderWithProviders(<ForgotPasswordFormOrganism />, { translations });

      const emailInput = screen.getByPlaceholderText('your@email.com');
      const submitButton = screen.getByRole('button');

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(emailInput).toBeDisabled();
        expect(submitButton).toBeDisabled();
      });
    });

    it('should re-enable form after completion', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Success' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      renderWithProviders(<ForgotPasswordFormOrganism />, { translations });

      await user.type(screen.getByPlaceholderText('your@email.com'), 'test@example.com');
      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Success')).toBeInTheDocument();
      });

      const emailInput = screen.getByPlaceholderText('your@email.com');
      const submitButton = screen.getByRole('button');

      expect(emailInput).not.toBeDisabled();
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('User Interactions', () => {
    it('should update email value when typing', async () => {
      const user = userEvent.setup();
      renderWithProviders(<ForgotPasswordFormOrganism />, { translations });

      const emailInput = screen.getByPlaceholderText('your@email.com') as HTMLInputElement;
      await user.type(emailInput, 'test@example.com');

      expect(emailInput.value).toBe('test@example.com');
    });

    it('should clear previous errors on new submission', async () => {
      const user = userEvent.setup();
      const mockErrorResponse = {
        ok: false,
        json: () => Promise.resolve({ message: 'Error' }),
      };
      const mockSuccessResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Success' }),
      };

      (global.fetch as any).mockResolvedValueOnce(mockErrorResponse);

      renderWithProviders(<ForgotPasswordFormOrganism />, { translations });

      const submitButton = screen.getByRole('button');
      await user.type(screen.getByPlaceholderText('your@email.com'), 'test@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Error')).toBeInTheDocument();
      });

      (global.fetch as any).mockResolvedValueOnce(mockSuccessResponse);
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByText('Error')).not.toBeInTheDocument();
      });
    });

    it('should handle Enter key submission', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Success' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      renderWithProviders(<ForgotPasswordFormOrganism />, { translations });

      const emailInput = screen.getByPlaceholderText('your@email.com');
      await user.type(emailInput, 'test@example.com{Enter}');

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to wrapper div', () => {
      const ref = vi.fn();
      renderWithProviders(<ForgotPasswordFormOrganism ref={ref} />, {
        translations,
      });

      expect(ref).toHaveBeenCalled();
    });
  });

  describe('Custom Styling', () => {
    it('should render with custom className', () => {
      const { container } = renderWithProviders(
        <ForgotPasswordFormOrganism className="custom-class" />,
        { translations },
      );

      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });

    it('should render with default className when not provided', () => {
      const { container } = renderWithProviders(<ForgotPasswordFormOrganism />, {
        translations,
      });

      expect(container.querySelector('.space-y-6')).toBeInTheDocument();
    });
  });
});
