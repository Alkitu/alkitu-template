'use client';

import * as React from 'react';
import { useState } from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import {
  CheckIcon,
  ChevronRightIcon,
  CircleIcon,
  ChevronDown,
  MoreHorizontal,
  Plus,
  Settings,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  DropdownMenuRootProps,
  DropdownMenuTriggerProps,
  DropdownMenuContentProps,
  DropdownMenuItemProps,
  DropdownMenuCheckboxItemProps,
  DropdownMenuRadioGroupProps,
  DropdownMenuRadioItemProps,
  DropdownMenuLabelProps,
  DropdownMenuSeparatorProps,
  DropdownMenuShortcutProps,
  DropdownMenuGroupProps,
  DropdownMenuPortalProps,
  DropdownMenuSubProps,
  DropdownMenuSubTriggerProps,
  DropdownMenuSubContentProps,
  DropdownMenuMoleculeProps,
  DropdownMenuDataItem,
  DropdownMenuPreset,
} from './DropdownMenu.types';

/**
 * DropdownMenu - Root component
 *
 * Wrapper for Radix UI DropdownMenu.Root primitive
 *
 * @example
 * ```tsx
 * <DropdownMenu>
 *   <DropdownMenuTrigger>Open</DropdownMenuTrigger>
 *   <DropdownMenuContent>
 *     <DropdownMenuItem>Item 1</DropdownMenuItem>
 *   </DropdownMenuContent>
 * </DropdownMenu>
 * ```
 */
export function DropdownMenu({ ...props }: DropdownMenuRootProps) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

DropdownMenu.displayName = 'DropdownMenu';

/**
 * DropdownMenuPortal - Portal component
 *
 * Renders dropdown content in a portal (outside DOM hierarchy)
 */
export function DropdownMenuPortal({ ...props }: DropdownMenuPortalProps) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  );
}

DropdownMenuPortal.displayName = 'DropdownMenuPortal';

/**
 * DropdownMenuTrigger - Trigger component
 *
 * Button that triggers the dropdown menu
 */
export function DropdownMenuTrigger({ ...props }: DropdownMenuTriggerProps) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  );
}

DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

/**
 * DropdownMenuContent - Content container
 *
 * Container for dropdown menu items with animations and positioning
 */
export function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}: DropdownMenuContentProps) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md',
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

DropdownMenuContent.displayName = 'DropdownMenuContent';

/**
 * DropdownMenuGroup - Group component
 *
 * Groups related menu items together
 */
export function DropdownMenuGroup({ ...props }: DropdownMenuGroupProps) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  );
}

DropdownMenuGroup.displayName = 'DropdownMenuGroup';

/**
 * DropdownMenuItem - Menu item
 *
 * Individual clickable menu item with support for variants and inset
 */
export function DropdownMenuItem({
  className,
  inset,
  variant = 'default',
  ...props
}: DropdownMenuItemProps) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        'focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*=\'text-\'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
        className,
      )}
      {...props}
    />
  );
}

DropdownMenuItem.displayName = 'DropdownMenuItem';

/**
 * DropdownMenuCheckboxItem - Checkbox item
 *
 * Menu item with checkbox indicator
 */
export function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: DropdownMenuCheckboxItemProps) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        'focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
        className,
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem';

/**
 * DropdownMenuRadioGroup - Radio group container
 *
 * Container for radio items with single selection
 */
export function DropdownMenuRadioGroup({ ...props }: DropdownMenuRadioGroupProps) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}

DropdownMenuRadioGroup.displayName = 'DropdownMenuRadioGroup';

/**
 * DropdownMenuRadioItem - Radio item
 *
 * Menu item with radio indicator
 */
export function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: DropdownMenuRadioItemProps) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        'focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
        className,
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

DropdownMenuRadioItem.displayName = 'DropdownMenuRadioItem';

/**
 * DropdownMenuLabel - Label component
 *
 * Non-interactive label for grouping menu items
 */
export function DropdownMenuLabel({
  className,
  inset,
  ...props
}: DropdownMenuLabelProps) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        'px-2 py-1.5 text-sm font-medium data-[inset]:pl-8',
        className,
      )}
      {...props}
    />
  );
}

DropdownMenuLabel.displayName = 'DropdownMenuLabel';

/**
 * DropdownMenuSeparator - Separator component
 *
 * Visual separator between menu items
 */
export function DropdownMenuSeparator({
  className,
  ...props
}: DropdownMenuSeparatorProps) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn('bg-border -mx-1 my-1 h-px', className)}
      {...props}
    />
  );
}

DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

/**
 * DropdownMenuShortcut - Keyboard shortcut hint
 *
 * Displays keyboard shortcut hint in menu item
 */
export function DropdownMenuShortcut({
  className,
  ...props
}: DropdownMenuShortcutProps) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        'text-muted-foreground ml-auto text-xs tracking-widest',
        className,
      )}
      {...props}
    />
  );
}

DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';

/**
 * DropdownMenuSub - Sub-menu container
 *
 * Container for nested sub-menus
 */
export function DropdownMenuSub({ ...props }: DropdownMenuSubProps) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

DropdownMenuSub.displayName = 'DropdownMenuSub';

/**
 * DropdownMenuSubTrigger - Sub-menu trigger
 *
 * Trigger that opens a nested sub-menu
 */
export function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: DropdownMenuSubTriggerProps) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        'focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

DropdownMenuSubTrigger.displayName = 'DropdownMenuSubTrigger';

/**
 * DropdownMenuSubContent - Sub-menu content
 *
 * Content container for nested sub-menu items
 */
export function DropdownMenuSubContent({
  className,
  ...props
}: DropdownMenuSubContentProps) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg',
        className,
      )}
      {...props}
    />
  );
}

DropdownMenuSubContent.displayName = 'DropdownMenuSubContent';

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
        <DropdownMenuTrigger asChild={trigger ? triggerAsChild : true} disabled={disabled}>
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

export default DropdownMenu;
