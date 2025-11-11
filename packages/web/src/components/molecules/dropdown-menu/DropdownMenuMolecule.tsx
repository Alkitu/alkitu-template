'use client';

import React, { useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Settings,
  User,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuCheckboxItem,
  DropdownMenuShortcut,
} from './DropdownMenu';
import type {
  DropdownMenuMoleculeProps,
  DropdownMenuDataItem,
  DropdownMenuPreset,
} from './DropdownMenu.types';

/**
 * DropdownMenuMolecule - Data-driven dropdown menu
 *
 * Advanced dropdown menu with data-driven API for quick implementation.
 * Combines primitives with state management for checkboxes and radio groups.
 *
 * Features:
 * - 5 trigger variants (default, user, actions, context, command)
 * - Sub-menus support
 * - Checkbox and radio items with automatic state management
 * - Icons, badges, and keyboard shortcuts
 * - Full theme integration with CSS variables
 *
 * @example
 * ```tsx
 * const items = [
 *   { id: '1', label: 'Edit', icon: <Edit />, shortcut: '⌘E' },
 *   { id: 'sep', type: 'separator', label: '' },
 *   { id: '2', label: 'Delete', variant: 'destructive' }
 * ];
 *
 * <DropdownMenuMolecule items={items} variant="actions" />
 * ```
 */
