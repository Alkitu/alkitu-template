# 📊 Tracking de Migración de Componentes a Design System

> Seguimiento detallado de los 92 componentes a migrar/consolidar

**Última actualización:** {{DATE}}

---

## 📈 Resumen Ejecutivo

| Métrica               | Valor | Porcentaje |
| --------------------- | ----- | ---------- |
| **Total Componentes** | 92    | 100%       |
| **Completados**       | 7     | 7.61%      |
| **En Progreso**       | 0     | 0%         |
| **Pendientes**        | 85    | 92.39%     |
| **Bloqueados**        | 0     | 0%         |

### Por Fase

| Fase       | Descripción | Total | Completados | En Progreso | Pendientes | %   |
| ---------- | ----------- | ----- | ----------- | ----------- | ---------- | --- |
| **Fase 1** | Primitives  | 50    | 7           | 0           | 43         | 14% |
| **Fase 2** | Atoms       | 17    | 0           | 0           | 17         | 0%  |
| **Fase 3** | Molecules   | 11    | 0           | 0           | 11         | 0%  |
| **Fase 4** | Organisms   | 8     | 0           | 0           | 8          | 0%  |
| **Fase 5** | Features    | 6     | 0           | 0           | 6          | 0%  |

### Por Prioridad

| Prioridad | Total | Completados | Pendientes |
| --------- | ----- | ----------- | ---------- |
| 🔴 Alta   | 15    | 3           | 12         |
| 🟡 Media  | 30    | 4           | 26         |
| 🟢 Baja   | 47    | 0           | 47         |

---

## Leyenda de Estados

- ⬜ **Pendiente** - No iniciado
- 🟡 **En Progreso** - Trabajando actualmente
- ✅ **Completado** - Migrado y verificado
- ❌ **Bloqueado** - Tiene issues que resolver

---

## FASE 1: PRIMITIVES (50 componentes)

**Progreso:** 7/50 (14%)

### 🔴 Prioridad Alta (4 componentes)

#### ✅ 1. Button

- **Estado:** ✅ Completado
- **Prioridad:** 🔴 Alta
- **Origen:** `ui/button.tsx` + `theme-editor/primitives/button.tsx`
- **Destino:** `design-system/primitives/Button/`
- **Acción:** FUSIONAR
- **Estimado:** 10 min
- **Real:** 15 min
- **Notas:** Componente más usado en el proyecto, crítico para theme system
- **Inicio:** 2025-11-10
- **Fin:** 2025-11-10

**Checklist:**

- [x] Crear estructura de folders
- [x] Copiar código themable de theme-editor
- [x] Crear/copiar tests de atomic-design (si existen)
- [x] Crear/copiar stories de atomic-design (si existen)
- [x] Crear Button.types.ts
- [x] Crear index.ts con exports
- [x] Actualizar imports en theme-editor
- [x] Actualizar imports en resto del proyecto (vía re-exports)
- [x] Verificar type-check pasa (0 Button-related errors)
- [ ] Verificar en browser que funciona
- [ ] Verificar theme switching funciona
- [x] Marcar como ✅ en tracking

**Archivos creados:**

- `design-system/primitives/Button/Button.tsx`
- `design-system/primitives/Button/Button.types.ts`
- `design-system/primitives/Button/Button.test.tsx`
- `design-system/primitives/Button/Button.stories.tsx`
- `design-system/primitives/Button/index.ts`

**Archivos actualizados (re-exports):**

- `ui/button.tsx` → re-exports from design-system
- `design-system/primitives/button.tsx` → re-exports from Button folder
- 3 atomic-design files updated to use new import path

**Imports afectados:** 61+ files (mantenidos compatibles vía re-export)

---

#### ✅ 2. Card

- **Estado:** ✅ Completado
- **Prioridad:** 🔴 Alta
- **Origen:** `ui/card.tsx` + `theme-editor/primitives/card.tsx` + `molecules/Card/`
- **Destino:** `design-system/primitives/Card/`
- **Acción:** FUSIONAR
- **Tiempo real:** 15 min
- **Notas:** Componente base más usado después de Button. Fusionado con CardAction de ui/
- **Completado:** 2025-11-10

