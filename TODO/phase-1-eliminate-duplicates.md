# Phase 1: Eliminate Duplicates Between Theme Editor and Alianza

## Goal

Remove duplicate files from `theme-editor-3.0/design-system/` by redirecting imports to existing alianza components and `primitives/ui/`.

## Status: DONE

### What Was Done

- 72 files deleted (55 primitive re-exports/locals, 11 duplicated atoms, 5 Button primitive files, 1 conflicting flat Toggle.tsx)
- 96 files modified (import path updates across theme-editor consumers)
- TypeScript: **0 errors** (`npx tsc --noEmit` passes cleanly)
- `primitives/ui/button.tsx` re-export chain updated to alianza Button
- Legacy variant/size mappings added to alianza Button for backward compatibility

### What Diverged From Original Plan

During implementation, we discovered significant API incompatibilities that prevented full replacement:

**Atoms — replaced 10 of 17 planned:**
- 10 replaced & deleted: Alert, Badge, ProgressBar, RadioButton, Separator, Slider, Spacer, Spinner, Toggle, Tooltip
- 7 kept (incompatible APIs): Button, Icon, CustomIcon, Input, Select, Avatar, Textarea
- 4 kept (unique, no alianza equiv): IconLibrary, IconUploader, Checkbox, ToggleGroup

**Molecules — kept all 12 (0 of 10 planned replacements):**
- All molecules are showcase-specific with preset systems and rich APIs (e.g., `CardMolecule` takes `title`, `description`, `actions[]`, `image`, `badge` props)
- Alianza molecules use Radix composition patterns — completely different API shape
- Not simple duplicates; they're purpose-built for the theme editor preview

---

## Tasks

### 1. Delete Pure Re-Export Primitives (~55 files) — DONE

Files in `design-system/primitives/` that re-exported from `primitives/ui/` or `-local` variants. Updated ~70 internal consumers to import directly, then deleted.

**Acceptance criteria:**
- [x] All internal consumers updated to import from `@/components/primitives/ui/`
- [x] 55 re-export files deleted (33 pure re-exports + 11 re-exports from -local + 9 replaceable -local + 2 unused)
- [x] TypeScript compilation passes
- [x] `command-local.tsx` and `pagination-local.tsx` preserved

### 2. Replace Design-System Atoms with Alianza — PARTIALLY DONE

| Atom | Status | Reason if Kept |
|---|---|---|
| Alert | Deleted | Alianza equivalent works |
| Badge | Deleted | Alianza equivalent works |
| ProgressBar | Deleted | Alianza equivalent works |
| RadioButton | Deleted | Alianza equivalent works |
| Separator | Deleted | Alianza equivalent works (uses `borderStyle` not `style`) |
| Slider | Deleted | Alianza equivalent works |
| Spacer | Deleted | Alianza equivalent works |
| Spinner | Deleted | Alianza equivalent works |
| Toggle | Deleted | Alianza equivalent works (fixed flat file conflict) |
| Tooltip | Deleted | Alianza equivalent works |
| Button | **Kept** | MemoizedButton, different variant system, showcase presets |
| Icon | **Kept** | Uses `icon: LucideIcon` component prop vs alianza's `name: string` |
| CustomIcon | **Kept** | Depends on design-system Icon API |
| Input | **Kept** | MemoizedInput, different props (`isInvalid`, `showPasswordToggle`) |
| Select | **Kept** | MemoizedSelect, different options API, `isInvalid` |
| Avatar | **Kept** | Uses initials prop + color generation vs alianza's Radix composition |
| Textarea | **Kept** | AutosizeTextarea with different API |
| IconLibrary | **Kept** | Unique utility (no alianza equiv) |
| IconUploader | **Kept** | Unique component (no alianza equiv) |
| Checkbox | **Kept** | No alianza equivalent |
| ToggleGroup | **Kept** | No alianza equivalent |

**Acceptance criteria:**
- [x] 10 atom files deleted
- [x] Showcase imports updated where atoms were replaced
- [x] atoms/index.ts updated
- [x] TypeScript compilation passes

### 3. Design-System Molecules — KEPT (Decision Changed)

All 12 molecules kept in design-system. They are showcase-specific components with preset systems, not simple duplicates. Their internal imports were updated to point to `primitives/ui/` instead of deleted design-system primitives.

### 4. Update Organisms Internal Imports — DONE

