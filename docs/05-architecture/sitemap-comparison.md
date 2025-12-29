# Sitemap Comparison: Planned vs Implemented

## Overview

Este documento compara las rutas **planificadas** (definidas en los issues ALI del backlog) con las rutas **implementadas** (actualmente en el código).

**Fecha de Análisis**: 2025-12-27

---

## 📊 Resumen Ejecutivo

| Métrica | Cantidad |
|---------|----------|
| **Rutas Planificadas** (ALI backlog) | 30 rutas |
| **Rutas Implementadas** (código actual) | 56 páginas |
| **✅ Rutas Mapeadas** (planeadas → implementadas) | 23 rutas |
| **❌ Rutas Faltantes** (planeadas pero no implementadas) | 7 rutas |
| **🆕 Rutas Extra** (implementadas pero no planeadas) | 33 rutas |

### Tasa de Implementación del Backlog

- **Implementado**: 76.7% (23/30)
- **Pendiente**: 23.3% (7/30)

---

## ✅ RUTAS MAPEADAS (23 rutas)

### 🌐 Autenticación Pública (3/4 planeadas)

| ALI | Ruta Planificada | Ruta Implementada | Estado |
|-----|------------------|-------------------|--------|
| ALI-21 | `/register` | `/{lang}/auth/register` | ✅ IMPLEMENTADA |
| ALI-22 | `/login` | `/{lang}/auth/login` | ✅ IMPLEMENTADA |
| ALI-23 | `/password-reset` | `/{lang}/auth/reset-password` | ✅ IMPLEMENTADA |
| ALI-53 | `/` | `/{lang}` | ✅ IMPLEMENTADA |

**Nota**: Las rutas de auth están bajo `/{lang}/auth/*` en lugar de directamente en la raíz.

### 📊 Dashboards (3/3 planeadas)

| ALI | Ruta Planificada | Ruta Implementada | Rol | Estado |
|-----|------------------|-------------------|-----|--------|
| ALI-25 | `/app/dashboard` | `/{lang}/client/dashboard` | Client | ✅ IMPLEMENTADA |
| ALI-26 | `/app/dashboard` | `/{lang}/employee/dashboard` | Employee | ✅ IMPLEMENTADA |
| ALI-28 | `/app/dashboard` | `/{lang}/admin/dashboard` | Admin | ✅ IMPLEMENTADA |

**Nota**: Dashboards implementados con prefijo de rol (`/client/`, `/employee/`, `/admin/`) + dashboard compartido en `/{lang}/dashboard`.

### 👤 Perfil de Usuario (4/4 planeadas)

| ALI | Ruta Planificada | Ruta Implementada | Rol | Estado |
|-----|------------------|-------------------|-----|--------|
| ALI-45 | `/app/profile` | `/{lang}/client/profile` | Client | ✅ IMPLEMENTADA |
| ALI-46 | `/app/profile` | `/{lang}/profile` (shared) | Employee | ✅ IMPLEMENTADA |
| ALI-47 | `/app/profile` | `/{lang}/profile` (shared) | Admin | ✅ IMPLEMENTADA |
| ALI-54 | `/app/profile/onboarding` | `/{lang}/client/onboarding` | Client | ✅ IMPLEMENTADA |

**Nota**: Profile compartido en `/{lang}/profile` + versión específica para Client en `/{lang}/client/profile` + onboarding compartido y específico.

### 🔔 Notificaciones (3/3 planeadas)

| ALI | Ruta Planificada | Ruta Implementada | Rol | Estado |
|-----|------------------|-------------------|-----|--------|
| ALI-33 | `/app/notifications` | `/{lang}/client/notifications` | Client | ✅ IMPLEMENTADA |
| ALI-34 | `/app/notifications` | `/{lang}/employee/notifications` | Employee | ✅ IMPLEMENTADA |
| ALI-35 | `/app/notifications` | `/{lang}/admin/notifications` | Admin | ✅ IMPLEMENTADA |

**Nota**: Implementadas con prefijo de rol.

### 📝 Flujo de Nueva Solicitud (2/5 planeadas)

