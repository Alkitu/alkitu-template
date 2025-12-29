# ALI-23: dev Password Reset – “Recover Your Access”

## Issue Information
- **Type**: Historia
- **Priority**: Medium
- **Status**: Concept V1
- **Created**: 2025-11-18T00:58:14.195+0100
- **Jira Link**: [View in Jira](https://alkitu.atlassian.net/browse/ALI-23)

## Description

**URL:** `/password-reset`

**User Story Intro:**

Como usuario que olvidó su contraseña, quiero recuperarla fácilmente para poder volver a iniciar sesión.

**Funciones:**

* **Solicitar correo de recuperación de contraseña**

    \[Formulario con email → `POST /auth/password-reset/request`\]


* **Ver confirmación de que se envió el correo**

    \[Feedback basado en respuesta del backend\]


* **Definir una nueva contraseña desde el enlace recibido por email**

    \[Formulario de nueva contraseña → `POST /auth/password-reset/confirm`\]


* **Regresar a la pantalla de Login para iniciar sesión con la nueva contraseña**

    \[Enlace → `/login`\]





## Implementation Notes

_This section will be filled during implementation planning_

## Acceptance Criteria

_To be defined_

## Related Issues

_To be linked_

## Resources

- [Spec Directory](./specs/ALI-23/)
