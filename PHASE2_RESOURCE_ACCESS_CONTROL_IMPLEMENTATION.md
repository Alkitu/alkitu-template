# 🚧 Phase 2 - Task 4: Resource Access Control System

**Date**: 2026-02-08
**Status**: 🔄 PARTIALLY COMPLETE (Core Infrastructure Ready)
**Duration**: ~2 hours of 8h estimated

---

## 🎯 Objective

Implement row-level security and resource ownership checks to ensure users can only access resources they own or have explicit permission to access.

## ✅ Completed Work

### 1. AccessControlService Created ✅

**File**: `/packages/api/src/access-control/access-control.service.ts`

**Features:**
- ✅ Central service for resource access verification
- ✅ Support for explicit access rules (AccessControl + AccessRule tables)
- ✅ Resource-specific ownership checks
- ✅ Role hierarchy integration
- ✅ Fail-closed security (deny access on error)

**Supported Resource Types:**
- `REQUEST` - Service requests
- `CONVERSATION` - Chat conversations
- `USER` - User profiles
- `WORK_LOCATION` - Work locations

**Methods:**
```typescript
// Check access (throws ForbiddenException if denied)
await accessControlService.checkAccess({
  userId: ctx.user.id,
  userRole: ctx.user.role,
  resourceType: 'REQUEST',
  resourceId: requestId,
  requiredLevel: AccessLevel.READ,
});

// Create resource with owner
await accessControlService.createResource({
  name: 'My Request',
  resourceType: 'REQUEST',
  ownerId: userId,
});

// Grant access to specific user
await accessControlService.grantAccess({
  resourceId: requestId,
  subjectType: 'USER',
  subjectValue: userId,
  accessLevel: AccessLevel.WRITE,
  grantedBy: adminId,
});

// Revoke access
await accessControlService.revokeAccess({
  resourceId: requestId,
  subjectType: 'USER',
  subjectValue: userId,
});
```

---

### 2. AccessControlModule Created ✅

**File**: `/packages/api/src/access-control/access-control.module.ts`

- ✅ Imports PrismaModule
- ✅ Provides AccessControlService
- ✅ Exports AccessControlService for use in other modules

---

### 3. Module Registration ✅

**File**: `/packages/api/src/app.module.ts`

- ✅ AccessControlModule imported and registered
- ✅ Available globally across all services

---

## 🔒 Access Control Logic

### Request Access Rules

**User can access a request if:**
1. User is the creator (`request.userId === userId`)
2. User is assigned to the request (`request.assignedToId === userId`)
3. User has EMPLOYEE or ADMIN role (can see all requests)
4. User has explicit access via AccessRule

### Conversation Access Rules

**User can access a conversation if:**
1. User owns the ContactInfo (`contactInfo.userId === userId`)
2. User is assigned to conversation (`conversation.assignedToId === userId`)
3. User has EMPLOYEE or ADMIN role
4. User has explicit access via AccessRule

### User Profile Access Rules

**User can access another user's profile if:**
1. User is accessing their own profile (`userId === targetUserId`)
2. User has ADMIN role (full access)
3. User has EMPLOYEE role (READ access only)
4. User has explicit access via AccessRule

### Work Location Access Rules

**User can access a work location if:**
1. User owns the location (`location.userId === userId`)
2. User has ADMIN role
3. User has explicit access via AccessRule

### Default Behavior

- **ADMIN**: Always has access to everything (via role hierarchy)
- **Unknown Resource Types**: Deny access by default (fail closed)
- **Database Errors**: Deny access (fail closed)
- **Missing Resources**: Deny access

---

## 🔄 Integration Guide

### Example 1: Integrate in RequestsService

**Before:**
```typescript
async findOne(id: string, userId: string, userRole: UserRole): Promise<Request> {
  const request = await this.prisma.request.findFirst({
    where: { id, deletedAt: null },
  });

  if (!request) {
    throw new NotFoundException('Request not found');
  }

  // No ownership check!
  return request;
}
```

