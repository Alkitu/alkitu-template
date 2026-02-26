import type { Meta, StoryObj } from '@storybook/react';

import { ToggleFieldEditor } from './ToggleFieldEditor';
import type { FormField } from '@/components/features/form-builder/types';

/**
 * ToggleFieldEditor Molecule Stories
 *
 * Editor for toggle/checkbox field types with style selection,
 * value customization, and i18n support.
 */
const meta = {
  title: 'Features/Form Builder/Molecules/ToggleFieldEditor',
  component: ToggleFieldEditor,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'ToggleFieldEditor allows configuration of toggle/checkbox fields including style, default state, custom values, and i18n labels.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    field: {
      description: 'The toggle field being edited',
    },
    onChange: {
      description: 'Callback when field configuration changes',
    },
    onDelete: {
      description: 'Callback when field should be deleted',
    },
    onDuplicate: {
      description: 'Callback when field should be duplicated',
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
  decorators: [
    (Story) => (
      <div className="w-[500px] p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ToggleFieldEditor>;

export default meta;
type Story = Omit<StoryObj<typeof meta>, 'args'> & Partial<Pick<StoryObj<typeof meta>, 'args'>>;

/**
 * Basic toggle field editor with default settings
 */
export const Basic: Story = {
  args: {
    field: {
      id: 'toggle-1',
      type: 'toggle',
      label: 'Enable notifications',
      required: false,
      validation: { required: false },
      toggleOptions: {
        style: 'toggle',
        defaultChecked: false,
        checkedValue: true,
        uncheckedValue: false,
      },
    } as FormField,
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

/**
 * Toggle checked by default
 */
export const DefaultChecked: Story = {
  args: {
    field: {
      id: 'toggle-2',
      type: 'toggle',
      label: 'Accept terms and conditions',
      required: false,
      validation: { required: false },
      toggleOptions: {
        style: 'toggle',
        defaultChecked: true,
        checkedValue: true,
        uncheckedValue: false,
      },
    } as FormField,
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

/**
 * Required toggle field
 */
export const Required: Story = {
  args: {
    field: {
      id: 'toggle-3',
      type: 'toggle',
      label: 'I agree to the privacy policy',
      required: true,
      validation: { required: true },
      toggleOptions: {
        style: 'toggle',
        defaultChecked: false,
        checkedValue: true,
        uncheckedValue: false,
      },
    } as FormField,
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

/**
 * Toggle with help text description
 */
export const WithDescription: Story = {
  args: {
    field: {
      id: 'toggle-4',
      type: 'toggle',
      label: 'Subscribe to newsletter',
      description: 'Get weekly updates about new features and products',
      showDescription: true,
      required: false,
      validation: { required: false },
      toggleOptions: {
        style: 'toggle',
        defaultChecked: false,
        checkedValue: true,
        uncheckedValue: false,
      },
    } as FormField,
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

/**
 * Checkbox style instead of toggle
 */
export const CheckboxStyle: Story = {
  args: {
    field: {
      id: 'toggle-5',
      type: 'toggle',
      label: 'Remember me',
      required: false,
      validation: { required: false },
      toggleOptions: {
        style: 'checkbox',
        defaultChecked: false,
        checkedValue: true,
        uncheckedValue: false,
      },
    } as FormField,
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

/**
 * Toggle with custom string values
 */
export const CustomStringValues: Story = {
  args: {
    field: {
      id: 'toggle-6',
      type: 'toggle',
      label: 'Email notifications',
      required: false,
      validation: { required: false },
      toggleOptions: {
        style: 'toggle',
        defaultChecked: false,
        checkedValue: 'enabled',
        uncheckedValue: 'disabled',
      },
    } as FormField,
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

/**
 * Toggle with yes/no string values
 */
export const YesNoValues: Story = {
  args: {
    field: {
      id: 'toggle-7',
      type: 'toggle',
      label: 'Receive SMS updates',
      required: false,
      validation: { required: false },
      toggleOptions: {
        style: 'toggle',
        defaultChecked: false,
        checkedValue: 'yes',
        uncheckedValue: 'no',
      },
    } as FormField,
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

/**
 * Spanish locale editing mode
 */
export const SpanishLocale: Story = {
  args: {
    field: {
      id: 'toggle-8',
      type: 'toggle',
      label: 'Enable notifications',
      required: false,
      validation: { required: false },
      i18n: {
        es: {
          label: 'Activar notificaciones',
          description: 'Recibe actualizaciones en tiempo real',
        },
      },
      description: 'Get real-time updates',
      showDescription: true,
      toggleOptions: {
        style: 'toggle',
        defaultChecked: false,
        checkedValue: true,
        uncheckedValue: false,
      },
    } as FormField,
    editingLocale: 'es',
    defaultLocale: 'en',
  },
};

/**
 * Complete toggle with all features enabled
 */
export const Complete: Story = {
  args: {
    field: {
      id: 'toggle-9',
      type: 'toggle',
      label: 'Marketing consent',
      description:
        'I agree to receive marketing communications and promotional offers via email',
      showDescription: true,
      required: true,
      validation: { required: true },
      toggleOptions: {
        style: 'checkbox',
        defaultChecked: false,
        checkedValue: 'consent_given',
        uncheckedValue: 'consent_denied',
      },
      i18n: {
        es: {
          label: 'Consentimiento de marketing',
          description:
            'Acepto recibir comunicaciones de marketing y ofertas promocionales por correo electrónico',
        },
      },
    } as FormField,
    editingLocale: 'en',
    defaultLocale: 'en',
  },
};

/**
 * Dark mode preview
 */
export const DarkMode: Story = {
  args: {
    field: {
      id: 'toggle-10',
      type: 'toggle',
      label: 'Two-factor authentication',
      description: 'Add an extra layer of security to your account',
      showDescription: true,
      required: false,
      validation: { required: false },
      toggleOptions: {
        style: 'toggle',
        defaultChecked: true,
        checkedValue: true,
        uncheckedValue: false,
      },
    } as FormField,
    editingLocale: 'en',
    defaultLocale: 'en',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="dark w-[500px] p-4 bg-background">
        <Story />
      </div>
    ),
  ],
};

/**
 * Interactive example showing state changes
 */
export const Interactive: Story = {
  args: {
    field: {
      id: 'toggle-11',
      type: 'toggle',
      label: 'Push notifications',
      description: 'Receive alerts directly to your device',
      showDescription: true,
      required: false,
      validation: { required: false },
      toggleOptions: {
        style: 'toggle',
        defaultChecked: false,
        checkedValue: true,
        uncheckedValue: false,
      },
    } as FormField,
    editingLocale: 'en',
    defaultLocale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Try changing the toggle style, default state, value type, and other settings to see how the field configuration updates.',
      },
    },
  },
};

/**
 * Error state (required but not configured properly)
 */
export const ErrorState: Story = {
  args: {
    field: {
      id: 'toggle-12',
      type: 'toggle',
      label: '',
      required: true,
      validation: { required: true },
      toggleOptions: {
        style: 'toggle',
        defaultChecked: false,
        checkedValue: true,
        uncheckedValue: false,
      },
    } as FormField,
    editingLocale: 'en',
    defaultLocale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story: 'Toggle field with validation enabled but missing required label.',
      },
    },
  },
};
