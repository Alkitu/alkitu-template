import type { Meta, StoryObj } from '@storybook/react';
import { SonnerOrganism, useToast } from './SonnerOrganism';
import { Button } from '@/components/atoms';
import { Star, Mail, ShoppingCart } from 'lucide-react';

/**
 * SonnerOrganism - Toast Notification System
 *
 * A complete toast notification system with theme integration, multiple types,
 * positioning, actions, and animations.
 *
 * ## Features
 * - 5 toast types: default, success, error, warning, info
 * - 6 position options
 * - Auto-dismiss with configurable duration
 * - Action buttons
 * - Custom icons
 * - Queue management
 * - Theme-reactive styling with CSS variables
 */
const meta = {
  title: 'Organisms/SonnerOrganism',
  component: SonnerOrganism,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Advanced toast notification system for displaying temporary messages to users.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SonnerOrganism>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Demo component for stories
 */
const ToastDemo = () => {
  const { addToast, clearAll } = useToast();

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Toast Types</h2>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="default"
            onClick={() =>
              addToast({
                title: 'Default Toast',
                description: 'This is a default notification message',
              })
            }
          >
            Default Toast
          </Button>

          <Button
            variant="default"
            onClick={() =>
              addToast({
                title: 'Success!',
                description: 'Your changes have been saved successfully',
                type: 'success',
              })
            }
          >
            Success Toast
          </Button>

          <Button
            variant="default"
            onClick={() =>
              addToast({
                title: 'Error occurred',
                description: 'Failed to save changes. Please try again.',
                type: 'error',
              })
            }
          >
            Error Toast
          </Button>

          <Button
            variant="default"
            onClick={() =>
              addToast({
                title: 'Warning',
                description: 'You have unsaved changes that will be lost',
                type: 'warning',
              })
            }
          >
            Warning Toast
          </Button>

          <Button
            variant="default"
            onClick={() =>
              addToast({
                title: 'Information',
                description: 'New features are available in this update',
                type: 'info',
              })
            }
          >
            Info Toast
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">With Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="default"
            onClick={() =>
              addToast({
                title: 'File deleted',
                description: 'The file has been moved to trash',
                type: 'success',
                action: {
                  label: 'Undo',
                  onClick: () => alert('Undo clicked!'),
                },
              })
            }
          >
            Toast with Action
          </Button>

          <Button
            variant="default"
            onClick={() =>
              addToast({
                title: 'Update available',
                description: 'A new version is ready to install',
                type: 'info',
                action: {
                  label: 'Update Now',
                  onClick: () => alert('Update initiated!'),
                },
                duration: 0, // Persistent until dismissed
              })
            }
          >
            Persistent with Action
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Custom Icons</h2>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="default"
            onClick={() =>
              addToast({
                title: 'New email received',
                description: 'You have 3 unread messages',
                icon: <Mail className="h-5 w-5" />,
              })
            }
          >
            Email Icon
          </Button>

          <Button
            variant="default"
            onClick={() =>
              addToast({
                title: 'Item added to cart',
                description: 'Product successfully added',
                icon: <ShoppingCart className="h-5 w-5" />,
              })
            }
          >
            Cart Icon
          </Button>

          <Button
            variant="default"
            onClick={() =>
              addToast({
                title: 'You earned a badge!',
                description: 'Achievement unlocked: First contribution',
                icon: (
                  <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                ),
              })
            }
          >
            Star Icon
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Durations</h2>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="default"
            onClick={() =>
              addToast({
                title: 'Quick toast (1s)',
                description: 'This will disappear in 1 second',
                type: 'info',
                duration: 1000,
              })
            }
          >
            Quick (1s)
          </Button>

          <Button
            variant="default"
            onClick={() =>
              addToast({
                title: 'Normal toast (4s)',
                description: 'Default duration of 4 seconds',
                type: 'success',
                duration: 4000,
              })
            }
          >
            Normal (4s)
          </Button>

          <Button
            variant="default"
            onClick={() =>
              addToast({
                title: 'Persistent toast',
                description: 'This will stay until manually dismissed',
                type: 'warning',
                duration: 0,
              })
            }
          >
            Persistent (no auto-dismiss)
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Positions</h2>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="secondary"
            onClick={() =>
              addToast({
                title: 'Top Left',
                position: 'top-left',
                type: 'info',
              })
            }
          >
            Top Left
          </Button>

          <Button
            variant="secondary"
            onClick={() =>
              addToast({
                title: 'Top Center',
                position: 'top-center',
                type: 'info',
              })
            }
          >
            Top Center
          </Button>

          <Button
            variant="secondary"
            onClick={() =>
              addToast({
                title: 'Top Right',
                position: 'top-right',
                type: 'info',
              })
            }
          >
            Top Right
          </Button>

          <Button
            variant="secondary"
            onClick={() =>
              addToast({
                title: 'Bottom Left',
                position: 'bottom-left',
                type: 'success',
              })
            }
          >
            Bottom Left
          </Button>

          <Button
            variant="secondary"
            onClick={() =>
              addToast({
                title: 'Bottom Center',
                position: 'bottom-center',
                type: 'success',
              })
            }
          >
            Bottom Center
          </Button>

          <Button
            variant="secondary"
            onClick={() =>
              addToast({
                title: 'Bottom Right',
                position: 'bottom-right',
                type: 'success',
              })
            }
          >
            Bottom Right
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Controls</h2>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => clearAll()}>
            Clear All Toasts
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              for (let i = 1; i <= 5; i++) {
                addToast({
                  title: `Toast ${i}`,
                  description: `This is toast number ${i}`,
                  type: i % 2 === 0 ? 'success' : 'info',
                });
              }
            }}
          >
            Add Multiple Toasts
          </Button>
        </div>
      </div>
    </div>
  );
};

