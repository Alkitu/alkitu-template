import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { RequestFormOrganism } from './RequestFormOrganism';
import type { RequestFormOrganismProps } from './RequestFormOrganism.types';

// Mock fetch globally
global.fetch = vi.fn();

const mockServices = [
  {
    id: 'service-1',
    name: 'Plumbing Repair',
    requestTemplate: {
      fields: [
        {
          id: 'description',
          label: 'Issue Description',
          type: 'textarea',
          required: true,
          placeholder: 'Describe the issue',
        },
        {
          id: 'urgency',
          label: 'Urgency Level',
          type: 'select',
          required: true,
          options: [
            { value: 'low', label: 'Low' },
            { value: 'high', label: 'High' },
          ],
        },
      ],
    },
  },
  {
    id: 'service-2',
    name: 'Electrical Work',
  },
];

const mockLocations = [
  {
    id: 'loc-1',
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
  },
  {
    id: 'loc-2',
    street: '456 Oak Ave',
    city: 'Los Angeles',
    state: 'CA',
  },
];

describe('RequestFormOrganism', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockClear();

    // Default mock for fetching services and locations
    (global.fetch as any).mockImplementation((url: string) => {
      if (url === '/api/services') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockServices),
        });
      }
      if (url === '/api/locations') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockLocations),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });
  });

  it('should render form with all fields', async () => {
    render(<RequestFormOrganism />);

    await waitFor(() => {
      expect(screen.getByLabelText(/service/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/execution date & time/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create request/i })).toBeInTheDocument();
    });
  });

  it('should show loading state while fetching data', () => {
    render(<RequestFormOrganism />);

    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument(); // Loader2 icon
  });

  it('should populate service and location dropdowns', async () => {
    render(<RequestFormOrganism />);

    await waitFor(() => {
      const serviceSelect = screen.getByLabelText(/service/i);
      expect(serviceSelect).toBeInTheDocument();
    });

    const serviceOptions = screen.getAllByRole('option');
    expect(serviceOptions.some(opt => opt.textContent === 'Plumbing Repair')).toBe(true);
    expect(serviceOptions.some(opt => opt.textContent === 'Electrical Work')).toBe(true);
  });

  it('should show dynamic template fields when service is selected', async () => {
    const user = userEvent.setup();
    render(<RequestFormOrganism />);

    await waitFor(() => {
      expect(screen.getByLabelText(/service/i)).toBeInTheDocument();
    });

    const serviceSelect = screen.getByLabelText(/service/i);
    await user.selectOptions(serviceSelect, 'service-1');

    await waitFor(() => {
      expect(screen.getByText('Service Details')).toBeInTheDocument();
      expect(screen.getByLabelText(/issue description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/urgency level/i)).toBeInTheDocument();
    });
  });

  it('should reset template responses when service changes', async () => {
    const user = userEvent.setup();
    render(<RequestFormOrganism />);

    await waitFor(() => {
      expect(screen.getByLabelText(/service/i)).toBeInTheDocument();
    });

    const serviceSelect = screen.getByLabelText(/service/i);
    await user.selectOptions(serviceSelect, 'service-1');

    await waitFor(() => {
      expect(screen.getByLabelText(/issue description/i)).toBeInTheDocument();
    });

    const descriptionField = screen.getByLabelText(/issue description/i) as HTMLTextAreaElement;
    await user.type(descriptionField, 'Leaking pipe');

    await user.selectOptions(serviceSelect, 'service-2');

    // Template fields should be reset
    expect(screen.queryByLabelText(/issue description/i)).not.toBeInTheDocument();
  });

  it('should validate required template fields', async () => {
    const user = userEvent.setup();
    render(<RequestFormOrganism />);

    await waitFor(() => {
      expect(screen.getByLabelText(/service/i)).toBeInTheDocument();
    });

    const serviceSelect = screen.getByLabelText(/service/i);
    await user.selectOptions(serviceSelect, 'service-1');

    const locationSelect = screen.getByLabelText(/location/i);
    await user.selectOptions(locationSelect, 'loc-1');

    const dateTimeInput = screen.getByLabelText(/execution date & time/i);
    await user.type(dateTimeInput, '2024-12-31T10:00');

    // Leave required template fields empty
    const submitButton = screen.getByRole('button', { name: /create request/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/issue description is required/i)).toBeInTheDocument();
      expect(screen.getByText(/urgency level is required/i)).toBeInTheDocument();
    });
  });

  it('should submit form with all data', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();

    (global.fetch as any).mockImplementation((url: string, options?: any) => {
      if (url === '/api/requests' && options?.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: 'req-1', title: 'New Request' }),
        });
      }
      if (url === '/api/services') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockServices),
        });
      }
      if (url === '/api/locations') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockLocations),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });

    render(<RequestFormOrganism onSuccess={onSuccess} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/service/i)).toBeInTheDocument();
    });

    const serviceSelect = screen.getByLabelText(/service/i);
    await user.selectOptions(serviceSelect, 'service-1');

    await waitFor(() => {
      expect(screen.getByLabelText(/issue description/i)).toBeInTheDocument();
    });

    const locationSelect = screen.getByLabelText(/location/i);
    await user.selectOptions(locationSelect, 'loc-1');

    const dateTimeInput = screen.getByLabelText(/execution date & time/i);
    await user.type(dateTimeInput, '2024-12-31T10:00');

    const descriptionField = screen.getByLabelText(/issue description/i);
    await user.type(descriptionField, 'Leaking pipe under sink');

    const urgencySelect = screen.getByLabelText(/urgency level/i);
    await user.selectOptions(urgencySelect, 'high');

    const submitButton = screen.getByRole('button', { name: /create request/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith({ id: 'req-1', title: 'New Request' });
    });
  });

  it('should show error message on submission failure', async () => {
    const user = userEvent.setup();

    (global.fetch as any).mockImplementation((url: string, options?: any) => {
      if (url === '/api/requests' && options?.method === 'POST') {
        return Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ message: 'Service unavailable' }),
        });
      }
      if (url === '/api/services') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockServices),
        });
      }
      if (url === '/api/locations') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockLocations),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });

    render(<RequestFormOrganism />);

    await waitFor(() => {
      expect(screen.getByLabelText(/service/i)).toBeInTheDocument();
    });

    const serviceSelect = screen.getByLabelText(/service/i);
    await user.selectOptions(serviceSelect, 'service-2');

    const locationSelect = screen.getByLabelText(/location/i);
    await user.selectOptions(locationSelect, 'loc-1');

    const dateTimeInput = screen.getByLabelText(/execution date & time/i);
    await user.type(dateTimeInput, '2024-12-31T10:00');

    const submitButton = screen.getByRole('button', { name: /create request/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Service unavailable')).toBeInTheDocument();
    });
  });

  it('should render in edit mode with initial data', async () => {
    const initialData = {
      id: 'req-1',
      serviceId: 'service-1',
      locationId: 'loc-1',
      executionDateTime: new Date('2024-12-31T10:00:00'),
      templateResponses: {
        description: 'Existing description',
      },
    };

    render(<RequestFormOrganism initialData={initialData} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /update request/i })).toBeInTheDocument();
    });

    const serviceSelect = screen.getByLabelText(/service/i) as HTMLSelectElement;
    expect(serviceSelect.value).toBe('service-1');
    expect(serviceSelect).toBeDisabled();
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(<RequestFormOrganism onCancel={onCancel} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('should disable form fields while submitting', async () => {
    const user = userEvent.setup({ delay: null });

    (global.fetch as any).mockImplementation((url: string, options?: any) => {
      if (url === '/api/requests' && options?.method === 'POST') {
        return new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: () => Promise.resolve({ id: 'req-1' }),
              }),
            100
          )
        );
      }
      if (url === '/api/services') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockServices),
        });
      }
      if (url === '/api/locations') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockLocations),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });

    render(<RequestFormOrganism />);

    await waitFor(() => {
      expect(screen.getByLabelText(/service/i)).toBeInTheDocument();
    });

    const serviceSelect = screen.getByLabelText(/service/i);
    await user.selectOptions(serviceSelect, 'service-2');

    const locationSelect = screen.getByLabelText(/location/i);
    await user.selectOptions(locationSelect, 'loc-1');

    const dateTimeInput = screen.getByLabelText(/execution date & time/i);
    await user.type(dateTimeInput, '2024-12-31T10:00');

    const submitButton = screen.getByRole('button', { name: /create request/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(serviceSelect).toBeDisabled();
      expect(locationSelect).toBeDisabled();
      expect(dateTimeInput).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });
  });

  it('should render textarea for textarea field types', async () => {
    const user = userEvent.setup();
    render(<RequestFormOrganism />);

    await waitFor(() => {
      expect(screen.getByLabelText(/service/i)).toBeInTheDocument();
    });

    const serviceSelect = screen.getByLabelText(/service/i);
    await user.selectOptions(serviceSelect, 'service-1');

    await waitFor(() => {
      const descriptionField = screen.getByLabelText(/issue description/i);
      expect(descriptionField.tagName).toBe('TEXTAREA');
    });
  });

  it('should clear field errors when user starts typing', async () => {
    const user = userEvent.setup();
    render(<RequestFormOrganism />);

    await waitFor(() => {
      expect(screen.getByLabelText(/service/i)).toBeInTheDocument();
    });

    const serviceSelect = screen.getByLabelText(/service/i);
    await user.selectOptions(serviceSelect, 'service-1');

    await waitFor(() => {
      expect(screen.getByLabelText(/issue description/i)).toBeInTheDocument();
    });

    const locationSelect = screen.getByLabelText(/location/i);
    await user.selectOptions(locationSelect, 'loc-1');

    const dateTimeInput = screen.getByLabelText(/execution date & time/i);
    await user.type(dateTimeInput, '2024-12-31T10:00');

    const submitButton = screen.getByRole('button', { name: /create request/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/issue description is required/i)).toBeInTheDocument();
    });

    const descriptionField = screen.getByLabelText(/issue description/i);
    await user.type(descriptionField, 'Fixed');

    expect(screen.queryByText(/issue description is required/i)).not.toBeInTheDocument();
  });

  it('should handle API error when fetching services and locations', async () => {
    (global.fetch as any).mockRejectedValue(new Error('Failed to fetch data'));

    render(<RequestFormOrganism />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load services and locations')).toBeInTheDocument();
    });
  });
});
