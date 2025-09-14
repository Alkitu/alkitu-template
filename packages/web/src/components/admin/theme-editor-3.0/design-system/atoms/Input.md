# Input Component API Documentation

> **Documentación del estado ACTUAL del Input component** - ETAPA 5: Documentation & Polish
>
> Esta documentación refleja la implementación EXISTENTE sin modificaciones

## Descripción

El Input component es un campo de entrada de datos con soporte completo para validación, iconos, estados visuales y accesibilidad. Incluye funcionalidad especializada para campos de contraseña con toggle de visibilidad.

## Importación

```typescript
// Componente original
import { Input } from './Input';

// Versión optimizada con React.memo (ETAPA 3)
import { MemoizedInput } from './Input';
```

## Props Interface

```typescript
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // Props visuales
  variant?: 'default' | 'error' | 'success' | 'warning' | 'ghost' | 'filled';
  inputSize?: 'sm' | 'default' | 'lg';

  // Props de estado/validación
  isInvalid?: boolean;
  isValid?: boolean;
  isWarning?: boolean;

  // Props de iconos
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;

  // Props de accesibilidad (agregadas en ETAPA 2)
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
}
```

## Variantes Visuales

### Base Variants
- **`default`** - Campo estándar con borde y fondo claro
- **`error`** - Campo con bordes y focus rojos para errores
- **`success`** - Campo con bordes y focus verdes para validación exitosa
- **`warning`** - Campo con bordes y focus amarillos para advertencias
- **`ghost`** - Campo transparente que se activa al focus
- **`filled`** - Campo con fondo gris que se despeja al focus

### Size Variants
- **`sm`** - Pequeño: 36px altura, 12px padding, 14px font
- **`default`** - Estándar: 40px altura, 16px padding, 14px font
- **`lg`** - Grande: 48px altura, 20px padding, 16px font

## Estados de Validación

### Sistema de Prioridad Automática
El componente determina la variante visual según esta prioridad:
1. `isInvalid` → `error` variant (prioridad máxima)
2. `isWarning` → `warning` variant
3. `isValid` → `success` variant
4. Default → `variant` prop o `default`

```typescript
// Error tiene máxima prioridad
<Input
  isInvalid={true}
  isValid={true}      // Ignorado
  isWarning={true}    // Ignorado
  variant="default"   // Ignorado
  // Resultado: variant="error"
/>
```

### Validation Examples
```typescript
// Estado inicial
<Input
  placeholder="Enter theme name"
  variant="default"
/>

// Error de validación
<Input
  placeholder="Enter theme name"
  isInvalid={true}
  aria-describedby="name-error"
/>

// Validación exitosa
<Input
  placeholder="Enter theme name"
  isValid={true}
  value="My Custom Theme"
/>

// Advertencia
<Input
  placeholder="Enter theme name"
  isWarning={true}
  aria-describedby="name-warning"
/>
```

## Tipos de Input Soportados

### Tipos Básicos
```typescript
<Input type="text" />        // Por defecto
<Input type="email" />       // Email con validación HTML5
<Input type="password" />    // Contraseña (se puede combinar con showPasswordToggle)
<Input type="number" />      // Número con controles
<Input type="tel" />         // Teléfono
<Input type="url" />         // URL con validación HTML5
<Input type="search" />      // Búsqueda con estilo especial
```

### Tipos Especializados
```typescript
<Input type="date" />        // Selector de fecha
<Input type="time" />        // Selector de tiempo
<Input type="color" />       // Selector de color (útil para Theme Editor)
<Input type="file" />        // Upload de archivos
<Input type="range" />       // Slider
```

## Funcionalidad de Iconos

### Left Icon
```typescript
<Input
  leftIcon={<SearchIcon />}
  placeholder="Search themes..."
  type="search"
/>

// Con tamaños
<Input
  leftIcon={<UserIcon />}
  inputSize="lg"
  placeholder="Username"
/>
```

### Right Icon
```typescript
<Input
  rightIcon={<CheckIcon />}
  isValid={true}
  placeholder="Validated input"
/>

// Ambos iconos
<Input
  leftIcon={<UserIcon />}
  rightIcon={<CheckIcon />}
  placeholder="User validated"
/>
```

### Password Toggle
Funcionalidad especializada para campos de contraseña:

```typescript
<Input
  type="password"
  showPasswordToggle={true}
  placeholder="Enter password"
/>
```

**Comportamiento del Password Toggle:**
- Botón automático con iconos Eye/EyeOff de Lucide
- Alterna entre `type="password"` y `type="text"`
- `aria-label` automático: "Show password" / "Hide password"
- `tabIndex={-1}` para mantener focus en el input
- Compatible con todos los tamaños e iconos izquierdos

## Características de Accesibilidad (ETAPA 2)

### WCAG 2.1 AA Compliance
- **Auto-generated labels**: Etiquetas automáticas por tipo de input
- **Validation states**: `aria-invalid` automático basado en `isInvalid`
- **Focus indicators**: Anillos de enfoque adaptativos al estado de validación
- **Screen reader support**: Anuncios automáticos de cambios de estado

### Auto-generated Accessibility
```typescript
// Email input sin aria-label
<Input type="email" />
// Automáticamente agrega: aria-label="Email address"

// Password input
<Input type="password" />
// Automáticamente agrega: aria-label="Password"

// Search input
<Input type="search" />
// Automáticamente agrega: aria-label="Search"

// Validation state
<Input isInvalid={true} />
// Automáticamente agrega: aria-invalid="true"
```

### Manual Accessibility Override
```typescript
<Input
  type="email"
  aria-label="Primary email address"  // Sobrescribe auto-generado
  aria-describedby="email-help"
  aria-required={true}
/>
```

