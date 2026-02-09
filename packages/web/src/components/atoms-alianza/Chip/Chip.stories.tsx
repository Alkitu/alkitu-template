import type { Meta, StoryObj } from '@storybook/react';
import { Chip } from './Chip';
import { Star, Heart, Mail, CheckCircle, AlertTriangle } from 'lucide-react';

const meta: Meta<typeof Chip> = {
  title: 'Atoms/Chip (Alianza)',
  component: Chip,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'primary',
        'secondary',
        'success',
        'warning',
        'error',
        'info',
        'outline',
        'solid',
        'destructive',
      ],
      description: 'Visual variant of the chip',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the chip',
    },
    deletable: {
      control: 'boolean',
      description: 'Whether the chip can be removed',
    },
    selected: {
      control: 'boolean',
      description: 'Whether the chip is selected',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the chip is disabled',
    },
    children: {
      control: 'text',
      description: 'Chip content',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Chip>;

// Basic Variants
export const Default: Story = {
  args: {
    children: 'Default Chip',
    variant: 'default',
  },
};

export const Primary: Story = {
  args: {
    children: 'Primary Chip',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Chip',
    variant: 'secondary',
  },
};

export const Success: Story = {
  args: {
    children: 'Success',
    variant: 'success',
  },
};

export const Warning: Story = {
  args: {
    children: 'Warning',
    variant: 'warning',
  },
};

export const Error: Story = {
  args: {
    children: 'Error',
    variant: 'error',
  },
};

export const Info: Story = {
  args: {
    children: 'Information',
    variant: 'info',
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline Chip',
    variant: 'outline',
  },
};

export const Solid: Story = {
  args: {
    children: 'Solid Chip',
    variant: 'solid',
  },
};

export const Destructive: Story = {
  args: {
    children: 'Destructive',
    variant: 'destructive',
  },
};

// Sizes
export const Small: Story = {
  args: {
    children: 'Small Chip',
    size: 'sm',
    variant: 'primary',
  },
};

export const Medium: Story = {
  args: {
    children: 'Medium Chip',
    size: 'md',
    variant: 'primary',
  },
};

export const Large: Story = {
  args: {
    children: 'Large Chip',
    size: 'lg',
    variant: 'primary',
  },
};

// Deletable Chips
export const Deletable: Story = {
  args: {
    children: 'Deletable Chip',
    variant: 'primary',
    deletable: true,
    onDelete: () => alert('Chip deleted!'),
  },
};

export const DeletableSmall: Story = {
  args: {
    children: 'Small',
    variant: 'success',
    size: 'sm',
    deletable: true,
    onDelete: () => alert('Chip deleted!'),
  },
};

export const DeletableLarge: Story = {
  args: {
    children: 'Large Deletable',
    variant: 'warning',
    size: 'lg',
    deletable: true,
    onDelete: () => alert('Chip deleted!'),
  },
};

// Selected State
export const Selected: Story = {
  args: {
    children: 'Selected Chip',
    variant: 'primary',
    selected: true,
  },
};

export const SelectedInfo: Story = {
  args: {
    children: 'Selected Info',
    variant: 'info',
    selected: true,
  },
};

// Disabled State
export const Disabled: Story = {
  args: {
    children: 'Disabled Chip',
    variant: 'primary',
    disabled: true,
  },
};

export const DisabledDeletable: Story = {
  args: {
    children: 'Disabled Deletable',
    variant: 'warning',
    deletable: true,
    disabled: true,
  },
};

// Clickable Chips
export const Clickable: Story = {
  args: {
    children: 'Clickable Chip',
    variant: 'primary',
    onClick: () => alert('Chip clicked!'),
  },
};

// With Icons
export const WithStartIcon: Story = {
  args: {
    children: 'Starred',
    variant: 'warning',
    startIcon: <Star className="w-3 h-3" />,
  },
};

export const WithEndIcon: Story = {
  args: {
    children: 'Favorite',
    variant: 'error',
    endIcon: <Heart className="w-3 h-3" />,
  },
};

export const WithBothIcons: Story = {
  args: {
    children: 'Message',
    variant: 'info',
    startIcon: <Mail className="w-3 h-3" />,
    endIcon: <CheckCircle className="w-3 h-3" />,
  },
};

export const IconWithDeletable: Story = {
  args: {
    children: 'Important',
    variant: 'warning',
    startIcon: <AlertTriangle className="w-3 h-3" />,
    deletable: true,
    onDelete: () => alert('Chip deleted!'),
  },
};

// All Variants Showcase
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Chip variant="default">Default</Chip>
      <Chip variant="primary">Primary</Chip>
      <Chip variant="secondary">Secondary</Chip>
      <Chip variant="success">Success</Chip>
      <Chip variant="warning">Warning</Chip>
      <Chip variant="error">Error</Chip>
      <Chip variant="info">Info</Chip>
      <Chip variant="outline">Outline</Chip>
      <Chip variant="solid">Solid</Chip>
      <Chip variant="destructive">Destructive</Chip>
    </div>
  ),
};

