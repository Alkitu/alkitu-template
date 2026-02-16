'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/primitives/ui/button';
import { Plus, MapPin } from 'lucide-react';
import { LocationCardMolecule } from '@/components/molecules/location';
import { LocationFormOrganism } from './LocationFormOrganism';
import { FormError } from '@/components/primitives/ui/form-error';
import type { WorkLocation, WorkLocationWithRequestCount } from '@alkitu/shared';
import type { LocationListOrganismProps } from './LocationListOrganism.types';

/**
 * LocationListOrganism - Organism Component (ALI-117)
 *
 * A complete work locations management interface with CRUD operations.
 * Follows Atomic Design principles as a self-contained feature component.
 *
 * Features:
 * - List all user work locations
 * - Add new location (inline form)
 * - Edit existing location (inline form)
 * - Delete location with confirmation
 * - Empty state for no locations
 * - Loading states
 * - Error handling
 * - Auto-refresh after CRUD operations
 *
 * @example
 * ```tsx
 * <LocationListOrganism
 *   showAddButton
 *   onLocationChange={() => console.log('Locations changed')}
 * />
 * ```
 */
export const LocationListOrganism: React.FC<LocationListOrganismProps> = ({
  className = '',
  showAddButton = true,
  userId,
  onLocationChange,
}) => {
  const [locations, setLocations] = useState<(WorkLocation & { _count?: { requests: number } })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState<WorkLocation | null>(
    null,
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch locations
  const fetchLocations = async () => {
    try {
      setIsLoading(true);
      setError('');

      const url = userId ? `/api/locations?userId=${userId}` : '/api/locations';
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch locations');
      }

      setLocations(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load locations',
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    void fetchLocations();
  }, [userId]);

  // Handle add new location
  const handleAddClick = () => {
    setEditingLocation(null);
    setShowForm(true);
  };

  // Handle edit location
  const handleEdit = (location: WorkLocation) => {
    setEditingLocation(location);
    setShowForm(true);
  };

  // Handle delete location
  const handleDelete = async (location: WorkLocation) => {
    if (!confirm(`Are you sure you want to delete this location?\n\n${location.street}, ${location.city}, ${location.state}`)) {
      return;
    }

    try {
      setDeletingId(location.id);
      setError('');

      const response = await fetch(`/api/locations/${location.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete location');
      }

      // Refresh list
      await fetchLocations();

      if (onLocationChange) {
        onLocationChange();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete location',
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Handle form success
  const handleFormSuccess = async () => {
    setShowForm(false);
    setEditingLocation(null);
    await fetchLocations();

    if (onLocationChange) {
      onLocationChange();
    }
  };

  // Handle form cancel
  const handleFormCancel = () => {
    setShowForm(false);
    setEditingLocation(null);
  };

  return (
    <div className={`space-y-6 ${className}`} data-testid="location-list">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Work Locations</h2>
          <p className="text-sm text-gray-600">
            Manage your work locations for service requests
          </p>
        </div>

        {showAddButton && !showForm && (
          <Button onClick={handleAddClick} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Location
          </Button>
        )}
      </div>

      {/* Error Message */}
      {error && <FormError message={error} />}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
          <LocationFormOrganism
            initialData={editingLocation || undefined}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
            showCancel
            userId={userId}
          />
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
            <p className="mt-4 text-sm text-gray-600">Loading locations...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && locations.length === 0 && !showForm && (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <MapPin className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            No locations yet
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Get started by adding your first work location.
          </p>
          {showAddButton && (
            <Button onClick={handleAddClick} className="mt-6 gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Location
            </Button>
          )}
        </div>
      )}

      {/* Locations List */}
      {!isLoading && locations.length > 0 && (
        <div className="space-y-4">
          <div className="text-sm font-medium text-gray-700">
            {locations.length} {locations.length === 1 ? 'Location' : 'Locations'}
          </div>

          <div className="flex flex-col gap-4">
            {locations.map((location) => {
              const requestCount = location._count?.requests ?? 0;
              const hasRequests = requestCount > 0;
              return (
                <LocationCardMolecule
                  key={location.id}
                  location={location}
                  showEdit={!hasRequests}
                  showDelete={!hasRequests}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isDeleting={deletingId === location.id}
                  requestCount={requestCount}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
