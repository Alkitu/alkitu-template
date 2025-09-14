# Theme Editor 3.0 - Developer Setup Guide

> **ETAPA 5: Documentation & Polish** - Guía para desarrolladores que quieren usar/modificar Theme Editor 3.0
>
> Esta guía documenta cómo integrar y usar el sistema ACTUAL sin modificaciones

**Fecha**: Enero 2025
**Target**: Desarrolladores frontend que integran Theme Editor
**Prerequisitos**: Next.js 15+, TypeScript, Tailwind CSS

---

## 🚀 Quick Start (5 minutos)

### 1. Instalación y Setup

```bash
# Clonar repositorio (si no está clonado)
git clone [repo-url]
cd alkitu-template

# Instalar dependencias
npm install

# Iniciar desarrollo
npm run dev
```

### 2. Acceder Theme Editor

```bash
# Abrir en navegador
http://localhost:3000/admin/theme-editor

# O navegación interna
/admin/theme-editor-3.0
```

### 3. Verificar Funcionamiento

✅ **Color picker** cambia colores en tiempo real
✅ **Light/Dark toggle** funciona
✅ **Export buttons** descargan archivos
✅ **Undo/Redo** con Ctrl+Z/Ctrl+Y
✅ **Preview tabs** muestran cambios

**¡Listo! Theme Editor está completamente funcional.**

---

## 📁 Estructura de Archivos

### Directorio Principal
```
/packages/web/src/components/admin/theme-editor-3.0/
```

### Organización Actual

```
theme-editor-3.0/
├── 📋 CURRENT-FUNCTIONALITY-GUIDE.md     # ← Esta guía
├── 📋 DEVELOPER-SETUP-GUIDE.md          # ← Guía actual
├── 📋 THEME-EDITOR-DEVELOPMENT-RULES.md # ← Reglas críticas
│
├── 🏗️ core/
│   ├── context/
│   │   └── ThemeEditorContext.tsx        # ← Estado central (NO TOCAR)
│   └── types/
│       └── theme.types.ts                # ← Definiciones (NO TOCAR)
│
├── 🎨 design-system/
│   ├── atoms/
│   │   ├── Button.tsx                    # ← Componente + MemoizedButton
│   │   ├── Button.md                     # ← API docs
│   │   ├── Button.stories.tsx            # ← Storybook stories
│   │   ├── Input.tsx                     # ← Componente + MemoizedInput
│   │   ├── Input.md                      # ← API docs
│   │   ├── Input.stories.tsx             # ← Storybook stories
│   │   ├── Select.tsx                    # ← Componente + MemoizedSelect
│   │   ├── Select.md                     # ← API docs
│   │   └── Select.stories.tsx            # ← Storybook stories
│   ├── molecules/                        # ← Componentes compuestos
│   └── organisms/                        # ← Componentes complejos
│
├── 🔧 lib/
│   └── utils/
│       ├── color/
│       │   └── color-conversions-v2.ts   # ← Algoritmos color (NO TOCAR)
│       └── css/
│           └── css-variables.ts          # ← CSS aplicación (NO TOCAR)
│
├── 🖼️ preview/                            # ← Preview components
├── 🎛️ theme-editor/                       # ← Editor UI
├── 📐 layout/                             # ← Layout structure (NO TOCAR)
└── 🧪 __tests__/                          # ← Tests completos
```

### Archivos CRÍTICOS (NO TOCAR)

⚠️ **NUNCA modificar estos archivos** - son el núcleo funcional:

```typescript
❌ /core/context/ThemeEditorContext.tsx     // Estado central
❌ /core/types/theme.types.ts               // Types usados everywhere
❌ /lib/utils/color/color-conversions-v2.ts // Algoritmos de color
❌ /lib/utils/css/css-variables.ts          // CSS variable application
❌ /layout/ResizableLayout.tsx              // Layout structure
```

---

## 🎨 Usar Design System Components

### Button Component

