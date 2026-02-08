import { vi } from 'vitest';

const mockRedirectAfterLogin = vi.fn();
vi.mock('@/hooks/useAuthRedirect', () => ({
  useAuthRedirect: () => ({
    redirectAfterLogin: mockRedirectAfterLogin,
  }),
}));

import { renderWithProviders, screen, waitFor, userEvent, fireEvent } from '@/test/test-utils';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VerifyLoginCodeFormOrganism } from './VerifyLoginCodeFormOrganism';

global.fetch = vi.fn();

const translations = {
  auth: {
    verifyCode: {
      description: 'We sent a 6-digit code to:',
      codeLabel: 'Verification Code',
      submit: 'Verify Code',
      error: 'Error verifying code',
    },
  },
  Common: {
    general: {
      loading: 'Verifying...',
    },
  },
};

describe('VerifyLoginCodeFormOrganism - Organism', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockClear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Rendering', () => {
    it('should render all 6 code input fields', () => {
      renderWithProviders(<VerifyLoginCodeFormOrganism email="test@example.com" />, { translations });

      const inputs = screen.getAllByRole('textbox');
      expect(inputs).toHaveLength(6);

      inputs.forEach(input => {
        expect(input).toHaveAttribute('maxLength', '1');
        expect(input).toHaveAttribute('inputMode', 'numeric');
      });
    });

    it('should display email address', () => {
      renderWithProviders(<VerifyLoginCodeFormOrganism email="test@example.com" />, { translations });

      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    it('should render submit button', () => {
      renderWithProviders(<VerifyLoginCodeFormOrganism email="test@example.com" />, { translations });

      expect(screen.getByRole('button', { name: 'Verify Code' })).toBeInTheDocument();
    });

    it('should show resend countdown', () => {
      renderWithProviders(<VerifyLoginCodeFormOrganism email="test@example.com" />, { translations });

      expect(screen.getByText(/Reenviar código en \d+s/)).toBeInTheDocument();
    });

    it('should render email change link', () => {
      renderWithProviders(<VerifyLoginCodeFormOrganism email="test@example.com" />, { translations });

      const link = screen.getByRole('link', { name: 'Usar otro email' });
      expect(link).toHaveAttribute('href', '/auth/email-login');
    });
  });

  describe('Code Input Behavior', () => {
    it('should only accept numeric values', async () => {
      const user = userEvent.setup({ delay: null });
      renderWithProviders(<VerifyLoginCodeFormOrganism email="test@example.com" />, { translations });

      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
      await user.type(inputs[0], 'abc123');

      expect(inputs[0].value).toBe('3');
    });

    it('should auto-focus next input on digit entry', async () => {
      const user = userEvent.setup({ delay: null });
      renderWithProviders(<VerifyLoginCodeFormOrganism email="test@example.com" />, { translations });

      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];

      await user.type(inputs[0], '1');
      expect(document.activeElement).toBe(inputs[1]);

      await user.type(inputs[1], '2');
      expect(document.activeElement).toBe(inputs[2]);
    });

    it('should handle backspace navigation', async () => {
      renderWithProviders(<VerifyLoginCodeFormOrganism email="test@example.com" />, { translations });

      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];

      inputs[2].focus();
      fireEvent.keyDown(inputs[2], { key: 'Backspace' });

      expect(document.activeElement).toBe(inputs[1]);
    });

    it('should limit to one character per input', async () => {
      const user = userEvent.setup({ delay: null });
      renderWithProviders(<VerifyLoginCodeFormOrganism email="test@example.com" />, { translations });

      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
      await user.type(inputs[0], '123');

      expect(inputs[0].value).toBe('3');
    });
  });

  describe('Form Validation', () => {
    it('should disable submit button when code is incomplete', () => {
      renderWithProviders(<VerifyLoginCodeFormOrganism email="test@example.com" />, { translations });

      const submitButton = screen.getByRole('button', { name: 'Verify Code' });
      expect(submitButton).toBeDisabled();
    });

    it('should enable submit button when code is complete', async () => {
      const user = userEvent.setup({ delay: null });
      renderWithProviders(<VerifyLoginCodeFormOrganism email="test@example.com" />, { translations });

      const inputs = screen.getAllByRole('textbox');
      for (let i = 0; i < 6; i++) {
        await user.type(inputs[i], String(i + 1));
      }

      const submitButton = screen.getByRole('button', { name: 'Verify Code' });
      expect(submitButton).not.toBeDisabled();
    });

    it('should show error for incomplete code on submit', async () => {
      renderWithProviders(<VerifyLoginCodeFormOrganism email="test@example.com" />, { translations });

      const inputs = screen.getAllByRole('textbox');
      fireEvent.change(inputs[0], { target: { value: '1' } });

      const submitButton = screen.getByRole('button', { name: 'Verify Code' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Por favor ingresa el código completo de 6 dígitos')).toBeInTheDocument();
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

      renderWithProviders(<VerifyLoginCodeFormOrganism email="test@example.com" />, { translations });

      const inputs = screen.getAllByRole('textbox');
      for (let i = 0; i < 6; i++) {
        fireEvent.change(inputs[i], { target: { value: String(i + 1) } });
      }

      const submitButton = screen.getByRole('button');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/auth/verify-login-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
            code: '123456',
          }),
        });
      });
    });

    it('should show success message on verification', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Verified' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      renderWithProviders(<VerifyLoginCodeFormOrganism email="test@example.com" />, { translations });

      const inputs = screen.getAllByRole('textbox');
      for (let i = 0; i < 6; i++) {
        fireEvent.change(inputs[i], { target: { value: '1' } });
      }

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText(/Código verificado correctamente/i)).toBeInTheDocument();
      });
    });

    it('should redirect after successful verification', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Success' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      renderWithProviders(<VerifyLoginCodeFormOrganism email="test@example.com" />, { translations });

      const inputs = screen.getAllByRole('textbox');
      for (let i = 0; i < 6; i++) {
        fireEvent.change(inputs[i], { target: { value: '1' } });
      }

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText(/Código verificado correctamente/i)).toBeInTheDocument();
      });

      vi.advanceTimersByTime(1000);

      expect(mockRedirectAfterLogin).toHaveBeenCalled();
    });

    it('should clear localStorage on success', async () => {
      const mockRemoveItem = vi.spyOn(Storage.prototype, 'removeItem');
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Success' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      renderWithProviders(<VerifyLoginCodeFormOrganism email="test@example.com" />, { translations });

      const inputs = screen.getAllByRole('textbox');
      for (let i = 0; i < 6; i++) {
        fireEvent.change(inputs[i], { target: { value: '1' } });
      }

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(mockRemoveItem).toHaveBeenCalledWith('user');
      });

      mockRemoveItem.mockRestore();
    });
  });

  describe('Error Handling', () => {
    it('should display error message on verification failure', async () => {
      const mockResponse = {
        ok: false,
        json: () => Promise.resolve({ message: 'Invalid code' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      renderWithProviders(<VerifyLoginCodeFormOrganism email="test@example.com" />, { translations });

      const inputs = screen.getAllByRole('textbox');
      for (let i = 0; i < 6; i++) {
        fireEvent.change(inputs[i], { target: { value: '1' } });
      }

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Invalid code')).toBeInTheDocument();
      });
    });

    it('should clear code on error', async () => {
      const mockResponse = {
        ok: false,
        json: () => Promise.resolve({ message: 'Error' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      renderWithProviders(<VerifyLoginCodeFormOrganism email="test@example.com" />, { translations });

      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
      for (let i = 0; i < 6; i++) {
        fireEvent.change(inputs[i], { target: { value: '1' } });
      }

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Error')).toBeInTheDocument();
      });

      inputs.forEach(input => {
        expect(input.value).toBe('');
      });
    });

    it('should handle network errors', async () => {
      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      renderWithProviders(<VerifyLoginCodeFormOrganism email="test@example.com" />, { translations });

      const inputs = screen.getAllByRole('textbox');
      for (let i = 0; i < 6; i++) {
        fireEvent.change(inputs[i], { target: { value: '1' } });
      }

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });
  });

  describe('Resend Functionality', () => {
    it('should show countdown timer initially', () => {
      renderWithProviders(<VerifyLoginCodeFormOrganism email="test@example.com" />, { translations });

      expect(screen.getByText(/Reenviar código en \d+s/)).toBeInTheDocument();
    });

    it('should show resend button after countdown', () => {
      renderWithProviders(<VerifyLoginCodeFormOrganism email="test@example.com" />, { translations });

      vi.advanceTimersByTime(60000);

      expect(screen.getByRole('button', { name: 'Reenviar código' })).toBeInTheDocument();
    });

    it('should call resend API when button clicked', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Code resent' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      renderWithProviders(<VerifyLoginCodeFormOrganism email="test@example.com" />, { translations });

      vi.advanceTimersByTime(60000);

      const resendButton = screen.getByRole('button', { name: 'Reenviar código' });
      fireEvent.click(resendButton);

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

    it('should reset countdown after resend', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Success' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      renderWithProviders(<VerifyLoginCodeFormOrganism email="test@example.com" />, { translations });

      vi.advanceTimersByTime(60000);

      const resendButton = screen.getByRole('button', { name: 'Reenviar código' });
      fireEvent.click(resendButton);

      await waitFor(() => {
        expect(screen.getByText(/Reenviar código en \d+s/)).toBeInTheDocument();
      });
    });
  });

  describe('Loading State', () => {
    it('should disable inputs during verification', async () => {
      const mockResponse = {
        ok: true,
        json: () => new Promise((resolve) => setTimeout(() => resolve({ message: 'Success' }), 100)),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      renderWithProviders(<VerifyLoginCodeFormOrganism email="test@example.com" />, { translations });

      const inputs = screen.getAllByRole('textbox');
      for (let i = 0; i < 6; i++) {
        fireEvent.change(inputs[i], { target: { value: '1' } });
      }

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        inputs.forEach(input => {
          expect(input).toBeDisabled();
        });
      });
    });

    it('should show loading text on button', async () => {
      const mockResponse = {
        ok: true,
        json: () => new Promise((resolve) => setTimeout(() => resolve({ message: 'Success' }), 100)),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      renderWithProviders(<VerifyLoginCodeFormOrganism email="test@example.com" />, { translations });

      const inputs = screen.getAllByRole('textbox');
      for (let i = 0; i < 6; i++) {
        fireEvent.change(inputs[i], { target: { value: '1' } });
      }

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Verificando...')).toBeInTheDocument();
      });
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to wrapper div', () => {
      const ref = vi.fn();
      renderWithProviders(<VerifyLoginCodeFormOrganism ref={ref} email="test@example.com" />, { translations });

      expect(ref).toHaveBeenCalled();
    });
  });

  describe('Custom Styling', () => {
    it('should render with custom className', () => {
      const { container } = renderWithProviders(
        <VerifyLoginCodeFormOrganism email="test@example.com" className="custom-class" />,
        { translations }
      );

      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });
  });
});
