import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Mail, User, MapPin, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import { FormSelect } from './FormSelect';
import type { SelectOption, SelectGroupOption } from '@/components/atoms-alianza/Select';

const meta = {
  title: 'Molecules/Alianza/FormSelect',
  component: FormSelect,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A composite form field component that combines a label, select input, optional icon, error message, and helper text. Built on top of the Select atom for consistent form field patterns.',
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
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    required: {
      control: 'boolean',
      description: 'Required field indicator',
    },
    showOptional: {
      control: 'boolean',
      description: 'Show optional indicator',
    },
  },
  args: {
    onValueChange: () => {},
  },
} satisfies Meta<typeof FormSelect>;

export default meta;
type Story = Omit<StoryObj<typeof meta>, 'args'> & Partial<Pick<StoryObj<typeof meta>, 'args'>>;

// Sample data
const simpleOptions: SelectOption[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  { value: 'option4', label: 'Option 4' },
];

const countryOptions: SelectOption[] = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
];

const statusOptions: SelectOption[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
  { value: 'archived', label: 'Archived' },
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
];

// Basic stories
export const Default: Story = {
  args: {
    label: 'Select an option',
    options: simpleOptions,
    value: '',
    placeholder: 'Choose an option...',
  },
};

export const WithValue: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    value: 'us',
    placeholder: 'Select your country',
  },
};

export const WithIcon: Story = {
  args: {
    label: 'Email Type',
    options: [
      { value: 'personal', label: 'Personal' },
      { value: 'work', label: 'Work' },
      { value: 'other', label: 'Other' },
    ],
    value: '',
    icon: <Mail />,
    placeholder: 'Select email type',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    value: '',
    helperText: 'Select the country where you currently reside',
    placeholder: 'Choose your country',
  },
};

export const WithError: Story = {
  args: {
    label: 'Status',
    options: statusOptions,
    value: '',
    error: 'Please select a status',
    placeholder: 'Select status',
  },
};

export const Required: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    value: '',
    required: true,
    placeholder: 'Select your country',
    helperText: 'This field is required',
  },
};

export const Optional: Story = {
  args: {
    label: 'Phone Type',
    options: [
      { value: 'mobile', label: 'Mobile' },
      { value: 'home', label: 'Home' },
      { value: 'work', label: 'Work' },
    ],
    value: '',
    showOptional: true,
    placeholder: 'Select phone type',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Select',
    options: simpleOptions,
    value: 'option1',
    disabled: true,
  },
};

// With icons
export const WithUserIcon: Story = {
  args: {
    label: 'User Role',
    options: [
      { value: 'admin', label: 'Administrator' },
      { value: 'user', label: 'User' },
      { value: 'guest', label: 'Guest' },
    ],
    value: '',
    icon: <User />,
    placeholder: 'Select user role',
  },
};

export const WithLocationIcon: Story = {
  args: {
    label: 'Location',
    options: countryOptions,
    value: '',
    icon: <MapPin />,
    placeholder: 'Select location',
  },
};

export const WithPhoneIcon: Story = {
  args: {
    label: 'Phone Type',
    options: [
      { value: 'mobile', label: 'Mobile' },
      { value: 'home', label: 'Home' },
      { value: 'work', label: 'Work' },
    ],
    value: '',
    icon: <Phone />,
    placeholder: 'Select phone type',
  },
};

// Grouped options
export const GroupedOptions: Story = {
  args: {
    label: 'Category',
    options: groupedOptions,
    value: '',
    placeholder: 'Select a category',
  },
};

// Variants
export const VariantDefault: Story = {
  args: {
    label: 'Default Variant',
    options: simpleOptions,
    value: '',
    variant: 'default',
    placeholder: 'Default variant',
  },
};

export const VariantGhost: Story = {
  args: {
    label: 'Ghost Variant',
    options: simpleOptions,
    value: '',
    variant: 'ghost',
    placeholder: 'Ghost variant',
  },
};

export const VariantFilled: Story = {
  args: {
    label: 'Filled Variant',
    options: simpleOptions,
    value: '',
    variant: 'filled',
    placeholder: 'Filled variant',
  },
};

// Sizes
export const SizeSmall: Story = {
  args: {
    label: 'Small Size',
    options: simpleOptions,
    value: '',
    size: 'sm',
    placeholder: 'Small select',
  },
};

export const SizeMedium: Story = {
  args: {
    label: 'Medium Size',
    options: simpleOptions,
    value: '',
    size: 'md',
    placeholder: 'Medium select',
  },
};

