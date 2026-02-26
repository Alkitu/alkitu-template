import type { Meta, StoryObj } from '@storybook/react';
import { SelectFieldEditor } from './SelectFieldEditor';
import type { FormField, FormFieldOption } from '@/components/features/form-builder/types';

const meta = {
  title: 'Form Builder/Molecules/SelectFieldEditor',
  component: SelectFieldEditor,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
SelectFieldEditor molecule for editing select dropdown field types.

## Features
- Label and description editing with i18n support
- Required field toggle
- Placeholder text configuration (i18n)
- Options management (add, edit, delete, duplicate)
- Default value selection
- Allow clear option toggle
- Duplicate value validation
- Empty state handling
- Translation mode for non-default locales

## Usage
\`\`\`tsx
<SelectFieldEditor
  field={selectField}
  onChange={handleChange}
  onDelete={handleDelete}
  editingLocale="en"
  defaultLocale="en"
/>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    field: {
      description: 'Form field object (must be type "select")',
      control: 'object',
    },
    onChange: {
      description: 'Callback when field configuration changes',
      action: 'field changed',
    },
    onDelete: {
      description: 'Callback when field should be deleted',
      action: 'field deleted',
    },
    onDuplicate: {
      description: 'Optional callback when field should be duplicated',
      action: 'field duplicated',
    },
    editingLocale: {
      description: 'Current editing locale',
      control: 'select',
      options: ['en', 'es'],
    },
    defaultLocale: {
      description: 'Default locale for the form',
      control: 'select',
      options: ['en', 'es'],
    },
    supportedLocales: {
      description: 'List of supported locales',
      control: 'object',
    },
  },
  args: {
    onChange: () => {},
    onDelete: () => {},
    onDuplicate: () => {},
    editingLocale: 'en',
    defaultLocale: 'en',
    supportedLocales: ['en', 'es'],
  },
} satisfies Meta<typeof SelectFieldEditor>;

export default meta;
type Story = Omit<StoryObj<typeof meta>, 'args'> & Partial<Pick<StoryObj<typeof meta>, 'args'>>;

// Helper function to create mock options
const createOptions = (count: number): FormFieldOption[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `opt-${i + 1}`,
    label: `Option ${i + 1}`,
    value: `option-${i + 1}`,
  }));
};

// Basic Stories
export const Default: Story = {
  args: {
    field: {
      id: 'field-1',
      type: 'select',
      label: 'Favorite Color',
      validation: { required: false },
      selectOptions: {
        items: createOptions(3),
        placeholder: 'Select a color...',
        allowClear: false,
      },
    },
  },
};

export const WithFewOptions: Story = {
  name: 'With Few Options (3)',
  args: {
    field: {
      id: 'field-2',
      type: 'select',
      label: 'Size',
      validation: { required: false },
      selectOptions: {
        items: [
          { id: 'opt-1', label: 'Small', value: 'small' },
          { id: 'opt-2', label: 'Medium', value: 'medium' },
          { id: 'opt-3', label: 'Large', value: 'large' },
        ],
        placeholder: 'Select a size...',
      },
    },
  },
};

export const WithManyOptions: Story = {
  name: 'With Many Options (10)',
  args: {
    field: {
      id: 'field-3',
      type: 'select',
      label: 'Country',
      validation: { required: true },
      selectOptions: {
        items: [
          { id: 'opt-1', label: 'United States', value: 'us' },
          { id: 'opt-2', label: 'Canada', value: 'ca' },
          { id: 'opt-3', label: 'Mexico', value: 'mx' },
          { id: 'opt-4', label: 'United Kingdom', value: 'uk' },
          { id: 'opt-5', label: 'France', value: 'fr' },
          { id: 'opt-6', label: 'Germany', value: 'de' },
          { id: 'opt-7', label: 'Spain', value: 'es' },
          { id: 'opt-8', label: 'Italy', value: 'it' },
          { id: 'opt-9', label: 'Japan', value: 'jp' },
          { id: 'opt-10', label: 'Australia', value: 'au' },
        ],
        placeholder: 'Select your country...',
        allowClear: true,
      },
    },
  },
};

export const WithDefaultValue: Story = {
  name: 'With Default Value Selected',
  args: {
    field: {
      id: 'field-4',
      type: 'select',
      label: 'Priority',
      validation: { required: true },
      selectOptions: {
        items: [
          { id: 'opt-1', label: 'Low', value: 'low' },
          { id: 'opt-2', label: 'Medium', value: 'medium' },
          { id: 'opt-3', label: 'High', value: 'high' },
        ],
        placeholder: 'Select priority...',
        defaultValue: 'medium',
      },
    },
  },
};

export const EmptyState: Story = {
  name: 'Empty State (No Options)',
  args: {
    field: {
      id: 'field-5',
      type: 'select',
      label: 'Empty Select',
      validation: { required: false },
      selectOptions: {
        items: [],
        placeholder: 'Select an option...',
      },
    },
  },
};

export const Required: Story = {
  name: 'Required Field',
  args: {
    field: {
      id: 'field-6',
      type: 'select',
      label: 'Required Select',
      validation: { required: true },
      selectOptions: {
        items: createOptions(4),
        placeholder: 'Please select...',
      },
    },
  },
};

export const WithAllowClear: Story = {
  name: 'With Allow Clear',
  args: {
    field: {
      id: 'field-7',
      type: 'select',
      label: 'Optional Select',
      validation: { required: false },
      selectOptions: {
        items: createOptions(5),
        placeholder: 'Select an option...',
        allowClear: true,
      },
    },
  },
};

export const WithDescription: Story = {
  name: 'With Description',
  args: {
    field: {
      id: 'field-8',
      type: 'select',
      label: 'Industry',
      description: 'Select the industry that best describes your business',
      showDescription: true,
      validation: { required: true },
      selectOptions: {
        items: [
          { id: 'opt-1', label: 'Technology', value: 'tech' },
          { id: 'opt-2', label: 'Healthcare', value: 'healthcare' },
          { id: 'opt-3', label: 'Finance', value: 'finance' },
          { id: 'opt-4', label: 'Education', value: 'education' },
          { id: 'opt-5', label: 'Other', value: 'other' },
        ],
        placeholder: 'Select industry...',
      },
    },
  },
};

export const DuplicateValues: Story = {
  name: 'With Duplicate Values (Error State)',
  args: {
    field: {
      id: 'field-9',
      type: 'select',
      label: 'Select with Duplicates',
      validation: { required: false },
      selectOptions: {
        items: [
          { id: 'opt-1', label: 'Option 1', value: 'duplicate' },
          { id: 'opt-2', label: 'Option 2', value: 'duplicate' },
          { id: 'opt-3', label: 'Option 3', value: 'unique' },
        ],
        placeholder: 'Select an option...',
      },
    },
  },
};

// Translation Stories
export const SpanishTranslation: Story = {
  name: 'Spanish Translation (es)',
  args: {
    field: {
      id: 'field-10',
      type: 'select',
      label: 'Favorite Color',
      validation: { required: true },
      selectOptions: {
        items: [
          { id: 'opt-1', label: 'Red', value: 'red' },
          { id: 'opt-2', label: 'Blue', value: 'blue' },
          { id: 'opt-3', label: 'Green', value: 'green' },
        ],
        placeholder: 'Select a color...',
      },
      i18n: {
        es: {
          label: 'Color Favorito',
          placeholder: 'Seleccione un color...',
          options: {
            'opt-1': 'Rojo',
            'opt-2': 'Azul',
            'opt-3': 'Verde',
          },
        },
      },
    },
    editingLocale: 'es',
    defaultLocale: 'en',
  },
};

export const TranslationMode: Story = {
  name: 'Translation Mode (Editing Spanish)',
  args: {
    field: {
      id: 'field-11',
      type: 'select',
      label: 'Department',
      validation: { required: true },
      selectOptions: {
        items: [
          { id: 'opt-1', label: 'Sales', value: 'sales' },
          { id: 'opt-2', label: 'Marketing', value: 'marketing' },
          { id: 'opt-3', label: 'Engineering', value: 'engineering' },
          { id: 'opt-4', label: 'Support', value: 'support' },
        ],
        placeholder: 'Select department...',
      },
      i18n: {
        es: {
          label: 'Departamento',
          placeholder: 'Seleccione departamento...',
          options: {
            'opt-1': 'Ventas',
            'opt-2': 'Mercadeo',
          },
        },
      },
    },
    editingLocale: 'es',
    defaultLocale: 'en',
  },
};

export const PartialTranslation: Story = {
  name: 'Partial Translation (Some Options Missing)',
  args: {
    field: {
      id: 'field-12',
      type: 'select',
      label: 'Status',
      selectOptions: {
        items: [
          { id: 'opt-1', label: 'Active', value: 'active' },
          { id: 'opt-2', label: 'Inactive', value: 'inactive' },
          { id: 'opt-3', label: 'Pending', value: 'pending' },
        ],
        placeholder: 'Select status...',
      },
      i18n: {
        es: {
          label: 'Estado',
          options: {
            'opt-1': 'Activo',
            // opt-2 and opt-3 not translated
          },
        },
      },
    },
    editingLocale: 'es',
    defaultLocale: 'en',
  },
};

// Interactive States
export const Interactive: Story = {
  name: 'Interactive Demo',
  args: {
    field: {
      id: 'field-13',
      type: 'select',
      label: 'Interactive Select Field',
      description: 'Try adding, editing, and removing options!',
      showDescription: true,
      validation: { required: false },
      selectOptions: {
        items: [
          { id: 'opt-1', label: 'Option 1', value: 'option-1' },
          { id: 'opt-2', label: 'Option 2', value: 'option-2' },
        ],
        placeholder: 'Select an option...',
        allowClear: true,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive demo story. Try adding new options, editing labels/values, duplicating options, and changing settings.',
      },
    },
  },
};

// Edge Cases
export const LongLabelsAndValues: Story = {
  name: 'Long Labels and Values',
  args: {
    field: {
      id: 'field-14',
      type: 'select',
      label: 'This is a very long field label that might wrap to multiple lines',
      description:
        'This is also a very long description that explains the purpose of this select field in great detail',
      showDescription: true,
      selectOptions: {
        items: [
          {
            id: 'opt-1',
            label: 'This is a very long option label that might wrap',
            value: 'very-long-option-value-that-might-overflow',
          },
          {
            id: 'opt-2',
            label: 'Short',
            value: 'short',
          },
        ],
        placeholder: 'This is a very long placeholder text for the select field...',
      },
    },
  },
};

export const SpecialCharacters: Story = {
  name: 'With Special Characters',
  args: {
    field: {
      id: 'field-15',
      type: 'select',
      label: 'Language (語言)',
      selectOptions: {
        items: [
          { id: 'opt-1', label: 'English (英語)', value: 'en' },
          { id: 'opt-2', label: 'Español (西班牙語)', value: 'es' },
          { id: 'opt-3', label: '中文', value: 'zh' },
          { id: 'opt-4', label: '日本語', value: 'ja' },
          { id: 'opt-5', label: 'Français (法語)', value: 'fr' },
        ],
        placeholder: 'Select language / 選擇語言...',
      },
    },
  },
};

export const EmptyValues: Story = {
  name: 'Options with Empty Values',
  args: {
    field: {
      id: 'field-16',
      type: 'select',
      label: 'Select with Empty Values',
      selectOptions: {
        items: [
          { id: 'opt-1', label: 'Valid Option', value: 'valid' },
          { id: 'opt-2', label: 'Empty Value', value: '' },
          { id: 'opt-3', label: 'Whitespace Value', value: '   ' },
        ],
        placeholder: 'Select an option...',
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Options with empty or whitespace-only values are not shown in the default value selector.',
      },
    },
  },
};

// Dark Mode
export const DarkMode: Story = {
  name: 'Dark Mode',
  args: {
    field: {
      id: 'field-17',
      type: 'select',
      label: 'Dark Mode Select',
      description: 'This select field looks great in dark mode!',
      showDescription: true,
      validation: { required: true },
      selectOptions: {
        items: createOptions(5),
        placeholder: 'Select an option...',
        allowClear: true,
        defaultValue: 'option-2',
      },
    },
  },
  parameters: {
    backgrounds: { default: 'dark' },
    theme: 'dark',
  },
};

// Playground
export const Playground: Story = {
  name: 'Playground',
  args: {
    field: {
      id: 'field-playground',
      type: 'select',
      label: 'Playground Select Field',
      description: 'Customize all properties using the controls panel',
      showDescription: true,
      validation: { required: false },
      selectOptions: {
        items: createOptions(4),
        placeholder: 'Select an option...',
        allowClear: false,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Use the controls panel to experiment with all available props.',
      },
    },
  },
};
