# ALI-122: Integration Guide - System Connections

## Overview

This document details how the Users & Roles Management system integrates with other modules (ALI-115, 116, 117, 119, 120).

## Integration with ALI-115 (Authentication)

### User Registration Flow

```
1. POST /auth/register
   ↓
2. UserFacadeService.create()
   - Create User (role=CLIENT, profileComplete=false, emailVerified=false)
   ↓
3. EmailService.sendVerificationEmail()
   ↓
4. User clicks email link
   ↓
5. POST /auth/verify-email
   - Update User.emailVerified = true
   ↓
6. Redirect to /onboarding (if profileComplete=false)
```

### Login Flow with Role Check

```
1. POST /auth/login (email, password)
   ↓
2. UserAuthenticationService.validatePassword()
   ↓
3. Check User.status (must be ACTIVE)
   ↓
4. Generate JWT with payload:
   {
     sub: user.id,
     email: user.email,
     role: user.role,
     profileComplete: user.profileComplete
   }
   ↓
5. Frontend middleware checks:
   - If profileComplete=false → redirect to /onboarding
   - Else → redirect to role-based dashboard
```

### Password Reset Integration

```
1. POST /auth/forgot-password (email)
   ↓
2. UserRepositoryService.findByEmail()
   ↓
3. Generate reset token
   ↓
4. EmailService.sendPasswordResetEmail()
   ↓
5. User clicks link → POST /auth/reset-password
   ↓
6. UserAuthenticationService.resetPassword()
```

## Integration with ALI-116 (Profile Management)

### Profile Completion Flow

```
1. User logs in with profileComplete=false
   ↓
2. Middleware redirects to /onboarding
   ↓
3. OnboardingFormOrganism collects:
   - firstname, lastname, phone, company
   - address (if CLIENT)
   - contactPerson (if CLIENT)
   ↓
4. POST /auth/complete-profile
   ↓
5. UserFacadeService.update()
   - Update User fields
   - Set profileComplete = true
   ↓
6. Redirect to dashboard
```

### Role-Based Profile Fields

**CLIENT Profile**:
```typescript
{
  firstname,
  lastname,
  email,
  phone,
  company,
  address,        // CLIENT only
  contactPerson   // CLIENT only
}
```

**EMPLOYEE/ADMIN Profile**:
```typescript
{
  firstname,
  lastname,
  email,
  phone,
  company
  // No address or contactPerson
}
```

### Field Filtering in API

```typescript
async getProfile(userId: string, currentUser: JwtPayload) {
  const user = await this.findById(userId);

  // Filter fields based on role
  if (currentUser.role === 'CLIENT') {
    return user; // Return all fields
  } else {
    // Exclude CLIENT-specific fields
    const { address, contactPerson, ...profile } = user;
    return profile;
  }
}
```

## Integration with ALI-117 (Work Locations)

### User-Location Relationship

```prisma
model User {
  id        String         @id
  locations WorkLocation[] @relation("UserLocations")
}

model WorkLocation {
  id     String @id
  user   User   @relation("UserLocations", fields: [userId], references: [id])
  userId String
}
```

### Location Access Control

```typescript
// CLIENTs can create their own locations
async createLocation(dto: CreateLocationDto, userId: string) {
  return this.prisma.workLocation.create({
    data: {
      ...dto,
      userId // Associate with current user
    }
  });
}

// ADMINs can view all locations
async getAllLocations(currentUser: JwtPayload) {
  if (currentUser.role === 'ADMIN') {
    return this.prisma.workLocation.findMany(); // All locations
  } else {
    return this.prisma.workLocation.findMany({
      where: { userId: currentUser.id } // Own locations only
    });
  }
}
```

### Location Deletion Impact

When deleting a user:
```typescript
async deleteUser(userId: string) {
  // Option 1: Cascade delete locations
  await this.prisma.workLocation.deleteMany({ where: { userId } });
  await this.prisma.user.update({
    where: { id: userId },
    data: { deletedAt: new Date() }
  });

  // Option 2: Reassign to another user (if needed)
  // Not typical for CLIENT locations
}
```

## Integration with ALI-119 (Requests)

### User-Request Relationships

```prisma
model User {
  id               String    @id
  requests         Request[] @relation("UserRequests")         // Created by
  assignedRequests Request[] @relation("RequestAssignedEmployee") // Assigned to
}

model Request {
  id           String  @id
  user         User    @relation("UserRequests", fields: [userId], references: [id])
  userId       String
  assignedTo   User?   @relation("RequestAssignedEmployee", fields: [assignedToId], references: [id])
  assignedToId String?
}
```

### Request Creation (CLIENT)

```typescript
async createRequest(dto: CreateRequestDto, userId: string) {
  // Verify user is CLIENT
  const user = await this.userService.findById(userId);
  if (user.role !== 'CLIENT') {
    throw new ForbiddenException('Only clients can create requests');
  }

  return this.prisma.request.create({
    data: {
      ...dto,
      userId,
      status: 'PENDING'
    }
  });
}
```

### Request Assignment (ADMIN)

```typescript
async assignRequest(requestId: string, employeeId: string) {
  // Verify employee exists and has EMPLOYEE role
  const employee = await this.userService.findById(employeeId);
  if (employee.role !== 'EMPLOYEE') {
    throw new BadRequestException('Can only assign to employees');
  }

  return this.prisma.request.update({
    where: { id: requestId },
    data: {
      assignedToId: employeeId,
      status: 'ONGOING'
    }
  });
}
```

### Role-Based Request Filtering

