# Phase 2: Extract Unified Components to `@alkitu/ui`

## Goal

Extract the unified alianza component library into a shared `packages/ui` package (`@alkitu/ui`) that can be consumed by multiple applications within the monorepo.

## Prerequisites

- Phase 1 completed (no more duplicates in theme-editor design-system)
- All alianza components confirmed as the single source of truth

## Tasks

### 1. Create `packages/ui` Package

- Initialize `packages/ui/` with `package.json`, `tsconfig.json`
- Configure npm workspace in root `package.json`
- Set up build tooling (tsup or similar for bundling)
- Configure package exports with subpath imports

### 2. Move Alianza Components

- Move `atoms-alianza/` components into `packages/ui/src/atoms/`
- Move `molecules-alianza/` components into `packages/ui/src/molecules/`
- Move shared primitives (`primitives/ui/`) into `packages/ui/src/primitives/`
- Preserve all existing exports and component APIs

### 3. Update Consumer Imports

- Update all `@/components/atoms-alianza/` imports to `@alkitu/ui/atoms/`
- Update all `@/components/molecules-alianza/` imports to `@alkitu/ui/molecules/`
- Update all `@/components/primitives/ui/` imports to `@alkitu/ui/primitives/`
- Update theme-editor-3.0 design-system imports

### 4. Configure Shared Dependencies

- Tailwind CSS v4 preset for consistent styling
- CSS variable contract (color, spacing, typography tokens)
- Peer dependencies: React, Radix UI, Tailwind

### 5. Documentation

- Component API documentation
- Storybook stories for all components
- Migration guide from alianza imports to `@alkitu/ui`

## Acceptance Criteria

- [ ] `packages/ui` builds successfully
- [ ] All existing tests pass after import migration
- [ ] Storybook renders all components
- [ ] No circular dependencies
- [ ] Package can be consumed by `packages/web` and future apps

## Definition of Done

- [ ] `@alkitu/ui` package published to internal registry (or linked via workspace)
- [ ] All consumer apps updated to use new imports
- [ ] CI/CD pipeline includes `packages/ui` build and test
- [ ] Documentation complete with migration guide
