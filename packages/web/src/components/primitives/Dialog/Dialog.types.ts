import * as DialogPrimitive from '@radix-ui/react-dialog';
import type { ComponentPropsWithoutRef, ElementRef, HTMLAttributes } from 'react';

/**
 * Props for Dialog root component
 */
export type DialogProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Root>;

/**
 * Props for DialogTrigger component
 */
export type DialogTriggerProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>;

/**
 * Props for DialogPortal component
 */
export type DialogPortalProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Portal>;

/**
 * Props for DialogClose component
 */
export type DialogCloseProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Close>;

/**
 * Props for DialogOverlay component
 */
export type DialogOverlayProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>;

/**
 * Ref type for DialogOverlay
 */
export type DialogOverlayRef = ElementRef<typeof DialogPrimitive.Overlay>;

/**
 * Props for DialogContent component
 */
export type DialogContentProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Content>;

/**
 * Ref type for DialogContent
 */
export type DialogContentRef = ElementRef<typeof DialogPrimitive.Content>;

/**
 * Props for DialogHeader component
 */
export type DialogHeaderProps = HTMLAttributes<HTMLDivElement>;

/**
 * Props for DialogFooter component
 */
export type DialogFooterProps = HTMLAttributes<HTMLDivElement>;

/**
 * Props for DialogTitle component
 */
export type DialogTitleProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Title>;

/**
 * Ref type for DialogTitle
 */
export type DialogTitleRef = ElementRef<typeof DialogPrimitive.Title>;

/**
 * Props for DialogDescription component
 */
export type DialogDescriptionProps = ComponentPropsWithoutRef<
  typeof DialogPrimitive.Description
>;

/**
 * Ref type for DialogDescription
 */
export type DialogDescriptionRef = ElementRef<typeof DialogPrimitive.Description>;
