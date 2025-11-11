import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/**
 * Separator style options for breadcrumb
 */
export type BreadcrumbSeparatorVariant = 'chevron' | 'slash' | 'arrow';

/**
 * Size options for breadcrumb
 */
export type BreadcrumbSize = 'sm' | 'md' | 'lg';

/**
 * Individual breadcrumb item data structure
 */
export interface BreadcrumbItemData {
  /**
   * Label for the breadcrumb item
   */
  label: string;

  /**
   * Click handler for the breadcrumb item
   */
  onClick?: () => void;

  /**
   * Whether this item is the current page (not clickable)
   */
  current?: boolean;

  /**
   * Icon to display before the label
   */
  icon?: React.ComponentType<any>;

  /**
   * Custom href for links
   */
  href?: string;
}

/**
 * Props for the root Breadcrumb wrapper component
 */
export interface BreadcrumbProps extends ComponentPropsWithoutRef<'nav'> {
  /**
   * Custom className for the nav element
   */
  className?: string;
}

/**
 * Props for BreadcrumbList component
 */
export interface BreadcrumbListProps extends ComponentPropsWithoutRef<'ol'> {
  /**
   * Custom className for the list
   */
  className?: string;
}

/**
 * Props for BreadcrumbItem component
 */
export interface BreadcrumbItemProps extends ComponentPropsWithoutRef<'li'> {
  /**
   * Custom className for the item
   */
  className?: string;
}

/**
 * Props for BreadcrumbLink component
 */
export interface BreadcrumbLinkProps extends ComponentPropsWithoutRef<'a'> {
  /**
   * Use Slot for custom link components (e.g., Next.js Link)
   */
  asChild?: boolean;

  /**
   * Custom className for the link
   */
  className?: string;
}

/**
 * Props for BreadcrumbPage component
 */
export interface BreadcrumbPageProps extends ComponentPropsWithoutRef<'span'> {
  /**
   * Custom className for the page
   */
  className?: string;
}

/**
 * Props for BreadcrumbSeparator component
 */
export interface BreadcrumbSeparatorProps extends ComponentPropsWithoutRef<'li'> {
  /**
   * Custom separator content
   */
  children?: ReactNode;

  /**
   * Custom className for the separator
   */
  className?: string;
}

/**
 * Props for BreadcrumbEllipsis component
 */
export interface BreadcrumbEllipsisProps extends ComponentPropsWithoutRef<'span'> {
  /**
   * Custom className for the ellipsis
   */
  className?: string;
}

/**
 * Props for simplified data-driven BreadcrumbNavigation component
 */
export interface BreadcrumbNavigationProps {
  /**
   * Array of breadcrumb items
   */
  items: BreadcrumbItemData[];

  /**
   * Separator between items
   * @default 'chevron'
   */
  separator?: BreadcrumbSeparatorVariant | ReactNode;

  /**
   * Maximum items to show before collapsing
   */
  maxItems?: number;

  /**
   * Whether to show home icon for first item
   * @default false
   */
  showHome?: boolean;

  /**
   * Size variant
   * @default 'md'
   */
  size?: BreadcrumbSize;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Custom styles
   */
  style?: React.CSSProperties;
}
