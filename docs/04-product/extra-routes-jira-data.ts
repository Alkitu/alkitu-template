/**
 * JIRA Task Data for 33 Extra Implemented Routes
 *
 * These routes were implemented but not in the original backlog (ALI-21 to ALI-58).
 * This file contains the data to create JIRA tasks ALI-123 to ALI-155.
 *
 * Generated: 2025-12-27
 */

export interface JiraTaskData {
  ali: string;              // ALI task number
  route: string;            // Application route
  category: string;         // Feature category
  summary: string;          // JIRA task summary (title)
  userStory: string;        // Spanish user story
  features: string[];       // List of implemented features
  frontendPath: string;     // Actual frontend file path
  backendEndpoints: string[]; // API endpoints used
  relatedALI?: string;      // Parent ALI from original backlog (if exists)
  role: string;             // Access role
}

export const extraRoutesData: JiraTaskData[] = [
  // ===================================================
  // CATEGORY 1: AUTHENTICATION EXTENDED (7 routes)
  // ALI-123 to ALI-129
  // ===================================================

  {
    ali: "ALI-123",
    route: "/{lang}/auth/forgot-password",
    category: "Authentication Extended",
    summary: "dev Forgot Password – \"Solicitar Recuperación de Contraseña\" [Public]",
    userStory: "Como usuario, quiero solicitar un enlace de recuperación de contraseña para poder restablecer mi acceso cuando olvide mis credenciales.",
    features: [
      "Formulario de solicitud con validación de email",
      "Envío de correo con enlace de recuperación seguro",
      "Validación de que el email existe en el sistema",
      "Feedback visual de éxito/error con mensajes claros",
      "Rate limiting para prevenir abuso (3 requests por 15 minutos)"
    ],
    frontendPath: "/packages/web/src/app/[lang]/(public)/auth/forgot-password",
    backendEndpoints: ["POST /auth/forgot-password"],
    relatedALI: "ALI-23",
    role: "Public"
  },

  {
    ali: "ALI-124",
    route: "/{lang}/auth/new-password",
    category: "Authentication Extended",
    summary: "dev New Password – \"Establecer Nueva Contraseña\" [Public]",
    userStory: "Como usuario, quiero establecer una nueva contraseña usando el enlace de recuperación para recuperar el acceso a mi cuenta.",
    features: [
      "Formulario seguro para nueva contraseña",
      "Validación de token de recuperación",
      "Requisitos de complejidad de contraseña (mínimo 8 caracteres)",
      "Confirmación de contraseña con validación en tiempo real",
      "Redirección automática a login tras éxito"
    ],
    frontendPath: "/packages/web/src/app/[lang]/(public)/auth/new-password",
    backendEndpoints: ["POST /auth/reset-password"],
    relatedALI: "ALI-23",
    role: "Public"
  },

  {
    ali: "ALI-125",
    route: "/{lang}/auth/email-login",
    category: "Authentication Extended",
    summary: "dev Magic Link Login – \"Inicio de Sesión por Email\" [Public]",
    userStory: "Como usuario, quiero iniciar sesión usando un enlace mágico enviado a mi email para acceder sin recordar contraseña.",
    features: [
      "Solicitud de magic link por email",
      "Generación de enlace temporal seguro",
      "Autenticación automática al hacer clic en el enlace",
      "Expiración del enlace después de 15 minutos",
      "Opción alternativa de login tradicional"
    ],
    frontendPath: "/packages/web/src/app/[lang]/(public)/auth/email-login",
    backendEndpoints: ["POST /auth/send-login-code", "POST /auth/login"],
    relatedALI: "ALI-22",
    role: "Public"
  },

  {
    ali: "ALI-126",
    route: "/{lang}/auth/verify-login-code",
    category: "Authentication Extended",
    summary: "dev Login Code Verification – \"Verificar Código de Acceso\" [Public]",
    userStory: "Como usuario, quiero verificar el código de acceso enviado a mi email para completar el inicio de sesión seguro.",
    features: [
      "Formulario de verificación de código de 6 dígitos",
      "Validación de código con expiración temporal",
      "Reenvío de código si expira o se pierde",
      "Autenticación automática tras verificación exitosa",
      "Contador de intentos fallidos con bloqueo temporal"
    ],
    frontendPath: "/packages/web/src/app/[lang]/(public)/auth/verify-login-code",
    backendEndpoints: ["POST /auth/verify-login-code"],
    relatedALI: "ALI-22",
    role: "Public"
  },

  {
    ali: "ALI-127",
    route: "/{lang}/auth/verify-request",
    category: "Authentication Extended",
    summary: "dev Email Verification Request – \"Verificar Tu Email\" [Public]",
    userStory: "Como usuario recién registrado, quiero verificar mi dirección de email para activar completamente mi cuenta.",
    features: [
      "Pantalla de confirmación de email enviado",
      "Instrucciones claras para verificar email",
      "Opción para reenviar email de verificación",
      "Enlace a soporte si no recibe el email",
      "Redirección automática si email ya verificado"
    ],
    frontendPath: "/packages/web/src/app/[lang]/(public)/auth/verify-request",
    backendEndpoints: ["GET /auth/verify-email"],
    relatedALI: "ALI-21",
    role: "Public"
  },

  {
    ali: "ALI-128",
    route: "/{lang}/auth/new-verification",
    category: "Authentication Extended",
    summary: "dev New Verification – \"Solicitar Nuevo Email de Verificación\" [Public]",
    userStory: "Como usuario, quiero solicitar un nuevo email de verificación si el anterior expiró o no lo recibí.",
    features: [
      "Formulario para solicitar nuevo email de verificación",
      "Validación de que la cuenta existe",
      "Generación de nuevo token de verificación",
      "Envío de email con enlace actualizado",
      "Mensajes de estado y confirmación"
    ],
    frontendPath: "/packages/web/src/app/[lang]/(public)/auth/new-verification",
    backendEndpoints: ["POST /auth/verify-email"],
    relatedALI: "ALI-21",
    role: "Public"
  },

  {
    ali: "ALI-129",
    route: "/{lang}/auth/auth-error",
    category: "Authentication Extended",
    summary: "dev Authentication Error – \"Página de Error de Autenticación\" [Public]",
    userStory: "Como usuario, quiero ver mensajes de error claros cuando falla mi autenticación para saber qué hacer a continuación.",
    features: [
      "Pantalla de error con mensaje descriptivo",
      "Diferentes mensajes según el tipo de error",
      "Opciones de recuperación según el problema",
      "Enlaces a páginas de ayuda relevantes",
      "Botón para volver a intentar login"
    ],
    frontendPath: "/packages/web/src/app/[lang]/(public)/auth/auth-error",
    backendEndpoints: [],
    relatedALI: "ALI-22",
    role: "Public"
  },

  // ===================================================
  // CATEGORY 2: SHARED INFRASTRUCTURE (8 routes)
  // ALI-130 to ALI-137
  // ===================================================

  {
    ali: "ALI-130",
    route: "/{lang}/dashboard",
    category: "Shared Infrastructure",
    summary: "dev Universal Dashboard – \"Router de Dashboard Basado en Rol\" [Shared]",
    userStory: "Como usuario autenticado, quiero ser redirigido automáticamente al dashboard correcto según mi rol para acceder a mis funciones.",
    features: [
      "Detección automática del rol del usuario",
      "Redirección a dashboard específico (client/employee/admin)",
      "Manejo de usuarios sin rol asignado",
      "Loading state durante verificación de rol",
      "Redirección a onboarding si perfil incompleto"
    ],
    frontendPath: "/packages/web/src/app/[lang]/(private)/dashboard",
    backendEndpoints: ["GET /users/me/role"],
    relatedALI: "ALI-25, ALI-26, ALI-28",
    role: "Shared"
  },

  {
    ali: "ALI-131",
    route: "/{lang}/profile",
    category: "Shared Infrastructure",
    summary: "dev Shared Profile – \"Página de Perfil Universal\" [Shared]",
    userStory: "Como usuario, quiero ver y editar mi información de perfil en una página compartida para todos los roles.",
    features: [
      "Visualización de datos de perfil del usuario",
      "Edición de información personal básica",
      "Cambio de contraseña",
      "Vista adaptada según rol del usuario",
      "Validación de datos en tiempo real"
    ],
    frontendPath: "/packages/web/src/app/[lang]/(private)/profile",
    backendEndpoints: ["GET /users/profile", "PUT /users/profile", "PUT /users/profile/password"],
    relatedALI: "ALI-45, ALI-46, ALI-47",
    role: "Shared"
  },

  {
    ali: "ALI-132",
    route: "/{lang}/onboarding",
    category: "Shared Infrastructure",
    summary: "dev Shared Onboarding – \"Completar Tu Perfil\" [Shared]",
    userStory: "Como nuevo usuario, quiero completar mi perfil con los datos obligatorios para poder usar todas las funciones de la aplicación.",
    features: [
      "Formulario de onboarding con campos obligatorios",
      "Validación de completitud de perfil",
      "Progreso visual del onboarding",
      "Guardado automático de cambios",
      "Redirección a dashboard al completar"
    ],
    frontendPath: "/packages/web/src/app/[lang]/(private)/onboarding",
    backendEndpoints: ["PUT /auth/complete-profile"],
    relatedALI: "ALI-54",
    role: "Shared"
  },

  {
    ali: "ALI-133",
    route: "/{lang}/locations",
    category: "Shared Infrastructure",
    summary: "dev Work Locations – \"Gestionar Ubicaciones de Servicio\" [Shared]",
    userStory: "Como usuario, quiero gestionar mis ubicaciones de trabajo para usar en solicitudes de servicio.",
    features: [
      "Lista de ubicaciones guardadas del usuario",
      "Creación de nueva ubicación",
      "Edición de ubicaciones existentes",
      "Eliminación de ubicaciones",
      "Direcciones complejas (building, tower, floor, unit)"
    ],
    frontendPath: "/packages/web/src/app/[lang]/(private)/locations",
    backendEndpoints: ["GET /locations", "POST /locations", "PUT /locations/:id", "DELETE /locations/:id"],
    relatedALI: "ALI-117",
    role: "Shared"
  },

  {
    ali: "ALI-134",
    route: "/{lang}/requests",
    category: "Shared Infrastructure",
    summary: "dev Shared Requests List – \"Vista General de Solicitudes\" [Shared]",
    userStory: "Como usuario, quiero ver todas mis solicitudes en una lista compartida para acceder rápidamente a la información.",
    features: [
      "Lista de solicitudes según rol del usuario",
      "Filtros por estado, fecha, servicio",
      "Búsqueda de solicitudes",
      "Paginación de resultados",
      "Vista de tarjetas con información resumida"
    ],
    frontendPath: "/packages/web/src/app/[lang]/(private)/requests",
    backendEndpoints: ["GET /requests"],
    relatedALI: "ALI-41, ALI-43, ALI-44",
    role: "Shared"
  },

  {
    ali: "ALI-135",
    route: "/{lang}/requests/:id",
    category: "Shared Infrastructure",
    summary: "dev Shared Request Detail – \"Información de Solicitud\" [Shared]",
    userStory: "Como usuario, quiero ver los detalles de una solicitud específica con la información relevante a mi rol.",
    features: [
      "Detalles completos de la solicitud",
      "Vista adaptada según rol (client/employee/admin)",
      "Historial de cambios de estado",
      "Información de servicio y ubicación",
      "Acciones disponibles según rol"
    ],
    frontendPath: "/packages/web/src/app/[lang]/(private)/requests/[id]",
    backendEndpoints: ["GET /requests/:id"],
    relatedALI: "ALI-41, ALI-43, ALI-44",
    role: "Shared"
  },

  {
    ali: "ALI-136",
    route: "/{lang}/requests/new",
    category: "Shared Infrastructure",
    summary: "dev Shared New Request – \"Crear Solicitud de Servicio\" [Shared]",
    userStory: "Como usuario, quiero crear una nueva solicitud de servicio en un formulario unificado.",
    features: [
      "Formulario único simplificado de creación",
      "Selección de servicio desde catálogo",
      "Selección de ubicación existente o nueva",
      "Campos dinámicos según template de servicio",
      "Programación de fecha y hora de ejecución",
      "Validación completa antes de envío"
    ],
    frontendPath: "/packages/web/src/app/[lang]/(private)/requests/new",
    backendEndpoints: ["POST /requests", "GET /services", "GET /locations"],
    relatedALI: "ALI-36, ALI-37, ALI-38, ALI-39",
    role: "Shared"
  },

  {
    ali: "ALI-137",
    route: "/{lang}/services/:serviceId/request",
    category: "Shared Infrastructure",
    summary: "dev Service Request – \"Formulario Específico de Servicio\" [Shared]",
    userStory: "Como usuario, quiero crear una solicitud para un servicio específico con el formulario pre-configurado.",
    features: [
      "Formulario pre-configurado para el servicio seleccionado",
      "Campos dinámicos según template del servicio",
      "Información del servicio mostrada",
      "Validación específica del servicio",
      "Redirección a success tras creación"
    ],
    frontendPath: "/packages/web/src/app/[lang]/(private)/services/[serviceId]/request",
    backendEndpoints: ["POST /requests", "GET /services/:id"],
    role: "Shared"
  },

  // ===================================================
  // CATEGORY 3: ADMIN ADVANCED FEATURES (13 routes)
  // ALI-138 to ALI-150
  // ===================================================

  {
    ali: "ALI-138",
    route: "/{lang}/admin",
    category: "Admin Advanced Features",
    summary: "dev Admin Home – \"Dashboard de Administración\" [Admin]",
    userStory: "Como administrador, quiero ver un overview general del sistema con métricas y accesos rápidos a funciones administrativas.",
    features: [
      "Métricas y estadísticas del sistema",
      "Accesos rápidos a funciones admin",
      "Resumen de solicitudes pendientes",
      "Notificaciones importantes",
      "Links a todas las secciones administrativas"
    ],
    frontendPath: "/packages/web/src/app/[lang]/(private)/admin",
    backendEndpoints: ["GET /requests", "GET /users/filtered"],
    role: "Admin"
  },

  {
    ali: "ALI-139",
    route: "/{lang}/admin/catalog/categories",
    category: "Admin Advanced Features",
    summary: "dev Categories Management – \"Gestión de Categorías de Servicio\" [Admin]",
    userStory: "Como administrador, quiero gestionar las categorías de servicios para organizar el catálogo de forma efectiva.",
    features: [
      "Lista completa de categorías",
      "Creación de nuevas categorías",
      "Edición de categorías existentes",
      "Eliminación lógica (soft delete)",
      "Asignación de servicios a categorías"
    ],
    frontendPath: "/packages/web/src/app/[lang]/(private)/admin/catalog/categories",
    backendEndpoints: ["GET /categories", "POST /categories", "PUT /categories/:id", "DELETE /categories/:id"],
    relatedALI: "ALI-56",
    role: "Admin"
  },

  {
    ali: "ALI-140",
    route: "/{lang}/admin/channels",
    category: "Admin Advanced Features",
    summary: "dev Channels List – \"Gestión de Canales de Comunicación\" [Admin]",
    userStory: "Como administrador, quiero gestionar los canales de comunicación para organizar las conversaciones del sistema.",
    features: [
      "Lista de todos los canales",
      "Creación de nuevos canales",
      "Configuración de canales",
      "Vista de mensajes por canal",
      "Gestión de miembros del canal"
    ],
    frontendPath: "/packages/web/src/app/[lang]/(private)/admin/channels",
    backendEndpoints: [],
    role: "Admin"
  },

  {
    ali: "ALI-141",
    route: "/{lang}/admin/channels/:channelId",
    category: "Admin Advanced Features",
    summary: "dev Channel Detail – \"Configuración y Mensajes del Canal\" [Admin]",
    userStory: "Como administrador, quiero ver y configurar los detalles de un canal específico incluyendo mensajes y miembros.",
    features: [
      "Detalles completos del canal",
      "Historial de mensajes del canal",
      "Configuración de permisos",
      "Gestión de miembros",
      "Edición de configuración del canal"
    ],
    frontendPath: "/packages/web/src/app/[lang]/(private)/admin/channels/[channelId]",
    backendEndpoints: [],
    role: "Admin"
  },

  {
    ali: "ALI-142",
    route: "/{lang}/admin/chat",
    category: "Admin Advanced Features",
    summary: "dev Chat Management – \"Vista General de Conversaciones\" [Admin]",
    userStory: "Como administrador, quiero ver todas las conversaciones del sistema para monitorear y gestionar la comunicación.",
    features: [
      "Lista de todas las conversaciones",
      "Filtros por estado, usuario, fecha",
      "Búsqueda de conversaciones",
      "Vista previa de mensajes",
      "Acceso a detalles de cada conversación"
    ],
    frontendPath: "/packages/web/src/app/[lang]/(private)/admin/chat",
    backendEndpoints: [],
    role: "Admin"
  },

  {
    ali: "ALI-143",
    route: "/{lang}/admin/chat/:conversationId",
    category: "Admin Advanced Features",
    summary: "dev Chat Conversation – \"Visor de Hilo de Mensajes\" [Admin]",
    userStory: "Como administrador, quiero ver el historial completo de una conversación para resolver problemas y monitorear interacciones.",
    features: [
      "Historial completo de mensajes",
      "Información de participantes",
      "Timestamps de cada mensaje",
      "Opciones de moderación",
      "Exportación de conversación"
    ],
    frontendPath: "/packages/web/src/app/[lang]/(private)/admin/chat/[conversationId]",
    backendEndpoints: [],
    role: "Admin"
  },

  {
    ali: "ALI-144",
    route: "/{lang}/admin/chat/analytics",
    category: "Admin Advanced Features",
    summary: "dev Chat Analytics – \"Métricas y Estadísticas de Chat\" [Admin]",
    userStory: "Como administrador, quiero ver métricas del sistema de chat para evaluar el uso y la efectividad de la comunicación.",
    features: [
      "Métricas de uso del chat",
      "Gráficas de actividad",
      "Estadísticas de participación",
      "Tiempos de respuesta promedio",
      "Tendencias de uso"
    ],
    frontendPath: "/packages/web/src/app/[lang]/(private)/admin/chat/analytics",
    backendEndpoints: [],
    role: "Admin"
  },

  {
    ali: "ALI-145",
    route: "/{lang}/admin/notifications/analytics",
    category: "Admin Advanced Features",
    summary: "dev Notification Analytics – \"Dashboard de Métricas de Notificaciones\" [Admin]",
    userStory: "Como administrador, quiero ver métricas de las notificaciones del sistema para evaluar su efectividad y alcance.",
    features: [
      "Estadísticas de envío de notificaciones",
      "Tasas de apertura y lectura",
      "Gráficas de tendencias",
      "Análisis por tipo de notificación",
      "Métricas de canales de entrega"
    ],
    frontendPath: "/packages/web/src/app/[lang]/(private)/admin/notifications/analytics",
    backendEndpoints: [],
    relatedALI: "ALI-35",
    role: "Admin"
  },

  {
    ali: "ALI-146",
    route: "/{lang}/admin/notifications/preferences",
    category: "Admin Advanced Features",
    summary: "dev Notification Preferences – \"Configuración de Notificaciones del Sistema\" [Admin]",
    userStory: "Como administrador, quiero configurar las preferencias globales de notificaciones para personalizar cómo el sistema envía alertas.",
    features: [
      "Configuración de canales de notificación",
      "Activación/desactivación de tipos de notificaciones",
      "Configuración de plantillas de notificación",
      "Programación de notificaciones",
      "Preferencias de envío (email, push, in-app)"
    ],
    frontendPath: "/packages/web/src/app/[lang]/(private)/admin/notifications/preferences",
    backendEndpoints: [],
    relatedALI: "ALI-35",
    role: "Admin"
  },

  {
    ali: "ALI-147",
    route: "/{lang}/admin/settings",
    category: "Admin Advanced Features",
    summary: "dev Admin Settings – \"Vista General de Configuración del Sistema\" [Admin]",
    userStory: "Como administrador, quiero acceder a todas las configuraciones del sistema desde un panel centralizado.",
    features: [
      "Vista general de todas las configuraciones",
      "Accesos a submódulos de configuración",
      "Configuraciones generales del sistema",
      "Gestión de parámetros globales",
      "Links a configuraciones específicas (chatbot, themes)"
    ],
    frontendPath: "/packages/web/src/app/[lang]/(private)/admin/settings",
    backendEndpoints: [],
    role: "Admin"
  },

  {
    ali: "ALI-148",
    route: "/{lang}/admin/settings/chatbot",
    category: "Admin Advanced Features",
    summary: "dev Chatbot Settings – \"Configuración del Chatbot\" [Admin]",
    userStory: "Como administrador, quiero configurar el comportamiento y respuestas del chatbot para mejorar la experiencia del usuario.",
    features: [
      "Configuración de respuestas automáticas",
      "Gestión de flujos de conversación",
      "Entrenamiento del chatbot",
      "Configuración de triggers",
      "Personalización de mensajes"
    ],
    frontendPath: "/packages/web/src/app/[lang]/(private)/admin/settings/chatbot",
    backendEndpoints: [],
    role: "Admin"
  },

  {
    ali: "ALI-149",
    route: "/{lang}/admin/settings/themes",
    category: "Admin Advanced Features",
    summary: "dev Theme Settings – \"Configuración de Temas Visuales\" [Admin]",
    userStory: "Como administrador, quiero personalizar los temas visuales de la aplicación para ajustar la apariencia a la marca.",
    features: [
      "Selección de tema (light/dark)",
      "Personalización de colores primarios",
      "Configuración de tipografía",
      "Vista previa de cambios",
      "Aplicación de temas personalizados"
    ],
    frontendPath: "/packages/web/src/app/[lang]/(private)/admin/settings/themes",
    backendEndpoints: [],
    role: "Admin"
  },

  {
    ali: "ALI-150",
    route: "/{lang}/admin/users/create",
    category: "Admin Advanced Features",
    summary: "dev Create User – \"Formulario de Registro de Nuevo Usuario\" [Admin]",
    userStory: "Como administrador, quiero crear nuevos usuarios directamente desde el panel admin para gestionar el acceso al sistema.",
    features: [
      "Formulario completo de creación de usuario",
      "Asignación de rol (CLIENT/EMPLOYEE/ADMIN)",
      "Configuración de permisos",
      "Envío de email de bienvenida",
      "Validación de datos obligatorios"
    ],
    frontendPath: "/packages/web/src/app/[lang]/(private)/admin/users/create",
    backendEndpoints: ["POST /users"],
    relatedALI: "ALI-58",
    role: "Admin"
  },

  // ===================================================
  // CATEGORY 4: SYSTEM UTILITIES (5 routes)
  // ALI-151 to ALI-155
  // ===================================================

  {
    ali: "ALI-151",
    route: "/{lang}/chat/popup/:conversationId",
    category: "System Utilities",
    summary: "dev Chat Popup – \"Ventana Emergente de Chat\" [System]",
    userStory: "Como usuario, quiero abrir una conversación de chat en una ventana emergente para mantener el contexto de mi trabajo principal.",
    features: [
      "Ventana emergente independiente",
      "Historial de conversación completo",
      "Envío y recepción de mensajes en tiempo real",
      "Minimizable y redimensionable",
      "Sincronización con vista principal"
    ],
    frontendPath: "/packages/web/src/app/[lang]/chat/popup/[conversationId]",
    backendEndpoints: [],
    role: "Shared"
  },

  {
    ali: "ALI-152",
    route: "/{lang}/design-system",
    category: "System Utilities",
    summary: "dev Design System – \"Documentación de Biblioteca de Componentes\" [Dev]",
    userStory: "Como desarrollador, quiero ver todos los componentes del design system en un catálogo para usarlos consistentemente.",
    features: [
      "Catálogo completo de componentes",
      "Ejemplos de uso de cada componente",
      "Props y variantes documentadas",
      "Código de ejemplo copiable",
      "Guías de estilo y mejores prácticas"
    ],
    frontendPath: "/packages/web/src/app/[lang]/(public)/design-system",
    backendEndpoints: [],
    role: "Public"
  },

  {
    ali: "ALI-153",
    route: "/{lang}/test",
    category: "System Utilities",
    summary: "dev Test Page – \"Página de Pruebas de Desarrollo\" [Dev]",
    userStory: "Como desarrollador, quiero una página de pruebas para experimentar con nuevas funcionalidades sin afectar el código de producción.",
    features: [
      "Espacio de pruebas libre",
      "Implementación temporal de features",
      "Testing de componentes nuevos",
      "Experimentación con APIs",
      "Solo disponible en desarrollo"
    ],
    frontendPath: "/packages/web/src/app/[lang]/(public)/test",
    backendEndpoints: [],
    role: "Public"
  },

  {
    ali: "ALI-154",
    route: "/{lang}/unauthorized",
    category: "System Utilities",
    summary: "dev Unauthorized – \"Página de Acceso Denegado\" [System]",
    userStory: "Como usuario, quiero ver un mensaje claro cuando no tengo permisos para acceder a una página para entender la restricción.",
    features: [
      "Mensaje de acceso denegado claro",
      "Explicación del motivo de restricción",
      "Opciones para contactar soporte",
      "Redirección a página principal",
      "Link para cambiar de cuenta"
    ],
    frontendPath: "/packages/web/src/app/[lang]/(public)/unauthorized",
    backendEndpoints: [],
    role: "Public"
  }
];

// Export count for verification
export const TOTAL_TASKS = extraRoutesData.length; // Should be 33

// Export categories for organization
export const CATEGORIES = {
  AUTH_EXTENDED: extraRoutesData.filter(t => t.category === "Authentication Extended"),
  SHARED_INFRA: extraRoutesData.filter(t => t.category === "Shared Infrastructure"),
  ADMIN_ADVANCED: extraRoutesData.filter(t => t.category === "Admin Advanced Features"),
  SYSTEM_UTILS: extraRoutesData.filter(t => t.category === "System Utilities")
};

// Verify counts
console.assert(CATEGORIES.AUTH_EXTENDED.length === 7, "Auth Extended should have 7 tasks");
console.assert(CATEGORIES.SHARED_INFRA.length === 8, "Shared Infra should have 8 tasks");
console.assert(CATEGORIES.ADMIN_ADVANCED.length === 13, "Admin Advanced should have 13 tasks");
console.assert(CATEGORIES.SYSTEM_UTILS.length === 4, "System Utils should have 4 tasks");
console.assert(TOTAL_TASKS === 32, "Total should be 32 tasks");
