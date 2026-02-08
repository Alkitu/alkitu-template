import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  renderWithProviders,
  screen,
  waitFor,
  userEvent,
  mockNextRouter
} from '@/test/test-utils';
import { LoginFormOrganism } from './LoginFormOrganism';

// Mock the dependencies
const mockRedirectAfterLogin = vi.fn();

vi.mock('@/hooks/useAuthRedirect', () => ({
  useAuthRedirect: () => ({
    redirectAfterLogin: mockRedirectAfterLogin,
  }),
}));

// Mock fetch globally
global.fetch = vi.fn();

describe('LoginFormOrganism', () => {
  const translations = {
    auth: {
      login: {
        email: 'Email',
        password: 'Password',
        submit: 'Sign in',
        success: 'Login successful!',
        error: 'Login failed',
      },
    },
    Common: {
      general: {
        loading: 'Loading...',
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();

    // Mock Next.js router
    mockNextRouter({
      push: vi.fn(),
      pathname: '/en/auth/login',
    });

    // Reset fetch mock
    (global.fetch as any).mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render all form elements correctly', () => {
    renderWithProviders(<LoginFormOrganism />, { translations });

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('should update input values when user types', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginFormOrganism />, { translations });

    const emailInput = screen.getByPlaceholderText('Email') as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('should call the Next.js API route on form submission', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      ok: true,
      json: () =>
        Promise.resolve({
          message: 'Login successful',
          user: { id: '1', email: 'test@example.com', name: 'Test User' },
        }),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    renderWithProviders(<LoginFormOrganism />, { translations });

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

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
    const user = userEvent.setup();
    const mockResponse = {
      ok: true,
      json: () =>
        Promise.resolve({
          message: 'Login successful',
          user: { id: '1', email: 'test@example.com', name: 'Test User' },
        }),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    renderWithProviders(<LoginFormOrganism />, { translations });

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    // Wait for async fetch to complete
    await waitFor(() => {
      expect(screen.getByText('Login successful!')).toBeInTheDocument();
    });

    expect(mockRedirectAfterLogin).toHaveBeenCalled();
  });

  it('should show error message on failed login', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      ok: false,
      json: () =>
        Promise.resolve({
          message: 'Invalid credentials',
        }),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    renderWithProviders(<LoginFormOrganism />, { translations });

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    expect(mockRedirectAfterLogin).not.toHaveBeenCalled();
  });

  it('should handle network errors gracefully', async () => {
    const user = userEvent.setup();
    (global.fetch as any).mockRejectedValue(new Error('Network error'));

    renderWithProviders(<LoginFormOrganism />, { translations });

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('should disable form elements while loading', async () => {
    const user = userEvent.setup();
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

    renderWithProviders(<LoginFormOrganism />, { translations });

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

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
    renderWithProviders(<LoginFormOrganism />, { translations });

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');

    expect(emailInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('required');
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should clear localStorage on successful login', async () => {
    const user = userEvent.setup();
    // Spy on the actual localStorage object instead of Storage.prototype
    const mockRemoveItem = vi.spyOn(window.localStorage, 'removeItem');

    const mockResponse = {
      ok: true,
      json: () =>
        Promise.resolve({
          message: 'Login successful',
          user: { id: '1', email: 'test@example.com' },
        }),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    renderWithProviders(<LoginFormOrganism />, { translations });

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockRemoveItem).toHaveBeenCalledWith('user');
    });

    mockRemoveItem.mockRestore();
  });
});
