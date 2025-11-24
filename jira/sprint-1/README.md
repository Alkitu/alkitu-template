# Sprint 1: Diseño Interfaz y Data Base

## Sprint Information
- **Sprint ID**: 37
- **Start Date**: 2025-11-23
- **End Date**: 2025-11-30
- **Duration**: 7 days
- **Status**: Active

## Overview

Este sprint se enfoca en el diseño y definición completa de la arquitectura de base de datos para la aplicación ALIANZA MANAGEMENT APP. Incluye 8 tareas (ALI-115 a ALI-122) que cubren todos los aspectos fundamentales del sistema, desde la autenticación hasta las notificaciones y gestión de usuarios.

## Epic Parent
- **Epic Key**: ALI-18
- **Epic Name**: Data Base [Global]
- **Epic Status**: Discovery

## Sprint Goals

1. **Autenticación y Acceso Público** (ALI-115)
   - Definir modelo User básico
   - Implementar flujos de registro, login y recuperación de contraseña

2. **Perfiles y Onboarding** (ALI-116)
   - Completar campos de perfil de usuario
   - Implementar lógica de onboarding obligatorio

3. **Ubicaciones de Trabajo** (ALI-117)
   - Modelar ubicaciones reutilizables
   - Soportar direcciones complejas (building, tower, floor, unit)

4. **Servicios y Categorías** (ALI-118)
   - Definir catálogo de servicios
   - Implementar templates dinámicos para formularios

5. **Ciclo de Vida de Solicitudes** (ALI-119)
   - Modelar flujo completo de requests
   - Implementar estados y asignaciones

6. **Sistema de Notificaciones** (ALI-120)
   - Crear sistema de notificaciones internas
   - Soportar diferentes tipos de eventos

7. **Templates de Email** (ALI-121)
   - Definir plantillas de correo automáticas
   - Configurar triggers por eventos

8. **Gestión de Usuarios y Roles** (ALI-122)
   - Implementar vista administrativa de usuarios
   - Gestionar equipos y clientes

## Issues in this Sprint

| Issue | Type | Summary | Priority | Status |
|-------|------|---------|----------|--------|
| [ALI-115](./ALI-115.md) | Tarea | DB Authentication & Public Access (User + Auth) | Medium | Discovery |
| [ALI-116](./ALI-116.md) | Tarea | DB User Profile & Onboarding (User + ContactPerson) | Medium | Discovery |
| [ALI-117](./ALI-117.md) | Tarea | DB Work Locations Management (WorkLocation) | Medium | Discovery |
| [ALI-118](./ALI-118.md) | Tarea | DB Services, Categories & Dynamic Templates | Medium | Discovery |
| [ALI-119](./ALI-119.md) | Tarea | DB Service Requests Lifecycle & Assignment | Medium | Discovery |
| [ALI-120](./ALI-120.md) | Tarea | DB Notifications System (Notification) | Medium | Discovery |
| [ALI-121](./ALI-121.md) | Tarea | DB Email Templates & Automation | Medium | Discovery |
| [ALI-122](./ALI-122.md) | Tarea | DB Users & Roles Management (Admin View) | Medium | Discovery |

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
