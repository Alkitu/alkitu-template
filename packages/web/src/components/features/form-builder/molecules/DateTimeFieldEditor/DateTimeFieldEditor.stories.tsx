/**
 * DateTimeFieldEditor Storybook Stories
 *
 * Interactive stories demonstrating all features and configurations
 */

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DateTimeFieldEditor } from './DateTimeFieldEditor';
import type { FormField } from '../../types';

const meta: Meta<typeof DateTimeFieldEditor> = {
  title: 'Form Builder/Molecules/DateTimeFieldEditor',
  component: DateTimeFieldEditor,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A comprehensive field editor for date, time, and datetime fields. Supports extensive configuration including date/time ranges, disabled dates, business hours, and multi-language support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    editingLocale: {
      control: 'select',
      options: ['en', 'es'],
      description: 'The locale being edited',
    },
    defaultLocale: {
      control: 'select',
      options: ['en', 'es'],
      description: 'The default locale of the form',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the editor is disabled',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DateTimeFieldEditor>;

// Base field for stories
const createBaseField = (overrides?: Partial<FormField>): FormField => ({
  id: 'date-field-1',
  type: 'date',
  label: 'Sample Date Field',
  dateOptions: {
    mode: 'date',
    locale: 'en',
    hourCycle: 24,
    includeSeconds: false,
  },
  ...overrides,
});

// Interactive wrapper component
function InteractiveWrapper(props: any) {
  const [field, setField] = useState<FormField>(props.field);

  return (
    <div className="max-w-2xl">
      <DateTimeFieldEditor {...props} field={field} onChange={setField} />

      {/* Show current field state for debugging */}
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="text-sm font-semibold mb-2">Current Configuration:</h3>
        <pre className="text-xs overflow-auto max-h-96">
          {JSON.stringify(field, null, 2)}
        </pre>
      </div>
    </div>
  );
}

/**
 * Default date-only field editor
 */
export const DateOnly: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    field: createBaseField({
      dateOptions: {
        mode: 'date',
        locale: 'en',
        placeholder: 'Select a date',
      },
    }),
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

/**
 * Time-only field editor with 24-hour format
 */
export const TimeOnly24h: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    field: createBaseField({
      dateOptions: {
        mode: 'time',
        locale: 'en',
        hourCycle: 24,
        includeSeconds: false,
        placeholder: 'Select time',
      },
    }),
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

/**
 * Time-only field editor with 12-hour format
 */
export const TimeOnly12h: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    field: createBaseField({
      dateOptions: {
        mode: 'time',
        locale: 'en',
        hourCycle: 12,
        includeSeconds: false,
        placeholder: 'Select time',
      },
    }),
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

/**
 * Time field with seconds enabled
 */
export const TimeWithSeconds: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    field: createBaseField({
      dateOptions: {
        mode: 'time',
        locale: 'en',
        hourCycle: 24,
        includeSeconds: true,
        placeholder: 'Select time (with seconds)',
      },
    }),
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

/**
 * DateTime field combining date and time
 */
export const DateTime: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    field: createBaseField({
      dateOptions: {
        mode: 'datetime',
        locale: 'en',
        hourCycle: 24,
        includeSeconds: false,
        placeholder: 'Select date and time',
      },
    }),
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

/**
 * Date field with min/max date constraints
 */
export const WithDateRange: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    field: createBaseField({
      dateOptions: {
        mode: 'date',
        locale: 'en',
        minDate: new Date('2024-01-01'),
        maxDate: new Date('2024-12-31'),
        placeholder: 'Select date (2024 only)',
      },
    }),
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

/**
 * Date field with weekends disabled
 */
export const WeekendsDisabled: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    field: createBaseField({
      dateOptions: {
        mode: 'date',
        locale: 'en',
        disableWeekends: true,
        placeholder: 'Select weekday only',
      },
    }),
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

/**
 * Date field with specific disabled dates
 */
export const WithDisabledDates: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    field: createBaseField({
      dateOptions: {
        mode: 'date',
        locale: 'en',
        disabledDates: [
          new Date('2024-12-25'), // Christmas
          new Date('2024-01-01'), // New Year
          new Date('2024-07-04'), // Independence Day
        ],
        placeholder: 'Select date (holidays blocked)',
      },
    }),
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

/**
 * Time field with min/max time constraints
 */
export const WithTimeRange: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    field: createBaseField({
      dateOptions: {
        mode: 'time',
        locale: 'en',
        hourCycle: 24,
        minTime: '09:00',
        maxTime: '17:00',
        placeholder: 'Select time (9 AM - 5 PM)',
      },
    }),
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

/**
 * Time field with business hours enabled
 */
export const WithBusinessHours: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    field: createBaseField({
      dateOptions: {
        mode: 'time',
        locale: 'en',
        hourCycle: 24,
        businessHours: {
          enabled: true,
          start: '09:00',
          end: '17:00',
        },
        placeholder: 'Select business hours',
      },
    }),
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

/**
 * Required date field
 */
export const RequiredField: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    field: createBaseField({
      validation: { required: true },
      dateOptions: {
        mode: 'date',
        locale: 'en',
        placeholder: 'Required date field',
      },
    }),
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

/**
 * Date field with description
 */
export const WithDescription: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    field: createBaseField({
      showDescription: true,
      description: 'Please select your preferred appointment date',
      dateOptions: {
        mode: 'date',
        locale: 'en',
        placeholder: 'Select appointment date',
      },
    }),
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

/**
 * Spanish locale editor
 */
export const SpanishLocale: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    field: createBaseField({
      dateOptions: {
        mode: 'date',
        locale: 'es',
        placeholder: 'Seleccionar fecha',
      },
    }),
    editingLocale: 'es',
    defaultLocale: 'es',
  },
};