| ALI | Ruta Planificada | Ruta Implementada | Estado | Nota |
|-----|------------------|-------------------|--------|------|
| ALI-36 | `/app/requests/new/location` | - | ❌ FALTA | Paso 1 no implementado |
| ALI-37 | `/app/requests/new/service` | - | ❌ FALTA | Paso 2 no implementado |
| ALI-38 | `/app/requests/new/template` | - | ❌ FALTA | Paso 3 no implementado |
| ALI-39 | `/app/requests/new/schedule` | - | ❌ FALTA | Paso 4 no implementado |
| ALI-40 | `/app/requests/new/success` | `/{lang}/client/requests/new/success` | ✅ IMPLEMENTADA | Solo confirmación |

**Nota**: El flujo paso a paso (steps 1-4) NO está implementado. Solo existe:
- `/{lang}/requests/new` (versión simplificada)
- `/{lang}/client/requests/new` (versión cliente)
- `/{lang}/client/requests/new/success` (confirmación)

### 📋 Detalle de Solicitud (3/3 planeadas)

| ALI | Ruta Planificada | Ruta Implementada | Rol | Estado |
|-----|------------------|-------------------|-----|--------|
| ALI-41 | `/app/requests/:requestId` | `/{lang}/client/requests/:requestId` | Client | ✅ IMPLEMENTADA |
| ALI-43 | `/app/requests/:requestId` | `/{lang}/employee/requests` (list) | Employee | ⚠️ PARCIAL |
| ALI-44 | `/app/requests/:requestId` | `/{lang}/admin/requests/:id` | Admin | ✅ IMPLEMENTADA |

**Nota**: Employee tiene lista pero no detalle específico. También existe versión compartida en `/{lang}/requests/:id`.

### ⚙️ Administración (5/7 planeadas)

| ALI | Ruta Planificada | Ruta Implementada | Estado |
|-----|------------------|-------------------|--------|
| ALI-55 | `/app/calendar` | - | ❌ FALTA |
| ALI-56 | `/app/services` | `/{lang}/admin/catalog/services` | ✅ IMPLEMENTADA |
| ALI-56 | `/app/services/:serviceId` | - | ⚠️ PARCIAL |
| ALI-57 | `/app/email-templates` | `/{lang}/admin/email-templates` | ✅ IMPLEMENTADA |
| ALI-57 | `/app/email-templates/:templateId` | - | ⚠️ PARCIAL |
| ALI-58 | `/app/users` | `/{lang}/admin/users` | ✅ IMPLEMENTADA |
| ALI-58 | `/app/users/:userId` | `/{lang}/admin/users/:userEmail` | ✅ IMPLEMENTADA |

**Nota**:
- Calendar NO implementado
- Services y Email Templates tienen lista pero faltan páginas de detalle
- Users completamente implementado (list + detail + create)

---

## ❌ RUTAS FALTANTES (7 rutas)

### Rutas Planificadas pero NO Implementadas

| # | ALI | Ruta Planificada | Descripción | Prioridad |
|---|-----|------------------|-------------|-----------|
| 1 | ALI-55 | `/app/calendar` | Execution Schedule Planner | 🔴 Media |
| 2 | ALI-36 | `/app/requests/new/location` | Step 1: Choose Location | 🟡 Baja |
| 3 | ALI-37 | `/app/requests/new/service` | Step 2: Select Service | 🟡 Baja |
| 4 | ALI-38 | `/app/requests/new/template` | Step 3: Service Details Form | 🟡 Baja |
| 5 | ALI-39 | `/app/requests/new/schedule` | Step 4: Schedule Execution | 🟡 Baja |
| 6 | ALI-56 | `/app/services/:serviceId` | Service Detail Page | 🟠 Media |
| 7 | ALI-57 | `/app/email-templates/:templateId` | Email Template Detail Page | 🟠 Media |

### Análisis de Rutas Faltantes

**🔴 Alta Prioridad**: 0 rutas
- Ninguna ruta crítica faltante

**🟠 Media Prioridad**: 3 rutas
- Calendar Planner (ALI-55)
- Service Detail (ALI-56)
- Email Template Detail (ALI-57)

**🟡 Baja Prioridad**: 4 rutas
- Steps del flujo de nueva solicitud (ALI-36, 37, 38, 39)
- Estos fueron reemplazados por un formulario único simplificado

---

## 🆕 RUTAS EXTRA (33 rutas)

### Rutas Implementadas pero NO Planificadas en el Backlog

