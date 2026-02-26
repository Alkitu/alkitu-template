import type { Meta, StoryObj } from '@storybook/react';
import Typography, { Heading } from './Typography';
import type { TypographyProps } from './Typography.types';

const meta: Meta<typeof Typography> = {
  title: 'Alianza/Atoms/Typography',
  component: Typography,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Typography Component

Unified typography system for the Alianza Design System.

## Features
- **13 Semantic Variants**: h1-h6, p, span, label, caption, overline, lead, blockquote
- **9 Size Options**: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl
- **6 Weight Options**: light, normal, medium, semibold, bold, extrabold
- **7 Color Options**: foreground, muted, accent, primary, secondary, destructive, inherit
- **4 Alignments**: left, center, right, justify
- **Alianza Theme Integration**: Uses CSS variables from design system
- **Backward Compatible**: Includes legacy Heading component

## Accessibility
- Semantic HTML elements
- Proper heading hierarchy
- Label form association support
- ARIA attributes support
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'p',
        'span',
        'label',
        'caption',
        'overline',
        'lead',
        'blockquote',
      ],
      description: 'Semantic variant determining HTML element and styling',
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'],
      description: 'Text size (overrides variant defaults)',
    },
    weight: {
      control: { type: 'select' },
      options: ['light', 'normal', 'medium', 'semibold', 'bold', 'extrabold'],
      description: 'Font weight',
    },
    color: {
      control: { type: 'select' },
      options: [
        'foreground',
        'muted',
        'accent',
        'primary',
        'secondary',
        'destructive',
        'inherit',
      ],
      description: 'Text color using theme colors',
    },
    align: {
      control: { type: 'select' },
      options: ['left', 'center', 'right', 'justify'],
      description: 'Text alignment',
    },
    truncate: {
      control: { type: 'boolean' },
      description: 'Truncate text with ellipsis',
    },
    useAlianzaTheme: {
      control: { type: 'boolean' },
      description: 'Use Alianza design system CSS variables (headings only)',
    },
  },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = Omit<StoryObj<typeof meta>, 'args'> & Partial<Pick<StoryObj<typeof meta>, 'args'>>;

// Basic Examples
export const Paragraph: Story = {
  args: {
    variant: 'p',
    children: 'This is a paragraph of text that demonstrates the Typography component.',
  },
};

export const Heading1: Story = {
  args: {
    variant: 'h1',
    children: 'Main Heading',
  },
};

export const Heading2: Story = {
  args: {
    variant: 'h2',
    children: 'Section Heading',
  },
};

export const Heading3: Story = {
  args: {
    variant: 'h3',
    children: 'Subsection Heading',
  },
};

export const Lead: Story = {
  args: {
    variant: 'lead',
    children: 'This is a lead paragraph that stands out from regular text.',
  },
};

export const Caption: Story = {
  args: {
    variant: 'caption',
    children: 'This is a caption with smaller, muted text.',
  },
};

export const Overline: Story = {
  args: {
    variant: 'overline',
    children: 'Overline Text',
  },
};

export const Label: Story = {
  args: {
    variant: 'label',
    children: 'Form Label',
  },
};

export const Blockquote: Story = {
  args: {
    variant: 'blockquote',
    children: 'This is a blockquote that stands out from the main content.',
  },
};

// Comprehensive Showcases
export const AllHeadings: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-2xl">
      <Typography variant="h1">Heading 1 - Main Title</Typography>
      <Typography variant="h2">Heading 2 - Section</Typography>
      <Typography variant="h3">Heading 3 - Subsection</Typography>
      <Typography variant="h4">Heading 4 - Minor Heading</Typography>
      <Typography variant="h5">Heading 5 - Small Heading</Typography>
      <Typography variant="h6">Heading 6 - Smallest Heading</Typography>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-2 w-full max-w-2xl">
      <Typography size="xs">Extra small text (xs)</Typography>
      <Typography size="sm">Small text (sm)</Typography>
      <Typography size="md">Medium text (md) - default</Typography>
      <Typography size="lg">Large text (lg)</Typography>
      <Typography size="xl">Extra large text (xl)</Typography>
      <Typography size="2xl">2X Large text (2xl)</Typography>
      <Typography size="3xl">3X Large text (3xl)</Typography>
      <Typography size="4xl">4X Large text (4xl)</Typography>
      <Typography size="5xl">5X Large text (5xl)</Typography>
    </div>
  ),
};

