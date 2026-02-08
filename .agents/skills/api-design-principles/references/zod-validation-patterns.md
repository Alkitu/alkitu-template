# Zod Validation Patterns

Comprehensive guide to Zod schema validation patterns in the Alkitu Template project, covering type-safe validation for tRPC procedures and NestJS endpoints.

## Overview

Zod provides runtime type validation with automatic TypeScript type inference. This guide covers schema composition, validation techniques, and integration patterns based on the project's schema files.

## Basic Schema Patterns

### Simple Field Validation

```typescript
import { z } from 'zod';

// String validation
const nameSchema = z.string();
const emailSchema = z.string().email();
const urlSchema = z.string().url();
const uuidSchema = z.string().uuid();

// Number validation
const ageSchema = z.number().min(0).max(120);
const pageSchema = z.number().min(1);
const limitSchema = z.number().min(1).max(100);

// Boolean validation
const isActiveSchema = z.boolean();

// Date validation
const dateSchema = z.date();
const datetimeStringSchema = z.string().datetime();
const dateOrStringSchema = z.string().datetime().or(z.date());
```

### Type Inference

Export TypeScript types directly from schemas:

```typescript
// Schema definition
export const createUserSchema = z.object({
  email: z.string().email(),
  firstname: z.string(),
  lastname: z.string(),
  role: z.nativeEnum(UserRole),
});

// Automatic type inference
export type CreateUserInput = z.infer<typeof createUserSchema>;

// Usage in function
async function createUser(input: CreateUserInput) {
  // input is fully typed: { email: string; firstname: string; lastname: string; role: UserRole }
}
```

## Enum Handling

### Native Enums

For Prisma-generated enums or TypeScript enums:

```typescript
// Prisma enum
import { RequestStatus, ConversationStatus, Priority } from '@prisma/client';

// Use z.nativeEnum() for Prisma enums
export const updateStatusSchema = z.object({
  conversationId: z.string(),
  status: z.nativeEnum(ConversationStatus),
});

export const getFilteredRequestsSchema = z.object({
  status: z.nativeEnum(RequestStatus).optional(),
  priority: z.nativeEnum(Priority).optional(),
});
```

### String Literal Unions

For specific string values:

```typescript
// Sorting and ordering
export const sortOrderSchema = z.enum(['asc', 'desc']);

export const listSchema = z.object({
  sortBy: z.string().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type ListInput = z.infer<typeof listSchema>;
// { sortBy: string; sortOrder: "asc" | "desc" }
```

## Default Values

```typescript
// Pagination with defaults
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

// Optional with default
export const listOptionsSchema = z.object({
  sortBy: z.string().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  includeDeleted: z.boolean().default(false),
});

// Usage - missing fields get defaults
const input = paginationSchema.parse({});
// { page: 1, limit: 20 }
```

## Optional and Nullable Fields

```typescript
// Optional field (can be undefined)
export const updateProfileSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  bio: z.string().optional(),
  avatarUrl: z.string().url().optional(),
});

// Nullable field (can be null)
export const userSettingsSchema = z.object({
  theme: z.string().nullable(),
  language: z.string().nullable(),
});

// Both optional and nullable
export const metadataSchema = z.object({
  description: z.string().optional().nullable(),
});
```

## Nested Objects

```typescript
// Nested object validation
export const updateRequestSchema = z.object({
  id: z.string(),
  serviceId: z.string(),
  executionDateTime: z.string().datetime().or(z.date()),
  locationData: z
    .object({
      building: z.string().optional(),
      tower: z.string().optional(),
      floor: z.string().optional(),
      unit: z.string().optional(),
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zip: z.string(),
    })
    .optional(),
});

export type UpdateRequestInput = z.infer<typeof updateRequestSchema>;
// locationData is { building?: string; tower?: string; ... } | undefined
```

### Reusable Nested Schemas

```typescript
// Define reusable address schema
const addressSchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  country: z.string().default('US'),
});

// Compose into larger schemas
export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  address: addressSchema,
  billingAddress: addressSchema.optional(),
});
```

