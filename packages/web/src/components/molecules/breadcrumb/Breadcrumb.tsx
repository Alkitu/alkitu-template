'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { ChevronRight, MoreHorizontal, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  BreadcrumbProps,
  BreadcrumbListProps,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbPageProps,
  BreadcrumbSeparatorProps,
  BreadcrumbEllipsisProps,
  BreadcrumbNavigationProps,
  BreadcrumbItemData,
  BreadcrumbSeparatorVariant,
} from './Breadcrumb.types';

/**
 * Breadcrumb - Root wrapper component
 *
 * Container for breadcrumb navigation with proper ARIA attributes.
 *
 * @example
 * ```tsx
 * <Breadcrumb>
 *   <BreadcrumbList>
 *     <BreadcrumbItem>
 *       <BreadcrumbLink href="/">Home</BreadcrumbLink>
 *     </BreadcrumbItem>
 *     <BreadcrumbSeparator />
 *     <BreadcrumbItem>
 *       <BreadcrumbPage>Current</BreadcrumbPage>
 *     </BreadcrumbItem>
 *   </BreadcrumbList>
 * </Breadcrumb>
 * ```
 */
export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        aria-label="breadcrumb"
        data-slot="breadcrumb"
        className={className}
        {...props}
      />
    );
  },
);

Breadcrumb.displayName = 'Breadcrumb';

/**
 * BreadcrumbList - Ordered list container for breadcrumb items
 *
 * @example
 * ```tsx
 * <BreadcrumbList>
 *   <BreadcrumbItem>...</BreadcrumbItem>
 * </BreadcrumbList>
 * ```
 */
export const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  BreadcrumbListProps
>(({ className, ...props }, ref) => {
  return (
    <ol
      ref={ref}
      data-slot="breadcrumb-list"
      className={cn(
        'text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5',
        className,
      )}
      {...props}
    />
  );
});

BreadcrumbList.displayName = 'BreadcrumbList';

/**
 * BreadcrumbItem - Individual breadcrumb item container
 *
 * @example
 * ```tsx
 * <BreadcrumbItem>
 *   <BreadcrumbLink href="/page">Page</BreadcrumbLink>
 * </BreadcrumbItem>
 * ```
 */
export const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  BreadcrumbItemProps
>(({ className, ...props }, ref) => {
  return (
    <li
      ref={ref}
      data-slot="breadcrumb-item"
      className={cn('inline-flex items-center gap-1.5', className)}
      {...props}
    />
  );
});

BreadcrumbItem.displayName = 'BreadcrumbItem';

/**
 * BreadcrumbLink - Link component for breadcrumb items
 *
 * Supports asChild pattern for custom link components (e.g., Next.js Link)
 *
 * @example
 * ```tsx
 * <BreadcrumbLink href="/page">Page Name</BreadcrumbLink>
 *
 * // With Next.js Link
 * <BreadcrumbLink asChild>
 *   <Link href="/page">Page Name</Link>
 * </BreadcrumbLink>
 * ```
 */
export const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  BreadcrumbLinkProps
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : 'a';

  return (
    <Comp
      ref={ref}
      data-slot="breadcrumb-link"
      className={cn('hover:text-foreground transition-colors', className)}
      {...props}
    />
  );
});

BreadcrumbLink.displayName = 'BreadcrumbLink';

/**
 * BreadcrumbPage - Current page indicator (non-clickable)
 *
 * @example
 * ```tsx
 * <BreadcrumbPage>Current Page</BreadcrumbPage>
 * ```
 */
export const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  BreadcrumbPageProps
>(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn('text-foreground font-normal', className)}
      {...props}
    />
  );
});

BreadcrumbPage.displayName = 'BreadcrumbPage';

/**
 * BreadcrumbSeparator - Separator between breadcrumb items
 *
 * @example
 * ```tsx
 * <BreadcrumbSeparator />
 * <BreadcrumbSeparator>/</BreadcrumbSeparator>
 * ```
 */
export const BreadcrumbSeparator = React.forwardRef<
  HTMLLIElement,
  BreadcrumbSeparatorProps
>(({ children, className, ...props }, ref) => {
  return (
    <li
      ref={ref}
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn('[&>svg]:size-3.5', className)}
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  );
});

BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

/**
 * BreadcrumbEllipsis - Ellipsis for collapsed breadcrumb items
 *
 * @example
 * ```tsx
 * <BreadcrumbEllipsis />
 * ```
 */
export const BreadcrumbEllipsis = React.forwardRef<
  HTMLSpanElement,
  BreadcrumbEllipsisProps
>(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn('flex size-9 items-center justify-center', className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More</span>
    </span>
  );
});

BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis';

