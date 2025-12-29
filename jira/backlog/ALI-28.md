# ALI-28: dev Admin Dashboard – “Operations & Metrics Overview” [Admin]

## Issue Information
- **Type**: Historia
- **Priority**: Medium
- **Status**: Concept V1
- **Created**: 2025-11-18T01:12:30.681+0100
- **Jira Link**: [View in Jira](https://alkitu.atlassian.net/browse/ALI-28)

## Description

**URL:** `/app/dashboard`

**User Story Intro:**

Como administrador, quiero ver un resumen operativo de las solicitudes y acceder rápidamente al detalle de cada una para gestionar su avance de forma eficiente.

**Funciones:**

* **Ver resumen de solicitudes por estado**

    \[Agrupación visual basada en datos obtenidos vía `GET /app/requests?groupBy=status`\]


* **Ver últimas solicitudes creadas**

    \[Listado resumido con `GET /app/requests?limit=10&sort=-createdAt`\]


* **Acceder al detalle completo de una solicitud**

    \[Click → navegación a `/app/requests/:requestId` usando `GET /app/requests/:requestId`\]


* **Acceso rápido al calendario operativo**

    \[Botón o link hacia `/app/calendar`\]


* **Acceso rápido a módulos de administración (Servicios, Usuarios, Plantillas)**

    \[Links a `/app/services`, `/app/users`, `/app/email-templates`\]





## Implementation Notes

_This section will be filled during implementation planning_

## Acceptance Criteria

_To be defined_

## Related Issues

_To be linked_

## Resources

- [Spec Directory](./specs/ALI-28/)
