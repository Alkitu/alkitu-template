import type { Meta, StoryObj } from '@storybook/react';
import { ThemePreview } from './ThemePreview';
import type { ThemeData, ColorToken } from '@/components/features/theme-editor-3.0/core/types/theme.types';

// Helper to create a color token
const createColorToken = (hex: string, oklch: string): ColorToken => ({
  name: 'Color',
  hex,
  oklch: { l: 0.5, c: 0.1, h: 180 },
  oklchString: oklch,
  rgb: { r: 100, g: 150, b: 200 },
  hsv: { h: 210, s: 50, v: 78 },
  value: oklch,
});

// Mock Alkitu theme
const alkituTheme: Partial<ThemeData> = {
  id: 'alkitu-default',
  name: 'Alkitu Default',
  description: 'The default Alkitu brand theme with vibrant colors',
  version: '1.0.0',
  isDefault: true,
  lightColors: {
    primary: createColorToken('#3b82f6', 'oklch(0.62 0.19 259.81)'),
    secondary: createColorToken('#8b5cf6', 'oklch(0.55 0.25 290.41)'),
    accent: createColorToken('#06b6d4', 'oklch(0.70 0.15 195.56)'),
    muted: createColorToken('#f1f5f9', 'oklch(0.96 0.01 240.00)'),
    destructive: createColorToken('#ef4444', 'oklch(0.63 0.25 25.00)'),
    background: createColorToken('#ffffff', 'oklch(1.00 0.00 0.00)'),
    foreground: createColorToken('#0f172a', 'oklch(0.15 0.02 240.00)'),
    border: createColorToken('#e2e8f0', 'oklch(0.92 0.01 240.00)'),
  } as any,
  darkColors: {
    primary: createColorToken('#60a5fa', 'oklch(0.70 0.20 259.81)'),
    secondary: createColorToken('#a78bfa', 'oklch(0.65 0.22 290.41)'),
    accent: createColorToken('#22d3ee', 'oklch(0.80 0.15 195.56)'),
    muted: createColorToken('#1e293b', 'oklch(0.20 0.02 240.00)'),
    destructive: createColorToken('#f87171', 'oklch(0.70 0.22 25.00)'),
    background: createColorToken('#0f172a', 'oklch(0.15 0.02 240.00)'),
    foreground: createColorToken('#f8fafc', 'oklch(0.98 0.00 0.00)'),
    border: createColorToken('#334155', 'oklch(0.32 0.02 240.00)'),
  } as any,
};

// Ocean theme
const oceanTheme: Partial<ThemeData> = {
  id: 'ocean-breeze',
  name: 'Ocean Breeze',
  description: 'Cool ocean-inspired colors for a calm interface',
  version: '1.0.0',
  isDefault: false,
  lightColors: {
    primary: createColorToken('#0ea5e9', 'oklch(0.67 0.16 223.30)'),
    secondary: createColorToken('#06b6d4', 'oklch(0.70 0.15 195.56)'),
    accent: createColorToken('#14b8a6', 'oklch(0.71 0.13 180.81)'),
    muted: createColorToken('#e0f2fe', 'oklch(0.94 0.02 210.00)'),
    destructive: createColorToken('#f43f5e', 'oklch(0.64 0.26 15.00)'),
    background: createColorToken('#f8fafc', 'oklch(0.98 0.00 0.00)'),
    foreground: createColorToken('#0c4a6e', 'oklch(0.30 0.05 230.00)'),
    border: createColorToken('#bae6fd', 'oklch(0.90 0.04 210.00)'),
  } as any,
  darkColors: {
    primary: createColorToken('#38bdf8', 'oklch(0.75 0.15 223.30)'),
    secondary: createColorToken('#22d3ee', 'oklch(0.80 0.15 195.56)'),
    accent: createColorToken('#2dd4bf', 'oklch(0.80 0.13 180.81)'),
    muted: createColorToken('#082f49', 'oklch(0.18 0.03 230.00)'),
    destructive: createColorToken('#fb7185', 'oklch(0.72 0.22 15.00)'),
    background: createColorToken('#0c4a6e', 'oklch(0.30 0.05 230.00)'),
    foreground: createColorToken('#e0f2fe', 'oklch(0.94 0.02 210.00)'),
    border: createColorToken('#075985', 'oklch(0.35 0.04 230.00)'),
  } as any,
};

