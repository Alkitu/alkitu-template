import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { PlaceholderPaletteMolecule } from './PlaceholderPaletteMolecule';
import type { AvailablePlaceholders } from '@alkitu/shared/types';

expect.extend(toHaveNoViolations);

const mockPlaceholders: AvailablePlaceholders = {
  request: ['{{request.id}}', '{{request.status}}', '{{request.createdAt}}'],
  user: ['{{user.firstname}}', '{{user.lastname}}', '{{user.email}}'],
  service: ['{{service.name}}', '{{service.category}}'],
  location: ['{{location.city}}', '{{location.state}}', '{{location.zip}}'],
  employee: ['{{employee.firstname}}', '{{employee.email}}'],
  templateResponses: ['{{templateResponses.*}}'],
};

describe('PlaceholderPaletteMolecule', () => {
  let clipboardWriteTextSpy: any;

  beforeEach(() => {
    // Mock clipboard API
    clipboardWriteTextSpy = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: clipboardWriteTextSpy,
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders all placeholder categories', () => {
      render(<PlaceholderPaletteMolecule placeholders={mockPlaceholders} />);

      expect(screen.getByText('request')).toBeInTheDocument();
      expect(screen.getByText('user')).toBeInTheDocument();
      expect(screen.getByText('service')).toBeInTheDocument();
      expect(screen.getByText('location')).toBeInTheDocument();
      expect(screen.getByText('employee')).toBeInTheDocument();
      expect(screen.getByText('templateResponses')).toBeInTheDocument();
    });

    it('renders all placeholders within each category', () => {
      render(<PlaceholderPaletteMolecule placeholders={mockPlaceholders} />);

      // Request placeholders
      expect(screen.getByText('{{request.id}}')).toBeInTheDocument();
      expect(screen.getByText('{{request.status}}')).toBeInTheDocument();
      expect(screen.getByText('{{request.createdAt}}')).toBeInTheDocument();

      // User placeholders
      expect(screen.getByText('{{user.firstname}}')).toBeInTheDocument();
      expect(screen.getByText('{{user.lastname}}')).toBeInTheDocument();
      expect(screen.getByText('{{user.email}}')).toBeInTheDocument();
    });

    it('hides category headers when showCategoryHeaders is false', () => {
      render(
        <PlaceholderPaletteMolecule
          placeholders={mockPlaceholders}
          showCategoryHeaders={false}
        />
      );

      expect(screen.queryByText('request')).not.toBeInTheDocument();
      expect(screen.queryByText('user')).not.toBeInTheDocument();
      // Placeholders should still be visible
      expect(screen.getByText('{{request.id}}')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <PlaceholderPaletteMolecule
          placeholders={mockPlaceholders}
          className="custom-class"
        />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('applies correct grid columns class', () => {
      const { container } = render(
        <PlaceholderPaletteMolecule placeholders={mockPlaceholders} columns={3} />
      );

      expect(container.firstChild).toHaveClass('grid-cols-3', 'md:grid-cols-3');
    });
  });

  describe('Grid Columns', () => {
    it.each([
      [2, 'grid-cols-2'],
      [3, 'grid-cols-3 md:grid-cols-3'],
      [4, 'grid-cols-2 md:grid-cols-4'],
      [5, 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5'],
      [6, 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'],
    ])('applies correct grid classes for %i columns', (columns, expectedClasses) => {
      const { container } = render(
        <PlaceholderPaletteMolecule
          placeholders={mockPlaceholders}
          columns={columns as any}
        />
      );

      const classes = expectedClasses.split(' ');
      const gridElement = container.firstChild as HTMLElement;

      classes.forEach((className) => {
        expect(gridElement).toHaveClass(className);
      });
    });

    it('uses 5 columns by default', () => {
      const { container } = render(
        <PlaceholderPaletteMolecule placeholders={mockPlaceholders} />
      );

      expect(container.firstChild).toHaveClass(
        'grid-cols-2',
        'md:grid-cols-3',
        'lg:grid-cols-5'
      );
    });
  });

  describe('Placeholder Click Interactions', () => {
    it('calls onPlaceholderClick when placeholder is clicked', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(
        <PlaceholderPaletteMolecule
          placeholders={mockPlaceholders}
          onPlaceholderClick={handleClick}
        />
      );

      const placeholder = screen.getByText('{{request.id}}');
      await user.click(placeholder);

      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(handleClick).toHaveBeenCalledWith('{{request.id}}');
    });

    it('handles multiple placeholder clicks', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(
        <PlaceholderPaletteMolecule
          placeholders={mockPlaceholders}
          onPlaceholderClick={handleClick}
        />
      );

      await user.click(screen.getByText('{{request.id}}'));
      await user.click(screen.getByText('{{user.email}}'));
      await user.click(screen.getByText('{{service.name}}'));

      expect(handleClick).toHaveBeenCalledTimes(3);
      expect(handleClick).toHaveBeenNthCalledWith(1, '{{request.id}}');
      expect(handleClick).toHaveBeenNthCalledWith(2, '{{user.email}}');
      expect(handleClick).toHaveBeenNthCalledWith(3, '{{service.name}}');
    });

    it('does not throw when onPlaceholderClick is undefined', async () => {
      const user = userEvent.setup();

      render(<PlaceholderPaletteMolecule placeholders={mockPlaceholders} />);

      const placeholder = screen.getByText('{{request.id}}');
      await user.click(placeholder);

      // Should not throw error
      expect(placeholder).toBeInTheDocument();
    });
  });

  describe('Clipboard Copy Functionality', () => {
    it('copies placeholder to clipboard when enableCopy is true', async () => {
      const user = userEvent.setup();

      render(
        <PlaceholderPaletteMolecule placeholders={mockPlaceholders} enableCopy />
      );

      const placeholder = screen.getByText('{{request.id}}');
      await user.click(placeholder);

      await waitFor(() => {
        expect(clipboardWriteTextSpy).toHaveBeenCalledWith('{{request.id}}');
      });
    });

    it('does not copy when enableCopy is false', async () => {
      const user = userEvent.setup();

      render(
        <PlaceholderPaletteMolecule
          placeholders={mockPlaceholders}
          enableCopy={false}
        />
      );

      const placeholder = screen.getByText('{{request.id}}');
      await user.click(placeholder);

      expect(clipboardWriteTextSpy).not.toHaveBeenCalled();
    });

    it('shows checkmark icon after successful copy', async () => {
      const user = userEvent.setup();

      render(
        <PlaceholderPaletteMolecule placeholders={mockPlaceholders} enableCopy />
      );

      const placeholder = screen.getByText('{{request.id}}');
      await user.click(placeholder);

      // Wait for the checkmark to appear
      await waitFor(() => {
        const button = placeholder.closest('button');
        expect(button).toHaveClass('bg-green-100');
      });
    });

    it('clears copied state after 2 seconds', async () => {
      vi.useFakeTimers();
      const user = userEvent.setup();

      render(
        <PlaceholderPaletteMolecule placeholders={mockPlaceholders} enableCopy />
      );

      const placeholder = screen.getByText('{{request.id}}');
      await user.click(placeholder);

      // Initially should have green background
      await waitFor(() => {
        const button = placeholder.closest('button');
        expect(button).toHaveClass('bg-green-100');
      });

      // After 2 seconds, should return to normal
      vi.advanceTimersByTime(2000);

      await waitFor(() => {
        const button = placeholder.closest('button');
        expect(button).not.toHaveClass('bg-green-100');
      });

      vi.useRealTimers();
    });

    it('handles clipboard errors gracefully', async () => {
      const user = userEvent.setup();
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      clipboardWriteTextSpy.mockRejectedValueOnce(new Error('Clipboard error'));

      render(
        <PlaceholderPaletteMolecule placeholders={mockPlaceholders} enableCopy />
      );

      const placeholder = screen.getByText('{{request.id}}');
      await user.click(placeholder);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Failed to copy placeholder:',
          expect.any(Error)
        );
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Combined Click and Copy', () => {
    it('triggers both onPlaceholderClick and copy when enableCopy is true', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(
        <PlaceholderPaletteMolecule
          placeholders={mockPlaceholders}
          onPlaceholderClick={handleClick}
          enableCopy
        />
      );

      const placeholder = screen.getByText('{{request.id}}');
      await user.click(placeholder);

      expect(handleClick).toHaveBeenCalledWith('{{request.id}}');
      await waitFor(() => {
        expect(clipboardWriteTextSpy).toHaveBeenCalledWith('{{request.id}}');
      });
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <PlaceholderPaletteMolecule placeholders={mockPlaceholders} />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has accessible button roles', () => {
      render(<PlaceholderPaletteMolecule placeholders={mockPlaceholders} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);

      buttons.forEach((button) => {
        expect(button).toHaveAttribute('type', 'button');
      });
    });

    it('has descriptive titles for buttons', () => {
      render(
        <PlaceholderPaletteMolecule placeholders={mockPlaceholders} enableCopy />
      );

      const button = screen.getByText('{{request.id}}').closest('button');
      expect(button).toHaveAttribute('title', 'Click to copy');
    });

    it('has focus styles', () => {
      render(<PlaceholderPaletteMolecule placeholders={mockPlaceholders} />);

      const button = screen.getByText('{{request.id}}').closest('button');
      expect(button).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500');
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(
        <PlaceholderPaletteMolecule
          placeholders={mockPlaceholders}
          onPlaceholderClick={handleClick}
        />
      );

      const button = screen.getByText('{{request.id}}').closest('button')!;
      button.focus();

      expect(button).toHaveFocus();

      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledWith('{{request.id}}');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty placeholders object', () => {
      const emptyPlaceholders: AvailablePlaceholders = {
        request: [],
        user: [],
        service: [],
        location: [],
        employee: [],
        templateResponses: [],
      };

      const { container } = render(
        <PlaceholderPaletteMolecule placeholders={emptyPlaceholders} />
      );

      // Should render grid but with no placeholder buttons
      expect(container.firstChild).toHaveClass('grid');
    });

    it('handles category with single placeholder', () => {
      const singlePlaceholders: AvailablePlaceholders = {
        request: ['{{request.id}}'],
        user: [],
        service: [],
        location: [],
        employee: [],
        templateResponses: [],
      };

      render(<PlaceholderPaletteMolecule placeholders={singlePlaceholders} />);

      expect(screen.getByText('{{request.id}}')).toBeInTheDocument();
    });

    it('truncates long placeholder text with ellipsis', () => {
      const longPlaceholders: AvailablePlaceholders = {
        request: ['{{request.veryLongPropertyNameThatShouldBeTruncated}}'  ],
        user: [],
        service: [],
        location: [],
        employee: [],
        templateResponses: [],
      };

      render(<PlaceholderPaletteMolecule placeholders={longPlaceholders} />);

      const code = screen.getByText(
        '{{request.veryLongPropertyNameThatShouldBeTruncated}}'
      );
      expect(code).toHaveClass('truncate');
    });
  });

  describe('Styling', () => {
    it('applies correct base styles', () => {
      const { container } = render(
        <PlaceholderPaletteMolecule placeholders={mockPlaceholders} />
      );

      expect(container.firstChild).toHaveClass('grid', 'gap-4');
    });

    it('applies hover styles to buttons', () => {
      render(<PlaceholderPaletteMolecule placeholders={mockPlaceholders} />);

      const button = screen.getByText('{{request.id}}').closest('button');
      expect(button).toHaveClass('hover:bg-gray-200', 'dark:hover:bg-gray-700');
    });

    it('shows copy icon on hover when enableCopy is true', () => {
      render(
        <PlaceholderPaletteMolecule placeholders={mockPlaceholders} enableCopy />
      );

      const button = screen.getByText('{{request.id}}').closest('button');
      const iconSpan = button?.querySelector('.opacity-0');
      expect(iconSpan).toHaveClass('group-hover:opacity-100');
    });
  });
});