/**
 * Editing Spanish translation (non-default locale)
 */
export const EditingTranslation: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    field: createBaseField({
      dateOptions: {
        mode: 'date',
        locale: 'en',
        placeholder: 'Select a date',
        minDate: new Date('2024-01-01'),
        disableWeekends: true,
      },
      i18n: {
        es: {
          label: 'Campo de fecha',
          placeholder: 'Seleccionar una fecha',
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
          'When editing a non-default locale, configuration options are read-only and only translatable fields (placeholder, description) can be edited.',
      },
    },
  },
};

/**
 * Disabled state
 */
export const DisabledState: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    field: createBaseField({
      dateOptions: {
        mode: 'datetime',
        locale: 'en',
        placeholder: 'Disabled field',
      },
    }),
    editingLocale: 'en',
    defaultLocale: 'en',
    disabled: true,
  },
};

/**
 * Complete configuration example
 */
export const CompleteConfiguration: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    field: createBaseField({
      showDescription: true,
      description: 'Select your preferred appointment date and time during business hours',
      validation: { required: true },
      dateOptions: {
        mode: 'datetime',
        locale: 'en',
        hourCycle: 12,
        includeSeconds: false,
        minDate: new Date('2024-01-01'),
        maxDate: new Date('2024-12-31'),
        disableWeekends: true,
        disabledDates: [new Date('2024-12-25'), new Date('2024-01-01')],
        minTime: '09:00',
        maxTime: '17:00',
        businessHours: {
          enabled: true,
          start: '09:00',
          end: '17:00',
        },
        placeholder: 'Select appointment',
      },
    }),
    editingLocale: 'en',
    defaultLocale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story:
          'A comprehensive example showing all available configuration options: datetime mode, 12-hour format, date range, disabled weekends and holidays, business hours, and required validation.',
      },
    },
  },
};

/**
 * Dark mode example
 */
export const DarkMode: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    field: createBaseField({
      dateOptions: {
        mode: 'datetime',
        locale: 'en',
        hourCycle: 24,
        placeholder: 'Dark mode example',
      },
    }),
    editingLocale: 'en',
    defaultLocale: 'en',
  },
  parameters: {
    backgrounds: { default: 'dark' },
    themes: { themeOverride: 'dark' },
  },
};

/**
 * US date format (MM/DD/YYYY)
 */
export const USDateFormat: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    field: createBaseField({
      dateOptions: {
        mode: 'date',
        locale: 'en',
        placeholder: 'MM/DD/YYYY format',
        disabledDates: [new Date('2024-12-25')],
      },
    }),
    editingLocale: 'en',
    defaultLocale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story: 'Date display uses US format (MM/DD/YYYY) when locale is English.',
      },
    },
  },
};

/**
 * European date format (DD/MM/YYYY)
 */
export const EuropeanDateFormat: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    field: createBaseField({
      dateOptions: {
        mode: 'date',
        locale: 'es',
        placeholder: 'DD/MM/YYYY format',
        disabledDates: [new Date('2024-12-25')],
      },
    }),
    editingLocale: 'es',
    defaultLocale: 'es',
  },
  parameters: {
    docs: {
      description: {
        story: 'Date display uses European format (DD/MM/YYYY) when locale is Spanish.',
      },
    },
  },
};
