# FormBuilder Quick Start Guide

## 🚀 Quick Access

**Demo Page URL:**
```
http://localhost:3000/en/admin/form-builder/demo
```

## ⚡ 5-Minute Testing

### Step 1: Start Dev Server (30 seconds)
```bash
cd packages/web
npm run dev
```

### Step 2: Open Demo Page (10 seconds)
Navigate to: `http://localhost:3000/en/admin/form-builder/demo`

### Step 3: Test Split-Screen (1 minute)
1. Click **"Show Preview"** button
2. Edit a field label
3. Watch preview update in real-time

### Step 4: Test Export (1 minute)
1. Click **"Export JSON"** button
2. Verify file downloads
3. Open file to see JSON structure

### Step 5: Test Import (1 minute)
1. Click **"Import JSON"** button
2. Select the exported file (or use `/public/sample-form.json`)
3. Verify form loads correctly

### Step 6: Test Locales (30 seconds)
1. In preview panel, click locale dropdown
2. Switch between English and Spanish
3. Verify translations appear

### Step 7: Test Field Types (1 minute)
1. Add different field types (text, select, toggle, etc.)
2. Verify they render correctly in preview
3. Test field validation indicators

## 🎯 Key Features at a Glance

| Feature | Button/Action | Result |
|---------|--------------|--------|
| **Show Preview** | Click "Show Preview" | Split-screen with live preview |
| **Export** | Click "Export JSON" | Downloads form as JSON file |
| **Import** | Click "Import JSON" | Loads form from JSON file |
| **Switch Locale** | Dropdown in preview | See form in different language |
| **Refresh Preview** | Refresh icon in preview | Force preview re-render |
| **Add Field** | "+ Add Field" button | Opens field type picker |
| **Edit Field** | Click on field | Expand field editor |

## 📁 Files You Need to Know

### Demo Page
```
/src/app/[lang]/(private)/admin/form-builder/demo/page.tsx
```

### Main Component
```
/src/components/features/form-builder/organisms/FormBuilder/FormBuilder.tsx
```

### Preview Component
```
/src/components/features/form-builder/organisms/FormPreview/FormPreview.tsx
```

### Sample Data
```
/public/sample-form.json
```

## 🔧 Common Tasks

### Use FormBuilder in Your Page
```tsx
import { FormBuilder } from '@/components/features/form-builder/organisms/FormBuilder';
import { useState } from 'react';

export default function MyPage() {
  const [form, setForm] = useState({
    title: 'My Form',
    fields: [],
    submitButtonText: 'Submit',
    supportedLocales: ['en'],
    defaultLocale: 'en',
  });

  return (
    <FormBuilder
      formSettings={form}
      onChange={setForm}
    />
  );
}
```

### Export Programmatically
```typescript
const exportForm = (formSettings: FormSettings) => {
  const json = JSON.stringify(formSettings, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'form.json';
  link.click();
  URL.revokeObjectURL(url);
};
```

### Import Programmatically
```typescript
const importForm = async (file: File): Promise<FormSettings> => {
  const text = await file.text();
  const data = JSON.parse(text);
  return {
    ...data,
    supportedLocales: data.supportedLocales || ['en'],
    defaultLocale: data.defaultLocale || 'en',
  };
};
```

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Preview not showing | Click "Show Preview" button |
| Preview not updating | Click refresh icon |
| Import fails | Check JSON format in console |
| Export empty | Check form has data |
| Can't access demo | Verify server running on port 3000 |

## 📊 Sample Form Structure

Minimal valid JSON:
```json
{
  "title": "My Form",
  "description": "",
  "fields": [],
  "submitButtonText": "Submit",
  "supportedLocales": ["en"],
  "defaultLocale": "en"
}
```

Complete example:
```json
{
  "title": "Contact Form",
  "description": "Get in touch with us",
  "fields": [
    {
      "id": "field-1",
      "type": "text",
      "label": "Name",
      "validation": { "required": true }
    }
  ],
  "submitButtonText": "Send",
  "supportedLocales": ["en", "es"],
  "defaultLocale": "en",
  "i18n": {
    "es": {
      "title": "Formulario de Contacto",
      "submitButtonText": "Enviar"
    }
  }
}
```

## 🎨 UI Components

### Toolbar
```
[Field Counter] [Import JSON] [Export JSON] [Show/Hide Preview]
```

### Editor Panel
```
[Builder Tab] [Settings Tab]
├─ Global Config
│  ├─ Title
│  └─ Description
├─ Fields List
│  ├─ Field 1
│  └─ Field 2
└─ Submit Button
```

### Preview Panel
```
[Locale Dropdown] [Refresh]
├─ Form Title
├─ Form Description
├─ Field 1 (rendered)
├─ Field 2 (rendered)
└─ Submit Button (disabled)
```

## 📝 Field Types Supported

- ✅ text
- ✅ email
- ✅ phone
- ✅ number
- ✅ textarea
- ✅ select
- ✅ multiselect
- ✅ radio
- ✅ toggle
- ✅ date
- ✅ time
- ✅ datetime
- ✅ group (nested fields)

## 🌍 Locales Supported

- **English** (en) - Default
- **Spanish** (es) - Optional

Add more in Settings tab.

## 💡 Pro Tips

1. **Use sample form**: Load `/public/sample-form.json` to see all features
2. **Export often**: Save your work by exporting JSON regularly
3. **Test locales**: Always test with multiple languages
4. **Preview first**: Check preview before using form in production
5. **Log JSON**: Use "Log JSON" button to debug form structure

## 📚 More Documentation

- **Testing Guide**: `/FORMBUILDER_PREVIEW_TESTING.md`
- **Implementation**: `/FORMBUILDER_IMPLEMENTATION_SUMMARY.md`
- **Architecture**: `/FORMBUILDER_ARCHITECTURE.md`

## ✅ Quick Validation Checklist

Before deploying:
- [ ] All fields render in preview
- [ ] Export downloads valid JSON
- [ ] Import restores form correctly
- [ ] Locales switch properly
- [ ] Mobile view works
- [ ] No console errors
- [ ] Toast notifications work

## 🚦 Status Indicators

| Indicator | Meaning |
|-----------|---------|
| Field count | Number of fields in form |
| Preview button | Blue = visible, Gray = hidden |
| Toast | Green = success, Red = error |

## 🔗 Related Commands

```bash
# Start dev server
npm run dev

# Type check
npm run type-check

# Run tests
npm run test

# Build for production
npm run build
```

## 📞 Getting Help

1. Check console for errors
2. Review documentation files
3. Test with sample form
4. Verify server is running

---

**That's it! You're ready to use the enhanced FormBuilder.**

Start at the demo page and explore the features. Happy form building! 🎉
