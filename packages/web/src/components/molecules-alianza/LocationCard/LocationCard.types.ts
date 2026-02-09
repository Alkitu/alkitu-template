import type { HTMLAttributes } from 'react';

/**
 * Address structure for LocationCard
 */
export interface LocationAddress {
  /**
   * Street address (line 1)
   */
  street: string;

  /**
   * Street address (line 2) - optional
   */
  street2?: string;

  /**
   * City name
   */
  city: string;

  /**
   * State or province
   */
  state: string;

  /**
   * Postal/ZIP code
   */
  zip: string;

  /**
   * Country name
   */
  country: string;
}

/**
 * Operating hours for a single day
 */
export interface OperatingHours {
  /**
   * Opening time (24hr format, e.g., "09:00")
   */
  open: string;

  /**
   * Closing time (24hr format, e.g., "17:00")
   */
  close: string;

  /**
   * Whether the location is closed on this day
   */
  closed?: boolean;
}

/**
 * Weekly operating hours
 */
export interface WeeklyHours {
  monday?: OperatingHours;
  tuesday?: OperatingHours;
  wednesday?: OperatingHours;
  thursday?: OperatingHours;
  friday?: OperatingHours;
  saturday?: OperatingHours;
  sunday?: OperatingHours;
}

/**
 * Contact information
 */
export interface LocationContact {
  /**
   * Phone number
   */
  phone?: string;

  /**
   * Email address
   */
  email?: string;
}

/**
 * Location data structure
 */
export interface LocationData {
  /**
   * Unique location identifier
   */
  id: string;

  /**
   * Location name or title
   */
  name: string;

  /**
   * Full address
   */
  address: LocationAddress;

  /**
   * Contact information (phone, email)
   */
  contact?: LocationContact;

  /**
   * Distance from user (in miles or km)
   */
  distance?: number;

  /**
   * Distance unit
   * @default 'mi'
   */
  distanceUnit?: 'mi' | 'km';

  /**
   * URL for static map image
   */
  mapImageUrl?: string;

  /**
   * Google Maps or other map service URL
   */
  mapUrl?: string;

  /**
   * Operating hours for the week
   */
  hours?: WeeklyHours;

  /**
   * Whether this location is favorited
   */
  isFavorite?: boolean;

  /**
   * Additional metadata
   */
  metadata?: Record<string, unknown>;
}

/**
 * Display layout options
 */
export type LocationCardLayout = 'default' | 'compact' | 'detailed';

/**
 * Props for LocationCard component
 */
export interface LocationCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {
  /**
   * Location data to display
   */
  location: LocationData;

  /**
   * Layout variant
   * @default 'default'
   */
  layout?: LocationCardLayout;

  /**
   * Whether the card is clickable (navigates to location details)
   * @default false
   */
  clickable?: boolean;

  /**
   * Click handler for the card
   */
  onClick?: (location: LocationData) => void;

  /**
   * Handler for getting directions
   */
  onGetDirections?: (location: LocationData) => void;

  /**
   * Handler for calling the location
   */
  onCall?: (phone: string) => void;

  /**
   * Handler for emailing the location
   */
  onEmail?: (email: string) => void;

  /**
   * Handler for toggling favorite status
   */
  onToggleFavorite?: (locationId: string, isFavorite: boolean) => void;

  /**
   * Whether to show the map preview
   * @default true
   */
  showMap?: boolean;

  /**
   * Whether to show distance
   * @default true
   */
  showDistance?: boolean;

  /**
   * Whether to show contact information
   * @default true
   */
  showContact?: boolean;

  /**
   * Whether to show operating hours
   * @default true
   */
  showHours?: boolean;

  /**
   * Whether to show action buttons
   * @default true
   */
  showActions?: boolean;

  /**
   * Whether to show favorite button
   * @default true
   */
  showFavorite?: boolean;

  /**
   * Loading state
   * @default false
   */
  loading?: boolean;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Data test ID for testing
   */
  'data-testid'?: string;
}
