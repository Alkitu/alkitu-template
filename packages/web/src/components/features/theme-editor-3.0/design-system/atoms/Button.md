# Button Component API Documentation

> **Documentación del estado ACTUAL del Button component** - ETAPA 5: Documentation & Polish
>
> Esta documentación refleja la implementación EXISTENTE sin modificaciones

## Descripción

El Button component es un elemento interactivo que permite a los usuarios realizar acciones mediante clics o navegación por teclado. Incluye soporte completo para accesibilidad, estados de carga, iconos y múltiples variantes visuales.

## Importación

```typescript
// Componente original
import { Button } from './Button';

// Versión optimizada con React.memo (ETAPA 3)
import { MemoizedButton } from './Button';
```

## Props Interface

```typescript
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // Props visuales
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'loading' | 'icon';
  size?: 'default' | 'sm' | 'lg' | 'icon';

  // Props de estado
  loading?: boolean;
  icon?: React.ReactNode;

  // Props de accesibilidad (agregadas en ETAPA 2)
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-live'?: 'off' | 'polite' | 'assertive';
}
```

## Variantes Disponibles

### Visual Variants
- **`default`** - Botón primario con fondo sólido
- **`outline`** - Botón con borde y fondo transparente
- **`ghost`** - Botón sin borde con fondo transparente al hover
- **`destructive`** - Botón para acciones destructivas (rojo)
- **`secondary`** - Botón secundario con colores atenuados
- **`loading`** - Variante especial para estado de carga
- **`icon`** - Variante optimizada para botones solo-icono

### Size Variants
- **`sm`** - Pequeño: 36px altura, 12px padding
- **`default`** - Estándar: 40px altura, 16px padding
- **`lg`** - Grande: 44px altura, 20px padding, fontSize aumentado
- **`icon`** - Cuadrado: 40x40px, padding 0

## Estados de Componente

### Loading State
```typescript
<Button loading={true} variant="default">
  Saving... {/* Automáticamente muestra spinner */}
</Button>
```

Cuando `loading={true}`:
- Muestra spinner animado automáticamente
- Establece `aria-busy="true"`
- Desactiva interacciones del usuario
- Mantiene el texto del botón visible

### Disabled State
```typescript
<Button disabled={true}>
  Disabled Button
</Button>
```

Cuando `disabled={true}`:
- Aplica opacidad 0.5
- Establece cursor: not-allowed
- Establece `aria-disabled="true"`
- Previene eventos de clic

### Icon Integration
```typescript
// Con icono y texto
<Button icon={<Icon />} variant="default">
  Action Text
</Button>

// Solo icono
<Button icon={<Icon />} variant="icon" size="icon" aria-label="Action description" />
```

## Características de Accesibilidad (ETAPA 2)

### WCAG 2.1 AA Compliance
- **Navegación por teclado**: Enter y Espacio activan el botón
- **Focus indicators**: Anillos de enfoque con colores de alto contraste
- **Screen reader support**: Etiquetas automáticas para botones de solo-icono
- **Estado comunicado**: `aria-busy`, `aria-disabled`, `aria-live`

### Auto-generated Accessibility
```typescript
// Para botones icon sin aria-label
<Button variant="icon" icon={<HomeIcon />} />
// Automáticamente agrega: aria-label="Button"

// Para estados de loading
<Button loading={true} />
// Automáticamente agrega: aria-busy="true", aria-live="polite"
```

## Performance Optimization (ETAPA 3)

### MemoizedButton
Versión optimizada con React.memo() que previene re-renders innecesarios:

```typescript
import { MemoizedButton } from './Button';

// Misma API, mejor performance
<MemoizedButton variant="default" loading={isLoading}>
  Optimized Button
</MemoizedButton>
```

**Criterios de memoización:**
- Compara props críticas: `variant`, `size`, `loading`, `disabled`
- Comparación profunda de `children`
- Optimizado para workflows del Theme Editor

## Integración con Theme System

