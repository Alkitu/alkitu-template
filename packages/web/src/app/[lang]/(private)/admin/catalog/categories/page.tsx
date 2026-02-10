'use client';

import { useParams } from 'next/navigation';
import { CategoryListOrganism } from '@/components/organisms/category';
import { AdminPageHeader } from '@/components/molecules-alianza/AdminPageHeader';
import { BreadcrumbNavigation } from '@/components/molecules-alianza/Breadcrumb';

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
  const { lang } = useParams();

  return (
    <div className="p-6 space-y-6">
      <AdminPageHeader
        title="Categorías de Servicio"
        description="Gestiona las categorías para organizar tus servicios"
        breadcrumbs={
          <BreadcrumbNavigation
            items={[
              { label: 'Dashboard', href: `/${lang}/admin` },
              { label: 'Catálogo', href: `/${lang}/admin/catalog` },
              { label: 'Categorías', current: true },
            ]}
            separator="chevron"
            size="sm"
          />
        }
      />

      <CategoryListOrganism showAddButton />
    </div>
  );
}
