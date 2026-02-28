# Phase 1b: Unify Remaining Design-System Atoms with Alianza

## Goal

Migrate the 7 remaining design-system atoms to alianza equivalents by:
- Enhancing 2 alianza components (Icon, Input) to support missing features
- Updating ~55 consumer files to use alianza APIs
- Deleting 8 design-system atom files + 1 dead molecule

## Status: Complete

---

## Tier 1 — Direct Replacement (No Alianza Changes)

### CustomIcon (2 consumers) — Very Low Difficulty
APIs are nearly identical. Just swap import paths.

| File | Change |
|------|--------|
| `preview/design-system/atoms/IconShowcase.tsx` | Import from `atoms-alianza/CustomIcon` |
| `organisms/icon-uploader/IconUploaderOrganism.tsx` | Import from `atoms-alianza/CustomIcon` |

**Delete:** `design-system/atoms/CustomIcon.tsx`

### Avatar (3 consumers) — Low Difficulty
One prop rename: `shape` → `variant` (`'circle'→'circular'`).

| File | Change |
|------|--------|
| `preview/design-system/atoms/AvatarShowcase.tsx` | `shape` → `variant`, `'circle'→'circular'` |
| `primitives/nav-user.tsx` | Same pattern |
| `app/[lang]/components/user-card.tsx` | Same pattern |

**Delete:** `design-system/atoms/Avatar.tsx`

### Textarea (4 consumers) — Low Difficulty
`AutosizeTextarea` → `Textarea` with `autosize={true}`.

| File | Change |
|------|--------|
| `preview/design-system/atoms/TextareaShowcase.tsx` | `AutosizeTextarea` → `Textarea autosize` |
| `features/chat/InternalNotes.tsx` | Same pattern |
| `features/ChatWidget/components/ChatRating.tsx` | Same pattern |
| `features/chat/ReplyForm.tsx` | Same pattern |

**Delete:** `design-system/atoms/Textarea.tsx`

### Select (7 consumers) — Low Difficulty
`selectSize` → `size`. APIs otherwise identical.

| File | Change |
|------|--------|
| `preview/design-system/atoms/SelectShowcase.tsx` | `selectSize` → `size` |
| `__tests__/integration/theme-editor-integration.test.tsx` | `selectSize` → `size` |
| FormSelect molecule files (already wrapping alianza Select) | Minimal changes |

**Delete:** `design-system/atoms/Select.tsx`

### BreadcrumbMolecule (0 consumers) — Dead Code
**Delete:** `design-system/molecules/BreadcrumbMolecule.tsx`

---

## Tier 2 — Button Migration (8 consumers) — Medium Difficulty

No alianza enhancement needed — alianza Button already has legacy variant mappings from Phase 1.

### Prop Mapping
```
variant 'default' → 'main' (via variantMap)
variant 'icon' → 'main' + iconOnly={true}
variant 'link' → 'nude' (via variantMap)
variant 'loading' → 'main' + loading={true}
icon={<X/>} → iconLeft={<X/>}
size 'default' → 'md' (via sizeMap)
```

### Consumers
| File | Change |
|------|--------|
| `preview/design-system/atoms/ButtonShowcase.tsx` | Full showcase rewrite to alianza API |
| `design-system/organisms/FormBuilderOrganism.tsx` | `icon` → `iconLeft`, variant mapping |
| `design-system/organisms/FormBuilderOrganismSimple.tsx` | Same |
| `preview/design-system/atoms/RadioButtonShowcase.tsx` | Import swap |
| `preview/design-system/molecules/MoleculesShowcase.tsx` | Import swap |
| `preview/design-system/molecules/CardMolecule.tsx` | Import swap |
| `__tests__/integration/theme-editor-integration.test.tsx` | Import swap |
| `DEVELOPER-SETUP-GUIDE.md` | Update docs |

**Delete:** `design-system/atoms/Button.tsx`

---

## Tier 3 — Alianza Enhancements Required

### Icon Enhancement (29 consumers) — High Difficulty

**Enhancement to `atoms-alianza/Icon/Icon.tsx`:**
1. Add `component?: LucideIcon` prop to `IconProps`
2. When `component` is provided, render it directly (skip lazy loading)
3. When `name` is provided, keep existing dynamic import behavior
4. TypeScript: require at least one of `name` or `component`

**Variant mapping for consumers:**
- `'accent'` → `'secondary'`
- `'muted'` → `'default'`
- `'destructive'` → `'error'`

**Consumer prop changes:**
- `icon={Heart}` → `component={Heart}`
- `customColor="..."` → `color="..."`
- `customSize={N}` → remove (use size prop or style override)

**Delete:** `design-system/atoms/Icon.tsx`

### Input Enhancement (6 consumers) — Medium-High Difficulty

**Enhancement to `atoms-alianza/Input/Input.tsx`:**
1. Add `leftIcon?: React.ReactNode`
2. Add `rightIcon?: React.ReactNode`
3. Add `showPasswordToggle?: boolean`
4. Wrap `<input>` in relative container for icon positioning

**Consumer prop changes:**
- `isInvalid` → `state="error"`
- `isValid` → `state="success"`
- `isWarning` → `state="warning"`
- `inputSize` → `size`

**Delete:** `design-system/atoms/Input.tsx`

---

## Post-Migration: Remaining Design-System Structure

```
design-system/
  atoms/
    Checkbox.tsx             (no alianza equiv)
    ToggleGroup.tsx          (no alianza equiv)
    IconLibrary.ts           (unique utility)
    IconUploader.tsx          (unique, update Icon import)
    index.ts
  molecules/
    AccordionMolecule.tsx    (showcase preset wrapper)
    CardMolecule.tsx         (showcase preset wrapper)
    ChipMolecule.tsx         (showcase preset wrapper)
    ComboboxMolecule.tsx     (showcase preset wrapper)
    DatePickerMolecule.tsx   (showcase preset wrapper)
    DropdownMenuMolecule.tsx (showcase preset wrapper)
    NavigationMenuMolecule.tsx (showcase preset wrapper)
    PaginationMolecule.tsx   (showcase preset wrapper)
    PreviewImageMolecule.tsx (unique)
    SonnerMolecule.tsx       (unique toast)
    TabsMolecule.tsx         (showcase preset wrapper)
    index.ts
  organisms/                 (all kept — showcase components)
  primitives/                (all kept — unique implementations)
  index.ts
```

## Definition of Done

- [x] TypeScript: `npx tsc --noEmit` — 0 errors
- [x] Tests: 65/65 design-system tests pass, no new failures
- [x] Alianza Icon supports `component` prop alongside `name`
- [x] Alianza Input supports `leftIcon`, `rightIcon`, `showPasswordToggle`
- [x] 9 design-system atom files deleted (Button, Icon, CustomIcon, Input, Select, Avatar, Textarea + stale test/story files)
- [x] 1 dead molecule (BreadcrumbMolecule) deleted
- [x] No stale imports to deleted files (only markdown docs have old references)
- [x] Manual: Theme editor Átomos render correctly (20 atoms verified, all 3 tabs OK)
- [x] Manual: External consumers — landing page, dashboard, sidebar, Form Builder organism all work
