# ALI-57: dev Email Automation – “Email Templates Manager” [Admin]

## Issue Information
- **Type**: Historia
- **Priority**: Medium
- **Status**: Concept V1
- **Created**: 2025-11-18T01:56:19.320+0100
- **Jira Link**: [View in Jira](https://alkitu.atlassian.net/browse/ALI-57)

## Description

**URL principal:** `/app/email-templates`

**URL detalle:** `/app/email-templates/:templateId`

**User Story Intro:**

Como administrador, quiero crear y editar las plantillas de correo automáticas para mantener una comunicación profesional y consistente en todo el proceso operativo.

**Funciones:**

* **Ver lista de plantillas disponibles**

    \[Consulta con `GET /app/email-templates`\]


* **Crear una nueva plantilla de email**

    \[Uso de `POST /app/email-templates`\]


* **Editar una plantilla existente**

    \[Lectura mediante `GET /app/email-templates/:templateId` y edición vía `PUT /app/email-templates/:templateId`\]


* **Eliminar una plantilla**

    \[Borrado con `DELETE /app/email-templates/:templateId`\]


* **Configurar el trigger del email (evento que dispara la plantilla)**

    \[Selección de `trigger` (`ON_REQUEST_CREATED`, `ON_STATUS_CHANGED`) y asignación opcional de `status`\]





## Implementation Notes

_This section will be filled during implementation planning_

## Acceptance Criteria

_To be defined_

## Related Issues

_To be linked_

## Resources

- [Spec Directory](./specs/ALI-57/)
