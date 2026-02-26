# Border Radius System

## Overview

Border radius is managed through CSS custom properties (variables), allowing the theme editor to dynamically control border radius across all components. By changing a single base variable (`--radius`), the entire application's border radius updates consistently. This approach ensures visual coherence and makes theming straightforward.

## CSS Variable Hierarchy

The base variable `--radius` is defined in `globals.css` and all other radius variables derive from it:

### Base Variables (in `:root`)

| Variable       | Default Value                | Description          |
| -------------- | ---------------------------- | -------------------- |
| `--radius`     | `0.625rem`                   | Global base border radius |
| `--radius-sm`  | `calc(var(--radius) - 4px)`  | Small variant        |
| `--radius-md`  | `calc(var(--radius) - 2px)`  | Medium variant       |
| `--radius-lg`  | `var(--radius)`              | Large (equals base)  |
| `--radius-xl`  | `calc(var(--radius) + 4px)`  | Extra large          |

### Component-Specific Variables

| Variable              | Default                        | Use For                     |
| --------------------- | ------------------------------ | --------------------------- |
| `--radius-button`     | `var(--radius)`                | Buttons, toggles            |
| `--radius-input`      | `var(--radius)`                | Inputs, textareas           |
| `--radius-card`       | `calc(var(--radius) + 4px)`    | Cards, tables, accordion    |
| `--radius-dialog`     | `calc(var(--radius) + 8px)`    | Dialogs, modals             |
| `--radius-popover`    | `var(--radius)`                | Popovers                    |
| `--radius-dropdown`   | `var(--radius)`                | Dropdown menus              |
| `--radius-tooltip`    | `calc(var(--radius) - 2px)`    | Tooltips, small elements    |
| `--radius-badge`      | `calc(var(--radius) + 12px)`   | Badges                      |
| `--radius-checkbox`   | `calc(var(--radius) - 2px)`    | Checkboxes                  |
| `--radius-tabs`       | `var(--radius)`                | Tab components              |
| `--radius-select`     | `var(--radius)`                | Select dropdowns, comboboxes |
| `--radius-toast`      | `var(--radius)`                | Toast notifications         |
| `--radius-avatar`     | `9999px`                       | Avatars (always circular)   |
| `--radius-switch`     | `9999px`                       | Switches (always circular)  |
| `--radius-progress`   | `9999px`                       | Progress bars               |

## Component Mapping Rules

### Which variable to use per component type:

| Component Type             | CSS Variable         | Tailwind Class                          |
| -------------------------- | -------------------- | --------------------------------------- |
| Buttons                    | `--radius-button`    | `rounded-[var(--radius-button)]`        |
| Inputs / Textareas         | `--radius-input`     | `rounded-[var(--radius-input)]`         |
| Cards / Tables / Accordions | `--radius-card`     | `rounded-[var(--radius-card)]`          |
| Dialogs / Modals           | `--radius-dialog`    | `rounded-[var(--radius-dialog)]`        |
| Dropdowns                  | `--radius-dropdown`  | `rounded-[var(--radius-dropdown)]`      |
| Tooltips / Small UI        | `--radius-tooltip`   | `rounded-[var(--radius-tooltip)]`       |
| Select / Combobox          | `--radius-select`    | `rounded-[var(--radius-select)]`        |
| Badges                     | `--radius-badge`     | `rounded-[var(--radius-badge)]`         |
| Generic elements           | `--radius`           | `rounded-[var(--radius)]`               |

### Circular Elements (ALWAYS hardcoded)

These elements should ALWAYS use `rounded-full` and never CSS variables:

- Avatar, UserAvatar
- RadioButton
- Toggle / Switch
- Spinner
- ProgressBar
- ThemeToggle
- PlaceholderPalette (color circles)

## Rules

1. **NEVER** use hardcoded Tailwind border-radius classes (`rounded-md`, `rounded-lg`, etc.) in alianza components — always use the CSS variable equivalent.
2. **EXCEPTION**: `rounded-full` for circular elements (listed above) and `rounded-none` for intentionally sharp corners.
3. **New components** MUST use the appropriate CSS variable from the mapping table.
4. **Primitives** (Radix UI wrappers in `/components/primitives/`) are the only exception where hardcoded values may remain for now.
5. When adding a new component type, add a corresponding `--radius-{component}` variable to `globals.css` if none of the existing ones fit.

## Theme Data Storage

Border radius values are stored in the database as part of `Theme.themeData.borders`:

```typescript
interface ThemeBorders {
  radius: string;        // Base radius (e.g., "10px", "0.625rem")
  radiusSm?: string;
  radiusMd?: string;
  radiusLg?: string;
  radiusXl?: string;
  radiusCard?: string;
  radiusButton?: string;
  radiusCheckbox?: string;
  // ... component-specific overrides
}
```

## Pipeline

1. **Database** -> `themeData.borders` stores the radius values.
2. **SSR** -> `generateInlineThemeCSS()` injects `--radius` variables into `<style>` tag.
3. **Fallback** -> `globals.css` defines defaults if DB values are missing.
4. **Client** -> Theme Editor's `applyBorderElements()` updates values dynamically.
5. **Components** -> Use `rounded-[var(--radius-*)]` Tailwind classes.

## Anti-Patterns

```tsx
// BAD - hardcoded Tailwind class
<div className="rounded-lg p-4">

// BAD - inline pixel value
<div style={{ borderRadius: '8px' }}>

// GOOD - CSS variable via Tailwind
<div className="rounded-[var(--radius-card)] p-4">

// GOOD - circular element (exception)
<div className="rounded-full">

// GOOD - CSS variable with fallback in inline style (rare cases)
<div style={{ borderRadius: 'var(--radius-card, 12px)' }}>
```
