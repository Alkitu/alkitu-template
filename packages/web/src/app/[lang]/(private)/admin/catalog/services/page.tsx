'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/trpc-error-handler';
import { useTranslations } from '@/context/TranslationsContext';

// Alianza Components (Atomic Design)
import { ServiceStatsCard } from '@/components/atoms-alianza/ServiceStatsCard';
import { Button } from '@/components/molecules-alianza/Button';
import { InputGroup } from '@/components/molecules-alianza/InputGroup';
import { ServiceFilterButtons, type ServiceFilterType } from '@/components/molecules-alianza/ServiceFilterButtons';
import { ServicesTableAlianza, type ServiceTableItem } from '@/components/organisms-alianza/ServicesTableAlianza';
import { UserPagination } from '@/components/molecules-alianza/UserPagination';
import { AdminPageHeader } from '@/components/molecules-alianza/AdminPageHeader';
import { BreadcrumbNavigation } from '@/components/molecules-alianza/Breadcrumb';

import { useRouter, useParams } from 'next/navigation';
import { trpc } from '@/lib/trpc';

const ServicesPage = () => {
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;
  const t = useTranslations();

  // State
  const [activeFilter, setActiveFilter] = useState<ServiceFilterType>('active');
  const [searchValue, setSearchValue] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  // tRPC queries - fetch services with server-side status filter
  const { data: servicesData, isLoading, refetch } = trpc.service.getAllServices.useQuery({
    page: pagination.page,
    limit: pagination.limit,
    sortBy: 'name',
    sortOrder: 'asc',
    statusFilter: activeFilter,
  });

  // Fetch categories count
  const { data: categories } = trpc.category.getAllCategories.useQuery();

  // Delete mutation
  const deleteServiceMutation = trpc.service.deleteService.useMutation({
    onSuccess: (data) => {
      if (data?.action === 'deleted') {
        toast.success(t('admin.catalog.services.messages.deleteSuccess'));
      } else {
        toast.info(t('admin.catalog.services.messages.deactivated'));
      }
      refetch();
    },
    onError: (error) => handleApiError(error),
  });

  // Map API response to ServiceTableItem format
  const allServices: ServiceTableItem[] = useMemo(() => {
    if (!servicesData?.items) return [];
    return servicesData.items.map((service: any) => ({
      id: service.id,
      name: service.name,
      category: service.category?.name || t('admin.catalog.services.table.noCategory'),
      status: (service.deletedAt ? 'INACTIVE' : 'ACTIVE') as 'ACTIVE' | 'INACTIVE',
      questionsCount: service.fieldCount || 0,
      thumbnail: service.thumbnail,
      iconColor: service.iconColor,
      requestStats: {
        total: service.requestCount || 0,
        pending: 0,
        ongoing: 0,
      },
    }));
  }, [servicesData, t]);

  // Client-side search filter (status is handled server-side via statusFilter)
  const filteredServices = useMemo(() => {
    if (!searchValue) return allServices;
    return allServices.filter(service =>
      service.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [allServices, searchValue]);

  // Pagination from API response
  const totalItems = servicesData?.pagination?.total || 0;
  const totalPages = servicesData?.pagination?.totalPages || 1;

  // Stats from real data
  const stats = {
    services: totalItems,
    categories: categories?.length || 0,
  };

  // Handlers
  const handleFilterChange = (filter: ServiceFilterType) => {
    setActiveFilter(filter);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newSize: number) => {
    setPagination(prev => ({ ...prev, limit: newSize, page: 1 }));
  };

  const handleAddService = () => {
    router.push(`/${lang}/admin/catalog/services/create`);
  };

  const handleEditService = (id: string) => {
    router.push(`/${lang}/admin/catalog/services/${id}`);
  };

  const handleDeleteService = (id: string) => {
    if(confirm(t('admin.catalog.services.messages.deleteConfirm'))) {
      deleteServiceMutation.mutate({ id });
    }
  };

  // Translated labels for table
  const tableLabels = {
    service: t('admin.catalog.services.table.service'),
    category: t('admin.catalog.services.table.category'),
    status: t('admin.catalog.services.table.status'),
    questions: t('admin.catalog.services.table.questions'),
    requests: t('admin.catalog.services.table.requests'),
    actions: t('admin.catalog.services.table.actions'),
    edit: t('admin.catalog.services.table.edit'),
    delete: t('admin.catalog.services.table.delete'),
    active: t('admin.catalog.services.table.active'),
    inactive: t('admin.catalog.services.table.inactive'),
  };

  // Translated labels for request links
  const requestLinkLabels = {
    noRequests: t('admin.catalog.services.requestLink.noRequests'),
    request: t('admin.catalog.services.requestLink.request'),
    requests: t('admin.catalog.services.requestLink.requests'),
    pending: t('admin.catalog.services.requestLink.pending'),
    pendingPlural: t('admin.catalog.services.requestLink.pendingPlural'),
    pendingTitle: t('admin.catalog.services.requestLink.pendingTitle'),
    ongoingTitle: t('admin.catalog.services.requestLink.ongoingTitle'),
    viewRequests: t('admin.catalog.services.requestLink.viewRequests'),
  };

  // Translated labels for filter
  const filterLabels = {
    all: t('admin.catalog.services.filters.all'),
    active: t('admin.catalog.services.filters.active'),
    inactive: t('admin.catalog.services.filters.inactive'),
    placeholder: t('admin.catalog.services.filters.placeholder'),
  };

  // Translated labels for pagination
  const paginationLabels = {
    showing: t('Common.pagination.showing'),
    to: t('Common.pagination.to'),
    of: t('Common.pagination.of'),
    results: t('Common.pagination.results'),
    rowsPerPage: t('Common.pagination.rowsPerPage'),
    page: t('Common.pagination.page'),
    previous: t('Common.pagination.previous'),
    next: t('Common.pagination.next'),
  };

  return (
    <div className="flex flex-col gap-[36px] p-6">
      {/* Page Header with Breadcrumbs */}
      <AdminPageHeader
        title={t('admin.catalog.services.title')}
        description={t('admin.catalog.services.description')}
        breadcrumbs={
          <BreadcrumbNavigation
            items={[
              { label: t('admin.catalog.services.breadcrumbs.dashboard'), href: `/${lang}/admin` },
              { label: t('admin.catalog.services.breadcrumbs.catalog'), href: `/${lang}/admin/catalog` },
              { label: t('admin.catalog.services.breadcrumbs.services'), current: true },
            ]}
            separator="chevron"
            size="sm"
          />
        }
        actions={
          <Button
            variant="active"
            onClick={handleAddService}
            iconLeft={<Plus className="h-4 w-4" />}
          >
            {t('admin.catalog.services.actions.createService')}
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="flex gap-[42px] items-center overflow-x-auto pb-4 scrollbar-hide">
        <ServiceStatsCard
          label={t('admin.catalog.services.stats.services')}
          value={stats.services}
        />
        <ServiceStatsCard
          label={t('admin.catalog.services.stats.categories')}
          value={stats.categories}
          variant="accent"
        />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Filter Buttons */}
        <ServiceFilterButtons
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          labels={filterLabels}
        />

        {/* Search Bar */}
        <InputGroup
          placeholder={t('admin.catalog.services.actions.search')}
          value={searchValue}
          onChange={handleSearchChange}
          iconLeft={<Search className="h-4 w-4 text-muted-foreground" />}
          className="w-[200px] md:w-[250px]"
        />
      </div>

      {/* Services Table */}
      <div className="bg-secondary border border-secondary/20 rounded-[8px] overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-[400px]">
            <p className="text-muted-foreground">{t('admin.catalog.services.loading')}</p>
          </div>
        ) : (
          <ServicesTableAlianza
            services={filteredServices}
            onEdit={handleEditService}
            onDelete={handleDeleteService}
            showRequestsColumn
            lang={lang}
            labels={tableLabels}
            requestLinkLabels={requestLinkLabels}
          />
        )}
      </div>

      {/* Pagination */}
      <UserPagination
        currentPage={pagination.page}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pagination.limit}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        labels={paginationLabels}
      />
    </div>
  );
};

export default ServicesPage;
