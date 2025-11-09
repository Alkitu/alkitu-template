import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Toggle } from './Toggle';

/**
 * Toggle - A switch component for boolean on/off states
 *
 * Usage example:
 * ```tsx
 * <Toggle
 *   label="Enable notifications"
 *   description="Receive email notifications"
 *   checked={isEnabled}
 *   onChange={setIsEnabled}
 * />
 * ```
 */
const meta = {
  title: 'Atomic Design/Atoms/Toggle',
  component: Toggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A toggle switch component for boolean on/off states. Supports both controlled and uncontrolled modes, with variants for different semantic meanings (default, success, warning, error) and three sizes (sm, md, lg). Includes full accessibility support with ARIA attributes and keyboard navigation.',
      },
    },
    chromatic: {
      viewports: [320, 768, 1200], // mobile, tablet, desktop
      diffThreshold: 0.2,
      delay: 300,
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error'],
      description: 'Visual style variant indicating semantic meaning',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Component size',
    },
    checked: {
      control: 'boolean',
      description: 'Controlled checked state',
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Default checked state for uncontrolled mode',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    label: {
      control: 'text',
      description: 'Label text for the toggle',
    },
    description: {
      control: 'text',
      description: 'Description text shown below the label',
    },
    onChange: {
      action: 'changed',
      description: 'Callback when toggle state changes',
    },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default state - basic toggle without label
 */
export const Default: Story = {
  args: {
    id: 'default-toggle',
  },
};

/**
 * With label - toggle with descriptive label
 */
export const WithLabel: Story = {
  args: {
    id: 'label-toggle',
    label: 'Enable notifications',
  },
};

/**
 * With label and description - full featured toggle
 */
export const WithLabelAndDescription: Story = {
  args: {
    id: 'full-toggle',
    label: 'Enable email notifications',
    description: 'Receive updates about your account activity',
  },
};

/**
 * Checked state - toggle in on position
 */
export const Checked: Story = {
  args: {
    id: 'checked-toggle',
    label: 'Notifications enabled',
    defaultChecked: true,
  },
};

/**
 * All variants - for Chromatic visual regression
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4">
      <Toggle
        id="variant-default"
        label="Default variant"
        description="Primary action color"
        defaultChecked={true}
        variant="default"
      />
      <Toggle
        id="variant-success"
        label="Success variant"
        description="Positive action indication"
        defaultChecked={true}
        variant="success"
      />
      <Toggle
        id="variant-warning"
        label="Warning variant"
        description="Caution indication"
        defaultChecked={true}
        variant="warning"
      />
      <Toggle
        id="variant-error"
        label="Error variant"
        description="Destructive action indication"
        defaultChecked={true}
        variant="error"
      />
    </div>
  ),
  parameters: {
    chromatic: {
      disableSnapshot: false,
    },
  },
};

/**
 * All sizes - for Chromatic visual regression
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4">
      <Toggle
        id="size-sm"
        label="Small toggle"
        description="Compact size for tight layouts"
        size="sm"
        defaultChecked={true}
      />
      <Toggle
        id="size-md"
        label="Medium toggle"
        description="Default size for most use cases"
        size="md"
        defaultChecked={true}
      />
      <Toggle
        id="size-lg"
        label="Large toggle"
        description="Prominent size for emphasis"
        size="lg"
        defaultChecked={true}
      />
    </div>
  ),
  parameters: {
    chromatic: {
      disableSnapshot: false,
    },
  },
};

/**
 * Disabled state - toggle that cannot be interacted with
 */
export const Disabled: Story = {
  args: {
    id: 'disabled-toggle',
    label: 'Disabled toggle',
    description: 'This toggle is disabled',
    disabled: true,
  },
};

/**
 * Disabled checked state
 */
export const DisabledChecked: Story = {
  args: {
    id: 'disabled-checked-toggle',
    label: 'Disabled checked toggle',
    description: 'This toggle is disabled and checked',
    disabled: true,
    defaultChecked: true,
  },
};

/**
 * Uncontrolled mode - toggle manages its own state
 */
export const UncontrolledMode: Story = {
  args: {
    id: 'uncontrolled-toggle',
    label: 'Uncontrolled toggle',
    description: 'This toggle manages its own state',
    defaultChecked: false,
  },
};

/**
 * Form integration example - toggle with name attribute
 */
export const FormIntegration: Story = {
  render: () => (
    <form className="p-4 border rounded-md space-y-4">
      <h3 className="font-semibold mb-4">Notification Settings</h3>
      <Toggle
        id="email-notifications"
        name="emailNotifications"
        label="Email notifications"
        description="Receive updates via email"
        defaultChecked={true}
      />
      <Toggle
        id="push-notifications"
        name="pushNotifications"
        label="Push notifications"
        description="Receive push notifications on your device"
        defaultChecked={false}
      />
      <Toggle
        id="sms-notifications"
        name="smsNotifications"
        label="SMS notifications"
        description="Receive text message alerts"
        defaultChecked={false}
      />
    </form>
  ),
};

/**
 * All states showcase - comprehensive visual reference
 */
export const AllStates: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6 p-4">
      <div className="space-y-4">
        <h4 className="font-semibold">Unchecked States</h4>
        <Toggle id="unchecked-default" label="Default" variant="default" />
        <Toggle id="unchecked-success" label="Success" variant="success" />
        <Toggle id="unchecked-warning" label="Warning" variant="warning" />
        <Toggle id="unchecked-error" label="Error" variant="error" />
        <Toggle
          id="unchecked-disabled"
          label="Disabled"
          variant="default"
          disabled
        />
      </div>
      <div className="space-y-4">
        <h4 className="font-semibold">Checked States</h4>
        <Toggle
          id="checked-default"
          label="Default"
          variant="default"
          defaultChecked={true}
        />
        <Toggle
          id="checked-success"
          label="Success"
          variant="success"
          defaultChecked={true}
        />
        <Toggle
          id="checked-warning"
          label="Warning"
          variant="warning"
          defaultChecked={true}
        />
        <Toggle
          id="checked-error"
          label="Error"
          variant="error"
          defaultChecked={true}
        />
        <Toggle
          id="checked-disabled"
          label="Disabled"
          variant="default"
          defaultChecked={true}
          disabled
        />
      </div>
    </div>
  ),
  parameters: {
    chromatic: {
      disableSnapshot: false,
    },
  },
};

/**
 * Dark theme - for theme testing
 */
export const DarkTheme: Story = {
  args: {
    id: 'dark-toggle',
    label: 'Dark theme toggle',
    description: 'Toggle in dark mode',
    defaultChecked: true,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="dark bg-background p-8">
        <Story />
      </div>
    ),
  ],
};

/**
 * Interactive playground - for testing all prop combinations
 */
export const Playground: Story = {
  args: {
    id: 'playground-toggle',
    label: 'Playground toggle',
    description: 'Try different prop combinations',
    variant: 'default',
    size: 'md',
    disabled: false,
    defaultChecked: false,
  },
};
