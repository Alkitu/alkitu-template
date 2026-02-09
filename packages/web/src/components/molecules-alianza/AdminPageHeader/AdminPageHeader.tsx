'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AdminPageHeaderProps } from './AdminPageHeader.types';

/**
 * AdminPageHeader - Consistent header layout for admin pages
 *
 * Provides a standardized header component with title, description, breadcrumbs,
 * actions, and navigation elements. Used across all admin pages for consistency.
 *
 * Features:
 * - Page title with optional icon/badge
 * - Description/subtitle support
 * - Back navigation with animated arrow
 * - Breadcrumb integration
 * - Action buttons area
 * - Custom content slots
 * - Responsive layout
 * - Loading skeleton state
 * - Divider/separator support
 * - Flexible heading levels
 *
 * @example
 * ```tsx
 * <AdminPageHeader
 *   title="User Management"
 *   description="Manage users and permissions"
 *   backHref="/admin/dashboard"
 *   actions={<Button>Create User</Button>}
 * />
 * ```
 *
 * @example With breadcrumbs
 * ```tsx
 * <AdminPageHeader
 *   title="Edit User"
 *   breadcrumbs={
 *     <BreadcrumbNavigation
 *       items={[
 *         { label: 'Dashboard', href: '/admin' },
 *         { label: 'Users', href: '/admin/users' },
 *         { label: 'Edit', current: true }
 *       ]}
 *     />
 *   }
 * />
 * ```
 */
export const AdminPageHeader = React.forwardRef<
  HTMLDivElement,
  AdminPageHeaderProps
>(
  (
    {
      title,
      description,
      actions,
      backHref,
      backLabel = 'Back',
      breadcrumbs,
      headingLevel = 1,
      icon,
      badge,
      showDivider = false,
      loading = false,
      children,
      className,
      titleClassName,
      descriptionClassName,
      actionsClassName,
      ...props
    },
    ref,
  ) => {
    // Dynamic heading component based on headingLevel
    const HeadingTag = `h${headingLevel}` as keyof React.JSX.IntrinsicElements;

    // Skeleton loading state
    if (loading) {
      return (
        <div
          ref={ref}
          className={cn('space-y-4 mb-8 animate-pulse', className)}
          {...props}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3 flex-1">
              {backHref && (
                <div className="h-4 w-16 bg-muted rounded" />
              )}
              <div className="h-8 w-64 bg-muted rounded" />
              {description && (
                <div className="h-4 w-96 bg-muted rounded" />
              )}
            </div>
            {actions && (
              <div className="h-10 w-32 bg-muted rounded" />
            )}
          </div>
          {showDivider && <div className="h-px w-full bg-border" />}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn('space-y-4 mb-8', className)}
        data-testid="admin-page-header"
        {...props}
      >
        {/* Breadcrumbs */}
        {breadcrumbs && (
          <div className="mb-2" data-testid="admin-page-header-breadcrumbs">
            {breadcrumbs}
          </div>
        )}

        {/* Header content */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          {/* Title and description section */}
          <div className="space-y-1 flex-1">
            {/* Back button */}
            {backHref && (
              <Link
                href={backHref}
                className="group flex items-center text-sm text-muted-foreground hover:text-foreground mb-2 transition-colors"
                data-testid="admin-page-header-back"
              >
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                {backLabel}
              </Link>
            )}

            {/* Title with icon and badge */}
            <div className="flex items-center gap-2 flex-wrap">
              {icon && (
                <span
                  className="inline-flex items-center"
                  data-testid="admin-page-header-icon"
                >
                  {icon}
                </span>
              )}
              <HeadingTag
                className={cn(
                  'text-2xl font-bold tracking-tight md:text-3xl text-foreground',
                  titleClassName,
                )}
                data-testid="admin-page-header-title"
              >
                {title}
              </HeadingTag>
              {badge && (
                <span
                  className="inline-flex items-center"
                  data-testid="admin-page-header-badge"
                >
                  {badge}
                </span>
              )}
            </div>

            {/* Description */}
            {description && (
              <div
                className={cn(
                  'text-sm text-muted-foreground md:text-base',
                  descriptionClassName,
                )}
                data-testid="admin-page-header-description"
              >
                {description}
              </div>
            )}
          </div>

          {/* Actions section */}
          {actions && (
            <div
              className={cn(
                'flex flex-wrap items-center gap-2',
                actionsClassName,
              )}
              data-testid="admin-page-header-actions"
            >
              {actions}
            </div>
          )}
        </div>

        {/* Custom children content */}
        {children && (
          <div data-testid="admin-page-header-children">{children}</div>
        )}

        {/* Optional divider */}
        {showDivider && (
          <div
            className="border-t border-border"
            data-testid="admin-page-header-divider"
          />
        )}
      </div>
    );
  },
);

AdminPageHeader.displayName = 'AdminPageHeader';

export default AdminPageHeader;
