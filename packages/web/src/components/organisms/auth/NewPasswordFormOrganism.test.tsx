import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { NewPasswordFormOrganism } from './NewPasswordFormOrganism';

// Mock dependencies
vi.mock('@/context/TranslationsContext', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'auth.login.newPassword': 'New Password',
      'auth.register.confirmPassword': 'Confirm Password',
      'auth.newPassword.submit': 'Reset Password',
      'auth.newPassword.success': 'Password reset successfully',
      'auth.newPassword.error': 'Failed to reset password',
      'auth.newPassword.passwordMismatch': 'Passwords do not match',
      'auth.newPassword.invalidToken': 'Invalid or missing token',
      'Common.general.loading': 'Resetting...',
    };
    return translations[key] || key;
  },
}));

const mockSearchParams = new URLSearchParams();
vi.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams,
  usePathname: () => '/en/auth/new-password',
}));

vi.mock('@/lib/locale', () => ({
  getCurrentLocalizedRoute: (route: string) => `/en${route}`,
}));

vi.mock('@/components/atoms/icons/Icon', () => ({
  Icon: ({ name, ...props }: any) => <span data-testid={`icon-${name}`} {...props} />,
}));

global.fetch = vi.fn();

describe('NewPasswordFormOrganism - Organism', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockClear();
    mockSearchParams.set('token', 'valid-token-123');
    delete (window as any).location;
    (window as any).location = { href: '' };
  });

  describe('Rendering', () => {
    it('should render all form elements correctly', () => {
      render(<NewPasswordFormOrganism />);

      expect(screen.getByLabelText('New Password')).toBeInTheDocument();
      expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Reset Password' })).toBeInTheDocument();
    });

    it('should render both password icons', () => {
      render(<NewPasswordFormOrganism />);

      const icons = screen.getAllByTestId('icon-lock');
      expect(icons).toHaveLength(2);
    });

    it('should have password inputs with correct type', () => {
      render(<NewPasswordFormOrganism />);

      const passwordInputs = screen.getAllByLabelText(/password/i);
      passwordInputs.forEach(input => {
        expect(input).toHaveAttribute('type', 'password');
        expect(input).toHaveAttribute('required');
      });
    });
  });

  describe('Token Validation', () => {
    it('should extract token from URL params', () => {
      render(<NewPasswordFormOrganism />);

      const submitButton = screen.getByRole('button');
      expect(submitButton).not.toBeDisabled();
    });

    it('should show error when token is missing', () => {
      mockSearchParams.delete('token');
      render(<NewPasswordFormOrganism />);

      expect(screen.getByText('Invalid or missing token')).toBeInTheDocument();
    });

    it('should disable submit button when token is missing', () => {
      mockSearchParams.delete('token');
      render(<NewPasswordFormOrganism />);

      const submitButton = screen.getByRole('button');
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Form Validation', () => {
    it('should require both password fields', () => {
      render(<NewPasswordFormOrganism />);

      const passwordInput = screen.getByLabelText('New Password');
      const confirmInput = screen.getByLabelText('Confirm Password');

      expect(passwordInput).toHaveAttribute('required');
      expect(confirmInput).toHaveAttribute('required');
    });

    it('should validate password match before submission', async () => {
      render(<NewPasswordFormOrganism />);

      const passwordInput = screen.getByLabelText('New Password');
      const confirmInput = screen.getByLabelText('Confirm Password');
      const submitButton = screen.getByRole('button');

      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmInput, { target: { value: 'password456' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
      });

      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should accept matching passwords', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Success' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      render(<NewPasswordFormOrganism />);

      const passwordInput = screen.getByLabelText('New Password');
      const confirmInput = screen.getByLabelText('Confirm Password');

      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmInput, { target: { value: 'password123' } });
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
    });
  });

  describe('Form Submission', () => {
    it('should call API with correct data', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Password reset' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      render(<NewPasswordFormOrganism />);

      fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'newpass123' } });
      fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'newpass123' } });
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/auth/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: 'valid-token-123', password: 'newpass123' }),
        });
      });
    });

    it('should show success message on successful submission', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Success' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      render(<NewPasswordFormOrganism />);

      fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'newpass123' } });
      fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'newpass123' } });
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Password reset successfully')).toBeInTheDocument();
      });
    });

    it('should redirect to login after success', async () => {
      vi.useFakeTimers();

      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Success' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      render(<NewPasswordFormOrganism />);

      fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'newpass123' } });
      fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'newpass123' } });
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Password reset successfully')).toBeInTheDocument();
      });

      vi.advanceTimersByTime(2000);

      expect(window.location.href).toBe('/en/auth/login');

      vi.useRealTimers();
    });
  });

  describe('Error Handling', () => {
    it('should display error message on failed submission', async () => {
      const mockResponse = {
        ok: false,
        json: () => Promise.resolve({ message: 'Invalid token' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      render(<NewPasswordFormOrganism />);

      fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'newpass123' } });
      fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'newpass123' } });
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Invalid token')).toBeInTheDocument();
      });
    });

    it('should handle network errors', async () => {
      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      render(<NewPasswordFormOrganism />);

      fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'newpass123' } });
      fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'newpass123' } });
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

      render(<NewPasswordFormOrganism />);

      fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'newpass123' } });
      fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'newpass123' } });
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Failed to reset password')).toBeInTheDocument();
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

      render(<NewPasswordFormOrganism />);

      fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'newpass123' } });
      fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'newpass123' } });
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Resetting...')).toBeInTheDocument();
      });
    });

    it('should disable form elements while loading', async () => {
      const mockResponse = {
        ok: true,
        json: () => new Promise((resolve) => setTimeout(() => resolve({ message: 'Success' }), 100)),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      render(<NewPasswordFormOrganism />);

      const passwordInput = screen.getByLabelText('New Password');
      const confirmInput = screen.getByLabelText('Confirm Password');
      const submitButton = screen.getByRole('button');

      fireEvent.change(passwordInput, { target: { value: 'newpass123' } });
      fireEvent.change(confirmInput, { target: { value: 'newpass123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(passwordInput).toBeDisabled();
        expect(confirmInput).toBeDisabled();
        expect(submitButton).toBeDisabled();
      });
    });
  });

  describe('User Interactions', () => {
    it('should update password values when typing', async () => {
      const user = userEvent.setup();
      render(<NewPasswordFormOrganism />);

      const passwordInput = screen.getByLabelText('New Password') as HTMLInputElement;
      const confirmInput = screen.getByLabelText('Confirm Password') as HTMLInputElement;

      await user.type(passwordInput, 'password123');
      await user.type(confirmInput, 'password123');

      expect(passwordInput.value).toBe('password123');
      expect(confirmInput.value).toBe('password123');
    });

    it('should clear previous errors on new submission', async () => {
      render(<NewPasswordFormOrganism />);

      const passwordInput = screen.getByLabelText('New Password');
      const confirmInput = screen.getByLabelText('Confirm Password');
      const submitButton = screen.getByRole('button');

      // First submission with mismatch
      fireEvent.change(passwordInput, { target: { value: 'pass1' } });
      fireEvent.change(confirmInput, { target: { value: 'pass2' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
      });

      // Second submission with match
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Success' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByText('Passwords do not match')).not.toBeInTheDocument();
      });
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to form element', () => {
      const ref = vi.fn();
      render(<NewPasswordFormOrganism ref={ref} />);

      expect(ref).toHaveBeenCalled();
    });
  });

  describe('Custom Styling', () => {
    it('should render with custom className', () => {
      const { container } = render(<NewPasswordFormOrganism className="custom-class" />);

      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });
  });
});
