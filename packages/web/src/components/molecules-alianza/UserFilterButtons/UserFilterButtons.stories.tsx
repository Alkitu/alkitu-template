import type { Meta, StoryObj } from '@storybook/react';
import { UserFilterButtons } from './UserFilterButtons';

const meta: Meta<typeof UserFilterButtons> = {
  title: 'Molecules/UserFilterButtons',
  component: UserFilterButtons,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'UserFilterButtons molecule for filtering users by role (all, admin, employee, client). Uses Chip atoms with solid variant for active filters and outline for inactive ones.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    activeFilter: {
      control: 'select',
      options: ['all', 'admin', 'employee', 'client'],
      description: 'Currently active filter',
    },
    onFilterChange: {
      action: 'filter changed',
      description: 'Callback when filter changes',
    },
    labels: {
      control: 'object',
      description: 'Custom labels for filter buttons',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  args: {
    onFilterChange: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof UserFilterButtons>;

/**
 * Default user filter buttons with Spanish labels showing "All" filter active
 */
export const Default: Story = {
  args: {
    activeFilter: 'all',
  },
};

/**
 * All filter active (shows all users)
 */
export const AllActive: Story = {
  args: {
    activeFilter: 'all',
  },
};

/**
 * Admin filter active (shows only administrators)
 */
export const AdminActive: Story = {
  args: {
    activeFilter: 'admin',
  },
};

/**
 * Employee filter active (shows only employees)
 */
export const EmployeeActive: Story = {
  args: {
    activeFilter: 'employee',
  },
};

/**
 * Client filter active (shows only clients)
 */
export const ClientActive: Story = {
  args: {
    activeFilter: 'client',
  },
};

/**
 * Custom English labels
 */
export const CustomLabelsEnglish: Story = {
  args: {
    activeFilter: 'all',
    labels: {
      all: 'All Users',
      admin: 'Administrators',
      employee: 'Employees',
      client: 'Clients',
    },
  },
};

/**
 * Custom labels with user counts
 */
export const WithUserCounts: Story = {
  args: {
    activeFilter: 'admin',
    labels: {
      all: 'All (150)',
      admin: 'Admins (12)',
      employee: 'Employees (98)',
      client: 'Clients (40)',
    },
  },
};

/**
 * Short labels for compact display
 */
export const ShortLabels: Story = {
  args: {
    activeFilter: 'employee',
    labels: {
      all: 'All',
      admin: 'Admin',
      employee: 'Staff',
      client: 'Client',
    },
  },
};

/**
 * Long descriptive labels
 */
export const LongLabels: Story = {
  args: {
    activeFilter: 'client',
    labels: {
      all: 'All Users in System',
      admin: 'System Administrators',
      employee: 'Regular Employees',
      client: 'External Clients',
    },
  },
};

/**
 * Custom styling with additional classes
 */
export const CustomStyling: Story = {
  args: {
    activeFilter: 'all',
    className: 'bg-gray-100 dark:bg-gray-800 p-4 rounded-lg',
  },
};

/**
 * With custom gap between buttons
 */
export const CustomGap: Story = {
  args: {
    activeFilter: 'admin',
    className: 'gap-6',
  },
};

/**
 * Internationalization - French labels
 */
export const InternationalizationFrench: Story = {
  args: {
    activeFilter: 'all',
    labels: {
      all: 'Tous',
      admin: 'Administrateurs',
      employee: 'Employés',
      client: 'Clients',
    },
  },
};

/**
 * Internationalization - German labels
 */
export const InternationalizationGerman: Story = {
  args: {
    activeFilter: 'employee',
    labels: {
      all: 'Alle',
      admin: 'Administratoren',
      employee: 'Mitarbeiter',
      client: 'Kunden',
    },
  },
};
