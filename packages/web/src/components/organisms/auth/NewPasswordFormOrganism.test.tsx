import { vi } from 'vitest';

// Mock next/navigation BEFORE component imports
const mockSearchParams = new URLSearchParams();
vi.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams,
  usePathname: () => '/en/auth/new-password',
}));

import { renderWithProviders, screen, waitFor, userEvent, fireEvent } from '@/test/test-utils';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { NewPasswordFormOrganism } from './NewPasswordFormOrganism';

// Mock dependencies
vi.mock('@/lib/locale', () => ({
  getCurrentLocalizedRoute: (route: string) => `/en${route}`,
}));

vi.mock('@/components/atoms/icons/Icon', () => ({
  Icon: ({ name, ...props }: any) => <span data-testid={`icon-${name}`} {...props} />,
}));

global.fetch = vi.fn();

const translations = {
  auth: {
    login: {
      newPassword: 'New Password',
    },
    register: {
      confirmPassword: 'Confirm Password',
    },
    newPassword: {
      submit: 'Reset Password',
      success: 'Password reset successfully',
      error: 'Failed to reset password',
      passwordMismatch: 'Passwords do not match',
      invalidToken: 'Invalid or missing token',
    },
  },
  Common: {
    general: {
      loading: 'Resetting...',
    },
  },
};

describe('NewPasswordFormOrganism - Organism', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockClear();
    mockSearchParams.set('token', 'valid-token-123');
    delete (window as any).location;
    (window as any).location = { href: '' };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render all form elements correctly', () => {
      renderWithProviders(<NewPasswordFormOrganism />, { translations });

      expect(screen.getByPlaceholderText('New Password')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Reset Password' })).toBeInTheDocument();
    });

    it('should render both password icons', () => {
      renderWithProviders(<NewPasswordFormOrganism />, { translations });

      const icons = screen.getAllByTestId('icon-lock');
      expect(icons).toHaveLength(2);
    });

    it('should have password inputs with correct type', () => {
      renderWithProviders(<NewPasswordFormOrganism />, { translations });

      const passwordInputs = screen.getAllByPlaceholderText(/password/i);
      passwordInputs.forEach(input => {
        expect(input).toHaveAttribute('type', 'password');
        expect(input).toHaveAttribute('required');
      });
    });
  });

  describe('Token Validation', () => {
    it('should extract token from URL params', () => {
      renderWithProviders(<NewPasswordFormOrganism />, { translations });

      const submitButton = screen.getByRole('button');
      expect(submitButton).not.toBeDisabled();
    });

    it('should show error when token is missing', () => {
      mockSearchParams.delete('token');
      renderWithProviders(<NewPasswordFormOrganism />, { translations });

      expect(screen.getByText('Invalid or missing token')).toBeInTheDocument();
    });

    it('should disable submit button when token is missing', () => {
      mockSearchParams.delete('token');
      renderWithProviders(<NewPasswordFormOrganism />, { translations });

      const submitButton = screen.getByRole('button');
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Form Validation', () => {
    it('should require both password fields', () => {
      renderWithProviders(<NewPasswordFormOrganism />, { translations });

      const passwordInput = screen.getByPlaceholderText('New Password');
      const confirmInput = screen.getByPlaceholderText('Confirm Password');

      expect(passwordInput).toHaveAttribute('required');
      expect(confirmInput).toHaveAttribute('required');
    });

    it('should validate password match before submission', async () => {
      renderWithProviders(<NewPasswordFormOrganism />, { translations });

      const passwordInput = screen.getByPlaceholderText('New Password');
      const confirmInput = screen.getByPlaceholderText('Confirm Password');
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

      renderWithProviders(<NewPasswordFormOrganism />, { translations });

      const passwordInput = screen.getByPlaceholderText('New Password');
      const confirmInput = screen.getByPlaceholderText('Confirm Password');

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

      renderWithProviders(<NewPasswordFormOrganism />, { translations });

      fireEvent.change(screen.getByPlaceholderText('New Password'), { target: { value: 'newpass123' } });
      fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'newpass123' } });
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

      renderWithProviders(<NewPasswordFormOrganism />, { translations });

      fireEvent.change(screen.getByPlaceholderText('New Password'), { target: { value: 'newpass123' } });
      fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'newpass123' } });
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

      renderWithProviders(<NewPasswordFormOrganism />, { translations });

      fireEvent.change(screen.getByPlaceholderText('New Password'), { target: { value: 'newpass123' } });
      fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'newpass123' } });
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

      renderWithProviders(<NewPasswordFormOrganism />, { translations });

      fireEvent.change(screen.getByPlaceholderText('New Password'), { target: { value: 'newpass123' } });
      fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'newpass123' } });
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Invalid token')).toBeInTheDocument();
      });
    });

    it('should handle network errors', async () => {
      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      renderWithProviders(<NewPasswordFormOrganism />, { translations });

      fireEvent.change(screen.getByPlaceholderText('New Password'), { target: { value: 'newpass123' } });
      fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'newpass123' } });
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

      renderWithProviders(<NewPasswordFormOrganism />, { translations });

      fireEvent.change(screen.getByPlaceholderText('New Password'), { target: { value: 'newpass123' } });
      fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'newpass123' } });
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

      renderWithProviders(<NewPasswordFormOrganism />, { translations });

      fireEvent.change(screen.getByPlaceholderText('New Password'), { target: { value: 'newpass123' } });
      fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'newpass123' } });
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

      renderWithProviders(<NewPasswordFormOrganism />, { translations });

      const passwordInput = screen.getByPlaceholderText('New Password');
      const confirmInput = screen.getByPlaceholderText('Confirm Password');
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
      renderWithProviders(<NewPasswordFormOrganism />, { translations });

      const passwordInput = screen.getByPlaceholderText('New Password') as HTMLInputElement;
      const confirmInput = screen.getByPlaceholderText('Confirm Password') as HTMLInputElement;

      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmInput, { target: { value: 'password123' } });

      expect(passwordInput.value).toBe('password123');
      expect(confirmInput.value).toBe('password123');
    });

    it('should clear previous errors on new submission', async () => {
      renderWithProviders(<NewPasswordFormOrganism />, { translations });

      const passwordInput = screen.getByPlaceholderText('New Password');
      const confirmInput = screen.getByPlaceholderText('Confirm Password');
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
      renderWithProviders(<NewPasswordFormOrganism ref={ref} />, { translations });

      expect(ref).toHaveBeenCalled();
    });
  });

  describe('Custom Styling', () => {
    it('should render with custom className', () => {
      const { container } = renderWithProviders(<NewPasswordFormOrganism className="custom-class" />, { translations });

      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });
  });
});
