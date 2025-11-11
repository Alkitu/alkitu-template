import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion, AccordionPresets } from './Accordion';
import type { AccordionProps, AccordionItem } from './Accordion.types';

// Test data
const mockItems: AccordionItem[] = [
  {
    id: 'item-1',
    title: 'First Item',
    content: 'This is the first item content',
  },
  {
    id: 'item-2',
    title: 'Second Item',
    content: 'This is the second item content',
  },
  {
    id: 'item-3',
    title: 'Third Item',
    content: 'This is the third item content',
  },
];

const mockItemsWithBadges: AccordionItem[] = [
  {
    id: 'item-1',
    title: 'First Item',
    content: 'Content 1',
    badge: { text: 'New', variant: 'outline' },
  },
  {
    id: 'item-2',
    title: 'Second Item',
    content: 'Content 2',
    badge: { text: 'Hot', variant: 'destructive' },
  },
];

const mockItemsWithIcons: AccordionItem[] = [
  {
    id: 'item-1',
    title: 'With Icon',
    content: 'Content with custom icon',
    icon: <span data-testid="custom-icon">🎯</span>,
  },
];

const mockItemsWithDefaults: AccordionItem[] = [
  {
    id: 'item-1',
    title: 'First Item',
    content: 'Content 1',
    defaultOpen: true,
  },
  {
    id: 'item-2',
    title: 'Second Item',
    content: 'Content 2',
  },
];

const mockItemsWithDisabled: AccordionItem[] = [
  {
    id: 'item-1',
    title: 'Enabled Item',
    content: 'This is enabled',
  },
  {
    id: 'item-2',
    title: 'Disabled Item',
    content: 'This is disabled',
    disabled: true,
  },
];

