import type { Meta, StoryObj } from '@storybook/react';
import { AdminPageHeader } from './AdminPageHeader';
import { Button } from '@/components/molecules-alianza/Button';
import { BreadcrumbNavigation } from '@/components/molecules-alianza/Breadcrumb';
import { Badge } from '@/components/atoms-alianza/Badge';
import { Plus, Settings, Download, Users, Home, Filter } from 'lucide-react';

/**
 * AdminPageHeader provides a consistent header layout for admin pages with title,
 * description, breadcrumbs, actions, and navigation elements.
 *
 * ## Features
 * - Page title with optional icon/badge
 * - Description/subtitle support
 * - Back navigation with animated arrow
 * - Breadcrumb integration
 * - Action buttons area
 * - Custom content slots
 * - Responsive layout
 * - Loading skeleton state
 * - Divider/separator support
 * - Flexible heading levels
 *
 * ## Usage
 * ```tsx
 * <AdminPageHeader
 *   title="User Management"
 *   description="Manage users and permissions"
 *   backHref="/admin/dashboard"
 *   actions={<Button>Create User</Button>}
 * />
 * ```
 */
const meta = {
  title: 'Molecules/AdminPageHeader',
  component: AdminPageHeader,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Consistent header layout for admin pages with title, description, breadcrumbs, actions, and navigation.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Main title of the page',
    },
    description: {
      control: 'text',
      description: 'Optional description or subtitle',
    },
    backHref: {
      control: 'text',
      description: 'Optional back navigation link',
    },
    backLabel: {
      control: 'text',
      description: 'Label for the back link button',
    },
    headingLevel: {
      control: 'select',
      options: [1, 2, 3, 4, 5, 6],
      description: 'Custom heading level for the title',
    },
    showDivider: {
      control: 'boolean',
      description: 'Whether to show a divider below the header',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state for skeleton UI',
    },
  },
} satisfies Meta<typeof AdminPageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic header with just a title
 */
export const Default: Story = {
  args: {
    title: 'Dashboard',
  },
};

/**
 * Header with title and description
 */
export const WithDescription: Story = {
  args: {
    title: 'User Management',
    description: 'View and manage all users in the system',
  },
};

/**
 * Header with back navigation
 */
export const WithBackButton: Story = {
  args: {
    title: 'User Details',
    description: 'View detailed information about this user',
    backHref: '/admin/users',
    backLabel: 'Back to Users',
  },
};

/**
 * Header with action buttons
 */
export const WithActions: Story = {
  args: {
    title: 'Users',
    description: 'Manage all users in the system',
    actions: (
      <>
        <Button variant="outline" size="md" iconLeft={<Download />}>
          Export
        </Button>
        <Button size="md" iconLeft={<Plus />}>
          Create User
        </Button>
      </>
    ),
  },
};

/**
 * Header with single primary action
 */
export const WithSingleAction: Story = {
  args: {
    title: 'Services',
    description: 'Browse and manage available services',
    actions: (
      <Button size="md" iconLeft={<Plus />}>
        New Service
      </Button>
    ),
  },
};

/**
 * Complete header with all features
 */
export const Complete: Story = {
  args: {
    title: 'Edit User',
    description: 'Modify user information and permissions',
    backHref: '/admin/users',
    backLabel: 'Back to Users',
    actions: (
      <>
        <Button variant="outline" size="md">
          Cancel
        </Button>
        <Button size="md">Save Changes</Button>
      </>
    ),
  },
};

/**
 * Header with breadcrumb navigation
 */
export const WithBreadcrumbs: Story = {
  args: {
    title: 'User Profile',
    description: 'View and edit user profile information',
    breadcrumbs: (
      <BreadcrumbNavigation
        items={[
          { label: 'Dashboard', href: '/admin', icon: Home },
          { label: 'Users', href: '/admin/users', icon: Users },
          { label: 'Profile', current: true },
        ]}
        separator="chevron"
        size="md"
      />
    ),
    actions: <Button>Edit Profile</Button>,
  },
};

/**
 * Header with icon in title
 */
export const WithIcon: Story = {
  args: {
    title: 'Settings',
    description: 'Configure application settings',
    icon: <Settings className="h-6 w-6 text-primary" />,
    actions: <Button>Save Settings</Button>,
  },
};

/**
 * Header with badge in title
 */
export const WithBadge: Story = {
  args: {
    title: 'Beta Features',
    description: 'Try out new experimental features',
    badge: <Badge variant="secondary">Beta</Badge>,
  },
};

/**
 * Header with icon and badge
 */
export const WithIconAndBadge: Story = {
  args: {
    title: 'New Dashboard',
    description: 'Redesigned dashboard with improved analytics',
    icon: <Home className="h-6 w-6 text-primary" />,
    badge: <Badge variant="success">New</Badge>,
    actions: <Button>Get Started</Button>,
  },
};

