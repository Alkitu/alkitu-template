'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { RequestStatus } from '@prisma/client';

// Alianza Components (Reused from admin)
import { AdminPageHeader } from '@/components/molecules-alianza/AdminPageHeader';
import { BreadcrumbNavigation } from '@/components/molecules-alianza/Breadcrumb';
import { InputGroup } from '@/components/molecules-alianza/InputGroup';
import { RequestsTableAlianza } from '@/components/organisms-alianza/RequestsTableAlianza';
import { UserPagination } from '@/components/molecules-alianza/UserPagination';

/**
 * Employee Requests Page
 *
 * Displays all requests assigned to the employee with filtering and search.
 *
 * Features:
 * - tRPC with role-based filtering (backend automatically filters)
 * - Status filtering (PENDING, ONGOING, COMPLETED, CANCELLED)
 * - Search functionality
 * - Pagination
 * - Reuses admin components for consistency
 *
 * Migration Note: Converted from fetch() to tRPC, reusing RequestsTableAlianza
 */

type FilterType = 'all' | RequestStatus;

export default function EmployeeRequestsPage() {
  const router = useRouter();
  const { lang } = useParams();

  // State
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchValue, setSearchValue] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
  });

  // Build query parameters
  const queryParams = {
    page: pagination.page,
    limit: pagination.limit,
    sortBy: 'createdAt' as const,
    sortOrder: 'desc' as const,
    ...(activeFilter !== 'all' && { status: activeFilter }),
  };

  // Fetch requests with tRPC (backend handles role-based filtering)
  const { data, isLoading } = trpc.request.getFilteredRequests.useQuery(queryParams);

  // Transform requests to table format
  const tableRequests = (data?.requests || []).map((req: any) => {
    const executionDate = new Date(req.executionDateTime);
    const executionTime = executionDate.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    return {
      id: req.id,
      // Use title (specific request title) instead of service name
      serviceName: req.title || req.service?.name || 'N/A',
      categoryName: req.service?.category?.name || 'N/A',
      clientName: `${req.user?.firstname || ''} ${req.user?.lastname || ''}`.trim() || 'N/A',
      clientEmail: req.user?.email,
      status: req.status,
      executionDateTime: req.executionDateTime,
      assignedTo: req.assignedTo
        ? `${req.assignedTo.firstname || ''} ${req.assignedTo.lastname || ''}`.trim()
        : undefined,
      serviceThumbnail: req.service?.thumbnail,
      executionTime,
      locationCity: req.location?.city,
      locationState: req.location?.state,
    };
  });

  // Client-side search filter
  const filteredRequests =
    searchValue && tableRequests
      ? tableRequests.filter(
          (request) =>
            request.serviceName.toLowerCase().includes(searchValue.toLowerCase()) ||
            request.clientName.toLowerCase().includes(searchValue.toLowerCase()) ||
            request.clientEmail?.toLowerCase().includes(searchValue.toLowerCase()),
        )
      : tableRequests;

  // Handlers
  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newSize: number) => {
    setPagination((prev) => ({ ...prev, limit: newSize, page: 1 }));
  };

  const handleViewRequest = (id: string) => {
    router.push(`/${lang}/employee/requests/${id}`);
  };

  return (
    <div className="flex flex-col gap-[36px] p-6">
      {/* Page Header with Breadcrumbs */}
      <AdminPageHeader
        title="Mis Solicitudes"
        description="Gestiona y visualiza todas las solicitudes asignadas"
        breadcrumbs={
          <BreadcrumbNavigation
            items={[
              { label: 'Dashboard', href: `/${lang}/employee` },
              { label: 'Solicitudes', current: true },
            ]}
            separator="chevron"
            size="sm"
          />
        }
      />

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => handleFilterChange(RequestStatus.PENDING)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === RequestStatus.PENDING
                ? 'bg-amber-500 text-white'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Pendientes
          </button>
          <button
            onClick={() => handleFilterChange(RequestStatus.ONGOING)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === RequestStatus.ONGOING
                ? 'bg-blue-500 text-white'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            En Proceso
          </button>
          <button
            onClick={() => handleFilterChange(RequestStatus.COMPLETED)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === RequestStatus.COMPLETED
                ? 'bg-green-500 text-white'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Completadas
          </button>
          <button
            onClick={() => handleFilterChange(RequestStatus.CANCELLED)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === RequestStatus.CANCELLED
                ? 'bg-red-500 text-white'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Canceladas
          </button>
        </div>

        {/* Search Bar */}
        <InputGroup
          placeholder="Buscar solicitudes..."
          value={searchValue}
          onChange={handleSearchChange}
          iconLeft={<Search className="h-4 w-4 text-muted-foreground" />}
          className="w-[200px] md:w-[250px]"
        />
      </div>

      {/* Requests Table */}
      <div className="bg-secondary border border-secondary/20 rounded-[8px] overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-[400px]">
            <div className="text-muted-foreground">Cargando solicitudes...</div>
          </div>
        ) : (
          <RequestsTableAlianza
            requests={filteredRequests}
            lang={lang as string}
            onViewRequest={(id, email) => handleViewRequest(id)}
          />
        )}
      </div>

      {/* Pagination */}
      {data && data.pagination && (
        <UserPagination
          currentPage={pagination.page}
          totalPages={data.pagination.totalPages}
          totalItems={searchValue ? filteredRequests.length : data.pagination.total}
          pageSize={pagination.limit}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
}