// Sunset theme
const sunsetTheme: Partial<ThemeData> = {
  id: 'sunset-glow',
  name: 'Sunset Glow',
  description: 'Warm sunset colors for an energetic feel',
  version: '1.0.0',
  isDefault: false,
  lightColors: {
    primary: createColorToken('#f97316', 'oklch(0.70 0.18 45.00)'),
    secondary: createColorToken('#f59e0b', 'oklch(0.75 0.16 70.00)'),
    accent: createColorToken('#ef4444', 'oklch(0.63 0.25 25.00)'),
    muted: createColorToken('#fef3c7', 'oklch(0.95 0.03 85.00)'),
    destructive: createColorToken('#dc2626', 'oklch(0.58 0.26 25.00)'),
    background: createColorToken('#fffbeb', 'oklch(0.99 0.01 85.00)'),
    foreground: createColorToken('#7c2d12', 'oklch(0.25 0.08 40.00)'),
    border: createColorToken('#fed7aa', 'oklch(0.88 0.05 60.00)'),
  } as any,
  darkColors: {
    primary: createColorToken('#fb923c', 'oklch(0.75 0.15 45.00)'),
    secondary: createColorToken('#fbbf24', 'oklch(0.80 0.14 70.00)'),
    accent: createColorToken('#f87171', 'oklch(0.70 0.22 25.00)'),
    muted: createColorToken('#431407', 'oklch(0.15 0.05 40.00)'),
    destructive: createColorToken('#ef4444', 'oklch(0.63 0.25 25.00)'),
    background: createColorToken('#7c2d12', 'oklch(0.25 0.08 40.00)'),
    foreground: createColorToken('#fef3c7', 'oklch(0.95 0.03 85.00)'),
    border: createColorToken('#9a3412', 'oklch(0.30 0.07 40.00)'),
  } as any,
};

// Forest theme
const forestTheme: Partial<ThemeData> = {
  id: 'forest-green',
  name: 'Forest Green',
  description: 'Natural green tones for an organic feel',
  version: '1.0.0',
  isDefault: false,
  lightColors: {
    primary: createColorToken('#10b981', 'oklch(0.70 0.16 155.00)'),
    secondary: createColorToken('#14b8a6', 'oklch(0.71 0.13 180.81)'),
    accent: createColorToken('#84cc16', 'oklch(0.77 0.18 120.00)'),
    muted: createColorToken('#ecfccb', 'oklch(0.97 0.05 120.00)'),
    destructive: createColorToken('#f43f5e', 'oklch(0.64 0.26 15.00)'),
    background: createColorToken('#f7fee7', 'oklch(0.99 0.02 110.00)'),
    foreground: createColorToken('#064e3b', 'oklch(0.28 0.06 165.00)'),
    border: createColorToken('#bbf7d0', 'oklch(0.92 0.08 145.00)'),
  } as any,
  darkColors: {
    primary: createColorToken('#34d399', 'oklch(0.78 0.15 155.00)'),
    secondary: createColorToken('#2dd4bf', 'oklch(0.80 0.13 180.81)'),
    accent: createColorToken('#a3e635', 'oklch(0.85 0.16 120.00)'),
    muted: createColorToken('#052e16', 'oklch(0.15 0.04 165.00)'),
    destructive: createColorToken('#fb7185', 'oklch(0.72 0.22 15.00)'),
    background: createColorToken('#064e3b', 'oklch(0.28 0.06 165.00)'),
    foreground: createColorToken('#ecfccb', 'oklch(0.97 0.05 120.00)'),
    border: createColorToken('#047857', 'oklch(0.40 0.07 165.00)'),
  } as any,
};

