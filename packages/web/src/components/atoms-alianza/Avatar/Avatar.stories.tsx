import type { Meta, StoryObj } from '@storybook/react';
import { User } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './Avatar';

const meta = {
  title: 'Atomic Design/Atoms/Avatar',
  component: Avatar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Avatar component displays user profile pictures with fallback support. Supports both primitive and simplified APIs, multiple sizes, shapes, and status indicators.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Size of the avatar',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    variant: {
      control: 'select',
      options: ['circular', 'rounded', 'square'],
      description: 'Shape variant of the avatar',
      table: {
        defaultValue: { summary: 'circular' },
      },
    },
    status: {
      control: 'select',
      options: ['none', 'online', 'offline', 'away', 'busy'],
      description: 'Status indicator',
      table: {
        defaultValue: { summary: 'none' },
      },
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Simplified API Stories
export const Default: Story = {
  args: {
    src: 'https://github.com/shadcn.png',
    alt: 'User avatar',
    fallback: 'John Doe',
  },
};

export const WithInitials: Story = {
  args: {
    alt: 'User avatar',
    fallback: 'John Doe',
  },
};

export const WithIcon: Story = {
  args: {
    alt: 'User avatar',
    showIconFallback: true,
  },
};

// Size Variants
export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <Avatar
        size="xs"
        alt="Extra small avatar"
        fallback="XS"
      />
      <Avatar
        size="sm"
        alt="Small avatar"
        fallback="SM"
      />
      <Avatar
        size="md"
        alt="Medium avatar"
        fallback="MD"
      />
      <Avatar
        size="lg"
        alt="Large avatar"
        fallback="LG"
      />
      <Avatar
        size="xl"
        alt="Extra large avatar"
        fallback="XL"
      />
      <Avatar
        size="2xl"
        alt="2XL avatar"
        fallback="2XL"
      />
    </div>
  ),
};

// Shape Variants
export const Shapes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar
        variant="circular"
        alt="Circular avatar"
        fallback="CI"
      />
      <Avatar
        variant="rounded"
        alt="Rounded avatar"
        fallback="RO"
      />
      <Avatar
        variant="square"
        alt="Square avatar"
        fallback="SQ"
      />
    </div>
  ),
};

// Status Indicators
export const StatusOnline: Story = {
  args: {
    alt: 'User avatar',
    fallback: 'John Doe',
    status: 'online',
  },
};

export const StatusOffline: Story = {
  args: {
    alt: 'User avatar',
    fallback: 'Jane Doe',
    status: 'offline',
  },
};

export const StatusAway: Story = {
  args: {
    alt: 'User avatar',
    fallback: 'Alex Smith',
    status: 'away',
  },
};

export const StatusBusy: Story = {
  args: {
    alt: 'User avatar',
    fallback: 'Sam Wilson',
    status: 'busy',
  },
};

// All Status Indicators
export const AllStatuses: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <Avatar
          alt="Online user"
          fallback="ON"
          status="online"
          size="lg"
        />
        <span className="text-sm">Online</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar
          alt="Offline user"
          fallback="OF"
          status="offline"
          size="lg"
        />
        <span className="text-sm">Offline</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar
          alt="Away user"
          fallback="AW"
          status="away"
          size="lg"
        />
        <span className="text-sm">Away</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar
          alt="Busy user"
          fallback="BU"
          status="busy"
          size="lg"
        />
        <span className="text-sm">Busy</span>
      </div>
    </div>
  ),
};

// Primitive API Stories
export const PrimitiveAPI: Story = {
  render: () => (
    <Avatar size="lg" variant="circular">
      <AvatarImage src="https://github.com/shadcn.png" alt="User" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

export const PrimitiveWithStatus: Story = {
  render: () => (
    <Avatar size="lg" variant="rounded" status="online">
      <AvatarImage src="https://github.com/vercel.png" alt="Vercel" />
      <AvatarFallback>VC</AvatarFallback>
    </Avatar>
  ),
};

export const PrimitiveWithIcon: Story = {
  render: () => (
    <Avatar size="lg">
      <AvatarFallback>
        <User className="h-6 w-6" />
      </AvatarFallback>
    </Avatar>
  ),
};

// Complex Examples
export const UserList: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Avatar
          src="https://github.com/shadcn.png"
          alt="John Doe"
          fallback="John Doe"
          status="online"
        />
        <div>
          <div className="font-medium">John Doe</div>
          <div className="text-sm text-muted-foreground">Online</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Avatar
          alt="Jane Smith"
          fallback="Jane Smith"
          status="away"
        />
        <div>
          <div className="font-medium">Jane Smith</div>
          <div className="text-sm text-muted-foreground">Away</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Avatar
          alt="Bob Johnson"
          fallback="Bob Johnson"
          status="busy"
        />
        <div>
          <div className="font-medium">Bob Johnson</div>
          <div className="text-sm text-muted-foreground">Busy</div>
        </div>
      </div>
    </div>
  ),
};

// Avatar Group
export const AvatarGroup: Story = {
  render: () => (
    <div className="flex -space-x-2">
      <Avatar
        src="https://github.com/shadcn.png"
        alt="User 1"
        fallback="U1"
        className="border-2 border-background"
      />
      <Avatar
        alt="User 2"
        fallback="U2"
        className="border-2 border-background"
      />
      <Avatar
        alt="User 3"
        fallback="U3"
        className="border-2 border-background"
      />
      <Avatar
        alt="User 4"
        fallback="U4"
        className="border-2 border-background"
      />
      <Avatar
        alt="+5 more"
        fallback="+5"
        className="border-2 border-background"
      />
    </div>
  ),
};

// Dark Mode Test
export const DarkModeTest: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  render: () => (
    <div className="dark space-y-4">
      <div className="flex items-center gap-4">
        <Avatar
          src="https://github.com/shadcn.png"
          alt="User"
          fallback="JD"
          status="online"
          size="lg"
        />
        <Avatar
          alt="User"
          fallback="JD"
          status="away"
          size="lg"
        />
        <Avatar
          alt="User"
          showIconFallback={true}
          status="busy"
          size="lg"
        />
      </div>
    </div>
  ),
};

// Interactive Playground
export const Interactive: Story = {
  args: {
    src: 'https://github.com/shadcn.png',
    alt: 'User avatar',
    fallback: 'John Doe',
    size: 'lg',
    variant: 'circular',
    status: 'online',
  },
};
