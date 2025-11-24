# ALI-117: Work Locations Management - Technical Spec

**Sprint**: Sprint-1 | **Epic**: ALI-18 (Database) | **Priority**: MEDIUM  
**Status**: 🔄 **IN PLANNING**

---

## 📋 Quick Summary

Implementar sistema de ubicaciones de trabajo reutilizables para clientes.
- ❌ WorkLocation model (nuevo)
- ❌ CRUD endpoints completo
- ❌ Frontend: formulario y lista de ubicaciones
- ❌ Integración con New Request flow (ALI-119)

**Objetivo**: Permitir a clientes gestionar direcciones de trabajo para reutilizar en solicitudes.

---

## 🎯 Objetivos Principales

### 1. WorkLocation Model
**Campos completos para direcciones complejas**:
- **Básicos**: street, city, zip, state
- **Opcionales**: building, tower, floor, unit
- **Relación**: userId (cliente propietario)
- **Metadata**: createdAt

### 2. CRUD Completo
- **Create**: Agregar nueva ubicación
- **Read**: Listar ubicaciones del usuario
- **Update**: Editar ubicación existente
- **Delete**: Eliminar ubicación (soft o hard delete)

### 3. Integration Points
- **New Request - Step 1** (ALI-36): Seleccionar o crear ubicación
- **Request Detail** (ALI-41, ALI-43, ALI-44): Mostrar ubicación asociada
- **Calendar** (ALI-55): Mostrar ubicación en eventos

### 4. Validation Rules
- Al menos una ubicación requerida para crear requests
- No duplicar direcciones idénticas
- Campos city, zip, state requeridos
- Street requerido
- Building, tower, floor, unit opcionales

---

## 📊 Implementation Status

### ❌ Pendiente (100%)

**Database Schema**:
- ❌ WorkLocation model
- ❌ Relación User → WorkLocation
- ❌ Migration

**Backend**:
- ❌ WorkLocation DTOs (Create, Update)
- ❌ WorkLocation Service (CRUD)
- ❌ WorkLocation Controller (endpoints)
- ❌ WorkLocation Module
- ❌ Tests unitarios (95%+)
- ❌ Tests E2E

**Frontend**:
- ❌ LocationFormOrganism (create/edit)
- ❌ LocationListOrganism (list + delete)
- ❌ LocationCardMolecule (item display)
- ❌ Manage Locations page
- ❌ Integration con New Request flow
- ❌ Tests unitarios
- ❌ Tests E2E

**Shared**:
- ❌ WorkLocation types
- ❌ WorkLocation schemas (Zod)

---

## 📝 User Stories

### US-117-001: Create Work Location
```gherkin
Scenario: Cliente crea nueva ubicación
  Given estoy logueado como CLIENT
  And estoy en /app/locations
  When hago click en "Add New Location"
  And ingreso street "123 Main St"
  And ingreso building "Tower A"
  And ingreso floor "5"
  And ingreso unit "501"
  And ingreso city "New York"
  And ingreso zip "10001"
  And ingreso state "NY"
  And hago click en "Save"
  Then veo mensaje "Location added successfully"
  And veo la nueva ubicación en la lista
  And la ubicación está disponible para New Request
```

### US-117-002: Edit Work Location
```gherkin
Scenario: Cliente edita ubicación existente
  Given tengo una ubicación "123 Main St"
  And estoy en /app/locations
  When hago click en "Edit" en esa ubicación
  And cambio floor a "6"
  And hago click en "Save"
  Then veo mensaje "Location updated successfully"
  And veo los cambios reflejados en la lista
```

### US-117-003: Delete Work Location
```gherkin
Scenario: Cliente elimina ubicación sin requests asociados
  Given tengo una ubicación sin requests
  And estoy en /app/locations
  When hago click en "Delete"
  And confirmo en el modal
  Then veo mensaje "Location deleted successfully"
  And la ubicación ya no aparece en la lista
```

### US-117-004: Cannot Delete Used Location
```gherkin
Scenario: Cliente intenta eliminar ubicación con requests
  Given tengo una ubicación con 3 requests asociados
  And estoy en /app/locations
  When hago click en "Delete"
  Then veo error "Cannot delete location with associated requests"
  And la ubicación permanece en la lista
```

### US-117-005: List Work Locations
```gherkin
Scenario: Cliente ve todas sus ubicaciones
  Given tengo 5 ubicaciones creadas
  And estoy en /app/locations
  Then veo todas mis 5 ubicaciones
  And cada una muestra: street, city, state
  And veo botones de Edit y Delete
```

### US-117-006: Select Location in New Request
```gherkin
Scenario: Cliente selecciona ubicación existente
  Given tengo ubicaciones creadas
  And estoy en New Request - Step 1
  Then veo lista de mis ubicaciones
  When selecciono "123 Main St, NY"
  And hago click en "Next"
  Then avanzo a Step 2 con locationId seleccionado
```

