import type { Meta, StoryObj } from '@storybook/react';

import { RadioFieldEditor } from './RadioFieldEditor';
import type { FormField } from '@/components/features/form-builder/types';

const meta = {
  title: 'Form Builder/Molecules/RadioFieldEditor',
  component: RadioFieldEditor,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Radio field editor molecule for managing radio button fields with options, layout selection, and i18n support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    field: {
      description: 'Form field object (must be type "radio")',
      control: { type: 'object' },
    },
    onChange: {
      description: 'Callback when field changes',
      action: 'onChange',
    },
    onDelete: {
      description: 'Callback when field should be deleted',
      action: 'onDelete',
    },
    onDuplicate: {
      description: 'Callback when field should be duplicated',
      action: 'onDuplicate',
    },
    editingLocale: {
      description: 'Current editing locale',
      control: { type: 'select' },
      options: ['en', 'es'],
    },
    defaultLocale: {
      description: 'Default form locale',
      control: { type: 'select' },
      options: ['en', 'es'],
    },
  },
  args: {
    onChange: () => {},
    onDelete: () => {},
    onDuplicate: () => {},
    defaultLocale: 'en',
    editingLocale: 'en',
  },
} satisfies Meta<typeof RadioFieldEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

// Base field factory
const createRadioField = (overrides?: Partial<FormField>): FormField => ({
  id: 'field-radio-1',
  type: 'radio',
  label: 'Favorite Color',
  required: false,
  radioOptions: {
    items: [
      { id: 'opt-1', label: 'Red', value: 'red' },
      { id: 'opt-2', label: 'Blue', value: 'blue' },
      { id: 'opt-3', label: 'Green', value: 'green' },
    ],
    layout: 'vertical',
  },
  ...overrides,
});

/**
 * Basic radio field editor with vertical layout (default).
 * Shows standard radio options management with add, edit, and delete capabilities.
 */
export const BasicVertical: Story = {
  args: {
    field: createRadioField(),
  },
};

/**
 * Radio field with horizontal layout.
 * Demonstrates how radio options can be displayed horizontally.
 */
export const HorizontalLayout: Story = {
  args: {
    field: createRadioField({
      label: 'Select Size',
      radioOptions: {
        items: [
          { id: 'opt-1', label: 'Small', value: 'S' },
          { id: 'opt-2', label: 'Medium', value: 'M' },
          { id: 'opt-3', label: 'Large', value: 'L' },
          { id: 'opt-4', label: 'Extra Large', value: 'XL' },
        ],
        layout: 'horizontal',
      },
    }),
  },
};

/**
 * Radio field with a pre-selected default value.
 * The "Medium" option is set as the default selection.
 */
export const WithDefaultValue: Story = {
  args: {
    field: createRadioField({
      label: 'Shipping Method',
      radioOptions: {
        items: [
          { id: 'opt-1', label: 'Standard (5-7 days)', value: 'standard' },
          { id: 'opt-2', label: 'Express (2-3 days)', value: 'express' },
          { id: 'opt-3', label: 'Overnight', value: 'overnight' },
        ],
        layout: 'vertical',
        defaultValue: 'express',
      },
    }),
  },
};

/**
 * Radio field with many options (5+).
 * Demonstrates handling of larger option sets with scrolling.
 */
export const ManyOptions: Story = {
  args: {
    field: createRadioField({
      label: 'Select Your Country',
      radioOptions: {
        items: [
          { id: 'opt-1', label: 'United States', value: 'US' },
          { id: 'opt-2', label: 'Canada', value: 'CA' },
          { id: 'opt-3', label: 'United Kingdom', value: 'UK' },
          { id: 'opt-4', label: 'Germany', value: 'DE' },
          { id: 'opt-5', label: 'France', value: 'FR' },
          { id: 'opt-6', label: 'Spain', value: 'ES' },
          { id: 'opt-7', label: 'Italy', value: 'IT' },
          { id: 'opt-8', label: 'Australia', value: 'AU' },
        ],
        layout: 'vertical',
      },
    }),
  },
};

/**
 * Radio field with internationalization support.
 * Shows Spanish translations for field label and options.
 */
export const WithI18n: Story = {
  args: {
    field: createRadioField({
      label: 'Favorite Color',
      i18n: {
        es: {
          label: 'Color Favorito',
          options: {
            'opt-1': 'Rojo',
            'opt-2': 'Azul',
            'opt-3': 'Verde',
          },
        },
      },
    }),
    editingLocale: 'es',
    defaultLocale: 'en',
  },
};

/**
 * Required radio field with description.
 * Demonstrates validation requirement and help text.
 */
export const RequiredWithDescription: Story = {
  args: {
    field: createRadioField({
      label: 'Agreement Type',
      description: 'Please select the type of agreement you wish to create.',
      showDescription: true,
      validation: {
        required: true,
      },
      radioOptions: {
        items: [
          { id: 'opt-1', label: 'Standard Agreement', value: 'standard' },
          { id: 'opt-2', label: 'Premium Agreement', value: 'premium' },
          { id: 'opt-3', label: 'Enterprise Agreement', value: 'enterprise' },
        ],
        layout: 'vertical',
      },
    }),
  },
};

/**
 * Minimal radio field with only two options.
 * Shows the minimum viable radio field configuration.
 */
export const MinimalTwoOptions: Story = {
  args: {
    field: createRadioField({
      label: 'Subscribe to Newsletter?',
      radioOptions: {
        items: [
          { id: 'opt-1', label: 'Yes', value: 'yes' },
          { id: 'opt-2', label: 'No', value: 'no' },
        ],
        layout: 'horizontal',
      },
    }),
  },
};

/**
 * Radio field in translation mode (non-default locale).
 * Shows how the editor behaves when editing translations.
 * Only labels can be edited, structural changes are disabled.
 */
export const TranslationMode: Story = {
  args: {
    field: createRadioField({
      label: 'Payment Method',
      radioOptions: {
        items: [
          { id: 'opt-1', label: 'Credit Card', value: 'credit' },
          { id: 'opt-2', label: 'PayPal', value: 'paypal' },
          { id: 'opt-3', label: 'Bank Transfer', value: 'bank' },
        ],
        layout: 'vertical',
      },
      i18n: {
        es: {
          label: 'Método de Pago',
          options: {
            'opt-1': 'Tarjeta de Crédito',
            'opt-2': 'PayPal',
            'opt-3': 'Transferencia Bancaria',
          },
        },
      },
    }),
    editingLocale: 'es',
    defaultLocale: 'en',
  },
};
