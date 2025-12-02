'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/primitives/ui/button';
import { DynamicFieldRenderer } from '@/components/molecules/dynamic-form';
import { Loader2, Send, X } from 'lucide-react';
import type { RequestTemplateRendererProps } from './RequestTemplateRenderer.types';

/**
 * RequestTemplateRenderer - Organism Component (ALI-118)
 *
 * Renders a complete dynamic form based on a requestTemplate JSON configuration.
 * Handles validation, submission, and all 10 supported field types.
 *
 * Supported Field Types:
 * - text, textarea, number
 * - select, radio, checkbox, checkboxGroup
 * - date, time, file
 *
 * Features:
 * - Dynamic form rendering from JSON template
 * - Field-level validation (required, min/max, patterns)
 * - React Hook Form integration
 * - Loading states during submission
 * - Error handling
 * - Cancel functionality
 * - Initial data support for editing
 *
 * @example
 * ```tsx
 * const template = {
 *   version: '1.0',
 *   fields: [
 *     {
 *       id: 'issue_description',
 *       type: 'textarea',
 *       label: 'Describe the Issue',
 *       required: true
 *     }
 *   ]
 * };
 *
 * <RequestTemplateRenderer
 *   template={template}
 *   onSubmit={(data) => console.log('Form data:', data)}
 *   submitButtonText="Submit Request"
 * />
 * ```
 */
export const RequestTemplateRenderer: React.FC<
  RequestTemplateRendererProps
> = ({
  template,
  className = '',
  onSubmit,
  onError,
  submitButtonText = 'Submit',
  showCancel = false,
  onCancel,
  disabled = false,
  initialData = {},
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: initialData,
  });

  /**
   * Handle form submission
   */
  const handleFormSubmit = async (data: Record<string, any>) => {
    if (!onSubmit) return;

    try {
      setIsSubmitting(true);
      await onSubmit(data);
      reset();
    } catch (error: any) {
      console.error('Form submission error:', error);
      onError?.(error.message || 'An error occurred while submitting the form');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validate template structure
  if (!template || !template.fields || template.fields.length === 0) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <p className="text-sm text-yellow-800">
          No form fields defined in template
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={`space-y-6 ${className}`}
      data-testid="request-template-form"
    >
      {/* Render all fields */}
      <div className="space-y-4">
        {template.fields.map((field) => (
          <DynamicFieldRenderer
            key={field.id}
            field={field}
            register={register}
            errors={errors}
            disabled={disabled || isSubmitting}
          />
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 border-t border-gray-200 pt-4">
        <Button
          type="submit"
          disabled={disabled || isSubmitting}
          className="flex-1 sm:flex-initial"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              {submitButtonText}
            </>
          )}
        </Button>

        {showCancel && onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};
