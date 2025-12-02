'use client';

import React from 'react';
import { Button } from '@/components/primitives/ui/button';
import { Folder, Edit, Trash2, Package } from 'lucide-react';
import type { CategoryCardMoleculeProps } from './CategoryCardMolecule.types';

/**
 * CategoryCardMolecule - Molecule Component (ALI-118)
 *
 * Displays a service category in a card format with optional edit/delete actions.
 * Follows Atomic Design principles as a self-contained display component.
 *
 * Features:
 * - Displays category name and service count
 * - Shows creation date
 * - Edit and delete action buttons
 * - Loading state for delete operation
 * - Responsive layout with icon
 * - Prevents deletion if category has services
 *
 * @example
 * ```tsx
 * <CategoryCardMolecule
 *   category={category}
 *   showEdit
 *   showDelete
 *   onEdit={(cat) => handleEdit(cat)}
 *   onDelete={(cat) => handleDelete(cat)}
 * />
 * ```
 */
export const CategoryCardMolecule: React.FC<CategoryCardMoleculeProps> = ({
  category,
  className = '',
  showEdit = true,
  showDelete = true,
  onEdit,
  onDelete,
  isDeleting = false,
}) => {
  const serviceCount = category._count?.services ?? 0;
  const hasServices = serviceCount > 0;

  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${className}`}
      data-testid="category-card"
    >
      <div className="flex items-start justify-between">
        {/* Category Icon and Info */}
        <div className="flex-1">
          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-full bg-indigo-50 p-2">
              <Folder className="h-5 w-5 text-indigo-600" />
            </div>

            <div className="flex-1">
              {/* Category Name */}
              <div className="font-medium text-gray-900">{category.name}</div>

              {/* Service Count */}
              <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                <Package className="h-4 w-4" />
                <span>
                  {serviceCount} {serviceCount === 1 ? 'service' : 'services'}
                </span>
              </div>

              {/* Created Date */}
              <div className="mt-2 text-xs text-gray-400">
                Created {new Date(category.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {(showEdit || showDelete) && (
          <div className="ml-4 flex gap-2">
            {showEdit && onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(category)}
                disabled={isDeleting}
                className="h-8 w-8 p-0"
                aria-label="Edit category"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}

            {showDelete && onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(category)}
                disabled={isDeleting || hasServices}
                className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                aria-label={
                  hasServices
                    ? 'Cannot delete category with services'
                    : 'Delete category'
                }
                title={
                  hasServices
                    ? 'Cannot delete category with services. Delete or reassign services first.'
                    : 'Delete category'
                }
              >
                {isDeleting ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-red-600" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
