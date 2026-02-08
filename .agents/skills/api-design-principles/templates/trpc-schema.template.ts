/**
 * tRPC Schema Template
 *
 * Production-ready Zod schemas for tRPC procedures following Alkitu Template patterns.
 * Includes CRUD schemas, pagination, filtering, and type inference.
 *
 * Usage:
 * 1. Copy this template to packages/api/src/trpc/schemas/your-resource.schemas.ts
 * 2. Update the resource name and fields
 * 3. Export schemas and inferred types
 * 4. Import in corresponding router file
 */

import { z } from 'zod';
import { ResourceStatus } from '@prisma/client'; // Replace with your Prisma enum

// ============================================================================
// Reusable Schema Components
// ============================================================================

/**
 * Standard pagination schema
 * Reuse this across different list endpoints
 */
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

/**
 * Standard sorting schema
 */
export const sortingSchema = z.object({
  sortBy: z.string().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// ============================================================================
// CREATE Schema
// ============================================================================

/**
 * Schema for creating a new resource
 * All required fields for creation
 */
export const createResourceSchema = z.object({
  // Basic fields
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().optional(),
  status: z.nativeEnum(ResourceStatus).default(ResourceStatus.ACTIVE),

  // Nested object example
  metadata: z
    .object({
      category: z.string().optional(),
      tags: z.array(z.string()).optional(),
      priority: z.number().min(1).max(5).default(3),
    })
    .optional(),

  // Relationships
  userId: z.string(),
  categoryId: z.string().optional(),

  // Complex validation example
  email: z.string().email().optional(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
    .optional(),

  // Date fields
  startDate: z.string().datetime().or(z.date()),
  endDate: z.string().datetime().or(z.date()).optional(),

  // Array fields
  assignedTo: z.array(z.string()).optional(),
});

export type CreateResourceInput = z.infer<typeof createResourceSchema>;

// ============================================================================
// UPDATE Schema
// ============================================================================

/**
 * Schema for updating an existing resource
 * ID is required, all other fields optional
 */
export const updateResourceSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  status: z.nativeEnum(ResourceStatus).optional(),

  metadata: z
    .object({
      category: z.string().optional(),
      tags: z.array(z.string()).optional(),
      priority: z.number().min(1).max(5).optional(),
    })
    .optional(),

  userId: z.string().optional(),
  categoryId: z.string().optional(),

  email: z.string().email().optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),

  startDate: z.string().datetime().or(z.date()).optional(),
  endDate: z.string().datetime().or(z.date()).optional(),

  assignedTo: z.array(z.string()).optional(),
});

export type UpdateResourceInput = z.infer<typeof updateResourceSchema>;

// ============================================================================
// GET Schema
// ============================================================================

/**
 * Schema for getting a single resource by ID
 */
export const getResourceSchema = z.object({
  id: z.string(),
  include: z
    .object({
      user: z.boolean().optional(),
      category: z.boolean().optional(),
      assignees: z.boolean().optional(),
    })
    .optional(),
});

export type GetResourceInput = z.infer<typeof getResourceSchema>;

// ============================================================================
// DELETE Schema
// ============================================================================

/**
 * Schema for deleting a resource
 */
export const deleteResourceSchema = z.object({
  id: z.string(),
  reason: z.string().optional(),
});

export type DeleteResourceInput = z.infer<typeof deleteResourceSchema>;

// ============================================================================
// LIST Schema (with pagination and filtering)
// ============================================================================

/**
 * Schema for listing resources with pagination, filtering, and sorting
 */
export const listResourcesSchema = paginationSchema
  .merge(sortingSchema)
  .extend({
    // Filters
    status: z.nativeEnum(ResourceStatus).optional(),
    userId: z.string().optional(),
    categoryId: z.string().optional(),
    search: z.string().optional(),

    // Date range filters
    startDateFrom: z.string().datetime().optional(),
    startDateTo: z.string().datetime().optional(),

    // Array filters
    assignedToIds: z.array(z.string()).optional(),

    // Include relationships
    include: z
      .object({
        user: z.boolean().default(false),
        category: z.boolean().default(false),
        assignees: z.boolean().default(false),
      })
      .default({}),
  });

export type ListResourcesInput = z.infer<typeof listResourcesSchema>;

// ============================================================================
// Custom Action Schemas
// ============================================================================

/**
 * Schema for archiving a resource
 */
export const archiveResourceSchema = z.object({
  id: z.string(),
  reason: z.string().optional(),
});

export type ArchiveResourceInput = z.infer<typeof archiveResourceSchema>;

/**
 * Schema for assigning resource to users
 */
export const assignResourceSchema = z.object({
  id: z.string(),
  assignedToIds: z.array(z.string()).min(1, 'At least one assignee required'),
  notify: z.boolean().default(true),
});

export type AssignResourceInput = z.infer<typeof assignResourceSchema>;

/**
 * Schema for updating resource status
 */
export const updateStatusSchema = z.object({
  id: z.string(),
  status: z.nativeEnum(ResourceStatus),
  reason: z.string().optional(),
});

export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;

// ============================================================================
// Complex Validation Examples
// ============================================================================

/**
 * Multi-field validation with refinement
 */
export const createResourceWithValidationSchema = createResourceSchema.refine(
  (data) => {
    // Ensure end date is after start date
    if (data.endDate) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end > start;
    }
    return true;
  },
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
);

