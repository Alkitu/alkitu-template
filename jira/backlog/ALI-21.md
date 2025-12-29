# ALI-21: dev Register – “Create Your Account” [Global]

## Issue Information
- **Type**: Historia
- **Priority**: Medium
- **Status**: Concept V1
- **Created**: 2025-11-18T00:57:42.242+0100
- **Jira Link**: [View in Jira](https://alkitu.atlassian.net/browse/ALI-21)

## Description

**URL:** `/register`

**User Story Intro:**

Como nuevo usuario, quiero crear una cuenta de forma sencilla para poder empezar a utilizar la plataforma.

**Funciones:**

* **Crear cuenta con los datos mínimos (email + contraseña)**

    \[Formulario → `POST /auth/register`\]


* **Ver confirmación de que la cuenta fue creada**

    \[Feedback posterior a la respuesta del backend\]


* **Ser dirigido al onboarding para completar mi perfil**

    \[Redirección → `/app/profile/onboarding` (profileComplete = false)\]


* **Acceder a la pantalla de Login si ya tengo cuenta**

    \[Enlace → `/login`\]





## Implementation Notes

_This section will be filled during implementation planning_

## Acceptance Criteria

_To be defined_

## Related Issues

_To be linked_

## Resources

- [Spec Directory](./specs/ALI-21/)
