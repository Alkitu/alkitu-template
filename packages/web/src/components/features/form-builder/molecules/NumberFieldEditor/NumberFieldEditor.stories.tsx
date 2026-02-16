import type { Meta, StoryObj } from '@storybook/react';
import { NumberFieldEditor } from './NumberFieldEditor';
import type { FormField } from '@/components/features/form-builder/types';

/**
 * NumberFieldEditor component for editing number-based form fields.
 *
 * Supports:
 * - Basic number input with validation
 * - Currency formatting (USD, EUR, GBP, MXN, JPY)
 * - Percentage display
 * - Min/max constraints
 * - Step increments
 * - Decimal places
 * - Thousands separators
 * - Custom prefix/suffix
 * - i18n support
 */
const meta = {
  title: 'Features/Form Builder/Molecules/NumberFieldEditor',
  component: NumberFieldEditor,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Comprehensive number field editor with support for basic numbers, currency, and percentages. Includes validation, formatting options, and internationalization.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    field: {
      description: 'Form field configuration object',
      control: 'object',
    },
    onChange: {
      description: 'Callback when field configuration changes',
    },
    onDelete: {
      description: 'Callback when field should be deleted',
    },
    onDuplicate: {
      description: 'Optional callback when field should be duplicated',
    },
    supportedLocales: {
      description: 'List of supported locales',
      control: 'object',
    },
    defaultLocale: {
      description: 'Default locale for the form',
      control: 'select',
      options: ['en', 'es'],
    },
    editingLocale: {
      description: 'Current editing locale',
      control: 'select',
      options: ['en', 'es'],
    },
  },
  args: {
    onChange: () => {},
    onDelete: () => {},
    onDuplicate: () => {},
  },
} satisfies Meta<typeof NumberFieldEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// BASIC NUMBER FIELD STORIES
// ============================================================================

const createBasicNumberField = (overrides?: Partial<FormField>): FormField => ({
  id: 'number-field-1',
  type: 'number',
  label: 'Quantity',
  placeholder: 'Enter quantity',
  description: 'Number of items',
  validation: {
    required: false,
    min: 0,
    max: 1000,
  },
  numberOptions: {
    step: 1,
  },
  ...overrides,
});

export const BasicNumber: Story = {
  args: {
    field: createBasicNumberField(),
  },
};

export const WithStepIncrement: Story = {
  args: {
    field: createBasicNumberField({
      label: 'Quantity (Step: 5)',
      numberOptions: {
        step: 5,
      },
    }),
  },
};

export const WithDecimals: Story = {
  args: {
    field: createBasicNumberField({
      label: 'Measurement',
      placeholder: '0.00',
      numberOptions: {
        step: 0.1,
        decimals: 2,
      },
    }),
  },
};

export const WithThousandsSeparator: Story = {
  args: {
    field: createBasicNumberField({
      label: 'Large Number',
      placeholder: '1,000,000',
      numberOptions: {
        thousandsSeparator: true,
        decimals: 0,
      },
    }),
  },
};

// ============================================================================
// CURRENCY FIELD STORIES
// ============================================================================

export const CurrencyUSD: Story = {
  args: {
    field: createBasicNumberField({
      label: 'Price (USD)',
      placeholder: '$0.00',
      description: 'Enter price in US Dollars',
      validation: {
        required: true,
        min: 0,
        max: 10000,
      },
      numberOptions: {
        displayType: 'currency',
        currencyCode: 'USD',
        decimals: 2,
        thousandsSeparator: true,
        step: 0.01,
      },
    }),
  },
};

export const CurrencyEUR: Story = {
  args: {
    field: createBasicNumberField({
      label: 'Price (EUR)',
      placeholder: '0,00€',
      description: 'Enter price in Euros',
      numberOptions: {
        displayType: 'currency',
        currencyCode: 'EUR',
        decimals: 2,
        thousandsSeparator: true,
        step: 0.01,
      },
    }),
  },
};

export const CurrencyGBP: Story = {
  args: {
    field: createBasicNumberField({
      label: 'Price (GBP)',
      placeholder: '£0.00',
      description: 'Enter price in British Pounds',
      numberOptions: {
        displayType: 'currency',
        currencyCode: 'GBP',
        decimals: 2,
        thousandsSeparator: true,
        step: 0.01,
      },
    }),
  },
};

export const CurrencyJPY: Story = {
  args: {
    field: createBasicNumberField({
      label: 'Price (JPY)',
      placeholder: '¥0',
      description: 'Enter price in Japanese Yen (no decimals)',
      numberOptions: {
        displayType: 'currency',
        currencyCode: 'JPY',
        decimals: 0,
        thousandsSeparator: true,
        step: 1,
      },
    }),
  },
};

// ============================================================================
// PERCENTAGE FIELD STORIES
// ============================================================================

export const PercentageBasic: Story = {
  args: {
    field: createBasicNumberField({
      label: 'Discount Percentage',
      placeholder: '0%',
      description: 'Enter discount percentage',
      validation: {
        required: true,
        min: 0,
        max: 100,
      },
      numberOptions: {
        displayType: 'percentage',
        decimals: 1,
        step: 0.1,
      },
    }),
  },
};

export const PercentageWithDecimals: Story = {
  args: {
    field: createBasicNumberField({
      label: 'Interest Rate',
      placeholder: '0.00%',
      description: 'Annual interest rate',
      validation: {
        min: 0,
        max: 25,
      },
      numberOptions: {
        displayType: 'percentage',
        decimals: 2,
        step: 0.01,
      },
    }),
  },
};