// All Sizes Showcase
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Chip size="sm" variant="primary">
        Small
      </Chip>
      <Chip size="md" variant="primary">
        Medium
      </Chip>
      <Chip size="lg" variant="primary">
        Large
      </Chip>
    </div>
  ),
};

// Tags Example
export const TagsExample: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Chip variant="info" size="sm" deletable>
        TypeScript
      </Chip>
      <Chip variant="success" size="sm" deletable>
        React
      </Chip>
      <Chip variant="warning" size="sm" deletable>
        Next.js
      </Chip>
      <Chip variant="error" size="sm" deletable>
        Tailwind
      </Chip>
      <Chip variant="primary" size="sm" deletable>
        Storybook
      </Chip>
    </div>
  ),
};

// Status Example
export const StatusExample: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm">Order Status:</span>
        <Chip variant="success" startIcon={<CheckCircle className="w-3 h-3" />}>
          Delivered
        </Chip>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">Payment:</span>
        <Chip variant="warning" startIcon={<AlertTriangle className="w-3 h-3" />}>
          Pending
        </Chip>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">Account:</span>
        <Chip variant="info">Active</Chip>
      </div>
    </div>
  ),
};

// Interactive Chip Group
export const InteractiveChipGroup: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Chip variant="primary" onClick={() => alert('Design clicked!')}>
        Design
      </Chip>
      <Chip variant="primary" onClick={() => alert('Development clicked!')}>
        Development
      </Chip>
      <Chip variant="primary" onClick={() => alert('Marketing clicked!')}>
        Marketing
      </Chip>
      <Chip variant="primary" onClick={() => alert('Sales clicked!')}>
        Sales
      </Chip>
    </div>
  ),
};

// Filter Chips Example
export const FilterChipsExample: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Chip variant="outline" selected>
        All
      </Chip>
      <Chip variant="outline">Active</Chip>
      <Chip variant="outline">Pending</Chip>
      <Chip variant="outline">Completed</Chip>
    </div>
  ),
};

// Custom Styling
export const CustomStyling: Story = {
  args: {
    children: 'Custom Styled Chip',
    className: 'text-purple-600 bg-purple-100 border-purple-300',
    useSystemColors: false,
  },
};

export const ThemeOverride: Story = {
  args: {
    children: 'Theme Override',
    themeOverride: {
      backgroundColor: '#ff6b9d',
      color: '#ffffff',
      borderColor: '#c9184a',
    },
  },
};

// Long Content
export const LongContent: Story = {
  args: {
    children: 'This is a very long chip content that should be truncated',
    variant: 'primary',
    className: 'max-w-xs',
  },
};

// Responsive Chip Group
export const ResponsiveChipGroup: Story = {
  render: () => (
    <div className="max-w-md p-4 border rounded-lg">
      <h3 className="text-sm font-medium mb-2">Selected Categories:</h3>
      <div className="flex flex-wrap gap-2">
        {[
          'Frontend Development',
          'Backend Development',
          'UI/UX Design',
          'Mobile Development',
          'DevOps',
          'Cloud Services',
          'Machine Learning',
          'Data Science',
        ].map((category) => (
          <Chip
            key={category}
            variant="primary"
            size="sm"
            deletable
            onDelete={() => alert(`Remove ${category}`)}
          >
            {category}
          </Chip>
        ))}
      </div>
    </div>
  ),
};