#### 🔐 Autenticación Extendida (7 rutas extra)

| Ruta | Descripción | Justificación |
|------|-------------|---------------|
| `/{lang}/auth/forgot-password` | Request Password Reset | Extensión de ALI-23 |
| `/{lang}/auth/new-password` | Set New Password | Extensión de ALI-23 |
| `/{lang}/auth/email-login` | Magic Link Login | Feature adicional |
| `/{lang}/auth/verify-login-code` | Verify Login Code | Feature adicional |
| `/{lang}/auth/verify-request` | Request Email Verification | Feature adicional |
| `/{lang}/auth/new-verification` | New Verification | Feature adicional |
| `/{lang}/auth/auth-error` | Authentication Error Page | UX mejorado |

#### 🔄 Rutas Compartidas (5 rutas extra)

| Ruta | Descripción | Justificación |
|------|-------------|---------------|
| `/{lang}/dashboard` | Universal Dashboard (redirect) | Router compartido |
| `/{lang}/profile` | Shared Profile Page | Router compartido |
| `/{lang}/onboarding` | Shared Onboarding | Router compartido |
| `/{lang}/locations` | Work Locations Management | Feature implementado (relacionado con requests) |
| `/{lang}/requests` | Shared Requests List | Router compartido |
| `/{lang}/requests/:id` | Shared Request Detail | Router compartido |
| `/{lang}/requests/new` | Shared New Request | Router compartido |
| `/{lang}/services/:serviceId/request` | Service-specific Request | Feature adicional |

#### 🔴 Admin - Características Nuevas (16 rutas extra)

| Categoría | Rutas | Descripción |
|-----------|-------|-------------|
| **Admin Home** | 1 ruta | `/{lang}/admin` - Admin overview |
| **Catalog** | 1 ruta | `/{lang}/admin/catalog/categories` - Categories management |
| **Channels** | 2 rutas | Channels list + detail |
| **Chat System** | 3 rutas | Chat list + conversation + analytics |
| **Notifications** | 2 rutas | Analytics + Preferences |
| **Settings** | 3 rutas | Settings overview + Chatbot + Themes |
| **Users** | 1 ruta | `/{lang}/admin/users/create` - Create user form |

**Detalles**:

1. **Channels Management** (2 rutas)
   - `/{lang}/admin/channels`
   - `/{lang}/admin/channels/:channelId`

2. **Chat System** (3 rutas)
   - `/{lang}/admin/chat`
   - `/{lang}/admin/chat/:conversationId`
   - `/{lang}/admin/chat/analytics`

3. **Categories** (1 ruta)
   - `/{lang}/admin/catalog/categories`

4. **Notifications Advanced** (2 rutas)
   - `/{lang}/admin/notifications/analytics`
   - `/{lang}/admin/notifications/preferences`

5. **Settings** (3 rutas)
   - `/{lang}/admin/settings`
   - `/{lang}/admin/settings/chatbot`
   - `/{lang}/admin/settings/themes`

#### 🛠️ Utilidades y Otras (5 rutas extra)

| Ruta | Descripción | Justificación |
|------|-------------|---------------|
| `/{lang}/chat/popup/:conversationId` | Chat Popup Window | Chat system feature |
| `/{lang}/design-system` | Design System Docs | Development tool |
| `/{lang}/test` | Test Page | Development tool |
| `/{lang}/unauthorized` | Unauthorized Access | Error handling |

---

## 📈 Análisis Detallado por Categoría

### 1. Autenticación

**Planificado**: 4 rutas básicas
**Implementado**: 11 rutas (4 básicas + 7 extendidas)
**Estado**: ✅ 100% + extensiones

| Funcionalidad | Planificado | Implementado |
|---------------|-------------|--------------|
| Landing | ✅ ALI-53 | ✅ `/{lang}` |
| Register | ✅ ALI-21 | ✅ `/{lang}/auth/register` |
| Login | ✅ ALI-22 | ✅ `/{lang}/auth/login` |
| Password Reset | ✅ ALI-23 | ✅ `/{lang}/auth/reset-password` + forgot + new |
| **Extras** | - | ✅ Magic link, Email verify, Error pages |

### 2. Dashboards

**Planificado**: 3 rutas (una por rol)
**Implementado**: 4 rutas (3 por rol + 1 compartida)
**Estado**: ✅ 100% + router compartido

