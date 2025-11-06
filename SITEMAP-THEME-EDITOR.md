# SITEMAP THEME EDITOR 3.0

Este documento describe la arquitectura completa del **Theme Editor 3.0**, un sistema modular y autocontenido para la creación y personalización de temas con componentes UI basados en Shadcn UI y Tailwind CSS v4 (OKLCH).

## 🎯 Arquitectura de 4 Bloques Principales

El Theme Editor 3.0 está dividido en 4 bloques principales que conforman la interfaz de usuario:

1. **🟢 THEME SELECTOR** - Selector y navegación de temas (lado izquierdo superior)
2. **🔴 ACTIONS BAR** - Controles y acciones del editor (lado derecho superior)  
3. **🔵 THEME EDITOR** - Editor de propiedades del tema (lado izquierdo inferior)
4. **🟡 PREVIEW** - Vista previa de componentes (lado derecho inferior)

### Layout de la UI
```
┌─────────────────┬─────────────────┐
│  🟢 THEME       │  🔴 ACTIONS     │
│  SELECTOR       │  BAR            │
├─────────────────┼─────────────────┤
│                 │                 │
│  🔵 THEME       │  🟡 PREVIEW     │
│  EDITOR         │                 │
│                 │                 │
└─────────────────┴─────────────────┘
     ↑                    ↑
 Columna Izq.        Columna Der.
 (Redimensionable)
```

## 📁 Estructura de Archivos

