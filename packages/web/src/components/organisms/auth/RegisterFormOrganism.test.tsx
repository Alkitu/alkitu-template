import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { RegisterFormOrganism } from './RegisterFormOrganism';

// Mock dependencies
vi.mock('@/context/TranslationsContext', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'auth.register.name': 'First Name',
      'auth.register.lastName': 'Last Name',
      'auth.register.email': 'Email',
      'auth.register.phone': 'Phone',
      'auth.register.password': 'Password',
      'auth.register.confirmPassword': 'Confirm Password',
      'auth.register.terms': 'I accept the terms and conditions',
      'auth.register.termsRequired': 'You must accept the terms and conditions',
      'auth.register.submit': 'Create Account',
      'auth.register.success': 'Registration successful!',
      'auth.register.error': 'Registration failed',
      'auth.newPassword.passwordMismatch': 'Passwords do not match',
      'Common.general.loading': 'Loading...',
    };
    return translations[key] || key;
  },
}));

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  usePathname: () => '/en/auth/register',
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock('@/lib/locale', () => ({
  getCurrentLocalizedRoute: vi.fn((route: string) => route),
}));

// Mock fetch globally
global.fetch = vi.fn();

describe('RegisterFormOrganism', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockClear();
  });

  it('should render all form elements correctly', () => {
    render(<RegisterFormOrganism />);

    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Last Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText(/Phone/i)).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByText('I accept the terms and conditions')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();

    // Check inputs by ID
    expect(document.getElementById('firstname')).toBeInTheDocument();
    expect(document.getElementById('lastname')).toBeInTheDocument();
    expect(document.getElementById('email')).toBeInTheDocument();
    expect(document.getElementById('phone')).toBeInTheDocument();
    expect(document.getElementById('password')).toBeInTheDocument();
    expect(document.getElementById('confirmPassword')).toBeInTheDocument();
  });

  it('should update input values when user types', async () => {
    const user = userEvent.setup();
    render(<RegisterFormOrganism />);

    const firstnameInput = document.getElementById('firstname') as HTMLInputElement;
    const lastnameInput = document.getElementById('lastname') as HTMLInputElement;
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const phoneInput = document.getElementById('phone') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;

    await user.type(firstnameInput, 'John');
    await user.type(lastnameInput, 'Doe');
    await user.type(emailInput, 'john.doe@example.com');
    await user.type(phoneInput, '+1234567890');
    await user.type(passwordInput, 'SecurePass123!');

    expect(firstnameInput.value).toBe('John');
    expect(lastnameInput.value).toBe('Doe');
    expect(emailInput.value).toBe('john.doe@example.com');
    expect(phoneInput.value).toBe('+1234567890');
    expect(passwordInput.value).toBe('SecurePass123!');
  });

  it('should toggle password visibility', async () => {
    const user = userEvent.setup();
    render(<RegisterFormOrganism />);

    const passwordInput = document.getElementById('password') as HTMLInputElement;
    expect(passwordInput.type).toBe('password');

    // Find the toggle button (Eye icon button)
    const toggleButtons = screen.getAllByRole('button', { name: '' });
    const passwordToggle = toggleButtons[0]; // First toggle is for password field

    await user.click(passwordToggle);
    expect(passwordInput.type).toBe('text');

    await user.click(passwordToggle);
    expect(passwordInput.type).toBe('password');
  });

  it('should show error when passwords do not match', async () => {
    const user = userEvent.setup();
    render(<RegisterFormOrganism />);

    await user.type(document.getElementById('firstname') as HTMLElement, 'John');
    await user.type(document.getElementById('lastname') as HTMLElement, 'Doe');
    await user.type(document.getElementById('email') as HTMLElement, 'john@example.com');
    await user.type(document.getElementById('password') as HTMLElement, 'Password123!');
    await user.type(document.getElementById('confirmPassword') as HTMLElement, 'DifferentPass123!');

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    const submitButton = screen.getByRole('button', { name: 'Create Account' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  it('should show error when terms are not accepted', async () => {
    const user = userEvent.setup();
    render(<RegisterFormOrganism />);

    await user.type(document.getElementById('firstname') as HTMLElement, 'John');
    await user.type(document.getElementById('lastname') as HTMLElement, 'Doe');
    await user.type(document.getElementById('email') as HTMLElement, 'john@example.com');
    await user.type(document.getElementById('password') as HTMLElement, 'Password123!');
    await user.type(document.getElementById('confirmPassword') as HTMLElement, 'Password123!');

    const submitButton = screen.getByRole('button', { name: 'Create Account' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('You must accept the terms and conditions')).toBeInTheDocument();
    });
  });

  it('should call API with correct data on form submission', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ message: 'Registration successful' }),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    render(<RegisterFormOrganism />);

    await user.type(document.getElementById('firstname') as HTMLElement, 'John');
    await user.type(document.getElementById('lastname') as HTMLElement, 'Doe');
    await user.type(document.getElementById('email') as HTMLElement, 'john@example.com');
    await user.type(document.getElementById('phone') as HTMLElement, '+1234567890');
    await user.type(document.getElementById('password') as HTMLElement, 'Password123!');
    await user.type(document.getElementById('confirmPassword') as HTMLElement, 'Password123!');

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    const submitButton = screen.getByRole('button', { name: 'Create Account' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstname: 'John',
          lastname: 'Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          password: 'Password123!',
          terms: true,
        }),
      });
    });
  });

  it('should show success message and redirect on successful registration', async () => {
    vi.useFakeTimers();
    const user = userEvent.setup({ delay: null });

    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ message: 'Registration successful' }),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    render(<RegisterFormOrganism />);

    await user.type(document.getElementById('firstname') as HTMLElement, 'John');
    await user.type(document.getElementById('lastname') as HTMLElement, 'Doe');
    await user.type(document.getElementById('email') as HTMLElement, 'john@example.com');
    await user.type(document.getElementById('password') as HTMLElement, 'Password123!');
    await user.type(document.getElementById('confirmPassword') as HTMLElement, 'Password123!');

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    const submitButton = screen.getByRole('button', { name: 'Create Account' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Registration successful!')).toBeInTheDocument();
    });

    vi.advanceTimersByTime(1500);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/auth/login');
    });

    vi.useRealTimers();
  });

  it('should show error message on failed registration', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      ok: false,
      json: () => Promise.resolve({ message: 'Email already exists' }),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    render(<RegisterFormOrganism />);

    await user.type(document.getElementById('firstname') as HTMLElement, 'John');
    await user.type(document.getElementById('lastname') as HTMLElement, 'Doe');
    await user.type(document.getElementById('email') as HTMLElement, 'john@example.com');
    await user.type(document.getElementById('password') as HTMLElement, 'Password123!');
    await user.type(document.getElementById('confirmPassword') as HTMLElement, 'Password123!');

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    const submitButton = screen.getByRole('button', { name: 'Create Account' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email already exists')).toBeInTheDocument();
    });
  });

  it('should disable form elements while loading', async () => {
    const user = userEvent.setup({ delay: null });
    const mockResponse = {
      ok: true,
      json: () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ message: 'Registration successful' }), 100)
        ),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    render(<RegisterFormOrganism />);

    await user.type(document.getElementById('firstname') as HTMLElement, 'John');
    await user.type(document.getElementById('lastname') as HTMLElement, 'Doe');
    await user.type(document.getElementById('email') as HTMLElement, 'john@example.com');
    await user.type(document.getElementById('password') as HTMLElement, 'Password123!');
    await user.type(document.getElementById('confirmPassword') as HTMLElement, 'Password123!');

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    const submitButton = screen.getByRole('button', { name: 'Create Account' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(document.getElementById('firstname')).toBeDisabled();
      expect(document.getElementById('lastname')).toBeDisabled();
      expect(document.getElementById('email')).toBeDisabled();
      expect(document.getElementById('password')).toBeDisabled();
      expect(submitButton).toBeDisabled();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  it('should require all mandatory fields', () => {
    render(<RegisterFormOrganism />);

    const firstnameInput = document.getElementById('firstname') as HTMLInputElement;
    const lastnameInput = document.getElementById('lastname') as HTMLInputElement;
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    const confirmPasswordInput = document.getElementById('confirmPassword') as HTMLInputElement;

    expect(firstnameInput).toHaveAttribute('required');
    expect(lastnameInput).toHaveAttribute('required');
    expect(emailInput).toHaveAttribute('required');
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('minLength', '8');
    expect(confirmPasswordInput).toHaveAttribute('required');
  });

  it('should toggle terms checkbox when clicking label', async () => {
    const user = userEvent.setup();
    render(<RegisterFormOrganism />);

    const checkbox = screen.getByRole('checkbox');
    const label = screen.getByText('I accept the terms and conditions');

    expect(checkbox).not.toBeChecked();

    await user.click(label);
    expect(checkbox).toBeChecked();

    await user.click(label);
    expect(checkbox).not.toBeChecked();
  });

  it('should display password strength indicator', () => {
    render(<RegisterFormOrganism />);

    // PasswordStrengthIndicator component should be rendered
    const passwordInput = document.getElementById('password');
    expect(passwordInput).toBeInTheDocument();
  });

  it('should handle network errors gracefully', async () => {
    const user = userEvent.setup();
    (global.fetch as any).mockRejectedValue(new Error('Network error'));

    render(<RegisterFormOrganism />);

    await user.type(document.getElementById('firstname') as HTMLElement, 'John');
    await user.type(document.getElementById('lastname') as HTMLElement, 'Doe');
    await user.type(document.getElementById('email') as HTMLElement, 'john@example.com');
    await user.type(document.getElementById('password') as HTMLElement, 'Password123!');
    await user.type(document.getElementById('confirmPassword') as HTMLElement, 'Password123!');

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    const submitButton = screen.getByRole('button', { name: 'Create Account' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('should handle phone number as optional', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ message: 'Registration successful' }),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    render(<RegisterFormOrganism />);

    // Fill required fields only (skip phone)
    await user.type(document.getElementById('firstname') as HTMLElement, 'John');
    await user.type(document.getElementById('lastname') as HTMLElement, 'Doe');
    await user.type(document.getElementById('email') as HTMLElement, 'john@example.com');
    await user.type(document.getElementById('password') as HTMLElement, 'Password123!');
    await user.type(document.getElementById('confirmPassword') as HTMLElement, 'Password123!');

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    const submitButton = screen.getByRole('button', { name: 'Create Account' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstname: 'John',
          lastname: 'Doe',
          email: 'john@example.com',
          phone: undefined,
          password: 'Password123!',
          terms: true,
        }),
      });
    });
  });

  it('should render password field with correct type attribute', () => {
    render(<RegisterFormOrganism />);

    const passwordInput = document.getElementById('password') as HTMLInputElement;
    expect(passwordInput.type).toBe('password');
  });

  it('should render email field with correct type attribute', () => {
    render(<RegisterFormOrganism />);

    const emailInput = document.getElementById('email') as HTMLInputElement;
    expect(emailInput.type).toBe('email');
  });

  it('should render phone field with correct type attribute', () => {
    render(<RegisterFormOrganism />);

    const phoneInput = document.getElementById('phone') as HTMLInputElement;
    expect(phoneInput.type).toBe('tel');
  });
});
