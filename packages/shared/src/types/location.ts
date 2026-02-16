/**
 * Work Location Types (ALI-117)
 *
 * Represents physical work locations for users.
 * Used in New Request flow, Request Details, and Calendar.
 */

/**
 * Work Location interface
 *
 * Required fields:
 * - street: Street address
 * - city: City name
 * - zip: ZIP code (5 digits or 5+4 format)
 * - state: 2-letter US state code (e.g., NY, CA)
 *
 * Optional fields (for complex addresses):
 * - building: Building name or number
 * - tower: Tower identifier
 * - floor: Floor number or identifier
 * - unit: Unit, suite, or apartment number
 */
export interface WorkLocation {
  id: string;
  userId: string;

  // Required address fields
  street: string;
  city: string;
  zip: string;
  state: string; // 2-letter US state code

  // Optional fields for complex addresses
  building?: string;
  tower?: string;
  floor?: string;
  unit?: string;

  
  // NEW: UI enhancements
  icon?: string;
  iconColor?: string;
  isDefault?: boolean;

  createdAt: Date;
}

/**
 * Work Location with associated request count.
 * Used by the frontend to determine edit/delete permissions.
 */
export interface WorkLocationWithRequestCount extends WorkLocation {
  _count: { requests: number };
}

/**
 * Create Work Location input (without id and timestamps)
 */
export interface CreateLocationInput {
  street: string;
  building?: string;
  tower?: string;
  floor?: string;
  unit?: string;
  city: string;
  zip: string;
  state: string;
  icon?: string;
  iconColor?: string;
  isDefault?: boolean;
}

/**
 * Update Work Location input (all fields optional for partial updates)
 */
export interface UpdateLocationInput {
  street?: string;
  building?: string;
  tower?: string;
  floor?: string;
  unit?: string;
  city?: string;
  zip?: string;
  state?: string;
  icon?: string;
  iconColor?: string;
  isDefault?: boolean;
}

/**
 * Work Locations list response
 */
export interface LocationsListResponse {
  locations: WorkLocation[];
  total: number;
}

/**
 * US State codes (2-letter)
 */
export const US_STATE_CODES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
] as const;

export type USStateCode = typeof US_STATE_CODES[number];
