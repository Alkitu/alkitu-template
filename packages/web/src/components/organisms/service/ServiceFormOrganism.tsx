'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateServiceSchema } from '@alkitu/shared';
import { Button } from '@/components/primitives/ui/button';
import { Input } from '@/components/primitives/ui/input';
import { Loader2, Save, X } from 'lucide-react';
import type {
  ServiceFormOrganismProps,
  ServiceFormData,
} from './ServiceFormOrganism.types';
import type { Category } from '@/components/molecules/category';

/**
 * ServiceFormOrganism - Organism Component (ALI-118)
 *
 * Handles creating and editing services with validation.
 * Auto-detects create vs. edit mode based on initialData prop.
 * Follows Atomic Design principles as a complete feature component.
 *
 * Features:
 * - Auto-detect create/edit mode
 * - Category selection dropdown
 * - Zod schema validation with CreateServiceSchema
 * - Request template JSON editor (simple textarea for now, Phase 8 will have visual builder)
 * - Field-level error messages
 * - Loading states during API calls
 * - Success/error callbacks
 * - Cancel functionality
 *
 * @example
 * ```tsx
 * // Create mode
 * <ServiceFormOrganism
 *   onSuccess={(service) => console.log('Created:', service)}
 * />
 *
 * // Edit mode
 * <ServiceFormOrganism
 *   initialData={existingService}
 *   onSuccess={(service) => console.log('Updated:', service)}
 *   showCancel
 *   onCancel={() => setEditing(false)}
 * />
 * ```
 */
export const ServiceFormOrganism: React.FC<ServiceFormOrganismProps> = ({
  className = '',
  initialData,
  onSuccess,
  onError,
  onCancel,
  showCancel = false,
}) => {
  const isEditMode = !!initialData;
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Default request template for new services
  const defaultTemplate = {
    version: '1.0',
    fields: [
      {
        id: 'description',
        type: 'textarea',
        label: 'Service Description',
        required: true,
      },
    ],
  };

  // Initialize form with React Hook Form + Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ServiceFormData>({
    resolver: zodResolver(CreateServiceSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          categoryId: initialData.categoryId,
          thumbnail: initialData.thumbnail || '',
          requestTemplate: initialData.requestTemplate,
        }
      : {
          name: '',
          categoryId: '',
          thumbnail: '',
          requestTemplate: defaultTemplate,
        },
  });

  const requestTemplate = watch('requestTemplate');

  /**
   * Fetch categories for dropdown
   */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch categories');
        }

        setCategories(data);
      } catch (error: any) {
        console.error('Fetch categories error:', error);
        onError?.('Failed to load categories. Please refresh the page.');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [onError]);

  /**
   * Handle form submission (create or update)
   */
  const onSubmit = async (data: ServiceFormData) => {
    try {
      setIsLoading(true);

      // Parse and validate JSON template
      let parsedTemplate = data.requestTemplate;
      if (typeof parsedTemplate === 'string') {
        try {
          parsedTemplate = JSON.parse(parsedTemplate);
        } catch (e) {
          throw new Error('Invalid JSON in request template');
        }
      }

      const payload = {
        ...data,
        requestTemplate: parsedTemplate,
        thumbnail: data.thumbnail || undefined,
      };

      const endpoint = isEditMode
        ? `/api/services/${initialData.id}`
        : '/api/services';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save service');
      }

      // Success callback
      onSuccess?.(result);

      // Reset form if creating new service
      if (!isEditMode) {
        reset();
      }
    } catch (error: any) {
      console.error('Service form error:', error);
      onError?.(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingCategories) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        <span className="ml-2 text-sm text-gray-600">Loading form...</span>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`space-y-4 ${className}`}
      data-testid="service-form"
    >
      {/* Service Name Field */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Service Name <span className="text-red-500">*</span>
        </label>
        <Input
          id="name"
          type="text"
          placeholder="e.g., Emergency Plumbing, AC Repair"
          {...register('name')}
          className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
          disabled={isLoading}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Category Selection */}
      <div>
        <label
          htmlFor="categoryId"
          className="block text-sm font-medium text-gray-700"
        >
          Category <span className="text-red-500">*</span>
        </label>
        <select
          id="categoryId"
          {...register('categoryId')}
          className={`mt-1 block w-full rounded-md border ${errors.categoryId ? 'border-red-500' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
          disabled={isLoading}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="mt-1 text-sm text-red-600">
            {errors.categoryId.message}
          </p>
        )}
      </div>

      {/* Thumbnail URL (Optional) */}
      <div>
        <label
          htmlFor="thumbnail"
          className="block text-sm font-medium text-gray-700"
        >
          Thumbnail URL (Optional)
        </label>
        <Input
          id="thumbnail"
          type="url"
          placeholder="https://example.com/image.jpg"
          {...register('thumbnail')}
          className="mt-1"
          disabled={isLoading}
        />
        <p className="mt-1 text-xs text-gray-500">
          URL to an image representing this service
        </p>
      </div>

      {/* Request Template JSON Editor */}
      <div>
        <label
          htmlFor="requestTemplate"
          className="block text-sm font-medium text-gray-700"
        >
          Request Form Template <span className="text-red-500">*</span>
        </label>
        <p className="mt-1 text-xs text-gray-500">
          JSON template for the service request form (Phase 8 will have visual
          builder)
        </p>
        <textarea
          id="requestTemplate"
          {...register('requestTemplate')}
          rows={8}
          className={`mt-1 block w-full rounded-md border ${errors.requestTemplate ? 'border-red-500' : 'border-gray-300'} px-3 py-2 font-mono text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
          disabled={isLoading}
          value={
            typeof requestTemplate === 'string'
              ? requestTemplate
              : JSON.stringify(requestTemplate, null, 2)
          }
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              setValue('requestTemplate', parsed);
            } catch {
              setValue('requestTemplate', e.target.value);
            }
          }}
        />
        {errors.requestTemplate && (
          <p className="mt-1 text-sm text-red-600">
            {errors.requestTemplate.message as string}
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
              {isEditMode ? 'Update Service' : 'Create Service'}
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
