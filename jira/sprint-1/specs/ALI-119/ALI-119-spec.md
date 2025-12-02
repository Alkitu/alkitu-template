# ALI-119: Service Requests Lifecycle & Assignment - Technical Specification

## Issue Information
- **Jira Issue**: ALI-119
- **Type**: Task
- **Priority**: Medium
- **Status**: Discovery
- **Sprint**: Sprint 1 (37)
- **Created**: 2025-11-18
- **Updated**: 2025-12-01

## Overview

Este issue implementa el núcleo central del sistema: el modelo Request que representa las solicitudes de servicio creadas por clientes, su asignación a empleados, y su ciclo de vida completo desde PENDING hasta COMPLETED/CANCELLED.

## Database Schema

### RequestStatus Enum

```prisma
enum RequestStatus {
  PENDING    // Request created, waiting for assignment/execution
  ONGOING    // Request assigned and in progress
  COMPLETED  // Request finished successfully
  CANCELLED  // Request cancelled by client or admin
}
```

### Request Model

```prisma
model Request {
  id                      String         @id @default(auto()) @map("_id") @db.ObjectId

  // === Relationships ===

  // Cliente que crea la solicitud
  user                    User           @relation("UserRequests", fields: [userId], references: [id])
  userId                  String         @db.ObjectId

  // Servicio solicitado (del catálogo ALI-118)
  service                 Service        @relation("ServiceRequests", fields: [serviceId], references: [id])
  serviceId               String         @db.ObjectId

  // Ubicación de trabajo donde se ejecutará
  location                WorkLocation   @relation(fields: [locationId], references: [id])
  locationId              String         @db.ObjectId

  // Empleado asignado para ejecutar el servicio (opcional, asignado por admin)
  assignedTo              User?          @relation("RequestAssignedEmployee", fields: [assignedToId], references: [id])
  assignedToId            String?        @db.ObjectId

  // === Request Data ===

  // Fecha y hora programada para la ejecución
  executionDateTime       DateTime

  // Respuestas del cliente al requestTemplate del servicio
  // Formato: { [fieldId]: value }
  // Ejemplo: { "issue_description": "Faucet is leaking", "urgency": "high" }
  templateResponses       Json

  // Nota del empleado al completar (texto + fotos)
  // Formato: { text: string, photos?: string[] }
  note                    Json?

  // === Lifecycle & Status ===

  // Estado actual del request
  status                  RequestStatus  @default(PENDING)

  // Cliente solicita cancelación (admin debe aprobar)
  cancellationRequested   Boolean        @default(false)
  cancellationRequestedAt DateTime?

  // Fecha de finalización (cuando status cambia a COMPLETED)
  completedAt             DateTime?

  // === Soft Delete & Audit (patrón ALI-118) ===

  deletedAt               DateTime?
  createdBy               String?        @db.ObjectId  // userId del cliente que creó
  updatedBy               String?        @db.ObjectId  // userId del último que modificó

  // === Timestamps ===

  createdAt               DateTime       @default(now())
  updatedAt               DateTime       @updatedAt

  // === Indexes for Performance ===

  @@index([userId])              // Queries: "my requests" (client view)
  @@index([assignedToId])        // Queries: "my assigned tasks" (employee view)
  @@index([serviceId])           // Queries: requests by service type
  @@index([locationId])          // Queries: requests by location
  @@index([status])              // Queries: filter by status
  @@index([executionDateTime])   // Queries: calendar view, scheduled tasks
  @@index([deletedAt])           // Exclude soft-deleted

  @@map("requests")
}
```

### Relations in Existing Models

**User Model** (updates):
```prisma
model User {
  // ... existing fields ...

  // Cliente: requests que ha creado
  requests          Request[] @relation("UserRequests")

  // Empleado: requests que le han asignado
  assignedRequests  Request[] @relation("RequestAssignedEmployee")
}
```

**Service Model** (updates):
```prisma
model Service {
  // ... existing fields ...

  // Requests que han solicitado este servicio
  requests  Request[] @relation("ServiceRequests")
}
```

**WorkLocation Model** (updates):
```prisma
model WorkLocation {
  // ... existing fields ...

  // Requests programados en esta ubicación
  requests  Request[] @relation("WorkLocationRequests")
}
```

## State Machine

### Status Transitions

