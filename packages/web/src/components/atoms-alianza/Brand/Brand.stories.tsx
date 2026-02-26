import type { Meta, StoryObj } from '@storybook/react';
import { Brand } from './Brand';

const meta = {
  title: 'Atomic Design/Atoms/Brand',
  component: Brand,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Brand component displays the application logo and name with various layout options. Supports multiple sizes, variants, custom logos, and taglines.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['horizontal', 'vertical', 'icon-only', 'text-only', 'stacked', 'compact'],
      description: 'Visual variant of the brand',
      table: {
        defaultValue: { summary: 'horizontal' },
      },
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size of the brand',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    brandName: {
      control: 'text',
      description: 'Custom brand name',
      table: {
        defaultValue: { summary: 'Alkitu' },
      },
    },
    showTagline: {
      control: 'boolean',
      description: 'Whether to show the tagline',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    tagline: {
      control: 'text',
      description: 'Custom tagline text',
    },
    clickable: {
      control: 'boolean',
      description: 'Whether the brand is clickable',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
  },
} satisfies Meta<typeof Brand>;

export default meta;
type Story = Omit<StoryObj<typeof meta>, 'args'> & Partial<Pick<StoryObj<typeof meta>, 'args'>>;

// Default story
export const Default: Story = {
  args: {},
};

// Variants
export const Horizontal: Story = {
  args: {
    variant: 'horizontal',
  },
};

export const Vertical: Story = {
  args: {
    variant: 'vertical',
    showTagline: true,
  },
};

export const Stacked: Story = {
  args: {
    variant: 'stacked',
    showTagline: true,
  },
};

export const IconOnly: Story = {
  args: {
    variant: 'icon-only',
  },
};

export const TextOnly: Story = {
  args: {
    variant: 'text-only',
  },
};

export const Compact: Story = {
  args: {
    variant: 'compact',
    size: 'sm',
  },
};

// Sizes
export const ExtraSmall: Story = {
  args: {
    size: 'xs',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    showTagline: true,
  },
};

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
    showTagline: true,
  },
};

// With Tagline
export const WithTagline: Story = {
  args: {
    showTagline: true,
  },
};

export const CustomTagline: Story = {
  args: {
    showTagline: true,
    tagline: 'Next Generation Platform',
  },
};

// Clickable
export const Clickable: Story = {
  args: {
    clickable: true,
    onClick: () => console.log('Brand clicked!'),
  },
};

export const ClickableWithTagline: Story = {
  args: {
    clickable: true,
    showTagline: true,
    onClick: () => console.log('Brand clicked!'),
  },
};

// Custom Brand Name
export const CustomBrandName: Story = {
  args: {
    brandName: 'My Company',
    showTagline: true,
    tagline: 'Innovation First',
  },
};

// Custom Logo
export const CustomLogo: Story = {
  args: {
    logoUrl: 'https://github.com/shadcn.png',
    brandName: 'Custom Logo',
  },
};

// All Variants Showcase
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold mb-2">Horizontal</h3>
        <Brand variant="horizontal" />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2">Vertical</h3>
        <Brand variant="vertical" showTagline />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2">Stacked</h3>
        <Brand variant="stacked" showTagline />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2">Compact</h3>
        <Brand variant="compact" size="sm" />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2">Icon Only</h3>
        <Brand variant="icon-only" />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2">Text Only</h3>
        <Brand variant="text-only" />
      </div>
    </div>
  ),
};

// All Sizes Showcase
export const AllSizes: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <span className="w-20 text-sm">XS:</span>
        <Brand size="xs" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-20 text-sm">SM:</span>
        <Brand size="sm" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-20 text-sm">MD:</span>
        <Brand size="md" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-20 text-sm">LG:</span>
        <Brand size="lg" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-20 text-sm">XL:</span>
        <Brand size="xl" />
      </div>
    </div>
  ),
};

// Header Usage Example
export const HeaderUsage: Story = {
  render: () => (
    <header className="bg-background border-b p-4">
      <Brand clickable onClick={() => console.log('Navigating to home...')} />
    </header>
  ),
};

// Sidebar Usage Example
export const SidebarUsage: Story = {
  render: () => (
    <aside className="bg-background border-r p-6 w-64">
      <Brand
        variant="vertical"
        size="lg"
        showTagline
        clickable
        onClick={() => console.log('Navigating to home...')}
      />
    </aside>
  ),
};

// Footer Usage Example
export const FooterUsage: Story = {
  render: () => (
    <footer className="bg-muted p-8">
      <Brand
        variant="stacked"
        size="md"
        showTagline
        tagline="Building the future of design"
      />
    </footer>
  ),
};

// Dark Mode Test
export const DarkModeTest: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  render: () => (
    <div className="dark space-y-6 p-8">
      <Brand size="lg" />
      <Brand size="lg" showTagline />
      <Brand variant="vertical" size="lg" showTagline />
      <Brand variant="stacked" size="lg" showTagline />
    </div>
  ),
};

// Interactive Playground
export const Interactive: Story = {
  args: {
    variant: 'horizontal',
    size: 'md',
    brandName: 'Alkitu',
    showTagline: false,
    tagline: 'Design System',
    clickable: false,
  },
};
