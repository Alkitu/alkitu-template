import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './Tooltip';

const meta = {
  title: 'Atomic Design/Atoms/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Tooltip component displays contextual information on hover, focus, or click. Automatically positions itself to stay within the viewport.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    content: {
      description: 'Tooltip content to display',
      control: 'text',
    },
    placement: {
      description: 'Tooltip placement relative to trigger',
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    trigger: {
      description: 'Trigger type for showing the tooltip',
      control: 'select',
      options: ['hover', 'click', 'focus'],
    },
    delay: {
      description: 'Delay before showing tooltip (milliseconds)',
      control: 'number',
    },
    disabled: {
      description: 'Whether tooltip is disabled',
      control: 'boolean',
    },
    showArrow: {
      description: 'Whether to show arrow indicator',
      control: 'boolean',
    },
    offset: {
      description: 'Offset distance from trigger element (pixels)',
      control: 'number',
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

// ===================================
// Default Story
// ===================================

export const Default: Story = {
  args: {
    content: 'This is a helpful tooltip',
    placement: 'top',
    trigger: 'hover',
    delay: 300,
    disabled: false,
    showArrow: true,
    offset: 8,
    children: <button className="px-4 py-2 bg-primary text-primary-foreground rounded">Hover me</button>,
  },
};

// ===================================
// Placement Variations
// ===================================

export const PlacementTop: Story = {
  args: {
    content: 'Tooltip on top',
    placement: 'top',
    children: <button className="px-4 py-2 bg-primary text-primary-foreground rounded">Top</button>,
  },
};

export const PlacementBottom: Story = {
  args: {
    content: 'Tooltip on bottom',
    placement: 'bottom',
    children: <button className="px-4 py-2 bg-primary text-primary-foreground rounded">Bottom</button>,
  },
};

export const PlacementLeft: Story = {
  args: {
    content: 'Tooltip on left',
    placement: 'left',
    children: <button className="px-4 py-2 bg-primary text-primary-foreground rounded">Left</button>,
  },
};

export const PlacementRight: Story = {
  args: {
    content: 'Tooltip on right',
    placement: 'right',
    children: <button className="px-4 py-2 bg-primary text-primary-foreground rounded">Right</button>,
  },
};

// ===================================
// Trigger Variations
// ===================================

export const HoverTrigger: Story = {
  args: {
    content: 'Shown on hover',
    trigger: 'hover',
    children: <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded">Hover me</button>,
  },
};

export const ClickTrigger: Story = {
  args: {
    content: 'Shown on click',
    trigger: 'click',
    children: <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded">Click me</button>,
  },
};

export const FocusTrigger: Story = {
  args: {
    content: 'Shown on focus',
    trigger: 'focus',
    children: <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded">Focus me</button>,
  },
};

// ===================================
// Arrow Variations
// ===================================

export const WithArrow: Story = {
  args: {
    content: 'Tooltip with arrow',
    showArrow: true,
    children: <button className="px-4 py-2 bg-accent text-accent-foreground rounded">With arrow</button>,
  },
};

export const WithoutArrow: Story = {
  args: {
    content: 'Tooltip without arrow',
    showArrow: false,
    children: <button className="px-4 py-2 bg-accent text-accent-foreground rounded">Without arrow</button>,
  },
};

// ===================================
// Delay Variations
// ===================================

export const NoDelay: Story = {
  args: {
    content: 'Shows immediately',
    delay: 0,
    children: <button className="px-4 py-2 bg-primary text-primary-foreground rounded">No delay</button>,
  },
};

export const ShortDelay: Story = {
  args: {
    content: 'Shows after 100ms',
    delay: 100,
    children: <button className="px-4 py-2 bg-primary text-primary-foreground rounded">Short delay (100ms)</button>,
  },
};

export const LongDelay: Story = {
  args: {
    content: 'Shows after 1 second',
    delay: 1000,
    children: <button className="px-4 py-2 bg-primary text-primary-foreground rounded">Long delay (1s)</button>,
  },
};

// ===================================
// Disabled State
// ===================================

export const Disabled: Story = {
  args: {
    content: 'This will not show',
    disabled: true,
    children: <button className="px-4 py-2 bg-muted text-muted-foreground rounded opacity-50">Disabled tooltip</button>,
  },
};

// ===================================
// Complex Content
// ===================================

export const ComplexContent: Story = {
  args: {
    content: (
      <div className="space-y-2">
        <div className="font-bold text-sm">Keyboard Shortcut</div>
        <div className="text-xs">
          <kbd className="px-2 py-1 bg-background border rounded">Ctrl</kbd> +{' '}
          <kbd className="px-2 py-1 bg-background border rounded">K</kbd>
        </div>
      </div>
    ),
    children: <button className="px-4 py-2 bg-primary text-primary-foreground rounded">Complex content</button>,
  },
};

export const LongContent: Story = {
  args: {
    content:
      'This is a longer tooltip message that demonstrates how the tooltip handles wrapping text. The max-width is set to 300px, so longer content will wrap naturally.',
    children: <button className="px-4 py-2 bg-primary text-primary-foreground rounded">Long content</button>,
  },
};

// ===================================
// Offset Variations
// ===================================

export const SmallOffset: Story = {
  args: {
    content: 'Small offset (4px)',
    offset: 4,
    children: <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded">Small offset</button>,
  },
};

export const LargeOffset: Story = {
  args: {
    content: 'Large offset (24px)',
    offset: 24,
    children: <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded">Large offset</button>,
  },
};

// ===================================
// Custom Styling
// ===================================

export const CustomClassName: Story = {
  args: {
    content: 'Custom styled tooltip',
    className: 'bg-destructive text-destructive-foreground border-destructive',
    children: <button className="px-4 py-2 bg-primary text-primary-foreground rounded">Custom class</button>,
  },
};

export const CustomStyle: Story = {
  args: {
    content: 'Inline styled tooltip',
    style: {
      backgroundColor: 'hsl(var(--chart-1))',
      color: 'white',
      borderColor: 'hsl(var(--chart-1))',
    },
    children: <button className="px-4 py-2 bg-primary text-primary-foreground rounded">Custom style</button>,
  },
};

// ===================================
// Real-world Examples
// ===================================

export const IconButton: Story = {
  args: {
    content: 'Settings',
    placement: 'top',
    children: (
      <button className="p-2 rounded-full hover:bg-accent" aria-label="Settings">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>
    ),
  },
};

export const FormFieldHelp: Story = {
  args: {
    content: 'Enter a valid email address. We will never share your email with anyone.',
    placement: 'right',
    children: (
      <button
        className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-muted text-muted-foreground text-xs"
        aria-label="Help"
      >
        ?
      </button>
    ),
  },
};

export const TableHeaderInfo: Story = {
  args: {
    content: 'Click to sort by this column',
    placement: 'top',
    trigger: 'hover',
    children: (
      <button className="inline-flex items-center gap-1 px-2 py-1 hover:bg-accent rounded">
        <span>Name</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="m7 15 5 5 5-5" />
          <path d="m7 9 5-5 5 5" />
        </svg>
      </button>
    ),
  },
};

// ===================================
// Interactive Playground
// ===================================

export const Playground: Story = {
  args: {
    content: 'Customize me in the controls panel!',
    placement: 'top',
    trigger: 'hover',
    delay: 300,
    disabled: false,
    showArrow: true,
    offset: 8,
    children: <button className="px-4 py-2 bg-primary text-primary-foreground rounded">Playground</button>,
  },
};
