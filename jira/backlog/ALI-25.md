# ALI-25: dev Client Dashboard – “My Service Requests” [Client]

## Issue Information
- **Type**: Historia
- **Priority**: Medium
- **Status**: Concept V1
- **Created**: 2025-11-18T01:07:50.970+0100
- **Jira Link**: [View in Jira](https://alkitu.atlassian.net/browse/ALI-25)

## Description

**URL:** `/app/dashboard`

**User Story Intro:**

Como cliente, quiero ver todas mis solicitudes organizadas por estado para entender su progreso y acceder rápidamente al detalle de cada una.

**Funciones:**

* **Ver lista de mis solicitudes activas y finalizadas**

    \[GET /app/requests?userId=me\]


* **Filtrar mis solicitudes por estado**

    \[PENDING, ONGOING, COMPLETED, CANCELLED → ?status=...\]


* **Acceder al detalle de una solicitud**

    \[Click → `/app/requests/:requestId` → GET /app/requests/:requestId\]


* **Crear una nueva solicitud**

    \[Botón → `/app/requests/new/location`\]





## Implementation Notes

_This section will be filled during implementation planning_

## Acceptance Criteria

_To be defined_

## Related Issues

_To be linked_

## Resources

- [Spec Directory](./specs/ALI-25/)