---

## ✅ Acceptance Criteria

### Database ❌
- [ ] WorkLocation model creado en schema.prisma
- [ ] Campos: id, userId, street, building, tower, floor, unit, city, zip, state, createdAt
- [ ] Relación User → WorkLocation (1:N)
- [ ] Índices: userId, createdAt
- [ ] Migration ejecutada exitosamente

### Backend ❌
- [ ] `POST /locations` - Create location
- [ ] `GET /locations` - List user's locations
- [ ] `GET /locations/:id` - Get single location
- [ ] `PUT /locations/:id` - Update location
- [ ] `DELETE /locations/:id` - Delete location
- [ ] Validación: street, city, zip, state requeridos
- [ ] Solo el propietario puede editar/eliminar
- [ ] No permitir delete si hay requests asociados
- [ ] Tests unitarios: 95%+ coverage
- [ ] Tests E2E de API

### Frontend ❌
- [ ] LocationFormOrganism (create/edit mode)
- [ ] LocationListOrganism (list con edit/delete)
- [ ] LocationCardMolecule (display individual)
- [ ] Manage Locations page `/app/locations`
- [ ] Validación en tiempo real (Zod)
- [ ] Confirmación en delete
- [ ] Feedback visual al guardar/eliminar
- [ ] Tests unitarios de componentes
- [ ] Tests E2E de flujos completos

### Shared ❌
- [ ] WorkLocation type definido
- [ ] CreateLocationDto schema (Zod)
- [ ] UpdateLocationDto schema (Zod)
- [ ] Types exportados en @shared

### Quality Gates ❌
- [ ] All tests passing
- [ ] Zero ESLint errors
- [ ] Zero TypeScript errors
- [ ] Mutation score ≥ 85%

---

## 🏗️ Architecture

### Database Schema

```prisma
// packages/api/prisma/schema.prisma

model WorkLocation {
  id        String    @id @default(auto()) @map("_id") @db.ObjectId
  user      User      @relation("UserLocations", fields: [userId], references: [id])
  userId    String    @db.ObjectId
  
  // Required fields
  street    String
  city      String
  zip       String
  state     String
  
  // Optional fields for complex addresses
  building  String?
  tower     String?
  floor     String?
  unit      String?
  
  // Future: relation to Requests (ALI-119)
  // requests  Request[] @relation("LocationRequests")
  
  createdAt DateTime  @default(now())
  
  @@index([userId])
  @@index([createdAt])
  @@map("work_locations")
}

// Update User model
model User {
  // ... existing fields
  locations WorkLocation[] @relation("UserLocations")
}
```

### API Endpoints

#### POST /locations
```typescript
Request:
Authorization: Bearer {token}
Body: {
  street: string       // required, min 3 chars
  building?: string    // optional
  tower?: string       // optional
  floor?: string       // optional
  unit?: string        // optional
  city: string         // required, min 2 chars
  zip: string          // required, 5-10 chars
  state: string        // required, 2 chars (US states)
}

Response 201:
{
  location: {
    id: string
    userId: string
    street: string
    building?: string
    tower?: string
    floor?: string
    unit?: string
    city: string
    zip: string
    state: string
    createdAt: DateTime
  }
  message: "Location created successfully"
}

Errors:
- 400: Validation error
- 401: Unauthorized
- 409: Duplicate location (same address exists)
```

#### GET /locations
```typescript
Request:
Authorization: Bearer {token}
Query: {
  page?: number         // default: 1
  limit?: number        // default: 20, max: 100
  sortBy?: 'createdAt' | 'city' | 'street'
  order?: 'asc' | 'desc'
}

Response 200:
{
  locations: WorkLocation[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

Errors:
- 401: Unauthorized
```

#### GET /locations/:id
```typescript
Request:
Authorization: Bearer {token}

Response 200:
{
  location: WorkLocation
}

Errors:
- 401: Unauthorized
- 403: Forbidden (not owner)
- 404: Location not found
```

#### PUT /locations/:id
```typescript
Request:
Authorization: Bearer {token}
Body: {
  street?: string
  building?: string
  tower?: string
  floor?: string
  unit?: string
  city?: string
  zip?: string
  state?: string
}

Response 200:
{
  location: WorkLocation
  message: "Location updated successfully"
}

Errors:
- 400: Validation error
- 401: Unauthorized
- 403: Forbidden (not owner)
- 404: Location not found
```

#### DELETE /locations/:id
```typescript
Request:
Authorization: Bearer {token}

Response 200:
{
  message: "Location deleted successfully"
}

Errors:
- 400: "Cannot delete location with associated requests"
- 401: Unauthorized
- 403: Forbidden (not owner)
- 404: Location not found
```

