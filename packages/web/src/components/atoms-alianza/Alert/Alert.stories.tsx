import type { Meta, StoryObj } from '@storybook/react';
import {
  Info as InfoIcon,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { Alert } from './Alert';

const meta = {
  title: 'Atomic Design/Atoms/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Alert component displays contextual information to users with different severity levels. Supports multiple variants (info, success, warning, error), optional icons, titles, and dismissible functionality.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'info', 'success', 'warning', 'error'],
      description: 'Visual variant of the alert',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the alert',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    title: {
      control: 'text',
      description: 'Optional title for the alert',
    },
    showIcon: {
      control: 'boolean',
      description: 'Whether to show the icon',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    dismissible: {
      control: 'boolean',
      description: 'Whether the alert can be dismissed',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    children: {
      control: 'text',
      description: 'Alert content',
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = Omit<StoryObj<typeof meta>, 'args'> & Partial<Pick<StoryObj<typeof meta>, 'args'>>;

// Default story
export const Default: Story = {
  args: {
    children: 'This is a default alert message.',
  },
};

// Variants
export const Info: Story = {
  args: {
    variant: 'info',
    children: 'This is an informational alert with useful information.',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Your changes have been saved successfully!',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Please review your settings before continuing.',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    children: 'An error occurred while processing your request.',
  },
};

// With Title
export const WithTitle: Story = {
  args: {
    variant: 'info',
    title: 'Important Information',
    children: 'Please read this information carefully before proceeding.',
  },
};

export const SuccessWithTitle: Story = {
  args: {
    variant: 'success',
    title: 'Success!',
    children: 'Your operation completed successfully.',
  },
};

export const WarningWithTitle: Story = {
  args: {
    variant: 'warning',
    title: 'Warning',
    children: 'This action may have unintended consequences.',
  },
};

export const ErrorWithTitle: Story = {
  args: {
    variant: 'error',
    title: 'Error',
    children: 'Something went wrong. Please try again.',
  },
};

// Sizes
export const Small: Story = {
  args: {
    size: 'sm',
    variant: 'info',
    children: 'This is a small alert.',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    variant: 'success',
    children: 'This is a medium alert (default size).',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    variant: 'warning',
    children: 'This is a large alert with more prominent styling.',
  },
};

// Without Icon
export const WithoutIcon: Story = {
  args: {
    variant: 'info',
    showIcon: false,
    children: 'This alert does not display an icon.',
  },
};

// Dismissible
export const Dismissible: Story = {
  args: {
    variant: 'info',
    dismissible: true,
    onDismiss: () => console.log('Alert dismissed'),
    children: 'This alert can be dismissed by clicking the X button.',
  },
};

export const DismissibleWithTitle: Story = {
  args: {
    variant: 'warning',
    title: 'Dismissible Warning',
    dismissible: true,
    onDismiss: () => console.log('Warning dismissed'),
    children: 'You can close this warning when you have read it.',
  },
};

// Custom Icon
export const CustomIcon: Story = {
  args: {
    variant: 'info',
    icon: AlertCircle,
    children: 'This alert uses a custom icon instead of the default.',
  },
};

// Long Content
export const LongContent: Story = {
  args: {
    variant: 'info',
    title: 'Detailed Information',
    dismissible: true,
    children:
      'This is a longer alert message that demonstrates how the component handles multiple lines of text. It wraps properly and maintains good readability even with extensive content. The layout remains clean and the dismiss button stays properly aligned at the top right.',
  },
};

// All Variants Showcase
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Alert variant="default">Default variant alert</Alert>
      <Alert variant="info">Info variant alert</Alert>
      <Alert variant="success">Success variant alert</Alert>
      <Alert variant="warning">Warning variant alert</Alert>
      <Alert variant="error">Error variant alert</Alert>
    </div>
  ),
};

// All Sizes Showcase
export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Alert size="sm" variant="info">
        Small size alert
      </Alert>
      <Alert size="md" variant="success">
        Medium size alert (default)
      </Alert>
      <Alert size="lg" variant="warning">
        Large size alert
      </Alert>
    </div>
  ),
};

// Complex Example
export const ComplexExample: Story = {
  render: () => (
    <div className="space-y-4">
      <Alert variant="error" title="Critical Error" dismissible size="lg">
        Unable to connect to the server. Please check your internet connection
        and try again. If the problem persists, contact support.
      </Alert>
      <Alert variant="success" title="Upload Complete" dismissible>
        Your files have been uploaded successfully. You can now view them in
        your dashboard.
      </Alert>
      <Alert variant="warning" size="sm">
        Your session will expire in 5 minutes.
      </Alert>
      <Alert variant="info" showIcon={false}>
        Tip: You can customize the appearance of alerts using the className
        prop.
      </Alert>
    </div>
  ),
};

// Dark Mode Test
export const DarkModeTest: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  render: () => (
    <div className="dark space-y-4">
      <Alert variant="default">Default in dark mode</Alert>
      <Alert variant="info" title="Info">
        Info alert in dark mode
      </Alert>
      <Alert variant="success" title="Success" dismissible>
        Success alert in dark mode
      </Alert>
      <Alert variant="warning" title="Warning">
        Warning alert in dark mode
      </Alert>
      <Alert variant="error" title="Error" dismissible>
        Error alert in dark mode
      </Alert>
    </div>
  ),
};

// Interactive Example
export const Interactive: Story = {
  args: {
    variant: 'info',
    title: 'Interactive Alert',
    dismissible: true,
    size: 'md',
    showIcon: true,
    children: 'Try changing the controls to see how the alert responds!',
  },
};
