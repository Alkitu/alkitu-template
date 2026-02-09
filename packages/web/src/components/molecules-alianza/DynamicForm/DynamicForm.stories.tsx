import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { DynamicForm } from './DynamicForm';
import type { DynamicField } from './DynamicForm.types';

/**
 * Wrapper component to provide React Hook Form context
 */
const DynamicFormWrapper = ({ field, disabled = false }: { field: DynamicField; disabled?: boolean }) => {
  const {
    register,
    formState: { errors },
  } = useForm();

  return <DynamicForm field={field} register={register} errors={errors} disabled={disabled} />;
};

const meta: Meta<typeof DynamicForm> = {
  title: 'Molecules/DynamicForm',
  component: DynamicForm,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
DynamicForm is a molecule component that renders individual form fields dynamically based on configuration.

**Features:**
- Supports 10 field types: text, textarea, number, select, radio, checkbox, checkboxGroup, date, time, file
- Integrated validation with React Hook Form
- Accessibility support with ARIA attributes
- Required field indicators
- Help text and error messages
- Disabled state support

**Usage:**
\`\`\`tsx
<DynamicForm
  field={field}
  register={register}
  errors={errors}
/>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DynamicForm>;

/**
 * Text Field
 */
export const TextField: Story = {
  render: () => {
    const field: DynamicField = {
      id: 'full_name',
      type: 'text',
      label: 'Full Name',
      required: true,
      placeholder: 'Enter your full name',
      helpText: 'Please enter your first and last name',
    };
    return <DynamicFormWrapper field={field} />;
  },
};

/**
 * Textarea Field
 */
export const TextareaField: Story = {
  render: () => {
    const field: DynamicField = {
      id: 'description',
      type: 'textarea',
      label: 'Description',
      required: false,
      placeholder: 'Enter a detailed description',
      helpText: 'Maximum 500 characters',
      validation: {
        maxLength: 500,
      },
    };
    return <DynamicFormWrapper field={field} />;
  },
};

/**
 * Number Field
 */
export const NumberField: Story = {
  render: () => {
    const field: DynamicField = {
      id: 'age',
      type: 'number',
      label: 'Age',
      required: true,
      placeholder: 'Enter your age',
      helpText: 'Must be between 18 and 100',
      validation: {
        min: 18,
        max: 100,
        integer: true,
      },
    };
    return <DynamicFormWrapper field={field} />;
  },
};

/**
 * Select Field
 */
export const SelectField: Story = {
  render: () => {
    const field: DynamicField = {
      id: 'country',
      type: 'select',
      label: 'Country',
      required: true,
      placeholder: 'Select your country',
      options: [
        { value: 'us', label: 'United States' },
        { value: 'ca', label: 'Canada' },
        { value: 'mx', label: 'Mexico' },
        { value: 'uk', label: 'United Kingdom' },
        { value: 'de', label: 'Germany' },
      ],
    };
    return <DynamicFormWrapper field={field} />;
  },
};

/**
 * Radio Field
 */
export const RadioField: Story = {
  render: () => {
    const field: DynamicField = {
      id: 'subscription',
      type: 'radio',
      label: 'Subscription Plan',
      required: true,
      helpText: 'Choose your preferred plan',
      options: [
        { value: 'free', label: 'Free - $0/month' },
        { value: 'basic', label: 'Basic - $9/month' },
        { value: 'premium', label: 'Premium - $29/month' },
      ],
    };
    return <DynamicFormWrapper field={field} />;
  },
};

/**
 * Checkbox Field
 */
export const CheckboxField: Story = {
  render: () => {
    const field: DynamicField = {
      id: 'terms',
      type: 'checkbox',
      label: 'I agree to the Terms and Conditions',
      required: true,
      helpText: 'You must agree to continue',
    };
    return <DynamicFormWrapper field={field} />;
  },
};

/**
 * Checkbox Group Field
 */
export const CheckboxGroupField: Story = {
  render: () => {
    const field: DynamicField = {
      id: 'interests',
      type: 'checkboxGroup',
      label: 'Interests',
      required: false,
      helpText: 'Select all that apply',
      options: [
        { value: 'sports', label: 'Sports & Fitness' },
        { value: 'music', label: 'Music & Arts' },
        { value: 'technology', label: 'Technology' },
        { value: 'travel', label: 'Travel' },
        { value: 'reading', label: 'Reading' },
      ],
    };
    return <DynamicFormWrapper field={field} />;
  },
};

/**
 * Date Field
 */
export const DateField: Story = {
  render: () => {
    const field: DynamicField = {
      id: 'birthdate',
      type: 'date',
      label: 'Birth Date',
      required: true,
      helpText: 'Please enter your date of birth',
    };
    return <DynamicFormWrapper field={field} />;
  },
};

/**
 * Time Field
 */
export const TimeField: Story = {
  render: () => {
    const field: DynamicField = {
      id: 'appointment',
      type: 'time',
      label: 'Appointment Time',
      required: true,
      helpText: 'Select your preferred appointment time',
    };
    return <DynamicFormWrapper field={field} />;
  },
};

/**
 * File Field
 */
export const FileField: Story = {
  render: () => {
    const field: DynamicField = {
      id: 'document',
      type: 'file',
      label: 'Upload Document',
      required: false,
      helpText: 'Accepted formats: PDF, DOC, DOCX (Max 10MB)',
      validation: {
        acceptedTypes: ['.pdf', '.doc', '.docx'],
        maxSizeMB: 10,
      },
    };
    return <DynamicFormWrapper field={field} />;
  },
};

/**
 * Multiple Files
 */
export const MultipleFilesField: Story = {
  render: () => {
    const field: DynamicField = {
      id: 'photos',
      type: 'file',
      label: 'Upload Photos',
      required: false,
      helpText: 'Upload up to 5 images (PNG, JPG)',
      validation: {
        acceptedTypes: ['image/png', 'image/jpeg'],
        maxFiles: 5,
        maxSizeMB: 5,
      },
    };
    return <DynamicFormWrapper field={field} />;
  },
};

/**
 * Disabled Field
 */
export const DisabledField: Story = {
  render: () => {
    const field: DynamicField = {
      id: 'disabled_field',
      type: 'text',
      label: 'Disabled Field',
      required: false,
      placeholder: 'This field is disabled',
      helpText: 'This field cannot be edited',
    };
    return <DynamicFormWrapper field={field} disabled={true} />;
  },
};

/**
 * Field with Validation
 */
export const FieldWithValidation: Story = {
  render: () => {
    const field: DynamicField = {
      id: 'email',
      type: 'text',
      label: 'Email Address',
      required: true,
      placeholder: 'user@example.com',
      helpText: 'Must be a valid email format',
      validation: {
        pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
      },
    };
    return <DynamicFormWrapper field={field} />;
  },
};

/**
 * Complete Form Example
 */
export const CompleteFormExample: Story = {
  render: () => {
    const fields: DynamicField[] = [
      {
        id: 'name',
        type: 'text',
        label: 'Full Name',
        required: true,
        placeholder: 'John Doe',
      },
      {
        id: 'email',
        type: 'text',
        label: 'Email',
        required: true,
        placeholder: 'john@example.com',
      },
      {
        id: 'category',
        type: 'select',
        label: 'Request Category',
        required: true,
        options: [
          { value: 'technical', label: 'Technical Support' },
          { value: 'billing', label: 'Billing' },
          { value: 'general', label: 'General Inquiry' },
        ],
      },
      {
        id: 'priority',
        type: 'radio',
        label: 'Priority',
        required: true,
        options: [
          { value: 'low', label: 'Low' },
          { value: 'medium', label: 'Medium' },
          { value: 'high', label: 'High' },
        ],
      },
      {
        id: 'description',
        type: 'textarea',
        label: 'Description',
        required: true,
        placeholder: 'Describe your issue...',
      },
      {
        id: 'notify',
        type: 'checkbox',
        label: 'Send me email notifications',
        required: false,
      },
    ];

    const {
      register,
      formState: { errors },
    } = useForm();

    return (
      <div className="space-y-4 max-w-2xl">
        {fields.map((field) => (
          <DynamicForm key={field.id} field={field} register={register} errors={errors} />
        ))}
      </div>
    );
  },
};
