'use client';

import React from 'react';
import { Folder, Edit, Trash2, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/molecules-alianza/Card';
import { Badge } from '@/components/atoms-alianza/Badge';
import { Button } from '@/components/molecules-alianza/Button';
import { Spinner } from '@/components/atoms-alianza/Spinner';
import type { CategoryCardProps, CategoryIconVariant } from './CategoryCard.types';

/**
 * CategoryCard - Atomic Design Molecule
 *
 * A versatile card component for displaying category information with optional actions.
 * Integrates with Alianza design system components (Card, Badge, Button).
 *
 * Features:
 * - Category name and optional description
 * - Item count badge with Package icon
 * - Customizable category icon with color variants
 * - Edit and delete action buttons
 * - Loading state for async operations
 * - Clickable card with onClick handler
 * - Optional asChild for link wrapping
 * - Creation date display
 * - Hover effects and transitions
 * - Theme integration with CSS variables
 * - Full accessibility support
 *
 * @example
 * ```tsx
 * // Basic usage
 * <CategoryCard
 *   category={category}
 *   showCount
 *   showDate
 * />
 *
 * // With actions
 * <CategoryCard
 *   category={category}
 *   showEdit
 *   showDelete
 *   onEdit={(cat) => handleEdit(cat)}
 *   onDelete={(cat) => handleDelete(cat)}
 * />
 *
 * // Clickable card
 * <CategoryCard
 *   category={category}
 *   onClick={(cat) => navigate(`/categories/${cat.id}`)}
 * />
 *
 * // As clickable card
 * <CategoryCard
 *   category={category}
 *   onClick={(cat) => navigate(`/categories/${cat.id}`)}
 * />
 *
 * // Custom icon and variant
 * <CategoryCard
 *   category={category}
 *   icon={<Star />}
 *   iconVariant="warning"
 * />
 * ```
 */
export const CategoryCard = React.forwardRef<HTMLDivElement, CategoryCardProps>(
  (props, ref) => {
    const {
      category,
      icon,
      iconVariant = 'primary',
      showEdit = false,
      showDelete = false,
      onClick,
      onEdit,
      onDelete,
      isDeleting = false,
      disabled = false,
      showCount = true,
      showDate = true,
      className,
      ...restProps
    } = props;

    const serviceCount = category._count?.services ?? 0;
    const hasServices = serviceCount > 0;
    const isInteractive = !!onClick;

    // Icon background color variants
    const iconVariantClasses: Record<CategoryIconVariant, string> = {
      default: 'bg-muted text-muted-foreground',
      primary: 'bg-primary/10 text-primary',
      secondary: 'bg-secondary/10 text-secondary',
      success: 'bg-success/10 text-success',
      warning: 'bg-warning/10 text-warning',
      error: 'bg-destructive/10 text-destructive',
    };

    const formatDate = (date: string | Date): string => {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString();
    };

    const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
      // Don't trigger card click if clicking on action buttons
      const target = e.target as HTMLElement;
      const isButton = target.closest('button');
      if (!isButton && onClick && !disabled) {
        onClick(category);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if ((e.key === 'Enter' || e.key === ' ') && onClick && !disabled) {
        e.preventDefault();
        onClick(category);
      }
    };

    return (
      <Card
        ref={ref}
        variant="elevated"
        padding="md"
        className={cn(
          'transition-all duration-200',
          isInteractive && !disabled && 'cursor-pointer hover:shadow-lg',
          disabled && 'opacity-50 cursor-not-allowed',
          className,
        )}
        onClick={isInteractive ? handleCardClick : undefined}
        onKeyDown={isInteractive ? handleKeyDown : undefined}
        tabIndex={isInteractive && !disabled ? 0 : undefined}
        role={isInteractive ? 'button' : undefined}
        aria-disabled={disabled}
        data-testid="category-card"
        {...restProps}
      >
        <div className="flex items-start justify-between gap-4">
          {/* Left section: Icon and Info */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Category Icon */}
            <div
              className={cn(
                'flex-shrink-0 rounded-full p-2 transition-colors',
                iconVariantClasses[iconVariant as CategoryIconVariant],
              )}
              aria-hidden="true"
            >
              {icon || <Folder className="h-5 w-5" />}
            </div>

            {/* Category Info */}
            <div className="flex-1 min-w-0">
              {/* Category Name */}
              <h3 className="font-semibold text-base text-foreground truncate">
                {category.name}
              </h3>

              {/* Category Description (if provided) */}
              {category.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {category.description}
                </p>
              )}

              {/* Service Count */}
              {showCount && (
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant="outline"
                    size="sm"
                    icon={<Package className="h-3 w-3" />}
                  >
                    {serviceCount} {serviceCount === 1 ? 'service' : 'services'}
                  </Badge>
                </div>
              )}

              {/* Created Date */}
              {showDate && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Created {formatDate(category.createdAt)}
                </div>
              )}
            </div>
          </div>

          {/* Right section: Action Buttons */}
          {(showEdit || showDelete) && (
            <div className="flex gap-2 flex-shrink-0">
              {showEdit && onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  iconOnly
                  iconLeft={<Edit className="h-4 w-4" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(category);
                  }}
                  disabled={isDeleting || disabled}
                  aria-label={`Edit ${category.name}`}
                  className="h-8 w-8"
                />
              )}

              {showDelete && onDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  iconOnly
                  iconLeft={
                    isDeleting ? (
                      <Spinner size="xs" variant="destructive" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(category);
                  }}
                  disabled={isDeleting || hasServices || disabled}
                  aria-label={
                    hasServices
                      ? `Cannot delete ${category.name} - has ${serviceCount} services`
                      : `Delete ${category.name}`
                  }
                  title={
                    hasServices
                      ? `Cannot delete category with services. Delete or reassign services first.`
                      : `Delete ${category.name}`
                  }
                  className={cn(
                    'h-8 w-8',
                    !hasServices &&
                      !isDeleting &&
                      'text-destructive hover:bg-destructive/10',
                  )}
                />
              )}
            </div>
          )}
        </div>
      </Card>
    );
  },
);

CategoryCard.displayName = 'CategoryCard';

export default CategoryCard;
