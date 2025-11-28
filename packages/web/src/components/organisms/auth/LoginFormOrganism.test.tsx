import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginFormOrganism } from './LoginFormOrganism';

// Mock the dependencies
vi.mock('@/context/TranslationsContext', () => ({
  useTranslations: () => (key: string, options?: any, namespace?: string) => {
    const translations: Record<string, string> = {
      'auth.login.email': 'Email',
      'auth.login.password': 'Password',
      'auth.login.submit': 'Sign in',
      'auth.login.success': 'Login successful!',
      'auth.login.error': 'Login failed',
      'Common.general.loading': 'Loading...',
    };
    return translations[key] || key;
  },
}));

const mockRedirectAfterLogin = vi.fn();

vi.mock('@/hooks/useAuthRedirect', () => ({
  useAuthRedirect: () => ({
    redirectAfterLogin: mockRedirectAfterLogin,
  }),
}));

// Mock fetch globally
global.fetch = vi.fn();

describe('LoginFormOrganism', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Reset fetch mock
    (global.fetch as any).mockClear();
  });

  it('should render all form elements correctly', () => {
    render(<LoginFormOrganism />);

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('should update input values when user types', async () => {
    render(<LoginFormOrganism />);

    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('should call the Next.js API route on form submission', async () => {
    const mockResponse = {
      ok: true,
      json: () =>
        Promise.resolve({
          message: 'Login successful',
          user: { id: '1', email: 'test@example.com', name: 'Test User' },
        }),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    render(<LoginFormOrganism />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      });
    });
  });

  it('should show success message and redirect on successful login', async () => {
    // Use fake timers for this test to control setTimeout
    vi.useFakeTimers();

    const mockResponse = {
      ok: true,
      json: () =>
        Promise.resolve({
          message: 'Login successful',
          user: { id: '1', email: 'test@example.com', name: 'Test User' },
        }),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    render(<LoginFormOrganism />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    // Wait for async fetch to complete
    await vi.waitFor(() => {
      expect(screen.getByText('Login successful!')).toBeInTheDocument();
    });

    // Advance timers by 100ms to trigger the setTimeout in component
    vi.advanceTimersByTime(100);

    expect(mockRedirectAfterLogin).toHaveBeenCalled();

    // Restore real timers
    vi.useRealTimers();
  });

  it('should show error message on failed login', async () => {
    const mockResponse = {
      ok: false,
      json: () =>
        Promise.resolve({
          message: 'Invalid credentials',
        }),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    render(<LoginFormOrganism />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    // Wait for any pending timers from previous tests to complete (100ms + buffer)
    await new Promise(resolve => setTimeout(resolve, 150));

    // Clear the mock after previous tests' timers have executed
    mockRedirectAfterLogin.mockClear();

    // Small wait to ensure no new calls happen during error state
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(mockRedirectAfterLogin).not.toHaveBeenCalled();
  });

  it('should handle network errors gracefully', async () => {
    (global.fetch as any).mockRejectedValue(new Error('Network error'));

    render(<LoginFormOrganism />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('should disable form elements while loading', async () => {
    const mockResponse = {
      ok: true,
      json: () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                message: 'Login successful',
                user: { id: '1', email: 'test@example.com' },
              }),
            100,
          ),
        ),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    render(<LoginFormOrganism />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    // Elements should be disabled during loading
    await waitFor(() => {
      expect(emailInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();
      expect(submitButton).toBeDisabled();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    // Wait for completion
    await waitFor(() => {
      expect(screen.getByText('Login successful!')).toBeInTheDocument();
    });
  });

  it('should require both email and password fields', () => {
    render(<LoginFormOrganism />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    expect(emailInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('required');
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should clear localStorage on successful login', async () => {
    const mockRemoveItem = vi.spyOn(Storage.prototype, 'removeItem');

    const mockResponse = {
      ok: true,
      json: () =>
        Promise.resolve({
          message: 'Login successful',
          user: { id: '1', email: 'test@example.com' },
        }),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    render(<LoginFormOrganism />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRemoveItem).toHaveBeenCalledWith('user');
    });

    mockRemoveItem.mockRestore();
  });
});
