import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ToggleGroup } from './ToggleGroup';
import type { ToggleGroupProps, ToggleGroupItem } from './ToggleGroup.types';

expect.extend(toHaveNoViolations);

// Test data
const basicItems: ToggleGroupItem[] = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
];

const itemsWithIcons: ToggleGroupItem[] = [
  { value: 'bold', label: 'B', icon: () => <span>B</span> },
  { value: 'italic', label: 'I', icon: () => <span>I</span> },
  { value: 'underline', label: 'U', icon: () => <span>U</span> },
];

const itemsWithDisabled: ToggleGroupItem[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2', disabled: true },
  { value: 'option3', label: 'Option 3' },
];

describe('ToggleGroup Molecule', () => {
  // 1. RENDERING TESTS
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<ToggleGroup items={basicItems} />);

      expect(screen.getByText('Left')).toBeInTheDocument();
      expect(screen.getByText('Center')).toBeInTheDocument();
      expect(screen.getByText('Right')).toBeInTheDocument();
    });

    it('renders all items as buttons', () => {
      render(<ToggleGroup items={basicItems} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);
    });

    it('renders with aria-label', () => {
      render(<ToggleGroup items={basicItems} aria-label="Text alignment" />);

      expect(screen.getByRole('group', { name: 'Text alignment' })).toBeInTheDocument();
    });

    it('renders items with icons', () => {
      render(<ToggleGroup items={itemsWithIcons} />);

      expect(screen.getAllByText('B')).toHaveLength(2); // Icon + label
      expect(screen.getAllByText('I')).toHaveLength(2);
      expect(screen.getAllByText('U')).toHaveLength(2);
    });

    it('renders with custom className', () => {
      const { container } = render(
        <ToggleGroup items={basicItems} className="custom-class" />,
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('renders with data-testid', () => {
      render(<ToggleGroup items={basicItems} data-testid="toggle-group" />);

      expect(screen.getByTestId('toggle-group')).toBeInTheDocument();
      expect(screen.getByTestId('toggle-group-item-left')).toBeInTheDocument();
    });
  });

  // 2. SINGLE SELECTION TESTS
  describe('Single Selection', () => {
    it('allows single selection in single mode', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<ToggleGroup items={basicItems} type="single" onChange={onChange} />);

      const leftButton = screen.getByText('Left');
      await user.click(leftButton);

      expect(onChange).toHaveBeenCalledWith('left');
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('toggles off when clicking selected item in single mode', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<ToggleGroup items={basicItems} type="single" value="left" onChange={onChange} />);

      const leftButton = screen.getByText('Left');
      await user.click(leftButton);

      expect(onChange).toHaveBeenCalledWith('');
    });

    it('switches selection when clicking different item', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<ToggleGroup items={basicItems} type="single" value="left" onChange={onChange} />);

      const centerButton = screen.getByText('Center');
      await user.click(centerButton);

      expect(onChange).toHaveBeenCalledWith('center');
    });

    it('works in controlled mode with single selection', async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <ToggleGroup items={basicItems} type="single" value="left" />,
      );

      const leftButton = screen.getByText('Left');
      expect(leftButton).toHaveAttribute('aria-pressed', 'true');

      rerender(<ToggleGroup items={basicItems} type="single" value="center" />);

      const centerButton = screen.getByText('Center');
      expect(centerButton).toHaveAttribute('aria-pressed', 'true');
      expect(leftButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('works in uncontrolled mode with defaultValue', async () => {
      const user = userEvent.setup();

      render(<ToggleGroup items={basicItems} type="single" defaultValue="center" />);

      const centerButton = screen.getByText('Center');
      expect(centerButton).toHaveAttribute('aria-pressed', 'true');

      const rightButton = screen.getByText('Right');
      await user.click(rightButton);

      expect(rightButton).toHaveAttribute('aria-pressed', 'true');
      expect(centerButton).toHaveAttribute('aria-pressed', 'false');
    });
  });

  // 3. MULTIPLE SELECTION TESTS
  describe('Multiple Selection', () => {
    it('allows multiple selection in multiple mode', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<ToggleGroup items={basicItems} type="multiple" onChange={onChange} />);

      const leftButton = screen.getByText('Left');
      const centerButton = screen.getByText('Center');

      await user.click(leftButton);
      expect(onChange).toHaveBeenLastCalledWith(['left']);

      await user.click(centerButton);
      expect(onChange).toHaveBeenLastCalledWith(['left', 'center']);
    });

    it('toggles items off in multiple mode', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(
        <ToggleGroup
          items={basicItems}
          type="multiple"
          value={['left', 'center']}
          onChange={onChange}
        />,
      );

      const leftButton = screen.getByText('Left');
      await user.click(leftButton);

      expect(onChange).toHaveBeenCalledWith(['center']);
    });

    it('works in controlled mode with multiple selection', () => {
      const { rerender } = render(
        <ToggleGroup items={basicItems} type="multiple" value={['left']} />,
      );

      const leftButton = screen.getByText('Left');
      expect(leftButton).toHaveAttribute('aria-pressed', 'true');

      rerender(<ToggleGroup items={basicItems} type="multiple" value={['left', 'right']} />);

      const rightButton = screen.getByText('Right');
      expect(rightButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('works in uncontrolled mode with defaultValue array', async () => {
      const user = userEvent.setup();

      render(<ToggleGroup items={basicItems} type="multiple" defaultValue={['left']} />);

      const leftButton = screen.getByText('Left');
      expect(leftButton).toHaveAttribute('aria-pressed', 'true');

      const centerButton = screen.getByText('Center');
      await user.click(centerButton);

      expect(centerButton).toHaveAttribute('aria-pressed', 'true');
      expect(leftButton).toHaveAttribute('aria-pressed', 'true');
    });
  });

  // 4. SIZE TESTS
  describe('Sizes', () => {
    it.each([
      ['sm', 'px-3', 'py-1.5', 'text-xs', 'h-8'],
      ['md', 'px-4', 'py-2', 'text-sm', 'h-9'],
      ['lg', 'px-5', 'py-3', 'text-base', 'h-11'],
    ])('applies %s size correctly', (size, px, py, text, height) => {
      render(<ToggleGroup items={basicItems} size={size as any} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveClass(px, py, text, height);
      });
    });
  });

  // 5. VARIANT TESTS
  describe('Variants', () => {
    it('applies default variant when not selected', () => {
      render(<ToggleGroup items={basicItems} variant="default" />);

      const button = screen.getByText('Left');
      expect(button).toHaveClass('bg-transparent');
    });

    it('applies default variant when selected', () => {
      render(<ToggleGroup items={basicItems} variant="default" value="left" />);

      const button = screen.getByText('Left');
      expect(button).toHaveClass('bg-accent', 'text-accent-foreground');
    });

    it('applies primary variant when selected', () => {
      render(<ToggleGroup items={basicItems} variant="primary" value="left" />);

      const button = screen.getByText('Left');
      expect(button).toHaveClass('bg-primary', 'text-primary-foreground');
    });

    it('applies secondary variant when selected', () => {
      render(<ToggleGroup items={basicItems} variant="secondary" value="left" />);

      const button = screen.getByText('Left');
      expect(button).toHaveClass('bg-secondary', 'text-secondary-foreground');
    });

    it('applies outline variant when selected', () => {
      render(<ToggleGroup items={basicItems} variant="outline" value="left" />);

      const button = screen.getByText('Left');
      expect(button).toHaveClass('bg-accent', 'text-accent-foreground', 'border-accent');
    });
  });

  // 6. ORIENTATION TESTS
  describe('Orientation', () => {
    it('renders horizontally by default', () => {
      const { container } = render(<ToggleGroup items={basicItems} />);

      expect(container.firstChild).toHaveClass('flex-row');
    });

    it('renders vertically when orientation is vertical', () => {
      const { container } = render(<ToggleGroup items={basicItems} orientation="vertical" />);

      expect(container.firstChild).toHaveClass('flex-col');
    });
  });

  // 7. CONNECTED STYLES TESTS
  describe('Connected Styles', () => {
    it('connects buttons by default', () => {
      render(<ToggleGroup items={basicItems} connected={true} />);

      const buttons = screen.getAllByRole('button');

      // First button should have left border radius
      expect(buttons[0]).toHaveClass('rounded-l-md');

      // Last button should have right border radius
      expect(buttons[2]).toHaveClass('rounded-r-md');
    });

    it('disconnects buttons when connected is false', () => {
      const { container } = render(<ToggleGroup items={basicItems} connected={false} />);

      expect(container.firstChild).toHaveClass('gap-1');

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveClass('rounded-md');
      });
    });

    it('applies correct border radius for vertical connected buttons', () => {
      render(<ToggleGroup items={basicItems} orientation="vertical" connected={true} />);

      const buttons = screen.getAllByRole('button');

      // First button should have top border radius
      expect(buttons[0]).toHaveClass('rounded-t-md');

      // Last button should have bottom border radius
      expect(buttons[2]).toHaveClass('rounded-b-md');
    });
  });

  // 8. DISABLED STATE TESTS
  describe('Disabled State', () => {
    it('disables all items when disabled prop is true', () => {
      render(<ToggleGroup items={basicItems} disabled />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toBeDisabled();
        expect(button).toHaveAttribute('aria-disabled', 'true');
      });
    });

    it('disables specific items', () => {
      render(<ToggleGroup items={itemsWithDisabled} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons[0]).not.toBeDisabled();
      expect(buttons[1]).toBeDisabled();
      expect(buttons[2]).not.toBeDisabled();
    });

    it('does not trigger onChange when disabled', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<ToggleGroup items={basicItems} disabled onChange={onChange} />);

      const button = screen.getByText('Left');
      await user.click(button);

      expect(onChange).not.toHaveBeenCalled();
    });

    it('does not trigger onChange for disabled items', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<ToggleGroup items={itemsWithDisabled} onChange={onChange} />);

      const disabledButton = screen.getByText('Option 2');
      await user.click(disabledButton);

      expect(onChange).not.toHaveBeenCalled();
    });

    it('applies opacity to disabled items', () => {
      render(<ToggleGroup items={itemsWithDisabled} />);

      const disabledButton = screen.getByText('Option 2');
      expect(disabledButton).toHaveClass('opacity-50', 'cursor-not-allowed');
    });
  });

  // 9. KEYBOARD NAVIGATION TESTS
  describe('Keyboard Navigation', () => {
    it('activates item on Enter key', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<ToggleGroup items={basicItems} onChange={onChange} />);

      const button = screen.getByText('Left');
      button.focus();
      await user.keyboard('{Enter}');

      expect(onChange).toHaveBeenCalledWith('left');
    });

    it('activates item on Space key', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<ToggleGroup items={basicItems} onChange={onChange} />);

      const button = screen.getByText('Left');
      button.focus();
      await user.keyboard(' ');

      expect(onChange).toHaveBeenCalledWith('left');
    });

    it('prevents default on Space key', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<ToggleGroup items={basicItems} onChange={onChange} />);

      const button = screen.getByText('Left');
      button.focus();

      const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      button.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  // 10. ARIA AND ACCESSIBILITY TESTS
  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(<ToggleGroup items={basicItems} aria-label="Text alignment" />);

      expect(screen.getByRole('group')).toHaveAttribute('aria-label', 'Text alignment');

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('aria-pressed');
      });
    });

    it('sets aria-pressed correctly for selected items', () => {
      render(<ToggleGroup items={basicItems} value="center" />);

      const leftButton = screen.getByText('Left');
      const centerButton = screen.getByText('Center');
      const rightButton = screen.getByText('Right');

      expect(leftButton).toHaveAttribute('aria-pressed', 'false');
      expect(centerButton).toHaveAttribute('aria-pressed', 'true');
      expect(rightButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('sets aria-disabled for disabled items', () => {
      render(<ToggleGroup items={itemsWithDisabled} />);

      const disabledButton = screen.getByText('Option 2');
      expect(disabledButton).toHaveAttribute('aria-disabled', 'true');
    });

    it('has no accessibility violations', async () => {
      const { container } = render(
        <ToggleGroup items={basicItems} aria-label="Text alignment" />,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations when selected', async () => {
      const { container } = render(
        <ToggleGroup items={basicItems} value="center" aria-label="Text alignment" />,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations in multiple mode', async () => {
      const { container } = render(
        <ToggleGroup
          items={basicItems}
          type="multiple"
          value={['left', 'right']}
          aria-label="Text formatting"
        />,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 11. REF FORWARDING TESTS
  describe('Ref Forwarding', () => {
    it('forwards ref to container element', () => {
      const ref = vi.fn();
      render(<ToggleGroup items={basicItems} ref={ref} />);

      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement);
    });
  });

  // 12. EDGE CASES
  describe('Edge Cases', () => {
    it('handles empty items array', () => {
      const { container } = render(<ToggleGroup items={[]} />);

      expect(container.firstChild).toBeInTheDocument();
      expect(screen.queryAllByRole('button')).toHaveLength(0);
    });

    it('handles single item', () => {
      render(<ToggleGroup items={[{ value: 'only', label: 'Only' }]} />);

      const button = screen.getByText('Only');
      expect(button).toHaveClass('rounded-md');
    });

    it('handles items without onChange callback', async () => {
      const user = userEvent.setup();

      render(<ToggleGroup items={basicItems} />);

      const button = screen.getByText('Left');
      await user.click(button);

      // Should not throw error
      expect(button).toBeInTheDocument();
    });

    it('handles undefined value in controlled mode', () => {
      render(<ToggleGroup items={basicItems} value={undefined} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('aria-pressed', 'false');
      });
    });
  });

  // 13. THEME CSS VARIABLES TESTS
  describe('Theme CSS Variables', () => {
    it('uses CSS variable classes for default variant', () => {
      render(<ToggleGroup items={basicItems} variant="default" value="left" />);

      const selectedButton = screen.getByText('Left');
      expect(selectedButton).toHaveClass('bg-accent', 'text-accent-foreground');
    });

    it('uses CSS variable classes for primary variant', () => {
      render(<ToggleGroup items={basicItems} variant="primary" value="left" />);

      const selectedButton = screen.getByText('Left');
      expect(selectedButton).toHaveClass('bg-primary', 'text-primary-foreground');
    });

    it('uses border CSS variable classes', () => {
      render(<ToggleGroup items={basicItems} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveClass('border-border');
      });
    });
  });
});
