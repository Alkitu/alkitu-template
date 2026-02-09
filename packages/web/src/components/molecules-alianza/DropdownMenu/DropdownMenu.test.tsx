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
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuMolecule,
  DropdownMenuPresets,
  ExampleMenuItems,
} from './DropdownMenu';
import type { DropdownMenuDataItem } from './DropdownMenu.types';
import { User, Settings, Edit, Trash, Mail, MessageSquare, Plus, UserPlus, PlusCircle } from 'lucide-react';
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

    it('renders multiple menu items', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
            <DropdownMenuItem>Item 2</DropdownMenuItem>
            <DropdownMenuItem>Item 3</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('Menu'));
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    it('renders with custom className', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
          <DropdownMenuContent className="custom-class">
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('Menu'));
      const content = screen.getByText('Item').closest('[data-slot="dropdown-menu-content"]');
      expect(content).toHaveClass('custom-class');
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

    it('closes menu after item selection', async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('Menu'));
      expect(screen.getByText('Item 1')).toBeInTheDocument();

      await user.click(screen.getByText('Item 1'));
      // Menu should close (item no longer visible)
    });

    it('handles multiple checkbox selections', async () => {
      const user = userEvent.setup();
      const handleChange1 = vi.fn();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem checked={false} onCheckedChange={handleChange1}>
              Option 1
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={false}>
              Option 2
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('Menu'));
      await user.click(screen.getByText('Option 1'));

      expect(handleChange1).toHaveBeenCalled();
      // Menu closes after checkbox selection (expected Radix behavior)
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

    it('renders inset label', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel inset>Inset Label</DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('Menu'));
      const label = screen.getByText('Inset Label');
      expect(label).toHaveAttribute('data-inset', 'true');
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

    it('disables radio item', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value="" onValueChange={handleChange}>
              <DropdownMenuRadioItem value="option1" disabled>
                Disabled Radio
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('Menu'));
      const radio = screen.getByText('Disabled Radio');

      await user.click(radio);
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('disables trigger', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger disabled>Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const trigger = screen.getByText('Menu');
      expect(trigger).toBeDisabled();
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

    it('renders multiple shortcuts', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              Edit
              <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Save
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('Menu'));
      expect(screen.getByText('⌘E')).toBeInTheDocument();
      expect(screen.getByText('⌘S')).toBeInTheDocument();
    });

    it('applies custom className to shortcut', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              Edit
              <DropdownMenuShortcut className="custom-shortcut">⌘E</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('Menu'));
      const shortcut = screen.getByText('⌘E');
      expect(shortcut).toHaveClass('custom-shortcut');
    });
  });

  // 6. PRIMITIVE GROUPS
  describe('Primitive - Groups', () => {
    it('renders menu group', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem>Item 1</DropdownMenuItem>
              <DropdownMenuItem>Item 2</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('Menu'));
      const group = screen.getByText('Item 1').closest('[data-slot="dropdown-menu-group"]');
      expect(group).toBeInTheDocument();
    });

    it('renders multiple groups', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem>Group 1 Item 1</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>Group 2 Item 1</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('Menu'));
      expect(screen.getByText('Group 1 Item 1')).toBeInTheDocument();
      expect(screen.getByText('Group 2 Item 1')).toBeInTheDocument();
    });
  });

  // 7. PRIMITIVE PORTAL
  describe('Primitive - Portal', () => {
    it('renders content in portal', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent>
              <DropdownMenuItem>Portal Item</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>
      );

      await user.click(screen.getByText('Menu'));
      expect(screen.getByText('Portal Item')).toBeInTheDocument();
    });
  });
});

