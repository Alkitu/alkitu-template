import type React from 'react';

/**
 * Props for the AdminPageHeader component
 *
 * Provides a consistent header layout for admin pages with title, description,
 * breadcrumbs, actions, and navigation elements.
 */
export interface AdminPageHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Main title of the page (required)
   */
  title: string;

  /**
   * Optional description or subtitle
   * Can be a string or React node for custom formatting
   */
  description?: string | React.ReactNode;

  /**
   * Optional action buttons or elements to display in the header
   * Typically used for primary actions like "Create New" buttons
   */
  actions?: React.ReactNode;

  /**
   * Optional back navigation link
   * When provided, displays a back button with arrow icon
   */
  backHref?: string;

  /**
   * Label for the back link button
   * @default "Back"
   */
  backLabel?: string;

  /**
   * Optional breadcrumb items for navigation
   * Integrates with the Breadcrumb component
   */
  breadcrumbs?: React.ReactNode;

  /**
   * Custom heading level for the title
   * @default 1
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;

  /**
   * Optional icon to display before the title
   */
  icon?: React.ReactNode;

  /**
   * Optional badge to display after the title
   */
  badge?: React.ReactNode;

  /**
   * Whether to show a divider/separator below the header
   * @default false
   */
  showDivider?: boolean;

  /**
   * Loading state for skeleton UI
   * @default false
   */
  loading?: boolean;

  /**
   * Additional content to render in the header
   * Useful for tabs, filters, or other custom elements
   */
  children?: React.ReactNode;

  /**
   * Custom className for the wrapper
   */
  className?: string;

  /**
   * Custom className for the title
   */
  titleClassName?: string;

  /**
   * Custom className for the description
   */
  descriptionClassName?: string;

  /**
   * Custom className for the actions container
   */
  actionsClassName?: string;
}
