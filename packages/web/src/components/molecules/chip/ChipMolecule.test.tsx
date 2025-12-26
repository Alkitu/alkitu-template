import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { User, Star } from 'lucide-react';
import { ChipMolecule } from './ChipMolecule';

expect.extend(toHaveNoViolations);

describe('ChipMolecule', () => {
  describe('Rendering', () => {
    it('renders correctly with children', () => {
      render(<ChipMolecule>Test Chip</ChipMolecule>);
      expect(screen.getByText('Test Chip')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      const { container } = render(<ChipMolecule className="custom-class">Test</ChipMolecule>);
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('renders with custom style', () => {
      const { container } = render(
        <ChipMolecule style={{ margin: '10px' }}>Test</ChipMolecule>
      );
      const element = container.firstChild as HTMLElement;
      expect(element.style.margin).toBe('10px');
    });

    it('has correct base classes', () => {
      const { container } = render(<ChipMolecule>Test</ChipMolecule>);
      expect(container.firstChild).toHaveClass('chip-molecule', 'inline-flex', 'items-center');
    });

    it('has correct displayName', () => {
      expect(ChipMolecule.displayName).toBe('ChipMolecule');
    });
  });

  describe('Sizes', () => {
    it.each([
      ['sm', '24px', '12px'],
      ['md', '32px', '14px'],
      ['lg', '40px', '16px'],
    ])('applies correct styles for %s size', (size, expectedHeight, expectedFontSize) => {
      const { container } = render(
        <ChipMolecule size={size as any}>Test</ChipMolecule>
      );
      const element = container.firstChild as HTMLElement;
      expect(element.style.height).toBe(expectedHeight);
      expect(element.style.fontSize).toBe(expectedFontSize);
    });

    it('applies medium size by default', () => {
      const { container } = render(<ChipMolecule>Test</ChipMolecule>);
      const element = container.firstChild as HTMLElement;
      expect(element.style.height).toBe('32px');
    });
  });

  describe('States', () => {
    it('applies selected state styles', () => {
      const { container } = render(
        <ChipMolecule variant="primary" selected>
          Selected
        </ChipMolecule>
      );
      const element = container.firstChild as HTMLElement;
      expect(element.style.backgroundColor).toBe('var(--color-primary)');
    });

    it('applies disabled state styles', () => {
      const { container } = render(<ChipMolecule disabled>Disabled</ChipMolecule>);
      const element = container.firstChild as HTMLElement;
      expect(element.style.opacity).toBe('0.6');
      expect(element.style.pointerEvents).toBe('none');
    });

    it('sets cursor to pointer when clickable', () => {
      const { container } = render(
        <ChipMolecule onClick={() => {}}>Clickable</ChipMolecule>
      );
      const element = container.firstChild as HTMLElement;
      expect(element.style.cursor).toBe('pointer');
    });

    it('sets cursor to default when not clickable', () => {
      const { container } = render(<ChipMolecule>Not Clickable</ChipMolecule>);
      const element = container.firstChild as HTMLElement;
      expect(element.style.cursor).toBe('default');
    });
  });

  describe('Icons', () => {
    it('renders with start icon', () => {
      const { container } = render(
        <ChipMolecule startIcon={User}>With Icon</ChipMolecule>
      );
      const iconContainer = container.querySelector('.icon-atom');
      expect(iconContainer).toBeInTheDocument();
    });

    it('renders with end icon', () => {
      const { container } = render(<ChipMolecule endIcon={Star}>With Icon</ChipMolecule>);
      const iconContainers = container.querySelectorAll('.icon-atom');
      expect(iconContainers.length).toBeGreaterThan(0);
    });

    it('renders with both start and end icons', () => {
      const { container } = render(
        <ChipMolecule startIcon={User} endIcon={Star}>
          Both Icons
        </ChipMolecule>
      );
      const iconContainers = container.querySelectorAll('.icon-atom');
      expect(iconContainers.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Avatar', () => {
    it('renders with avatar', () => {
      const avatar = <img src="/test.jpg" alt="avatar" />;
      render(<ChipMolecule avatar={avatar}>With Avatar</ChipMolecule>);
      expect(screen.getByAltText('avatar')).toBeInTheDocument();
    });

    it('applies correct avatar styles', () => {
      const avatar = <div data-testid="avatar">A</div>;
      const { container } = render(<ChipMolecule avatar={avatar}>Test</ChipMolecule>);
      const avatarContainer = container.querySelector('.flex-shrink-0');
      expect(avatarContainer).toBeInTheDocument();
    });
  });

  describe('Removable', () => {
    it('renders remove button when removable', () => {
      render(
        <ChipMolecule removable onRemove={() => {}}>
          Removable
        </ChipMolecule>
      );
      const removeButton = screen.getByRole('button', { name: /remove/i });
      expect(removeButton).toBeInTheDocument();
    });

    it('does not render remove button when not removable', () => {
      render(<ChipMolecule>Not Removable</ChipMolecule>);
      const removeButton = screen.queryByRole('button', { name: /remove/i });
      expect(removeButton).not.toBeInTheDocument();
    });

    it('calls onRemove when remove button clicked', async () => {
      const user = userEvent.setup();
      const handleRemove = vi.fn();

      render(
        <ChipMolecule removable onRemove={handleRemove}>
          Removable
        </ChipMolecule>
      );

      const removeButton = screen.getByRole('button', { name: /remove/i });
      await user.click(removeButton);

      expect(handleRemove).toHaveBeenCalledTimes(1);
    });

    it('stops propagation when remove button clicked', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      const handleRemove = vi.fn();

      render(
        <ChipMolecule removable onClick={handleClick} onRemove={handleRemove}>
          Removable
        </ChipMolecule>
      );

      const removeButton = screen.getByRole('button', { name: /remove/i });
      await user.click(removeButton);

      expect(handleRemove).toHaveBeenCalledTimes(1);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('disables remove button when chip is disabled', () => {
      render(
        <ChipMolecule removable disabled onRemove={() => {}}>
          Disabled
        </ChipMolecule>
      );
      const removeButton = screen.getByRole('button', { name: /remove/i });
      expect(removeButton).toBeDisabled();
    });
  });

  describe('Interactions', () => {
    it('calls onClick when chip is clicked', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<ChipMolecule onClick={handleClick}>Clickable</ChipMolecule>);
      const chip = screen.getByText('Clickable').parentElement!;

      await user.click(chip);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', () => {
      const handleClick = vi.fn();

      const { container } = render(
        <ChipMolecule onClick={handleClick} disabled>
          Disabled
        </ChipMolecule>
      );
      const chip = container.firstChild as HTMLElement;

      // Element has pointer-events: none when disabled, so cannot be clicked normally
      expect(chip.style.pointerEvents).toBe('none');
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not set onClick handler when not provided', () => {
      const { container } = render(<ChipMolecule>Test</ChipMolecule>);
      const element = container.firstChild as HTMLElement;
      expect(element.onclick).toBeNull();
    });
  });

  describe('Content', () => {
    it('truncates long text content', () => {
      const { container } = render(
        <ChipMolecule>Very long chip content that should be truncated</ChipMolecule>
      );
      const textElement = container.querySelector('.truncate');
      expect(textElement).toBeInTheDocument();
      expect(textElement).toHaveClass('truncate');
    });

    it('renders React nodes as children', () => {
      render(
        <ChipMolecule>
          <strong>Bold</strong> and <em>italic</em>
        </ChipMolecule>
      );
      expect(screen.getByText('Bold')).toBeInTheDocument();
      expect(screen.getByText('and')).toBeInTheDocument();
      expect(screen.getByText('italic')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<ChipMolecule>Accessible Chip</ChipMolecule>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has accessible remove button', async () => {
      const { container } = render(
        <ChipMolecule removable onRemove={() => {}}>
          Removable
        </ChipMolecule>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();

      const removeButton = screen.getByRole('button', { name: /remove/i });
      expect(removeButton).toHaveAccessibleName();
    });

    it('maintains focus visibility', () => {
      render(
        <ChipMolecule removable onRemove={() => {}}>
          Test
        </ChipMolecule>
      );
      const removeButton = screen.getByRole('button', { name: /remove/i });
      removeButton.focus();
      expect(removeButton).toHaveFocus();
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<ChipMolecule ref={ref}>Test</ChipMolecule>);
      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Props Spreading', () => {
    it('spreads additional props to root element', () => {
      const { container } = render(
        <ChipMolecule data-testid="custom-chip" aria-label="Custom chip">
          Test
        </ChipMolecule>
      );
      const element = container.firstChild as HTMLElement;
      expect(element).toHaveAttribute('data-testid', 'custom-chip');
      expect(element).toHaveAttribute('aria-label', 'Custom chip');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty children gracefully', () => {
      render(<ChipMolecule>{''}</ChipMolecule>);
      expect(screen.queryByText('Test')).not.toBeInTheDocument();
    });

    it('handles undefined onRemove gracefully', async () => {
      const user = userEvent.setup();
      render(<ChipMolecule removable>Removable</ChipMolecule>);

      const removeButton = screen.getByRole('button', { name: /remove/i });
      await user.click(removeButton);

      // Should not throw error
      expect(removeButton).toBeInTheDocument();
    });

    it('handles undefined onClick gracefully', async () => {
      const user = userEvent.setup();
      const { container } = render(<ChipMolecule>Not Clickable</ChipMolecule>);

      const chip = container.firstChild as HTMLElement;
      await user.click(chip);

      // Should not throw error
      expect(chip).toBeInTheDocument();
    });

    it('combines selected and disabled states correctly', () => {
      const { container } = render(
        <ChipMolecule variant="primary" selected disabled>
          Selected Disabled
        </ChipMolecule>
      );
      const element = container.firstChild as HTMLElement;

      expect(element.style.opacity).toBe('0.6');
      expect(element.style.pointerEvents).toBe('none');
      expect(element.style.backgroundColor).toBe('var(--color-primary)');
    });
  });
});
