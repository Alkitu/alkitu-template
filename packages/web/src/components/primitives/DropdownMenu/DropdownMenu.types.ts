import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import type { ComponentPropsWithoutRef, HTMLAttributes } from 'react';

/**
 * Props for DropdownMenu root component
 */
export type DropdownMenuProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Root
>;

/**
 * Props for DropdownMenuPortal component
 */
export type DropdownMenuPortalProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Portal
>;

/**
 * Props for DropdownMenuTrigger component
 */
export type DropdownMenuTriggerProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Trigger
>;

/**
 * Props for DropdownMenuContent component
 */
export type DropdownMenuContentProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Content
>;

/**
 * Props for DropdownMenuGroup component
 */
export type DropdownMenuGroupProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Group
>;

/**
 * Props for DropdownMenuItem component
 */
export type DropdownMenuItemProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Item
> & {
  inset?: boolean;
  variant?: 'default' | 'destructive';
};

/**
 * Props for DropdownMenuCheckboxItem component
 */
export type DropdownMenuCheckboxItemProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.CheckboxItem
>;

/**
 * Props for DropdownMenuRadioGroup component
 */
export type DropdownMenuRadioGroupProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.RadioGroup
>;

/**
 * Props for DropdownMenuRadioItem component
 */
export type DropdownMenuRadioItemProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.RadioItem
>;

/**
 * Props for DropdownMenuLabel component
 */
export type DropdownMenuLabelProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Label
> & {
  inset?: boolean;
};

/**
 * Props for DropdownMenuSeparator component
 */
export type DropdownMenuSeparatorProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Separator
>;

/**
 * Props for DropdownMenuShortcut component
 */
export type DropdownMenuShortcutProps = HTMLAttributes<HTMLSpanElement>;

/**
 * Props for DropdownMenuSub component
 */
export type DropdownMenuSubProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Sub
>;

/**
 * Props for DropdownMenuSubTrigger component
 */
export type DropdownMenuSubTriggerProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.SubTrigger
> & {
  inset?: boolean;
};

/**
 * Props for DropdownMenuSubContent component
 */
export type DropdownMenuSubContentProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.SubContent
>;
