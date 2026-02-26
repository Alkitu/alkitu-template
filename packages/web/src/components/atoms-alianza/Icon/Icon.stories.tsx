import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';
import { Icons } from '@/components/primitives/icons';

/**
 * Icon component provides a unified interface for rendering Lucide icons with
 * consistent sizing, theming, and accessibility features.
 *
 * ## Features
 * - 6 size presets (xs to 2xl) with pixel-perfect dimensions
 * - 6 color variants with dark mode support
 * - Loading state with spinner
 * - Interactive mode with keyboard support
 * - Full accessibility (ARIA labels, keyboard navigation)
 * - 100+ Lucide icons available
 *
 * ## Usage
 *
 * ```tsx
 * import { Icon } from '@/components/atoms-alianza/Icon';
 *
 * // Basic usage
 * <Icon name="heart" size="md" variant="primary" />
 *
 * // Loading state
 * <Icon name="check" loading />
 *
 * // Interactive icon
 * <Icon
 *   name="trash"
 *   variant="error"
 *   onClick={() => handleDelete()}
 *   aria-label="Delete item"
 * />
 * ```
 */
const meta = {
  title: 'Atomic Design/Atoms-Alianza/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Universal icon component that wraps Lucide React icons with consistent styling.

### Available Icons

All Lucide icons are supported. Use the icon name without the "Icon" suffix:
- heart, star, check, x
- chevronDown, chevronUp, chevronLeft, chevronRight
- menu, search, settings, user, home
- mail, bell, trash, edit, plus, minus
- and 100+ more...

See full catalog: https://lucide.dev/icons
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Icon name (without "Icon" suffix)',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Icon size preset',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'error'],
      description: 'Color variant',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    color: {
      control: 'color',
      description: 'Custom color (overrides variant)',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading spinner',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    useSystemColors: {
      control: 'boolean',
      description: 'Use system color variants',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler',
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = Omit<StoryObj<typeof meta>, 'args'> & Partial<Pick<StoryObj<typeof meta>, 'args'>>;

// Default story
export const Default: Story = {
  args: {
    name: 'heart',
    size: 'md',
    variant: 'default',
  },
};

// All size variants
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-6">
      <div className="flex flex-col items-center gap-3">
        <Icon name="heart" size="xs" variant="error" />
        <span className="text-xs text-muted-foreground">xs (12px)</span>
      </div>
      <div className="flex flex-col items-center gap-3">
        <Icon name="heart" size="sm" variant="error" />
        <span className="text-xs text-muted-foreground">sm (16px)</span>
      </div>
      <div className="flex flex-col items-center gap-3">
        <Icon name="heart" size="md" variant="error" />
        <span className="text-xs text-muted-foreground">md (24px)</span>
      </div>
      <div className="flex flex-col items-center gap-3">
        <Icon name="heart" size="lg" variant="error" />
        <span className="text-xs text-muted-foreground">lg (32px)</span>
      </div>
      <div className="flex flex-col items-center gap-3">
        <Icon name="heart" size="xl" variant="error" />
        <span className="text-xs text-muted-foreground">xl (48px)</span>
      </div>
      <div className="flex flex-col items-center gap-3">
        <Icon name="heart" size="2xl" variant="error" />
        <span className="text-xs text-muted-foreground">2xl (64px)</span>
      </div>
    </div>
  ),
};

// All color variants
export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-8">
      <div className="flex flex-col items-center gap-3">
        <Icon name="circle" size="lg" variant="default" />
        <span className="text-sm font-medium">default</span>
        <span className="text-xs text-muted-foreground">text-current</span>
      </div>
      <div className="flex flex-col items-center gap-3">
        <Icon name="circle" size="lg" variant="primary" />
        <span className="text-sm font-medium">primary</span>
        <span className="text-xs text-muted-foreground">text-primary</span>
      </div>
      <div className="flex flex-col items-center gap-3">
        <Icon name="circle" size="lg" variant="secondary" />
        <span className="text-sm font-medium">secondary</span>
        <span className="text-xs text-muted-foreground">text-muted</span>
      </div>
      <div className="flex flex-col items-center gap-3">
        <Icon name="checkCircle" size="lg" variant="success" />
        <span className="text-sm font-medium">success</span>
        <span className="text-xs text-muted-foreground">green</span>
      </div>
      <div className="flex flex-col items-center gap-3">
        <Icon name="alertTriangle" size="lg" variant="warning" />
        <span className="text-sm font-medium">warning</span>
        <span className="text-xs text-muted-foreground">yellow</span>
      </div>
      <div className="flex flex-col items-center gap-3">
        <Icon name="alertCircle" size="lg" variant="error" />
        <span className="text-sm font-medium">error</span>
        <span className="text-xs text-muted-foreground">red</span>
      </div>
    </div>
  ),
};

