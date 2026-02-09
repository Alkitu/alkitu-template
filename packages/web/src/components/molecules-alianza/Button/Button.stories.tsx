import type { Meta, StoryObj } from '@storybook/react';
import { Heart, ChevronRight, Send, Trash2, Plus } from 'lucide-react';
import { Button } from './index';

const meta: Meta<typeof Button> = {
  title: 'Molecules/Alianza/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Improved Button component with features from both Standard and Alianza systems. Supports loading states, icons, variants, and can be used as a polymorphic component with `asChild`.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'main',
        'active',
        'outline',
        'nude',
        'destructive',
        'primary',
        'secondary',
        'solid',
        'ghost',
      ],
      description:
        'Visual variant of the button. Supports both Alianza (main, active, nude) and Standard (primary, secondary, ghost) naming.',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the button',
    },
    loading: {
      control: 'boolean',
      description: 'Shows a spinner and disables the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Makes the button take full width of its container',
    },
    iconOnly: {
      control: 'boolean',
      description: 'Makes the button square for icon-only usage',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// Basic variants
export const Main: Story = {
  args: {
    variant: 'main',
    children: 'Main Button',
  },
};

export const Active: Story = {
  args: {
    variant: 'active',
    children: 'Active Button',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
};

export const Nude: Story = {
  args: {
    variant: 'nude',
    children: 'Nude Button',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive Button',
  },
};

// Sizes
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    children: 'Medium Button',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
};

// With Icons
export const WithIconLeft: Story = {
  args: {
    iconLeft: <Heart />,
    children: 'Like',
  },
};

export const WithIconRight: Story = {
  args: {
    iconRight: <ChevronRight />,
    children: 'Next',
  },
};

export const WithBothIcons: Story = {
  args: {
    iconLeft: <Send />,
    iconRight: <ChevronRight />,
    children: 'Send Message',
  },
};

// Icon Only
export const IconOnlySmall: Story = {
  args: {
    iconOnly: true,
    size: 'sm',
    iconLeft: <Heart />,
    children: <span className="sr-only">Like</span>,
  },
};

export const IconOnlyMedium: Story = {
  args: {
    iconOnly: true,
    size: 'md',
    iconLeft: <Heart />,
    children: <span className="sr-only">Like</span>,
  },
};

export const IconOnlyLarge: Story = {
  args: {
    iconOnly: true,
    size: 'lg',
    iconLeft: <Plus />,
    children: <span className="sr-only">Add</span>,
  },
};

// States
export const Loading: Story = {
  args: {
    loading: true,
    children: 'Loading...',
  },
};

export const LoadingWithIcon: Story = {
  args: {
    loading: true,
    iconLeft: <Send />,
    children: 'Sending...',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: 'Full Width Button',
  },
  parameters: {
    layout: 'padded',
  },
};

// Complex Examples
export const AllVariantsShowcase: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap">
        <Button variant="main">Main</Button>
        <Button variant="active">Active</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="nude">Nude</Button>
        <Button variant="destructive">Destructive</Button>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Button variant="primary">Primary (alias)</Button>
        <Button variant="secondary">Secondary (alias)</Button>
        <Button variant="ghost">Ghost (alias)</Button>
      </div>
    </div>
  ),
};

export const AllSizesShowcase: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const IconButtonsShowcase: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button iconOnly size="sm" iconLeft={<Heart />}>
          <span className="sr-only">Like</span>
        </Button>
        <Button iconOnly size="md" iconLeft={<Heart />}>
          <span className="sr-only">Like</span>
        </Button>
        <Button iconOnly size="lg" iconLeft={<Heart />}>
          <span className="sr-only">Like</span>
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button iconOnly variant="destructive" iconLeft={<Trash2 />}>
          <span className="sr-only">Delete</span>
        </Button>
        <Button iconOnly variant="outline" iconLeft={<Plus />}>
          <span className="sr-only">Add</span>
        </Button>
        <Button iconOnly variant="nude" iconLeft={<Send />}>
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </div>
  ),
};

export const RealWorldExamples: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4">
      {/* Login form actions */}
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold mb-2">Login Form</h3>
        <Button fullWidth variant="main" iconRight={<ChevronRight />}>
          Sign In
        </Button>
        <Button fullWidth variant="nude">
          Forgot Password?
        </Button>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold mb-2">Actions</h3>
        <div className="flex gap-2">
          <Button variant="main" iconLeft={<Plus />}>
            Create New
          </Button>
          <Button variant="outline" iconLeft={<Send />}>
            Send Invite
          </Button>
          <Button variant="destructive" iconLeft={<Trash2 />}>
            Delete
          </Button>
        </div>
      </div>

      {/* Loading states */}
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold mb-2">Loading States</h3>
        <div className="flex gap-2">
          <Button loading iconLeft={<Send />}>
            Sending...
          </Button>
          <Button loading variant="outline">
            Processing...
          </Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// AsChild example (polymorphic)
export const AsLinkExample: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Button asChild variant="main">
        <a href="https://alkitu.com" target="_blank" rel="noopener noreferrer">
          Visit Alkitu
        </a>
      </Button>
      <p className="text-sm text-muted-foreground">
        This button is actually an anchor tag using the `asChild` prop (Radix Slot)
      </p>
    </div>
  ),
};
