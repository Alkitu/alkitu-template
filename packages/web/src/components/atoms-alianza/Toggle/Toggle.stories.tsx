import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from './Toggle';
import { useState } from 'react';

const meta = {
  title: 'Atoms-Alianza/Toggle',
  component: Toggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A toggle switch component for boolean on/off states. Supports both controlled and uncontrolled modes, with variants, sizes, and full accessibility support. Merges the best features from Standard and Alianza implementations.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error'],
      description: 'Visual variant of the toggle',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the toggle switch',
      table: {
        defaultValue: { summary: 'md' },
      },
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
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    label: {
      control: 'text',
      description: 'Label text for the toggle',
    },
    description: {
      control: 'text',
      description: 'Description text shown below the label',
    },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Examples
export const Default: Story = {
  args: {
    id: 'toggle-default',
    label: 'Enable feature',
  },
};

export const WithDescription: Story = {
  args: {
    id: 'toggle-description',
    label: 'Enable notifications',
    description: 'Receive email notifications for important updates',
  },
};

export const Checked: Story = {
  args: {
    id: 'toggle-checked',
    label: 'Active feature',
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    id: 'toggle-disabled',
    label: 'Disabled toggle',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    id: 'toggle-disabled-checked',
    label: 'Disabled (checked)',
    disabled: true,
    defaultChecked: true,
  },
};

// Variants
export const VariantDefault: Story = {
  args: {
    id: 'toggle-variant-default',
    label: 'Default variant',
    variant: 'default',
    defaultChecked: true,
  },
};

export const VariantSuccess: Story = {
  args: {
    id: 'toggle-variant-success',
    label: 'Success variant',
    description: 'Indicates successful or positive state',
    variant: 'success',
    defaultChecked: true,
  },
};

export const VariantWarning: Story = {
  args: {
    id: 'toggle-variant-warning',
    label: 'Warning variant',
    description: 'Indicates warning or caution state',
    variant: 'warning',
    defaultChecked: true,
  },
};

export const VariantError: Story = {
  args: {
    id: 'toggle-variant-error',
    label: 'Error variant',
    description: 'Indicates error or destructive state',
    variant: 'error',
    defaultChecked: true,
  },
};

// Sizes
export const SizeSmall: Story = {
  args: {
    id: 'toggle-size-sm',
    label: 'Small toggle',
    size: 'sm',
  },
};

export const SizeMedium: Story = {
  args: {
    id: 'toggle-size-md',
    label: 'Medium toggle',
    size: 'md',
  },
};

export const SizeLarge: Story = {
  args: {
    id: 'toggle-size-lg',
    label: 'Large toggle',
    size: 'lg',
  },
};

// Controlled Example
export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);

    return (
      <div className="space-y-4">
        <Toggle
          id="toggle-controlled"
          label="Controlled toggle"
          description={`Toggle is ${checked ? 'ON' : 'OFF'}`}
          checked={checked}
          onChange={setChecked}
        />
        <button
          className="px-4 py-2 bg-primary text-primary-foreground rounded"
          onClick={() => setChecked(!checked)}
        >
          Toggle programmatically
        </button>
      </div>
    );
  },
};

// Radix-compatible API
export const RadixCompatible: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);

    return (
      <Toggle
        id="toggle-radix"
        label="Radix-compatible API"
        description="Using onCheckedChange instead of onChange"
        checked={checked}
        onCheckedChange={setChecked}
      />
    );
  },
};

// All Variants Showcase
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Toggle
        id="toggle-all-default"
        label="Default"
        variant="default"
        defaultChecked
      />
      <Toggle
        id="toggle-all-success"
        label="Success"
        variant="success"
        defaultChecked
      />
      <Toggle
        id="toggle-all-warning"
        label="Warning"
        variant="warning"
        defaultChecked
      />
      <Toggle
        id="toggle-all-error"
        label="Error"
        variant="error"
        defaultChecked
      />
    </div>
  ),
};

// All Sizes Showcase
export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Toggle id="toggle-sizes-sm" label="Small" size="sm" defaultChecked />
      <Toggle id="toggle-sizes-md" label="Medium" size="md" defaultChecked />
      <Toggle id="toggle-sizes-lg" label="Large" size="lg" defaultChecked />
    </div>
  ),
};

// Form Integration Example
export const FormIntegration: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      notifications: false,
      marketing: true,
      analytics: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      alert(JSON.stringify(formData, null, 2));
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <Toggle
          id="toggle-notifications"
          name="notifications"
          label="Email notifications"
          description="Receive updates via email"
          checked={formData.notifications}
          onChange={(checked) =>
            setFormData({ ...formData, notifications: checked })
          }
        />
        <Toggle
          id="toggle-marketing"
          name="marketing"
          label="Marketing emails"
          description="Receive promotional content"
          checked={formData.marketing}
          onChange={(checked) =>
            setFormData({ ...formData, marketing: checked })
          }
        />
        <Toggle
          id="toggle-analytics"
          name="analytics"
          label="Analytics tracking"
          description="Help us improve with anonymous data"
          checked={formData.analytics}
          onChange={(checked) =>
            setFormData({ ...formData, analytics: checked })
          }
        />
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-primary-foreground rounded"
        >
          Save preferences
        </button>
      </form>
    );
  },
};

// Without Label (Minimal)
export const WithoutLabel: Story = {
  args: {
    id: 'toggle-no-label',
  },
};
