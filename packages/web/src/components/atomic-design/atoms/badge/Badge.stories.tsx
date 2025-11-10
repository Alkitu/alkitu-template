import type { Meta, StoryObj } from '@storybook/react';
import {
  Star,
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
  Users,
  Calendar,
  Mail,
  Tag,
  Trash2,
  ShoppingCart,
  Bell,
  Heart,
  TrendingUp
} from 'lucide-react';
import { Badge } from './Badge';

/**
 * Badge - Atomic Design Atom (PHASE 2 CONSOLIDATION)
 *
 * A versatile badge component for displaying labels, tags, and status indicators.
 *
 * ## Consolidation Details
 *
 * This component consolidates 4 Badge implementations:
 * - `ui/badge.tsx` - Shadcn base with CVA + Radix Slot
 * - `atomic-design/atoms/badges/Badge.tsx` - 6 variants, theme override
 * - `theme-editor-3.0/atoms/Badge.tsx` - 8 variants, icons, removable, accessibility
 * - `theme-editor-3.0/primitives/badge.tsx` - re-export wrapper
 *
 * ## Features Merged
 *
 * - **9 Variants**: default, primary, secondary, success, warning, error, destructive, outline, ghost
 * - **3 Sizes**: sm, md, lg
 * - **Icon Support**: Left icon with proper sizing
 * - **Removable**: X button with keyboard accessibility
 * - **asChild**: Polymorphic rendering via Radix Slot
 * - **Theme Integration**: CSS variables for colors, typography, border radius
 * - **Accessibility**: Full ARIA support, aria-live for alerts
 * - **CVA**: Class variance authority for variant management
 */
const meta = {
  title: 'Atomic Design/Atoms/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A consolidated badge component supporting 9 variants, 3 sizes, icons, removable functionality, and full theme integration.',
      },
    },
  },
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
        'destructive',
        'outline',
        'ghost',
      ],
      description: 'Visual variant (consolidated from all implementations)',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Badge size',
    },
    icon: {
      control: false,
      description: 'Icon element to display (from Theme Editor)',
    },
    removable: {
      control: 'boolean',
      description: 'Show remove button (from Theme Editor)',
    },
    asChild: {
      control: 'boolean',
      description: 'Render as child component (from UI Badge)',
    },
    children: {
      control: 'text',
      description: 'Badge content',
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default badge with no special styling
 */
export const Default: Story = {
  args: {
    children: 'Default',
  },
};

/**
 * All 9 consolidated variants in one view
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge variant="default">Default</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="ghost">Ghost</Badge>
    </div>
  ),
};

/**
 * All 3 sizes (sm, md, lg)
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Badge size="sm" variant="primary">Small</Badge>
      <Badge size="md" variant="primary">Medium</Badge>
      <Badge size="lg" variant="primary">Large</Badge>
    </div>
  ),
};

/**
 * Badges with left icons (from Theme Editor)
 */
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge icon={<Star />} variant="primary">Featured</Badge>
      <Badge icon={<CheckCircle />} variant="success">Completed</Badge>
      <Badge icon={<AlertCircle />} variant="error">Error</Badge>
      <Badge icon={<Info />} variant="outline">Info</Badge>
      <Badge icon={<Zap />} variant="warning">Fast</Badge>
      <Badge icon={<Heart />} variant="destructive">Favorite</Badge>
    </div>
  ),
};

/**
 * Removable badges with X button (from Theme Editor)
 */
export const Removable: Story = {
  render: () => {
    const [badges, setBadges] = React.useState([
      { id: 1, label: 'Tag 1', variant: 'primary' as const },
      { id: 2, label: 'Tag 2', variant: 'secondary' as const },
      { id: 3, label: 'Tag 3', variant: 'outline' as const },
    ]);

    const handleRemove = (id: number) => {
      setBadges((prev) => prev.filter((badge) => badge.id !== id));
    };

    return (
      <div className="flex flex-wrap gap-2">
        {badges.map((badge) => (
          <Badge
            key={badge.id}
            variant={badge.variant}
            removable
            onRemove={() => handleRemove(badge.id)}
          >
            {badge.label}
          </Badge>
        ))}
        {badges.length === 0 && (
          <p className="text-muted-foreground text-sm">All badges removed</p>
        )}
      </div>
    );
  },
};