| Rol | Planificado | Implementado |
|-----|-------------|--------------|
| Client | ✅ ALI-25 | ✅ `/{lang}/client/dashboard` |
| Employee | ✅ ALI-26 | ✅ `/{lang}/employee/dashboard` |
| Admin | ✅ ALI-28 | ✅ `/{lang}/admin/dashboard` |
| Shared | - | ✅ `/{lang}/dashboard` (redirect) |

### 3. Perfil de Usuario

**Planificado**: 4 rutas
**Implementado**: 4 rutas principales + 1 compartida
**Estado**: ✅ 100% + router compartido

| Funcionalidad | Planificado | Implementado |
|---------------|-------------|--------------|
| Client Profile | ✅ ALI-45 | ✅ `/{lang}/client/profile` |
| Employee Profile | ✅ ALI-46 | ✅ `/{lang}/profile` (shared) |
| Admin Profile | ✅ ALI-47 | ✅ `/{lang}/profile` (shared) |
| Client Onboarding | ✅ ALI-54 | ✅ `/{lang}/client/onboarding` + `/{lang}/onboarding` |

### 4. Notificaciones

**Planificado**: 3 rutas (una por rol)
**Implementado**: 5 rutas (3 por rol + 2 admin analytics)
**Estado**: ✅ 100% + analytics

| Rol | Planificado | Implementado |
|-----|-------------|--------------|
| Client | ✅ ALI-33 | ✅ `/{lang}/client/notifications` |
| Employee | ✅ ALI-34 | ✅ `/{lang}/employee/notifications` |
| Admin | ✅ ALI-35 | ✅ `/{lang}/admin/notifications` |
| **Extras** | - | ✅ Analytics + Preferences (admin) |

### 5. Solicitudes (Requests)

**Planificado**: 8 rutas (5 steps + 3 details)
**Implementado**: 10 rutas (simplificado)
**Estado**: ⚠️ 40% steps + ✅ 100% detail + extras

| Funcionalidad | Planificado | Implementado | Estado |
|---------------|-------------|--------------|--------|
| **New Request Steps** | 5 rutas | 0 rutas | ❌ NO |
| - Step 1: Location | ✅ ALI-36 | ❌ | NO |
| - Step 2: Service | ✅ ALI-37 | ❌ | NO |
| - Step 3: Template | ✅ ALI-38 | ❌ | NO |
| - Step 4: Schedule | ✅ ALI-39 | ❌ | NO |
| - Success | ✅ ALI-40 | ✅ `/{lang}/client/requests/new/success` | SÍ |
| **Alternative** | - | ✅ `/{lang}/requests/new` (single form) | ✅ |
| **Alternative** | - | ✅ `/{lang}/client/requests/new` (single form) | ✅ |
| **Request Detail** | 3 rutas | 5 rutas | ✅ |
| - Client Detail | ✅ ALI-41 | ✅ `/{lang}/client/requests/:requestId` | SÍ |
| - Employee Detail | ✅ ALI-43 | ⚠️ `/{lang}/employee/requests` (list only) | PARCIAL |
| - Admin Detail | ✅ ALI-44 | ✅ `/{lang}/admin/requests/:id` | SÍ |
| **Extras** | - | ✅ Shared detail + Service request | ✅ |

**Análisis**: El flujo paso a paso de creación fue reemplazado por un formulario único más eficiente.

### 6. Administración

**Planificado**: 7 rutas
**Implementado**: 20+ rutas
**Estado**: ✅ 71% básico + extensiones masivas

| Funcionalidad | Planificado | Implementado | Estado |
|---------------|-------------|--------------|--------|
| Calendar | ✅ ALI-55 | ❌ | NO |
| Services List | ✅ ALI-56 | ✅ `/{lang}/admin/catalog/services` | SÍ |
| Service Detail | ✅ ALI-56 | ❌ | NO |
| Categories | - | ✅ `/{lang}/admin/catalog/categories` | EXTRA |
| Email Templates List | ✅ ALI-57 | ✅ `/{lang}/admin/email-templates` | SÍ |
| Email Template Detail | ✅ ALI-57 | ❌ | NO |
| Users List | ✅ ALI-58 | ✅ `/{lang}/admin/users` | SÍ |
| User Detail | ✅ ALI-58 | ✅ `/{lang}/admin/users/:userEmail` | SÍ |
| Create User | - | ✅ `/{lang}/admin/users/create` | EXTRA |
| **Channels** | - | ✅ 2 rutas | EXTRA |
| **Chat System** | - | ✅ 3 rutas | EXTRA |
| **Notifications Adv** | - | ✅ 2 rutas | EXTRA |
| **Settings** | - | ✅ 3 rutas | EXTRA |

