# 📊 Clasificación de Páginas del Admin

**Fecha:** 11 de noviembre de 2025
**Propósito:** Identificar páginas con datos REALES vs MOCKUPS para limpieza del código

---

## ✅ PÁGINAS REALES (Conectadas a tRPC/API)

Estas páginas están conectadas a endpoints reales y deben mantenerse:

### 1. Users Management
**Ruta:** `/admin/users`
**Archivo:** `packages/web/src/app/[lang]/(private)/admin/users/page.tsx`
**Estado:** ✅ **REAL - MANTENER**

**Conexiones API:**
- `trpc.user.getFilteredUsers.useQuery()` - Obtiene usuarios con filtros
- `trpc.user.bulkUpdateStatus.useMutation()` - Actualiza estado de usuarios
- `trpc.user.bulkDeleteUsers.useMutation()` - Elimina usuarios
- `trpc.user.bulkUpdateRole.useMutation()` - Actualiza roles

**Notas:** Tiene algunos TODOs pero la integración con tRPC es real y funcional.

---

### 2. Chat/Conversations
**Ruta:** `/admin/chat`
**Archivo:** `packages/web/src/app/[lang]/(private)/admin/chat/page.tsx`
**Estado:** ✅ **REAL - MANTENER** (En desarrollo)

**Conexiones API:**
- `trpc.hello.useQuery()` - Test de conexión tRPC
- `trpc.chat.getConversations.useQuery()` - Obtiene conversaciones

**Notas:** Está en desarrollo activo. La consulta de conversaciones está deshabilitada (`enabled: false`) para testing, pero la infraestructura tRPC es real.

---

### 3. Notifications
**Ruta:** `/admin/notifications`
**Archivo:** `packages/web/src/app/[lang]/(private)/admin/notifications/page.tsx`
**Estado:** ✅ **REAL - MANTENER**

**Conexiones API:**
- `notification.getNotifications` - Paginación tradicional
- `notification.getRecentNotifications` - Modo rápido
- `notification.getNotificationsWithFilters` - Con filtros
- `notification.markAsRead` - Marcar como leído

**Notas:** Hace fetches directos a endpoints tRPC. Sistema completo de notificaciones con infinite scroll, filtros, y bulk actions.

---

## ❌ PÁGINAS MOCKUP (Datos Hardcodeados)

Estas páginas solo tienen datos de prueba y deben ser **ELIMINADAS** o convertidas a páginas reales:

### 1. Billing
**Ruta:** `/admin/billing`
**Archivo:** `packages/web/src/app/[lang]/(private)/admin/billing/page.tsx`
**Estado:** ❌ **MOCKUP - ELIMINAR**

**Datos Mockeados:**
```typescript
mockBillingRecords: BillingRecord[]  // 3 facturas de ejemplo
mockStats: BillingStats              // Estadísticas hardcodeadas
```

**Comentario en código:**
```typescript
// TODO: Replace with real tRPC queries
// const { data: billingRecords, refetch } = trpc.billing.getBillingRecords.useQuery();
// const { data: stats } = trpc.billing.getBillingStats.useQuery();
```

---

### 2. Messaging
**Ruta:** `/admin/messaging`
**Archivo:** `packages/web/src/app/[lang]/(private)/admin/messaging/page.tsx`
**Estado:** ❌ **MOCKUP - ELIMINAR**

**Datos Mockeados:**
```typescript
mockMessages: Message[]  // 4 mensajes de ejemplo
mockUsers: User[]        // 5 usuarios de ejemplo
```

**Funcionalidad:** Sistema completo de mensajería con difusión masiva, pero 100% con datos hardcodeados.

---

### 3. Security
**Ruta:** `/admin/security`
**Archivo:** `packages/web/src/app/[lang]/(private)/admin/security/page.tsx`
**Estado:** ❌ **MOCKUP - ELIMINAR**

**Datos Mockeados:**
```typescript
mockUserSessions: UserSession[]  // 4 sesiones de ejemplo
mockApiTokens: ApiToken[]        // 3 tokens de ejemplo
mockSmtpConfig                   // Configuración SMTP hardcodeada
```

**Funcionalidad:** Gestión de sesiones de usuario, tokens de API, y configuración de seguridad. Todo mockeado.

---

### 4. Email Management
**Ruta:** `/admin/email-management`
**Archivo:** `packages/web/src/app/[lang]/(private)/admin/email-management/page.tsx`
**Estado:** ❌ **MOCKUP - ELIMINAR**

**Datos Mockeados:**
```typescript
mockEmailTemplates: EmailTemplate[]  // 3 plantillas
mockEmailLogs: EmailLog[]            // 3 logs de emails
mockSmtpConfig                       // Configuración SMTP
```

**Funcionalidad:** Sistema completo de gestión de emails con plantillas, analytics, historial y configuración SMTP. Todo mockeado.

---

### 5. Data Protection
**Ruta:** `/admin/data-protection`
**Archivo:** `packages/web/src/app/[lang]/(private)/admin/data-protection/page.tsx`
**Estado:** ❌ **MOCKUP - ELIMINAR**

**Datos Mockeados:**
```typescript
mockUsers: User[]                                    // 3 usuarios
mockAnonymizationRequests: AnonymizationRequest[]    // 2 solicitudes
```