/**
 * Badges with both icon and remove button
 */
export const IconAndRemovable: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge icon={<Tag />} removable onRemove={() => alert('Removed')}>
        Design
      </Badge>
      <Badge icon={<Users />} variant="primary" removable onRemove={() => alert('Removed')}>
        Team
      </Badge>
      <Badge icon={<Calendar />} variant="success" removable onRemove={() => alert('Removed')}>
        Event
      </Badge>
    </div>
  ),
};

/**
 * As link using asChild prop (from UI Badge)
 */
export const AsLink: Story = {
  render: () => (
    <div className="flex gap-3">
      <Badge asChild variant="primary">
        <a href="#profile" className="cursor-pointer">
          Profile
        </a>
      </Badge>
      <Badge asChild variant="outline">
        <a href="#settings" className="cursor-pointer">
          Settings
        </a>
      </Badge>
    </div>
  ),
};

/**
 * Status indicators for different states
 */
export const StatusIndicators: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium w-24">Online:</span>
        <Badge variant="success" icon={<CheckCircle />}>Active</Badge>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium w-24">Offline:</span>
        <Badge variant="default">Inactive</Badge>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium w-24">Warning:</span>
        <Badge variant="warning" icon={<AlertCircle />}>Limited</Badge>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium w-24">Error:</span>
        <Badge variant="error" icon={<AlertCircle />}>Failed</Badge>
      </div>
    </div>
  ),
};

/**
 * E-commerce use case
 */
export const ECommerce: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <div className="p-4 border rounded-lg">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold">Premium Headphones</h3>
          <Badge variant="success">In Stock</Badge>
        </div>
        <div className="flex gap-2 mt-2">
          <Badge variant="primary" size="sm" icon={<Star />}>Best Seller</Badge>
          <Badge variant="outline" size="sm">Free Shipping</Badge>
          <Badge variant="ghost" size="sm">-20%</Badge>
        </div>
      </div>

      <div className="p-4 border rounded-lg">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold">Wireless Mouse</h3>
          <Badge variant="warning">Low Stock</Badge>
        </div>
        <div className="flex gap-2 mt-2">
          <Badge variant="outline" size="sm" icon={<TrendingUp />}>Popular</Badge>
        </div>
      </div>

      <div className="p-4 border rounded-lg">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold">Mechanical Keyboard</h3>
          <Badge variant="destructive">Out of Stock</Badge>
        </div>
        <div className="flex gap-2 mt-2">
          <Badge variant="secondary" size="sm">Pre-order</Badge>
        </div>
      </div>
    </div>
  ),
};

/**
 * Notification badges with counts
 */
export const NotificationCounts: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Bell className="size-5" />
        <Badge variant="error" size="sm">3</Badge>
        <span className="text-sm">New notifications</span>
      </div>
      <div className="flex items-center gap-3">
        <Mail className="size-5" />
        <Badge variant="primary" size="sm">12</Badge>
        <span className="text-sm">Unread messages</span>
      </div>
      <div className="flex items-center gap-3">
        <ShoppingCart className="size-5" />
        <Badge variant="success" size="sm">5</Badge>
        <span className="text-sm">Items in cart</span>
      </div>
    </div>
  ),
};

/**
 * Theme override example
 */
export const CustomTheming: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge
        themeOverride={{
          backgroundColor: 'purple',
          color: 'white',
        }}
      >
        Custom Purple
      </Badge>
      <Badge
        themeOverride={{
          backgroundColor: 'orange',
          color: 'black',
          borderRadius: '4px',
        }}
      >
        Custom Orange
      </Badge>
      <Badge
        themeOverride={{
          background: 'linear-gradient(to right, #667eea, #764ba2)',
          color: 'white',
        }}
      >
        Gradient
      </Badge>
    </div>
  ),
};