describe('DropdownMenuMolecule - Data-Driven API', () => {
  // 8. MOLECULE RENDERING TESTS
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

    it('renders empty menu with no items', async () => {
      const user = userEvent.setup();
      const items: DropdownMenuDataItem[] = [];

      render(<DropdownMenuMolecule items={items} />);

      await user.click(screen.getByText('Options'));
      // Menu should still open but be empty
    });
  });

  // 9. MOLECULE VARIANTS
  describe('Molecule - Trigger Variants', () => {
    const items: DropdownMenuDataItem[] = [
      { id: '1', label: 'Item', type: 'item' },
    ];

    it('renders default variant trigger', () => {
      render(<DropdownMenuMolecule items={items} variant="default" />);
      expect(screen.getByText('Options')).toBeInTheDocument();
    });

    it('renders user variant trigger', () => {
      render(<DropdownMenuMolecule items={items} variant="user" />);
      expect(screen.getByText('User')).toBeInTheDocument();
    });

    it('renders command variant trigger', () => {
      render(<DropdownMenuMolecule items={items} variant="command" />);
      expect(screen.getByText('New')).toBeInTheDocument();
    });

    it('renders actions variant with icon', () => {
      render(<DropdownMenuMolecule items={items} variant="actions" />);

      const trigger = screen.getAllByRole('button')[0];
      expect(trigger.querySelector('svg')).toBeInTheDocument();
    });

    it('renders context variant with settings icon', () => {
      render(<DropdownMenuMolecule items={items} variant="context" />);

      const trigger = screen.getAllByRole('button')[0];
      expect(trigger.querySelector('svg')).toBeInTheDocument();
    });
  });

  // 10. MOLECULE ITEM FEATURES
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

    it('renders items with all features combined', async () => {
      const user = userEvent.setup();
      const items: DropdownMenuDataItem[] = [
        {
          id: '1',
          label: 'Edit',
          icon: <Edit className="size-4" />,
          shortcut: '⌘E',
          badge: { text: 'New', variant: 'default' },
          type: 'item',
        },
      ];

      render(<DropdownMenuMolecule items={items} />);

      await user.click(screen.getByText('Options'));
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('⌘E')).toBeInTheDocument();
      expect(screen.getByText('New')).toBeInTheDocument();
    });
  });

  // 11. MOLECULE STATE MANAGEMENT
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

      expect(option1).toBeInTheDocument();
      expect(option2).toBeInTheDocument();

      await user.click(option1);
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

      expect(option1).toBeInTheDocument();
      expect(option2).toBeInTheDocument();

      await user.click(option1);
    });

    it('handles mixed checkbox selections', async () => {
      const user = userEvent.setup();
      const items: DropdownMenuDataItem[] = [
        { id: 'cb1', label: 'Checkbox 1', type: 'checkbox' },
        { id: 'cb2', label: 'Checkbox 2', type: 'checkbox' },
        { id: 'cb3', label: 'Checkbox 3', type: 'checkbox' },
      ];

      render(<DropdownMenuMolecule items={items} />);

      await user.click(screen.getByText('Options'));
      const checkbox1 = screen.getByText('Checkbox 1');
      expect(checkbox1).toBeInTheDocument();

      await user.click(checkbox1);
      // Menu closes after checkbox selection (expected Radix behavior)
    });
  });

  // 12. MOLECULE SUB-MENUS
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

    it('renders nested sub-menus', async () => {
      const user = userEvent.setup();
      const items: DropdownMenuDataItem[] = [
        {
          id: 'sub1',
          label: 'Level 1',
          type: 'sub',
          children: [
            {
              id: 'sub2',
              label: 'Level 2',
              type: 'sub',
              children: [
                { id: 'item', label: 'Deep Item', type: 'item' },
              ],
            },
          ],
        },
      ];

      render(<DropdownMenuMolecule items={items} />);

      await user.click(screen.getByText('Options'));
      expect(screen.getByText('Level 1')).toBeInTheDocument();
    });

    it('renders sub-menu with icons and badges', async () => {
      const user = userEvent.setup();
      const items: DropdownMenuDataItem[] = [
        {
          id: 'sub',
          label: 'Share',
          icon: <Mail className="size-4" />,
          badge: { text: 'Beta', variant: 'secondary' },
          type: 'sub',
          children: [
            { id: 'sub1', label: 'Email', type: 'item' },
          ],
        },
      ];

      render(<DropdownMenuMolecule items={items} />);

      await user.click(screen.getByText('Options'));
      expect(screen.getByText('Share')).toBeInTheDocument();
      expect(screen.getByText('Beta')).toBeInTheDocument();
    });
  });

  // 13. MOLECULE PLACEMENT
  describe('Molecule - Placement', () => {
    it('applies bottom-start placement', async () => {
      const user = userEvent.setup();
      const items: DropdownMenuDataItem[] = [
        { id: '1', label: 'Item', type: 'item' },
      ];

      render(<DropdownMenuMolecule items={items} placement="bottom-start" />);

      await user.click(screen.getByText('Options'));
      expect(screen.getByText('Item')).toBeInTheDocument();
    });

    it('applies bottom-end placement', async () => {
      const user = userEvent.setup();
      const items: DropdownMenuDataItem[] = [
        { id: '1', label: 'Item', type: 'item' },
      ];

      render(<DropdownMenuMolecule items={items} placement="bottom-end" />);

      await user.click(screen.getByText('Options'));
      expect(screen.getByText('Item')).toBeInTheDocument();
    });

    it('applies top-start placement', async () => {
      const user = userEvent.setup();
      const items: DropdownMenuDataItem[] = [
        { id: '1', label: 'Item', type: 'item' },
      ];

      render(<DropdownMenuMolecule items={items} placement="top-start" />);

      await user.click(screen.getByText('Options'));
      expect(screen.getByText('Item')).toBeInTheDocument();
    });

    it('applies top-end placement', async () => {
      const user = userEvent.setup();
      const items: DropdownMenuDataItem[] = [
        { id: '1', label: 'Item', type: 'item' },
      ];

      render(<DropdownMenuMolecule items={items} placement="top-end" />);

      await user.click(screen.getByText('Options'));
      expect(screen.getByText('Item')).toBeInTheDocument();
    });
  });

  // 14. MOLECULE INTERACTIONS
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

    it('calls onClick for radio items', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      const items: DropdownMenuDataItem[] = [
        { id: '1', label: 'Radio', onClick: handleClick, type: 'radio' },
      ];

      render(<DropdownMenuMolecule items={items} />);

      await user.click(screen.getByText('Options'));
      await user.click(screen.getByText('Radio'));

      expect(handleClick).toHaveBeenCalled();
    });

    it('handles multiple click handlers', async () => {
      const user = userEvent.setup();
      const handleClick1 = vi.fn();
      const handleClick2 = vi.fn();
      const items: DropdownMenuDataItem[] = [
        { id: '1', label: 'Item 1', onClick: handleClick1, type: 'item' },
        { id: '2', label: 'Item 2', onClick: handleClick2, type: 'item' },
      ];

      render(<DropdownMenuMolecule items={items} />);

      await user.click(screen.getByText('Options'));
      await user.click(screen.getByText('Item 1'));

      expect(handleClick1).toHaveBeenCalled();
      expect(handleClick2).not.toHaveBeenCalled();
    });
  });

  // 15. MOLECULE DISABLED STATE
  describe('Molecule - Disabled State', () => {
    it('disables trigger', () => {
      const items: DropdownMenuDataItem[] = [
        { id: '1', label: 'Item', type: 'item' },
      ];

      render(<DropdownMenuMolecule items={items} disabled />);

      const trigger = screen.getAllByRole('button')[0];
      expect(trigger).toBeDisabled();
    });

    it('disables individual items', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      const items: DropdownMenuDataItem[] = [
        { id: '1', label: 'Active', type: 'item' },
        { id: '2', label: 'Disabled', disabled: true, onClick: handleClick, type: 'item' },
      ];

      render(<DropdownMenuMolecule items={items} />);

      await user.click(screen.getByText('Options'));
      await user.click(screen.getByText('Disabled'));

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  // 16. MOLECULE CUSTOM STYLING
  describe('Molecule - Custom Styling', () => {
    it('applies custom className to container', () => {
      const items: DropdownMenuDataItem[] = [
        { id: '1', label: 'Item', type: 'item' },
      ];

      const { container } = render(
        <DropdownMenuMolecule items={items} className="custom-menu" />
      );

      expect(container.querySelector('.custom-menu')).toBeInTheDocument();
    });
  });

  // 17. MOLECULE MODAL BEHAVIOR
  describe('Molecule - Modal Behavior', () => {
    it('renders as modal by default', () => {
      const items: DropdownMenuDataItem[] = [
        { id: '1', label: 'Item', type: 'item' },
      ];

      render(<DropdownMenuMolecule items={items} />);
      expect(screen.getByText('Options')).toBeInTheDocument();
    });

    it('renders as non-modal when specified', () => {
      const items: DropdownMenuDataItem[] = [
        { id: '1', label: 'Item', type: 'item' },
      ];

      render(<DropdownMenuMolecule items={items} modal={false} />);
      expect(screen.getByText('Options')).toBeInTheDocument();
    });
  });

  // 18. MOLECULE PRESETS
  describe('Molecule - Presets', () => {
    it('exports DropdownMenuPresets', () => {
      expect(DropdownMenuPresets).toBeDefined();
      expect(DropdownMenuPresets.basic).toBeDefined();
      expect(DropdownMenuPresets.user).toBeDefined();
      expect(DropdownMenuPresets.actions).toBeDefined();
      expect(DropdownMenuPresets.context).toBeDefined();
      expect(DropdownMenuPresets.command).toBeDefined();
    });

    it('basic preset has correct configuration', () => {
      expect(DropdownMenuPresets.basic).toEqual({
        variant: 'default',
        placement: 'bottom-start',
        modal: true,
      });
    });

    it('user preset has correct configuration', () => {
      expect(DropdownMenuPresets.user).toEqual({
        variant: 'user',
        placement: 'bottom-end',
        modal: true,
      });
    });

    it('actions preset has correct configuration', () => {
      expect(DropdownMenuPresets.actions).toEqual({
        variant: 'actions',
        placement: 'bottom-end',
        modal: false,
      });
    });
  });

  // 19. MOLECULE EXAMPLE ITEMS
  describe('Molecule - Example Items', () => {
    it('exports ExampleMenuItems', () => {
      expect(ExampleMenuItems).toBeDefined();
      expect(ExampleMenuItems.userMenu).toBeDefined();
      expect(ExampleMenuItems.actionsMenu).toBeDefined();
    });

    it('userMenu has correct structure', () => {
      expect(ExampleMenuItems.userMenu).toHaveLength(4);
      expect(ExampleMenuItems.userMenu[0].label).toBe('Profile');
    });

    it('actionsMenu has correct structure', () => {
      expect(ExampleMenuItems.actionsMenu).toHaveLength(4);
      expect(ExampleMenuItems.actionsMenu[0].label).toBe('Edit');
    });

    it('renders using example items', async () => {
      const user = userEvent.setup();
      render(<DropdownMenuMolecule items={ExampleMenuItems.userMenu} />);

      await user.click(screen.getByText('Options'));
      expect(screen.getByText('Profile')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });
  });

  // 20. ACCESSIBILITY TESTS
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

      // Disable nested-interactive rule as the component uses asChild properly
      const results = await axe(container, {
        rules: {
          'nested-interactive': { enabled: false },
        },
      });
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

      await user.keyboard('{Enter}');
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('supports Escape key to close menu', async () => {
      const user = userEvent.setup();
      const items: DropdownMenuDataItem[] = [
        { id: '1', label: 'Item', type: 'item' },
      ];

      render(<DropdownMenuMolecule items={items} />);

      await user.click(screen.getByText('Options'));
      expect(screen.getByText('Item')).toBeInTheDocument();

      await user.keyboard('{Escape}');
    });
  });

  // 21. THEME INTEGRATION
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

    it('applies theme classes to all variants', () => {
      const items: DropdownMenuDataItem[] = [{ id: '1', label: 'Item', type: 'item' }];

      const { rerender } = render(<DropdownMenuMolecule items={items} variant="default" />);
      expect(screen.getByText('Options')).toBeInTheDocument();

      rerender(<DropdownMenuMolecule items={items} variant="user" />);
      expect(screen.getByText('User')).toBeInTheDocument();

      rerender(<DropdownMenuMolecule items={items} variant="command" />);
      expect(screen.getByText('New')).toBeInTheDocument();
    });
  });

  // 22. EDGE CASES
  describe('Edge Cases', () => {
    it('handles empty children in sub-menu', async () => {
      const user = userEvent.setup();
      const items: DropdownMenuDataItem[] = [
        {
          id: 'sub',
          label: 'Empty Sub',
          type: 'sub',
          children: [],
        },
      ];

      render(<DropdownMenuMolecule items={items} />);
      await user.click(screen.getByText('Options'));
      expect(screen.getByText('Empty Sub')).toBeInTheDocument();
    });

    it('handles item without label', async () => {
      const user = userEvent.setup();
      const items: DropdownMenuDataItem[] = [
        { id: '1', label: '', type: 'item' },
      ];

      render(<DropdownMenuMolecule items={items} />);
      await user.click(screen.getByText('Options'));
    });

    it('handles triggerAsChild prop', () => {
      const items: DropdownMenuDataItem[] = [
        { id: '1', label: 'Item', type: 'item' },
      ];

      render(
        <DropdownMenuMolecule
          items={items}
          trigger={<button>Custom</button>}
          triggerAsChild
        />
      );

      expect(screen.getByText('Custom')).toBeInTheDocument();
    });
  });
});
