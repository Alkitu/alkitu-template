import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { User, Mail, Phone, MapPin } from 'lucide-react';
import { Select } from './Select';
import type { SelectOption, SelectGroupOption } from './Select.types';

const meta = {
  title: 'Atoms/Alianza/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A robust dropdown select component built on Radix UI primitives. Supports flat and grouped options, validation states, keyboard navigation, and full accessibility.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'ghost', 'filled'],
      description: 'Visual variant of the select',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the select',
    },
    isInvalid: {
      control: 'boolean',
      description: 'Invalid state (error)',
    },
    isValid: {
      control: 'boolean',
      description: 'Valid state (success)',
    },
    isWarning: {
      control: 'boolean',
      description: 'Warning state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    required: {
      control: 'boolean',
      description: 'Required field indicator',
    },
  },
  args: {
    onValueChange: fn(),
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data
const simpleOptions: SelectOption[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  { value: 'option4', label: 'Option 4' },
  { value: 'option5', label: 'Option 5' },
];

const optionsWithIcons: SelectOption[] = [
  { value: 'user', label: 'User Profile', icon: <User className="h-4 w-4" /> },
  { value: 'mail', label: 'Email Settings', icon: <Mail className="h-4 w-4" /> },
  { value: 'phone', label: 'Phone Number', icon: <Phone className="h-4 w-4" /> },
  { value: 'location', label: 'Location', icon: <MapPin className="h-4 w-4" /> },
];

const groupedOptions: SelectGroupOption[] = [
  {
    label: 'Fruits',
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'orange', label: 'Orange' },
    ],
  },
  {
    label: 'Vegetables',
    options: [
      { value: 'carrot', label: 'Carrot' },
      { value: 'lettuce', label: 'Lettuce' },
      { value: 'tomato', label: 'Tomato' },
    ],
  },
  {
    label: 'Proteins',
    options: [
      { value: 'chicken', label: 'Chicken' },
      { value: 'beef', label: 'Beef' },
      { value: 'fish', label: 'Fish' },
    ],
  },
];

const optionsWithDisabled: SelectOption[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2 (Disabled)', disabled: true },
  { value: 'option3', label: 'Option 3' },
  { value: 'option4', label: 'Option 4 (Disabled)', disabled: true },
  { value: 'option5', label: 'Option 5' },
];

// Stories
export const Default: Story = {
  args: {
    options: simpleOptions,
    placeholder: 'Select an option...',
  },
};

export const WithValue: Story = {
  args: {
    options: simpleOptions,
    value: 'option2',
    placeholder: 'Select an option...',
  },
};

export const WithIcons: Story = {
  args: {
    options: optionsWithIcons,
    placeholder: 'Choose a setting...',
  },
};

export const GroupedOptions: Story = {
  args: {
    options: groupedOptions,
    placeholder: 'Select food...',
  },
};

export const WithDisabledOptions: Story = {
  args: {
    options: optionsWithDisabled,
    placeholder: 'Select an option...',
  },
};

// Variants
export const VariantDefault: Story = {
  args: {
    options: simpleOptions,
    variant: 'default',
    placeholder: 'Default variant',
  },
};

export const VariantGhost: Story = {
  args: {
    options: simpleOptions,
    variant: 'ghost',
    placeholder: 'Ghost variant',
  },
};

export const VariantFilled: Story = {
  args: {
    options: simpleOptions,
    variant: 'filled',
    placeholder: 'Filled variant',
  },
};

// Sizes
export const SizeSmall: Story = {
  args: {
    options: simpleOptions,
    size: 'sm',
    placeholder: 'Small size',
  },
};

export const SizeMedium: Story = {
  args: {
    options: simpleOptions,
    size: 'md',
    placeholder: 'Medium size (default)',
  },
};

export const SizeLarge: Story = {
  args: {
    options: simpleOptions,
    size: 'lg',
    placeholder: 'Large size',
  },
};

// Validation States
export const Invalid: Story = {
  args: {
    options: simpleOptions,
    isInvalid: true,
    placeholder: 'Invalid state',
    'aria-label': 'Invalid select',
  },
};

export const Valid: Story = {
  args: {
    options: simpleOptions,
    isValid: true,
    value: 'option1',
    placeholder: 'Valid state',
    'aria-label': 'Valid select',
  },
};

export const Warning: Story = {
  args: {
    options: simpleOptions,
    isWarning: true,
    value: 'option1',
    placeholder: 'Warning state',
    'aria-label': 'Warning select',
  },
};

