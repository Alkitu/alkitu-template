import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from './Separator';

/**
 * Separator - Visual divider component
 *
 * A versatile separator component for dividing content sections.
 * Supports horizontal and vertical orientations with multiple size, color, and style variants.
 *
 * Usage example:
 * ```tsx
 * <Separator />
 * <Separator orientation="vertical" length="40px" />
 * <Separator decorative label="OR" variant="primary" />
 * ```
 */
const meta = {
  title: 'Atomic Design/Atoms/Separator',
  component: Separator,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A flexible separator component for dividing content. Supports horizontal and vertical orientations, multiple sizes and variants, decorative modes with labels or dots, and full theme integration using CSS variables.',
      },
    },
    chromatic: {
      viewports: [320, 768, 1200],
      diffThreshold: 0.2,
      delay: 300,
    },
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the separator',
    },
    size: {
      control: 'select',
      options: ['thin', 'medium', 'thick'],
      description: 'Thickness of the separator',
    },
    variant: {
      control: 'select',
      options: ['default', 'muted', 'primary', 'secondary'],
      description: 'Color variant using theme CSS variables',
    },
    borderStyle: {
      control: 'select',
      options: ['solid', 'dashed', 'dotted'],
      description: 'Border style of the separator',
    },
    decorative: {
      control: 'boolean',
      description: 'Enable decorative mode (dots or label)',
    },
    label: {
      control: 'text',
      description: 'Label for decorative separator',
    },
    length: {
      control: 'text',
      description: 'Custom length (for vertical separators)',
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default horizontal separator
 */
export const Default: Story = {
  args: {},
  render: (args) => (
    <div className="w-full space-y-2">
      <p className="text-sm">Content above separator</p>
      <Separator {...args} />
      <p className="text-sm">Content below separator</p>
    </div>
  ),
};

/**
 * Vertical separator
 */
export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    length: '40px',
  },
  render: (args) => (
    <div className="flex items-center gap-4 h-16">
      <span className="text-sm">Left content</span>
      <Separator {...args} />
      <span className="text-sm">Right content</span>
    </div>
  ),
};

/**
 * All orientations - for Chromatic visual regression
 */
export const AllOrientations: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <p className="text-xs text-muted-foreground mb-2">Horizontal</p>
        <div className="space-y-2">
          <p className="text-sm">Content above</p>
          <Separator orientation="horizontal" />
          <p className="text-sm">Content below</p>
        </div>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">Vertical</p>
        <div className="flex items-center gap-4 h-16">
          <span className="text-sm">Left</span>
          <Separator orientation="vertical" length="40px" />
          <span className="text-sm">Right</span>
        </div>
      </div>
    </div>
  ),
  parameters: {
    chromatic: {
      disableSnapshot: false,
    },
  },
};

/**
 * All sizes - for Chromatic visual regression
 */
export const AllSizes: Story = {
  render: () => (
    <div className="space-y-6 w-full">
      <div>
        <p className="text-xs text-muted-foreground mb-2">Thin (1px)</p>
        <Separator size="thin" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">Medium (2px)</p>
        <Separator size="medium" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">Thick (4px)</p>
        <Separator size="thick" />
      </div>
    </div>
  ),
  parameters: {
    chromatic: {
      disableSnapshot: false,
    },
  },
};

/**
 * All color variants - for Chromatic visual regression
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-6 w-full">
      <div>
        <p className="text-xs text-muted-foreground mb-2">Default</p>
        <Separator variant="default" size="medium" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">Muted</p>
        <Separator variant="muted" size="medium" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">Primary</p>
        <Separator variant="primary" size="medium" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">Secondary</p>
        <Separator variant="secondary" size="medium" />
      </div>
    </div>
  ),
  parameters: {
    chromatic: {
      disableSnapshot: false,
    },
  },
};

/**
 * All border styles - for Chromatic visual regression
 */
export const AllStyles: Story = {
  render: () => (
    <div className="space-y-6 w-full">
      <div>
        <p className="text-xs text-muted-foreground mb-2">Solid</p>
        <Separator borderStyle="solid" size="medium" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">Dashed</p>
        <Separator borderStyle="dashed" size="medium" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">Dotted</p>
        <Separator borderStyle="dotted" size="thick" />
      </div>
    </div>
  ),
  parameters: {
    chromatic: {
      disableSnapshot: false,
    },
  },
};