```
┌─────────┐
│ PENDING │ ◄─── Initial state (on creation)
└────┬────┘
     │
     ├──► ONGOING ───► COMPLETED (employee completes)
     │                      ▲
     │                      │
     └──────────────────────┴─► CANCELLED
         (client requests,
          admin approves)
```

### Valid Transitions

| From | To | Who Can Trigger | Conditions |
|------|----|-----------------| ------------|
| PENDING | ONGOING | Admin | assignedToId must be set |
| PENDING | CANCELLED | Admin | - |
| ONGOING | COMPLETED | Employee (assigned) or Admin | Must have note |
| ONGOING | CANCELLED | Admin | - |
| COMPLETED | - | - | Final state |
| CANCELLED | - | - | Final state |

### Business Rules

1. **Creation**: Only CLIENTs can create requests
2. **Assignment**: Only ADMINs can assign employees
3. **Completion**: Only assigned EMPLOYEE or ADMIN can complete
4. **Cancellation Request**: CLIENT can request, ADMIN must approve
5. **Status Changes**: Only ADMIN can manually change status
6. **Soft Delete**: Only ADMIN can soft delete

## API Endpoints

### Public Endpoints (Authenticated)

#### Create Request (CLIENT only)
```
POST /requests
Authorization: Bearer {jwt}
Content-Type: application/json

Request Body:
{
  "serviceId": "64a1b2c3d4e5f6g7h8i9j0k1",
  "locationId": "64a1b2c3d4e5f6g7h8i9j0k2",
  "executionDateTime": "2025-12-15T10:00:00Z",
  "templateResponses": {
    "issue_description": "Faucet is leaking in bathroom",
    "urgency": "high",
    "preferred_contact": "phone"
  }
}

Response: 201 Created
{
  "id": "64a1b2c3d4e5f6g7h8i9j0k3",
  "userId": "current-user-id",
  "serviceId": "64a1b2c3d4e5f6g7h8i9j0k1",
  "locationId": "64a1b2c3d4e5f6g7h8i9j0k2",
  "status": "PENDING",
  "executionDateTime": "2025-12-15T10:00:00Z",
  "templateResponses": { ... },
  "cancellationRequested": false,
  "createdAt": "2025-12-01T14:30:00Z",
  "updatedAt": "2025-12-01T14:30:00Z"
}
```

#### List Requests (Role-based filtering)
```
GET /requests?status=PENDING&limit=20&offset=0
Authorization: Bearer {jwt}

Filters (all optional):
- status: RequestStatus
- limit: number (default: 20)
- offset: number (default: 0)

Role-based behavior:
- CLIENT: Returns only own requests (userId)
- EMPLOYEE: Returns assigned requests (assignedToId)
- ADMIN: Returns all requests

Response: 200 OK
{
  "data": [
    {
      "id": "...",
      "status": "PENDING",
      "service": { "id": "...", "name": "Plumbing Repair" },
      "location": { "id": "...", "street": "123 Main St" },
      "user": { "id": "...", "name": "John Doe" },
      "assignedTo": null,
      "executionDateTime": "2025-12-15T10:00:00Z",
      "createdAt": "2025-12-01T14:30:00Z"
    }
  ],
  "total": 42,
  "limit": 20,
  "offset": 0
}
```

#### Get Request Detail
```
GET /requests/:id
Authorization: Bearer {jwt}

Authorization:
- CLIENT: Can only access own requests
- EMPLOYEE: Can only access assigned requests
- ADMIN: Can access all requests

Response: 200 OK
{
  "id": "64a1b2c3d4e5f6g7h8i9j0k3",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "service": {
    "id": "...",
    "name": "Plumbing Repair",
    "category": { "name": "Plumbing" }
  },
  "location": {
    "id": "...",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY"
  },
  "assignedTo": {
    "id": "...",
    "name": "Jane Smith"
  },
  "executionDateTime": "2025-12-15T10:00:00Z",
  "templateResponses": { ... },
  "note": null,
  "status": "ONGOING",
  "cancellationRequested": false,
  "completedAt": null,
  "createdAt": "2025-12-01T14:30:00Z",
  "updatedAt": "2025-12-05T09:15:00Z"
}
```

#### Request Cancellation (CLIENT only)
```
PUT /requests/:id/cancel
Authorization: Bearer {jwt}

Authorization:
- Must be the request owner (userId)
- Request must be PENDING or ONGOING

Response: 200 OK
{
  "id": "64a1b2c3d4e5f6g7h8i9j0k3",
  "status": "ONGOING",
  "cancellationRequested": true,
  "cancellationRequestedAt": "2025-12-10T11:00:00Z"
}
```