```tsx
import { Button, MemoizedButton } from './design-system/atoms/Button';

// Uso básico
<Button variant="default" size="lg">
  Click me
</Button>

// Con iconos
<Button variant="outline" icon={<SaveIcon />}>
  Save Theme
</Button>

// Solo icono
<Button
  variant="icon"
  size="icon"
  icon={<HomeIcon />}
  aria-label="Go home"  // ← Obligatorio para a11y
/>

// Estado loading
<Button variant="default" loading={true}>
  Saving...  {/* ← Spinner automático */}
</Button>

// Version optimizada (para listas/forms intensivos)
<MemoizedButton variant="default">
  Optimized Button
</MemoizedButton>
```

### Input Component

```tsx
import { Input, MemoizedInput } from './design-system/atoms/Input';

// Uso básico
<Input
  type="text"
  placeholder="Enter theme name"
  variant="default"
/>

// Con validación
<Input
  type="email"
  placeholder="Email"
  isInvalid={!isEmailValid}
  aria-describedby="email-error"
/>
<div id="email-error">Please enter valid email</div>

// Con iconos
<Input
  type="search"
  placeholder="Search..."
  leftIcon={<SearchIcon />}
  rightIcon={query && <ClearIcon onClick={clearQuery} />}
/>

// Password con toggle
<Input
  type="password"
  placeholder="Password"
  showPasswordToggle={true}  // ← Toggle automático
  leftIcon={<LockIcon />}
/>

// Tipos especiales para Theme Editor
<Input type="color" defaultValue="#3B82F6" />  // Color picker
<Input type="range" min="0" max="100" />       // Slider
<Input type="file" accept=".json,.theme" />    // File upload
```

### Select Component

```tsx
import { Select, MemoizedSelect } from './design-system/atoms/Select';

const options = [
  { value: 'light', label: 'Light Theme' },
  { value: 'dark', label: 'Dark Theme' },
  { value: 'custom', label: 'Custom Theme', disabled: true }
];

// Uso básico
<Select
  options={options}
  placeholder="Choose theme..."
  onValueChange={handleChange}
/>

// Controlado
<Select
  options={options}
  value={selectedTheme}
  onValueChange={setSelectedTheme}
  variant="filled"
/>

// Con validación
<Select
  options={options}
  isInvalid={!selectedTheme}
  aria-describedby="theme-error"
  aria-required={true}
/>
```

---

## 🎯 Integrar con Theme Context

### Acceder Estado del Theme

```tsx
import { useThemeEditor } from '../core/context/ThemeEditorContext';

function MyComponent() {
  const {
    // Estado actual
    currentTheme,

    // Acciones principales
    updateTheme,
    toggleTheme,
    resetTheme,

    // Historial
    undo,
    redo,
    canUndo,
    canRedo,

    // Estado de carga
    isLoading,

    // Persistencia
    saveTheme,
    loadTheme
  } = useThemeEditor();

  return (
    <div>
      <p>Current mode: {currentTheme.mode}</p>
      <p>Primary color: {currentTheme.colors.primary}</p>

      <button onClick={toggleTheme}>
        Switch to {currentTheme.mode === 'light' ? 'dark' : 'light'}
      </button>

      <button onClick={undo} disabled={!canUndo}>
        Undo
      </button>
    </div>
  );
}
```

### Modificar Theme Programatically

```tsx
// Cambiar colores
updateTheme({
  colors: {
    ...currentTheme.colors,
    primary: '#FF0000',
    secondary: '#00FF00'
  }
});

// Cambiar modo
updateTheme({
  ...currentTheme,
  mode: 'dark'
});

// Cambiar tipografía
updateTheme({
  ...currentTheme,
  typography: {
    ...currentTheme.typography,
    fontFamily: 'Roboto, sans-serif'
  }
});

// Reset completo
resetTheme(); // Vuelve a tema default
```

### Escuchar Cambios de Theme