## Arrays

```typescript
// Array of strings
export const tagsSchema = z.array(z.string());

// Array of objects
export const conversationIdsSchema = z.object({
  conversationIds: z.array(z.string()),
});

// Array with constraints
export const filesSchema = z.object({
  files: z.array(z.string().url()).min(1).max(10),
});

// Array of complex objects
export const itemsSchema = z.array(
  z.object({
    id: z.string(),
    quantity: z.number().min(1),
    price: z.number().min(0),
  })
);
```

## Records and Dynamic Keys

```typescript
// Record for dynamic key-value pairs
export const templateResponsesSchema = z.record(z.any());

// Record with typed values
export const settingsSchema = z.record(z.string(), z.boolean());

// Record with specific key pattern
export const metadataSchema = z.record(
  z.string().regex(/^[a-z_]+$/),
  z.union([z.string(), z.number(), z.boolean()])
);

// Usage in request schema
export const createRequestSchema = z.object({
  userId: z.string(),
  serviceId: z.string(),
  templateResponses: z.record(z.any()),
  note: z.any().optional(),
});
```

## Union Types

```typescript
// Union of primitives
const idSchema = z.union([z.string(), z.number()]);

// Union of objects (discriminated)
const messageSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('text'),
    content: z.string(),
  }),
  z.object({
    type: z.literal('image'),
    url: z.string().url(),
    alt: z.string().optional(),
  }),
  z.object({
    type: z.literal('file'),
    filename: z.string(),
    size: z.number(),
  }),
]);

// Shorthand with .or()
const dateOrStringSchema = z.string().datetime().or(z.date());
```

## Pagination Schemas

### Offset-Based Pagination

```typescript
// Standard pagination schema
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

// With sorting and filtering
export const getFilteredRequestsSchema = z.object({
  // Pagination
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),

  // Filters
  status: z.nativeEnum(RequestStatus).optional(),
  userId: z.string().optional(),
  serviceId: z.string().optional(),
  assignedToId: z.string().optional(),

  // Sorting
  sortBy: z.string().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type GetFilteredRequestsInput = z.infer<typeof getFilteredRequestsSchema>;
```

### Cursor-Based Pagination

```typescript
// Cursor pagination for infinite scroll
export const cursorPaginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
  direction: z.enum(['forward', 'backward']).default('forward'),
});

// With filtering
export const getConversationsSchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().default(10),
  status: z.nativeEnum(ConversationStatus).optional(),
  priority: z.nativeEnum(Priority).optional(),
  search: z.string().optional(),
});
```

## Chat/Messaging Schemas

From `chat.schemas.ts`:

```typescript
import { z } from 'zod';
import { ConversationStatus, Priority } from '@prisma/client';

export const chatSchemas = {
  // Start conversation with optional fields
  startConversation: z.object({
    email: z.string().email().optional(),
    phone: z.string().optional(),
    name: z.string().optional(),
    company: z.string().optional(),
    message: z.string().optional(),
    source: z.string().optional(),
    ipAddress: z.string().optional(),
    userAgent: z.string().optional(),
  }),

  // Send message
  sendMessage: z.object({
    conversationId: z.string(),
    content: z.string(),
    isFromVisitor: z.boolean(),
    senderUserId: z.string().optional(),
    metadata: z.any().optional(),
  }),

  // Get conversations with filtering
  getConversations: z.object({
    status: z.nativeEnum(ConversationStatus).optional(),
    priority: z.nativeEnum(Priority).optional(),
    search: z.string().optional(),
    page: z.number().default(1),
    limit: z.number().default(10),
  }),

  // Reply to message
  replyToMessage: z.object({
    conversationId: z.string(),
    content: z.string(),
    senderUserId: z.string(),
  }),

  // Send email transcript
  sendEmailTranscript: z.object({
    conversationId: z.string(),
    email: z.string().email(),
  }),
};
```

## Custom Validation (Refinements)

### Basic Refinement

```typescript
// Password strength validation
const passwordSchema = z
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
```

