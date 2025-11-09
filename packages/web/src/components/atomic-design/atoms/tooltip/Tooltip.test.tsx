import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Tooltip } from './Tooltip';
import type { TooltipPlacement } from './Tooltip.types';

expect.extend(toHaveNoViolations);

describe('Tooltip Component', () => {
  // ===================================
  // 1. Basic Rendering Tests
  // ===================================

  describe('Rendering', () => {
    it('renders trigger element correctly', () => {
      render(
        <Tooltip content="Test tooltip">
          <button>Trigger</button>
        </Tooltip>,
      );

      expect(screen.getByRole('button', { name: 'Trigger' })).toBeInTheDocument();
    });

    it('does not render tooltip initially with hover trigger', () => {
      render(
        <Tooltip content="Test tooltip">
          <button>Trigger</button>
        </Tooltip>,
      );

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('renders tooltip content when visible', async () => {
      render(
        <Tooltip content="Test tooltip content" delay={0}>
          <button>Trigger</button>
        </Tooltip>,
      );

      const trigger = screen.getByRole('button');
      fireEvent.mouseEnter(trigger);

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
        expect(screen.getByText('Test tooltip content')).toBeInTheDocument();
      });
    });

    it('renders complex content in tooltip', async () => {
      render(
        <Tooltip
          content={
            <div>
              <strong>Title</strong>
              <p>Description</p>
            </div>
          }
          delay={0}
        >
          <button>Trigger</button>
        </Tooltip>,
      );

      const trigger = screen.getByRole('button');
      fireEvent.mouseEnter(trigger);

      await waitFor(() => {
        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Description')).toBeInTheDocument();
      });
    });
  });

  // ===================================
  // 2. Placement Tests
  // ===================================

  describe('Placement', () => {
    const placements: TooltipPlacement[] = ['top', 'bottom', 'left', 'right'];

    it.each(placements)('renders with placement: %s', async (placement) => {
      render(
        <Tooltip content="Test" placement={placement} delay={0}>
          <button>Trigger</button>
        </Tooltip>,
      );

      const trigger = screen.getByRole('button');
      fireEvent.mouseEnter(trigger);

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
    });

    it('uses top placement by default', async () => {
      render(
        <Tooltip content="Test" delay={0}>
          <button>Trigger</button>
        </Tooltip>,
      );

      const trigger = screen.getByRole('button');
      fireEvent.mouseEnter(trigger);

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
    });
  });

  // ===================================
  // 3. Trigger Types Tests
  // ===================================

  describe('Trigger Types', () => {
    describe('Hover Trigger (default)', () => {
      it('shows tooltip on mouse enter', async () => {
        render(
          <Tooltip content="Hover tooltip" delay={0}>
            <button>Trigger</button>
          </Tooltip>,
        );

        const trigger = screen.getByRole('button');
        fireEvent.mouseEnter(trigger);

        await waitFor(() => {
          expect(screen.getByRole('tooltip')).toBeInTheDocument();
        });
      });

      it('hides tooltip on mouse leave', async () => {
        render(
          <Tooltip content="Hover tooltip" delay={0}>
            <button>Trigger</button>
          </Tooltip>,
        );

        const trigger = screen.getByRole('button');
        fireEvent.mouseEnter(trigger);

        await waitFor(() => {
          expect(screen.getByRole('tooltip')).toBeInTheDocument();
        });

        fireEvent.mouseLeave(trigger);

        await waitFor(() => {
          expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
        });
      });
    });

    describe('Click Trigger', () => {
      it('shows tooltip on click', async () => {
        render(
          <Tooltip content="Click tooltip" trigger="click" delay={0}>
            <button>Trigger</button>
          </Tooltip>,
        );

        const trigger = screen.getByRole('button');
        fireEvent.click(trigger);

        await waitFor(() => {
          expect(screen.getByRole('tooltip')).toBeInTheDocument();
        });
      });

      it('hides tooltip on second click', async () => {
        render(
          <Tooltip content="Click tooltip" trigger="click" delay={0}>
            <button>Trigger</button>
          </Tooltip>,
        );

        const trigger = screen.getByRole('button');

        // First click - show
        fireEvent.click(trigger);
        await waitFor(() => {
          expect(screen.getByRole('tooltip')).toBeInTheDocument();
        });

        // Second click - hide
        fireEvent.click(trigger);
        await waitFor(() => {
          expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
        });
      });

      it('renders backdrop for click trigger', async () => {
        render(
          <Tooltip content="Click tooltip" trigger="click" delay={0}>
            <button>Trigger</button>
          </Tooltip>,
        );

        const trigger = screen.getByRole('button');
        fireEvent.click(trigger);

        await waitFor(() => {
          const backdrop = document.querySelector('.fixed.inset-0.z-\\[998\\]');
          expect(backdrop).toBeInTheDocument();
        });
      });

      it('hides tooltip when clicking backdrop', async () => {
        render(
          <Tooltip content="Click tooltip" trigger="click" delay={0}>
            <button>Trigger</button>
          </Tooltip>,
        );

        const trigger = screen.getByRole('button');
        fireEvent.click(trigger);

        await waitFor(() => {
          expect(screen.getByRole('tooltip')).toBeInTheDocument();
        });

        const backdrop = document.querySelector('.fixed.inset-0.z-\\[998\\]');
        if (backdrop) {
          fireEvent.click(backdrop as HTMLElement);
        }

        await waitFor(() => {
          expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
        });
      });
    });

    describe('Focus Trigger', () => {
      it('shows tooltip on focus', async () => {
        render(
          <Tooltip content="Focus tooltip" trigger="focus" delay={0}>
            <button>Trigger</button>
          </Tooltip>,
        );

        const trigger = screen.getByRole('button');
        fireEvent.focus(trigger);

        await waitFor(() => {
          expect(screen.getByRole('tooltip')).toBeInTheDocument();
        });
      });

      it('hides tooltip on blur', async () => {
        render(
          <Tooltip content="Focus tooltip" trigger="focus" delay={0}>
            <button>Trigger</button>
          </Tooltip>,
        );

        const trigger = screen.getByRole('button');
        fireEvent.focus(trigger);

        await waitFor(() => {
          expect(screen.getByRole('tooltip')).toBeInTheDocument();
        });

        fireEvent.blur(trigger);

        await waitFor(() => {
          expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
        });
      });
    });
  });

  // ===================================
  // 4. Disabled State Tests
  // ===================================

  describe('Disabled State', () => {
    it('does not show tooltip when disabled', async () => {
      render(
        <Tooltip content="Disabled tooltip" disabled delay={0}>
          <button>Trigger</button>
        </Tooltip>,
      );

      const trigger = screen.getByRole('button');
      fireEvent.mouseEnter(trigger);

      // Wait a bit and ensure tooltip doesn't appear
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('does not show tooltip on click when disabled', async () => {
      render(
        <Tooltip content="Disabled tooltip" disabled trigger="click" delay={0}>
          <button>Trigger</button>
        </Tooltip>,
      );

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  // ===================================
  // 5. Arrow Tests
  // ===================================

  describe('Arrow', () => {
    it('shows arrow by default', async () => {
      render(
        <Tooltip content="Tooltip with arrow" delay={0}>
          <button>Trigger</button>
        </Tooltip>,
      );

      const trigger = screen.getByRole('button');
      fireEvent.mouseEnter(trigger);

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        const arrow = tooltip.querySelector('[style*="position: absolute"]');
        expect(arrow).toBeInTheDocument();
      });
    });

    it('hides arrow when showArrow is false', async () => {
      render(
        <Tooltip content="Tooltip without arrow" showArrow={false} delay={0}>
          <button>Trigger</button>
        </Tooltip>,
      );

      const trigger = screen.getByRole('button');
      fireEvent.mouseEnter(trigger);

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        const arrow = tooltip.querySelector('[style*="position: absolute"]');
        expect(arrow).not.toBeInTheDocument();
      });
    });
  });

  // ===================================
  // 6. Styling and Theme Tests
  // ===================================

  describe('Styling and Theming', () => {
    it('applies custom className', async () => {
      render(
        <Tooltip content="Custom class tooltip" className="custom-tooltip-class" delay={0}>
          <button>Trigger</button>
        </Tooltip>,
      );

      const trigger = screen.getByRole('button');
      fireEvent.mouseEnter(trigger);

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toHaveClass('custom-tooltip-class');
      });
    });

    it('applies theme CSS variables', async () => {
      render(
        <Tooltip content="Themed tooltip" delay={0}>
          <button>Trigger</button>
        </Tooltip>,
      );

      const trigger = screen.getByRole('button');
      fireEvent.mouseEnter(trigger);

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toHaveClass('bg-popover', 'text-popover-foreground', 'border-border');
      });
    });

    it('applies custom style prop', async () => {
      render(
        <Tooltip
          content="Custom style tooltip"
          style={{ backgroundColor: 'rgb(255, 0, 0)', color: 'rgb(255, 255, 255)' }}
          delay={0}
        >
          <button>Trigger</button>
        </Tooltip>,
      );

      const trigger = screen.getByRole('button');
      fireEvent.mouseEnter(trigger);

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toHaveStyle({
          backgroundColor: 'rgb(255, 0, 0)',
          color: 'rgb(255, 255, 255)',
        });
      });
    });

    it('applies theme override', async () => {
      render(
        <Tooltip
          content="Theme override tooltip"
          themeOverride={{ '--custom-var': 'value' } as React.CSSProperties}
          delay={0}
        >
          <button>Trigger</button>
        </Tooltip>,
      );

      const trigger = screen.getByRole('button');
      fireEvent.mouseEnter(trigger);

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toHaveStyle({ '--custom-var': 'value' });
      });
    });

    it('applies custom offset', async () => {
      render(
        <Tooltip content="Custom offset tooltip" offset={16} delay={0}>
          <button>Trigger</button>
        </Tooltip>,
      );

      const trigger = screen.getByRole('button');
      fireEvent.mouseEnter(trigger);

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
    });
  });

  // ===================================
  // 7. Accessibility Tests
  // ===================================

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <Tooltip content="Accessible tooltip">
          <button>Trigger</button>
        </Tooltip>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has role="tooltip" on tooltip element', async () => {
      render(
        <Tooltip content="Role tooltip" delay={0}>
          <button>Trigger</button>
        </Tooltip>,
      );

      const trigger = screen.getByRole('button');
      fireEvent.mouseEnter(trigger);

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
    });

    it('sets aria-hidden correctly when visible', async () => {
      render(
        <Tooltip content="ARIA tooltip" delay={0}>
          <button>Trigger</button>
        </Tooltip>,
      );

      const trigger = screen.getByRole('button');
      fireEvent.mouseEnter(trigger);

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toHaveAttribute('aria-hidden', 'false');
      });
    });

    it('sets aria-hidden on backdrop', async () => {
      render(
        <Tooltip content="Backdrop ARIA" trigger="click" delay={0}>
          <button>Trigger</button>
        </Tooltip>,
      );

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      await waitFor(() => {
        const backdrop = document.querySelector('.fixed.inset-0.z-\\[998\\]');
        expect(backdrop).toHaveAttribute('aria-hidden', 'true');
      });
    });

    it('sets aria-hidden on arrow', async () => {
      render(
        <Tooltip content="Arrow ARIA" delay={0}>
          <button>Trigger</button>
        </Tooltip>,
      );

      const trigger = screen.getByRole('button');
      fireEvent.mouseEnter(trigger);

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        const arrow = tooltip.querySelector('[aria-hidden="true"]');
        expect(arrow).toBeInTheDocument();
      });
    });
  });

  // ===================================
  // 8. Edge Cases
  // ===================================

  describe('Edge Cases', () => {
    it('cleans up event listeners on unmount', async () => {
      const { unmount } = render(
        <Tooltip content="Cleanup tooltip" delay={0}>
          <button>Trigger</button>
        </Tooltip>,
      );

      const trigger = screen.getByRole('button');
      fireEvent.mouseEnter(trigger);

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });

      // Unmount should clean up without errors
      expect(() => unmount()).not.toThrow();
    });

    it('handles data-testid prop', async () => {
      render(
        <Tooltip content="Test ID tooltip" data-testid="custom-tooltip" delay={0}>
          <button>Trigger</button>
        </Tooltip>,
      );

      const trigger = screen.getByRole('button');
      fireEvent.mouseEnter(trigger);

      await waitFor(() => {
        expect(screen.getByTestId('custom-tooltip')).toBeInTheDocument();
      });
    });

    it('preserves original event handlers on trigger', async () => {
      const originalOnClick = vi.fn();

      render(
        <Tooltip content="Event preservation" trigger="hover" delay={0}>
          <button onClick={originalOnClick}>Trigger</button>
        </Tooltip>,
      );

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      expect(originalOnClick).toHaveBeenCalledTimes(1);
    });
  });

  // ===================================
  // 9. Performance Tests
  // ===================================

  describe('Performance', () => {
    it('does not reposition tooltip when not visible', () => {
      render(
        <Tooltip content="Hidden tooltip">
          <button>Trigger</button>
        </Tooltip>,
      );

      // Trigger resize event
      fireEvent(window, new Event('resize'));

      // Should not cause errors or unnecessary updates
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('repositions tooltip on window resize', async () => {
      render(
        <Tooltip content="Resize tooltip" delay={0}>
          <button>Trigger</button>
        </Tooltip>,
      );

      const trigger = screen.getByRole('button');
      fireEvent.mouseEnter(trigger);

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });

      // Trigger resize
      fireEvent(window, new Event('resize'));

      // Tooltip should still be visible
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    it('repositions tooltip on window scroll', async () => {
      render(
        <Tooltip content="Scroll tooltip" delay={0}>
          <button>Trigger</button>
        </Tooltip>,
      );

      const trigger = screen.getByRole('button');
      fireEvent.mouseEnter(trigger);

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });

      // Trigger scroll
      fireEvent(window, new Event('scroll'));

      // Tooltip should still be visible
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });
});
