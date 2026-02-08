import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { RequestTemplateRenderer } from './RequestTemplateRenderer';

// Mock dependencies
vi.mock('@/components/molecules/dynamic-form', () => ({
  DynamicFieldRenderer: ({ field, register, errors, disabled }: any) => (
    <div data-testid={`field-${field.id}`}>
      <label htmlFor={field.id}>{field.label}</label>
      <input
        id={field.id}
        {...register(field.id, { required: field.required })}
        disabled={disabled}
        placeholder={field.placeholder}
      />
      {errors[field.id] && <span data-testid={`error-${field.id}`}>Required field</span>}
    </div>
  ),
}));

const mockTemplate = {
  version: '1.0',
  fields: [
    {
      id: 'issue_description',
      type: 'textarea',
      label: 'Describe the Issue',
      required: true,
      placeholder: 'Enter description',
    },
    {
      id: 'priority',
      type: 'select',
      label: 'Priority',
      required: false,
      options: [
        { label: 'Low', value: 'low' },
        { label: 'High', value: 'high' },
      ],
    },
  ],
};

describe('RequestTemplateRenderer - Organism', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render all template fields', () => {
      render(<RequestTemplateRenderer template={mockTemplate} />);

      expect(screen.getByTestId('field-issue_description')).toBeInTheDocument();
      expect(screen.getByTestId('field-priority')).toBeInTheDocument();
    });

    it('should render submit button with default text', () => {
      render(<RequestTemplateRenderer template={mockTemplate} />);

      expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
    });

    it('should render submit button with custom text', () => {
      render(
        <RequestTemplateRenderer
          template={mockTemplate}
          submitButtonText="Create Request"
        />
      );

      expect(screen.getByRole('button', { name: 'Create Request' })).toBeInTheDocument();
    });

    it('should not render cancel button by default', () => {
      render(<RequestTemplateRenderer template={mockTemplate} />);

      expect(screen.queryByRole('button', { name: /Cancel/i })).not.toBeInTheDocument();
    });

    it('should render cancel button when showCancel is true', () => {
      render(
        <RequestTemplateRenderer
          template={mockTemplate}
          showCancel
          onCancel={vi.fn()}
        />
      );

      expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    });

    it('should render field labels', () => {
      render(<RequestTemplateRenderer template={mockTemplate} />);

      expect(screen.getByText('Describe the Issue')).toBeInTheDocument();
      expect(screen.getByText('Priority')).toBeInTheDocument();
    });
  });

  describe('Empty Template', () => {
    it('should show warning for empty template', () => {
      render(<RequestTemplateRenderer template={{ version: '1.0', fields: [] }} />);

      expect(screen.getByText('No form fields defined in template')).toBeInTheDocument();
    });

    it('should show warning for null template', () => {
      render(<RequestTemplateRenderer template={null as any} />);

      expect(screen.getByText('No form fields defined in template')).toBeInTheDocument();
    });

    it('should show warning for template without fields', () => {
      render(<RequestTemplateRenderer template={{ version: '1.0' } as any} />);

      expect(screen.getByText('No form fields defined in template')).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('should call onSubmit with form data', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      render(<RequestTemplateRenderer template={mockTemplate} onSubmit={onSubmit} />);

      const input = screen.getByLabelText('Describe the Issue');
      fireEvent.change(input, { target: { value: 'Test issue' } });

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            issue_description: 'Test issue',
          })
        );
      });
    });

    it('should show loading state during submission', async () => {
      const onSubmit = vi.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
      render(<RequestTemplateRenderer template={mockTemplate} onSubmit={onSubmit} />);

      const input = screen.getByLabelText('Describe the Issue');
      fireEvent.change(input, { target: { value: 'Test' } });

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Submitting...')).toBeInTheDocument();
      });
    });

    it('should disable form during submission', async () => {
      const onSubmit = vi.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
      render(<RequestTemplateRenderer template={mockTemplate} onSubmit={onSubmit} />);

      const input = screen.getByLabelText('Describe the Issue');
      fireEvent.change(input, { target: { value: 'Test' } });

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });

    it('should reset form after successful submission', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      render(<RequestTemplateRenderer template={mockTemplate} onSubmit={onSubmit} />);

      const input = screen.getByLabelText('Describe the Issue') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'Test issue' } });

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(input.value).toBe('');
      });
    });
  });

  describe('Error Handling', () => {
    it('should call onError when submission fails', async () => {
      const onSubmit = vi.fn().mockRejectedValue(new Error('Submission failed'));
      const onError = vi.fn();

      render(
        <RequestTemplateRenderer
          template={mockTemplate}
          onSubmit={onSubmit}
          onError={onError}
        />
      );

      const input = screen.getByLabelText('Describe the Issue');
      fireEvent.change(input, { target: { value: 'Test' } });

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith('Submission failed');
      });
    });

    it('should use fallback error message', async () => {
      const onSubmit = vi.fn().mockRejectedValue({});
      const onError = vi.fn();

      render(
        <RequestTemplateRenderer
          template={mockTemplate}
          onSubmit={onSubmit}
          onError={onError}
        />
      );

      const input = screen.getByLabelText('Describe the Issue');
      fireEvent.change(input, { target: { value: 'Test' } });

      fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith('An error occurred while submitting the form');
      });
    });
  });

  describe('Cancel Functionality', () => {
    it('should call onCancel when cancel button is clicked', async () => {
      const onCancel = vi.fn();
      render(
        <RequestTemplateRenderer
          template={mockTemplate}
          showCancel
          onCancel={onCancel}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      fireEvent.click(cancelButton);

      expect(onCancel).toHaveBeenCalled();
    });

    it('should disable cancel button during submission', async () => {
      const onSubmit = vi.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
      render(
        <RequestTemplateRenderer
          template={mockTemplate}
          onSubmit={onSubmit}
          showCancel
          onCancel={vi.fn()}
        />
      );

      const input = screen.getByLabelText('Describe the Issue');
      fireEvent.change(input, { target: { value: 'Test' } });

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const cancelButton = screen.getByRole('button', { name: /Cancel/i });
        expect(cancelButton).toBeDisabled();
      });
    });
  });

  describe('Disabled State', () => {
    it('should disable all fields when disabled prop is true', () => {
      render(<RequestTemplateRenderer template={mockTemplate} disabled />);

      const inputs = screen.getAllByRole('textbox');
      inputs.forEach(input => {
        expect(input).toBeDisabled();
      });
    });

    it('should disable submit button when disabled prop is true', () => {
      render(<RequestTemplateRenderer template={mockTemplate} disabled />);

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Initial Data', () => {
    it('should populate form with initial data', () => {
      const initialData = {
        issue_description: 'Pre-filled issue',
        priority: 'high',
      };

      render(
        <RequestTemplateRenderer
          template={mockTemplate}
          initialData={initialData}
        />
      );

      const input = screen.getByLabelText('Describe the Issue') as HTMLInputElement;
      expect(input.value).toBe('Pre-filled issue');
    });

    it('should handle empty initial data', () => {
      render(
        <RequestTemplateRenderer
          template={mockTemplate}
          initialData={{}}
        />
      );

      const input = screen.getByLabelText('Describe the Issue') as HTMLInputElement;
      expect(input.value).toBe('');
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className to form', () => {
      const { container } = render(
        <RequestTemplateRenderer
          template={mockTemplate}
          className="custom-form"
        />
      );

      const form = container.querySelector('form');
      expect(form).toHaveClass('custom-form');
    });

    it('should apply default spacing classes', () => {
      const { container } = render(<RequestTemplateRenderer template={mockTemplate} />);

      const form = container.querySelector('form');
      expect(form).toHaveClass('space-y-6');
    });
  });

  describe('Field Rendering', () => {
    it('should pass register to each field', () => {
      render(<RequestTemplateRenderer template={mockTemplate} />);

      const fields = screen.getAllByRole('textbox');
      expect(fields.length).toBeGreaterThan(0);
    });

    it('should pass errors to each field', () => {
      render(<RequestTemplateRenderer template={mockTemplate} />);

      // Submit without filling required fields
      const submitButton = screen.getByRole('button', { name: /Submit/i });
      fireEvent.click(submitButton);

      // React Hook Form validation should trigger
      expect(screen.getByTestId('field-issue_description')).toBeInTheDocument();
    });

    it('should render fields in order', () => {
      const { container } = render(<RequestTemplateRenderer template={mockTemplate} />);

      const fieldsContainer = container.querySelector('.space-y-4');
      const fields = fieldsContainer?.querySelectorAll('[data-testid^="field-"]');

      expect(fields?.[0]).toHaveAttribute('data-testid', 'field-issue_description');
      expect(fields?.[1]).toHaveAttribute('data-testid', 'field-priority');
    });
  });

  describe('Button Icons', () => {
    it('should render submit button with send icon', () => {
      render(<RequestTemplateRenderer template={mockTemplate} />);

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      expect(submitButton).toBeInTheDocument();
    });

    it('should render cancel button with X icon when shown', () => {
      render(
        <RequestTemplateRenderer
          template={mockTemplate}
          showCancel
          onCancel={vi.fn()}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      expect(cancelButton).toBeInTheDocument();
    });

    it('should show loader icon during submission', async () => {
      const onSubmit = vi.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
      render(<RequestTemplateRenderer template={mockTemplate} onSubmit={onSubmit} />);

      const input = screen.getByLabelText('Describe the Issue');
      fireEvent.change(input, { target: { value: 'Test' } });

      fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

      await waitFor(() => {
        expect(screen.getByText('Submitting...')).toBeInTheDocument();
      });
    });
  });

  describe('Form testid', () => {
    it('should have request-template-form testid', () => {
      render(<RequestTemplateRenderer template={mockTemplate} />);

      expect(screen.getByTestId('request-template-form')).toBeInTheDocument();
    });
  });
});
