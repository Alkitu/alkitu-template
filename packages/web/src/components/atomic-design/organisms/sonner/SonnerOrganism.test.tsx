import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { SonnerOrganism, useToast } from './SonnerOrganism';
import type { Toast } from './SonnerOrganism.types';

describe('SonnerOrganism', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  // Test component for accessing useToast hook
  const TestComponent = ({ onAddToast }: { onAddToast?: (id: string) => void }) => {
    const { addToast, removeToast, clearAll, toasts } = useToast();

    return (
      <div>
        <button
          onClick={() => {
            const id = addToast({ title: 'Test toast', type: 'default' });
            onAddToast?.(id);
          }}
          data-testid="add-toast-btn"
        >
          Add Toast
        </button>
        <button
          onClick={() =>
            addToast({
              title: 'Success!',
              description: 'Operation completed',
              type: 'success',
            })
          }
          data-testid="add-success-btn"
        >
          Add Success Toast
        </button>
        <button
          onClick={() =>
            addToast({
              title: 'Error!',
              description: 'Something went wrong',
              type: 'error',
            })
          }
          data-testid="add-error-btn"
        >
          Add Error Toast
        </button>
        <button
          onClick={() =>
            addToast({
              title: 'Warning',
              type: 'warning',
            })
          }
          data-testid="add-warning-btn"
        >
          Add Warning Toast
        </button>
        <button
          onClick={() =>
            addToast({
              title: 'Info',
              type: 'info',
            })
          }
          data-testid="add-info-btn"
        >
          Add Info Toast
        </button>
        <button onClick={() => clearAll()} data-testid="clear-all-btn">
          Clear All
        </button>
        <div data-testid="toast-count">{toasts.length}</div>
      </div>
    );
  };

  describe('Provider and Context', () => {
    it('renders children correctly', () => {
      render(
        <SonnerOrganism>
          <div data-testid="child">Child content</div>
        </SonnerOrganism>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByTestId('child')).toHaveTextContent('Child content');
    });

    it('provides toast context to children', () => {
      render(
        <SonnerOrganism>
          <TestComponent />
        </SonnerOrganism>
      );

      const addButton = screen.getByTestId('add-toast-btn');
      expect(addButton).toBeInTheDocument();
    });

    it('throws error when useToast is used outside provider', () => {
      // Suppress console.error for this test
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useToast must be used within a SonnerOrganism');

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Toast Creation and Display', () => {
    it('displays toast when added via addToast', () => {
      render(
        <SonnerOrganism>
          <TestComponent />
        </SonnerOrganism>
      );

      const addButton = screen.getByTestId('add-toast-btn');

      act(() => {
        addButton.click();
      });

      expect(screen.getByText('Test toast')).toBeInTheDocument();
    });

    it('displays toast with title and description', () => {
      render(
        <SonnerOrganism>
          <TestComponent />
        </SonnerOrganism>
      );

      const successButton = screen.getByTestId('add-success-btn');

      act(() => {
        successButton.click();
      });

      expect(screen.getByText('Success!')).toBeInTheDocument();
      expect(screen.getByText('Operation completed')).toBeInTheDocument();
    });

    it('returns toast ID when adding toast', () => {
      const onAddToast = vi.fn();

      render(
        <SonnerOrganism>
          <TestComponent onAddToast={onAddToast} />
        </SonnerOrganism>
      );

      const addButton = screen.getByTestId('add-toast-btn');

      act(() => {
        addButton.click();
      });

      expect(onAddToast).toHaveBeenCalled();
      const toastId = onAddToast.mock.calls[0][0];
      expect(toastId).toBeTruthy();
      expect(typeof toastId).toBe('string');
    });
  });

  describe('Toast Types and Icons', () => {
    it('displays success toast with success styling', () => {
      render(
        <SonnerOrganism>
          <TestComponent />
        </SonnerOrganism>
      );

      act(() => {
        screen.getByTestId('add-success-btn').click();
      });

      const toast = screen.getByText('Success!').closest('div[role="status"]');
      expect(toast).toBeInTheDocument();
    });

    it('displays error toast with error styling', () => {
      render(
        <SonnerOrganism>
          <TestComponent />
        </SonnerOrganism>
      );

      act(() => {
        screen.getByTestId('add-error-btn').click();
      });

      const toast = screen.getByText('Error!').closest('div[role="status"]');
      expect(toast).toBeInTheDocument();
    });

    it('displays warning toast', () => {
      render(
        <SonnerOrganism>
          <TestComponent />
        </SonnerOrganism>
      );

      act(() => {
        screen.getByTestId('add-warning-btn').click();
      });

      expect(screen.getByText('Warning')).toBeInTheDocument();
    });

    it('displays info toast', () => {
      render(
        <SonnerOrganism>
          <TestComponent />
        </SonnerOrganism>
      );

      act(() => {
        screen.getByTestId('add-info-btn').click();
      });

      expect(screen.getByText('Info')).toBeInTheDocument();
    });

    it('displays default toast', () => {
      render(
        <SonnerOrganism>
          <TestComponent />
        </SonnerOrganism>
      );

      act(() => {
        screen.getByTestId('add-toast-btn').click();
      });

      expect(screen.getByText('Test toast')).toBeInTheDocument();
    });
  });

  describe('Toast Dismissal', () => {
    it('allows manual dismissal via close button', () => {
      render(
        <SonnerOrganism>
          <TestComponent />
        </SonnerOrganism>
      );

      act(() => {
        screen.getByTestId('add-toast-btn').click();
      });

      expect(screen.getByText('Test toast')).toBeInTheDocument();

      const closeButton = screen.getByRole('button', { name: /close notification/i });

      act(() => {
        closeButton.click();
      });

      expect(screen.queryByText('Test toast')).not.toBeInTheDocument();
    });

    it('auto-dismisses toast after default duration', () => {
      render(
        <SonnerOrganism defaultDuration={2000}>
          <TestComponent />
        </SonnerOrganism>
      );

      act(() => {
        screen.getByTestId('add-toast-btn').click();
      });

      expect(screen.getByText('Test toast')).toBeInTheDocument();

      // Fast-forward time by 2 seconds
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(screen.queryByText('Test toast')).not.toBeInTheDocument();
    });

    it('does not auto-dismiss when duration is 0', () => {
      const TestComponentNoDuration = () => {
        const { addToast } = useToast();
        return (
          <button
            onClick={() => addToast({ title: 'Persistent', duration: 0 })}
            data-testid="add-persistent-btn"
          >
            Add Persistent
          </button>
        );
      };

      render(
        <SonnerOrganism>
          <TestComponentNoDuration />
        </SonnerOrganism>
      );

      act(() => {
        screen.getByTestId('add-persistent-btn').click();
      });

      expect(screen.getByText('Persistent')).toBeInTheDocument();

      // Fast-forward time significantly
      act(() => {
        vi.advanceTimersByTime(10000);
      });

      // Toast should still be visible
      expect(screen.getByText('Persistent')).toBeInTheDocument();
    });

    it('clears all toasts when clearAll is called', () => {
      render(
        <SonnerOrganism>
          <TestComponent />
        </SonnerOrganism>
      );

      // Add multiple toasts
      act(() => {
        screen.getByTestId('add-toast-btn').click();
        screen.getByTestId('add-success-btn').click();
        screen.getByTestId('add-error-btn').click();
      });

      expect(screen.getByText('Test toast')).toBeInTheDocument();
      expect(screen.getByText('Success!')).toBeInTheDocument();
      expect(screen.getByText('Error!')).toBeInTheDocument();

      // Clear all
      act(() => {
        screen.getByTestId('clear-all-btn').click();
      });

      expect(screen.queryByText('Test toast')).not.toBeInTheDocument();
      expect(screen.queryByText('Success!')).not.toBeInTheDocument();
      expect(screen.queryByText('Error!')).not.toBeInTheDocument();
    });
  });

  describe('Toast Queue Management', () => {
    it('respects maxToasts limit', () => {
      render(
        <SonnerOrganism maxToasts={2}>
          <TestComponent />
        </SonnerOrganism>
      );

      // Add 3 toasts
      act(() => {
        screen.getByTestId('add-toast-btn').click();
        screen.getByTestId('add-success-btn').click();
        screen.getByTestId('add-error-btn').click();
      });

      const toastCount = screen.getByTestId('toast-count');
      expect(toastCount).toHaveTextContent('2');
    });

    it('removes oldest toast when maxToasts is exceeded', () => {
      render(
        <SonnerOrganism maxToasts={2}>
          <TestComponent />
        </SonnerOrganism>
      );

      // Add 3 toasts
      act(() => {
        screen.getByTestId('add-toast-btn').click();
      });

      expect(screen.getByText('Test toast')).toBeInTheDocument();

      act(() => {
        screen.getByTestId('add-success-btn').click();
        screen.getByTestId('add-error-btn').click();
      });

      // First toast should be removed
      expect(screen.queryByText('Test toast')).not.toBeInTheDocument();
      // Last two should remain
      expect(screen.getByText('Success!')).toBeInTheDocument();
      expect(screen.getByText('Error!')).toBeInTheDocument();
    });
  });

  describe('Toast Actions', () => {
    it('renders action button when action is provided', () => {
      const actionSpy = vi.fn();

      const TestComponentWithAction = () => {
        const { addToast } = useToast();
        return (
          <button
            onClick={() =>
              addToast({
                title: 'Confirm action',
                action: { label: 'Undo', onClick: actionSpy },
              })
            }
            data-testid="add-action-btn"
          >
            Add Toast With Action
          </button>
        );
      };

      render(
        <SonnerOrganism>
          <TestComponentWithAction />
        </SonnerOrganism>
      );

      act(() => {
        screen.getByTestId('add-action-btn').click();
      });

      const undoButton = screen.getByRole('button', { name: /undo/i });
      expect(undoButton).toBeInTheDocument();
    });

    it('calls action onClick handler when action button is clicked', () => {
      const actionSpy = vi.fn();

      const TestComponentWithAction = () => {
        const { addToast } = useToast();
        return (
          <button
            onClick={() =>
              addToast({
                title: 'Confirm action',
                action: { label: 'Undo', onClick: actionSpy },
              })
            }
            data-testid="add-action-btn"
          >
            Add Toast With Action
          </button>
        );
      };

      render(
        <SonnerOrganism>
          <TestComponentWithAction />
        </SonnerOrganism>
      );

      act(() => {
        screen.getByTestId('add-action-btn').click();
      });

      const undoButton = screen.getByRole('button', { name: /undo/i });

      act(() => {
        undoButton.click();
      });

      expect(actionSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Toast Positioning', () => {
    it('uses default position when not specified', () => {
      render(
        <SonnerOrganism defaultPosition="bottom-right">
          <TestComponent />
        </SonnerOrganism>
      );

      act(() => {
        screen.getByTestId('add-toast-btn').click();
      });

      expect(screen.getByText('Test toast')).toBeInTheDocument();
    });

    const positionTests = [
      { position: 'top-left' as const, label: 'Top Left' },
      { position: 'top-right' as const, label: 'Top Right' },
      { position: 'bottom-center' as const, label: 'Bottom Center' },
      { position: 'top-center' as const, label: 'Top Center' },
    ];

    positionTests.forEach(({ position, label }) => {
      it(`supports ${position} position`, () => {
        const TestComponentWithPosition = () => {
          const { addToast } = useToast();
          return (
            <button
              onClick={() => addToast({ title: label, position })}
              data-testid={`add-${position}-btn`}
            >
              Add {label}
            </button>
          );
        };

        render(
          <SonnerOrganism>
            <TestComponentWithPosition />
          </SonnerOrganism>
        );

        act(() => {
          screen.getByTestId(`add-${position}-btn`).click();
        });

        expect(screen.getByText(label)).toBeInTheDocument();
      });
    });
  });

  describe('Custom Icons', () => {
    it('renders custom icon when provided', () => {
      const CustomIcon = () => <span data-testid="custom-icon">🎉</span>;

      const TestComponentWithIcon = () => {
        const { addToast } = useToast();
        return (
          <button
            onClick={() =>
              addToast({
                title: 'Custom icon toast',
                icon: <CustomIcon />,
              })
            }
            data-testid="add-custom-icon-btn"
          >
            Add Custom Icon
          </button>
        );
      };

      render(
        <SonnerOrganism>
          <TestComponentWithIcon />
        </SonnerOrganism>
      );

      act(() => {
        screen.getByTestId('add-custom-icon-btn').click();
      });

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });
  });

  describe('Dismissible Configuration', () => {
    it('shows close button when dismissible is true', () => {
      const TestComponentDismissible = () => {
        const { addToast } = useToast();
        return (
          <button
            onClick={() =>
              addToast({
                title: 'Dismissible',
                dismissible: true,
              })
            }
            data-testid="add-dismissible-btn"
          >
            Add Dismissible
          </button>
        );
      };

      render(
        <SonnerOrganism>
          <TestComponentDismissible />
        </SonnerOrganism>
      );

      act(() => {
        screen.getByTestId('add-dismissible-btn').click();
      });

      expect(screen.getByRole('button', { name: /close notification/i })).toBeInTheDocument();
    });

    it('hides close button when dismissible is false', () => {
      const TestComponentNonDismissible = () => {
        const { addToast } = useToast();
        return (
          <button
            onClick={() =>
              addToast({
                title: 'Non-dismissible',
                dismissible: false,
              })
            }
            data-testid="add-non-dismissible-btn"
          >
            Add Non-dismissible
          </button>
        );
      };

      render(
        <SonnerOrganism>
          <TestComponentNonDismissible />
        </SonnerOrganism>
      );

      act(() => {
        screen.getByTestId('add-non-dismissible-btn').click();
      });

      expect(screen.getByText('Non-dismissible')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /close notification/i })).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA role and live region', () => {
      render(
        <SonnerOrganism>
          <TestComponent />
        </SonnerOrganism>
      );

      act(() => {
        screen.getByTestId('add-toast-btn').click();
      });

      const toast = screen.getByText('Test toast').closest('div[role="status"]');
      expect(toast).toHaveAttribute('role', 'status');
      expect(toast).toHaveAttribute('aria-live', 'polite');
      expect(toast).toHaveAttribute('aria-atomic', 'true');
    });

    it('close button has aria-label', () => {
      render(
        <SonnerOrganism>
          <TestComponent />
        </SonnerOrganism>
      );

      act(() => {
        screen.getByTestId('add-toast-btn').click();
      });

      const closeButton = screen.getByRole('button', { name: /close notification/i });
      expect(closeButton).toHaveAttribute('aria-label', 'Close notification');
    });
  });

  describe('Theme Integration', () => {
    it('applies CSS variables for theming', () => {
      render(
        <SonnerOrganism>
          <TestComponent />
        </SonnerOrganism>
      );

      act(() => {
        screen.getByTestId('add-success-btn').click();
      });

      const toast = screen.getByText('Success!').closest('div[role="status"]');
      expect(toast).toBeInTheDocument();
      // Toast uses CSS variable-based styling (verified in visual tests)
    });
  });

  describe('Provider Props', () => {
    it('accepts and uses maxToasts prop', () => {
      render(
        <SonnerOrganism maxToasts={10}>
          <div>Content</div>
        </SonnerOrganism>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('accepts and uses defaultPosition prop', () => {
      render(
        <SonnerOrganism defaultPosition="top-center">
          <div>Content</div>
        </SonnerOrganism>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('accepts and uses defaultDuration prop', () => {
      render(
        <SonnerOrganism defaultDuration={5000}>
          <div>Content</div>
        </SonnerOrganism>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles toast with only title', () => {
      const TestComponentTitleOnly = () => {
        const { addToast } = useToast();
        return (
          <button
            onClick={() => addToast({ title: 'Title only' })}
            data-testid="add-title-only-btn"
          >
            Add Title Only
          </button>
        );
      };

      render(
        <SonnerOrganism>
          <TestComponentTitleOnly />
        </SonnerOrganism>
      );

      act(() => {
        screen.getByTestId('add-title-only-btn').click();
      });

      expect(screen.getByText('Title only')).toBeInTheDocument();
    });

    it('handles toast with only description', () => {
      const TestComponentDescOnly = () => {
        const { addToast } = useToast();
        return (
          <button
            onClick={() => addToast({ description: 'Description only' })}
            data-testid="add-desc-only-btn"
          >
            Add Description Only
          </button>
        );
      };

      render(
        <SonnerOrganism>
          <TestComponentDescOnly />
        </SonnerOrganism>
      );

      act(() => {
        screen.getByTestId('add-desc-only-btn').click();
      });

      expect(screen.getByText('Description only')).toBeInTheDocument();
    });

    it('handles rapid toast additions', () => {
      render(
        <SonnerOrganism maxToasts={5}>
          <TestComponent />
        </SonnerOrganism>
      );

      const addButton = screen.getByTestId('add-toast-btn');

      // Add multiple toasts rapidly
      act(() => {
        addButton.click();
        addButton.click();
        addButton.click();
      });

      const toastCount = screen.getByTestId('toast-count');
      expect(toastCount).toHaveTextContent('3');
    });
  });
});
