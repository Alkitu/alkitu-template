# Plan Detallado: Migración a Design System Unificado

> Plan completo de migración para consolidar 3 sistemas de componentes en uno solo siguiendo Atomic Design y mejores prácticas

**Fecha de creación:** {{DATE}}
**Estado:** 📋 Planificación
**Progreso:** 0/92 componentes (0%)

---

## Tabla de Contenidos

1. [Análisis de Enfoques](#análisis-de-enfoques)
2. [Tabla Maestra de Acciones](#tabla-maestra-de-acciones)
3. [Plan de Ejecución por Fases](#plan-de-ejecución-por-fases)
4. [Estructura de Folders y Mejores Prácticas](#estructura-de-folders-y-mejores-prácticas)
5. [Testing y Validación](#testing-y-validación)
6. [Riesgos y Mitigación](#riesgos-y-mitigación)

---

## Análisis de Enfoques

### Contexto Actual

**Problema:** Tenemos 3 sistemas de componentes separados:

- **`/ui/`** - shadcn/ui (58 archivos)
- **`/`** - Atomic Design (115 archivos)
- **`/theme-editor-3.0/design-system/`** - Theme Editor DS (105 archivos)

**Duplicación:** ~120 archivos (25% del total)

### Enfoque A: "Atomic-Design Primero"

**Descripción:** Usar `` como base, adaptar theme-editor.

**Pros:**

- ✅ Estructura de folders organizada (Button/Button.tsx, Button.test.tsx, etc.)
- ✅ Tests + Stories ya existen
- ✅ Mejores prácticas desde el inicio
- ✅ Separación clara por niveles
- ✅ Storybook funcionando

**Contras:**

- ❌ Theme-editor debe adaptarse significativamente
- ❌ Riesgo de romper theme-editor
- ❌ Componentes actuales NO son themables
- ❌ Requiere refactorizar theme-editor

**Puntuación:** 6/10

### Enfoque B: "Theme-Editor Primero"

**Descripción:** Usar theme-editor como base, adaptar todo a él.

**Pros:**

- ✅ Theme-editor funciona perfectamente ahora
- ✅ Componentes son themables (CSS vars)
- ✅ Menos riesgo de romper funcionalidad
- ✅ Primitives optimizados para theming
- ✅ Preview ya funciona

**Contras:**

- ❌ Estructura plana (no sigue mejores prácticas)
- ❌ Sin tests ni stories organizados
- ❌ Difícil de mantener
- ❌ No sigue convención de folders

**Puntuación:** 5/10

### Enfoque C (RECOMENDADO): "Híbrido"

**Descripción:** Combinar código themable de theme-editor + estructura organizada de atomic-design.

**Pros:**

- ✅ Componentes themables (theme-editor)
- ✅ Estructura organizada (atomic-design)
- ✅ Tests + Stories completos
- ✅ Fácil de mantener
- ✅ Theme-editor sigue funcionando
- ✅ Mejores prácticas aplicadas
- ✅ Lo mejor de ambos mundos

**Contras:**

- ⚠️ Requiere refactorizar estructura de archivos
- ⚠️ Más trabajo inicial

**Puntuación:** 9/10 ⭐ **ELEGIDO**

### Comparación Final

| Aspecto        | Atomic First | Theme-Editor First | **Híbrido (✅)** |
| -------------- | ------------ | ------------------ | ---------------- |
| Estructura     | ✅           | ❌                 | ✅               |
| Tests          | ✅           | ❌                 | ✅               |
| Stories        | ✅           | ❌                 | ✅               |
| Theming        | ❌           | ✅                 | ✅               |
| Riesgo         | 🔴 Alto      | 🟢 Bajo            | 🟡 Medio         |
| Mantenibilidad | ✅           | ❌                 | ✅               |
| Tiempo         | 12-15h       | 8-10h              | 10-13h           |
| **Resultado**  | Bueno        | Funcional          | **Excelente**    |

---

## Tabla Maestra de Acciones

### Leyenda

- **FUSIONAR** - Combinar implementaciones de múltiples ubicaciones
- **MOVER** - Trasladar componente único a nueva ubicación
- **ELIMINAR** - Borrar archivos duplicados o legacy

**Prioridades:**

- 🔴 Alta - Componentes críticos, más usados
- 🟡 Media - Componentes importantes, uso moderado
- 🟢 Baja - Componentes menos críticos

### FASE 1: PRIMITIVES (50 componentes)

| #     | Componente  | Origen                             | Acción   | Destino                               | Prioridad | Notas                             |
| ----- | ----------- | ---------------------------------- | -------- | ------------------------------------- | --------- | --------------------------------- |
| 1     | Button      | `ui/` + `theme-editor/primitives/` | FUSIONAR | `design-system/primitives/Button/`    | 🔴        | Más usado en el proyecto          |
| 2     | Card        | `ui/` + `theme-editor/primitives/` | FUSIONAR | `design-system/primitives/Card/`      | 🔴        | Componente base crítico           |
| 3     | Input       | `ui/` + `theme-editor/primitives/` | FUSIONAR | `design-system/primitives/Input/`     | 🔴        | Input themable esencial           |
| 4     | Select      | `ui/` + `theme-editor/primitives/` | FUSIONAR | `design-system/primitives/Select/`    | 🔴        | Select con subcomponentes         |
| 5     | Dialog      | `ui/` + `theme-editor/primitives/` | FUSIONAR | `design-system/primitives/Dialog/`    | 🟡        | Modal system                      |
| 6     | Accordion   | `ui/` + `theme-editor/primitives/` | FUSIONAR | `design-system/primitives/Accordion/` | 🟡        | Accordion themable                |
| 7     | Tabs        | `ui/` + `theme-editor/primitives/` | FUSIONAR | `design-system/primitives/Tabs/`      | 🟡        | Tabs themable                     |
| 8     | Dropdown    | `ui/` + `theme-editor/primitives/` | FUSIONAR | `design-system/primitives/Dropdown/`  | 🟡        | Dropdown menu                     |
| 9     | Popover     | `ui/` + `theme-editor/primitives/` | FUSIONAR | `design-system/primitives/Popover/`   | 🟡        | Popover system                    |
| 10    | Tooltip     | `ui/` + `theme-editor/primitives/` | FUSIONAR | `design-system/primitives/Tooltip/`   | 🟡        | Tooltip themable                  |
| 11-50 | ...otros 40 | `ui/` + `theme-editor/primitives/` | FUSIONAR | `design-system/primitives/X/`         | 🟢        | Ver lista completa en tracking.md |

### FASE 2: ATOMS (17 componentes)

| #   | Componente         | Origen                                        | Acción   | Destino                            | Prioridad | Notas                            |
| --- | ------------------ | --------------------------------------------- | -------- | ---------------------------------- | --------- | -------------------------------- |
| 51  | Badge              | `atoms/badge/` + `theme-editor/atoms/`        | FUSIONAR | `design-system/atoms/Badge/`       | 🔴        | Mantener tests + código themable |
| 52  | badges (duplicado) | `atoms/badges/`                               | ELIMINAR | -                                  | 🔴        | Duplicado de badge/              |
| 53  | Avatar             | `atoms/avatars/` + `theme-editor/atoms/`      | FUSIONAR | `design-system/atoms/Avatar/`      | 🟡        | Fusionar implementaciones        |
| 54  | Spinner            | `atoms/spinners/` + `theme-editor/atoms/`     | FUSIONAR | `design-system/atoms/Spinner/`     | 🟡        | Loading spinners                 |
| 55  | Toggle             | `atoms/toggle/` + `theme-editor/atoms/`       | FUSIONAR | `design-system/atoms/Toggle/`      | 🟡        | Toggle switch                    |
| 56  | Separator          | `atoms/separator/` + `shared/`                | FUSIONAR | `design-system/atoms/Separator/`   | 🟢        | Eliminar de shared               |
| 57  | Typography         | `atoms/typography/`                           | MOVER    | `design-system/atoms/Typography/`  | 🟡        | Único en atomic, mover completo  |
| 58  | CustomIcon         | `atoms/custom-icon/` + `theme-editor/atoms/`  | FUSIONAR | `design-system/atoms/CustomIcon/`  | 🟢        | Iconos personalizados            |
| 59  | Icons              | `atoms/icons/`                                | MOVER    | `design-system/atoms/Icons/`       | 🟡        | Sistema de iconos                |
| 60  | Brand              | `atoms/brands/`                               | MOVER    | `design-system/atoms/Brand/`       | 🟢        | Brand components                 |
| 61  | Alert              | `atoms/alert/` + `theme-editor/atoms/`        | FUSIONAR | `design-system/atoms/Alert/`       | 🟡        | Alertas themables                |
| 62  | Checkbox           | `atoms/checkbox/` + `theme-editor/atoms/`     | FUSIONAR | `design-system/atoms/Checkbox/`    | 🟡        | Checkboxes                       |
| 63  | RadioButton        | `atoms/radio-button/` + `theme-editor/atoms/` | FUSIONAR | `design-system/atoms/RadioButton/` | 🟡        | Radio buttons                    |
| 64  | ProgressBar        | `atoms/progress-bar/` + `theme-editor/atoms/` | FUSIONAR | `design-system/atoms/ProgressBar/` | 🟢        | Progress bars                    |
| 65  | Slider             | `atoms/slider/` + `theme-editor/atoms/`       | FUSIONAR | `design-system/atoms/Slider/`      | 🟢        | Sliders                          |
| 66  | Spacer             | `atoms/spacer/` + `theme-editor/atoms/`       | FUSIONAR | `design-system/atoms/Spacer/`      | 🟢        | Spacers                          |
| 67  | Tabs (atom)        | `atoms/tabs/`                                 | MOVER    | `design-system/atoms/Tabs/`        | 🟢        | Tab atom variant                 |

### FASE 3: MOLECULES (11 componentes)

| #   | Componente      | Origen                                                   | Acción   | Destino                                   | Prioridad | Notas                  |
| --- | --------------- | -------------------------------------------------------- | -------- | ----------------------------------------- | --------- | ---------------------- |
| 68  | Card            | `molecules/Card/` + `theme-editor/molecules/`            | FUSIONAR | `design-system/molecules/Card/`           | 🔴        | Card molecule          |
| 69  | DropdownMenu    | `molecules/dropdown-menu/` + `theme-editor/molecules/`   | FUSIONAR | `design-system/molecules/Dropdown/`       | 🔴        | Dropdown menu molecule |
| 70  | DatePicker      | `molecules/date-picker/` + `theme-editor/molecules/`     | FUSIONAR | `design-system/molecules/DatePicker/`     | 🟡        | Date picker            |
| 71  | Pagination      | `molecules/pagination/` + `theme-editor/molecules/`      | FUSIONAR | `design-system/molecules/Pagination/`     | 🟡        | Pagination             |
| 72  | Combobox        | `molecules/combobox/` + `theme-editor/molecules/`        | FUSIONAR | `design-system/molecules/Combobox/`       | 🟢        | Combobox               |
| 73  | Accordion       | `molecules/accordion/`                                   | MOVER    | `design-system/molecules/Accordion/`      | 🟡        | Accordion molecule     |
| 74  | Breadcrumb      | `molecules/breadcrumb/` + `theme-editor/molecules/`      | FUSIONAR | `design-system/molecules/Breadcrumb/`     | 🟢        | Breadcrumb navigation  |
| 75  | Chip            | `molecules/chip/` + `theme-editor/molecules/`            | FUSIONAR | `design-system/molecules/Chip/`           | 🟢        | Chip molecule          |
| 76  | NavigationMenu  | `molecules/navigation-menu/` + `theme-editor/molecules/` | FUSIONAR | `design-system/molecules/NavigationMenu/` | 🟡        | Navigation menu        |
| 77  | PreviewImage    | `molecules/preview-image/` + `theme-editor/molecules/`   | FUSIONAR | `design-system/molecules/PreviewImage/`   | 🟢        | Image preview          |
| 78  | Tabs (molecule) | `molecules/tabs/` + `theme-editor/molecules/`            | FUSIONAR | `design-system/molecules/Tabs/`           | 🟢        | Tabs molecule          |

**Molecules específicos (NO design system):**

- AuthCardWrapper → MOVER a `features/auth/components/`
- RequestCard, ServiceCard → EVALUAR si son genéricos o ELIMINAR

### FASE 4: ORGANISMS (8 componentes de design system)

| #   | Componente  | Origen                    | Acción | Destino                                | Prioridad | Notas                 |
| --- | ----------- | ------------------------- | ------ | -------------------------------------- | --------- | --------------------- |
| 79  | FormBuilder | `theme-editor/organisms/` | MOVER  | `design-system/organisms/FormBuilder/` | 🟡        | Form builder organism |
| 80  | DataTable   | `theme-editor/organisms/` | MOVER  | `design-system/organisms/DataTable/`   | 🟡        | Data table organism   |
| 81  | Calendar    | `theme-editor/organisms/` | MOVER  | `design-system/organisms/Calendar/`    | 🟢        | Calendar organism     |
| 82  | Carousel    | `theme-editor/organisms/` | MOVER  | `design-system/organisms/Carousel/`    | 🟢        | Carousel organism     |
| 83  | Chart       | `theme-editor/organisms/` | MOVER  | `design-system/organisms/Chart/`       | 🟢        | Chart organism        |
| 84  | Dialog      | `theme-editor/organisms/` | MOVER  | `design-system/organisms/Dialog/`      | 🟡        | Dialog organism       |
| 85  | HoverCard   | `theme-editor/organisms/` | MOVER  | `design-system/organisms/HoverCard/`   | 🟢        | Hover card            |
| 86  | Skeleton    | `theme-editor/organisms/` | MOVER  | `design-system/organisms/Skeleton/`    | 🟢        | Skeleton loader       |

**Organisms que son features (NO design system):**

- Auth Forms (10) → MOVER a `features/auth/organisms/`
- Footer, Hero → MOVER a `features/layout/`
- Pricing → MOVER a `features/pricing/`
- ThemeEditorOrganism → ELIMINAR (wrapper innecesario)
- Unauthorized → MOVER a `features/auth/`

### FASE 5: FEATURES Y OTROS (directorios completos)

| #   | Componente/Directorio | Origen                                                           | Acción   | Destino                             | Prioridad | Notas                                    |
| --- | --------------------- | ---------------------------------------------------------------- | -------- | ----------------------------------- | --------- | ---------------------------------------- |
| 87  | Notifications         | `notifications/` (8 archivos)                                    | MOVER    | `features/notifications/`           | 🟡        | Sistema de notificaciones                |
| 88  | Chat                  | `chat/` (9 archivos)                                             | MOVER    | `features/chat/`                    | 🟡        | Sistema de chat                          |
| 89  | Users                 | `users/` (3 archivos)                                            | MOVER    | `features/users/`                   | 🟡        | Gestión de usuarios                      |
| 90  | Themes                | `themes/` (3 archivos)                                           | MOVER    | `features/themes/`                  | 🟡        | Theme browser                            |
| 91  | Shared messages       | `shared/messages/`                                               | MOVER    | `design-system/molecules/Messages/` | 🟡        | Feedback messages                        |
| 92  | Admin legacy          | `admin/ThemeEditor*.tsx`, `BrandStudio*.tsx`, etc. (23 archivos) | ELIMINAR | -                                   | 🔴        | Legacy, reemplazado por theme-editor-3.0 |

### DIRECTORIOS COMPLETOS A ELIMINAR

| Directorio                        | Acción   | Cuándo           | Razón                                    |
| --------------------------------- | -------- | ---------------- | ---------------------------------------- |
| `/ui/` completo (58 archivos)     | ELIMINAR | Después Fase 1   | Reemplazado por design-system/primitives |
| `/` completo                      | ELIMINAR | Después Fase 2-4 | Consolidado en design-system             |
| `/shared/` completo               | ELIMINAR | Después Fase 5   | Distribuido en design-system y features  |
| `theme-editor-3.0/design-system/` | ELIMINAR | Después Fase 1-4 | Movido a raíz como design-system         |

---

## Plan de Ejecución por Fases

### FASE 1: Fusionar Primitives (50 componentes)

**Objetivo:** Crear base themable del design system

**Tiempo estimado:** 3-4 horas

#### Proceso por Componente

**Ejemplo: Button**

1. **Análisis** (2 min)

   ```bash
   # Leer implementaciones
   - ui/button.tsx (shadcn base)
   - theme-editor-3.0/design-system/primitives/button.tsx (themable)
   - atoms/buttons/ (si tiene tests/stories)
   ```

2. **Crear Estructura** (1 min)

   ```bash
   mkdir design-system/primitives/Button
   touch design-system/primitives/Button/Button.tsx
   touch design-system/primitives/Button/Button.types.ts
   touch design-system/primitives/Button/Button.test.tsx
   touch design-system/primitives/Button/Button.stories.tsx
   touch design-system/primitives/Button/index.ts
   ```

3. **Copiar Código** (3 min)
   - Button.tsx ← theme-editor (themable)
   - Button.types.ts ← crear o adaptar
   - Button.test.tsx ← atomic-design (si existe)
   - Button.stories.tsx ← atomic-design (si existe)

4. **Actualizar Imports** (2 min)

   ```typescript
   // En theme-editor files
   // ANTES:
   import { Button } from "../design-system/primitives/button";
   // DESPUÉS:
   import { Button } from "@/components/design-system/primitives/Button";
   ```

5. **Verificar** (2 min)
   ```bash
   npm run type-check
   npm run dev # Verificar que carga
   ```

**Total por componente:** ~10 minutos

**Prioridad de primitives:**

1. 🔴 Alta (4): Button, Card, Input, Select - 40 min
2. 🟡 Media (6): Dialog, Accordion, Tabs, Dropdown, Popover, Tooltip - 60 min
3. 🟢 Baja (40): Resto - 400 min (6.6h)

**Tiempo real con testing:** 3-4 horas para prioridad alta/media

#### Salida de Fase 1

✅ `design-system/primitives/` con 10-50 componentes themables organizados
✅ Theme-editor usando los nuevos primitives
✅ Tests pasan
✅ Type-check pasa

---

### FASE 2: Fusionar Atoms (17 componentes)

**Objetivo:** Consolidar atoms con código themable + tests/stories

**Tiempo estimado:** 2-3 horas

#### Estrategia de Fusión

**Para cada atom:**

1. **Evaluar** (3 min)
   - ¿Tiene tests en atomic-design? ✅/❌
   - ¿Es themable en theme-editor? ✅/❌
   - ¿Cuál implementación es mejor?

2. **Fusionar** (5 min)

   ```typescript
   // design-system/atoms/Badge/Badge.tsx
   // Combinar lógica themable + API de atomic-design
   import { badgeVariants } from '@/components/design-system/primitives/Badge';

   export const Badge = ({ variant, size, ...props }) => {
     // Usar primitive themable como base
     return <PrimitiveBadge className={badgeVariants({ variant, size })} {...props} />;
   };
   ```

3. **Copiar tests/stories completos** (3 min)

4. **Verificar** (2 min)

**Total por atom:** ~13 minutos

**17 atoms × 13 min = 221 min (~3.7 horas real)**

#### Atoms Únicos (Solo en atomic-design)

- Typography, Icons, Brand → **MOVER completos** (ya tienen estructura correcta)
- Total: ~30 min

#### Salida de Fase 2

✅ `design-system/atoms/` con 17-20 atoms consolidados
✅ Tests completos
✅ Stories completas
✅ Código themable

---

### FASE 3: Fusionar Molecules (11 componentes)

**Objetivo:** Consolidar molecules

**Tiempo estimado:** 2 horas

**Proceso:** Similar a Fase 2 pero para molecules

**11 molecules × 10 min = 110 min (~2 horas)**

#### Molecules Especiales

- **AuthCardWrapper** → MOVER a `features/auth/components/` (feature-specific)
- **RequestCard, ServiceCard** → EVALUAR o ELIMINAR (pueden ser demasiado específicos)

#### Salida de Fase 3

✅ `design-system/molecules/` con 11-13 molecules
✅ Features específicas movidas

---

### FASE 4: Reorganizar Organisms (8 componentes)

**Objetivo:** Separar organisms del design system vs features

**Tiempo estimado:** 1.5 horas

#### Organisms del Design System

**De theme-editor → design-system:**

- FormBuilder, DataTable, Calendar, Carousel, Chart, Dialog, HoverCard, Skeleton

**Proceso:** MOVER directo (ya están bien estructurados en theme-editor)

```bash
# Para cada organism
mv theme-editor-3.0/design-system/organisms/FormBuilderOrganism.tsx \
   design-system/organisms/FormBuilder/FormBuilder.tsx
```

#### Organisms que son Features

**De atomic-design → features:**

```bash
# Auth organisms (10 archivos)
mv organisms/auth/ features/auth/organisms/

# Layout organisms
mv organisms/footer/ features/layout/Footer/
mv organisms/hero/ features/layout/Hero/

# Otros
mv organisms/pricing-card/ features/pricing/
mv organisms/unauthorized/ features/auth/Unauthorized/
```

#### Salida de Fase 4

✅ `design-system/organisms/` con organisms genéricos
✅ `features/` con organisms específicos de app
✅ Separación clara entre design system y app logic

---

### FASE 5: Migrar Features y Limpiar (6 directorios)

**Objetivo:** Reorganizar features dispersas y eliminar legacy

**Tiempo estimado:** 1.5 horas

#### Migrar Features

```bash
# Mover directorios completos
mv notifications/ features/notifications/
mv chat/ features/chat/
mv users/ features/users/
mv themes/ features/themes/
```

**Para cada feature:** Actualizar imports (15 min × 4 = 60 min)

#### Migrar Shared

```bash
# Messages
mv shared/messages/ design-system/molecules/Messages/

# Eliminar resto de shared (duplicados)
rm -rf shared/
```

#### Eliminar Legacy

```bash
# Admin legacy components (23 archivos)
rm admin/ThemeEditor.tsx
rm admin/ThemeEditor.monolith.backup.tsx
rm admin/BrandStudio*.tsx
rm admin/*Editor*.tsx
# ...etc
```

#### Eliminar Directorios Duplicados

```bash
# SOLO después de verificar que TODO funciona
rm -rf ui/
rm -rf
rm -rf shared/
```

#### Salida de Fase 5

✅ Features organizadas en `features/`
✅ Legacy code eliminado
✅ Directorios duplicados eliminados
✅ Proyecto limpio y organizado

---

## Estructura de Folders y Mejores Prácticas

### Template de Componente

**Para CADA componente (primitive, atom, molecule, organism):**

```
ComponentName/
├── ComponentName.tsx           # Componente principal
├── ComponentName.types.ts      # TypeScript interfaces/types
├── ComponentName.test.tsx      # Tests (Vitest + Testing Library)
├── ComponentName.stories.tsx   # Storybook stories
├── ComponentName.module.css    # Estilos (opcional, raro con Tailwind)
├── index.ts                    # Barrel export
└── README.md                   # Documentación (opcional)
```

### Ejemplo Real: Button Primitive

```
design-system/primitives/Button/
├── Button.tsx
├── Button.types.ts
├── Button.test.tsx
├── Button.stories.tsx
└── index.ts
```

#### Button.tsx

```typescript
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { ButtonProps } from './Button.types';

// Variantes themables (usan CSS variables)
const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',  // ← CSS vars
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { buttonVariants };
```

#### Button.types.ts

```typescript
import { type VariantProps } from "class-variance-authority";
import { buttonVariants } from "./Button";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
```

#### Button.test.tsx

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    const { container } = render(<Button variant="destructive">Delete</Button>);
    expect(container.firstChild).toHaveClass('bg-destructive');
  });

  it('applies size classes', () => {
    const { container } = render(<Button size="lg">Large</Button>);
    expect(container.firstChild).toHaveClass('h-11');
  });

  it('handles disabled state', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });

  it('supports asChild prop', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );
    expect(screen.getByText('Link Button')).toHaveAttribute('href', '/test');
  });
});
```

#### Button.stories.tsx

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Design System/Primitives/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">📌</Button>
    </div>
  ),
};
```

