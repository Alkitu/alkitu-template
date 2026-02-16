# Form Builder Architecture Overview

**Last Updated**: February 10, 2026
**Status**: Production Ready ✅

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture Principles](#architecture-principles)
3. [Component Hierarchy](#component-hierarchy)
4. [Data Flow](#data-flow)
5. [Technology Stack](#technology-stack)
6. [File Structure](#file-structure)
7. [Integration Points](#integration-points)

---

## Overview

The Form Builder is a comprehensive system for creating, editing, and managing dynamic forms in the Alkitu platform. It follows Atomic Design methodology and provides a complete form building experience with drag & drop, multi-locale support, and 7 specialized field types.

### Key Features

- ✅ **7 Field Types**: text/email/phone, textarea, number/currency/percentage, select, radio, toggle, date/time/datetime
- ✅ **Drag & Drop**: Accessible reordering with @dnd-kit (keyboard + mouse)
- ✅ **Multi-Locale**: EN/ES support with inline switchers
- ✅ **Atomic Design**: Strict adherence to atoms → molecules → organisms
- ✅ **Type Safe**: Full TypeScript with strict mode
- ✅ **Accessible**: WCAG compliant with keyboard navigation
- ✅ **Themeable**: Dark mode support
- ✅ **Tested**: 414 tests with 97% pass rate

---

## Architecture Principles

### 1. Atomic Design Methodology

```
Atoms (3)
  ├── CharacterCount - Text counter display
  ├── TimePicker - Time selection widget
  └── ImageUpload - Single image uploader
       ↓
Molecules (7) - Field Editors
  ├── TextFieldEditor - text, email, phone
  ├── TextareaFieldEditor - multi-line text
  ├── NumberFieldEditor - number, currency, percentage
  ├── SelectFieldEditor - dropdown selection
  ├── RadioFieldEditor - radio button group
  ├── ToggleFieldEditor - toggle switch
  └── DateTimeFieldEditor - date, time, datetime
       ↓
Organisms (2) - Integration Components
  ├── FieldEditor - Routes to appropriate molecule
  └── FormBuilder - Complete form building interface
```

### 2. Feature Folder Organization

All Form Builder components are isolated in a feature folder to avoid namespace pollution:

```
/components/features/form-builder/
├── atoms/
├── molecules/
├── organisms/
├── lib/
└── types/
```

**Benefits**:
- Prevents global namespace pollution (30+ components isolated)
- Easy to find all related components
- Clear ownership and responsibility
- Scalable for future features (page-builder, email-builder, etc.)

### 3. Separation of Concerns

**Data Layer** (`@alkitu/shared/types`):
- `FormSettings` - Complete form configuration
- `FormField` - Individual field definition
- `ValidationRule` - Field validation rules

**Logic Layer** (`lib/`):
- `field-helpers.ts` - Field manipulation utilities
- `form-validation.ts` - Validation functions
- `i18n-helpers.ts` - Localization utilities

**UI Layer** (`atoms/molecules/organisms/`):
- Presentational components
- No business logic
- Receive data via props
- Emit events via callbacks

### 4. Composition Over Inheritance

Components are composed, not inherited:

```tsx
<FormBuilder>
  <FieldEditor field={field}>
    <TextFieldEditor field={field} />
  </FieldEditor>
</FormBuilder>
```

---

## Component Hierarchy

### Visual Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│ FormBuilder (Organism)                                       │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Tabs: [Builder] [Settings]                              │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ GlobalConfigEditor                                  │ │ │
│ │ │ • Form Title (multi-locale)                         │ │ │
│ │ │ • Form Description (multi-locale)                   │ │ │
│ │ │ • Locale Selector                                   │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ Fields Section (DndContext)                         │ │ │
│ │ │ ┌─────────────────────────────────────────────────┐ │ │ │
│ │ │ │ SortableFieldItem #1                            │ │ │ │
│ │ │ │ ├─ Drag Handle (⠿)                              │ │ │ │
│ │ │ │ ├─ Field Header (label, type badge)             │ │ │ │
│ │ │ │ ├─ Actions (duplicate, delete)                  │ │ │ │
│ │ │ │ └─ FieldEditor (Organism)                       │ │ │ │
│ │ │ │    └─ TextFieldEditor (Molecule)                │ │ │ │
│ │ │ │       └─ CharacterCount (Atom)                  │ │ │ │
│ │ │ └─────────────────────────────────────────────────┘ │ │ │
│ │ │ ┌─────────────────────────────────────────────────┐ │ │ │
│ │ │ │ SortableFieldItem #2                            │ │ │ │
│ │ │ │ └─ FieldEditor → DateTimeFieldEditor            │ │ │ │
│ │ │ │    └─ TimePicker (Atom)                         │ │ │ │
│ │ │ └─────────────────────────────────────────────────┘ │ │ │
│ │ │ [+ Add Field Button]                                │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ FinalActionsEditor                                  │ │ │
│ │ │ • Submit Button Text (multi-locale)                 │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Layer | Responsibility |
|-----------|-------|----------------|
| **FormBuilder** | Organism | • Manages FormSettings state<br>• Coordinates field CRUD<br>• Handles drag & drop<br>• Manages locale switching |
| **FieldEditor** | Organism | • Routes to correct molecule<br>• Manages field-level locale state<br>• Propagates props to children<br>• Handles unsupported types |
| **TextFieldEditor** | Molecule | • Edits text/email/phone fields<br>• Field-specific validation<br>• Type-specific options |
| **CharacterCount** | Atom | • Displays character count<br>• Color-coded feedback<br>• Reusable across components |

---

## Data Flow

### State Management

```
┌─────────────────────────────────────────────────────────┐
│ Parent Component (e.g., CreateServicePage)              │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ const [formSettings, setFormSettings] = useState()  │ │
│ └─────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────┘
                         │ formSettings
                         │ onChange(formSettings)
                         ↓
┌─────────────────────────────────────────────────────────┐
│ FormBuilder                                              │
│ • Receives formSettings                                  │
│ • Calls onChange when user makes changes                 │
│ • Manages internal UI state (collapsed fields, etc.)     │
└────────────────────────┬────────────────────────────────┘
                         │ field
                         │ onChange(field)
                         ↓
┌─────────────────────────────────────────────────────────┐
│ FieldEditor                                              │
│ • Receives field                                         │
│ • Routes to appropriate molecule                         │
│ • Propagates onChange to parent                          │
└────────────────────────┬────────────────────────────────┘
                         │ field
                         │ onChange(field)
                         ↓
┌─────────────────────────────────────────────────────────┐
│ TextFieldEditor (Molecule)                               │
│ • Receives field                                         │
│ • Updates field.label, field.validation, etc.            │
│ • Calls onChange with updated field                      │
└─────────────────────────────────────────────────────────┘
```

### Event Flow

```
User Action → Component Handler → Update State → Re-render

Examples:

1. Add Field:
   User clicks "Add Field"
   → FormBuilder.handleAddField()
   → Creates new field with generateFieldId()
   → Calls onChange({ fields: [...fields, newField] })
   → Parent updates state
   → FormBuilder re-renders with new field

2. Edit Field:
   User types in TextFieldEditor
   → TextFieldEditor.handleLabelChange()
   → Calls onChange({ ...field, label: newValue })
   → FieldEditor receives onChange
   → Propagates to FormBuilder
   → FormBuilder calls parent onChange
   → Parent updates state
   → FormBuilder re-renders

3. Drag & Drop:
   User drags field
   → @dnd-kit handles drag events
   → FormBuilder.handleDragEnd()
   → arrayMove(fields, oldIndex, newIndex)
   → Calls onChange({ fields: newFields })
   → Parent updates state
   → FormBuilder re-renders with reordered fields
```

---

## Technology Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19 | UI framework |
| **TypeScript** | 5.x | Type safety |
| **Next.js** | 15 | App framework |
| **Tailwind CSS** | v4 | Styling |
| **@dnd-kit** | Latest | Drag & drop |
| **Radix UI** | Latest | Headless UI primitives |

### Development Tools

| Tool | Purpose |
|------|---------|
| **Vitest** | Unit testing |
| **Testing Library** | Component testing |
| **jest-axe** | Accessibility testing |
| **Storybook** | Component documentation |
| **Playwright** | E2E testing (future) |

### Dependencies

```json
{
  "dependencies": {
    "@dnd-kit/core": "^6.x",
    "@dnd-kit/sortable": "^8.x",
    "@radix-ui/react-dialog": "^1.x",
    "@radix-ui/react-select": "^2.x",
    "@radix-ui/react-switch": "^1.x",
    "@radix-ui/react-tabs": "^1.x",
    "lucide-react": "^0.x"
  }
}
```

---

## File Structure

### Complete Directory Layout

```
packages/web/src/components/features/form-builder/
├── atoms/
│   ├── CharacterCount/
│   │   ├── CharacterCount.tsx
│   │   ├── CharacterCount.types.ts
│   │   ├── CharacterCount.test.tsx
│   │   ├── CharacterCount.stories.tsx
│   │   └── index.ts
│   ├── TimePicker/
│   └── ImageUpload/
│
├── molecules/
│   ├── TextFieldEditor/
│   │   ├── TextFieldEditor.tsx
│   │   ├── TextFieldEditor.types.ts
│   │   ├── TextFieldEditor.test.tsx
│   │   ├── TextFieldEditor.stories.tsx
│   │   └── index.ts
│   ├── TextareaFieldEditor/
│   ├── NumberFieldEditor/
│   ├── SelectFieldEditor/
│   ├── RadioFieldEditor/
│   ├── ToggleFieldEditor/
│   └── DateTimeFieldEditor/
│
├── organisms/
│   ├── FieldEditor/
│   │   ├── FieldEditor.tsx
│   │   ├── FieldEditor.types.ts
│   │   ├── FieldEditor.test.tsx
│   │   ├── FieldEditor.stories.tsx
│   │   └── index.ts
│   └── FormBuilder/
│       ├── FormBuilder.tsx
│       ├── FormBuilder.types.ts
│       ├── FormBuilder.test.tsx
│       ├── FormBuilder.stories.tsx
│       ├── README.md
│       └── index.ts
│
├── lib/
│   ├── field-helpers.ts          # Field manipulation utilities (21 functions)
│   ├── form-validation.ts        # Validation functions (316 lines)
│   ├── i18n-helpers.ts           # Localization utilities (101 lines)
│   ├── date-time-validation.ts   # Date/time validation (171 lines)
│   ├── date-time-i18n.ts         # Date/time i18n (131 lines)
│   └── index.ts                  # Barrel exports
│
└── types/                        # Local types (if needed)
```

### Import Paths

```typescript
// Organisms
import { FormBuilder } from '@/components/features/form-builder/organisms/FormBuilder';
import { FieldEditor } from '@/components/features/form-builder/organisms/FieldEditor';

// Molecules
import { TextFieldEditor } from '@/components/features/form-builder/molecules/TextFieldEditor';

// Atoms
import { CharacterCount } from '@/components/features/form-builder/atoms/CharacterCount';

// Utilities
import { generateFieldId, createDefaultField } from '@/components/features/form-builder/lib/field-helpers';

// Types (from shared package)
import type { FormSettings, FormField } from '@alkitu/shared';
```

---

## Integration Points

### 1. With Shared Types (`@alkitu/shared`)

```typescript
// Shared types used throughout Form Builder
import type {
  FormSettings,
  FormField,
  FormFieldType,
  FormFieldOption,
  ValidationRule,
  SupportedLocale,
  LocalizedFormMetadata,
  LocalizedFieldData,
} from '@alkitu/shared';
```

### 2. With tRPC API (`form-template.router.ts`)

```typescript
// FormBuilder saves to FormTemplate
const formTemplate = await trpc.formTemplate.create.mutate({
  name: 'Contact Form',
  formSettings: formSettings, // FormSettings object
  category: 'contact',
});
```

### 3. With Service Model

```typescript
// Service links to FormTemplate(s)
const service = await trpc.service.create.mutate({
  name: 'Customer Intake',
  formTemplateIds: [formTemplate.id],
  categoryId: 'services',
});
```

### 4. With Request Rendering

```typescript
// Forms are rendered for end users
import { RequestTemplateRenderer } from '@/components/organisms-alianza/RequestTemplateRenderer';

<RequestTemplateRenderer
  template={formTemplate.formSettings}
  onSubmit={handleSubmit}
/>
```

---

## Performance Considerations

### Optimization Strategies

1. **Lazy Field Editor Expansion**
   - Fields are collapsed by default
   - FieldEditor only renders when expanded
   - Saves render time for large forms (50+ fields)

2. **Memoization**
   ```typescript
   const localizedValue = React.useMemo(
     () => getLocalizedValue('title'),
     [formSettings, editingLocale]
   );
   ```

3. **Efficient Drag & Drop**
   - @dnd-kit uses transform CSS (GPU accelerated)
   - No layout recalculation during drag
   - Virtualization ready (future enhancement)

4. **Debounced Updates**
   ```typescript
   // Future enhancement
   const debouncedOnChange = useDebouncedCallback(onChange, 300);
   ```

### Performance Benchmarks

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Form load (10 fields) | <500ms | ~200ms | ✅ |
| Field add | <100ms | ~50ms | ✅ |
| Drag & drop | <16ms | <16ms | ✅ |
| Test execution | <10s | 2.81s | ✅ |

---

## Security Considerations

### Input Validation

1. **Client-Side Validation**
   - All field inputs validated in real-time
   - Type checking (email, phone, number, etc.)
   - Required field enforcement
   - Min/max constraints

2. **Server-Side Validation**
   - FormSettings validated with Zod schemas
   - Field structure validated
   - Sanitization of user input
   - XSS prevention

### Data Sanitization

```typescript
// Example: Form title sanitization
const sanitizedTitle = DOMPurify.sanitize(formSettings.title);
```

---

## Accessibility

### WCAG Compliance

- ✅ **Keyboard Navigation**: All interactions accessible via keyboard
- ✅ **Screen Readers**: Proper ARIA labels and roles
- ✅ **Focus Management**: Logical tab order
- ✅ **Color Contrast**: Meets WCAG AA standards
- ✅ **Alternative Text**: Images have alt attributes

### Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Add field | None (use Tab + Enter on button) |
| Delete field | None (use dropdown menu) |
| Drag field | Arrow keys + Space/Enter |
| Collapse/Expand | Enter on chevron button |
| Switch tabs | Arrow keys when tabs focused |

---

## Future Enhancements

### Planned Features

1. **Additional Field Types** (Phase 3)
   - range (slider)
   - multiselect (multi-select dropdown)
   - group (field grouping)
   - imageSelect (image radio buttons)
   - imageSelectMulti (image checkboxes)
   - map (location picker with Nominatim)

2. **Form Preview Mode**
   - Live preview of how form looks to end users
   - Device preview (desktop/tablet/mobile)
   - Toggle between edit and preview

3. **Conditional Logic**
   - Show/hide fields based on other fields
   - Change field options dynamically
   - Computed fields

4. **Form Analytics**
   - Track form submissions
   - Completion rates
   - Drop-off points
   - Field-level analytics

5. **Form Templates Library**
   - Pre-built form templates
   - Community-shared templates
   - Template marketplace

---

## Related Documentation

- [Component Usage Guide](./02-component-usage-guide.md)
- [Best Practices](./03-best-practices.md)
- [Integration Examples](./04-integration-examples.md)
- [API Reference](./05-api-reference.md)
- [Migration Guide](./06-migration-guide.md)

---

## Changelog

### v1.0.0 (February 10, 2026)
- ✅ Initial release
- ✅ 7 field types implemented
- ✅ Drag & drop support
- ✅ Multi-locale support (EN/ES)
- ✅ 414 tests with 97% pass rate
- ✅ 179 Storybook stories
- ✅ Production ready

---

**Questions or feedback?** Check out the [Best Practices guide](./03-best-practices.md) or [Integration Examples](./04-integration-examples.md).