/**
 * Different sizes with all variants
 */
export const SizeVariantMatrix: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-2">Small</h4>
        <div className="flex flex-wrap gap-2">
          <Badge size="sm" variant="default">Default</Badge>
          <Badge size="sm" variant="primary">Primary</Badge>
          <Badge size="sm" variant="success">Success</Badge>
          <Badge size="sm" variant="error">Error</Badge>
          <Badge size="sm" variant="outline">Outline</Badge>
        </div>
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2">Medium</h4>
        <div className="flex flex-wrap gap-2">
          <Badge size="md" variant="default">Default</Badge>
          <Badge size="md" variant="primary">Primary</Badge>
          <Badge size="md" variant="success">Success</Badge>
          <Badge size="md" variant="error">Error</Badge>
          <Badge size="md" variant="outline">Outline</Badge>
        </div>
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2">Large</h4>
        <div className="flex flex-wrap gap-2">
          <Badge size="lg" variant="default">Default</Badge>
          <Badge size="lg" variant="primary">Primary</Badge>
          <Badge size="lg" variant="success">Success</Badge>
          <Badge size="lg" variant="error">Error</Badge>
          <Badge size="lg" variant="outline">Outline</Badge>
        </div>
      </div>
    </div>
  ),
};

/**
 * Accessibility features demonstration
 */
export const AccessibilityDemo: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-2">Auto aria-label</h4>
        <Badge>Badge: Test Label</Badge>
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2">Custom aria-label</h4>
        <Badge aria-label="Custom accessible label">Custom</Badge>
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2">Error with aria-live</h4>
        <Badge variant="error">aria-live="polite" applied</Badge>
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2">Custom role</h4>
        <Badge role="note">Custom role="note"</Badge>
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2">Removable with keyboard support</h4>
        <Badge removable onRemove={() => alert('Use Enter or Space key')}>
          Keyboard accessible remove
        </Badge>
      </div>
    </div>
  ),
};

/**
 * Migration guide: Old vs New API
 */
export const MigrationGuide: Story = {
  render: () => (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-lg font-semibold mb-3">Migration from ui/badge.tsx</h3>
        <div className="space-y-2">
          <div className="p-3 bg-muted rounded">
            <p className="text-sm font-mono mb-1">Old (UI Badge):</p>
            <code className="text-xs">{`<Badge variant="destructive">Error</Badge>`}</code>
          </div>
          <div className="p-3 bg-primary/10 rounded">
            <p className="text-sm font-mono mb-1">New (Consolidated):</p>
            <code className="text-xs">{`<Badge variant="destructive">Error</Badge>`}</code>
            <p className="text-xs text-muted-foreground mt-1">✅ Same API, more features</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Migration from Theme Editor Badge</h3>
        <div className="space-y-2">
          <div className="p-3 bg-muted rounded">
            <p className="text-sm font-mono mb-1">Old (Theme Editor):</p>
            <code className="text-xs">{`<Badge icon={<Star />} removable onRemove={...}>Tag</Badge>`}</code>
          </div>
          <div className="p-3 bg-primary/10 rounded">
            <p className="text-sm font-mono mb-1">New (Consolidated):</p>
            <code className="text-xs">{`<Badge icon={<Star />} removable onRemove={...}>Tag</Badge>`}</code>
            <p className="text-xs text-muted-foreground mt-1">✅ Same API, plus asChild support</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">New Features Available</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>9 variants (merged from all implementations)</li>
          <li>3 sizes (sm, md, lg)</li>
          <li>Icon support with proper sizing</li>
          <li>Removable with keyboard accessibility</li>
          <li>asChild for polymorphic rendering</li>
          <li>Full ARIA support with aria-live</li>
          <li>Theme CSS variables integration</li>
          <li>CVA for variant management</li>
        </ul>
      </div>
    </div>
  ),
};

// Required for removable demo
import React from 'react';
