import type { Meta, StoryObj } from '@storybook/react';
import { CharacterCount } from './CharacterCount';

const meta: Meta<typeof CharacterCount> = {
  title: 'Form Builder/Atoms/CharacterCount',
  component: CharacterCount,
  tags: ['autodocs'],
  argTypes: {
    current: {
      control: { type: 'number', min: 0 },
      description: 'Current character count',
    },
    max: {
      control: { type: 'number', min: 0 },
      description: 'Maximum character limit (optional)',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CharacterCount>;

export const Default: Story = {
  args: {
    current: 42,
    max: 100,
  },
};

export const NoMax: Story = {
  args: {
    current: 42,
  },
};

export const NearLimit: Story = {
  args: {
    current: 95,
    max: 100,
  },
};

export const AtLimit: Story = {
  args: {
    current: 100,
    max: 100,
  },
};

export const OverLimit: Story = {
  args: {
    current: 110,
    max: 100,
  },
};

export const LowUsage: Story = {
  args: {
    current: 10,
    max: 500,
  },
};

export const MediumUsage: Story = {
  args: {
    current: 250,
    max: 500,
  },
};

export const HighUsage: Story = {
  args: {
    current: 450,
    max: 500,
  },
};
