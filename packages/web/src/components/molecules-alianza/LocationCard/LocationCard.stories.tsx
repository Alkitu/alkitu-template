import type { Meta, StoryObj } from '@storybook/react';

import { LocationCard } from './LocationCard';
import type { LocationData } from './LocationCard.types';

const meta: Meta<typeof LocationCard> = {
  title: 'Molecules/LocationCard',
  component: LocationCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A comprehensive card component for displaying location information including address, contact details, operating hours, map preview, and action buttons. Perfect for store locators, office directories, and location-based features.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    location: {
      description: 'Location data to display',
      control: 'object',
    },
    layout: {
      description: 'Display layout variant',
      control: 'select',
      options: ['default', 'compact', 'detailed'],
    },
    clickable: {
      description: 'Whether the card is clickable',
      control: 'boolean',
    },
    showMap: {
      description: 'Whether to show map preview',
      control: 'boolean',
    },
    showDistance: {
      description: 'Whether to show distance',
      control: 'boolean',
    },
    showContact: {
      description: 'Whether to show contact information',
      control: 'boolean',
    },
    showHours: {
      description: 'Whether to show operating hours',
      control: 'boolean',
    },
    showActions: {
      description: 'Whether to show action buttons',
      control: 'boolean',
    },
    showFavorite: {
      description: 'Whether to show favorite button',
      control: 'boolean',
    },
    loading: {
      description: 'Loading state',
      control: 'boolean',
    },
  },
  args: {
    onClick: () => {},
    onGetDirections: () => {},
    onCall: () => {},
    onEmail: () => {},
    onToggleFavorite: () => {},
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof LocationCard>;

const defaultLocation: LocationData = {
  id: 'loc-1',
  name: 'Downtown Office',
  address: {
    street: '123 Main Street',
    city: 'San Francisco',
    state: 'CA',
    zip: '94102',
    country: 'USA',
  },
  contact: {
    phone: '4155551234',
    email: 'downtown@example.com',
  },
  distance: 2.5,
  distanceUnit: 'mi',
  mapImageUrl: 'https://via.placeholder.com/400x200/4F46E5/FFFFFF?text=Map+Preview',
  mapUrl: 'https://maps.google.com/?q=123+Main+Street,San+Francisco,CA',
  isFavorite: false,
  hours: {
    monday: { open: '09:00', close: '17:00' },
    tuesday: { open: '09:00', close: '17:00' },
    wednesday: { open: '09:00', close: '17:00' },
    thursday: { open: '09:00', close: '17:00' },
    friday: { open: '09:00', close: '17:00' },
    saturday: { open: '10:00', close: '14:00' },
    sunday: { open: '10:00', close: '14:00', closed: true },
  },
};

/**
 * Default location card with all features enabled
 */
export const Default: Story = {
  args: {
    location: defaultLocation,
  },
};

/**
 * Location card with map image preview
 */
export const WithMapImage: Story = {
  args: {
    location: {
      ...defaultLocation,
      mapImageUrl: 'https://via.placeholder.com/400x200/10B981/FFFFFF?text=Office+Location',
    },
  },
};

/**
 * Location card showing distance from user
 */
export const WithDistance: Story = {
  args: {
    location: {
      ...defaultLocation,
      distance: 5.8,
      distanceUnit: 'mi',
    },
  },
};

/**
 * Location card with distance in kilometers
 */
export const WithDistanceKm: Story = {
  args: {
    location: {
      ...defaultLocation,
      distance: 12.3,
      distanceUnit: 'km',
    },
  },
};

/**
 * Location card with full contact information
 */
export const WithContactInfo: Story = {
  args: {
    location: {
      ...defaultLocation,
      contact: {
        phone: '4155551234',
        email: 'contact@example.com',
      },
    },
  },
};

/**
 * Location card with phone only
 */
export const PhoneOnly: Story = {
  args: {
    location: {
      ...defaultLocation,
      contact: {
        phone: '8005551234',
      },
    },
  },
};

/**
 * Location card with email only
 */
export const EmailOnly: Story = {
  args: {
    location: {
      ...defaultLocation,
      contact: {
        email: 'support@example.com',
      },
    },
  },
};

/**
 * Location card with operating hours (detailed layout)
 */
export const WithOperatingHours: Story = {
  args: {
    location: defaultLocation,
    layout: 'detailed',
  },
};

/**
 * Location card with all action buttons
 */
export const WithAllActions: Story = {
  args: {
    location: defaultLocation,
    layout: 'detailed',
  },
};

/**
 * Clickable location card (navigates to details)
 */
export const ClickableCard: Story = {
  args: {
    location: defaultLocation,
    clickable: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Card with clickable behavior. Shows hover effects and can navigate to location details.',
      },
    },
  },
};

/**
 * Favorited location card
 */
export const FavoritedLocation: Story = {
  args: {
    location: {
      ...defaultLocation,
      isFavorite: true,
    },
  },
};

/**
 * Location card in loading state
 */
export const LoadingState: Story = {
  args: {
    location: defaultLocation,
    loading: true,
  },
};

/**
 * Location card with minimal data (graceful degradation)
 */
export const MinimalData: Story = {
  args: {
    location: {
      id: 'loc-minimal',
      name: 'Basic Location',
      address: {
        street: '456 Oak Avenue',
        city: 'Portland',
        state: 'OR',
        zip: '97201',
        country: 'USA',
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Location card with only required data. Shows graceful handling of missing optional fields.',
      },
    },
  },
};

/**
 * Location card without map preview
 */
export const NoMapPreview: Story = {
  args: {
    location: {
      ...defaultLocation,
      mapImageUrl: undefined,
    },
  },
};

/**
 * Compact layout for list views
 */
