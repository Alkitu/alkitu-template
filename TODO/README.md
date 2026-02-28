# Design System Unification — Multi-Phase Plan

## Overview

Unify duplicate UI components across the theme editor (`theme-editor-3.0/design-system/`) and the alianza component libraries (`atoms-alianza/`, `molecules-alianza/`), then extract a shared `@alkitu/ui` package for multi-brand reuse.

## Phases

| Phase | Description | Status | Details |
|-------|-------------|--------|---------|
| [Phase 1](./phase-1-eliminate-duplicates.md) | Eliminate duplicates between theme editor and alianza | **Done** | 72 files deleted, 0 TS errors, QA passed |
| [Phase 1b](./phase-1b-unify-remaining-atoms.md) | Unify remaining 7 atoms + enhance alianza Icon/Input | **Done** | Enhanced Icon (`component` prop) & Input (`leftIcon`, `rightIcon`, `showPasswordToggle`), deleted 9 atom files + 1 molecule, 0 TS errors |
| [Phase 2](./phase-2-extract-ui-package.md) | Extract unified components to `packages/ui` (`@alkitu/ui`) | Planned | Depends on Phase 1b completion |
| [Phase 3](./phase-3-multi-brand-theming.md) | Multi-brand theme configuration (Alkitu, Detailcar, etc.) | Planned | Depends on Phase 2 |

## Phase 1 Summary

### Completed
- Deleted 55 primitive re-exports and `-local` variants
- Deleted 10 duplicated atoms (Alert, Badge, ProgressBar, RadioButton, Separator, Slider, Spacer, Spinner, Toggle, Tooltip)
- Deleted 5 Button primitive files
- Fixed conflicting `atoms-alianza/Toggle.tsx` flat file shadowing `Toggle/index.ts`
- Updated `primitives/ui/button.tsx` to re-export from alianza (108+ consumers)
- Added legacy variant/size mappings to alianza Button
- Updated 96 files with corrected import paths
- TypeScript: **0 errors**

### Future (Phase 1b)
- 7 atoms kept due to API incompatibilities (Button, Icon, Input, Select, Avatar, Textarea, CustomIcon)
- 12 molecules kept (showcase-specific with preset systems, not simple duplicates)
- Unifying these requires aligning alianza APIs to match design-system

### Before vs After

| Layer | Before | After | Deleted |
|-------|--------|-------|---------|
| Primitives | ~65 files | 9 files | 56 |
| Atoms | 21 files | 11 files | 10 |
| Molecules | 12 files | 12 files | 0 |
| Organisms | 11 files | 11 files | 0 |
| **Total** | **~109** | **~43** | **~66** |

## Context

The theme editor built its own Atomic Design system (~90+ files) for preview purposes, but the alianza components already respond to CSS variables via Tailwind semantic classes (`bg-primary` -> `var(--color-primary)`). This duplication creates maintenance burden and inconsistency.

## Key Decisions

1. **Alianza components are the source of truth** — theme editor should consume them, not duplicate
2. **Organisms stay in theme editor** — they're showcase-only and not reusable outside the editor
3. **Molecules stayed too** — they have rich preset APIs (title, description, actions[], image, badge) vs alianza's Radix composition; not simple duplicates
4. **7 atoms kept** — API incompatibilities (e.g., Icon uses `icon: LucideIcon` prop vs alianza's `name: string`)
5. **Backward compatibility** — `primitives/ui/button.tsx` re-export chain + legacy variant mappings preserved
6. **No new dependencies** — all changes use existing alianza components
