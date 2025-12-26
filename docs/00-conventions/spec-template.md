# Specification Template

**Purpose**: Reusable template for creating comprehensive technical specifications
**Last Updated**: 2025-12-26

---

## File Naming Convention

```
/jira/sprint-X/specs/ALI-XXX/
├── ALI-XXX-spec.md                    # Main technical specification
├── ALI-XXX-frontend-spec.md           # Frontend implementation (optional)
├── ALI-XXX-backend-implementation.md  # Backend implementation (optional)
├── ALI-XXX-rbac-permissions.md        # RBAC specification (if applicable)
├── ALI-XXX-integration-guide.md       # Integration with other modules
└── ALI-XXX-testing-migration.md       # Testing & migration plan
```

**When to create multiple files**:
- **Main spec only**: Simple features (< 500 lines)
- **Main + 1-2 files**: Medium features (500-1,000 lines)
- **Main + 5-6 files**: Complex features like ALI-119, ALI-122 (> 1,000 lines)

---

## Main Specification Template (ALI-XXX-spec.md)

```markdown
# ALI-XXX: [Feature Name] - Technical Specification

**Status**: [Discovery | In Progress | Complete]
**Jira**: [ALI-XXX](https://alkitu.atlassian.net/browse/ALI-XXX)
**Version**: 1.0
**Last Updated**: YYYY-MM-DD

---

## Overview

[Brief description of the feature in 2-3 sentences]

### Key Features

✅ Feature 1 - Description
✅ Feature 2 - Description
✅ Feature 3 - Description

---

## Database Schema

### [Model Name] Model

```prisma
model [ModelName] {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  // ... fields
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([field1])
  @@map("table_name")
}
```

**Fields**:
- `id` - Unique identifier
- [field descriptions]

**Indexes**: [field1] for query performance

**Relations**:
- User (many-to-one)
- [Other relations]

---

## Backend API

### Service Methods

**File**: `packages/api/src/[module]/[module].service.ts`

**Core Operations**:
```typescript
async create(dto: CreateDto): Promise<Model>
async findAll(filters?: FilterDto): Promise<Model[]>
async findOne(id: string): Promise<Model>
async update(id: string, dto: UpdateDto): Promise<Model>
async delete(id: string): Promise<void>
```

**Advanced Methods**:
```typescript
async [customMethod](params): Promise<Result>
```

### tRPC Router

**File**: `packages/api/src/trpc/routers/[module].router.ts`

**Endpoints**:
```typescript
[module]Router = {
  create: procedure.input(createSchema).mutation(),
  getAll: procedure.input(filterSchema).query(),
  getOne: procedure.input(idSchema).query(),
  update: procedure.input(updateSchema).mutation(),
  delete: procedure.input(idSchema).mutation(),
  // Custom endpoints
};
```

---

## Frontend Architecture

### Pages

**[Page Name]** (`/[role]/[route]`):
- Purpose: [What this page does]
- Components: [List of components used]
- Features: [Key features]

### Component Structure

**Atoms**:
- `<AtomName />` - Description

**Molecules**:
- `<MoleculeName />` - Description

**Organisms**:
- `<OrganismName />` - Description

### State Management

**tRPC Integration**:
```typescript
const { data, isLoading } = trpc.[module].getAll.useQuery();
const mutation = trpc.[module].create.useMutation();
```

---

## Business Logic

### [Feature Flow]

1. Step 1 description
2. Step 2 description
3. Step 3 description

**Validation Rules**:
- Rule 1
- Rule 2

**Error Handling**:
- Error case 1 → Response
- Error case 2 → Response

---

## Testing

### Test Coverage Summary

| Category | Tests | Status |
|----------|-------|--------|
| Backend Unit Tests | XX | [Status] |
| Backend Integration Tests | XX | [Status] |
| Frontend Component Tests | XX | [Status] |
| E2E Tests | XX | [Status] |
| **TOTAL** | **XXX** | [Status] |

### Key Test Files

- `[module].service.spec.ts` - Service unit tests
- `[component].test.tsx` - Component tests
- `ali-xxx-[feature].spec.ts` - E2E tests

---

## Security Considerations

**Authorization**:
✅ [Permission check 1]
✅ [Permission check 2]

**Data Validation**:
✅ Zod schema validation on all DTOs
✅ [Other validations]

**Privacy**:
✅ [Privacy consideration]

---

## Integration Points

### ALI-XXX ([Related Module])
- [How this integrates]
- [Data flow]

---

## References

- [Related Spec Link](./ALI-XXX-related.md)

---

**Version**: 1.0
**Last Updated**: YYYY-MM-DD
```

---

## Frontend Specification Template (ALI-XXX-frontend-spec.md)