export const CompactLayout: Story = {
  args: {
    location: defaultLocation,
    layout: 'compact',
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact layout suitable for list views with reduced padding and no map preview.',
      },
    },
  },
};

/**
 * Detailed layout with all information
 */
export const DetailedLayout: Story = {
  args: {
    location: defaultLocation,
    layout: 'detailed',
  },
  parameters: {
    docs: {
      description: {
        story: 'Detailed layout showing all available information including operating hours and email button.',
      },
    },
  },
};

/**
 * Location card without distance
 */
export const NoDistance: Story = {
  args: {
    location: {
      ...defaultLocation,
      distance: undefined,
    },
  },
};

/**
 * Location card without contact info
 */
export const NoContactInfo: Story = {
  args: {
    location: {
      ...defaultLocation,
      contact: undefined,
    },
  },
};

/**
 * Location card without actions
 */
export const NoActions: Story = {
  args: {
    location: defaultLocation,
    showActions: false,
  },
};

/**
 * Location card without favorite button
 */
export const NoFavoriteButton: Story = {
  args: {
    location: defaultLocation,
    showFavorite: false,
  },
};

/**
 * Location with long address
 */
export const LongAddress: Story = {
  args: {
    location: {
      ...defaultLocation,
      name: 'Corporate Headquarters Building A',
      address: {
        street: '1234 Very Long Street Name Boulevard',
        street2: 'Building A, Floor 12, Suite 1234',
        city: 'San Francisco',
        state: 'CA',
        zip: '94102-1234',
        country: 'United States of America',
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Location card handling long address with street2 and extended details.',
      },
    },
  },
};

/**
 * Multiple location cards in grid view
 */
export const GridView: Story = {
  decorators: [
    (Story) => (
      <div className="grid grid-cols-2 gap-4 w-[900px]">
        <LocationCard
          location={{
            id: 'loc-1',
            name: 'Downtown Office',
            address: {
              street: '123 Main St',
              city: 'San Francisco',
              state: 'CA',
              zip: '94102',
              country: 'USA',
            },
            distance: 2.5,
            distanceUnit: 'mi',
            mapImageUrl: 'https://via.placeholder.com/400x200/4F46E5/FFFFFF?text=Downtown',
            contact: { phone: '4155551234' },
          }}
        />
        <LocationCard
          location={{
            id: 'loc-2',
            name: 'North Branch',
            address: {
              street: '456 Oak Ave',
              city: 'Oakland',
              state: 'CA',
              zip: '94601',
              country: 'USA',
            },
            distance: 8.2,
            distanceUnit: 'mi',
            mapImageUrl: 'https://via.placeholder.com/400x200/10B981/FFFFFF?text=North',
            contact: { phone: '5105551234' },
          }}
        />
        <LocationCard
          location={{
            id: 'loc-3',
            name: 'South Office',
            address: {
              street: '789 Pine St',
              city: 'San Jose',
              state: 'CA',
              zip: '95110',
              country: 'USA',
            },
            distance: 15.7,
            distanceUnit: 'mi',
            mapImageUrl: 'https://via.placeholder.com/400x200/F59E0B/FFFFFF?text=South',
            contact: { phone: '4085551234' },
            isFavorite: true,
          }}
        />
        <LocationCard
          location={{
            id: 'loc-4',
            name: 'East Center',
            address: {
              street: '321 Elm Blvd',
              city: 'Berkeley',
              state: 'CA',
              zip: '94704',
              country: 'USA',
            },
            distance: 6.1,
            distanceUnit: 'mi',
            mapImageUrl: 'https://via.placeholder.com/400x200/EF4444/FFFFFF?text=East',
            contact: { phone: '5105559876' },
          }}
        />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Multiple location cards displayed in a responsive grid layout.',
      },
    },
  },
  render: () => <div />,
};

/**
 * Multiple location cards in list view
 */
export const ListView: Story = {
  decorators: [
    (Story) => (
      <div className="space-y-3 w-[500px]">
        <LocationCard
          location={{
            id: 'loc-1',
            name: 'Downtown Office',
            address: {
              street: '123 Main St',
              city: 'San Francisco',
              state: 'CA',
              zip: '94102',
              country: 'USA',
            },
            distance: 2.5,
            distanceUnit: 'mi',
            contact: { phone: '4155551234', email: 'downtown@example.com' },
          }}
          layout="compact"
          clickable
        />
        <LocationCard
          location={{
            id: 'loc-2',
            name: 'North Branch',
            address: {
              street: '456 Oak Ave',
              city: 'Oakland',
              state: 'CA',
              zip: '94601',
              country: 'USA',
            },
            distance: 8.2,
            distanceUnit: 'mi',
            contact: { phone: '5105551234', email: 'north@example.com' },
            isFavorite: true,
          }}
          layout="compact"
          clickable
        />
        <LocationCard
          location={{
            id: 'loc-3',
            name: 'South Office',
            address: {
              street: '789 Pine St',
              city: 'San Jose',
              state: 'CA',
              zip: '95110',
              country: 'USA',
            },
            distance: 15.7,
            distanceUnit: 'mi',
            contact: { phone: '4085551234', email: 'south@example.com' },
          }}
          layout="compact"
          clickable
        />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Multiple location cards in compact layout suitable for list views.',
      },
    },
  },
  render: () => <div />,
};

/**
 * Interactive playground for all features
 */
export const Playground: Story = {
  args: {
    location: defaultLocation,
    layout: 'default',
    clickable: false,
    showMap: true,
    showDistance: true,
    showContact: true,
    showHours: false,
    showActions: true,
    showFavorite: true,
    loading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to test all LocationCard features and configurations.',
      },
    },
  },
};
