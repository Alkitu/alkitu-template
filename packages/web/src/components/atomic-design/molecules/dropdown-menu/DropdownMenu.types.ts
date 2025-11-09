import type * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import type { ReactNode } from 'react';

/**
 * Primitive component types (re-exported for convenience)
 */
export type DropdownMenuRootProps = React.ComponentProps<typeof DropdownMenuPrimitive.Root>;
export type DropdownMenuTriggerProps = React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>;
export type DropdownMenuContentProps = React.ComponentProps<typeof DropdownMenuPrimitive.Content>;
export type DropdownMenuItemProps = React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: 'default' | 'destructive';
};
export type DropdownMenuCheckboxItemProps = React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>;
export type DropdownMenuRadioGroupProps = React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>;
export type DropdownMenuRadioItemProps = React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>;
export type DropdownMenuLabelProps = React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean;
};
export type DropdownMenuSeparatorProps = React.ComponentProps<typeof DropdownMenuPrimitive.Separator>;
export type DropdownMenuShortcutProps = React.ComponentProps<'span'>;
export type DropdownMenuGroupProps = React.ComponentProps<typeof DropdownMenuPrimitive.Group>;
export type DropdownMenuPortalProps = React.ComponentProps<typeof DropdownMenuPrimitive.Portal>;
export type DropdownMenuSubProps = React.ComponentProps<typeof DropdownMenuPrimitive.Sub>;
export type DropdownMenuSubTriggerProps = React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean;
};
export type DropdownMenuSubContentProps = React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>;

/**
 * Data-driven API types (for molecule wrapper)
 */

/**
 * Type of dropdown menu item
 */
export type DropdownMenuItemType = 'item' | 'checkbox' | 'radio' | 'separator' | 'label' | 'sub';

/**
 * Badge configuration for menu items
 */
export interface DropdownMenuItemBadge {
  text: string;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
}

/**
 * Data-driven menu item configuration
 */
export interface DropdownMenuDataItem {
  /**
   * Unique identifier for the item
   */
  id: string;

  /**
   * Type of menu item
   * @default 'item'
   */
  type?: DropdownMenuItemType;

  /**
   * Display label
   */
  label: string;

  /**
   * Icon element to display
   */
  icon?: ReactNode;

  /**
   * Keyboard shortcut hint
   */
  shortcut?: string;

  /**
   * Whether item is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Checked state (for checkbox/radio items)
   */
  checked?: boolean;

  /**
   * Badge to display
   */
  badge?: DropdownMenuItemBadge;

  /**
   * Click handler
   */
  onClick?: () => void;

  /**
   * Sub-menu items (for sub type)
   */
  children?: DropdownMenuDataItem[];
}

/**
 * Variant styles for the dropdown menu molecule
 */
export type DropdownMenuMoleculeVariant = 'default' | 'user' | 'actions' | 'context' | 'command';

/**
 * Placement options for dropdown menu
 */
export type DropdownMenuPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

/**
 * Props for data-driven DropdownMenuMolecule component
 */
export interface DropdownMenuMoleculeProps {
  /**
   * Menu items configuration (data-driven API)
   */
  items: DropdownMenuDataItem[];

  /**
   * Custom trigger element
   * If not provided, a default trigger will be used based on variant
   */
  trigger?: ReactNode;

  /**
   * Visual variant of the dropdown menu
   * @default 'default'
   */
  variant?: DropdownMenuMoleculeVariant;

  /**
   * Placement of the dropdown menu
   * @default 'bottom-start'
   */
  placement?: DropdownMenuPlacement;

  /**
   * Whether the trigger is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Custom className for the container
   */
  className?: string;

  /**
   * Whether the trigger uses asChild pattern
   * @default false
   */
  triggerAsChild?: boolean;

  /**
   * Whether the dropdown is modal (blocks interaction with outside content)
   * @default true
   */
  modal?: boolean;
}

/**
 * Preset configurations for common dropdown menu patterns
 */
export interface DropdownMenuPreset {
  variant: DropdownMenuMoleculeVariant;
  placement: DropdownMenuPlacement;
  modal: boolean;
}
