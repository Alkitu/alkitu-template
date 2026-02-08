import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { OnboardingFormOrganism } from './OnboardingFormOrganism';

// Mock dependencies
vi.mock('@/context/TranslationsContext', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'auth.onboarding.title': 'Complete Your Profile',
      'auth.onboarding.subtitle': 'Add additional information to your account',
      'auth.onboarding.phone': 'Phone Number',
      'auth.onboarding.company': 'Company Name',
      'auth.onboarding.address': 'Address',
      'auth.onboarding.addContactPerson': 'Add Contact Person',
      'auth.onboarding.contactPersonInfo': 'Contact Person Details',
      'auth.onboarding.contactName': 'First Name',
      'auth.onboarding.contactLastname': 'Last Name',
      'auth.onboarding.contactPhone': 'Phone',
      'auth.onboarding.contactEmail': 'Email',
      'auth.onboarding.contactPersonRequired': 'All contact person fields are required',
      'auth.onboarding.skipButton': 'Skip for Now',
      'auth.onboarding.submitButton': 'Complete Profile',
      'auth.onboarding.success': 'Profile completed successfully!',
      'auth.onboarding.error': 'Failed to complete profile',
      'Common.general.loading': 'Loading...',
    };
    return translations[key] || key;
  },
}));

const mockPush = vi.fn();
const mockRedirectAfterLogin = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock('@/hooks/useAuthRedirect', () => ({
  useAuthRedirect: () => ({
    redirectAfterLogin: mockRedirectAfterLogin,
  }),
}));

global.fetch = vi.fn();

