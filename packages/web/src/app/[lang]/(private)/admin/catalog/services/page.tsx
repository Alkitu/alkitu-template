'use client';

import { ServiceListOrganism } from '@/components/organisms/service';

/**
 * Services Management Page (ALI-118)
 *
 * Admin page for managing services.
 * Provides full CRUD interface using ServiceListOrganism.
 *
 * Features:
 * - View all services with category info
 * - Create new services with request templates
 * - Edit existing services
 * - Delete services
 *
 * @route /admin/catalog/services
 * @access ADMIN only
 */
export default function ServicesPage() {
  return (
    <div className="container mx-auto max-w-7xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Services</h1>
        <p className="mt-2 text-gray-600">
          Manage services and their request form templates
        </p>
      </div>

      <ServiceListOrganism showAddButton />
    </div>
  );
}
