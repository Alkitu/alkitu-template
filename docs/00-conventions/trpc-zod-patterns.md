# tRPC + Zod Conventions

Established patterns for type-safe API development with tRPC and Zod.

## 1. Zod as Single Source of Truth for Input Types

All tRPC endpoint input types MUST be defined as Zod schemas. Services MUST use Zod-inferred types, not DTO classes.

```ts
// schemas/chat.schemas.ts
export const chatSchemas = {
  sendMessage: z.object({
    conversationId: z.string(),
    content: z.string(),
  }),
};
export type SendMessageInput = z.infer<typeof chatSchemas.sendMessage>;

// chat.service.ts — use Zod-inferred type
async sendMessage(data: SendMessageInput): Promise<MessageResult> { ... }

// chat.router.ts — no cast needed, types flow naturally
.mutation(async ({ input, ctx }) => {
  return ctx.chatService.sendMessage(input); // types match
});
```

**DTOs are ONLY for REST/Swagger** — class-validator decorators and `@ApiProperty` on DTO classes serve REST controllers. The tRPC flow never uses them.

## 2. Prohibited: `z.any()`

Never use `z.any()` — it disables all type checking and validation.

| Scenario | Use Instead |
|---|---|
| Dynamic JSON object | `z.record(z.string(), z.unknown())` |
| Array of dynamic objects | `z.array(z.record(z.string(), z.unknown()))` |
| String or JSON object | `z.union([z.string(), z.record(z.string(), z.unknown())])` |

```ts
// BAD
themeData: z.any()

// GOOD
themeData: z.record(z.string(), z.unknown())
```

## 3. Prohibited: `as` Casts in Routers

If you need an `as` cast between Zod-inferred input and a service method, the schema doesn't match the service signature. Fix the types instead.

**Allowed exceptions:**
- `as Prisma.InputJsonValue` — Prisma distinguishes between `JsonValue` (output) and `InputJsonValue` (input)
- `as TemplateTrigger` — bridging between Zod string enums and Prisma enums when structurally identical but nominally different

## 4. Endpoint Protection Levels

Every endpoint MUST use the correct procedure type:

| Procedure | When to Use |
|---|---|
| `publicProcedure` | Reading data needed before auth (theme for UI, public content) |
| `protectedProcedure` | Any action requiring a logged-in user |
| `adminProcedure` | Mutations on system-wide settings, user management |
| `employeeProcedure` | Employee-level operations |
| `clientProcedure` | Client-level operations |

**Never use `t.procedure` directly** — it's unprotected and allows unauthenticated access.

```ts
// BAD — no auth check
save: t.procedure.input(...).mutation(...)

// GOOD — admin only
save: adminProcedure.input(...).mutation(...)
```

## 5. Schemas in Separate Files

All Zod schemas MUST live in `packages/api/src/trpc/schemas/<module>.schemas.ts`. Never define schemas inline in routers.

```ts
// BAD — inline schema in router
save: adminProcedure
  .input(z.object({ name: z.string(), data: z.record(z.string(), z.unknown()) }))
  .mutation(...)

// GOOD — reference centralized schema
save: adminProcedure
  .input(themeSchemas.save)
  .mutation(...)
```

## 6. No `console.log` in Routers

Routers MUST NOT contain `console.log`, `console.warn`, or `console.error`. Errors propagate as `TRPCError` — the client receives structured error codes. Use NestJS `Logger` in services if logging is needed.

## 7. Export Inferred Types from Schema Files

Every schema file MUST export Zod-inferred types for use in services:

```ts
// At the bottom of each schema file
export type SendMessageInput = z.infer<typeof chatSchemas.sendMessage>;
export type AssignConversationInput = z.infer<typeof chatSchemas.assignConversation>;
```

## 8. No Direct `new PrismaClient()` in Routers

Routers MUST NOT instantiate `new PrismaClient()` directly. This creates duplicate database connections, prevents mocking in tests, and violates NestJS dependency injection.

Use the **factory function pattern** — each router exports a `createXRouter()` function that receives dependencies as parameters:

```ts
// BAD — direct instantiation
const prisma = new PrismaClient();
export function createCategoryRouter() {
  return t.router({
    getAll: protectedProcedure.query(async () => {
      return await prisma.category.findMany();
    }),
  });
}

// GOOD — dependency injection via factory
export function createCategoryRouter(prisma: PrismaClient) {
  return t.router({
    getAll: protectedProcedure.query(async () => {
      return await prisma.category.findMany();
    }),
  });
}
```

Wire dependencies in `trpc.router.ts`:

```ts
category: createCategoryRouter(this.prisma),
```

## Anti-Patterns

```ts
// Anti-pattern 1: Double validation (DTO + Zod)
// Zod validates → cast as DTO → service uses properties as plain object
return ctx.chatService.sendMessage(input as SendMessageDto); // WRONG

// Anti-pattern 2: z.any() bypasses all validation
themeData: z.any() // WRONG — anything passes

// Anti-pattern 3: Unprotected mutation
delete: t.procedure.input(...).mutation(...) // WRONG — anyone can delete

// Anti-pattern 4: Console.log in router
console.log('Creating theme:', input.name); // WRONG — use Logger in service

// Anti-pattern 5: Direct PrismaClient instantiation
const prisma = new PrismaClient(); // WRONG — use factory pattern with DI

// Anti-pattern 6: Inline schema in router
save: adminProcedure.input(z.object({ name: z.string() })).mutation(...) // WRONG — use schema file
```
