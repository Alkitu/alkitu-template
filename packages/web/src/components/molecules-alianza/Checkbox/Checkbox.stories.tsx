import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';
import React from 'react';

const meta = {
  title: 'Molecules Alianza/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible checkbox component supporting both Standard and Alianza patterns. Features include variants, sizes, labels, descriptions, indeterminate state, and full accessibility support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Checked state of the checkbox',
    },
    indeterminate: {
      control: 'boolean',
      description: 'Indeterminate state (partially checked)',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
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
    label: {
      control: 'text',
      description: 'Label text displayed next to checkbox',
    },
    description: {
      control: 'text',
      description: 'Description text displayed below label',
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default
export const Default: Story = {
  args: {
    id: 'default',
    label: 'Accept terms and conditions',
  },
};

// With Description
export const WithDescription: Story = {
  args: {
    id: 'with-description',
    label: 'Newsletter subscription',
    description: 'Receive weekly updates about new products and features',
  },
};

// Checked
export const Checked: Story = {
  args: {
    id: 'checked',
    label: 'Checked checkbox',
    checked: true,
  },
};

// Indeterminate
export const Indeterminate: Story = {
  args: {
    id: 'indeterminate',
    label: 'Select all',
    indeterminate: true,
    checked: true,
  },
};

// Disabled
export const Disabled: Story = {
  args: {
    id: 'disabled',
    label: 'Disabled checkbox',
    disabled: true,
  },
};

// Disabled Checked
export const DisabledChecked: Story = {
  args: {
    id: 'disabled-checked',
    label: 'Disabled checked',
    disabled: true,
    checked: true,
  },
};

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Checkbox id="size-sm" label="Small checkbox" size="sm" />
      <Checkbox id="size-md" label="Medium checkbox" size="md" />
      <Checkbox id="size-lg" label="Large checkbox" size="lg" />
    </div>
  ),
};

// Variants
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Checkbox id="variant-default" label="Default variant" variant="default" />
      <Checkbox id="variant-success" label="Success variant" variant="success" />
      <Checkbox id="variant-warning" label="Warning variant" variant="warning" />
      <Checkbox id="variant-error" label="Error variant" variant="error" />
    </div>
  ),
};

// Interactive Example
export const Interactive: Story = {
  render: () => {
    const [checked, setChecked] = React.useState(false);
    return (
      <div className="flex flex-col gap-4">
        <Checkbox
          id="interactive"
          label="Toggle me"
          description="Click to toggle the checkbox state"
          checked={checked}
          onChange={setChecked}
        />
        <p className="text-sm text-muted-foreground">
          Current state: {checked ? 'Checked' : 'Unchecked'}
        </p>
      </div>
    );
  },
};

// Select All Pattern
export const SelectAllPattern: Story = {
  render: () => {
    const [items, setItems] = React.useState([
      { id: 1, label: 'Item 1', checked: false },
      { id: 2, label: 'Item 2', checked: false },
      { id: 3, label: 'Item 3', checked: false },
    ]);

    const allChecked = items.every((item) => item.checked);
    const someChecked = items.some((item) => item.checked);
    const indeterminate = someChecked && !allChecked;

    const handleSelectAll = (checked: boolean) => {
      setItems(items.map((item) => ({ ...item, checked })));
    };

    const handleItemToggle = (id: number) => {
      setItems(
        items.map((item) =>
          item.id === id ? { ...item, checked: !item.checked } : item
        )
      );
    };

    return (
      <div className="flex flex-col gap-3 p-4 border rounded-lg">
        <Checkbox
          id="select-all"
          label="Select all"
          checked={allChecked}
          indeterminate={indeterminate}
          onChange={handleSelectAll}
        />
        <div className="ml-6 flex flex-col gap-2 border-l-2 pl-4">
          {items.map((item) => (
            <Checkbox
              key={item.id}
              id={`item-${item.id}`}
              label={item.label}
              checked={item.checked}
              onChange={() => handleItemToggle(item.id)}
            />
          ))}
        </div>
      </div>
    );
  },
};

// Form Example
export const FormExample: Story = {
  render: () => {
    const [formData, setFormData] = React.useState({
      terms: false,
      newsletter: false,
      marketing: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      alert(JSON.stringify(formData, null, 2));
    };

    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold">Sign Up Form</h3>
        <Checkbox
          id="terms"
          name="terms"
          label="I accept the terms and conditions"
          checked={formData.terms}
          onChange={(checked) => setFormData({ ...formData, terms: checked })}
          variant={formData.terms ? 'default' : 'error'}
          aria-required
        />
        <Checkbox
          id="newsletter"
          name="newsletter"
          label="Subscribe to newsletter"
          description="Get weekly updates about new features"
          checked={formData.newsletter}
          onChange={(checked) => setFormData({ ...formData, newsletter: checked })}
        />
        <Checkbox
          id="marketing"
          name="marketing"
          label="Receive marketing emails"
          description="Special offers and promotions"
          checked={formData.marketing}
          onChange={(checked) => setFormData({ ...formData, marketing: checked })}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          disabled={!formData.terms}
        >
          Submit
        </button>
      </form>
    );
  },
};

// Alianza Pattern (Simple)
export const AlianzaPattern: Story = {
  render: () => {
    const [enabled, setEnabled] = React.useState(false);
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={enabled}
            onCheckedChange={setEnabled}
            data-testid="alianza-simple"
          />
          <span className="text-sm">Enable feature</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Minimal Alianza pattern - State: {enabled ? 'Enabled' : 'Disabled'}
        </p>
      </div>
    );
  },
};

// Without Label (Bare)
export const WithoutLabel: Story = {
  args: {
    id: 'bare',
    'aria-label': 'Accept agreement',
  },
};

// All Sizes Comparison
export const SizeComparison: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <Checkbox id="comp-sm" size="sm" checked />
        <span className="text-xs">Small</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Checkbox id="comp-md" size="md" checked />
        <span className="text-xs">Medium</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Checkbox id="comp-lg" size="lg" checked />
        <span className="text-xs">Large</span>
      </div>
    </div>
  ),
};

// All Variants Comparison
export const VariantComparison: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <Checkbox id="var-default-unchecked" variant="default" />
        <Checkbox id="var-default-checked" variant="default" checked />
        <span className="text-sm">Default</span>
      </div>
      <div className="flex items-center gap-4">
        <Checkbox id="var-success-unchecked" variant="success" />
        <Checkbox id="var-success-checked" variant="success" checked />
        <span className="text-sm">Success</span>
      </div>
      <div className="flex items-center gap-4">
        <Checkbox id="var-warning-unchecked" variant="warning" />
        <Checkbox id="var-warning-checked" variant="warning" checked />
        <span className="text-sm">Warning</span>
      </div>
      <div className="flex items-center gap-4">
        <Checkbox id="var-error-unchecked" variant="error" />
        <Checkbox id="var-error-checked" variant="error" checked />
        <span className="text-sm">Error</span>
      </div>
    </div>
  ),
};
