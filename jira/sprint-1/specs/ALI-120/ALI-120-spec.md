# ALI-120: Notifications System - Technical Specification

**Status**: ✅ COMPLETE (100% Implemented)
**Jira**: [ALI-120](https://alkitu.atlassian.net/browse/ALI-120)
**Version**: 1.0
**Last Updated**: 2025-12-26

---

## Overview

Multi-channel notification system for request lifecycle events with real-time delivery via WebSocket, browser push notifications, and in-app notification center. Supports user preferences, quiet hours, and comprehensive analytics.

### Key Features

✅ **Multi-Channel Delivery**: In-app, WebSocket (real-time), Push notifications
✅ **Request Lifecycle Integration**: Automatic notifications for 6 request events
✅ **User Preferences**: Per-type notification settings and quiet hours
✅ **Analytics Dashboard**: Usage statistics and trends for admin
✅ **Role-Based Notifications**: Different recipients based on action and role
✅ **Type-Safe Architecture**: Zod validation and TypeScript types throughout
✅ **Performance Optimized**: Infinite scroll, pagination, bulk operations

---

## Database Schema

### Notification Model

```prisma
enum NotificationType {
  // Generic (6 types)
  INFO
  WARNING
  ERROR
  SUCCESS
  CHAT_NEW_CONVERSATION
  CHAT_NEW_MESSAGE

  // Request Lifecycle (6 types)
  REQUEST_CREATED
  REQUEST_ASSIGNED
  REQUEST_STATUS_CHANGED
  REQUEST_CANCELLATION_REQUESTED
  REQUEST_CANCELLED
  REQUEST_COMPLETED
}

model Notification {
  id        String           @id @default(auto()) @map("_id") @db.ObjectId
  userId    String           @db.ObjectId
  user      User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  message   String
  type      NotificationType @default(INFO)
  link      String?
  data      Json?            // Structured payload: RequestNotificationData | GenericData
  read      Boolean          @default(false)
  createdAt DateTime         @default(now())
  updatedAt DateTime         @updatedAt

  @@index([userId])
  @@index([type])
  @@index([read])
  @@map("notifications")
}
```

### NotificationPreference Model

```prisma
model NotificationPreference {
  id                 String   @id @default(auto()) @map("_id") @db.ObjectId
  userId             String   @unique @db.ObjectId
  user               User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Channel preferences
  emailEnabled       Boolean  @default(true)
  pushEnabled        Boolean  @default(true)
  inAppEnabled       Boolean  @default(true)

  // Type-specific preferences
  emailTypes         String[] // Which types trigger email
  pushTypes          String[] // Which types trigger push

  // Quiet hours
  quietHoursEnabled  Boolean  @default(false)
  quietHoursStart    String?  // "22:00"
  quietHoursEnd      String?  // "08:00"

  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  @@map("notification_preferences")
}
```

### PushSubscription Model

```prisma
model PushSubscription {
  id         String   @id @default(auto()) @map("_id") @db.ObjectId
  userId     String   @db.ObjectId
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  endpoint   String   @unique
  keys       Json     // { p256dh, auth }
  createdAt  DateTime @default(now())

  @@index([userId])
  @@map("push_subscriptions")
}
```

---

## Notification Data Structures

### RequestNotificationData

```typescript
interface RequestNotificationData {
  requestId: string;               // Required
  serviceId?: string;
  serviceName?: string;
  clientId?: string;
  clientName?: string;
  employeeId?: string;
  employeeName?: string;
  previousStatus?: RequestStatus;
  newStatus?: RequestStatus;
  cancellationReason?: string;
  completionNotes?: string;
}
```

### Builder Pattern Output

```typescript
interface CreateNotificationDto {
  userId: string;
  type: NotificationType;
  message: string;
  link?: string;
  data?: RequestNotificationData | Record<string, unknown>;
}
```

---

## Backend API

### NotificationService Methods

**Core Operations**:
- `createNotification(dto: CreateNotificationDto): Promise<Notification>`
- `getNotifications(userId: string): Promise<Notification[]>`
- `markAsRead(notificationId: string): Promise<Notification>`
- `markAllAsRead(userId: string): Promise<{ count: number }>`
- `deleteNotification(notificationId: string): Promise<void>`
- `getUnreadCount(userId: string): Promise<number>`

**Advanced Features**:
- `getNotificationsWithFilters(userId, filters): Promise<PaginatedNotifications>`
- `exportNotifications(userId, filters): Promise<NotificationExport>`
- `getNotificationAnalytics(userId, days): Promise<NotificationAnalytics>`
- `bulkMarkAsRead(userId, notificationIds): Promise<BulkResult>`
- `bulkDelete(userId, notificationIds): Promise<BulkResult>`

**Multi-Channel**:
- `sendMultiChannelNotification(userId, notification): Promise<void>`
  - In-app storage (always)
  - WebSocket real-time (if online)
  - Push notification (if offline + enabled)

**Preferences**:
- `getUserPreferences(userId): Promise<NotificationPreference | null>`
- `updatePreferences(userId, dto): Promise<NotificationPreference>`
- `shouldSendNotification(userId, type, channel): Promise<boolean>`
- `isInQuietHours(userId): Promise<boolean>`

**Push Subscriptions**:
- `subscribeToPush(userId, subscription): Promise<PushSubscription>`
- `unsubscribeFromPush(userId, endpoint): Promise<void>`
- `sendPushNotification(userId, notification): Promise<void>`

### RequestNotificationBuilder (Static Factory)

**File**: `packages/api/src/requests/builders/request-notification.builder.ts`

**Methods**:

```typescript
class RequestNotificationBuilder {
  // Request created (2 variants)
  static buildCreatedNotification(
    request: RequestWithRelations,
    recipient: 'client' | 'admin'
  ): CreateNotificationDto;

  // Request assigned (2 variants)
  static buildAssignedNotification(
    request: RequestWithRelations,
    recipient: 'employee' | 'client'
  ): CreateNotificationDto;

  // Cancellation requested (2 variants)
  static buildCancellationRequestedNotification(
    request: RequestWithRelations,
    reason: string,
    recipient: 'admin' | 'employee'
  ): CreateNotificationDto;

  // Request cancelled
  static buildCancelledNotification(
    request: RequestWithRelations
  ): CreateNotificationDto;

  // Request completed
  static buildCompletedNotification(
    request: RequestWithRelations,
    completionNotes?: string
  ): CreateNotificationDto;
}
```

**Example Usage**:

```typescript
// In RequestsService.create()
const clientNotif = RequestNotificationBuilder.buildCreatedNotification(request, 'client');
await this.notificationService.createNotification(clientNotif);

const adminIds = await this.getAdminUserIds();
const adminNotif = RequestNotificationBuilder.buildCreatedNotification(request, 'admin');
await Promise.all(
  adminIds.map(adminId =>
    this.notificationService.createNotification({ ...adminNotif, userId: adminId })
  )
);
```

### tRPC Router

**File**: `packages/api/src/trpc/routers/notification.router.ts`

**17 Endpoints**:

```typescript
notificationRouter = {
  // Basic CRUD
  getNotifications: procedure.input(z.object({ userId })).query(),
  markAsRead: procedure.input(z.object({ notificationId })).mutation(),
  deleteNotification: procedure.input(z.object({ notificationId })).mutation(),
  getUnreadCount: procedure.input(z.object({ userId })).query(),
  markAllAsRead: procedure.input(z.object({ userId })).mutation(),

  // Advanced Filtering
  getNotificationsWithFilters: procedure.input(FilterSchema).query(),
  exportNotifications: procedure.input(ExportSchema).query(),
  getNotificationAnalytics: procedure.input(AnalyticsSchema).query(),

  // Bulk Operations
  bulkMarkAsRead: procedure.input(BulkSchema).mutation(),
  bulkDelete: procedure.input(BulkSchema).mutation(),

  // Preferences
  getPreferences: procedure.input(z.object({ userId })).query(),
  updatePreferences: procedure.input(PreferencesSchema).mutation(),

  // Push Subscriptions
  subscribeToPush: procedure.input(SubscriptionSchema).mutation(),
  unsubscribeFromPush: procedure.input(z.object({ userId, endpoint })).mutation(),
  getPushSubscriptions: procedure.input(z.object({ userId })).query(),

  // Pagination
  getNotificationsPaginated: procedure.input(PaginationSchema).query(),
  getInfiniteNotifications: procedure.input(InfiniteSchema).query(),
};
```

---

## Frontend Architecture

### Pages

**Admin Notifications** (`/admin/notifications`):
- Full analytics dashboard with charts
- Notification analytics component
- Filters: All, Unread, Read, Type
- Bulk operations (mark as read, delete)
- Export functionality
- Infinite scroll with performance mode toggle
- Real-time WebSocket updates

**Client Notifications** (`/client/notifications`):
- Simple notification center
- Display request notifications with service name
- Navigate to request on click
- Mark as read, delete
- Filters: All, Unread, Read

**Employee Notifications** (`/employee/notifications`):
- Urgent notifications filter (REQUEST_ASSIGNED, REQUEST_CANCELLATION_REQUESTED)
- Urgent count badge
- Visual indicators for urgent unread (orange border)
- Client context (client name, cancellation reason)
- Quick actions ("Atender Ahora" button)

### Component Structure

**Atoms**:
- `<NotificationBadge />` - Unread count badge

**Molecules**:
- `<NotificationCard />` - Individual notification display
- `<NotificationSkeleton />` - Loading states

**Organisms**:
- `<NotificationFilters />` - Filter controls (status, type, date range, search)
- `<BulkActions />` - Bulk mark as read, bulk delete
- `<NotificationAnalytics />` - Admin analytics dashboard
- `<EnhancedPagination />` - Pagination with infinite scroll

### State Management

**Zustand Store**: `useNotificationFiltersStore`

```typescript
interface NotificationFiltersState {
  search: string;
  types: string[];
  status: 'all' | 'read' | 'unread';
  dateFrom?: Date;
  dateTo?: Date;
  sortBy: 'newest' | 'oldest' | 'type';
  setSearch: (search: string) => void;
  setTypes: (types: string[]) => void;
  setStatus: (status: 'all' | 'read' | 'unread') => void;
  setDateRange: (from?: Date, to?: Date) => void;
  setSortBy: (sortBy: string) => void;
  reset: () => void;
}
```

**tRPC Integration**:

```typescript
// Queries
const { data: notifications } = trpc.notification.getNotifications.useQuery({ userId });
const { data: unreadCount } = trpc.notification.getUnreadCount.useQuery({ userId });
const { data: analytics } = trpc.notification.getNotificationAnalytics.useQuery({ userId, days: 30 });

// Mutations
const markAsRead = trpc.notification.markAsRead.useMutation();
const deleteNotif = trpc.notification.deleteNotification.useMutation();
const bulkMarkAsRead = trpc.notification.bulkMarkAsRead.useMutation();
```

**WebSocket Hook**: `useWebSocket`

```typescript
const { isConnected, lastMessage } = useWebSocket();

useEffect(() => {
  if (lastMessage?.type === 'notification:new') {
    refetchNotifications(); // Real-time update
  }
}, [lastMessage]);
```

---

## Notification Triggers

### Request Lifecycle Integration

**File**: `packages/api/src/requests/requests.service.ts`

**5 Trigger Points**:

1. **After Request Creation** (line ~150):
   - → CLIENT: "Your request for {serviceName} has been created"
   - → ADMINs: "New request from {clientName} for {serviceName}"

2. **After Request Assignment** (line ~703):
   - → EMPLOYEE: "You have been assigned to {serviceName} request"
   - → CLIENT: "Your request has been assigned to {employeeName}"

3. **After Cancellation Request** (line ~823):
   - **PENDING**: Auto-approved → CLIENT: "Your request has been cancelled"
   - **ONGOING**: Requires approval → ADMIN + EMPLOYEE: "Client requested cancellation: {reason}"

4. **After Status Change**:
   - Handled by REQUEST_STATUS_CHANGED type

5. **After Completion** (line ~947):
   - → CLIENT: "Your request has been completed. Notes: {completionNotes}"

**Error Handling**: Try-catch blocks ensure notification failures don't block main operations.

---

## Internationalization

**Files**:
- `packages/web/src/locales/en/common.json`
- `packages/web/src/locales/es/common.json`

**Structure**:

```json
{
  "notifications": {
    "types": {
      "REQUEST_CREATED": {
        "label": "Request Created | Solicitud Creada",
        "description": "New service request | Nueva solicitud de servicio"
      },
      "REQUEST_ASSIGNED": {
        "label": "Request Assigned | Solicitud Asignada",
        "description": "Request assigned to employee | Solicitud asignada a empleado"
      }
      // ... 10 more types
    }
  }
}
```

---

## Testing

### Test Coverage Summary

| Category | Tests | Status |
|----------|-------|--------|
| Builder Unit Tests | 25 | ✅ 100% passing |
| Service Integration Tests | 77 | ✅ 100% passing |
| Schema Validation Tests | 33 | ✅ 100% passing |
| E2E Tests (Playwright) | 15 | ✅ Complete |
| **TOTAL** | **150** | ✅ **100% passing** |

### Key Test Files

- `request-notification.builder.spec.ts` - Builder pattern tests
- `requests.service.spec.ts` - Integration with RequestsService
- `notification.spec.ts` - Zod schema validation
- `ali-120-notifications.spec.ts` - E2E notification flows

---

## Security Considerations

**Authorization**:
- ✅ Users can only access their own notifications (userId filter)
- ✅ tRPC procedures validate userId matches authenticated user
- ✅ Bulk operations scoped to current user

**Data Validation**:
- ✅ All DTOs validated with Zod schemas
- ✅ RequestNotificationData schema ensures valid data
- ✅ NotificationType enum prevents invalid types

**Privacy**:
- ✅ Soft deletes not implemented (hard delete on request)
- ✅ Notification data contains only necessary context
- ✅ Push subscriptions tied to user, deleted on logout

---

## Performance Optimizations

**Backend**:
- Database indexes on `userId`, `type`, `read` for fast filtering
- Bulk operations use `updateMany` for efficiency
- Quiet hours checked before sending push (avoid unnecessary sends)

**Frontend**:
- Infinite scroll with cursor-based pagination
- Performance mode toggle (disable animations)
- React.memo on NotificationCard for rendering optimization
- Debounced search input (300ms)
- Optimistic updates for mark as read

---

## Integration Points

### ALI-119 (Requests)
- RequestsService triggers notifications on all lifecycle events
- Builder pattern creates type-safe notifications
- Notification data includes request context

### ALI-121 (Email Templates) - Future
- Email channel can leverage notification messages
- Trigger emails based on notification events
- Reuse RequestNotificationData for email context

### WebSocket Gateway
- Real-time notification delivery to online users
- NotificationService.setNotificationGateway() integration
- Graceful fallback if user offline

---

## References

- [Implementation Complete Doc](./ALI-120-IMPLEMENTATION-COMPLETE.md)
- [Backend Review](./ALI-120-backend-review.md)
- [Frontend Review](./ALI-120-frontend-review.md)
- [Final Verification](./ALI-120-final-verification.md)

---

**Version**: 1.0
**Last Updated**: 2025-12-26
