'use client';

import React, { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { useParams, useRouter } from 'next/navigation';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { RequestStatus } from '@alkitu/shared';

// Alianza Components (Atomic Design)
import { Heading } from '@/components/atoms-alianza/Typography';
import { UserStatsCard } from '@/components/atoms-alianza/UserStatsCard';
import { Button } from '@/components/molecules-alianza/Button';
import { InputGroup } from '@/components/molecules-alianza/InputGroup';
import { RequestFilterButtons, type RequestFilterType } from '@/components/molecules-alianza/RequestFilterButtons';
import { RequestsTableAlianza, type RequestTableItem } from '@/components/organisms-alianza/RequestsTableAlianza';
import { RequestsTableSkeleton } from '@/components/organisms-alianza/RequestsTableSkeleton';
import { UserPagination } from '@/components/molecules-alianza/UserPagination';
import { QuickAssignModal } from '@/components/molecules/request';

interface RequestFilters {
  search: string;
  status: RequestStatus | undefined;
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

/**
 * Admin Service Requests Page (ALI-119)
 * Migrated to Alianza Design System
 */
export default function AdminRequestsPage() {
  const { lang } = useParams();
  const router = useRouter();

  // State
  const [activeFilter, setActiveFilter] = useState<RequestFilterType>('all');
  const [searchValue, setSearchValue] = useState('');
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
        page: 1
      }));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

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
        // No status filter = all requests
        break;
    }

    return params;
  }, [debouncedFilters, activeFilter]);

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

  const stats = useMemo(() => {
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

  // Handlers
  const handleFilterChange = (filter: RequestFilterType) => {
    setActiveFilter(filter);
    setDebouncedFilters((prev) => ({ ...prev, page: 1 }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleAddRequest = () => {
    router.push(`/${lang}/admin/requests/create`);
  };

  const handleViewRequest = (requestId: string, clientEmail: string) => {
    router.push(`/${lang}/admin/requests/${requestId}`);
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
      refetch(); // Refresh the table
      setIsAssignModalOpen(false);
    } catch (error: any) {
      toast.error(error?.message || 'Error al asignar empleado');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteRequest = (requestId: string) => {
    // TODO: Implement complete modal
    toast.info('Función de completar en desarrollo');
  };

  const handleCancelRequest = (requestId: string) => {
    // TODO: Implement cancel modal
    toast.info('Función de cancelar en desarrollo');
  };

  const handleEditRequest = (requestId: string) => {
    router.push(`/${lang}/admin/requests/${requestId}/edit`);
  };

  const handlePageChange = (newPage: number) => {
    setDebouncedFilters((prev) => ({ ...prev, page: newPage }));
  };

  // Error state
  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-destructive">Error al cargar solicitudes.</div>
      </div>
    );
  }

  // Transform requests data for table
  const tableRequests: RequestTableItem[] = (requestsData?.requests || []).map((req: any) => {
    // Extract time from executionDateTime
    const executionDate = new Date(req.executionDateTime);
    const executionTime = executionDate.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    return {
      id: req.id,
      serviceName: req.service?.name || 'N/A',
      categoryName: req.service?.category?.name || 'N/A',
      clientName: `${req.user?.firstname || ''} ${req.user?.lastname || ''}`.trim() || 'N/A',
      clientEmail: req.user?.email,
      status: req.status,
      executionDateTime: req.executionDateTime,
      assignedTo: req.assignedTo
        ? `${req.assignedTo.firstname || ''} ${req.assignedTo.lastname || ''}`.trim()
        : undefined,
      // Enhanced fields
      executionTime,
      locationCity: req.location?.city,
      locationState: req.location?.state,
    };
  });

  const pagination = requestsData?.pagination;

  return (
    <div className="flex flex-col gap-[36px] p-6">
      {/* Page Title */}
      <Heading level={1} className="text-foreground">
        Solicitudes de Servicio
      </Heading>

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

        {/* Search + Create Button */}
        <div className="flex items-center gap-3">
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
            lang={lang as string}
            onViewRequest={handleViewRequest}
            onAssignRequest={handleAssignRequest}
            onCompleteRequest={handleCompleteRequest}
            onCancelRequest={handleCancelRequest}
            onEditRequest={handleEditRequest}
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
          onPageChange={(page) => handlePageChange(page)}
          onPageSizeChange={(size) =>
            setDebouncedFilters((prev) => ({ ...prev, limit: size, page: 1 }))
          }
        />
      )}

      {/* Assign/Reassign Employee Modal */}
      {selectedRequestId && (
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
}
