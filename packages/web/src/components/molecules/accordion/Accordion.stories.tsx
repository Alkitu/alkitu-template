import type { Meta, StoryObj } from '@storybook/react';
import { Accordion, AccordionPresets } from './Accordion';
import type { AccordionItem } from './Accordion.types';
import { Check, Star, AlertCircle, Info } from 'lucide-react';

const meta = {
  title: 'Atomic Design/Molecules/Accordion',
  component: Accordion,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A collapsible content component that combines Radix UI Accordion primitives with enhanced styling, animations, and theme integration. Supports multiple variants, badges, custom icons, and both single and multiple selection modes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'card', 'bordered', 'minimal'],
      description: 'Visual variant of the accordion',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    multiple: {
      control: 'boolean',
      description: 'Allow multiple items to be open simultaneously',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    animated: {
      control: 'boolean',
      description: 'Enable smooth animations',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    collapsible: {
      control: 'boolean',
      description: 'Allow all items to be collapsed',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic items
const basicItems: AccordionItem[] = [
  {
    id: 'item-1',
    title: 'What is Atomic Design?',
    content:
      'Atomic Design is a methodology for creating design systems. It breaks down user interfaces into fundamental building blocks (atoms) and combines them to form increasingly complex components.',
  },
  {
    id: 'item-2',
    title: 'What are Molecules?',
    content:
      'Molecules are groups of atoms bonded together, forming relatively simple UI components. Examples include form fields (label + input), search bars (input + button), or navigation items (icon + text).',
  },
  {
    id: 'item-3',
    title: 'When to use Accordions?',
    content:
      'Accordions are ideal for organizing content in a limited space, reducing page scroll, and allowing users to selectively view information that interests them most.',
  },
];

// Items with badges
const itemsWithBadges: AccordionItem[] = [
  {
    id: 'feature-1',
    title: 'Theme Customization',
    content: 'Fully customizable theming system with CSS variables and Tailwind integration.',
    badge: { text: 'New', variant: 'outline' },
  },
  {
    id: 'feature-2',
    title: 'Accessibility Built-in',
    content: 'WCAG 2.1 AA compliant with full keyboard navigation and screen reader support.',
    badge: { text: 'A11y', variant: 'secondary' },
  },
  {
    id: 'feature-3',
    title: 'Performance Optimized',
    content: 'Lazy loading, code splitting, and optimized bundle size for fast load times.',
    badge: { text: 'Fast', variant: 'destructive' },
  },
];

// Items with custom icons
const itemsWithIcons: AccordionItem[] = [
  {
    id: 'status-1',
    title: 'Completed Tasks',
    content: 'All assigned tasks have been successfully completed and reviewed.',
    icon: <Check className="h-4 w-4" />,
  },
  {
    id: 'status-2',
    title: 'Favorite Items',
    content: 'Your starred and favorite items appear here for quick access.',
    icon: <Star className="h-4 w-4" />,
  },
  {
    id: 'status-3',
    title: 'Attention Required',
    content: 'Some items need your immediate attention or action.',
    icon: <AlertCircle className="h-4 w-4" />,
  },
];

// Items with rich content
const itemsWithRichContent: AccordionItem[] = [
  {
    id: 'rich-1',
    title: 'Installation Guide',
    content: (
      <div className="space-y-2">
        <p className="font-medium">Install via npm:</p>
        <pre className="rounded-md bg-muted p-2 text-sm">
          <code>npm install @your-package/accordion</code>
        </pre>
        <p className="text-sm text-muted-foreground">
          Then import in your React component:
        </p>
        <pre className="rounded-md bg-muted p-2 text-sm">
          <code>{`import { Accordion } from '@your-package/accordion';`}</code>
        </pre>
      </div>
    ),
    icon: <Info className="h-4 w-4" />,
  },
  {
    id: 'rich-2',
    title: 'Configuration Options',
    content: (
      <div className="space-y-2">
        <ul className="list-inside list-disc space-y-1 text-sm">
          <li>Single or multiple selection modes</li>
          <li>4 visual variants (default, card, bordered, minimal)</li>
          <li>Customizable animations</li>
          <li>Badge and icon support</li>
          <li>Disabled state handling</li>
        </ul>
      </div>
    ),
  },
];

/**
 * Default accordion with basic styling and single selection mode.
 */
export const Default: Story = {
  args: {
    items: basicItems,
    variant: 'default',
    multiple: false,
    animated: true,
    collapsible: true,
  },
};

/**
 * Card variant with shadow and elevated appearance.
 */
export const CardVariant: Story = {
  args: {
    items: basicItems,
    variant: 'card',
    multiple: false,
    animated: true,
    collapsible: true,
  },
};

/**
 * Bordered variant with thicker borders.
 */
export const BorderedVariant: Story = {
  args: {
    items: basicItems,
    variant: 'bordered',
    multiple: false,
    animated: true,
    collapsible: true,
  },
};

/**
 * Minimal variant without background or borders.
 */
export const MinimalVariant: Story = {
  args: {
    items: basicItems,
    variant: 'minimal',
    multiple: false,
    animated: true,
    collapsible: true,
  },
};

/**
 * Multiple selection mode allows multiple items to be open at once.
 */
export const MultipleSelection: Story = {
  args: {
    items: basicItems,
    variant: 'default',
    multiple: true,
    animated: true,
    collapsible: true,
  },
};

/**
 * Accordion with badges to highlight important items.
 */
export const WithBadges: Story = {
  args: {
    items: itemsWithBadges,
    variant: 'card',
    multiple: false,
    animated: true,
    collapsible: true,
  },
};

/**
 * Accordion with custom icons for each item.
 */
export const WithCustomIcons: Story = {
  args: {
    items: itemsWithIcons,
    variant: 'default',
    multiple: false,
    animated: true,
    collapsible: true,
  },
};

/**
 * Accordion with rich content including code blocks and lists.
 */
export const WithRichContent: Story = {
  args: {
    items: itemsWithRichContent,
    variant: 'card',
    multiple: false,
    animated: true,
    collapsible: true,
  },
};

/**
 * Accordion with disabled animation for reduced motion preferences.
 */
export const WithoutAnimation: Story = {
  args: {
    items: basicItems,
    variant: 'default',
    multiple: false,
    animated: false,
    collapsible: true,
  },
};

/**
 * Accordion with first item open by default.
 */
export const WithDefaultOpen: Story = {
  args: {
    items: [
      {
        ...basicItems[0],
        defaultOpen: true,
      },
      ...basicItems.slice(1),
    ],
    variant: 'default',
    multiple: false,
    animated: true,
    collapsible: true,
  },
};

/**
 * Accordion with disabled items that cannot be opened.
 */
export const WithDisabledItems: Story = {
  args: {
    items: [
      basicItems[0],
      {
        ...basicItems[1],
        disabled: true,
      },
      basicItems[2],
    ],
    variant: 'default',
    multiple: false,
    animated: true,
    collapsible: true,
  },
};

/**
 * Non-collapsible accordion always keeps one item open.
 */
export const NonCollapsible: Story = {
  args: {
    items: [
      {
        ...basicItems[0],
        defaultOpen: true,
      },
      ...basicItems.slice(1),
    ],
    variant: 'default',
    multiple: false,
    animated: true,
    collapsible: false,
  },
};

/**
 * Basic preset configuration.
 */
export const BasicPreset: Story = {
  args: {
    items: basicItems,
    ...AccordionPresets.basic,
  },
};

/**
 * Card preset configuration.
 */
export const CardPreset: Story = {
  args: {
    items: itemsWithBadges,
    ...AccordionPresets.card,
  },
};

/**
 * Multi-select preset configuration.
 */
export const MultiSelectPreset: Story = {
  args: {
    items: itemsWithIcons,
    ...AccordionPresets.multiSelect,
  },
};

/**
 * Minimal preset configuration.
 */
export const MinimalPreset: Story = {
  args: {
    items: basicItems,
    ...AccordionPresets.minimal,
  },
};

/**
 * Kitchen sink example with all features combined.
 */
export const AllFeatures: Story = {
  args: {
    items: [
      {
        id: 'all-1',
        title: 'Complete Example',
        content: (
          <div className="space-y-2">
            <p>This item demonstrates all features:</p>
            <ul className="list-inside list-disc text-sm">
              <li>Custom icon</li>
              <li>Badge variant</li>
              <li>Rich content</li>
              <li>Default open state</li>
            </ul>
          </div>
        ),
        icon: <Star className="h-4 w-4" />,
        badge: { text: 'Featured', variant: 'destructive' },
        defaultOpen: true,
      },
      {
        id: 'all-2',
        title: 'Disabled Item',
        content: 'This item is disabled and cannot be opened.',
        disabled: true,
        badge: { text: 'Locked', variant: 'secondary' },
      },
      {
        id: 'all-3',
        title: 'Regular Item',
        content: 'This is a regular item with just text content.',
      },
    ],
    variant: 'card',
    multiple: true,
    animated: true,
    collapsible: true,
  },
};
