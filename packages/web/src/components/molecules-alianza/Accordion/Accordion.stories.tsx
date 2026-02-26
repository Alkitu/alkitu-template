import type { Meta, StoryObj } from '@storybook/react';
import { Heart, Settings, Star, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { Accordion, AccordionPresets } from './Accordion';
import type { AccordionItem } from './Accordion.types';

const meta = {
  title: 'Molecules/Alianza/Accordion',
  component: Accordion,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A collapsible content component built on Radix UI with support for single/multiple selection, custom icons, badges, and animations.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'card', 'bordered', 'minimal'],
      description: 'Visual variant of the accordion',
    },
    multiple: {
      control: 'boolean',
      description: 'Allow multiple items to be open simultaneously',
    },
    animated: {
      control: 'boolean',
      description: 'Enable smooth animations',
    },
    collapsible: {
      control: 'boolean',
      description: 'Allow all items to be collapsed',
    },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = Omit<StoryObj<typeof meta>, 'args'> & Partial<Pick<StoryObj<typeof meta>, 'args'>>;

// Sample data
const faqItems: AccordionItem[] = [
  {
    id: 'faq-1',
    title: 'What is Atomic Design?',
    content:
      'Atomic Design is a methodology for creating design systems. It breaks down interfaces into fundamental building blocks (atoms) and combines them into increasingly complex components (molecules, organisms, templates, and pages).',
  },
  {
    id: 'faq-2',
    title: 'How do I get started?',
    content:
      'Start by installing the required dependencies, then explore our comprehensive documentation and examples. You can begin building with our pre-built components or create your own following our atomic design principles.',
  },
  {
    id: 'faq-3',
    title: 'What are the key features?',
    content:
      'Our design system includes TypeScript support, full accessibility compliance, dark mode theming, responsive layouts, comprehensive testing, and extensive documentation. All components follow SOLID principles and best practices.',
  },
  {
    id: 'faq-4',
    title: 'Is it production-ready?',
    content:
      'Yes! All components are thoroughly tested with 90%+ coverage, accessible, and used in production applications. We follow semantic versioning and provide migration guides for breaking changes.',
  },
];

