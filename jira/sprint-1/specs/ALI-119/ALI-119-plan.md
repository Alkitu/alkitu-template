# ALI-119: Service Requests Lifecycle & Assignment - Implementation Plan

## Issue Information
- **Issue**: ALI-119
- **Type**: Task
- **Priority**: Medium
- **Status**: Discovery
- **Sprint**: Sprint 1 (37)
- **Assignee**: Luis Eduardo Urdaneta Martucci
- **Reporter**: Leonel
- **Created**: 2025-11-18
- **Dependencies**: ALI-118 (Service catalog)

## Overview

Modelar el núcleo del sistema: las solicitudes de servicio (Request), su relación con usuarios, servicios, ubicaciones y empleados, así como todo su ciclo de vida completo con estados y transiciones.

## Core Models

### Request Model
```prisma
enum RequestStatus {
  PENDING
  ONGOING
  COMPLETED
  CANCELLED
}

model Request {
  id                      String         @id @default(auto()) @map("_id") @db.ObjectId

  // Cliente que crea la solicitud
  user                    User           @relation("UserRequests", fields: [userId], references: [id])
  userId                  String         @db.ObjectId

  // Servicio solicitado
  service                 Service        @relation("ServiceRequests", fields: [serviceId], references: [id])
  serviceId               String         @db.ObjectId

  // Ubicación de trabajo
  location                WorkLocation   @relation(fields: [locationId], references: [id])
  locationId              String         @db.ObjectId

  // Empleado asignado (opcional)
  assignedTo              User?          @relation("RequestAssignedEmployee", fields: [assignedToId], references: [id])
  assignedToId            String?        @db.ObjectId

  // Datos de ejecución
  executionDateTime       DateTime

  // Respuestas del cliente al requestTemplate
  templateResponses       Json

  // Campo para el empleado al completar (notas, fotos)
  note                    Json?

  // Estado y ciclo de vida
  status                  RequestStatus  @default(PENDING)
  cancellationRequested   Boolean        @default(false)
  cancellationRequestedAt DateTime?
  completedAt             DateTime?

  // Soft delete y audit (siguiendo patrón ALI-118)
  deletedAt               DateTime?
  createdBy               String?        @db.ObjectId
  updatedBy               String?        @db.ObjectId

  createdAt               DateTime       @default(now())
  updatedAt               DateTime       @updatedAt

  @@index([userId])
  @@index([serviceId])
  @@index([locationId])
  @@index([assignedToId])
  @@index([status])
  @@index([executionDateTime])
  @@map("requests")
}
```

## Implementation Phases

### Phase 1: Database Schema & Enums (2 hours)
**Objetivo**: Definir el modelo Request y el enum RequestStatus en Prisma

**Tasks**:
1. Agregar `RequestStatus` enum al schema.prisma
2. Agregar modelo `Request` con todas las relaciones
3. Agregar relaciones en modelos existentes:
   - User: `requests Request[] @relation("UserRequests")`
   - User: `assignedRequests Request[] @relation("RequestAssignedEmployee")`
   - Service: `requests Request[] @relation("ServiceRequests")`
   - WorkLocation: `requests Request[] @relation("WorkLocationRequests")`
4. Ejecutar `npx prisma db push`
5. Verificar tipos generados en `@prisma/client`

**Success Criteria**:
- ✅ Schema actualizado sin errores
- ✅ Relaciones bidireccionales correctas
- ✅ Tipos TypeScript generados
- ✅ Indexes creados para queries eficientes

### Phase 2: Shared Types & Schemas (1.5 hours)
**Objetivo**: Crear tipos TypeScript y esquemas Zod compartidos

**Tasks**:
1. Crear `packages/shared/src/types/request.ts`:
   ```typescript
   export type RequestStatus = 'PENDING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';

   export interface Request {
     id: string;
     userId: string;
     serviceId: string;
     locationId: string;
     assignedToId?: string;
     executionDateTime: Date;
     templateResponses: Record<string, any>;
     note?: Record<string, any>;
     status: RequestStatus;
     cancellationRequested: boolean;
     cancellationRequestedAt?: Date;
     completedAt?: Date;
     deletedAt?: Date;
     createdBy?: string;
     updatedBy?: string;
     createdAt: Date;
     updatedAt: Date;
   }
   ```

