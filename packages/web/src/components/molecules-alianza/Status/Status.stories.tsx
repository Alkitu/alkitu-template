import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Status from './Status';
import type { StatusVariant } from './Status.types';

/**
 * Status component displays status indicators with icons and labels.
 *
 * ## Features
 * - 5 visual variants (default, highlighted, radio, checkbox, toggle)
 * - Custom icon rendering based on variant
 * - Flexible label display
 * - Theme integration with CSS variables
 * - Accessibility support
 *
 * ## Usage
 * Used throughout the app for displaying status of:
 * - Requests (pending, active, completed)
 * - Services (enabled, disabled)
 * - Users (active, inactive)
 * - Features (on/off)
 */
const meta = {
  title: 'Molecules/Alianza/Status',
  component: Status,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible status indicator molecule that displays various states with icons and labels. Supports multiple visual variants for different use cases.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Text label displayed next to the status icon',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '"Input text..."' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'highlighted', 'radio', 'checkbox', 'toggle'] as StatusVariant[],
      description: 'Visual variant of the status indicator',
      table: {
        type: { summary: 'StatusVariant' },
        defaultValue: { summary: 'default' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for custom styling',
      table: {
        type: { summary: 'string' },
      },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessibility label for screen readers',
      table: {
        type: { summary: 'string' },
      },
    },
    themeOverride: {
      control: 'object',
      description: 'Theme variable overrides for custom styling',
      table: {
        type: { summary: 'React.CSSProperties' },
      },
    },
  },
} satisfies Meta<typeof Status>;

export default meta;
type Story = Omit<StoryObj<typeof meta>, 'args'> & Partial<Pick<StoryObj<typeof meta>, 'args'>>;

/**
 * Default variant with star icon and muted colors.
 * Used for standard status displays.
 */
export const Default: Story = {
  args: {
    label: 'Default Status',
    variant: 'default',
  },
};

/**
 * Highlighted variant with star icon and warning colors.
 * Used to draw attention to important statuses.
 */
export const Highlighted: Story = {
  args: {
    label: 'Important Status',
    variant: 'highlighted',
  },
};

/**
 * Radio button style variant.
 * Used to show selected state in radio-like interfaces.
 */
export const Radio: Story = {
  args: {
    label: 'Selected Option',
    variant: 'radio',
  },
};

/**
 * Checkbox style variant.
 * Used to show checked/completed state.
 */
export const Checkbox: Story = {
  args: {
    label: 'Completed Task',
    variant: 'checkbox',
  },
};

/**
 * Toggle switch style variant.
 * Used to show enabled/disabled state.
 */
export const Toggle: Story = {
  args: {
    label: 'Feature Enabled',
    variant: 'toggle',
  },
};

/**
 * Status with short label.
 */
export const ShortLabel: Story = {
  args: {
    label: 'On',
    variant: 'toggle',
  },
};

/**
 * Status with long label.
 */
export const LongLabel: Story = {
  args: {
    label: 'This is a very long status label that demonstrates text handling',
    variant: 'default',
  },
};

/**
 * Status with empty label.
 */
export const EmptyLabel: Story = {
  args: {
    label: '',
    variant: 'default',
  },
};

/**
 * Status with custom styling.
 */
export const CustomStyling: Story = {
  args: {
    label: 'Custom Style',
    variant: 'default',
    className: 'border-2 border-blue-500 shadow-lg',
  },
};

/**
 * Status with theme overrides.
 */
export const ThemeOverride: Story = {
  args: {
    label: 'Themed Status',
    variant: 'highlighted',
    themeOverride: {
      '--space-3-5': '20px',
      '--space-4': '24px',
      backgroundColor: '#f0f9ff',
    } as React.CSSProperties,
  },
};

/**
 * Status with custom aria-label.
 */
export const CustomAccessibility: Story = {
  args: {
    label: 'Active',
    variant: 'radio',
    'aria-label': 'Current status is Active',
  },
};

