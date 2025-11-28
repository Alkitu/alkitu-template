'use client';

import React from 'react';
import { Button } from '@/components/primitives/ui/button';
import { MapPin, Building2, Edit, Trash2 } from 'lucide-react';
import type { LocationCardMoleculeProps } from './LocationCardMolecule.types';

/**
 * LocationCardMolecule - Molecule Component (ALI-117)
 *
 * Displays a work location in a card format with optional edit/delete actions.
 * Follows Atomic Design principles as a self-contained display component.
 *
 * Features:
 * - Displays all location fields (street, city, state, zip)
 * - Shows optional fields (building, tower, floor, unit) when present
 * - Edit and delete action buttons
 * - Loading state for delete operation
 * - Responsive layout
 *
 * @example
 * ```tsx
 * <LocationCardMolecule
 *   location={location}
 *   showEdit
 *   showDelete
 *   onEdit={(loc) => handleEdit(loc)}
 *   onDelete={(loc) => handleDelete(loc)}
 * />
 * ```
 */
export const LocationCardMolecule: React.FC<LocationCardMoleculeProps> = ({
  location,
  className = '',
  showEdit = true,
  showDelete = true,
  onEdit,
  onDelete,
  isDeleting = false,
}) => {
  // Build address line 1 (building, tower, floor, unit)
  const addressLine1Parts = [
    location.building,
    location.tower,
    location.floor,
    location.unit,
  ].filter(Boolean);
  const hasAddressLine1 = addressLine1Parts.length > 0;

  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${className}`}
      data-testid="location-card"
    >
      <div className="flex items-start justify-between">
        {/* Location Icon and Info */}
        <div className="flex-1">
          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-full bg-blue-50 p-2">
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>

            <div className="flex-1">
              {/* Address Line 1 (optional fields) */}
              {hasAddressLine1 && (
                <div className="mb-1 flex items-center gap-2 text-sm text-gray-600">
                  <Building2 className="h-4 w-4" />
                  <span>{addressLine1Parts.join(', ')}</span>
                </div>
              )}

              {/* Street Address */}
              <div className="font-medium text-gray-900">{location.street}</div>

              {/* City, State, ZIP */}
              <div className="mt-1 text-sm text-gray-600">
                {location.city}, {location.state} {location.zip}
              </div>

              {/* Created Date */}
              <div className="mt-2 text-xs text-gray-400">
                Added {new Date(location.createdAt).toLocaleDateString()}
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
                onClick={() => onEdit(location)}
                disabled={isDeleting}
                className="h-8 w-8 p-0"
                aria-label="Edit location"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}

            {showDelete && onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(location)}
                disabled={isDeleting}
                className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                aria-label="Delete location"
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