2. Crear `packages/shared/src/schemas/request.ts`:
   ```typescript
   import { z } from 'zod';

   export const RequestStatusSchema = z.enum(['PENDING', 'ONGOING', 'COMPLETED', 'CANCELLED']);

   export const CreateRequestSchema = z.object({
     serviceId: z.string(),
     locationId: z.string(),
     executionDateTime: z.string().datetime(),
     templateResponses: z.record(z.any()),
   });

   export const UpdateRequestSchema = z.object({
     assignedToId: z.string().optional(),
     executionDateTime: z.string().datetime().optional(),
     status: RequestStatusSchema.optional(),
     note: z.record(z.any()).optional(),
   });
   ```

3. Exportar desde `packages/shared/src/index.ts`

**Success Criteria**:
- ✅ Tipos compartidos definidos
- ✅ Schemas Zod con validación completa
- ✅ Exports correctos desde shared package

### Phase 3: Backend - Service Layer (3 hours)
**Objetivo**: Implementar RequestsService con TDD

**Tasks**:
1. Crear `packages/api/src/requests/requests.service.ts`:
   - `create(dto, userId)`: Crea request con status PENDING
   - `findAll(filters)`: Lista con filtros (userId, assignedToId, status)
   - `findOne(id)`: Get con relaciones (user, service, location, assignedTo)
   - `update(id, dto, userId)`: Update con audit logging
   - `updateStatus(id, status, userId)`: Cambio de estado con validación
   - `assign(id, employeeId, userId)`: Asignar empleado
   - `requestCancellation(id, userId)`: Marcar cancellationRequested
   - `complete(id, note, userId)`: Completar con nota del empleado
   - `remove(id)`: Soft delete
   - `count(filters)`: Conteo con filtros

2. Implementar validaciones de estado:
   - PENDING → ONGOING, CANCELLED
   - ONGOING → COMPLETED, CANCELLED
   - COMPLETED → (no changes allowed)
   - CANCELLED → (no changes allowed)

3. Crear DTOs:
   - `CreateRequestDto`
   - `UpdateRequestDto`
   - `UpdateStatusDto`
   - `AssignRequestDto`
   - `CompleteRequestDto`

**Success Criteria**:
- ✅ Todos los métodos implementados
- ✅ Soft deletes aplicados
- ✅ Audit logging (createdBy, updatedBy)
- ✅ Validación de transiciones de estado
- ✅ Relaciones cargadas correctamente

### Phase 4: Backend - Unit Tests (2.5 hours)
**Objetivo**: Alcanzar 95%+ coverage con tests unitarios

**Test Suites**:
1. **create()** (5 tests):
   - ✅ Should create request successfully
   - ✅ Should throw NotFoundException if service not found
   - ✅ Should throw NotFoundException if location not found
   - ✅ Should set status to PENDING by default
   - ✅ Should set audit fields (createdBy, updatedBy)

2. **findAll()** (6 tests):
   - ✅ Should return all requests
   - ✅ Should filter by userId (client requests)
   - ✅ Should filter by assignedToId (employee tasks)
   - ✅ Should filter by status
   - ✅ Should exclude soft-deleted requests
   - ✅ Should return empty array if no requests exist

3. **findOne()** (4 tests):
   - ✅ Should return request with all relations
   - ✅ Should throw NotFoundException if not found
   - ✅ Should exclude soft-deleted
   - ✅ Should include user, service, location, assignedTo

4. **update()** (5 tests):
   - ✅ Should update request successfully
   - ✅ Should update audit fields (updatedBy)
   - ✅ Should throw NotFoundException if not found
   - ✅ Should validate assignedTo is EMPLOYEE role
   - ✅ Should throw on database error

5. **updateStatus()** (7 tests):
   - ✅ Should update status PENDING → ONGOING
   - ✅ Should update status ONGOING → COMPLETED
   - ✅ Should update status PENDING → CANCELLED
   - ✅ Should throw BadRequestException on invalid transition
   - ✅ Should not allow changes if COMPLETED
   - ✅ Should not allow changes if CANCELLED
   - ✅ Should update audit fields

6. **assign()** (4 tests):
   - ✅ Should assign employee to request
   - ✅ Should validate employee has EMPLOYEE role
   - ✅ Should throw NotFoundException if employee not found
   - ✅ Should update audit fields

7. **requestCancellation()** (3 tests):
   - ✅ Should mark cancellationRequested = true
   - ✅ Should set cancellationRequestedAt timestamp
   - ✅ Should only work if status is PENDING or ONGOING

8. **complete()** (4 tests):
   - ✅ Should set status to COMPLETED
   - ✅ Should set completedAt timestamp
   - ✅ Should save employee note
   - ✅ Should only work if status is ONGOING

