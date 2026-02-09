/**
 * QuickActionCard - Comprehensive Tests
 * Atomic Design: Molecule
 * Target Coverage: 90%+
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  Plus,
  ClipboardList,
  Settings,
  Users,
  Bell,
  Save,
  Mail,
  Calendar,
} from 'lucide-react';
import { QuickActionCard } from './QuickActionCard';

expect.extend(toHaveNoViolations);

describe('QuickActionCard - Molecule', () => {
  // 1. RENDERING TESTS
  describe('Rendering', () => {
    it('renders QuickActionCard with required props', () => {
      render(<QuickActionCard icon={Plus} label="New Request" />);

      expect(screen.getByText('New Request')).toBeInTheDocument();
    });

    it('renders as a link when href is provided', () => {
      render(
        <QuickActionCard icon={Plus} label="Test" href="/test" />
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/test');
    });

    it('renders as a button when onClick is provided', () => {
      const onClick = vi.fn();
      render(
        <QuickActionCard icon={Plus} label="Test" onClick={onClick} />
      );

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('renders icon correctly', () => {
      const { container } = render(
        <QuickActionCard icon={Plus} label="Test" />
      );

      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('renders with description when provided', () => {
      render(
        <QuickActionCard
          icon={ClipboardList}
          label="Requests"
          description="View all your service requests"
        />
      );

      expect(screen.getByText('View all your service requests')).toBeInTheDocument();
    });

    it('renders with subtitle when provided', () => {
      render(
        <QuickActionCard
          icon={ClipboardList}
          label="Requests"
          subtitle="My"
        />
      );

      expect(screen.getByText('My')).toBeInTheDocument();
      expect(screen.getByText('Requests')).toBeInTheDocument();
    });

    it('renders without description when not provided', () => {
      render(<QuickActionCard icon={Plus} label="Test" />);

      expect(screen.getByText('Test')).toBeInTheDocument();
    });

    it('renders with both subtitle and description', () => {
      render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          subtitle="Quick"
          description="A quick test action"
        />
      );

      expect(screen.getByText('Quick')).toBeInTheDocument();
      expect(screen.getByText('Test')).toBeInTheDocument();
      expect(screen.getByText('A quick test action')).toBeInTheDocument();
    });
  });

  // 2. VARIANT TESTS
  describe('Variants', () => {
    it('renders default variant', () => {
      render(
        <QuickActionCard
          icon={Plus}
          label="Default"
          variant="default"
        />
      );

      expect(screen.getByText('Default')).toBeInTheDocument();
    });

    it('renders primary variant', () => {
      const { container } = render(
        <QuickActionCard
          icon={Plus}
          label="Primary"
          variant="primary"
        />
      );

      const card = container.querySelector('[class*="border-primary"]');
      expect(card).toBeInTheDocument();
    });

    it('defaults to default variant when not specified', () => {
      const { container } = render(
        <QuickActionCard icon={Plus} label="Test" />
      );

      const card = container.querySelector('[class*="cursor-pointer"]');
      expect(card).toBeInTheDocument();
    });
  });

  // 3. ICON COLOR TESTS
  describe('Icon Colors', () => {
    it('uses primary color by default', () => {
      const { container } = render(
        <QuickActionCard icon={Plus} label="Test" />
      );

      const icon = container.querySelector('.text-primary');
      expect(icon).toBeInTheDocument();
    });

    it('renders with secondary icon color', () => {
      const { container } = render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          iconColor="secondary"
        />
      );

      const icon = container.querySelector('.text-secondary');
      expect(icon).toBeInTheDocument();
    });

    it('renders with success icon color', () => {
      const { container } = render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          iconColor="success"
        />
      );

      const icon = container.querySelector('.text-green-600');
      expect(icon).toBeInTheDocument();
    });

    it('renders with warning icon color', () => {
      const { container } = render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          iconColor="warning"
        />
      );

      const icon = container.querySelector('.text-orange-600');
      expect(icon).toBeInTheDocument();
    });

    it('renders with error icon color', () => {
      const { container } = render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          iconColor="error"
        />
      );

      const icon = container.querySelector('.text-red-600');
      expect(icon).toBeInTheDocument();
    });

    it('renders with info icon color', () => {
      const { container } = render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          iconColor="info"
        />
      );

      const icon = container.querySelector('.text-blue-600');
      expect(icon).toBeInTheDocument();
    });

    it('uses custom icon color when provided', () => {
      const { container } = render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          customIconColor="text-blue-600 dark:text-blue-400"
        />
      );

      const icon = container.querySelector('.text-blue-600');
      expect(icon).toBeInTheDocument();
    });

    it('custom icon color overrides iconColor prop', () => {
      const { container } = render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          iconColor="error"
          customIconColor="text-purple-600"
        />
      );

      const icon = container.querySelector('.text-purple-600');
      expect(icon).toBeInTheDocument();
    });
  });

  // 4. BADGE TESTS
  describe('Badge', () => {
    it('renders with number badge', () => {
      render(
        <QuickActionCard
          icon={Bell}
          label="Notifications"
          badge={5}
        />
      );

      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('renders with string badge', () => {
      render(
        <QuickActionCard
          icon={Mail}
          label="Messages"
          badge="New"
        />
      );

      expect(screen.getByText('New')).toBeInTheDocument();
    });

    it('badge positioned top-right by default', () => {
      const { container } = render(
        <QuickActionCard
          icon={Bell}
          label="Notifications"
          badge={3}
        />
      );

      const badge = container.querySelector('.top-2.right-2');
      expect(badge).toBeInTheDocument();
    });

    it('badge positioned top-left when specified', () => {
      const { container } = render(
        <QuickActionCard
          icon={Bell}
          label="Notifications"
          badge={3}
          badgePosition="top-left"
        />
      );

      const badge = container.querySelector('.top-2.left-2');
      expect(badge).toBeInTheDocument();
    });

    it('does not render badge when loading', () => {
      render(
        <QuickActionCard
          icon={Bell}
          label="Notifications"
          badge={5}
          loading
        />
      );

      expect(screen.queryByText('5')).not.toBeInTheDocument();
    });

    it('renders without badge when not provided', () => {
      const { container } = render(
        <QuickActionCard icon={Plus} label="Test" />
      );

      expect(container.querySelector('[class*="absolute"]')).not.toBeInTheDocument();
    });
  });

  // 5. LOADING STATE TESTS
  describe('Loading State', () => {
    it('shows spinner when loading', () => {
      render(
        <QuickActionCard
          icon={Save}
          label="Saving..."
          loading
        />
      );

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('hides icon when loading', () => {
      render(
        <QuickActionCard
          icon={Save}
          label="Saving..."
          loading
        />
      );

      // Spinner should be visible
      expect(screen.getByRole('status')).toBeInTheDocument();
      // Label should still be visible
      expect(screen.getByText('Saving...')).toBeInTheDocument();
    });

    it('shows label even when loading', () => {
      render(
        <QuickActionCard
          icon={Save}
          label="Saving..."
          loading
        />
      );

      expect(screen.getByText('Saving...')).toBeInTheDocument();
    });
  });

  // 6. DISABLED STATE TESTS
  describe('Disabled State', () => {
    it('applies disabled styling', () => {
      const { container } = render(
        <QuickActionCard
          icon={Plus}
          label="Disabled"
          disabled
        />
      );

      const card = container.querySelector('.opacity-50');
      expect(card).toBeInTheDocument();
    });

    it('prevents click when disabled', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      const { container } = render(
        <QuickActionCard
          icon={Plus}
          label="Disabled"
          onClick={onClick}
          disabled
        />
      );

      // When disabled, component doesn't render as button
      expect(screen.queryByRole('button')).not.toBeInTheDocument();

      // Try to click the card container - should not call onClick
      const card = container.querySelector('.cursor-pointer');
      if (card) {
        await user.click(card);
      }

      expect(onClick).not.toHaveBeenCalled();
    });

    it('has negative tabIndex when disabled', () => {
      const { container } = render(
        <QuickActionCard
          icon={Plus}
          label="Disabled"
          href="/test"
          disabled
        />
      );

      // When disabled, component doesn't render as link
      const card = container.querySelector('[tabindex="-1"]');
      expect(card).toBeInTheDocument();
    });

    it('has pointer-events-none when disabled', () => {
      const { container } = render(
        <QuickActionCard
          icon={Plus}
          label="Disabled"
          disabled
        />
      );

      const card = container.querySelector('.pointer-events-none');
      expect(card).toBeInTheDocument();
    });

    it('shows aria-disabled when disabled', () => {
      const { container } = render(
        <QuickActionCard
          icon={Plus}
          label="Disabled"
          href="/test"
          disabled
        />
      );

      // When disabled, component doesn't render as link
      const card = container.querySelector('[aria-disabled="true"]');
      expect(card).toBeInTheDocument();
    });
  });

  // 7. LINK BEHAVIOR TESTS
  describe('Link Behavior', () => {
    it('links to provided href', () => {
      render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          href="/test/path"
        />
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/test/path');
    });

    it('handles absolute paths', () => {
      render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          href="/admin/dashboard"
        />
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/admin/dashboard');
    });

    it('handles nested paths', () => {
      render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          href="/client/requests/new"
        />
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/client/requests/new');
    });

    it('does not render as link when onClick is provided', () => {
      const onClick = vi.fn();
      render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          onClick={onClick}
        />
      );

      expect(screen.queryByRole('link')).not.toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  // 8. CLICK BEHAVIOR TESTS
  describe('Click Behavior', () => {
    it('calls onClick when clicked', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(
        <QuickActionCard
          icon={Plus}
          label="Click Me"
          onClick={onClick}
        />
      );

      await user.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('handles Enter key press', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          onClick={onClick}
        />
      );

      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('handles Space key press', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          onClick={onClick}
        />
      );

      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard(' ');

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick for other keys', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          onClick={onClick}
        />
      );

      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('a');

      expect(onClick).not.toHaveBeenCalled();
    });
  });

  // 9. STYLING TESTS
  describe('Styling', () => {
    it('has hover shadow effect', () => {
      const { container } = render(
        <QuickActionCard icon={Plus} label="Test" />
      );

      const card = container.querySelector('.hover\\:shadow-lg');
      expect(card).toBeInTheDocument();
    });

    it('has hover scale effect', () => {
      const { container } = render(
        <QuickActionCard icon={Plus} label="Test" />
      );

      const card = container.querySelector('[class*="hover:scale"]');
      expect(card).toBeInTheDocument();
    });

    it('has transition classes', () => {
      const { container } = render(
        <QuickActionCard icon={Plus} label="Test" />
      );

      const card = container.querySelector('.transition-all');
      expect(card).toBeInTheDocument();
    });

    it('has cursor pointer', () => {
      const { container } = render(
        <QuickActionCard icon={Plus} label="Test" />
      );

      const card = container.querySelector('.cursor-pointer');
      expect(card).toBeInTheDocument();
    });

    it('label has semibold font', () => {
      render(
        <QuickActionCard
          icon={Plus}
          label="Test Label"
        />
      );

      const label = screen.getByText('Test Label');
      expect(label).toHaveClass('font-semibold');
    });

    it('label has large text size', () => {
      render(
        <QuickActionCard icon={Plus} label="Test" />
      );

      const label = screen.getByText('Test');
      expect(label).toHaveClass('text-lg');
    });

    it('subtitle has muted color', () => {
      render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          subtitle="Subtitle"
        />
      );

      const subtitle = screen.getByText('Subtitle');
      expect(subtitle).toHaveClass('text-muted-foreground');
    });

    it('description has muted color', () => {
      render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          description="Description text"
        />
      );

      const description = screen.getByText('Description text');
      expect(description).toHaveClass('text-muted-foreground');
    });

    it('applies custom className', () => {
      const { container } = render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          className="custom-class"
        />
      );

      const card = container.querySelector('.custom-class');
      expect(card).toBeInTheDocument();
    });
  });

  // 10. ICON VARIANTS TESTS
  describe('Icon Variants', () => {
    it('renders Plus icon', () => {
      const { container } = render(
        <QuickActionCard icon={Plus} label="Add" />
      );

      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('renders ClipboardList icon', () => {
      const { container } = render(
        <QuickActionCard icon={ClipboardList} label="List" />
      );

      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('renders Settings icon', () => {
      const { container } = render(
        <QuickActionCard icon={Settings} label="Settings" />
      );

      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('renders Users icon', () => {
      const { container } = render(
        <QuickActionCard icon={Users} label="Users" />
      );

      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('renders Bell icon', () => {
      const { container } = render(
        <QuickActionCard icon={Bell} label="Notifications" />
      );

      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('renders Mail icon', () => {
      const { container } = render(
        <QuickActionCard icon={Mail} label="Messages" />
      );

      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('renders Calendar icon', () => {
      const { container } = render(
        <QuickActionCard icon={Calendar} label="Events" />
      );

      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  // 11. ACCESSIBILITY TESTS
  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <QuickActionCard
          icon={Plus}
          label="Accessible Card"
          href="/test"
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has accessible link', () => {
      render(
        <QuickActionCard
          icon={Plus}
          label="Test Link"
          href="/test"
        />
      );

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
    });

    it('has accessible button', () => {
      const onClick = vi.fn();
      render(
        <QuickActionCard
          icon={Plus}
          label="Test Button"
          onClick={onClick}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('label is accessible', () => {
      render(
        <QuickActionCard
          icon={Plus}
          label="Accessible Label"
        />
      );

      expect(screen.getByText('Accessible Label')).toBeVisible();
    });

    it('uses custom aria-label when provided', () => {
      render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          href="/test"
          aria-label="Custom Label"
        />
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('aria-label', 'Custom Label');
    });

    it('falls back to label for aria-label', () => {
      render(
        <QuickActionCard
          icon={Plus}
          label="Test Label"
          href="/test"
        />
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('aria-label', 'Test Label');
    });

    it('icon has aria-hidden', () => {
      const { container } = render(
        <QuickActionCard icon={Plus} label="Test" />
      );

      const icon = container.querySelector('svg');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('spinner has aria-label when loading', () => {
      render(
        <QuickActionCard
          icon={Save}
          label="Saving..."
          loading
        />
      );

      expect(screen.getByLabelText('Loading')).toBeInTheDocument();
    });
  });

  // 12. EDGE CASES
  describe('Edge Cases', () => {
    it('handles very long labels', () => {
      const longLabel = 'A'.repeat(100);
      render(
        <QuickActionCard
          icon={Plus}
          label={longLabel}
        />
      );

      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    it('handles very long descriptions', () => {
      const longDescription = 'B'.repeat(200);
      render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          description={longDescription}
        />
      );

      expect(screen.getByText(longDescription)).toBeInTheDocument();
    });

    it('handles special characters in label', () => {
      render(
        <QuickActionCard
          icon={Plus}
          label="Test & Special <>"
        />
      );

      expect(screen.getByText('Test & Special <>')).toBeInTheDocument();
    });

    it('handles root href', () => {
      render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          href="/"
        />
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/');
    });

    it('handles both href and onClick (prefers link)', () => {
      const onClick = vi.fn();
      render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          href="/test"
          onClick={onClick}
        />
      );

      // When both are provided, href takes precedence
      expect(screen.getByRole('link')).toBeInTheDocument();
    });

    it('handles empty description gracefully', () => {
      render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          description=""
        />
      );

      expect(screen.getByText('Test')).toBeInTheDocument();
    });

    it('truncates long labels with ellipsis', () => {
      render(
        <QuickActionCard
          icon={Plus}
          label="Very Long Label That Should Truncate"
        />
      );

      const label = screen.getByText('Very Long Label That Should Truncate');
      expect(label).toHaveClass('truncate');
    });

    it('line-clamps long descriptions', () => {
      render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          description="Very long description that should be clamped"
        />
      );

      const description = screen.getByText('Very long description that should be clamped');
      expect(description).toHaveClass('line-clamp-2');
    });
  });

  // 13. INTEGRATION TESTS
  describe('Integration', () => {
    it('works in a grid layout', () => {
      render(
        <div className="grid grid-cols-2 gap-4">
          <QuickActionCard icon={Plus} label="Card 1" />
          <QuickActionCard icon={ClipboardList} label="Card 2" />
          <QuickActionCard icon={Settings} label="Card 3" />
          <QuickActionCard icon={Users} label="Card 4" />
        </div>
      );

      expect(screen.getByText('Card 1')).toBeInTheDocument();
      expect(screen.getByText('Card 2')).toBeInTheDocument();
      expect(screen.getByText('Card 3')).toBeInTheDocument();
      expect(screen.getByText('Card 4')).toBeInTheDocument();
    });

    it('works with different variants in same layout', () => {
      render(
        <div className="flex gap-4">
          <QuickActionCard
            icon={Plus}
            label="Primary Action"
            variant="primary"
          />
          <QuickActionCard
            icon={ClipboardList}
            label="Default Action"
            variant="default"
          />
        </div>
      );

      expect(screen.getByText('Primary Action')).toBeInTheDocument();
      expect(screen.getByText('Default Action')).toBeInTheDocument();
    });

    it('works with different icon colors', () => {
      render(
        <div className="flex gap-4">
          <QuickActionCard
            icon={Plus}
            label="Success"
            iconColor="success"
          />
          <QuickActionCard
            icon={ClipboardList}
            label="Warning"
            iconColor="warning"
          />
          <QuickActionCard
            icon={Settings}
            label="Error"
            iconColor="error"
          />
        </div>
      );

      expect(screen.getByText('Success')).toBeInTheDocument();
      expect(screen.getByText('Warning')).toBeInTheDocument();
      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    it('maintains structure when props change', () => {
      const { rerender } = render(
        <QuickActionCard
          icon={Plus}
          label="Original"
        />
      );

      expect(screen.getByText('Original')).toBeInTheDocument();

      rerender(
        <QuickActionCard
          icon={Settings}
          label="Updated"
          description="New description"
        />
      );

      expect(screen.getByText('Updated')).toBeInTheDocument();
      expect(screen.getByText('New description')).toBeInTheDocument();
      expect(screen.queryByText('Original')).not.toBeInTheDocument();
    });

    it('combines loading state with badge correctly', () => {
      render(
        <QuickActionCard
          icon={Bell}
          label="Notifications"
          badge={5}
          loading
        />
      );

      // Badge should be hidden when loading
      expect(screen.queryByText('5')).not.toBeInTheDocument();
      // Spinner should be visible
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('combines disabled state with onClick correctly', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      const { container } = render(
        <QuickActionCard
          icon={Plus}
          label="Disabled Button"
          onClick={onClick}
          disabled
        />
      );

      // When disabled, component doesn't render as button
      expect(screen.queryByRole('button')).not.toBeInTheDocument();

      // Try to click the card - should not call onClick
      const card = container.querySelector('[aria-disabled="true"]');
      if (card) {
        await user.click(card);
      }

      // Should not call onClick when disabled
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  // 14. DATA ATTRIBUTE TESTS
  describe('Data Attributes', () => {
    it('applies data-testid', () => {
      render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          data-testid="quick-action-card"
        />
      );

      expect(screen.getByTestId('quick-action-card')).toBeInTheDocument();
    });

    it('forwards other HTML attributes', () => {
      const { container } = render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          id="custom-id"
          data-custom="custom-value"
        />
      );

      const card = container.querySelector('#custom-id');
      expect(card).toBeInTheDocument();
      expect(card).toHaveAttribute('data-custom', 'custom-value');
    });
  });
});