## Performance Optimization (ETAPA 3)

### MemoizedInput
Versión optimizada con React.memo() que evita re-renders:

```typescript
import { MemoizedInput } from './Input';

<MemoizedInput
  type="text"
  value={themeValue}
  onChange={handleChange}
/>
```

**Criterios de memoización optimizados:**
- Props críticas: `type`, `value`, `variant`, `inputSize`, estados de validación
- Iconos: `leftIcon`, `rightIcon`, `showPasswordToggle`
- Event handlers: `onChange`, `onFocus`, `onBlur`

## Integración con Theme System

### CSS Variables Utilizadas
```css
/* Typography */
--typography-paragraph-font-family
--typography-paragraph-font-size
--typography-paragraph-letter-spacing

/* Border radius */
--radius-input (fallback a --radius)

/* Colores dinámicos por variante */
--colors-primary      /* default, focus states */
--colors-destructive  /* error variant */
--colors-success      /* success variant */
--colors-warning      /* warning variant */
--colors-muted        /* filled variant */
```

### Theme Color Classes
```css
/* Default variant */
bg-background text-foreground border-input
hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20

/* Error variant */
bg-background text-foreground border-destructive
hover:border-destructive/70 focus:border-destructive focus:ring-2 focus:ring-destructive/20

/* Success variant */
bg-background text-foreground border-success
hover:border-success/70 focus:border-success focus:ring-2 focus:ring-success/20
```

## Ejemplos de Uso Real

### Theme Editor Color Input
```typescript
<Input
  type="color"
  value={primaryColor}
  onChange={(e) => setPrimaryColor(e.target.value)}
  aria-label="Primary theme color"
  leftIcon={<PaletteIcon />}
/>
```

### Theme Name with Validation
```typescript
// Estado inicial
<Input
  type="text"
  placeholder="Enter theme name"
  variant="default"
/>

// Validando...
<Input
  type="text"
  placeholder="Enter theme name"
  value="M"
  isWarning={true}
  aria-describedby="name-warning"
/>

// Validación exitosa
<Input
  type="text"
  placeholder="Enter theme name"
  value="My Beautiful Theme"
  isValid={true}
  aria-describedby="name-success"
/>
```

### Search Functionality
```typescript
<Input
  type="search"
  placeholder="Search themes..."
  leftIcon={<SearchIcon />}
  rightIcon={searchQuery && <ClearIcon onClick={clearSearch} />}
  value={searchQuery}
  onChange={handleSearch}
/>
```

### Password with Security
```typescript
<Input
  type="password"
  placeholder="Theme access password"
  showPasswordToggle={true}
  leftIcon={<LockIcon />}
  isInvalid={!isPasswordValid}
  aria-describedby="password-requirements"
/>
```

### File Upload for Theme Import
```typescript
<Input
  type="file"
  accept=".json,.theme"
  aria-label="Import theme file"
  onChange={handleThemeImport}
/>
```

## Form Integration

### Controlled Components
```typescript
const [value, setValue] = useState('');

<Input
  type="text"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Controlled input"
/>
```

### Uncontrolled Components
```typescript
<Input
  type="text"
  defaultValue="Initial theme name"
  placeholder="Uncontrolled input"
/>
```

### Form Validation
```typescript
<Input
  type="email"
  required={true}
  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
  aria-describedby="email-error"
  isInvalid={!isEmailValid}
/>
```

## Event Handlers Soportados

Hereda todos los event handlers de `HTMLInputElement` con mejoras:

```typescript
<Input
  type="text"
  onChange={handleChange}
  onFocus={handleFocusWithRing}    // Mejorado con focus ring
  onBlur={handleBlurWithRing}      // Mejorado con focus ring
  onKeyDown={handleKeyPress}
  onInput={handleInput}
  onSelect={handleTextSelection}
/>
```

## Responsive Design

### Tamaños Adaptativos
```typescript
// Mobile
<Input inputSize="sm" type="text" placeholder="Mobile friendly" />

// Desktop
<Input inputSize="lg" type="text" placeholder="Desktop optimized" />

// Responsive con CSS
<Input
  className="w-full sm:w-auto"
  type="text"
  placeholder="Responsive width"
/>
```

## Error Handling

### Visual Error States
```typescript
// Error con mensaje
<div>
  <Input
    type="email"
    isInvalid={true}
    aria-describedby="email-error"
    placeholder="Enter email"
  />
  <div id="email-error" className="text-destructive text-sm">
    Please enter a valid email address
  </div>
</div>
```

### Progressive Validation
```typescript
const [email, setEmail] = useState('');
const [emailState, setEmailState] = useState<'default' | 'warning' | 'invalid' | 'valid'>('default');

<Input
  type="email"
  value={email}
  onChange={handleEmailChange}
  isInvalid={emailState === 'invalid'}
  isWarning={emailState === 'warning'}
  isValid={emailState === 'valid'}
  aria-describedby={`email-${emailState}`}
/>
```

## Testing Support (ETAPA 4)

El componente incluye:
- **59 pruebas de edge cases** cubriendo todos los tipos y estados
- **Performance tests** para MemoizedInput
- **Accessibility tests** para WCAG compliance
- **Integration tests** con workflows de validación reales

## Limitaciones Conocidas

### Browser Compatibility
- `type="color"` requiere fallback para browsers antiguos
- `type="date"` rendering varía entre browsers
- Password toggle requiere JavaScript habilitado

### Styling Constraints
- Iconos se posicionan absolutamente (requieren espacio reservado)
- Focus ring puede superponerse con contenido cercano
- Altura fija por tamaño (no flex-height)

---

**Versión documentada**: Theme Editor 3.0
**Fecha**: Enero 2025
**Estado**: Production Ready con ETAPA 2-4 completadas