export function DropdownMenuMolecule({
  items,
  trigger,
  variant = 'default',
  placement = 'bottom-start',
  disabled = false,
  className = '',
  triggerAsChild = false,
  modal = true,
}: DropdownMenuMoleculeProps) {
  // State for controlled checkbox items
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  // State for controlled radio group
  const [radioValue, setRadioValue] = useState<string>('');

  // Handle checkbox changes
  const handleCheckboxChange = (itemId: string, checked: boolean) => {
    const newCheckedItems = new Set(checkedItems);
    if (checked) {
      newCheckedItems.add(itemId);
    } else {
      newCheckedItems.delete(itemId);
    }
    setCheckedItems(newCheckedItems);
  };

  // Handle radio changes
  const handleRadioChange = (value: string) => {
    setRadioValue(value);
  };

  // Get default trigger based on variant
  const getDefaultTrigger = () => {
    const buttonBaseClasses =
      'inline-flex items-center justify-center gap-2 transition-all rounded-md font-medium outline-hidden';
    const hoverClasses = 'hover:scale-[0.98] active:scale-[0.96]';

    switch (variant) {
      case 'user':
        return (
          <button
            className={`${buttonBaseClasses} ${hoverClasses} bg-transparent text-foreground hover:bg-accent/80 min-h-9 px-3`}
          >
            <User className="size-4 shrink-0" />
            <span className="text-sm font-medium">User</span>
            <ChevronDown className="size-3 shrink-0 opacity-70" />
          </button>
        );

      case 'actions':
        return (
          <button
            className={`${buttonBaseClasses} ${hoverClasses} bg-background text-foreground border border-border hover:bg-accent/80 hover:shadow-md min-h-9 min-w-9 p-2`}
          >
            <MoreHorizontal className="size-4 shrink-0" />
          </button>
        );

      case 'context':
        return (
          <button
            className={`${buttonBaseClasses} ${hoverClasses} bg-transparent text-foreground hover:bg-accent/80 hover:rotate-45 min-h-9 min-w-9 p-2`}
          >
            <Settings className="size-4 shrink-0" />
          </button>
        );

      case 'command':
        return (
          <button
            className={`${buttonBaseClasses} ${hoverClasses} bg-primary text-primary-foreground hover:shadow-lg min-h-9 px-3`}
          >
            <Plus className="size-4 shrink-0" />
            <span className="text-sm">New</span>
            <ChevronDown className="size-3 shrink-0 opacity-80" />
          </button>
        );

      default:
        return (
          <button
            className={`${buttonBaseClasses} ${hoverClasses} bg-background text-foreground border border-border hover:bg-accent/80 hover:shadow-md min-h-10 px-3`}
          >
            <span className="text-sm">Options</span>
            <ChevronDown className="size-4 shrink-0 opacity-70" />
          </button>
        );
    }
  };

  // Render menu items recursively
  const renderMenuItems = (menuItems: DropdownMenuDataItem[]) => {
    return menuItems.map((item, index) => {
      // Separator
      if (item.type === 'separator') {
        return <DropdownMenuSeparator key={`separator-${index}`} />;
      }

      // Label
      if (item.type === 'label') {
        return (
          <DropdownMenuLabel key={item.id} className="uppercase text-xs">
            {item.label}
          </DropdownMenuLabel>
        );
      }

      // Sub-menu
      if (item.type === 'sub' && item.children) {
        return (
          <DropdownMenuSub key={item.id}>
            <DropdownMenuSubTrigger disabled={item.disabled}>
              {item.icon && <span className="shrink-0">{item.icon}</span>}
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-xs opacity-60">{item.badge.text}</span>
              )}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {renderMenuItems(item.children)}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        );
      }

      // Checkbox item
      if (item.type === 'checkbox') {
        const isChecked = checkedItems.has(item.id);
        return (
          <DropdownMenuCheckboxItem
            key={item.id}
            checked={isChecked}
            onCheckedChange={(checked) => handleCheckboxChange(item.id, checked)}
            disabled={item.disabled}
            onSelect={item.onClick}
          >
            {item.icon && <span className="shrink-0">{item.icon}</span>}
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <span className="text-xs opacity-60">{item.badge.text}</span>
            )}
            {item.shortcut && (
              <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
            )}
          </DropdownMenuCheckboxItem>
        );
      }

      // Radio item
      if (item.type === 'radio') {
        return (
          <DropdownMenuRadioItem
            key={item.id}
            value={item.id}
            disabled={item.disabled}
            onSelect={item.onClick}
          >
            {item.icon && <span className="shrink-0">{item.icon}</span>}
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <span className="text-xs opacity-60">{item.badge.text}</span>
            )}
            {item.shortcut && (
              <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
            )}
          </DropdownMenuRadioItem>
        );
      }

      // Default item
      return (
        <DropdownMenuItem
          key={item.id}
          disabled={item.disabled}
          onSelect={item.onClick}
        >
          {item.icon && <span className="shrink-0">{item.icon}</span>}
          <span className="flex-1">{item.label}</span>
          {item.badge && (
            <span className="text-xs opacity-60">{item.badge.text}</span>
          )}
          {item.shortcut && (
            <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
          )}
        </DropdownMenuItem>
      );
    });
  };

  // Check if we have radio items for radio group wrapper
  const hasRadioItems = items.some((item) => item.type === 'radio');

  return (
    <div className={className}>
      <DropdownMenu modal={modal}>
        <DropdownMenuTrigger asChild disabled={disabled}>
          {trigger || getDefaultTrigger()}
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align={placement.includes('end') ? 'end' : 'start'}
          side={placement.includes('top') ? 'top' : 'bottom'}
          className="min-w-[14rem]"
        >
          {hasRadioItems ? (
            <DropdownMenuRadioGroup
              value={radioValue}
              onValueChange={handleRadioChange}
            >
              {renderMenuItems(items)}
            </DropdownMenuRadioGroup>
          ) : (
            renderMenuItems(items)
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

DropdownMenuMolecule.displayName = 'DropdownMenuMolecule';

/**
 * Preset configurations for common dropdown menu patterns
 */
export const DropdownMenuPresets: Record<string, DropdownMenuPreset> = {
  basic: {
    variant: 'default',
    placement: 'bottom-start',
    modal: true,
  },

  user: {
    variant: 'user',
    placement: 'bottom-end',
    modal: true,
  },

  actions: {
    variant: 'actions',
    placement: 'bottom-end',
    modal: false,
  },

  context: {
    variant: 'context',
    placement: 'bottom-start',
    modal: false,
  },

  command: {
    variant: 'command',
    placement: 'bottom-start',
    modal: true,
  },
};

/**
 * Example menu items for common use cases
 */
export const ExampleMenuItems: Record<string, DropdownMenuDataItem[]> = {
  userMenu: [
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="size-4" />,
      type: 'item',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="size-4" />,
      type: 'item',
    },
    { id: 'separator1', label: '', type: 'separator' },
    { id: 'logout', label: 'Sign out', type: 'item' },
  ],

  actionsMenu: [
    { id: 'edit', label: 'Edit', shortcut: '⌘E', type: 'item' },
    { id: 'duplicate', label: 'Duplicate', shortcut: '⌘D', type: 'item' },
    { id: 'separator1', label: '', type: 'separator' },
    {
      id: 'delete',
      label: 'Delete',
      shortcut: '⌘⌫',
      type: 'item',
      badge: { text: 'Danger', variant: 'destructive' },
    },
  ],
};

export default DropdownMenuMolecule;
