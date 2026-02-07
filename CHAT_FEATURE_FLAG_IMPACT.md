# 💬 Feature Flag "Chat & Messaging" - Impacto Completo

## 📊 Estado Actual vs Objetivo

### ✅ ACTUALMENTE IMPLEMENTADO

Cuando el feature flag "Chat & Messaging" está **DESACTIVADO**:

#### 1. Request Detail Page
**Ubicación**: `/admin/requests/[id]`
- ❌ **Se OCULTA**: Panel "Internal Team Chat"
- ✅ Todo lo demás sigue visible y funcional

**Archivo**: `RequestDetailOrganism.tsx` (línea 405)
```typescript
{chatEnabled && <RequestChatPanel requestId={requestId} />}
```

---

### 🔧 DEBERÍA IMPLEMENTARSE (Recomendado)

Para tener un control completo del feature flag de chat, deberías ocultar estas opciones del **sidebar de navegación**:

#### 1. Menú "Chat" (Sección COMUNICACIÓN)
**Ubicación en sidebar**: Sección "COMUNICACIÓN"
**Icono**: MessageCircle (💬)

**Páginas afectadas**:
- `/admin/chat` - Lista de conversaciones
- `/admin/chat/analytics` - Analíticas del chat
- `/admin/chat/[conversationId]` - Detalle de conversación individual

**Archivo a modificar**: `dashboard.tsx` (líneas 109-124)

