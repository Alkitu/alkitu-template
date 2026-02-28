'use client';

import React from 'react';
import { Button } from '@/components/primitives/ui/button';
import { Building2, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LocationCardMoleculeProps } from './LocationCardMolecule.types';
import { LocationIconMolecule } from './LocationIconMolecule';

/**
 * LocationCardMolecule - Molecule Component (ALI-117)
 *
 * Displays a work location in a card/list format with optional edit/delete actions.
 * Follows Atomic Design principles as a self-contained display component.
 *
 * Features:
 * - Displays all location fields (street, city, state, zip)
 * - Shows optional fields (building, tower, floor, unit) when present
 * - Edit and delete action buttons
 * - Loading state for delete operation
 * - Responsive layout (Full width list item)
 * - Custom Icon support (Lucide or Emoji)
 * - Default badge support
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
  requestCount,
}) => {
  // Build address line 1 (building, tower, floor, unit)
  const addressLine1Parts = [
    location.building,
    location.tower,
    location.floor,
    location.unit,
  ].filter(Boolean);
  const hasAddressLine1 = addressLine1Parts.length > 0;

  const iconColor = location.iconColor || '#2563eb';

  return (
    <div
      className={cn(
        'group flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md',
        location.isDefault && 'border-blue-200 bg-blue-50/30',
        className,
      )}
      data-testid="location-card"
    >
      <div className="flex items-center gap-4">
        {/* Location Icon */}
        <LocationIconMolecule
          icon={location.icon}
          iconColor={iconColor}
          size="md"
          isDefault={location.isDefault}
        />

        {/* Location Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4
              className="truncate font-medium text-gray-900"
              data-testid="location-card-street"
            >
              {location.street}
            </h4>
            {location.isDefault && (
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                Default
              </span>
            )}
            {requestCount != null && requestCount > 0 && (
              <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                {requestCount} {requestCount === 1 ? 'request' : 'requests'}
              </span>
            )}
          </div>

          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm text-gray-500">
            {hasAddressLine1 && (
              <>
                <span className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {addressLine1Parts.join(', ')}
                </span>
                <span className="text-gray-300">•</span>
              </>
            )}
            <span>
              {location.city}, {location.state} {location.zip}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex shrink-0 items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
        {(showEdit || showDelete) && (
          <>
            {showEdit && onEdit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(location)}
                disabled={isDeleting}
                className="h-8 w-8 text-gray-500 hover:text-blue-600"
                aria-label="Edit location"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}

            {showDelete && onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(location)}
                disabled={isDeleting}
                className="h-8 w-8 text-gray-500 hover:text-red-600"
                aria-label="Delete location"
              >
                {isDeleting ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-red-600" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