export const AllWeights: Story = {
  render: () => (
    <div className="space-y-2 w-full max-w-2xl">
      <Typography weight="light">Light weight (300)</Typography>
      <Typography weight="normal">Normal weight (400)</Typography>
      <Typography weight="medium">Medium weight (500)</Typography>
      <Typography weight="semibold">Semibold weight (600)</Typography>
      <Typography weight="bold">Bold weight (700)</Typography>
      <Typography weight="extrabold">Extrabold weight (800)</Typography>
    </div>
  ),
};

export const AllColors: Story = {
  render: () => (
    <div className="space-y-2 w-full max-w-2xl">
      <Typography color="foreground">Foreground color</Typography>
      <Typography color="muted">Muted color (secondary text)</Typography>
      <Typography color="accent">Accent color</Typography>
      <Typography color="primary">Primary color</Typography>
      <Typography color="secondary">Secondary color</Typography>
      <Typography color="destructive">Destructive color (errors)</Typography>
      <Typography color="inherit">Inherit color (from parent)</Typography>
    </div>
  ),
};

export const AllAlignments: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-2xl">
      <Typography align="left">
        Left aligned text - This text is aligned to the left side of the container.
      </Typography>
      <Typography align="center">
        Center aligned text - This text is centered in the container.
      </Typography>
      <Typography align="right">
        Right aligned text - This text is aligned to the right side of the container.
      </Typography>
      <Typography align="justify">
        Justified text - This is a longer paragraph that demonstrates justified
        alignment. The text stretches across the full width of the container with
        even spacing between words.
      </Typography>
    </div>
  ),
};

// Feature Demonstrations
export const Truncated: Story = {
  args: {
    truncate: true,
    children:
      'This is a very long text that will be truncated with ellipsis when it exceeds the container width.',
    className: 'w-48',
  },
};

export const CustomSizeAndWeight: Story = {
  args: {
    variant: 'h1',
    size: 'sm',
    weight: 'light',
    children: 'H1 with small size and light weight',
  },
};

export const AlianzaThemedHeadings: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-2xl">
      <Typography variant="h1" useAlianzaTheme>
        H1 with Alianza Theme Variables
      </Typography>
      <Typography variant="h2" useAlianzaTheme>
        H2 with Alianza Theme Variables
      </Typography>
      <Typography variant="h3" useAlianzaTheme>
        H3 with Alianza Theme Variables
      </Typography>
      <p className="text-sm text-muted-foreground">
        These headings use CSS variables from the Alianza design system:
        --typography-h*-font-family, --typography-h*-font-size, etc.
      </p>
    </div>
  ),
};

// Semantic HTML Examples
export const SemanticUsage: Story = {
  render: () => (
    <article className="space-y-4 w-full max-w-2xl">
      <Typography variant="h1">Article Title</Typography>
      <Typography variant="lead">
        This is a lead paragraph that introduces the article content.
      </Typography>
      <Typography variant="h2">Section Heading</Typography>
      <Typography variant="p">
        This is a regular paragraph with normal body text. It demonstrates the
        default paragraph styling with appropriate line height and spacing.
      </Typography>
      <Typography variant="blockquote">
        This is an important quote from the article that deserves special emphasis.
      </Typography>
      <Typography variant="h3">Subsection</Typography>
      <Typography variant="p">
        Another paragraph of content with{' '}
        <Typography variant="span" weight="bold">
          inline bold text
        </Typography>{' '}
        and{' '}
        <Typography variant="span" color="primary">
          colored text
        </Typography>
        .
      </Typography>
      <Typography variant="caption">
        Figure 1: This is a caption for an image or figure.
      </Typography>
    </article>
  ),
};

