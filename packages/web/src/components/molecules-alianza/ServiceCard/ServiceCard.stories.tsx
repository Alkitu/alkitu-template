import type { Meta, StoryObj } from '@storybook/react';
import { ServiceCard } from './ServiceCard';
import type { Service } from './ServiceCard.types';

const mockService: Service = {
  id: 'svc-1',
  name: 'Professional Cleaning Service',
  description:
    'High-quality professional cleaning service for residential and commercial properties with eco-friendly products and experienced staff.',
  categoryId: 'cat-1',
  category: {
    id: 'cat-1',
    name: 'Limpieza',
  },
  thumbnail: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=400&fit=crop',
  price: 49.99,
  status: 'active',
  rating: 4.5,
  reviewCount: 127,
  requestTemplate: {
    fields: [
      { name: 'address', type: 'text' },
      { name: 'date', type: 'date' },
      { name: 'notes', type: 'textarea' },
    ],
  },
  createdAt: '2024-01-15T10:30:00.000Z',
  updatedAt: '2024-01-20T14:45:00.000Z',
};

const meta = {
  title: 'Molecules/ServiceCard',
  component: ServiceCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
ServiceCard displays service information in a card format with optional actions.

## Features
- Service image with fallback to category icon
- Service name, description, category, and price
- Status indicator (active, inactive, pending)
- Rating display with stars and review count
- Action buttons (Edit, Delete, View Details)
- Clickable card for navigation
- Multiple display variants (default, compact, detailed)
- Loading skeleton state
- Responsive layout

## Usage
\`\`\`tsx
<ServiceCard
  service={service}
  showEdit
  showDelete
  onEdit={(svc) => handleEdit(svc)}
  onDelete={(svc) => handleDelete(svc)}
  onClick={(svc) => navigate(\`/services/\${svc.id}\`)}
/>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    service: {
      control: 'object',
      description: 'Service data to display',
    },
    variant: {
      control: 'select',
      options: ['default', 'compact', 'detailed'],
      description: 'Visual variant of the card',
    },
    showEdit: {
      control: 'boolean',
      description: 'Show edit button',
    },
    showDelete: {
      control: 'boolean',
      description: 'Show delete button',
    },
    showViewDetails: {
      control: 'boolean',
      description: 'Show view details button',
    },
    showImage: {
      control: 'boolean',
      description: 'Show service image/thumbnail',
    },
    showDescription: {
      control: 'boolean',
      description: 'Show service description',
    },
    showPrice: {
      control: 'boolean',
      description: 'Show service price',
    },
    showCategory: {
      control: 'boolean',
      description: 'Show service category',
    },
    showStatus: {
      control: 'boolean',
      description: 'Show service status',
    },
    showRating: {
      control: 'boolean',
      description: 'Show service rating',
    },
    isDeleting: {
      control: 'boolean',
      description: 'Loading state for delete operation',
    },
    isLoading: {
      control: 'boolean',
      description: 'Loading skeleton state',
    },
    currencySymbol: {
      control: 'text',
      description: 'Currency symbol for price display',
    },
  },
} satisfies Meta<typeof ServiceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default Story
export const Default: Story = {
  args: {
    service: mockService,
    variant: 'default',
  },
};

// With Actions
export const WithActions: Story = {
  args: {
    service: mockService,
    showEdit: true,
    showDelete: true,
    showViewDetails: true,
    onEdit: (service) => console.log('Edit:', service),
    onDelete: (service) => console.log('Delete:', service),
    onViewDetails: (service) => console.log('View:', service),
  },
};

// Compact Variant
export const Compact: Story = {
  args: {
    service: mockService,
    variant: 'compact',
    showEdit: true,
    showDelete: true,
    onEdit: (service) => console.log('Edit:', service),
    onDelete: (service) => console.log('Delete:', service),
  },
};

// Detailed Variant
export const Detailed: Story = {
  args: {
    service: mockService,
    variant: 'detailed',
    showFieldCount: true,
    showCreatedAt: true,
  },
};

// Without Image
export const WithoutImage: Story = {
  args: {
    service: {
      ...mockService,
      thumbnail: null,
    },
  },
};

// Without Price
export const WithoutPrice: Story = {
  args: {
    service: {
      ...mockService,
      price: null,
    },
  },
};

// Inactive Status
export const InactiveStatus: Story = {
  args: {
    service: {
      ...mockService,
      status: 'inactive',
    },
  },
};

// Pending Status
export const PendingStatus: Story = {
  args: {
    service: {
      ...mockService,
      status: 'pending',
    },
  },
};

// Without Rating
export const WithoutRating: Story = {
  args: {
    service: {
      ...mockService,
      rating: undefined,
      reviewCount: undefined,
    },
  },
};

// Deleting State
export const DeletingState: Story = {
  args: {
    service: mockService,
    showEdit: true,
    showDelete: true,
    isDeleting: true,
    onEdit: (service) => console.log('Edit:', service),
    onDelete: (service) => console.log('Delete:', service),
  },
};

// Loading State
export const LoadingState: Story = {
  args: {
    service: mockService,
    isLoading: true,
  },
};

// Clickable Card
export const ClickableCard: Story = {
  args: {
    service: mockService,
    onClick: (service) => console.log('Card clicked:', service),
  },
};

// Long Description
export const LongDescription: Story = {
  args: {
    service: {
      ...mockService,
      description:
        'This is a very long description that should be truncated after a certain number of characters. It contains lots of details about the service, including information about the quality, pricing, availability, and much more. This text is intentionally verbose to demonstrate the truncation functionality.',
    },
    descriptionLimit: 100,
  },
};

// Custom Currency
export const CustomCurrency: Story = {
  args: {
    service: mockService,
    currencySymbol: '€',
  },
};

// Minimal Display
export const MinimalDisplay: Story = {
  args: {
    service: mockService,
    showDescription: false,
    showPrice: false,
    showStatus: false,
    showRating: false,
  },
};

// Complete Display
export const CompleteDisplay: Story = {
  args: {
    service: mockService,
    variant: 'detailed',
    showEdit: true,
    showDelete: true,
    showViewDetails: true,
    showFieldCount: true,
    showCreatedAt: true,
    onEdit: (service) => console.log('Edit:', service),
    onDelete: (service) => console.log('Delete:', service),
    onViewDetails: (service) => console.log('View:', service),
  },
};

// Grid Layout
export const GridLayout: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4" style={{ width: '1200px' }}>
      <ServiceCard
        service={{ ...mockService, id: '1', name: 'Cleaning Service' }}
        showEdit
        onEdit={(service) => console.log('Edit:', service)}
      />
      <ServiceCard
        service={{
          ...mockService,
          id: '2',
          name: 'Plumbing Service',
          category: { id: 'cat-2', name: 'Reparación' },
          thumbnail: null,
        }}
        showDelete
        onDelete={(service) => console.log('Delete:', service)}
      />
      <ServiceCard
        service={{
          ...mockService,
          id: '3',
          name: 'Electrical Service',
          status: 'pending',
        }}
        showViewDetails
        onViewDetails={(service) => console.log('View:', service)}
      />
    </div>
  ),
};

// Compact Grid
export const CompactGrid: Story = {
  render: () => (
    <div className="space-y-2" style={{ width: '600px' }}>
      <ServiceCard
        service={{ ...mockService, id: '1', name: 'Cleaning Service' }}
        variant="compact"
        showEdit
        onEdit={(service) => console.log('Edit:', service)}
      />
      <ServiceCard
        service={{
          ...mockService,
          id: '2',
          name: 'Plumbing Service',
          category: { id: 'cat-2', name: 'Reparación' },
        }}
        variant="compact"
        showDelete
        onDelete={(service) => console.log('Delete:', service)}
      />
      <ServiceCard
        service={{
          ...mockService,
          id: '3',
          name: 'Electrical Service',
          status: 'inactive',
        }}
        variant="compact"
      />
    </div>
  ),
};

// Different Services
export const DifferentServices: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4" style={{ width: '800px' }}>
      <ServiceCard
        service={{
          id: '1',
          name: 'House Cleaning',
          description: 'Complete house cleaning service',
          categoryId: 'cat-1',
          category: { id: 'cat-1', name: 'Limpieza' },
          thumbnail: null,
          price: 39.99,
          status: 'active',
          rating: 4.8,
          reviewCount: 234,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        }}
      />
      <ServiceCard
        service={{
          id: '2',
          name: 'Emergency Plumbing',
          description: '24/7 emergency plumbing repairs',
          categoryId: 'cat-2',
          category: { id: 'cat-2', name: 'Reparación' },
          thumbnail: null,
          price: 89.99,
          status: 'active',
          rating: 4.9,
          reviewCount: 567,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        }}
      />
      <ServiceCard
        service={{
          id: '3',
          name: 'Furniture Assembly',
          description: 'Professional furniture assembly service',
          categoryId: 'cat-3',
          category: { id: 'cat-3', name: 'Mantenimiento' },
          thumbnail: null,
          price: 29.99,
          status: 'pending',
          rating: 4.2,
          reviewCount: 89,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        }}
      />
      <ServiceCard
        service={{
          id: '4',
          name: 'Package Delivery',
          description: 'Fast and reliable package delivery',
          categoryId: 'cat-4',
          category: { id: 'cat-4', name: 'Entrega' },
          thumbnail: null,
          price: 15.0,
          status: 'inactive',
          rating: 3.9,
          reviewCount: 45,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        }}
      />
    </div>
  ),
};
