# Design System Unification — Multi-Phase Plan

## Overview

Unify duplicate UI components across the theme editor (`theme-editor-3.0/design-system/`) and the alianza component libraries (`atoms-alianza/`, `molecules-alianza/`), then extract a shared `@alkitu/ui` package for multi-brand reuse.

## Phases

| Phase | Description | Status | ETA |
|-------|-------------|--------|-----|
| [Phase 1](./phase-1-eliminate-duplicates.md) | Eliminate duplicates between theme editor and alianza | In Progress | Current |
| [Phase 2](./phase-2-extract-ui-package.md) | Extract unified components to `packages/ui` (`@alkitu/ui`) | Planned | Future |
| [Phase 3](./phase-3-multi-brand-theming.md) | Multi-brand theme configuration (Alkitu, Detailcar, etc.) | Planned | Future |

## Context

The theme editor built its own Atomic Design system (~90+ files) for preview purposes, but the alianza components already respond to CSS variables via Tailwind semantic classes (`bg-primary` -> `var(--color-primary)`). This duplication creates maintenance burden and inconsistency.

### Current State

```
packages/web/src/components/
  primitives/ui/          # Base Radix UI wrappers (75 files)
  atoms-alianza/          # Alianza atoms (Button, Input, etc.)
  molecules-alianza/      # Alianza molecules (Card, Tabs, etc.)
  features/theme-editor-3.0/
    design-system/
      primitives/         # ~65 files (re-exports + local variants + wrappers)
      atoms/              # ~21 atoms (17 duplicate alianza equivalents)
      molecules/          # 12 molecules (10 duplicate alianza equivalents)
      organisms/          # 10 organisms (unique showcase components)
      components/         # 1 utility component
```

### Target State (after Phase 1)

```
packages/web/src/components/
  primitives/ui/          # Base Radix UI wrappers (unchanged)
  atoms-alianza/          # Alianza atoms — THE source of truth
  molecules-alianza/      # Alianza molecules — THE source of truth
  features/theme-editor-3.0/
    design-system/
      atoms/              # 4 unique: IconLibrary, IconUploader, Checkbox, ToggleGroup
      molecules/          # 2 unique: PreviewImageMolecule, SonnerMolecule
      organisms/          # 10 unchanged (imports updated to alianza)
      primitives/         # 5-6 unique: command-local, pagination-local, color pickers, etc.
      components/         # 1 unchanged: ComponentSearchFilter
```

## Key Decisions

1. **Alianza components are the source of truth** — theme editor should consume them, not duplicate
2. **Organisms stay in theme editor** — they're showcase-only and not reusable outside the editor
3. **Backward compatibility** — `primitives/ui/button.tsx` re-export chain must remain intact
4. **No new dependencies** — all changes use existing alianza components