/**
 * Default story showing all toast features
 */
export const Default: Story = {
  render: () => (
    <SonnerOrganism>
      <ToastDemo />
    </SonnerOrganism>
  ),
};

/**
 * Success toast variant
 */
export const Success: Story = {
  render: () => {
    const Demo = () => {
      const { addToast } = useToast();

      return (
        <div className="p-8">
          <Button
            onClick={() =>
              addToast({
                title: 'Profile Updated',
                description:
                  'Your profile information has been saved successfully',
                type: 'success',
              })
            }
          >
            Show Success Toast
          </Button>
        </div>
      );
    };

    return (
      <SonnerOrganism>
        <Demo />
      </SonnerOrganism>
    );
  },
};

/**
 * Error toast variant
 */
export const Error: Story = {
  render: () => {
    const Demo = () => {
      const { addToast } = useToast();

      return (
        <div className="p-8">
          <Button
            onClick={() =>
              addToast({
                title: 'Connection Failed',
                description:
                  'Unable to connect to the server. Please check your internet connection.',
                type: 'error',
              })
            }
          >
            Show Error Toast
          </Button>
        </div>
      );
    };

    return (
      <SonnerOrganism>
        <Demo />
      </SonnerOrganism>
    );
  },
};

/**
 * Warning toast variant
 */
export const Warning: Story = {
  render: () => {
    const Demo = () => {
      const { addToast } = useToast();

      return (
        <div className="p-8">
          <Button
            onClick={() =>
              addToast({
                title: 'Unsaved Changes',
                description:
                  'You have unsaved changes. Are you sure you want to leave?',
                type: 'warning',
                duration: 0,
              })
            }
          >
            Show Warning Toast
          </Button>
        </div>
      );
    };

    return (
      <SonnerOrganism>
        <Demo />
      </SonnerOrganism>
    );
  },
};

/**
 * Info toast variant
 */
export const Info: Story = {
  render: () => {
    const Demo = () => {
      const { addToast } = useToast();

      return (
        <div className="p-8">
          <Button
            onClick={() =>
              addToast({
                title: 'New Update Available',
                description:
                  'Version 2.0 is now available with new features and improvements',
                type: 'info',
              })
            }
          >
            Show Info Toast
          </Button>
        </div>
      );
    };

    return (
      <SonnerOrganism>
        <Demo />
      </SonnerOrganism>
    );
  },
};

/**
 * Toast with action button
 */
export const WithAction: Story = {
  render: () => {
    const Demo = () => {
      const { addToast } = useToast();

      return (
        <div className="p-8">
          <Button
            onClick={() =>
              addToast({
                title: 'Email Sent',
                description: 'Your email has been sent successfully',
                type: 'success',
                action: {
                  label: 'View',
                  onClick: () => alert('View clicked!'),
                },
              })
            }
          >
            Show Toast with Action
          </Button>
        </div>
      );
    };

    return (
      <SonnerOrganism>
        <Demo />
      </SonnerOrganism>
    );
  },
};

/**
 * Toast with custom icon
 */
