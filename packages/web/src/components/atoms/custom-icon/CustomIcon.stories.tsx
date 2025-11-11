import type { Meta, StoryObj } from '@storybook/react';
import { CustomIcon, createCustomIconComponent } from './CustomIcon';

// Sample SVG icons for demonstration
const heartSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
</svg>`;

const starSVG = `<svg viewBox="0 0 24 24" fill="currentColor">
  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
</svg>`;

const checkSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <polyline points="20 6 9 17 4 12"></polyline>
</svg>`;

const alertSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <circle cx="12" cy="12" r="10"></circle>
  <line x1="12" y1="8" x2="12" y2="12"></line>
  <line x1="12" y1="16" x2="12.01" y2="16"></line>
</svg>`;

const uploadSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
  <polyline points="17 8 12 3 7 8"></polyline>
  <line x1="12" y1="3" x2="12" y2="15"></line>
</svg>`;

const meta = {
  title: 'Atomic Design/Atoms/CustomIcon',
  component: CustomIcon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
CustomIcon component renders custom uploaded SVG icons with dynamic sizing and theming.

## Features
- 6 size presets (xs to 2xl) + custom size support
- 8 color variants using theme CSS variables
- SVG processing and sanitization
- Accessibility support
- Interactive mode with click handlers
- Fallback for invalid SVG

## Usage

\`\`\`tsx
import { CustomIcon, createCustomIconComponent } from '@/components/atoms/custom-icon';

// Basic usage
<CustomIcon svg="<svg>...</svg>" size="md" variant="primary" />

// With custom size and color
<CustomIcon svg="<svg>...</svg>" customSize={48} customColor="#FF5733" />

// Interactive icon
<CustomIcon
  svg="<svg>...</svg>"
  onClick={() => console.log('clicked')}
  aria-label="Delete item"
/>

// Create reusable component
const MyIcon = createCustomIconComponent('<svg>...</svg>');
<MyIcon size="lg" variant="primary" />
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    svg: {
      control: 'text',
      description: 'SVG string content to render',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Icon size preset',
    },
    customSize: {
      control: 'number',
      description: 'Custom size in pixels (overrides size preset)',
    },
    variant: {
      control: 'select',
      options: [
        'default',
        'primary',
        'secondary',
        'accent',
        'muted',
        'destructive',
        'warning',
        'success',
      ],
      description: 'Color variant using theme CSS variables',
    },
    customColor: {
      control: 'color',
      description: 'Custom color (overrides variant)',
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
} satisfies Meta<typeof CustomIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    svg: heartSVG,
    size: 'md',
    variant: 'default',
  },
};

// Size variants
export const SizeVariants: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <div className="flex flex-col items-center gap-2">
        <CustomIcon svg={heartSVG} size="xs" />
        <span className="text-xs text-muted-foreground">xs (12px)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CustomIcon svg={heartSVG} size="sm" />
        <span className="text-xs text-muted-foreground">sm (16px)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CustomIcon svg={heartSVG} size="md" />
        <span className="text-xs text-muted-foreground">md (20px)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CustomIcon svg={heartSVG} size="lg" />
        <span className="text-xs text-muted-foreground">lg (24px)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CustomIcon svg={heartSVG} size="xl" />
        <span className="text-xs text-muted-foreground">xl (28px)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CustomIcon svg={heartSVG} size="2xl" />
        <span className="text-xs text-muted-foreground">2xl (32px)</span>
      </div>
    </div>
  ),
};

// Color variants
export const ColorVariants: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-6">
      <div className="flex flex-col items-center gap-2">
        <CustomIcon svg={starSVG} size="lg" variant="default" />
        <span className="text-xs text-muted-foreground">default</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CustomIcon svg={starSVG} size="lg" variant="primary" />
        <span className="text-xs text-muted-foreground">primary</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CustomIcon svg={starSVG} size="lg" variant="secondary" />
        <span className="text-xs text-muted-foreground">secondary</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CustomIcon svg={starSVG} size="lg" variant="accent" />
        <span className="text-xs text-muted-foreground">accent</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CustomIcon svg={starSVG} size="lg" variant="muted" />
        <span className="text-xs text-muted-foreground">muted</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CustomIcon svg={starSVG} size="lg" variant="destructive" />
        <span className="text-xs text-muted-foreground">destructive</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CustomIcon svg={starSVG} size="lg" variant="warning" />
        <span className="text-xs text-muted-foreground">warning</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CustomIcon svg={starSVG} size="lg" variant="success" />
        <span className="text-xs text-muted-foreground">success</span>
      </div>
    </div>
  ),
};

// Different SVG shapes
export const DifferentShapes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <CustomIcon svg={heartSVG} size="lg" variant="destructive" />
        <span className="text-xs text-muted-foreground">Heart</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CustomIcon svg={starSVG} size="lg" variant="warning" />
        <span className="text-xs text-muted-foreground">Star</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CustomIcon svg={checkSVG} size="lg" variant="success" />
        <span className="text-xs text-muted-foreground">Check</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CustomIcon svg={alertSVG} size="lg" variant="primary" />
        <span className="text-xs text-muted-foreground">Alert</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CustomIcon svg={uploadSVG} size="lg" variant="accent" />
        <span className="text-xs text-muted-foreground">Upload</span>
      </div>
    </div>
  ),
};

// Custom size
export const CustomSize: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <div className="flex flex-col items-center gap-2">
        <CustomIcon svg={heartSVG} customSize={24} />
        <span className="text-xs text-muted-foreground">24px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CustomIcon svg={heartSVG} customSize={48} />
        <span className="text-xs text-muted-foreground">48px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CustomIcon svg={heartSVG} customSize={64} />
        <span className="text-xs text-muted-foreground">64px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CustomIcon svg={heartSVG} customSize={96} />
        <span className="text-xs text-muted-foreground">96px</span>
      </div>
    </div>
  ),
};

// Custom color
export const CustomColor: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <CustomIcon svg={heartSVG} size="lg" customColor="#FF5733" />
        <span className="text-xs text-muted-foreground">#FF5733</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CustomIcon svg={heartSVG} size="lg" customColor="#33FF57" />
        <span className="text-xs text-muted-foreground">#33FF57</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CustomIcon svg={heartSVG} size="lg" customColor="#3357FF" />
        <span className="text-xs text-muted-foreground">#3357FF</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CustomIcon svg={heartSVG} size="lg" customColor="#FF33F5" />
        <span className="text-xs text-muted-foreground">#FF33F5</span>
      </div>
    </div>
  ),
};

// Interactive with onClick
export const Interactive: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-muted-foreground">Click the icon below</p>
      <CustomIcon
        svg={heartSVG}
        size="2xl"
        variant="destructive"
        onClick={() => alert('Icon clicked!')}
        aria-label="Like button"
        className="transition-transform hover:scale-110 active:scale-95"
      />
    </div>
  ),
};

// Invalid SVG fallback
export const InvalidSVGFallback: Story = {
  args: {
    svg: '<div>Not an SVG</div>',
    size: 'lg',
    variant: 'muted',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows "?" fallback when invalid SVG is provided.',
      },
    },
  },
};

// With custom className
export const WithCustomClassName: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <CustomIcon
        svg={heartSVG}
        size="lg"
        variant="primary"
        className="rotate-45"
      />
      <CustomIcon
        svg={starSVG}
        size="lg"
        variant="warning"
        className="animate-spin"
      />
      <CustomIcon
        svg={checkSVG}
        size="lg"
        variant="success"
        className="shadow-lg rounded-full p-2 bg-success/10"
      />
    </div>
  ),
};

// createCustomIconComponent example
export const ReusableComponent: Story = {
  render: () => {
    const HeartIcon = createCustomIconComponent(heartSVG);
    const StarIcon = createCustomIconComponent(starSVG);
    const CheckIcon = createCustomIconComponent(checkSVG);

    return (
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <HeartIcon size="lg" variant="destructive" />
          <span className="text-xs text-muted-foreground">HeartIcon</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <StarIcon size="lg" variant="warning" />
          <span className="text-xs text-muted-foreground">StarIcon</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <CheckIcon size="lg" variant="success" />
          <span className="text-xs text-muted-foreground">CheckIcon</span>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Example of using createCustomIconComponent to create reusable icon components.',
      },
    },
  },
};

// Accessibility example
export const AccessibilityExample: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <CustomIcon
          svg={checkSVG}
          size="md"
          variant="success"
          aria-label="Success indicator"
        />
        <span className="text-sm">Task completed successfully</span>
      </div>
      <div className="flex items-center gap-2">
        <CustomIcon
          svg={alertSVG}
          size="md"
          variant="destructive"
          aria-label="Error indicator"
        />
        <span className="text-sm">An error occurred</span>
      </div>
      <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md">
        <CustomIcon
          svg={uploadSVG}
          size="sm"
          variant="default"
          aria-label="Upload icon"
        />
        <span>Upload File</span>
      </button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Examples demonstrating proper accessibility attributes.',
      },
    },
  },
};

// Light and Dark mode
export const ThemeIntegration: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3">Light Mode</h3>
        <div className="flex gap-4 p-4 bg-background rounded-lg border">
          <CustomIcon svg={heartSVG} size="lg" variant="primary" />
          <CustomIcon svg={starSVG} size="lg" variant="secondary" />
          <CustomIcon svg={checkSVG} size="lg" variant="success" />
          <CustomIcon svg={alertSVG} size="lg" variant="destructive" />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-3">Dark Mode</h3>
        <div className="flex gap-4 p-4 bg-background rounded-lg border dark">
          <CustomIcon svg={heartSVG} size="lg" variant="primary" />
          <CustomIcon svg={starSVG} size="lg" variant="secondary" />
          <CustomIcon svg={checkSVG} size="lg" variant="success" />
          <CustomIcon svg={alertSVG} size="lg" variant="destructive" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates how the component adapts to light and dark themes using CSS variables.',
      },
    },
  },
};