// Loading states
export const LoadingStates: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-3">
        <Icon name="check" loading size="sm" />
        <span className="text-xs text-muted-foreground">Small</span>
      </div>
      <div className="flex flex-col items-center gap-3">
        <Icon name="check" loading size="md" />
        <span className="text-xs text-muted-foreground">Medium</span>
      </div>
      <div className="flex flex-col items-center gap-3">
        <Icon name="check" loading size="lg" />
        <span className="text-xs text-muted-foreground">Large</span>
      </div>
      <div className="flex flex-col items-center gap-3">
        <Icon name="check" loading size="xl" variant="primary" />
        <span className="text-xs text-muted-foreground">Primary</span>
      </div>
    </div>
  ),
};

// Common icons showcase
export const CommonIcons: Story = {
  render: () => (
    <div className="grid grid-cols-8 gap-6">
      {[
        'home',
        'user',
        'users',
        'settings',
        'bell',
        'mail',
        'search',
        'menu',
        'heart',
        'star',
        'bookmark',
        'calendar',
        'clock',
        'mapPin',
        'phone',
        'camera',
        'image',
        'file',
        'folder',
        'download',
        'upload',
        'share',
        'trash',
        'edit',
        'plus',
        'minus',
        'x',
        'check',
        'chevronDown',
        'chevronUp',
        'chevronLeft',
        'chevronRight',
      ].map((iconName) => (
        <div key={iconName} className="flex flex-col items-center gap-2">
          <Icon name={iconName} size="lg" variant="primary" />
          <span className="text-xs text-center text-muted-foreground">
            {iconName}
          </span>
        </div>
      ))}
    </div>
  ),
};

// Status and alert icons
export const StatusIcons: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Icon name="checkCircle" size="lg" variant="success" />
        <span className="text-sm">Success - Operation completed</span>
      </div>
      <div className="flex items-center gap-3">
        <Icon name="alertTriangle" size="lg" variant="warning" />
        <span className="text-sm">Warning - Please review</span>
      </div>
      <div className="flex items-center gap-3">
        <Icon name="alertCircle" size="lg" variant="error" />
        <span className="text-sm">Error - Something went wrong</span>
      </div>
      <div className="flex items-center gap-3">
        <Icon name="info" size="lg" variant="primary" />
        <span className="text-sm">Info - Additional information</span>
      </div>
      <div className="flex items-center gap-3">
        <Icon name="check" loading size="lg" />
        <span className="text-sm">Loading - Please wait</span>
      </div>
    </div>
  ),
};

// Interactive icons
export const Interactive: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground mb-4">
        Click the icons below (keyboard accessible):
      </div>
      <div className="flex gap-4">
        <Icon
          name="heart"
          size="xl"
          variant="error"
          onClick={() => alert('Liked!')}
          aria-label="Like button"
          className="transition-transform hover:scale-110 active:scale-95"
        />
        <Icon
          name="star"
          size="xl"
          variant="warning"
          onClick={() => alert('Starred!')}
          aria-label="Star button"
          className="transition-transform hover:scale-110 active:scale-95"
        />
        <Icon
          name="bookmark"
          size="xl"
          variant="primary"
          onClick={() => alert('Bookmarked!')}
          aria-label="Bookmark button"
          className="transition-transform hover:scale-110 active:scale-95"
        />
        <Icon
          name="trash"
          size="xl"
          variant="error"
          onClick={() => alert('Deleted!')}
          aria-label="Delete button"
          className="transition-transform hover:scale-110 active:scale-95"
        />
      </div>
    </div>
  ),
};

// Custom colors
export const CustomColors: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-3">
        <Icon name="heart" size="xl" color="#FF5733" />
        <span className="text-xs text-muted-foreground">#FF5733</span>
      </div>
      <div className="flex flex-col items-center gap-3">
        <Icon name="star" size="xl" color="#FFD700" />
        <span className="text-xs text-muted-foreground">#FFD700</span>
      </div>
      <div className="flex flex-col items-center gap-3">
        <Icon name="bookmark" size="xl" color="#4169E1" />
        <span className="text-xs text-muted-foreground">#4169E1</span>
      </div>
      <div className="flex flex-col items-center gap-3">
        <Icon name="circle" size="xl" color="oklch(0.7 0.25 150)" />
        <span className="text-xs text-muted-foreground">oklch</span>
      </div>
    </div>
  ),
};

