import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Heart, Star, Zap } from 'lucide-react';
import { Combobox, ComboboxPresets } from './Combobox';
import type { ComboboxOption } from './Combobox.types';

const meta = {
  title: 'Molecules/Alianza/Combobox',
  component: Combobox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'multiple', 'creatable', 'async'],
      description: 'Visual variant of the combobox',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    searchable: {
      control: 'boolean',
      description: 'Enable search functionality',
    },
    clearable: {
      control: 'boolean',
      description: 'Show clear button',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state for async variant',
    },
  },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = Omit<StoryObj<typeof meta>, 'args'> & Partial<Pick<StoryObj<typeof meta>, 'args'>>;

// Basic options
const basicOptions: ComboboxOption[] = [
  { id: '1', label: 'Apple', value: 'apple' },
  { id: '2', label: 'Banana', value: 'banana' },
  { id: '3', label: 'Cherry', value: 'cherry' },
  { id: '4', label: 'Date', value: 'date' },
  { id: '5', label: 'Elderberry', value: 'elderberry' },
];

// Options with descriptions
const descriptiveOptions: ComboboxOption[] = [
  { id: '1', label: 'Apple', value: 'apple', description: 'A red fruit rich in fiber' },
  { id: '2', label: 'Banana', value: 'banana', description: 'A yellow fruit with potassium' },
  { id: '3', label: 'Cherry', value: 'cherry', description: 'A small red fruit, sweet and tart' },
  { id: '4', label: 'Date', value: 'date', description: 'A sweet brown fruit from palm trees' },
  { id: '5', label: 'Elderberry', value: 'elderberry', description: 'A dark purple berry with medicinal properties' },
];

// Options with icons
const iconOptions: ComboboxOption[] = [
  { id: '1', label: 'Favorite', value: 'favorite', icon: <Heart className="h-4 w-4" /> },
  { id: '2', label: 'Popular', value: 'popular', icon: <Star className="h-4 w-4" /> },
  { id: '3', label: 'Trending', value: 'trending', icon: <Zap className="h-4 w-4" /> },
];

// Options with badges
const badgeOptions: ComboboxOption[] = [
  {
    id: '1',
    label: 'Premium Plan',
    value: 'premium',
    badge: { text: 'Popular', variant: 'default' },
  },
  {
    id: '2',
    label: 'Basic Plan',
    value: 'basic',
    badge: { text: 'Free', variant: 'secondary' },
  },
  {
    id: '3',
    label: 'Enterprise Plan',
    value: 'enterprise',
    badge: { text: 'New', variant: 'outline' },
  },
];

// Options with disabled state
const mixedOptions: ComboboxOption[] = [
  { id: '1', label: 'Available Option', value: 'available' },
  { id: '2', label: 'Disabled Option', value: 'disabled', disabled: true },
  { id: '3', label: 'Another Available', value: 'another' },
];

/**
 * Default combobox with basic single selection
 */
export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<string>('');

    return (
      <div className="w-80">
        <Combobox
          options={basicOptions}
          value={value}
          onChange={(newValue) => setValue(newValue as string)}
          placeholder="Select a fruit..."
        />
      </div>
    );
  },
};

/**
 * Combobox with descriptions for each option
 */
export const WithDescriptions: Story = {
  render: () => {
    const [value, setValue] = useState<string>('');

    return (
      <div className="w-96">
        <Combobox
          options={descriptiveOptions}
          value={value}
          onChange={(newValue) => setValue(newValue as string)}
          placeholder="Select a fruit..."
        />
      </div>
    );
  },
};

/**
 * Combobox with icons in options
 */
export const WithIcons: Story = {
  render: () => {
    const [value, setValue] = useState<string>('');

    return (
      <div className="w-80">
        <Combobox
          options={iconOptions}
          value={value}
          onChange={(newValue) => setValue(newValue as string)}
          placeholder="Select a category..."
        />
      </div>
    );
  },
};

/**
 * Combobox with badges
 */
export const WithBadges: Story = {
  render: () => {
    const [value, setValue] = useState<string>('');

    return (
      <div className="w-96">
        <Combobox
          options={badgeOptions}
          value={value}
          onChange={(newValue) => setValue(newValue as string)}
          placeholder="Choose a plan..."
        />
      </div>
    );
  },
};

/**
 * Multiple selection variant
 */
export const MultipleSelection: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([]);

    return (
      <div className="w-96">
        <Combobox
          variant="multiple"
          options={descriptiveOptions}
          value={value}
          onChange={(newValue) => setValue(newValue as string[])}
          placeholder="Select fruits..."
          maxSelections={5}
        />
      </div>
    );
  },
};

/**
 * Async loading variant
 */
export const AsyncLoading: Story = {
  render: () => {
    const [value, setValue] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState<ComboboxOption[]>([]);

    const handleSearch = (query: string) => {
      setLoading(true);
      setTimeout(() => {
        const filtered = basicOptions.filter((opt) =>
          opt.label.toLowerCase().includes(query.toLowerCase()),
        );
        setOptions(filtered);
        setLoading(false);
      }, 1000);
    };

    return (
      <div className="w-80">
        <Combobox
          variant="async"
          options={options}
          value={value}
          onChange={(newValue) => setValue(newValue as string)}
          onSearch={handleSearch}
          loading={loading}
          placeholder="Search fruits..."
        />
      </div>
    );
  },
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  render: () => {
    return (
      <div className="w-80">
        <Combobox
          options={basicOptions}
          value="apple"
          onChange={() => {}}
          disabled
          placeholder="Select a fruit..."
        />
      </div>
    );
  },
};

