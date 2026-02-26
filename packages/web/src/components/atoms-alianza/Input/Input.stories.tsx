import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';
import { Mail, Lock, Search, User } from 'lucide-react';

const meta = {
  title: 'Atoms/Alianza/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A pure input atom component that handles only the input element itself. For composed inputs with labels and error messages, use FormInput molecule.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'filled', 'outline'],
      description: 'Visual variant of the input',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the input',
    },
    state: {
      control: 'select',
      options: ['default', 'error', 'success', 'warning'],
      description: 'Validation state of the input',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
      description: 'HTML input type',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = Omit<StoryObj<typeof meta>, 'args'> & Partial<Pick<StoryObj<typeof meta>, 'args'>>;

// Basic variants
export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const Filled: Story = {
  args: {
    variant: 'filled',
    placeholder: 'Enter text...',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    placeholder: 'Enter text...',
  },
};

// Sizes
export const Small: Story = {
  args: {
    size: 'sm',
    placeholder: 'Small input',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    placeholder: 'Medium input (default)',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    placeholder: 'Large input',
  },
};

// States
export const ErrorState: Story = {
  args: {
    state: 'error',
    placeholder: 'Invalid input',
    value: 'wrong@email',
  },
};

export const SuccessState: Story = {
  args: {
    state: 'success',
    placeholder: 'Valid input',
    value: 'correct@email.com',
  },
};

export const WarningState: Story = {
  args: {
    state: 'warning',
    placeholder: 'Warning state',
    value: 'Check this value',
  },
};

// Input types
export const EmailInput: Story = {
  args: {
    type: 'email',
    placeholder: 'your@email.com',
  },
};

export const PasswordInput: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password',
  },
};

export const NumberInput: Story = {
  args: {
    type: 'number',
    placeholder: '0',
  },
};

export const SearchInput: Story = {
  args: {
    type: 'search',
    placeholder: 'Search...',
  },
};

// States
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled input',
    value: 'Cannot edit',
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    placeholder: 'Read only',
    value: 'Read-only value',
  },
};

// Combinations
export const LargeFilledError: Story = {
  args: {
    variant: 'filled',
    size: 'lg',
    state: 'error',
    placeholder: 'Large filled with error',
  },
};

export const SmallOutlineSuccess: Story = {
  args: {
    variant: 'outline',
    size: 'sm',
    state: 'success',
    placeholder: 'Small outline with success',
  },
};

// All sizes comparison
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input size="sm" placeholder="Small (sm)" />
      <Input size="md" placeholder="Medium (md) - Default" />
      <Input size="lg" placeholder="Large (lg)" />
    </div>
  ),
};

// All variants comparison
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input variant="default" placeholder="Default variant" />
      <Input variant="filled" placeholder="Filled variant" />
      <Input variant="outline" placeholder="Outline variant" />
    </div>
  ),
};

// All states comparison
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input state="default" placeholder="Default state" />
      <Input state="error" placeholder="Error state" value="Invalid value" />
      <Input state="success" placeholder="Success state" value="Valid value" />
      <Input state="warning" placeholder="Warning state" value="Check this" />
    </div>
  ),
};

// Input types comparison
export const AllTypes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input type="text" placeholder="Text input" />
      <Input type="email" placeholder="Email input" />
      <Input type="password" placeholder="Password input" />
      <Input type="number" placeholder="Number input" />
      <Input type="tel" placeholder="Phone input" />
      <Input type="url" placeholder="URL input" />
      <Input type="search" placeholder="Search input" />
    </div>
  ),
};

// With custom class
export const CustomStyling: Story = {
  args: {
    placeholder: 'Custom styled input',
    className: 'border-purple-500 bg-purple-50 text-purple-900',
  },
};

// With theme override
export const ThemeOverride: Story = {
  args: {
    placeholder: 'Theme override example',
    themeOverride: {
      backgroundColor: '#fffacd',
      borderColor: '#ffa500',
    },
  },
};

// Real-world examples
export const LoginForm: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80 p-6 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Login</h3>
      <Input type="email" placeholder="Email address" />
      <Input type="password" placeholder="Password" />
    </div>
  ),
};

export const SearchBar: Story = {
  render: () => (
    <div className="w-96">
      <Input
        type="search"
        size="lg"
        variant="filled"
        placeholder="Search for anything..."
      />
    </div>
  ),
};
