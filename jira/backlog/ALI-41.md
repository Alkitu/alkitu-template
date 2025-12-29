# ALI-41: dev Request Detail – “Request Overview & Status” [Client]

## Issue Information
- **Type**: Historia
- **Priority**: Medium
- **Status**: Concept V1
- **Created**: 2025-11-18T01:30:22.332+0100
- **Jira Link**: [View in Jira](https://alkitu.atlassian.net/browse/ALI-41)

## Description

**URL:** `/app/requests/:requestId`

**User Story Intro:**

Como cliente, quiero ver toda la información de mi solicitud, incluyendo en qué etapa se encuentra y quién la está gestionando.

**Funciones:**

* **Ver detalles completos de la solicitud**

    \[GET /app/requests/:requestId\]


* **Ver el estado actual del request (etapa del proceso)**

    \[status: PENDING / ONGOING / COMPLETED / CANCELLED\]


* **Ver el empleado asignado**

    \[assignedToId → nombre + contacto\]


* **Ver ubicación, servicio y formulario enviado**

    \[Incluido en el mismo GET\]


* **Solicitar cancelación**

    \[PUT /app/requests/:requestId/cancellation-request\]





## Implementation Notes

_This section will be filled during implementation planning_

## Acceptance Criteria

_To be defined_

## Related Issues

_To be linked_

## Resources

- [Spec Directory](./specs/ALI-41/)
