import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Plus, ClipboardList, Settings, Users } from 'lucide-react';
import { QuickActionCard } from './QuickActionCard';

expect.extend(toHaveNoViolations);

describe('QuickActionCard - Molecule', () => {
  // 1. RENDERING TESTS
  describe('Rendering', () => {
    it('renders QuickActionCard with required props', () => {
      render(
        <QuickActionCard
          icon={Plus}
          label="New Request"
          href="/requests/new"
        />
      );

      expect(screen.getByText('New Request')).toBeInTheDocument();
    });

    it('renders as a link', () => {
      render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          href="/test"
        />
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/test');
    });

    it('renders icon correctly', () => {
      const { container } = render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          href="/test"
        />
      );

      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('renders with subtitle when provided', () => {
      render(
        <QuickActionCard
          icon={ClipboardList}
          label="Requests"
          subtitle="My"
          href="/requests"
        />
      );

      expect(screen.getByText('My')).toBeInTheDocument();
      expect(screen.getByText('Requests')).toBeInTheDocument();
    });

    it('renders without subtitle when not provided', () => {
      render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          href="/test"
        />
      );

      expect(screen.getByText('Test')).toBeInTheDocument();
    });
  });

  // 2. VARIANT TESTS
  describe('Variants', () => {
    it('renders default variant', () => {
      render(
        <QuickActionCard
          icon={Plus}
          label="Default"
          href="/test"
          variant="default"
        />
      );

      expect(screen.getByText('Default')).toBeInTheDocument();
    });

    it('renders primary variant', () => {
      render(
        <QuickActionCard
          icon={Plus}
          label="Primary"
          href="/test"
          variant="primary"
        />
      );

      expect(screen.getByText('Primary')).toBeInTheDocument();
    });

    it('defaults to default variant when not specified', () => {
      const { container } = render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          href="/test"
        />
      );

      const card = container.querySelector('[class*="cursor-pointer"]');
      expect(card).toBeInTheDocument();
    });

    it('primary variant has border classes', () => {
      const { container } = render(
        <QuickActionCard
          icon={Plus}
          label="Primary"
          href="/test"
          variant="primary"
        />
      );

      const card = container.querySelector('[class*="border-primary"]');
      expect(card).toBeInTheDocument();
    });
  });

  // 3. ICON COLOR TESTS
  describe('Icon Colors', () => {
    it('uses primary color by default', () => {
      const { container } = render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          href="/test"
        />
      );

      const icon = container.querySelector('.text-primary');
      expect(icon).toBeInTheDocument();
    });

    it('uses custom icon color when provided', () => {
      const { container } = render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          href="/test"
          iconColor="text-blue-600 dark:text-blue-400"
        />
      );

      const icon = container.querySelector('.text-blue-600');
      expect(icon).toBeInTheDocument();
    });

    it('applies correct background for blue icon', () => {
      const { container } = render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          href="/test"
          iconColor="text-blue-600"
        />
      );

      const iconBg = container.querySelector('.bg-blue-100');
      expect(iconBg).toBeInTheDocument();
    });

    it('applies correct background for green icon', () => {
      const { container } = render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          href="/test"
          iconColor="text-green-600"
        />
      );

      const iconBg = container.querySelector('.bg-green-100');
      expect(iconBg).toBeInTheDocument();
    });

    it('applies correct background for purple icon', () => {
      const { container } = render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          href="/test"
          iconColor="text-purple-600"
        />
      );

      const iconBg = container.querySelector('.bg-purple-100');
      expect(iconBg).toBeInTheDocument();
    });

    it('applies correct background for orange icon', () => {
      const { container } = render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          href="/test"
          iconColor="text-orange-600"
        />
      );

      const iconBg = container.querySelector('.bg-orange-100');
      expect(iconBg).toBeInTheDocument();
    });
  });

  // 4. LAYOUT TESTS
  describe('Layout', () => {
    it('has flex layout', () => {
      const { container } = render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          href="/test"
        />
      );

      const layout = container.querySelector('.flex.items-center.gap-4');
      expect(layout).toBeInTheDocument();
    });

    it('icon container has correct size', () => {
      const { container } = render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          href="/test"
        />
      );

      const iconContainer = container.querySelector('.h-12.w-12');
      expect(iconContainer).toBeInTheDocument();
    });

    it('icon container is rounded', () => {
      const { container } = render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          href="/test"
        />
      );

      const iconContainer = container.querySelector('.rounded-lg');
      expect(iconContainer).toBeInTheDocument();
    });

    it('icon has correct size', () => {
      const { container } = render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          href="/test"
        />
      );

      const icon = container.querySelector('.h-6.w-6');
      expect(icon).toBeInTheDocument();
    });
  });

  // 5. STYLING TESTS
  describe('Styling', () => {
    it('has hover shadow effect', () => {
      const { container } = render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          href="/test"
        />
      );

      const card = container.querySelector('.hover\\:shadow-lg');
      expect(card).toBeInTheDocument();
    });

    it('has transition classes', () => {
      const { container } = render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          href="/test"
        />
      );

      const card = container.querySelector('.transition-shadow');
      expect(card).toBeInTheDocument();
    });

    it('has cursor pointer', () => {
      const { container } = render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          href="/test"
        />
      );

      const card = container.querySelector('.cursor-pointer');
      expect(card).toBeInTheDocument();
    });

    it('label has semibold font', () => {
      render(
        <QuickActionCard
          icon={Plus}
          label="Test Label"
          href="/test"
        />
      );

      const label = screen.getByText('Test Label');
      expect(label).toHaveClass('font-semibold');
    });

    it('label has large text size', () => {
      render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          href="/test"
        />
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
          href="/test"
        />
      );

      const subtitle = screen.getByText('Subtitle');
      expect(subtitle).toHaveClass('text-muted-foreground');
    });
  });

  // 6. LINK BEHAVIOR TESTS
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
  });

  // 7. ICON VARIANTS TESTS
  describe('Icon Variants', () => {
    it('renders Plus icon', () => {
      const { container } = render(
        <QuickActionCard
          icon={Plus}
          label="Add"
          href="/add"
        />
      );

      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('renders ClipboardList icon', () => {
      const { container } = render(
        <QuickActionCard
          icon={ClipboardList}
          label="List"
          href="/list"
        />
      );

      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('renders Settings icon', () => {
      const { container } = render(
        <QuickActionCard
          icon={Settings}
          label="Settings"
          href="/settings"
        />
      );

      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('renders Users icon', () => {
      const { container } = render(
        <QuickActionCard
          icon={Users}
          label="Users"
          href="/users"
        />
      );

      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  // 8. ACCESSIBILITY TESTS
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

    it('label is accessible', () => {
      render(
        <QuickActionCard
          icon={Plus}
          label="Accessible Label"
          href="/test"
        />
      );

      expect(screen.getByText('Accessible Label')).toBeVisible();
    });

    it('subtitle is accessible when present', () => {
      render(
        <QuickActionCard
          icon={Plus}
          label="Label"
          subtitle="Accessible Subtitle"
          href="/test"
        />
      );

      expect(screen.getByText('Accessible Subtitle')).toBeVisible();
    });
  });

  // 9. EDGE CASES
  describe('Edge Cases', () => {
    it('handles very long labels', () => {
      const longLabel = 'A'.repeat(100);
      render(
        <QuickActionCard
          icon={Plus}
          label={longLabel}
          href="/test"
        />
      );

      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    it('handles very long subtitles', () => {
      const longSubtitle = 'B'.repeat(100);
      render(
        <QuickActionCard
          icon={Plus}
          label="Test"
          subtitle={longSubtitle}
          href="/test"
        />
      );

      expect(screen.getByText(longSubtitle)).toBeInTheDocument();
    });

    it('handles special characters in label', () => {
      render(
        <QuickActionCard
          icon={Plus}
          label="Test & Special <>"
          href="/test"
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
  });

  // 10. INTEGRATION TESTS
  describe('Integration', () => {
    it('works in a grid layout', () => {
      render(
        <div className="grid grid-cols-2 gap-4">
          <QuickActionCard icon={Plus} label="Card 1" href="/1" />
          <QuickActionCard icon={ClipboardList} label="Card 2" href="/2" />
          <QuickActionCard icon={Settings} label="Card 3" href="/3" />
          <QuickActionCard icon={Users} label="Card 4" href="/4" />
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
            href="/primary"
            variant="primary"
          />
          <QuickActionCard
            icon={ClipboardList}
            label="Default Action"
            href="/default"
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
            label="Blue"
            href="/blue"
            iconColor="text-blue-600"
          />
          <QuickActionCard
            icon={ClipboardList}
            label="Green"
            href="/green"
            iconColor="text-green-600"
          />
          <QuickActionCard
            icon={Settings}
            label="Purple"
            href="/purple"
            iconColor="text-purple-600"
          />
        </div>
      );

      expect(screen.getByText('Blue')).toBeInTheDocument();
      expect(screen.getByText('Green')).toBeInTheDocument();
      expect(screen.getByText('Purple')).toBeInTheDocument();
    });

    it('maintains structure when props change', () => {
      const { rerender } = render(
        <QuickActionCard
          icon={Plus}
          label="Original"
          href="/original"
        />
      );

      expect(screen.getByText('Original')).toBeInTheDocument();

      rerender(
        <QuickActionCard
          icon={Settings}
          label="Updated"
          href="/updated"
          subtitle="New"
        />
      );

      expect(screen.getByText('Updated')).toBeInTheDocument();
      expect(screen.getByText('New')).toBeInTheDocument();
      expect(screen.queryByText('Original')).not.toBeInTheDocument();
    });
  });
});
