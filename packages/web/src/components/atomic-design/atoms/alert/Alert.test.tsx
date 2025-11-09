import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Alert } from './Alert';

expect.extend(toHaveNoViolations);

describe('Alert Component', () => {
  describe('Rendering', () => {
    it('renders correctly with children', () => {
      render(<Alert>Test alert message</Alert>);
      expect(screen.getByText('Test alert message')).toBeInTheDocument();
    });

    it('renders with default variant', () => {
      const { container } = render(<Alert>Default alert</Alert>);
      const alertElement = container.firstChild as HTMLElement;

      expect(alertElement).toHaveClass('bg-muted', 'border-border');
    });

    it('has alert role for accessibility', () => {
      render(<Alert>Alert message</Alert>);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('renders with title', () => {
      render(<Alert title="Alert Title">Alert content</Alert>);

      expect(screen.getByText('Alert Title')).toBeInTheDocument();
      expect(screen.getByText('Alert content')).toBeInTheDocument();
    });

    it('renders without icon when showIcon is false', () => {
      const { container } = render(
        <Alert showIcon={false}>No icon alert</Alert>
      );

      const icon = container.querySelector('svg');
      expect(icon).not.toBeInTheDocument();
    });

    it('renders with icon by default', () => {
      const { container } = render(<Alert>Alert with icon</Alert>);

      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it.each([
      ['default', 'bg-muted', 'border-border'],
      ['info', 'bg-primary/10', 'border-primary'],
      ['success', 'bg-success/10', 'border-success'],
      ['warning', 'bg-warning/10', 'border-warning'],
      ['error', 'bg-destructive/10', 'border-destructive'],
    ])('applies correct classes for %s variant', (variant, bgClass, borderClass) => {
      const { container } = render(
        <Alert variant={variant as any}>Alert message</Alert>
      );
      const alertElement = container.firstChild as HTMLElement;

      expect(alertElement).toHaveClass(bgClass, borderClass);
    });

    it('uses correct icon color for each variant', () => {
      const variants = [
        { variant: 'info' as const, colorClass: 'text-primary' },
        { variant: 'success' as const, colorClass: 'text-success' },
        { variant: 'warning' as const, colorClass: 'text-warning' },
        { variant: 'error' as const, colorClass: 'text-destructive' },
        { variant: 'default' as const, colorClass: 'text-muted-foreground' },
      ];

      variants.forEach(({ variant, colorClass }) => {
        const { container } = render(
          <Alert variant={variant}>Alert message</Alert>
        );
        const icon = container.querySelector('svg');

        expect(icon).toHaveClass(colorClass);
      });
    });
  });

  describe('Sizes', () => {
    it.each([
      ['sm', 'p-3', 'gap-2', 'text-sm'],
      ['md', 'p-4', 'gap-2.5', 'text-sm'],
      ['lg', 'p-5', 'gap-3', 'text-base'],
    ])('applies correct classes for %s size', (size, padding, gap, fontSize) => {
      const { container } = render(
        <Alert size={size as any}>Alert message</Alert>
      );
      const alertElement = container.firstChild as HTMLElement;

      expect(alertElement).toHaveClass(padding, gap, fontSize);
    });
  });

  describe('Dismissible Functionality', () => {
    it('renders dismiss button when dismissible is true', () => {
      render(
        <Alert dismissible onDismiss={() => {}}>
          Dismissible alert
        </Alert>
      );

      const dismissButton = screen.getByRole('button', { name: /dismiss alert/i });
      expect(dismissButton).toBeInTheDocument();
    });

    it('does not render dismiss button when dismissible is false', () => {
      render(<Alert>Non-dismissible alert</Alert>);

      const dismissButton = screen.queryByRole('button', { name: /dismiss alert/i });
      expect(dismissButton).not.toBeInTheDocument();
    });

    it('calls onDismiss when dismiss button is clicked', async () => {
      const user = userEvent.setup();
      const handleDismiss = vi.fn();

      render(
        <Alert dismissible onDismiss={handleDismiss}>
          Dismissible alert
        </Alert>
      );

      const dismissButton = screen.getByRole('button', { name: /dismiss alert/i });
      await user.click(dismissButton);

      expect(handleDismiss).toHaveBeenCalledTimes(1);
    });

    it('stops propagation when dismiss button is clicked', async () => {
      const user = userEvent.setup();
      const handleDismiss = vi.fn();
      const handleContainerClick = vi.fn();

      render(
        <div onClick={handleContainerClick}>
          <Alert dismissible onDismiss={handleDismiss}>
            Dismissible alert
          </Alert>
        </div>
      );

      const dismissButton = screen.getByRole('button', { name: /dismiss alert/i });
      await user.click(dismissButton);

      expect(handleDismiss).toHaveBeenCalledTimes(1);
      expect(handleContainerClick).not.toHaveBeenCalled();
    });
  });

  describe('Custom Icon', () => {
    it('renders custom icon when provided', () => {
      const CustomIcon = () => <svg data-testid="custom-icon" />;

      render(
        <Alert icon={CustomIcon}>Alert with custom icon</Alert>
      );

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies custom className', () => {
      const { container } = render(
        <Alert className="custom-class">Alert</Alert>
      );
      const alertElement = container.firstChild as HTMLElement;

      expect(alertElement).toHaveClass('custom-class');
    });

    it('applies custom styles', () => {
      const customStyle = { backgroundColor: 'rgb(255, 0, 0)' };
      const { container } = render(
        <Alert style={customStyle}>Alert</Alert>
      );
      const alertElement = container.firstChild as HTMLElement;

      expect(alertElement).toHaveStyle(customStyle);
    });

    it('applies custom data-testid', () => {
      render(<Alert data-testid="custom-alert">Alert</Alert>);

      expect(screen.getByTestId('custom-alert')).toBeInTheDocument();
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to the div element', () => {
      const ref = vi.fn();

      render(<Alert ref={ref}>Alert with ref</Alert>);

      expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
    });
  });

  describe('Theme Reactivity', () => {
    it('uses theme CSS variables for colors', () => {
      const { container } = render(<Alert variant="primary">Alert</Alert>);
      const alertElement = container.firstChild as HTMLElement;

      // Verify it uses Tailwind classes that map to CSS variables
      const classes = alertElement.className;
      expect(classes).toMatch(/bg-(primary|muted|success|warning|destructive)/);
      expect(classes).toMatch(/border-(primary|border|success|warning|destructive)/);
      expect(classes).toMatch(/text-foreground/);
    });

    it('responds to theme changes through CSS variables', () => {
      const { container } = render(<Alert variant="info">Info alert</Alert>);
      const alertElement = container.firstChild as HTMLElement;

      // The component should use classes that reference CSS variables
      // which will update when the theme changes
      expect(alertElement).toHaveClass('bg-primary/10', 'border-primary');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations - default', async () => {
      const { container } = render(<Alert>Alert message</Alert>);
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations - with title', async () => {
      const { container } = render(
        <Alert title="Alert Title">Alert content</Alert>
      );
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations - dismissible', async () => {
      const { container } = render(
        <Alert dismissible onDismiss={() => {}}>
          Dismissible alert
        </Alert>
      );
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });

    it('dismiss button has proper aria-label', () => {
      render(
        <Alert dismissible onDismiss={() => {}}>
          Alert
        </Alert>
      );

      const dismissButton = screen.getByRole('button', { name: /dismiss alert/i });
      expect(dismissButton).toHaveAttribute('aria-label', 'Dismiss alert');
    });

    it('has proper button type for dismiss button', () => {
      render(
        <Alert dismissible onDismiss={() => {}}>
          Alert
        </Alert>
      );

      const dismissButton = screen.getByRole('button', { name: /dismiss alert/i });
      expect(dismissButton).toHaveAttribute('type', 'button');
    });
  });

  describe('Complex Scenarios', () => {
    it('renders all features together', () => {
      const handleDismiss = vi.fn();

      render(
        <Alert
          variant="error"
          size="lg"
          title="Error Title"
          dismissible
          onDismiss={handleDismiss}
          className="custom-class"
        >
          This is an error message with all features enabled.
        </Alert>
      );

      expect(screen.getByText('Error Title')).toBeInTheDocument();
      expect(screen.getByText('This is an error message with all features enabled.')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /dismiss alert/i })).toBeInTheDocument();
    });

    it('handles long content gracefully', () => {
      const longContent = 'This is a very long alert message that should wrap properly and maintain its layout integrity even when the content spans multiple lines and continues for quite a while.';

      render(<Alert>{longContent}</Alert>);

      expect(screen.getByText(longContent)).toBeInTheDocument();
    });

    it('renders with multiple children elements', () => {
      render(
        <Alert>
          <span>First part</span>
          <strong>Important part</strong>
        </Alert>
      );

      expect(screen.getByText('First part')).toBeInTheDocument();
      expect(screen.getByText('Important part')).toBeInTheDocument();
    });
  });

  describe('Coverage Edge Cases', () => {
    it('handles undefined onDismiss gracefully', async () => {
      const user = userEvent.setup();

      render(
        <Alert dismissible>
          Alert without handler
        </Alert>
      );

      const dismissButton = screen.getByRole('button', { name: /dismiss alert/i });

      // Should not throw when clicked
      await expect(user.click(dismissButton)).resolves.not.toThrow();
    });

    it('passes through additional HTML attributes', () => {
      render(
        <Alert data-custom="value" id="test-alert">
          Alert
        </Alert>
      );

      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('data-custom', 'value');
      expect(alert).toHaveAttribute('id', 'test-alert');
    });
  });
});