### Frontend Components

**Atomic Design Structure**:
```
packages/web/src/components/
├── organisms/
│   └── locations/
│       ├── LocationFormOrganism.tsx
│       ├── LocationFormOrganism.types.ts
│       ├── LocationFormOrganism.test.tsx
│       ├── LocationListOrganism.tsx
│       ├── LocationListOrganism.types.ts
│       ├── LocationListOrganism.test.tsx
│       └── index.ts
├── molecules/
│   └── locations/
│       ├── LocationCardMolecule.tsx
│       ├── LocationCardMolecule.types.ts
│       ├── LocationCardMolecule.test.tsx
│       └── index.ts
└── atoms/
    └── locations/
        └── (shared atoms if needed)
```

**Pages**:
```
packages/web/src/app/[lang]/(private)/
└── locations/
    ├── page.tsx           (list + create)
    └── [id]/
        └── edit/
            └── page.tsx   (edit form)
```

**Shared Types**:
```typescript
// packages/shared/src/types/location.types.ts

export interface WorkLocation {
  id: string;
  userId: string;
  street: string;
  building?: string | null;
  tower?: string | null;
  floor?: string | null;
  unit?: string | null;
  city: string;
  zip: string;
  state: string;
  createdAt: Date;
}

export interface CreateLocationDto {
  street: string;
  building?: string;
  tower?: string;
  floor?: string;
  unit?: string;
  city: string;
  zip: string;
  state: string;
}

export interface UpdateLocationDto extends Partial<CreateLocationDto> {}

export interface LocationsResponse {
  locations: WorkLocation[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
```

**Zod Schemas**:
```typescript
// packages/shared/src/schemas/location.schemas.ts

import { z } from 'zod';

export const CreateLocationSchema = z.object({
  street: z.string().min(3, 'Street must be at least 3 characters'),
  building: z.string().optional(),
  tower: z.string().optional(),
  floor: z.string().optional(),
  unit: z.string().optional(),
  city: z.string().min(2, 'City must be at least 2 characters'),
  zip: z.string().min(5, 'ZIP code must be at least 5 characters').max(10),
  state: z.string().length(2, 'State must be 2 characters (e.g., NY, CA)'),
});

export const UpdateLocationSchema = CreateLocationSchema.partial();

export type CreateLocationFormData = z.infer<typeof CreateLocationSchema>;
export type UpdateLocationFormData = z.infer<typeof UpdateLocationSchema>;
```

---

## 🧪 Testing Strategy

### Backend Tests (Jest)

**Unit Tests** (95%+ coverage):
```typescript
// locations.service.spec.ts
describe('LocationsService', () => {
  describe('create', () => {
    it('should create location successfully');
    it('should throw error if duplicate address');
    it('should validate required fields');
  });
  
  describe('findAllByUserId', () => {
    it('should return user locations only');
    it('should support pagination');
    it('should support sorting');
  });
  
  describe('update', () => {
    it('should update location successfully');
    it('should throw error if not owner');
    it('should validate updated fields');
  });
  
  describe('delete', () => {
    it('should delete location successfully');
    it('should throw error if has requests');
    it('should throw error if not owner');
  });
});
```

**E2E Tests** (Supertest):
```typescript
// locations.e2e.spec.ts
describe('Locations API (e2e)', () => {
  it('POST /locations - creates location');
  it('GET /locations - lists user locations');
  it('GET /locations/:id - gets single location');
  it('PUT /locations/:id - updates location');
  it('DELETE /locations/:id - deletes location');
  it('DELETE /locations/:id - fails if has requests');
  it('PUT /locations/:id - fails if not owner');
});
```

### Frontend Tests

**Unit Tests** (Vitest + Testing Library):
```typescript
// LocationFormOrganism.test.tsx
describe('LocationFormOrganism', () => {
  it('renders all fields correctly');
  it('validates required fields on submit');
  it('displays success message on save');
  it('handles API errors gracefully');
  it('pre-fills form in edit mode');
});

// LocationListOrganism.test.tsx
describe('LocationListOrganism', () => {
  it('displays all user locations');
  it('shows empty state when no locations');
  it('opens edit modal on edit click');
  it('confirms before delete');
  it('handles delete success');
  it('handles delete error (has requests)');
});
```