### Multi-Field Validation

```typescript
// Password confirmation
const signupSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
```

### Async Validation

```typescript
// Check if email is unique
const createUserSchema = z
  .object({
    email: z.string().email(),
    username: z.string(),
  })
  .refine(
    async (data) => {
      const exists = await prisma.user.findUnique({
        where: { email: data.email },
      });
      return !exists;
    },
    {
      message: 'Email already in use',
      path: ['email'],
    }
  );
```

### SuperRefine for Complex Logic

```typescript
// Multiple validations with different error paths
const orderSchema = z
  .object({
    items: z.array(z.object({ id: z.string(), quantity: z.number() })),
    couponCode: z.string().optional(),
    total: z.number(),
  })
  .superRefine((data, ctx) => {
    // Validate items not empty
    if (data.items.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Order must contain at least one item',
        path: ['items'],
      });
    }

    // Validate total is positive
    if (data.total <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Total must be greater than 0',
        path: ['total'],
      });
    }

    // Validate coupon if provided
    if (data.couponCode && !isValidCoupon(data.couponCode)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid coupon code',
        path: ['couponCode'],
      });
    }
  });
```

## Transformation

### Parse and Transform

```typescript
// Transform string to Date
const dateSchema = z.string().transform((str) => new Date(str));

// Transform to lowercase
const emailSchema = z.string().email().transform((email) => email.toLowerCase());

// Parse JSON string
const jsonSchema = z.string().transform((str) => JSON.parse(str));

// Complex transformation
const userInputSchema = z
  .object({
    name: z.string(),
    tags: z.string(), // "tag1,tag2,tag3"
  })
  .transform((data) => ({
    name: data.name.trim(),
    tags: data.tags.split(',').map((tag) => tag.trim()),
  }));
```

## Schema Composition

### Extending Schemas

```typescript
// Base schema
const baseEntitySchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Extend for specific entity
const userSchema = baseEntitySchema.extend({
  email: z.string().email(),
  firstname: z.string(),
  lastname: z.string(),
  role: z.nativeEnum(UserRole),
});

// Extend and override
const adminSchema = userSchema.extend({
  role: z.literal(UserRole.ADMIN), // Override to require ADMIN
  permissions: z.array(z.string()),
});
```

### Partial and Pick

```typescript
// Make all fields optional
const updateUserSchema = userSchema.partial();

// Pick specific fields
const userCredentialsSchema = userSchema.pick({
  email: true,
  password: true,
});

// Omit specific fields
const publicUserSchema = userSchema.omit({
  password: true,
  resetToken: true,
});
```

### Merge Schemas

```typescript
const addressSchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
});

const contactSchema = z.object({
  email: z.string().email(),
  phone: z.string(),
});

// Merge both schemas
const fullProfileSchema = addressSchema.merge(contactSchema);
// { street, city, state, email, phone }
```

## Integration with tRPC

### Router with Schemas

```typescript
// routers/user.router.ts
import { t } from '../trpc';
import { createUserSchema, updateUserSchema, listUsersSchema } from '../schemas/user.schemas';

export const userRouter = t.router({
  list: t.procedure
    .input(listUsersSchema)
    .query(async ({ input, ctx }) => {
      // input is fully typed from schema
      return await ctx.prisma.user.findMany({
        skip: (input.page - 1) * input.limit,
        take: input.limit,
      });
    }),

  create: t.procedure
    .input(createUserSchema)
    .mutation(async ({ input, ctx }) => {
      // input is validated and typed
      return await ctx.prisma.user.create({
        data: input,
      });
    }),

  update: t.procedure
    .input(updateUserSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;
      return await ctx.prisma.user.update({
        where: { id },
        data,
      });
    }),
});
```

### Client Type Safety

```typescript
// Frontend client - fully type-safe
const { data, isLoading } = trpc.user.list.useQuery({
  page: 1,
  limit: 20,
  role: 'ADMIN', // Type-checked against UserRole enum
});

const createUser = trpc.user.create.useMutation();

await createUser.mutateAsync({
  email: 'user@example.com', // Type-checked and validated
  firstname: 'John',
  lastname: 'Doe',
  role: 'ADMIN',
});
```