All 11 organisms updated to import from `@/components/primitives/ui/` and `@/components/atoms-alianza/` where applicable.

**Acceptance criteria:**
- [x] All organism imports point to correct sources
- [x] No organism references deleted files
- [x] CalendarOrganism fixed (calendar-local → calendar)

### 5. Handle Button External Dependency — DONE

`primitives/ui/button.tsx` now re-exports from `molecules-alianza/Button` instead of design-system.

**Acceptance criteria:**
- [x] `primitives/ui/button.tsx` imports from `molecules-alianza/Button`
- [x] MemoizedButton wrapper preserved for backward compat
- [x] `buttonVariants` utility function preserved
- [x] Legacy variant mappings added to alianza Button: `default→main`, `link→nude`, `loading→main`, `icon→main`
- [x] Legacy size mappings added: `default→md`, `icon→md`

### 6. Clean Up Directory Structure — DONE

**Acceptance criteria:**
- [x] Barrel exports updated (primitives/index.ts, atoms/index.ts, molecules/index.ts)
- [x] design-system/index.ts updated

### 7. Fix TypeScript Errors — DONE

Fixed 12 TypeScript errors caused by API mismatches during migration:
- [x] SeparatorShowcase: `style` → `borderStyle` (alianza Separator API)
- [x] ThemeNavigation: import Separator from alianza instead of primitives/ui
- [x] pagination.tsx: fixed PaginationLinkProps size type
- [x] DatePickerMolecule: `initialFocus` → `autoFocus` (react-day-picker v9), cast Calendar props
- [x] Toggle: deleted conflicting flat `atoms-alianza/Toggle.tsx` that shadowed `Toggle/index.ts`

---

## Current Design-System Structure (after Phase 1 + 1b)

```
design-system/
  atoms/                    (4 components — Phase 1b deleted 7 more)
    Checkbox.tsx            (kept — no alianza equiv)
    ToggleGroup.tsx         (kept — no alianza equiv)
    IconLibrary.ts          (kept — unique utility)
    IconUploader.tsx        (kept — unique component, uses alianza Icon/Input)
    index.ts
  molecules/                (11 components — BreadcrumbMolecule deleted in 1b)
    AccordionMolecule.tsx   (showcase preset wrapper)
    CardMolecule.tsx        (showcase preset wrapper)
    ChipMolecule.tsx        (showcase preset wrapper)
    ComboboxMolecule.tsx    (showcase preset wrapper)
    DatePickerMolecule.tsx  (showcase preset wrapper)
    DropdownMenuMolecule.tsx (showcase preset wrapper)
    NavigationMenuMolecule.tsx (showcase preset wrapper)
    PaginationMolecule.tsx  (showcase preset wrapper)
    PreviewImageMolecule.tsx (unique)
    SonnerMolecule.tsx      (unique toast)
    TabsMolecule.tsx        (showcase preset wrapper)
    index.ts
  organisms/                (all kept — showcase components)
  primitives/               (unique implementations)
    command-local.tsx
    pagination-local.tsx
    enhanced-color-picker-local.tsx
    enhanced-color-picker.tsx
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

- [x] TypeScript: `npx tsc --noEmit` — 0 errors
- [x] Tests: 248/248 design-system tests pass, 0 new failures (36 pre-existing failures unrelated to our changes)
- [x] Manual: Theme editor Átomos — Buttons, Inputs, Sliders, Separators, Badges all render correctly
- [x] Manual: Theme editor Moléculas — Cards, Dropdown Menu, Tabs, Accordion all render correctly
- [x] Manual: Theme editor Organismos — Form Builder, Calendar, Skeleton, Sidebar, Carousel, Chart, Data Table, Dialog all render correctly
- [x] Manual: App landing page renders correctly with alianza Button
- [x] Import check: no stale imports to deleted files

## Future Work

- **Phase 1b** — DONE. Unified remaining 7 atoms (Button, Icon, CustomIcon, Input, Select, Avatar, Textarea) + deleted BreadcrumbMolecule. See [phase-1b-unify-remaining-atoms.md](./phase-1b-unify-remaining-atoms.md).
- **Phase 2** — Extract unified components to `packages/ui` (`@alkitu/ui`). See [phase-2-extract-ui-package.md](./phase-2-extract-ui-package.md).
- **Phase 3** — Multi-brand theme configuration. See [phase-3-multi-brand-theming.md](./phase-3-multi-brand-theming.md).
