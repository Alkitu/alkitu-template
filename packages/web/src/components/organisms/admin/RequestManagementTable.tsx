'use client';

import React, { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/trpc-error-handler';
import { trpc } from '@/lib/trpc';
import { RequestStatus } from '@alkitu/shared';

// Alianza Components
import { UserStatsCard } from '@/components/atoms-alianza/UserStatsCard';
import { Button } from '@/components/molecules-alianza/Button';
import { InputGroup } from '@/components/molecules-alianza/InputGroup';
import { Combobox } from '@/components/molecules-alianza/Combobox';
import { RequestFilterButtons } from '@/components/molecules-alianza/RequestFilterButtons';
import { RequestsTableAlianza } from '@/components/organisms-alianza/RequestsTableAlianza';
import { RequestsTableSkeleton } from '@/components/organisms-alianza/RequestsTableSkeleton';
import { UserPagination } from '@/components/molecules-alianza/UserPagination';
import { QuickAssignModal } from '@/components/molecules/request';

// Types
import {
  RequestManagementTableProps,
  RequestFilterType,
  RequestFilters,
  RequestStats,
  RequestTableItem,
} from './RequestManagementTable.types';

/**
 * RequestManagementTable Organism
 *
 * Comprehensive admin request management interface with filtering,
 * searching, sorting, pagination, and action modals.
 *
 * @component
 * @example
 * ```tsx
 * <RequestManagementTable
 *   lang="es"
 *   onRequestUpdated={() => console.log('Updated')}
 * />
 * ```
 */
export const RequestManagementTable: React.FC<RequestManagementTableProps> = ({
  lang,
  mode = 'admin',
  onRequestUpdated,
  onRequestCancelled,
  onRequestCompleted,
}) => {
  const isClient = mode === 'client';
  const router = useRouter();
  const searchParams = useSearchParams();

  // State management
  const [activeFilter, setActiveFilter] = useState<RequestFilterType>(isClient ? 'ongoing' : 'pending');
  const [searchValue, setSearchValue] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    searchParams.get('serviceId') || '',
  );
  const [filters, setFilters] = useState<RequestFilters>({
    search: '',
    status: undefined,
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Debounced filters for API calls
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  // Debounce effect for search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters((prev) => ({
        ...prev,
        search: searchValue,
        page: 1,
      }));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  // Fetch all services for the filter combobox
  const { data: servicesData } = trpc.service.getAllServices.useQuery({
    page: 1,
    limit: 100,
    sortBy: 'name',
    sortOrder: 'asc',
    statusFilter: 'all',
  });

  const serviceOptions = useMemo(() => {
    if (!servicesData?.items) return [];
    return servicesData.items.map((s: any) => ({
      id: s.id,
      label: s.name,
      value: s.id,
      badge: s.deletedAt
        ? { text: 'Inactivo', variant: 'outline' as const }
        : undefined,
    }));
  }, [servicesData]);

  // Build query parameters based on active filter
  const queryParams = useMemo(() => {
    const params: any = {
      page: debouncedFilters.page,
      limit: debouncedFilters.limit,
      sortBy: debouncedFilters.sortBy,
      sortOrder: debouncedFilters.sortOrder,
    };

    // Map filter to status
    switch (activeFilter) {
      case 'pending':
        params.status = RequestStatus.PENDING;
        break;
      case 'ongoing':
        params.status = RequestStatus.ONGOING;
        break;
      case 'completed':
        params.status = RequestStatus.COMPLETED;
        break;
      case 'cancelled':
        params.status = RequestStatus.CANCELLED;
        break;
      case 'all':
      default:
        break;
    }

    // Service filter
    if (selectedServiceId) {
      params.serviceId = selectedServiceId;
    }

    return params;
  }, [debouncedFilters, activeFilter, selectedServiceId]);

  // Fetch requests using tRPC
  const {
    data: requestsData,
    isLoading,
    isError,
    refetch,
  } = trpc.request.getFilteredRequests.useQuery(queryParams);

  // Fetch request stats using tRPC
  const { data: statsData } = trpc.request.getRequestStats.useQuery({});

  // tRPC mutation for assigning requests
  const assignMutation = trpc.request.assignRequest.useMutation();

  // Compute stats
  const stats: RequestStats = useMemo(() => {
    if (!statsData) {
      return { total: 0, pending: 0, ongoing: 0, completed: 0, cancelled: 0 };
    }
    return {
      total: statsData.total || 0,
      pending: statsData.byStatus?.PENDING || 0,
      ongoing: statsData.byStatus?.ONGOING || 0,
      completed: statsData.byStatus?.COMPLETED || 0,
      cancelled: statsData.byStatus?.CANCELLED || 0,
    };
  }, [statsData]);

  // Event handlers
  const handleFilterChange = (filter: RequestFilterType) => {
    setActiveFilter(filter);
    setDebouncedFilters((prev) => ({ ...prev, page: 1 }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleServiceFilterChange = (value: string | string[]) => {
    const serviceId = typeof value === 'string' ? value : '';
    setSelectedServiceId(serviceId);
    setDebouncedFilters((prev) => ({ ...prev, page: 1 }));
  };

  const handleAddRequest = () => {
    router.push(isClient ? `/${lang}/client/requests/new` : `/${lang}/admin/requests/create`);
  };

  const handleViewRequest = (requestId: string, clientEmail: string) => {
    router.push(isClient ? `/${lang}/client/requests/${requestId}` : `/${lang}/admin/requests/${requestId}`);
  };

  const handleAssignRequest = (requestId: string) => {
    setSelectedRequestId(requestId);
    setIsAssignModalOpen(true);
  };

  const handleAssignConfirm = async (requestId: string, employeeId: string) => {
    setActionLoading(true);
    try {
      await assignMutation.mutateAsync({ id: requestId, assignedToId: employeeId });
      toast.success('Empleado asignado correctamente');
      await refetch();
      setIsAssignModalOpen(false);
      onRequestUpdated?.();
    } catch (error) {
      handleApiError(error);
    } finally {
      setActionLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setDebouncedFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (size: number) => {
    setDebouncedFilters((prev) => ({ ...prev, limit: size, page: 1 }));
  };

  // Transform requests data for table
  const tableRequests: RequestTableItem[] = useMemo(() => {
    return (requestsData?.requests || []).map((req: any) => {
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
  }, [requestsData]);

  const pagination = requestsData?.pagination;

  // Error state
  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-destructive">Error al cargar solicitudes.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[36px]">
      {/* Stats Cards */}
      <div className="flex gap-[42px] items-center overflow-x-auto pb-4 scrollbar-hide">
        <UserStatsCard
          label="Total de Solicitudes"
          value={stats.total}
          variant="default"
        />
        <UserStatsCard
          label="Pendientes"
          value={stats.pending}
          variant="accent"
        />
        <UserStatsCard
          label="En Progreso"
          value={stats.ongoing}
          variant="accent"
        />
        <UserStatsCard
          label="Completadas"
          value={stats.completed}
          variant="accent"
        />
        <UserStatsCard
          label="Canceladas"
          value={stats.cancelled}
          variant="accent"
        />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Filter Buttons */}
        <RequestFilterButtons
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />

        {/* Service Filter + Search + Create Button */}
        <div className="flex items-center gap-3">
          {!isClient && (
            <Combobox
              options={serviceOptions}
              value={selectedServiceId}
              onChange={handleServiceFilterChange}
              placeholder="Filtrar por servicio..."
              searchPlaceholder="Buscar servicio..."
              emptyMessage="No se encontraron servicios."
              clearable
              className="w-[220px]"
            />
          )}
          <InputGroup
            placeholder="Buscar solicitudes..."
            value={searchValue}
            onChange={handleSearchChange}
            iconLeft={<Search className="h-4 w-4 text-muted-foreground" />}
            className="w-[200px] md:w-[250px]"
          />
          <Button
            variant="active"
            onClick={handleAddRequest}
            iconLeft={<Plus className="h-4 w-4" />}
          >
            Nueva Solicitud
          </Button>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-secondary border border-secondary-foreground rounded-[8px] overflow-hidden">
        {isLoading ? (
          <RequestsTableSkeleton rowCount={debouncedFilters.limit} />
        ) : (
          <RequestsTableAlianza
            requests={tableRequests}
            lang={lang}
            onViewRequest={handleViewRequest}
            onAssignRequest={isClient ? undefined : handleAssignRequest}
            hideColumns={isClient ? ['client', 'assignedTo'] : []}
          />
        )}
      </div>

      {/* Pagination */}
      {pagination && (
        <UserPagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          pageSize={debouncedFilters.limit}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      {/* Assign/Reassign Employee Modal (admin only) */}
      {!isClient && selectedRequestId && (
        <QuickAssignModal
          open={isAssignModalOpen}
          onOpenChange={setIsAssignModalOpen}
          requestId={selectedRequestId}
          onConfirm={handleAssignConfirm}
          isLoading={actionLoading}
        />
      )}
    </div>
  );
};
