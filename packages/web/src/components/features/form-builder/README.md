# Form Builder Feature

Advanced Form Builder feature with 20+ field types, i18n support, and dynamic validation.

## Structure

This feature follows **Atomic Design** principles WITHIN the feature folder:

```
form-builder/
├── atoms/           # Basic building blocks specific to form builder
│   ├── CharacterCount/
│   ├── TimePicker/
│   ├── ImageUpload/
│   └── FieldHelpers/
│
├── molecules/       # Compound components (field editors)
│   ├── DateTimeFieldEditor/
│   ├── EmailFieldEditor/
│   ├── MapFieldEditor/
│   ├── ImageCarousel/
│   └── ... (19 field editors total)
│
├── organisms/       # Complex components (form builder core)
│   ├── AdvancedFormBuilder/
│   ├── AdvancedFormPreview/
│   ├── UnifiedFieldEditor/
│   ├── ValidationRuleBuilder/
│   ├── FormMetadataEditor/
│   ├── ImageManagerModal/
│   └── FormSummaryStep/
│
├── lib/             # Utilities specific to form builder
│   ├── form-validation.ts
│   ├── i18n-helpers.ts
│   └── field-converters.ts
│
└── types/           # TypeScript types specific to form builder
    └── index.ts
```

## Why Feature Folders?

- **Cohesion**: All 30+ form builder components are grouped together
- **Scalability**: Easy to add Page Builder later without saturating global folders
- **Encapsulation**: Feature-specific utilities and types are colocated
- **Atomic Design Preserved**: Clear hierarchy within the feature
- **Reutilization**: If a component becomes global, move it to `-alianza` folders

## Field Types Supported

### Basic Fields (10)
- text, email, phone
- textarea, number
- select, radio, toggle
- date, time

### Advanced Fields (10+)
- datetime (combined date + time)
- multiselect (multi-choice with drag-drop)
- range (slider with min/max)
- map (interactive map with Nominatim)
- imageSelect (single image picker with carousel)
- imageSelectMulti (multiple image picker)
- group (nested field groups)

## Features

✅ **Drag & Drop**: Reorder fields with @dnd-kit
✅ **i18n Support**: Multi-language forms (EN/ES)
✅ **Map Fields**: MapLibre GL + Nominatim geocoding
✅ **Image Carousels**: Embla carousel for image galleries
✅ **Validation**: 15+ validation rules with custom error messages
✅ **Real-time Preview**: Device preview (desktop/tablet/mobile)
✅ **Version Control**: Template versioning support

## Migration from fork-of-block-editor

This feature is migrated from `fork-of-block-editor` with:
- Full type safety
- Backend integration (tRPC + Prisma)
- Reusable FormTemplate model
- Clean architecture (no legacy code)

## Usage

```tsx
import { AdvancedFormBuilder } from '@/components/features/form-builder/organisms/AdvancedFormBuilder';

<AdvancedFormBuilder
  initialSettings={formSettings}
  onSave={handleSave}
  onCancel={handleCancel}
/>
```

## Next Steps

After form-builder is complete, add `page-builder` feature for inline form embedding:

```
features/
├── form-builder/  ✅ Current
└── page-builder/  🔜 Future
```
