import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { NewVerificationFormOrganism } from './NewVerificationFormOrganism';

// Mock dependencies
vi.mock('@/context/TranslationsContext', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'auth.verification.title': 'Verify Email',
      'auth.verification.success': 'Email verified successfully!',
      'auth.verification.error': 'Email verification failed',
      'Common.general.loading': 'Verifying...',
    };
    return translations[key] || key;
  },
}));

const mockSearchParams = new URLSearchParams();
vi.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams,
  usePathname: () => '/en/auth/verify',
}));

vi.mock('@/lib/locale', () => ({
  getCurrentLocalizedRoute: (route: string) => `/en${route}`,
}));

vi.mock('@/components/primitives/ui/LoadingSpinner', () => ({
  default: () => <div data-testid="loading-spinner">Loading...</div>,
}));

global.fetch = vi.fn();

describe('NewVerificationFormOrganism - Organism', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockClear();
    mockSearchParams.set('token', 'valid-token-123');
    delete (window as any).location;
    (window as any).location = { href: '' };
  });

  describe('Rendering', () => {
    it('should show loading state initially', () => {
      render(<NewVerificationFormOrganism />);

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      expect(screen.getByText('Verifying your email...')).toBeInTheDocument();
    });

    it('should call verification API on mount', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Email verified' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      render(<NewVerificationFormOrganism />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: 'valid-token-123' }),
        });
      });
    });

    it('should show success message after verification', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Email verified' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      render(<NewVerificationFormOrganism />);

      await waitFor(() => {
        expect(screen.getByText('Email verified successfully!')).toBeInTheDocument();
      });
    });

    it('should show redirecting message after success', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Success' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      render(<NewVerificationFormOrganism />);

      await waitFor(() => {
        expect(screen.getByText('Redirecting to login page...')).toBeInTheDocument();
      });
    });
  });

  describe('Token Validation', () => {
    it('should show error when token is missing', async () => {
      mockSearchParams.delete('token');
      render(<NewVerificationFormOrganism />);

      await waitFor(() => {
        expect(screen.getByText('Invalid or missing verification token')).toBeInTheDocument();
      });
    });

    it('should not call API when token is missing', async () => {
      mockSearchParams.delete('token');
      render(<NewVerificationFormOrganism />);

      await waitFor(() => {
        expect(screen.getByText('Invalid or missing verification token')).toBeInTheDocument();
      });

      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should hide loading spinner when token is missing', async () => {
      mockSearchParams.delete('token');
      render(<NewVerificationFormOrganism />);

      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });
    });
  });

  describe('Verification Success', () => {
    it('should redirect to login after successful verification', async () => {
      vi.useFakeTimers();

      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Success' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      render(<NewVerificationFormOrganism />);

      await waitFor(() => {
        expect(screen.getByText('Email verified successfully!')).toBeInTheDocument();
      });

      vi.advanceTimersByTime(3000);

      expect(window.location.href).toBe('/en/auth/login');

      vi.useRealTimers();
    });

    it('should use translation for success message', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({}),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      render(<NewVerificationFormOrganism />);

      await waitFor(() => {
        expect(screen.getByText('Email verified successfully!')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message on verification failure', async () => {
      const mockResponse = {
        ok: false,
        json: () => Promise.resolve({ message: 'Invalid token' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      render(<NewVerificationFormOrganism />);

      await waitFor(() => {
        expect(screen.getByText('Invalid token')).toBeInTheDocument();
      });
    });

    it('should show resend button on error', async () => {
      const mockResponse = {
        ok: false,
        json: () => Promise.resolve({ message: 'Token expired' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      render(<NewVerificationFormOrganism />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Resend Verification Email' })).toBeInTheDocument();
      });
    });

    it('should handle network errors', async () => {
      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      render(<NewVerificationFormOrganism />);

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

      render(<NewVerificationFormOrganism />);

      await waitFor(() => {
        expect(screen.getByText('Email verification failed')).toBeInTheDocument();
      });
    });
  });

  describe('Resend Verification', () => {
    it('should handle resend button click', async () => {
      const mockErrorResponse = {
        ok: false,
        json: () => Promise.resolve({ message: 'Token expired' }),
      };
      (global.fetch as any).mockResolvedValue(mockErrorResponse);

      render(<NewVerificationFormOrganism />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Resend Verification Email' })).toBeInTheDocument();
      });

      const resendButton = screen.getByRole('button', { name: 'Resend Verification Email' });
      await userEvent.click(resendButton);

      await waitFor(() => {
        expect(screen.getByText('Verification email resent! Please check your inbox.')).toBeInTheDocument();
      });
    });

    it('should disable resend button while loading', async () => {
      const mockErrorResponse = {
        ok: false,
        json: () => Promise.resolve({ message: 'Error' }),
      };
      (global.fetch as any).mockResolvedValue(mockErrorResponse);

      render(<NewVerificationFormOrganism />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Resend Verification Email' })).toBeInTheDocument();
      });

      const resendButton = screen.getByRole('button', { name: 'Resend Verification Email' });
      await userEvent.click(resendButton);

      await waitFor(() => {
        expect(resendButton).toBeDisabled();
      });
    });

    it('should clear previous errors when resending', async () => {
      const mockErrorResponse = {
        ok: false,
        json: () => Promise.resolve({ message: 'Token expired' }),
      };
      (global.fetch as any).mockResolvedValue(mockErrorResponse);

      render(<NewVerificationFormOrganism />);

      await waitFor(() => {
        expect(screen.getByText('Token expired')).toBeInTheDocument();
      });

      const resendButton = screen.getByRole('button', { name: 'Resend Verification Email' });
      await userEvent.click(resendButton);

      await waitFor(() => {
        expect(screen.queryByText('Token expired')).not.toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('should show spinner during initial verification', () => {
      render(<NewVerificationFormOrganism />);

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('should hide spinner after verification completes', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Success' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      render(<NewVerificationFormOrganism />);

      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });
    });

    it('should hide spinner after error', async () => {
      const mockResponse = {
        ok: false,
        json: () => Promise.resolve({ message: 'Error' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      render(<NewVerificationFormOrganism />);

      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to wrapper div', () => {
      const ref = vi.fn();
      render(<NewVerificationFormOrganism ref={ref} />);

      expect(ref).toHaveBeenCalled();
    });
  });

  describe('Custom Styling', () => {
    it('should render with custom className during loading', () => {
      const { container } = render(<NewVerificationFormOrganism className="custom-class" />);

      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });

    it('should render with custom className after verification', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Success' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      const { container } = render(<NewVerificationFormOrganism className="custom-class" />);

      await waitFor(() => {
        expect(container.querySelector('.custom-class')).toBeInTheDocument();
      });
    });
  });
});