```tsx
useEffect(() => {
  // Se ejecuta cada vez que el theme cambia
  console.log('Theme updated:', currentTheme);

  // Aplicar custom logic
  if (currentTheme.mode === 'dark') {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
}, [currentTheme]);
```

---

## 🎨 Usar CSS Variables del Theme

### Variables Disponibles

El Theme Editor aplica automáticamente estas CSS variables:

```css
/* Colores */
--colors-primary: #3B82F6;
--colors-secondary: #64748B;
--colors-background: #FFFFFF;
--colors-foreground: #0F172A;
--colors-muted: #F1F5F9;
--colors-accent: #F8FAFC;
--colors-destructive: #EF4444;
--colors-success: #10B981;
--colors-warning: #F59E0B;

/* Tipografía */
--typography-paragraph-font-family: 'Inter', sans-serif;
--typography-paragraph-font-size: 14px;
--typography-paragraph-letter-spacing: 0;
--typography-paragraph-line-height: 1.6;

/* Spacing */
--radius: 8px;
--radius-button: var(--radius);
--radius-input: var(--radius);

/* Focus */
--focus-ring-color: var(--colors-primary);
```

### Usar en tus Componentes

```tsx
// En componentes React
const MyButton = () => (
  <button
    style={{
      backgroundColor: 'var(--colors-primary)',
      color: 'var(--colors-background)',
      borderRadius: 'var(--radius-button)',
      fontFamily: 'var(--typography-paragraph-font-family)'
    }}
  >
    Themed Button
  </button>
);

// En CSS/SCSS
.my-component {
  background: var(--colors-background);
  color: var(--colors-foreground);
  border: 1px solid var(--colors-primary);
  border-radius: var(--radius);
  font-family: var(--typography-paragraph-font-family);
}

// Con Tailwind CSS
<div className="bg-background text-foreground border-primary rounded-[var(--radius)]">
  Themed with Tailwind + CSS variables
</div>
```

### Custom CSS Variables

```tsx
// Agregar variables personalizadas
const addCustomVariables = () => {
  const root = document.documentElement;
  root.style.setProperty('--my-custom-color', '#FF6B6B');
  root.style.setProperty('--my-custom-size', '24px');
};

// Usar en componente
<div
  style={{
    color: 'var(--my-custom-color)',
    fontSize: 'var(--my-custom-size)'
  }}
>
  Custom themed content
</div>
```

---

## 📤 Export e Import de Themes

### Export Theme Actual

```tsx
import { useThemeEditor } from '../core/context/ThemeEditorContext';

function ExportButton() {
  const { currentTheme } = useThemeEditor();

  const exportTheme = (format: 'css' | 'json' | 'tailwind') => {
    switch (format) {
      case 'css':
        return exportToCSSVariables(currentTheme);
      case 'json':
        return exportToJSON(currentTheme);
      case 'tailwind':
        return exportToTailwindConfig(currentTheme);
    }
  };

  const downloadTheme = (format: string) => {
    const content = exportTheme(format);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `theme.${format}`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <button onClick={() => downloadTheme('css')}>
        Export CSS
      </button>
      <button onClick={() => downloadTheme('json')}>
        Export JSON
      </button>
      <button onClick={() => downloadTheme('tailwind')}>
        Export Tailwind
      </button>
    </div>
  );
}
```

### Formatos de Export

#### CSS Variables
```css
/* theme-export.css */
:root {
  --colors-primary: #3B82F6;
  --colors-background: #FFFFFF;
  /* ... más variables */
}

/* Dark mode */
[data-theme="dark"] {
  --colors-background: #0F172A;
  --colors-foreground: #F8FAFC;
}
```

#### JSON Configuration
```json
{
  "name": "My Custom Theme",
  "version": "3.0",
  "mode": "light",
  "colors": {
    "primary": "#3B82F6",
    "background": "#FFFFFF"
  },
  "typography": {
    "fontFamily": "Inter, sans-serif"
  },
  "exported": "2025-01-14T10:30:00.000Z"
}
```

