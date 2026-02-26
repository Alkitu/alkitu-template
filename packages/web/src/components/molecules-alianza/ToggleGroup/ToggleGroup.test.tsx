import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import ToggleGroup from './ToggleGroup';
import type { ToggleGroupItem, ToggleGroupSize, ToggleGroupVariant } from './ToggleGroup.types';

expect.extend(toHaveNoViolations);

describe('ToggleGroup - Molecule (Alianza)', () => {
  const textAlignItems: ToggleGroupItem[] = [
    { value: 'left', label: 'Left', icon: 'alignLeft' },
    { value: 'center', label: 'Center', icon: 'alignCenter' },
    { value: 'right', label: 'Right', icon: 'alignRight' },
  ];

  const formatItems: ToggleGroupItem[] = [
    { value: 'bold', label: 'B', icon: 'bold' },
    { value: 'italic', label: 'I', icon: 'italic' },
    { value: 'underline', label: 'U', icon: 'underline' },
  ];

  const viewModeItems: ToggleGroupItem[] = [
    { value: 'list', label: 'List', icon: 'list' },
    { value: 'grid', label: 'Grid', icon: 'grid' },
    { value: 'card', label: 'Card', icon: 'creditCard' },
  ];

  describe('Basic Rendering', () => {
    it('renders correctly with items', () => {
      render(<ToggleGroup items={textAlignItems} />);
      expect(screen.getByText('Left')).toBeInTheDocument();
      expect(screen.getByText('Center')).toBeInTheDocument();
      expect(screen.getByText('Right')).toBeInTheDocument();
    });

    it('renders all items as buttons', () => {
      render(<ToggleGroup items={textAlignItems} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);
    });

    it('has displayName set', () => {
      expect(ToggleGroup.displayName).toBe('ToggleGroup');
    });

    it('has group role', () => {
      render(<ToggleGroup items={textAlignItems} aria-label="Text alignment" />);
      expect(screen.getByRole('group')).toBeInTheDocument();
    });

    it('has data-testid attribute', () => {
      render(<ToggleGroup items={textAlignItems} data-testid="toggle-group" />);
      expect(screen.getByTestId('toggle-group')).toBeInTheDocument();
    });

    it('renders item-specific data-testid', () => {
      render(<ToggleGroup items={textAlignItems} data-testid="align" />);
      expect(screen.getByTestId('align-item-left')).toBeInTheDocument();
      expect(screen.getByTestId('align-item-center')).toBeInTheDocument();
      expect(screen.getByTestId('align-item-right')).toBeInTheDocument();
    });
  });

  describe('Single Selection Mode (default)', () => {
    it('type defaults to single', () => {
      const onValueChange = vi.fn();
      render(<ToggleGroup items={textAlignItems} onValueChange={onValueChange} />);

      const leftButton = screen.getByText('Left');
      leftButton.click();
      expect(onValueChange).toHaveBeenCalledWith('left');
    });

    it('only one item is selected at a time', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<ToggleGroup items={textAlignItems} onValueChange={onValueChange} />);

      const leftButton = screen.getByText('Left');
      const centerButton = screen.getByText('Center');

      await user.click(leftButton);
      expect(onValueChange).toHaveBeenLastCalledWith('left');

      await user.click(centerButton);
      expect(onValueChange).toHaveBeenLastCalledWith('center');
    });

    it('clicking same item deselects it', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<ToggleGroup items={textAlignItems} onValueChange={onValueChange} />);

      const leftButton = screen.getByText('Left');
      await user.click(leftButton);
      expect(onValueChange).toHaveBeenLastCalledWith('left');

      await user.click(leftButton);
      expect(onValueChange).toHaveBeenLastCalledWith('');
    });

    it('reflects selected state with aria-pressed', () => {
      render(<ToggleGroup items={textAlignItems} value="center" />);

      const centerButton = screen.getByText('Center');
      expect(centerButton).toHaveAttribute('aria-pressed', 'true');

      const leftButton = screen.getByText('Left');
      expect(leftButton).toHaveAttribute('aria-pressed', 'false');
    });
  });

  describe('Multiple Selection Mode', () => {
    it('allows multiple items to be selected', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <ToggleGroup
          type="multiple"
          items={formatItems}
          onValueChange={onValueChange}
        />
      );

      const boldButton = screen.getByText('B');
      const italicButton = screen.getByText('I');

      await user.click(boldButton);
      expect(onValueChange).toHaveBeenLastCalledWith(['bold']);

      await user.click(italicButton);
      expect(onValueChange).toHaveBeenLastCalledWith(['bold', 'italic']);
    });

    it('clicking selected item deselects it', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <ToggleGroup
          type="multiple"
          items={formatItems}
          value={['bold', 'italic']}
          onValueChange={onValueChange}
        />
      );

      const boldButton = screen.getByText('B');
      await user.click(boldButton);
      expect(onValueChange).toHaveBeenLastCalledWith(['italic']);
    });

    it('reflects multiple selected states with aria-pressed', () => {
      render(
        <ToggleGroup
          type="multiple"
          items={formatItems}
          value={['bold', 'underline']}
        />
      );

      const boldButton = screen.getByText('B');
      const italicButton = screen.getByText('I');
      const underlineButton = screen.getByText('U');

      expect(boldButton).toHaveAttribute('aria-pressed', 'true');
      expect(italicButton).toHaveAttribute('aria-pressed', 'false');
      expect(underlineButton).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('Controlled Mode', () => {
    it('uses controlled value for single selection', () => {
      const { rerender } = render(
        <ToggleGroup items={textAlignItems} value="left" />
      );

      let leftButton = screen.getByText('Left');
      expect(leftButton).toHaveAttribute('aria-pressed', 'true');

      rerender(<ToggleGroup items={textAlignItems} value="right" />);
      leftButton = screen.getByText('Left');
      const rightButton = screen.getByText('Right');

      expect(leftButton).toHaveAttribute('aria-pressed', 'false');
      expect(rightButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('uses controlled value for multiple selection', () => {
      render(
        <ToggleGroup
          type="multiple"
          items={formatItems}
          value={['bold', 'italic']}
        />
      );

      const boldButton = screen.getByText('B');
      const italicButton = screen.getByText('I');
      const underlineButton = screen.getByText('U');

      expect(boldButton).toHaveAttribute('aria-pressed', 'true');
      expect(italicButton).toHaveAttribute('aria-pressed', 'true');
      expect(underlineButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('calls onValueChange but does not update internal state', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      const { rerender } = render(
        <ToggleGroup
          items={textAlignItems}
          value="left"
          onValueChange={onValueChange}
        />
      );

      const centerButton = screen.getByText('Center');
      await user.click(centerButton);

      expect(onValueChange).toHaveBeenCalledWith('center');
      // Value should still be 'left' because it's controlled
      expect(screen.getByText('Left')).toHaveAttribute('aria-pressed', 'true');

      // Parent must update the value prop
      rerender(
        <ToggleGroup
          items={textAlignItems}
          value="center"
          onValueChange={onValueChange}
        />
      );
      expect(screen.getByText('Center')).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('Uncontrolled Mode', () => {
    it('uses defaultValue for initial state', () => {
      render(<ToggleGroup items={textAlignItems} defaultValue="center" />);

      const centerButton = screen.getByText('Center');
      expect(centerButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('manages internal state when no value prop', async () => {
      const user = userEvent.setup();
      render(<ToggleGroup items={textAlignItems} defaultValue="left" />);

      const leftButton = screen.getByText('Left');
      const rightButton = screen.getByText('Right');

      expect(leftButton).toHaveAttribute('aria-pressed', 'true');

      await user.click(rightButton);
      expect(rightButton).toHaveAttribute('aria-pressed', 'true');
      expect(leftButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('starts with empty value if no defaultValue', () => {
      render(<ToggleGroup items={textAlignItems} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('aria-pressed', 'false');
      });
    });
  });

  describe('Orientation', () => {
    it('renders horizontally by default', () => {
      const { container } = render(<ToggleGroup items={textAlignItems} />);
      const group = container.firstChild as HTMLElement;
      expect(group).toHaveClass('flex-row');
    });

    it('renders vertically when orientation=vertical', () => {
      const { container } = render(
        <ToggleGroup items={textAlignItems} orientation="vertical" />
      );
      const group = container.firstChild as HTMLElement;
      expect(group).toHaveClass('flex-col');
    });

    it('applies correct border radius for horizontal orientation', () => {
      render(<ToggleGroup items={textAlignItems} orientation="horizontal" />);

      const leftButton = screen.getByText('Left');
      const centerButton = screen.getByText('Center');
      const rightButton = screen.getByText('Right');

      expect(leftButton).toHaveClass('rounded-l-md');
      expect(centerButton).not.toHaveClass('rounded-l-md', 'rounded-r-md');
      expect(rightButton).toHaveClass('rounded-r-md');
    });

    it('applies correct border radius for vertical orientation', () => {
      render(<ToggleGroup items={textAlignItems} orientation="vertical" />);

      const leftButton = screen.getByText('Left');
      const centerButton = screen.getByText('Center');
      const rightButton = screen.getByText('Right');

      expect(leftButton).toHaveClass('rounded-t-md');
      expect(centerButton).not.toHaveClass('rounded-t-md', 'rounded-b-md');
      expect(rightButton).toHaveClass('rounded-b-md');
    });
  });

  describe('Icon Support', () => {
    it('renders icons when provided', () => {
      render(<ToggleGroup items={textAlignItems} />);

      // Icons are rendered but we can't directly check them since they're from Icon component
      // We verify the items are rendered with their labels
      expect(screen.getByText('Left')).toBeInTheDocument();
      expect(screen.getByText('Center')).toBeInTheDocument();
      expect(screen.getByText('Right')).toBeInTheDocument();
    });

    it('renders items without icons', () => {
      const itemsWithoutIcons: ToggleGroupItem[] = [
        { value: 'a', label: 'Option A' },
        { value: 'b', label: 'Option B' },
        { value: 'c', label: 'Option C' },
      ];

      render(<ToggleGroup items={itemsWithoutIcons} />);
      expect(screen.getByText('Option A')).toBeInTheDocument();
      expect(screen.getByText('Option B')).toBeInTheDocument();
      expect(screen.getByText('Option C')).toBeInTheDocument();
    });

    it('renders icon-only toggles', () => {
      const iconOnlyItems: ToggleGroupItem[] = [
        { value: 'list', label: '', icon: 'list' },
        { value: 'grid', label: '', icon: 'grid' },
        { value: 'card', label: '', icon: 'creditCard' },
      ];

      render(<ToggleGroup items={iconOnlyItems} aria-label="View mode" />);
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);
    });
  });

  describe('Size Variants', () => {
    const sizes: ToggleGroupSize[] = ['sm', 'md', 'lg'];

    it.each(sizes)('renders %s size with correct classes', (size) => {
      render(<ToggleGroup items={textAlignItems} size={size} />);
      const button = screen.getByText('Left');

      if (size === 'sm') {
        expect(button).toHaveClass('h-8', 'px-3', 'text-xs');
      } else if (size === 'md') {
        expect(button).toHaveClass('h-9', 'px-4', 'text-sm');
      } else if (size === 'lg') {
        expect(button).toHaveClass('h-11', 'px-5', 'text-base');
      }
    });

    it('uses md size by default', () => {
      render(<ToggleGroup items={textAlignItems} />);
      const button = screen.getByText('Left');
      expect(button).toHaveClass('h-9', 'px-4', 'text-sm');
    });
  });

  describe('Visual Variants', () => {
    const variants: ToggleGroupVariant[] = ['default', 'outline'];

    it.each(variants)('renders %s variant', (variant) => {
      render(<ToggleGroup items={textAlignItems} variant={variant} />);
      const button = screen.getByText('Left');
      expect(button).toBeInTheDocument();
    });

    it('applies selected styles for default variant', () => {
      render(<ToggleGroup items={textAlignItems} variant="default" value="left" />);
      const button = screen.getByText('Left');
      expect(button).toHaveClass('bg-accent', 'text-accent-foreground');
    });

    it('applies selected styles for outline variant', () => {
      render(<ToggleGroup items={textAlignItems} variant="outline" value="left" />);
      const button = screen.getByText('Left');
      expect(button).toHaveClass('bg-accent', 'text-accent-foreground', 'border-accent');
    });

    it('applies unselected hover styles for default variant', () => {
      render(<ToggleGroup items={textAlignItems} variant="default" />);
      const button = screen.getByText('Left');
      expect(button).toHaveClass('bg-transparent', 'hover:bg-muted');
    });

    it('applies unselected hover styles for outline variant', () => {
      render(<ToggleGroup items={textAlignItems} variant="outline" />);
      const button = screen.getByText('Left');
      expect(button).toHaveClass('bg-transparent', 'hover:bg-accent');
    });
  });

  describe('Disabled State', () => {
    it('disables entire group when disabled=true', () => {
      render(<ToggleGroup items={textAlignItems} disabled />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toBeDisabled();
        expect(button).toHaveAttribute('aria-disabled', 'true');
      });
    });

    it('applies disabled opacity', () => {
      render(<ToggleGroup items={textAlignItems} disabled />);

      const button = screen.getByText('Left');
      expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
    });

    it('does not call onValueChange when disabled', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(
        <ToggleGroup
          items={textAlignItems}
          disabled
          onValueChange={onValueChange}
        />
      );

      const leftButton = screen.getByText('Left');
      await user.click(leftButton);

      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('disables individual items', () => {
      const itemsWithDisabled: ToggleGroupItem[] = [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center', disabled: true },
        { value: 'right', label: 'Right' },
      ];

      render(<ToggleGroup items={itemsWithDisabled} />);

      const leftButton = screen.getByText('Left');
      const centerButton = screen.getByText('Center');
      const rightButton = screen.getByText('Right');

      expect(leftButton).not.toBeDisabled();
      expect(centerButton).toBeDisabled();
      expect(rightButton).not.toBeDisabled();
    });

    it('does not call onValueChange for disabled items', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const itemsWithDisabled: ToggleGroupItem[] = [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center', disabled: true },
        { value: 'right', label: 'Right' },
      ];

      render(
        <ToggleGroup items={itemsWithDisabled} onValueChange={onValueChange} />
      );

      const centerButton = screen.getByText('Center');
      await user.click(centerButton);

      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Navigation', () => {
    it('toggles item with Enter key', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(<ToggleGroup items={textAlignItems} onValueChange={onValueChange} />);

      const leftButton = screen.getByText('Left');
      leftButton.focus();
      await user.keyboard('{Enter}');

      expect(onValueChange).toHaveBeenCalledWith('left');
    });

    it('toggles item with Space key', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(<ToggleGroup items={textAlignItems} onValueChange={onValueChange} />);

      const leftButton = screen.getByText('Left');
      leftButton.focus();
      await user.keyboard(' ');

      expect(onValueChange).toHaveBeenCalledWith('left');
    });

    it('navigates with ArrowRight in horizontal orientation', async () => {
      const user = userEvent.setup();
      render(<ToggleGroup items={textAlignItems} orientation="horizontal" />);

      const leftButton = screen.getByText('Left');
      const centerButton = screen.getByText('Center');

      leftButton.focus();
      await user.keyboard('{ArrowRight}');

      expect(centerButton).toHaveFocus();
    });

    it('navigates with ArrowLeft in horizontal orientation', async () => {
      const user = userEvent.setup();
      render(<ToggleGroup items={textAlignItems} orientation="horizontal" />);

      const leftButton = screen.getByText('Left');
      const centerButton = screen.getByText('Center');

      centerButton.focus();
      await user.keyboard('{ArrowLeft}');

      expect(leftButton).toHaveFocus();
    });

    it('wraps around at end with ArrowRight', async () => {
      const user = userEvent.setup();
      render(<ToggleGroup items={textAlignItems} orientation="horizontal" />);

      const leftButton = screen.getByText('Left');
      const rightButton = screen.getByText('Right');

      rightButton.focus();
      await user.keyboard('{ArrowRight}');

      expect(leftButton).toHaveFocus();
    });

    it('wraps around at start with ArrowLeft', async () => {
      const user = userEvent.setup();
      render(<ToggleGroup items={textAlignItems} orientation="horizontal" />);

      const leftButton = screen.getByText('Left');
      const rightButton = screen.getByText('Right');

      leftButton.focus();
      await user.keyboard('{ArrowLeft}');

      expect(rightButton).toHaveFocus();
    });

    it('navigates with ArrowDown in vertical orientation', async () => {
      const user = userEvent.setup();
      render(<ToggleGroup items={textAlignItems} orientation="vertical" />);

      const leftButton = screen.getByText('Left');
      const centerButton = screen.getByText('Center');

      leftButton.focus();
      await user.keyboard('{ArrowDown}');

      expect(centerButton).toHaveFocus();
    });

    it('navigates with ArrowUp in vertical orientation', async () => {
      const user = userEvent.setup();
      render(<ToggleGroup items={textAlignItems} orientation="vertical" />);

      const leftButton = screen.getByText('Left');
      const centerButton = screen.getByText('Center');

      centerButton.focus();
      await user.keyboard('{ArrowUp}');

      expect(leftButton).toHaveFocus();
    });

    it('supports Tab navigation', async () => {
      const user = userEvent.setup();
      render(<ToggleGroup items={textAlignItems} />);

      const leftButton = screen.getByText('Left');
      const centerButton = screen.getByText('Center');

      leftButton.focus();
      await user.keyboard('{Tab}');

      expect(centerButton).toHaveFocus();
    });
  });

  describe('Accessibility', () => {
    it('has proper group role', () => {
      render(<ToggleGroup items={textAlignItems} aria-label="Text alignment" />);
      expect(screen.getByRole('group')).toBeInTheDocument();
    });

    it('accepts aria-label', () => {
      render(<ToggleGroup items={textAlignItems} aria-label="View mode" />);
      const group = screen.getByRole('group', { name: 'View mode' });
      expect(group).toBeInTheDocument();
    });

    it('items have aria-pressed attribute', () => {
      render(<ToggleGroup items={textAlignItems} value="left" />);

      const leftButton = screen.getByText('Left');
      const centerButton = screen.getByText('Center');

      expect(leftButton).toHaveAttribute('aria-pressed', 'true');
      expect(centerButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('disabled items have aria-disabled', () => {
      const itemsWithDisabled: ToggleGroupItem[] = [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center', disabled: true },
      ];

      render(<ToggleGroup items={itemsWithDisabled} />);

      const centerButton = screen.getByText('Center');
      expect(centerButton).toHaveAttribute('aria-disabled', 'true');
    });

    it('has no accessibility violations', async () => {
      const { container } = render(
        <ToggleGroup items={textAlignItems} aria-label="Text alignment" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('disabled group has no accessibility violations', async () => {
      const { container } = render(
        <ToggleGroup
          items={textAlignItems}
          disabled
          aria-label="Text alignment"
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('multiple selection mode has no violations', async () => {
      const { container } = render(
        <ToggleGroup
          type="multiple"
          items={formatItems}
          value={['bold', 'italic']}
          aria-label="Text formatting"
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Theme Integration', () => {
    it('applies themeOverride styles', () => {
      const themeOverride = {
        '--accent': '#ff0000',
        '--custom-var': 'blue',
      } as React.CSSProperties;

      render(
        <ToggleGroup
          items={textAlignItems}
          themeOverride={themeOverride}
          data-testid="themed-group"
        />
      );

      const group = screen.getByTestId('themed-group');
      expect(group.style.getPropertyValue('--accent')).toBe('#ff0000');
      expect(group.style.getPropertyValue('--custom-var')).toBe('blue');
    });
  });

  describe('Common Use Cases', () => {
    it('works as text alignment toolbar', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(
        <ToggleGroup
          items={textAlignItems}
          value="left"
          onValueChange={onValueChange}
          aria-label="Text alignment"
        />
      );

      await user.click(screen.getByText('Center'));
      expect(onValueChange).toHaveBeenCalledWith('center');
    });

    it('works as view mode switcher', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(
        <ToggleGroup
          items={viewModeItems}
          value="grid"
          onValueChange={onValueChange}
          aria-label="View mode"
        />
      );

      await user.click(screen.getByText('List'));
      expect(onValueChange).toHaveBeenCalledWith('list');
    });

    it('works as formatting toolbar with multiple selection', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(
        <ToggleGroup
          type="multiple"
          items={formatItems}
          value={['bold']}
          onValueChange={onValueChange}
          aria-label="Text formatting"
        />
      );

      await user.click(screen.getByText('I'));
      expect(onValueChange).toHaveBeenCalledWith(['bold', 'italic']);
    });

    it('works as filter options with multiple selection', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const filterItems: ToggleGroupItem[] = [
        { value: 'active', label: 'Active' },
        { value: 'pending', label: 'Pending' },
        { value: 'completed', label: 'Completed' },
      ];

      render(
        <ToggleGroup
          type="multiple"
          items={filterItems}
          onValueChange={onValueChange}
          aria-label="Status filter"
        />
      );

      await user.click(screen.getByText('Active'));
      await user.click(screen.getByText('Completed'));

      expect(onValueChange).toHaveBeenLastCalledWith(['active', 'completed']);
    });
  });

  describe('Custom Props and Edge Cases', () => {
    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<ToggleGroup ref={ref} items={textAlignItems} />);
      expect(ref).toHaveBeenCalled();
    });

    it('accepts className prop', () => {
      const { container } = render(
        <ToggleGroup items={textAlignItems} className="custom-class" />
      );
      const group = container.firstChild as HTMLElement;
      expect(group).toHaveClass('custom-class');
    });

    it('merges custom className with default classes', () => {
      const { container } = render(
        <ToggleGroup items={textAlignItems} className="custom-class" />
      );
      const group = container.firstChild as HTMLElement;
      expect(group).toHaveClass('custom-class', 'inline-flex');
    });

    it('spreads additional HTML attributes', () => {
      render(
        <ToggleGroup
          items={textAlignItems}
          data-testid="test-group"
          id="my-toggle-group"
        />
      );

      const group = screen.getByTestId('test-group');
      expect(group).toHaveAttribute('id', 'my-toggle-group');
    });

    it('handles empty items array', () => {
      const { container } = render(<ToggleGroup items={[]} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles single item', () => {
      const singleItem: ToggleGroupItem[] = [
        { value: 'single', label: 'Single' },
      ];

      render(<ToggleGroup items={singleItem} />);
      const button = screen.getByText('Single');
      expect(button).toHaveClass('rounded-md');
    });
  });

  describe('Visual Regression Prevention', () => {
    it('maintains consistent height across sizes', () => {
      const sizes: ToggleGroupSize[] = ['sm', 'md', 'lg'];
      const heights = ['h-8', 'h-9', 'h-11'];

      sizes.forEach((size, index) => {
        const { container, unmount } = render(<ToggleGroup items={textAlignItems} size={size} />);
        const buttons = container.querySelectorAll('button');
        expect(buttons[0]).toHaveClass(heights[index]);
        unmount();
      });
    });

    it('applies focus ring styles', () => {
      render(<ToggleGroup items={textAlignItems} />);
      const button = screen.getByText('Left');
      expect(button).toHaveClass(
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-offset-2',
        'focus:ring-primary/20'
      );
    });

    it('applies transition classes', () => {
      render(<ToggleGroup items={textAlignItems} />);
      const button = screen.getByText('Left');
      expect(button).toHaveClass('transition-all', 'duration-200');
    });

    it('maintains border consistency in horizontal mode', () => {
      render(<ToggleGroup items={textAlignItems} orientation="horizontal" />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button, index) => {
        expect(button).toHaveClass('border', 'border-border');
        if (index > 0) {
          expect(button).toHaveClass('-ml-px');
        }
      });
    });

    it('maintains border consistency in vertical mode', () => {
      render(<ToggleGroup items={textAlignItems} orientation="vertical" />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button, index) => {
        expect(button).toHaveClass('border', 'border-border');
        if (index > 0) {
          expect(button).toHaveClass('-mt-px');
        }
      });
    });
  });
});