const settingsItems: AccordionItem[] = [
  {
    id: 'general',
    title: 'General Settings',
    icon: <Settings className="h-4 w-4" />,
    content: (
      <div className="space-y-2">
        <p>Configure general application settings:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Language preferences</li>
          <li>Time zone settings</li>
          <li>Date format options</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'notifications',
    title: 'Notification Preferences',
    icon: <Heart className="h-4 w-4" />,
    badge: { text: 'New', variant: 'secondary' },
    content: (
      <div className="space-y-2">
        <p>Manage your notification settings:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Email notifications</li>
          <li>Push notifications</li>
          <li>In-app alerts</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'privacy',
    title: 'Privacy & Security',
    icon: <Star className="h-4 w-4" />,
    content: (
      <div className="space-y-2">
        <p>Control your privacy and security:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Two-factor authentication</li>
          <li>Data sharing preferences</li>
          <li>Account visibility</li>
        </ul>
      </div>
    ),
  },
];

const statusItems: AccordionItem[] = [
  {
    id: 'success',
    title: 'Successful Operations',
    icon: <CheckCircle className="h-4 w-4" />,
    badge: { text: '5 Active', variant: 'secondary' },
    content: 'All systems are operational and running smoothly. No issues detected.',
    defaultOpen: true,
  },
  {
    id: 'warning',
    title: 'Warnings',
    icon: <AlertTriangle className="h-4 w-4" />,
    badge: { text: '2 Warnings', variant: 'outline' },
    content: 'Some services are experiencing minor delays. No immediate action required.',
  },
  {
    id: 'error',
    title: 'Critical Issues',
    icon: <Info className="h-4 w-4" />,
    badge: { text: 'Urgent', variant: 'destructive' },
    content: 'Database backup service is currently offline. System administrators have been notified.',
  },
  {
    id: 'maintenance',
    title: 'Scheduled Maintenance',
    icon: <Settings className="h-4 w-4" />,
    disabled: true,
    content: 'Maintenance window information is not available at this time.',
  },
];

/**
 * Default accordion with basic FAQ items.
 */
export const Default: Story = {
  args: {
    items: faqItems,
    variant: 'default',
  },
};

/**
 * Card variant with shadow effect.
 */
export const CardVariant: Story = {
  args: {
    items: faqItems,
    variant: 'card',
  },
};

/**
 * Bordered variant with thicker border.
 */
export const BorderedVariant: Story = {
  args: {
    items: faqItems,
    variant: 'bordered',
  },
};

/**
 * Minimal variant without background or borders.
 */
export const MinimalVariant: Story = {
  args: {
    items: faqItems,
    variant: 'minimal',
  },
};

/**
 * Single selection mode (default) - only one item can be open at a time.
 */
export const SingleSelection: Story = {
  args: {
    items: faqItems,
    multiple: false,
    variant: 'card',
  },
};

/**
 * Multiple selection mode - multiple items can be open simultaneously.
 */
export const MultipleSelection: Story = {
  args: {
    items: faqItems,
    multiple: true,
    variant: 'card',
  },
};

/**
 * Accordion with custom icons for each item.
 */
export const WithCustomIcons: Story = {
  args: {
    items: settingsItems,
    variant: 'card',
  },
};

/**
 * Accordion with badges showing item status.
 */
export const WithBadges: Story = {
  args: {
    items: statusItems,
    variant: 'default',
  },
};

/**
 * Accordion with disabled items.
 */
export const WithDisabledItems: Story = {
  args: {
    items: statusItems,
    variant: 'card',
  },
};

/**
 * Accordion with default open state.
 */
export const DefaultOpen: Story = {
  args: {
    items: statusItems,
    variant: 'card',
  },
};

/**
 * Accordion without animations.
 */
export const WithoutAnimation: Story = {
  args: {
    items: faqItems,
    animated: false,
    variant: 'default',
  },
};

/**
 * Non-collapsible accordion (at least one item must be open).
 */
export const NonCollapsible: Story = {
  args: {
    items: faqItems.map((item, index) => ({
      ...item,
      defaultOpen: index === 0,
    })),
    collapsible: false,
    variant: 'card',
  },
};

/**
 * Accordion with JSX content instead of strings.
 */
export const WithComplexContent: Story = {
  args: {
    items: settingsItems,
    variant: 'card',
    multiple: true,
  },
};

/**
 * Using the basic preset configuration.
 */
export const BasicPreset: Story = {
  args: {
    items: faqItems,
    ...AccordionPresets.basic,
  },
};

/**
 * Using the card preset configuration.
 */
export const CardPreset: Story = {
  args: {
    items: faqItems,
    ...AccordionPresets.card,
  },
};

/**
 * Using the multiSelect preset configuration.
 */
export const MultiSelectPreset: Story = {
  args: {
    items: faqItems,
    ...AccordionPresets.multiSelect,
  },
};

/**
 * Using the minimal preset configuration.
 */
export const MinimalPreset: Story = {
  args: {
    items: faqItems,
    ...AccordionPresets.minimal,
  },
};

/**
 * FAQ section with all features combined.
 */
export const FullFeaturedFAQ: Story = {
  args: {
    items: [
      {
        id: 'pricing',
        title: 'Pricing & Plans',
        icon: <Star className="h-4 w-4" />,
        badge: { text: 'Popular', variant: 'secondary' },
        content: (
          <div className="space-y-2">
            <p>We offer flexible pricing plans for every need:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Free tier with basic features</li>
              <li>Pro plan at $29/month</li>
              <li>Enterprise with custom pricing</li>
            </ul>
          </div>
        ),
        defaultOpen: true,
      },
      {
        id: 'support',
        title: 'Customer Support',
        icon: <Heart className="h-4 w-4" />,
        badge: { text: '24/7', variant: 'outline' },
        content:
          'Our dedicated support team is available 24/7 via email, chat, and phone. Enterprise customers get dedicated account managers.',
      },
      {
        id: 'security',
        title: 'Security & Compliance',
        icon: <Settings className="h-4 w-4" />,
        content:
          'We take security seriously with SOC 2 Type II certification, GDPR compliance, end-to-end encryption, and regular third-party audits.',
      },
      {
        id: 'beta',
        title: 'Beta Features (Coming Soon)',
        icon: <Info className="h-4 w-4" />,
        badge: { text: 'Beta', variant: 'outline' },
        disabled: true,
        content: 'Exciting new features are in development and will be available soon.',
      },
    ],
    variant: 'card',
    multiple: false,
  },
};

/**
 * Compact accordion with minimal styling.
 */
export const CompactMinimal: Story = {
  args: {
    items: [
      { id: '1', title: 'Quick Question 1', content: 'Short answer.' },
      { id: '2', title: 'Quick Question 2', content: 'Another short answer.' },
      { id: '3', title: 'Quick Question 3', content: 'Yet another short answer.' },
    ],
    variant: 'minimal',
    animated: false,
  },
};

/**
 * Long content stress test.
 */
export const LongContent: Story = {
  args: {
    items: [
      {
        id: 'long-1',
        title: 'Very Long Content Example',
        content: `
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.

          Eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.
        `,
      },
      {
        id: 'long-2',
        title: 'Another Long Section',
        content:
          'This is another section with substantial content to demonstrate how the accordion handles varying content lengths gracefully.',
      },
    ],
    variant: 'card',
  },
};
