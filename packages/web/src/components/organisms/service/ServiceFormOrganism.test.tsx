import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ServiceFormOrganism } from './ServiceFormOrganism';
import type { ServiceFormOrganismProps } from './ServiceFormOrganism.types';

// Mock fetch globally
global.fetch = vi.fn();

const mockCategories = [
  { id: 'cat-1', name: 'Plumbing' },
  { id: 'cat-2', name: 'Electrical' },
  { id: 'cat-3', name: 'HVAC' },
];

describe('ServiceFormOrganism', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockClear();

    // Default mock for fetching categories
    (global.fetch as any).mockImplementation((url: string) => {
      if (url === '/api/categories') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCategories),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });
  });

  it('should show loading state while fetching categories', () => {
    (global.fetch as any).mockImplementation(() => new Promise(() => {}));

    render(<ServiceFormOrganism />);

    expect(screen.getByText('Loading form...')).toBeInTheDocument();
  });

  it('should render create mode correctly', async () => {
    render(<ServiceFormOrganism />);

    await waitFor(() => {
      expect(screen.getByLabelText(/service name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/thumbnail url/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/request form template/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create service/i })).toBeInTheDocument();
    });
  });

  it('should render edit mode correctly', async () => {
    const initialData = {
      id: 'service-1',
      name: 'Emergency Plumbing',
      categoryId: 'cat-1',
      thumbnail: 'https://example.com/plumbing.jpg',
      requestTemplate: { version: '1.0', fields: [] },
    };

    render(<ServiceFormOrganism initialData={initialData} />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Emergency Plumbing')).toBeInTheDocument();
      expect(screen.getByDisplayValue('https://example.com/plumbing.jpg')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /update service/i })).toBeInTheDocument();
    });
  });

  it('should populate category dropdown', async () => {
    render(<ServiceFormOrganism />);

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Plumbing' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Electrical' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'HVAC' })).toBeInTheDocument();
    });
  });

  it('should show cancel button when showCancel is true', async () => {
    render(<ServiceFormOrganism showCancel={true} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });
  });

  it('should hide cancel button when showCancel is false', async () => {
    render(<ServiceFormOrganism showCancel={false} />);

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
    });
  });

  it('should call onCancel when cancel button clicked', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(<ServiceFormOrganism showCancel={true} onCancel={onCancel} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(onCancel).toHaveBeenCalled();
  });

  it('should update input values when user types', async () => {
    const user = userEvent.setup();
    render(<ServiceFormOrganism />);

    await waitFor(() => {
      expect(screen.getByLabelText(/service name/i)).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/service name/i) as HTMLInputElement;
    await user.type(nameInput, 'AC Installation');

    expect(nameInput.value).toBe('AC Installation');
  });

  it('should validate required fields', async () => {
    const user = userEvent.setup();
    const onError = vi.fn();

    render(<ServiceFormOrganism onError={onError} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create service/i })).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: /create service/i });
    await user.click(submitButton);

    // Form validation should prevent submission
    await waitFor(() => {
      const nameInput = screen.getByLabelText(/service name/i);
      expect(nameInput).toBeInvalid();
    });
  });

  it('should submit form and call onSuccess in create mode', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();

    (global.fetch as any).mockImplementation((url: string, options?: any) => {
      if (url === '/api/categories') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCategories),
        });
      }
      if (url === '/api/services' && options?.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            id: 'service-1',
            name: 'AC Installation',
            categoryId: 'cat-2',
            requestTemplate: { version: '1.0', fields: [] },
          }),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    render(<ServiceFormOrganism onSuccess={onSuccess} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/service name/i)).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/service name/i);
    await user.type(nameInput, 'AC Installation');

    const categorySelect = screen.getByLabelText(/category/i);
    await user.selectOptions(categorySelect, 'cat-2');

    const submitButton = screen.getByRole('button', { name: /create service/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('should submit form and call onSuccess in edit mode', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    const initialData = {
      id: 'service-1',
      name: 'Old Name',
      categoryId: 'cat-1',
      requestTemplate: { version: '1.0', fields: [] },
    };

    (global.fetch as any).mockImplementation((url: string, options?: any) => {
      if (url === '/api/categories') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCategories),
        });
      }
      if (url === '/api/services/service-1' && options?.method === 'PATCH') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            ...initialData,
            name: 'Updated Name',
          }),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    render(<ServiceFormOrganism initialData={initialData} onSuccess={onSuccess} />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Old Name')).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/service name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Name');

    const submitButton = screen.getByRole('button', { name: /update service/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('should handle API errors and call onError', async () => {
    const user = userEvent.setup();
    const onError = vi.fn();

    (global.fetch as any).mockImplementation((url: string, options?: any) => {
      if (url === '/api/categories') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCategories),
        });
      }
      if (url === '/api/services' && options?.method === 'POST') {
        return Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ error: 'Service name already exists' }),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    render(<ServiceFormOrganism onError={onError} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/service name/i)).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/service name/i);
    await user.type(nameInput, 'Duplicate Service');

    const categorySelect = screen.getByLabelText(/category/i);
    await user.selectOptions(categorySelect, 'cat-1');

    const submitButton = screen.getByRole('button', { name: /create service/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith('Service name already exists');
    });
  });

  it('should show loading state during submission', async () => {
    const user = userEvent.setup();

    (global.fetch as any).mockImplementation((url: string, options?: any) => {
      if (url === '/api/categories') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCategories),
        });
      }
      if (url === '/api/services' && options?.method === 'POST') {
        return new Promise(() => {}); // Never resolves
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    render(<ServiceFormOrganism />);

    await waitFor(() => {
      expect(screen.getByLabelText(/service name/i)).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/service name/i);
    await user.type(nameInput, 'New Service');

    const categorySelect = screen.getByLabelText(/category/i);
    await user.selectOptions(categorySelect, 'cat-1');

    const submitButton = screen.getByRole('button', { name: /create service/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/creating/i)).toBeInTheDocument();
    });
  });

  it('should handle JSON template editing', async () => {
    const user = userEvent.setup();
    render(<ServiceFormOrganism />);

    await waitFor(() => {
      expect(screen.getByLabelText(/request form template/i)).toBeInTheDocument();
    });

    const templateTextarea = screen.getByLabelText(/request form template/i) as HTMLTextAreaElement;

    const validJSON = JSON.stringify({
      version: '2.0',
      fields: [{ id: 'test', type: 'text', label: 'Test Field' }],
    }, null, 2);

    await user.clear(templateTextarea);
    await user.type(templateTextarea, validJSON);

    // The textarea should accept the input
    expect(templateTextarea.value).toBeTruthy();
  });

  it('should validate JSON template format', async () => {
    const user = userEvent.setup();
    render(<ServiceFormOrganism />);

    await waitFor(() => {
      expect(screen.getByLabelText(/request form template/i)).toBeInTheDocument();
    });

    const templateTextarea = screen.getByLabelText(/request form template/i);

    await user.clear(templateTextarea);
    await user.type(templateTextarea, 'invalid json {');

    await waitFor(() => {
      expect(screen.getByText(/invalid json format/i)).toBeInTheDocument();
    });
  });

  it('should pre-fill form with initialData in edit mode', async () => {
    const initialData = {
      id: 'service-1',
      name: 'Emergency Plumbing',
      categoryId: 'cat-1',
      thumbnail: 'https://example.com/plumbing.jpg',
      requestTemplate: {
        version: '1.0',
        fields: [{ id: 'urgency', type: 'select', label: 'Urgency' }],
      },
    };

    render(<ServiceFormOrganism initialData={initialData} />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Emergency Plumbing')).toBeInTheDocument();
      expect(screen.getByDisplayValue('https://example.com/plumbing.jpg')).toBeInTheDocument();

      const categorySelect = screen.getByLabelText(/category/i) as HTMLSelectElement;
      expect(categorySelect.value).toBe('cat-1');
    });
  });

  it('should handle categories loading error', async () => {
    const onError = vi.fn();

    (global.fetch as any).mockImplementation((url: string) => {
      if (url === '/api/categories') {
        return Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ error: 'Failed to fetch categories' }),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    render(<ServiceFormOrganism onError={onError} />);

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith('Failed to load categories. Please refresh the page.');
    });
  });

  it('should apply custom className', async () => {
    const { container } = render(<ServiceFormOrganism className="custom-form" />);

    await waitFor(() => {
      expect(container.querySelector('form')).toHaveClass('custom-form');
    });
  });

  it('should reset form after successful creation', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();

    (global.fetch as any).mockImplementation((url: string, options?: any) => {
      if (url === '/api/categories') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCategories),
        });
      }
      if (url === '/api/services' && options?.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: 'service-1', name: 'New Service' }),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    render(<ServiceFormOrganism onSuccess={onSuccess} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/service name/i)).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/service name/i) as HTMLInputElement;
    await user.type(nameInput, 'New Service');

    const categorySelect = screen.getByLabelText(/category/i);
    await user.selectOptions(categorySelect, 'cat-1');

    const submitButton = screen.getByRole('button', { name: /create service/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });

    // Form should reset in create mode
    await waitFor(() => {
      expect(nameInput.value).toBe('');
    });
  });
});