```markdown
# ALI-XXX: Frontend Implementation Specification

**Status**: [Status]
**Last Updated**: YYYY-MM-DD

---

## Pages

### [Page Name]

**File**: `packages/web/src/app/[lang]/(private)/[role]/[route]/page.tsx`

**Features**:
- Feature 1
- Feature 2

**Components Used**:
- `<Component1 />`
- `<Component2 />`

---

## Component Breakdown

### Atoms

**[AtomName]**:
- **File**: `packages/web/src/components/atoms/[AtomName].tsx`
- **Props**: [Prop list]
- **Purpose**: [Description]

### Molecules

**[MoleculeName]**:
- **File**: `packages/web/src/components/molecules/[MoleculeName].tsx`
- **Props**: [Prop list]
- **Purpose**: [Description]

### Organisms

**[OrganismName]**:
- **File**: `packages/web/src/components/organisms/[OrganismName].tsx`
- **Props**: [Prop list]
- **Features**: [List]

---

## State Management

**tRPC Queries**:
```typescript
const { data } = trpc.[module].getAll.useQuery();
```

**tRPC Mutations**:
```typescript
const mutation = trpc.[module].create.useMutation();
```

---

## Translations

**English** (`en/common.json`):
```json
{
  "[module]": {
    "title": "Title",
    "description": "Description"
  }
}
```

**Spanish** (`es/common.json`):
```json
{
  "[module]": {
    "title": "Título",
    "description": "Descripción"
  }
}
```

---

**Version**: 1.0
**Last Updated**: YYYY-MM-DD
```

---

## Backend Implementation Template (ALI-XXX-backend-implementation.md)

```markdown
# ALI-XXX: Backend Implementation Guide

**Status**: [Status]
**Last Updated**: YYYY-MM-DD

---

## Service Architecture

### [Module]Service

**File**: `packages/api/src/[module]/[module].service.ts`

**Methods**:
```typescript
@Injectable()
export class [Module]Service {
  async create(dto: CreateDto): Promise<Model> {
    // Implementation
  }

  async findAll(filters?: FilterDto): Promise<Model[]> {
    // Implementation
  }

  // ... other methods
}
```

---

## DTOs and Validation

### Create DTO

**File**: `packages/api/src/[module]/dto/create-[module].dto.ts`

```typescript
export const createSchema = z.object({
  field1: z.string().min(3),
  field2: z.number().positive(),
});

export type CreateDto = z.infer<typeof createSchema>;
```

---

## Integration

**File**: `packages/api/src/[other-module]/[other-module].service.ts`

```typescript
// Integration point
const result = await this.[module]Service.create(data);
```

---

**Version**: 1.0
**Last Updated**: YYYY-MM-DD
```

---

## Testing Specification Template (ALI-XXX-testing-migration.md)

```markdown
# ALI-XXX: Testing & Migration Plan

**Status**: [Status]
**Last Updated**: YYYY-MM-DD

---

## Test Coverage Requirements

### Backend Tests

**Target Coverage**: 95%+

**Unit Tests** (XX tests):
- Service methods: [List]

**Integration Tests** (XX tests):
- End-to-end flows: [List]

### Frontend Tests

**Target Coverage**: 90%+

**Component Tests** (XX tests):
- Atoms: [List]
- Molecules: [List]
- Organisms: [List]

**E2E Tests** (XX tests):
- User flows: [List]

---

## Migration Plan

### Phase 1: [Phase Name] (Day X)

**Tasks**:
- [ ] Task 1
- [ ] Task 2

**Estimated Time**: X hours

---

**Version**: 1.0
**Last Updated**: YYYY-MM-DD
```

---

## Best Practices

### Documentation Quality

✅ **Be Specific**: Include exact file paths, line numbers when referencing code
✅ **Be Complete**: Cover all aspects (database, backend, frontend, testing)
✅ **Be Concise**: Use tables, lists, code blocks for clarity
✅ **Be Visual**: Include diagrams for complex flows
✅ **Be Updated**: Keep specs in sync with implementation

### When to Split into Multiple Files

**Indicators you need multiple files**:
- Main spec exceeds 800 lines
- Complex frontend with 5+ organisms
- Complex backend with 3+ services
- Multiple integration points (3+)
- RBAC system with detailed permissions
- Testing plan requires detailed breakdowns

### Version Control

**Update Version When**:
- Major changes to schema or API
- Breaking changes to implementation
- Addition of new major features

**Update Last Updated When**:
- Any change to the document
- Clarifications or corrections

---

## Example References

**Excellent Specs to Reference**:
- ALI-119 (Requests) - Complete full-stack spec
- ALI-122 (Users & Roles) - 6-file comprehensive spec
- ALI-120 (Notifications) - Multi-channel architecture

---

**Document Version**: 1.0
**Last Updated**: 2025-12-26
