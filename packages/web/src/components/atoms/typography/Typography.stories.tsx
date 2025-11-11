import type { Meta, StoryObj } from '@storybook/react';
import { Typography } from './index';
import type { TypographyProps } from './Typography.types';

const meta: Meta<typeof Typography> = {
  title: 'Atoms/Typography',
  component: Typography,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'caption', 'overline', 'lead', 'blockquote'],
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'],
    },
    weight: {
      control: { type: 'select' },
      options: ['light', 'normal', 'medium', 'semibold', 'bold', 'extrabold'],
    },
    color: {
      control: { type: 'select' },
      options: ['foreground', 'muted', 'accent', 'primary', 'secondary', 'destructive', 'inherit'],
    },
    align: {
      control: { type: 'select' },
      options: ['left', 'center', 'right', 'justify'],
    },
    truncate: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

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

export const Blockquote: Story = {
  args: {
    variant: 'blockquote',
    children: 'This is a blockquote that stands out from the main content.',
  },
};

export const AllHeadings: Story = {
  render: () => (
    <div className="space-y-4">
      <Typography variant="h1">Heading 1</Typography>
      <Typography variant="h2">Heading 2</Typography>
      <Typography variant="h3">Heading 3</Typography>
      <Typography variant="h4">Heading 4</Typography>
      <Typography variant="h5">Heading 5</Typography>
      <Typography variant="h6">Heading 6</Typography>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-2">
      <Typography size="xs">Extra small text</Typography>
      <Typography size="sm">Small text</Typography>
      <Typography size="md">Medium text (default)</Typography>
      <Typography size="lg">Large text</Typography>
      <Typography size="xl">Extra large text</Typography>
      <Typography size="2xl">2XL text</Typography>
      <Typography size="3xl">3XL text</Typography>
    </div>
  ),
};

export const AllWeights: Story = {
  render: () => (
    <div className="space-y-2">
      <Typography weight="light">Light weight</Typography>
      <Typography weight="normal">Normal weight</Typography>
      <Typography weight="medium">Medium weight</Typography>
      <Typography weight="semibold">Semibold weight</Typography>
      <Typography weight="bold">Bold weight</Typography>
      <Typography weight="extrabold">Extrabold weight</Typography>
    </div>
  ),
};

export const AllColors: Story = {
  render: () => (
    <div className="space-y-2">
      <Typography color="foreground">Foreground color</Typography>
      <Typography color="muted">Muted color</Typography>
      <Typography color="accent">Accent color</Typography>
      <Typography color="primary">Primary color</Typography>
      <Typography color="secondary">Secondary color</Typography>
      <Typography color="destructive">Destructive color</Typography>
    </div>
  ),
};

export const Truncated: Story = {
  args: {
    truncate: true,
    children: 'This is a very long text that will be truncated with ellipsis when it exceeds the container width.',
    className: 'w-48',
  },
};