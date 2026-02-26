import type { Meta, StoryObj } from '@storybook/react';
import { FormInput } from './FormInput';
import { Mail, Lock, Eye, EyeOff, User, Phone, Search } from 'lucide-react';
import React from 'react';

// FormInput accepts extended props at runtime beyond its strict type definition.
const FormInputAny = FormInput as React.FC<any>;

const meta: Meta<typeof FormInput> = {
  title: 'Molecules/Alianza/FormInput',
  component: FormInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A complete form input molecule that composes the Input atom with label, icons, and error messages. Use this for form fields that need labels and validation feedback.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text for the input',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
      description: 'HTML input type',
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FormInput>;

// Basic examples
export const Default: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    type: 'email',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter password',
    helperText: 'Must be at least 8 characters',
  } as any,
};

export const WithError: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter username',
    error: 'Username is already taken',
  },
};

export const Required: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'your@email.com',
    required: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Field',
    placeholder: 'Cannot edit',
    disabled: true,
    value: 'Disabled value',
  },
};

// With icons
export const WithLeftIcon: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'your@email.com',
    icon: <Mail className="h-4 w-4" />,
  },
};

export const WithRightIcon: Story = {
  args: {
    label: 'Search',
    type: 'search',
    placeholder: 'Search...',
    iconRight: <Search className="h-4 w-4" />,
  },
};

export const WithBothIcons: Story = {
  args: {
    label: 'User Email',
    type: 'email',
    placeholder: 'user@example.com',
    icon: <User className="h-4 w-4" />,
    iconRight: <Mail className="h-4 w-4" />,
  },
};

// Interactive examples
export const PasswordWithToggle: Story = {
  render: () => {
    const [showPassword, setShowPassword] = React.useState(false);
    return (
      <FormInputAny
        label="Password"
        type={showPassword ? 'text' : 'password'}
        placeholder="Enter password"
        icon={<Lock className="h-4 w-4" />}
        iconRight={
          showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )
        }
        onIconRightClick={() => setShowPassword(!showPassword)}
      />
    );
  },
};

// Sizes
export const Small: Story = {
  args: {
    label: 'Small Input',
    size: 'sm',
    placeholder: 'Small size',
  } as any,
};

export const Medium: Story = {
  args: {
    label: 'Medium Input',
    size: 'md',
    placeholder: 'Medium size (default)',
  } as any,
};

export const Large: Story = {
  args: {
    label: 'Large Input',
    size: 'lg',
    placeholder: 'Large size',
  } as any,
};

// Variants
export const DefaultVariant: Story = {
  args: {
    label: 'Default Variant',
    variant: 'default',
    placeholder: 'Default style',
  } as any,
};

export const FilledVariant: Story = {
  args: {
    label: 'Filled Variant',
    variant: 'filled',
    placeholder: 'Filled style',
  } as any,
};

export const OutlineVariant: Story = {
  args: {
    label: 'Outline Variant',
    variant: 'outline',
    placeholder: 'Outline style',
  } as any,
};

// Input types
export const EmailInput: Story = {
  args: {
    label: 'Email Address',
    type: 'email',
    placeholder: 'your@email.com',
    icon: <Mail className="h-4 w-4" />,
  },
};

export const PasswordInput: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter password',
    icon: <Lock className="h-4 w-4" />,
  },
};

export const PhoneInput: Story = {
  args: {
    label: 'Phone Number',
    type: 'tel',
    placeholder: '+1 (555) 000-0000',
    icon: <Phone className="h-4 w-4" />,
  },
};

export const NumberInput: Story = {
  args: {
    label: 'Age',
    type: 'number',
    placeholder: '0',
  },
};

// All sizes comparison
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-96">
      <FormInputAny label="Small (sm)" size="sm" placeholder="Small input" />
      <FormInputAny label="Medium (md)" size="md" placeholder="Medium input (default)" />
      <FormInputAny label="Large (lg)" size="lg" placeholder="Large input" />
    </div>
  ),
};

// All variants comparison
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-96">
      <FormInputAny label="Default" variant="default" placeholder="Default variant" />
      <FormInputAny label="Filled" variant="filled" placeholder="Filled variant" />
      <FormInputAny label="Outline" variant="outline" placeholder="Outline variant" />
    </div>
  ),
};

// States comparison
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-96">
      <FormInput label="Normal" placeholder="Normal state" />
      <FormInputAny
        label="With Helper"
        placeholder="With helper text"
        helperText="This is helper text"
      />
      <FormInput label="Error" placeholder="Error state" error="This field is required" />
      <FormInput label="Disabled" placeholder="Disabled state" disabled value="Cannot edit" />
    </div>
  ),
};

// Real-world login form
export const LoginForm: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-96 p-8 border rounded-lg">
      <h2 className="text-2xl font-bold mb-2">Sign In</h2>
      <FormInput
        label="Email"
        type="email"
        placeholder="your@email.com"
        icon={<Mail className="h-4 w-4" />}
        required
      />
      <FormInput
        label="Password"
        type="password"
        placeholder="Enter password"
        icon={<Lock className="h-4 w-4" />}
        required
      />
    </div>
  ),
};

// Real-world registration form
export const RegistrationForm: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-96 p-8 border rounded-lg">
      <h2 className="text-2xl font-bold mb-2">Create Account</h2>
      <FormInput
        label="Full Name"
        placeholder="John Doe"
        icon={<User className="h-4 w-4" />}
        required
      />
      <FormInput
        label="Email"
        type="email"
        placeholder="your@email.com"
        icon={<Mail className="h-4 w-4" />}
        required
      />
      <FormInputAny
        label="Password"
        type="password"
        placeholder="Enter password"
        icon={<Lock className="h-4 w-4" />}
        helperText="Must be at least 8 characters"
        required
      />
      <FormInput
        label="Phone"
        type="tel"
        placeholder="+1 (555) 000-0000"
        icon={<Phone className="h-4 w-4" />}
      />
    </div>
  ),
};

// Form with validation errors
export const ValidationErrors: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-96 p-8 border rounded-lg">
      <h2 className="text-2xl font-bold mb-2">Form with Errors</h2>
      <FormInput
        label="Email"
        type="email"
        placeholder="your@email.com"
        icon={<Mail className="h-4 w-4" />}
        error="Please enter a valid email address"
        required
      />
      <FormInput
        label="Password"
        type="password"
        placeholder="Enter password"
        icon={<Lock className="h-4 w-4" />}
        error="Password must be at least 8 characters"
        required
      />
    </div>
  ),
};
