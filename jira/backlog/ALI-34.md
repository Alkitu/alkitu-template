# ALI-34: dev Notifications – “My Notifications Center” [Employee]

## Issue Information
- **Type**: Historia
- **Priority**: Medium
- **Status**: Concept V1
- **Created**: 2025-11-18T01:20:14.135+0100
- **Jira Link**: [View in Jira](https://alkitu.atlassian.net/browse/ALI-34)

## Description

**URL:** `/app/notifications`

**User Story Intro:**

Como empleado, quiero recibir y revisar notificaciones cuando se me asigna una solicitud o se actualiza su estado, para mantenerme al día sin tener que revisar manualmente todas las tareas.

**Funciones:**

* **Ver lista de mis notificaciones recientes**

    \[GET /app/notifications (filtradas por el usuario autenticado)\]


* **Abrir la solicitud relacionada desde la notificación**

    \[Cada notificación incluye un enlace a `/app/requests/:requestId`\]


* **Marcar notificaciones como leídas**

    \[Actualización con `PUT /app/notifications/:notificationId/read`\]





## Implementation Notes

_This section will be filled during implementation planning_

## Acceptance Criteria

_To be defined_

## Related Issues

_To be linked_

## Resources

- [Spec Directory](./specs/ALI-34/)