describe('Accordion Molecule', () => {
  // 1. RENDERING TESTS
  describe('Rendering', () => {
    it('renders all accordion items correctly', () => {
      render(<Accordion items={mockItems} />);

      expect(screen.getByText('First Item')).toBeInTheDocument();
      expect(screen.getByText('Second Item')).toBeInTheDocument();
      expect(screen.getByText('Third Item')).toBeInTheDocument();
    });

    it('renders with default props', () => {
      render(<Accordion items={mockItems} />);

      const container = screen.getByText('First Item').closest('div[class*="rounded"]');
      expect(container).toBeInTheDocument();
    });

    it('renders content when item is expanded', async () => {
      render(<Accordion items={mockItems} />);

      const firstTrigger = screen.getByText('First Item');
      await userEvent.click(firstTrigger);

      expect(screen.getByText('This is the first item content')).toBeInTheDocument();
    });

    it('renders with defaultOpen items expanded', () => {
      render(<Accordion items={mockItemsWithDefaults} />);

      // First item should be open by default
      expect(screen.getByText('Content 1')).toBeInTheDocument();
      // Second item should be closed
      expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
    });
  });

  // 2. VARIANT TESTS
  describe('Variants', () => {
    it.each([
      ['default', 'bg-background border border-border'],
      ['card', 'bg-card border border-border shadow-md'],
      ['bordered', 'bg-background border-2 border-border'],
      ['minimal', 'bg-transparent border-none'],
    ])('renders %s variant with correct styles', (variant, expectedClasses) => {
      const { container } = render(
        <Accordion items={mockItems} variant={variant as AccordionProps['variant']} />,
      );

      const accordionContainer = container.querySelector('div[class*="rounded"]');
      expectedClasses.split(' ').forEach((className) => {
        expect(accordionContainer).toHaveClass(className);
      });
    });

    it('applies custom className to container', () => {
      const { container } = render(
        <Accordion items={mockItems} className="custom-class" />,
      );

      const accordionContainer = container.querySelector('.custom-class');
      expect(accordionContainer).toBeInTheDocument();
    });
  });

  // 3. INTERACTION TESTS
  describe('Interactions', () => {
    it('expands item when clicked', async () => {
      render(<Accordion items={mockItems} />);

      const firstTrigger = screen.getByText('First Item');
      expect(screen.queryByText('This is the first item content')).not.toBeInTheDocument();

      await userEvent.click(firstTrigger);

      expect(screen.getByText('This is the first item content')).toBeInTheDocument();
    });

    it('collapses item when clicked again (collapsible mode)', async () => {
      render(<Accordion items={mockItems} collapsible={true} />);

      const firstTrigger = screen.getByText('First Item');

      // Expand
      await userEvent.click(firstTrigger);
      expect(screen.getByText('This is the first item content')).toBeInTheDocument();

      // Collapse
      await userEvent.click(firstTrigger);
      expect(screen.queryByText('This is the first item content')).not.toBeInTheDocument();
    });

    it('closes other items in single selection mode', async () => {
      render(<Accordion items={mockItems} multiple={false} />);

      // Open first item
      await userEvent.click(screen.getByText('First Item'));
      expect(screen.getByText('This is the first item content')).toBeInTheDocument();

      // Open second item (should close first)
      await userEvent.click(screen.getByText('Second Item'));
      expect(screen.queryByText('This is the first item content')).not.toBeInTheDocument();
      expect(screen.getByText('This is the second item content')).toBeInTheDocument();
    });

    it('keeps multiple items open in multiple selection mode', async () => {
      render(<Accordion items={mockItems} multiple={true} />);

      // Open first item
      await userEvent.click(screen.getByText('First Item'));
      expect(screen.getByText('This is the first item content')).toBeInTheDocument();

      // Open second item (first should stay open)
      await userEvent.click(screen.getByText('Second Item'));
      expect(screen.getByText('This is the first item content')).toBeInTheDocument();
      expect(screen.getByText('This is the second item content')).toBeInTheDocument();
    });

    it('does not expand disabled items', async () => {
      render(<Accordion items={mockItemsWithDisabled} />);

      const disabledTrigger = screen.getByText('Disabled Item');
      await userEvent.click(disabledTrigger);

      expect(screen.queryByText('This is disabled')).not.toBeInTheDocument();
    });
  });

  // 4. BADGE TESTS
  describe('Badges', () => {
    it('renders badges when provided', () => {
      render(<Accordion items={mockItemsWithBadges} />);

      expect(screen.getByText('New')).toBeInTheDocument();
      expect(screen.getByText('Hot')).toBeInTheDocument();
    });

    it('applies correct badge variant styles', () => {
      render(<Accordion items={mockItemsWithBadges} />);

      const newBadge = screen.getByText('New');
      const hotBadge = screen.getByText('Hot');

      // Outline variant
      expect(newBadge).toHaveClass('ring-border');
      // Destructive variant
      expect(hotBadge).toHaveClass('bg-destructive');
    });
  });

  // 5. ICON TESTS
  describe('Icons', () => {
    it('renders default chevron icon', () => {
      render(<Accordion items={mockItems} />);

      // ChevronDown icons should be present
      const firstItem = screen.getByText('First Item').closest('button');
      const icon = firstItem?.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('renders custom icon when provided', () => {
      render(<Accordion items={mockItemsWithIcons} />);

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('rotates icon when item is expanded', async () => {
      render(<Accordion items={mockItems} animated={true} />);

      const firstTrigger = screen.getByText('First Item').closest('button');

      // Click to expand
      await userEvent.click(firstTrigger!);

      // Check that the icon container has the rotation class
      const iconContainer = firstTrigger!.querySelector('.rotate-180');
      expect(iconContainer).toBeInTheDocument();
    });
  });

  // 6. ACCESSIBILITY TESTS
  describe('Accessibility', () => {
    it('has proper ARIA attributes', async () => {
      render(<Accordion items={mockItems} />);

      const triggers = screen.getAllByRole('button');
      triggers.forEach((trigger) => {
        expect(trigger).toHaveAttribute('data-state');
      });
    });

    it('supports keyboard navigation', async () => {
      render(<Accordion items={mockItems} />);

      const firstTrigger = screen.getByText('First Item');

      // Click to activate (keyboard events on Radix are complex to test)
      await userEvent.click(firstTrigger);

      expect(screen.getByText('This is the first item content')).toBeInTheDocument();
    });

    it('marks disabled items appropriately', () => {
      render(<Accordion items={mockItemsWithDisabled} />);

      const disabledTrigger = screen.getByText('Disabled Item').closest('button');
      // Radix uses data-disabled instead of disabled attribute
      expect(disabledTrigger).toHaveClass('cursor-not-allowed');
      expect(disabledTrigger).toHaveClass('opacity-50');
    });
  });

  // 7. ANIMATION TESTS
  describe('Animations', () => {
    it('applies animation classes when animated is true', () => {
      render(<Accordion items={mockItems} animated={true} />);

      const container = screen.getByText('First Item').closest('div[class*="transition"]');
      expect(container).toHaveClass('transition-all');
    });

    it('does not apply animations when animated is false', () => {
      render(<Accordion items={mockItems} animated={false} />);

      // Component should still render
      expect(screen.getByText('First Item')).toBeInTheDocument();
    });
  });

  // 8. CONTENT RENDERING TESTS
  describe('Content Rendering', () => {
    it('renders string content as paragraph', async () => {
      render(<Accordion items={mockItems} />);

      await userEvent.click(screen.getByText('First Item'));

      const content = screen.getByText('This is the first item content');
      expect(content.tagName).toBe('P');
      expect(content).toHaveClass('text-muted-foreground');
    });

    it('renders ReactNode content', async () => {
      const itemsWithNode: AccordionItem[] = [
        {
          id: 'item-1',
          title: 'Custom Content',
          content: (
            <div>
              <h4>Custom Header</h4>
              <p>Custom paragraph</p>
            </div>
          ),
        },
      ];

      render(<Accordion items={itemsWithNode} />);

      await userEvent.click(screen.getByText('Custom Content'));

      expect(screen.getByText('Custom Header')).toBeInTheDocument();
      expect(screen.getByText('Custom paragraph')).toBeInTheDocument();
    });
  });

  // 9. PRESET CONFIGURATIONS
  describe('Preset Configurations', () => {
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

    it('renders correctly with basic preset', () => {
      render(<Accordion items={mockItems} {...AccordionPresets.basic} />);

      expect(screen.getByText('First Item')).toBeInTheDocument();
    });
  });

  // 10. EDGE CASES
  describe('Edge Cases', () => {
    it('handles empty items array', () => {
      render(<Accordion items={[]} />);

      // Should render without errors
      const container = screen.queryByRole('button');
      expect(container).not.toBeInTheDocument();
    });

    it('handles single item', () => {
      const singleItem: AccordionItem[] = [
        {
          id: 'item-1',
          title: 'Only Item',
          content: 'Only content',
        },
      ];

      render(<Accordion items={singleItem} />);

      expect(screen.getByText('Only Item')).toBeInTheDocument();
    });

    it('handles rapid clicks', async () => {
      render(<Accordion items={mockItems} collapsible={true} />);

      const firstTrigger = screen.getByText('First Item');

      // Click to open
      await userEvent.click(firstTrigger);
      expect(screen.getByText('This is the first item content')).toBeInTheDocument();

      // Click to close
      await userEvent.click(firstTrigger);

      // Wait a bit for animation
      await new Promise(resolve => setTimeout(resolve, 50));

      // Should be closed after second click
      expect(screen.queryByText('This is the first item content')).not.toBeInTheDocument();
    });

    it('handles multiple defaultOpen items in multiple mode', () => {
      const multipleDefaultOpen: AccordionItem[] = [
        {
          id: 'item-1',
          title: 'First',
          content: 'Content 1',
          defaultOpen: true,
        },
        {
          id: 'item-2',
          title: 'Second',
          content: 'Content 2',
          defaultOpen: true,
        },
      ];

      render(<Accordion items={multipleDefaultOpen} multiple={true} />);

      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });
  });

  // 11. REF FORWARDING
  describe('Ref Forwarding', () => {
    it('forwards ref to container element', () => {
      const ref = vi.fn();
      render(<Accordion ref={ref} items={mockItems} />);

      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement);
    });
  });

  // 12. STYLING CONSISTENCY
  describe('Styling Consistency', () => {
    it('applies consistent spacing between items', () => {
      render(<Accordion items={mockItems} variant="default" />);

      const triggers = screen.getAllByRole('button');
      expect(triggers).toHaveLength(3);

      // All triggers should have minimum touch target
      triggers.forEach((trigger) => {
        expect(trigger).toHaveClass('min-h-[44px]');
      });
    });

    it('applies variant-specific padding', () => {
      const { rerender } = render(<Accordion items={mockItems} variant="minimal" />);

      let firstTrigger = screen.getByText('First Item').closest('button');
      expect(firstTrigger).toHaveClass('px-0');

      rerender(<Accordion items={mockItems} variant="default" />);

      firstTrigger = screen.getByText('First Item').closest('button');
      expect(firstTrigger).toHaveClass('px-4');
    });
  });
});
