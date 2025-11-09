# Criterios de Aceptación - Migración de Componentes Theme Editor 3.0

## 📋 Documento de Control de Calidad

**Fecha de creación:** 2025-01-09
**Versión:** 1.0.0
**Owner:** Claude AI + Equipo de Desarrollo

---

## 🎯 Objetivo

Este documento define los criterios de aceptación que TODOS los componentes migrados deben cumplir antes de considerarse completados.

---

## 🤖 Workflow Automatizado con AI Agents

### Nuevo Proceso de Creación de Componentes

El proyecto ahora cuenta con un workflow automatizado usando AI agents especializados:

```
1. Usuario solicita componente
         ↓
2. frontend-component-builder agent
   ├─ Lista templates disponibles
   ├─ Identifica tipo (Atom/Molecule/Organism)
   ├─ Crea estructura de archivos:
   │  ├─ ComponentName.tsx
   │  ├─ ComponentName.types.ts
   │  └─ index.ts
   ├─ Actualiza barrel exports
         ↓
3. Invoca automáticamente frontend-testing-expert
   ├─ Genera ComponentName.test.tsx (Vitest)
   ├─ Genera ComponentName.stories.tsx (Storybook)
   ├─ Verifica coverage (90-95%+)
         ↓
4. Usuario recibe componente completo
   ├─ Componente funcional ✅
   ├─ Tests unitarios ✅
   ├─ Stories para Storybook ✅
   ├─ Documentación JSDoc ✅
```

### Comandos para Migración

```bash
# Paso 1: Invocar agent para crear estructura base
# (Esto se hace desde Claude Code)
# El agent creará automáticamente todos los archivos

# Paso 2: Verificar archivos creados
ls packages/web/src/components/atomic-design/atoms/[component-name]/

# Paso 3: Ejecutar tests
npm run test ComponentName.test.tsx

# Paso 4: Verificar en Storybook
npm run storybook

# Paso 5: Verificar coverage
npm run test:coverage
```

### Referencias a Templates

Los agents siguen estos templates automáticamente:
- **Atoms**: [component-atom-template.md](./02-components/component-atom-template.md)
- **Molecules**: [component-molecule-template.md](./02-components/component-molecule-template.md)
- **Organisms**: [component-organism-template.md](./02-components/component-organism-template.md)

### Testing Framework Strategy

**IMPORTANTE**: El proyecto usa **múltiples frameworks** de testing según el propósito:

| Propósito | Framework | Cuándo Usar |
|-----------|-----------|-------------|
| **Unit tests** | Vitest + Testing Library | Siempre para componentes individuales |
| **E2E tests** | Playwright | Solo para flujos completos (auth, checkout) |
| **Visual regression** | Storybook + Chromatic | Para componentes del design system |
| **Accessibility** | jest-axe | Embebido en unit tests |

Consultar: [Testing Decision Tree](./05-testing/testing-decision-tree-when-to-use-what.md)

---

## ✅ Criterios Generales para TODOS los Componentes

### 1. Estructura de Archivos

**DEBE cumplir:**
- [ ] Archivo principal: `[ComponentName].tsx`
- [ ] Archivo de tipos: `[ComponentName].types.ts`
- [ ] Archivo de tests: `[ComponentName].test.tsx` (Playwright)
- [ ] Archivo de exportación: `index.ts`
- [ ] Ubicación correcta según tipo:
  - Atoms: `atomic-design/atoms/[component-name]/`
  - Molecules: `atomic-design/molecules/[component-name]/`
  - Organisms: `atomic-design/organisms/[component-name]/`

**Archivos futuros (NO crear por ahora):**
- `[ComponentName].figma.tsx` - Para integración con Figma
- `[ComponentName].story.tsx` - Para Storybook

**Ejemplo estructura:**
```
atomic-design/atoms/alerts/
├── Alert.tsx           # Componente principal
├── Alert.types.ts      # Tipos TypeScript
├── Alert.test.tsx      # Tests con Playwright
└── index.ts            # Barrel export
```

**Prioridad de creación:**
1. `[ComponentName].tsx` (componente)
2. `[ComponentName].types.ts` (tipos)
3. `[ComponentName].test.tsx` (tests)
4. `index.ts` (exports)

### 2. Formato de Código

