# ALI-54: dev User Onboarding – “Complete Your Profile” [Client]

## Issue Information
- **Type**: Historia
- **Priority**: Medium
- **Status**: Concept V1
- **Created**: 2025-11-18T01:53:22.626+0100
- **Jira Link**: [View in Jira](https://alkitu.atlassian.net/browse/ALI-54)

## Description

**URL:** `/app/profile/onboarding`

_(O simplemente_ `/app/profile` _en modo obligatorio)_

**User Story Intro:**

Como cliente recién registrado, quiero completar los datos necesarios para poder crear solicitudes, asegurando que el equipo pueda contactarme y prestar el servicio adecuadamente.

**Campos obligatorios según BD (para permitir crear solicitudes):**

* firstname
* lastname
* phone
* address (Main Address)
* contactPerson: name, lastname, phone, email (si aplica)
* company (opcional)

**Funciones:**

* **Completar los datos obligatorios del perfil**

    \[POST/PUT → `/app/profile`\]


* **Ver validaciones visuales que indican qué falta por completar**

    \[Lógica UI basada en backend: profileComplete = false\]


* **Finalizar onboarding para desbloquear el área de solicitudes**

    \[Cuando los campos requeridos están completos → backend marca `profileComplete = true`\]


* **Cerrar sesión si no quiero continuar aún**

    \[POST /auth/logout\]





## Implementation Notes

_This section will be filled during implementation planning_

## Acceptance Criteria

_To be defined_

## Related Issues

_To be linked_

## Resources

- [Spec Directory](./specs/ALI-54/)