### CSS Variables Utilizadas
```css
/* Typography */
--typography-paragraph-font-family
--typography-paragraph-font-size
--typography-paragraph-letter-spacing

/* Colores (aplicados automáticamente por variantes) */
--colors-primary
--colors-destructive
--colors-secondary
--colors-muted

/* Radius */
--radius-button (fallback a --radius)
```

### Theme Color Classes
El componente usa clases de Tailwind que respetan el sistema de colores:
- `bg-primary text-primary-foreground`
- `bg-destructive text-destructive-foreground`
- `hover:bg-primary/90`

## Ejemplos de Uso Real

### Formulario con Validación
```typescript
// Estado inicial
<Button variant="outline" disabled={!isFormValid}>
  Save Theme
</Button>

// Durante envío
<Button variant="default" loading={true} disabled={true}>
  Saving Theme...
</Button>

// Éxito
<Button variant="default" onClick={handleSuccess}>
  Theme Saved!
</Button>

// Error
<Button variant="destructive" onClick={handleRetry}>
  Retry Save
</Button>
```

### Theme Editor Actions
```typescript
// Botones de acción del editor
<Button variant="ghost" size="sm" icon={<ColorIcon />}>
  Pick Color
</Button>

<Button variant="outline" size="default">
  Preview Theme
</Button>

<Button variant="default" type="submit">
  Apply Theme
</Button>

// Botón de reset
<Button variant="destructive" onClick={handleReset}>
  Reset to Default
</Button>
```

### Accessibility-First Design
```typescript
// Navegación por teclado
<Button
  variant="icon"
  size="icon"
  aria-label="Toggle dark mode"
  aria-pressed={isDarkMode ? 'true' : 'false'}
  onKeyDown={handleKeyboardNavigation}
>
  🌙
</Button>

// Con descripción adicional
<Button
  variant="default"
  aria-describedby="save-theme-help"
  loading={isSaving}
>
  Save Custom Theme
</Button>
```

## Event Handlers Soportados

Hereda todos los event handlers de `HTMLButtonElement`:

```typescript
<Button
  onClick={handleClick}
  onFocus={handleFocus}  // Mejorado con focus ring
  onBlur={handleBlur}    // Mejorado con focus ring
  onKeyDown={handleKey}  // Mejorado con Enter/Space
  onMouseEnter={handleHover}
  onMouseLeave={handleLeave}
>
  Interactive Button
</Button>
```

## Form Integration

```typescript
// Submit button
<Button type="submit" variant="default">
  Submit Form
</Button>

// Reset button
<Button type="reset" variant="outline">
  Reset Form
</Button>

// Con form attributes
<Button
  type="submit"
  form="theme-editor-form"
  formAction="/api/themes"
  formMethod="post"
>
  Save Theme
</Button>
```

## Styling Customization

### Custom Classes
```typescript
<Button
  className="custom-theme-button"
  variant="default"
>
  Custom Styled
</Button>
```

### Custom Styles
```typescript
<Button
  style={{
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  }}
  variant="outline"
>
  Custom Styled
</Button>
```

## Testing Support (ETAPA 4)

El componente está completamente probado con:
- **49 pruebas de edge cases** cubriendo todas las combinaciones
- **Performance tests** para versiones memoizadas
- **Accessibility tests** para WCAG compliance
- **Integration tests** para workflows reales

## Notas de Implementación

### Focus Management
- Focus ring personalizable por CSS variable `--focus-ring-color`
- Colores adaptativos según variante del botón
- Offset de 2px para mejor visibilidad

### Loading Spinner
- SVG animado con `animate-spin`
- Tamaño responsive según `size` prop
- Colores heredados de la variante del botón

### Backward Compatibility
- 100% compatible con versiones anteriores
- No breaking changes introducidos
- API estable y consistente

---

**Versión documentada**: Theme Editor 3.0
**Fecha**: Enero 2025
**Estado**: Production Ready con ETAPA 2-4 completadas