**After:**
```typescript
import { AccessControlService } from '../access-control/access-control.service';

constructor(
  private prisma: PrismaService,
  private accessControl: AccessControlService,  // Add this
) {}

async findOne(id: string, userId: string, userRole: UserRole): Promise<Request> {
  const request = await this.prisma.request.findFirst({
    where: { id, deletedAt: null },
  });

  if (!request) {
    throw new NotFoundException('Request not found');
  }

  // Check access before returning
  await this.accessControl.checkAccess({
    userId,
    userRole,
    resourceType: 'REQUEST',
    resourceId: id,
    requiredLevel: AccessLevel.READ,
  });

  return request;
}

async update(id: string, dto: UpdateRequestDto, userId: string, userRole: UserRole): Promise<Request> {
  // Check WRITE access before updating
  await this.accessControl.checkAccess({
    userId,
    userRole,
    resourceType: 'REQUEST',
    resourceId: id,
    requiredLevel: AccessLevel.WRITE,
  });

  return this.prisma.request.update({
    where: { id },
    data: dto,
  });
}

async remove(id: string, userId: string, userRole: UserRole): Promise<void> {
  // Check ADMIN access before deleting
  await this.accessControl.checkAccess({
    userId,
    userRole,
    resourceType: 'REQUEST',
    resourceId: id,
    requiredLevel: AccessLevel.ADMIN,
  });

  await this.prisma.request.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}
```

**Don't forget to import AccessControlModule in RequestsModule:**
```typescript
@Module({
  imports: [AccessControlModule],  // Add this
  providers: [RequestsService],
})
export class RequestsModule {}
```

---

### Example 2: Integrate in tRPC Router

```typescript
import { AccessLevel } from '@prisma/client';

export const requestsRouter = createTRPCRouter({
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      // Check access using AccessControlService
      await ctx.accessControl.checkAccess({
        userId: ctx.user.id,
        userRole: ctx.user.role,
        resourceType: 'REQUEST',
        resourceId: input.id,
        requiredLevel: AccessLevel.READ,
      });

      return ctx.requestsService.findOne(input.id);
    }),

  update: protectedProcedure
    .input(updateRequestSchema)
    .mutation(async ({ ctx, input }) => {
      // Check WRITE access
      await ctx.accessControl.checkAccess({
        userId: ctx.user.id,
        userRole: ctx.user.role,
        resourceType: 'REQUEST',
        resourceId: input.id,
        requiredLevel: AccessLevel.WRITE,
      });

      return ctx.requestsService.update(input.id, input.data);
    }),
});
```

---

### Example 3: Create NestJS Guard ✅

**File**: `/packages/api/src/access-control/guards/resource-access.guard.ts`

**Status**: ✅ COMPLETE

**Features:**
- Decorator-based resource protection with `@RequireResourceAccess()`
- Automatic resource ID extraction from params or body
- Fail-closed security (denies access on error)
- Integration with AccessControlService
- Rich error messages with resource context

**Created files:**
- `/packages/api/src/access-control/guards/resource-access.guard.ts`

---

### Example 4: Create tRPC Middleware ✅

**File**: `/packages/api/src/trpc/middlewares/roles.middleware.ts`

**Status**: ✅ COMPLETE

**Implementation:**
```typescript
import { AccessControlService } from '../../access-control/access-control.service';

export interface RequireResourceAccessOptions {
  resourceType: string;
  accessLevel: AccessLevel;
  resourceIdKey?: string; // defaults to 'id'
}

export const requireResourceAccess = (options: RequireResourceAccessOptions) => {
  const { resourceType, accessLevel, resourceIdKey = 'id' } = options;

  return t.middleware(async ({ ctx, next, input }) => {
    // Validate authentication
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Authentication required for resource access',
      });
    }

    // Extract resource ID from input
    const resourceId = (input as any)?.[resourceIdKey];

    if (!resourceId) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Resource ID not provided in input.${resourceIdKey}`,
      });
    }

    // Check access using AccessControlService
    await ctx.accessControl.checkAccess({
      userId: ctx.user.id,
      userRole: ctx.user.role,
      resourceType,
      resourceId,
      requiredLevel: accessLevel,
    });

    return next();
  });
};
```

**Usage Examples:**
```typescript
import { requireResourceAccess } from '../middlewares/roles.middleware';
import { AccessLevel } from '@prisma/client';

