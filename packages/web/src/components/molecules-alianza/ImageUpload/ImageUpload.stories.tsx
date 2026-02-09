import type { Meta, StoryObj } from '@storybook/react';
import { ImageUpload } from './ImageUpload';
import { useState } from 'react';
import type { ImageUploadProps } from './ImageUpload.types';

const meta = {
  title: 'Molecules/ImageUpload',
  component: ImageUpload,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'ImageUpload component for uploading and displaying images with drag-and-drop support, file validation, and preview functionality.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: 'text',
      description: 'Current image URL to display',
    },
    alt: {
      control: 'text',
      description: 'Alt text for the image',
    },
    onUpload: {
      action: 'uploaded',
      description: 'Callback when file is selected or uploaded',
    },
    onRemove: {
      action: 'removed',
      description: 'Callback when image is removed/deleted',
    },
    onError: {
      action: 'error',
      description: 'Callback when upload/file operation fails',
    },
    accept: {
      control: 'text',
      description: 'Accepted file types (MIME types)',
    },
    maxSize: {
      control: 'number',
      description: 'Maximum file size in bytes',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the component is disabled',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the upload is in progress',
    },
    uploadText: {
      control: 'text',
      description: 'Text to display on upload button',
    },
    helperText: {
      control: 'text',
      description: 'Helper text below upload button',
    },
    allowDragDrop: {
      control: 'boolean',
      description: 'Enable drag and drop functionality',
    },
    showDeleteButton: {
      control: 'boolean',
      description: 'Show delete button on uploaded image',
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required',
    },
  },
} satisfies Meta<typeof ImageUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    onUpload: (file: File) => console.log('Uploaded:', file.name),
    onRemove: () => console.log('Removed'),
    onError: (error: Error) => console.log('Error:', error.message),
  },
};

// With uploaded image
export const WithImage: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
    alt: 'Profile photo',
    onRemove: () => console.log('Removed'),
  },
};

// Custom text
export const CustomText: Story = {
  args: {
    uploadText: 'Upload Photo',
    helperText: 'Max 5MB',
    onUpload: (file: File) => console.log('Uploaded:', file.name),
  },
};

// Loading state
export const Loading: Story = {
  args: {
    loading: true,
  },
};

// Loading with image
export const LoadingWithImage: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
    loading: true,
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

// Disabled with image
export const DisabledWithImage: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
    disabled: true,
  },
};

// Without delete button
export const WithoutDeleteButton: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
    showDeleteButton: false,
  },
};

// Without drag and drop
export const WithoutDragDrop: Story = {
  args: {
    allowDragDrop: false,
    onUpload: (file: File) => console.log('Uploaded:', file.name),
  },
};

// Specific file types
export const JPEGOnly: Story = {
  args: {
    accept: 'image/jpeg',
    uploadText: 'Upload JPEG',
    helperText: 'JPEG images only',
    onUpload: (file: File) => console.log('Uploaded:', file.name),
    onError: (error: Error) => console.log('Error:', error.message),
  },
};

// Small file size limit
export const SmallFileLimit: Story = {
  args: {
    maxSize: 102400, // 100KB
    uploadText: 'Upload Small Image',
    helperText: 'Max 100KB',
    onUpload: (file: File) => console.log('Uploaded:', file.name),
    onError: (error: Error) => console.log('Error:', error.message),
  },
};

// Required field
export const Required: Story = {
  args: {
    required: true,
    onUpload: (file: File) => console.log('Uploaded:', file.name),
  },
};

// Interactive example with state
export const Interactive: Story = {
  render: (args) => {
    const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpload = (file: File) => {
      setLoading(true);
      setError(null);

      // Simulate upload
      setTimeout(() => {
        const url = URL.createObjectURL(file);
        setImageSrc(url);
        setLoading(false);
        console.log('Uploaded:', file.name);
      }, 2000);
    };

    const handleRemove = () => {
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
      setImageSrc(undefined);
      console.log('Removed');
    };

    const handleError = (err: Error) => {
      setError(err.message);
      setLoading(false);
      console.log('Error:', err.message);
    };

    return (
      <div>
        <ImageUpload
          {...args}
          src={imageSrc}
          loading={loading}
          onUpload={handleUpload}
          onRemove={handleRemove}
          onError={handleError}
        />
        {error && (
          <p className="text-destructive text-sm mt-2" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
  args: {
    uploadText: 'Upload Photo',
    helperText: 'Click or drag and drop',
    maxSize: 5242880, // 5MB
  },
};

// Multiple instances
export const MultipleInstances: Story = {
  render: () => (
    <div className="flex gap-4">
      <ImageUpload uploadText="Before" helperText="Upload before photo" />
      <ImageUpload uploadText="After" helperText="Upload after photo" />
    </div>
  ),
};

// In a form context
export const InForm: Story = {
  render: () => {
    const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Form submitted with image:', imageSrc);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Profile Photo *</label>
          <ImageUpload
            src={imageSrc}
            required
            onUpload={(file) => {
              const url = URL.createObjectURL(file);
              setImageSrc(url);
            }}
            onRemove={() => setImageSrc(undefined)}
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Submit
        </button>
      </form>
    );
  },
};

// Error handling example
export const ErrorHandling: Story = {
  render: () => {
    const [error, setError] = useState<string | null>(null);

    return (
      <div className="space-y-2">
        <ImageUpload
          maxSize={51200} // 50KB - intentionally small to demonstrate errors
          accept="image/jpeg,image/png"
          uploadText="Upload Image"
          helperText="Max 50KB, JPEG/PNG only"
          onUpload={(file) => {
            console.log('Uploaded:', file.name);
            setError(null);
          }}
          onError={(err) => {
            setError(err.message);
          }}
        />
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive rounded-md">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}
      </div>
    );
  },
};

// With various images
export const Portrait: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
    alt: 'Portrait photo',
  },
};

export const Landscape: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    alt: 'Landscape photo',
  },
};

export const Square: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
    alt: 'Square photo',
  },
};