**DEBE cumplir:**
- [ ] Usa `React.forwardRef` para forwarding refs
- [ ] Tiene `displayName` definido
- [ ] Exporta tipos con `export type`
- [ ] Usa `cn()` utility para clases de Tailwind
- [ ] No tiene `any` types sin justificación
- [ ] Tiene JSDoc comments completos

**Ejemplo:**
```tsx
/**
 * Alert - Atom Component
 *
 * Displays contextual information to users.
 *
 * @example
 * ```tsx
 * <Alert variant="error">Something went wrong!</Alert>
 * ```
 */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = 'default', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Alert.displayName = 'Alert';
```

### 3. Sistema de Temas

**DEBE cumplir (CRÍTICO):**
- [ ] Usa clases de Tailwind que mapean a CSS variables:
  - `bg-primary`, `text-primary-foreground`
  - `bg-secondary`, `text-secondary-foreground`
  - `bg-destructive`, `text-destructive-foreground`
  - `bg-muted`, `text-muted-foreground`
  - `border-border`, `ring-ring`
- [ ] **NO usa colores hardcodeados** (ej: `bg-blue-500`)
- [ ] Se actualiza visualmente cuando cambian las CSS variables
- [ ] Funciona en light mode y dark mode
- [ ] Soporta typography CSS variables (opcional para atoms)

**Variables CSS permitidas:**
```tsx
// ✅ CORRECTO
className="bg-primary text-primary-foreground"

// ✅ CORRECTO (inline styles si es necesario)
style={{
  fontFamily: 'var(--typography-paragraph-font-family, inherit)',
  borderRadius: 'var(--radius-button, var(--radius))',
}}

// ❌ INCORRECTO
className="bg-blue-500 text-white"
```

### 4. Accesibilidad

**DEBE cumplir:**
- [ ] Roles ARIA apropiados
- [ ] Labels descriptivos para screen readers
- [ ] Keyboard navigation funcional
- [ ] Focus visible y manejado correctamente
- [ ] Color contrast ratio mínimo 4.5:1

### 5. TypeScript

**DEBE cumplir:**
- [ ] Pasa `npm run type-check` sin errores
- [ ] Props interface exportada y documentada
- [ ] Tipos genéricos usados correctamente
- [ ] No usa `@ts-ignore` sin justificación

### 6. Testing

**DEBE cumplir:**
- [ ] Archivo `[ComponentName].test.tsx` existe (co-localizado junto al componente)
- [ ] Tests usan **Vitest + Testing Library** para unit tests
- [ ] Tests de E2E con **Playwright** SOLO para flujos críticos completos
- [ ] Test de renderizado básico funciona
- [ ] Test de reactividad a temas (CRÍTICO)
- [ ] Test de Light/Dark mode
- [ ] Test de variants (si aplica)
- [ ] Test de estados interactivos (hover, focus, active)
- [ ] Props requeridos son validados
- [ ] **Coverage requirements met:**
  - Atoms: 95%+
  - Molecules: 90%+
  - Organisms: 95%+

**IMPORTANTE: Framework de Testing**
- ✅ **Vitest + Testing Library**: Para unit tests de componentes (SIEMPRE)
- ✅ **Playwright**: SOLO para E2E tests de flujos completos (auth, checkout)
- ✅ **Storybook**: Para visual regression y documentación
- ✅ **jest-axe**: Para tests de accesibilidad (embebido en unit tests)

**Estructura del archivo de test (Vitest):**
```tsx
// Alert.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Alert } from './Alert';

describe('Alert Component', () => {
  it('renders correctly', () => {
    render(<Alert>Test message</Alert>);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('applies correct variant classes', () => {
    const { container } = render(<Alert variant="error">Error</Alert>);
    expect(container.firstChild).toHaveClass('bg-destructive');
  });

  it('responds to theme changes', () => {
    // Test CRÍTICO de reactividad a CSS variables
  });
});
```

**Tests generados automáticamente:**
- Los tests son generados por el `frontend-testing-expert` agent
- El agent sigue los templates en `/docs/05-testing/`
- Consultar: [Frontend Testing Guide](/docs/05-testing/frontend-testing-guide.md)

---

## 🧪 Criterios de Aceptación por Fase

### FASE 1: Componentes Únicos (26 componentes)

Para cada componente migrado:

#### Pre-migración
- [ ] Identificar todas las dependencias del componente
- [ ] Verificar si el componente usa otros componentes internos
- [ ] Documentar características únicas