#### index.ts

```typescript
export { Button, buttonVariants } from "./Button";
export type { ButtonProps } from "./Button.types";
```

---

## Testing y Validación

### Después de Cada Componente

```bash
# 1. Type check
npm run type-check

# 2. Run tests (si existen)
npm run test Button.test.tsx

# 3. Dev server
npm run dev
# Navegar a la página que usa el componente

# 4. Storybook (opcional)
npm run storybook
# Ver el componente en Storybook
```

### Después de Cada Fase

```bash
# 1. Full type check
npm run type-check

# 2. Run all tests
npm run test

# 3. Build check
npm run build

# 4. Verificar Theme Editor
# Navegar a http://localhost:3000/es/admin/settings/themes
# Cambiar colores y verificar que se aplican globalmente
```

### Test Definitivo (Al Final)

```bash
# 1. Clean install
rm -rf node_modules package-lock.json
npm install

# 2. Type check
npm run type-check

# 3. Tests
npm run test

# 4. Build
npm run build

# 5. Dev server
npm run dev

# 6. Manual testing
# - Homepage carga
# - Dashboard carga
# - Theme Editor carga
# - Cambiar tema aplica globalmente
# - Todos los botones cambian de color
# - Todos los cards responden al tema
# - etc.
```

---

## Riesgos y Mitigación

