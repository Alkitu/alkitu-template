import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { LocationFormOrganism } from './LocationFormOrganism';
import type { LocationFormOrganismProps } from './LocationFormOrganism.types';

// Mock fetch globally
global.fetch = vi.fn();

describe('LocationFormOrganism', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockClear();
  });

  it('should render create mode correctly', () => {
    render(<LocationFormOrganism />);

    expect(screen.getByText('Add New Location')).toBeInTheDocument();
    expect(screen.getByText('Enter the work location details')).toBeInTheDocument();
    expect(screen.getByLabelText(/street address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^city$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^state$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/zip code/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create location/i })).toBeInTheDocument();
  });

  it('should render edit mode correctly', () => {
    const initialData = {
      id: 'loc-1',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
    };

    render(<LocationFormOrganism initialData={initialData} />);

    expect(screen.getByText('Edit Location')).toBeInTheDocument();
    expect(screen.getByText('Update the work location details')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123 Main St')).toBeInTheDocument();
    expect(screen.getByDisplayValue('New York')).toBeInTheDocument();
    expect(screen.getByDisplayValue('10001')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update location/i })).toBeInTheDocument();
  });

  it('should render all form fields', () => {
    render(<LocationFormOrganism />);

    expect(screen.getByLabelText(/street address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/building/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tower/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/floor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/unit \/ suite/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^city$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^state$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/zip code/i)).toBeInTheDocument();
  });

  it('should show cancel button when showCancel is true', () => {
    render(<LocationFormOrganism showCancel={true} />);

    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('should hide cancel button when showCancel is false', () => {
    render(<LocationFormOrganism showCancel={false} />);

    expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
  });

  it('should update input values when user types', async () => {
    const user = userEvent.setup();
    render(<LocationFormOrganism />);

    const streetInput = screen.getByLabelText(/street address/i) as HTMLInputElement;
    const buildingInput = screen.getByLabelText(/building/i) as HTMLInputElement;
    const cityInput = screen.getByLabelText(/^city$/i) as HTMLInputElement;
    const zipInput = screen.getByLabelText(/zip code/i) as HTMLInputElement;

    await user.type(streetInput, '123 Main Street');
    await user.type(buildingInput, 'Empire State Building');
    await user.type(cityInput, 'New York');
    await user.type(zipInput, '10001');

    expect(streetInput.value).toBe('123 Main Street');
    expect(buildingInput.value).toBe('Empire State Building');
    expect(cityInput.value).toBe('New York');
    expect(zipInput.value).toBe('10001');
  });

  it('should populate state dropdown with US state codes', () => {
    render(<LocationFormOrganism />);

    const stateSelect = screen.getByLabelText(/^state$/i);
    const options = stateSelect.querySelectorAll('option');

    // Should have 51 options (1 placeholder + 50 states)
    expect(options.length).toBe(51);
    expect(options[0].textContent).toBe('Select State');
    expect(options[1].value).toBeTruthy();
  });

  it('should submit form with required fields only', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    const mockResponse = {
      ok: true,
      json: () =>
        Promise.resolve({
          id: 'loc-1',
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zip: '10001',
        }),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    render(<LocationFormOrganism onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText(/street address/i), '123 Main St');
    await user.type(screen.getByLabelText(/^city$/i), 'New York');
    await user.selectOptions(screen.getByLabelText(/^state$/i), 'NY');
    await user.type(screen.getByLabelText(/zip code/i), '10001');

    const submitButton = screen.getByRole('button', { name: /create location/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/locations', {
        method: 'POST',
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

  it('should submit form with all fields including optional ones', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ id: 'loc-1' }),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    render(<LocationFormOrganism onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText(/street address/i), '123 Main St');
    await user.type(screen.getByLabelText(/building/i), 'Empire State');
    await user.type(screen.getByLabelText(/tower/i), 'Tower A');
    await user.type(screen.getByLabelText(/floor/i), '5th Floor');
    await user.type(screen.getByLabelText(/unit \/ suite/i), 'Suite 500');
    await user.type(screen.getByLabelText(/^city$/i), 'New York');
    await user.selectOptions(screen.getByLabelText(/^state$/i), 'NY');
    await user.type(screen.getByLabelText(/zip code/i), '10001-1234');

    const submitButton = screen.getByRole('button', { name: /create location/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('should show success message after creation', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ id: 'loc-1' }),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    render(<LocationFormOrganism />);

    await user.type(screen.getByLabelText(/street address/i), '123 Main St');
    await user.type(screen.getByLabelText(/^city$/i), 'New York');
    await user.selectOptions(screen.getByLabelText(/^state$/i), 'NY');
    await user.type(screen.getByLabelText(/zip code/i), '10001');

    const submitButton = screen.getByRole('button', { name: /create location/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Location created successfully!')).toBeInTheDocument();
    });
  });

  it('should show success message after update', async () => {
    const user = userEvent.setup();
    const initialData = {
      id: 'loc-1',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
    };
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ id: 'loc-1' }),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    render(<LocationFormOrganism initialData={initialData} />);

    const submitButton = screen.getByRole('button', { name: /update location/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Location updated successfully!')).toBeInTheDocument();
    });
  });

  it('should show validation error message', async () => {
    const user = userEvent.setup();
    render(<LocationFormOrganism />);

    // Submit without required fields
    const submitButton = screen.getByRole('button', { name: /create location/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please fix the validation errors below')).toBeInTheDocument();
    });
  });

  it('should call onError when submission fails', async () => {
    const user = userEvent.setup();
    const onError = vi.fn();
    const mockResponse = {
      ok: false,
      json: () => Promise.resolve({ error: 'Location already exists' }),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    render(<LocationFormOrganism onError={onError} />);

    await user.type(screen.getByLabelText(/street address/i), '123 Main St');
    await user.type(screen.getByLabelText(/^city$/i), 'New York');
    await user.selectOptions(screen.getByLabelText(/^state$/i), 'NY');
    await user.type(screen.getByLabelText(/zip code/i), '10001');

    const submitButton = screen.getByRole('button', { name: /create location/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith('Location already exists');
    });
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(<LocationFormOrganism onCancel={onCancel} showCancel={true} />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('should disable form fields while loading', async () => {
    const user = userEvent.setup({ delay: null });
    const mockResponse = {
      ok: true,
      json: () =>
        new Promise((resolve) => setTimeout(() => resolve({ id: 'loc-1' }), 100)),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    render(<LocationFormOrganism />);

    await user.type(screen.getByLabelText(/street address/i), '123 Main St');
    await user.type(screen.getByLabelText(/^city$/i), 'New York');
    await user.selectOptions(screen.getByLabelText(/^state$/i), 'NY');
    await user.type(screen.getByLabelText(/zip code/i), '10001');

    const submitButton = screen.getByRole('button', { name: /create location/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/street address/i)).toBeDisabled();
      expect(screen.getByLabelText(/^city$/i)).toBeDisabled();
      expect(submitButton).toBeDisabled();
      expect(screen.getByText(/creating.../i)).toBeInTheDocument();
    });
  });

  it('should reset form after successful creation', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ id: 'loc-1' }),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    render(<LocationFormOrganism />);

    const streetInput = screen.getByLabelText(/street address/i) as HTMLInputElement;
    await user.type(streetInput, '123 Main St');
    await user.type(screen.getByLabelText(/^city$/i), 'New York');
    await user.selectOptions(screen.getByLabelText(/^state$/i), 'NY');
    await user.type(screen.getByLabelText(/zip code/i), '10001');

    const submitButton = screen.getByRole('button', { name: /create location/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(streetInput.value).toBe('');
    });
  });

  it('should clear field errors when user starts typing', async () => {
    const user = userEvent.setup();
    render(<LocationFormOrganism />);

    const submitButton = screen.getByRole('button', { name: /create location/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please fix the validation errors below')).toBeInTheDocument();
    });

    const streetInput = screen.getByLabelText(/street address/i);
    await user.type(streetInput, '123');

    // Field error should be cleared after typing
    await waitFor(() => {
      const streetError = screen.queryByText(/street.*required/i);
      expect(streetError).not.toBeInTheDocument();
    });
  });

  it('should require all mandatory fields', () => {
    render(<LocationFormOrganism />);

    expect(screen.getByLabelText(/street address/i)).toHaveAttribute('required');
    expect(screen.getByLabelText(/^city$/i)).toHaveAttribute('required');
    expect(screen.getByLabelText(/^state$/i)).toHaveAttribute('required');
    expect(screen.getByLabelText(/zip code/i)).toHaveAttribute('required');
  });

  it('should validate ZIP code format', () => {
    render(<LocationFormOrganism />);

    const zipInput = screen.getByLabelText(/zip code/i);
    expect(zipInput).toHaveAttribute('pattern', '^\\d{5}(-\\d{4})?$');
  });

  it('should have correct max lengths for fields', () => {
    render(<LocationFormOrganism />);

    expect(screen.getByLabelText(/street address/i)).toHaveAttribute('maxLength', '200');
    expect(screen.getByLabelText(/building/i)).toHaveAttribute('maxLength', '100');
    expect(screen.getByLabelText(/^city$/i)).toHaveAttribute('maxLength', '100');
  });

  it('should handle network errors gracefully', async () => {
    const user = userEvent.setup();
    (global.fetch as any).mockRejectedValue(new Error('Network error'));

    render(<LocationFormOrganism />);

    await user.type(screen.getByLabelText(/street address/i), '123 Main St');
    await user.type(screen.getByLabelText(/^city$/i), 'New York');
    await user.selectOptions(screen.getByLabelText(/^state$/i), 'NY');
    await user.type(screen.getByLabelText(/zip code/i), '10001');

    const submitButton = screen.getByRole('button', { name: /create location/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument();
    });
  });

  it('should have proper data-testid attribute', () => {
    render(<LocationFormOrganism />);

    expect(screen.getByTestId('location-form')).toBeInTheDocument();
  });

  it('should have proper ARIA attributes for invalid fields', async () => {
    const user = userEvent.setup();
    render(<LocationFormOrganism />);

    const submitButton = screen.getByRole('button', { name: /create location/i });
    await user.click(submitButton);

    await waitFor(() => {
      const streetInput = screen.getByLabelText(/street address/i);
      expect(streetInput).toHaveAttribute('aria-invalid', 'true');
      expect(streetInput).toHaveAttribute('aria-describedby', 'street-error');
    });
  });

  it('should update form data when initialData changes', async () => {
    const initialData1 = {
      id: 'loc-1',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
    };

    const { rerender } = render(<LocationFormOrganism initialData={initialData1} />);

    expect(screen.getByDisplayValue('123 Main St')).toBeInTheDocument();

    const initialData2 = {
      id: 'loc-2',
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90001',
    };

    rerender(<LocationFormOrganism initialData={initialData2} />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('456 Oak Ave')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Los Angeles')).toBeInTheDocument();
    });
  });
});
