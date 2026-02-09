# Design System vs Domain Architecture

## Overview

This document clarifies the architectural separation between **generic design system components** (Alianza) and **domain-specific business logic components** (Standard).

---

## Architecture Principles

### Design System Components (`*-alianza/`)

**Purpose**: Generic, reusable UI components that can be used across ANY application.

**Characteristics**:
- ✅ **Generic**: No business logic, pure UI/UX
- ✅ **Reusable**: Can be dropped into any project
- ✅ **Well-tested**: 90%+ test coverage required
- ✅ **Documented**: Storybook stories + TypeScript docs
- ✅ **Accessible**: ARIA attributes, keyboard navigation
- ✅ **Themeable**: Uses CSS variables, supports multiple themes

**Location**: `components/*-alianza/`
- `atoms-alianza/` - Basic UI primitives (Button, Input, Icon, etc.)
- `molecules-alianza/` - Composite UI components (Card, FormInput, AdminPageHeader, etc.)
- `organisms-alianza/` - Complex UI sections (Header, tables, lists, etc.)

**Examples**:
- `Button`, `Input`, `Select` - Form controls
- `Card`, `Badge`, `Chip` - Display components
- `AdminPageHeader`, `StatCard`, `QuickActionCard` - Layouts
- `FormInput`, `FormSelect` - Form compositions

---

### Domain Components (`atoms/`, `molecules/`, `organisms/`)

**Purpose**: Business-specific logic components tightly coupled to application domain.

**Characteristics**:
- ⚠️ **Domain-specific**: Contains business rules and workflows
- ⚠️ **API-coupled**: Integrates with tRPC, uses shared types
- ⚠️ **Use-case specific**: Designed for specific features
- ⚠️ **Not reusable**: Cannot be easily extracted to other projects

**Location**: `components/molecules/` (currently)
- `location/` - Work location CRUD components
- `placeholder-palette/` - Email template placeholders
- `request/` - Request management workflow components

**Examples**:
- `LocationCardMolecule` - CRUD card for user work locations (uses `WorkLocation` from `@alkitu/shared`)
- `PlaceholderPaletteMolecule` - Email template variable picker (business-specific)
- `RequestCardMolecule`, `AssignRequestModal`, `CompleteRequestModal` - Request workflow

---

## Decision Tree: Where Does My Component Go?

```
Is this component specific to your business domain?
├─ YES → Does it contain business logic or use tRPC APIs?
│  ├─ YES → molecules/ (Domain-specific)
│  └─ NO  → molecules-alianza/ (Generic design system)
└─ NO  → Can it be used in any application?
   ├─ YES → molecules-alianza/ (Generic design system)
   └─ NO  → molecules/ (Domain-specific)
```

### Quick Examples

| Component | Location | Reason |
|-----------|----------|--------|
| `Button` with variants | `molecules-alianza/` | Generic UI, no business logic |
| `AdminPageHeader` | `molecules-alianza/` | Generic layout, reusable |
| `StatCard` with trends | `molecules-alianza/` | Generic stats display |
| `RequestCardMolecule` | `molecules/` | Request-specific, uses `Request` type |
| `AssignRequestModal` | `molecules/` | Business workflow (assign employee to request) |
| `PlaceholderPaletteMolecule` | `molecules/` | Email template-specific feature |
| `LocationCardMolecule` | `molecules/` | CRUD for `WorkLocation` domain object |

---

## Current Architecture (Post-Migration)

### Design System (Alianza)

```
components/
├── atoms-alianza/          (38 components) ✅
│   ├── Alert/
│   ├── Avatar/
│   ├── Badge/
│   ├── Button/             (generic button with variants)
│   ├── Icon/
│   ├── Input/
│   ├── Typography/
│   └── ... (31 more)
│
├── molecules-alianza/      (37 components) ✅
│   ├── AdminPageHeader/    (generic page header)
│   ├── Card/               (generic card)
│   ├── CategoryCard/       (generic category display)
│   ├── DatePicker/
│   ├── DropdownMenu/
│   ├── DynamicForm/        (generic dynamic form renderer)
│   ├── FormInput/          (generic form input wrapper)
│   ├── QuickActionCard/    (generic action card)
│   ├── ServiceCard/        (generic service display)
│   ├── StatCard/           (generic stats display)
│   └── ... (27 more)
│
└── organisms-alianza/      (10 components) ✅
    ├── HeaderAlianza/
    ├── RequestsTableAlianza/
    ├── ServicesTableAlianza/
    ├── UsersTableAlianza/
    └── ... (6 more)
```

### Domain Components

