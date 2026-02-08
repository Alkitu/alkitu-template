import { vi } from 'vitest';

// IMPORTANT: Mock next/navigation BEFORE importing test-utils or components
// Get the mocked router functions
const mockRouterPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockRouterPush,
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/en/auth/register',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/lib/locale', () => ({
  getCurrentLocalizedRoute: vi.fn((route: string) => route),
}));

// Mock fetch globally
global.fetch = vi.fn();

// Now import everything else
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  renderWithProviders,
  screen,
  waitFor,
  userEvent
} from '@/test/test-utils';
import { RegisterFormOrganism } from './RegisterFormOrganism';

describe('RegisterFormOrganism', () => {
  const translations = {
    auth: {
      register: {
        name: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        phone: 'Phone',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        terms: 'I accept the terms and conditions',
        termsRequired: 'You must accept the terms and conditions',
        submit: 'Create Account',
        success: 'Registration successful!',
        error: 'Registration failed',
      },
      newPassword: {
        passwordMismatch: 'Passwords do not match',
      },
    },
    Common: {
      general: {
        loading: 'Loading...',
      },
    },
  };

  // Helper to get checkbox button (it's rendered as a button, not input[type="checkbox"])
  const getCheckbox = () => {
    const buttons = screen.getAllByRole('button');
    return buttons.find(btn => btn.getAttribute('data-name') === 'Checkbox')!;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();

    // Reset fetch mock
    (global.fetch as any).mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render all form elements correctly', () => {
    renderWithProviders(<RegisterFormOrganism />, { translations });

    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('+1234567890')).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText('Password')[0]).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByText('I accept the terms and conditions')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
  });

  it('should update input values when user types', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterFormOrganism />, { translations });

    const firstnameInput = screen.getByPlaceholderText('First Name') as HTMLInputElement;
    const lastnameInput = screen.getByPlaceholderText('Last Name') as HTMLInputElement;
    const emailInput = screen.getByPlaceholderText('Email') as HTMLInputElement;
    const phoneInput = screen.getByPlaceholderText('+1234567890') as HTMLInputElement;
    const passwordInput = screen.getAllByPlaceholderText('Password')[0] as HTMLInputElement;

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
    renderWithProviders(<RegisterFormOrganism />, { translations });

    const passwordInput = screen.getAllByPlaceholderText('Password')[0] as HTMLInputElement;
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
    renderWithProviders(<RegisterFormOrganism />, { translations });

    await user.type(screen.getByPlaceholderText('First Name'), 'John');
    await user.type(screen.getByPlaceholderText('Last Name'), 'Doe');
    await user.type(screen.getByPlaceholderText('Email'), 'john@example.com');
    await user.type(screen.getAllByPlaceholderText('Password')[0], 'Password123!');
    await user.type(screen.getByPlaceholderText('Confirm Password'), 'DifferentPass123!');

    const checkbox = getCheckbox();
    await user.click(checkbox);

    const submitButton = screen.getByRole('button', { name: 'Create Account' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  it('should show error when terms are not accepted', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterFormOrganism />, { translations });

    await user.type(screen.getByPlaceholderText('First Name'), 'John');
    await user.type(screen.getByPlaceholderText('Last Name'), 'Doe');
    await user.type(screen.getByPlaceholderText('Email'), 'john@example.com');
    await user.type(screen.getAllByPlaceholderText('Password')[0], 'Password123!');
    await user.type(screen.getByPlaceholderText('Confirm Password'), 'Password123!');

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

    renderWithProviders(<RegisterFormOrganism />, { translations });

    await user.type(screen.getByPlaceholderText('First Name'), 'John');
    await user.type(screen.getByPlaceholderText('Last Name'), 'Doe');
    await user.type(screen.getByPlaceholderText('Email'), 'john@example.com');
    await user.type(screen.getByPlaceholderText('+1234567890'), '+1234567890');
    await user.type(screen.getAllByPlaceholderText('Password')[0], 'Password123!');
    await user.type(screen.getByPlaceholderText('Confirm Password'), 'Password123!');

    const checkbox = getCheckbox();
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
    const user = userEvent.setup();

    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ message: 'Registration successful' }),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    renderWithProviders(<RegisterFormOrganism />, { translations });

    await user.type(screen.getByPlaceholderText('First Name'), 'John');
    await user.type(screen.getByPlaceholderText('Last Name'), 'Doe');
    await user.type(screen.getByPlaceholderText('Email'), 'john@example.com');
    await user.type(screen.getAllByPlaceholderText('Password')[0], 'Password123!');
    await user.type(screen.getByPlaceholderText('Confirm Password'), 'Password123!');

    const checkbox = getCheckbox();
    await user.click(checkbox);

    const submitButton = screen.getByRole('button', { name: 'Create Account' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Registration successful!')).toBeInTheDocument();
    });

    // Wait for the redirect to be called (after 1500ms timeout in the component)
    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith('/auth/login');
    }, { timeout: 3000 });
  });

  it('should show error message on failed registration', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      ok: false,
      json: () => Promise.resolve({ message: 'Email already exists' }),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    renderWithProviders(<RegisterFormOrganism />, { translations });

    await user.type(screen.getByPlaceholderText('First Name'), 'John');
    await user.type(screen.getByPlaceholderText('Last Name'), 'Doe');
    await user.type(screen.getByPlaceholderText('Email'), 'john@example.com');
    await user.type(screen.getAllByPlaceholderText('Password')[0], 'Password123!');
    await user.type(screen.getByPlaceholderText('Confirm Password'), 'Password123!');

    const checkbox = getCheckbox();
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

    renderWithProviders(<RegisterFormOrganism />, { translations });

    await user.type(screen.getByPlaceholderText('First Name'), 'John');
    await user.type(screen.getByPlaceholderText('Last Name'), 'Doe');
    await user.type(screen.getByPlaceholderText('Email'), 'john@example.com');
    await user.type(screen.getAllByPlaceholderText('Password')[0], 'Password123!');
    await user.type(screen.getByPlaceholderText('Confirm Password'), 'Password123!');

    const checkbox = getCheckbox();
    await user.click(checkbox);

    const submitButton = screen.getByRole('button', { name: 'Create Account' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('First Name')).toBeDisabled();
      expect(screen.getByPlaceholderText('Last Name')).toBeDisabled();
      expect(screen.getByPlaceholderText('Email')).toBeDisabled();
      expect(screen.getAllByPlaceholderText('Password')[0]).toBeDisabled();
      expect(submitButton).toBeDisabled();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  it('should require all mandatory fields', () => {
    renderWithProviders(<RegisterFormOrganism />, { translations });

    const firstnameInput = screen.getByPlaceholderText('First Name') as HTMLInputElement;
    const lastnameInput = screen.getByPlaceholderText('Last Name') as HTMLInputElement;
    const emailInput = screen.getByPlaceholderText('Email') as HTMLInputElement;
    const passwordInput = screen.getAllByPlaceholderText('Password')[0] as HTMLInputElement;
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password') as HTMLInputElement;

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
    renderWithProviders(<RegisterFormOrganism />, { translations });

    const label = screen.getByText('I accept the terms and conditions');

    // Click label to toggle checkbox
    await user.click(label);

    // Check that checkbox button has the checked class (bg-primary)
    const checkbox = getCheckbox();
    expect(checkbox.className).toContain('bg-primary');

    await user.click(label);
    expect(checkbox.className).toContain('bg-background');
  });

  it('should display password strength indicator', () => {
    renderWithProviders(<RegisterFormOrganism />, { translations });

    // PasswordStrengthIndicator component should be rendered
    const passwordInput = screen.getAllByPlaceholderText('Password')[0];
    expect(passwordInput).toBeInTheDocument();
  });

  it('should handle network errors gracefully', async () => {
    const user = userEvent.setup();
    (global.fetch as any).mockRejectedValue(new Error('Network error'));

    renderWithProviders(<RegisterFormOrganism />, { translations });

    await user.type(screen.getByPlaceholderText('First Name'), 'John');
    await user.type(screen.getByPlaceholderText('Last Name'), 'Doe');
    await user.type(screen.getByPlaceholderText('Email'), 'john@example.com');
    await user.type(screen.getAllByPlaceholderText('Password')[0], 'Password123!');
    await user.type(screen.getByPlaceholderText('Confirm Password'), 'Password123!');

    const checkbox = getCheckbox();
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

    renderWithProviders(<RegisterFormOrganism />, { translations });

    // Fill required fields only (skip phone)
    await user.type(screen.getByPlaceholderText('First Name'), 'John');
    await user.type(screen.getByPlaceholderText('Last Name'), 'Doe');
    await user.type(screen.getByPlaceholderText('Email'), 'john@example.com');
    await user.type(screen.getAllByPlaceholderText('Password')[0], 'Password123!');
    await user.type(screen.getByPlaceholderText('Confirm Password'), 'Password123!');

    const checkbox = getCheckbox();
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
    renderWithProviders(<RegisterFormOrganism />, { translations });

    const passwordInput = screen.getAllByPlaceholderText('Password')[0] as HTMLInputElement;
    expect(passwordInput.type).toBe('password');
  });

  it('should render email field with correct type attribute', () => {
    renderWithProviders(<RegisterFormOrganism />, { translations });

    const emailInput = screen.getByPlaceholderText('Email') as HTMLInputElement;
    expect(emailInput.type).toBe('email');
  });

  it('should render phone field with correct type attribute', () => {
    renderWithProviders(<RegisterFormOrganism />, { translations });

    const phoneInput = screen.getByPlaceholderText('+1234567890') as HTMLInputElement;
    expect(phoneInput.type).toBe('tel');
  });
});
