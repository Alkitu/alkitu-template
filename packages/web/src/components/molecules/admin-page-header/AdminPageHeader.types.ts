import type React from 'react';

export interface AdminPageHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Main title of the page
   */
  title: string;

  /**
   * Optional description or subtitle
   */
  description?: string | React.ReactNode;

  /**
   * Optional action buttons or elements to display in the header
   */
  actions?: React.ReactNode;

  /**
   * Optional back navigation link
   */
  backHref?: string;

  /**
   * Label for the back link button
   * @default "Back"
   */
  backLabel?: string;
}
