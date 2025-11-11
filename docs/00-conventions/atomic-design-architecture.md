# Atomic Design Architecture

This document defines the Atomic Design methodology conventions for the Alkitu Template project.

## Purpose

Atomic Design is a methodology for creating design systems with five distinct levels of hierarchy:

1. **Atoms** - Basic building blocks (buttons, inputs, labels)
2. **Molecules** - Simple groups of atoms (form fields, search bars)
3. **Organisms** - Complex components (headers, forms, cards)
4. **Templates** - Page-level layouts with placeholder content
5. **Pages** - Specific instances of templates with real content

This convention ensures consistency, reusability, and maintainability across the entire application.

## Directory Structure

```
packages/web/src/components/
├── atoms/
│   ├── buttons/
│   │   ├── Button.tsx
│   │   ├── Button.types.ts
│   │   ├── Button.stories.tsx (optional)
│   │   └── index.ts
│   ├── typography/
│   ├── icons/
│   ├── inputs/
│   └── index.tsx (barrel export)
├── molecules/
│   ├── ServiceCard.tsx
│   ├── ServiceCard.types.ts
│   ├── index.ts
│   └── index.ts (barrel export)
├── organisms/
│   ├── hero/
│   │   ├── Hero.tsx
│   │   ├── Hero.types.ts
│   │   └── index.ts
│   ├── feature-grid/
│   └── index.ts (barrel export)
├── templates/
│   ├── ThemeEditorLayout/
│   │   ├── ThemeEditorLayout.tsx
│   │   ├── ThemeEditorLayout.types.ts
│   │   └── index.ts
│   └── index.ts (barrel export)
└── system/
    ├── ComponentDemo.tsx (for testing components)
    └── ComponentSpecs.tsx (component documentation)
```

## File Structure Convention

Every component MUST follow this structure:

### 1. Component.tsx (Implementation)

```typescript
'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { ComponentNameProps } from './ComponentName.types';

export const ComponentName = React.forwardRef<HTMLElement, ComponentNameProps>(
  (
    {
      // Destructure props with defaults
      variant = 'default',
      size = 'md',
      className = '',
      children,
      themeOverride,
      useSystemColors = true,
      ...props
    },
    ref,
  ) => {
    // Component logic here

    const classes = cn([
      // Base classes
      'base-classes',

      // Variant classes
      variantClasses[variant],

      // Size classes
      sizeClasses[size],

      // User-provided classes
      className,
    ]);

    return (
      <element ref={ref} className={classes} {...props}>
        {children}
      </element>
    );
  },
);

ComponentName.displayName = 'ComponentName';

export default ComponentName;
```

### 2. Component.types.ts (TypeScript Types)

```typescript
import type { ReactNode, CSSProperties } from "react";

export type ComponentVariant = "default" | "primary" | "secondary";
export type ComponentSize = "sm" | "md" | "lg";

export interface ComponentNameProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Visual variant of the component
   * @default 'default'
   */
  variant?: ComponentVariant;

  /**
   * Size of the component
   * @default 'md'
   */
  size?: ComponentSize;

  /**
   * Component content
   */
  children: ReactNode;

  /**
   * Custom className for additional styling
   */
  className?: string;

  /**
   * Theme override using CSS custom properties
   */
  themeOverride?: CSSProperties;

  /**
   * Use system color variables (default: true)
   */
  useSystemColors?: boolean;
}
```

### 3. index.ts (Barrel Export)

```typescript
export { ComponentName, default } from "./ComponentName";
export type {
  ComponentNameProps,
  ComponentVariant,
  ComponentSize,
} from "./ComponentName.types";
```

### 4. Component.stories.tsx (Optional - Storybook)

```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { ComponentName } from "./ComponentName";

const meta: Meta<typeof ComponentName> = {
  title: "Atoms/ComponentName",
  component: ComponentName,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Component content",
  },
};
```

## Atomic Levels Detailed

### Atoms

**Definition**: The most basic building blocks. Cannot be broken down further without losing their meaning.

**Characteristics**:

- Single responsibility
- No business logic
- Highly reusable
- Minimal props
- Focused on visual presentation

**Examples**:

- Button
- Input
- Label
- Icon
- Typography
- Badge
- Avatar
- Spinner
- Checkbox
- Radio
- Toggle
- Slider

**Rules**:

- ✅ MUST be pure presentational components
- ✅ MUST use `forwardRef` for DOM element access
- ✅ MUST accept `className` prop for extensibility
- ✅ MUST support `themeOverride` for dynamic theming
- ✅ MUST have TypeScript types in separate `.types.ts` file
- ❌ MUST NOT contain business logic
- ❌ MUST NOT fetch data
- ❌ MUST NOT use complex state management

**Example - Button Atom**:

```typescript
// Button.tsx
<Button variant="primary" size="md" icon="check">
  Save Changes
</Button>
```

### Molecules

**Definition**: Simple combinations of atoms that work together as a unit.

**Characteristics**:

- Composed of 2-5 atoms
- Single purpose
- Reusable across contexts
- May have simple internal state
- Minimal business logic

**Examples**:

- FormField (Label + Input + ErrorMessage)
- SearchBar (Input + Icon + Button)
- ColorPickerField (Label + ColorPicker + Value Display)
- CardHeader (Avatar + Typography + Badge)
- SliderControl (Label + Slider + Value)

**Rules**:

- ✅ MUST compose existing atoms
- ✅ MUST have a single clear purpose
- ✅ MAY have simple internal state (like isOpen, value)
- ✅ MUST be reusable across different contexts
- ❌ MUST NOT fetch data directly
- ❌ MUST NOT contain complex business logic

**Example - FormField Molecule**:

```typescript
// FormField.tsx
<FormField
  label="Email Address"
  type="email"
  placeholder="Enter your email"
  error="Please enter a valid email"
  required
/>
```

### Organisms

**Definition**: Complex components composed of atoms, molecules, and other organisms.

**Characteristics**:

- Composed of multiple molecules/atoms
- Represents distinct section of interface
- May contain business logic
- May manage state
- Context-specific

**Examples**:

- Header (Logo + Navigation + UserMenu)
- Hero (Badge + Typography + Buttons + Image)
- FeatureGrid (Title + FeatureCards[])
- ThemeEditor (ColorPicker + Typography + Borders + Spacing)
- DataTable (Search + Filters + Table + Pagination)
- Form (Multiple FormFields + Submit Button)

**Rules**:

- ✅ MUST compose atoms and molecules
- ✅ MAY contain business logic
- ✅ MAY fetch/manage data
- ✅ MAY use context and hooks
- ✅ SHOULD be organized in subdirectories
- ✅ MUST integrate translations via `useTranslations()` hook

**Example - Hero Organism**:

```typescript
// Hero.tsx
<Hero
  badge={t('homepage.hero.badge')}
  title={t('homepage.hero.title')}
  subtitle={t('homepage.hero.subtitle')}
  primaryCTA={{
    text: t('homepage.hero.cta'),
    href: '/signup'
  }}
  features={[...]}
/>
```

### Templates

**Definition**: Page-level layouts that define structure with placeholder/slot content.

**Characteristics**:

- Define page structure
- Use slots/children for content
- No real data
- Reusable layouts
- Handle responsive behavior

**Examples**:

- DashboardLayout (Sidebar + Header + Content)
- AuthLayout (Logo + Form Container + Footer)
- ThemeEditorLayout (Resizable panels with slots)
- LandingPageLayout (Navbar + Hero + Sections + Footer)

**Rules**:

- ✅ MUST focus on layout and structure
- ✅ MUST use children/slots for content
- ✅ MUST handle responsive behavior
- ✅ MAY include layout-specific organisms (navbars, sidebars)
- ❌ MUST NOT contain real content
- ❌ MUST NOT fetch data

**Example - ThemeEditorLayout Template**:

```typescript
// ThemeEditorLayout.tsx
<ThemeEditorLayout
  leftPanel={<ThemeEditorPanel />}
  rightPanel={<PreviewPanel />}
  topBar={<ActionsBar />}
/>
```

### Pages

**Definition**: Specific instances of templates with real content and data.

**Characteristics**:

- Lives in `app/` directory (Next.js App Router)
- Composed of organisms and templates
- Contains real data
- Handles translations
- Minimal UI code (just composition)

**Examples**:

- `app/[lang]/page.tsx` (Homepage)
- `app/[lang]/(private)/admin/settings/themes/page.tsx`

**Rules**:

- ✅ MUST use `useTranslations()` hook for i18n
- ✅ MUST prepare props with translations before passing to organisms
- ✅ MUST compose organisms from atomic-design
- ✅ MUST be as thin as possible (just configuration)
- ❌ MUST NOT contain UI implementation details
- ❌ MUST NOT duplicate component logic

**Example - Clean Page Implementation**:

```typescript
'use client';

import { Hero, FeatureGrid, PricingCard } from '@/components/organisms';
import { useTranslations } from '@/context/TranslationContext';

export default function Home() {
  const t = useTranslations();

  // Hero configuration
  const heroProps = {
    badge: t('homepage.hero.badge'),
    title: t('homepage.hero.title'),
    subtitle: t('homepage.hero.subtitle'),
    // ... more props
  };

  // Features configuration
  const featuresProps = {
    title: t('homepage.features.title'),
    features: [...],
  };

  return (
    <div>
      <Hero {...heroProps} />
      <FeatureGrid {...featuresProps} />
      <PricingCard {...pricingProps} />
    </div>
  );
}
```

## Translation Integration

### Pattern for Pages with Translations

All page components MUST follow this pattern for translations:

```typescript
'use client';

import { useTranslations } from '@/context/TranslationContext';
import { OrganismName } from '@/components/organisms';

export default function PageName() {
  // 1. Get translation function
  const t = useTranslations();

  // 2. Prepare props configuration with translations
  const componentProps = {
    title: t('namespace.key.title'),
    description: t('namespace.key.description'),
    features: [
      {
        icon: 'icon-name',
        title: t('namespace.features.feature1.title'),
        description: t('namespace.features.feature1.description'),
      },
      // ... more features
    ],
    cta: {
      text: t('namespace.cta.button'),
      href: '/path',
    },
  };

  // 3. Render organisms with prepared props
  return (
    <div>
      <OrganismName {...componentProps} />
    </div>
  );
}
```

### Translation Keys Organization

Translation keys should be organized by feature/page:

```json
{
  "homepage": {
    "hero": {
      "badge": "New Launch",
      "title": "Build Amazing Apps",
      "subtitle": "The best template for your next project"
    },
    "features": {
      "title": "Amazing Features"
    }
  },
  "themeEditor": {
    "selector": {
      "search": "Search themes...",
      "placeholder": "Select a theme"
    },
    "actions": {
      "save": "Save Theme",
      "reset": "Reset",
      "export": "Export"
    },
    "editor": {
      "colors": "Colors",
      "typography": "Typography",
      "borders": "Borders"
    }
  }
}
```

## Common Props Pattern

All components SHOULD support these common props when applicable:

```typescript
interface CommonProps {
  /**
   * Custom className for additional styling
   */
  className?: string;

  /**
   * Theme override using CSS custom properties
   * Allows dynamic theming without CSS classes
   */
  themeOverride?: CSSProperties;

  /**
   * Whether to use system color variables
   * @default true
   */
  useSystemColors?: boolean;

  /**
   * Children elements
   */
  children?: ReactNode;

  /**
   * Data test ID for testing
   */
  "data-testid"?: string;
}
```

## Naming Conventions

### File Naming

- **PascalCase** for component files: `Button.tsx`, `ServiceCard.tsx`
- **PascalCase** for type files: `Button.types.ts`
- **lowercase** for barrel exports: `index.ts`
- **PascalCase.stories** for Storybook: `Button.stories.tsx`

### Component Naming

- **Atoms**: Descriptive noun (Button, Input, Badge)
- **Molecules**: Purpose + Type (FormField, SearchBar, ColorPickerField)
- **Organisms**: Feature + Organism (HeroOrganism, ThemeSelectorOrganism) OR just Feature (Hero, ThemeSelector)
- **Templates**: Feature + Layout (DashboardLayout, ThemeEditorLayout)

### Props Naming

- **Boolean props**: Use `is`, `has`, `should` prefix (isDisabled, hasError, shouldValidate)
- **Event handlers**: Use `on` prefix (onClick, onChange, onSubmit)
- **Render props**: Use `render` prefix (renderHeader, renderFooter)

## Component Composition Guidelines

### 1. Prefer Composition Over Props

**❌ Bad - Too many props**:

```typescript
<Card
  title="Title"
  subtitle="Subtitle"
  image="/image.jpg"
  showBadge
  badgeText="New"
  badgeVariant="success"
  showActions
  actionButtons={[...]}
/>
```

**✅ Good - Composition**:

```typescript
<Card>
  <CardHeader>
    <Badge variant="success">New</Badge>
    <Typography variant="h3">Title</Typography>
    <Typography variant="caption">Subtitle</Typography>
  </CardHeader>
  <CardImage src="/image.jpg" />
  <CardActions>
    <Button>Action 1</Button>
    <Button>Action 2</Button>
  </CardActions>
</Card>
```

### 2. Single Responsibility Principle

Each component should do ONE thing well.

