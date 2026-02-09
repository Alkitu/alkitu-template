import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { PlaceholderPalette } from './PlaceholderPalette';
import type { ColorData } from './PlaceholderPalette.types';

/**
 * PlaceholderPalette Component Stories
 *
 * A color palette component for selecting and displaying colors.
 * Supports predefined palettes and custom color arrays with features like
 * color names, values display, copy to clipboard, and keyboard navigation.
 */
const meta = {
  title: 'Molecules/PlaceholderPalette',
  component: PlaceholderPalette,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A color palette component for selecting and displaying colors with support for predefined palettes (Material, Tailwind, Grayscale, Rainbow) and custom color arrays.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    palette: {
      control: 'select',
      options: ['material', 'tailwind', 'grayscale', 'rainbow', 'custom'],
      description: 'Predefined palette to use',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of color swatches',
    },
    shape: {
      control: 'select',
      options: ['square', 'circle'],
      description: 'Shape of color swatches',
    },
    valueFormat: {
      control: 'select',
      options: ['hex', 'rgb', 'hsl'],
      description: 'Format for displaying color values',
    },
    columns: {
      control: { type: 'number', min: 1, max: 12 },
      description: 'Number of columns in grid',
    },
    showColorNames: {
      control: 'boolean',
      description: 'Show color names below swatches',
    },
    showColorValues: {
      control: 'boolean',
      description: 'Show color values below swatches',
    },
    enableCopy: {
      control: 'boolean',
      description: 'Enable copy to clipboard on click',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable palette interaction',
    },
  },
} satisfies Meta<typeof PlaceholderPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default Material Design palette with 16 colors
 */
export const Default: Story = {
  args: {
    palette: 'material',
  },
};

/**
 * Material Design color palette
 */
export const MaterialColors: Story = {
  args: {
    palette: 'material',
    size: 'md',
    columns: 8,
  },
  parameters: {
    docs: {
      description: {
        story: 'Material Design color palette with 16 vibrant colors.',
      },
    },
  },
};

/**
 * Tailwind CSS color palette
 */
export const TailwindColors: Story = {
  args: {
    palette: 'tailwind',
    size: 'md',
    columns: 8,
  },
  parameters: {
    docs: {
      description: {
        story: 'Tailwind CSS color palette with modern, accessible colors.',
      },
    },
  },
};

/**
 * Grayscale color palette
 */
export const GrayscaleColors: Story = {
  args: {
    palette: 'grayscale',
    size: 'md',
    columns: 6,
  },
  parameters: {
    docs: {
      description: {
        story: 'Grayscale palette from black to white with 12 shades.',
      },
    },
  },
};

/**
 * Rainbow color spectrum
 */
export const RainbowColors: Story = {
  args: {
    palette: 'rainbow',
    size: 'md',
    columns: 6,
  },
  parameters: {
    docs: {
      description: {
        story: 'Full rainbow spectrum with 12 vibrant colors.',
      },
    },
  },
};

/**
 * Custom color palette
 */
export const CustomPalette: Story = {
  args: {
    colors: [
      { value: '#E63946', name: 'Imperial Red' },
      { value: '#F1FAEE', name: 'Honeydew' },
      { value: '#A8DADC', name: 'Powder Blue' },
      { value: '#457B9D', name: 'Celadon Blue' },
      { value: '#1D3557', name: 'Prussian Blue' },
      { value: '#F77F00', name: 'Orange' },
      { value: '#EAE2B7', name: 'Vanilla' },
      { value: '#D62828', name: 'Fire Engine Red' },
    ],
    size: 'md',
    columns: 4,
  },
  parameters: {
    docs: {
      description: {
        story: 'Custom color palette with named colors.',
      },
    },
  },
};

/**
 * Palette with selected color
 */
export const WithSelectedColor: Story = {
  render: (args) => {
    const [selected, setSelected] = useState<string>('#F44336');

    return (
      <div className="space-y-4">
        <PlaceholderPalette
          {...args}
          selectedColor={selected}
          onSelect={(color) => setSelected(color.value)}
        />
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Selected: <span className="font-mono font-semibold">{selected}</span>
          </p>
        </div>
      </div>
    );
  },
  args: {
    palette: 'material',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive palette with color selection tracking.',
      },
    },
  },
};