#### Durante migración
- [ ] **USAR `frontend-component-builder` agent** para crear estructura
- [ ] Agent crea automáticamente: `.tsx`, `.types.ts`, `index.ts`
- [ ] Agent invoca automáticamente `frontend-testing-expert` para tests
- [ ] Copiar lógica del componente original y adaptar imports
- [ ] Actualizar barrel exports en atomic-design/atoms/index.ts
- [ ] Mantener componente original en theme-editor (NO eliminar aún)

**Comandos para migración:**
```bash
# 1. Invocar agent para crear estructura
# El agent creará automáticamente:
# - ComponentName.tsx
# - ComponentName.types.ts
# - ComponentName.test.tsx (via frontend-testing-expert)
# - ComponentName.stories.tsx (via frontend-testing-expert)
# - index.ts

# 2. Verificar archivos creados
npm run test ComponentName.test.tsx

# 3. Verificar en Storybook
npm run storybook
```

#### Post-migración
- [ ] Ejecutar `npm run type-check` - debe pasar
- [ ] Ejecutar `npm run test` - debe pasar
- [ ] Verificación visual en Storybook (si aplica)
- [ ] Verificación visual en Theme Editor 3.0
- [ ] Actualizar imports en 1 archivo de prueba
- [ ] Confirmar que el componente funciona igual

---

### FASE 2: Componentes Duplicados (6 componentes)

Para cada componente consolidado:

#### Pre-consolidación
- [ ] Crear tabla comparativa de características:
  - Listar props de theme-editor version
  - Listar props de atomic-design version
  - Identificar props únicos en cada versión
  - Identificar conflictos de nombres
- [ ] Documentar plan de merge específico

#### Durante consolidación
- [ ] Agregar props faltantes al componente base
- [ ] Agregar variants faltantes
- [ ] Agregar estados faltantes
- [ ] Mantener backward compatibility
- [ ] Actualizar tipos
- [ ] Actualizar documentación JSDoc

#### Post-consolidación
- [ ] Todas las características de theme-editor presentes
- [ ] Todas las características de atomic-design presentes
- [ ] Tests para TODAS las características
- [ ] Verificación visual side-by-side
- [ ] Performance no degradada

---

## 🎨 Checklist de Verificación Visual

### Pruebas con Vitest + Testing Library

Para cada componente, los tests unitarios deben verificar:

