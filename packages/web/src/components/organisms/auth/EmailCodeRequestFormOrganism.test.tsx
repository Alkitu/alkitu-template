import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { EmailCodeRequestFormOrganism } from './EmailCodeRequestFormOrganism';

// Mock dependencies
vi.mock('@/context/TranslationsContext', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'auth.emailCode.title': 'Request Login Code',
      'auth.emailCode.description': 'Enter your email and we will send you a 6-digit code',
      'auth.emailCode.emailLabel': 'Email',
      'auth.emailCode.emailPlaceholder': 'your@email.com',
      'auth.emailCode.submit': 'Send login code',
      'auth.emailCode.error': 'Error sending code',
      'Common.general.loading': 'Sending...',
    };
    return translations[key] || key;
  },
}));

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('@/components/atoms/icons/Icon', () => ({
  Icon: ({ name, ...props }: any) => <span data-testid={`icon-${name}`} {...props} />,
}));

// Mock fetch globally
global.fetch = vi.fn();

describe('EmailCodeRequestFormOrganism - Organism', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockClear();
  });

  describe('Rendering', () => {
    it('should render all form elements correctly', () => {
      render(<EmailCodeRequestFormOrganism />);

      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Send login code' })).toBeInTheDocument();
      expect(screen.getByTestId('icon-mail')).toBeInTheDocument();
    });

    it('should render description text', () => {
      render(<EmailCodeRequestFormOrganism />);

      expect(screen.getByText('Enter your email and we will send you a 6-digit code')).toBeInTheDocument();
    });

    it('should render registration link', () => {
      render(<EmailCodeRequestFormOrganism />);

      const link = screen.getByRole('link', { name: /Regístrate aquí/i });
      expect(link).toHaveAttribute('href', '/auth/register');
    });

    it('should render with custom className', () => {
      const { container } = render(<EmailCodeRequestFormOrganism className="custom-class" />);

      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should require email field', () => {
      render(<EmailCodeRequestFormOrganism />);

      const emailInput = screen.getByLabelText('Email');
      expect(emailInput).toHaveAttribute('required');
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('should validate email format', () => {
      render(<EmailCodeRequestFormOrganism />);

      const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

      expect(emailInput.validity.valid).toBe(false);
    });

    it('should accept valid email', () => {
      render(<EmailCodeRequestFormOrganism />);

      const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      expect(emailInput.value).toBe('test@example.com');
      expect(emailInput.validity.valid).toBe(true);
    });
  });

  describe('Form Submission', () => {
    it('should submit form with valid email', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Code sent successfully' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      render(<EmailCodeRequestFormOrganism />);

      const emailInput = screen.getByLabelText('Email');
      const submitButton = screen.getByRole('button', { name: 'Send login code' });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(submitButton);

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
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Code sent successfully' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      render(<EmailCodeRequestFormOrganism />);

      const emailInput = screen.getByLabelText('Email');
      const submitButton = screen.getByRole('button', { name: 'Send login code' });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Code sent successfully')).toBeInTheDocument();
      });
    });

    it('should redirect to verification page after success', async () => {
      vi.useFakeTimers();

      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Code sent successfully' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      render(<EmailCodeRequestFormOrganism />);

      const emailInput = screen.getByLabelText('Email');
      const submitButton = screen.getByRole('button', { name: 'Send login code' });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Code sent successfully')).toBeInTheDocument();
      });

      vi.advanceTimersByTime(2000);

      expect(mockPush).toHaveBeenCalledWith(
        '/auth/verify-login-code?email=test%40example.com'
      );

      vi.useRealTimers();
    });
  });

  describe('Error Handling', () => {
    it('should display error message on failed submission', async () => {
      const mockResponse = {
        ok: false,
        json: () => Promise.resolve({ message: 'Email not found' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      render(<EmailCodeRequestFormOrganism />);

      const emailInput = screen.getByLabelText('Email');
      const submitButton = screen.getByRole('button', { name: 'Send login code' });

      fireEvent.change(emailInput, { target: { value: 'notfound@example.com' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Email not found')).toBeInTheDocument();
      });
    });

    it('should handle network errors gracefully', async () => {
      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      render(<EmailCodeRequestFormOrganism />);

      const emailInput = screen.getByLabelText('Email');
      const submitButton = screen.getByRole('button', { name: 'Send login code' });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });

    it('should use fallback error message when none provided', async () => {
      const mockResponse = {
        ok: false,
        json: () => Promise.resolve({}),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      render(<EmailCodeRequestFormOrganism />);

      const emailInput = screen.getByLabelText('Email');
      const submitButton = screen.getByRole('button', { name: 'Send login code' });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Error sending login code')).toBeInTheDocument();
      });
    });
  });

  describe('Loading State', () => {
    it('should show loading state during submission', async () => {
      const mockResponse = {
        ok: true,
        json: () => new Promise((resolve) => setTimeout(() => resolve({ message: 'Success' }), 100)),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      render(<EmailCodeRequestFormOrganism />);

      const emailInput = screen.getByLabelText('Email');
      const submitButton = screen.getByRole('button', { name: 'Send login code' });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Sending...')).toBeInTheDocument();
      });
    });

    it('should disable form elements while loading', async () => {
      const mockResponse = {
        ok: true,
        json: () => new Promise((resolve) => setTimeout(() => resolve({ message: 'Success' }), 100)),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      render(<EmailCodeRequestFormOrganism />);

      const emailInput = screen.getByLabelText('Email');
      const submitButton = screen.getByRole('button', { name: 'Send login code' });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(emailInput).toBeDisabled();
        expect(submitButton).toBeDisabled();
      });
    });

    it('should re-enable form elements after completion', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Success' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      render(<EmailCodeRequestFormOrganism />);

      const emailInput = screen.getByLabelText('Email');
      const submitButton = screen.getByRole('button', { name: 'Send login code' });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Success')).toBeInTheDocument();
      });

      expect(emailInput).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });
  });

  describe('User Interactions', () => {
    it('should update email value when typing', async () => {
      const user = userEvent.setup();
      render(<EmailCodeRequestFormOrganism />);

      const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
      await user.type(emailInput, 'test@example.com');

      expect(emailInput.value).toBe('test@example.com');
    });

    it('should clear previous errors on new submission', async () => {
      const mockErrorResponse = {
        ok: false,
        json: () => Promise.resolve({ message: 'Error' }),
      };
      const mockSuccessResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Success' }),
      };

      (global.fetch as any).mockResolvedValueOnce(mockErrorResponse);

      render(<EmailCodeRequestFormOrganism />);

      const emailInput = screen.getByLabelText('Email');
      const submitButton = screen.getByRole('button', { name: 'Send login code' });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Error')).toBeInTheDocument();
      });

      (global.fetch as any).mockResolvedValueOnce(mockSuccessResponse);
      fireEvent.click(submitButton);

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

      render(<EmailCodeRequestFormOrganism />);

      const emailInput = screen.getByLabelText('Email');
      await user.type(emailInput, 'test@example.com{Enter}');

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to wrapper div', () => {
      const ref = vi.fn();
      render(<EmailCodeRequestFormOrganism ref={ref} />);

      expect(ref).toHaveBeenCalled();
    });
  });

  describe('Email Encoding', () => {
    it('should encode email in redirect URL', async () => {
      vi.useFakeTimers();

      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Success' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      render(<EmailCodeRequestFormOrganism />);

      const emailInput = screen.getByLabelText('Email');
      fireEvent.change(emailInput, { target: { value: 'test+tag@example.com' } });
      fireEvent.click(screen.getByRole('button', { name: 'Send login code' }));

      await waitFor(() => {
        expect(screen.getByText('Success')).toBeInTheDocument();
      });

      vi.advanceTimersByTime(2000);

      expect(mockPush).toHaveBeenCalledWith(
        '/auth/verify-login-code?email=test%2Btag%40example.com'
      );

      vi.useRealTimers();
    });
  });
});