/**
 * Decorative separator with label
 */
export const DecorativeWithLabel: Story = {
  args: {
    decorative: true,
    label: 'OR',
    variant: 'primary',
  },
};

/**
 * Decorative separator with dots
 */
export const DecorativeDots: Story = {
  args: {
    decorative: true,
  },
};

/**
 * All decorative variants
 */
export const AllDecorativeVariants: Story = {
  render: () => (
    <div className="space-y-8 w-full">
      <div>
        <p className="text-xs text-muted-foreground mb-3">With Label - Default</p>
        <Separator decorative label="Section Break" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-3">With Label - Primary</p>
        <Separator decorative label="OR" variant="primary" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-3">Dots Only</p>
        <Separator decorative />
      </div>
    </div>
  ),
  parameters: {
    chromatic: {
      disableSnapshot: false,
    },
  },
};

/**
 * Vertical separators with different sizes
 */
export const VerticalSizes: Story = {
  render: () => (
    <div className="flex items-center justify-center gap-6 h-24">
      <div className="text-center space-y-2">
        <Separator orientation="vertical" size="thin" length="60px" />
        <p className="text-xs text-muted-foreground">Thin</p>
      </div>
      <div className="text-center space-y-2">
        <Separator orientation="vertical" size="medium" length="60px" />
        <p className="text-xs text-muted-foreground">Medium</p>
      </div>
      <div className="text-center space-y-2">
        <Separator orientation="vertical" size="thick" length="60px" />
        <p className="text-xs text-muted-foreground">Thick</p>
      </div>
      <div className="text-center space-y-2">
        <Separator orientation="vertical" variant="primary" length="60px" />
        <p className="text-xs text-muted-foreground">Primary</p>
      </div>
    </div>
  ),
  parameters: {
    chromatic: {
      disableSnapshot: false,
    },
  },
};

/**
 * Real-world usage: Navigation menu
 */
export const NavigationMenu: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <button className="text-sm hover:text-primary">Home</button>
      <Separator orientation="vertical" length="16px" variant="muted" />
      <button className="text-sm hover:text-primary">Products</button>
      <Separator orientation="vertical" length="16px" variant="muted" />
      <button className="text-sm hover:text-primary">About</button>
      <Separator orientation="vertical" length="16px" variant="muted" />
      <button className="text-sm hover:text-primary">Contact</button>
    </div>
  ),
};

/**
 * Real-world usage: Article sections
 */
export const ArticleSections: Story = {
  render: () => (
    <div className="space-y-4 text-sm max-w-2xl">
      <div>
        <h4 className="font-semibold mb-2">Introduction</h4>
        <p className="text-muted-foreground">
          This is the introduction section with some sample content.
        </p>
      </div>
      <Separator />
      <div>
        <h4 className="font-semibold mb-2">Main Content</h4>
        <p className="text-muted-foreground">
          This is the main content section with detailed information.
        </p>
      </div>
      <Separator decorative label="Related Articles" />
      <div>
        <h4 className="font-semibold mb-2">Conclusion</h4>
        <p className="text-muted-foreground">
          This is the conclusion section wrapping up the content.
        </p>
      </div>
    </div>
  ),
};

/**
 * Dark theme - for theme testing
 */
export const DarkTheme: Story = {
  args: {
    size: 'medium',
  },
  render: (args) => (
    <div className="space-y-4">
      <p className="text-sm">Content above separator</p>
      <Separator {...args} />
      <p className="text-sm">Content below separator</p>
    </div>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="dark p-6">
        <Story />
      </div>
    ),
  ],
};

/**
 * Interactive playground - for testing all prop combinations
 */
export const Playground: Story = {
  args: {
    orientation: 'horizontal',
    size: 'thin',
    variant: 'default',
    borderStyle: 'solid',
    decorative: false,
    label: '',
  },
  render: (args) => (
    <div className="w-full space-y-4">
      <p className="text-sm">Content above separator</p>
      <Separator {...args} />
      <p className="text-sm">Content below separator</p>
    </div>
  ),
};
