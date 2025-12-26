import { z } from 'zod';

/**
 * US State validation (2-letter code)
 */
export const StateCodeSchema = z
  .string()
  .length(2, 'State must be a 2-letter code')
  .regex(/^[A-Z]{2}$/, 'State must be uppercase (e.g., NY, CA)')
  .refine(
    (val) =>
      [
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
        'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
        'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
        'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
        'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
      ].includes(val),
    { message: 'Invalid US state code' },
  );

/**
 * ZIP code validation (5 digits or 5+4 format)
 */
export const ZipCodeSchema = z
  .string()
  .regex(/^\d{5}(-\d{4})?$/, 'ZIP code must be 5 digits or 5+4 format');

/**
 * Create Work Location schema (ALI-117)
 *
 * Required fields:
 * - street: Street address (1-200 chars)
 * - city: City name (1-100 chars)
 * - zip: ZIP code (5 or 5+4 format)
 * - state: 2-letter US state code
 *
 * Optional fields:
 * - building, tower, floor, unit (for complex addresses)
 */
export const CreateLocationSchema = z.object({
  street: z
    .string()
    .min(1, 'Street is required')
    .max(200, 'Street address too long'),
  building: z.string().max(100, 'Building name too long').optional(),
  tower: z.string().max(100, 'Tower name too long').optional(),
  floor: z.string().max(50, 'Floor too long').optional(),
  unit: z.string().max(50, 'Unit too long').optional(),
  city: z.string().min(1, 'City is required').max(100, 'City name too long'),
  zip: ZipCodeSchema,
  state: StateCodeSchema,
});

/**
 * Update Work Location schema (ALI-117)
 * All fields are optional for partial updates
 */
export const UpdateLocationSchema = z
  .object({
    street: z.string().min(1).max(200).optional(),
    building: z.string().max(100).optional(),
    tower: z.string().max(100).optional(),
    floor: z.string().max(50).optional(),
    unit: z.string().max(50).optional(),
    city: z.string().min(1).max(100).optional(),
    zip: ZipCodeSchema.optional(),
    state: StateCodeSchema.optional(),
  })
  .partial();

/**
 * Location ID param schema (MongoDB ObjectId)
 */
export const LocationIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid location ID'),
});

// Type inference (types exported from types/location.ts to avoid duplicates)
// export type CreateLocationInput = z.infer<typeof CreateLocationSchema>;
// export type UpdateLocationInput = z.infer<typeof UpdateLocationSchema>;
export type LocationIdInput = z.infer<typeof LocationIdSchema>;
