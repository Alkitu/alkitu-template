# ALI-44: dev Request Detail – “Request Management & Assignment” [Admin]

## Issue Information
- **Type**: Historia
- **Priority**: Medium
- **Status**: Concept V1
- **Created**: 2025-11-18T01:32:59.391+0100
- **Jira Link**: [View in Jira](https://alkitu.atlassian.net/browse/ALI-44)

## Description

**URL:** `/app/requests/:requestId`

**User Story Intro:**

Como administrador, quiero ver todos los detalles de una solicitud y gestionarla completamente, incluyendo su estado, fecha, cancelaciones y empleado asignado.

**Funciones:**

* **Ver todos los detalles de la solicitud**

    \[Obtención con `GET /app/requests/:requestId`\]


* **Gestionar una solicitud de cancelación del cliente**

    \[Lectura de `cancellationRequested` y acciones vía `PUT /app/requests/:requestId`\]


* **Cambiar el estado de la solicitud**

    \[Actualización de `status` mediante `PUT /app/requests/:requestId`\]


* **Asignar o cambiar el empleado responsable**

    \[Selector que guarda `assignedToId` mediante `PUT /app/requests/:requestId`\]


* **Editar la fecha y hora de ejecución**

    \[Actualiza `executionDateTime` con `PUT /app/requests/:requestId`\]


* **Consultar notas y evidencias subidas por el empleado**

    \[Lectura del campo `note` (Json)\]





## Implementation Notes

_This section will be filled during implementation planning_

## Acceptance Criteria

_To be defined_

## Related Issues

_To be linked_

## Resources

- [Spec Directory](./specs/ALI-44/)
