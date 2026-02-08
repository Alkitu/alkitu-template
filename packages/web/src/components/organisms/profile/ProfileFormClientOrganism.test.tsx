import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ProfileFormClientOrganism } from './ProfileFormClientOrganism';
import type { ProfileFormClientOrganismProps } from './ProfileFormClientOrganism.types';

// Mock fetch globally
global.fetch = vi.fn();

// Mock useTranslations hook
vi.mock('@/context/TranslationsContext', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('ProfileFormClientOrganism', () => {
  const defaultProps: ProfileFormClientOrganismProps = {
    initialData: {
      firstname: 'John',
      lastname: 'Doe',
      phone: '+1234567890',
      company: 'Acme Inc',
      address: '123 Main St, City, State',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
    (global.fetch as any).mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render with initial data', () => {
    render(<ProfileFormClientOrganism {...defaultProps} />);

    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('+1234567890')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Acme Inc')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123 Main St, City, State')).toBeInTheDocument();
  });

  it('should render all form fields', () => {
    render(<ProfileFormClientOrganism />);

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/company/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
  });

  it('should render contact person checkbox', () => {
    render(<ProfileFormClientOrganism />);

    expect(screen.getByRole('checkbox', { name: /include contact person/i })).toBeInTheDocument();
  });

  it('should show contact person fields when checkbox checked', async () => {
    const user = userEvent.setup();
    render(<ProfileFormClientOrganism />);

    const checkbox = screen.getByRole('checkbox', { name: /include contact person/i });
    await user.click(checkbox);

    await waitFor(() => {
      expect(screen.getByText(/contact person details/i)).toBeInTheDocument();
    });
  });

  it('should hide contact person fields when checkbox unchecked', async () => {
    const user = userEvent.setup();
    const propsWithContact: ProfileFormClientOrganismProps = {
      initialData: {
        firstname: 'John',
        lastname: 'Doe',
        contactPerson: {
          name: 'Jane',
          lastname: 'Smith',
          phone: '+0987654321',
          email: 'jane@example.com',
        },
      },
    };

    render(<ProfileFormClientOrganism {...propsWithContact} />);

    const checkbox = screen.getByRole('checkbox', { name: /include contact person/i });
    expect(checkbox).toBeChecked();

    await user.click(checkbox);

    await waitFor(() => {
      expect(screen.queryByText(/contact person details/i)).not.toBeInTheDocument();
    });
  });

  it('should update input values when user types', async () => {
    const user = userEvent.setup();
    render(<ProfileFormClientOrganism />);

    const firstnameInput = screen.getByLabelText(/first name/i) as HTMLInputElement;
    await user.type(firstnameInput, 'Alice');

    expect(firstnameInput.value).toBe('Alice');
  });

  it('should validate required fields on submit', async () => {
    const user = userEvent.setup();
    const onError = vi.fn();

    render(<ProfileFormClientOrganism onError={onError} />);

    const submitButton = screen.getByRole('button', { name: /save changes/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
    });
  });

  it('should submit form and call onSuccess', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    render(<ProfileFormClientOrganism {...defaultProps} onSuccess={onSuccess} />);

    const submitButton = screen.getByRole('button', { name: /save changes/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.any(String),
      });
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('should handle API errors and call onError', async () => {
    const user = userEvent.setup();
    const onError = vi.fn();

    (global.fetch as any).mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: 'Update failed' }),
    });

    render(<ProfileFormClientOrganism {...defaultProps} onError={onError} />);

    const submitButton = screen.getByRole('button', { name: /save changes/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith('Update failed');
    });
  });

  it('should show loading state during submission', async () => {
    const user = userEvent.setup();

    (global.fetch as any).mockImplementation(() => new Promise(() => {}));

    render(<ProfileFormClientOrganism {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: /save changes/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/saving/i)).toBeInTheDocument();
    });
  });

  it('should disable inputs during submission', async () => {
    const user = userEvent.setup();

    (global.fetch as any).mockImplementation(() => new Promise(() => {}));

    render(<ProfileFormClientOrganism {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: /save changes/i });
    await user.click(submitButton);

    await waitFor(() => {
      const firstnameInput = screen.getByLabelText(/first name/i);
      expect(firstnameInput).toBeDisabled();
    });
  });

  it('should display success message after successful update', async () => {
    const user = userEvent.setup();

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    render(<ProfileFormClientOrganism {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: /save changes/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/profile updated successfully/i)).toBeInTheDocument();
    });
  });

  it('should display error message after failed update', async () => {
    const user = userEvent.setup();

    (global.fetch as any).mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: 'Server error' }),
    });

    render(<ProfileFormClientOrganism {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: /save changes/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Server error')).toBeInTheDocument();
    });
  });

  it('should submit with contact person data when provided', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    render(<ProfileFormClientOrganism {...defaultProps} onSuccess={onSuccess} />);

    const checkbox = screen.getByRole('checkbox', { name: /include contact person/i });
    await user.click(checkbox);

    await waitFor(() => {
      expect(screen.getByText(/contact person details/i)).toBeInTheDocument();
    });

    const cpName = screen.getByLabelText(/first name/i, { selector: '#cp-name' });
    await user.type(cpName, 'Jane');

    const cpLastname = screen.getByLabelText(/last name/i, { selector: '#cp-lastname' });
    await user.type(cpLastname, 'Smith');

    const cpPhone = screen.getByLabelText(/phone/i, { selector: '#cp-phone' });
    await user.type(cpPhone, '+0987654321');

    const cpEmail = screen.getByLabelText(/email/i);
    await user.type(cpEmail, 'jane@example.com');

    const submitButton = screen.getByRole('button', { name: /save changes/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('should apply custom className', () => {
    const { container } = render(
      <ProfileFormClientOrganism {...defaultProps} className="custom-form" />
    );

    expect(container.querySelector('form')).toHaveClass('custom-form');
  });

  it('should update form when initialData changes', () => {
    const { rerender } = render(<ProfileFormClientOrganism {...defaultProps} />);

    expect(screen.getByDisplayValue('John')).toBeInTheDocument();

    const newProps: ProfileFormClientOrganismProps = {
      initialData: {
        firstname: 'Alice',
        lastname: 'Smith',
      },
    };

    rerender(<ProfileFormClientOrganism {...newProps} />);

    expect(screen.getByDisplayValue('Alice')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Smith')).toBeInTheDocument();
  });

  it('should forward ref correctly', () => {
    const ref = vi.fn();
    render(<ProfileFormClientOrganism {...defaultProps} ref={ref} />);

    expect(ref).toHaveBeenCalled();
  });

  it('should render basic information section heading', () => {
    render(<ProfileFormClientOrganism />);

    expect(screen.getByText(/basic information/i)).toBeInTheDocument();
  });

  it('should render main address section heading', () => {
    render(<ProfileFormClientOrganism />);

    expect(screen.getByText(/main address/i)).toBeInTheDocument();
  });

  it('should handle network errors gracefully', async () => {
    const user = userEvent.setup();
    const onError = vi.fn();

    (global.fetch as any).mockRejectedValue(new Error('Network error'));

    render(<ProfileFormClientOrganism {...defaultProps} onError={onError} />);

    const submitButton = screen.getByRole('button', { name: /save changes/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith('Network error');
    });
  });
});
