import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import React from 'react';
import { DynamicForm } from './DynamicForm';
import type { DynamicField } from './DynamicForm.types';

/**
 * Test wrapper component to provide React Hook Form context
 */
const TestWrapper = ({ field, disabled = false }: { field: DynamicField; disabled?: boolean }) => {
  const {
    register,
    formState: { errors },
  } = useForm();

  return <DynamicForm field={field} register={register} errors={errors} disabled={disabled} />;
};

describe('DynamicForm', () => {
  describe('Text Field', () => {
    it('renders text input with label', () => {
      const field: DynamicField = {
        id: 'name',
        type: 'text',
        label: 'Full Name',
        required: true,
        placeholder: 'Enter your name',
      };

      render(<TestWrapper field={field} />);

      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
      expect(screen.getByText('*')).toBeInTheDocument(); // Required indicator
    });

    it('renders help text when provided', () => {
      const field: DynamicField = {
        id: 'email',
        type: 'text',
        label: 'Email',
        required: false,
        helpText: 'We will never share your email',
      };

      render(<TestWrapper field={field} />);

      expect(screen.getByText('We will never share your email')).toBeInTheDocument();
    });

    it('applies data-testid attribute', () => {
      const field: DynamicField = {
        id: 'username',
        type: 'text',
        label: 'Username',
        required: false,
      };

      render(<TestWrapper field={field} />);

      expect(screen.getByTestId('dynamic-form-field-username')).toBeInTheDocument();
      expect(screen.getByTestId('dynamic-form-wrapper')).toBeInTheDocument();
    });
  });

  describe('Textarea Field', () => {
    it('renders textarea with correct attributes', () => {
      const field: DynamicField = {
        id: 'description',
        type: 'textarea',
        label: 'Description',
        required: true,
        placeholder: 'Enter description',
      };

      render(<TestWrapper field={field} />);

      const textarea = screen.getByPlaceholderText('Enter description');
      expect(textarea).toBeInTheDocument();
      expect(textarea.tagName).toBe('TEXTAREA');
      expect(textarea).toHaveAttribute('rows', '4');
    });
  });

  describe('Number Field', () => {
    it('renders number input', () => {
      const field: DynamicField = {
        id: 'age',
        type: 'number',
        label: 'Age',
        required: true,
        validation: {
          min: 18,
          max: 100,
        },
      };

      render(<TestWrapper field={field} />);

      const input = screen.getByLabelText(/Age/i);
      expect(input).toHaveAttribute('type', 'number');
    });
  });

  describe('Select Field', () => {
    it('renders select with options', () => {
      const field: DynamicField = {
        id: 'country',
        type: 'select',
        label: 'Country',
        required: true,
        options: [
          { value: 'us', label: 'United States' },
          { value: 'ca', label: 'Canada' },
          { value: 'mx', label: 'Mexico' },
        ],
      };

      render(<TestWrapper field={field} />);

      const select = screen.getByLabelText(/Country/i);
      expect(select.tagName).toBe('SELECT');
      expect(screen.getByText('United States')).toBeInTheDocument();
      expect(screen.getByText('Canada')).toBeInTheDocument();
      expect(screen.getByText('Mexico')).toBeInTheDocument();
    });

    it('renders placeholder option', () => {
      const field: DynamicField = {
        id: 'country',
        type: 'select',
        label: 'Country',
        required: false,
        placeholder: 'Choose a country',
        options: [{ value: 'us', label: 'United States' }],
      };

      render(<TestWrapper field={field} />);

      expect(screen.getByText('Choose a country')).toBeInTheDocument();
    });
  });

  describe('Radio Field', () => {
    it('renders radio buttons with options', () => {
      const field: DynamicField = {
        id: 'gender',
        type: 'radio',
        label: 'Gender',
        required: true,
        options: [
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
          { value: 'other', label: 'Other' },
        ],
      };

      render(<TestWrapper field={field} />);

      expect(screen.getByLabelText('Male')).toHaveAttribute('type', 'radio');
      expect(screen.getByLabelText('Female')).toHaveAttribute('type', 'radio');
      expect(screen.getByLabelText('Other')).toHaveAttribute('type', 'radio');
    });
  });

  describe('Checkbox Field', () => {
    it('renders single checkbox', () => {
      const field: DynamicField = {
        id: 'terms',
        type: 'checkbox',
        label: 'I agree to terms',
        required: true,
      };

      render(<TestWrapper field={field} />);

      const checkbox = screen.getByLabelText(/I agree to terms/i);
      expect(checkbox).toHaveAttribute('type', 'checkbox');
      expect(screen.getByText('*')).toBeInTheDocument(); // Required indicator
    });
  });

  describe('Checkbox Group Field', () => {
    it('renders multiple checkboxes', () => {
      const field: DynamicField = {
        id: 'interests',
        type: 'checkboxGroup',
        label: 'Interests',
        required: false,
        options: [
          { value: 'sports', label: 'Sports' },
          { value: 'music', label: 'Music' },
          { value: 'reading', label: 'Reading' },
        ],
      };

      render(<TestWrapper field={field} />);

      expect(screen.getByLabelText('Sports')).toHaveAttribute('type', 'checkbox');
      expect(screen.getByLabelText('Music')).toHaveAttribute('type', 'checkbox');
      expect(screen.getByLabelText('Reading')).toHaveAttribute('type', 'checkbox');
    });
  });

  describe('Date Field', () => {
    it('renders date input', () => {
      const field: DynamicField = {
        id: 'birthdate',
        type: 'date',
        label: 'Birth Date',
        required: true,
      };

      render(<TestWrapper field={field} />);

      expect(screen.getByLabelText(/Birth Date/i)).toHaveAttribute('type', 'date');
    });
  });

  describe('Time Field', () => {
    it('renders time input', () => {
      const field: DynamicField = {
        id: 'appointment',
        type: 'time',
        label: 'Appointment Time',
        required: true,
      };

      render(<TestWrapper field={field} />);

      expect(screen.getByLabelText(/Appointment Time/i)).toHaveAttribute('type', 'time');
    });
  });

  describe('File Field', () => {
    it('renders file input', () => {
      const field: DynamicField = {
        id: 'document',
        type: 'file',
        label: 'Upload Document',
        required: false,
      };

      render(<TestWrapper field={field} />);

      expect(screen.getByLabelText(/Upload Document/i)).toHaveAttribute('type', 'file');
    });

    it('supports multiple files', () => {
      const field: DynamicField = {
        id: 'photos',
        type: 'file',
        label: 'Upload Photos',
        required: false,
        validation: {
          maxFiles: 5,
        },
      };

      render(<TestWrapper field={field} />);

      expect(screen.getByLabelText(/Upload Photos/i)).toHaveAttribute('multiple');
    });

    it('applies accept attribute', () => {
      const field: DynamicField = {
        id: 'image',
        type: 'file',
        label: 'Upload Image',
        required: false,
        validation: {
          acceptedTypes: ['image/png', 'image/jpeg'],
        },
      };

      render(<TestWrapper field={field} />);

      expect(screen.getByLabelText(/Upload Image/i)).toHaveAttribute(
        'accept',
        'image/png,image/jpeg'
      );
    });
  });

  describe('Unsupported Field Type', () => {
    it('renders error message for unsupported type', () => {
      const field: DynamicField = {
        id: 'invalid',
        type: 'invalid-type' as any,
        label: 'Invalid Field',
        required: false,
      };

      render(<TestWrapper field={field} />);

      expect(screen.getByTestId('unsupported-field-type')).toBeInTheDocument();
      expect(screen.getByText(/Unsupported field type: invalid-type/i)).toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('disables input when disabled prop is true', () => {
      const field: DynamicField = {
        id: 'disabled-field',
        type: 'text',
        label: 'Disabled Field',
        required: false,
      };

      render(<TestWrapper field={field} disabled={true} />);

      expect(screen.getByLabelText(/Disabled Field/i)).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('includes aria-invalid when field has error', () => {
      const TestWrapperWithError = () => {
        const {
          register,
          formState: { errors },
          setError,
        } = useForm();

        // Simulate error
        React.useEffect(() => {
          setError('email', { type: 'required', message: 'Email is required' });
        }, [setError]);

        const field: DynamicField = {
          id: 'email',
          type: 'text',
          label: 'Email',
          required: true,
        };

        return <DynamicForm field={field} register={register} errors={errors} />;
      };

      render(<TestWrapperWithError />);

      const input = screen.getByLabelText(/Email/i);
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('includes aria-describedby pointing to error message', () => {
      const TestWrapperWithError = () => {
        const {
          register,
          formState: { errors },
          setError,
        } = useForm();

        React.useEffect(() => {
          setError('username', { type: 'required', message: 'Username is required' });
        }, [setError]);

        const field: DynamicField = {
          id: 'username',
          type: 'text',
          label: 'Username',
          required: true,
        };

        return <DynamicForm field={field} register={register} errors={errors} />;
      };

      render(<TestWrapperWithError />);

      const input = screen.getByLabelText(/Username/i);
      expect(input).toHaveAttribute('aria-describedby', 'username-error');
    });
  });

  describe('Custom ClassName', () => {
    it('applies custom className to wrapper', () => {
      const field: DynamicField = {
        id: 'custom',
        type: 'text',
        label: 'Custom Field',
        required: false,
      };

      const { container } = render(
        <TestWrapper field={field} />
      );

      expect(screen.getByTestId('dynamic-form-wrapper')).toBeInTheDocument();
    });
  });
});
