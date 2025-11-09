import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';
import React from 'react';

const meta = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'An interactive checkbox component with support for checked, unchecked, and indeterminate states. Fully accessible with keyboard navigation and ARIA attributes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'error', 'success', 'warning'],
      description: 'Visual variant of the checkbox',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the checkbox',
    },
    checked: {
      control: 'boolean',
      description: 'Checked state',
    },
    indeterminate: {
      control: 'boolean',
      description: 'Indeterminate state (partially checked)',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    label: {
      control: 'text',
      description: 'Label text',
    },
    description: {
      control: 'text',
      description: 'Description text',
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic stories
export const Default: Story = {
  args: {
    id: 'default-checkbox',
  },
};

export const WithLabel: Story = {
  args: {
    id: 'label-checkbox',
    label: 'Accept terms and conditions',
  },
};

export const WithDescription: Story = {
  args: {
    id: 'description-checkbox',
    label: 'Subscribe to newsletter',
    description: 'Receive weekly updates about new features and promotions',
  },
};

export const Checked: Story = {
  args: {
    id: 'checked-checkbox',
    label: 'Checked checkbox',
    checked: true,
  },
};

export const Indeterminate: Story = {
  args: {
    id: 'indeterminate-checkbox',
    label: 'Select all',
    indeterminate: true,
  },
};

export const Disabled: Story = {
  args: {
    id: 'disabled-checkbox',
    label: 'Disabled checkbox',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    id: 'disabled-checked-checkbox',
    label: 'Disabled checked',
    checked: true,
    disabled: true,
  },
};

// Variant stories
export const ErrorVariant: Story = {
  args: {
    id: 'error-checkbox',
    label: 'Required field',
    variant: 'error',
    description: 'This field is required',
  },
};

export const SuccessVariant: Story = {
  args: {
    id: 'success-checkbox',
    label: 'Verified',
    variant: 'success',
    checked: true,
  },
};

export const WarningVariant: Story = {
  args: {
    id: 'warning-checkbox',
    label: 'Proceed with caution',
    variant: 'warning',
  },
};

// Size stories
export const SmallSize: Story = {
  args: {
    id: 'small-checkbox',
    label: 'Small checkbox',
    size: 'sm',
  },
};

export const MediumSize: Story = {
  args: {
    id: 'medium-checkbox',
    label: 'Medium checkbox',
    size: 'md',
  },
};

export const LargeSize: Story = {
  args: {
    id: 'large-checkbox',
    label: 'Large checkbox',
    size: 'lg',
  },
};

// Interactive story
export const Interactive: Story = {
  render: () => {
    const [checked, setChecked] = React.useState(false);

    return (
      <div className="space-y-4">
        <Checkbox
          id="interactive-checkbox"
          label="Toggle me"
          description={`Current state: ${checked ? 'checked' : 'unchecked'}`}
          checked={checked}
          onChange={setChecked}
        />
      </div>
    );
  },
};

// Indeterminate interactive story
export const IndeterminateInteractive: Story = {
  render: () => {
    const [checkedItems, setCheckedItems] = React.useState([false, false, false]);

    const allChecked = checkedItems.every(Boolean);
    const someChecked = checkedItems.some(Boolean);
    const indeterminate = someChecked && !allChecked;

    const handleSelectAll = (checked: boolean) => {
      setCheckedItems([checked, checked, checked]);
    };

    const handleItemChange = (index: number) => (checked: boolean) => {
      const newItems = [...checkedItems];
      newItems[index] = checked;
      setCheckedItems(newItems);
    };

    return (
      <div className="space-y-3">
        <Checkbox
          id="select-all"
          label="Select all"
          checked={allChecked}
          indeterminate={indeterminate}
          onChange={handleSelectAll}
        />
        <div className="pl-6 space-y-2">
          <Checkbox
            id="item-1"
            label="Item 1"
            checked={checkedItems[0]}
            onChange={handleItemChange(0)}
          />
          <Checkbox
            id="item-2"
            label="Item 2"
            checked={checkedItems[1]}
            onChange={handleItemChange(1)}
          />
          <Checkbox
            id="item-3"
            label="Item 3"
            checked={checkedItems[2]}
            onChange={handleItemChange(2)}
          />
        </div>
      </div>
    );
  },
};

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Variants</h3>
        <Checkbox id="showcase-default" label="Default" variant="default" />
        <Checkbox id="showcase-error" label="Error" variant="error" />
        <Checkbox id="showcase-success" label="Success" variant="success" />
        <Checkbox id="showcase-warning" label="Warning" variant="warning" />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Sizes</h3>
        <Checkbox id="showcase-sm" label="Small" size="sm" />
        <Checkbox id="showcase-md" label="Medium" size="md" />
        <Checkbox id="showcase-lg" label="Large" size="lg" />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold">States</h3>
        <Checkbox id="showcase-unchecked" label="Unchecked" />
        <Checkbox id="showcase-checked" label="Checked" checked />
        <Checkbox id="showcase-indeterminate" label="Indeterminate" indeterminate />
        <Checkbox id="showcase-disabled" label="Disabled" disabled />
      </div>
    </div>
  ),
};

// Form example
export const FormExample: Story = {
  render: () => {
    const [formData, setFormData] = React.useState({
      terms: false,
      newsletter: false,
      privacy: false,
    });

    const handleChange = (field: keyof typeof formData) => (checked: boolean) => {
      setFormData((prev) => ({ ...prev, [field]: checked }));
    };

    const canSubmit = formData.terms && formData.privacy;

    return (
      <div className="w-[400px] space-y-4">
        <h3 className="text-lg font-semibold">Sign Up Form</h3>
        <div className="space-y-3">
          <Checkbox
            id="terms"
            label="I accept the terms and conditions"
            description="You must accept the terms to continue"
            variant={!formData.terms ? 'error' : 'default'}
            checked={formData.terms}
            onChange={handleChange('terms')}
            aria-required
          />
          <Checkbox
            id="privacy"
            label="I accept the privacy policy"
            description="Required to create an account"
            variant={!formData.privacy ? 'error' : 'default'}
            checked={formData.privacy}
            onChange={handleChange('privacy')}
            aria-required
          />
          <Checkbox
            id="newsletter"
            label="Subscribe to newsletter"
            description="Optional: Receive updates and promotions"
            checked={formData.newsletter}
            onChange={handleChange('newsletter')}
          />
        </div>
        <button
          disabled={!canSubmit}
          className="px-4 py-2 bg-primary text-primary-foreground rounded disabled:opacity-50"
        >
          Submit
        </button>
      </div>
    );
  },
};
