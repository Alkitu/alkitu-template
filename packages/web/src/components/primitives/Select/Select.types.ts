import * as SelectPrimitive from '@radix-ui/react-select';
import type { ComponentPropsWithoutRef, ElementRef } from 'react';

/**
 * Props for Select root component
 */
export type SelectProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Root>;

/**
 * Props for SelectTrigger component
 */
export interface SelectTriggerProps
  extends ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {
  /**
   * Size variant of the select trigger
   * @default 'default'
   */
  size?: 'sm' | 'default';
}

/**
 * Ref type for SelectTrigger
 */
export type SelectTriggerRef = ElementRef<typeof SelectPrimitive.Trigger>;

/**
 * Props for SelectContent component
 */
export type SelectContentProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Content>;

/**
 * Ref type for SelectContent
 */
export type SelectContentRef = ElementRef<typeof SelectPrimitive.Content>;

/**
 * Props for SelectItem component
 */
export type SelectItemProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Item>;

/**
 * Ref type for SelectItem
 */
export type SelectItemRef = ElementRef<typeof SelectPrimitive.Item>;

/**
 * Props for SelectLabel component
 */
export type SelectLabelProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Label>;

/**
 * Ref type for SelectLabel
 */
export type SelectLabelRef = ElementRef<typeof SelectPrimitive.Label>;

/**
 * Props for SelectSeparator component
 */
export type SelectSeparatorProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>;

/**
 * Ref type for SelectSeparator
 */
export type SelectSeparatorRef = ElementRef<typeof SelectPrimitive.Separator>;

/**
 * Props for SelectGroup component
 */
export type SelectGroupProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Group>;

/**
 * Props for SelectValue component
 */
export type SelectValueProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Value>;

/**
 * Props for SelectScrollUpButton component
 */
export type SelectScrollUpButtonProps = ComponentPropsWithoutRef<
  typeof SelectPrimitive.ScrollUpButton
>;

/**
 * Ref type for SelectScrollUpButton
 */
export type SelectScrollUpButtonRef = ElementRef<typeof SelectPrimitive.ScrollUpButton>;

/**
 * Props for SelectScrollDownButton component
 */
export type SelectScrollDownButtonProps = ComponentPropsWithoutRef<
  typeof SelectPrimitive.ScrollDownButton
>;

/**
 * Ref type for SelectScrollDownButton
 */
export type SelectScrollDownButtonRef = ElementRef<typeof SelectPrimitive.ScrollDownButton>;