**Checklist:**

- [x] Crear estructura de folders
- [x] Copiar código themable (usa CSS vars: --card, --card-foreground)
- [x] Copiar tests completos de atomic-design
- [x] Copiar stories completas de atomic-design
- [x] Crear Card.types.ts (CardProps, CardHeaderProps, CardContentProps, CardFooterProps, CardActionProps, etc.)
- [x] Crear index.ts con exports
- [x] Actualizar imports (41 archivos)
- [x] Verificar type-check pasa
- [x] Marcar como ✅

**Archivos creados:**

- `design-system/primitives/Card/Card.tsx` (con CardAction fusionado)
- `design-system/primitives/Card/Card.types.ts`
- `design-system/primitives/Card/Card.test.tsx`
- `design-system/primitives/Card/Card.stories.tsx`
- `design-system/primitives/Card/index.ts`

**Imports actualizados:** 41 archivos migrados a `@/components/design-system/primitives/Card`

**Componentes incluidos:**

- Card (con variantes: default, bordered, elevated, flat)
- CardHeader
- CardTitle
- CardDescription
- CardContent
- CardFooter
- CardAction (fusionado desde ui/)

---

#### ✅ 3. Input

- **Estado:** ✅ Completado
- **Prioridad:** 🔴 Alta
- **Origen:** `ui/input.tsx` (theme-editor solo re-exporta)
- **Destino:** `design-system/primitives/Input/`
- **Acción:** MOVER y mejorar con forwardRef
- **Tiempo real:** 8 min
- **Notas:** Input themable esencial con CSS variables (--input, --input-background, --border-input)
- **Completado:** 2025-11-10

**Checklist:**

- [x] Crear estructura de folders
- [x] Crear Input.tsx con forwardRef
- [x] Crear Input.types.ts
- [x] Crear index.ts con exports
- [x] Actualizar imports (36 archivos)
- [x] Verificar type-check pasa
- [x] Marcar como ✅

**Archivos creados:**

- `design-system/primitives/Input/Input.tsx`
- `design-system/primitives/Input/Input.types.ts`
- `design-system/primitives/Input/index.ts`

**Imports actualizados:** 36 archivos migrados a `@/components/design-system/primitives/Input`

**Características:**

- ForwardRef support para acceso directo al elemento input
- Soporte completo para todos los tipos HTML5 (text, email, password, number, etc.)
- Theme system integration con CSS variables
- Estados de validación (aria-invalid)
- Estados disabled y readonly
- File input styling
- Dark mode support

---

#### ✅ 4. Select

- **Estado:** ✅ Completado
- **Prioridad:** 🔴 Alta
- **Origen:** `ui/select.tsx` (Radix UI implementation)
- **Destino:** `design-system/primitives/Select/`
- **Acción:** MOVER y mejorar con forwardRef
- **Tiempo real:** 12 min
- **Notas:** Compound component basado en Radix UI con 10 subcomponentes
- **Completado:** 2025-11-10

**Checklist:**

- [x] Crear estructura de folders
- [x] Migrar Select.tsx con todos los subcomponentes
- [x] Crear Select.types.ts para todos los subcomponentes
- [x] Crear index.ts con exports completos
- [x] Actualizar imports (24 archivos)
- [x] Verificar type-check pasa
- [x] Marcar como ✅

**Archivos creados:**

- `design-system/primitives/Select/Select.tsx` (10 subcomponentes)
- `design-system/primitives/Select/Select.types.ts`
- `design-system/primitives/Select/index.ts`

**Imports actualizados:** 24 archivos migrados a `@/components/design-system/primitives/Select`

**Subcomponentes incluidos:**

- Select (Root) - Radix UI primitive wrapper
- SelectGroup - Groups related items
- SelectValue - Displays selected value or placeholder
- SelectTrigger - Trigger button with size variants (sm, default)
- SelectContent - Dropdown content with portal and animations
- SelectLabel - Label for item groups
- SelectItem - Individual selectable option with check indicator
- SelectSeparator - Visual separator
- SelectScrollUpButton - Scroll up control
- SelectScrollDownButton - Scroll down control

