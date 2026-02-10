# 🚀 API Documentation - Alkitu Platform

## 📋 Arquitectura General

### **Stack Tecnológico**
- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Backend**: NestJS 11 + Prisma + MongoDB
- **API Layer**: tRPC + REST API híbrido
- **Real-time**: Socket.io (WebSocket)
- **Type Safety**: End-to-end TypeScript
- **Validation**: Zod schemas

---

## 🎯 **Métodos de Conexión API**

### **1. tRPC (Recomendado) - Type-Safe APIs**

#### **Configuración Frontend:**
```typescript
// /packages/web/src/lib/trpc.ts
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@api/trpc/trpc.router';

export const trpc = createTRPCReact<AppRouter>();
```

#### **Uso en Componentes:**
```typescript
// Queries (lecturas)
const { data, isLoading, error } = trpc.chat.getConversations.useQuery(
  { status: 'OPEN' },
  { refetchInterval: 30000 }
);

// Mutations (escrituras)
const sendMessage = trpc.chat.sendMessage.useMutation({
  onSuccess: () => {
    utils.chat.getConversations.invalidate();
  }
});
```

### **2. WebSocket (Real-time)**

#### **Configuración:**
```typescript
// Hook personalizado para WebSocket
const { connected, socket } = useWebSocket({
  userId: user.id,
  onNewNotification: (notification) => {
    // Handle new chat messages
    console.log('New message:', notification);
  },
  onCountUpdate: () => {
    // Update notification badges
  }
});
```

#### **Eventos Disponibles:**
```typescript
// Eventos entrantes
socket.on('newMessage', (message) => { /* Handle new message */ });
socket.on('notification:new', (notif) => { /* Handle notification */ });
socket.on('notification:count_updated', () => { /* Update badge */ });
socket.on('connection:confirmed', (data) => { /* Connection confirmed */ });

// Eventos salientes
socket.emit('notification:subscribe'); // Subscribe to notifications
socket.emit('chat:join', { conversationId }); // Join chat room
```

---

## 🗨️ **Chat System APIs**

### **tRPC Chat Router**

#### **🔓 Endpoints Públicos (Visitantes)**
```typescript
// Iniciar nueva conversación
trpc.chat.startConversation.useMutation({
  email: string;
  name?: string;
  phone?: string;
  company?: string;
  initialMessage: string;
  source?: string;
  metadata?: Record<string, any>;
});

// Enviar mensaje como visitante
trpc.chat.sendMessage.useMutation({
  conversationId: string;
  content: string;
  metadata?: Record<string, any>;
});

// Obtener mensajes de conversación
trpc.chat.getMessages.useQuery({
  conversationId: string;
  limit?: number;
  offset?: number;
});
```

#### **🔒 Endpoints Protegidos (Staff/Agentes)**
```typescript
// Listar conversaciones con filtros
trpc.chat.getConversations.useQuery({
  status?: ConversationStatus;
  priority?: Priority;
  assignedToId?: string;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
  tags?: string[];
  limit?: number;
  offset?: number;
});

// Asignar conversación a agente
trpc.chat.assignConversation.useMutation({
  conversationId: string;
  assignedToId: string;
});

// Actualizar estado de conversación
trpc.chat.updateStatus.useMutation({
  conversationId: string;
  status: ConversationStatus;
  priority?: Priority;
});

// Responder como agente
trpc.chat.replyToMessage.useMutation({
  conversationId: string;
  content: string;
  internal?: boolean; // Nota interna vs respuesta al cliente
});

// Agregar nota interna
trpc.chat.addInternalNote.useMutation({
  conversationId: string;
  note: string;
});

// Marcar mensajes como leídos
trpc.chat.markAsRead.useMutation({
  conversationId: string;
  messageIds?: string[]; // Si no se especifica, marca todos
});

// Obtener analíticas de chat
trpc.chat.getChatAnalytics.useQuery({
  dateFrom: Date;
  dateTo: Date;
  agentId?: string;
  includeAgentMetrics?: boolean;
});
```

---

## 👤 **User Management APIs**

### **tRPC User Router**
```typescript
// Obtener perfil actual
trpc.user.getProfile.useQuery();

// Actualizar perfil
trpc.user.updateProfile.useMutation({
  name?: string;
  email?: string;
  avatar?: string;
  preferences?: Record<string, any>;
});

// Listar usuarios (admin)
trpc.user.getUsers.useQuery({
  role?: UserRole;
  search?: string;
  active?: boolean;
  limit?: number;
  offset?: number;
});

// Crear usuario (admin)
trpc.user.createUser.useMutation({
  email: string;
  name: string;
  role: UserRole;
  password: string;
  companyId?: string;
});
```

---

## 🔔 **Notification APIs**

### **tRPC Notification Router**
```typescript
// Obtener notificaciones
trpc.notification.getNotifications.useQuery({
  read?: boolean;
  type?: NotificationType;
  limit?: number;
  offset?: number;
});

// Marcar como leída
trpc.notification.markAsRead.useMutation({
  notificationIds: string[];
});

// Obtener conteo de no leídas
trpc.notification.getUnreadCount.useQuery();

// Configurar preferencias
trpc.notification.updatePreferences.useMutation({
  emailNotifications: boolean;
  pushNotifications: boolean;
  chatNotifications: boolean;
  marketingEmails: boolean;
});
```

---

## 🎨 **Theme System APIs**

