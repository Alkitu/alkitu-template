# ALI-116: User Profile & Onboarding - Technical Spec

**Sprint**: Sprint-1 | **Epic**: ALI-18 (Database) | **Priority**: MEDIUM  
**Status**: 🔄 **IN PLANNING**

---

## 📋 Quick Summary

Completar la experiencia de perfil de usuario para todos los roles (CLIENT, EMPLOYEE, ADMIN).
- ✅ Backend completo (heredado de ALI-115)
- ✅ Onboarding flow (heredado de ALI-115)
- ❌ Profile pages por role (pendiente)
- ❌ Update profile endpoint (pendiente)

**Objetivo**: Permitir a los usuarios actualizar su información personal después del onboarding.

---

## 🎯 Objetivos Principales

### 1. Profile Management por Role
**CLIENT**:
- Editar: firstname, lastname, phone, email, company
- Editar: **Main Address** (address)
- Editar: **Contact Person** (name, lastname, phone, email)
- Ver: profileComplete, role, createdAt

**EMPLOYEE**:
- Editar: firstname, lastname, phone, email, company
- Ver: role, profileComplete, createdAt
- NO acceso a: address, contactPerson

**ADMIN**:
- Editar: firstname, lastname, phone, email, company
- Ver: role, profileComplete, createdAt
- NO acceso a: address, contactPerson

### 2. Update Profile Endpoint
- `PUT /users/profile` - Actualizar perfil del usuario actual
- Validación: campos requeridos según role
- Actualización de `updatedAt` automática
- Mantener `profileComplete = true` si aplica

### 3. Profile Completeness Logic
**Regla de negocio para `profileComplete = true`**:

**CLIENT**:
- ✅ firstname + lastname + phone + email
- ✅ company
- ✅ address (Main Address)
- ⚠️ contactPerson (opcional pero recomendado)

**EMPLOYEE/ADMIN**:
- ✅ firstname + lastname + phone + email
- ✅ company

---

## 📊 Implementation Status

### ✅ Ya Completado (de ALI-115)

**Database Schema**:
- ✅ User model con todos los campos
- ✅ ContactPerson embedded type
- ✅ profileComplete field

**Backend**:
- ✅ `/auth/complete-profile` endpoint (onboarding)
- ✅ JWT con profileComplete
- ✅ Middleware verifica profileComplete

**Frontend**:
- ✅ Onboarding page `/app/onboarding`
- ✅ OnboardingFormOrganism

### ❌ Pendiente (ALI-116)

**Backend**:
- ❌ `PUT /users/profile` endpoint
- ❌ `GET /users/profile` endpoint (opcional, puede usar JWT payload)
- ❌ Validación por role
- ❌ Tests unitarios

**Frontend**:
- ❌ Profile page [Client] `/app/profile`
  - ProfileFormClient organism
  - Main Address section
  - Contact Person section
- ❌ Profile page [Employee] `/app/profile`
  - ProfileFormEmployee organism (más simple)
- ❌ Profile page [Admin] `/app/profile`
  - ProfileFormAdmin organism (igual que Employee)
- ❌ Tests E2E

---

## 📝 User Stories

### US-116-001: Client Updates Profile
```gherkin
Scenario: Cliente actualiza información completa
  Given estoy logueado como CLIENT
  And estoy en /app/profile
  When actualizo firstname, lastname, phone
  And actualizo company
  And actualizo Main Address
  And actualizo Contact Person
  And hago click en "Save"
  Then veo mensaje "Profile updated successfully"
  And profileComplete permanece true
  And updatedAt se actualiza
```

### US-116-002: Employee Updates Profile
```gherkin
Scenario: Empleado actualiza información básica
  Given estoy logueado como EMPLOYEE
  And estoy en /app/profile
  When actualizo firstname, lastname, phone
  And actualizo company
  And hago click en "Save"
  Then veo mensaje "Profile updated successfully"
  And NO veo campos de address o contactPerson
```

### US-116-003: Admin Updates Profile
```gherkin
Scenario: Admin actualiza información básica
  Given estoy logueado como ADMIN
  And estoy en /app/profile
  When actualizo firstname, lastname, phone
  And actualizo company
  And hago click en "Save"
  Then veo mensaje "Profile updated successfully"
  And NO veo campos de address o contactPerson
```

### US-116-004: Validation Errors
```gherkin
Scenario: Validación de campos requeridos
  Given estoy en /app/profile
  When borro firstname
  And hago click en "Save"
  Then veo error "First name is required"
  And el perfil NO se actualiza
```

---

## ✅ Acceptance Criteria

### Database ✅
- [x] Todos los campos necesarios existen (heredados de ALI-115)
- [x] ContactPerson type definido
- [x] profileComplete logic implementada

### Backend ❌
- [ ] `PUT /users/profile` endpoint funcional
- [ ] Validación por role (CLIENT vs EMPLOYEE/ADMIN)
- [ ] Solo permite actualizar campos permitidos
- [ ] Email NO es editable (o requiere verificación)
- [ ] Password NO se actualiza por este endpoint
- [ ] Tests unitarios: 95%+ coverage
- [ ] Tests e2e de API

### Frontend ❌
- [ ] Profile page CLIENT con todos los campos
- [ ] Profile page EMPLOYEE/ADMIN (simplificado)
- [ ] Formularios con validación en tiempo real (Zod)
- [ ] Feedback visual al guardar
- [ ] Manejo de errores de API
- [ ] Tests unitarios de componentes
- [ ] Tests E2E de flujos completos

### Quality Gates ❌
- [ ] All tests passing
- [ ] Zero ESLint errors
- [ ] Zero TypeScript errors
- [ ] Mutation score ≥ 85%

---

## 🏗️ Architecture Changes