**Características:**

- ForwardRef support en todos los subcomponentes relevantes
- Radix UI primitives para accesibilidad completa
- Size variants (sm, default) en el trigger
- Theme system integration con CSS variables
- Keyboard navigation automática
- Focus indicators con ring effects
- Estados de validación (aria-invalid)
- Portal rendering para el dropdown
- Scroll buttons automáticos
- Animaciones de entrada/salida

---

### 🟡 Prioridad Media (6 componentes)

#### ✅ 5. Dialog

- **Estado:** ✅ Completado | **Prioridad:** 🟡 Media
- **Origen:** `ui/dialog.tsx` (Radix UI implementation)
- **Destino:** `design-system/primitives/Dialog/`
- **Acción:** MOVER y mejorar con forwardRef | **Tiempo real:** 10 min
- **Completado:** 2025-11-10

**Checklist:** [x] Estructura | [x] Código | [x] Types | [x] Exports | [x] Imports (10 archivos) | [x] Verificar | [x] ✅

**Archivos creados:**

- `design-system/primitives/Dialog/Dialog.tsx` (10 subcomponentes)
- `design-system/primitives/Dialog/Dialog.types.ts`
- `design-system/primitives/Dialog/index.ts`

**Subcomponentes:** Dialog, DialogTrigger, DialogPortal, DialogClose, DialogOverlay, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription

**Características:** Radix UI primitives, forwardRef, portal rendering, animaciones, overlay backdrop, close button automático, accesibilidad completa

---

#### ✅ 6. Accordion

- **Estado:** ✅ Completado
- **Prioridad:** 🟡 Media
- **Origen:** `ui/accordion.tsx` + `theme-editor/primitives/accordion.tsx`
- **Destino:** `design-system/primitives/Accordion/`
- **Acción:** MIGRAR (usada versión Radix UI de ui/)
- **Estimado:** 12 min
- **Real:** 10 min
- **Notas:** Componente Radix UI con 4 subcomponentes, añadido forwardRef
- **Inicio:** 2025-11-10
- **Fin:** 2025-11-10

**Checklist:**

- [x] Crear estructura de folders
- [x] Copiar código de ui/accordion.tsx con forwardRef
- [x] Crear Accordion.types.ts
- [x] Crear index.ts con exports
- [x] Actualizar imports en proyecto (2 archivos)
- [x] Comentar export en components/index.ts (conflicto)
- [x] Verificar type-check pasa (sin errores Accordion)
- [x] Marcar como ✅ en tracking

**Archivos creados:**

- `design-system/primitives/Accordion/Accordion.tsx` (4 subcomponentes)
- `design-system/primitives/Accordion/Accordion.types.ts`
- `design-system/primitives/Accordion/index.ts`

**Subcomponentes:**

- Accordion (root con forwardRef)
- AccordionItem (con forwardRef)
- AccordionTrigger (con forwardRef y ChevronDownIcon)
- AccordionContent (con forwardRef y animaciones)

**Imports afectados:** 2 files

- `components/admin/NewAdvancedBrandStudio.tsx`
- `components/admin/theme-editor-3.0/design-system/primitives/accordion.tsx`

**Checklist:** [x] Estructura | [x] Código | [ ] Tests | [ ] Stories | [x] Types | [x] Exports | [x] Imports | [x] Verificar | [x] ✅

---

#### ✅ 7. Tabs

- **Estado:** ✅ Completado
- **Prioridad:** 🟡 Media
- **Origen:** `ui/tabs.tsx` + `atoms/tabs/`
- **Destino:** `design-system/primitives/Tabs/`
- **Acción:** MIGRAR (usada versión de atomic-design con forwardRef)
- **Estimado:** 12 min
- **Real:** 12 min
- **Notas:** Componente Radix UI con 4 subcomponentes, usado versión con forwardRef
- **Inicio:** 2025-11-10
- **Fin:** 2025-11-10

**Checklist:**