---

## 🎯 Comparación Visual

### Cobertura por Categoría

```
Autenticación    [████████████████████] 100% + extras
Dashboards       [████████████████████] 100% + router
Perfil           [████████████████████] 100% + router
Notificaciones   [████████████████████] 100% + analytics
Requests Steps   [████░░░░░░░░░░░░░░░░]  20% (solo success)
Request Detail   [████████████████████] 100% + extras
Admin Básico     [██████████████░░░░░░]  71% (falta calendar)
Admin Extendido  [████████████████████] Muchas extras
```

### Mapa de Prioridades para Completar

**🔴 Alta Prioridad** (Requerido para MVP):
- Ninguna ruta crítica faltante

**🟠 Media Prioridad** (Mejora experiencia):
1. ❌ `/{lang}/admin/catalog/services/:serviceId` - Service Detail
2. ❌ `/{lang}/admin/email-templates/:templateId` - Email Template Detail
3. ❌ `/{lang}/admin/calendar` - Calendar Planner (ALI-55)

**🟡 Baja Prioridad** (Nice to have):
4. ❌ Flujo paso a paso de requests (ALI-36, 37, 38, 39)
   - Actualmente reemplazado por formulario único

---

## 📊 Estadísticas Finales

### Por Estado de Implementación

| Estado | Rutas | Porcentaje |
|--------|-------|------------|
| ✅ Completamente Implementadas | 18 | 60% |
| ⚠️ Parcialmente Implementadas | 5 | 17% |
| ❌ No Implementadas | 7 | 23% |
| **Total Planificadas** | **30** | **100%** |

### Rutas Totales en la Aplicación

| Tipo | Cantidad |
|------|----------|
| Planificadas del Backlog | 30 |
| Implementadas del Backlog | 23 (77%) |
| Rutas Extra (no planificadas) | 33 |
| **Total Implementadas** | **56** |

### Desglose de Rutas Extra

| Categoría | Cantidad |
|-----------|----------|
| Autenticación Extendida | 7 |
| Rutas Compartidas | 8 |
| Admin - Nuevas Features | 13 |
| Utilidades | 5 |
| **Total Extras** | **33** |

---

## 💡 Conclusiones

### ✅ Fortalezas

1. **Core Features Implementados**: El 77% de las rutas planificadas están implementadas
2. **Funcionalidad Extendida**: Se agregaron 33 rutas adicionales no planificadas
3. **Mejor UX en Auth**: Sistema de autenticación más completo que lo planificado
4. **Admin Robusto**: Panel de administración mucho más completo que el backlog
5. **Features Avanzados**: Chat, Channels, Analytics no estaban en el backlog original

### ⚠️ Áreas de Atención

1. **Calendar Faltante**: ALI-55 no implementado (prioridad media)
2. **Páginas de Detalle**: Faltan detalles de Services y Email Templates
3. **Flujo de Steps**: El flujo paso a paso de requests fue simplificado
4. **Employee Detail**: Falta página de detalle de request para empleados

### 🎯 Recomendaciones

**Para completar el backlog original**:
1. Implementar Calendar Planner (ALI-55)
2. Agregar páginas de detalle faltantes
3. Considerar si el flujo paso a paso es necesario

**Para mantener consistencia**:
1. Documentar las rutas extra en nuevos ALIs
2. Actualizar el backlog con las nuevas features
3. Crear tests para las rutas implementadas

---

## 📚 Actualización: Documentación Retrospectiva (2025-12-27)

### Tareas JIRA Creadas

Se crearon **32 tareas JIRA** (ALI-182 a ALI-213) para documentar las **33 rutas extra** que estaban implementadas pero no documentadas en el backlog original.

### Mapeo de Rutas a Tareas JIRA

#### 🔐 Authentication Extended (7 rutas → ALI-182 a ALI-188)