/**
 * Small size swatches
 */
export const SmallSize: Story = {
  args: {
    palette: 'material',
    size: 'sm',
    columns: 8,
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact color swatches (20x20px) for space-constrained layouts.',
      },
    },
  },
};

/**
 * Large size swatches
 */
export const LargeSize: Story = {
  args: {
    palette: 'material',
    size: 'lg',
    columns: 6,
  },
  parameters: {
    docs: {
      description: {
        story: 'Large color swatches (48x48px) for better visibility and touch targets.',
      },
    },
  },
};

/**
 * Palette with color names
 */
export const WithColorNames: Story = {
  args: {
    palette: 'material',
    showColorNames: true,
    size: 'md',
    columns: 4,
  },
  parameters: {
    docs: {
      description: {
        story: 'Color palette displaying color names below each swatch.',
      },
    },
  },
};

/**
 * Palette with hex values
 */
export const WithHexValues: Story = {
  args: {
    palette: 'tailwind',
    showColorValues: true,
    valueFormat: 'hex',
    size: 'md',
    columns: 4,
  },
  parameters: {
    docs: {
      description: {
        story: 'Color palette displaying hex values in badge format.',
      },
    },
  },
};

/**
 * Palette with RGB values
 */
export const WithRGBValues: Story = {
  args: {
    colors: [
      { value: '#FF0000', name: 'Red' },
      { value: '#00FF00', name: 'Green' },
      { value: '#0000FF', name: 'Blue' },
      { value: '#FFFF00', name: 'Yellow' },
      { value: '#FF00FF', name: 'Magenta' },
      { value: '#00FFFF', name: 'Cyan' },
    ],
    showColorValues: true,
    valueFormat: 'rgb',
    size: 'lg',
    columns: 3,
  },
  parameters: {
    docs: {
      description: {
        story: 'Color palette displaying RGB color values.',
      },
    },
  },
};

/**
 * Palette with HSL values
 */
export const WithHSLValues: Story = {
  args: {
    colors: [
      { value: '#FF0000', name: 'Red' },
      { value: '#00FF00', name: 'Green' },
      { value: '#0000FF', name: 'Blue' },
      { value: '#FFFF00', name: 'Yellow' },
      { value: '#FF00FF', name: 'Magenta' },
      { value: '#00FFFF', name: 'Cyan' },
    ],
    showColorValues: true,
    valueFormat: 'hsl',
    size: 'lg',
    columns: 3,
  },
  parameters: {
    docs: {
      description: {
        story: 'Color palette displaying HSL color values.',
      },
    },
  },
};

/**
 * Disabled palette
 */
export const DisabledState: Story = {
  args: {
    palette: 'material',
    disabled: true,
    size: 'md',
    columns: 8,
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled color palette - no interaction allowed.',
      },
    },
  },
};

/**
 * Single row layout
 */
export const SingleRowLayout: Story = {
  args: {
    colors: [
      { value: '#E63946', name: 'Red' },
      { value: '#F77F00', name: 'Orange' },
      { value: '#EAE2B7', name: 'Yellow' },
      { value: '#457B9D', name: 'Blue' },
      { value: '#1D3557', name: 'Navy' },
    ],
    size: 'lg',
    columns: 5,
    showColorNames: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Horizontal single-row color palette layout.',
      },
    },
  },
};

/**
 * Full palette grid
 */
export const FullPaletteGrid: Story = {
  args: {
    palette: 'material',
    size: 'md',
    columns: 8,
    showColorNames: true,
    showColorValues: true,
    valueFormat: 'hex',
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete color palette with names and hex values.',
      },
    },
  },
};

/**
 * Circle swatches
 */
export const CircleSwatches: Story = {
  args: {
    palette: 'rainbow',
    shape: 'circle',
    size: 'lg',
    columns: 6,
  },
  parameters: {
    docs: {
      description: {
        story: 'Color palette with circular swatches instead of squares.',
      },
    },
  },
};

/**
 * Copy to clipboard enabled
 */
