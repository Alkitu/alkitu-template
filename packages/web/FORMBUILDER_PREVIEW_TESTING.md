# FormBuilder Preview Mode & Import/Export Testing Guide

## Overview

This guide covers testing the enhanced FormBuilder component with:
- Split-screen layout (Editor + Live Preview)
- JSON Import/Export functionality
- Real-time preview updates
- Multi-locale preview support

## New Features Added

### 1. Split-Screen Layout
- **Editor Panel** (left, 60% width): Form builder interface
- **Preview Panel** (right, 40% width): Live form preview
- **Toggle Button**: Show/hide preview panel
- **Responsive**: Stacks vertically on mobile

### 2. Import/Export Functionality
- **Export JSON**: Downloads current form configuration as JSON file
- **Import JSON**: Upload JSON file to load form configuration
- **Validation**: Validates imported JSON structure
- **Error Handling**: Shows toast notifications for success/errors

### 3. Live Preview
- **Real-time Updates**: Preview updates as you edit fields
- **All Field Types**: Supports all 10+ field types (text, email, select, toggle, etc.)
- **Locale Switching**: Preview form in different languages
- **Non-functional**: Preview is display-only (no actual submission)

## Files Modified/Created

### Created Files

1. **FormPreview Component** (Organism)
   - `/src/components/features/form-builder/organisms/FormPreview/FormPreview.tsx`
   - `/src/components/features/form-builder/organisms/FormPreview/FormPreview.types.ts`
   - `/src/components/features/form-builder/organisms/FormPreview/index.ts`

2. **Demo Page**
   - `/src/app/[lang]/(private)/admin/form-builder/demo/page.tsx`

3. **Sample Data**
   - `/public/sample-form.json`

### Modified Files

1. **FormBuilder Component**
   - `/src/components/features/form-builder/organisms/FormBuilder/FormBuilder.tsx`
   - Added toolbar with import/export buttons
   - Added preview toggle
   - Added split-screen layout
   - Added import/export functions

## Access Points

### Demo Page
```
URL: http://localhost:3000/[lang]/admin/form-builder/demo
Examples:
  - http://localhost:3000/en/admin/form-builder/demo
  - http://localhost:3000/es/admin/form-builder/demo
```

### Using FormBuilder in Other Pages
```tsx
import { FormBuilder } from '@/components/features/form-builder/organisms/FormBuilder';

<FormBuilder
  formSettings={yourFormSettings}
  onChange={handleFormChange}
  supportedLocales={['en', 'es']}
  defaultLocale="en"
/>
```

## Testing Instructions

### 1. Basic Preview Functionality

1. **Access the demo page**
   ```
   http://localhost:3000/en/admin/form-builder/demo
   ```

2. **Open preview panel**
   - Click "Show Preview" button in the toolbar
   - Verify split-screen layout appears
   - Verify preview panel shows on the right (desktop) or below (mobile)

3. **Edit fields and watch preview update**
   - Change a field label in the editor
   - Verify the preview updates immediately
   - Add a new field
   - Verify it appears in the preview
   - Delete a field
   - Verify it disappears from the preview

4. **Test locale switching**
   - In the preview panel, click the locale dropdown
   - Switch between English and Spanish
   - Verify form title, description, and field labels change
   - Verify fallback to default locale for untranslated fields

### 2. Import Functionality

1. **Import sample JSON**
   - Click "Import JSON" button in toolbar
   - Select `/public/sample-form.json`
   - Verify success toast notification
   - Verify form loads with 6 fields:
     - Full Name (text)
     - Email Address (email)
     - Phone Number (phone)
     - How can we help you? (select)
     - Message (textarea)
     - Subscribe to newsletter (toggle)

2. **Test validation on import**
   - Create an invalid JSON file (missing required fields)
   - Try to import it
   - Verify error toast notification
   - Verify form state remains unchanged

3. **Test with different form configurations**
   - Export your current form
   - Make changes in the editor
   - Import the exported file
   - Verify form reverts to exported state

### 3. Export Functionality

1. **Export current form**
   - Click "Export JSON" button in toolbar
   - Verify file downloads with naming pattern: `form-[title]-[timestamp].json`
   - Open downloaded file
   - Verify JSON structure matches FormSettings type
   - Verify all fields are included
   - Verify translations (i18n) are included

2. **Export and re-import cycle**
   - Create a form with multiple fields
   - Export the form
   - Clear all fields
   - Import the exported file
   - Verify form is restored exactly

### 4. Preview Panel Features

