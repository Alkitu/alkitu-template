'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type {
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps,
  CardActionProps,
} from './Card.types';

/**
 * Card - Atomic Design Molecule
 *
 * A flexible container component with distinct sections (Header, Content, Footer).
 * Composed of multiple atoms to create a cohesive card layout.
 *
 * @example
 * ```tsx
 * <Card variant="elevated" padding="md">
 *   <CardHeader>
 *     <CardTitle>Card Title</CardTitle>
 *     <CardDescription>Card description text</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     <p>Main content goes here</p>
 *   </CardContent>
 *   <CardFooter>
 *     <Button>Action</Button>
 *   </CardFooter>
 * </Card>
 * ```
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', padding = 'md', className, children, style, ...props }, ref) => {
    // Variant classes
    const variantClasses = {
      default: 'border border-border bg-card text-card-foreground',
      bordered: 'border-2 border-border bg-card text-card-foreground',
      elevated:
        'bg-card text-card-foreground shadow-md hover:shadow-lg transition-shadow duration-300',
      flat: 'bg-card text-card-foreground',
    }[variant];

    // Padding classes
    const paddingClasses = {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    }[padding];

    return (
      <div
        ref={ref}
        data-slot="card"
        className={cn(
          'flex flex-col rounded-lg transition-all duration-300',
          variantClasses,
          paddingClasses,
          className,
        )}
        style={{
          borderRadius: 'var(--radius-card, 12px)',
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';

/**
 * CardHeader - Card header section
 *
 * Container for card title, description, and optional actions.
 *
 * @example
 * ```tsx
 * <CardHeader>
 *   <CardTitle>Title</CardTitle>
 *   <CardDescription>Description</CardDescription>
 * </CardHeader>
 * ```
 */
export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card-header"
        className={cn('flex flex-col gap-2', className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

CardHeader.displayName = 'CardHeader';

/**
 * CardTitle - Card title element
 *
 * Heading element for the card title.
 *
 * @example
 * ```tsx
 * <CardTitle>My Card Title</CardTitle>
 * ```
 */
export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        data-slot="card-title"
        className={cn('text-lg font-semibold leading-tight tracking-tight', className)}
        {...props}
      >
        {children}
      </h3>
    );
  },
);

CardTitle.displayName = 'CardTitle';

/**
 * CardDescription - Card description element
 *
 * Paragraph element for the card description.
 *
 * @example
 * ```tsx
 * <CardDescription>This is a description of the card</CardDescription>
 * ```
 */
export const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        data-slot="card-description"
        className={cn('text-sm text-muted-foreground', className)}
        {...props}
      >
        {children}
      </p>
    );
  },
);

CardDescription.displayName = 'CardDescription';

/**
 * CardContent - Card main content area
 *
 * Container for the main content of the card.
 *
 * @example
 * ```tsx
 * <CardContent>
 *   <p>Main content goes here</p>
 * </CardContent>
 * ```
 */
export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card-content"
        className={cn('flex-1', className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

CardContent.displayName = 'CardContent';

/**
 * CardFooter - Card footer section
 *
 * Container for card actions and footer content.
 *
 * @example
 * ```tsx
 * <CardFooter>
 *   <Button>Action</Button>
 * </CardFooter>
 * ```
 */
export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card-footer"
        className={cn('flex items-center gap-2', className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

CardFooter.displayName = 'CardFooter';

/**
 * CardAction - Card action element
 *
 * Action button or element positioned in the header area.
 *
 * @example
 * ```tsx
 * <CardHeader>
 *   <CardTitle>Title</CardTitle>
 *   <CardDescription>Description</CardDescription>
 *   <CardAction>
 *     <Button size="sm">Edit</Button>
 *   </CardAction>
 * </CardHeader>
 * ```
 */
export const CardAction = React.forwardRef<HTMLDivElement, CardActionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card-action"
        className={cn(
          'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

CardAction.displayName = 'CardAction';

export default Card;