/**
 * Header with custom heading level (h2)
 */
export const CustomHeadingLevel: Story = {
  args: {
    title: 'Section Title',
    description: 'This uses h2 instead of h1',
    headingLevel: 2,
  },
};

/**
 * Header with divider separator
 */
export const WithDivider: Story = {
  args: {
    title: 'Analytics',
    description: 'View detailed analytics and reports',
    showDivider: true,
    actions: (
      <Button variant="outline" iconLeft={<Download />}>
        Export Report
      </Button>
    ),
  },
};

/**
 * Header with custom content (tabs/filters)
 */
export const WithCustomContent: Story = {
  args: {
    title: 'Requests',
    description: 'View and manage all service requests',
    actions: (
      <Button iconLeft={<Filter />} variant="outline">
        Filters
      </Button>
    ),
    children: (
      <div className="flex gap-2 mt-2">
        <Button variant="outline" size="sm">
          All
        </Button>
        <Button variant="nude" size="sm">
          Pending
        </Button>
        <Button variant="nude" size="sm">
          In Progress
        </Button>
        <Button variant="nude" size="sm">
          Completed
        </Button>
      </div>
    ),
  },
};

/**
 * Loading skeleton state
 */
export const Loading: Story = {
  args: {
    title: 'Dashboard',
    description: 'Loading dashboard data...',
    loading: true,
    actions: <Button>Action</Button>,
    backHref: '/admin',
  },
};

/**
 * Loading state without optional elements
 */
export const LoadingMinimal: Story = {
  args: {
    title: 'Dashboard',
    loading: true,
  },
};

/**
 * Long title and description
 */
export const LongContent: Story = {
  args: {
    title: 'User Account Management and Permission Configuration System',
    description:
      'Comprehensive interface for managing user accounts, roles, permissions, and access control settings across the entire platform with advanced filtering and bulk operations',
    actions: (
      <>
        <Button variant="outline">Secondary</Button>
        <Button>Primary Action</Button>
      </>
    ),
  },
};

/**
 * Mobile layout preview (resize viewport)
 */
export const MobileLayout: Story = {
  args: {
    title: 'Mobile View',
    description: 'This demonstrates responsive behavior',
    backHref: '/admin',
    actions: (
      <>
        <Button size="sm" variant="outline">
          Cancel
        </Button>
        <Button size="sm">Save</Button>
      </>
    ),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * Multiple actions with various styles
 */
export const MultipleActions: Story = {
  args: {
    title: 'Service Management',
    description: 'Manage services, categories, and pricing',
    actions: (
      <>
        <Button variant="nude" iconLeft={<Settings />} size="md">
          Settings
        </Button>
        <Button variant="outline" iconLeft={<Download />} size="md">
          Export
        </Button>
        <Button iconLeft={<Plus />} size="md">
          Add Service
        </Button>
      </>
    ),
  },
};

/**
 * Complex layout with all features
 */
export const ComplexLayout: Story = {
  args: {
    title: 'Advanced Configuration',
    description: 'Configure advanced system settings and integrations',
    backHref: '/admin/settings',
    backLabel: 'Back to Settings',
    icon: <Settings className="h-6 w-6 text-primary" />,
    badge: <Badge variant="warning">Advanced</Badge>,
    breadcrumbs: (
      <BreadcrumbNavigation
        items={[
          { label: 'Home', href: '/admin' },
          { label: 'Settings', href: '/admin/settings' },
          { label: 'Advanced', current: true },
        ]}
      />
    ),
    showDivider: true,
    actions: (
      <>
        <Button variant="outline">Reset</Button>
        <Button>Save Changes</Button>
      </>
    ),
    children: (
      <div className="flex gap-2 p-4 bg-muted rounded-md">
        <span className="text-sm text-muted-foreground">
          Additional configuration options will appear here
        </span>
      </div>
    ),
  },
};

/**
 * Minimal header (title only)
 */
export const Minimal: Story = {
  args: {
    title: 'Simple Page',
  },
};

/**
 * Custom className demonstration
 */
export const CustomStyling: Story = {
  args: {
    title: 'Custom Styled Header',
    description: 'This header has custom styling applied',
    className: 'bg-muted/50 p-6 rounded-lg border',
    titleClassName: 'text-primary',
    descriptionClassName: 'text-lg',
    actions: <Button>Action</Button>,
  },
};

/**
 * React node as description
 */
export const ComplexDescription: Story = {
  args: {
    title: 'Dashboard Overview',
    description: (
      <div className="space-y-1">
        <p>Welcome to your admin dashboard</p>
        <p className="text-xs">
          Last updated: {new Date().toLocaleString()}
        </p>
      </div>
    ),
  },
};