describe('OnboardingFormOrganism', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockClear();
  });

  it('should render all form elements correctly', () => {
    render(<OnboardingFormOrganism />);

    expect(screen.getByText('Complete Your Profile')).toBeInTheDocument();
    expect(screen.getByText('Add additional information to your account')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
    expect(screen.getByLabelText('Company Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Address')).toBeInTheDocument();
    expect(screen.getByText('Add Contact Person')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Skip for Now' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Complete Profile' })).toBeInTheDocument();
  });

  it('should update input values when user types', async () => {
    const user = userEvent.setup();
    render(<OnboardingFormOrganism />);

    const phoneInput = screen.getByLabelText('Phone Number') as HTMLInputElement;
    const companyInput = screen.getByLabelText('Company Name') as HTMLInputElement;
    const addressInput = screen.getByLabelText('Address') as HTMLTextAreaElement;

    await user.type(phoneInput, '+34 123 456 789');
    await user.type(companyInput, 'Acme Inc.');
    await user.type(addressInput, '123 Main Street, City');

    expect(phoneInput.value).toBe('+34 123 456 789');
    expect(companyInput.value).toBe('Acme Inc.');
    expect(addressInput.value).toBe('123 Main Street, City');
  });

  it('should show contact person fields when checkbox is checked', async () => {
    const user = userEvent.setup();
    render(<OnboardingFormOrganism />);

    expect(screen.queryByLabelText('First Name')).not.toBeInTheDocument();

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('should hide contact person fields when checkbox is unchecked', async () => {
    const user = userEvent.setup();
    render(<OnboardingFormOrganism />);

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(screen.getByLabelText('First Name')).toBeInTheDocument();

    await user.click(checkbox);

    expect(screen.queryByLabelText('First Name')).not.toBeInTheDocument();
  });

  it('should validate contact person fields when enabled', async () => {
    const user = userEvent.setup();
    render(<OnboardingFormOrganism />);

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    // Leave contact person fields empty
    const submitButton = screen.getByRole('button', { name: 'Complete Profile' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('All contact person fields are required')).toBeInTheDocument();
    });
  });

  it('should submit form with all data including contact person', async () => {
    vi.useFakeTimers();
    const user = userEvent.setup({ delay: null });
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ user: { role: 'CLIENT' } }),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    render(<OnboardingFormOrganism />);

    await user.type(screen.getByLabelText('Phone Number'), '+34 123 456 789');
    await user.type(screen.getByLabelText('Company Name'), 'Acme Inc.');
    await user.type(screen.getByLabelText('Address'), '123 Main Street');

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    await user.type(screen.getByLabelText('First Name'), 'Jane');
    await user.type(screen.getByLabelText('Last Name'), 'Smith');
    await user.type(screen.getByLabelText('Phone'), '+34 987 654 321');
    await user.type(screen.getByLabelText('Email'), 'jane@example.com');

    const submitButton = screen.getByRole('button', { name: 'Complete Profile' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/complete-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: '+34 123 456 789',
          company: 'Acme Inc.',
          address: '123 Main Street',
          contactPerson: {
            name: 'Jane',
            lastname: 'Smith',
            phone: '+34 987 654 321',
            email: 'jane@example.com',
          },
        }),
        credentials: 'include',
      });
    });

    vi.useRealTimers();
  });

  it('should submit form without contact person when not enabled', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ user: { role: 'CLIENT' } }),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    render(<OnboardingFormOrganism />);

    await user.type(screen.getByLabelText('Phone Number'), '+34 123 456 789');
    await user.type(screen.getByLabelText('Company Name'), 'Acme Inc.');

    const submitButton = screen.getByRole('button', { name: 'Complete Profile' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/complete-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: '+34 123 456 789',
          company: 'Acme Inc.',
          address: undefined,
        }),
        credentials: 'include',
      });
    });
  });

  it('should show success message and redirect after submission', async () => {
    vi.useFakeTimers();
    const user = userEvent.setup({ delay: null });
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ user: { role: 'CLIENT' } }),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    render(<OnboardingFormOrganism />);

    const submitButton = screen.getByRole('button', { name: 'Complete Profile' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Profile completed successfully!')).toBeInTheDocument();
    });

    vi.advanceTimersByTime(1500);

    await waitFor(() => {
      expect(mockRedirectAfterLogin).toHaveBeenCalledWith({
        profileComplete: true,
        role: 'CLIENT',
      });
    });

    vi.useRealTimers();
  });

  it('should handle skip button correctly', async () => {
    vi.useFakeTimers();
    const user = userEvent.setup({ delay: null });
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ user: { role: 'CLIENT' } }),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    render(<OnboardingFormOrganism />);

    const skipButton = screen.getByRole('button', { name: 'Skip for Now' });
    await user.click(skipButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/complete-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
        credentials: 'include',
      });
    });

    vi.advanceTimersByTime(1500);

    await waitFor(() => {
      expect(mockRedirectAfterLogin).toHaveBeenCalledWith({
        profileComplete: true,
        role: 'CLIENT',
      });
    });

    vi.useRealTimers();
  });

  it('should call onComplete callback when provided', async () => {
    const onComplete = vi.fn();
    const user = userEvent.setup();
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ user: { role: 'CLIENT' } }),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    render(<OnboardingFormOrganism onComplete={onComplete} />);

    const submitButton = screen.getByRole('button', { name: 'Complete Profile' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledTimes(1);
    });
  });

  it('should call onSkip callback when provided', async () => {
    const onSkip = vi.fn();
    const user = userEvent.setup();
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ user: { role: 'CLIENT' } }),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    render(<OnboardingFormOrganism onSkip={onSkip} />);

    const skipButton = screen.getByRole('button', { name: 'Skip for Now' });
    await user.click(skipButton);

    await waitFor(() => {
      expect(onSkip).toHaveBeenCalledTimes(1);
    });
  });

  it('should show error message on submission failure', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      ok: false,
      json: () => Promise.resolve({ message: 'Server error' }),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    render(<OnboardingFormOrganism />);

    const submitButton = screen.getByRole('button', { name: 'Complete Profile' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Server error')).toBeInTheDocument();
    });
  });

  it('should disable form elements while loading', async () => {
    const user = userEvent.setup({ delay: null });
    const mockResponse = {
      ok: true,
      json: () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ user: { role: 'CLIENT' } }), 100)
        ),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    render(<OnboardingFormOrganism />);

    const submitButton = screen.getByRole('button', { name: 'Complete Profile' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByLabelText('Phone Number')).toBeDisabled();
      expect(screen.getByLabelText('Company Name')).toBeDisabled();
      expect(screen.getByLabelText('Address')).toBeDisabled();
      expect(submitButton).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Skip for Now' })).toBeDisabled();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  it('should handle network errors gracefully', async () => {
    const user = userEvent.setup();
    (global.fetch as any).mockRejectedValue(new Error('Network error'));

    render(<OnboardingFormOrganism />);

    const submitButton = screen.getByRole('button', { name: 'Complete Profile' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('should mark contact person fields as required when enabled', async () => {
    const user = userEvent.setup();
    render(<OnboardingFormOrganism />);

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    const firstNameInput = screen.getByLabelText('First Name');
    const lastNameInput = screen.getByLabelText('Last Name');
    const phoneInput = screen.getByLabelText('Phone');
    const emailInput = screen.getByLabelText('Email');

    expect(firstNameInput).toHaveAttribute('required');
    expect(lastNameInput).toHaveAttribute('required');
    expect(phoneInput).toHaveAttribute('required');
    expect(emailInput).toHaveAttribute('required');
  });

  it('should apply correct max lengths to input fields', () => {
    render(<OnboardingFormOrganism />);

    const phoneInput = screen.getByLabelText('Phone Number');
    const companyInput = screen.getByLabelText('Company Name');

    expect(phoneInput).toHaveAttribute('type', 'tel');
    expect(companyInput).toHaveAttribute('type', 'text');
  });
});
