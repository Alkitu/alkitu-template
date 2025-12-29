# ALI-26: dev Employee Dashboard – “Assigned Tasks & Ongoing Jobs” [Employee]

## Issue Information
- **Type**: Historia
- **Priority**: Medium
- **Status**: Concept V1
- **Created**: 2025-11-18T01:08:59.525+0100
- **Jira Link**: [View in Jira](https://alkitu.atlassian.net/browse/ALI-26)

## Description

**URL:** `/app/dashboard`

**User Story Intro:**

Como empleado, quiero ver claramente todas las solicitudes que me han sido asignadas y su estado, para organizar mi trabajo diario y priorizar tareas.

**Funciones:**

* **Ver lista de solicitudes asignadas a mí**

    \[Consulta de solicitudes donde `assignedToId = me`, p.ej. `GET /app/requests?assignedToId=me`\]


* **Ver el estado actual de cada solicitud**

    \[status visible como PENDING / ONGOING / COMPLETED / CANCELLED en la lista\]


* **Filtrar solicitudes por estado (opcional)**

    \[Parámetros como `?status=PENDING` o `?status=ONGOING` sobre las asignadas\]


* **Acceder al detalle de una solicitud para trabajarla**

    \[Click → `/app/requests/:requestId` usando `GET /app/requests/:requestId`\]





## Implementation Notes

_This section will be filled during implementation planning_

## Acceptance Criteria

_To be defined_

## Related Issues

_To be linked_

## Resources

- [Spec Directory](./specs/ALI-26/)