### Riesgos Identificados

| Riesgo                       | Probabilidad | Impacto  | Mitigación                                           |
| ---------------------------- | ------------ | -------- | ---------------------------------------------------- |
| **Romper Theme Editor**      | 🟡 Media     | 🔴 Alta  | Testing continuo después de cada cambio              |
| **Imports rotos**            | 🔴 Alta      | 🟡 Media | Scripts de búsqueda/reemplazo, verificación con grep |
| **Tests fallando**           | 🟡 Media     | 🟡 Media | Adaptar tests, no saltarlos                          |
| **Pérdida de funcionalidad** | 🟢 Baja      | 🔴 Alta  | Testing manual exhaustivo                            |
| **Merge conflicts**          | 🟡 Media     | 🟡 Media | Trabajar en feature branch, commits pequeños         |
| **Tiempo excedido**          | 🟡 Media     | 🟢 Baja  | Hacer por fases, priorizar alta prioridad            |

### Estrategias de Mitigación

#### 1. Testing Continuo

- ✅ Correr `npm run type-check` después de cada componente
- ✅ Verificar en browser que carga correctamente
- ✅ Theme Editor debe funcionar en todo momento

#### 2. Commits Pequeños

```bash
# Por cada componente completado
git add design-system/primitives/Button/
git commit -m "feat(design-system): add Button primitive with tests and stories"
```