/**
 * All variants displayed together for comparison.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Status label="Default Status" variant="default" />
      <Status label="Important Status" variant="highlighted" />
      <Status label="Selected Option" variant="radio" />
      <Status label="Completed Task" variant="checkbox" />
      <Status label="Feature Enabled" variant="toggle" />
    </div>
  ),
};

/**
 * Status indicators for request states.
 */
export const RequestStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Status label="Pending Review" variant="default" />
      <Status label="Urgent Request" variant="highlighted" />
      <Status label="In Progress" variant="radio" />
      <Status label="Completed" variant="checkbox" />
      <Status label="Active" variant="toggle" />
    </div>
  ),
};

/**
 * Status indicators for service states.
 */
export const ServiceStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Status label="Inactive Service" variant="default" />
      <Status label="Requires Attention" variant="highlighted" />
      <Status label="Running" variant="radio" />
      <Status label="Verified" variant="checkbox" />
      <Status label="Service Enabled" variant="toggle" />
    </div>
  ),
};

/**
 * Status indicators for user states.
 */
export const UserStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Status label="Inactive User" variant="default" />
      <Status label="Admin User" variant="highlighted" />
      <Status label="Active User" variant="radio" />
      <Status label="Verified Email" variant="checkbox" />
      <Status label="Notifications On" variant="toggle" />
    </div>
  ),
};

/**
 * Status indicators with different label lengths.
 */
export const LabelVariations: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Status label="On" variant="toggle" />
      <Status label="Active" variant="radio" />
      <Status label="Processing Request" variant="default" />
      <Status label="This is a very long status label for testing" variant="highlighted" />
      <Status label="" variant="checkbox" />
    </div>
  ),
};

/**
 * Status indicators with custom styling.
 */
export const CustomStyles: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Status label="Border Style" variant="default" className="border-2 border-primary" />
      <Status label="Shadow Style" variant="radio" className="shadow-lg" />
      <Status label="Padding Style" variant="checkbox" className="p-6" />
      <Status label="Background Style" variant="toggle" className="bg-blue-50" />
      <Status label="Combined Styles" variant="highlighted" className="border shadow-md p-5 bg-amber-50" />
    </div>
  ),
};

/**
 * Dark mode display (requires Storybook dark mode addon).
 */
export const DarkMode: Story = {
  args: {
    label: 'Dark Mode Status',
    variant: 'highlighted',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

/**
 * Status in a compact layout.
 */
export const CompactLayout: Story = {
  render: () => (
    <div className="flex gap-2 items-center">
      <Status label="Status 1" variant="default" />
      <Status label="Status 2" variant="radio" />
      <Status label="Status 3" variant="checkbox" />
    </div>
  ),
};

/**
 * Status in a grid layout.
 */
export const GridLayout: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <Status label="Default" variant="default" />
      <Status label="Highlighted" variant="highlighted" />
      <Status label="Radio" variant="radio" />
      <Status label="Checkbox" variant="checkbox" />
      <Status label="Toggle" variant="toggle" />
    </div>
  ),
};

/**
 * Status with special characters.
 */
export const SpecialCharacters: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Status label="Status & Description" variant="default" />
      <Status label="Status < 100%" variant="highlighted" />
      <Status label="Status → Active" variant="radio" />
      <Status label="Status ✓ Complete" variant="checkbox" />
      <Status label="状態 🎉" variant="toggle" />
    </div>
  ),
};

/**
 * Status for interactive demos.
 */
export const Interactive: Story = {
  args: {
    label: 'Interactive Status',
    variant: 'default',
  },
  argTypes: {
    variant: {
      control: 'select',
    },
    label: {
      control: 'text',
    },
  },
};

/**
 * Responsive layout example.
 */
export const ResponsiveLayout: Story = {
  render: () => (
    <div className="flex flex-col md:flex-row gap-4">
      <Status label="Status 1" variant="default" />
      <Status label="Status 2" variant="highlighted" />
      <Status label="Status 3" variant="radio" />
      <Status label="Status 4" variant="checkbox" />
      <Status label="Status 5" variant="toggle" />
    </div>
  ),
};