## Error Handling

### Zod Parsing Errors

```typescript
import { ZodError } from 'zod';

try {
  const input = userSchema.parse(untrustedData);
} catch (error) {
  if (error instanceof ZodError) {
    // Access validation errors
    console.log(error.issues);
    // [{ code: 'invalid_type', expected: 'string', received: 'number', path: ['email'], message: '...' }]

    // Format for user display
    const fieldErrors = error.issues.reduce((acc, issue) => {
      const path = issue.path.join('.');
      acc[path] = issue.message;
      return acc;
    }, {} as Record<string, string>);
  }
}
```

### Safe Parsing

```typescript
// Use safeParse to avoid throwing
const result = userSchema.safeParse(untrustedData);

if (!result.success) {
  // Handle validation errors
  console.log(result.error.issues);
  return;
}

// Data is valid and typed
const user = result.data;
```

## Best Practices

1. **Co-locate Schemas with Routes**
   - Keep schemas in separate files: `schemas/user.schemas.ts`
   - Export both schema and inferred type
   - One schema file per router domain

2. **Always Export Types**
   ```typescript
   export const userSchema = z.object({...});
   export type User = z.infer<typeof userSchema>;
   ```

3. **Use Descriptive Names**
   - `createUserSchema`, not `userInput`
   - `updateRequestSchema`, not `requestUpdate`
   - `getFilteredRequestsSchema` for complex queries

4. **Reuse Common Patterns**
   ```typescript
   // Create reusable pagination schema
   export const paginationSchema = z.object({
     page: z.number().min(1).default(1),
     limit: z.number().min(1).max(100).default(20),
   });

   // Compose into specific schemas
   export const listUsersSchema = paginationSchema.extend({
     role: z.nativeEnum(UserRole).optional(),
     search: z.string().optional(),
   });
   ```

5. **Validate Early**
   - Use schemas at API boundaries (tRPC procedures, REST controllers)
   - Don't pass unvalidated data deep into business logic

6. **Leverage Type Inference**
   - Never manually type inputs - use `z.infer`
   - Share types via `@alkitu/shared` package

7. **Use Native Enums for Prisma**
   - Always use `z.nativeEnum()` for Prisma enums
   - Ensures consistency with database schema

8. **Prefer Strict Validation**
   - Use specific validators (`.email()`, `.url()`, `.uuid()`)
   - Add constraints (`.min()`, `.max()`, `.regex()`)
   - Avoid `z.any()` except for truly dynamic data

## Common Patterns

### CRUD Schemas

```typescript
// schemas/resource.schemas.ts
export const createResourceSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

export const updateResourceSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
});

export const deleteResourceSchema = z.object({
  id: z.string(),
});

export const getResourceSchema = z.object({
  id: z.string(),
});

export const listResourcesSchema = paginationSchema.extend({
  search: z.string().optional(),
  sortBy: z.enum(['name', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Export types
export type CreateResourceInput = z.infer<typeof createResourceSchema>;
export type UpdateResourceInput = z.infer<typeof updateResourceSchema>;
export type DeleteResourceInput = z.infer<typeof deleteResourceSchema>;
export type GetResourceInput = z.infer<typeof getResourceSchema>;
export type ListResourcesInput = z.infer<typeof listResourcesSchema>;
```

### Status Update Pattern

```typescript
export const updateStatusSchema = z.object({
  id: z.string(),
  status: z.nativeEnum(Status),
  reason: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const assignSchema = z.object({
  id: z.string(),
  assignedToId: z.string(),
  notify: z.boolean().default(true),
});
```

## See Also

- [tRPC Design Patterns](./trpc-design-patterns.md)
- [Middleware Patterns](./middleware-patterns.md)
- [NestJS REST Patterns](./nestjs-rest-patterns.md)
- [Official Zod Documentation](https://zod.dev)
