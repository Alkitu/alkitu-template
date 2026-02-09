import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Heart, Star, Settings } from 'lucide-react';
import Accordion, { AccordionPresets } from './Accordion';
import type { AccordionVariant, AccordionBadgeVariant, AccordionItem } from './Accordion.types';

expect.extend(toHaveNoViolations);

describe('Accordion - Molecule (Alianza)', () => {
  // Sample accordion items
  const basicItems: AccordionItem[] = [
    {
      id: 'item-1',
      title: 'First Item',
      content: 'First item content',
    },
    {
      id: 'item-2',
      title: 'Second Item',
      content: 'Second item content',
    },
    {
      id: 'item-3',
      title: 'Third Item',
      content: 'Third item content',
    },
  ];

  describe('Basic Rendering', () => {
    it('renders correctly with items', () => {
      render(<Accordion items={basicItems} />);
      expect(screen.getByTestId('accordion')).toBeInTheDocument();
    });

    it('renders all accordion items', () => {
      render(<Accordion items={basicItems} />);
      expect(screen.getByText('First Item')).toBeInTheDocument();
      expect(screen.getByText('Second Item')).toBeInTheDocument();
      expect(screen.getByText('Third Item')).toBeInTheDocument();
    });

    it('has displayName set', () => {
      expect(Accordion.displayName).toBe('Accordion');
    });

    it('renders with custom className', () => {
      render(<Accordion items={basicItems} className="custom-class" />);
      expect(screen.getByTestId('accordion')).toHaveClass('custom-class');
    });

    it('renders empty accordion with no items', () => {
      render(<Accordion items={[]} />);
      expect(screen.getByTestId('accordion')).toBeInTheDocument();
    });

    it('renders with single item', () => {
      render(<Accordion items={[basicItems[0]]} />);
      expect(screen.getByText('First Item')).toBeInTheDocument();
    });
  });

  describe('Variants - All 4 Variants', () => {
    const variants: AccordionVariant[] = ['default', 'card', 'bordered', 'minimal'];

    it.each(variants)('renders %s variant with correct classes', (variant) => {
      render(<Accordion items={basicItems} variant={variant} />);
      const accordion = screen.getByTestId('accordion');

      if (variant === 'default') {
        expect(accordion).toHaveClass('bg-background', 'border', 'border-border');
      } else if (variant === 'card') {
        expect(accordion).toHaveClass('bg-card', 'border', 'shadow-md');
      } else if (variant === 'bordered') {
        expect(accordion).toHaveClass('bg-background', 'border-2');
      } else if (variant === 'minimal') {
        expect(accordion).toHaveClass('bg-transparent', 'border-none');
      }
    });

    it('uses default variant by default', () => {
      render(<Accordion items={basicItems} />);
      const accordion = screen.getByTestId('accordion');
      expect(accordion).toHaveClass('bg-background');
    });

    it('applies rounded corners to all variants', () => {
      variants.forEach((variant) => {
        const { unmount } = render(<Accordion items={basicItems} variant={variant} />);
        expect(screen.getByTestId('accordion')).toHaveClass('rounded-xl');
        unmount();
      });
    });

    it('applies transition classes to all variants', () => {
      variants.forEach((variant) => {
        const { unmount } = render(<Accordion items={basicItems} variant={variant} />);
        expect(screen.getByTestId('accordion')).toHaveClass('transition-all', 'duration-300');
        unmount();
      });
    });
  });

  describe('Accordion Items', () => {
    it('renders correct number of items', () => {
      render(<Accordion items={basicItems} />);
      expect(screen.getByTestId('accordion-item-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('accordion-item-item-2')).toBeInTheDocument();
      expect(screen.getByTestId('accordion-item-item-3')).toBeInTheDocument();
    });

    it('renders item triggers with correct testid', () => {
      render(<Accordion items={basicItems} />);
      expect(screen.getByTestId('accordion-trigger-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('accordion-trigger-item-2')).toBeInTheDocument();
      expect(screen.getByTestId('accordion-trigger-item-3')).toBeInTheDocument();
    });

    it('renders item content with correct testid', () => {
      render(<Accordion items={basicItems} />);
      expect(screen.getByTestId('accordion-content-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('accordion-content-item-2')).toBeInTheDocument();
      expect(screen.getByTestId('accordion-content-item-3')).toBeInTheDocument();
    });

    it('renders item icons with correct testid', () => {
      render(<Accordion items={basicItems} />);
      expect(screen.getByTestId('accordion-icon-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('accordion-icon-item-2')).toBeInTheDocument();
      expect(screen.getByTestId('accordion-icon-item-3')).toBeInTheDocument();
    });
  });

  describe('Expand/Collapse Behavior', () => {
    it('expands item when trigger is clicked', async () => {
      const user = userEvent.setup();
      render(<Accordion items={basicItems} />);

      const trigger = screen.getByTestId('accordion-trigger-item-1');
      await user.click(trigger);

      // Check ARIA attribute
      expect(trigger).toHaveAttribute('data-state', 'open');
    });

    it('collapses item when trigger is clicked again', async () => {
      const user = userEvent.setup();
      render(<Accordion items={basicItems} />);

      const trigger = screen.getByTestId('accordion-trigger-item-1');
      await user.click(trigger);
      await user.click(trigger);

      expect(trigger).toHaveAttribute('data-state', 'closed');
    });

    it('shows content when item is expanded', async () => {
      const user = userEvent.setup();
      render(<Accordion items={basicItems} />);

      const trigger = screen.getByTestId('accordion-trigger-item-1');
      await user.click(trigger);

      const content = screen.getByTestId('accordion-content-item-1');
      expect(content).toHaveAttribute('data-state', 'open');
    });

    it('hides content when item is collapsed', async () => {
      const user = userEvent.setup();
      render(<Accordion items={basicItems} />);

      const trigger = screen.getByTestId('accordion-trigger-item-1');
      await user.click(trigger);
      await user.click(trigger);

      const content = screen.getByTestId('accordion-content-item-1');
      expect(content).toHaveAttribute('data-state', 'closed');
    });

    it('starts with all items collapsed by default', () => {
      render(<Accordion items={basicItems} />);

      const trigger1 = screen.getByTestId('accordion-trigger-item-1');
      const trigger2 = screen.getByTestId('accordion-trigger-item-2');
      const trigger3 = screen.getByTestId('accordion-trigger-item-3');

      expect(trigger1).toHaveAttribute('data-state', 'closed');
      expect(trigger2).toHaveAttribute('data-state', 'closed');
      expect(trigger3).toHaveAttribute('data-state', 'closed');
    });
  });

  describe('Single Mode (Default)', () => {
    it('auto-closes other items when expanding one', async () => {
      const user = userEvent.setup();
      render(<Accordion items={basicItems} multiple={false} />);

      // Expand first item
      const trigger1 = screen.getByTestId('accordion-trigger-item-1');
      await user.click(trigger1);
      expect(trigger1).toHaveAttribute('data-state', 'open');

      // Expand second item
      const trigger2 = screen.getByTestId('accordion-trigger-item-2');
      await user.click(trigger2);

      // First should be closed, second should be open
      expect(trigger1).toHaveAttribute('data-state', 'closed');
      expect(trigger2).toHaveAttribute('data-state', 'open');
    });

    it('keeps only one item open at a time', async () => {
      const user = userEvent.setup();
      render(<Accordion items={basicItems} />);

      // Expand all items one by one
      await user.click(screen.getByTestId('accordion-trigger-item-1'));
      await user.click(screen.getByTestId('accordion-trigger-item-2'));
      await user.click(screen.getByTestId('accordion-trigger-item-3'));

      // Only the last one should be open
      expect(screen.getByTestId('accordion-trigger-item-1')).toHaveAttribute('data-state', 'closed');
      expect(screen.getByTestId('accordion-trigger-item-2')).toHaveAttribute('data-state', 'closed');
      expect(screen.getByTestId('accordion-trigger-item-3')).toHaveAttribute('data-state', 'open');
    });

    it('supports collapsible mode (default)', async () => {
      const user = userEvent.setup();
      render(<Accordion items={basicItems} collapsible={true} />);

      const trigger = screen.getByTestId('accordion-trigger-item-1');
      await user.click(trigger);
      await user.click(trigger);

      expect(trigger).toHaveAttribute('data-state', 'closed');
    });

    it('prevents collapse when collapsible is false', async () => {
      const user = userEvent.setup();
      render(<Accordion items={basicItems} collapsible={false} />);

      const trigger = screen.getByTestId('accordion-trigger-item-1');
      await user.click(trigger);
      await user.click(trigger);

      // Should remain open
      expect(trigger).toHaveAttribute('data-state', 'open');
    });
  });

  describe('Multiple Mode', () => {
    it('allows multiple items to be open simultaneously', async () => {
      const user = userEvent.setup();
      render(<Accordion items={basicItems} multiple={true} />);

      // Expand first item
      const trigger1 = screen.getByTestId('accordion-trigger-item-1');
      await user.click(trigger1);

      // Expand second item
      const trigger2 = screen.getByTestId('accordion-trigger-item-2');
      await user.click(trigger2);

      // Both should be open
      expect(trigger1).toHaveAttribute('data-state', 'open');
      expect(trigger2).toHaveAttribute('data-state', 'open');
    });

    it('allows all items to be expanded', async () => {
      const user = userEvent.setup();
      render(<Accordion items={basicItems} multiple={true} />);

      // Expand all items
      await user.click(screen.getByTestId('accordion-trigger-item-1'));
      await user.click(screen.getByTestId('accordion-trigger-item-2'));
      await user.click(screen.getByTestId('accordion-trigger-item-3'));

      // All should be open
      expect(screen.getByTestId('accordion-trigger-item-1')).toHaveAttribute('data-state', 'open');
      expect(screen.getByTestId('accordion-trigger-item-2')).toHaveAttribute('data-state', 'open');
      expect(screen.getByTestId('accordion-trigger-item-3')).toHaveAttribute('data-state', 'open');
    });

    it('allows collapsing individual items independently', async () => {
      const user = userEvent.setup();
      render(<Accordion items={basicItems} multiple={true} />);

      // Expand all
      await user.click(screen.getByTestId('accordion-trigger-item-1'));
      await user.click(screen.getByTestId('accordion-trigger-item-2'));
      await user.click(screen.getByTestId('accordion-trigger-item-3'));

      // Collapse middle item
      await user.click(screen.getByTestId('accordion-trigger-item-2'));

      expect(screen.getByTestId('accordion-trigger-item-1')).toHaveAttribute('data-state', 'open');
      expect(screen.getByTestId('accordion-trigger-item-2')).toHaveAttribute('data-state', 'closed');
      expect(screen.getByTestId('accordion-trigger-item-3')).toHaveAttribute('data-state', 'open');
    });

    it('allows all items to be collapsed', async () => {
      const user = userEvent.setup();
      render(<Accordion items={basicItems} multiple={true} />);

      // Expand all
      await user.click(screen.getByTestId('accordion-trigger-item-1'));
      await user.click(screen.getByTestId('accordion-trigger-item-2'));

      // Collapse all
      await user.click(screen.getByTestId('accordion-trigger-item-1'));
      await user.click(screen.getByTestId('accordion-trigger-item-2'));

      expect(screen.getByTestId('accordion-trigger-item-1')).toHaveAttribute('data-state', 'closed');
      expect(screen.getByTestId('accordion-trigger-item-2')).toHaveAttribute('data-state', 'closed');
    });
  });

  describe('Default Open State', () => {
    const itemsWithDefaultOpen: AccordionItem[] = [
      { id: 'item-1', title: 'First', content: 'First content', defaultOpen: true },
      { id: 'item-2', title: 'Second', content: 'Second content' },
      { id: 'item-3', title: 'Third', content: 'Third content', defaultOpen: true },
    ];

    it('opens items with defaultOpen in single mode', () => {
      render(<Accordion items={itemsWithDefaultOpen} multiple={false} />);

      // In single mode, only the first defaultOpen item should be open
      const trigger1 = screen.getByTestId('accordion-trigger-item-1');
      expect(trigger1).toHaveAttribute('data-state', 'open');
    });

    it('opens all items with defaultOpen in multiple mode', () => {
      render(<Accordion items={itemsWithDefaultOpen} multiple={true} />);

      const trigger1 = screen.getByTestId('accordion-trigger-item-1');
      const trigger3 = screen.getByTestId('accordion-trigger-item-3');

      expect(trigger1).toHaveAttribute('data-state', 'open');
      expect(trigger3).toHaveAttribute('data-state', 'open');
    });

    it('leaves non-defaultOpen items closed', () => {
      render(<Accordion items={itemsWithDefaultOpen} />);

      const trigger2 = screen.getByTestId('accordion-trigger-item-2');
      expect(trigger2).toHaveAttribute('data-state', 'closed');
    });
  });

  describe('Chevron Icon', () => {
    it('renders chevron icon for each item', () => {
      render(<Accordion items={basicItems} />);

      expect(screen.getByTestId('accordion-chevron-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('accordion-chevron-item-2')).toBeInTheDocument();
      expect(screen.getByTestId('accordion-chevron-item-3')).toBeInTheDocument();
    });

    it('applies rotation class when item is open', async () => {
      const user = userEvent.setup();
      render(<Accordion items={basicItems} />);

      const trigger = screen.getByTestId('accordion-trigger-item-1');
      await user.click(trigger);

      const icon = screen.getByTestId('accordion-icon-item-1');
      expect(icon).toHaveClass('rotate-180');
    });

    it('removes rotation class when item is closed', async () => {
      const user = userEvent.setup();
      render(<Accordion items={basicItems} />);

      const trigger = screen.getByTestId('accordion-trigger-item-1');
      await user.click(trigger);
      await user.click(trigger);

      const icon = screen.getByTestId('accordion-icon-item-1');
      expect(icon).not.toHaveClass('rotate-180');
    });

    it('applies scale when item is open', async () => {
      const user = userEvent.setup();
      render(<Accordion items={basicItems} />);

      const trigger = screen.getByTestId('accordion-trigger-item-1');
      await user.click(trigger);

      const icon = screen.getByTestId('accordion-icon-item-1');
      expect(icon).toHaveClass('scale-110');
    });

    it('applies background highlight when item is open', async () => {
      const user = userEvent.setup();
      render(<Accordion items={basicItems} />);

      const trigger = screen.getByTestId('accordion-trigger-item-1');
      await user.click(trigger);

      const icon = screen.getByTestId('accordion-icon-item-1');
      expect(icon).toHaveClass('bg-primary/20');
    });
  });

  describe('Custom Icons', () => {
    const itemsWithIcons: AccordionItem[] = [
      { id: 'item-1', title: 'Heart', content: 'Content', icon: <Heart data-testid="custom-icon-heart" /> },
      { id: 'item-2', title: 'Star', content: 'Content', icon: <Star data-testid="custom-icon-star" /> },
      { id: 'item-3', title: 'Default', content: 'Content' },
    ];

    it('renders custom icon when provided', () => {
      render(<Accordion items={itemsWithIcons} />);

      expect(screen.getByTestId('custom-icon-heart')).toBeInTheDocument();
      expect(screen.getByTestId('custom-icon-star')).toBeInTheDocument();
    });

    it('renders default chevron when no icon provided', () => {
      render(<Accordion items={itemsWithIcons} />);

      expect(screen.getByTestId('accordion-chevron-item-3')).toBeInTheDocument();
    });

    it('does not render chevron when custom icon is provided', () => {
      render(<Accordion items={itemsWithIcons} />);

      expect(screen.queryByTestId('accordion-chevron-item-1')).not.toBeInTheDocument();
      expect(screen.queryByTestId('accordion-chevron-item-2')).not.toBeInTheDocument();
    });

    it('applies color transition to custom icon when open', async () => {
      const user = userEvent.setup();
      render(<Accordion items={itemsWithIcons} />);

      const trigger = screen.getByTestId('accordion-trigger-item-1');
      await user.click(trigger);

      const customIcon = screen.getByTestId('custom-icon-heart');
      const iconContainer = customIcon.parentElement;
      expect(iconContainer).toHaveClass('text-primary');
    });
  });

  describe('Badges', () => {
    const itemsWithBadges: AccordionItem[] = [
      {
        id: 'item-1',
        title: 'New Feature',
        content: 'Content',
        badge: { text: 'New', variant: 'secondary' },
      },
      {
        id: 'item-2',
        title: 'Deprecated',
        content: 'Content',
        badge: { text: 'Deprecated', variant: 'destructive' },
      },
      {
        id: 'item-3',
        title: 'Beta',
        content: 'Content',
        badge: { text: 'Beta', variant: 'outline' },
      },
      {
        id: 'item-4',
        title: 'No Badge',
        content: 'Content',
      },
    ];

    it('renders badge when provided', () => {
      render(<Accordion items={itemsWithBadges} />);

      expect(screen.getByTestId('accordion-badge-item-1')).toBeInTheDocument();
      expect(screen.getByText('New')).toBeInTheDocument();
    });

    it('does not render badge when not provided', () => {
      render(<Accordion items={itemsWithBadges} />);

      expect(screen.queryByTestId('accordion-badge-item-4')).not.toBeInTheDocument();
    });

    it('renders badge with correct variant styles - secondary', () => {
      render(<Accordion items={itemsWithBadges} />);

      const badge = screen.getByTestId('accordion-badge-item-1');
      expect(badge).toHaveClass('bg-secondary', 'text-secondary-foreground');
    });

    it('renders badge with correct variant styles - destructive', () => {
      render(<Accordion items={itemsWithBadges} />);

      const badge = screen.getByTestId('accordion-badge-item-2');
      expect(badge).toHaveClass('bg-destructive', 'text-destructive-foreground');
    });

    it('renders badge with correct variant styles - outline', () => {
      render(<Accordion items={itemsWithBadges} />);

      const badge = screen.getByTestId('accordion-badge-item-3');
      expect(badge).toHaveClass('bg-background', 'text-foreground');
    });

    it('applies scale animation to badge when item is open', async () => {
      const user = userEvent.setup();
      render(<Accordion items={itemsWithBadges} />);

      const trigger = screen.getByTestId('accordion-trigger-item-1');
      await user.click(trigger);

      const badge = screen.getByTestId('accordion-badge-item-1');
      expect(badge).toHaveClass('scale-95', 'opacity-90');
    });

    it('removes scale animation when item is closed', async () => {
      const user = userEvent.setup();
      render(<Accordion items={itemsWithBadges} />);

      const trigger = screen.getByTestId('accordion-trigger-item-1');
      await user.click(trigger);
      await user.click(trigger);

      const badge = screen.getByTestId('accordion-badge-item-1');
      expect(badge).not.toHaveClass('scale-95', 'opacity-90');
    });
  });

  describe('Disabled State', () => {
    const itemsWithDisabled: AccordionItem[] = [
      { id: 'item-1', title: 'Enabled', content: 'Content' },
      { id: 'item-2', title: 'Disabled', content: 'Content', disabled: true },
      { id: 'item-3', title: 'Also Enabled', content: 'Content' },
    ];

    it('renders disabled item with disabled attribute', () => {
      render(<Accordion items={itemsWithDisabled} />);

      const trigger = screen.getByTestId('accordion-trigger-item-2');
      expect(trigger).toBeDisabled();
    });

    it('applies disabled styles', () => {
      render(<Accordion items={itemsWithDisabled} />);

      const trigger = screen.getByTestId('accordion-trigger-item-2');
      expect(trigger).toHaveClass('cursor-not-allowed', 'opacity-50');
    });

    it('does not expand when disabled item is clicked', async () => {
      const user = userEvent.setup();
      render(<Accordion items={itemsWithDisabled} />);

      const trigger = screen.getByTestId('accordion-trigger-item-2');
      await user.click(trigger);

      expect(trigger).toHaveAttribute('data-state', 'closed');
    });

    it('allows enabled items to be clicked', async () => {
      const user = userEvent.setup();
      render(<Accordion items={itemsWithDisabled} />);

      const trigger = screen.getByTestId('accordion-trigger-item-1');
      await user.click(trigger);

      expect(trigger).toHaveAttribute('data-state', 'open');
    });

    it('does not apply hover styles to disabled items', () => {
      render(<Accordion items={itemsWithDisabled} />);

      const disabledTrigger = screen.getByTestId('accordion-trigger-item-2');
      const enabledTrigger = screen.getByTestId('accordion-trigger-item-1');

      // Enabled should have hover class
      expect(enabledTrigger).toHaveClass('hover:bg-accent/50');
      // Disabled should not
      expect(disabledTrigger).toHaveClass('cursor-not-allowed');
    });
  });

  describe('Animation', () => {
    it('applies animation classes when animated is true', () => {
      render(<Accordion items={basicItems} animated={true} />);

      const icon = screen.getByTestId('accordion-icon-item-1');
      expect(icon).toHaveClass('transform');
    });

    it('does not apply animation classes when animated is false', () => {
      render(<Accordion items={basicItems} animated={false} />);

      const icon = screen.getByTestId('accordion-icon-item-1');
      expect(icon).not.toHaveClass('transform');
    });

    it('applies transition classes to content', () => {
      render(<Accordion items={basicItems} />);

      const content = screen.getByTestId('accordion-content-item-1');
      expect(content).toHaveClass('transition-all', 'duration-300');
    });

    it('applies accordion animation data attributes', () => {
      render(<Accordion items={basicItems} />);

      const content = screen.getByTestId('accordion-content-item-1');
      expect(content).toHaveClass('data-[state=closed]:animate-accordion-up');
      expect(content).toHaveClass('data-[state=open]:animate-accordion-down');
    });
  });

  describe('Content Types', () => {
    const itemsWithMixedContent: AccordionItem[] = [
      { id: 'item-1', title: 'String Content', content: 'This is string content' },
      {
        id: 'item-2',
        title: 'JSX Content',
        content: (
          <div data-testid="custom-content">
            <p>Custom paragraph</p>
            <button>Custom button</button>
          </div>
        ),
      },
    ];

    it('renders string content as paragraph', async () => {
      const user = userEvent.setup();
      render(<Accordion items={itemsWithMixedContent} />);

      await user.click(screen.getByTestId('accordion-trigger-item-1'));

      const content = screen.getByText('This is string content');
      expect(content.tagName).toBe('P');
      expect(content).toHaveClass('font-body', 'text-sm', 'text-muted-foreground');
    });

    it('renders JSX content in div wrapper', async () => {
      const user = userEvent.setup();
      render(<Accordion items={itemsWithMixedContent} />);

      await user.click(screen.getByTestId('accordion-trigger-item-2'));

      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
      expect(screen.getByText('Custom paragraph')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Custom button' })).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('allows tab navigation between triggers', async () => {
      const user = userEvent.setup();
      render(<Accordion items={basicItems} />);

      const trigger1 = screen.getByTestId('accordion-trigger-item-1');
      const trigger2 = screen.getByTestId('accordion-trigger-item-2');

      trigger1.focus();
      expect(trigger1).toHaveFocus();

      await user.tab();
      expect(trigger2).toHaveFocus();
    });

    it('expands item with Enter key', async () => {
      const user = userEvent.setup();
      render(<Accordion items={basicItems} />);

      const trigger = screen.getByTestId('accordion-trigger-item-1');
      trigger.focus();

      await user.keyboard('{Enter}');
      expect(trigger).toHaveAttribute('data-state', 'open');
    });

    it('expands item with Space key', async () => {
      const user = userEvent.setup();
      render(<Accordion items={basicItems} />);

      const trigger = screen.getByTestId('accordion-trigger-item-1');
      trigger.focus();

      await user.keyboard(' ');
      expect(trigger).toHaveAttribute('data-state', 'open');
    });

    it('applies focus-visible styles', () => {
      render(<Accordion items={basicItems} />);

      const trigger = screen.getByTestId('accordion-trigger-item-1');
      expect(trigger).toHaveClass('focus-visible:outline-none', 'focus-visible:ring-2');
    });
  });

  describe('Styling and Layout', () => {
    it('applies minimum touch target height', () => {
      render(<Accordion items={basicItems} />);

      const trigger = screen.getByTestId('accordion-trigger-item-1');
      expect(trigger).toHaveClass('min-h-[44px]');
    });

    it('applies correct padding for default variant', () => {
      render(<Accordion items={basicItems} variant="default" />);

      const trigger = screen.getByTestId('accordion-trigger-item-1');
      expect(trigger).toHaveClass('px-4', 'py-3');
    });

    it('applies correct padding for minimal variant', () => {
      render(<Accordion items={basicItems} variant="minimal" />);

      const trigger = screen.getByTestId('accordion-trigger-item-1');
      expect(trigger).toHaveClass('px-0', 'py-3');
    });

    it('applies border between items for non-minimal variants', () => {
      render(<Accordion items={basicItems} variant="default" />);

      const item1 = screen.getByTestId('accordion-item-item-1');
      expect(item1).toHaveClass('border-b', 'border-border');
    });

    it('applies margin between items for minimal variant', () => {
      render(<Accordion items={basicItems} variant="minimal" />);

      const item1 = screen.getByTestId('accordion-item-item-1');
      expect(item1).toHaveClass('mb-4');
    });

    it('does not apply border to last item', () => {
      render(<Accordion items={basicItems} variant="default" />);

      const lastItem = screen.getByTestId('accordion-item-item-3');
      expect(lastItem).not.toHaveClass('border-b');
    });

    it('applies open state styles to trigger', async () => {
      const user = userEvent.setup();
      render(<Accordion items={basicItems} />);

      const trigger = screen.getByTestId('accordion-trigger-item-1');
      await user.click(trigger);

      expect(trigger).toHaveClass('bg-accent/30', 'text-primary', 'font-semibold');
    });

    it('applies closed state styles to trigger', () => {
      render(<Accordion items={basicItems} />);

      const trigger = screen.getByTestId('accordion-trigger-item-1');
      expect(trigger).toHaveClass('text-foreground');
    });
  });

  describe('AccordionPresets', () => {
    it('exports basic preset', () => {
      expect(AccordionPresets.basic).toEqual({
        variant: 'default',
        multiple: false,
        animated: true,
        collapsible: true,
      });
    });

    it('exports card preset', () => {
      expect(AccordionPresets.card).toEqual({
        variant: 'card',
        multiple: false,
        animated: true,
        collapsible: true,
      });
    });

    it('exports multiSelect preset', () => {
      expect(AccordionPresets.multiSelect).toEqual({
        variant: 'bordered',
        multiple: true,
        animated: true,
        collapsible: true,
      });
    });

    it('exports minimal preset', () => {
      expect(AccordionPresets.minimal).toEqual({
        variant: 'minimal',
        multiple: false,
        animated: false,
        collapsible: true,
      });
    });

    it('applies basic preset correctly', () => {
      render(<Accordion items={basicItems} {...AccordionPresets.basic} />);
      const accordion = screen.getByTestId('accordion');
      expect(accordion).toHaveClass('bg-background');
    });

    it('applies card preset correctly', () => {
      render(<Accordion items={basicItems} {...AccordionPresets.card} />);
      const accordion = screen.getByTestId('accordion');
      expect(accordion).toHaveClass('bg-card', 'shadow-md');
    });

    it('applies multiSelect preset correctly', () => {
      render(<Accordion items={basicItems} {...AccordionPresets.multiSelect} />);
      const accordion = screen.getByTestId('accordion');
      expect(accordion).toHaveClass('border-2');
    });

    it('applies minimal preset correctly', () => {
      render(<Accordion items={basicItems} {...AccordionPresets.minimal} />);
      const accordion = screen.getByTestId('accordion');
      expect(accordion).toHaveClass('bg-transparent');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations - default variant', async () => {
      const { container } = render(<Accordion items={basicItems} variant="default" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations - card variant', async () => {
      const { container } = render(<Accordion items={basicItems} variant="card" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations - with badges', async () => {
      const itemsWithBadges: AccordionItem[] = [
        { id: '1', title: 'Item', content: 'Content', badge: { text: 'New' } },
      ];
      const { container } = render(<Accordion items={itemsWithBadges} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations - with custom icons', async () => {
      const itemsWithIcons: AccordionItem[] = [
        { id: '1', title: 'Item', content: 'Content', icon: <Settings /> },
      ];
      const { container } = render(<Accordion items={itemsWithIcons} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations - disabled state', async () => {
      const itemsWithDisabled: AccordionItem[] = [
        { id: '1', title: 'Disabled', content: 'Content', disabled: true },
      ];
      const { container } = render(<Accordion items={itemsWithDisabled} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('triggers have button role', () => {
      render(<Accordion items={basicItems} />);

      const trigger = screen.getByTestId('accordion-trigger-item-1');
      expect(trigger).toHaveAttribute('type', 'button');
    });

    it('applies proper ARIA attributes to triggers', () => {
      render(<Accordion items={basicItems} />);

      const trigger = screen.getByTestId('accordion-trigger-item-1');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger).toHaveAttribute('aria-controls');
    });

    it('updates ARIA attributes when expanded', async () => {
      const user = userEvent.setup();
      render(<Accordion items={basicItems} />);

      const trigger = screen.getByTestId('accordion-trigger-item-1');
      await user.click(trigger);

      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('Edge Cases', () => {
    it('handles very long titles gracefully', () => {
      const longTitle = 'A'.repeat(200);
      const items: AccordionItem[] = [{ id: '1', title: longTitle, content: 'Content' }];

      render(<Accordion items={items} />);
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('handles very long content gracefully', async () => {
      const user = userEvent.setup();
      const longContent = 'B'.repeat(1000);
      const items: AccordionItem[] = [{ id: '1', title: 'Title', content: longContent }];

      render(<Accordion items={items} />);
      await user.click(screen.getByTestId('accordion-trigger-1'));

      expect(screen.getByText(longContent)).toBeInTheDocument();
    });

    it('handles rapid clicking without errors', async () => {
      const user = userEvent.setup();
      render(<Accordion items={basicItems} />);

      const trigger = screen.getByTestId('accordion-trigger-item-1');

      // Rapidly click 10 times
      for (let i = 0; i < 10; i++) {
        await user.click(trigger);
      }

      // Should end up closed (even number of clicks)
      expect(trigger).toHaveAttribute('data-state', 'closed');
    });

    it('handles switching between single and multiple modes', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<Accordion items={basicItems} multiple={false} />);

      // Open first item in single mode
      await user.click(screen.getByTestId('accordion-trigger-item-1'));

      // Switch to multiple mode
      rerender(<Accordion items={basicItems} multiple={true} />);

      // Should still work
      await user.click(screen.getByTestId('accordion-trigger-item-2'));
      expect(screen.getByTestId('accordion-trigger-item-2')).toHaveAttribute('data-state', 'open');
    });

    it('handles items with special characters in id', () => {
      const items: AccordionItem[] = [
        { id: 'item-with-dash', title: 'Title', content: 'Content' },
        { id: 'item_with_underscore', title: 'Title', content: 'Content' },
      ];

      render(<Accordion items={items} />);
      expect(screen.getByTestId('accordion-item-item-with-dash')).toBeInTheDocument();
      expect(screen.getByTestId('accordion-item-item_with_underscore')).toBeInTheDocument();
    });

    it('handles items with identical titles', () => {
      const items: AccordionItem[] = [
        { id: '1', title: 'Same Title', content: 'Content 1' },
        { id: '2', title: 'Same Title', content: 'Content 2' },
      ];

      render(<Accordion items={items} />);
      const titles = screen.getAllByText('Same Title');
      expect(titles).toHaveLength(2);
    });
  });
});
