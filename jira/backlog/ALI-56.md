# ALI-56: dev Services Catalog – “Service Types & Templates Management” [Admin]

## Issue Information
- **Type**: Historia
- **Priority**: Medium
- **Status**: Concept V1
- **Created**: 2025-11-18T01:55:37.602+0100
- **Jira Link**: [View in Jira](https://alkitu.atlassian.net/browse/ALI-56)

## Description

**URL principal:**

`/app/services`

**URL detalle:**

`/app/services/:serviceId`

**User Story Intro:**

Como administrador, quiero gestionar los servicios y sus plantillas dinámicas para mantener actualizado el catálogo y garantizar que se recolecta la información correcta.

**Funciones:**

**Ver lista completa de servicios**

\[Consulta con

`GET /app/services`

\]

**Crear un nuevo servicio**

\[Formulario que envía

`POST /app/services`

\]

**Editar un servicio existente**

\[Carga con

`GET /app/services/:serviceId`

 y guardado mediante

`PUT /app/services/:serviceId`

\]

**Actualizar la plantilla dinámica del servicio (requestTemplate)**

\[Edición de JSON vía

`PUT /app/services/:serviceId`

\]

**Gestionar categorías de servicio**

\[Operaciones tipo

`POST /app/categories`

,

`PUT /app/categories/:categoryId`

,

`DELETE /app/categories/:categoryId`

\]

**Eliminar un servicio**

\[Acción con

`DELETE /app/services/:serviceId`

\]

## Implementation Notes

_This section will be filled during implementation planning_

## Acceptance Criteria

_To be defined_

## Related Issues

_To be linked_

## Resources

- [Spec Directory](./specs/ALI-56/)
