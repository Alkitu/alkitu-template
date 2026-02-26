'use client';

import * as React from 'react';
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  FileText,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CategoryServiceTreeProps, CategoryWithServices } from './CategoryServiceTree.types';

/**
 * CategoryServiceTree - Hierarchical tree view organism
 *
 * Displays the complete Category → Service → Request hierarchy
 * with collapsible navigation and request statistics.
 *
 * Hierarchy Structure:
 * ```
 * ▼ Category Name (3 services, 15 requests)
 *   ├─ Service 1 [5 pending] [8 ongoing] [Ver →]
 *   ├─ Service 2 [2 pending] [3 ongoing] [Ver →]
 *   └─ Service 3 [0 pending] [4 ongoing] [Ver →]
 * ```
 *
 * Features:
 * - Collapsible category sections
 * - Request stats badges per service
 * - Click handlers for navigation
 * - Loading skeleton states
 * - Responsive layout
 * - Keyboard navigation support
 *
 * @example
 * ```tsx
 * <CategoryServiceTree
 *   data={categoriesWithStats}
 *   onServiceClick={(id) => router.push(`/admin/requests?serviceId=${id}`)}
 *   onCategoryClick={(id) => router.push(`/admin/catalog/categories/${id}`)}
 * />
 * ```
 */
export const CategoryServiceTree = React.forwardRef<HTMLDivElement, CategoryServiceTreeProps>(
  (
    {
      data,
      onServiceClick,
      onCategoryClick,
      expandedCategories: initialExpanded = [],
      showStats = true,
      isLoading = false,
      className,
      ...props
    },
    ref,
  ) => {
    const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(
      new Set(initialExpanded),
    );

    const toggleCategory = (categoryId: string) => {
      setExpandedCategories((prev) => {
        const next = new Set(prev);
        if (next.has(categoryId)) {
          next.delete(categoryId);
        } else {
          next.add(categoryId);
        }
        return next;
      });
    };

    // Loading skeleton
    if (isLoading) {
      return (
        <div
          ref={ref}
          className={cn('space-y-4 animate-pulse', className)}
          {...props}
        >
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-12 bg-muted rounded-[var(--radius-card)]" />
              <div className="ml-8 space-y-2">
                <div className="h-10 bg-muted/60 rounded-[var(--radius-card)]" />
                <div className="h-10 bg-muted/60 rounded-[var(--radius-card)]" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Empty state
    if (!data || data.length === 0) {
      return (
        <div
          ref={ref}
          className={cn(
            'flex items-center justify-center py-12 text-center',
            className,
          )}
          {...props}
        >
          <div>
            <Folder className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">
              No hay categorías disponibles
            </p>
            <p className="text-sm text-muted-foreground/70 mt-2">
              Crea tu primera categoría para comenzar
            </p>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn('space-y-3', className)}
        data-testid="category-service-tree"
        {...props}
      >
        {data.map((category) => {
          const isExpanded = expandedCategories.has(category.id);
          const FolderIcon = isExpanded ? FolderOpen : Folder;
          const ChevronIcon = isExpanded ? ChevronDown : ChevronRight;

          return (
            <div
              key={category.id}
              className="border border-border rounded-[var(--radius-card)] overflow-hidden bg-card"
              data-testid={`category-${category.id}`}
            >
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center gap-3 p-4 hover:bg-accent transition-colors text-left"
                data-testid={`category-toggle-${category.id}`}
                aria-expanded={isExpanded}
                aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${category.name}`}
              >
                <ChevronIcon className="h-5 w-5 text-muted-foreground transition-transform" />
                <FolderIcon className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">
                      {category.name}
                    </span>
                    {showStats && (
                      <span className="text-sm text-muted-foreground">
                        ({category.totalServices}{' '}
                        {category.totalServices === 1 ? 'servicio' : 'servicios'}
                        , {category.totalRequests}{' '}
                        {category.totalRequests === 1 ? 'solicitud' : 'solicitudes'})
                      </span>
                    )}
                  </div>
                </div>
              </button>

              {/* Services List */}
              {isExpanded && (
                <div className="border-t border-border bg-accent/30">
                  {category.services.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No hay servicios en esta categoría
                    </div>
                  ) : (
                    <ul className="divide-y divide-border/50">
                      {category.services.map((service, index) => {
                        const isLast = index === category.services.length - 1;
                        const stats = service.requestStats;

                        return (
                          <li
                            key={service.id}
                            className={cn(
                              'flex items-center gap-3 p-4 hover:bg-accent/50 transition-colors',
                              !isLast && 'border-b border-border/30',
                            )}
                            data-testid={`service-${service.id}`}
                          >
                            {/* Tree connector */}
                            <div className="flex items-center gap-2 text-muted-foreground/40">
                              <span className="text-lg leading-none">
                                {isLast ? '└─' : '├─'}
                              </span>
                            </div>

                            <FileText className="h-4 w-4 text-muted-foreground shrink-0" />

                            {/* Service info */}
                            <div className="flex-1 min-w-0">
                              <button
                                onClick={() =>
                                  onServiceClick && onServiceClick(service.id)
                                }
                                className="text-foreground font-medium hover:text-primary transition-colors truncate block w-full text-left"
                              >
                                {service.name}
                              </button>

                              {/* Stats badges */}
                              {showStats && stats.total > 0 && (
                                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                  {stats.byStatus.PENDING > 0 && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                                      <AlertCircle className="h-3 w-3" />
                                      {stats.byStatus.PENDING} pendiente
                                      {stats.byStatus.PENDING !== 1 && 's'}
                                    </span>
                                  )}
                                  {stats.byStatus.ONGOING > 0 && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                      <Clock className="h-3 w-3" />
                                      {stats.byStatus.ONGOING} en progreso
                                    </span>
                                  )}
                                  {stats.byStatus.COMPLETED > 0 && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                      <CheckCircle2 className="h-3 w-3" />
                                      {stats.byStatus.COMPLETED} completada
                                      {stats.byStatus.COMPLETED !== 1 && 's'}
                                    </span>
                                  )}
                                </div>
                              )}

                              {showStats && stats.total === 0 && (
                                <span className="text-xs text-muted-foreground mt-1 block">
                                  Sin solicitudes
                                </span>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  },
);

CategoryServiceTree.displayName = 'CategoryServiceTree';

export default CategoryServiceTree;