```
theme-editor-3.0/
├── index.tsx                          # Layout principal con distribución de 4 bloques
├── types/                             # Definiciones de tipos globales
│   ├── index.ts                       # Export barrel
│   ├── theme.types.ts                 # Tipos del tema (OKLCH colors)
│   ├── viewport.types.ts              # Tipos de viewport/dispositivos
│   ├── editor.types.ts                # Tipos del editor
│   └── preview.types.ts               # Tipos del preview
├── hooks/                             # Hooks compartidos
│   ├── index.ts                       # Export barrel
│   ├── useTheme.ts                    # Hook principal del tema
│   ├── useThemeHistory.ts             # Hook para undo/redo (30 cambios)
│   ├── useViewport.ts                 # Hook para viewport/dispositivos
│   ├── useLayout.ts                   # Hook para manejador de columnas
│   └── useThemeImport.ts             # Hook para importación
├── context/                           # Context providers
│   ├── ThemeEditorContext.tsx         # Context principal del editor
│   ├── HistoryContext.tsx             # Context para historial de cambios
│   ├── ViewportContext.tsx            # Context para viewport activo
│   └── LayoutContext.tsx              # Context para layout/columnas
│
├── ui/                                # Componentes UI base (Shadcn UI wrappers)
│   ├── index.ts                       # Export barrel
│   ├── button.tsx                     # Re-export from @/components/ui/button
│   ├── input.tsx                      # Re-export from @/components/ui/input
│   ├── popover.tsx                    # Re-export from @/components/ui/popover
│   ├── dropdown-menu.tsx              # Re-export from @/components/ui/dropdown-menu
│   ├── tabs.tsx                       # Re-export from @/components/ui/tabs
│   ├── card.tsx                       # Re-export from @/components/ui/card
│   ├── badge.tsx                      # Re-export from @/components/ui/badge
│   ├── avatar.tsx                     # Re-export from @/components/ui/avatar
│   ├── checkbox.tsx                   # Re-export from @/components/ui/checkbox
│   ├── radio-group.tsx                # Re-export from @/components/ui/radio-group
│   ├── select.tsx                     # Re-export from @/components/ui/select
│   ├── slider.tsx                     # Re-export from @/components/ui/slider
│   ├── switch.tsx                     # Re-export from @/components/ui/switch
│   ├── separator.tsx                  # Re-export from @/components/ui/separator
│   ├── accordion.tsx                  # Re-export from @/components/ui/accordion
│   ├── alert.tsx                      # Re-export from @/components/ui/alert
│   ├── calendar.tsx                   # Re-export from @/components/ui/calendar
│   ├── carousel.tsx                   # Re-export from @/components/ui/carousel
│   ├── command.tsx                    # Re-export from @/components/ui/command
│   ├── dialog.tsx                     # Re-export from @/components/ui/dialog
│   ├── drawer.tsx                     # Re-export from @/components/ui/drawer
│   ├── form.tsx                       # Re-export from @/components/ui/form
│   ├── hover-card.tsx                 # Re-export from @/components/ui/hover-card
│   ├── menubar.tsx                    # Re-export from @/components/ui/menubar
│   ├── navigation-menu.tsx            # Re-export from @/components/ui/navigation-menu
│   ├── pagination.tsx                 # Re-export from @/components/ui/pagination
│   ├── progress.tsx                   # Re-export from @/components/ui/progress
│   ├── resizable.tsx                  # Re-export from @/components/ui/resizable
│   ├── scroll-area.tsx                # Re-export from @/components/ui/scroll-area
│   ├── sheet.tsx                      # Re-export from @/components/ui/sheet
│   ├── sidebar.tsx                    # Re-export from @/components/ui/sidebar
│   ├── skeleton.tsx                   # Re-export from @/components/ui/skeleton
│   ├── sonner.tsx                     # Re-export from @/components/ui/sonner
│   ├── table.tsx                      # Re-export from @/components/ui/table
│   ├── textarea.tsx                   # Re-export from @/components/ui/textarea
│   ├── tooltip.tsx                    # Re-export from @/components/ui/tooltip
│   ├── enhanced-color-picker.tsx      # Re-export from @/components/ui/enhanced-color-picker
│   └── simple-color-picker.tsx        # Re-export from @/components/ui/simple-color-picker
│
├── 1-theme-selector/                  # 🟢 BLOQUE 1: THEME SELECTOR
│   ├── index.tsx                      # ThemeSelector principal
│   ├── ThemeDropdown.tsx             # Dropdown con temas
│   ├── ThemeSearch.tsx               # Búsqueda de temas
│   ├── ThemePreview.tsx              # Vista previa con colores
│   ├── ThemeNavigation.tsx           # Flechas navegación
│   ├── SavedThemes.tsx               # Temas guardados
│   └── BuiltinThemes.tsx             # Temas predefinidos
│
├── 2-actions-bar/                     # 🔴 BLOQUE 2: ACTIONS BAR
│   ├── index.tsx                      # ActionsBar principal
│   ├── viewport-selector/             # Selector de dispositivos
│   │   ├── index.tsx                  # ViewportSelector principal
│   │   ├── ViewportButton.tsx         # Botón individual (TV, Desktop, Tablet, Smartphone)
│   │   └── ViewportIndicator.tsx      # Indicador activo
│   ├── theme-mode/                    # Modo claro/oscuro
│   │   ├── index.tsx                  # ThemeMode principal
│   │   └── ModeToggle.tsx             # Toggle switch
│   ├── history-controls/              # Deshacer/Rehacer
│   │   ├── index.tsx                  # HistoryControls principal
│   │   ├── UndoButton.tsx             # Botón deshacer
│   │   └── RedoButton.tsx             # Botón rehacer
│   ├── import-export/                 # Importar/Código
│   │   ├── index.tsx                  # ImportExport principal
│   │   ├── ImportButton.tsx           # Importar tema
│   │   └── CodeButton.tsx             # Ver/Exportar código
│   └── save-controls/                 # Guardar
│       ├── index.tsx                  # SaveControls principal
│       └── SaveButton.tsx             # Guardar tema
│
├── 3-theme-editor/                    # 🔵 BLOQUE 3: THEME EDITOR
│   ├── index.tsx                      # ThemeEditor principal con tabs
│   ├── navigation/                    # Navegación entre secciones
│   │   ├── index.tsx                  # EditorNavigation principal
│   │   └── EditorTabs.tsx             # Tabs de secciones
│   ├── colors/                        # Sistema de colores (OKLCH)
│   │   ├── index.tsx                  # ColorsEditor principal
│   │   ├── OklchColorPicker.tsx       # Picker OKLCH específico
│   │   ├── ColorPalette.tsx           # Paleta de colores
│   │   ├── ColorTokens.tsx            # Tokens de color (CSS vars)
│   │   └── ColorConverter.tsx         # Conversor HEX/HSL/OKLCH
│   ├── typography/                    # Sistema tipográfico
│   │   ├── index.tsx                  # TypographyEditor principal
│   │   ├── FontFamilySelector.tsx     # Selector de fuentes
│   │   ├── FontSizeScale.tsx          # Escala de tamaños
│   │   └── LineHeightControl.tsx      # Control de interlineado
│   ├── brand/                         # Identidad de marca
│   │   ├── index.tsx                  # BrandEditor principal
│   │   ├── LogoUploader.tsx           # Subida de logo
│   │   └── BrandColors.tsx            # Colores corporativos
│   ├── borders/                       # Sistema de bordes
│   │   ├── index.tsx                  # BordersEditor principal
│   │   ├── BorderRadius.tsx           # Radio de bordes
│   │   └── BorderWidth.tsx            # Grosor de bordes
│   ├── spacing/                       # Sistema de espaciado
│   │   ├── index.tsx                  # SpacingEditor principal
│   │   ├── SpacingScale.tsx           # Escala de espaciado
│   │   └── SpacingPreview.tsx         # Vista previa
│   ├── shadows/                       # Sistema de sombras
│   │   ├── index.tsx                  # ShadowsEditor principal
│   │   ├── ShadowEditor.tsx           # Editor de sombras
│   │   └── ShadowPresets.tsx          # Presets de sombras
│   └── scroll/                        # Sistema de scroll
│       ├── index.tsx                  # ScrollEditor principal
│       ├── ScrollbarCustomizer.tsx    # Customizador
│       └── ScrollBehavior.tsx         # Comportamiento
│
├── 4-preview/                         # 🟡 BLOQUE 4: PREVIEW
│   ├── index.tsx                      # Preview principal con tabs
│   ├── navigation/                    # Navegación entre vistas
│   │   ├── index.tsx                  # PreviewNavigation principal
│   │   └── PreviewTabs.tsx            # Tabs de vistas
│   ├── colors-preview/                # Preview de colores
│   │   ├── index.tsx                  # ColorsPreview principal
│   │   └── ColorSwatches.tsx          # Muestras de colores
│   ├── typography-preview/            # Preview de tipografía
│   │   ├── index.tsx                  # TypographyPreview principal
│   │   └── FontSamples.tsx            # Muestras de fuentes
│   ├── brand-preview/                 # Preview de marca
│   │   ├── index.tsx                  # BrandPreview principal
│   │   └── BrandShowcase.tsx          # Showcase de marca
│   ├── atomos-preview/                # Preview de átomos (USA ui/ folder)
│   │   ├── index.tsx                  # AtomosPreview principal
│   │   ├── ButtonsShowcase.tsx        # Showcase usando ui/button.tsx
│   │   ├── InputsShowcase.tsx         # Showcase usando ui/input.tsx
│   │   ├── BadgesShowcase.tsx         # Showcase usando ui/badge.tsx
│   │   ├── CheckboxesShowcase.tsx     # Showcase usando ui/checkbox.tsx
│   │   ├── SwitchesShowcase.tsx       # Showcase usando ui/switch.tsx
│   │   ├── SlidersShowcase.tsx        # Showcase usando ui/slider.tsx
│   │   ├── AvatarsShowcase.tsx        # Showcase usando ui/avatar.tsx
│   │   ├── ProgressShowcase.tsx       # Showcase usando ui/progress.tsx
│   │   ├── AlertsShowcase.tsx         # Showcase usando ui/alert.tsx
│   │   └── SeparatorsShowcase.tsx     # Showcase usando ui/separator.tsx
│   ├── moleculas-preview/             # Preview de moléculas (USA ui/ folder)
│   │   ├── index.tsx                  # MoleculasPreview principal
│   │   ├── AccordionsShowcase.tsx     # Showcase usando ui/accordion.tsx
│   │   ├── CardsShowcase.tsx          # Showcase usando ui/card.tsx
│   │   ├── TabsShowcase.tsx           # Showcase usando ui/tabs.tsx
│   │   ├── DropdownMenusShowcase.tsx  # Showcase usando ui/dropdown-menu.tsx
│   │   ├── CalendarsShowcase.tsx      # Showcase usando ui/calendar.tsx
│   │   ├── CarouselsShowcase.tsx      # Showcase usando ui/carousel.tsx
│   │   ├── NavigationMenusShowcase.tsx # Showcase usando ui/navigation-menu.tsx
│   │   ├── PaginationShowcase.tsx     # Showcase usando ui/pagination.tsx
│   │   └── ToastersShowcase.tsx       # Showcase usando ui/sonner.tsx
│   └── organismos-preview/            # Preview de organismos (USA ui/ folder)
│       ├── index.tsx                  # OrganismosPreview principal
│       ├── DialogsShowcase.tsx        # Showcase usando ui/dialog.tsx
│       ├── DrawersShowcase.tsx        # Showcase usando ui/drawer.tsx
│       ├── SheetsShowcase.tsx         # Showcase usando ui/sheet.tsx
│       ├── SidebarsShowcase.tsx       # Showcase usando ui/sidebar.tsx
│       ├── CommandsShowcase.tsx       # Showcase usando ui/command.tsx
│       ├── FormsShowcase.tsx          # Showcase usando ui/form.tsx
│       ├── TablesShowcase.tsx         # Showcase usando ui/table.tsx
│       ├── HoverCardsShowcase.tsx     # Showcase usando ui/hover-card.tsx
│       ├── MenuBarsShowcase.tsx       # Showcase usando ui/menubar.tsx
│       └── SkeletonsShowcase.tsx      # Showcase usando ui/skeleton.tsx
│
├── layout/                            # Componentes de layout
│   ├── index.tsx                      # Layout principal
│   ├── ResizableColumns.tsx           # Columnas redimensionables (usa ui/resizable.tsx)
│   ├── ColumnResizer.tsx              # Manejador de redimensión
│   └── LayoutProvider.tsx             # Provider de layout
│
├── utils/                             # Utilidades autocontenidas
│   ├── index.ts                       # Export barrel
│   ├── theme-generator.ts             # Generador de temas (OKLCH)
│   ├── oklch-converter.ts             # Conversor OKLCH/HEX/HSL
│   ├── css-var-generator.ts           # Generador de variables CSS
│   ├── code-exporter.ts               # Exportador de código
│   ├── token-parser.ts                # Parser de tokens
│   ├── history-manager.ts             # Gestor de historial (30 cambios)
│   ├── viewport-utils.ts              # Utilidades de viewport
│   └── validation.ts                  # Validaciones
│
├── constants/                         # Constantes del módulo
│   ├── index.ts                       # Export barrel
│   ├── default-theme.ts               # Tema por defecto (OKLCH)
│   ├── oklch-color-spaces.ts          # Espacios de color OKLCH
│   ├── viewport-sizes.ts              # Tamaños de viewport
│   ├── editor-sections.ts             # Secciones del editor
│   ├── preview-sections.ts            # Secciones del preview
│   └── history-config.ts              # Configuración del historial
│
└── assets/                            # Assets del módulo
    ├── icons/                         # Iconos específicos del editor
    │   ├── viewport-icons.tsx         # Iconos de TV, Desktop, Tablet, Smartphone
    │   └── action-icons.tsx           # Iconos de acciones
    └── themes/                        # Temas predefinidos
        ├── default-themes.ts          # Temas por defecto (OKLCH)
        └── theme-presets.ts           # Presets de temas
```

