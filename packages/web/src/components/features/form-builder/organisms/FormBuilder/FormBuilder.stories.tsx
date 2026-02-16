/**
 * FormBuilder Storybook Stories
 *
 * Interactive stories showcasing FormBuilder organism in various states
 * Target: 10+ stories covering all major use cases
 */

import type { Meta, StoryObj } from '@storybook/react';
import { FormBuilder } from './FormBuilder';
import type { FormSettings } from '../../types';

const meta: Meta<typeof FormBuilder> = {
  title: 'Features/FormBuilder/Organisms/FormBuilder',
  component: FormBuilder,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Main form builder interface for creating and editing forms. Supports drag & drop reordering, multi-locale forms, and comprehensive field management.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    formSettings: {
      description: 'Current form configuration including fields and metadata',
      control: 'object',
    },
    onChange: {
      description: 'Callback fired when form settings change',
      action: 'changed',
    },
    supportedLocales: {
      description: 'Array of supported locale codes',
      control: 'object',
    },
    defaultLocale: {
      description: 'Default locale for the form',
      control: 'select',
      options: ['en', 'es'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof FormBuilder>;

// ============================================================================
// STORY HELPERS
// ============================================================================

const emptyFormSettings: FormSettings = {
  title: 'New Form',
  description: '',
  fields: [],
  submitButtonText: 'Submit',
  supportedLocales: ['en'],
  defaultLocale: 'en',
  showStepNumbers: true,
};

const basicFormSettings: FormSettings = {
  title: 'Contact Form',
  description: 'Get in touch with us',
  fields: [
    {
      id: 'field-1',
      type: 'text',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      required: true,
    },
    {
      id: 'field-2',
      type: 'email',
      label: 'Email Address',
      placeholder: 'your@email.com',
      required: true,
      emailOptions: {
        showValidationIcon: true,
        validateOnBlur: true,
      },
    },
    {
      id: 'field-3',
      type: 'phone',
      label: 'Phone Number',
      placeholder: '(555) 123-4567',
      required: false,
      phoneOptions: {
        format: 'national',
        defaultCountry: 'US',
        mask: '(###) ###-####',
      },
    },
    {
      id: 'field-4',
      type: 'textarea',
      label: 'Message',
      placeholder: 'Type your message here...',
      required: true,
      textareaOptions: {
        rows: 4,
        resize: 'vertical',
        showCharacterCount: true,
        maxLength: 500,
      },
    },
  ],
  submitButtonText: 'Send Message',
  supportedLocales: ['en'],
  defaultLocale: 'en',
  showStepNumbers: true,
};

const complexFormSettings: FormSettings = {
  title: 'Product Survey',
  description: 'Help us improve our products',
  fields: [
    {
      id: 'field-1',
      type: 'text',
      label: 'Product Name',
      required: true,
    },
    {
      id: 'field-2',
      type: 'select',
      label: 'Product Category',
      required: true,
      selectOptions: {
        items: [
          { id: 'cat-1', label: 'Electronics', value: 'electronics' },
          { id: 'cat-2', label: 'Clothing', value: 'clothing' },
          { id: 'cat-3', label: 'Home & Garden', value: 'home' },
          { id: 'cat-4', label: 'Sports', value: 'sports' },
        ],
        allowClear: true,
      },
    },
    {
      id: 'field-3',
      type: 'radio',
      label: 'How satisfied are you?',
      required: true,
      radioOptions: {
        items: [
          { id: 'sat-1', label: 'Very Satisfied', value: '5' },
          { id: 'sat-2', label: 'Satisfied', value: '4' },
          { id: 'sat-3', label: 'Neutral', value: '3' },
          { id: 'sat-4', label: 'Dissatisfied', value: '2' },
          { id: 'sat-5', label: 'Very Dissatisfied', value: '1' },
        ],
        layout: 'vertical',
      },
    },
    {
      id: 'field-4',
      type: 'multiselect',
      label: 'Features Used',
      required: false,
      multiSelectOptions: {
        items: [
          { id: 'feat-1', label: 'Feature A', value: 'a' },
          { id: 'feat-2', label: 'Feature B', value: 'b' },
          { id: 'feat-3', label: 'Feature C', value: 'c' },
          { id: 'feat-4', label: 'Feature D', value: 'd' },
        ],
        layout: 'vertical',
      },
    },
    {
      id: 'field-5',
      type: 'toggle',
      label: 'Would you recommend this product?',
      required: false,
      toggleOptions: {
        defaultChecked: false,
        style: 'toggle',
        checkedValue: true,
        uncheckedValue: false,
      },
    },
    {
      id: 'field-6',
      type: 'number',
      label: 'Price Paid',
      placeholder: '0.00',
      required: false,
      numberOptions: {
        type: 'currency',
        currency: 'USD',
        min: 0,
        step: 0.01,
      },
    },
    {
      id: 'field-7',
      type: 'date',
      label: 'Purchase Date',
      required: false,
      dateOptions: {
        mode: 'date',
        locale: 'en',
        hourCycle: 24,
      },
    },
  ],
  submitButtonText: 'Submit Survey',
  supportedLocales: ['en'],
  defaultLocale: 'en',
  showStepNumbers: true,
};

const multiLocaleFormSettings: FormSettings = {
  title: 'Registration Form',
  description: 'Sign up for our service',
  fields: [
    {
      id: 'field-1',
      type: 'text',
      label: 'First Name',
      placeholder: 'Enter first name',
      required: true,
      i18n: {
        es: {
          label: 'Nombre',
          placeholder: 'Ingresa tu nombre',
        },
      },
    },
    {
      id: 'field-2',
      type: 'text',
      label: 'Last Name',
      placeholder: 'Enter last name',
      required: true,
      i18n: {
        es: {
          label: 'Apellido',
          placeholder: 'Ingresa tu apellido',
        },
      },
    },
    {
      id: 'field-3',
      type: 'email',
      label: 'Email',
      placeholder: 'your@email.com',
      required: true,
      emailOptions: {
        showValidationIcon: true,
        validateOnBlur: true,
      },
      i18n: {
        es: {
          label: 'Correo Electrónico',
          placeholder: 'tu@correo.com',
        },
      },
    },
  ],
  submitButtonText: 'Register',
  supportedLocales: ['en', 'es'],
  defaultLocale: 'en',
  showStepNumbers: true,
  i18n: {
    es: {
      title: 'Formulario de Registro',
      description: 'Regístrate en nuestro servicio',
      submitButtonText: 'Registrarse',
    },
  },
};

const stepFormSettings: FormSettings = {
  title: 'Multi-Step Application',
  description: 'Complete all steps to submit your application',
  fields: [
    {
      id: 'group-1',
      type: 'group',
      label: 'Personal Information',
      required: false,
      groupOptions: {
        title: 'Personal Information',
        description: 'Tell us about yourself',
        fields: [
          {
            id: 'field-1-1',
            type: 'text',
            label: 'First Name',
            required: true,
          },
          {
            id: 'field-1-2',
            type: 'text',
            label: 'Last Name',
            required: true,
          },
          {
            id: 'field-1-3',
            type: 'date',
            label: 'Date of Birth',
            required: true,
            dateOptions: {
              mode: 'date',
              locale: 'en',
              hourCycle: 24,
            },
          },
        ],
        showStepIndicator: true,
      },
    },
    {
      id: 'group-2',
      type: 'group',
      label: 'Contact Details',
      required: false,
      groupOptions: {
        title: 'Contact Details',
        description: 'How can we reach you?',
        fields: [
          {
            id: 'field-2-1',
            type: 'email',
            label: 'Email',
            required: true,
            emailOptions: {
              showValidationIcon: true,
              validateOnBlur: true,
            },
          },
          {
            id: 'field-2-2',
            type: 'phone',
            label: 'Phone',
            required: false,
            phoneOptions: {
              format: 'national',
              defaultCountry: 'US',
              mask: '(###) ###-####',
            },
          },
        ],
        showStepIndicator: true,
      },
    },
    {
      id: 'group-3',
      type: 'group',
      label: 'Additional Information',
      required: false,
      groupOptions: {
        title: 'Additional Information',
        description: 'Optional details',
        fields: [
          {
            id: 'field-3-1',
            type: 'textarea',
            label: 'Comments',
            required: false,
            textareaOptions: {
              rows: 4,
              resize: 'vertical',
              showCharacterCount: true,
              maxLength: 500,
            },
          },
        ],
        showStepIndicator: true,
      },
    },
  ],
  submitButtonText: 'Submit Application',
  supportedLocales: ['en'],
  defaultLocale: 'en',
  showStepNumbers: true,
};

// ============================================================================
// STORIES
// ============================================================================

/**
 * Empty form with no fields - shows empty state
 */
export const EmptyForm: Story = {
  args: {
    formSettings: emptyFormSettings,
    supportedLocales: ['en'],
    defaultLocale: 'en',
  },
};

/**
 * Basic contact form with text, email, phone, and textarea fields
 */
export const BasicContactForm: Story = {
  args: {
    formSettings: basicFormSettings,
    supportedLocales: ['en'],
    defaultLocale: 'en',
  },
};

/**
 * Complex form with various field types including select, radio, multiselect, toggle
 */
export const ComplexForm: Story = {
  args: {
    formSettings: complexFormSettings,
    supportedLocales: ['en'],
    defaultLocale: 'en',
  },
};

/**
 * Form with few fields (3-4) for testing minimal layout
 */
export const FormWithFewFields: Story = {
  args: {
    formSettings: {
      ...emptyFormSettings,
      title: 'Quick Survey',
      fields: [
        {
          id: 'field-1',
          type: 'text',
          label: 'Name',
          required: true,
        },
        {
          id: 'field-2',
          type: 'email',
          label: 'Email',
          required: true,
          emailOptions: {
            showValidationIcon: true,
            validateOnBlur: true,
          },
        },
        {
          id: 'field-3',
          type: 'select',
          label: 'Rating',
          required: true,
          selectOptions: {
            items: [
              { id: 'r1', label: '1 Star', value: '1' },
              { id: 'r2', label: '2 Stars', value: '2' },
              { id: 'r3', label: '3 Stars', value: '3' },
              { id: 'r4', label: '4 Stars', value: '4' },
              { id: 'r5', label: '5 Stars', value: '5' },
            ],
            allowClear: false,
          },
        },
      ],
    },
    supportedLocales: ['en'],
    defaultLocale: 'en',
  },
};

/**
 * Multi-locale form with English and Spanish translations
 */
export const MultiLocaleForm: Story = {
  args: {
    formSettings: multiLocaleFormSettings,
    supportedLocales: ['en', 'es'],
    defaultLocale: 'en',
  },
};

/**
 * Multi-step form with groups (step mode)
 */
export const MultiStepForm: Story = {
  args: {
    formSettings: stepFormSettings,
    supportedLocales: ['en'],
    defaultLocale: 'en',
  },
};

/**
 * Form showcasing all basic field types
 */
export const AllFieldTypesShowcase: Story = {
  args: {
    formSettings: {
      ...emptyFormSettings,
      title: 'All Field Types',
      description: 'Showcasing all available field types',
      fields: [
        { id: 'f1', type: 'text', label: 'Text Field', required: false },
        {
          id: 'f2',
          type: 'textarea',
          label: 'Textarea Field',
          required: false,
          textareaOptions: { rows: 3, resize: 'vertical', showCharacterCount: false },
        },
        {
          id: 'f3',
          type: 'number',
          label: 'Number Field',
          required: false,
          numberOptions: { type: 'number', min: 0, max: 100, step: 1 },
        },
        {
          id: 'f4',
          type: 'email',
          label: 'Email Field',
          required: false,
          emailOptions: { showValidationIcon: true, validateOnBlur: true },
        },
        {
          id: 'f5',
          type: 'phone',
          label: 'Phone Field',
          required: false,
          phoneOptions: { format: 'national', defaultCountry: 'US', mask: '(###) ###-####' },
        },
        {
          id: 'f6',
          type: 'select',
          label: 'Select Field',
          required: false,
          selectOptions: {
            items: [
              { id: 'o1', label: 'Option 1', value: 'opt1' },
              { id: 'o2', label: 'Option 2', value: 'opt2' },
            ],
            allowClear: true,
          },
        },
        {
          id: 'f7',
          type: 'radio',
          label: 'Radio Field',
          required: false,
          radioOptions: {
            items: [
              { id: 'r1', label: 'Choice A', value: 'a' },
              { id: 'r2', label: 'Choice B', value: 'b' },
            ],
            layout: 'vertical',
          },
        },
        {
          id: 'f8',
          type: 'multiselect',
          label: 'Multi-Select Field',
          required: false,
          multiSelectOptions: {
            items: [
              { id: 'm1', label: 'Item 1', value: '1' },
              { id: 'm2', label: 'Item 2', value: '2' },
            ],
            layout: 'vertical',
          },
        },
        {
          id: 'f9',
          type: 'toggle',
          label: 'Toggle Field',
          required: false,
          toggleOptions: {
            defaultChecked: false,
            style: 'toggle',
            checkedValue: true,
            uncheckedValue: false,
          },
        },
        {
          id: 'f10',
          type: 'date',
          label: 'Date Field',
          required: false,
          dateOptions: { mode: 'date', locale: 'en', hourCycle: 24 },
        },
        {
          id: 'f11',
          type: 'time',
          label: 'Time Field',
          required: false,
          timeOptions: { locale: 'en', hourCycle: 24 },
        },
        {
          id: 'f12',
          type: 'datetime',
          label: 'DateTime Field',
          required: false,
          dateOptions: { mode: 'datetime', locale: 'en', hourCycle: 24 },
        },
      ],
    },
    supportedLocales: ['en'],
    defaultLocale: 'en',
  },
};

/**
 * Form with metadata emphasized
 */
export const WithFormMetadata: Story = {
  args: {
    formSettings: {
      ...basicFormSettings,
      title: 'Customer Feedback Form',
      description:
        'We value your feedback! Please take a moment to share your thoughts about our service. Your input helps us improve and provide better experiences for all our customers.',
      submitButtonText: 'Send Feedback',
    },
    supportedLocales: ['en'],
    defaultLocale: 'en',
  },
};

/**
 * Dark mode showcase
 */
export const DarkMode: Story = {
  args: {
    formSettings: basicFormSettings,
    supportedLocales: ['en'],
    defaultLocale: 'en',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

/**
 * Interactive playground for experimentation
 */
export const InteractivePlayground: Story = {
  args: {
    formSettings: {
      ...emptyFormSettings,
      title: 'Build Your Form',
      description: 'Start adding fields to create your custom form',
    },
    supportedLocales: ['en', 'es'],
    defaultLocale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use this playground to experiment with the FormBuilder. Try adding fields, changing locales, and configuring form settings.',
      },
    },
  },
};

/**
 * Form in Settings tab view
 */
export const SettingsTab: Story = {
  args: {
    formSettings: multiLocaleFormSettings,
    supportedLocales: ['en', 'es'],
    defaultLocale: 'en',
  },
  play: async ({ canvasElement }) => {
    // Auto-click settings tab (requires @storybook/addon-interactions)
    const settingsTab = canvasElement.querySelector(
      '[role="tab"]:nth-child(2)'
    ) as HTMLElement;
    if (settingsTab) {
      settingsTab.click();
    }
  },
};

/**
 * Form with many fields (stress test)
 */
export const FormWithManyFields: Story = {
  args: {
    formSettings: {
      ...emptyFormSettings,
      title: 'Comprehensive Application',
      description: 'Detailed application form with many fields',
      fields: Array.from({ length: 15 }, (_, i) => ({
        id: `field-${i + 1}`,
        type: ['text', 'email', 'select', 'textarea', 'number'][i % 5] as any,
        label: `Field ${i + 1}`,
        placeholder: `Enter field ${i + 1}`,
        required: i % 3 === 0,
        ...(i % 5 === 2 && {
          selectOptions: {
            items: [
              { id: `${i}-1`, label: 'Option 1', value: '1' },
              { id: `${i}-2`, label: 'Option 2', value: '2' },
            ],
            allowClear: true,
          },
        }),
        ...(i % 5 === 3 && {
          textareaOptions: { rows: 3, resize: 'vertical', showCharacterCount: false },
        }),
        ...(i % 5 === 4 && {
          numberOptions: { type: 'number', min: 0, step: 1 },
        }),
      })),
    },
    supportedLocales: ['en'],
    defaultLocale: 'en',
  },
};