### **tRPC Theme Router**
```typescript
// Obtener tema actual
trpc.theme.getCurrentTheme.useQuery();

// Aplicar tema
trpc.theme.applyTheme.useMutation({
  themeId?: string;
  customColors?: Record<string, string>;
});

// Listar temas disponibles
trpc.theme.getAvailableThemes.useQuery();

// Crear tema personalizado (admin)
trpc.theme.createCustomTheme.useMutation({
  name: string;
  colors: Record<string, string>;
  isDefault?: boolean;
});
```

---

## 💳 **Billing APIs**

### **tRPC Billing Router**
```typescript
// Obtener información de suscripción
trpc.billing.getSubscription.useQuery();

// Obtener historial de pagos
trpc.billing.getPaymentHistory.useQuery({
  limit?: number;
  offset?: number;
});

// Crear sesión de checkout
trpc.billing.createCheckoutSession.useMutation({
  planId: string;
  successUrl: string;
  cancelUrl: string;
});

// Cancelar suscripción
trpc.billing.cancelSubscription.useMutation();
```

---

## 🤖 **Chatbot Configuration APIs**

### **tRPC ChatbotConfig Router**
```typescript
// Obtener configuración
trpc.chatbotConfig.get.useQuery();

// Actualizar configuración
trpc.chatbotConfig.update.useMutation({
  welcomeMessage?: string;
  primaryColor?: string;
  textColor?: string;
  position?: 'bottom-left' | 'bottom-right';
  borderRadius?: number;
  enabled?: boolean;
  autoReply?: {
    enabled: boolean;
    message: string;
    delayMs: number;
  };
  businessHours?: {
    enabled: boolean;
    timezone: string;
    schedule: {
      [day: string]: { start: string; end: string; };
    };
  };
});
```

---

## 🏢 **Company Management APIs**

### **tRPC Company Router**
```typescript
// Obtener información de empresa
trpc.company.getCompany.useQuery();

// Actualizar empresa
trpc.company.updateCompany.useMutation({
  name?: string;
  domain?: string;
  logo?: string;
  settings?: Record<string, any>;
});

// Gestionar miembros
trpc.company.getMembers.useQuery();
trpc.company.addMember.useMutation({ email: string, role: UserRole });
trpc.company.removeMember.useMutation({ userId: string });
```

---

## 🛡️ **Authentication APIs**

### **REST API Routes** (Next.js)
```typescript
// Endpoints de autenticación
POST /api/auth/login
POST /api/auth/logout  
POST /api/auth/refresh
POST /api/auth/forgot-password
POST /api/auth/reset-password
POST /api/auth/verify-email

// Headers requeridos
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

---

## 📱 **Push Notification APIs**

### **REST API Routes**
```typescript
// Suscripción push
POST /api/notifications/push/subscribe
DELETE /api/notifications/push/unsubscribe
POST /api/notifications/push/test

// Body example
{
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}
```

---

## 🌐 **Translation APIs**

### **REST API Route**
```typescript
GET /api/translations?lang=es
GET /api/translations?lang=en

// Response
{
  "dashboard": {
    "title": "Panel de Control",
    "users": "Usuarios"
  },
  "chat": {
    "newMessage": "Nuevo Mensaje"
  }
}
```

---

## 🔍 **Error Handling**

### **tRPC Error Types**
```typescript
// Códigos de error comunes
UNAUTHORIZED     // 401 - No autenticado
FORBIDDEN        // 403 - Sin permisos  
NOT_FOUND        // 404 - Recurso no encontrado
BAD_REQUEST      // 400 - Datos inválidos
INTERNAL_ERROR   // 500 - Error del servidor

// Manejo en frontend
const { data, error } = trpc.chat.getConversations.useQuery();

if (error) {
  switch (error.data?.code) {
    case 'UNAUTHORIZED':
      router.push('/auth/login');
      break;
    case 'FORBIDDEN':
      toast.error('No tienes permisos para esta acción');
      break;
    default:
      toast.error(error.message);
  }
}
```

---

## 🚀 **Mejores Prácticas**

### **1. Uso de tRPC**
- Prefiere `trpc.*.useQuery()` sobre `useQuery()` manual
- Usa `invalidate()` después de mutaciones para refetch automático
- Implementa `optimisticUpdate` para mejor UX

### **2. Real-time**
- Combina WebSocket para eventos en tiempo real
- tRPC para operaciones CRUD
- Cache con React Query para performance

### **3. Error Handling**
- Siempre maneja estados de `error` e `isLoading`
- Implementa retry automático para fallos temporales
- Usa toast notifications para feedback al usuario

### **4. Type Safety**
- Usa los tipos de `/types/` en lugar de `any`
- Define interfaces para props de componentes
- Valida datos con esquemas Zod

---

## 📊 **Performance**

### **Configuración React Query**
```typescript
// Client configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,        // 5 minutes
      gcTime: 10 * 60 * 1000,          // 10 minutes
      refetchOnWindowFocus: false,      // Disable refocus refetch
      retry: 3,                         // Retry failed queries
    },
  },
});
```

### **Optimizaciones Recomendadas**
- Usa `refetchInterval` para datos que cambian frecuentemente
- Implementa pagination para listas grandes
- Cache aggressive para datos estáticos
- Debounce para filtros de búsqueda

---

Esta documentación cubre todos los métodos de conexión disponibles entre tu frontend y backend. La arquitectura está bien diseñada para escalabilidad y mantenibilidad.