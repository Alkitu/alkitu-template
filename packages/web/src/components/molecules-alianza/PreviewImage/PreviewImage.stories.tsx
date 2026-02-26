import type { Meta, StoryObj } from '@storybook/react';
import { PreviewImage } from './PreviewImage';
import type { ImageData } from './PreviewImage.types';

const meta = {
  title: 'Alianza/Molecules/PreviewImage',
  component: PreviewImage,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Enhanced image preview component with lightbox, gallery mode, and download functionality. ' +
          'Features keyboard navigation (ESC to close, arrow keys for gallery), focus management, and full accessibility support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: 'text',
      description: 'Image source URL (single image mode)',
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
    caption: {
      control: 'text',
      description: 'Caption/title shown in lightbox',
      table: {
        type: { summary: 'string' },
      },
    },
    aspectRatio: {
      control: 'select',
      options: ['square', '1:1', '4:3', '16:9', '3:2', '2:1', 'auto'],
      description: 'Aspect ratio preset for thumbnail',
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
      description: 'Size variant for thumbnail',
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
    enableLightbox: {
      control: 'boolean',
      description: 'Enable lightbox/modal on click',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    showDownload: {
      control: 'boolean',
      description: 'Show download button in lightbox',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    disableLazyLoad: {
      control: 'boolean',
      description: 'Disable lazy loading',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
} satisfies Meta<typeof PreviewImage>;

export default meta;
type Story = Omit<StoryObj<typeof meta>, 'args'> & Partial<Pick<StoryObj<typeof meta>, 'args'>>;

// Sample image URLs (using Unsplash for demo)
const sampleImages = {
  landscape:
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  portrait:
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=800&fit=crop',
  square:
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600&h=600&fit=crop',
  nature:
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
  city: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=600&fit=crop',
  ocean:
    'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=600&fit=crop',
};

// Gallery sample data
const galleryImages: ImageData[] = [
  {
    src: sampleImages.landscape,
    alt: 'Mountain landscape',
    caption: 'Beautiful mountain vista at sunset',
  },
  {
    src: sampleImages.nature,
    alt: 'Forest trail',
    caption: 'Peaceful forest path in autumn',
  },
  {
    src: sampleImages.city,
    alt: 'City skyline',
    caption: 'Urban skyline at twilight',
  },
  {
    src: sampleImages.ocean,
    alt: 'Ocean waves',
    caption: 'Tranquil ocean waves at dusk',
  },
];

/**
 * Default preview with single image and lightbox enabled
 */
export const Default: Story = {
  args: {
    src: sampleImages.landscape,
    alt: 'Beautiful landscape',
    caption: 'Mountain landscape at sunset',
  },
};

/**
 * Preview with custom caption
 */
export const WithCaption: Story = {
  args: {
    src: sampleImages.landscape,
    alt: 'Landscape with caption',
    caption: 'This is a beautiful mountain landscape captured at golden hour',
    aspectRatio: '16:9',
    size: 'lg',
  },
};

/**
 * Loading state
 */
export const Loading: Story = {
  args: {
    loading: true,
    aspectRatio: 'square',
    size: 'lg',
  },
};

/**
 * Error state (invalid URL)
 */
export const ErrorState: Story = {
  args: {
    src: 'https://invalid-url-that-will-fail-to-load.jpg',
    alt: 'This will fail to load',
    aspectRatio: 'square',
    size: 'lg',
  },
};

/**
 * Custom aspect ratio (21:9 ultrawide)
 */
export const CustomAspectRatio: Story = {
  args: {
    src: sampleImages.landscape,
    alt: 'Ultrawide aspect ratio',
    customRatio: '21/9',
    size: 'xl',
  },
};

/**
 * Square images
 */
export const SquareImages: Story = {
  render: () => (
    <div className="flex gap-4">
      <PreviewImage
        src={sampleImages.square}
        alt="Small square"
        aspectRatio="square"
        size="sm"
      />
      <PreviewImage
        src={sampleImages.square}
        alt="Medium square"
        aspectRatio="square"
        size="md"
      />
      <PreviewImage
        src={sampleImages.square}
        alt="Large square"
        aspectRatio="square"
        size="lg"
      />
    </div>
  ),
};

/**
 * Portrait images
 */
export const PortraitImages: Story = {
  args: {
    src: sampleImages.portrait,
    alt: 'Portrait orientation',
    aspectRatio: '3:2',
    size: 'lg',
    caption: 'Portrait orientation example',
  },
};

/**
 * Landscape images
 */
export const LandscapeImages: Story = {
  args: {
    src: sampleImages.landscape,
    alt: 'Landscape orientation',
    aspectRatio: '16:9',
    size: 'xl',
    caption: 'Landscape orientation example',
  },
};

/**
 * Gallery mode with multiple images
 */
export const GalleryMode: Story = {
  args: {
    images: galleryImages,
    aspectRatio: '16:9',
    size: 'lg',
  },
};

/**
 * Gallery with initial index
 */
export const GalleryWithInitialIndex: Story = {
  args: {
    images: galleryImages,
    initialIndex: 2,
    aspectRatio: '16:9',
    size: 'lg',
  },
};

/**
 * Without lightbox (preview only)
 */
export const WithoutLightbox: Story = {
  args: {
    src: sampleImages.landscape,
    alt: 'Preview only',
    enableLightbox: false,
    aspectRatio: '16:9',
    size: 'lg',
  },
};

/**
 * Without download button
 */
export const WithoutDownload: Story = {
  args: {
    src: sampleImages.landscape,
    alt: 'No download button',
    showDownload: false,
    aspectRatio: '16:9',
    size: 'lg',
  },
};

/**
 * All sizes comparison
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex gap-4 items-end flex-wrap">
      <div className="text-center">
        <PreviewImage
          src={sampleImages.square}
          alt="XS"
          size="xs"
          aspectRatio="auto"
        />
        <p className="mt-2 text-xs">XS (64px)</p>
      </div>
      <div className="text-center">
        <PreviewImage
          src={sampleImages.square}
          alt="SM"
          size="sm"
          aspectRatio="auto"
        />
        <p className="mt-2 text-xs">SM (96px)</p>
      </div>
      <div className="text-center">
        <PreviewImage
          src={sampleImages.square}
          alt="MD"
          size="md"
          aspectRatio="auto"
        />
        <p className="mt-2 text-xs">MD (128px)</p>
      </div>
      <div className="text-center">
        <PreviewImage
          src={sampleImages.square}
          alt="LG"
          size="lg"
          aspectRatio="auto"
        />
        <p className="mt-2 text-xs">LG (192px)</p>
      </div>
      <div className="text-center">
        <PreviewImage
          src={sampleImages.square}
          alt="XL"
          size="xl"
          aspectRatio="auto"
        />
        <p className="mt-2 text-xs">XL (256px)</p>
      </div>
      <div className="text-center">
        <PreviewImage
          src={sampleImages.square}
          alt="2XL"
          size="2xl"
          aspectRatio="auto"
        />
        <p className="mt-2 text-xs">2XL (384px)</p>
      </div>
    </div>
  ),
};

/**
 * All aspect ratios comparison
 */
export const AllAspectRatios: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 max-w-3xl">
      <div className="text-center">
        <PreviewImage
          src={sampleImages.landscape}
          alt="1:1"
          aspectRatio="1:1"
        />
        <p className="mt-2 text-xs">1:1 (Square)</p>
      </div>
      <div className="text-center">
        <PreviewImage
          src={sampleImages.landscape}
          alt="4:3"
          aspectRatio="4:3"
        />
        <p className="mt-2 text-xs">4:3</p>
      </div>
      <div className="text-center">
        <PreviewImage
          src={sampleImages.landscape}
          alt="16:9"
          aspectRatio="16:9"
        />
        <p className="mt-2 text-xs">16:9</p>
      </div>
      <div className="text-center">
        <PreviewImage
          src={sampleImages.landscape}
          alt="3:2"
          aspectRatio="3:2"
        />
        <p className="mt-2 text-xs">3:2</p>
      </div>
    </div>
  ),
};

/**
 * Border radius variants
 */
export const BorderRadiusVariants: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap items-center">
      <div className="text-center">
        <PreviewImage
          src={sampleImages.square}
          alt="None"
          radius="none"
          aspectRatio="square"
          size="md"
        />
        <p className="mt-2 text-xs">None</p>
      </div>
      <div className="text-center">
        <PreviewImage
          src={sampleImages.square}
          alt="SM"
          radius="sm"
          aspectRatio="square"
          size="md"
        />
        <p className="mt-2 text-xs">Small</p>
      </div>
      <div className="text-center">
        <PreviewImage
          src={sampleImages.square}
          alt="MD"
          radius="md"
          aspectRatio="square"
          size="md"
        />
        <p className="mt-2 text-xs">Medium</p>
      </div>
      <div className="text-center">
        <PreviewImage
          src={sampleImages.square}
          alt="LG"
          radius="lg"
          aspectRatio="square"
          size="md"
        />
        <p className="mt-2 text-xs">Large</p>
      </div>
      <div className="text-center">
        <PreviewImage
          src={sampleImages.square}
          alt="Full"
          radius="full"
          aspectRatio="square"
          size="md"
        />
        <p className="mt-2 text-xs">Full (Circle)</p>
      </div>
    </div>
  ),
};