**Funcionalidad:** Gestión de protección de datos RGPD, anonimización de usuarios, exportación de datos. Todo mockeado.

---

### 6. Companies
**Ruta:** `/admin/companies`
**Archivo:** `packages/web/src/app/[lang]/(private)/admin/companies/page.tsx`
**Estado:** ❌ **MOCKUP - ELIMINAR**

**Datos Mockeados:**
```typescript
mockCompanies: Company[]  // 3 empresas de ejemplo
```

**Comentario en código:**
```typescript
// TODO: Replace with real tRPC queries
// const { data: companies, isLoading, refetch } = trpc.company.getUserCompanies.useQuery();
```

---

## ⚠️ PÁGINAS EN CONSTRUCCIÓN

### 1. Dashboard
**Ruta:** `/admin/dashboard`
**Archivo:** `packages/web/src/app/[lang]/(private)/admin/dashboard/page.tsx`
**Estado:** ⚠️ **EN CONSTRUCCIÓN - MANTENER POR AHORA**

**Contenido:**
- Mensaje "Dashboard en Construcción"
- 3 cards con placeholders (---) para métricas

**Decisión:** Mantener como página de inicio del admin. Agregar métricas reales cuando estén disponibles.

---

### 2. Settings (Hub)
**Ruta:** `/admin/settings`
**Archivo:** `packages/web/src/app/[lang]/(private)/admin/settings/page.tsx`
**Estado:** ⚠️ **NAVEGACIÓN - MANTENER**

**Contenido:**
- Lista de enlaces a otras páginas de settings (themes, chatbot, general)
- No tiene lógica de negocio propia

**Decisión:** Mantener como página hub de navegación.

---

## 📋 RESUMEN EJECUTIVO

| Tipo | Cantidad | Acción |
|------|----------|--------|
| ✅ Páginas Reales | 3 | Mantener |
| ❌ Páginas Mockup | 6 | Eliminar |
| ⚠️ En Construcción | 2 | Revisar |
| **TOTAL** | **11** | |

---

## 🔧 PLAN DE ACCIÓN RECOMENDADO

### Fase 1: Limpieza Inmediata (Prioridad Alta)
Eliminar las siguientes páginas mockup:
```bash
# Páginas a eliminar
packages/web/src/app/[lang]/(private)/admin/billing/page.tsx
packages/web/src/app/[lang]/(private)/admin/messaging/page.tsx
packages/web/src/app/[lang]/(private)/admin/security/page.tsx
packages/web/src/app/[lang]/(private)/admin/email-management/page.tsx
packages/web/src/app/[lang]/(private)/admin/data-protection/page.tsx
packages/web/src/app/[lang]/(private)/admin/companies/page.tsx
```

### Fase 2: Actualizar Sidebar
Después de eliminar las páginas mockup, actualizar el archivo de configuración del sidebar para ocultar/remover los enlaces a páginas eliminadas:
```bash
# Archivo a modificar
packages/web/src/app/[lang]/(private)/admin/layout.tsx
# O donde esté definida la configuración del sidebar
```

### Fase 3: Dashboard
Implementar métricas reales en el dashboard con tRPC:
- Total de usuarios
- Total de empresas (cuando se implemente)
- Actividad del sistema

### Fase 4: Documentación
Actualizar la documentación del proyecto reflejando las páginas disponibles reales.

---

## ⚠️ ADVERTENCIAS IMPORTANTES

### Antes de Eliminar
1. ✅ **Hacer commit** del estado actual antes de eliminar
2. ✅ **Revisar dependencies** - algunas páginas pueden estar importando componentes que se usan en otros lugares
3. ✅ **Actualizar rutas** del sidebar y navegación
4. ✅ **Verificar tests** que puedan estar referenciando estas páginas

### Componentes Compartidos
Algunas páginas mockup pueden tener componentes de UI valiosos que podrían reutilizarse:
- `BillingRecordRow`, `InvoiceDetailModal` (billing)
- `NotificationCard` adaptado para mensajes (messaging)
- Modals de exportación y anonimización (data-protection)

**Recomendación:** Extraer componentes genéricos útiles antes de eliminar las páginas.

---

## 📊 ESTADÍSTICAS DE CÓDIGO

### Líneas de Código por Página (aproximado)

| Página | LOC | Estado |
|--------|-----|--------|
| billing | ~840 | Mockup |
| messaging | ~650 | Mockup |
| security | ~984 | Mockup |
| email-management | ~1154 | Mockup |
| data-protection | ~814 | Mockup |
| companies | ~403 | Mockup |
| **TOTAL A ELIMINAR** | **~4845 LOC** | |

**Beneficio:** Eliminar ~5000 líneas de código mockup mejorará el mantenimiento y reducirá confusión.

---

## ✅ CONCLUSIÓN

El admin tiene una mezcla de páginas reales y mockups. Las **6 páginas mockup** identificadas deben ser eliminadas para:

1. ✅ Reducir complejidad del código
2. ✅ Evitar confusión entre datos reales y de prueba
3. ✅ Mejorar rendimiento (menos código a cargar)
4. ✅ Facilitar mantenimiento futuro

Las **3 páginas reales** (Users, Chat, Notifications) son funcionales y deben mantenerse.

---

**Generado:** 11 nov 2025
**Autor:** Claude Code
**Propósito:** Limpieza y optimización del admin panel