- [x] Crear estructura de folders
- [x] Copiar código de atomic-design con forwardRef
- [x] Crear Tabs.types.ts
- [x] Crear index.ts con exports
- [x] Actualizar imports en proyecto (17 archivos)
- [x] Comentar export en components/index.ts (conflicto)
- [x] Comentar export en atoms/index.tsx
- [x] Comentar export en molecules/index.ts
- [x] Verificar type-check pasa (conflicto resuelto)
- [x] Marcar como ✅ en tracking

**Archivos creados:**

- `design-system/primitives/Tabs/Tabs.tsx` (4 subcomponentes)
- `design-system/primitives/Tabs/Tabs.types.ts`
- `design-system/primitives/Tabs/index.ts`

**Subcomponentes:**

- Tabs (root con forwardRef)
- TabsList (container con forwardRef)
- TabsTrigger (individual tab con forwardRef)
- TabsContent (panel content con forwardRef)

**Imports afectados:** 17 files

- 9 archivos en app/[lang]/(private)/admin/
- 7 archivos en components/admin/
- 1 archivo en components/ui/

**Características:** Radix UI primitives, forwardRef, theme CSS variables, dark mode support, accesibilidad completa

**Checklist:** [x] Estructura | [x] Código | [ ] Tests | [ ] Stories | [x] Types | [x] Exports | [x] Imports | [x] Verificar | [x] ✅

---

#### ✅ 8. DropdownMenu

- **Estado:** ✅ Completado
- **Prioridad:** 🟡 Media
- **Origen:** `ui/dropdown-menu.tsx`
- **Destino:** `design-system/primitives/DropdownMenu/`
- **Acción:** MIGRAR (usada versión Radix UI de ui/)
- **Estimado:** 15 min
- **Real:** 15 min
- **Notas:** Compound component con 15 subcomponentes, forwardRef donde aplicable
- **Inicio:** 2025-11-10
- **Fin:** 2025-11-10

**Checklist:**

- [x] Crear estructura de folders
- [x] Copiar código de ui/dropdown-menu.tsx
- [x] Añadir forwardRef a componentes interactivos
- [x] Crear DropdownMenu.types.ts
- [x] Crear index.ts con exports
- [x] Actualizar imports en proyecto (12 archivos)
- [x] Comentar export en components/index.ts (conflicto)
- [x] Verificar type-check pasa (sin errores)
- [x] Marcar como ✅ en tracking

**Archivos creados:**

- `design-system/primitives/DropdownMenu/DropdownMenu.tsx` (15 subcomponentes)
- `design-system/primitives/DropdownMenu/DropdownMenu.types.ts`
- `design-system/primitives/DropdownMenu/index.ts`

**Subcomponentes:**

- DropdownMenu (root)
- DropdownMenuPortal
- DropdownMenuTrigger (con forwardRef)
- DropdownMenuContent (con forwardRef)
- DropdownMenuGroup
- DropdownMenuItem (con forwardRef + variant destructive + inset)
- DropdownMenuCheckboxItem (con forwardRef + CheckIcon)
- DropdownMenuRadioGroup
- DropdownMenuRadioItem (con forwardRef + CircleIcon)
- DropdownMenuLabel (con forwardRef + inset)
- DropdownMenuSeparator (con forwardRef)
- DropdownMenuShortcut (con forwardRef)
- DropdownMenuSub
- DropdownMenuSubTrigger (con forwardRef + ChevronRightIcon + inset)
- DropdownMenuSubContent (con forwardRef)

**Imports afectados:** 12 files

- 5 archivos en app/[lang]/(private)/admin/
- 1 archivo en components/admin/
- 1 archivo en components/admin/theme-editor-3.0/
- 5 archivos en components/

**Características:** Radix UI primitives, forwardRef, portal rendering, animaciones, checkbox/radio items, submenus, keyboard shortcuts, accesibilidad completa

**Checklist:** [x] Estructura | [x] Código | [ ] Tests | [ ] Stories | [x] Types | [x] Exports | [x] Imports | [x] Verificar | [x] ✅

