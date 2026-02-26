import type { Meta, StoryObj } from '@storybook/react';
import { InputGroup } from './InputGroup';
import { Mail, Lock, Eye, EyeOff, User, Phone, Search, MapPin } from 'lucide-react';
import React from 'react';

const meta = {
  title: 'Molecules/Alianza/InputGroup',
  component: InputGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A versatile form field molecule that can render as input, textarea, or select with label, icons, and validation messages. Supports multiple input types and states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text for the input field',
    },
    as: {
      control: 'select',
      options: ['input', 'textarea', 'select'],
      description: 'Type of input element to render',
    },
    variant: {
      control: 'select',
      options: ['default', 'error', 'success'],
      description: 'Visual variant of the input',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
      description: 'HTML input type (when as="input")',
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required (shows * indicator)',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    message: {
      control: 'text',
      description: 'Helper text or error message to display',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = Omit<StoryObj<typeof meta>, 'args'> & Partial<Pick<StoryObj<typeof meta>, 'args'>>;

// ============================================================================
// BASIC EXAMPLES
// ============================================================================

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
    message: 'Must be at least 8 characters',
  },
};

export const WithError: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter username',
    variant: 'error',
    message: 'Username is already taken',
  },
};

export const WithSuccess: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'your@email.com',
    variant: 'success',
    message: 'Email is available',
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

export const WithoutLabel: Story = {
  args: {
    placeholder: 'Input without label',
    type: 'text',
  },
};

// ============================================================================
// INPUT TYPES
// ============================================================================

export const EmailInput: Story = {
  args: {
    label: 'Email Address',
    type: 'email',
    placeholder: 'your@email.com',
    iconLeft: <Mail className="h-4 w-4" />,
  },
};

export const PasswordInput: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter password',
    iconLeft: <Lock className="h-4 w-4" />,
  },
};

export const PhoneInput: Story = {
  args: {
    label: 'Phone Number',
    type: 'tel',
    placeholder: '+1 (555) 000-0000',
    iconLeft: <Phone className="h-4 w-4" />,
  },
};

export const NumberInput: Story = {
  args: {
    label: 'Age',
    type: 'number',
    placeholder: '0',
  },
};

export const SearchInput: Story = {
  args: {
    label: 'Search',
    type: 'search',
    placeholder: 'Search...',
    iconLeft: <Search className="h-4 w-4" />,
  },
};

export const URLInput: Story = {
  args: {
    label: 'Website',
    type: 'url',
    placeholder: 'https://example.com',
  },
};

// ============================================================================
// TEXTAREA VARIANT
// ============================================================================

export const TextareaBasic: Story = {
  args: {
    label: 'Description',
    as: 'textarea',
    placeholder: 'Enter description...',
  },
};

export const TextareaWithMessage: Story = {
  args: {
    label: 'Comments',
    as: 'textarea',
    placeholder: 'Enter your comments...',
    message: 'Maximum 500 characters',
  },
};

export const TextareaWithError: Story = {
  args: {
    label: 'Description',
    as: 'textarea',
    placeholder: 'Enter description...',
    variant: 'error',
    message: 'This field is required',
  },
};

export const TextareaDisabled: Story = {
  args: {
    label: 'Readonly Description',
    as: 'textarea',
    disabled: true,
    value: 'This content cannot be edited',
  },
};

// ============================================================================
// SELECT VARIANT
// ============================================================================

export const SelectBasic: Story = {
  args: {
    label: 'Country',
    as: 'select',
    selectOptions: [
      { label: 'United States', value: 'us' },
      { label: 'Canada', value: 'ca' },
      { label: 'Mexico', value: 'mx' },
      { label: 'United Kingdom', value: 'uk' },
    ],
    placeholder: 'Select a country',
  },
};

export const SelectWithMessage: Story = {
  args: {
    label: 'Priority',
    as: 'select',
    selectOptions: [
      { label: 'Low', value: 'low' },
      { label: 'Medium', value: 'medium' },
      { label: 'High', value: 'high' },
      { label: 'Critical', value: 'critical' },
    ],
    message: 'Choose the priority level',
  },
};

export const SelectWithError: Story = {
  args: {
    label: 'Department',
    as: 'select',
    selectOptions: [
      { label: 'Engineering', value: 'eng' },
      { label: 'Marketing', value: 'mkt' },
      { label: 'Sales', value: 'sales' },
    ],
    variant: 'error',
    message: 'Please select a department',
  },
};

export const SelectDisabled: Story = {
  args: {
    label: 'Locked Choice',
    as: 'select',
    selectOptions: [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' },
    ],
    disabled: true,
  },
};

// ============================================================================
// WITH ICONS
// ============================================================================

export const WithLeftIcon: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'your@email.com',
    iconLeft: <Mail className="h-4 w-4" />,
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
    iconLeft: <User className="h-4 w-4" />,
    iconRight: <Mail className="h-4 w-4" />,
  },
};

