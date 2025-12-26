'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateCategorySchema } from '@alkitu/shared';
import { Button } from '@/components/primitives/ui/button';
import { Input } from '@/components/primitives/ui/input';
import { Loader2, Save, X } from 'lucide-react';
import type {
  CategoryFormOrganismProps,
  CategoryFormData,
} from './CategoryFormOrganism.types';

/**
 * CategoryFormOrganism - Organism Component (ALI-118)
 *
 * Handles creating and editing service categories with validation.
 * Auto-detects create vs. edit mode based on initialData prop.
 * Follows Atomic Design principles as a complete feature component.
 *
 * Features:
 * - Auto-detect create/edit mode
 * - Zod schema validation with CreateCategorySchema
 * - Field-level error messages
 * - Loading states during API calls
 * - Success/error callbacks
 * - Cancel functionality
 *
 * @example
 * ```tsx
 * // Create mode
 * <CategoryFormOrganism
 *   onSuccess={(category) => console.log('Created:', category)}
 * />
 *
 * // Edit mode
 * <CategoryFormOrganism
 *   initialData={existingCategory}
 *   onSuccess={(category) => console.log('Updated:', category)}
 *   showCancel
 *   onCancel={() => setEditing(false)}
 * />
 * ```
 */
export const CategoryFormOrganism: React.FC<CategoryFormOrganismProps> = ({
  className = '',
  initialData,
  onSuccess,
  onError,
  onCancel,
  showCancel = false,
}) => {
  const isEditMode = !!initialData;
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with React Hook Form + Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
        }
      : {
          name: '',
        },
  });

  /**
   * Handle form submission (create or update)
   */
  const onSubmit = async (data: CategoryFormData) => {
    try {
      setIsLoading(true);

      const endpoint = isEditMode
        ? `/api/categories/${initialData.id}`
        : '/api/categories';
      const method = isEditMode ? 'PATCH' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save category');
      }

      // Success callback
      onSuccess?.(result);

      // Reset form if creating new category
      if (!isEditMode) {
        reset();
      }
    } catch (error: any) {
      console.error('Category form error:', error);
      onError?.(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`space-y-4 ${className}`}
      data-testid="category-form"
    >
      {/* Category Name Field */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Category Name <span className="text-red-500">*</span>
        </label>
        <Input
          id="name"
          type="text"
          placeholder="e.g., Plumbing, Electrical, HVAC"
          {...register('name')}
          className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
          disabled={isLoading}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-sm text-red-600">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 sm:flex-initial"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditMode ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {isEditMode ? 'Update Category' : 'Create Category'}
            </>
          )}
        </Button>

        {showCancel && onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};
