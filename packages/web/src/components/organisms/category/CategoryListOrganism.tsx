'use client';

import React, { useState } from 'react';
import { Button } from '@/components/primitives/ui/button';
import {
  Plus,
  AlertCircle,
  Loader2,
  FolderPlus,
  Folder,
  ChevronRight,
  Package,
  Pencil,
  Trash2,
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/primitives/ui/collapsible';
import { CategoryFormOrganism } from './CategoryFormOrganism';
import type {
  CategoryListOrganismProps,
  CategoryListState,
} from './CategoryListOrganism.types';
import type { Category } from '@/components/molecules-alianza/CategoryCard';
import { trpc } from '@/lib/trpc';

/**
 * Lazy-loaded service list for an expanded category.
 * Fetches services on-demand when the category is expanded.
 */
function CategoryServicesList({ categoryId }: { categoryId: string }) {
  const { data, isLoading } = trpc.category.getCategoryById.useQuery(
    { id: categoryId },
  );

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 pl-12 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading services...
      </div>
    );
  }

  if (!data?.services || data.services.length === 0) {
    return (
      <div className="px-4 py-3 pl-12 text-sm text-muted-foreground">
        No services in this category.
      </div>
    );
  }

  return (
    <div className="divide-y divide-border/50 bg-muted/30">
      {data.services.map((service: { id: string; name: string }) => (
        <div
          key={service.id}
          className="flex items-center gap-2 px-4 py-2 pl-12 text-sm"
        >
          <Package className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{service.name}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * CategoryListOrganism - Organism Component (ALI-118)
 *
 * Complete CRUD interface for managing service categories.
 * Displays categories as an expandable list with inline service details.
 *
 * Features:
 * - List all categories with clickable service count
 * - Expand/collapse to see services in each category
 * - Add new category (inline form)
 * - Edit category (inline form)
 * - Delete category (with confirmation dialog)
 * - Empty state with call-to-action
 * - Loading states
 * - Error handling
 * - Auto-refresh after CRUD operations
 */
export const CategoryListOrganism: React.FC<CategoryListOrganismProps> = ({
  className = '',
  showAddButton = true,
  onCategoryChange,
}) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [state, setState] = useState<Omit<CategoryListState, 'categories' | 'isLoading' | 'error'>>({
    showForm: false,
    editingCategory: null,
    deletingCategoryId: null,
  });

  const {
    data: categories = [],
    isLoading,
    error: queryError,
    refetch,
  } = trpc.category.getAllCategories.useQuery();

  const deleteMutation = trpc.category.deleteCategory.useMutation({
    onSuccess: () => {
      refetch();
      onCategoryChange?.();
    },
    onError: (error) => {
      alert(error.message || 'Failed to delete category');
    },
    onSettled: () => {
      setState((prev) => ({ ...prev, deletingCategoryId: null }));
    },
  });

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSuccess = (_category: Category) => {
    setState((prev) => ({
      ...prev,
      showForm: false,
      editingCategory: null,
    }));
    refetch();
    onCategoryChange?.();
  };

  const handleEdit = (category: Category) => {
    setState((prev) => ({
      ...prev,
      editingCategory: category,
      showForm: false,
    }));
  };

  const handleDelete = (category: Category) => {
    const serviceCount = category._count?.services ?? 0;

    if (serviceCount > 0) {
      alert(
        `Cannot delete "${category.name}" category because it has ${serviceCount} service(s). Delete or reassign services first.`,
      );
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete the "${category.name}" category? This action cannot be undone.`,
    );

    if (!confirmed) return;

    setState((prev) => ({ ...prev, deletingCategoryId: category.id }));
    deleteMutation.mutate({ id: category.id });
  };

  const handleCancel = () => {
    setState((prev) => ({
      ...prev,
      showForm: false,
      editingCategory: null,
    }));
  };

  const toggleForm = () => {
    setState((prev) => ({
      ...prev,
      showForm: !prev.showForm,
      editingCategory: null,
    }));
  };

  // Loading state
  if (isLoading) {
    return (
      <div
        className={`flex items-center justify-center py-12 ${className}`}
        data-testid="category-list-loading"
      >
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (queryError) {
    return (
      <div
        className={`rounded-lg border border-destructive/30 bg-destructive/10 p-4 ${className}`}
        data-testid="category-list-error"
      >
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <p className="font-medium">Error loading categories</p>
        </div>
        <p className="mt-1 text-sm text-destructive/80">{queryError.message}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="mt-3"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className={className} data-testid="category-list">
      {/* Header with Add Button */}
      {showAddButton && !state.showForm && !state.editingCategory && (
        <div className="mb-6">
          <Button onClick={toggleForm}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Category
          </Button>
        </div>
      )}

      {/* Add New Category Form */}
      {state.showForm && (
        <div className="mb-6 rounded-lg border border-border bg-muted/50 p-4">
          <h3 className="mb-4 font-medium text-foreground">
            Add New Service Category
          </h3>
          <CategoryFormOrganism
            onSuccess={handleSuccess}
            onError={(error) => alert(error)}
            onCancel={handleCancel}
            showCancel
          />
        </div>
      )}

      {/* Edit Category Form */}
      {state.editingCategory && (
        <div
          data-testid="category-edit-form"
          className="mb-6 rounded-lg border border-border bg-muted/50 p-4"
        >
          <h3 className="mb-4 font-medium text-foreground">Edit Category</h3>
          <CategoryFormOrganism
            initialData={state.editingCategory}
            onSuccess={handleSuccess}
            onError={(error) => alert(error)}
            onCancel={handleCancel}
            showCancel
          />
        </div>
      )}

      {/* Categories List */}
      {categories.length > 0 ? (
        <div className="flex flex-col divide-y divide-border rounded-lg border">
          {categories.map((category) => {
            const serviceCount = category._count?.services ?? 0;
            const isExpanded = expandedIds.has(category.id);
            const isDeleting = state.deletingCategoryId === category.id;

            return (
              <Collapsible
                key={category.id}
                open={isExpanded}
                onOpenChange={() => toggleExpanded(category.id)}
              >
                <div className="flex items-center gap-3 px-4 py-3">
                  <Folder className="h-5 w-5 shrink-0 text-muted-foreground" />
                  <span className="flex-1 font-medium">{category.name}</span>

                  {/* Service count trigger */}
                  <CollapsibleTrigger asChild>
                    <button
                      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                      disabled={serviceCount === 0}
                    >
                      <Package className="h-3.5 w-3.5" />
                      {serviceCount} {serviceCount === 1 ? 'service' : 'services'}
                      {serviceCount > 0 && (
                        <ChevronRight
                          className={`h-3.5 w-3.5 transition-transform duration-200 ${
                            isExpanded ? 'rotate-90' : ''
                          }`}
                        />
                      )}
                    </button>
                  </CollapsibleTrigger>

                  {/* Edit button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    iconOnly
                    onClick={() => handleEdit(category as Category)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  {/* Delete button */}
                  <Button
                    variant="destructive"
                    size="sm"
                    iconOnly
                    onClick={() => handleDelete(category as Category)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {serviceCount > 0 && (
                  <CollapsibleContent>
                    <CategoryServicesList categoryId={category.id} />
                  </CollapsibleContent>
                )}
              </Collapsible>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-lg border border-dashed border-border bg-muted/30 p-12 text-center">
          <FolderPlus className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium text-foreground">
            No categories yet
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Get started by creating your first service category.
          </p>
          {showAddButton && !state.showForm && (
            <Button onClick={toggleForm} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Create Category
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
