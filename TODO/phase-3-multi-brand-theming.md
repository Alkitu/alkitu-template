# Phase 3: Multi-Brand Theme Configuration

## Goal

Enable `@alkitu/ui` to support multiple brands (Alkitu, Detailcar, etc.) with distinct visual identities while sharing the same component library.

## Prerequisites

- Phase 2 completed (`@alkitu/ui` package extracted)
- CSS variable contract established and documented

## Tasks

### 1. Define Theme Contract

- Establish the complete CSS variable contract all themes must implement
- Document required tokens: colors, spacing, typography, borders, shadows
- Create TypeScript types for theme configuration objects
- Define OKLCH color space requirements

### 2. Create Brand Theme Packages

- `packages/theme-alkitu/` — Alkitu brand theme
- `packages/theme-detailcar/` — Detailcar brand theme
- Each package exports CSS variable values and theme metadata
- Each theme provides light/dark mode variants

### 3. Theme Resolution System

- Build-time theme selection via environment variable
- Runtime theme switching capability (for admin/preview)
- SSR-compatible theme hydration
- Theme inheritance (base theme + brand overrides)

### 4. Theme Editor Integration

- Theme editor writes to brand-specific theme storage
- Preview system loads correct brand theme
- Export/import themes per brand

### 5. Testing & Validation

- Visual regression tests per brand
- Theme contract validation (ensure all required tokens are provided)
- Cross-brand component rendering tests

## Acceptance Criteria

- [ ] At least 2 brand themes working (Alkitu + Detailcar)
- [ ] Theme switching works at runtime
- [ ] Theme editor can edit any brand's theme
- [ ] Visual regression tests pass for all brands
- [ ] SSR renders correct brand theme on first paint

## Definition of Done

- [ ] Brand themes packaged and deployable
- [ ] Documentation for creating new brand themes
- [ ] CI includes visual regression for all brands
- [ ] Production deployment tested with brand switching
