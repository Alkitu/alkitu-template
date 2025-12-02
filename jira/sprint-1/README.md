# Sprint 1: Diseño Interfaz y Data Base

## Sprint Information
- **Sprint ID**: 37
- **Start Date**: 2025-11-23
- **End Date**: 2025-11-30
- **Duration**: 7 days
- **Status**: In Progress
- **Progress**: 5/8 tasks completed (62.5%)
- **Current**: ALI-120 (Notifications System)

## Overview

Este sprint se enfoca en el diseño y definición completa de la arquitectura de base de datos para la aplicación ALIANZA MANAGEMENT APP. Incluye 8 tareas (ALI-115 a ALI-122) que cubren todos los aspectos fundamentales del sistema, desde la autenticación hasta las notificaciones y gestión de usuarios.

## Epic Parent
- **Epic Key**: ALI-18
- **Epic Name**: Data Base [Global]
- **Epic Status**: Discovery

## Sprint Goals

1. **Autenticación y Acceso Público** (ALI-115) - ✅ COMPLETED
   - [x] Definir modelo User básico
   - [x] Implementar flujos de registro, login y recuperación de contraseña

2. **Perfiles y Onboarding** (ALI-116) - ✅ COMPLETED
   - [x] Completar campos de perfil de usuario
   - [x] Implementar lógica de onboarding obligatorio

3. **Ubicaciones de Trabajo** (ALI-117) - ✅ COMPLETED
   - [x] Modelar ubicaciones reutilizables
   - [x] Soportar direcciones complejas (building, tower, floor, unit)

4. **Servicios y Categorías** (ALI-118) - ✅ COMPLETED
   - [x] Definir catálogo de servicios
   - [x] Implementar templates dinámicos para formularios

5. **Ciclo de Vida de Solicitudes** (ALI-119) - ✅ COMPLETED
   - [x] Modelar flujo completo de requests
   - [x] Implementar estados y asignaciones

6. **Sistema de Notificaciones** (ALI-120)
   - [ ] Crear sistema de notificaciones internas
   - [ ] Soportar diferentes tipos de eventos

7. **Templates de Email** (ALI-121)
   - [ ] Definir plantillas de correo automáticas
   - [ ] Configurar triggers por eventos

8. **Gestión de Usuarios y Roles** (ALI-122)
   - [ ] Implementar vista administrativa de usuarios
   - [ ] Gestionar equipos y clientes

## Issues in this Sprint

| Issue | Type | Summary | Priority | Status |
|-------|------|---------|----------|--------|
| [ALI-115](./ALI-115.md) | Tarea | DB Authentication & Public Access (User + Auth) | Medium | ✅ Done |
| [ALI-116](./ALI-116.md) | Tarea | DB User Profile & Onboarding (User + ContactPerson) | Medium | ✅ Done |
| [ALI-117](./ALI-117.md) | Tarea | DB Work Locations Management (WorkLocation) | Medium | ✅ Done |
| [ALI-118](./ALI-118.md) | Tarea | DB Services, Categories & Dynamic Templates | Medium | ✅ Done |
| [ALI-119](./ALI-119.md) | Tarea | DB Service Requests Lifecycle & Assignment | Medium | ✅ Done |
| [ALI-120](./ALI-120.md) | Tarea | DB Notifications System (Notification) | Medium | Discovery |
| [ALI-121](./ALI-121.md) | Tarea | DB Email Templates & Automation | Medium | Discovery |
| [ALI-122](./ALI-122.md) | Tarea | DB Users & Roles Management (Admin View) | Medium | Discovery |

## Completed Tasks (5/8)

### ✅ ALI-115: Authentication & Public Access
**Completed**: 2025-11-24
**Implementation**: Full auth system with JWT, register, login, password reset
**Tests**: 10/10 E2E + 20+ Unit (100% passing)
**Coverage**: 95%+
**Documentation**: [ALI-115 Spec](./specs/ALI-115/)

