# ALI-35: dev Notifications – “My Notifications Center” [Admin]

## Issue Information
- **Type**: Historia
- **Priority**: Medium
- **Status**: Discovery
- **Created**: 2025-11-18T01:21:07.316+0100
- **Jira Link**: [View in Jira](https://alkitu.atlassian.net/browse/ALI-35)

## Description

**URL:** `/app/notifications`

**User Story Intro:**

Como administrador, quiero revisar todas las notificaciones importantes para reaccionar a tiempo cuando un cliente crea una solicitud, cambia su estado o solicita una cancelación.

**Funciones:**

* **Ver lista de notificaciones del administrador**

    \[Consulta con `GET /app/notifications`\]


* **Abrir la solicitud relacionada desde la notificación**

    \[Link a `/app/requests/:requestId` usando `Notification.data.requestId`\]


* **Marcar una notificación como leída**

    \[Actualización con `PUT /app/notifications/:notificationId/read`\]





## Implementation Notes

_This section will be filled during implementation planning_

## Acceptance Criteria

_To be defined_

## Related Issues

_To be linked_

## Resources

- [Spec Directory](./specs/ALI-35/)
