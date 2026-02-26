'use client';

import React, { useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PaginationProps } from './Pagination.types';

/**
 * Pagination - Atomic Design Molecule
 *
 * Advanced pagination component with multiple variants and full theme integration.
 * Composes: Buttons + Badges + Typography to create a complete pagination control.
 *
 * Features:
 * - 4 variants: default, compact, detailed, simple
 * - First/Last page navigation
 * - Page size selector
 * - Total items display
 * - Configurable sibling/boundary counts
 * - Full keyboard navigation
 * - Theme-reactive with CSS variables
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Pagination
 *   currentPage={1}
 *   totalPages={10}
 *   onPageChange={(page) => console.log(page)}
 * />
 *
 * // Detailed variant with page size
 * <Pagination
 *   variant="detailed"
 *   currentPage={5}
 *   totalPages={20}
 *   totalItems={200}
 *   pageSize={10}
 *   showPageSize
 *   showTotal
 *   onPageChange={handlePageChange}
 *   onPageSizeChange={handlePageSizeChange}
 * />
 *
 * // Compact variant
 * <Pagination
 *   variant="compact"
 *   currentPage={2}
 *   totalPages={5}
 *   onPageChange={handlePageChange}
 * />
 * ```
 */
export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (
    {
      currentPage,
      totalPages,
      onPageChange,
      variant = 'default',
      showFirstLast = true,
      showPageSize = false,
      pageSize = 10,
      onPageSizeChange,
      pageSizeOptions = [5, 10, 20, 50, 100],
      showTotal = false,
      totalItems,
      siblingCount = 1,
      boundaryCount = 1,
      disabled = false,
      className = '',
      previousText = 'Previous',
      nextText = 'Next',
      pageLabel = 'Page',
      ofLabel = 'of',
      showingLabel = 'Showing',
      toLabel = 'to',
      resultsLabel = 'results',
      perPageLabel = 'per page',
      totalLabel = 'Total:',
      pagesLabel = 'Pages:',
    },
    ref,
  ) => {
    // Calculate page range with ellipsis
    const pageRange = useMemo(() => {
      const range: (number | string)[] = [];
      const start = Math.max(1, currentPage - siblingCount);
      const end = Math.min(totalPages, currentPage + siblingCount);

      // Add first boundary
      for (let i = 1; i <= Math.min(boundaryCount, totalPages); i++) {
        range.push(i);
      }

      // Add ellipsis if needed
      if (start > boundaryCount + 2) {
        range.push('start-ellipsis');
      } else if (start === boundaryCount + 2) {
        range.push(boundaryCount + 1);
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        if (i > boundaryCount && i <= totalPages - boundaryCount) {
          range.push(i);
        }
      }

      // Add ellipsis if needed
      if (end < totalPages - boundaryCount - 1) {
        range.push('end-ellipsis');
      } else if (end === totalPages - boundaryCount - 1) {
        range.push(totalPages - boundaryCount);
      }

      // Add last boundary
      for (
        let i = Math.max(totalPages - boundaryCount + 1, boundaryCount + 1);
        i <= totalPages;
        i++
      ) {
        range.push(i);
      }

      // Remove duplicates and sort
      return [...new Set(range)];
    }, [currentPage, totalPages, siblingCount, boundaryCount]);

    // Handlers
    const handlePageChange = (page: number) => {
      if (disabled || page < 1 || page > totalPages || page === currentPage)
        return;
      onPageChange(page);
    };

    const handlePageSizeChange = (newPageSize: number) => {
      if (onPageSizeChange) {
        onPageSizeChange(newPageSize);
      }
    };

    const handleKeyDown = (
      e: React.KeyboardEvent,
      page: number | string,
    ) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (typeof page === 'number') {
          handlePageChange(page);
        }
      }
    };

    // Calculate display info
    const startItem = totalItems ? (currentPage - 1) * pageSize + 1 : 0;
    const endItem = totalItems
      ? Math.min(currentPage * pageSize, totalItems)
      : 0;

    // Base button classes
    const baseButtonClasses = cn(
      'inline-flex items-center justify-center',
      'min-w-10 h-10 px-3',
      'text-sm font-medium',
      'rounded-[var(--radius)]',
      'border border-input',
      'bg-background text-foreground',
      'transition-all duration-200',
      'hover:bg-accent hover:text-accent-foreground hover:scale-105',
      'active:scale-95',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
    );

    const activeButtonClasses = cn(
      baseButtonClasses,
      'bg-primary text-primary-foreground',
      'border-primary',
      'hover:bg-primary/90',
    );

    // Compact variant
    if (variant === 'compact') {
      return (
        <nav
          ref={ref}
          className={cn('flex flex-col items-center gap-4', className)}
          aria-label="Pagination"
          role="navigation"
        >
          <div className="flex flex-wrap items-center justify-center gap-2">
            {/* Previous button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={disabled || currentPage === 1}
              className={cn(baseButtonClasses, 'group')}
              aria-label={`Go to ${previousText} page`}
            >
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:scale-110" />
            </button>

            {/* Current page badge */}
            <div
              className={cn(
                'inline-flex items-center justify-center',
                'min-w-[90px] px-4 py-2',
                'text-sm font-semibold',
                'rounded-[var(--radius)]',
                'bg-primary/10 text-primary',
                'border border-primary/40',
                'backdrop-blur-sm',
              )}
            >
              <span className="text-primary">{currentPage}</span>
              <span className="mx-2 text-muted-foreground">/</span>
              <span className="text-muted-foreground">{totalPages}</span>
            </div>

            {/* Next button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={disabled || currentPage === totalPages}
              className={cn(baseButtonClasses, 'group')}
              aria-label={`Go to ${nextText} page`}
            >
              <ChevronRight className="h-4 w-4 transition-transform group-hover:scale-110" />
            </button>
          </div>
        </nav>
      );
    }

    // Simple variant
    if (variant === 'simple') {
      return (
        <nav
          ref={ref}
          className={cn('flex flex-col items-center gap-4', className)}
          aria-label="Pagination"
          role="navigation"
        >
          <ul className="flex items-center gap-1">
            <li>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={disabled || currentPage === 1}
                className={cn(baseButtonClasses, 'gap-1')}
                aria-label={`Go to ${previousText} page`}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">{previousText}</span>
              </button>
            </li>
            <li>
              <span
                className={cn(
                  'inline-flex items-center justify-center',
                  'px-4 py-2 text-sm',
                  'rounded-[var(--radius)]',
                  'bg-accent/30 text-foreground',
                  'border border-border/40',
                  'backdrop-blur-sm',
                )}
              >
                {pageLabel} {currentPage} {ofLabel} {totalPages}
              </span>
            </li>
            <li>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={disabled || currentPage === totalPages}
                className={cn(baseButtonClasses, 'gap-1')}
                aria-label={`Go to ${nextText} page`}
              >
                <span className="hidden sm:inline">{nextText}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </li>
          </ul>
        </nav>
      );
    }

    // Default and detailed variants
    return (
      <nav
        ref={ref}
        className={cn('flex flex-col items-center gap-4', className)}
        aria-label="Pagination"
        role="navigation"
      >
        {/* Total items info */}
        {showTotal && totalItems && (
          <div
            className={cn(
              'px-4 py-2 text-sm font-medium',
              'text-center text-muted-foreground',
              'rounded-[var(--radius)]',
              'bg-accent/30 border border-border/40',
              'backdrop-blur-sm',
            )}
          >
            <span className="sm:hidden">
              {showingLabel} {startItem} {toLabel} {endItem} {ofLabel}{' '}
              {totalItems.toLocaleString()} {resultsLabel}
            </span>
            <span className="hidden sm:inline">
              {startItem}-{endItem} {ofLabel} {totalItems.toLocaleString()}
            </span>
          </div>
        )}

        {/* Main pagination */}
        <ul className="flex flex-wrap items-center justify-center gap-1">
          {/* First page button */}
          {showFirstLast && currentPage > boundaryCount + 1 && (
            <li className="hidden sm:block">
              <button
                onClick={() => handlePageChange(1)}
                disabled={disabled}
                className={cn(baseButtonClasses, 'group')}
                aria-label="Go to first page"
              >
                <ChevronsLeft className="h-4 w-4 transition-transform group-hover:scale-110" />
              </button>
            </li>
          )}

          {/* Previous button */}
          <li>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={disabled || currentPage === 1}
              className={cn(baseButtonClasses, 'gap-1')}
              aria-label={`Go to ${previousText} page`}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">{previousText}</span>
            </button>
          </li>

          {/* Page numbers */}
          {pageRange.map((page, index) => (
            <li key={index}>
              {typeof page === 'number' ? (
                <button
                  onClick={() => handlePageChange(page)}
                  onKeyDown={(e) => handleKeyDown(e, page)}
                  disabled={disabled}
                  className={
                    page === currentPage
                      ? activeButtonClasses
                      : baseButtonClasses
                  }
                  aria-label={`Go to page ${page}`}
                  aria-current={page === currentPage ? 'page' : undefined}
                >
                  {page}
                </button>
              ) : (
                <span
                  className="flex h-9 w-9 items-center justify-center text-muted-foreground"
                  aria-hidden="true"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More pages</span>
                </span>
              )}
            </li>
          ))}

          {/* Next button */}
          <li>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={disabled || currentPage === totalPages}
              className={cn(baseButtonClasses, 'gap-1')}
              aria-label={`Go to ${nextText} page`}
            >
              <span className="hidden sm:inline">{nextText}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </li>

          {/* Last page button */}
          {showFirstLast && currentPage < totalPages - boundaryCount && (
            <li className="hidden sm:block">
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={disabled}
                className={cn(baseButtonClasses, 'group')}
                aria-label="Go to last page"
              >
                <ChevronsRight className="h-4 w-4 transition-transform group-hover:scale-110" />
              </button>
            </li>
          )}
        </ul>

        {/* Page size selector */}
        {showPageSize && variant === 'detailed' && (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-foreground sm:hidden">
              {showingLabel}:
            </span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              disabled={disabled}
              className={cn(
                'px-3 py-1.5 text-sm',
                'rounded-[var(--radius)]',
                'border border-input',
                'bg-background text-foreground',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                'disabled:opacity-50 disabled:pointer-events-none',
              )}
              aria-label="Select page size"
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span className="text-foreground sm:hidden">{perPageLabel}</span>
          </div>
        )}

        {/* Additional info for detailed variant */}
        {variant === 'detailed' && totalItems && (
          <div className="flex flex-wrap items-center gap-2 text-center">
            <span
              className={cn(
                'inline-flex items-center justify-center',
                'px-3 py-1 text-xs font-medium',
                'rounded-[var(--radius)]',
                'border border-border',
                'bg-background text-foreground',
              )}
            >
              {totalLabel} {totalItems.toLocaleString()}
            </span>
            <span
              className={cn(
                'inline-flex items-center justify-center',
                'px-3 py-1 text-xs font-medium',
                'rounded-[var(--radius)]',
                'border border-border',
                'bg-background text-foreground',
              )}
            >
              {pagesLabel} {totalPages}
            </span>
          </div>
        )}
      </nav>
    );
  },
);

Pagination.displayName = 'Pagination';

// Export preset configurations
export const PaginationPresets = {
  basic: {
    variant: 'default' as const,
    showFirstLast: true,
    showPageSize: false,
    showTotal: false,
    siblingCount: 1,
    boundaryCount: 1,
  },

  compact: {
    variant: 'compact' as const,
    showFirstLast: false,
    showPageSize: false,
    showTotal: false,
  },

  detailed: {
    variant: 'detailed' as const,
    showFirstLast: true,
    showPageSize: true,
    showTotal: true,
    siblingCount: 2,
    boundaryCount: 1,
  },

  simple: {
    variant: 'simple' as const,
    showFirstLast: false,
    showPageSize: false,
    showTotal: false,
  },
} as const;

export default Pagination;
