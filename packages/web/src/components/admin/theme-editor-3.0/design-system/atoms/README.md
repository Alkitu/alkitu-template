# Button Atom

## Descripción
El Button atom es una implementación inspirada en shadcn/ui que se integra completamente con las variables globales del Theme Editor 3.0. Usa estilos inline para garantizar que funcione correctamente y se vea como botones reales con sus cajas contenedoras.

## Características

### 🎨 Integración Completa del Tema
- **Tipografía**: Usa las variables globales de font-family, font-size, font-weight, letter-spacing y line-height
- **Colores**: Se adapta automáticamente a los colores OKLCH definidos en el Theme Editor
- **Border Radius**: Usa la variable global `--radius` del Theme Editor  
- **Spacing**: Usa las variables globales de spacing (`--spacing-small`, `--spacing-medium`, `--spacing-large`)
- **Shadows**: Integra las variables globales de sombras del Theme Editor

### 🎯 Estilo Real de Botón
- Usa estilos inline para garantizar renderizado correcto
- Cajas contenedoras reales con padding, background y borders
- Estados hover interactivos con transiciones suaves
- Cursor pointer y efectos visuales apropiados

## Variantes Disponibles

### Variant Props
- `default` - Botón primary con colores de marca
- `secondary` - Botón secundario con colores menos prominentes  
- `destructive` - Botón para acciones destructivas (eliminar, etc.)
- `outline` - Botón con borde y fondo transparente
- `ghost` - Botón sin fondo, solo texto
- `link` - Botón que parece un enlace con subrayado

### Size Props  
- `sm` - Tamaño pequeño (height: 2.25rem)
- `default` - Tamaño estándar (height: 2.5rem) 
- `lg` - Tamaño grande (height: 2.75rem)
- `icon` - Tamaño cuadrado para iconos (2.5rem × 2.5rem)

## Ejemplos de Uso

### Básico
```tsx
import { Button } from '../atoms/Button';

<Button variant="default">Click me</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
```

### Con iconos
```tsx
import { Mail, Download } from 'lucide-react';

<Button>
  <Mail className="mr-2 h-4 w-4" />
  Login with Email
</Button>

<Button size="icon">
  <Download className="h-4 w-4" />
</Button>
```

### Loading state
```tsx
import { Loader2 } from 'lucide-react';

<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Please wait
</Button>
```

### Full width
```tsx
<Button className="w-full">Full Width Button</Button>
```

## Variables CSS Utilizadas

### Tipografía
- `--typography-paragraph-font-family`
- `--typography-paragraph-font-size` 
- `--typography-paragraph-font-weight`
- `--typography-paragraph-letter-spacing`
- `--typography-paragraph-line-height`

### Colores (OKLCH)
- `oklch(var(--primary))` / `oklch(var(--primary-foreground))`
- `oklch(var(--secondary))` / `oklch(var(--secondary-foreground))`
- `oklch(var(--destructive))` / `oklch(var(--destructive-foreground))`
- `oklch(var(--accent))` / `oklch(var(--accent-foreground))`
- `oklch(var(--background))` / `oklch(var(--foreground))`
- `oklch(var(--border))`

### Spacing
- `--spacing-small` (padding para size="sm")
- `--spacing-medium` (padding para size="default")
- `--spacing-large` (padding para size="lg")

### Otros
- `--radius` (border radius global)
- `--shadow-small` (sombras)

## Accesibilidad

- ✅ Soporte completo de teclado (focus-visible)
- ✅ Estados disabled apropiados
- ✅ Respeta `prefers-reduced-motion`
- ✅ Optimizado para dispositivos táctiles
- ✅ Contraste adecuado en modo claro/oscuro

## Arquitectura

```
atoms/Button/
├── Button.tsx          # Componente principal
├── Button.css          # Estilos CSS con variables del tema
└── README.md          # Documentación
```

## Dependencias

- `class-variance-authority` - Para gestión de variantes
- `clsx` + `tailwind-merge` - Para combinación de clases CSS
- `lucide-react` - Para iconos (opcional)

## Notas de Desarrollo

Este Button atom está diseñado para ser completamente independiente pero totalmente integrado con el Theme Editor. Cualquier cambio en las variables globales del tema se reflejará automáticamente en todos los botones sin necesidad de modificar el código.

El componente sigue las mejores prácticas de shadcn/ui mientras mantiene la flexibilidad para adaptarse a las necesidades específicas del Theme Editor 3.0.