#### Complete Request (EMPLOYEE or ADMIN)
```
PUT /requests/:id/complete
Authorization: Bearer {jwt}
Content-Type: application/json

Request Body:
{
  "note": {
    "text": "Fixed the faucet. Replaced the washer.",
    "photos": ["https://cdn.example.com/photo1.jpg", "https://cdn.example.com/photo2.jpg"]
  }
}

Authorization:
- EMPLOYEE: Must be assigned to this request
- ADMIN: Can complete any request

Response: 200 OK
{
  "id": "64a1b2c3d4e5f6g7h8i9j0k3",
  "status": "COMPLETED",
  "note": { ... },
  "completedAt": "2025-12-15T11:30:00Z",
  "updatedAt": "2025-12-15T11:30:00Z"
}
```

### Admin Endpoints

#### Update Request (ADMIN only)
```
PUT /requests/:id
Authorization: Bearer {jwt}
Content-Type: application/json

Request Body (all optional):
{
  "assignedToId": "64a1b2c3d4e5f6g7h8i9j0k4",
  "executionDateTime": "2025-12-16T14:00:00Z"
}

Response: 200 OK
```

#### Assign Employee (ADMIN only)
```
PUT /requests/:id/assign
Authorization: Bearer {jwt}
Content-Type: application/json

Request Body:
{
  "employeeId": "64a1b2c3d4e5f6g7h8i9j0k4"
}

Validation:
- Employee must exist
- Employee must have EMPLOYEE role
- Can reassign to different employee

Response: 200 OK
```

#### Change Status (ADMIN only)
```
PUT /requests/:id/status
Authorization: Bearer {jwt}
Content-Type: application/json

Request Body:
{
  "status": "CANCELLED"
}

Validation:
- Must be valid transition
- COMPLETED and CANCELLED are final states

Response: 200 OK
```

#### Soft Delete Request (ADMIN only)
```
DELETE /requests/:id
Authorization: Bearer {jwt}

Response: 200 OK
```

## Frontend Components (Atomic Design)

### Atoms

#### StatusBadgeAtom
```typescript
interface StatusBadgeAtomProps {
  status: RequestStatus;
  size?: 'sm' | 'md' | 'lg';
}

// Colors:
// PENDING: yellow
// ONGOING: blue
// COMPLETED: green
// CANCELLED: red
```

#### DateTimeDisplayAtom
```typescript
interface DateTimeDisplayAtomProps {
  date: Date | string;
  format?: 'short' | 'long' | 'relative';
}
```

### Molecules

#### RequestCardMolecule
```typescript
interface RequestCardMoleculeProps {
  request: {
    id: string;
    service: { name: string };
    status: RequestStatus;
    executionDateTime: Date;
    createdAt: Date;
  };
  onClick?: () => void;
}

// Displays:
// - Service name
// - Status badge
// - Execution date/time
// - Created date
// - Click to view detail
```

#### StatusTimelineMolecule
```typescript
interface StatusTimelineMoleculeProps {
  request: {
    status: RequestStatus;
    createdAt: Date;
    completedAt?: Date;
    cancellationRequestedAt?: Date;
  };
}

// Visual timeline showing:
// 1. Created (always)
// 2. Assigned (if assignedTo exists)
// 3. In Progress (if ONGOING)
// 4. Completed/Cancelled (if final state)
```

#### AssignmentSelectorMolecule
```typescript
interface AssignmentSelectorMoleculeProps {
  employees: Array<{ id: string; name: string }>;
  currentAssigneeId?: string;
  onAssign: (employeeId: string) => void;
  disabled?: boolean;
}
```

### Organisms

#### RequestFormOrganism
```typescript
interface RequestFormOrganismProps {
  onSubmit: (data: CreateRequestDto) => void;
  services: Service[];
  locations: WorkLocation[];
  loading?: boolean;
}

// Multi-step form:
// Step 1: Select location
// Step 2: Select service
// Step 3: Fill template responses
// Step 4: Set execution date/time
// Step 5: Review and submit
```