#### Tailwind Config
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        background: '#FFFFFF',
        foreground: '#0F172A'
      }
    }
  }
}
```

### Import Theme (Manual)

```tsx
// Import desde JSON
const importThemeFromJSON = (jsonString: string) => {
  try {
    const importedTheme = JSON.parse(jsonString);
    updateTheme(importedTheme);
  } catch (error) {
    console.error('Invalid theme JSON:', error);
  }
};

// Import component
function ImportTheme() {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        importThemeFromJSON(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <input
      type="file"
      accept=".json"
      onChange={handleFileUpload}
    />
  );
}
```

---

## 🧪 Testing y Development

### Correr Tests

```bash
# Tests unitarios
npm run test

# Tests con coverage
npm run test:coverage

# Tests específicos
npm run test Button.test.tsx
npm run test Input.test.tsx
npm run test Select.test.tsx

# Integration tests
npm run test:integration
```

### Storybook Development

```bash
# Iniciar Storybook
npm run storybook

# Build storybook
npm run build-storybook
```

Navegar a `http://localhost:6006` para ver:
- Button stories (15+ casos)
- Input stories (20+ casos)
- Select stories (18+ casos)

### Debugging

```tsx
// Debug theme state
console.log('Current theme:', currentTheme);
console.log('History:', history);
console.log('Can undo:', canUndo, 'Can redo:', canRedo);

// Debug CSS variables
const root = document.documentElement;
console.log('CSS vars:', {
  primary: root.style.getPropertyValue('--colors-primary'),
  background: root.style.getPropertyValue('--colors-background')
});

// Debug performance
performance.mark('theme-update-start');
updateTheme(newTheme);
performance.mark('theme-update-end');
console.log(performance.getEntriesByType('measure'));
```

---

## ⚡ Performance Best Practices

### Usar Componentes Memoizados

```tsx
// ✅ Para listas o componentes que re-renderizan frecuentemente
import { MemoizedButton, MemoizedInput, MemoizedSelect } from './design-system';

function ThemeForm() {
  return (
    <>
      {/* Para forms con muchos campos */}
      <MemoizedInput type="text" value={name} onChange={setName} />
      <MemoizedSelect options={themes} value={theme} onChange={setTheme} />
      <MemoizedButton onClick={save}>Save</MemoizedButton>
    </>
  );
}
```

### Evitar Re-renders Innecesarios

```tsx
// ✅ Memoizar callbacks costosos
const handleThemeChange = useCallback((newTheme) => {
  updateTheme(newTheme);
}, [updateTheme]);

// ✅ Memoizar computaciones complejas
const processedColors = useMemo(() => {
  return convertColorsToOKLCH(currentTheme.colors);
}, [currentTheme.colors]);

// ❌ Evitar crear objetos en render
// Malo:
<Button style={{ backgroundColor: theme.primary }}>

// Bueno:
const buttonStyle = useMemo(() => ({
  backgroundColor: theme.primary
}), [theme.primary]);
<Button style={buttonStyle}>
```

### Batch Updates

```tsx
// ✅ Agrupar múltiples cambios
const applyThemePreset = (preset) => {
  updateTheme({
    ...currentTheme,
    ...preset.colors,
    ...preset.typography,
    ...preset.spacing
  }); // Una sola actualización
};

// ❌ Evitar múltiples updates consecutivos
updateTheme({ colors: newColors });     // Re-render 1
updateTheme({ typography: newTypo });   // Re-render 2
updateTheme({ spacing: newSpacing });   // Re-render 3
```

---

## 🐛 Common Issues y Solutions

### Issue: Theme No Se Aplica

**Problema**: CSS variables no se aplican a componentes

**Solución**:
```tsx
// Verificar que ThemeEditorContext envuelve tu app
function App() {
  return (
    <ThemeEditorProvider>  {/* ← Debe envolver toda la app */}
      <YourComponents />
    </ThemeEditorProvider>
  );
}

// Verificar CSS variables están disponibles
const root = document.documentElement;
console.log(root.style.getPropertyValue('--colors-primary')); // Debe retornar color
```

