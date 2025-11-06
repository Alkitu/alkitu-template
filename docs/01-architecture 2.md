# 🏗️ Alkitu Template - Architecture & Development Strategy

## 📋 Tabla de Contenidos

1. [Análisis del Stack Actual](#análisis-del-stack-actual)
2. [Evaluación de Principios SOLID](#evaluación-de-principios-solid)
3. [Arquitectura Propuesta](#arquitectura-propuesta)
4. [Roadmap Tecnológico](#roadmap-tecnológico)
5. [Sistema de Flags Modulares](#sistema-de-flags-modulares)
6. [Recomendaciones de Mejora](#recomendaciones-de-mejora)

---

## 🔍 Análisis del Stack Actual

### 📊 Stack Tecnológico Identificado

#### Backend (`@alkitu/api`)

- **Framework**: NestJS 11.0.1 con TypeScript 5.7.3
- **Base de Datos**: MongoDB con Prisma ORM 6.10.1
- **APIs**: tRPC 11.4.3 + REST (Swagger) + WebSocket (Socket.IO 4.8.1)
- **Autenticación**: JWT + Passport + RefreshToken + 2FA
- **Validación**: Zod 3.25.67 + class-validator 0.14.2
- **Email**: Resend 4.6.0 (completamente integrado)
- **Push Notifications**: Web-Push 3.6.7 (implementado)
- **Testing**: Jest + Supertest + ESLint + Prettier
- **Documentación**: Swagger/OpenAPI
- **GraphQL**: Configurado pero deshabilitado por defecto

#### Frontend (`@alkitu/web`)

- **Framework**: Next.js 15.3.4 (App Router)
- **Styling**: Tailwind CSS + Radix UI + Shadcn/ui
- **State Management**: React Query 5.81.5 + Zustand 5.0.6
- **Comunicación**: tRPC 11.4.3 + Socket.io 4.8.1
- **Tables**: TanStack Table 8.16.0 (uso extensivo)
- **Animations**: Framer Motion 11.0.14
- **Forms**: React Hook Form 7.49.3 + Zod 3.22.4
- **Internationalization**: Sistema completo ES/EN implementado
- **Testing**: Vitest + Testing Library + Playwright
- **Deployment**: Vercel-ready

#### Mobile (`@alkitu/mobile`)

- **Framework**: Flutter 3.10+
- **State Management**: Flutter Bloc 8.1.3 + Equatable 2.0.5
- **Networking**: Dio 5.3.2 + GraphQL Flutter 5.1.2
- **Storage**: Hive 2.2.3 + Secure Storage 9.0.0
- **Navigation**: GoRouter 13.2.0
- **UI**: Material Design + Custom Components
- **Status**: Configurado pero deshabilitado por defecto

#### Shared (`@alkitu/shared`)

- **Validación**: Zod schemas
- **Tipos**: TypeScript interfaces
- **Constantes**: API endpoints

#### CI/CD & DevOps (`infrastructure/`)

- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions con agentes AI
- **Testing**: Jest + Stryker (Mutation Testing)
- **Quality Gates**: 95% coverage + 85% mutation survival
- **Deployment**: Vercel + Railway automatizado
- **Monitoring**: Sentry + PostHog integrados
- **TDD Workflow**: Red-Green-Refactor automatizado

---

## 🔍 Estado Real del Stack (Post-Auditoría)

### ✅ **Servicios Completamente Implementados**

#### **Backend Services**

- **Authentication**: JWT + Passport + 2FA + OAuth (GitHub/Google)
- **Email**: Resend 4.6.0 con plantillas HTML completas
- **Push Notifications**: Web-Push 3.6.7 con Service Worker
- **WebSocket**: Socket.IO 4.8.1 para real-time features
- **Feature Flags**: Sistema freemium completo por módulos
- **Notifications**: Sistema completo con múltiples canales

#### **Frontend Features**

- **Translation System**: Sistema i18n completo ES/EN
- **Data Tables**: TanStack Table 8.16.0 usado extensivamente
- **Animations**: Framer Motion 11.0.14 para micro-interacciones
- **Forms**: React Hook Form + Zod con validación completa
- **State Management**: React Query + Zustand implementados

### ⚠️ **Servicios Configurados pero Deshabilitados**

#### **GraphQL API**

- **Estado**: Configurado en `modules.config.ts` pero deshabilitado por defecto
- **Móvil**: Usa `graphql_flutter` pero backend no expone GraphQL
- **Activación**: `ENABLE_MOBILE=true` en variables de entorno
- **Desarrollo**: Se habilita automáticamente en modo development

#### **Mobile App**

- **Estado**: Flutter app completamente configurado pero deshabilitado
- **Dependencias**: GraphQL + Auth configurados
- **Activación**: Requiere habilitar GraphQL primero

### ❌ **Servicios NO Implementados**

#### **Sistemas de Pago**

- **Redsys**: Mencionado pero NO implementado
- **Stripe**: PRD completo disponible pero sin implementar
- **PayPal**: No implementado
- **Billing**: Solo estructura básica (modelo Prisma)

#### **Servicios de Infraestructura**

- **Redis**: Configurado pero omitido intencionalmente (para chat futuro)
- **Queue System**: No implementado (se añadirá con Redis + chat)
- **Logging**: Winston no implementado (usando console.log)
- **Rate Limiting**: Básico implementado (suficiente para MVP)

#### **🎯 Decisión Redis: Omisión Estratégica**

Redis está **completamente configurado** en Docker pero **intencionalmente omitido** porque:

- Sistema JWT actual es altamente optimizado sin Redis
- MongoDB maneja sesiones eficientemente
- Decodificación JWT local evita calls al backend
- **Reservado para**: Chat real-time, messaging, user presence

---

## 🏛️ Evaluación de Principios SOLID

### ✅ **Fortalezas Actuales**

1. **Single Responsibility Principle (SRP)**:
   - ✅ Módulos bien separados por dominio (auth, users, notifications)
   - ✅ Servicios específicos para cada responsabilidad

2. **Dependency Inversion Principle (DIP)**:
   - ✅ Uso de interfaces implícitas a través de NestJS DI
   - ✅ PrismaService como abstracción de base de datos

### ⚠️ **Áreas de Mejora**

1. **Open/Closed Principle (OCP)**:
   - ❌ Servicios no son fácilmente extensibles sin modificación
   - ❌ Falta de interfaces explícitas para servicios

2. **Liskov Substitution Principle (LSP)**:
   - ❌ No hay jerarquías claras de tipos/clases
   - ❌ Falta de contratos explícitos

3. **Interface Segregation Principle (ISP)**:
   - ❌ Servicios con múltiples responsabilidades (`UsersService` hace demasiado)
   - ❌ DTOs muy grandes y genéricos

### 🔧 **Problemas Identificados**

```typescript
// ❌ Ejemplo: UsersService viola SRP
export class UsersService {
  // Gestión de usuarios
  async create(dto: CreateUserDto) {}
  async findAll() {}

  // Autenticación (debería estar en AuthService)
  async validateUser(loginDto: LoginUserDto) {}

  // Gestión de contraseñas (debería ser servicio separado)
  async changePassword(id: string, dto: ChangePasswordDto) {}

  // Operaciones masivas (debería ser servicio separado)
  async bulkDeleteUsers(dto: BulkDeleteUsersDto) {}

  // Estadísticas (debería ser servicio separado)
  async getUserStats() {}
}
```

---

## 🏗️ Arquitectura Propuesta

### 🎯 **Arquitectura Modular Mejorada**

```
┌─────────────────────────────────────────────────────────┐
│                    API Gateway                          │
│                 (Nginx/Traefik)                         │
└─────────────────────┬───────────────────────────────────┘
                      │
         ┌────────────┴─────────────┐
         │                          │
         ▼                          ▼
┌─────────────────┐         ┌─────────────────┐
│   Web Client    │         │  Mobile Client  │
│   (Next.js)     │         │   (Flutter)     │
└─────────────────┘         └─────────────────┘
         │                          │
         ▼                          ▼
┌─────────────────────────────────────────────────────────┐
│                 Backend Services                        │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │
│ │   Core API  │ │ Auth Module │ │User Module  │        │
│ │  (NestJS)   │ │  (tRPC)     │ │  (REST)     │        │
│ └─────────────┘ └─────────────┘ └─────────────┘        │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │
│ │ Products    │ │User Groups  │ │Tags System │        │
│ │   Service   │ │  Service    │ │  Service   │        │
│ └─────────────┘ └─────────────┘ └─────────────┘        │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │
│ │Chat System  │ │   MCP       │ │Notification │        │
│ │  (Public)   │ │ (Future)    │ │   (WS)      │        │
│ └─────────────┘ └─────────────┘ └─────────────┘        │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │
│ │GraphQL API  │ │ Analytics   │ │   Billing   │        │
│ │(Apollo)     │ │  Service    │ │   Service   │        │
│ └─────────────┘ └─────────────┘ └─────────────┘        │
└─────────────────────────────────────────────────────────┘
         │                          │
         ▼                          ▼
┌─────────────────┐         ┌─────────────────┐
│   MongoDB       │         │   Redis Cache   │
│   (Primary)     │         │   (Sessions)    │
└─────────────────┘         └─────────────────┘
```

### 🔧 **Refactoring Propuesto**

#### 1. **Separación de Responsabilidades**

```typescript
// ✅ Estructura mejorada
┌── users/
│   ├── users.module.ts
│   ├── services/
│   │   ├── users.service.ts          # CRUD básico
│   │   ├── user-bulk.service.ts      # Operaciones masivas
│   │   └── user-analytics.service.ts # Estadísticas
│   ├── controllers/
│   │   ├── users.controller.ts
│   │   └── user-admin.controller.ts
│   └── interfaces/
│       ├── user-repository.interface.ts
│       └── user-service.interface.ts
```

#### 2. **Interfaces Explícitas**

```typescript
// ✅ Interfaces para DIP
export interface IUserRepository {
  create(user: CreateUserDto): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, data: UpdateUserDto): Promise<User>;
  delete(id: string): Promise<void>;
}

export interface IUserService {
  createUser(dto: CreateUserDto): Promise<User>;
  getUserById(id: string): Promise<User>;
  updateUser(id: string, dto: UpdateUserDto): Promise<User>;
  deleteUser(id: string): Promise<void>;
}
```

#### 3. **Módulos Desacoplados**

```typescript
// ✅ Módulos independientes
export interface ModuleConfiguration {
  auth: AuthConfig;
  users: UsersConfig;
  notifications: NotificationsConfig;
  billing: BillingConfig;
  analytics: AnalyticsConfig;
}

export interface AuthConfig {
  enabled: boolean;
  providers: ("local" | "google" | "github")[];
  jwtSecret: string;
  refreshTokenTTL: number;
}
```

---

## 🚀 Roadmap Tecnológico

### 🎯 **Fase 1: MVP Sólido (2-3 meses)**

#### Objetivos:

- Refactorizar backend aplicando principios SOLID
- Implementar sistema de flags modulares básico
- Completar integración tRPC + Next.js
- Documentación completa

#### Tareas:

1. **Backend Refactoring**:
   - [ ] Separar servicios por responsabilidad
   - [ ] Implementar interfaces explícitas
   - [ ] Crear sistema de configuración modular
   - [ ] Mejorar testing (>80% coverage)

2. **Frontend Consolidation**:
   - [ ] Integrar NextAuth.js con tRPC
   - [ ] Completar sistema de componentes UI
   - [ ] Implementar manejo de errores global
   - [ ] Optimizar performance

3. **Infrastructure**:
   - [ ] Docker setup mejorado
   - [ ] CI/CD pipeline
   - [ ] Monitoring básico
   - [ ] Deployment scripts

### 🔮 **Fase 2: GraphQL + Advanced Features (2-3 meses)**

#### Objetivos:

- Implementar GraphQL API
- Completar integración mobile
- Sistema de flags avanzado
- Performance optimization

#### Tareas:

1. **GraphQL Implementation**:
   - [ ] Apollo Server setup
   - [ ] Schema federation
   - [ ] Resolvers con DataLoader
   - [ ] Subscriptions en tiempo real

2. **Mobile Integration**:
   - [ ] Shared GraphQL schemas
   - [ ] Authentication flow
   - [ ] Push notifications
   - [ ] Offline support

3. **Advanced Modularity**:
   - [ ] Plugin system
   - [ ] Dynamic module loading
   - [ ] Configuration UI
   - [ ] Module marketplace

### 🌟 **Fase 3: MCP + AI Features (3-4 meses)**

#### Objetivos:

- Integrar Model Context Protocol
- AI-powered features
- Enterprise features
- Scaling preparation

#### Tareas:

1. **MCP Integration**:
   - [ ] MCP server setup
   - [ ] Context management
   - [ ] AI model integration
   - [ ] Conversation handling

2. **AI Features**:
   - [ ] Intelligent notifications
   - [ ] Automated user insights
   - [ ] Content generation
   - [ ] Predictive analytics

3. **Enterprise Ready**:
   - [ ] Multi-tenancy
   - [ ] Advanced RBAC
   - [ ] Audit logging
   - [ ] Compliance features

---

## 🎛️ Sistema de Flags Modulares

### 📋 **Configuración Propuesta**

```typescript
// config/modules.config.ts
export interface ModuleConfig {
  core: {
    auth: ModuleFlag;
    users: ModuleFlag;
    health: ModuleFlag;
  };
  features: {
    notifications: ModuleFlag;
    billing: ModuleFlag;
    analytics: ModuleFlag;
    websocket: ModuleFlag;
    email: ModuleFlag;
    products: ModuleFlag;
    userGroups: ModuleFlag;
    tags: ModuleFlag;
    chat: ModuleFlag;
  };
  integrations: {
    tRPC: ModuleFlag;
    graphQL: ModuleFlag;
    rest: ModuleFlag;
    mcp: ModuleFlag;
  };
  platforms: {
    web: ModuleFlag;
    mobile: ModuleFlag;
    desktop: ModuleFlag;
  };
}

interface ModuleFlag {
  enabled: boolean;
  version: string;
  dependencies: string[];
  config: Record<string, any>;
}
```

### 🔧 **Implementación**

```typescript
// core/module-manager.ts
@Injectable()
export class ModuleManager {
  private modules: Map<string, ModuleFlag> = new Map();

  async initializeModules(config: ModuleConfig): Promise<void> {
    const enabledModules = this.getEnabledModules(config);

    for (const module of enabledModules) {
      await this.loadModule(module);
    }
  }

  private async loadModule(module: ModuleDefinition): Promise<void> {
    if (this.checkDependencies(module)) {
      await this.registerModule(module);
    }
  }
}
```

### 🎯 **Niveles de Flags**

1. **Nivel 1 - Módulos Core**:
   - Authentication
   - User Management
   - Health Monitoring

2. **Nivel 2 - Features**:
   - Notifications
   - Billing
   - Email Services
   - WebSocket

3. **Nivel 3 - Integrations**:
   - tRPC
   - GraphQL
   - REST APIs
   - MCP

4. **Nivel 4 - Platforms**:
   - Web Client
   - Mobile Apps
   - Desktop Apps

---

## 🏗️ Nuevos Servicios Backend

### 📦 **Products/Services Management System**

#### **Arquitectura del Servicio**

```typescript
// Estructura del módulo Products
┌── products/
│   ├── products.module.ts
│   ├── services/
│   │   ├── products.service.ts           # CRUD de productos
│   │   ├── product-categories.service.ts # Gestión de categorías
│   │   ├── product-pricing.service.ts    # Gestión de precios
│   │   └── product-analytics.service.ts  # Métricas de productos
│   ├── controllers/
│   │   ├── products.controller.ts        # API REST
│   │   └── products-admin.controller.ts  # Admin endpoints
│   ├── routers/
│   │   └── products.router.ts            # tRPC router
│   ├── interfaces/
│   │   ├── product-repository.interface.ts
│   │   └── product-service.interface.ts
│   └── dto/
│       ├── create-product.dto.ts
│       ├── update-product.dto.ts
│       └── product-filter.dto.ts
```

#### **Modelos de Base de Datos**

```typescript
model Product {
  id          String        @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  description String?
  slug        String        @unique
  sku         String?       @unique
  type        ProductType   @default(PHYSICAL)
  status      ProductStatus @default(DRAFT)

  // Categorización
  category    ProductCategory? @relation(fields: [categoryId], references: [id])
  categoryId  String?          @db.ObjectId
  tags        Tag[]            @relation("ProductTags")

  // Precios y variantes
  basePrice   Float
  pricing     ProductPricing[]
  variants    ProductVariant[]

  // Inventario
  trackInventory Boolean @default(false)
  stockQuantity  Int?    @default(0)

  // SEO y metadata
  metaTitle       String?
  metaDescription String?
  images          ProductImage[]

  // Audit
  createdBy   User     @relation(fields: [createdById], references: [id])
  createdById String   @db.ObjectId
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("products")
}

model ProductCategory {
  id          String    @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  slug        String    @unique
  description String?
  parentId    String?   @db.ObjectId
  parent      ProductCategory? @relation("CategoryHierarchy", fields: [parentId], references: [id], onDelete: NoAction, onUpdate: NoAction)
  children    ProductCategory[] @relation("CategoryHierarchy")
  products    Product[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@map("product_categories")
}

model ProductPricing {
  id        String      @id @default(auto()) @map("_id") @db.ObjectId
  product   Product     @relation(fields: [productId], references: [id], onDelete: Cascade)
  productId String      @db.ObjectId
  name      String      // Basic, Premium, Enterprise
  price     Float
  currency  String      @default("USD")
  interval  PriceInterval @default(ONE_TIME)
  features  String[]    // Lista de features incluidas
  isDefault Boolean     @default(false)
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt

  @@map("product_pricing")
}

enum ProductType {
  PHYSICAL
  DIGITAL
  SERVICE
  SUBSCRIPTION
}

enum ProductStatus {
  DRAFT
  ACTIVE
  INACTIVE
  ARCHIVED
}

enum PriceInterval {
  ONE_TIME
  DAILY
  WEEKLY
  MONTHLY
  YEARLY
}
```

#### **Interfaces de Servicio**

```typescript
export interface IProductService {
  // CRUD Operations
  createProduct(dto: CreateProductDto): Promise<Product>;
  getProductById(id: string): Promise<Product>;
  getProductBySlug(slug: string): Promise<Product>;
  updateProduct(id: string, dto: UpdateProductDto): Promise<Product>;
  deleteProduct(id: string): Promise<void>;

  // Filtering & Search
  searchProducts(filters: ProductFilterDto): Promise<PaginatedResult<Product>>;
  getProductsByCategory(categoryId: string): Promise<Product[]>;
  getProductsByTags(tagIds: string[]): Promise<Product[]>;

  // Pricing Management
  addPricingTier(
    productId: string,
    pricing: ProductPricing
  ): Promise<ProductPricing>;
  updatePricing(
    pricingId: string,
    data: Partial<ProductPricing>
  ): Promise<ProductPricing>;
  deletePricing(pricingId: string): Promise<void>;

  // Inventory Management
  updateStock(productId: string, quantity: number): Promise<Product>;
  checkAvailability(productId: string, quantity: number): Promise<boolean>;
}
```

---

### 👥 **User Groups Management System**

#### **Arquitectura del Servicio**

```typescript
// Estructura del módulo User Groups
┌── user-groups/
│   ├── user-groups.module.ts
│   ├── services/
│   │   ├── user-groups.service.ts        # CRUD de grupos
│   │   ├── group-membership.service.ts   # Gestión de membresías
│   │   ├── group-permissions.service.ts  # Permisos de grupos
│   │   └── group-analytics.service.ts    # Métricas de grupos
│   ├── controllers/
│   │   ├── user-groups.controller.ts     # API REST
│   │   └── group-admin.controller.ts     # Admin endpoints
│   ├── routers/
│   │   └── user-groups.router.ts         # tRPC router
│   ├── interfaces/
│   │   ├── user-group-repository.interface.ts
│   │   └── user-group-service.interface.ts
│   └── dto/
│       ├── create-group.dto.ts
│       ├── update-group.dto.ts
│       └── group-membership.dto.ts
```

#### **Modelos de Base de Datos**

```typescript
model UserGroup {
  id          String      @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  description String?
  slug        String      @unique
  type        GroupType   @default(CUSTOM)
  visibility  GroupVisibility @default(PRIVATE)

  // Configuración
  maxMembers  Int?        // Límite de miembros
  autoJoin    Boolean     @default(false)
  requireApproval Boolean @default(true)

  // Relaciones
  members     GroupMembership[]
  permissions GroupPermission[]
  tags        Tag[]         @relation("GroupTags")

  // Metadata
  avatar      String?
  coverImage  String?
  settings    Json?         // Configuraciones adicionales

  // Audit
  createdBy   User        @relation("GroupCreator", fields: [createdById], references: [id])
  createdById String      @db.ObjectId
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@map("user_groups")
}

model GroupMembership {
  id       String          @id @default(auto()) @map("_id") @db.ObjectId
  user     User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId   String          @db.ObjectId
  group    UserGroup       @relation(fields: [groupId], references: [id], onDelete: Cascade)
  groupId  String          @db.ObjectId
  role     GroupRole       @default(MEMBER)
  status   MembershipStatus @default(PENDING)

  // Metadata
  joinedAt  DateTime?
  invitedBy String?        @db.ObjectId
  inviter   User?          @relation("GroupInviter", fields: [invitedBy], references: [id])
  createdAt DateTime       @default(now())
  updatedAt DateTime       @updatedAt

  @@unique([userId, groupId])
  @@map("group_memberships")
}

model GroupPermission {
  id         String    @id @default(auto()) @map("_id") @db.ObjectId
  group      UserGroup @relation(fields: [groupId], references: [id], onDelete: Cascade)
  groupId    String    @db.ObjectId
  permission String    // manage_members, post_content, moderate, etc.
  roles      GroupRole[] // Roles que tienen este permiso
  createdAt  DateTime  @default(now())

  @@unique([groupId, permission])
  @@map("group_permissions")
}

enum GroupType {
  SYSTEM      // Grupos del sistema (Admin, Users, etc.)
  DEPARTMENT  // Departamentos organizacionales
  PROJECT     // Grupos de proyecto
  CUSTOM      // Grupos personalizados
}

enum GroupVisibility {
  PUBLIC      // Visible para todos
  PRIVATE     // Solo para miembros
  HIDDEN      // No visible en listados
}

enum GroupRole {
  OWNER       // Creador del grupo
  ADMIN       // Administrador
  MODERATOR   // Moderador
  MEMBER      // Miembro estándar
  GUEST       // Invitado temporal
}

enum MembershipStatus {
  PENDING     // Pendiente de aprobación
  ACTIVE      // Miembro activo
  SUSPENDED   // Suspendido temporalmente
  BANNED      // Baneado permanentemente
}
```

#### **Interfaces de Servicio**

```typescript
export interface IUserGroupService {
  // Group Management
  createGroup(dto: CreateGroupDto): Promise<UserGroup>;
  getGroupById(id: string): Promise<UserGroup>;
  getGroupBySlug(slug: string): Promise<UserGroup>;
  updateGroup(id: string, dto: UpdateGroupDto): Promise<UserGroup>;
  deleteGroup(id: string): Promise<void>;

  // Membership Management
  addMember(
    groupId: string,
    userId: string,
    role?: GroupRole
  ): Promise<GroupMembership>;
  removeMember(groupId: string, userId: string): Promise<void>;
  updateMemberRole(
    membershipId: string,
    role: GroupRole
  ): Promise<GroupMembership>;
  approveMembership(membershipId: string): Promise<GroupMembership>;

  // Query Operations
  getGroupMembers(groupId: string): Promise<GroupMembership[]>;
  getUserGroups(userId: string): Promise<UserGroup[]>;
  searchGroups(
    query: string,
    filters?: GroupFilterDto
  ): Promise<PaginatedResult<UserGroup>>;

  // Permission Management
  grantPermission(
    groupId: string,
    permission: string,
    roles: GroupRole[]
  ): Promise<GroupPermission>;
  revokePermission(groupId: string, permission: string): Promise<void>;
  checkPermission(
    userId: string,
    groupId: string,
    permission: string
  ): Promise<boolean>;
}
```

---

### 🏷️ **Tags System Service**

#### **Arquitectura del Servicio**

```typescript
// Estructura del módulo Tags
┌── tags/
│   ├── tags.module.ts
│   ├── services/
│   │   ├── tags.service.ts              # CRUD de tags
│   │   ├── tag-categories.service.ts    # Categorías de tags
│   │   ├── tag-suggestions.service.ts   # Sugerencias automáticas
│   │   └── tag-analytics.service.ts     # Métricas de uso
│   ├── controllers/
│   │   ├── tags.controller.ts           # API REST
│   │   └── tags-admin.controller.ts     # Admin endpoints
│   ├── routers/
│   │   └── tags.router.ts               # tRPC router
│   ├── interfaces/
│   │   ├── tag-repository.interface.ts
│   │   └── tag-service.interface.ts
│   └── dto/
│       ├── create-tag.dto.ts
│       ├── update-tag.dto.ts
│       └── tag-filter.dto.ts
```

#### **Modelos de Base de Datos**

```typescript
model Tag {
  id          String      @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  slug        String      @unique
  description String?
  color       String?     // Color hex para UI
  icon        String?     // Icono opcional

  // Categorización
  category    TagCategory? @relation(fields: [categoryId], references: [id])
  categoryId  String?      @db.ObjectId

  // Configuración
  isSystem    Boolean     @default(false)  // Tags del sistema
  isPublic    Boolean     @default(true)   // Visible para usuarios

  // Relaciones polimórficas
  products    Product[]   @relation("ProductTags")
  userGroups  UserGroup[] @relation("GroupTags")
  users       User[]      @relation("UserTags")

  // Métricas
  usageCount  Int         @default(0)

  // Audit
  createdBy   User        @relation("TagCreator", fields: [createdById], references: [id])
  createdById String      @db.ObjectId
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@map("tags")
}

model TagCategory {
  id          String    @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  slug        String    @unique
  description String?
  color       String?
  icon        String?

  // Jerarquía
  parentId    String?   @db.ObjectId
  parent      TagCategory? @relation("TagCategoryHierarchy", fields: [parentId], references: [id], onDelete: NoAction, onUpdate: NoAction)
  children    TagCategory[] @relation("TagCategoryHierarchy")

  // Relaciones
  tags        Tag[]

  // Configuración
  isSystem    Boolean   @default(false)
  sortOrder   Int       @default(0)

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@map("tag_categories")
}

model TagUsage {
  id           String    @id @default(auto()) @map("_id") @db.ObjectId
  tag          Tag       @relation(fields: [tagId], references: [id], onDelete: Cascade)
  tagId        String    @db.ObjectId
  entityType   String    // 'product', 'user', 'group', etc.
  entityId     String    @db.ObjectId

  // Metadata
  appliedBy    User      @relation(fields: [appliedById], references: [id])
  appliedById  String    @db.ObjectId
  createdAt    DateTime  @default(now())

  @@unique([tagId, entityType, entityId])
  @@map("tag_usage")
}
```

#### **Interfaces de Servicio**

```typescript
export interface ITagService {
  // Tag Management
  createTag(dto: CreateTagDto): Promise<Tag>;
  getTagById(id: string): Promise<Tag>;
  getTagBySlug(slug: string): Promise<Tag>;
  updateTag(id: string, dto: UpdateTagDto): Promise<Tag>;
  deleteTag(id: string): Promise<void>;

  // Category Management
  createCategory(dto: CreateTagCategoryDto): Promise<TagCategory>;
  updateCategory(id: string, dto: UpdateTagCategoryDto): Promise<TagCategory>;
  deleteCategory(id: string): Promise<void>;

  // Tagging Operations
  tagEntity(
    entityType: string,
    entityId: string,
    tagIds: string[]
  ): Promise<void>;
  untagEntity(
    entityType: string,
    entityId: string,
    tagIds: string[]
  ): Promise<void>;
  getEntityTags(entityType: string, entityId: string): Promise<Tag[]>;
  getEntitiesByTag(tagId: string, entityType?: string): Promise<any[]>;

  // Search & Suggestions
  searchTags(query: string, category?: string): Promise<Tag[]>;
  suggestTags(text: string, limit?: number): Promise<Tag[]>;
  getPopularTags(limit?: number): Promise<Tag[]>;

  // Analytics
  getTagUsageStats(tagId: string): Promise<TagUsageStats>;
  incrementUsage(tagId: string): Promise<void>;
}
```

---

### 💬 **Public Chat System**

#### **Arquitectura del Servicio**

```typescript
// Estructura del módulo Chat
┌── chat/
│   ├── chat.module.ts
│   ├── services/
│   │   ├── chat.service.ts              # Lógica de chat
│   │   ├── conversation.service.ts      # Gestión de conversaciones
│   │   ├── chat-analytics.service.ts    # Métricas de chat
│   │   └── chat-config.service.ts       # Configuración
│   ├── controllers/
│   │   ├── chat.controller.ts           # API pública
│   │   └── chat-admin.controller.ts     # Dashboard interno
│   ├── routers/
│   │   └── chat.router.ts               # tRPC router
│   ├── gateways/
│   │   └── chat.gateway.ts              # WebSocket gateway
│   ├── interfaces/
│   │   ├── chat-repository.interface.ts
│   │   └── chat-service.interface.ts
│   └── dto/
│       ├── start-conversation.dto.ts
│       ├── send-message.dto.ts
│       └── chat-config.dto.ts
```

#### **Modelos de Base de Datos** (Ya documentados en el archivo adjunto)

Los modelos principales incluyen:

- `Conversation`: Conversaciones del chat
- `ChatMessage`: Mensajes individuales
- `ContactInfo`: Información de contacto de visitantes
- `ChatAnalytics`: Métricas del sistema

#### **Interfaces de Servicio**

```typescript
export interface IChatService {
  // Conversation Management
  startConversation(contactInfo: ContactInfo): Promise<Conversation>;
  getConversation(id: string): Promise<Conversation>;
  assignConversation(
    conversationId: string,
    userId: string
  ): Promise<Conversation>;
  updateConversationStatus(
    conversationId: string,
    status: ConversationStatus
  ): Promise<Conversation>;

  // Message Management
  sendMessage(
    conversationId: string,
    content: string,
    isFromVisitor: boolean
  ): Promise<ChatMessage>;
  getMessages(conversationId: string): Promise<ChatMessage[]>;
  markMessagesAsRead(conversationId: string, userId?: string): Promise<void>;

  // Admin Operations
  getConversations(
    filters?: ConversationFilterDto
  ): Promise<PaginatedResult<Conversation>>;
  searchConversations(query: string): Promise<Conversation[]>;
  addInternalNote(
    conversationId: string,
    note: string,
    userId: string
  ): Promise<void>;

  // Configuration
  updateChatConfig(config: ChatConfigDto): Promise<ChatConfig>;
  getChatConfig(): Promise<ChatConfig>;
}
```

---

## 🤖 CI/CD Controlado por Agentes

### 🎯 **Arquitectura de CI/CD con Agentes AI**

```
┌─────────────────────────────────────────────────────────┐
│                Agent Orchestrator                       │
│              (Central Command)                          │
└─────────────────────┬───────────────────────────────────┘
                      │
         ┌────────────┼─────────────┐
         │            │             │
         ▼            ▼             ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│Testing Agent│ │Build Agent  │ │Deploy Agent │
│   (TDD)     │ │  (Docker)   │ │ (Vercel)    │
└─────────────┘ └─────────────┘ └─────────────┘
         │            │             │
         ▼            ▼             ▼
┌─────────────────────────────────────────────────────────┐
│              Quality Gates & Validation                │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│  │95% Coverage │ │85% Mutation │ │Zero Failures│      │
│  │   (Jest)    │ │  (Stryker)  │ │    (E2E)    │      │
│  └─────────────┘ └─────────────┘ └─────────────┘      │
└─────────────────────────────────────────────────────────┘
         │            │             │
         ▼            ▼             ▼
┌─────────────────────────────────────────────────────────┐
│                Docker Environment                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│  │Development  │ │   Testing   │ │ Production  │      │
│  │Environment  │ │Environment  │ │Environment  │      │
│  └─────────────┘ └─────────────┘ └─────────────┘      │
└─────────────────────────────────────────────────────────┘
```

### 🔄 **Flujo TDD (Red-Green-Refactor) Automatizado**

```typescript
// TDD Workflow controlado por agentes
interface TDDWorkflow {
  // 🔴 RED: Escribir test que falle
  redPhase: {
    agent: "Testing Agent";
    task: "Write failing test";
    acceptanceCriteria: "Test fails as expected";
    commands: [
      "npm run test:watch",
      "npm run test:unit -- --testNamePattern={feature}",
    ];
  };

  // 🟢 GREEN: Implementar código mínimo
  greenPhase: {
    agent: "Backend Agent | Frontend Agent";
    task: "Implement minimal code";
    acceptanceCriteria: "Test passes";
    commands: ["npm run test:unit", "npm run test:integration"];
  };

  // 🔄 REFACTOR: Mejorar código
  refactorPhase: {
    agent: "Architecture Agent";
    task: "Improve code quality";
    acceptanceCriteria: "All tests pass + SOLID principles";
    commands: ["npm run test:all", "npm run lint", "npm run type-check"];
  };

  // 🧪 MUTATION: Validar calidad de tests
  mutationPhase: {
    agent: "Testing Agent";
    task: "Run mutation testing";
    acceptanceCriteria: "85%+ mutation survival rate";
    commands: ["npm run test:mutation", "npm run test:coverage"];
  };
}
```

### 🐳 **Docker para Desarrollo**

```yaml
# docker-compose.dev.yml (Simplificado)
version: "3.8"
services:
  # Backend API
  api:
    build:
      context: .
      dockerfile: packages/api/Dockerfile.dev
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=mongodb://mongodb:27017/alkitu
    volumes:
      - ./packages/api:/app/packages/api
      - ./packages/shared:/app/packages/shared
    depends_on:
      - mongodb
      - redis

  # Frontend Web
  web:
    build:
      context: .
      dockerfile: packages/web/Dockerfile.dev
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://api:3001
    volumes:
      - ./packages/web:/app/packages/web
    depends_on:
      - api

  # MongoDB Database
  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  # Redis Cache
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data/db

volumes:
  mongodb_data:
  redis_data:
```

### 🚀 **GitHub Actions para Agentes**

```yaml
# .github/workflows/agent-ci.yml
name: AI Agent CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  # Phase 1: TDD Red-Green-Refactor
  tdd-cycle:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: 🔴 RED Phase - Run failing tests
        run: |
          npm run test:unit -- --passWithNoTests
          echo "RED_PHASE_RESULT=$?" >> $GITHUB_ENV

      - name: 🟢 GREEN Phase - Run all tests
        run: |
          npm run test:all
          echo "GREEN_PHASE_RESULT=$?" >> $GITHUB_ENV

      - name: 🔄 REFACTOR Phase - Quality checks
        run: |
          npm run lint
          npm run type-check
          npm run test:integration

  # Phase 2: Mutation Testing
  mutation-testing:
    needs: tdd-cycle
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "20.x"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: 🧪 Run Stryker Mutation Testing
        run: npm run test:mutation

      - name: Validate mutation score
        run: |
          MUTATION_SCORE=$(cat reports/mutation/mutation.json | jq '.mutationScore')
          if (( $(echo "$MUTATION_SCORE < 85" | bc -l) )); then
            echo "❌ Mutation score ($MUTATION_SCORE%) below threshold (85%)"
            exit 1
          else
            echo "✅ Mutation score ($MUTATION_SCORE%) meets threshold"
          fi

  # Phase 3: Docker Build & Test
  docker-build:
    needs: [tdd-cycle, mutation-testing]
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: 🐳 Start Development Environment
        run: |
          npm run dev:docker
          sleep 30  # Wait for services to be ready

      - name: Run tests
        run: |
          npm run test:all

      - name: Build all packages
        run: |
          npm run build

      - name: Quality gates validation
        run: |
          npm run lint
          npm run type-check

      - name: Cleanup
        run: npm run docker:stop

  # Phase 4: Deploy (if all tests pass)
  deploy:
    needs: [docker-build]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: 🚀 Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### 📊 **Quality Gates & Metrics**

```typescript
// Quality gates enforced by agents
interface QualityGates {
  coverage: {
    minimum: 95; // %
    enforcer: "Testing Agent";
    command: "npm run test:coverage";
    reportPath: "coverage/lcov-report/index.html";
  };

  mutationTesting: {
    minimum: 85; // % survival rate
    enforcer: "Testing Agent";
    command: "npm run test:mutation";
    reportPath: "reports/mutation/mutation.html";
  };

  typeChecking: {
    errors: 0;
    enforcer: "Backend Agent | Frontend Agent";
    command: "npm run type-check";
  };

  linting: {
    errors: 0;
    warnings: 0;
    enforcer: "All Agents";
    command: "npm run lint";
  };

  performance: {
    buildTime: "< 5 minutes";
    testTime: "< 3 minutes";
    enforcer: "DevOps Agent";
  };

  security: {
    vulnerabilities: 0;
    enforcer: "DevOps Agent";
    command: "npm audit --audit-level high";
  };
}
```

### 🔧 **Scripts de Testing y Building**

```json
// package.json scripts para agentes
{
  "scripts": {
    // TDD Workflow
    "test:tdd": "jest --watch --verbose",
    "test:red": "jest --testNamePattern='should fail' --verbose",
    "test:green": "jest --testNamePattern='should pass' --verbose",
    "test:refactor": "npm run lint && npm run type-check && npm run test:all",

    // Testing Commands
    "test": "npm-run-all test:*",
    "test:web": "cd packages/web && npm run test",
    "test:api": "cd packages/api && npm run test",
    "test:shared": "cd packages/shared && npm run test",

    // Building Commands
    "build:all": "npm run build:shared && npm run build:api && npm run build:web",
    "build:shared": "npm run build --workspace=@alkitu/shared",
    "build:api": "npm run build --workspace=@alkitu/api",
    "build:web": "npm run build --workspace=@alkitu/web",
    "build:docker": "npm run dev:docker",

    // Quality Commands
    "lint": "npm-run-all lint:*",
    "type-check": "npm-run-all type-check:*",
    "clean": "npm-run-all clean:*",

    // Docker Commands
    "docker:stop": "./scripts/stop.sh",
    "docker:logs": "./scripts/logs.sh",
    "docker:restart": "./scripts/restart.sh",

    // Database Commands
    "db:shell": "./scripts/db-shell.sh",
    "db:migrate": "cd packages/api && npm run prisma:migrate",
    "db:push": "cd packages/api && npm run prisma:push",
    "db:studio": "cd packages/api && npm run prisma:studio"
  }
}
```

---

## 📈 Recomendaciones de Mejora

### 🔥 **Prioridad Alta**

1. **Refactorizar UsersService**:

   ```typescript
   // Dividir en servicios específicos
   -UserCrudService - UserAuthService - UserBulkService - UserAnalyticsService;
   ```

2. **Implementar Interfaces**:

   ```typescript
   // Crear contratos explícitos
   -IUserRepository - IUserService - IAuthService - INotificationService;
   ```

3. **Sistema de Configuración**:
   ```typescript
   // Configuración centralizada
   -ModuleConfigService - FeatureFlagService - EnvironmentService;
   ```

### 🚀 **Prioridad Media**

1. **Arquitectura Hexagonal**:
   - Separar lógica de negocio de infraestructura
   - Ports & Adapters pattern
   - Domain-driven design

2. **Event-Driven Architecture**:
   - Event bus interno
   - Event sourcing
   - CQRS pattern

3. **Microservicios Preparación**:
   - Service mesh ready
   - API Gateway
   - Distributed tracing

### 💡 **Prioridad Baja**

1. **Observability**:
   - Logging estructurado
   - Metrics collection
   - Distributed tracing

2. **Security Enhancements**:
   - Rate limiting
   - API security
   - Data encryption

---

## 🎯 Próximos Pasos

### Inmediatos (1-2 semanas):

1. Definir flags de módulos prioritarios
2. Refactorizar UserService
3. Crear interfaces base
4. Setup CI/CD básico

### Corto plazo (1 mes):

1. Completar refactoring backend
2. Implementar sistema de flags
3. Mejorar documentación
4. Testing completo

### Medio plazo (2-3 meses):

1. GraphQL implementation
2. Mobile integration
3. Advanced modularity
4. Performance optimization

---

## 🤝 Preguntas Pendientes

1. **¿Qué nivel de granularidad prefieres para los flags de módulos?**
2. **¿Prioridad en simplicidad vs. robustez arquitectónica?**
3. **¿Timeline específico para MVP?**
4. **¿Modelo de comercialización de la plantilla?**
5. **¿Requisitos específicos de escalabilidad?**

---

_Esta documentación será actualizada según el feedback y las decisiones tomadas en el proceso de desarrollo._