1. **Test all field types in preview**
   - Add each field type to the form
   - Verify it renders correctly in preview:
     - Text input fields (text, email, phone, number)
     - Textarea fields
     - Select dropdowns
     - Multi-select checkboxes
     - Radio buttons
     - Toggle switches
     - Date/time fields
     - Groups (nested fields)

2. **Test field properties**
   - Toggle "required" on a field
   - Verify asterisk (*) appears in preview
   - Add placeholder text
   - Verify it shows in preview
   - Add description text
   - Verify it shows below label

3. **Test locale-specific preview**
   - Add translations for fields in Spanish
   - Switch preview to Spanish
   - Verify translated labels show
   - Verify untranslated fields fall back to English

4. **Test refresh button**
   - Make changes to form
   - Click refresh icon in preview header
   - Verify preview re-renders

### 5. Toolbar Features

1. **Field counter**
   - Add/remove fields
   - Verify field count updates in toolbar
   - Verify plural handling (1 field vs 2 fields)

2. **Button states**
   - Click "Show Preview"
   - Verify button changes to "Hide Preview"
   - Verify button style changes to indicate active state
   - Click "Hide Preview"
   - Verify preview panel closes

### 6. Responsive Behavior

1. **Desktop view (≥1024px)**
   - Verify split-screen layout (editor 60%, preview 40%)
   - Verify preview is sticky on scroll

2. **Tablet view (768px-1023px)**
   - Verify panels stack vertically
   - Verify both panels are full width

3. **Mobile view (<768px)**
   - Verify panels stack vertically
   - Verify toolbar buttons remain accessible
   - Verify preview can be toggled on/off

### 7. Edge Cases

1. **Empty form**
   - Create form with no fields
   - Open preview
   - Verify empty state message shows
   - Verify submit button is disabled

2. **Large forms**
   - Create form with 20+ fields
   - Verify preview scrolls correctly
   - Verify performance is acceptable

3. **Complex nested groups**
   - Create form with group fields (steps)
   - Verify groups render correctly in preview
   - Verify nested fields show properly

4. **Special characters in form title**
   - Use title with special characters: `Test Form (2024) - "Special"`
   - Export form
   - Verify filename handles special characters

## Sample Form Structure

The included `sample-form.json` demonstrates:

```json
{
  "title": "Contact Form Demo",
  "description": "Please fill out this contact form...",
  "fields": [
    {
      "id": "field-1",
      "type": "text",
      "label": "Full Name",
      "validation": { "required": true }
    },
    // ... more fields
  ],
  "submitButtonText": "Send Message",
  "supportedLocales": ["en", "es"],
  "defaultLocale": "en",
  "i18n": {
    "es": {
      "title": "Formulario de Contacto Demo",
      "submitButtonText": "Enviar Mensaje"
    }
  }
}
```

## Common Issues & Solutions

### Issue: Preview not updating
**Solution**: Click the refresh button in preview header

### Issue: Import fails with error
**Solution**: Validate JSON structure matches FormSettings type. Check for:
- Required fields: `fields`, `title`, `submitButtonText`
- Valid field types
- Proper nesting structure

### Issue: Preview shows "No fields added yet"
**Solution**: Add fields to the form in the editor panel

### Issue: Locale switching doesn't work
**Solution**: Ensure form has multiple `supportedLocales` defined

### Issue: Export downloads empty file
**Solution**: Check browser console for errors. Ensure form has valid data.

## Performance Notes

- Preview updates are debounced to avoid excessive re-renders
- Large forms (50+ fields) may show slight delay in preview updates
- Export/import operations are synchronous and complete quickly

## Browser Compatibility

Tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Next Steps

After testing, you can:

1. **Use FormBuilder in production pages**
   - Services catalog forms
   - Request templates
   - Survey forms
   - Configuration forms

2. **Extend functionality**
   - Add validation preview
   - Add form submission testing
   - Add field dependency visualization
   - Add undo/redo functionality

3. **Customize preview**
   - Add theme switching
   - Add device preview modes (mobile/tablet/desktop)
   - Add accessibility testing tools

## Troubleshooting

### Dev server won't start
```bash
cd packages/web
npm install
npm run dev
```

### TypeScript errors
```bash
npm run type-check
```

### Missing dependencies
```bash
npm install
```

### Port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
# Or use different port
PORT=3001 npm run dev
```

## Additional Resources

- [FormBuilder Documentation](/docs/02-components/form-builder.md)
- [Atomic Design Architecture](/docs/00-conventions/atomic-design-architecture.md)
- [Component Testing Guide](/docs/05-testing/frontend-testing-guide.md)

## Feedback

Report issues or suggest improvements by:
1. Creating a GitHub issue
2. Documenting in `/docs/00-conventions/`
3. Updating this testing guide