export const PasswordWithToggle: Story = {
  render: () => {
    const [showPassword, setShowPassword] = React.useState(false);
    return (
      <InputGroup
        label="Password"
        type={showPassword ? 'text' : 'password'}
        placeholder="Enter password"
        iconLeft={<Lock className="h-4 w-4" />}
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

// ============================================================================
// VARIANTS COMPARISON
// ============================================================================

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-96">
      <InputGroup label="Default" variant="default" placeholder="Default variant" />
      <InputGroup
        label="Error"
        variant="error"
        placeholder="Error variant"
        message="This field has an error"
      />
      <InputGroup
        label="Success"
        variant="success"
        placeholder="Success variant"
        message="This field is valid"
      />
    </div>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-96">
      <InputGroup label="Normal" placeholder="Normal state" />
      <InputGroup
        label="With Message"
        placeholder="With helper text"
        message="This is helper text"
      />
      <InputGroup
        label="Error"
        placeholder="Error state"
        variant="error"
        message="This field is required"
      />
      <InputGroup
        label="Success"
        placeholder="Success state"
        variant="success"
        message="Looks good!"
      />
      <InputGroup
        label="Required"
        placeholder="Required field"
        required
        message="This field is required"
      />
      <InputGroup label="Disabled" placeholder="Disabled state" disabled value="Cannot edit" />
    </div>
  ),
};

// ============================================================================
// INPUT TYPE COMPARISON
// ============================================================================

export const AllInputTypes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-96">
      <InputGroup label="Input" as="input" placeholder="Standard input" />
      <InputGroup label="Textarea" as="textarea" placeholder="Resizable textarea" />
      <InputGroup
        label="Select"
        as="select"
        selectOptions={[
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' },
        ]}
        placeholder="Select an option"
      />
    </div>
  ),
};

// ============================================================================
// REAL-WORLD FORMS
// ============================================================================

export const LoginForm: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-96 p-8 border rounded-lg">
      <h2 className="text-2xl font-bold mb-2">Sign In</h2>
      <InputGroup
        label="Email"
        type="email"
        placeholder="your@email.com"
        iconLeft={<Mail className="h-4 w-4" />}
        required
      />
      <InputGroup
        label="Password"
        type="password"
        placeholder="Enter password"
        iconLeft={<Lock className="h-4 w-4" />}
        required
      />
    </div>
  ),
};

export const RegistrationForm: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-96 p-8 border rounded-lg">
      <h2 className="text-2xl font-bold mb-2">Create Account</h2>
      <InputGroup
        label="Full Name"
        placeholder="John Doe"
        iconLeft={<User className="h-4 w-4" />}
        required
      />
      <InputGroup
        label="Email"
        type="email"
        placeholder="your@email.com"
        iconLeft={<Mail className="h-4 w-4" />}
        required
      />
      <InputGroup
        label="Password"
        type="password"
        placeholder="Enter password"
        iconLeft={<Lock className="h-4 w-4" />}
        message="Must be at least 8 characters"
        required
      />
      <InputGroup
        label="Phone"
        type="tel"
        placeholder="+1 (555) 000-0000"
        iconLeft={<Phone className="h-4 w-4" />}
      />
    </div>
  ),
};

export const ContactForm: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-96 p-8 border rounded-lg">
      <h2 className="text-2xl font-bold mb-2">Contact Us</h2>
      <InputGroup
        label="Name"
        placeholder="Your name"
        iconLeft={<User className="h-4 w-4" />}
        required
      />
      <InputGroup
        label="Email"
        type="email"
        placeholder="your@email.com"
        iconLeft={<Mail className="h-4 w-4" />}
        required
      />
      <InputGroup
        label="Subject"
        as="select"
        selectOptions={[
          { label: 'General Inquiry', value: 'general' },
          { label: 'Technical Support', value: 'support' },
          { label: 'Sales', value: 'sales' },
          { label: 'Feedback', value: 'feedback' },
        ]}
        placeholder="Select a subject"
        required
      />
      <InputGroup
        label="Message"
        as="textarea"
        placeholder="Enter your message..."
        required
      />
    </div>
  ),
};

export const ValidationErrors: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-96 p-8 border rounded-lg">
      <h2 className="text-2xl font-bold mb-2">Form with Errors</h2>
      <InputGroup
        label="Email"
        type="email"
        placeholder="your@email.com"
        iconLeft={<Mail className="h-4 w-4" />}
        variant="error"
        message="Please enter a valid email address"
        required
      />
      <InputGroup
        label="Password"
        type="password"
        placeholder="Enter password"
        iconLeft={<Lock className="h-4 w-4" />}
        variant="error"
        message="Password must be at least 8 characters"
        required
      />
      <InputGroup
        label="Age"
        type="number"
        placeholder="0"
        variant="error"
        message="Age must be 18 or older"
      />
    </div>
  ),
};

export const ProfileForm: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-96 p-8 border rounded-lg">
      <h2 className="text-2xl font-bold mb-2">Profile Settings</h2>
      <InputGroup
        label="Display Name"
        placeholder="John Doe"
        iconLeft={<User className="h-4 w-4" />}
      />
      <InputGroup
        label="Email"
        type="email"
        placeholder="john@example.com"
        iconLeft={<Mail className="h-4 w-4" />}
        variant="success"
        message="Email verified"
      />
      <InputGroup
        label="Location"
        placeholder="City, Country"
        iconLeft={<MapPin className="h-4 w-4" />}
      />
      <InputGroup
        label="Bio"
        as="textarea"
        placeholder="Tell us about yourself..."
        message="Maximum 500 characters"
      />
    </div>
  ),
};

// ============================================================================
// EDGE CASES
// ============================================================================

export const LongLabel: Story = {
  args: {
    label: 'This is a very long label that might wrap to multiple lines',
    placeholder: 'Input field',
  },
};

export const LongMessage: Story = {
  args: {
    label: 'Email',
    placeholder: 'your@email.com',
    message: 'This is a very long helper message that provides detailed information about what should be entered in this field and might wrap to multiple lines.',
  },
};

export const LongErrorMessage: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter password',
    variant: 'error',
    message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
  },
};

export const MultipleRequired: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-96">
      <InputGroup label="First Name" required placeholder="John" />
      <InputGroup label="Last Name" required placeholder="Doe" />
      <InputGroup label="Email" type="email" required placeholder="john@example.com" />
      <InputGroup label="Phone" type="tel" required placeholder="+1 (555) 000-0000" />
    </div>
  ),
};
