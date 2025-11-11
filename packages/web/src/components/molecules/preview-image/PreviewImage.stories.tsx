import type { Meta, StoryObj } from '@storybook/react';
import { PreviewImage } from './PreviewImage';

const meta = {
  title: 'Atomic Design/Molecules/PreviewImage',
  component: PreviewImage,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Enhanced image preview component with loading states, error handling, and interactive features. Supports multiple aspect ratios, sizes, and object-fit modes with theme integration via CSS variables.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: 'text',
      description: 'Image source URL',
      table: {
        type: { summary: 'string' },
      },
    },
    alt: {
      control: 'text',
      description: 'Alternative text for accessibility',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '""' },
      },
    },
    aspectRatio: {
      control: 'select',
      options: ['square', '1:1', '4:3', '16:9', '3:2', '2:1', 'auto'],
      description: 'Aspect ratio preset',
      table: {
        type: { summary: 'PreviewImageAspectRatio' },
        defaultValue: { summary: 'auto' },
      },
    },
    customRatio: {
      control: 'text',
      description: 'Custom aspect ratio (overrides preset)',
      table: {
        type: { summary: 'string' },
      },
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Size variant',
      table: {
        type: { summary: 'PreviewImageSize' },
        defaultValue: { summary: 'md' },
      },
    },
    radius: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'full'],
      description: 'Border radius variant',
      table: {
        type: { summary: 'PreviewImageRadius' },
        defaultValue: { summary: 'md' },
      },
    },
    loading: {
      control: 'boolean',
      description: 'Show loading state',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    objectFit: {
      control: 'select',
      options: ['cover', 'contain', 'fill', 'scale-down', 'none'],
      description: 'Object fit behavior',
      table: {
        type: { summary: 'PreviewImageObjectFit' },
        defaultValue: { summary: 'cover' },
      },
    },
    showOverlay: {
      control: 'boolean',
      description: 'Show image overlay on hover',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    interactive: {
      control: 'boolean',
      description: 'Enable interactive states',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
} satisfies Meta<typeof PreviewImage>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample image URLs
const sampleImages = {
  landscape: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  portrait: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=800&fit=crop',
  square: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600&h=600&fit=crop',
};

/**
 * Default PreviewImage with no image source
 */
export const Default: Story = {
  args: {},
};

/**
 * PreviewImage with image source
 */
export const WithImage: Story = {
  args: {
    src: sampleImages.landscape,
    alt: 'Beautiful landscape',
  },
};

/**
 * Loading state
 */
export const Loading: Story = {
  args: {
    loading: true,
  },
};

/**
 * Error state (invalid URL)
 */
export const Error: Story = {
  args: {
    src: 'https://invalid-url-that-will-fail.jpg',
    alt: 'This will fail to load',
  },
};

/**
 * Square aspect ratio (1:1)
 */
export const Square: Story = {
  args: {
    src: sampleImages.square,
    alt: 'Square image',
    aspectRatio: 'square',
  },
};

/**
 * 4:3 aspect ratio
 */
export const AspectRatio4x3: Story = {
  args: {
    src: sampleImages.landscape,
    alt: '4:3 aspect ratio',
    aspectRatio: '4:3',
    size: 'lg',
  },
};

/**
 * 16:9 aspect ratio
 */
export const AspectRatio16x9: Story = {
  args: {
    src: sampleImages.landscape,
    alt: '16:9 aspect ratio',
    aspectRatio: '16:9',
    size: 'lg',
  },
};

/**
 * Custom aspect ratio (21:9)
 */
export const CustomAspectRatio: Story = {
  args: {
    src: sampleImages.landscape,
    alt: 'Custom 21:9 aspect ratio',
    customRatio: '21/9',
  },
};

/**
 * Extra small size
 */
export const SizeXS: Story = {
  args: {
    src: sampleImages.square,
    alt: 'Extra small size',
    size: 'xs',
    aspectRatio: 'auto',
  },
};

/**
 * Small size
 */
export const SizeSM: Story = {
  args: {
    src: sampleImages.square,
    alt: 'Small size',
    size: 'sm',
    aspectRatio: 'auto',
  },
};

/**
 * Medium size (default)
 */
export const SizeMD: Story = {
  args: {
    src: sampleImages.square,
    alt: 'Medium size',
    size: 'md',
    aspectRatio: 'auto',
  },
};

/**
 * Large size
 */
export const SizeLG: Story = {
  args: {
    src: sampleImages.square,
    alt: 'Large size',
    size: 'lg',
    aspectRatio: 'auto',
  },
};

/**
 * Extra large size
 */
export const SizeXL: Story = {
  args: {
    src: sampleImages.square,
    alt: 'Extra large size',
    size: 'xl',
    aspectRatio: 'auto',
  },
};

/**
 * 2XL size
 */
export const Size2XL: Story = {
  args: {
    src: sampleImages.square,
    alt: '2XL size',
    size: '2xl',
    aspectRatio: 'auto',
  },
};

/**
 * No border radius
 */
export const RadiusNone: Story = {
  args: {
    src: sampleImages.landscape,
    alt: 'No border radius',
    radius: 'none',
    aspectRatio: '16:9',
  },
};

/**
 * Small border radius
 */
export const RadiusSM: Story = {
  args: {
    src: sampleImages.landscape,
    alt: 'Small border radius',
    radius: 'sm',
    aspectRatio: '16:9',
  },
};

/**
 * Medium border radius (default)
 */
export const RadiusMD: Story = {
  args: {
    src: sampleImages.landscape,
    alt: 'Medium border radius',
    radius: 'md',
    aspectRatio: '16:9',
  },
};

/**
 * Large border radius
 */
export const RadiusLG: Story = {
  args: {
    src: sampleImages.landscape,
    alt: 'Large border radius',
    radius: 'lg',
    aspectRatio: '16:9',
  },
};

/**
 * Full border radius (circle)
 */
export const RadiusFull: Story = {
  args: {
    src: sampleImages.square,
    alt: 'Circle image',
    radius: 'full',
    aspectRatio: 'square',
    size: 'lg',
  },
};

/**
 * Object-fit: cover (default)
 */
export const ObjectFitCover: Story = {
  args: {
    src: sampleImages.portrait,
    alt: 'Cover fit',
    objectFit: 'cover',
    aspectRatio: '16:9',
    size: 'lg',
  },
};

/**
 * Object-fit: contain
 */
export const ObjectFitContain: Story = {
  args: {
    src: sampleImages.portrait,
    alt: 'Contain fit',
    objectFit: 'contain',
    aspectRatio: '16:9',
    size: 'lg',
  },
};

/**
 * Object-fit: fill
 */
export const ObjectFitFill: Story = {
  args: {
    src: sampleImages.portrait,
    alt: 'Fill fit',
    objectFit: 'fill',
    aspectRatio: '16:9',
    size: 'lg',
  },
};

/**
 * Interactive mode with hover effects
 */
export const Interactive: Story = {
  args: {
    src: sampleImages.landscape,
    alt: 'Interactive image',
    interactive: true,
    aspectRatio: '16:9',
    size: 'lg',
  },
};

/**
 * With overlay on hover
 */
export const WithOverlay: Story = {
  args: {
    src: sampleImages.landscape,
    alt: 'Image with overlay',
    interactive: true,
    showOverlay: true,
    overlayContent: 'Click to view',
    aspectRatio: '16:9',
    size: 'lg',
  },
};

/**
 * Clickable image
 */
export const Clickable: Story = {
  args: {
    src: sampleImages.landscape,
    alt: 'Clickable image',
    onClick: () => alert('Image clicked!'),
    aspectRatio: '16:9',
    size: 'lg',
  },
};

/**
 * Custom placeholder
 */
export const CustomPlaceholder: Story = {
  args: {
    placeholder: (
      <div style={{ color: 'var(--color-primary)' }}>
        <p>Custom placeholder content</p>
      </div>
    ),
  },
};

/**
 * All sizes comparison
 */
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <div style={{ textAlign: 'center' }}>
        <PreviewImage src={sampleImages.square} alt="XS" size="xs" aspectRatio="auto" />
        <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>XS</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <PreviewImage src={sampleImages.square} alt="SM" size="sm" aspectRatio="auto" />
        <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>SM</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <PreviewImage src={sampleImages.square} alt="MD" size="md" aspectRatio="auto" />
        <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>MD</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <PreviewImage src={sampleImages.square} alt="LG" size="lg" aspectRatio="auto" />
        <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>LG</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <PreviewImage src={sampleImages.square} alt="XL" size="xl" aspectRatio="auto" />
        <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>XL</p>
      </div>
    </div>
  ),
};

/**
 * All aspect ratios comparison
 */
export const AllAspectRatios: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', maxWidth: '800px' }}>
      <div style={{ textAlign: 'center' }}>
        <PreviewImage src={sampleImages.landscape} alt="1:1" aspectRatio="1:1" />
        <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>1:1</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <PreviewImage src={sampleImages.landscape} alt="4:3" aspectRatio="4:3" />
        <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>4:3</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <PreviewImage src={sampleImages.landscape} alt="16:9" aspectRatio="16:9" />
        <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>16:9</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <PreviewImage src={sampleImages.landscape} alt="3:2" aspectRatio="3:2" />
        <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>3:2</p>
      </div>
    </div>
  ),
};

/**
 * All states comparison
 */
export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
      <div style={{ textAlign: 'center' }}>
        <PreviewImage aspectRatio="square" size="md" />
        <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>No Image</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <PreviewImage loading aspectRatio="square" size="md" />
        <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>Loading</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <PreviewImage src="https://invalid.jpg" aspectRatio="square" size="md" />
        <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>Error</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <PreviewImage src={sampleImages.square} aspectRatio="square" size="md" />
        <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>Success</p>
      </div>
    </div>
  ),
};
