'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/primitives/ui/button';
import { Input } from '@/components/primitives/ui/input';
import { Label } from '@/components/primitives/ui/label';
import { Textarea } from '@/components/primitives/ui/textarea';
import { AlertCircle, Loader2, Calendar, MapPin, Briefcase } from 'lucide-react';
import { CreateRequestSchema } from '@alkitu/shared';
import type { RequestFormOrganismProps, RequestFormData } from './RequestFormOrganism.types';

/**
 * RequestFormOrganism - Organism Component (ALI-119)
 *
 * Comprehensive form for creating and editing service requests.
 * Follows Atomic Design principles as a complete feature component.
 *
 * Features:
 * - Service selection (dropdown)
 * - Location selection (dropdown)
 * - Date/time picker for execution
 * - Dynamic form fields based on service template
 * - Form validation with Zod
 * - Loading and error states
 * - Success/error notifications
 *
 * @example
 * ```tsx
 * <RequestFormOrganism
 *   onSuccess={(request) => router.push(`/requests/${request.id}`)}
 *   onCancel={() => router.back()}
 * />
 * ```
 */
export const RequestFormOrganism: React.FC<RequestFormOrganismProps> = ({
  initialData,
  onSuccess,
  onCancel,
  className = '',
}) => {
  const isEditMode = !!initialData;

  // Form state
  const [formData, setFormData] = useState<RequestFormData>({
    serviceId: initialData?.serviceId || '',
    locationId: initialData?.locationId || '',
    executionDateTime: initialData?.executionDateTime
      ? new Date(initialData.executionDateTime).toISOString().slice(0, 16)
      : '',
    templateResponses: initialData?.templateResponses || {},
    note: initialData?.note || undefined,
  });

  const [services, setServices] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Fetch services and locations on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true);
        const [servicesRes, locationsRes] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/locations'),
        ]);

        if (!servicesRes.ok || !locationsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const servicesData = await servicesRes.json();
        const locationsData = await locationsRes.json();

        setServices(servicesData);
        setLocations(locationsData);

        // If edit mode, load the selected service
        if (isEditMode && initialData?.serviceId) {
          const service = servicesData.find((s: any) => s.id === initialData.serviceId);
          setSelectedService(service);
        }
      } catch (err) {
        setError('Failed to load services and locations');
        console.error(err);
      } finally {
        setIsLoadingData(false);
      }
    };

    void fetchData();
  }, [isEditMode, initialData?.serviceId]);

  // Handle service selection change
  const handleServiceChange = (serviceId: string) => {
    const service = services.find((s) => s.id === serviceId);
    setSelectedService(service);
    setFormData((prev) => ({
      ...prev,
      serviceId,
      templateResponses: {}, // Reset template responses when service changes
    }));
    setFieldErrors({});
  };

  // Handle template field change
  const handleTemplateFieldChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      templateResponses: {
        ...prev.templateResponses,
        [fieldId]: value,
      },
    }));
    // Clear field error when user types
    if (fieldErrors[fieldId]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    try {
      // Basic validation with Zod
      CreateRequestSchema.parse({
        serviceId: formData.serviceId,
        locationId: formData.locationId,
        executionDateTime: formData.executionDateTime,
        templateResponses: formData.templateResponses,
      });

      // Validate required template fields
      if (selectedService?.requestTemplate?.fields) {
        const errors: Record<string, string> = {};
        selectedService.requestTemplate.fields.forEach((field: any) => {
          if (field.required && !formData.templateResponses[field.id]) {
            errors[field.id] = `${field.label} is required`;
          }
        });

        if (Object.keys(errors).length > 0) {
          setFieldErrors(errors);
          return false;
        }
      }

      setFieldErrors({});
      return true;
    } catch (err: any) {
      if (err.errors) {
        const errors: Record<string, string> = {};
        err.errors.forEach((e: any) => {
          errors[e.path[0]] = e.message;
        });
        setFieldErrors(errors);
      }
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setError('Please fix the errors in the form');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const url = isEditMode ? `/api/requests/${initialData.id}` : '/api/requests';
      const method = isEditMode ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: formData.serviceId,
          locationId: formData.locationId,
          executionDateTime: new Date(formData.executionDateTime).toISOString(),
          templateResponses: formData.templateResponses,
          note: formData.note,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit request');
      }

      const request = await response.json();
      onSuccess?.(request);
    } catch (err: any) {
      setError(err.message || 'Failed to submit request');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {/* Error Alert */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
            <div className="flex-1">
              <h3 className="font-medium text-red-900">Error</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Service Selection */}
      <div className="space-y-2">
        <Label htmlFor="serviceId" className="flex items-center gap-2">
          <Briefcase className="h-4 w-4" />
          Service *
        </Label>
        <select
          id="serviceId"
          value={formData.serviceId}
          onChange={(e) => handleServiceChange(e.target.value)}
          disabled={isEditMode || isLoading}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-50"
          required
        >
          <option value="">Select a service...</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
        {fieldErrors.serviceId && (
          <p className="text-sm text-red-600">{fieldErrors.serviceId}</p>
        )}
      </div>

      {/* Location Selection */}
      <div className="space-y-2">
        <Label htmlFor="locationId" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Location *
        </Label>
        <select
          id="locationId"
          value={formData.locationId}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, locationId: e.target.value }))
          }
          disabled={isLoading}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-50"
          required
        >
          <option value="">Select a location...</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.street}, {location.city}, {location.state}
            </option>
          ))}
        </select>
        {fieldErrors.locationId && (
          <p className="text-sm text-red-600">{fieldErrors.locationId}</p>
        )}
      </div>

      {/* Execution Date/Time */}
      <div className="space-y-2">
        <Label htmlFor="executionDateTime" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Execution Date & Time *
        </Label>
        <Input
          id="executionDateTime"
          type="datetime-local"
          value={formData.executionDateTime}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, executionDateTime: e.target.value }))
          }
          disabled={isLoading}
          min={new Date().toISOString().slice(0, 16)}
          required
        />
        {fieldErrors.executionDateTime && (
          <p className="text-sm text-red-600">{fieldErrors.executionDateTime}</p>
        )}
      </div>

      {/* Dynamic Template Fields */}
      {selectedService?.requestTemplate?.fields && (
        <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="font-medium text-gray-900">Service Details</h3>

          {selectedService.requestTemplate.fields.map((field: any) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id}>
                {field.label}
                {field.required && <span className="text-red-500"> *</span>}
              </Label>

              {field.type === 'textarea' ? (
                <Textarea
                  id={field.id}
                  value={(formData.templateResponses[field.id] as string) || ''}
                  onChange={(e) => handleTemplateFieldChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  disabled={isLoading}
                  required={field.required}
                  rows={4}
                />
              ) : field.type === 'select' ? (
                <select
                  id={field.id}
                  value={(formData.templateResponses[field.id] as string) || ''}
                  onChange={(e) => handleTemplateFieldChange(field.id, e.target.value)}
                  disabled={isLoading}
                  required={field.required}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-50"
                >
                  <option value="">Select...</option>
                  {field.options?.map((option: any) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  id={field.id}
                  type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                  value={(formData.templateResponses[field.id] as string) || ''}
                  onChange={(e) => handleTemplateFieldChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  disabled={isLoading}
                  required={field.required}
                />
              )}

              {field.helpText && (
                <p className="text-sm text-gray-500">{field.helpText}</p>
              )}

              {fieldErrors[field.id] && (
                <p className="text-sm text-red-600">{fieldErrors[field.id]}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 border-t border-gray-200 pt-6">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditMode ? 'Update Request' : 'Create Request'}
        </Button>

        {onCancel && (
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
    </form>
  );
};