## 🎨 Características Técnicas

### Tecnologías Base
- **React 18** - Framework principal
- **TypeScript** - Tipado estático
- **Shadcn UI** - Sistema de componentes base
- **Tailwind CSS v4** - Framework CSS con soporte OKLCH
- **OKLCH Color Space** - Espacio de color moderno para mejor precisión

### Arquitectura de Colores
- **Variables CSS** - Sistema basado en custom properties
- **OKLCH Support** - Colores modernos con mejor percepción visual
- **Dynamic Theming** - Cambio dinámico entre modo claro y oscuro
- **Color Tokens** - Sistema de tokens para consistencia

### Funcionalidades Principales

#### 🟢 Theme Selector
- Búsqueda de temas predefinidos
- Navegación con flechas
- Vista previa con colores
- Temas guardados y favoritos

#### 🔴 Actions Bar
- Selector de viewport (TV, Desktop, Tablet, Smartphone)
- Toggle modo claro/oscuro
- Historial undo/redo (30 cambios)
- Importar/Exportar código
- Guardar temas

#### 🔵 Theme Editor
- **Colors** - Editor OKLCH con conversores
- **Typography** - Fuentes, tamaños, interlineado
- **Brand** - Logo y colores corporativos
- **Borders** - Radio y grosor de bordes
- **Spacing** - Escala de espaciado
- **Shadows** - Editor y presets de sombras
- **Scroll** - Customizador de scroll