```
components/
├── molecules/              (3 components) 🔒
│   ├── location/           ⚠️ Domain-specific CRUD
│   │   └── LocationCardMolecule.tsx
│   │       - Uses: WorkLocation from @alkitu/shared
│   │       - Purpose: Manage user work locations
│   │
│   ├── placeholder-palette/ ⚠️ Domain-specific feature
│   │   └── PlaceholderPaletteMolecule.tsx
│   │       - Uses: Email template placeholders
│   │       - Purpose: Insert variables like {{user.name}}
│   │
│   └── request/            ⚠️ Domain-specific workflows (9 components)
│       ├── RequestCardMolecule.tsx
│       ├── RequestClientCardMolecule.tsx
│       ├── RequestStatusBadgeMolecule.tsx
│       ├── RequestTimelineMolecule.tsx
│       ├── AssignRequestModal.tsx
│       ├── CancelRequestModal.tsx
│       ├── CompleteRequestModal.tsx
│       ├── QuickAssignModal.tsx
│       └── QuickStatusModal.tsx
│           - Uses: Request, RequestStatus from @alkitu/shared
│           - Purpose: Request management workflows
│           - Integrates: tRPC APIs for request operations
│
└── organisms/              (20+ components) 🔒
    ├── request/            ⚠️ Domain-specific organisms
    │   ├── RequestFormOrganism/
    │   ├── RequestListOrganism/
    │   └── RequestDetailOrganism/
    │
    ├── service/            ⚠️ Domain-specific organisms
    │   ├── ServiceFormOrganism/
    │   └── ServiceListOrganism/
    │
    └── ... (more domain organisms)
```

---

## Migration Results

### Components Consolidated to Alianza (22 total)

All these were **generic design system** components that were correctly moved to `-alianza`:

**Atoms** (migrated):
- Alert, Avatar, Badge, Brand, Chip, CustomIcon, Icon, Input
- PasswordStrengthIndicator, PriorityIcon, ProgressBar, RadioButton
- Separator, Slider, Spacer, Spinner, StatusBadge, Tabs, ThemeToggle
- Tooltip, Toggle, Typography

**Molecules** (migrated):
- Accordion, AdminPageHeader, Breadcrumb, Card, CategoryCard
- Checkbox (composite), Combobox, CompactErrorBoundary, DatePicker
- DropdownMenu, DynamicForm, FormInput, FormSelect, ModeToggle
- NavigationMenu, Pagination, PlaceholderPalette (color selector - different from email placeholders!)
- PreviewImage, QuickActionCard, ServiceCard, StatCard, TabsAlianza
- ThemePreview, ToggleGroup

### Components Kept as Domain (12 total)

These are **correctly kept** as domain-specific:

**Molecules** (3 domain components):
- `location/LocationCardMolecule` - Work location CRUD
- `placeholder-palette/PlaceholderPaletteMolecule` - Email template variables
- `request/*` - 9 request management components

**Organisms** (9+ domain components):
- Request organisms (RequestFormOrganism, RequestListOrganism, etc.)
- Service organisms (ServiceFormOrganism, ServiceListOrganism, etc.)
- Other business-specific organisms

---

## Guidelines for New Components

### When creating a new component, ask:

1. **Does it contain business logic?**
   - YES → Domain component (`molecules/` or `organisms/`)
   - NO → Continue to #2

2. **Does it use tRPC APIs or @alkitu/shared types?**
   - YES → Domain component
   - NO → Continue to #3

3. **Can it be used in a different application?**
   - YES → Design system component (`*-alianza/`)
   - NO → Domain component

4. **Is it specific to a feature (requests, locations, etc.)?**
   - YES → Domain component
   - NO → Design system component (`*-alianza/`)

### Examples

**New feature: Add "Favorite Requests"**
- `FavoriteButton` (generic toggle button) → `atoms-alianza/`
- `RequestFavoriteCard` (request-specific display) → `molecules/request/`

**New feature: Export Reports**
- `ExportButton` (generic button with download icon) → `molecules-alianza/`
- `ReportExporter` (report-specific logic) → `organisms/reports/`

**New UI pattern: Empty State**
- `EmptyState` (generic empty state with icon/message) → `molecules-alianza/`
- `NoRequestsState` (request-specific empty state) → `organisms/request/`

---

## Benefits of This Architecture

### For Design System (`*-alianza/`)
✅ **Reusability**: Components can be extracted to other projects
✅ **Quality**: High test coverage, Storybook documentation
✅ **Consistency**: Unified design language across app
✅ **Maintainability**: Changes benefit entire application

### For Domain Components (`molecules/`, `organisms/`)
✅ **Flexibility**: Can evolve with business requirements
✅ **Clarity**: Business logic is explicit and centralized
✅ **Coupling**: Tightly coupled to domain is OK here
✅ **Speed**: Faster iteration on business features

---

## Related Documentation

- [Atomic Design Architecture](./00-conventions/atomic-design-architecture.md)
- [Component Structure](./00-conventions/component-structure-and-testing.md)
- [Migration Progress](./MIGRATION-PROGRESS.md)
- [Testing Strategy](./00-conventions/testing-strategy-and-frameworks.md)

---

**Last Updated**: February 2026 (Post Fase 2 Migration)
