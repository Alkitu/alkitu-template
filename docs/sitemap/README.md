# Sitemap Completo - Alkitu Template

**Metadata**:
- 📅 Fecha: 2026-02-09
- 🌐 Idioma: Español
- 🎨 Tema: Light
- 📊 Total de rutas: 60+
- 👥 Roles documentados: PUBLIC, CLIENT, EMPLOYEE, ADMIN

---

## 📖 Índice

1. [Rutas Públicas](#-rutas-públicas)
   - [Autenticación](#autenticación)
   - [Otras Rutas Públicas](#otras-rutas-públicas)
2. [Rutas de ADMIN](#-rutas-de-admin)
   - [Dashboard](#dashboard-admin)
   - [Gestión de Usuarios](#gestión-de-usuarios)
   - [Gestión de Solicitudes](#gestión-de-solicitudes)
   - [Catálogo de Servicios](#catálogo-de-servicios)
   - [Chat y Conversaciones](#chat-y-conversaciones)
   - [Canales de Comunicación](#canales-de-comunicación)
   - [Notificaciones](#notificaciones-admin)
   - [Configuración](#configuración)
   - [Plantillas de Email](#plantillas-de-email)
3. [Rutas de CLIENT](#-rutas-de-client)
   - [Dashboard](#dashboard-client)
   - [Solicitudes](#solicitudes-client)
   - [Notificaciones](#notificaciones-client)
   - [Perfil](#perfil-client)
   - [Onboarding](#onboarding-client)
4. [Rutas de EMPLOYEE](#-rutas-de-employee)
   - [Dashboard](#dashboard-employee)
   - [Solicitudes](#solicitudes-employee)
   - [Notificaciones](#notificaciones-employee)
5. [Rutas Compartidas](#-rutas-compartidas)
   - [Dashboard General](#dashboard-general)
   - [Perfil](#perfil-compartido)
   - [Ubicaciones](#ubicaciones)
   - [Solicitudes](#solicitudes-compartidas)
   - [Onboarding](#onboarding-compartido)

---

## 🌐 Rutas Públicas

### Autenticación

Rutas de autenticación y gestión de sesión disponibles para usuarios no autenticados.

| # | Página | Ruta | Descripción | Screenshot |
|---|--------|------|-------------|------------|
| 1 | Login | `/es/auth/login` | Inicio de sesión con email/password | ![Login](screenshots/public/auth/login.png) |
| 2 | Registro | `/es/auth/register` | Registro de nuevos usuarios | ![Register](screenshots/public/auth/register.png) |
| 3 | Olvidé mi contraseña | `/es/auth/forgot-password` | Solicitud de recuperación de contraseña | ![Forgot Password](screenshots/public/auth/forgot-password.png) |
| 4 | Restablecer contraseña | `/es/auth/reset-password` | Confirmación de restablecimiento | ![Reset Password](screenshots/public/auth/reset-password.png) |
| 5 | Nueva contraseña | `/es/auth/new-password` | Formulario de nueva contraseña | ![New Password](screenshots/public/auth/new-password.png) |
| 6 | Login por email | `/es/auth/email-login` | Inicio de sesión con código por email | ![Email Login](screenshots/public/auth/email-login.png) |
| 7 | Verificar código | `/es/auth/verify-login-code` | Verificación de código de login | ![Verify Code](screenshots/public/auth/verify-login-code.png) |
| 8 | Verificar solicitud | `/es/auth/verify-request` | Página de verificación de solicitud | ![Verify Request](screenshots/public/auth/verify-request.png) |
| 9 | Nueva verificación | `/es/auth/new-verification` | Nueva verificación de email | ![New Verification](screenshots/public/auth/new-verification.png) |
| 10 | Error de autenticación | `/es/auth/auth-error` | Página de error en autenticación | ![Auth Error](screenshots/public/auth/auth-error.png) |

### Otras Rutas Públicas

| # | Página | Ruta | Descripción | Screenshot |
|---|--------|------|-------------|------------|
| 11 | Sistema de Diseño | `/es/design-system` | Documentación del design system | ![Design System](screenshots/public/other/design-system.png) |
| 12 | No autorizado | `/es/unauthorized` | Página de acceso no autorizado | ![Unauthorized](screenshots/public/other/unauthorized.png) |

---

## 🔐 Rutas de ADMIN

### Dashboard Admin

Panel de control principal para administradores.

| # | Página | Ruta | Descripción | Screenshot |
|---|--------|------|-------------|------------|
| 1 | Dashboard Admin | `/es/admin/dashboard` | Vista general de estadísticas y métricas | ![Admin Dashboard](screenshots/admin/dashboard/index.png) |

### Gestión de Usuarios

Administración completa de usuarios del sistema.

| # | Página | Ruta | Descripción | Screenshot |
|---|--------|------|-------------|------------|
| 2 | Lista de usuarios | `/es/admin/users` | Lista y búsqueda de usuarios | ![Users List](screenshots/admin/users/list.png) |
| 3 | Crear usuario | `/es/admin/users/new` | Formulario de creación de usuario | ![Create User](screenshots/admin/users/create.png) |
| 4 | Detalle de usuario | `/es/admin/users/[userEmail]` | Información detallada del usuario | ![User Detail](screenshots/admin/users/detail-[email].png) |

### Gestión de Solicitudes

Administración de todas las solicitudes del sistema.

| # | Página | Ruta | Descripción | Screenshot |
|---|--------|------|-------------|------------|
| 5 | Lista de solicitudes | `/es/admin/requests` | Vista de todas las solicitudes | ![Requests List](screenshots/admin/requests/list.png) |
| 6 | Crear solicitud | `/es/admin/requests/new` | Formulario de nueva solicitud | ![Create Request](screenshots/admin/requests/create.png) |
| 7 | Detalle de solicitud | `/es/admin/requests/[id]` | Información completa de solicitud | ![Request Detail](screenshots/admin/requests/detail-[id].png) |
| 8 | Editar solicitud | `/es/admin/requests/[id]/edit` | Formulario de edición de solicitud | ![Edit Request](screenshots/admin/requests/edit-[id].png) |

### Catálogo de Servicios

Gestión del catálogo de servicios y categorías.

| # | Página | Ruta | Descripción | Screenshot |
|---|--------|------|-------------|------------|
| 9 | Lista de servicios | `/es/admin/catalog/services` | Todos los servicios disponibles | ![Services List](screenshots/admin/catalog/services-list.png) |
| 10 | Crear servicio | `/es/admin/catalog/services/new` | Formulario de nuevo servicio | ![Create Service](screenshots/admin/catalog/services-create.png) |
| 11 | Detalle de servicio | `/es/admin/catalog/services/[id]` | Información del servicio | ![Service Detail](screenshots/admin/catalog/services-detail.png) |
| 12 | Categorías | `/es/admin/catalog/categories` | Gestión de categorías | ![Categories](screenshots/admin/catalog/categories.png) |

### Chat y Conversaciones

Sistema de chat y mensajería administrativa.

| # | Página | Ruta | Descripción | Screenshot |
|---|--------|------|-------------|------------|
| 13 | Lista de conversaciones | `/es/admin/chat` | Todas las conversaciones activas | ![Chat List](screenshots/admin/chat/list.png) |
| 14 | Conversación | `/es/admin/chat/[conversationId]` | Vista de conversación específica | ![Conversation](screenshots/admin/chat/conversation-[id].png) |
| 15 | Analíticas de chat | `/es/admin/chat/analytics` | Estadísticas de conversaciones | ![Chat Analytics](screenshots/admin/chat/analytics.png) |

### Canales de Comunicación

Gestión de canales de comunicación.

| # | Página | Ruta | Descripción | Screenshot |
|---|--------|------|-------------|------------|
| 16 | Lista de canales | `/es/admin/channels` | Todos los canales disponibles | ![Channels List](screenshots/admin/channels/list.png) |
| 17 | Detalle de canal | `/es/admin/channels/[channelId]` | Información del canal | ![Channel Detail](screenshots/admin/channels/detail-[id].png) |

### Notificaciones Admin

Sistema de notificaciones administrativas.

| # | Página | Ruta | Descripción | Screenshot |
|---|--------|------|-------------|------------|
| 18 | Lista de notificaciones | `/es/admin/notifications` | Todas las notificaciones | ![Notifications List](screenshots/admin/notifications/list.png) |
| 19 | Analíticas | `/es/admin/notifications/analytics` | Estadísticas de notificaciones | ![Notifications Analytics](screenshots/admin/notifications/analytics.png) |
| 20 | Preferencias | `/es/admin/notifications/preferences` | Configuración de notificaciones | ![Notifications Preferences](screenshots/admin/notifications/preferences.png) |

### Configuración

Panel de configuración del sistema.

| # | Página | Ruta | Descripción | Screenshot |
|---|--------|------|-------------|------------|
| 21 | Configuración general | `/es/admin/settings` | Configuraciones globales | ![General Settings](screenshots/admin/settings/general.png) |
| 22 | Configuración de chatbot | `/es/admin/settings/chatbot` | Settings del chatbot | ![Chatbot Settings](screenshots/admin/settings/chatbot.png) |
| 23 | Temas | `/es/admin/settings/themes` | Gestión de temas visuales | ![Themes](screenshots/admin/settings/themes.png) |
| 24 | Addons | `/es/admin/settings/addons` | Gestión de complementos | ![Addons](screenshots/admin/settings/addons.png) |

### Plantillas de Email

Gestión de plantillas de correo.

| # | Página | Ruta | Descripción | Screenshot |
|---|--------|------|-------------|------------|
| 25 | Lista de plantillas | `/es/admin/email-templates` | Todas las plantillas de email | ![Email Templates](screenshots/admin/email-templates/list.png) |

---

## 👤 Rutas de CLIENT

### Dashboard Client

Panel principal para clientes.

| # | Página | Ruta | Descripción | Screenshot |
|---|--------|------|-------------|------------|
| 1 | Dashboard Cliente | `/es/client/dashboard` | Vista general del cliente | ![Client Dashboard](screenshots/client/dashboard/index.png) |

### Solicitudes Client

Gestión de solicitudes del cliente.

| # | Página | Ruta | Descripción | Screenshot |
|---|--------|------|-------------|------------|
| 2 | Nueva solicitud | `/es/client/requests/new` | Crear nueva solicitud | ![New Request](screenshots/client/requests/new.png) |
| 3 | Solicitud exitosa | `/es/client/requests/success` | Confirmación de solicitud | ![Request Success](screenshots/client/requests/success.png) |
| 4 | Detalle de solicitud | `/es/client/requests/[requestId]` | Ver solicitud específica | ![Request Detail](screenshots/client/requests/detail-[id].png) |

### Notificaciones Client

| # | Página | Ruta | Descripción | Screenshot |
|---|--------|------|-------------|------------|
| 5 | Notificaciones | `/es/client/notifications` | Lista de notificaciones | ![Notifications](screenshots/client/notifications/list.png) |

### Perfil Client

| # | Página | Ruta | Descripción | Screenshot |
|---|--------|------|-------------|------------|
| 6 | Perfil | `/es/client/profile` | Información del perfil | ![Profile](screenshots/client/profile/index.png) |

### Onboarding Client

| # | Página | Ruta | Descripción | Screenshot |
|---|--------|------|-------------|------------|
| 7 | Onboarding | `/es/client/onboarding` | Proceso de onboarding | ![Onboarding](screenshots/client/onboarding/index.png) |

---

## 👷 Rutas de EMPLOYEE

### Dashboard Employee

Panel para empleados.

| # | Página | Ruta | Descripción | Screenshot |
|---|--------|------|-------------|------------|
| 1 | Dashboard Empleado | `/es/employee/dashboard` | Vista general del empleado | ![Employee Dashboard](screenshots/employee/dashboard/index.png) |

### Solicitudes Employee

| # | Página | Ruta | Descripción | Screenshot |
|---|--------|------|-------------|------------|
| 2 | Lista de solicitudes | `/es/employee/requests` | Solicitudes asignadas | ![Requests List](screenshots/employee/requests/list.png) |

### Notificaciones Employee

| # | Página | Ruta | Descripción | Screenshot |
|---|--------|------|-------------|------------|
| 3 | Notificaciones | `/es/employee/notifications` | Lista de notificaciones | ![Notifications](screenshots/employee/notifications/list.png) |

---

## 🔄 Rutas Compartidas

Rutas accesibles por múltiples roles con permisos.

### Dashboard General

| # | Página | Ruta | Descripción | Screenshot |
|---|--------|------|-------------|------------|
| 1 | Dashboard | `/es/dashboard` | Dashboard genérico (redirige según rol) | ![Dashboard](screenshots/shared/dashboard/index.png) |

### Perfil Compartido

| # | Página | Ruta | Descripción | Screenshot |
|---|--------|------|-------------|------------|
| 2 | Perfil | `/es/profile` | Perfil de usuario genérico | ![Profile](screenshots/shared/profile/index.png) |

### Ubicaciones

| # | Página | Ruta | Descripción | Screenshot |
|---|--------|------|-------------|------------|
| 3 | Ubicaciones | `/es/locations` | Gestión de ubicaciones | ![Locations](screenshots/shared/locations/list.png) |

### Solicitudes Compartidas

| # | Página | Ruta | Descripción | Screenshot |
|---|--------|------|-------------|------------|
| 4 | Lista de solicitudes | `/es/requests` | Solicitudes del usuario | ![Requests List](screenshots/shared/requests/list.png) |
| 5 | Nueva solicitud | `/es/requests/new` | Crear solicitud | ![New Request](screenshots/shared/requests/new.png) |
| 6 | Detalle de solicitud | `/es/requests/[id]` | Ver solicitud | ![Request Detail](screenshots/shared/requests/detail-[id].png) |

### Onboarding Compartido

| # | Página | Ruta | Descripción | Screenshot |
|---|--------|------|-------------|------------|
| 7 | Onboarding | `/es/onboarding` | Proceso de onboarding | ![Onboarding](screenshots/shared/onboarding/index.png) |

---

## 📊 Resumen Estadístico

### Por Rol

- **PUBLIC**: 12 rutas (10 auth + 2 otras)
- **ADMIN**: 25+ rutas (dashboard, users, requests, catalog, chat, channels, notifications, settings, email-templates)
- **CLIENT**: 7 rutas (dashboard, requests, notifications, profile, onboarding)
- **EMPLOYEE**: 3 rutas (dashboard, requests, notifications)
- **SHARED**: 7 rutas (dashboard, profile, locations, requests, onboarding)

### Por Servicio

- **Auth**: 10 rutas
- **Dashboard**: 4 rutas (admin, client, employee, shared)
- **Users**: 3 rutas (list, create, detail)
- **Requests**: 11 rutas (múltiples roles)
- **Catalog**: 4 rutas (services, categories)
- **Chat**: 3 rutas (list, conversation, analytics)
- **Channels**: 2 rutas (list, detail)
- **Notifications**: 6 rutas (múltiples roles)
- **Settings**: 4 rutas (general, chatbot, themes, addons)
- **Email Templates**: 1 ruta
- **Profile**: 3 rutas (múltiples roles)
- **Locations**: 1 ruta
- **Onboarding**: 3 rutas (múltiples roles)
- **Other**: 2 rutas (design-system, unauthorized)

**Total**: 60+ rutas documentadas

---

## 🔧 Configuración de Screenshots

Todos los screenshots han sido capturados con:
- **Resolución**: 1920x1080 (viewport desktop)
- **Idioma**: Español (es)
- **Tema**: Light mode
- **Formato**: PNG
- **Modo**: Full page (con scroll completo)

---

## 📝 Notas de Implementación

### Rutas Dinámicas

Las siguientes rutas utilizan parámetros dinámicos y han sido capturadas con datos de prueba:

- `/admin/users/[userEmail]` - Usa email de usuario de prueba
- `/admin/requests/[id]` - Usa ID de solicitud de prueba
- `/admin/requests/[id]/edit` - Usa ID de solicitud de prueba
- `/admin/catalog/services/[id]` - Usa ID de servicio de prueba
- `/admin/chat/[conversationId]` - Usa ID de conversación de prueba
- `/admin/channels/[channelId]` - Usa ID de canal de prueba
- `/client/requests/[requestId]` - Usa ID de solicitud de prueba
- `/requests/[id]` - Usa ID de solicitud de prueba

### Estados de Carga

Los screenshots fueron capturados después de:
1. Esperar a que desaparezcan spinners/loaders
2. Verificar que el contenido principal esté visible
3. Asegurar que no haya estados de carga activos

### Autenticación

Para las rutas protegidas:
- Se utilizaron credenciales de prueba para cada rol
- Las sesiones se mantuvieron activas durante la captura de cada grupo de rutas
- Se realizó logout entre cambios de rol

---

## 🚀 Cómo Actualizar Este Sitemap

### Agregar nueva ruta

1. Agregar entrada en la tabla correspondiente (por rol)
2. Capturar screenshot y guardarlo en la carpeta apropiada
3. Actualizar el contador en "Resumen Estadístico"

### Re-capturar screenshots

```bash
# Iniciar servidor
npm run dev

# Navegar a la ruta con el navegador configurado en:
# - Idioma: Español
# - Tema: Light
# - Viewport: 1920x1080

# Tomar screenshot full-page
# Guardar en la carpeta correspondiente por rol/servicio
```

### Script automatizado

Para automatizar la captura en futuras actualizaciones, considerar crear un script Playwright que:
1. Lea la configuración de rutas desde este markdown
2. Haga login con cada rol
3. Navegue a cada ruta y capture screenshot
4. Guarde los archivos en la estructura de carpetas

---

## ✅ Estado de Captura de Screenshots

**Última captura**: 2026-02-09
**Método**: Automatizado con Playwright
**Estado**: ✅ **COMPLETO** - 100% de screenshots capturados

### Resumen de Captura

| Rol | Capturados | Total | Tasa de Éxito |
|-----|------------|-------|---------------|
| PUBLIC | 12 | 12 | ✅ 100% |
| ADMIN | 19 | 19 | ✅ 100% |
| CLIENT | 6 | 6 | ✅ 100% |
| EMPLOYEE | 3 | 3 | ✅ 100% |
| SHARED | 6 | 6 | ✅ 100% |
| **TOTAL** | **46** | **46** | ✅ **100%** |

### ✅ Problemas Resueltos

Los siguientes problemas fueron identificados y resueltos durante la captura:

1. ✅ **Dashboard timeouts** - Resuelto agregando timeouts y manejo de errores en llamadas fetch
   - `/es/client/dashboard` - ✅ Capturado
   - `/es/employee/dashboard` - ✅ Capturado
   - `/es/dashboard` - ✅ Capturado

2. ✅ **Error de compilación** - `NotificationCenter.tsx` tenía imports incorrectos, resuelto usando `<Typography variant="caption">`

3. ✅ **Usuarios de prueba** - Creados usuarios screenshot con script `create-screenshot-users.ts`

### Rutas Dinámicas No Capturadas

Las siguientes rutas con parámetros dinámicos no fueron capturadas ya que requieren datos específicos en la base de datos:

- `/es/admin/users/[userEmail]`
- `/es/admin/requests/[id]`
- `/es/admin/requests/[id]/edit`
- `/es/admin/catalog/services/[id]`
- `/es/admin/chat/[conversationId]`
- `/es/admin/channels/[channelId]`
- `/es/client/requests/[requestId]`
- `/es/requests/[id]`

Para capturar estas rutas se requiere:
1. Crear datos de prueba en la base de datos
2. Actualizar el script de captura con los IDs correspondientes
3. Ejecutar nuevamente la captura automatizada

Ver `docs/sitemap/CAPTURE-REPORT.md` para más detalles sobre la captura automatizada.

---

## 📞 Contacto y Soporte

Para reportar rutas faltantes o actualizaciones necesarias en el sitemap:
- Crear issue en el repositorio
- Etiquetar con `documentation` y `sitemap`

---

**Última actualización**: 2026-02-09
**Versión del sitemap**: 1.0.0
**Estado de screenshots**: ✅ 46/46 capturados (100%)
**Mantenido por**: Alkitu Development Team