/**
 * Object fit modes
 */
export const ObjectFitModes: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 max-w-3xl">
      <div className="text-center">
        <PreviewImage
          src={sampleImages.portrait}
          alt="Cover"
          objectFit="cover"
          aspectRatio="16:9"
          size="lg"
        />
        <p className="mt-2 text-xs">Cover</p>
      </div>
      <div className="text-center">
        <PreviewImage
          src={sampleImages.portrait}
          alt="Contain"
          objectFit="contain"
          aspectRatio="16:9"
          size="lg"
        />
        <p className="mt-2 text-xs">Contain</p>
      </div>
      <div className="text-center">
        <PreviewImage
          src={sampleImages.portrait}
          alt="Fill"
          objectFit="fill"
          aspectRatio="16:9"
          size="lg"
        />
        <p className="mt-2 text-xs">Fill</p>
      </div>
    </div>
  ),
};

/**
 * Complex gallery example with captions
 */
export const ComplexGalleryExample: Story = {
  args: {
    images: [
      {
        src: sampleImages.landscape,
        alt: 'Mountain landscape',
        caption: 'Majestic mountain peaks at golden hour',
      },
      {
        src: sampleImages.nature,
        alt: 'Forest trail',
        caption: 'A serene forest path in autumn colors',
      },
      {
        src: sampleImages.city,
        alt: 'City skyline',
        caption: 'Urban architecture against twilight sky',
      },
      {
        src: sampleImages.ocean,
        alt: 'Ocean waves',
        caption: 'Calm ocean waves at sunset',
      },
      {
        src: sampleImages.portrait,
        alt: 'Close-up portrait',
        caption: 'Portrait photography example',
      },
    ],
    aspectRatio: '16:9',
    size: 'xl',
  },
};

