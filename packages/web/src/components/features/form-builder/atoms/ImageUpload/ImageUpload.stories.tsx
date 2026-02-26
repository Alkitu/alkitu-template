/**
 * ImageUpload Component Stories
 *
 * Interactive stories demonstrating all features:
 * - URL input and preview
 * - File upload with drag & drop
 * - Different preview sizes
 * - Upload progress states
 * - Error handling
 * - File validation
 * - Accessibility features
 */

import type { Meta, StoryObj } from '@storybook/react';

import { ImageUpload } from './ImageUpload';
import type { ImageUploadProps } from './ImageUpload.types';

const meta = {
  title: 'Features/Form Builder/Atoms/ImageUpload',
  component: ImageUpload,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Complex image upload component with URL input, file upload, drag & drop, validation, and preview.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Current image URL or ImageData',
    },
    onChange: {
      action: 'changed',
      description: 'Callback when image changes',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for URL input',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the image preview',
    },
    maxSizeMB: {
      control: 'number',
      description: 'Maximum file size in MB',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the component is disabled',
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required',
    },
  },
  args: {
    onChange: () => {},
    onUploadStart: () => {},
    onUploadSuccess: () => {},
    onUploadError: () => {},
    onUploadProgress: () => {},
  },
} satisfies Meta<typeof ImageUpload>;

export default meta;
type Story = Omit<StoryObj<typeof meta>, 'args'> & Partial<Pick<StoryObj<typeof meta>, 'args'>>;

/**
 * Default state with no image
 */
export const Default: Story = {
  args: {
    value: '',
    placeholder: 'Enter image URL',
    size: 'medium',
  },
};

/**
 * With existing image URL
 */
export const WithImage: Story = {
  args: {
    value: 'https://images.unsplash.com/photo-1579547621113-e4bb2a19bdd6?w=800',
    placeholder: 'Enter image URL',
    size: 'medium',
  },
};

/**
 * Small preview size
 */
export const SmallSize: Story = {
  args: {
    value: 'https://images.unsplash.com/photo-1579547621113-e4bb2a19bdd6?w=800',
    size: 'small',
  },
};

/**
 * Large preview size
 */
export const LargeSize: Story = {
  args: {
    value: 'https://images.unsplash.com/photo-1579547621113-e4bb2a19bdd6?w=800',
    size: 'large',
  },
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    value: 'https://images.unsplash.com/photo-1579547621113-e4bb2a19bdd6?w=800',
    disabled: true,
    size: 'medium',
  },
};

/**
 * Required field
 */
export const Required: Story = {
  args: {
    value: '',
    required: true,
    placeholder: 'Image URL (required)',
    size: 'medium',
  },
};

/**
 * Custom max file size (2MB)
 */
export const CustomMaxSize: Story = {
  args: {
    value: '',
    maxSizeMB: 2,
    size: 'medium',
  },
  parameters: {
    docs: {
      description: {
        story: 'Upload limited to 2MB files instead of default 5MB',
      },
    },
  },
};

/**
 * Custom accepted file types (PNG and JPEG only)
 */
export const LimitedFileTypes: Story = {
  args: {
    value: '',
    acceptedTypes: ['image/png', 'image/jpeg'],
    size: 'medium',
  },
  parameters: {
    docs: {
      description: {
        story: 'Only accepts PNG and JPEG files',
      },
    },
  },
};

/**
 * Simulated upload progress
 */
export const UploadProgress: Story = {
  args: {
    value: '',
    size: 'medium',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows upload progress indicator when uploading files. Try uploading a file to see the progress bar.',
      },
    },
  },
};

/**
 * Image with error (broken URL)
 */
export const BrokenImage: Story = {
  args: {
    value: 'https://example.com/broken-image.jpg',
    size: 'medium',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Displays error state when image fails to load with option to clear',
      },
    },
  },
};

/**
 * Custom placeholder text
 */
export const CustomPlaceholder: Story = {
  args: {
    value: '',
    placeholder: 'Paste your product image URL here',
    size: 'medium',
  },
};

/**
 * Interactive playground
 */
export const Playground: Story = {
  args: {
    value: '',
    placeholder: 'Enter image URL',
    size: 'medium',
    maxSizeMB: 5,
    disabled: false,
    required: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive playground to test all features. Try uploading files, entering URLs, and testing different configurations.',
      },
    },
  },
};

/**
 * Multiple instances for comparison
 */
export const MultipleInstances: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-medium mb-2">Small</h3>
        <ImageUpload
          value="https://images.unsplash.com/photo-1579547621113-e4bb2a19bdd6?w=800"
          onChange={() => {}}
          size="small"
        />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Medium</h3>
        <ImageUpload
          value="https://images.unsplash.com/photo-1579547621113-e4bb2a19bdd6?w=800"
          onChange={() => {}}
          size="medium"
        />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Large</h3>
        <ImageUpload
          value="https://images.unsplash.com/photo-1579547621113-e4bb2a19bdd6?w=800"
          onChange={() => {}}
          size="large"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison of different preview sizes',
      },
    },
  },
};

/**
 * Form integration example
 */
export const InForm: Story = {
  render: () => (
    <form
      className="space-y-4 w-96"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        console.log('Form submitted:', Object.fromEntries(formData));
      }}
    >
      <div>
        <label className="block text-sm font-medium mb-2">
          Product Image <span className="text-red-500">*</span>
        </label>
        <ImageUpload
          value=""
          onChange={() => {}}
          placeholder="Enter product image URL"
          required
          size="medium"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Upload a high-quality product image (max 5MB)
        </p>
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      >
        Submit
      </button>
    </form>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of ImageUpload integrated in a form with labels and help text',
      },
    },
  },
};

/**
 * Dark mode
 */
export const DarkMode: Story = {
  args: {
    value: 'https://images.unsplash.com/photo-1579547621113-e4bb2a19bdd6?w=800',
    size: 'medium',
  },
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'Component styled for dark mode with proper contrast',
      },
    },
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
 * Accessibility features demonstration
 */
export const AccessibilityFeatures: Story = {
  args: {
    value: '',
    size: 'medium',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates accessibility features:\n\n' +
          '- Full keyboard navigation (Tab through controls)\n' +
          '- ARIA labels for screen readers\n' +
          '- Live regions for status updates\n' +
          '- Proper focus management\n' +
          '- Semantic HTML structure',
      },
    },
  },
};