#### 2. Menú "Team Chat" (Sección COMUNICACIÓN)
**Ubicación en sidebar**: Sección "COMUNICACIÓN"
**Icono**: Hash (#)

**Páginas afectadas**:
- `/admin/channels` - Canales de equipo (Slack-style)
- `/admin/channels/[channelId]` - Detalle de canal

**Archivo a modificar**: `dashboard.tsx` (líneas 145-150)

---

## 📋 Resumen de Impacto

### Cuando Chat está ACTIVADO ✅
```
SIDEBAR:
├── 📊 RESUMEN
│   └── Dashboard
├── 📁 GESTIÓN
│   ├── Solicitudes
│   ├── Usuarios
│   └── Catálogo
├── 💬 COMUNICACIÓN
│   ├── ✅ Chat                    ← VISIBLE
│   │   ├── Conversaciones
│   │   └── Analíticas Chat
│   ├── 🔔 Notificaciones
│   └── ✅ Team Chat               ← VISIBLE
└── ⚙️ CONFIGURACIÓN

REQUEST DETAIL PAGE:
└── ✅ Internal Team Chat Panel    ← VISIBLE
```

### Cuando Chat está DESACTIVADO ❌
```
SIDEBAR:
├── 📊 RESUMEN
│   └── Dashboard
├── 📁 GESTIÓN
│   ├── Solicitudes
│   ├── Usuarios
│   └── Catálogo
├── 💬 COMUNICACIÓN
│   ├── ❌ Chat                    ← OCULTO
│   ├── 🔔 Notificaciones
│   └── ❌ Team Chat               ← OCULTO
└── ⚙️ CONFIGURACIÓN

REQUEST DETAIL PAGE:
└── ❌ Internal Team Chat Panel    ← OCULTO ✅ (Ya implementado)
```

---

## 🎯 Funcionalidades Controladas por el Feature Flag

### 1. Chat Público (Visitantes)
**Rutas**:
- `/admin/chat` - Lista de conversaciones
- `/admin/chat/[id]` - Conversación individual
- `/admin/chat/analytics` - Métricas y analíticas

**Funcionalidades**:
- ✅ Ver conversaciones de clientes/visitantes
- ✅ Responder mensajes
- ✅ Asignar conversaciones a agentes
- ✅ Cambiar estado (OPEN, IN_PROGRESS, RESOLVED)
- ✅ Ver analíticas (conversaciones abiertas, resueltas, leads capturados)
- ✅ Widget de chat público en el sitio web

**Tipo de conversación**: `CLIENT_SUPPORT`

### 2. Team Chat (Canales Internos)
**Rutas**:
- `/admin/channels` - Lista de canales
- `/admin/channels/[id]` - Canal individual

**Funcionalidades**:
- ✅ Canales públicos del equipo
- ✅ Canales privados
- ✅ Mensajes directos (DMs)
- ✅ Threading (respuestas anidadas)
- ✅ Menciones y notificaciones

**Tipo de conversación**: `CHANNEL`

### 3. Request Chat (Interno por Solicitud)
**Ruta**:
- `/admin/requests/[id]` - Panel en el detalle de solicitud

**Funcionalidades**:
- ✅ Chat interno del equipo sobre una solicitud específica
- ✅ Colaboración entre empleados asignados
- ✅ Historial de comunicación por request
- ✅ Auto-creación de conversación al abrir el panel

**Tipo de conversación**: `INTERNAL_REQUEST`

---

## 🔧 Implementación Recomendada

### Paso 1: Modificar el Sidebar (dashboard.tsx)

**Archivo**: `packages/web/src/components/features/dashboard/dashboard.tsx`

**Cambio en línea 48** (agregar hook):
```typescript
const getTransformedData = (t: any, pathname: string, userRole: 'admin' | 'user' = 'admin') => {
  // Importar al inicio del archivo:
  // import { useFeatureFlag } from '@/hooks/useFeatureFlag';

  // Agregar dentro de la función:
  const { isEnabled: chatEnabled } = useFeatureFlag('chat');
```

**Cambio en líneas 109-124** (Chat):
```typescript
// Envolver con condicional
...(chatEnabled ? [{
  title: t?.('nav.chat') || 'Chat',
  url: '/admin/chat',
  icon: MessageCircle,
  section: 'communication',
  items: [
    {
      title: t?.('nav.conversations') || 'Conversaciones',
      url: '/admin/chat',
    },
    {
      title: t?.('nav.chatAnalytics') || 'Analíticas Chat',
      url: '/admin/chat/analytics',
    },
  ],
}] : []),
```

**Cambio en líneas 145-150** (Team Chat):
```typescript
// Envolver con condicional
...(chatEnabled ? [{
  title: t?.('nav.teamChat') || 'Team Chat',
  url: '/admin/channels',
  icon: Hash,
  section: 'communication',
  items: [],
}] : []),
```

### Paso 2: Proteger las Rutas

Opcionalmente, puedes redirigir si alguien intenta acceder directamente:

**Archivo**: Crear `packages/web/src/middleware/featureFlags.ts`

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function featureFlagMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas de chat que requieren feature flag
  const chatRoutes = ['/admin/chat', '/admin/channels'];
  const isChatRoute = chatRoutes.some(route => pathname.startsWith(route));

  if (isChatRoute) {
    // Verificar feature flag (requiere API call o cookie)
    // Si está desactivado, redirigir
    // return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}
```

---

## 📊 Tabla de Impacto Completo

| Componente | Ruta | Estado con Chat ON | Estado con Chat OFF |
|------------|------|-------------------|---------------------|
| **Sidebar - Chat** | `/admin/chat` | ✅ Visible | ❌ Oculto (pendiente) |
| **Sidebar - Team Chat** | `/admin/channels` | ✅ Visible | ❌ Oculto (pendiente) |
| **Chat Conversaciones** | `/admin/chat` | ✅ Accesible | ⚠️ Accesible* (debería redirigir) |
| **Chat Analytics** | `/admin/chat/analytics` | ✅ Accesible | ⚠️ Accesible* (debería redirigir) |
| **Team Channels** | `/admin/channels` | ✅ Accesible | ⚠️ Accesible* (debería redirigir) |
| **Request Chat Panel** | Request detail | ✅ Visible | ✅ Oculto (implementado) |
| **Chat Widget** | Sitio público | ✅ Visible | ⚠️ Visible* (debería ocultar) |

\* = Actualmente no está implementado el control

---

## 🎨 Configuración Adicional del Feature Flag

El feature flag tiene una configuración JSON que permite control granular:

```json
{
  "enablePublicChat": true,      // Widget de chat público
  "enableRequestChat": true,     // Chat en requests (ya implementado)
  "enableChannels": true         // Team channels
}
```

**Uso recomendado**:
```typescript
const { data: chatFeature } = trpc.featureFlags.getByKey.useQuery({ key: 'chat' });
const config = chatFeature?.config;

// Control granular
if (config?.enablePublicChat) {
  // Mostrar opción de Chat en sidebar
}

if (config?.enableRequestChat) {
  // Mostrar panel de chat en requests (ya implementado)
}

if (config?.enableChannels) {
  // Mostrar Team Chat en sidebar
}
```

---

## 🚀 Próximos Pasos Recomendados

### Alta Prioridad
1. ✅ **Request Chat Panel** - Ya implementado
2. ⬜ **Sidebar - Ocultar "Chat"** - Pendiente
3. ⬜ **Sidebar - Ocultar "Team Chat"** - Pendiente

### Media Prioridad
4. ⬜ **Redirección de rutas** - Si chat desactivado, redirigir /admin/chat → /admin/dashboard
5. ⬜ **Widget de chat público** - Ocultar widget en sitio web
6. ⬜ **Control granular** - Usar config JSON para sub-features

### Baja Prioridad
7. ⬜ **Mensaje informativo** - Mostrar "Feature desactivada" en lugar de ocultar
8. ⬜ **Permisos** - Verificar permisos en backend también

---

## 💡 Ejemplo de Uso Completo

```typescript
// En dashboard.tsx
'use client';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';

const Dashboard = () => {
  const { isEnabled: chatEnabled } = useFeatureFlag('chat');

  const navItems = [
    // ... otros items

    // Solo incluir si chat está habilitado
    ...(chatEnabled ? [{
      title: 'Chat',
      url: '/admin/chat',
      icon: MessageCircle,
      items: [
        { title: 'Conversaciones', url: '/admin/chat' },
        { title: 'Analíticas', url: '/admin/chat/analytics' },
      ],
    }] : []),

    ...(chatEnabled ? [{
      title: 'Team Chat',
      url: '/admin/channels',
      icon: Hash,
    }] : []),
  ];

  return <AppSidebar navMain={navItems} />;
};
```

---

## 📝 Resumen Ejecutivo

**Implementado actualmente**:
- ✅ Request Chat Panel se oculta cuando chat está OFF

**Pendiente de implementar**:
- ⬜ Ocultar opciones "Chat" y "Team Chat" del sidebar
- ⬜ Redirigir rutas protegidas
- ⬜ Control del widget público
- ⬜ Control granular con config JSON

**Beneficios de implementación completa**:
- 🎯 Control total sobre funcionalidades de chat
- 💰 Posibilidad de ofrecer chat como addon premium
- 🔒 Mejor seguridad y control de acceso
- ⚡ Reducción de carga si chat no se usa
- 📊 Métricas claras de uso de features

---

**Fecha**: 2026-02-07
**Estado**: Parcialmente implementado
**Próximo paso**: Implementar control del sidebar
