import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Chip } from './Chip';
import type { ChipProps } from './Chip.types';
import { Star, Heart } from 'lucide-react';

// Helper function to get chip element
const getChip = (container: HTMLElement) =>
  container.querySelector('[data-slot="chip"]') as HTMLElement;

describe('Chip Atom (Alianza Design System)', () => {
  // 1. RENDERING TESTS
  describe('Rendering', () => {
    it('renders Chip with default props', () => {
      const { container } = render(<Chip>Test Chip</Chip>);
      const chip = getChip(container);

      expect(chip).toBeInTheDocument();
      expect(chip).toHaveClass('inline-flex', 'items-center');
    });

    it('renders with data-slot attribute', () => {
      const { container } = render(<Chip>Test</Chip>);
      const chip = container.querySelector('[data-slot="chip"]');

      expect(chip).toBeInTheDocument();
    });

    it('renders without children', () => {
      const { container } = render(<Chip />);
      const chip = container.querySelector('[data-slot="chip"]');

      expect(chip).toBeInTheDocument();
    });

    it('forwards ref to span element', () => {
      const ref = { current: null as HTMLSpanElement | null };
      render(<Chip ref={ref}>Test</Chip>);

      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });
  });

  // 2. VARIANT TESTS
  describe('Variants', () => {
    it.each<ChipProps['variant']>([
      'default',
      'primary',
      'secondary',
      'success',
      'warning',
      'error',
      'info',
      'outline',
      'solid',
      'destructive',
    ])('renders %s variant correctly', (variant) => {
      const { container } = render(<Chip variant={variant}>Test</Chip>);
      const chip = getChip(container);

      expect(chip).toBeInTheDocument();
    });

    it('default variant uses secondary colors', () => {
      const { container } = render(<Chip variant="default">Test</Chip>);
      const chip = getChip(container);

      expect(chip).toHaveClass('bg-secondary', 'text-secondary-foreground');
    });

    it('primary variant uses primary colors', () => {
      const { container } = render(<Chip variant="primary">Test</Chip>);
      const chip = getChip(container);

      expect(chip).toHaveClass('bg-primary', 'text-primary-foreground');
    });

    it('success variant uses green colors', () => {
      const { container } = render(<Chip variant="success">Test</Chip>);
      const chip = getChip(container);

      expect(chip).toHaveClass('bg-green-100', 'text-green-800');
    });

    it('warning variant uses yellow colors', () => {
      const { container } = render(<Chip variant="warning">Test</Chip>);
      const chip = getChip(container);

      expect(chip).toHaveClass('bg-yellow-100', 'text-yellow-800');
    });

    it('error variant uses red colors', () => {
      const { container } = render(<Chip variant="error">Test</Chip>);
      const chip = getChip(container);

      expect(chip).toHaveClass('bg-red-100', 'text-red-800');
    });

    it('info variant uses blue colors', () => {
      const { container } = render(<Chip variant="info">Test</Chip>);
      const chip = getChip(container);

      expect(chip).toHaveClass('bg-blue-100', 'text-blue-800');
    });

    it('outline variant has border', () => {
      const { container } = render(<Chip variant="outline">Test</Chip>);
      const chip = getChip(container);

      expect(chip).toHaveClass('border', 'border-secondary-foreground');
    });

    it('solid variant uses primary background', () => {
      const { container } = render(<Chip variant="solid">Test</Chip>);
      const chip = getChip(container);

      expect(chip).toHaveClass('bg-primary', 'text-primary-foreground');
    });

    it('destructive variant uses destructive colors', () => {
      const { container } = render(<Chip variant="destructive">Test</Chip>);
      const chip = getChip(container);

      expect(chip).toHaveClass('bg-destructive', 'text-destructive-foreground');
    });
  });

  // 3. SIZE TESTS
  describe('Sizes', () => {
    it.each<ChipProps['size']>(['sm', 'md', 'lg'])(
      'renders %s size correctly',
      (size) => {
        const { container } = render(<Chip size={size}>Test</Chip>);
        const chip = getChip(container);

        const expectedClasses = {
          sm: ['h-6', 'px-2', 'py-1', 'text-xs'],
          md: ['h-8', 'px-3', 'py-1.5', 'text-sm'],
          lg: ['h-10', 'px-4', 'py-2', 'text-base'],
        }[size!];

        expectedClasses.forEach((className) => {
          expect(chip).toHaveClass(className);
        });
      },
    );

    it('defaults to medium size', () => {
      const { container } = render(<Chip>Test</Chip>);
      const chip = getChip(container);

      expect(chip).toHaveClass('h-8', 'px-3', 'text-sm');
    });
  });

  // 4. DELETABLE FUNCTIONALITY
  describe('Deletable Functionality', () => {
    it('does not render delete button by default', () => {
      render(<Chip>Test</Chip>);

      expect(screen.queryByLabelText('Remove chip')).not.toBeInTheDocument();
    });

    it('renders delete button when deletable is true', () => {
      render(<Chip deletable>Test</Chip>);

      expect(screen.getByLabelText('Remove chip')).toBeInTheDocument();
    });

    it('calls onDelete when delete button is clicked', async () => {
      const user = userEvent.setup();
      const onDelete = vi.fn();
      render(
        <Chip deletable onDelete={onDelete}>
          Test
        </Chip>,
      );

      const deleteButton = screen.getByLabelText('Remove chip');
      await user.click(deleteButton);

      expect(onDelete).toHaveBeenCalledTimes(1);
    });

    it('does not call onDelete when disabled', async () => {
      const user = userEvent.setup();
      const onDelete = vi.fn();
      render(
        <Chip deletable onDelete={onDelete} disabled>
          Test
        </Chip>,
      );

      const deleteButton = screen.getByLabelText('Remove chip');
      await user.click(deleteButton);

      expect(onDelete).not.toHaveBeenCalled();
    });

    it('stops propagation when delete button is clicked', async () => {
      const user = userEvent.setup();
      const onDelete = vi.fn();
      const onClick = vi.fn();
      render(
        <Chip deletable onDelete={onDelete} onClick={onClick}>
          Test
        </Chip>,
      );

      const deleteButton = screen.getByLabelText('Remove chip');
      await user.click(deleteButton);

      expect(onDelete).toHaveBeenCalledTimes(1);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('supports keyboard navigation on delete button (Enter)', async () => {
      const user = userEvent.setup();
      const onDelete = vi.fn();
      render(
        <Chip deletable onDelete={onDelete}>
          Test
        </Chip>,
      );

      const deleteButton = screen.getByLabelText('Remove chip');
      deleteButton.focus();
      await user.keyboard('{Enter}');

      expect(onDelete).toHaveBeenCalledTimes(1);
    });

    it('supports keyboard navigation on delete button (Space)', async () => {
      const user = userEvent.setup();
      const onDelete = vi.fn();
      render(
        <Chip deletable onDelete={onDelete}>
          Test
        </Chip>,
      );

      const deleteButton = screen.getByLabelText('Remove chip');
      deleteButton.focus();
      await user.keyboard(' ');

      expect(onDelete).toHaveBeenCalledTimes(1);
    });

    it('delete button has correct tabIndex when disabled', () => {
      render(
        <Chip deletable disabled>
          Test
        </Chip>,
      );

      const deleteButton = screen.getByLabelText('Remove chip');
      expect(deleteButton).toHaveAttribute('tabindex', '-1');
    });

    it('delete button has correct tabIndex when enabled', () => {
      render(<Chip deletable>Test</Chip>);

      const deleteButton = screen.getByLabelText('Remove chip');
      expect(deleteButton).toHaveAttribute('tabindex', '0');
    });
  });

  // 5. CLICKABLE FUNCTIONALITY
  describe('Clickable Functionality', () => {
    it('calls onClick when chip is clicked', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const { container } = render(<Chip onClick={onClick}>Test</Chip>);

      const chip = getChip(container);
      await user.click(chip);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const { container } = render(
        <Chip onClick={onClick} disabled>
          Test
        </Chip>,
      );

      const chip = getChip(container);
      await user.click(chip);

      expect(onClick).not.toHaveBeenCalled();
    });

    it('adds cursor-pointer class when clickable', () => {
      const { container } = render(<Chip onClick={() => {}}>Test</Chip>);
      const chip = getChip(container);

      expect(chip).toHaveClass('cursor-pointer');
    });

    it('does not add cursor-pointer class when disabled', () => {
      const { container } = render(
        <Chip onClick={() => {}} disabled>
          Test
        </Chip>,
      );
      const chip = getChip(container);

      expect(chip).not.toHaveClass('cursor-pointer');
    });

    it('has role="button" when clickable', () => {
      const { container } = render(<Chip onClick={() => {}}>Test</Chip>);
      const chip = getChip(container);

      expect(chip).toHaveAttribute('role', 'button');
    });

    it('does not have role="button" when not clickable', () => {
      const { container } = render(<Chip>Test</Chip>);
      const chip = getChip(container);

      expect(chip).not.toHaveAttribute('role', 'button');
    });

    it('has tabIndex=0 when clickable and not disabled', () => {
      const { container } = render(<Chip onClick={() => {}}>Test</Chip>);
      const chip = getChip(container);

      expect(chip).toHaveAttribute('tabindex', '0');
    });

    it('does not have tabIndex when disabled', () => {
      const { container } = render(
        <Chip onClick={() => {}} disabled>
          Test
        </Chip>,
      );
      const chip = getChip(container);

      expect(chip).not.toHaveAttribute('tabindex');
    });
  });

  // 6. SELECTED STATE
  describe('Selected State', () => {
    it('applies ring styles when selected', () => {
      const { container } = render(<Chip selected>Test</Chip>);
      const chip = getChip(container);

      expect(chip).toHaveClass('ring-2', 'ring-ring', 'ring-offset-2');
    });

    it('does not apply ring styles when not selected', () => {
      const { container } = render(<Chip>Test</Chip>);
      const chip = getChip(container);

      expect(chip).not.toHaveClass('ring-2');
    });

    it('has aria-selected attribute when selected', () => {
      const { container } = render(<Chip selected>Test</Chip>);
      const chip = getChip(container);

      expect(chip).toHaveAttribute('aria-selected', 'true');
    });

    it('has aria-selected=false when not selected', () => {
      const { container } = render(<Chip>Test</Chip>);
      const chip = getChip(container);

      expect(chip).toHaveAttribute('aria-selected', 'false');
    });
  });

  // 7. DISABLED STATE
  describe('Disabled State', () => {
    it('applies disabled styles', () => {
      const { container } = render(<Chip disabled>Test</Chip>);
      const chip = getChip(container);

      expect(chip).toHaveClass('opacity-50', 'cursor-not-allowed');
    });

    it('has aria-disabled attribute', () => {
      const { container } = render(<Chip disabled>Test</Chip>);
      const chip = getChip(container);

      expect(chip).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not have aria-disabled when not disabled', () => {
      const { container } = render(<Chip>Test</Chip>);
      const chip = getChip(container);

      expect(chip).toHaveAttribute('aria-disabled', 'false');
    });
  });

  // 8. ICON SUPPORT
  describe('Icon Support', () => {
    it('renders start icon', () => {
      render(
        <Chip startIcon={<Star data-testid="start-icon" />}>Test</Chip>,
      );

      expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    });

    it('renders end icon', () => {
      render(<Chip endIcon={<Heart data-testid="end-icon" />}>Test</Chip>);

      expect(screen.getByTestId('end-icon')).toBeInTheDocument();
    });

    it('renders both start and end icons', () => {
      render(
        <Chip
          startIcon={<Star data-testid="start-icon" />}
          endIcon={<Heart data-testid="end-icon" />}
        >
          Test
        </Chip>,
      );

      expect(screen.getByTestId('start-icon')).toBeInTheDocument();
      expect(screen.getByTestId('end-icon')).toBeInTheDocument();
    });

    it('does not render end icon when deletable', () => {
      render(
        <Chip deletable endIcon={<Heart data-testid="end-icon" />}>
          Test
        </Chip>,
      );

      expect(screen.queryByTestId('end-icon')).not.toBeInTheDocument();
      expect(screen.getByLabelText('Remove chip')).toBeInTheDocument();
    });

    it('renders start icon with deletable chip', () => {
      render(
        <Chip deletable startIcon={<Star data-testid="start-icon" />}>
          Test
        </Chip>,
      );

      expect(screen.getByTestId('start-icon')).toBeInTheDocument();
      expect(screen.getByLabelText('Remove chip')).toBeInTheDocument();
    });
  });

  // 9. CUSTOM PROPS TESTS
  describe('Custom Props', () => {
    it('accepts custom className', () => {
      const { container } = render(<Chip className="custom-class">Test</Chip>);
      const chip = getChip(container);

      expect(chip).toHaveClass('custom-class');
    });

    it('accepts themeOverride styles', () => {
      const customStyle = { backgroundColor: 'red', color: 'white' };
      const { container } = render(<Chip themeOverride={customStyle}>Test</Chip>);
      const chip = getChip(container);

      expect(chip).toHaveStyle(customStyle);
    });

    it('supports useSystemColors=false', () => {
      const { container } = render(<Chip useSystemColors={false}>Test</Chip>);
      const chip = getChip(container);

      expect(chip).toHaveAttribute('data-use-system-colors', 'false');
    });

    it('supports useSystemColors=true (default)', () => {
      const { container } = render(<Chip>Test</Chip>);
      const chip = getChip(container);

      expect(chip).toHaveAttribute('data-use-system-colors', 'true');
    });
  });

  // 10. HTML ATTRIBUTES
  describe('HTML Attributes', () => {
    it('forwards HTML attributes', () => {
      const { container } = render(
        <Chip data-testid="custom-chip" aria-label="Custom Chip">
          Test
        </Chip>,
      );
      const chip = getChip(container);

      expect(chip).toHaveAttribute('data-testid', 'custom-chip');
      expect(chip).toHaveAttribute('aria-label', 'Custom Chip');
    });

    it('renders as span element', () => {
      const { container } = render(<Chip>Test</Chip>);
      const chip = container.querySelector('[data-slot="chip"]');

      expect(chip?.tagName).toBe('SPAN');
    });
  });

  // 11. ACCESSIBILITY
  describe('Accessibility', () => {
    it('has proper ARIA attributes for clickable chip', () => {
      const { container } = render(<Chip onClick={() => {}}>Test</Chip>);
      const chip = getChip(container);

      expect(chip).toHaveAttribute('role', 'button');
      expect(chip).toHaveAttribute('tabindex', '0');
    });

    it('delete button has accessible label', () => {
      render(<Chip deletable>Test</Chip>);

      expect(screen.getByLabelText('Remove chip')).toBeInTheDocument();
    });

    it('delete button is keyboard accessible', async () => {
      const user = userEvent.setup();
      const onDelete = vi.fn();
      render(
        <Chip deletable onDelete={onDelete}>
          Test
        </Chip>,
      );

      const deleteButton = screen.getByLabelText('Remove chip');
      deleteButton.focus();
      await user.keyboard('{Enter}');

      expect(onDelete).toHaveBeenCalled();
    });

    it('has focus-visible ring styles', () => {
      const { container } = render(<Chip>Test</Chip>);
      const chip = getChip(container);

      expect(chip).toHaveClass(
        'focus-visible:outline-none',
        'focus-visible:ring-2',
      );
    });
  });

  // 12. EDGE CASES
  describe('Edge Cases', () => {
    it('handles very long content with truncation', () => {
      const longText = 'A'.repeat(100);
      render(<Chip>{longText}</Chip>);

      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('handles empty children gracefully', () => {
      const { container } = render(<Chip />);
      const chip = container.querySelector('[data-slot="chip"]');

      expect(chip).toBeInTheDocument();
    });

    it('handles multiple chips with same content', () => {
      render(
        <>
          <Chip>Tag 1</Chip>
          <Chip>Tag 2</Chip>
          <Chip>Tag 3</Chip>
        </>,
      );

      expect(screen.getAllByText(/Tag/)).toHaveLength(3);
    });

    it('handles complex children elements', () => {
      render(
        <Chip>
          <span>Complex</span> <strong>Content</strong>
        </Chip>,
      );

      expect(screen.getByText('Complex')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  // 13. TRANSITION AND VISUAL FEEDBACK
  describe('Transitions', () => {
    it('has transition classes', () => {
      const { container } = render(<Chip>Test</Chip>);
      const chip = getChip(container);

      expect(chip).toHaveClass('transition-all', 'duration-200');
    });

    it('has hover opacity when clickable', () => {
      const { container } = render(<Chip onClick={() => {}}>Test</Chip>);
      const chip = getChip(container);

      expect(chip).toHaveClass('hover:opacity-80');
    });
  });

  // 14. THEME INTEGRATION
  describe('Theme Integration', () => {
    it('uses theme CSS variables', () => {
      const { container } = render(<Chip variant="primary">Test</Chip>);
      const chip = getChip(container);

      expect(chip).toHaveClass('bg-primary', 'text-primary-foreground');
    });

    it('supports dark mode color variants', () => {
      const { container } = render(<Chip variant="success">Test</Chip>);
      const chip = getChip(container);

      expect(chip).toHaveClass('dark:bg-green-900/20', 'dark:text-green-400');
    });

    it('applies rounded-full for pill shape', () => {
      const { container } = render(<Chip>Test</Chip>);
      const chip = getChip(container);

      expect(chip).toHaveClass('rounded-full');
    });
  });
});