/**
 * Custom placeholder
 */
export const CustomPlaceholder: Story = {
  args: {
    placeholder: (
      <div className="flex flex-col items-center gap-2">
        <div className="text-primary text-2xl">🖼️</div>
        <p className="text-xs text-primary">Custom Placeholder</p>
      </div>
    ),
    aspectRatio: 'square',
    size: 'lg',
  },
};

/**
 * All states comparison
 */
export const AllStates: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 max-w-2xl">
      <div className="text-center">
        <PreviewImage aspectRatio="square" size="md" />
        <p className="mt-2 text-xs">No Image</p>
      </div>
      <div className="text-center">
        <PreviewImage loading aspectRatio="square" size="md" />
        <p className="mt-2 text-xs">Loading</p>
      </div>
      <div className="text-center">
        <PreviewImage
          src="https://invalid.jpg"
          aspectRatio="square"
          size="md"
        />
        <p className="mt-2 text-xs">Error</p>
      </div>
      <div className="text-center">
        <PreviewImage
          src={sampleImages.square}
          aspectRatio="square"
          size="md"
        />
        <p className="mt-2 text-xs">Success</p>
      </div>
    </div>
  ),
};

/**
 * Interactive demo with callbacks
 */
export const WithCallbacks: Story = {
  args: {
    src: sampleImages.landscape,
    alt: 'Interactive demo',
    caption: 'This demo logs events to console',
    aspectRatio: '16:9',
    size: 'lg',
    onLoad: () => console.log('Image loaded'),
    onError: () => console.log('Image failed to load'),
    onLightboxOpen: () => console.log('Lightbox opened'),
    onLightboxClose: () => console.log('Lightbox closed'),
    onDownload: (src) => console.log('Download triggered for:', src),
  },
};
