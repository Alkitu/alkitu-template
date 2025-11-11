'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Dialog - Design System Primitive
 *
 * A themeable dialog component built on Radix UI primitives.
 * Provides a modal dialog interface with overlay, animations, and accessibility.
 *
 * @example
 * ```tsx
 * <Dialog>
 *   <DialogTrigger>Open Dialog</DialogTrigger>
 *   <DialogContent>
 *     <DialogHeader>
 *       <DialogTitle>Dialog Title</DialogTitle>
 *       <DialogDescription>Dialog description text</DialogDescription>
 *     </DialogHeader>
 *     <div>Dialog content goes here</div>
 *     <DialogFooter>
 *       <DialogClose>Cancel</DialogClose>
 *       <Button>Confirm</Button>
 *     </DialogFooter>
 *   </DialogContent>
 * </Dialog>
 * ```
 */
export const Dialog = DialogPrimitive.Root;

/**
 * DialogTrigger - Button or element that opens the dialog
 */
export const DialogTrigger = DialogPrimitive.Trigger;

/**
 * DialogPortal - Portal container for dialog content
 */
export const DialogPortal = DialogPrimitive.Portal;

/**
 * DialogClose - Button to close the dialog
 */
export const DialogClose = DialogPrimitive.Close;

/**
 * DialogOverlay - Semi-transparent backdrop behind the dialog
 */
export const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    data-slot="dialog-overlay"
    className={cn(
      // Base styles
      'fixed inset-0 z-50',
      // Background
      'bg-black/50',
      // Animations
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className,
    )}
    {...props}
  />
));

DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

/**
 * DialogContent - Main content container for the dialog
 * Includes overlay, content area, and close button
 */
export const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      data-slot="dialog-content"
      className={cn(
        // Positioning
        'fixed top-[50%] left-[50%] z-50',
        'translate-x-[-50%] translate-y-[-50%]',
        // Sizing
        'grid w-full max-w-[calc(100%-2rem)] sm:max-w-lg',
        // Spacing and styling
        'gap-4 rounded-lg border p-6 shadow-lg',
        // Colors
        'bg-background',
        // Animations
        'duration-200',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close
        className={cn(
          // Positioning
          'absolute top-4 right-4',
          // Base styles
          'rounded-xs opacity-70 transition-opacity',
          // Hover and focus
          'hover:opacity-100',
          'focus:ring-2 focus:ring-offset-2 focus:outline-hidden',
          'focus:ring-ring ring-offset-background',
          // States
          'data-[state=open]:bg-accent data-[state=open]:text-muted-foreground',
          'disabled:pointer-events-none',
          // Icon styles
          '[&_svg]:pointer-events-none [&_svg]:shrink-0',
          "[&_svg:not([class*='size-'])]:size-4",
        )}
      >
        <XIcon />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));

DialogContent.displayName = DialogPrimitive.Content.displayName;

/**
 * DialogHeader - Header section for title and description
 */
export const DialogHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="dialog-header"
    className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
    {...props}
  />
));

DialogHeader.displayName = 'DialogHeader';

/**
 * DialogFooter - Footer section for actions
 */
export const DialogFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="dialog-footer"
    className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
    {...props}
  />
));

DialogFooter.displayName = 'DialogFooter';

/**
 * DialogTitle - Title heading for the dialog
 */
export const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    data-slot="dialog-title"
    className={cn('text-lg leading-none font-semibold', className)}
    {...props}
  />
));

DialogTitle.displayName = DialogPrimitive.Title.displayName;

/**
 * DialogDescription - Description text for the dialog
 */
export const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    data-slot="dialog-description"
    className={cn('text-muted-foreground text-sm', className)}
    {...props}
  />
));

DialogDescription.displayName = DialogPrimitive.Description.displayName;