export const CopyToClipboard: Story = {
  render: (args) => {
    const [copied, setCopied] = useState<string | null>(null);

    return (
      <div className="space-y-4">
        <PlaceholderPalette
          {...args}
          enableCopy
          onSelect={(color) => {
            setCopied(color.value);
            setTimeout(() => setCopied(null), 2000);
          }}
        />
        {copied && (
          <div className="text-center">
            <p className="text-sm text-green-600 font-semibold">
              Copied {copied} to clipboard!
            </p>
          </div>
        )}
      </div>
    );
  },
  args: {
    palette: 'tailwind',
    size: 'md',
    columns: 8,
  },
  parameters: {
    docs: {
      description: {
        story: 'Click any color to copy its value to clipboard.',
      },
    },
  },
};

/**
 * Compact picker
 */
export const CompactPicker: Story = {
  render: (args) => {
    const [selected, setSelected] = useState<string>('#4CAF50');

    return (
      <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-xs">
        <h3 className="text-sm font-semibold mb-3 text-gray-900 dark:text-white">
          Select Color
        </h3>
        <PlaceholderPalette
          {...args}
          selectedColor={selected}
          onSelect={(color) => setSelected(color.value)}
        />
        <div className="mt-3 p-2 bg-gray-100 dark:bg-gray-800 rounded">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded border-2 border-gray-300"
              style={{ backgroundColor: selected }}
            />
            <span className="text-xs font-mono text-gray-700 dark:text-gray-300">
              {selected}
            </span>
          </div>
        </div>
      </div>
    );
  },
  args: {
    colors: [
      { value: '#F44336', name: 'Red' },
      { value: '#E91E63', name: 'Pink' },
      { value: '#9C27B0', name: 'Purple' },
      { value: '#673AB7', name: 'Deep Purple' },
      { value: '#3F51B5', name: 'Indigo' },
      { value: '#2196F3', name: 'Blue' },
      { value: '#00BCD4', name: 'Cyan' },
      { value: '#009688', name: 'Teal' },
      { value: '#4CAF50', name: 'Green' },
      { value: '#8BC34A', name: 'Light Green' },
      { value: '#FFC107', name: 'Amber' },
      { value: '#FF9800', name: 'Orange' },
    ],
    size: 'sm',
    columns: 6,
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact color picker component with selected color preview.',
      },
    },
  },
};

/**
 * Theme builder palette
 */
export const ThemeBuilderPalette: Story = {
  render: (args) => {
    const [primary, setPrimary] = useState<string>('#3F51B5');
    const [secondary, setSecondary] = useState<string>('#E91E63');
    const [accent, setAccent] = useState<string>('#FFC107');

    return (
      <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-2xl">
        <h2 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">
          Theme Color Builder
        </h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Primary Color
            </h3>
            <PlaceholderPalette
              {...args}
              selectedColor={primary}
              onSelect={(color) => setPrimary(color.value)}
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Secondary Color
            </h3>
            <PlaceholderPalette
              {...args}
              selectedColor={secondary}
              onSelect={(color) => setSecondary(color.value)}
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Accent Color
            </h3>
            <PlaceholderPalette
              {...args}
              selectedColor={accent}
              onSelect={(color) => setAccent(color.value)}
            />
          </div>

          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded">
            <h4 className="text-sm font-semibold mb-3 text-gray-900 dark:text-white">
              Theme Preview
            </h4>
            <div className="flex gap-4">
              <div className="flex-1 text-center">
                <div
                  className="h-16 rounded"
                  style={{ backgroundColor: primary }}
                />
                <p className="text-xs mt-1 font-mono text-gray-600 dark:text-gray-400">
                  Primary
                </p>
              </div>
              <div className="flex-1 text-center">
                <div
                  className="h-16 rounded"
                  style={{ backgroundColor: secondary }}
                />
                <p className="text-xs mt-1 font-mono text-gray-600 dark:text-gray-400">
                  Secondary
                </p>
              </div>
              <div className="flex-1 text-center">
                <div
                  className="h-16 rounded"
                  style={{ backgroundColor: accent }}
                />
                <p className="text-xs mt-1 font-mono text-gray-600 dark:text-gray-400">
                  Accent
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
  args: {
    palette: 'material',
    size: 'sm',
    columns: 8,
  },
  parameters: {
    docs: {
      description: {
        story: 'Multi-palette theme builder with live preview.',
      },
    },
  },
};
