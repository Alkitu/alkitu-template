import type { Meta, StoryObj } from '@storybook/react';
import { Spacer } from './Spacer';

const meta: Meta<typeof Spacer> = {
  title: 'Atomic Design/Atoms/Spacer',
  component: Spacer,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Size of the spacer based on spacing system hierarchy',
    },
    direction: {
      control: 'select',
      options: ['horizontal', 'vertical', 'both'],
      description: 'Direction of spacing',
    },
    spacing: {
      control: 'text',
      description: 'Custom spacing value (overrides size)',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Spacer>;

/**
 * Default vertical spacer with medium size
 */
export const Default: Story = {
  args: {
    size: 'md',
    direction: 'vertical',
  },
  render: (args) => (
    <div className="flex flex-col items-center">
      <div className="text-sm bg-primary/10 px-2 py-1 rounded">Start</div>
      <Spacer {...args} />
      <div className="text-sm bg-secondary/10 px-2 py-1 rounded">End</div>
    </div>
  ),
};

/**
 * Vertical spacers in different sizes
 */
export const VerticalSizes: Story = {
  render: () => (
    <div className="flex gap-8">
      {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map((size) => (
        <div key={size} className="flex flex-col items-center">
          <div className="text-xs text-muted-foreground mb-2">{size.toUpperCase()}</div>
          <div className="text-xs bg-primary/10 px-2 py-1 rounded">A</div>
          <Spacer size={size} />
          <div className="text-xs bg-secondary/10 px-2 py-1 rounded">B</div>
        </div>
      ))}
    </div>
  ),
};

/**
 * Horizontal spacers in different sizes
 */
export const HorizontalSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <div className="text-xs text-muted-foreground">{size.toUpperCase()}</div>
          <div className="flex items-center">
            <div className="text-xs bg-primary/10 px-2 py-1 rounded">Start</div>
            <Spacer size={size} direction="horizontal" />
            <div className="text-xs bg-secondary/10 px-2 py-1 rounded">End</div>
          </div>
        </div>
      ))}
    </div>
  ),
};

/**
 * Spacer with both directions (square spacer)
 */
export const BothDirections: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <div className="text-xs text-muted-foreground">{size.toUpperCase()} Both Directions</div>
          <div className="flex items-center">
            <div className="text-xs bg-primary/10 px-2 py-1 rounded">A</div>
            <Spacer size={size} direction="both" />
            <div className="text-xs bg-secondary/10 px-2 py-1 rounded">B</div>
          </div>
        </div>
      ))}
    </div>
  ),
};

/**
 * Custom spacing values
 */
export const CustomSpacing: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-xs text-muted-foreground mb-2">32px</div>
        <div className="flex flex-col items-center">
          <div className="text-xs bg-primary/10 px-2 py-1 rounded">Top</div>
          <Spacer spacing="32px" />
          <div className="text-xs bg-secondary/10 px-2 py-1 rounded">Bottom</div>
        </div>
      </div>
      <div>
        <div className="text-xs text-muted-foreground mb-2">2rem</div>
        <div className="flex flex-col items-center">
          <div className="text-xs bg-primary/10 px-2 py-1 rounded">Top</div>
          <Spacer spacing="2rem" />
          <div className="text-xs bg-secondary/10 px-2 py-1 rounded">Bottom</div>
        </div>
      </div>
      <div>
        <div className="text-xs text-muted-foreground mb-2">5em</div>
        <div className="flex flex-col items-center">
          <div className="text-xs bg-primary/10 px-2 py-1 rounded">Top</div>
          <Spacer spacing="5em" />
          <div className="text-xs bg-secondary/10 px-2 py-1 rounded">Bottom</div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Spacer with custom className and styling
 */
export const WithCustomStyling: Story = {
  render: () => (
    <div className="flex flex-col items-center">
      <div className="text-sm bg-primary/10 px-2 py-1 rounded">Component A</div>
      <Spacer
        size="lg"
        className="bg-primary/20"
        style={{ borderRadius: '4px' }}
      />
      <div className="text-sm bg-secondary/10 px-2 py-1 rounded">Component B</div>
    </div>
  ),
};

/**
 * Responsive layout example
 */
export const ResponsiveLayout: Story = {
  render: () => (
    <div className="border border-dashed border-border p-4 rounded">
      <div className="text-xs bg-card px-2 py-1 rounded border">Header</div>
      <Spacer size="md" />
      <div className="text-xs bg-card px-2 py-1 rounded border">Content Area</div>
      <Spacer size="sm" />
      <div className="text-xs bg-card px-2 py-1 rounded border">Footer</div>
    </div>
  ),
};

/**
 * Flex container example
 */
export const InFlexContainer: Story = {
  render: () => (
    <div className="flex flex-col border border-dashed border-border p-4 rounded">
      <div className="text-xs bg-primary/10 px-2 py-1 rounded">Item 1</div>
      <Spacer size="md" />
      <div className="text-xs bg-secondary/10 px-2 py-1 rounded">Item 2</div>
      <Spacer size="lg" />
      <div className="text-xs bg-accent/10 px-2 py-1 rounded">Item 3</div>
    </div>
  ),
};

/**
 * Size comparison scale
 */
export const SizeScale: Story = {
  render: () => (
    <div className="flex flex-col gap-2 p-4 bg-muted/10 rounded">
      <div className="text-sm font-semibold mb-2">Size Scale Comparison</div>
      {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map((size) => (
        <div key={size} className="flex items-center gap-4">
          <span className="text-xs w-10 font-mono">{size}:</span>
          <div className="bg-border h-px flex-1 relative">
            <Spacer size={size} direction="horizontal" className="bg-primary h-px" />
          </div>
        </div>
      ))}
    </div>
  ),
};