export const SizeLarge: Story = {
  args: {
    label: 'Large Size',
    options: simpleOptions,
    value: '',
    size: 'lg',
    placeholder: 'Large select',
  },
};

// Complex examples
export const CompleteForm: Story = {
  render: (args) => {
    const [country, setCountry] = React.useState('');
    const [status, setStatus] = React.useState('');
    const [role, setRole] = React.useState('');

    return (
      <div className="w-96 space-y-6">
        <FormSelect
          label="Country"
          options={countryOptions}
          value={country}
          onValueChange={setCountry}
          icon={<MapPin />}
          placeholder="Select your country"
          required
          helperText="Choose your country of residence"
        />

        <FormSelect
          label="Status"
          options={statusOptions}
          value={status}
          onValueChange={setStatus}
          icon={<CheckCircle />}
          placeholder="Select status"
          required
          error={!status ? 'Status is required' : undefined}
        />

        <FormSelect
          label="Role"
          options={[
            { value: 'admin', label: 'Administrator' },
            { value: 'user', label: 'User' },
            { value: 'guest', label: 'Guest' },
          ]}
          value={role}
          onValueChange={setRole}
          icon={<User />}
          placeholder="Select your role"
          showOptional
        />
      </div>
    );
  },
};

export const WithValidation: Story = {
  render: () => {
    const [value, setValue] = React.useState('');
    const [touched, setTouched] = React.useState(false);

    const error = touched && !value ? 'This field is required' : undefined;

    return (
      <div className="w-96">
        <FormSelect
          label="Country"
          options={countryOptions}
          value={value}
          onValueChange={(newValue) => {
            setValue(newValue);
            setTouched(true);
          }}
          icon={<MapPin />}
          placeholder="Select your country"
          required
          error={error}
          helperText={!error ? 'Please select your country' : undefined}
        />
      </div>
    );
  },
};

export const MultipleSelects: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <FormSelect
        label="Small Select"
        options={simpleOptions}
        value=""
        onValueChange={() => {}}
        size="sm"
        placeholder="Small"
      />
      <FormSelect
        label="Medium Select"
        options={simpleOptions}
        value=""
        onValueChange={() => {}}
        size="md"
        placeholder="Medium"
      />
      <FormSelect
        label="Large Select"
        options={simpleOptions}
        value=""
        onValueChange={() => {}}
        size="lg"
        placeholder="Large"
      />
    </div>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div className="w-full max-w-4xl space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">States</h3>
        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            label="Default"
            options={simpleOptions}
            value=""
            onValueChange={() => {}}
            placeholder="Default state"
          />
          <FormSelect
            label="With Value"
            options={simpleOptions}
            value="option2"
            onValueChange={() => {}}
          />
          <FormSelect
            label="With Error"
            options={simpleOptions}
            value=""
            onValueChange={() => {}}
            error="This field is required"
            placeholder="Error state"
          />
          <FormSelect
            label="Disabled"
            options={simpleOptions}
            value="option1"
            onValueChange={() => {}}
            disabled
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">With Icons</h3>
        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            label="User"
            options={simpleOptions}
            value=""
            onValueChange={() => {}}
            icon={<User />}
            placeholder="With user icon"
          />
          <FormSelect
            label="Mail"
            options={simpleOptions}
            value=""
            onValueChange={() => {}}
            icon={<Mail />}
            placeholder="With mail icon"
          />
          <FormSelect
            label="Location"
            options={simpleOptions}
            value=""
            onValueChange={() => {}}
            icon={<MapPin />}
            placeholder="With location icon"
          />
          <FormSelect
            label="Phone"
            options={simpleOptions}
            value=""
            onValueChange={() => {}}
            icon={<Phone />}
            placeholder="With phone icon"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Variants</h3>
        <div className="grid grid-cols-3 gap-4">
          <FormSelect
            label="Default"
            options={simpleOptions}
            value=""
            onValueChange={() => {}}
            variant="default"
            placeholder="Default variant"
          />
          <FormSelect
            label="Ghost"
            options={simpleOptions}
            value=""
            onValueChange={() => {}}
            variant="ghost"
            placeholder="Ghost variant"
          />
          <FormSelect
            label="Filled"
            options={simpleOptions}
            value=""
            onValueChange={() => {}}
            variant="filled"
            placeholder="Filled variant"
          />
        </div>
      </div>
    </div>
  ),
};