// Navigation icons
export const NavigationIcons: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="text-sm font-medium mb-2">Arrows</div>
      <div className="flex gap-4">
        <Icon name="arrowUp" size="lg" />
        <Icon name="arrowDown" size="lg" />
        <Icon name="arrowLeft" size="lg" />
        <Icon name="arrowRight" size="lg" />
      </div>

      <div className="text-sm font-medium mb-2 mt-6">Chevrons</div>
      <div className="flex gap-4">
        <Icon name="chevronUp" size="lg" />
        <Icon name="chevronDown" size="lg" />
        <Icon name="chevronLeft" size="lg" />
        <Icon name="chevronRight" size="lg" />
      </div>

      <div className="text-sm font-medium mb-2 mt-6">Double Chevrons</div>
      <div className="flex gap-4">
        <Icon name="chevronsUp" size="lg" />
        <Icon name="chevronsDown" size="lg" />
      </div>
    </div>
  ),
};

// File and folder icons
export const FileIcons: Story = {
  render: () => (
    <div className="grid grid-cols-6 gap-6">
      <div className="flex flex-col items-center gap-2">
        <Icon name="file" size="xl" variant="secondary" />
        <span className="text-xs">file</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="fileText" size="xl" variant="secondary" />
        <span className="text-xs">fileText</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="fileCode" size="xl" variant="secondary" />
        <span className="text-xs">fileCode</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="folder" size="xl" variant="warning" />
        <span className="text-xs">folder</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="folderOpen" size="xl" variant="warning" />
        <span className="text-xs">folderOpen</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="image" size="xl" variant="primary" />
        <span className="text-xs">image</span>
      </div>
    </div>
  ),
};

// In buttons and UI elements
export const InUIElements: Story = {
  render: () => (
    <div className="space-y-4">
      <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md">
        <Icon name="plus" size="sm" />
        <span>Add Item</span>
      </button>

      <button className="inline-flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-md">
        <Icon name="trash" size="sm" />
        <span>Delete</span>
      </button>

      <button className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md">
        <span>Next</span>
        <Icon name="arrowRight" size="sm" />
      </button>

      <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
        <Icon name="search" size="md" variant="secondary" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none flex-1"
        />
      </div>
    </div>
  ),
};

// Dark mode comparison
export const DarkModeSupport: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3">Light Mode</h3>
        <div className="flex gap-4 p-6 bg-background rounded-lg border">
          <Icon name="checkCircle" size="xl" variant="success" />
          <Icon name="alertTriangle" size="xl" variant="warning" />
          <Icon name="alertCircle" size="xl" variant="error" />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-3">Dark Mode</h3>
        <div className="flex gap-4 p-6 bg-background rounded-lg border dark">
          <Icon name="checkCircle" size="xl" variant="success" />
          <Icon name="alertTriangle" size="xl" variant="warning" />
          <Icon name="alertCircle" size="xl" variant="error" />
        </div>
      </div>
    </div>
  ),
};

// All available icons catalog
export const IconCatalog: Story = {
  render: () => {
    const iconEntries = Object.keys(Icons)
      .map((key) => key.replace('Icon', ''))
      .sort();

    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          All {iconEntries.length} available icons:
        </div>
        <div className="grid grid-cols-10 gap-4 max-h-[600px] overflow-y-auto p-4 border rounded-lg">
          {iconEntries.map((iconName) => (
            <div
              key={iconName}
              className="flex flex-col items-center gap-2 p-2 hover:bg-muted rounded-md transition-colors"
              title={iconName}
            >
              <Icon name={iconName} size="md" variant="primary" />
              <span className="text-[10px] text-center text-muted-foreground truncate w-full">
                {iconName}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

// Accessibility examples
export const Accessibility: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3">Semantic Icons</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Icon name="checkCircle" variant="success" aria-label="Completed" />
            <span className="text-sm">Task completed</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="alertCircle" variant="error" aria-label="Error" />
            <span className="text-sm">Error occurred</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Decorative Icons</h3>
        <div className="flex items-center gap-2">
          <Icon name="star" variant="warning" aria-hidden="true" />
          <span className="text-sm">Featured content (icon is decorative)</span>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Interactive Icons</h3>
        <div className="flex gap-4">
          <Icon
            name="heart"
            variant="error"
            onClick={() => {}}
            aria-label="Add to favorites"
          />
          <Icon
            name="bookmark"
            variant="primary"
            onClick={() => {}}
            aria-label="Bookmark this page"
          />
        </div>
      </div>
    </div>
  ),
};