#### RequestListOrganism
```typescript
interface RequestListOrganismProps {
  role: UserRole;
  filters?: {
    status?: RequestStatus;
    search?: string;
  };
  onFilterChange?: (filters: any) => void;
}

// Features:
// - Filter by status
// - Search by service name
// - Pagination
// - Sort by date
// - Role-based display
```

#### RequestDetailOrganism
```typescript
interface RequestDetailOrganismProps {
  request: Request;
  role: UserRole;
  onCancel?: () => void;
  onComplete?: (note: any) => void;
  onAssign?: (employeeId: string) => void;
  onStatusChange?: (status: RequestStatus) => void;
}

// Role-based actions:
// CLIENT: Can request cancellation
// EMPLOYEE: Can complete request
// ADMIN: Can assign, change status, update details
```

#### RequestCompletionOrganism
```typescript
interface RequestCompletionOrganismProps {
  onComplete: (note: { text: string; photos: string[] }) => void;
  loading?: boolean;
}

// Form with:
// - Text area for completion notes
// - Photo upload (multiple)
// - Submit button
```

## Frontend Pages

### /requests (List Page)
- Uses `RequestListOrganism`
- Role-based filtering (CLIENT, EMPLOYEE, ADMIN)
- Pagination
- Status filters

### /requests/new (Create Page)
- Uses `RequestFormOrganism`
- CLIENT only
- Multi-step wizard
- Redirects to detail on success

### /requests/[id] (Detail Page)
- Uses `RequestDetailOrganism`
- Role-based actions
- Real-time updates
- Status timeline

## Validation Rules

### CreateRequestDto
```typescript
{
  serviceId: string (required, must exist, not soft-deleted),
  locationId: string (required, must exist, must belong to user, not soft-deleted),
  executionDateTime: DateTime (required, must be future date),
  templateResponses: Record<string, any> (required, must match service.requestTemplate)
}
```

### UpdateRequestDto
```typescript
{
  assignedToId: string (optional, must be EMPLOYEE role),
  executionDateTime: DateTime (optional, must be future date)
}
```

### CompleteRequestDto
```typescript
{
  note: {
    text: string (required, min 10 chars),
    photos: string[] (optional, array of URLs)
  }
}
```

## Test Requirements

### Backend Unit Tests (95%+ coverage)
- RequestsService: ~44 tests
- State machine transitions
- Authorization logic
- Soft deletes
- Audit logging

### Frontend Component Tests (90%+ coverage)
- All atoms, molecules, organisms
- Role-based rendering
- Form validation
- User interactions

### E2E Tests (21+ scenarios)
- Request creation flow
- Employee task management
- Admin operations
- Authorization checks
- Cancellation workflow

## Security Considerations

1. **Authentication**: All endpoints require valid JWT
2. **Authorization**: Role-based access control (CLIENT, EMPLOYEE, ADMIN)
3. **Ownership**: Clients can only access own requests
4. **Assignment**: Employees can only access assigned requests
5. **Validation**: Input validation on all endpoints
6. **Rate Limiting**: 100 requests/min per IP
7. **Audit Trail**: createdBy, updatedBy tracking
8. **Soft Deletes**: Data preservation for compliance

## Performance Optimizations

1. **Database Indexes**: On userId, assignedToId, status, executionDateTime
2. **Query Optimization**: Include only necessary relations
3. **Pagination**: Default limit 20, max 100
4. **Caching**: React Query with 5-minute stale time
5. **Lazy Loading**: Images and large data

## Integration Points

### With Other Issues

- **ALI-115**: Uses User model and JWT auth
- **ALI-116**: Uses User roles (CLIENT, EMPLOYEE, ADMIN)
- **ALI-117**: Uses WorkLocation model
- **ALI-118**: Uses Service and Category models
- **ALI-120** (future): Will trigger notifications on status changes
- **ALI-121** (future): Will send emails on creation/completion

## Next Steps

1. Review and approve this specification
2. Begin Phase 1: Database Schema implementation
3. Follow implementation plan in `ALI-119-plan.md`
4. Create feature branch: `feature/ALI-119-service-requests`
5. Implement TDD approach with tests first

## References

- [Implementation Plan](./ALI-119-plan.md)
- [Jira Issue](https://alkitu.atlassian.net/browse/ALI-119)
- [Prisma Schema](../../../packages/api/prisma/schema.prisma)
- [ALI-118 Final Spec](../ALI-118/ALI-118-final-spec.md) (pattern reference)