#### 🟡 Preview
- **Colors Preview** - Paletas y swatches
- **Typography Preview** - Muestras tipográficas
- **Brand Preview** - Showcase de marca
- **Átomos** - Componentes básicos (buttons, inputs, etc.)
- **Moléculas** - Componentes intermedios (cards, tabs, etc.)
- **Organismos** - Componentes complejos (dialogs, tables, etc.)

## 🔧 Principios de Diseño

### Modularidad
- Cada bloque es independiente y reutilizable
- Componentes autocontenidos sin dependencias externas
- Fácil migración a otros proyectos

### Escalabilidad
- Arquitectura preparada para nuevos componentes
- Sistema de tipos extensible
- Hooks reutilizables para lógica común

### Consistencia
- Uso uniforme de Shadcn UI
- Patrones de naming claros
- Export barrels para imports limpios

### Performance
- Lazy loading por secciones
- Optimización de re-renders
- Gestión eficiente del estado

## 🚀 Flujo de Trabajo

1. **Selección de Tema** - Elegir tema base desde Theme Selector
2. **Configuración de Viewport** - Seleccionar dispositivo target
3. **Edición de Propiedades** - Modificar colors, typography, etc.
4. **Vista Previa en Tiempo Real** - Ver cambios en componentes
5. **Exportación** - Generar código CSS/JSON
6. **Guardado** - Persistir tema personalizado

