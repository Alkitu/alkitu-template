import { renderWithProviders, screen, waitFor } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { CategoryFormOrganism } from './CategoryFormOrganism';
import type { CategoryFormOrganismProps } from './CategoryFormOrganism.types';

// Mock fetch globally
global.fetch = vi.fn();

describe('CategoryFormOrganism', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockClear();
  });

  it('should render create mode correctly', () => {
    renderWithProviders(<CategoryFormOrganism />);

    expect(screen.getByLabelText(/category name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create category/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
  });

  it('should render edit mode correctly', () => {
    const initialData = {
      id: 'cat-1',
      name: 'Plumbing',
    };

    renderWithProviders(<CategoryFormOrganism initialData={initialData} />);

    expect(screen.getByDisplayValue('Plumbing')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update category/i })).toBeInTheDocument();
  });

  it('should show cancel button when showCancel is true', () => {
    const onCancel = vi.fn();
    renderWithProviders(<CategoryFormOrganism showCancel={true} onCancel={onCancel} />);

    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('should hide cancel button when showCancel is false', async () => {
    renderWithProviders(<CategoryFormOrganism showCancel={false} />);

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
    });
  });

  it('should update input value when user types', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CategoryFormOrganism />);

    const nameInput = screen.getByLabelText(/category name/i) as HTMLInputElement;
    await user.type(nameInput, 'Electrical');

    expect(nameInput.value).toBe('Electrical');
  });

  it('should submit form and call onSuccess in create mode', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ id: 'cat-1', name: 'Plumbing' }),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    renderWithProviders(<CategoryFormOrganism onSuccess={onSuccess} />);

    const nameInput = screen.getByLabelText(/category name/i);
    await user.type(nameInput, 'Plumbing');

    const submitButton = screen.getByRole('button', { name: /create category/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'Plumbing' }),
      });
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith({ id: 'cat-1', name: 'Plumbing' });
    });
  });

  it('should submit form and call onSuccess in edit mode', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    const initialData = {
      id: 'cat-1',
      name: 'Plumbing',
    };
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ id: 'cat-1', name: 'Plumbing Services' }),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    renderWithProviders(<CategoryFormOrganism initialData={initialData} onSuccess={onSuccess} />);

    const nameInput = screen.getByLabelText(/category name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Plumbing Services');

    const submitButton = screen.getByRole('button', { name: /update category/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/categories/cat-1', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'Plumbing Services' }),
      });
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith({ id: 'cat-1', name: 'Plumbing Services' });
    });
  });

  it('should call onError when submission fails', async () => {
    const user = userEvent.setup();
    const onError = vi.fn();
    const mockResponse = {
      ok: false,
      json: () => Promise.resolve({ error: 'Category already exists' }),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    renderWithProviders(<CategoryFormOrganism onError={onError} />);

    const nameInput = screen.getByLabelText(/category name/i);
    await user.type(nameInput, 'Plumbing');

    const submitButton = screen.getByRole('button', { name: /create category/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith('Category already exists');
    });
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    renderWithProviders(<CategoryFormOrganism onCancel={onCancel} showCancel={true} />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('should disable form fields while loading', async () => {
    const user = userEvent.setup({ delay: null });
    const mockResponse = {
      ok: true,
      json: () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ id: 'cat-1', name: 'Plumbing' }), 100)
        ),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    renderWithProviders(<CategoryFormOrganism />);

    const nameInput = screen.getByLabelText(/category name/i);
    await user.type(nameInput, 'Plumbing');

    const submitButton = screen.getByRole('button', { name: /create category/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(nameInput).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });
  });

  it('should show loading text in submit button when loading', async () => {
    const user = userEvent.setup({ delay: null });
    const mockResponse = {
      ok: true,
      json: () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ id: 'cat-1', name: 'Plumbing' }), 100)
        ),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    renderWithProviders(<CategoryFormOrganism />);

    const nameInput = screen.getByLabelText(/category name/i);
    await user.type(nameInput, 'Plumbing');

    const submitButton = screen.getByRole('button', { name: /create category/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/creating.../i)).toBeInTheDocument();
    });
  });

  it('should reset form after successful create', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ id: 'cat-1', name: 'Plumbing' }),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    renderWithProviders(<CategoryFormOrganism />);

    const nameInput = screen.getByLabelText(/category name/i) as HTMLInputElement;
    await user.type(nameInput, 'Plumbing');

    const submitButton = screen.getByRole('button', { name: /create category/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(nameInput.value).toBe('');
    });
  });

  it('should not reset form after successful update', async () => {
    const user = userEvent.setup();
    const initialData = {
      id: 'cat-1',
      name: 'Plumbing',
    };
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ id: 'cat-1', name: 'Plumbing Services' }),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    renderWithProviders(<CategoryFormOrganism initialData={initialData} />);

    const nameInput = screen.getByLabelText(/category name/i) as HTMLInputElement;
    await user.clear(nameInput);
    await user.type(nameInput, 'Plumbing Services');

    const submitButton = screen.getByRole('button', { name: /update category/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(nameInput.value).toBe('Plumbing Services');
    });
  });

  it('should validate required field', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CategoryFormOrganism />);

    const nameInput = screen.getByLabelText(/category name/i);
    expect(nameInput).toHaveAttribute('aria-invalid', 'false');

    const submitButton = screen.getByRole('button', { name: /create category/i });
    await user.click(submitButton);

    // React Hook Form + Zod validation should prevent submission
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should display validation error for empty name', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CategoryFormOrganism />);

    const submitButton = screen.getByRole('button', { name: /create category/i });
    await user.click(submitButton);

    await waitFor(() => {
      const nameInput = screen.getByLabelText(/category name/i);
      expect(nameInput).toHaveAttribute('aria-invalid', 'true');
    });
  });

  it('should apply custom className', () => {
    const { container } = renderWithProviders(<CategoryFormOrganism className="custom-class" />);

    const form = container.querySelector('form');
    expect(form).toHaveClass('custom-class');
  });

  it('should have correct data-testid attribute', () => {
    renderWithProviders(<CategoryFormOrganism />);

    expect(screen.getByTestId('category-form')).toBeInTheDocument();
  });

  it('should have proper ARIA attributes', () => {
    renderWithProviders(<CategoryFormOrganism />);

    const nameInput = screen.getByLabelText(/category name/i);
    expect(nameInput).toHaveAttribute('id', 'name');
    expect(nameInput).toHaveAttribute('aria-invalid');
  });

  it('should handle network errors gracefully', async () => {
    const user = userEvent.setup();
    const onError = vi.fn();
    (global.fetch as any).mockRejectedValue(new Error('Network error'));

    renderWithProviders(<CategoryFormOrganism onError={onError} />);

    const nameInput = screen.getByLabelText(/category name/i);
    await user.type(nameInput, 'Plumbing');

    const submitButton = screen.getByRole('button', { name: /create category/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith('Network error');
    });
  });

  it('should disable cancel button when loading', async () => {
    const user = userEvent.setup({ delay: null });
    const onCancel = vi.fn();
    const mockResponse = {
      ok: true,
      json: () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ id: 'cat-1', name: 'Plumbing' }), 100)
        ),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    renderWithProviders(<CategoryFormOrganism showCancel={true} onCancel={onCancel} />);

    const nameInput = screen.getByLabelText(/category name/i);
    await user.type(nameInput, 'Plumbing');

    const submitButton = screen.getByRole('button', { name: /create category/i });
    await user.click(submitButton);

    await waitFor(() => {
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      expect(cancelButton).toBeDisabled();
    });
  });
});
