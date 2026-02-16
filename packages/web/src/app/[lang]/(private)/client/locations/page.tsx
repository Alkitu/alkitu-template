'use client';

import { LocationListOrganism } from '@/components/organisms/location';

/**
 * Work Locations Page (ALI-117)
 *
 * User work locations management page.
 * Allows authenticated users to manage their work locations for service requests.
 *
 * Features:
 * - List all user work locations
 * - Add new locations
 * - Edit existing locations
 * - Delete locations
 * - Empty state for first-time users
 * - JWT authentication required
 *
 * @route /[lang]/locations
 */
export default function LocationsPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <LocationListOrganism showAddButton />
    </div>
  );
}
