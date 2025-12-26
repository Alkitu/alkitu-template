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
import { AdminPageHeader } from '@/components/molecules/admin-page-header';

// (imports)

export default function ServicesPage() {
  return (
    <div className="p-6 space-y-6">
      <AdminPageHeader
        title="Services"
        description="Manage services and their request form templates"
      />

      <ServiceListOrganism showAddButton />
    </div>
  );
}
