'use client';

import { useParams, useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import { AdminPageHeader } from '@/components/molecules-alianza/AdminPageHeader';
import { BreadcrumbNavigation } from '@/components/molecules-alianza/Breadcrumb';
import { CategoryServiceTree } from '@/components/organisms-alianza/CategoryServiceTree';

/**
 * Admin Catalog Overview Page
 *
 * Displays complete Category → Service → Request hierarchy in tree view.
 * Provides bird's-eye view of the entire catalog with request statistics.
 *
 * Features:
 * - Collapsible category tree
 * - Request stats per service
 * - Direct navigation to filtered requests
 * - Real-time data with tRPC
 */
export default function CatalogOverviewPage() {
  const { lang } = useParams();
  const router = useRouter();

  // Fetch categories with full stats hierarchy
  const { data: categoriesData, isLoading } =
    trpc.category.getCategoriesWithStats.useQuery({});

  const handleServiceClick = (serviceId: string) => {
    router.push(`/${lang}/admin/requests?serviceId=${serviceId}`);
  };

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/${lang}/admin/catalog/categories/${categoryId}`);
  };

  return (
    <div className="flex flex-col gap-[36px] p-6">
      {/* Page Header with Breadcrumbs */}
      <AdminPageHeader
        title="Vista General del Catálogo"
        description="Visualiza la jerarquía completa de categorías, servicios y solicitudes"
        breadcrumbs={
          <BreadcrumbNavigation
            items={[
              { label: 'Dashboard', href: `/${lang}/admin` },
              { label: 'Catálogo', href: `/${lang}/admin/catalog` },
              { label: 'Vista General', current: true },
            ]}
            separator="chevron"
            size="sm"
          />
        }
      />

      {/* Category Service Tree */}
      <div className="bg-card border border-border rounded-lg p-6">
        <CategoryServiceTree
          data={categoriesData || []}
          isLoading={isLoading}
          onServiceClick={handleServiceClick}
          onCategoryClick={handleCategoryClick}
          expandedCategories={[]}
          showStats
        />
      </div>

      {/* Info Card */}
      {!isLoading && categoriesData && categoriesData.length > 0 && (
        <div className="bg-accent/30 border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">💡 Consejo:</strong> Haz clic
            en una categoría para expandir/colapsar sus servicios. Haz clic en un
            servicio para ver todas sus solicitudes.
          </p>
        </div>
      )}
    </div>
  );
}
