import type { Meta, StoryObj } from '@storybook/react';
import { ModeToggle } from './ModeToggle';

/**
 * ModeToggle - Theme mode switcher component
 *
 * Allows users to switch between light, dark, and system theme modes.
 * Integrates with next-themes and provides two display variants.
 *
 * ## Features
 * - Light/Dark/System mode support
 * - Two display variants (icon dropdown and button group)
 * - Smooth icon transitions
 * - Active state indicators
 * - Full keyboard accessibility
 * - Proper ARIA labels
 * - Hydration-safe rendering
 *
 * ## Usage
 * - Use icon variant for compact navigation bars
 * - Use buttons variant for settings panels
 * - Enable showLabels for better clarity
 * - Use onThemeChange callback for tracking
 */
const meta = {
  title: 'Molecules/ModeToggle',
  component: ModeToggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Theme mode toggle component that allows users to switch between light, dark, and system themes. Integrates with next-themes for theme management.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['icon', 'buttons'],
      description: 'Display variant for the toggle',
      table: {
        defaultValue: { summary: 'icon' },
        type: { summary: "'icon' | 'buttons'" },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the toggle button(s)',
      table: {
        defaultValue: { summary: 'md' },
        type: { summary: "'sm' | 'md' | 'lg'" },
      },
    },
    showLabels: {
      control: 'boolean',
      description: 'Show labels alongside icons (buttons variant only)',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    showTooltip: {
      control: 'boolean',
      description: 'Show tooltip on hover (icon variant only)',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable theme switching',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
      description: 'Dropdown menu alignment (icon variant only)',
      table: {
        defaultValue: { summary: 'end' },
        type: { summary: "'start' | 'center' | 'end'" },
      },
    },
    iconSize: {
      control: 'number',
      description: 'Custom icon size in pixels',
      table: {
        type: { summary: 'number' },
      },
    },
    onThemeChange: {
      action: 'themeChanged',
      description: 'Callback when theme changes',
      table: {
        type: { summary: '(theme: ThemeMode) => void' },
      },
    },
  },
} satisfies Meta<typeof ModeToggle>;

export default meta;
type Story = Omit<StoryObj<typeof meta>, 'args'> & Partial<Pick<StoryObj<typeof meta>, 'args'>>;

/**
 * Default icon dropdown variant
 */
export const Default: Story = {
  args: {},
};

/**
 * Icon variant with small size
 */
export const IconSmall: Story = {
  args: {
    variant: 'icon',
    size: 'sm',
  },
};

/**
 * Icon variant with medium size (default)
 */
export const IconMedium: Story = {
  args: {
    variant: 'icon',
    size: 'md',
  },
};

/**
 * Icon variant with large size
 */
export const IconLarge: Story = {
  args: {
    variant: 'icon',
    size: 'lg',
  },
};

/**
 * Icon variant with tooltip
 */
export const IconWithTooltip: Story = {
  args: {
    variant: 'icon',
    showTooltip: true,
    tooltipText: 'Switch theme mode',
  },
};

/**
 * Icon variant with custom icon size
 */
export const IconCustomSize: Story = {
  args: {
    variant: 'icon',
    iconSize: 24,
  },
};

/**
 * Button group variant without labels
 */
export const ButtonsNoLabels: Story = {
  args: {
    variant: 'buttons',
    showLabels: false,
  },
};

/**
 * Button group variant with labels
 */
export const ButtonsWithLabels: Story = {
  args: {
    variant: 'buttons',
    showLabels: true,
  },
};

/**
 * Button group with small size
 */
export const ButtonsSmall: Story = {
  args: {
    variant: 'buttons',
    size: 'sm',
    showLabels: true,
  },
};

/**
 * Button group with medium size
 */
export const ButtonsMedium: Story = {
  args: {
    variant: 'buttons',
    size: 'md',
    showLabels: true,
  },
};

/**
 * Button group with large size
 */