const meta: Meta<typeof ThemePreview> = {
  title: 'Molecules/ThemePreview',
  component: ThemePreview,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'ThemePreview displays a visual representation of a theme with color swatches, interactive elements, and copy-to-clipboard functionality. Perfect for theme selection interfaces and theme management.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    theme: {
      control: 'object',
      description: 'Theme data to preview',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the preview',
    },
    mode: {
      control: 'select',
      options: ['compact', 'expanded'],
      description: 'Display mode',
    },
    showName: {
      control: 'boolean',
      description: 'Show theme name',
    },
    showDescription: {
      control: 'boolean',
      description: 'Show theme description',
    },
    showInteractivePreview: {
      control: 'boolean',
      description: 'Show interactive elements preview',
    },
    isActive: {
      control: 'boolean',
      description: 'Mark as active theme',
    },
    enableCopy: {
      control: 'boolean',
      description: 'Enable copy to clipboard',
    },
    colorFormat: {
      control: 'select',
      options: ['hex', 'rgb', 'hsl', 'oklch'],
      description: 'Color format to display',
    },
    themeMode: {
      control: 'select',
      options: ['light', 'dark'],
      description: 'Theme mode to display',
    },
    showDefaultBadge: {
      control: 'boolean',
      description: 'Show default badge',
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ThemePreview>;

/**
 * Default theme preview with compact mode
 */
export const Default: Story = {
  args: {
    theme: alkituTheme,
    size: 'md',
    mode: 'compact',
    showName: true,
    showDescription: false,
    showInteractivePreview: true,
    isActive: false,
    enableCopy: true,
    colorFormat: 'hex',
    themeMode: 'light',
    showDefaultBadge: true,
  },
};

/**
 * Active theme with highlight and badge
 */
export const ActiveTheme: Story = {
  args: {
    ...Default.args,
    isActive: true,
  },
};

/**
 * Expanded mode showing color values
 */
export const ExpandedView: Story = {
  args: {
    ...Default.args,
    mode: 'expanded',
    showDescription: true,
  },
};

/**
 * Compact view without interactive preview
 */
export const CompactView: Story = {
  args: {
    ...Default.args,
    mode: 'compact',
    showInteractivePreview: false,
  },
};

/**
 * Small size preview
 */
export const SmallSize: Story = {
  args: {
    ...Default.args,
    size: 'sm',
  },
};

/**
 * Large size preview
 */
export const LargeSize: Story = {
  args: {
    ...Default.args,
    size: 'lg',
  },
};

/**
 * Dark mode theme preview
 */
export const DarkMode: Story = {
  args: {
    ...Default.args,
    themeMode: 'dark',
  },
};

/**
 * With OKLCH color format
 */
export const OklchFormat: Story = {
  args: {
    ...Default.args,
    mode: 'expanded',
    colorFormat: 'oklch',
  },
};

/**
 * Clickable theme selection
 */
export const ClickableSelection: Story = {
  args: {
    ...Default.args,
    onClick: () => alert('Theme selected!'),
  },
};

/**
 * Ocean theme variant
 */
export const OceanTheme: Story = {
  args: {
    ...Default.args,
    theme: oceanTheme,
  },
};

/**
 * Sunset theme variant
 */
export const SunsetTheme: Story = {
  args: {
    ...Default.args,
    theme: sunsetTheme,
  },
};

/**
 * Forest theme variant
 */
export const ForestTheme: Story = {
  args: {
    ...Default.args,
    theme: forestTheme,
  },
};

/**
 * Multiple themes in a grid layout
 */
export const MultipleThemesGrid: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 p-4">
      <ThemePreview theme={alkituTheme} isActive />
      <ThemePreview theme={oceanTheme} />
      <ThemePreview theme={sunsetTheme} />
      <ThemePreview theme={forestTheme} />
    </div>
  ),
};

/**
 * Theme comparison: Light vs Dark
 */
export const LightVsDark: Story = {
  render: () => (
    <div className="flex gap-4 p-4">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Light Mode</h3>
        <ThemePreview theme={alkituTheme} themeMode="light" />
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Dark Mode</h3>
        <ThemePreview theme={alkituTheme} themeMode="dark" />
      </div>
    </div>
  ),
};

/**
 * Theme editor preview
 */
export const ThemeEditorPreview: Story = {
  render: () => (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Select a Theme</h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ThemePreview
          theme={alkituTheme}
          isActive
          onClick={() => console.log('Selected Alkitu')}
        />
        <ThemePreview theme={oceanTheme} onClick={() => console.log('Selected Ocean')} />
        <ThemePreview theme={sunsetTheme} onClick={() => console.log('Selected Sunset')} />
        <ThemePreview theme={forestTheme} onClick={() => console.log('Selected Forest')} />
      </div>
    </div>
  ),
};

/**
 * All Alkitu themes showcase
 */
export const AllAlkituThemes: Story = {
  render: () => (
    <div className="space-y-6 p-6 max-w-6xl">
      <div>
        <h2 className="text-2xl font-bold mb-2">Alkitu Theme Collection</h2>
        <p className="text-muted-foreground mb-4">
          Explore our carefully crafted theme collection
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <ThemePreview
            theme={alkituTheme}
            isActive
            onClick={() => console.log('Selected Alkitu')}
            showDescription
          />
        </div>

        <div>
          <ThemePreview
            theme={oceanTheme}
            onClick={() => console.log('Selected Ocean')}
            showDescription
          />
        </div>

        <div>
          <ThemePreview
            theme={sunsetTheme}
            onClick={() => console.log('Selected Sunset')}
            showDescription
          />
        </div>

        <div>
          <ThemePreview
            theme={forestTheme}
            onClick={() => console.log('Selected Forest')}
            showDescription
          />
        </div>
      </div>
    </div>
  ),
};

/**
 * Copy color functionality demo
 */
export const CopyColorDemo: Story = {
  args: {
    ...Default.args,
    mode: 'expanded',
  },
  parameters: {
    docs: {
      description: {
        story: 'Click on any color swatch to copy its value to clipboard.',
      },
    },
  },
};

/**
 * Without copy functionality
 */
export const NoCopyFunctionality: Story = {
  args: {
    ...Default.args,
    enableCopy: false,
  },
};

/**
 * Minimal preview (no name, no interactive elements)
 */
export const MinimalPreview: Story = {
  args: {
    ...Default.args,
    showName: false,
    showInteractivePreview: false,
    showDefaultBadge: false,
  },
};