export const CustomIcon: Story = {
  render: () => {
    const Demo = () => {
      const { addToast } = useToast();

      return (
        <div className="p-8">
          <Button
            onClick={() =>
              addToast({
                title: 'Achievement Unlocked!',
                description: 'You completed your first project',
                icon: (
                  <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                ),
              })
            }
          >
            Show Toast with Custom Icon
          </Button>
        </div>
      );
    };

    return (
      <SonnerOrganism>
        <Demo />
      </SonnerOrganism>
    );
  },
};

/**
 * Persistent toast (duration: 0)
 */
export const Persistent: Story = {
  render: () => {
    const Demo = () => {
      const { addToast } = useToast();

      return (
        <div className="p-8">
          <Button
            onClick={() =>
              addToast({
                title: 'Important Notice',
                description:
                  'This toast will stay until you manually dismiss it',
                type: 'warning',
                duration: 0,
              })
            }
          >
            Show Persistent Toast
          </Button>
        </div>
      );
    };

    return (
      <SonnerOrganism>
        <Demo />
      </SonnerOrganism>
    );
  },
};

/**
 * Non-dismissible toast
 */
export const NonDismissible: Story = {
  render: () => {
    const Demo = () => {
      const { addToast } = useToast();

      return (
        <div className="p-8">
          <Button
            onClick={() =>
              addToast({
                title: 'Processing...',
                description: 'Please wait while we process your request',
                type: 'info',
                dismissible: false,
                duration: 3000,
              })
            }
          >
            Show Non-dismissible Toast
          </Button>
        </div>
      );
    };

    return (
      <SonnerOrganism>
        <Demo />
      </SonnerOrganism>
    );
  },
};

/**
 * Multiple toasts demonstration
 */
export const MultipleToasts: Story = {
  render: () => {
    const Demo = () => {
      const { addToast } = useToast();

      return (
        <div className="p-8">
          <Button
            onClick={() => {
              addToast({
                title: 'First notification',
                type: 'info',
              });
              setTimeout(
                () =>
                  addToast({
                    title: 'Second notification',
                    type: 'success',
                  }),
                500,
              );
              setTimeout(
                () =>
                  addToast({
                    title: 'Third notification',
                    type: 'warning',
                  }),
                1000,
              );
            }}
          >
            Show Multiple Toasts
          </Button>
        </div>
      );
    };

    return (
      <SonnerOrganism>
        <Demo />
      </SonnerOrganism>
    );
  },
};

/**
 * Toast with max limit demonstration
 */
export const WithMaxLimit: Story = {
  render: () => {
    const Demo = () => {
      const { addToast } = useToast();

      return (
        <div className="p-8 space-y-4">
          <p className="text-sm text-muted-foreground">
            This demo has a max limit of 3 toasts. Try adding more than 3
            toasts.
          </p>
          <Button
            onClick={() => {
              for (let i = 1; i <= 5; i++) {
                addToast({
                  title: `Toast ${i}`,
                  description: `This is toast number ${i}`,
                  type: 'info',
                });
              }
            }}
          >
            Add 5 Toasts (Max 3)
          </Button>
        </div>
      );
    };

    return (
      <SonnerOrganism maxToasts={3}>
        <Demo />
      </SonnerOrganism>
    );
  },
};

/**
 * Different positions demonstration
 */
export const Positions: Story = {
  render: () => {
    const Demo = () => {
      const { addToast } = useToast();

      return (
        <div className="p-8">
          <div className="grid grid-cols-3 gap-4">
            <Button
              variant="secondary"
              onClick={() =>
                addToast({
                  title: 'Top Left',
                  position: 'top-left',
                })
              }
            >
              Top Left
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                addToast({
                  title: 'Top Center',
                  position: 'top-center',
                })
              }
            >
              Top Center
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                addToast({
                  title: 'Top Right',
                  position: 'top-right',
                })
              }
            >
              Top Right
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                addToast({
                  title: 'Bottom Left',
                  position: 'bottom-left',
                })
              }
            >
              Bottom Left
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                addToast({
                  title: 'Bottom Center',
                  position: 'bottom-center',
                })
              }
            >
              Bottom Center
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                addToast({
                  title: 'Bottom Right',
                  position: 'bottom-right',
                })
              }
            >
              Bottom Right
            </Button>
          </div>
        </div>
      );
    };

    return (
      <SonnerOrganism>
        <Demo />
      </SonnerOrganism>
    );
  },
};
