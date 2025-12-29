# ALI-58: dev Users – “Team & Clients Management” [Admin]

## Issue Information
- **Type**: Historia
- **Priority**: Medium
- **Status**: Concept V1
- **Created**: 2025-11-18T01:56:58.210+0100
- **Jira Link**: [View in Jira](https://alkitu.atlassian.net/browse/ALI-58)

## Description

**URL principal:** `/app/users`

**URL detalle:** `/app/users/:userId`

**User Story Intro:**

Como administrador, quiero gestionar el equipo interno y visualizar a los clientes activos para tener un control completo del acceso y la operación del sistema.

**Funciones:**

### **Pestaña Team (Admins y Employees)**

* **Ver el listado del equipo (solo Admins y Employees)**

    \[Consulta con `GET /app/users?roles=ADMIN,EMPLOYEE`\]


* **Crear un usuario interno (Admin o Employee)**

    \[Formulario → `POST /app/users`\]


* **Editar datos o rol de un usuario interno**

    \[Acceso vía `GET /app/users/:userId` y guardado con `PUT /app/users/:userId`\]


* **Eliminar/desactivar un usuario del equipo**

    \[Acción con `DELETE /app/users/:userId`\]



### **Pestaña Clients (modo lectura, sin editar/eliminar)**

* **Ver listado de clientes registrados**

    \[Consulta con `GET /app/users?role=CLIENT`\]


* **Consultar información básica del cliente (solo lectura)**

    \[Vista general del perfil con `GET /app/users/:userId`, pero sin acciones de edición\]





## Implementation Notes

_This section will be filled during implementation planning_

## Acceptance Criteria

_To be defined_

## Related Issues

_To be linked_

## Resources

- [Spec Directory](./specs/ALI-58/)
