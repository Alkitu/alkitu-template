import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ProfileFormEmployeeOrganism } from './ProfileFormEmployeeOrganism';
import type { ProfileFormEmployeeOrganismProps } from './ProfileFormEmployeeOrganism.types';

// Mock fetch globally
global.fetch = vi.fn();

// Mock useTranslations hook
vi.mock('@/context/TranslationsContext', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('ProfileFormEmployeeOrganism', () => {
  const defaultProps: ProfileFormEmployeeOrganismProps = {
    initialData: {
      firstname: 'Jane',
      lastname: 'Smith',
      phone: '+0987654321',
      company: 'Tech Corp',
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
    render(<ProfileFormEmployeeOrganism {...defaultProps} />);

    expect(screen.getByDisplayValue('Jane')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Smith')).toBeInTheDocument();
    expect(screen.getByDisplayValue('+0987654321')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Tech Corp')).toBeInTheDocument();
  });

  it('should render all form fields', () => {
    render(<ProfileFormEmployeeOrganism />);

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/company/i)).toBeInTheDocument();
  });

  it('should not render address field', () => {
    render(<ProfileFormEmployeeOrganism />);

    expect(screen.queryByLabelText(/address/i)).not.toBeInTheDocument();
  });

  it('should not render contact person fields', () => {
    render(<ProfileFormEmployeeOrganism />);

    expect(screen.queryByRole('checkbox', { name: /include contact person/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/contact person details/i)).not.toBeInTheDocument();
  });

  it('should update input values when user types', async () => {
    const user = userEvent.setup();
    render(<ProfileFormEmployeeOrganism />);

    const firstnameInput = screen.getByLabelText(/first name/i) as HTMLInputElement;
    await user.type(firstnameInput, 'Bob');

    expect(firstnameInput.value).toBe('Bob');
  });

  it('should validate required fields on submit', async () => {
    const user = userEvent.setup();
    const onError = vi.fn();

    render(<ProfileFormEmployeeOrganism onError={onError} />);

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

    render(<ProfileFormEmployeeOrganism {...defaultProps} onSuccess={onSuccess} />);

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

    render(<ProfileFormEmployeeOrganism {...defaultProps} onError={onError} />);

    const submitButton = screen.getByRole('button', { name: /save changes/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith('Update failed');
    });
  });

  it('should show loading state during submission', async () => {
    const user = userEvent.setup();

    (global.fetch as any).mockImplementation(() => new Promise(() => {}));

    render(<ProfileFormEmployeeOrganism {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: /save changes/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/saving/i)).toBeInTheDocument();
    });
  });

  it('should disable inputs during submission', async () => {
    const user = userEvent.setup();

    (global.fetch as any).mockImplementation(() => new Promise(() => {}));

    render(<ProfileFormEmployeeOrganism {...defaultProps} />);

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

    render(<ProfileFormEmployeeOrganism {...defaultProps} />);

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

    render(<ProfileFormEmployeeOrganism {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: /save changes/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Server error')).toBeInTheDocument();
    });
  });

  it('should apply custom className', () => {
    const { container } = render(
      <ProfileFormEmployeeOrganism {...defaultProps} className="custom-form" />
    );

    expect(container.querySelector('form')).toHaveClass('custom-form');
  });

  it('should update form when initialData changes', () => {
    const { rerender } = render(<ProfileFormEmployeeOrganism {...defaultProps} />);

    expect(screen.getByDisplayValue('Jane')).toBeInTheDocument();

    const newProps: ProfileFormEmployeeOrganismProps = {
      initialData: {
        firstname: 'Bob',
        lastname: 'Johnson',
      },
    };

    rerender(<ProfileFormEmployeeOrganism {...newProps} />);

    expect(screen.getByDisplayValue('Bob')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Johnson')).toBeInTheDocument();
  });

  it('should forward ref correctly', () => {
    const ref = vi.fn();
    render(<ProfileFormEmployeeOrganism {...defaultProps} ref={ref} />);

    expect(ref).toHaveBeenCalled();
  });

  it('should render basic information section heading', () => {
    render(<ProfileFormEmployeeOrganism />);

    expect(screen.getByText(/basic information/i)).toBeInTheDocument();
  });

  it('should handle network errors gracefully', async () => {
    const user = userEvent.setup();
    const onError = vi.fn();

    (global.fetch as any).mockRejectedValue(new Error('Network error'));

    render(<ProfileFormEmployeeOrganism {...defaultProps} onError={onError} />);

    const submitButton = screen.getByRole('button', { name: /save changes/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith('Network error');
    });
  });

  it('should submit only basic fields without address or contact person', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    render(<ProfileFormEmployeeOrganism {...defaultProps} onSuccess={onSuccess} />);

    const submitButton = screen.getByRole('button', { name: /save changes/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      const callArgs = (global.fetch as any).mock.calls[0];
      const body = JSON.parse(callArgs[1].body);

      expect(body.firstname).toBe('Jane');
      expect(body.lastname).toBe('Smith');
      expect(body).not.toHaveProperty('address');
      expect(body).not.toHaveProperty('contactPerson');
    });
  });

  it('should handle optional phone and company fields', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    const propsWithoutOptional: ProfileFormEmployeeOrganismProps = {
      initialData: {
        firstname: 'Alice',
        lastname: 'Brown',
      },
    };

    render(<ProfileFormEmployeeOrganism {...propsWithoutOptional} onSuccess={onSuccess} />);

    const submitButton = screen.getByRole('button', { name: /save changes/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('should clear success message after 3 seconds', async () => {
    vi.useFakeTimers();
    const user = userEvent.setup({ delay: null });

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    render(<ProfileFormEmployeeOrganism {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: /save changes/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/profile updated successfully/i)).toBeInTheDocument();
    });

    vi.advanceTimersByTime(3000);

    await waitFor(() => {
      expect(screen.queryByText(/profile updated successfully/i)).not.toBeInTheDocument();
    });

    vi.useRealTimers();
  });

  it('should render with empty initial data', () => {
    render(<ProfileFormEmployeeOrganism />);

    const firstnameInput = screen.getByLabelText(/first name/i) as HTMLInputElement;
    const lastnameInput = screen.getByLabelText(/last name/i) as HTMLInputElement;

    expect(firstnameInput.value).toBe('');
    expect(lastnameInput.value).toBe('');
  });

  it('should render submit button', () => {
    render(<ProfileFormEmployeeOrganism />);

    const submitButton = screen.getByRole('button', { name: /save changes/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveClass('min-w-[150px]');
  });
});
