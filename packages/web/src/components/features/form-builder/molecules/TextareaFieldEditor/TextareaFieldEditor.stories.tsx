import type { Meta, StoryObj } from '@storybook/react';

import { TextareaFieldEditor } from './TextareaFieldEditor';
import type { FormField } from '@alkitu/shared';

const meta: Meta<typeof TextareaFieldEditor> = {
  title: 'Form Builder/Molecules/TextareaFieldEditor',
  component: TextareaFieldEditor,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Editor component for configuring textarea form fields. Supports rows, resize modes, character counting, auto-grow, validation, and i18n.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    field: {
      description: 'The textarea field being edited',
      control: { type: 'object' },
    },
    onChange: {
      description: 'Callback when field configuration changes',
      action: 'changed',
    },
    onDelete: {
      description: 'Callback to delete this field',
      action: 'deleted',
    },
    onDuplicate: {
      description: 'Optional callback to duplicate this field',
      action: 'duplicated',
    },
    editingLocale: {
      description: 'Current locale being edited',
      control: { type: 'select' },
      options: ['en', 'es'],
    },
    defaultLocale: {
      description: 'Default locale for the form',
      control: { type: 'select' },
      options: ['en', 'es'],
    },
  },
  args: {
    onChange: () => {},
    onDelete: () => {},
    onDuplicate: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof TextareaFieldEditor>;

const createTextareaField = (overrides?: Partial<FormField>): FormField => ({
  id: 'textarea-1',
  type: 'textarea',
  label: 'Comments',
  placeholder: 'Enter your comments here',
  description: 'Please provide detailed feedback',
  showTitle: true,
  showDescription: true,
  validation: {
    required: false,
  },
  textareaOptions: {
    rows: 4,
    resize: 'vertical',
    showCharacterCount: false,
    autoGrow: false,
  },
  ...overrides,
});

/**
 * Basic textarea field editor with default configuration
 */
export const Basic: Story = {
  args: {
    field: createTextareaField(),
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

/**
 * Textarea with character counter enabled and maxLength validation
 */
export const WithCharacterCounter: Story = {
  args: {
    field: createTextareaField({
      textareaOptions: {
        rows: 4,
        resize: 'vertical',
        showCharacterCount: true,
        autoGrow: false,
      },
      validation: {
        required: true,
        maxLength: 500,
      },
    }),
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

/**
 * Textarea with min/max length validation
 */
export const WithLengthValidation: Story = {
  args: {
    field: createTextareaField({
      label: 'Product Description',
      placeholder: 'Describe the product in detail',
      validation: {
        required: true,
        minLength: 50,
        maxLength: 1000,
      },
      textareaOptions: {
        rows: 6,
        resize: 'vertical',
        showCharacterCount: true,
        autoGrow: false,
      },
    }),
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

/**
 * Textarea with auto-grow enabled
 */
export const WithAutoGrow: Story = {
  args: {
    field: createTextareaField({
      label: 'Expandable Text Area',
      placeholder: 'This textarea will grow as you type',
      textareaOptions: {
        rows: 3,
        minRows: 3,
        maxRows: 10,
        resize: 'none',
        autoGrow: true,
        showCharacterCount: false,
      },
    }),
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

/**
 * Textarea with resize mode set to "both"
 */
export const ResizeBoth: Story = {
  args: {
    field: createTextareaField({
      label: 'Flexible Textarea',
      placeholder: 'You can resize this textarea in any direction',
      textareaOptions: {
        rows: 5,
        resize: 'both',
        showCharacterCount: false,
        autoGrow: false,
      },
    }),
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

/**
 * Textarea with resize disabled
 */
export const NoResize: Story = {
  args: {
    field: createTextareaField({
      label: 'Fixed Size Textarea',
      placeholder: 'This textarea cannot be resized',
      textareaOptions: {
        rows: 4,
        resize: 'none',
        showCharacterCount: false,
        autoGrow: false,
      },
    }),
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

/**
 * Large textarea with many rows
 */
export const LargeTextarea: Story = {
  args: {
    field: createTextareaField({
      label: 'Large Text Area',
      placeholder: 'This is a large textarea for long-form content',
      description: 'Use this for essays, articles, or lengthy feedback',
      textareaOptions: {
        rows: 10,
        minRows: 8,
        maxRows: 20,
        resize: 'vertical',
        showCharacterCount: true,
        autoGrow: false,
      },
      validation: {
        required: true,
        maxLength: 5000,
      },
    }),
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

/**
 * Required textarea with custom error message
 */
export const RequiredWithCustomError: Story = {
  args: {
    field: createTextareaField({
      label: 'Required Feedback',
      placeholder: 'Your feedback is important to us',
      validation: {
        required: true,
        minLength: 20,
        errorMessage: 'Please provide at least 20 characters of feedback',
      },
      textareaOptions: {
        rows: 5,
        resize: 'vertical',
        showCharacterCount: true,
        autoGrow: false,
      },
    }),
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

/**
 * Textarea with pattern validation (regex)
 */
export const WithPatternValidation: Story = {
  args: {
    field: createTextareaField({
      label: 'Alphabetic Only',
      placeholder: 'Enter only letters and spaces',
      validation: {
        required: false,
        pattern: '^[A-Za-z\\s]+$',
        errorMessage: 'Only letters and spaces are allowed',
      },
      textareaOptions: {
        rows: 4,
        resize: 'vertical',
        showCharacterCount: false,
        autoGrow: false,
      },
    }),
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

/**
 * i18n example - Spanish locale
 */
export const SpanishLocale: Story = {
  args: {
    field: createTextareaField({
      label: 'Comments',
      placeholder: 'Enter your comments',
      description: 'Please provide detailed feedback',
      i18n: {
        es: {
          label: 'Comentarios',
          placeholder: 'Ingrese sus comentarios',
          description: 'Por favor proporcione comentarios detallados',
        },
      },
      textareaOptions: {
        rows: 4,
        resize: 'vertical',
        showCharacterCount: true,
        autoGrow: false,
      },
      validation: {
        required: true,
        maxLength: 500,
      },
    }),
    editingLocale: 'es',
    defaultLocale: 'en',
  },
};

/**
 * Without duplicate button
 */
export const NoDuplicateButton: Story = {
  args: {
    field: createTextareaField(),
    editingLocale: 'en',
    defaultLocale: 'en',
    onDuplicate: undefined,
  },
};

/**
 * Minimal configuration
 */
export const Minimal: Story = {
  args: {
    field: createTextareaField({
      label: 'Simple Textarea',
      placeholder: '',
      description: '',
      showDescription: false,
      textareaOptions: {
        rows: 3,
        resize: 'vertical',
        showCharacterCount: false,
        autoGrow: false,
      },
      validation: {
        required: false,
      },
    }),
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

/**
 * Full-featured configuration
 */
export const FullFeatured: Story = {
  args: {
    field: createTextareaField({
      label: 'Full-Featured Textarea',
      placeholder: 'Enter comprehensive details',
      description: 'This textarea has all features enabled',
      showDescription: true,
      textareaOptions: {
        rows: 6,
        minRows: 4,
        maxRows: 15,
        resize: 'vertical',
        showCharacterCount: true,
        autoGrow: true,
      },
      validation: {
        required: true,
        minLength: 100,
        maxLength: 2000,
        pattern: '^[A-Za-z0-9\\s.,!?-]+$',
        errorMessage: 'Please provide detailed information between 100-2000 characters',
      },
    }),
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

/**
 * Editing non-default locale (structural changes disabled)
 */
export const EditingNonDefaultLocale: Story = {
  args: {
    field: createTextareaField({
      label: 'Comments',
      placeholder: 'Enter comments',
      i18n: {
        es: {
          label: 'Comentarios',
          placeholder: 'Ingrese comentarios',
        },
      },
    }),
    editingLocale: 'es',
    defaultLocale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story:
          'When editing a non-default locale, structural changes (like required, rows, validation) are disabled. Only text translations can be edited.',
      },
    },
  },
};