/**
 * Not searchable
 */
export const NotSearchable: Story = {
  render: () => {
    const [value, setValue] = useState<string>('');

    return (
      <div className="w-80">
        <Combobox
          options={basicOptions}
          value={value}
          onChange={(newValue) => setValue(newValue as string)}
          searchable={false}
          placeholder="Select a fruit..."
        />
      </div>
    );
  },
};

/**
 * Not clearable
 */
export const NotClearable: Story = {
  render: () => {
    const [value, setValue] = useState<string>('apple');

    return (
      <div className="w-80">
        <Combobox
          options={basicOptions}
          value={value}
          onChange={(newValue) => setValue(newValue as string)}
          clearable={false}
          placeholder="Select a fruit..."
        />
      </div>
    );
  },
};

/**
 * With mixed states (disabled options)
 */
export const WithDisabledOptions: Story = {
  render: () => {
    const [value, setValue] = useState<string>('');

    return (
      <div className="w-80">
        <Combobox
          options={mixedOptions}
          value={value}
          onChange={(newValue) => setValue(newValue as string)}
          placeholder="Select an option..."
        />
      </div>
    );
  },
};

/**
 * Using Basic Preset
 */
export const BasicPreset: Story = {
  render: () => {
    const [value, setValue] = useState<string>('');

    return (
      <div className="w-80">
        <Combobox
          {...ComboboxPresets.basic}
          options={basicOptions}
          value={value}
          onChange={(newValue) => setValue(newValue as string)}
          placeholder="Select a fruit..."
        />
      </div>
    );
  },
};

/**
 * Using Multiple Preset
 */
export const MultiplePreset: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([]);

    return (
      <div className="w-96">
        <Combobox
          {...ComboboxPresets.multiple}
          options={basicOptions}
          value={value}
          onChange={(newValue) => setValue(newValue as string[])}
          placeholder="Select up to 5 fruits..."
        />
      </div>
    );
  },
};

/**
 * Custom empty message
 */
export const CustomEmptyMessage: Story = {
  render: () => {
    const [value, setValue] = useState<string>('');

    return (
      <div className="w-80">
        <Combobox
          options={[]}
          value={value}
          onChange={(newValue) => setValue(newValue as string)}
          placeholder="Select a fruit..."
          emptyMessage="No fruits available. Please try again later."
        />
      </div>
    );
  },
};

/**
 * Pre-selected value
 */
export const PreSelected: Story = {
  render: () => {
    const [value, setValue] = useState<string>('banana');

    return (
      <div className="w-80">
        <Combobox
          options={basicOptions}
          value={value}
          onChange={(newValue) => setValue(newValue as string)}
          placeholder="Select a fruit..."
        />
      </div>
    );
  },
};

/**
 * Multiple pre-selected values
 */
export const MultiplePreSelected: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(['apple', 'banana', 'cherry']);

    return (
      <div className="w-96">
        <Combobox
          variant="multiple"
          options={descriptiveOptions}
          value={value}
          onChange={(newValue) => setValue(newValue as string[])}
          placeholder="Select fruits..."
        />
      </div>
    );
  },
};

/**
 * Combined features: icons, descriptions, and badges
 */
export const CombinedFeatures: Story = {
  render: () => {
    const [value, setValue] = useState<string>('');

    const richOptions: ComboboxOption[] = [
      {
        id: '1',
        label: 'Premium Plan',
        value: 'premium',
        description: 'Full access to all features',
        icon: <Star className="h-4 w-4" />,
        badge: { text: 'Popular', variant: 'default' },
      },
      {
        id: '2',
        label: 'Basic Plan',
        value: 'basic',
        description: 'Essential features for starters',
        icon: <Heart className="h-4 w-4" />,
        badge: { text: 'Free', variant: 'secondary' },
      },
      {
        id: '3',
        label: 'Enterprise Plan',
        value: 'enterprise',
        description: 'Advanced features for teams',
        icon: <Zap className="h-4 w-4" />,
        badge: { text: 'New', variant: 'outline' },
      },
    ];

    return (
      <div className="w-96">
        <Combobox
          options={richOptions}
          value={value}
          onChange={(newValue) => setValue(newValue as string)}
          placeholder="Choose your plan..."
        />
      </div>
    );
  },
};

/**
 * Large option list
 */
export const LargeList: Story = {
  render: () => {
    const [value, setValue] = useState<string>('');

    const largeOptions: ComboboxOption[] = Array.from({ length: 50 }, (_, i) => ({
      id: `${i + 1}`,
      label: `Option ${i + 1}`,
      value: `option-${i + 1}`,
      description: `This is option number ${i + 1}`,
    }));

    return (
      <div className="w-80">
        <Combobox
          options={largeOptions}
          value={value}
          onChange={(newValue) => setValue(newValue as string)}
          placeholder="Search through 50 options..."
        />
      </div>
    );
  },
};

/**
 * Many selections display
 */
export const ManySelections: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([
      'apple',
      'banana',
      'cherry',
      'date',
      'elderberry',
    ]);

    return (
      <div className="w-96">
        <Combobox
          variant="multiple"
          options={descriptiveOptions}
          value={value}
          onChange={(newValue) => setValue(newValue as string[])}
          placeholder="Select fruits..."
        />
      </div>
    );
  },
};