export const ButtonsLarge: Story = {
  args: {
    variant: 'buttons',
    size: 'lg',
    showLabels: true,
  },
};

/**
 * Disabled state for icon variant
 */
export const IconDisabled: Story = {
  args: {
    variant: 'icon',
    disabled: true,
  },
};

/**
 * Disabled state for buttons variant
 */
export const ButtonsDisabled: Story = {
  args: {
    variant: 'buttons',
    showLabels: true,
    disabled: true,
  },
};

/**
 * Custom alignment - start
 */
export const AlignStart: Story = {
  args: {
    variant: 'icon',
    align: 'start',
  },
};

/**
 * Custom alignment - center
 */
export const AlignCenter: Story = {
  args: {
    variant: 'icon',
    align: 'center',
  },
};

/**
 * Custom alignment - end (default)
 */
export const AlignEnd: Story = {
  args: {
    variant: 'icon',
    align: 'end',
  },
};

/**
 * With change callback
 */
export const WithCallback: Story = {
  args: {
    variant: 'buttons',
    showLabels: true,
    onThemeChange: (theme) => {
      console.log('Theme changed to:', theme);
    },
  },
};

/**
 * In navigation bar context
 */
export const InNavigationBar: Story = {
  render: (args) => (
    <nav className="flex items-center justify-between p-4 bg-background border-b">
      <div className="flex items-center gap-4">
        <span className="font-bold text-lg">Brand</span>
        <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
          Home
        </a>
        <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
          About
        </a>
      </div>
      <div className="flex items-center gap-2">
        <button className="px-3 py-1.5 text-sm rounded-md hover:bg-muted">
          Notifications
        </button>
        <ModeToggle {...args} />
        <button className="px-3 py-1.5 text-sm rounded-md hover:bg-muted">
          Profile
        </button>
      </div>
    </nav>
  ),
  args: {
    variant: 'icon',
    size: 'md',
  },
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * In settings panel context
 */
export const InSettingsPanel: Story = {
  render: (args) => (
    <div className="max-w-md p-6 space-y-6 bg-background border rounded-lg">
      <div>
        <h2 className="text-lg font-semibold mb-1">Appearance</h2>
        <p className="text-sm text-muted-foreground">
          Customize the appearance of the application
        </p>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Theme</p>
            <p className="text-sm text-muted-foreground">
              Select your preferred theme mode
            </p>
          </div>
          <ModeToggle {...args} />
        </div>
      </div>
    </div>
  ),
  args: {
    variant: 'buttons',
    showLabels: true,
  },
  parameters: {
    layout: 'centered',
  },
};

/**
 * Multiple instances
 */
export const MultipleInstances: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium w-32">Icon variant:</span>
        <ModeToggle variant="icon" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium w-32">Buttons (no labels):</span>
        <ModeToggle variant="buttons" showLabels={false} />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium w-32">Buttons (with labels):</span>
        <ModeToggle variant="buttons" showLabels={true} />
      </div>
    </div>
  ),
  parameters: {
    layout: 'centered',
  },
};

/**
 * Size comparison
 */
export const SizeComparison: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Icon Variant</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-12">Small:</span>
            <ModeToggle variant="icon" size="sm" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-12">Medium:</span>
            <ModeToggle variant="icon" size="md" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-12">Large:</span>
            <ModeToggle variant="icon" size="lg" />
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Buttons Variant</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-12">Small:</span>
            <ModeToggle variant="buttons" size="sm" showLabels />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-12">Medium:</span>
            <ModeToggle variant="buttons" size="md" showLabels />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-12">Large:</span>
            <ModeToggle variant="buttons" size="lg" showLabels />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'centered',
  },
};

/**
 * Interactive playground
 */
export const Playground: Story = {
  args: {
    variant: 'icon',
    size: 'md',
    showLabels: false,
    showTooltip: true,
    disabled: false,
    align: 'end',
  },
};
