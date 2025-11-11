'use client';

import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Select - Design System Primitive
 *
 * A themeable select component built on Radix UI primitives.
 * Provides a dropdown selection interface with keyboard navigation and accessibility.
 *
 * @example
 * ```tsx
 * <Select>
 *   <SelectTrigger>
 *     <SelectValue placeholder="Select an option" />
 *   </SelectTrigger>
 *   <SelectContent>
 *     <SelectItem value="option1">Option 1</SelectItem>
 *     <SelectItem value="option2">Option 2</SelectItem>
 *   </SelectContent>
 * </Select>
 * ```
 */
export const Select = SelectPrimitive.Root;

/**
 * SelectGroup - Groups related select items
 */
export const SelectGroup = SelectPrimitive.Group;

/**
 * SelectValue - Displays the selected value or placeholder
 */
export const SelectValue = SelectPrimitive.Value;

/**
 * SelectTrigger - Button that opens the select dropdown
 */
export const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
    size?: 'sm' | 'default';
  }
>(({ className, size = 'default', children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    data-slot="select-trigger"
    data-size={size}
    className={cn(
      // Base styles
      'flex w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm whitespace-nowrap',
      'transition-[color,box-shadow] outline-none',
      // Colors
      'border-input bg-background text-foreground',
      'hover:bg-accent',
      // Placeholder and icon colors
      'data-[placeholder]:text-muted-foreground',
      "[&_svg:not([class*='text-'])]:text-muted-foreground",
      // Focus states
      'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
      // Invalid states
      'aria-invalid:ring-destructive/20 aria-invalid:border-destructive',
      'dark:aria-invalid:ring-destructive/40',
      // Disabled states
      'disabled:cursor-not-allowed disabled:opacity-50',
      // Size variants
      'data-[size=default]:h-9',
      'data-[size=sm]:h-8',
      // Value styling
      '*:data-[slot=select-value]:line-clamp-1',
      '*:data-[slot=select-value]:flex',
      '*:data-[slot=select-value]:items-center',
      '*:data-[slot=select-value]:gap-2',
      // Icon styling
      '[&_svg]:pointer-events-none',
      '[&_svg]:shrink-0',
      "[&_svg:not([class*='size-'])]:size-4",
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDownIcon className="size-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));

SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

/**
 * SelectScrollUpButton - Button to scroll up in the dropdown
 */
export const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    data-slot="select-scroll-up-button"
    className={cn('flex cursor-default items-center justify-center py-1', className)}
    {...props}
  >
    <ChevronUpIcon className="size-4" />
  </SelectPrimitive.ScrollUpButton>
));

SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

/**
 * SelectScrollDownButton - Button to scroll down in the dropdown
 */
export const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    data-slot="select-scroll-down-button"
    className={cn('flex cursor-default items-center justify-center py-1', className)}
    {...props}
  >
    <ChevronDownIcon className="size-4" />
  </SelectPrimitive.ScrollDownButton>
));

SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

/**
 * SelectContent - Dropdown content container
 */
export const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      data-slot="select-content"
      className={cn(
        // Base styles
        'relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem]',
        'origin-(--radix-select-content-transform-origin)',
        'overflow-x-hidden overflow-y-auto rounded-md border shadow-md',
        // Colors
        'bg-popover text-popover-foreground',
        // Animations
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[side=bottom]:slide-in-from-top-2',
        'data-[side=left]:slide-in-from-right-2',
        'data-[side=right]:slide-in-from-left-2',
        'data-[side=top]:slide-in-from-bottom-2',
        // Popper positioning
        position === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className,
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          'p-1',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1',
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));

SelectContent.displayName = SelectPrimitive.Content.displayName;

/**
 * SelectLabel - Label for a group of items
 */
export const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    data-slot="select-label"
    className={cn('text-muted-foreground px-2 py-1.5 text-xs', className)}
    {...props}
  />
));

SelectLabel.displayName = SelectPrimitive.Label.displayName;

/**
 * SelectItem - Individual selectable option
 */
export const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    data-slot="select-item"
    className={cn(
      // Base styles
      'relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm',
      'outline-hidden select-none',
      // Colors
      'focus:bg-accent focus:text-accent-foreground',
      "[&_svg:not([class*='text-'])]:text-muted-foreground",
      // Disabled states
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      // Icon styling
      '[&_svg]:pointer-events-none',
      '[&_svg]:shrink-0',
      "[&_svg:not([class*='size-'])]:size-4",
      // Span styling for content
      '*:[span]:last:flex',
      '*:[span]:last:items-center',
      '*:[span]:last:gap-2',
      className,
    )}
    {...props}
  >
    <span className="absolute right-2 flex size-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <CheckIcon className="size-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));

SelectItem.displayName = SelectPrimitive.Item.displayName;

/**
 * SelectSeparator - Visual separator between items or groups
 */
export const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    data-slot="select-separator"
    className={cn('bg-border pointer-events-none -mx-1 my-1 h-px', className)}
    {...props}
  />
));

SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
