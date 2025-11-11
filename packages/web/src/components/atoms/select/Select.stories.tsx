import type { Meta, StoryObj } from '@storybook/react';
import { Select, MemoizedSelect } from './Select';
import type { SelectOption } from './Select.types';

const meta = {
  title: 'Atomic Design/Atoms/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A custom dropdown select component with keyboard navigation, accessibility features, and theme integration.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'ghost', 'filled'],
      description: 'Visual variant of the select',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    selectSize: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the select',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
      table: {
        defaultValue: { summary: false },
      },
    },
    isInvalid: {
      control: 'boolean',
      description: 'Invalid state (error)',
      table: {
        defaultValue: { summary: false },
      },
    },
    isValid: {
      control: 'boolean',
      description: 'Valid state (success)',
      table: {
        defaultValue: { summary: false },
      },
    },
    isWarning: {
      control: 'boolean',
      description: 'Warning state',
      table: {
        defaultValue: { summary: false },
      },
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultOptions: SelectOption[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  { value: 'option4', label: 'Option 4' },
];

export const Default: Story = {
  args: {
    options: defaultOptions,
    placeholder: 'Select an option',
  },
};

export const WithValue: Story = {
  args: {
    options: defaultOptions,
    value: 'option2',
    placeholder: 'Select an option',
  },
};

export const Disabled: Story = {
  args: {
    options: defaultOptions,
    disabled: true,
    placeholder: 'Select an option',
  },
};

export const DisabledWithValue: Story = {
  args: {
    options: defaultOptions,
    disabled: true,
    value: 'option2',
    placeholder: 'Select an option',
  },
};

export const SmallSize: Story = {
  args: {
    options: defaultOptions,
    selectSize: 'sm',
    placeholder: 'Small select',
  },
};

export const MediumSize: Story = {
  args: {
    options: defaultOptions,
    selectSize: 'md',
    placeholder: 'Medium select',
  },
};

export const LargeSize: Story = {
  args: {
    options: defaultOptions,
    selectSize: 'lg',
    placeholder: 'Large select',
  },
};

export const DefaultVariant: Story = {
  args: {
    options: defaultOptions,
    variant: 'default',
    placeholder: 'Default variant',
  },
};

export const GhostVariant: Story = {
  args: {
    options: defaultOptions,
    variant: 'ghost',
    placeholder: 'Ghost variant',
  },
};

export const FilledVariant: Story = {
  args: {
    options: defaultOptions,
    variant: 'filled',
    placeholder: 'Filled variant',
  },
};

export const InvalidState: Story = {
  args: {
    options: defaultOptions,
    isInvalid: true,
    placeholder: 'Invalid select',
  },
};

export const ValidState: Story = {
  args: {
    options: defaultOptions,
    isValid: true,
    value: 'option1',
    placeholder: 'Valid select',
  },
};

export const WarningState: Story = {
  args: {
    options: defaultOptions,
    isWarning: true,
    placeholder: 'Warning select',
  },
};

export const WithDisabledOptions: Story = {
  args: {
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2 (Disabled)', disabled: true },
      { value: 'option3', label: 'Option 3' },
      { value: 'option4', label: 'Option 4 (Disabled)', disabled: true },
    ],
    placeholder: 'Some options disabled',
  },
};

export const LongOptions: Story = {
  args: {
    options: [
      { value: '1', label: 'Short' },
      {
        value: '2',
        label: 'This is a very long option label that might cause layout issues',
      },
      { value: '3', label: 'Medium length option' },
      {
        value: '4',
        label: 'Another extremely long option label to test text wrapping and overflow behavior',
      },
    ],
    placeholder: 'Long options',
  },
};

export const ManyOptions: Story = {
  args: {
    options: Array.from({ length: 20 }, (_, i) => ({
      value: `option${i + 1}`,
      label: `Option ${i + 1}`,
    })),
    placeholder: 'Many options (scrollable)',
  },
};

export const Countries: Story = {
  args: {
    options: [
      { value: 'us', label: 'United States' },
      { value: 'uk', label: 'United Kingdom' },
      { value: 'ca', label: 'Canada' },
      { value: 'au', label: 'Australia' },
      { value: 'de', label: 'Germany' },
      { value: 'fr', label: 'France' },
      { value: 'jp', label: 'Japan' },
      { value: 'cn', label: 'China' },
    ],
    placeholder: 'Select a country',
    value: 'us',
  },
};

export const WithCustomStyling: Story = {
  args: {
    options: defaultOptions,
    placeholder: 'Custom styled',
    className: 'w-64',
    themeOverride: {
      borderColor: '#FF6B6B',
      fontWeight: 'bold',
    },
  },
};

export const MemoizedVersion: Story = {
  render: (args) => <MemoizedSelect {...args} />,
  args: {
    options: defaultOptions,
    placeholder: 'Memoized select',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-64">
      <Select options={defaultOptions} selectSize="sm" placeholder="Small" />
      <Select options={defaultOptions} selectSize="md" placeholder="Medium" />
      <Select options={defaultOptions} selectSize="lg" placeholder="Large" />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-64">
      <Select options={defaultOptions} variant="default" placeholder="Default" />
      <Select options={defaultOptions} variant="ghost" placeholder="Ghost" />
      <Select options={defaultOptions} variant="filled" placeholder="Filled" />
    </div>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-64">
      <Select options={defaultOptions} placeholder="Normal" />
      <Select options={defaultOptions} isInvalid placeholder="Invalid" />
      <Select options={defaultOptions} isValid value="option1" placeholder="Valid" />
      <Select options={defaultOptions} isWarning placeholder="Warning" />
      <Select options={defaultOptions} disabled placeholder="Disabled" />
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <form className="flex flex-col gap-4 w-64 p-4 border rounded-lg">
      <div>
        <label htmlFor="country" className="block text-sm font-medium mb-2">
          Country
        </label>
        <Select
          options={[
            { value: 'us', label: 'United States' },
            { value: 'uk', label: 'United Kingdom' },
            { value: 'ca', label: 'Canada' },
          ]}
          placeholder="Select a country"
          aria-label="Country selection"
          aria-required
        />
      </div>
      <div>
        <label htmlFor="state" className="block text-sm font-medium mb-2">
          State
        </label>
        <Select
          options={[
            { value: 'ny', label: 'New York' },
            { value: 'ca', label: 'California' },
            { value: 'tx', label: 'Texas' },
          ]}
          placeholder="Select a state"
          aria-label="State selection"
        />
      </div>
    </form>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = React.useState<string>('');

    return (
      <div className="flex flex-col gap-4 w-64">
        <Select
          options={defaultOptions}
          value={value}
          onValueChange={setValue}
          placeholder="Select an option"
        />
        <p className="text-sm text-muted-foreground">
          Selected value: <strong>{value || 'None'}</strong>
        </p>
      </div>
    );
  },
};

export const WithValidation: Story = {
  render: () => {
    const [value, setValue] = React.useState<string>('');
    const isValid = value !== '';
    const isInvalid = value === '';

    return (
      <div className="flex flex-col gap-4 w-64">
        <div>
          <label className="block text-sm font-medium mb-2">
            Required Field <span className="text-destructive">*</span>
          </label>
          <Select
            options={defaultOptions}
            value={value}
            onValueChange={setValue}
            placeholder="Select an option"
            isInvalid={isInvalid}
            isValid={isValid}
            aria-required
            aria-invalid={isInvalid}
          />
          {isInvalid && (
            <p className="text-sm text-destructive mt-1">This field is required</p>
          )}
        </div>
      </div>
    );
  },
};

// Import React for Interactive stories
import React from 'react';
