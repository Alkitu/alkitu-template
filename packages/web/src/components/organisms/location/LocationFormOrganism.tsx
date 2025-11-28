'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/primitives/ui/button';
import { Input } from '@/components/primitives/Input';
import { Label } from '@/components/primitives/ui/label';
import { FormError } from '@/components/primitives/ui/form-error';
import { FormSuccess } from '@/components/primitives/ui/form-success';
import { CreateLocationSchema, US_STATE_CODES } from '@alkitu/shared';
import type {
  LocationFormOrganismProps,
  LocationFormData,
} from './LocationFormOrganism.types';

/**
 * LocationFormOrganism - Organism Component (ALI-117)
 *
 * A complete form for creating and editing work locations.
 * Follows Atomic Design principles as a self-contained feature component.
 *
 * Features:
 * - Required fields: street, city, state, zip
 * - Optional fields: building, tower, floor, unit
 * - Zod validation with CreateLocationSchema
 * - API integration with /api/locations
 * - Create and Edit modes
 * - Loading states
 * - Error and success messages
 * - US state dropdown (50 states)
 * - ZIP code format validation (5-digit or 5+4)
 *
 * @example
 * ```tsx
 * // Create mode
 * <LocationFormOrganism
 *   onSuccess={(location) => console.log('Created', location)}
 * />
 *
 * // Edit mode
 * <LocationFormOrganism
 *   initialData={existingLocation}
 *   onSuccess={(location) => console.log('Updated', location)}
 * />
 * ```
 */
export const LocationFormOrganism = React.forwardRef<
  HTMLFormElement,
  LocationFormOrganismProps
