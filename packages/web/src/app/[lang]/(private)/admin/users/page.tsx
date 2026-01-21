'use client';

import React, { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { useParams, useRouter } from 'next/navigation';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';

// Alianza Components (Atomic Design)
import { Heading } from '@/components/atoms-alianza/Typography';
import { UserStatsCard } from '@/components/atoms-alianza/UserStatsCard';
import { Button } from '@/components/molecules-alianza/Button';
import { InputGroup } from '@/components/molecules-alianza/InputGroup';
import { UserFilterButtons, type UserFilterType } from '@/components/molecules-alianza/UserFilterButtons';
import { UsersTableAlianza, type UserTableItem } from '@/components/organisms-alianza/UsersTableAlianza';
import { UsersTableSkeleton } from '@/components/organisms-alianza/UsersTableSkeleton';
import { UserPagination } from '@/components/molecules-alianza/UserPagination';



interface User {
  id: string;
  email: string;
  name: string | null;
  lastName: string | null;
  phone: string | null;
  role: string;
  createdAt: string;
  lastLogin: string | null;
}

interface UserFilters {
  search: string;
  role: string;
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const UsersPage = () => {
  const { lang } = useParams();
  const router = useRouter();
  
  // State
  const [activeFilter, setActiveFilter] = useState<UserFilterType>('all');
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    role: '',
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

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
    
    if (debouncedFilters.search) {
      params.search = debouncedFilters.search;
    }

    // Map filter to role
    switch (activeFilter) {
      case 'admin':
        params.role = 'ADMIN';
        break;
      case 'employee':
        params.role = 'EMPLOYEE';
        break;
      case 'client':
        params.role = 'CLIENT';
        break;
      case 'all':
      default:
        // No role filter = all users
        break;
    }

    return params;
  }, [debouncedFilters, activeFilter]);

  // Fetch users
  const {
    data: usersData,
    isLoading,
    isError,
    refetch,
  } = trpc.user.getFilteredUsers.useQuery(queryParams);

  // Fetch user stats using dedicated endpoint
  const { data: statsData } = trpc.user.getUserStats.useQuery();

  const stats = useMemo(() => {
    if (!statsData) {
      return { total: 0, admins: 0, employees: 0, clients: 0 };
    }
    return {
      total: statsData.total || 0,
      admins: statsData.byRole?.ADMIN || 0,
      employees: statsData.byRole?.EMPLOYEE || 0,
      clients: statsData.byRole?.CLIENT || 0,
    };
  }, [statsData]);

  // Mutations
  const bulkDeleteUsersMutation = trpc.user.bulkDeleteUsers.useMutation();

  // Handlers
  const handleFilterChange = (filter: UserFilterType) => {
    setActiveFilter(filter);
    setDebouncedFilters((prev) => ({ ...prev, page: 1 }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleAddUser = () => {
    router.push(`/${lang}/admin/users/create`);
  };

  const handleEditUser = (userId: string, email: string) => {
    router.push(`/${lang}/admin/users/${encodeURIComponent(email)}`);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await bulkDeleteUsersMutation.mutateAsync({ userIds: [userId] });
      toast.success('Usuario eliminado exitosamente');
      refetch();
    } catch (error) {
      toast.error('Error al eliminar usuario');
    }
  };

  const handlePageChange = (newPage: number) => {
    setDebouncedFilters((prev) => ({ ...prev, page: newPage }));
  };

  // Error state
  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-destructive">Error al cargar usuarios.</div>
      </div>
    );
  }

  const users: UserTableItem[] = (usersData?.users || []).map((user: any) => ({
    id: user.id,
    email: user.email,
    name: user.firstname || user.name,
    lastName: user.lastname || user.lastName,
    phone: user.phone || user.contactNumber,
    role: user.role,
  }));
  const pagination = usersData?.pagination;

  return (
    <div className="flex flex-col gap-[36px] p-6">
      {/* Page Title */}
      <Heading level={1} className="text-foreground">
        Usuarios
      </Heading>

      {/* Stats Cards */}
      <div className="flex gap-[42px] items-center overflow-x-auto pb-4 scrollbar-hide">
        <UserStatsCard 
          label="Total de Usuarios" 
          value={stats.total} 
          variant="default"
        />
        <UserStatsCard 
          label="Administradores" 
          value={stats.admins} 
          variant="accent"
        />
        <UserStatsCard 
          label="Employee" 
          value={stats.employees} 
          variant="accent"
        />
        <UserStatsCard 
          label="Clientes" 
          value={stats.clients} 
          variant="accent"
        />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Filter Buttons */}
        <UserFilterButtons
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />

        {/* Search + Create Button */}
        <div className="flex items-center gap-3">
          <InputGroup
            placeholder="Buscar usuarios..."
            value={searchValue}
            onChange={handleSearchChange}
            iconLeft={<Search className="h-4 w-4 text-muted-foreground" />}
            className="w-[200px] md:w-[250px]"
          />
          <Button 
            variant="active" 
            onClick={handleAddUser}
            iconLeft={<Plus className="h-4 w-4" />}
          >
            Crear nuevo usuario
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-secondary border border-secondary-foreground rounded-[8px] overflow-hidden">
        {isLoading ? (
          <UsersTableSkeleton rowCount={debouncedFilters.limit} />
        ) : (
          <UsersTableAlianza
            users={users}
            lang={lang as string}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
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
          onPageSizeChange={(size) => setDebouncedFilters(prev => ({ ...prev, limit: size, page: 1 }))}
        />
      )}
    </div>
  );
};

export default UsersPage;