#### 3. Branch Strategy

```bash
# Trabajar en feature branch
git checkout -b feature/unify-design-system

# Hacer commits frecuentes
# Al completar una fase
git push origin feature/unify-design-system

# Al final
# PR para review antes de merge a main
```

#### 4. Rollback Plan

Si algo sale mal:

```bash
# Volver al último commit bueno
git reset --hard <commit-hash>

# O revertir commits específicos
git revert <commit-hash>
```

#### 5. Backup

```bash
# Antes de empezar
git tag pre-design-system-migration

# Si todo sale mal
git reset --hard pre-design-system-migration
```

---

## Métricas de Éxito

### Cuantitativas

- ✅ 92 componentes migrados/consolidados (100%)
- ✅ ~93 archivos eliminados (duplicados)
- ✅ 0 errores de TypeScript
- ✅ 0 tests fallando
- ✅ 100% de components themables desde Theme Editor

### Cualitativas

- ✅ Un solo import path para cada componente
- ✅ Estructura de folders organizada y consistente
- ✅ Theme Editor funciona perfectamente
- ✅ Cambios de tema se aplican globalmente
- ✅ Developer experience mejorada
- ✅ Documentación completa

---

## Siguientes Pasos Después de la Migración

### 1. Crear Templates y Pages (Opcional)

