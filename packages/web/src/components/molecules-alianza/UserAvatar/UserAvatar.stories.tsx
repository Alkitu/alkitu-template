import type { Meta, StoryObj } from '@storybook/react';
import { UserAvatar } from './UserAvatar';

const meta: Meta<typeof UserAvatar> = {
  title: 'Molecules/Alianza/UserAvatar',
  component: UserAvatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'UserAvatar displays user initials in a circular avatar following the Alianza design system. It generates initials from the name and optional lastName prop.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'User first name or full name',
    },
    lastName: {
      control: 'text',
      description: 'User last name (optional)',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Avatar size',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof UserAvatar>;

/**
 * Default UserAvatar with medium size
 */
export const Default: Story = {
  args: {
    name: 'Ana',
    lastName: 'Martínez',
  },
};

/**
 * Single name (generates single initial)
 */
export const SingleName: Story = {
  args: {
    name: 'Ana',
  },
};

/**
 * Multi-word name (uses first two words)
 */
export const MultiWordName: Story = {
  args: {
    name: 'Ana María Gómez',
  },
};

/**
 * Name with lastName prop
 */
export const WithLastName: Story = {
  args: {
    name: 'Luis',
    lastName: 'Martínez',
  },
};

/**
 * Small size variant
 */
export const Small: Story = {
  args: {
    name: 'Ana',
    lastName: 'Martínez',
    size: 'sm',
  },
};

/**
 * Medium size variant (default)
 */
export const Medium: Story = {
  args: {
    name: 'Luis',
    lastName: 'Gómez',
    size: 'md',
  },
};

/**
 * Large size variant
 */
export const Large: Story = {
  args: {
    name: 'María',
    lastName: 'López',
    size: 'lg',
  },
};

/**
 * All sizes comparison
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="text-center">
        <UserAvatar name="Ana" lastName="M" size="sm" />
        <p className="mt-2 text-xs text-muted-foreground">Small</p>
      </div>
      <div className="text-center">
        <UserAvatar name="Luis" lastName="G" size="md" />
        <p className="mt-2 text-xs text-muted-foreground">Medium</p>
      </div>
      <div className="text-center">
        <UserAvatar name="María" lastName="L" size="lg" />
        <p className="mt-2 text-xs text-muted-foreground">Large</p>
      </div>
    </div>
  ),
};

/**
 * With custom className
 */
export const CustomStyling: Story = {
  args: {
    name: 'Custom',
    lastName: 'User',
    className: 'border-2 border-accent',
  },
};

/**
 * With theme override
 */
export const ThemeOverride: Story = {
  args: {
    name: 'Themed',
    lastName: 'User',
    themeOverride: {
      backgroundColor: '#8b5cf6',
      color: '#ffffff',
    },
  },
};

/**
 * User list example
 */
export const UserList: Story = {
  render: () => (
    <div className="space-y-3">
      {[
        { name: 'Ana', lastName: 'Martínez' },
        { name: 'Luis', lastName: 'Gómez' },
        { name: 'María', lastName: 'López' },
        { name: 'Carlos', lastName: 'Pérez' },
        { name: 'Sofia', lastName: 'Rodríguez' },
      ].map((user, i) => (
        <div key={i} className="flex items-center gap-3">
          <UserAvatar name={user.name} lastName={user.lastName} />
          <div>
            <p className="font-medium">
              {user.name} {user.lastName}
            </p>
            <p className="text-sm text-muted-foreground">user@example.com</p>
          </div>
        </div>
      ))}
    </div>
  ),
};

/**
 * In table context
 */
export const InTable: Story = {
  render: () => (
    <div className="rounded-lg border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="p-3 text-left text-sm font-medium">User</th>
            <th className="p-3 text-left text-sm font-medium">Email</th>
            <th className="p-3 text-left text-sm font-medium">Role</th>
          </tr>
        </thead>
        <tbody>
          {[
            { name: 'Ana', lastName: 'Martínez', email: 'ana@example.com', role: 'Admin' },
            { name: 'Luis', lastName: 'Gómez', email: 'luis@example.com', role: 'User' },
            { name: 'María', lastName: 'López', email: 'maria@example.com', role: 'Editor' },
          ].map((user, i) => (
            <tr key={i} className="border-b last:border-0">
              <td className="p-3">
                <div className="flex items-center gap-3">
                  <UserAvatar name={user.name} lastName={user.lastName} size="sm" />
                  <span className="font-medium">
                    {user.name} {user.lastName}
                  </span>
                </div>
              </td>
              <td className="p-3 text-sm text-muted-foreground">{user.email}</td>
              <td className="p-3 text-sm">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

/**
 * Names with special characters
 */
export const SpecialCharacters: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <div className="text-center">
        <UserAvatar name="José" lastName="Pérez" />
        <p className="mt-2 text-xs text-muted-foreground">José Pérez</p>
      </div>
      <div className="text-center">
        <UserAvatar name="María" lastName="Ñoño" />
        <p className="mt-2 text-xs text-muted-foreground">María Ñoño</p>
      </div>
      <div className="text-center">
        <UserAvatar name="Müller" />
        <p className="mt-2 text-xs text-muted-foreground">Müller</p>
      </div>
      <div className="text-center">
        <UserAvatar name="O'Brien" />
        <p className="mt-2 text-xs text-muted-foreground">O'Brien</p>
      </div>
    </div>
  ),
};

/**
 * In flex layout
 */
export const InFlexLayout: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <UserAvatar name="Ana" lastName="M" size="sm" />
      <UserAvatar name="Luis" lastName="G" size="sm" />
      <UserAvatar name="María" lastName="L" size="sm" />
      <UserAvatar name="Carlos" lastName="P" size="sm" />
      <span className="ml-2 text-sm text-muted-foreground">+5 more</span>
    </div>
  ),
};
