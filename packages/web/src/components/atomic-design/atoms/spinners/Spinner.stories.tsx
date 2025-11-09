import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './Spinner';

/**
 * Spinner - PHASE 2 CONSOLIDATION
 *
 * A versatile loading indicator consolidated from multiple implementations:
 * - ui/spinner.tsx (CVA-based, forwardRef)
 * - theme-editor/Spinner.tsx (3 types, 8 variants, animation speeds)
 * - atomic-design/Spinner.tsx (theme integration)
 * - shared/LoadingSpinner.tsx (simple implementation)
 * - shared/ui/loading-indicator.tsx (with label)
 *
 * Features:
 * - 6 size presets (xs, sm, md, lg, xl, 2xl) + custom size
 * - 8 color variants + custom color
 * - 3 animation speeds (slow, normal, fast)
 * - 3 spinner types (circular, dots, pulse)
 * - Optional label for user feedback
 * - Full theme CSS variable integration
 * - Forward ref support
 * - Accessibility compliant
 *
 * Usage example:
 * ```tsx
 * <Spinner size="lg" variant="primary" />
 * <Spinner type="dots" speed="fast" label="Loading..." />
 * <Spinner customSize={32} customColor="oklch(0.7 0.2 200)" />
 * ```
 */
const meta = {
  title: 'Atomic Design/Atoms/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A comprehensive loading indicator component that consolidates features from multiple implementations.
Supports multiple styles, sizes, colors, and animation speeds with full theme integration.

**PHASE 2 CONSOLIDATION**: This component merges all spinner implementations across the codebase into one unified, feature-rich component.

### Key Features:
- **6 Sizes**: xs (12px), sm (16px), md (20px), lg (24px), xl (32px), 2xl (40px)
- **8 Variants**: default, primary, secondary, accent, muted, destructive, warning, success
- **3 Types**: circular (SVG-based), dots (three animated dots), pulse (pulsating circle)
- **3 Speeds**: slow (2s), normal (1s), fast (0.5s)
- **Custom Options**: custom size in pixels, custom color value
- **Label Support**: optional text label for user feedback
- **Theme Integration**: uses CSS variables, responds to theme changes
- **Accessibility**: role="status", aria-label, keyboard accessible
        `,
      },
    },
    chromatic: {
      viewports: [320, 768, 1200],
      diffThreshold: 0.2,
      delay: 300, // wait for animations
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Size preset of the spinner',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'accent', 'muted', 'destructive', 'warning', 'success'],
      description: 'Color variant using theme CSS variables',
      table: {
        defaultValue: { summary: 'primary' },
      },
    },
    type: {
      control: 'select',
      options: ['circular', 'dots', 'pulse'],
      description: 'Spinner animation style',
      table: {
        defaultValue: { summary: 'circular' },
      },
    },
    speed: {
      control: 'select',
      options: ['slow', 'normal', 'fast'],
      description: 'Animation speed',
      table: {
        defaultValue: { summary: 'normal' },
      },
    },
    label: {
      control: 'text',
      description: 'Optional label text displayed next to spinner',
    },
    customSize: {
      control: 'number',
      description: 'Custom size in pixels (overrides size preset)',
    },
    customColor: {
      control: 'color',
      description: 'Custom color value (overrides variant)',
    },
    useSystemColors: {
      control: 'boolean',
      description: 'Use system theme colors (false uses currentColor)',
      table: {
        defaultValue: { summary: true },
      },
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default spinner - most common usage
 */
export const Default: Story = {
  args: {},
};

/**
 * With label - provides user feedback
 */
export const WithLabel: Story = {
  args: {
    label: 'Loading...',
  },
};

/**
 * All sizes - demonstrates 6 size options (PHASE 2 feature)
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-6 p-4">
      <div className="flex flex-col items-center gap-2">
        <Spinner size="xs" />
        <span className="text-xs text-muted-foreground">xs</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="sm" />
        <span className="text-xs text-muted-foreground">sm</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="md" />
        <span className="text-xs text-muted-foreground">md</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="lg" />
        <span className="text-xs text-muted-foreground">lg</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="xl" />
        <span className="text-xs text-muted-foreground">xl</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="2xl" />
        <span className="text-xs text-muted-foreground">2xl</span>
      </div>
    </div>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
};

/**
 * All variants - demonstrates 8 color options (PHASE 2 feature)
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6 p-4">
      <div className="flex flex-col items-center gap-2">
        <Spinner variant="default" />
        <span className="text-xs text-muted-foreground">default</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner variant="primary" />
        <span className="text-xs text-muted-foreground">primary</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner variant="secondary" />
        <span className="text-xs text-muted-foreground">secondary</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner variant="accent" />
        <span className="text-xs text-muted-foreground">accent</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner variant="muted" />
        <span className="text-xs text-muted-foreground">muted</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner variant="destructive" />
        <span className="text-xs text-muted-foreground">destructive</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner variant="warning" />
        <span className="text-xs text-muted-foreground">warning</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner variant="success" />
        <span className="text-xs text-muted-foreground">success</span>
      </div>
    </div>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
};

/**
 * All types - circular, dots, pulse (PHASE 2 feature from theme-editor)
 */
export const AllTypes: Story = {
  render: () => (
    <div className="flex gap-8 p-4">
      <div className="flex flex-col items-center gap-2">
        <Spinner type="circular" size="lg" />
        <span className="text-xs text-muted-foreground">circular</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner type="dots" size="lg" />
        <span className="text-xs text-muted-foreground">dots</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner type="pulse" size="lg" />
        <span className="text-xs text-muted-foreground">pulse</span>
      </div>
    </div>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
};

/**
 * All speeds - slow, normal, fast (PHASE 2 feature from theme-editor)
 */
export const AllSpeeds: Story = {
  render: () => (
    <div className="flex gap-8 p-4">
      <div className="flex flex-col items-center gap-2">
        <Spinner speed="slow" size="lg" />
        <span className="text-xs text-muted-foreground">slow (2s)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner speed="normal" size="lg" />
        <span className="text-xs text-muted-foreground">normal (1s)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner speed="fast" size="lg" />
        <span className="text-xs text-muted-foreground">fast (0.5s)</span>
      </div>
    </div>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
};

/**
 * Dots spinner with variants
 */
export const DotsSpinner: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6 p-4">
      {(['primary', 'secondary', 'success', 'destructive'] as const).map((variant) => (
        <div key={variant} className="flex flex-col items-center gap-2">
          <Spinner type="dots" variant={variant} size="lg" />
          <span className="text-xs text-muted-foreground">{variant}</span>
        </div>
      ))}
    </div>
  ),
};

/**
 * Pulse spinner with variants
 */
export const PulseSpinner: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6 p-4">
      {(['primary', 'secondary', 'warning', 'success'] as const).map((variant) => (
        <div key={variant} className="flex flex-col items-center gap-2">
          <Spinner type="pulse" variant={variant} size="lg" />
          <span className="text-xs text-muted-foreground">{variant}</span>
        </div>
      ))}
    </div>
  ),
};

/**
 * With labels - demonstrates label feature (from loading-indicator)
 */
export const WithLabels: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4">
      <Spinner type="circular" label="Loading content..." />
      <Spinner type="dots" label="Processing..." />
      <Spinner type="pulse" label="Saving..." />
      <Spinner size="sm" label="Small with label" />
      <Spinner size="xl" variant="success" label="Complete!" />
    </div>
  ),
};

/**
 * Custom size - demonstrates custom pixel size (PHASE 2 feature)
 */
export const CustomSize: Story = {
  args: {
    customSize: 48,
    variant: 'primary',
  },
};

/**
 * Custom color - demonstrates custom color override (PHASE 2 feature)
 */
export const CustomColor: Story = {
  args: {
    customColor: 'oklch(0.7 0.2 200)',
    size: 'xl',
  },
};

/**
 * Use in button - common use case
 */
export const InButton: Story = {
  render: () => (
    <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground">
      <Spinner size="sm" useSystemColors={false} />
      Loading...
    </button>
  ),
};

/**
 * Page loading - full page loading indicator
 */
export const PageLoading: Story = {
  render: () => (
    <div className="flex h-64 w-full items-center justify-center">
      <Spinner size="xl" variant="primary" label="Loading page..." />
    </div>
  ),
};

/**
 * Inline loading - inline with text
 */
export const InlineLoading: Story = {
  render: () => (
    <div className="inline-flex items-center gap-2">
      <span>Fetching data</span>
      <Spinner size="sm" variant="muted" />
    </div>
  ),
};

/**
 * Dark theme - for testing in dark mode
 */
export const DarkTheme: Story = {
  args: {
    size: 'lg',
    variant: 'primary',
    label: 'Dark theme spinner',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
};

/**
 * All types with all variants - comprehensive showcase
 */
export const ComprehensiveShowcase: Story = {
  render: () => (
    <div className="flex flex-col gap-8 p-8">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Circular Spinners</h3>
        <div className="flex flex-wrap gap-6">
          {(['primary', 'secondary', 'destructive', 'success'] as const).map((variant) => (
            <Spinner key={variant} type="circular" variant={variant} size="lg" />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Dots Spinners</h3>
        <div className="flex flex-wrap gap-6">
          {(['primary', 'secondary', 'destructive', 'success'] as const).map((variant) => (
            <Spinner key={variant} type="dots" variant={variant} size="lg" />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Pulse Spinners</h3>
        <div className="flex flex-wrap gap-6">
          {(['primary', 'secondary', 'destructive', 'success'] as const).map((variant) => (
            <Spinner key={variant} type="pulse" variant={variant} size="lg" />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">With Labels</h3>
        <div className="flex flex-col gap-4">
          <Spinner type="circular" variant="primary" label="Loading..." />
          <Spinner type="dots" variant="success" label="Processing..." />
          <Spinner type="pulse" variant="warning" label="Saving..." />
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Different Speeds</h3>
        <div className="flex gap-6">
          <Spinner speed="slow" size="lg" />
          <Spinner speed="normal" size="lg" />
          <Spinner speed="fast" size="lg" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
    layout: 'fullscreen',
  },
};

/**
 * Interactive playground - test all combinations
 */
export const Playground: Story = {
  args: {
    size: 'lg',
    variant: 'primary',
    type: 'circular',
    speed: 'normal',
    label: '',
    useSystemColors: true,
  },
};
