'use client';

import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';

// Alianza Components (Atomic Design)
import { Heading } from '@/components/atoms-alianza/Typography';
import { ServiceStatsCard } from '@/components/atoms-alianza/ServiceStatsCard';
import { Button } from '@/components/molecules-alianza/Button';
import { InputGroup } from '@/components/molecules-alianza/InputGroup';
import { ServiceFilterButtons, type ServiceFilterType } from '@/components/molecules-alianza/ServiceFilterButtons';
import { ServicesTableAlianza, type ServiceTableItem } from '@/components/organisms-alianza/ServicesTableAlianza';
import { UserPagination } from '@/components/molecules-alianza/UserPagination';

import { useRouter, useParams } from 'next/navigation';
// ... imports

const ServicesPage = () => {
  const router = useRouter();
  const params = useParams();
  const lang = params.lang;
  
  // State
  const [activeFilter, setActiveFilter] = useState<ServiceFilterType>('all');
  const [searchValue, setSearchValue] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  // Mock Data
  const stats = {
    services: 24,
    categories: 3,
  };

  // Generate more mock data for pagination testing
  const generateMockServices = (count: number): ServiceTableItem[] => {
    return Array.from({ length: count }).map((_, i) => ({
      id: `${i + 1}`,
      name: i % 2 === 0 ? `Limpieza de Oficina ${i + 1}` : `Mantenimiento ${i + 1}`,
      category: i % 2 === 0 ? 'Limpieza' : 'Mantenimiento',
      status: i % 3 === 0 ? 'INACTIVE' : 'ACTIVE',
      questionsCount: Math.floor(Math.random() * 10) + 1,
    }));
  };

  const allServices: ServiceTableItem[] = React.useMemo(() => generateMockServices(24), []);

  // Filter Logic
  const filteredServices = allServices.filter(service => {
    // Filter by Status
    if (activeFilter === 'active' && service.status !== 'ACTIVE') return false;
    if (activeFilter === 'inactive' && service.status !== 'INACTIVE') return false;
    
    // Filter by Search
    if (searchValue && !service.name.toLowerCase().includes(searchValue.toLowerCase())) return false;

    return true;
  });

  // Pagination Logic
  const totalItems = filteredServices.length;
  const totalPages = Math.ceil(totalItems / pagination.limit);
  const paginatedServices = filteredServices.slice(
    (pagination.page - 1) * pagination.limit,
    pagination.page * pagination.limit
  );

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
    if(confirm('Are you sure you want to delete this service?')) {
        toast.info(`Eliminar servicio ${id} (Mock Action)`);
        // In real app, call mutation here
    }
  };

  return (
    <div className="flex flex-col gap-[36px] p-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
         <Heading level={1} className="text-foreground font-bold">
            Servicios
         </Heading>
         {/* Mock Global Action if needed */}
      </div>

      {/* Stats Cards */}
      <div className="flex gap-[42px] items-center overflow-x-auto pb-4 scrollbar-hide">
        <ServiceStatsCard 
          label="Servicios" 
          value={stats.services} 
        />
        <ServiceStatsCard 
          label="Categorías" 
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
        />

        {/* Search + Create Button */}
        <div className="flex items-center gap-3">
          <InputGroup
            placeholder="Buscar servicios..."
            value={searchValue}
            onChange={handleSearchChange}
            iconLeft={<Search className="h-4 w-4 text-muted-foreground" />}
            className="w-[200px] md:w-[250px]"
          />

          <Button 
            variant="active" 
            onClick={handleAddService}
            iconLeft={<Plus className="h-4 w-4" />}
          >
            Crear Nuevo Servicio
          </Button>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-secondary border border-secondary/20 rounded-[8px] overflow-hidden min-h-[400px]">
          <ServicesTableAlianza
            services={paginatedServices}
            onEdit={handleEditService}
            onDelete={handleDeleteService}
          />
      </div>

      {/* Pagination */}
      <UserPagination
        currentPage={pagination.page}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pagination.limit}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

export default ServicesPage;