**En `design-system/templates/`:**

- AuthTemplate.tsx
- DashboardTemplate.tsx
- LandingTemplate.tsx

**En `design-system/pages/`:**

- Componer páginas usando templates + organisms

### 2. Configurar Storybook Completamente

```javascript
// .storybook/main.js
stories: [
  "../components/design-system/**/*.stories.tsx",
  "../components/features/**/*.stories.tsx",
];
```

### 3. Configurar Chromatic (Visual Testing)

```bash
npm install --save-dev chromatic
npx chromatic --project-token=<token>
```

### 4. Actualizar Documentación

- README del proyecto
- Documentación de componentes
- Guías de uso

### 5. Crear CI/CD Checks

```yaml
# .github/workflows/test.yml
- name: Type Check
  run: npm run type-check
- name: Tests
  run: npm run test
- name: Build
  run: npm run build
```

---

## Conclusión

Este plan proporciona una ruta clara y estructurada para unificar los 3 sistemas de componentes en uno solo. El enfoque híbrido combina lo mejor de ambos mundos: código themable del Theme Editor y estructura organizada del Atomic Design.

**Tiempo total estimado:** 10-13 horas
**Archivos afectados:** ~466 (94% del proyecto)
**Archivos eliminados:** ~93
**Resultado:** Sistema unificado, sin duplicación, themable, testeable, y mantenible.

---

_Última actualización: {{DATE}}_
_Versión: 1.0.0_
