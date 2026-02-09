import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  describe('Rendering', () => {
    it('renders unchecked by default', () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole('button');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toHaveAttribute('data-name', 'Checkbox');
    });

    it('renders checked state when checked prop is true', () => {
      render(<Checkbox checked={true} />);
      const checkbox = screen.getByRole('button');
      expect(checkbox).toHaveClass('bg-primary', 'border-transparent');
    });

    it('renders unchecked state when checked prop is false', () => {
      render(<Checkbox checked={false} />);
      const checkbox = screen.getByRole('button');
      expect(checkbox).toHaveClass('bg-background', 'border-input');
    });

    it('has button type set to button', () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole('button');
      expect(checkbox).toHaveAttribute('type', 'button');
    });

    it('applies custom className', () => {
      const customClass = 'custom-checkbox-class';
      render(<Checkbox className={customClass} />);
      const checkbox = screen.getByRole('button');
      expect(checkbox).toHaveClass(customClass);
    });

    it('applies multiple classNames correctly', () => {
      const customClass = 'custom-class-1 custom-class-2';
      render(<Checkbox className={customClass} checked={true} />);
      const checkbox = screen.getByRole('button');
      expect(checkbox).toHaveClass('custom-class-1', 'custom-class-2', 'bg-primary');
    });
  });

  describe('User Interactions', () => {
    it('calls onCheckedChange with true when unchecked checkbox is clicked', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Checkbox checked={false} onCheckedChange={handleChange} />);

      const checkbox = screen.getByRole('button');
      await user.click(checkbox);

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('calls onCheckedChange with false when checked checkbox is clicked', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Checkbox checked={true} onCheckedChange={handleChange} />);

      const checkbox = screen.getByRole('button');
      await user.click(checkbox);

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(false);
    });

    it('does not call onCheckedChange when not provided', async () => {
      const user = userEvent.setup();
      render(<Checkbox checked={false} />);

      const checkbox = screen.getByRole('button');
      await user.click(checkbox);

      // Should not throw error
      expect(checkbox).toBeInTheDocument();
    });

    it('handles multiple clicks correctly', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Checkbox checked={false} onCheckedChange={handleChange} />);

      const checkbox = screen.getByRole('button');
      await user.click(checkbox);
      await user.click(checkbox);
      await user.click(checkbox);

      // Since this is a controlled component that doesn't update its own state,
      // each click toggles from the same initial state (false)
      expect(handleChange).toHaveBeenCalledTimes(3);
      expect(handleChange).toHaveBeenNthCalledWith(1, true);
      expect(handleChange).toHaveBeenNthCalledWith(2, true);
      expect(handleChange).toHaveBeenNthCalledWith(3, true);
    });

    it('can be triggered by keyboard (Space)', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Checkbox checked={false} onCheckedChange={handleChange} />);

      const checkbox = screen.getByRole('button');
      checkbox.focus();
      await user.keyboard(' ');

      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('can be triggered by keyboard (Enter)', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Checkbox checked={false} onCheckedChange={handleChange} />);

      const checkbox = screen.getByRole('button');
      checkbox.focus();
      await user.keyboard('{Enter}');

      expect(handleChange).toHaveBeenCalledWith(true);
    });
  });

  describe('Visual States', () => {
    it('shows check icon with full opacity when checked', () => {
      const { container } = render(<Checkbox checked={true} />);
      const iconWrapper = container.querySelector('.opacity-100');
      expect(iconWrapper).toBeInTheDocument();
      expect(iconWrapper).toHaveClass('opacity-100');
    });

    it('hides check icon when unchecked', () => {
      const { container } = render(<Checkbox checked={false} />);
      const iconWrapper = container.querySelector('.opacity-0');
      expect(iconWrapper).toBeInTheDocument();
      expect(iconWrapper).toHaveClass('opacity-0');
    });

    it('applies correct size classes', () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole('button');
      expect(checkbox).toHaveClass('w-5', 'h-5');
    });

    it('has rounded corners', () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole('button');
      expect(checkbox).toHaveClass('rounded');
    });

    it('has cursor pointer style', () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole('button');
      expect(checkbox).toHaveClass('cursor-pointer');
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined checked prop gracefully', () => {
      render(<Checkbox checked={undefined} />);
      const checkbox = screen.getByRole('button');
      expect(checkbox).toBeInTheDocument();
    });

    it('handles changing checked state from parent', () => {
      const { rerender } = render(<Checkbox checked={false} />);
      let checkbox = screen.getByRole('button');
      expect(checkbox).toHaveClass('bg-background');

      rerender(<Checkbox checked={true} />);
      checkbox = screen.getByRole('button');
      expect(checkbox).toHaveClass('bg-primary');
    });

    it('handles changing onCheckedChange callback', async () => {
      const user = userEvent.setup();
      const firstCallback = vi.fn();
      const secondCallback = vi.fn();

      const { rerender } = render(
        <Checkbox checked={false} onCheckedChange={firstCallback} />
      );

      const checkbox = screen.getByRole('button');
      await user.click(checkbox);
      expect(firstCallback).toHaveBeenCalledTimes(1);
      expect(secondCallback).not.toHaveBeenCalled();

      rerender(<Checkbox checked={true} onCheckedChange={secondCallback} />);
      await user.click(checkbox);
      expect(firstCallback).toHaveBeenCalledTimes(1); // Still 1
      expect(secondCallback).toHaveBeenCalledTimes(1);
    });
  });
});