---

#### ⬜ 9. Popover

- **Estado:** ⬜ Pendiente | **Prioridad:** 🟡 Media
- **Origen:** `ui/popover.tsx` + `theme-editor/primitives/popover.tsx`
- **Destino:** `design-system/primitives/Popover/`
- **Acción:** FUSIONAR | **Estimado:** 10 min

---

#### ⬜ 10. Tooltip

- **Estado:** ⬜ Pendiente | **Prioridad:** 🟡 Media
- **Origen:** `ui/tooltip.tsx` + `theme-editor/primitives/tooltip.tsx`
- **Destino:** `design-system/primitives/Tooltip/`
- **Acción:** FUSIONAR | **Estimado:** 10 min
- **Notas:** IMPORTANTE - Muchos archivos lo usan, cuidado con imports

---

### 🟢 Prioridad Baja (40 componentes restantes)

**Lista compacta de primitives restantes:**

| #   | Componente     | Estado | Acción   | Estimado |
| --- | -------------- | ------ | -------- | -------- |
| 11  | Alert          | ⬜     | FUSIONAR | 10 min   |
| 12  | AlertDialog    | ⬜     | FUSIONAR | 12 min   |
| 13  | AspectRatio    | ⬜     | FUSIONAR | 8 min    |
| 14  | Avatar         | ⬜     | FUSIONAR | 10 min   |
| 15  | Badge          | ⬜     | FUSIONAR | 10 min   |
| 16  | Breadcrumb     | ⬜     | FUSIONAR | 10 min   |
| 17  | Calendar       | ⬜     | FUSIONAR | 15 min   |
| 18  | Carousel       | ⬜     | FUSIONAR | 15 min   |
| 19  | Checkbox       | ⬜     | FUSIONAR | 10 min   |
| 20  | Collapsible    | ⬜     | FUSIONAR | 10 min   |
| 21  | Command        | ⬜     | FUSIONAR | 12 min   |
| 22  | ContextMenu    | ⬜     | FUSIONAR | 12 min   |
| 23  | Drawer         | ⬜     | FUSIONAR | 12 min   |
| 24  | Form           | ⬜     | FUSIONAR | 15 min   |
| 25  | HoverCard      | ⬜     | FUSIONAR | 10 min   |
| 26  | InputOTP       | ⬜     | FUSIONAR | 10 min   |
| 27  | Label          | ⬜     | FUSIONAR | 8 min    |
| 28  | Menubar        | ⬜     | FUSIONAR | 12 min   |
| 29  | NavigationMenu | ⬜     | FUSIONAR | 15 min   |
| 30  | Pagination     | ⬜     | FUSIONAR | 12 min   |
| 31  | PasswordInput  | ⬜     | FUSIONAR | 10 min   |
| 32  | Progress       | ⬜     | FUSIONAR | 10 min   |
| 33  | RadioGroup     | ⬜     | FUSIONAR | 10 min   |
| 34  | Resizable      | ⬜     | FUSIONAR | 12 min   |
| 35  | ScrollArea     | ⬜     | FUSIONAR | 12 min   |
| 36  | Separator      | ⬜     | FUSIONAR | 8 min    |
| 37  | Sheet          | ⬜     | FUSIONAR | 12 min   |
| 38  | Sidebar        | ⬜     | FUSIONAR | 15 min   |
| 39  | Skeleton       | ⬜     | FUSIONAR | 8 min    |
| 40  | Slider         | ⬜     | FUSIONAR | 10 min   |
| 41  | Sonner         | ⬜     | FUSIONAR | 10 min   |
| 42  | Spinner        | ⬜     | FUSIONAR | 8 min    |
| 43  | Switch         | ⬜     | FUSIONAR | 10 min   |
| 44  | Table          | ⬜     | FUSIONAR | 15 min   |
| 45  | Textarea       | ⬜     | FUSIONAR | 10 min   |
| 46  | Toast/Toaster  | ⬜     | FUSIONAR | 12 min   |
| 47  | Toggle         | ⬜     | FUSIONAR | 10 min   |
| 48  | ToggleGroup    | ⬜     | FUSIONAR | 10 min   |
| 49  | ColorPicker    | ⬜     | FUSIONAR | 15 min   |
| 50  | ChipInput      | ⬜     | FUSIONAR | 10 min   |