>(
  (
    {
      className = '',
      initialData,
      onSuccess,
      onError,
      onCancel,
      showCancel = true,
    },
    ref,
  ) => {
    const isEditMode = !!initialData;

    const [formData, setFormData] = useState<LocationFormData>({
      street: initialData?.street || '',
      building: initialData?.building || '',
      tower: initialData?.tower || '',
      floor: initialData?.floor || '',
      unit: initialData?.unit || '',
      city: initialData?.city || '',
      zip: initialData?.zip || '',
      state: initialData?.state || '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    // Update form when initialData changes
    useEffect(() => {
      if (initialData) {
        setFormData({
          street: initialData.street || '',
          building: initialData.building || '',
          tower: initialData.tower || '',
          floor: initialData.floor || '',
          unit: initialData.unit || '',
          city: initialData.city || '',
          zip: initialData.zip || '',
          state: initialData.state || '',
        });
      }
    }, [initialData]);

    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      // Clear field error when user types
      if (fieldErrors[name]) {
        setFieldErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setSuccess('');
      setFieldErrors({});
      setIsLoading(true);

      try {
        // Validate with Zod schema
        const validatedData = CreateLocationSchema.parse(formData);

        // API call
        const url = isEditMode
          ? `/api/locations/${initialData.id}`
          : '/api/locations';
        const method = isEditMode ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(validatedData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to save location');
        }

        setSuccess(
          isEditMode
            ? 'Location updated successfully!'
            : 'Location created successfully!',
        );

        if (onSuccess) {
          onSuccess(data);
        }

        // Reset form if creating
        if (!isEditMode) {
          setFormData({
            street: '',
            building: '',
            tower: '',
            floor: '',
            unit: '',
            city: '',
            zip: '',
            state: '',
          });
        }
      } catch (err) {
        if (err instanceof Error) {
          // Check if it's a Zod validation error
          if (err.name === 'ZodError') {
            const zodError = err as any;
            const errors: Record<string, string> = {};
            zodError.errors?.forEach((e: any) => {
              const field = e.path[0];
              errors[field] = e.message;
            });
            setFieldErrors(errors);
            setError('Please fix the validation errors below');
          } else {
            setError(err.message);
            if (onError) {
              onError(err.message);
            }
          }
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit}
        className={`space-y-6 ${className}`}
        data-testid="location-form"
      >
        {/* Title */}
        <div>
          <h3 className="text-lg font-semibold">
            {isEditMode ? 'Edit Location' : 'Add New Location'}
          </h3>
          <p className="text-sm text-gray-600">
            {isEditMode
              ? 'Update the work location details'
              : 'Enter the work location details'}
          </p>
        </div>

        {/* Error and Success Messages */}
        {error && <FormError message={error} />}
        {success && <FormSuccess message={success} />}

        {/* Address Section */}
        <div className="space-y-4">
          <div className="text-sm font-medium text-gray-700">
            Address Information
          </div>

          {/* Street (Required) */}
          <div className="space-y-2">
            <Label htmlFor="street" className="required">
              Street Address
            </Label>
            <Input
              id="street"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              placeholder="123 Main Street"
              disabled={isLoading}
              required
              maxLength={200}
              aria-invalid={!!fieldErrors.street}
              aria-describedby={fieldErrors.street ? 'street-error' : undefined}
            />
            {fieldErrors.street && (
              <p id="street-error" className="text-sm text-red-600">
                {fieldErrors.street}
              </p>
            )}
          </div>

          {/* Building (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="building">Building</Label>
            <Input
              id="building"
              name="building"
              value={formData.building}
              onChange={handleInputChange}
              placeholder="Empire State Building (optional)"
              disabled={isLoading}
              maxLength={100}
            />
          </div>

          {/* Tower and Floor (Optional) - Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tower">Tower</Label>
              <Input
                id="tower"
                name="tower"
                value={formData.tower}
                onChange={handleInputChange}
                placeholder="Tower A (optional)"
                disabled={isLoading}
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="floor">Floor</Label>
              <Input
                id="floor"
                name="floor"
                value={formData.floor}
                onChange={handleInputChange}
                placeholder="5th Floor (optional)"
                disabled={isLoading}
                maxLength={50}
              />
            </div>
          </div>

          {/* Unit (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="unit">Unit / Suite</Label>
            <Input
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleInputChange}
              placeholder="Suite 500 (optional)"
              disabled={isLoading}
              maxLength={50}
            />
          </div>

          {/* City (Required) */}
          <div className="space-y-2">
            <Label htmlFor="city" className="required">
              City
            </Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="New York"
              disabled={isLoading}
              required
              maxLength={100}
              aria-invalid={!!fieldErrors.city}
              aria-describedby={fieldErrors.city ? 'city-error' : undefined}
            />
            {fieldErrors.city && (
              <p id="city-error" className="text-sm text-red-600">
                {fieldErrors.city}
              </p>
            )}
          </div>

          {/* State and ZIP (Required) - Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="state" className="required">
                State
              </Label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                disabled={isLoading}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                aria-invalid={!!fieldErrors.state}
                aria-describedby={fieldErrors.state ? 'state-error' : undefined}
              >
                <option value="">Select State</option>
                {US_STATE_CODES.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
              {fieldErrors.state && (
                <p id="state-error" className="text-sm text-red-600">
                  {fieldErrors.state}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip" className="required">
                ZIP Code
              </Label>
              <Input
                id="zip"
                name="zip"
                value={formData.zip}
                onChange={handleInputChange}
                placeholder="10001 or 10001-1234"
                disabled={isLoading}
                required
                pattern="^\d{5}(-\d{4})?$"
                title="ZIP code must be 5 digits or 5+4 format"
                aria-invalid={!!fieldErrors.zip}
                aria-describedby={fieldErrors.zip ? 'zip-error' : undefined}
              />
              {fieldErrors.zip && (
                <p id="zip-error" className="text-sm text-red-600">
                  {fieldErrors.zip}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4">
          <Button type="submit" disabled={isLoading} className="min-w-[120px]">
            {isLoading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white" />
                {isEditMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>{isEditMode ? 'Update Location' : 'Create Location'}</>
            )}
          </Button>

          {showCancel && onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
        </div>

        {/* Helper Text */}
        <p className="text-xs text-gray-500">
          <span className="text-red-600">*</span> Required fields
        </p>
      </form>
    );
  },
);

LocationFormOrganism.displayName = 'LocationFormOrganism';
