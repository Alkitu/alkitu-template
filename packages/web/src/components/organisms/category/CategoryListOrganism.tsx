'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/primitives/ui/button';
import { Plus, AlertCircle, Loader2, FolderPlus } from 'lucide-react';
import { CategoryCardMolecule } from '@/components/molecules/category';
import { CategoryFormOrganism } from './CategoryFormOrganism';
import type {
  CategoryListOrganismProps,
  CategoryListState,
} from './CategoryListOrganism.types';
import type { Category } from '@/components/molecules/category';

/**
 * CategoryListOrganism - Organism Component (ALI-118)
 *
 * Complete CRUD interface for managing service categories.
 * Combines CategoryFormOrganism and CategoryCardMolecule to provide
 * full category management functionality.
 *
 * Features:
 * - List all categories with service count
 * - Add new category (inline form)
 * - Edit category (inline form)
 * - Delete category (with confirmation dialog)
 * - Empty state with call-to-action
 * - Loading states
 * - Error handling
 * - Auto-refresh after CRUD operations
 *
 * @example
 * ```tsx
 * <CategoryListOrganism
 *   showAddButton
 *   onCategoryChange={() => console.log('Categories changed')}
 * />
 * ```
 */
export const CategoryListOrganism: React.FC<CategoryListOrganismProps> = ({
  className = '',
  showAddButton = true,
  onCategoryChange,
}) => {
  const [state, setState] = useState<CategoryListState>({
    categories: [],
    isLoading: true,
    error: '',
    showForm: false,
    editingCategory: null,
    deletingCategoryId: null,
  });

  /**
   * Fetch all categories from API
   */
  const fetchCategories = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: '' }));

      const response = await fetch('/api/categories');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch categories');
      }

      setState((prev) => ({
        ...prev,
        categories: data,
        isLoading: false,
      }));
    } catch (error: any) {
      console.error('Fetch categories error:', error);
      setState((prev) => ({
        ...prev,
        error: error.message || 'Failed to load categories',
        isLoading: false,
      }));
    }
  };

  /**
   * Load categories on mount
   */
  useEffect(() => {
    fetchCategories();
  }, []);

  /**
   * Handle successful create/update
   */
  const handleSuccess = (category: Category) => {
    setState((prev) => ({
      ...prev,
      showForm: false,
      editingCategory: null,
    }));
    fetchCategories();
    onCategoryChange?.();
  };

  /**
   * Handle edit button click
   */
  const handleEdit = (category: Category) => {
    setState((prev) => ({
      ...prev,
      editingCategory: category,
      showForm: false,
    }));
  };

  /**
   * Handle delete button click (with confirmation)
   */
  const handleDelete = async (category: Category) => {
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

    try {
      setState((prev) => ({
        ...prev,
        deletingCategoryId: category.id,
      }));

      const response = await fetch(`/api/categories/${category.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete category');
      }

      // Success - refresh list
      fetchCategories();
      onCategoryChange?.();
    } catch (error: any) {
      console.error('Delete category error:', error);
      alert(error.message || 'Failed to delete category');
    } finally {
      setState((prev) => ({
        ...prev,
        deletingCategoryId: null,
      }));
    }
  };

  /**
   * Cancel editing/creating
   */
  const handleCancel = () => {
    setState((prev) => ({
      ...prev,
      showForm: false,
      editingCategory: null,
    }));
  };

  /**
   * Toggle add new category form
   */
  const toggleForm = () => {
    setState((prev) => ({
      ...prev,
      showForm: !prev.showForm,
      editingCategory: null,
    }));
  };

  // Loading state
  if (state.isLoading) {
    return (
      <div
        className={`flex items-center justify-center py-12 ${className}`}
        data-testid="category-list-loading"
      >
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (state.error) {
    return (
      <div
        className={`rounded-lg border border-red-200 bg-red-50 p-4 ${className}`}
        data-testid="category-list-error"
      >
        <div className="flex items-center gap-2 text-red-800">
          <AlertCircle className="h-5 w-5" />
          <p className="font-medium">Error loading categories</p>
        </div>
        <p className="mt-1 text-sm text-red-600">{state.error}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchCategories}
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
        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="mb-4 font-medium text-gray-900">
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
          className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4"
        >
          <h3 className="mb-4 font-medium text-gray-900">Edit Category</h3>
          <CategoryFormOrganism
            initialData={state.editingCategory}
            onSuccess={handleSuccess}
            onError={(error) => alert(error)}
            onCancel={handleCancel}
            showCancel
          />
        </div>
      )}

      {/* Categories Grid */}
      {state.categories.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {state.categories.map((category) => (
            <CategoryCardMolecule
              key={category.id}
              category={category}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isDeleting={state.deletingCategoryId === category.id}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <FolderPlus className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No categories yet
          </h3>
          <p className="mt-2 text-sm text-gray-600">
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
