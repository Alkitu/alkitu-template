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
export default function CategoriesPage() {
  return (
    <div className="container mx-auto max-w-7xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Service Categories
        </h1>
        <p className="mt-2 text-gray-600">
          Manage categories for organizing your services
        </p>
      </div>

      <CategoryListOrganism showAddButton />
    </div>
  );
}
