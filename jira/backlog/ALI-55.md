# ALI-55: dev Calendar – “Execution Schedule Planner” [Admin]

## Issue Information
- **Type**: Historia
- **Priority**: Medium
- **Status**: Concept V1
- **Created**: 2025-11-18T01:54:56.548+0100
- **Jira Link**: [View in Jira](https://alkitu.atlassian.net/browse/ALI-55)

## Description

**URL:** `/app/calendar`

**User Story Intro:**

Como administrador, quiero visualizar todas las ejecuciones programadas en un calendario para coordinar fechas y evitar conflictos operativos.

**Funciones:**

* **Ver el calendario con las solicitudes programadas**

    \[Carga de eventos mediante `GET /app/calendar?from=...&to=...` basado en fechas\]


* **Abrir el detalle de una solicitud desde el calendario**

    \[Click en evento → `/app/requests/:requestId` ejecutando `GET /app/requests/:requestId`\]


* **Reprogramar fecha y hora de una solicitud (si se permite)**

    \[Actualización de `executionDateTime` vía `PUT /app/requests/:requestId`\]





## Implementation Notes

_This section will be filled during implementation planning_

## Acceptance Criteria

_To be defined_

## Related Issues

_To be linked_

## Resources

- [Spec Directory](./specs/ALI-55/)