```typescript
async getRequests(currentUser: JwtPayload) {
  const where: Prisma.RequestWhereInput = { deletedAt: null };

  if (currentUser.role === 'CLIENT') {
    where.userId = currentUser.id; // Own requests only
  } else if (currentUser.role === 'EMPLOYEE') {
    where.assignedToId = currentUser.id; // Assigned requests only
  }
  // ADMIN sees all (no filter)

  return this.prisma.request.findMany({ where });
}
```

### User Deletion Impact on Requests

```typescript
async deleteUser(userId: string) {
  // Check if user has active requests
  const activeRequests = await this.prisma.request.count({
    where: {
      OR: [
        { userId, status: { in: ['PENDING', 'ONGOING'] } },
        { assignedToId: userId, status: 'ONGOING' }
      ]
    }
  });

  if (activeRequests > 0) {
    throw new BadRequestException(
      'Cannot delete user with active requests. Reassign or cancel them first.'
    );
  }

  // Soft delete user
  await this.prisma.user.update({
    where: { id: userId },
    data: { deletedAt: new Date() }
  });
}
```

## Integration with ALI-120 (Notifications)

### User Events Publishing

```typescript
@Injectable()
export class UserEventsService {
  constructor(private readonly notificationService: NotificationService) {}

  async publishUserCreated(user: User) {
    await this.notificationService.createNotification({
      userId: user.id,
      type: 'INFO',
      message: `Welcome to Alkitu, ${user.firstname}!`,
      link: '/profile',
      data: { event: 'USER_CREATED' }
    });
  }

  async publishRoleChanged(user: User, oldRole: Role, newRole: Role) {
    await this.notificationService.createNotification({
      userId: user.id,
      type: 'WARNING',
      message: `Your role has been changed from ${oldRole} to ${newRole}`,
      data: { oldRole, newRole }
    });
  }

  async publishStatusChanged(user: User, newStatus: UserStatus) {
    if (newStatus === 'SUSPENDED') {
      await this.notificationService.createNotification({
        userId: user.id,
        type: 'ERROR',
        message: 'Your account has been suspended. Contact support for details.',
        data: { status: 'SUSPENDED' }
      });
    } else if (newStatus === 'ACTIVE') {
      await this.notificationService.createNotification({
        userId: user.id,
        type: 'SUCCESS',
        message: 'Your account has been reactivated!',
        data: { status: 'ACTIVE' }
      });
    }
  }
}
```

### Notification Preferences by Role

```typescript
// Default notification preferences based on role
async setDefaultPreferences(userId: string, role: Role) {
  const defaults = {
    CLIENT: {
      emailEnabled: true,
      emailTypes: ['REQUEST_CREATED', 'REQUEST_STATUS_CHANGED'],
      pushEnabled: true
    },
    EMPLOYEE: {
      emailEnabled: true,
      emailTypes: ['REQUEST_ASSIGNED', 'REQUEST_STATUS_CHANGED'],
      pushEnabled: true
    },
    ADMIN: {
      emailEnabled: true,
      emailTypes: ['REQUEST_CANCELLATION_REQUESTED', 'USER_CREATED'],
      pushEnabled: false
    }
  };

  await this.notificationService.createOrUpdatePreferences(userId, defaults[role]);
}
```

## Data Flow Diagrams

### Complete User Registration

```
User submits form
    ↓
Frontend validates
    ↓
POST /auth/register
    ↓
Backend validates (Zod schema)
    ↓
UserFacadeService.create()
    ├─ UserAuthenticationService.hashPassword()
    ├─ UserRepositoryService.create()
    ├─ EmailService.sendVerificationEmail()
    └─ UserEventsService.publishUserCreated()
           └─ NotificationService.createNotification()
    ↓
Return User (without password)
    ↓
Frontend redirects to verification page
```

### User Role Change by Admin

```
Admin changes role in UI
    ↓
PUT /users/:id
    ↓
RolesGuard verifies ADMIN
    ↓
UserFacadeService.changeRole()
    ├─ Validate: not own account
    ├─ Validate: keep at least one ADMIN
    ├─ UserRepositoryService.update()
    ├─ UserEventsService.publishRoleChanged()
    │     └─ NotificationService.createNotification()
    └─ Update user's JWT claims (next login)
    ↓
Return updated User
    ↓
Frontend invalidates cache
```

## Event Publishing

### User Lifecycle Events

```typescript
export enum UserEvent {
  CREATED = 'user.created',
  UPDATED = 'user.updated',
  DELETED = 'user.deleted',
  ROLE_CHANGED = 'user.role_changed',
  STATUS_CHANGED = 'user.status_changed',
  PASSWORD_RESET = 'user.password_reset',
  EMAIL_VERIFIED = 'user.email_verified'
}
```

### Event Subscribers

Other modules can subscribe to user events:

```typescript
@Injectable()
export class RequestsEventHandler {
  @OnEvent('user.deleted')
  async handleUserDeleted(payload: { userId: string }) {
    // Reassign or cancel user's requests
    await this.requestsService.handleUserDeleted(payload.userId);
  }

  @OnEvent('user.role_changed')
  async handleRoleChanged(payload: { userId: string, newRole: Role }) {
    if (payload.newRole !== 'CLIENT') {
      // Cancel pending client requests
      await this.requestsService.cancelUserRequests(payload.userId);
    }
  }
}
```

## References

- [ALI-115 Auth Spec](../ALI-115/ALI-115-auth-spec.md)
- [ALI-116 Profile Spec](../ALI-116/ALI-116-final-spec.md)
- [ALI-117 Locations Spec](../ALI-117/ALI-117-final-spec.md)
- [ALI-119 Requests Spec](../ALI-119/ALI-119-spec.md)
- [ALI-120 Notifications Spec](../ALI-120/ALI-120-spec.md)

---

**Version**: 1.0
**Last Updated**: 2025-12-26