### Issue: Components No Re-render

**Problema**: UI no actualiza cuando theme cambia

**Solución**:
```tsx
// Asegurar usar useThemeEditor hook
const { currentTheme } = useThemeEditor();

// O subscribirse manualmente a cambios
useEffect(() => {
  // Tu lógica de actualización
}, [currentTheme]);
```

### Issue: Performance Lenta

**Problema**: App lenta al cambiar theme

**Solución**:
```tsx
// 1. Usar componentes memoizados
<MemoizedButton /> // En lugar de <Button />

// 2. Evitar inline styles
// ❌ Malo
<div style={{ backgroundColor: currentTheme.colors.primary }}>

// ✅ Bueno
<div style={{ backgroundColor: 'var(--colors-primary)' }}>
```

### Issue: TypeScript Errors

**Problema**: Errores de types en theme properties

**Solución**:
```tsx
// Importar types correctos
import type { ThemeConfig } from '../core/types/theme.types';

// Extender types si necesario
declare module '../core/types/theme.types' {
  interface ThemeConfig {
    customProperty?: string;
  }
}
```

### Issue: Export No Funciona

**Problema**: Botones de export no descargan archivos

**Solución**:
```tsx
// Verificar permisos de descarga en navegador
// Usar función de export existente
import { exportTheme } from '../theme-editor/export/ExportUtils';

const handleExport = () => {
  exportTheme('css'); // Usa función existente probada
};
```

---

## 📋 Checklist de Integration

### ✅ Setup Completo

- [ ] Theme Editor ejecutándose en localhost
- [ ] Color picker funciona
- [ ] Light/Dark toggle funciona
- [ ] Export descarga archivos
- [ ] Undo/Redo responde
- [ ] Preview tabs actualizan

### ✅ Integration en tu App

- [ ] `ThemeEditorProvider` envuelve tu app
- [ ] `useThemeEditor` hook funciona
- [ ] CSS variables se aplican
- [ ] Components usan theme colors
- [ ] Theme persiste en localStorage

### ✅ Testing

- [ ] Tests unitarios pasan (`npm run test`)
- [ ] Storybook carga (`npm run storybook`)
- [ ] No errores TypeScript
- [ ] No warnings ESLint
- [ ] Performance acceptable

### ✅ Production Ready

- [ ] Build successful (`npm run build`)
- [ ] Bundle size acceptable
- [ ] No console errors
- [ ] Accessibility compliance
- [ ] Mobile responsive

---

## 🚀 Next Steps: Después de Integration

### Una vez Theme Editor funcionando:

1. **Personalizar**: Agregar tus propios presets de theme
2. **Extender**: Crear componentes que usen CSS variables
3. **Integrar**: Conectar con tu design system
4. **Deploy**: Preparar para producción

### Para contribuir al proyecto:

⚠️ **IMPORTANTE**: Leer `THEME-EDITOR-DEVELOPMENT-RULES.md` antes de cualquier modificación.

**Golden Rule**: _"If it works, DON'T BREAK IT"_

---

## 📞 Support

### Si algo no funciona:

1. **Verificar setup**: Seguir esta guía paso a paso
2. **Revisar console**: Buscar errores JavaScript
3. **Comprobar dependencies**: `npm install`
4. **Reset localStorage**: Borrar cache de theme
5. **Restart dev server**: `npm run dev`

### Archivos de referencia:

- `CURRENT-FUNCTIONALITY-GUIDE.md` - Funcionalidades disponibles
- `THEME-EDITOR-DEVELOPMENT-RULES.md` - Reglas críticas
- `/design-system/atoms/*.md` - API documentation
- `/__tests__/` - Tests como ejemplos de uso

---

**🎯 Resultado Final**: Theme Editor 3.0 completamente funcional e integrado en tu aplicación, listo para personalizar themes de forma visual e interactiva.