/**
 * Async validation example (check uniqueness)
 * NOTE: Use carefully - adds database query overhead
 */
export const createResourceWithUniqueCheckSchema = createResourceSchema;
// Apply async validation in router:
// .refine(async (data) => {
//   const existing = await ctx.prisma.resource.findFirst({
//     where: { name: data.name }
//   });
//   return !existing;
// }, {
//   message: 'Resource with this name already exists',
//   path: ['name'],
// });

/**
 * Complex nested object with refinement
 */
export const bulkUpdateResourceSchema = z.object({
  ids: z.array(z.string()).min(1, 'At least one ID required'),
  updates: z.object({
    status: z.nativeEnum(ResourceStatus).optional(),
    categoryId: z.string().optional(),
  }),
  options: z
    .object({
      skipNotifications: z.boolean().default(false),
      validateBeforeUpdate: z.boolean().default(true),
    })
    .default({}),
});

export type BulkUpdateResourceInput = z.infer<typeof bulkUpdateResourceSchema>;

// ============================================================================
// Union and Discriminated Union Examples
// ============================================================================

/**
 * Discriminated union for different action types
 */
export const resourceActionSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('archive'),
    id: z.string(),
    reason: z.string().optional(),
  }),
  z.object({
    action: z.literal('restore'),
    id: z.string(),
  }),
  z.object({
    action: z.literal('assign'),
    id: z.string(),
    assignedToIds: z.array(z.string()),
  }),
  z.object({
    action: z.literal('unassign'),
    id: z.string(),
    assignedToIds: z.array(z.string()),
  }),
]);

export type ResourceActionInput = z.infer<typeof resourceActionSchema>;

// ============================================================================
// Cursor-Based Pagination (Infinite Scroll)
// ============================================================================

/**
 * Schema for cursor-based pagination (infinite scroll)
 */
export const cursorPaginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
  direction: z.enum(['forward', 'backward']).default('forward'),
});

export const listResourcesCursorSchema = cursorPaginationSchema.extend({
  status: z.nativeEnum(ResourceStatus).optional(),
  search: z.string().optional(),
});

export type ListResourcesCursorInput = z.infer<typeof listResourcesCursorSchema>;

// ============================================================================
// Advanced Filtering Schema
// ============================================================================

/**
 * Advanced filtering with multiple operators
 */
export const advancedFilterSchema = z.object({
  // Standard pagination
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),

  // Text search
  search: z.string().optional(),
  searchFields: z.array(z.enum(['name', 'description'])).optional(),

  // Status filters
  status: z.nativeEnum(ResourceStatus).optional(),
  statuses: z.array(z.nativeEnum(ResourceStatus)).optional(),

  // Date range filters
  createdAt: z
    .object({
      gte: z.string().datetime().optional(),
      lte: z.string().datetime().optional(),
    })
    .optional(),

  // Relationship filters
  userId: z.string().optional(),
  categoryId: z.string().optional(),
  hasCategory: z.boolean().optional(),
  hasAssignees: z.boolean().optional(),

  // Sorting
  sortBy: z.enum(['createdAt', 'updatedAt', 'name', 'status']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type AdvancedFilterInput = z.infer<typeof advancedFilterSchema>;

// ============================================================================
// Statistics/Analytics Schemas
// ============================================================================

/**
 * Schema for getting resource statistics
 */
export const getStatsSchema = z.object({
  groupBy: z.enum(['status', 'category', 'user', 'date']).optional(),
  dateRange: z
    .object({
      from: z.string().datetime(),
      to: z.string().datetime(),
    })
    .optional(),
});

export type GetStatsInput = z.infer<typeof getStatsSchema>;

// ============================================================================
// Best Practices Examples
// ============================================================================

/**
 * Example: Password validation with custom refinement
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .refine(
    (password) => /[A-Z]/.test(password),
    'Password must contain at least one uppercase letter'
  )
  .refine(
    (password) => /[a-z]/.test(password),
    'Password must contain at least one lowercase letter'
  )
  .refine(
    (password) => /[0-9]/.test(password),
    'Password must contain at least one number'
  );

/**
 * Example: Email with domain restriction
 */
export const companyEmailSchema = z
  .string()
  .email()
  .refine(
    (email) => email.endsWith('@company.com'),
    'Email must be from company.com domain'
  );

/**
 * Example: Transform data during parsing
 */
export const normalizedNameSchema = z
  .string()
  .transform((str) => str.trim().toLowerCase());

/**
 * Example: Optional with default fallback
 */
export const configSchema = z.object({
  theme: z.enum(['light', 'dark']).default('light'),
  language: z.enum(['en', 'es', 'fr']).default('en'),
  notifications: z.boolean().default(true),
});

// ============================================================================
// Export All Schemas
// ============================================================================

export {
  // Reusable components
  paginationSchema,
  sortingSchema,

  // Main CRUD schemas
  createResourceSchema,
  updateResourceSchema,
  getResourceSchema,
  deleteResourceSchema,
  listResourcesSchema,

  // Action schemas
  archiveResourceSchema,
  assignResourceSchema,
  updateStatusSchema,
  bulkUpdateResourceSchema,
  resourceActionSchema,

  // Advanced schemas
  listResourcesCursorSchema,
  advancedFilterSchema,
  getStatsSchema,
};