### ✅ ALI-116: User Profile & Onboarding
**Completed**: 2025-01-24
**Implementation**: Role-based profile updates with CLIENT/EMPLOYEE/ADMIN forms
**Tests**: 16 backend unit (91.12% coverage), 14/14 E2E
**PR**: [#3 - Profile Update](https://github.com/Alkitu/alkitu-template/pull/3)
**Documentation**: [ALI-116 Spec](./specs/ALI-116/)

### ✅ ALI-117: Work Locations Management
**Completed**: 2024-11-28
**Implementation**: Full CRUD for work locations with complex address support
**Tests**: 33 backend unit (93.33% coverage), 10 E2E scenarios
**PR**: [#4 - Work Locations](https://github.com/Alkitu/alkitu-template/pull/4)
**Documentation**: [ALI-117 Spec](./specs/ALI-117/)

### ✅ ALI-118: Services, Categories & Dynamic Templates
**Completed**: 2025-12-01
**Implementation**: Service catalog management with dynamic request templates (10 field types)
**Tests**: 45 backend unit (100% passing - 21 categories + 24 services), 13 E2E scenarios
**Features**:
- Categories CRUD with soft deletes
- Services CRUD with soft deletes
- JSON template validation (10 field types)
- Dynamic form renderer
- Audit logging (createdBy, updatedBy)
- Global rate limiting (100 req/min)
**Security**: Soft deletes, audit trail, rate limiting protection
**Documentation**: [ALI-118 Final Spec](./specs/ALI-118/ALI-118-final-spec.md)

### ✅ ALI-119: Service Requests Lifecycle & Assignment
**Completed**: 2025-12-01
**Implementation**: Complete request management system with RBAC and state machine workflow
**Tests**: 44 backend unit (95%+ coverage), 18 E2E scenarios (3 roles)
**Features**:
- Request CRUD with role-based access control
- State machine: PENDING → ONGOING → COMPLETED/CANCELLED
- Assignment system (employees, auto-transition to ONGOING)
- Cancellation workflow (auto-approve PENDING, admin-approve ONGOING)
- Complete with completion notes
- Dynamic template responses (JSON)
- Soft deletes + audit logging
- 10 REST endpoints + 5 Next.js proxy routes
- 3 frontend pages (list, create, detail)
- 5 Atomic Design components (2 molecules, 3 organisms)
**Security**: JWT auth, RBAC at service layer, soft deletes, audit trail, state transition validation
**Documentation**: [ALI-119 Implementation Complete](./specs/ALI-119/ALI-119-implementation-complete.md)

## Next Task

### 🔜 ALI-120: Notifications System
**Status**: Not Started
**Description**: Create internal notifications system for tracking events and user updates
**Key Models**: Notification, NotificationType enum
**Dependencies**: ALI-119 (Requests system to trigger notifications)
**Complexity**: Medium (real-time updates, multiple notification types)
**Estimated Effort**: ~8-10 hours

## Database Models Overview

Este sprint define los siguientes modelos principales:

### Core Models
- **User**: Modelo central de usuarios con roles (CLIENT, EMPLOYEE, ADMIN)
- **WorkLocation**: Ubicaciones de trabajo reutilizables
- **Category**: Categorías de servicios
- **Service**: Catálogo de servicios con templates dinámicos
- **Request**: Solicitudes de servicio con ciclo de vida completo

### Supporting Models
- **Notification**: Notificaciones internas del sistema
- **EmailTemplate**: Plantillas de correo automáticas

### Types
- **ContactPerson**: Persona de contacto (embedded type)
- **Role**: Enum (CLIENT, EMPLOYEE, ADMIN)
- **RequestStatus**: Enum (PENDING, ONGOING, COMPLETED, CANCELLED)
- **NotificationType**: Enum (REQUEST_CREATED, REQUEST_STATUS_CHANGED, etc.)
- **TemplateTrigger**: Enum (ON_REQUEST_CREATED, ON_STATUS_CHANGED)

## Key Relationships

```
User (1) ----< (*) WorkLocation
User (1) ----< (*) Request (as client)
User (1) ----< (*) Request (as assignedTo)
User (1) ----< (*) Notification

Category (1) ----< (*) Service
Service (1) ----< (*) Request

WorkLocation (1) ----< (*) Request
```

## Technical Stack
- **Database**: MongoDB with Prisma ORM
- **Authentication**: JWT + Passport
- **Validation**: Zod schemas
- **Email**: Resend service integration

## Sprint Progress

### Timeline
- **Sprint Start**: 2025-11-23
- **Sprint End**: 2025-11-30
- **Days Elapsed**: 8/7 days (extended)
- **Tasks Completed**: 5/8 (62.5%)

### Quality Metrics
- **Backend Coverage**: 91-100% across all completed tasks
- **Backend Unit Tests**: 158 total (20 auth + 16 profile + 33 locations + 45 catalog + 44 requests)
- **E2E Tests**: 65 scenarios total (all passing - 10 auth + 14 profile + 10 locations + 13 catalog + 18 requests)
- **PRs Merged**: 2 (ALI-116, ALI-117)
- **Zero Errors**: No TypeScript or ESLint errors
- **Code Quality**: 100% on all completed implementations

### Velocity
- **Average**: ~1.6 days per task
- **Accelerating**: Yes (5 tasks in 8 days)

## Team
- **Assignee**: Luis Eduardo Urdaneta Martucci
- **Reporter**: Leonel

## Resources
- [Jira Sprint Board](https://alkitu.atlassian.net/jira/software/c/projects/ALI/boards/37)
- [Project Documentation](../../docs/)
- [Prisma Schema](../../packages/api/prisma/schema.prisma)

## Notes
- Todos los issues están actualmente en estado "Discovery"
- Se requiere definición completa de esquemas antes de implementación
- Los templates dinámicos (Service.requestTemplate) son JSON configurables
- El sistema soporta notificaciones internas y emails automáticos