**❌ Bad - Multiple responsibilities**:

```typescript
// UserProfileCard.tsx - Does too much
<UserProfileCard
  user={user}
  showPosts
  showFollowers
  showEditButton
  onEdit={...}
  fetchPosts={...}
/>
```

**✅ Good - Separated concerns**:

```typescript
<UserProfile user={user} />
<UserPosts userId={user.id} />
<UserFollowers userId={user.id} />
<UserActions onEdit={...} />
```

### 3. Props Interface Design

**✅ Good Props Design**:

```typescript
// Clear, focused, well-documented
interface ButtonProps {
  /** Visual style variant */
  variant?: "primary" | "secondary" | "outline";

  /** Size of the button */
  size?: "sm" | "md" | "lg";

  /** Disabled state */
  disabled?: boolean;

  /** Loading state */
  loading?: boolean;

  /** Button content */
  children: ReactNode;
}
```

## Testing Conventions

Every component SHOULD have basic tests:

```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });
});
```

## Migration Strategy

When migrating existing components to Atomic Design:

### Step 1: Identify Component Level

- Is it a basic element? → Atom
- Is it 2-5 atoms working together? → Molecule
- Is it a complex section? → Organism
- Is it a page layout? → Template
- Is it a full page? → Page

### Step 2: Extract Reusable Parts

- Identify atoms that can be extracted
- Create molecules from repeated patterns
- Compose organisms from molecules

### Step 3: Create Types

- Define props interface
- Export types separately
- Document with JSDoc

### Step 4: Implement Translations

- Add `useTranslations()` hook
- Prepare props with translations
- Update translation files

### Step 5: Update Imports

- Update all import paths
- Use barrel exports
- Remove old component files

## Anti-Patterns

### ❌ 1. Atom with Business Logic

```typescript
// atoms/Button.tsx - BAD
const Button = () => {
  const { data } = useQuery(); // ❌ Data fetching in atom
  const dispatch = useDispatch(); // ❌ Redux in atom

  return <button onClick={() => dispatch(action())} />;
};
```

### ❌ 2. Organism in Atom Directory

```typescript
// atoms/ComplexForm.tsx - BAD
// This is clearly an organism, not an atom
const ComplexForm = () => (
  <form>
    <Input />
    <Select />
    <DatePicker />
    <Button type="submit" />
  </form>
);
```

### ❌ 3. Page with Inline UI

```typescript
// page.tsx - BAD
export default function Page() {
  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Title</h1>
        <button className="bg-blue-500 px-4 py-2">Action</button>
      </div>
      {/* More inline UI ❌ */}
    </div>
  );
}
```

**✅ Should be**:

```typescript
// page.tsx - GOOD
export default function Page() {
  const t = useTranslations();
  const props = { title: t('page.title'), action: t('page.action') };

  return <PageOrganism {...props} />;
}
```

### ❌ 4. Direct Translation in Organisms

```typescript
// organisms/Hero.tsx - BAD
const Hero = () => {
  const t = useTranslations(); // ❌ Translation in organism

  return (
    <section>
      <h1>{t('hero.title')}</h1> {/* ❌ Direct translation call */}
    </section>
  );
};
```

**✅ Should be**:

```typescript
// organisms/Hero.tsx - GOOD
interface HeroProps {
  title: string; // ✅ Receive translated text as prop
  subtitle: string;
}

const Hero = ({ title, subtitle }: HeroProps) => {
  return (
    <section>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </section>
  );
};
```

## Benefits of This Architecture

1. **Reusability**: Components can be used across different contexts
2. **Consistency**: Design system ensures visual consistency
3. **Maintainability**: Small, focused components are easier to maintain
4. **Testability**: Isolated components are easier to test
5. **Scalability**: New features composed from existing components
6. **Documentation**: Clear hierarchy makes components easy to find
7. **Collaboration**: Team members understand component organization
8. **Performance**: Smaller components enable better code splitting

## Related Documentation

- `/docs/00-conventions/documentation-guidelines.md` - How to document code
- `/CLAUDE.md` - Main project guidelines
- `/packages/web/src/components/` - Implementation examples
- [Atomic Design Methodology](https://bradfrost.com/blog/post/atomic-web-design/) - Original concept by Brad Frost

## Enforcement

- All new components MUST follow this convention
- Existing components SHOULD be migrated gradually
- Code reviews MUST check for adherence to these patterns
- AI agents (Claude Code) MUST consult this document before creating components
- Linters and tests SHOULD enforce naming conventions where possible
