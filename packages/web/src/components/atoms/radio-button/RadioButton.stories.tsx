import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { RadioButton } from './RadioButton';

const meta = {
  title: 'Atomic Design/Atoms/RadioButton',
  component: RadioButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A custom-styled radio button with optional label and description. Provides single-selection functionality with full keyboard navigation and accessibility support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'error', 'success', 'warning'],
      description: 'Visual variant of the radio button',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the radio button',
    },
    checked: {
      control: 'boolean',
      description: 'Checked state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    label: {
      control: 'text',
      description: 'Label text displayed next to the radio button',
    },
    description: {
      control: 'text',
      description: 'Description text displayed below the label',
    },
  },
} satisfies Meta<typeof RadioButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic story
export const Default: Story = {
  args: {
    name: 'default',
    value: 'option1',
    checked: false,
    disabled: false,
    variant: 'default',
    size: 'md',
  },
};

// With label
export const WithLabel: Story = {
  args: {
    name: 'labeled',
    value: 'option1',
    label: 'Option 1',
    id: 'labeled-1',
  },
};

// With label and description
export const WithDescription: Story = {
  args: {
    name: 'described',
    value: 'option1',
    label: 'Option 1',
    description: 'This is a helpful description for the option',
    id: 'described-1',
  },
};

// Checked state
export const Checked: Story = {
  args: {
    name: 'checked',
    value: 'option1',
    label: 'Selected Option',
    checked: true,
    id: 'checked-1',
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    name: 'disabled',
    value: 'option1',
    label: 'Disabled Option',
    disabled: true,
    id: 'disabled-1',
  },
};

// Disabled and checked
export const DisabledChecked: Story = {
  args: {
    name: 'disabled-checked',
    value: 'option1',
    label: 'Disabled Selected',
    disabled: true,
    checked: true,
    id: 'disabled-checked-1',
  },
};

// Variants
export const ErrorVariant: Story = {
  args: {
    name: 'error',
    value: 'option1',
    label: 'Error Option',
    description: 'This option has an error',
    variant: 'error',
    id: 'error-1',
  },
};

export const SuccessVariant: Story = {
  args: {
    name: 'success',
    value: 'option1',
    label: 'Success Option',
    description: 'This option is valid',
    variant: 'success',
    checked: true,
    id: 'success-1',
  },
};

export const WarningVariant: Story = {
  args: {
    name: 'warning',
    value: 'option1',
    label: 'Warning Option',
    description: 'This option has a warning',
    variant: 'warning',
    id: 'warning-1',
  },
};

// Sizes
export const SmallSize: Story = {
  args: {
    name: 'small',
    value: 'option1',
    label: 'Small Radio',
    size: 'sm',
    id: 'small-1',
  },
};

export const MediumSize: Story = {
  args: {
    name: 'medium',
    value: 'option1',
    label: 'Medium Radio',
    size: 'md',
    id: 'medium-1',
  },
};

export const LargeSize: Story = {
  args: {
    name: 'large',
    value: 'option1',
    label: 'Large Radio',
    size: 'lg',
    id: 'large-1',
  },
};

// Interactive radio group
export const RadioGroup: Story = {
  render: () => {
    const [selected, setSelected] = useState('option2');

    return (
      <div className="flex flex-col gap-3">
        <RadioButton
          name="group"
          value="option1"
          label="Option 1"
          description="First option in the group"
          checked={selected === 'option1'}
          onChange={setSelected}
          id="group-1"
        />
        <RadioButton
          name="group"
          value="option2"
          label="Option 2"
          description="Second option in the group"
          checked={selected === 'option2'}
          onChange={setSelected}
          id="group-2"
        />
        <RadioButton
          name="group"
          value="option3"
          label="Option 3"
          description="Third option in the group"
          checked={selected === 'option3'}
          onChange={setSelected}
          id="group-3"
        />
        <RadioButton
          name="group"
          value="option4"
          label="Disabled Option"
          description="This option is disabled"
          disabled={true}
          checked={selected === 'option4'}
          onChange={setSelected}
          id="group-4"
        />
        <div className="mt-4 text-sm text-muted-foreground">
          Selected: <strong>{selected}</strong>
        </div>
      </div>
    );
  },
};

// All variants together
export const AllVariants: Story = {
  render: () => {
    const [defaultValue, setDefaultValue] = useState('default1');
    const [errorValue, setErrorValue] = useState('error1');
    const [successValue, setSuccessValue] = useState('success1');
    const [warningValue, setWarningValue] = useState('warning1');

    return (
      <div className="grid grid-cols-2 gap-8">
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold">Default</h3>
          <RadioButton
            name="default-group"
            value="default1"
            label="Option 1"
            checked={defaultValue === 'default1'}
            onChange={setDefaultValue}
            id="default-1"
          />
          <RadioButton
            name="default-group"
            value="default2"
            label="Option 2"
            checked={defaultValue === 'default2'}
            onChange={setDefaultValue}
            id="default-2"
          />
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold">Error</h3>
          <RadioButton
            name="error-group"
            value="error1"
            label="Invalid 1"
            variant="error"
            checked={errorValue === 'error1'}
            onChange={setErrorValue}
            id="error-1"
          />
          <RadioButton
            name="error-group"
            value="error2"
            label="Invalid 2"
            variant="error"
            checked={errorValue === 'error2'}
            onChange={setErrorValue}
            id="error-2"
          />
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold">Success</h3>
          <RadioButton
            name="success-group"
            value="success1"
            label="Valid 1"
            variant="success"
            checked={successValue === 'success1'}
            onChange={setSuccessValue}
            id="success-1"
          />
          <RadioButton
            name="success-group"
            value="success2"
            label="Valid 2"
            variant="success"
            checked={successValue === 'success2'}
            onChange={setSuccessValue}
            id="success-2"
          />
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold">Warning</h3>
          <RadioButton
            name="warning-group"
            value="warning1"
            label="Caution 1"
            variant="warning"
            checked={warningValue === 'warning1'}
            onChange={setWarningValue}
            id="warning-1"
          />
          <RadioButton
            name="warning-group"
            value="warning2"
            label="Caution 2"
            variant="warning"
            checked={warningValue === 'warning2'}
            onChange={setWarningValue}
            id="warning-2"
          />
        </div>
      </div>
    );
  },
};

// All sizes together
export const AllSizes: Story = {
  render: () => {
    const [value, setValue] = useState('md');

    return (
      <div className="flex flex-col gap-4">
        <RadioButton
          name="size-group"
          value="sm"
          label="Small"
          description="Small size radio button"
          size="sm"
          checked={value === 'sm'}
          onChange={setValue}
          id="size-sm"
        />
        <RadioButton
          name="size-group"
          value="md"
          label="Medium"
          description="Medium size radio button (default)"
          size="md"
          checked={value === 'md'}
          onChange={setValue}
          id="size-md"
        />
        <RadioButton
          name="size-group"
          value="lg"
          label="Large"
          description="Large size radio button"
          size="lg"
          checked={value === 'lg'}
          onChange={setValue}
          id="size-lg"
        />
      </div>
    );
  },
};
