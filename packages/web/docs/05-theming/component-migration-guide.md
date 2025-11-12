# Component Migration Guide

Complete guide for migrating components to use the comprehensive CSS variable system for dynamic theming.

## Table of Contents

- [Overview](#overview)
- [Migration Strategy](#migration-strategy)
- [Step-by-Step Migration Process](#step-by-step-migration-process)
- [CSS Variable Categories](#css-variable-categories)
- [Component-Specific Patterns](#component-specific-patterns)
- [Testing Your Migration](#testing-your-migration)
- [Common Pitfalls](#common-pitfalls)
- [Examples](#examples)

---

## Overview

### Why Migrate?

Migrating components to use CSS variables enables:
- ✅ **Dynamic Theming** - Change styles globally without code changes
- ✅ **Real-Time Updates** - Instant visual updates via DynamicThemeProvider
- ✅ **Consistency** - Standardized design tokens across the app
- ✅ **Maintainability** - Single source of truth for design values
- ✅ **Zero Breaking Changes** - Fully backward compatible

### What Gets Migrated?

Components should migrate these properties to CSS variables:
- Typography (font-family, size, weight, line-height, letter-spacing)
- Border radius (rounded corners)
- Shadows (elevation)
- Spacing (padding, margins, gaps)
- Transitions (animation timing)
- Z-index (layering)

**Note:** Colors already use CSS variables via Tailwind classes - no migration needed!

---

## Migration Strategy

### 1. Identify Component Type

Determine which CSS variables your component should use:

| Component Type | Typography Variables | Other Variables |
|----------------|---------------------|-----------------|
| **Buttons** | `--typography-button-*` | `--radius-button`, `--shadow-button`, `--spacing-*`, `--transition-fast` |
| **Inputs** | `--typography-input-*` | `--radius-input`, `--transition-base` |
| **Labels** | `--typography-label-*` | `--transition-base` |
| **Dropdowns/Select** | `--typography-input-*` | `--radius-select`, `--shadow-dropdown`, `--z-dropdown` |
| **Checkboxes/Radio** | N/A | `--radius-checkbox`, `--shadow-xs`, `--transition-fast` |
| **Cards** | N/A | `--radius-card`, `--shadow-card`, `--spacing-*` |
| **Dialogs/Modals** | N/A | `--radius-dialog`, `--shadow-dialog`, `--z-modal` |
| **Tooltips** | N/A | `--radius-tooltip`, `--shadow-tooltip`, `--z-tooltip` |

### 2. Choose Migration Approach

**Option A: Inline Styles (Recommended)**
```tsx
const baseStyles: React.CSSProperties = {
  fontFamily: 'var(--typography-button-family, var(--font-sans))',
  borderRadius: 'var(--radius-button, var(--radius))',
};

<button style={baseStyles} />
```

**Benefits:**
- Direct CSS variable access
- Full TypeScript typing
- Easy to override with props
- No specificity issues

**Option B: CSS Classes**
```css
.my-button {
  font-family: var(--typography-button-family, var(--font-sans));
  border-radius: var(--radius-button, var(--radius));
}
```

**Benefits:**
- Separation of concerns
- Can be used with CSS preprocessors
- Familiar CSS workflow

---

## Step-by-Step Migration Process

### Step 1: Add Documentation Header

Add a JSDoc comment explaining the CSS variables used:

```tsx
/**
 * MyComponent - Theme-Aware Implementation
 *
 * Uses comprehensive CSS variable system for dynamic theming:
 * - Typography: --typography-button-* variables
 * - Border Radius: --radius-button
 * - Shadows: --shadow-button
 * - Transitions: --transition-fast
 * - Colors: Tailwind classes with CSS variables
 *
 * All variables automatically respond to theme changes via DynamicThemeProvider.
 *
 * @see docs/CSS-VARIABLES-REFERENCE.md for complete variable documentation
 */
```

### Step 2: Add Style Prop to Component Props

If not already present, add `style` to your component props:

```tsx
// Before
function MyComponent({ className, ...props }: MyProps) {

// After
function MyComponent({ className, style, ...props }: MyProps) {
```

### Step 3: Create Base Styles Object

Define a `baseStyles` object with CSS variables:

```tsx
const baseStyles: React.CSSProperties = {
  // Typography
  fontFamily: 'var(--typography-button-family, var(--font-sans))',
  fontSize: 'var(--typography-button-size, 0.875rem)',
  fontWeight: 'var(--typography-button-weight, 500)',
  lineHeight: 'var(--typography-button-line-height, 1.25rem)',

  // Border radius
  borderRadius: 'var(--radius-button, var(--radius, 0.375rem))',

  // Transitions
  transition: 'all var(--transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1))',
};
```

**Important:** Always provide fallback values in the `var()` function!

### Step 4: Apply Styles to Element

Merge base styles with user-provided styles:

```tsx
<button
  style={{
    ...baseStyles,
    ...style, // User styles override base styles
  }}
  className={className}
  {...props}
>
  {children}
</button>
```

### Step 5: Remove Hardcoded Values

Remove any hardcoded values that are now handled by CSS variables:

```tsx
// Before (hardcoded)
className="rounded-md text-sm font-medium"

// After (CSS variables handle these)
// Remove text-sm if fontSize is in baseStyles
// Remove rounded-md if borderRadius is in baseStyles
// Keep font-medium if it's not overridden
```

**Keep:** Utility classes for colors, layout, and other properties not handled by CSS variables.

### Step 6: Test the Component

Verify that:
1. Component renders correctly
2. Styles are applied
3. Theme switching works
4. User-provided styles still work
5. TypeScript compiles without errors

---

## CSS Variable Categories

### Typography Variables

```typescript
// Button typography
fontFamily: 'var(--typography-button-family, var(--font-sans))',
fontSize: 'var(--typography-button-size, 0.875rem)',
fontWeight: 'var(--typography-button-weight, 500)',
lineHeight: 'var(--typography-button-line-height, 1.25rem)',
letterSpacing: 'var(--typography-button-letter-spacing, 0.01em)',

// Input typography
fontFamily: 'var(--typography-input-family, var(--font-sans))',
fontSize: 'var(--typography-input-size, 0.875rem)',
fontWeight: 'var(--typography-input-weight, 400)',
lineHeight: 'var(--typography-input-line-height, 1.25rem)',

// Label typography
fontFamily: 'var(--typography-label-family, var(--font-sans))',
fontSize: 'var(--typography-label-size, 0.875rem)',
fontWeight: 'var(--typography-label-weight, 500)',
lineHeight: 'var(--typography-label-line-height, 1.25rem)',
```

### Border Radius Variables

```typescript
// Component-specific
borderRadius: 'var(--radius-button, var(--radius))',
borderRadius: 'var(--radius-input, var(--radius))',
borderRadius: 'var(--radius-card, calc(var(--radius) + 4px))',
borderRadius: 'var(--radius-dialog, calc(var(--radius) + 8px))',
borderRadius: 'var(--radius-checkbox, calc(var(--radius) - 2px))',

// Size variants
borderRadius: 'var(--radius-sm, calc(var(--radius) - 4px))',
borderRadius: 'var(--radius-md, calc(var(--radius) - 2px))',
borderRadius: 'var(--radius-lg, var(--radius))',
borderRadius: 'var(--radius-xl, calc(var(--radius) + 4px))',

// Special cases
borderRadius: 'var(--radius-avatar, 9999px)', // Circular
borderRadius: 'var(--radius-separator, 0px)', // Sharp
```

### Shadow Variables

```typescript
// Component-specific
boxShadow: 'var(--shadow-button, var(--shadow-sm))',
boxShadow: 'var(--shadow-card, var(--shadow-md))',
boxShadow: 'var(--shadow-dialog, var(--shadow-2xl))',
boxShadow: 'var(--shadow-dropdown, var(--shadow-lg))',
boxShadow: 'var(--shadow-tooltip, var(--shadow-sm))',

// Base shadows
boxShadow: 'var(--shadow-xs)',
boxShadow: 'var(--shadow-sm)',
boxShadow: 'var(--shadow)',
boxShadow: 'var(--shadow-md)',
boxShadow: 'var(--shadow-lg)',
boxShadow: 'var(--shadow-xl)',
boxShadow: 'var(--shadow-2xl)',
```

### Spacing Variables

```typescript
// Direct spacing
padding: 'var(--spacing-sm, 0.5rem)', // 8px
padding: 'var(--spacing-md, 1rem)',   // 16px
padding: 'var(--spacing-lg, 1.5rem)', // 24px
gap: 'var(--spacing-xs, 0.25rem)',    // 4px

// Compound spacing
paddingLeft: 'var(--spacing-md)',
paddingRight: 'var(--spacing-md)',
```

### Transition Variables

```typescript
// Component-appropriate transitions
transition: 'all var(--transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1))',  // Buttons, checkboxes
transition: 'all var(--transition-base, 200ms cubic-bezier(0.4, 0, 0.2, 1))',  // Inputs, labels
transition: 'all var(--transition-slow, 300ms cubic-bezier(0.4, 0, 0.2, 1))',  // Large animations
transition: 'all var(--transition-theme, 200ms cubic-bezier(0.4, 0, 0.2, 1))', // Theme switching
```

### Z-Index Variables

```typescript
// Layering
zIndex: 'var(--z-dropdown, 1000)',
zIndex: 'var(--z-sticky, 1020)',
zIndex: 'var(--z-fixed, 1030)',
zIndex: 'var(--z-modal-backdrop, 1040)',
zIndex: 'var(--z-modal, 1050)',
zIndex: 'var(--z-popover, 1060)',
zIndex: 'var(--z-tooltip, 1070)',
zIndex: 'var(--z-toast, 1080)',
```

---

## Component-Specific Patterns

### Button Component

```tsx
'use client';

/**
 * Button Component - Theme-Aware Implementation
 *
 * Uses: --typography-button-*, --radius-button, --shadow-button, --spacing-*, --transition-fast
 */

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', style, ...props }, ref) => {
    const baseStyles: React.CSSProperties = {
      // Typography
      fontFamily: 'var(--typography-button-family, var(--font-sans))',
      fontSize: 'var(--typography-button-size, 0.875rem)',
      fontWeight: 'var(--typography-button-weight, 500)',
      lineHeight: 'var(--typography-button-line-height, 1.25rem)',
      letterSpacing: 'var(--typography-button-letter-spacing, 0.01em)',

      // Border radius
      borderRadius: 'var(--radius-button, var(--radius, 0.375rem))',

      // Shadow
      boxShadow: 'var(--shadow-button, var(--shadow-sm))',

      // Transition
      transition: 'all var(--transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1))',

      // Size-specific spacing
      ...(size === 'sm' && {
        paddingLeft: 'var(--spacing-sm, 0.5rem)',
        paddingRight: 'var(--spacing-sm, 0.5rem)',
      }),
      ...(size === 'default' && {
        paddingLeft: 'var(--spacing-md, 1rem)',
        paddingRight: 'var(--spacing-md, 1rem)',
      }),
      ...(size === 'lg' && {
        paddingLeft: 'var(--spacing-lg, 1.5rem)',
        paddingRight: 'var(--spacing-lg, 1.5rem)',
      }),
    };

    return (
      <button
        ref={ref}
        style={{
          ...baseStyles,
          ...style,
        }}
        className={cn(
          'inline-flex items-center justify-center',
          'bg-primary text-primary-foreground hover:bg-primary/90',
          className
        )}
        {...props}
      />
    );
  }
);
```

### Input Component

```tsx
'use client';

/**
 * Input Component - Theme-Aware Implementation
 *
 * Uses: --typography-input-*, --radius-input, --transition-base
 */

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, style, ...props }, ref) => {
    const baseStyles: React.CSSProperties = {
      // Typography
      fontFamily: 'var(--typography-input-family, var(--font-sans))',
      fontSize: 'var(--typography-input-size, 0.875rem)',
      fontWeight: 'var(--typography-input-weight, 400)',
      lineHeight: 'var(--typography-input-line-height, 1.25rem)',

      // Border radius
      borderRadius: 'var(--radius-input, var(--radius, 0.375rem))',

      // Transition
      transition: 'all var(--transition-base, 200ms cubic-bezier(0.4, 0, 0.2, 1))',
    };

    return (
      <input
        ref={ref}
        style={{
          ...baseStyles,
          ...style,
        }}
        className={cn(
          'flex h-9 w-full border border-input bg-background px-3 py-1',
          'text-foreground placeholder:text-muted-foreground',
          'focus-visible:border-ring focus-visible:ring-ring/50',
          className
        )}
        {...props}
      />
    );
  }
);
```

### Card Component

```tsx
'use client';

/**
 * Card Component - Theme-Aware Implementation
 *
 * Uses: --radius-card, --shadow-card, --spacing-md
 */

import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, style, ...props }, ref) => {
    const baseStyles: React.CSSProperties = {
      // Border radius
      borderRadius: 'var(--radius-card, calc(var(--radius, 0.375rem) + 4px))',

      // Shadow
      boxShadow: 'var(--shadow-card, var(--shadow-md))',

      // Spacing
      padding: 'var(--spacing-md, 1rem)',

      // Transition
      transition: 'all var(--transition-base, 200ms cubic-bezier(0.4, 0, 0.2, 1))',
    };

    return (
      <div
        ref={ref}
        style={{
          ...baseStyles,
          ...style,
        }}
        className={cn(
          'bg-card text-card-foreground border',
          className
        )}
        {...props}
      />
    );
  }
);
```

---

## Testing Your Migration

### 1. Visual Testing

Verify the component looks correct in both light and dark modes:

```tsx
import { useGlobalTheme } from '@/hooks/useGlobalTheme';

function TestPage() {
  const { mode, toggleMode } = useGlobalTheme();

  return (
    <div>
      <button onClick={toggleMode}>
        Current mode: {mode}
      </button>
      <YourComponent />
    </div>
  );
}
```

### 2. Dynamic Theme Testing

Test that variables can be changed dynamically:

```tsx
import { injectCSSVariables } from '@/lib/theme/css-variables';

function TestThemeChange() {
  const changeRadius = () => {
    injectCSSVariables({
      'radius-button': '20px',
      'radius-input': '20px',
    });
  };

  return (
    <>
      <button onClick={changeRadius}>Make Round</button>
      <YourComponent />
    </>
  );
}
```

### 3. TypeScript Compilation

Ensure no TypeScript errors:

```bash
npm run type-check
```

### 4. Component Props Testing

Verify user-provided styles still work:

```tsx
<YourComponent
  style={{ fontSize: '2rem' }} // Should override baseStyles
  className="custom-class"      // Should work alongside CSS variables
/>
```

---

## Common Pitfalls

### ❌ Pitfall 1: Missing Fallback Values

```tsx
// ❌ BAD - No fallback
fontFamily: 'var(--typography-button-family)',

// ✅ GOOD - With fallback
fontFamily: 'var(--typography-button-family, var(--font-sans))',
```

### ❌ Pitfall 2: Overriding with Tailwind Classes

```tsx
// ❌ BAD - Tailwind class might override CSS variable
<button
  style={{ borderRadius: 'var(--radius-button)' }}
  className="rounded-full" // This wins due to specificity
/>

// ✅ GOOD - Remove conflicting classes
<button
  style={{ borderRadius: 'var(--radius-button)' }}
  className="bg-primary text-white" // No border-radius class
/>
```

### ❌ Pitfall 3: Wrong Variable Category

```tsx
// ❌ BAD - Using input typography for button
fontFamily: 'var(--typography-input-family)',

// ✅ GOOD - Using button typography
fontFamily: 'var(--typography-button-family)',
```

### ❌ Pitfall 4: Not Merging User Styles

```tsx
// ❌ BAD - User style prop ignored
<button style={baseStyles} />

// ✅ GOOD - Merge user styles
<button style={{ ...baseStyles, ...style }} />
```

### ❌ Pitfall 5: Forgetting Documentation

```tsx
// ❌ BAD - No documentation
export const Button = () => { ... }

// ✅ GOOD - Clear documentation
/**
 * Button Component - Theme-Aware Implementation
 * Uses: --typography-button-*, --radius-button, etc.
 */
export const Button = () => { ... }
```

---

## Examples

### Example 1: Migrating a Simple Button

**Before:**
```tsx
function Button({ children, className }) {
  return (
    <button
      className={cn(
        'rounded-md text-sm font-medium px-4 py-2',
        'bg-primary text-white',
        className
      )}
    >
      {children}
    </button>
  );
}
```

**After:**
```tsx
function Button({ children, className, style, ...props }) {
  const baseStyles: React.CSSProperties = {
    fontFamily: 'var(--typography-button-family, var(--font-sans))',
    fontSize: 'var(--typography-button-size, 0.875rem)',
    fontWeight: 'var(--typography-button-weight, 500)',
    borderRadius: 'var(--radius-button, var(--radius))',
    paddingLeft: 'var(--spacing-md, 1rem)',
    paddingRight: 'var(--spacing-md, 1rem)',
    transition: 'all var(--transition-fast, 150ms)',
  };

  return (
    <button
      style={{ ...baseStyles, ...style }}
      className={cn('bg-primary text-white', className)}
      {...props}
    >
      {children}
    </button>
  );
}
```

### Example 2: Migrating a Complex Card

**Before:**
```tsx
function Card({ title, children, className }) {
  return (
    <div className={cn('rounded-lg shadow-md p-6 bg-white', className)}>
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <div>{children}</div>
    </div>
  );
}
```

**After:**
```tsx
function Card({ title, children, className, style }) {
  const cardStyles: React.CSSProperties = {
    borderRadius: 'var(--radius-card, calc(var(--radius) + 4px))',
    boxShadow: 'var(--shadow-card, var(--shadow-md))',
    padding: 'var(--spacing-lg, 1.5rem)',
    transition: 'all var(--transition-base, 200ms)',
  };

  const titleStyles: React.CSSProperties = {
    fontFamily: 'var(--typography-heading-family, var(--font-sans))',
    marginBottom: 'var(--spacing-md, 1rem)',
  };

  return (
    <div
      style={{ ...cardStyles, ...style }}
      className={cn('bg-card text-card-foreground', className)}
    >
      <h3 style={titleStyles} className="text-lg font-bold">
        {title}
      </h3>
      <div>{children}</div>
    </div>
  );
}
```

---

## Quick Reference Checklist

Use this checklist when migrating a component:

- [ ] Add documentation header with CSS variables used
- [ ] Add `style` prop to component interface
- [ ] Create `baseStyles` object with CSS variables
- [ ] Include fallback values for all CSS variables
- [ ] Apply styles with `{...baseStyles, ...style}` pattern
- [ ] Remove hardcoded values that are now in CSS variables
- [ ] Keep color classes (already using CSS variables)
- [ ] Test in light and dark modes
- [ ] Test with dynamic theme changes
- [ ] Verify TypeScript compiles
- [ ] Verify user styles can override
- [ ] Update component tests if needed

---

## Additional Resources

- **CSS Variables Reference:** `/docs/CSS-VARIABLES-REFERENCE.md`
- **Theme Context API:** `/src/context/ThemeContext.tsx`
- **CSS Variables Utilities:** `/src/lib/theme/css-variables.ts`
- **Migration Progress:** `/THEME-MIGRATION-PROGRESS.md`

---

## Getting Help

If you encounter issues during migration:

1. Check the **CSS Variables Reference** for available variables
2. Review **migrated components** (Button, Input, Label, Select, Checkbox) as examples
3. Verify TypeScript compilation with `npm run type-check`
4. Test theme switching with `useGlobalTheme` hook

**Remember:** All migrations should be **backward compatible** with **zero breaking changes**!
