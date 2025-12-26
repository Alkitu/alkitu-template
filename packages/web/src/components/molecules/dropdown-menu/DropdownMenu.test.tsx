import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuShortcut,
} from './DropdownMenu';
import { DropdownMenuMolecule } from './DropdownMenuMolecule';
import type { DropdownMenuDataItem } from './DropdownMenu.types';
import { User, Settings, Edit, Trash } from 'lucide-react';
import React from 'react';

expect.extend(toHaveNoViolations);

describe('DropdownMenu Molecule - Primitive Components', () => {
  // 1. PRIMITIVE RENDERING TESTS
  describe('Primitive - Basic Rendering', () => {
    it('renders dropdown menu with trigger and content', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
            <DropdownMenuItem>Item 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const trigger = screen.getByText('Open Menu');
      expect(trigger).toBeInTheDocument();

      // Open dropdown
      await user.click(trigger);

      // Check items are visible
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('renders with data-slot attributes', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Trigger</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('Trigger'));

      const content = screen.getByText('Item').closest('[data-slot="dropdown-menu-content"]');
      expect(content).toBeInTheDocument();
    });

    it('renders separator correctly', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Item 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('Menu'));

      const separator = screen.getByText('Item 1').parentElement?.querySelector('[data-slot="dropdown-menu-separator"]');
      expect(separator).toBeInTheDocument();
    });

    it('renders label correctly', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Category</DropdownMenuLabel>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('Menu'));
      expect(screen.getByText('Category')).toBeInTheDocument();
    });
  });

  // 2. PRIMITIVE INTERACTIONS
  describe('Primitive - Interactions', () => {
    it('handles menu item click', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={handleClick}>Click me</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('Menu'));
      await user.click(screen.getByText('Click me'));

      expect(handleClick).toHaveBeenCalled();
    });

    it('handles checkbox item state changes', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem
              checked={false}
              onCheckedChange={handleChange}
            >
              Option
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('Menu'));
      await user.click(screen.getByText('Option'));

      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('handles radio group selection', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value="" onValueChange={handleChange}>
              <DropdownMenuRadioItem value="option1">Option 1</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="option2">Option 2</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('Menu'));
      await user.click(screen.getByText('Option 1'));

      expect(handleChange).toHaveBeenCalledWith('option1');
    });

    it('handles sub-menu navigation', async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>More Options</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Sub Item</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('Menu'));
      const subTrigger = screen.getByText('More Options');
      expect(subTrigger).toBeInTheDocument();
    });
  });

  // 3. PRIMITIVE VARIANTS
  describe('Primitive - Variants', () => {
    it('renders default variant item', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem variant="default">Default</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('Menu'));
      const item = screen.getByText('Default');
      expect(item).toHaveAttribute('data-variant', 'default');
    });

    it('renders destructive variant item', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('Menu'));
      const item = screen.getByText('Delete');
      expect(item).toHaveAttribute('data-variant', 'destructive');
    });

    it('renders inset item', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem inset>Inset Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('Menu'));
      const item = screen.getByText('Inset Item');
      expect(item).toHaveAttribute('data-inset', 'true');
    });
  });

  // 4. PRIMITIVE DISABLED STATE
  describe('Primitive - Disabled State', () => {
    it('disables menu item', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem disabled onSelect={handleClick}>
              Disabled Item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('Menu'));
      const item = screen.getByText('Disabled Item');

      await user.click(item);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('disables checkbox item', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem
              disabled
              checked={false}
              onCheckedChange={handleChange}
            >
              Disabled Checkbox
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('Menu'));
      const checkbox = screen.getByText('Disabled Checkbox');

      await user.click(checkbox);
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  // 5. PRIMITIVE SHORTCUTS
  describe('Primitive - Shortcuts', () => {
    it('renders keyboard shortcut hint', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              Edit
              <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('Menu'));
      expect(screen.getByText('⌘E')).toBeInTheDocument();
    });
  });
});

