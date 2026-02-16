# Form Builder Best Practices

**Last Updated**: February 10, 2026

---

## Table of Contents

1. [Performance](#performance)
2. [State Management](#state-management)
3. [Type Safety](#type-safety)
4. [Accessibility](#accessibility)
5. [i18n](#i18n)
6. [Testing](#testing)
7. [Code Organization](#code-organization)
8. [Common Pitfalls](#common-pitfalls)

---

## Performance

### 1. Use Controlled Components

✅ **DO**: Use controlled FormBuilder with external state

```tsx
function GoodExample() {
  const [formSettings, setFormSettings] = useState<FormSettings>({...});

  return (
    <FormBuilder
      formSettings={formSettings}
      onChange={setFormSettings}
    />
  );
}
```

❌ **DON'T**: Pass inline objects or recreate on every render

```tsx
function BadExample() {
  return (
    <FormBuilder
      formSettings={{
        title: 'Form', // ❌ New object every render
        fields: [],
      }}
      onChange={data => console.log(data)}
    />
  );
}
```

### 2. Memoize Callbacks

✅ **DO**: Use useCallback for onChange handlers

```tsx
const handleChange = useCallback((formSettings: FormSettings) => {
  setFormSettings(formSettings);
  // Optional: Auto-save
  debouncedSave(formSettings);
}, []);
```

### 3. Debounce Auto-Save

✅ **DO**: Debounce expensive operations like API calls

```tsx
import { useDebouncedCallback } from 'use-debounce';

const debouncedSave = useDebouncedCallback(
  async (formSettings: FormSettings) => {
    await trpc.formTemplate.update.mutate({
      id: templateId,
      formSettings,
    });
  },
  1000 // Wait 1s after last change
);
```

### 4. Lazy Load Heavy Components

✅ **DO**: Use dynamic imports for rarely used features

```tsx
import dynamic from 'next/dynamic';

const FormBuilder = dynamic(
  () => import('@/components/features/form-builder/organisms/FormBuilder'),
  { ssr: false, loading: () => <LoadingSkeleton /> }
);
```

---

## State Management

### 1. Single Source of Truth

✅ **DO**: Keep FormSettings in one place

```tsx
// ✅ Good: Single state in parent
function FormPage() {
  const [formSettings, setFormSettings] = useState<FormSettings>({...});

  return <FormBuilder formSettings={formSettings} onChange={setFormSettings} />;
}
```

❌ **DON'T**: Duplicate state in multiple places

```tsx
// ❌ Bad: State in multiple places
function FormPage() {
  const [formSettings, setFormSettings] = useState({...});
  const [fields, setFields] = useState([]); // ❌ Duplicate of formSettings.fields
  const [title, setTitle] = useState(''); // ❌ Duplicate of formSettings.title
}
```

### 2. Immutable Updates

✅ **DO**: Always create new objects/arrays

```tsx
// ✅ Good: Immutable update
setFormSettings(prev => ({
  ...prev,
  fields: [...prev.fields, newField],
}));
```

❌ **DON'T**: Mutate state directly

```tsx
// ❌ Bad: Direct mutation
formSettings.fields.push(newField); // ❌ Mutates state
setFormSettings(formSettings); // ❌ Same reference
```

### 3. Use Zustand for Global State (Optional)

✅ **DO**: Use Zustand if multiple components need access

```tsx
import { create } from 'zustand';

interface FormBuilderStore {
  formSettings: FormSettings;
  setFormSettings: (settings: FormSettings) => void;
}

export const useFormBuilderStore = create<FormBuilderStore>(set => ({
  formSettings: defaultFormSettings,
  setFormSettings: settings => set({ formSettings: settings }),
}));

// Usage
function FormPage() {
  const { formSettings, setFormSettings } = useFormBuilderStore();

  return <FormBuilder formSettings={formSettings} onChange={setFormSettings} />;
}
```

---

## Type Safety

### 1. Always Use TypeScript Types

✅ **DO**: Import and use shared types

```tsx
import type { FormSettings, FormField, FormFieldType } from '@alkitu/shared';

function handleAddField(type: FormFieldType) {
  const newField: FormField = createDefaultField(type);
  // Type-safe operations
}
```

### 2. Validate at Runtime with Zod

✅ **DO**: Validate FormSettings before saving

```tsx
import { FormSettingsSchema } from '@alkitu/shared/schemas';

async function saveForm(formSettings: FormSettings) {
  // Validate with Zod
  const validated = FormSettingsSchema.parse(formSettings);

  // Save validated data
  await trpc.formTemplate.create.mutate({
    name: validated.title,
    formSettings: validated,
  });
}
```

### 3. Use Type Guards

✅ **DO**: Create type guards for field types

```tsx
function isSelectField(field: FormField): field is FormField & { type: 'select' } {
  return field.type === 'select';
}

// Usage
if (isSelectField(field)) {
  console.log(field.options); // ✅ Type-safe access
}
```

---

## Accessibility

### 1. Provide Proper ARIA Labels

✅ **DO**: Add descriptive labels

```tsx
<button
  aria-label="Add new field to form"
  onClick={handleAddField}
>
  + Add Field
</button>
```

### 2. Maintain Logical Tab Order

✅ **DO**: Ensure keyboard navigation works

```tsx
<div>
  <input tabIndex={1} />
  <button tabIndex={2}>Next</button>
  <button tabIndex={3}>Cancel</button>
</div>
```

### 3. Test with Keyboard Only

✅ **DO**: Regularly test without mouse

```
Tab - Navigate to next element
Shift+Tab - Navigate to previous element
Enter - Activate button/link
Space - Toggle checkbox/switch
Arrow keys - Drag & drop fields
Escape - Close modals
```

### 4. Use Semantic HTML

✅ **DO**: Use correct HTML elements

```tsx
// ✅ Good
<button onClick={handleClick}>Click Me</button>

// ❌ Bad
<div onClick={handleClick}>Click Me</div>
```

---

## i18n

### 1. Always Provide Default Locale

✅ **DO**: Set default locale explicitly

```tsx
<FormBuilder
  formSettings={formSettings}
  onChange={setFormSettings}
  supportedLocales={['en', 'es']}
  defaultLocale="en" // ✅ Explicit default
/>
```

### 2. Structure i18n Data Correctly

✅ **DO**: Use nested structure

```tsx
const formSettings: FormSettings = {
  title: 'Contact Form', // Default locale (en)
  description: 'Get in touch',
  i18n: {
    es: {
      title: 'Formulario de Contacto',
      description: 'Póngase en contacto',
      fields: {
        'field-1': {
          label: 'Nombre Completo',
          placeholder: 'Ingrese su nombre',
        },
      },
    },
  },
};
```

### 3. Fallback to Default Locale

✅ **DO**: Always have fallback logic

```tsx
function getLocalizedTitle(formSettings: FormSettings, locale: string): string {
  // Try locale-specific value
  const localized = formSettings.i18n?.[locale]?.title;

  // Fallback to default
  return localized || formSettings.title;
}
```

---

## Testing

### 1. Test Field CRUD Operations

✅ **DO**: Test all operations

```tsx
describe('FormBuilder', () => {
  it('should add a new field', () => {
    const { getByText, rerender } = render(<FormBuilder {...props} />);

    // Click add field
    fireEvent.click(getByText('Add Field'));

    // Select field type
    fireEvent.click(getByText('Text Field'));

    // Verify field added
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        fields: expect.arrayContaining([
          expect.objectContaining({ type: 'text' }),
        ]),
      })
    );
  });
});
```

### 2. Test Drag & Drop

✅ **DO**: Test reordering

```tsx
it('should reorder fields via drag and drop', () => {
  const { getAllByRole } = render(<FormBuilder {...props} />);

  const fields = getAllByRole('listitem');

  // Simulate drag from index 0 to index 2
  dragAndDrop(fields[0], fields[2]);

  // Verify order changed
  expect(onChange).toHaveBeenCalledWith(
    expect.objectContaining({
      fields: expect.arrayContaining([
        /* reordered fields */
      ]),
    })
  );
});
```

### 3. Test Accessibility

✅ **DO**: Use jest-axe

```tsx
import { axe } from 'jest-axe';

it('should have no accessibility violations', async () => {
  const { container } = render(<FormBuilder {...props} />);

  const results = await axe(container);

  expect(results).toHaveNoViolations();
});
```

### 4. Test i18n

✅ **DO**: Test locale switching

```tsx
it('should display Spanish translations', () => {
  const { getByText } = render(
    <FormBuilder
      {...props}
      supportedLocales={['en', 'es']}
      defaultLocale="es"
    />
  );

  expect(getByText('Añadir Campo')).toBeInTheDocument(); // Spanish
});
```

---

## Code Organization

### 1. Use Feature Folders

✅ **DO**: Keep related files together

```
form-builder/
├── atoms/
├── molecules/
├── organisms/
├── lib/
└── types/ (if needed)
```

### 2. Colocate Tests with Components

✅ **DO**: Place tests next to components

```
TextFieldEditor/
├── TextFieldEditor.tsx
├── TextFieldEditor.test.tsx ✅
├── TextFieldEditor.stories.tsx
└── TextFieldEditor.types.ts
```

❌ **DON'T**: Separate tests into `__tests__/` folder

```
TextFieldEditor/
├── TextFieldEditor.tsx
├── __tests__/
│   └── TextFieldEditor.test.tsx ❌
```

### 3. Export from index.ts

✅ **DO**: Use barrel exports

```tsx
// index.ts
export { FormBuilder } from './FormBuilder';
export type { FormBuilderProps } from './FormBuilder.types';
```

---

## Common Pitfalls

### 1. Not Handling Empty States

❌ **Problem**: UI breaks with no fields

```tsx
// ❌ Bad: No check for empty
{formSettings.fields.map(field => <FieldEditor {...} />)}
```

✅ **Solution**: Show empty state

```tsx
// ✅ Good: Handle empty state
{formSettings.fields.length === 0 ? (
  <EmptyState message="No fields yet. Click 'Add Field' to start." />
) : (
  formSettings.fields.map(field => <FieldEditor {...} />)
)}
```

### 2. Forgetting to Generate Unique IDs

❌ **Problem**: Duplicate field IDs cause issues

```tsx
// ❌ Bad: Duplicate IDs
const newField = {
  id: 'field-1', // ❌ Hardcoded
  type: 'text',
};
```

✅ **Solution**: Always generate IDs

```tsx
// ✅ Good: Unique IDs
import { generateFieldId } from '@/components/features/form-builder/lib/field-helpers';

const newField = {
  id: generateFieldId(), // ✅ Unique
  type: 'text',
};
```

### 3. Not Validating Before Save

❌ **Problem**: Invalid data saved to database

```tsx
// ❌ Bad: No validation
async function saveForm() {
  await trpc.formTemplate.create.mutate({
    name: formSettings.title,
    formSettings, // ❌ Not validated
  });
}
```

✅ **Solution**: Validate with Zod

```tsx
// ✅ Good: Validate first
import { FormSettingsSchema } from '@alkitu/shared/schemas';

async function saveForm() {
  try {
    const validated = FormSettingsSchema.parse(formSettings);

    await trpc.formTemplate.create.mutate({
      name: validated.title,
      formSettings: validated,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      console.error('Validation errors:', error.errors);
      // Show user-friendly error messages
    }
  }
}
```

### 4. Over-Rendering

❌ **Problem**: FormBuilder re-renders too often

```tsx
// ❌ Bad: Inline function recreated every render
<FormBuilder
  formSettings={formSettings}
  onChange={data => setFormSettings(data)} // ❌ New function every render
/>
```

✅ **Solution**: Use useCallback

```tsx
// ✅ Good: Memoized callback
const handleChange = useCallback((data: FormSettings) => {
  setFormSettings(data);
}, []);

<FormBuilder
  formSettings={formSettings}
  onChange={handleChange} // ✅ Stable reference
/>
```

### 5. Not Cleaning Up on Unmount

❌ **Problem**: Memory leaks from subscriptions

```tsx
// ❌ Bad: No cleanup
useEffect(() => {
  const subscription = formStore.subscribe(handleChange);
  // ❌ No cleanup
}, []);
```

✅ **Solution**: Return cleanup function

```tsx
// ✅ Good: Proper cleanup
useEffect(() => {
  const subscription = formStore.subscribe(handleChange);

  return () => {
    subscription.unsubscribe(); // ✅ Cleanup
  };
}, []);
```

---

## Performance Checklist

Before deploying to production:

- [ ] Memoize expensive callbacks with `useCallback`
- [ ] Memoize expensive computations with `useMemo`
- [ ] Debounce auto-save operations (1-2 seconds)
- [ ] Lazy load FormBuilder if not immediately needed
- [ ] Test with large forms (50+ fields)
- [ ] Profile with React DevTools
- [ ] Optimize bundle size (code splitting)
- [ ] Enable gzip compression
- [ ] Use CDN for static assets
- [ ] Monitor with web vitals

---

## Accessibility Checklist

Before deploying to production:

- [ ] All interactive elements are keyboard accessible
- [ ] Proper ARIA labels on all controls
- [ ] Logical tab order throughout
- [ ] Screen reader tested (NVDA, JAWS, VoiceOver)
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Focus indicators visible
- [ ] No keyboard traps
- [ ] Modals trap focus correctly
- [ ] Error messages announced to screen readers
- [ ] jest-axe tests passing

---

## Next Steps

- Review [Integration Examples](./04-integration-examples.md) for real-world patterns
- Check [Architecture Overview](./01-architecture-overview.md) for system design
- Read [Component Usage Guide](./02-component-usage-guide.md) for API details

---

**Questions?** Raise an issue on GitHub or check the comprehensive test suites for examples.