### API Endpoints

**Nuevo endpoint**:
```typescript
PUT /users/profile
Authorization: Bearer {token}

Request Body (CLIENT):
{
  firstname: string
  lastname: string
  phone: string
  company: string
  address?: string
  contactPerson?: {
    name: string
    lastname: string
    phone: string
    email: string
  }
}

Request Body (EMPLOYEE/ADMIN):
{
  firstname: string
  lastname: string
  phone: string
  company: string
}

Response:
{
  user: {
    id: string
    email: string
    firstname: string
    lastname: string
    phone: string
    company: string
    address?: string
    contactPerson?: ContactPerson
    role: Role
    profileComplete: boolean
    updatedAt: DateTime
  }
  message: "Profile updated successfully"
}
```

### Frontend Components

**Atomic Design Structure**:
```
packages/web/src/components/
├── organisms/
│   └── profile/
│       ├── ProfileFormClientOrganism.tsx
│       ├── ProfileFormClientOrganism.types.ts
│       ├── ProfileFormClientOrganism.test.tsx
│       ├── ProfileFormEmployeeOrganism.tsx
│       ├── ProfileFormEmployeeOrganism.types.ts
│       ├── ProfileFormEmployeeOrganism.test.tsx
│       └── index.ts
└── molecules/
    └── profile/
        ├── MainAddressSection.tsx
        ├── MainAddressSection.types.ts
        ├── ContactPersonSection.tsx
        ├── ContactPersonSection.types.ts
        └── index.ts
```

**Pages**:
```
packages/web/src/app/[lang]/(private)/
└── profile/
    └── page.tsx  (renderiza según role)
```

---

## 🧪 Testing Strategy

### Backend Tests (Jest)
**Unit Tests** (95%+ coverage):
- `users.service.spec.ts`
  - updateProfile() - SUCCESS casos
  - updateProfile() - VALIDATION errors
  - updateProfile() - ROLE-based filtering
  - updatedAt auto-update
  - profileComplete logic preservation
- `users.controller.spec.ts`
  - PUT /users/profile endpoint
  - Authorization required
  - Role-based response

**E2E Tests** (Supertest):
- Update profile CLIENT (full fields)
- Update profile EMPLOYEE (basic fields)
- Update profile ADMIN (basic fields)
- Validation errors
- Unauthorized access (401)

### Frontend Tests

**Unit Tests** (Vitest + Testing Library):
- `ProfileFormClientOrganism.test.tsx`
  - Renders all fields correctly
  - Validation on submit
  - Success message display
  - Error handling
- `ProfileFormEmployeeOrganism.test.tsx`
  - Renders basic fields only
  - No address/contactPerson fields

**E2E Tests** (Playwright):
```typescript
test.describe('ALI-116: Profile Management', () => {
  test('1. CLIENT can update full profile', async ({ page }) => {
    // Login as CLIENT
    // Navigate to /app/profile
    // Fill all fields
    // Submit
    // Verify success
  });

  test('2. EMPLOYEE cannot see address fields', async ({ page }) => {
    // Login as EMPLOYEE
    // Navigate to /app/profile
    // Verify NO address/contactPerson fields
  });

  test('3. Validation errors shown correctly', async ({ page }) => {
    // Clear required fields
    // Submit
    // Verify error messages
  });

  test('4. Profile update persists after page reload', async ({ page }) => {
    // Update profile
    // Reload page
    // Verify changes persisted
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

## 🎓 Key Learnings from ALI-115

1. **Type Safety**: Shared types entre backend/frontend evitan desincronización
2. **Role-Based UI**: Renderizar campos según role del usuario
3. **Validation**: Zod schemas compartidos entre backend y frontend
4. **Testing**: E2E tests críticos para flujos de usuario
5. **Error Handling**: Feedback claro y específico al usuario

---

## 📚 Implementation Plan

### Phase 1: Backend (1-1.5h)
1. Create `UpdateProfileDto` con validación por role
2. Implementar `PUT /users/profile` endpoint
3. Tests unitarios (95%+)
4. Tests E2E de API

### Phase 2: Frontend CLIENT (1h)
1. `ProfileFormClientOrganism` con todos los campos
2. `MainAddressSection` molecule
3. `ContactPersonSection` molecule
4. Profile page CLIENT
5. Tests unitarios

### Phase 3: Frontend EMPLOYEE/ADMIN (0.5h)
1. `ProfileFormEmployeeOrganism` (simplificado)
2. Profile page EMPLOYEE/ADMIN (mismo componente)
3. Tests unitarios

### Phase 4: E2E Tests (0.5h)
1. Tests para cada role
2. Validation tests
3. Persistence tests

### Phase 5: Documentation (0.5h)
1. Update `ALI-116-profile-onboarding-feedback.md`
2. API documentation
3. Component documentation

**Total estimado**: 2-3 horas

---

## 🚀 Related Issues

**Desbloqueados por ALI-115**:
- ALI-45: Profile – "My Account Settings" [Client]
- ALI-46: Profile – "My Account Settings" [Employee]
- ALI-47: Profile – "My Account Settings" [Admin]

**Desbloquea**:
- Ninguno (standalone feature)

---

## ✅ Definition of Done

- [ ] Backend endpoint `PUT /users/profile` implementado
- [ ] Profile pages para CLIENT, EMPLOYEE, ADMIN
- [ ] Validación por role funcional
- [ ] Tests: 95%+ backend, 100% frontend nuevos
- [ ] E2E tests: 100% pasando
- [ ] Zero linting errors
- [ ] Zero TypeScript errors
- [ ] Documentation completa
- [ ] Code review aprobado

---

**Última Actualización**: 2025-11-24  
**Autor**: AI Agent (Claude)  
**Status**: Ready for Implementation