9. **remove()** (3 tests):
   - ✅ Should soft delete request
   - ✅ Should throw NotFoundException if not found
   - ✅ Should update deletedAt field

10. **count()** (3 tests):
    - ✅ Should count all requests
    - ✅ Should filter by status
    - ✅ Should exclude soft-deleted

**Total**: ~44 unit tests

**Success Criteria**:
- ✅ 95%+ code coverage
- ✅ All edge cases covered
- ✅ State machine transitions validated
- ✅ Authorization checks tested

### Phase 5: Backend - Controller & Guards (2 hours)
**Objetivo**: Implementar REST endpoints con autorización

**Endpoints**:
```typescript
// Client endpoints
POST   /requests                    // Create new request (CLIENT)
GET    /requests                    // List my requests (CLIENT) or assigned tasks (EMPLOYEE) or all (ADMIN)
GET    /requests/:id                // Get request detail
PUT    /requests/:id/cancel         // Request cancellation (CLIENT)

// Employee endpoints
PUT    /requests/:id/complete       // Complete request (EMPLOYEE)

// Admin endpoints
PUT    /requests/:id                // Update request (ADMIN)
PUT    /requests/:id/status         // Change status (ADMIN)
PUT    /requests/:id/assign         // Assign employee (ADMIN)
DELETE /requests/:id                // Soft delete (ADMIN)
```

**Authorization Rules**:
- CLIENT: Can only access own requests (userId)
- EMPLOYEE: Can access assigned requests (assignedToId)
- ADMIN: Can access all requests

**Tasks**:
1. Crear `packages/api/src/requests/requests.controller.ts`
2. Implementar guards de autorización por role
3. Implementar guard de ownership (request.userId === req.user.id)
4. Agregar decorators de rate limiting
5. Configurar Swagger/OpenAPI documentation

**Success Criteria**:
- ✅ Todos los endpoints implementados
- ✅ Autorización correcta por role
- ✅ Rate limiting aplicado
- ✅ Swagger documentation completa

### Phase 6: Frontend - Shared Components (2 hours)
**Objetivo**: Crear componentes reutilizables para requests

**Components (Atomic Design)**:

**Atoms**:
- `StatusBadgeAtom`: Badge para mostrar status con colores
- `DateTimeDisplayAtom`: Formato de fecha/hora

**Molecules**:
- `RequestCardMolecule`: Card con info básica de request
- `StatusTimelineMolecule`: Timeline visual del ciclo de vida
- `AssignmentSelectorMolecule`: Dropdown para asignar empleado

**Organisms**:
- `RequestFormOrganism`: Form multi-step para crear request
- `RequestListOrganism`: Lista con filtros y paginación
- `RequestDetailOrganism`: Vista detallada con acciones
- `RequestCompletionOrganism`: Form para completar con nota/fotos

**Tasks**:
1. Crear components en `packages/web/src/components/`
2. Implementar con TypeScript + PropTypes
3. Agregar unit tests con Vitest + Testing Library
4. Crear Storybook stories para cada componente

**Success Criteria**:
- ✅ Todos los componentes creados
- ✅ 90%+ coverage en unit tests
- ✅ Storybook stories documentadas
- ✅ Responsive design

### Phase 7: Frontend - Pages & Integration (2.5 hours)
**Objetivo**: Implementar páginas del flujo de requests

**Pages**:
1. `/requests` - Lista de requests (filtrado por role)
2. `/requests/new` - Multi-step form para crear
3. `/requests/[id]` - Detalle con acciones por role

**API Routes**:
1. `GET /api/requests` - Proxy to backend
2. `POST /api/requests` - Create request
3. `GET /api/requests/[id]` - Get detail
4. `PUT /api/requests/[id]/cancel` - Cancel
5. `PUT /api/requests/[id]/complete` - Complete
6. `PUT /api/requests/[id]/assign` - Assign (admin)

**Tasks**:
1. Crear pages en `packages/web/src/app/[lang]/(private)/`
2. Crear API routes en `packages/web/src/app/api/`
3. Implementar role-based UI logic
4. Agregar loading/error states
5. Implementar toast notifications

**Success Criteria**:
- ✅ Todas las páginas funcionando
- ✅ API routes conectados
- ✅ UI adaptada por role
- ✅ UX fluida con feedback

### Phase 8: E2E Tests (2.5 hours)
**Objetivo**: Tests end-to-end con Playwright

**Test Scenarios**:

1. **Request Creation Flow (CLIENT)** (5 tests):
   - ✅ Complete multi-step form successfully
   - ✅ Validate required fields
   - ✅ Select service and location
   - ✅ Set execution date/time
   - ✅ Submit and verify PENDING status