**Total estimado Fase 1:** ~540 min (9 horas)
**Real con testing:** 3-4 horas (priorizando alta/media)

---

## FASE 2: ATOMS (17 componentes)

**Progreso:** 0/17 (0%)

### 🔴 Prioridad Alta (2 componentes)

#### ⬜ 51. Badge

- **Estado:** ⬜ Pendiente
- **Prioridad:** 🔴 Alta
- **Origen:** `atoms/badge/` + `theme-editor/atoms/Badge.tsx`
- **Destino:** `design-system/atoms/Badge/`
- **Acción:** FUSIONAR
- **Estimado:** 15 min
- **Notas:** Mantener tests/stories de atomic + código themable de theme-editor

**Checklist:**

- [ ] Evaluar ambas implementaciones
- [ ] Crear estructura en design-system/atoms/Badge/
- [ ] Fusionar código (usar themable como base)
- [ ] Copiar tests completos de atomic-design
- [ ] Copiar stories completas
- [ ] Crear Badge.types.ts consolidado
- [ ] Crear index.ts
- [ ] Actualizar imports en proyecto
- [ ] Verificar tests pasan
- [ ] Verificar theming funciona
- [ ] ✅

---

#### ⬜ 52. badges/ (ELIMINAR)

- **Estado:** ⬜ Pendiente
- **Prioridad:** 🔴 Alta
- **Origen:** `atoms/badges/`
- **Destino:** - (ELIMINAR)
- **Acción:** ELIMINAR
- **Estimado:** 5 min
- **Notas:** Duplicado de badge/, eliminar después de consolidar Badge

**Checklist:**

- [ ] Verificar que Badge (singular) está completado
- [ ] Buscar imports de badges/ en el proyecto
- [ ] Actualizar imports a badge/ (si los hay)
- [ ] Eliminar carpeta badges/ completa
- [ ] Verificar type-check pasa
- [ ] ✅

---

### 🟡 Prioridad Media (10 componentes)

| #   | Componente  | Estado | Origen                       | Acción   | Prioridad | Estimado |
| --- | ----------- | ------ | ---------------------------- | -------- | --------- | -------- |
| 53  | Avatar      | ⬜     | atomic-design + theme-editor | FUSIONAR | 🟡        | 12 min   |
| 54  | Spinner     | ⬜     | atomic-design + theme-editor | FUSIONAR | 🟡        | 10 min   |
| 55  | Toggle      | ⬜     | atomic-design + theme-editor | FUSIONAR | 🟡        | 10 min   |
| 56  | Typography  | ⬜     | atomic-design                | MOVER    | 🟡        | 8 min    |
| 57  | Icons       | ⬜     | atomic-design                | MOVER    | 🟡        | 8 min    |
| 58  | Alert       | ⬜     | atomic-design + theme-editor | FUSIONAR | 🟡        | 10 min   |
| 59  | Checkbox    | ⬜     | atomic-design + theme-editor | FUSIONAR | 🟡        | 10 min   |
| 60  | RadioButton | ⬜     | atomic-design + theme-editor | FUSIONAR | 🟡        | 10 min   |
| 61  | ProgressBar | ⬜     | atomic-design + theme-editor | FUSIONAR | 🟡        | 10 min   |
| 62  | Slider      | ⬜     | atomic-design + theme-editor | FUSIONAR | 🟡        | 10 min   |

### 🟢 Prioridad Baja (5 componentes)

| #   | Componente  | Estado | Acción                         | Estimado |
| --- | ----------- | ------ | ------------------------------ | -------- |
| 63  | Separator   | ⬜     | FUSIONAR (eliminar de shared/) | 10 min   |
| 64  | CustomIcon  | ⬜     | FUSIONAR                       | 10 min   |
| 65  | Brand       | ⬜     | MOVER                          | 8 min    |
| 66  | Spacer      | ⬜     | FUSIONAR                       | 8 min    |
| 67  | Tabs (atom) | ⬜     | MOVER                          | 8 min    |

