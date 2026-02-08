import { vi } from 'vitest';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

import { renderWithProviders, screen, waitFor, userEvent, fireEvent } from '@/test/test-utils';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ResetPasswordFormOrganism } from './ResetPasswordFormOrganism';

global.fetch = vi.fn();

const translations = {
  auth: {
    resetPassword: {
      title: 'Reset Password',
      description: 'Enter your new password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
      passwordPlaceholder: 'Minimum 6 characters',
      submit: 'Update Password',
      passwordMismatch: 'Passwords do not match',
      passwordTooShort: 'Password must be at least 6 characters',
      error: 'Error resetting password',
      backToLogin: 'Back to login',
    },
  },
  Common: {
    general: {
      loading: 'Updating...',
    },
  },
};

describe('ResetPasswordFormOrganism - Organism', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render all form elements', () => {
      renderWithProviders(<ResetPasswordFormOrganism token="test-token" />, { translations });

      expect(screen.getByText('Reset Password')).toBeInTheDocument();
      expect(screen.getByText('Enter your new password')).toBeInTheDocument();
      expect(screen.getByLabelText('New Password')).toBeInTheDocument();
      expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Update Password' })).toBeInTheDocument();
    });

    it('should render back to login link', () => {
      renderWithProviders(<ResetPasswordFormOrganism token="test-token" />, { translations });

      const link = screen.getByRole('link', { name: 'Back to login' });
      expect(link).toHaveAttribute('href', '/auth/login');
    });

    it('should have password inputs with correct attributes', () => {
      renderWithProviders(<ResetPasswordFormOrganism token="test-token" />, { translations });

      const passwordInputs = screen.getAllByLabelText(/password/i);
      passwordInputs.forEach(input => {
        expect(input).toHaveAttribute('type', 'password');
        expect(input).toHaveAttribute('required');
        expect(input).toHaveAttribute('minLength', '6');
      });
    });
  });

  describe('Form Validation', () => {
    it('should validate password match', async () => {
      renderWithProviders(<ResetPasswordFormOrganism token="test-token" />, { translations });

      fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'password1' } });
      fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password2' } });
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
      });

      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should validate minimum password length', async () => {
      renderWithProviders(<ResetPasswordFormOrganism token="test-token" />, { translations });

      fireEvent.change(screen.getByLabelText('New Password'), { target: { value: '12345' } });
      fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: '12345' } });
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
      });

      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should accept valid passwords', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Success' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      renderWithProviders(<ResetPasswordFormOrganism token="test-token" />, { translations });

      fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'password123' } });
      fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });
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
        json: () => Promise.resolve({ message: 'Success' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      renderWithProviders(<ResetPasswordFormOrganism token="reset-token-123" />, { translations });

      fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'newpassword' } });
      fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'newpassword' } });
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/auth/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: 'reset-token-123',
            newPassword: 'newpassword',
          }),
        });
      });
    });

    it('should show success message on successful reset', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Password updated successfully' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      renderWithProviders(<ResetPasswordFormOrganism token="test-token" />, { translations });

      fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'newpassword' } });
      fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'newpassword' } });
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Password updated successfully')).toBeInTheDocument();
      });
    });

    it('should redirect to login after successful reset', async () => {
      vi.useFakeTimers();

      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Success' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      renderWithProviders(<ResetPasswordFormOrganism token="test-token" />, { translations });

      fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'newpassword' } });
      fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'newpassword' } });
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText(/Contraseña actualizada exitosamente/i)).toBeInTheDocument();
      });

      vi.advanceTimersByTime(3000);

      expect(mockPush).toHaveBeenCalledWith('/auth/login');

      vi.useRealTimers();
    });
  });

  describe('Error Handling', () => {
    it('should display error message on failed reset', async () => {
      const mockResponse = {
        ok: false,
        json: () => Promise.resolve({ message: 'Invalid token' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      renderWithProviders(<ResetPasswordFormOrganism token="test-token" />, { translations });

      fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'newpassword' } });
      fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'newpassword' } });
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Invalid token')).toBeInTheDocument();
      });
    });

    it('should handle network errors', async () => {
      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      renderWithProviders(<ResetPasswordFormOrganism token="test-token" />, { translations });

      fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'newpassword' } });
      fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'newpassword' } });
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

      renderWithProviders(<ResetPasswordFormOrganism token="test-token" />, { translations });

      fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'newpassword' } });
      fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'newpassword' } });
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Error resetting password')).toBeInTheDocument();
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

      renderWithProviders(<ResetPasswordFormOrganism token="test-token" />, { translations });

      fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'newpassword' } });
      fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'newpassword' } });
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Updating...')).toBeInTheDocument();
      });
    });

    it('should disable form elements while loading', async () => {
      const mockResponse = {
        ok: true,
        json: () => new Promise((resolve) => setTimeout(() => resolve({ message: 'Success' }), 100)),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      renderWithProviders(<ResetPasswordFormOrganism token="test-token" />, { translations });

      const passwordInput = screen.getByLabelText('New Password');
      const confirmInput = screen.getByLabelText('Confirm Password');
      const submitButton = screen.getByRole('button');

      fireEvent.change(passwordInput, { target: { value: 'newpassword' } });
      fireEvent.change(confirmInput, { target: { value: 'newpassword' } });
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
      renderWithProviders(<ResetPasswordFormOrganism token="test-token" />, { translations });

      const passwordInput = screen.getByLabelText('New Password') as HTMLInputElement;
      const confirmInput = screen.getByLabelText('Confirm Password') as HTMLInputElement;

      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmInput, { target: { value: 'password123' } });

      expect(passwordInput.value).toBe('password123');
      expect(confirmInput.value).toBe('password123');
    });

    it('should clear previous errors on new submission', async () => {
      renderWithProviders(<ResetPasswordFormOrganism token="test-token" />, { translations });

      // First submission with mismatch
      fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'pass1' } });
      fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'pass2' } });
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
      });

      // Second submission with matching passwords
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Success' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'password123' } });
      fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.queryByText('Passwords do not match')).not.toBeInTheDocument();
      });
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to wrapper div', () => {
      const ref = vi.fn();
      renderWithProviders(<ResetPasswordFormOrganism ref={ref} token="test-token" />, { translations });

      expect(ref).toHaveBeenCalled();
    });
  });

  describe('Custom Styling', () => {
    it('should render with custom className', () => {
      const { container } = renderWithProviders(<ResetPasswordFormOrganism token="test-token" className="custom-class" />, { translations });

      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });
  });

  describe('Token Prop', () => {
    it('should accept token as prop', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Success' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      renderWithProviders(<ResetPasswordFormOrganism token="my-custom-token" />, { translations });

      fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'newpassword' } });
      fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'newpassword' } });
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/auth/reset-password',
          expect.objectContaining({
            body: JSON.stringify({
              token: 'my-custom-token',
              newPassword: 'newpassword',
            }),
          })
        );
      });
    });
  });
});
