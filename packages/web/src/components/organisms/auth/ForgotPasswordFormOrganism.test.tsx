import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { ForgotPasswordFormOrganism } from './ForgotPasswordFormOrganism';

// Mock dependencies
vi.mock('@/context/TranslationsContext', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'auth.forgotPassword.title': 'Forgot Password',
      'auth.forgotPassword.description': 'Enter your email and we will send you a reset link',
      'auth.forgotPassword.emailLabel': 'Email',
      'auth.forgotPassword.emailPlaceholder': 'your@email.com',
      'auth.forgotPassword.submit': 'Send reset link',
      'auth.forgotPassword.error': 'Error sending email',
      'Common.general.loading': 'Sending...',
    };
    return translations[key] || key;
  },
}));

vi.mock('@/components/atoms/icons/Icon', () => ({
  Icon: ({ name, ...props }: any) => <span data-testid={`icon-${name}`} {...props} />,
}));

global.fetch = vi.fn();

describe('ForgotPasswordFormOrganism - Organism', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockClear();
  });

  describe('Rendering', () => {
    it('should render all form elements correctly', () => {
      render(<ForgotPasswordFormOrganism />);

      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Send reset link' })).toBeInTheDocument();
      expect(screen.getByTestId('icon-mail')).toBeInTheDocument();
    });

    it('should render description text', () => {
      render(<ForgotPasswordFormOrganism />);

      expect(screen.getByText('Enter your email and we will send you a reset link')).toBeInTheDocument();
    });

    it('should have email input with correct attributes', () => {
      render(<ForgotPasswordFormOrganism />);

      const emailInput = screen.getByLabelText('Email');
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('required');
      expect(emailInput).toHaveAttribute('placeholder', 'your@email.com');
    });
  });

  describe('Form Validation', () => {
    it('should require email field', () => {
      render(<ForgotPasswordFormOrganism />);

      const emailInput = screen.getByLabelText('Email');
      expect(emailInput).toHaveAttribute('required');
    });

    it('should validate email format', () => {
      render(<ForgotPasswordFormOrganism />);

      const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
      fireEvent.change(emailInput, { target: { value: 'invalid' } });

      expect(emailInput.validity.valid).toBe(false);
    });

    it('should accept valid email', () => {
      render(<ForgotPasswordFormOrganism />);

      const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      expect(emailInput.value).toBe('test@example.com');
      expect(emailInput.validity.valid).toBe(true);
    });
  });

  describe('Form Submission', () => {
    it('should call API with correct data', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Email sent' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      render(<ForgotPasswordFormOrganism />);

      const emailInput = screen.getByLabelText('Email');
      const submitButton = screen.getByRole('button');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(submitButton);

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
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Reset link sent' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      render(<ForgotPasswordFormOrganism />);

      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Reset link sent')).toBeInTheDocument();
      });
    });

    it('should clear form after successful submission', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Email sent' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      render(<ForgotPasswordFormOrganism />);

      const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(emailInput.value).toBe('');
      });
    });

    it('should use fallback success message', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({}),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      render(<ForgotPasswordFormOrganism />);

      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText(/Se ha enviado un email/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message on failed submission', async () => {
      const mockResponse = {
        ok: false,
        json: () => Promise.resolve({ message: 'Email not found' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      render(<ForgotPasswordFormOrganism />);

      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'notfound@example.com' } });
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Email not found')).toBeInTheDocument();
      });
    });

    it('should handle network errors', async () => {
      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      render(<ForgotPasswordFormOrganism />);

      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });

    it('should use fallback error message', async () => {
      const mockResponse = {
        ok: false,
        json: () => Promise.resolve({}),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      render(<ForgotPasswordFormOrganism />);

      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Error sending reset email')).toBeInTheDocument();
      });
    });

    it('should not clear form on error', async () => {
      const mockResponse = {
        ok: false,
        json: () => Promise.resolve({ message: 'Error' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      render(<ForgotPasswordFormOrganism />);

      const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Error')).toBeInTheDocument();
      });

      expect(emailInput.value).toBe('test@example.com');
    });
  });

  describe('Loading State', () => {
    it('should show loading state during submission', async () => {
      const mockResponse = {
        ok: true,
        json: () => new Promise((resolve) => setTimeout(() => resolve({ message: 'Success' }), 100)),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      render(<ForgotPasswordFormOrganism />);

      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
      fireEvent.click(screen.getByRole('button'));

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

      render(<ForgotPasswordFormOrganism />);

      const emailInput = screen.getByLabelText('Email');
      const submitButton = screen.getByRole('button');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(emailInput).toBeDisabled();
        expect(submitButton).toBeDisabled();
      });
    });

    it('should re-enable form after completion', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Success' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      render(<ForgotPasswordFormOrganism />);

      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Success')).toBeInTheDocument();
      });

      const emailInput = screen.getByLabelText('Email');
      const submitButton = screen.getByRole('button');

      expect(emailInput).not.toBeDisabled();
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('User Interactions', () => {
    it('should update email value when typing', async () => {
      const user = userEvent.setup();
      render(<ForgotPasswordFormOrganism />);

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

      render(<ForgotPasswordFormOrganism />);

      const submitButton = screen.getByRole('button');
      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
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

      render(<ForgotPasswordFormOrganism />);

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
      render(<ForgotPasswordFormOrganism ref={ref} />);

      expect(ref).toHaveBeenCalled();
    });
  });

  describe('Custom Styling', () => {
    it('should render with custom className', () => {
      const { container } = render(<ForgotPasswordFormOrganism className="custom-class" />);

      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });

    it('should render with default className when not provided', () => {
      const { container } = render(<ForgotPasswordFormOrganism />);

      expect(container.querySelector('.space-y-6')).toBeInTheDocument();
    });
  });
});