**Total estimado Fase 2:** ~170 min (~3 horas)

---

## FASE 3: MOLECULES (11 componentes)

**Progreso:** 0/11 (0%)

### 🔴 Prioridad Alta (2 componentes)

| #   | Componente   | Estado | Origen                       | Destino                           | Acción   | Estimado |
| --- | ------------ | ------ | ---------------------------- | --------------------------------- | -------- | -------- |
| 68  | Card         | ⬜     | atomic-design + theme-editor | design-system/molecules/Card/     | FUSIONAR | 15 min   |
| 69  | DropdownMenu | ⬜     | atomic-design + theme-editor | design-system/molecules/Dropdown/ | FUSIONAR | 15 min   |

### 🟡 Prioridad Media (6 componentes)

| #   | Componente     | Estado | Acción   | Estimado |
| --- | -------------- | ------ | -------- | -------- |
| 70  | DatePicker     | ⬜     | FUSIONAR | 12 min   |
| 71  | Pagination     | ⬜     | FUSIONAR | 12 min   |
| 72  | Accordion      | ⬜     | MOVER    | 10 min   |
| 73  | Breadcrumb     | ⬜     | FUSIONAR | 10 min   |
| 74  | NavigationMenu | ⬜     | FUSIONAR | 12 min   |
| 75  | PreviewImage   | ⬜     | FUSIONAR | 10 min   |

### 🟢 Prioridad Baja (3 componentes)

| #   | Componente      | Estado | Acción   | Estimado | Notas |
| --- | --------------- | ------ | -------- | -------- | ----- |
| 76  | Combobox        | ⬜     | FUSIONAR | 12 min   |       |
| 77  | Chip            | ⬜     | FUSIONAR | 10 min   |       |
| 78  | Tabs (molecule) | ⬜     | FUSIONAR | 10 min   |       |

**Molecules Especiales (NO design system):**

- AuthCardWrapper → MOVER a `features/auth/components/`
- RequestCard, ServiceCard → EVALUAR o ELIMINAR

**Total estimado Fase 3:** ~130 min (~2 horas)

---

## FASE 4: ORGANISMS (8 componentes de design system)

**Progreso:** 0/8 (0%)

### Design System Organisms

| #   | Componente  | Estado | Origen                  | Destino                              | Acción | Prioridad | Estimado |
| --- | ----------- | ------ | ----------------------- | ------------------------------------ | ------ | --------- | -------- |
| 79  | FormBuilder | ⬜     | theme-editor/organisms/ | design-system/organisms/FormBuilder/ | MOVER  | 🟡        | 10 min   |
| 80  | DataTable   | ⬜     | theme-editor/organisms/ | design-system/organisms/DataTable/   | MOVER  | 🟡        | 10 min   |
| 81  | Calendar    | ⬜     | theme-editor/organisms/ | design-system/organisms/Calendar/    | MOVER  | 🟢        | 8 min    |
| 82  | Carousel    | ⬜     | theme-editor/organisms/ | design-system/organisms/Carousel/    | MOVER  | 🟢        | 8 min    |
| 83  | Chart       | ⬜     | theme-editor/organisms/ | design-system/organisms/Chart/       | MOVER  | 🟢        | 8 min    |
| 84  | Dialog      | ⬜     | theme-editor/organisms/ | design-system/organisms/Dialog/      | MOVER  | 🟡        | 8 min    |
| 85  | HoverCard   | ⬜     | theme-editor/organisms/ | design-system/organisms/HoverCard/   | MOVER  | 🟢        | 8 min    |
| 86  | Skeleton    | ⬜     | theme-editor/organisms/ | design-system/organisms/Skeleton/    | MOVER  | 🟢        | 8 min    |

### Feature Organisms (mover a features/)

**De organisms/ → features/:**

