'use client';

import { CategoryListOrganism } from '@/components/organisms/category';

/**
 * Categories Management Page (ALI-118)
 *
 * Admin page for managing service categories.
 * Provides full CRUD interface using CategoryListOrganism.
 *
 * Features:
 * - View all categories with service count
 * - Create new categories
 * - Edit existing categories
 * - Delete categories (if they have no services)
 *
 * @route /admin/catalog/categories
 * @access ADMIN only
 */
import { AdminPageHeader } from '@/components/molecules-alianza/AdminPageHeader';

// (imports)

export default function CategoriesPage() {
  return (
    <div className="p-6 space-y-6">
      <AdminPageHeader
        title="Service Categories"
        description="Manage categories for organizing your services"
      />

      <CategoryListOrganism showAddButton />
    </div>
  );
}
