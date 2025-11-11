# CSS Variables Reference

Complete reference for all CSS variables available in the Alkitu theme system.

## Table of Contents

- [Color Variables](#color-variables)
- [Border Radius Variables](#border-radius-variables)
- [Shadow Variables](#shadow-variables)
- [Spacing Variables](#spacing-variables)
- [Scrollbar Variables](#scrollbar-variables)
- [Typography Variables](#typography-variables)
- [Animation & Transition Variables](#animation--transition-variables)
- [Z-Index Variables](#z-index-variables)
- [Usage Examples](#usage-examples)

---

## Color Variables

All color variables use the OKLCH color space for perceptually uniform color management.

### Core Colors

| Variable | Description | Light Mode | Dark Mode |
|----------|-------------|------------|-----------|
| `--background` | Page background color | `oklch(1 0 0)` | `oklch(0.2046 0 0)` |
| `--foreground` | Default text color | `oklch(0.2686 0 0)` | `oklch(0.9219 0 0)` |
| `--primary` | Primary brand color | `oklch(0.7686 0.1647 70.0804)` | Same |
| `--primary-foreground` | Text on primary bg | `oklch(0 0 0)` | `oklch(0 0 0)` |
| `--secondary` | Secondary color | `oklch(0.967 0.0029 264.5419)` | `oklch(0.2686 0 0)` |
| `--secondary-foreground` | Text on secondary | `oklch(0.4461 0.0263 256.8018)` | `oklch(0.9219 0 0)` |
| `--accent` | Accent highlights | `oklch(0.9869 0.0214 95.2774)` | `oklch(0.4732 0.1247 46.2007)` |
| `--accent-foreground` | Text on accent | `oklch(0.4732 0.1247 46.2007)` | `oklch(0.9243 0.1151 95.7459)` |
| `--muted` | Muted backgrounds | `oklch(0.9846 0.0017 247.8389)` | `oklch(0.2686 0 0)` |
| `--muted-foreground` | Muted text | `oklch(0.551 0.0234 264.3637)` | `oklch(0.7155 0 0)` |

### Component Colors

| Variable | Description |
|----------|-------------|
| `--card` | Card background |
| `--card-foreground` | Text on cards |
| `--popover` | Popover background |
| `--popover-foreground` | Text in popovers |
| `--border` | Border color |
| `--input` | Input border color |
| `--ring` | Focus ring color |

### Semantic Colors

| Variable | Description |
|----------|-------------|
| `--destructive` | Error/danger color |
| `--destructive-foreground` | Text on error |
| `--success` | Success color |
| `--success-foreground` | Text on success |
| `--warning` | Warning color |
| `--warning-foreground` | Text on warning |
| `--info` | Info color |
| `--info-foreground` | Text on info |

### Chart Colors

| Variable | Description |
|----------|-------------|
| `--chart-1` | Chart color 1 (primary) |
| `--chart-2` | Chart color 2 |
| `--chart-3` | Chart color 3 |
| `--chart-4` | Chart color 4 |
| `--chart-5` | Chart color 5 |

### Sidebar Colors

| Variable | Description |
|----------|-------------|
| `--sidebar` | Sidebar background |
| `--sidebar-foreground` | Sidebar text |
| `--sidebar-primary` | Sidebar primary |
| `--sidebar-primary-foreground` | Sidebar primary text |
| `--sidebar-accent` | Sidebar accent |
| `--sidebar-accent-foreground` | Sidebar accent text |
| `--sidebar-border` | Sidebar border |
| `--sidebar-ring` | Sidebar focus ring |

---

## Border Radius Variables

### Base Radius

| Variable | Value | Description |
|----------|-------|-------------|
| `--radius` | `0.375rem` | Base border radius (6px) |
| `--radius-sm` | `calc(var(--radius) - 4px)` | Small radius (2px) |
| `--radius-md` | `calc(var(--radius) - 2px)` | Medium radius (4px) |
| `--radius-lg` | `var(--radius)` | Large radius (6px) |
| `--radius-xl` | `calc(var(--radius) + 4px)` | Extra large (10px) |

### Component-Specific Radius

| Variable | Value | Use Case |
|----------|-------|----------|
| `--radius-button` | `var(--radius)` | Buttons |
| `--radius-input` | `var(--radius)` | Input fields |
| `--radius-card` | `calc(var(--radius) + 4px)` | Cards |
| `--radius-dialog` | `calc(var(--radius) + 8px)` | Dialogs/Modals |
| `--radius-popover` | `var(--radius)` | Popovers |
| `--radius-dropdown` | `var(--radius)` | Dropdown menus |
| `--radius-tooltip` | `calc(var(--radius) - 2px)` | Tooltips |
| `--radius-badge` | `calc(var(--radius) + 12px)` | Badges/Pills |
| `--radius-avatar` | `9999px` | Avatar (circular) |
| `--radius-checkbox` | `calc(var(--radius) - 2px)` | Checkboxes |
| `--radius-switch` | `9999px` | Switch controls |
| `--radius-slider` | `9999px` | Slider tracks |
| `--radius-progress` | `9999px` | Progress bars |
| `--radius-separator` | `0px` | Separators (sharp) |
| `--radius-tabs` | `var(--radius)` | Tab elements |
| `--radius-select` | `var(--radius)` | Select dropdowns |
| `--radius-toast` | `var(--radius)` | Toast notifications |

---

## Shadow Variables

### Base Shadows

| Variable | Description |
|----------|-------------|
| `--shadow-2xs` | Minimal shadow |
| `--shadow-xs` | Extra small shadow |
| `--shadow-sm` | Small shadow |
| `--shadow` | Default shadow |
| `--shadow-md` | Medium shadow |
| `--shadow-lg` | Large shadow |
| `--shadow-xl` | Extra large shadow |
| `--shadow-2xl` | Maximum shadow |

### Component-Specific Shadows

| Variable | Use Case |
|----------|----------|
| `--shadow-button` | Button default state |
| `--shadow-button-hover` | Button hover state |
| `--shadow-card` | Card default |
| `--shadow-card-hover` | Card hover |
| `--shadow-dialog` | Modal dialogs |
| `--shadow-popover` | Popover menus |
| `--shadow-dropdown` | Dropdown menus |
| `--shadow-tooltip` | Tooltips |
| `--shadow-toast` | Toast notifications |

---

## Spacing Variables

| Variable | Value | Pixels (at base 16px) |
|----------|-------|----------------------|
| `--spacing` | `0.25rem` | 4px |
| `--spacing-unit` | `0.25rem` | 4px |
| `--spacing-xs` | `calc(var(--spacing-unit) * 1)` | 4px |
| `--spacing-sm` | `calc(var(--spacing-unit) * 2)` | 8px |
| `--spacing-md` | `calc(var(--spacing-unit) * 4)` | 16px |
| `--spacing-lg` | `calc(var(--spacing-unit) * 6)` | 24px |
| `--spacing-xl` | `calc(var(--spacing-unit) * 8)` | 32px |
| `--spacing-2xl` | `calc(var(--spacing-unit) * 12)` | 48px |
| `--spacing-3xl` | `calc(var(--spacing-unit) * 16)` | 64px |

---

## Scrollbar Variables

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `--scrollbar-width` | `12px` | Standard scrollbar width |
| `--scrollbar-width-thin` | `8px` | Thin scrollbar width |
| `--scrollbar-track` | `var(--muted)` | Scrollbar track color |
| `--scrollbar-thumb` | `var(--muted-foreground)` | Scrollbar thumb color |
| `--scrollbar-thumb-hover` | `var(--primary)` | Thumb hover color |
| `--scrollbar-border-radius` | `var(--radius)` | Scrollbar corner radius |

---

## Typography Variables

### Font Families

| Variable | Default Value |
|----------|---------------|
| `--font-sans` | `Inter, sans-serif` |
| `--font-serif` | `Source Serif 4, serif` |
| `--font-mono` | `JetBrains Mono, monospace` |

### Component Typography

#### Button Typography
| Variable | Default |
|----------|---------|
| `--typography-button-family` | `var(--font-sans)` |
| `--typography-button-size` | `0.875rem` (14px) |
| `--typography-button-weight` | `500` |
| `--typography-button-line-height` | `1.25rem` |
| `--typography-button-letter-spacing` | `0.01em` |

#### Input Typography
| Variable | Default |
|----------|---------|
| `--typography-input-family` | `var(--font-sans)` |
| `--typography-input-size` | `0.875rem` |
| `--typography-input-weight` | `400` |
| `--typography-input-line-height` | `1.25rem` |

#### Label Typography
| Variable | Default |
|----------|---------|
| `--typography-label-family` | `var(--font-sans)` |
| `--typography-label-size` | `0.875rem` |
| `--typography-label-weight` | `500` |
| `--typography-label-line-height` | `1.25rem` |

### General Typography
| Variable | Description |
|----------|-------------|
| `--typography-heading-family` | Headings font |
| `--typography-body-family` | Body text font |
| `--typography-code-family` | Code blocks font |

---

## Animation & Transition Variables

| Variable | Value | Use Case |
|----------|-------|----------|
| `--transition-fast` | `150ms cubic-bezier(0.4, 0, 0.2, 1)` | Quick interactions |
| `--transition-base` | `200ms cubic-bezier(0.4, 0, 0.2, 1)` | Standard transitions |
| `--transition-slow` | `300ms cubic-bezier(0.4, 0, 0.2, 1)` | Slower animations |
| `--transition-theme` | `200ms cubic-bezier(0.4, 0, 0.2, 1)` | Theme switching |

All transitions use the "ease-out" easing function for natural motion.

---

## Z-Index Variables

Consistent z-index scale for layering components:

| Variable | Value | Layer |
|----------|-------|-------|
| `--z-dropdown` | `1000` | Dropdown menus |
| `--z-sticky` | `1020` | Sticky headers |
| `--z-fixed` | `1030` | Fixed elements |
| `--z-modal-backdrop` | `1040` | Modal backgrounds |
| `--z-modal` | `1050` | Modal dialogs |
| `--z-popover` | `1060` | Popover menus |
| `--z-tooltip` | `1070` | Tooltips |
| `--z-toast` | `1080` | Toast notifications (highest) |

---

## Usage Examples

### Using Color Variables

```css
.my-button {
  background-color: var(--primary);
  color: var(--primary-foreground);
  border: 1px solid var(--border);
}

.my-button:hover {
  background-color: var(--primary);
  opacity: 0.9;
}
```

### Using Radius Variables

```css
.card {
  border-radius: var(--radius-card);
}

.button {
  border-radius: var(--radius-button);
}
```

### Using Shadow Variables

```css
.elevated-card {
  box-shadow: var(--shadow-card);
  transition: box-shadow var(--transition-base);
}

.elevated-card:hover {
  box-shadow: var(--shadow-card-hover);
}
```

### Using Spacing Variables

```css
.container {
  padding: var(--spacing-md);
  gap: var(--spacing-sm);
}

.section {
  margin-bottom: var(--spacing-xl);
}
```

### Using Typography Variables

```css
.custom-button {
  font-family: var(--typography-button-family);
  font-size: var(--typography-button-size);
  font-weight: var(--typography-button-weight);
  line-height: var(--typography-button-line-height);
  letter-spacing: var(--typography-button-letter-spacing);
}
```

### Programmatic Usage (TypeScript)

```typescript
import {
  injectCSSVariables,
  getCSSVariable,
  injectColorTokens
} from '@/lib/theme/css-variables';

// Get current primary color
const primaryColor = getCSSVariable('primary');

// Inject custom variables
injectCSSVariables({
  'primary': 'oklch(0.8 0.15 120)',
  'radius-button': '12px'
});

// Inject color theme
injectColorTokens({
  'primary': 'oklch(0.8 0.15 120)',
  'secondary': 'oklch(0.7 0.12 240)'
}, 'light');
```

---

## Dark Mode

All color variables automatically adapt in dark mode via the `.dark` class on the root element.

```typescript
// Toggle dark mode
document.documentElement.classList.toggle('dark');
```

Or use the theme context:

```typescript
import { useGlobalTheme } from '@/hooks/useGlobalTheme';

function MyComponent() {
  const { mode, toggleMode } = useGlobalTheme();

  return (
    <button onClick={toggleMode}>
      Current mode: {mode}
    </button>
  );
}
```

---

## Best Practices

1. **Always use CSS variables** instead of hardcoded values for theme-aware properties
2. **Use semantic color names** (`--primary`, `--destructive`) over arbitrary names
3. **Prefer component-specific variables** (`--radius-button`) for granular control
4. **Use the spacing scale** for consistent padding/margins
5. **Follow the z-index scale** to avoid layering conflicts
6. **Use transition variables** for consistent animation timing

---

## Notes

- All color values use **OKLCH** color space for perceptually uniform color management
- Border radius values are **relative to the base `--radius`** variable
- Shadows use **HSL** format for compatibility
- Typography sizes use **rem** units for accessibility
- Z-index values increment by **10** to allow insertion between layers if needed

---

## Migration Guide

If migrating from hardcoded values:

**Before:**
```css
.button {
  background: #3b82f6;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
```

**After:**
```css
.button {
  background: var(--primary);
  border-radius: var(--radius-button);
  box-shadow: var(--shadow-button);
}
```

This ensures your component automatically adapts to theme changes!
