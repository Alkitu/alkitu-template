# ALI-46: dev Profile – “My Account Settings” [Employee]

## Issue Information
- **Type**: Historia
- **Priority**: Medium
- **Status**: Concept V1
- **Created**: 2025-11-18T01:35:34.125+0100
- **Jira Link**: [View in Jira](https://alkitu.atlassian.net/browse/ALI-46)

## Description

**URL:** `/app/profile`

**User Story Intro:**

Como empleado, quiero mantener mis datos de perfil y credenciales actualizados y poder cerrar sesión cuando termine mi jornada.

**Funciones:**

* **Ver y editar mis datos personales básicos**

    \[Lectura con `GET /app/profile` y edición con `PUT /app/profile` (firstname, lastname, phone, email, etc.)\]


* **Cambiar mi contraseña de acceso**

    \[Acción mediante `PUT /app/profile/password` con contraseña actual y nueva\]


* **Cerrar sesión**

    \[Logout usando el endpoint del sistema de autenticación, por ejemplo `POST /auth/logout`\]





## Implementation Notes

_This section will be filled during implementation planning_

## Acceptance Criteria

_To be defined_

## Related Issues

_To be linked_

## Resources

- [Spec Directory](./specs/ALI-46/)
