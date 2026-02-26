import type { Meta, StoryObj } from '@storybook/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './Card';

/**
 * Card is a flexible container molecule with distinct sections (Header, Content, Footer).
 * It's one of the most commonly used UI patterns for grouping related content.
 *
 * ## Usage
 *
 * Cards are used extensively across the application:
 * - Admin dashboards
 * - User profiles
 * - Settings panels
 * - Content listings
 * - Form containers
 *
 * ## Features
 *
 * - Four visual variants (default, bordered, elevated, flat)
 * - Flexible padding options (none, sm, md, lg)
 * - Composable sections (Header, Content, Footer)
 * - Theme-aware with CSS variables
 * - Fully accessible
 * - TypeScript support
 */
const meta = {
  title: 'Molecules/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible container component with distinct sections for organizing content into logical groups.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'bordered', 'elevated', 'flat'],
      description: 'Visual style variant of the card',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Padding size for the card',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = Omit<StoryObj<typeof meta>, 'args'> & Partial<Pick<StoryObj<typeof meta>, 'args'>>;

/**
 * Default card with all sections (Header with Title and Description, Content, Footer)
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
        <CardDescription>
          This is a description of the card explaining what it contains.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          This is the main content area of the card. It can contain any content including text,
          images, forms, or other components.
        </p>
      </CardContent>
      <CardFooter>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
          Action
        </button>
      </CardFooter>
    </Card>
  ),
};

/**
 * Bordered variant with emphasized border
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
        <p className="text-sm">
          The bordered variant uses a thicker border to create more visual separation from other
          content.
        </p>
      </CardContent>
    </Card>
  ),
};

/**
 * Elevated variant with shadow for depth
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
        <CardDescription>This card appears to float with a shadow.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          The elevated variant includes a shadow and hover effect to create depth and draw
          attention.
        </p>
      </CardContent>
      <CardFooter>
        <button className="text-sm text-primary">Learn More</button>
      </CardFooter>
    </Card>
  ),
};

/**
 * Flat variant without borders or shadows
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
        <CardDescription>This card has no border or shadow.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          The flat variant is minimal and blends seamlessly with the background, useful for subtle
          grouping.
        </p>
      </CardContent>
    </Card>
  ),
};

/**
 * Card with no padding - useful for images or full-width content
 */
export const NoPadding: Story = {
  args: {
    variant: 'default',
    padding: 'none',
  },
  render: (args) => (
    <Card {...args} style={{ width: '400px' }}>
      <div className="aspect-video bg-muted flex items-center justify-center">
        <span className="text-muted-foreground">Image Placeholder</span>
      </div>
      <div className="p-6">
        <CardHeader className="p-0 mb-4">
          <CardTitle>No Padding Card</CardTitle>
          <CardDescription>Useful for cards with images or full-width content.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <p className="text-sm">
            The card itself has no padding, but sections can add their own padding as needed.
          </p>
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
        <CardDescription>Compact card with less spacing.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">This card uses smaller padding for a more compact layout.</p>
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
        <p className="text-sm">This card uses larger padding for a more spacious layout.</p>
      </CardContent>
    </Card>
  ),
};

/**
 * Card with only header - minimal composition
 */
export const HeaderOnly: Story = {
  render: () => (
    <Card style={{ width: '400px' }}>
      <CardHeader>
        <CardTitle>Header Only</CardTitle>
        <CardDescription>A card can contain just a header section.</CardDescription>
      </CardHeader>
    </Card>
  ),
};

/**
 * Card with only content - minimal composition
 */
export const ContentOnly: Story = {
  render: () => (
    <Card style={{ width: '400px' }}>
      <CardContent>
        <p className="text-sm">
          A card can contain just content without a header or footer. This is useful for simple
          content grouping.
        </p>
      </CardContent>
    </Card>
  ),
};

/**
 * Card with header and content - common composition
 */
export const HeaderAndContent: Story = {
  render: () => (
    <Card style={{ width: '400px' }}>
      <CardHeader>
        <CardTitle>Product Details</CardTitle>
        <CardDescription>View complete product information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Price:</span>
            <span className="font-medium">$99.99</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Stock:</span>
            <span className="font-medium">In Stock</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Category:</span>
            <span className="font-medium">Electronics</span>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

/**
 * Card with content and footer - action-focused composition
 */
export const ContentAndFooter: Story = {
  render: () => (
    <Card style={{ width: '400px' }}>
      <CardContent>
        <p className="text-sm mb-4">
          Are you sure you want to delete this item? This action cannot be undone.
        </p>
      </CardContent>
      <CardFooter>
        <button className="px-4 py-2 text-sm border border-border rounded-md">Cancel</button>
        <button className="px-4 py-2 text-sm bg-destructive text-destructive-foreground rounded-md ml-2">
          Delete
        </button>
      </CardFooter>
    </Card>
  ),
};

/**
 * User profile card - real-world example
 */
export const UserProfile: Story = {
  render: () => (
    <Card variant="elevated" style={{ width: '400px' }}>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-2xl">👤</span>
          </div>
          <div>
            <CardTitle>John Doe</CardTitle>
            <CardDescription>Senior Developer</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Email:</span>
            <span>john.doe@example.com</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Location:</span>
            <span>San Francisco, CA</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Joined:</span>
            <span>January 2023</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md">
          View Profile
        </button>
      </CardFooter>
    </Card>
  ),
};

/**
 * Dashboard stats card - real-world example
 */
export const DashboardStats: Story = {
  render: () => (
    <Card variant="bordered" style={{ width: '300px' }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Total Revenue</CardTitle>
          <span className="text-2xl">💰</span>
        </div>
        <CardDescription>Last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-3xl font-bold">$45,231</div>
          <div className="text-sm text-green-600">+20.1% from last month</div>
        </div>
      </CardContent>
    </Card>
  ),
};

/**
 * Form container card - real-world example
 */
export const FormContainer: Story = {
  render: () => (
    <Card style={{ width: '500px' }}>
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Enter your information to create a new account</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-border rounded-md"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-border rounded-md"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-border rounded-md"
              placeholder="••••••••"
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md">
          Create Account
        </button>
      </CardFooter>
    </Card>
  ),
};

/**
 * Multiple cards in a grid layout
 */
export const CardGrid: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4" style={{ width: '1000px' }}>
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Card 1</CardTitle>
          <CardDescription>First card in grid</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Content for card 1</p>
        </CardContent>
      </Card>
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Card 2</CardTitle>
          <CardDescription>Second card in grid</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Content for card 2</p>
        </CardContent>
      </Card>
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Card 3</CardTitle>
          <CardDescription>Third card in grid</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Content for card 3</p>
        </CardContent>
      </Card>
    </div>
  ),
};

/**
 * Interactive clickable card with hover effects
 */
export const ClickableCard: Story = {
  render: () => (
    <Card
      variant="elevated"
      style={{ width: '400px', cursor: 'pointer' }}
      className="hover:scale-105 active:scale-100"
      role="button"
      tabIndex={0}
      onClick={() => alert('Card clicked!')}
    >
      <CardHeader>
        <CardTitle>Clickable Card</CardTitle>
        <CardDescription>Click anywhere on this card to interact</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          This card acts as a button and includes hover effects for better user feedback.
        </p>
      </CardContent>
      <CardFooter>
        <span className="text-sm text-primary">Click to view details →</span>
      </CardFooter>
    </Card>
  ),
};

/**
 * Card with custom styling
 */
export const CustomStyling: Story = {
  render: () => (
    <Card
      variant="default"
      className="border-primary/50"
      style={{ width: '400px', background: 'linear-gradient(to bottom right, hsl(var(--card)), hsl(var(--muted)))' }}
    >
      <CardHeader>
        <CardTitle className="text-primary">Custom Styled Card</CardTitle>
        <CardDescription>This card has custom colors and border</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          You can customize the card appearance using className and style props while maintaining
          all the base functionality.
        </p>
      </CardContent>
    </Card>
  ),
};

/**
 * Accessible card with proper semantic HTML and ARIA
 */
export const AccessibleCard: Story = {
  render: () => (
    <Card role="article" aria-labelledby="card-title" style={{ width: '400px' }}>
      <CardHeader>
        <CardTitle id="card-title">Accessible Card Example</CardTitle>
        <CardDescription>This card follows accessibility best practices</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          Using proper semantic HTML (h3 for title, p for description) and ARIA attributes ensures
          the card is accessible to screen readers and keyboard navigation.
        </p>
      </CardContent>
      <CardFooter>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
          Accessible Action
        </button>
      </CardFooter>
    </Card>
  ),
};
