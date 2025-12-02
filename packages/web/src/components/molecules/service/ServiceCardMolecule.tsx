'use client';

import React from 'react';
import { Button } from '@/components/primitives/ui/button';
import { Wrench, Edit, Trash2, Folder, Image } from 'lucide-react';
import type { ServiceCardMoleculeProps } from './ServiceCardMolecule.types';

/**
 * ServiceCardMolecule - Molecule Component (ALI-118)
 *
 * Displays a service in a card format with optional edit/delete actions.
 * Shows service name, category, thumbnail, and creation date.
 * Follows Atomic Design principles as a self-contained display component.
 *
 * Features:
 * - Displays service name and category
 * - Shows thumbnail image if available
 * - Edit and delete action buttons
 * - Loading state for delete operation
 * - Responsive layout
 *
 * @example
 * ```tsx
 * <ServiceCardMolecule
 *   service={service}
 *   showEdit
 *   showDelete
 *   onEdit={(svc) => handleEdit(svc)}
 *   onDelete={(svc) => handleDelete(svc)}
 * />
 * ```
 */
export const ServiceCardMolecule: React.FC<ServiceCardMoleculeProps> = ({
  service,
  className = '',
  showEdit = true,
  showDelete = true,
  onEdit,
  onDelete,
  isDeleting = false,
}) => {
  const fieldCount = service.requestTemplate?.fields?.length ?? 0;

  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${className}`}
      data-testid="service-card"
    >
      <div className="flex items-start justify-between">
        {/* Service Icon and Info */}
        <div className="flex-1">
          <div className="flex items-start gap-3">
            {/* Thumbnail or Icon */}
            <div className="mt-1 flex-shrink-0">
              {service.thumbnail ? (
                <div className="h-10 w-10 overflow-hidden rounded-lg border border-gray-200">
                  <img
                    src={service.thumbnail}
                    alt={service.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      // Fallback to icon if image fails to load
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML =
                        '<div class="flex h-full w-full items-center justify-center bg-blue-50"><svg class="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg></div>';
                    }}
                  />
                </div>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                  <Wrench className="h-5 w-5 text-blue-600" />
                </div>
              )}
            </div>

            <div className="flex-1">
              {/* Service Name */}
              <div className="font-medium text-gray-900">{service.name}</div>

              {/* Category */}
              <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                <Folder className="h-4 w-4" />
                <span>{service.category.name}</span>
              </div>

              {/* Request Template Fields Count */}
              <div className="mt-1 text-xs text-gray-500">
                {fieldCount} {fieldCount === 1 ? 'field' : 'fields'} in form
                template
              </div>

              {/* Created Date */}
              <div className="mt-2 text-xs text-gray-400">
                Created {new Date(service.createdAt).toLocaleDateString()}
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
                onClick={() => onEdit(service)}
                disabled={isDeleting}
                className="h-8 w-8 p-0"
                aria-label="Edit service"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}

            {showDelete && onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(service)}
                disabled={isDeleting}
                className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                aria-label="Delete service"
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