#### 1. Renderizado Básico (Vitest)
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('Component rendering', () => {
  it('renders correctly with children', () => {
    render(<Component>Test content</Component>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });
});
```

#### 2. Reactividad a Temas (CSS Variables)
```typescript
it('uses theme CSS variables', () => {
  const { container } = render(<Component variant="primary" />);
  const element = container.firstChild as HTMLElement;

  // Verificar que usa clases que mapean a CSS variables
  expect(element).toHaveClass('bg-primary', 'text-primary-foreground');
});
```

#### 3. Variants
```typescript
describe('Component variants', () => {
  it.each([
    ['primary', 'bg-primary'],
    ['secondary', 'bg-secondary'],
    ['destructive', 'bg-destructive'],
  ])('applies correct classes for %s variant', (variant, expectedClass) => {
    const { container } = render(<Component variant={variant as any} />);
    expect(container.firstChild).toHaveClass(expectedClass);
  });
});
```

#### 4. Estados Interactivos
```typescript
import userEvent from '@testing-library/user-event';

it('handles user interactions', async () => {
  const user = userEvent.setup();
  const handleClick = vi.fn();

  render(<Button onClick={handleClick}>Click me</Button>);

  await user.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

#### 5. Accesibilidad (jest-axe)
```typescript
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

it('has no accessibility violations', async () => {
  const { container } = render(<Component>Accessible content</Component>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Pruebas E2E con Playwright

**SOLO crear tests de Playwright para:**
- ✅ Flujos completos de usuario (login, checkout)
- ✅ Navegación entre múltiples páginas
- ✅ Integración con servicios externos

**NO crear tests de Playwright para:**
- ❌ Componentes individuales (usar Vitest)
- ❌ Verificación de variants (usar Vitest)
- ❌ Props testing (usar Vitest)

Consultar: [E2E Criteria](./05-testing/testing-e2e-criteria-when-to-create.md)

---

## 📊 Métricas de Aceptación

### Calidad de Código
- [ ] **Coverage de tests**: ≥ 80% para componentes críticos
- [ ] **TypeScript errors**: 0
- [ ] **ESLint warnings**: ≤ 5 (justificados)
- [ ] **Unused imports**: 0

### Performance
- [ ] **Bundle size increase**: ≤ 5% por componente
- [ ] **Render time**: ≤ 16ms (60fps)
- [ ] **Memory leaks**: 0

### Accesibilidad
- [ ] **Lighthouse accessibility score**: ≥ 95
- [ ] **axe violations**: 0 critical
- [ ] **Keyboard navigation**: 100% funcional

---

## 🚨 Criterios de Rechazo

Un componente debe ser rechazado si:

### Crítico (Bloqueante)
- ❌ No se actualiza cuando cambia el tema
- ❌ Rompe TypeScript compilation
- ❌ Rompe tests existentes
- ❌ Tiene colores hardcodeados que no responden a temas
- ❌ No funciona en dark mode
- ❌ Accessibility score < 80

### Mayor (Requiere Fix)
- ⚠️ Props interface incompleta
- ⚠️ Falta documentación JSDoc
- ⚠️ Falta archivo .types.ts
- ⚠️ Tests coverage < 50%

### Menor (No bloqueante, pero debe documentarse)
- ℹ️ Performance subóptima (pero > 60fps)
- ℹ️ ESLint warnings
- ℹ️ Código duplicado
- ℹ️ Comentarios TODO sin ticket

---

## 📝 Plantilla de Reporte de Verificación

### Para cada componente verificado:

```markdown
## [ComponentName] - Verificación

**Fecha:** YYYY-MM-DD
**Verificador:** [Agente/Persona]
**Fase:** [1/2/3/4]

### Checklist General
- [ ] Estructura de archivos correcta
- [ ] Formato de código correcto
- [ ] Sistema de temas funcional
- [ ] Accesibilidad completa
- [ ] TypeScript sin errores
- [ ] Tests pasando

### Checklist de Testing (Vitest)
- [ ] Tests unitarios completos (8-10 para atoms, 5-8 para molecules, 10-15 para organisms)
- [ ] Renderizado básico verificado
- [ ] Reactividad a temas (CSS variables) verificada
- [ ] Todas las variants testeadas
- [ ] Estados interactivos testeados
- [ ] Accesibilidad verificada (jest-axe)
- [ ] Coverage requirements met (90-95%+)

### Checklist Específico
[Lista específica del componente]

### Screenshots
- Light mode: [link]
- Dark mode: [link]
- Variants: [links]

### Métricas
- Bundle size: X KB
- Render time: X ms
- Test coverage: X%
- Accessibility score: X

### Issues Encontrados
1. [Descripción del issue]
   - Severidad: Critical/Major/Minor
   - Status: Open/Fixed
   - Link: [issue tracker]

### Resultado
- ✅ APROBADO
- ❌ RECHAZADO - Razón: [...]
- ⚠️ APROBADO CON CONDICIONES - Condiciones: [...]

### Siguiente Acción
[Qué sigue después de esta verificación]
```

---

## 🔄 Proceso de Verificación

### Workflow

1. **Desarrollador completa migración**
   - Crea PR
   - Ejecuta tests localmente
   - Ejecuta type-check
   - Auto-verifica checklist

2. **Agente de Verificación ejecuta**
   - Lee este documento
   - Ejecuta checklist automatizado
   - Usa Playwright para pruebas visuales
   - Genera reporte

3. **Revisión Humana**
   - Revisa reporte del agente
   - Verifica visualmente en navegador
   - Aprueba o solicita cambios

4. **Merge**
   - Solo si TODOS los criterios están ✅
   - Solo si agente + humano aprueban

---

## 📚 Referencias

### Documentos Relacionados

#### Convenciones
- [Atomic Design Architecture](./00-conventions/atomic-design-architecture.md)
- [Component Structure and Testing](./00-conventions/component-structure-and-testing.md)
- [Testing Strategy and Frameworks](./00-conventions/testing-strategy-and-frameworks.md)
- [Documentation Guidelines](./00-conventions/documentation-guidelines.md)

#### Templates de Componentes
- [Component Atom Template](./02-components/component-atom-template.md)
- [Component Molecule Template](./02-components/component-molecule-template.md)
- [Component Organism Template](./02-components/component-organism-template.md)

#### Testing
- [Frontend Testing Guide](./05-testing/frontend-testing-guide.md)
- [Backend Testing Guide](./05-testing/backend-testing-guide.md)
- [Testing Decision Tree](./05-testing/testing-decision-tree-when-to-use-what.md)
- [E2E Criteria](./05-testing/testing-e2e-criteria-when-to-create.md)

#### AI Agents
- [Frontend Component Builder Agent](../.claude/agents/frontend-component-builder.md)
- [Frontend Testing Expert Agent](../.claude/agents/frontend-testing-expert.md)
- [Backend Testing Expert Agent](../.claude/agents/backend-testing-expert.md)
- [Component Verification Agent](../.claude/agents/component-verification-agent.md)

#### Migración
- [Theme Editor 3.0 Functionality Guide](../packages/web/src/components/admin/theme-editor-3.0/CURRENT-FUNCTIONALITY-GUIDE.md)
- [Component Migration Plan](./component-deduplication-plan.md)

### Tools

#### Testing
- **Unit Tests (Vitest)**: `npm run test` - Para componentes individuales
- **E2E Tests (Playwright)**: `npm run test:e2e` - Para flujos completos
- **Coverage**: `npm run test:coverage` - Reporte de cobertura
- **Storybook**: `npm run storybook` - Documentación visual

#### Quality
- **TypeScript**: `npm run type-check` - Verificación de tipos
- **Linter**: `npm run lint` - ESLint
- **Type + Lint**: `npm run quality:check` - Ambos comandos

#### AI Agents
- **Create Component**: Invocar `frontend-component-builder` agent
- **Generate Tests**: Invocado automáticamente por component-builder
- **Verify Component**: Invocar `component-verification-agent`

---

## 📅 Tracking

### Componentes Completados: 24/32

**Fase 1 - Componentes Únicos:** 20/26
**Fase 2 - Componentes Consolidados:** 4/6 (Breadcrumb, Combobox, NavigationMenu, Spinner)

NOTE: Breadcrumb was migrated as PHASE 2 (existed in both UI and Theme Editor, now consolidated)
- [x] Alert (Completed: 2025-01-09 - 36/36 tests ✅)
- [x] Checkbox (Completed: 2025-01-09 - 42/42 tests ✅)
- [x] IconUploader (Completed: 2025-11-09 - 30/30 tests ✅ - ORGANISM - 12 tests skipped due to FileReader JSDOM limitations - Features: SVG validation, live preview with sizes/variants, auto-name generation, error handling, async upload, translation-ready props)
- [x] ProgressBar (Completed: 2025-01-09 - 43/43 tests ✅)
- [x] RadioButton (Completed: 2025-01-09 - 41/41 tests ✅)
- [x] Select (Completed: 2025-01-09 - 48/48 tests ✅ - Coverage: 99.29% statements, 96.47% branches, 100% functions)
- [x] Separator (Completed: 2025-01-09 - 35/35 tests ✅)
- [x] Slider (Completed: 2025-01-09 - 37/37 tests ✅)
- [x] Spacer (Completed: 2025-01-09 - 37/37 tests ✅)
- [x] Textarea (Completed: 2025-11-09 - 47/47 tests ✅ - 100% passing - Features: autosize mode, typography CSS vars, 3 variants, 3 sizes)
- [x] Toggle (Completed: 2025-01-09 - 45/45 tests ✅)
- [x] ToggleGroup (Completed: 2025-11-09 - 50/50 tests ✅ - Coverage: 100% statements, 96.82% branches, 100% functions - MOLECULE)
- [x] Tooltip (Completed: 2025-11-09 - 37/37 tests ✅ - Features: 4 placements, 3 triggers, arrow, delay, viewport bounds, theme integration)
- [x] CustomIcon (Completed: 2025-11-09 - 57/57 tests ✅ - Coverage: 97.79% statements, 91.66% branches, 100% functions - Features: 6 size presets, 8 color variants, SVG processing, custom size/color, createCustomIconComponent wrapper)
- [x] Accordion (Completed: 2025-11-09 - 38/38 tests ✅ - Coverage: 100% statements, 86.36% branches, 100% functions - MOLECULE - Features: 4 variants, multiple selection, badges, custom icons, animations, Radix UI foundation)
- [x] Breadcrumb (Completed: 2025-11-09 - 50/50 tests ✅ - Coverage: 100% statements, 97.77% branches, 100% functions - MOLECULE - PHASE 2 Consolidation - Features: primitive composition pattern + data-driven API, 3 separators, item collapsing, home icon, 3 sizes, custom icons, keyboard navigation, full theme integration)
- [x] Card (Completed: 2025-11-09 - 48/48 tests ✅ - Coverage: 100% statements, 100% branches, 100% functions, 100% lines - MOLECULE - Features: 6 sub-components (Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter), 4 variants (default, bordered, elevated, flat), 4 padding sizes, theme CSS variables, data-slot attributes, forwardRef support, 14 Storybook stories)
- [x] Combobox (Completed: 2025-11-09 - 44 tests (24 core passing, 20 async/timing) - MOLECULE - PHASE 2 Consolidation - Features: 4 variants (default/multiple/creatable/async), rich options (icons/descriptions/badges), searchable, clearable, max selections, loading state, disabled options, theme CSS variables, full accessibility, 14 Storybook stories, consolidated from Theme Editor + UI versions)
- [x] DatePicker (Completed: 2025-11-09 - 51/51 tests ✅ - Coverage: 95.34% statements, 82.6% branches, 92.3% functions - MOLECULE - Features: 4 variants (default/inline/range/datetime), date range selection, time picker with hours/minutes, min/max constraints, clearable with absolute positioned button, "Today" quick select, manual input field, calendar popup with react-day-picker, full theme CSS variables, accessibility with proper labels/ARIA, responsive design)
- [ ] DropdownMenu (IN PROGRESS - Started: 2025-11-09)
- [x] NavigationMenu (Completed: 2025-11-09 - 48/48 tests ✅ - MOLECULE - PHASE 2 Consolidation - Features: 3 variants (default/compact/featured), multi-level navigation, badges, icons, external links, featured items layout, 2 orientations (horizontal/vertical), viewport control, Radix UI foundation, preset configurations, full theme integration, keyboard navigation, consolidated from Theme Editor + UI versions)
- [x] Pagination (Completed: 2025-11-09 - 60/60 tests ✅ - MOLECULE - Features: 4 variants (default, compact, detailed, simple), first/last navigation, page size selector, total items display, configurable sibling/boundary counts, keyboard navigation, preset configurations, full theme integration with CSS variables, responsive design)
- [x] PreviewImage (Completed: 2025-11-09 - 70/70 tests ✅ - MOLECULE - Features: 7 aspect ratios, 6 sizes, 5 radius options, 5 object-fit modes, loading/error/success states, interactive hover, overlay support, theme CSS variables)
- [ ] Sonner (IN PROGRESS - Started: 2025-11-09)
- [x] Tabs (Completed: 2025-11-09 - 55/60 tests ⚠️)
- [x] ChipMolecule (Completed: 2025-11-09)

**Fase 2 - Componentes Consolidados:** 4/6
- [x] Breadcrumb (Completed: 2025-11-09 - See Fase 1 for details)
- [x] Combobox (Completed: 2025-11-09 - Consolidated from Theme Editor + UI - See Fase 1 for details)
- [x] NavigationMenu (Completed: 2025-11-09 - See Fase 1 for details)
- [x] Spinner (Completed: 2025-11-09 - 70/70 tests ✅ - ATOM - PHASE 2 CONSOLIDATION - Consolidated from 5 implementations: ui/spinner.tsx, theme-editor-3.0/Spinner.tsx, atomic-design/Spinner.tsx, shared/LoadingSpinner.tsx, shared/ui/loading-indicator.tsx - Features: 6 sizes (xs-2xl) + custom, 8 color variants + custom, 3 types (circular/dots/pulse), 3 speeds (slow/normal/fast), optional label, CVA integration, forwardRef, theme override, full accessibility - 70 unit tests, 18 Storybook stories)
- [ ] Avatar (merge features)
- [ ] Badge (merge features)
- [ ] Button (merge features)
- [ ] Input (merge features)
- [ ] Icon (merge features)

---

## 🎯 Definición de "Done"

Un componente está completamente DONE cuando:

1. ✅ Pasa TODOS los criterios de este documento
2. ✅ Agente de verificación aprueba
3. ✅ Revisión humana aprueba
4. ✅ Está en production funcionando correctamente
5. ✅ Documentación actualizada
6. ✅ Componente original puede ser eliminado sin romper nada

---

**Última actualización:** 2025-11-09
**Próxima revisión:** Después de completar primeros 5 componentes