**E2E Tests** (Playwright):
```typescript
// ali-117-locations.spec.ts
test.describe('ALI-117: Work Locations', () => {
  test('1. Create new location successfully', async ({ page }) => {
    // Login as CLIENT
    // Navigate to /app/locations
    // Click "Add Location"
    // Fill form
    // Submit
    // Verify success message
    // Verify location appears in list
  });

  test('2. Edit existing location', async ({ page }) => {
    // Create location via API
    // Navigate to /app/locations
    // Click Edit
    // Change fields
    // Submit
    // Verify changes
  });

  test('3. Delete location without requests', async ({ page }) => {
    // Create location via API
    // Navigate to /app/locations
    // Click Delete
    // Confirm
    // Verify deletion
  });

  test('4. Cannot delete location with requests', async ({ page }) => {
    // Create location + request via API
    // Navigate to /app/locations
    // Click Delete
    // Verify error message
  });

  test('5. Form validation works correctly', async ({ page }) => {
    // Navigate to /app/locations
    // Click "Add Location"
    // Submit empty form
    // Verify validation errors
  });

  test('6. Complete flow: create → edit → delete', async ({ page }) => {
    // Full CRUD flow
  });
});
```

---

## 📦 Dependencies

**Backend**:
- ✅ `@nestjs/common`, `@nestjs/jwt` (ya instalados)
- ✅ `class-validator`, `class-transformer` (ya instalados)
- ✅ `prisma`, `@prisma/client` (ya instalados)

**Frontend**:
- ✅ `react-hook-form`, `@hookform/resolvers` (ya instalados)
- ✅ `zod` (ya instalado)
- ✅ `@radix-ui/*`, `@nextui-org/*` (ya instalados)

**No se requieren nuevas dependencias** ✅

---

## 🎓 Key Considerations

### Business Rules
1. **Ownership**: Usuario solo puede ver/editar/eliminar sus propias ubicaciones
2. **Deletion**: No permitir delete si hay requests asociados (soft delete o error)
3. **Validation**: City, Zip, State requeridos (para US addresses)
4. **Duplicates**: Opcional - prevenir direcciones duplicadas exactas
5. **Default**: Primera ubicación puede ser default (para UI futuro)

### UX Considerations
1. **Empty State**: Mensaje amigable cuando no hay ubicaciones
2. **Confirmation**: Modal de confirmación en delete
3. **Success Feedback**: Toast o mensaje al guardar/eliminar
4. **Error Handling**: Mensajes claros y específicos
5. **Mobile**: Formulario responsive (stack en mobile)

### Performance
1. **Pagination**: Limitar resultados (20 por defecto, max 100)
2. **Indexing**: Índice en userId para queries rápidas
3. **Caching**: Opcional - cache de ubicaciones en frontend (React Query)

---

## 📚 Implementation Plan

### Phase 1: Database (0.5h)
1. Agregar WorkLocation model al schema.prisma
2. Actualizar User model con relación
3. Crear y ejecutar migration
4. Verificar schema en Prisma Studio

### Phase 2: Backend (1.5h)
1. Create LocationsModule, Service, Controller
2. Implementar CRUD operations
3. Create DTOs con class-validator
4. Tests unitarios (95%+)
5. Tests E2E de API

### Phase 3: Shared (0.5h)
1. Types en @shared/types
2. Zod schemas en @shared/schemas
3. Export en index.ts

### Phase 4: Frontend Components (1.5h)
1. LocationFormOrganism (create/edit)
2. LocationListOrganism (list view)
3. LocationCardMolecule (item display)
4. Tests unitarios de componentes

### Phase 5: Frontend Pages (0.5h)
1. Locations page (list + create)
2. Edit page
3. API integration con Next.js API routes

### Phase 6: E2E Tests (0.5h)
1. Complete CRUD flow tests
2. Validation tests
3. Error handling tests

### Phase 7: Documentation (0.5h)
1. Create `ALI-117-work-locations-feedback.md`
2. API documentation
3. Component documentation

**Total estimado**: 4-5 horas

---

## 🚀 Related Issues

**Requiere**:
- ALI-115: Authentication (user model) ✅

**Desbloquea**:
- ALI-119: Service Requests (locationId field)
- ALI-36: New Request - Step 1: Choose Location
- ALI-41, ALI-43, ALI-44: Request Details (mostrar ubicación)
- ALI-55: Calendar (mostrar ubicación en eventos)

**Bloquea**:
- ALI-119 depende CRÍTICAMENTE de este ticket

---

## ✅ Definition of Done

- [ ] WorkLocation model en database
- [ ] CRUD endpoints funcionales
- [ ] LocationFormOrganism completo
- [ ] LocationListOrganism completo
- [ ] Manage Locations page
- [ ] Tests: 95%+ backend, 100% frontend nuevos
- [ ] E2E tests: 100% pasando
- [ ] Zero linting errors
- [ ] Zero TypeScript errors
- [ ] Migration ejecutada
- [ ] Documentation completa
- [ ] Code review aprobado

---

**Última Actualización**: 2025-11-24  
**Autor**: AI Agent (Claude)  
**Status**: Ready for Implementation  
**Prioridad**: ALTA (bloquea ALI-119)