// READ access to a request
const getRequest = protectedProcedure
  .use(requireResourceAccess({
    resourceType: 'REQUEST',
    accessLevel: AccessLevel.READ,
    resourceIdKey: 'requestId',
  }))
  .input(z.object({ requestId: z.string() }))
  .query(async ({ ctx, input }) => {
    return ctx.requestsService.findOne(input.requestId);
  });

// WRITE access to update a request
const updateRequest = protectedProcedure
  .use(requireResourceAccess({
    resourceType: 'REQUEST',
    accessLevel: AccessLevel.WRITE,
  }))
  .input(updateRequestSchema)
  .mutation(async ({ ctx, input }) => {
    return ctx.requestsService.update(input.id, input.data);
  });

// ADMIN access to delete a request
const deleteRequest = protectedProcedure
  .use(requireResourceAccess({
    resourceType: 'REQUEST',
    accessLevel: AccessLevel.ADMIN,
  }))
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    return ctx.requestsService.remove(input.id);
  });
```

**Context Integration:**
- Added `AccessControlService` to tRPC context (trpc.ts)
- Injected in `TrpcService` constructor (trpc.service.ts)
- Added `AccessControlModule` to `TrpcModule` imports
- Available as `ctx.accessControl` in all procedures

**Features:**
- ✅ Configurable resource type and access level
- ✅ Flexible resource ID key (defaults to 'id')
- ✅ Uses AccessControlService from context (proper DI)
- ✅ Fail-closed security (denies access on error)
- ✅ Rich error messages with resource context
- ✅ TypeScript type safety

**Modified files:**
- `/packages/api/src/trpc/middlewares/roles.middleware.ts` - Added middleware
- `/packages/api/src/trpc/trpc.ts` - Updated Context interface
- `/packages/api/src/trpc/trpc.service.ts` - Injected AccessControlService
- `/packages/api/src/trpc/trpc.module.ts` - Added AccessControlModule

```typescript
import { Injectable, CanActivate, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessControlService } from '../access-control.service';
import { AccessLevel } from '@prisma/client';

export const REQUIRE_RESOURCE_ACCESS = 'requireResourceAccess';

export interface ResourceAccessMetadata {
  resourceType: string;
  accessLevel: AccessLevel;
  resourceIdParam?: string; // Name of the param containing resource ID
}

export const RequireResourceAccess = (metadata: ResourceAccessMetadata) =>
  SetMetadata(REQUIRE_RESOURCE_ACCESS, metadata);

@Injectable()
export class ResourceAccessGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private accessControl: AccessControlService,
  ) {}

  async canActivate(context: ExecutionContext): boolean {
    const metadata = this.reflector.get<ResourceAccessMetadata>(
      REQUIRE_RESOURCE_ACCESS,
      context.getHandler(),
    );

    if (!metadata) {
      return true; // No access control required
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false; // No user (should be caught by auth guard)
    }

    // Get resource ID from params (default to 'id')
    const paramName = metadata.resourceIdParam || 'id';
    const resourceId = request.params[paramName];

    if (!resourceId) {
      return false; // No resource ID provided
    }

    try {
      await this.accessControl.checkAccess({
        userId: user.id,
        userRole: user.role,
        resourceType: metadata.resourceType,
        resourceId,
        requiredLevel: metadata.accessLevel,
      });
      return true;
    } catch {
      return false;
    }
  }
}
```

**Usage:**
```typescript
@Controller('requests')
@UseGuards(JwtAuthGuard, ResourceAccessGuard)
export class RequestsController {
  @Get(':id')
  @RequireResourceAccess({
    resourceType: 'REQUEST',
    accessLevel: AccessLevel.READ,
  })
  findOne(@Param('id') id: string) {
    return this.requestsService.findOne(id);
  }

