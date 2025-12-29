# ALI-22: dev Login – “Sign In to Your Account” [Global]

## Issue Information
- **Type**: Historia
- **Priority**: Medium
- **Status**: Concept V1
- **Created**: 2025-11-18T00:57:56.370+0100
- **Jira Link**: [View in Jira](https://alkitu.atlassian.net/browse/ALI-22)

## Description

**URL:** `/login`

**User Story Intro:**

Como usuario, quiero iniciar sesión de manera segura para acceder a mi área protegida según mi rol.

**Funciones:**

* **Ingresar email y contraseña para autenticarme**

    \[Formulario → `POST /auth/login`\]


* **Ver mensajes de error si mis credenciales no son válidas**

    \[Respuesta del backend mostrada en UI\]


* **Recuperar acceso si olvidé mi contraseña**

    \[Enlace → `/password-reset`\]


* **Ser redirigido al dashboard correspondiente según rol**

    \[Login exitoso → `/app/dashboard` (con middleware role + profileComplete)\]





## Implementation Notes

_This section will be filled during implementation planning_

## Acceptance Criteria

_To be defined_

## Related Issues

_To be linked_

## Resources

- [Spec Directory](./specs/ALI-22/)
