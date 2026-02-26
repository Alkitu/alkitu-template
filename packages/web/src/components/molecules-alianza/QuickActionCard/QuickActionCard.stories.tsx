/**
 * QuickActionCard - Storybook Stories
 * Atomic Design: Molecule
 */

import type { Meta, StoryObj } from '@storybook/react';
import {
  Plus,
  ClipboardList,
  Settings,
  Users,
  Bell,
  Mail,
  Calendar,
  FileText,
  BarChart,
  Shield,
  CreditCard,
  Package,
} from 'lucide-react';
import { QuickActionCard } from './QuickActionCard';

const meta = {
  title: 'Molecules-Alianza/QuickActionCard',
  component: QuickActionCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'QuickActionCard is a molecule component for displaying quick actions with icons. It can be used as a link or button, supports loading and disabled states, badges, and various icon colors.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: false,
      description: 'Lucide icon component to display',
    },
    label: {
      control: 'text',
      description: 'Main action label/title',
    },
    description: {
      control: 'text',
      description: 'Optional description text',
    },
    subtitle: {
      control: 'text',
      description: 'Optional subtitle (above label)',
    },
    href: {
      control: 'text',
      description: 'Navigation link (renders as Next.js Link)',
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler (renders as button)',
    },
    variant: {
      control: 'select',
      options: ['default', 'primary'],
      description: 'Visual variant of the card',
    },
    iconColor: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info'],
      description: 'Icon color variant',
    },
    customIconColor: {
      control: 'text',
      description: 'Custom icon color class (overrides iconColor)',
    },
    badge: {
      control: 'text',
      description: 'Badge to display (number, string, or React element)',
    },
    badgePosition: {
      control: 'select',
      options: ['top-right', 'top-left'],
      description: 'Badge position',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state (shows spinner)',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
} satisfies Meta<typeof QuickActionCard>;

export default meta;
type Story = Omit<StoryObj<typeof meta>, 'args'> & Partial<Pick<StoryObj<typeof meta>, 'args'>>;

/**
 * Default QuickActionCard with icon and label
 */
export const Default: Story = {
  args: {
    icon: Plus,
    label: 'New Request',
    description: 'Create a new service request',
  },
};

/**
 * QuickActionCard as a link
 */
export const AsLink: Story = {
  args: {
    icon: ClipboardList,
    label: 'View Requests',
    description: 'See all your service requests',
    href: '/requests',
  },
};

/**
 * QuickActionCard as a button with onClick
 */
export const AsButton: Story = {
  args: {
    icon: Settings,
    label: 'Open Settings',
    description: 'Configure your preferences',
  },
};

/**
 * Primary variant with highlighted border
 */
export const PrimaryVariant: Story = {
  args: {
    icon: Plus,
    label: 'Primary Action',
    description: 'This is the main call-to-action',
    variant: 'primary',
  },
};

/**
 * With numeric badge
 */
export const WithBadge: Story = {
  args: {
    icon: Bell,
    label: 'Notifications',
    description: 'You have new notifications',
    badge: 5,
    iconColor: 'info',
  },
};

/**
 * With string badge
 */
export const WithStatusBadge: Story = {
  args: {
    icon: Mail,
    label: 'Messages',
    description: 'Check your messages',
    badge: 'New',
    iconColor: 'success',
  },
};

/**
 * Badge positioned on the left
 */
export const BadgeLeft: Story = {
  args: {
    icon: Calendar,
    label: 'Events',
    description: 'Upcoming events',
    badge: 3,
    badgePosition: 'top-left',
    iconColor: 'warning',
  },
};

/**
 * Loading state with spinner
 */
export const Loading: Story = {
  args: {
    icon: FileText,
    label: 'Saving...',
    description: 'Please wait while we save your changes',
    loading: true,
  },
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    icon: Shield,
    label: 'Unavailable',
    description: 'This action is currently unavailable',
    disabled: true,
  },
};

/**
 * Success icon color
 */
export const SuccessColor: Story = {
  args: {
    icon: Plus,
    label: 'Create Project',
    description: 'Start a new project',
    iconColor: 'success',
  },
};

/**
 * Warning icon color
 */
export const WarningColor: Story = {
  args: {
    icon: Bell,
    label: 'Alerts',
    description: 'System alerts and warnings',
    iconColor: 'warning',
    badge: 2,
  },
};

/**
 * Error icon color
 */
export const ErrorColor: Story = {
  args: {
    icon: Shield,
    label: 'Security Issues',
    description: 'Review security concerns',
    iconColor: 'error',
    badge: 1,
  },
};

/**
 * Info icon color
 */
export const InfoColor: Story = {
  args: {
    icon: FileText,
    label: 'Documentation',
    description: 'Browse help articles',
    iconColor: 'info',
  },
};

/**
 * With subtitle
 */
export const WithSubtitle: Story = {
  args: {
    icon: ClipboardList,
    label: 'Requests',
    subtitle: 'My',
    description: 'View all your requests',
    href: '/requests',
  },
};

/**
 * Without description
 */
export const WithoutDescription: Story = {
  args: {
    icon: Settings,
    label: 'Settings',
    href: '/settings',
  },
};

/**
 * Custom icon color
 */