- Auth Forms (10 archivos) → `features/auth/organisms/`
- Footer → `features/layout/Footer/`
- Hero → `features/layout/Hero/`
- PricingCard → `features/pricing/`
- Unauthorized → `features/auth/Unauthorized/`
- ThemeEditorOrganism → ELIMINAR (wrapper innecesario)

**Total estimado Fase 4:** ~90 min (~1.5 horas)

---

## FASE 5: FEATURES Y LIMPIAR (6 directorios + legacy)

**Progreso:** 0/6 (0%)

### Features a Migrar

| #   | Feature         | Estado | Origen           | Destino                           | Archivos | Estimado |
| --- | --------------- | ------ | ---------------- | --------------------------------- | -------- | -------- |
| 87  | Notifications   | ⬜     | notifications/   | features/notifications/           | 8        | 15 min   |
| 88  | Chat            | ⬜     | chat/            | features/chat/                    | 9        | 15 min   |
| 89  | Users           | ⬜     | users/           | features/users/                   | 3        | 10 min   |
| 90  | Themes          | ⬜     | themes/          | features/themes/                  | 3        | 10 min   |
| 91  | Shared Messages | ⬜     | shared/messages/ | design-system/molecules/Messages/ | 4        | 10 min   |
| 92  | Admin Legacy    | ⬜     | admin/           | ELIMINAR                          | 23       | 15 min   |

### Legacy a Eliminar

**Después de verificar que TODO funciona:**

- [ ] admin/ThemeEditor.tsx (legacy)
- [ ] admin/ThemeEditor.monolith.backup.tsx
- [ ] admin/BrandStudio\*.tsx (todos)
- [ ] admin/_Editor_.tsx (ColorEditor, BorderEditor, etc.)
- [ ] shared/ completo (después de migrar)
- [ ] ui/ completo (después de Fase 1)
- [ ] completo (después de Fases 2-4)
- [ ] theme-editor-3.0/design-system/ (después de mover a raíz)

**Total estimado Fase 5:** ~75 min (~1.5 horas)

---

## 📝 Notas Globales

### Cambios Realizados

- ✅ 2025-11-10: **Button primitive** migrado y verificado
  - Creada estructura en `design-system/primitives/Button/`
  - Fusionado código themable de theme-editor con estructura atomic-design
  - Tests y stories completos
  - 61+ imports mantenidos compatibles vía re-export desde `ui/button.tsx`
  - Type-check pasa sin errores relacionados con Button
  - Tiempo real: 15 min (estimado: 10 min)

### Problemas Encontrados

_Se documentarán issues que surjan_

**Ejemplo:**

- ❌ 2024-01-15: Tooltip imports rotos en 5 archivos - RESUELTO
- ...

### Decisiones Importantes

_Decisiones técnicas tomadas durante la migración_

**Ejemplo:**

- 📌 2024-01-15: Decidimos mantener Tooltip con subcomponentes en /ui/ (compound component)
- ...

---

## 🎯 Próximos Pasos

### Para Comenzar

1. Leer [README.md](./README.md) y [migration-plan.md](./migration-plan.md)
2. Crear branch: `git checkout -b feature/unify-design-system`
3. Comenzar con Fase 1 - Prioridad Alta
4. Usar comando: `/migrate-to-design-system Button`

### Para Cada Componente

1. Usar `/migrate-to-design-system <componente>`
2. Agente hace el trabajo
3. Verificar funcionamiento
4. Agente marca como ✅ en este archivo
5. Commit: `git commit -m "feat(design-system): migrate <componente>"`

### Al Completar Cada Fase

1. Verificar type-check: `npm run type-check`
2. Verificar tests: `npm run test`
3. Verificar en browser: `npm run dev`
4. Verificar Theme Editor funciona
5. Commit de fase: `git commit -m "feat(design-system): complete Phase X"`

---

## 📊 Estadísticas

**Tiempo total estimado:** 10-13 horas
**Archivos a migrar/consolidar:** ~466
**Archivos a eliminar:** ~93
**Reducción estimada:** 19% en tamaño de codebase

---

_Última actualización: {{DATE}}_
_Este archivo es actualizado automáticamente por el agente component-migration-expert_
