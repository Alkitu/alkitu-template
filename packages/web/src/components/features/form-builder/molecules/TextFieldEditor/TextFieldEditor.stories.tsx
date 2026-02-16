import type { Meta, StoryObj } from '@storybook/react';

import { TextFieldEditor } from './TextFieldEditor';
import type { FormField } from '@/components/features/form-builder/types';

const meta = {
  title: 'Form Builder/Molecules/TextFieldEditor',
  component: TextFieldEditor,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Unified editor for text, email, and phone field types with type-specific validation options and i18n support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    field: {
      description: 'Form field being edited (text, email, or phone)',
      control: { type: 'object' },
    },
    onChange: {
      description: 'Callback when field configuration changes',
      action: 'changed',
    },
    onDelete: {
      description: 'Callback when field should be deleted',
      action: 'deleted',
    },
    onDuplicate: {
      description: 'Optional callback when field should be duplicated',
      action: 'duplicated',
    },
    supportedLocales: {
      description: 'List of supported locales',
      control: { type: 'array' },
    },
    defaultLocale: {
      description: 'Default locale',
      control: { type: 'select' },
      options: ['en', 'es'],
    },
    editingLocale: {
      description: 'Current editing locale',
      control: { type: 'select' },
      options: ['en', 'es'],
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TextFieldEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// TEXT FIELD STORIES
// ============================================================================

export const TextFieldBasic: Story = {
  name: 'Text Field - Basic',
  args: {
    field: {
      id: 'text-1',
      type: 'text',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      validation: {
        required: false,
      },
    } as FormField,
    onChange: () => {},
    onDelete: () => {},
    onDuplicate: () => {},
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

export const TextFieldRequired: Story = {
  name: 'Text Field - Required',
  args: {
    field: {
      id: 'text-2',
      type: 'text',
      label: 'Company Name',
      placeholder: 'Enter company name',
      description: 'This field is required',
      validation: {
        required: true,
        errorMessage: 'Company name is required',
      },
    } as FormField,
    onChange: () => {},
    onDelete: () => {},
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

export const TextFieldWithMinLength: Story = {
  name: 'Text Field - Min Length',
  args: {
    field: {
      id: 'text-3',
      type: 'text',
      label: 'Username',
      placeholder: 'Choose a username',
      description: 'Minimum 5 characters',
      validation: {
        required: true,
        minLength: 5,
        errorMessage: 'Username must be at least 5 characters',
      },
    } as FormField,
    onChange: () => {},
    onDelete: () => {},
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

export const TextFieldWithMaxLength: Story = {
  name: 'Text Field - Max Length',
  args: {
    field: {
      id: 'text-4',
      type: 'text',
      label: 'Short Bio',
      placeholder: 'Write a short bio',
      description: 'Maximum 100 characters',
      validation: {
        maxLength: 100,
      },
    } as FormField,
    onChange: () => {},
    onDelete: () => {},
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

export const TextFieldWithPattern: Story = {
  name: 'Text Field - Pattern Validation',
  args: {
    field: {
      id: 'text-5',
      type: 'text',
      label: 'ZIP Code',
      placeholder: '12345',
      description: 'US ZIP code format (5 digits)',
      validation: {
        required: true,
        pattern: '^[0-9]{5}$',
        errorMessage: 'Please enter a valid 5-digit ZIP code',
      },
    } as FormField,
    onChange: () => {},
    onDelete: () => {},
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

export const TextFieldWithAllValidations: Story = {
  name: 'Text Field - All Validations',
  args: {
    field: {
      id: 'text-6',
      type: 'text',
      label: 'Product Code',
      placeholder: 'ABC123',
      description: '3-10 characters, alphanumeric, starts with letter',
      validation: {
        required: true,
        minLength: 3,
        maxLength: 10,
        pattern: '^[A-Z][A-Z0-9]*$',
        errorMessage: 'Invalid product code format',
      },
    } as FormField,
    onChange: () => {},
    onDelete: () => {},
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

// ============================================================================
// EMAIL FIELD STORIES
// ============================================================================

export const EmailFieldBasic: Story = {
  name: 'Email Field - Basic',
  args: {
    field: {
      id: 'email-1',
      type: 'email',
      label: 'Email Address',
      placeholder: 'you@example.com',
      validation: {
        required: true,
      },
      emailOptions: {
        showValidationIcon: true,
        validateOnBlur: true,
        allowMultiple: false,
      },
    } as FormField,
    onChange: () => {},
    onDelete: () => {},
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

export const EmailFieldWithValidationIcon: Story = {
  name: 'Email Field - With Validation Icon',
  args: {
    field: {
      id: 'email-2',
      type: 'email',
      label: 'Work Email',
      placeholder: 'work@company.com',
      description: 'Real-time email validation',
      validation: {
        required: true,
      },
      emailOptions: {
        showValidationIcon: true,
        validateOnBlur: false,
        allowMultiple: false,
      },
    } as FormField,
    onChange: () => {},
    onDelete: () => {},
    onDuplicate: () => {},
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

export const EmailFieldMultiple: Story = {
  name: 'Email Field - Multiple Emails',
  args: {
    field: {
      id: 'email-3',
      type: 'email',
      label: 'CC Recipients',
      placeholder: 'emails@example.com',
      description: 'Separate multiple emails with commas',
      validation: {
        required: false,
      },
      emailOptions: {
        showValidationIcon: false,
        validateOnBlur: true,
        allowMultiple: true,
      },
    } as FormField,
    onChange: () => {},
    onDelete: () => {},
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

// ============================================================================
// PHONE FIELD STORIES
// ============================================================================

export const PhoneFieldNationalUS: Story = {
  name: 'Phone Field - National (US)',
  args: {
    field: {
      id: 'phone-1',
      type: 'phone',
      label: 'Phone Number',
      placeholder: '(555) 123-4567',
      validation: {
        required: true,
      },
      phoneOptions: {
        format: 'national',
        defaultCountry: 'US',
        mask: '(###) ###-####',
      },
    } as FormField,
    onChange: () => {},
    onDelete: () => {},
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

export const PhoneFieldNationalES: Story = {
  name: 'Phone Field - National (Spain)',
  args: {
    field: {
      id: 'phone-2',
      type: 'phone',
      label: 'Teléfono',
      placeholder: '612 345 678',
      description: 'Formato español',
      validation: {
        required: true,
      },
      phoneOptions: {
        format: 'national',
        defaultCountry: 'ES',
        mask: '### ### ###',
      },
    } as FormField,
    onChange: () => {},
    onDelete: () => {},
    editingLocale: 'es',
    defaultLocale: 'es',
  },
};

export const PhoneFieldNationalMX: Story = {
  name: 'Phone Field - National (Mexico)',
  args: {
    field: {
      id: 'phone-3',
      type: 'phone',
      label: 'Número de teléfono',
      placeholder: '55 1234 5678',
      description: 'Formato mexicano',
      validation: {
        required: true,
      },
      phoneOptions: {
        format: 'national',
        defaultCountry: 'MX',
        mask: '## #### ####',
      },
    } as FormField,
    onChange: () => {},
    onDelete: () => {},
    editingLocale: 'es',
    defaultLocale: 'es',
  },
};

export const PhoneFieldInternational: Story = {
  name: 'Phone Field - International',
  args: {
    field: {
      id: 'phone-4',
      type: 'phone',
      label: 'International Phone',
      placeholder: '+1 555 123 4567',
      description: 'Include country code',
      validation: {
        required: true,
      },
      phoneOptions: {
        format: 'international',
        defaultCountry: 'US',
      },
    } as FormField,
    onChange: () => {},
    onDelete: () => {},
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

export const PhoneFieldCustomMask: Story = {
  name: 'Phone Field - Custom Mask',
  args: {
    field: {
      id: 'phone-5',
      type: 'phone',
      label: 'Custom Phone Format',
      placeholder: '12-3456-7890',
      description: 'Custom mask pattern',
      validation: {
        required: false,
      },
      phoneOptions: {
        format: 'custom',
        mask: '##-####-####',
      },
    } as FormField,
    onChange: () => {},
    onDelete: () => {},
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

// ============================================================================
// I18N STORIES
// ============================================================================

export const TextFieldSpanishTranslation: Story = {
  name: 'Text Field - Spanish Translation',
  args: {
    field: {
      id: 'text-i18n-1',
      type: 'text',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      description: 'Your legal name',
      i18n: {
        es: {
          label: 'Nombre completo',
          placeholder: 'Ingrese su nombre completo',
          description: 'Su nombre legal',
        },
      },
      validation: {
        required: true,
      },
    } as FormField,
    onChange: () => {},
    onDelete: () => {},
    editingLocale: 'es',
    defaultLocale: 'en',
    supportedLocales: ['en', 'es'],
  },
};

export const EmailFieldWithI18n: Story = {
  name: 'Email Field - With i18n',
  args: {
    field: {
      id: 'email-i18n-1',
      type: 'email',
      label: 'Email Address',
      placeholder: 'you@example.com',
      i18n: {
        es: {
          label: 'Correo electrónico',
          placeholder: 'tu@ejemplo.com',
          description: 'Tu dirección de correo',
        },
      },
      validation: {
        required: true,
      },
      emailOptions: {
        showValidationIcon: true,
        validateOnBlur: true,
        allowMultiple: false,
      },
    } as FormField,
    onChange: () => {},
    onDelete: () => {},
    editingLocale: 'es',
    defaultLocale: 'en',
  },
};

// ============================================================================
// EDGE CASES
// ============================================================================

export const WithoutDuplicateButton: Story = {
  name: 'Without Duplicate Button',
  args: {
    field: {
      id: 'text-no-dup',
      type: 'text',
      label: 'Text Field',
      placeholder: 'Enter text',
      validation: {
        required: false,
      },
    } as FormField,
    onChange: () => {},
    onDelete: () => {},
    onDuplicate: undefined,
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

export const MinimalConfiguration: Story = {
  name: 'Minimal Configuration',
  args: {
    field: {
      id: 'minimal',
      type: 'text',
      label: 'Field',
    } as FormField,
    onChange: () => {},
    onDelete: () => {},
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

// ============================================================================
// INTERACTIVE PLAYGROUND
// ============================================================================

export const InteractivePlayground: Story = {
  name: 'Interactive Playground',
  args: {
    field: {
      id: 'playground',
      type: 'text',
      label: 'Interactive Field',
      placeholder: 'Type here...',
      description: 'This is a playground for testing',
      validation: {
        required: false,
        minLength: 3,
        maxLength: 50,
      },
    } as FormField,
    onChange: () => {},
    onDelete: () => {},
    onDuplicate: () => {},
    supportedLocales: ['en', 'es'],
    defaultLocale: 'en',
    editingLocale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story: 'Use this story to interactively test all features of the TextFieldEditor.',
      },
    },
  },
};
