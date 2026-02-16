import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { FieldEditor } from './FieldEditor';
import type { FormField } from '@/components/features/form-builder/types';

/**
 * FieldEditor Organism Component Stories
 *
 * Demonstrates field type routing and integration with all 7 field editor molecules.
 * Shows locale management, common settings, and field-specific options.
 *
 * Stories:
 * 1. Text field (text, email, phone variants)
 * 2. Textarea field
 * 3. Number field (number, currency, percentage variants)
 * 4. Select field
 * 5. Radio field
 * 6. Toggle field
 * 7. DateTime field (date, time, datetime variants)
 * 8. Unsupported field types (range, multiselect, etc.)
 * 9. Multi-locale support
 * 10. Interactive field type switcher
 * 11. All field types showcase
 */

const meta: Meta<typeof FieldEditor> = {
  title: 'Features/FormBuilder/Organisms/FieldEditor',
  component: FieldEditor,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Top-level integration component that routes to appropriate field editor based on field type. Supports 7 field types with full i18n support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    field: {
      description: 'Form field being edited',
      control: { type: 'object' },
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
      description: 'List of supported locales for i18n',
      control: { type: 'object' },
    },
    defaultLocale: {
      description: 'Default locale for the form',
      control: { type: 'select' },
      options: ['en', 'es'],
    },
    editingLocale: {
      description: 'Current editing locale',
      control: { type: 'select' },
      options: ['en', 'es'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof FieldEditor>;

// ============================================================================
// STORY 1: Text Field
// ============================================================================

export const TextField: Story = {
  args: {
    field: {
      id: 'text-field-1',
      type: 'text',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      description: 'Please provide your legal name',
      validation: {
        required: true,
        minLength: 3,
        maxLength: 100,
      },
    } as FormField,
    onChange: (field: FormField) => console.log('onChange', field),
    onDelete: () => console.log('onDelete'),
    onDuplicate: () => console.log('onDuplicate'),
    supportedLocales: ['en', 'es'],
    defaultLocale: 'en',
    editingLocale: 'en',
  },
};

// ============================================================================
// STORY 2: Email Field
// ============================================================================

export const EmailField: Story = {
  args: {
    field: {
      id: 'email-field-1',
      type: 'email',
      label: 'Email Address',
      placeholder: 'you@example.com',
      description: 'We\'ll never share your email',
      validation: {
        required: true,
      },
      emailOptions: {
        showValidationIcon: true,
        allowMultiple: false,
        validateOnBlur: true,
      },
    } as FormField,
    onChange: (field: FormField) => console.log('onChange', field),
    onDelete: () => console.log('onDelete'),
    supportedLocales: ['en', 'es'],
    defaultLocale: 'en',
    editingLocale: 'en',
  },
};

// ============================================================================
// STORY 3: Phone Field
// ============================================================================

export const PhoneField: Story = {
  args: {
    field: {
      id: 'phone-field-1',
      type: 'phone',
      label: 'Phone Number',
      placeholder: '(555) 123-4567',
      description: 'We may call you to confirm your order',
      validation: {
        required: true,
      },
      phoneOptions: {
        format: 'national',
        defaultCountry: 'US',
        mask: '(###) ###-####',
      },
    } as FormField,
    onChange: (field: FormField) => console.log('onChange', field),
    onDelete: () => console.log('onDelete'),
    supportedLocales: ['en', 'es'],
    defaultLocale: 'en',
    editingLocale: 'en',
  },
};

// ============================================================================
// STORY 4: Textarea Field
// ============================================================================

export const TextareaField: Story = {
  args: {
    field: {
      id: 'textarea-field-1',
      type: 'textarea',
      label: 'Comments',
      placeholder: 'Share your thoughts...',
      description: 'Maximum 500 characters',
      validation: {
        required: false,
        maxLength: 500,
      },
      textareaOptions: {
        rows: 4,
        minRows: 3,
        maxRows: 10,
        autoGrow: true,
        showCharacterCount: true,
      },
    } as FormField,
    onChange: (field: FormField) => console.log('onChange', field),
    onDelete: () => console.log('onDelete'),
    supportedLocales: ['en', 'es'],
    defaultLocale: 'en',
    editingLocale: 'en',
  },
};

// ============================================================================
// STORY 5: Number Field
// ============================================================================

export const NumberField: Story = {
  args: {
    field: {
      id: 'number-field-1',
      type: 'number',
      label: 'Quantity',
      placeholder: '0',
      description: 'Enter quantity (1-100)',
      validation: {
        required: true,
        min: 1,
        max: 100,
      },
      numberOptions: {
        displayType: 'number',
        decimals: 0,
        allowNegative: false,
      },
    } as FormField,
    onChange: (field: FormField) => console.log('onChange', field),
    onDelete: () => console.log('onDelete'),
    supportedLocales: ['en', 'es'],
    defaultLocale: 'en',
    editingLocale: 'en',
  },
};

// ============================================================================
// STORY 6: Currency Number Field
// ============================================================================

export const CurrencyField: Story = {
  args: {
    field: {
      id: 'currency-field-1',
      type: 'number',
      label: 'Price',
      placeholder: '$0.00',
      description: 'Enter price in USD',
      validation: {
        required: true,
        min: 0,
      },
      numberOptions: {
        displayType: 'currency',
        currencyCode: 'USD',
        decimals: 2,
        allowNegative: false,
      },
    } as FormField,
    onChange: (field: FormField) => console.log('onChange', field),
    onDelete: () => console.log('onDelete'),
    supportedLocales: ['en', 'es'],
    defaultLocale: 'en',
    editingLocale: 'en',
  },
};

// ============================================================================
// STORY 7: Select Field
// ============================================================================

export const SelectField: Story = {
  args: {
    field: {
      id: 'select-field-1',
      type: 'select',
      label: 'Country',
      description: 'Select your country',
      validation: {
        required: true,
      },
      selectOptions: {
        items: [
          { id: '1', label: 'United States', value: 'us' },
          { id: '2', label: 'Canada', value: 'ca' },
          { id: '3', label: 'United Kingdom', value: 'uk' },
          { id: '4', label: 'Spain', value: 'es' },
        ],
        placeholder: 'Choose a country',
        allowClear: true,
      },
    } as FormField,
    onChange: (field: FormField) => console.log('onChange', field),
    onDelete: () => console.log('onDelete'),
    supportedLocales: ['en', 'es'],
    defaultLocale: 'en',
    editingLocale: 'en',
  },
};

// ============================================================================
// STORY 8: Radio Field
// ============================================================================

export const RadioField: Story = {
  args: {
    field: {
      id: 'radio-field-1',
      type: 'radio',
      label: 'Delivery Method',
      description: 'How would you like to receive your order?',
      validation: {
        required: true,
      },
      radioOptions: {
        items: [
          { id: '1', label: 'Standard Shipping (5-7 days)', value: 'standard' },
          { id: '2', label: 'Express Shipping (2-3 days)', value: 'express' },
          { id: '3', label: 'Next Day Delivery', value: 'next-day' },
        ],
        layout: 'vertical',
      },
    } as FormField,
    onChange: (field: FormField) => console.log('onChange', field),
    onDelete: () => console.log('onDelete'),
    supportedLocales: ['en', 'es'],
    defaultLocale: 'en',
    editingLocale: 'en',
  },
};

// ============================================================================
// STORY 9: Toggle Field
// ============================================================================

export const ToggleField: Story = {
  args: {
    field: {
      id: 'toggle-field-1',
      type: 'toggle',
      label: 'Subscribe to Newsletter',
      description: 'Receive weekly updates and promotions',
      validation: {
        required: false,
      },
      toggleOptions: {
        checkedValue: true,
        uncheckedValue: false,
        defaultChecked: false,
        style: 'toggle',
      },
    } as FormField,
    onChange: (field: FormField) => console.log('onChange', field),
    onDelete: () => console.log('onDelete'),
    supportedLocales: ['en', 'es'],
    defaultLocale: 'en',
    editingLocale: 'en',
  },
};

// ============================================================================
// STORY 10: Date Field
// ============================================================================

export const DateField: Story = {
  args: {
    field: {
      id: 'date-field-1',
      type: 'date',
      label: 'Birth Date',
      description: 'Select your date of birth',
      validation: {
        required: true,
      },
      dateOptions: {
        mode: 'date',
        locale: 'en',
        disableWeekends: false,
      },
    } as FormField,
    onChange: (field: FormField) => console.log('onChange', field),
    onDelete: () => console.log('onDelete'),
    supportedLocales: ['en', 'es'],
    defaultLocale: 'en',
    editingLocale: 'en',
  },
};

// ============================================================================
// STORY 11: Time Field
// ============================================================================

export const TimeField: Story = {
  args: {
    field: {
      id: 'time-field-1',
      type: 'time',
      label: 'Appointment Time',
      description: 'Select preferred time',
      validation: {
        required: true,
      },
      dateOptions: {
        mode: 'time',
        hourCycle: 12,
        businessHours: {
          enabled: true,
          start: '09:00',
          end: '17:00',
        },
      },
    } as FormField,
    onChange: (field: FormField) => console.log('onChange', field),
    onDelete: () => console.log('onDelete'),
    supportedLocales: ['en', 'es'],
    defaultLocale: 'en',
    editingLocale: 'en',
  },
};

// ============================================================================
// STORY 12: DateTime Field
// ============================================================================

export const DateTimeField: Story = {
  args: {
    field: {
      id: 'datetime-field-1',
      type: 'datetime',
      label: 'Event Date & Time',
      description: 'When should the event start?',
      validation: {
        required: true,
      },
      dateOptions: {
        mode: 'datetime',
        locale: 'en',
        hourCycle: 12,
      },
    } as FormField,
    onChange: (field: FormField) => console.log('onChange', field),
    onDelete: () => console.log('onDelete'),
    supportedLocales: ['en', 'es'],
    defaultLocale: 'en',
    editingLocale: 'en',
  },
};

// ============================================================================
// STORY 13: Multi-Locale (Spanish)
// ============================================================================

export const MultiLocaleSpanish: Story = {
  args: {
    field: {
      id: 'multi-locale-field-1',
      type: 'text',
      label: 'Full Name',
      placeholder: 'Enter your name',
      description: 'Legal name as it appears on ID',
      validation: {
        required: true,
      },
      i18n: {
        es: {
          label: 'Nombre Completo',
          placeholder: 'Ingrese su nombre',
          description: 'Nombre legal como aparece en su identificación',
        },
      },
    } as FormField,
    onChange: (field: FormField) => console.log('onChange', field),
    onDelete: () => console.log('onDelete'),
    supportedLocales: ['en', 'es'],
    defaultLocale: 'en',
    editingLocale: 'es',
  },
};

// ============================================================================
// STORY 14: Unsupported Field Type (Range)
// ============================================================================

export const UnsupportedFieldRange: Story = {
  args: {
    field: {
      id: 'range-field-1',
      type: 'range' as any,
      label: 'Budget Range',
      description: 'Select your budget',
      validation: {
        required: true,
      },
    } as FormField,
    onChange: (field: FormField) => console.log('onChange', field),
    onDelete: () => console.log('onDelete'),
    supportedLocales: ['en', 'es'],
    defaultLocale: 'en',
    editingLocale: 'en',
  },
};

// ============================================================================
// STORY 15: Unsupported Field Type (MultiSelect)
// ============================================================================

export const UnsupportedFieldMultiSelect: Story = {
  args: {
    field: {
      id: 'multiselect-field-1',
      type: 'multiselect' as any,
      label: 'Interests',
      description: 'Select all that apply',
      validation: {
        required: false,
      },
    } as FormField,
    onChange: (field: FormField) => console.log('onChange', field),
    onDelete: () => console.log('onDelete'),
    supportedLocales: ['en', 'es'],
    defaultLocale: 'en',
    editingLocale: 'en',
  },
};

// ============================================================================
// STORY 16: All Field Types Showcase (Interactive)
// ============================================================================

export const AllFieldTypesShowcase: Story = {
  render: () => {
    const [currentType, setCurrentType] = React.useState<FormField['type']>('text');

    const fieldConfigs: Record<FormField['type'], FormField> = {
      text: {
        id: 'showcase-1',
        type: 'text',
        label: 'Text Field',
        placeholder: 'Enter text',
        validation: { required: true },
      },
      email: {
        id: 'showcase-2',
        type: 'email',
        label: 'Email Field',
        placeholder: 'email@example.com',
        validation: { required: true },
        emailOptions: { showValidationIcon: true },
      },
      phone: {
        id: 'showcase-3',
        type: 'phone',
        label: 'Phone Field',
        placeholder: '(555) 123-4567',
        phoneOptions: { format: 'national', defaultCountry: 'US' },
      },
      textarea: {
        id: 'showcase-4',
        type: 'textarea',
        label: 'Textarea Field',
        placeholder: 'Enter long text',
        textareaOptions: { rows: 4 },
      },
      number: {
        id: 'showcase-5',
        type: 'number',
        label: 'Number Field',
        placeholder: '0',
        validation: { min: 0, max: 100 },
      },
      select: {
        id: 'showcase-6',
        type: 'select',
        label: 'Select Field',
        selectOptions: {
          items: [
            { id: '1', label: 'Option 1', value: 'opt1' },
            { id: '2', label: 'Option 2', value: 'opt2' },
          ],
        },
      },
      radio: {
        id: 'showcase-7',
        type: 'radio',
        label: 'Radio Field',
        radioOptions: {
          items: [
            { id: '1', label: 'Choice A', value: 'a' },
            { id: '2', label: 'Choice B', value: 'b' },
          ],
        },
      },
      toggle: {
        id: 'showcase-8',
        type: 'toggle',
        label: 'Toggle Field',
        toggleOptions: { style: 'toggle' },
      },
      date: {
        id: 'showcase-9',
        type: 'date',
        label: 'Date Field',
        dateOptions: { mode: 'date' },
      },
      time: {
        id: 'showcase-10',
        type: 'time',
        label: 'Time Field',
        dateOptions: { mode: 'time' },
      },
      datetime: {
        id: 'showcase-11',
        type: 'datetime',
        label: 'DateTime Field',
        dateOptions: { mode: 'datetime' },
      },
      range: {
        id: 'showcase-12',
        type: 'range' as any,
        label: 'Range Field (Unsupported)',
      },
      multiselect: {
        id: 'showcase-13',
        type: 'multiselect' as any,
        label: 'MultiSelect Field (Unsupported)',
      },
      group: {
        id: 'showcase-14',
        type: 'group' as any,
        label: 'Group Field (Unsupported)',
      },
      imageSelect: {
        id: 'showcase-15',
        type: 'imageSelect' as any,
        label: 'ImageSelect Field (Unsupported)',
      },
      imageSelectMulti: {
        id: 'showcase-16',
        type: 'imageSelectMulti' as any,
        label: 'ImageSelectMulti Field (Unsupported)',
      },
      fileUpload: {
        id: 'showcase-17b',
        type: 'fileUpload' as any,
        label: 'File Upload Field',
      },
      map: {
        id: 'showcase-17',
        type: 'map' as any,
        label: 'Map Field (Unsupported)',
      },
    };

    return (
      <div className="space-y-4">
        <div className="p-4 bg-muted rounded-lg">
          <label className="block text-sm font-medium mb-2">Select Field Type:</label>
          <select
            className="w-full p-2 border rounded"
            value={currentType}
            onChange={(e) => setCurrentType(e.target.value as FormField['type'])}
          >
            <optgroup label="Basic Fields">
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="textarea">Textarea</option>
              <option value="number">Number</option>
            </optgroup>
            <optgroup label="Advanced Fields">
              <option value="select">Select</option>
              <option value="radio">Radio</option>
              <option value="toggle">Toggle</option>
              <option value="date">Date</option>
              <option value="time">Time</option>
              <option value="datetime">DateTime</option>
            </optgroup>
            <optgroup label="Special Fields (Unsupported)">
              <option value="range">Range</option>
              <option value="multiselect">MultiSelect</option>
              <option value="group">Group</option>
              <option value="imageSelect">ImageSelect</option>
              <option value="imageSelectMulti">ImageSelectMulti</option>
              <option value="map">Map</option>
            </optgroup>
          </select>
        </div>

        <FieldEditor
          field={fieldConfigs[currentType]}
          onChange={(field: FormField) => console.log('onChange', field)}
          onDelete={() => console.log('onDelete')}
          onDuplicate={() => console.log('onDuplicate')}
          supportedLocales={['en', 'es']}
          defaultLocale="en"
          editingLocale="en"
        />
      </div>
    );
  },
};