/**
 * BreadcrumbNavigation - Simplified data-driven breadcrumb component
 *
 * High-level component that combines all breadcrumb primitives with advanced features:
 * - Custom separators (chevron, slash, arrow, or custom React node)
 * - Item collapsing with maxItems
 * - Home icon support
 * - Size variants
 * - Full theme integration
 *
 * @example
 * ```tsx
 * <BreadcrumbNavigation
 *   items={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Products', href: '/products' },
 *     { label: 'Details', current: true }
 *   ]}
 *   separator="chevron"
 *   maxItems={3}
 *   showHome
 *   size="md"
 * />
 * ```
 */
export const BreadcrumbNavigation = React.forwardRef<
  HTMLElement,
  BreadcrumbNavigationProps
>(
  (
    {
      items,
      separator = 'chevron',
      maxItems,
      showHome = false,
      size = 'md',
      className = '',
      style = {},
      ...props
    },
    ref,
  ) => {
    // Get size styles
    const getSizeStyles = () => {
      switch (size) {
        case 'sm':
          return {
            fontSize: '0.75rem', // 12px
            gap: '0.25rem', // 4px
            iconSize: 12,
          };
        case 'lg':
          return {
            fontSize: '1rem', // 16px
            gap: '0.5rem', // 8px
            iconSize: 16,
          };
        default: // md
          return {
            fontSize: '0.875rem', // 14px
            gap: '0.375rem', // 6px
            iconSize: 14,
          };
      }
    };

    const sizeStyles = getSizeStyles();

    // Render separator based on variant
    const renderSeparator = (variant: BreadcrumbSeparatorVariant) => {
      switch (variant) {
        case 'slash':
          return <span className="text-muted-foreground opacity-60">/</span>;
        case 'arrow':
          return <span className="text-muted-foreground opacity-60">→</span>;
        case 'chevron':
        default:
          return (
            <ChevronRight
              className="text-muted-foreground opacity-60"
              style={{ width: sizeStyles.iconSize, height: sizeStyles.iconSize }}
            />
          );
      }
    };

    // Handle item collapsing
    const getDisplayItems = () => {
      if (!maxItems || items.length <= maxItems) {
        return items;
      }

      if (maxItems <= 2) {
        return [
          items[0],
          { label: '...', onClick: undefined, current: false },
          items[items.length - 1],
        ];
      }

      const keepFirst = Math.floor(maxItems / 2);
      const keepLast = maxItems - keepFirst - 1;

      return [
        ...items.slice(0, keepFirst),
        { label: '...', onClick: undefined, current: false },
        ...items.slice(items.length - keepLast),
      ];
    };

    const displayItems = getDisplayItems();

    // Render breadcrumb item
    const renderItem = (item: BreadcrumbItemData, index: number) => {
      const isEllipsis = item.label === '...';
      const isClickable = item.onClick || item.href;
      const isCurrent = item.current;
      const isFirst = index === 0;

      const content = (
        <>
          {isFirst && showHome && (
            <Home
              className="inline-block mr-1"
              style={{ width: sizeStyles.iconSize, height: sizeStyles.iconSize }}
            />
          )}

          {item.icon && !isEllipsis && (
            <item.icon
              className="inline-block mr-1"
              style={{ width: sizeStyles.iconSize, height: sizeStyles.iconSize }}
            />
          )}

          {isEllipsis ? (
            <BreadcrumbEllipsis className="size-auto p-0" />
          ) : (
            <span>{item.label}</span>
          )}
        </>
      );

      if (isCurrent) {
        return <BreadcrumbPage>{content}</BreadcrumbPage>;
      }

      if (item.href) {
        return (
          <BreadcrumbLink
            href={item.href}
            onClick={item.onClick}
          >
            {content}
          </BreadcrumbLink>
        );
      }

      if (isClickable) {
        return (
          <span
            role="button"
            tabIndex={0}
            onClick={item.onClick}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                item.onClick?.();
              }
            }}
            className="hover:text-foreground transition-colors cursor-pointer"
            style={{ background: 'none', border: 'none', padding: 0 }}
          >
            {content}
          </span>
        );
      }

      return <span className="text-muted-foreground">{content}</span>;
    };

    return (
      <Breadcrumb
        ref={ref}
        className={className}
        style={{
          fontSize: sizeStyles.fontSize,
          fontFamily: 'var(--typography-paragraph-font-family, inherit)',
          ...style,
        }}
        {...props}
      >
        <BreadcrumbList style={{ gap: sizeStyles.gap }}>
          {displayItems.map((item, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>{renderItem(item, index)}</BreadcrumbItem>
              {index < displayItems.length - 1 && (
                <BreadcrumbSeparator>
                  {React.isValidElement(separator)
                    ? separator
                    : renderSeparator(separator as BreadcrumbSeparatorVariant)}
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    );
  },
);

BreadcrumbNavigation.displayName = 'BreadcrumbNavigation';

export default Breadcrumb;
