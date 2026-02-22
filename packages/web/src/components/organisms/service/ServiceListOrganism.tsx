'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/primitives/ui/button';
import { Plus, AlertCircle, Loader2, Wrench } from 'lucide-react';
import { ServiceCard } from '@/components/molecules-alianza/ServiceCard';
import { ServiceFormOrganism } from './ServiceFormOrganism';
import type {
  ServiceListOrganismProps,
  ServiceListState,
} from './ServiceListOrganism.types';
import type { Service } from '@/components/molecules-alianza/ServiceCard';

/**
 * ServiceListOrganism - Organism Component (ALI-118)
 *
 * Complete CRUD interface for managing services.
 * Combines ServiceFormOrganism and ServiceCard to provide
 * full service management functionality with optional category filtering.
 *
 * Features:
 * - List all services (or filter by category)
 * - Add new service (inline form)
 * - Edit service (inline form)
 * - Delete service (with confirmation dialog)
 * - Empty state with call-to-action
 * - Loading states
 * - Error handling
 * - Auto-refresh after CRUD operations
 *
 * @example
 * ```tsx
 * // All services
 * <ServiceListOrganism
 *   showAddButton
 *   onServiceChange={() => console.log('Services changed')}
 * />
 *
 * // Services filtered by category
 * <ServiceListOrganism
 *   categoryId="category-id-123"
 *   showAddButton
 * />
 * ```
 */
export const ServiceListOrganism: React.FC<ServiceListOrganismProps> = ({
  className = '',
  showAddButton = true,
  categoryId,
  onServiceChange,
}) => {
  const [state, setState] = useState<ServiceListState>({
    services: [],
    isLoading: true,
    error: '',
    showForm: false,
    editingService: null,
    deletingServiceId: null,
  });

  /**
   * Fetch services from API (with optional category filter)
   */
  const fetchServices = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: '' }));

      const url = categoryId
        ? `/api/services?categoryId=${categoryId}`
        : '/api/services';

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch services');
      }

      setState((prev) => ({
        ...prev,
        services: data,
        isLoading: false,
      }));
    } catch (error: any) {
      console.error('Fetch services error:', error);
      setState((prev) => ({
        ...prev,
        error: error.message || 'Failed to load services',
        isLoading: false,
      }));
    }
  };

  /**
   * Load services on mount and when categoryId changes
   */
  useEffect(() => {
    fetchServices();
  }, [categoryId]);

  /**
   * Handle successful create/update
   */
  const handleSuccess = (service: Service) => {
    setState((prev) => ({
      ...prev,
      showForm: false,
      editingService: null,
    }));
    fetchServices();
    onServiceChange?.();
  };

  /**
   * Handle edit button click
   */
  const handleEdit = (service: Service) => {
    setState((prev) => ({
      ...prev,
      editingService: service,
      showForm: false,
    }));
  };

  /**
   * Handle delete button click (with confirmation)
   */
  const handleDelete = async (service: Service) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the "${service.name}" service? This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setState((prev) => ({
        ...prev,
        deletingServiceId: service.id,
      }));

      const response = await fetch(`/api/services/${service.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete service');
      }

      // Success - refresh list
      fetchServices();
      onServiceChange?.();
    } catch (error: any) {
      console.error('Delete service error:', error);
      alert(error.message || 'Failed to delete service');
    } finally {
      setState((prev) => ({
        ...prev,
        deletingServiceId: null,
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
      editingService: null,
    }));
  };

  /**
   * Toggle add new service form
   */
  const toggleForm = () => {
    setState((prev) => ({
      ...prev,
      showForm: !prev.showForm,
      editingService: null,
    }));
  };

  // Loading state
  if (state.isLoading) {
    return (
      <div
        className={`flex items-center justify-center py-12 ${className}`}
        data-testid="service-list-loading"
      >
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">Loading services...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (state.error) {
    return (
      <div
        className={`rounded-lg border border-destructive/20 bg-destructive/10 p-4 ${className}`}
        data-testid="service-list-error"
      >
        <div className="flex items-center gap-2 text-destructive-foreground">
          <AlertCircle className="h-5 w-5" />
          <p className="font-medium">Error loading services</p>
        </div>
        <p className="mt-1 text-sm text-destructive">{state.error}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchServices}
          className="mt-3"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className={className} data-testid="service-list">
      {/* Header with Add Button */}
      {showAddButton && !state.showForm && !state.editingService && (
        <div className="mb-6">
          <Button onClick={toggleForm}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Service
          </Button>
        </div>
      )}

      {/* Add New Service Form */}
      {state.showForm && (
        <div className="mb-6 rounded-lg border border-border bg-muted/30 p-4">
          <h3 className="mb-4 font-medium text-foreground">Add New Service</h3>
          <ServiceFormOrganism
            onSuccess={handleSuccess}
            onError={(error) => alert(error)}
            onCancel={handleCancel}
            showCancel
          />
        </div>
      )}

      {/* Edit Service Form */}
      {state.editingService && (
        <div
          data-testid="service-edit-form"
          className="mb-6 rounded-lg border border-border bg-muted/30 p-4"
        >
          <h3 className="mb-4 font-medium text-foreground">Edit Service</h3>
          <ServiceFormOrganism
            initialData={state.editingService}
            onSuccess={handleSuccess}
            onError={(error) => alert(error)}
            onCancel={handleCancel}
            showCancel
          />
        </div>
      )}

      {/* Services Grid */}
      {state.services.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {state.services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              showEdit
              showDelete
              onEdit={handleEdit}
              onDelete={handleDelete}
              isDeleting={state.deletingServiceId === service.id}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-lg border border-dashed border-border bg-muted/10 p-12 text-center">
          <Wrench className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium text-foreground">
            {categoryId ? 'No services in this category' : 'No services yet'}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {categoryId
              ? 'Get started by creating your first service for this category.'
              : 'Get started by creating your first service.'}
          </p>
          {showAddButton && !state.showForm && (
            <Button onClick={toggleForm} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Create Service
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
