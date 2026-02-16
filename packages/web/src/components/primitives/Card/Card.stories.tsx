import type { Meta, StoryObj } from '@storybook/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './Card';

const meta = {
  title: 'Primitives/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible card container component with distinct sections. Supports multiple variants, padding options, and theme integration.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'bordered', 'elevated', 'flat'],
      description: 'Visual variant of the card',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Padding size for the card',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'md' },
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default card with border and medium padding
 */
export const Default: Story = {
  args: {
    variant: 'default',
    padding: 'md',
  },
  render: (args) => (
    <Card {...args} style={{ width: '400px' }}>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>This is a description of the card content.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          This is the main content area of the card. It can contain any React children
          including text, images, forms, or other components.
        </p>
      </CardContent>
      <CardFooter>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded">
          Action
        </button>
      </CardFooter>
    </Card>
  ),
};

/**
 * Card with emphasized border
 */
export const Bordered: Story = {
  args: {
    variant: 'bordered',
    padding: 'md',
  },
  render: (args) => (
    <Card {...args} style={{ width: '400px' }}>
      <CardHeader>
        <CardTitle>Bordered Card</CardTitle>
        <CardDescription>This card has a more prominent border.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">Perfect for emphasizing important content or sections.</p>
      </CardContent>
    </Card>
  ),
};

/**
 * Card with shadow elevation and hover effect
 */
export const Elevated: Story = {
  args: {
    variant: 'elevated',
    padding: 'md',
  },
  render: (args) => (
    <Card {...args} style={{ width: '400px' }}>
      <CardHeader>
        <CardTitle>Elevated Card</CardTitle>
        <CardDescription>Hover to see the shadow grow.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          This variant uses shadows instead of borders and has a nice hover effect.
        </p>
      </CardContent>
      <CardFooter>
        <span className="text-xs text-muted-foreground">Hover me</span>
      </CardFooter>
    </Card>
  ),
};

/**
 * Card without border or shadow
 */
export const Flat: Story = {
  args: {
    variant: 'flat',
    padding: 'md',
  },
  render: (args) => (
    <Card {...args} style={{ width: '400px' }}>
      <CardHeader>
        <CardTitle>Flat Card</CardTitle>
        <CardDescription>Minimal design with no borders or shadows.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">Great for subtle content separation.</p>
      </CardContent>
    </Card>
  ),
};

/**
 * Card with no padding (padding="none")
 */
export const NoPadding: Story = {
  args: {
    variant: 'default',
    padding: 'none',
  },
  render: (args) => (
    <Card {...args} style={{ width: '400px' }}>
      <div className="p-6">
        <CardHeader>
          <CardTitle>Custom Padding</CardTitle>
          <CardDescription>This card has no default padding.</CardDescription>
        </CardHeader>
      </div>
      <div className="border-t border-border">
        <CardContent className="p-6">
          <p className="text-sm">You can add custom padding to individual sections.</p>
        </CardContent>
      </div>
    </Card>
  ),
};

/**
 * Card with small padding
 */
export const SmallPadding: Story = {
  args: {
    variant: 'default',
    padding: 'sm',
  },
  render: (args) => (
    <Card {...args} style={{ width: '400px' }}>
      <CardHeader>
        <CardTitle>Small Padding</CardTitle>
        <CardDescription>Compact card with reduced spacing.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">Ideal for dense layouts or small screens.</p>
      </CardContent>
    </Card>
  ),
};

/**
 * Card with large padding
 */
export const LargePadding: Story = {
  args: {
    variant: 'default',
    padding: 'lg',
  },
  render: (args) => (
    <Card {...args} style={{ width: '400px' }}>
      <CardHeader>
        <CardTitle>Large Padding</CardTitle>
        <CardDescription>Spacious card with generous padding.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">Great for featuring important content.</p>
      </CardContent>
    </Card>
  ),
};

/**
 * Card with only a header section
 */
export const HeaderOnly: Story = {
  render: () => (
    <Card style={{ width: '400px' }}>
      <CardHeader>
        <CardTitle>Header Only Card</CardTitle>
        <CardDescription>Sometimes you only need a header.</CardDescription>
      </CardHeader>
    </Card>
  ),
};

/**
 * Card with only content section
 */
export const ContentOnly: Story = {
  render: () => (
    <Card style={{ width: '400px' }}>
      <CardContent>
        <p className="text-sm">
          This card only contains content, no header or footer.
        </p>
      </CardContent>
    </Card>
  ),
};

/**
 * Card with complex content and multiple actions
 */
export const ComplexCard: Story = {
  render: () => (
    <Card variant="elevated" style={{ width: '450px' }}>
      <CardHeader>
        <CardTitle>Product Launch</CardTitle>
        <CardDescription>New feature announcement</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm">
            We are excited to announce the launch of our new feature that will
            revolutionize your workflow.
          </p>
          <ul className="list-disc list-inside text-sm space-y-2">
            <li>Improved performance</li>
            <li>Better user experience</li>
            <li>Enhanced security</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="gap-3">
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded">
          Learn More
        </button>
        <button className="px-4 py-2 border border-border rounded">Dismiss</button>
      </CardFooter>
    </Card>
  ),
};

/**
 * Multiple cards in a grid layout
 */
export const CardGrid: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4" style={{ width: '800px' }}>
      <Card variant="bordered">
        <CardHeader>
          <CardTitle>Feature 1</CardTitle>
          <CardDescription>Description for feature 1</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Content for the first feature card.</p>
        </CardContent>
      </Card>
      <Card variant="bordered">
        <CardHeader>
          <CardTitle>Feature 2</CardTitle>
          <CardDescription>Description for feature 2</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Content for the second feature card.</p>
        </CardContent>
      </Card>
      <Card variant="bordered">
        <CardHeader>
          <CardTitle>Feature 3</CardTitle>
          <CardDescription>Description for feature 3</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Content for the third feature card.</p>
        </CardContent>
      </Card>
      <Card variant="bordered">
        <CardHeader>
          <CardTitle>Feature 4</CardTitle>
          <CardDescription>Description for feature 4</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Content for the fourth feature card.</p>
        </CardContent>
      </Card>
    </div>
  ),
};

/**
 * Card with custom styling
 */
export const CustomStyling: Story = {
  render: () => (
    <Card
      variant="flat"
      className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-300"
      style={{ width: '400px' }}
    >
      <CardHeader>
        <CardTitle className="text-purple-700">Custom Styled Card</CardTitle>
        <CardDescription className="text-purple-600">
          Cards support custom styling
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-purple-900">
          You can apply custom classes and styles to any card component.
        </p>
      </CardContent>
    </Card>
  ),
};

/**
 * Minimal card example
 */
export const Minimal: Story = {
  render: () => (
    <Card variant="flat" padding="sm" style={{ width: '300px' }}>
      <CardContent>
        <p className="text-sm">Minimal card with just content.</p>
      </CardContent>
    </Card>
  ),
};

/**
 * Interactive card with hover state
 */
export const Interactive: Story = {
  render: () => (
    <Card
      variant="elevated"
      className="cursor-pointer hover:scale-105 transition-transform"
      style={{ width: '350px' }}
    >
      <CardHeader>
        <CardTitle>Click Me</CardTitle>
        <CardDescription>This card is interactive</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          Hover or click to see the interactive effects.
        </p>
      </CardContent>
    </Card>
  ),
};
