import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from './ProgressBar';
import React from 'react';

const meta = {
  title: 'Atoms/ProgressBar',
  component: ProgressBar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A linear progress indicator that shows task completion or loading state. Supports multiple variants, sizes, and optional label/percentage display.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Current progress value',
    },
    max: {
      control: { type: 'number' },
      description: 'Maximum value for progress calculation',
    },
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error'],
      description: 'Visual variant of the progress bar',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the progress bar',
    },
    showLabel: {
      control: 'boolean',
      description: 'Show label text',
    },
    showPercentage: {
      control: 'boolean',
      description: 'Show percentage value',
    },
    label: {
      control: 'text',
      description: 'Label text to display',
    },
    animated: {
      control: 'boolean',
      description: 'Animate the progress bar with pulse effect',
    },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 65,
  },
};

export const WithLabel: Story = {
  args: {
    value: 75,
    label: 'Profile completion',
    showLabel: true,
    showPercentage: true,
  },
};

export const Success: Story = {
  args: {
    value: 100,
    variant: 'success',
    label: 'Upload complete',
    showLabel: true,
    showPercentage: true,
  },
};

export const Warning: Story = {
  args: {
    value: 45,
    variant: 'warning',
    label: 'Storage almost full',
    showLabel: true,
    showPercentage: true,
  },
};

export const Error: Story = {
  args: {
    value: 30,
    variant: 'error',
    label: 'Critical error threshold',
    showLabel: true,
    showPercentage: true,
  },
};

export const Small: Story = {
  args: {
    value: 50,
    size: 'sm',
    label: 'Small progress',
    showLabel: true,
  },
};

export const Medium: Story = {
  args: {
    value: 50,
    size: 'md',
    label: 'Medium progress',
    showLabel: true,
  },
};

export const Large: Story = {
  args: {
    value: 50,
    size: 'lg',
    label: 'Large progress',
    showLabel: true,
  },
};

export const Animated: Story = {
  args: {
    value: 0,
  },
  render: () => {
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
      const interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 5));
      }, 200);

      return () => clearInterval(interval);
    }, []);

    return (
      <ProgressBar
        value={progress}
        label="Loading..."
        showLabel
        showPercentage
        animated
      />
    );
  },
};

export const AnimatedSuccess: Story = {
  args: {
    value: 0,
  },
  render: () => {
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
      const interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 3));
      }, 150);

      return () => clearInterval(interval);
    }, []);

    return (
      <ProgressBar
        value={progress}
        variant="success"
        label="Processing..."
        showLabel
        showPercentage
        animated
      />
    );
  },
};

export const ZeroProgress: Story = {
  args: {
    value: 0,
    label: 'Not started',
    showLabel: true,
    showPercentage: true,
  },
};

export const FullProgress: Story = {
  args: {
    value: 100,
    variant: 'success',
    label: 'Completed',
    showLabel: true,
    showPercentage: true,
  },
};

export const CustomMax: Story = {
  args: {
    value: 50,
    max: 200,
    label: 'Custom max value (50/200)',
    showLabel: true,
    showPercentage: true,
  },
};

export const AllVariants: Story = {
  args: {
    value: 65,
  },
  render: () => (
    <div className="space-y-6 w-96">
      <ProgressBar
        value={65}
        variant="default"
        label="Default"
        showLabel
        showPercentage
      />
      <ProgressBar
        value={85}
        variant="success"
        label="Success"
        showLabel
        showPercentage
      />
      <ProgressBar
        value={45}
        variant="warning"
        label="Warning"
        showLabel
        showPercentage
      />
      <ProgressBar
        value={30}
        variant="error"
        label="Error"
        showLabel
        showPercentage
      />
    </div>
  ),
};

export const AllSizes: Story = {
  args: {
    value: 60,
  },
  render: () => (
    <div className="space-y-6 w-96">
      <ProgressBar
        value={60}
        size="sm"
        label="Small"
        showLabel
        showPercentage
      />
      <ProgressBar
        value={60}
        size="md"
        label="Medium"
        showLabel
        showPercentage
      />
      <ProgressBar
        value={60}
        size="lg"
        label="Large"
        showLabel
        showPercentage
      />
    </div>
  ),
};

export const Playground: Story = {
  args: {
    value: 65,
    max: 100,
    variant: 'default',
    size: 'md',
    label: 'Progress',
    showLabel: true,
    showPercentage: true,
    animated: false,
  },
};