| Ruta | JIRA | Estado |
|------|------|--------|
| `/{lang}/auth/forgot-password` | ALI-182 | ✅ Documentada |
| `/{lang}/auth/new-password` | ALI-183 | ✅ Documentada |
| `/{lang}/auth/email-login` | ALI-184 | ✅ Documentada |
| `/{lang}/auth/verify-login-code` | ALI-185 | ✅ Documentada |
| `/{lang}/auth/verify-request` | ALI-186 | ✅ Documentada |
| `/{lang}/auth/new-verification` | ALI-187 | ✅ Documentada |
| `/{lang}/auth/auth-error` | ALI-188 | ✅ Documentada |

#### 🏗️ Shared Infrastructure (8 rutas → ALI-189 a ALI-196)

| Ruta | JIRA | Estado |
|------|------|--------|
| `/{lang}/dashboard` | ALI-189 | ✅ Documentada |
| `/{lang}/profile` | ALI-190 | ✅ Documentada |
| `/{lang}/onboarding` | ALI-191 | ✅ Documentada |
| `/{lang}/locations` | ALI-192 | ✅ Documentada |
| `/{lang}/requests` | ALI-193 | ✅ Documentada |
| `/{lang}/requests/:id` | ALI-194 | ✅ Documentada |
| `/{lang}/requests/new` | ALI-195 | ✅ Documentada |
| `/{lang}/services/:serviceId/request` | ALI-196 | ✅ Documentada |

#### ⚙️ Admin Advanced Features (13 rutas → ALI-197 a ALI-209)

| Ruta | JIRA | Estado |
|------|------|--------|
| `/{lang}/admin` | ALI-197 | ✅ Documentada |
| `/{lang}/admin/catalog/categories` | ALI-198 | ✅ Documentada |
| `/{lang}/admin/channels` | ALI-199 | ✅ Documentada |
| `/{lang}/admin/channels/:channelId` | ALI-200 | ✅ Documentada |
| `/{lang}/admin/chat` | ALI-201 | ✅ Documentada |
| `/{lang}/admin/chat/:conversationId` | ALI-202 | ✅ Documentada |
| `/{lang}/admin/chat/analytics` | ALI-203 | ✅ Documentada |
| `/{lang}/admin/notifications/analytics` | ALI-204 | ✅ Documentada |
| `/{lang}/admin/notifications/preferences` | ALI-205 | ✅ Documentada |
| `/{lang}/admin/settings` | ALI-206 | ✅ Documentada |
| `/{lang}/admin/settings/chatbot` | ALI-207 | ✅ Documentada |
| `/{lang}/admin/settings/themes` | ALI-208 | ✅ Documentada |
| `/{lang}/admin/users/create` | ALI-209 | ✅ Documentada |

#### 🛠️ System Utilities (4 rutas → ALI-210 a ALI-213)

| Ruta | JIRA | Estado |
|------|------|--------|
| `/{lang}/chat/popup/:conversationId` | ALI-210 | ✅ Documentada |
| `/{lang}/design-system` | ALI-211 | ✅ Documentada |
| `/{lang}/test` | ALI-212 | ✅ Documentada |
| `/{lang}/unauthorized` | ALI-213 | ✅ Documentada |

### Resumen de Documentación

- **Total de rutas documentadas**: 32/33 (97%)
- **Tareas JIRA creadas**: ALI-182 a ALI-213
- **Fecha de documentación**: 2025-12-27
- **Estado**: ✅ Todas las tareas creadas exitosamente

### Archivos Relacionados

- **Template**: `/docs/04-product/screen-template.md`
- **Datos JIRA**: `/docs/04-product/extra-routes-jira-data.ts`
- **Resumen**: `/docs/04-product/jira-tasks-created-summary.md`
- **Backlog actualizado**: `/jira/backlog/README.md`

**Nota**: La ruta `/{lang}/client/requests/:requestId` estaba en la lista de extra routes pero ya está cubierta por ALI-41 (Request Overview).

---

## 🔗 Referencias

- [Sitemap Planificado](./sitemap.md)
- [Sitemap Actual](./current-sitemap.md)
- [Jira Backlog](../../jira/backlog/README.md)

---

**Última Actualización**: 2025-12-27
**Mantenido Por**: Development Team