// ============================================================================
// VALIDATION STORIES
// ============================================================================

export const WithMinimumConstraint: Story = {
  args: {
    field: createBasicNumberField({
      label: 'Minimum Age',
      description: 'Must be at least 18',
      validation: {
        required: true,
        min: 18,
      },
    }),
  },
};

export const WithMaximumConstraint: Story = {
  args: {
    field: createBasicNumberField({
      label: 'Maximum Quantity',
      description: 'Cannot exceed 100',
      validation: {
        required: true,
        max: 100,
      },
    }),
  },
};

export const WithRangeConstraints: Story = {
  args: {
    field: createBasicNumberField({
      label: 'Temperature (°C)',
      description: 'Must be between -50 and 50',
      validation: {
        required: true,
        min: -50,
        max: 50,
        errorMessage: 'Temperature must be between -50°C and 50°C',
      },
      numberOptions: {
        allowNegative: true,
        decimals: 1,
      },
    }),
  },
};

// ============================================================================
// CUSTOM PREFIX/SUFFIX STORIES
// ============================================================================

export const WithCustomPrefix: Story = {
  args: {
    field: createBasicNumberField({
      label: 'Item ID',
      placeholder: '#0',
      description: 'Enter item number',
      numberOptions: {
        prefix: '#',
        decimals: 0,
      },
    }),
  },
};

export const WithCustomSuffix: Story = {
  args: {
    field: createBasicNumberField({
      label: 'Weight',
      placeholder: '0 kg',
      description: 'Enter weight in kilograms',
      numberOptions: {
        suffix: 'kg',
        decimals: 2,
      },
    }),
  },
};

export const WithPrefixAndSuffix: Story = {
  args: {
    field: createBasicNumberField({
      label: 'Temperature',
      placeholder: '~0°C',
      description: 'Approximate temperature',
      numberOptions: {
        prefix: '~',
        suffix: '°C',
        decimals: 1,
      },
    }),
  },
};

// ============================================================================
// STATE STORIES
// ============================================================================

export const RequiredField: Story = {
  args: {
    field: createBasicNumberField({
      label: 'Required Number',
      validation: {
        required: true,
        min: 0,
      },
    }),
  },
};

export const DisabledState: Story = {
  args: {
    field: createBasicNumberField({
      label: 'Disabled Number Field',
      description: 'This field is disabled',
    }),
    editingLocale: 'es',
    defaultLocale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story: 'When editing a non-default locale, technical settings are disabled.',
      },
    },
  },
};

export const WithoutDuplicateButton: Story = {
  args: {
    field: createBasicNumberField(),
    onDuplicate: undefined,
  },
  parameters: {
    docs: {
      description: {
        story: 'Number field editor without the duplicate button.',
      },
    },
  },
};

// ============================================================================
// INTERNATIONALIZATION STORIES
// ============================================================================

export const DefaultLocale: Story = {
  args: {
    field: createBasicNumberField(),
    editingLocale: 'en',
    defaultLocale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story: 'Editing the default locale (English) allows modification of all settings.',
      },
    },
  },
};

export const SpanishTranslation: Story = {
  args: {
    field: createBasicNumberField({
      i18n: {
        es: {
          label: 'Cantidad',
          placeholder: 'Ingrese cantidad',
          description: 'Número de artículos',
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
          'Editing Spanish translations. Technical settings are disabled when not editing default locale.',
      },
    },
  },
};

export const MultilingualSupport: Story = {
  args: {
    field: createBasicNumberField({
      i18n: {
        es: {
          label: 'Precio',
          placeholder: '$0.00',
          description: 'Ingrese el precio en dólares',
        },
      },
      numberOptions: {
        displayType: 'currency',
        currencyCode: 'USD',
        decimals: 2,
      },
    }),
    supportedLocales: ['en', 'es'],
    defaultLocale: 'en',
    editingLocale: 'en',
  },
};

// ============================================================================
// DARK MODE STORIES
// ============================================================================

export const DarkMode: Story = {
  args: {
    field: createBasicNumberField({
      numberOptions: {
        displayType: 'currency',
        currencyCode: 'USD',
        decimals: 2,
        thousandsSeparator: true,
      },
    }),
  },
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'Number field editor in dark mode with currency display.',
      },
    },
  },
};

// ============================================================================
// COMPLEX SCENARIOS
// ============================================================================

export const ComplexCurrencyConfiguration: Story = {
  args: {
    field: createBasicNumberField({
      label: 'Product Price',
      placeholder: '$0.00',
      description: 'Base price before tax',
      validation: {
        required: true,
        min: 0.01,
        max: 999999.99,
        errorMessage: 'Price must be between $0.01 and $999,999.99',
      },
      numberOptions: {
        displayType: 'currency',
        currencyCode: 'USD',
        decimals: 2,
        thousandsSeparator: true,
        step: 0.01,
      },
      i18n: {
        es: {
          label: 'Precio del Producto',
          placeholder: '$0.00',
          description: 'Precio base antes de impuestos',
        },
      },
    }),
  },
};

export const AllNumberOptions: Story = {
  args: {
    field: createBasicNumberField({
      label: 'All Options Enabled',
      placeholder: '0.00',
      description: 'Demonstrates all available options',
      validation: {
        required: true,
        min: 0,
        max: 1000000,
        errorMessage: 'Please enter a valid number',
      },
      numberOptions: {
        step: 0.01,
        decimals: 2,
        thousandsSeparator: true,
        allowNegative: false,
      },
    }),
  },
};
