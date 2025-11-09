# Frontend Storybook Stories Template

**Purpose**: Template for creating Storybook stories with Chromatic visual regression configuration
**Use For**: All shared components (atoms, molecules, organisms)

---

## Complete Stories Template

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ComponentName } from './ComponentName';

/**
 * ComponentName - Brief description of what this component does
 *
 * Usage example:
 * ```tsx
 * <ComponentName variant="primary" size="md">
 *   Click me
 * </ComponentName>
 * ```
 */
const meta = {
  title: 'Atomic Design/Atoms/ComponentName', // adjust path: Atoms/Molecules/Organisms
  component: ComponentName,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A detailed description of the component, its purpose, and usage guidelines.',
      },
    },
    chromatic: {
      viewports: [320, 768, 1200], // mobile, tablet, desktop
      diffThreshold: 0.2, // sensitivity for visual regression (0-1, lower = more sensitive)
      delay: 300, // ms to wait before screenshot
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'outline', 'ghost'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Component size',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    onClick: {
      action: 'clicked',
      description: 'Click event handler',
    },
  },
  args: {
    onClick: fn(), // auto-log actions
  },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default state - the most common usage
 */
export const Default: Story = {
  args: {
    children: 'Default Button',
    variant: 'default',
    size: 'md',
  },
};

/**
 * Primary variant - main call-to-action style
 */
export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
    size: 'md',
  },
};

/**
 * All variants - for Chromatic visual regression
 * This story captures all variants in a single snapshot
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-4">
      <ComponentName variant="default">Default</ComponentName>
      <ComponentName variant="primary">Primary</ComponentName>
      <ComponentName variant="secondary">Secondary</ComponentName>
      <ComponentName variant="outline">Outline</ComponentName>
      <ComponentName variant="ghost">Ghost</ComponentName>
    </div>
  ),
  parameters: {
    chromatic: {
      disableSnapshot: false, // ensure this story is captured
    },
  },
};

/**
 * All sizes - for Chromatic visual regression
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4 p-4">
      <ComponentName size="sm">Small</ComponentName>
      <ComponentName size="md">Medium</ComponentName>
      <ComponentName size="lg">Large</ComponentName>
    </div>
  ),
  parameters: {
    chromatic: {
      disableSnapshot: false,
    },
  },
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    variant: 'primary',
    disabled: true,
  },
};

/**
 * With icon (if applicable)
 */
export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Icon name="check" className="mr-2" />
        Button with Icon
      </>
    ),
    variant: 'primary',
  },
};

/**
 * Long text - edge case
 */
export const LongText: Story = {
  args: {
    children: 'This is a button with a very long text that might wrap or truncate',
    variant: 'primary',
  },
};

/**
 * Dark theme - for theme testing
 */
export const DarkTheme: Story = {
  args: {
    children: 'Dark Theme Button',
    variant: 'primary',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
};

/**
 * Interactive playground - for testing all prop combinations
 */
export const Playground: Story = {
  args: {
    children: 'Playground Button',
    variant: 'primary',
    size: 'md',
    disabled: false,
  },
};
```

---

## Chromatic Configuration

### Viewport Configuration
```typescript
chromatic: {
  viewports: [320, 768, 1200], // test responsive behavior
  // 320 = mobile
  // 768 = tablet
  // 1200 = desktop
}
```

### Diff Threshold (Visual Sensitivity)
```typescript
chromatic: {
  diffThreshold: 0.2, // 0-1 scale
  // 0 = exact match required
  // 0.2 = allow 20% difference (recommended)
  // 1 = allow any difference
}
```

### Disable Snapshots for Specific Stories
```typescript
export const InteractiveOnly: Story = {
  parameters: {
    chromatic: {
      disableSnapshot: true, // don't capture this story
    },
  },
};
```

### Delay Before Screenshot
```typescript
chromatic: {
  delay: 300, // wait 300ms for animations/transitions
}
```

---

## Story Organization Best Practices

### 1. Always Include These Stories:
- **Default**: Most common usage
- **AllVariants**: All variants in one view (for Chromatic)
- **AllSizes**: All sizes in one view (for Chromatic)
- **Disabled**: Disabled state
- **DarkTheme**: Dark mode appearance
- **Playground**: Interactive testing

### 2. Group Related Stories:
```typescript
title: 'Atomic Design/Atoms/Buttons/PrimaryButton',
// NOT: 'Components/PrimaryButton'
```

### 3. Use Descriptive Comments:
```typescript
/**
 * Story name - Brief description
 *
 * Additional context about when to use this variant
 */
```

### 4. Test Edge Cases:
- Long text
- Empty content
- Maximum/minimum values
- Error states

---

## Run Commands

```bash
# Start Storybook dev server
npm run storybook

# Build Storybook for production
npm run build-storybook

# Run Chromatic visual regression
npm run test:visual

# Publish to Chromatic
npx chromatic --project-token=<your-token>
```

---

## Chromatic Integration

### Setup (already configured in package.json):
```json
{
  "scripts": {
    "test:visual": "chromatic --exit-zero-on-changes"
  },
  "devDependencies": {
    "chromatic": "^latest"
  }
}
```

### CI/CD Integration:
```yaml
# .github/workflows/chromatic.yml
- name: Run Chromatic
  uses: chromaui/action@v1
  with:
    projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
```

---

## Common Patterns

### Testing Component States
```typescript
export const AllStates: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 p-4">
      <ComponentName state="idle">Idle</ComponentName>
      <ComponentName state="loading">Loading</ComponentName>
      <ComponentName state="success">Success</ComponentName>
      <ComponentName state="error">Error</ComponentName>
    </div>
  ),
};
```

### Testing Responsive Design
```typescript
export const Responsive: Story = {
  parameters: {
    chromatic: {
      viewports: [320, 768, 1024, 1440],
    },
  },
  render: () => (
    <div className="w-full p-4">
      <ComponentName className="w-full">Responsive Component</ComponentName>
    </div>
  ),
};
```

### Testing Interactions
```typescript
export const WithInteractions: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    await userEvent.hover(button);
    await userEvent.click(button);
  },
};
```

---

**Last Updated**: 2025-01-09
