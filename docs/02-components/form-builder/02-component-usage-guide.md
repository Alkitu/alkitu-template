# Form Builder Component Usage Guide

**Last Updated**: February 10, 2026

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [FormBuilder Component](#formbuilder-component)
3. [FieldEditor Component](#fieldeditor-component)
4. [Field Editor Molecules](#field-editor-molecules)
5. [Atoms](#atoms)
6. [Utilities](#utilities)
7. [Common Patterns](#common-patterns)

---

## Quick Start

### Basic Form Builder Usage

```tsx
import { useState } from 'react';
import { FormBuilder } from '@/components/features/form-builder/organisms/FormBuilder';
import type { FormSettings } from '@alkitu/shared';

export default function CreateFormPage() {
  const [formSettings, setFormSettings] = useState<FormSettings>({
    title: 'Contact Form',
    description: 'Please fill out this form',
    fields: [],
    submitButtonText: 'Submit',
    supportedLocales: ['en', 'es'],
    defaultLocale: 'en',
    i18n: {},
  });

  const handleSave = async () => {
    // Save to database
    await trpc.formTemplate.create.mutate({
      name: formSettings.title,
      formSettings,
      category: 'contact',
    });
  };

  return (
    <div>
      <FormBuilder
        formSettings={formSettings}
        onChange={setFormSettings}
        supportedLocales={['en', 'es']}
        defaultLocale="en"
      />
      <button onClick={handleSave}>Save Form</button>
    </div>
  );
}
```

---

## FormBuilder Component

### Props

```typescript
interface FormBuilderProps {
  formSettings: FormSettings;
  onChange: (formSettings: FormSettings) => void;
  supportedLocales?: SupportedLocale[];
  defaultLocale?: SupportedLocale;
}
```

### Example: Multi-Locale Form

```tsx
import { FormBuilder } from '@/components/features/form-builder/organisms/FormBuilder';

function MultiLocaleForm() {
  const [formSettings, setFormSettings] = useState<FormSettings>({
    title: 'Contact Form',
    description: 'Get in touch',
    fields: [],
    submitButtonText: 'Submit',
    supportedLocales: ['en', 'es', 'fr'],
    defaultLocale: 'en',
    i18n: {
      es: {
        title: 'Formulario de Contacto',
        description: 'Póngase en contacto',
        submitButtonText: 'Enviar',
      },
      fr: {
        title: 'Formulaire de Contact',
        description: 'Contactez-nous',
        submitButtonText: 'Soumettre',
      },
    },
  });

  return (
    <FormBuilder
      formSettings={formSettings}
      onChange={setFormSettings}
      supportedLocales={['en', 'es', 'fr']}
      defaultLocale="en"
    />
  );
}
```

### Example: With Initial Fields

```tsx
import { createDefaultField } from '@/components/features/form-builder/lib/field-helpers';

function FormWithInitialFields() {
  const [formSettings, setFormSettings] = useState<FormSettings>({
    title: 'Contact Form',
    fields: [
      createDefaultField('text', {
        label: 'Full Name',
        validation: { required: true },
      }),
      createDefaultField('email', {
        label: 'Email Address',
        validation: { required: true },
      }),
      createDefaultField('textarea', {
        label: 'Message',
        validation: { required: true, minLength: 10 },
      }),
    ],
    submitButtonText: 'Send Message',
    supportedLocales: ['en'],
    defaultLocale: 'en',
  });

  return <FormBuilder formSettings={formSettings} onChange={setFormSettings} />;
}
```

---

## FieldEditor Component

### Props

```typescript
interface FieldEditorProps {
  field: FormField;
  onChange: (field: FormField) => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  supportedLocales?: SupportedLocale[];
  defaultLocale?: SupportedLocale;
  editingLocale?: SupportedLocale;
  onLocaleChange?: (locale: SupportedLocale) => void;
}
```

### Example: Standalone Field Editor

```tsx
import { FieldEditor } from '@/components/features/form-builder/organisms/FieldEditor';

function StandaloneFieldEditor() {
  const [field, setField] = useState<FormField>({
    id: 'field-1',
    type: 'text',
    label: 'Full Name',
    validation: { required: true },
  });

  return (
    <FieldEditor
      field={field}
      onChange={setField}
      onDelete={() => console.log('Delete field')}
      onDuplicate={() => console.log('Duplicate field')}
      supportedLocales={['en', 'es']}
      defaultLocale="en"
    />
  );
}
```

---

## Field Editor Molecules

### TextFieldEditor

Handles text, email, and phone field types.

```tsx
import { TextFieldEditor } from '@/components/features/form-builder/molecules/TextFieldEditor';

<TextFieldEditor
  field={{
    id: 'email-1',
    type: 'email',
    label: 'Email Address',
    placeholder: 'Enter your email',
    validation: { required: true },
  }}
  onChange={handleFieldChange}
  onDelete={handleDelete}
  editingLocale="en"
  defaultLocale="en"
/>
```

**Features**:
- Real-time email validation
- Phone number formatting with country presets
- Character limit validation
- Multi-locale labels and placeholders

---

### TextareaFieldEditor

Handles multi-line text input.

```tsx
import { TextareaFieldEditor } from '@/components/features/form-builder/molecules/TextareaFieldEditor';

<TextareaFieldEditor
  field={{
    id: 'message-1',
    type: 'textarea',
    label: 'Your Message',
    validation: { required: true, minLength: 50, maxLength: 500 },
    textareaOptions: {
      rows: 5,
      minRows: 3,
      maxRows: 10,
      resize: 'vertical',
      showCharacterCount: true,
    },
  }}
  onChange={handleFieldChange}
  onDelete={handleDelete}
/>
```

**Features**:
- Character counter (uses CharacterCount atom)
- Min/max rows
- Resize modes (none, vertical, both)
- Auto-grow functionality

---

### NumberFieldEditor

Handles number, currency, and percentage fields.

```tsx
import { NumberFieldEditor } from '@/components/features/form-builder/molecules/NumberFieldEditor';

<NumberFieldEditor
  field={{
    id: 'price-1',
    type: 'number',
    label: 'Price',
    validation: { required: true, min: 0, max: 10000 },
    numberOptions: {
      displayType: 'currency',
      currencyCode: 'USD',
      decimals: 2,
      thousandsSeparator: true,
      allowNegative: false,
    },
  }}
  onChange={handleFieldChange}
  onDelete={handleDelete}
/>
```

**Features**:
- 3 display types: number, currency, percentage
- 5 currency presets (USD, EUR, GBP, MXN, JPY)
- Decimal places configuration
- Thousands separators
- Custom prefix/suffix

---

### SelectFieldEditor

Handles dropdown selections.

```tsx
import { SelectFieldEditor } from '@/components/features/form-builder/molecules/SelectFieldEditor';

<SelectFieldEditor
  field={{
    id: 'country-1',
    type: 'select',
    label: 'Country',
    validation: { required: true },
    options: [
      { id: 'opt-1', label: 'United States', value: 'US' },
      { id: 'opt-2', label: 'Canada', value: 'CA' },
      { id: 'opt-3', label: 'Mexico', value: 'MX' },
    ],
    selectOptions: {
      placeholder: 'Select a country',
      allowClear: true,
    },
  }}
  onChange={handleFieldChange}
  onDelete={handleDelete}
/>
```

**Features**:
- Options CRUD (add, edit, delete, duplicate)
- Default value selection
- Placeholder text
- Allow clear option
- Duplicate value detection

---

### RadioFieldEditor

Handles radio button groups.

```tsx
import { RadioFieldEditor } from '@/components/features/form-builder/molecules/RadioFieldEditor';

<RadioFieldEditor
  field={{
    id: 'size-1',
    type: 'radio',
    label: 'T-Shirt Size',
    validation: { required: true },
    options: [
      { id: 'opt-1', label: 'Small', value: 'S' },
      { id: 'opt-2', label: 'Medium', value: 'M' },
      { id: 'opt-3', label: 'Large', value: 'L' },
    ],
    radioOptions: {
      layout: 'horizontal',
      defaultValue: 'M',
    },
  }}
  onChange={handleFieldChange}
  onDelete={handleDelete}
/>
```

**Features**:
- Layout switching (vertical/horizontal)
- Default value selection
- Options management
- Empty state handling

---

### ToggleFieldEditor

Handles toggle switches and checkboxes.

```tsx
import { ToggleFieldEditor } from '@/components/features/form-builder/molecules/ToggleFieldEditor';

<ToggleFieldEditor
  field={{
    id: 'newsletter-1',
    type: 'toggle',
    label: 'Subscribe to newsletter',
    validation: { required: false },
    toggleOptions: {
      style: 'toggle', // or 'checkbox'
      defaultChecked: false,
      valueType: 'boolean', // or 'string'
      checkedValue: true,
      uncheckedValue: false,
    },
  }}
  onChange={handleFieldChange}
  onDelete={handleDelete}
/>
```

**Features**:
- Toggle switch vs checkbox style
- Default checked state
- Custom values (boolean or string)
- Required field support

---

### DateTimeFieldEditor

Handles date, time, and datetime fields.

```tsx
import { DateTimeFieldEditor } from '@/components/features/form-builder/molecules/DateTimeFieldEditor';

<DateTimeFieldEditor
  field={{
    id: 'appointment-1',
    type: 'datetime',
    label: 'Appointment Date & Time',
    validation: { required: true },
    dateOptions: {
      minDate: '2026-01-01',
      maxDate: '2026-12-31',
      disableWeekends: true,
      disabledDates: ['2026-07-04', '2026-12-25'],
    },
    timeOptions: {
      hourFormat: '12h',
      includeSeconds: false,
      minTime: '09:00',
      maxTime: '17:00',
      businessHours: {
        enabled: true,
        start: '09:00',
        end: '17:00',
      },
    },
  }}
  onChange={handleFieldChange}
  onDelete={handleDelete}
/>
```

**Features**:
- 3 modes: date, time, datetime
- Date range restrictions
- Disabled dates and weekends
- Time range restrictions
- Business hours configuration
- 12h/24h time format

---

## Atoms

### CharacterCount

Displays character count with color-coded feedback.

```tsx
import { CharacterCount } from '@/components/features/form-builder/atoms/CharacterCount';

<CharacterCount current={50} max={100} />
```

**States**:
- Default: 0-80% of max (gray)
- Warning: 80-95% of max (yellow)
- Error: 95-100% of max (red)

---

### TimePicker

Time selection widget with 12h/24h support.

```tsx
import { TimePicker } from '@/components/features/form-builder/atoms/TimePicker';

<TimePicker
  value="14:30"
  onChange={setTime}
  format="24h"
  includeSeconds={false}
  locale="en"
/>
```

**Features**:
- 12h/24h format switching
- AM/PM period selector
- Optional seconds
- Time intervals (15min, 30min)
- Hour range restrictions
- i18n support (EN/ES)

---

### ImageUpload

Single image upload component.

```tsx
import { ImageUpload } from '@/components/features/form-builder/atoms/ImageUpload';

<ImageUpload
  value={imageUrl}
  onChange={setImageUrl}
  onFileSelect={handleFileUpload}
  maxSize={5 * 1024 * 1024} // 5MB
  accept="image/*"
/>
```

**Features**:
- Dual input (URL + File upload)
- Drag & drop support
- Real-time preview
- File validation (type, size)
- Upload progress indicator

---

## Utilities

### Field Helpers

```typescript
import {
  generateFieldId,
  createDefaultField,
  duplicateField,
  moveField,
  findFieldById,
} from '@/components/features/form-builder/lib/field-helpers';

// Generate unique ID
const id = generateFieldId(); // "field-abc123"

// Create new field with defaults
const field = createDefaultField('text', {
  label: 'Custom Label',
  validation: { required: true },
});

// Duplicate field
const copy = duplicateField(field); // New ID, label appended with " (copy)"

// Reorder fields
const reordered = moveField(fields, 0, 2); // Move field from index 0 to 2

// Find field by ID
const found = findFieldById(fields, 'field-123');
```

---

### Form Validation

```typescript
import {
  validateEmail,
  validatePhone,
  validateUrl,
  validateDate,
} from '@/components/features/form-builder/lib/form-validation';

// Validate email
const isValid = validateEmail('user@example.com'); // true

// Validate phone (with country)
const isValidPhone = validatePhone('(555) 123-4567', 'US'); // true

// Validate URL
const isValidUrl = validateUrl('https://example.com'); // true

// Validate date
const isValidDate = validateDate('2026-12-31'); // true
```

---

### i18n Helpers

```typescript
import {
  getLocalizedValue,
  updateLocalizedValue,
} from '@/components/features/form-builder/lib/i18n-helpers';

// Get localized value
const title = getLocalizedValue(formSettings, 'title', 'es', 'en');
// Returns formSettings.i18n.es.title or fallback to formSettings.title

// Update localized value
const updated = updateLocalizedValue(
  formSettings,
  'description',
  'es',
  'Nueva descripción'
);
// Updates formSettings.i18n.es.description
```

---

## Common Patterns

### Pattern 1: Programmatic Field Addition

```tsx
import { createDefaultField, generateFieldId } from '@/components/features/form-builder/lib/field-helpers';

function addEmailField() {
  const newField = createDefaultField('email', {
    label: 'Email Address',
    placeholder: 'Enter your email',
    validation: { required: true },
  });

  setFormSettings(prev => ({
    ...prev,
    fields: [...prev.fields, newField],
  }));
}
```

### Pattern 2: Field Validation

```tsx
function validateForm(formSettings: FormSettings): boolean {
  // Check if required fields are filled
  const hasRequiredFields = formSettings.fields.some(
    field => field.validation?.required
  );

  // Check if form has at least one field
  const hasFields = formSettings.fields.length > 0;

  // Check if form has title
  const hasTitle = formSettings.title.trim().length > 0;

  return hasRequiredFields && hasFields && hasTitle;
}
```

### Pattern 3: Field Filtering

```tsx
import { getFieldsByType } from '@/components/features/form-builder/lib/field-helpers';

// Get all email fields
const emailFields = getFieldsByType(formSettings.fields, 'email');

// Get all required fields
const requiredFields = formSettings.fields.filter(
  field => field.validation?.required
);

// Get all fields with options (select, radio)
const fieldsWithOptions = formSettings.fields.filter(field =>
  ['select', 'radio'].includes(field.type)
);
```

### Pattern 4: Locale Switching

```tsx
function LocaleSwitcher() {
  const [editingLocale, setEditingLocale] = useState<SupportedLocale>('en');

  return (
    <select value={editingLocale} onChange={e => setEditingLocale(e.target.value as SupportedLocale)}>
      <option value="en">English</option>
      <option value="es">Español</option>
    </select>
  );
}
```

### Pattern 5: Controlled vs Uncontrolled FormBuilder

```tsx
// Controlled (recommended)
function ControlledForm() {
  const [formSettings, setFormSettings] = useState<FormSettings>({...});

  return (
    <FormBuilder
      formSettings={formSettings}
      onChange={setFormSettings}
    />
  );
}

// Uncontrolled (with ref)
function UncontrolledForm() {
  const formRef = useRef<FormBuilderRef>(null);

  const handleSave = () => {
    const formSettings = formRef.current?.getFormSettings();
    // Save formSettings
  };

  return <FormBuilder ref={formRef} defaultFormSettings={{...}} />;
}
```

---

## Next Steps

- Read [Best Practices](./03-best-practices.md) for optimization tips
- Check [Integration Examples](./04-integration-examples.md) for real-world usage
- Review [API Reference](./05-api-reference.md) for complete prop documentation

---

**Need help?** Check the [Architecture Overview](./01-architecture-overview.md) or raise an issue on GitHub.