// States
export const Disabled: Story = {
  args: {
    options: simpleOptions,
    disabled: true,
    placeholder: 'Disabled select',
  },
};

export const Required: Story = {
  args: {
    options: simpleOptions,
    required: true,
    placeholder: 'Required field',
  },
};

// Edge Cases
export const EmptyOptions: Story = {
  args: {
    options: [],
    placeholder: 'No options available',
  },
};

export const LongLabels: Story = {
  args: {
    options: [
      {
        value: 'long1',
        label: 'This is a very long option label that demonstrates text overflow handling',
      },
      {
        value: 'long2',
        label: 'Another extremely long label that should wrap or truncate appropriately',
      },
      {
        value: 'long3',
        label: 'Short label',
      },
    ],
    placeholder: 'Select with long labels',
  },
};

export const ManyOptions: Story = {
  args: {
    options: Array.from({ length: 50 }, (_, i) => ({
      value: `option${i + 1}`,
      label: `Option ${i + 1}`,
    })),
    placeholder: 'Select from many options',
  },
};

// Combinations
export const SmallInvalid: Story = {
  args: {
    options: simpleOptions,
    size: 'sm',
    isInvalid: true,
    placeholder: 'Small + Invalid',
  },
};

export const LargeValid: Story = {
  args: {
    options: simpleOptions,
    size: 'lg',
    isValid: true,
    value: 'option1',
    placeholder: 'Large + Valid',
  },
};

export const GhostWithIcons: Story = {
  args: {
    options: optionsWithIcons,
    variant: 'ghost',
    placeholder: 'Ghost variant with icons',
  },
};

export const FilledGrouped: Story = {
  args: {
    options: groupedOptions,
    variant: 'filled',
    placeholder: 'Filled variant with groups',
  },
};

// Interactive Examples
export const InteractiveForm: Story = {
  render: (args) => {
    const [value, setValue] = React.useState<string>('');

    return (
      <div className="w-80 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Country</label>
          <Select
            {...args}
            options={[
              { value: 'us', label: 'United States' },
              { value: 'uk', label: 'United Kingdom' },
              { value: 'ca', label: 'Canada' },
              { value: 'au', label: 'Australia' },
            ]}
            value={value}
            onValueChange={setValue}
            placeholder="Select your country"
          />
        </div>
        {value && (
          <div className="p-4 rounded-md bg-muted">
            <p className="text-sm">
              Selected value: <strong>{value}</strong>
            </p>
          </div>
        )}
      </div>
    );
  },
};

export const MultipleSelects: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <Select options={simpleOptions} placeholder="First select" size="sm" />
      <Select options={simpleOptions} placeholder="Second select" />
      <Select options={simpleOptions} placeholder="Third select" size="lg" />
    </div>
  ),
};

// Accessibility showcase
export const AccessibilityShowcase: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <div>
        <label htmlFor="a11y-select" className="block text-sm font-medium mb-2">
          Accessible Select
        </label>
        <Select
          id="a11y-select"
          options={simpleOptions}
          placeholder="Select an option"
          aria-label="Choose an option from the list"
          aria-describedby="helper-text"
          required
        />
        <p id="helper-text" className="text-sm text-muted-foreground mt-2">
          This field is required. Use arrow keys to navigate options.
        </p>
      </div>
    </div>
  ),
};

// Theme integration showcase
export const ThemeShowcase: Story = {
  render: () => (
    <div className="w-full max-w-4xl space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Default Theme</h3>
        <div className="grid grid-cols-3 gap-4">
          <Select options={simpleOptions} placeholder="Default" />
          <Select options={simpleOptions} placeholder="Ghost" variant="ghost" />
          <Select options={simpleOptions} placeholder="Filled" variant="filled" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Validation States</h3>
        <div className="grid grid-cols-3 gap-4">
          <Select options={simpleOptions} placeholder="Invalid" isInvalid />
          <Select options={simpleOptions} placeholder="Valid" value="option1" isValid />
          <Select options={simpleOptions} placeholder="Warning" value="option2" isWarning />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Sizes</h3>
        <div className="grid grid-cols-3 gap-4 items-end">
          <Select options={simpleOptions} placeholder="Small" size="sm" />
          <Select options={simpleOptions} placeholder="Medium" size="md" />
          <Select options={simpleOptions} placeholder="Large" size="lg" />
        </div>
      </div>
    </div>
  ),
};