## 📋 Notas de Implementación

- Todos los componentes UI son wrappers de Shadcn UI
- Los previews reutilizan la carpeta `ui/` (no duplican componentes)
- El sistema de colores está optimizado para OKLCH
- El historial mantiene 30 cambios máximo
- Layout redimensionable entre columnas izquierda y derecha
- Soporte completo para modo claro y oscuro
- Exportación compatible con Tailwind CSS v4

## 🚨 REGLAS CRÍTICAS DE DESARROLLO

### ⚠️ Reglas de Docker y Build
- **NUNCA hacer build** - El proyecto se ejecuta con Docker
- **NO usar comandos npm run build** - Docker maneja la compilación
- **Desarrollo solo con npm run dev** - Hot reload en Docker

### 🔒 Autocontención Total
Este módulo debe ser **100% autocontenido** y no depender de archivos externos a la carpeta `theme-editor-3.0/`:

#### ✅ Dependencias Permitidas
- Componentes de `ui/` folder (re-exportados localmente)
- React hooks nativos (`useState`, `useEffect`, etc.)
- TypeScript tipos nativos
- Utilidades estándar de JavaScript

#### ❌ Dependencias PROHIBIDAS
- Importaciones fuera de `theme-editor-3.0/`
- Dependencias de otros componentes del proyecto
- Contextos globales externos
- Stores externos (Zustand, Redux, etc.)
- APIs externas no autocontenidas

### 📋 Auditoría de Dependencias
Cada **2 semanas** realizar análisis de dependencias:
1. **Buscar imports externos** con `grep -r "from ['\"]@/"`
2. **Enumerar dependencias encontradas**
3. **Proponer internalización** de cada dependencia
4. **Documentar en este archivo** las dependencias actuales

#### 🔍 Análisis Actual de Dependencias (Última revisión: 3 Agosto 2025)

**🚨 DEPENDENCIAS EXTERNAS DETECTADAS:**