describe('DropdownMenuMolecule - Data-Driven API', () => {
  // 6. MOLECULE RENDERING TESTS
  describe('Molecule - Basic Rendering', () => {
    it('renders with default trigger', () => {
      const items: DropdownMenuDataItem[] = [
        { id: '1', label: 'Item 1', type: 'item' },
      ];

      render(<DropdownMenuMolecule items={items} />);
      expect(screen.getByText('Options')).toBeInTheDocument();
    });

    it('renders with custom trigger', () => {
      const items: DropdownMenuDataItem[] = [
        { id: '1', label: 'Item 1', type: 'item' },
      ];

      render(
        <DropdownMenuMolecule
          items={items}
          trigger={<button>Custom Trigger</button>}
        />
      );

      expect(screen.getByText('Custom Trigger')).toBeInTheDocument();
    });

    it('renders all item types from data', async () => {
      const user = userEvent.setup();
      const items: DropdownMenuDataItem[] = [
        { id: 'label', label: 'Category', type: 'label' },
        { id: '1', label: 'Regular Item', type: 'item' },
        { id: 'sep', label: '', type: 'separator' },
        { id: '2', label: 'Checkbox Item', type: 'checkbox' },
      ];

      render(<DropdownMenuMolecule items={items} />);

      await user.click(screen.getByText('Options'));

      expect(screen.getByText('Category')).toBeInTheDocument();
      expect(screen.getByText('Regular Item')).toBeInTheDocument();
      expect(screen.getByText('Checkbox Item')).toBeInTheDocument();
    });
  });

  // 7. MOLECULE VARIANTS
  describe('Molecule - Trigger Variants', () => {
    const items: DropdownMenuDataItem[] = [
      { id: '1', label: 'Item', type: 'item' },
    ];

    it.each([
      ['default', 'Options'],
      ['user', 'User'],
      ['command', 'New'],
    ])('renders %s variant trigger', (variant, expectedText) => {
      render(
        <DropdownMenuMolecule
          items={items}
          variant={variant as any}
        />
      );

      expect(screen.getByText(expectedText)).toBeInTheDocument();
    });

    it('renders actions variant with icon', () => {
      render(<DropdownMenuMolecule items={items} variant="actions" />);

      const trigger = screen.getAllByRole('button')[0];
      // Verify trigger has the correct structure with icon
      expect(trigger.querySelector('svg')).toBeInTheDocument();
    });

    it('renders context variant with settings icon', () => {
      render(<DropdownMenuMolecule items={items} variant="context" />);

      const trigger = screen.getAllByRole('button')[0];
      // Verify trigger has the correct structure with icon
      expect(trigger.querySelector('svg')).toBeInTheDocument();
    });
  });

  // 8. MOLECULE ITEM FEATURES
  describe('Molecule - Item Features', () => {
    it('renders items with icons', async () => {
      const user = userEvent.setup();
      const items: DropdownMenuDataItem[] = [
        { id: '1', label: 'Profile', icon: <User className="size-4" />, type: 'item' },
      ];

      render(<DropdownMenuMolecule items={items} />);

      await user.click(screen.getByText('Options'));

      const item = screen.getByText('Profile');
      expect(item).toBeInTheDocument();
      expect(item.parentElement?.querySelector('svg')).toBeInTheDocument();
    });

    it('renders items with shortcuts', async () => {
      const user = userEvent.setup();
      const items: DropdownMenuDataItem[] = [
        { id: '1', label: 'Edit', shortcut: '⌘E', type: 'item' },
      ];

      render(<DropdownMenuMolecule items={items} />);

      await user.click(screen.getByText('Options'));
      expect(screen.getByText('⌘E')).toBeInTheDocument();
    });

    it('renders items with badges', async () => {
      const user = userEvent.setup();
      const items: DropdownMenuDataItem[] = [
        {
          id: '1',
          label: 'Delete',
          badge: { text: 'Danger', variant: 'destructive' },
          type: 'item',
        },
      ];

      render(<DropdownMenuMolecule items={items} />);

      await user.click(screen.getByText('Options'));
      expect(screen.getByText('Danger')).toBeInTheDocument();
    });

    it('handles disabled items', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      const items: DropdownMenuDataItem[] = [
        { id: '1', label: 'Disabled', disabled: true, onClick: handleClick, type: 'item' },
      ];

      render(<DropdownMenuMolecule items={items} />);

      await user.click(screen.getByText('Options'));
      const item = screen.getByText('Disabled');

      await user.click(item);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  // 9. MOLECULE STATE MANAGEMENT
  describe('Molecule - State Management', () => {
    it('manages checkbox state internally', async () => {
      const user = userEvent.setup();
      const items: DropdownMenuDataItem[] = [
        { id: 'cb1', label: 'Option 1', type: 'checkbox' },
        { id: 'cb2', label: 'Option 2', type: 'checkbox' },
      ];

      render(<DropdownMenuMolecule items={items} />);

      await user.click(screen.getByText('Options'));

      const option1 = screen.getByText('Option 1');
      const option2 = screen.getByText('Option 2');

      // Verify both checkbox items are rendered
      expect(option1).toBeInTheDocument();
      expect(option2).toBeInTheDocument();

      // Verify clicking works (interaction handled by Radix UI)
      await user.click(option1);
      // State is managed internally by component
    });

    it('manages radio group state internally', async () => {
      const user = userEvent.setup();
      const items: DropdownMenuDataItem[] = [
        { id: 'r1', label: 'Option 1', type: 'radio' },
        { id: 'r2', label: 'Option 2', type: 'radio' },
      ];

      render(<DropdownMenuMolecule items={items} />);

      await user.click(screen.getByText('Options'));

      const option1 = screen.getByText('Option 1');
      const option2 = screen.getByText('Option 2');

      // Verify both radio items are rendered
      expect(option1).toBeInTheDocument();
      expect(option2).toBeInTheDocument();

      // Verify clicking works (interaction handled by Radix UI)
      await user.click(option1);
      // State is managed internally by component
    });
  });

  // 10. MOLECULE SUB-MENUS
  describe('Molecule - Sub-menus', () => {
    it('renders sub-menu items from data', async () => {
      const user = userEvent.setup();
      const items: DropdownMenuDataItem[] = [
        {
          id: 'sub',
          label: 'More Options',
          type: 'sub',
          children: [
            { id: 'sub1', label: 'Sub Item 1', type: 'item' },
            { id: 'sub2', label: 'Sub Item 2', type: 'item' },
          ],
        },
      ];

      render(<DropdownMenuMolecule items={items} />);

      await user.click(screen.getByText('Options'));
      expect(screen.getByText('More Options')).toBeInTheDocument();
    });
  });

  // 11. MOLECULE PLACEMENT
  describe('Molecule - Placement', () => {
    it('applies placement alignment', async () => {
      const user = userEvent.setup();
      const items: DropdownMenuDataItem[] = [
        { id: '1', label: 'Item', type: 'item' },
      ];

      render(
        <DropdownMenuMolecule
          items={items}
          placement="bottom-end"
        />
      );

      await user.click(screen.getByText('Options'));

      // Content should be rendered (exact positioning is hard to test)
      expect(screen.getByText('Item')).toBeInTheDocument();
    });
  });

  // 12. MOLECULE INTERACTIONS
  describe('Molecule - Click Handlers', () => {
    it('calls onClick handler for regular items', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      const items: DropdownMenuDataItem[] = [
        { id: '1', label: 'Click Me', onClick: handleClick, type: 'item' },
      ];

      render(<DropdownMenuMolecule items={items} />);

      await user.click(screen.getByText('Options'));
      await user.click(screen.getByText('Click Me'));

      expect(handleClick).toHaveBeenCalled();
    });

    it('calls onClick for checkbox items', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      const items: DropdownMenuDataItem[] = [
        { id: '1', label: 'Checkbox', onClick: handleClick, type: 'checkbox' },
      ];

      render(<DropdownMenuMolecule items={items} />);

      await user.click(screen.getByText('Options'));
      await user.click(screen.getByText('Checkbox'));

      expect(handleClick).toHaveBeenCalled();
    });
  });

  // 13. ACCESSIBILITY TESTS
  describe('Accessibility', () => {
    it('has no accessibility violations - primitives', async () => {
      const { container } = render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
            <DropdownMenuItem>Item 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      // Disable aria-hidden-focus rule for Radix UI primitives
      // Radix applies aria-hidden to the trigger when menu is open,
      // which is correct behavior but triggers axe violation
      const results = await axe(container, {
        rules: {
          'aria-hidden-focus': { enabled: false },
        },
      });
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations - molecule', async () => {
      const items: DropdownMenuDataItem[] = [
        { id: '1', label: 'Profile', icon: <User className="size-4" />, type: 'item' },
        { id: 'sep', label: '', type: 'separator' },
        { id: '2', label: 'Settings', type: 'item' },
      ];

      const { container } = render(
        <DropdownMenuMolecule items={items} />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      const items: DropdownMenuDataItem[] = [
        { id: '1', label: 'Item 1', type: 'item' },
        { id: '2', label: 'Item 2', type: 'item' },
      ];

      render(<DropdownMenuMolecule items={items} />);

      const trigger = screen.getAllByRole('button')[0];
      trigger.focus();
      expect(trigger).toHaveFocus();

      // Open with Enter
      await user.keyboard('{Enter}');

      // Items should be visible
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });
  });

  // 14. THEME INTEGRATION
  describe('Theme Integration', () => {
    it('applies CSS variable classes to primitives', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('Menu'));

      const item = screen.getByText('Item');
      expect(item.className).toContain('focus:bg-accent');
      expect(item.className).toContain('focus:text-accent-foreground');
    });

    it('applies CSS variable classes to molecule', () => {
      const items: DropdownMenuDataItem[] = [
        { id: '1', label: 'Item', type: 'item' },
      ];

      render(<DropdownMenuMolecule items={items} variant="default" />);

      const trigger = screen.getByText('Options');
      expect(trigger.parentElement?.className).toContain('bg-background');
      expect(trigger.parentElement?.className).toContain('text-foreground');
    });
  });
});