// Form Label Example
export const FormLabelExample: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-md">
      <div>
        <Typography variant="label" {...{htmlFor: "input-1"}} className="mb-2 block">
          Email Address
        </Typography>
        <input
          id="input-1"
          type="email"
          className="w-full rounded border px-3 py-2"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <Typography variant="label" {...{htmlFor: "input-2"}} className="mb-2 block">
          Password
        </Typography>
        <input
          id="input-2"
          type="password"
          className="w-full rounded border px-3 py-2"
          placeholder="Enter password"
        />
        <Typography variant="caption" className="mt-1 block">
          Must be at least 8 characters
        </Typography>
      </div>
    </div>
  ),
};

// Backward Compatibility - Legacy Heading Component
export const LegacyHeadingComponent: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-2xl">
      <div>
        <Typography variant="overline">Legacy Heading Component</Typography>
      </div>
      <Heading level={1}>Heading Level 1</Heading>
      <Heading level={2}>Heading Level 2</Heading>
      <Heading level={3}>Heading Level 3</Heading>
      <Heading level={4}>Heading Level 4</Heading>
      <Heading level={5}>Heading Level 5</Heading>
      <Heading level={6}>Heading Level 6</Heading>
      <Typography variant="caption" className="block mt-4">
        Note: The Heading component is provided for backward compatibility with the
        original Alianza Typography.tsx implementation. It uses Alianza theme
        variables by default.
      </Typography>
    </div>
  ),
};

// Color Variants on Dark Background
export const ColorVariantsOnDark: Story = {
  render: () => (
    <div className="space-y-2 w-full max-w-2xl p-6 bg-slate-900 rounded-lg">
      <Typography variant="h3" color="foreground" className="mb-4">
        Typography Colors on Dark Background
      </Typography>
      <Typography color="foreground">Foreground color</Typography>
      <Typography color="muted">Muted color</Typography>
      <Typography color="accent">Accent color</Typography>
      <Typography color="primary">Primary color</Typography>
      <Typography color="secondary">Secondary color</Typography>
      <Typography color="destructive">Destructive color</Typography>
    </div>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// Responsive Typography
export const ResponsiveExample: Story = {
  render: () => (
    <div className="space-y-6 w-full max-w-4xl">
      <div>
        <Typography variant="overline" className="mb-2">
          Responsive Heading
        </Typography>
        <Typography variant="h1" className="md:text-5xl lg:text-6xl">
          This heading adjusts size on different screens
        </Typography>
        <Typography variant="caption" className="mt-2 block">
          Custom responsive classes can be added via className prop
        </Typography>
      </div>
    </div>
  ),
};

// Theme Override Example
export const ThemeOverride: Story = {
  args: {
    variant: 'h2',
    children: 'Custom Themed Typography',
    themeOverride: {
      '--primary': '#ff6b6b',
      color: 'var(--primary)',
    },
  },
};

// Complex Content
export const ComplexContent: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-2xl">
      <Typography variant="h2">
        Complex Content with{' '}
        <Typography variant="span" color="primary">
          Colored
        </Typography>{' '}
        and{' '}
        <Typography variant="span" weight="bold">
          Bold
        </Typography>{' '}
        Elements
      </Typography>
      <Typography variant="p">
        This paragraph contains{' '}
        <Typography variant="span" weight="semibold" color="accent">
          nested Typography components
        </Typography>{' '}
        for fine-grained control over{' '}
        <Typography variant="span" size="lg">
          different parts
        </Typography>{' '}
        of the text.
      </Typography>
    </div>
  ),
};
