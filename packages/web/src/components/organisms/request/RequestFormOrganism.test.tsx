import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { RequestFormOrganism } from './RequestFormOrganism';
import type { RequestFormOrganismProps } from './RequestFormOrganism.types';

// Mock fetch globally
global.fetch = vi.fn();

// Helper to get future date string for datetime-local input
const getFutureDateString = () => {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 7); // 7 days from now
  return futureDate.toISOString().slice(0, 16);
};

const mockServices = [
  {
    id: '507f1f77bcf86cd799439011',
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
    id: '507f1f77bcf86cd799439012',
    name: 'Electrical Work',
  },
];

const mockLocations = [
  {
    id: '507f1f77bcf86cd799439013',
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
  },
  {
    id: '507f1f77bcf86cd799439014',
    street: '456 Oak Ave',
    city: 'Los Angeles',
    state: 'CA',
  },
];

describe('RequestFormOrganism', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
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

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render form with all fields', async () => {
    render(<RequestFormOrganism />);

    await waitFor(
      () => {
        expect(screen.getByLabelText(/service/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/execution date & time/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create request/i })).toBeInTheDocument();
      },
      { timeout: 10000 },
    );
  }, 10000);

  it('should show loading state while fetching data', async () => {
    (global.fetch as any).mockImplementation(() => new Promise(() => {})); // Never resolves

    await act(async () => {
      render(<RequestFormOrganism />);
    });

    // Check for loading indicator (spinner with animate-spin class)
    const loader = document.querySelector('.animate-spin');
    expect(loader).toBeInTheDocument();
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
    await user.selectOptions(serviceSelect, '507f1f77bcf86cd799439011');

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
    await user.selectOptions(serviceSelect, '507f1f77bcf86cd799439011');

    await waitFor(() => {
      expect(screen.getByLabelText(/issue description/i)).toBeInTheDocument();
    });

    const descriptionField = screen.getByLabelText(/issue description/i) as HTMLTextAreaElement;
    await user.type(descriptionField, 'Leaking pipe');

    await user.selectOptions(serviceSelect, '507f1f77bcf86cd799439012');

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
    await user.selectOptions(serviceSelect, '507f1f77bcf86cd799439011');

    const locationSelect = screen.getByLabelText(/location/i);
    await user.selectOptions(locationSelect, '507f1f77bcf86cd799439013');

    const dateTimeInput = screen.getByLabelText(/execution date & time/i);
    await user.type(dateTimeInput, getFutureDateString());

    await waitFor(() => {
      expect(screen.getByLabelText(/issue description/i)).toBeInTheDocument();
    });

    // Fill one field but leave the other required field empty to trigger field-specific validation
    const descriptionField = screen.getByLabelText(/issue description/i);
    await user.type(descriptionField, 'Test');

    // Leave urgency empty - use fireEvent.submit to bypass HTML5 validation
    const form = document.querySelector('form');
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
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
    await user.selectOptions(serviceSelect, '507f1f77bcf86cd799439011');

    await waitFor(() => {
      expect(screen.getByLabelText(/issue description/i)).toBeInTheDocument();
    });

    const locationSelect = screen.getByLabelText(/location/i);
    await user.selectOptions(locationSelect, '507f1f77bcf86cd799439013');

    const dateTimeInput = screen.getByLabelText(/execution date & time/i);
    await user.type(dateTimeInput, getFutureDateString());

    const descriptionField = screen.getByLabelText(/issue description/i);
    await user.type(descriptionField, 'Leaking pipe under sink');

    const urgencySelect = screen.getByLabelText(/urgency level/i);
    await user.selectOptions(urgencySelect, 'high');

    // Use fireEvent.submit to bypass HTML5 validation
    const form = document.querySelector('form');
    if (form) {
      fireEvent.submit(form);
    }

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

    // Use service with template and fill all fields to pass validation
    const serviceSelect = screen.getByLabelText(/service/i);
    await user.selectOptions(serviceSelect, '507f1f77bcf86cd799439011');

    await waitFor(() => {
      expect(screen.getByLabelText(/issue description/i)).toBeInTheDocument();
    });

    const locationSelect = screen.getByLabelText(/location/i);
    await user.selectOptions(locationSelect, '507f1f77bcf86cd799439013');

    const dateTimeInput = screen.getByLabelText(/execution date & time/i);
    await user.type(dateTimeInput, getFutureDateString());

    // Fill template fields
    const descriptionField = screen.getByLabelText(/issue description/i);
    await user.type(descriptionField, 'Test description');

    const urgencySelect = screen.getByLabelText(/urgency level/i);
    await user.selectOptions(urgencySelect, 'high');

    // Use fireEvent.submit to bypass HTML5 validation
    const form = document.querySelector('form');
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(screen.getByText('Service unavailable')).toBeInTheDocument();
    });
  });

  it('should render in edit mode with initial data', async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const initialData = {
      id: 'req-1',
      serviceId: '507f1f77bcf86cd799439011',
      locationId: '507f1f77bcf86cd799439013',
      executionDateTime: futureDate,
      templateResponses: {
        description: 'Existing description',
      },
    };

    render(<RequestFormOrganism initialData={initialData} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /update request/i })).toBeInTheDocument();
    });

    const serviceSelect = screen.getByLabelText(/service/i) as HTMLSelectElement;
    expect(serviceSelect.value).toBe('507f1f77bcf86cd799439011');
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

    // Use service with template and fill all fields to pass validation
    const serviceSelect = screen.getByLabelText(/service/i);
    await user.selectOptions(serviceSelect, '507f1f77bcf86cd799439011');

    await waitFor(() => {
      expect(screen.getByLabelText(/issue description/i)).toBeInTheDocument();
    });

    const locationSelect = screen.getByLabelText(/location/i);
    await user.selectOptions(locationSelect, '507f1f77bcf86cd799439013');

    const dateTimeInput = screen.getByLabelText(/execution date & time/i);
    await user.type(dateTimeInput, getFutureDateString());

    // Fill template fields
    const descriptionField = screen.getByLabelText(/issue description/i);
    await user.type(descriptionField, 'Test description');

    const urgencySelect = screen.getByLabelText(/urgency level/i);
    await user.selectOptions(urgencySelect, 'high');

    const submitButton = screen.getByRole('button', { name: /create request/i });

    // Use fireEvent.submit to bypass HTML5 validation
    const form = document.querySelector('form');
    if (form) {
      fireEvent.submit(form);
    }

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
    await user.selectOptions(serviceSelect, '507f1f77bcf86cd799439011');

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
    await user.selectOptions(serviceSelect, '507f1f77bcf86cd799439011');

    await waitFor(() => {
      expect(screen.getByLabelText(/issue description/i)).toBeInTheDocument();
    });

    const locationSelect = screen.getByLabelText(/location/i);
    await user.selectOptions(locationSelect, '507f1f77bcf86cd799439013');

    const dateTimeInput = screen.getByLabelText(/execution date & time/i);
    await user.type(dateTimeInput, getFutureDateString());

    // Fill description but leave urgency empty to trigger urgency validation
    const descriptionField = screen.getByLabelText(/issue description/i);
    await user.type(descriptionField, 'Test');

    // Use fireEvent.submit to bypass HTML5 validation
    const form = document.querySelector('form');
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(screen.getByText(/urgency level is required/i)).toBeInTheDocument();
    });

    // Now fill urgency field to clear the error
    const urgencySelect = screen.getByLabelText(/urgency level/i);
    await user.selectOptions(urgencySelect, 'high');

    expect(screen.queryByText(/urgency level is required/i)).not.toBeInTheDocument();
  });

  it('should handle API error when fetching services and locations', async () => {
    (global.fetch as any).mockRejectedValue(new Error('Failed to fetch data'));

    render(<RequestFormOrganism />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load services and locations')).toBeInTheDocument();
    });
  });
});