1. **@/components/ui/*** (79 importaciones detectadas)
   - **Estado:** ❌ CRÍTICO - Dependencia externa masiva
   - **Archivos afectados:** Prácticamente todos los componentes
   - **Solución:** Crear carpeta `ui/` con re-exports locales
   - **Prioridad:** ALTA - Bloquea migración

2. **@/lib/utils** (1 importación detectada)
   - **Estado:** ❌ PENDIENTE - Función `cn` utilizada
   - **Archivo afectado:** `layout/ResizableLayout.tsx`
   - **Solución:** Crear `utils/cn.ts` interno
   - **Prioridad:** MEDIA

3. **culori** (1 importación detectada)
   - **Estado:** ✅ PERMITIDO - Librería npm estándar
   - **Archivo afectado:** `utils/color-conversions-v2.ts`
   - **Nota:** Solo types, no implementación
   - **Prioridad:** BAJA

**📊 MÉTRICAS CRÍTICAS:**
- **Total dependencias externas:** 81
- **Componentes UI afectados:** 79 (98.8%)
- **Autocontención actual:** 2% (CRÍTICO)
- **Meta objetivo:** 100% autocontención

**🎯 PLAN DE AUTOCONTENCIÓN:**

```typescript
// Estructura requerida para autocontención:
theme-editor-3.0/
├── ui/                          # ❌ PENDIENTE: Crear esta carpeta
│   ├── button.tsx               # Re-export de @/components/ui/button
│   ├── input.tsx                # Re-export de @/components/ui/input
│   ├── card.tsx                 # Re-export de @/components/ui/card
│   ├── tabs.tsx                 # Re-export de @/components/ui/tabs
│   ├── dialog.tsx               # Re-export de @/components/ui/dialog
│   ├── [... 25+ componentes más]
│   └── index.ts                 # Export barrel
├── utils/
│   ├── cn.ts                    # ❌ PENDIENTE: Implementación local
│   └── index.ts                 # Export barrel actualizado
```

### 🎨 Control Total de Elementos

#### 🎯 Colores Personalizados
- **Archivo:** `constants/default-theme.ts`
- **Formato:** Variables CSS con OKLCH
- **Control:** Todas las clases de color deben estar definidas localmente
- **No usar:** Clases de Tailwind por defecto sin redefinir

#### 📝 Tipografía Personalizada  
- **Archivo:** `constants/typography-system.ts` (crear si no existe)
- **Control:** Todas las familias, tamaños y pesos tipográficos
- **Variables:** CSS custom properties para tipografía
- **No usar:** Clases de Tailwind por defecto

#### ⚛️ Átomos y Componentes
- **Carpeta:** `ui/` (re-exports de Shadcn UI)
- **Control:** Cada componente debe tener override local
- **Personalización:** Todos los estilos en variables CSS
- **Migración:** Fácil cambio de design system

#### 🧩 Sistema de Tokens
```typescript
// Estructura de control obligatoria:
theme-editor-3.0/
├── constants/
│   ├── color-tokens.ts      # Todos los colores
│   ├── typography-tokens.ts # Toda la tipografía  
│   ├── spacing-tokens.ts    # Todo el espaciado
│   ├── border-tokens.ts     # Todos los bordes
│   ├── shadow-tokens.ts     # Todas las sombras
│   └── component-tokens.ts  # Tokens de componentes
```

### 🔄 Migración a Otros Proyectos
Para asegurar migración fácil:
1. **Copiar carpeta completa** `theme-editor-3.0/`
2. **Verificar dependencias** en archivo de análisis
3. **Instalar solo dependencias npm** listadas
4. **Configurar variables CSS** en proyecto destino
5. **Testing completo** de funcionalidades

### 📊 Métricas de Autocontención
- **Meta:** 0 dependencias externas
- **Actual:** 81 dependencias externas (CRÍTICO)
- **Autocontención:** 2% (98% dependiente)
- **Próxima revisión:** Cada 2 semanas
- **Última actualización:** 3 Agosto 2025

### 🔍 Comandos de Validación
Ejecutar cada 2 semanas para validar autocontención:

```bash
# 1. Buscar todas las dependencias @/ 
cd packages/web/src/components/admin/theme-editor-3.0
grep -r "from ['\"]@/" . --include="*.tsx" --include="*.ts"

# 2. Contar dependencias externas
grep -r "from ['\"]@/" . --include="*.tsx" --include="*.ts" | wc -l

# 3. Listar archivos dependientes
grep -r "from ['\"]@/" . --include="*.tsx" --include="*.ts" | cut -d: -f1 | sort | uniq

# 4. Verificar imports de librerías externas (no npm)
grep -r "from ['\"]../" . --include="*.tsx" --include="*.ts"
```

### 🚨 ALERTA DE AUTOCONTENCIÓN
**ESTADO ACTUAL: CRÍTICO**
- ❌ No es migrable a otros proyectos
- ❌ 79 componentes UI externos
- ❌ Dependencias de @/lib/utils
- ⚠️ Requiere refactoring masivo para autocontención

**PRÓXIMOS PASOS OBLIGATORIOS:**
1. Crear carpeta `ui/` con todos los re-exports
2. Implementar `utils/cn.ts` local
3. Actualizar todos los imports internos
4. Validar autocontención al 100%

---

**Autor:** Theme Editor 3.0 Team  
**Versión:** 1.0.0  
**Fecha:** 3 Agosto 2025  
**Reglas actualizadas:** 3 Agosto 2025