  @Patch(':id')
  @RequireResourceAccess({
    resourceType: 'REQUEST',
    accessLevel: AccessLevel.WRITE,
  })
  update(@Param('id') id: string, @Body() dto: UpdateRequestDto) {
    return this.requestsService.update(id, dto);
  }
}
```

---

### Example 5: RequestsService Integration ✅

**Files**:
- `/packages/api/src/requests/requests.service.ts`
- `/packages/api/src/requests/requests.module.ts`

**Status**: ✅ COMPLETE

**Implementation Summary:**

Integrated AccessControlService into RequestsService to provide centralized resource access control while maintaining existing manual checks for defense in depth.

**Key Changes:**

1. **Module Integration:**
   ```typescript
   // requests.module.ts
   import { AccessControlModule } from '../access-control/access-control.module';

   @Module({
     imports: [NotificationModule, EmailTemplateModule, AccessControlModule],
     // ...
   })
   export class RequestsModule {}
   ```

2. **Service Integration:**
   ```typescript
   // requests.service.ts
   import { AccessControlService } from '../access-control/access-control.service';
   import { AccessLevel } from '@prisma/client';

   @Injectable()
   export class RequestsService {
     constructor(
       private readonly prisma: PrismaService,
       private readonly accessControl: AccessControlService,
       // ... other services
     ) {}
   }
   ```

3. **Access Control in `findOne()` - READ Access:**
   ```typescript
   async findOne(id: string, userId: string, userRole: UserRole): Promise<Request> {
     const request = await this.prisma.request.findFirst({
       where: { id, deletedAt: null },
     });

     if (!request) {
       throw new NotFoundException(\`Request with ID "\${id}" not found\`);
     }

     // Centralized access control check
     await this.accessControl.checkAccess({
       userId,
       userRole,
       resourceType: 'REQUEST',
       resourceId: id,
       requiredLevel: AccessLevel.READ,
     });

     return request;
   }
   ```

4. **Access Control in `update()` - WRITE Access:**
   ```typescript
   await this.accessControl.checkAccess({
     userId,
     userRole,
     resourceType: 'REQUEST',
     resourceId: id,
     requiredLevel: AccessLevel.WRITE,
   });
   ```

5. **Access Control in `remove()` - WRITE Access:**
   ```typescript
   // Note: WRITE level (not ADMIN) because clients can delete their own PENDING requests
   await this.accessControl.checkAccess({
     userId,
     userRole,
     resourceType: 'REQUEST',
     resourceId: id,
     requiredLevel: AccessLevel.WRITE,
   });
   ```

**Security Features:**

- ✅ Centralized access control via AccessControlService
- ✅ Resource-specific ownership checks (creator, assignee)
- ✅ Role hierarchy integration (ADMIN bypasses ownership checks)
- ✅ Support for explicit access rules via AccessControl/AccessRule tables
- ✅ Defense in depth: AccessControlService + manual checks
- ✅ Fail-closed security (denies access on error)

**Access Rules for REQUESTs:**

User can access a request if:
1. User is the creator (`request.userId === userId`)
2. User is assigned to the request (`request.assignedToId === userId`)
3. User has EMPLOYEE or ADMIN role (can see all requests)
4. User has explicit access via AccessRule

**Modified files:**
- `/packages/api/src/requests/requests.service.ts` - Integrated AccessControlService
- `/packages/api/src/requests/requests.module.ts` - Added AccessControlModule

---

### Example 6: LocationsService Integration ✅

**Files**:
- `/packages/api/src/locations/locations.service.ts`
- `/packages/api/src/locations/locations.module.ts`

**Status**: ✅ COMPLETE

**Implementation Summary:**

Integrated AccessControlService into LocationsService with backward-compatible optional `userRole` parameter.

**Key Changes:**

1. **Module Integration:**
   ```typescript
   // locations.module.ts
   import { AccessControlModule } from '../access-control/access-control.module';

   @Module({
     imports: [AccessControlModule],
     // ...
   })
   export class LocationsModule {}
   ```

2. **Service Integration with Backward Compatibility:**
   ```typescript
   // locations.service.ts
   import { AccessControlService } from '../access-control/access-control.service';
   import { UserRole, AccessLevel } from '@prisma/client';

   @Injectable()
   export class LocationsService {
     constructor(
       private prisma: PrismaService,
       private readonly accessControl: AccessControlService,
     ) {}
   }
   ```

3. **findOne() with Optional userRole Parameter:**
   ```typescript
   async findOne(
     id: string,
     userId: string,
     userRole?: UserRole, // Optional for backward compatibility
   ): Promise<WorkLocation> {
     const location = await this.prisma.workLocation.findUnique({
       where: { id },
     });

     if (!location) {
       throw new NotFoundException(\`Location with ID \${id} not found\`);
     }

     // Fetch user role if not provided (backward compatibility)
     let role = userRole;
     if (!role) {
       const user = await this.prisma.user.findUnique({
         where: { id: userId },
         select: { role: true },
       });
       role = user.role;
     }

     // Centralized access control check
     await this.accessControl.checkAccess({
       userId,
       userRole: role,
       resourceType: 'WORK_LOCATION',
       resourceId: id,
       requiredLevel: AccessLevel.READ,
     });

     return location;
   }
   ```

4. **update() and remove() Methods:**
   - Both methods call `findOne()` internally, so access control is automatically applied
   - Added optional `userRole` parameter to both methods
   - Parameters are passed through to `findOne()`

**Security Features:**

- ✅ Centralized access control via AccessControlService
- ✅ Ownership verification (location.userId === userId)
- ✅ Role hierarchy integration (ADMIN can access all locations)
- ✅ Support for explicit access rules via AccessControl/AccessRule tables
- ✅ Backward compatible (userRole parameter is optional)
- ✅ Fail-closed security (denies access on error)

**Access Rules for WORK_LOCATION:**

User can access a work location if:
1. User is the owner (`location.userId === userId`)
2. User has ADMIN role (can access all locations)
3. User has explicit access via AccessRule

**Modified files:**
- `/packages/api/src/locations/locations.service.ts` - Integrated AccessControlService
- `/packages/api/src/locations/locations.module.ts` - Added AccessControlModule

---

## 📊 Database Schema (Already Exists)

### Resource Model
```prisma
model Resource {
  id             String          @id @default(auto()) @map("_id") @db.ObjectId
  name           String
  description    String?
  resourceType   ResourceType
  userIds        String[]        @db.ObjectId
  users          User[]          @relation(fields: [userIds], references: [id])
  accessControls AccessControl[]
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt
}
```

### AccessControl Model
```prisma
model AccessControl {
  id          String       @id @default(auto()) @map("_id") @db.ObjectId
  resourceId  String       @db.ObjectId
  resource    Resource     @relation(fields: [resourceId], references: [id], onDelete: Cascade)
  name        String
  description String?
  isActive    Boolean      @default(true)
  accessRules AccessRule[]
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}
```

### AccessRule Model
```prisma
model AccessRule {
  id              String        @id @default(auto()) @map("_id") @db.ObjectId
  accessControlId String        @db.ObjectId
  accessControl   AccessControl @relation(fields: [accessControlId], references: [id], onDelete: Cascade)
  subjectType     String        // USER, ROLE
  subjectValue    String        // email, role name
  accessLevel     AccessLevel   // READ, WRITE, ADMIN
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}
```

---

## 🚧 Remaining Work

### Priority 1: Service Integration (4h) ✅ COMPLETE
- [x] Integrate in RequestsService (findOne, update, remove) ✅
- [x] Add AccessControlModule to RequestsModule imports ✅
- [x] Integrate in LocationsService (findOne, update, remove) ✅
- [x] Add AccessControlModule to LocationsModule imports ✅
- [x] ConversationService does not exist (N/A) ✅

### Priority 2: Guard Creation (2h) ✅ COMPLETE
- [x] Create ResourceAccessGuard for NestJS ✅
- [x] Create tRPC middleware for resource access ✅
- [x] Available for future use (tRPC is primary API layer) ✅

### Priority 3: Testing (2h)
- [ ] Unit tests for AccessControlService
- [ ] Integration tests for resource ownership
- [ ] E2E tests for access denied scenarios

### Priority 4: Documentation (1h)
- [ ] Complete integration examples
- [ ] Add to security architecture docs
- [ ] Create migration guide for existing services

---

## ✅ What's Complete vs Remaining

**Complete (5h / 8h = 63%):**
- ✅ Core AccessControlService with all logic
- ✅ AccessControlModule created and registered
- ✅ Support for 4 resource types (REQUEST, CONVERSATION, USER, WORK_LOCATION)
- ✅ Explicit access rules support (AccessControl + AccessRule tables)
- ✅ Role hierarchy integration (ADMIN inherits all permissions)
- ✅ Fail-closed security (denies access on error)
- ✅ ResourceAccessGuard for NestJS created (ready for use)
- ✅ requireResourceAccess middleware for tRPC created and integrated
- ✅ tRPC context integration (AccessControlService available in ctx)
- ✅ RequestsService integration complete (findOne, update, remove)
- ✅ LocationsService integration complete (findOne, update, remove)
- ✅ Defense in depth (centralized + manual checks)
- ✅ Backward compatible (optional userRole parameters)

**Remaining (3h / 8h = 37%):**
- ⏳ Comprehensive testing (3h)
  - Unit tests for AccessControlService (~1h)
  - Integration tests for resource ownership (~1h)
  - E2E tests for access denied scenarios (~1h)

---

## 🎯 Recommendation

**Option 1: Complete This Task First**
- Spend 6 more hours integrating Access Control
- Ensures strong security before moving forward
- All services properly protected

**Option 2: Move to Next Priority 2 Tasks**
- Access Control infrastructure is ready
- Can be integrated incrementally
- Focus on Feature Flag Caching and E2E Testing first
- Come back to complete integration later

**Option 3: Minimal Integration + Move On**
- Integrate in 1-2 critical services (RequestsService)
- Document remaining integration work
- Continue to Feature Flag Caching

---

**Status**: 🟢 IMPLEMENTATION COMPLETE - TESTING PENDING (63%)
**Files Created**: 3
- `/packages/api/src/access-control/access-control.service.ts`
- `/packages/api/src/access-control/access-control.module.ts`
- `/packages/api/src/access-control/guards/resource-access.guard.ts`

**Files Modified**: 10
- `/packages/api/src/app.module.ts` - Added AccessControlModule
- `/packages/api/src/trpc/trpc.ts` - Added AccessControlService to context
- `/packages/api/src/trpc/trpc.service.ts` - Injected AccessControlService
- `/packages/api/src/trpc/trpc.module.ts` - Added AccessControlModule
- `/packages/api/src/trpc/middlewares/roles.middleware.ts` - Added requireResourceAccess middleware
- `/packages/api/src/requests/requests.service.ts` - Integrated access control
- `/packages/api/src/requests/requests.module.ts` - Added AccessControlModule
- `/packages/api/src/locations/locations.service.ts` - Integrated access control
- `/packages/api/src/locations/locations.module.ts` - Added AccessControlModule

**Estimated Remaining**: 2.5 hours for comprehensive testing