export const CustomIconColor: Story = {
  args: {
    icon: CreditCard,
    label: 'Payment',
    description: 'Manage your payment methods',
    customIconColor: 'text-purple-600 dark:text-purple-400',
  },
};

/**
 * Long text content
 */
export const LongText: Story = {
  args: {
    icon: FileText,
    label: 'Very Long Action Label That Will Truncate',
    description:
      'This is a very long description that demonstrates how the component handles text overflow. It should be clamped to two lines and show an ellipsis at the end.',
  },
};

/**
 * Grid layout with 4 cards
 */
export const GridLayout: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4" style={{ width: '600px' }}>
      <QuickActionCard
        icon={Plus}
        label="New Request"
        description="Create request"
        iconColor="success"
      />
      <QuickActionCard
        icon={ClipboardList}
        label="My Requests"
        description="View all"
        iconColor="info"
        badge={12}
      />
      <QuickActionCard
        icon={Settings}
        label="Settings"
        description="Configure"
        iconColor="secondary"
      />
      <QuickActionCard
        icon={Users}
        label="Team"
        description="Manage team"
        iconColor="primary"
        badge={5}
      />
    </div>
  ),
};

/**
 * Dashboard quick actions
 */
export const DashboardActions: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4" style={{ width: '900px' }}>
      <QuickActionCard
        icon={Plus}
        label="New Request"
        description="Create a service request"
        variant="primary"
        iconColor="success"
      />
      <QuickActionCard
        icon={ClipboardList}
        label="My Requests"
        description="View your requests"
        iconColor="info"
        badge={8}
      />
      <QuickActionCard
        icon={BarChart}
        label="Reports"
        description="View analytics"
        iconColor="primary"
      />
      <QuickActionCard
        icon={Bell}
        label="Notifications"
        description="Check updates"
        iconColor="warning"
        badge={3}
      />
      <QuickActionCard
        icon={Calendar}
        label="Schedule"
        description="Manage calendar"
        iconColor="info"
      />
      <QuickActionCard
        icon={Settings}
        label="Settings"
        description="Configure system"
        iconColor="secondary"
      />
    </div>
  ),
};

/**
 * Admin actions
 */
export const AdminActions: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4" style={{ width: '600px' }}>
      <QuickActionCard
        icon={Users}
        label="Manage Users"
        description="Add or remove users"
        iconColor="primary"
        badge={152}
      />
      <QuickActionCard
        icon={Shield}
        label="Security"
        description="Security settings"
        iconColor="error"
        badge="New"
      />
      <QuickActionCard
        icon={Package}
        label="Packages"
        description="Manage packages"
        iconColor="success"
      />
      <QuickActionCard
        icon={BarChart}
        label="Analytics"
        description="View statistics"
        iconColor="info"
      />
    </div>
  ),
};

/**
 * User actions
 */
export const UserActions: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4" style={{ width: '600px' }}>
      <QuickActionCard
        icon={Mail}
        label="Messages"
        description="Read your messages"
        iconColor="info"
        badge={24}
      />
      <QuickActionCard
        icon={Calendar}
        label="Calendar"
        description="View your schedule"
        iconColor="success"
        badge={2}
      />
      <QuickActionCard
        icon={FileText}
        label="Documents"
        description="Browse files"
        iconColor="primary"
      />
      <QuickActionCard
        icon={CreditCard}
        label="Billing"
        description="Manage payments"
        customIconColor="text-purple-600 dark:text-purple-400"
      />
    </div>
  ),
};

/**
 * Mixed states
 */
export const MixedStates: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4" style={{ width: '600px' }}>
      <QuickActionCard
        icon={Plus}
        label="Normal"
        description="Regular state"
        iconColor="success"
      />
      <QuickActionCard
        icon={FileText}
        label="Loading..."
        description="Saving changes"
        loading
      />
      <QuickActionCard
        icon={Bell}
        label="With Badge"
        description="Has notifications"
        badge={5}
        iconColor="warning"
      />
      <QuickActionCard
        icon={Shield}
        label="Disabled"
        description="Not available"
        disabled
      />
    </div>
  ),
};

/**
 * All icon colors
 */
export const AllIconColors: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4" style={{ width: '900px' }}>
      <QuickActionCard
        icon={Plus}
        label="Primary"
        description="Primary color"
        iconColor="primary"
      />
      <QuickActionCard
        icon={Settings}
        label="Secondary"
        description="Secondary color"
        iconColor="secondary"
      />
      <QuickActionCard
        icon={Plus}
        label="Success"
        description="Success color"
        iconColor="success"
      />
      <QuickActionCard
        icon={Bell}
        label="Warning"
        description="Warning color"
        iconColor="warning"
      />
      <QuickActionCard
        icon={Shield}
        label="Error"
        description="Error color"
        iconColor="error"
      />
      <QuickActionCard
        icon={FileText}
        label="Info"
        description="Info color"
        iconColor="info"
      />
    </div>
  ),
};

/**
 * Interactive example
 */
export const Interactive: Story = {
  args: {
    icon: Plus,
    label: 'Interactive Card',
    description: 'Try hovering and clicking',
    variant: 'default',
    iconColor: 'primary',
  },
};