2. **Request Management (EMPLOYEE)** (4 tests):
   - ✅ View assigned tasks
   - ✅ Access request detail
   - ✅ Complete request with note
   - ✅ Verify COMPLETED status

3. **Admin Operations (ADMIN)** (5 tests):
   - ✅ View all requests
   - ✅ Assign employee to request
   - ✅ Change request status
   - ✅ Update request details
   - ✅ Approve cancellation

4. **Authorization Tests** (4 tests):
   - ✅ CLIENT cannot access other user's requests
   - ✅ EMPLOYEE cannot access unassigned requests
   - ✅ CLIENT cannot assign employees
   - ✅ EMPLOYEE cannot change status manually

5. **Cancellation Flow** (3 tests):
   - ✅ CLIENT requests cancellation
   - ✅ Admin approves cancellation
   - ✅ Verify CANCELLED status

**Total**: 21 E2E tests

**Success Criteria**:
- ✅ 21/21 tests passing
- ✅ All user flows validated
- ✅ Authorization properly tested
- ✅ Multi-browser testing (Chrome, Firefox)

### Phase 9: Documentation & Finalization (1 hour)
**Objetivo**: Documentar y finalizar implementación

**Tasks**:
1. Crear `ALI-119-final-spec.md` con:
   - Database schema documentation
   - API endpoints documentation
   - Frontend components documentation
   - State machine diagram
   - Test results summary

2. Actualizar `jira/sprint-1/README.md`
3. Agregar comentario en Jira con resultados
4. Crear PR con descripción completa

**Success Criteria**:
- ✅ Documentación completa
- ✅ PR creado y revisado
- ✅ Jira actualizado
- ✅ README actualizado

## Technical Requirements

### Database
- MongoDB with Prisma ORM
- Soft deletes (deletedAt field)
- Audit logging (createdBy, updatedBy)
- Proper indexes for performance
- Relations with User, Service, WorkLocation

### Backend
- NestJS with TypeScript
- JWT authentication
- Role-based authorization (CLIENT, EMPLOYEE, ADMIN)
- Zod validation
- 95%+ unit test coverage
- Rate limiting protection

### Frontend
- Next.js 15 with App Router
- Atomic Design pattern
- React Query for data fetching
- Zustand for state management
- Tailwind CSS for styling
- 90%+ component coverage
- Playwright E2E tests

### Security
- JWT token validation
- Role-based access control
- Owner-based access control
- Input sanitization
- Rate limiting
- Audit trail

## Estimated Timeline

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| 1. Database Schema | 2h | - |
| 2. Shared Types | 1.5h | Phase 1 |
| 3. Backend Service | 3h | Phase 2 |
| 4. Backend Tests | 2.5h | Phase 3 |
| 5. Controller & Guards | 2h | Phase 3 |
| 6. Frontend Components | 2h | Phase 2 |
| 7. Frontend Pages | 2.5h | Phase 6 |
| 8. E2E Tests | 2.5h | Phase 7 |
| 9. Documentation | 1h | All phases |

**Total**: ~19 hours (~2.5 days)

## Success Metrics

### Code Quality
- ✅ Backend: 95%+ unit test coverage
- ✅ Frontend: 90%+ component coverage
- ✅ E2E: 21+ scenarios passing
- ✅ Zero TypeScript errors
- ✅ Zero ESLint errors
- ✅ 85%+ mutation score (Stryker)

### Performance
- ✅ API response time <200ms (p95)
- ✅ Page load time <2s (Lighthouse)
- ✅ Database queries optimized with indexes

### Security
- ✅ All endpoints protected with JWT
- ✅ Role-based authorization enforced
- ✅ Rate limiting active (100 req/min)
- ✅ Audit trail complete

## Dependencies

### Required
- ✅ ALI-118: Service catalog (completed)
- ✅ User model with roles
- ✅ WorkLocation model
- ✅ JWT authentication system

### Optional
- ALI-120: Notifications (can trigger events)
- ALI-121: Email templates (can send emails on status change)

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Estado machine complexity | High | Comprehensive unit tests for transitions |
| Authorization logic errors | High | Dedicated authorization tests |
| Performance with many relations | Medium | Proper indexing and query optimization |
| Frontend state management | Medium | React Query for server state |

## Notes

- Following patterns from ALI-118 (soft deletes, audit logging)
- State machine requires careful validation
- Multiple user perspectives (CLIENT, EMPLOYEE, ADMIN)
- Complex authorization rules need thorough testing
- Multi-step form requires good UX
