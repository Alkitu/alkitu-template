# ALI-47: dev Profile – “My Account Settings” [Admin]

## Issue Information
- **Type**: Historia
- **Priority**: Medium
- **Status**: Discovery
- **Created**: 2025-11-18T01:36:11.567+0100
- **Jira Link**: [View in Jira](https://alkitu.atlassian.net/browse/ALI-47)

## Description

**URL:** `/app/profile`

**User Story Intro:**

Como administrador, quiero actualizar mis datos personales y credenciales y tener acceso rápido a cerrar sesión cuando sea necesario.

**Funciones:**

* **Ver y actualizar mis datos personales**

    \[Consulta con `GET /app/profile` y edición mediante `PUT /app/profile`\]


* **Cambiar mi contraseña**

    \[Acción con `PUT /app/profile/password` usando credenciales actuales y nuevas\]


* **Cerrar sesión**

    \[Logout mediante endpoint del auth provider, e.g. `POST /auth/logout` o similar\]





## Implementation Notes

_This section will be filled during implementation planning_

## Acceptance Criteria

_To be defined_

## Related Issues

_To be linked_

## Resources

- [Spec Directory](./specs/ALI-47/)
