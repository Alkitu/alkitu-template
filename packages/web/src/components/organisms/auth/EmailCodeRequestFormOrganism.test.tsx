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
  usePathname: () => '/en/auth/request-code',
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
import { EmailCodeRequestFormOrganism } from './EmailCodeRequestFormOrganism';

describe('EmailCodeRequestFormOrganism - Organism', () => {
  const translations = {
    auth: {
      emailCode: {
        title: 'Request Login Code',
        description: 'Enter your email and we will send you a 6-digit code',
        emailLabel: 'Email',
        emailPlaceholder: 'your@email.com',
        submit: 'Send login code',
        error: 'Error sending code',
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
      renderWithProviders(<EmailCodeRequestFormOrganism />, { translations });

      expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Send login code' })).toBeInTheDocument();
    });

    it('should render description text', () => {
      renderWithProviders(<EmailCodeRequestFormOrganism />, { translations });

      expect(
        screen.getByText('Enter your email and we will send you a 6-digit code'),
      ).toBeInTheDocument();
    });

    it('should render registration link', () => {
      renderWithProviders(<EmailCodeRequestFormOrganism />, { translations });

      const link = screen.getByRole('link', { name: /Regístrate aquí/i });
      expect(link).toHaveAttribute('href', '/auth/register');
    });

    it('should render with custom className', () => {
      const { container } = renderWithProviders(
        <EmailCodeRequestFormOrganism className="custom-class" />,
        { translations },
      );

      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should require email field', () => {
      renderWithProviders(<EmailCodeRequestFormOrganism />, { translations });

      const emailInput = screen.getByPlaceholderText('your@email.com');
      expect(emailInput).toHaveAttribute('required');
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('should accept valid email', async () => {
      const user = userEvent.setup();
      renderWithProviders(<EmailCodeRequestFormOrganism />, { translations });

      const emailInput = screen.getByPlaceholderText(
        'your@email.com',
      ) as HTMLInputElement;
      await user.type(emailInput, 'test@example.com');

      expect(emailInput.value).toBe('test@example.com');
    });
  });

  describe('Form Submission', () => {
    it('should submit form with valid email', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Code sent successfully' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      renderWithProviders(<EmailCodeRequestFormOrganism />, { translations });

      const emailInput = screen.getByPlaceholderText('your@email.com');
      const submitButton = screen.getByRole('button', { name: 'Send login code' });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/auth/send-login-code', {
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
        json: () => Promise.resolve({ message: 'Code sent successfully' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      renderWithProviders(<EmailCodeRequestFormOrganism />, { translations });

      const emailInput = screen.getByPlaceholderText('your@email.com');
      const submitButton = screen.getByRole('button', { name: 'Send login code' });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Code sent successfully')).toBeInTheDocument();
      });
    });

    it('should redirect to verification page after success', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Code sent successfully' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      renderWithProviders(<EmailCodeRequestFormOrganism />, { translations });

      const emailInput = screen.getByPlaceholderText('your@email.com');
      const submitButton = screen.getByRole('button', { name: 'Send login code' });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Code sent successfully')).toBeInTheDocument();
      });

      // Wait for the redirect to be called (after 2000ms timeout in the component)
      await waitFor(
        () => {
          expect(mockRouterPush).toHaveBeenCalledWith(
            '/auth/verify-login-code?email=test%40example.com',
          );
        },
        { timeout: 3000 },
      );
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

      renderWithProviders(<EmailCodeRequestFormOrganism />, { translations });

      const emailInput = screen.getByPlaceholderText('your@email.com');
      const submitButton = screen.getByRole('button', { name: 'Send login code' });

      await user.type(emailInput, 'notfound@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Email not found')).toBeInTheDocument();
      });
    });

    it('should handle network errors gracefully', async () => {
      const user = userEvent.setup();
      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      renderWithProviders(<EmailCodeRequestFormOrganism />, { translations });

      const emailInput = screen.getByPlaceholderText('your@email.com');
      const submitButton = screen.getByRole('button', { name: 'Send login code' });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });

    it('should use fallback error message when none provided', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        ok: false,
        json: () => Promise.resolve({}),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      renderWithProviders(<EmailCodeRequestFormOrganism />, { translations });

      const emailInput = screen.getByPlaceholderText('your@email.com');
      const submitButton = screen.getByRole('button', { name: 'Send login code' });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Error sending login code')).toBeInTheDocument();
      });
    });
  });

  describe('Loading State', () => {
    it('should show loading state during submission', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        ok: true,
        json: () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ message: 'Success' }), 100),
          ),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      renderWithProviders(<EmailCodeRequestFormOrganism />, { translations });

      const emailInput = screen.getByPlaceholderText('your@email.com');
      const submitButton = screen.getByRole('button', { name: 'Send login code' });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Sending...')).toBeInTheDocument();
      });
    });

    it('should disable form elements while loading', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        ok: true,
        json: () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ message: 'Success' }), 100),
          ),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      renderWithProviders(<EmailCodeRequestFormOrganism />, { translations });

      const emailInput = screen.getByPlaceholderText('your@email.com');
      const submitButton = screen.getByRole('button', { name: 'Send login code' });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(emailInput).toBeDisabled();
        expect(submitButton).toBeDisabled();
      });
    });

    it('should re-enable form elements after completion', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Success' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      renderWithProviders(<EmailCodeRequestFormOrganism />, { translations });

      const emailInput = screen.getByPlaceholderText('your@email.com');
      const submitButton = screen.getByRole('button', { name: 'Send login code' });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Success')).toBeInTheDocument();
      });

      // After success, form is re-enabled (loading state is set to false)
      expect(emailInput).not.toBeDisabled();
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('User Interactions', () => {
    it('should update email value when typing', async () => {
      const user = userEvent.setup();
      renderWithProviders(<EmailCodeRequestFormOrganism />, { translations });

      const emailInput = screen.getByPlaceholderText(
        'your@email.com',
      ) as HTMLInputElement;
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

      renderWithProviders(<EmailCodeRequestFormOrganism />, { translations });

      const emailInput = screen.getByPlaceholderText('your@email.com');
      const submitButton = screen.getByRole('button', { name: 'Send login code' });

      await user.type(emailInput, 'test@example.com');
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

      renderWithProviders(<EmailCodeRequestFormOrganism />, { translations });

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
      renderWithProviders(<EmailCodeRequestFormOrganism ref={ref} />, {
        translations,
      });

      expect(ref).toHaveBeenCalled();
    });
  });

  describe('Email Encoding', () => {
    it('should encode email in redirect URL', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Success' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      renderWithProviders(<EmailCodeRequestFormOrganism />, { translations });

      const emailInput = screen.getByPlaceholderText('your@email.com');
      await user.type(emailInput, 'test+tag@example.com');
      await user.click(screen.getByRole('button', { name: 'Send login code' }));

      await waitFor(() => {
        expect(screen.getByText('Success')).toBeInTheDocument();
      });

      await waitFor(
        () => {
          expect(mockRouterPush).toHaveBeenCalledWith(
            '/auth/verify-login-code?email=test%2Btag%40example.com',
          );
        },
        { timeout: 3000 },
      );
    });
  });
});
