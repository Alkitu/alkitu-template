# ALI-43: dev Request Detail – “Job Details & Completion” [Employee]

## Issue Information
- **Type**: Historia
- **Priority**: Medium
- **Status**: Concept V1
- **Created**: 2025-11-18T01:31:50.056+0100
- **Jira Link**: [View in Jira](https://alkitu.atlassian.net/browse/ALI-43)

## Description

**URL:** `/app/requests/:requestId`

**User Story Intro:**

Como empleado, quiero ver toda la información necesaria de la solicitud que debo ejecutar y poder marcarla como completada, dejando notas y evidencias del trabajo realizado.

**Funciones:**

* **Ver todos los detalles del trabajo a realizar**

    \[GET /app/requests/:requestId → servicio, ubicación, datos del cliente, formulario enviado (templateResponses)\]


* **Ver en qué estado se encuentra la solicitud**

    \[status: PENDING / ONGOING / COMPLETED / CANCELLED\]


* **Ver que yo soy el empleado asignado**

    \[Mostrar nombre del empleado asignado vinculado a la sesión actual\]


* **Consultar instrucciones específicas del cliente**

    \[Lectura de campos del formulario dinámico (notes, selects, uploads, etc.)\]


* **Añadir notas y evidencias del trabajo realizado**

    \[Envió de información a `note` (texto, fotos, etc.) mediante `PUT /app/requests/:requestId`\]


* **Marcar la solicitud como completada**

    \[Acción que actualiza `status = COMPLETED` y registra `completedAt` vía `PUT /app/requests/:requestId`\]





## Implementation Notes

_This section will be filled during implementation planning_

## Acceptance Criteria

_To be defined_

## Related Issues

_To be linked_

## Resources

- [Spec Directory](./specs/ALI-43/)
