# Phase 1: Eliminate Duplicates Between Theme Editor and Alianza

## Goal

Remove ~72 duplicate files from `theme-editor-3.0/design-system/` by redirecting imports to existing alianza components and `primitives/ui/`.

## Tasks

### 1. Delete Pure Re-Export Primitives (~36 files)

Files in `design-system/primitives/` that just do `export * from '@/components/primitives/ui/X'`. Update their ~15 internal consumers to import from `@/components/primitives/ui/` directly, then delete.

**Files to delete:** `accordion.tsx`, `alert-dialog.tsx`, `alert.tsx`, `aspect-ratio.tsx`, `avatar.tsx`, `badge.tsx`, `breadcrumb.tsx`, `calendar.tsx`, `card.tsx`, `carousel.tsx`, `checkbox.tsx`, `collapsible.tsx`, `context-menu.tsx`, `dialog.tsx`, `drawer.tsx`, `dropdown-menu.tsx`, `form.tsx`, `hover-card.tsx`, `input.tsx`, `input-otp.tsx`, `label.tsx`, `menubar.tsx`, `navigation-menu.tsx`, `pagination.tsx`, `popover.tsx`, `progress.tsx`, `radio-group.tsx`, `resizable.tsx`, `scroll-area.tsx`, `select.tsx`, `separator.tsx`, `sheet.tsx`, `sidebar.tsx`, `skeleton.tsx`, `slider.tsx`, `sonner.tsx`, `switch.tsx`, `table.tsx`, `textarea.tsx`, `toggle.tsx`, `toggle-group.tsx`, `tooltip.tsx`

**Acceptance criteria:**
- [ ] All internal consumers updated to import from `@/components/primitives/ui/`
- [ ] All re-export files deleted
- [ ] TypeScript compilation passes

### 2. Delete Replaceable `-local` Variants (9 files)

These differ from `primitives/ui/` only in their `cn` import path. Update consumers, then delete.

**Files to delete:** `dialog-local.tsx`, `popover-local.tsx`, `tabs-local.tsx`, `slider-local.tsx`, `switch-local.tsx`, `separator-local.tsx`, `progress-local.tsx`, `tooltip-local.tsx`, `calendar-local.tsx`

**Files to KEEP:** `command-local.tsx` (custom implementation), `pagination-local.tsx` (uses local Button)

**Acceptance criteria:**
- [ ] Consumers of deleted -local files updated to use `primitives/ui/` equivalents
- [ ] 9 -local files deleted
- [ ] `command-local.tsx` and `pagination-local.tsx` preserved

### 3. Replace 17 Design-System Atoms with Alianza Imports

| Design-System Atom | Replace With |
|---|---|
| Alert | `atoms-alianza/Alert` |
| Avatar | `atoms-alianza/Avatar` |
| Badge | `atoms-alianza/Badge` |
| Button | `molecules-alianza/Button` |
| CustomIcon | `atoms-alianza/CustomIcon` |
| Icon | `atoms-alianza/Icon` |
| Input | `atoms-alianza/Input` |
| ProgressBar | `atoms-alianza/ProgressBar` |
| RadioButton | `atoms-alianza/RadioButton` |
| Select | `atoms-alianza/Select` |
| Separator | `atoms-alianza/Separator` |
| Slider | `atoms-alianza/Slider` |
| Spacer | `atoms-alianza/Spacer` |
| Spinner | `atoms-alianza/Spinner` |
| Textarea | `atoms-alianza/Textarea` |
| Toggle | `atoms-alianza/Toggle` |
| Tooltip | `atoms-alianza/Tooltip` |

**Keep in design-system:** IconLibrary.ts, IconUploader.tsx, Checkbox.tsx, ToggleGroup.tsx

**Acceptance criteria:**
- [ ] All showcase files updated to use alianza imports
- [ ] All editor files updated to use alianza imports
- [ ] 17 atom files deleted
- [ ] 4 unique atoms preserved
- [ ] atoms/index.ts updated

### 4. Replace 10 Design-System Molecules with Alianza Imports

| Design-System Molecule | Replace With |
|---|---|
| AccordionMolecule | `molecules-alianza/Accordion` |
| BreadcrumbMolecule | `molecules-alianza/Breadcrumb` |
| CardMolecule | `molecules-alianza/Card` |
| ChipMolecule | `atoms-alianza/Chip` |
| ComboboxMolecule | `molecules-alianza/Combobox` |
| DatePickerMolecule | `molecules-alianza/DatePicker` |
| DropdownMenuMolecule | `molecules-alianza/DropdownMenu` |
| NavigationMenuMolecule | `molecules-alianza/NavigationMenu` |
| PaginationMolecule | `molecules-alianza/Pagination` |
| TabsMolecule | `molecules-alianza/TabsAlianza` |

**Keep:** PreviewImageMolecule (unique), SonnerMolecule (unique toast with `useThemeEditor`)

**Acceptance criteria:**
- [ ] All showcase files updated to use alianza imports
- [ ] 10 molecule files deleted
- [ ] 2 unique molecules preserved
- [ ] molecules/index.ts updated

### 5. Update Organisms Internal Imports

All 10 organisms are unique showcase components. Update their imports from `../atoms/X` and `../molecules/X` to point to alianza equivalents.

**Acceptance criteria:**
- [ ] All organism imports point to alianza
- [ ] No organism references deleted design-system atoms/molecules

### 6. Handle Button External Dependency

`primitives/ui/button.tsx` re-exports Button from design-system. Update to re-export from alianza instead.

**Acceptance criteria:**
- [ ] `primitives/ui/button.tsx` imports from `molecules-alianza/Button`
- [ ] All 108+ external Button consumers work without changes
- [ ] Alianza Button supports all required variants: default, outline, ghost, destructive, secondary, link, icon, loading

### 7. Clean Up Directory Structure

Delete migrated files, update barrel exports, verify final structure.

**Final design-system structure:**
```
design-system/
  atoms/
    IconLibrary.ts
    IconUploader.tsx
    Checkbox.tsx
    ToggleGroup.tsx
    index.ts
  molecules/
    SonnerMolecule.tsx
    PreviewImageMolecule.tsx
    index.ts
  organisms/              (all 10 kept)
  primitives/
    command-local.tsx
    pagination-local.tsx
    enhanced-color-picker-local.tsx
    color-selector-popover.tsx
    custom-scrollbar.tsx
    CheckboxRadiusModal.tsx
    utils.ts
    index.ts
  components/
    ComponentSearchFilter.tsx
  index.ts
```

## Definition of Done

- [ ] TypeScript: `npx tsc --noEmit` passes with no new errors
- [ ] Tests: `npm run test` passes
- [ ] Manual: Theme editor preview renders all components correctly
- [ ] Manual: App pages using Button render correctly
- [ ] Manual: Changing theme in editor updates all preview components
- [ ] Import check: `grep -r "design-system/atoms" packages/web/src/` shows only kept components
